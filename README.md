<!-- This page is the GitHub entry point for the shared SUEDE 2026 planning wiki and presentation assets. -->
# SUEDE Designathon 2026

This private repository is the team's shared planning workspace for SUEDE 2026.

## Start here

1. Read [WIKI/JUDGING.md](WIKI/JUDGING.md) before making a material decision.
2. Read [WIKI/HOME.md](WIKI/HOME.md) for the current position and open questions.
3. Use [WIKI/README.md](WIKI/README.md) for the editing and database workflow.
4. Open [SUEDE-Designathon-2026-Figma.pdf](SUEDE-Designathon-2026-Figma.pdf) for the Figma-ready presentation.

## Editing together

Invited collaborators can edit Markdown directly on GitHub or work locally:

```bash
git clone https://github.com/SikeGottem/SUEDE-Designathon-2026.git
cd SUEDE-Designathon-2026
python3 wiki.py sync
```

Before starting new work, pull the latest changes. After changing the wiki, rebuild the local index, commit the exact files changed and push immediately. Never force push over another teammate's work.

The Markdown inside `WIKI/` is authoritative. `.wiki/wiki.db` is generated locally and is not committed.
