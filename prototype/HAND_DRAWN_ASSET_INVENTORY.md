<!-- This is Cecelia's swappable hand-drawn asset handoff for the current friendship-appreciation prototype. -->
# Hand-drawn asset inventory

> Make the object language, not a decorative icon pack. Every asset must clarify making, arrival, opening, receiving, ownership, or ending.

## Read this first

- **Status:** exploratory asset kit for a reversible prototype. The icons below are not final branding and their inclusion is not user validation.
- **Current source:** the executable React/Vite flow is in `prototype/src/`. Its code uses provisional SVG slots (`data-asset-slot`) so Cecelia's artwork can replace individual marks without changing the interaction model.
- **Current source cut:** 39 transcript captures, the conceptual spec, supplied product wireframes, the white/navy `warm & fuzzies` visual reference, and the earlier handwriting/palette references.
- **Latest direction wins:** the current scoped test starts with a full-screen paper-first Story-like creator, then shows a small carrier browse (bottle, firefly, paper plane), no bottom navigation, and a white-to-navy opening threshold. Story-like means ease and direct manipulation, not capture-first camera chrome, Instagram branding, or social behaviour. Camera/media is optional and lands as a small Polaroid-like material; drawing is real freehand doodling; a small exploratory colour system and a few purposeful hand-drawn sticker materials make the page feel like a scrapbook. Writing remains central. The unfold reveals the composed content on the object itself, rather than a blank interstitial before a separate reveal. This supersedes the earlier carrier-before-composition, flower-carrier, and one-sealed-object/no-picker constraints only for this test.
- **Figma boundary:** this inventory does not claim a live Figma read. The Figma MCP Starter-plan limit blocked a new canvas read; use Figma later for a short visual delta pass, not as a replacement for the transcript-led code and team review.
- **Home firefly source:** `public/assets/illustrations/cecilia/firefly-line-b1.png` is Cecelia's supplied transparent B1 master and is now wired into Home and the favicon. The earlier screenshot crop is retired and must not ship.
- **Typeface:** use Gaegu as the working Ugly Dave-like companion. Cecelia does not need to draw a full typeface. Hand-lettering is best reserved for the final wordmark and a very small number of short intentional labels.
- **Human authorship:** artwork may be handmade; intimate written/voice content must remain the sender's own. Do not make fake personal handwriting or AI-generated evidence of effort.
- **Provisional geometry:** the current code SVGs are explicitly temporary. Replace the visual-critical carrier, material, opening, keep, and cabinet marks with team-drawn masters before calling the visual language resolved.

## Cecelia source import — 5 September 2026

The following PNGs were copied **byte-for-byte, without raster editing**, from `/Users/ethanwu/Downloads/Warm and Fuzzy- Firefly Logo Assets/` into `public/assets/illustrations/cecilia/`. Each supplied file is 1000 × 1000 px, uses an sRGBA PNG channel set, and has non-opaque pixels (transparent background). The imported PNGs are source assets, not a license to invent missing states or use the artwork outside the listed roles.

