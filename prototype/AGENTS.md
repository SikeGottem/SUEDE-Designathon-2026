<!-- This contract protects the mobile runtime and governs product-specific prototype work. -->
# Mobile Prototype Agent Guide

## SUEDE project-specific direction

- `../WIKI/FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md` is the canonical implementation contract. Where an earlier prototype note or concept contract differs, the product specification wins.
- Keep `IMPLEMENTATION_NOTES.md` current when a build changes which canonical states are real, simulated, deferred, or deliberately excluded.
- This prototype is a disposable exploration of the friendship-appreciation direction, not a selected or validated product.
- The current source cut has 44 substantive transcript captures. Bake their locked decisions into behaviour, copy, test branches, and swappable architecture according to their evidence status. Do not expose every brainstorm as a feature: locked decisions become behaviour, unresolved ideas stay reversible, and rejected ideas stay out. The latest long 5 September mentor conversation does not specify a new screen or interaction; it holds the current product direction stable while making problem validation and user testing the next decision gate. Do not translate its presentation advice into speculative prototype UI.
- Build and test in HTML first. Do not route routine iterations through Figma; Figma comes after the team chooses a mechanism and visual direction.
- When Ethan edits a screen in Figma, that exact frame becomes the visual source of truth for that screen. Pull from a node-specific link with design context, screenshot, and exported assets before coding. When sending screens back to Figma, add one screen at a time as a simple editable frame that mirrors Ethan's sparse layer structure; omit prototype-only demo/debug links and do not dump the whole application into one canvas capture.
- Cecelia owns the eventual icon and illustration language. `/Users/ethanwu/Downloads/Warm and Fuzzy- Firefly Logo Assets` is the authoritative current source for her supplied firefly/logo inputs. Code-level library icons are temporary stand-ins and must remain easy to replace; preserve independently swappable firefly wing-state and carried-object layers for animation.
- Current visual anchor: Cecelia's 5 September brand board is the colour source of truth: Gaegu; deep ink `#081F4D` for readable copy and controls; steel blue `#5B7A85` for the large wordmark/firefly; rust `#B56D5F`, ochre `#EDA343`, olive `#9F9D81`, and pale cream `#F9F9D8` as restrained material accents. Preserve literal white for the unopened/making field and the white-to-deep-ink receiving threshold. Slate and the accent colours are not body-copy colours because they do not have sufficient contrast on cream at small sizes. Pair the palette with team-drawn linework whose apparent stroke weight sits close to Gaegu's own weight—not thick fake-sketch outlines—and generous paper space. Borrow the visual grammar, not the `grug` brand, mascot, copy, or exact compositions.
- Current interaction anchor: the ordinary root remains Ethan's sparse landing composition: the `warm & fuzzies` wordmark, one team-drawn firefly, `something good on your mind?`, and exactly one underlined `make it for them` action. That action enters a separate sparse hub rather than opening the cabinet or creator directly. The hub has one central firefly entrance and exactly two branches: `create something` and `look in your box`. The firefly entrance is one-shot state communication, not a looping pet or dashboard mascot. The collection remains a distinct optional branch; only its own bottom bar may expose `home`, a large central `+`, and `your letters` for return navigation.
- The maker composes first on a full-screen, non-scrolling, paper-first Story-like canvas. The current paper test is deliberately small: plain, dotted, and grid, with dotted as the starting surface. Write directly, add or arrange optional materials and real doodles, then finish. Typed words appear as handwriting; Backspace strikes existing words instead of deleting them, paired with an unobtrusive keyboard-accessible undo/restore route. The core order is **write -> make or reuse a personal stamp -> choose a container -> ship it -> `that's it from you.`** A saved local stamp may be reused or replaced by drawing a new one; its bounded soft/bold line choice must remain visible in preview, receiver links, and the cabinet. The stamp is optional and must never gate progress. The current container is a single authored envelope surface; never place a second closed-envelope icon inside it or restore an envelope-theme marketplace. Bottle, firefly, and paper plane remain the bounded travel choices. Each produces its own one-shot departure: water washes the bottle away, the firefly anticipates, flutters, picks up and carries the object, and the plane flies away. Preview remains exterior-only. The link/QR route is a real coded demo path but must never overclaim service-level privacy, delivery, retention, or size limits. Opening must visibly unfold the exact composed content itself and retain the maker's chosen paper. The receiver's multi-object cabinet persists only in local prototype storage; receiver-led media reveal remains parked and media never auto-plays. Do not add faux paper texture, literal Instagram chrome, generic stickers, visible route lines, a feed, or a dashboard. These are reversible prototype decisions grounded in the newest 5 September captures and direct clarification, not validation claims.
- Motion is permitted only when it supplies feedback, establishes spatial consistency, shows a state change, or explains an interaction. Courier pickup, carry, departure, and arrival must move slowly enough to read as separate actions. Wireframe squiggles, arrows, and path lines describe trajectories only and must never render as product artwork. Preserve the opening and keep/cabinet transitions; do not add ambient loops, decorative movement, or a 3D/360° collection tree.
- Cecelia's supplied redrawn firefly/logo assets replace provisional code geometry before final visual claims. Keep every slot independently swappable and use the asset inventory as the current typography/brush/line handoff.
- Keep the outer product shell sparse and comparatively neutral so the object can carry colour. Colour/package choices are future test branches, not a P0 marketplace.
- The interaction must feel like making, transferring, opening, and keeping a finite object. Do not turn it into chat, a feed, a dashboard, a streak, or an engagement system.
- Personal wording stays self-authored. Do not generate intimate copy with AI or present fabricated research, reactions, or validation.

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.
