# Demo Runbook: the live meta-demo

The stage choreography for the GDG Cincinnati live demo. Goal: in ~12-15 minutes, run Spec Kit
on **this very repo** so the room sees the workflow produce a real feature, with the project
**constitution** keeping the agent in line. Safety-netted so a cold or wandering agent run never
sinks the talk.

Audience profile: [`audience-gdg-cincinnati.md`](audience-gdg-cincinnati.md). The slide that hands
off to this is the `gdg` deck's **"Time for a Demo"** (section 5), right after the flow.

## The one thing they should leave with

Spec Kit is the lifecycle they already run, except the artifacts are executable and a written-down
constitution catches drift **before** code. Everything below serves that line. If you only get one
beat, get the **Constitution Check / analyze** beat.

## Demo subject: the variant picker

You build the **variant picker** (the "pick a talk" landing screen) live. It is the perfect
subject because:

- It is **self-referential**: "I specced a talk about specs; now watch me spec a feature in the talk app you are looking at."
- The working branch genuinely **does not have it yet**, so building it live is honest, not theater.
- It is **small and visual**: a screen that lists the variants, plus a resolution rule.
- It is **fully de-risked**: a finished version lives on the `claude/demo-variant-picker` branch.

## Two paths (both supported)

- **Run it clean (live):** start on the working branch, which has no picker, and drive the `/speckit` flow on stage.
- **Safety net (fallback):** the `claude/demo-variant-picker` branch holds the complete artifacts (`specs/001-variant-picker/`) and the working implementation. Switch to it any time to show a finished result or to recover.

You are never more than one `git checkout` away from a working demo.

## Pre-flight checklist (do this before you present)

Environment:

- [ ] `specify` CLI installed and on PATH (`specify version`), or at least the `.specify/` + `.claude/skills/speckit-*` already committed (they are).
- [ ] Claude Code (or your agent) open in the repo, `/speckit` skills available.
- [ ] `npm install` done; `npm run dev` works.
- [ ] Terminal font **large** (18-22pt), high-contrast theme, window wide enough that command output does not wrap awkwardly. Hide noisy shell prompts/notifications.
- [ ] Browser tab open to the dev server, zoom set so the projected deck/app is readable.

Repo state:

- [ ] On the working branch, **clean tree** (`git status` empty), and **no `specs/001-variant-picker/`** present (that is the point of "clean").
- [ ] The safety branch exists locally: `git fetch && git branch --list claude/demo-variant-picker` (or `git switch claude/demo-variant-picker` once to materialize it, then switch back).
- [ ] Decide your stretch level (see "Live vs pre-built" below) and rehearse it once end to end against a clock.

Rehearsal:

- [ ] Run the whole thing once the day before. Time it. Note where the agent pauses so you can narrate over the dead air.
- [ ] After rehearsing, **reset** (see "Reset to clean" at the end) so the live run starts clean.

## Live vs pre-built (choose your risk)

A full live `/speckit.implement` is the slowest, least predictable part. Recommended split:

