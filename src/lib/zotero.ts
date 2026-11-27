import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { collections, user } from "@/config/zotero.config";
import { requestRemoteContent } from "@/lib/request-remote-content";

interface ZoteroItem {
	bib: string;
}

export async function getZoteroCollections() {
	return Promise.all(
		collections.map(async (collection) => {
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

			const data = JSON.parse(
				await requestRemoteContent(String(url), {
					headers: {
						"Zotero-API-Version": "3",
					},
					responseType: "json",
				}),
			) as Array<ZoteroItem>;

			return { id: collection.id, label: collection.label, data };
		}),
	);
}
