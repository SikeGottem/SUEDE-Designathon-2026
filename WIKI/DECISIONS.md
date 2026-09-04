<!-- This page records consequential choices so the team can move without losing the reason behind them. -->
# Decisions

Only record choices that change direction, investment or the story. Every consequential entry must include a completed judge review. Small production choices do not need a permanent log.

## 2026-09-03 - Make GitHub synchronization mandatory

- Status: current
- Decision: use a private GitHub repository as the shared remote and require every completed wiki update to be committed and pushed immediately.
- Reason: the team needs one current copy that every invited collaborator can read and change without relying on Ethan's local machine.
- Evidence: Markdown is already the authoritative wiki format, the SQLite database is rebuildable from it, and Git records who changed what while allowing conflicting edits to be reconciled.
- Consequence: agents and teammates must treat a local-only wiki change as incomplete. The generated SQLite database remains local to avoid binary conflicts.
- Revisit when: the team chooses a different shared knowledge system or GitHub access becomes a bottleneck.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | neutral | Repository synchronization does not change the eventual response to the brief. | Process could distract from the entry if commits become ceremony. |
| Problem identification | strengthens | Shared research and problem framing stay visible to every collaborator. | Poorly sourced notes can still spread quickly. |
| Solution approach | strengthens | The team can work from the same current decisions, tests and constraints. | Concurrent edits can conflict without regular pulls. |
| Design innovation | neutral | GitHub preserves ideas but does not make them more original. | Familiar ideas could gain authority merely by being documented. |
| Visual communication | neutral | The remote preserves presentation assets but does not improve their quality. | GitHub previews are not a replacement for checking the final Figma or PDF output. |
| Presentation skills | strengthens | One shared narrative reduces contradictory claims between teammates. | Unreviewed edits could make the pitch less coherent. |
| Evidence quality | strengthens | Git history preserves attribution, timing and the reason for changes. | The repository must remain private because it contains team transcripts. |

- Verdict: Proceed with conditions
- Weakest judging angle: visual communication, because synchronization protects assets but does not improve their clarity or craft.
- Main trade-off: shared current knowledge and traceable changes at the cost of basic Git coordination.
- Next evidence that could change the verdict: confirmation that each teammate can access, edit and push to the private repository.
- Recommendation: publish privately, invite collaborators individually, push every verified wiki update and never commit the generated SQLite database.

## 2026-09-03 - Make judging review mandatory for every consequential decision

- Status: current
- Decision: treat `WIKI/JUDGING.md` as the source of truth and require the SUEDE judge-review agent procedure before consequential choices are proposed, approved or implemented.
- Reason: the team should choose its process and output by the qualities judges reward, not treat a preferred workflow as the objective.
- Evidence: SUEDE published five explicit judging criteria in 2024. The 2025 winner language and judge reflections reinforce creativity, impact, vision and storytelling while the 2026 rubric remains unpublished.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | Forces every choice to reference the exact brief and requirements. | The 2026 brief is not yet available. |
| Problem identification | strengthens | Requires the decision to sharpen or protect the user, moment and problem evidence. | A process review cannot replace direct research. |
| Solution approach | strengthens | Makes each feature and scope choice explain how it improves the core response. | The procedure could become paperwork if reviews are not concise. |
| Design innovation | strengthens | Requires every choice to check whether it preserves a distinct insight or makes the idea generic. | Historical criteria may not match the final 2026 emphasis. |
| Visual communication | strengthens | Requires visual decisions to improve comprehension rather than decoration. | Early strategy decisions may be neutral on visual craft. |
| Presentation skills | strengthens | Creates a clear rationale and evidence trail that can feed the final pitch. | Internal language still needs editing for a live audience. |
| Evidence quality | strengthens | Separates confirmed facts, inference and unknowns in every review. | Quality still depends on the sources entered by the team. |

- Verdict: Proceed with conditions
- Weakest judging angle: current brief fit, because the 2026 brief and criteria are not yet published.
- Main trade-off: more disciplined decisions at the cost of a small amount of review time.
- Next evidence that could change the verdict: the official 2026 rubric or direct organiser clarification.
- Recommendation: use the mandatory review for material decisions only, keep it concise and update the authority as soon as official criteria arrive.
- Revisit when: the official 2026 brief or rubric is released.

