<!-- This ingest reconstructs the friendship-appreciation product vision from the complete transcript set without turning brainstorms into decisions. -->
# Friendship appreciation — transcript ingest

> **Status:** Source reconstruction for human review. This page describes what the team was reaching for, what changed over time, and what remains unresolved. It is not user validation.
>
> **Source cut:** all 47 raw transcript files currently in `WIKI/TRANSCRIPTS/`, read end to end. Setup tests, scheduling, food conversation, and unintelligible fragments were checked but do not count as product evidence.
>
> **Recency rule:** later conversations refine or supersede earlier ones only when they clearly revisit the same choice. The latest direct instruction from Ethan outranks transcript-era proposals for the current prototype, but it does not become population evidence.

## Why this ingest was necessary

The previous prototype specification preserved several valuable safeguards, but translated the product into a sequence of fields: choose a person, add a reason, write, add one material, preview, send. That was the safe and boring version of the idea.

The later recordings describe something richer:

> A person composes a private digital care package for someone they already value. Their own words sit inside a scrapbook-like object with selected memory materials. The friend opens it through a deliberate receiving ritual, experiences it away from chat, and can return to it as something that belongs to them.

The product is therefore not a message form with decoration. It is a **small authored object and the experience of giving, receiving, and keeping it**.

The no-reply/no-telemetry contract still matters. It is a structural boundary around the experience, not the whole visible product.

## Evidence hierarchy used here

1. **Latest implementation review and direct prototype instructions, 5 September 2026**
   - restart after a complete WIKI ingest;
   - make the real product in code rather than treating Figma as the final artifact;
   - create a conceptual, page-by-page specification before restarting implementation;
   - reject the existing form-like prototype as the boring version;
   - use a white phase followed by a deep-navy phase;
   - use Ugly Handwriting and sparse human-drawn linework;
   - borrow the supplied `grug` reference's visual grammar, not its identity.
   - [65e72…](TRANSCRIPTS/2026-09-04-65e72fa1-b8b1-5b23-869d-dd63f1a92d6b.md) records the team reviewing the first coded flow: a paper-sheet creator, a compact scrollable material rail, hand-drawn asset work, cabinet retention, and presentation constraints.
   - [4bf652…](TRANSCRIPTS/2026-09-04-4bf6522b-ed6e-5d7d-a2d6-62ec7981fd4e.md), created later on the same channel, is the highest-weighted direct critique of that render: simplify the home and carrier screens, remove ornamental paths/helper copy, rebuild the mobile creator, and preserve the cabinet. It is internal design feedback, not validation.
   - [d4b7ec…](TRANSCRIPTS/2026-09-04-d4b7ec93-efb6-516d-99da-c84cfa746154.md), [d4ea28…](TRANSCRIPTS/2026-09-04-d4ea28f5-a996-57e1-adbe-69726a64f356.md), and [a9499b…](TRANSCRIPTS/2026-09-04-a9499b3d-07e2-5182-bdfd-a9a85f9860db.md) form the newest creator sequence. They keep full-screen, sparse, movable/rotatable making, but correct the literal Story/camera reading: creation starts on paper, media becomes an optional Polaroid-like material, and drawing must be real.
   - [913ddc…](TRANSCRIPTS/2026-09-04-913ddc06-3a86-513e-a05c-3c0bbe1d4312.md), created later, narrows the carrier ritual: Preview is exterior-only; a one-time courier picks up and later drops the selected carrier; double-tap opening needs a direct fallback.
   - [2d8ab5ab…](TRANSCRIPTS/2026-09-04-2d8ab5ab-b58f-5864-98e7-b63865cb6c37.md) corrects the rendered ritual: make the courier slow enough to read, do not render path/squiggle guides as decoration, keep the paper as a non-scrolling object, and make opening visibly unfold. The number of revealed pages remains open.
   - [4ef45d20…](TRANSCRIPTS/2026-09-04-4ef45d20-2643-5baa-97e2-ea66e5810701.md), created later, puts carrier choice after the maker has composed the message. This is a current reversible sequencing condition, not usability evidence.
   - [bbc5485c…](TRANSCRIPTS/2026-09-04-bbc5485c-837c-538c-b9e0-855e7aec8060.md), created later, removes the flower from the current carrier set, makes unfolding reveal the completed composed object directly, and asks for restrained colour/sticker materials so the creator feels like a real scrapbook tool. Exact palette, sticker set, and receiver media reveal remain open.
   - [166f8cfb…](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md), created later at `2026-09-04T17:37:23.816Z`, directly replaces the current test's ladybug with the firefly (00:18; 04:59). The firefly remains a one-shot courier/carrier treatment, not a persistent product mascot.
   - [0c2a02aa…](TRANSCRIPTS/2026-09-04-0c2a02aa-848e-5dae-9fe0-339d566da09a.md), created later at `2026-09-04T17:37:47.513Z`, asks for more personalisation and selectable page-design/page-character variation (00:00). It does not define a taxonomy, count, multi-page flow, or template marketplace.
