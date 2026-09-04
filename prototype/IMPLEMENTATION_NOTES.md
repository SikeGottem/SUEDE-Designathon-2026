<!-- This note records what the current coded exploratory prototype implements and what remains simulated. -->
# Prototype implementation notes

## Authority and status

- The current build follows [the friendship-appreciation product specification](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md), including its scoped carrier-and-receiving test.
- Its source cut includes **39 transcript captures**, including the newest paper-first creator, carrier-ritual, unfolding, flow-order, scrapbook-material, firefly, and page-personalisation corrections. The latest recordings take priority for Studio, carrier choreography, and sequencing; newer direct instructions and team wireframes take priority over older narrower concepts when they conflict.
- The approved delta is implemented as **make letter → fold → decorate a limited envelope set and draw/apply a custom seal → choose carrier → send**. It includes paper-character choice, handwriting-style typing with recoverable strike-through Backspace, an exact compressed bearer-link receiver route, a scannable QR for that same object when it fits reliable QR capacity, and a persistent multi-object browser cabinet. Carrier-specific opening rituals and receiver-led optional-media reveal remain parked.
- This is a reversible test stimulus, not a selected product, validated solution, final brand, evidence of impact, or promise that a real service can make these interactions safe or easy.
- The React/Vite interface in `src/` is the executable source for interaction behaviour. Ethan's human-edited Figma frame is the visual authority for each screen once he marks it as the chosen design; round-trip one screen at a time instead of treating a bulk HTML capture as final design.
- A live Figma re-read was unavailable during this pass because the Starter-plan MCP call limit was reached. The coded Home follows Ethan's supplied simplified frame and now uses Cecelia's transparent B1 firefly master; it does not claim layer-, vector-, or token-level Figma parity.

## What is implemented now

| Experience moment | Current coded behaviour | Important boundary |
| --- | --- | --- |
| Home | Ethan's simplified composition: one small Cecelia-drawn firefly, the working `warm & fuzzies` title, `something good on your mind?`, and one underlined `make it for them` action in an almost-empty white field. | The name/wordmark is still a working label; no secondary demo/debug action appears on Home. |
| Studio | Home enters a full-screen paper-first maker before carrier choice. Makers choose plain, ruled, or postcard-like paper; add handwriting-style text, optional camera/device media, voice, song, freehand doodles, restrained ink colours, and a few marks; then move, rotate, edit, or remove placed pieces. Backspace preserves the text and visibly strikes through the attempted deletion; a keyboard-accessible undo restores the latest strike-through. | Capture remains local in memory. Camera/microphone depend on browser permission and `MediaRecorder`; unsupported/denied states never pretend capture succeeded. The three paper treatments are bounded prototype characters, not a template market. |
| Fold, envelope and seal | The exact authored composition visibly folds. The maker chooses one of three bounded envelope structures, opens a focused seal editor, draws/undoes/clears a personal mark, applies it to the exterior, and can return to the paper. | The seal is required in this prototype flow. The editor restores focus, closes with Escape, and never implies rarity or status. |
| Carrier choice | After the envelope is complete, an icon-led browse offers bottle, firefly, and paper plane using Cecelia's supplied art. The selected object stands alone in negative space; arrows, radio semantics, and keyboard movement complement touch browse. | This remains a scoped reversible test, not a marketplace, theme system, or permanent mascot decision. Decorative backdrops, visible trajectory lines, and helper-mascot copy remain absent. |
| Preview and seal | The maker sees only the same personalised sealed envelope exterior, with paths back to the envelope or carrier. No inside text, media, or marks leak out. | It is an exterior preview, not encryption or a service security claim. |
| Handoff | The chosen carrier performs a slow, one-shot transfer. The exact object is compressed into a copyable bearer URL. When that URL fits reliable QR capacity, the QR opens the same object; unusually detailed objects keep the exact copied link and fall back to the public generic-demo QR. A labelled broken-link state covers local-media and URL-size limits. | No account, recipient verification, encryption, notification, analytics, delivery guarantee, or expiry exists. Anyone with the link can open it. Local blob media cannot travel in the bearer URL. |
| Sender ending | The sender can watch the one-time courier depart with the carrier, then reaches a completion state that deliberately withholds receiver activity. | No real transfer has occurred and no sender telemetry is collected. |
| Arrival | A known sender appears before content. The one-time courier visibly carries and drops the selected carrier centrally at a deliberately slower pace, then leaves; the receiver can leave for later or take a safe unavailable/wrong-person branch before intimate content. | The sample does not authenticate identity or enforce link privacy. Motion paths are behaviour only, never visible line art. |
| Opening action | The receiver can double-tap the arrived object or use a visible keyboard-operable `open it` fallback. | Carrier-specific bottle/plane/firefly opening rituals remain deliberately parked. Reduced motion reaches the same content without choreography. |
| Opening and full object | The same personalised sealed exterior appears first, then the sender's exact paper, media, words, strike-throughs, doodles, colours, marks, and layout unfold as white crosses into deep navy. Receiver video never autoplays. | There is no blank generic fold or second reconstructed message screen. Voice/song playback depends on a valid local source; no receiver action is reported to the sender. |
| Receiver ending | Keep stores the object in a browser-local, multi-object cabinet; close leaves quietly; remove confirms privately and targets only the selected object. Saved objects survive reload and reopen with the original composition. | Persistence is localStorage, not an account-backed retention/deletion guarantee. Objects containing local blob media are honestly blocked from durable keeping rather than saved in a broken state. |

