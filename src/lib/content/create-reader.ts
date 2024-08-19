import { createReader as createLocalReader } from "@keystatic/core/reader";

import config from "~/keystatic.config";

export const createReader = function createReader() {
	const reader = createLocalReader(process.cwd(), config);

	return reader;
};
