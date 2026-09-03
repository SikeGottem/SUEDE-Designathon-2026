<!-- This page separates confirmed SUEDE judging criteria from evidence-based interpretation for the 2026 team. -->
# Judging

## Authority

This page is the source of truth for evaluating every consequential SUEDE 2026 decision.

- Product, research, scope, time, visual and pitch decisions must be reviewed against every lens on this page.
- Exact official 2026 criteria and weights take precedence over all historical evidence and inference.
- The 2024 criteria are the current fallback because they are the latest explicit SUEDE rubric available publicly.
- Do not invent weights or collapse the criteria into one unsupported score.
- The required review procedure lives in `.agents/skills/suede-judge-review/SKILL.md`.

## Confidence boundary

- The 2026 judging rubric has not been published publicly.
- The public 2025 Devpost page lists the judging criteria as TBA.
- SUEDE published five explicit judging criteria in 2024.
- Use the 2024 criteria as the strongest available model, then replace this page when the 2026 rubric arrives.

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
