# Data Model: Presenter Outline Modal

**Feature**: 001-outline-modal
**Date**: 2026-06-17

---

## Manifest entry shape (extended)

All entries in `src/data/variants.js` gain an explicit `label` field. This is the
display string shown in the outline. The flow entry already carries this field; slide
entries currently do not.

### Slide entry (updated)

```
{
  type: "slide",
  id: string,           // key into SLIDE_REGISTRY
  slug: string,         // URL hash segment
  label: string,        // NEW: human-readable display title for OutlineModal
  numbered?: false,     // omit = numbered; false = unnumbered (no section counter)
  props?: object,       // per-variant copy passed to the slide component
  // after withSections():
  section?: number,     // assigned by withSections(); absent for numbered: false entries
}
```

**Labels to add** (all entries in variants.js):

| id           | label                             |
| ------------ | --------------------------------- |
| title        | "Welcome"                         |
| whoami       | "Who Am I?"                       |
| requirements | "Your Spec Is Your Contract"      |
| hook         | "What's the Problem?"             |
| sdd          | "What's Spec-Driven Development?" |
| specKit      | "What's Spec Kit?"                |
| whereToStart | "Where to Start?"                 |
| demo         | "Time for a Demo"                 |
| why          | "Why Should I Care?"              |
| lessons      | "What I've Learned"               |
| honestClose  | "What Am I Still Figuring Out?"   |
| repo         | "Can I Get the Slides?"           |
| whatsNext    | "What's Next?"                    |

### Flow entry (unchanged shape, label already present)

```
{
  type: "flow",
  slug: "spec-kit-flow",
  label: "What's The Process?",
  // after withSections():
  section: number,
}
```

---

## OutlineModal component interface

**File**: `src/outline/OutlineModal.jsx`

### Props

| Prop         | Type                      | Description                                     |
| ------------ | ------------------------- | ----------------------------------------------- |
| `entries`    | `Array<ManifestEntry>`    | Full ordered entry list from the active variant |
| `onNavigate` | `(index: number) => void` | Navigate deck to `index` and close modal        |
| `onClose`    | `() => void`              | Close modal without changing deck position      |

### Internal state

| State          | Type     | Initial | Description                        |
| -------------- | -------- | ------- | ---------------------------------- |
| `focusedIndex` | `number` | `0`     | Which entry row has keyboard focus |

### Behaviour invariants

- `focusedIndex` is clamped to `[0, entries.length - 1]`.
- ArrowDown increments `focusedIndex`; ArrowUp decrements (both clamp).
- Enter calls `onNavigate(focusedIndex)`.
- Escape and "m" key are handled in Deck's global handler, not inside the modal.

---

## Deck state additions (in App.jsx)

| State         | Type      | Initial | Description                          |
| ------------- | --------- | ------- | ------------------------------------ |
| `outlineOpen` | `boolean` | `false` | Whether the outline modal is visible |

### Modified keyboard handler logic (Deck `onKey`)

Events handled before existing deck navigation logic:

```
"m" key:
  → toggle outlineOpen (preventDefault)
  → return (skip all other handling)

When outlineOpen is true:
  Escape:
    → setOutlineOpen(false) (preventDefault)
    → return (do NOT forward to flow handler)
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space:
    → preventDefault(), return (suppress deck navigation)
```

The outline modal's internal Up/Down/Enter handler runs on the panel element
via React's synthetic `onKeyDown`, not the global window listener, so there
is no double-handling.

---

## CSS classes (new, all in src/index.css)

| Class                              | Element    | Purpose                                         |
| ---------------------------------- | ---------- | ----------------------------------------------- |
| `.outline-backdrop`                | `<div>`    | Full-viewport overlay; backdrop click closes    |
| `.outline-panel`                   | `<div>`    | Scrollable list container; centered on viewport |
| `.outline-list`                    | `<ul>`     | Ordered list of entries                         |
| `.outline-entry`                   | `<button>` | Single entry row; keyboard-focusable            |
| `.outline-entry[data-type="flow"]` | `<button>` | Flow entry variant styling                      |
| `.outline-entry[data-focused]`     | `<button>` | Keyboard-focused entry highlight                |
| `.outline-section-num`             | `<span>`   | Section counter ("01", "02", …) or blank        |
| `.outline-title`                   | `<span>`   | Entry label text                                |
| `.outline-flow-badge`              | `<span>`   | "interactive" badge on the flow entry           |
