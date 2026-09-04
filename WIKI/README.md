<!-- This guide explains how the SUEDE project wiki is organised and maintained. -->
# SUEDE project wiki

This folder is the team's working memory. The presentation explains the shared approach; this wiki holds the thinking, evidence and changes behind it.

## Start here

1. Open [HOME.md](HOME.md) for the current state.
2. Use [FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md](FRIENDSHIP_APPRECIATION_PRODUCT_SPEC.md) as the canonical contract for the current reversible prototype.
3. Read [JUDGING.md](JUDGING.md) before treating a product decision or pitch claim as settled.
4. Put new interpretations in [IDEAS.md](IDEAS.md) before they become final direction.
5. Use [INITIAL_IDEATION.md](INITIAL_IDEATION.md), [RULE_BANK.md](RULE_BANK.md) and [CONCEPT_BANK.md](CONCEPT_BANK.md) to widen the field without confusing generated options with evidence or selection.
6. Put observations, links and quotes in [EVIDENCE.md](EVIDENCE.md).
7. Record quick learning loops in [TESTS.md](TESTS.md).
8. Log settled decisions and their completed judge reviews in [DECISIONS.md](DECISIONS.md).
9. Use [TOOLCHAIN.md](TOOLCHAIN.md) for the installed workflow, safe hybrid rule and deferred Figma setup.
10. Use [DESIGN_SKILLS.md](DESIGN_SKILLS.md) for the research behind the tool choices.
11. Use [FRETO_REFERENCE.md](FRETO_REFERENCE.md) for the verified structure of the 2024 winner's public Canva deck and case study.
12. Update [BRIEF.md](BRIEF.md) when the official 2026 question lands.
13. Read complete meeting sources in [TRANSCRIPTS/](TRANSCRIPTS/README.md); Chronicle imports these automatically and syncs the search database.

## Working rule

Do not try to keep every page polished. Keep it current, attributable and easy to challenge.

- Facts link to a source.
- Assumptions are labelled as assumptions.
- Ideas remain separate until the team chooses to combine them.
- A decision records what changed and why.
- A reversible prototype may be implemented as a labelled experiment; final decisions and pitch claims are reviewed against all judging lenses before approval.
- A failed test stays in the wiki because it prevents repeated work.

## Search database

The Markdown files are the source of truth. `wiki.py` creates a local SQLite full-text index at `.wiki/wiki.db`.

From the project folder:

```bash
python3 wiki.py sync
python3 wiki.py search "trust"
python3 wiki.py list
python3 wiki.py show ideas
python3 wiki.py policy
```

Run `python3 wiki.py sync` after material edits. Search also syncs automatically. The index includes Markdown in nested folders such as `WIKI/TRANSCRIPTS/`.

## GitHub collaboration

The private GitHub repository is the team's shared remote: `https://github.com/SikeGottem/SUEDE-Designathon-2026`.

Invited collaborators can edit a page directly on GitHub and commit the change, or work locally. For local edits:

```bash
git pull --ff-only origin main
python3 wiki.py sync
git status --short
git add WIKI/PAGE-YOU-CHANGED.md
git commit -m "docs: update SUEDE wiki"
git push
```

Add every intentionally changed wiki page to the commit. Do not commit `.wiki/wiki.db`; every collaborator rebuilds it from the Markdown. Never force push or overwrite another person's edits.

A wiki update is complete only when its verified Markdown changes are on GitHub.

## WOOZY handoff

This wiki currently lives beside the project because macOS privacy controls blocked access to the main WOOZY repository during setup. When that access is available, link or ingest this folder as one project knowledge source rather than copying individual notes into several places.