| Step                           | Live or pre-built                       | Why                                                                                                  |
| ------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/speckit.specify`             | **Live**                                | Fast, and the most teachable: watch intent become a structured spec.                                 |
| `/speckit.plan`                | Pre-built (show the file)               | The teaching beat is the **Constitution Check** table, which reads better than watching it generate. |
| `/speckit.analyze`             | **Live**                                | Read-only, fast, safe. Produces a constitution + cross-artifact report. The money shot.              |
| `/speckit.implement`           | Pre-built (reveal via branch)           | Slow and least predictable live. Reveal the finished feature instead.                                |
| Stretch: one `/implement` task | Live, only if confident and time allows | Show the constitution catching a house-style slip on agent-written code.                             |

## The script (~12-15 min)

Numbers are rough; adjust to the clock.

### 0. Hand-off from the slide (~20s)

On the **"Time for a Demo"** slide: "You have seen the eight commands. Let us run them, for real, on
this exact deck. I am going to build the screen that lets me pick which version of this talk to give."
Switch to the terminal.

### 1. `/speckit.specify` live (~3-4 min)

Run:

```
/speckit.specify add a variant picker landing screen: when the deck opens without a chosen
variant, show a screen listing every talk variant (name, room, length, whether it has a live
demo) and let me pick one; a valid variant in the URL still opens directly
```

While it runs, narrate: "Notice it is asking WHAT and WHY, not how. It is writing acceptance
criteria I can actually check." When it finishes, open `specs/001-variant-picker/spec.md` and scroll
the **User Scenarios** and **Success Criteria**. Land: "This is just a PRD. The difference is an
agent is about to act on it."

### 2. Show the plan and the Constitution Check (~2-3 min)

You pre-ran `/speckit.plan`. Open `specs/001-variant-picker/plan.md` and scroll to **Constitution
Check**. This is the beat:

"Here is the part I care about. Every one of these is a house rule for this repo: no inline styles,
curly quotes, type that scales for a projector. The plan has to pass these gates before any code.
My standards are not a wiki page nobody reads anymore. They are a checklist the workflow enforces."

Optionally open `.specify/memory/constitution.md` for a sentence: "This is where those rules live."

### 3. `/speckit.analyze` live (~2-3 min)

Run:

```
/speckit.analyze
```

It is read-only, so it is safe to run live. When the report table appears: "This is cross-checking
the spec, the plan, the tasks, and the constitution against each other, and flagging anything
inconsistent. This is the review that used to happen in a PR, happening before a line of code."

### 4. Reveal the finished feature (~2-3 min)

"I ran tasks and implement ahead of time, because watching an agent type for ten minutes is nobody's
idea of fun. Here is the result."

```
git stash                # park the live-generated spec if needed
git switch claude/demo-variant-picker
npm run dev              # if not already running
```

Open the app at `/` (no variant): the **picker** appears. Click a variant: the talk opens. Then:
"And because it is data-driven, adding a new talk later just shows up here. The agent built the
component, the CSS, and the tests, and it stayed inside every house rule because the constitution
was a gate, not a suggestion."

### 5. (Stretch, optional) one live `/implement` task

Only if confident and you have time. Pick a tiny task from `tasks.md` and run `/speckit.implement`,
or hand-edit to violate a rule (add an inline `style={{...}}` or a straight quote) and show
`npm run lint` / the test sweep catching it. High payoff, higher risk. Skip if the clock is tight.

### 6. Back to the deck (~15s)

`git switch` back to the talk branch if your deck is served from it, return to the slides, and move
into **Why Should I Care?**. "That is the whole loop. Now, why it is worth your time."

## If something goes wrong (escape hatches)

- **Agent stalls or wanders during `/specify`:** let it finish or stop it, then `git switch claude/demo-variant-picker` and open the pre-built `spec.md`. "Here is one I prepared earlier." Nobody will know.
- **`/analyze` errors or is slow:** skip it; the plan's Constitution Check already made the point. Go straight to the reveal.
- **Dev server / build breaks on the live branch:** the safety branch is known-green (lint clean on changed files, tests pass, build succeeds). Switch to it.
- **Projector/screen-share dies mid-command:** narrate from the slides; the deck's flow already shows the eight commands. Resume when back.
- **You are out of time:** cut straight from step 1 (spec generated) to step 4 (reveal). The spec + the working result alone tell the story.

General rule: when in doubt, `git switch claude/demo-variant-picker`. It always works.

## Reset to clean (after rehearsing, before the talk)

Put the working branch back to its no-picker state so the live run starts clean:

```
git switch claude/spec-kit-presentation-planning-ljgmfj
git stash drop            # if you stashed during rehearsal
rm -rf specs/001-variant-picker   # remove a live-generated spec, if any
git checkout -- .         # discard any other working changes
git status                # confirm clean, and no specs/001-variant-picker/
```

(The finished artifacts still live safely on `claude/demo-variant-picker`.)

## Appendix: exact commands, in order

```
# live
/speckit.specify <variant picker description>
# show (pre-built)
specs/001-variant-picker/plan.md   (Constitution Check section)
.specify/memory/constitution.md
# live (read-only)
/speckit.analyze
# reveal
git switch claude/demo-variant-picker
npm run dev
# return / reset
git switch claude/spec-kit-presentation-planning-ljgmfj
rm -rf specs/001-variant-picker && git checkout -- .
```
