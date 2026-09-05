<!-- This report records matched visual, motion, and interaction QA for the latest transcript-led Warm & Fuzzies prototype pass. -->
# Design QA — latest transcript pass

## Target and capture conditions

- Visual source of truth: `output/design-qa/entry-dashboard-2026-09-05/source-entry.png`, a normalized 394 × 852 crop of Ethan's supplied Home frame.
- Behaviour sources: `WIKI/TRANSCRIPTS/2026-09-05-aa8e2e8e-d941-5e71-99b8-4d261be1011b.md` for the separate Create/Look menu and `WIKI/TRANSCRIPTS/2026-09-05-be0d1955-63fe-50d6-8841-e056c927469a.md` for dotted/grid paper, reusable or new stamps, sender order, and carrier-specific departure.
- Asset sources: Cecelia's `firefly-brand-mark.png`, `firefly-filled-f1.png`, `firefly-filled-f2.png`, `firefly-carrying-envelope.png`, `envelope-mail-02.png`, `bottle-intact.png`, and `carrier-plane.png` in `prototype/public/assets/illustrations/cecilia/`.
- Browser viewport: 1400 × 1200 at device scale factor 1.
- iPhone app surface: `[data-testid="device-screen"]`, 393 CSS pixels by 852 CSS pixels; PNG output rounds to 394 × 852.
- Pixel 10 app surface: 427 × 952 CSS pixels at device scale factor 1.
- Runtime-owned status bar, bezel, camera cutout, home indicator, and Android navigation were excluded from app-content mismatch severity.

## Full-view comparison evidence

| State | Source | Implementation | Combined evidence |
| --- | --- | --- | --- |
| Landing | `output/design-qa/entry-dashboard-2026-09-05/source-entry.png` | `output/design-qa/latest-transcript-2026-09-05/landing-final.png` | `output/design-qa/latest-transcript-2026-09-05/comparison-landing.png` |

The 788 × 852 combined image places equal-density 394 × 852 source and implementation captures side by side. The app-owned wordmark, firefly, invitation, bottom action, white field, Gaegu typography, and deep-ink hierarchy match. The visible status bar and home indicator on the implementation are protected runtime chrome rather than design drift.

## Supporting changed-state evidence

| State | Implementation evidence | What it verifies |
| --- | --- | --- |
| Hub in motion | `output/design-qa/latest-transcript-2026-09-05/menu-motion-final.png` | The firefly enters from outside the composition as a one-shot spatial transition; it has no visible route line. |
| Hub settled | `output/design-qa/latest-transcript-2026-09-05/menu-final.png` | Exactly two paths remain: `create something` and `look in your box`; no dashboard cards, feed, helper copy, or persistent navigation compete. |
| Cabinet | `output/design-qa/latest-transcript-2026-09-05/cabinet-final.png` | The collection remains a separate sparse object field with `home`, central `+`, and `your letters` return controls. |
| Dotted paper | `output/design-qa/latest-transcript-2026-09-05/studio-dotted-final.png` | Dotted paper is the full-screen starting canvas and reads as a ground, not an inset editor card. |
| Grid paper | `output/design-qa/latest-transcript-2026-09-05/studio-grid-final.png` | Grid is a selectable alternative and remains within the same direct-manipulation canvas. |
| Reused stamp | `output/design-qa/latest-transcript-2026-09-05/stamp-reuse-final.png` | A locally saved personal stamp can be applied to the single clean envelope without blocking progression. |
| Bold stamp editor | `output/design-qa/latest-transcript-2026-09-05/stamp-bold-latest.png` | Bold is the visible default, the soft/bold choice remains inside the focused editor, and the thicker stroke stays rounded rather than becoming a fake marker outline. |
| Soft stamp round trip | `output/design-qa/latest-transcript-2026-09-05/stamp-soft-preview-persisted.png` | The selected soft weight survives application and renders on the exterior preview instead of reverting to the default. |
| Bottle departure | `output/design-qa/latest-transcript-2026-09-05/sent-bottle-isolated.png` | The selected bottle is visible and slowly floats away. |
| Bottle with moving tide | `output/design-qa/latest-transcript-2026-09-05/sent-bottle-water-mid.png` | The tide visibly reaches and carries the bottle, so the selected travel method causes the departure rather than decorating it afterward. |
| Firefly departure | `output/design-qa/latest-transcript-2026-09-05/sent-firefly-final.png` | The firefly visibly collects and carries the envelope away. |
| Firefly handoff detail | `output/design-qa/latest-transcript-2026-09-05/sent-firefly-flutter-mid.png` | A bounded wing beat and small anticipation/backflutter make the pickup readable without adding a trajectory line or ambient loop. |
| Plane departure | `output/design-qa/latest-transcript-2026-09-05/sent-plane-final.png` | The selected plane remains readable while flying away rather than disappearing immediately. |
| Reduced-motion hub | `output/design-qa/latest-transcript-2026-09-05/menu-reduced-motion.png` | The same two choices and central firefly remain without positional motion. |
| Pixel 10 hub | `output/design-qa/latest-transcript-2026-09-05/menu-pixel.png` | The sparse composition and both controls remain inside the 427 × 952 Android app viewport. |

