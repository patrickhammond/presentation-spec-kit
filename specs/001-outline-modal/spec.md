# Feature Specification: Presenter Outline Modal

**Feature Branch**: `001-outline-modal`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "Add a hidden 'outline' overlay to the deck. When the presenter presses the 'o' key, a modal opens listing every entry in the current talk variant in order — section number, title, and a marker for the interactive flow — so I can jump directly to any slide or to the flow during a talk. Selecting an entry navigates the deck there and closes the modal. Pressing 'o' again or Escape closes it. It is presenter-only: there is no visible button or hint that it exists. It must work for any variant, reading the entry list from the variant manifest rather than a hardcoded list."

_(Key binding clarified to "m" — see Clarifications below.)_

---

## Clarifications

### Session 2026-06-17

- Q: What key should trigger the outline modal? → A: "m" (not "o" as in the original description)
- Q: Should clicking outside the modal (on the slide backdrop) close it? → A: Yes, clicking outside closes the outline modal
- Q: Is keyboard navigation within the outline list (Up/Down to move, Enter to select) required or a nice-to-have? → A: Required

---

## User Scenarios & Testing

### User Story 1 – Jump to a slide during a talk (Priority: P1)

The presenter is mid-talk and needs to skip ahead or back to a specific slide
(for example, a question comes up that the next slide answers). They press "m",
the outline overlay appears showing all entries in the active variant in order,
they click or use Up/Down/Enter to select the target entry, and the deck jumps
there immediately. The modal closes.

**Why this priority**: The core use case. All other stories are secondary to
this instant-navigation need.

**Independent Test**: Open any variant, press "m", verify the outline appears,
click any entry, verify the deck lands on that entry and the modal closes.

**Acceptance Scenarios**:

1. **Given** a deck is open at any slide, **When** the presenter presses "m",
   **Then** the outline modal opens without moving the deck.
2. **Given** the outline is open, **When** the presenter selects any slide
   entry, **Then** the deck navigates to that slide and the modal closes.
3. **Given** the outline is open, **When** the presenter selects an unnumbered
   entry (title, creed), **Then** the deck navigates to it and the modal closes.

---

### User Story 2 – Jump to the interactive flow during a talk (Priority: P2)

The presenter wants to jump directly to the interactive flow from anywhere in
the deck. They press "m", the outline opens, and the flow entry is visually
distinguished (a marker) so it is easy to locate. Selecting it navigates the
deck to the flow at its overview state (no node active) and closes the modal.

**Why this priority**: The flow is the centerpiece of the GDG talk and a
landmark entry during the ingage talk. Direct access to it from any point in
the deck is time-critical on stage.

**Independent Test**: Open any variant that has a flow entry, press "m", verify
the flow entry has a distinct visual marker, click it, verify the deck lands on
the flow in overview state and the modal closes.

**Acceptance Scenarios**:

1. **Given** the outline is open, **When** the presenter selects the flow
   entry, **Then** the deck navigates to the flow in overview state (no node
   focused) and the modal closes.
2. **Given** a variant whose manifest includes a flow entry, **When** the
   outline opens, **Then** the flow entry is visually distinguishable from
   slide entries.

---

### User Story 3 – Dismiss the outline without navigating (Priority: P3)

The presenter opens the outline accidentally or decides not to jump. They press
"m" again, press Escape, or click outside the modal and the modal closes
without changing the deck position.

**Why this priority**: Important for confidence on stage — the presenter must
be able to open and safely abort the outline.

**Independent Test**: Open the outline, press "m" again, verify the modal
closes and the deck is unchanged. Repeat with Escape and with a click outside
the modal.

**Acceptance Scenarios**:

1. **Given** the outline is open, **When** the presenter presses "m",
   **Then** the modal closes and the deck remains on the same entry.
2. **Given** the outline is open, **When** the presenter presses Escape,
   **Then** the modal closes and the deck remains on the same entry.
3. **Given** the outline is open, **When** the presenter clicks outside the
   modal panel (on the backdrop), **Then** the modal closes and the deck
   remains on the same entry.
4. **Given** the deck is in the flow with a node active and the outline is
   open, **When** the presenter presses Escape, **Then** the modal closes
   (Escape is consumed by the modal, not forwarded to the flow).

---

### Edge Cases

