// Implements the transcript-led maker, carrier, handoff, and receiver experience inside the protected mobile runtime.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Carousel, KeyboardInput, KeyboardTextarea, MobileScroll, useKeyboard } from "./mobile";

type Phase =
  | "home"
  | "carrier"
  | "studio"
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

type CarrierId = "bottle" | "ladybug" | "plane" | "flowers";
type PieceId = "photo" | "voice" | "song" | "drawing";
type Playback = "idle" | "playing" | "played";
type StudioMode = "capture" | "compose";
type CaptureMode = "photo" | "video";
type CaptureAsset = {
  kind: CaptureMode | "sample";
  url?: string;
};
type LayerId = "words" | Exclude<PieceId, "photo">;
type LayerLayout = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type Carrier = {
  id: CarrierId;
  label: string;
  shortLabel: string;
  description: string;
  action: string;
};

const sender = "Ethan";
const carriers: Carrier[] = [
  {
    id: "bottle",
    label: "a note through the tide",
    shortLabel: "bottle",
    description: "A little bottle bobs in. They pull the cork when they are ready.",
    action: "pull the cork",
  },
  {
    id: "ladybug",
    label: "a little courier",
    shortLabel: "ladybug",
    description: "A ladybug carries it along one hand-drawn path, then leaves.",
    action: "guide it home",
  },
  {
    id: "plane",
    label: "a paper plane",
    shortLabel: "plane",
    description: "A folded plane lands quietly. One tap unfolds what is inside.",
    action: "unfold the plane",
  },
  {
    id: "flowers",
    label: "a small bunch",
    shortLabel: "flowers",
    description: "A loose bundle arrives wrapped around the thing you made.",
    action: "unwrap the stems",
  },
];

const pieceLabels: Record<PieceId, string> = {
  photo: "photo",
  voice: "voice",
  song: "song",
  drawing: "draw",
};

const defaultLayerLayouts: Record<LayerId, LayerLayout> = {
  words: { x: 0, y: -42, rotation: -1.5, scale: 1 },
  voice: { x: -42, y: 160, rotation: 2, scale: 1 },
  song: { x: 42, y: 168, rotation: -2.5, scale: 1 },
  drawing: { x: 92, y: -164, rotation: 8, scale: 0.92 },
};

