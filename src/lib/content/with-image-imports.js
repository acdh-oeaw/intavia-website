/** @typedef {import("estree").ImportDeclaration} ImportDeclaration */
/** @typedef {import("estree").Program} Program */
/** @typedef {import("hast").Root} Root */
/** @typedef {import("mdast-util-mdx-jsx")} */
/** @typedef {import("mdast-util-mdx-jsx").MdxJsxAttribute} MdxJsxAttribute */
/** @typedef {import("mdast-util-mdx-jsx").MdxJsxTextElementHast} MdxJsxTextElementHast */

import { join } from "node:path/posix";

import { assert } from "@acdh-oeaw/lib";
import { visit } from "unist-util-visit";

const publicPath = "/public/";

export function withImageImports() {
	return function transformer(/** @type {Root} */ tree) {
		/** @type {(src: unknown) => string | null} */
		function getImagePath(src) {
			if (typeof src !== "string") return null;
			if (src.startsWith("/")) return join(publicPath, src);
			if (src.startsWith("./")) return src;
			return null;
		}

		/** @type {Map<string, string>} */
		const imports = new Map();

		/** @type {(path: string) => string} */
		function getName(path) {
			if (!imports.has(path)) {
				imports.set(path, `__image${String(imports.size)}__`);
			}
			return /** @type {string} */ (imports.get(path));
		}

		visit(tree, (node, index, parent) => {
			if (node.type === "element" && node.tagName === "img") {
				const path = getImagePath(node.properties.src);
				if (path == null) return;

				const name = getName(path);

				/** @type {Array<MdxJsxAttribute>} */
				const attributes = [];

				attributes.push({
					type: "mdxJsxAttribute",
					name: "src",
					value: {
						type: "mdxJsxAttributeValueExpression",
						value: name,
						data: {
							estree: {
								type: "Program",
								sourceType: "module",
								body: [{ type: "ExpressionStatement", expression: { type: "Identifier", name } }],
							},
						},
					},
				});

				const alt = node.properties.alt;
				if (typeof alt === "string") {
					attributes.push({ type: "mdxJsxAttribute", name: "alt", value: alt });
				}

				const title = node.properties.title;
				if (typeof title === "string") {
					attributes.push({ type: "mdxJsxAttribute", name: "title", value: title });
				}

				/** @type {MdxJsxTextElementHast} */
				const img = { type: "mdxJsxTextElement", name: "img", children: [], attributes };

				assert(parent);

				parent.children.splice(/** @type {number} */ (index), 1, img);
			} else if (node.type === "mdxJsxFlowElement" && node.name === "Figure") {
				const attribute = node.attributes.find((attribute) => {
					return attribute.type === "mdxJsxAttribute" && attribute.name === "src";
				});
				const path = getImagePath(attribute?.value);
				if (path == null) return;

				const name = getName(path);

				assert(attribute);

				attribute.value = {
					type: "mdxJsxAttributeValueExpression",
					value: name,
					data: {
						estree: {
							type: "Program",
							sourceType: "module",
							body: [{ type: "ExpressionStatement", expression: { type: "Identifier", name } }],
						},
					},
				};
			}
		});

		if (imports.size > 0) {
			/** @type {Array<ImportDeclaration>} */
			const declarations = [];

			imports.forEach((name, path) => {
				declarations.push({
					type: "ImportDeclaration",
					specifiers: [{ type: "ImportDefaultSpecifier", local: { type: "Identifier", name } }],
					source: { type: "Literal", value: path },
				});
			});

			tree.children.unshift({
				type: "mdxjsEsm",
				value: "",
				data: { estree: { type: "Program", sourceType: "module", body: declarations } },
			});
		}
	};
}
