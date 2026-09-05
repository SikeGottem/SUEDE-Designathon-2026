<!-- Orientation: working notes, evidence boundaries and review gates for the exploratory Warm & Fuzzies HTML pitch. -->
# Exploratory Warm & Fuzzies pitch

This is an HTML-only 14-slide presentation draft. `deck/deck-spec.json` remains the content contract and `index.html` is the working presentation artifact; no Figma source is included or claimed. It is not a validated product claim or completed research record. It exists so the team can review the revised story before finalising evidence, persona details and the audience handoff. The speaker-note cadence is 5:53, leaving seven seconds inside the six-minute limit.

Open `index.html` directly, or serve the repository locally:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4176/deck/pitch-prototype/`. Arrow keys, Space, Enter, click and the on-screen controls advance; `F` toggles fullscreen. Use `?slide=N&step=M` to open an exact build state. Print exposes the final state of every slide.

Run the standalone regression check with:

```sh
node --test deck/pitch-prototype/tests/file-open.test.mjs
```

## Revised story

1. Warm & Fuzzies logo
2. Audience letter question and communication contradiction
3. Chloe’s exact 30:02 machine-transcribed problem framing
4. Mentor-endorsed unwritten rule and bounded How Might We
5. Hypothesis map across text, voice, video, cards, gifts and letters, with the gap highlighted and `___%` intentionally blank
6. Published research and existing-solution scan
7. Primary research still required
8. Team-selected first market and illustrative grandmother–university-student-granddaughter scenario
9. Prototype evolution as three evidence-led design decisions
10. Warm & Fuzzies as an ordinary-day, deliberately occasional ritual, plus a clearly unbuilt context-aware prompt branch
11. Sender flow
12. Receiver control without a required reply
13. Audience QR/link handoff card
14. Return to the unwritten rule

The first market is university students maintaining long-distance connections with friends and family. This is a team selection for focused recruitment and testing, not validated demand. The future prompt branch could resurface a past note or gently suggest sending something after doomscrolling; it is secondary to the core ritual and is neither built nor tested.

## Visual contract

- **Communication job:** make the occasion-only social rule legible, show how evidence sharpened it, then demonstrate one authored object moving from sender to receiver.
- **Source anchors:** Chloe's exact mentor framing; Cecelia's firefly and palette; Gaegu; the current white/deep-ink product; real prototype captures; the clearly labelled illustrative relationship scenario; the make → seal → travel → receive object journey.
- **Reference delta:** the earlier Jobs-style deck still contributes diagnostic pacing, but the revised deck replaces the ring-led structure with the team's requested research, relationship and process arc.
- **Rejected defaults:** no persona card, stock portrait, decorative affinity board, invented percentage, fake QR, feature-card grid or process diary. The visible `___%` is an explicit research debt, not decorative data.
- **Signature move:** Chloe's exact language becomes the compressed rule, then each conclusion causes the next decision: unwritten rule → opportunity hypothesis → external evidence → unanswered primary questions → selected first market → relationship requirement → authored object → optional room handoff.
- **Restraint:** accents appear only when they identify the opportunity, relationship thread or product handoff; most slides remain ink on white paper.
- **Human decision:** Ethan directly requested the logo-first sequence, letter opener, Chloe's exact quote on its own slide, problem/HMW, x/y opportunity map, research, relationship lens, process, product detail, audience card and conclusion. The latest mentor review made cause-and-effect reasoning and the ordinary-day social-permission rule the controlling story choices.

## Structural divergence considered

| Direction | First impression | Strength | Main risk | Result |
| --- | --- | --- | --- | --- |
| A. Research-led journey | Problem, evidence, relationship, evolution, product | Closest to Ethan's requested story and the judging chain | Can become a process diary | Chosen; process limited to one design-changing slide |
| B. Relationship-first case | Grandmother and granddaughter open the story | More emotional and human | The persona is not yet sourced strongly enough to lead | Deferred until provenance and detail are confirmed |
| C. Object journey | The made object travels from sender to receiver | Product is immediately retellable | Judges may see a digital card before accepting the problem | Used only in the product half |

For the latest pass, three process treatments were considered: one isolated process slide, cause-and-effect decisions distributed across slides 4–10, and a chronological process diary. The distributed treatment was selected because it answers “how did you reach that conclusion?” at the moment each conclusion appears; the single process slide remains only as proof of the most important product change.

## Judge review

**Decision:** revise the exploratory pitch into a 14-slide causal sequence where Chloe's exact framing is allowed to land before the team compresses the rule, and where each research or design conclusion explains the next decision.

| Lens | Effect | Evidence | Risk / unanswered question |
| --- | --- | --- | --- |
| Brief fit | strengthens | The problem and solution both name the unwritten ordinary-day appreciation rule. | Exact 2026 wording remains unconfirmed. |
| Problem identification | strengthens | The deck now gives Chloe's exact framing its own slide, compresses it into the occasion-permission rule and selects one first market and relationship context. | Primary evidence has not established prevalence, affected groups, demand or exceptions. |
| Solution approach | strengthens | Make, seal, travel, receive and keep/close/remove connect directly to authorship and receiver agency. The future context-aware prompt is explicitly secondary. | The medium has not beaten chat or a physical note in a completed test, and the prompt branch is unbuilt and untested. |
| Design innovation | strengthens | One authored object and a receiver-controlled ending are clearer than a generic gratitude app. | Carrier and envelope theatre could still read as decoration without user evidence. |
| Visual communication | strengthens | One dominant composition per slide, real states and restrained brand accents replace the earlier abstract ring repetition. | Some source labels are intentionally small and need projector review. |
| Presentation skills | strengthens | The pitch now follows problem → map → research reframe → diagnosis → human requirement → prototype change → mechanism → live handoff → close. | A full team rehearsal may expose overrun or weak handoffs. |
| Evidence quality | weak | Published gratitude and communication-channel studies, product-category observations, the exact mentor transcript and real prototype states are sourced; `___%` and every missing result remain visibly blank or labelled. | Primary findings, market demand, persona provenance and audience URL are not complete. |

### Challenge review

| Lens | Strongest challenge | Current answer / boundary |
| --- | --- | --- |
| Assumption and inversion | Care may already be expressed adequately through action. | The deck starts from existing appreciation and does not call indirect care deficient. |
| Behaviour and context | “Friends” and “ordinary day” remain broad. | The relationship slide provides one case, but it stays illustrative until sourced. |
| Medium necessity | Why not text, voice, video or a physical letter? | The x/y slide keeps them visible as controls; the prototype proposes lower logistics plus a distinct receiving context, not superiority. |
| Alternatives | A non-digital ritual may work better. | The opportunity map and Q&A retain physical gestures as controls. |
| Human specificity | The persona could become fiction. | No names, ages or quotes are invented; provenance is visibly blocked. |
| Inclusion and accessibility | QR, handwriting and motion can exclude. | The deck has reduced-motion support, semantic controls and a no-device handoff. Real assistive testing is still required. |
| Trust, safety and privacy | A private-looking link may overpromise. | The receiver flow states production privacy, identity and persistence are unresolved. |
| Failure and recovery | Appreciation can be unwanted or misread. | Open later, decline, close and remove remain visible product states. |
| Feasibility and demo truth | A polished deck can imply production delivery. | Product slides say working prototype and distinguish implemented controls from unresolved production behaviour. |
| Incentives and second-order effects | Craft may create effort theatre or reply debt, while an anti-doomscroll prompt could make appreciation feel automated or surveilled. | The receiving ending has no required reply or sender-visible receipt; the prompt is a named future test, not current functionality. |
| Simplicity and retellability | Fourteen slides may diffuse the core idea. | The dedicated quote is followed by one compressed rule, and the close repeats it: appreciation should not need an occasion. |
| Authorship and distinctiveness | The deck could still feel generated. | Ethan chose the structure, Cecelia supplied the identity assets, and the app screenshots show the team's actual interaction decisions. |

- **Verdict:** Proceed with conditions.
- **Blocking conditions:** complete and document the missing primary research before replacing `___%`; test demand in the selected first market; validate or replace the illustrative persona; replace the QR placeholder with a verified live URL and real QR; rehearse the full deck inside six minutes; do not call the audience reaction validation or the future prompt implemented.
- **Weakest judging angle:** evidence quality.
- **Main trade-off:** the deck now documents enough process and research to build confidence, at the cost of less time for the product demo.
- **Next evidence:** one matched sender/receiver test across text, voice/video, a physical note and Warm & Fuzzies, plus one timed full-team run.
- **Recommendation:** review this HTML draft as the new story baseline, then correct the blocked evidence, persona and handoff states before final export.

## Design-authenticity post-build

- **Artifact inspected:** all 14 HTML slides at 1600 × 900, including the dedicated Chloe quote, revised causal headlines, highlighted evidence gap, relationship requirement, prototype evolution and ordinary-day framing.
- **Strongest remaining AI tell:** the research plan and illustrative persona will still feel generic until participant evidence supplies real language, exceptions and observed behaviour.
- **Content-native signature:** one appreciative thought moves through a visible chain of human decisions before becoming a made, sealed, carried and receiver-controlled object.
- **Material human change:** Ethan asked for the process to explain how the team reached each conclusion and then required Chloe's exact wording to stand on its own. The latest mentor session supplied the occasion-permission framing and required the map, research, audience, cadence and receiver journey to be explicit; Cecelia's supplied identity still governs the deck.
- **Logo-swap test:** pass for the product and object-journey slides; the research slides depend on the final interview language to pass fully.
- **Team-voice test:** pass for the problem, process, product and close; primary-research language still needs participant wording.
- **Subtraction pass:** removed the repeated top metadata, decorative ring system, fake optimum implication, feature-grid treatment and unverified QR.
- **Verdict:** Revise before final use.
- **Exact next action:** complete the matched participant research, replace or validate the illustrative persona details, then insert and test the live handoff QR.

## Assets and disclosure

| Asset | Source / role |
| --- | --- |
| `assets/gaegu.woff2` | Product/deck display typeface; licence in `assets/Gaegu-OFL.txt`. |
| `assets/pretext.js` | Local text-measurement helper; no network dependency. |
| `assets/process-blank.png` | Actual earlier creator capture used in the process and sender-flow slides. |
| `assets/process-materials.png` | Actual material-exploration capture. |
| `assets/current-home.png` | Current Home capture. |
| `assets/current-carrier.png` | Current carrier-selection capture. |
| `assets/current-cabinet.png` | Current white cabinet capture produced from the live prototype during this deck pass. |
| `assets/arrival.png`, `assets/receiver-reveal.png` | Current receiver-flow captures already held by the deck. |
| Cecelia illustration assets | Repository copies under `prototype/public/assets/illustrations/cecilia/`; team-authored identity, envelope and carrier art. |

AI assisted the HTML composition and copy structure. Ethan supplied the narrative order and the team retains responsibility for evidence, wording, selection, testing, final visual edits and disclosure.
