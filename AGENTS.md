# AGENTS.md

Agent-agnostic context for this repository. Any coding agent (Claude, Copilot, Cursor, Gemini, and others) should read this first.

## What this is

A single-page app that is **both a conference talk deck and an interactive diagram** about Spec Kit (Spec-Driven Development). It is delivered as **multiple variants from one codebase**: a ~40 min **GDG Cincinnati** community talk (primary, in development), the delivered 7-8 min **Ingage** lightning talk, and a client template. **Audience, format, goals, and success criteria are per variant: [`docs/audience.md`](docs/audience.md) is the index; read the profile for the variant you are working on before any slide or script work.**

The talk's own thesis: Spec Kit is not a new methodology. It is the development lifecycle you already run (requirements, design, tickets) with each artifact turned into an executable input for an AI agent.

## Stack and commands

React 19 + Vite 8, plain JSX (no TypeScript). `@xyflow/react` v12 for the node graph. ESM throughout. No router, no CSS framework, no state library. Full detail: [`docs/tech-stack.md`](docs/tech-stack.md).

```
npm install       # install deps
npm run dev       # vite dev server (http://localhost:5173)
npm run build     # static bundle to dist/
npm run preview   # serve the built bundle
npm run lint      # eslint .
npm test          # vitest (slide/flow unit tests)
```

## Where things live

- `src/App.jsx` – variant picker + keyboard/dot nav; interleaves the deck and the flow.
- `src/slides/SlideShow.jsx` – slide components (one per slide, exported via `SLIDE_REGISTRY`).
- `src/data/variants.js` – **variant manifest**: which slides appear, in what order, with what section number and URL slug. Active variant chosen by `?variant=` query param; no param shows the picker (`src/picker/VariantPicker.jsx`).
- `src/flow/` – the React Flow canvas (`SpecKitFlow.jsx`), nodes, edges, detail panel.
- `src/data/steps.js` – **single source of truth** for flow content (`STEPS` + `TIER_META`).
- `src/index.css` – **all** styling (slides + flow), one global stylesheet, `vmin`-based responsive sizing.
- `docs/` – brand, copy style, accessibility, speaker notes, Spec Kit command reference, and the per-variant audience profiles.
- `docs/audience.md` – **audience index**: variant table + which profile to read + shared cross-variant principles. Per-variant profiles: [`docs/audience-gdg-cincinnati.md`](docs/audience-gdg-cincinnati.md) (`gdg`, primary), [`docs/audience-ingage-lightning.md`](docs/audience-ingage-lightning.md) (`ingage`, delivered), [`docs/audience-client.md`](docs/audience-client.md) (`client`, template).

## Slide variants

The active variant is chosen by the `?variant=` query param; with no (or unknown) variant the app shows the variant picker. The interactive flow is a manifest entry (`type: "flow"`), not a numbered slide. Slide order, section numbers (`section` prop), slugs, and per-variant copy all come from the manifest in `src/data/variants.js` (the SoT); slide components live in `src/slides/SlideShow.jsx`.

Three arcs ship today:

- **`ingage`** – 7-8 min lightning talk, delivered.
- **`gdg`** – ~40 min community talk (`?variant=gdg`), a superset that adds a who-am-I intro, a "Time for a Demo" transition, and a "What I've Learned" beat (components `whoami`, `demo`, `lessons` in `SlideShow.jsx`).
- **`cincydev-ai`** – ~40 min Cincy.dev AI-Augmented Engineers talk (`?variant=cincydev-ai`), a sibling of `gdg` with **no live demo**. Two beats replace it: a **tooling spectrum** (`spectrum`, rendered twice from one component, the second with `highlight: "speckit"`) and a **stepped artifact walkthrough** (`artifacts`). Content SoT: `src/data/spectrum.js` and `src/data/artifacts.js`.

The slide-by-slide arc, the bridge-bold chain, and the editorial intent behind each beat live in [`docs/speaker-notes.md`](docs/speaker-notes.md) → Slide arc and editorial intent.

### Stepped slides (sub-steps)

Some entries are walked through in place rather than being several slides: the interactive flow (its step nodes) and the artifacts walk (its six stops). That walk lives in [`src/deck/navigation.js`](src/deck/navigation.js), which is the single place declaring which slugs have sub-steps and the only place the arrow-key and URL-hash rules are written. Sub-steps are deep-linkable as `#slug/subStepId` (`#spec-kit-flow/analyze`, `#artifacts/plan`), and a slide with sub-steps receives the cursor as an `activeId` prop. Adding another stepped slide means adding one entry to `SUB_STEPS`, not another branch in `App.jsx`.

## Interactive flow visual

A React Flow node graph of the Spec Kit workflow, shown on stage and self-guided in the shared copy. It walks eight commands (`/constitution` → `/specify` → `/clarify` → `/checklist` → `/plan` → `/tasks` → `/analyze` → `/implement`) across four tiers. The command order, tier assignments, and loop targets are all defined in `src/data/steps.js` (`STEPS` + `TIER_META`, the SoT). Light theme; palette, fonts, and tier-accent colors live in [`docs/ingage-brand.md`](docs/ingage-brand.md) and `TIER_META`.

Editorial intent the code doesn't capture:

- **Loops anchor to gates on purpose.** clarify/checklist loop back to `/specify`; analyze loops back to `/specify`, `/plan`, and `/tasks`. Gates are where iteration happens, and that placement is itself a teaching beat in the talk.
- **Tier encoding is deliberately redundant** (left color bar + border style + text badge) for accessibility, not decoration.

