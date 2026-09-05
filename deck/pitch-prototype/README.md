<!-- Orientation: usage, evidence boundaries and review status for the 11-slide Warm & Fuzzies HTML live deck. -->
# Warm & Fuzzies live pitch

This is an HTML-only 11-slide live presentation. `index.html` is the working presentation artifact; no Figma source is included or claimed. The planned talk ends at 4:55, leaving 1:05 inside the six-minute heat limit. The product proposition is made specific through current capabilities, then the flow is proved through a shared live maker-to-receiver demo.

The full judge review, 2025 winner comparison and next-level narrative are in [`NEXT_LEVEL_REVIEW.md`](NEXT_LEVEL_REVIEW.md). The approved portions described below are now implemented in the live deck.

## Approved next-level direction

Ethan approved the next-level narrative and hierarchy direction below. The live HTML, speaker notes and deck specification now implement it, and the changed build states have been checked at the native 1600 × 900 canvas.

- **Process stays in the story.** Page 3 lands the original `where we started` hypothesis, emphasises `show it.`, then crossfades to `The unwritten rule: appreciation needs an occasion.` An event makes appreciation expected, socially understood and clearly prompted; an ordinary day has no obvious prompt and can feel awkward, too much or intense. The final build retains the How Might We.
- **Secondary research becomes a bounded design question.** Page 4 presents text, voice/video and letter/gift as three psychological mechanisms to test. It reveals one active mechanism at a time; the Goldilocks position is a design target/question, never a discovered research result.
- **Market gap, then one illustrative use case.** Page 6 uses the Goldilocks rings to show the working need-state: text can feel too awkward or casual; a letter or gift can feel like too much. Its pale-blue final reveal is simply: `Users are stuck in limbo.` Page 7 then makes the situation concrete with Maya—an illustrative scenario, not participant research or a validated segment—and explicitly labels its 72% and 78% rehearsal placeholders.
- **Digital has an expressive advantage.** Page 9 retains the current solution sentence, then reveals `Because digital can hold more than words.` with five clean hand-drawn media labels: writing, photo, voice, video and chosen song. This is one expressive spectrum, not a claim that digital is inherently more meaningful.
- **The format earns its place before the demo.** Page 10 calls Warm & Fuzzies a digital gift, then builds four qualities: a handwritten letter's personality; mixed media's dynamism; a text's ease through one direct link and no receiver account; and the sense of ownership from a gift, with a receiver who can keep, revisit or remove it. The brace and firefly resolve the list on the final build. This is a design proposition, not measured superiority.
- **The demo remains causal.** Page 11 explains why each step exists while showing `name → make → seal → send → open → keep/remove`, then closes verbally: `The message can be complete when it arrives.`
- **Every build has one visual boss.** The current spoken point receives full contrast; supporting material stays subordinate; prior material fades. Deep blue is the active accent, and presenter chrome hides in presentation mode.

Ethan deliberately did **not** approve the proposed replacements for the rehearsal survey slide, the If / And / Then / Therefore synthesis, or the existing main solution sentence. Those elements remain in the live sequence. This does not change the evidence contract below: no rehearsal percentage, rating, position or circle size may be presented as a participant finding in judged delivery.

For page 9, reject the fake `for Maya` keepsake-paper box, decorative diamonds and an object-description subline. The five media labels are the whole supporting visual language beneath the headline.

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

1. `Rethinking when we show appreciation.` above the Warm & Fuzzies logo lockup
2. Sender-framed audience appreciation question, with no solution-first reference to letters
3. One staged process slide: the starting expression hypothesis crossfades into `The unwritten rule: appreciation needs an occasion.`; it contrasts an event with an ordinary day before the unchanged How Might We
4. Impact / friction / frequency map across three illustrated presentation families, with bounded paper evidence and Cecelia's firefly marking the unboxed Goldilocks target; numeric ratings stay off this slide
5. `Survey results` rehearsal slide with small What / Why / How orientation labels, 82%, 71%, and a hand-drawn three-row trade-off ledger, followed by a fourth-click highlight pass
6. Two oversized Goldilocks rings divide the format constraints; the final pale-blue reveal is `Users are stuck in limbo.`
7. Maya's separate illustrative use case, with explicitly temporary 72% and 78% rehearsal placeholders
8. The original If / And / Then synthesis with one added Therefore design requirement
9. Warm & Fuzzies solution reveal and the digital expressive spectrum
10. `Warm & Fuzzies is a digital gift` followed by four dot-list qualities: letter personality, mixed-media dynamism, text ease and receiver-controlled gift ownership; a brace and firefly resolve the final build
11. “Follow along.” with an encoding-verified `/demo/receive` QR, followed immediately by one continuous live sender-to-receiver demonstration

There is no separate research-plan slide, secondary-research slide, market-size slide, demographic profile, thank-you slide or repeated conclusion. Process is woven into the causal story: the starting hypothesis visibly changes into the occasion question; the map compares impact, friction and frequency while connecting each grouped family to bounded published evidence; the evidence-first findings slide presents the team's specific problem directly; the Goldilocks rings identify a working market gap; the separate Maya scenario makes that gap tangible; page 8 preserves the If / And / Then deduction and adds the resulting Therefore design requirement; page 10 shows the product qualities the team deliberately combines; the public QR and live product then prove the proposed flow.

