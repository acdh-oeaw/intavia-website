import { collection, fields } from "@keystatic/core";

import { createAssetPaths } from "@/lib/content/create-asset-paths";
import { createCollection } from "@/lib/content/create-collection";
import { createComponents, headingLevels } from "@/lib/content/create-components";
import { createCollectionPaths } from "@/lib/content/create-paths";
// import { createPreviewUrl } from "@/lib/content/create-preview-url";

export const activities = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/activities/", locale);

	return collection({
		label: "Activities",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/activities/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			startDate: fields.date({
				label: "Start date",
				validation: { isRequired: true },
			}),
			endDate: fields.date({
				label: "End date",
				// validation: { isRequired: false },
			}),
			image: fields.image({
				label: "Image",
				// validation: { isRequired: false },
				...createAssetPaths(assetPath),
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const caseStudies = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/case-studies/", locale);

	return collection({
		label: "Case studies",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/case-studies/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const conferenceProceedings = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/conference-proceedings/", locale);

	return collection({
		label: "Conference proceedings",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/conference-proceedings/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const deliverables = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/deliverables/", locale);

	return collection({
		label: "Deliverables",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/deliverables/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const newsletters = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/newsletters/", locale);

	return collection({
		label: "Newsletters",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/newsletters/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			image: fields.image({
				label: "Image",
				// validation: { isRequired: false },
				...createAssetPaths(assetPath),
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const pages = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/pages/", locale);

	return collection({
		label: "Pages",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			image: fields.image({
				label: "Image",
				// validation: { isRequired: false },
				...createAssetPaths(assetPath),
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});

export const partners = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/partners/", locale);

	return collection({
		label: "Partner institutions",
		path: contentPath,
		slugField: "name",
		format: { data: "json" },
		// previewUrl: createPreviewUrl("/partners/{slug}"),
		entryLayout: "form",
		schema: {
			name: fields.slug({
				name: {
					label: "Name",
					validation: { isRequired: true },
				},
			}),
			country: fields.text({
				label: "Country",
				validation: { isRequired: true },
			}),
			department: fields.text({
				label: "Department",
				// validation: { isRequired: false },
			}),
			website: fields.url({
				label: "Website",
				// validation: { isRequired: false },
			}),
			logo: fields.image({
				label: "Logo",
				validation: { isRequired: true },
				...createAssetPaths(assetPath),
			}),
			team: fields.array(
				fields.object(
					{
						name: fields.text({
							label: "Name",
							validation: { isRequired: true },
						}),
						image: fields.image({
							label: "Image",
							// validation: { isRequired: false },
							...createAssetPaths(assetPath),
						}),
						description: fields.text({
							label: "Description",
							// validation: { isRequired: false },
							multiline: true,
						}),
						website: fields.url({
							label: "Website",
							// validation: { isRequired: false },
						}),
					},
					{
						label: "Team member",
					},
				),
				{
					label: "Team",
					itemLabel(props) {
						return props.fields.name.value;
					},
					validation: { length: { min: 1 } },
				},
			),
		},
	});
});

export const tutorials = createCollection((locale) => {
	const { assetPath, contentPath } = createCollectionPaths("/tutorials/", locale);

	return collection({
		label: "Tutorials",
		path: contentPath,
		slugField: "title",
		format: { contentField: "content" },
		// previewUrl: createPreviewUrl("/tutorials/{slug}"),
		entryLayout: "content",
		columns: ["title"],
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			publicationDate: fields.date({
				label: "Publication date",
				validation: { isRequired: true },
				defaultValue: { kind: "today" },
			}),
			summary: fields.text({
				label: "Summary",
				validation: { isRequired: true },
				multiline: true,
			}),
			content: fields.mdx({
				label: "Content",
				options: {
					heading: headingLevels,
					image: createAssetPaths(assetPath),
				},
				components: createComponents(assetPath, locale),
			}),
		},
	});
});
