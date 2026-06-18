# Research: Presenter Outline Modal

**Feature**: 001-outline-modal
**Date**: 2026-06-17

---

## Decision 1: Entry display title source

**Decision**: Add a `label` field to every slide entry constant in `src/data/variants.js`.

**Rationale**: The flow entry already carries `label: "What's The Process?"`. Extending
this convention to slide entries keeps the manifest the single source of truth for all
display text (Constitution Principle II). Deriving display titles by transforming slugs
(e.g., "whats-the-problem" → "What's The Problem?") would lose apostrophes and produce
unreadable output for some slugs ("quote-requirements" → "Quote Requirements"). An
explicit label field is unambiguous, matches the flow pattern already in use, and requires
no runtime string manipulation.

**Alternatives considered**:

- Slug transform (replace hyphens, capitalize): rejected — lossy for apostrophes and
  multi-word slugs; produces "Whats The Problem" instead of "What's the Problem?".
- Title-from-SLIDE_REGISTRY: rejected — putting display strings in SlideShow.jsx
  scatters display concerns across files when variants.js is the manifest SoT.
- Hardcoded map in OutlineModal: rejected — violates Constitution Principle II (no
  hardcoded per-entry strings outside the manifest).

---

## Decision 2: Component location

**Decision**: New file `src/outline/OutlineModal.jsx`.

**Rationale**: The existing pattern uses one directory per major feature area
(flow/, picker/, slides/). A dedicated `src/outline/` directory follows that convention
and keeps App.jsx from growing. The component has no dependencies on the flow or slides
internals; it receives only manifest entries and callbacks.

**Alternatives considered**:

- Inline in App.jsx: rejected — App.jsx is already complex; adding a 100+ line modal
  component to it would hurt readability and mix concerns.
- src/components/OutlineModal.jsx: rejected — no generic "components" directory exists
  in this project; the feature-area-directory pattern is clearer.

---

## Decision 3: Keyboard event ownership

**Decision**: The "m" key toggle and Escape-while-open are handled in Deck's existing
global `onKey` handler in App.jsx. Up/Down/Enter list navigation is handled by the
OutlineModal component internally via its own `keydown` listener (or React's `onKeyDown`
on the panel element).

**Rationale**: Deck's `onKey` already owns all global deck keyboard shortcuts. Adding
"m" there keeps the routing logic centralized. However, Up/Down/Enter within the list
are list-internal interactions — they belong in OutlineModal, which can track the
focused index as its own state. When the modal is open, Deck's handler must suppress
ArrowUp/Down/Left/Right and Space so they don't advance the deck while the presenter
is scanning the outline.

**Alternatives considered**:

- All keyboard handling in Deck: rejected — OutlineModal's focused-index state would
  need to be lifted into Deck, coupling Deck to modal internals unnecessarily.
- All keyboard handling in OutlineModal: rejected — the "m" toggle fires when the modal
  is _closed_, so it cannot be owned by the modal itself.

---

## Decision 4: Focus management strategy

**Decision**: OutlineModal tracks a `focusedIndex` state (initialized to 0 on open).
Each list item renders as a `<button>` with `tabIndex={-1}`. A `useEffect` applies
`focus()` to the correct button via a ref array whenever `focusedIndex` changes.

**Rationale**: Roving tabIndex with programmatic focus gives predictable behavior across
browsers. The buttons are real interactive elements so they receive native focus styling
and screen-reader semantics without extra ARIA. `tabIndex={-1}` removes them from the
tab order (presenter navigates via Up/Down/Enter, not Tab), which is correct for a
keyboard-list pattern.

**Alternatives considered**:

- `aria-activedescendant` pattern: rejected — more complex, requires `role="listbox"` +
  `role="option"`, and provides no benefit for a simple linear list.
- Tab-key navigation within list: rejected — Tab should be reserved for advancing through
  focus traps; the spec requires Up/Down/Enter, not Tab.

---

## Decision 5: Backdrop click implementation

**Decision**: The backdrop is a full-viewport `<div>` rendered behind the panel. An
`onClick` on the backdrop calls `onClose`. The panel itself has `onClick` with
`e.stopPropagation()` so clicks inside the panel do not bubble to the backdrop.

**Rationale**: Standard modal pattern. Requires no special coordinate math. CSS positions
the backdrop at `position: fixed; inset: 0` behind the panel.

**Alternatives considered**:

- Single element with `onClick`, check `e.target === e.currentTarget`: functionally
  equivalent but more fragile if the panel layout nests elements.

---

## Decision 6: "m" key conflict check

**Decision**: "m" is not currently bound to any action in Deck's keyboard handler
(which only responds to ArrowRight, ArrowDown, Space, ArrowLeft, ArrowUp, Escape, Home).
No conflict exists. The binding is safe.

**Research**: Reviewed App.jsx `onKey` handler — only arrow keys, space, Escape, and
Home are handled. The VariantPicker has no keyboard listener of its own. "m" is free.

---

## Decision 7: Styling approach for the modal

**Decision**: All styles in `src/index.css` using new class names prefixed with
`outline-`. No inline style props (Constitution Principle I). The overlay uses a
semi-transparent dark background to separate the modal from the slide. Panel uses the
existing brand palette (off-white background, dark text, sufficient contrast).

**Rationale**: Constitution Principle I mandates all styling in src/index.css. The
existing stylesheet uses a flat class-name convention (`.slide-dots`, `.sl-label`,
`.detail-panel`, etc.). Prefixing with `outline-` avoids collisions.
