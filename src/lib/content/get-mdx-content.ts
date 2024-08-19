import { run } from "@mdx-js/mdx";
import * as runtime from "astro/jsx-runtime";
import type { MDXModule } from "mdx/types";

import type { Locale } from "@/config/i18n.config";
import { useMDXComponents } from "@/lib/content/components";
import { createMdxProcessor } from "@/lib/content/create-mdx-processor";
import type { Toc } from "@/lib/content/with-table-of-contents";

interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
	/** Added by `@/lib/content/with-table-of-contents`. */
	tableOfContents: Toc;
}

export async function getMdxContent<T extends Record<string, unknown>>(
	code: string,
	locale: Locale,
	baseUrl: URL,
): Promise<MdxContent<T>> {
	const processor = await createMdxProcessor(locale);
	const file = await processor.process(code);

	// @ts-expect-error Upstream type issue.
	return run(file, { ...runtime, baseUrl, useMDXComponents });
}
