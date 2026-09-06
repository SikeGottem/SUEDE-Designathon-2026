// Defines the shared hosted-keepsake payload limits and strict symbolic-media validation boundary.
export const MEDIA_LIMITS = Object.freeze({
  photo: 8 * 1024 * 1024,
  voice: 12 * 1024 * 1024,
  song: 20 * 1024 * 1024,
  combined: 32 * 1024 * 1024,
});

export const HOSTED_LIMITS = Object.freeze({
  maxSnapshotBytes: 250_000,
  maxPendingSessions: 10,
  maxStartsPerHour: 10,
  maxPublishedKeepsakes: 100,
  sessionTtlMs: 60 * 60 * 1000,
  cleanupLeaseMs: 5 * 60 * 1000,
  uploadUrlTtlMs: 5 * 60 * 1000,
  readUrlTtlMs: 10 * 60 * 1000,
});

export const PHOTO_SLOTS = Object.freeze(["photo-0", "photo-1", "photo-2", "photo-3"]);
export const MEDIA_SLOTS = Object.freeze([...PHOTO_SLOTS, "voice", "song"]);

const PHOTO_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
]);
const PAPER_IDS = new Set(["plain", "dotted", "grid", "ruled", "note"]);
const CARRIER_IDS = new Set(["bottle", "firefly", "plane"]);
const ENVELOPE_IDS = new Set(["mail", "night", "rust"]);
const PIECE_IDS = new Set(["photo", "voice", "song", "drawing"]);
const STICKER_IDS = new Set(["burst", "ribbon", "stamp"]);
const INK_COLORS = new Set(["navy", "forest", "rust", "plum", "ochre"]);
const LAYER_IDS = ["words", "photo", "voice", "song", "burst", "ribbon", "stamp"];
const TOP_LEVEL_KEYS = new Set([
  "v", "id", "sender", "recipient", "words", "crossedOut", "paper", "carrier", "envelope",
  "seal", "sealWeight", "pieces", "capture", "voice", "song", "doodles", "stickers",
  "inkColor", "layouts", "textBlocks", "scrapbook",
]);

export class HostedValidationError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "HostedValidationError";
    this.code = code;
    this.status = 422;
    this.details = details;
  }
}

export function normalizeMime(value) {
  return typeof value === "string" ? value.split(";", 1)[0].trim().toLowerCase() : "";
}

export function mediaReference(slot) {
  return `media:${slot}`;
}

export function slotFromMediaReference(value) {
  if (typeof value !== "string" || !value.startsWith("media:")) return null;
  const slot = value.slice(6);
  return MEDIA_SLOTS.includes(slot) ? slot : null;
}

export function extensionForMime(mime) {
  switch (normalizeMime(mime)) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "audio/mpeg": return "mp3";
    case "audio/mp4":
    case "audio/x-m4a": return "m4a";
    case "audio/wav":
    case "audio/wave":
    case "audio/x-wav": return "wav";
    case "audio/webm": return "webm";
    case "audio/ogg": return "ogg";
    default: return null;
  }
}

export function canonicalJson(value) {
  const serialize = (item) => {
    if (item === null || typeof item === "string" || typeof item === "boolean") return JSON.stringify(item);
    if (typeof item === "number") {
      if (!Number.isFinite(item)) throw new HostedValidationError("INVALID_JSON", "Payload contains a non-finite number.");
      return JSON.stringify(item);
    }
    if (Array.isArray(item)) return `[${item.map(serialize).join(",")}]`;
    if (isRecord(item)) {
      return `{${Object.keys(item).sort().map((key) => `${JSON.stringify(key)}:${serialize(item[key])}`).join(",")}}`;
    }
    throw new HostedValidationError("INVALID_JSON", "Payload must contain only JSON values.");
  };
  return serialize(value);
}

export function validateStartPayload(value) {
  if (!isRecord(value) || !hasExactKeys(value, ["draftToken", "idempotencyKey", "media", "snapshot"])) {
    throw new HostedValidationError("INVALID_REQUEST", "Publish request shape is invalid.");
  }
  if (!isUuid(value.idempotencyKey)) {
    throw new HostedValidationError("INVALID_IDEMPOTENCY_KEY", "idempotencyKey must be a UUID.");
  }
  if (!isCapability(value.draftToken, 43)) {
    throw new HostedValidationError("INVALID_DRAFT_TOKEN", "draftToken must be a 256-bit base64url capability.");
  }

  const snapshot = validateHostedSnapshot(value.snapshot);
  const media = validateMediaDescriptors(value.media, snapshot.mediaSlots);
  return {
    snapshot: snapshot.value,
    snapshotJson: snapshot.json,
    media,
    idempotencyKey: value.idempotencyKey.toLowerCase(),
    draftToken: value.draftToken,
  };
}

