<!-- This ingest reconstructs the friendship-appreciation product vision from the complete transcript set without turning brainstorms into decisions. -->
# Friendship appreciation — transcript ingest

> **Status:** Source reconstruction for human review. This page describes what the team was reaching for, what changed over time, and what remains unresolved. It is not user validation.
>
> **Source cut:** all 27 raw transcript files currently in `WIKI/TRANSCRIPTS/`, read end to end. Setup tests, scheduling, food conversation, and unintelligible fragments were checked but do not count as product evidence.
>
> **Recency rule:** later conversations refine or supersede earlier ones only when they clearly revisit the same choice. The latest direct instruction from Ethan outranks transcript-era proposals for the current prototype, but it does not become population evidence.

## Why this ingest was necessary

The previous prototype specification preserved several valuable safeguards, but translated the product into a sequence of fields: choose a person, add a reason, write, add one material, preview, send. That was the safe and boring version of the idea.

The later recordings describe something richer:

> A person composes a private digital care package for someone they already value. Their own words sit inside a scrapbook-like object with selected memory materials. The friend opens it through a deliberate receiving ritual, experiences it away from chat, and can return to it as something that belongs to them.

The product is therefore not a message form with decoration. It is a **small authored object and the experience of giving, receiving, and keeping it**.

The no-reply/no-telemetry contract still matters. It is a structural boundary around the experience, not the whole visible product.

## Evidence hierarchy used here

1. **Latest direct prototype instructions, 5 September 2026**
   - restart after a complete WIKI ingest;
   - make the real product in code rather than treating Figma as the final artifact;
   - create a conceptual, page-by-page specification before restarting implementation;
   - reject the existing form-like prototype as the boring version;
   - use a white phase followed by a deep-navy phase;
   - use Ugly Handwriting and sparse human-drawn linework;
   - borrow the supplied `grug` reference's visual grammar, not its identity.
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

Creation should feel like opening a quiet worktable or notebook, not completing a form.

- The sender begins voluntarily with one person in mind.
- Recipient and reason are lightweight anchors inside the workspace, not separate administrative screens.
- Writing is central and remains human-authored.
- Memory materials can be placed around the writing and arranged into one composition.
- Optional reflective cues such as “favourite memory,” “what you taught me,” or “one word” help when requested; they do not become mandatory questions.
- Creative effort should be visible through selection, arrangement, drawing, recording, and personal marks—not artificial waiting or needless friction.
- The sender previews the finished experience as a whole, then gives it a boundary by finishing or sealing it.

The strongest evidence for this richer authoring model appears in the late discussion of a scrapbook-like, multimedia artifact ([57f27… lines 28–76](TRANSCRIPTS/2026-09-04-57f27d6d-511d-569c-ba4c-5b84cf5be137.md)) and in the explicit argument that layout and creative decisions are themselves a form of communication ([532244… line 20](TRANSCRIPTS/2026-09-04-5322449d-86be-5681-abb6-09cbdf584c15.md)).

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
- Exact vessel: folded object, envelope, seal, bottle, another package, or no literal container.
- Whether a firefly is a useful arrival signal or merely decoration.
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

## Honest boundary

This ingest can reconstruct intent. It cannot prove desirability, causality, safety, or whether a digital artifact changes the unwritten rule. Those claims still need real sender and receiver evidence. The next document is therefore a conceptual prototype proposal for Ethan and the team to approve, edit, or reject—not a validated product specification.