2. **Late all-team product and art-direction discussions**
   - [57f27…](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md), [bc84e…](TRANSCRIPTS/2026-09-04-bc84e57a-ba81-599a-99b4-01fd57bf0db4.md), and [204b7d…](TRANSCRIPTS/2026-09-04-204b7d68-eafa-5040-ae13-5e6f1e561644.md).
3. **The problem and medium being sharpened**
   - [356211…](TRANSCRIPTS/2026-09-04-356211db-c212-5765-bcbb-205d615e351d.md), [532244…](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md), [084643…](TRANSCRIPTS/2026-09-04-0846430d-0a6c-5674-a89d-0378f1484d38.md), and [964995…](TRANSCRIPTS/2026-09-04-9649957a-8ed5-5165-9c04-41f83053cc97.md).
4. **Earlier ideation and presentation discussions**
   - Recordings 14–20. These explain how the friendship direction emerged, but later discussion carries more weight where details conflict.
5. **External research**
   - Useful for challenging claims, never proof that the team's proposed experience works.

## How the direction changed

| Point in the conversation | What the team was considering | What survived |
| --- | --- | --- |
| Before the friendship thread | Pickup sport, approaching strangers, broad social friction | These remain historical divergence, not part of this product. |
| First friendship pivot | A link to a custom digital letter; possibly a daily or random-recipient ritual | The personal link survived. Assigned friends, daily prompts, and gratitude streaks did not. |
| Problem refinement | Appreciation exists, but choosing to express it can feel unusual; chat also implies a conversational turn | The difficult moment is expression, channel choice, interpretation, and possible reciprocity debt. |
| Letter + scrapbook merge | Make something written, personal, visual, and sendable | This became the strongest form direction. A plain letter alone was considered too familiar. |
| Digital-medium argument | Add photos, voice, songs, video, drawing, motion, and replay | Rich media survived as the reason to explore digital, but no exact media limit was decided. |
| Receiver refinement | The object should feel owned and revisitable, like returning to a camera roll or saved voice note | Receiving and later revisitation became as important as sending. |
| Delivery exploration | QR/link, envelope, bottle, bird, stork, carrier pigeon, firefly, seal, stamp, selectable packages, and delay | Private link and a deliberate opening survived. Exact vessel, courier, and delay did not settle. Literal courier mascots were criticised as obvious and AI-like. |
| Late visual work | Open empty space, inviting colour, shared hand-drawn language, real team-made assets | The handmade system survived. Current direct instruction narrows v0 to white first, then deep navy. |
| Current correction | The first implementation felt like a generic form and missed the rich experience | The next artifact must start from this ingest and the conceptual spec, not inherit that layout. |
| Latest render critique | The first rich coded pass still had too much ornamental/AI-looking surface and a crowded mobile creator | Keep the core flow, carrier test, opening and cabinet; simplify the home/carrier visual fields, give the creator one mobile paper sheet with progressive disclosure, and use team-drawn assets before treating a visual choice as final. |
| Newest creator correction | Even the paper-sheet revision lacked a resolved mobile interaction model | Make creation full-screen and paper-first; use Story-like direct manipulation, movable/rotatable text, real freehand drawing and sparse contextual tools without copying Instagram's brand or social mechanics. |
| Latest carrier sequencing and motion correction | Carrier choice interrupted expression; the courier and opening treatment read as unfinished | Compose first, then choose a carrier. Make the courier's transport legible and the opening visibly unfold; do not turn path guides into decoration or make a paper object scroll. |
| Latest customization and direct-reveal correction | The creator lacked enough authored choice, and unfolding led to an extra transition instead of the object itself | Remove flower from the current carrier test; let unfolding reveal the completed composed object directly; add restrained colours and stickers as optional authored materials. |
| Latest carrier and personalisation correction | The current ladybug and one-look page treatment were too narrow | Replace ladybug with firefly in the reversible trio; investigate a small selectable page-design/page-character variation so the authored object can become more personal. Exact variation system remains open. |

## Reconstructed product vision

### The unwritten rule

On an ordinary day, direct appreciation between friends is not always socially expected. Without a birthday, farewell, crisis, or another accepted occasion, a sincere message can feel unusually intense, romantic, farewell-like, alarming, or as though it requests an equally meaningful response.