The full 30:02 machine-transcribed mentor framing remains in `speaker-notes.md` as source context only. The live deck does not name Chloe or use a mentor quote. The newest review replaces the letter-led opener with a broader appreciation question because mentioning a letter reveals the solution format too early. Maya and her close friend are an illustrative use case within the working contexts of university students, long-distance family and close friends; they are not exclusive demographic targeting. Context-aware anti-doomscroll prompting remains an unbuilt, untested backlog idea and does not appear in the main pitch.

## Evidence contract

- The current 1–5 ratings, chart positions, point sizes, 82% and 71% are temporary practice data requested for rehearsal. They are disclosed in the slide footers and must be replaced before the judged pitch.
- Each visible channel statement is limited to a cited paper's finding; no secondary study becomes a survey percentage or proof of the highlighted gap.
- **What** establishes whether people feel they show less appreciation than they feel.
- **Why** investigates the occasion rule, awkwardness, channel mismatch and exceptions.
- **How** groups quick text, voice/video and letter/gift for pitch clarity while retaining the individual forms as controls for the real matched-content study. The displayed group values do not prove equivalence. A later product comparison must test whether Warm & Fuzzies reaches the intended balance.
- Team opinion, mentor reaction, published secondary research, practice values and prototype polish cannot become final primary evidence.
- The primary instrument still uses the What / Why / How questions. The live slide keeps only small What / Why / How orientation labels, not the full prompts, and presents the current rehearsal figures and comparison. Further survey explanation belongs in the appendix.
- Psychology on text, voice, gratitude letters and perceived gift effort supports the map's channel-by-channel mechanism narration. Detailed methods, ownership evidence and limitations still belong in the appendix, and none can replace the primary percentages or qualitative themes.
- The live demo proves only that the prototype can complete the demonstrated flow. It does not prove demand, sincerity, reduced awkwardness or social change.

## Live-demo QR

Slide 11 includes a real QR encoding `https://warm-and-fuzzies.vercel.app/demo/receive`. Before presenting, the team must still:

1. Scan it from the projected slide on a second physical phone.
2. Confirm the event network can load the public route.
3. Keep the short URL and the presenter screen as equivalent no-scan routes.

The QR opens the fixed, replayable public receiver fixture. It is not a personalised thank-you, participant task or validation result.

## Visual contract

- **Communication job:** make the proposed occasion script clear without presenting it as fact, show how the team will prove the gap, synthesize the design requirement, and then let the working product demonstrate one complete act of appreciation.
- **Source anchors:** Cecelia's hand-drawn identity; Gaegu; the white/deep-ink product; the channel map's published evidence; honest hypothesis labels; the public demo and its encoding-verified QR.
- **Rejected defaults:** no mentor-quote theatre, demographic profile card, boxed research panel, fake QR, process diary, feature cards, screenshot carousel or second ending.
- **Signature move:** each channel's paper conclusion appears unboxed beside the active dot and disappears when the presenter moves on. The map ends on an unboxed Goldilocks target; the market-gap slide identifies the unmet need, then Maya makes it tangible; page 10 resolves the four-part digital-gift list with a brace and firefly.
- **Restraint:** no opener counterpoint, product-feature recap, separate thank-you slide or second conclusion after the live demo.
- **Human decision:** the latest captures make the graph a three-variable practice instrument and preserve If / And / Then while adding one Therefore design requirement beneath it. Ethan's newest direct correction supersedes the earlier green choice and sets deep blue as the live-deck accent.

## Judge review

**Decision:** use the newest team review as the controlling live-pitch direction and keep the HTML deck to 10 slides centred on bounded evidence and a shared live demonstration.

| Lens | Effect | Evidence | Risk / unanswered question |
| --- | --- | --- | --- |
| Brief fit | strengthens | The live story names and redesigns a possible occasion-based social script. | Exact 2026 wording remains unconfirmed. |
| Problem identification | strengthens | A plain problem statement, bounded occasion hypothesis, corrected map, direct research findings and one need-state audience form a causal chain. | Every primary value and the audience boundary remain unknown. |
| Solution approach | strengthens | The live maker-to-receiver flow shows the mechanism and receiver-controlled ending directly. | The medium has not beaten any control in a completed matched-format test. |
| Design innovation | strengthens | Making, sealing, giving and receiver-led opening form a clearer ritual than a static feature tour. | Without participant evidence, the experience may still be read as a decorated digital letter. |
| Visual communication | strengthens | Ten slides remove redundant research, process and product screenshots; the longest evidence slide now pairs each claim with its study and boundary. | The rehearsal findings still look unfinished until real evidence replaces them. |
| Presentation skills | strengthens | The map receives 25 seconds of psychology-backed synthesis, followed by one focused 100-second public demo with optional audience access. | The compressed evidence sentence and QR handoff must be rehearsed so they clarify rather than interrupt the story. |
| Evidence quality | weak | Unknowns are left blank and the live demo is not mislabelled as outcome evidence. | No completed primary evidence currently supports the gap, rule, audience or impact. |

