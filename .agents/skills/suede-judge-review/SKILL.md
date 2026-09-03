---
name: suede-judge-review
description: Review any consequential SUEDE 2026 product, research, scope, visual, prototype, time or pitch decision against the project's authoritative judging model. Use before recommending, approving or implementing a material SUEDE decision.
---

<!-- This skill gives project agents a repeatable judging-first decision review and recording procedure. -->
# SUEDE judge review

Treat `WIKI/JUDGING.md` as the authority. Do not substitute memory or a generic design rubric.

## Read first

1. Read `WIKI/JUDGING.md` fully.
2. Read `WIKI/BRIEF.md` fully when the decision depends on the current brief.
3. Read only the relevant evidence, tests, ideas and prior decisions.
4. Check whether newer official criteria supersede the current model.

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

## Conclude

Return:

- **Verdict:** Proceed / Proceed with conditions / Test first / Reject
- **Weakest judging angle:** one lens and why
- **Main trade-off:** what improves and what is sacrificed
- **Next evidence:** the smallest check most likely to change the verdict
- **Recommendation:** the concrete decision the team should make

Lead the response with the verdict. Do not bury a weak idea under process language.

## Record settled decisions

When Ethan or the team approves the decision, append it to `WIKI/DECISIONS.md` using the mandatory judge-review template in `WIKI/TEMPLATES.md`. Preserve the evidence links and uncertainty. Then run `python3 wiki.py sync` and confirm `python3 wiki.py policy` still points to `WIKI/JUDGING.md`.

Do not record exploratory options as current decisions. Do not silently reverse an earlier decision. Mark the earlier entry superseded and link the reason.
