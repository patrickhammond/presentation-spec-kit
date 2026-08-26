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
4. **What's Spec-Driven Development?** – the lifecycle they already run (requirements → design → tickets). Names the ecosystem (OpenSpec, plus plugins like Superpowers, GSD, Grill Me) and lands the shared format: whatever you pick, the artifacts are plain Markdown living with your code. The `cincydev-ai` arc drops the ecosystem sentence (`ecosystem: false`) because its spectrum slide is next.
5. **What's Spec Kit?** – one toolkit among several ("a toolkit", never "the toolkit"); harness-agnostic (Claude Code, Copilot, Cursor, Antigravity); includes a self-referential `spec.md` excerpt. The shared-format point ("plain Markdown that lives with your code") belongs to the SDD slide, where the ecosystem is named, so this slide leads on the commands instead.
6. _(interactive flow inserted here)_
7. **Why Should I Care?** – "Less rework. Fewer surprises at the end." The agent owns the _how_; you own the _what and result_. Carries both b-corp touches as a "less rework" couplet.
8. **What Am I Still Figuring Out?** – honest close: open questions, last one bolded as standout. Single-column.
9. **Where to start?** – heading "Your turn."; repo link and install chip.
10. **What's Next?** – heading "Let's keep talking."; invite to `#ai-practitioners`. No repo/install block. Load-bearing closing beat (guardrails below).

**The bridge-bold chain:** a slide that introduces the next slide's subject ends on that term bolded. Hook ends on bold **Spec-Driven Development**; the SDD slide ends on bold **Spec Kit**. Keep the chain intact when adding or reordering slides.

### `gdg` arc (~40 min community talk, `?variant=gdg`)

Superset of `ingage`. Adds: an **unnumbered who-am-I intro** after the title; a **"Time for a Demo"** transition (section 5, the live meta-demo centerpiece, after the flow); and a **"What I've Learned"** practitioner beat. Re-points the close to a **community invite** (no internal Slack) and the title byline to "Fits how you already work". New components (`whoami`, `demo`, `lessons`) live in `SlideShow.jsx`; per-variant copy is plain-data props from the manifest (no JSX in `variants.js`). Demo playbook: [`../playbook.md`](../playbook.md).

### `cincydev-ai` arc (~40 min, `?variant=cincydev-ai`)

Sibling of `gdg`, not a fork. Same shared entries and the same who-am-I, but the live demo is
gone and two beats take its place. Sections renumber 1-11. Audience profile:
[`audience-cincydev-ai.md`](audience-cincydev-ai.md).

1. **Tooling spectrum** (section 3, right after the SDD slide, and again at section 8). Ceremony
   up front vs churn later, with AGENTS.md + Prompting, Superpowers, OpenSpec, and Spec Kit on it.
   Stance: **no winner, pick by how much rework you can afford**. The four tools land on a near-diagonal because the two
   axes are correlated, and that is the argument, not a flaw: say the line out loud. The room is
   agent-fluent, so the names are landmarks, not subjects, which is what lets the first showing
   run before "What's Spec Kit?".
2. **Artifact walkthrough** (after the flow). One stop per command that actually wrote something
   on this feature, walked with the same arrow keys as everything else. It shows each artifact's real
   section headings plus one verbatim line, not a Markdown dump. All of it is genuine output from
   this repo's own presenter outline modal feature. The last stop, `/speckit.analyze`, writes
   nothing, and that absence is the beat.
   The spectrum is shown **once**. A second showing after the artifact walk was cut: its legend is
   most of the slide's ink, so repeating it read as a duplicate rather than a callback. The payoff
   lands as a lead line on **Why Should I Care?** instead, where the room has just read the whole
   cost side.

The **SDD slide's ecosystem line is dropped in this arc only** (`ecosystem: false`). The spectrum
slide names that landscape a beat later and in far more detail, so the one-liner would be a
spoiler that steals its own punchline. The bridge bold lived in that sentence, so it goes too,
which is correct: with the spectrum in between, it would have pointed two slides ahead. The Hook
to SDD bridge is untouched, and both other arcs keep the full chain. The shared-format line
("plain Markdown that lives with your code") stays in every arc; it just loses its
"whatever you pick" lead-in here, since nothing has been listed yet.

