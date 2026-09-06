// Loads only server-side hosted-keepsake credentials and fails closed when a required provider is unavailable.
import { HostedServiceError } from "./errors.mjs";

export function readRuntimeConfig(environment = process.env, { requirePresenter = false } = {}) {
  const databaseUrl = environment.TURSO_DATABASE_URL;
  const databaseToken = environment.TURSO_AUTH_TOKEN;
  const presenterKey = environment.PUBLISHER_KEY;
  const hasBlobToken = Boolean(environment.BLOB_READ_WRITE_TOKEN);
  const hasBlobOidc = Boolean(environment.BLOB_STORE_ID && environment.VERCEL_OIDC_TOKEN);
  if (!databaseUrl || !databaseToken || (!hasBlobToken && !hasBlobOidc) || (requirePresenter && !presenterKey)) {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
  if (requirePresenter && presenterKey.length < 24) {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
  const blobCredentials = environment.VERCEL === "1" && hasBlobOidc
    ? { storeId: environment.BLOB_STORE_ID, oidcToken: environment.VERCEL_OIDC_TOKEN }
    : hasBlobToken ? { token: environment.BLOB_READ_WRITE_TOKEN }
      : { storeId: environment.BLOB_STORE_ID, oidcToken: environment.VERCEL_OIDC_TOKEN };
  return { databaseUrl, databaseToken, presenterKey: presenterKey ?? null, blobCredentials };
}
