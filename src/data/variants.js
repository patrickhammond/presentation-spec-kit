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
// keys below via isKnownVariant. When no (or an unknown) variant is given, the
// app shows the variant picker (src/picker/VariantPicker.jsx) instead of
// silently defaulting; see specs/001-variant-picker/.

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

// Each variant also carries `meta` (room, length, demo) so the variant picker
// can list and describe variants straight from this manifest. Source of truth
// for these facts: docs/audience-*.md. Add a variant here and it appears in the
// picker with no other wiring.
export const VARIANTS = {
  ingage: {
    label: "Ingage Lightning Talk",
    meta: {
      room: "Internal, mixed dev + delivery",
      length: "7-8 min",
      demo: false,
    },
    entries: ingageArc,
  },
  gdg: {
    label: "GDG Cincinnati",
    meta: {
      room: "Community, all developers",
      length: "~40 min",
      demo: true,
    },
    entries: gdgArc,
  },
};

// True only for keys defined in VARIANTS. The single source of truth for "what
// variants exist," used by the picker resolution to tell a known variant from an
// unknown one (an unknown one shows the picker rather than silently defaulting).
export function isKnownVariant(key) {
  return Boolean(key) && Object.prototype.hasOwnProperty.call(VARIANTS, key);
}

// Resolve a requested variant key to a known variant, falling back to the
// default. Retained for callers that explicitly want a guaranteed variant (e.g.
// fallback links); the picker path uses isKnownVariant instead and does NOT
// silently default when no variant is given.
export function resolveVariant(key) {
  return isKnownVariant(key) ? key : DEFAULT_VARIANT;
}
