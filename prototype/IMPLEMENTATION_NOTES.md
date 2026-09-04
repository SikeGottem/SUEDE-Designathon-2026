<!-- This note maps the canonical friendship-appreciation specification to the current disposable HTML build. -->
# Prototype implementation notes

## Authority and status

- The build follows [`WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md`](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md), grounded in all 27 transcript captures present at its source cut-off.
- It is an exploratory test stimulus, not a selected product, validated solution, final brand, or evidence of impact.
- The formal judge, challenge, visual-authenticity, and rendered-artifact audits are intentionally deferred until the team reviews this first build.

## What the current build makes real

| Contract | Implemented state |
| --- | --- |
| Sender begins from a real person and reason | `person`; both fields are required and local-only |
| Intimate content remains human-authored | `write`; a non-empty sender-written note is required and there is no AI-writing control |
| Richness stays subordinate | `material`; choose none, one simulated photo, or one simulated voice note |
| Accessible media equivalent | Photo description or voice transcript is required whenever material is selected |
| Finite object rather than chat | `preview`; no bubbles, reply field, typing state, reaction, feed, or thread |
| Honest transfer boundary | `share`; simulated link, simulated failure, preserved draft, and no delivery/storage claim |
| Giving ends for the sender | `complete`; no open, read, keep, reply, replay, or follow-up telemetry |
| Receiver knows who sent it | `arrival`; sender identity is visible before opening |
| Attention is voluntary | `deferred`; leaving unopened sends no signal and creates no reminder |
| Private link can fail safely | `unavailable`; no private content is exposed in the invalid/expired/wrong-person simulation |
| App chrome gives way to the object | `reveal`; the object becomes the screen and motion follows reduced-motion preference |
| Receiver owns the ending | `keep`, `close`, and confirmed `discard` are distinct and sender-private |
| Persistence remains optional | `kept` and the local shelf exist only as a removable test branch |

## How the broader transcript thinking is encoded

- **Neutral/open shell:** the surrounding interface stays sparse so the object carries the visual emphasis.
- **Book-cover colour logic:** palette values and object fields are CSS tokens; one coherent treatment is exposed while future colour tests remain swappable.
- **Hand-made direction:** the exact local Ugly Handwriting font is loaded. Radix icons are honest temporary stand-ins until Cecelia's consistent custom set arrives.
- **Seal and firefly thinking:** an envelope icon currently communicates unopened state. The wax seal, stamp, and firefly remain replaceable asset slots rather than fake CSS drawings.
- **Package and mascot thinking:** bottle, bird, stork, carrier pigeon, capsule, travel/migration, and multiple packaging options remain branches. None appears as a theme marketplace before one earns an interaction job.
- **No-reply tension:** structural closure is the default. Explicit “nothing is expected back” copy remains a separate comparison condition rather than an untested promise embedded in the object.
- **Archive tension:** the receiver can keep an object, but the system does not assume everyone wants persistence.
- **AI boundary:** AI shaped the research, specification, and disposable implementation; it does not write the intimate note or create fake human evidence.

## Deliberately not built yet

- final name, wordmark, mascot, custom stamp, wax seal, firefly, or Cecelia's hand-drawn controls;
- real authentication, contacts, delivery, notification, upload, storage, encryption, deletion guarantee, or analytics;
- custom colours, multiple packages, theme selection, music, video, drawing, stickers, or a broad scrapbook editor;
- reply, acknowledgement, sender-visible receiver state, streaks, prompts, reminders, scores, public sharing, or relationship maintenance;
- polished Figma reconstruction or final pitch visuals.

## Verification boundary

- Protected mobile-runtime integrity, TypeScript/Vite production build, and Sites packaging tests pass.
- Browser-led interaction and visual comparison against the supplied references are the deferred team/audit pass, not claimed here.
