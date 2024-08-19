import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { assert } from "@acdh-oeaw/lib";
import type { Collection, ComponentSchema } from "@keystatic/core";

export function getBaseUrl<
	Schema extends Record<string, ComponentSchema>,
	SlugField extends string,
>(collection: Collection<Schema, SlugField>, id: string) {
	assert(collection.path);

	return pathToFileURL(join(process.cwd(), collection.path.replace(/\*+/, id)));
}
