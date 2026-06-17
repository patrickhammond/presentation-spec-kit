# AGENTS.md

Agent-agnostic context for this repository. Any coding agent (Claude, Copilot, Cursor,
Gemini, and others) should read this first. Claude Code users: [`CLAUDE.md`](CLAUDE.md) is the
fuller, canonical guide and this file defers to it; the two must not contradict.

## What this is

A single-page app that is **both a conference talk deck and an interactive diagram about Spec
Kit** (Spec-Driven Development). It is given in multiple rooms and lengths from one codebase:
a ~40 min GDG Cincinnati community talk (primary), a 7–8 min Ingage lightning talk, and a
client template. See [`docs/audience.md`](docs/audience.md) for the variant index.

The talk's own thesis: Spec Kit is not a new methodology, it is the development lifecycle you
already run (requirements, design, tickets) with each artifact turned into an executable input
for an AI agent.

## Stack and commands

- React 19 + Vite 8, plain JSX (no TypeScript). `@xyflow/react` v12 for the node graph. ESM throughout. No router, no CSS framework, no state library. Full detail: [`docs/tech-stack.md`](docs/tech-stack.md).

```
npm install       # install deps
npm run dev       # vite dev server (http://localhost:5173)
npm run build     # static bundle to dist/
npm run preview   # serve the built bundle
npm run lint      # eslint .
npm test          # vitest (slide/flow unit tests)
```

## Where things live

- `src/App.jsx` – mode switch (slides vs. flow) + keyboard/dot nav; interleaves the deck and the flow.
- `src/slides/SlideShow.jsx` – the slide deck (one component per slide).
- `src/flow/` – the React Flow canvas (`SpecKitFlow.jsx`), nodes, edges, detail panel.
- `src/data/steps.js` – **single source of truth** for flow content (`STEPS` + `TIER_META`).
- `src/index.css` – **all** styling (slides + flow), one global stylesheet, `vmin`-based responsive sizing.
- `docs/` – audience profiles, brand, copy style, accessibility, speaker notes, Spec Kit command reference.

## Conventions (hard rules)

These are enforced as the project constitution ([`docs/constitution.md`](docs/constitution.md)).
Violating them is a defect, not a style preference.

1. **No inline `style` props.** All styling lives in CSS, keyed by class. If a value must vary per render, pass it as a CSS custom property (`style={{ "--tier-color": ... }}`) and consume it in the stylesheet.
2. **Single source of truth.** Flow content goes in `src/data/steps.js`, not in node components. Styling goes in `src/index.css`. Slide ordering/numbering/slugs come from the variant manifest, not hardcoded per slide.
3. **No em dashes, ever** (brand voice). Use commas, periods, or en dashes `–`. Applies to slide copy, `steps.js`, and docs.
4. **Curly apostrophes and quotes in rendered copy.** Use `’` and `“ ”` in anything the audience sees on screen (`src/slides/*`, `src/data/steps.js`, visible strings in `src/App.jsx`), never straight marks. Does not apply to Markdown docs or code. Audit: `grep -rnE "[A-Za-z]'[A-Za-z]" src` should be empty.
5. **Readability for a projected screen.** 16:10, `vmin`-scaled type (≥ 27px body / ≥ 54px headings at 1080p), contrast ≥ 4.5:1 for anything the audience must read. See [`docs/accessibility.md`](docs/accessibility.md).
6. **Spec-Driven Development** is a proper noun, always hyphenated and title-cased (abbrev. **SDD**). Never "spec-driven development", "Spec Driven Development".

## Voice

Approachable, plain, declarative, brief. Contractions throughout. Banned words: robust,
comprehensive, leverage, synergize, productionalized, holistic, scalable solutions,
best-in-class. Details: [`docs/ingage-brand.md`](docs/ingage-brand.md) and [`docs/copy-style.md`](docs/copy-style.md).

## Testing and verification

- Run `npm run lint` and `npm test` before considering a change done.
- For visual or content changes, build (`npm run build`) and sanity-check the affected slide/flow.
- Keep `docs/` in sync with behavior changes; this repo treats docs as part of the deliverable.
