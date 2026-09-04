<!-- This record reveals the benchmark candidates, summarizes verification evidence and preserves the team's deferred selection. -->
# Design-skill benchmark results

## Candidate reveal

| Candidate | Skill |
| --- | --- |
| A | Impeccable |
| B | Anthropic `frontend-design` |
| C | Current `design-taste-frontend` |

The independent blind review selected **C** with moderate confidence. This is a provisional result for the fictional Relay task, not a permanent project-wide winner. Ethan chose to keep all candidates available until the real 2026 concept can supply a representative screen or deck surface.

## Identical Playwright verification

All candidates:

- completed ready → active → check-in → simulated signal loss → SMS fallback → restored connection → arrival → replay without reload
- completed the actions through keyboard activation
- had no horizontal overflow at 1440 × 1000 or 390 × 844
- loaded no external fonts, scripts, images or APIs
- produced no page or console errors during the controlled flow
- exposed semantic main content and live feedback
- respected `prefers-reduced-motion: reduce`

Observed differences:

- **A:** state focus remained visible and purposeful; demo controls measured 38px high.
- **B:** its signal-loss control measured 39px high; focus fell to `BODY` after most state transitions.
- **C:** controls met or exceeded 44px and focus moved to each new state heading; the default blue heading outline looked visually unfinished.

The repeatable callback is [playwright-flow.js](playwright-flow.js). Accepted screenshots remain in the ignored local path `output/playwright/design-skill-benchmark/{a,b,c}/`.

## Current operating decision

- Keep all three installed for now.
- Use them separately when comparing visual opinions.
- Declare one visual lead before implementing an artifact.
- Allow human-selected decisions to cross between directions only when the choice and reason are explicit.
- Do not load the three broad skills together as a combined art-direction prompt.
- Revisit the permanent selection against the first representative artifact after the official 2026 brief arrives.

See [the wiki toolchain](../../WIKI/TOOLCHAIN.md) and [the recorded decision](../../WIKI/DECISIONS.md).
