<!-- This blind review compares Relay candidates A, B and C against the fixed benchmark evidence. -->
# Blind review: Relay benchmark

All three candidates complete the required keyboard-activated path, remain within both viewports without horizontal overflow, work without external resource requests/errors, and respect reduced motion.

## Candidate A

- **Strongest characteristic:** Visual hierarchy is **strong**. The black, off-white and acid-green system makes the primary action, route thread and loss state immediately legible. The desktop and mobile captures preserve the same calm, decisive reading order.
- **Weakest characteristic:** Accessibility is **mixed**. Focus handling is deliberate and visible, live feedback is present, and the major controls are generous, but the demo controls are 38px high, below the expected 44px touch target.
- **Core-flow clarity:** **strong**. The checkpoint list, state heading and in-context actions make ready → active → loss → fallback → restored → arrived easy to understand.
- **Failure and trust:** **strong**. “Signal paused”, saved checkpoint, retry behaviour, SMS choice and demo-only language are clear without inflating the promise. The loss state is serious, not theatrical.
- **Visual hierarchy:** **strong**. The single device-like surface keeps the task focal; coral reserves urgency for fallback.
- **Distinctiveness:** **strong**. The vertical checkpoint thread and low-light transit palette form a recognisable product language without a map or dashboard.
- **Responsive craft:** **strong**. The mobile column retains all controls and the route hierarchy, with no clipped required content.
- **Accessibility:** **mixed**. Visible focus, skip link, semantic list and live regions are credible; increase demo-control targets to at least 44px.
- **Purposeful motion:** **strong**. The connection dot has a clear status role and reduced-motion suppression is explicit.
- **Implementation truth:** **strong**. Simulation language accompanies the page and confirmations.
- **Restraint:** **strong**. It stays focused on the journey and avoids component sprawl.
- **Observed defects / required human edits:** enlarge demo controls; consider reducing the repeated large marketing block on later mobile states so the critical recovery content appears sooner.

## Candidate B

- **Strongest characteristic:** Failure and trust are **strong**. The loss view explicitly separates “Known”, “Relay will” and “You can”, then pairs the fallback with an unambiguous no-send demo note. It is the clearest failure explanation in the set.
- **Weakest characteristic:** Accessibility is **weak**. Automated evidence shows focus lands on `BODY` after most state transitions. That breaks orientation for keyboard and assistive-technology users despite visible styling and live announcements.
- **Core-flow clarity:** **strong**. The sequence and action labels are clear, and the loss panel explains the next decision well.
- **Failure and trust:** **strong**. The product neither implies a real SMS nor turns recovery into surveillance or emergency protection.
- **Visual hierarchy:** **strong**. Editorial typography and the paper ticket surface give actions and informational strata a calm order; the coral interruption is correctly isolated.
- **Distinctiveness:** **strong**. The transit-ticket composition, serif/sans pairing and restrained palette feel intentional and Relay-specific.
- **Responsive craft:** **strong**. The ticket remains readable and all controls are present on mobile; the long failure panel remains composed rather than cramped.
- **Accessibility:** **weak**. Focus-loss is disqualifying as a polish issue until corrected. The signal-loss control is also 39px high, below 44px.
- **Purposeful motion:** **mixed**. Reduced motion is respected and nothing delays input, but the captured state changes do not add much continuity beyond static replacement.
- **Implementation truth:** **strong**. The global fictional-demo label and local fallback confirmation are exceptionally explicit.
- **Restraint:** **strong**. No invented capability, fake map or decorative clutter.
- **Observed defects / required human edits:** repair state-transition focus so it lands on the newly relevant heading or next action, retain a visible focus indicator, and raise compact control height to at least 44px.

## Candidate C

- **Strongest characteristic:** The overall product argument is **strong**. The linked Maya–Riverside–Jo thread makes checkpoint sharing, rather than live tracking, physically intelligible in every state.
- **Weakest characteristic:** Purposeful motion / focus presentation is **mixed**. Moving focus to the new `h1` is semantically defensible, but the blue outline is visibly present in the captured loss, restored and arrival states, reading as browser residue rather than intentional state treatment.
- **Core-flow clarity:** **strong**. The narrative pane and companion journey pane clearly describe the state, known information, next action and completion.
- **Failure and trust:** **strong**. The loss state calls out last checkpoint, next checkpoint and automatic retry, labels restore as demo-only, and never implies actual sending or tracking.
- **Visual hierarchy:** **strong**. Large state headings and compact actions are clear, while the secondary pane supports rather than competes.
- **Distinctiveness:** **strong**. The two-person thread is the most literal and memorable articulation of the product’s promise, without becoming a map.
- **Responsive craft:** **strong**. Mobile becomes a deliberate vertical story plus journey sequence with all necessary controls visible and no overflow.
- **Accessibility:** **mixed**. Controls are at least 44px, semantics and live announcements are sound, and major transitions move focus intentionally. The current focus treatment needs refinement because its visible blue rectangle overwhelms the heading in screenshots.
- **Purposeful motion:** **mixed**. The thread-progress animation usefully represents continuity and respects reduced motion; the persistent post-transition outline undercuts visual polish.
- **Implementation truth:** **strong**. Demo wording is continuous, specific and repeated at the point of risk.
- **Restraint:** **strong**. No extraneous product claims or generic card/dashboard treatment.
- **Observed defects / required human edits:** replace or restyle the focused heading treatment so focus remains perceptible without looking like an error border; verify its contrast in both system color schemes.

## Pairwise preference

- **C over A:** C has the stronger complete product argument and meets the 44px target expectation. A’s operational interface is more immediately forceful, but its smaller demo controls and repeated hero on mobile leave a small gap.
- **A over B:** A has comparable clarity and a more reliable keyboard focus path. B’s failure explanation is superior, but focus falling to `BODY` is a material usability defect.
- **C over B:** C preserves the best trust framing and journey metaphor while maintaining focus continuity and larger controls. B’s loss-content structure is more explicit, but cannot outweigh the transition-focus failure.

## Provisional decision

**Provisional winner: C.** It has the strongest coherent expression of Relay’s non-surveillance promise across ready, failure, recovery and completion, while preserving responsive composition, honest simulation and minimum touch-target expectations. **Confidence: moderate.**

**Smallest reversal test:** Fix B’s state-transition focus to land visibly on the newly shown heading (or next action), increase the compact controls to at least 44px, then repeat the keyboard path and captures. If the focus repair is clean, B’s exceptionally explicit loss-state explanation could make it preferable to C, whose heading-focus outline still needs visual refinement.
