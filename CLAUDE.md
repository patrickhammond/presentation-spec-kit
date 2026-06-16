# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is a talk about Spec Kit (Spec-Driven Development), delivered as **multiple variants from one codebase** (architecture C): a ~40 min **GDG Cincinnati** community talk (primary, in development), the delivered 7-8 min **Ingage** lightning talk, and a client template. **Audience, format, goals, and success criteria are per variant: [`docs/audience.md`](docs/audience.md) is the index, read the profile for the variant you are working on before any slide or script work.**

The talk has two deliverables, presented as one combined slideshow (`src/App.jsx` interleaves them):

1. **Slides** – slide components live in `src/slides/SlideShow.jsx` (exported via `SLIDE_REGISTRY`), but **which slides appear, in what order, with what section number and URL slug is driven per variant by the manifest in [`src/data/variants.js`](src/data/variants.js)**, not hardcoded. The active variant is chosen by the `?variant=` query param; with no (or an unknown) variant the app shows the variant picker (`src/picker/VariantPicker.jsx`) rather than silently defaulting. The interactive flow is a manifest entry (`type: "flow"`), not a numbered slide. Section numbers (`section` prop) and per-variant copy (props) come from the manifest. Current `ingage` arc:
   1. **Title** – hero headline "Understanding Spec Kit", byline carries the story in three beats: "Structured requirements an agent can act on. Results that land closer to done. Fits how you already work." (reframe → payoff → recognition). No kicker. The recognition beat ("the lifecycle you already run") lives on the creed/SDD slides rather than crowding the cover. Replaces the old anxiety framing ("Shipping code you didn't write"), which duplicated the Hook and excluded the non-dev half of the room.
   2. **Requirements creed** – unnumbered epigraph / cold open ("Don't start coding until we understand the requirements." – every senior dev, eventually). Anchors the talk in a discipline the room already knows, before the Hook reframes it for the AI era. No `Label`: the section counter starts at the Hook.
   3. **Hook** – the problem, framed as drift/rework: "Speed isn't the problem. Drift is." An agent builds fast but can drift from intent; the distance between what you intended and what got built is where surprises and rework hide. Echoes the Why Should I Care? payoff ("Less rework. Fewer surprises.") on purpose, and ends on the bridge bold "Spec-Driven Development closes that gap." (The earlier trust/traceability framing – "You didn't write it. Now you have to trust it." – was cut: it set up a "trust" payoff the talk never resolves and re-centered the code-reader on a slide the mixed room needs to stay with.) No "vibe coding" framing.
   4. **What's Spec-Driven Development?** – the lifecycle they already run (requirements → design → tickets).
   5. **What's Spec Kit?** – the tool; agent-agnostic; includes a self-referential `spec.md` excerpt ("it _could_ be the spec for this talk").
   6. _(interactive flow inserted here)_
   7. **Why Should I Care?** – the payoff, aimed at the dev-heavy room and focused on **less rework** ("Less rework. Fewer surprises at the end."). The agent owns the _how_; you own the _what and result_. Writing the spec sharpens your thinking and helps you communicate it; agents use it to build closer to the right thing, faster. Carries both b-corp touches as a "less rework" couplet. (The earlier "boring is predictable" / predictability framing was cut; the label is now interrogative.)
   8. **What Am I Still Figuring Out?** – honest close: nothing here is new, what's new is trusting an agent with it; still learning how it holds up over time. Ends on a list of genuinely open questions, the last one bolded as the standout (multiple-perspective spec review). (Interrogative label; single-column, no two-stack.)
   9. **Where to start?** – the "go do it" half of the former combined close: heading "Your turn." (pays off the "workflow you already do" thesis), repo link (`https://github.com/github/spec-kit`), and the install one-liner chip. Developer-facing; the ecosystem nod lives on the SDD slide, not here.
   10. **What's Next?** – the close, on its own slide: the explicit ask. Heading "Let's keep talking."; picks up the open questions from the previous slide and turns them into the invite to keep the conversation going in the team `#ai-practitioners` Slack channel. This is the load-bearing closing beat (see `docs/speaker-notes.md` → closing guardrails). Deliberately holds just the ask, with no competing repo/install block.
       **`gdg` arc** (~40 min community talk, `?variant=gdg`) is a superset of the above: it adds an **unnumbered who-am-I intro** after the title (placeholder copy, props let you fill it in), a **"Time for a Demo"** transition (section 5, the live meta-demo centerpiece, after the flow), and a **"What I've Learned"** practitioner beat (section 7, lessons that stuck, distinct from the open-questions slide). It re-points the close to a **community invite** (plain-string `inviteLines` prop, no internal Slack) and the title byline to "Fits how you already work" (`taglineLines` prop). Sections renumber to 1-10. New components (`whoami`, `demo`, `lessons`) live in `SlideShow.jsx`; per-variant copy is plain-data props from the manifest (no JSX in `variants.js`).

