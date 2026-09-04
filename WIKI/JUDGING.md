<!-- This page separates confirmed SUEDE judging criteria from evidence-based interpretation for the 2026 team. -->
# Judging

## Authority

This page is the source of truth for evaluating every consequential SUEDE 2026 decision.

- Product, research, scope, time, visual and pitch decisions must be reviewed against every lens on this page.
- Exact official 2026 criteria and weights take precedence over all historical evidence and inference.
- The 2024 criteria are the current fallback because they are the latest explicit SUEDE rubric available publicly.
- Do not invent weights or collapse the criteria into one unsupported score.
- The required review procedure lives in `.agents/skills/suede-judge-review/SKILL.md`.

## Non-negotiable execution gate

This page is the team's operating constitution, not optional advice. No material direction advances until it has passed the required review.

Run the review before:

- promoting, combining or selecting an idea
- committing research, testing or build time to a direction
- adding or expanding a feature, flow, platform or technical dependency
- starting low-, mid- or high-fidelity UI that establishes hierarchy, behaviour, trust, accessibility or visual direction
- locking a prototype, demo, pitch claim, story structure or visual language

The verdict controls what happens next:

- **Proceed:** the work may advance to the next stage.
- **Proceed with conditions:** the work may advance only while the named conditions are treated as blocking requirements.
- **Test first:** all work stops except the smallest named test or evidence-gathering action.
- **Reject:** stop investing in the direction and archive the reason.

Raw divergent brainstorming, factual research and reversible production fixes may happen without a full review while they remain clearly exploratory. A typo, file rename or optical spacing correction does not need ceremony. Any choice that changes meaning, behaviour, scope, evidence, accessibility, trust, visual direction or the judging case does.

Reviews must be proportional but complete. A concise review is acceptable; silently skipping a lens is not.

## Confidence boundary

- The 2026 judging rubric has not been published publicly.
- The public 2025 Devpost page lists the judging criteria as TBA.
- SUEDE published five explicit judging criteria in 2024.
- Use the 2024 criteria as the strongest available model, then replace this page when the 2026 rubric arrives.

## The connected judging chain

The criteria are not independent boxes. Treat them as a dependency chain:

```text
specific problem -> supported cause -> distinct mechanism -> visible outcome -> believable proof -> memorable story
```

Later polish cannot repair an unsupported earlier link. When a review finds a weak upstream link, fix or test that link before increasing fidelity.

## Confirmed 2024 criteria

