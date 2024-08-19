import type { Entry } from "@keystatic/core/reader";

import type config from "~/keystatic.config";

export type IndexPage = Entry<(typeof config)["singletons"]["indexPage"]>;

export type Metadata = Entry<(typeof config)["singletons"]["metadata"]>;

export type Navigation = Entry<(typeof config)["singletons"]["navigation"]>;

export type Activity = Entry<(typeof config)["collections"]["activities"]>;

export type CaseStudy = Entry<(typeof config)["collections"]["caseStudies"]>;

export type ConferenceProceeding = Entry<(typeof config)["collections"]["conferenceProceedings"]>;

export type Deliverable = Entry<(typeof config)["collections"]["deliverables"]>;

export type Newsletter = Entry<(typeof config)["collections"]["newsletters"]>;

export type Page = Entry<(typeof config)["collections"]["pages"]>;

export type Partner = Entry<(typeof config)["collections"]["partners"]>;

export type Tutorial = Entry<(typeof config)["collections"]["tutorials"]>;