This is a working rule, not a universal statement about men, Australians, young people, or friendship generally.

### The human moment

The sender already has a real person and thought in mind. The product does not tell them whom to appreciate or manufacture a feeling. It helps them cross the gap between noticing the thought and giving it a form that feels deliberate.

The receiver is not a reveal target. They need a safe threshold, control over their attention, and an ending that does not perform gratitude back to the sender.

### The object

The core object is best understood as a **digital care package**, **sendable scrapbook**, or **personal artifact** rather than a digital card or letter app.

It can combine:

- the sender's own written core;
- a photograph or memory image;
- a voice recording that can be heard again later;
- a meaningful song or sound;
- a short video;
- a drawing, sticker, signature, stamp, or personal mark;
- spatial arrangement and sequence as part of what the sender communicates.

The transcript repeatedly treats these as a palette of expressive materials. It does not establish that every object needs every material, or that more media automatically means more care.

### The creator experience

Creation should take over the phone like a Story composer while remaining a private, finite paper object rather than a social post. The newest review makes ease and interaction—not added graphics—the unresolved design problem.

- The sender begins voluntarily with one person in mind.
- The maker starts on blank physical paper, with restrained hand-drawn ruling rather than tacky texture.
- Camera, existing media and short video remain optional actions; a successful capture becomes a small movable Polaroid-like material rather than the full-screen surface.
- The recipient is a lightweight anchor inside the workspace, not a separate administrative screen.
- Writing is central and remains human-authored.
- Writing and selected memory materials land directly on the full-screen paper.
- Memory tools remain sparse and contextual rather than forming a Canva-like control wall.
- Chosen text and materials can be selected, moved, rotated, edited, overlapped, or removed directly on the canvas.
- Optional reflective cues such as “favourite memory,” “what you taught me,” or “one word” help when requested; they do not become mandatory questions.
- Creative effort should be visible through selection, arrangement, drawing, recording, and personal marks—not artificial waiting, needless friction, or an overloaded canvas.
- The sender previews the finished experience as a whole, then gives it a boundary by finishing or sealing it.

The strongest evidence for this richer authoring model appears in the late discussion of a scrapbook-like, multimedia artifact ([57f27… lines 28–76](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md)), the argument that layout and creative decisions are themselves communication ([532244… line 20](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md)), and the newest creator sequence: Story-like direct manipulation ([d4b7ec… 20:03–22:18](TRANSCRIPTS/2026-09-04-d4b7ec93-efb6-516d-99da-c84cfa746154.md)), then paper-first correction ([d4ea28… 34:35–39:56](TRANSCRIPTS/2026-09-04-d4ea28f5-a996-57e1-adbe-69726a64f356.md); [a9499b… 03:55–07:17](TRANSCRIPTS/2026-09-04-a9499b3d-07e2-5182-bdfd-a9a85f9860db.md)).

### The handoff

The sender shares a private link. The receiver should not need to install an app merely to receive the object. A QR code can expose the same link during the pitch, but the normal product is person-to-person rather than room-wide.

For the sender, giving ends after the handoff. There is no open status, replay count, relationship score, or prompt to chase a response.

### The receiving experience

Receiving is an authored sequence, not just the sender's preview with controls removed.

1. The receiver knows who made the object before opening it.
2. They can open now, leave, or return later without creating a sender-visible signal.
3. Opening creates a deliberate threshold between an ordinary link and a private object.
4. The object fills attention; chat and product chrome recede.
5. Words lead, while the receiver chooses when to reveal or play other materials.
6. The receiver chooses what happens at the end: close, keep, or remove.
7. If kept, it may join a private memory cabinet and remain replayable.

The cabinet/archive is a strong repeated desire, especially in the camera-roll and year-later voice-message examples. Its permanence and exact model remain open.

### What digital contributes

Digital does not win merely by being faster than post. It has to earn its place through a combination of:

- private, account-light delivery over distance;
- mixed media in one authored object;
- controlled reveal and motion;
- replayable voice, music, video, or animation;
- a revisitable personal collection;
- accessible alternatives for content and motion.

The product should not claim to be better than a physical letter for everyone. Physical letters, texts, voice notes, gifts, humour, actions, and in-person care remain credible alternatives and test controls.

## Current visual and emotional arc

### White: making and waiting

The creator side is bright white, spacious, quiet, and unfinished. Dark ink and sparse hand-drawn marks make it feel like a place where a person is making something. The sealed arrival can remain in this white world so the private content is not visually exposed before consent.

### The threshold

