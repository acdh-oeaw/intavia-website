import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";

import { collections, user } from "@/config/zotero.config";

export interface ZoteroItem {
	data: {
		title: string;
		creators: Array<
			| {
					firstName: string;
					lastName: string;
			  }
			| {
					name: string;
			  }
		>;
		date?: string;
		place?: string;
		meetingName?: string;
		url?: string;
	};
	meta: {
		parsedDate?: string;
	};
}

export async function getZoteroCollections() {
	const items = [];

	for (const collection of collections) {
		const url = createUrl({
			baseUrl: "https://api.zotero.org",
			pathname: `/groups/${user}/collections/${collection.id}/items`,
			searchParams: createUrlSearchParams({
				itemType: "-attachment",
				include: "data",
			}),
		});

		const data = (await request(url, {
			headers: {
				"Zotero-API-Version": "3",
			},
			responseType: "json",
		})) as Array<ZoteroItem>;

		items.push({ id: collection.id, label: collection.label, data });
	}

	return items;
}