## 2026-09-01 - Use an adaptive approach rather than fixed assignments

- Status: current
- Decision: organise work around the biggest unanswered question instead of permanent assignments or a rigid hourly plan.
- Reason: the 2026 brief is unknown, and the quality of the initial interpretation is as important as the quality of the output.
- Consequence: leadership and effort can shift as the problem moves from understanding to selection, testing, making and storytelling.
- Revisit when: the official brief or event constraints create a real dependency that needs a more fixed owner.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | unknown | The approach can adapt when the exact brief arrives. | No published 2026 brief currently proves this is the best operating model. |
| Problem identification | strengthens | Work follows the largest unanswered question, keeping early effort on understanding the user and problem. | The team could keep researching without a stop condition. |
| Solution approach | strengthens | Effort can move to whichever part of the response is least convincing. | Changing focus too often could reduce ownership and continuity. |
| Design innovation | strengthens | Delaying fixed execution makes room to find a less obvious mechanism. | Flexibility alone does not produce an original idea. |
| Visual communication | neutral | The operating model does not directly determine visual quality. | Late ownership changes could reduce craft consistency. |
| Presentation skills | neutral | A shared rationale can help the pitch, but the approach does not guarantee a clear story. | The team still needs one person to consolidate the final narrative. |
| Evidence quality | strengthens | Priorities are meant to follow the biggest unknown rather than preference. | Each shift needs an explicit question and done condition to count as evidence-led. |

- Verdict: Proceed with conditions
- Weakest judging angle: brief fit, because the exact 2026 task and event constraints remain unknown.
- Main trade-off: better adaptation and idea quality at the cost of continuity if focus changes too often.
- Next evidence that could change the verdict: the official brief, team size and submission constraints.
- Recommendation: keep the adaptive model, but give every work block one question, a 15-60 minute limit and a clear done condition.

## 2026-09-01 - Use a default clock with explicit stop conditions

- Status: current
- Decision: spend 4-5 hours choosing an idea in a 24-hour sprint or 5-6 hours in a 36-hour sprint. Reserve the final 4 hours or 6 hours for the pitch, demo, rehearsal, submission and buffer.
- Reason: a purely adaptive process does not tell the team when useful exploration has become avoidance. The default clock protects both the idea and its execution.
- Evidence: the 2024 winning FreTo team compared problems early, tested before high-fidelity work and completed the sprint in 24 hours. General Devpost judge advice also treats requirements, demo quality and storytelling as material.
- Consequence: the team can change the clock for a clear reason, but every extension must produce evidence or reduce a named risk.
- Revisit when: the official 2026 duration, requirements and judging rubric are released.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | unknown | The clock is expressed as a percentage-like default for two likely sprint lengths. | The actual 2026 duration and deliverables are not yet confirmed. |
| Problem identification | strengthens | Four to six early hours protect problem framing and concept selection from premature production. | Too much exploration could still delay testing. |
| Solution approach | strengthens | Stop conditions move the team from discussion to a complete core flow. | A fixed cutoff could preserve a weak concept if evidence arrives late. |
| Design innovation | strengthens | The plan treats idea quality as a real allocation rather than a short prelude to making. | Time spent does not guarantee a distinct mechanism. |
| Visual communication | neutral | The reserved ending protects final craft indirectly. | The clock does not specify how much earlier visual exploration is needed. |
| Presentation skills | strengthens | The final four or six hours explicitly protect demo, pitch, rehearsal, submission and buffer. | The reserve may be too small if the format demands a complex video. |
| Evidence quality | strengthens | Extensions require new evidence or reduction of a named risk. | The timing is based on historical examples and general guidance, not a published 2026 schedule. |

- Verdict: Proceed with conditions
- Weakest judging angle: brief fit, because the event duration and required submission format are unknown.
- Main trade-off: protects both idea quality and delivery, but a default clock can become rigid if evidence changes late.
- Next evidence that could change the verdict: the official event duration, checkpoints and submission requirements.
- Recommendation: use the clock as a default boundary, not a rule; change it only for a named judging risk and record why.

## 2026-09-03 - Make the judging model the presentation's main argument

