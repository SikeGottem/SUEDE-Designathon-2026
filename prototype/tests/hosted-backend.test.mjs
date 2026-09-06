// Verifies hosted publish validation, capabilities, retry recovery, immutability, and cleanup using local adapters.
import assert from "node:assert/strict";
import { readJson } from "../api/_lib/http.mjs";
import test from "node:test";
import { createBlobAdapter } from "../api/_lib/blob.mjs";
import { readRuntimeConfig } from "../api/_lib/config.mjs";
import { HostedServiceError } from "../api/_lib/errors.mjs";
import { createHostedKeepsakeService } from "../api/_lib/service.mjs";
import {
  HOSTED_LIMITS,
  HostedValidationError,
  MEDIA_LIMITS,
  validateStartPayload,
} from "../shared/hosted-keepsake.mjs";

const presenterKey = "presenter-key-with-at-least-24-characters";
const draftToken = "A".repeat(43);
const idempotencyKey = "123e4567-e89b-42d3-a456-426614174000";

test("strict hosted validation preserves authored fields and accepts recorder MIME parameters", () => {
  const body = publishBody();
  body.media.find((item) => item.slot === "voice").mime = "audio/webm;codecs=opus";
  const result = validateStartPayload(body);
  assert.equal(result.media.find((item) => item.slot === "voice").mime, "audio/webm");
  assert.deepEqual(result.snapshot.textBlocks[0].style, { ink: "plum", align: "center", size: "large", weight: "emphasis" });
  assert.deepEqual(result.snapshot.scrapbook.marks[0].layout, layout(4, 5, 6, 1.2));
  assert.equal(result.snapshot.sealWeight, "soft");
});

test("validation rejects arbitrary URLs, videos, unknown nested keys, missing slots, and byte limits", () => {
  for (const mutate of [
    (body) => { body.snapshot.voice.url = "https://attacker.invalid/audio"; },
    (body) => { body.snapshot.capture.kind = "video"; },
    (body) => { body.snapshot.layouts.words.extra = true; },
    (body) => { body.snapshot.doodles[0].points[0].z = 1; },
    (body) => { body.media = body.media.filter((item) => item.slot !== "song"); },
    (body) => { body.media[0].bytes = MEDIA_LIMITS.photo + 1; },
    (body) => {
      body.media[0].bytes = MEDIA_LIMITS.photo;
      body.media[1].bytes = MEDIA_LIMITS.voice;
      body.media[2].bytes = MEDIA_LIMITS.song;
    },
  ]) {
    const body = publishBody();
    mutate(body);
    assert.throws(() => validateStartPayload(body), HostedValidationError);
  }
});

test("start requires presenter capability and idempotently returns only missing uploads", async () => {
  const fixture = harness();
  await assert.rejects(
    fixture.service.start(request("wrong"), publishBody()),
    (error) => error instanceof HostedServiceError && error.status === 401,
  );

  const first = await fixture.service.start(request(presenterKey), publishBody());
  assert.equal(first.draftId.length, 24);
  assert.deepEqual(first.uploads.map((item) => item.slot), ["photo-0", "voice", "song"]);
  assert.ok(first.uploads.every((item) => item.pathname.startsWith(`pending/${first.draftId}/`)));
  fixture.blob.land(first.uploads[0], signatureFor("image/png"));

  const retry = await fixture.service.start(request(presenterKey), publishBody());
  assert.equal(retry.draftId, first.draftId);
  assert.deepEqual(retry.uploads.map((item) => item.slot), ["voice", "song"]);
  assert.equal(retry.uploads[0].pathname, first.uploads[1].pathname);

  const changed = publishBody();
  changed.snapshot.words = "different immutable content";
  await assert.rejects(
    fixture.service.start(request(presenterKey), changed),
    (error) => error.code === "IDEMPOTENCY_CONFLICT",
  );
});

test("start fails closed when an existing path has wrong bytes or signature", async () => {
  const fixture = harness();
  const first = await fixture.service.start(request(presenterKey), publishBody());
  fixture.blob.land(first.uploads[0], signatureFor("image/jpeg"));
  await assert.rejects(
    fixture.service.start(request(presenterKey), publishBody()),
    (error) => error.code === "MEDIA_CONFLICT" && error.details.slot === "photo-0",
  );
});

