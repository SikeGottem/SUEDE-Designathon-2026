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

## 2026-09-05 - Run a scoped carrier-and-opening prototype delta

- Status: current, reversible test only
- Decision: implement bottle, firefly, and paper plane as a small hand-drawn carrier set in a horizontal browse after the maker has composed the message; let the selected carrier change handoff, arrival and opening choreography; keep Preview exterior-only; test the bottle with a cork swipe/drag and a simple explicit-open fallback; use the firefly only as a one-shot courier/carrier action to pick up the selected carrier, fly away, and later drop it at arrival slowly enough for the transport to read; test double-tap opening with an equally direct visible/keyboard/reduced-motion fallback that unfolds directly into the full composed object; omit bottom navigation; show the cabinet as distinct physical objects; keep a rich Figma/scrapbook-like creator with restrained colour, sticker materials, and a small still-undefined page-design/page-character variation while writing stays central; use white with navy ink before opening and full navy/off-white afterward; use Gaegu as working type; leave exact palette, sticker set, variation taxonomy, and receiver-led optional media reveal open.
- Scope boundary: this supersedes the earlier single folded/sealed object and no-picker approval **only for this reversible test**. It does not overturn the conceptual direction or establish a validated product decision.
- Reason: Ethan's newer direct implementation instruction makes the 4 September team's unresolved visual exploration concrete enough to test without promoting it to user evidence.
- Evidence: [4 September carrier and receiving meeting capture](TRANSCRIPTS/2026-09-04-d5e3d4ea-70d8-55cc-9baa-d319ad5e7e1c.md), supplied mockups/reference inspected as design inputs, Ethan's newer direct instruction, [4 September ritual correction](TRANSCRIPTS/2026-09-04-913ddc06-3a86-513e-a05c-3c0bbe1d4312.md) at 04:21–07:58, [render correction](TRANSCRIPTS/2026-09-04-2d8ab5ab-b58f-5864-98e7-b63865cb6c37.md) at 15:29–17:56, [sequencing correction](TRANSCRIPTS/2026-09-04-4ef45d20-2643-5baa-97e2-ea66e5810701.md) at 03:26–05:24, [customization/direct-reveal correction](TRANSCRIPTS/2026-09-04-bbc5485c-837c-538c-b9e0-855e7aec8060.md) at 01:59–05:28, then [firefly replacement](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md) at 00:18 and 04:59, and the later [page-variation request](TRANSCRIPTS/2026-09-04-0c2a02aa-848e-5dae-9fe0-339d566da09a.md) at 00:00. No live Figma file was read; no participant evidence was collected.
- Consequence: implementation may make one labelled carrier-flow prototype, while retaining the direct leave/close/remove path, no reply/telemetry contract, and the richer authored creator. The firefly is a one-time transport action with separate wing/payload layouts, not a persistent mascot; path guides are not final UI. Carrier choice follows composition rather than interrupting it, and unfolding reveals the completed object directly. Colour, stickers, and a small page-design/page-character variation are optional authored materials, not generic theme controls or a template market. It may not claim a carrier, courier, unfolding gesture, post-composition sequence, customization, or page variation improves meaning, clarity, agency, or desirability.
- Revisit when: a receiver comparison against the folded-object baseline or another simple control exposes a material difference in comprehension, comfort, agency, or desired next action.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | mixed | The test makes the object and opening rule legible. | It may become surface novelty rather than a rule-changing mechanism. |
| Problem identification | neutral | The original appreciation moment remains intact. | No new user evidence identifies a carrier as the relevant barrier. |
| Solution approach | strengthens | Carrier-specific choreography lets the team compare a concrete receiving ritual. | Several changed cues could obscure what caused a response. |
| Design innovation | strengthens | Physical distinctness and an opening action avoid a generic message screen. | A container picker can regress into a familiar themed-card product. |
| Visual communication | strengthens | Composition-first sequencing, direct unfold-to-object, and optional authored materials make the critical action and personal choices easier to see. | Colour/stickers, handwriting, the cork gesture, unfolding, or page variation may reduce clarity or access. |
| Presentation skills | mixed | A bottle opening can make the demo memorable. | The reveal can eclipse the problem and receiver outcome. |
| Evidence quality | weak | The 4 September capture records real team intent. | It is not user research; the visual choice has no receiver evidence. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | What if a carrier adds pressure or means nothing? | It is a reversible presentation condition, not a product claim. | Receiver interpretation. |
| Behaviour and context | Does choosing a carrier interrupt the moment of expression? | The maker composes before choosing the delivery treatment. | Whether the revised order actually feels more natural. |
| Medium necessity | Could an ordinary link work as well? | It remains an essential comparison control. | Whether choreography earns digital complexity. |
| Alternatives | Why bottle, not folded object or no vessel? | The earlier folded object stays the baseline outside this test. | Comparative receiver preference and comprehension. |
| Human specificity | Do different friendship styles read carriers differently? | No universal meaning is assumed. | Which contexts are comfortable or alienating. |
| Inclusion and accessibility | Can gesture, colour, handwriting, and unfolding be used by everyone? | Direct open, readable critical copy, and reduced-motion equivalence are required. | Actual assistive-technology and usability testing. |
| Trust, safety and privacy | Could the courier obscure unwanted contact? | Sender identity and private leave/remove routes remain structural. | Real identity, blocking, and abuse policy. |
| Failure and recovery | What if the cork gesture fails? | The simple explicit-open fallback reaches the same content. | Failure handling for media and wrong recipients. |
| Feasibility and demo truth | Can this ship without fake breadth? | Limit the carrier set and keep colour/sticker/page-variation materials restrained and honestly scoped. | Event-time build cost, interaction polish, asset breadth, and an undefined variation taxonomy. |
| Incentives and second-order effects | Does a cabinet or carrier create collecting pressure? | No scores, prompts, public state, or mascot loop are allowed. | Repeated-use and storage burden. |
| Simplicity and retellability | Is this too much to explain? | The story remains make, give, open, keep/leave. | Whether people reduce it to a themed digital card. |
| Authorship and distinctiveness | Could it look like an AI mascot/template system? | Firefly is one-shot; icons are hand-drawn and carrier-specific; page variation stays maker-authored rather than a template market. | Whether the final render feels team-authored rather than decorative. |

