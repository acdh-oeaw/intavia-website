import { config } from "@keystatic/core";

import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import {
	activities,
	caseStudies,
	conferenceProceedings,
	deliverables,
	newsletters,
	pages,
	partners,
	tutorials,
} from "@/lib/content/collections";
import { indexPage, metadata, navigation } from "@/lib/content/singletons";

export default config({
	collections: {
		activities: activities(defaultLocale),
		caseStudies: caseStudies(defaultLocale),
		conferenceProceedings: conferenceProceedings(defaultLocale),
		deliverables: deliverables(defaultLocale),
		newsletters: newsletters(defaultLocale),
		pages: pages(defaultLocale),
		partners: partners(defaultLocale),
		tutorials: tutorials(defaultLocale),
	},
	singletons: {
		indexPage: indexPage(defaultLocale),
		metadata: metadata(defaultLocale),
		navigation: navigation(defaultLocale),
	},
	storage:
		env.PUBLIC_KEYSTATIC_MODE === "github" &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			name: "InTaVia",
		},
		navigation: {
			data: [
				"activities",
				"caseStudies",
				"conferenceProceedings",
				"deliverables",
				"newsletters",
				"partners",
				"tutorials",
			],
			pages: ["indexPage", "pages"],
			settings: ["metadata", "navigation"],
		},
	},
});
