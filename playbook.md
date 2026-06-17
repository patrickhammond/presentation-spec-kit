# Dry-Run Playbook: "Secret Outline Modal" via Spec Kit

Install Spec Kit into this repo, write a real constitution from the house rules, then
spec to build a feature where pressing `o` opens a hidden outline modal to jump anywhere
in the deck. This is a rehearsal to practice the live demo flow, not the talk setup.

**Time:** ~30-45 min at a relaxed pace. The point is rehearsal, not speed.

---

## Repo reality check (read before Phase 1)

Verified on 2026-06-17, branch `main`:

- **Nothing Spec Kit is installed on main.** No `.specify/`, no `specs/`, no
  `.claude/skills/speckit-*`. This is a genuinely clean slate.
- `--integration claude` installs Spec Kit as **`.claude/skills/speckit-*`** (not `.claude/commands/`).
- `.gitignore` has no entries for `.specify/` or `specs/`, so a dry-run feature will show up
  in `git status` until you delete the branch.

---

## Phase 0 — Pre-flight (2 min)

```bash
git status                            # confirm clean tree
git switch main                       # start from the clean slate
git switch -c dryrun/outline-modal    # throwaway branch; keeps main pristine
npm run dev                           # leave running in another tab (localhost:5173)
specify version                       # 0.11.0, already on PATH
```

Why a branch: `specify init` scaffolds files and `/speckit.implement` writes code. You want a
throwaway branch you can delete, so main stays pristine for the real talk.

---

## Phase 1 — Install Spec Kit into the repo (3 min)

```bash
specify init --here --integration claude --force
```

- `--here` scaffolds into the current directory instead of creating a new one.
- `--integration claude` installs the Claude Code skills, which give you `/speckit.*`.
- `--force` skips the "directory not empty" prompt.

Inspect what it added before trusting it:

```bash
git status                  # expect new .specify/ and .claude/skills/speckit-*
git diff --stat
```

This repo already has `.claude/settings.json`, `.claude/settings.local.json`, and
`.claude/agents/context-architect.md`. Init should only add a skills subtree under `.claude/`,
but eyeball the diff to confirm it left your existing settings and agent untouched.

**Restart Claude Code** (or `/exit` and reopen) so the new `/speckit.*` commands register.
Confirm by typing `/speckit.` and seeing the eight commands.

---

## Phase 2 — `/speckit.constitution` (5 min, the beat that matters)

Don't let it auto-generate generic fluff. Feed it the real house rules from `AGENTS.md`.

```
/speckit.constitution Derive the project constitution from AGENTS.md and the docs/ folder
in this repo. The non-negotiable principles are: (1) No inline style props — all styling lives
in src/index.css keyed by class; per-render values pass as CSS custom properties. (2) Single
source of truth — slide order/numbering/slugs come from src/data/variants.js, flow content from
src/data/steps.js; never hardcode. (3) No em dashes anywhere; use commas, periods, or en dashes.
(4) Curly apostrophes and quotes in all audience-facing copy. (5) Monospace (IBM Plex Mono)
only for section labels/titles and code, never prose or UI copy. (6) Projector-readable:
vmin-scaled type, >=27px body / >=54px headings at 1080p, contrast >=4.5:1 for anything the
audience reads. (7) Run npm run lint and npm test before any change is considered done.
```

Inspect: open `.specify/memory/constitution.md`. Confirm it filled the `[PLACEHOLDER]` tokens
with _your_ rules, not boilerplate. This file is the gate every later step checks against.
If it's weak, edit it by hand now. That's allowed and expected.

---

## Phase 3 — `/speckit.specify` (4 min)

Describe WHAT and WHY, not HOW. The command may ask up to 3 clarifying questions.

```
/speckit.specify Add a hidden "outline" overlay to the deck. When the presenter presses the
"o" key, a modal opens listing every entry in the current talk variant in order — section
number, title, and a marker for the interactive flow — so I can jump directly to any slide or
to the flow during a talk. Selecting an entry navigates the deck there and closes the modal.
Pressing "o" again or Escape closes it. It is presenter-only: there is no visible button or
hint that it exists. It must work for any variant, reading the entry list from the variant
manifest rather than a hardcoded list.
```

