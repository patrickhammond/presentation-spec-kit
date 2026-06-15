# Contract: URL + Variant Metadata

The picker has two contracts: the URL behavior (how the address maps to picker vs. deck) and the
variant-metadata shape the picker reads. Both are internal to the SPA (no external API).

## Contract A: URL resolution

The deck address is `/<path>?variant=<key>#<location>`. Resolution at load:

| Input                                  | Result                     | Notes                             |
| -------------------------------------- | -------------------------- | --------------------------------- |
| no `variant` param                     | Show picker                | FR-001. Was: silent default.      |
| `variant=ingage` (known)               | Open `ingage` deck         | FR-006. Direct, no picker.        |
| `variant=gdg#whats-sdd` (known + hash) | Open `gdg` at `#whats-sdd` | FR-007. Hash deep-link preserved. |
| `variant=zzz` (unknown)                | Show picker                | FR-008. No silent fallback.       |

Actions:

| From   | Action         | Result                                                                        |
| ------ | -------------- | ----------------------------------------------------------------------------- |
| Picker | choose `<key>` | Address becomes `?variant=<key>`, deck opens at first slide (FR-004, FR-005). |
| Deck   | back to picker | `variant` param cleared, picker shown (FR-011).                               |

**Invariants**:

- A captured address always reopens to the same place: a `?variant=<known>` link to a deck, a no-param link to the picker (edge case: re-sharing from the picker).
- Resolution is pure with respect to the address: same address in, same screen out.

## Contract B: Variant metadata shape (consumed by the picker)

The picker reads `VARIANTS` from `src/data/variants.js`. Each value MUST satisfy:

```text
Variant {
  label:  string        // required, display name
  meta: {
    room:   string      // required
    length: string      // required
    demo:   boolean     // required
  }
  entries: array        // required (existing); used to find the first slide on select
}
```

**Consumer guarantees**:

- The picker renders one selectable control per key in `VARIANTS`, in declaration order, showing `label`, `meta.room`, `meta.length`, and a demo indicator derived from `meta.demo`.
- The picker adds no variant of its own and assumes nothing about specific keys, so adding a variant to `VARIANTS` is sufficient to list it (FR-003, SC-002).

**Producer guarantees** (`variants.js`):

- Every variant defines `label` and a complete `meta`. Rendered strings use curly quotes and no em dashes.

## Verification

- Unit: render the picker, assert one control per `VARIANTS` key with its `label`/`meta`; jest-axe clean; no straight quotes.
- Unit/integration: resolution table above (no param -> picker; known -> deck; known+hash -> deck at hash; unknown -> picker).
- Manual / e2e: `quickstart.md` scenarios.
