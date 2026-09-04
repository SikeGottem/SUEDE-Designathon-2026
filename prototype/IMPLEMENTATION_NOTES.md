<!-- This note records what the current coded exploratory prototype implements and what remains simulated. -->
# Prototype implementation notes

## Authority and status

- The current build follows [the friendship-appreciation product specification](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md), including its scoped carrier-and-receiving test.
- Its source cut includes **28 transcript captures**, including the latest 4 September team-design meeting. Newer direct instructions and team wireframes take priority over older narrower concepts when they conflict.
- This is a reversible test stimulus, not a selected product, validated solution, final brand, evidence of impact, or promise that a real service can make these interactions safe or easy.
- The React/Vite interface in `src/` is the executable source for this pass. Figma is a later review/refinement surface, not the authority for the coded flow.
- A live Figma re-read is currently unavailable because the Starter-plan MCP call limit was reached. This build is grounded in supplied references, wireframes, transcripts, and the spec; it does not claim live Figma parity.

## What is implemented now

| Experience moment | Current coded behaviour | Important boundary |
| --- | --- | --- |
| Home | Sparse white welcome with the working `warm & fuzzies` label and one make action. A direct receiver demo is available for review. | The name/wordmark is a working label, not a final brand decision. |
| Carrier choice | A small icon-led horizontal browse offers bottle, ladybug, paper plane, and flowers. Arrows, radio semantics, and keyboard movement complement touch browse. | This is a scoped reversible test, not a marketplace, theme system, or permanent mascot decision. |
| Studio | One scrapbook-like living page keeps recipient, reason, sender-written words, optional prompts, and placed materials together. The sample supports photo, voice, song, and a sender mark/drawing; pieces move or remove. | Content is local sample content. There is no AI writing, scoring, upload, real capture, resizing, or composition persistence. |
| Preview and seal | The chosen carrier becomes one closed object containing the maker's words and material cues, with paths to edit or change the carrier. | It is a visual prototype, not a secure sealed object. |
| Handoff | A private-link-shaped handoff includes copy, retry/failure, and calm sender completion. | Links, delivery, failure, and recovery are simulated; no account, recipient, storage, encryption, notification, or analytics exists. |
| Sender ending | A one-time courier path leads to completion that deliberately withholds receiver activity. | No real transfer has occurred and no sender telemetry is collected. |
| Arrival | A known sender appears before content. The receiver can leave for later or take a safe unavailable/wrong-person branch before intimate content. | The sample does not authenticate identity or enforce link privacy. |
| Carrier-specific opening | Bottle uses cork pull with tap/keyboard fallback; ladybug takes one optional dotted journey with direct-open fallback; plane and flowers use a direct action. | Gestures are prototype choreography, not an accessibility substitute or an endorsed product mechanic. |
| Opening and full object | Opening crosses from white/navy ink into a full navy, warm-off-white living page. The receiver reads, explicitly plays sample voice/song cues, sees photo/drawing material, and moves through one continuous object. | No audio or media file plays, and no receiver action is reported to a sender. |
| Receiver ending | Keep opens a private cabinet; close leaves quietly; remove asks for confirmation and says the maker is not told. The cabinet uses a distinct object rather than a feed row. | Cabinet and removal are local prototype branches, not a persistence or deletion guarantee. |

## Current visual and interaction language

- **Before opening:** white field, deep navy linework, generous empty space, one focal object, and no conventional bottom navigation.
- **After opening:** full deep navy with warm off-white text and marks. The white-to-navy threshold is the receiving boundary, not a decorative dark mode.
- **Type:** locally bundled Gaegu Regular is the working Ugly Dave-like face. Local Ugly Handwriting remains a fallback. Both stay replaceable after team review.
- **Icons and illustration:** carrier, material, and directional marks are code-native SVG asset slots marked for replacement. They are provisional geometry, not a final Cecelia style reference.
- **Motion:** brief carrier-specific acknowledgement and opening motion has a direct interaction path; it does not use autoplay media, confetti, particles, read states, or engagement loops.
- **No-chat contract:** there are no bubbles, reply composer, reactions, feed, notifications, streaks, public sharing, relationship scoring, or sender-visible open/keep state.

## Intentionally absent or simulated

- real login, contacts, private delivery, authentication, upload, recording, music licensing/playback, video, storage, encryption, deletion, notification, or analytics;
- real permissions, link expiry, wrong-recipient recovery, content moderation, abuse reporting, consent controls, or deployed-product accessibility guarantees;
- final name, brand system, Cecelia's carrier/mascot/mark set, final palette, final motion, or Figma reconstruction;
- a claim that the carrier set, cabinet, no-reply language, or any opening ritual has been validated with intended users.

## Verification boundary

- Protected mobile-runtime integrity and the TypeScript/Vite production build have passed for the rebuilt source.
- The source contains keyboard-labelled fields, visible labels for icon-only controls, direct opening fallbacks, focus treatment, and reduced-motion handling; these are provisions, not a completed accessibility audit.
- Browser-led walkthroughs passed on the iPhone and Pixel 10 shells for carrier choice, studio, preview, handoff success/failure, sender closure, defer/wrong-recipient paths, bottle and ladybug openings, full reveal, keep, cabinet, and removal. The preview shell still requests a missing favicon; no application runtime error or warning was observed.
- The UI post-build judge verdict is **Proceed with conditions as a test stimulus**: retain the simple opening fallbacks and no-telemetry/receiver-control contract, then compare the carrier ritual with the folded-object baseline. Evidence quality is the weakest lens because no receiver has tested the new choreography.
- The rendered-artifact authenticity verdict is **Pass for exploratory review, not final visual authority**. Ethan materially redirected the work through the wireframes, Gaegu selection, white/navy sequence, icon requirement, and rejection of the earlier wizard. The provisional code-drawn SVG family remains the strongest AI tell and the first human redraw target.

## Next human decisions

1. Review the actual mobile flow and decide whether any carrier earns further testing; do not promote the whole set by default.
2. Replace only the asset slots Cecelia wants to own, beginning with the four carriers and their opening states.
3. Run the deferred Figma delta/review when the connector limit resets and log actual differences instead of backfilling a Figma claim.
4. Test whether a made object and receiver-owned ending reduce ordinary-day appreciation awkwardness without creating a new performance burden.
