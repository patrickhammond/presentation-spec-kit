---
description: "Task list for Presenter Outline Modal"
---

# Tasks: Presenter Outline Modal

**Input**: Design documents from `specs/001-outline-modal/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included — constitution requires new behavior to ship with tests.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths in all descriptions

## Path Conventions

Single project: `src/` at repository root.

---

## Phase 1: Setup

**Purpose**: Add the `label` field to variants.js — the only prerequisite every
subsequent task depends on. Without it, OutlineModal cannot render entry titles.

- [ ] T001 Add `label` field to all 13 slide entry constants in `src/data/variants.js`
      (see data-model.md for the full label table: title → "Welcome", hook → "What's the
      Problem?", sdd → "What's Spec-Driven Development?", specKit → "What's Spec Kit?",
      requirements → "Your Spec Is Your Contract", why → "Why Should I Care?", honestClose
      → "What Am I Still Figuring Out?", whereToStart → "Where to Start?", repo → "Can I
      Get the Slides?", whatsNext → "What's Next?", whoami → "Who Am I?", demo → "Time for
      a Demo", lessons → "What I've Learned")

**Checkpoint**: `src/data/variants.js` exports entry objects with a `label` field on
every slide constant. The flow entry already has `label` — do not change it.

---

## Phase 2: User Story 1 – Open and navigate to a slide (Priority: P1) 🎯 MVP

**Goal**: The presenter presses "m", the outline modal appears with all variant entries
in order, and click or Up/Down/Enter navigates the deck to the selected entry.

**Independent Test**: Open `?variant=ingage`, press "m", verify the modal appears with
the correct entry list, click any entry, verify the deck lands there and modal closes.
See quickstart.md scenario 1.

### Implementation for User Story 1

- [ ] T002 [P] [US1] Add all `.outline-*` CSS classes to `src/index.css`: `.outline-backdrop`
      (position:fixed; inset:0; semi-transparent dark overlay), `.outline-panel` (centered
      container; light background; border-radius; max-width), `.outline-list` (list-style:none;
      margin/padding reset), `.outline-entry` (full-width button; flex row; gap; cursor:pointer),
      `.outline-entry[data-focused]` (highlight background for keyboard focus),
      `.outline-section-num` (IBM Plex Mono; dim color; fixed min-width for alignment),
      `.outline-title` (readable weight and size). All sizes in `vmin` or `em`; contrast
      ≥ 4.5:1 for all text. No inline style props.

- [ ] T003 [P] [US1] Implement `OutlineModal` component in `src/outline/OutlineModal.jsx`:
      props are `entries`, `onNavigate(index)`, `onClose`; internal state is `focusedIndex`
      (number, initialized to 0); render a `div.outline-backdrop` with `onClick={onClose}`,
      inside it a `div.outline-panel` with `role="dialog"` `aria-modal="true"` and
      `onKeyDown={handleKey}` with `onClick={e => e.stopPropagation()}`, inside it a
      `ul.outline-list` with `role="listbox"` `aria-label="Slide outline"`, with one
      `button.outline-entry` per entry (role="option", tabIndex=-1, data-type={entry.type},
      data-focused when index===focusedIndex, onClick calls onNavigate(index)); each button
      contains `span.outline-section-num` (zero-padded section or empty string) and
      `span.outline-title` (entry.label); `handleKey` responds to ArrowDown (increment
      focusedIndex, clamp), ArrowUp (decrement, clamp), Enter (call onNavigate(focusedIndex));
      use a ref array (one ref per entry) and a useEffect to call focus() on the focused
      button when focusedIndex changes; initialize focus on the first entry on mount.

- [ ] T004 [US1] Add `outlineOpen` state to `Deck` in `src/App.jsx` and modify `Deck`'s
      `onKey` handler (inside the existing `useEffect`): at the top of `onKey`, before any
      other handling, check `e.key === "m"` — if so, call `e.preventDefault()`, toggle
      `setOutlineOpen`, and return; then check `outlineOpen` — if true and `e.key ===