- Status: current
- Decision: organise the presentation around the five published 2024 SUEDE criteria and the evidence behind our interpretation. Keep timing as a short implication rather than the main subject.
- Reason: understanding what judges reward lets the team decide its own process without treating a suggested workflow as the objective.
- Evidence: SUEDE published explicit judging criteria in 2024. The 2025 page did not publish a rubric, but winner announcements and judge reflections provide additional signals about creativity, impact, vision and storytelling.
- Consequence: every recommendation in the deck should connect to a judging criterion or clearly labelled inference.
- Revisit when: the 2026 rubric is published or organisers provide direct clarification.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | unknown | The deck clearly separates the published fallback from the missing 2026 rubric. | The official 2026 criteria could change the hierarchy. |
| Problem identification | strengthens | The structure makes problem understanding one of the central decision tests. | The deck still needs the event brief before it can show a specific problem. |
| Solution approach | strengthens | It teaches the team to trace the solution mechanism to the problem and visible outcome. | Criteria alone do not choose the right solution. |
| Design innovation | strengthens | It makes a distinct insight and mechanism explicit evaluation targets. | Teams may imitate prior winners if examples are treated as formulas. |
| Visual communication | strengthens | Visual clarity is presented as a judging requirement rather than decoration. | The deck itself must keep demonstrating that standard. |
| Presentation skills | strengthens | The material is organised around the questions judges are likely to ask and remember. | Too much rubric explanation could crowd out a simple practical takeaway. |
| Evidence quality | strengthens | Official criteria, public signals and inference are labelled separately. | 2025 signals are suggestive, not a formal scoring rubric. |

- Verdict: Proceed with conditions
- Weakest judging angle: brief fit, because the official 2026 rubric is still missing.
- Main trade-off: gives the team a shared evaluation model, but can become abstract unless every criterion is tied to a visible example or decision.
- Next evidence that could change the verdict: the official 2026 criteria or direct organiser clarification.
- Recommendation: keep judging as the main argument, label uncertainty plainly and update the deck immediately when official guidance appears.

## 2026-09-04 - Make full-lens, human-led review a hard execution gate

