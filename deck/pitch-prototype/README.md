<!-- Orientation: exploratory HTML pitch prototype for testing story, motion and prototype framing. -->
# Exploratory pitch prototype

This folder is a disposable, self-contained HTML presentation stimulus. It is **not** the deck source of truth, a final pitch, a validated product claim, or a replacement for `deck/deck-spec.json` / Figma Slides. It exists to test a Jobs-style problem diagnosis and a receiver-first product demonstration before a human selects a final direction.

Serve the repository locally, then open the deck:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4176/deck/pitch-prototype/`. Arrow keys, space, Enter, click, and the on-screen controls advance; `F` toggles fullscreen. Use `?slide=N&step=M` to open an exact build state, for example `?slide=10&step=2`. Print exposes the final state of every slide.

Local review exports (generated and intentionally ignored by the repository):

- `output/pitch-prototype.pdf` — static 12-page, 16:9 fallback.
- `output/contact-sheet.png` — final-state overview for quick critique.

## Visual contract

- **Communication job:** make the invisible occasion rule legible before showing the prototype. The audience must see the missing social space, then understand that the proposed object is only a test of it.
- **Source anchors:** the actual white-to-navy receiver threshold; Gaegu handwritten product typography; current light hand-drawn linework; the minimal home with its bottom-centred invitation; the sender's one-paper-sheet workspace; and the receiver-owned `keep / close / remove` ending.
- **Reference delta:** Steve Jobs supplies the diagnostic structure, not an Apple visual imitation. This deck uses a conceptual social map and a moving appreciation sentence, not product-keynote black slides, product glamour or fake metrics.
- **Exact visual system:** #FFFFFF paper and #0B2858 navy only. Gaegu is the presentation voice; system sans is limited to source/status text. Geometry is square, linework is 1.5 to 2.2px navy ink, space is intentionally generous. No gradients, rounded cards, shadows, icon libraries, stock imagery, or decorative UI.
- **Signature move:** the same sentence crosses social contexts. `birthday` is struck through and becomes `ordinary Tuesday`; at the receiver threshold the whole slide crosses white to navy. Motion explains interpretation and ownership, not decoration.
- **Rejected defaults:** (1) an inspirational story/photo opening, because it asks for belief before diagnosis; (2) a fake statistical Goldilocks graph, because no measurement supports one; (3) three equal comparison cards, because the audience needs an evolving social script, not a feature table; (4) the usual product-app reveal before the problem requirement exists.
- **Restraint:** no fake QR, no fabricated audience quote, no claim that paper is inferior, and no result graphic for the planned test.
- **Human decision:** Ethan chose the Jobs-style diagnosis and the current product prototype as the visual reference. The deck keeps the social-map direction explicitly exploratory.

## Structural divergence considered

| Direction | Viewer notices first | What it clarifies | Main risk | Source anchor |
| --- | --- | --- | --- | --- |
| A. Map-as-stage **chosen** | The empty high-right social space | Why a new receiving contract might be needed | Can look falsely quantitative | Occasion permission and same-words test |
| B. Sentence-as-stage | One unchanged sentence changing meaning | The enforcement mechanism | May become anecdotal before the opportunity is clear | Birthday versus Tuesday distinction |
| C. Object-journey | The sender-to-receiver handoff | The interaction and threshold | Reveals product before the judges accept the problem | Current working prototype |

## Judge preflight, exploratory build only

**Verdict: Proceed with conditions.** This is permitted only as a labelled exploratory stimulus under the repository's direct-request exception. Do not promote it to the final deck without a human choice, an artifact review, and the listed evidence.

| Lens | Effect | Evidence and condition |
| --- | --- | --- |
| Brief fit | strengthens | Reveals and tests an unwritten rule. Keep the official 2026 brief status unconfirmed. |
| Problem identification | strengthens | Names an ordinary-day moment, predicted interpretation, and causal rule. The prevalence of this rule remains untested. |
| Solution approach | neutral | Receiver-owned closure follows the hypothesis but has not been shown to reduce pressure. |
| Design innovation | neutral | The social contract is more distinct than a scrapbook UI; digital letters remain an existing control. |
| Visual communication | strengthens | One moving sentence, one map, and the white-to-navy threshold establish a coherent explanatory language. |
| Presentation skills | strengthens | The story moves problem → cause → requirement → prototype → test, within six minutes. |
| Evidence quality | mixed | Kumar & Epley supports a narrow prediction gap, not this audience, norm, or medium. Every visual claim preserves that boundary. |

| Challenge lens | Control / unresolved question |
| --- | --- |
| Assumption and inversion | Direct appreciation may not be desirable for everyone. Compare not sending, practical care, chat, paper and object. |
| Behaviour and context | The decisive moment is before sending and when receiving unexpected care. Test both people separately. |
| Medium necessity | The digital object must earn itself against paper and chat, not merely look more crafted. |
| Alternatives | Physical letter, voice note, practical help, ordinary chat and one-way physical rituals stay alive. |
| Human specificity | Relationship history, culture, boundaries and personal communication style may reverse the result. |
| Inclusion and accessibility | Provide text alternative, no-device route and reduced motion. The actual deck supports reduced motion and print; the product still needs verification. |
| Trust, safety and privacy | No anonymous delivery, visible sender provenance, block/decline and receiver agency need product-level testing. |
| Failure and recovery | `keep / close / remove` is presented as a prototype contract, not proof. Clarify recovery for unwanted reconnection. |
| Feasibility and demo truth | Screens are copied from the current local prototype. The social effect and test result are not implemented or claimed. |
| Incentives and second-order effects | A made object could become effort theatre or create reply debt. The matched test must surface it. |
| Simplicity and retellability | Core retelling: “Care already exists, but ordinary-day appreciation can feel like it needs a reason.” |
| Authorship and distinctiveness | Human selection: Ethan chose the narrative and product reference. Team must perform a real render review and materially redirect or approve before final use. |

**Weakest judging angle:** evidence quality. The smallest evidence likely to change the direction is a consented matched same-words comparison across chat, physical, and prototype conditions that records sender prediction and receiver interpretation.

## Evidence boundary

The conceptual map is explicitly not measured data. It maps a hypothesis. Kumar and Epley (2018) found that gratitude-letter expressers overestimated recipient awkwardness and underestimated recipients' positive response; it does not establish that all friends share an occasion rule or that this digital format solves it. Slide 11 is a plan, not a results slide.

## Assets and disclosure

| Asset | Source / role |
| --- | --- |
| `assets/gaegu.woff2` | Copied from `prototype/public/assets/fonts/Gaegu-Regular-latin.woff2`; display typeface matching current prototype. License: `assets/Gaegu-OFL.txt`. |
| `assets/pretext.js` | Copied from `~/.claude/skills/gstack/design-html/vendor/pretext.js`; local text-measurement helper, no network dependency. |
| `assets/product-home.png` | Current local minimal-home prototype capture, used on slide 8. |
| `assets/sender-studio.png` | Current local one-paper-sheet maker capture, used on slide 10. |
| `assets/arrival.png` | Current local receiver-arrival capture, used on slide 10 initial state. |
| `assets/receiver-reveal.png` | Current local receiver-reveal capture, used on slide 10 revealed state. |

AI assisted exploratory HTML composition. Humans framed the problem, selected the Jobs-style diagnosis, selected the current prototype as the reference, and must inspect, change or approve the rendered direction before it becomes a presentation asset. Record any final tool/material disclosure in the submission appendix.