Opening is the state change. White gives way to deep navy as the object becomes the receiver's private space. The colour transition has a product job: it separates making/notification from receiving/attention.

### Navy: receiving and remembering

The opened object occupies a deep-navy world with warm off-white writing and linework. It should feel still, immersive, and personal—not dark-tech, glossy, or cinematic for its own sake.

### Reference boundary

Borrow from the supplied `grug` references:

- Ugly Handwriting;
- airy placement;
- imperfect line icons and drawings;
- restrained copy;
- large areas without interface furniture;
- a single full-screen colour field.

Do not borrow:

- the `grug` name or wordmark;
- its flower, sunrise, navigation, copy, or phone composition;
- its mascot identity;
- an exact screen recreation.

### Latest visual correction — sources 29 and 30

The late 4 September review makes the current hierarchy more specific. The home page keeps the core invitation but becomes minimal: no central decorative loop, with the invitation and action bottom-centred. The carrier picker remains a small horizontal object browse, but it shows the selected carrier alone in generous negative space: no background route/wave paths and no mascot/helper explanation at the bottom. Purposeful motion belongs to object selection, placement, departure, opening, and receiver ownership; it must not replace space or become ambient ornament.

The team also identified a craft requirement: the important recurring objects need team-drawn replacements, with line weight that sits close to Gaegu's weight and confidence. Current AI/code-generated stand-ins are implementation placeholders, not a visual approval. The 35-minute source briefly explored a rotating 3D tree archive, then rejected it as out of scope and low leverage for the designathon; keep the simpler cabinet direction.

For the pitch, block the slide layout and story before asking AI to refine a visual treatment. A silent room presentation must not rely on song, audio, or an audio-only explanation. These are internal workflow and design-direction notes, not audience evidence.

## Current confidence ledger

### Confirmed for the next conceptual draft

- Restart from the WIKI rather than repair the current UI.
- Build a real coded product later; do not make Figma the current destination.
- Write and review the conceptual product first.
- Use a richer authored artifact, not a field-by-field wizard.
- White comes before deep navy.
- Use Ugly Handwriting and a coherent set of human-drawn marks.
- Keep the reference influence visible but non-derivative.

### Strong late-transcript direction

- Friendship appreciation is the selected problem territory.
- The product is closer to a digital care package/scrapbook artifact than a letter app.
- Sender creativity and receiver experience are both primary.
- Personal words are written by the sender, not AI.
- Mixed media, motion, ownership, and revisitation are the main reasons to explore digital.
- Private link delivery and an intentional opening are desirable.
- The object should sit outside chat and should not create sender-visible reply pressure.

### Proposed in the conceptual spec for review

- One living creator studio rather than separate recipient/reason/write/media pages.
- A single composition that holds several kinds of memory fragments without becoming an infinite editor.
- One provisional sealed-object treatment for the first prototype.
- White remains through the unopened arrival; navy begins at the opening threshold.
- A private receiver cabinet appears as an optional but visible branch.

### Still open

- The first exact relationship context and ideal customer profile.
- Which outcome leads: expression hesitation, misinterpretation, reply debt, or durable memory.
- How freeform the composition surface should be.
- Which media are available and how many belong in one object.
- Whether a small selectable page-design/page-character variation helps the object feel personal, and what it should contain. No count, taxonomy, multi-page flow, or marketplace is approved.
- Exact vessel: folded object, envelope, seal, bottle, another package, or no literal container.
- Whether firefly's one-shot carrier/courier treatment is legible without becoming decoration.
- Whether any acknowledgement exists.
- Whether kept objects are permanent, temporary, exportable, or revocable.
- Final product name, logo, brand palette, and deck identity.
- Whether music is manual or can begin after explicit opening consent.

### Superseded, rejected, or historical only

- The existing one-field-per-screen prototype as the expression of the vision.
- A daily assignment, random friend, gratitude streak, or reminder-led act.
- AI-written intimate content.
- A generic chat, social feed, public profile, or relationship dashboard.
- A plain text-only pen-pal product as the final ambition.
- Forced delay as proof of sincerity.
- A male-only or mental-health framing.
- Anonymous delivery.
- Read receipts, reply composer, reactions, open/keep/replay analytics, or sender follow-up nudges.
- Shipping many packages, animals, or themes at once.
- Treating a literal courier mascot as originality.
- Claiming digital is universally more meaningful than physical.
- Fabricated surveys, quotes, validation, or judge-specific personalisation.

## Pitch implications preserved from the recordings

