// Per-variant deck manifest. Single source of truth for which slides appear, in
// what order, with what section counter and URL slug, per talk variant
// (architecture C: one slide set, many variants). Audience profiles for each
// variant live in docs/audience-*.md; the index is docs/audience.md.
//
// Entry shapes:
//   { type: "slide", id, slug, section?, props? }
//     - `id` maps to a component in SLIDE_REGISTRY (src/slides/SlideShow.jsx)
//     - `section` is the printed counter ("01" …); omit for unnumbered slides
//       (title, epigraph)
//     - `props` are passed to the slide component, for per-variant copy
//   { type: "flow", slug, section, label }
//     - the interactive React Flow block; has no slide component
//
// Selected at load time by the `?variant=` query param, validated against the
// keys below. There is intentionally no hard-coded fallback chain beyond
// DEFAULT_VARIANT; a future "variant picker" feature (no default, user chooses)
// is planned and is the subject of the live demo.

export const DEFAULT_VARIANT = "ingage";

// The current shared arc. Both variants reference it today; `gdg` diverges in a
// later content pass (intro / who-am-I, "time for the demo", expanded close).
const baseArc = [
  { type: "slide", id: "title", slug: "title" },
  { type: "slide", id: "requirements", slug: "quote-requirements" },
  { type: "slide", id: "hook", slug: "whats-the-problem", section: 1 },
  { type: "slide", id: "sdd", slug: "whats-sdd", section: 2 },
  { type: "slide", id: "specKit", slug: "whats-spec-kit", section: 3 },
  {
    type: "flow",
    slug: "spec-kit-flow",
    section: 4,
    label: "What’s The Process?",
  },
  { type: "slide", id: "why", slug: "why-should-i-care", section: 5 },
  {
    type: "slide",
    id: "honestClose",
    slug: "what-am-i-still-figuring-out",
    section: 6,
  },
  { type: "slide", id: "whereToStart", slug: "where-to-start", section: 7 },
  { type: "slide", id: "whatsNext", slug: "whats-next", section: 8 },
];

export const VARIANTS = {
  ingage: {
    label: "Ingage Lightning Talk",
    entries: baseArc,
  },
  gdg: {
    label: "GDG Cincinnati",
    // Transitional: mirrors the lightning arc until the GDG content pass.
    entries: baseArc,
  },
};

// Resolve a requested variant key to a known variant, falling back to the
// default. Returns the variant key (not the object) so callers can also reflect
// it in the URL.
export function resolveVariant(key) {
  return key && Object.prototype.hasOwnProperty.call(VARIANTS, key)
    ? key
    : DEFAULT_VARIANT;
}
