import { createApiClient } from "@/lib/api-client";
import { requireEnv } from "@/lib/utils/require-env";

export const api = createApiClient({
  baseUrl: requireEnv("API_URL"),
});
