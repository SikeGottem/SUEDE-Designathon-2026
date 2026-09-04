<!-- This contract defines the evidence boundary, interaction thesis, and visual preflight for the first disposable friendship-appreciation prototype. -->
# First HTML concept contract

> **Authority note:** [the canonical product specification](../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md) now governs the implementation. This earlier contract remains a concise rationale and visual-preflight record; where the two differ, the canonical specification wins.

## Status and purpose

- **Mode:** exploration through a rough stimulus.
- **Artifact:** a clickable mobile web prototype, not a selected product or final visual system.
- **Question it tests:** can a finite, receiver-owned digital object make ordinary-day appreciation feel different from chat without creating a reply task?
- **Audience hypothesis:** a sender who already has one specific appreciative thought about a close or still-close friend, especially after distance or a life transition. This is a recruitment hypothesis, not a market claim.
- **Outcome:** the sender can make and transfer something deliberate; the receiver can privately open, keep, close, or discard it without a conversational obligation.

## Source boundary

### Confirmed inputs

- The working brief is to design an experience that reveals, communicates, questions, or redesigns an unwritten rule.
- The team selected friendship appreciation as the next problem direction, not a final audience, medium, mechanism, or product.
- Published research makes sender miscalibration plausible: gratitude writers can underestimate recipients' positive reactions and overestimate awkwardness.
- The team requires human-led AI use. People author intimate content, select the direction, test it, make material edits, and approve the result.

### Team hypotheses represented in the prototype

- Ordinary chat can make a finite act of care look like the start of a conversation.
- Visible composition effort may signal attention and sincerity.
- A distinct opening moment and a private, receiver-owned archive may make digital care feel keepable.
- Removing read receipts, replies, streaks, prompts, and public reactions may reduce social accounting.
- A shareable link may be a lower-friction first medium than requiring both friends to install an app.

### Unknowns that remain visible

- Whether receivers actually feel reply debt, or senders only predict it.
- Whether “no reply needed” feels freeing, cold, passive-aggressive, or alarming.
- Whether a digital object adds meaning beyond the same words in chat, voice, post, or an act of care.
- Whether effort increases warmth, burden, or both.
- Whether people want to revisit the object after the reveal.
- Whether the problem recurs often enough for a dedicated product.

## Exploration packet

### One-line proposition

For a person who has a specific ordinary-day thought about a close friend, a finite self-authored object may let the friend receive and keep that care without turning it into a live conversation.

### Unwritten rule

> If I say directly how much a friend matters without an accepted occasion, I risk making the relationship feel unusually intense; if they receive that effort, they may feel they have to match it.

### Core loop

1. **Entry:** a real memory, act, quality, photo, or song brings one friend to mind. The product does not remind or assign the person.
2. **Action:** the sender chooses the friend, names the specific reason, writes in their own words, and adds no more than one supporting medium in the first concept.
3. **System response:** the object becomes a finite preview, not a chat message. The sender chooses an opening context and shares a link.
4. **Receiver choice:** the receiver sees a calm, non-urgent arrival cue and chooses whether and when to open it.
5. **Payoff:** interface chrome recedes; the object unfolds; the receiver reads or listens at their own pace.
6. **Completion:** the receiver keeps, closes, or discards it. No reply composer, read receipt, public reaction, streak, or matching task appears.
7. **Recovery:** an unavailable medium has a text equivalent; motion can be skipped; accidental exit preserves the local demo state; discard requires a reversible confirmation in the prototype.

### Critical states

- quiet shelf / empty state;
- choose one person and one specific reason;
- blank composition state;
- writing state and one selected media layer;
- delivery/opening choice;
- finite preview and transfer confirmation;
- neutral receiver arrival;
- closed object;
- opening transition with reduced-motion equivalent;
- reading/listening state;
- keep, close, and discard choices;
- saved shelf and reopened object;
- missing audio/image alternative;
- safe decline or deletion.

## Mechanism divergence kept alive

