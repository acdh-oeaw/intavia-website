import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const maxAge = 24 * 60 * 60 * 1000;

interface CacheEntry {
	url: string;
	fetchedAt: number;
	body: string;
}

interface Options {
	responseType: "json" | "text";
	headers?: Record<string, string>;
}

/** Cache only successful, validated responses. Expired content never masks an upstream failure. */
export async function requestRemoteContent(url: string | URL, options: Options): Promise<string> {
	const address = String(url);
	const key = createHash("sha256")
		.update(JSON.stringify([address, options]))
		.digest("hex");
	const cacheDirectory = join(process.cwd(), "node_modules/.astro/remote-content");
	const file = join(cacheDirectory, `${key}.json`);
	if (process.env.REMOTE_CONTENT_REFRESH !== "1") {
		try {
			const cached: CacheEntry = JSON.parse(await readFile(file, "utf8"));
			const age = Date.now() - cached.fetchedAt;
			if (cached.url === address && typeof cached.body === "string" && age >= 0 && age < maxAge) {
				if (options.responseType === "json") JSON.parse(cached.body);
				return cached.body;
			}
		} catch {
			// Missing or invalid cache entries are refetched.
		}
	}
	const response = await fetch(address, {
		headers: options.headers,
		signal: AbortSignal.timeout(20_000),
	});
	if (!response.ok) throw new Error(`Failed to fetch ${address}: HTTP ${String(response.status)}`);
	const body = await response.text();
	if (options.responseType === "json") JSON.parse(body);
	const entry: CacheEntry = { url: address, fetchedAt: Date.now(), body };
	await mkdir(cacheDirectory, { recursive: true });
	const temporary = `${file}.${randomUUID()}.tmp`;
	await writeFile(temporary, JSON.stringify(entry));
	await rename(temporary, file);
	return body;
}