2. **Interactive flow visual** – a React Flow node graph of the Spec Kit workflow, shown on stage and self-guided in the shared copy.

The core thesis: _Spec Kit isn't a new methodology. It's the development lifecycle you already know, except requirements, design, and tickets become executable inputs for an AI agent instead of documents that rot in a wiki._

## Interactive flow visual

A Vite + React app using `@xyflow/react` v12. Stack is already scaffolded and installed. **Full stack, scripts, and project structure: see [`docs/tech-stack.md`](docs/tech-stack.md).**

### Content model

Eight commands in order: `/constitution` → `/specify` → `/clarify` → `/checklist` → `/plan` → `/tasks` → `/analyze` → `/implement`

Four tiers (editorial choice – upstream docs are not strict about this split; source of truth is `TIER_META` in `src/data/steps.js`):

- **Required**: specify, plan, tasks, implement
- **Setup**: constitution
- **Optional**: clarify, checklist, analyze

Loop targets: clarify and checklist loop back to `/specify`; analyze loops back to `/specify`, `/plan`, and `/tasks` (all three). Loops are anchored to gate steps on purpose – gates are where iteration happens, and that placement is itself a teaching beat in the talk.

### Design system

Light theme, brand-native Warm White. **Palette, fonts, and logo: see [`docs/ingage-brand.md`](docs/ingage-brand.md).** Flow-specific notes:

- Canvas Warm White `#FFFAF6`, node surfaces `#FFFFFF`, warm-stone borders `#D4CFC9` / `#D8D0C8`
- Tier accents (app-specific, not brand colors): orange `#EE6823` (required/active), teal `#3fd6c0` (suggested/loops), slate `#6b7c91` (setup), green `#16a34a` dashed (optional). Source of truth is `TIER_META` in `src/data/steps.js`.
- Tier encoding is redundant: left color bar + border style (solid vs. dashed) + text badge. Note: the `suggested` key remains in `TIER_META` for future use but no step currently uses it.

### Interaction model

- Arrow keys / space to step through; Esc/Home returns to overview
- Click a node to zoom in (`setCenter` at ~1.55) and open the detail panel
- Active node gets a tier-colored (orange when required) highlight; others dim
- Bottom pills jump to any step, color-coded by tier

## Presentation requirements

**Accessibility, readability, aspect ratio, font sizes, and contrast: see [`docs/accessibility.md`](docs/accessibility.md).** In short: 16:10, design for a projected screen, `vmin`-scaled type (≥ 27px body / ≥ 54px headings at 1080p), and keep contrast ≥ 4.5:1 for anything the audience must read.

## Code conventions

- **No inline `style` props.** All styling lives in CSS (`src/index.css` / `src/App.css`), keyed by class. Do not set `style={{ ... }}` on JSX elements – it duplicates and silently overrides the CSS cascade, which causes drift (e.g. a hardcoded `fontSize` overriding a relative `0.9em`, breaking visual consistency). If a value must vary per render, pass it as a CSS custom property (`style={{ "--tier-color": ... }}`) and consume it in the stylesheet, the way `DetailPanel`/`.detail-panel` already do. One source of truth for size, family, and color: the stylesheet.
- **Bullet markers match body text, not the accent.** Across every slide, list markers (`.sl-bullets li::before`) use the body text color (`#20282d`), the same color as the bullet text. The orange accent is reserved for inline `.sl-em` emphasis; it must not be spent on structural elements like bullet markers, where it reads as false emphasis and pulls the eye off the words. The marker-to-text gap is a shared token, `--bullet-hang` (`:root`, em-based so it scales per list), consumed by both `.sl-bullets` (slides) and `.detail-pts` (flow detail panel); change it in one place to keep all lists in sync.

