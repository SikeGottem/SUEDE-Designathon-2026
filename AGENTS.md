<!-- This contract makes the SUEDE judging model the required decision lens for every agent working in this project. -->
# SUEDE 2026 agent contract

## Source of truth

`WIKI/JUDGING.md` is the authoritative judging model for this project.

Before making or evaluating a consequential decision, read:

1. `WIKI/JUDGING.md`
2. `WIKI/BRIEF.md`
3. The relevant sections of `WIKI/EVIDENCE.md`, `WIKI/TESTS.md`, `WIKI/IDEAS.md` and `WIKI/DECISIONS.md`

The exact 2026 brief and rubric outrank every historical criterion and inference. When official information changes, update `WIKI/JUDGING.md` first, then regenerate the wiki database with `python3 wiki.py sync`.

## Mandatory judge review

Use `.agents/skills/suede-judge-review/SKILL.md` before proposing, approving or implementing any consequential choice about:

- problem framing or target users
- research claims or insights
- concepts, features or interaction mechanisms
- scope, prioritisation or time allocation
- prototype flows or fidelity
- visual direction
- pitch structure, claims or demonstrations

The review must cover:

1. Brief fit
2. Problem identification
3. Solution approach
4. Design innovation
5. Visual communication
6. Presentation skills
7. Evidence quality

Do not invent numeric weights or scores. Finish with one verdict: `Proceed`, `Proceed with conditions`, `Test first` or `Reject`. State the weakest judging angle and the next piece of evidence that would most change the decision.

Routine production choices such as typo fixes, file naming and pixel-level spacing do not require a full review unless they materially affect the judging case.

## Decision record

When Ethan or the team settles a consequential decision, append the decision and its completed judge review to `WIKI/DECISIONS.md`, then run:

```bash
python3 wiki.py sync
python3 wiki.py policy
```

Exploratory options can be reviewed without being recorded as settled decisions. Never record an unchosen option as current.

## GitHub synchronization

GitHub is the shared delivery path for this wiki. A completed wiki update is not finished until the current task-scoped changes are committed and pushed to `https://github.com/SikeGottem/SUEDE-Designathon-2026`.

For every wiki update:

1. Inspect `git status` and preserve unrelated team changes.
2. Read the latest remote state before editing. If the working tree is clean, update with a fast-forward pull.
3. Make the change and run `python3 wiki.py sync`.
4. Run `python3 wiki.py policy` and any relevant validation.
5. Stage only the exact files changed for the task. Do not use `git add -A`.
6. Commit the verified update and push the current branch immediately.

Never force push. If another teammate has pushed first, fetch and integrate their work without discarding it. Report conflicts or authentication failures immediately instead of leaving a verified update only on the local machine.

## Designathon meeting transcripts

Every completed Chronicle recording from the Designathon Discord workspace must be copied in full to `WIKI/TRANSCRIPTS/` before model distillation. The Markdown transcript is the durable source of truth; `.wiki/wiki.db` is a rebuildable search index.

After every transcript copy, run `python3 wiki.py sync` immediately so agents and local search can retrieve the complete conversation. A failed copy or sync is a failed Chronicle processing attempt and must retain its recoverable session state for retry.

This rule applies only to the Designathon Discord workspace. Never route recordings from another Discord server into this wiki. AI extraction may propose ideas, evidence, tests or decisions, but must not silently turn transcript language into a settled team decision.

## Communication

Lead with the verdict and the weakest angle. Separate confirmed evidence from inference. If two criteria conflict, explain the trade-off and recommend a direction instead of hiding behind neutrality.
