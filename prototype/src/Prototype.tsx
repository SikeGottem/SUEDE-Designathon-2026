// Implements the transcript-led maker, carrier, handoff, and receiver experience inside the protected mobile runtime.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { QRCodeSVG } from "qrcode.react";
import { createPortal } from "react-dom";
import { Carousel, KeyboardInput, KeyboardTextarea, MobileScroll, useKeyboard } from "./mobile";

// Editing responds immediately; physical paper and carrier scenes share a deliberate cadence.
const motionEase = { ui: [0.23, 1, 0.32, 1], travel: [0.77, 0, 0.175, 1] } as const;
const motionTiming = {
  enter: .18, exit: .12, fold: 1.32, open: 1.32, hub: 1.2,
  departure: { bottle: 5.8, firefly: 5.2, plane: 4.8 },
  arrival: { bottle: 2.8, firefly: 3.2, plane: 2.6 },
} as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(reducedMotionQuery);
  if (media.addEventListener) {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }
  media.addListener(listener);
  return () => media.removeListener(listener);
}
function getReducedMotionSnapshot() { return typeof window !== "undefined" && window.matchMedia(reducedMotionQuery).matches; }
function useLiveReducedMotion() { return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false); }

type Phase =
  | "home"
  | "menu"
  | "recipient"
  | "studio"
  | "envelope"
  | "carrier"
  | "preview"
  | "handoff"
  | "sent"
  | "arrival"
  | "deferred"
  | "unavailable"
  | "opening"
  | "reveal"
  | "cabinet"
  | "removed";

type CarrierId = "bottle" | "firefly" | "plane";
type PieceId = "photo" | "voice" | "song" | "drawing";
type StickerId = "burst" | "ribbon" | "stamp";
type InkColor = "navy" | "forest" | "rust" | "plum" | "ochre";
type PaperId = "plain" | "dotted" | "grid" | "ruled" | "note";
type CrossOut = { start: number; end: number };
type EnvelopeId = "mail" | "night" | "rust";
type StudioMode = "capture" | "compose";
type CaptureMode = "photo" | "video";
type CaptureAsset = {
  kind: CaptureMode | "sample";
  url?: string;
};
type DoodlePoint = { x: number; y: number };
type DoodleStroke = { id: string; points: DoodlePoint[] };
type SealWeight = "soft" | "bold";
type PersonalStamp = { strokes: DoodleStroke[]; weight: SealWeight };
type AudioAsset = { url: string; name: string; durationSeconds?: number };
type LayerId = "words" | Exclude<PieceId, "drawing"> | StickerId;
type LayerLayout = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};
type TextStyle = { ink: InkColor; align: "left" | "center" | "right"; size: "small" | "regular" | "large"; weight: "regular" | "emphasis" };
type PhotoPiece = { id: string; asset: CaptureAsset; layout: LayerLayout; frame: "plain" | "polaroid" | "tape"; caption: string };
type MarkPiece = { id: string; kind: StickerId; layout: LayerLayout; ink: InkColor };
type Scrapbook = { photos: PhotoPiece[]; marks: MarkPiece[]; order: string[] };
type TextBlock = {
  id: string;
  words: string;
  crossedOut: CrossOut[];
  layout: LayerLayout;
  style?: TextStyle;
};

type KeepsakeSnapshot = {
  v: 1;
  id: string;
  sender: string;
  recipient: string;
  words: string;
  crossedOut: CrossOut[];
  paper: PaperId;
  carrier: CarrierId;
  envelope: EnvelopeId;
  seal: DoodleStroke[];
  sealWeight?: SealWeight;
  pieces: PieceId[];
  capture: CaptureAsset | null;
  voice: AudioAsset | null;
  song: AudioAsset | null;
  doodles: DoodleStroke[];
  stickers: StickerId[];
  inkColor: InkColor;
  layouts: Record<LayerId, LayerLayout>;
  textBlocks?: TextBlock[];
  scrapbook?: Scrapbook;
};

const CECILIA = "/assets/illustrations/cecilia-collection/";
const artwork = {
  firefly: {
    outline: `${CECILIA}couriers/firefly-outline.png`,
    filledA: `${CECILIA}couriers/firefly-filled-a.png`,
    filledB: `${CECILIA}couriers/firefly-filled-b.png`,
    carrying: `${CECILIA}couriers/firefly-carrying.png`,
  },
  containers: {
    bottleReady: `${CECILIA}containers/bottle-classic.png`,
    envelope: `${CECILIA}containers/envelope-outline.png`,
    plane: `${CECILIA}containers/paper-plane.png`,
  },
  environment: {
    planeClouds: `${CECILIA}environment/clouds-alt.png`,
    planeCloudTop: `${CECILIA}environment/plane-cloud-top.png`,
    planeCloudMiddle: `${CECILIA}environment/plane-cloud-middle.png`,
    planeCloudBottom: `${CECILIA}environment/plane-cloud-bottom.png`,
    reeds: `${CECILIA}environment/reeds.png`,
    sun: `${CECILIA}environment/sun.png`,
    waveA: `${CECILIA}environment/wave-divider-a.png`,
    waveB: `${CECILIA}environment/wave-divider-b.png`,
  },
  seal: {
    base: `${CECILIA}seals/stamp-neutral-circle-thick.png`,
  },
} as const;
const CABINET_KEY = "warm-fuzzies-cabinet-v1";
const PERSONAL_STAMP_KEY = "warm-fuzzies-personal-stamp-v1";
const LINK_MAX = 12_000;
const QR_MAX = 1_200;
const MAX_TEXT_BLOCKS = 12;
const MAX_PHOTOS = 4;
const MAX_MARKS = 12;
const carrierIds: CarrierId[] = ["bottle", "firefly", "plane"];
const paperIds: PaperId[] = ["plain", "dotted", "grid", "ruled", "note"];
const envelopeIds: EnvelopeId[] = ["mail", "night", "rust"];
const pieceIds: PieceId[] = ["photo", "voice", "song", "drawing"];
const stickerIds: StickerId[] = ["burst", "ribbon", "stamp"];
const inkColors: InkColor[] = ["navy", "forest", "rust", "plum", "ochre"];
const inkLabels: Record<InkColor, string> = {
  navy: "deep ink",
  forest: "olive",
  rust: "rust",
  plum: "steel blue",
  ochre: "ochre",
};
const layerIds: LayerId[] = ["words", "photo", "voice", "song", "burst", "ribbon", "stamp"];

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(base64);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function packStrokes(strokes: DoodleStroke[]) {
  return strokes.map((stroke) => {
    let previousX = 0;
    let previousY = 0;
    return stroke.points.flatMap((point, index) => {
      const x = Math.round(point.x * 10);
      const y = Math.round(point.y * 10);
      const pair = index === 0 ? [x, y] : [x - previousX, y - previousY];
      previousX = x;
      previousY = y;
      return pair;
    });
  });
}

function unpackStrokes(value: unknown): unknown {
  if (!Array.isArray(value)) return null;
  return value.map((stroke, strokeIndex) => {
    if (!Array.isArray(stroke) || stroke.length % 2 !== 0 || !stroke.every(Number.isInteger)) return null;
    let x = 0;
    let y = 0;
    const points: DoodlePoint[] = [];
    for (let index = 0; index < stroke.length; index += 2) {
      x = index === 0 ? Number(stroke[index]) : x + Number(stroke[index]);
      y = index === 0 ? Number(stroke[index + 1]) : y + Number(stroke[index + 1]);
      points.push({ x: x / 10, y: y / 10 });
    }
    return { id: `transport-${strokeIndex}`, points };
  });
}

function unpackCrossedOut(value: unknown): unknown {
  if (!Array.isArray(value)) return null;
  return value.map((range) => Array.isArray(range) && range.length === 2 ? { start: range[0], end: range[1] } : null);
}

function packTextBlocks(blocks: TextBlock[]) {
  return blocks.map((block) => [
    block.id,
    block.words,
    block.crossedOut.map((range) => [range.start, range.end]),
    [block.layout.x, block.layout.y, block.layout.rotation, block.layout.scale],
    ...(block.style ? [[block.style.ink, block.style.align, block.style.size, block.style.weight]] : []),
  ]);
}

function unpackTextBlocks(value: unknown): unknown {
  if (!Array.isArray(value)) return null;
  return value.map((block) => {
    if (!Array.isArray(block) || ![4, 5].includes(block.length)) return null;
    const layout = block[3];
    return {
      ...(block.length === 5 ? { style: Array.isArray(block[4]) && block[4].length === 4 ? { ink: block[4][0], align: block[4][1], size: block[4][2], weight: block[4][3] } : null } : {}),
      id: block[0],
      words: block[1],
      crossedOut: unpackCrossedOut(block[2]),
      layout: Array.isArray(layout) && layout.length === 4
        ? { x: layout[0], y: layout[1], rotation: layout[2], scale: layout[3] }
        : null,
    };
  });
}

function encodeSnapshot(snapshot: KeepsakeSnapshot) {
  const compact = [
    snapshot.v,
    snapshot.id,
    snapshot.sender,
    snapshot.recipient,
    snapshot.words,
    snapshot.crossedOut.map((range) => [range.start, range.end]),
    snapshot.paper,
    snapshot.carrier,
    snapshot.envelope,
    packStrokes(snapshot.seal),
    snapshot.pieces,
    snapshot.capture,
    snapshot.voice,
    snapshot.song,
    packStrokes(snapshot.doodles),
    snapshot.stickers,
    snapshot.inkColor,
    layerIds.map((layer) => {
      const layout = snapshot.layouts[layer];
      return [layout.x, layout.y, layout.rotation, layout.scale];
    }),
    snapshot.sealWeight ?? "bold",
    packTextBlocks(textBlocksFromSnapshot(snapshot)),
    ...(snapshot.scrapbook ? [{
      p: snapshot.scrapbook.photos.map((photo) => [photo.id, photo.asset, [photo.layout.x, photo.layout.y, photo.layout.rotation, photo.layout.scale], photo.frame, photo.caption]),
      m: snapshot.scrapbook.marks.map((mark) => [mark.id, mark.kind, [mark.layout.x, mark.layout.y, mark.layout.rotation, mark.layout.scale], mark.ink]),
      o: snapshot.scrapbook.order,
    }] : []),
  ];
  return compressToEncodedURIComponent(JSON.stringify(compact));
}

function expandCompactSnapshot(value: unknown): unknown {
  if (!Array.isArray(value) || ![18, 19, 20, 21].includes(value.length) || !Array.isArray(value[17]) || value[17].length !== layerIds.length) return null;
  const layouts = Object.fromEntries(layerIds.map((layer, index) => {
    const layout = value[17][index];
    return [layer, Array.isArray(layout) && layout.length === 4
      ? { x: layout[0], y: layout[1], rotation: layout[2], scale: layout[3] }
      : null];
  }));
  return {
    v: value[0],
    id: value[1],
    sender: value[2],
    recipient: value[3],
    words: value[4],
    crossedOut: unpackCrossedOut(value[5]),
    paper: value[6],
    carrier: value[7],
    envelope: value[8],
    seal: unpackStrokes(value[9]),
    sealWeight: value.length >= 19 ? value[18] : "bold",
    pieces: value[10],
    capture: value[11],
    voice: value[12],
    song: value[13],
    doodles: unpackStrokes(value[14]),
    stickers: value[15],
    inkColor: value[16],
    layouts,
    textBlocks: value.length >= 20 ? unpackTextBlocks(value[19]) : undefined,
    ...(value.length === 21 ? { scrapbook: unpackScrapbook(value[20]) } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown, limit = 10_000) {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit;
}

function isStrokeList(value: unknown) {
  return Array.isArray(value) && value.length <= 160 && value.every((stroke) => {
    if (!isRecord(stroke) || typeof stroke.id !== "string" || !Array.isArray(stroke.points) || stroke.points.length > 1_200) return false;
    return stroke.points.every((point) => isRecord(point) && isFiniteNumber(point.x, 2_000) && isFiniteNumber(point.y, 2_000));
  });
}

function isCaptureAsset(value: unknown): value is CaptureAsset | null {
  if (value === null) return true;
  if (!isRecord(value) || !["photo", "video", "sample"].includes(String(value.kind))) return false;
  if (value.kind === "sample") return Object.keys(value).sort().join(",") === "kind";
  if (Object.keys(value).sort().join(",") !== "kind,url") return false;
  return typeof value.url === "string" && value.url.startsWith("blob:") && value.url.length < 2_048;
}

function isAudioAsset(value: unknown): value is AudioAsset | null {
  if (value === null) return true;
  return isRecord(value)
    && ["name,url", "durationSeconds,name,url"].includes(Object.keys(value).sort().join(","))
    && typeof value.url === "string"
    && value.url.startsWith("blob:")
    && value.url.length < 2_048
    && typeof value.name === "string"
    && value.name.length <= 240
    && (value.durationSeconds === undefined || isFiniteNumber(value.durationSeconds, 86_400));
}

function isLayerLayout(value: unknown): value is LayerLayout {
  return isRecord(value)
    && isFiniteNumber(value.x, 2_000)
    && isFiniteNumber(value.y, 2_000)
    && isFiniteNumber(value.rotation, 1_440)
    && isFiniteNumber(value.scale, 10)
    && Number(value.scale) > 0;
}

function isTextBlockList(value: unknown): value is TextBlock[] {
  if (!Array.isArray(value) || value.length > MAX_TEXT_BLOCKS) return false;
  const ids = new Set<string>();
  let totalLength = 0;
  return value.every((block) => {
    if (!isRecord(block)
      || typeof block.id !== "string" || block.id.length === 0 || block.id.length > 100 || ids.has(block.id)
      || typeof block.words !== "string" || block.words.length > 4_000
      || !Array.isArray(block.crossedOut)
      || !block.crossedOut.every((range) => isRecord(range)
        && Number.isInteger(range.start)
        && Number.isInteger(range.end)
        && Number(range.start) >= 0
        && Number(range.start) < Number(range.end)
        && Number(range.end) <= (block.words as string).length)
      || !isLayerLayout(block.layout)
      || (block.style !== undefined && !isTextStyle(block.style))) return false;
    ids.add(block.id);
    totalLength += block.words.length;
    return totalLength <= 10_000;
  });
}

function unpackScrapbook(value: unknown): unknown {
  if (!isRecord(value) || Object.keys(value).sort().join(",") !== "m,o,p" || !Array.isArray(value.p) || !Array.isArray(value.m)) return null;
  const layout = (tuple: unknown) => Array.isArray(tuple) && tuple.length === 4 ? { x: tuple[0], y: tuple[1], rotation: tuple[2], scale: tuple[3] } : null;
  return {
    photos: value.p.map((photo) => Array.isArray(photo) && photo.length === 5 ? { id: photo[0], asset: photo[1], layout: layout(photo[2]), frame: photo[3], caption: photo[4] } : null),
    marks: value.m.map((mark) => Array.isArray(mark) && mark.length === 4 ? { id: mark[0], kind: mark[1], layout: layout(mark[2]), ink: mark[3] } : null),
    order: value.o,
  };
}

function isItemId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(value) && !["voice", "song", "__proto__", "prototype", "constructor"].includes(value);
}

function isTextStyle(value: unknown): value is TextStyle {
  return isRecord(value) && Object.keys(value).sort().join(",") === "align,ink,size,weight"
    && inkColors.includes(value.ink as InkColor) && ["left", "center", "right"].includes(String(value.align))
    && ["small", "regular", "large"].includes(String(value.size)) && ["regular", "emphasis"].includes(String(value.weight));
}

function isScrapbook(value: unknown, snapshot: Record<string, unknown>): value is Scrapbook {
  if (!isRecord(value) || Object.keys(value).sort().join(",") !== "marks,order,photos"
    || !Array.isArray(value.photos) || value.photos.length > MAX_PHOTOS
    || !Array.isArray(value.marks) || value.marks.length > MAX_MARKS || !Array.isArray(value.order)) return false;
  const ids = new Set<string>();
  const claimId = (id: unknown) => { if (!isItemId(id) || ids.has(id)) return false; ids.add(id); return true; };
  if (!value.photos.every((photo) => isRecord(photo) && Object.keys(photo).sort().join(",") === "asset,caption,frame,id,layout"
    && claimId(photo.id) && isRecord(photo.asset) && Object.keys(photo.asset).sort().join(",") === (photo.asset.kind === "sample" ? "kind" : "kind,url") && isCaptureAsset(photo.asset) && isLayerLayout(photo.layout) && Object.keys(photo.layout).sort().join(",") === "rotation,scale,x,y"
    && ["plain", "polaroid", "tape"].includes(String(photo.frame)) && typeof photo.caption === "string" && photo.caption.length <= 100)) return false;
  if (!value.marks.every((mark) => isRecord(mark) && Object.keys(mark).sort().join(",") === "id,ink,kind,layout"
    && claimId(mark.id) && stickerIds.includes(mark.kind as StickerId) && inkColors.includes(mark.ink as InkColor) && isLayerLayout(mark.layout) && Object.keys(mark.layout).sort().join(",") === "rotation,scale,x,y")) return false;
  const blocks = snapshot.textBlocks as TextBlock[] | undefined;
  if (!(blocks ?? (snapshot.words ? [{ id: "text-legacy" }] : [])).every((block) => claimId(block.id))) return false;
  if (snapshot.voice && (snapshot.pieces as PieceId[]).includes("voice")) ids.add("voice");
  if (snapshot.song && (snapshot.pieces as PieceId[]).includes("song")) ids.add("song");
  return value.order.length === ids.size && new Set(value.order).size === ids.size
    && value.order.every((id) => typeof id === "string" && ids.has(id));
}

function isSafeSnapshot(value: unknown): value is KeepsakeSnapshot {
  if (!isRecord(value)) return false;
  if (value.v !== 1
    || typeof value.id !== "string" || value.id.length > 160
    || typeof value.sender !== "string" || value.sender.length > 120
    || typeof value.recipient !== "string" || value.recipient.length > 120
    || typeof value.words !== "string" || value.words.length > 10_000
    || !paperIds.includes(value.paper as PaperId)
    || !carrierIds.includes(value.carrier as CarrierId)
    || !envelopeIds.includes(value.envelope as EnvelopeId)
    || (value.sealWeight !== undefined && value.sealWeight !== "soft" && value.sealWeight !== "bold")
    || !inkColors.includes(value.inkColor as InkColor)
    || !Array.isArray(value.pieces) || value.pieces.length > pieceIds.length || !value.pieces.every((piece) => pieceIds.includes(piece as PieceId))
    || !Array.isArray(value.stickers) || value.stickers.length > stickerIds.length || !value.stickers.every((sticker) => stickerIds.includes(sticker as StickerId))
    || !Array.isArray(value.crossedOut)
    || !value.crossedOut.every((range) => isRecord(range) && Number.isInteger(range.start) && Number.isInteger(range.end) && Number(range.start) >= 0 && Number(range.start) < Number(range.end) && Number(range.end) <= (value.words as string).length)
    || !isStrokeList(value.doodles)
    || !isStrokeList(value.seal)
    || !isCaptureAsset(value.capture)
    || !isAudioAsset(value.voice)
    || !isAudioAsset(value.song)
    || !isRecord(value.layouts)
    || !layerIds.every((layer) => isLayerLayout((value.layouts as Record<string, unknown>)[layer]))
    || (value.textBlocks !== undefined && !isTextBlockList(value.textBlocks))) return false;
  return value.scrapbook === undefined || isScrapbook(value.scrapbook, value);
}

function textBlocksFromSnapshot(snapshot: KeepsakeSnapshot): TextBlock[] {
  const blocks = snapshot.textBlocks && (snapshot.textBlocks.length > 0 || snapshot.scrapbook)
    ? snapshot.textBlocks
    : snapshot.words ? [{ id: "text-legacy", words: snapshot.words, crossedOut: snapshot.crossedOut, layout: snapshot.layouts.words }] : [];
  // Older links allowed names that collide with material IDs; preserve their words under stable editor IDs.
  const used = new Set(snapshot.scrapbook ? [] : ["photo", "voice", "song", ...snapshot.stickers.map((kind, index) => snapshot.stickers.indexOf(kind) === index ? kind : `${kind}-legacy-${index}`)]);
  return blocks.map((block, index) => {
    let id = block.id;
    if (!snapshot.scrapbook && (!isItemId(id) || used.has(id))) {
      let suffix = index;
      do { id = `text-legacy-${suffix++}`; } while (used.has(id));
    }
    used.add(id);
    return { ...block, id, crossedOut: block.crossedOut.map((range) => ({ ...range })), layout: { ...block.layout }, style: { ...textStyle(block, snapshot.inkColor) } };
  });
}

function textStyle(block: TextBlock, ink: InkColor): TextStyle {
  return block.style ?? { ink, align: "left", size: "regular", weight: "regular" };
}

function completeOrder(order: string[], liveIds: string[]) {
  const live = new Set(liveIds);
  return [...new Set([...order.filter((id) => live.has(id)), ...liveIds])];
}

function scrapbookFromSnapshot(snapshot: KeepsakeSnapshot): Scrapbook {
  const photos = snapshot.scrapbook?.photos ?? (snapshot.capture ? [{ id: "photo", asset: snapshot.capture, layout: snapshot.layouts.photo, frame: "tape" as const, caption: "" }] : []);
  const marks = snapshot.scrapbook?.marks ?? snapshot.stickers.map((kind, index) => ({ id: snapshot.stickers.indexOf(kind) === index ? kind : `${kind}-legacy-${index}`, kind, layout: snapshot.layouts[kind], ink: snapshot.inkColor }));
  const ids = [...photos.map((photo) => photo.id), ...textBlocksFromSnapshot(snapshot).map((block) => block.id), ...(snapshot.voice && snapshot.pieces.includes("voice") ? ["voice"] : []), ...(snapshot.song && snapshot.pieces.includes("song") ? ["song"] : []), ...marks.map((mark) => mark.id)];
  return { photos: photos.map((photo) => ({ ...photo, asset: { ...photo.asset }, layout: { ...photo.layout } })), marks: marks.map((mark) => ({ ...mark, layout: { ...mark.layout } })), order: completeOrder(snapshot.scrapbook?.order ?? [], ids) };
}

function containsBlobMedia(snapshot: Pick<KeepsakeSnapshot, "capture" | "voice" | "song" | "scrapbook">) {
  return [snapshot.capture?.url, snapshot.voice?.url, snapshot.song?.url, ...(snapshot.scrapbook?.photos.map((photo) => photo.asset.url) ?? [])].some((url) => url?.startsWith("blob:"));
}

function snapshotFromHash(): KeepsakeSnapshot | null {
  if (typeof window === "undefined") return null;
  const isCompact = window.location.hash.startsWith("#v3.");
  const isCompressed = isCompact || window.location.hash.startsWith("#v2.");
  const isLegacy = window.location.hash.startsWith("#v1.");
  if (!isCompressed && !isLegacy) return null;
  const encoded = window.location.hash.slice(4);
  if (!encoded || encoded.length > LINK_MAX) return null;
  try {
    const decoded = isCompressed ? decompressFromEncodedURIComponent(encoded) : base64UrlDecode(encoded);
    if (!decoded || decoded.length > 250_000) return null;
    const decodedValue: unknown = JSON.parse(decoded);
    const parsed: unknown = isCompact ? expandCompactSnapshot(decodedValue) : decodedValue;
    return isSafeSnapshot(parsed) && !containsBlobMedia(parsed) ? parsed : null;
  } catch { return null; }
}

function loadCabinet() {
  if (typeof window === "undefined") return [] as KeepsakeSnapshot[];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(CABINET_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isSafeSnapshot).filter((item) => !containsBlobMedia(item)).slice(0, 12) : [];
  } catch { return [] as KeepsakeSnapshot[]; }
}

