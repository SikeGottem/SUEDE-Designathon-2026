// Adapts Web Request handlers to bounded JSON parsing and uniform JSON responses.
import { asServiceError, HostedServiceError } from "./errors.mjs";

const MAX_JSON_BODY_BYTES = 400_000;

export async function readJson(request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new HostedServiceError(415, "UNSUPPORTED_CONTENT_TYPE", "Request body must be JSON.");
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BODY_BYTES) {
    throw new HostedServiceError(413, "REQUEST_TOO_LARGE", "Request body is too large.");
  }
  const reader = request.body?.getReader();
  const chunks = [];
  let bytes = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_JSON_BODY_BYTES) {
          await reader.cancel();
          throw new HostedServiceError(413, "REQUEST_TOO_LARGE", "Request body is too large.");
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const combined = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.byteLength; }
  const text = new TextDecoder().decode(combined);
  try {
    return JSON.parse(text);
  } catch {
    throw new HostedServiceError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
}

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export function errorResponse(error) {
  const safe = asServiceError(error);
  return jsonResponse({ error: { code: safe.code, message: safe.message, ...(safe.details === undefined ? {} : { details: safe.details }) } }, safe.status);
}

export function methodNotAllowed(allowed) {
  return jsonResponse({ error: { code: "METHOD_NOT_ALLOWED", message: "Method is not allowed." } }, 405, { Allow: allowed });
}
