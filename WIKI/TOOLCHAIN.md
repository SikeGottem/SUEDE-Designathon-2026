<!-- This page records the installed SUEDE design toolchain, its routing rules and the setup steps intentionally left for later. -->
# Design toolchain

- **Updated:** 4 September 2026
- **Governing layer:** [JUDGING.md](JUDGING.md) and the project `suede-judge-review`
- **Current choice:** keep the three visual-design candidates available until the team tests them on the real 2026 concept
- **Important rule:** a hybrid means separate inputs and deliberate human synthesis, not loading contradictory visual skills into one build prompt

## What is installed and ready

| Layer | Tool | Current state | Use |
| --- | --- | --- | --- |
| Decision governance | SUEDE judge review | Active and mandatory | Reviews consequential ideas, UI, prototypes and pitch decisions before they advance. |
| Idea development | SUEDE idea stress test + idea scaffold | Active and mandatory for contenders | Turns a spark into an evidence-honest, red-teamed, design-ready packet without fake scoring. |
| Design authenticity | SUEDE design-authenticity review | Active and mandatory for visual work | Rejects polished but interchangeable output before build and after inspecting the render. |
| UX strategy | Intent `strategize` | Installed | Frames the user, behaviour, opportunity, hypothesis and project scope before solution work. |
| Outside-the-box thinking | Intent `philosopher` | Installed | Challenges default app assumptions and produces materially different paradigms. |
| Design language | gstack `design-consultation` | Installed and exercised | Creates one visual contract tied to the subject rather than generic style adjectives. |
| Visual divergence | gstack `design-shotgun` | Installed and exercised | Produces one bounded set of genuinely different directions before selection. |
| Coded visual design | Impeccable, Anthropic `frontend-design`, current `design-taste-frontend` | Installed; final choice deferred | Use separately for exploration or critique. Declare one visual lead before implementing an artifact. |
| Product-flow audit | OpenAI Product Design | Installed | Audits the rendered journey from screenshots and states what visual evidence cannot prove. |
| Browser verification | Playwright | Installed and exercised | Checks real interaction, viewport behaviour, focus, console errors, network requests and reduced motion. |
| Interaction motion | Emil Kowalski `find-animation-opportunities`, `animate`, `review-animations`, `improve-animations` | Installed | Adds or critiques motion only when it explains state, causality, continuity or feedback. |
| Editable design and slides | Official Figma plugin v2.0.21 | Connected; native Design-file write verified | Creates native editable Figma UI. A native Slides-file test is still outstanding. |
| Cinematic clip | Remotion | Not installed by design | Add only when the chosen pitch has a specific hero clip that static slides and the live prototype cannot communicate. |

## Safe hybrid rule

The team can use all three design candidates without turning them into one contradictory ruleset:

1. **Explore separately.** Give the same brief and evidence to each candidate when more than one visual opinion is useful. Keep their outputs labelled.
2. **Compare through the SUEDE lenses.** Judge hierarchy, mechanism clarity, distinctiveness, trust, accessibility, edit burden and fit to the real concept.
3. **Choose one lead per artifact.** Before coding a screen or building a deck, write the visual lead and design contract in `DESIGN.md`. Do not invoke the other broad visual skills during that implementation pass.
4. **Borrow decisions, not constitutions.** A human may deliberately carry a useful idea from a losing direction into the selected one. Record what was taken and why; do not merge every default for type, spacing, colour, radius and motion.
5. **Audit after rendering.** OpenAI Product Design, Playwright and the SUEDE post-build review inspect the actual artifact. They are verification layers, not competing art directors.
6. **Prove authorship twice.** Run the SUEDE design-authenticity preflight before styling and its subtraction pass after rendering. A skill name in the prompt does not count as compliance.

This preserves optionality now and visual coherence later. The permanent winner can be chosen after the official brief and a real product surface exist.

## Candidate benchmark status

The controlled benchmark used the same fictional Relay brief, model class, reasoning level, delivery limit, copy, states, viewports and offline constraint for every candidate. Relay is only a tool test; it is not a SUEDE concept or brand direction.