Content sources: `src/data/spectrum.js` (coordinates and one-liners) and `src/data/artifacts.js`
(the six stops). Both are the SoT for their slide; nothing is hardcoded in the components.

#### Per-slide timings (target: ~36 min of content in a 40 min slot)

| Slide    | Section                           | Target  |
| -------- | --------------------------------- | ------- |
| (title)  | Title                             | ~5 s    |
| (whoami) | Who am I                          | ~1 min  |
| (creed)  | Requirements creed                | ~10 s   |
| 1        | Hook (compressed for this room)   | ~40 s   |
| 2        | What's Spec-Driven Development?   | ~1 min  |
| 3        | Where Does This Fit? (spectrum)   | ~3 min  |
| 4        | What's Spec Kit?                  | ~1 min  |
| 5        | Interactive flow (numbered entry) | ~9 min  |
| 6        | What Gets Generated? (5 stops)    | ~10 min |
| 7        | Why Should I Care?                | ~3 min  |
| 8        | What I've Learned                 | ~3 min  |
| 9        | What Am I Still Figuring Out?     | ~2 min  |
| 10       | Where to start?                   | ~20 s   |
| 11       | Can I Get The Slides?             | ~30 s   |
| 12       | What's Next?                      | ~1 min  |

The two heavy blocks are the flow and the artifact walk. Everything before the spectrum is setup
and should run fast.

#### Things to say on the new beats

**Where Does This Fit? (spectrum, first showing)**

- "You all already know these names. What I want is for you to be able to place them."
- On the unplotted line: "There are more of these than I can fit on a chart, and there'll be two
  more by the time I finish this sentence. Doesn't matter. They all land somewhere on this line."
- Point at the line: "Notice this is basically a straight line. That's not me being lazy with the
  chart. More ceremony up front really does buy less churn later. You pay either way, just at
  different times."
- Read the bottom axis twice: "That axis is what the tool costs you. It's also how complicated a
  problem the tool is built for. Look at the four descriptions on the right: every one of them is
  about complexity. Small enough to hold in your head. A document per change. A lifecycle. Fifteen
  moving parts."
- Land the diagnosis: "So there's no winner here, and honestly there's no wrong tool. There's a
  mismatch. Full Spec Kit on a one-line fix is a waste. A bare prompt on something with fifteen
  moving parts is how you end up with drift. Match the ceremony to the problem."

**What Gets Generated? (the artifact walk)**

- Frame it first: "No demo today. Instead I want to show you what actually lands on disk, because
  that is the part people either love or bounce off."
- "All of this is real output from a feature of this very deck. I specced a talk about specs, then
  specced a feature inside the talk about specs. I've made peace with it."
- On the constitution: "You've all got an AGENTS.md. You've also all watched an agent cheerfully
  ignore it. The difference here is enforcement: `/speckit.plan` will not start designing until
  this passes, and `/speckit.analyze` comes back and re-checks it against every artifact."
- The practitioner note, if there's room: "Which means only write rules you can actually check.
  'No inline style props' is checkable. 'Write elegant code' is a wish."
- These are this repo's real rules, so say so: no inline styles, no em dashes, projector type.
- On the spec: "Notice specify seeded a quality checklist for free, and clarify ticked the boxes.
  I never ran /speckit.checklist on this feature. That command writes extra domain checklists,
  ux, api, security, and it is one of the ones I under-use."
- On the plan: "One command, five files. This is where people feel the weight, and it's fair."
- On tasks: "Look at the last two headings. It worked out what depends on what, and which tasks
  could safely run in parallel. That is not busywork, that is where you get to run more than one
  agent without them fighting over the same file."
- On analyze: "This one writes nothing. It reads everything and tells you where your artifacts
  disagree. Then you go fix the artifact, not the code." (Keeper line lands well here: "I catch
  bugs in spec review now, where fixing one costs a sentence instead of a sprint.")

**Can I Get The Slides? (the close, in this arc)**

- This arc has no What's Next? slide. The deck ends on the repo link and the email, so the
  sign-off is spoken, not printed.
