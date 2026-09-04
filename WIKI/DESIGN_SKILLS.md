<!-- This report recommends a current, evidence-backed AI design skill stack for SUEDE 2026. -->
# Design skills and AI workflow report

- **Prepared:** 4 September 2026
- **Decision:** which agent skills and design tools should govern the designathon workflow
- **Scope:** research synthesis, ideation, UX strategy, art direction, Figma, coded UI, critique, accessibility, motion and the pitch deck
- **Current status:** core tools installed; comparison completed; permanent visual-skill choice and Figma OAuth intentionally deferred

> This page preserves the research and rationale. [TOOLCHAIN.md](TOOLCHAIN.md) is the current operating record, including the safe hybrid rule, installed versions, benchmark outcome and deferred setup.

## Verdict

Use a small specialist chain. Do not create a pile of overlapping “make it look good” skills.

The best-supported system is:

1. `WIKI/JUDGING.md` and `suede-judge-review` govern every consequential decision.
2. `suede-idea-stress-test` and `WIKI/IDEA_SCAFFOLD.md` turn rough thoughts into evidence-honest, red-teamed, design-ready packets before selection.
3. `suede-design-authenticity` rejects interchangeable visual directions before build and after the real render is inspected.
4. Real evidence and a short `DESIGN.md` establish the product's point of view before visual generation.
5. Selected Intent methods challenge the problem, medium and assumptions.
6. gstack creates the design language and one genuinely divergent visual round.
7. Broad coded-interface skills may contribute separate options or critiques, but each artifact declares one visual lead before implementation so contradictory defaults are not stacked.
8. The official Figma plugin owns native, editable product screens and Figma Slides.
9. OpenAI Product Design plus Playwright inspect rendered flows, states and responsiveness.
10. Emil Kowalski's skills own interaction motion; Remotion is optional for one rendered hero clip.
11. Humans own framing, selection, taste, material editing, testing, approval and disclosure throughout.

There is no credible common benchmark showing that one visual-design skill universally creates the “best output.” GitHub stars show adoption, not taste or result quality. Our controlled Relay test produced a provisional result, but Ethan chose to wait for the real 2026 concept before making a permanent selection.

## AI design rule