| Direction | Mechanism | What it tests | Main objection |
| --- | --- | --- | --- |
| Ordinary-chat control | The same words in an existing message thread, with or without “no reply needed.” | Whether a new medium is needed at all. | It may already solve the problem with zero switching cost. |
| Embedded object | A finite link is sent through the channel friends already use; no receiver account is required. | Whether changing the receiving contract adds value while staying in context. | A link can feel suspicious or like a dressed-up e-card. |
| Beyond-screen ritual | A postcard, letter, shared meal, practical act, or hand-delivered token. | Whether material effort and presence outperform digital convenience. | Address, time, access, and distance create real friction. |
| Receiver-control inversion | The receiver chooses opening, keeping, and silence; the sender gets no read state or reaction metric. | Whether transferring control makes care feel less transactional. | Lack of acknowledgement may make senders anxious and receivers more alarmed. |
| Spoken control | A short voice note or face-to-face sentence with no dedicated artifact. | Whether voice warmth is sufficient. | Voice can feel more immediate, exposing, and response-seeking. |

The first HTML executes only the **embedded finite object with receiver-control inversion**. It does not declare that direction the winner.

## Structural visual divergence

### A. Postal object — selected for this disposable build

```text
quiet shelf -> make one object -> transfer link
                                  |
                        sealed arrival -> unfold -> keep
```

- First notice: one finite object and one action.
- Easier to understand: the difference between a gift and a chat turn.
- Risk: faux-physical nostalgia.
- Source anchor: envelope, rising letter, private opening, ownership.

### B. Personal edition

```text
blank spread -> arrange 3–5 pages -> publish a tiny edition
                                         |
                                  page-through experience
```

- First notice: creative authorship and multimedia composition.
- Easier to understand: why visible effort may matter.
- Risk: editor complexity turns the idea into Canva for friendship.
- Source anchor: scrapbook, music, voice, photographs, motion.

### C. Quiet cabinet

```text
receiver shelf -> open one kept object -> revisit one medium
        |
   make something for another person
```

- First notice: receiver ownership and revisitation.
- Easier to understand: the object persists beyond delivery.
- Risk: an archive is treated as the product before the first send is earned.
- Source anchor: camera roll, drawer, cabinet, saved voice.

## Compact visual contract

- **Communication job:** make “complete when received” visible without needing narration.
- **Source anchors:** the references' sparse black linework, `uglyhandwriting` type, large paper fields, small concrete drawings, and muted book-cover colour blocking; the transcript's envelope/letter reveal; voice/photo/song as memory material; the receiver's shelf or cabinet.
- **Reference delta:** borrow the loose ink grammar, quiet density, and book-cover colour logic. Do not copy `grug`, its mascot, exact copy, screen layout, sunrise drawing, or brand proportions.
- **Rejected default 1:** no gradient, glow, glass, or evenly distributed rainbow palette; each object or state gets one dominant book-cover field and at most one support colour.
- **Rejected default 2:** no equal card grid, bento dashboard, or rounded container around every thought; a finite object needs hierarchy and open space.
- **Rejected default 3:** no chat bubbles, inbox, typing indicator, read receipt, reply field, reaction pack, streak, or engagement count; those reintroduce the social contract being questioned.
- **Rejected default 4:** no AI-generated sentimental copy, fake user quote, or prefilled emotional template; provenance is part of the concept.
- **Signature move:** during opening, app chrome recedes and the made object becomes the whole screen. The receiver then chooses its ending.
- **Restraint:** one illustrative mark per state at most; most screens rely on type, space, and the object itself.
- **Human decision:** Ethan chose HTML before Figma and supplied the sparse hand-drawn reference; Cecelia owns the eventual drawn language. The coded icons are replaceable stand-ins.

### Working visual tokens

- Warm paper: `#f2ead5`
- Ink: `#151515`
- Soft graphite: `#77756f`
- Quiet line: `#d8cfba`
- Sage: `#9aa99b`
- Rust: `#9e5a24`
- Olive: `#73744e`
- Deep blue: `#183b49`
- Oxblood: `#651d25`
- Amber: `#cf842b`
- Colour rule: one dominant field plus one support colour per object or state; ink and paper remain constant.
- Type: the supplied `uglyhandwriting.ttf` (`uglyhandwriting`, Medium) is the primary visible UI face. It is a real local font created with MyScriptFont, not an AI approximation. A system sans is reserved for hidden/debug utility text.
- Variance: high enough to feel placed by hand, but no random rotation on functional labels.
- Motion: one purposeful open/unfold sequence plus direct feedback for user actions; respect reduced motion.
- Density: low. One decision per screen.

