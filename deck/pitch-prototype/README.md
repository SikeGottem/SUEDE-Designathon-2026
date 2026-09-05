<!-- Orientation: usage, evidence boundaries and review status for the 11-slide Warm & Fuzzies HTML live deck. -->
# Warm & Fuzzies live pitch

This is an HTML-only 11-slide live presentation. `deck/deck-spec.json` remains the content contract and `index.html` is the working presentation artifact; no Figma source is included or claimed. The planned talk ends at 5:50, leaving 10 seconds inside the six-minute heat limit. The product is shown through a live maker-to-receiver demo, not a video or static product walkthrough.

Open `index.html` directly, or serve the repository locally:

```sh
python3 -m http.server 4176 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4176/deck/pitch-prototype/`. Arrow keys, Space, Enter, click and the on-screen controls advance; `F` toggles fullscreen. Use `?slide=N&step=M` to open an exact build state. Print exposes the final state of every slide.

Run the standalone regression check with:

```sh
node --test deck/pitch-prototype/tests/file-open.test.mjs
```

## Live sequence

1. Warm & Fuzzies logo
2. Audience appreciation question, with no solution-first reference to letters
3. Plain problem statement
4. Occasion-based permission and How Might We
5. Evidence-backed channel map: each channel reveals with one bounded published finding; the plotted positions and highlighted gap remain hypotheses
6. High-contrast What / Why / How findings with blank evidence placeholders and no small subtext
7. The grandmother-granddaughter personas as the **when** scenario, including different time zones
8. An If / And / Then synthesis connecting the research results to everyday normalisation
9. Warm & Fuzzies solution reveal
10. “Let us show you.” followed immediately by one continuous live sender-to-receiver demonstration
11. Real team thank-you object, real team photo and verified QR handoff

There is no separate research-plan slide, secondary-research slide, process slide, market slide, sender screenshot, receiver screenshot or repeated conclusion. Process is woven into the causal story: the problem creates the occasion question; the map connects each channel claim to published evidence before exposing a possible gap; What / Why / How must prove and explain the team's specific problem; the personas locate the moment; the If / And / Then slide turns those findings into an everyday-normalisation requirement; the live product demonstrates the resulting ritual and its design decisions.

The full 30:02 machine-transcribed mentor framing remains in `speaker-notes.md` as source context only. The live deck does not name Chloe or use a mentor quote. The newest review replaces the letter-led opener with a broader appreciation question because mentioning a letter reveals the solution format too early. University students are not pitched as a target market. Context-aware anti-doomscroll prompting remains an unbuilt, untested backlog idea and does not appear in the main pitch.

## Evidence contract

- Every plotted position on the map remains a team hypothesis. Each visible channel statement is limited to a cited paper's finding and boundary; no secondary study becomes a survey percentage or proof of the highlighted gap.
- **What** establishes whether people feel they show less appreciation than they feel.
- **Why** investigates the occasion rule, awkwardness, channel mismatch and exceptions.
- **How** compares the perceived impact, effort and frequency of text, voice, video call, handwritten letter and physical gift using the same appreciation scenario. A later product comparison must test whether Warm & Fuzzies reaches the intended balance.
- Team opinion, mentor reaction, published secondary research and prototype polish cannot fill primary-evidence placeholders.
- The latest follow-up fixes the primary instrument at the three visible What / Why / How questions. Further survey explanation belongs in the appendix.
- Psychology on text, voice, gratitude letters and perceived gift effort supports the map's channel-by-channel mechanism narration. Detailed methods, ownership evidence and limitations still belong in the appendix, and none can replace the primary percentages or qualitative themes.
- The live demo proves only that the prototype can complete the demonstrated flow. It does not prove demand, sincerity, reduced awkwardness or social change.

## Handoff blocker

Slide 11 is not final until all three inputs are real:

1. A team-approved photograph of the actual team.
2. The actual thank-you object the team made for the judges and organisers.
3. A deployed receiver route with a QR verified on a second device.