| Supplied original | Imported path | SHA-256 | What the drawing actually shows | Safe prototype use now |
| --- | --- | --- | --- | --- |
| `B1.png` | `cecilia/firefly-line-b1.png` | `1140011b…b682d4a` | Outline firefly | Home signature; carrier-picker icon; static cabinet silhouette. Do not use as the flight animation body when the filled states are available. |
| `F1.png` | `cecilia/firefly-filled-f1.png` | `583944ce…1f49bb3` | Filled firefly with wings | Filled firefly / wing-state candidate for picker and courier rest/pickup. The source does not label the wing pose, so do not claim a specific up/down state until Cecelia confirms it. |
| `F2.png` | `cecilia/firefly-filled-f2.png` | `990b5590…2b10033` | Filled firefly with wings | Second filled firefly / wing-state candidate for pickup, flight, and drop. Treat it as an alternate drawing, not proof of a particular animation phase. |
| `W1.png` | `cecilia/firefly-wing-w1.png` | `6d387dd4…8d9d60` | Separate outlined wing | Component source only: may be composited with the firefly body for an explicit wing animation after scale/anchor review. Not a standalone product icon. |
| `W2.png` | `cecilia/firefly-wing-w2.png` | `d23e8daa…dbffb3` | Separate outlined wing | Second wing component source for the same constrained animation use. Not a standalone product icon. |
| `ggggg.png` | `cecilia/firefly-carrying-envelope.png` | `ae0567ab…fa932f` | Filled firefly carrying a small envelope | Courier pickup, slow flight, and central drop only. It is not a persistent helper, navigation mascot, or carrier-picker replacement. |
| `Mail.02.png` | `cecilia/envelope-mail-02.png` | `3403c00a…040524` | Closed outlined envelope | Envelope-design stage, sealed-preview exterior, post-fold handoff, and cabinet object. |
| `bottle.2.png` | `cecilia/bottle-intact.png` | `8aae3940…ddf13c` | Intact corked bottle | Bottle picker, sealed preview, handoff, arrival, and cabinet. |
| `Broken Bottle.png` | `cecilia/bottle-broken.png` | `af232e94…6846f` | Broken/open bottle | Bottle opening state only; do not show before the receiver opens it. |
| `plane.png` | `cecilia/carrier-plane.png` | `4f105f0f…f21746` | Paper plane | Plane picker, sealed preview, handoff, arrival, and cabinet; potentially courier payload after a separate pickup composition is approved. |
| `scroll.png` | `cecilia/scroll-message.png` | `d8dfc227…8b810a` | Rolled tied letter/scroll | Letter/envelope template candidate and an optional cabinet silhouette. It is not the authored-page unfold itself: that must retain the sender's actual composition. |

### State coverage and gaps

| Product moment | Approved source slot | Constraint / remaining asset gap |
| --- | --- | --- |
| Home | `firefly-line-b1.png` | Use sparingly as the single small signature. Keep generous white space. |
| Carrier picker | `bottle-intact.png`, `firefly-filled-f1.png` or `firefly-filled-f2.png`, `carrier-plane.png` | The three choices remain bottle, firefly, and paper plane. Pick one filled firefly only after a phone-scale review. |
| Courier pickup / flight / drop | Selected bottle or plane artwork; `firefly-filled-f1.png` / `firefly-filled-f2.png` plus a separate envelope payload when firefly is selected | The executable prototype alternates the two supplied filled drawings only during flight. The pre-composed carrying source remains available as a reference, not stacked with another envelope. Separate `W1`/`W2` still need anchor review. No visible trajectory line. |
| Envelope-design stage | `envelope-mail-02.png`; `scroll-message.png` only as an alternate template candidate | The sender designs the folded envelope/seal before selecting delivery. Custom seal artwork is still a missing source asset. |
| Opening | `bottle-broken.png` for bottle; sender-composed page for every unfold | There is no final plane-open or envelope-open master. Never substitute a blank generic fold. |
| Cabinet | `envelope-mail-02.png`, `bottle-intact.png`, `carrier-plane.png`, or `firefly-line-b1.png` depending on what was sent | Stored objects must remain distinct and represent the actual selected carrier. |

### Explicitly not supplied

- Editable SVG masters, individual firefly-body separation, labelled wing-up/wing-down states, and a firefly carrying bottle/plane payload are not in this import.
- Custom envelope template variants, seal/stamp artwork, seal placement/pressed states, and plane-open states still need Cecelia-owned source art or a clearly provisional swappable slot.
- None of these imported assets authorise a broad generic sticker library, a persistent mascot, visible path lines, or fake handwritten intimate copy.

## Visual grammar

