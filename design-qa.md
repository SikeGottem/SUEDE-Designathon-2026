<!-- This report records matched visual and interaction QA for the 5 September Home, cabinet, stamp, and delivery-motion redesign. -->
# Design QA — Home navigation, cabinet, stamp, and delivery motion

## Target and capture conditions

- Source references:
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-WKtpke.png` — Studio.
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-RkAvCf.png` — Preview, Handoff, and Sent.
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-wPS3hy.png` — Cabinet.
  - `prototype/public/assets/illustrations/cecilia/envelope-mail-02.png` — clean outer-envelope source.
  - `prototype/public/assets/illustrations/cecilia/firefly-carrying-envelope.png` — delivery-courier source.
- Browser viewport: 1100 × 1100 for the base redraw pass and 1400 × 1200 for the latest navigation/motion pass, both at device scale factor 1.
- Captured app surface: `[data-testid="device-screen"]`, 393/394 × 852 CSS pixels at scale 1. The one-pixel width difference is browser rounding.
- Runtime-owned iPhone status and home chrome were excluded from mismatch severity.
- Exact Figma spacing was not treated as a tracing requirement because Ethan explicitly supplied the frames as layout/colour direction rather than final spacing.

## Final comparison evidence

| State | Normalized source | Final implementation | Side-by-side comparison |
| --- | --- | --- | --- |
| Studio | `output/design-qa/redesign-2026-09-05/source-studio.png` | `output/design-qa/redesign-2026-09-05/implementation-studio-02.png` | `output/design-qa/redesign-2026-09-05/comparison-studio-02.png` |
| Preview | `output/design-qa/redesign-2026-09-05/source-preview.png` | `output/design-qa/redesign-2026-09-05/implementation-preview-final.png` | `output/design-qa/redesign-2026-09-05/comparison-preview-final.png` |
| Handoff | `output/design-qa/redesign-2026-09-05/source-handoff.png` | `output/design-qa/redesign-2026-09-05/implementation-handoff-02.png` | `output/design-qa/redesign-2026-09-05/comparison-handoff-02.png` |
| Sent | `output/design-qa/redesign-2026-09-05/source-sent.png` | `output/design-qa/redesign-2026-09-05/implementation-sent-02.png` | `output/design-qa/redesign-2026-09-05/comparison-sent-02.png` |
| Cabinet | `output/design-qa/redesign-2026-09-05/source-cabinet.png` | `output/design-qa/redesign-2026-09-05/implementation-cabinet-02.png` | `output/design-qa/redesign-2026-09-05/comparison-cabinet-02.png` |

The full 393/394 × 852 views were sufficient to inspect hierarchy, Gaegu typography, line weight, object imagery, labels, controls, and colour. No additional crop was needed.

### Latest changed-state evidence

| State | Source truth | Final implementation | Combined or supporting evidence |
| --- | --- | --- | --- |
| Returning Home | `output/design-qa/home-source-393x852.png` (393 × 852), intentionally extended by Ethan's bottom-navigation requirement | `output/design-qa/motion-nav-2026-09-05/home-returning-final.png` (394 × 852) | `output/design-qa/motion-nav-2026-09-05/comparison-home-returning-final.png` (787 × 852) |
| Preview | `output/design-qa/redesign-2026-09-05/source-preview.png` (394 × 852) | `output/design-qa/motion-nav-2026-09-05/preview.png` (394 × 852) | `output/design-qa/motion-nav-2026-09-05/comparison-preview.png` (788 × 852) |
| Optional stamp stage | Cecelia's 1000 × 1000 `envelope-mail-02.png` plus Ethan's explicit clean-image/stamp-only correction | `output/design-qa/motion-nav-2026-09-05/envelope-stamp-final.png` (394 × 852) | The full view keeps the unmodified hand-drawn silhouette readable at delivery scale; a detail crop was unnecessary. |
| Sent delivery | `output/design-qa/redesign-2026-09-05/source-sent.png` (394 × 852), intentionally extended by Ethan's courier requirement | `output/design-qa/motion-nav-2026-09-05/sent-device-final.png` (394 × 852) | `output/design-qa/motion-nav-2026-09-05/comparison-sent-final.png` (788 × 852) |
| Returning cabinet | `output/design-qa/redesign-2026-09-05/source-cabinet.png` (394 × 852), intentionally extended by Ethan's bottom-navigation requirement | `output/design-qa/motion-nav-2026-09-05/cabinet-returning-final.png` (394 × 852) | `output/design-qa/motion-nav-2026-09-05/comparison-cabinet-final.png` (788 × 852) |
| Reduced motion | Same Sent composition and Cecelia assets | `output/design-qa/motion-nav-2026-09-05/sent-reduced-motion-final.png` (394 × 852) | Static carrying pose verifies an equivalent non-travelling state. |

## Iteration history

1. First implementation comparison found three material differences: Studio inherited pale cream instead of white; Preview used a thin code-built envelope; and Handoff's carrier was visually too small.
2. The second pass made plain paper white, used Cecelia's hand-drawn envelope master, enlarged the handoff object, changed Cabinet from deep navy to white, and removed extra Sent/cabinet actions.
3. Functional review found that a fixed Preview PNG discarded the selected envelope template and personal seal. Preview was rebuilt around the real Cecelia envelope master while retaining the authored template and seal state.
4. Interaction review found the selected message's `edit words` action beneath the bottom tool dock. It moved above the selected layer, retains a 44-pixel target, remains inside the canvas at the maximum upward drag bound, and was re-tested successfully.
5. A sequential Envelope → Carrier → Preview check exposed browser focus scrolling the outer emulated phone screen. Route changes now reset both the product scroller and phone-screen container; the same sequence finishes at scroll position zero.
6. The next review found that Home had no cabinet route and the cabinet had no persistent creation route, while outer-envelope templates added low-value decoration. A browser-local returning marker now changes Home's lower action area from the first-use invitation to a central create action plus `your letters`; Cabinet repeats that navigation. The root still always opens on Home. A clean Cecelia envelope and optional stamp-only stage replaced the template chooser.
7. The first delivery-motion pass made the courier visible but did not communicate possession of the letter clearly enough in every frame. The final pass layers Cecelia's courier with the clean envelope, stages a slow pickup before departure, continues one calm flight loop, and starts correctly even on the direct Sent capture route.
8. The final equal-size Home, Preview, Sent, and Cabinet comparisons found no actionable P0/P1/P2 differences. The intentional additions are the requested returning navigation and delivery courier, not design drift. Reduced-motion emulation changes the courier to a static carrying pose without moving the copy or actions.

## Surface review

- Typography: Gaegu remains the visible type system. The hierarchy follows the supplied frames without adding generic display/sans pairings.
- Layout: each state has one dominant physical object or message; Studio is full bleed, Sent is deliberately sparse, and Cabinet is a two-column object field.
- Colour: system chrome is white and deep navy. The broader Cecelia palette remains available only for authored paper choices, the personal stamp, and restrained identity accents.
- Assets: Preview, stamp, carrier, delivery, and cabinet states use Cecelia's source PNGs. The delivery composite keeps the envelope independently legible instead of implying it with a path or caption, and Cabinet preserves the actual carrier chosen for each object.
- Copy: helper paragraphs, decorative captions, receiver-demo copy, and envelope-template labels were removed. Link limitations and broken-state recovery remain; `your letters`, `make`, and stamp copy describe real controls.
- Authenticity: the resulting composition follows Ethan's redraw and Cecelia's linework. It does not introduce cards, gradients, shadows, decorative flight paths, particles, or unrelated AI-generated ornament.

## Interaction and console QA

- Studio: blank paper, in-place text editing, selected-layer edit, doodling, Add tray, and Next gating work.
- Envelope and Preview: the paper folds, the clean source envelope appears without a template chooser or address collision, progression does not require a stamp, the stamp editor is keyboard-labelled, and an applied personal stamp survives into Preview.
- Preview: carrier-change and private-give actions route correctly; the clean envelope and optional personal stamp survive.
- Handoff: receiver link, exact QR modal, Escape close, copy state, finish action, and broken-link state work. The draft remains available through the back route.
- Sent: the firefly enters, collects the letter, visibly leaves with it, then continues a slow upper-screen flight while the confirmation/actions remain still. `make another` resets to an empty Studio and `leave` returns Home.
- Home and Cabinet: `/` opens Home in both first-use and returning states. Clearing storage shows `make it for them`; beginning once sets local return state; reloading `/` still shows Home but adds the central `+` creation action and `your letters` route. Cabinet keep/open/remove/cancel/confirm, empty state, central `+`, and current-destination control work.
- Reduced motion: the Sent state renders the same firefly-and-letter object at rest with `data-delivery-stage="still"`; no path, pickup, or loop motion runs.
- Browser console: zero errors across the inspected flow. Motion's development-only reduced-motion notice was the sole warning during explicit media emulation.
- Focused continuity evidence: `output/design-qa/motion-nav-2026-09-05/preview-stamped-final.png` verifies that the optional personal stamp reaches the clean Preview; the final zero-scroll Envelope → Carrier → Preview sequence was re-tested.

## Verification

- `npm run build` — passed.
- `npm run test:sites` — 4 passed.
- `npx playwright test tests/mobile-runtime.spec.ts` — 8 passed.
- Final targeted first-use/returning Home navigation, Home → Cabinet, Envelope → Carrier → Preview, Handoff → Sent, delivery-loop, and reduced-motion checks — passed.

## Final result

passed
