# Phase 0 Research: Variant Picker

The Technical Context had no `NEEDS CLARIFICATION` markers; the stack and conventions are fixed
by the repo and constitution. Research here records the few real design decisions.

## Decision 1: Where variant display metadata lives

- **Decision**: Add a `meta` object to each variant in `src/data/variants.js` (`room`, `length`, `demo`), alongside the existing `label` and `entries`.
- **Rationale**: Constitution Principle II (one source of truth). The picker must list variants without hardcoding them; the manifest already enumerates variants, so attaching the picker's display fields there means adding a variant automatically populates the picker (FR-003, SC-002). The descriptive copy already exists prose-side in `docs/audience-*.md`; this surfaces the same facts as data.
- **Alternatives considered**: A separate picker-only metadata file (rejected: a second list to keep in sync, invites drift); parsing `docs/audience-*.md` at build time (rejected: over-engineered, couples runtime to doc prose).

## Decision 2: How "no variant" enters the picker instead of defaulting

- **Decision**: In `src/App.jsx`, distinguish three cases at load: no `?variant=` param -> picker mode; `?variant=` names a known variant -> deck (current behavior); `?variant=` names an unknown variant -> picker mode. `DEFAULT_VARIANT` is retained as a named constant but is no longer applied automatically to the no-param case.
- **Rationale**: Directly satisfies FR-001 and FR-008 and the explicit ask ("a variant selection where there isn't a default"). Keeping `resolveVariant` but adding an explicit "is this a known variant?" check keeps the change small and testable.
- **Alternatives considered**: Removing `DEFAULT_VARIANT` entirely (rejected: still useful as documentation and for tests / fallback links); a route like `#picker` (rejected: variant selection is a pre-deck concern carried by the query param, not an in-deck hash location).

## Decision 3: Returning to the picker from within a talk

- **Decision**: Support a "back to picker" affordance that clears the variant (navigates to the deck address with no `?variant=`), which re-enters picker mode.
- **Rationale**: FR-011. Reuses the same resolution rule (no param -> picker) rather than inventing a separate state, so there is one way to be "in the picker."
- **Alternatives considered**: A modal overlay over the current talk (rejected: more state, competes with the existing keyboard model); restart-only (rejected: fails FR-011).

## Decision 4: Accessibility and visual approach

- **Decision**: Render the picker as a list of selectable controls (native focusable elements), labeled with each variant's name and metadata, styled with `.picker-*` classes in `src/index.css` using vmin units and the Ingage light theme. Keyboard: Tab/arrow to move, Enter/Space to choose.
- **Rationale**: Principles I and V and FR-009/FR-010/FR-012. Native controls give keyboard and screen-reader support for free; jest-axe in the unit test enforces no a11y violations, consistent with the slide tests.
- **Alternatives considered**: Custom div-based "cards" with ARIA roles (rejected: reimplements button semantics, more to get wrong); reusing slide markup (rejected: the picker is not a slide and should not inherit slide nav).

## Decision 5: Testing strategy

- **Decision**: Add `src/picker/VariantPicker.test.jsx` (renders every variant from the manifest, jest-axe clean, no straight quotes, keyboard reachable) and extend resolution coverage. Optionally extend `tests/a11y.spec.js` for the picker route.
- **Rationale**: Mirrors the existing data-driven slide test (iterate the manifest), so adding a variant is automatically covered.
- **Alternatives considered**: e2e-only (rejected: slower feedback, the unit sweep already exists and is the project norm).

**Output**: All decisions resolved. No open `NEEDS CLARIFICATION`.