- Explain the problem and product so someone with no design background can repeat them.
- Sell the changed experience in the live pitch; keep process and AI disclosure in the required documentation/appendix unless it materially strengthens the story.
- A working QR/link can let the room receive a generic object as the closing demo.
- Participation must be optional, accessible, non-personal, and never treated as outcome evidence.
- Do not research judges privately to personalise the object.
- Humour should clarify the tension at most once or twice, not become the tone of the whole pitch.

## Source map

| Topic | Strong transcript sources | Status |
| --- | --- | --- |
| Ordinary-day appreciation rule | [Recording 17 lines 727–816](TRANSCRIPTS/2026-09-04-new-recording-17.md), [Recording 20 lines 60–100](TRANSCRIPTS/2026-09-04-new-recording-20.md), [57f27… lines 28–76](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md) | Chosen problem territory; population scope unvalidated |
| Letter + scrapbook merge | [Recording 17 lines 503–839](TRANSCRIPTS/2026-09-04-new-recording-17.md), [532244… line 20](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md) | Repeated direction |
| Multimedia digital artifact | [084643… lines 20–21](TRANSCRIPTS/2026-09-04-0846430d-0a6c-5674-a89d-0378f1484d38.md), [964995… lines 114–150](TRANSCRIPTS/2026-09-04-9649957a-8ed5-5165-9c04-41f83053cc97.md), [57f27… lines 28–76](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md) | Strong repeated desire; exact media open |
| Receiver ownership and cabinet | [084643… line 21](TRANSCRIPTS/2026-09-04-0846430d-0a6c-5674-a89d-0378f1484d38.md), [964995… lines 114–150](TRANSCRIPTS/2026-09-04-9649957a-8ed5-5165-9c04-41f83053cc97.md), [57f27… line 28](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md) | Repeated desire; permanence open |
| Private link and opening ritual | [Recording 19 lines 112–196](TRANSCRIPTS/2026-09-04-new-recording-19.md), [356211… line 20](TRANSCRIPTS/2026-09-04-356211db-c212-5765-bcbb-205d615e351d.md) | Repeated direction |
| No AI-authored intimacy / finite receiving contract | [356211… line 20](TRANSCRIPTS/2026-09-04-356211db-c212-5765-bcbb-205d615e351d.md), [532244… lines 20–34](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md) | Strong boundary |
| Hand-drawn/open art direction | [57f27… lines 244–247](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md), [bc84e… lines 359–524](TRANSCRIPTS/2026-09-04-bc84e57a-ba81-599a-99b4-01fd57bf0db4.md), [204b7d… lines 35–94](TRANSCRIPTS/2026-09-04-204b7d68-eafa-5040-ae13-5e6f1e561644.md) | Strong preference, narrowed by latest direct instruction |
| Product-first pitch and working QR ending | [8d391… lines 33–54](TRANSCRIPTS/2026-09-03-8d39172c-4cee-5766-97e7-90708888daf3.md), [Recording 19 lines 133–196](TRANSCRIPTS/2026-09-04-new-recording-19.md), [Recording 14 lines 21–76](TRANSCRIPTS/2026-09-04-new-recording-14.md) | Team pitch direction; organiser disclosure rules still apply |
| Current render correction, full-screen paper-first creator and carrier ritual | [65e72… 32:28–34:16](TRANSCRIPTS/2026-09-04-65e72fa1-b8b1-5b23-869d-dd63f1a92d6b.md), [4bf652… 01:26–03:17](TRANSCRIPTS/2026-09-04-4bf6522b-ed6e-5d7d-a2d6-62ec7981fd4e.md), [d4b7ec… 20:03–22:18](TRANSCRIPTS/2026-09-04-d4b7ec93-efb6-516d-99da-c84cfa746154.md), [d4ea28… 34:35–39:56](TRANSCRIPTS/2026-09-04-d4ea28f5-a996-57e1-adbe-69726a64f356.md), [a9499b… 03:55–07:17](TRANSCRIPTS/2026-09-04-a9499b3d-07e2-5182-bdfd-a9a85f9860db.md), [913ddc… 04:21–07:58](TRANSCRIPTS/2026-09-04-913ddc06-3a86-513e-a05c-3c0bbe1d4312.md), [2d8ab5ab… 15:29–17:56](TRANSCRIPTS/2026-09-04-2d8ab5ab-b58f-5864-98e7-b63865cb6c37.md), [4ef45d20… 03:26–05:24](TRANSCRIPTS/2026-09-04-4ef45d20-2643-5baa-97e2-ea66e5810701.md), [bbc5485c… 01:59–05:28](TRANSCRIPTS/2026-09-04-bbc5485c-837c-538c-b9e0-855e7aec8060.md), [166f8cfb… 00:18, 04:59](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md), and [0c2a02aa… 00:00](TRANSCRIPTS/2026-09-04-0c2a02aa-848e-5dae-9fe0-339d566da09a.md) | Newest team creator/ritual direction; internal design direction only |

