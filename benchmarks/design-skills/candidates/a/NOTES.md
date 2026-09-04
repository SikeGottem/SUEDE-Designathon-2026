<!-- Candidate A records its constrained design direction and handoff notes for blind benchmark review. -->
# Candidate A notes

## Direction

Operate-mode interface. The visual signature is a calm, continuous **checkpoint thread**: a fine vertical route line and live dot turn agreed moments into the visual structure, instead of presenting a map or monitoring dashboard. Dark, low-light transit context and a restrained signal-green make the one important status legible without making the product feel like an alarm.

The hero and working interface are one surface. The first viewport demonstrates Relay's core distinction: a trusted contact receives named, consented checkpoints rather than a live location feed.

## Constraint handling

- All actions are real local state changes; no network, SMS or tracking connection is implied. Both simulation controls and the queued-SMS confirmation say they are demo-only.
- Native buttons, semantic headings, an ordered checkpoint list, visible focus treatment and polite live regions support keyboard and screen-reader use.
- The single signal-dot animation explains an active connection and is removed under reduced-motion preferences.
- The layout becomes a single column below 860px; no required control is conditionally removed on mobile.

## Known shortcuts / verification suggestions

- Visual hierarchy and contrast should be checked from captures at 1440 × 1000 and 390 × 844.
- Exercise: Start → I’m okay → Demo simulate signal loss → Use SMS fallback → Demo restore connection → I’ve arrived → Replay journey. Tab through the same path and test with reduced motion enabled.
- The benchmark contract prohibited a real map, external fonts, remote assets and browser capture during this implementation turn.