Inspect: open the generated `specs/001-<name>/spec.md`. Scroll **User Scenarios** and
**Success Criteria**. This is the "it's just a PRD, except an agent will act on it" moment.
Since no `specs/` existed, this is feature `001`.

---

## Phase 4 — `/speckit.clarify` (3 min, loops back to specify)

```
/speckit.clarify
```

Up to 5 targeted questions, one at a time, appending a `## Clarifications` section to `spec.md`.
Decide your answers in advance so you can narrate. Good ambiguities for _this_ feature:

- Does `o` work **inside the flow** too, or only on slides? (The flow already binds Esc to
  "return to overview" — see `src/App.jsx:132`. Your answer affects how Esc is dispatched
  when the modal is open.)
- When you jump **to the flow**, does it land on the overview or a specific step node?
- Should the currently-displayed entry be **highlighted** in the outline?
- Focus behavior: does the modal trap focus and restore it on close (accessibility)?

---

## Phase 5 — `/speckit.checklist` (optional, 2 min, loops to specify)

```
/speckit.checklist
```

"Unit tests for requirements writing." For a presenter UI feature, the useful checklists are
**ux** and **a11y**. Skim `specs/001-<name>/checklists/*.md` and confirm items like "keyboard
reachability specified," "contrast specified," "behavior when modal already open specified."
Skip if you're tight on time; it's optional.

---

## Phase 6 — `/speckit.plan` (3 min)

```
/speckit.plan
```

Inspect: open `specs/001-<name>/plan.md` and go straight to the **Constitution Check** section.
This is the talk's money shot. The plan has to pass your house rules before any code. Confirm
the plan proposes:

- New modal component + styles **in `src/index.css`** (not inline).
- Reading entries from the `entries` array already in `Deck` (`src/App.jsx:61`), not a new
  hardcoded list.
- Reusing the existing `navigateTo(i)` path (`src/App.jsx:120`).

If the plan suggests inline styles or a duplicate slide list, the Constitution Check should flag
it. If it doesn't, your constitution (Phase 2) was too soft. Go back and tighten it.

---

## Phase 7 — `/speckit.tasks` (2 min)

```
/speckit.tasks
```

Inspect: `specs/001-<name>/tasks.md`. Dependency-ordered, IDs `T001…`, `[P]` parallel markers,
explicit file paths. Each task should be executable without extra context. Expect: add modal
component, add CSS, wire the `o` keydown into the `Deck` handler, add the test, update docs.

---

## Phase 8 — `/speckit.analyze` (3 min, read-only, safe to run live)

```
/speckit.analyze
```

**Strictly read-only — writes nothing.** Cross-checks spec + plan + tasks + constitution across
6 categories (duplication, ambiguity, underspecification, constitution alignment, coverage gaps,
inconsistency), severity-rated in a table. It will _offer_ remediation suggestions but never
auto-applies them. When it surfaces a gap, **you** loop back (Phase 3/6/7) and fix it. This is
"the PR review, happening before a line of code."

---

## Phase 9 — `/speckit.implement` (5-10 min)

```
/speckit.implement
```

Mechanical by now: executes the tasks against spec + plan. Watch whether the agent stays inside
the constitution, especially **no inline `style` props** and reading entries from the manifest.
The loop guarantees _consistency, not correctness_, so your review still matters.

Two `o`-specific things to verify in the diff personally:

1. **Esc dispatch order.** Existing code (`src/App.jsx:131-139`) uses Esc inside the flow to reset
   to overview. The modal's Esc handler must take precedence when open, or pressing Esc to close
   the modal will also reset the flow.
2. **`o` doesn't collide.** It's currently unbound, so you're clear, but confirm the handler is
   sane (no text inputs exist in this app, so collision risk is low).