## Honest boundary

This ingest can reconstruct intent. It cannot prove desirability, causality, safety, or whether a digital artifact changes the unwritten rule. Those claims still need real sender and receiver evidence. The next document is therefore a conceptual prototype proposal for Ethan and the team to approve, edit, or reject—not a validated product specification.

## 4 September design-session addendum — source 28

**Source:** [d5e3d4ea…](TRANSCRIPTS/2026-09-04-d5e3d4ea-70d8-55cc-9baa-d319ad5e7e1c.md), a 77-minute team meeting recorded on **4 September 2026**. It is team-intent evidence only, despite being ingested after Ethan's newer direct prototype instruction.

The meeting explored a browseable set of large, hand-drawn container/carrier icons; horizontal movement so each drawing can have room; a scrapbook-like creation surface closer to arranging pieces in Figma than filling out fields; a physical cabinet holding visually distinct objects; a bottle whose opening releases its contents; and a ladybug travelling with a dotted path as a sending/arrival notification idea. It also records preference for dark blue/navy, butter yellow and other soft colours, while explicitly leaving palette selection for prototype testing.

These are not settled product choices. The prior transcript also contains menus of containers, courier animals, wood/bookcase metaphors, mascot ideas, and a bottom-navigation debate. The later sources govern the current build: use only a small reversible carrier set and horizontal browse; let the selected carrier affect handoff, arrival and opening choreography; use a bottle/cork interaction with a simple fallback; treat the firefly as a one-time courier/carrier action rather than a persistent mascot; avoid bottom navigation; keep the cabinet as distinct physical objects; and retain the rich scrapbook-like creator. The white-plus-navy sequence, Gaegu working type, and soft-yellow/other-palette question are likewise implementation choices or open visual tests, not validation.

## 4 September implementation-review addendum — sources 29 and 30

**Sources:** [65e72fa1…](TRANSCRIPTS/2026-09-04-65e72fa1-b8b1-5b23-869d-dd63f1a92d6b.md), 35-minute team review, created `2026-09-04T15:25:25.181Z`; and [4bf6522b…](TRANSCRIPTS/2026-09-04-4bf6522b-ed6e-5d7d-a2d6-62ec7981fd4e.md), 4-minute direct render critique, created later at `2026-09-04T15:27:36.809Z`. The later critique governs conflicts.

- **Home:** retain “something good on your mind?” and the making action, but remove the central decorative loop; put the invitation/action bottom-centre and keep the page minimal ([4bf652… 01:26]).
- **Carrier chooser:** retain “pick how it arrives” and the limited carrier browse, but remove bottle-wave/firefly-route backdrop paths and the bottom helper/mascot explanation. The object alone, negative space, and purposeful transition motion do the work ([4bf652… 01:26]; later firefly replacement at [166f8cfb… 00:18, 04:59](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md)).
- **Creator:** the existing first pass was judged overcrowded and insufficiently mobile. Keep one page, but make it read as one paper sheet; move addable pieces behind a compact, scrollable control rather than a field-like or cluttered layout ([65e72… 32:51–33:40]; [4bf652… 01:26]).
- **Preview, opening and cabinet:** preserve the preview's “ready to give” role, deliberate opening, keep action, and cabinet. The preview hero artwork remains open pending the screenshot/reference Ethan said he would send; no final visual choice is inferred ([65e72… 33:40–34:16]; [4bf652… 02:55–03:17]).
- **Craft and pitch:** replace important generated stand-ins with team-drawn priority assets; match illustration line weight to the Gaegu system ([65e72… 15:50–16:28; 26:40–27:39]). Build deck structure/layout first, then use AI as a bounded refinement tool; make every presentation-critical point understandable without audio ([65e72… 25:50–26:19; 30:21–30:58]).

These recordings show the team correcting its own prototype. They do not establish that any screen, gesture, archive, carrier, or no-reply contract works for intended recipients.

## 4 September newest creator addendum — source 31

**Source:** [d4b7ec93…](TRANSCRIPTS/2026-09-04-d4b7ec93-efb6-516d-99da-c84cfa746154.md), 23-minute team capture created `2026-09-04T15:51:31.829Z`. Product-relevant discussion occurs at 17:04, 18:48, and 20:03–22:18; unrelated ambient conversation is not treated as product evidence.

