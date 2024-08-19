/** @typedef {import("hast").Root} Root */
/** @typedef {import("mdast-util-mdx-jsx")} */
/** @typedef {import("vfile").VFile} VFile */

/** @typedef {import("@/lib/content/with-table-of-contents").Heading} Heading */
/** @typedef {import("@/lib/content/with-table-of-contents").TocEntry} TocEntry */
/** @typedef {import("@/lib/content/with-table-of-contents").Toc} Toc */

import { valueToEstree } from "estree-util-value-to-estree";
import { headingRank as rank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

export function withTableOfContents() {
	return function transformer(/** @type {Root} */ tree, /** @type {VFile} */ vfile) {
		/** @type {Array<Heading>} */
		const headings = [];

		visit(tree, "element", (element) => {
			const level = rank(element);

			if (level != null) {
				/** @type {Heading} */
				const heading = {
					depth: level,
					value: toString(element),
				};

				if (element.properties.id != null) {
					heading.id = /** @type {string} */ (element.properties.id);
				}

				headings.push(heading);
			}
		});

		vfile.data.toc = createTree(headings);

		function createTree(/** @type {Array<Heading>} */ headings) {
			/** @type {TocEntry} */
			const root = { depth: 0, children: [], value: "" };
			/** @type {Array<TocEntry>} */
			const parents = [];
			/** @type {TocEntry} */
			let previous = root;

			headings.forEach((heading) => {
				if (heading.depth > previous.depth) {
					previous.children ??= [];
					parents.push(previous);
				} else if (heading.depth < previous.depth) {
					while (/** @type {TocEntry} */ (parents.at(-1)).depth >= heading.depth) {
						parents.pop();
					}
				}

				const parent = /** @type {TocEntry} */ (parents.at(-1));
				const children = /** @type {TocEntry[]} */ (parent.children);
				children.push(heading);
				previous = heading;
			});

			return root.children;
		}
	};
}

export function withMdxTableOfContents() {
	const name = "tableOfContents";

	return function transformer(/** @type {Root} */ tree, /** @type {VFile} */ vfile) {
		if (vfile.data.toc == null) return;

		tree.children.unshift({
			type: "mdxjsEsm",
			value: `export const ${name} = ${JSON.stringify(vfile.data.toc)};`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExportNamedDeclaration",
							source: null,
							specifiers: [],
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name },
										init: valueToEstree(vfile.data.toc),
									},
								],
							},
						},
					],
				},
			},
		});

		// visit(tree, "mdxJsxFlowElement", (node) => {
		// 	if (node.name !== "TableOfContents") return;

		// 	node.attributes.push({
		// 		type: "mdxJsxAttribute",
		// 		name: "tableOfContents",
		// 		value: {
		// 			type: "mdxJsxAttributeValueExpression",
		// 			value: "tableOfContents",
		// 			data: {
		// 				estree: {
		// 					type: "Program",
		// 					sourceType: "module",
		// 					body: [
		// 						{
		// 							type: "ExpressionStatement",
		// 							expression: {
		// 								type: "Identifier",
		// 								name,
		// 							},
		// 						},
		// 					],
		// 				},
		// 			},
		// 		},
		// 	});
		// });
	};
}
