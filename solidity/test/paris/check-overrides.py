#!/usr/bin/env python3
"""Checks that each Paris override differs from its upstream file only inside
`BEGIN PARIS OVERRIDE` / `END PARIS OVERRIDE` blocks.

An override is a copy of the upstream file with marked blocks added. A block may
also replace upstream lines, in which case those lines are deleted right where
the block sits. So, after dropping the blocks, the override must equal the
upstream file except for deletions adjacent to a dropped block.

Usage: check-overrides.py [solidity directory]
"""
import difflib
import os
import sys

BEGIN = "BEGIN PARIS OVERRIDE"
END = "END PARIS OVERRIDE"


def strip_blocks(lines):
    """Returns the lines outside the marked blocks, and the indexes (into the
    returned list) at which a block was dropped."""
    kept, cut_points, inside = [], set(), False
    for line in lines:
        if BEGIN in line:
            if inside:
                raise SystemExit("nested BEGIN marker")
            inside = True
            cut_points.add(len(kept))
            continue
        if END in line:
            if not inside:
                raise SystemExit("END marker without BEGIN")
            inside = False
            continue
        if not inside:
            kept.append(line)
    if inside:
        raise SystemExit("unterminated BEGIN marker")
    return kept, cut_points


def check(upstream_path, override_path):
    upstream = open(upstream_path).read().splitlines()
    override = open(override_path).read().splitlines()
    stripped, cut_points = strip_blocks(override)
    if not cut_points:
        return [f"{override_path}: no override blocks"]
    problems = []
    matcher = difflib.SequenceMatcher(a=upstream, b=stripped, autojunk=False)
    for op, a0, a1, b0, b1 in matcher.get_opcodes():
        if op == "equal":
            continue
        if op == "delete" and b0 in cut_points:
            continue  # upstream lines replaced by a block
        problems.append(
            f"{override_path}: {op} outside the override blocks, upstream "
            f"lines {a0 + 1}-{a1} vs override lines {b0 + 1}-{b1}"
        )
    return problems


def main():
    solidity = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )
    overrides = os.path.join(solidity, "overrides", "paris", "contracts")
    problems, checked = [], 0
    for dirpath, _, files in os.walk(overrides):
        for name in files:
            override_path = os.path.join(dirpath, name)
            relative = os.path.relpath(override_path, overrides)
            upstream_path = os.path.join(solidity, "contracts", relative)
            if not os.path.exists(upstream_path):
                problems.append(f"{override_path}: no upstream file {upstream_path}")
                continue
            problems.extend(check(upstream_path, override_path))
            checked += 1
    for problem in problems:
        print(problem)
    if problems:
        sys.exit(1)
    print(f"OK: {checked} override(s) differ from upstream only inside the marked blocks")


if __name__ == "__main__":
    main()
