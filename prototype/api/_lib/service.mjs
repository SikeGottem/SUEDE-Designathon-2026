// Implements the hosted-keepsake capability, validation, idempotency, and publish state machine.
import {
  HOSTED_LIMITS,
  assertMediaSignature,
  canonicalJson,
  extensionForMime,
  isDraftId,
  isReceiverId,
  normalizeMime,
  validateStartPayload,
} from "../../shared/hosted-keepsake.mjs";
import { bearerToken, randomCapability, secureEqual, sha256 } from "./crypto.mjs";
import { HostedServiceError } from "./errors.mjs";

export function createHostedKeepsakeService({ db, blob, presenterKey, clock = Date.now, ids = defaultIds } = {}) {
  return {
    authorizePresenter(request) { requirePresenter(request, presenterKey); },
    async start(request, input) {
      requirePresenter(request, presenterKey);
      const body = validateStartPayload(input);
      const now = clock();
      const requestHash = sha256(canonicalJson({ snapshot: body.snapshot, media: body.media }));
      const proposed = {
        id: ids.draft(),
        receiverId: ids.receiver(),
        idempotencyKey: body.idempotencyKey,
        requestHash,
        ownerTokenHash: sha256(body.draftToken),
        snapshotJson: body.snapshotJson,
        mediaPlanJson: "",
        createdAtMs: now,
        expiresAtMs: now + HOSTED_LIMITS.sessionTtlMs,
      };
      const mediaPlan = body.media.map((item) => ({
        ...item,
        pathname: `pending/${proposed.id}/${item.slot}-${ids.object()}.${extensionForMime(item.mime)}`,
      }));
      proposed.mediaPlanJson = canonicalJson(mediaPlan);

      const result = await db.createOrGetSession(proposed, HOSTED_LIMITS, now);
      if (result.status === "conflict") {
        throw new HostedServiceError(409, "IDEMPOTENCY_CONFLICT", "That publish attempt was already used for different content.");
      }
      if (result.status === "pending_limit") {
        throw new HostedServiceError(429, "PENDING_LIMIT", "Too many publish attempts are currently pending.");
      }
      if (result.status === "rate_limit") {
        throw new HostedServiceError(429, "RATE_LIMIT", "The hourly publish limit has been reached.");
      }
      if (result.status === "published_limit") {
        throw new HostedServiceError(429, "PUBLISHED_LIMIT", "The hosted keepsake limit has been reached.");
      }
      if (result.status === "expired") {
        throw new HostedServiceError(410, "DRAFT_EXPIRED", "This publish attempt has expired.");
      }

      const session = result.session ?? proposed;
      if (session.state === "published") return { draftId: session.id, uploads: [] };
      if (session.expiresAtMs < now) throw new HostedServiceError(410, "DRAFT_EXPIRED", "This publish attempt has expired.");
      const storedPlan = parseMediaPlan(session.mediaPlanJson);
      const inspectionUntil = now + HOSTED_LIMITS.readUrlTtlMs;
      const inspections = await Promise.all(storedPlan.map((item) => blob.inspect(item, inspectionUntil)));
      const missing = [];
      for (let index = 0; index < storedPlan.length; index += 1) {
        const item = storedPlan[index];
        const inspected = inspections[index];
        if (!inspected) {
          missing.push(item);
          continue;
        }
        assertInspectedMedia(item, inspected);
      }
      const uploadUntil = Math.min(session.expiresAtMs, now + HOSTED_LIMITS.uploadUrlTtlMs);
      const uploads = await Promise.all(missing.map((item) => blob.signUpload(item, uploadUntil)));
      return { draftId: session.id, uploads };
    },

    async finalize(request, input) {
      if (!isExactObject(input, ["draftId"]) || !isDraftId(input.draftId)) {
        throw new HostedServiceError(422, "INVALID_REQUEST", "Finalize request shape is invalid.");
      }
      const token = bearerToken(request);
      if (!token || token.length !== 43) throw missingDraft();
      const ownerTokenHash = sha256(token);
      const session = await db.getSession(input.draftId);
      if (!session || !secureEqual(session.ownerTokenHash, ownerTokenHash)) throw missingDraft();
      const now = clock();
      if (session.state === "published") return receiverResult(session.receiverId);
      if (session.state !== "pending" || session.expiresAtMs < now) {
        throw new HostedServiceError(410, "DRAFT_EXPIRED", "This publish attempt has expired.");
      }

      const mediaPlan = parseMediaPlan(session.mediaPlanJson);
      const inspectionUntil = now + HOSTED_LIMITS.readUrlTtlMs;
      const inspections = await Promise.all(mediaPlan.map((item) => blob.inspect(item, inspectionUntil)));
      const missing = mediaPlan.filter((_, index) => !inspections[index]).map((item) => item.slot);
      if (missing.length > 0) {
        throw new HostedServiceError(409, "MEDIA_MISSING", "Some media uploads have not finished.", { missing });
      }
      const verifiedMedia = mediaPlan.map((item, index) => {
        const inspected = inspections[index];
        assertInspectedMedia(item, inspected);
        return { slot: item.slot, pathname: item.pathname, mime: item.mime, bytes: item.bytes, etag: inspected.etag };
      });
      const verifiedMediaJson = canonicalJson(verifiedMedia);
      const result = await db.publishSession({
        draftId: session.id,
        ownerTokenHash,
        verifiedMediaJson,
        contentHash: sha256(`${session.snapshotJson}\n${verifiedMediaJson}`),
        now,
        maxPublishedKeepsakes: HOSTED_LIMITS.maxPublishedKeepsakes,
      });
      if (result.status === "published") return receiverResult(result.session.receiverId);
      if (result.status === "published_limit") {
        throw new HostedServiceError(429, "PUBLISHED_LIMIT", "The hosted keepsake limit has been reached.");
      }
      if (result.status === "expired") throw new HostedServiceError(410, "DRAFT_EXPIRED", "This publish attempt has expired.");
      throw missingDraft();
    },

    async get(receiverId) {
      if (!isReceiverId(receiverId)) throw missingKeepsake();
      const keepsake = await db.getKeepsake(receiverId);
      if (!keepsake) throw missingKeepsake();
      const snapshot = parseStoredJson(keepsake.snapshotJson);
      const storedMedia = parseVerifiedMedia(keepsake.mediaJson);
      const validUntil = clock() + HOSTED_LIMITS.readUrlTtlMs;
      const urls = await Promise.all(storedMedia.map((item) => blob.signRead(item, validUntil)));
      return {
        snapshot,
        media: storedMedia.map((item, index) => ({ slot: item.slot, url: urls[index], mime: item.mime, bytes: item.bytes })),
      };
    },

    async cleanup(request) {
      requirePresenter(request, presenterKey);
      const now = clock();
      const leaseUntilMs = now + HOSTED_LIMITS.cleanupLeaseMs;
      const sessions = await db.claimExpiredSessions({ now, leaseUntilMs, limit: HOSTED_LIMITS.maxPendingSessions });
      const cleaned = [];
      const failed = [];
      for (const session of sessions) {
        try {
          const mediaPlan = parseMediaPlan(session.mediaPlanJson);
          await blob.deletePaths(mediaPlan.map((item) => item.pathname));
          await db.markSessionCleaned(session.id, leaseUntilMs);
          cleaned.push(session.id);
        } catch {
          failed.push(session.id);
        }
      }
      return { cleaned: cleaned.length, failed: failed.length };
    },
  };
}