- Verdict: Proceed with conditions
- Work permitted by this verdict: build and review one labelled carrier-and-opening delta alongside the approved experience.
- Blocking conditions: keep the carrier set to bottle, firefly, and paper plane; let the maker compose before carrier choice; preview only the carrier exterior; no persistent mascot, bottom navigation, package marketplace, sender telemetry, reply pressure, visible path guides, or validation claims; provide a visible direct opening fallback alongside double-tap, unfold directly into the composed object, keep colours/stickers and any page variation restrained and maker-authored, and retain the folded-object baseline as a comparison condition.
- Weakest judging angle: evidence quality, because the new detail is based on team intent and mockups, not receiver evidence.
- Main trade-off: a more memorable, physically legible receiving ritual costs clarity and may hide whether the underlying no-reply contract works.
- Next evidence that could change the verdict: a consented receiver comparison of the carrier delta against the folded-object baseline, measuring comprehension, comfort, pressure, agency, and desired next action.
- Recommendation: proceed as a contained prototype condition, then choose or discard it on receiver evidence rather than internal enthusiasm.

## 2026-09-05 - Correct the prototype toward a sparse, mobile paper-sheet experience

- Status: current correction; prototype direction remains reversible.
- Supersession note: the bordered, rail-led Studio treatment below is superseded by the later full-screen composer decisions. Its paper-first visual premise is restored by the newest correction; its home, carrier, cabinet, motion, deck, and evidence constraints remain current.
- Decision: keep the small carrier-picker test, deliberate opening, receiver keep/close/remove paths, and physical cabinet. Correct the render by removing the home-loop ornament, bottom-centring the core home invitation/action, removing carrier backdrop paths and mascot/helper copy, increasing negative space, and using purposeful motion only. Rebuild the creator as one mobile paper sheet with a dominant writing layer plus a compact scrollable material rail/progressive disclosure. Keep preview's “ready to give” role, but leave its hero artwork open pending Ethan's supplied screenshot. Prioritise team-drawn recurring assets whose line weight belongs with Gaegu. Do not build a 3D tree archive. For the deck, establish layout/story first, use AI only to refine bounded treatments, and ensure the presentation works silently.
- Reason: the team reviewed the first rich coded pass and found it visually noisy, AI-looking, crowded on mobile, and insufficiently resolved despite preserving the desired overall flow. The later direct critique governs overlap.
- Evidence: [65e72fa1…](TRANSCRIPTS/2026-09-04-65e72fa1-b8b1-5b23-869d-dd63f1a92d6b.md), created `2026-09-04T15:25:25.181Z`, records the paper-sheet/scroll-rail discussion (32:28–33:40), retained opening/keep/cabinet (33:40–34:16), line-weight/artwork correction (15:50–16:28; 26:40–27:39), 3D-tree rejection (07:48–10:08), and silent/layout-first deck direction (25:50–26:19; 30:21–30:58). The later [4bf6522b…](TRANSCRIPTS/2026-09-04-4bf6522b-ed6e-5d7d-a2d6-62ec7981fd4e.md), created `2026-09-04T15:27:36.809Z`, directly rejects the home loop, carrier ornament/helper copy, crowded maker page, and current preview hero while retaining the carrier premise and cabinet (01:26–03:17).
- Consequence: a correction pass may replace the affected home, carrier, studio, and preview visual treatment. It must not add new carrier breadth, mascot loops, a 3D archive, sender telemetry, reply pressure, product claims, or a final-brand claim. The cabinet/receiver contract remain in scope but are not a redesign target.
- Revisit when: Ethan supplies the promised preview screenshot, the team approves/rejects the new mobile composition, a rendered post-build review exposes another mismatch, or a receiver walkthrough challenges the carrier/opening premise.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | Reducing interface decoration keeps attention on the unwritten-rule intervention rather than a themed app shell. | The official 2026 brief/rubric still need confirmation. |
| Problem identification | neutral | The correction does not alter the ordinary-day appreciation framing. | Internal visual critique provides no new evidence about the problem's prevalence or affected group. |
| Solution approach | strengthens | A clearer one-sheet creator makes the authored-object mechanism easier to inspect on a mobile device. | Whether the rich creator actually lowers expression friction remains untested. |
| Design innovation | mixed | Carrier choreography plus the white-to-navy opening remain distinctive when stripped of generic ornament. | It may still be described as a themed digital card without a real receiver comparison. |
| Visual communication | strengthens | Removing loops/backdrops/helper copy creates a single focal object and room for team-drawn linework. | Hero artwork is intentionally unresolved; no final visual selection is claimed. |
| Presentation skills | strengthens | Layout-first, silent-safe storytelling reduces the risk that a demo needs music or explanation to land. | The final pitch narrative and slide design have not been reviewed. |
| Evidence quality | unknown | Sources are timestamped internal design review and are labelled as such. | No participant has evaluated the correction, authenticity, accessibility, carrier meaning, or no-reply effect. |

### Challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | What if a sparse interface removes useful making guidance? | The correction retains optional prompts and materials behind progressive disclosure rather than eliminating support. | Observe whether non-designers can start and finish a composition. |
| Behaviour and context | Does bottom-centred home copy make the entry task clearer in the actual use context? | It follows the team's direct critique of the rendered page, not a user claim. | Sender comprehension and motivation remain untested. |
| Medium necessity | Does simplification make the product merely a prettier message? | The object, mixed-media potential, opening threshold, and receiver-owned ending remain intact. | Which digital ingredient earns the medium has not been isolated. |
| Alternatives | Would a simple text/voice note work better than the paper-sheet composer? | Those remain explicit controls; this is a reversible prototype correction, not a superiority claim. | A matched comparison is still required. |
| Human specificity | Could Gaegu-matched handmade assets become an aesthetic costume? | The requirement is tied to team-drawn recurring objects and sender-authored content, not decorative noise. | The final team assets and actual recipient interpretation are unknown. |
| Inclusion and accessibility | Could a compact scroll rail or gestural motion hide content or controls? | Materials remain disclosed by explicit controls; purposeful motion must keep direct/reduced-motion alternatives. | Full mobile screen-reader, keyboard, contrast, and touch testing is still needed. |
| Trust, safety and privacy | Does the correction weaken receiver agency? | No; opening fallback, defer/close/remove, no reply, and no telemetry remain unchanged. | Real identity, forwarding, expiry, deletion, and abuse controls are outside this prototype. |
| Failure and recovery | What if the new hero/asset pass still looks synthetic or the mobile sheet overflows? | Stop at artifact review and replace only the named visual layer; do not expand the feature set to hide it. | The supplied preview screenshot and a full rendered audit are pending. |
| Feasibility and demo truth | Is a 3D tree or audio-dependent pitch needed to communicate the idea? | The team explicitly rejected the tree as low-leverage for the sprint and requires a silent-safe presentation. | Actual event time and delivery constraints remain uncertain. |
| Incentives and second-order effects | Could richer motion/objects create collection pressure or spectacle? | Motion is constrained to a product job; cabinet remains optional and no collecting mechanics are added. | Repeated-use effects and storage pressure need receiver research. |
| Simplicity and retellability | Does carrier choice make the journey too complicated? | The story stays make, give, open, keep/leave; carrier is a small reversible choreography layer. | Test whether outsiders can retell the no-reply/receiver-ownership distinction. |
| Authorship and distinctiveness | Could AI still determine the look despite team input? | The correction prioritises team-drawn assets, direct team critique, source references, and layout-first human story decisions. | The final render needs a post-build authenticity review and material team edits. |

