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

// The ingage lightning arc (7-8 min, delivered). Section counter starts at the
// Hook; title and the requirements creed are unnumbered.
const ingageArc = [
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

// The GDG Cincinnati arc (~40 min community talk, all-dev). Superset of the
// lightning arc: adds an intro/who-am-I, a "time for the demo" transition (the
// centerpiece), and a practitioner "what I've learned" beat; re-points the close
// to a community invite (no internal Slack); sections renumber accordingly.
// Per-variant copy is plain-data props (no JSX in this data module).
const gdgArc = [
  {
    type: "slide",
    id: "title",
    slug: "title",
    props: {
      taglineLines: [
        "Structured requirements an agent can act on.",
        "Results that land closer to done.",
        "Fits how you already work.",
      ],
    },
  },
  {
    type: "slide",
    id: "whoami",
    slug: "who-am-i",
    props: {
      name: "Patrick Hammond",
      role: "Director at Ingage Partners. Co-founder and CTO at Atomic Robot.",
      points: [
        "Co-organizer of GDG Cincinnati and Ohio DevFest.",
        "Led the first Android mobile team at Kroger.",
        "20+ years in, and having more fun building software than ever.",
      ],
      photo: "/img/patrick-hammond.jpg",
      photoAlt: "Patrick Hammond",
    },
  },
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
  { type: "slide", id: "demo", slug: "demo", section: 5 },
  { type: "slide", id: "why", slug: "why-should-i-care", section: 6 },
  { type: "slide", id: "lessons", slug: "what-ive-learned", section: 7 },
  {
    type: "slide",
    id: "honestClose",
    slug: "what-am-i-still-figuring-out",
    section: 8,
  },
  { type: "slide", id: "whereToStart", slug: "where-to-start", section: 9 },
  {
    type: "slide",
    id: "whatsNext",
    slug: "whats-next",
    section: 10,
    props: {
      inviteLines: [
        "If you’re building with any of this, I want to hear how it goes.",
        "Come find me, I help organize GDG Cincinnati and Ohio DevFest.",
      ],
    },
  },
];

export const VARIANTS = {
  ingage: {
    label: "Ingage Lightning Talk",
    entries: ingageArc,
  },
  gdg: {
    label: "GDG Cincinnati",
    entries: gdgArc,
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
