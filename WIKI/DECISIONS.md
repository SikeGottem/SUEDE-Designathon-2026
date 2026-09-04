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

## 2026-09-04 - Add a mandatory design-authenticity gate

- Status: current
- Decision: add `suede-design-authenticity` as a mandatory preflight and post-build gate for every material deck, UI, prototype and visual direction.
- Reason: the existing stack named human authorship and included an anti-slop visual skill, but still allowed a polished first generation to pass without proving a subject-specific point of view.
- Evidence: the five-question Figma test used editable Auto Layout and an anti-slop visual lead, yet its coloured rail, repeated rows, stacked uppercase labels and slogan fragments remained recognisable model defaults. Ethan rejected it as obvious, uninteresting and visibly AI-authored.
- Consequence: visual work must now establish real source anchors, three structural directions, rejected defaults, a reference delta and one content-native signature before build. The rendered artifact must then pass logo-swap, team-voice and subtraction checks and record a material human-directed change.
- Revisit when: two real SUEDE artifact cycles show that any rule blocks useful originality or fails to catch a repeated model default.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | The gate requires the visual direction to grow from the actual subject and sources. | The exact 2026 brief is still unavailable. |
| Problem identification | neutral | The gate preserves problem evidence but does not create it. | Visual distinctiveness could still distract from weak research. |
| Solution approach | strengthens | Product visuals must express the real mechanism instead of generic interface furniture. | A visual gate cannot validate whether the mechanism works. |
| Design innovation | strengthens | Structural divergence and the content-native signature resist first-answer convergence. | Novel styling can still be mistaken for a novel solution. |
| Visual communication | strengthens | The subtraction pass removes labels and containers that compete with the main job. | Over-subtraction could make a design safe or sterile. |
| Presentation skills | strengthens | Team-voice and thumbnail checks make the artifact easier to say, scan and remember. | Human taste still requires direct review. |
| Evidence quality | strengthens | The gate forbids fake evidence and requires source anchors plus a reference delta. | Authenticity remains a qualitative judgment, not objective proof. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Does anti-AI become a fixed anti-style? | The rules are warning signals with content-based override paths, not universal bans. | Observe whether agents become overly minimal. |
| Behaviour and context | Will it run before visual momentum locks the direction? | The repository contract now requires preflight before styling or Figma construction. | Teammates working outside the repository must follow the same habit. |
| Medium necessity | Does this need another tool or service? | No. A focused repository skill and templates are sufficient. | None. |
| Alternatives | Could the existing broad skill be tightened instead? | Broad skills cover many products; the new gate carries SUEDE-specific authorship, evidence and winner-reference rules. | Tool updates may eventually absorb these checks. |
| Human specificity | Does this preserve Ethan's taste rather than an agent's taste? | Human feedback or selection is a required input and post-render changes must be recorded. | A human still has to inspect candidate directions. |
| Inclusion and accessibility | Could unusual composition reduce access? | The signature fails when it harms legibility, and the judge gate still owns accessibility. | Artifact-specific accessibility checks remain required. |
| Trust, safety and privacy | Could AI contribution be hidden? | The existing AI contribution record and disclosure rules remain mandatory. | Official 2026 disclosure wording is unknown. |
| Failure and recovery | What happens when a render fails? | `Revise` permits only the named correction; `Reject` stops the visual direction. | Teams must resist polishing a rejected draft. |
| Feasibility and demo truth | Does the gate add heavy production overhead? | Three low-fidelity structural thumbnails and one screenshot subtraction pass are bounded. | Event-day speed should be observed. |
| Incentives and second-order effects | Could people game the checklist with arbitrary novelty? | The content-native surprise must improve understanding and fail if it is decorative. | Qualitative review remains necessary. |
| Simplicity and retellability | Is the gate understandable under time pressure? | It reduces to anchors, divergence, one signature, two decisive tests and subtraction. | A shorter event-day card may be useful after real use. |
| Authorship and distinctiveness | Can polished median work still pass? | Logo-swap and team-voice tests directly reject interchangeable visuals and model-like copy. | Only inspection of the final artifact can confirm the result. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: add the skill, make both gates mandatory, update templates and apply it to future Figma, UI and deck work.
- Blocking conditions: do not turn warning signals into a universal style ban; require a content-native surprise as well as subtraction; inspect the real render; keep human selection or redirection visible.
- Weakest judging angle: problem identification, because this gate protects the expression of evidence but cannot replace the evidence itself.
- Main trade-off: more deliberate authorship and distinctiveness at the cost of a short preflight and one required revision pass.
- Next evidence that could change the verdict: the next two real artifact cycles, including whether the gate catches generic output without flattening the design.
- Recommendation: activate the gate immediately and treat an attractive first generation as an exploratory draft, never the source of truth.

