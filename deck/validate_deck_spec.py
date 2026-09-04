#!/usr/bin/env python3
"""Validate the machine-readable deck contract before Figma generation."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SLIDE_STATUSES = {"blocked", "draft", "ready"}
MOTION_PURPOSES = {"none", "sequence", "state-change", "causality", "attention", "demo"}


def nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate(spec: dict[str, Any], final: bool) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if spec.get("version") != 1:
        errors.append("version must be 1")

    deck = spec.get("deck")
    if not isinstance(deck, dict):
        errors.append("deck must be an object")
        deck = {}

    duration = deck.get("duration_seconds")
    if not isinstance(duration, int) or duration <= 0:
        errors.append("deck.duration_seconds must be a positive integer")

    if deck.get("brief_status") not in {"unconfirmed", "confirmed"}:
        errors.append("deck.brief_status must be unconfirmed or confirmed")
    if final and deck.get("brief_status") != "confirmed":
        errors.append("final validation requires deck.brief_status=confirmed")

    canvas = deck.get("canvas")
    if not isinstance(canvas, dict) or canvas.get("width") != 1920 or canvas.get("height") != 1080:
        errors.append("deck.canvas must be 1920x1080")

    slides = spec.get("slides")
    if not isinstance(slides, list) or not slides:
        errors.append("slides must be a non-empty array")
        return errors, warnings

    seen_ids: set[str] = set()
    total_duration = 0
    for index, slide in enumerate(slides, start=1):
        prefix = f"slides[{index - 1}]"
        if not isinstance(slide, dict):
            errors.append(f"{prefix} must be an object")
            continue

        slide_id = slide.get("id")
        if not nonempty_string(slide_id) or not ID_PATTERN.fullmatch(slide_id):
            errors.append(f"{prefix}.id must be unique kebab-case")
        elif slide_id in seen_ids:
            errors.append(f"{prefix}.id duplicates {slide_id}")
        else:
            seen_ids.add(slide_id)

        status = slide.get("status")
        if status not in SLIDE_STATUSES:
            errors.append(f"{prefix}.status must be blocked, draft, or ready")
        if final and status != "ready":
            errors.append(f"{prefix}.status must be ready for final validation")

        seconds = slide.get("duration_seconds")
        if not isinstance(seconds, int) or seconds < 0:
            errors.append(f"{prefix}.duration_seconds must be a non-negative integer")
        else:
            total_duration += seconds

        for field in ("section", "claim", "audience_takeaway"):
            if final and not nonempty_string(slide.get(field)):
                errors.append(f"{prefix}.{field} is required for final validation")

        refs = slide.get("evidence_refs")
        if not isinstance(refs, list):
            errors.append(f"{prefix}.evidence_refs must be an array")
        elif final and not refs:
            errors.append(f"{prefix}.evidence_refs needs at least one source for final validation")
        else:
            for ref in refs:
                if not nonempty_string(ref):
                    errors.append(f"{prefix}.evidence_refs contains an empty reference")
                elif ref.startswith("WIKI/") and not (ROOT / ref.split("#", 1)[0]).is_file():
                    errors.append(f"{prefix}.evidence_refs points to missing file: {ref}")

        motion = slide.get("motion")
        if not isinstance(motion, dict):
            errors.append(f"{prefix}.motion must be an object")
        else:
            if motion.get("purpose") not in MOTION_PURPOSES:
                errors.append(
                    f"{prefix}.motion.purpose must be one of {', '.join(sorted(MOTION_PURPOSES))}"
                )
            if motion.get("manual_in_figma") is not True:
                warnings.append(f"{prefix}.motion.manual_in_figma should remain true until verified")

    if isinstance(duration, int) and total_duration > duration:
        errors.append(
            f"slide timing totals {total_duration}s, exceeding deck.duration_seconds={duration}s"
        )
    elif isinstance(duration, int) and final and total_duration < max(1, int(duration * 0.8)):
        warnings.append(
            f"slide timing totals only {total_duration}s of the {duration}s presentation"
        )

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--final", action="store_true", help="Enforce final-generation gates")
    parser.add_argument("spec", type=Path, help="Path to the deck spec JSON")
    args = parser.parse_args()

    path = args.spec if args.spec.is_absolute() else ROOT / args.spec
    try:
        spec = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2
    if not isinstance(spec, dict):
        print("ERROR: deck spec root must be an object", file=sys.stderr)
        return 2

    errors, warnings = validate(spec, args.final)
    for warning in warnings:
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}", file=sys.stderr)
    if errors:
        return 1
    print(f"OK: {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
