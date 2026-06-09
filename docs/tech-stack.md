# Tech Stack

The interactive flow and the slide deck are one single-page app. Stack is already scaffolded and installed.

## Core

| Piece      | Version               | Notes                                                                                                                      |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| React      | 19.2                  | Plain JSX, no TypeScript. `StrictMode` in `src/main.jsx`.                                                                  |
| Vite       | 8                     | Dev server, build, and preview. `@vitejs/plugin-react`.                                                                    |
| React Flow | `@xyflow/react` 12.11 | The node graph. v12 CSS import path is `@xyflow/react/dist/style.css`. The old `reactflow` v11 package name is deprecated. |
| Node       | 22 (dev)              | ESM throughout (`"type": "module"`).                                                                                       |
| ESLint     | 10, flat config       | `eslint.config.js`, with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.                                    |

No router, no test runner, no CSS framework, no state library. It is a small, self-contained SPA.

## Scripts

```
npm run dev       # vite dev server (http://localhost:5173)
npm run build     # static bundle to dist/
npm run preview   # serve the built bundle
npm run lint      # eslint .
```

`npm run build` produces a self-contained static `dist/` with no runtime network calls, which is what makes the deck shareable as a GitHub leave-behind.

## Project structure

```
src/
  main.jsx              # React entry; mounts <App>, imports index.css
  App.jsx               # mode switch (slides vs flow) + keyboard/dot nav; interleaves the deck and the flow
  index.css             # ALL styling (slides + flow), single global stylesheet
  App.css               # vestigial Vite-default styles, unused by the app
  slides/
    SlideShow.jsx       # the slide deck (one component per slide)
  flow/
    SpecKitFlow.jsx     # ReactFlow canvas, step state, layout
    StepNode.jsx        # custom node (command + subtitle + tier)
    LoopEdge.jsx        # animated loop edges
    DetailPanel.jsx     # per-node detail panel
    LabelNode.jsx       # label/annotation nodes
  data/
    steps.js            # single source of truth: STEPS content + TIER_META
```

## Conventions

- **Single source of truth for flow content** is `src/data/steps.js` (`STEPS` array + `TIER_META`). Edit content there, not in the node components.
- **All styling lives in `src/index.css`** as plain CSS with `vmin`-based responsive sizing. No CSS modules, no Tailwind.
- **Fonts** load via a Google Fonts `@import` at the top of `index.css`: Sora, Heebo, IBM Plex Mono, and Caveat (the handwritten annotation face).
- **Nav math** in `App.jsx` is driven by the exported `SLIDE_COUNT` and `FLOW_SLIDE_INDEX` from `SlideShow.jsx`; the flow is inserted at `FLOW_SLIDE_INDEX`. Update those two constants when adding/reordering slides.
- **Deep-linkable URL hash.** `App.jsx` mirrors the current location into the URL hash so any spot is shareable: no hash is the title, `#whats-the-problem` / `#whats-sdd` / etc. are slides by slug, `#spec-kit-flow` is the flow overview, and `#spec-kit-flow/<stepId>` (e.g. `#spec-kit-flow/analyze`) opens the flow focused on a node. Slugs come from the exported `SLIDE_SLUGS` array in `SlideShow.jsx`, which must stay in the same order as the slides array. Node ids come from `STEP_IDS` in `steps.js`. The hash is written with `replaceState` (no history spam) and a `hashchange` listener syncs state for opened or hand-edited links.
