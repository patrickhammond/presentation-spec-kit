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
  App.jsx               # resolves ?variant=: known -> deck (manifest + nav); none/unknown -> picker
  index.css             # ALL styling (slides + flow + picker), single global stylesheet
  App.css               # vestigial Vite-default styles, unused by the app
  picker/
    VariantPicker.jsx   # variant picker landing screen (lists variants from the manifest)
  slides/
    SlideShow.jsx       # slide components + SLIDE_REGISTRY (id -> component)
  flow/
    SpecKitFlow.jsx     # ReactFlow canvas, step state, layout
    StepNode.jsx        # custom node (command + subtitle + tier)
    LoopEdge.jsx        # animated loop edges
    DetailPanel.jsx     # per-node detail panel
    LabelNode.jsx       # label/annotation nodes
  data/
    steps.js            # single source of truth: STEPS content + TIER_META (the flow)
    variants.js         # single source of truth: per-variant deck manifest (slide order/section/slug)
```

## Conventions

- **Single source of truth for flow content** is `src/data/steps.js` (`STEPS` array + `TIER_META`). Edit content there, not in the node components.
- **All styling lives in `src/index.css`** as plain CSS with `vmin`-based responsive sizing. No CSS modules, no Tailwind.
- **Fonts** load via a Google Fonts `@import` at the top of `index.css`: Sora, Heebo, IBM Plex Mono, and Caveat (the handwritten annotation face).
- **Per-variant deck manifest** is `src/data/variants.js` (`VARIANTS`, `DEFAULT_VARIANT`, `isKnownVariant`, `resolveVariant`). Each variant has a `label`, a `meta` object (`room`/`length`/`demo`, read by the picker), and `entries`: an ordered list (`type: "slide"` with `id`/`slug`/`props`, or `type: "flow"`). Entries shared across variants are defined once as constants and composed per arc; **section counters are derived from position by `withSections`** (mark cold-open slides `numbered: false`), not written by hand, so inserting or reordering renumbers the rest automatically. This is the single source of truth for which slides appear, in what order, with what slug, plus how the picker describes each variant. Slide components are registered by `id` in `SLIDE_REGISTRY` (`src/slides/SlideShow.jsx`). Add or reorder slides here, not by editing nav math; add a variant here and it appears in the picker automatically.
- **Variant selection + picker.** The active variant is React state in `App.jsx`, initialized from `?variant=` (a known key opens that deck; no variant or an unknown one shows the variant picker `src/picker/VariantPicker.jsx` instead of silently defaulting, see `specs/001-variant-picker/`). `DEFAULT_VARIANT`/`resolveVariant` remain for callers that want a guaranteed variant, but resolution uses `isKnownVariant`. **Switching is in-app, not a full reload**: selecting/leaving `pushState`s a shareable URL (`/?variant=<key>`, no fragment so the deck opens at the title) and updates state; a `popstate` listener re-resolves on back/forward. The `Deck` is keyed on the variant so it remounts (and resets to the title) on switch. The in-deck location still lives in the URL hash, so variant + spot is shareable (e.g. `/?variant=ingage#whats-sdd`). A "Pick a talk" control (hidden on the flow) returns to the picker. Deck nav iterates the active variant's `entries`; the flow is just an entry, so there is no special flow-index math.
- **Deep-linkable URL hash.** The `Deck` in `App.jsx` mirrors the current location into the URL hash so any spot is shareable: no hash is the title, `#whats-the-problem` / `#whats-sdd` / etc. are slides by slug, `#spec-kit-flow` is the flow overview, and `#spec-kit-flow/<stepId>` (e.g. `#spec-kit-flow/analyze`) opens the flow focused on a node. Slugs come from the active variant's `entries` in `variants.js`. Node ids come from `STEP_IDS` in `steps.js`. The hash is written with `replaceState` (no history spam) and a `hashchange` listener syncs state for opened or hand-edited links.
