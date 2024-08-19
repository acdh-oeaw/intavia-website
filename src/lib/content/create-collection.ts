import type { Collection, ComponentSchema } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";

export function createCollection<
	Schema extends Record<string, ComponentSchema>,
	SlugField extends string,
>(factory: (locale: Locale) => Collection<Schema, SlugField>) {
	return function createLocalisedCollection(locale: Locale) {
		return factory(locale);
	};
}