## Talk content

Per-slide timings, keeper lines not yet in the slides, and What's Next framing guardrails are in [`docs/speaker-notes.md`](docs/speaker-notes.md).

## Vocabulary

- **Spec-Driven Development** – proper noun, always hyphenated and title-cased. Abbreviated **SDD**.
- Never write: "spec-driven development" (lowercase), "Spec Driven Development" (no hyphen), or "spec driven development".

Key distinctions to keep accurate in any slide/script work:

- **constitution**: the governing principles every spec, plan, and task must satisfy, gated at `/plan` (the plan template's built-in Constitution Check) and re-checked across artifacts by the optional `/analyze`. In the talk, frame it simply as "the guidelines your specs must follow." The earlier **constitution vs AGENTS.md** comparison was **cut from the talk** (it was inside-baseball); do not reintroduce it into slides or the flow detail panels.
- **checklist vs analyze**: `/checklist` = "unit tests for English" for a single spec's quality; `/analyze` = cross-artifact consistency check across spec + plan + tasks + constitution.

### Content principles

- **No em dashes, ever** (brand voice rule; see `docs/ingage-brand.md` → Voice & Tone). Use commas, periods, or en dashes `–`. Applies to all slide copy, the flow `steps.js` content, and docs.
- **Curly apostrophes and quotes in rendered copy.** Use the typographic right single quote `’` for every apostrophe/contraction (Don’t, It’s, you’re, I’m), never the straight `'`. Likewise use curly `“ ”` for pull quotes. Straight marks read as code on a projected slide. This is a rendering rule, so it applies to audience-facing copy (`src/slides/SlideShow.jsx`, the flow `src/data/steps.js`, visible strings in `src/App.jsx`) but not to Markdown docs or code. Quick audit: `grep -rnE "[A-Za-z]'[A-Za-z]" src` should return nothing.
- **Copy voice** (personal author style, not a brand rule; see [`docs/copy-style.md`](docs/copy-style.md)). Contractions throughout; interrogative section labels keep a "?", statement labels do not.
- **B-corp (people-planet-profit) tie-in stays subtle: exactly two touches.** Both live on the Why Should I Care? slide, rooted in the same "less rework" cause: (1) people ("less rework → fewer surprise weekends") and (2) planet/profit ("less rework → fewer wasted tokens → lower cost + less energy"). They render as a paired couplet via `.sl-annotation` (handwritten Caveat style). The Hook slide is now a focused trust beat and deliberately carries no b-corp annotation (the old compute nod rode an efficiency framing that slide no longer has). Do not add more.
- **Cadence**: smaller, punchier slides that read in a glance beat dense slides the presenter talks over. One idea per slide; large type; near-zero reading load.
- **Bold (`<strong>`) has two sanctioned uses.** (1) **Bridge = forward signal:** a slide that introduces the next slide's subject ends on a short line with that term bolded, a deliberate, repeated cue that foreshadows what is coming. Today the Hook ends on bold **Spec-Driven Development** (sets up the SDD slide) and the SDD slide ends on bold **Spec Kit** (sets up the Spec Kit slide); keep that chain intact when adding or reordering slides. (2) **Standout item in a list:** singling out the single most important entry in a list (e.g. the headline open question on the What Am I Still Figuring Out? slide), at most one per slide. Bold is never used for ordinary in-slide emphasis, that is the orange `.sl-em` (`<em>`) treatment, so the two signals stay distinct: bold = structural (bridge or the one item that matters most), orange = inline emphasis on a phrase.

Install commands for the closing "What's Next?" slide (rendered as the light `.sl-install` chip). Spec Kit's docs use a two-step `uv tool install` + `specify init` flow (the old `uvx` one-liner was dropped upstream); keep these in sync with the current [Spec Kit README](https://github.com/github/spec-kit). Shown agent-agnostic (bare `init`, no `--integration`) and without a pinned `@vX.Y.Z` tag to keep the slide clean:

```
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init <project>
```

<!-- SPECKIT START -->

For project structure, conventions, and the variant system, read
`docs/tech-stack.md` and the constitution at `.specify/memory/constitution.md`.
`specs/001-variant-picker/` is a complete worked example of the Spec Kit flow
(spec, plan, tasks, contracts) for the talk's live demo.

<!-- SPECKIT END -->