- What happens when "m" is pressed on the variant picker (not inside a deck)?
  The outline does not open; it is scoped to an active deck only.
- What happens when the outline is open and arrow keys or space are pressed?
  These keys do not advance or retreat the deck; the modal absorbs or ignores
  them (no accidental slide change while scanning the outline).
- What happens when a variant has no flow entry?
  The outline renders only slide entries; no flow row appears.
- What happens if the manifest adds new entry types in the future?
  The outline renders all entries in order, showing whatever label is available,
  so future entry types appear without code changes to the modal.

---

## Requirements

### Functional Requirements

- **FR-001**: The deck MUST open the outline modal when the presenter presses
  "m" and the modal is not currently open.
- **FR-002**: The deck MUST close the outline modal when the presenter presses
  "m" and the modal is currently open, without changing the deck position.
- **FR-003**: The deck MUST close the outline modal when the presenter presses
  Escape and the modal is currently open, consuming the Escape event so it is
  not also processed by the flow or any other handler.
- **FR-004**: The outline modal MUST display every entry in the active variant
  in the order they appear in the variant manifest.
- **FR-005**: Each entry in the outline MUST display its section number for
  numbered entries. Unnumbered entries (title, creed, who-am-I) MUST still
  appear in the list but without a section number.
- **FR-006**: Each entry in the outline MUST display a human-readable title
  derived from the entry's manifest data (no hardcoded per-entry strings outside
  the manifest).
- **FR-007**: The flow entry MUST carry a visual marker that distinguishes it
  from slide entries (e.g., a text label, icon, or typographic treatment).
- **FR-008**: Selecting any entry in the outline MUST navigate the deck to that
  entry and close the modal. For the flow entry, the deck MUST land in flow
  overview state (no node focused).
- **FR-009**: The outline modal MUST have no corresponding visible trigger in
  the deck UI: no button, tooltip, hint text, or keyboard legend referencing it.
- **FR-010**: The "m" key binding MUST be a no-op on the variant picker screen
  (the outline is a deck-only feature).
- **FR-011**: While the outline modal is open, arrow keys, space, and other
  deck navigation keys MUST NOT advance or retreat the deck.
- **FR-012**: The deck MUST close the outline modal when the presenter clicks
  on the backdrop area outside the modal panel, without changing the deck
  position.
- **FR-013**: The outline modal MUST support keyboard navigation: Up/Down arrow
  keys move focus through the entry list; Enter selects the focused entry,
  navigating the deck to it and closing the modal.

### Key Entities

- **Variant manifest entry**: The unit of navigation: either a slide (with id,
  slug, section number, optional label) or the interactive flow (with label and
  slug). The manifest is the single source of truth; the outline reads from it
  directly.
- **Outline modal**: The overlay UI shown to the presenter. Invisible to the
  audience in normal use. Contains the ordered entry list and handles its own
  open/close state.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: The presenter can navigate to any entry in a 10-slide deck in
  under 3 seconds from the moment they press "m" to the deck landing on the
  target entry.
- **SC-002**: The outline renders the correct entry list for every existing
  variant (ingage, gdg) with zero hardcoded entry data outside the manifest.
- **SC-003**: No audience member can discover the outline feature from any
  visible element in the deck UI.
- **SC-004**: All existing lint, format, test, and build checks continue to
  pass after the feature is added (no regressions).
- **SC-005**: The outline modal itself passes contrast and readability checks
  consistent with the project's accessibility gate (≥ 4.5:1 contrast, legible
  type size), even though it is presenter-facing rather than audience-facing.

---

## Assumptions

- The "m" key is available (not currently bound to any deck action). If a
  conflict is found during implementation, the choice of key is open for
  revision.
- Keyboard navigation within the outline (Up/Down arrows to move focus through
  the list, Enter to select) is required alongside mouse/click selection. This
  is a live-presentation tool where the presenter may not have easy mouse access.
- The outline does not need to visually highlight the currently active entry,
  though it may if it does not add implementation complexity.
- Unnumbered entries (title, creed, who-am-I) appear in the outline even
  though they have no section counter, because the presenter may want to return
  to the title or opening slide.
- The modal does not persist open across slide transitions; it opens and closes
  within a single deck session.
- The display title for each entry will be derived from manifest data available
  at render time (slug, label field, or id); the specific derivation strategy
  is an implementation decision for the planning phase.