### Interaction model

- Arrow keys / space to step through; Esc/Home returns to overview
- Click a node to zoom in (`setCenter` at ~1.55) and open the detail panel
- Active node gets a tier-colored (orange when required) highlight; others dim
- Bottom pills jump to any step, color-coded by tier

## Presentation requirements

16:10, design for a projected screen. `vmin`-scaled type (≥ 27px body / ≥ 54px headings at 1080p), contrast ≥ 4.5:1 for anything the audience must read. Full detail: [`docs/accessibility.md`](docs/accessibility.md).

## Code conventions

1. **No inline `style` props.** All styling lives in CSS (`src/index.css` / `src/App.css`), keyed by class. Do not set `style={{ ... }}` on JSX elements – it duplicates and silently overrides the CSS cascade. If a value must vary per render, pass it as a CSS custom property (`style={{ "--tier-color": ... }}`) and consume it in the stylesheet, the way `DetailPanel`/`.detail-panel` already do. One source of truth for size, family, and color: the stylesheet.
2. **Single source of truth.** Flow content goes in `src/data/steps.js`. Styling goes in `src/index.css`. Slide ordering/numbering/slugs come from `src/data/variants.js`, not hardcoded per slide.
3. **Bullet markers match body text.** List markers (`.sl-bullets li::before`) use body text color `#20282d`. The orange accent is reserved for inline `.sl-em` emphasis. The marker-to-text gap is `--bullet-hang` (`:root`, em-based), consumed by both `.sl-bullets` and `.detail-pts`; change it in one place to keep all lists in sync.

## Talk content

Per-slide timings, keeper lines not yet in the slides, and What's Next framing guardrails: [`docs/speaker-notes.md`](docs/speaker-notes.md).

## Vocabulary

- **Spec-Driven Development** – proper noun, always hyphenated and title-cased. Abbreviated **SDD**. Never "spec-driven development", "Spec Driven Development".
- **constitution**: the governing principles every spec, plan, and task must satisfy. In the talk, frame it as "the guidelines your specs must follow." The constitution vs AGENTS.md comparison stays **out of the flow detail panels and out of the `ingage` and `gdg` arcs**, where it cost more than it explained. It appears in exactly one place: the constitution stop of the `cincydev-ai` artifact walk, for a room that already lives in AGENTS.md and needs the distinction. The distinction to draw is enforcement, never format: AGENTS.md is advice an agent may act on, the constitution is gated at `/speckit.plan` and re-checked by `/speckit.analyze`.
- **checklist vs analyze**: `/checklist` = "unit tests for English" for a single spec's quality; `/analyze` = cross-artifact consistency check across spec + plan + tasks + constitution.

## Content principles

- **No em dashes, ever** (brand voice rule; see `docs/ingage-brand.md` → Voice & Tone). Use commas, periods, or en dashes `–`. Applies to all slide copy, the flow `steps.js` content, and docs.
- **Curly apostrophes and quotes in rendered copy.** Use the typographic right single quote `'` for every apostrophe/contraction (Don't, It's, you're, I'm), never the straight `'`. Likewise use curly `" "` for pull quotes. This applies to audience-facing copy (`src/slides/SlideShow.jsx`, `src/data/steps.js`, visible strings in `src/App.jsx`) but not to Markdown docs or code. Quick audit: `grep -rnE "[A-Za-z]'[A-Za-z]" src` should return nothing.
- **Copy voice** (personal author style; see [`docs/copy-style.md`](docs/copy-style.md)). Contractions throughout; interrogative section labels keep a "?", statement labels do not. Banned words: robust, comprehensive, leverage, synergize, productionalized, holistic, scalable solutions, best-in-class.
- **B-corp tie-in: exactly two touches.** Both live on the Why Should I Care? slide as a "less rework" couplet: (1) people ("less rework → fewer surprise weekends") and (2) planet/profit ("less rework → fewer wasted tokens → lower cost + less energy"). They render via `.sl-annotation`. Do not add more.
- **Cadence**: one idea per slide; large type; near-zero reading load. Smaller, punchier slides beat dense slides the presenter talks over.
- **Bold (`<strong>`) has two sanctioned uses.** (1) **Bridge = forward signal:** a slide that introduces the next slide's subject ends on that term bolded. Today: Hook ends on bold **Spec-Driven Development**; SDD slide ends on bold **Spec Kit**. Keep that chain intact when adding or reordering slides. The one sanctioned exception: the `cincydev-ai` arc puts the spectrum slide between SDD and "What's Spec Kit?", so it passes `ecosystem: false` to drop the SDD slide's ecosystem line entirely (the spectrum names that landscape properly), and the bridge bold goes with it rather than pointing two slides ahead. If another variant inserts a slide into the chain, do the same. (2) **Standout item in a list:** the single most important entry, at most one per slide. Bold is never used for ordinary in-slide emphasis – that is the orange `.sl-em` (`<em>`) treatment.

## Install commands (closing slide)

The "Where to start?" slide renders the install one-liner as the light `.sl-install` chip; the rendered SoT is `src/slides/SlideShow.jsx`. Keep it harness-agnostic and unpinned (`uv tool install … specify-cli`, then `specify init`), in sync with the current [Spec Kit README](https://github.com/github/spec-kit).

## Testing and verification

- Run `npm run lint` and `npm test` before considering a change done.
- For visual or content changes, build (`npm run build`) and sanity-check the affected slide/flow.
- Keep `docs/` in sync with behavior changes; this repo treats docs as part of the deliverable.