No focused crop was needed. The source and implementation are already at delivery size, the type and source illustrations are legible in the full view, and motion was inspected through time-separated full-screen captures plus computed bounding-box and opacity checks.

## Findings and iteration history

1. The prior returning-user Home treatment changed the supplied landing into navigation. It was replaced by the exact sparse landing, and its one action now enters a separate hub. The post-fix evidence is `comparison-landing.png` plus `menu-final.png`.
2. The first transcript pass did not expose dotted/grid paper or reusable stamp behaviour. The maker now defaults to dotted paper, offers plain/dotted/grid, stores an applied personal stamp locally, and presents `use my stamp` or `draw a new one`. Post-fix evidence is `studio-dotted-final.png`, `studio-grid-final.png`, and `stamp-reuse-final.png`.
3. The first carrier-specific pass used a front-loaded exit curve. At roughly one second the plane had already left the phone and the bottle was near the edge, which was a P2 motion-legibility mismatch. Both now begin fully visible and use a deliberate transform/opacity path; the plane uses a 4.8-second strong ease-in-out and the bottle retains a 5.4-second float. Post-fix evidence is `sent-plane-final.png` and `sent-bottle-isolated.png`.
4. The first hub entrance completed in 1.4 seconds, too quickly to satisfy the explicit slow-firefly direction. The final motion separates a 0.5-second opacity entrance from a 3.6-second ease-in-out flight and one-shot wing sequence. Actions appear independently, so the motion does not block navigation. Post-fix evidence is `menu-motion-final.png` and `menu-final.png`.
5. The first bottle departure moved the correct object but did not give the tide causal force. A transparent hand-drawn water strip now crosses the stage with the bottle over 5.8 seconds. It is a temporary AI-assisted derivative of the supplied team doodle sheet, not a Cecelia-authored asset, and remains explicitly replaceable before final lock.
6. The firefly pickup was legible but mechanically smooth. The final one-shot adds the requested small anticipation/backflutter and alternates Cecelia's two supplied wing frames for seven bounded beats; it does not become a looping mascot animation.
7. The personal stamp line was still too thin and its appearance was not part of transported state. Bold is now the default, soft remains selectable, and the selected weight persists through preview, the compressed receiver link, the cabinet, and later reuse. Legacy stamps and 18-field links migrate to bold.

No actionable P0, P1, or P2 finding remains. A P3 research question remains: test whether `look in your box` is clearer than `your collection` without changing it from transcript-backed wording before that comparison.

## Required fidelity surfaces

- Fonts and typography: Gaegu remains the only visible product family, with the locally bundled file loading successfully. The landing hierarchy, line-height, wrapping, and handwritten control labels match the supplied frame; no generic display/sans pairing was introduced.
- Spacing and layout rhythm: Landing and hub use one focal illustration and large intentional gaps. Studio fills the app viewport. Cabinet navigation clears the iOS home indicator and the Pixel menu preserves 42-pixel side clearance.
- Colors and tokens: literal white and deep ink `#081F4D` govern the shell. Dots and grid use low-opacity ink, so they read as paper choices rather than a second interface system. The optional stamp uses the existing authored accent token.
- Image quality and asset fidelity: every visible firefly, envelope, bottle, and plane in the changed states uses Cecelia's source PNGs. No emoji, CSS illustration, inline-SVG substitute, decorative blob, or generic image placeholder replaces those targets.
- Copy and content: landing copy remains exactly `warm & fuzzies`, `something good on your mind?`, and `make it for them`. The hub has only the two team-selected verbs. Sender completion stays `that's it from you.` and never reports receiver activity.
- States and accessibility: all actions are semantic buttons; the menu and carrier groups are keyboard reachable; route changes dismiss the simulated keyboard; the stamp is optional; reduced motion removes positional hub flight; and the static carrier state preserves meaning.
- Responsive behaviour: iPhone and Pixel 10 captures show no clipping, collision, hidden primary action, or offscreen persistent control.
- AI-shortcut check: no card grid, gradient, faux paper texture, animated route line, generic mascot loop, or unreviewed decorative UI entered the changed screens.

