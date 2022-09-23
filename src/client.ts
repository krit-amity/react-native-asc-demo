import {
  API_REGIONS,
  createClient,
  enableCache,
} from "@amityco/ts-sdk";

export const client = createClient("b0eee8083cd3a63049638d4f565a168884008cb4ec323d7e", API_REGIONS.SG);
enableCache()
