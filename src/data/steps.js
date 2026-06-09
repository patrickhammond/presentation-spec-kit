export const TIER_META = {
  required: { label: "Required", color: "#EE6823", dashed: false },
  suggested: { label: "Suggested", color: "#3fd6c0", dashed: false },
  // kept in TIER_META for future use; analyze was reclassified to optional
  setup: { label: "Setup", color: "#6b7c91", dashed: false },
  optional: { label: "Optional", color: "#16a34a", dashed: true },
};

export const STEPS = [
  {
    id: "constitution",
    cmd: "/speckit.constitution",
    sub: "Governing principles every spec, plan, and task must satisfy",
    tier: "setup",
    writes: ".specify/memory/constitution.md",
    sum: "Write it once; every feature in the repo inherits it.",
    pts: [
      "Gated at /speckit.plan, not just advisory. /speckit.analyze re-checks it across artifacts and flags violations CRITICAL.",
      'Promote only genuinely checkable values. "Write elegant code" is not checkable.',
      "Amend it and /speckit.constitution re-aligns the plan, spec, and task templates, flagging what it can’t.",
    ],
  },
  {
    id: "specify",
    cmd: "/speckit.specify",
    sub: "Requirements & acceptance criteria",
    tier: "required",
    writes: "spec.md, checklists/requirements.md",
    sum: "Turns intent into a structured spec the agent can act on.",
    pts: [
      "The primary input for everything downstream.",
      "Vague intent in, surprising output out. This is where that gap closes.",
      "Run /speckit.clarify or /speckit.checklist to tighten before planning.",
    ],
  },
  {
    id: "clarify",
    cmd: "/speckit.clarify",
    sub: "Surface & resolve ambiguities",
    tier: "optional",
    writes: "spec.md → ## Clarifications",
    sum: "Up to 5 targeted questions, one at a time.",
    pts: [
      "Pull it whenever the agent is about to build on a guess.",
      "Best run before /speckit.plan, so design starts from settled requirements.",
      "Scans nine areas of ambiguity, from scope and data model to edge cases and acceptance criteria.",
    ],
  },
  {
    id: "checklist",
    cmd: "/speckit.checklist",
    sub: "Quality-check the spec itself",
    tier: "optional",
    writes: "checklists/*.md",
    sum: "Generates domain-specific quality checks for the spec itself.",
    pts: [
      "Quality checks for the spec: complete? clear? measurable?",
      "Different from /speckit.analyze: within-doc quality, not cross-artifact.",
      "Generates the checks; gaps you find send you back to sharpen the spec.",
    ],
  },
  {
    id: "plan",
    cmd: "/speckit.plan",
    sub: "Technical design & architecture",
    tier: "required",
    writes: "plan.md, research.md, data-model.md, contracts/, quickstart.md",
    sum: "Translates the spec into a concrete technical design.",
    pts: [
      "Architecture decisions live here, not in the spec.",
      "/speckit.analyze cross-checks this against the spec, so mismatches surface before coding.",
      "Equivalent to a technical design doc or ADR.",
    ],
  },
  {
    id: "tasks",
    cmd: "/speckit.tasks",
    sub: "Work breakdown & dependencies",
    tier: "required",
    writes: "tasks.md",
    sum: "Breaks the plan into discrete, ordered work items with explicit dependencies.",
    pts: [
      "Dependency ordering is the key output. The agent executes in that order, running independent tasks in parallel.",
      "Each task is scoped to one concern and traceable to a spec requirement.",
      "Granularity here determines how mechanical /speckit.implement becomes.",
    ],
  },
  {
    id: "analyze",
    cmd: "/speckit.analyze",
    sub: "Cross-artifact consistency check",
    tier: "optional",
    writes: "analysis report (read-only)",
    sum: "Cross-checks spec, plan, and tasks for consistency with each other and the constitution. Read-only: it reports the gaps, you decide the fixes.",
    pts: [
      "Flags duplication, ambiguity, gaps, inconsistency, and constitution violations, severity-rated.",
      "Keeps every artifact aligned so the agent can’t drift from the goal.",
      "Loop back to fix, then re-run. Once it’s clean, /speckit.implement is mechanical.",
    ],
  },
  {
    id: "implement",
    cmd: "/speckit.implement",
    sub: "Agent executes the build",
    tier: "required",
    writes: "source code",
    sum: "The coding sprint. Agent executes against spec, plan, and tasks.",
    pts: [
      "By this point the build is mechanical.",
      "First pass is closer to the last pass: less rework, tighter estimates.",
      "The loop guarantees consistency, not correctness. Human review stays load-bearing.",
    ],
  },
];

export const STEP_IDS = STEPS.map((s) => s.id);
export const STEP_MAP = Object.fromEntries(STEPS.map((s) => [s.id, s]));