function loadPersonalStamp(): PersonalStamp | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(PERSONAL_STAMP_KEY) ?? "[]");
    if (isStrokeList(parsed)) return { strokes: parsed as DoodleStroke[], weight: "bold" };
    if (isRecord(parsed) && isStrokeList(parsed.strokes) && (parsed.weight === "soft" || parsed.weight === "bold")) return { strokes: parsed.strokes as DoodleStroke[], weight: parsed.weight };
    return null;
  } catch { return null; }
}

type Carrier = {
  id: CarrierId;
  label: string;
  shortLabel: string;
  description: string;
};

const sender = "Ethan";
const carriers: Carrier[] = [
  {
    id: "bottle",
    label: "a note through the tide",
    shortLabel: "bottle",
    description: "A little bottle bobs in, carrying the paper you made.",
  },
  {
    id: "firefly",
    label: "a firefly courier",
    shortLabel: "firefly",
    description: "A firefly carries it home, then leaves.",
  },
  {
    id: "plane",
    label: "a paper plane",
    shortLabel: "plane",
    description: "A folded plane lands quietly, carrying the paper you made.",
  },
];

const pieceLabels: Record<PieceId, string> = {
  photo: "photo",
  voice: "voice",
  song: "song",
  drawing: "doodle",
};

const defaultLayerLayouts: Record<LayerId, LayerLayout> = {
  words: { x: 0, y: 82, rotation: -1.5, scale: 1 },
  photo: { x: -34, y: -176, rotation: -3, scale: 1 },
  voice: { x: -42, y: 160, rotation: 2, scale: 1 },
  song: { x: 42, y: 168, rotation: -2.5, scale: 1 },
  burst: { x: 86, y: -178, rotation: 7, scale: 1 },
  ribbon: { x: -92, y: 112, rotation: -8, scale: 1 },
  stamp: { x: 92, y: 126, rotation: 5, scale: 1 },
};

// The fixed rehearsal links both start from this one serializable artifact.
const rehearsalArtifact: KeepsakeSnapshot = {
  v: 1,
  id: "warm-fuzzies-demo",
  sender,
  recipient: "Maya",
  words: "You made the first week in a new place feel familiar. You noticed what I needed before I knew how to ask.",
  crossedOut: [],
  paper: "ruled",
  carrier: "firefly",
  envelope: "night",
  seal: [{ id: "demo-seal", points: [{ x: 105, y: 290 }, { x: 142, y: 240 }, { x: 180, y: 292 }, { x: 218, y: 240 }, { x: 255, y: 290 }, { x: 180, y: 380 }, { x: 105, y: 290 }] }],
  pieces: ["photo"],
  capture: { kind: "sample" },
  voice: null,
  song: null,
  doodles: [],
  stickers: [],
  inkColor: "navy",
  layouts: defaultLayerLayouts,
};

function cloneSnapshot(snapshot: KeepsakeSnapshot): KeepsakeSnapshot {
  const cloneStrokes = (strokes: DoodleStroke[]) => strokes.map((stroke) => ({
    ...stroke,
    points: stroke.points.map((point) => ({ ...point })),
  }));
  return {
    ...snapshot,
    crossedOut: snapshot.crossedOut.map((range) => ({ ...range })),
    seal: cloneStrokes(snapshot.seal),
    pieces: [...snapshot.pieces],
    capture: snapshot.capture ? { ...snapshot.capture } : null,
    voice: snapshot.voice ? { ...snapshot.voice } : null,
    song: snapshot.song ? { ...snapshot.song } : null,
    doodles: cloneStrokes(snapshot.doodles),
    stickers: [...snapshot.stickers],
    layouts: Object.fromEntries(layerIds.map((layer) => [layer, { ...snapshot.layouts[layer] }])) as Record<LayerId, LayerLayout>,
    textBlocks: textBlocksFromSnapshot(snapshot),
    scrapbook: scrapbookFromSnapshot(snapshot),
  };
}

function rehearsalRouteFromPath(): "create" | "receive" | null {
  if (typeof window === "undefined") return null;
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/demo/create") return "create";
  if (pathname === "/demo" || pathname === "/demo/receive") return "receive";
  return null;
}

function phaseFromQuery(): Phase | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("screen");
  const phases: Phase[] = ["home", "menu", "recipient", "studio", "envelope", "carrier", "preview", "handoff", "sent", "arrival", "deferred", "unavailable", "opening", "reveal", "cabinet", "removed"];
  return phases.includes(value as Phase) ? (value as Phase) : null;
}

export default function Prototype() {
  const rehearsalRoute = rehearsalRouteFromPath();
  const isRehearsalCreate = rehearsalRoute === "create";
  const isDemoReceiver = rehearsalRoute === "receive";
  const isRehearsalRoute = rehearsalRoute !== null;
  const requestedPhase = isRehearsalCreate ? null : phaseFromQuery();
  const hashPresent = !isRehearsalCreate && !isDemoReceiver && typeof window !== "undefined" && (window.location.hash.startsWith("#v1.") || window.location.hash.startsWith("#v2.") || window.location.hash.startsWith("#v3."));
  const demoPayloadAttempted = isDemoReceiver && typeof window !== "undefined" && /^#v[123]\./.test(window.location.hash);
  const demoSnapshot = isDemoReceiver && window.location.hash.startsWith("#v3.") ? snapshotFromHash() : null;
  const demoPayloadInvalid = demoPayloadAttempted && !demoSnapshot;
  const linkedSnapshot = isDemoReceiver
    ? demoSnapshot ?? cloneSnapshot(rehearsalArtifact)
    : isRehearsalCreate
      ? null
      : snapshotFromHash();
  const seededPreview = !rehearsalRoute && Boolean(requestedPhase && !["home", "menu", "recipient"].includes(requestedPhase));
  // Normal bearer fragments win over query previews; demo receive only accepts valid v3 artifacts and otherwise opens its fallback.
  const [phase, setPhase] = useState<Phase>(() => isRehearsalCreate ? "home" : demoPayloadInvalid ? "unavailable" : linkedSnapshot ? "arrival" : (hashPresent ? "unavailable" : requestedPhase ?? "home"));
  const [carrierId, setCarrierId] = useState<CarrierId>(() => linkedSnapshot?.carrier ?? "bottle");
  const [recipient, setRecipient] = useState(() => linkedSnapshot?.recipient ?? (isRehearsalCreate ? rehearsalArtifact.recipient : seededPreview ? "Maya" : ""));
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>(() => linkedSnapshot
    ? textBlocksFromSnapshot(linkedSnapshot)
    : seededPreview ? textBlocksFromSnapshot(rehearsalArtifact) : []);
  const [paper, setPaper] = useState<PaperId>(() => linkedSnapshot?.paper ?? "dotted");
  const [envelope, setEnvelope] = useState<EnvelopeId>(() => linkedSnapshot?.envelope ?? "mail");
  const [seal, setSeal] = useState<DoodleStroke[]>(() => linkedSnapshot?.seal ?? []);
  const [sealWeight, setSealWeight] = useState<SealWeight>(() => linkedSnapshot?.sealWeight ?? "bold");
  const [savedSeal, setSavedSeal] = useState<PersonalStamp | null>(loadPersonalStamp);
  const [pieces, setPieces] = useState<PieceId[]>(() => linkedSnapshot?.pieces ?? (seededPreview ? ["photo"] : []));
  const [cuesOpen, setCuesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [cabinet, setCabinet] = useState<KeepsakeSnapshot[]>(() => isRehearsalRoute ? [] : loadCabinet());
  const [lastRemoved, setLastRemoved] = useState<KeepsakeSnapshot | null>(null);
  const [activeSnapshot, setActiveSnapshot] = useState<KeepsakeSnapshot | null>(linkedSnapshot);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [cabinetRemovingId, setCabinetRemovingId] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<StudioMode>("compose");
  const [photos, setPhotos] = useState<PhotoPiece[]>(() => linkedSnapshot ? scrapbookFromSnapshot(linkedSnapshot).photos : seededPreview ? scrapbookFromSnapshot(rehearsalArtifact).photos : []);
  const captureAsset = photos[0]?.asset ?? null;
  const [voiceAsset, setVoiceAsset] = useState<AudioAsset | null>(() => linkedSnapshot?.voice ?? null);
  const [songAsset, setSongAsset] = useState<AudioAsset | null>(() => linkedSnapshot?.song ?? null);
  const [doodleStrokes, setDoodleStrokes] = useState<DoodleStroke[]>(() => linkedSnapshot?.doodles ?? []);
  const [marks, setMarks] = useState<MarkPiece[]>(() => linkedSnapshot ? scrapbookFromSnapshot(linkedSnapshot).marks : []);
  const [itemOrder, setItemOrder] = useState<string[]>(() => linkedSnapshot ? scrapbookFromSnapshot(linkedSnapshot).order : []);
  const stickers = useMemo(() => [...new Set(marks.map((mark) => mark.kind))], [marks]);
  const [inkColor, setInkColor] = useState<InkColor>(() => linkedSnapshot?.inkColor ?? "navy");
  const [layerLayouts, setLayerLayouts] = useState<Record<LayerId, LayerLayout>>(() => linkedSnapshot?.layouts ?? defaultLayerLayouts);
  const [draftId, setDraftId] = useState(() => linkedSnapshot?.id ?? `wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`);
  const mediaUrlsRef = useRef<Set<string>>(new Set());
  const keyboard = useKeyboard();
  const reduceMotion = useLiveReducedMotion();
  const carrier = carriers.find((item) => item.id === carrierId) ?? carriers[0];

  useEffect(() => {
    const screen = document.querySelector<HTMLElement>("[data-phone-screen]");
    if (!screen) return;
    // Focus can scroll an overflow-hidden shell and expose the parked keyboard.
    const keepScreenFixed = () => {
      if (screen.scrollTop || screen.scrollLeft) screen.scrollTo(0, 0);
    };
    screen.addEventListener("scroll", keepScreenFixed, { passive: true });
    keepScreenFixed();
    return () => screen.removeEventListener("scroll", keepScreenFixed);
  }, []);

  const currentSnapshot = useMemo<KeepsakeSnapshot>(() => {
    const authoredText = textBlocks.filter((block) => block.words.trim());
    const primaryText = authoredText[0];
    return {
      v: 1,
      id: draftId,
      sender,
      recipient,
      words: primaryText?.words ?? "",
      crossedOut: primaryText?.crossedOut ?? [],
      paper,
      carrier: carrierId,
      envelope,
      seal,
      sealWeight,
      pieces,
      capture: captureAsset,
      voice: voiceAsset,
      song: songAsset,
      doodles: doodleStrokes,
      stickers,
      inkColor,
      layouts: { ...layerLayouts, words: primaryText?.layout ?? layerLayouts.words },
      textBlocks: authoredText,
      scrapbook: { photos, marks, order: completeOrder(itemOrder, [...photos.map((photo) => photo.id), ...authoredText.map((block) => block.id), ...(voiceAsset && pieces.includes("voice") ? ["voice"] : []), ...(songAsset && pieces.includes("song") ? ["song"] : []), ...marks.map((mark) => mark.id)]) },
    };
  }, [photos, marks, itemOrder, captureAsset, carrierId, doodleStrokes, draftId, envelope, inkColor, layerLayouts, paper, pieces, recipient, seal, sealWeight, songAsset, stickers, textBlocks, voiceAsset]);

  const applySnapshot = useCallback((snapshot: KeepsakeSnapshot) => {
    const next = cloneSnapshot(snapshot);
    setActiveSnapshot(next); setDraftId(next.id); setRecipient(next.recipient); setTextBlocks(textBlocksFromSnapshot(next)); setPaper(next.paper); setCarrierId(next.carrier); setEnvelope(next.envelope); setSeal(next.seal); setSealWeight(next.sealWeight ?? "bold"); setPieces(next.pieces); setVoiceAsset(next.voice); setSongAsset(next.song); setDoodleStrokes(next.doodles); setInkColor(next.inkColor); setLayerLayouts(next.layouts);
    const scrapbook = scrapbookFromSnapshot(next);
    setPhotos(scrapbook.photos); setMarks(scrapbook.marks); setItemOrder(scrapbook.order);
  }, []);

  const replaceAudio = useCallback((kind: "voice" | "song", next: AudioAsset | null) => {
    if (kind === "voice") setVoiceAsset(next);
    else setSongAsset(next);
  }, []);

  useEffect(() => {
    const next = new Set([voiceAsset?.url, songAsset?.url, ...photos.map((photo) => photo.asset.url)].filter((url): url is string => Boolean(url?.startsWith("blob:"))));
    mediaUrlsRef.current.forEach((url) => { if (!next.has(url)) URL.revokeObjectURL(url); });
    mediaUrlsRef.current = next;
  }, [photos, voiceAsset, songAsset]);

  const go = (requested: Phase) => {
    const presenterPhases: Phase[] = ["home", "menu", "recipient", "studio", "envelope", "carrier", "preview", "handoff", "sent"];
    const receiverPhases: Phase[] = ["arrival", "opening", "reveal", "cabinet", "deferred", "unavailable", "removed"];
    const next = isRehearsalCreate && !presenterPhases.includes(requested)
      ? "home"
      : isDemoReceiver && !receiverPhases.includes(requested)
        ? "arrival"
        : requested;
    keyboard.hide();
    setRemoveOpen(false);
    setCabinetRemovingId(null);
    if (next === "handoff") { setCopied(false); setShareFailed(false); }
    setPhase(next);
  };

  useEffect(() => {
    const resetScroll = () => {
      document.querySelector<HTMLElement>(".keepsake-app .mobile-scroll")?.scrollTo(0, 0);
      document.querySelector<HTMLElement>("[data-phone-screen]")?.scrollTo(0, 0);
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const transitionTimer = window.setTimeout(resetScroll, 240);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(transitionTimer);
    };
  }, [phase, studioMode]);

  useEffect(() => () => { mediaUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const togglePiece = (piece: PieceId) => {
    setPieces((current) =>
      current.includes(piece)
        ? current.filter((candidate) => candidate !== piece)
        : [...current, piece],
    );
  };

  const resetDraft = () => {
    setRecipient(isRehearsalCreate ? rehearsalArtifact.recipient : "");
    setDraftId(`wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`);
    setTextBlocks([]);
    setPaper("dotted");
    setEnvelope("mail");
    setSeal([]);
    setSealWeight("bold");
    setCarrierId("bottle");
    setPieces([]);
    setPhotos([]);
    setItemOrder([]);
    replaceAudio("voice", null);
    replaceAudio("song", null);
    setDoodleStrokes([]);
    setMarks([]);
    setInkColor("navy");
    setStudioMode("compose");
    setLayerLayouts(defaultLayerLayouts);
    setCuesOpen(false);
    setCopied(false);
    setShareFailed(false);
    setActiveSnapshot(null);
    go("recipient");
  };

  const returnToMenu = () => go("menu");

  const savePersonalStamp = (nextSeal: DoodleStroke[], weight: SealWeight) => {
    if (!nextSeal.length) return;
    const saved = nextSeal.map((stroke) => ({ ...stroke, points: stroke.points.map((point) => ({ ...point })) }));
    const personalStamp = { strokes: saved, weight };
    try { window.localStorage.setItem(PERSONAL_STAMP_KEY, JSON.stringify(personalStamp)); } catch { /* Reuse remains optional when storage is unavailable. */ }
    setSavedSeal(personalStamp);
  };

  const saveToCabinet = (snapshot: KeepsakeSnapshot) => {
    if (containsBlobMedia(snapshot)) return false;
    if (isRehearsalRoute) {
      setCabinet([cloneSnapshot(snapshot)]);
      return true;
    }
    const next = [snapshot, ...cabinet.filter((item) => item.id !== snapshot.id)].slice(0, 12);
    try {
      window.localStorage.setItem(CABINET_KEY, JSON.stringify(next));
    } catch { return false; }
    setCabinet(next);
    return true;
  };

  const removeFromCabinet = (id: string) => {
    const removed = cabinet.find((item) => item.id === id) ?? null;
    const next = cabinet.filter((item) => item.id !== id);
    if (isRehearsalRoute) {
      if (removed) setLastRemoved(removed);
      setCabinet(next);
      return true;
    }
    try {
      window.localStorage.setItem(CABINET_KEY, JSON.stringify(next));
    } catch { return false; }
    if (removed) setLastRemoved(removed);
    setCabinet(next);
    return true;
  };

  const updateLayer = (id: LayerId, next: LayerLayout) => {
    setLayerLayouts((current) => ({ ...current, [id]: next }));
  };

  const cycleCarrier = (direction: -1 | 1) => {
    const current = carriers.findIndex((item) => item.id === carrierId);
    const next = (current + direction + carriers.length) % carriers.length;
    setCarrierId(carriers[next].id);
  };

  const handleCarrierKeys = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + carriers.length) % carriers.length;
    setCarrierId(carriers[next].id);
    document.getElementById(`carrier-${carriers[next].id}`)?.focus();
  };

  const canPreview = recipient.trim() !== "" && Boolean(textBlocks.some((block) => block.words.trim()) || photos.length || voiceAsset || songAsset || doodleStrokes.length || marks.length);
  const navyPhase = ["removed"].includes(phase);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScroll
        className={`app-screen keepsake-app phase-${phase} ${navyPhase ? "phase-navy" : "phase-paper"}`}
      >
        <main className="keepsake-shell" aria-label="Friendship keepsake exploratory prototype">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "home" && (
              <Home key="home" reduceMotion={Boolean(reduceMotion)} onEnter={() => go("menu")} />
            )}
            {phase === "menu" && <Menu key="menu" reduceMotion={Boolean(reduceMotion)} createOnly={isRehearsalCreate} onCreate={resetDraft} onLetters={() => go("cabinet")} />}
            {phase === "recipient" && <RecipientStart key="recipient" recipient={recipient} onRecipient={setRecipient} onBack={returnToMenu} onContinue={(name) => { if (isRehearsalCreate) applySnapshot({ ...cloneSnapshot(rehearsalArtifact), recipient: name }); else setRecipient(name); go("studio"); }} />}
            {phase === "carrier" && (
              <CarrierPicker key="carrier" selected={carrierId} onSelect={setCarrierId} onCycle={cycleCarrier} onKeyDown={handleCarrierKeys} onBack={() => go("envelope")} onNext={() => { setActiveSnapshot(currentSnapshot); go("preview"); }} />
            )}
            {phase === "studio" && (
              <Studio key="studio" mode={studioMode} photos={photos} marks={marks} itemOrder={itemOrder} onPhotos={setPhotos} onMarks={setMarks} onOrder={setItemOrder} voice={voiceAsset} song={songAsset} recipient={recipient} textBlocks={textBlocks} paper={paper} pieces={pieces} doodles={doodleStrokes} inkColor={inkColor} cuesOpen={cuesOpen} layouts={layerLayouts} canPreview={canPreview} onMode={setStudioMode} onVoice={(asset) => replaceAudio("voice", asset)} onSong={(asset) => replaceAudio("song", asset)} onRecipient={setRecipient} onTextBlocks={setTextBlocks} onPaper={setPaper} onDoodles={setDoodleStrokes} onInkColor={setInkColor} onTogglePiece={togglePiece} onToggleCues={() => setCuesOpen((current) => !current)} onLayout={updateLayer} onBack={returnToMenu} onPreview={() => go("envelope")} />
            )}
            {phase === "envelope" && <EnvelopeStudio key="envelope" snapshot={currentSnapshot} onBack={() => go("studio")} onSeal={setSeal} seal={seal} sealWeight={sealWeight} onSealWeight={setSealWeight} savedSeal={savedSeal} onSaveSeal={savePersonalStamp} onNext={() => go("carrier")} />}
            {phase === "preview" && (
              <Preview key="preview" snapshot={activeSnapshot ?? currentSnapshot} onEdit={() => go("envelope")} onChangeCarrier={() => go("carrier")} onGive={() => go("handoff")} />
            )}
            {phase === "handoff" && (
              <Handoff key="handoff" snapshot={activeSnapshot ?? currentSnapshot} recipient={recipient} carrier={carrier} copied={copied} failed={shareFailed} reduceMotion={Boolean(reduceMotion)} demoReceiver={isRehearsalCreate} onBack={() => go("preview")} onEdit={() => go("studio")} onCopy={async () => { const snapshot = activeSnapshot ?? currentSnapshot; if (!isSafeSnapshot(snapshot) || containsBlobMedia(snapshot)) { setShareFailed(true); return false; } const payload = encodeSnapshot(snapshot); if (payload.length > LINK_MAX) { setShareFailed(true); return false; } const receiverPath = isRehearsalCreate ? "/demo/receive" : `/for/${snapshot.id}`; const url = `${window.location.origin}${receiverPath}#v3.${payload}`; setShareFailed(false); setCopied(false); try { if (!navigator.clipboard?.writeText) return false; await navigator.clipboard.writeText(url); setCopied(true); return true; } catch { return false; } }} onFail={() => { setCopied(false); setShareFailed(true); }} onFinish={() => go("sent")} />
            )}
            {phase === "sent" && (
              <Sent key="sent" recipient={recipient} carrier={carrier} reduceMotion={Boolean(reduceMotion)} onAgain={resetDraft} onLeave={returnToMenu} />
            )}
            {phase === "arrival" && (
              <Arrival key="arrival" recipient={recipient} senderName={(activeSnapshot ?? currentSnapshot).sender} carrier={carrier} reduceMotion={Boolean(reduceMotion)} onOpen={() => go("opening")} onDefer={() => go("deferred")} onRemove={() => { const snapshot = activeSnapshot ?? currentSnapshot; setLastRemoved(snapshot); removeFromCabinet(snapshot.id); go("removed"); }} />
            )}
            {phase === "deferred" && (
              <QuietExit key="deferred" title="left for another time." body={`${sender} is not told. There is no reminder.`} action="return to it" onAction={() => go("arrival")} onLeave={() => go("home")} />
            )}
            {phase === "unavailable" && (
              <QuietExit key="unavailable" title="this one cannot be opened." body="No content has been shown. This link is incomplete or could not be read." action="back to the sample" onAction={() => go("arrival")} onLeave={() => go("home")} />
            )}
            {phase === "opening" && <Opening key="opening" snapshot={activeSnapshot ?? currentSnapshot} removeOpen={removeOpen} reduceMotion={Boolean(reduceMotion)} onKeep={() => { const snapshot = activeSnapshot ?? currentSnapshot; if (!saveToCabinet(snapshot)) return false; setActiveSnapshot(snapshot); go("cabinet"); return true; }} onClose={() => go("deferred")} onRemove={() => setRemoveOpen(true)} onCancelRemove={() => setRemoveOpen(false)} onConfirmRemove={() => { const snapshot = activeSnapshot ?? currentSnapshot; setLastRemoved(snapshot); removeFromCabinet(snapshot.id); go("removed"); }} />}
            {phase === "reveal" && <Opening key="reveal" snapshot={activeSnapshot ?? currentSnapshot} removeOpen={removeOpen} reduceMotion onKeep={() => { go("cabinet"); return true; }} onClose={() => go("deferred")} onRemove={() => setRemoveOpen(true)} onCancelRemove={() => setRemoveOpen(false)} onConfirmRemove={() => { if (activeSnapshot) removeFromCabinet(activeSnapshot.id); go("removed"); }} />}
            {phase === "cabinet" && (
              <Cabinet key="cabinet" items={cabinet} removingId={cabinetRemovingId} onHome={returnToMenu} onMake={isDemoReceiver ? () => { applySnapshot(rehearsalArtifact); go("arrival"); } : resetDraft} onOpen={(item) => { applySnapshot(item); go("reveal"); }} onRemove={(item) => setCabinetRemovingId(item.id)} onCancelRemove={() => setCabinetRemovingId(null)} onConfirmRemove={(item) => { removeFromCabinet(item.id); setCabinetRemovingId(null); }} />
            )}
            {phase === "removed" && <Removed key="removed" onLeave={returnToMenu} onRestore={() => { if (lastRemoved) { saveToCabinet(lastRemoved); applySnapshot(lastRemoved); } go("arrival"); }} />}
          </AnimatePresence>
        </main>
      </MobileScroll>
    </MotionConfig>
  );
}

