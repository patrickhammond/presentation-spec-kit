# Presentation Spec Kit Constitution

<!-- Canonical human-readable source: docs/constitution.md. Edit there first, then sync here. -->

A talk deck plus interactive Spec Kit diagram, delivered as multiple variants from one
codebase. These principles are not style preferences: a change that violates one is a defect.
Agent context: AGENTS.md and CLAUDE.md.

## Core Principles

### I. Styling Lives in CSS, Never Inline

No `style={{ ... }}` props with literal values. All styling MUST live in `src/index.css`,
keyed by class. A value that varies per render MUST be passed as a CSS custom property
(`style={{ "--tier-color": value }}`) and consumed in the stylesheet. Rationale: one source of
truth for size, family, and color; inline literals silently override the cascade and drift.

### II. One Source of Truth Per Concern

Flow content lives in `src/data/steps.js`; styling in `src/index.css`; slide ordering, section
numbering, and URL slugs in the per-variant manifest `src/data/variants.js`. Content MUST NOT be
duplicated across variants or across the content/render boundary. Rationale: the deck ships as
multiple variants, so anything duplicated will drift between them.

### III. No Em Dashes, Ever

Slide copy, `src/data/steps.js`, and docs MUST use commas, periods, or en dashes `–`, never em
dashes. Rationale: brand voice rule (docs/ingage-brand.md).

### IV. Typographic Quotes in Rendered Copy

Anything the audience sees on screen (`src/slides/*`, `src/data/steps.js`, visible strings in
`src/App.jsx`) MUST use curly `’` and `“ ”`, never straight marks. Does not apply to Markdown
docs or code. Audit: `grep -rnE "[A-Za-z]'[A-Za-z]" src` over rendered strings must be empty.
Rationale: straight marks read as code on a projected screen.

### V. Designed for a Projected Screen

16:10 aspect, `vmin`-scaled type (>= 27px body / >= 54px headings at 1080p), contrast >= 4.5:1
for anything the audience must read, one idea per slide. Rationale: the artifact is read across
a room, not at a desk (docs/accessibility.md).

### VI. Bold and Accent Have Fixed, Distinct Meanings

Bold (`<strong>`) is structural only: a bridge line foreshadowing the next slide, or the single
most important item in a list (at most one per slide). Inline phrase emphasis uses the orange
`.sl-em` (`<em>`) treatment. Bullet markers use the body text color, not the accent. Rationale:
if bold and orange both mean emphasis, neither signals anything.

### VII. Vocabulary Is Exact

**Spec-Driven Development** / **SDD** MUST always be hyphenated and title-cased. Key distinctions
in CLAUDE.md (checklist = within-one-spec quality; analyze = cross-artifact consistency) MUST stay
accurate. Rationale: a talk about precise specs cannot be sloppy with its own terms.

## Additional Constraints

Stack is fixed: React 19 + Vite 8, plain JSX (no TypeScript), `@xyflow/react` v12, ESM. No
router, no CSS framework, no state library. New runtime dependencies MUST be justified against
this minimal footprint. The built `dist/` MUST remain a self-contained static bundle with no
runtime network calls (it ships as a GitHub leave-behind).

## Development Workflow & Quality Gates

- Every plan MUST pass a Constitution Check before research, re-checked after design (the Spec Kit `/plan` default). `/analyze` re-checks these principles across spec + plan + tasks.
- `npm run lint` and `npm test` MUST pass, and the rendered-copy `grep` audit (Principle IV) MUST be empty, before a change is considered done.
- Docs are part of the deliverable: behavior changes MUST update the relevant `docs/` files in the same change.

## Governance

This constitution supersedes other practices; where guidance conflicts, this file wins, then
CLAUDE.md, then AGENTS.md. Amendments MUST be made in docs/constitution.md first, then synced to
this file, AGENTS.md, and CLAUDE.md so all agree. Versioning is semantic: MAJOR for
principle removals or redefinitions, MINOR for a new principle or section, PATCH for
clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
