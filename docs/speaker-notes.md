# Speaker Notes and Delivery Reference

The spoken layer over the deck plus the slide arc: per-slide structure and editorial intent, a per-slide script, timings, and framing guardrails. Slide order, numbering, and copy are defined in `src/data/variants.js`; this doc holds the intent behind each beat and the spoken delivery.

The deck carries the words; you carry the personality. Each slide below lists 2–3 things to _say_ out loud, not read off the screen. Brisk pace is assumed and expected.

## Per-slide timings (target: 7–8 min total)

Delivery order. The flow is its own timed block, not a numbered slide. Code-level indices live in `CLAUDE.md` (`SLIDE_COUNT = 9`, `FLOW_SLIDE_INDEX = 4`).

| Slide   | Section                                    | Target |
| ------- | ------------------------------------------ | ------ |
| 1       | Title                                      | ~5 s   |
| (creed) | Requirements creed (cold open, unnumbered) | ~10 s  |
| 2       | Hook (What's the Problem?)                 | ~45 s  |
| 3       | What's Spec-Driven Development?            | ~30 s  |
| 4       | What's Spec Kit?                           | ~30 s  |
| (flow)  | Interactive flow / mapping                 | ~3 min |
| 5       | Why Should I Care?                         | ~1 min |
| 6       | What Am I Still Figuring Out?              | ~30 s  |
| 7       | Where to start? (repo, install one-liner)  | ~15 s  |
| 8       | What's Next? (close: #ai-practitioners)    | ~15 s  |

The cadence bet (smaller slides, one idea each) only pays off if live delivery is brisk. The flow is half your time; everything before it is setup, so rehearse the front five to run _fast_ and let the flow breathe. Rehearse against a clock.

## Slide arc and editorial intent

Slide order, numbering (`section` prop), slugs, and per-variant copy are defined in `src/data/variants.js`; components live in `src/slides/SlideShow.jsx`. This section holds the editorial intent behind each beat – the "why" the manifest doesn't capture.

### `ingage` arc (7-8 min lightning talk, delivered)

1. **Title** – hero headline "Understanding Spec Kit", byline in three beats: "Structured requirements an agent can act on. Results that land closer to done. Fits how you already work." (reframe → payoff → recognition). No kicker.
2. **Requirements creed** – unnumbered epigraph / cold open ("Don't start coding until we understand the requirements." – every senior dev, eventually). No `Label`; the section counter starts at the Hook.
3. **Hook** – "Speed isn't the problem. Drift is." Ends on bridge bold **Spec-Driven Development**. No "vibe coding" framing.
4. **What's Spec-Driven Development?** – the lifecycle they already run (requirements → design → tickets).
5. **What's Spec Kit?** – the tool; agent-agnostic; includes a self-referential `spec.md` excerpt. Ends on bridge bold **Spec Kit**.
6. _(interactive flow inserted here)_
7. **Why Should I Care?** – "Less rework. Fewer surprises at the end." The agent owns the _how_; you own the _what and result_. Carries both b-corp touches as a "less rework" couplet.
8. **What Am I Still Figuring Out?** – honest close: open questions, last one bolded as standout. Single-column.
9. **Where to start?** – heading "Your turn."; repo link and install chip.
10. **What's Next?** – heading "Let's keep talking."; invite to `#ai-practitioners`. No repo/install block. Load-bearing closing beat (guardrails below).

**The bridge-bold chain:** a slide that introduces the next slide's subject ends on that term bolded. Hook ends on bold **Spec-Driven Development**; the SDD slide ends on bold **Spec Kit**. Keep the chain intact when adding or reordering slides.

### `gdg` arc (~40 min community talk, `?variant=gdg`)

Superset of `ingage`. Adds: an **unnumbered who-am-I intro** after the title; a **"Time for a Demo"** transition (section 5, the live meta-demo centerpiece, after the flow); and a **"What I've Learned"** practitioner beat (section 7). Re-points the close to a **community invite** (no internal Slack) and the title byline to "Fits how you already work". Sections renumber 1-10. New components (`whoami`, `demo`, `lessons`) live in `SlideShow.jsx`; per-variant copy is plain-data props from the manifest (no JSX in `variants.js`). Demo runbook: [`demo.md`](demo.md).

## Spoken outline

### 1. Title — "Understanding Spec Kit" (~5 s)

- "This is a talk about getting an AI agent to build the thing you actually meant."
- Optional warm-up: "Show of hands, who's let an agent loose on a codebase and gotten back something… technically impressive and completely wrong?" Then nod and move on. Don't farm for laughs, just buy a beat of recognition.

### (creed) Requirements quote — cold open (~10 s)

- Read it like scripture, then land the punchline: "Every senior dev says this. Eventually. Usually right after the time they didn't."
- "We've believed this for thirty years. The robots didn't repeal it."

### 2. Hook — "Speed isn't the problem. Drift is." (~45 s)

- "Agents are fast. Genuinely fast. The problem was never speed."
- "The problem is drift: the gap between what you meant and what got built. That gap is where the surprises live, and surprises at the end of a project are the expensive kind."
- Bridge: "Closing that gap has a name. Spec-Driven Development." (Say it; it sets up the next slide.)

### 3. What's SDD? — "the workflow you already do" (~30 s)

- "Here's the twist: this isn't new. Kick-off, requirements, design, tasks, build. You already run this. You ran it last week."
- "The only difference: each artifact stops being a document that rots in a wiki, and starts being something an agent actually reads and acts on."
- Bridge: "The toolkit for doing that is **Spec Kit**."

### 4. What's Spec Kit? — "specs, plans, tasks as Markdown" (~30 s)

- "It's plain Markdown. No magic, no platform, no lock-in. Agent-agnostic: Claude, Copilot, Cursor, whatever you're into this week."
- Point at the spec excerpt: "This is a real spec. In fact it _could_ be the spec for this talk. Yes, I specced a talk about specs. I've made peace with it."
- "Text files, versioned with your code. Every decision is traceable, which is more than I can say for the average Slack thread."

### (flow) Interactive flow — the 8 commands (~3 min, the main event)

- Frame first: "Eight commands. Don't memorize them. Watch how each one maps to something you already do."
- Walk the spine (required, in orange): "`specify` is your requirements. `plan` is your design doc. `tasks` is your ticket breakdown. `implement` is the sprint."
- The supporting cast: "`constitution` is the house rules every spec has to follow. `clarify`, `checklist`, `analyze` are the optional ones — that's where the actual quality lives, and where you loop back."
- Land it: "Notice the loops all point back at the gates. That's not a diagram quirk. That's the whole point — iteration happens _before_ code, where fixing a mistake costs a sentence instead of a sprint."
- Landing line after walking the nodes: "Every command maps to something you already do. The difference is each artifact is now something an agent reads and acts on."

### 5. Why Should I Care? — "Less rework. Fewer surprises." (~1 min)

- "The agent owns the _how_. You own the _what_ and the _result_. That division of labor is the whole pitch."
- "Writing the spec isn't bureaucracy — it forces you to actually think the thing through before anyone, human or model, starts building."
- The two b-corp touches, light: "Less rework means fewer surprise weekends. It also means fewer wasted tokens, which is cheaper and, bonus, slightly less on fire for the planet."

### 6. What Am I Still Figuring Out? (~30 s)

- "I've walked you through this like I've got it figured out. I want to be honest: I don't."
- "Nothing here is new. What's new is _trusting an agent with it_, and how that holds up over time, I'm still learning."
- Land on the bolded question: "The one I'm chewing on most — how do you get a spec more than one set of eyes before any code? Right now the model writing the spec is also grading its own homework."

### 7. Where to start? — "Your turn." (~15 s)

- "Two doors. Developers: that install line, go run it tonight. Non-developers: open a real `spec.md` — it's just a PRD with checkboxes, you'll recognize it instantly."
- "Deck's going up on GitHub, the flow you just watched is clickable, so don't photograph the screen." (This is also your verbal "want the interactive deck" offer.)

### 8. What's Next? — "Let's keep talking." (~15 s, the close)

- "Those open questions? I don't want to answer them alone."
- "If you're poking at any of this, come find me in **#ai-practitioners**. Let's compare notes." (End here. Clean, no summary, no "questions?")

## Humor density

Humor is load-bearing in three spots — the creed punchline, "specced a talk about specs," and "grading its own homework" — and otherwise stays out of the way. For a 7–8 minute lightning talk that's about the right density; more and you blow the clock.

## Keeper lines for delivery

**Spec review:**
"I'm not catching bugs in code review anymore. I'm catching them in spec review, where fixing one costs a sentence instead of a sprint." (Good drop-in during the flow walk.)

**First pass:**
"On non-trivial features, the win isn't speed on the first pass. It's that the first pass is closer to the last pass. Less rework, fewer surprises at the end."

**Multi-model review (elaborated Q&A form; the short version is the bolded question on the What Am I Still Figuring Out? slide):**
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
