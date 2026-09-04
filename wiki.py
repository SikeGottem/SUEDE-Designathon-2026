#!/usr/bin/env python3
"""Build and query the local SQLite search index for the SUEDE project wiki."""

from __future__ import annotations

import argparse
import re
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WIKI_DIR = ROOT / "WIKI"
STATE_DIR = ROOT / ".wiki"
DB_PATH = STATE_DIR / "wiki.db"
POLICIES = (
    (
        "judging.source_of_truth",
        "WIKI/JUDGING.md",
        "Every consequential SUEDE decision must use this judging model.",
    ),
    (
        "judging.review_required",
        "true",
        "Complete every judging and required challenge lens before a material decision advances.",
    ),
    (
        "judging.verdict_controls_execution",
        "true",
        "Proceed permits work; conditions remain blocking; Test first permits only the named test; Reject stops work.",
    ),
    (
        "judging.review_skill",
        ".agents/skills/suede-judge-review/SKILL.md",
        "Project-local agent procedure for repeatable decision reviews.",
    ),
    (
        "design.ai_is_human_led",
        "true",
        "Humans own framing, selection, taste, material edits, testing, approval and disclosure.",
    ),
    (
        "design.authenticity_review_required",
        "true",
        "Material visual work must pass authenticity preflight before build and post-build review against the render.",
    ),
    (
        "design.authenticity_skill",
        ".agents/skills/suede-design-authenticity/SKILL.md",
        "Project-local gate for source anchors, structural divergence, anti-AI checks and human authorship.",
    ),
    (
        "design.generated_first_draft_is_source_of_truth",
        "false",
        "A generated draft cannot lead later work until a human selects or materially redirects it.",
    ),
    (
        "idea.intake_required",
        "true",
        "Every raw idea needs quick capture; plausible contenders need the full dossier before selection or material design.",
    ),
    (
        "idea.intake_skill",
        ".agents/skills/suede-idea-stress-test/SKILL.md",
        "Project-local workflow for evidence, divergence, devil's advocate, proof and design-ready idea packets.",
    ),
    (
        "idea.full_dossier_before_material_design",
        "true",
        "Unknown people, rules, causes, mechanisms and proof boundaries cannot be hidden by polished UI or pitch work.",
    ),
    (
        "wiki.github_sync_required",
        "true",
        "Every completed wiki update must be committed and pushed to GitHub.",
    ),
    (
        "wiki.github_repository",
        "https://github.com/SikeGottem/SUEDE-Designathon-2026",
        "Private shared remote for the SUEDE wiki and project files.",
    ),
)


def title_for(path: Path, body: str) -> str:
    match = re.search(r"^#\s+(.+)$", body, flags=re.MULTILINE)
    return match.group(1).strip() if match else path.stem.replace("_", " ").title()


def markdown_files() -> list[Path]:
    return sorted(path for path in WIKI_DIR.rglob("*.md") if path.is_file())


def slug_for(path: Path) -> str:
    return path.relative_to(WIKI_DIR).with_suffix("").as_posix().lower()


def connect() -> sqlite3.Connection:
    STATE_DIR.mkdir(exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute(
        "CREATE TABLE IF NOT EXISTS pages (slug TEXT PRIMARY KEY, title TEXT NOT NULL, path TEXT NOT NULL, body TEXT NOT NULL, modified REAL NOT NULL)"
    )
    connection.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(slug UNINDEXED, title, body, tokenize='porter unicode61')"
    )
    connection.execute(
        "CREATE TABLE IF NOT EXISTS policies (key TEXT PRIMARY KEY, value TEXT NOT NULL, description TEXT NOT NULL)"
    )
    return connection


def sync(quiet: bool = False) -> int:
    files = markdown_files()
    with connect() as connection:
        connection.execute("DELETE FROM pages")
        connection.execute("DELETE FROM pages_fts")
        connection.execute("DELETE FROM policies")
        connection.executemany(
            "INSERT INTO policies(key, value, description) VALUES (?, ?, ?)",
            POLICIES,
        )
        for path in files:
            body = path.read_text(encoding="utf-8")
            slug = slug_for(path)
            title = title_for(path, body)
            relative_path = str(path.relative_to(ROOT))
            connection.execute(
                "INSERT INTO pages(slug, title, path, body, modified) VALUES (?, ?, ?, ?, ?)",
                (slug, title, relative_path, body, path.stat().st_mtime),
            )
            connection.execute(
                "INSERT INTO pages_fts(slug, title, body) VALUES (?, ?, ?)",
                (slug, title, body),
            )
    if not quiet:
        print(f"Indexed {len(files)} pages in {DB_PATH.relative_to(ROOT)}")
    return len(files)


def list_pages() -> None:
    sync(quiet=True)
    with connect() as connection:
        rows = connection.execute("SELECT slug, title, path FROM pages ORDER BY path").fetchall()
    for row in rows:
        print(f"{row['slug']:<12} {row['title']:<28} {row['path']}")


def show_page(slug: str) -> None:
    sync(quiet=True)
    with connect() as connection:
        row = connection.execute(
            "SELECT title, path, body FROM pages WHERE slug = ? OR lower(title) = lower(?)",
            (slug.lower(), slug),
        ).fetchone()
    if row is None:
        raise SystemExit(f"No wiki page found for: {slug}")
    print(f"# {row['title']} ({row['path']})\n")
    print(row["body"])


def search(query: str) -> None:
    sync(quiet=True)
    with connect() as connection:
        try:
            rows = connection.execute(
                "SELECT p.slug, p.title, p.path, snippet(pages_fts, 2, '[', ']', ' ... ', 18) AS excerpt "
                "FROM pages_fts JOIN pages p USING(slug) WHERE pages_fts MATCH ? ORDER BY rank LIMIT 20",
                (query,),
            ).fetchall()
        except sqlite3.OperationalError as error:
            raise SystemExit(f"Search query could not be parsed: {error}") from error
    if not rows:
        print("No results.")
        return
    for row in rows:
        excerpt = re.sub(r"\s+", " ", row["excerpt"]).strip()
        print(f"{row['title']} - {row['path']}\n  {excerpt}\n")


def show_policy() -> None:
    sync(quiet=True)
    with connect() as connection:
        rows = connection.execute(
            "SELECT key, value, description FROM policies ORDER BY key"
        ).fetchall()
    for row in rows:
        print(f"{row['key']}={row['value']}\n  {row['description']}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("sync", help="Rebuild the SQLite index from Markdown pages")
    subparsers.add_parser("list", help="List indexed pages")
    subparsers.add_parser("policy", help="Show the authoritative project policies")
    search_parser = subparsers.add_parser("search", help="Search all wiki pages")
    search_parser.add_argument("query")
    show_parser = subparsers.add_parser("show", help="Print one wiki page")
    show_parser.add_argument("slug")
    args = parser.parse_args()

    if args.command == "sync":
        sync()
    elif args.command == "list":
        list_pages()
    elif args.command == "policy":
        show_policy()
    elif args.command == "search":
        search(args.query)
    elif args.command == "show":
        show_page(args.slug)


if __name__ == "__main__":
    main()