function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  const handsOffToOpening = className.includes("arrival-page");
  return (
    <motion.section className={`experience-page ${className}`} initial={{ opacity: handsOffToOpening ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: handsOffToOpening ? 1 : 0 }} transition={{ duration: handsOffToOpening ? 0 : motionTiming.enter, ease: motionEase.ui }}>
      {children}
    </motion.section>
  );
}

function Mark({ direction = "right" }: { direction?: "left" | "right" | "down" }) {
  const rotation = direction === "left" ? 180 : direction === "down" ? 90 : 0;
  return (
    <svg className="line-mark" viewBox="0 0 42 20" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M2 10.8c10-2.2 18-2.4 32-.6M27 3.5c3.4 2.5 6 4.7 8.5 7.2-3 2.3-5.4 4.1-8.8 6" />
    </svg>
  );
}

function CloseMark() {
  return <svg className="control-mark control-mark-close" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7c7 6 13 12 20 19M25 6C18 13 12 19 6 26" /></svg>;
}

function CameraMark() {
  return <svg className="control-mark control-mark-camera" viewBox="0 0 40 40" aria-hidden="true"><path d="M5 13c8-1 22-1 30 0l-1 21c-8 1-20 1-28 0zM14 13l3-6h8l3 6" /><circle cx="20" cy="23" r="7" /></svg>;
}

function RotateMark() {
  return <svg className="control-mark control-mark-rotate" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 11c-4-6-14-5-17 2-4 9 6 17 14 12 3-2 4-4 5-7M20 6l5 5 2-7" /></svg>;
}

function ResizeMark() {
  return <svg className="control-mark control-mark-resize" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 24L24 8M15 8h9v9M8 15v9h9" /></svg>;
}

function AppBottomNav({ lettersCurrent = false, onHome, onMake, onLetters }: { lettersCurrent?: boolean; onHome: () => void; onMake: () => void; onLetters: () => void }) {
  return <nav className="return-nav" aria-label="Warm and fuzzies"><button className="return-nav-home" type="button" onClick={onHome}>home</button><button className="return-nav-make" type="button" onClick={onMake} aria-label="Make a new letter"><span aria-hidden="true">+</span><small>make</small></button><button className="return-nav-letters" type="button" aria-current={lettersCurrent ? "page" : undefined} onClick={onLetters}>your letters</button></nav>;
}

function Home({ reduceMotion, onEnter }: { reduceMotion: boolean; onEnter: () => void }) {
  return (
    <Page className="home-page">
      <div className="home-copy">
        <h1 className="working-wordmark"><span>warm &amp;</span><span>fuzzies</span></h1>
      </div>
      <div className="home-bee-mark" aria-hidden="true">
        <motion.img
          src="/assets/illustrations/cecilia/firefly-brand-mark.png"
          alt=""
          draggable={false}
          data-asset-slot="home-bee"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <p className="home-question">something good<br />on your mind?</p>
      <motion.div
        className="home-reeds"
        data-testid="home-reeds"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: motionTiming.enter, ease: motionEase.ui }}
      >
        <img className="home-reed home-reed-left" src={artwork.environment.reeds} alt="" draggable={false} data-asset-slot="home-reeds-left" />
        <img className="home-reed home-reed-right" src={artwork.environment.reeds} alt="" draggable={false} data-asset-slot="home-reeds-right" />
      </motion.div>
      <div className="home-invitation"><button className="drawn-action" type="button" onClick={onEnter}>make it for them <Mark /></button></div>
    </Page>
  );
}

function Menu({ reduceMotion, createOnly = false, onCreate, onLetters }: { reduceMotion: boolean; createOnly?: boolean; onCreate: () => void; onLetters: () => void }) {
  const flyIn = reduceMotion
    ? { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" }
    : {
      opacity: [0, 1, 1, 1],
      transform: [
        "translate3d(-210px, 170px, 0) rotate(-18deg) scale(.72)",
        "translate3d(34px, -22px, 0) rotate(7deg) scale(1.05)",
        "translate3d(-8px, 8px, 0) rotate(-3deg) scale(.98)",
        "translate3d(0, 0, 0) rotate(0deg) scale(1)",
      ],
  };
  return (
    <Page className="menu-page">
      <motion.header initial={false} animate={{ opacity: 1 }}><span>warm &amp; fuzzies</span></motion.header>
      <motion.div data-testid="hub-firefly" className="menu-firefly" initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(-210px, 170px, 0) rotate(-18deg) scale(.72)" }} animate={flyIn} transition={{ opacity: { duration: reduceMotion ? .01 : .5, ease: [0.23, 1, 0.32, 1] }, transform: { duration: reduceMotion ? 0 : motionTiming.hub, times: reduceMotion ? undefined : [0, .62, .84, 1], ease: [0.77, 0, 0.175, 1] } }} aria-hidden="true">
        <DeliveryMascot />
      </motion.div>
      <div className="menu-actions">
        <motion.button className="drawn-action" type="button" onClick={onCreate} initial={false}>create something <Mark /></motion.button>
        {!createOnly && <motion.button className="drawn-action" type="button" onClick={onLetters} initial={false}>look in your box <Mark /></motion.button>}
      </div>
    </Page>
  );
}

function RecipientStart({ recipient, locked = false, onRecipient, onBack, onContinue }: { recipient: string; locked?: boolean; onRecipient: (value: string) => void; onBack: () => void; onContinue: (name: string) => void }) {
  const keyboard = useKeyboard();
  const cleanedName = recipient.trim().replace(/\s+/g, " ");
  const submit = () => {
    if (!cleanedName) return;
    keyboard.hide();
    onContinue(cleanedName);
  };

  return (
    <Page className="recipient-page">
      <TopLine onBack={onBack} label="back" />
      <form className="recipient-start-form" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <h1>who is this for?</h1>
        <label className="recipient-name-line">
          <span>for</span>
          <KeyboardInput
            autoFocus={!locked}
            aria-label="Who is this for?"
            autoComplete="off"
            enterKeyHint="next"
            maxLength={60}
            placeholder="their name"
            readOnly={locked}
            spellCheck={false}
            value={recipient}
            onBlur={() => keyboard.hide()}
            onChange={(event) => onRecipient(event.target.value)}
          />
        </label>
        <p>{locked ? "this name is part of the prepared demo." : "you can change it later on the paper."}</p>
        <button className="drawn-action recipient-start-action" type="submit" disabled={!cleanedName} aria-label={cleanedName ? `Start making for ${cleanedName}` : "Enter their name to start making"} onPointerDown={(event) => event.preventDefault()}>
          <span className="recipient-start-label">{cleanedName ? `make it for ${cleanedName}` : "make it for them"}</span> <Mark />
        </button>
      </form>
    </Page>
  );
}

function CarrierPicker({ selected, locked = false, onSelect, onCycle, onKeyDown, onBack, onNext }: { selected: CarrierId; locked?: boolean; onSelect: (carrier: CarrierId) => void; onCycle: (direction: -1 | 1) => void; onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => void; onBack: () => void; onNext: () => void }) {
  const carrier = carriers.find((item) => item.id === selected) ?? carriers[0];
  return (
    <Page className={`carrier-page carrier-${selected}`}>
      <TopLine onBack={onBack} label="message" />
      <header className="carrier-heading"><p>pick how it arrives.</p><span>same letter. a different little journey.</span></header>
      <div className="carrier-stage">
        <button className="stage-arrow stage-arrow-left" type="button" aria-label="Previous carrier" disabled={locked} onClick={() => onCycle(-1)}><Mark direction="left" /></button>
        <motion.div key={selected} className="hero-carrier" initial={false} animate={{ opacity: 1 }}>
          <CarrierIcon id={selected} size="hero" />
        </motion.div>
        <button className="stage-arrow stage-arrow-right" type="button" aria-label="Next carrier" disabled={locked} onClick={() => onCycle(1)}><Mark /></button>
      </div>
      <div className="carrier-thumbnails" role="radiogroup" aria-label="Delivery carrier">
        {carriers.map((item, index) => (
          <button id={`carrier-${item.id}`} key={item.id} className="carrier-thumb" type="button" role="radio" aria-checked={item.id === selected} aria-label={item.shortLabel} tabIndex={item.id === selected ? 0 : -1} disabled={locked} onClick={() => onSelect(item.id)} onKeyDown={(event) => onKeyDown(event, index)}>
            <CarrierIcon id={item.id} size="thumb" />
          </button>
        ))}
      </div>
      <div className="carrier-copy" aria-live="polite"><h1>{carrier.label}</h1><p>{carrier.description}</p></div>
      <button className="drawn-action carrier-next" type="button" onClick={onNext}>see it ready to give <Mark /></button>
    </Page>
  );
}

type StudioProps = {
  mode: StudioMode; locked?: boolean; photos: PhotoPiece[]; marks: MarkPiece[]; itemOrder: string[];
  voice: AudioAsset | null; song: AudioAsset | null; recipient: string; textBlocks: TextBlock[];
  paper: PaperId; pieces: PieceId[]; doodles: DoodleStroke[]; inkColor: InkColor; cuesOpen: boolean;
  layouts: Record<LayerId, LayerLayout>; canPreview: boolean;
  onMode: (mode: StudioMode) => void; onPhotos: (photos: PhotoPiece[]) => void; onMarks: (marks: MarkPiece[]) => void; onOrder: (ids: string[]) => void;
  onVoice: (asset: AudioAsset | null) => void; onSong: (asset: AudioAsset | null) => void;
  onRecipient: (value: string) => void; onTextBlocks: (value: TextBlock[]) => void; onPaper: (value: PaperId) => void;
  onDoodles: (strokes: DoodleStroke[]) => void; onInkColor: (color: InkColor) => void;
  onTogglePiece: (piece: PieceId) => void; onToggleCues: () => void;
  onLayout: (id: LayerId, layout: LayerLayout) => void; onBack: () => void; onPreview: () => void;
};

function Studio({ mode, locked = false, photos, marks, itemOrder, voice, song, recipient, textBlocks, paper, pieces, doodles, inkColor, cuesOpen, layouts, canPreview, onMode, onPhotos, onMarks, onOrder, onVoice, onSong, onRecipient, onTextBlocks, onPaper, onDoodles, onInkColor, onTogglePiece, onToggleCues, onLayout, onBack, onPreview }: StudioProps) {
  const keyboard = useKeyboard();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingRecipient, setEditingRecipient] = useState(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [voiceRecorderOpen, setVoiceRecorderOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState("say the thing you usually leave unsaid");
  const [showGestureHint, setShowGestureHint] = useState(false);
  const items = paperItems({ photos, marks, textBlocks, voice, song, pieces, layouts, order: itemOrder });
  const freshId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const placeLast = (id: string) => onOrder([...items.map((item) => item.id).filter((existing) => existing !== id), id]);

  useEffect(() => {
    if (mode !== "compose") return;
    setShowGestureHint(true);
    const timer = window.setTimeout(() => setShowGestureHint(false), 2600);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const finishText = () => {
    keyboard.hide();
    if (editingTextId) onTextBlocks(textBlocks.filter((block) => block.id !== editingTextId || block.words.trim()));
    setEditingTextId(null); setSelectedLayer(null);
  };
  const selectLayer = (id: string | null) => {
    keyboard.hide(); setEditingRecipient(false);
    if (editingTextId) onTextBlocks(textBlocks.filter((block) => block.id !== editingTextId || block.words.trim()));
    setEditingTextId(null); setSelectedLayer(id);
  };
  const updateTextBlock = (id: string, patch: Partial<Omit<TextBlock, "id">>) => onTextBlocks(textBlocks.map((block) => block.id === id ? { ...block, ...patch } : block));
  const createTextBlock = (layout?: LayerLayout) => {
    if (textBlocks.length >= MAX_TEXT_BLOCKS) return;
    const index = textBlocks.length;
    const id = freshId("text");
    const nextLayout = layout ?? { x: index === 0 ? 0 : index % 2 === 0 ? 48 : -48, y: index === 0 ? 0 : Math.min(160, 42 + index * 36), rotation: index % 2 === 0 ? -1.5 : 1.5, scale: 1 };
    onTextBlocks([...textBlocks, { id, words: "", crossedOut: [], layout: nextLayout, style: { ink: inkColor, align: "left", size: "regular", weight: "regular" } }]);
    placeLast(id); setDrawingActive(false); setSelectedLayer(id); setEditingTextId(id);
  };
  const editTextBlock = (id: string) => { setDrawingActive(false); setSelectedLayer(id); setEditingTextId(id); };
  const updateItemLayout = (id: string, layout: LayerLayout) => {
    if (textBlocks.some((block) => block.id === id)) updateTextBlock(id, { layout });
    else if (photos.some((photo) => photo.id === id)) onPhotos(photos.map((photo) => photo.id === id ? { ...photo, layout } : photo));
    else if (marks.some((mark) => mark.id === id)) onMarks(marks.map((mark) => mark.id === id ? { ...mark, layout } : mark));
    else if (id === "voice" || id === "song") onLayout(id, layout);
  };
  const removeLayer = (id: string) => {
    keyboard.hide();
    if (textBlocks.some((block) => block.id === id)) onTextBlocks(textBlocks.filter((block) => block.id !== id));
    else if (photos.some((photo) => photo.id === id)) onPhotos(photos.filter((photo) => photo.id !== id));
    else if (marks.some((mark) => mark.id === id)) onMarks(marks.filter((mark) => mark.id !== id));
    else { if (id === "voice") onVoice(null); if (id === "song") onSong(null); if (pieces.includes(id as PieceId)) onTogglePiece(id as PieceId); }
    onOrder(items.map((item) => item.id).filter((existing) => existing !== id));
    if (editingTextId === id) setEditingTextId(null);
    setSelectedLayer(null);
  };
  const duplicateLayer = (id: string) => {
    const block = textBlocks.find((candidate) => candidate.id === id);
    const mark = marks.find((candidate) => candidate.id === id);
    const offset = (layout: LayerLayout) => ({ ...layout, x: Math.min(140, layout.x + 22), y: Math.min(180, layout.y + 24), rotation: layout.rotation + 3 });
    const nextId = freshId(block ? "text" : "mark");
    if (block && textBlocks.length < MAX_TEXT_BLOCKS) onTextBlocks([...textBlocks, { ...block, id: nextId, crossedOut: block.crossedOut.map((range) => ({ ...range })), style: { ...textStyle(block, inkColor) }, layout: offset(block.layout) }]);
    else if (mark && marks.length < MAX_MARKS) onMarks([...marks, { ...mark, id: nextId, layout: offset(mark.layout) }]);
    else return;
    placeLast(nextId); setSelectedLayer(nextId);
  };
  const reorder = (id: string, direction: -1 | 1) => {
    const order = items.map((item) => item.id); const index = order.indexOf(id); const next = index + direction;
    if (index < 0 || next < 0 || next >= order.length) return;
    [order[index], order[next]] = [order[next], order[index]]; onOrder(order);
  };
  const keepVoice = (asset: AudioAsset) => { const isNew = !voice || !pieces.includes("voice"); onVoice(asset); if (!pieces.includes("voice")) onTogglePiece("voice"); if (isNew) placeLast("voice"); setVoiceRecorderOpen(false); setSelectedLayer("voice"); };
  const keepSong = (file: File) => { const isNew = !song || !pieces.includes("song"); onSong({ url: URL.createObjectURL(file), name: file.name.replace(/\.[^.]+$/, "") || "chosen song" }); if (!pieces.includes("song")) onTogglePiece("song"); if (isNew) placeLast("song"); setSelectedLayer("song"); };
  const keepDoodle = (stroke: DoodleStroke) => { onDoodles([...doodles, stroke]); if (!pieces.includes("drawing")) onTogglePiece("drawing"); };
  const addSticker = (kind: StickerId) => {
    if (marks.length >= MAX_MARKS) return;
    const id = freshId("mark"); const count = marks.filter((mark) => mark.kind === kind).length;
    onMarks([...marks, { id, kind, ink: inkColor, layout: { ...layouts[kind], x: layouts[kind].x - count * 18, y: layouts[kind].y + count * 20 } }]);
    placeLast(id); setSelectedLayer(id);
  };
  const undoDoodle = () => { const next = doodles.slice(0, -1); onDoodles(next); if (!next.length && pieces.includes("drawing")) onTogglePiece("drawing"); };
  return <motion.section className={`experience-page studio-page studio-${mode}`} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
    <AnimatePresence mode="wait" initial={false}>
      {mode === "capture" ? <CaptureStage key="capture" capture={null} recipient={recipient} onBack={() => onMode("compose")} onKeep={() => onMode("compose")} onCaptured={(asset) => {
        if (photos.length >= MAX_PHOTOS) { if (asset.url?.startsWith("blob:")) URL.revokeObjectURL(asset.url); onMode("compose"); return; }
        const id = photos.length === 0 && !items.some((item) => item.id === "photo") ? "photo" : freshId("photo");
        const count = photos.length;
        onPhotos([...photos, { id, asset, layout: count === 0 ? { ...layouts.photo } : { x: count % 2 ? 56 : -60, y: -152 + count * 72, rotation: count % 2 ? 5 : -5, scale: .8 }, frame: "tape", caption: "" }]);
        placeLast(id); setSelectedLayer(null); onMode("compose");
      }} /> : <StoryComposer key="compose" locked={locked} items={items} photos={photos} marks={marks} voice={voice} song={song} recipient={recipient} textBlocks={textBlocks} paper={paper} pieces={pieces} doodles={doodles} inkColor={inkColor}
        selectedLayer={selectedLayer} editingTextId={editingTextId} editingRecipient={editingRecipient} drawingActive={drawingActive} voiceRecorderOpen={voiceRecorderOpen} activePrompt={activePrompt} cuesOpen={cuesOpen} showGestureHint={showGestureHint} canPreview={canPreview}
        onSelectLayer={selectLayer} onLayout={updateItemLayout} onRemoveLayer={removeLayer} onDuplicate={duplicateLayer} onReorder={reorder}
        onTextStyle={(id, style) => updateTextBlock(id, { style })} onPhoto={(id, patch) => onPhotos(photos.map((photo) => photo.id === id ? { ...photo, ...patch } : photo))} onMarkInk={(id, ink) => onMarks(marks.map((mark) => mark.id === id ? { ...mark, ink } : mark))}
        onEditText={editTextBlock} onCreateText={createTextBlock} onTextWords={(id, words) => updateTextBlock(id, { words })} onTextCrossedOut={(id, crossedOut) => updateTextBlock(id, { crossedOut })}
        onPaper={onPaper} onFinishText={finishText} onToggleCues={onToggleCues} onPrompt={setActivePrompt} onEditRecipient={() => { selectLayer(null); setEditingRecipient(true); }} onRecipient={onRecipient} onFinishRecipient={() => { keyboard.hide(); setEditingRecipient(false); }}
        onStartVoice={() => { selectLayer(null); setDrawingActive(false); setVoiceRecorderOpen(true); }} onReplaceVoice={() => { setEditingTextId(null); setDrawingActive(false); setSelectedLayer("voice"); setVoiceRecorderOpen(true); }} onCancelVoice={() => setVoiceRecorderOpen(false)} onVoice={keepVoice} onSongFile={keepSong}
        onDraw={() => { selectLayer(null); setDrawingActive(true); }} onDoneDrawing={() => setDrawingActive(false)} onUndoDoodle={undoDoodle} onDoodle={keepDoodle} onAddSticker={addSticker} onInkColor={onInkColor}
        onCamera={() => { if (photos.length >= MAX_PHOTOS) return; selectLayer(null); setDrawingActive(false); onMode("capture"); }} onBack={onBack} onPreview={() => { finishText(); onPreview(); }} />}
    </AnimatePresence>
  </motion.section>;
}

type CameraStatus = "requesting" | "waiting" | "live" | "denied" | "unsupported";

function CaptureStage({ capture, recipient, onBack, onKeep, onCaptured }: { capture: CaptureAsset | null; recipient: string; onBack: () => void; onKeep: () => void; onCaptured: (asset: CaptureAsset) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mountedRef = useRef(true);
  const cameraRequestRef = useRef(0);
  const [status, setStatus] = useState<CameraStatus>("requesting");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("photo");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cameraNote, setCameraNote] = useState("");

  const stopCamera = useCallback(() => {
    cameraRequestRef.current += 1;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const openCamera = useCallback(async (nextFacing: "user" | "environment" = "user", withAudio = false) => {
    stopCamera();
    const requestId = cameraRequestRef.current;
    setStatus("requesting");
    setCameraNote("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    const video = { facingMode: { ideal: nextFacing }, width: { ideal: 1080 }, height: { ideal: 1920 } };
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video, audio: withAudio });
      } catch {
        if (!withAudio) throw new Error("camera unavailable");
        stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
        setCameraNote("camera is live without microphone audio.");
      }
      if (!mountedRef.current || requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setStatus("live");
    } catch {
      if (mountedRef.current && requestId === cameraRequestRef.current) setStatus("denied");
    }
  }, [stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    void openCamera(facingMode, captureMode === "video");
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [captureMode, facingMode, openCamera, stopCamera]);

  useEffect(() => {
    if (status !== "requesting") return;
    const timer = window.setTimeout(() => setStatus((current) => current === "requesting" ? "waiting" : current), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    const recorder = recorderRef.current;
    if (recording && elapsed >= 15 && recorder?.state === "recording") recorder.stop();
  }, [elapsed, recording]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || status !== "live" || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      if (!mountedRef.current) {
        URL.revokeObjectURL(url);
        return;
      }
      onCaptured({ kind: "photo", url });
    }, "image/jpeg", 0.9);
  };

  const toggleRecording = () => {
    const current = recorderRef.current;
    if (current && current.state !== "inactive") {
      current.stop();
      return;
    }
    const stream = streamRef.current;
    if (!stream || status !== "live" || typeof MediaRecorder === "undefined") {
      setCameraNote("video recording is not available in this browser. choose a clip instead.");
      return;
    }
    let recorder: MediaRecorder | null = null;
    try {
      const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((candidate) => MediaRecorder.isTypeSupported(candidate));
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        if (!mountedRef.current) return;
        recorderRef.current = null;
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder?.mimeType || "video/webm" });
        if (!blob.size) {
          setCameraNote("that clip was empty. try once more.");
          return;
        }
        onCaptured({ kind: "video", url: URL.createObjectURL(blob) });
      };
      recorder.start(180);
      recorderRef.current = recorder;
      setElapsed(0);
      setRecording(true);
      navigator.vibrate?.(8);
    } catch {
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = null;
        recorder.stop();
      }
      recorderRef.current = null;
      setRecording(false);
      setCameraNote("video recording is not available in this browser. choose a clip instead.");
    }
  };

  const handleFile = (event: ReactChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const kind: CaptureMode = file.type.startsWith("video/") ? "video" : "photo";
    onCaptured({ kind, url: URL.createObjectURL(file) });
    event.target.value = "";
  };

  const useSample = () => onCaptured({ kind: "sample" });
  const videoRecordingAvailable = typeof MediaRecorder !== "undefined";
  const statusCopy = status === "requesting" ? "opening your camera…" : status === "waiting" ? "camera permission is still waiting." : status === "denied" ? "camera permission is off." : "this browser cannot open a camera here.";

  return (
    <motion.div className={`capture-stage capture-${status}`} data-recording={recording ? "true" : "false"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }} data-scroll-drag="ignore">
      <video ref={videoRef} className={`camera-feed ${facingMode === "user" ? "camera-mirrored" : ""}`} autoPlay muted playsInline aria-label="Live camera preview" />
      <div className="capture-scrim" aria-hidden="true" />
      <header className="capture-topbar"><button type="button" aria-label="Back to the paper" onClick={onBack}><CloseMark /></button><span>add a moment for {recipient || "someone"}</span>{capture ? <button type="button" onClick={onKeep}>keep current</button> : <span aria-hidden="true" />}</header>

      {status !== "live" && (
        <div className="camera-state" aria-live="polite">
          <CameraMark />
          <h1>{statusCopy}</h1>
          <p>{status === "requesting" ? "The camera stays separate from your paper." : "You can retry, choose an existing moment, or return to the paper."}</p>
          {status !== "requesting" && <button className="drawn-action" type="button" onClick={() => void openCamera(facingMode, captureMode === "video")}>try the camera again <Mark /></button>}
        </div>
      )}

      <footer className="capture-controls">
        <p className="capture-local-note">Photos and videos stay on this device. Remove them before sharing a link or QR.</p>
        {cameraNote && <p className="camera-note" aria-live="polite">{cameraNote}</p>}
        <div className="capture-mode-switch" role="tablist" aria-label="Capture mode">
          <button type="button" role="tab" aria-selected={captureMode === "photo"} disabled={recording} onClick={() => setCaptureMode("photo")}>photo</button>
          <button type="button" role="tab" aria-selected={captureMode === "video"} disabled={recording || !videoRecordingAvailable} title={videoRecordingAvailable ? undefined : "Video recording is unavailable in this browser"} onClick={() => setCaptureMode("video")}>{videoRecordingAvailable ? "video" : "video unavailable"}</button>
        </div>
        <div className="capture-action-row">
          <button className="capture-side-action" type="button" onClick={() => fileRef.current?.click()}>choose<br />a moment</button>
          <button className="story-shutter" type="button" disabled={status !== "live"} aria-label={recording ? "Stop recording" : captureMode === "video" ? "Start recording" : "Take photo"} onClick={captureMode === "video" ? toggleRecording : capturePhoto}><span />{recording && <small>{elapsed}s</small>}</button>
          <button className="capture-side-action" type="button" disabled={status !== "live" || recording} onClick={() => setFacingMode((currentFacing) => currentFacing === "user" ? "environment" : "user")}>flip<br />camera</button>
        </div>
        <div className="capture-quiet-actions"><button type="button" onClick={useSample}>use sample moment</button><button type="button" onClick={onBack}>back to paper</button></div>
      </footer>
      <input ref={fileRef} className="capture-file-input" type="file" accept="image/*,video/*" aria-label="Choose a photo or video" onChange={handleFile} tabIndex={-1} />
    </motion.div>
  );
}

