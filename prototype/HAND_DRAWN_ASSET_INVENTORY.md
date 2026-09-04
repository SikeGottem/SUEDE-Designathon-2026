<!-- This is Cecelia's swappable hand-drawn asset handoff for the current friendship-appreciation prototype. -->
# Hand-drawn asset inventory

> Make the object language, not a decorative icon pack. Every asset must clarify making, arrival, opening, receiving, ownership, or ending.

## Read this first

- **Status:** exploratory asset kit for a reversible prototype. The icons below are not final branding and their inclusion is not user validation.
- **Current source:** the executable React/Vite flow is in `prototype/src/`. Its code uses provisional SVG slots (`data-asset-slot`) so Cecelia's artwork can replace individual marks without changing the interaction model.
- **Current source cut:** 28 transcript captures, the conceptual spec, supplied product wireframes, the white/navy `warm & fuzzies` visual reference, and the earlier handwriting/palette references.
- **Latest direction wins:** the current scoped test uses a small carrier browse (bottle, ladybug, paper plane, flowers), a scrapbook-like creation page, no bottom navigation, and a white-to-navy opening threshold. It supersedes the earlier one-sealed-object/no-picker constraint only for this test.
- **Figma boundary:** this inventory does not claim a live Figma read. The Figma MCP Starter-plan limit blocked a new canvas read; use Figma later for a short visual delta pass, not as a replacement for the transcript-led code and team review.
- **Typeface:** use Gaegu as the working Ugly Dave-like companion. Cecelia does not need to draw a full typeface. Hand-lettering is best reserved for the final wordmark and a very small number of short intentional labels.
- **Human authorship:** artwork may be handmade; intimate written/voice content must remain the sender's own. Do not make fake personal handwriting or AI-generated evidence of effort.

## Visual grammar

- **Colour sequence:** white with deep navy ink before opening; deep navy with warm off-white marks after opening. Butter yellow/powder blue are possible small state accents, not approved brand colours.
- **Line:** variable human pressure, rounded joins, small asymmetry, and confident negative space. The final should not inherit current code SVG geometry.
- **Composition:** one strong silhouette at a time; no generic app-outline set, sparkle field, blob, bento-card decoration, fake paper texture, gradients, or sticker clutter.
- **Legibility:** every icon needs an accessible name or nearby visible label; controls retain 44 × 44 CSS px hit areas even when the drawing is smaller.
- **Masters:** editable transparent SVG first, plus a 3× transparent PNG preview. Keep master strokes editable wherever possible.
- **Naming:** `keepsake-[area]-[asset]-[state]-v01.svg`, with a matching PNG. Example: `keepsake-carrier-bottle-cork-resting-v01.svg`.

## Priority 0 — the carrier family

These are first because the carrier chooser and receiver ritual are the current visual test. Keep them compatible, but do not force identical silhouettes.

| Asset | Canvas / role | Needed states | Notes |
| --- | --- | --- | --- |
| `carrier-bottle` | 180 × 210 master; legible at 32 px | browse, selected hero, sealed, arrival, cabinet | The bottle can be simple. Cork is separate, not a generic cap. |
| `carrier-bottle-cork` | 56 × 80, clear upward travel | resting, touched, lifted, open | Must work with pull, tap, keyboard, and reduced-motion fallback. Artwork cannot be the sole opening instruction. |
| `carrier-ladybug` | 180 × 210 master; compact courier, not a logo | browse, selected hero, waiting, moving, arrived | One journey then leaves; no collection, navigation, pet state, badge, or permanent brand role. |
| `carrier-ladybug-path` | 300 × 320 path | static, journey, reduced-motion static | One hand-drawn path that explains where to touch; no particles, swarm, or map UI. |
| `carrier-plane` | 180 × 210 fold/wing silhouette | browse, selected hero, sealed, arrival, open | Tap-to-unfold must remain obvious without relying on animation. |
| `carrier-flowers` | 180 × 210 loose bunch/wrapping cue | browse, selected hero, sealed, arrival, open | A container for the object, not a romance or occasion-only symbol. |
| `carrier-backdrop-*` | 280 × 310 sparse line field | resting | Optional support behind the chosen object. Never a patterned card or full scene. |
| `carrier-choice-indicator` | 32 × 10 underline/mark | selected, focus | One handmade selection cue, not a pill, badge, or card border. |

## Priority 1 — maker, object, and ending marks