- **Colour sequence:** white with deep navy ink before opening; deep navy with warm off-white marks after opening. A small maker-selectable exploratory palette may add scrapbook expression to the composed object. Butter yellow/powder blue remain possible accents, not approved brand colours or a final palette.
- **Line:** variable human pressure, rounded joins, small asymmetry, and confident negative space. Match the apparent stroke weight to Gaegu's letter strokes; do not use heavy, uniform fake-sketch outlines. Do not add paper texture; restrained hand-drawn ruling may make the blank paper legible without overpowering type. The final should not inherit current code SVG geometry.
- **Composition:** one strong silhouette at a time. Home stays almost empty with its primary invitation/action bottom-centred and no central squiggle. Carrier choice shows the selected object alone—no scenic backdrop, waves, guide mascot, or explanatory doodle competing with it. The maker may hold a small number of user-placed, team-drawn stickers; never use emoji, a generic sticker pack, or decorative clutter. No generic app-outline set, sparkle field, blob, bento-card decoration, fake paper texture, or gradients.
- **Legibility:** every icon needs an accessible name or nearby visible label; controls retain 44 × 44 CSS px hit areas even when the drawing is smaller.
- **Masters:** editable transparent SVG first, plus a 3× transparent PNG preview. Keep master strokes editable wherever possible.
- **Naming:** `keepsake-[area]-[asset]-[state]-v01.svg`, with a matching PNG. Example: `keepsake-carrier-bottle-cork-resting-v01.svg`.

## Mini tech pack — type, brush, and line

- **Typeface:** Gaegu Regular is the working primary face. Pair it with one restrained readable companion only for accessibility-critical copy; do not introduce a second expressive handwriting font.
- **Ink:** deep navy before opening; warm off-white inverse on navy after opening. Do not use black as a separate graphic system.
- **Brush / pen:** round-ended pen or brush with mild pressure variation; smooth enough to read at phone size, with occasional human wobble. Avoid scratchy pencil texture and randomised distortion.
- **Line-weight check:** compare every icon at phone scale directly beside Gaegu. The line must feel like the lettering's sibling: generally light-to-medium, not bold enough to dominate a heading. Scale the object up before making its line heavier.
- **Build handoff:** provide SVG strokes unexpanded where practical, documented stroke widths, round caps/joins, viewBox, transparent background, and a 3× PNG proof. Do not bake a background scene into an icon.
- **Motion handoff:** provide resting plus only the state drawings needed to explain feedback, spatial consistency, a state change, or an interaction. No decorative loops. Opening and keep/cabinet are the priority transitions.

## Priority 0 — the carrier family

These are first because the carrier chooser and receiver ritual are the current visual test. Keep them compatible, but do not force identical silhouettes.

| Asset | Canvas / role | Needed states | Notes |
| --- | --- | --- | --- |
| `carrier-bottle` | 180 × 210 master; legible at 32 px | browse, selected hero, sealed, arrival, cabinet | The bottle can be simple. Cork is separate, not a generic cap. |
| `carrier-bottle-cork` | 56 × 80, clear upward travel | resting, touched, lifted, open | Must work with pull, tap, keyboard, and reduced-motion fallback. Artwork cannot be the sole opening instruction. |
| `carrier-firefly` | 180 × 210 master; compact courier, not a logo | browse, selected hero, wing-down, wing-up, carrying, pickup, drop, arrived | One journey then leaves. Carrying must use a separate payload layout; no collection, navigation, pet state, badge, or permanent brand role. Cecilia's imported PNGs are raster source art; do not infer unlabelled wing-state semantics. |
| `carrier-courier-payload` | separate carrier/letter layout, compatible with selected object | bottle, plane, letter; resting, carried, dropped | Keep the payload separate from courier artwork so it can be picked up and dropped without redrawing a mascot scene. |
| `carrier-plane` | 180 × 210 fold/wing silhouette | browse, selected hero, sealed, arrival, open | Tap-to-unfold must remain obvious without relying on animation. |
| `carrier-choice-indicator` | 32 × 10 underline/mark | selected, focus | One handmade selection cue, not a pill, badge, or card border. |

## Priority 1 — maker, object, and ending marks