test("finalize verifies every object, publishes once, and GET signs only stored paths", async () => {
  const fixture = harness();
  const first = await fixture.service.start(request(presenterKey), publishBody());
  fixture.blob.land(first.uploads[0], signatureFor("image/png"));
  await assert.rejects(
    fixture.service.finalize(request(draftToken), { draftId: first.draftId }),
    (error) => error.code === "MEDIA_MISSING" && error.details.missing.join(",") === "voice,song",
  );
  fixture.blob.land(first.uploads[1], signatureFor("audio/webm"));
  fixture.blob.land(first.uploads[2], signatureFor("audio/mpeg"));

  await assert.rejects(
    fixture.service.finalize(request("B".repeat(43)), { draftId: first.draftId }),
    (error) => error.status === 404 && error.code === "DRAFT_NOT_FOUND",
  );
  const published = await fixture.service.finalize(request(draftToken), { draftId: first.draftId });
  assert.equal(published.path, `/for/${published.receiverId}`);
  assert.deepEqual(await fixture.service.finalize(request(draftToken), { draftId: first.draftId }), published);
  assert.equal(fixture.db.keepsakes.size, 1);

  const received = await fixture.service.get(published.receiverId);
  assert.equal(received.snapshot.scrapbook.photos[0].asset.url, "media:photo-0");
  assert.deepEqual(received.media.map((item) => item.slot), ["photo-0", "voice", "song"]);
  assert.deepEqual(fixture.blob.signedReads, [...fixture.db.keepsakes.values()][0].media.map((item) => item.pathname));
  await assert.rejects(fixture.service.get("Z".repeat(32)), (error) => error.code === "KEEPSAKE_NOT_FOUND");
});

test("cleanup lease wins safely over expired finalize and deletes only planned paths", async () => {
  let now = 10_000;
  const fixture = harness(() => now);
  const first = await fixture.service.start(request(presenterKey), publishBody());
  fixture.blob.land(first.uploads[0], signatureFor("image/png"));
  now += HOSTED_LIMITS.sessionTtlMs + 1;
  const result = await fixture.service.cleanup(request(presenterKey));
  assert.deepEqual(result, { cleaned: 1, failed: 0 });
  assert.deepEqual(fixture.blob.deleted.sort(), first.uploads.map((item) => item.pathname).sort());
  await assert.rejects(
    fixture.service.finalize(request(draftToken), { draftId: first.draftId }),
    (error) => error.code === "DRAFT_EXPIRED",
  );
  assert.equal(fixture.db.keepsakes.size, 0);
});

test("runtime configuration fails closed and keeps static Blob tokens server-side", () => {
  assert.throws(() => readRuntimeConfig({}), (error) => error.status === 503);
  const config = readRuntimeConfig({
    TURSO_DATABASE_URL: "libsql://fixture.invalid",
    TURSO_AUTH_TOKEN: "db-token",
    BLOB_READ_WRITE_TOKEN: "blob-token",
    PUBLISHER_KEY: presenterKey,
  }, { requirePresenter: true });
  assert.deepEqual(config.blobCredentials, { token: "blob-token" });
});

test("Blob adapter signs one private path with exact PUT constraints and range-inspects without cache", async () => {
  const calls = [];
  class NotFound extends Error {}
  const sdk = {
    BlobNotFoundError: NotFound,
    issueSignedToken: async (options) => { calls.push(["issue", options]); return { delegationToken: "d", clientSigningToken: "c" }; },
    presignUrl: async (_token, options) => { calls.push(["presign", options]); return { presignedUrl: "https://blob.invalid/signed" }; },
    head: async (pathname, credentials) => {
      calls.push(["head", pathname, credentials]);
      return { pathname, contentType: "image/png", size: 8, etag: "etag-1" };
    },
    del: async () => {},
  };
  const fetchImpl = async (_url, options) => {
    calls.push(["fetch", options]);
    return new Response(signatureFor("image/png"), { status: 206 });
  };
  const adapter = createBlobAdapter({ credentials: { token: "server-only" }, fetchImpl, sdk });
  const item = { slot: "photo-0", pathname: `pending/${"D".repeat(24)}/photo-0-${"a".repeat(11)}.png`, mime: "image/png", bytes: 8 };
  const upload = await adapter.signUpload(item, 99_000);
  assert.equal(upload.headers["Content-Type"], "image/png");
  assert.deepEqual(calls[0][1], {
    token: "server-only", pathname: item.pathname, operations: ["put"], validUntil: 99_000,
    allowedContentTypes: ["image/png"], maximumSizeInBytes: 8,
  });
  assert.deepEqual(calls[1][1], {
    operation: "put", pathname: item.pathname, access: "private", validUntil: 99_000,
    allowedContentTypes: ["image/png"], maximumSizeInBytes: 8, addRandomSuffix: false,
    allowOverwrite: false, cacheControlMaxAge: 31_536_000,
  });

  calls.length = 0;
  const inspected = await adapter.inspect(item, 100_000);
  assert.equal(inspected.etag, "etag-1");
  assert.equal(calls.find(([kind]) => kind === "presign")[1].useCache, false);
  assert.deepEqual(calls.find(([kind]) => kind === "fetch")[1].headers, { Range: "bytes=0-31" });
});

