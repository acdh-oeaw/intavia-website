import type { Root } from "hast";
import type { VFile } from "vfile";

interface Heading {
	value: string;
	depth: number;
	id?: string;
}

interface TocEntry extends Heading {
	children?: Array<TocEntry>;
}

export type Toc = Array<TocEntry>;

declare module "vfile" {
	interface DataMap {
		toc: Toc;
	}
}
export declare function withTableOfContents(): (tree: Root, vfile: VFile) => unknown;
export declare function withMdxTableOfContents(): (tree: Root, vfile: VFile) => unknown;