### Challenge review

| Lens | Strongest challenge | Current answer / boundary |
| --- | --- | --- |
| Assumption and inversion | Care may already be expressed adequately through action. | What / Why must test the gap and its exceptions rather than assuming explicit messages are always better. |
| Behaviour and context | The problem could be too broad without a market. | The Goldilocks rings define one format tension and name included relationship contexts while leaving validation to research. |
| Medium necessity | Why not text, voice, video or a physical gesture? | Each remains visible on the map and inside the required matched-format comparison. |
| Alternatives | A non-digital ritual may work better. | Letter and gift remain controls; the digital product does not claim superiority. |
| Human specificity | The included groups could be mistaken for validated segments. | The slide leads with a shared need-state and labels the groups as examples rather than demographic proof. |
| Inclusion and accessibility | A QR and live demo can exclude. | The team needs a prepared no-scan receiver path and real assistive testing. |
| Trust, safety and privacy | The link or cabinet could imply privacy and permanence. | The demo may claim only the controls it shows; production identity, retention and forwarding remain unresolved. |
| Failure and recovery | The live flow or network may fail. | Rehearse on the actual setup and keep pre-opened live sender and receiver states, not a replacement video. |
| Feasibility and demo truth | A smooth demo can imply production readiness. | The spoken boundary separates working prototype behaviour from production guarantees and emotional outcomes. |
| Incentives and second-order effects | The ritual could create reply debt or effort theatre. | The receiver can leave, close or remove without a required response; the effect still needs testing. |
| Simplicity and retellability | Research plus a long demo could still blur the rule. | The deck uses one problem sentence, one HMW, one evidence structure and one continuous journey. |
| Authorship and distinctiveness | A polished HTML deck could still feel model-generated. | The latest team critique controls the cuts, map corrections, timing, demo and real team-authored ending. |

- **Verdict:** Proceed with conditions.
- **Blocking conditions:** replace every visibly labelled practice value before the judged pitch; physically verify the public-demo QR; rehearse the live flow on the presentation setup; keep removed material out of the live deck; never call the demo or audience response validation.
- **Weakest judging angle:** evidence quality.
- **Main trade-off:** a shorter, more convincing live story gains clarity and product proof but depends heavily on unfinished primary research and reliable demo execution.
- **Next evidence:** one documented What / Why / How study with a matched-format comparison, followed by a timed live-demo rehearsal.
- **Recommendation:** treat the 11-slide HTML sequence as the live baseline, then replace only the primary evidence that the team genuinely completes.

## Design-authenticity status

- **Artifact inspected:** the 11-slide HTML sequence at 1600 × 900, including the final map, findings, market-gap, Maya and QR states.
- **Strongest remaining AI tell:** the three grouped coordinates and ratings form a visually convenient pattern even though they remain team hypotheses; the footer and spoken boundary must make that status unmistakable.
- **Content-native signature:** one unboxed evidence annotation follows the channel map point-by-point, then hands off to the team's Goldilocks target rather than decorating the slide with a fixed research card.
- **Material human change:** Ethan made the graph the longest narrative slide and required every spoken channel claim to appear beside its research support; unsupported labels, the extra blank statistic and the oval around the final opportunity were removed, then he named the unboxed marker the `goldilocks zone`.
- **Verdict:** Revise before final use.
- **Exact next action:** rehearse the 11-slide deck, public QR and full live demo on the presentation projector before promoting the overall deck to Pass.

## Work outside the presentation

- Run the What / Why / How study and document sample, wording, method, result, exceptions and limitations.
- Compare text, voice, video call, handwritten letter, physical gift and Warm & Fuzzies using the same appreciation scenario; use the result to correct the map and test the highlighted gap.
- Determine which people and relationship contexts experience the problem before returning a market claim to the pitch.
- Rehearse the live maker-to-receiver flow on the actual network and devices, including correction, link generation, opening, keep/reopen and removal.
- Verify the public-demo QR and no-scan fallback on a second physical device using the event network.
- Keep context-aware anti-doomscroll prompting deferred until research tests whether it helps without making appreciation feel automated, surveilled or less sincere.
- Resolve retention, deletion, forwarding, identity, privacy, accessibility, wrong-recipient and failed-media behaviour before making production claims.
- Verify the official 2026 judging rules and required AI/third-party disclosures.

## Assets and disclosure

| Asset | Source / role |
| --- | --- |
| `assets/gaegu.woff2` | Product/deck display typeface; licence in `assets/Gaegu-OFL.txt`. |
| `assets/pretext.js` | Local text-measurement helper; no network dependency. |
| Cecelia illustration assets | Team-authored identity and product art under `prototype/public/assets/illustrations/cecilia/`. |
| `assets/live-demo-qr.svg` | Machine-decoded QR for the deployed public demo; still needs projector-distance and second-device verification. |

AI assisted HTML composition and copy structure. Ethan supplied the controlling narrative decisions, and the team remains responsible for research, wording, selection, live testing, final visual edits and disclosure.
