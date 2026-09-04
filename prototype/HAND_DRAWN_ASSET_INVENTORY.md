<!-- Production checklist for Cecelia's hand-drawn assets for the exploratory friendship-appreciation prototype. -->
# Hand-drawn asset inventory

> This inventory supports the swappable asset architecture in [the canonical product specification](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md). An item should enter the prototype only when it clarifies authorship, arrival, opening, ownership, or ending.

## Read this first

- **Status:** exploratory prototype kit, not a locked product brand. The current concept is a deliberately authored, receiver-owned digital keepsake for ordinary-day friendship appreciation.
- **Confirmed visual sources:** Ethan's supplied `grug.` reference, handwriting moodboard, and book-cover palette board: sparse paper fields, black single-weight line work, uneven hand-lettering, generous empty space, small imperfect marks, and muted blocks of sage, rust, olive, deep blue, oxblood, amber, tan, and cream.
- **Transcript anchors:** visible human effort; the broader concept may eventually support writing, photographs, voice, music, video and drawing; the P0 object uses writing plus at most one photo or voice material; the receiver controls whether it is kept; opening should feel like receiving an object, not entering a chat.
- **Do not claim a Figma reading:** the Figma MCP live canvas could not be re-read because of the Starter-plan call limit. This list is grounded in the three user-provided reference images and transcripts only. Do a short delta pass against the actual Figma file when the connector resets.
- **Prototype warning:** all current HTML icons are temporary stand-ins. Replace only after the P0 kit arrives; do not treat their geometry as a style reference.
- **Typeface decision:** the prototype uses Ethan's existing `uglyhandwriting.ttf` (`uglyhandwriting`, Medium; metadata credits MyScriptFont). Cecelia does not need to redraw a full alphabet. Her lettering work is the eventual product wordmark and any deliberately custom short labels.

## Visual grammar and export rules

- **Line:** black `#151515`, 2.25–2.75 px at a 24 px icon canvas; rounded caps and joins; one intentional wobble or asymmetry per mark. Never use a perfectly geometric SVG outline as the final.
- **Space:** warm paper or transparent fields. The object gets breathing room; avoid shadows, gradients, badges, sticker collisions or “cute” clutter.
- **Shape:** one clear idea per icon. Use incomplete contours, slightly off-centre balance and human rhythm, but retain instant recognition at 20 px.
- **Type vs drawing:** wording stays selectable interface type set in `uglyhandwriting`. Cecelia's custom lettering is reserved for the eventual wordmark, one or two short emotional labels, and optional object inscriptions; do not rasterise paragraphs, controls or accessibility-critical copy.
- **Colour:** black ink remains constant. Each object or state gets one dominant book-cover field and at most one support colour. Working swatches: paper `#f2ead5`, sage `#9aa99b`, rust `#9e5a24`, olive `#73744e`, deep blue `#183b49`, oxblood `#651d25`, amber `#cf842b`, tan `#cdbb9d`. Do not put the whole palette on one screen.
- **Accessibility:** pair any non-obvious icon with visible text or an accessible name. All touch targets remain at least 44 × 44 CSS px even if the drawn icon is smaller.
- **Masters:** draw as editable vector paths in one SVG master per asset, on a transparent canvas. Expand strokes only for final export if the platform requires it; retain the editable-stroke master.
- **Previews:** export transparent PNG previews at 3× (for example, a 24 px icon becomes 72 × 72 px). Do not bake a white square behind artwork.
- **Naming:** `keepsake-[area]-[asset]-[state]-v01.svg` and matching `.png`; lowercase kebab case. Examples: `keepsake-nav-cabinet-selected-v01.svg`, `keepsake-open-envelope-sealed-v01.svg`. Do not use `grug` in product filenames; it is a reference, not this product's brand.

## Priority 0 — first build / critical experience

