import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@acdh-oeaw/validate-env/astro";
import * as v from "valibot";

const environment = import.meta.env.SSR
	? Object.assign({}, process.env, import.meta.env)
	: import.meta.env;

export const env = createEnv({
	environment,
	system(input) {
		const Schema = v.object({
			NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
		});
		return v.parse(Schema, input);
	},
	private(input) {
		const Schema = v.object({});
		return v.parse(Schema, input);
	},
	public(input) {
		const Schema = v.object({
			PUBLIC_APP_BASE_PATH: v.optional(v.pipe(v.string(), v.nonEmpty())),
			PUBLIC_APP_BASE_URL: v.pipe(v.string(), v.url()),
			PUBLIC_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
			PUBLIC_GOOGLE_SITE_VERIFICATION: v.optional(v.string()),
			PUBLIC_MATOMO_BASE_URL: v.optional(v.pipe(v.string(), v.url())),
			PUBLIC_MATOMO_ID: v.optional(
				v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
			),
			PUBLIC_REDMINE_ID: v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(1),
			),
		});
		return v.parse(Schema, input);
	},
	validation: v.parse(
		v.optional(v.picklist(["disabled", "enabled", "public"]), "enabled"),
		environment.ENV_VALIDATION,
	),
	onError(error) {
		if (error instanceof v.ValiError) {
			const message = "Invalid environment variables";

			log.error(`${message}:`, v.flatten(error.issues).nested);

			const validationError = new Error(message);
			delete validationError.stack;

			throw validationError;
		}

		throw error;
	},
});