export default function Prototype() {
  const [phase, setPhase] = useState<Phase>("home");
  const [carrierId, setCarrierId] = useState<CarrierId>("bottle");
  const [recipient, setRecipient] = useState("Maya");
  const [words, setWords] = useState(
    "You made the first week in a new place feel familiar. You noticed what I needed before I knew how to ask.",
  );
  const [pieces, setPieces] = useState<PieceId[]>(["photo"]);
  const [cuesOpen, setCuesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [kept, setKept] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<Playback>("idle");
  const [songState, setSongState] = useState<Playback>("idle");
  const [studioMode, setStudioMode] = useState<StudioMode>("capture");
  const [captureAsset, setCaptureAsset] = useState<CaptureAsset | null>(null);
  const [layerLayouts, setLayerLayouts] = useState<Record<LayerId, LayerLayout>>(defaultLayerLayouts);
  const captureAssetRef = useRef<CaptureAsset | null>(null);
  const keyboard = useKeyboard();
  const reduceMotion = useReducedMotion();
  const carrier = carriers.find((item) => item.id === carrierId) ?? carriers[0];

  const replaceCapture = useCallback((next: CaptureAsset | null) => {
    const previous = captureAssetRef.current;
    if (previous?.url?.startsWith("blob:")) URL.revokeObjectURL(previous.url);
    captureAssetRef.current = next;
    setCaptureAsset(next);
  }, []);

  const go = (next: Phase) => {
    keyboard.hide();
    setRemoveOpen(false);
    setPhase(next);
  };

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = window.setTimeout(() => setPhase("reveal"), reduceMotion ? 40 : 520);
    return () => window.clearTimeout(timer);
  }, [phase, reduceMotion]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(".keepsake-app .mobile-scroll")?.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => () => {
    const current = captureAssetRef.current;
    if (current?.url?.startsWith("blob:")) URL.revokeObjectURL(current.url);
  }, []);

  const togglePiece = (piece: PieceId) => {
    setPieces((current) =>
      current.includes(piece)
        ? current.filter((candidate) => candidate !== piece)
        : [...current, piece],
    );
  };

  const resetDraft = () => {
    setRecipient("Maya");
    setWords("");
    setCarrierId("bottle");
    setPieces([]);
    replaceCapture(null);
    setStudioMode("capture");
    setLayerLayouts(defaultLayerLayouts);
    setCuesOpen(false);
    setCopied(false);
    setShareFailed(false);
    setVoiceState("idle");
    setSongState("idle");
    go("carrier");
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

  const canPreview = recipient.trim() !== "" && Boolean(words.trim() || captureAsset || pieces.length);
  const navyPhase = ["opening", "reveal", "cabinet", "removed"].includes(phase);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScroll
        className={`app-screen keepsake-app phase-${phase} ${navyPhase ? "phase-navy" : "phase-paper"}`}
      >
        <main className="keepsake-shell" aria-label="Friendship keepsake exploratory prototype">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "home" && (
              <Home key="home" kept={kept} recipient={recipient} onMake={resetDraft} onCabinet={() => go("cabinet")} onDemo={() => go("arrival")} />
            )}
            {phase === "carrier" && (
              <CarrierPicker key="carrier" selected={carrierId} onSelect={setCarrierId} onCycle={cycleCarrier} onKeyDown={handleCarrierKeys} onBack={() => go("home")} onNext={() => go("studio")} />
            )}
            {phase === "studio" && (
              <Studio key="studio" mode={studioMode} capture={captureAsset} recipient={recipient} words={words} pieces={pieces} cuesOpen={cuesOpen} layouts={layerLayouts} canPreview={canPreview} onMode={setStudioMode} onCapture={replaceCapture} onRecipient={setRecipient} onWords={setWords} onTogglePiece={togglePiece} onToggleCues={() => setCuesOpen((current) => !current)} onLayout={updateLayer} onBack={() => go("carrier")} onPreview={() => go("preview")} />
            )}
            {phase === "preview" && (
              <Preview key="preview" recipient={recipient} words={words} pieces={pieces} capture={captureAsset} carrier={carrier} onEdit={() => go("studio")} onChangeCarrier={() => go("carrier")} onGive={() => go("handoff")} />
            )}
            {phase === "handoff" && (
              <Handoff key="handoff" recipient={recipient} copied={copied} failed={shareFailed} onBack={() => go("preview")} onCopy={() => { setShareFailed(false); setCopied(true); if (navigator.clipboard) void navigator.clipboard.writeText("https://warm.local/for/maya-7a3c").catch(() => undefined); }} onFail={() => { setCopied(false); setShareFailed(true); }} onFinish={() => go("sent")} />
            )}
            {phase === "sent" && (
              <Sent key="sent" recipient={recipient} carrier={carrier} onReceiver={() => go("arrival")} onAgain={resetDraft} onLeave={() => go("home")} />
            )}
            {phase === "arrival" && (
              <Arrival key="arrival" recipient={recipient} carrier={carrier} reduceMotion={Boolean(reduceMotion)} onOpen={() => go("opening")} onDefer={() => go("deferred")} onUnavailable={() => go("unavailable")} />
            )}
            {phase === "deferred" && (
              <QuietExit key="deferred" title="left for another time." body={`${sender} is not told. There is no reminder.`} action="return to it" onAction={() => go("arrival")} onLeave={() => go("home")} />
            )}
            {phase === "unavailable" && (
              <QuietExit key="unavailable" title="this one cannot be opened." body="No private content has been shown. The link may have expired or reached the wrong person." action="back to the sample" onAction={() => go("arrival")} onLeave={() => go("home")} />
            )}
            {phase === "opening" && <Opening key="opening" recipient={recipient} />}
            {phase === "reveal" && (
              <Reveal key="reveal" recipient={recipient} words={words} pieces={pieces} capture={captureAsset} voiceState={voiceState} songState={songState} removeOpen={removeOpen} onVoice={() => setVoiceState((current) => current === "playing" ? "played" : "playing")} onSong={() => setSongState((current) => current === "playing" ? "played" : "playing")} onKeep={() => { setKept(true); go("cabinet"); }} onClose={() => go("deferred")} onRemove={() => setRemoveOpen(true)} onCancelRemove={() => setRemoveOpen(false)} onConfirmRemove={() => { setKept(false); go("removed"); }} />
            )}
            {phase === "cabinet" && (
              <Cabinet key="cabinet" kept={kept} recipient={recipient} carrier={carrier} removeOpen={removeOpen} onOpen={() => go("reveal")} onMake={resetDraft} onClose={() => go("home")} onRemove={() => setRemoveOpen(true)} onCancelRemove={() => setRemoveOpen(false)} onConfirmRemove={() => { setKept(false); go("removed"); }} />
            )}
            {phase === "removed" && <Removed key="removed" onLeave={() => go("home")} onRestore={() => go("arrival")} />}
          </AnimatePresence>
        </main>
      </MobileScroll>
    </MotionConfig>
  );
}

function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section className={`experience-page ${className}`} initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(-5px)" }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
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

function Home({ kept, recipient, onMake, onCabinet, onDemo }: { kept: boolean; recipient: string; onMake: () => void; onCabinet: () => void; onDemo: () => void }) {
  return (
    <Page className="home-page">
      <p className="working-wordmark">warm &amp;<br />fuzzies</p>
      <div className="home-quiet-actions">
        {kept && <button className="quiet-link" type="button" onClick={onCabinet}>things you kept for {recipient}</button>}
        <button className="quiet-link" type="button" onClick={onDemo}>receiver demo</button>
      </div>
      <div className="home-invitation">
        <p>something good<br />on your mind?</p>
        <button className="drawn-action" type="button" onClick={onMake}>make it for them <Mark /></button>
      </div>
    </Page>
  );
}