export function validateHostedSnapshot(value) {
  if (!isRecord(value) || Object.keys(value).some((key) => !TOP_LEVEL_KEYS.has(key))) {
    throw snapshotError();
  }
  if (value.v !== 1
    || typeof value.id !== "string" || value.id.length > 160
    || typeof value.sender !== "string" || value.sender.length > 120
    || typeof value.recipient !== "string" || value.recipient.length > 120
    || typeof value.words !== "string" || value.words.length > 10_000
    || !PAPER_IDS.has(value.paper)
    || !CARRIER_IDS.has(value.carrier)
    || !ENVELOPE_IDS.has(value.envelope)
    || (value.sealWeight !== undefined && !["soft", "bold"].includes(value.sealWeight))
    || !INK_COLORS.has(value.inkColor)
    || !isEnumList(value.pieces, PIECE_IDS, PIECE_IDS.size)
    || !isEnumList(value.stickers, STICKER_IDS, STICKER_IDS.size)
    || !isCrossOutList(value.crossedOut, value.words.length)
    || !isStrokeList(value.doodles)
    || !isStrokeList(value.seal)
    || !isCaptureAsset(value.capture)
    || !isAudioAsset(value.voice, "voice")
    || !isAudioAsset(value.song, "song")
    || !isRecord(value.layouts) || !hasExactKeys(value.layouts, LAYER_IDS)
    || !LAYER_IDS.every((layer) => isLayerLayout(value.layouts[layer]))
    || (value.textBlocks !== undefined && !isTextBlockList(value.textBlocks))) {
    throw snapshotError();
  }
  if (value.scrapbook !== undefined && !isScrapbook(value.scrapbook, value)) throw snapshotError();

  const photoReferences = value.scrapbook
    ? value.scrapbook.photos.filter((photo) => photo.asset.kind === "photo").map((photo) => photo.asset.url)
    : [];
  if (new Set(photoReferences).size !== photoReferences.length) {
    throw new HostedValidationError("DUPLICATE_MEDIA_REFERENCE", "Each scrapbook photo must use its own media slot.");
  }
  if (value.capture?.kind === "photo") {
    if (photoReferences.length > 0 && value.capture.url !== photoReferences[0]) {
      throw new HostedValidationError("CAPTURE_ALIAS_MISMATCH", "capture must alias the first scrapbook photo.");
    }
    if (photoReferences.length === 0) photoReferences.push(value.capture.url);
  }

  const mediaSlots = [...photoReferences.map(slotFromMediaReference)];
  if (value.voice) mediaSlots.push("voice");
  if (value.song) mediaSlots.push("song");
  if (mediaSlots.some((slot) => slot === null)) throw snapshotError();

  const json = canonicalJson(value);
  if (new TextEncoder().encode(json).byteLength > HOSTED_LIMITS.maxSnapshotBytes) {
    throw new HostedValidationError("SNAPSHOT_TOO_LARGE", "Keepsake snapshot exceeds the hosted limit.");
  }
  return { value: JSON.parse(json), json, mediaSlots: [...new Set(mediaSlots)].sort(compareSlots) };
}

