/** @typedef {import("mdast").Root} Root */
/** @typedef {import("mdast").FootnoteDefinition} FootnoteDefinition */
/** @typedef {import("mdast").FootnoteReference} FootnoteReference */
/** @typedef {import("mdast-util-mdx-jsx")} */

import { SKIP, visit } from "unist-util-visit";

export function withFootnotes() {
	return function transformer(/** @type {Root} */ tree) {
		let count = 1;

		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (node.name !== "Footnote") return undefined;

			/** Add prefix to avoid collisions with gfm footnotes in source mdx. */
			const id = `fn-${String(count)}`;

			/** @type {FootnoteReference} */
			const reference = {
				type: "footnoteReference",
				identifier: id,
				label: id,
			};

			/** @type {FootnoteDefinition} */
			const definition = {
				type: "footnoteDefinition",
				identifier: id,
				label: id,
				/** `<Footnote>` has phrasing/inline content as children, so we wrap them in a paragraph. */
				children: [
					{
						type: "paragraph",
						children: node.children,
					},
				],
			};

			// @ts-expect-error Parent node exists.
			parent.children.splice(index, 1, reference);

			tree.children.push(definition);

			count++;

			return SKIP;
		});
	};
}