## Interaction and console QA

- `/` always opens the supplied landing, regardless of saved cabinet or stamp state.
- `make it for them` opens the two-path hub.
- `create something` opens a fresh dotted maker; `look in your box` opens the cabinet.
- Cabinet `home` returns to the hub; its central `+` opens a fresh maker; `your letters` retains the collection context.
- Plain, dotted, and grid paper controls change the full-screen paper class and keep the maker functional.
- A saved stamp survives reload, applies through `use my stamp`, and does not block `choose how it travels`.
- Bottle, firefly, and plane each complete Carrier → Preview → Handoff → Sent and expose the correct carrier-specific live-region copy.
- The bottle Sent state requests the real generated water PNG and moves both tide and bottle; the firefly Sent state uses Cecelia's real W1/W2 raster frames; the plane remains visibly on-screen at the early sample point instead of exiting too quickly.
- A compact v3 link with the new nineteenth stamp-weight field round-trips the selected value, while an older eighteen-field link still opens with a safe bold default.
- `leave` on Sent returns to the hub.
- A real Studio text edit showed the simulated keyboard before Next and verified it was hidden after the Envelope transition.
- Reduced-motion emulation produced a static hub firefly with `transform: matrix(1, 0, 0, 1, 0, 0)` and unchanged actions.
- Browser console: zero errors in the fresh prototype walkthrough. The only warning occurred while explicitly emulating reduced motion and came from Motion's development notice.
- The settled `ca9dfe1e` transcript was checked separately and contains no direct visual, navigation, or feature supersession for this build. Its actionable prototype request is to test this existing flow with the intended segment before adding more.
- Deck browser check: slides 1–6, 8, 10, and 11 rendered at 1600 × 900 with zero console errors after the transcript-led copy and hierarchy cleanup; contact sheet at `output/design-qa/deck-latest-2026-09-05/contact-sheet.png`.

## Verification

- `npm run check:runtime` — passed, 28 protected files.
- `npm run build` — passed.
- `npm run test:sites` — 4 passed.
- `npx playwright test tests/mobile-runtime.spec.ts` — 8 passed.
- `python3 deck/validate_deck_spec.py deck/deck-spec.json` — passed.
- `node --test deck/pitch-prototype/tests/file-open.test.mjs` — 4 passed.

## Final result

passed

# Design QA — page 7 oversized Goldilocks rings

## Target and capture conditions

- Source visual truth: `/var/folders/r9/vz8tpfxn03l3g57fvpf5bbfr0000gn/T/codex-clipboard-7Cm0yE.png`, Ethan's supplied frame-layout screenshot.
- Source pixels: 1580 × 1026. The visible white frame was cropped to 1564 × 984, then normalized to 800 × 450 because the screenshot includes Figma chrome and an incomplete frame crop.
- Implementation: `http://127.0.0.1:4176/deck/pitch-prototype/index.html?slide=7&step=3` at a 1600 × 900 CSS viewport and device scale factor 1.
- Implementation screenshot: `/tmp/suede-slide7-oversized-rings-final-v2.png`, 1600 × 900 pixels.
- Side-by-side comparison: `/tmp/suede-slide7-comparison-v2.png`, 1600 × 450 pixels.
- State: final third build, with both rings, both format constraints, the illustrative audience contexts and the unspoken-appreciation consequence visible.

## Full-view comparison evidence

The source and implementation were placed together in `/tmp/suede-slide7-comparison-v2.png`. Both use two extremely large cropped circular boundaries to create three full-height reading bands. The text, centre audience block and letter-or-gift constraint align around the visual midpoint. The implementation intentionally preserves the deck's Gaegu font, deep-blue palette, navigation and evidence disclosure instead of copying Figma chrome, black strokes or rough placeholder wording.

No focused crop was needed because the slide contains no raster assets or icons, and the typography, ring crop and complete copy are legible in the normalized full-view comparison.