export function validateMediaDescriptors(value, referencedSlots) {
  if (!Array.isArray(value) || value.length > MEDIA_SLOTS.length) {
    throw new HostedValidationError("INVALID_MEDIA", "Media descriptors are invalid.");
  }
  const media = [];
  const seen = new Set();
  let combinedBytes = 0;
  for (const item of value) {
    if (!isRecord(item) || !hasExactKeys(item, ["bytes", "filename", "mime", "slot"])) {
      throw new HostedValidationError("INVALID_MEDIA", "Media descriptor shape is invalid.");
    }
    const { slot } = item;
    const mime = normalizeMime(item.mime);
    if (!MEDIA_SLOTS.includes(slot) || seen.has(slot)) {
      throw new HostedValidationError("INVALID_MEDIA_SLOT", "Media slots must be unique and supported.");
    }
    if (typeof item.filename !== "string" || item.filename.length === 0 || item.filename.length > 240 || /[\u0000-\u001f]/.test(item.filename)) {
      throw new HostedValidationError("INVALID_FILENAME", "Media filename is invalid.");
    }
    if (!Number.isSafeInteger(item.bytes) || item.bytes <= 0) {
      throw new HostedValidationError("INVALID_MEDIA_SIZE", "Media size must be a positive integer.");
    }
    const rule = ruleForSlot(slot);
    if (!rule.types.has(mime)) {
      throw new HostedValidationError("UNSUPPORTED_MEDIA_TYPE", `Unsupported media type for ${slot}.`, { slot });
    }
    if (item.bytes > rule.maxBytes) {
      throw new HostedValidationError("MEDIA_TOO_LARGE", `${slot} exceeds its upload limit.`, { slot, maxBytes: rule.maxBytes });
    }
    combinedBytes += item.bytes;
    seen.add(slot);
    media.push({ slot, mime, bytes: item.bytes, filename: item.filename });
  }
  if (combinedBytes > MEDIA_LIMITS.combined) {
    throw new HostedValidationError("MEDIA_TOTAL_TOO_LARGE", "Combined media exceeds 32 MiB.", { maxBytes: MEDIA_LIMITS.combined });
  }
  const expected = [...new Set(referencedSlots)].sort(compareSlots);
  const actual = [...seen].sort(compareSlots);
  if (expected.join("\0") !== actual.join("\0")) {
    throw new HostedValidationError("MEDIA_REFERENCE_MISMATCH", "Every symbolic media reference needs exactly one matching descriptor.", {
      missing: expected.filter((slot) => !seen.has(slot)),
      extra: actual.filter((slot) => !expected.includes(slot)),
    });
  }
  return media.sort((a, b) => compareSlots(a.slot, b.slot));
}