"Escape"`, call `e.preventDefault()`, `setOutlineOpen(false)`, and return (this must
      come before the existing `inFlow` Escape handler so it takes priority); if
      `outlineOpen` and the key is a forward/back navigation key, call `e.preventDefault()`
      and return without advancing the deck. Add `outlineOpen` to the `useEffect` dependency
      array.

- [ ] T005 [US1] Render `<OutlineModal>` conditionally in `Deck`'s JSX in `src/App.jsx`:
      import `OutlineModal` from `./outline/OutlineModal.jsx`; inside the `.slideshow` div,
      render `{outlineOpen && <OutlineModal entries={entries} onNavigate={i => {
navigateTo(i); setOutlineOpen(false); }} onClose={() => setOutlineOpen(false)} />}`.

### Tests for User Story 1

- [ ] T006 [P] [US1] Write unit tests for `OutlineModal` in `src/outline/OutlineModal.test.jsx`
      using `render`/`fireEvent` from `@testing-library/react` and vitest: (1) renders one
      button per entry in `entries`; (2) all `entry.label` values are visible in the output;
      (3) clicking entry at index 2 calls `onNavigate(2)`; (4) pressing ArrowDown then Enter
      calls `onNavigate(1)`; (5) pressing ArrowUp when focusedIndex is 0 stays at 0 (clamp);
      (6) clicking the backdrop div calls `onClose` (not `onNavigate`); (7) clicking inside
      the panel does not call `onClose`; (8) rendered text contains no em dashes and no
      straight apostrophes in the middle of words.

**Checkpoint**: `npm test` passes. Open `?variant=ingage`, press "m" — modal appears
with correct entry list. Click or keyboard-select any entry — deck navigates there and
modal closes.

---

## Phase 3: User Story 2 – Flow entry visual distinction (Priority: P2)

**Goal**: The flow entry in the outline is visually distinguishable from slide entries
so the presenter can locate it at a glance.

**Independent Test**: Open `?variant=gdg`, press "m", verify the flow entry has a
visual badge ("interactive" or similar) not present on slide entries. Select it —
deck lands on the flow in overview state. See quickstart.md scenario 2.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Add flow-entry CSS to `src/index.css`: `.outline-entry[data-type="flow"]`
      (optional distinct background or border tint), `.outline-flow-badge` (small inline
      chip/pill; accent color — use existing `--orange` or brand accent; font-size smaller
      than body; padding; border-radius). No inline styles.

- [ ] T008 [US2] In `src/outline/OutlineModal.jsx`, inside the entry button render,
      add a `{entry.type === "flow" && <span className="outline-flow-badge">interactive</span>}`
      after `span.outline-title`. The `data-type={entry.type}` attribute was already added
      in T003; verify it is present on the flow entry button.

**Checkpoint**: Open `?variant=gdg`, press "m" — the flow entry shows the
"interactive" badge; slide entries do not. Selecting the flow entry lands on the flow
in overview state (no node focused). `npm test` still passes.

---

## Phase 4: User Story 3 – Dismiss behaviors verified (Priority: P3)

**Goal**: All three close gestures ("m" again, Escape, backdrop click) are tested
including the Escape-priority edge case when the flow has an active node.

**Independent Test**: See quickstart.md scenarios 4 and 5 (dismiss without navigating;
Escape priority in flow).

### Tests for User Story 3

- [ ] T009 [US3] Write integration tests for outline dismiss behaviors in
      `src/App.resolve.test.jsx` (alongside existing App tests, using the same `visit()`
      helper): (1) given `?variant=ingage`, simulate keydown "m" — assert `.outline-backdrop`
      is present; simulate keydown "m" again — assert `.outline-backdrop` is absent and
      the current slide text is unchanged; (2) open modal, simulate keydown "Escape" —
      assert modal gone, deck unchanged; (3) open modal, fireEvent.click the `.outline-backdrop`
      element — assert modal gone; (4) navigate to the flow (simulate ArrowRight until
      inFlow), click a flow node (or simulate a step activation), open modal with "m",
      simulate Escape — assert modal gone and deck is still on the flow entry (the flow node
      state is not cleared by the Escape that closed the modal).

**Checkpoint**: `npm test` passes including all new dismiss tests.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: DoD gate and any final cleanup.

- [ ] T010 [P] Verify no visible outline trigger exists in the deck UI: open
      `?variant=ingage` and `?variant=gdg`, inspect the slide chrome (corners, dot nav,
      any overlay) — confirm no button, label, hint text, or keyboard legend references
      the outline or "m" key. No code change expected; this is a manual verification step.

- [ ] T011 Run full DoD gate from repo root: `npm run lint && npm run format && npm test
&& npm run build` — all four MUST pass with zero new failures or warnings before the
      feature is considered done.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Depends on T001 (label field must exist)
  - T002 and T003 can start in parallel after T001
  - T004 depends on T003 (OutlineModal must exist to import)
  - T005 depends on T004 (state must exist before rendering)
  - T006 (tests) can start after T003 and T005 both complete
- **US2 (Phase 3)**: Depends on T003 and T005 (component and render must exist)
  - T007 and T008 can run in parallel
- **US3 (Phase 4)**: Depends on T004 and T005 (keyboard handler and render must exist)
- **Polish (Phase 5)**: Depends on all prior phases complete

### Parallel Opportunities

```bash
# After T001 completes, launch in parallel:
Task: "T002 Add .outline-* CSS to src/index.css"
Task: "T003 Implement OutlineModal in src/outline/OutlineModal.jsx"

# After T003 completes:
Task: "T004 Wire outlineOpen state and keyboard handler in src/App.jsx"

# After T004 completes:
Task: "T005 Render OutlineModal in Deck's JSX in src/App.jsx"

# After T003 + T005 complete, launch in parallel:
Task: "T006 Write OutlineModal unit tests in src/outline/OutlineModal.test.jsx"
Task: "T007 Add flow-entry CSS to src/index.css"
Task: "T008 Add flow badge to OutlineModal in src/outline/OutlineModal.jsx"

# After T004 + T005 complete:
Task: "T009 Write dismiss integration tests in src/App.resolve.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: T001 (label field)
2. Complete Phase 2: T002 → T003 → T004 → T005 → T006
3. **STOP and VALIDATE**: Press "m" in `?variant=ingage`, navigate to a slide, dismiss.
   Run `npm test`. All passing = MVP done.

### Incremental Delivery

1. MVP (US1) → Flow badge (US2, two tasks) → Dismiss tests (US3, one task) → Polish
2. Each increment adds value without breaking prior increments.

---

## Notes

- `src/outline/` directory already exists in the repo — do not recreate it.
- The `label` field on flow entries already exists in variants.js (`label: "What's The
Process?"`) — do not modify it, only add labels to slide entries.
- Constitution Principle I: zero inline `style={{}}` props. All visual values in CSS.
- Constitution Principle VI: no FR-/SC-/US-/T-IDs in source files or comments.
- The `onKey` effect in App.jsx has dependency `[inFlow, activeId, entries.length]` —
  add `outlineOpen` to this array in T004 or the "m" toggle will capture a stale value.
