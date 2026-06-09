# Speaker Notes and Delivery Reference

Delivery-specific content: per-slide timings, keeper lines not yet in the slides, and framing guardrails. Read alongside the slide arc in `CLAUDE.md`.

## Per-slide timings (target: 7-8 min total)

Slide numbers here follow delivery order (flow treated as its own timed block, not a numbered slide). Code-level slide indices are in `CLAUDE.md` – the arc there lists `SLIDE_COUNT = 8` with `FLOW_SLIDE_INDEX = 4`.

| Slide   | Section                                    | Target     |
| ------- | ------------------------------------------ | ---------- |
| 1       | Title                                      | --         |
| (creed) | Requirements creed (cold open, unnumbered) | ~10 s      |
| 2       | Hook                                       | ~45 s      |
| 3       | What's Spec-Driven Development?            | ~30 s      |
| 4       | What's Spec Kit?                           | ~30 s      |
| (flow)  | Interactive flow / mapping                 | ~3 min     |
| 5       | Why Should I Care?                         | ~1 min     |
| 6       | What Am I Still Figuring Out?              | ~30 s      |
| 7       | Where to start? (repo, install one-liner)  | ~15 s      |
| 8       | What's Next? (close: #ai-practitioners)    | ~15 s      |
| 9       | Backup (off main run)                      | on request |

The cadence bet (smaller slides, one idea each) only pays off if live delivery is brisk. Rehearse against a clock.

## Keeper lines for delivery

The "boring is predictable" line was cut from the slide (the **Why Should I Care?** slide now leads on less rework, not predictability); it survives only as a delivery option. These are for verbal delivery or Q&A:

**Spec review:**
"I'm not catching bugs in code review anymore. I'm catching them in spec review, where fixing one costs a sentence instead of a sprint."

**First pass:**
"On non-trivial features, the win isn't speed on the first pass. It's that the first pass is closer to the last pass. Less rework, fewer surprises at the end."

**Multi-model review (elaborated Q&A form; the short version is now the bolded question on the What Am I Still Figuring Out? slide):**
"Right now the model that writes the spec is also the one that checks it, a bit like grading your own homework. The thing I most want to try next is putting a second model in the reviewer's chair before any code gets written, because the cheapest bug to fix is the one a fresh set of eyes catches in the spec."

## Closing slides: framing guardrails

The closing run is three beats: the open questions (**What Am I Still Figuring Out?**), where to start (**Where to start?** – repo + install one-liner), and the explicit ask (**What's Next?**). The first and last are load-bearing; the middle is a quick pointer the room can revisit in the leave-behind. Follow these when editing them:

**What Am I Still Figuring Out? (the open questions):**

- Frame as the field's open frontier, not your personal backlog. "Here is where this is heading," not "here is my to-do list."
- Pose questions; do not announce plans. A question recruits collaborators; a plan closes the door.
- Keep the list scannable: each a one-line question, with at most one bolded as the standout (currently the multiple-perspective spec-review question).

**Where to start? (the pointer):**

- Keep it to the repo and the install one-liner. No competing ask – this slide is the "go do it" door, and the deck is shared afterward, so don't slow down to read the command aloud.

**What's Next? (the close):**

- Its own slide now, holding just the ask. End on the explicit invite to keep the conversation going in `#ai-practitioners`: that is the goal, turning a passive room into people who keep talking. The heading ("Let's keep talking.") answers the prior open-questions slide – frame it as "those questions? let's chew on them together," not a sign-off.

## Interactive flow: landing line

After walking the nodes live: "Every command maps to something you already do. The difference is each artifact is now something an agent reads and acts on."
