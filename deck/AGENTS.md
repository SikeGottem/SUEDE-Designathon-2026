<!-- This contract keeps automated deck work grounded, editable, and safe to iterate under designathon time pressure. -->
# Deck agent contract

## Authority

Read the repository `AGENTS.md` and apply the mandatory SUEDE judge and challenge review before consequential story, evidence, scope, prototype, AI-use or visual decisions. A missing review blocks generation. `Test first` permits only the named test; `Reject` stops the direction.

Use source material in this order:

1. `WIKI/BRIEF.md`
2. `WIKI/JUDGING.md`
3. Current entries in `WIKI/DECISIONS.md`
4. The selected direction in `WIKI/IDEAS.md`
5. Sourced claims in `WIKI/EVIDENCE.md`
6. Completed observations in `WIKI/TESTS.md`
7. Timing guidance in `WIKI/TACTICAL_PLAN.md`

Never treat an old deck, raw transcript, AI persona, generated statistic, or visual mockup as factual authority.

## Source of truth

`deck/deck-spec.json` is the content contract once it exists. Figma Slides is the editable visual source of truth after generation. HTML may provide a visual reference or motion asset, but it must not become a second independently edited deck.

## Figma rules

- Use the current `figma-use` and `figma-use-slides` skills before writing to Figma.
- Inspect existing slides before editing and preserve manual refinements.
- Build a two-slide visual spike before generating the full deck.
- Build three to five slides per operation and validate each batch.
- Name slides `slide/<spec-id>` and major elements `<spec-id>/<role>`.
- Store the spec ID on generated nodes using shared plugin data when supported.
- Modify existing slides in place. Never delete and regenerate a deck unless Ethan explicitly asks to start over.
- Keep text, shapes, components, and evidence labels editable.
- Add speaker notes as concise prompts, transitions, timing cues, and caveats, not a script.
- Figma transitions require a deliberate editor pass; do not claim they were created unless verified in the file.

## Visual rules

- Each slide makes one claim and has one dominant composition.
- Use claim headlines, not topic labels.
- Prefer product states, observations, and evidence over decorative imagery.
- Avoid repeated card grids, icon soup, generic gradients, fake dashboards, and template-looking layouts.
- Motion must explain sequence, state change, causality, or attention. Decorative motion is removed.
- AI may generate structure, variants, layouts, code and assets, but humans must choose the point of view, reject generic options, make material edits, verify the result and record material third-party use.
- A slide fails the authorship gate when its visual system could fit any topic after changing the copy, or when nobody can explain why its major choices exist.

## Final gate

`python3 deck/validate_deck_spec.py --final deck/deck-spec.json` and the artifact-level judge/challenge review must pass before final slide generation. Then verify the live deck, exported PDF, offline demo, source labels, AI/third-party disclosures, and timing on a second device.