## Current visual and interaction language

- **Before opening:** white field, deep navy linework, generous empty space, one focal object, and no conventional bottom navigation.
- **After opening:** full deep navy with warm off-white text and marks. The white-to-navy threshold is the receiving boundary, not a decorative dark mode.
- **Type:** locally bundled Gaegu Regular is the working Ugly Dave-like face. Local Ugly Handwriting remains a fallback. Both stay replaceable after team review.
- **Icons and illustration:** Home, bottle, firefly, paper plane, and envelope now use Cecelia's supplied transparent masters from `/Users/ethanwu/Downloads/Warm and Fuzzy- Firefly Logo Assets`. The flight firefly alternates the two supplied filled states and keeps its envelope payload separate. Material controls and the small provisional sticker set remain code-native replacement slots, never emoji or a generic sticker pack.
- **Motion:** route exit/entry remains mounted long enough to render; camera opening, shutter/record state, capture-to-canvas transition, material landing/removal, selection, sealing, courier transfer, reveal and cabinet placement use motion for feedback or spatial continuity. Captured video is user-controlled everywhere and never auto-plays; there are no decorative ambient loops, confetti, particles, read states, or engagement loops.
- **No-chat contract:** there are no bubbles, reply composer, reactions, feed, notifications, streaks, public sharing, relationship scoring, or sender-visible open/keep state.

## Intentionally absent or simulated

- real login, contacts, service-grade private delivery, authentication, server upload, durable recording/storage, music licensing/playback, encryption, deletion, notification, expiry, size-limit policy, or analytics;
- real permissions, link expiry, wrong-recipient recovery, content moderation, abuse reporting, consent controls, or deployed-product accessibility guarantees;
- final name, brand system, final material/mark/sticker masters, final palette, final visual polish, or Figma reconstruction;
- a claim that the carrier set, cabinet, no-reply language, or any opening ritual has been validated with intended users.

## Verification boundary

- Protected mobile-runtime integrity and the TypeScript/Vite production build pass for the corrected source.
- The source contains keyboard-labelled fields, visible labels for icon-only controls, direct opening fallbacks, focus treatment, and reduced-motion handling; these are provisions, not a completed accessibility audit.
- A browser walkthrough passes on the iPhone shell for handwriting/strike-through/undo, paper choice, exact folding, seal drawing and focus recovery, all three carriers, exterior preview, exact compressed bearer-link round trip, same-object QR, arrival/opening, exact receiver composition, multi-object keep/reopen/remove, malformed-link safety, and reload persistence. Pixel 10 layout and all imported asset requests were also checked. The production build, protected-runtime check, and Sites fallback tests pass.
- The UI post-build judge verdict remains **Revise / Proceed with conditions as a test stimulus**. The coded behaviour is complete for the approved bounded pass; evidence quality remains the weakest lens because no intended maker/receiver has tested the flow.
- The rendered-artifact authenticity verdict is **Pass for exploratory review, not final visual authority**. Ethan materially redirected the work through rendered-page critique, human layouts, Gaegu, the white/navy threshold, and Cecelia's drawings. The code-native material controls and sticker marks remain the first human-redraw targets.

## Next human decisions

1. Test the full-screen paper-first loop with a teammate on a real phone: whether they begin writing unaided, find optional media, colour and hand-drawn stickers without losing the central writing task, understand the button order, move/rotate ergonomics, and whether `done` is obvious.
2. Review the sealed-envelope, opening, and cabinet renders with Ethan and Cecelia before calling their composition final.
3. Replace only the remaining asset slots Cecelia wants to own, beginning with scrapbook materials and marks; match their phone-scale line weight to Gaegu.
4. Review the actual mobile flow and decide whether any carrier earns further testing; do not promote the whole set by default.
5. Test whether a made object and receiver-owned ending reduce ordinary-day appreciation awkwardness without creating a new performance burden.