- The team says the prototype still does not make motion visible enough and that transcript details were missed (17:04; 18:48).
- The remaining hard problem is the creation board's interaction model, not another graphics pass (20:03–21:24).
- The prior creation page is explicitly identified as the weakest page because it had no resolved interaction design (21:01).
- The selected direction is a sparse blank canvas that works like Instagram Stories: text can move and rotate, the page should not show too much, and mobile ease is the priority (21:42–22:18).
- Ethan's following direct clarification made the creator full-screen. Sources 32 and 33 then narrow that request: full-screen remains, while capture-first does not.

“Story-like” describes full-screen focus, direct manipulation, sparse contextual tools, and low-friction making. It does not add capture-first camera hierarchy, Instagram branding, posting, expiry, views, reactions, replies, followers, or feed mechanics. This remains internal design direction, not proof that intended senders can create comfortably or that recipients value the result.

## 4 September paper-first creator correction — sources 32 and 33

**Sources:** [d4ea28f5…](TRANSCRIPTS/2026-09-04-d4ea28f5-a996-57e1-adbe-69726a64f356.md), 44-minute team capture created `2026-09-04T16:36:03.384Z`, especially 34:35–39:56; and [a9499b3d…](TRANSCRIPTS/2026-09-04-a9499b3d-07e2-5182-bdfd-a9a85f9860db.md), 8-minute follow-up created `2026-09-04T16:43:10.738Z`, especially 03:55–07:17. The later source confirms the correction.

- Full-screen creation and direct manipulation remain, but the literal Story/camera interpretation is rejected.
- Creation opens on blank physical paper. Restrained hand-drawn lines can make the paper legible; a faux paper texture is explicitly rejected as tacky.
- Camera, photo and video are optional material actions. A captured image belongs as a small movable Polaroid-like item on paper, not as the canvas background or first screen.
- The current button order is unresolved and needs redesign around making on paper, adding a material, arranging it, and finishing.
- Drawing must become a usable freehand doodle interaction rather than a random placeholder mark.
- At this point, the bottle, ladybug, plane and flowers were the small candidate carrier set. Source 37 later removes the flower, and source 38 later replaces the ladybug with the firefly, leaving bottle, firefly, and paper plane for the current reversible test. The team also says the product still risks feeling too much like an app; this is a critique to test, not a license to add decoration.

These are internal team-direction corrections only. They do not prove a paper-first Studio is easier, more meaningful, or more authentic for intended senders or recipients.

## 4 September carrier ritual correction — source 34

**Source:** [913ddc06…](TRANSCRIPTS/2026-09-04-913ddc06-3a86-513e-a05c-3c0bbe1d4312.md), 9-minute team capture created `2026-09-04T16:52:08.940Z`. Product-relevant direction appears at 04:21–07:58.

- Preview should show the chosen sealed carrier by itself. The object interior and material fragments must not be exposed underneath it.
- For this one reversible choreography test, a hand-drawn courier enters at handoff, collects the selected carrier, and leaves. At arrival it carries and drops the same carrier centrally before leaving.
- The asset handoff needs wing-up, wing-down, carrying, pickup and drop states, with the carrier or letter as a separate payload layout.
- Double-tap is the proposed opening action. It requires an equally direct visible tap, keyboard, and reduced-motion fallback; gesture is not the only instruction.
- The courier is a one-time functional delivery action, not a persistent mascot, pet, brand identity, navigation device, or collection mechanic.

This is internal prototype direction only. It does not establish that hiding the interior, courier motion, or double tap improves trust, meaning, or usability.

## 4 September carrier sequencing and opening correction — sources 35 and 36

**Sources:** [2d8ab5ab…](TRANSCRIPTS/2026-09-04-2d8ab5ab-b58f-5864-98e7-b63865cb6c37.md), 18-minute team capture created `2026-09-04T17:10:48.356Z`, especially 15:29–17:56; and the later [4ef45d20…](TRANSCRIPTS/2026-09-04-4ef45d20-2643-5baa-97e2-ea66e5810701.md), 6-minute capture created `2026-09-04T17:16:09.300Z`, especially 03:26–05:24.

- The maker composes the message before choosing how it arrives. Carrier choice remains a small reversible handoff treatment, not an entry task or a claim about what makes appreciation meaningful.
- Courier motion must be slow enough to communicate pickup, departure, arrival, and drop. Sketchy paths and squiggles may describe motion during design, but must not appear as final interface decoration.
- The paper is a physical object, not a scroll surface. At this point the number of revealed pages was still open; source 37 supersedes that uncertainty by requiring the fold to reveal the full composed object directly, while the pacing of optional media remains open.

