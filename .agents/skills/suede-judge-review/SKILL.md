---
name: suede-judge-review
description: Gate any consequential SUEDE 2026 idea, product, research, scope, UI, prototype, time or pitch decision against the project's authoritative judging and challenge model. Use before recommending, approving or implementing a material SUEDE decision.
---

<!-- This skill gives project agents a repeatable judging-first decision review and recording procedure. -->
# SUEDE judge review

Treat `WIKI/JUDGING.md` as the authority. Do not substitute memory or a generic design rubric.

## Read first

1. Read `WIKI/JUDGING.md` fully.
2. Read `WIKI/BRIEF.md` fully when the decision depends on the current brief.
3. Read only the relevant evidence, tests, ideas and prior decisions.
4. Check whether newer official criteria supersede the current model.

## Classify the gate

Name the stage: idea / research / product scope / UI preflight / UI post-build / prototype / pitch / time. State what work will start or stop after the verdict.

If this is idea generation or selection, first produce the divergence set required by `WIKI/JUDGING.md`. Do not evaluate a cluster of near-identical app features as if it were a real option set.

If this is UI post-build, inspect the actual screens or prototype. A description of the intended design is not evidence of the implemented result.

## Review the decision

State the decision in one sentence, then assess every lens:

| Lens | Question |
| --- | --- |
| Brief fit | Does this answer the exact task and comply with every requirement? |
| Problem identification | Does it sharpen a specific user, moment, cause or need? |
| Solution approach | Does it make the response more effective, understandable and complete? |
| Design innovation | Does it strengthen a distinct insight or mechanism instead of making the idea generic? |
| Visual communication | Does it make the important interaction and hierarchy easier to understand? |
| Presentation skills | Does it make the argument, evidence and demo easier to explain and remember? |
| Evidence quality | What supports the choice, what is inferred and what remains untested? |

For each lens, write:

- effect: strengthens, neutral, weakens or unknown
- evidence supporting that judgment
- risk or unanswered question

Do not fabricate scores, research, quotes or official weights. A neutral result is acceptable when a criterion genuinely does not apply, but explain why.

Then assess every required challenge lens from `WIKI/JUDGING.md`:

- assumption and inversion
- behaviour and context
- medium necessity
- alternatives
- human specificity
- inclusion and accessibility
- trust, safety and privacy
- failure and recovery
- feasibility and demo truth
- incentives and second-order effects
- simplicity and retellability
- authorship and distinctiveness

For each challenge lens, state the strongest challenge, the answer supported by current evidence and any blocking unknown. Add domain-specific lenses for material risks such as health, finance, children, culture, sustainability, misinformation or AI.

When AI contributes to an artifact, explicitly check:

- what humans framed before generation
- what alternatives humans or AI explored
- what the team rejected and why
- what humans manually changed or authored
- what research or testing changed
- which tools, generated assets and third-party sources require disclosure
- whether the result has a specific point of view or merely a polished median

## Conclude

Return:

- **Verdict:** Proceed / Proceed with conditions / Test first / Reject
- **Weakest judging angle:** one lens and why
- **Main trade-off:** what improves and what is sacrificed
- **Next evidence:** the smallest check most likely to change the verdict
- **Recommendation:** the concrete decision the team should make

The verdict is an execution control, not commentary:

- `Proceed` permits the next stage.
- `Proceed with conditions` makes every named condition blocking for the next stage.
- `Test first` permits only the named test or evidence action.
- `Reject` stops investment in the direction.

Lead the response with the verdict. Do not bury a weak idea under process language.

## Record settled decisions

When Ethan or the team approves the decision, append it to `WIKI/DECISIONS.md` using the mandatory judge-review template in `WIKI/TEMPLATES.md`. Preserve the evidence links and uncertainty. Then run `python3 wiki.py sync` and confirm `python3 wiki.py policy` still points to `WIKI/JUDGING.md`.

Do not record exploratory options as current decisions. Do not silently reverse an earlier decision. Mark the earlier entry superseded and link the reason.
