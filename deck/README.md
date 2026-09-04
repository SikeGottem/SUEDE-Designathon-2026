<!-- This guide defines the repository-to-Figma Slides production pipeline for the SUEDE pitch. -->
# Deck pipeline

The deck is generated from verified project knowledge, not from raw transcripts or an old presentation export.

## Source order

1. `WIKI/BRIEF.md`
2. `WIKI/JUDGING.md`
3. `WIKI/DECISIONS.md`
4. `WIKI/IDEAS.md`
5. `WIKI/EVIDENCE.md`
6. `WIKI/TESTS.md`
7. `WIKI/TACTICAL_PLAN.md`

`index.html` is a visual reference only. Raw transcripts are retrieval material only. A transcript claim must be promoted into evidence, a test, or a settled decision before it can support a final slide.

## Working model

```text
WIKI sources ──> generated/context.md ──> deck-spec.json ──> editable Figma Slides
                                      └─> optional HTML motion study
```

The machine-readable deck spec is the bridge. HTML and Figma are renderers, not competing sources of truth.

Every material story, claim and visual direction must pass the hard gate in `WIKI/JUDGING.md`. AI can accelerate synthesis and production, but the team owns the argument, art direction, edits, evidence, testing and final approval.

## Commands

Build a deterministic context bundle:

```bash
python3 deck/build_context.py
```

Copy the template when the official brief arrives:

```bash
cp deck/deck-spec.template.json deck/deck-spec.json
```

Validate while drafting:

```bash
python3 deck/validate_deck_spec.py deck/deck-spec.json
```

Run the stricter gate before generating the final deck:

```bash
python3 deck/validate_deck_spec.py --final deck/deck-spec.json
```

## Figma production loop

1. Connect the official Figma plugin in Codex and create a Figma Slides file.
2. Read `generated/context.md`, the selected visual references, and the current deck spec.
3. Generate a two-slide visual spike: the opening problem and the hardest demo explanation.
4. After the direction is approved, build three to five slides per Figma operation.
5. Give every slide and major element stable names matching the spec IDs.
6. Validate bounds, clipping, overlap, fonts, sources, and speaker notes after each batch.
7. Fine-tune the editable objects in Figma. Subsequent agent edits must patch those slides in place.
8. Add transitions only after the story and layout are locked.
9. Export a PDF and record the hero loop for offline fallback.

## HTML bridge

There is no reliable one-click conversion from arbitrary HTML/CSS/animation into fully editable Figma Slides. Use one of these paths:

- Preferred: use the same deck spec and design tokens to build editable Slides objects directly.
- Visual-reference path: render the HTML, capture it into Figma, then reconstruct the final slide with native editable objects.
- Motion path: keep a complex HTML sequence as a short recorded clip and embed it in the deck.

Do not convert the whole deck HTML into flattened slide images. That preserves appearance but destroys the editability this pipeline is designed to protect.

## App boundary

The product prototype and presentation are separate artifacts. Default to a complete, tested Figma hero flow. Build code only when the defining interaction depends on behaviour Figma cannot honestly prove, such as real computation, generated output, direct manipulation, sensors, live data, or multi-user response.

Before either path begins, complete the product/UI preflight and judge/challenge review in `WIKI/TEMPLATES.md`. After building, review the actual screens or prototype. A polished render is not evidence that the interaction is useful, distinctive or true.