## Findings and comparison history

1. First comparison: the centre audience block began roughly 80 pixels above the side statements, creating a P2 hierarchy mismatch against the reference's aligned three-zone reading path.
2. Fix: moved `.audience-zone.center` from `top:330px` to `top:410px` without altering the two ring crops or side statements.
3. Post-fix evidence: `/tmp/suede-slide7-comparison-v2.png` shows the three content zones aligned around the same vertical centre. No actionable P0, P1 or P2 mismatch remains.

## Required fidelity surfaces

- Fonts and typography: the source's informal handwritten direction is preserved with the deck's bundled Gaegu family; display, supporting and disclosure sizes retain clear hierarchy and do not clip.
- Spacing and layout rhythm: two oversized cropped rings now occupy the whole frame, with the centre band and both side bands matching the reference's proportions. The audience block aligns with the two constraint blocks.
- Colors and visual tokens: the slide uses the user-selected deep-blue accent on white. The reference's black is treated as structural guidance, not a palette override.
- Image quality and asset fidelity: the source contains no photographic or illustrative asset. The circular boundaries are semantic diagram geometry rendered sharply at the native slide size.
- Copy and content: rough source placeholders are replaced by bounded presentation copy. University students, long-distance connections, close friends and close family remain examples rather than a validated demographic claim.
- Interaction and accessibility: the three-click order is text constraint, letter-or-gift constraint, then the audience and consequence. The full diagram has one descriptive accessibility label. Browser console reported zero errors.

## Follow-up polish

- P3: verify ring weight and small disclosure legibility on the actual projector; neither blocks the current rehearsal deck.

## Final result

passed

---

# Design QA — illustrated map, research ledger, simplified audience, and QR demo

## Target and capture conditions

- Implementation: `http://127.0.0.1:4176/deck/pitch-prototype/index.html` at the native 1600 × 900 canvas.
- Captured states: all four page-5 builds, page 6 build 4, page 7 build 3 and page 10.
- Evidence: `/tmp/map-steps-v2.png`, `/tmp/suede-slide6-step4-v2.png`, `/tmp/suede-slide7-simple-v2.png` and `/tmp/suede-slide10-qr-v3.png`.

## Findings and fixes

1. Abstract page-5 dots did not distinguish the channels or connect the target to the product identity. Two small navy doodle SVGs and Cecelia's envelope now sit over the translucent frequency marks; Cecelia's firefly marks the Goldilocks target. All four reveals remain clear of their evidence annotations.
2. Page 6 read like a compressed spreadsheet. The right column is now a loose handwritten ledger with repeated quiet metric labels, large values, channel doodles and only horizontal separators. The fourth click still circles exactly the three qualities carried into the brief.
3. Page 7 had three competing centre messages and verbose side sentences. It now reads as `text — too awkward or too casual`, `They care. But appreciation stays unspoken.`, and `letter / gift — too much; high friction; inaccessible`, with the four audience examples visually subordinate.
4. The first page-10 capture showed a broken QR image because the generated root SVG lacked its namespace. Adding the namespace restored browser rendering. OpenCV decoded the final 1600 × 900 slide capture as exactly `https://warm-and-fuzzies.vercel.app/demo`.

## Required fidelity surfaces

- Branding: deep ink, white, pale blue, Gaegu and Cecelia's firefly/envelope remain the visual system; no stock icon set, gradient, card grid or dashboard styling was introduced.
- Legibility: page 6 keeps the percentages dominant, page 7 leaves the ring geometry dominant, and page 10 gives the QR a 268-pixel square with an intact white quiet zone.
- Evidence boundary: rehearsal values and audience examples retain their visible disclosures. The public QR is an optional generic demo route, not validation.
- Interaction: page 5 still uses four clicks, page 6 still uses three reveals plus a fourth selection pass, page 7 still uses three reveals, and the deck now ends on page 10.

## Final result

passed for rehearsal; the QR still needs a physical-phone scan at presentation distance on the event network.

## Follow-up correction — page 5 marker contrast