type PaperItem =
  | { id: string; kind: "text"; layout: LayerLayout; label: string; block: TextBlock }
  | { id: string; kind: "photo"; layout: LayerLayout; label: string; photo: PhotoPiece }
  | { id: string; kind: "mark"; layout: LayerLayout; label: string; mark: MarkPiece }
  | { id: string; kind: "voice" | "song"; layout: LayerLayout; label: string; audio: AudioAsset };

function paperItems({ photos, marks, textBlocks, voice, song, pieces, layouts, order }: {
  photos: PhotoPiece[]; marks: MarkPiece[]; textBlocks: TextBlock[]; voice: AudioAsset | null; song: AudioAsset | null; pieces: PieceId[]; layouts: Record<LayerId, LayerLayout>; order: string[];
}): PaperItem[] {
  const items: PaperItem[] = [
    ...photos.map((photo, index) => ({ id: photo.id, kind: "photo" as const, layout: photo.layout, label: `${photo.asset.kind === "video" ? "video" : "photo"}${index ? ` ${index + 1}` : ""}`, photo })),
    ...textBlocks.map((block, index) => ({ id: block.id, kind: "text" as const, layout: block.layout, label: `text box ${index + 1}`, block })),
    ...(voice && pieces.includes("voice") ? [{ id: "voice", kind: "voice" as const, layout: layouts.voice, label: "voice note", audio: voice }] : []),
    ...(song && pieces.includes("song") ? [{ id: "song", kind: "song" as const, layout: layouts.song, label: "song", audio: song }] : []),
    ...marks.map((mark) => ({ id: mark.id, kind: "mark" as const, layout: mark.layout, label: `${mark.kind} mark`, mark })),
  ];
  const exactOrder = completeOrder(order, items.map((item) => item.id));
  return items.sort((a, b) => exactOrder.indexOf(a.id) - exactOrder.indexOf(b.id));
}

function itemAttributes(item: PaperItem, order: number, ink: InkColor) {
  const style = item.kind === "text" ? textStyle(item.block, ink) : null;
  return {
    "data-item-kind": item.kind, "data-item-id": item.id, "data-layer-order": order,
    "data-layout": `${item.layout.x},${item.layout.y},${item.layout.rotation},${item.layout.scale}`,
    "data-text-block-id": item.kind === "text" ? item.id : undefined,
    "data-ink": style?.ink ?? (item.kind === "mark" ? item.mark.ink : undefined),
    "data-text-align": style?.align, "data-text-size": style?.size, "data-text-weight": style?.weight,
    "data-frame": item.kind === "photo" ? item.photo.frame : undefined,
    "data-mark-kind": item.kind === "mark" ? item.mark.kind : undefined,
  };
}

function PaperItemContent({ item, receiver = false }: { item: PaperItem; receiver?: boolean }) {
  if (item.kind === "text") return <RichWords value={item.block.words} crossedOut={item.block.crossedOut} className="story-words-visual" />;
  if (item.kind === "photo") return <div className="story-photo-visual">{item.photo.frame === "tape" && <span className="paper-tape" aria-hidden="true" />}<CapturedMedia capture={item.photo.asset} interactive={receiver} className="story-paper-media" />{item.photo.caption && <p className="photo-caption">{item.photo.caption}</p>}</div>;
  if (item.kind === "mark") return <StickerMark id={item.mark.kind} />;
  return <AudioPaperPiece asset={item.audio} kind={item.kind} />;
}

type StoryComposerProps = {
  locked?: boolean; items: PaperItem[]; photos: PhotoPiece[]; marks: MarkPiece[]; voice: AudioAsset | null; song: AudioAsset | null;
  recipient: string; textBlocks: TextBlock[]; paper: PaperId; pieces: PieceId[]; doodles: DoodleStroke[]; inkColor: InkColor;
  selectedLayer: string | null; editingTextId: string | null; editingRecipient: boolean; drawingActive: boolean; voiceRecorderOpen: boolean;
  activePrompt: string; cuesOpen: boolean; showGestureHint: boolean; canPreview: boolean;
  onSelectLayer: (id: string | null) => void; onLayout: (id: string, layout: LayerLayout) => void;
  onRemoveLayer: (id: string) => void; onDuplicate: (id: string) => void; onReorder: (id: string, direction: -1 | 1) => void;
  onTextStyle: (id: string, style: TextStyle) => void; onPhoto: (id: string, patch: Partial<Pick<PhotoPiece, "frame" | "caption">>) => void; onMarkInk: (id: string, ink: InkColor) => void;
  onEditText: (id: string) => void; onCreateText: (layout?: LayerLayout) => void; onTextWords: (id: string, value: string) => void; onTextCrossedOut: (id: string, value: CrossOut[]) => void;
  onPaper: (value: PaperId) => void; onFinishText: () => void; onToggleCues: () => void; onPrompt: (prompt: string) => void;
  onEditRecipient: () => void; onRecipient: (value: string) => void; onFinishRecipient: () => void;
  onStartVoice: () => void; onReplaceVoice: () => void; onCancelVoice: () => void; onVoice: (asset: AudioAsset) => void; onSongFile: (file: File) => void;
  onDraw: () => void; onDoneDrawing: () => void; onUndoDoodle: () => void; onDoodle: (stroke: DoodleStroke) => void;
  onAddSticker: (sticker: StickerId) => void; onInkColor: (color: InkColor) => void; onCamera: () => void; onBack: () => void; onPreview: () => void;
};

