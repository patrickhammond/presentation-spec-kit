---
name: project-doc-landscape
description: Canonical homes for each doc type in the speckit-intro lightning-talk repo, plus known duplication hotspots
metadata:
  type: project
---

## Doc map

| What | Canonical home |
|---|---|
| Audience, format, goals, success criteria, leave-behind implications | `docs/audience.md` |
| Per-slide timings, keeper lines not in slides, What's Next framing guardrails | `docs/speaker-notes.md` |
| Ingage brand palette, fonts, logo, voice/tone (no em dashes) | `docs/ingage-brand.md` |
| Accessibility, aspect ratio, font sizes, contrast numbers | `docs/accessibility.md` |
| React/Vite/React Flow stack, scripts, project structure | `docs/tech-stack.md` |
| Agent operating rules, slide arc, vocabulary, content principles | `CLAUDE.md` (lean index, delegates to docs/) |
| Slide code | `src/slides/SlideShow.jsx` |
| Flow node content/data | `src/data/steps.js` |
| Styling | `src/index.css` |

## Code facts that docs reference

- `SLIDE_COUNT = 9`, `FLOW_SLIDE_INDEX = 3` exported from `src/slides/SlideShow.jsx`. The 9 slides are: Title, Hook, SDD, SpecKit, Predictability, HonestClose, WhatsNext, LearnMore, QABackup (index 8).
- `TIER_META` in `src/data/steps.js` is the source of truth for tier colors. Current tiers: `required` (orange `#EE6823`), `suggested` (teal `#3fd6c0`, no step currently uses this), `setup` (slate `#6b7c91`; constitution), `optional` (green `#16a34a`; clarify, checklist, analyze).
- Analyze loop-back edges go to `specify`, `plan`, AND `tasks` -- not just `plan`.
- App.jsx corner-mark logo is gated: hidden when `mode === 'slides' && slideIndex === 0` (title slide shows hero logo, not corner mark). Uses `ingage-logo-orange-blue2025.png` (light theme).
- Speaker-notes timing table uses delivery-order numbering (1-8 for main slides, flow as a parenthetical, Backup as 9). CLAUDE.md arc uses code-structure numbering (1-9 plus flow as a position = 10 items). These are intentionally different conventions, clarified by a note in speaker-notes.md.

## Known duplication hotspots

- `docs/content-brainstorm.md` was retired: most content was already captured in code or CLAUDE.md. Durable delivery content relocated to `docs/speaker-notes.md`.

## Decisions made

- `docs/audience.md` owns leave-behind design implications (per-node pts must be self-explanatory; "want the deck, it's interactive" offer).
- `docs/speaker-notes.md` owns What's Next framing guardrails (pose questions not plans; field's frontier not personal backlog; 2-3 items max; end on explicit ask).
- Mermaid flowchart source was NOT relocated: fully redundant with `src/data/steps.js` (steps, tiers, loop targets all encoded there).
- Q&A pocket answer was NOT relocated: already rendered as `QABackupSlide` in `src/slides/SlideShow.jsx` and noted in CLAUDE.md.
- `docs/ingage-brand.md` is the single owner of the logo table and "how this presentation uses the brand" decisions. CLAUDE.md's Design system section is flow-specific only and delegates everything else there.
