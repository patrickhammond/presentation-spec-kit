# Project Constitution

The governing principles every spec, plan, and task in this repository must satisfy. This is
the canonical source; when Spec Kit is initialized it is mirrored into
`.specify/memory/constitution.md` (gated at `/plan` via the plan template's Constitution Check
and re-checked across artifacts by `/analyze`). Keep the two in sync: edit here, then sync.

These are not style preferences. A change that violates a principle is a defect.

**Project:** A talk deck + interactive Spec Kit diagram, delivered as multiple variants from
one codebase. See [`AGENTS.md`](../AGENTS.md) and [`CLAUDE.md`](../CLAUDE.md).

## Principles

### 1. Styling lives in CSS, never inline

No `style={{ ... }}` props on JSX with literal values. All styling lives in `src/index.css`,
keyed by class. If a value must vary per render, pass it as a CSS custom property
(`style={{ "--tier-color": value }}`) and consume it in the stylesheet.

_Rationale:_ one source of truth for size, family, and color. Inline literals silently
override the cascade and cause drift (a hardcoded `fontSize` beating a relative `0.9em`).

### 2. One source of truth per concern

Flow content lives in `src/data/steps.js` (`STEPS` + `TIER_META`), not in node components.
Styling lives in `src/index.css`. Slide ordering, section numbering, and URL slugs come from
the per-variant manifest, not hardcoded into individual slides.

_Rationale:_ the deck ships as multiple variants. Anything duplicated across variants or
across the content/render boundary will drift between them.

### 3. No em dashes, ever

Use commas, periods, or en dashes `–`. Applies to slide copy, `src/data/steps.js`, and docs.

_Rationale:_ brand voice rule (see [`ingage-brand.md`](ingage-brand.md)).

### 4. Typographic quotes in rendered copy

Anything the audience sees on screen uses curly `’` and `“ ”`, never straight `'` / `"`.
Applies to `src/slides/*`, `src/data/steps.js`, and visible strings in `src/App.jsx`. Does not
apply to Markdown docs or code. Audit: `grep -rnE "[A-Za-z]'[A-Za-z]" src` must be empty.

_Rationale:_ straight marks read as code on a projected screen.

### 5. Designed for a projected screen

16:10 aspect, `vmin`-scaled type (≥ 27px body / ≥ 54px headings at 1080p), contrast ≥ 4.5:1
for anything the audience must read. One idea per slide, large type, near-zero reading load.

_Rationale:_ the artifact is read across a room, not at a desk. See [`accessibility.md`](accessibility.md).

### 6. Bold and accent have fixed, distinct meanings

Bold (`<strong>`) is structural only: a bridge line foreshadowing the next slide, or the single
most important item in a list (at most one per slide). Inline emphasis on a phrase uses the
orange `.sl-em` (`<em>`) treatment. Bullet markers use the body text color, not the accent.

_Rationale:_ if bold and orange both mean "emphasis," neither signals anything.

### 7. Vocabulary is exact

**Spec-Driven Development** / **SDD**: always hyphenated, title-cased. Keep the distinctions in
[`CLAUDE.md`](../CLAUDE.md) accurate (constitution vs. AGENTS.md is intentionally cut from the
talk; checklist = within-one-spec quality, analyze = cross-artifact consistency).

_Rationale:_ a talk about precise specs cannot be sloppy with its own terms.

## Governance

- **Gate:** every plan must pass a Constitution Check before research, re-checked after design (the Spec Kit `/plan` default). `/analyze` re-checks these principles across spec + plan + tasks.
- **Verification:** `npm run lint` and `npm test` must pass; the `grep` audit in Principle 4 must be empty before a change is considered done.
- **Amendment:** change this file first, then sync `.specify/memory/constitution.md`, `AGENTS.md`, and `CLAUDE.md` so all three agree.
- **Precedence:** if guidance conflicts, this constitution wins, then `CLAUDE.md`, then `AGENTS.md`.