- Ethan's delivery-size review found that the translucent frequency marks disappeared behind the channel icons and that the firefly's native steel fill looked disconnected from the navy type.
- The three marks are now explicit size-encoded circles at 86, 78 and 63 pixels behind 50–52 pixel icons; the quick-text point moved clear of the axis.
- Cecelia's original firefly PNG remains the source asset, but its alpha is used as a mask so every visible pixel renders in the exact deck ink `#081F4D`.
- Post-build check: all three circle sizes remain distinct in `/tmp/suede-slide5-markerfix-step4.png` at 1600 × 900, and the firefly now carries the exact same navy as the surrounding title.
- Authenticity verdict: **Pass**. The circle size remains an information encoding rather than decoration, the Cecelia mascot stays the subject-specific signature, and the user-directed contrast correction is the material human change.

---

# Design QA — social-script diagram, compressed psychology map and icon-led findings ledger

## Target and capture conditions

- Implementation: slides 4–7 at `http://127.0.0.1:4176/deck/pitch-prototype/index.html`, rendered at the native 1600 × 900 canvas.
- Final captures: `/tmp/suede-slide4-science-step4.png`, `/tmp/suede-slide4-science-step5.png`, `/tmp/suede-slide5-final-step2.png`, `/tmp/suede-slide5-final-step3.png`, `/tmp/suede-slide5-final-step4.png`, `/tmp/suede-slide6-final-step4.png` and `/tmp/suede-slide7-after-rebalance.png`.
- Browser console: zero errors after the final page-4, page-5 and page-6 builds.

## Findings and fixes

1. Page 4's four equal empty cards made an ordinary Tuesday read like a fourth occasion and presented the occasion rule as fact. Three hand-drawn occasion icons now form one connected social-script cluster; a dashed break isolates an ordinary Tuesday, and the adjacent research is labelled as support for testing rather than proof.
2. Page 5's paper summaries were too small and too long for live delivery. Each active channel now reveals one large mechanism statement with one visible author-year trail; the detailed methods remain in the report and Q&A.
3. Page 5's axes were too faint at presentation size. Both labels now use 25-pixel deep navy text and three-pixel rules.
4. Page 6's repeated metric labels created a dense table. A single shared header, 48-pixel channel icons and larger values turn it into one scan path while preserving the three-stage reveal and fourth-click rings.
5. Page 7's right ring crossed its constraint copy. The rings were reweighted and repositioned, and the centre hierarchy was strengthened without changing the message.

## Evidence and authenticity boundaries

- Kumar and Epley support sender miscalibration around awkwardness, while Givi and Galak support testing whether non-occasion care can be welcome; neither proves a universal occasion rule or crisis interpretation.
- The page-5 studies support only `Tone can be misread`, `Voice can feel closer`, and `Thoughtfulness matters more than price` as bounded psychological mechanisms.
- The studies do not validate the map positions, point sizes, paired-channel equivalence, Goldilocks target, audience groups, rehearsal percentages or ratings.
- Communication job: show credible psychological grounding in roughly 25 seconds without turning the map into a literature review.
- Rejected defaults: paper-summary cards, a separate literature slide, repeated dashboard headers and decorative icons unrelated to the channel forms.
- Content-native signature: each channel's hand-drawn icon appears with its own active mechanism, while Cecelia's firefly marks the product target.
- Material human-directed change: Ethan requested less explanatory copy, clearer axes, larger icons and a more polished findings composition.
- Strongest remaining AI tell: `psychology-informed` can read like a generic credibility badge; the adjacent citations and explicit working-hypothesis footer keep it informational rather than decorative.
- Authenticity verdict: **Pass for rehearsal**.

## Final result

passed; the next evidence step is a timed 25-second first-listener recall test and replacement of every rehearsal value before judged delivery.

---

# Design QA — ordinary-day friction list and What / Why / How survey orientation

## Target and capture conditions

- Implementation: page 4 build 5 and page 6 build 4 at the native 1600 × 900 canvas.
- Final captures: `/tmp/suede-slide4-ordinary-list.png` and `/tmp/suede-slide6-what-why-how.png`.
- Full current-deck contact sheet: `/tmp/suede-full-review-2026-09-05/contact-sheet.png`.
- Browser console: zero errors in the final page-4 and page-6 states.

## Findings and fixes

1. The ordinary-day state carried an icon, two explanatory layers and paper-derived claims that competed with the presenter. It now contains only `ordinary day` and the three requested prompts: `awkward`, `too much`, `intense`.
2. The research slide had lost the team's What / Why / How model. Small orientation labels and the `Survey results` title now restore that model without bringing back the three large questions.
3. Both slides preserve progressive builds and the existing deep-blue, white and hand-drawn visual language.

## Review boundary