| Asset | Canvas / role | Needed states | Notes |
| --- | --- | --- | --- |
| `wordmark-working` | approx. 176 × 64 | primary, compact/navy inverse | A temporary mark may be replaced after naming; do not copy `grug.` lettering or name. |
| `home-bee` | approx. 80 × 80 visible art inside a 107 × 107 slot | resting, optional restrained hover | Use the exact team-owned master from Figma. It is a small Home signature, not the persistent courier, helper, or navigation mascot. |
| `action-make`, `action-back`, `action-close` | 24–36 px within 44 px controls | idle, pressed, disabled where needed | Small recurring controls should share the carrier line language and retain accessible labels. |
| `material-photo` | 28 × 28 | add, placed, remove/unavailable | A small Polaroid/held-photo mark that lands on paper, not an empty-image glyph or full-screen background. |
| `maker-camera`, `maker-video` | 28–40 px inside 44 px controls | permission/loading, photo, video idle, recording, unavailable | Must make capture mode and recording state legible without copying Instagram's icon family. |
| `material-voice`, `media-playback` | 28 × 28 | add, recorded, play, pause, replay, unavailable | Receiver needs explicit play state and transcript support. |
| `material-song` | 28 × 28 | add, placed, play, pause, unavailable | Do not imply a real licensed playback integration. |
| `material-drawing`, `personal-mark` | 28–72 px | add, drawing, placed, object | Drawing must support an actual freehand doodle action; marks remain spare and sender-made. |
| `material-sticker-*` | 36–96 px transparent masters | add, placed, selected, remove | A small team-drawn, swappable set of purposeful scrapbook materials. Never emoji, a generic sticker pack, or ambient decoration. |
| `maker-colour-*` | compact swatch / ink cue | idle, selected, focus | Exploratory, user-selectable object colours. Do not imply a final palette or recolour the sparse outer shell. |
| `feedback-given`, `feedback-unavailable` | 44–72 px | appearing/resting or default | Sender closure has no receiver state. Failures pair a quiet mark with plain recovery copy. |
| `ending-keep`, `ending-close`, `ending-remove` | 24–28 px inside 44 px controls | idle, confirm, kept/removed | None may shame the receiver or make keeping look morally correct. |
| `cabinet-object`, `cabinet-empty` | 64–160 px | empty, containing one, selected | A kept item must feel physically distinct, never a feed/card/list row. |
| `maker-select`, `maker-rotate`, `maker-remove` | 20–28 px inside 36–44 px handles | idle, selected, pressed, focus | One sparse contextual set for direct manipulation; it disappears when no layer is selected. |
| `material-rail-edge` | flexible / optional | resting, scrollable | A compact cue that the bottom tool rail continues to scroll; never an oversized button wall. |

## Priority 2 — only when the test earns it

| Asset | Why it waits |
| --- | --- |
| `arrival-firefly` | Possible arrival cue, not a mascot. Keep only if it clarifies attention better than the carrier itself. |
| `reply-free-note` | Structural no-reply is current. Explicit no-obligation copy is a separate test condition, not a decorative label. |
| `occasion-*`, `theme-*`, demographic personas | They would narrow the audience or create a template system before evidence supports it. |
| expanded carrier family | No birds, storks, capsules, boxes, or pigeons until one has a distinct interaction job and displaces a current choice. |
| final logo system, broad palette expansion, generic sticker library | Keep the colour and sticker experiment small and material-led; do not turn it into a brand kit, emoji picker, or generic sticker pack. |
| `carrier-backdrop-*`, scenic waves, mascot helper bubbles | The current review rejects them: the carrier itself needs the space. |
| 3D/360° tree, hanging-object archive, collection animation | Rejected for this prototype: too costly, too performance-heavy, and not high leverage. Keep the simple physical cabinet. |

## Interaction-state map

