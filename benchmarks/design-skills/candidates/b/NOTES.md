<!-- Candidate B records its intentional art direction, scope boundaries, and suggested independent checks. -->
# Candidate B notes

## Two-pass design decision

- **Token system:** night green `#102724`, paper `#edf0e8`, moss `#b8ca5b`, moss-deep `#355b35`, signal coral `#f28a6d`, muted support `#cdd8d0`.
- **Type:** a restrained system serif gives the journey language an intimate, editorial quality; the system sans keeps controls direct and familiar offline.
- **Layout:** a calm left-hand promise and a single tall transit-ticket interface on the right. The vertical route line is the Relay-specific signature: a sequence of promised moments rather than a map.
- **Principle:** use one bold interruption (the coral signal-loss marker) and leave the rest quiet, so failure is clear without becoming alarmist.

## Brief review before build

The first pass deliberately avoided a generic safety dashboard, map, gradient, rounded-card stack and generic blue/purple palette. The route line is meaningful because the product operates through a journey sequence; it is not decorative numbering. The product makes the no-surveillance proposition explicit in the ready and active states.

## Shortcuts and verification suggestions

- This is a contained demo: buttons provide visible, announced state changes, but no network, SMS or location service exists.
- Browser-check the full sequence at 1440 × 1000 and 390 × 844; use Tab and Enter through all actions; emulate `prefers-reduced-motion: reduce`.
- One known implementation shortcut: focus is retained on the triggering button after state changes rather than moved to a panel heading, preventing a sudden screen-reader context jump while retaining live announcements.