- Make the ask out loud rather than reading the slide: "Those questions? I don't want to answer
  them alone. Come find me, or bring them back to this group."

**Why Should I Care? (after the artifact walk)**

- The lead line is the callback: "You just read everything Spec Kit writes before a line of code
  exists. That is what the ceremony buys."
- "Most to write up front, least to redo later. That's the whole trade, and it's yours to make."
- Then run the shared beats: the agent owns the how, you own the what and the result.

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

### 4. What's Spec Kit? — "specs, plans, tasks as commands you run" (~30 s)

- "No magic, no platform, no lock-in. Harness-agnostic: Claude Code, Copilot, Cursor, Antigravity, whatever you're into this week. The artifacts sit in the repo, so they're available right where you're working." (The Markdown point already landed on the SDD slide; don't re-spend it here.)
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
- "Nothing here is new. Most of this just makes problems we already had more visible: vague requirements, unclear ownership, work that wanders. The agent didn't create those, it just stopped letting me ignore them."
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
"I'm not catching bugs in code review anymore. I'm catching them in spec review, where fixing one costs a sentence instead of a sprint." (The slide puts "bugs" in quotes on purpose: at spec stage they are not bugs yet, they are wrong or missing requirements. Worth saying out loud, it is the whole point.) (Good drop-in during the flow walk.)

**First pass:**
"On non-trivial features, the win isn't speed on the first pass. It's that the first pass is closer to the last pass. Less rework, fewer surprises at the end."

**Multi-model review (elaborated Q&A form; the short version is the bolded question on the What Am I Still Figuring Out? slide):**
"Right now the model that writes the spec is also the one that checks it, a bit like grading your own homework. The thing I most want to try next is putting a second model in the reviewer's chair before any code gets written, because the cheapest bug to fix is the one a fresh set of eyes catches in the spec."

## Closing slides: framing guardrails

**Every arc runs the same closing sequence:** open questions → where to start → the deck → the
ask. "Where to start?" sits in the closing run, not earlier: it is the "go do it" door, and it
belongs next to the repo link the room actually leaves with, once they have seen enough to want
it. (It used to sit pre-flow in the `gdg` arc, which asked the room to act before they had a
reason to.)

The closing run is three beats: the open questions (**What Am I Still Figuring Out?**), where to start (**Where to start?** – repo + install one-liner), and the explicit ask (**What's Next?**). The first and last are load-bearing; the middle is a quick pointer the room can revisit in the leave-behind. Follow these when editing them:

**What Am I Still Figuring Out? (the open questions):**

- Frame as the field's open frontier, not your personal backlog. "Here is where this is heading," not "here is my to-do list."
- Pose questions; do not announce plans. A question recruits collaborators; a plan closes the door.
- Keep the list scannable: each a one-line question, with at most one bolded as the standout (nothing is bolded today; the four questions carry equal weight).
- The drift lesson on the previous slide sets these up: the room has just heard that drift gets easier to see as specs accumulate, so "how do you work with a thousand specs" is the honest next question rather than a new topic.
- The lifecycle question carries a second half worth saying out loud but not printing: what teams actually do with old specs versus what they think should happen. Those are rarely the same answer, and the gap is where the discussion is.
- It pairs with the scale question: whether specs should expire and what a thousand of them feels like to work in are the same worry from opposite ends. If the room bites on one, it will bite on the other.
- The scale question ("How do you actually work with a thousand specs?") is the one with the most room to run in conversation. It is not really about drift, it is about what a repo feels like once specs accumulate: finding the right one, trusting it, knowing which are dead. Say you do not have an answer, because you do not.

**Where to start? (the pointer):**

- Keep it to the repo and the install one-liner. No competing ask – this slide is the "go do it" door, and the deck is shared afterward, so don't slow down to read the command aloud.

**What's Next? (the close):**

- Its own slide now, holding just the ask. End on the explicit invite to keep the conversation going in `#ai-practitioners`: that is the goal, turning a passive room into people who keep talking. The heading ("Let's keep talking.") answers the prior open-questions slide – frame it as "those questions? let's chew on them together," not a sign-off.