- Visual result: **Pass for rehearsal**.
- Judged-delivery result: **Test first**. The page-6 figures remain invented rehearsal data; the title and visual precision make the disclosure footer insufficient for external judging.
- Strongest remaining AI tell: convenient precision across the two percentages, nine ratings and plotted channel positions.
- Next corrective action: replace the rehearsal data with documented participant evidence or remove the quantitative treatment before judging.

---

# Design QA — 2025 winner-deck benchmark

## Capture conditions

- Supplied source: Canva design `DAG0ItHkuQo`, 32 pages.
- Browser capture: all pages at 1280 × 720 under `/tmp/suede-winner-2025/`.
- Contact sheet: `/tmp/suede-winner-2025/contact-sheet.png`; key-page comparison: `/tmp/suede-winner-2025/key-pages.png`.

## Comparative findings

1. The winner's live story alternates sparse claims, first-person motivations, a named user, a single clear HMW and product states; Warm & Fuzzies currently clusters four abstract evidence slides in the middle.
2. The winner's appendix visibly contains research instruments, interview and survey findings, task-based findings, wireframes, colour work and references. Warm & Fuzzies currently has strong internal documentation but no equivalent judge-facing appendix.
3. The winner's product intervention is named and shown immediately where the target behaviour occurs. Warm & Fuzzies should foreground the receiver-controlled ending and no-reply contract rather than only the generic letter-plus-text comparison.
4. Warm & Fuzzies has the more distinctive authored visual identity and a shorter live spine. It should borrow the winner's specificity and evidence trail, not its styling or 32-page length.

## Final result

The benchmark reinforces the review verdict: visual polish is no longer the limiting factor; participant evidence, one specific user context and a visible research-to-product decision trail are.

---

# Design QA — strategic cover title

## Target and capture conditions

- Implementation: page 1 at the native 1600 × 900 canvas.
- Final capture: `/tmp/suede-slide1-strategic-title.png`.
- Browser console: zero errors and zero warnings.

## Finding and correction

The original cover only named the product, so a judge received no project territory before the opening question. The revised cover reads `Rethinking when we show appreciation.` first, then reveals Cecelia's firefly and the Warm & Fuzzies wordmark in the existing centred composition.

## Final result

passed; the title creates a clear first reading without adding a second explanatory paragraph or copying the winner deck's visual style.

---

# Design QA — approved next-level hierarchy and expressive-media direction

## Scope and status

- Status: implementation and native-canvas visual verification complete for the approved rehearsal direction.
- Approved scope: page 3 hypothesis/process framing; page 4 explicit reframe; page 5 one-active-mechanism hierarchy; page 7 specific working need-state; page 9 headline `Because digital can hold more than words.` plus five clean hand-drawn labels — writing, photo, voice, video and chosen song; page 10 causal demo narration and verbal close; deck-wide one-boss hierarchy and hidden presentation chrome.
- Explicitly retained by Ethan: the rehearsal survey slide, the If / And / Then / Therefore slide and the current main solution sentence.

## Native-canvas verification

1. Reviewed 21 changed/final build states across pages 3–10 at 1600 × 900. No visible content overflow was detected; the intentionally cropped page-7 rings were excluded from overflow failure because their crop is the selected composition.
2. Page 5 presents one full-contrast form and one bounded mechanism at a time; earlier forms recede, and the final state explicitly labels the Goldilocks map as a working design target rather than a finding.
3. Page 7 makes `One thought. One close relationship. No format that fits.` the first centre read; recruitment examples remain quiet and subordinate.
4. Page 9 retains the exact first-click solution sentence, then reveals `Because digital can hold more than words.` with only writing, photo, voice, video and chosen-song icons. Ethan's subtraction removed the fake `for Maya` keepsake box, diamonds and object subline after seeing the render.
5. Page 10 retains the optional QR/no-phone fallback. OpenCV decoded `https://warm-and-fuzzies.vercel.app/demo` from the final full-slide render, and the destination returned HTTP 200.
6. In browser fullscreen, HUD, progress, slide status and next control all compute to `display: none`; an ArrowRight keypress still advances page 9 from build 0 to build 1.
7. Browser navigation across the checked states produced zero console errors and zero warnings. The standalone deck suite passes 10/10, the deck specification validates and `git diff --check` passes.

Final reference captures: `/tmp/suede-slide9-clean-spectrum.png` and `/tmp/suede-slide10-final.png`.