## 2026-09-04 - Require an idea dossier before material design

- Status: current
- Decision: every raw idea receives a quick intake, and every plausible contender must complete the `suede-idea-stress-test` workflow and `WIKI/IDEA_SCAFFOLD.md` dossier before selection or material UI, prototype or pitch work.
- Reason: the existing judging and design gates were comprehensive but fragmented. They could criticise an idea after it had momentum without first producing the detailed person, rule, cause, mechanism, viability, feasibility, state, risk and proof inputs needed for accurate design.
- Evidence: Ethan explicitly requested a form-like scaffold that examines ideas from every angle, compares them against the established criteria, includes a devil's advocate and improves first design output. A read-only audit found viability and design-input completeness to be the largest gaps in the existing idea template.
- Consequence: ideas now use a two-speed workflow. Sparks stay fast; only contenders receive the full dossier. The stress test prepares evidence and objections, while `suede-judge-review` retains final execution authority.
- Revisit when: the first live ideation session shows that a question adds no decision value, a missing lens repeatedly causes rework, or the official rules change the required proof.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | The current-brief section makes every idea locate and act on an unwritten rule rather than merely mention one. | The user-provided wording still needs official verification. |
| Problem identification | strengthens | The dossier requires a specific person, moment, current behaviour, consequence and cause ladder. | Completing fields cannot substitute for contact with real people. |
| Solution approach | strengthens | The mechanism and state map trace trigger, action, response, correction, payoff, failure and recovery. | The packet may create false confidence if hypotheses are not labelled. |
| Design innovation | strengthens | Four mechanism-level paradigms, medium necessity and inversion prevent app-feature convergence. | Teams may still secretly favour the first idea. |
| Visual communication | strengthens | Designers receive the communication job, real content, critical states, source anchors and anti-default constraints. | Too much input can flatten hierarchy unless the design brief identifies one dominant job. |
| Presentation skills | strengthens | Retellability, demo truth and the proof artifact are considered before slides begin. | Internal workbook language must not leak into the live pitch. |
| Evidence quality | strengthens | A claim ledger separates evidence, inference, assumptions, contradictions and falsification. | Evidence remains weak until the team gathers it. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Could the scaffold harden the first framing? | It requires cause questioning, four paradigms and explicit disconfirming evidence. | The facilitator must allow the framing to change. |
| Behaviour and context | Does it locate the rule in real behaviour? | It asks for the setting, trigger, signals, current workaround, enforcement and consequence. | Direct observation is still needed. |
| Medium necessity | Will detailed prompts still default to apps? | A credible non-app response and medium justification are mandatory before material UI. | The winning medium is idea-specific. |
| Alternatives | Are alternatives genuinely different? | The control, embedded, beyond-screen and inversion paradigms must differ by mechanism. | Weak facilitation could produce cosmetic variants. |
| Human specificity | Does the form produce a real person or a polished persona? | Fabricated personas and quotes are forbidden; missing evidence stays unknown. | Recruitment and access to relevant people remain open. |
| Inclusion and accessibility | Is inclusion embedded before UI? | The packet checks access, language, culture, power, stigma and the accessible equivalent of the critical action. | Actual testing depends on the selected context. |
| Trust, safety and privacy | Can revealing a rule expose people? | The brief-specific map asks about humiliation, coercion, surveillance, consent and accidental reinforcement. | Domain-specific harms will require added lenses. |
| Failure and recovery | What if the intervention is wrong or ignored? | The state map includes wrong input, missing data, decline, adversarial use, safe failure and recovery. | The real mechanism determines the credible fallback. |
| Feasibility and demo truth | Is the idea buildable and honestly demonstrable? | Dependencies are separated from prototype substitutes, simulation and future work. | Event duration and submission format need confirmation. |
| Incentives and second-order effects | Could the experience reinforce the norm? | The form asks who gains or loses power and how to detect reinforcement instead of change. | Effects after repeated use need real-world evidence. |
| Simplicity and retellability | Is a 463-line workbook usable under time pressure? | The two-speed workflow limits every spark to quick capture and reserves the full dossier for contenders. | The first event-day run will show what can be shortened. |
| Authorship and distinctiveness | Does detailed AI completion replace team thinking? | Human framing and selection remain mandatory, evidence cannot be invented and the design handoff includes source anchors and rejected defaults. | The team must actively edit rather than accept completed prose. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: activate the stress-test skill, use the quick intake for every spark and require the full dossier before a contender is selected or materially designed.
- Blocking conditions: preserve the two-speed workflow; leave unknowns visible; do not treat completion as evidence; require mechanism-level divergence; retain human selection and the separate judge verdict.
- Weakest judging angle: evidence quality, because the scaffold can expose missing proof but cannot supply it.
- Main trade-off: stronger concepts and more accurate design inputs in exchange for deliberate friction only after an idea becomes a contender.
- Next evidence that could change the verdict: one timed live ideation session using the new brief, including whether it produces materially different mechanisms and a clearer next test.
- Recommendation: use quick capture immediately, then run the full dossier only on the two or three directions that survive the first discussion.