## Judge and challenge preflight

### Judging lenses

| Lens | Effect | Evidence and risk |
| --- | --- | --- |
| Brief fit | strengthens | It redesigns a receiving rule rather than only displaying it. The official 2026 wording remains unverified. |
| Problem identification | mixed | It exposes sender prediction and receiver obligation as separate tensions, but local recurrence is untested. |
| Solution approach | unknown | The loop is complete enough to test; no evidence yet shows it beats chat, voice, post, or practical care. |
| Design innovation | mixed | Receiver-controlled completion is sharper than a digital letter, but competing products already claim pressure-free connection. |
| Visual communication | strengthens | A finite-object structure can show the proposed social contract without a feature grid. It still needs rendered review. |
| Presentation skills | strengthens | “Make something they can keep; nothing is owed back” is demonstrable and retellable if the demo stays honest. |
| Evidence quality | weakest | Published findings support component hypotheses, not this audience, medium, or combined product proposition. |

### Required challenge lenses

| Lens | Strongest challenge | Condition in this prototype |
| --- | --- | --- |
| Assumption and inversion | Silence can be healthy and appreciation can already live in action. | Start only from a sender's existing specific thought; never diagnose silence. |
| Behaviour and context | “Friendship” and “ordinary day” remain broad. | Use one transition-separated close-friend scenario and label it hypothetical. |
| Medium necessity | A normal message may be better. | Preserve the chat, voice, physical, and practical-act controls in the test plan. |
| Alternatives | Physical and spoken rituals may carry more human presence. | Do not claim digital equivalence; prototype the digital-specific combination of distance, media, ownership, and revisitation. |
| Human specificity | The recipient may not welcome contact or sentiment. | Show receiver choice, private opening, discard, and no public trace. |
| Inclusion and accessibility | Handwriting, sound, motion, and free placement can exclude people. | Keep text legible; label icons; provide audio text, keyboard focus, ≥44px targets, and reduced motion. |
| Trust, safety and privacy | A heartfelt link can bypass a boundary or resemble phishing. | No discovery/contact graph; known sender cue; no tracking; safe delete; accountless receiver concept. |
| Failure and recovery | “No reply needed” can sound like farewell or rejection. | Use neutral arrival copy and test multiple completion phrases; do not bury this unknown. |
| Feasibility and demo truth | A polished click-through can imply a platform that does not exist. | All content is local mock state; transfer, storage, media upload, and identity are simulated and named as such. |
| Incentives and second-order effects | Repetition can create prompts, effort escalation, and new maintenance labour. | No reminders, streaks, rankings, templates, or frequency goal. |
| Simplicity and retellability | Multimedia editing can swallow the core idea. | Written core plus one supporting medium in the critical path. |
| Authorship and distinctiveness | AI polish could impersonate intimacy. | User wording remains typed by the tester; Cecelia redraws material icons; first render requires human rejection/redirection. |

## Preflight verdict

**Verdict: Proceed with conditions.**

Work permitted now: a reversible HTML stimulus showing one sender-to-receiver loop and one archive epilogue.

Blocking conditions:

1. Keep “exploratory prototype” visible and never claim validation, demand, impact, or product selection.
2. Use no reminders, streaks, public feed, engagement measures, read receipts, forced reply, or AI-authored intimate text.
3. Make receiver boundary controls and accessible equivalents part of the core path, not appendix copy.
4. Use one visual direction only; keep Cecelia's final drawings separate from coded stand-ins.
5. Post-build review must inspect the actual artifact, apply the logo-swap/team-voice/subtraction tests, and record a material human-directed change.
6. The artifact cannot become the source of truth until the team compares it with the ordinary-chat, voice, physical, and receiver-first controls.

- **Weakest judging angle:** evidence quality.
- **Main trade-off:** speed and concrete learning versus a real risk of anchoring the team on an attractive digital answer.
- **Next evidence:** matched sender predictions and receiver reports for the same appreciation across ordinary chat, this finite object, a structurally closed variant, and one physical control.
- **Stop or pivot if:** normal chat wins, recipients do not share the predicted tension, the explicit ending increases alarm, or the making effort feels like another obligation.
