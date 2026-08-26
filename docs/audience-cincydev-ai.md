# Audience – Cincy.dev AI-Augmented Engineers

**Variant slug:** `cincydev-ai` · **Format:** ~40 min talk + Q&A, no live demo · **Status:** in development

The [Cincy.dev AI-Augmented Engineers](https://cincy.dev/groups/ai-augmented-engineers) group.
A sibling of the GDG Cincinnati talk ([`audience-gdg-cincinnati.md`](audience-gdg-cincinnati.md)),
not a replacement for it. Index: [`audience.md`](audience.md).

Two things drive every content decision here, and both differ from the GDG variant: the room is
**already fluent in agentic coding**, and there is **no live demo**.

## Who is in the room

- **Developers who already use agents daily.** Claude Code, Cursor, Copilot, whichever. They do
  not need to be sold on agentic coding, convinced that agents are fast, or walked through what
  an AI coding tool is.
- **They already know the tool names.** Spec Kit, OpenSpec, Superpowers are landmarks they have
  at least heard of. This is the assumption that lets the spectrum slide land before the
  "What's Spec Kit?" slide defines anything.
- **What they lack is placement and cost.** Not "what is this", but "where does it sit, what does
  it cost me, and when is that cost worth paying".
- **Community, not internal.** No shared internal context, no internal Slack, no assumed tooling.
- Talk date: TBD, confirm with the organizers.

## Format

- **~40 minutes + Q&A**, same slot shape as the GDG talk.
- **No live demo, deliberately.** The GDG variant's demo centerpiece is replaced by two beats:
  the tooling spectrum and the stepped artifact walkthrough.
- Target **16:10** (1920×1200), same projected-screen discipline.
- Shared afterward as a GitHub repo link; the deck doubles as a self-guided leave-behind.

## Goal

Help a room that already uses agents **place Spec Kit against its neighbors and price it
honestly**, so they can choose by how much rework a change can afford instead of by hype, and so the ones who dismissed the
ceremony can see exactly what it buys.

## Success criteria

Any one of these is a win:

- People can say where Spec Kit sits relative to lighter tools, and when they would reach for each.
- People who dismissed Spec Kit as too heavy understand what the weight is actually for.
- People who already use it recognize an artifact they have been skipping.
- People leave arguing about the trade, which is the discussion the group exists for.

## What this implies for the content

- **The hook compresses.** "Speed isn't the problem, drift is" still opens, but this room does not
  need to be convinced that agents drift. Say it and move.
- **Artifacts carry the hands-on, not a terminal.** With no demo, the artifact walk is the
  concrete beat. It shows **structure, not prose**: the real section headings of each artifact,
  one verbatim line, and what to notice. Resist turning it into a Markdown dump; the projector
  minimums make that unreadable anyway.
- **Use real artifacts, attributed to the command that wrote them.** Everything in the walk is
  genuine output from this repository's own presenter outline modal feature: self-referential,
  verifiable, and clone-able. That cuts both ways. `/speckit.checklist` gets no stop because it
  was never run here, and `checklists/requirements.md` belongs to `/speckit.specify`, which
  seeded it. The room can clone the repo and check, so the walk has to survive that.
- **Price the ceremony out loud.** The spectrum slide is a choosing tool with no winner. The
  correlated diagonal is the argument, and it is stated rather than hidden: more ceremony up
  front buys less churn later, and you pay either way, just at different times.
- **Read the ceremony axis twice.** It is what the tool costs you, and it is the problem
  complexity the tool is built for. Every `when` line in `spectrum.js` is keyed to complexity for
  exactly this reason. That second reading makes the slide a diagnostic: the failure mode is a
  mismatch, not a wrong tool. Do not collapse the two readings into one axis label; the
  distinction is what the diagnosis rests on.
- **The flow can breathe.** Same as the GDG talk: spend real time on the loops.
- **End on curiosity and a community next step**, not an internal channel. This arc has no
  separate What's Next? slide: it ends on the repo slide, so the last thing on screen is the
  thing worth photographing and the ask is made out loud.

## Structure notes specific to this variant

- **The spectrum is shown once**, after the SDD slide, as the landscape. A second, highlighted
  showing after the artifact walk was tried and cut: the legend is most of the slide's ink, so
  the repeat read as a duplicate rather than a callback. The payoff moved to a lead line on
  **Why Should I Care?**, which is the same idea in one sentence instead of a whole slide.
- **The SDD slide's ecosystem line is dropped here** (`ecosystem: false`). The spectrum names the
  same landscape one slide later and in more detail, so the one-liner would spoil it. The bridge
  bold lived in that sentence and goes with it, which is right: with the spectrum in between it
  would have pointed two slides ahead. Every other arc keeps both. See `CLAUDE.md` content
  principles.
- **The artifact walk is one entry with six sub-steps**, not six slides, so it does not inflate
  the section counter. Each stop is deep-linkable (`#artifacts/plan`) for the leave-behind.

## What carries over vs. what changes from the GDG talk

| Aspect        | GDG Cincinnati            | Cincy.dev AI-Augmented Engineers   |
| ------------- | ------------------------- | ---------------------------------- |
| Room          | Community, all developers | Community, agent-fluent developers |
| Length        | ~40 min + Q&A             | ~40 min + Q&A                      |
| Live demo     | 1–2, the centerpiece      | None                               |
| Hands-on beat | The demo                  | The stepped artifact walkthrough   |
| Ecosystem     | Named in passing          | Its own slide, shown twice         |
| Hook weight   | Full                      | Compressed in delivery             |
| Who-am-I      | Added                     | Same, verbatim                     |
| Close         | Community keep-talking    | Same                               |

## Open questions to resolve as content develops

- **Talk date and exact slot length**, to confirm with the organizers.
- **Spectrum placements.** The four coordinates are a judgment call and deserve a rehearsal pass.
  They live only in `src/data/spectrum.js`, so they are cheap to nudge.
- **Is one verbatim pull quote per artifact enough** to make the artifacts feel real without a
  terminal, or does the walk want a second? Decide against a clock in rehearsal.
