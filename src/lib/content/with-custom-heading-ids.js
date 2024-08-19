/** @typedef {import("hast").Root} Root */
/** @typedef {import("mdast-util-mdx-jsx")} */

import { assert } from "@acdh-oeaw/lib";
import { heading as isHeadingElement } from "hast-util-heading";
import { SKIP, visit } from "unist-util-visit";

export function withCustomHeadingIds() {
	return function transformer(/** @type {Root} */ tree) {
		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (node.name !== "HeadingId") return undefined;

			assert(
				isHeadingElement(parent),
				"`<HeadingId>` must be a direct child of a heading element.",
			);

			const id = node.attributes.find((attribute) => {
				return attribute.type === "mdxJsxAttribute" && attribute.name === "id";
			})?.value;

			assert(id, "`<HeadingId>` has no `id` prop.");

			if (parent.properties.id == null) {
				parent.properties.id = String(id);
			}

			parent.children.splice(/** @type {number} */ (index), 1);

			return SKIP;
		});
	};
}