| Candidate | Skill | Strongest observed quality | Main observed weakness | Current interpretation |
| --- | --- | --- | --- | --- |
| A | Impeccable | Forceful hierarchy, reliable focus continuity and a recognisable low-light checkpoint language | Compact demo controls measured 38px high and the repeated mobile hero delays the critical state | Strong comprehensive candidate. |
| B | Anthropic `frontend-design` | Most distinctive editorial direction and clearest `Known / Relay will / You can` failure explanation | Focus fell to the page body after most state changes; one control measured 39px high | Strong visual candidate requiring accessibility repair. |
| C | Current `design-taste-frontend` | Strongest complete product argument, ≥44px controls and intentional state-heading focus | Default blue heading outline looked unfinished; the skill itself says multi-step product UI is outside its ideal scope | Blind provisional winner for this one test, not a universal verdict. |

The blind review selected C with moderate confidence. Ethan deferred the permanent choice, so **all three remain available and none is the project-wide default yet**. See the reproducible brief and evidence under [`benchmarks/design-skills/`](../benchmarks/design-skills/).

## End-to-end workflow

```text
official brief + real evidence
        ↓
quick idea capture + Intent strategy/philosopher
        ↓
mechanism-level alternatives
        ↓
idea dossier + devil's advocate + smallest falsifiable test
        ↓
SUEDE selection review + human selection
        ↓
gstack design contract + one divergence round
        ↓
one declared visual lead for the artifact
        ↓
SUEDE authenticity preflight: source anchors + rejected defaults + signature
        ↓
native Figma structure and/or a bounded code prototype
        ↓
rendered-artifact subtraction pass + Product Design audit + Playwright + human testing
        ↓
native Figma Slides + manual animation/rehearsal pass
        ↓
optional Remotion hero clip only if the story earns it
```

## Figma and presentation workflow

- Use the official Figma plugin to build native editable frames, text, shapes, components and Slides. Do not treat a flattened HTML screenshot as the final editable deck.
- Figma construction starts only after the authenticity preflight has named the communication job, subject-specific anchors, reference delta, rejected defaults and one content-native signature.
- Use code when the question depends on real responsiveness, computation, direct manipulation, data or motion timing; carry the proven interaction back into the shared design specification.
- Use [FreTo's 2024 artifacts](FRETO_REFERENCE.md) as a validated structural precedent: problem → evidence → synthesis → concept → test/iteration → product/value, with defensive detail in the appendix. Do not copy its premise, persona, metrics or scrapbook styling.
- Keep presentation transitions and the final visual polish as a human Figma pass.
- A visually polished first generation is still a draft. Inspect it at thumbnail and delivery scale, remove decorative labels and containers, rewrite model-like copy, then record at least one material human-directed change.

## Idea-to-design handoff

- Every spark gets the quick capture in `WIKI/IDEAS.md`; only plausible contenders complete `WIKI/IDEA_SCAFFOLD.md`.
- Use `suede-idea-stress-test` to fill gaps conversationally, mark unknowns honestly and construct the strongest fair objection.
- Do not ask Figma or a coded-interface skill to compensate for an unknown person, rule, cause, mechanism, state or proof boundary.
- The completed packet feeds `suede-judge-review`. Only its verdict and human selection permit material design work.
- For the current brief, include the rule's setting, signals, enforcement, beneficiaries, burdens and chosen reveal / communicate / question / redesign posture.

### Figma verification status

The official plugin is connected. On 4 September 2026, Codex created and inspected native editable frames, text and Auto Layout in the shared SUEDE Figma Design file.

Still required:

1. Run one native Figma Slides-file test.
2. Confirm slide elements and transitions remain directly editable.
3. Keep the local fallbacks until both Design and Slides workflows are verified.

## Motion rule

Motion must have a named job: draw attention, explain a state change, show causality, maintain spatial continuity or confirm input. Start with `review-animations` for existing work, use `find-animation-opportunities` only when the interface feels inert, and use `animate` for the selected implementation. Always test interruption, exit behaviour, performance and `prefers-reduced-motion`.

## Next decisions

1. When the official 2026 brief arrives, test the most relevant real screen—not another generic benchmark—and let Ethan choose the visual lead.
2. Verify one editable Figma Slides file; native Design-file authoring is already verified.
3. Install Remotion only if the final story names a cinematic clip, its exact job and a strict time budget.
