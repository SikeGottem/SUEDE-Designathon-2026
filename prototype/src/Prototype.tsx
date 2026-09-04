// Implements the transcript-led maker, carrier, handoff, and receiver experience inside the protected mobile runtime.
import {
  useEffect,
  useRef,
  useState,
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

export default function Prototype() {
  const [phase, setPhase] = useState<Phase>("home");
  const [carrierId, setCarrierId] = useState<CarrierId>("bottle");
  const [recipient, setRecipient] = useState("Maya");
  const [reason, setReason] = useState("you made moving feel less scary");
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
  const keyboard = useKeyboard();
  const reduceMotion = useReducedMotion();
  const carrier = carriers.find((item) => item.id === carrierId) ?? carriers[0];

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

  const togglePiece = (piece: PieceId) => {
    setPieces((current) =>
      current.includes(piece)
        ? current.filter((candidate) => candidate !== piece)
        : [...current, piece],
    );
  };

  const resetDraft = () => {
    setRecipient("Maya");
    setReason("you made moving feel less scary");
    setWords(
      "You made the first week in a new place feel familiar. You noticed what I needed before I knew how to ask.",
    );
    setCarrierId("bottle");
    setPieces(["photo"]);
    setCuesOpen(false);
    setCopied(false);
    setShareFailed(false);
    setVoiceState("idle");
    setSongState("idle");
    go("carrier");
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

  const canPreview = recipient.trim() !== "" && reason.trim() !== "" && words.trim() !== "";
  const navyPhase = ["opening", "reveal", "cabinet", "removed"].includes(phase);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScroll
        key={phase}
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
              <Studio key="studio" recipient={recipient} reason={reason} words={words} pieces={pieces} cuesOpen={cuesOpen} canPreview={canPreview} onRecipient={setRecipient} onReason={setReason} onWords={setWords} onTogglePiece={togglePiece} onToggleCues={() => setCuesOpen((current) => !current)} onBack={() => go("carrier")} onPreview={() => go("preview")} />
            )}
            {phase === "preview" && (
              <Preview key="preview" recipient={recipient} words={words} pieces={pieces} carrier={carrier} onEdit={() => go("studio")} onChangeCarrier={() => go("carrier")} onGive={() => go("handoff")} />
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
              <Reveal key="reveal" recipient={recipient} words={words} pieces={pieces} voiceState={voiceState} songState={songState} removeOpen={removeOpen} onVoice={() => setVoiceState((current) => current === "playing" ? "played" : "playing")} onSong={() => setSongState((current) => current === "playing" ? "played" : "playing")} onKeep={() => { setKept(true); go("cabinet"); }} onClose={() => go("deferred")} onRemove={() => setRemoveOpen(true)} onCancelRemove={() => setRemoveOpen(false)} onConfirmRemove={() => { setKept(false); go("removed"); }} />
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

function Studio({ recipient, reason, words, pieces, cuesOpen, canPreview, onRecipient, onReason, onWords, onTogglePiece, onToggleCues, onBack, onPreview }: { recipient: string; reason: string; words: string; pieces: PieceId[]; cuesOpen: boolean; canPreview: boolean; onRecipient: (value: string) => void; onReason: (value: string) => void; onWords: (value: string) => void; onTogglePiece: (piece: PieceId) => void; onToggleCues: () => void; onBack: () => void; onPreview: () => void }) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  return (
    <Page className="studio-page">
      <TopLine onBack={onBack} label="change the carrier" />
      <header className="studio-heading"><h1>make one page.</h1><button className="quiet-link" type="button" aria-expanded={cuesOpen} onClick={onToggleCues}>{cuesOpen ? "hide prompts" : "need a small prompt?"}</button></header>
      <AnimatePresence>{cuesOpen && <motion.div className="cue-scribble" initial={{ opacity: 0, transform: "translateY(-4px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} exit={{ opacity: 0, transform: "translateY(-4px)" }} transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}><span>a favourite memory</span><span>what they taught you</span><span>one small thing you notice</span></motion.div>}</AnimatePresence>
      <motion.div ref={workspaceRef} className="maker-workspace" aria-label="Your paper sheet" initial={{ opacity: 0, transform: "translateY(10px) rotate(-0.35deg)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(-0.35deg)" }} transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
        <div className="sheet-anchors">
          <label><span>for</span><KeyboardInput aria-label="Who is this for?" value={recipient} onChange={(event) => onRecipient(event.target.value)} autoComplete="off" /></label>
          <label><span>because</span><KeyboardInput aria-label="What made you think of them?" value={reason} onChange={(event) => onReason(event.target.value)} autoComplete="off" /></label>
        </div>
        <label className="words-piece"><span>what do you want them to know?</span><KeyboardTextarea aria-label="Your words" value={words} onChange={(event) => onWords(event.target.value)} /></label>
        {pieces.includes("photo") && <DraggablePiece className="placed-photo" constraints={workspaceRef} onRemove={() => onTogglePiece("photo")} label="photo"><div className="moving-photo" role="img" aria-label="Sample photo of moving boxes in a new room"><span className="box-one" /><span className="box-two" /><span className="window-line" /></div><figcaption>first week home</figcaption></DraggablePiece>}
        {pieces.includes("voice") && <DraggablePiece className="placed-voice" constraints={workspaceRef} onRemove={() => onTogglePiece("voice")} label="voice note"><Waveform /><span>10 sec · “you made it easy”</span></DraggablePiece>}
        {pieces.includes("song") && <DraggablePiece className="placed-song" constraints={workspaceRef} onRemove={() => onTogglePiece("song")} label="song"><span className="record-mark" aria-hidden="true" /><span>First Week Home</span></DraggablePiece>}
        {pieces.includes("drawing") && <DraggablePiece className="placed-drawing" constraints={workspaceRef} onRemove={() => onTogglePiece("drawing")} label="drawing"><PersonalMark /></DraggablePiece>}
        {pieces.length > 0 && <p className="drag-hint">hold a piece to move it.</p>}
      </motion.div>
      <section className="material-area" aria-labelledby="material-heading">
        <div className="material-heading"><h2 id="material-heading">add something</h2><span>swipe</span></div>
        <Carousel ariaLabel="Things to add to the page" className="material-carousel" contentClassName="material-tray" showScrollbar>
          {(Object.keys(pieceLabels) as PieceId[]).map((piece) => <button key={piece} type="button" aria-pressed={pieces.includes(piece)} onClick={() => onTogglePiece(piece)}><MaterialIcon id={piece} /><span>{pieceLabels[piece]}</span></button>)}
        </Carousel>
      </section>
      <button className="drawn-action studio-next" type="button" disabled={!canPreview} onClick={onPreview}>see the whole thing <Mark /></button>
    </Page>
  );
}

function DraggablePiece({ children, className, constraints, label, onRemove }: { children: ReactNode; className: string; constraints: React.RefObject<HTMLDivElement | null>; label: string; onRemove: () => void }) {
  return (
    <motion.figure className={`placed-piece ${className}`} drag dragConstraints={constraints} dragElastic={0.08} dragMomentum={false} data-scroll-drag="ignore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
      <button className="piece-remove" type="button" aria-label={`Remove ${label}`} onClick={onRemove}>×</button>{children}
    </motion.figure>
  );
}

function Preview({ recipient, words, pieces, carrier, onEdit, onChangeCarrier, onGive }: { recipient: string; words: string; pieces: PieceId[]; carrier: Carrier; onEdit: () => void; onChangeCarrier: () => void; onGive: () => void }) {
  return (
    <Page className="preview-page">
      <TopLine onBack={onEdit} label="edit the inside" />
      <div className="preview-identities"><span>for {recipient}</span><span>from {sender}</span></div>
      <motion.div className="sealed-preview" initial={{ opacity: 0, transform: "translateY(9px) rotate(-1deg)" }} animate={{ opacity: 1, transform: "translateY(0) rotate(0deg)" }} transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}><CarrierIcon id={carrier.id} size="sealed" /><div className="preview-peek" aria-hidden="true"><span>{words.slice(0, 28)}…</span>{pieces.slice(0, 3).map((piece) => <MaterialIcon key={piece} id={piece} />)}</div><PersonalMark /></motion.div>
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

function Reveal({ recipient, words, pieces, voiceState, songState, removeOpen, onVoice, onSong, onKeep, onClose, onRemove, onCancelRemove, onConfirmRemove }: { recipient: string; words: string; pieces: PieceId[]; voiceState: Playback; songState: Playback; removeOpen: boolean; onVoice: () => void; onSong: () => void; onKeep: () => void; onClose: () => void; onRemove: () => void; onCancelRemove: () => void; onConfirmRemove: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <Page className="reveal-page">
      <header className="object-opening-copy"><span>for {recipient}</span><h1 ref={headingRef} tabIndex={-1}>{words}</h1><p>from {sender}</p></header>
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
