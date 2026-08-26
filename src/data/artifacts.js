// Single source of truth for the stepped artifact walkthrough (the `artifacts`
// slide). One stop per command that actually produced something on this
// feature, in run order.
//
// `/speckit.checklist` has no stop on purpose: it was never run here, so there
// are no domain checklists (ux.md, api.md, security.md) on the branch. The
// `checklists/requirements.md` that does exist was seeded by `/speckit.specify`
// (it landed in the same commit as spec.md) and ticked by `/speckit.clarify`,
// so it belongs to the specify stop. Attribute artifacts to the command that
// wrote them, never to the command they sound like.
//
// The content is the real Spec Kit output for this repository's own presenter
// outline modal feature, so the walk is self-referential: the deck explains
// Spec Kit using the artifacts that built a feature of the deck.
//
// Treatment is structure, not text. `shape` is the artifact's real section
// headings, which is what makes the walk readable from the back of a room;
// `pull` is one line from the file, normalized only for legibility (inline-code
// backticks stripped, since the block already renders in monospace; a table row
// reduced to its cells, since pipes and padding are unreadable in a narrow
// column at projector type size). Never reword one: if it will not fit, pick a
// shorter line rather than paraphrasing the file; `callout` is our
// plain-language "what to notice", written to stand alone in the leave-behind.
// `callout` is an array of paragraphs. Inside one, `backticks` render as inline
// code and *asterisks* as the orange accent (see withInline in SlideShow.jsx),
// so commands and file names look like what they are and a stop can mark the
// one phrase it turns on.

export const ARTIFACT_FEATURE = {
  name: "Presenter Outline Modal",
  dir: "specs/001-outline-modal/",
};

export const ARTIFACTS = [
  {
    id: "constitution",
    cmd: "/speckit.constitution",
    title: "Not advice. A gate.",
    files: [".specify/memory/constitution.md"],
    shape: [
      "## Core Principles",
      "### I. No Inline Style Props",
      "### II. Single Source of Truth",
      "### III. Projector-Readable and Accessible",
      "### IV. Brand Voice in Audience-Facing Copy",
      "### V. Definition of Done",
      "### VI. No Artifact IDs in Source",
      "## Governance",
    ],
    pull: "Inline style props with static values are never permitted.",
    callout: [
      "Your `AGENTS.md` is advice the agent might take. *This is the gate.*",
      "`/speckit.plan` checks it before it designs anything, and `/speckit.analyze` re-checks it across every artifact.",
    ],
  },
  {
    id: "spec",
    cmd: "/speckit.specify",
    title: "The what and the why.",
    files: ["spec.md", "checklists/requirements.md"],
    shape: [
      "# Feature Specification: Presenter Outline Modal",
      "## Clarifications",
      "### Session 2026-06-17",
      "## User Scenarios & Testing",
      "### User Story 1 – Jump to a slide during a talk (P1)",
      "### Edge Cases",
      "## Requirements",
      "### Functional Requirements",
      "### Key Entities",
      "## Success Criteria",
      "## Assumptions",
    ],
    pull: "SC-003: No audience member can discover the outline feature from any visible element in the deck UI.",
    callout: [
      "No tech stack, no APIs, no code structure.",
      "It also seeds a quality checklist for free, and `/speckit.clarify` writes its answers back into this same file.",
    ],
  },
  {
    id: "plan",
    cmd: "/speckit.plan",
    title: "The technical design.",
    files: [
      "plan.md",
      "research.md",
      "data-model.md",
      "contracts/",
      "quickstart.md",
    ],
    shape: [
      "## Summary",
      "## Technical Context",
      "## Constitution Check",
      "## Project Structure",
      "## Phase 0: Research",
      "## Phase 1: Design & Contracts",
      "## Complexity Tracking",
    ],
    pull: "Add label field to every slide entry in variants.js (matches the existing flow entry pattern). See data-model for the full label table.",
    callout: [
      "One command, a whole cluster of files.",
      "The spec said what. *This is where how gets decided*, written down with the reasoning, and cross-referenced to the other files it just wrote.",
    ],
  },
  {
    id: "tasks",
    cmd: "/speckit.tasks",
    title: "The work breakdown, in order.",
    files: ["tasks.md"],
    shape: [
      "## Phase 1: Setup",
      "## Phase 2: User Story 1 (P1)",
      "## Phase 3: User Story 2 (P2)",
      "## Phase 4: User Story 3 (P3)",
      "## Phase 5: Polish & Cross-Cutting Concerns",
      "## Dependencies & Execution Order",
      "### Parallel Opportunities",
    ],
    pull: "- [x] T002 [P] [US1] Add all .outline-* CSS classes to src/index.css",
    callout: [
      "An ID, a parallel marker, a story label, and a file path. Each task is executable without reading your mind.",
      "*And it is sequenced.* Phases, what depends on what, and which tasks could safely run in parallel, so you can put more than one agent to work.",
    ],
  },
  {
    id: "analyze",
    cmd: "/speckit.analyze",
    title: "The one that writes nothing.",
    files: [],
    shape: [
      "Duplication",
      "Ambiguity",
      "Underspecification",
      "Constitution alignment",
      "Coverage gaps",
      "Inconsistency",
    ],
    pull: "STRICTLY READ-ONLY: Do not modify any files. Output a structured analysis report.",
    callout: [
      "Six categories, checked across spec, plan, tasks, and constitution at once. It surfaces the gap; you loop back to the artifact that was wrong.",
    ],
  },
];

export const ARTIFACT_IDS = ARTIFACTS.map((a) => a.id);
