// Implements the transcript-led maker, carrier, handoff, and receiver experience inside the protected mobile runtime.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { QRCodeSVG } from "qrcode.react";
import { createPortal } from "react-dom";
import { Carousel, KeyboardInput, KeyboardTextarea, MobileScroll, useKeyboard } from "./mobile";

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
type TextBlock = {
  id: string;
  words: string;
  crossedOut: CrossOut[];
  layout: LayerLayout;
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
};

const CECILIA = "/assets/illustrations/cecilia/";
const CABINET_KEY = "warm-fuzzies-cabinet-v1";
const PERSONAL_STAMP_KEY = "warm-fuzzies-personal-stamp-v1";
const LINK_MAX = 12_000;
const QR_MAX = 1_200;
const MAX_TEXT_BLOCKS = 12;
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
  ]);
}

function unpackTextBlocks(value: unknown): unknown {
  if (!Array.isArray(value)) return null;
  return value.map((block) => {
    if (!Array.isArray(block) || block.length !== 4) return null;
    const layout = block[3];
    return {
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
  ];
  return compressToEncodedURIComponent(JSON.stringify(compact));
}

function expandCompactSnapshot(value: unknown): unknown {
  if (!Array.isArray(value) || ![18, 19, 20].includes(value.length) || !Array.isArray(value[17]) || value[17].length !== layerIds.length) return null;
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
    textBlocks: value.length === 20 ? unpackTextBlocks(value[19]) : undefined,
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
  if (value.kind === "sample") return value.url === undefined;
  return typeof value.url === "string" && value.url.startsWith("blob:") && value.url.length < 2_048;
}

function isAudioAsset(value: unknown): value is AudioAsset | null {
  if (value === null) return true;
  return isRecord(value)
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
      || !isLayerLayout(block.layout)) return false;
    ids.add(block.id);
    totalLength += block.words.length;
    return totalLength <= 10_000;
  });
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
  return true;
}

function textBlocksFromSnapshot(snapshot: KeepsakeSnapshot): TextBlock[] {
  if (snapshot.textBlocks?.length) {
    return snapshot.textBlocks.map((block) => ({
      ...block,
      crossedOut: block.crossedOut.map((range) => ({ ...range })),
      layout: { ...block.layout },
    }));
  }
  if (!snapshot.words) return [];
  return [{
    id: "text-legacy",
    words: snapshot.words,
    crossedOut: snapshot.crossedOut.map((range) => ({ ...range })),
    layout: { ...snapshot.layouts.words },
  }];
}

