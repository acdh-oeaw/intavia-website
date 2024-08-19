/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import Callout from "@/components/content/callout.astro";
// import DownloadLink from "@/components/content/download-link.astro";
import Figure from "@/components/content/figure.astro";
// import FootnoteContent from "@/components/content/footnote-content.astro";
// import FootnoteReference from "@/components/content/footnote-reference.astro";
// import FootnotesSection from "@/components/content/footnote-section.astro";
import Grid from "@/components/content/grid.astro";
import GridItem from "@/components/content/grid-item.astro";
import Img from "@/components/content/img.astro";
// import InternalLink from "@/components/content/internal-link.astro";
// import LinkButton from "@/components/content/link-button.astro";
// import Tab from "@/components/content/tab.astro";
// import TableOfContents from "@/components/content/table-of-contents.astro";
// import Tabs from "@/components/content/tabs.astro";
// import Thumbnail from "@/components/content/thumbnail.astro";
// import Tweet from "@/components/content/tweet.astro";
import Video from "@/components/content/video.astro";
import Link from "@/components/link.astro";

const components = {
	a: Link,
	// Callout,
	// Card,
	// Disclosure,
	// DownloadLink,
	// Embed,
	Figure,
	// FootnoteContent,
	// FootnoteReference,
	// FootnotesSection,
	Grid,
	GridItem,
	img: Img,
	// LinkButton,
	// InternalLink,
	// Tab,
	// TableOfContents,
	// Tabs,
	// Thumbnail,
	// Tweet,
	Video,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
