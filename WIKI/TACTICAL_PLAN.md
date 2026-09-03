<!-- This page is the live operating plan for time, AI, decision gates and judging checks during SUEDE 2026. -->
# Tactical plan

## Working assumptions

- The exact 2026 duration, brief, pitch limit and judging rubric must be confirmed when released.
- Use the 24-hour or 36-hour schedule below as a default, then change it only for a clear reason.
- The idea and execution are equally important, but they do not need equal time. The aim is to make the idea testable early enough that execution can still be strong.

## Idea decision window

### 24-hour sprint: decide within 4-5 hours

1. `00:00-00:30` - Read the brief separately. Extract requirements, limits and individual interpretations.
2. `00:30-01:15` - Research in parallel. Cover the user, system, precedents, common solutions and hard facts.
3. `01:15-01:45` - Combine the work into 5 useful facts, 3 tensions and 3 assumptions.
4. `01:45-02:30` - Generate 3-5 ideas with different mechanisms, not small feature variations.
5. `02:30-03:15` - Turn the best two into concept cards: user, moment, intervention, assumption and core screen.
6. `03:15-04:00` - Show them to 3-5 people or a mentor. Record confusion, preference and objections.
7. `04:00-05:00` - Use only if the first test exposes a real problem. Allow one reset, then commit.

### 36-hour sprint: decide within 5-6 hours

Use the extra hour for better conversations and sharper concept tests. Do not use it for another round of unstructured internal debate.

## Decision gate

Choose the idea when:

- It fits the brief in 20 seconds.
- The user and moment are specific.
- It differs from the obvious patterns in past project galleries.
- At least three people can explain the value back to the team.
- The core interaction can be demonstrated within the remaining time.
- The riskiest assumption is named and has a planned test.

Restart only when the idea misses the brief, the core value is refuted, or the scope is impossible. Do not restart because the screens are difficult or the team has seen a new feature idea.

## 24-hour plan

| Time | Work | Done condition |
| --- | --- | --- |
| 0-4 | Research, directions, concept checks and decision | One idea passes the decision gate |
| 4-9 | Map the core flow and run a first rough test | User can complete or understand the main interaction |
| 9-16 | Build the main prototype | Entry, context, core action, response, one error and outcome work |
| 16-20 | Run a second test and refine | Biggest points of confusion are fixed |
| 20-23 | Build pitch and clean demo | Four-minute core story works without explanation from the deck |
| 23-24 | Submission and buffer | Links, credits and required fields checked on another device |

## 36-hour plan

| Time | Work | Done condition |
| --- | --- | --- |
| 0-5 | Research, directions, concept checks and decision | One idea passes the decision gate |
| 5-11 | Map the core flow and run the first test | Main interaction is understandable |
| 11-23 | Build the core prototype | Required states make the idea believable |
| 23-29 | Run a second test and refine | Main usability and value problems are addressed |
| 29-33 | Build pitch and clean demo | Story, prototype and evidence support the same claim |
| 33-36 | Rehearse, submit and keep buffer | Three rehearsals complete and submission verified |

## Protected finish block

- Reserve the last 4 hours in a 24-hour sprint or the last 6 hours in a 36-hour sprint.
- Stop adding screens and features.
- Record a clean backup demo.
- Finish the deck, submission copy and credits.
- Rehearse at least three times.
- Test every link on another device.
- Submit at least 60 minutes early.

## AI operating model

### Shared context

Keep the current brief, requirements, decisions, evidence and sources in this wiki or one shared ChatGPT Project. Do not make each thread reconstruct the project from memory.

### Parallel tasks during the opening block

1. Brief checker - extracts requirements, ambiguity and likely failure points.
2. User researcher - finds current evidence about the specific person and moment.
3. Solution scanner - maps existing responses, repeated patterns and gaps.
4. Idea generator - creates distinct mechanisms from the shared evidence.
5. Judge skeptic - attacks brief fit, originality, proof, scope and demo clarity.

These are temporary tasks, not permanent roles. Put the useful output and links back into the wiki.

### Use AI by stage

| Stage | AI does | Human checks |
| --- | --- | --- |
| Brief | Extract constraints, interpretations and questions | Compare every claim with the original wording |
| Research | Scan sources, summarize and compare precedents | Open important links and verify claims |
| Ideas | Generate options and attack assumptions | Choose using brief fit and outside reactions |
| Prototype | Create rough flows or interaction alternatives | Control scope and test the actual behaviour |
| Content | Draft realistic copy, data, errors and empty states | Edit for truth, clarity and tone |
| Pitch | Cut the script and generate judge questions | Present in the team's own words |

### Prompt structure

Every substantial prompt should include:

- **Task:** the exact question or artifact needed.
- **Context:** brief, user, moment and current decision.
- **Constraints:** time, source limits, exclusions and format.
- **Output:** the structure required for the result.
- **Checks:** what to verify, challenge or mark as uncertain.

Example:

> Task: Find 10 existing responses to [problem]. Context: We have 24 hours and the target user is [user] in [moment]. Constraints: use sources from the last three years, separate facts from inference and avoid broad summaries. Output: table with link, user, mechanism, weakness and opportunity. Checks: flag missing evidence, repeated patterns and anything that may be wrong.

### AI guardrails

- AI personas are not user research.
- Never use an unsourced number or quote in the pitch.
- Open and verify every important source.
- Do not ship code or interactions the team cannot explain and demonstrate.
- Do not let AI expand scope.
- Credit third-party and generated material according to the official rules.
- Never paste credentials or private participant information into a model.

## Working judging model

The public 2025 SUEDE criteria were listed as TBA, and the 2026 rubric is not yet available. Until it is published, check work against:

1. Exact brief fit.
2. Specific user and problem.
3. Original angle.
4. Evidence that changed the design.
5. Complete core flow and credible demo.
6. Clear story and deliberate visual craft.

Negative checks: missing requirements, generic idea, excessive scope, research that changes nothing, polish without proof and a confusing demo.

## Pitch structure

Build a four-minute core, then adapt it to the official time limit:

- `0:00-0:30` - User and problem.
- `0:30-1:15` - Evidence and insight.
- `1:15-2:45` - Core flow demo.
- `2:45-3:30` - What testing changed.
- `3:30-4:00` - Why the idea fits the brief and matters.

Ask mentors: What feels generic? What claim do you not believe? What should we cut? Can you explain the idea back to us?

## Sources

- [SUEDE Designathon 2025 overview](https://suede-designathon-2025.devpost.com/)
- [SUEDE Designathon 2025 rules](https://suede-designathon-2025.devpost.com/rules)
- [FreTo case study](https://www.ary4n.com/freto)
- [SUEDE 2025 judge reflection](https://www.linkedin.com/posts/michelpferreira_had-such-a-great-time-judging-at-the-sydney-activity-7379353109355089920-5GFs)
- [Devpost hackathon judging advice](https://info.devpost.com/blog/hackathon-judging-tips)
- [Figma Make overview](https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make)
- [Figma Make prompt guidance](https://help.figma.com/hc/en-us/articles/31304485164695-Create-a-Figma-Make-file)
- [ChatGPT Projects](https://help.openai.com/en/articles/10169521)