function StoryComposer({ locked = false, items, photos, marks, voice, song, recipient, textBlocks, paper, pieces, doodles, inkColor, selectedLayer, editingTextId, editingRecipient, drawingActive, voiceRecorderOpen, activePrompt, cuesOpen, showGestureHint, canPreview, onSelectLayer, onLayout, onRemoveLayer, onDuplicate, onReorder, onTextStyle, onPhoto, onMarkInk, onEditText, onCreateText, onTextWords, onTextCrossedOut, onPaper, onFinishText, onToggleCues, onPrompt, onEditRecipient, onRecipient, onFinishRecipient, onStartVoice, onReplaceVoice, onCancelVoice, onVoice, onSongFile, onDraw, onDoneDrawing, onUndoDoodle, onDoodle, onAddSticker, onInkColor, onCamera, onBack, onPreview }: StoryComposerProps) {
  const editingText = editingTextId !== null;
  const selected = items.find((item) => item.id === selectedLayer);
  const paperIsEmpty = !textBlocks.some((block) => block.words.trim()) && !photos.length && !voice && !song && !doodles.length && !marks.length;
  const reduceViewMotion = useLiveReducedMotion();
  const [pointerFraming, setPointerFraming] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewOffset, setViewOffset] = useState(0);
  const viewOffsetRef = useRef(0);
  const blankPaperPointer = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  // Move the editing view, never the authored coordinates, when the dock covers a piece.
  useEffect(() => {
    const canvas = canvasRef.current;
    const paper = canvas?.querySelector<HTMLElement>(".story-paper-sheet");
    const piece = canvas?.querySelector<HTMLElement>(".story-layer.is-selected .story-layer-paper");
    const dock = canvas?.querySelector<HTMLElement>(".scrapbook-item-tools");
    const topbar = canvas?.querySelector<HTMLElement>(".story-topbar");
    if (!canvas || !paper || !piece || !dock || !topbar || editingText) {
      viewOffsetRef.current = 0; setViewOffset(0); return;
    }
    let timer = 0;
    const framePiece = () => {
      const scale = canvas.getBoundingClientRect().height / canvas.clientHeight;
      if (!scale) return;
      const bounds = piece.getBoundingClientRect();
      const top = topbar.getBoundingClientRect().bottom + 52 * scale;
      const bottom = dock.getBoundingClientRect().top - 54 * scale;
      const originalTop = bounds.top - viewOffsetRef.current * scale;
      const originalBottom = bounds.bottom - viewOffsetRef.current * scale;
      const offset = bounds.height > bottom - top
        ? (top - originalTop) / scale
        : Math.max((top - originalTop) / scale, Math.min(0, (bottom - originalBottom) / scale));
      viewOffsetRef.current = Math.round(offset);
      setViewOffset(viewOffsetRef.current);
    };
    const scheduleFrame = () => {
      window.clearTimeout(timer);
      // Let a double tap finish before changing the view beneath the pointer.
      timer = window.setTimeout(framePiece, 320);
    };
    const observer = new ResizeObserver(scheduleFrame);
    observer.observe(canvas); observer.observe(piece); observer.observe(dock);
    scheduleFrame();
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [selectedLayer, editingText]);
  useEffect(() => {
    const screen = document.querySelector<HTMLElement>("[data-phone-screen]"); screen?.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => screen?.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const startWritingOnPaper = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (locked || drawingActive || editingText || editingRecipient) return;
    if ((event.target as HTMLElement).closest("button, input, textarea, audio, video, [role='group']")) return;
    blankPaperPointer.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const finishWritingOnPaper = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = blankPaperPointer.current; blankPaperPointer.current = null;
    if (!start || start.pointerId !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return;
    if (selectedLayer) { onSelectLayer(null); return; }
    const bounds = event.currentTarget.getBoundingClientRect();
    const scaleX = event.currentTarget.clientWidth / bounds.width; const scaleY = event.currentTarget.clientHeight / bounds.height;
    const x = Math.max(-event.currentTarget.clientWidth / 2 + 30, Math.min(event.currentTarget.clientWidth / 2 - 30, (event.clientX - bounds.left - bounds.width / 2) * scaleX));
    const y = Math.max(-event.currentTarget.clientHeight / 2 + 50, Math.min(event.currentTarget.clientHeight / 2 - 54, (event.clientY - bounds.top - bounds.height / 2) * scaleY));
    onCreateText({ x, y, rotation: textBlocks.length % 2 === 0 ? -1.5 : 1.5, scale: 1 });
  };
  return <motion.div className={`story-composer story-paper-first ${drawingActive ? "is-drawing" : ""} ${editingText ? "is-editing-text" : ""} ${selected && !editingText ? "has-selected-piece" : ""}`} data-ink={inkColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }} data-scroll-drag="ignore">
    <div ref={canvasRef} className="story-canvas" onPointerDownCapture={() => setPointerFraming(true)} onKeyDownCapture={() => setPointerFraming(false)} aria-label="Full-screen paper keepsake canvas">
      <header className="story-topbar">
        <button type="button" aria-label="Leave the message maker" onClick={onBack}><CloseMark /></button>
        {editingRecipient ? <div className="recipient-editor"><span>for</span><KeyboardInput autoFocus aria-label="Who is this for?" value={recipient} placeholder="someone" autoComplete="off" onChange={(event) => onRecipient(event.target.value)} onBlur={onFinishRecipient} /><button type="button" onClick={onFinishRecipient}>done</button></div> : <button className="story-recipient" type="button" disabled={locked} onClick={onEditRecipient}>for {recipient || "someone"}</button>}
        <button className="story-done" type="button" disabled={!canPreview} aria-label="Next: fold and decorate the envelope" onClick={onPreview}>next <Mark /></button>
      </header>
      <motion.div className={`story-paper-sheet authored-paper paper-${paper}`} style={{ translate: `0 ${viewOffset}px`, transition: pointerFraming && !reduceViewMotion ? "translate 180ms cubic-bezier(0.23, 1, 0.32, 1)" : "none" }} initial={false} onPointerDown={startWritingOnPaper} onPointerUp={finishWritingOnPaper} onPointerCancel={() => { blankPaperPointer.current = null; }}>
        {paper === "ruled" && <PaperRuling />}
        {paperIsEmpty && !locked && !editingText && !editingRecipient && !drawingActive && !voiceRecorderOpen && <button className="paper-start-hint" type="button" onClick={() => onCreateText()}><span>start with a few words</span><small>then arrange the little things that are yours</small></button>}
        {drawingActive ? <DoodleSurface strokes={doodles} onStroke={onDoodle} /> : doodles.length ? <DoodleArtwork strokes={doodles} className="story-doodle-artwork" /> : null}
        <AnimatePresence>
          {items.map((item, order) => {
            const isEditing = item.kind === "text" && editingTextId === item.id;
            if (item.kind === "text" && !item.block.words.trim() && !isEditing) return null;
            return <CanvasLayer key={item.id} id={item.id} item={item} order={order} ink={inkColor} className={`story-layer-${item.kind} ${item.kind === "mark" ? `story-layer-${item.mark.kind}` : ""}`} locked={locked} label={item.label} layout={item.layout} selected={selectedLayer === item.id} editing={isEditing} resizable onSelect={onSelectLayer} onLayout={onLayout} onRemove={onRemoveLayer} onEdit={item.kind === "text" ? () => onEditText(item.id) : undefined}>
              {isEditing && item.kind === "text" ? <RichHandwritingEditor label={`Write directly on the paper in ${item.label}. Backspace crosses out text; use undo cross-out to restore it.`} value={item.block.words} crossedOut={item.block.crossedOut} placeholder={activePrompt} onChange={(words) => onTextWords(item.id, words)} onCrossedOut={(crossed) => onTextCrossedOut(item.id, crossed)} /> : <PaperItemContent item={item} />}
            </CanvasLayer>;
          })}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{voiceRecorderOpen && <VoiceRecorder onCancel={onCancelVoice} onRecorded={onVoice} />}</AnimatePresence>
      <p className="story-mode-status" aria-live="polite">{drawingActive ? `doodling · ${doodles.length} ${doodles.length === 1 ? "stroke" : "strokes"}` : editingText ? "writing directly on the paper" : ""}</p>
      <AnimatePresence>{showGestureHint && !paperIsEmpty && !editingText && !drawingActive && !selected && <motion.p className="story-gesture-tip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>tap a piece to make it yours</motion.p>}</AnimatePresence>
      {!locked && !editingText && !drawingActive && !voiceRecorderOpen && !editingRecipient && items.length > 0 && <button className="scrapbook-layer-cycle" type="button" aria-label="Select next piece" onClick={() => { const index = items.findIndex((item) => item.id === selectedLayer); onSelectLayer(items[(index + 1) % items.length].id); }}><span aria-hidden="true">▱</span>{selected ? `${items.findIndex((item) => item.id === selected.id) + 1} / ${items.length}` : `${items.length} ${items.length === 1 ? "piece" : "pieces"}`}</button>}
      {!locked && !voiceRecorderOpen && !editingRecipient && (selected && !editingText && !drawingActive ? <ScrapbookItemTools key={selected.id} item={selected} ink={inkColor} index={items.findIndex((item) => item.id === selected.id)} count={items.length} canDuplicate={selected.kind === "text" ? textBlocks.length < MAX_TEXT_BLOCKS : selected.kind === "mark" && marks.length < MAX_MARKS} onDone={() => onSelectLayer(null)} onLayout={(layout) => onLayout(selected.id, layout)} onRemove={() => onRemoveLayer(selected.id)} onDuplicate={() => onDuplicate(selected.id)} onReorder={(direction) => onReorder(selected.id, direction)} onEdit={() => onEditText(selected.id)} onTextStyle={(style) => onTextStyle(selected.id, style)} onPhoto={(patch) => onPhoto(selected.id, patch)} onMarkInk={(ink) => onMarkInk(selected.id, ink)} onReplaceVoice={onReplaceVoice} onReplaceSong={onSongFile} /> : <StoryToolRail hasWords={textBlocks.some((block) => block.words.trim())} canAddText={textBlocks.length < MAX_TEXT_BLOCKS} paper={paper} capture={photos[0]?.asset ?? null} photoCount={photos.length} markCount={marks.length} voice={voice} song={song} pieces={pieces} inkColor={inkColor} drawingActive={drawingActive} editingText={editingText} cuesOpen={cuesOpen} activePrompt={activePrompt} canUndoDoodle={doodles.length > 0} onText={() => onCreateText()} onFinishText={onFinishText} onToggleCues={onToggleCues} onPrompt={onPrompt} onPaper={onPaper} onDraw={onDraw} onDoneDrawing={onDoneDrawing} onUndoDoodle={onUndoDoodle} onCamera={onCamera} onVoice={onStartVoice} onSongFile={onSongFile} onAddSticker={onAddSticker} onInkColor={onInkColor} />)}
    </div>
  </motion.div>;
}

function InkChoices({ ink, onChange }: { ink: InkColor; onChange: (ink: InkColor) => void }) {
  return <div className="story-colour-palette" role="group" aria-label="Ink colour">{inkColors.map((color) => <button key={color} className={`ink-swatch ink-${color}`} type="button" aria-pressed={ink === color} aria-label={`Use ${inkLabels[color]} ink`} onClick={() => onChange(color)}><span /></button>)}</div>;
}

function ScrapbookItemTools({ item, ink, index, count, canDuplicate, onDone, onLayout, onRemove, onDuplicate, onReorder, onEdit, onTextStyle, onPhoto, onMarkInk, onReplaceVoice, onReplaceSong }: {
  item: PaperItem; ink: InkColor; index: number; count: number; canDuplicate: boolean; onDone: () => void; onLayout: (layout: LayerLayout) => void;
  onRemove: () => void; onDuplicate: () => void; onReorder: (direction: -1 | 1) => void; onEdit: () => void;
  onTextStyle: (style: TextStyle) => void; onPhoto: (patch: Partial<Pick<PhotoPiece, "frame" | "caption">>) => void; onMarkInk: (ink: InkColor) => void;
  onReplaceVoice: () => void; onReplaceSong: (file: File) => void;
}) {
  const [tab, setTab] = useState<"look" | "arrange">("look");
  const [captionOpen, setCaptionOpen] = useState(false);
  const keyboard = useKeyboard();
  const songInputRef = useRef<HTMLInputElement>(null);
  const style = item.kind === "text" ? textStyle(item.block, ink) : null;
  const setStyle = (patch: Partial<TextStyle>) => { if (style) onTextStyle({ ...style, ...patch }); };
  const finishCaption = () => { keyboard.hide(); setCaptionOpen(false); };
  const changeTab = (next: "look" | "arrange") => { finishCaption(); setTab(next); };
  const nudge = (x: number, y: number) => onLayout({ ...item.layout, x: Math.max(-160, Math.min(160, item.layout.x + x)), y: Math.max(-320, Math.min(270, item.layout.y + y)) });
  return <section className={`story-tool-dock scrapbook-item-tools ${captionOpen ? "is-captioning" : ""}`} aria-label="Customise selected item">
    <div className="scrapbook-tools-heading"><span>{item.label}</span><div role="tablist" aria-label="Piece controls"><button type="button" role="tab" aria-selected={tab === "look"} onClick={() => changeTab("look")}>look</button><button type="button" role="tab" aria-selected={tab === "arrange"} onClick={() => changeTab("arrange")}>arrange</button></div><button className="scrapbook-done" type="button" aria-label="Done customising" onClick={() => { finishCaption(); onDone(); }}>done</button></div>
    {tab === "look" && item.kind === "text" && style && <div className="scrapbook-look-controls">
      <div className="scrapbook-style-row"><InkChoices ink={style.ink} onChange={(ink) => setStyle({ ink })} /><button type="button" className="scrapbook-edit-words" onClick={onEdit}>edit words</button></div>
      <div className="scrapbook-style-row"><div className="scrapbook-choice" role="group" aria-label="Text size">{(["small", "regular", "large"] as const).map((size) => <button key={size} type="button" aria-pressed={style.size === size} onClick={() => setStyle({ size })}>{size}</button>)}</div><button type="button" aria-label={style.weight === "emphasis" ? "regular weight" : "emphasis"} aria-pressed={style.weight === "emphasis"} onClick={() => setStyle({ weight: style.weight === "emphasis" ? "regular" : "emphasis" })}><b>bold</b></button></div>
      <div className="scrapbook-style-row"><div className="scrapbook-choice scrapbook-alignment" role="group" aria-label="Text alignment">{(["left", "center", "right"] as const).map((align) => <button key={align} type="button" aria-label={`Align text ${align}`} aria-pressed={style.align === align} onClick={() => setStyle({ align })}><svg viewBox="0 0 24 20" aria-hidden="true"><path d={`M3 3h18M${align === "right" ? 9 : align === "center" ? 6 : 3} 9h12M3 15h18`} /></svg></button>)}</div><button type="button" disabled={!canDuplicate} onClick={onDuplicate}>duplicate</button><button type="button" onClick={onRemove}>remove</button></div>
    </div>}
    {tab === "look" && item.kind === "photo" && <div className="scrapbook-look-controls">
      {!captionOpen && <div className="scrapbook-style-row scrapbook-photo-frames" role="group" aria-label="Photo frame">{(["plain", "polaroid", "tape"] as const).map((frame) => <button key={frame} type="button" aria-pressed={item.photo.frame === frame} onClick={() => onPhoto({ frame })}><span className={`scrapbook-frame-preview frame-${frame}`} aria-hidden="true" />{frame}</button>)}</div>}
      {captionOpen ? <div className="scrapbook-caption-editor"><KeyboardInput autoFocus aria-label="Photo caption" maxLength={100} value={item.photo.caption} placeholder="a few words about this moment" onChange={(event) => onPhoto({ caption: event.target.value })} /><button type="button" onClick={finishCaption}>done caption</button></div> : <div className="scrapbook-action-row"><button type="button" onClick={() => setCaptionOpen(true)}>{item.photo.caption ? "edit caption" : "caption"}</button><span>{item.photo.asset.kind === "sample" ? "sample moment" : "on this device"}</span><button type="button" onClick={onRemove}>remove</button></div>}
    </div>}
    {tab === "look" && item.kind === "mark" && <div className="scrapbook-look-controls"><div className="scrapbook-style-row"><InkChoices ink={item.mark.ink} onChange={onMarkInk} /><span className="scrapbook-mark-preview"><StickerMark id={item.mark.kind} /></span></div><div className="scrapbook-action-row"><button type="button" disabled={!canDuplicate} onClick={onDuplicate}>duplicate</button><button type="button" onClick={onRemove}>remove</button></div></div>}
    {tab === "look" && item.kind === "voice" && <div className="scrapbook-look-controls"><div className="scrapbook-action-row"><span>on this device</span><button type="button" onClick={onReplaceVoice}>record again</button><button type="button" onClick={onRemove}>remove</button></div></div>}
    {tab === "look" && item.kind === "song" && <div className="scrapbook-look-controls"><div className="scrapbook-action-row"><span>on this device</span><button type="button" onClick={() => songInputRef.current?.click()}>choose another song</button><button type="button" onClick={onRemove}>remove</button></div><input ref={songInputRef} className="capture-file-input" type="file" accept="audio/*" aria-label="Choose a replacement audio file" tabIndex={-1} onChange={(event) => { const file = event.target.files?.[0]; if (file) onReplaceSong(file); event.target.value = ""; }} /></div>}
    {tab === "arrange" && <div className="scrapbook-arrange-controls">
      <div className="scrapbook-action-row"><button type="button" disabled={index === 0} onClick={() => onReorder(-1)}>backward</button><span>overlap</span><button type="button" disabled={index === count - 1} onClick={() => onReorder(1)}>forward</button></div>
      <div className="scrapbook-style-row scrapbook-transform-row"><button type="button" aria-label="turn left" onClick={() => onLayout({ ...item.layout, rotation: item.layout.rotation - 6 })}>↶</button><button type="button" onClick={() => onLayout({ ...item.layout, scale: Math.max(.52, Number((item.layout.scale - .1).toFixed(3))) })}>smaller</button><button type="button" onClick={() => onLayout({ ...item.layout, scale: Math.min(1.9, Number((item.layout.scale + .1).toFixed(3))) })}>larger</button><button type="button" aria-label="turn right" onClick={() => onLayout({ ...item.layout, rotation: item.layout.rotation + 6 })}>↷</button></div>
      <div className="scrapbook-style-row scrapbook-nudge-row" role="group" aria-label="Move selected piece"><button type="button" aria-label="Move left" onClick={() => nudge(-12, 0)}>←</button><button type="button" aria-label="Move up" onClick={() => nudge(0, -12)}>↑</button><button type="button" aria-label="Move down" onClick={() => nudge(0, 12)}>↓</button><button type="button" aria-label="Move right" onClick={() => nudge(12, 0)}>→</button><button type="button" onClick={onRemove}>remove</button></div>
    </div>}
  </section>;
}

function PaperRuling() {
  return <svg className="paper-ruling" viewBox="0 0 360 640" preserveAspectRatio="none" aria-hidden="true"><path d="M18 92c76 2 150-2 324 1M17 126c82-1 185 2 326 0M19 160c91 2 212-1 322 1M18 194c88-1 197 1 324 0M19 228c96 1 213-2 322 1M17 262c104-1 209 2 326 0M18 296c87 2 202-2 324 1M19 330c94-1 201 1 322 0M18 364c82 2 201-1 324 1M17 398c103-1 221 2 326 0M19 432c91 2 215-2 322 1M18 466c88-1 196 1 324 0M19 500c97 2 207-1 322 1M17 534c89-1 210 2 326 0M19 568c103 1 218-2 322 1" /><path className="paper-margin-rule" d="M49 48c-1 126 2 265 0 544" /></svg>;
}

function graphemeStart(value: string, offset: number) {
  if (offset <= 0) return 0;
  const Segmenter = Intl.Segmenter;
  if (Segmenter) {
    const segments = Array.from(new Segmenter(undefined, { granularity: "grapheme" }).segment(value));
    for (const segment of segments) if (segment.index + segment.segment.length >= offset) return segment.index;
  }
  const points = Array.from(value.slice(0, offset));
  return Math.max(0, offset - (points.at(-1)?.length ?? 1));
}

function normalizedCrosses(crosses: CrossOut[]) {
  return crosses.slice().sort((a, b) => a.start - b.start).reduce<CrossOut[]>((all, item) => {
    const previous = all.at(-1);
    if (previous && item.start <= previous.end) previous.end = Math.max(previous.end, item.end);
    else all.push({ start: item.start, end: item.end });
    return all;
  }, []);
}

function RichWords({ value, crossedOut, className = "" }: { value: string; crossedOut: CrossOut[]; className?: string }) {
  const ranges = normalizedCrosses(crossedOut);
  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.start > cursor) parts.push(value.slice(cursor, range.start));
    parts.push(<del key={`${range.start}-${range.end}-${index}`} className="crossed-out">{value.slice(range.start, range.end)}</del>);
    cursor = range.end;
  });
  if (cursor < value.length) parts.push(value.slice(cursor));
  return <p className={className}>{parts.length ? parts : value}</p>;
}

function RichHandwritingEditor({ label = "Write directly on the paper. Backspace crosses out text; use undo cross-out to restore it.", value, crossedOut, placeholder, onChange, onCrossedOut }: { label?: string; value: string; crossedOut: CrossOut[]; placeholder: string; onChange: (value: string) => void; onCrossedOut: (value: CrossOut[]) => void }) {
  const deleteGuardUntil = useRef(0);
  const crossBackward = (start: number, end: number) => {
    let from = start === end ? graphemeStart(value, start) : start;
    let to = end;
    if (start === end) {
      while (from > 0 && crossedOut.some((range) => range.start <= from && range.end >= to)) {
        to = from;
        from = graphemeStart(value, from);
      }
    }
    if (from === to) return;
    onCrossedOut(normalizedCrosses([...crossedOut, { start: from, end: to }]));
  };
  const markFromField = (target: HTMLTextAreaElement) => {
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    crossBackward(start, end);
    if (start !== end) window.requestAnimationFrame(() => target.setSelectionRange(end, end));
  };
  const updateValue = (next: string) => {
    // The authored-history rule is absolute inside this field: shrinking edits never erase ink.
    if (next.length < value.length) return;
    let prefix = 0;
    while (prefix < value.length && prefix < next.length && value[prefix] === next[prefix]) prefix += 1;
    let suffix = 0;
    while (suffix < value.length - prefix && suffix < next.length - prefix && value[value.length - 1 - suffix] === next[next.length - 1 - suffix]) suffix += 1;
    const removed = value.length - prefix - suffix;
    const inserted = next.length - prefix - suffix;
    if (crossedOut.length && (removed || inserted)) {
      const delta = inserted - removed;
      const remapped = crossedOut.flatMap((range) => {
        if (range.end <= prefix) return [range];
        if (range.start >= prefix + removed) return [{ start: range.start + delta, end: range.end + delta }];
        const left = range.start < prefix ? { start: range.start, end: prefix } : null;
        const rightStart = prefix + inserted;
        const right = range.end > prefix + removed ? { start: rightStart, end: range.end + delta } : null;
        return [left, right].filter((candidate): candidate is CrossOut => Boolean(candidate && candidate.start < candidate.end));
      });
      onCrossedOut(normalizedCrosses(remapped));
    }
    onChange(next);
  };
  return <div className="rich-text-editor"><RichWords value={value} crossedOut={crossedOut} className="rich-text-mirror" /><KeyboardTextarea autoFocus className="story-words-input" aria-label={label} rows={4} value={value} placeholder={placeholder} onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => { event.stopPropagation(); if (event.key !== "Backspace" || event.nativeEvent.isComposing) return; event.preventDefault(); deleteGuardUntil.current = performance.now() + 250; markFromField(event.currentTarget); }} onBeforeInput={(event) => { const native = event.nativeEvent as InputEvent; const inputType = native.inputType; if (native.isComposing || typeof inputType !== "string" || !inputType.startsWith("delete")) return; event.preventDefault(); if (performance.now() < deleteGuardUntil.current) return; deleteGuardUntil.current = performance.now() + 250; markFromField(event.currentTarget); }} onChange={(event) => { if (event.currentTarget.value.length < value.length) { event.currentTarget.value = value; return; } updateValue(event.currentTarget.value); }} /><span className="writing-status" role="status" aria-live="polite">{crossedOut.length ? "Correction crossed out. Undo is available." : ""}</span><button className="undo-cross-out" type="button" disabled={!crossedOut.length} onPointerDown={(event) => event.preventDefault()} onClick={() => onCrossedOut(crossedOut.slice(0, -1))}>undo cross-out</button></div>;
}

