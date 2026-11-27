import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { pruneAssets } from "./prune-assets.ts";

await test("prunes unused generated images while preserving references and downloads", async () => {
	const directory = await mkdtemp(join(tmpdir(), "intavia-assets-"));
	try {
		const files = {
			"index.html":
				'<img srcset="/base/_astro/hero.webp 480w"><a href="/assets/content/manual.pdf">PDF</a>',
			"_astro/styles.css":
				'body { background: url("../assets/content/with%20space.png"); mask: url(css-only.webp); }',
			"_astro/hero.webp": "hero",
			"_astro/unused.webp": "unused",
			"assets/content/with space.png": "referenced",
			"assets/content/unused.png": "unused",
			"assets/content/a/image.png": "referenced",
			"assets/content/b/image.png": "unused",
			"assets/content/linked file.png": "downloaded image",
			"_astro/shared.png": "unused",
			"_astro/query.webp": "query",
			"_astro/css-only.webp": "css image",
			"_astro/manifest-only.png": "manifest",
			"manifest.webmanifest": '{"icons":[{"src":"/_astro/manifest-only.png"}]}',
			"_astro/script.js": 'const image = "/_astro/query.webp?v=1#preview";',
			"nested/index.html":
				'<img src="../assets/content/a/image.png"><a href="/base/assets/content/linked%20file.png">download</a><img src="https://external.example/_astro/shared.png">',
			"assets/content/manual.pdf": "download",
			"assets/images/logo.svg": "public image",
		};
		for (const [name, content] of Object.entries(files)) {
			await mkdir(join(directory, name, ".."), { recursive: true });
			await writeFile(join(directory, name), content);
		}
		await pruneAssets(directory);
		for (const [name, content] of Object.entries(files)) {
			if (content === "unused") {
				await assert.rejects(readFile(join(directory, name)), { code: "ENOENT" });
			} else {
				assert.equal(await readFile(join(directory, name), "utf8"), content);
			}
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
