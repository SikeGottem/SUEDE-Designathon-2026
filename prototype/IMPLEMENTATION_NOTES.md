<!-- This note records what the current coded exploratory prototype implements and what remains simulated. -->
# Prototype implementation notes

## Authority and status

- The current build follows [the friendship-appreciation product specification](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md), including its scoped carrier-and-receiving test.
- Its source cut includes **31 transcript captures**, including the newest creator-interaction review. The latest recording and Ethan's following direct clarification take priority for the Studio; newer direct instructions and team wireframes take priority over older narrower concepts when they conflict.
- This is a reversible test stimulus, not a selected product, validated solution, final brand, evidence of impact, or promise that a real service can make these interactions safe or easy.
- The React/Vite interface in `src/` is the executable source for this pass. Figma is a later review/refinement surface, not the authority for the coded flow.
- A live Figma re-read is currently unavailable because the Starter-plan MCP call limit was reached. This build is grounded in supplied references, wireframes, transcripts, and the spec; it does not claim live Figma parity.

## What is implemented now

| Experience moment | Current coded behaviour | Important boundary |
| --- | --- | --- |
| Home | Almost-empty white welcome with the working `warm & fuzzies` label high on the page and the core invitation/action bottom-centred. A quiet receiver demo remains available for review. | The name/wordmark is a working label, not a final brand decision. The rejected centre squiggle is gone. |
| Carrier choice | A small icon-led browse offers bottle, ladybug, paper plane, and flowers. The selected object stands alone in negative space; arrows, radio semantics, and keyboard movement complement touch browse. | This is a scoped reversible test, not a marketplace, theme system, or permanent mascot decision. Decorative backdrops and helper-mascot copy are deliberately absent. |
| Studio | A full-screen capture-first mode opens the real browser camera, supports one-tap photo or start/stop video, device media selection, a labelled sample and blank-paper fallback, then moves directly into a sparse Story-like canvas. Recipient and words edit in place; words can be added, edited, moved, rotated or removed; voice, song and a personal mark can be added, moved, rotated or removed; and the draft survives preview/edit. | Capture stays local in memory and disappears on refresh. Camera/microphone depend on browser permission and `MediaRecorder`; unsupported/denied states never pretend capture succeeded. The Story analogy does not add Instagram branding or social mechanics. |
| Preview and seal | The chosen carrier becomes one closed object containing the maker's words and material cues, with paths to edit or change the carrier. | Its role is retained, but the hero artwork is explicitly unresolved pending Ethan's supplied layout reference. It is not a secure sealed object. |
| Handoff | A private-link-shaped handoff includes copy, retry/failure, and calm sender completion. | Links, delivery, failure, and recovery are simulated; no account, recipient, storage, encryption, notification, or analytics exists. |
| Sender ending | A one-time courier path leads to completion that deliberately withholds receiver activity. | No real transfer has occurred and no sender telemetry is collected. |
| Arrival | A known sender appears before content. The receiver can leave for later or take a safe unavailable/wrong-person branch before intimate content. | The sample does not authenticate identity or enforce link privacy. |
| Carrier-specific opening | Bottle uses cork pull with tap/keyboard fallback; ladybug takes one optional dotted journey with direct-open fallback; plane and flowers use a direct action. | Gestures are prototype choreography, not an accessibility substitute or an endorsed product mechanic. |
| Opening and full object | Opening crosses from white/navy ink into a full navy, warm-off-white living page. The receiver reads one continuous object, with only materials the sender added; generic connector squiggles have been removed. | The main receiver artwork is still an open design question. Voice and song playback remain simulated; captured photo/video stays local and in-memory, with receiver video playback under the receiver's control. No receiver action is reported to a sender. |
| Receiver ending | Keep opens a private cabinet; close leaves quietly; remove asks for confirmation and says the maker is not told. The cabinet uses a distinct object rather than a feed row. | Cabinet and removal are local prototype branches, not a persistence or deletion guarantee. |