function harness(clock = () => 1_000_000) {
  const db = new MemoryDb();
  const blob = new MemoryBlob();
  let sequence = 0;
  const ids = {
    draft: () => String.fromCharCode(68 + sequence++).repeat(24),
    receiver: () => String.fromCharCode(82 + sequence++).repeat(32),
    object: () => String.fromCharCode(97 + sequence++).repeat(11),
  };
  return { db, blob, service: createHostedKeepsakeService({ db, blob, presenterKey, clock, ids }) };
}

class MemoryDb {
  sessions = new Map();
  idempotency = new Map();
  keepsakes = new Map();

  async createOrGetSession(proposed, limits, now) {
    const existingId = this.idempotency.get(proposed.idempotencyKey);
    if (existingId) {
      const session = this.sessions.get(existingId);
      if (session.requestHash !== proposed.requestHash || session.ownerTokenHash !== proposed.ownerTokenHash) return { status: "conflict" };
      return { status: ["cleaned", "cleaning"].includes(session.state) ? "expired" : "existing", session: structuredClone(session) };
    }
    const active = [...this.sessions.values()].filter((item) => item.state === "pending" && item.expiresAtMs >= now).length;
    const recent = [...this.sessions.values()].filter((item) => item.createdAtMs >= now - 3_600_000).length;
    if (this.keepsakes.size >= limits.maxPublishedKeepsakes) return { status: "published_limit" };
    if (active >= limits.maxPendingSessions) return { status: "pending_limit" };
    if (recent >= limits.maxStartsPerHour) return { status: "rate_limit" };
    const session = { ...structuredClone(proposed), state: "pending", verifiedMediaJson: null, cleanupLeaseUntilMs: null };
    this.sessions.set(session.id, session);
    this.idempotency.set(session.idempotencyKey, session.id);
    return { status: "created", session: structuredClone(session) };
  }

  async getSession(id) {
    return this.sessions.has(id) ? structuredClone(this.sessions.get(id)) : null;
  }

  async publishSession({ draftId, ownerTokenHash, verifiedMediaJson, contentHash, now, maxPublishedKeepsakes }) {
    const session = this.sessions.get(draftId);
    if (!session || session.ownerTokenHash !== ownerTokenHash) return { status: "missing" };
    if (session.state === "published") return { status: "published", session: structuredClone(session) };
    if (session.state !== "pending" || session.expiresAtMs < now) return { status: "expired" };
    if (this.keepsakes.size >= maxPublishedKeepsakes) return { status: "published_limit" };
    const media = JSON.parse(verifiedMediaJson);
    this.keepsakes.set(session.receiverId, {
      receiverId: session.receiverId, sessionId: session.id, snapshotJson: session.snapshotJson,
      mediaJson: verifiedMediaJson, media, contentHash, createdAtMs: now,
    });
    session.state = "published";
    session.verifiedMediaJson = verifiedMediaJson;
    return { status: "published", session: structuredClone(session) };
  }

  async getKeepsake(receiverId) {
    return this.keepsakes.has(receiverId) ? structuredClone(this.keepsakes.get(receiverId)) : null;
  }

  async claimExpiredSessions({ now, leaseUntilMs, limit }) {
    const claimed = [...this.sessions.values()].filter((session) =>
      ((session.state === "pending" && session.expiresAtMs < now)
        || (session.state === "cleaning" && session.cleanupLeaseUntilMs < now))
      && !this.keepsakes.has(session.receiverId)).slice(0, limit);
    for (const session of claimed) { session.state = "cleaning"; session.cleanupLeaseUntilMs = leaseUntilMs; }
    return structuredClone(claimed);
  }

  async markSessionCleaned(id, leaseUntilMs) {
    const session = this.sessions.get(id);
    if (session?.state === "cleaning" && session.cleanupLeaseUntilMs === leaseUntilMs && !this.keepsakes.has(session.receiverId)) {
      session.state = "cleaned";
      session.cleanupLeaseUntilMs = null;
    }
  }
}

class MemoryBlob {
  objects = new Map();
  signedReads = [];
  deleted = [];

