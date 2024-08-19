import { env } from "@/config/env.config";

export function createPreviewUrl(previewUrl: string): string {
	if (env.PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
