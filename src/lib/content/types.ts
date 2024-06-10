import type { Entry } from "@keystatic/core/reader";

import type config from "~/keystatic.config";

export type IndexPage = Entry<(typeof config)["singletons"]["en_indexPage"]>;

export type Metadata = Entry<(typeof config)["singletons"]["en_metadata"]>;

export type Navigation = Entry<(typeof config)["singletons"]["en_navigation"]>;

export type Page = Entry<(typeof config)["collections"]["en_pages"]>;
