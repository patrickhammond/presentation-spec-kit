# Accessibility and Readability

The goal: design for ~40 people scanning a projected screen in a room, not a developer reading at a desk. (See [`audience.md`](audience.md) for who is in the room and the projection format.) Every slide and the flow visual must stay legible under projection.

## Aspect ratio

Target **16:10** (1920×1200 baseline). The slide deck enforces this with a `.slide-stage` container using `aspect-ratio: 16/10` and `width: min(100%, calc(100vh * 16/10))`, which letterboxes cleanly on non-16:10 viewports. The flow visual is full-screen (the projector is naturally 16:10 when presenting).

## Font sizes

Use `vmin` units so text scales with the 16:10 viewport. At 1080p (`vmin = 10.8px`), target **≥ 27px for body text** (2.5vmin) and **≥ 54px for primary headings** (5vmin). Avoid clamp maxes below those thresholds.

There is no "too minor to read" tier. Every piece of text on a slide, including bylines, credits, captions, and annotations, must read from the back of a room. Secondary text may be smaller than the 27px body line to preserve hierarchy, but never below **~22px** (≈ 2vmin at 1080p). Differentiate secondary text by weight, case, color, or font, not by shrinking it past legibility.

## Contrast (light theme)

- Body `#20282D` on `#FFFAF6` ≈ 14.7:1
- Secondary `#404850` ≈ 8.9:1
- Link blue `#004AB9` ≈ 7.5:1

Do not drop below **4.5:1** for any text the audience needs to read. Caption/muted text may sit lower but must still be legible under projection conditions.

## Density

Fewer ideas per slide beats more. Tables and dense content are acceptable where the mapping is the point, but don't add bullets to fill space. (This is the readability side of the "punchy cadence" principle in `CLAUDE.md`.)

## Flow interactive states

Contrast must be checked in every interactive state of the flow, not just the default overview. Specifically: the detail panel (opens on node click), active/dimmed node states, and loop edge labels. These states are easy to miss in a static review because they require interaction to reveal, and colors that look acceptable on a calibrated monitor can wash out badly on a projector. When reviewing the flow, click through every node and verify the detail panel's label, body, and file path text all meet the 4.5:1 minimum.

## Semantic HTML

Use `<h1>`, `<h2>`, `<ul>`, `<blockquote>`, not styled divs. Put an `aria-label` on every icon-only button.

## Motion

Honor `prefers-reduced-motion`. A global `@media (prefers-reduced-motion: reduce)` block in `src/index.css` collapses animation and transition durations to near-zero, so the slide and flow entrance animations and the traveling loop-edge dots stop moving for viewers who request it. End states still apply (full opacity, no offset), so nothing disappears. Any new animation inherits this automatically; do not add motion that bypasses it.
