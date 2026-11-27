import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { loadEnv } from "vite";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

export default defineConfig({
	base: env.PUBLIC_APP_BASE_PATH,
	integrations: [
		icon({
			/** @see https://www.astroicon.dev/reference/configuration/#include */
			include: {
				lucide: [
					"chevron-down",
					"chevron-left",
					"chevron-right",
					"circle-play",
					"circle-pause",
					"menu",
					"message-circle",
					"search",
					"square-arrow-left",
					"x",
				],
			},
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: "preset-default",
						params: {
							overrides: {
								removeViewBox: false,
							},
						},
					},
				],
			},
		}),
		...(process.env.NODE_ENV === "development" ? [react(), keystatic()] : []),
		mdx(),
		sitemap(),
	],
	output: "static",
	prefetch: {
		defaultStrategy: "hover",
		prefetchAll: true,
	},
	redirects: {
		...(process.env.NODE_ENV === "development" ? { "/admin": "/keystatic" } : {}),
		"/idm-core": {
			destination:
				"https://raw.githubusercontent.com/InTaVia/idm-rdf/refs/heads/main/idm-OWL/intavia_idm1.1.ttl",
			status: 302,
		},
	},
	scopedStyleStrategy: "where",
	security: {
		checkOrigin: true,
	},
	server: {
		port: 3000,
	},
	site: env.PUBLIC_APP_BASE_URL,
	vite: { plugins: [tailwindcss()] },
});
