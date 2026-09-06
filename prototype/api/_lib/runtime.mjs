// Builds one reusable hosted-keepsake service from server-only runtime configuration.
import { createBlobAdapter } from "./blob.mjs";
import { readRuntimeConfig } from "./config.mjs";
import { createHostedKeepsakeService } from "./service.mjs";
import { createTursoAdapter } from "./turso.mjs";

let service;

export function getRuntimeService() {
  if (service) return service;
  const config = readRuntimeConfig();
  service = createHostedKeepsakeService({
    db: createTursoAdapter(config),
    blob: createBlobAdapter({ credentials: config.blobCredentials }),
    presenterKey: config.presenterKey,
  });
  return service;
}
