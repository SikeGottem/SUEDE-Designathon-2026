// Reclaims expired unpublished media under a short database lease.
import { errorResponse, jsonResponse, readJson } from "./_lib/http.mjs";
import { getRuntimeService } from "./_lib/runtime.mjs";
import { HostedServiceError } from "./_lib/errors.mjs";

export async function POST(request) {
  try {
    const service = getRuntimeService();
    service.authorizePresenter(request);
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length !== 0) {
      throw new HostedServiceError(422, "INVALID_REQUEST", "Cleanup request body must be empty JSON.");
    }
    return jsonResponse(await service.cleanup(request));
  } catch (error) {
    return errorResponse(error);
  }
}
