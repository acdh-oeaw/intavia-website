import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";

import { collections, user } from "@/config/zotero.config";

interface ZoteroItem {
	bib: string;
}

export async function getZoteroCollections() {
	const items = [];

	for (const collection of collections) {
		const url = createUrl({
			baseUrl: "https://api.zotero.org",
			pathname: `/groups/${user}/collections/${collection.id}/items`,
			searchParams: createUrlSearchParams({
				itemType: "-attachment",
				/** @see https://www.zotero.org/support/dev/web_api/v3/basics?parameters_for_format_bib_includecontent_bib_includecontent_citation */
				include: "bib",
				linkwrap: 1,
				style: "apa",
			}),
		});

		const data = (await request(url, {
			headers: {
				"Zotero-API-Version": "3",
			},
			responseType: "json",
			timeout: 20_000,
		})) as Array<ZoteroItem>;

		items.push({ id: collection.id, label: collection.label, data });
	}

	return items;
}