- Status: current
- Decision: no material idea, product, UI, prototype or pitch direction may advance without the complete judging and challenge review in `WIKI/JUDGING.md`. AI may accelerate exploration and execution, but humans must own framing, divergence, selection, taste, material edits, testing, approval and disclosure.
- Reason: the presentation principles need to control action rather than remain advice, and AI speed is valuable only when it does not replace evidence, authorship or a distinctive point of view.
- Evidence: the current presentation and judging research show a connected path from specific problem to visible mechanism, proof and memorable story. Published 2024 and 2025 SUEDE rules did not ban AI or mandate a tool, but both required attribution of third-party material and an explanation of its use or improvement. The 2026 rules remain unpublished.
- Consequence: verdicts now control execution; idea selection requires mechanism-level divergence; UI requires preflight and artifact review; AI contributions are recorded and disclosed; generic model defaults fail the authorship lens.
- Revisit when: the official 2026 rules or rubric are published, or a completed concept cycle shows that a gate needs to be made more precise without weakening it.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | Every material decision must name its fit to the exact task before work advances. | The official 2026 brief and rubric are not yet available. |
| Problem identification | strengthens | The gate requires a specific person, moment, cause and evidence before fidelity rises. | A review cannot substitute for direct research with real people. |
| Solution approach | strengthens | Product and UI work must show the action, response, outcome, error and recovery states. | A long checklist could become theatre unless each answer affects the work. |
| Design innovation | strengthens | Mechanism-level divergence, inversion and non-app alternatives prevent selection among cosmetic feature variants. | Divergence can still become performative if the team secretly commits to its first idea. |
| Visual communication | strengthens | Preflight defines a point of view and post-build review inspects the actual artifact for clarity and generic patterns. | Taste remains a human judgment that a checklist cannot automate. |
| Presentation skills | strengthens | Retellability and demo truth are tested before the story is locked. | Too much process language must not enter the live pitch. |
| Evidence quality | strengthens | AI output cannot count as research, testing or proof; unknowns and simulated behaviour must remain visible. | Attribution requirements for AI remain an inference until 2026 rules are published. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Could the gate itself make the team rigid? | It allows raw divergence and proportional reviews while stopping only material advancement. | Observe the first live cycle and shorten wording that adds no decision value. |
| Behaviour and context | Will the review happen where decisions are actually made? | The repository contract and agent skill trigger before proposing, approving or implementing material work. | Teammates working outside the repository need the same checkpoint habit. |
| Medium necessity | Does this need a separate app or scoring system? | No. Markdown authority, templates and agent routing are sufficient and faster. | Revisit only if compliance cannot be observed during the event. |
| Alternatives | Could a loose principle list work with less friction? | The existing list was easy to consult but did not control whether work could advance. | A facilitated team may need less enforcement than autonomous agents. |
| Human specificity | Does the system preserve Ethan and the team's taste? | Human selection, manual editing, explanation and approval are explicit requirements. | The team still needs concrete references and real user evidence for each concept. |
| Inclusion and accessibility | Is accessibility treated as a late polish item? | It is required in challenge review, UI preflight, state inventory and artifact review. | Actual keyboard, contrast and assistive-technology checks remain concept-dependent. |
| Trust, safety and privacy | Could AI fabricate evidence or conceal its role? | Generated research and tests are forbidden as evidence; material tools and assets must be disclosed. | The organiser's exact 2026 AI disclosure expectation is unknown. |
| Failure and recovery | What happens when a direction fails review? | `Test first` permits only the named test; `Reject` stops investment and preserves the reason. | The team must resist continuing production out of sunk-cost pressure. |
| Feasibility and demo truth | Could a polished prototype imply functionality that does not exist? | Every review separates working, simulated and untested behaviour and asks what the artifact proves. | The selected concept determines which behaviour must be coded. |
| Incentives and second-order effects | Could agents optimize for completing the template rather than improving the idea? | Reviews require evidence, risks and a work-control verdict, not numeric scores. | Quality must be sampled during the event to catch ritual compliance. |
| Simplicity and retellability | Is the doctrine too large to use quickly? | The full authority is durable; the template supports concise completion and a one-sentence recommendation. | A compact event-day checklist may still be useful after one real trial. |
| Authorship and distinctiveness | Could AI still produce polished median work? | AI cannot lead framing or selection, multiple paradigms are required and generic patterns explicitly fail the gate. | Only manual critique and testing of the actual output can confirm distinctiveness. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: activate the gate in agent contracts, templates, deck workflow and future design work.
- Blocking conditions: update the doctrine when official 2026 rules arrive; keep reviews proportional; inspect real artifacts; do not let the checklist replace research or human taste.
- Weakest judging angle: brief fit, because the 2026 brief and AI rules are still unavailable.
- Main trade-off: stronger judgment, authorship and consistency in exchange for deliberate friction before material work advances.
- Next evidence that could change the verdict: the official 2026 rules and one observed concept-to-prototype cycle using the gate.
- Recommendation: activate the gate now and treat any skipped material review as incomplete work.

## 2026-09-04 - Defer the permanent visual-skill choice and use a bounded hybrid