Source: [SUEDE Designathon 2024](https://suede-designathon-2024.devpost.com/)

1. **Visual Communication:** How well does your design look and feel?
2. **Problem Identification:** How well did you identify and understand the problem?
3. **Solution Approach:** How effective is your product at solving the problem?
4. **Design Innovation:** How creative and innovative is your solution?
5. **Presentation Skills:** How well does your team present and communicate your ideas?

No public weighting was provided.

## How to interpret each criterion

### Problem identification

Judges are likely asking:

- Is the user specific?
- Is there a clear moment where the problem occurs?
- Is the underlying cause understood?
- What evidence proves the problem matters?

Strong proof: one user, one situation, a clear tension and evidence that changes the framing.

Weak proof: a broad social issue, an invented persona or research facts with no consequence for the idea.

### Solution approach

Judges are likely asking:

- Does the mechanism directly address the cause?
- What outcome becomes better for the user?
- Can the value be seen in the prototype?
- Is the main solution complete enough to believe?

Strong proof: a visible line from problem to action to outcome, shown through one complete flow.

Weak proof: a list of features that sounds useful but does not resolve the identified problem.

### Design innovation

Judges are likely asking:

- Is the interpretation different from the obvious response?
- Does the mechanism change behaviour in a useful or unexpected way?
- Is the solution placed where the problem already happens?
- How does it differ from existing responses?

Strong proof: a distinct insight or mechanism with a clear reason it is better for this problem.

Weak proof: a familiar app, dashboard or chatbot with the brief added as content.

### Visual communication

Judges are likely asking:

- Can they see what matters and what happens next?
- Do typography, colour, spacing and components feel deliberate?
- Does the visual design help people understand the interaction?
- Does the style suit the user and context?

Strong proof: enough fidelity to communicate clearly, with craft concentrated on the critical moments.

Weak proof: decoration and polished mockups covering an unclear interaction.

### Presentation skills

Judges are likely asking:

- Can they explain the idea back after hearing it once?
- Does the pitch move from problem to insight to solution to proof?
- Does the demo show the important interaction clearly?
- Has the team removed details that do not support the argument?

Strong proof: one sentence for the idea, one clear demo and only the evidence needed to believe it.

Weak proof: a chronological process diary, too many disconnected speakers or a demo that requires constant narration.

## Additional 2025 signals

- [SUEDE's 2025 page](https://suede-designathon-2025.devpost.com/) separated Best UI and Best Pitch from the overall award. This suggests neither visual finish nor presentation alone defines the overall winner.
- [SUEDE's public posts](https://au.linkedin.com/company/suedesociety) described the top three teams as standing out for creativity, impact and vision.
- [Final judge Michel Ferreira](https://www.linkedin.com/posts/michelpferreira_had-such-a-great-time-judging-at-the-sydney-activity-7379353109355089920-5GFs) highlighted storytelling in the final showcase.
- The 2025 winner, [Hot Topic](https://devpost.com/software/hot-topic-jmrv5b), addressed digital literacy inside comments below videos people already watch. This gave the idea a specific problem context and a visible core interaction.
- The 2024 winner, [FreTo](https://www.ary4n.com/freto), compared problems, gathered primary research, tested before high-fidelity work and documented what changed.

## Working overall-winner model

This is an inference, not an official weighting:

1. A specific interpretation of the brief.
2. A problem grounded in a real user and moment.
3. A distinct mechanism with visible impact.
4. A complete and understandable core flow.
5. Evidence that research and testing changed the design.
6. Deliberate visual communication.
7. A concise and memorable presentation.

## Required challenge lenses

Every material idea, product, UI, prototype and pitch decision must also survive these challenge lenses. They do not replace the published judging criteria; they prevent the team from reaching them through a narrow or default interpretation.

| Challenge lens | Required question |
| --- | --- |
| Assumption and inversion | What are we treating as fixed, and what happens if we reverse or remove it? |
| Behaviour and context | Where does the problem already happen, and can the intervention live in that moment? |
| Medium necessity | Does this need an app, screen, account or AI at all? |
| Alternatives | What existing, non-digital, service, system or policy response competes with this? |
| Human specificity | Which real person, circumstance, motivation and constraint could make this fail? |
| Inclusion and accessibility | Who is excluded, burdened or unable to use the critical interaction? |
| Trust, safety and privacy | What must the user trust, what data or power is involved, and how could it be abused? |
| Failure and recovery | What goes wrong, how does the system reveal it, and how does the user recover? |
| Feasibility and demo truth | What genuinely works, what is simulated and what can the prototype honestly prove? |
| Incentives and second-order effects | What behaviour does this reward, distort or create after the first use? |
| Simplicity and retellability | Can the core value be understood, demonstrated and repeated in one sentence? |
| Authorship and distinctiveness | Which choices show team judgment rather than a template, trend or model default? |

Add domain-specific lenses when the concept creates a material risk not covered here. “We reviewed every lens” means this minimum set plus the relevant domain lenses; it does not mean pretending every possible worldview can be exhausted.

## Divergence before convergence

Do not select among minor feature variants and call it ideation. Before an idea can lead, create at least four mechanism-level paradigms:

1. the obvious baseline, used as a control rather than a default winner
2. an intervention embedded where the behaviour already occurs
3. a non-app response such as a service, physical object, social ritual, environment, incentive or system change
4. an inversion or extreme-constraint response that removes an assumed feature, actor or step

Add more paradigms when evidence suggests a different lens. If every option is an app, dashboard, assistant or chatbot with different features, divergence has failed and selection cannot begin.

## Human-led AI design doctrine

AI is leverage, not the author or the taste-maker.

Current published evidence:

- The [2024](https://suede-designathon-2024.devpost.com/rules) and [2025](https://suede-designathon-2025.devpost.com/rules) SUEDE rules did not explicitly ban generative AI or mandate a design tool.
- Both years allowed teams to use Figma, Adobe XD or another tool for the working prototype.
- Both years required teams to reference open-source or third-party material and explain how it was used or improved.
- The 2026 rules are not yet public, so AI permission and disclosure requirements remain unconfirmed until the official rules or organisers clarify them.

Until then, use the stricter safe interpretation:

- record each material AI tool, generated asset and external source used in the final entry
- preserve prompts, source references and major human edits when they affect a submitted artifact
- verify facts, claims, accessibility and functional behaviour independently
- never present generated research, personas, quotes, tests or prototype behaviour as real evidence
- never use AI output as proof that an idea is original, usable or desired
- keep the final rationale explainable by the team without referring to the model

The required hybrid workflow is:

1. **Humans frame:** define the person, moment, evidence, tension and design intent.
2. **Humans diverge:** form multiple mechanism-level paradigms before asking AI to elaborate them.
3. **AI expands:** accelerate research synthesis, counterarguments, content variants, rough compositions, code and production options.
4. **Humans select:** reject the median, name the point of view and choose using evidence and the full review.
5. **Humans author:** redraw, rewrite, combine, remove and introduce context and signature details.
6. **Humans test:** put the critical flow in front of people and record what changed.
7. **AI assists refinement:** help execute verified changes without silently replacing the team's judgment.
8. **Humans approve and disclose:** inspect the final artifact at delivery scale and truthfully describe AI and third-party use.

An AI-assisted artifact fails the authorship gate if:

- the team cannot explain why its major choices exist
- the visual direction could fit any product after changing the logo and copy
- it defaults to generic gradients, card grids, stock illustrations, fake dashboards or feature abundance
- it averages references instead of expressing a clear point of view
- the generated artifact becomes the reference that all later decisions merely polish
- no human research, critique, manual edit or test materially changed the output

The operational visual gate is `.agents/skills/suede-design-authenticity/SKILL.md`. Run it before material styling or Figma construction and again against the rendered artifact. Invoking an anti-slop or visual-design skill does not prove authorship; the output must survive the source-anchor, reference-delta, logo-swap, team-voice and subtraction checks.

Possible stigma is a presentation risk, not a confirmed SUEDE rule. The answer is not to hide AI or avoid it categorically. Make human judgment visible: show the evidence, alternatives rejected, changes made after testing and deliberate choices that a model could not make responsibly on its own.

## Stage-specific gates

### Idea gate

Before selection, require the divergence set, the full judging review, all challenge lenses and one sentence describing the person, moment, cause, mechanism and outcome. A leading idea must be more than a feature list.

### Product and UI preflight

Before establishing a UI direction, name:

- the exact user, context and job
- the critical action and system response
- the outcome the user can see or feel
- the evidence supporting the flow
- the entry, action, response, correction, payoff, error, recovery, trust and accessibility states that matter
- the intended point of view and the visual conventions being deliberately accepted, changed or rejected

If those are unknown, sketch only to answer the unknown; do not polish.

### Product and UI post-build review

Review the actual screens or working prototype, not a prose description. Check whether the critical path is understandable without narration, the distinctive mechanism is visible, failure and recovery are believable, accessibility is not decorative and the result still has a recognisable human point of view.

### Pitch and demo gate

Reject or rework the story when it misses the brief, takes too long to understand, feels generic, shows a prototype that proves nothing, uses research decoratively or hides an incomplete core flow. The final pitch must show one specific problem, the mechanism, the resulting change, the evidence behind the decisions and one memorable demonstration.

## Concept review questions

- What exact problem are we solving?
- What evidence makes us believe it matters?
- Why does this mechanism solve that problem?
- What is different from the obvious response?
- What can judges see working?
- Can someone explain the idea back in one sentence?

## Final entry review questions

- Does every requirement appear in the submission?
- Does the opening make the problem specific?
- Does the demo show the core value clearly?
- Do we show what research or testing changed?
- Does the visual design help understanding?
- What will judges remember ten minutes later?

## Replace when the 2026 rubric arrives

When the official criteria are released:

1. Copy the exact wording and any weights into this page.
2. Mark every inference that is no longer supported.
3. Update the presentation and review questions.
4. Change the tactical plan only after the judging model is clear.
5. Run `python3 wiki.py sync` and confirm `python3 wiki.py policy` reports the new authority.
