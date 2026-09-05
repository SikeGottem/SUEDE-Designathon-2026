<!-- Orientation: source-preserving asset manifest for Cecelia's Warm & Fuzzies illustration collection. -->

# Cecelia collection

These files are byte-for-byte copies of the unique PNGs supplied in `All grahpic assets.zip`; no source pixels have been cropped, recoloured, or otherwise changed. They are organised by semantic role so the app can use a real authored drawing instead of a code stand-in.

`Active` means the current runtime renders the file. All unique supplied assets are ingested here, but only assets with a state-bearing product role render; parked sheets are preserved for future authored decisions, not a sticker wall or wallpaper layer.

| Original archive filename | Canonical repository path | Recommended product role | Status |
| --- | --- | --- | --- |
| `B1.png` | `couriers/firefly-outline.png` | Quiet idle/landing firefly state | Active — landing and carrier state |
| `F1.png` | `couriers/firefly-filled-a.png` | Firefly wing-frame A for flight motion | Active — one-shot flight motion |
| `F2.png` | `couriers/firefly-filled-b.png` | Firefly wing-frame B for flight motion | Active — one-shot flight motion |
| `firefly mesh.png` | `couriers/firefly-mesh.png` | Delivery-transition texture or distant fireflies | Parked |
| `ggggg.png` | `couriers/firefly-carrying.png` | Carrying firefly for the hub and courier scenes | Active — enlarged hub focal object; sender/receiver courier handoff, departure, and arrival |
| `bottle.png` | `containers/bottle-classic.png` | Bottle carrier selection and cabinet thumbnail | Active — sealed bottle carrier state |
| `bottle.2.png` | `containers/bottle-alt.png` | Alternate bottle carrier/material state | Parked |
| `Broken Bottle.png` | `containers/bottle-broken.png` | Non-default bottle variation; reserve for a deliberate story state | Parked |
| `mail.png` | `containers/envelope-outline.png` | Envelope exterior and unopened-letter object | Active — envelope finish, preview, and delivery payload |
| `Mail.02.png` | `containers/envelope-shaded.png` | Richer envelope exterior where more contrast is needed | Parked |
| `plane.png` | `containers/paper-plane.png` | Paper-plane carrier choice and departure | Active — carrier, departure, and arrival |
| `scroll.png` | `containers/scroll.png` | Parked concept carrier; do not introduce without a clear product role | Parked |
| `Cloud.png` | `environment/clouds-outline.png` | One-shot plane departure backdrop | Parked |
| `cloud.2.png` | `environment/clouds-alt.png` | Alternate cloud composition for a plane state | Active — restrained one-shot plane departure and arrival drift |
| `Icon.png` | `environment/icon-doodle-sheet.png` | Reference sheet for future hand-drawn UI details, not a generic sticker tray | Parked |
| `Leaf.png` | `environment/leaf-doodle-sheet.png` | Reference sheet for a deliberate environmental composition | Parked |
| `line art wavey.png` | `environment/line-art-wave-sheet.png` | Reference sheet for water/air transition details | Parked |
| `moon.png` | `environment/moon.png` | Time-of-day delivery mood, only when authored by sender | Parked |
| `reeds.png` | `environment/reeds.png` | Lower-corner Home framing and firefly-scene environmental cue | Active — Home lower corners; restrained firefly departure and arrival sway; never hub wallpaper |
| `Shapes.png` | `environment/organic-shape-sheet.png` | Reference sheet for composition accents, not permanent decoration | Parked |
| `Squiggle (2).png` | `environment/squiggle-sheet.png` | Reference sheet for custom motion/transition accents | Parked |
| `squiggle.png` | `environment/squiggle-divider.png` | Single divider or transition accent | Parked |
| `Sun.png` | `environment/sun.png` | One-shot carrier-scene sun | Active — restrained slight rotation during sender/receiver carrier motion, then static |
| `W1.png` | `environment/water-mark-a.png` | Water/arrival mark for bottle motion | Parked |
| `W2.png` | `environment/water-mark-b.png` | Alternate water/arrival mark for bottle motion | Parked |
| `w12.png` | `environment/wave-divider-a.png` | Wide water-divider/transition layer | Active — bottle wash/departure |
| `w13.png` | `environment/wave-divider-b.png` | Alternate wide water-divider/transition layer | Active — bottle wash/departure |
| `wave1.png` | `environment/wave-sheet-a.png` | Water-motion source sheet for a bottle transition | Parked |
| `wave2.png` | `environment/wave-sheet-b.png` | Alternate water-motion source sheet | Parked |
| `Stamp assets Circle.png` | `seals/stamp-filled-circles.png` | Circular wax/seal palette source in envelope finishing | Parked |
| `stamp assets oval.png` | `seals/stamp-filled-ovals.png` | Oval wax/seal palette source in envelope finishing | Parked |
| `stamp assets square.png` | `seals/stamp-filled-rectangles.png` | Rectangle wax/seal palette source in envelope finishing | Parked |
| `stamp cb.png` | `seals/stamp-neutral-circle.png` | Neutral circular wax/seal base | Active — personal stamp editor and envelope preview |
| `wax assets lineart circle.png` | `seals/wax-outline-circles.png` | Circular hand-drawn seal outline options | Parked |
| `wax assets lineart oval.png` | `seals/wax-outline-ovals.png` | Oval hand-drawn seal outline options | Parked |
| `wax assets lineart rectangle.png` | `seals/wax-outline-rectangles.png` | Rectangle hand-drawn seal outline options | Parked |
| `Warm+fuzzy-firefly logo.png` | Alias of `containers/bottle-broken.png` | Archive duplicate; intentionally not copied a second time | Duplicate / not copied |

## Duplicate finding

`Warm+fuzzy-firefly logo.png` is byte-identical to `Broken Bottle.png` (SHA-256 `af232e94a29067a2d796883a13b4afd1afe694a20c9a915d94d884421356846f`). Despite its filename, it is not a distinct logo asset, so `containers/bottle-broken.png` is the sole canonical copy.
