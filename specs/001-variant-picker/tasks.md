---
description: "Task list for Variant Picker implementation"
---

# Tasks: Variant Picker

**Input**: Design documents from `specs/001-variant-picker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/url-variant-contract.md

**Tests**: Included. This project enforces `npm test` (Vitest + jest-axe) as a constitution gate, and the spec calls out keyboard/assistive-technology requirements, so each story carries a test task.

**Organization**: Grouped by user story (US1 P1, US2 P2, US3 P3) so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3 (setup, foundational, polish carry no story label)

## Path Conventions

Single-project SPA: `src/` and `tests/` at the repository root (per plan.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Make room for the new module.

- [x] T001 Create the `src/picker/` directory (sibling of `src/slides/` and `src/flow/`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The data and resolution plumbing every user story depends on. MUST complete before Phase 3+.

- [x] T002 Extend each variant in `src/data/variants.js` with a `meta` object (`room`, `length`, `demo`) using the values in `specs/001-variant-picker/data-model.md` (ingage: "Internal, mixed dev + delivery" / "7-8 min" / false; gdg: "Community, all developers" / "~40 min" / true). Use curly quotes, no em dashes.
- [x] T003 In `src/data/variants.js`, add an `isKnownVariant(key)` helper (true only for keys in `VARIANTS`) and export it; keep `DEFAULT_VARIANT` and `resolveVariant` but stop using `resolveVariant` for the no-param case. Single source of truth for "what variants exist."
- [x] T004 In `src/App.jsx`, compute a load-time mode from `?variant=`: no param or unknown key -> `picker`; known key -> `deck`. Use `isKnownVariant`. Do not silently apply `DEFAULT_VARIANT` on the no-param path. (Behavior per case is refined and tested in the story phases.)

**Checkpoint**: variants carry display metadata and App can tell picker mode from deck mode.

---

## Phase 3: User Story 1 - Presenter chooses a talk before starting (Priority: P1) 🎯 MVP

**Goal**: With no variant specified, show a picker listing every variant; selecting one opens that talk.

**Independent Test**: Open the app with no `?variant=`; confirm a picker lists all variants with name/room/length/demo; select one and confirm that talk opens at its first slide with `?variant=<key>` in the address.

- [x] T005 [US1] Create `src/picker/VariantPicker.jsx`: render one selectable native control per entry in `VARIANTS` (in declaration order), each showing `label`, `meta.room`, `meta.length`, and a live-demo indicator from `meta.demo`. Read the manifest; hardcode no variant list. Props: `onSelect(key)`. Curly quotes, no em dashes.
- [x] T006 [US1] Add `.picker-*` styles to `src/index.css`: vmin-scaled type, 16:10 layout, Ingage Warm White light theme, focus-visible states, contrast >= 4.5:1. No inline styles in the component; pass any per-render value as a CSS custom property.
- [x] T007 [US1] In `src/App.jsx`, render `<VariantPicker>` when mode is `picker`; on `onSelect(key)`, set `?variant=<key>` and enter the deck at its first slide (reset in-deck location).
- [x] T008 [US1] In `src/App.jsx`, add a "back to picker" affordance available within a talk (FR-011): clear `?variant=` so resolution returns to picker mode. Keyboard reachable, labeled.
- [x] T009 [P] [US1] Create `src/picker/VariantPicker.test.jsx`: render the picker, assert one control per `VARIANTS` key with its `label`/`meta`, jest-axe clean, no straight quotes (`/[A-Za-z]'[A-Za-z]/`), no em dashes, and every control keyboard-focusable.

**Checkpoint**: US1 is a usable MVP on its own (picker shows, choosing works, you can return to it).

---

## Phase 4: User Story 2 - Shared link opens its talk directly (Priority: P2)

**Goal**: A valid `?variant=` (with or without a hash) opens the talk directly, no picker. No regression.

**Independent Test**: Open `?variant=ingage` -> Ingage deck, no picker. Open `?variant=gdg#whats-sdd` -> GDG deck at that slide.

- [x] T010 [US2] Verify/adjust `src/App.jsx` resolution so a known `?variant=` enters the deck directly and the existing hash deep-link (`#slug`, `#spec-kit-flow/<id>`) still resolves within the chosen variant. No picker shown.
- [x] T011 [P] [US2] Add a resolution test (e.g. in `src/picker/VariantPicker.test.jsx` or a new `src/App.resolve.test.jsx`): known key -> deck mode; known key + hash -> deck mode preserving the hash; assert picker is not shown.

**Checkpoint**: deep links behave exactly as before US1 landed.

---

## Phase 5: User Story 3 - Unknown variant is recoverable, not silent (Priority: P3)

**Goal**: An unknown `?variant=` shows the picker instead of an arbitrary talk.

**Independent Test**: Open `?variant=zzz` -> picker shown.

- [x] T012 [US3] Confirm `src/App.jsx` resolution routes an unknown `?variant=` to picker mode (covered by T004's `isKnownVariant` check); ensure no console error and no arbitrary deck.
- [x] T013 [P] [US3] Add a resolution test: unknown key -> picker mode (not deck, not a default variant).

**Checkpoint**: all three resolution cases (none / known / unknown) verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T014 [P] Update `docs/tech-stack.md` (project structure + a line on picker resolution) and the `src/data/variants.js` header comment to document the `meta` field and picker-driven resolution.
- [ ] T015 [P] Optionally extend `tests/a11y.spec.js` with a Playwright check of the picker route (no axe violations, keyboard select).
- [x] T016 Run `npm run lint`, `npm test`, and `npm run build`; confirm all green and the rendered-copy audit (`grep -rnE "[A-Za-z]'[A-Za-z]" src` over visible strings) is clean. Walk `specs/001-variant-picker/quickstart.md` scenarios.

---

## Dependencies & Execution Order

- **Setup (T001)** -> **Foundational (T002-T004)** -> stories.
- **US1 (T005-T009)** depends on Foundational; it is the MVP.
- **US2 (T010-T011)** and **US3 (T012-T013)** depend on Foundational (T004) and are largely verification of the resolution rule; they can follow US1 in any order.
- **Polish (T014-T016)** last.

## Parallel Opportunities

- T009, T011, T013 (tests in distinct files) can be written in parallel once their feature code exists.
- T014 and T015 (docs / e2e) are independent of each other.

## Implementation Strategy

- **MVP = Phase 1 + Phase 2 + Phase 3 (US1).** That alone delivers the picker and selection.
- US2 and US3 are mostly guardrail tests around the foundational resolution rule; deliver them right after US1 to lock in "no regression" and "no silent fallback."

## Summary

- **Total tasks**: 16 (Setup 1, Foundational 3, US1 5, US2 2, US3 2, Polish 3).
- **MVP scope**: US1 (T001-T009).
- **Per story**: US1 = 5, US2 = 2, US3 = 2.
