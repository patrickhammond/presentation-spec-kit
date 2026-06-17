# Phase 1 Data Model: Variant Picker

No database. The "data" is the in-memory variant manifest and the URL state. This documents the
shapes the picker depends on.

## Entity: Variant (extended)

Defined in `src/data/variants.js` as the values of `VARIANTS`. Existing fields kept; new `meta`
field added for the picker.

| Field         | Type    | Existing? | Description                                                             |
| ------------- | ------- | --------- | ----------------------------------------------------------------------- |
| `label`       | string  | existing  | Display name of the talk variant (e.g. "GDG Cincinnati").               |
| `entries`     | array   | existing  | Ordered deck manifest (slides + flow). Unchanged.                       |
| `meta.room`   | string  | NEW       | Room / audience the variant targets (e.g. "Community, all developers"). |
| `meta.length` | string  | NEW       | Human-readable length (e.g. "~40 min", "7-8 min").                      |
| `meta.demo`   | boolean | NEW       | Whether the variant includes a live demo.                               |

**Validation / rules**:

- Every variant key in `VARIANTS` MUST have `label` and `meta` (room, length, demo) so the picker can render it (FR-002). A missing `meta` is a defect caught by the picker unit test.
- Rendered strings in `meta` follow the constitution: curly quotes, no em dashes.
- The picker MUST iterate `VARIANTS` (the manifest) and never hold its own variant list (FR-003, SC-002).

### Current values (to populate)

| key      | label                 | meta.room                      | meta.length | meta.demo |
| -------- | --------------------- | ------------------------------ | ----------- | --------- |
| `ingage` | Ingage Lightning Talk | Internal, mixed dev + delivery | 7-8 min     | false     |
| `gdg`    | GDG Cincinnati        | Community, all developers      | ~40 min     | true      |

(Source of truth for these facts: `docs/audience-*.md`.)

## Entity: Picker selection (transient)

Not stored. Represents the act of choosing a variant.

| Field         | Type   | Description                                                      |
| ------------- | ------ | ---------------------------------------------------------------- |
| `selectedKey` | string | The chosen variant key, written to the link as `?variant=<key>`. |

**State transitions** (resolution at load and on action):

```text
load:
  no ?variant=            -> PICKER
  ?variant= known key     -> DECK(key)        (preserves hash deep-link)
  ?variant= unknown key   -> PICKER

action:
  PICKER, choose key      -> DECK(key), set ?variant=<key>, location = first slide
  DECK(key), back-to-picker -> PICKER, clear ?variant=
```

## Derived data

- **Variant order in the picker**: the declaration order of keys in `VARIANTS`. No separate ordering field needed.
