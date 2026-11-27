# intavia website

website for the InTaVia project.

## how to run

prerequisites:

- [node.js 26.x](https://nodejs.org/en/download)
- [pnpm 12.x](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 26 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

adjust environment variables in `.github/workflows/validate.yaml` and
`.github/workflows/build-deploy.yaml`.

the default template accepts the following variables:

- `PUBLIC_REDMINE_ID` (required): service issue for this application in the acdh-ch
  [redmine](https://redmine.acdh.oeaw.ac.at) issue tracker.
- `PUBLIC_APP_BASE_URL` (required): the base url for this application. the default of
  "http://localhost:3000" should be fine for local development.
- `PUBLIC_APP_BASE_PATH` (optional): set this when deploying to a path other than "/".
- `PUBLIC_BOTS` (required): whether this website can be indexed by web crawlers like the google bot.
  supported values are "disabled" and "enabled", defaults to "disabled".
- `PUBLIC_MATOMO_BASE_URL` and `PUBLIC_MATOMO_ID` (optional): set these to support client-side
  analytics with matomo.
- `PUBLIC_GOOGLE_SITE_VERIFICATION` (optional): set this to verify site ownership for google search
  console.
- `ENV_VALIDATION` (optional): whether environment variables should be validated. supported values
  are "disabled", "enabled" and "public" (only validate public variables, which can be useful in a
  docker build context to avoid having to pass secrets to `docker build`), defaults to "enabled".

when adding new environment variables, don't forget to add them to `.env.local.example` as well.

install dependencies:

```bash
pnpm install
```

run a development server on <http://localhost:3000>:

```bash
pnpm run dev
```

> [!TIP]
>
> this template supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## how to edit content

Run `pnpm dev` and open <http://localhost:3000/admin> to edit content with Keystatic. Changes are
saved to the local filesystem; commit them to Git to deploy. The editor, its API, and the admin
redirect are enabled only in development and are absent from production builds.

## how to deploy

- ask a sysadmin to create a new acdh-ch kubernetes project.
- create a new namespace in that project via [rancher](https://rancher.acdh-dev.oeaw.ac.at), and set
  the `KUBE_NAMESPACE` github variable to that namespace.
- adjust the [`app_name`](./.github/workflows/build-deploy.yaml#L36), which will be the name of the
  deployment in the above namespace.
- set the `PUBLIC_URL` github variable to the application's public url (e.g.
  "https://my-app.acdh-ch-dev.oeaw.ac.at"), and set the `KUBE_INGRESS_BASE_DOMAIN` to the public
  url's base domain (e.g. "acdh-ch-dev.oeaw.ac.at"). `PUBLIC_URL` should match
  `PUBLIC_APP_BASE_URL`.
- if you haven't yet, create a service issue in the acdh-ch
  [redmine](https://redmine.acdh.oeaw.ac.at) issue tracker, and set the `SERVICE_ID` github variable
  to the issue number. this should match the `PUBLIC_REDMINE_ID` variable in your `.env.local` file.
- ensure required build args (prefixed with `PUBLIC_`) are referenced in both the
  [`Dockerfile`](./Dockerfile), as well as the [validation](./.github/workflows/validate.yaml) and
  [deployment](./.github/workflows/build-deploy.yaml) pipelines, and set as github variables.
- ensure both the github repository, as well as the
  [package registry](https://github.com/orgs/acdh-oeaw/packages/container/my-app/settings) is set to
  public.

if everything is set up correctly, every git push to the `main` branch will create a new deployment
if the validation pipeline passes.

you can reference the [template repository](https://github.com/acdh-oeaw/template-website-astro) for
a working setup.

## static production build

`pnpm build` generates the website in `dist/`, removes unreferenced generated content images, and
builds the Pagefind search index. Original content files remain unchanged. Linked downloads and
public branding assets are retained. Images use Astro/Sharp optimization, with responsive variants
for banners, carousel slides, and article images, and appropriately sized logos.

`Dockerfile` builds a static Caddy image on port 3000 as user `10001`. Node and build dependencies
stay in the build stage. `Caddyfile` preserves linked-data and IDM redirects, serves the custom 404
page with a 404 status, compresses responses, and caches fingerprinted Astro assets for one year.
`PUBLIC_APP_BASE_PATH`, if set, is baked into both the site and Caddy.

The Docker context uses an allowlist of application inputs, the pruning script, and reusable
image/font/remote-content caches. Dependencies are installed before copying sources, so content
edits reuse the install layer. CI exports the updated `astro-cache` Docker target and restores it
for subsequent builds. Dependency scripts run before sources are copied. No Keystatic secrets or
runtime environment variables are required.

Build locally with the same required public variables as `.env.local` (Docker does not copy it):

```bash
docker build --build-arg PUBLIC_APP_BASE_URL=https://www.intavia.eu \
  --build-arg PUBLIC_REDMINE_ID=18284 -t intavia-website .
docker run --rm -p 3000:3000 intavia-website
```

## development tooling

Use `pnpm format:check` / `pnpm format:fix` for oxfmt, `pnpm lint:check` for oxlint and Stylelint,
and `pnpm types:check` for Astro and TypeScript diagnostics. `pnpm test` checks asset pruning;
`pnpm test:e2e` runs Playwright against a production build. Lefthook runs staged-file linting and
formatting before commits. Tailwind 4 is configured in `src/styles/index.css` and uses the Vite
integration. VS Code and devcontainer recommendations use the Oxc extension.

## external content and build caching

Imprint and Zotero responses are cached in `node_modules/.astro/remote-content/` for 24 hours.
Requests time out after 20 seconds, and Zotero collections are fetched concurrently. Only successful
responses are cached; invalid JSON is rejected, and expired content does not hide an upstream error.
The cache is reused by CI/Docker and stays out of the runtime image.

Run `pnpm refresh:remote-content` to bypass the cache and build with fresh external content.
Deleting `node_modules/.astro/remote-content/` also forces fresh requests on the next build.
