<!-- Orientation: working notes, evidence boundaries and review gates for the exploratory Warm & Fuzzies HTML pitch. -->
# Exploratory Warm & Fuzzies pitch

This is a disposable 13-slide HTML presentation draft. It is not the final Figma Slides source, a validated product claim or completed research record. It exists so the team can review the revised story before finalising evidence, persona details and the audience handoff.

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
2. Existing communication contradiction
3. Problem statement and How Might We
4. Cost versus meaning/effort opportunity map
5. Initial-to-useful research direction
6. Primary research findings
7. Grandmother–granddaughter relationship lens
8. Prototype evolution
9. Warm & Fuzzies solution reveal
10. Sender flow
11. Receiver flow
12. Audience QR/link handoff card
13. Conclusion

## Visual contract

- **Communication job:** make the expression barrier legible, show how research narrowed it, then demonstrate one authored object moving from sender to receiver.
- **Source anchors:** Cecelia's firefly and palette; Gaegu; the current white/deep-ink product; real prototype captures; the grandmother–granddaughter relationship lens; the make → seal → travel → receive object journey.
- **Reference delta:** the earlier Jobs-style deck still contributes diagnostic pacing, but the revised deck replaces the ring-led structure with the team's requested research, relationship and process arc.
- **Rejected defaults:** no persona card, stock portrait, decorative affinity board, fake statistics, fake QR, feature-card grid or process diary.
- **Signature move:** the same appreciative thought moves from an awkward sentence, through a relationship and research gap, into one finite object that the room can optionally receive.
- **Restraint:** accents appear only when they identify the opportunity, relationship thread or product handoff; most slides remain ink on white paper.
- **Human decision:** Ethan directly requested the logo-first sequence, retained intro, problem/HMW, x/y opportunity map, research and interview findings, grandmother–granddaughter lens, process, product detail, audience card and conclusion.

## Structural divergence considered

| Direction | First impression | Strength | Main risk | Result |
| --- | --- | --- | --- | --- |
| A. Research-led journey | Problem, evidence, relationship, evolution, product | Closest to Ethan's requested story and the judging chain | Can become a process diary | Chosen; process limited to one design-changing slide |
| B. Relationship-first case | Grandmother and granddaughter open the story | More emotional and human | The persona is not yet sourced strongly enough to lead | Deferred until provenance and detail are confirmed |
| C. Object journey | The made object travels from sender to receiver | Product is immediately retellable | Judges may see a digital card before accepting the problem | Used only in the product half |

## Judge review

**Decision:** revise the exploratory pitch into the 13-slide research-led sequence requested by Ethan while preserving evidence boundaries.

| Lens | Effect | Evidence | Risk / unanswered question |
| --- | --- | --- | --- |
| Brief fit | strengthens | The problem and solution both name the unwritten ordinary-day appreciation rule. | Exact 2026 wording remains unconfirmed. |
| Problem identification | strengthens | The deck now separates existing care from the expression barrier and shows a relationship context. | The interview synthesis and persona still need exact sources. |
| Solution approach | strengthens | Make, seal, travel, receive and keep/close/remove connect directly to authorship and receiver agency. | The medium has not beaten chat or a physical note in a completed test. |
| Design innovation | strengthens | One authored object and receiver-owned ending are clearer than a generic gratitude app. | Carrier and envelope theatre could still read as decoration without user evidence. |
| Visual communication | strengthens | One dominant composition per slide, real states and restrained brand accents replace the earlier abstract ring repetition. | Some source labels are intentionally small and need projector review. |
| Presentation skills | strengthens | The pitch now follows problem → research → human case → judgment → mechanism → live handoff → close. | A full team rehearsal may expose overrun or weak handoffs. |
| Evidence quality | weak | External research and real prototype states are sourced; missing evidence is labelled. | Primary findings, persona provenance and audience URL are not complete. |

### Challenge review

| Lens | Strongest challenge | Current answer / boundary |
| --- | --- | --- |
| Assumption and inversion | Care may already be expressed adequately through action. | The deck starts from existing appreciation and does not call indirect care deficient. |
| Behaviour and context | “Friends” and “ordinary day” remain broad. | The relationship slide provides one case, but it stays illustrative until sourced. |
| Medium necessity | Why not text, voice or a physical letter? | The x/y slide keeps them visible as alternatives; the prototype proposes lower logistics plus ownership, not superiority. |
| Alternatives | A non-digital ritual may work better. | The opportunity map and Q&A retain physical gestures as controls. |
| Human specificity | The persona could become fiction. | No names, ages or quotes are invented; provenance is visibly blocked. |
| Inclusion and accessibility | QR, handwriting and motion can exclude. | The deck has reduced-motion support, semantic controls and a no-device handoff. Real assistive testing is still required. |
| Trust, safety and privacy | A private-looking link may overpromise. | The receiver flow states production privacy, identity and persistence are unresolved. |
| Failure and recovery | Appreciation can be unwanted or misread. | Open later, decline, close and remove remain visible product states. |
| Feasibility and demo truth | A polished deck can imply production delivery. | Product slides say working prototype and distinguish implemented controls from unresolved production behaviour. |
| Incentives and second-order effects | Craft may create effort theatre or reply debt. | The receiving ending has no required reply or sender-visible receipt; effect remains untested. |
| Simplicity and retellability | Thirteen slides may diffuse the core idea. | The close repeats one line: care exists; the comfortable format is missing. |
| Authorship and distinctiveness | The deck could still feel generated. | Ethan chose the structure, Cecelia supplied the identity assets, and the app screenshots show the team's actual interaction decisions. |

- **Verdict:** Proceed with conditions.
- **Blocking conditions:** replace the working interview synthesis with the exact sample/method/findings/exceptions; confirm persona provenance; replace the QR placeholder with a verified live URL and real QR; rehearse the full deck inside six minutes; do not call the audience reaction validation.
- **Weakest judging angle:** evidence quality.
- **Main trade-off:** the deck now documents enough process and research to build confidence, at the cost of less time for the product demo.
- **Next evidence:** one verified interview synthesis and one timed full-team run.
- **Recommendation:** review this draft as the new story baseline, then correct the three blocked slides before Figma or final export.

## Design-authenticity post-build

- **Artifact inspected:** all 13 slides at 1600 × 900, including the updated relationship and current cabinet states.
- **Strongest remaining AI tell:** the three interview findings can read like generic synthesis until the team's actual language and exceptions replace them.
- **Content-native signature:** one appreciative thought becomes a made, sealed, carried and receiver-owned object.
- **Material human change:** Ethan replaced the earlier ring-led pitch with the logo-first research, persona, process and audience-handoff sequence; Cecelia's supplied identity now governs the deck.
- **Logo-swap test:** pass for the product and object-journey slides; the research slides depend on the final interview language to pass fully.
- **Team-voice test:** pass for the problem, process, product and close; primary-findings copy still needs team wording.
- **Subtraction pass:** removed the repeated top metadata, decorative ring system, fake optimum implication, feature-grid treatment and unverified QR.
- **Verdict:** Revise before final use.
- **Exact next action:** replace the three provisional findings and illustrative persona details with the team's approved evidence, then insert and test the live handoff QR.

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
