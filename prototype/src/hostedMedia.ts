// Moves a finished keepsake's bounded local media between the maker and receiver flows.

export type HostedMedia = { slot: string; url: string; mime: string; bytes: number };
export type HostedKeepsake = { receiverId: string; snapshot: Record<string, unknown>; media: HostedMedia[]; objectUrls: string[] };
type Uploadable = { slot: string; mime: string; bytes: number; filename: string; blob: Blob };
type PublishSession = { key: string; draftToken: string; idempotencyKey: string; draftId?: string; prepared?: Record<string, unknown>; uploads?: Array<{ slot: string; url: string; headers?: Record<string, string> }> };

const PHOTO_LIMIT = 4;
const PHOTO_BYTES = 8 * 1024 * 1024;
const VOICE_BYTES = 12 * 1024 * 1024;
const SONG_BYTES = 20 * 1024 * 1024;
const TOTAL_BYTES = 32 * 1024 * 1024;
let pending: PublishSession | null = null;

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function filename(slot: string, mime: string) {
  const base = mime.split(";", 1)[0].toLowerCase();
  const extension = ({ "audio/webm": "webm", "audio/mpeg": "mp3", "audio/mp4": "m4a", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>)[base] ?? base.split("/")[1]?.replace(/[^a-z0-9]/gi, "") ?? "bin";
  return `${slot}.${extension}`;
}

async function localFile(slot: string, url: unknown): Promise<Uploadable | null> {
  if (typeof url !== "string" || !url.startsWith("blob:")) return null;
  const blob = await fetch(url).then((response) => response.blob());
  const mime = (blob.type || "application/octet-stream").split(";", 1)[0].toLowerCase();
  return { slot, mime, bytes: blob.size, filename: filename(slot, mime), blob };
}

function cloneSnapshot(snapshot: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(snapshot)) as Record<string, unknown>;
}

export async function prepareHostedPublish(snapshot: Record<string, unknown>) {
  const prepared = cloneSnapshot(snapshot);
  const scrapbook = prepared.scrapbook as { photos?: Array<{ asset?: { kind?: string; url?: string } }> } | undefined;
  const photos = scrapbook?.photos ?? [];
  if (photos.length > PHOTO_LIMIT) throw new Error("This page has too many photos to give. Keep four or fewer.");
  const uploads: Uploadable[] = [];
  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    if (photo.asset?.kind === "video" && typeof photo.asset.url === "string" && photo.asset.url.startsWith("blob:")) throw new Error("Video stays on this device for now. Remove the video before giving this page.");
    const file = await localFile(`photo-${index}`, photo.asset?.url);
    if (!file) continue;
    if (!file.mime.startsWith("image/")) throw new Error("Choose a photo image before giving this page.");
    if (file.bytes > PHOTO_BYTES) throw new Error("Each photo needs to be 8 MB or smaller.");
    uploads.push(file);
    if (photo.asset) photo.asset.url = `media:${file.slot}`;
  }
  const capture = prepared.capture as { url?: string } | null;
  if (capture?.url?.startsWith("blob:")) {
    const first = uploads[0];
    if (!first) throw new Error("That photo could not be prepared. Try choosing it again.");
    capture.url = `media:${first.slot}`;
  }
  for (const [kind, limit] of [["voice", VOICE_BYTES], ["song", SONG_BYTES]] as const) {
    const asset = prepared[kind] as { url?: string } | null;
    const file = await localFile(kind, asset?.url);
    if (!file) continue;
    if (!file.mime.startsWith("audio/")) throw new Error(`Choose an audio file for the ${kind}.`);
    if (file.bytes > limit) throw new Error(kind === "voice" ? "Your voice note needs to be 12 MB or smaller." : "Your song needs to be 20 MB or smaller.");
    uploads.push(file);
    if (asset) asset.url = `media:${kind}`;
  }
  if (uploads.reduce((total, file) => total + file.bytes, 0) > TOTAL_BYTES) throw new Error("Your photos and audio together need to be 32 MB or smaller.");
  return { prepared, uploads };
}