- Verdict: **Revise / Proceed with conditions**
- Work permitted by this verdict: correct the named home, carrier, studio, preview and presentation-treatment layers; retain the opening and cabinet flow; make bounded motion and team-asset substitutions.
- Blocking conditions: do not call a visual treatment final before the promised preview reference and a rendered authenticity review; no 3D tree, persistent mascot, decorative backdrop paths, audio-dependent pitch, new carrier marketplace, validation claim, or scope expansion.
- Weakest judging angle: **evidence quality**, because the correction is grounded in internal team critique rather than sender/receiver research.
- Main trade-off: stronger focus, mobile clarity, and a more team-authored look in exchange for removing visible guidance and delaying final hero-art selection.
- Next evidence that could change the verdict: Ethan's screenshot/reference for preview, a mobile render review, and a consented receiver walkthrough against the folded-object baseline.
- Recommendation: rebuild the named surfaces now, then audit the actual render before making any visual language or carrier outcome permanent.

## 2026-09-05 - Test a full-screen, capture-first Story composer

- Status: superseded in part by the paper-first correction below; full-screen, sparse direct manipulation remains current.
- Decision: replace the bordered paper-form Studio with a full-screen creation mode. Enter through immediate photo/video capture or blank paper, move straight into one sparse canvas, and let selected words and materials move, rotate, edit and remove in place. Keep tools contextual and at thumb reach. Borrow the speed and direct-manipulation model of Instagram Stories without copying Instagram branding, social posting, expiry, views, reactions, replies, or feed behaviour.
- Reason: the newest team review identifies the creation board as the unresolved core UX problem and explicitly says the earlier creator was the weakest screen because its interaction model had not been designed. Ethan then made full-screen entry and immediate filming the highest-priority prototype requirement.
- Evidence: [d4b7ec93… 20:03–22:18](TRANSCRIPTS/2026-09-04-d4b7ec93-efb6-516d-99da-c84cfa746154.md), created `2026-09-04T15:51:31.829Z`, plus Ethan's direct 5 September clarification in the active build session.
- Consequence: the current prototype may implement local browser camera/photo/video capture, device-media and honest fallback paths, a full-screen canvas, sparse tools, movable/rotatable layers, and draft continuity through preview/reveal. It may not claim this is as usable as Instagram Stories until real-phone testing supports that claim.
- Revisit when: a teammate completes the flow on a real phone, camera permission or touch gestures fail, the canvas feels more like Canva than a Story, or receiver testing shows the captured-media object weakens rather than strengthens intentionality.
- Review boundary: Ethan explicitly asked to proceed with the prototype test before the deferred reviews. This authorises the reversible build only; it does not approve a final product, visual system, usability claim, or pitch claim.

## 2026-09-05 - Correct the Story composer to be full-screen and paper-first

