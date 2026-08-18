/* THIS FILE IS PART OF THE PAYLOAD ADMIN MOUNT — edit with care. */
import config from "@payload-config";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";

export const GET = GRAPHQL_PLAYGROUND_GET(config);