export async function publishHostedKeepsake(snapshot: Record<string, unknown>, presenterCode: string) {
  if (!presenterCode.trim()) throw new Error("Enter the presenter code to prepare this keepsake.");
  const { prepared, uploads } = await prepareHostedPublish(snapshot);
  const key = JSON.stringify({ originalMedia: [snapshot.capture, snapshot.voice, snapshot.song, (snapshot.scrapbook as { photos?: unknown[] } | undefined)?.photos], prepared, media: uploads.map(({ slot, mime, bytes, filename }) => ({ slot, mime, bytes, filename })) });
  if (!pending || pending.key !== key) pending = { key, draftToken: randomToken(), idempotencyKey: crypto.randomUUID() };
  // Start is idempotent and deliberately repeated: it refreshes short-lived URLs and returns only missing slots.
  {
    const response = await fetch("/api/publish-start", { method: "POST", headers: { Authorization: `Bearer ${presenterCode.trim()}`, "Content-Type": "application/json" }, body: JSON.stringify({ snapshot: prepared, media: uploads.map(({ slot, mime, bytes, filename }) => ({ slot, mime, bytes, filename })), idempotencyKey: pending.idempotencyKey, draftToken: pending.draftToken }) });
    if (!response.ok) throw new Error("This keepsake could not be prepared. Check the presenter code and try again.");
    const body = await response.json() as { draftId: string; uploads: PublishSession["uploads"] };
    pending = { ...pending, draftId: body.draftId, prepared, uploads: body.uploads };
  }
  for (const upload of pending.uploads ?? []) {
    const file = uploads.find((candidate) => candidate.slot === upload.slot);
    if (!file) throw new Error("One piece is missing. Return to the page and try again.");
    const response = await fetch(upload.url, { method: "PUT", headers: upload.headers, body: file.blob });
    if (!response.ok) throw new Error("One piece did not make it across. Try again.");
  }
  const finalized = await fetch("/api/publish-finalize", { method: "POST", headers: { Authorization: `Bearer ${pending.draftToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ draftId: pending.draftId }) });
  if (!finalized.ok) throw new Error("The keepsake is still getting ready. Try again.");
  const result = await finalized.json() as { receiverId: string; path: string };
  pending = null;
  return result;
}

function hydrateSnapshot(snapshot: Record<string, unknown>, urls: Map<string, string>) {
  const hydrated = cloneSnapshot(snapshot);
  const replaceAsset = (value: unknown) => {
    if (value && typeof value === "object" && typeof (value as { url?: unknown }).url === "string") (value as { url: string }).url = urls.get((value as { url: string }).url) ?? (value as { url: string }).url;
  };
  replaceAsset(hydrated.capture); replaceAsset(hydrated.voice); replaceAsset(hydrated.song);
  const photos = (hydrated.scrapbook as { photos?: Array<{ asset?: unknown }> } | undefined)?.photos ?? [];
  photos.forEach((photo) => replaceAsset(photo.asset));
  return hydrated;
}

export async function loadHostedKeepsake(receiverId: string): Promise<HostedKeepsake> {
  const manifest = await fetch(`/api/keepsake?id=${encodeURIComponent(receiverId)}`);
  if (!manifest.ok) throw new Error("This keepsake could not be found.");
  const body = await manifest.json() as { snapshot: Record<string, unknown>; media: HostedMedia[] };
  const objectUrls: string[] = [];
  try {
    const urlEntries = await Promise.all(body.media.map(async (media) => {
      const response = await fetch(media.url);
      if (!response.ok) throw new Error("One piece could not be opened.");
      const url = URL.createObjectURL(await response.blob()); objectUrls.push(url);
      return [`media:${media.slot}`, url] as const;
    }));
    return { receiverId, snapshot: hydrateSnapshot(body.snapshot, new Map(urlEntries)), media: body.media, objectUrls };
  } catch (error) { objectUrls.forEach((url) => URL.revokeObjectURL(url)); throw error; }
}
