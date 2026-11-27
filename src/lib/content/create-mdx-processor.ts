import { createProcessor } from "@mdx-js/mdx";

import type { Locale } from "@/config/i18n.config";
import { createMdxConfig } from "@/config/mdx.config";

const cache = new Map<Locale, ReturnType<typeof createProcessor>>();

export async function createMdxProcessor(locale: Locale) {
	const cached = cache.get(locale);
	if (cached) return cached;

	const config = await createMdxConfig(locale);
	const processor = createProcessor({
		...config,
		elementAttributeNameCase: "html",
		format: "mdx",
		outputFormat: "function-body",
		providerImportSource: "#",
	});

	cache.set(locale, processor);

	return processor;
}
