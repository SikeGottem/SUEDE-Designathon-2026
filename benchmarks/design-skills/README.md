<!-- This mini-project defines a fair, repeatable comparison of candidate AI frontend-design skills. -->
# Design skill benchmark

This benchmark compares three frontend art-direction skills under identical conditions. It is infrastructure evidence, not a proposed response to the unreleased 2026 brief. The team has deferred a permanent winner until a real 2026 artifact exists.

## Fairness contract

- Every candidate receives the same [BRIEF.md](BRIEF.md), model family, Medium reasoning tier, one implementation turn and offline browser constraints.
- Each candidate may read only the shared benchmark files and its assigned skill. It must not inspect another candidate's work.
- Candidate folders remain anonymously labelled `a`, `b` and `c` until the blind review is complete.
- Playwright verifies the same viewports, keyboard path, controls and state transitions for all three outputs.
- The Product Design audit is applied to screenshots and observed behaviour, not self-reported intent.
- Comparison uses ordinal judgments (`strong`, `mixed`, `weak`) and direct observations. It does not invent SUEDE weights or scores.
- A blind result is recorded, but all three may remain installed while the decision is deferred. They can produce separate options; one declared visual lead must own each implementation pass.

## Outputs

Each candidate owns one folder under `candidates/` and must produce:

- `index.html` — self-contained HTML, CSS and JavaScript with no network dependency
- `NOTES.md` — a concise design rationale, declared shortcuts and verification commands

Generated browser evidence belongs under the ignored `output/playwright/design-skill-benchmark/` path. See [BLIND_REVIEW.md](BLIND_REVIEW.md) for the anonymous comparison and [RESULTS.md](RESULTS.md) for the reveal, browser evidence and current decision.

## Boundary

Relay is a fictional test product chosen because it exposes hierarchy, trust, accessibility, failure/recovery and purposeful motion in one compact flow. No part of Relay becomes a SUEDE 2026 concept unless the team separately generates, reviews and selects it after the official brief arrives.
