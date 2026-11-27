import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { requestRemoteContent } from "../src/lib/request-remote-content.ts";

await test("remote content caches successes, expires, validates JSON, and allows explicit refresh", async (t) => {
	const directory = await mkdtemp(join(tmpdir(), "intavia-remote-"));
	const previousDirectory = process.cwd();
	const previousRefresh = process.env.REMOTE_CONTENT_REFRESH;
	let now = Date.now();
	let count = 0;
	let status = 200;
	let body = '{"title":"first"}';
	t.mock.method(Date, "now", () => now);
	t.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => {
		assert(options.signal instanceof AbortSignal);
		count++;
		return new Response(body, { status });
	});
	try {
		process.chdir(directory);
		delete process.env.REMOTE_CONTENT_REFRESH;
		const url = "https://example.invalid/content";
		const options = { responseType: "json" as const };
		assert.equal(await requestRemoteContent(url, options), body);
		body = '{"title":"updated"}';
		assert.equal(await requestRemoteContent(url, options), '{"title":"first"}');
		assert.equal(count, 1);

		now += 24 * 60 * 60 * 1000;
		status = 503;
		await assert.rejects(requestRemoteContent(url, options), /HTTP 503/);
		assert.equal(count, 2);
		status = 200;
		assert.equal(await requestRemoteContent(url, options), body);
		assert.equal(count, 3);

		process.env.REMOTE_CONTENT_REFRESH = "1";
		body = '{"title":"refreshed"}';
		assert.equal(await requestRemoteContent(url, options), body);
		assert.equal(count, 4);
		delete process.env.REMOTE_CONTENT_REFRESH;
		assert.equal(await requestRemoteContent(url, options), body);
		assert.equal(count, 4);

		body = "invalid json";
		await assert.rejects(requestRemoteContent(url + "/json", options), SyntaxError);
		body = '{"valid":true}';
		assert.equal(await requestRemoteContent(url + "/json", options), body);
		assert.equal(count, 6);
	} finally {
		process.chdir(previousDirectory);
		if (previousRefresh === undefined) delete process.env.REMOTE_CONTENT_REFRESH;
		else process.env.REMOTE_CONTENT_REFRESH = previousRefresh;
		await rm(directory, { recursive: true, force: true });
	}
});
