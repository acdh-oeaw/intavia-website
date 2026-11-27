import { join } from "node:path";

import { assert } from "@acdh-oeaw/lib";
import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
	"/public/assets/**/*.{avif,bmp,gif,jpeg,jpg,png,svg,webp}",
);

export function getImageImport(path: string) {
	assert(path.startsWith("/"), "Expected a local image path.");

	const publicPath = join("/public", decodeURIComponent(path));
	const image = images[publicPath];
	assert(image, `Missing image "${publicPath}".`);

	return image();
}