| Asset | Exact canvas / optical constraint | Needed states | Screen / use |
| --- | --- | --- | --- |
| `wordmark-working` | 176 × 64; live area ~154 × 42; use a neutral working label until naming is settled; do not imitate the `grug.` wordmark | primary; compact | Home/reveal footer and prototype loading state |
| `action-make` | 36 × 52 total control; a clear hand-drawn making mark, optically centred | idle; pressed; disabled | Primary compose/start action |
| `action-back` | 24 × 24; a single bent arrow or loosened line, not a system chevron clone | idle; pressed | Creation and viewer back action |
| `action-close` | 24 × 24; loose x with unequal arms | idle; pressed | Modal / media tray close |
| `open-envelope` | 240 × 176; line-only envelope with oversized flap; allow 16 px safe area | sealed; flap-lift; open; empty/opened | Receiver entry and reveal; one of the core emotional objects |
| `letter-sheet` | 232 × 320; slightly irregular paper edge; no faux paper texture | resting; rising; fully-read; archived | Receiver reading state; content container for the sender’s words |
| `piece-seal` | 48 × 48; simple sender mark or wax-seal state cue, not ornate stationery | sealed; pressed; opened | Makes unopened/opened state legible |
| `sender-stamp-frame` | 64 × 48; irregular stamp frame with room for a short live-text initial or mark | blank; marked | Personal authorship cue without rasterising copy |
| `media-photo` | 28 × 28; imperfect landscape frame with one offset horizon/sun dot | add; populated; remove | Composer media tray and piece content |
| `media-voice` | 28 × 28; one drawn waveform / spoken line—not a microphone outline copied from a system set | add; recording; recorded; playback; muted/error | Composer and receiver playback |
| `media-playback` | 28 × 28; related play, pause, and replay marks | play; pause; replay; unavailable | Receiver voice controls |
| `action-edit` | 24 × 24; loose pencil/annotation mark | idle; pressed | Preview return-to-edit action |
| `action-share` | 24 × 24; clear transfer/link mark, not a social-network logo | idle; copied; error | Simulated private-link transfer |
| `action-keep` | 24 × 24; a piece settling into a shallow holder | idle; kept | Receiver-owned optional persistence |
| `action-discard` | 24 × 24; plain removal mark without a sad face or moral warning | idle; confirm; removed | Receiver-private discard path |
| `feedback-sent` | 72 × 72; finite object at rest, with no receiver-status indicator | appearing; complete | Sender terminal state; explicitly no open/read/keep tracking |
| `feedback-error` | 44 × 44; gently broken thread / loose paper corner; must not feel alarming | default | Send/upload failure and recovery |

## Priority 1 — makes the artefact feel deliberately composed

| Asset | Exact canvas / optical constraint | Needed states | Screen / use |
| --- | --- | --- | --- |
| `arrival-firefly` | 48 × 48; one quiet light-carrying mark; no swarm, particles, pet behaviour, or copied insect mascot | resting; arrival; static reduced-motion | Optional receiver-arrival cue only if it clarifies attention |
| `reply-free-note` | 24 × 24 + live test-copy label; an open ending rather than a heart | default | Optional explicit-closure experiment, disabled in the structural-closure condition |
| `state-empty-shelf` | 160 × 152; one deliberate open space, not a sad character illustration | empty | Optional receiver archive branch |
| `state-kept-piece` | 64 × 64; a tucked object or labelled shelf tab | default; selected | Optional archive item and post-open confirmation |
| `object-voice-tape` | 72 × 72; waveline or cassette-inspired strip; avoid nostalgic skeuomorphism | idle; playing; complete | Voice segment |
| `object-photo` | 72 × 72; uneven photo frame with a quiet crop edge | idle; open; unavailable | Photo segment |
| `shelf-container` | 144 × 144; sparse shelf/holder with one clear slot | empty; containing-one | Archive transition only if persistence survives testing |
| `divider-short`, `divider-long` | 96 × 16 and 180 × 16; single imperfect ink strokes | default | Sparse separation without adding cards or decoration |
| `recipient-avatar-placeholder` | 64 × 64; a neutral hand-drawn silhouette/frame; no generated face | default | Sender selects recipient / preview only |
| `revisit-marker` | 24 × 24; a tucked corner / return arrow made from one line | default; selected | Archive item and “keep this” action |
| `share-link` | 24 × 24; chain made of imperfect paper loops, not generic chain icon | idle; copied; error | Sender delivery link |
| `privacy-lock` | 24 × 24; minimally drawn lock, visibly human but still universally legible | default | Private/receiver-owned explanation |

## Priority 2 — only after the flow proves it needs them

| Asset | Purpose / constraint |
| --- | --- |
| `theme-young-couple`, `theme-grandparent`, `theme-overseas-friend` | Do **not** draw illustrative personas now. These were transcript prompts, not chosen audiences. If used, create abstract object cues, never tokenised people. |
| `open-at-home` | A home/arrival cue for an “open when you are home” option. Keep only if testing shows anticipation helps rather than feels coercive. |
| `occasion-birthday` | A small gift/candle cue for the transcript’s birthday-letter example. It must not make the product occasion-only. |
| `returning-light` | An optional non-verbal acknowledgement. Build only if reply debt and consent rules are resolved. |
| `sticker-set` | 6–10 tiny personal marks supplied by the sender. Never make a generic “sticker pack”; each must be style-compatible and sparse. |
| `custom-handwriting-sample` | A scanning/onboarding cue. Do not build around custom-font generation; transcripts correctly questioned whether it creates fake effort. |
| `package-bottle`, `package-bird`, `package-stork`, `package-capsule` | Packaging/mascot branches only. Do not draw as a set until one metaphor is selected for a meaningful interaction reason; a literal delivery animal is not automatically distinctive. |
| `media-music`, `media-draw`, `media-video` | Broader composition branches after the writing + one-material rule has been tested. |
| `physical-mail-compare` | Deck/research comparison graphic, not product UI. Keep separate from the app kit. |

## Interaction-state map