  async signUpload(item) {
    return { slot: item.slot, pathname: item.pathname, url: `https://upload.invalid/${item.pathname}`, headers: { "Content-Type": item.mime } };
  }

  async inspect(item) {
    return this.objects.has(item.pathname) ? structuredClone(this.objects.get(item.pathname)) : null;
  }

  land(upload, prefix) {
    const mime = upload.headers["Content-Type"];
    const bytes = mime === "image/png" ? 8 : mime === "audio/webm" ? 4 : 3;
    this.objects.set(upload.pathname, { pathname: upload.pathname, mime, bytes, etag: `etag-${upload.slot}`, prefix });
  }

  async signRead(item) {
    this.signedReads.push(item.pathname);
    return `https://read.invalid/${item.pathname}?signed=1`;
  }

  async deletePaths(pathnames) {
    for (const pathname of pathnames) { this.deleted.push(pathname); this.objects.delete(pathname); }
  }
}

function publishBody() {
  return {
    draftToken,
    idempotencyKey,
    media: [
      { slot: "photo-0", mime: "image/png", bytes: 8, filename: "photo.png" },
      { slot: "voice", mime: "audio/webm", bytes: 4, filename: "voice.webm" },
      { slot: "song", mime: "audio/mpeg", bytes: 3, filename: "song.mp3" },
    ],
    snapshot: {
      v: 1, id: "keepsake-fixture", sender: "Ethan", recipient: "Maya", words: "hello",
      crossedOut: [{ start: 0, end: 1 }], paper: "ruled", carrier: "firefly", envelope: "night",
      seal: [{ id: "seal-1", points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }], sealWeight: "soft",
      pieces: ["photo", "voice", "song", "drawing"], capture: { kind: "photo", url: "media:photo-0" },
      voice: { url: "media:voice", name: "A note", durationSeconds: 12.5 },
      song: { url: "media:song", name: "A song" },
      doodles: [{ id: "doodle-1", points: [{ x: 8, y: 9 }] }], stickers: ["burst"], inkColor: "plum",
      layouts: Object.fromEntries(["words", "photo", "voice", "song", "burst", "ribbon", "stamp"].map((name, index) => [name, layout(index, index + 1, 0, 1)])),
      textBlocks: [{ id: "text-1", words: "hello", crossedOut: [], layout: layout(1, 2, 3, 1), style: { ink: "plum", align: "center", size: "large", weight: "emphasis" } }],
      scrapbook: {
        photos: [{ id: "photo-1", asset: { kind: "photo", url: "media:photo-0" }, layout: layout(2, 3, 4, 1), frame: "tape", caption: "Together" }],
        marks: [{ id: "mark-1", kind: "burst", layout: layout(4, 5, 6, 1.2), ink: "ochre" }],
        order: ["photo-1", "text-1", "voice", "song", "mark-1"],
      },
    },
  };
}

function request(token) {
  return new Request("https://fixture.invalid/api", { headers: { Authorization: `Bearer ${token}` } });
}

function layout(x, y, rotation, scale) {
  return { x, y, rotation, scale };
}

function signatureFor(mime) {
  if (mime === "image/png") return Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mime === "image/jpeg") return Uint8Array.from([0xff, 0xd8, 0xff]);
  if (mime === "audio/webm") return Uint8Array.from([0x1a, 0x45, 0xdf, 0xa3]);
  return new TextEncoder().encode("ID3");
}


test("retried PUT authorizations never outlive the pending session", async () => {
  let now = 10_000;
  const fixture = harness(() => now);
  await fixture.service.start(request(presenterKey), publishBody());
  const sessionExpiry = now + HOSTED_LIMITS.sessionTtlMs;
  now = sessionExpiry - 1_000;
  const expiries = [];
  const sign = fixture.blob.signUpload.bind(fixture.blob);
  fixture.blob.signUpload = (item, validUntil) => { expiries.push(validUntil); return sign(item); };
  await fixture.service.start(request(presenterKey), publishBody());
  assert.equal(expiries.length, 3);
  assert.ok(expiries.every((value) => value <= sessionExpiry));
});

test("unknown-length requests stop reading at the application byte bound", async () => {
  let pulled = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { pulled += 10_000; controller.enqueue(new Uint8Array(10_000)); if (pulled >= 2_000_000) controller.close(); },
    cancel() { cancelled = true; },
  });
  const req = new Request("https://fixture.invalid/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: stream, duplex: "half" });
  await assert.rejects(readJson(req), (error) => error.status === 413);
  assert.ok(cancelled);
  assert.ok(pulled <= 420_000);
});
