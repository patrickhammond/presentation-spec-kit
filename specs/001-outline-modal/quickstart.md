# Quickstart Validation: Presenter Outline Modal

**Feature**: 001-outline-modal
**Date**: 2026-06-17

---

## Prerequisites

- `npm install` completed
- Dev server running: `npm run dev` (http://localhost:5173)

---

## Scenario 1: Open and navigate to a slide (P1)

1. Open `http://localhost:5173?variant=ingage` in a browser.
2. Press `m`. The outline modal appears over the current slide.
3. Verify the modal lists every entry in the ingage variant in order, with section
   numbers on numbered entries and no number on the title/creed rows.
4. Click any numbered entry. The deck jumps to that slide. The modal closes.
5. Press `m` again. Verify the outline reopens on the new current slide (deck has not
   reset to the title).

**Expected**: Modal opens, entry list matches the ingage manifest order, click navigates.

---

## Scenario 2: Navigate to the interactive flow (P2)

1. Open `http://localhost:5173?variant=gdg`.
2. Press `m`. Locate the flow entry in the outline — it should have a visual badge
   (e.g. "interactive") distinguishing it from slide entries.
3. Click the flow entry. The deck navigates to the React Flow canvas in overview state
   (no node highlighted). The modal closes.

**Expected**: Flow entry is visually distinct; selecting it lands on the flow overview.

---

## Scenario 3: Keyboard navigation (P1 + P2)

1. Open any variant. Press `m`.
2. Press `ArrowDown` several times. Verify focus moves down the list (visible focus
   indicator on each entry).
3. Press `ArrowUp` to move back up.
4. Press `Enter` on any entry. Verify the deck navigates there and the modal closes.

**Expected**: Up/Down move focus; Enter selects the focused entry.

---

## Scenario 4: Dismiss without navigating (P3)

1. Open any variant at any slide. Note the current slide.
2. Press `m`. Modal opens.
3. Press `m` again. Modal closes. Deck is still on the same slide.
4. Press `m`. Modal opens.
5. Press `Escape`. Modal closes. Deck unchanged.
6. Press `m`. Modal opens.
7. Click outside the modal panel (on the backdrop). Modal closes. Deck unchanged.

**Expected**: All three close gestures dismiss the modal without moving the deck.

---

## Scenario 5: Escape priority while in the flow (P3 edge case)

1. Open `http://localhost:5173?variant=gdg`.
2. Navigate to the flow (arrow keys or dot nav).
3. Click a flow node to activate it.
4. Press `m`. Modal opens.
5. Press `Escape`. Modal closes. The flow node remains active (Escape was consumed
   by the modal, not forwarded to the flow overview handler).

**Expected**: Escape closes the modal; the flow state is unchanged.

---

## Scenario 6: Variant coverage (SC-002)

1. Open `http://localhost:5173?variant=ingage`. Press `m`. Count entries — should
   match the ingage arc in `src/data/variants.js`.
2. Navigate to `http://localhost:5173?variant=gdg`. Press `m`. Count entries — should
   match the gdg arc (a superset of ingage, with whoami, demo, lessons added).

**Expected**: Entry counts and order match each variant manifest exactly.

---

## Scenario 7: No visible trigger (SC-003)

1. Open either variant. Inspect the full slide chrome (corners, nav dots, any overlays).
2. Verify there is no button, label, hint, or keyboard shortcut legend referencing the
   outline or the `m` key.

**Expected**: The outline is fully hidden from the audience view.

---

## Gate checks

Run before marking the feature done:

```
npm run lint
npm run format
npm test
npm run build
```

All four MUST pass with no new failures.