const defaultIds = Object.freeze({
  draft: () => randomCapability(18),
  receiver: () => randomCapability(24),
  object: () => randomCapability(8),
});

function requirePresenter(request, presenterKey) {
  if (typeof presenterKey !== "string" || presenterKey.length < 24) {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
  if (!secureEqual(bearerToken(request), presenterKey)) {
    throw new HostedServiceError(401, "UNAUTHORIZED", "A presenter key is required.");
  }
}

function assertInspectedMedia(expected, actual) {
  if (actual.pathname !== expected.pathname
    || normalizeMime(actual.mime) !== expected.mime
    || actual.bytes !== expected.bytes
    || typeof actual.etag !== "string" || actual.etag.length === 0) {
    throw new HostedServiceError(409, "MEDIA_CONFLICT", "Existing media does not match this publish attempt.", { slot: expected.slot });
  }
  try {
    assertMediaSignature(expected.mime, actual.prefix);
  } catch {
    throw new HostedServiceError(409, "MEDIA_CONFLICT", "Existing media does not match this publish attempt.", { slot: expected.slot });
  }
}

function parseMediaPlan(json) {
  const value = parseStoredJson(json);
  if (!Array.isArray(value) || value.length > 6 || new Set(value.map((item) => item?.slot)).size !== value.length
    || value.some((item) => !isExactObject(item, ["bytes", "filename", "mime", "pathname", "slot"])
      || !isStoredPath(item.pathname, item.slot, item.mime)
      || typeof item.filename !== "string" || item.filename.length === 0 || item.filename.length > 240
      || !Number.isSafeInteger(item.bytes) || item.bytes <= 0)) {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
  return value;
}

function parseVerifiedMedia(json) {
  const value = parseStoredJson(json);
  if (!Array.isArray(value) || value.length > 6 || new Set(value.map((item) => item?.slot)).size !== value.length
    || value.some((item) => !isExactObject(item, ["bytes", "etag", "mime", "pathname", "slot"])
      || !isStoredPath(item.pathname, item.slot, item.mime)
      || !Number.isSafeInteger(item.bytes) || item.bytes <= 0
      || typeof item.etag !== "string" || item.etag.length === 0)) {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
  return value;
}

function isStoredPath(pathname, slot, mime) {
  if (typeof pathname !== "string" || typeof slot !== "string" || typeof mime !== "string") return false;
  const extension = extensionForMime(mime);
  if (!extension || !/^(?:photo-[0-3]|voice|song)$/.test(slot)) return false;
  const escapedSlot = slot.replace("-", "\\-");
  return new RegExp(`^pending/[A-Za-z0-9_-]{24}/${escapedSlot}-[A-Za-z0-9_-]{11}\\.${extension}$`).test(pathname);
}

function parseStoredJson(json) {
  try {
    return JSON.parse(json);
  } catch {
    throw new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
  }
}

function isExactObject(value, keys) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    && Object.keys(value).sort().join(",") === [...keys].sort().join(",");
}

function receiverResult(receiverId) {
  return { receiverId, path: `/for/${receiverId}` };
}

function missingDraft() {
  return new HostedServiceError(404, "DRAFT_NOT_FOUND", "Publish attempt was not found.");
}

function missingKeepsake() {
  return new HostedServiceError(404, "KEEPSAKE_NOT_FOUND", "Keepsake was not found.");
}