## Current visual and interaction language

- **Before opening:** white field, deep navy linework, generous empty space, one focal object, and no conventional bottom navigation.
- **After opening:** full deep navy with warm off-white text and marks. The white-to-navy threshold is the receiving boundary, not a decorative dark mode.
- **Type:** locally bundled Gaegu Regular is the working Ugly Dave-like face. Local Ugly Handwriting remains a fallback. Both stay replaceable after team review.
- **Icons and illustration:** carrier, material, and directional marks are code-native SVG asset slots marked for replacement. They are provisional geometry, not a final Cecelia style reference.
- **Motion:** route exit/entry now remains mounted long enough to render; camera opening, shutter/record state, capture-to-canvas transition, material landing/removal, selection, sealing, carrier opening, courier transfer, reveal and cabinet placement use motion for feedback or spatial continuity. Captured video loops muted only while composing/previewing and becomes user-controlled in the receiver object; there are no decorative ambient loops, confetti, particles, read states, or engagement loops.
- **No-chat contract:** there are no bubbles, reply composer, reactions, feed, notifications, streaks, public sharing, relationship scoring, or sender-visible open/keep state.

## Intentionally absent or simulated

- real login, contacts, private delivery, authentication, server upload, durable recording/storage, music licensing/playback, encryption, deletion, notification, or analytics;
- real permissions, link expiry, wrong-recipient recovery, content moderation, abuse reporting, consent controls, or deployed-product accessibility guarantees;
- final name, brand system, Cecelia's carrier/mark set, final palette, final preview/reveal hero artwork, or Figma reconstruction;
- a claim that the carrier set, cabinet, no-reply language, or any opening ritual has been validated with intended users.

## Verification boundary

- Protected mobile-runtime integrity and the TypeScript/Vite production build pass for the corrected source.
- The source contains keyboard-labelled fields, visible labels for icon-only controls, direct opening fallbacks, focus treatment, and reduced-motion handling; these are provisions, not a completed accessibility audit.
- A post-correction browser walkthrough passes on the iPhone shell for Home, object-only carrier choice, full-screen camera/blank-paper entry, real synthetic-device photo and timed-video recording, media-file selection, text editing, material add/remove, drag, rotation, Preview/edit persistence, handoff, sender closure, arrival, bottle opening, captured-media receiver reveal, Keep, and Cabinet. The full-screen composer also passes on the Pixel 10 shell. A reduced-motion walkthrough reaches and edits the same canvas with transitions suppressed. The shell still requests a missing favicon; no application JavaScript error or warning was observed beyond Motion's expected reduced-motion notice.
- The UI post-build judge verdict is **Revise / Proceed with conditions as a test stimulus**: the latest critique is implemented, but the sealed preview and main receiver art cannot be called resolved before the promised reference and another rendered review. Evidence quality remains the weakest lens because no receiver has tested the new choreography.
- The rendered-artifact authenticity verdict is **Pass for exploratory review, not final visual authority**. Ethan materially redirected the work through direct rendered-page critique, human layouts, Gaegu selection, the white/navy sequence, and removal of generic ornament. The provisional code-drawn carrier/preview SVG family remains the strongest AI tell and the first human redraw target.

## Next human decisions

1. Test the full-screen capture → compose loop with a teammate on a real phone: starting speed, camera permission recovery, text discoverability, move/rotate ergonomics, and whether `done` is obvious.
2. Apply Ethan's promised preview/reference layout to the sealed object and receiver hero, then review those two actual renders before calling the composition resolved.
3. Replace only the asset slots Cecelia wants to own, beginning with the four carriers and their opening states; match their phone-scale line weight to Gaegu.
4. Review the actual mobile flow and decide whether any carrier earns further testing; do not promote the whole set by default.
5. Test whether a made object and receiver-owned ending reduce ordinary-day appreciation awkwardness without creating a new performance burden.
