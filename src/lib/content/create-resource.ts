import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { assert } from "@acdh-oeaw/lib";

import type { Locale } from "@/config/i18n.config";
import { createReader } from "@/lib/content/create-reader";
import { getMdxContent } from "@/lib/content/get-mdx-content";
import type config from "~/keystatic.config";

export function createCollectionResource<T extends keyof typeof config.collections>(
	name: T,
	locale: Locale,
) {
	const reader = createReader();

	const collectionReader = reader.collections[name];
	const collectionConfig = reader.config.collections[name];

	const contentPath = collectionConfig.path;
	assert(contentPath);

	function baseUrl(id: string) {
		assert(contentPath);
		return pathToFileURL(join(process.cwd(), contentPath.replace(/\*+/, id)));
	}

	function compile(id: string, code: string) {
		return getMdxContent(code, locale, baseUrl(id));
	}

	function list() {
		return collectionReader.list();
	}

	async function read(id: string) {
		const data = await collectionReader.readOrThrow(id, { resolveLinkedFiles: true });

		return {
			id,
			data,
			compile(code: string) {
				return compile(id, code);
			},
		};
	}

	async function all() {
		const ids = await list();

		return Promise.all(ids.map(read));
	}

	return {
		all,
		baseUrl,
		compile,
		list,
		read,
	};
}

export function createSingletonResource<T extends keyof typeof config.singletons>(
	name: T,
	locale: Locale,
) {
	const reader = createReader();

	const singletonReader = reader.singletons[name];
	const singletonConfig = reader.config.singletons[name];

	const contentPath = singletonConfig.path;
	assert(contentPath);

	function baseUrl() {
		assert(contentPath);
		return pathToFileURL(join(process.cwd(), contentPath));
	}

	function compile(code: string) {
		return getMdxContent(code, locale, baseUrl());
	}

	async function read() {
		const data = await singletonReader.readOrThrow({ resolveLinkedFiles: true });

		return {
			data,
			compile,
		};
	}

	return {
		baseUrl,
		compile,
		read,
	};
}
