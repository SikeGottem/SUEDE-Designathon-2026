---
name: suede-idea-stress-test
description: Turn a raw SUEDE idea into an evidence-honest, design-ready idea packet, or compare divergent mechanisms before selection. Use during ideation, idea critique, concept selection, and before any material UI or pitch work.
---

<!-- This skill makes SUEDE ideas concrete enough to test, design and pitch without mistaking an attractive feature list for a solution. -->
# SUEDE idea stress test

Use this before material product, UI, prototype or pitch work. It is a structured conversation and critique, not a form to complete mechanically. Its job is to expose the few unknowns that would make a polished design dishonest or wasteful.

This skill complements the mandatory `suede-judge-review` gate. It develops the packet that review needs; it does not override the review's verdict.

## Read first

1. Read `WIKI/JUDGING.md` and the current brief when one exists.
2. Read the relevant evidence, tests, ideas and decisions. Use `WIKI/TEMPLATES.md` for record-compatible phrasing.
3. Treat missing evidence as unknown. Never invent personas, quotes, research, technical capability, stakeholder consent or user behaviour to make the packet feel complete.

## Choose the mode

Name the mode at the top. Do not force a raw thought through a selected-idea workflow.

| Mode | Use when | Required outcome |
| --- | --- | --- |
| **Intake** | The team has a fragment, observation or early concept. | A precise problem hypothesis, the key unknowns and the next smallest evidence action. |
| **Exploration** | The team wants new directions. | At least four mechanism-level paradigms: obvious baseline, embedded-in-context intervention, non-app/service/system response, and inversion/extreme-constraint response. |
| **Comparison** | There are multiple viable directions. | A side-by-side argument that keeps mechanisms distinct and names the evidence that could change the lead. |
| **Selected idea** | The team wants to test, prototype, design or pitch one direction. | A design-ready idea packet, strongest objections, required conditions and next evidence. |

For incomplete inputs, ask only the highest-leverage unanswered questions. When the team is moving fast, infer a **hypothesis** from their own words, label it as an inference and keep it reversible.

## Intake: turn a thought into a testable claim

Start with this sentence, leaving gaps visible:

> For **[specific person]** in **[specific moment]**, **[current situation]** causes **[harm, friction or missed outcome]** because **[supported or hypothesised cause]**. We might change this through **[mechanism]**, so **[visible outcome]** becomes possible.

Interrogate the chain in this order:

1. **Person and moment** — Who exactly experiences it? What are they trying to do, where are they, what constraint matters, and what happens immediately before the friction?
2. **Problem and cause** — What is observed versus assumed? Is the apparent problem merely a symptom? What would the person say is at stake?
3. **Existing behaviour** — What do they do now, what already works, and why has the problem persisted?
4. **Desired change** — What specific behaviour, decision, capability or condition should become different? What can a judge actually see?
5. **Riskiest assumption** — Which link in the chain, if false, collapses the idea?

Do not name a platform or UI pattern as the solution until the causal chain is intelligible.

### Current brief: unwritten-rule map

For the active user-provided brief, complete the brief-specific section in `WIKI/IDEA_SCAFFOLD.md`. At minimum, establish:

- the unwritten rule in lived language, not an abstract topic
- the setting and repeated moment where it changes behaviour
- the signals, people, incentives and consequences that teach or enforce it
- who benefits, who is constrained and who may not know the rule
- whether the experience reveals, communicates, questions or redesigns it, and why that posture fits
- how participants act or experience a changed condition rather than merely reading an explanation
- the risk of humiliating, exposing, coercing or further burdening affected people
- the observable sign that the intervention exposed or reinforced the rule instead of changing it

Treat the wording as user-provided until `WIKI/BRIEF.md` records an independently verified official source.

## Exploration: diverge by mechanism, not features

Make the required paradigms genuinely different. Each must say who acts, what changes in the real situation and why it might work.

- **Control:** the obvious response, kept as a baseline rather than silently adopted.
- **Embedded:** an intervention where the behaviour already happens.
- **Beyond-screen:** a service, object, ritual, environment, incentive, policy or system response with no assumed app.
- **Inversion:** remove or reverse a presumed actor, step, signal, account, AI role or reward.
- **Evidence-led extra:** add another paradigm only if a real finding calls for it.

For every direction, capture its first promise, its non-negotiable assumption, the smallest believable proof and what it would deliberately not solve. If every direction is an app, chatbot, dashboard or feature set, diverge again before comparing.

## Interrogate the leading mechanism

Build the detail necessary to decide whether design work is justified. Answer with evidence, an explicit hypothesis or an open question.

### Value and necessity

- Why would this person choose it over their current workaround?
- What does it make easier, safer, more possible or less costly in that exact moment?
- Why does the proposed medium need to exist? Could a conversation, service, physical intervention, policy, default setting or social norm do this better?
- What does the mechanism do that a generic information page, reminder, chatbot or dashboard cannot?

### End-to-end mechanism

