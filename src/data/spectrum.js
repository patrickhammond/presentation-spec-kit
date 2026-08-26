// Single source of truth for the tooling spectrum slide.
//
// Coordinates are cartesian and normalized 0-1, origin bottom-left: x is
// ceremony (light to heavy), y is churn (low to high). The stylesheet consumes
// them as --x / --y custom properties, so nudging a placement after a rehearsal
// is a one-line edit here and nothing else.
//
// The two axes are strongly correlated on purpose, so the tools land on a
// near-diagonal. That is the point of the slide rather than a flaw in it: more
// ceremony up front buys less churn later. You pay either way, just at different
// times.
//
// The x axis is read twice on purpose. It is what the tool costs you, and it is
// also the problem complexity the tool is built for: every `when` line below is
// keyed to complexity, not to diligence. That second reading is what turns the
// chart from a catalog into a diagnostic, because the failure mode is a
// mismatch (full ceremony on a one-line fix, a bare prompt on something with
// fifteen moving parts) rather than picking the "wrong" tool. Keep the axis
// labelled Ceremony: collapsing the two readings into one label loses the
// distinction the diagnosis depends on. No tool is the winner, which is why
// nothing is highlighted unless the caller asks for it.

export const SPECTRUM_AXES = {
  x: { label: "Ceremony", low: "Light", high: "Heavy" },
  y: { label: "Churn", low: "Low", high: "High" },
};

export const SPECTRUM_TOOLS = [
  {
    id: "prompting",
    name: "AGENTS.md + Prompting",
    x: 0.08,
    y: 0.9,
    when: "When the change is small enough to hold in your head.",
  },
  {
    id: "superpowers",
    name: "Superpowers",
    x: 0.34,
    y: 0.66,
    when: "When you want a repeatable way of working, not a document per change.",
  },
  {
    id: "openspec",
    name: "OpenSpec",
    x: 0.72,
    y: 0.27,
    when: "When a change deserves a written proposal, but not a lifecycle.",
  },
  {
    id: "speckit",
    name: "Spec Kit",
    x: 0.9,
    y: 0.11,
    when: "When there are enough moving parts that you’d rather sort them out before any code.",
  },
];

// Named but deliberately not plotted. The four points above are enough to read
// the trade at a glance; plotting every tool would turn the chart into a
// scatter nobody can parse from the back of a room. This line keeps the
// landscape honest (it is wider than four names) without paying for it in
// clutter. In the cincydev-ai arc the SDD slide drops its own ecosystem
// sentence, so this is the only place these names appear.
export const SPECTRUM_ALSO =
  "Others land on this line too: GSD, Grill Me, and whatever ships next month.";

export const SPECTRUM_IDS = SPECTRUM_TOOLS.map((t) => t.id);
