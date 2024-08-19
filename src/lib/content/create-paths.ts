import type { Locale } from "@/config/i18n.config";

export function createCollectionPaths<T extends `/${string}/`>(path: T, locale: Locale) {
	return {
		assetPath: `/content/${locale}${path}`,
		contentPath: `./content/${locale}${path}*/`,
	} as const;
}

export function createSingletonPaths<T extends `/${string}/`>(path: T, locale: Locale) {
	return {
		assetPath: `/content/${locale}${path}`,
		contentPath: `./content/${locale}${path}`,
	} as const;
}