## 2026-09-04 - Choose friendship appreciation as the working rule and problem direction

- Status: current
- Decision: focus the next exploration cycle on the unwritten rule that direct, deliberate appreciation between friends is not expected on an ordinary day and may be read as unusually intense, romantic, farewell-like, alarming or response-seeking. Treat a deliberately authored digital keepsake as solution territory only; the audience, mechanism, medium and product remain unselected.
- Reason: the team's discussion through question 29 repeatedly converged on appreciation already existing while expression, channel choice and anticipated interpretation create the difficult moment. The team also identified a possible gap between low-signal chat and high-friction physical letters.
- Evidence: the [latest meeting transcript](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md) records the convergence and personal examples. Published research in the [friendship-appreciation dossier](FRIENDSHIP_APPRECIATION_DOSSIER.md) supports a narrower sender prediction gap, but prevalence, receiver pressure, the target group and digital-medium advantage remain unverified.
- Consequence: the team may continue the question bank while parallelising evidence synthesis, direct research preparation, medium comparisons, reversible technical experiments and pitch infrastructure. It may not treat the digital letter, scrapbook or app as selected, begin material UI or make final claims before the relevant gates pass.
- Revisit when: questions 30–65 expose a different root cause or rule; direct sender and receiver evidence contradicts the framing; or a comparison shows ordinary chat, physical letters or a non-digital ritual performs better.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | The direction identifies a specific unwritten expectation and aims primarily to redesign it. | The exact official 2026 wording and preferred brief verb remain unverified. |
| Problem identification | strengthens | The team distinguishes existing appreciation from the moment of expression and interpretation. | The exact person, frequency, harm and enforcement mechanism lack direct evidence. |
| Solution approach | unknown | Keeping the solution open preserves room for a cause-matched mechanism. | The digital direction may already anchor later reasoning. |
| Design innovation | unknown | The rule offers richer territory than a generic messaging feature. | A digital letter or scrapbook alone is familiar and may only restyle the behaviour. |
| Visual communication | neutral | No visual direction is selected. | Premature polish could make the current candidate appear more valid than it is. |
| Presentation skills | strengthens | A shared working rule gives the team a clearer story to interrogate and retell. | A clean story could hide unresolved evidence. |
| Evidence quality | unknown | The meeting provides authentic team anecdotes and a traceable rationale. | Most claims remain internal interpretation; no project test is planned or completed. |

### Challenge review

| Challenge lens | Strongest challenge | Current answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Appreciation may already be visible through action rather than words. | The direction does not treat action-based care as deficient, and people who do not want explicit appreciation may sit outside the eventual audience. | Which alternative cause best explains the behaviour? |
| Behaviour and context | “Friendship” and “ordinary day” are still broad. | The difficult moment is provisionally expression, channel choice and anticipated interpretation. | Which real person and repeated situation should lead? |
| Medium necessity | Digital may be a worse physical letter or an overproduced text. | It is only a candidate territory and must win a matched comparison. | What digital-only value preserves meaning? |
| Alternatives | Text, voice, physical letters, practical care and social rituals may perform better. | Each remains a control rather than a dismissed workaround. | Which option best changes the rule? |
| Human specificity | Some people dislike direct sentiment or use other care languages. | They are not assumed to share the problem. | Who actively wants this expression but lacks a workable channel? |
| Inclusion and accessibility | Culture, disability and communication style can change the meaning of direct care. | Later design must support multiple forms and accessible equivalents. | Which differences materially change the rule and flow? |
| Trust, safety and privacy | Contact may be unwanted, exposed or emotionally coercive. | Receiver agency and consent are requirements, not later polish. | What refusal, deletion and privacy model is safe? |
| Failure and recovery | A message may be read as crisis, romance, farewell or obligation. | Those are central test conditions. | Can the experience correct a misreading without making it worse? |
| Feasibility and demo truth | Rich media can produce spectacle without proof. | Only disposable feasibility work is currently allowed. | What smallest working flow proves the social mechanism? |
| Incentives and second-order effects | The idea could create reply debt, performance or an effort arms race. | The receiving contract and repeated-use effects stay open. | Does the intervention reduce or intensify those effects? |
| Simplicity and retellability | Several supporting rules may blur the primary one. | One ordinary-day appreciation rule leads; reciprocity and effort are supporting rules. | Can outsiders repeat the rule without the product explanation? |
| Authorship and distinctiveness | AI or templates could manufacture intimate expression. | Humans own intimate content, selection, testing and final design. | What assistance remains authentic to both people? |