function pointsToPath(points: DoodlePoint[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}l.01 .01`;
  let path = `M${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index];
    const next = points[index + 1];
    path += `Q${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  return `${path}L${last.x} ${last.y}`;
}

function DoodleArtwork({ strokes, className = "" }: { strokes: DoodleStroke[]; className?: string }) {
  return <svg className={`doodle-artwork ${className}`} viewBox="0 0 360 640" preserveAspectRatio="none" role="img" aria-label={`Your hand-drawn doodle, ${strokes.length} ${strokes.length === 1 ? "stroke" : "strokes"}`}>{strokes.map((stroke) => <path key={stroke.id} d={pointsToPath(stroke.points)} />)}</svg>;
}

function DoodleSurface({ strokes, onStroke, label = "Draw directly on the paper with a finger, pen, or mouse" }: { strokes: DoodleStroke[]; onStroke: (stroke: DoodleStroke) => void; label?: string }) {
  const pointerId = useRef<number | null>(null);
  const points = useRef<DoodlePoint[]>([]);
  const [draft, setDraft] = useState<DoodlePoint[]>([]);
  const toPaperPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Number((((event.clientX - bounds.left) / bounds.width) * 360).toFixed(1)),
      y: Number((((event.clientY - bounds.top) / bounds.height) * 640).toFixed(1)),
    };
  };
  const finishStroke = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (pointerId.current !== event.pointerId) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }
    const finished = points.current;
    pointerId.current = null;
    points.current = [];
    setDraft([]);
    if (finished.length > 0) onStroke({ id: `${event.pointerId}-${performance.now().toFixed(1)}`, points: finished });
  };
  return (
    <svg
      className="doodle-surface"
      viewBox="0 0 360 640"
      preserveAspectRatio="none"
      role="application"
      aria-label={label}
      data-scroll-drag="ignore"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.stopPropagation();
        const point = toPaperPoint(event);
        pointerId.current = event.pointerId;
        points.current = [point];
        setDraft([point]);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerId.current !== event.pointerId) return;
        event.preventDefault();
        const point = toPaperPoint(event);
        const previous = points.current[points.current.length - 1];
        if (Math.hypot(point.x - previous.x, point.y - previous.y) < 1.8) return;
        points.current = [...points.current, point];
        setDraft(points.current);
      }}
      onPointerUp={finishStroke}
      onPointerCancel={finishStroke}
    >
      {strokes.map((stroke) => <path key={stroke.id} d={pointsToPath(stroke.points)} />)}
      {draft.length > 0 && <path d={pointsToPath(draft)} />}
    </svg>
  );
}

function AuthoredPaper({ snapshot, className = "", receiver = false }: { snapshot: KeepsakeSnapshot; className?: string; receiver?: boolean }) {
  const scrapbook = scrapbookFromSnapshot(snapshot);
  const items = paperItems({ ...scrapbook, textBlocks: textBlocksFromSnapshot(snapshot), voice: snapshot.voice, song: snapshot.song, pieces: snapshot.pieces, layouts: snapshot.layouts });
  return <article className={`authored-paper story-paper-sheet paper-${snapshot.paper} ${className}`} data-ink={snapshot.inkColor} aria-label={`A keepsake for ${snapshot.recipient}`}>
    {snapshot.paper === "ruled" && <PaperRuling />}
    {snapshot.doodles.length > 0 && <DoodleArtwork strokes={snapshot.doodles} className="story-doodle-artwork" />}
    {items.map((item, order) => <div key={item.id} className={`story-layer story-layer-${item.kind} ${item.kind === "mark" ? `story-layer-${item.mark.kind}` : ""} authored-${item.kind === "text" ? "words" : item.kind}`} {...itemAttributes(item, order, snapshot.inkColor)} style={{ zIndex: order + 10, transform: `translate(${item.layout.x}px, ${item.layout.y}px)` }}><div className="story-layer-paper" style={{ transform: `rotate(${item.layout.rotation}deg) scale(${item.layout.scale})` }}><PaperItemContent item={item} receiver={receiver} /></div></div>)}
  </article>;
}

function SealSurface({ strokes, weight, onWeight, onChange, onDone }: { strokes: DoodleStroke[]; weight: "soft" | "bold"; onWeight: (weight: "soft" | "bold") => void; onChange: (strokes: DoodleStroke[]) => void; onDone: () => void }) {
  return <div className={`seal-surface seal-weight-${weight}`}><DoodleSurface label="Draw your personal stamp" strokes={strokes} onStroke={(stroke) => onChange([...strokes, stroke])} /><div className="seal-controls"><div className="seal-weight-choice" role="group" aria-label="Stamp line weight"><span>line</span><button type="button" aria-pressed={weight === "soft"} onClick={() => onWeight("soft")}>soft</button><button type="button" aria-pressed={weight === "bold"} onClick={() => onWeight("bold")}>bold</button></div><div className="seal-edit-actions"><button type="button" onClick={() => onChange(strokes.slice(0, -1))} disabled={!strokes.length}>undo stroke</button><button type="button" onClick={() => onChange([])} disabled={!strokes.length}>clear</button><button className="seal-apply" type="button" onClick={onDone} disabled={!strokes.length}>apply stamp <Mark /></button></div></div></div>;
}

function EnvelopeFoldLines() {
  return <svg className="envelope-fold-lines" viewBox="0 0 340 264" preserveAspectRatio="none" aria-hidden="true">
    <path d="M1 18C54 59 119 121 160 153C168 159 176 159 184 153C229 117 290 57 339 18" />
    <path className="envelope-seam-secondary" d="M1 263L119 151M339 263L221 151" />
  </svg>;
}

function PaperFold({ snapshot, direction, onComplete }: { snapshot: KeepsakeSnapshot; direction: "fold" | "open"; onComplete: () => void }) {
  const reduceMotion = useLiveReducedMotion();
  const closing = direction === "fold";
  const duration = closing ? motionTiming.fold : motionTiming.open;
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);
  const complete = () => {
    if ((!started && !reduceMotion) || completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };
  useEffect(() => {
    if (reduceMotion) { complete(); return; }
    const frame = window.requestAnimationFrame(() => setStarted(true));
    // Motion can suppress first-mount completion under the parent presence tree;
    // this is a lifecycle fallback, not a second visual sequence.
    const fallback = window.setTimeout(() => {
      if (!completedRef.current) { completedRef.current = true; onComplete(); }
    }, (duration * 1000) + 34);
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(fallback); };
  }, [duration, reduceMotion]);
  return <motion.div className={`paper-fold paper-fold-${direction}`} data-fold-direction={direction}
    initial={false}
    animate={{ transform: !started || reduceMotion ? (closing ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 0, 0) scale(.62)") : closing
      ? ["translate3d(0, 0, 0) scale(1)", "translate3d(0, 0, 0) scale(1)", "translate3d(0, 0, 0) scale(.62)"]
      : ["translate3d(0, 0, 0) scale(.62)", "translate3d(0, 0, 0) scale(.62)", "translate3d(0, 0, 0) scale(1)"] }}
    transition={{ duration: reduceMotion ? .01 : duration, times: closing ? [0, .76, 1] : [0, .12, 1], ease: motionEase.travel }} onAnimationComplete={complete}>
    {(["top", "middle", "bottom"] as const).map((part) => {
      const foldedRotation = part === "top" ? 180 : -180;
      return <motion.div key={part} className={`paper-fold-panel paper-fold-panel-${part}`}
        initial={false}
        animate={{ transform: `rotateX(${!started || reduceMotion ? (!closing && part !== "middle" ? foldedRotation : 0) : (closing && part !== "middle" ? foldedRotation : 0)}deg)` }}
        transition={{ delay: reduceMotion ? 0 : part === "middle" ? 0 : closing ? part === "bottom" ? .12 : .58 : part === "top" ? .12 : .58, duration: reduceMotion ? .01 : .5, ease: motionEase.travel }}>
        <div className="paper-fold-face"><AuthoredPaper snapshot={snapshot} /></div>
        <div className={`paper-fold-back paper-${snapshot.paper}`} />
      </motion.div>;
    })}
  </motion.div>;
}

function EnvelopeStudio({ snapshot, seal, sealWeight, savedSeal, locked = false, onSeal, onSealWeight, onSaveSeal, onBack, onNext }: { snapshot: KeepsakeSnapshot; seal: DoodleStroke[]; sealWeight: SealWeight; savedSeal: PersonalStamp | null; locked?: boolean; onSeal: (value: DoodleStroke[]) => void; onSealWeight: (weight: SealWeight) => void; onSaveSeal: (value: DoodleStroke[], weight: SealWeight) => void; onBack: () => void; onNext: () => void }) {
  const reduced = useLiveReducedMotion();
  const [folded, setFolded] = useState(Boolean(reduced));
  const [sealOpen, setSealOpen] = useState(false);
  const canReuseStamp = seal.length === 0 && Boolean(savedSeal?.strokes.length);
  useEffect(() => { if (reduced) setFolded(true); }, [reduced]);
  useEffect(() => {
    if (!sealOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".seal-editor-close")?.focus());
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setSealOpen(false); return; }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".seal-editor");
      const controls = Array.from(dialog?.querySelectorAll<HTMLElement>("button:not(:disabled), [tabindex='0']") ?? []);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeys);
    return () => { window.cancelAnimationFrame(focusFrame); document.removeEventListener("keydown", handleKeys); previous?.focus(); };
  }, [sealOpen]);
  return (
    <Page className="envelope-page">
      <TopLine onBack={onBack} label="back to your paper" />
      {!folded && <div className="envelope-fold-preview" aria-hidden="true"><PaperFold snapshot={snapshot} direction="fold" onComplete={() => setFolded(true)} /></div>}
      <AnimatePresence>
        {folded && (
          <motion.section className="envelope-workbench" aria-label="Add a personal stamp to the envelope" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}>
            <header><h1>leave your mark.</h1><p>The envelope stays simple. The stamp is yours.</p></header>
            <div className="envelope-canvas" data-envelope={snapshot.envelope}>
              <img className="envelope-canvas-source" src={artwork.containers.envelope} alt="" draggable={false} data-asset-slot="envelope-exterior" />
              <button className={`seal-stamp seal-weight-${sealWeight} ${seal.length ? "has-seal" : ""}`} data-seal-weight={sealWeight} type="button" disabled={locked} onClick={() => setSealOpen(true)} aria-label={seal.length ? "Edit your personal stamp" : "Draw your personal stamp"}><img className="seal-stamp-base" src={artwork.seal.base} alt="" draggable={false} data-asset-slot="personal-seal-base" />{seal.length ? <DoodleArtwork strokes={seal} className="seal-artwork" /> : <span>draw<br />your stamp</span>}</button>
            </div>
            <div className="envelope-stamp-choice">
              <p className="envelope-status" aria-live="polite">{seal.length ? "stamped by you." : savedSeal?.strokes.length ? "your stamp is ready when you want it." : "add a stamp, or keep it simple."}</p>
              {canReuseStamp && savedSeal && <div><button type="button" disabled={locked} onClick={() => { onSeal(savedSeal.strokes.map((stroke) => ({ ...stroke, points: stroke.points.map((point) => ({ ...point })) }))); onSealWeight(savedSeal.weight); }}>use my stamp</button><button type="button" disabled={locked} onClick={() => { onSeal([]); setSealOpen(true); }}>draw a new one</button></div>}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {folded ? <button className="drawn-action envelope-next" type="button" onClick={onNext}>choose how it travels <Mark /></button> : <p className="envelope-fold-status" role="status">folding your page…</p>}
      <AnimatePresence>
        {sealOpen && (
          <motion.section className="seal-editor" role="dialog" aria-modal="true" aria-label="Draw your personal stamp" initial={{ opacity: 0, transform: "translateY(18px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(12px)" }} transition={{ duration: .24, ease: [0.23, 1, .32, 1] }}>
            <button className="seal-editor-close" type="button" onClick={() => setSealOpen(false)} aria-label="Close stamp editor"><CloseMark /></button>
            <header><span>one mark, made by you</span><h1>draw your stamp.</h1><p>It will be stamped onto the envelope exactly like this.</p></header>
            <SealSurface strokes={seal} weight={sealWeight} onWeight={onSealWeight} onChange={onSeal} onDone={() => { onSaveSeal(seal, sealWeight); setSealOpen(false); }} />
          </motion.section>
        )}
      </AnimatePresence>
    </Page>
  );
}

function CanvasLayer({ id, item, order, ink, className = "", label, layout, selected, editing = false, resizable = false, locked = false, children, onSelect, onLayout, onRemove, onEdit }: { id: string; item: PaperItem; order: number; ink: InkColor; className?: string; label: string; layout: LayerLayout; selected: boolean; editing?: boolean; resizable?: boolean; locked?: boolean; children: ReactNode; onSelect: (id: string | null) => void; onLayout: (id: string, layout: LayerLayout) => void; onRemove: (id: string) => void; onEdit?: () => void }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef({ pointerId: -1, startX: 0, startY: 0, startLayout: layout, moved: false });
  const rotationRef = useRef({ pointerId: -1, startAngle: 0, startRotation: 0, moved: false });
  const resizeRef = useRef({ pointerId: -1, startDistance: 1, startScale: 1, moved: false });
  const clampPosition = (x: number, y: number) => ({
    x: Math.max(-(layerRef.current?.parentElement?.clientWidth ?? 384) / 2 + 24, Math.min((layerRef.current?.parentElement?.clientWidth ?? 384) / 2 - 24, x)),
    y: Math.max(-(layerRef.current?.parentElement?.clientHeight ?? 760) / 2 + 42, Math.min((layerRef.current?.parentElement?.clientHeight ?? 760) / 2 - 54, y)),
  });
  const clampScale = (scale: number) => Math.max(0.52, Math.min(item.kind === "photo" ? 1.75 : 1.9, scale));
  const startMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (locked || editing || (event.pointerType === "mouse" && event.button !== 0)) return;
    if ((event.target as HTMLElement).closest("button, input, textarea, audio, video")) return;
    event.stopPropagation();
    moveRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, startLayout: layout, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = moveRef.current;
    if (session.pointerId !== event.pointerId) return;
    const parent = layerRef.current?.parentElement;
    const bounds = parent?.getBoundingClientRect();
    const deltaX = (event.clientX - session.startX) * (bounds?.width ? (parent?.clientWidth ?? bounds.width) / bounds.width : 1);
    const deltaY = (event.clientY - session.startY) * (bounds?.height ? (parent?.clientHeight ?? bounds.height) / bounds.height : 1);
    if (Math.hypot(deltaX, deltaY) > 2) session.moved = true;
    if (!session.moved) return;
    event.preventDefault();
    event.stopPropagation();
    onLayout(id, { ...session.startLayout, ...clampPosition(session.startLayout.x + deltaX, session.startLayout.y + deltaY) });
  };
  const finishMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (moveRef.current.pointerId !== event.pointerId) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }
    moveRef.current.pointerId = -1;
    onSelect(id);
    event.stopPropagation();
  };
  const startRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const bounds = layerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const angle = Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * 180 / Math.PI;
    rotationRef.current = { pointerId: event.pointerId, startAngle: angle, startRotation: layout.rotation, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const rotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const session = rotationRef.current;
    if (session.pointerId !== event.pointerId) return;
    const bounds = layerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const angle = Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * 180 / Math.PI;
    const delta = angle - session.startAngle;
    if (Math.abs(delta) > 2) session.moved = true;
    onLayout(id, { ...layout, rotation: session.startRotation + delta });
  };
  const finishRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (rotationRef.current.pointerId !== event.pointerId) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }
    rotationRef.current.pointerId = -1;
  };
  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const bounds = layerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const distance = Math.hypot(event.clientX - (bounds.left + bounds.width / 2), event.clientY - (bounds.top + bounds.height / 2));
    resizeRef.current = { pointerId: event.pointerId, startDistance: Math.max(1, distance), startScale: layout.scale, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const session = resizeRef.current;
    if (session.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const bounds = layerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const distance = Math.hypot(event.clientX - (bounds.left + bounds.width / 2), event.clientY - (bounds.top + bounds.height / 2));
    const distanceRatio = distance / session.startDistance;
    const scale = clampScale(session.startScale * (1 + (distanceRatio - 1) * 1.35));
    if (Math.abs(scale - session.startScale) > 0.025) session.moved = true;
    onLayout(id, { ...layout, scale: Number(scale.toFixed(3)) });
  };
  const finishResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeRef.current.pointerId !== event.pointerId) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }
    resizeRef.current.pointerId = -1;
  };
  return (
    <motion.div ref={layerRef} className={`story-layer story-layer-${id} ${className} ${selected ? "is-selected" : ""} ${editing ? "is-editing" : ""}`} {...itemAttributes(item, order, ink)} role="group" aria-label={locked || editing ? label : `${label}. Drag to move; use the corner handles to rotate or resize.`} tabIndex={locked || editing ? -1 : 0} style={{ transform: `translate3d(${layout.x}px, ${layout.y}px, 0)`, zIndex: order + 10 } as CSSProperties} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionTiming.exit, ease: motionEase.ui }} onPointerDown={startMove} onPointerMove={move} onPointerUp={finishMove} onPointerCancel={finishMove} onClick={(event) => { if (!locked && !editing && !(event.target as HTMLElement).closest("button, input, textarea, audio, video")) onSelect(id); }} onDoubleClick={locked ? undefined : onEdit} onKeyDown={(event) => {
      if (locked || editing || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id); return; }
      if (event.key === "Escape") { event.preventDefault(); onSelect(null); return; }
      const movement = event.shiftKey ? 18 : 6;
      if (event.key === "ArrowLeft") onLayout(id, { ...layout, ...clampPosition(layout.x - movement, layout.y) });
      else if (event.key === "ArrowRight") onLayout(id, { ...layout, ...clampPosition(layout.x + movement, layout.y) });
      else if (event.key === "ArrowUp") onLayout(id, { ...layout, ...clampPosition(layout.x, layout.y - movement) });
      else if (event.key === "ArrowDown") onLayout(id, { ...layout, ...clampPosition(layout.x, layout.y + movement) });
      else if (event.key === "[") onLayout(id, { ...layout, rotation: layout.rotation - 6 });
      else if (event.key === "]") onLayout(id, { ...layout, rotation: layout.rotation + 6 });
      else if (resizable && (event.key === "+" || event.key === "=")) onLayout(id, { ...layout, scale: clampScale(layout.scale + (event.shiftKey ? .2 : .1)) });
      else if (resizable && (event.key === "-" || event.key === "_")) onLayout(id, { ...layout, scale: clampScale(layout.scale - (event.shiftKey ? .2 : .1)) });
      else if (event.key === "Delete" || event.key === "Backspace") onRemove(id);
      else return;
      event.preventDefault();
    }}>
      <div className="story-layer-paper" style={{ transform: `rotate(${layout.rotation}deg) scale(${layout.scale})` }}>
        {children}
      </div>
      {selected && !editing && <><button className="story-layer-remove" type="button" aria-label={`Remove ${label}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => onRemove(id)}><CloseMark /></button><button className="story-layer-rotate" type="button" aria-label={`Rotate ${label}`} onPointerDown={startRotate} onPointerMove={rotate} onPointerUp={finishRotate} onPointerCancel={finishRotate} onClick={() => { if (!rotationRef.current.moved) onLayout(id, { ...layout, rotation: layout.rotation + 12 }); }}><RotateMark /></button>{resizable && <button className="story-layer-resize" type="button" aria-label={`Resize ${label}`} onPointerDown={startResize} onPointerMove={resize} onPointerUp={finishResize} onPointerCancel={finishResize} onClick={() => { if (!resizeRef.current.moved) onLayout(id, { ...layout, scale: clampScale(layout.scale + .12) }); }}><ResizeMark /></button>}{onEdit && <button className="story-layer-edit" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onEdit}>edit words</button>}</>}
    </motion.div>
  );
}

function AddMark() {
  return <svg className="control-mark control-mark-add" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16c7-.6 13-.2 20 0M16 6c-.4 7-.1 13 0 20" /></svg>;
}

function StickerMark({ id }: { id: StickerId }) {
  return <svg className={`sticker-mark sticker-mark-${id}`} viewBox="0 0 96 96" aria-hidden="true" data-asset-slot={`sticker-${id}`}>
    {id === "burst" && <path d="M48 6c3 18 9 29 18 35 10-7 18-11 28-13-8 11-12 21-13 31 10 4 18 10 25 20-14-4-25-5-34-3-6 9-14 15-26 18 4-12 4-22 1-31-10-2-19-8-27-18 12 2 22 1 30-3C42 21 43 12 48 6z" />}
    {id === "ribbon" && <><path d="M17 27c20-14 42-16 62-4-9 8-17 16-22 27 8 10 13 21 15 33-16-9-30-15-44-17-6 8-11 15-17 22 2-17 0-32-6-44 8-4 12-10 12-17z" /><path d="M30 41c13 5 25 5 37-1M35 55c11 3 21 3 31-1" /></>}
    {id === "stamp" && <><path d="M22 22c16-12 37-13 54 0 12 16 12 37 0 53-17 12-38 12-54 0-12-16-12-37 0-53z" /><path d="M32 47c8-7 16-7 24 0 4-5 9-7 15-7M31 59c10 7 23 7 35 0" /></>}
  </svg>;
}

