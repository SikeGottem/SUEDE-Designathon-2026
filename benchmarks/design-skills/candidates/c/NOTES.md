<!-- Candidate C notes document design intent, scope mismatch and verification needs. -->
# Candidate C notes

## Design rationale

Reading this as a trust-critical single-page product proof for a late-night rider, with a calm, restrained transit language and one continuity-focused Relay signature.

- `DESIGN_VARIANCE: 4` because predictability and trust matter more than expressive asymmetry here.
- `MOTION_INTENSITY: 3` because movement should confirm state changes without making signal loss playful.
- `VISUAL_DENSITY: 5` because the failure state must show enough known and pending information to work without narration.
- The Relay thread is the visual signature. It links Maya to Jo through one named checkpoint and changes only when the fictional journey state changes.
- A system-aware light/dark token set keeps the whole page in one coherent theme at a time.

## Scope mismatch

The assigned `design-taste-frontend` skill explicitly says it is not intended for multi-step product UI. Relay is a compact multi-state product flow, so the skill is a partial fit. I applied its brief inference, restraint, trust, state coverage, color, shape, responsive, accessibility and preflight rules without substituting another skill.

## Declared shortcuts

- No external typeface, icon library, image, script or API is used because the benchmark requires a self-contained offline file.
- No decorative image was generated. The product state itself is the visual subject, and the brief prohibits fake maps and decorative substitutes.
- This is a simulation only. It does not perform network checks, track location, queue SMS or contact emergency services.
- Browser screenshots and automated viewport checks were intentionally not run in this candidate turn. Root owns identical QA for all candidates.

## Suggested verification

- Open `index.html` with networking disabled.
- At 1440 by 1000 and 390 by 844, confirm there is no horizontal scroll and every required control remains reachable.
- Complete ready, active, check-in, signal loss, SMS fallback, restore, arrival and replay without reloading.
- Navigate the same path using Tab, Shift+Tab, Enter and Space. Confirm focus remains visible and moves to the new state heading after major transitions.
- Inspect the live region with a screen reader and confirm demo-only qualifications are announced for check-in and SMS actions.
- Enable `prefers-reduced-motion: reduce` and confirm state changes remain legible without visible animation.
- Test both light and dark system preferences for readable contrast.
