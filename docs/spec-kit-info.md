# Spec Kit command reference (verified facts)

Verified against `github/spec-kit@main` command templates (`templates/commands/*.md`) on
**2026-06-06**. This is the source of truth for what each command actually does, so we don't
have to re-fetch the repo. Re-verify against the README + command files before any future
content pass. Our flow content lives in [`../src/data/steps.js`](../src/data/steps.js).

Command prefix is `/speckit.` (e.g. `/speckit.specify`).

## Recommended order

`/constitution` → `/specify` → `/clarify` → `/checklist` → `/plan` → `/tasks` → `/analyze` → `/implement`

- **Required:** constitution(\*), specify, plan, tasks, implement
- **Optional but encouraged:** clarify (before plan), analyze (after tasks, before implement)
- **Project-dependent:** checklist, taskstoissues
- `/analyze` runs **after** task generation is complete (confirmed in `analyze.md`). Our
  placement of analyze after tasks is correct.

## Per-command facts

### `/speckit.constitution` — Setup

- Writes: `.specify/memory/constitution.md` (a template with `[PLACEHOLDER]` tokens it fills in).
- Governing principles every spec/plan/task must satisfy. Gated at `/plan` (the plan
  template has a `## Constitution Check` section: "GATE: Must pass before Phase 0 research.
  Re-check after Phase 1 design.") and re-checked across artifacts by the optional `/analyze`.
- Updating it triggers sync across dependent templates (plans, specs, tasks, command docs).

### `/speckit.specify` — Required

- Writes: `spec.md` (primary). **Also auto-seeds** `checklists/requirements.md` and
  `.specify/feature.json` (resolved feature dir path). We simplify `writes` to just `spec.md`.
- Generates a 2-4 word feature name, creates a numbered dir under `specs/`, populates spec
  template (functional requirements, user scenarios, success criteria, key entities).
- Focus on WHAT/WHY, not HOW (no tech stack/APIs/code structure). May ask up to 3 clarifying Qs.

### `/speckit.clarify` — Optional (loops to specify)

- Writes: appends `## Clarifications` section with a `### Session YYYY-MM-DD` subsection,
  in-place in `spec.md`; also toggles the requirements checklist checkboxes if it exists.
- Up to **5** targeted questions, one at a time, across a 9-category ambiguity taxonomy.
- **Expected to run BEFORE `/plan`** (explicit in the command file).

### `/speckit.checklist` — Optional (loops to specify)

- Writes: `FEATURE_DIR/checklists/*.md`, **domain-specific** names (`ux.md`, `api.md`,
  `security.md`). Appends to existing files, continuing ID numbering.
- Philosophy: **"Checklists are unit tests for requirements writing"** — validates the spec
  in English the way unit tests validate code. Items ask "Are X requirements specified?"
- vs analyze: checklist = within-one-doc requirement quality; analyze = cross-artifact.

### `/speckit.plan` — Required

- Writes: the impl plan file (`plan.md`), plus `research.md`, `data-model.md`, `/contracts/*`,
  `quickstart.md`, and updates the agent context file. We simplify `writes` to
  `plan.md, data-model, contracts`.
- Reads (read-only): spec, constitution, extensions hooks. Translates spec → technical design.

### `/speckit.tasks` — Required

- Writes: `tasks.md` in the feature dir.
- Dependency-ordered phases: Setup → Foundational → User Stories (priority order) → Polish.
- Task format: IDs (`T001`...), parallel markers `[P]`, story labels `[US1]`, file paths.
  Each task must be executable by an LLM without extra context.

### `/speckit.analyze` — Optional (loops to specify/plan/tasks)

- **STRICTLY READ-ONLY. Writes NOTHING to spec/plan/tasks.** Command file says verbatim:
  > "STRICTLY READ-ONLY: Do not modify any files. Output a structured analysis report."
  > "NEVER modify files (this is read-only analysis)"
- It will **offer** to _suggest_ remediation edits ("Would you like me to suggest concrete
  remediation edits for the top N issues?") but **never applies them automatically**.
- Cross-checks `spec.md` + `plan.md` + `tasks.md` + constitution across 6 categories:
  duplication, ambiguity, underspecification, constitution alignment, coverage gaps,
  inconsistency. Findings severity-rated CRITICAL/HIGH/MEDIUM/LOW in a Markdown table.
- ⚠️ Earlier versions of our `steps.js` claimed analyze "writes fixes back into the
  artifacts" — that is **FALSE** per current docs. The loops mean: analyze _surfaces_ gaps,
  _you_ loop back to fix them.

### `/speckit.implement` — Required

- Writes: source code. Executes against spec + plan + tasks; mechanical by this point.
- The loop guarantees **consistency, not correctness** — human review stays load-bearing.

## Commands we intentionally omit

- **`/speckit.taskstoissues`** — turns `tasks.md` into GitHub issues. A GitHub-specific
  integration, not core to the SDD thesis. Kept out of the 8-step arc on purpose.