function StoryToolRail({ hasWords, canAddText, paper, capture, voice, song, pieces, photoCount, markCount, inkColor, drawingActive, editingText, cuesOpen, activePrompt, canUndoDoodle, onText, onFinishText, onToggleCues, onPrompt, onPaper, onDraw, onDoneDrawing, onUndoDoodle, onCamera, onVoice, onSongFile, onAddSticker, onInkColor }: { hasWords: boolean; canAddText: boolean; paper: PaperId; capture: CaptureAsset | null; voice: AudioAsset | null; song: AudioAsset | null; pieces: PieceId[]; photoCount: number; markCount: number; inkColor: InkColor; drawingActive: boolean; editingText: boolean; cuesOpen: boolean; activePrompt: string; canUndoDoodle: boolean; onText: () => void; onFinishText: () => void; onToggleCues: () => void; onPrompt: (prompt: string) => void; onPaper: (paper: PaperId) => void; onDraw: () => void; onDoneDrawing: () => void; onUndoDoodle: () => void; onCamera: () => void; onVoice: () => void; onSongFile: (file: File) => void; onAddSticker: (sticker: StickerId) => void; onInkColor: (color: InkColor) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  const [songImportOpen, setSongImportOpen] = useState(false);
  const songInputRef = useRef<HTMLInputElement>(null);
  const prompts = ["a favourite memory", "what they taught you", "one word for them", "one small thing you notice"];
  return (
    <div className="story-tool-dock">
      {!editingText && !drawingActive && addOpen && songImportOpen && <div className="song-import-note" role="region" aria-label="Add a song"><p>choose an audio file</p><small>Audio stays on this device. Remove it before sharing a link or QR.</small><div><button type="button" onClick={() => songInputRef.current?.click()}>choose file</button><button type="button" onClick={() => setSongImportOpen(false)}>not now</button></div></div>}
      <AnimatePresence>
        {!editingText && !drawingActive && addOpen && <motion.div className="story-add-tray" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(6px)" }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}><div className="paper-choice" role="group" aria-label="Paper character">{(["plain", "dotted", "grid"] as PaperId[]).map((choice) => <button key={choice} type="button" aria-pressed={paper === choice} onClick={() => onPaper(choice)}>{choice}</button>)}</div><Carousel ariaLabel="Creative materials" contentClassName="story-tool-rail"><button type="button" aria-label="photo" disabled={photoCount >= MAX_PHOTOS} aria-pressed={Boolean(capture)} onClick={() => { setAddOpen(false); onCamera(); }}><CameraMark /><span>photo</span><small>{photoCount} / {MAX_PHOTOS}</small></button><button type="button" aria-pressed={Boolean(voice && pieces.includes("voice"))} onClick={() => { setAddOpen(false); onVoice(); }}><MaterialIcon id="voice" /><span>{voice ? "new voice" : "voice"}</span></button><button type="button" aria-pressed={Boolean(song && pieces.includes("song"))} aria-expanded={songImportOpen} onClick={() => setSongImportOpen((current) => !current)}><MaterialIcon id="song" /><span>{song ? "new song" : "song"}</span></button></Carousel><div className="story-authored-tools" aria-label="Colour and hand-drawn mark tools"><div className="story-colour-palette" role="group" aria-label="Ink colour"><span>ink</span>{(["navy", "forest", "rust", "plum", "ochre"] as InkColor[]).map((color) => <button key={color} className={`ink-swatch ink-${color}`} type="button" aria-pressed={inkColor === color} aria-label={`Use ${inkLabels[color]} ink`} onClick={() => onInkColor(color)}><span /></button>)}</div><Carousel ariaLabel="Hand-drawn marks" contentClassName="story-sticker-rail">{(["burst", "ribbon", "stamp"] as StickerId[]).map((sticker) => { return <button key={sticker} type="button" disabled={markCount >= MAX_MARKS} aria-label={`Add ${sticker} mark`} onClick={() => onAddSticker(sticker)}><StickerMark id={sticker} /><span>{sticker}</span></button>; })}</Carousel><span className="scrapbook-mark-count">{markCount} / {MAX_MARKS} marks</span></div></motion.div>}
        {editingText && cuesOpen && <motion.div className="story-add-tray story-prompt-tray" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(6px)" }}><Carousel ariaLabel="Writing prompts" contentClassName="story-prompt-rail">{prompts.map((prompt) => <button key={prompt} className={prompt === activePrompt ? "is-current" : ""} type="button" onClick={() => onPrompt(prompt)}>{prompt}</button>)}</Carousel></motion.div>}
      </AnimatePresence>
      {editingText ? <div className="story-primary-tools story-context-tools"><button type="button" aria-expanded={cuesOpen} onClick={onToggleCues}><span>{cuesOpen ? "hide nudges" : "need a nudge?"}</span></button><button type="button" onClick={onFinishText}><span>done writing</span><Mark /></button></div> : drawingActive ? <div className="story-primary-tools story-context-tools"><button type="button" disabled={!canUndoDoodle} onClick={onUndoDoodle}>undo stroke</button><span className="drawing-now"><MaterialIcon id="drawing" /> draw anywhere</span><button type="button" onClick={onDoneDrawing}>done</button></div> : <div className="story-primary-tools">
        <button className="story-write-tool" type="button" disabled={!canAddText} aria-label={hasWords ? "add words" : "write"} onClick={onText}><span className="story-aa" aria-hidden="true">Aa</span><span>{hasWords ? "add words" : "write"}</span></button>
        <button className="story-draw-tool" type="button" aria-pressed={pieces.includes("drawing")} onClick={onDraw}><MaterialIcon id="drawing" /><span>doodle</span></button>
        <button className="story-add-tool" type="button" aria-expanded={addOpen} onClick={() => setAddOpen((current) => !current)}><AddMark /><span>{addOpen ? "close" : "add"}</span></button>
      </div>}
      <input ref={songInputRef} className="capture-file-input" type="file" accept="audio/*" aria-label="Choose an audio file for this keepsake" tabIndex={-1} onChange={(event) => { const file = event.target.files?.[0]; if (file) { onSongFile(file); setSongImportOpen(false); setAddOpen(false); } event.target.value = ""; }} />
    </div>
  );
}

function AudioPaperPiece({ asset, kind }: { asset: AudioAsset; kind: "voice" | "song" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { audioRef.current?.pause(); setPlaying(false); }, [asset.url]);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play().catch(() => setPlaying(false));
    } else audio.pause();
  };
  return <div className={`audio-paper-piece audio-paper-${kind} ${playing ? "is-playing" : ""}`}><button className="audio-paper-playback" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${kind}: ${asset.name}`}><MaterialIcon id={kind} /></button><span><strong>{kind === "voice" ? "voice note" : asset.name}</strong><small>{playing ? "playing · tap icon to pause" : "tap icon to play"}</small></span><audio ref={audioRef} src={asset.url} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /></div>;
}

function VoiceRecorder({ onCancel, onRecorded }: { onCancel: () => void; onRecorded: (asset: AudioAsset) => void }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState<"requesting" | "ready" | "recording" | "unsupported" | "error">("requesting");
  const [seconds, setSeconds] = useState(0);
  const close = () => { recorderRef.current?.state === "recording" && recorderRef.current.stop(); onCancel(); };
  useEffect(() => {
    mountedRef.current = true;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setStatus("unsupported"); return () => { mountedRef.current = false; }; }
    void navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => { if (!mountedRef.current) { stream.getTracks().forEach((track) => track.stop()); return; } streamRef.current = stream; setStatus("ready"); }).catch(() => { if (mountedRef.current) setStatus("error"); });
    return () => { mountedRef.current = false; const recorder = recorderRef.current; if (recorder?.state === "recording") { recorder.onstop = null; recorder.stop(); } streamRef.current?.getTracks().forEach((track) => track.stop()); };
  }, []);
  useEffect(() => { if (status !== "recording") return; const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000); return () => window.clearInterval(timer); }, [status]);
  const start = () => {
    const stream = streamRef.current;
    if (!stream) return;
    try {
      const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((candidate) => MediaRecorder.isTypeSupported(candidate));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => { if (!mountedRef.current) return; const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }); if (!blob.size) { setStatus("error"); return; } onRecorded({ url: URL.createObjectURL(blob), name: "voice note" }); };
      recorderRef.current = recorder; recorder.start(200); setSeconds(0); setStatus("recording"); navigator.vibrate?.(8);
    } catch { setStatus("error"); }
  };
  return <motion.div className="voice-recorder" role="dialog" aria-modal="true" aria-label="Record a voice note" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(8px)" }} transition={{ duration: 0.18 }}><p>{status === "requesting" ? "opening your microphone…" : status === "ready" ? "say it in your own voice." : status === "recording" ? `recording · ${seconds}s` : status === "unsupported" ? "voice recording is not available here." : "we could not use the microphone."}</p>{status === "ready" && <button className="drawn-action" type="button" onClick={start}>start recording <Mark /></button>}{status === "recording" && <button className="drawn-action" type="button" onClick={() => recorderRef.current?.stop()}>keep this voice <Mark /></button>}<button className="quiet-link" type="button" onClick={close}>{status === "unsupported" || status === "error" ? "back to paper" : "cancel"}</button></motion.div>;
}

function CapturedMedia({ capture, className = "", interactive = false }: { capture: CaptureAsset | null; className?: string; interactive?: boolean }) {
  if (!capture) return null;
  if (capture.kind === "sample") return <div className={`captured-media sample-capture ${className}`} role="img" aria-label="Illustrative sample moving-day moment"><span className="sample-window" /><span className="sample-box sample-box-one" /><span className="sample-box sample-box-two" /><small>sample moment</small></div>;
  if (!capture.url) return null;
  return capture.kind === "video" ? <video className={`captured-media ${className}`} src={capture.url} controls preload="metadata" playsInline aria-label={interactive ? "Play the received video" : "Preview your captured video"} /> : <img className={`captured-media ${className}`} src={capture.url} alt="Your captured moment" draggable={false} />;
}

function SealedEnvelopeArtwork({ snapshot, className = "" }: { snapshot: KeepsakeSnapshot; className?: string }) {
  const label = `A hand-drawn envelope for ${snapshot.recipient} from ${snapshot.sender}${snapshot.seal.length ? ", finished with their personal stamp" : ""}`;
  const sealWeight = snapshot.sealWeight ?? "bold";
  return <div className={`sealed-envelope-artwork seal-weight-${sealWeight} ${className}`} data-envelope={snapshot.envelope} data-seal-weight={sealWeight} role="img" aria-label={label}><img className="sealed-envelope-source" src={artwork.containers.envelope} alt="" draggable={false} data-asset-slot="sealed-envelope" />{snapshot.seal.length > 0 && <span className="sealed-artwork-stamp"><img className="sealed-stamp-base" src={artwork.seal.base} alt="" draggable={false} /><DoodleArtwork strokes={snapshot.seal} className="seal-artwork" /></span>}</div>;
}

function Preview({ snapshot, onEdit, onChangeCarrier, onGive }: { snapshot: KeepsakeSnapshot; onEdit: () => void; onChangeCarrier: () => void; onGive: () => void }) {
  return (
    <Page className="preview-page">
      <TopLine onBack={onEdit} label="edit the inside" />
      <div className="preview-identities"><span>for {snapshot.recipient}</span><span>from {snapshot.sender}</span></div>
      <motion.div className="sealed-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}><SealedEnvelopeArtwork snapshot={snapshot} /></motion.div>
      <div className="preview-copy"><h1>one thing, ready to give.</h1></div>
      <button className="quiet-link" type="button" onClick={onChangeCarrier}>choose another way for it to arrive</button>
      <button className="drawn-action preview-next" type="button" onClick={onGive}>give this privately <Mark /></button>
    </Page>
  );
}

function Courier({ carrier, state }: { carrier: Carrier; state: "pickup" | "departure" | "arrival" }) {
  if (carrier.id !== "firefly") {
    const source = carrier.id === "bottle" ? artwork.containers.bottleReady : artwork.containers.plane;
    return <div className={`courier courier-${state} courier-${carrier.id}`} aria-hidden="true"><div className="courier-body courier-object-body" data-asset-slot={`courier-${carrier.id}`}><img src={source} alt="" /></div></div>;
  }
  return <div className={`courier courier-${state} courier-firefly`} aria-hidden="true"><div className="courier-body courier-firefly-carrying" data-asset-slot="courier-firefly"><img className="courier-firefly-frame courier-firefly-brand-frame" src={artwork.firefly.carrying} alt="" /></div></div>;
}

function Handoff({ snapshot, recipient, carrier, copied, failed, reduceMotion, demoReceiver, onBack, onEdit, onCopy, onFail, onFinish }: { snapshot: KeepsakeSnapshot; recipient: string; carrier: Carrier; copied: boolean; failed: boolean; reduceMotion: boolean; demoReceiver?: boolean; onBack: () => void; onEdit: () => void; onCopy: () => Promise<boolean>; onFail: () => void; onFinish: () => void }) {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrPresented, setQrPresented] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [manualCopyReady, setManualCopyReady] = useState(false);
  const [manualCopyConfirmed, setManualCopyConfirmed] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const qrDialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!qrOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setQrOpen(false); }
      if (event.key !== "Tab") return;
      const controls = Array.from(qrDialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeys);
    return () => { document.removeEventListener("keydown", handleKeys); previous?.focus(); };
  }, [qrOpen]);
  const encoded = isSafeSnapshot(snapshot) && !containsBlobMedia(snapshot) ? encodeSnapshot(snapshot) : "";
  const receiverPath = demoReceiver ? "/demo/receive" : `/for/${snapshot.id}`;
  const url = encoded && encoded.length <= LINK_MAX ? `${typeof window === "undefined" ? "" : window.location.origin}${receiverPath}#v3.${encoded}` : "";
  const qrIsExact = Boolean(url) && url.length <= QR_MAX;
  const unavailable = !url || failed;
  const unavailableReason = containsBlobMedia(snapshot)
    ? "This keepsake includes local media that cannot travel in a link. Return to your paper and remove uploaded photos, video or audio to share the exact remaining page."
    : !isSafeSnapshot(snapshot)
      ? "This draft contains details that cannot travel in a link. Return to your paper to edit it."
      : !url ? "This keepsake is too detailed for this prototype link. Return to your paper to simplify it."
        : "This is the demo's broken-link test. Try copying again to return to the working link.";
  const selectLink = () => {
    setManualCopyReady(true);
    linkInputRef.current?.focus();
    linkInputRef.current?.select();
  };
  const copyLink = async () => {
    const success = await onCopy();
    setCopyFailed(!success);
    if (!success) setManualCopyReady(true);
  };
  useEffect(() => {
    if (copyFailed && url && !failed) { linkInputRef.current?.focus(); linkInputRef.current?.select(); }
  }, [copyFailed, failed, url]);
  const saveQr = () => {
    const svg = qrDialogRef.current?.querySelector(":scope > svg");
    if (!svg || !qrIsExact) return;
    const source = new XMLSerializer().serializeToString(svg);
    const file = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${source}`], { type: "image/svg+xml;charset=utf-8" });
    const fileUrl = URL.createObjectURL(file);
    const download = document.createElement("a");
    download.href = fileUrl;
    download.download = `warm-and-fuzzies-${snapshot.id}-qr.svg`;
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0);
  };
  return (
    <Page className="handoff-page">
      <TopLine onBack={onBack} label="back to the object" />
      <header><h1>{unavailable ? "your page needs one more step." : `give this to ${recipient}.`}</h1></header>
      <motion.div className="handoff-object" aria-label={`Your ${carrier.shortLabel} is ready to give`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}><CarrierIcon id={carrier.id} size="sealed" /></motion.div>
      <div className="handoff-link-tools">
        <div className={`private-link ${unavailable ? "link-failed handoff-link-blocked" : ""}`}>
          {unavailable ? <span role="status">{unavailableReason}</span> : <input ref={linkInputRef} type="text" readOnly value={url} aria-label="Receiver link" onFocus={(event) => { setManualCopyReady(true); event.currentTarget.select(); }} onClick={(event) => event.currentTarget.select()} />}
          <button type="button" aria-label="Copy generated receiver link" disabled={!url} onClick={() => { void copyLink(); }}>{copied ? "copied" : failed ? "try again" : "copy"}</button>
        </div>
        {url && !failed && (qrIsExact ? <button className="handoff-qr" type="button" onClick={() => { setQrPresented(true); setQrOpen(true); }} aria-label="Open receiver QR for this keepsake" data-keepsake-id={snapshot.id}><QRCodeSVG value={url} size={88} level="L" marginSize={1} bgColor="#ffffff" fgColor="#081f4d" title="Receiver QR for this keepsake" /><span>scan it</span></button> : <p className="handoff-qr-limit" role="status">exact link only<small>too detailed for a reliable QR</small></p>)}
      </div>
      {url && !failed && <div className="handoff-link-actions"><button type="button" onClick={selectLink}>select link</button><a href={url} target="_blank" rel="noopener noreferrer">open receiver</a></div>}
      {copyFailed && !unavailable && <p className="copy-recovery-note" role="status">Your link is ready. Copy it from the selected field, or use the QR.</p>}
      {manualCopyReady && !copied && !qrPresented && !manualCopyConfirmed && !unavailable && <button className="quiet-link manual-copy-confirm" type="button" onClick={() => setManualCopyConfirmed(true)}>I copied the link</button>}
      {(copied || qrPresented || manualCopyConfirmed) && !unavailable && <button className="drawn-action" type="button" onClick={onFinish}>finish giving <Mark /></button>}
      {unavailable && <button className="drawn-action" type="button" onClick={onEdit}>back to your paper <Mark /></button>}
      {demoReceiver && !unavailable && !copied && !qrPresented && !manualCopyConfirmed && <button className="quiet-link failure-test" type="button" onClick={onFail}>show the broken-link state</button>}
      <p className="system-note">Anyone with the link or QR can open it. Share it yourself; this prototype does not send it or tell you when it is opened.</p>
      {typeof document !== "undefined" && createPortal(<AnimatePresence>{qrOpen && qrIsExact && <motion.div ref={qrDialogRef} className="qr-dialog" role="dialog" aria-modal="true" aria-label="Receiver QR for this keepsake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} onKeyDown={(event) => { if (event.key === "Escape") setQrOpen(false); }}><button className="qr-dialog-close" type="button" autoFocus onClick={() => setQrOpen(false)} aria-label="Close receiver QR"><CloseMark /></button><QRCodeSVG value={url} size={350} level="L" marginSize={3} bgColor="#ffffff" fgColor="#081f4d" title="Scan to open this keepsake" /><p>scan to give this to {recipient}.</p><small>This code belongs to this keepsake. Anyone who scans it opens the same sealed object—no account needed.</small><button className="quiet-link qr-save" type="button" onClick={saveQr}>save this QR</button></motion.div>}</AnimatePresence>, document.body)}
    </Page>
  );
}

function DeliveryMascot({ className = "" }: { className?: string }) {
  return <span className={`delivery-mascot ${className}`}><img className="delivery-mascot-firefly" src={artwork.firefly.carrying} alt="" draggable={false} data-asset-slot="firefly-carrying-letter" /></span>;
}

function Sent({ recipient, carrier, reduceMotion, onAgain, onLeave }: { recipient: string; carrier: Carrier; reduceMotion: boolean; onAgain: () => void; onLeave: () => void }) {
  const [departureStarted, setDepartureStarted] = useState(reduceMotion);
  const [sentComplete, setSentComplete] = useState(reduceMotion);
  const completedRef = useRef(reduceMotion);
  const departureSeconds = motionTiming.departure[carrier.id];
  useEffect(() => {
    if (reduceMotion) {
      completedRef.current = true;
      setDepartureStarted(true);
      setSentComplete(true);
      return;
    }
    if (completedRef.current) return;
    setDepartureStarted(false);
    setSentComplete(false);
    const frame = window.requestAnimationFrame(() => setDepartureStarted(true));
    return () => window.cancelAnimationFrame(frame);
  }, [carrier.id, reduceMotion]);
  const completeDeparture = () => {
    if (!departureStarted || completedRef.current) return;
    completedRef.current = true;
    setSentComplete(true);
  };
  const departureTransition = { duration: departureSeconds, ease: motionEase.travel };
  return (
    <Page className="sent-page">
      <div className="sent-delivery-stage" data-carrier={carrier.id} data-delivery-stage={sentComplete ? "complete" : reduceMotion ? "still" : "departing"} aria-hidden="true">
        <motion.img className="delivery-sun sent-sun" src={artwork.environment.sun} alt="" draggable={false} data-asset-slot="delivery-sun" initial={reduceMotion ? false : { opacity: 0, transform: "rotate(-5deg) scale(.94)" }} animate={{ opacity: 1, transform: departureStarted && !reduceMotion ? ["rotate(-5deg) scale(.94)", "rotate(4deg) scale(1)", "rotate(0deg) scale(1)"] : "rotate(0deg) scale(1)" }} transition={{ opacity: { duration: reduceMotion ? .01 : .42, ease: motionEase.ui }, transform: { duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .7, 1], ease: motionEase.ui } }} />
        {carrier.id === "firefly" && <><motion.img className="sent-reeds sent-reeds-left" src={artwork.environment.reeds} alt="" draggable={false} data-asset-slot="firefly-reeds-left" initial={reduceMotion ? false : { opacity: 0, transform: "rotate(-3deg) translate3d(0, 12px, 0)" }} animate={{ opacity: 1, transform: departureStarted && !reduceMotion ? ["rotate(-3deg) translate3d(0, 12px, 0)", "rotate(2deg) translate3d(0, 0, 0)", "rotate(-1deg) translate3d(0, 0, 0)", "rotate(0deg) translate3d(0, 0, 0)"] : "rotate(0deg) translate3d(0, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .38, .72, 1], ease: motionEase.ui }} /><motion.img className="sent-reeds sent-reeds-right" src={artwork.environment.reeds} alt="" draggable={false} data-asset-slot="firefly-reeds-right" initial={reduceMotion ? false : { opacity: 0, transform: "scaleX(-1) rotate(-3deg) translate3d(0, 12px, 0)" }} animate={{ opacity: 1, transform: departureStarted && !reduceMotion ? ["scaleX(-1) rotate(-3deg) translate3d(0, 12px, 0)", "scaleX(-1) rotate(2deg) translate3d(0, 0, 0)", "scaleX(-1) rotate(-1deg) translate3d(0, 0, 0)", "scaleX(-1) rotate(0deg) translate3d(0, 0, 0)"] : "scaleX(-1) rotate(0deg) translate3d(0, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .34, .68, 1], ease: motionEase.ui }} /></>}
        {carrier.id === "plane" && <div className="sent-plane-clouds" aria-hidden="true"><motion.img className="sent-plane-cloud sent-plane-cloud-top" data-asset-slot="plane-cloud" src={artwork.environment.planeCloudTop} alt="" draggable={false} initial={reduceMotion ? false : { transform: "translate3d(42px, 12px, 0)" }} animate={{ transform: departureStarted && !reduceMotion ? ["translate3d(42px, 12px, 0)", "translate3d(8px, 2px, 0)", "translate3d(-28px, -8px, 0)"] : "translate3d(-28px, -8px, 0)" }} transition={{ duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /><motion.img className="sent-plane-cloud sent-plane-cloud-middle" data-asset-slot="plane-cloud" src={artwork.environment.planeCloudMiddle} alt="" draggable={false} initial={reduceMotion ? false : { transform: "translate3d(44px, 0, 0)" }} animate={{ transform: departureStarted && !reduceMotion ? ["translate3d(44px, 0, 0)", "translate3d(10px, 5px, 0)", "translate3d(-34px, 12px, 0)"] : "translate3d(-34px, 12px, 0)" }} transition={{ duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /><motion.img className="sent-plane-cloud sent-plane-cloud-bottom" data-asset-slot="plane-cloud" src={artwork.environment.planeCloudBottom} alt="" draggable={false} initial={reduceMotion ? false : { transform: "translate3d(-38px, -4px, 0)" }} animate={{ transform: departureStarted && !reduceMotion ? ["translate3d(-38px, -4px, 0)", "translate3d(4px, 7px, 0)", "translate3d(42px, 18px, 0)"] : "translate3d(42px, 18px, 0)" }} transition={{ duration: reduceMotion ? .01 : departureSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /></div>}
        {reduceMotion ? carrier.id === "bottle" ? <><img className="sent-water-still" src={artwork.environment.waveA} alt="" draggable={false} /><CarrierIcon id={carrier.id} size="sealed" /></> : carrier.id === "firefly" ? <span className="sent-firefly-carrying sent-delivery-still"><DeliveryMascot /></span> : <CarrierIcon id={carrier.id} size="sealed" /> : !sentComplete && (carrier.id === "firefly" ? <><motion.img className="sent-letter-object" src={artwork.containers.envelope} alt="" draggable={false} initial={false} animate={departureStarted ? { opacity: [1, 1, 1, 0], transform: ["translate3d(0, 0, 0) rotate(-1deg) scale(1)", "translate3d(-3px, 1px, 0) rotate(-1.5deg) scale(1.01)", "translate3d(0, -2px, 0) rotate(0deg) scale(.96)", "translate3d(0, -8px, 0) rotate(2deg) scale(.78)"] } : { opacity: 1, transform: "translate3d(0, 0, 0) rotate(-1deg) scale(1)" }} transition={{ duration: departureSeconds, times: [0, .36, .52, .68], ease: motionEase.travel }} /><motion.div className="sent-pickup-courier" initial={false} animate={{ transform: departureStarted ? ["translate3d(360px, 6px, 0) rotate(13deg) scale(.68)", "translate3d(286px, 54px, 0) rotate(5deg) scale(.76)", "translate3d(224px, 24px, 0) rotate(-4deg) scale(.8)", "translate3d(142px, 104px, 0) rotate(4deg) scale(.84)", "translate3d(126px, 174px, 0) rotate(-3deg) scale(.84)", "translate3d(248px, 108px, 0) rotate(6deg) scale(.78)", "translate3d(422px, -12px, 0) rotate(14deg) scale(.66)"] : "translate3d(360px, 6px, 0) rotate(13deg) scale(.68)" }} transition={{ ...departureTransition, times: [0, .16, .29, .42, .56, .74, 1] }} onAnimationComplete={completeDeparture}><motion.span className="sent-firefly-empty" initial={false} animate={{ opacity: departureStarted ? [1, 1, 0, 0] : 1 }} transition={{ duration: departureSeconds, times: [0, .45, .53, 1], ease: motionEase.ui }}><img className="sent-firefly-wing-frame sent-firefly-wing-one" src={artwork.firefly.filledA} alt="" draggable={false} /><img className="sent-firefly-wing-frame sent-firefly-wing-two" src={artwork.firefly.filledB} alt="" draggable={false} /></motion.span><motion.span className="sent-firefly-carrying" initial={false} animate={{ opacity: departureStarted ? [0, 0, 1, 1] : 0 }} transition={{ duration: departureSeconds, times: [0, .47, .55, 1], ease: motionEase.ui }}><DeliveryMascot /></motion.span></motion.div></> : carrier.id === "bottle" ? <><motion.img className="sent-water-departure sent-water-departure-a" data-asset-slot="bottle-water" src={artwork.environment.waveA} alt="" draggable={false} initial={false} animate={{ opacity: departureStarted ? [0, .72, .72, .72, .68] : 0, transform: departureStarted ? ["translate3d(-24px, 216px, 0) scale(.94)", "translate3d(-10px, 212px, 0) scale(.94)", "translate3d(-36px, 218px, 0) scale(.94)", "translate3d(-14px, 210px, 0) scale(.94)", "translate3d(-24px, 216px, 0) scale(.94)"] : "translate3d(-24px, 216px, 0) scale(.94)" }} transition={{ duration: departureSeconds, times: [0, .12, .46, .75, 1], ease: motionEase.travel }} /><motion.img className="sent-water-departure sent-water-departure-b" src={artwork.environment.waveB} alt="" draggable={false} initial={false} animate={{ opacity: departureStarted ? [0, .44, .44, .44, .4] : 0, transform: departureStarted ? ["translate3d(-40px, 244px, 0) scale(.9)", "translate3d(-56px, 242px, 0) scale(.9)", "translate3d(-28px, 248px, 0) scale(.9)", "translate3d(-50px, 242px, 0) scale(.9)", "translate3d(-40px, 244px, 0) scale(.9)"] : "translate3d(-40px, 244px, 0) scale(.9)" }} transition={{ duration: departureSeconds, times: [0, .12, .46, .75, 1], ease: motionEase.travel }} /><motion.div className="sent-carrier-departure sent-carrier-departure-bottle" initial={false} animate={{ transform: departureStarted ? ["translate3d(128px, 112px, 0) scale(.92)", "translate3d(128px, 168px, 0) scale(.92)", "translate3d(128px, 252px, 0) scale(.92)", "translate3d(128px, 354px, 0) scale(.92)", "translate3d(128px, 540px, 0) scale(.92)"] : "translate3d(128px, 112px, 0) scale(.92)" }} transition={{ ...departureTransition, times: [0, .22, .48, .75, 1] }} onAnimationComplete={completeDeparture}><CarrierIcon id={carrier.id} size="sealed" /></motion.div></> : <motion.div className="sent-carrier-departure sent-carrier-departure-plane" initial={false} animate={{ transform: departureStarted ? ["translate3d(16px, 212px, 0) rotate(-16deg) scale(.78)", "translate3d(98px, 154px, 0) rotate(-4deg) scale(1)", "translate3d(184px, 122px, 0) rotate(5deg) scale(.96)", "translate3d(256px, 54px, 0) rotate(1deg) scale(.9)", "translate3d(458px, -54px, 0) rotate(18deg) scale(.72)"] : "translate3d(16px, 212px, 0) rotate(-16deg) scale(.78)" }} transition={{ ...departureTransition, times: [0, .18, .42, .72, 1] }} onAnimationComplete={completeDeparture}><CarrierIcon id={carrier.id} size="sealed" /></motion.div>)}
      </div>
      <AnimatePresence>{sentComplete && <motion.div className="sent-completion" initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0, 12px, 0)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : .42, ease: motionEase.ui }}><div className="sent-copy"><h1>that&apos;s it from you…</h1></div><div className="sent-secondary"><button className="quiet-link" type="button" onClick={onAgain}>make another one…</button><button className="quiet-link" type="button" onClick={onLeave}>leave for now…</button></div></motion.div>}</AnimatePresence>
      <p className="sr-only" role="status">{sentComplete ? `Your ${carrier.shortLabel} has left with the letter for ${recipient}.` : `Your ${carrier.shortLabel} is taking the letter to ${recipient}.`}</p>
    </Page>
  );
}

function Arrival({ recipient, senderName, carrier, reduceMotion, onOpen, onDefer, onRemove }: { recipient: string; senderName: string; carrier: Carrier; reduceMotion: boolean; onOpen: () => void; onDefer: () => void; onRemove: () => void }) {
  const [landed, setLanded] = useState(reduceMotion);
  const [tapPrimed, setTapPrimed] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);
  const settledRef = useRef(reduceMotion);
  const [arrivalStarted, setArrivalStarted] = useState(false);
  const arrivalSeconds = motionTiming.arrival[carrier.id];
  const arrivalTransforms = carrier.id === "firefly" ? ["translate3d(-230px, -28px, 0) rotate(-12deg) scale(.72)", "translate3d(-116px, 18px, 0) rotate(5deg) scale(.8)", "translate3d(34px, 78px, 0) rotate(-5deg) scale(.9)", "translate3d(-22px, 124px, 0) rotate(4deg) scale(.94)", "translate3d(10px, 42px, 0) rotate(-3deg) scale(.98)", "translate3d(0, 0, 0) rotate(0deg) scale(1)"] : carrier.id === "plane" ? ["translate3d(-242px, 138px, 0) rotate(-14deg) scale(.72)", "translate3d(-106px, 84px, 0) rotate(-4deg) scale(.88)", "translate3d(28px, 34px, 0) rotate(5deg) scale(1)", "translate3d(62px, 16px, 0) rotate(-1deg) scale(.98)", "translate3d(0, 0, 0) rotate(0deg) scale(1)"] : ["translate3d(0, -258px, 0) scale(.78)", "translate3d(0, -132px, 0) scale(.9)", "translate3d(0, -42px, 0) scale(.98)", "translate3d(0, 0, 0) scale(1)"];
  useEffect(() => {
    if (reduceMotion) { settledRef.current = true; setLanded(true); return; }
    if (settledRef.current) return;
    const frame = window.requestAnimationFrame(() => setArrivalStarted(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);
  useEffect(() => () => { if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current); }, []);
  const settleArrival = () => { if (!arrivalStarted || settledRef.current) return; settledRef.current = true; setLanded(true); };
  const open = () => { if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current); setTapPrimed(false); navigator.vibrate?.([10, 18, 12]); onOpen(); };
  const attemptOpen = () => { if (!landed) return; const now = performance.now(); if (now - lastTapRef.current < 420) { open(); return; } lastTapRef.current = now; setTapPrimed(true); navigator.vibrate?.(8); if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current); tapTimerRef.current = window.setTimeout(() => setTapPrimed(false), 460); };
  return <Page className={`arrival-page arrival-carrier-${carrier.id}`}><motion.header aria-hidden={!landed} initial={false} animate={{ opacity: landed ? 1 : 0, transform: landed ? "translate3d(0, 0, 0)" : "translate3d(0, 10px, 0)" }} transition={{ duration: reduceMotion ? .01 : .38, ease: motionEase.ui }}><span>for {recipient}</span><h1>you’ve got something from {senderName}.</h1></motion.header><div className="arrival-object" data-carrier={carrier.id}><motion.img className="delivery-sun arrival-sun" data-asset-slot="arrival-sun" src={artwork.environment.sun} alt="" draggable={false} initial={reduceMotion ? false : { opacity: 0, transform: "rotate(-5deg) scale(.94)" }} animate={{ opacity: 1, transform: !landed && !reduceMotion ? ["rotate(-5deg) scale(.94)", "rotate(4deg) scale(1)", "rotate(0deg) scale(1)"] : "rotate(0deg) scale(1)" }} transition={{ opacity: { duration: reduceMotion ? .01 : .42, ease: motionEase.ui }, transform: { duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .7, 1], ease: motionEase.ui } }} />{carrier.id === "firefly" && <div className="arrival-firefly-reeds" aria-hidden="true"><motion.img className="arrival-environment arrival-reeds arrival-reeds-left" src={artwork.environment.reeds} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["rotate(-3deg)", "rotate(2deg)", "rotate(-1deg)", "rotate(0deg)"] : "rotate(0deg)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .35, .72, 1], ease: motionEase.ui }} /><motion.img className="arrival-environment arrival-reeds arrival-reeds-right" src={artwork.environment.reeds} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["scaleX(-1) rotate(-3deg)", "scaleX(-1) rotate(2deg)", "scaleX(-1) rotate(-1deg)", "scaleX(-1) rotate(0deg)"] : "scaleX(-1) rotate(0deg)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .32, .68, 1], ease: motionEase.ui }} /></div>}{carrier.id === "plane" && <div className="arrival-plane-clouds" aria-hidden="true"><motion.img className="arrival-plane-cloud arrival-plane-cloud-top" src={artwork.environment.planeCloudTop} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["translate3d(-34px, -8px, 0)", "translate3d(8px, 2px, 0)", "translate3d(42px, 12px, 0)"] : "translate3d(42px, 12px, 0)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /><motion.img className="arrival-plane-cloud arrival-plane-cloud-middle" src={artwork.environment.planeCloudMiddle} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["translate3d(-34px, 12px, 0)", "translate3d(10px, 5px, 0)", "translate3d(44px, 0, 0)"] : "translate3d(44px, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /><motion.img className="arrival-plane-cloud arrival-plane-cloud-bottom" src={artwork.environment.planeCloudBottom} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["translate3d(42px, 18px, 0)", "translate3d(4px, 7px, 0)", "translate3d(-38px, -4px, 0)"] : "translate3d(-38px, -4px, 0)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .62, 1], ease: motionEase.ui }} /></div>}{carrier.id === "bottle" && <div className="arrival-water" aria-hidden="true"><motion.img className="arrival-wave arrival-wave-a" src={artwork.environment.waveA} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["translate3d(-12px, 0, 0)", "translate3d(6px, 5px, 0)", "translate3d(12px, 0, 0)"] : "translate3d(0, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .5, 1], ease: motionEase.ui }} /><motion.img className="arrival-wave arrival-wave-b" src={artwork.environment.waveB} alt="" draggable={false} animate={{ transform: !landed && !reduceMotion ? ["translate3d(10px, 0, 0)", "translate3d(-4px, -4px, 0)", "translate3d(-10px, 0, 0)"] : "translate3d(0, 0, 0)" }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: reduceMotion ? undefined : [0, .5, 1], ease: motionEase.ui }} /></div>}<motion.div className="arrival-carrier-journey" data-arrival-state={landed ? "landed" : "travelling"} initial={false} animate={{ transform: landed || reduceMotion ? "translate3d(0, 0, 0) rotate(0deg) scale(1)" : arrivalStarted ? arrivalTransforms : arrivalTransforms[0] }} transition={{ duration: reduceMotion ? .01 : arrivalSeconds, times: carrier.id === "firefly" ? [0, .16, .34, .55, .76, 1] : carrier.id === "plane" ? [0, .2, .48, .72, 1] : [0, .28, .68, 1], ease: motionEase.travel }} onAnimationComplete={settleArrival}><motion.button type="button" className={`arrival-carrier-button ${tapPrimed ? "is-tap-primed" : ""}`} disabled={!landed} aria-label={landed ? `Double tap the ${carrier.shortLabel} to open` : `${carrier.shortLabel} is arriving`} onPointerUp={attemptOpen} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && landed) { event.preventDefault(); open(); } }} animate={{ transform: landed && tapPrimed ? "scale(.965) rotate(-1deg)" : "scale(1) rotate(0deg)" }} transition={{ duration: .14, ease: motionEase.ui }}>{carrier.id === "firefly" ? <DeliveryMascot className="arrival-delivery-mascot" /> : <CarrierIcon id={carrier.id} size="arrival" />}</motion.button></motion.div>{landed && <motion.div className="arrival-drop-copy" initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0, 10px, 0)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }} transition={{ delay: reduceMotion ? 0 : .12, duration: reduceMotion ? .01 : .34, ease: motionEase.ui }}><p aria-live="polite">{tapPrimed ? <>tap once more<br /><small>to unfold what they made</small></> : <>double tap to open<br /><small>or use the open button</small></>}</p><button className="quiet-link direct-open" type="button" onClick={open}>open it</button></motion.div>}</div><AnimatePresence>{landed && <motion.div className="arrival-options" initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0, 10px, 0)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }} transition={{ delay: reduceMotion ? 0 : .12, duration: reduceMotion ? .01 : .34, ease: motionEase.ui }}><button className="quiet-link" type="button" onClick={onDefer}>another time</button><button className="quiet-link unavailable-link" type="button" onClick={onRemove}>remove it</button></motion.div>}</AnimatePresence></Page>;
}

type ReceiverObjectProps = {
  recipient: string;
  words: string;
  doodles: DoodleStroke[];
  stickers: StickerId[];
  inkColor: InkColor;
  capture: CaptureAsset | null;
  voice: AudioAsset | null;
  song: AudioAsset | null;
  removeOpen: boolean;
  onKeep: () => void;
  onClose: () => void;
  onRemove: () => void;
  onCancelRemove: () => void;
  onConfirmRemove: () => void;
};

function Opening({ snapshot, removeOpen, reduceMotion, onKeep, onClose, onRemove, onCancelRemove, onConfirmRemove }: { snapshot: KeepsakeSnapshot; removeOpen: boolean; reduceMotion: boolean; onKeep: () => boolean; onClose: () => void; onRemove: () => void; onCancelRemove: () => void; onConfirmRemove: () => void }) {
  const [opened, setOpened] = useState(reduceMotion);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [keepFailed, setKeepFailed] = useState(false);
  useEffect(() => { if (reduceMotion) setOpened(true); }, [reduceMotion]);
  const keep = () => { if (!onKeep()) setKeepFailed(true); };
  return <motion.section className={`opening-page opening-envelope ${opened ? "is-open" : "is-unfolding"}`} initial={false} data-opening-state={opened ? "opened" : "folding"} aria-label="Opening the sealed private envelope">
    {!opened && <motion.div className="opening-sealed-object" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}><SealedEnvelopeArtwork snapshot={snapshot} /></motion.div>}
    <div className="opening-object-content"><div className="receiver-paper-stage" aria-hidden={!opened} inert={!opened ? true : undefined}>
      <div className="receiver-paper-final" style={{ opacity: opened ? 1 : 0 }}><AuthoredPaper snapshot={snapshot} receiver={opened} /></div>
      {!opened && <div className="receiver-fold-panels" aria-hidden="true"><PaperFold snapshot={snapshot} direction="open" onComplete={() => setOpened(true)} /></div>}
    </div><AnimatePresence initial={false}>{opened && <motion.div className={`receiver-actions-reveal ${actionsOpen ? "is-expanded" : "is-collapsed"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}>{actionsOpen ? <><button className="receiver-actions-back" type="button" onClick={() => { setActionsOpen(false); onCancelRemove(); }}><Mark direction="left" /> back to the letter</button><ReceiverActions removeOpen={removeOpen} keepFailed={keepFailed} onKeep={keep} onClose={onClose} onRemove={onRemove} onCancelRemove={onCancelRemove} onConfirmRemove={onConfirmRemove} /></> : <button className="receiver-actions-trigger" type="button" onClick={() => setActionsOpen(true)}>what should this become? <Mark /></button>}</motion.div>}</AnimatePresence></div>
    {!opened && <p className="receiver-opening-status">unfolding what {snapshot.sender} made.</p>}
  </motion.section>;
}

function ReceiverActions({ removeOpen, keepFailed, onKeep, onClose, onRemove, onCancelRemove, onConfirmRemove }: { removeOpen: boolean; keepFailed: boolean; onKeep: () => void; onClose: () => void; onRemove: () => void; onCancelRemove: () => void; onConfirmRemove: () => void }) {
  return <footer className="receiver-ending"><h2>what should this become?</h2>{keepFailed && <p className="receiver-save-note" role="alert">This version contains local photo or audio data, so it cannot stay after the tab closes. The original is still open here.</p>}{removeOpen ? <div className="remove-confirm" role="alert"><p>Remove this from your private cabinet? {sender} will not be told.</p><button type="button" onClick={onConfirmRemove}>remove it</button><button type="button" onClick={onCancelRemove}>leave it here</button></div> : <div className="ending-actions"><button type="button" onClick={onKeep}><MaterialIcon id="photo" /><span>keep</span></button><button type="button" onClick={onClose}><span className="ending-x" aria-hidden="true">×</span><span>close</span></button><button type="button" onClick={onRemove}><span className="ending-remove" aria-hidden="true" /><span>remove</span></button></div>}</footer>;
}

function ReceiverAudio({ asset, kind }: { asset: AudioAsset; kind: "voice" | "song" }) {
  return <section className={`object-${kind}`}><div className="receiver-audio-heading"><MaterialIcon id={kind} /><span><strong>{kind === "voice" ? "voice note" : asset.name}</strong><small>{kind === "voice" ? "in their voice" : "a song they chose"}</small></span></div><audio controls preload="metadata" src={asset.url} aria-label={`Play ${kind}: ${asset.name}`} /></section>;
}

function ReceiverObject({ recipient, words, doodles, stickers, inkColor, capture, voice, song, removeOpen, onKeep, onClose, onRemove, onCancelRemove, onConfirmRemove }: ReceiverObjectProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <>
      <header className="object-opening-copy"><span>for {recipient}</span>{words && <h1 ref={headingRef} tabIndex={-1}>{words}</h1>}<p>from {sender}</p></header>
      {capture && <motion.figure className="object-capture" data-scroll-drag="ignore" initial={{ opacity: 0, transform: "translateY(24px) rotate(-1.5deg)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(1deg)" }} transition={{ delay: 0.12, duration: 0.36, ease: [0.23, 1, 0.32, 1] }}><CapturedMedia capture={capture} interactive /><figcaption>{capture.kind === "video" ? "a moment you can return to." : "one small moment, kept here."}</figcaption></motion.figure>}
      {voice && <ReceiverAudio asset={voice} kind="voice" />}
      {song && <ReceiverAudio asset={song} kind="song" />}
      {doodles.length > 0 && <div className="object-doodle"><DoodleArtwork strokes={doodles} /><span>something only your hand could make.</span></div>}
      {stickers.length > 0 && <div className={`object-stickers object-stickers-${inkColor}`} aria-label="Your added hand-drawn marks">{stickers.map((sticker) => <StickerMark key={sticker} id={sticker} />)}</div>}
      <footer className="receiver-ending">
        <h2>what should this become?</h2>
        {removeOpen ? <div className="remove-confirm" role="alert"><p>Remove this from your private cabinet? {sender} will not be told.</p><button type="button" onClick={onConfirmRemove}>remove it</button><button type="button" onClick={onCancelRemove}>leave it here</button></div> : <div className="ending-actions"><button type="button" onClick={onKeep}><MaterialIcon id="photo" /><span>keep</span></button><button type="button" onClick={onClose}><span className="ending-x" aria-hidden="true">×</span><span>close</span></button><button type="button" onClick={onRemove}><span className="ending-remove" aria-hidden="true" /><span>remove</span></button></div>}
      </footer>
    </>
  );
}