If any input is missing, keep the slide visibly blocked. Do not use stock people, a fabricated object, a placeholder URL or a decorative QR.

## Visual contract

- **Communication job:** make the occasion-only rule clear, show how the team will prove the gap, synthesize the design requirement, and then let the working product demonstrate one complete act of appreciation.
- **Source anchors:** Cecelia's hand-drawn identity; Gaegu; the white/deep-ink product; the channel map's published evidence; honest hypothesis labels; the actual live handoff; the team's real thank-you object and photo.
- **Rejected defaults:** no mentor-quote theatre, demographic persona card, secondary-research grid, fake percentage, fake QR, process diary, feature cards or screenshot carousel.
- **Signature move:** the opportunity-map evidence panel changes with each revealed channel, so the presenter cannot visually detach a claim from its source or limitation. The If / And / Then slide then makes the primary-evidence deduction visible before the product appears.
- **Restraint:** no opener counterpoint, product-feature recap or second conclusion after the thank-you handoff.
- **Human decision:** the 21-minute review cut the earlier 14-slide structure; the seven-minute follow-up simplified research and restored personas; the newest 11-minute review replaces the solution-first letter opener and inserts a synthesis slide between persona and product.

## Judge review

**Decision:** use the newest team review as the controlling live-pitch direction and keep the HTML deck to 11 slides centred on bounded evidence and a live demonstration.

| Lens | Effect | Evidence | Risk / unanswered question |
| --- | --- | --- | --- |
| Brief fit | strengthens | The live story names and redesigns the occasion-based unwritten rule. | Exact 2026 wording remains unconfirmed. |
| Problem identification | strengthens | A plain problem statement, occasion mechanism, corrected map, What / Why / How and one **when** scenario form a causal chain. | Every primary value and the affected audience remain unknown. |
| Solution approach | strengthens | The live maker-to-receiver flow shows the mechanism and receiver-controlled ending directly. | The medium has not beaten any control in a completed matched-format test. |
| Design innovation | strengthens | Making, sealing, giving and receiver-led opening form a clearer ritual than a static feature tour. | Without participant evidence, the experience may still be read as a decorated digital letter. |
| Visual communication | strengthens | Eleven slides remove redundant research, process and product screenshots; the longest evidence slide now pairs each claim with its study and boundary. | The What / Why / How placeholders and handoff blockers can look unfinished until real evidence and assets arrive. |
| Presentation skills | strengthens | The map receives 60 seconds of evidence-led narration, followed by a focused 100-second live demonstration and one real thank-you ending. | The evidence sequence must be rehearsed so the studies clarify rather than overwhelm the story. |
| Evidence quality | weak | Unknowns are left blank and the live demo is not mislabelled as outcome evidence. | No completed primary evidence currently supports the gap, rule, audience or impact. |

### Challenge review

| Lens | Strongest challenge | Current answer / boundary |
| --- | --- | --- |
| Assumption and inversion | Care may already be expressed adequately through action. | What / Why must test the gap and its exceptions rather than assuming explicit messages are always better. |
| Behaviour and context | The problem could be too broad without a market. | The live pitch locates one ordinary-day **when** scenario while leaving audience selection to research. |
| Medium necessity | Why not text, voice, video or a physical gesture? | Each remains visible on the map and inside the required matched-format comparison. |
| Alternatives | A non-digital ritual may work better. | Letter and gift remain controls; the digital product does not claim superiority. |
| Human specificity | The scenario could become an invented persona. | The live deck describes a moment without fabricated names, demographics, quotes or demand. |
| Inclusion and accessibility | A QR and live demo can exclude. | The team needs a prepared no-scan receiver path and real assistive testing. |
| Trust, safety and privacy | The link or cabinet could imply privacy and permanence. | The demo may claim only the controls it shows; production identity, retention and forwarding remain unresolved. |
| Failure and recovery | The live flow or network may fail. | Rehearse on the actual setup and keep pre-opened live sender and receiver states, not a replacement video. |
| Feasibility and demo truth | A smooth demo can imply production readiness. | The spoken boundary separates working prototype behaviour from production guarantees and emotional outcomes. |
| Incentives and second-order effects | The ritual could create reply debt or effort theatre. | The receiver can leave, close or remove without a required response; the effect still needs testing. |
| Simplicity and retellability | Research plus a long demo could still blur the rule. | The deck uses one problem sentence, one HMW, one evidence structure and one continuous journey. |
| Authorship and distinctiveness | A polished HTML deck could still feel model-generated. | The latest team critique controls the cuts, map corrections, timing, demo and real team-authored ending. |