- Status: current
- Decision: keep Impeccable, Anthropic `frontend-design` and the current `design-taste-frontend` installed until the real 2026 concept exists. They may produce separate options or critiques, but each implemented artifact must declare one visual lead; humans may selectively combine individual decisions after review, not stack all three instruction sets. Defer Figma OAuth until Ethan is ready.
- Reason: the Relay comparison produced useful but task-specific evidence. Ethan wants to preserve optionality and make the final taste judgment against the real product rather than permanently selecting from a fictional benchmark.
- Evidence: identical candidates completed the fixed Relay flow and Playwright verification. The blind review provisionally preferred C/current `design-taste-frontend`; A/Impeccable had 38px demo controls; B/Anthropic lost focus after most transitions and had a 39px control; C preserved focus and ≥44px controls but showed an unfinished heading outline and was operating outside the skill's stated ideal scope. Full evidence is under `benchmarks/design-skills/`.
- Consequence: no candidate is archived now. `WIKI/TOOLCHAIN.md` controls the hybrid: separate exploration, one visual lead per artifact, deliberate human synthesis and post-render audit. The official Figma plugin remains installed but unverified until OAuth and native Design/Slides tests are completed.
- Revisit when: the official brief produces a real concept and representative product or presentation surface, or after Figma authentication is connected.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | unknown | Deferral avoids hard-coding a tool choice before the 2026 task is known. | The eventual surface may expose a capability gap too late if the decision is postponed indefinitely. |
| Problem identification | neutral | Visual skills do not establish user evidence or choose the problem. | Attractive output could still pull the team toward a weak problem. |
| Solution approach | strengthens | Different candidates can challenge the same mechanism before implementation is locked. | Unbounded comparison would consume build and test time. |
| Design innovation | strengthens | Separate visual voices increase the chance of escaping one model's defaults. | Combining every direction would average the work back toward generic compromise. |
| Visual communication | mixed | One declared lead preserves coherence while optional comparison preserves choice. | The final lead is not selected, and the three skills contain conflicting visual defaults. |
| Presentation skills | strengthens | The team can select the language that best supports the real story rather than a fictional test. | Late selection could create deck inconsistency without an early design contract. |
| Evidence quality | strengthens | The provisional result, defects and limits remain recorded instead of being inflated into a universal ranking. | One benchmark cannot prove performance across product UI, campaign pages and slides. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Why not permanently keep the blind winner now? | C won this task, but its own instructions identify multi-step product UI as a scope mismatch; a real-concept check is more representative. | The actual 2026 artifact type is unknown. |
| Behaviour and context | Will three installed skills be invoked accidentally together? | `TOOLCHAIN.md` requires one named visual lead in `DESIGN.md` before implementation. | Agent routing still needs human attention until one default is chosen. |
| Medium necessity | Does this need another selection app or scoring system? | No; labelled outputs, pairwise review and a written lead are sufficient. | None. |
| Alternatives | Could the team simply choose based on reputation? | The controlled test exposed concrete defects that stars and README examples did not. | Future tool updates could change the result. |
| Human specificity | Does deferral preserve Ethan's taste? | Ethan makes the final choice against the actual concept and may deliberately integrate a specific decision. | The team still needs concept-specific references. |
| Inclusion and accessibility | Could the visually strongest option hide interaction defects? | Playwright exposed focus and touch-target failures, and post-build verification remains mandatory. | Real assistive-technology testing remains artifact-specific. |
| Trust, safety and privacy | Could a hybrid obscure who made what? | Outputs remain labelled and the AI contribution record captures tools and material human changes. | Official 2026 disclosure rules are not published. |
| Failure and recovery | What happens if the chosen lead fails on the real surface? | Stop, record the failure and compare a second candidate against the same evidence without mixing live rules. | The event timetable may limit a second pass. |
| Feasibility and demo truth | Does Figma work end to end now? | The plugin is installed, but `USER_NOT_LOGGED_IN` is explicitly recorded; no native write is claimed. | OAuth and editable Design/Slides verification remain pending. |
| Incentives and second-order effects | Could optionality become aesthetic procrastination? | Permit one bounded comparison round, then require a human selection and implementation. | The real brief determines the timebox. |
| Simplicity and retellability | Is “hybrid” too vague? | The operational rule is simple: separate options, one lead, deliberate borrowing, audit the render. | None. |
| Authorship and distinctiveness | Could synthesis erase each direction's character? | Humans must name every imported decision and reject incoherent compromise. | Only the final artifact can prove distinctiveness. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: retain all three candidates, use them separately for bounded exploration or critique, document one visual lead per built artifact and leave Figma authentication for later.
- Blocking conditions: never invoke the three broad visual skills together during implementation; do not treat Relay's result as the real concept's answer; complete SUEDE preflight and post-build reviews; label simulated behaviour; verify Figma before retiring local fallbacks.
- Weakest judging angle: visual communication, because permanent art direction remains intentionally unsettled.
- Main trade-off: preserves choice and Ethan's taste judgment at the cost of temporary routing complexity.
- Next evidence that could change the decision: the official 2026 brief plus one representative real screen or deck section reviewed by Ethan.
- Recommendation: keep the bounded hybrid now, then choose quickly from real evidence once the concept exists.

## Decision template

### YYYY-MM-DD - Decision title

- Status: current / superseded / reversed
- Decision:
- Reason:
- Evidence:
- Consequence:
- Revisit when:

### Judge review

Copy the mandatory judge-review table and conclusion from `WIKI/TEMPLATES.md`. A consequential decision is incomplete until this section exists.