function containsBlobMedia(snapshot: Pick<KeepsakeSnapshot, "capture" | "voice" | "song">) {
  return [snapshot.capture?.url, snapshot.voice?.url, snapshot.song?.url].some((url) => url?.startsWith("blob:"));
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
    description: "A little bottle bobs in. They pull the cork when they are ready.",
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
    description: "A folded plane lands quietly. One tap unfolds what is inside.",
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
  const [captureAsset, setCaptureAsset] = useState<CaptureAsset | null>(() => linkedSnapshot?.capture ?? (seededPreview ? { kind: "sample" } : null));
  const [voiceAsset, setVoiceAsset] = useState<AudioAsset | null>(() => linkedSnapshot?.voice ?? null);
  const [songAsset, setSongAsset] = useState<AudioAsset | null>(() => linkedSnapshot?.song ?? null);
  const [doodleStrokes, setDoodleStrokes] = useState<DoodleStroke[]>(() => linkedSnapshot?.doodles ?? []);
  const [stickers, setStickers] = useState<StickerId[]>(() => linkedSnapshot?.stickers ?? []);
  const [inkColor, setInkColor] = useState<InkColor>(() => linkedSnapshot?.inkColor ?? "navy");
  const [layerLayouts, setLayerLayouts] = useState<Record<LayerId, LayerLayout>>(() => linkedSnapshot?.layouts ?? defaultLayerLayouts);
  const [draftId, setDraftId] = useState(() => linkedSnapshot?.id ?? `wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`);
  const captureAssetRef = useRef<CaptureAsset | null>(null);
  const voiceAssetRef = useRef<AudioAsset | null>(null);
  const songAssetRef = useRef<AudioAsset | null>(null);
  const keyboard = useKeyboard();
  const reduceMotion = useReducedMotion();
  const carrier = carriers.find((item) => item.id === carrierId) ?? carriers[0];

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
    };
  }, [captureAsset, carrierId, doodleStrokes, draftId, envelope, inkColor, layerLayouts, paper, pieces, recipient, seal, sealWeight, songAsset, stickers, textBlocks, voiceAsset]);

  const applySnapshot = useCallback((snapshot: KeepsakeSnapshot) => {
    const next = cloneSnapshot(snapshot);
    setActiveSnapshot(next); setDraftId(next.id); setRecipient(next.recipient); setTextBlocks(textBlocksFromSnapshot(next)); setPaper(next.paper); setCarrierId(next.carrier); setEnvelope(next.envelope); setSeal(next.seal); setSealWeight(next.sealWeight ?? "bold"); setPieces(next.pieces); setCaptureAsset(next.capture); setVoiceAsset(next.voice); setSongAsset(next.song); setDoodleStrokes(next.doodles); setStickers(next.stickers); setInkColor(next.inkColor); setLayerLayouts(next.layouts); captureAssetRef.current = next.capture; voiceAssetRef.current = next.voice; songAssetRef.current = next.song;
  }, []);

  const replaceCapture = useCallback((next: CaptureAsset | null) => {
    const previous = captureAssetRef.current;
    if (previous?.url?.startsWith("blob:")) URL.revokeObjectURL(previous.url);
    captureAssetRef.current = next;
    setCaptureAsset(next);
  }, []);

  const replaceAudio = useCallback((kind: "voice" | "song", next: AudioAsset | null) => {
    const assetRef = kind === "voice" ? voiceAssetRef : songAssetRef;
    const previous = assetRef.current;
    if (previous?.url.startsWith("blob:")) URL.revokeObjectURL(previous.url);
    assetRef.current = next;
    if (kind === "voice") setVoiceAsset(next);
    else setSongAsset(next);
  }, []);

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

  useEffect(() => () => {
    const current = captureAssetRef.current;
    if (current?.url?.startsWith("blob:")) URL.revokeObjectURL(current.url);
    [voiceAssetRef.current, songAssetRef.current].forEach((asset) => {
      if (asset?.url.startsWith("blob:")) URL.revokeObjectURL(asset.url);
    });
  }, []);

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
    replaceCapture(null);
    replaceAudio("voice", null);
    replaceAudio("song", null);
    setDoodleStrokes([]);
    setStickers([]);
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
    if (isRehearsalRoute) {
      setCabinet([cloneSnapshot(snapshot)]);
      return true;
    }
    if (containsBlobMedia(snapshot)) return false;
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

  const canPreview = recipient.trim() !== "" && Boolean(textBlocks.some((block) => block.words.trim()) || captureAsset || pieces.length || doodleStrokes.length || stickers.length);
  const navyPhase = ["removed"].includes(phase);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScroll
        className={`app-screen keepsake-app phase-${phase} ${navyPhase ? "phase-navy" : "phase-paper"}`}
      >
        <main className="keepsake-shell" aria-label="Friendship keepsake exploratory prototype">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "home" && (
              <Home key="home" onEnter={() => go("menu")} />
            )}
            {phase === "menu" && <Menu key="menu" reduceMotion={Boolean(reduceMotion)} createOnly={isRehearsalCreate} onCreate={resetDraft} onLetters={() => go("cabinet")} />}
            {phase === "recipient" && <RecipientStart key="recipient" recipient={recipient} onRecipient={setRecipient} onBack={returnToMenu} onContinue={(name) => { if (isRehearsalCreate) applySnapshot({ ...cloneSnapshot(rehearsalArtifact), recipient: name }); else setRecipient(name); go("studio"); }} />}
            {phase === "carrier" && (
              <CarrierPicker key="carrier" selected={carrierId} onSelect={setCarrierId} onCycle={cycleCarrier} onKeyDown={handleCarrierKeys} onBack={() => go("envelope")} onNext={() => { setActiveSnapshot(currentSnapshot); go("preview"); }} />
            )}
            {phase === "studio" && (
              <Studio key="studio" mode={studioMode} capture={captureAsset} voice={voiceAsset} song={songAsset} recipient={recipient} textBlocks={textBlocks} paper={paper} pieces={pieces} doodles={doodleStrokes} stickers={stickers} inkColor={inkColor} cuesOpen={cuesOpen} layouts={layerLayouts} canPreview={canPreview} onMode={setStudioMode} onCapture={replaceCapture} onVoice={(asset) => replaceAudio("voice", asset)} onSong={(asset) => replaceAudio("song", asset)} onRecipient={setRecipient} onTextBlocks={setTextBlocks} onPaper={setPaper} onDoodles={setDoodleStrokes} onStickers={setStickers} onInkColor={setInkColor} onTogglePiece={togglePiece} onToggleCues={() => setCuesOpen((current) => !current)} onLayout={updateLayer} onBack={returnToMenu} onPreview={() => go("envelope")} />
            )}
            {phase === "envelope" && <EnvelopeStudio key="envelope" snapshot={currentSnapshot} onBack={() => go("studio")} onSeal={setSeal} seal={seal} sealWeight={sealWeight} onSealWeight={setSealWeight} savedSeal={savedSeal} onSaveSeal={savePersonalStamp} onNext={() => go("carrier")} />}
            {phase === "preview" && (
              <Preview key="preview" snapshot={activeSnapshot ?? currentSnapshot} onEdit={() => go("envelope")} onChangeCarrier={() => go("carrier")} onGive={() => go("handoff")} />
            )}
            {phase === "handoff" && (
              <Handoff key="handoff" snapshot={activeSnapshot ?? currentSnapshot} recipient={recipient} carrier={carrier} copied={copied} failed={shareFailed} reduceMotion={Boolean(reduceMotion)} demoReceiver={isRehearsalCreate} onBack={() => go("preview")} onCopy={() => { const snapshot = activeSnapshot ?? currentSnapshot; if (!isSafeSnapshot(snapshot) || containsBlobMedia(snapshot)) { setShareFailed(true); return; } const payload = encodeSnapshot(snapshot); if (payload.length > LINK_MAX) { setShareFailed(true); return; } const receiverPath = isRehearsalCreate ? "/demo/receive" : `/for/${snapshot.id}`; const url = `${window.location.origin}${receiverPath}#v3.${payload}`; setShareFailed(false); setCopied(true); if (navigator.clipboard) void navigator.clipboard.writeText(url).catch(() => undefined); }} onFail={() => { setCopied(false); setShareFailed(true); }} onFinish={() => go("sent")} />
            )}
            {phase === "sent" && (
              <Sent key="sent" recipient={recipient} carrier={carrier} reduceMotion={Boolean(reduceMotion)} onAgain={resetDraft} onLeave={returnToMenu} />
            )}
            {phase === "arrival" && (
              <Arrival key="arrival" recipient={recipient} carrier={carrier} reduceMotion={Boolean(reduceMotion)} demo={isDemoReceiver} onOpen={() => go("opening")} onDefer={() => go("deferred")} onUnavailable={() => go("unavailable")} />
            )}
            {phase === "deferred" && (
              <QuietExit key="deferred" title="left for another time." body={`${sender} is not told. There is no reminder.`} action="return to it" onAction={() => go("arrival")} onLeave={() => go("home")} />
            )}
            {phase === "unavailable" && (
              <QuietExit key="unavailable" title="this one cannot be opened." body="No private content has been shown. The link may have expired or reached the wrong person." action="back to the sample" onAction={() => go("arrival")} onLeave={() => go("home")} />
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
    <motion.section className={`experience-page ${className}`} initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={handsOffToOpening ? { opacity: 1, transform: "translateY(0)" } : { opacity: 0, transform: "translateY(-5px)" }} transition={{ duration: handsOffToOpening ? .08 : 0.2, ease: [0.23, 1, 0.32, 1] }}>
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

function Home({ onEnter }: { onEnter: () => void }) {
  return (
    <Page className="home-page">
      <div className="home-copy">
        <h1 className="working-wordmark"><span>warm &amp;</span><span>fuzzies</span></h1>
      </div>
      <div className="home-bee-mark" aria-hidden="true">
        <motion.img
          src={`${CECILIA}firefly-brand-mark.png`}
          alt=""
          draggable={false}
          data-asset-slot="home-bee"
          initial={{ opacity: 0, y: -8, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.08, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <p className="home-question">something good<br />on your mind?</p>
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
      <header><span>warm &amp; fuzzies</span></header>
      <motion.div className="menu-firefly" initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(-210px, 170px, 0) rotate(-18deg) scale(.72)" }} animate={flyIn} transition={{ opacity: { duration: reduceMotion ? .01 : .5, ease: [0.23, 1, 0.32, 1] }, transform: { duration: reduceMotion ? .01 : 3.6, times: reduceMotion ? undefined : [0, .62, .84, 1], ease: [0.77, 0, 0.175, 1] } }} aria-hidden="true">
        <img className="menu-firefly-frame menu-firefly-frame-one" src={`${CECILIA}firefly-filled-f1.png`} alt="" draggable={false} />
        {!reduceMotion && <motion.img className="menu-firefly-frame menu-firefly-frame-two" src={`${CECILIA}firefly-filled-f2.png`} alt="" draggable={false} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0] }} transition={{ duration: 3.6, times: [0, .12, .24, .36, .48, .6, .72, .84, 1], ease: "linear" }} />}
      </motion.div>
      <div className="menu-actions">
        <motion.button className="drawn-action" type="button" onClick={onCreate} initial={reduceMotion ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .72, duration: .26 }}>create something <Mark /></motion.button>
        {!createOnly && <motion.button className="drawn-action" type="button" onClick={onLetters} initial={reduceMotion ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .88, duration: .26 }}>look in your box <Mark /></motion.button>}
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
      <header className="carrier-heading"><p>pick how it arrives.</p><span>each one opens a little differently.</span></header>
      <div className="carrier-stage">
        <button className="stage-arrow stage-arrow-left" type="button" aria-label="Previous carrier" disabled={locked} onClick={() => onCycle(-1)}><Mark direction="left" /></button>
        <motion.div key={selected} className="hero-carrier" initial={{ opacity: 0, transform: "translateY(10px) rotate(-2deg) scale(0.97)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(0deg) scale(1)" }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
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

function Studio({ mode, locked = false, capture, voice, song, recipient, textBlocks, paper, pieces, doodles, stickers, inkColor, cuesOpen, layouts, canPreview, onMode, onCapture, onVoice, onSong, onRecipient, onTextBlocks, onPaper, onDoodles, onStickers, onInkColor, onTogglePiece, onToggleCues, onLayout, onBack, onPreview }: { mode: StudioMode; locked?: boolean; capture: CaptureAsset | null; voice: AudioAsset | null; song: AudioAsset | null; recipient: string; textBlocks: TextBlock[]; paper: PaperId; pieces: PieceId[]; doodles: DoodleStroke[]; stickers: StickerId[]; inkColor: InkColor; cuesOpen: boolean; layouts: Record<LayerId, LayerLayout>; canPreview: boolean; onMode: (mode: StudioMode) => void; onCapture: (capture: CaptureAsset | null) => void; onVoice: (asset: AudioAsset | null) => void; onSong: (asset: AudioAsset | null) => void; onRecipient: (value: string) => void; onTextBlocks: (value: TextBlock[]) => void; onPaper: (value: PaperId) => void; onDoodles: (strokes: DoodleStroke[]) => void; onStickers: (stickers: StickerId[]) => void; onInkColor: (color: InkColor) => void; onTogglePiece: (piece: PieceId) => void; onToggleCues: () => void; onLayout: (id: LayerId, layout: LayerLayout) => void; onBack: () => void; onPreview: () => void }) {
  const keyboard = useKeyboard();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingRecipient, setEditingRecipient] = useState(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [voiceRecorderOpen, setVoiceRecorderOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState("say the thing you usually leave unsaid");
  const [showGestureHint, setShowGestureHint] = useState(false);
  const editingText = editingTextId !== null;

  useEffect(() => {
    if (mode !== "compose") return;
    setShowGestureHint(true);
    const timer = window.setTimeout(() => setShowGestureHint(false), 2600);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const finishText = () => {
    keyboard.hide();
    if (editingTextId) onTextBlocks(textBlocks.filter((block) => block.id !== editingTextId || block.words.trim()));
    setEditingTextId(null);
    setSelectedLayer(null);
  };

  const updateTextBlock = (id: string, patch: Partial<Omit<TextBlock, "id">>) => {
    onTextBlocks(textBlocks.map((block) => block.id === id ? { ...block, ...patch } : block));
  };

  const createTextBlock = (layout?: LayerLayout) => {
    if (textBlocks.length >= MAX_TEXT_BLOCKS) return;
    const index = textBlocks.length;
    const id = `text-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const nextLayout = layout ?? {
      x: index === 0 ? 0 : index % 2 === 0 ? 48 : -48,
      y: index === 0 ? 0 : Math.min(220, 64 + index * 58),
      rotation: index % 2 === 0 ? -1.5 : 1.5,
      scale: 1,
    };
    onTextBlocks([...textBlocks, { id, words: "", crossedOut: [], layout: nextLayout }]);
    setDrawingActive(false);
    setSelectedLayer(id);
    setEditingTextId(id);
  };

  const editTextBlock = (id: string) => {
    setDrawingActive(false);
    setSelectedLayer(id);
    setEditingTextId(id);
  };

  const removeLayer = (id: string) => {
    if (textBlocks.some((block) => block.id === id)) onTextBlocks(textBlocks.filter((block) => block.id !== id));
    else if (id === "photo") onCapture(null);
    else if (id === "burst" || id === "ribbon" || id === "stamp") onStickers(stickers.filter((sticker) => sticker !== id));
    else {
      if (id === "voice") onVoice(null);
      if (id === "song") onSong(null);
      if (pieces.includes(id as PieceId)) onTogglePiece(id as PieceId);
    }
    if (editingTextId === id) setEditingTextId(null);
    setSelectedLayer(null);
  };

  const keepVoice = (asset: AudioAsset) => {
    onVoice(asset);
    if (!pieces.includes("voice")) onTogglePiece("voice");
    setVoiceRecorderOpen(false);
    setSelectedLayer(null);
  };

  const keepSong = (file: File) => {
    onSong({ url: URL.createObjectURL(file), name: file.name.replace(/\.[^.]+$/, "") || "chosen song" });
    if (!pieces.includes("song")) onTogglePiece("song");
    setSelectedLayer(null);
  };

  const keepDoodle = (stroke: DoodleStroke) => {
    onDoodles([...doodles, stroke]);
    if (!pieces.includes("drawing")) onTogglePiece("drawing");
  };

  const addSticker = (sticker: StickerId) => {
    if (!stickers.includes(sticker)) onStickers([...stickers, sticker]);
    setSelectedLayer(sticker);
  };

  const undoDoodle = () => {
    const next = doodles.slice(0, -1);
    onDoodles(next);
    if (next.length === 0 && pieces.includes("drawing")) onTogglePiece("drawing");
  };

  return (
    <motion.section className={`experience-page studio-page studio-${mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
      <AnimatePresence mode="wait" initial={false}>
        {mode === "capture" ? (
          <CaptureStage
            key="capture"
            capture={capture}
            recipient={recipient}
            onBack={() => onMode("compose")}
            onKeep={() => onMode("compose")}
            onCaptured={(asset) => { onCapture(asset); setSelectedLayer(null); onMode("compose"); }}
          />
        ) : (
          <StoryComposer
            key="compose"
            locked={locked}
            capture={capture}
            voice={voice}
            song={song}
            recipient={recipient}
            textBlocks={textBlocks}
            paper={paper}
            pieces={pieces}
            doodles={doodles}
            stickers={stickers}
            inkColor={inkColor}
            layouts={layouts}
            selectedLayer={selectedLayer}
            editingTextId={editingTextId}
            editingRecipient={editingRecipient}
            drawingActive={drawingActive}
            voiceRecorderOpen={voiceRecorderOpen}
            activePrompt={activePrompt}
            cuesOpen={cuesOpen}
            showGestureHint={showGestureHint}
            canPreview={canPreview}
            onSelectLayer={setSelectedLayer}
            onLayout={onLayout}
            onRemoveLayer={removeLayer}
            onTextLayout={(id, layout) => updateTextBlock(id, { layout })}
            onEditText={editTextBlock}
            onCreateText={createTextBlock}
            onTextWords={(id, words) => updateTextBlock(id, { words })}
            onTextCrossedOut={(id, crossedOut) => updateTextBlock(id, { crossedOut })}
            onPaper={onPaper}
            onFinishText={finishText}
            onToggleCues={onToggleCues}
            onPrompt={setActivePrompt}
            onEditRecipient={() => setEditingRecipient(true)}
            onRecipient={onRecipient}
            onFinishRecipient={() => { keyboard.hide(); setEditingRecipient(false); }}
            onStartVoice={() => { keyboard.hide(); setDrawingActive(false); setEditingTextId(null); setVoiceRecorderOpen(true); }}
            onCancelVoice={() => setVoiceRecorderOpen(false)}
            onVoice={keepVoice}
            onSongFile={keepSong}
            onDraw={() => { keyboard.hide(); setEditingTextId(null); setSelectedLayer(null); setDrawingActive(true); }}
            onDoneDrawing={() => setDrawingActive(false)}
            onUndoDoodle={undoDoodle}
            onDoodle={keepDoodle}
            onAddSticker={addSticker}
            onInkColor={onInkColor}
            onCamera={() => { keyboard.hide(); setDrawingActive(false); onMode("capture"); }}
            onBack={onBack}
            onPreview={onPreview}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
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
    <motion.div className={`capture-stage capture-${status}`} data-recording={recording ? "true" : "false"} initial={{ opacity: 0, transform: "scale(1.015)" }} animate={{ opacity: 1, transform: "scale(1)" }} exit={{ opacity: 0, transform: "scale(0.99)" }} transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }} data-scroll-drag="ignore">
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
      <input ref={fileRef} className="capture-file-input" type="file" accept="image/*,video/*" onChange={handleFile} tabIndex={-1} />
    </motion.div>
  );
}

type StoryComposerProps = {
  locked?: boolean;
  capture: CaptureAsset | null;
  voice: AudioAsset | null;
  song: AudioAsset | null;
  recipient: string;
  textBlocks: TextBlock[];
  paper: PaperId;
  pieces: PieceId[];
  doodles: DoodleStroke[];
  stickers: StickerId[];
  inkColor: InkColor;
  layouts: Record<LayerId, LayerLayout>;
  selectedLayer: string | null;
  editingTextId: string | null;
  editingRecipient: boolean;
  drawingActive: boolean;
  voiceRecorderOpen: boolean;
  activePrompt: string;
  cuesOpen: boolean;
  showGestureHint: boolean;
  canPreview: boolean;
  onSelectLayer: (id: string | null) => void;
  onLayout: (id: LayerId, layout: LayerLayout) => void;
  onRemoveLayer: (id: string) => void;
  onTextLayout: (id: string, layout: LayerLayout) => void;
  onEditText: (id: string) => void;
  onCreateText: (layout?: LayerLayout) => void;
  onTextWords: (id: string, value: string) => void;
  onTextCrossedOut: (id: string, value: CrossOut[]) => void;
  onPaper: (value: PaperId) => void;
  onFinishText: () => void;
  onToggleCues: () => void;
  onPrompt: (prompt: string) => void;
  onEditRecipient: () => void;
  onRecipient: (value: string) => void;
  onFinishRecipient: () => void;
  onStartVoice: () => void;
  onCancelVoice: () => void;
  onVoice: (asset: AudioAsset) => void;
  onSongFile: (file: File) => void;
  onDraw: () => void;
  onDoneDrawing: () => void;
  onUndoDoodle: () => void;
  onDoodle: (stroke: DoodleStroke) => void;
  onAddSticker: (sticker: StickerId) => void;
  onInkColor: (color: InkColor) => void;
  onCamera: () => void;
  onBack: () => void;
  onPreview: () => void;
};

function StoryComposer({ locked = false, capture, voice, song, recipient, textBlocks, paper, pieces, doodles, stickers, inkColor, layouts, selectedLayer, editingTextId, editingRecipient, drawingActive, voiceRecorderOpen, activePrompt, cuesOpen, showGestureHint, canPreview, onSelectLayer, onLayout, onRemoveLayer, onTextLayout, onEditText, onCreateText, onTextWords, onTextCrossedOut, onPaper, onFinishText, onToggleCues, onPrompt, onEditRecipient, onRecipient, onFinishRecipient, onStartVoice, onCancelVoice, onVoice, onSongFile, onDraw, onDoneDrawing, onUndoDoodle, onDoodle, onAddSticker, onInkColor, onCamera, onBack, onPreview }: StoryComposerProps) {
  const editingText = editingTextId !== null;
  const blankPaperPointer = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  useEffect(() => {
    const screen = document.querySelector<HTMLElement>("[data-phone-screen]");
    screen?.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => screen?.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const startWritingOnPaper = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (locked || drawingActive || editingText) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, audio, video, [role='group']")) return;
    blankPaperPointer.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const finishWritingOnPaper = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = blankPaperPointer.current;
    blankPaperPointer.current = null;
    if (!start || start.pointerId !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-bounds.width / 2 + 30, Math.min(bounds.width / 2 - 30, event.clientX - bounds.left - bounds.width / 2));
    const y = Math.max(-bounds.height / 2 + 50, Math.min(bounds.height / 2 - 54, event.clientY - bounds.top - bounds.height / 2));
    onCreateText({ x, y, rotation: textBlocks.length % 2 === 0 ? -1.5 : 1.5, scale: 1 });
  };

  return (
    <motion.div className={`story-composer story-paper-first ${drawingActive ? "is-drawing" : ""} ${editingText ? "is-editing-text" : ""}`} data-ink={inkColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} data-scroll-drag="ignore">
      <div className="story-canvas" aria-label="Full-screen paper keepsake canvas">
        <header className="story-topbar">
          <button type="button" aria-label="Leave the message maker" onClick={onBack}><CloseMark /></button>
          {editingRecipient ? <div className="recipient-editor"><span>for</span><KeyboardInput autoFocus aria-label="Who is this for?" value={recipient} placeholder="someone" autoComplete="off" onChange={(event) => onRecipient(event.target.value)} onBlur={onFinishRecipient} /><button type="button" onClick={onFinishRecipient}>done</button></div> : <button className="story-recipient" type="button" disabled={locked} onClick={onEditRecipient}>for {recipient || "someone"}</button>}
          <button className="story-done" type="button" disabled={!canPreview} aria-label="Next: fold and decorate the envelope" onClick={onPreview}>next <Mark /></button>
        </header>

        <motion.div className={`story-paper-sheet authored-paper paper-${paper}`} initial={{ opacity: 0, transform: "translate3d(0, 10px, 0) scale(.99)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }} transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }} onPointerDown={startWritingOnPaper} onPointerUp={finishWritingOnPaper} onPointerCancel={() => { blankPaperPointer.current = null; }}>
          {paper === "ruled" && <PaperRuling />}

          {drawingActive ? <DoodleSurface strokes={doodles} onStroke={onDoodle} /> : doodles.length > 0 ? <DoodleArtwork strokes={doodles} className="story-doodle-artwork" /> : null}

          <AnimatePresence>
            {capture && <CanvasLayer key="photo" id="photo" locked={locked} label={capture.kind === "video" ? "video" : "photo"} layout={layouts.photo} selected={selectedLayer === "photo"} resizable onSelect={onSelectLayer} onLayout={(_, layout) => onLayout("photo", layout)} onRemove={onRemoveLayer}><div className="story-photo-visual"><span className="paper-tape" aria-hidden="true" /><CapturedMedia capture={capture} className="story-paper-media" /></div></CanvasLayer>}
            {textBlocks.map((block, index) => {
              const isEditing = editingTextId === block.id;
              if (!block.words.trim() && !isEditing) return null;
              const label = `text box ${index + 1}`;
              return <CanvasLayer key={block.id} id={block.id} locked={locked} className="story-layer-text" dataTextBlockId={block.id} label={label} layout={block.layout} selected={selectedLayer === block.id} editing={isEditing} resizable onSelect={onSelectLayer} onLayout={onTextLayout} onRemove={onRemoveLayer} onEdit={() => onEditText(block.id)}>{isEditing ? <RichHandwritingEditor label={`Write directly on the paper in ${label}. Backspace crosses out text; use undo cross-out to restore it.`} value={block.words} crossedOut={block.crossedOut} placeholder={activePrompt} onChange={(value) => onTextWords(block.id, value)} onCrossedOut={(value) => onTextCrossedOut(block.id, value)} /> : <RichWords value={block.words} crossedOut={block.crossedOut} className="story-words-visual" />}</CanvasLayer>;
            })}
            {voice && pieces.includes("voice") && <CanvasLayer key="voice" id="voice" locked={locked} label="voice note" layout={layouts.voice} selected={selectedLayer === "voice"} onSelect={onSelectLayer} onLayout={(_, layout) => onLayout("voice", layout)} onRemove={onRemoveLayer}><AudioPaperPiece asset={voice} kind="voice" /></CanvasLayer>}
            {song && pieces.includes("song") && <CanvasLayer key="song" id="song" locked={locked} label="song" layout={layouts.song} selected={selectedLayer === "song"} onSelect={onSelectLayer} onLayout={(_, layout) => onLayout("song", layout)} onRemove={onRemoveLayer}><AudioPaperPiece asset={song} kind="song" /></CanvasLayer>}
            {stickers.map((sticker) => <CanvasLayer key={sticker} id={sticker} locked={locked} label={`${sticker} mark`} layout={layouts[sticker]} selected={selectedLayer === sticker} onSelect={onSelectLayer} onLayout={(_, layout) => onLayout(sticker, layout)} onRemove={onRemoveLayer}><StickerMark id={sticker} /></CanvasLayer>)}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>{voiceRecorderOpen && <VoiceRecorder onCancel={onCancelVoice} onRecorded={onVoice} />}</AnimatePresence>

        <p className="story-mode-status" aria-live="polite">{drawingActive ? `doodling · ${doodles.length} ${doodles.length === 1 ? "stroke" : "strokes"}` : editingText ? "writing directly on the paper" : ""}</p>
        <AnimatePresence>{showGestureHint && !editingText && !drawingActive && <motion.p className="story-gesture-tip" initial={{ opacity: 0, transform: "translateY(5px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>move it anywhere. corners turn and resize.</motion.p>}</AnimatePresence>

        {!locked && <StoryToolRail hasWords={textBlocks.some((block) => block.words.trim())} canAddText={textBlocks.length < MAX_TEXT_BLOCKS} paper={paper} capture={capture} voice={voice} song={song} pieces={pieces} stickers={stickers} inkColor={inkColor} drawingActive={drawingActive} editingText={editingText} cuesOpen={cuesOpen} activePrompt={activePrompt} canUndoDoodle={doodles.length > 0} onText={() => onCreateText()} onFinishText={onFinishText} onToggleCues={onToggleCues} onPrompt={onPrompt} onPaper={onPaper} onDraw={onDraw} onDoneDrawing={onDoneDrawing} onUndoDoodle={onUndoDoodle} onCamera={onCamera} onVoice={onStartVoice} onSongFile={onSongFile} onAddSticker={onAddSticker} onInkColor={onInkColor} />}
      </div>
    </motion.div>
  );
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
  const textBlocks = textBlocksFromSnapshot(snapshot);
  return <article className={`authored-paper story-paper-sheet paper-${snapshot.paper} ${className}`} data-ink={snapshot.inkColor} aria-label={`A keepsake for ${snapshot.recipient}`}>
    {snapshot.paper === "ruled" && <PaperRuling />}
    {snapshot.capture && <div className="story-layer story-layer-photo authored-photo" style={{ transform: `translate(${snapshot.layouts.photo.x}px, ${snapshot.layouts.photo.y}px)` }}><div className="story-layer-paper" style={{ transform: `rotate(${snapshot.layouts.photo.rotation}deg) scale(${snapshot.layouts.photo.scale})` }}><div className="story-photo-visual"><span className="paper-tape" aria-hidden="true" /><CapturedMedia capture={snapshot.capture} interactive={receiver} className="story-paper-media" /></div></div></div>}
    {textBlocks.map((block) => <div key={block.id} className="story-layer story-layer-text authored-words" data-text-block-id={block.id} data-layout={`${block.layout.x},${block.layout.y},${block.layout.rotation},${block.layout.scale}`} style={{ transform: `translate(${block.layout.x}px, ${block.layout.y}px)` }}><div className="story-layer-paper" style={{ transform: `rotate(${block.layout.rotation}deg) scale(${block.layout.scale})` }}><RichWords value={block.words} crossedOut={block.crossedOut} className="story-words-visual" /></div></div>)}
    {snapshot.doodles.length > 0 && <DoodleArtwork strokes={snapshot.doodles} className="story-doodle-artwork" />}
    {snapshot.voice && snapshot.pieces.includes("voice") && <div className="story-layer story-layer-voice authored-voice" style={{ transform: `translate(${snapshot.layouts.voice.x}px, ${snapshot.layouts.voice.y}px) rotate(${snapshot.layouts.voice.rotation}deg) scale(${snapshot.layouts.voice.scale})` }}><AudioPaperPiece asset={snapshot.voice} kind="voice" /></div>}
    {snapshot.song && snapshot.pieces.includes("song") && <div className="story-layer story-layer-song authored-song" style={{ transform: `translate(${snapshot.layouts.song.x}px, ${snapshot.layouts.song.y}px) rotate(${snapshot.layouts.song.rotation}deg) scale(${snapshot.layouts.song.scale})` }}><AudioPaperPiece asset={snapshot.song} kind="song" /></div>}
    {snapshot.stickers.map((sticker) => <div key={sticker} className={`story-layer story-layer-${sticker} authored-sticker`} style={{ transform: `translate(${snapshot.layouts[sticker].x}px, ${snapshot.layouts[sticker].y}px) rotate(${snapshot.layouts[sticker].rotation}deg) scale(${snapshot.layouts[sticker].scale})` }}><StickerMark id={sticker} /></div>)}
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

function EnvelopeStudio({ snapshot, seal, sealWeight, savedSeal, locked = false, onSeal, onSealWeight, onSaveSeal, onBack, onNext }: { snapshot: KeepsakeSnapshot; seal: DoodleStroke[]; sealWeight: SealWeight; savedSeal: PersonalStamp | null; locked?: boolean; onSeal: (value: DoodleStroke[]) => void; onSealWeight: (weight: SealWeight) => void; onSaveSeal: (value: DoodleStroke[], weight: SealWeight) => void; onBack: () => void; onNext: () => void }) {
  const reduced = useReducedMotion();
  const [folded, setFolded] = useState(Boolean(reduced));
  const [sealOpen, setSealOpen] = useState(false);
  const canReuseStamp = seal.length === 0 && Boolean(savedSeal?.strokes.length);
  useEffect(() => { if (reduced) return; const timer = window.setTimeout(() => setFolded(true), 1480); return () => window.clearTimeout(timer); }, [reduced]);
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
      <AnimatePresence>
        {!folded && (
          <motion.div className="envelope-fold-preview" exit={{ opacity: 0 }} transition={{ duration: .18 }}>
            <motion.div className="folding-paper-shell" initial={reduced ? false : { transform: "translateY(18px) scale(.88) rotate(0deg)" }} animate={reduced ? { transform: "translateY(70px) scale(.34) rotate(-3deg)" } : { transform: ["translateY(18px) scale(.88) rotate(0deg)", "translateY(18px) scale(.88) rotate(0deg)", "translateY(70px) scale(.34) rotate(-3deg)"], opacity: [1, 1, .72] }} transition={{ duration: 1.36, times: [0, .65, 1], ease: [0.77, 0, 0.175, 1] }}>
              <AuthoredPaper snapshot={snapshot} className="fold-paper-base" />
              <motion.div className="fold-leaf fold-leaf-left" initial={false} animate={reduced ? { transform: "rotateY(0deg)" } : { transform: "rotateY(178deg)" }} transition={{ delay: .18, duration: .58, ease: [0.77, 0, 0.175, 1] }} aria-hidden="true"><AuthoredPaper snapshot={snapshot} /></motion.div>
              <motion.div className="fold-leaf fold-leaf-right" initial={false} animate={reduced ? { transform: "rotateY(0deg)" } : { transform: "rotateY(-178deg)" }} transition={{ delay: .24, duration: .58, ease: [0.77, 0, 0.175, 1] }} aria-hidden="true"><AuthoredPaper snapshot={snapshot} /></motion.div>
              <motion.div className="fold-leaf fold-leaf-bottom" initial={false} animate={reduced ? { transform: "rotateX(0deg)" } : { transform: "rotateX(-178deg)" }} transition={{ delay: .76, duration: .5, ease: [0.77, 0, 0.175, 1] }} aria-hidden="true"><AuthoredPaper snapshot={snapshot} /></motion.div>
            </motion.div>
            <p>your page folds with every mark still in place.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {folded && (
          <motion.section className="envelope-workbench" aria-label="Add a personal stamp to the envelope" initial={{ opacity: 0, transform: "translateY(14px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ duration: .32, ease: [0.23, 1, .32, 1] }}>
            <header><h1>leave your mark.</h1><p>The envelope stays simple. The stamp is yours.</p></header>
            <div className="envelope-canvas">
              <img className="envelope-canvas-source" src={`${CECILIA}envelope-mail-02.png`} alt="" draggable={false} />
              <button className={`seal-stamp seal-weight-${sealWeight} ${seal.length ? "has-seal" : ""}`} data-seal-weight={sealWeight} type="button" disabled={locked} onClick={() => setSealOpen(true)} aria-label={seal.length ? "Edit your personal stamp" : "Draw your personal stamp"}>{seal.length ? <DoodleArtwork strokes={seal} className="seal-artwork" /> : <span>draw<br />your stamp</span>}</button>
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

function CanvasLayer({ id, className = "", dataTextBlockId, label, layout, selected, editing = false, resizable = false, locked = false, children, onSelect, onLayout, onRemove, onEdit }: { id: string; className?: string; dataTextBlockId?: string; label: string; layout: LayerLayout; selected: boolean; editing?: boolean; resizable?: boolean; locked?: boolean; children: ReactNode; onSelect: (id: string | null) => void; onLayout: (id: string, layout: LayerLayout) => void; onRemove: (id: string) => void; onEdit?: () => void }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef({ pointerId: -1, startX: 0, startY: 0, startLayout: layout, moved: false });
  const rotationRef = useRef({ pointerId: -1, startAngle: 0, startRotation: 0, moved: false });
  const resizeRef = useRef({ pointerId: -1, startDistance: 1, startScale: 1, moved: false });
  const clampPosition = (x: number, y: number) => ({
    x: Math.max(-(layerRef.current?.parentElement?.clientWidth ?? 384) / 2 + 24, Math.min((layerRef.current?.parentElement?.clientWidth ?? 384) / 2 - 24, x)),
    y: Math.max(-(layerRef.current?.parentElement?.clientHeight ?? 760) / 2 + 42, Math.min((layerRef.current?.parentElement?.clientHeight ?? 760) / 2 - 54, y)),
  });
  const clampScale = (scale: number) => Math.max(0.52, Math.min(id === "photo" ? 1.75 : 1.9, scale));
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
    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;
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
    <motion.div ref={layerRef} className={`story-layer story-layer-${id} ${className} ${selected ? "is-selected" : ""} ${editing ? "is-editing" : ""}`} data-text-block-id={dataTextBlockId} data-layout={`${layout.x},${layout.y},${layout.rotation},${layout.scale}`} role="group" aria-label={locked || editing ? label : `${label}. Drag to move; use the corner handles to rotate or resize.`} tabIndex={locked || editing ? -1 : 0} style={{ x: layout.x, y: layout.y }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} onPointerDown={startMove} onPointerMove={move} onPointerUp={finishMove} onPointerCancel={finishMove} onClick={() => { if (!locked && !editing) onSelect(id); }} onDoubleClick={locked ? undefined : onEdit} onKeyDown={(event) => {
      if (locked || editing) return;
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

function StoryToolRail({ hasWords, canAddText, paper, capture, voice, song, pieces, stickers, inkColor, drawingActive, editingText, cuesOpen, activePrompt, canUndoDoodle, onText, onFinishText, onToggleCues, onPrompt, onPaper, onDraw, onDoneDrawing, onUndoDoodle, onCamera, onVoice, onSongFile, onAddSticker, onInkColor }: { hasWords: boolean; canAddText: boolean; paper: PaperId; capture: CaptureAsset | null; voice: AudioAsset | null; song: AudioAsset | null; pieces: PieceId[]; stickers: StickerId[]; inkColor: InkColor; drawingActive: boolean; editingText: boolean; cuesOpen: boolean; activePrompt: string; canUndoDoodle: boolean; onText: () => void; onFinishText: () => void; onToggleCues: () => void; onPrompt: (prompt: string) => void; onPaper: (paper: PaperId) => void; onDraw: () => void; onDoneDrawing: () => void; onUndoDoodle: () => void; onCamera: () => void; onVoice: () => void; onSongFile: (file: File) => void; onAddSticker: (sticker: StickerId) => void; onInkColor: (color: InkColor) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  const songInputRef = useRef<HTMLInputElement>(null);
  const prompts = ["a favourite memory", "what they taught you", "one word for them", "one small thing you notice"];
  return (
    <div className="story-tool-dock">
      <AnimatePresence>
        {!editingText && !drawingActive && addOpen && <motion.div className="story-add-tray" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(6px)" }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}><div className="paper-choice" role="group" aria-label="Paper character">{(["plain", "dotted", "grid"] as PaperId[]).map((choice) => <button key={choice} type="button" aria-pressed={paper === choice} onClick={() => onPaper(choice)}>{choice}</button>)}</div><Carousel ariaLabel="Creative materials" contentClassName="story-tool-rail"><button type="button" aria-pressed={Boolean(capture)} onClick={() => { setAddOpen(false); onCamera(); }}><CameraMark /><span>photo</span></button><button type="button" aria-pressed={Boolean(voice && pieces.includes("voice"))} onClick={() => { setAddOpen(false); onVoice(); }}><MaterialIcon id="voice" /><span>{voice ? "new voice" : "voice"}</span></button><button type="button" aria-pressed={Boolean(song && pieces.includes("song"))} onClick={() => songInputRef.current?.click()}><MaterialIcon id="song" /><span>{song ? "new song" : "song"}</span></button></Carousel><div className="story-authored-tools" aria-label="Colour and hand-drawn mark tools"><div className="story-colour-palette" role="group" aria-label="Ink colour"><span>ink</span>{(["navy", "forest", "rust", "plum", "ochre"] as InkColor[]).map((color) => <button key={color} className={`ink-swatch ink-${color}`} type="button" aria-pressed={inkColor === color} aria-label={`Use ${inkLabels[color]} ink`} onClick={() => onInkColor(color)}><span /></button>)}</div><Carousel ariaLabel="Hand-drawn marks" contentClassName="story-sticker-rail">{(["burst", "ribbon", "stamp"] as StickerId[]).map((sticker) => { const placed = stickers.includes(sticker); return <button key={sticker} type="button" data-placed={placed || undefined} aria-label={placed ? `Select ${sticker} mark on paper` : `Add ${sticker} mark`} onClick={() => onAddSticker(sticker)}><StickerMark id={sticker} /><span>{sticker}</span></button>; })}</Carousel></div></motion.div>}
        {editingText && cuesOpen && <motion.div className="story-add-tray story-prompt-tray" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(6px)" }}><Carousel ariaLabel="Writing prompts" contentClassName="story-prompt-rail">{prompts.map((prompt) => <button key={prompt} className={prompt === activePrompt ? "is-current" : ""} type="button" onClick={() => onPrompt(prompt)}>{prompt}</button>)}</Carousel></motion.div>}
      </AnimatePresence>
      {editingText ? <div className="story-primary-tools story-context-tools"><button type="button" aria-expanded={cuesOpen} onClick={onToggleCues}><span>{cuesOpen ? "hide nudges" : "need a nudge?"}</span></button><button type="button" onClick={onFinishText}><span>done writing</span><Mark /></button></div> : drawingActive ? <div className="story-primary-tools story-context-tools"><button type="button" disabled={!canUndoDoodle} onClick={onUndoDoodle}>undo stroke</button><span className="drawing-now"><MaterialIcon id="drawing" /> draw anywhere</span><button type="button" onClick={onDoneDrawing}>done</button></div> : <div className="story-primary-tools">
        <button className="story-write-tool" type="button" disabled={!canAddText} aria-label={hasWords ? "add words" : "write"} onClick={onText}><span className="story-aa" aria-hidden="true">Aa</span><span>{hasWords ? "add words" : "write"}</span></button>
        <button className="story-draw-tool" type="button" aria-pressed={pieces.includes("drawing")} onClick={onDraw}><MaterialIcon id="drawing" /><span>doodle</span></button>
        <button className="story-add-tool" type="button" aria-expanded={addOpen} onClick={() => setAddOpen((current) => !current)}><AddMark /><span>{addOpen ? "close" : "add"}</span></button>
      </div>}
      <input ref={songInputRef} className="capture-file-input" type="file" accept="audio/*" tabIndex={-1} onChange={(event) => { const file = event.target.files?.[0]; if (file) { onSongFile(file); setAddOpen(false); } event.target.value = ""; }} />
    </div>
  );
}

function AudioPaperPiece({ asset, kind }: { asset: AudioAsset; kind: "voice" | "song" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play().catch(() => setPlaying(false));
    } else audio.pause();
  };
  return <button className={`audio-paper-piece audio-paper-${kind} ${playing ? "is-playing" : ""}`} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${kind}: ${asset.name}`}><MaterialIcon id={kind} /><span><strong>{kind === "voice" ? "voice note" : asset.name}</strong><small>{playing ? "playing · tap to pause" : "tap to play"}</small></span><audio ref={audioRef} src={asset.url} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /></button>;
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
  return <div className={`sealed-envelope-artwork seal-weight-${sealWeight} ${className}`} data-seal-weight={sealWeight} role="img" aria-label={label}><img className="sealed-envelope-source" src={`${CECILIA}envelope-mail-02.png`} alt="" draggable={false} />{snapshot.seal.length > 0 && <span className="sealed-artwork-stamp"><DoodleArtwork strokes={snapshot.seal} className="seal-artwork" /></span>}</div>;
}

function Preview({ snapshot, onEdit, onChangeCarrier, onGive }: { snapshot: KeepsakeSnapshot; onEdit: () => void; onChangeCarrier: () => void; onGive: () => void }) {
  return (
    <Page className="preview-page">
      <TopLine onBack={onEdit} label="edit the inside" />
      <div className="preview-identities"><span>for {snapshot.recipient}</span><span>from {snapshot.sender}</span></div>
      <motion.div className="sealed-preview" initial={{ opacity: 0, transform: "translate3d(0, 18px, 0) rotate(-3deg) scale(.95)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" }} transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}><SealedEnvelopeArtwork snapshot={snapshot} /></motion.div>
      <div className="preview-copy"><h1>one thing, ready to give.</h1></div>
      <button className="quiet-link" type="button" onClick={onChangeCarrier}>choose another way for it to arrive</button>
      <button className="drawn-action preview-next" type="button" onClick={onGive}>give this privately <Mark /></button>
    </Page>
  );
}

function Courier({ carrier, state }: { carrier: Carrier; state: "pickup" | "departure" | "arrival" }) {
  if (carrier.id !== "firefly") {
    const source = carrier.id === "bottle" ? "bottle-intact.png" : "carrier-plane.png";
    return <div className={`courier courier-${state} courier-${carrier.id}`} aria-hidden="true"><div className="courier-body courier-object-body" data-asset-slot={`courier-${carrier.id}`}><img src={`${CECILIA}${source}`} alt="" /></div></div>;
  }
  return <div className={`courier courier-${state} courier-firefly`} aria-hidden="true"><div className="courier-body" data-asset-slot="courier-firefly"><img className="courier-firefly-frame courier-firefly-brand-frame" src={`${CECILIA}firefly-brand-mark.png`} alt="" /></div><div className="courier-payload" data-asset-slot="courier-payload"><img src={`${CECILIA}envelope-mail-02.png`} alt="" /></div></div>;
}

function Handoff({ snapshot, recipient, carrier, copied, failed, reduceMotion, demoReceiver, onBack, onCopy, onFail, onFinish }: { snapshot: KeepsakeSnapshot; recipient: string; carrier: Carrier; copied: boolean; failed: boolean; reduceMotion: boolean; demoReceiver?: boolean; onBack: () => void; onCopy: () => void; onFail: () => void; onFinish: () => void }) {
  const [qrOpen, setQrOpen] = useState(false);
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
      <header><h1>{failed ? "the link did not make it." : `give this to ${recipient}.`}</h1>{failed && <p>Nothing left this screen. Your object is still here.</p>}</header>
      <motion.div className="handoff-object" aria-label={`Your ${carrier.shortLabel} is ready to give`} initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0, 14px, 0) rotate(-2deg)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg)" }} transition={{ duration: reduceMotion ? .01 : .42, ease: [0.23, 1, 0.32, 1] }}><CarrierIcon id={carrier.id} size="sealed" /></motion.div>
      <div className="handoff-link-tools"><div className={`private-link ${failed ? "link-failed handoff-link-blocked" : ""}`}><span>{failed ? (containsBlobMedia(snapshot) ? "Link creation is blocked: this keepsake includes local media that cannot travel in a link." : !isSafeSnapshot(snapshot) ? "Link creation is blocked: this draft contains details that cannot safely travel in a link." : "Link unavailable: this keepsake is too large or too detailed for this prototype link.") : url}</span><button type="button" aria-label="Copy generated receiver link" onClick={onCopy}>{copied ? "copied" : failed ? "try again" : "copy"}</button></div>{url && !failed && (qrIsExact ? <button className="handoff-qr" type="button" onClick={() => setQrOpen(true)} aria-label="Open receiver QR for this keepsake" data-keepsake-id={snapshot.id}><QRCodeSVG value={url} size={88} level="L" marginSize={1} bgColor="#ffffff" fgColor="#081f4d" title="Receiver QR for this keepsake" /><span>scan it</span></button> : <p className="handoff-qr-limit" role="status">exact link only<small>too detailed for a reliable QR</small></p>)}</div>
      {copied ? <button className="drawn-action" type="button" onClick={onFinish}>finish giving <Mark /></button> : <button className="quiet-link failure-test" type="button" onClick={onFail}>show the broken-link state</button>}
      <p className="system-note">This bearer link is not encryption. Prototype only: no account, delivery, storage, or receiver activity is connected.</p>
      {typeof document !== "undefined" && createPortal(<AnimatePresence>{qrOpen && qrIsExact && <motion.div ref={qrDialogRef} className="qr-dialog" role="dialog" aria-modal="true" aria-label="Receiver QR for this keepsake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} onKeyDown={(event) => { if (event.key === "Escape") setQrOpen(false); }}><button className="qr-dialog-close" type="button" autoFocus onClick={() => setQrOpen(false)} aria-label="Close receiver QR"><CloseMark /></button><QRCodeSVG value={url} size={350} level="L" marginSize={3} bgColor="#ffffff" fgColor="#081f4d" title="Scan to open this keepsake" /><p>scan to give this to {recipient}.</p><small>This code belongs to this keepsake. Anyone who scans it opens the same sealed object—no account needed.</small><button className="quiet-link qr-save" type="button" onClick={saveQr}>save this QR</button></motion.div>}</AnimatePresence>, document.body)}
    </Page>
  );
}

function DeliveryMascot({ className = "" }: { className?: string }) {
  return <span className={`delivery-mascot ${className}`}><img className="delivery-mascot-letter" src={`${CECILIA}envelope-mail-02.png`} alt="" draggable={false} /><img className="delivery-mascot-firefly" src={`${CECILIA}firefly-carrying-envelope.png`} alt="" draggable={false} /></span>;
}

function Sent({ recipient, carrier, reduceMotion, onAgain, onLeave }: { recipient: string; carrier: Carrier; reduceMotion: boolean; onAgain: () => void; onLeave: () => void }) {
  const [departureStarted, setDepartureStarted] = useState(reduceMotion);
  useEffect(() => {
    if (reduceMotion) { setDepartureStarted(true); return; }
    const frame = window.requestAnimationFrame(() => setDepartureStarted(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);
  return (
    <Page className="sent-page">
      <div className="sent-delivery-stage" data-carrier={carrier.id} data-delivery-stage={reduceMotion ? "still" : "departing"} aria-hidden="true">
        {reduceMotion ? carrier.id === "bottle" ? <><img className="sent-water-still" src="/assets/illustrations/generated/water-departure-v1.png" alt="" draggable={false} /><CarrierIcon id={carrier.id} size="sealed" /></> : <CarrierIcon id={carrier.id} size="sealed" /> : carrier.id === "firefly" ? (
          <>
            <motion.img
              className="sent-letter-object"
              src={`${CECILIA}envelope-mail-02.png`}
              alt=""
              draggable={false}
              initial={false}
              animate={departureStarted ? { opacity: [1, 1, 1, 0], transform: ["translate3d(0, 0, 0) rotate(-1deg) scale(1)", "translate3d(-3px, 1px, 0) rotate(-1.5deg) scale(1.01)", "translate3d(0, -2px, 0) rotate(0deg) scale(.96)", "translate3d(0, -8px, 0) rotate(2deg) scale(.78)"] } : { opacity: 1, transform: "translate3d(0, 0, 0) rotate(-1deg) scale(1)" }}
              transition={{ duration: 5.2, times: [0, .36, .52, .68], ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.div
              className="sent-pickup-courier"
              initial={false}
              animate={departureStarted ? { opacity: [0, 1, 1, 1, 1, 0], transform: ["translate3d(356px, -48px, 0) rotate(16deg) scale(.68)", "translate3d(258px, 62px, 0) rotate(7deg) scale(.76)", "translate3d(126px, 174px, 0) rotate(-3deg) scale(.82)", "translate3d(118px, 171px, 0) rotate(-7deg) scale(.83)", "translate3d(126px, 174px, 0) rotate(-3deg) scale(.82)", "translate3d(410px, -76px, 0) rotate(14deg) scale(.66)"] } : { opacity: 0, transform: "translate3d(356px, -48px, 0) rotate(16deg) scale(.68)" }}
              transition={{ duration: 5.2, times: [0, .22, .45, .52, .61, 1], ease: [0.77, 0, 0.175, 1] }}
            >
              <motion.span className="sent-firefly-empty" initial={false} animate={departureStarted ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }} transition={{ duration: 5.2, times: [0, .45, .53, 1], ease: [0.23, 1, 0.32, 1] }}><img className="sent-firefly-wing-frame sent-firefly-wing-one" src={`${CECILIA}firefly-wing-w1.png`} alt="" draggable={false} /><img className="sent-firefly-wing-frame sent-firefly-wing-two" src={`${CECILIA}firefly-wing-w2.png`} alt="" draggable={false} /></motion.span>
              <motion.span className="sent-firefly-carrying" initial={false} animate={departureStarted ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }} transition={{ duration: 5.2, times: [0, .47, .55, 1], ease: [0.23, 1, 0.32, 1] }}><DeliveryMascot /></motion.span>
            </motion.div>
          </>
        ) : carrier.id === "bottle" ? <>
          <motion.img className="sent-water-departure" src="/assets/illustrations/generated/water-departure-v1.png" alt="" draggable={false} initial={false} animate={departureStarted ? { opacity: [0, 1, 1, .96, 0], transform: ["translate3d(-118px, 148px, 0) scale(1.08)", "translate3d(-58px, 142px, 0) scale(1.08)", "translate3d(46px, 148px, 0) scale(1.08)", "translate3d(172px, 138px, 0) scale(1.08)", "translate3d(290px, 142px, 0) scale(1.08)"] } : { opacity: 0, transform: "translate3d(-118px, 148px, 0) scale(1.08)" }} transition={{ duration: 5.8, times: [0, .12, .46, .75, 1], ease: [0.77, 0, 0.175, 1] }} />
          <motion.div className="sent-carrier-departure sent-carrier-departure-bottle" initial={false} animate={departureStarted ? { opacity: [1, 1, 1, .95, 0], transform: ["translate3d(24px, 116px, 0) rotate(-8deg) scale(.82)", "translate3d(62px, 104px, 0) rotate(4deg) scale(1)", "translate3d(158px, 114px, 0) rotate(-4deg) scale(.96)", "translate3d(276px, 94px, 0) rotate(6deg) scale(.9)", "translate3d(440px, 76px, 0) rotate(-3deg) scale(.76)"] } : { opacity: 1, transform: "translate3d(24px, 116px, 0) rotate(-8deg) scale(.82)" }} transition={{ duration: 5.8, times: [0, .2, .48, .72, 1], ease: [0.77, 0, 0.175, 1] }}><CarrierIcon id={carrier.id} size="sealed" /></motion.div>
        </> : <motion.div className="sent-carrier-departure sent-carrier-departure-plane" initial={false} animate={departureStarted ? { opacity: [1, 1, 1, 0], transform: ["translate3d(24px, 210px, 0) rotate(-18deg) scale(.78)", "translate3d(108px, 154px, 0) rotate(-5deg) scale(1)", "translate3d(228px, 78px, 0) rotate(9deg) scale(.94)", "translate3d(458px, -54px, 0) rotate(18deg) scale(.72)"] } : { opacity: 1, transform: "translate3d(24px, 210px, 0) rotate(-18deg) scale(.78)" }} transition={{ duration: 4.8, times: [0, .12, .78, 1], ease: [0.77, 0, 0.175, 1] }}><CarrierIcon id={carrier.id} size="sealed" /></motion.div>}
      </div>
      <div className="sent-copy"><h1>that&apos;s it from you.</h1></div>
      <div className="sent-secondary"><button className="quiet-link" type="button" onClick={onAgain}>make another</button><button className="quiet-link" type="button" onClick={onLeave}>leave</button></div>
      <p className="sr-only" role="status">Your {carrier.shortLabel} is taking the letter to {recipient}.</p>
    </Page>
  );
}

function Arrival({ recipient, carrier, reduceMotion, demo = false, onOpen, onDefer, onUnavailable }: { recipient: string; carrier: Carrier; reduceMotion: boolean; demo?: boolean; onOpen: () => void; onDefer: () => void; onUnavailable: () => void }) {
  const [landed, setLanded] = useState(reduceMotion);
  const [tapPrimed, setTapPrimed] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);
  useEffect(() => { if (reduceMotion) return; const timer = window.setTimeout(() => setLanded(true), 3600); return () => window.clearTimeout(timer); }, [reduceMotion]);
  useEffect(() => () => { if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current); }, []);
  const open = () => {
    if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current);
    setTapPrimed(false);
    navigator.vibrate?.([10, 18, 12]);
    onOpen();
  };
  const attemptOpen = () => {
    const now = performance.now();
    if (now - lastTapRef.current < 420) { open(); return; }
    lastTapRef.current = now;
    setTapPrimed(true);
    navigator.vibrate?.(8);
    if (tapTimerRef.current !== null) window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => setTapPrimed(false), 460);
  };
  return (
    <Page className={`arrival-page arrival-carrier-${carrier.id}`}>
      <header><span>for {recipient}</span><h1>{demo ? `${sender} made something for you.` : `${sender} made something private for you.`}</h1></header>
      <div className="arrival-object"><AnimatePresence>{!landed && <motion.div className="arrival-courier-motion" initial={{ opacity: 0, transform: "translate(130px, -158px) rotate(17deg)" }} animate={{ opacity: [0, 1, 1, 0], transform: ["translate(130px, -158px) rotate(17deg)", "translate(34px, -58px) rotate(4deg)", "translate(0, 0) rotate(0deg)", "translate(-92px, 80px) rotate(-14deg)"] }} transition={{ duration: 3.6, times: [0, .18, .64, 1], ease: [0.77, 0, 0.175, 1] }}><Courier carrier={carrier} state="arrival" /></motion.div>}</AnimatePresence>{landed && <div className="arrival-drop"><motion.button type="button" className={`arrival-carrier-button ${tapPrimed ? "is-tap-primed" : ""}`} aria-label={`Double tap the ${carrier.shortLabel} to open`} onPointerUp={attemptOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } }} animate={{ transform: tapPrimed ? "scale(.965) rotate(-1deg)" : "scale(1) rotate(0deg)" }} transition={{ duration: .14, ease: [0.23, 1, 0.32, 1] }}><CarrierIcon id={carrier.id} size="arrival" /></motion.button><p aria-live="polite">{tapPrimed ? <>tap once more<br /><small>to unfold what they made</small></> : <>double tap to open<br /><small>or use the open button</small></>}</p><button className="quiet-link direct-open" type="button" onClick={open}>open it</button></div>}</div>
      <div className="arrival-options"><button className="quiet-link" type="button" onClick={onDefer}>another time</button><button className="quiet-link unavailable-link" type="button" onClick={onUnavailable}>this link is not for me</button></div>
    </Page>
  );
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
  const moveEase = [0.77, 0, 0.175, 1] as const;
  const [opened, setOpened] = useState(reduceMotion);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [keepFailed, setKeepFailed] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setOpened(true), 1540);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);
  const keep = () => {
    if (!onKeep()) setKeepFailed(true);
  };
  return (
    <motion.section className={`opening-page opening-envelope ${opened ? "is-open" : "is-unfolding"}`} initial={{ backgroundColor: "#ffffff" }} animate={{ backgroundColor: "#ffffff" }} transition={{ duration: .18, ease: [0.23, 1, 0.32, 1] }} aria-label="Opening the sealed private envelope">
      {!opened && <motion.div className="opening-sealed-object" initial={{ opacity: 1, transform: "translate3d(0, 0, 0) scale(1) rotate(-1deg)" }} animate={{ opacity: [1, 1, 1, .58, 0], transform: ["translate3d(0, 0, 0) scale(1) rotate(-1deg)", "translate3d(0, 2px, 0) scale(.97) rotate(-1.5deg)", "translate3d(0, 18px, 0) scale(.94) rotate(.4deg)", "translate3d(0, 76px, 0) scale(.84) rotate(.8deg)", "translate3d(0, 126px, 0) scale(.76) rotate(1deg)"] }} transition={{ duration: .82, times: [0, .2, .46, .76, 1], ease: [0.23, 1, 0.32, 1] }}><SealedEnvelopeArtwork snapshot={snapshot} /></motion.div>}
      <div className="opening-object-content">
        <div className="receiver-paper-stage" aria-hidden={!opened} inert={!opened ? true : undefined}>
          <motion.div className="receiver-paper-final" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: reduceMotion || opened ? 1 : 0 }} transition={{ duration: reduceMotion ? .18 : .24, ease: [0.23, 1, 0.32, 1] }}><AuthoredPaper snapshot={snapshot} receiver={opened} /></motion.div>
          {!opened && <motion.div className="receiver-fold-panels" aria-hidden="true" initial={{ opacity: 0, transform: "translate3d(0, 66px, 0) scale(.42) rotate(-2deg)" }} animate={{ opacity: [0, 1, 1, 1, 0], transform: ["translate3d(0, 66px, 0) scale(.42) rotate(-2deg)", "translate3d(0, 42px, 0) scale(.56) rotate(.8deg)", "translate3d(0, 12px, 0) scale(.82) rotate(-.3deg)", "translate3d(0, 0, 0) scale(1) rotate(0deg)", "translate3d(0, 0, 0) scale(1) rotate(0deg)"] }} transition={{ delay: .16, duration: 1.34, times: [0, .2, .57, .88, 1], ease: moveEase }}>
            <motion.div className="receiver-fold-segment receiver-fold-segment-top" initial={{ transform: "rotateX(178deg)" }} animate={{ transform: "rotateX(0deg)" }} transition={{ delay: .38, duration: .52, ease: moveEase }}><AuthoredPaper snapshot={snapshot} /></motion.div>
            <div className="receiver-fold-segment receiver-fold-segment-middle"><AuthoredPaper snapshot={snapshot} /></div>
            <motion.div className="receiver-fold-segment receiver-fold-segment-bottom" initial={{ transform: "rotateX(-178deg)" }} animate={{ transform: "rotateX(0deg)" }} transition={{ delay: .72, duration: .56, ease: moveEase }}><AuthoredPaper snapshot={snapshot} /></motion.div>
          </motion.div>}
        </div>
        <AnimatePresence initial={false}>{opened && <motion.div className={`receiver-actions-reveal ${actionsOpen ? "is-expanded" : "is-collapsed"}`} initial={{ opacity: 0, transform: "translate3d(0, 14px, 0)" }} animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }} transition={{ duration: .28, ease: [0.23, 1, 0.32, 1] }}>{actionsOpen ? <><button className="receiver-actions-back" type="button" onClick={() => { setActionsOpen(false); onCancelRemove(); }}><Mark direction="left" /> back to the letter</button><ReceiverActions removeOpen={removeOpen} keepFailed={keepFailed} onKeep={keep} onClose={onClose} onRemove={onRemove} onCancelRemove={onCancelRemove} onConfirmRemove={onConfirmRemove} /></> : <button className="receiver-actions-trigger" type="button" onClick={() => setActionsOpen(true)}>what should this become? <Mark /></button>}</motion.div>}</AnimatePresence>
      </div>
      {!opened && <motion.p className="receiver-opening-status" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: .22, duration: 1.08, times: [0, .18, .74, 1], ease: [0.23, 1, 0.32, 1] }}>unfolding what {snapshot.sender} made.</motion.p>}
    </motion.section>
  );
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
        {items.length ? visibleItems.map((item) => <motion.div key={item.id} className="cabinet-item cabinet-object" initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}><button type="button" onClick={() => onOpen(item)} aria-label={`Open kept object from ${item.sender} for ${item.recipient}`}><CarrierIcon id={item.carrier} size="cabinet" /><span>from {item.sender}<small>for {item.recipient}</small></span></button>{removingId === item.id ? <div className="cabinet-remove" role="alert"><p>Remove it? {item.sender} will not be told.</p><button type="button" onClick={() => onConfirmRemove(item)}>remove</button><button type="button" onClick={onCancelRemove}>cancel</button></div> : <button className="cabinet-remove-link" type="button" onClick={() => onRemove(item)}>remove from here</button>}</motion.div>) : <div className="empty-cabinet"><p>nothing kept here yet.</p></div>}
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
  const source = id === "bottle" ? "bottle-intact.png" : id === "plane" ? "carrier-plane.png" : "firefly-brand-mark.png";
  return <span className={`carrier-icon carrier-icon-${id} carrier-icon-${size}`} role="img" aria-label={id === "firefly" ? "Firefly courier" : id}><img src={`${CECILIA}${source}`} alt="" draggable={false} /></span>;
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
