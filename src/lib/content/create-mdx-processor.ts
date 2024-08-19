import {
	createFormatAwareProcessors,
	type FormatAwareProcessors,
} from "@mdx-js/mdx/internal-create-format-aware-processors";

import type { Locale } from "@/config/i18n.config";
import { createMdxConfig } from "@/config/mdx.config";

const cache = new Map<Locale, FormatAwareProcessors>();

export async function createMdxProcessor(locale: Locale) {
	if (cache.has(locale)) return cache.get(locale)!;

	const config = await createMdxConfig(locale);
	const processor = createFormatAwareProcessors({
		...config,
		elementAttributeNameCase: "html",
		format: "mdx",
		outputFormat: "function-body",
		providerImportSource: "#",
	});

	cache.set(locale, processor);

	return processor;
}