The Impeccable detector ran after the final UI edit but its HTML parser dependencies were unavailable, so it used a degraded regex fallback and returned no findings. The result is treated as an undercount; the native-canvas render inspection above is the controlling visual evidence. Its open 393 × 852 hero phase belongs to an unrelated mobile-comp workflow and was not applied to this fixed 1600 × 900 presentation canvas.

## Review boundary

- Judge verdict: **Pass for rehearsal / Test first for judged delivery**.
- Authenticity verdict: **Pass for rehearsal / Test first for judged delivery**.
- Content-native signature: the same hand-drawn channel language moves from bounded psychology on page 5 to the sparse digital-expression spectrum on page 9, then into the real maker-to-receiver demo.
- Strongest remaining AI tell: five evenly spaced media icons can still read as a generic feature row when presented without narration. The single headline, shared line and removal of all card/mockup containers keep it subordinate to the medium argument; the physical rehearsal must confirm first-listener recall.
- Material human change after render: Ethan rejected the generated recipient-object composition and directly selected the stripped headline-plus-icons treatment.
- Blocking evidence boundary: the retained 82%, 71%, ratings, coordinates and circle sizes remain invented rehearsal material. They must be replaced or removed before a judged delivery regardless of hierarchy or visual polish.

---

# Design QA — 6 September annotated app feedback

## Target and evidence

- Source of truth: Ethan's five annotated Home, hub, firefly, plane and bottle frames supplied in chat on 6 September, plus the immediately preceding envelope-stamp screenshot.
- Final iPhone-surface captures: `prototype/.playwright-cli/element-2026-09-05T14-39-40-213Z.png` for Home, `prototype/.playwright-cli/element-2026-09-05T14-34-10-832Z.png` for the hub, `prototype/.playwright-cli/element-2026-09-05T14-34-49-415Z.png` for the envelope, `prototype/.playwright-cli/element-2026-09-05T14-38-21-902Z.png` for bottle arrival and `prototype/.playwright-cli/element-2026-09-05T14-40-54-360Z.png` for bottle completion.
- Interaction verification: 18 focused Playwright checks passed across visual-feedback regressions, current feedback and both demo routes. The protected mobile runtime check, TypeScript/Vite build and Sites worker suite also passed.

## Findings and corrections

1. The personal stamp was anchored to the envelope's lower-right quadrant. Both the editable and sealed-preview stamps now share the centre seam, so the mark reads as the closure rather than a second mail object.
2. `choose how it travels` used a text-sized hit box. The semantic button now spans the available row with a 56-pixel minimum height; left-edge and right-edge pointer checks both advance to carrier selection.
3. Home was missing the annotated environmental anchor. Cecelia's real reeds now rise from the two lower corners behind the one CTA, while the existing wordmark, filled firefly and question retain the sparse hierarchy.
4. The hub previously reused a smaller two-frame mascot treatment. It now performs one enlarged, bounded carrying-firefly entrance beneath a title that compresses into place; a sparse, irregular ochre firefly field stays static behind it. Reeds do not carry into the hub.
5. One generic delivery path could not express all three carriers. Sender and receiver scenes now use one-shot carrier-specific choreography: wavy firefly pickup/arrival with reeds, plane drift with clouds, and bottle travel caused by two contained water layers. The shared sun makes one slight rotation and stops.
6. The first bottle pass allowed water to cross the receiver prompt and to finish partly outside the scene. The final water stage sits behind the bottle, clears the prompt and uses small opposing translations while remaining clipped to the app surface.
7. Sender completion controls previously appeared before the selected object had travelled. They now reveal after the carrier's delivery beat; reduced-motion users receive the completed static state immediately.
8. Receiver copy now names the actual snapshot sender and offers `open it`, `another time` or `remove it`. Removal stays receiver-local and does not create a sender receipt.

## Quality boundary

- No path guides, generic particles, looping mascot motion, gradients, card shells or replacement illustrations were introduced.
- The detector's only advisory was the existing two-axis grid used by the selectable grid-paper canvas; that is functional paper content rather than a decorative background.
- No actionable P0, P1 or P2 mismatch remains in this scoped pass. The older open Impeccable hero round refers to a superseded Home-comp workflow and was not allowed to overwrite Ethan's newer annotated direction.

## Final result

passed for prototype alignment; the next useful check is a real-phone run of all three carrier scenes at presentation speed.