These are direct internal build corrections. They do not prove that the order is easier, that a courier improves comprehension, or that unfolding changes the receiver's experience.

## 4 September customization and direct-reveal correction — source 37

**Source:** [bbc5485c…](TRANSCRIPTS/2026-09-04-bbc5485c-837c-538c-b9e0-855e7aec8060.md), 6-minute capture created `2026-09-04T17:22:18.230Z`, especially 01:59–05:28.

- Remove the flower from the small reversible carrier set. Source 38 later replaces the remaining ladybug with the firefly; the current test trio becomes bottle, firefly, and paper plane. This does not settle the final vessel.
- When the receiver opens the object, the fold directly reveals the full composed object. Do not add a separate post-unfold transition; receiver-led optional media actions remain open.
- Add restrained maker-selected colour and sticker materials to the paper-first Studio so authorship can extend beyond the existing doodle, voice, and video tools. Writing remains the centre; palette, sticker set, and media limits remain open.

This is direct internal prototype direction only. It does not establish that customization, a direct reveal, or any carrier changes meaning, comprehension, or desire to receive the object.

## 4 September carrier and personalisation correction — sources 38 and 39

**Sources:** [166f8cfb…](TRANSCRIPTS/2026-09-04-166f8cfb-39ee-57ce-9eaa-8b1a114657af.md), 15-minute capture created `2026-09-04T17:37:23.816Z`, especially 00:18 and 04:59; and the later [0c2a02aa…](TRANSCRIPTS/2026-09-04-0c2a02aa-848e-5dae-9fe0-339d566da09a.md), 1-minute capture created `2026-09-04T17:37:47.513Z`, at 00:00.

- Replace the current test's ladybug with the firefly. The firefly is a one-shot carrier/courier role within handoff and arrival, never a persistent product mascot, pet, helper, navigation device, or brand identity.
- The current scrapbook treatment is judged insufficiently personal. Test a small selectable page-design/page-character variation alongside maker-authored materials so the object can carry more of the sender's own taste.
- The sources do not prescribe what those designs are, how many exist, whether they are pages or modes, or a multi-page sequence. They do not authorise a public template gallery, popularity ranking, marketplace, or a return to a dense editor.

These are latest internal prototype directions, not user research or proof that a firefly, page variation, or more customisation improves authenticity, expression, comprehension, or receiver experience.

## 5 September hub, pitch, and carrier-polish addendum

**Sources:** [create/look hub capture](TRANSCRIPTS/2026-09-05-aa8e2e8e-d941-5e71-99b8-4d261be1011b.md), [paper, stamp, and carrier-order capture](TRANSCRIPTS/2026-09-05-be0d1955-63fe-50d6-8841-e056c927469a.md), [pitch review](TRANSCRIPTS/2026-09-05-36abc9a9-4368-56af-9d56-cc91795ba5c7.md), and [prototype and demo review](TRANSCRIPTS/2026-09-05-5697c82d-2e9b-52ae-9644-e8133a703b83.md). The one-minute [coordination capture](TRANSCRIPTS/2026-09-05-cb6dcf78-9106-590a-9c97-716f33a30a19.md) and the prior one-word capture were checked but contain no product decision.

- The supplied landing remains the root, then opens a sparse hub with exactly two intentions: create something or look in the old box. This replaces the adaptive returning-user dashboard interpretation.
- The maker starts on dotted paper and can choose plain, dotted, or grid. The working order is make the paper, draw or reuse a personal stamp, choose bottle/firefly/plane, give, then leave the sender on the quiet ending.
- Carrier-specific departure is now more exact: water must wash the bottle away; the firefly handoff needs a readable flutter/anticipation beat; the paper plane retains its own flight. Motion remains one-shot and non-blocking, with a static reduced-motion equivalent.
- The personal stamp should render with heavier, smoother marks and remain a deliberately small authorship tool. A possible collection or stack of saved seals was liked, but its mechanics and value remain exploratory; do not turn it into completion, ranking, or marketplace behaviour.
- Navy remains the current selected direction. Green was raised only as a reversible visual experiment.
- The deck must eventually use a verified live receiver QR and a real team photo in a bespoke team layout. Neither asset may be fabricated; the QR remains blocked until a public URL works on a second device, and the team layout remains blocked until the team supplies and approves the photograph and names.
- The pitch problem is the expression barrier: people may care but not know how to show appreciation naturally. This is team framing, not a prevalence or impact finding.

These captures refine the current exploratory build and pitch. They do not prove that the hub, paper choice, stamp, carrier theatre, cabinet, or digital medium solves the expression barrier.