- Status: current exploratory implementation decision; not validated or final.
- Decision: keep the full-screen, sparse, direct-manipulation creator, but open on a visibly physical blank paper surface rather than a live camera. Use restrained hand-drawn paper lines, never faux paper texture. Make camera/photo/video optional; captured media lands as a small movable Polaroid-like item. Replace the placeholder drawing material with real freehand doodling. Rework the control order around paper, optional material, arrangement, and finish.
- Supersedes: only the capture-first entry, full-screen captured-media background, and literal Story-camera interpretation of the preceding decision. It does not supersede full-screen focus, movable/rotatable pieces, contextual controls, non-social boundaries, carriers, opening, cabinet, or the receiver contract.
- Reason: the first literal implementation was reviewed and found to go too far toward Instagram. The later team captures say the paper version is better, the camera should not lead or fill the screen, paper texture is tacky, button order remains weak, and drawing must be real.
- Evidence: [d4ea28f5… 34:35–39:56](TRANSCRIPTS/2026-09-04-d4ea28f5-a996-57e1-adbe-69726a64f356.md) and the later [a9499b3d… 03:55–07:17](TRANSCRIPTS/2026-09-04-a9499b3d-07e2-5182-bdfd-a9a85f9860db.md). These are internal team review captures, not user research.
- Consequence: the prototype may render a full-screen paper-first Studio, optional local media as movable Polaroid-like material, and functional freehand drawing. It must not auto-request camera permission, use camera capture as the entire canvas, imitate Story capture chrome, add decorative paper texture, or claim that the new ordering is proven easier.
- Revisit when: a teammate creates a complete object unaided on a real phone, especially testing whether they understand how to begin writing, add a memory, make a doodle, arrange it, and finish.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | neutral | The correction preserves the appreciation intervention and receiver contract. | The official 2026 rubric remains unconfirmed. |
| Problem identification | neutral | It changes creator interaction, not the ordinary-day appreciation framing. | No sender evidence shows paper-first lowers hesitation. |
| Solution approach | strengthens | Paper-first keeps the authored letter/scrapbook premise visible while media remains expressive material. | The revised order may still confuse a first-time maker. |
| Design innovation | strengthens | It avoids a generic Story clone without removing direct manipulation. | A Polaroid treatment could still become decorative convention. |
| Visual communication | strengthens | One paper focal surface makes the creator read as an object rather than a camera product. | Exact ruling, drawing treatment, and control hierarchy remain untested. |
| Presentation skills | strengthens | The demo can show a clear authored surface before media enters. | A polished prototype can still overstate real usability. |
| Evidence quality | weak | The change is supported by later internal review with direct render critique. | No intended user has compared the two creator models. |

- Verdict: Revise / Proceed with conditions.
- Work permitted: one reversible paper-first creator correction, including actual freehand drawing and optional Polaroid media.
- Blocking conditions: no validation claims, no camera-first permission request, no photo-background canvas, no faux paper texture, no literal Instagram chrome, and no expansion of social or sender-tracking mechanics.
- Next evidence: a real-phone maker walkthrough compared with the prior capture-first flow.

## 2026-09-05 - Approve the authored envelope-and-seal flow