- Verdict: Proceed with conditions
- Work permitted by this verdict: continue question-led framing; build an evidence ledger; prepare and run consent-safe sender/receiver research; compare matched media; audit precedents; create rough, disposable stimuli and technical spikes; prepare the source, Q&A and deck infrastructure.
- Blocking conditions: label internal conclusions as hypotheses; keep at least four mechanism-level alternatives alive; do not select the digital letter or build polished UI, production architecture or a final pitch; pass a new judge review before material design.
- Weakest judging angle: evidence quality, because the team has conviction and anecdotes but no direct external validation or completed test.
- Main trade-off: parallel preparation saves time, but visible digital artefacts could anchor the team before the cause and medium are proven.
- Next evidence that could change the verdict: separate sender and receiver reactions to the same specific appreciation delivered through ordinary chat, a physical/crafted control and a rough digital artefact.
- Recommendation: treat this as a chosen investigation, not a chosen product, and use the next cycle to make the rule and medium earn commitment.

## 2026-09-05 - Replace the narrow prototype control with a review-first rich concept

- Status: current
- Decision: rebuild the next reversible friendship-appreciation prototype around one authored digital care package / sendable scrapbook, using a single white creator studio, private handoff, deliberate opening into a deep-navy receiver object, and a receiver-owned ending; complete and review the conceptual specification before restarting UI implementation.
- Approval: Ethan approved all fourteen conceptual conditions on 5 September 2026. Fresh implementation is now permitted under the conditions below.
- Reason: Ethan rejected the first field-by-field prototype as the boring version of the idea and required a complete transcript ingest. The late recordings repeatedly describe creative composition, mixed media, intentional opening, receiver ownership, and later replay, while keeping exact vessel, media limits, and persistence unresolved.
- Evidence: [complete transcript ingest](FRIENDSHIP_APPRECIATION_TRANSCRIPT_INGEST.md), [conceptual prototype specification](FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md), and Ethan's direct 5 September instructions selecting the transcript-first restart, real coded product, white-then-navy sequence, Ugly Handwriting, and supplied handmade visual grammar without `grug` identity.
- Consequence: the previous wizard is no longer a design source. Fresh UI implementation may now proceed; it must remain a labelled stimulus, use one coherent creator surface and object treatment, preserve open decisions, and pass post-build judge and authenticity review before becoming selected direction.
- Revisit when: Ethan or the team changes any of the fourteen approval decisions, a rendered prototype exposes a conceptual failure, or sender/receiver testing changes the problem or medium.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | A finite object and receiver-owned ending attempt to redesign the conditions around an ordinary-day friendship rule rather than merely explain it. | The official 2026 wording and rubric still need organiser verification; a beautiful object could still only decorate the existing rule. |
| Problem identification | strengthens | The direction retains one specific moment: a person has an appreciative thought, predicts ambiguity, chooses a channel, and considers the receiver's response burden. | Frequency, affected group, primary cause, and receiver interpretation have not been established outside the team. |
| Solution approach | strengthens | One living creator studio better expresses personal effort than the rejected form wizard, while the opening and ending make the receiving contract visible. | Rich authoring, no-reply structure, and archive are several mechanisms at once; the prototype alone cannot identify which one causes any response. |
| Design innovation | strengthens | The combination of authored mixed-media object, white-to-navy threshold, and receiver-controlled ending is more distinct than a digital card or scrapbook editor alone. | Digital cards, scrapbook tools, letters, and private archives all exist; distinctiveness depends on the whole interaction rather than feature novelty. |
| Visual communication | strengthens | White making/unopened states and a navy receiver state give colour a legible narrative job. Sparse handwriting and human-drawn marks support authorship. | Handmade styling can become an authenticity costume or reduce legibility if it is not tied to real content and interaction. |
| Presentation skills | strengthens | The experience has a concise before/after story and a memorable working QR/link demonstration centred on the opening threshold. | A theatrical reveal could overshadow the rule, evidence, and receiver outcome. |
| Evidence quality | unknown | The complete transcript ingest accurately reconstructs team intent and labels direct instructions, convergence, proposals, and open branches separately. | No external participant has validated the need, medium, no-reply effect, or cabinet; transcript conviction is not user evidence. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | What if appreciation needs no object, or a reply is part of care rather than debt? | Text, voice, physical letters, action, and doing nothing remain valid controls; the object is a reversible test condition. | Receiver comparison is needed before closure can be claimed as beneficial. |
| Behaviour and context | Does a separate creator studio live too far from the moment where the thought occurs? | The private link lets the artifact travel through existing channels while preserving a distinct receiving space. | Whether senders will leave chat and invest in composition remains untested. |
| Medium necessity | Is this just a worse physical letter or overbuilt message? | Voice, image, music, motion, replay, distance, and accessible alternatives are credible digital contributions identified repeatedly by the team. | Which one is necessary rather than decorative has not been established. |
| Alternatives | Could a voice note, card, letter, shared album, or simple chat label solve the same problem? | The conceptual spec explicitly keeps them as controls and does not claim universal superiority. | A matched sender/receiver comparison is still required. |
| Human specificity | Will a flexible maker surface serve people who are not designers or comfortable with sentiment? | Optional cues and a constrained material palette can support creation without writing for the person. | The right balance between freedom and guidance needs observation with real makers. |
| Inclusion and accessibility | Can handwriting, freeform layout, sound, motion, and colour remain usable? | The concept requires readable critical copy, text alternatives, manual playback, receiver-controlled pacing, and a direct reduced-motion path. | The actual render and assistive-technology path do not exist yet. |
| Trust, safety and privacy | Could a private artifact enable unwanted, coercive, romantic, or crisis-coded contact? | V0 is scoped to known intact relationships; sender identity, leave/remove, no public surface, and no telemetry are structural boundaries. | A real service still needs identity, blocking, expiry, revocation, forwarding, deletion, and abuse policies. |
| Failure and recovery | What if the link is wrong, media fails, or opening increases alarm? | The conceptual spec leaves the receiver free to leave and keeps content private until opening; technical recovery remains outside this conceptual review. | Wrong-recipient handling, media fallback, and interpretation repair need later specification and testing. |
| Feasibility and demo truth | Can the rich studio and mixed-media object be made credibly in the event time? | The concept can be demonstrated through one realistic authored object while leaving full editor breadth simulated and labelled. | The approved media set determines build scope; simulated behaviour must not be presented as complete. |
| Incentives and second-order effects | Could artifacts create an effort arms race, storage burden, or a new expectation to reciprocate? | No scores, prompts, public comparison, or sender state exist; keep, close, and remove are private options. | Repeated-use effects and whether the cabinet itself creates pressure are unknown. |
| Simplicity and retellability | Does “mixed-media care package with closure” contain too many ideas? | The one-sentence concept centres making, giving, receiving, and receiver ownership; media are expressive ingredients rather than the headline. | The first outsider retell test may still reduce it to “digital scrapbook.” |
| Authorship and distinctiveness | Can AI-generated UI and handwriting still look synthetic? | Ethan selected the source anchors, rejected the first generated layout, required a fresh ingest, and set a specific white-to-navy signature move; intimate content stays human-authored. | Only the rendered artifact plus material team edits can pass the post-build authenticity gate. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: build one fresh reversible coded prototype from the approved conceptual specification.
- Blocking conditions: no inheritance from the old wizard; no validation claims; keep media limits, object vessel, firefly, acknowledgement, and persistence visibly editable; do not generate intimate copy; use one declared visual lead and one coherent v0 object; run full post-build judge, accessibility, and authenticity reviews.
- Weakest judging angle: evidence quality, because the record supports team intent but no participant has confirmed the problem or the proposed mechanism.
- Main trade-off: the richer concept finally expresses the team's ambition and digital-medium thesis, but combines enough mechanisms that later testing must carefully separate what caused any reaction.
- Next evidence that could change the verdict: Ethan/team review of the fourteen conceptual decisions, followed by one consented sender/receiver walkthrough compared with an ordinary message.
- Recommendation: review the conceptual spec now, select the v0 vessel/material/ending choices, then build a single complete maker-to-receiver experience without repairing the old layout.
- Revisit when: the review or first walkthrough materially changes the concept.

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