| Moment | Required artwork / accessibility state |
| --- | --- |
| Make the inside | The phone becomes blank paper first. Writing remains central; camera/photo/video are optional Polaroid-like materials; words, voice, song, real freehand drawing, exploratory colour, and a small hand-drawn sticker set land on the canvas and expose move, rotate, edit and remove only while selected. |
| Choose an arrival | Three named carrier icons—bottle, firefly, plane—have selected state and visible text explaining the chosen ritual. |
| Give it | One sealed carrier/object, private-link cue, copied/error state, sender completion, and no read/open/keep signal. |
| Receive it | Known maker, carrier in generous white space, not-now route, and wrong-person/unavailable branch before intimate content. |
| Open it | Carrier arrives centrally after its one-time courier drop. Double-tap is tested only with visible tap/keyboard/reduced-motion fallback; bottle pull and plane direct actions remain available. |
| Enter the object | The composed content unfolds directly on the object as white recedes into navy; warm-off-white marks become readable immediately. No blank interstitial, long intro, or autoplay sound. |
| Finish | Keep, close, remove, and confirmation remain private and equally unjudged. Cabinet uses a distinct object silhouette. |

## First 60-minute hand-drawn batch

1. **0–12 min — calibration:** test navy ink on white and warm off-white on navy beside Gaegu. Set line pressure, wobble, type pairing, and phone-scale stroke weight.
2. **12–32 min — carrier trio:** bottle/cork, firefly, plane in browse and large-object states. Choose recognisable silhouettes before detail; movement paths are animation notation only and are never exported as visible art.
3. **32–44 min — receiver ritual states:** bottle resting/lifted/open; courier wing-down/wing-up/carrying/pickup/drop with separate payload; paper unfolding panels that reveal composed content; plane resting/open. Supply a static reduced-motion state for each.
4. **44–54 min — core maker/living-page marks:** camera/photo/video and recording states, selection/rotate/remove handles, compact tool-rail cue, voice/playback, song, drawing/personal-mark, small hand-drawn sticker materials, and colour swatches.
5. **54–60 min — ending:** keep, close, remove, cabinet object, quiet unavailable mark.

**Done condition:** editable SVG masters, matching 3× transparent PNG previews, state names, and a phone-scale check for all P0 assets. Assets must be independently swappable; do not redraw body copy or lock artwork to a specific layout.

## Handoff checklist

- [ ] Every P0 asset has editable transparent SVG and matching 3× PNG preview.
- [ ] Files state canvas, visual state, and `P0` / `P1` / `P2` priority.
- [ ] Bottle/firefly/plane share a hand while retaining their own opening affordance.
- [ ] The one-time courier has separate wing-down, wing-up/carrying, pickup and drop states, with independently swappable carrier/letter payload artwork.
- [ ] Each icon has visible text or an accessible name; artwork is not the only instruction.
- [ ] Reduced-motion, focus, pressed, unavailable, and removal-confirmation needs have identified visual states.
- [ ] No asset adds chat, read receipts, urgency, gamification, romance coding, or generic AI styling.
- [ ] Current SVGs are replaced slot-by-slot after review, not treated as final geometry.
- [ ] Home has no central decorative squiggle; its primary invitation/action remains bottom-centred and visually quiet.
- [ ] The selected carrier appears alone in generous negative space: no backdrop, waves, mascot helper, or decorative scene.
- [ ] Studio assets support writing-first, full-screen paper-first composition, optional Polaroid media, real freehand drawing, a small exploratory colour system, a small team-drawn sticker material set, sparse thumb-reachable tools, and selected-layer move/rotate/remove states at phone width.
- [ ] No sticker is emoji, a generic sticker-pack asset, or a visible trajectory/path line; paths remain implementation and motion notation only.
- [ ] All marks pass a Gaegu-adjacent line-weight check at phone scale; thick fake-sketch outlines are rejected.
- [ ] Motion assets exist only for feedback, spatial consistency, state change, or interaction explanation; no loop-only drawings or 3D/360° tree work is included.
- [ ] A human visual lead checks a phone render for logo-swap risk, generic-doodle drift, and legibility before final art direction is claimed.
- [ ] When Figma access returns, log a real visual delta instead of retroactively claiming this set came from the live file.
