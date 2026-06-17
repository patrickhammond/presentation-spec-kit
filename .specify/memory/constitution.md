<!--
## Sync Impact Report

**Version**: 0.0.0 → 1.0.0
**Bump rationale**: MAJOR — initial fill from template; all placeholders replaced
with concrete project-specific content for the first time.

### Modified Principles
- All six principles: placeholder tokens → concrete, testable rules (first-time fill)

### Added Sections
- Core Principles I–VI (all new)

### Removed Sections
- [SECTION_2_NAME] — omitted; six principles cover all governance surface without
  additional constraint sections
- [SECTION_3_NAME] — omitted; Definition of Done (Principle V) subsumes workflow
  quality gates

### Templates Requiring Updates
- `.specify/templates/plan-template.md`: ✅ No change required — Constitution Check
  section uses a generic placeholder filled dynamically by /speckit-plan; correct as-is.
- `.specify/templates/spec-template.md`: ✅ No change required — FR-/SC-IDs appear
  inside spec documents, not source code; outside Principle VI scope.
- `.specify/templates/tasks-template.md`: ✅ No change required — T-IDs appear inside
  task documents, not source code; outside Principle VI scope.

### Follow-up TODOs
- None; all placeholders resolved.
-->

# speckit-intro Constitution

## Core Principles

### I. No Inline Style Props

All styling MUST live in `src/index.css`, keyed by class name. Per-render values
(e.g., tier color, dynamic offset) MUST be passed as CSS custom properties
(`style={{ "--var": value }}`) and consumed in the stylesheet. Inline `style`
props with static values are never permitted.

**Rationale**: Inline styles silently override the cascade and scatter sizing,
color, and font decisions across components. One stylesheet is the single source
of truth for all visual properties.

### II. Single Source of Truth

Slide order, section numbers, and URL slugs MUST come from `src/data/variants.js`.
Flow content (steps, tiers, detail copy) MUST come from `src/data/steps.js`.
Neither MUST be hardcoded in components or duplicated elsewhere.

**Rationale**: Any hardcoded ordering or content creates silent drift between what
the manifest says and what renders. All manifest-driven values must change in exactly
one place.

### III. Projector-Readable and Accessible

All audience-facing content MUST use `vmin`-scaled type. At 1080p, body text MUST
render at ≥ 27px and headings at ≥ 54px. Contrast ratio MUST be ≥ 4.5:1 for anything
the audience must read.

The accessibility tests (contrast, font size) are a **gate**, not advisory. A change
that fails these tests is not shippable regardless of visual intent.

**Rationale**: This is a projected-screen presentation. Legibility is a hard constraint,
not a preference. Audience members in the back row set the bar.

### IV. Brand Voice in Audience-Facing Copy

All audience-facing copy and typography MUST comply with `docs/ingage-brand.md` and
`docs/copy-style.md`. Those documents are the authoritative source; this constitution
does not restate their full rules.

Non-negotiable minimums: no em dashes anywhere; curly apostrophes and quotes in all
rendered copy; IBM Plex Mono reserved for section labels/titles and code only, never
prose or UI copy.

**Rationale**: Consistency across deck, flow detail panels, and shared copy is a brand
deliverable. The docs are the SoT so rules can evolve in one place.

### V. Definition of Done

No change is done until all four commands pass locally:

```
npm run lint
npm run format
npm test
npm run build
```

New behavior MUST ship with tests. Accessibility tests MUST pass. Visual or content
changes MUST be sanity-checked against the affected slide or flow in the built bundle
(`npm run preview`).

**Rationale**: A green local gate prevents regressions from reaching the deck at the
moment of presentation. "Looks right in dev" is not done.

### VI. No Artifact IDs in Source

Source code and inline comments MUST NOT cite spec, plan, or task identifiers
(FR-, SC-, US-, R-, T-IDs). Traceability lives in the PR description and commit
history, not inline.

**Rationale**: Artifact IDs renumber as specs and plans evolve. Inline citations
become stale noise that misleads future readers about intent and version history.

## Governance

This constitution supersedes all other coding and content practices for this
repository. Any amendment requires:

1. A PR with the updated constitution and a clear rationale for the version bump.
2. All dependent templates reviewed for alignment (see the Consistency Propagation
   checklist in the `/speckit-constitution` skill).
3. `LAST_AMENDED_DATE` updated to the date of the amendment; `CONSTITUTION_VERSION`
   bumped per semantic versioning:
   - MAJOR: a principle removed or redefined in a backward-incompatible way.
   - MINOR: a new principle or section added, or guidance materially expanded.
   - PATCH: clarifications, wording fixes, non-semantic refinements.

All PRs and code reviews MUST verify compliance with Principles I–VI before merge.
Complexity that would violate a principle requires explicit justification in the PR
description (never inline in source).

For runtime development guidance see `CLAUDE.md` (project-level) and the `docs/`
folder (brand, copy, accessibility, speaker notes, audience profiles).

**Version**: 1.0.0 | **Ratified**: 2026-06-17 | **Last Amended**: 2026-06-17
