# Quickstart: Validate the Variant Picker

Run guide proving the feature works end to end. References `contracts/url-variant-contract.md`
and `data-model.md`; no implementation code here.

## Prerequisites

```bash
npm install
npm run dev   # http://localhost:5173
```

## Scenarios

### 1. Picker on no variant (FR-001, US1)

- Open `http://localhost:5173/` (no `?variant=`).
- Expect: the picker screen, listing every variant with name, room/audience, length, and a live-demo indicator.

### 2. Choose a variant (FR-004, FR-005)

- From the picker, select a variant.
- Expect: that talk opens at its first slide; the address now includes `?variant=<key>`; reloading reopens the same talk directly.

### 3. Direct deep link still works (FR-006, FR-007, US2 - no regression)

- Open `http://localhost:5173/?variant=ingage`.
- Expect: the Ingage talk opens directly, no picker.
- Open `http://localhost:5173/?variant=gdg#whats-sdd`.
- Expect: the GDG talk opens at the "What's Spec-Driven Development?" slide.

### 4. Unknown variant is recoverable (FR-008, US3)

- Open `http://localhost:5173/?variant=zzz`.
- Expect: the picker is shown (not an arbitrary talk).

### 5. Keyboard only (FR-009)

- On the picker, use Tab / arrow keys to move between variants and Enter / Space to choose.
- Expect: any variant reachable and selectable with no pointer.

### 6. Back to picker from a talk (FR-011)

- While in a talk, trigger the back-to-picker affordance.
- Expect: the picker is shown again and the address no longer names a variant.

### 7. Adding a variant auto-appears (FR-003, SC-002)

- Add a new variant entry to `src/data/variants.js` (with `label` and `meta`).
- Expect: it appears in the picker with no other change.

## Automated checks

```bash
npm run lint
npm test          # includes the picker unit + a11y test, iterating the manifest
npm run build     # static bundle, no runtime network calls
# optional:
npm run test:e2e  # Playwright, picker route
```

Expected: lint clean, all unit tests pass (picker renders every variant, jest-axe clean, no
straight quotes / em dashes), build succeeds.
