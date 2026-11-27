# syntax=docker/dockerfile:1
FROM node:26-alpine AS build
RUN npm install --global pnpm@12.23.0
RUN mkdir /app && chown node:node /app
WORKDIR /app
USER node
ENV CI=true PNPM_CONFIG_RUNTIME=false
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile --offline --ignore-scripts
# Build dependency scripts before copying content; defer the project Git hook setup in CI.
RUN pnpm rebuild --pending
COPY --chown=node:node --exclude=Caddyfile ./ ./
ARG PUBLIC_APP_BASE_PATH
ARG PUBLIC_APP_BASE_URL
ARG PUBLIC_BOTS
ARG PUBLIC_GOOGLE_SITE_VERIFICATION
ARG PUBLIC_MATOMO_BASE_URL
ARG PUBLIC_MATOMO_ID
ARG PUBLIC_REDMINE_ID
ENV ENV_VALIDATION=public NODE_ENV=production
RUN pnpm run build && mkdir -p node_modules/.astro/assets node_modules/.astro/fonts node_modules/.astro/remote-content

FROM scratch AS astro-cache
COPY --from=build /app/node_modules/.astro/assets /assets
COPY --from=build /app/node_modules/.astro/fonts /fonts
COPY --from=build /app/node_modules/.astro/remote-content /remote-content

FROM caddy:2-alpine AS serve
RUN addgroup -S -g 10001 caddy && adduser -S -D -H -u 10001 -G caddy caddy \
    && chown -R caddy:caddy /config /data
WORKDIR /usr/share/caddy
ARG PUBLIC_APP_BASE_PATH
ENV APP_BASE_PATH=${PUBLIC_APP_BASE_PATH}
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy
USER 10001:10001
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
EXPOSE 3000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