function Reveal(props: ReceiverObjectProps) {
  return <Page className="reveal-page"><ReceiverObject {...props} /></Page>;
}

function Cabinet({ items, removingId, onHome, onMake, onOpen, onRemove, onCancelRemove, onConfirmRemove }: { items: KeepsakeSnapshot[]; removingId: string | null; onHome: () => void; onMake: () => void; onOpen: (item: KeepsakeSnapshot) => void; onRemove: (item: KeepsakeSnapshot) => void; onCancelRemove: () => void; onConfirmRemove: (item: KeepsakeSnapshot) => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [page, setPage] = useState(0);
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleItems = items.slice(page * pageSize, (page + 1) * pageSize);
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);
  const returnToLetters = () => {
    setPage(0);
    headingRef.current?.focus();
  };
  return (
    <Page className="cabinet-page">
      <header><h1 ref={headingRef} tabIndex={-1}>things you kept.</h1></header>
      <div className="cabinet-field">
        {items.length ? visibleItems.map((item) => <motion.div key={item.id} className="cabinet-item cabinet-object" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTiming.enter, ease: motionEase.ui }}><button type="button" onClick={() => onOpen(item)} aria-label={`Open kept object from ${item.sender} for ${item.recipient}`}><CarrierIcon id={item.carrier} size="cabinet" /><span>from {item.sender}<small>for {item.recipient}</small></span></button>{removingId === item.id ? <div className="cabinet-remove" role="alert"><p>Remove it? {item.sender} will not be told.</p><button type="button" onClick={() => onConfirmRemove(item)}>remove</button><button type="button" onClick={onCancelRemove}>cancel</button></div> : <button className="cabinet-remove-link" type="button" onClick={() => onRemove(item)}>remove from here</button>}</motion.div>) : <div className="empty-cabinet"><p>nothing kept here yet.</p></div>}
      </div>
      {pageCount > 1 && <nav className="cabinet-pagination" aria-label="Kept letter pages"><button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}>previous</button><span aria-live="polite">{page + 1} of {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page === pageCount - 1}>next</button></nav>}
      <AppBottomNav lettersCurrent onHome={onHome} onMake={onMake} onLetters={returnToLetters} />
    </Page>
  );
}

function QuietExit({ title, body, action, onAction, onLeave }: { title: string; body: string; action: string; onAction: () => void; onLeave: () => void }) {
  return <Page className="quiet-exit-page"><div><h1>{title}</h1><p>{body}</p></div><button className="drawn-action" type="button" onClick={onAction}>{action} <Mark /></button><button className="quiet-link" type="button" onClick={onLeave}>leave</button></Page>;
}

function Removed({ onLeave, onRestore }: { onLeave: () => void; onRestore: () => void }) {
  return <Page className="removed-page"><div><h1>gone from your cabinet.</h1><p>No signal went back to {sender}.</p></div><button className="navy-action" type="button" onClick={onRestore}>restore this sample <Mark /></button><button className="navy-back" type="button" onClick={onLeave}>leave</button></Page>;
}

function TopLine({ onBack, label }: { onBack: () => void; label: string }) {
  return <div className="top-line"><button type="button" onClick={onBack}><Mark direction="left" /> {label}</button><span>warm &amp; fuzzies</span></div>;
}

function CarrierIcon({ id, size }: { id: CarrierId; size: "hero" | "thumb" | "guide" | "sealed" | "arrival" | "cabinet" }) {
  const source = id === "bottle" ? artwork.containers.bottleReady : id === "plane" ? artwork.containers.plane : artwork.firefly.filledA;
  return <span className={`carrier-icon carrier-icon-${id} carrier-icon-${size}`} role="img" aria-label={id === "firefly" ? "Firefly courier" : id}><img src={source} alt="" draggable={false} data-asset-slot={`carrier-${id}-${size}`} /></span>;
}

function MaterialIcon({ id }: { id: PieceId }) {
  return (
    <svg className={`material-icon material-icon-${id}`} viewBox="0 0 48 48" aria-hidden="true" data-asset-slot={`material-${id}`}>
      {id === "photo" && <><path d="M6 10c10-2 25-1 36 1l-2 29c-10 2-23 1-34-1z" /><path d="M9 34l10-11 7 8 7-6 7 11M31 17h.1" /></>}
      {id === "voice" && <path d="M5 26c3 0 3-9 6-9s3 17 6 17 3-25 6-25 3 31 6 31 3-22 6-22 3 14 8 14" />}
      {id === "song" && <><path d="M19 37c-7 1-11-2-10-6s6-6 12-4V10l19-4v26" /><path d="M39 28c-7-1-11 2-10 6 1 5 7 6 11 3" /></>}
      {id === "drawing" && <><path d="M9 38c8-22 15-31 24-28 11 4 4 25-5 30-10 6-20 0-18-9 2-8 15-8 27 2" /><path d="M35 8l5 1-2 5" /></>}
    </svg>
  );
}

function Waveform() {
  return <svg className="waveform" viewBox="0 0 128 40" aria-hidden="true"><path d="M3 22h8l5-10 7 20 8-27 8 31 8-20 7 10 8-17 8 25 8-28 8 31 7-18 8 8 7-14 7 9h9" /></svg>;
}

function PersonalMark() {
  return <svg className="personal-mark" viewBox="0 0 92 84" aria-hidden="true" data-asset-slot="personal-mark"><path d="M45 5c2 17 5 28 9 37 9-6 18-11 32-15-10 11-17 19-23 28 8 7 15 14 23 24-13-7-22-11-34-15-8 6-16 11-28 16 7-9 13-17 17-25C30 49 20 44 6 40c14-1 25 0 35 2 0-10 1-21 4-37z" /><path d="M57 13c2 6 4 10 8 14" /></svg>;
}
