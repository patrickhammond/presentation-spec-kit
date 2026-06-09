# Accessibility Audit – Playwright Findings

Viewport: 1920×1080 (vmin = 10.8px). Thresholds from `docs/accessibility.md`.

---

## Font sizes

WCAG for projected slides: ≥54px primary headings, ≥27px body, ≥22px secondary.

| Element                                          | CSS value | Computed | Threshold | Status |
| ------------------------------------------------ | --------- | -------- | --------- | ------ |
| `h2.sl-h2` (HonestClose, WhatsNext, QABackup)    | 3.5vmin   | 37.8px   | ≥54px     | FAIL   |
| `.sl-body`                                       | 2.2vmin   | 23.76px  | ≥27px     | FAIL   |
| `.sl-bullets li`                                 | 2vmin     | 21.6px   | ≥27px     | FAIL   |
| `.sl-label` (section counter "01 · …")           | 1.1vmin   | 11.88px  | ≥22px     | FAIL   |
| `.sl-kicker` ("Spec Kit · 8-min lightning talk") | 1.5vmin   | 16.2px   | ≥22px     | FAIL   |
| `.sl-caption`                                    | 1.5vmin   | 16.2px   | ≥22px     | FAIL   |
| `.sl-install` (install chip text)                | 1.4vmin   | 15.12px  | ≥22px     | FAIL   |
| `.detail-cmd` (flow panel command)               | 2.4vmin   | 25.92px  | ≥27px     | FAIL   |
| `.detail-sum` (flow panel summary)               | 1.9vmin   | 20.52px  | ≥27px     | FAIL   |
| `.detail-pts li` (flow panel points)             | 1.8vmin   | 19.44px  | ≥27px     | FAIL   |
| `.detail-sub` (flow panel subtitle)              | 1.9vmin   | 20.52px  | ≥22px     | FAIL   |
| `.detail-badge` (flow panel tier badge)          | 1.1vmin   | 11.88px  | ≥22px     | FAIL   |

---

## Color contrast — NEEDS BRAND DECISION

The Ingage orange `#EE6823` is used as a **text** color in several places. Against the warm-white
slide background `#FFFAF6`, it achieves ~3:1. WCAG AA requires 4.5:1 for normal text.

| Element                  | What it colors                       | Contrast |
| ------------------------ | ------------------------------------ | -------- |
| `.sl-label-n`            | Section numbers "01", "02"…          | ~3:1     |
| `.sl-kicker-sep`         | Title-slide separator "·"            | ~3:1     |
| `.sl-em`                 | Inline emphasis ("vague intent in…") | ~3:1     |
| `.sl-spec .tok-h`        | `#` heading in spec.md code block    | ~3:1     |
| `.sl-chip-arrow`         | Lifecycle chip arrows ↓              | ~3:1     |
| `.sl-invite em`          | "I want to compare notes."           | ~3:1     |
| `.sl-install-prompt`     | `$` prompt in install chip           | ~3:1     |
| `.sl-bullets li::before` | `–` bullet markers                   | ~3:1     |

**Options:**

1. **Accessible orange** – use `#A84015` (6:1 vs warm white) for text-only contexts. Same hue, noticeably darker.
2. **Secondary gray** – use `#404850` (8.9:1) for all these elements, reserving orange for purely decorative/graphical use (borders, bars, the large quote mark).
3. **Hybrid** – darker orange for prominent inline emphasis (`.sl-em`, `.sl-invite em`); gray for decorative punctuation (bullets, separators).

---

## Color contrast — safe to fix without brand input

| Element                           | Color      | Background   | Contrast  | Proposed fix                    |
| --------------------------------- | ---------- | ------------ | --------- | ------------------------------- |
| `[ ]` checkboxes in spec block    | `#0d8f82`  | white `#fff` | 3.76:1    | Darken teal → `#0A6864`         |
| Spec file tab label               | `#8a8580`  | `#f2ede8`    | 2.93:1    | Darken text → `#5a5550`         |
| Flow panel subtitle `.detail-sub` | `#8a9aaa`  | white        | 2.68:1    | → `#5c6e7d` ✓ (already applied) |
| Flow panel `.detail-cmd`          | tier color | white        | 2.9–3.8:1 | → `#20282d` ✓ (already applied) |
| Flow panel `.detail-badge`        | tier color | white        | 2.9–3.8:1 | → `#20282d` ✓ (already applied) |

---

## Flow nodes (overview)

React Flow node internals (`.step-node-cmd` at 13px, `.step-node-tier` at 8.5px) use tier colors
on white at diagram-icon scale. These would all fail contrast.

**Recommendation:** exclude `.react-flow__node` from the overview axe scan. The accessible
reading layer for the flow is the detail panel (which opens on click), not the icon labels.
The accessibility doc specifically says "click through every node and verify the detail panel."

---

## Already applied (4 edits, not yet verified by tests)

- `.detail-cmd` — font size `2.4vmin` → `2.5vmin`; color `var(--tier-color)` → `#20282d`
- `.detail-sub` — font size `1.9vmin` → `2.1vmin`; color `#8a9aaa` → `#5c6e7d`
- `.detail-badge` — font size `1.1vmin` → `2.1vmin`; color `var(--tier-color)` → `#20282d`
- `.detail-sum` — font size `1.9vmin` → `2.5vmin`

Everything else is waiting on the brand color decision above.