There is no verified historical SUEDE ban on generative AI. The [2024 rules](https://suede-designathon-2024.devpost.com/rules) and [2025 rules](https://suede-designathon-2025.devpost.com/rules) allowed teams to use Figma, Adobe XD or another prototyping tool, and required third-party material to be attributed and its use explained. The 2026 rules are not yet public, so current permission and disclosure requirements are still unconfirmed.

The safe and competitively stronger position is human-led AI:

- use AI for synthesis, counterarguments, alternatives, rough compositions, implementation and repetitive refinement
- never use generated personas, quotes, research, tests or simulated behaviour as evidence
- make the team's authorship visible through the point of view, rejected alternatives, manual changes and decisions caused by real testing
- record material tools, external sources, generated assets and human edits for submission disclosure
- reject work that could fit any product after replacing its logo and copy

This is also where current product practice is moving. Figma describes AI as working beside direct canvas manipulation rather than replacing it in [its Design Agent announcement](https://www.figma.com/blog/the-figma-agent-is-here/). The right model is not AI-only or hand-only. It is fast machine expansion inside a human-controlled evidence and taste loop.

## Recommended stack by use case

| Use case | Recommended owner | Status | Why it belongs |
| --- | --- | --- | --- |
| Decision governance | SUEDE `JUDGING.md` + `suede-judge-review` | Keep; now mandatory | The only layer tailored to the event, evidence standard and judging case. It stops attractive but weak work from advancing. |
| Idea development and red-team | SUEDE `suede-idea-stress-test` + `IDEA_SCAFFOLD.md` | Keep; mandatory for contenders | Joins desirability, viability, feasibility, medium necessity, mechanism, risks, states, proof and design inputs into one packet before UI begins. |
| Visual authenticity | SUEDE `suede-design-authenticity` | Keep; mandatory before and after visual builds | Converts authorship from a principle into a source-anchor, divergence, logo-swap, team-voice and subtraction gate. |
| Research synthesis | Anthropic `synthesize-research` pattern | Add after review | Separates observations, behaviours, themes, contradictions, confidence and open questions while keeping source labels. |
| Problem framing and outside-box thinking | Selected [Intent](https://github.com/ghaida/intent) modules | Adapt selectively | Strongest inspected system for strategy, journeys, assumptions, inclusion, resilience, ethics and non-default paradigms. |
| Design language | gstack `design-consultation` | Keep | Converts product context and references into a deliberate visual contract before screens are generated. |
| Visual divergence | One gstack `design-shotgun` round | Keep selectively | Produces competing visual directions early, when disagreement is cheap. It should not become endless option generation. |
| Native UI and components | Official OpenAI Figma plugin | Keep | Writes editable Figma objects and supports design-system-aware reconstruction rather than treating a screenshot as the final source. |
| Native pitch deck | Official `figma-use-slides` workflow | Keep | Best current path to custom, editable Figma Slides. Text, layout and media remain directly adjustable by the team. |
| Coded interface craft | Impeccable, Anthropic `frontend-design`, and current `design-taste-frontend` | Installed; select per artifact | They may generate separate options, but only one may lead an implementation pass. The permanent default is deferred until a real concept exists. |
| Flow and artifact audit | OpenAI Product Design `audit` | Installed | Screenshot-grounded inspection of actual product steps with explicit limits on what visual evidence can prove. |
| Browser behaviour and accessibility | Playwright plus keyboard and automated checks | Keep | Verifies responsive layouts, interaction, errors and behaviour that a static design critique cannot prove. |
| Interaction motion | [Emil Kowalski's skills](https://github.com/emilkowalski/skills) | Installed | Treats motion as purposeful feedback, covers variants and review, and includes reduced-motion and performance concerns. |
| Cinematic demo asset | [Remotion skills](https://github.com/remotion-dev/remotion/tree/main/packages/skills) | Conditional | Useful for a polished 10–20 second hero clip or offline demo. It should not own the deck or product UI. |
| Original raster imagery | System `imagegen` | Keep | Useful for concept imagery, textures, key art and visual assets when inspected and edited at delivery scale. |

## Skill-by-skill findings

### 1. Project SUEDE review — governing layer

**Best for:** idea selection, scope, research decisions, UI gates, prototype truth and pitch claims.

This is the most important skill because generic design packs do not know the event's judging evidence, historical winners or our rule that problem, cause, mechanism, outcome, proof and story form one chain. It now includes twelve challenge lenses and four required divergence paradigms.

**Use it:** before a material direction advances and again against the built artifact.

**Do not expect it to:** generate visual taste by itself. It decides whether the work deserves to continue.

### 2. Intent — UX strategy and assumption challenger

**Best for:** finding a less obvious problem interpretation, checking whether a screen is needed, service and system thinking, journeys, resilience, inclusion and philosophical challenge.

[Intent v1.6.0](https://github.com/ghaida/intent) contains 17 specialised skills, including strategy, investigation, journey, wireframe, evaluation, fortification, inclusion, storytelling and a `philosopher` mode. Its main value is upstream: it asks why the product should exist and what other paradigm could solve the problem before visual polish locks the team into an app.

**Why it is not an automatic full install:** it has limited public adoption relative to the visual packs and no independent output benchmark. Loading all modules would add process weight during a short event.

**Recommendation:** adapt only the strategy, philosopher, journey, include and fortify patterns that fill gaps in the SUEDE gate.

### 3. Anthropic `synthesize-research` — evidence processor

**Best for:** interviews, transcripts, survey responses and feedback.

Anthropic's [research-synthesis skill](https://github.com/anthropics/knowledge-work-plugins/blob/main/product-management/skills/synthesize-research/SKILL.md) is strong because it preserves the difference between what people said, what they did, repeated themes, contradictions and remaining uncertainty.

**Risk:** polished synthesis can make weak or invented input appear authoritative. Every conclusion must remain traceable to a real source in the WIKI.

**Recommendation:** add it as the standard evidence-processing pattern, subordinate to `WIKI/EVIDENCE.md`.

### 4. gstack design workflows — visual contract and divergence

**Best for:** creating a coherent `DESIGN.md`, forming several art directions and running targeted screenshot critique.

[gstack](https://github.com/garrytan/gstack) is already installed. The useful sequence is one `design-consultation`, one bounded `design-shotgun`, then targeted `design-review` after a real render exists. This gives AI a rail and references instead of a vague “make it premium” prompt.

**Risk:** its full environment is Claude- and browser-workflow-heavy. Repeated shotgun rounds can become aesthetic procrastination.

**Recommendation:** keep, but use only at explicit visual checkpoints.

### 5. Official OpenAI Figma plugin — native editable output

**Best for:** Figma-native UI, components, screens, design-system work and the final Figma Slides deck.

The official plugin is now installed. OpenAI's [`figma-generate-design`](https://github.com/openai/plugins/blob/main/plugins/figma/skills/figma-generate-design/SKILL.md) workflow combines browser capture with native reconstruction, while [`figma-use-slides`](https://github.com/openai/plugins/blob/main/plugins/figma/skills/figma-use-slides/SKILL.md) supports direct custom slide creation. Figma also documents the code-to-canvas iteration loop in [Building frontend UIs with Codex and Figma](https://www.figma.com/blog/introducing-codex-to-figma/).

**Important limitation:** arbitrary HTML does not become a perfectly editable Figma Slides deck in one lossless step. Use a shared deck specification, then build native Slide nodes. HTML is useful as a visual or motion study, not the permanent slide source of truth. Slide transitions still require a manual Figma pass.

**Current setup condition:** restart Codex, authenticate Figma and run a native write test before the event. Local duplicate Figma skills should be retired only after that test passes.

### 6. Impeccable — comprehensive coded-interface finisher

**Best for:** a broad end-to-end coded UI craft pass.

[Impeccable v4.1.3](https://github.com/pbakaus/impeccable/blob/main/.github/skills/impeccable/SKILL.md) is the strongest inspected comprehensive candidate. It establishes project context, separates modes, uses browser evidence, limits correction passes and progressively loads detailed guidance. It is current, heavily adopted and more operational than a short style prompt.

**Risk:** popularity is not proof that its default output matches this brief. Like every broad pack, it can impose its own taste if the design contract is weak.

**Recommendation:** leading candidate for the controlled visual benchmark, not an automatic install.

### 7. Anthropic `frontend-design` — lightweight visual baseline

**Best for:** concise art direction when a heavy process is unnecessary.

Anthropic's official [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) example is subject-grounded, anti-template and aware that screenshots are the acceptance evidence. Its smaller instruction surface is an advantage during fast work.

**Risk:** it supplies fewer operational checks than Impeccable, and Anthropic explicitly treats public skills as examples to evaluate in your own environment.

**Recommendation:** benchmark as the lightweight candidate.

### 8. Current `design-taste-frontend` — deep but narrow incumbent

**Best for:** expressive landing pages, campaign surfaces and portfolios.

The installed skill is detailed and strongly anti-generic, but it explicitly excludes dashboards, data tables and multi-step product UI. It also contains many forced defaults, which can overpower a product-specific design language.

**Recommendation:** include it in the benchmark because it is our incumbent. Keep it for marketing-style surfaces if it wins there; do not assume it should govern the product flow.

### 9. OpenAI Product Design `audit` — evidence-first product critique

**Best for:** reviewing a rendered end-to-end flow rather than critiquing intentions.

OpenAI's [`audit`](https://github.com/openai/role-specific-plugins/blob/main/plugins/product-design/skills/audit/SKILL.md) captures and evaluates the visible steps in a user journey, ties findings to screenshots and states what screenshots cannot prove. That makes it a stronger post-build complement to the SUEDE review than another aesthetic prompt pack.

**Risk:** static images cannot establish keyboard access, focus behaviour, timing, network failure or true usability.

**Recommendation:** add it, paired with Playwright and human testing.

### 10. Emil Kowalski motion skills — interaction-motion specialist

**Best for:** transitions, feedback, enter/exit behaviour, easing and identifying where motion would help or distract.

[Emil Kowalski's maintained collection](https://github.com/emilkowalski/skills) first asks whether motion should exist and what job it performs. It also covers reduced motion and performance. That is more useful than adding animation everywhere for spectacle.

**Recommendation:** adopt it as the only motion ruleset if the benchmark confirms it equals or improves the current polish skill. Do not stack contradictory timing and scale defaults.

### 11. Remotion — rendered video specialist

**Best for:** one cinematic explainer, recorded prototype transition or reliable offline demo asset.

Remotion is code-native video, so it offers repeatability and fine control. It is valuable when the concept benefits from a short motion-led reveal or when live demo risk needs a fallback.

**Risk:** rendering a whole presentation as video destroys native slide editability and creates a production burden.

**Recommendation:** install only if the selected story has a specific hero clip worth the time.

### 12. UI UX Pro Max — large reference corpus, not the primary engine

**Best for:** looking up patterns, styles and implementation reminders.

Its scale and adoption make it useful as a reference database. They do not establish that its results are more distinctive. It overlaps with the broad visual candidates and can encourage style-menu design rather than a point of view derived from the problem.

**Recommendation:** do not put it in the primary chain. Consult it only for a bounded lookup if a gap remains.

### 13. Current `make-interfaces-feel-better` — temporary polish reference

**Best for:** compact micro-interaction and craft reminders.

It is useful but unversioned and prescribes exact defaults that conflict with newer candidates. For example, broad skills disagree on press scale and transition behaviour; the browser cannot obey two design constitutions at once.

**Recommendation:** keep temporarily, then replace with the maintained Emil motion set if the comparison succeeds.

### 14. Current `redesign-existing-projects` — retire

**Best for:** nothing unique in this workflow.

It overlaps with stronger current skills and includes defaults that are inappropriate for evidence-led product work, including generic placeholder imagery and synthetic content changes.

**Recommendation:** retire or leave inactive after the new stack is verified.

## Best end-to-end workflow

```text
brief and real evidence
        ↓
SUEDE idea gate + Intent challenge
        ↓
four mechanism-level paradigms
        ↓
human selection and one-sentence product thesis
        ↓
DESIGN.md + references + one gstack visual-divergence round
        ↓
native Figma flow for structure and collaboration
        ↓
code spike only where real behaviour must be tested
        ↓
screenshot audit + Playwright + human test
        ↓
native Figma Slides + optional Remotion hero clip
        ↓
pitch gate, manual animation pass and AI disclosure
```

### When to use Figma versus code

- Use Figma first for user flow, information hierarchy, quick testing, collaboration and the editable presentation.
- Use code when the design question depends on real computation, responsive behaviour, direct manipulation, live data, animation timing or an integration.
- A code spike should prove one risky interaction in roughly 60–90 minutes. Stop if it introduces unfamiliar authentication, more than one external service or infrastructure unrelated to the judged experience.
- A polished Figma prototype is a legitimate final artifact. Historical SUEDE winners used Figma; there is no evidence that a fully functional app is required to win.

### Presentation workflow

Use a shared deck specification fed by the WIKI, then create the deck natively in Figma Slides. Keep text, diagrams, UI crops and speaker-order changes editable. Use generated raster visuals only where a raster image is the intended medium. Use HTML or Remotion for a bounded motion study or hero clip, not as the canonical deck.

Canva is useful for quick templates and team familiarity, but it gives this Codex workflow less direct native control than the installed Figma path. Fully AI-generated presentation products are fastest for a first outline and weakest for distinctive art direction, editability and visible authorship. For this event, Figma Slides is the better default.

## Controlled visual-skill benchmark

The benchmark is complete. Impeccable, Anthropic `frontend-design` and the installed `design-taste-frontend` each received the same fictional Relay brief, fixed copy, required interaction path, offline constraint, model class, reasoning level and one-turn delivery limit. Playwright exercised the same desktop/mobile path, focus, target sizes, reduced motion, resource requests and errors. Reviewers compared anonymous A/B/C evidence without numeric scoring.

The blind result was **C, the current `design-taste-frontend`, with moderate confidence**. A was strong and operational but had undersized demo controls. B had the strongest editorial failure state but lost focus after most state transitions. C made the most coherent full product argument and preserved focus and touch sizes, but its heading focus outline needed visual refinement and the skill is narrower than this product-flow use case.

This is evidence about one constrained task, not proof of a universal winner. Ethan chose to keep all three available until a real 2026 concept reveals the relevant surface and lets the team make a taste judgment. The non-conflicting rule is: compare separate outputs if useful, then declare one visual lead per artifact. Full protocol and evidence live in [`benchmarks/design-skills/`](../benchmarks/design-skills/); the current routing rule lives in [TOOLCHAIN.md](TOOLCHAIN.md).

## Existing skill cleanup

| Existing skill | Decision | Condition |
| --- | --- | --- |
| Official Figma plugin v2.0.21 | Keep | Installed. Authenticate later and verify a native Figma Design and Slides write. |
| Older local Figma skill copies | Retire later | Remove only after the official plugin test passes; duplicate names create routing ambiguity. |
| gstack design skills | Keep selectively | One consultation, one divergence round and targeted review. |
| Impeccable, Anthropic `frontend-design`, `design-taste-frontend` | Keep pending real-concept choice | Explore separately; declare one visual lead before each implementation. Do not stack their full rules. |
| `make-interfaces-feel-better` | Keep as a bounded polish reference | Emil's maintained skills own motion; do not let this reference establish a competing visual direction. |
| `redesign-existing-projects` | Retire | No unique value in the proposed chain. |
| Playwright | Keep | Behavioural, responsive and screenshot verification. |
| System `imagegen` | Keep | Original raster assets with human selection and delivery-scale inspection. |

## Implementation status

1. Selected Intent strategy/philosopher methods, OpenAI Product Design and Emil's motion skills are installed.
2. One gstack design-language and visual-divergence round is complete.
3. The three-way blind visual benchmark is complete; permanent selection is deferred by Ethan.
4. The official Figma plugin is installed; OAuth and native Design/Slides write verification are deferred until Ethan connects the account.
5. Duplicate local Figma skills remain in place until the official write test succeeds.
6. Remotion remains uninstalled unless the selected pitch explicitly needs a rendered hero clip.

## Evidence quality and limits

- Official documentation and source repositories establish intended capability and provenance; they do not guarantee design quality.
- Maintainer examples establish workflow design, not universal superiority.
- Reddit reports are anecdotal. Their value here is repeated agreement on the workflow: references and a design contract first, human selection and finishing, one bounded surface at a time, and screenshot-based correction.
- No inspected source provides a controlled cross-skill output benchmark.
- The Figma plugin was installed after this Codex session began, so direct canvas capability still needs a fresh-session test.

Useful practitioner discussions include [actual AI design workflows](https://www.reddit.com/r/UXDesign/comments/1tf2yea/actual_ai_design_workflows_in_2026/), [when Figma versus code should answer the test question](https://www.reddit.com/r/FigmaDesign/comments/1uqqyiw/are_we_still_prototyping_in_figma/), [Codex UI acceptance loops](https://www.reddit.com/r/codex/comments/1upt5ha/how_do_you_handle_frontendui_work_with_codex/), [why broad skill stacks still look generic](https://www.reddit.com/r/ClaudeAI/comments/1t24gan/few_months_of_frontenddesign_uiuxpromaxskill/) and [editability versus visual coherence in Codex slide workflows](https://www.reddit.com/r/ChatGPTPro/comments/1w2fs5c/i_tried_two_codex_slide_workflows_one_was/).

## Bottom line

The competitive advantage is not an AI that makes more screens. It is an operating system that forces better questions, creates real alternatives, protects a human point of view, produces editable artifacts and repeatedly compares claims with rendered reality and user evidence.

### What the authenticity gate adds

The previous stack could still fail by invoking an anti-slop skill and then accepting its first polished output. The dedicated gate closes that gap:

- structural alternatives come before colours and typography
- every direction uses real source anchors and states how it differs from references
- obvious model copy, label density, generic cards and fashionable default palettes are explicit rejection signals
- subtraction alone is insufficient; the artifact needs one content-native surprise
- a screenshot review must produce at least one material human-directed change
- logo-swap and team-voice tests decide whether the result is actually authored