- Status: current exploratory implementation decision; not validated or final.
- Decision: approve the current next-prototype core: firefly replaces the ladybug; makers choose a small paper character, preserve their exact composition into receiving, and use handwriting-style typing with recoverable strike-through Backspace; on completion the letter folds, the maker selects and decorates a deliberately small envelope, draws/applies a personal seal, then chooses a carrier and sends; the coded demo uses a real receiver link/QR; and the receiver cabinet retains multiple distinct objects. Carrier-specific opening rituals and receiver-led optional-media reveal are parked. Cecelia's supplied firefly/logo assets at `/Users/ethanwu/Downloads/Warm and Fuzzy- Firefly Logo Assets` are the authoritative current hand-drawn inputs.
- Reason: Ethan explicitly approved items 1–11 from the outstanding-ideas list and clarified that the envelope is as meaningful an authorship surface as carrier choice, while the letter should behave more like physical handwriting than a generic text field.
- Evidence: Ethan's direct 5 September build-session approval; earlier firefly and personalisation captures [166f8cfb…](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md) at 00:18 and 04:59 and [0c2a02aa…](TRANSCRIPTS/2026-09-04-0c2a02aa-848e-5dae-9fe0-339d566da09a.md) at 00:00. These are team direction, not participant validation.
- Consequence: implementation may add only the bounded flow **make letter → fold → decorate envelope + custom seal → choose carrier → send**, along with the real demo route, multi-object cabinet and asset replacement. It must not add a template/package market, a persistent mascot, a social response loop, untested carrier rituals, or receiver-media mechanics.
- Revisit when: a maker and receiver complete the full flow on a real phone; link/privacy/storage limits are specified; or the envelope step begins to feel like decorative labour rather than authored meaning.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | strengthens | The flow communicates and redesigns the ordinary-day appreciation rule through a visible making and giving ritual. | Official 2026 judging detail remains unverified. |
| Problem identification | strengthens | The envelope gives the maker another deliberate way to make direct appreciation feel considered rather than abrupt in chat. | No intended maker has said this reduces awkwardness. |
| Solution approach | strengthens | A bounded letter-to-envelope-to-carrier sequence makes authorship, transfer and receiving legible. | Extra stages may add friction without improving meaning. |
| Design innovation | strengthens | The envelope is authored after the actual letter, rather than a generic greeting-card skin or theme picker. | It can still collapse into a decorative digital-card convention. |
| Visual communication | strengthens | Folding and sealing make the same composed object visibly carry through to arrival. | Cecelia's assets and page/envelope hierarchy still need rendered review. |
| Presentation skills | strengthens | The flow is retellable and demos cleanly through one link/QR. | A theatrical demo could hide the unresolved social problem. |
| Evidence quality | weakens | Direct team approval is clear and sources show the direction's evolution. | There is no sender/receiver comparison, privacy test, or evidence that every feature earns its cost. |

### Required challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Does more decoration automatically mean more care? | Keep envelope choice and seal-making intentionally small and optional-looking. | Whether people experience the stage as meaning or pressure. |
| Behaviour and context | Does a maker have time to make this when the thought occurs? | The flow starts with writing and keeps tools direct; carrier choice remains after expression. | Real completion time and abandonment. |
| Medium necessity | Could a real envelope or ordinary link do the job? | Digital can preserve one composition, private access and a replayable multi-object cabinet. | Whether that advantage outweighs physical or chat alternatives. |
| Alternatives | Could a card, voice note or shared album work better? | They remain legitimate controls; this prototype does not claim universal superiority. | Comparative sender/receiver preference. |
| Human specificity | Do all friendship styles welcome deliberate sealing? | The product serves a voluntary, ordinary-day appreciation moment without requiring reciprocity. | Cultural, accessibility and relationship-context differences. |
| Inclusion and accessibility | Does handwriting/strike-through exclude people or make correction unsafe? | An accessible undo/restore path and reduced-motion/direct-opening routes are mandatory. | Screen-reader, keyboard and motor testing of the actual build. |
| Trust, safety and privacy | Can a private-looking link overpromise confidentiality? | The prototype may demonstrate a real route but must label unsolved privacy, expiry, size and storage limits honestly. | Authentication, wrong-recipient, abuse and deletion model. |
| Failure and recovery | What happens after accidental Backspace or a bad seal choice? | Makers need quiet return/edit and undo/restore paths; receivers retain leave/close/remove routes. | Whether recovery is discoverable without breaking the physical-writing feeling. |
| Feasibility and demo truth | Can link, QR, assets and cabinet be made real within the sprint? | Implement one bounded flow and distinguish working demo behaviour from service guarantees. | End-to-end deployment and persistence verification. |
| Incentives and second-order effects | Could envelopes create an effort arms race or cabinet burden? | No rankings, scores, templates, prompts or sender telemetry are permitted. | Whether repeated use creates reciprocity pressure. |
| Simplicity and retellability | Is the sequence too long to explain? | One sentence remains: make a letter, make its envelope, choose how it travels, let them receive it. | First-time comprehension and time-on-task. |
| Authorship and distinctiveness | Could code or AI determine the product's apparent handmade quality? | Cecelia's supplied hand-drawn masters and maker-created words/seals are the required visual/content sources. | Human asset integration and post-render authenticity review. |

