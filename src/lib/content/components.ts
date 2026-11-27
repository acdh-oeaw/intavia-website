import Figure from "@/components/content/figure.astro";
import Grid from "@/components/content/grid.astro";
import GridItem from "@/components/content/grid-item.astro";
import Img from "@/components/content/img.astro";
import Video from "@/components/content/video.astro";
import Link from "@/components/link.astro";

const components = {
	a: Link,
	Figure,
	Grid,
	GridItem,
	img: Img,
	Video,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