- **Verdict:** Proceed with conditions.
- **Blocking conditions:** leave all research values blank until supported; complete the real photo, object and verified QR; rehearse the live flow on the presentation setup; keep removed material out of the live deck; never call the demo or audience response validation.
- **Weakest judging angle:** evidence quality.
- **Main trade-off:** a shorter, more convincing live story gains clarity and product proof but depends heavily on unfinished primary research and reliable demo execution.
- **Next evidence:** one documented What / Why / How study with a matched-format comparison, followed by a timed live-demo rehearsal.
- **Recommendation:** treat the 11-slide HTML sequence as the live baseline, then fill only the primary evidence and handoff elements the team genuinely completes.

## Design-authenticity status

- **Artifact inspected:** all 11 HTML slides at 1600 × 900, plus the map's first and final builds at presentation, tablet and phone viewport sizes.
- **Strongest remaining AI tell:** the five plotted coordinates are visually precise even though they remain team hypotheses; the spoken boundary must make that status unmistakable.
- **Content-native signature:** one changing evidence panel follows the channel map point-by-point, then hands off to the team's highlighted test area rather than decorating the slide with static citations.
- **Material human change:** Ethan made the graph the longest narrative slide and required every spoken channel claim to appear beside its research support; unsupported labels, the extra blank statistic and the oval around the final opportunity were removed, then he named the unboxed marker the `goldilocks zone`.
- **Verdict:** Revise before final use.
- **Exact next action:** rehearse the 11-slide deck and full live demo on the presentation projector before promoting the overall deck to Pass.

## Work outside the presentation

- Run the What / Why / How study and document sample, wording, method, result, exceptions and limitations.
- Compare text, voice, video call, handwritten letter, physical gift and Warm & Fuzzies using the same appreciation scenario; use the result to correct the map and test the highlighted gap.
- Determine which people and relationship contexts experience the problem before returning a market claim to the pitch.
- Rehearse the live maker-to-receiver flow on the actual network and devices, including correction, link generation, opening, keep/reopen and removal.
- Supply and approve the real team photo; make the thank-you object; deploy its receiver route; verify the QR and no-scan fallback on a second device.
- Keep context-aware anti-doomscroll prompting deferred until research tests whether it helps without making appreciation feel automated, surveilled or less sincere.
- Resolve retention, deletion, forwarding, identity, privacy, accessibility, wrong-recipient and failed-media behaviour before making production claims.
- Verify the official 2026 judging rules and required AI/third-party disclosures.

## Assets and disclosure

| Asset | Source / role |
| --- | --- |
| `assets/gaegu.woff2` | Product/deck display typeface; licence in `assets/Gaegu-OFL.txt`. |
| `assets/pretext.js` | Local text-measurement helper; no network dependency. |
| Cecelia illustration assets | Team-authored identity and product art under `prototype/public/assets/illustrations/cecilia/`. |
| Final team photo | Required team-authored handoff asset; not yet supplied or approved. |
| Final thank-you object and QR | Required live handoff assets; not final until created, deployed and verified. |

AI assisted HTML composition and copy structure. Ethan supplied the controlling narrative decisions, and the team remains responsible for research, wording, selection, live testing, final visual edits and disclosure.
