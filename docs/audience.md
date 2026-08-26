# Audience, Format, and Goals – Index

This talk is delivered to more than one room, in more than one length. Each room has its own
audience profile, and each maps to a **deck variant** (architecture C: one source, many
variants, selected by `?variant=` / config). **Read the profile for the variant you are
working on before any slide or script work**; every content decision should trace back to it.

## Variants

| Variant slug  | Audience profile                                               | Room                                 | Length        | Live demo         | Status                       |
| ------------- | -------------------------------------------------------------- | ------------------------------------ | ------------- | ----------------- | ---------------------------- |
| `gdg`         | [`audience-gdg-cincinnati.md`](audience-gdg-cincinnati.md)     | GDG Cincinnati (community, all devs) | ~40 min + Q&A | 1–2 (centerpiece) | **primary / in development** |
| `ingage`      | [`audience-ingage-lightning.md`](audience-ingage-lightning.md) | Ingage (internal, mixed)             | 7–8 min       | none              | delivered (archived)         |
| `cincydev-ai` | [`audience-cincydev-ai.md`](audience-cincydev-ai.md)           | Cincy.dev AI-Augmented Engineers     | ~40 min + Q&A | none              | in development               |
| `client`      | [`audience-client.md`](audience-client.md)                     | per engagement                       | TBD           | TBD               | template                     |

## Which to read

- **Default / current work:** [`audience-gdg-cincinnati.md`](audience-gdg-cincinnati.md). The GDG talk is the primary target and the superset the others draw from.
- **The Cincy.dev AI-Augmented Engineers talk:** [`audience-cincydev-ai.md`](audience-cincydev-ai.md). Same length as the GDG talk, but an agent-fluent room and no live demo, so a tooling spectrum and a stepped artifact walkthrough carry what the demo carried.
- **Maintaining the original lightning talk:** [`audience-ingage-lightning.md`](audience-ingage-lightning.md).
- **Prepping a new client talk:** copy [`audience-client.md`](audience-client.md).

## Why this is split

The Ingage and GDG rooms differ on the constraints that actually drive content: room makeup
(mixed vs. all-dev), length (8 min vs. 40), and whether there is a live demo. Keeping one
`audience.md` forced those into a single profile. Splitting per variant lets each talk be
refined independently while all variants stay on the main line of development (no per-talk
branches), which is the same motivation behind the config-driven deck variants.

## Shared, cross-variant principles

These hold regardless of room (details and rationale live in the per-variant files and in
[`../CLAUDE.md`](../CLAUDE.md)):

- **Lead with recognition.** "This is the SDLC you already run, with executable artifacts" is the hook that earns the right to any payoff claim. Its weight varies by room.
- **Cadence.** Smaller, punchier slides that read in a glance beat dense slides talked over. One idea per slide, large type, near-zero reading load.
- **Place it in the ecosystem.** Name the landscape (Spec Kit / OpenSpec, plus plugins like Superpowers, GSD, and Grill Me); do not leave "where it fits" to Q&A. How much weight this gets varies: a passing mention in the lightning talk, a slide of its own (shown twice) for an agent-fluent room.
- **End on curiosity.** Open questions invite the conversation to continue better than a summary or a "Questions?" slide.
- **Leave-behind discipline.** The deck is shared as a GitHub repo link afterward, so flow `pts` must stand alone without narration and the repo link does double duty (learn more / get the deck).