- Additional domain lens: link transport and personal-media storage.
- Why it is material: the object can carry intimate words, images, recordings and a receiver-facing link.
- Challenge, evidence-backed answer and unknown: the demo may use a real link/QR, but it must not claim encryption, authentication, indefinite storage, delivery reliability, or size limits until those behaviours exist and are tested.
- Verdict: Proceed with conditions.
- Work permitted by this verdict: implement the approved bounded flow and substitute Cecelia's supplied assets; keep the parked ideas out of the current pass.
- Blocking conditions: document and truthfully expose privacy/size/expiry/storage limits for link transport; provide accessible, non-invasive recovery for strike-through typing; preserve reduced-motion and direct interaction fallbacks; keep paper, envelope, seal and carrier choices small enough that they do not become a marketplace; do not call direct approval user validation.
- Weakest judging angle: evidence quality, because the choices are direct team decisions rather than tested user findings.
- Main trade-off: richer visible authorship and a clearer ritual in exchange for more completion friction and additional transport/storage responsibility.
- Next evidence that could change the verdict: one observed maker-to-receiver walkthrough, including accidental correction, envelope choice, link opening, and cabinet revisit.
- Recommendation: build the bounded sequence now, then test its friction and honesty before treating the ritual or link model as product truth.
- Revisit when: the first full real-phone walkthrough, privacy/storage implementation decision, or post-build authenticity/accessibility review.

## 2026-09-05 - Adopt Cecelia's current brand board for the prototype