function CarrierPicker({ selected, onSelect, onCycle, onKeyDown, onBack, onNext }: { selected: CarrierId; onSelect: (carrier: CarrierId) => void; onCycle: (direction: -1 | 1) => void; onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => void; onBack: () => void; onNext: () => void }) {
  const carrier = carriers.find((item) => item.id === selected) ?? carriers[0];
  return (
    <Page className={`carrier-page carrier-${selected}`}>
      <TopLine onBack={onBack} label="home" />
      <header className="carrier-heading"><p>pick how it arrives.</p><span>each one opens a little differently.</span></header>
      <div className="carrier-stage">
        <button className="stage-arrow stage-arrow-left" type="button" aria-label="Previous carrier" onClick={() => onCycle(-1)}><Mark direction="left" /></button>
        <motion.div key={selected} className="hero-carrier" initial={{ opacity: 0, transform: "translateY(10px) rotate(-2deg) scale(0.97)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(0deg) scale(1)" }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          <CarrierIcon id={selected} size="hero" />
        </motion.div>
        <button className="stage-arrow stage-arrow-right" type="button" aria-label="Next carrier" onClick={() => onCycle(1)}><Mark /></button>
      </div>
      <div className="carrier-thumbnails" role="radiogroup" aria-label="Delivery carrier">
        {carriers.map((item, index) => (
          <button id={`carrier-${item.id}`} key={item.id} className="carrier-thumb" type="button" role="radio" aria-checked={item.id === selected} aria-label={item.shortLabel} tabIndex={item.id === selected ? 0 : -1} onClick={() => onSelect(item.id)} onKeyDown={(event) => onKeyDown(event, index)}>
            <CarrierIcon id={item.id} size="thumb" />
          </button>
        ))}
      </div>
      <div className="carrier-copy" aria-live="polite"><h1>{carrier.label}</h1><p>{carrier.description}</p></div>
      <button className="drawn-action carrier-next" type="button" onClick={onNext}>make what goes inside <Mark /></button>
    </Page>
  );
}

function Studio({ mode, capture, recipient, words, pieces, cuesOpen, layouts, canPreview, onMode, onCapture, onRecipient, onWords, onTogglePiece, onToggleCues, onLayout, onBack, onPreview }: { mode: StudioMode; capture: CaptureAsset | null; recipient: string; words: string; pieces: PieceId[]; cuesOpen: boolean; layouts: Record<LayerId, LayerLayout>; canPreview: boolean; onMode: (mode: StudioMode) => void; onCapture: (capture: CaptureAsset | null) => void; onRecipient: (value: string) => void; onWords: (value: string) => void; onTogglePiece: (piece: PieceId) => void; onToggleCues: () => void; onLayout: (id: LayerId, layout: LayerLayout) => void; onBack: () => void; onPreview: () => void }) {
  const keyboard = useKeyboard();
  const [selectedLayer, setSelectedLayer] = useState<LayerId | null>(words ? "words" : null);
  const [editingText, setEditingText] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(false);
  const [activePrompt, setActivePrompt] = useState("say the thing you usually leave unsaid");
  const [showGestureHint, setShowGestureHint] = useState(false);

  useEffect(() => {
    if (mode !== "compose") return;
    setShowGestureHint(true);
    const timer = window.setTimeout(() => setShowGestureHint(false), 2600);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const finishText = () => {
    keyboard.hide();
    setEditingText(false);
    if (words.trim()) setSelectedLayer("words");
  };

  const removeLayer = (id: LayerId) => {
    if (id === "words") onWords("");
    else onTogglePiece(id);
    setSelectedLayer(null);
  };

  const toggleLayer = (id: Exclude<LayerId, "words">) => {
    const isPresent = pieces.includes(id);
    onTogglePiece(id);
    setSelectedLayer(isPresent ? null : id);
  };

  return (
    <motion.section className={`experience-page studio-page studio-${mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
      <AnimatePresence mode="wait" initial={false}>
        {mode === "capture" ? (
          <CaptureStage
            key="capture"
            capture={capture}
            recipient={recipient}
            onBack={onBack}
            onKeep={() => onMode("compose")}
            onCaptured={(asset) => { onCapture(asset); onMode("compose"); }}
            onBlank={() => { onCapture(null); onMode("compose"); }}
          />
        ) : (
          <StoryComposer
            key="compose"
            capture={capture}
            recipient={recipient}
            words={words}
            pieces={pieces}
            layouts={layouts}
            selectedLayer={selectedLayer}
            editingRecipient={editingRecipient}
            showGestureHint={showGestureHint}
            canPreview={canPreview}
            onSelectLayer={setSelectedLayer}
            onLayout={onLayout}
            onRemoveLayer={removeLayer}
            onEditText={() => setEditingText(true)}
            onEditRecipient={() => setEditingRecipient(true)}
            onRecipient={onRecipient}
            onFinishRecipient={() => { keyboard.hide(); setEditingRecipient(false); }}
            onToggleLayer={toggleLayer}
            onCamera={() => { keyboard.hide(); onMode("capture"); }}
            onBack={onBack}
            onPreview={onPreview}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingText && mode === "compose" && (
          <motion.section className="story-text-editor" initial={{ opacity: 0, transform: "translateY(18px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(12px)" }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            <header><button type="button" onClick={() => { keyboard.hide(); setEditingText(false); }}>close</button><span>your words</span><button type="button" onClick={finishText}>done</button></header>
            <p className="active-writing-prompt">{activePrompt}</p>
            <KeyboardTextarea autoFocus aria-label="Write your message" value={words} placeholder="start anywhere…" onChange={(event) => onWords(event.target.value)} onBlur={() => keyboard.hide()} />
            <button className="prompt-toggle" type="button" aria-expanded={cuesOpen} onClick={onToggleCues}>{cuesOpen ? "hide prompts" : "try a small prompt"}</button>
            <AnimatePresence>
              {cuesOpen && (
                <motion.div className="story-prompts" initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(6px)" }}>
                  <Carousel ariaLabel="Writing prompts" contentClassName="story-prompt-rail">
                    {["a favourite memory", "what they taught you", "one word for them", "one small thing you notice"].map((prompt) => <button key={prompt} type="button" onClick={() => setActivePrompt(prompt)}>{prompt}</button>)}
                  </Carousel>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

type CameraStatus = "requesting" | "waiting" | "live" | "denied" | "unsupported";

function CaptureStage({ capture, recipient, onBack, onKeep, onCaptured, onBlank }: { capture: CaptureAsset | null; recipient: string; onBack: () => void; onKeep: () => void; onCaptured: (asset: CaptureAsset) => void; onBlank: () => void }) {
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
      <header className="capture-topbar"><button type="button" aria-label="Back to carrier selection" onClick={onBack}><CloseMark /></button><span>for {recipient || "someone"}</span>{capture ? <button type="button" onClick={onKeep}>keep page</button> : <span aria-hidden="true" />}</header>

      {status !== "live" && (
        <div className="camera-state" aria-live="polite">
          <CameraMark />
          <h1>{statusCopy}</h1>
          <p>{status === "requesting" ? "The page stays private on this device." : "You can retry, choose a moment, or begin on blank paper."}</p>
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
        <div className="capture-quiet-actions"><button type="button" onClick={useSample}>use sample moment</button><button type="button" onClick={onBlank}>start on blank paper</button></div>
      </footer>
      <input ref={fileRef} className="capture-file-input" type="file" accept="image/*,video/*" onChange={handleFile} tabIndex={-1} />
    </motion.div>
  );
}

function StoryComposer({ capture, recipient, words, pieces, layouts, selectedLayer, editingRecipient, showGestureHint, canPreview, onSelectLayer, onLayout, onRemoveLayer, onEditText, onEditRecipient, onRecipient, onFinishRecipient, onToggleLayer, onCamera, onBack, onPreview }: { capture: CaptureAsset | null; recipient: string; words: string; pieces: PieceId[]; layouts: Record<LayerId, LayerLayout>; selectedLayer: LayerId | null; editingRecipient: boolean; showGestureHint: boolean; canPreview: boolean; onSelectLayer: (id: LayerId | null) => void; onLayout: (id: LayerId, layout: LayerLayout) => void; onRemoveLayer: (id: LayerId) => void; onEditText: () => void; onEditRecipient: () => void; onRecipient: (value: string) => void; onFinishRecipient: () => void; onToggleLayer: (id: Exclude<LayerId, "words">) => void; onCamera: () => void; onBack: () => void; onPreview: () => void }) {
  return (
    <motion.div className={`story-composer ${capture ? "story-has-capture" : "story-blank"}`} initial={{ opacity: 0, transform: "translateY(16px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(10px)" }} transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }} data-scroll-drag="ignore">
      <div className="story-canvas" aria-label="Full-screen keepsake canvas" onPointerDown={() => onSelectLayer(null)}>
        <CapturedMedia capture={capture} className="story-background" />
        {capture && <div className="story-media-scrim" aria-hidden="true" />}
        {!capture && !words && pieces.length === 0 && <motion.div className="blank-page-invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><span>blank paper.</span><p>film a moment or add the first thing below.</p></motion.div>}

        <header className="story-topbar">
          <button type="button" aria-label="Back to carrier selection" onClick={onBack}><CloseMark /></button>
          {editingRecipient ? <div className="recipient-editor"><span>for</span><KeyboardInput autoFocus aria-label="Who is this for?" value={recipient} placeholder="someone" autoComplete="off" onChange={(event) => onRecipient(event.target.value)} onBlur={onFinishRecipient} /><button type="button" onClick={onFinishRecipient}>done</button></div> : <button className="story-recipient" type="button" onClick={onEditRecipient}>for {recipient || "someone"}</button>}
          <button className="story-done" type="button" disabled={!canPreview} onClick={onPreview}>done <Mark /></button>
        </header>

        <AnimatePresence>
          {words.trim() && <CanvasLayer key="words" id="words" label="message" layout={layouts.words} selected={selectedLayer === "words"} onSelect={onSelectLayer} onLayout={onLayout} onRemove={onRemoveLayer} onEdit={onEditText}><p className="story-words-visual">{words}</p></CanvasLayer>}
          {pieces.includes("voice") && <CanvasLayer key="voice" id="voice" label="voice note" layout={layouts.voice} selected={selectedLayer === "voice"} onSelect={onSelectLayer} onLayout={onLayout} onRemove={onRemoveLayer}><div className="story-voice-visual"><Waveform /><span>10 sec · tap to hear me</span></div></CanvasLayer>}
          {pieces.includes("song") && <CanvasLayer key="song" id="song" label="song" layout={layouts.song} selected={selectedLayer === "song"} onSelect={onSelectLayer} onLayout={onLayout} onRemove={onRemoveLayer}><div className="story-song-visual"><span className="record-mark" aria-hidden="true" /><span>First Week Home</span></div></CanvasLayer>}
          {pieces.includes("drawing") && <CanvasLayer key="drawing" id="drawing" label="personal mark" layout={layouts.drawing} selected={selectedLayer === "drawing"} onSelect={onSelectLayer} onLayout={onLayout} onRemove={onRemoveLayer}><div className="story-drawing-visual"><PersonalMark /></div></CanvasLayer>}
        </AnimatePresence>

        <AnimatePresence>{showGestureHint && (words || pieces.some((piece) => piece !== "photo")) && <motion.p className="story-gesture-tip" initial={{ opacity: 0, transform: "translateY(5px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>move anything. turn the small handle.</motion.p>}</AnimatePresence>

        <StoryToolRail words={words} pieces={pieces} onText={onEditText} onCamera={onCamera} onToggleLayer={onToggleLayer} />
      </div>
    </motion.div>
  );
}

function CanvasLayer({ id, label, layout, selected, children, onSelect, onLayout, onRemove, onEdit }: { id: LayerId; label: string; layout: LayerLayout; selected: boolean; children: ReactNode; onSelect: (id: LayerId | null) => void; onLayout: (id: LayerId, layout: LayerLayout) => void; onRemove: (id: LayerId) => void; onEdit?: () => void }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ pointerId: -1, startAngle: 0, startRotation: 0, moved: false });
  const dragBounds = id === "words" ? { left: -20, right: 20, top: -270, bottom: 236 } : id === "drawing" ? { left: -116, right: 116, top: -270, bottom: 244 } : { left: -56, right: 56, top: -270, bottom: 244 };
  const clampPosition = (x: number, y: number) => ({
    x: Math.max(dragBounds.left, Math.min(dragBounds.right, x)),
    y: Math.max(dragBounds.top, Math.min(dragBounds.bottom, y)),
  });
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
  return (
    <motion.div ref={layerRef} className={`story-layer story-layer-${id} ${selected ? "is-selected" : ""}`} role="group" aria-label={`${label}. Drag to move; use the corner handle to rotate.`} tabIndex={0} drag dragConstraints={dragBounds} dragElastic={0.04} dragMomentum={false} style={{ x: layout.x, y: layout.y }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} onPointerDown={(event) => { event.stopPropagation(); onSelect(id); }} onDoubleClick={onEdit} onDragEnd={(_, info) => { const next = clampPosition(layout.x + info.offset.x, layout.y + info.offset.y); onLayout(id, { ...layout, ...next }); }} onKeyDown={(event) => {
      const movement = event.shiftKey ? 18 : 6;
      if (event.key === "ArrowLeft") onLayout(id, { ...layout, ...clampPosition(layout.x - movement, layout.y) });
      else if (event.key === "ArrowRight") onLayout(id, { ...layout, ...clampPosition(layout.x + movement, layout.y) });
      else if (event.key === "ArrowUp") onLayout(id, { ...layout, ...clampPosition(layout.x, layout.y - movement) });
      else if (event.key === "ArrowDown") onLayout(id, { ...layout, ...clampPosition(layout.x, layout.y + movement) });
      else if (event.key === "[") onLayout(id, { ...layout, rotation: layout.rotation - 6 });
      else if (event.key === "]") onLayout(id, { ...layout, rotation: layout.rotation + 6 });
      else if (event.key === "Delete" || event.key === "Backspace") onRemove(id);
      else return;
      event.preventDefault();
    }}>
      <div className="story-layer-paper" style={{ transform: `rotate(${layout.rotation}deg) scale(${layout.scale})` }}>
        {children}
        {selected && <><button className="story-layer-remove" type="button" aria-label={`Remove ${label}`} onPointerDown={(event) => event.stopPropagation()} onClick={() => onRemove(id)}><CloseMark /></button><button className="story-layer-rotate" type="button" aria-label={`Rotate ${label}`} onPointerDown={startRotate} onPointerMove={rotate} onPointerUp={finishRotate} onPointerCancel={finishRotate} onClick={() => { if (!rotationRef.current.moved) onLayout(id, { ...layout, rotation: layout.rotation + 12 }); }}><RotateMark /></button>{onEdit && <button className="story-layer-edit" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onEdit}>edit words</button>}</>}
      </div>
    </motion.div>
  );
}

function StoryToolRail({ words, pieces, onText, onCamera, onToggleLayer }: { words: string; pieces: PieceId[]; onText: () => void; onCamera: () => void; onToggleLayer: (id: Exclude<LayerId, "words">) => void }) {
  return (
    <div className="story-tool-dock">
      <Carousel ariaLabel="Things to add" contentClassName="story-tool-rail">
        <button type="button" aria-pressed={Boolean(words)} onClick={onText}><span className="story-aa" aria-hidden="true">Aa</span><span>words</span></button>
        <button type="button" onClick={onCamera}><CameraMark /><span>camera</span></button>
        {(["voice", "song", "drawing"] as const).map((piece) => <button key={piece} type="button" aria-pressed={pieces.includes(piece)} onClick={() => onToggleLayer(piece)}><MaterialIcon id={piece} /><span>{pieceLabels[piece]}</span></button>)}
      </Carousel>
    </div>
  );
}

function CapturedMedia({ capture, className = "", interactive = false }: { capture: CaptureAsset | null; className?: string; interactive?: boolean }) {
  if (!capture) return null;
  if (capture.kind === "sample") return <div className={`captured-media sample-capture ${className}`} role="img" aria-label="Illustrative sample moving-day moment"><span className="sample-window" /><span className="sample-box sample-box-one" /><span className="sample-box sample-box-two" /><small>sample moment</small></div>;
  if (!capture.url) return null;
  return capture.kind === "video" ? <video className={`captured-media ${className}`} src={capture.url} autoPlay={!interactive} loop={!interactive} muted={!interactive} controls={interactive} playsInline aria-label="Your captured video" /> : <img className={`captured-media ${className}`} src={capture.url} alt="Your captured moment" draggable={false} />;
}

function Preview({ recipient, words, pieces, capture, carrier, onEdit, onChangeCarrier, onGive }: { recipient: string; words: string; pieces: PieceId[]; capture: CaptureAsset | null; carrier: Carrier; onEdit: () => void; onChangeCarrier: () => void; onGive: () => void }) {
  return (
    <Page className="preview-page">
      <TopLine onBack={onEdit} label="edit the inside" />
      <div className="preview-identities"><span>for {recipient}</span><span>from {sender}</span></div>
      <motion.div className="sealed-preview" initial={{ opacity: 0, transform: "translateY(18px) rotate(-3deg) scale(0.95)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(0deg) scale(1)" }} transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}><CarrierIcon id={carrier.id} size="sealed" /><div className={`preview-peek ${capture ? "preview-peek-with-media" : ""}`} aria-hidden="true"><CapturedMedia capture={capture} className="preview-capture" /><span>{words ? `${words.slice(0, 28)}…` : "a moment made for you"}</span>{pieces.filter((piece) => piece !== "photo").slice(0, 2).map((piece) => <MaterialIcon key={piece} id={piece} />)}</div><PersonalMark /></motion.div>
      <div className="preview-copy"><h1>one thing, ready to give.</h1><p>{carrier.label}. Nothing inside appears until {recipient} opens it.</p></div>
      <button className="quiet-link" type="button" onClick={onChangeCarrier}>choose another way for it to arrive</button>
      <button className="drawn-action preview-next" type="button" onClick={onGive}>give this privately <Mark /></button>
    </Page>
  );
}

function Handoff({ recipient, copied, failed, onBack, onCopy, onFail, onFinish }: { recipient: string; copied: boolean; failed: boolean; onBack: () => void; onCopy: () => void; onFail: () => void; onFinish: () => void }) {
  return (
    <Page className="handoff-page">
      <TopLine onBack={onBack} label="back to the object" />
      <header><h1>{failed ? "the link did not make it." : `give this to ${recipient}.`}</h1><p>{failed ? "Nothing left this screen. Your object is still here." : "Send the link however you usually talk."}</p></header>
      <div className={`private-link ${failed ? "link-failed" : ""}`}><span>{failed ? "link unavailable" : "warm.local/for/maya-7a3c"}</span><button type="button" onClick={onCopy}>{copied ? "copied" : failed ? "try again" : "copy"}</button></div>
      <div className="handoff-doodle" aria-hidden="true"><svg viewBox="0 0 290 150"><path d="M12 112c50-78 92 16 145-40 41-44 78-18 118-49" /></svg><CarrierIcon id="ladybug" size="guide" /></div>
      {copied ? <button className="drawn-action" type="button" onClick={onFinish}>finish giving <Mark /></button> : <button className="quiet-link failure-test" type="button" onClick={onFail}>show the broken-link state</button>}
      <p className="system-note">Prototype link only. No account, delivery, storage, or receiver activity is connected.</p>
    </Page>
  );
}

function Sent({ recipient, carrier, onReceiver, onAgain, onLeave }: { recipient: string; carrier: Carrier; onReceiver: () => void; onAgain: () => void; onLeave: () => void }) {
  return (
    <Page className="sent-page">
      <div className="courier-flight" aria-hidden="true"><svg viewBox="0 0 320 230"><path d="M12 194c42-6 45-76 93-79 51-4 34 68 82 60 55-10 44-101 119-139" /></svg><motion.div initial={{ opacity: 0, transform: "translate3d(0, 168px, 0) rotate(-12deg)" }} animate={{ opacity: 1, transform: "translate3d(266px, 10px, 0) rotate(18deg)" }} transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}><CarrierIcon id="ladybug" size="guide" /></motion.div></div>
      <div className="sent-copy"><h1>that&apos;s it from you.</h1><p>{recipient} gets to choose what happens next. You do not have anything to check.</p><span>{carrier.shortLabel} chosen for this sample</span></div>
      <button className="drawn-action" type="button" onClick={onReceiver}>open the receiving demo <Mark /></button>
      <div className="sent-secondary"><button className="quiet-link" type="button" onClick={onAgain}>make another</button><button className="quiet-link" type="button" onClick={onLeave}>leave</button></div>
    </Page>
  );
}

function Arrival({ recipient, carrier, reduceMotion, onOpen, onDefer, onUnavailable }: { recipient: string; carrier: Carrier; reduceMotion: boolean; onOpen: () => void; onDefer: () => void; onUnavailable: () => void }) {
  return (
    <Page className={`arrival-page arrival-carrier-${carrier.id}`}>
      <header><span>for {recipient}</span><h1>{sender} made something private for you.</h1></header>
      <div className="arrival-object">{carrier.id === "bottle" ? <BottleOpening onOpen={onOpen} /> : carrier.id === "ladybug" ? <LadybugOpening reduceMotion={reduceMotion} onOpen={onOpen} /> : <SimpleOpening carrier={carrier} onOpen={onOpen} />}</div>
      <div className="arrival-options"><button className="quiet-link" type="button" onClick={onDefer}>another time</button><button className="quiet-link unavailable-link" type="button" onClick={onUnavailable}>this link is not for me</button></div>
    </Page>
  );
}

function BottleOpening({ onOpen }: { onOpen: () => void }) {
  const [progress, setProgress] = useState(0);
  const startY = useRef(0);
  const previousY = useRef(0);
  const previousTime = useRef(0);
  const velocity = useRef(0);
  const pointerId = useRef<number | null>(null);
  const dragged = useRef(false);
  const finish = () => { setProgress(1); navigator.vibrate?.(8); window.setTimeout(onOpen, 120); };
  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId.current = event.pointerId; startY.current = event.clientY; previousY.current = event.clientY; previousTime.current = performance.now(); velocity.current = 0; dragged.current = false; event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    const now = performance.now(); const delta = startY.current - event.clientY; const elapsed = Math.max(1, now - previousTime.current); velocity.current = (previousY.current - event.clientY) / elapsed; previousY.current = event.clientY; previousTime.current = now; if (Math.abs(delta) > 6) dragged.current = true; setProgress(Math.max(0, Math.min(1, delta / 104)));
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Runtime may release capture first. */ }
    if (!dragged.current || progress >= 0.72 || velocity.current > 0.45) finish(); else setProgress(0);
  };
  return (
    <div className="bottle-opening">
      <motion.div className="arrival-bottle" initial={{ opacity: 0.92, transform: "translate(-50%, 4px)" }} animate={{ opacity: 1, transform: ["translate(-50%, 4px)", "translate(-50%, -3px)", "translate(-50%, 0)"] }} transition={{ duration: 0.56, ease: [0.23, 1, 0.32, 1] }}><CarrierIcon id="bottle" size="arrival" /></motion.div>
      <button className="bottle-cork" type="button" data-scroll-drag="ignore" aria-label="Swipe the cork upward or press to open" style={{ transform: `translateY(${-progress * 82}px) rotate(${progress * 8}deg)` }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => { pointerId.current = null; setProgress(0); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); finish(); } }}><span aria-hidden="true" /></button>
      <p>pull the cork up<br /><small>or tap it once</small></p>
    </div>
  );
}

function LadybugOpening({ reduceMotion, onOpen }: { reduceMotion: boolean; onOpen: () => void }) {
  const [moving, setMoving] = useState(false);
  const guide = () => { if (moving) return; if (reduceMotion) { onOpen(); return; } setMoving(true); window.setTimeout(onOpen, 980); };
  return (
    <div className={`bug-opening ${moving ? "bug-moving" : ""}`}>
      <svg className="bug-path" viewBox="0 0 300 320" aria-hidden="true"><path d="M38 278C-4 202 56 152 126 190c60 33 121-2 96-62-21-51 10-86 49-99" /></svg>
      <button className="moving-bug" type="button" data-scroll-drag="ignore" onClick={guide} aria-label="Guide the ladybug home to open"><CarrierIcon id="ladybug" size="arrival" /></button>
      <p>tap the little courier<br />and follow it home</p>
      <button className="quiet-link direct-open" type="button" onClick={onOpen}>open without the journey</button>
    </div>
  );
}

function SimpleOpening({ carrier, onOpen }: { carrier: Carrier; onOpen: () => void }) {
  return <div className="simple-opening"><button type="button" onClick={onOpen} aria-label={`${carrier.action} and open`}><CarrierIcon id={carrier.id} size="arrival" /></button><p>{carrier.action}<br /><small>tap when ready</small></p></div>;
}

function Opening({ recipient }: { recipient: string }) {
  return (
    <motion.section className="opening-page" initial={{ clipPath: "circle(0% at 50% 52%)" }} animate={{ clipPath: "circle(145% at 50% 52%)" }} transition={{ duration: 0.48, ease: [0.77, 0, 0.175, 1] }} aria-label="Opening the private keepsake">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24, duration: 0.18 }}>for {recipient}</motion.p>
      <svg viewBox="0 0 220 90" aria-hidden="true"><path d="M8 62c47-8 61 13 101-18 40-31 61 4 103-24" /></svg>
    </motion.section>
  );
}

function Reveal({ recipient, words, pieces, capture, voiceState, songState, removeOpen, onVoice, onSong, onKeep, onClose, onRemove, onCancelRemove, onConfirmRemove }: { recipient: string; words: string; pieces: PieceId[]; capture: CaptureAsset | null; voiceState: Playback; songState: Playback; removeOpen: boolean; onVoice: () => void; onSong: () => void; onKeep: () => void; onClose: () => void; onRemove: () => void; onCancelRemove: () => void; onConfirmRemove: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <Page className="reveal-page">
      <header className="object-opening-copy"><span>for {recipient}</span>{words && <h1 ref={headingRef} tabIndex={-1}>{words}</h1>}<p>from {sender}</p></header>
      {capture && <motion.figure className="object-capture" data-scroll-drag="ignore" initial={{ opacity: 0, transform: "translateY(24px) rotate(-1.5deg)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(1deg)" }} transition={{ delay: 0.12, duration: 0.36, ease: [0.23, 1, 0.32, 1] }}><CapturedMedia capture={capture} interactive /><figcaption>{capture.kind === "video" ? "a moment you can return to." : "one small moment, kept here."}</figcaption></motion.figure>}
      {pieces.includes("photo") && <figure className="object-photo"><div className="moving-photo" role="img" aria-label="Sample photo of moving boxes in a new room"><span className="box-one" /><span className="box-two" /><span className="window-line" /></div><figcaption>the afternoon the boxes became furniture.</figcaption></figure>}
      {pieces.includes("voice") && <section className={`object-voice ${voiceState === "playing" ? "is-playing" : ""}`}><button type="button" onClick={onVoice} aria-label={voiceState === "playing" ? "Pause voice note" : "Play voice note"}><Waveform /><span>{voiceState === "playing" ? "pause voice" : voiceState === "played" ? "play again" : "play 10 sec"}</span></button><p><span>transcript</span> “I just wanted you to know that you made all of it easier.”</p></section>}
      {pieces.includes("song") && <section className="object-song"><button type="button" onClick={onSong} aria-label={songState === "playing" ? "Pause First Week Home" : "Play First Week Home"}><span className={`record-mark ${songState === "playing" ? "record-playing" : ""}`} aria-hidden="true" /><span><strong>First Week Home</strong><small>{songState === "playing" ? "playing · tap to pause" : "tap to play"}</small></span></button></section>}
      {pieces.includes("drawing") && <div className="object-mark"><PersonalMark /><span>you made a strange place feel ours.</span></div>}
      <footer className="receiver-ending">
        <h2>what should this become?</h2>
        {removeOpen ? <div className="remove-confirm" role="alert"><p>Remove this from your private cabinet? {sender} will not be told.</p><button type="button" onClick={onConfirmRemove}>remove it</button><button type="button" onClick={onCancelRemove}>leave it here</button></div> : <div className="ending-actions"><button type="button" onClick={onKeep}><MaterialIcon id="photo" /><span>keep</span></button><button type="button" onClick={onClose}><span className="ending-x" aria-hidden="true">×</span><span>close</span></button><button type="button" onClick={onRemove}><span className="ending-remove" aria-hidden="true" /><span>remove</span></button></div>}
      </footer>
    </Page>
  );
}

function Cabinet({ kept, recipient, carrier, removeOpen, onOpen, onMake, onClose, onRemove, onCancelRemove, onConfirmRemove }: { kept: boolean; recipient: string; carrier: Carrier; removeOpen: boolean; onOpen: () => void; onMake: () => void; onClose: () => void; onRemove: () => void; onCancelRemove: () => void; onConfirmRemove: () => void }) {
  return (
    <Page className="cabinet-page">
      <header><button className="navy-back" type="button" onClick={onClose}><Mark direction="left" /> close</button><h1>things you kept.</h1></header>
      <div className="cabinet-field">
        {kept ? <motion.div className="cabinet-object" initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}><button type="button" onClick={onOpen} aria-label={`Open kept object from ${sender} for ${recipient}`}><CarrierIcon id={carrier.id} size="cabinet" /><span>from {sender}<small>the moving week</small></span></button>{removeOpen ? <div className="cabinet-remove"><p>Remove it? {sender} will not be told.</p><button type="button" onClick={onConfirmRemove}>remove</button><button type="button" onClick={onCancelRemove}>cancel</button></div> : <button className="cabinet-remove-link" type="button" onClick={onRemove}>remove from here</button>}</motion.div> : <div className="empty-cabinet"><svg viewBox="0 0 240 190" aria-hidden="true"><path d="M20 152c51-7 57-82 107-79 45 3 44 56 92 39M42 167h171" /></svg><p>nothing kept here yet.</p></div>}
      </div>
      <button className="navy-action" type="button" onClick={onMake}>make something new <Mark /></button>
    </Page>
  );
}

function QuietExit({ title, body, action, onAction, onLeave }: { title: string; body: string; action: string; onAction: () => void; onLeave: () => void }) {
  return <Page className="quiet-exit-page"><div><h1>{title}</h1><p>{body}</p></div><button className="drawn-action" type="button" onClick={onAction}>{action} <Mark /></button><button className="quiet-link" type="button" onClick={onLeave}>leave</button></Page>;
}

function Removed({ onLeave, onRestore }: { onLeave: () => void; onRestore: () => void }) {
  return <Page className="removed-page"><svg viewBox="0 0 280 220" aria-hidden="true"><path d="M18 168c64 10 71-106 149-72 46 20 46 68 91 39" /></svg><div><h1>gone from your cabinet.</h1><p>No signal went back to {sender}.</p></div><button className="navy-action" type="button" onClick={onRestore}>restore this sample <Mark /></button><button className="navy-back" type="button" onClick={onLeave}>leave</button></Page>;
}

function TopLine({ onBack, label }: { onBack: () => void; label: string }) {
  return <div className="top-line"><button type="button" onClick={onBack}><Mark direction="left" /> {label}</button><span>warm &amp; fuzzies</span></div>;
}

function CarrierIcon({ id, size }: { id: CarrierId; size: "hero" | "thumb" | "guide" | "sealed" | "arrival" | "cabinet" }) {
  return (
    <svg className={`carrier-icon carrier-icon-${id} carrier-icon-${size}`} viewBox="0 0 180 210" aria-hidden="true" data-asset-slot={`carrier-${id}`}>
      {id === "bottle" && <><path d="M73 19c7 3 25 3 33 0l2 29c22 15 33 34 32 65l-4 70c-22 10-71 10-93-1l-3-68c-2-31 9-51 31-66z" /><path d="M70 18c8-7 31-7 38 0M59 93c24 8 45 7 67-1M51 151c27 11 51 10 78-1" /><path className="icon-fill" d="M51 151c26 10 51 10 78-1l-2 28c-21 8-53 8-73 0z" /><path d="M72 55c15 7 26 7 39 0" /></>}
      {id === "ladybug" && <><path d="M88 55c-36 0-54 34-48 75 6 40 30 60 50 60 23 0 48-24 52-63 3-39-17-72-54-72z" /><path d="M88 57c1 42 1 84 1 130M54 45c12-19 55-19 69 1M57 81l-17-16M121 82l20-17M47 132l-24 12M132 133l24 12" /><path className="icon-fill" d="M54 45c11-19 55-19 69 1-17 18-49 19-69-1z" /><circle className="icon-dot" cx="64" cy="92" r="7" /><circle className="icon-dot" cx="112" cy="91" r="8" /><circle className="icon-dot" cx="62" cy="139" r="8" /><circle className="icon-dot" cx="114" cy="143" r="7" /></>}
      {id === "plane" && <><path d="M19 112L158 40l-37 137-37-45-35 21 10-42z" /><path d="M59 111l99-71M84 132l74-92M49 153l35-21" /><path className="icon-fill" d="M19 112l40-1 99-71-74 92z" /></>}
      {id === "flowers" && <><path d="M89 179c-7-42-6-83-1-122M85 118c-21-31-44-44-63-40M91 130c23-31 47-43 67-36M84 154c-19-12-36-13-52-7M95 159c18-12 34-14 49-9" /><path d="M76 45c-24-2-30-22-18-32 10-8 24-1 29 12 7-17 25-20 33-8 8 13-4 27-21 29 15 9 14 27 2 34-14 8-25-4-27-18-9 13-27 14-34 2-7-12 4-25 20-25z" /><path d="M138 88c-14-1-21-13-13-22 7-7 17-2 22 7 4-12 17-14 23-5 5 9-3 19-15 21 10 6 9 18 1 23-10 5-18-3-19-12-7 9-18 8-23 1-4-8 3-16 14-17z" /><path d="M22 80c-12-1-18-11-11-19 6-6 15-1 18 6 4-10 15-12 20-4 4 8-3 16-13 17 8 5 8 15 0 19-8 4-15-2-16-10-5 8-15 7-19 1-4-7 2-14 12-15z" /><path className="icon-fill" d="M48 151c18 17 60 24 96 2l-17 43c-22 8-45 6-65-1z" /></>}
    </svg>
  );
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
