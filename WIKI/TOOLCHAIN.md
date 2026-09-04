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
| UX strategy | Intent `strategize` | Installed | Frames the user, behaviour, opportunity, hypothesis and project scope before solution work. |
| Outside-the-box thinking | Intent `philosopher` | Installed | Challenges default app assumptions and produces materially different paradigms. |
| Design language | gstack `design-consultation` | Installed and exercised | Creates one visual contract tied to the subject rather than generic style adjectives. |
| Visual divergence | gstack `design-shotgun` | Installed and exercised | Produces one bounded set of genuinely different directions before selection. |
| Coded visual design | Impeccable, Anthropic `frontend-design`, current `design-taste-frontend` | Installed; final choice deferred | Use separately for exploration or critique. Declare one visual lead before implementing an artifact. |
| Product-flow audit | OpenAI Product Design | Installed | Audits the rendered journey from screenshots and states what visual evidence cannot prove. |
| Browser verification | Playwright | Installed and exercised | Checks real interaction, viewport behaviour, focus, console errors, network requests and reduced motion. |
| Interaction motion | Emil Kowalski `find-animation-opportunities`, `animate`, `review-animations`, `improve-animations` | Installed | Adds or critiques motion only when it explains state, causality, continuity or feedback. |
| Editable design and slides | Official Figma plugin v2.0.21 | Installed; account connection deferred | Creates native editable Figma UI and Figma Slides after OAuth is connected. |
| Cinematic clip | Remotion | Not installed by design | Add only when the chosen pitch has a specific hero clip that static slides and the live prototype cannot communicate. |

## Safe hybrid rule

The team can use all three design candidates without turning them into one contradictory ruleset:

1. **Explore separately.** Give the same brief and evidence to each candidate when more than one visual opinion is useful. Keep their outputs labelled.
2. **Compare through the SUEDE lenses.** Judge hierarchy, mechanism clarity, distinctiveness, trust, accessibility, edit burden and fit to the real concept.
3. **Choose one lead per artifact.** Before coding a screen or building a deck, write the visual lead and design contract in `DESIGN.md`. Do not invoke the other broad visual skills during that implementation pass.
4. **Borrow decisions, not constitutions.** A human may deliberately carry a useful idea from a losing direction into the selected one. Record what was taken and why; do not merge every default for type, spacing, colour, radius and motion.
5. **Audit after rendering.** OpenAI Product Design, Playwright and the SUEDE post-build review inspect the actual artifact. They are verification layers, not competing art directors.

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
SUEDE review + Intent strategy/philosopher
        ↓
mechanism-level alternatives
        ↓
human selection
        ↓
gstack design contract + one divergence round
        ↓
one declared visual lead for the artifact
        ↓
native Figma structure and/or a bounded code prototype
        ↓
Product Design audit + Playwright + human testing
        ↓
native Figma Slides + manual animation/rehearsal pass
        ↓
optional Remotion hero clip only if the story earns it
```

## Figma and presentation workflow

- Use the official Figma plugin to build native editable frames, text, shapes, components and Slides. Do not treat a flattened HTML screenshot as the final editable deck.
- Use code when the question depends on real responsiveness, computation, direct manipulation, data or motion timing; carry the proven interaction back into the shared design specification.
- Use [FreTo's 2024 artifacts](FRETO_REFERENCE.md) as a validated structural precedent: problem → evidence → synthesis → concept → test/iteration → product/value, with defensive detail in the appendix. Do not copy its premise, persona, metrics or scrapbook styling.
- Keep presentation transitions and the final visual polish as a human Figma pass.

### Deferred account step

The official plugin is installed, but Figma returned `USER_NOT_LOGGED_IN`. When Ethan is ready:

1. Open Codex Plugins or Settings, choose Figma and select **Connect**.
2. Complete the provider OAuth flow.
3. Run one native Design-file test and one native Slides-file test.
4. Confirm the UI and slide elements are editable before retiring older local Figma skill copies.

Until that succeeds, do not claim direct Figma authoring is verified and do not remove the local fallbacks.

## Motion rule

Motion must have a named job: draw attention, explain a state change, show causality, maintain spatial continuity or confirm input. Start with `review-animations` for existing work, use `find-animation-opportunities` only when the interface feels inert, and use `animate` for the selected implementation. Always test interruption, exit behaviour, performance and `prefers-reduced-motion`.

## Next decisions

1. When the official 2026 brief arrives, test the most relevant real screen—not another generic benchmark—and let Ethan choose the visual lead.
2. Connect Figma when convenient and verify one editable UI file plus one editable Slides file.
3. Install Remotion only if the final story names a cinematic clip, its exact job and a strict time budget.