| Asset | Canvas / role | Needed states | Notes |
| --- | --- | --- | --- |
| `wordmark-working` | approx. 176 × 64 | primary, compact/navy inverse | A temporary mark may be replaced after naming; do not copy `grug.` lettering or name. |
| `action-make`, `action-back`, `action-close` | 24–36 px within 44 px controls | idle, pressed, disabled where needed | Small recurring controls should share the carrier line language and retain accessible labels. |
| `material-photo` | 28 × 28 | add, placed, remove/unavailable | A held-photo/frame mark, not an empty-image system glyph. |
| `material-voice`, `media-playback` | 28 × 28 | add, recorded, play, pause, replay, unavailable | Receiver needs explicit play state and transcript support. |
| `material-song` | 28 × 28 | add, placed, play, pause, unavailable | Do not imply a real licensed playback integration. |
| `material-drawing`, `personal-mark` | 28–72 px | add, placed, object | Spare and sender-made, not a universal sticker pack. |
| `object-thread`, `divider` | 96–320 px flexible line | resting | Connect the navy living page without becoming a timeline/progress indicator. |
| `feedback-given`, `feedback-unavailable` | 44–72 px | appearing/resting or default | Sender closure has no receiver state. Failures pair a quiet mark with plain recovery copy. |
| `ending-keep`, `ending-close`, `ending-remove` | 24–28 px inside 44 px controls | idle, confirm, kept/removed | None may shame the receiver or make keeping look morally correct. |
| `cabinet-object`, `cabinet-empty` | 64–160 px | empty, containing one, selected | A kept item must feel physically distinct, never a feed/card/list row. |

## Priority 2 — only when the test earns it

| Asset | Why it waits |
| --- | --- |
| `material-video` | The concept allows video, but the current sample does not need it. Add only with an explicit still, controls, and no-autoplay rule. |
| `arrival-firefly` | Possible arrival cue, not a mascot. Keep only if it clarifies attention better than the carrier itself. |
| `reply-free-note` | Structural no-reply is current. Explicit no-obligation copy is a separate test condition, not a decorative label. |
| `occasion-*`, `theme-*`, demographic personas | They would narrow the audience or create a template system before evidence supports it. |
| expanded carrier family | No birds, storks, capsules, boxes, or pigeons until one has a distinct interaction job and displaces a current choice. |
| final logo system, palette expansion, stickers | Do not make a brand kit before the experience and visual lead settle the core object language. |

## Interaction-state map

| Moment | Required artwork / accessibility state |
| --- | --- |
| Choose an arrival | Four named carrier icons, selected state, and visible text explaining the chosen ritual. |
| Make the inside | Words, photo, voice, song, and drawing marks sit irregularly on one white worktable; removal and focus states stay clear. |
| Give it | One sealed carrier/object, private-link cue, copied/error state, sender completion, and no read/open/keep signal. |
| Receive it | Known maker, carrier in generous white space, not-now route, and wrong-person/unavailable branch before intimate content. |
| Open it | Bottle pull + tap/keyboard fallback; ladybug journey + direct-open fallback; plane/flowers direct action. Respect reduced motion. |
| Enter the object | White recedes into navy; warm-off-white marks become readable immediately. No long intro or autoplay sound. |
| Finish | Keep, close, remove, and confirmation remain private and equally unjudged. Cabinet uses a distinct object silhouette. |

## First 60-minute hand-drawn batch

1. **0–12 min — calibration:** test navy ink on white and warm off-white on navy beside Gaegu. Set line pressure, wobble, and type pairing.
2. **12–32 min — carrier quartet:** bottle/cork, ladybug/path, plane, flowers in browse and large-object states. Choose recognisable silhouettes before detail.
3. **32–44 min — receiver ritual states:** bottle resting/lifted/open; ladybug waiting/moving; plane/flowers resting/open. Supply a static reduced-motion state for each.
4. **44–54 min — core living-page marks:** photo, voice/playback, song, drawing/personal-mark, connector line.
5. **54–60 min — ending:** keep, close, remove, cabinet object, quiet unavailable mark.

**Done condition:** editable SVG masters, matching 3× transparent PNG previews, state names, and a phone-scale check for all P0 assets. Assets must be independently swappable; do not redraw body copy or lock artwork to a specific layout.

## Handoff checklist

- [ ] Every P0 asset has editable transparent SVG and matching 3× PNG preview.
- [ ] Files state canvas, visual state, and `P0` / `P1` / `P2` priority.
- [ ] Bottle/ladybug/plane/flowers share a hand while retaining their own opening affordance.
- [ ] Each icon has visible text or an accessible name; artwork is not the only instruction.
- [ ] Reduced-motion, focus, pressed, unavailable, and removal-confirmation needs have identified visual states.
- [ ] No asset adds chat, read receipts, urgency, gamification, romance coding, or generic AI styling.
- [ ] Current SVGs are replaced slot-by-slot after review, not treated as final geometry.
- [ ] A human visual lead checks a phone render for logo-swap risk, generic-doodle drift, and legibility before final art direction is claimed.
- [ ] When Figma access returns, log a real visual delta instead of retroactively claiming this set came from the live file.
