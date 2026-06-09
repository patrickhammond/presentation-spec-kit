# Ingage Brand Reference

Source of truth: [IngageGroup/skills – ingage-brand](https://github.com/IngageGroup/skills/tree/main/skills/marketing/skills/ingage-brand)

---

## Colors

### Primary

| Name          | Hex       | Notes                                                                                         |
| ------------- | --------- | --------------------------------------------------------------------------------------------- |
| Ingage Blue   | `#004AB9` | Primary brand. **Light backgrounds only** – fails WCAG AA on dark.                            |
| Ingage Orange | `#EE6823` | Primary accent. Passes 6:1+ on dark backgrounds. Used as primary accent in this presentation. |

### Typography

| Name      | Hex       | Use                              |
| --------- | --------- | -------------------------------- |
| Black     | `#000000` | H1–H2 on light backgrounds       |
| Text Dark | `#20282D` | H3–H4, body on light backgrounds |

### Accents

| Name   | Hex       |
| ------ | --------- |
| Red    | `#E1454F` |
| Purple | `#554993` |

### Light backgrounds (Ingage standard)

| Name             | Hex       | Use                         |
| ---------------- | --------- | --------------------------- |
| Warm White       | `#FFFAF6` | Hero, primary content areas |
| Light Warm Stone | `#F4EFE9` | Cards, quote blocks         |
| Light Cool Mist  | `#EDF2F8` | Feature panels, stat blocks |

### Gradients

| Name          | Value                                   |
| ------------- | --------------------------------------- |
| Orange → Red  | `#EE6823 → #E1454F`                     |
| Blue → Purple | `#004AB9 → #554993` (dark CTA sections) |

---

## Typography

**Headings** – Sora, 600 Semi Bold  
**Body** – Heebo, 400 Normal  
**Code/Commands** – IBM Plex Mono (our addition, not in the brand spec, but appropriate)

| Element    | Font  | Weight | Size       |
| ---------- | ----- | ------ | ---------- |
| H1 / Hero  | Sora  | 600    | 50px       |
| H2         | Sora  | 600    | 42px       |
| H3         | Sora  | 600    | 35px       |
| H4         | Sora  | 600    | 24px       |
| Subheading | Sora  | 600    | 20px       |
| Body large | Heebo | 400    | 20px / 1.5 |
| Body small | Heebo | 400    | 16px / 1.5 |

---

## Logos

All logo files are in `public/logos/`. This presentation uses a light theme – see "How this presentation uses the brand" for which variant to use and where.

| Variant                    | File                                | Use                                           |
| -------------------------- | ----------------------------------- | --------------------------------------------- |
| Orange "in" + Blue "gage"  | `ingage-logo-orange-blue2025.png`   | **Light backgrounds – primary for this talk** |
| Orange "in" + White "gage" | `ingage-logo-orange-white-2025.png` | Dark backgrounds                              |
| All White                  | `ingage-logo-all-white2025.png`     | Dark backgrounds, single-color                |
| All Blue                   | _(not downloaded)_                  | Light backgrounds, single-color               |

---

## Voice & Tone (key rules)

- **Approachable, not academic.** Confident, plain language. No jargon.
- **Declarative.** Claim first, then support.
- **Brief.** Every word earns its place.
- **No em dashes.** Ever. (en dashes `–` and hyphens `-` are fine)
- **Banned words**: robust, comprehensive, leverage, synergize, productionalized, holistic, scalable solutions, best-in-class
- **Orange accent** in headlines lands on the most emotionally resonant word, not the most descriptive.

---

## How this presentation uses the brand

The whole presentation (slides **and** the interactive flow) is a brand-native **light theme** on Warm White. Active decisions:

| Element               | Decision                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background            | Warm White `#FFFAF6`                                                                                                                                                            |
| Body text             | Text Dark `#20282D` (≈ 14.7:1 on Warm White)                                                                                                                                    |
| Headings              | Black `#000000`, Sora 600/700                                                                                                                                                   |
| Body font             | Heebo                                                                                                                                                                           |
| Commands / code       | IBM Plex Mono — reserved for section labels/counters ("02 · What's Spec-Driven Development?") and code/commands only. Do not use for prose, attributions, captions, or UI copy. |
| Primary accent        | Ingage Orange `#EE6823`, for emphasis and decorative marks (treat as a large-text / decorative accent on light)                                                                 |
| Ingage Blue `#004AB9` | Usable as text on this light background (e.g. the mono repo link), ≈ 7.5:1                                                                                                      |
| Logo                  | `public/logos/ingage-logo-orange-blue2025.png` (orange "in" + blue "gage"), the correct variant for light backgrounds                                                           |

**Logo placement:** the Title slide shows the hero logo at the top and **omits** the bottom-left corner mark; every other slide shows the corner mark bottom-left (`src/App.jsx` gates this on `slideIndex === 0`).

Non-brand UI accents used only inside the interactive flow for tier encoding (teal `#3fd6c0`, slate `#6b7c91`, green `#16a34a`) are app-specific, not brand colors. Source of truth is `TIER_META` in `src/data/steps.js`.
