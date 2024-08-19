import type { ComponentSchema, Singleton } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";

export function createSingleton<Schema extends Record<string, ComponentSchema>>(
	factory: (locale: Locale) => Singleton<Schema>,
) {
	return function createLocalisedSingleton(locale: Locale) {
		return factory(locale);
	};
}
