import * as fs from "node:fs/promises";
import * as path from "node:path";

import { log } from "@acdh-oeaw/lib";

const imageExtension = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const textExtension = /\.(?:html|css|[cm]?js|json|svg|xml|txt|webmanifest)$/i;

function referencedImages(text: string, source: string): Set<string> {
	const references = new Set<string>();
	// Quoted URLs can contain spaces; tokens also cover srcset and unquoted CSS url().
	const quoted = Array.from(text.matchAll(/["'`]([^"'`<>\n]+)["'`]/g), (match) => match[1]);
	const tokens =
		text.match(
			/[^\s"'`<>()[\]{},;=]+\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#][^\s"'`<>()[\]{},;]*)?/gi,
		) ?? [];
	for (const value of [...quoted, ...tokens]) {
		if (!value) continue;
		const decoded = value.replaceAll("&amp;", "&").replaceAll("\\/", "/");
		let url: URL;
		try {
			url = new URL(decoded, `https://build.invalid/${source}`);
		} catch {
			continue;
		}
		if (url.origin !== "https://build.invalid") continue;
		let pathname: string;
		try {
			pathname = decodeURIComponent(url.pathname);
		} catch {
			continue;
		}
		if (!imageExtension.test(pathname)) continue;
		// Root-relative references can include the configured deployment base path.
		const generatedPath = pathname.match(/\/(?:_astro|assets\/content)\/.+$/)?.[0];
		references.add((generatedPath ?? pathname).replace(/^\//, ""));
	}
	return references;
}

/** Only remove build output; match full paths so identical filenames remain independent. */
export async function pruneAssets(directory: string): Promise<void> {
	const entries = await fs.readdir(directory, { recursive: true, withFileTypes: true });
	const files = entries
		.filter((entry) => entry.isFile())
		.map((entry) => path.join(entry.parentPath, entry.name));
	const references = new Set<string>();
	for (const file of files) {
		if (!textExtension.test(file)) continue;
		const source = path.relative(directory, file).split(path.sep).join("/");
		for (const reference of referencedImages(await fs.readFile(file, "utf8"), source)) {
			references.add(reference);
		}
	}
	let bytes = 0;
	let count = 0;
	for (const file of files) {
		const relative = path.relative(directory, file).split(path.sep).join("/");
		if (!relative.startsWith("assets/content/") && !relative.startsWith("_astro/")) continue;
		if (!imageExtension.test(file) || references.has(relative)) continue;
		bytes += (await fs.stat(file)).size;
		await fs.unlink(file);
		count++;
	}
	log.info(
		`Removed ${String(count)} unreferenced images (${(bytes / 1024 / 1024).toFixed(2)} MiB) from build output.`,
	);
}

if (import.meta.main) await pruneAssets(path.resolve("dist"));
