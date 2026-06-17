# Feature Specification: Variant Picker

**Feature Branch**: `claude/demo-variant-picker`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Add a variant picker landing screen for the talk deck. Today the deck chooses which talk variant to present from a ?variant= query parameter and silently falls back to a default variant (ingage) when none is given. Instead, when no variant is specified, present a picker screen that lists every available talk variant with its name, room/audience, length, and whether it includes a live demo, and lets the presenter choose which one to run."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Presenter chooses a talk before starting (Priority: P1)

A presenter opens the deck without having decided, or without typing, a specific variant. Instead of being dropped into one talk by default, they see a landing screen that lists every available talk variant. Each option shows enough to tell them apart at a glance: its name, the room or audience it is for, its length, and whether it includes a live demo. The presenter picks one and the deck opens that talk at its first slide.

**Why this priority**: This is the core value. The presenter runs more than one version of this talk (a long community talk, a short lightning talk, client versions) and needs to choose the right one on the spot, often from a podium, without editing a link. Without this, choosing means knowing and hand-editing a variant code, which is error-prone on stage.

**Independent Test**: Open the deck with no variant specified and confirm a picker listing all variants appears; select one and confirm the matching talk opens at its first slide. Delivers value on its own even if nothing else changes.

**Acceptance Scenarios**:

1. **Given** the deck is opened with no variant specified, **When** the landing screen loads, **Then** it lists every available variant, each showing name, room/audience, length, and whether it includes a live demo.
2. **Given** the picker is showing, **When** the presenter chooses a variant, **Then** that talk opens at its first slide and the choice is reflected in the shareable link so the same talk reopens directly next time.
3. **Given** the picker is showing, **When** the presenter navigates and selects entirely by keyboard, **Then** they can reach and choose any variant without a pointer.

---

### User Story 2 - Shared link opens its talk directly (Priority: P2)

Someone opens a link that already names a specific, valid variant (for example a link shared after the talk, or a presenter's pre-set link). They go straight into that talk, with no picker in the way, exactly as today.

**Why this priority**: The deck is shared afterward as a leave-behind and presenters pre-stage links. Breaking direct, deep-linked access would regress existing behavior and annoy everyone who already has a link. It is second only to the picker itself.

**Independent Test**: Open a link naming a known variant and confirm the talk opens directly at the expected location with no picker shown.

**Acceptance Scenarios**:

1. **Given** a link that names a valid variant, **When** it is opened, **Then** that talk opens directly and the picker is not shown.
2. **Given** a link that names a valid variant and a specific spot in the deck, **When** it is opened, **Then** it opens at that spot, preserving today's deep-linking.

---

### User Story 3 - Unknown variant is recoverable, not silent (Priority: P3)

Someone opens a link naming a variant that does not exist (a typo, a renamed or retired variant). Instead of silently showing some other talk, the deck shows the picker so the person can choose a real one.

**Why this priority**: Silent fallback hides mistakes and can put the wrong talk on screen without anyone noticing. Showing the picker makes the error visible and immediately recoverable. It is lower priority because it is an error path, not the common case.

**Independent Test**: Open a link naming a nonexistent variant and confirm the picker appears rather than an arbitrary talk.

**Acceptance Scenarios**:

1. **Given** a link naming an unknown variant, **When** it is opened, **Then** the picker is shown instead of an arbitrary talk.
2. **Given** the picker is shown because of an unknown variant, **When** the presenter chooses a valid variant, **Then** that talk opens normally.

---

### Edge Cases

- **Single variant available**: the picker still behaves predictably (it lists the one variant); it does not assume more than one exists.
- **New variant added**: a newly added variant appears in the picker automatically, with no separate step to register it in the picker.
- **Returning from a talk**: a presenter who has entered a talk can get back to the picker to switch talks without manually editing the link.
- **Re-sharing from the picker**: a link captured while the picker is showing reopens to the picker, not to a default talk.
- **Long variant lists**: the picker remains readable and selectable if the number of variants grows beyond the current few.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: When no variant is specified, the system MUST present a picker screen listing every available variant rather than opening a default talk.
- **FR-002**: For each variant, the picker MUST display its name, its room/audience, its length, and whether it includes a live demo.
- **FR-003**: The list of variants in the picker MUST be derived from the existing variant definitions, so that adding or removing a variant changes the picker with no additional wiring.
- **FR-004**: When the presenter selects a variant, the system MUST open that talk at its first slide.
- **FR-005**: When a variant is selected, the system MUST reflect the choice in the shareable link so reopening the link goes straight to that talk.
- **FR-006**: When a link names a valid variant, the system MUST open that talk directly and MUST NOT show the picker.
- **FR-007**: When a link names a valid variant together with a specific spot in the deck, the system MUST open at that spot, preserving existing deep-linking.
- **FR-008**: When a link names an unknown or invalid variant, the system MUST show the picker instead of silently opening another talk.
- **FR-009**: The picker MUST be fully operable by keyboard alone, including reaching and choosing any variant.
- **FR-010**: The picker MUST be usable with assistive technology, with each variant option clearly identified and selectable.
- **FR-011**: The presenter MUST be able to return to the picker from within a talk in order to switch talks.
- **FR-012**: The picker MUST match the deck's established visual style and projected-screen readability so it reads as part of the same presentation.

### Key Entities _(include if feature involves data)_

- **Variant**: a single deliverable version of the talk. Attributes used by the picker: a display name, the room/audience it targets, its length, and whether it includes a live demo. Variants are the existing, defined set the deck already presents.
- **Picker selection**: the presenter's choice of one variant, which determines which talk opens and is carried in the shareable link.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: From a no-variant start, a presenter can identify and open the intended talk in under 10 seconds, using only what the picker shows.
- **SC-002**: 100% of defined variants appear in the picker without any per-variant picker change; adding one new variant requires no edit to the picker itself.
- **SC-003**: 100% of existing valid deep links continue to open their talk directly, at the same spot, with no picker shown (no regression).
- **SC-004**: Every variant in the picker can be reached and selected using only the keyboard.
- **SC-005**: When an unknown variant is requested, the picker is shown 100% of the time instead of an arbitrary talk.
- **SC-006**: A presenter can switch from one talk to another, via the picker, without manually editing the link.

## Assumptions

- The set of variants and their describable attributes (name, room/audience, length, whether there is a live demo) already exist and are the source the picker reads from.
- "No variant specified" replaces the previous behavior of silently defaulting to one variant; a default talk is no longer shown automatically when none is chosen.
- The shareable link remains the mechanism for reopening a specific talk and spot, so the picker integrates with it rather than replacing it.
- The picker is a presenter-facing and audience-facing screen for choosing among talks; it does not add authentication, persistence beyond the link, or per-user customization.
- Visual and accessibility expectations follow the deck's existing standards (brand light theme, projected-screen readability, sufficient contrast, keyboard and assistive-technology support).
