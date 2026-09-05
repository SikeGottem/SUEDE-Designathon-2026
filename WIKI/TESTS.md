<!-- This page records fast learning loops so evidence can guide how the team spends time. -->
# Tests

A test exists to change confidence, not to perform a research ritual.

## Test template

### Test name

- Date:
- Idea link:
- Uncertainty:
- What we believe now:
- Falsification condition:
- Smallest useful test:
- Who or what we need:
- Owner:
- Timebox:
- Observable supporting signal:
- Observable weakening signal:
- Observation:
- What surprised us:
- Confidence after: lower / unchanged / higher
- Decision rule applied:
- What changes next:

## Planned

### Creator-canvas acceptance slice

- Date: 5 September 2026
- Idea link: [creator-canvas feedback](TRANSCRIPTS/2026-09-05-71a1d2ad-62f9-5a40-bef2-024e3a8df630.md)
- Uncertainty: whether the bounded paper-first composer removes the placement barrier without becoming a dense editor.
- What we believe now: one paper can hold multiple independent text blocks plus the existing image layer, each directly movable and resizable.
- Falsification condition: a maker cannot place text materially across both horizontal and vertical paper space, add a second text block, resize text or the image, or the composition changes in the receiver/cabinet routes.
- Smallest useful test: automated acceptance coverage for horizontal and vertical placement, multiple text blocks, text/image resize, exact receiver-link preservation, and browser-local cabinet reopen; then one unaided real-phone maker walkthrough.
- Who or what we need: the coded prototype, a serializable no-local-media sample, and one real phone.
- Owner: prototype team
- Timebox: one focused implementation/QA pass
- Observable supporting signal: all named paths preserve the same bounded composition with no vertical page scroll.
- Observable weakening signal: a control is unreachable, the canvas remains centre-clamped, the receiver/cabinet composition differs, or the interaction reads as a general-purpose editor.
- Decision rule applied: keep the bounded correction only; do not add image multiplicity, global z-order tooling, or new materials to compensate for a failed interaction.
- What changes next: record the real-phone observation and correct only the failed canvas behaviour.

### Real-phone edge-to-edge shell acceptance slice

- Date: 5 September 2026
- Idea link: reported real-mobile “phone inside phone” shell issue
- Uncertainty: whether the prototype can use a real phone without emulator chrome while preserving its calibrated desktop preview and simulated keyboard behaviour.
- What we believe now: a narrow/coarse mobile viewport should render edge-to-edge; desktop should remain the calibrated emulator.
- Falsification condition: portrait or landscape phone still shows the bezel, picker, simulated status/home chrome, or creates scrolling/unsafe keyboard overlap; desktop loses the emulator.
- Smallest useful test: automated mobile portrait and landscape checks for edge-to-edge app bounds, absent emulator overlay, native safe-area placement, and simulated-keyboard/no-scroll behaviour, plus a desktop emulator control test.
- Who or what we need: one iPhone or Android phone and the runtime test fixture.
- Owner: prototype team
- Timebox: one focused runtime/QA pass
- Observable supporting signal: mobile content fills the viewport and remains usable around safe areas and keyboard; desktop retains device picker, bezel, status/home chrome, and calibrated frame.
- Observable weakening signal: browser chrome or orientation causes clipped content, duplicate device chrome, or divergent desktop behaviour.
- Decision rule applied: change the runtime shell only; do not alter app-owned product composition to mask emulator framing.
- What changes next: test on a physical phone and retain the desktop emulator as the design/QA control.

### Editable two-link pitch-demo rehearsal

- Date: 5 September 2026
- Idea link: [pre-made artifact / QR capture](TRANSCRIPTS/2026-09-05-68611ccd-495c-564d-9b92-7b2c0b167533.md)
- Uncertainty: whether the deployed editable prepared-template route can hand the exact safe edited object to a second device without being confused for normal product or private delivery.
- What we believe now: `/demo/create` can walk normal maker setup, load one compiled canonical artifact into the ordinary editable tools, and generate an exact safe `/demo/receive#v3.<payload>` handoff. Bare `/demo/receive` can replay the compiled fallback repeatedly without touching the normal cabinet.
- Falsification condition: the editable template loses a real tool; a valid safe v3 handoff does not open the exact edited object; invalid/unsafe/legacy data substitutes the fallback instead of showing unavailable; local-media/oversize data creates a misleading QR; the receiver is consumed; the normal product route changes; or the second device cannot complete the handoff.
- Smallest useful test: customise the prepared artifact on `/demo/create`, generate its runtime QR/link, scan it on a second phone, and verify the opened composition exactly matches. Separately open bare `/demo/receive` twice, test invalid/unsafe/legacy fragments, test local-media/oversize failure, and verify normal generated links remain independent.
- Who or what we need: deployed prototype, one presenter device, one audience device, and a no-device fallback.
- Owner: prototype/pitch team
- Timebox: one rehearsal before the pitch
- Observable supporting signal: the generated QR/link opens the exact edit on a second device; bare fallback and both base URLs remain stable; the receiver replays; local-media/oversize and invalid/unsafe/legacy errors are honest; existing visual language remains unchanged.
- Observable weakening signal: event-network, cross-device, cache, fragment, route, or visual-chrome failure; an audience member mistakes the demo link for a private keepsake delivery.
- Decision rule applied: preserve the two base rehearsal routes and normal product behaviour; use the actual generated handoff for the desired edited object and bare `/demo/receive` only as recovery fallback.
- Automated result: ten focused browser checks pass locally for editable tools, exact edited recipient/message/paper/carrier v3 round-trip in a second browser context, deterministic reload, two-context bare-fallback replay, recognized invalid/legacy-fragment rejection, receiver-flow containment, ephemeral cabinet isolation, and unchanged normal root. The existing three recipient/link/QR regression checks also pass. Protected-runtime integrity, production build, and Sites fallback checks pass. Public deployment and a physical second-device scan remain outstanding.
- What changes next: publish the verified build, customise the final artifact on `/demo/create`, save the QR generated from its exact receiver URL for the live handoff, retain `https://warm-and-fuzzies.vercel.app/demo/receive` as the deck recovery QR, then rehearse both on a second physical device.

## Completed

No completed tests yet.
