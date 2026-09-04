<!-- This provisional design system records the gstack consultation result for the fictional Relay benchmark only. -->
# Relay — Last-Lamp Line

## Status and boundary

This is a design-language experiment for the skill benchmark. It is not a selected SUEDE 2026 concept, brand or final product direction. The team must replace or separately approve it after the official brief arrives.

## Product context

- Product: a compact late-night transit checkpoint relay
- User: a tired rider who wants one trusted person informed without continuous location surveillance
- Critical moment: the connection degrades between transit and the final walk home
- Memorable thing: one warm line always shows what is confirmed, what is uncertain and what happens next
- Desired first reaction: “I’m accompanied, and the system is telling me the truth.”

## Visual thesis

Relay feels like a late-night platform timetable made humane: spare transit typography, warm sodium light and one continuous signal line turn uncertainty into a calm, legible sequence.

## Design principles

1. **Truth before reassurance.** Every state names what is confirmed, what is stale and what will happen next.
2. **One line carries meaning.** The relay filament encodes transfer, confidence and completion; it is never decorative wallpaper.
3. **Infrastructure, not fear theatre.** Borrow from timetables, ticket stock and platform markings—not shields, radar maps or emergency-service chrome.
4. **One dominant sentence per state.** The active product truth outranks navigation, labels and metadata.
5. **Open composition over card inventory.** Content attaches to checkpoints and rules; containers exist only when grouping changes behaviour.

## Typography

- Display: **D-DIN Condensed Bold** for state headlines, place names and decisive actions
- Body: **D-DIN Regular** for explanations and controls
- Data: **Atkinson Hyperlegible Mono** for time, checkpoint and confidence evidence
- Fallback: a narrow sans-serif for display and a highly legible sans-serif/monospace for supporting content

Use sentence case. Use tabular numerals for all times. Avoid tracked all-caps eyebrows, clever safety copy and decorative monospace paragraphs.

## Colour

| Role | Value | Use |
| --- | --- | --- |
| Night carriage | `#17151D` | Primary dark field |
| Ticket stock | `#F1EEE5` | Primary text and light field |
| Sodium lamp | `#FFB15A` | Live line, primary action, current checkpoint |
| Window blue | `#9BC7D8` | Trusted-contact receipt and information |
| Confirmed moss | `#A9CF86` | Delivered checkpoint and arrival |
| Caution ochre | `#D9A93E` | Degrading connection, always with text/pattern |
| Signal break | `#F26A63` | Lost signal or failed transfer only |

Use flat colour fields; no gradients. Sodium lamp is the singular active accent. Signal break never becomes brand decoration.

## Layout and spacing

- Mobile: four-column grid; the relay filament sits 28–32 px from the left edge and content attaches to its checkpoints.
- Wide screens: twelve-column composition; journey evidence occupies the centre, with trusted-contact receipt as a restrained right-side proof—not a dashboard.
- Show only **last confirmed / now / next**. Collapse earlier history and avoid speculative future detail.
- Use 8 px as the base rhythm, with 16/24/40/64 px steps.
- Buttons use an 8 px radius; grouped outer surfaces use concentric radii only when nested padding makes the relationship visible.
- Keep required controls at least 44 × 44 px and preserve a one-handed mobile action zone.

## Signature motif: relay filament

A 3 px warm line connects the journey states:

- solid line + round checkpoint = confirmed
- evenly dashed continuation = uncertain or retrying
- stopped line + explicit timestamp = last known point
- short coral break = action required
- closed loop/end cap = arrival and relay off

Colour is never the only signal. Line pattern, state copy, timestamp and iconography must agree.

## Motion

- Checkpoint transfer: a short baton travels one segment in 260–320 ms, then the receipt appears.
- Signal loss: the solid continuation resolves to dashes in 180 ms; no spinner, shake, pulse or alarm loop.
- Reconnect: dashes draw into one solid line over about 420 ms with a restrained ease-out.
- Arrival: the line closes once over 500–600 ms; this is the sole ceremonial moment.
- Buttons may scale to `0.96` on press; interactive transitions name only the changing properties.
- Reduced motion switches states immediately while preserving line pattern, text and focus order.

## Content and component rules

- Status language includes evidence: `Connection strong · relayed 12 sec ago`, not a vague green badge.
- Trusted contacts appear as names and receipt times, not mascots or surveillance avatars.
- The failure state always shows last confirmed checkpoint, timestamp, automatic behaviour and a recovery action.
- `Use SMS fallback` must be labelled as a simulation in prototypes until a real service exists.
- A primary state has at most one primary action and one quieter secondary action.

## Accessibility and trust

- Verify contrast at low brightness and at 200% zoom.
- Provide visible keyboard focus and live-region updates for meaningful connection changes only.
- Never imply that the rider is currently at a stale checkpoint.
- Distinguish `sharing paused by Maya` from `network signal unavailable`.
- Haptics and motion are supplemental; text and structure carry the state.

## Explicit rejections

- no live map as the default surface
- no shield, radar, police-blue or giant permanent SOS motif
- no pastel wellness mascot or “everything is safe” fiction
- no glass cards, floating metric tiles, purple gradient or decorative blobs
- no ambient parallax, auto-advancing carousels or playful failure animation

## Source synthesis

Two independent design voices agreed on night-transit ephemera, a certainty-encoding line, truthful failure states and avoiding maps/fear theatre. One proposed a black/acid-green printed-poster direction; the selected synthesis uses warm sodium amber and hyperlegible transit typography because it better supports calm, human specificity and accessible status semantics while remaining memorable.