Describe the smallest complete loop, not a feature inventory:

1. Entry trigger and context
2. User action or decision
3. System, service or other-person response
4. Interpretation, correction or choice
5. Payoff the user can perceive
6. What happens when the desired result does not occur

Name the critical states: entry, action, response, correction, payoff, error, recovery, permission/trust and accessibility. If a state is unknown, make that the question the first sketch or test must answer; do not polish it away.

### Viability, feasibility and truth

- Who benefits, who pays, who maintains it and what incentives keep it alive?
- What operational dependency, data source, partner, moderation, legal constraint or technical capability is required?
- Which part can genuinely work in the Designathon and which part would be simulated? How will the demo disclose the difference honestly?
- What is the smallest scope that proves the causal mechanism rather than a superficial click-through?

### Trust, safety and inclusion

- What must the person trust, what information or power changes hands, and what is the plausible misuse?
- What consent, explanation, control, moderation or recovery is necessary?
- Who cannot access, understand, afford, safely use or benefit from the critical path? Consider disability, language, culture, device, time, confidence and power differences where relevant.
- What would a safe failure look like, and how does the user recover without harm or humiliation?

### Incentives and second-order effects

- What behaviour does the idea reward, normalise, displace or make easier to game?
- Who might be burdened, excluded or made responsible for a system-level problem?
- What happens after novelty fades, adoption is uneven or the intervention succeeds too well?

### Distinctiveness and authorship

- What specific insight, constraint or context makes this mechanism non-interchangeable?
- What is the obvious solution, and why is this different in a way that matters?
- What will the team manually choose, reject, rewrite, test or alter rather than delegate to AI?
- What would make the concept fail the logo-swap test: could its mechanism fit any unrelated problem?

## Design-input completeness gate

Before visual or UI construction, the packet must state:

- exact user, context and job/tension
- critical action, response and visible outcome
- full core loop including error, recovery, trust and accessibility states
- evidence that supports each consequential claim, plus the untested assumptions
- medium necessity and at least one credible non-digital alternative
- design point of view: what must feel different because of the subject, not merely a style adjective
- one testable core flow and an honest demo boundary

If these are missing, only make rough sketches, storyboards, role-plays or prototypes that answer the missing question. Do not create polished screens, a design system or pitch visuals as a substitute for a mechanism.

## Devil's advocate pass

Write the strongest fair objection, not a weak straw man:

- “The actual problem may be ___, not ___.”
- “This assumes ___ will do ___, but the evidence currently shows ___.”
- “A non-digital or simpler alternative could outperform this because ___.”
- “This could create the following trust, safety, accessibility or incentive harm: ___.”
- “The demo would look convincing without proving ___.”
- “Judges may hear this as a familiar ___ unless the distinctive mechanism is ___.”

Then specify whether each objection is answered by evidence, limited by scope, or remains a blocker. Do not argue away a blocker; turn it into the next test, a condition, or a reason to stop.

## Output: design-ready idea packet

Return this compact, evidence-labelled packet. Keep it legible enough to paste into `WIKI/IDEAS.md` or a working document.

```markdown
## [Working name] — [mode]

### One-line proposition
For [person] in [moment], [mechanism] helps [outcome] because [insight/cause].

### What we know / infer / need to learn
- Confirmed evidence:
- Hypotheses:
- Highest-leverage unknown:

### Problem and context
- Person, moment and current workaround:
- Harm or missed outcome:
- Supported or hypothesised cause:

### Mechanism and core loop
1. Entry:
2. Action:
3. Response:
4. Correction or choice:
5. Payoff:
6. Failure and recovery:

### Why this medium
- Necessity:
- Credible non-digital / simpler alternative:
- Why the leading mechanism is different:

### Viability, feasibility and safeguards
- Delivery / dependency / incentive:
- Demo truth:
- Trust, privacy and safety:
- Inclusion and accessibility:
- Second-order effects:

### Design and pitch inputs
- Critical state to design first:
- Subject-specific point of view:
- What the prototype must prove:
- One-sentence retell:
- Demo beat:

### Devil's advocate
- Strongest objection:
- Answer, limitation or blocker:

### Next move
- Smallest test or evidence action:
- What result would make us stop or pivot:
- Work permitted now:
```

In **comparison** mode, precede the leading packet with a short table using qualitative claims only: direction, mechanism, moment, central assumption, evidence status, unique strength, strongest objection and next proof. Never use numeric pseudo-scores.

## Handoff to the required gate

When the team intends to select, combine, build, pitch or materially promote an idea, run `suede-judge-review` using this packet and the real divergence set. Its verdict controls execution:

- `Proceed` — make the named next artifact or test.
- `Proceed with conditions` — the conditions remain blocking.
- `Test first` — only the named test may happen.
- `Reject` — archive the direction and why.

For visual work that proceeds, run `suede-design-authenticity` before material styling. AI may help expand, organise and challenge; humans own framing, selection, research interpretation, material edits, testing, approval and disclosure.
