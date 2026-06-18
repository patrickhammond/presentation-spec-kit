# Contract: OutlineModal Component

**File**: `src/outline/OutlineModal.jsx`
**Date**: 2026-06-17

---

## Interface

```jsx
<OutlineModal
  entries={entries} // Array<ManifestEntry> — full variant entry list
  onNavigate={fn} // (index: number) => void — navigate + close
  onClose={fn} // () => void — close without navigating
/>
```

## Rendering contract

- Renders a full-viewport backdrop (`div.outline-backdrop`) with `onClick={onClose}`.
- Inside the backdrop, renders a panel (`div.outline-panel`) with
  `onClick={e => e.stopPropagation()}` so clicks inside do not bubble to the backdrop.
- Inside the panel, renders a `ul.outline-list` with one `button.outline-entry` per entry.
- Each button renders:
  - `span.outline-section-num` — zero-padded section number (e.g. "01") if the entry
    has a `section` field; empty otherwise.
  - `span.outline-title` — `entry.label` (required field on all entries after this change).
  - `span.outline-flow-badge` (flow entries only) — a text badge marking the entry as
    interactive (e.g. "interactive").
- Each button has `data-type={entry.type}` and `data-focused` when it is the focused entry.
- Each button has `tabIndex={-1}` (removed from tab order; focus managed programmatically).

## Keyboard contract (internal to OutlineModal)

The panel element handles `onKeyDown`:

| Key       | Effect                                         |
| --------- | ---------------------------------------------- |
| ArrowDown | Increment `focusedIndex` (clamp to last entry) |
| ArrowUp   | Decrement `focusedIndex` (clamp to 0)          |
| Enter     | Call `onNavigate(focusedIndex)`                |

Escape and "m" are handled by Deck's global `onKey` (not this component).

## Focus contract

- On mount (modal opens), `focusedIndex` starts at 0 and the first button receives
  programmatic `focus()`.
- `focusedIndex` changes cause the corresponding button to receive `focus()` via a
  `useEffect` + ref array.
- On unmount (modal closes), focus returns to the document body or the previously
  focused element (browser default).

## Accessibility contract

- `ul.outline-list` has `role="listbox"` and `aria-label="Slide outline"`.
- Each `button.outline-entry` has `role="option"` and
  `aria-selected={index === focusedIndex}`.
- The panel has `aria-modal="true"` and `role="dialog"`.

## What this component does NOT do

- Does not handle "m" or Escape — those belong to Deck's global handler.
- Does not advance or retreat the deck directly — it calls `onNavigate(index)`, and
  Deck's `navigateTo` handles bounds clamping and `setActiveId(null)`.
- Does not read `VARIANTS` or `variantKey` — entries are passed in as props.
- Does not render any UI element visible outside its own mounted state (no permanent
  button, hint, or tooltip in the deck chrome).