- Status: current prototype visual direction; team-authored but not user-validated or a complete final identity.
- Decision: use Cecelia's supplied Gaegu/`warm & fuzzies` board as the current colour source of truth: deep ink `#081F4D`, steel blue `#5B7A85`, rust `#B56D5F`, ochre `#EDA343`, olive `#9F9D81`, and pale cream `#F9F9D8`. Keep literal white for making and unopened states, then cross into deep ink on opening. Use deep ink for small functional copy; use steel and the accent colours for large identity marks and restrained authored materials. The full envelope surface is the envelope itself, and a custom seal is optional rather than a progression gate.
- Reason: the board is direct human design work from the team and gives the prototype a coherent palette without losing the already-selected white-to-dark receiving threshold. Ethan directly marked it as the new branding and rejected the nested-envelope treatment and seal-gated progression in the same review.
- Evidence: [Cecelia's supplied brand board](REFERENCES/2026-09-05-cecelia-brand-board.png), Ethan's direct 5 September build-session feedback, and the inspected 393 × 852 Home, envelope, carrier, and blank-seal preview renders. This is team direction and artifact evidence, not participant research.
- Consequence: the prototype tokens, Home identity treatment, envelope materials, maker inks, QR ink, and receiving field may follow this palette. Later AI or code passes must not revert to the prior generic navy/white placeholder palette or use low-contrast accent colours for small copy. The palette does not validate the product concept or permit generic multi-colour decoration.
- Revisit when: Cecelia supplies an updated board, the team selects a final wordmark/asset set, or real-phone accessibility and recipient testing shows a contrast or tone problem.

### Judge review

| Judging lens | Effect | Evidence | Risk or unknown |
| --- | --- | --- | --- |
| Brief fit | neutral | Colour does not change the chosen unwritten rule or appreciation mechanism. | Visual warmth alone cannot prove the experience changes behaviour. |
| Problem identification | neutral | The ordinary-day appreciation problem remains unchanged. | No participant evidence links this palette to lower social hesitation. |
| Solution approach | strengthens | A coherent team palette makes the authored object and delivery ritual easier to follow across states. | The envelope stage may still feel like decorative labour. |
| Design innovation | neutral | The white-to-deep-ink threshold retains a product-specific narrative job. | A handmade palette is not novel by itself. |
| Visual communication | strengthens | Human-selected colour roles now separate identity, functional copy, authored materials, and receiving state. | Several accent colours fail normal-text contrast on cream if misused. |
| Presentation skills | strengthens | The prototype and deck can share one recognisable visual grammar. | The deck must still communicate the problem and evidence without relying on aesthetic polish. |
| Evidence quality | weak | The board and render are direct team artifacts. | No intended maker or receiver has tested legibility, warmth, or comprehension. |

### Required challenge review

| Challenge lens | Strongest challenge | Evidence-backed answer | Blocking unknown |
| --- | --- | --- | --- |
| Assumption and inversion | Does warmer colour automatically make appreciation feel sincere? | No such claim is made; sincerity remains in the sender-authored object and receiver agency. | Recipient interpretation has not been observed. |
| Behaviour and context | Could the palette make a quick ordinary-day message feel overproduced? | The outer shell stays sparse and colour is concentrated in identity/material moments. | Whether makers perceive the flow as light enough in context. |
| Medium necessity | Does this justify a digital product? | No; the digital case still depends on mixed media, transfer, unfolding, and the cabinet. | The strongest medium-specific ingredient remains untested. |
| Alternatives | Would plain text or a physical note work better? | Both remain legitimate comparison conditions. | No matched comparison exists. |
| Human specificity | Is the palette the team's taste rather than the audience's? | It is explicitly recorded as team-authored direction, not audience evidence. | Cultural and relationship-context responses. |
| Inclusion and accessibility | Are the lighter colours legible? | Deep ink remains mandatory for small controls/copy; lighter hues are limited to large marks or darkened authored-ink variants. | Full assistive-technology and sunlight/low-vision testing. |
| Trust, safety and privacy | Could warmth imply safety the link does not provide? | Link limitations remain explicit and no palette is treated as a privacy guarantee. | Real authentication, expiry, forwarding, and deletion. |
| Failure and recovery | What if a material choice becomes unreadable? | The implementation keeps accessible dark variants and all selections editable before giving. | Actual recovery comprehension on a phone. |
| Feasibility and demo truth | Can the palette be applied consistently in time? | Shared tokens now govern the coded prototype; remaining hand-drawn assets stay swappable. | Final team asset breadth and cross-device visual QA. |
| Incentives and second-order effects | Could colour/template choices create performance pressure? | Choices remain deliberately small with no rankings, rarity, or marketplace. | Repeated-use social expectations. |
| Simplicity and retellability | Does the palette complicate the concept? | No; the flow remains make, envelope, travel, open, keep/leave. | Whether the envelope step itself needs subtraction. |
| Authorship and distinctiveness | Is this still AI-looking styling? | The source board and mascot are Cecelia's work, Ethan materially selected the direction, and AI only translated it into tokens and code. | Final line weights, material icons, and the deck still need team edits. |

- Verdict: **Proceed with conditions**.
- Blocking conditions: preserve the white-to-deep-ink threshold; keep small functional text in deep ink; keep colour restrained and tokenised; do not call this participant validation or a complete final identity; retain team control of the final wordmark, illustration, and material-asset pass.
- Weakest judging angle: **evidence quality**, because this is direct team art direction rather than maker/receiver testing.
- Main trade-off: stronger coherence and human authorship in exchange for a narrower contrast-safe role for the lighter palette colours.
- Next evidence that could change the verdict: one real-phone maker/receiver walkthrough that checks legibility, emotional tone, and whether the envelope still feels meaningful rather than ornamental.

### Rendered authenticity review

- Source anchors: Cecelia's brand board and supplied firefly masters, Ethan's simplified Home composition, Gaegu, and the white-to-dark receiving threshold.
- Rejected defaults: generic navy-only styling, a decorative multi-colour app shell, nested envelope clip-art, placeholder seals, and seal-gated progression.
- Structural divergence: colour follows the object's journey—sparse white making, restrained material accents, then a deliberate deep receiving field—rather than a generic component theme.
- Content-native signature: the sender's exact paper becomes the envelope, travels as an object, and unfolds into the receiver's dark field.
- Material human change: Cecelia drew the board and mascot; Ethan selected the branding and directly removed the nested icon/progression errors.
- Render result: **Pass for exploratory prototype review**. The 393 × 852 render keeps the authored source visible, removes the nested envelope icon, and maintains readable control contrast. Remaining code-native material icons and final wordmark refinement still require team review before a final-brand claim.

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
