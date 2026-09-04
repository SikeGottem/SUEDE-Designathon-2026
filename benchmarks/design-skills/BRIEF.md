<!-- This fixed brief gives every benchmark candidate identical product, content, interaction and delivery constraints. -->
# Relay benchmark brief

Build a polished responsive single-page product proof for **Relay**, a fictional late-night transit safety tool.

## Product promise

Relay lets a rider share meaningful journey checkpoints with one trusted person without forcing either person to watch a live map.

The interface should make someone feel: **calm, accompanied and in control — never watched**.

## Scenario and fixed copy

- Rider: Maya
- Trusted contact: Jo
- Time: 11:42 PM
- Journey: Route 430, then an 8-minute walk
- Destination: Home
- Expected arrival: 12:08 AM
- Next checkpoint: Riverside at 11:56 PM
- Primary headline: `Stay connected without staying on your phone.`
- Supporting line: `Relay shares the moments that matter, then gets out of the way.`
- Primary action: `Start relay with Jo`
- Active-state label: `On the 430`
- Connection label: `Connection strong`
- Check-in action: `I'm okay`
- Failure title: `Signal paused. You still have a plan.`
- Failure explanation: `Relay saved your last checkpoint and will retry automatically.`
- Recovery action: `Use SMS fallback`
- Recovery confirmation: `SMS queued to Jo`
- Arrival action: `I've arrived`
- Completion title: `Made it.`
- Completion line: `Jo knows you're home. Relay is off.`
- Reset action: `Replay journey`

Do not add testimonials, usage statistics, emergency-service claims or invented research.

## Required states and controls

The page must begin in a ready state and support this complete demo path without reload:

1. `Start relay with Jo` enters the active journey state.
2. `I'm okay` visibly confirms a manual check-in.
3. A clearly labelled demo control simulates signal loss.
4. Signal loss explains what is known, what Relay will do and what Maya can do next.
5. `Use SMS fallback` visibly confirms the fallback was queued.
6. A clearly labelled demo control restores the connection.
7. `I've arrived` enters the completion state and makes it clear tracking is off.
8. `Replay journey` returns to the ready state.

The simulation controls must be honest about being demo-only. Do not imply that a real network, SMS or emergency service is connected.

## Experience requirements

- Make the critical state understandable without narration.
- Treat signal loss and recovery as first-class product moments, not generic error banners.
- Show the difference between safety and surveillance through language, hierarchy and interaction.
- Give the interface one recognisable visual signature that belongs to Relay.
- Use motion only to explain attention, state change, causality or continuity.
- Respect `prefers-reduced-motion`.
- Use semantic HTML, visible keyboard focus and sensible live-region announcements.
- Meet readable contrast and touch-target expectations.
- Work at 1440 × 1000 and 390 × 844 without horizontal scrolling or hidden required controls.
- Stay usable offline: one `index.html`, no external fonts, scripts, images or APIs.

## Anti-template constraints

- No generic purple/blue gradient hero.
- No dashboard of interchangeable metric cards.
- No stock illustration, fake map or decorative blob used as a substitute for product meaning.
- No excessive pills, glassmorphism, floating rounded rectangles or `transition: all`.
- No animation that delays input or makes failure states playful.

## Delivery limit

Use one implementation turn. Prioritise a complete, believable critical path and a distinct point of view over feature breadth.
