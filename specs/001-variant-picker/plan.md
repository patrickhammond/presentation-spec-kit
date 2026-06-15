# Implementation Plan: Variant Picker

**Branch**: `claude/demo-variant-picker` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-variant-picker/spec.md`

## Summary

Replace the deck's silent default-variant fallback with a picker landing screen. When the
deck is opened with no variant (or an unknown one), present a screen listing every variant with
its name, room/audience, length, and whether it includes a live demo; selecting one opens that
talk at its first slide and records the choice in the shareable link. Valid deep links keep
opening their talk directly. The picker is data-driven from the existing variant manifest, so a
new variant appears with no picker change.

Technical approach: extend each entry in `src/data/variants.js` with display metadata (room,
length, demo flag) so the manifest is the single source of truth the picker reads; add a small
`VariantPicker` component (styled entirely in `src/index.css`); and change variant resolution in
`src/App.jsx` so "no/unknown variant" enters a picker mode instead of silently defaulting.

## Technical Context

**Language/Version**: JavaScript (ES2022+), React 19, plain JSX (no TypeScript)

**Primary Dependencies**: Vite 8, `@xyflow/react` v12. No router, no CSS framework, no state library.

**Storage**: None. State is the URL (`?variant=` query param + location hash). No persistence beyond the link.

**Testing**: Vitest + Testing Library + jest-axe (unit/a11y, `src/**/*.test.jsx`); Playwright (e2e, `tests/`).

**Target Platform**: Static SPA served from `dist/`, projected in a browser at 16:10 (1920x1200). No runtime network calls.

**Project Type**: Single-page web application (one project, no backend).

**Performance Goals**: Instant render; picker interactive on load. No measurable perf risk (a handful of variants).

**Constraints**: Projected-screen readability (vmin-scaled type, contrast >= 4.5:1), keyboard + assistive-technology operable, all styling in `src/index.css` (no inline style literals), curly quotes and no em dashes in rendered copy.

**Scale/Scope**: A small fixed set of variants (currently 2: ingage, gdg; client to come). One new component, one data extension, one resolution change.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                               | Impact                             | Status                                                                                                                         |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| I. Styling lives in CSS, never inline   | Picker needs new styles            | PASS - all picker styles go in `src/index.css` under `.picker-*` classes; any per-render value passed as a CSS custom property |
| II. One source of truth per concern     | Picker data                        | PASS - variant metadata added to `src/data/variants.js`; picker reads the manifest, never hardcodes a variant list             |
| III. No em dashes                       | Picker copy (labels, room, length) | PASS - data and component copy use commas / en dashes only                                                                     |
| IV. Typographic quotes in rendered copy | Picker copy                        | PASS - curly `’ “ ”` in any visible strings; covered by existing unit test sweep extended to the picker                        |
| V. Designed for a projected screen      | Picker is on screen                | PASS - vmin type, 16:10, contrast >= 4.5:1; jest-axe + Playwright a11y coverage                                                |
| VI. Bold/accent fixed meaning           | Picker emphasis                    | PASS - no false emphasis; accent reserved per existing rules                                                                   |
| VII. Vocabulary exact                   | Picker mentions variants/SDD terms | PASS - no terminology in the picker beyond variant names                                                                       |

**Result**: PASS, no violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-variant-picker/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── url-variant-contract.md   # Phase 1 output (URL + variant-metadata contract)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── data/
│   └── variants.js          # EXTEND: add display metadata (room, length, demo) per variant
├── picker/
│   ├── VariantPicker.jsx     # NEW: the picker landing screen (reads the manifest)
│   └── VariantPicker.test.jsx # NEW: unit + a11y test (renders all variants, keyboard, curly quotes)
├── App.jsx                   # CHANGE: resolution -> picker mode for no/unknown variant; return-to-picker
└── index.css                 # EXTEND: .picker-* styles (vmin, brand light theme)

tests/
└── a11y.spec.js              # EXTEND: e2e coverage of the picker route (optional)
```

**Structure Decision**: Single-project SPA, matching the existing layout. The picker is a new
`src/picker/` module (parallel to `src/slides/` and `src/flow/`), keeping one concern per folder.
Variant metadata lives with the manifest (`src/data/variants.js`) so the picker stays data-driven.

## Complexity Tracking

> No constitution violations. No entries required.
