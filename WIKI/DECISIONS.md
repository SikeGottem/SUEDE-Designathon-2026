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
