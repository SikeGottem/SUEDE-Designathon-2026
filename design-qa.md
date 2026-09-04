<!-- This report records the matched visual and interaction QA for the 5 September sender-and-cabinet redesign. -->
# Design QA — sender and cabinet redraw

## Target and capture conditions

- Source references:
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-WKtpke.png` — Studio.
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-RkAvCf.png` — Preview, Handoff, and Sent.
  - `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-wPS3hy.png` — Cabinet.
- Browser viewport: 1100 × 1100 at device scale factor 1.
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

## Iteration history

1. First implementation comparison found three material differences: Studio inherited pale cream instead of white; Preview used a thin code-built envelope; and Handoff's carrier was visually too small.
2. The second pass made plain paper white, used Cecelia's hand-drawn envelope master, enlarged the handoff object, changed Cabinet from deep navy to white, and removed extra Sent/cabinet actions.
3. Functional review found that a fixed Preview PNG discarded the selected envelope template and personal seal. Preview was rebuilt around the real Cecelia envelope master while retaining the authored template and seal state.
4. Interaction review found the selected message's `edit words` action beneath the bottom tool dock. It moved above the selected layer, retains a 44-pixel target, remains inside the canvas at the maximum upward drag bound, and was re-tested successfully.
5. A sequential Envelope → Carrier → Preview check exposed browser focus scrolling the outer emulated phone screen. Route changes now reset both the product scroller and phone-screen container; the same sequence finishes at scroll position zero.

## Surface review

- Typography: Gaegu remains the visible type system. The hierarchy follows the supplied frames without adding generic display/sans pairings.
- Layout: each state has one dominant physical object or message; Studio is full bleed, Sent is deliberately sparse, and Cabinet is a two-column object field.
- Colour: system chrome is white and deep navy. The broader Cecelia palette remains available only for authored paper/envelope choices and restrained identity accents.
- Assets: Preview and carrier states use Cecelia's source PNGs. Cabinet preserves the actual carrier chosen for each object rather than repeating placeholder bottles.
- Copy: helper paragraphs, decorative captions, receiver-demo copy, and cabinet bottom CTA were removed. Link limitations and broken-state recovery remain.
- Authenticity: the resulting composition follows Ethan's redraw and Cecelia's linework. It does not introduce cards, gradients, shadows, decorative flight paths, or unrelated AI-generated ornament.

## Interaction and console QA

- Studio: blank paper, in-place text editing, selected-layer edit, doodling, Add tray, and Next gating work.
- Preview: carrier-change and private-give actions route correctly; the selected envelope template and personal seal survive.
- Handoff: receiver link, exact QR modal, Escape close, copy state, finish action, and broken-link state work. The draft remains available through the back route.
- Sent: `make another` resets to an empty Studio and `leave` returns Home.
- Cabinet: keep, open the exact object, remove/cancel, remove/confirm, and empty state work.
- Browser console: zero errors across the inspected flow.
- Focused continuity evidence: `output/design-qa/redesign-2026-09-05/implementation-preview-authored-state-final.png` verifies the selected midnight template, drawn seal, and final zero-scroll sequential route.

## Verification

- `npm run build` — passed.
- `npm run test:sites` — 4 passed.
- `npx playwright test tests/mobile-runtime.spec.ts` — 8 passed.
- Final targeted Studio interaction re-test — passed.

## Final result

passed
