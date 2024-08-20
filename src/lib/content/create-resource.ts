import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { assert } from "@acdh-oeaw/lib";

import type { Locale } from "@/config/i18n.config";
import { createReader } from "@/lib/content/create-reader";
import { getMdxContent } from "@/lib/content/get-mdx-content";
import type config from "~/keystatic.config";

export function createResource<T extends keyof typeof config.collections>(name: T, locale: Locale) {
	const reader = createReader();

	const collectionReader = reader.collections[name];
	const collectionConfig = reader.config.collections[name];

	assert(collectionConfig.path);

	function baseUrl(id: string) {
		return pathToFileURL(join(process.cwd(), collectionConfig.path!.replace(/\*+/, id)));
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