export function assertMediaSignature(mimeValue, input) {
  const mime = normalizeMime(mimeValue);
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input ?? []);
  const ascii = (start, length) => String.fromCharCode(...bytes.slice(start, start + length));
  let valid = false;
  if (mime === "image/jpeg") valid = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  else if (mime === "image/png") valid = equals(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  else if (mime === "image/webp") valid = ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP";
  else if (["audio/wav", "audio/wave", "audio/x-wav"].includes(mime)) valid = ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE";
  else if (mime === "audio/mpeg") valid = ascii(0, 3) === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  else if (["audio/mp4", "audio/x-m4a"].includes(mime)) valid = ascii(4, 4) === "ftyp";
  else if (mime === "audio/webm") valid = equals(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
  else if (mime === "audio/ogg") valid = ascii(0, 4) === "OggS";
  if (!valid) throw new HostedValidationError("MEDIA_SIGNATURE_MISMATCH", "Uploaded bytes do not match the declared media type.");
}

export function isReceiverId(value) {
  return isCapability(value, 32);
}

export function isDraftId(value) {
  return isCapability(value, 24);
}

function ruleForSlot(slot) {
  if (PHOTO_SLOTS.includes(slot)) return { types: PHOTO_MIME_TYPES, maxBytes: MEDIA_LIMITS.photo };
  if (slot === "voice") return { types: AUDIO_MIME_TYPES, maxBytes: MEDIA_LIMITS.voice };
  return { types: AUDIO_MIME_TYPES, maxBytes: MEDIA_LIMITS.song };
}

function isCaptureAsset(value) {
  if (value === null) return true;
  if (!isRecord(value) || !["photo", "sample"].includes(value.kind)) return false;
  if (value.kind === "sample") return hasExactKeys(value, ["kind"]);
  return hasExactKeys(value, ["kind", "url"])
    && PHOTO_SLOTS.includes(slotFromMediaReference(value.url));
}

function isAudioAsset(value, slot) {
  if (value === null) return true;
  return isRecord(value)
    && ["name,url", "durationSeconds,name,url"].includes(Object.keys(value).sort().join(","))
    && value.url === mediaReference(slot)
    && typeof value.name === "string" && value.name.length <= 240
    && (value.durationSeconds === undefined || isFiniteNumber(value.durationSeconds, 86_400));
}

function isLayerLayout(value) {
  return isRecord(value) && hasExactKeys(value, ["rotation", "scale", "x", "y"])
    && isFiniteNumber(value.x, 2_000)
    && isFiniteNumber(value.y, 2_000)
    && isFiniteNumber(value.rotation, 1_440)
    && isFiniteNumber(value.scale, 10)
    && value.scale > 0;
}

function isTextStyle(value) {
  return isRecord(value) && hasExactKeys(value, ["align", "ink", "size", "weight"])
    && INK_COLORS.has(value.ink)
    && ["left", "center", "right"].includes(value.align)
    && ["small", "regular", "large"].includes(value.size)
    && ["regular", "emphasis"].includes(value.weight);
}

function isTextBlockList(value) {
  if (!Array.isArray(value) || value.length > 12) return false;
  const ids = new Set();
  let totalLength = 0;
  return value.every((block) => {
    if (!isRecord(block)
      || !["crossedOut,id,layout,words", "crossedOut,id,layout,style,words"].includes(Object.keys(block).sort().join(","))
      || typeof block.id !== "string" || block.id.length === 0 || block.id.length > 100 || ids.has(block.id)
      || typeof block.words !== "string" || block.words.length > 4_000
      || !isCrossOutList(block.crossedOut, block.words.length)
      || !isLayerLayout(block.layout)
      || (block.style !== undefined && !isTextStyle(block.style))) return false;
    ids.add(block.id);
    totalLength += block.words.length;
    return totalLength <= 10_000;
  });
}

function isScrapbook(value, snapshot) {
  if (!isRecord(value) || !hasExactKeys(value, ["marks", "order", "photos"])
    || !Array.isArray(value.photos) || value.photos.length > 4
    || !Array.isArray(value.marks) || value.marks.length > 12
    || !Array.isArray(value.order)) return false;
  const ids = new Set();
  const claimId = (id) => {
    if (!isItemId(id) || ids.has(id)) return false;
    ids.add(id);
    return true;
  };
  if (!value.photos.every((photo) => isRecord(photo) && hasExactKeys(photo, ["asset", "caption", "frame", "id", "layout"])
    && claimId(photo.id) && isCaptureAsset(photo.asset) && isLayerLayout(photo.layout)
    && hasExactKeys(photo.layout, ["rotation", "scale", "x", "y"])
    && ["plain", "polaroid", "tape"].includes(photo.frame)
    && typeof photo.caption === "string" && photo.caption.length <= 100)) return false;
  if (!value.marks.every((mark) => isRecord(mark) && hasExactKeys(mark, ["id", "ink", "kind", "layout"])
    && claimId(mark.id) && STICKER_IDS.has(mark.kind) && INK_COLORS.has(mark.ink)
    && isLayerLayout(mark.layout) && hasExactKeys(mark.layout, ["rotation", "scale", "x", "y"]))) return false;
  const blocks = snapshot.textBlocks ?? (snapshot.words ? [{ id: "text-legacy" }] : []);
  if (!blocks.every((block) => claimId(block.id))) return false;
  if (snapshot.voice && snapshot.pieces.includes("voice")) ids.add("voice");
  if (snapshot.song && snapshot.pieces.includes("song")) ids.add("song");
  return value.order.length === ids.size && new Set(value.order).size === ids.size
    && value.order.every((id) => typeof id === "string" && ids.has(id));
}

function isStrokeList(value) {
  return Array.isArray(value) && value.length <= 160 && value.every((stroke) => isRecord(stroke)
    && hasExactKeys(stroke, ["id", "points"])
    && typeof stroke.id === "string" && stroke.id.length > 0 && stroke.id.length <= 100
    && Array.isArray(stroke.points) && stroke.points.length <= 1_200
    && stroke.points.every((point) => isRecord(point)
      && hasExactKeys(point, ["x", "y"])
      && isFiniteNumber(point.x, 2_000) && isFiniteNumber(point.y, 2_000)));
}

function isCrossOutList(value, wordLength) {
  return Array.isArray(value) && value.every((range) => isRecord(range)
    && hasExactKeys(range, ["end", "start"])
    && Number.isInteger(range.start) && Number.isInteger(range.end)
    && range.start >= 0 && range.start < range.end && range.end <= wordLength);
}

function isEnumList(value, allowed, maxLength) {
  return Array.isArray(value) && value.length <= maxLength && value.every((item) => allowed.has(item));
}

function isItemId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(value)
    && !["voice", "song", "__proto__", "prototype", "constructor"].includes(value);
}

function isFiniteNumber(value, limit) {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function hasExactKeys(value, expected) {
  return Object.keys(value).sort().join(",") === [...expected].sort().join(",");
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isCapability(value, length) {
  return typeof value === "string" && value.length === length && /^[A-Za-z0-9_-]+$/.test(value);
}

function compareSlots(a, b) {
  return MEDIA_SLOTS.indexOf(a) - MEDIA_SLOTS.indexOf(b);
}

function equals(bytes, expected) {
  return bytes.length >= expected.length && expected.every((value, index) => bytes[index] === value);
}

function snapshotError() {
  return new HostedValidationError("INVALID_SNAPSHOT", "Keepsake snapshot is not safe for hosted transport.");
}