| Moment | The asset work needed |
| --- | --- |
| Sender begins a piece | Working wordmark, compose/start, recipient placeholder |
| Sender adds personal material | Photo or voice; add/populated/remove/failed states |
| Sender sends without creating a chat thread | Finite completion, copied-link/error states, and no receiver telemetry |
| Receiver encounters it | Known-sender arrival, sealed object, optional firefly mark |
| Receiver opens | Envelope flap lifts → letter rises → handwritten content appears. These are explanatory key poses, not decorative animation. |
| Receiver experiences media | Photo description or voice play/pause/replay/unavailable states |
| Receiver is not obligated to perform a reply | No reply infrastructure; optional explicit-closure mark is a separate test variant |
| Receiver keeps/revisits | Keep, close, and discard marks; shelf states only in the persistence branch |
| Something fails | Upload/send/expired-link errors use the broken-thread/paper-corner family and pair with clear recovery text |

## Motion key poses for Cecelia

- **Envelope reveal (P0):** `sealed` → flap tilted up roughly 22° → letter edge appears → letter rises 70–95 px → content rests. Draw the four poses; engineering can interpolate with gentle ease. No bounce, confetti, particles or fake paper physics.
- **Writing reveal (P1 / experimental):** blank line → 30% text shown → a single plausible correction/backspace → final words. Only use if the sender actually authored the message and it does not imply live presence or surveillance.
- **Cabinet (P1):** closed irregular doors → 10 px opening crack → open, with one piece visible. The receiver moves toward their keepsake; no infinite scrolling motion.
- **Sender completion (P0):** object settles → link becomes available → static complete state. Never animate a receiver opening or responding on the sender’s screen.
- **Voice playback (P0):** resting waveform → 2–3 changed line positions → resting. No equaliser that implies audio analysis.
- **Motion delivery:** SVG master, plus a labelled 4–6 frame PNG contact sheet if the developer needs to reproduce the sequence. Include state names and intended order; no need for an animated GIF.

## Do not draw

- A generic AI-logo mark, sparkle, star, heart, smiley, blob, bento-card decoration, fake grain, “paper” texture, gradient, glow, sticker explosion, or all eight palette colours competing on one screen.
- System-symbol clones for every control; where an established convention is needed (close, back, play, save), keep it legible but redraw it in this line grammar.
- A library of random doodles. Every asset must map to a real flow, an emotional object or an accessibility-critical state.
- Handwritten body copy, a faux “personal” font generated from a person’s handwriting, or handwriting that pretends the sender physically wrote something they did not.
- Illustrated demographic personas, romance-coded symbols, crisis/farewell cues, or a gendered visual language. The product must not presuppose who deserves care or what the relationship is.
- Bird, stork, carrier pigeon, bottle, capsule, and firefly as a simultaneous mascot/package menu. They communicate unrelated worlds and would make the prototype look assembled rather than authored.
- Any asset that turns a receiver’s private moment into a gamified streak, reaction metric, reply counter or social feed.

## First 60-minute batch

1. **0–10 min — line calibration:** one page with 10–12 test strokes beside the actual `uglyhandwriting` font, a neutral working wordmark, and a rejected overly-polished version. Lock stroke weight, degree of irregularity, and how drawings sit beside the type.
2. **10–25 min — opening object:** envelope in sealed/open states plus the letter sheet in resting/rising states. This is the emotional centre and the first handoff.
3. **25–40 min — core actions:** make, back, close, edit, share, play/pause/replay, keep, and discard. Test all at 20 px and 28 px; redraw any that need a label to be understood.
4. **40–52 min — composer media:** photo and voice only, including populated and unavailable states.
5. **52–60 min — authorship and ending:** sender stamp frame, static completed-object state, and keep/close/discard marks. Sketch the firefly only if time remains and its arrival job is clear.

**60-minute done condition:** one shared transparent SVG sheet or one SVG per P0 asset, matching 3× PNG previews, filenames applied, and the envelope/letter/nav set readable at phone scale. Do not spend this hour on P2 themes or decorative details.

## Handoff checklist

- [ ] SVG masters are transparent, editable and use the agreed naming convention.
- [ ] Each SVG has a matching 3× transparent PNG preview.
- [ ] Every asset is labelled with `P0`, `P1` or `P2`, canvas size and state.
- [ ] Envelope, letter, cabinet, media and navigation share one stroke, corner and imperfection language.
- [ ] Icons are tested at their intended on-screen size; controls retain 44 × 44 px touch areas in implementation.
- [ ] All icon-only controls have a text label, tooltip or accessible name specified for engineering.
- [ ] Motion contact sheets identify pose order, not just attractive frames.
- [ ] Any courier/package/mascot branch not selected for a specific interaction job is absent from P0 exports.
- [ ] HTML prototype icons are replaced only after Cecelia confirms the P0 set; keep temporary icons clearly marked until then.
- [ ] Team runs the Figma delta pass after the MCP connector resets and logs any mismatch with the live file rather than retroactively claiming this inventory came from it.
- [ ] A human visual lead reviews a real phone render for sparse ink, restrained book-cover colour, logo-swap risk and generic-doodle drift before this becomes final art direction.
