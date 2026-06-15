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
    entries: baseArc,
  },
  gdg: {
    label: "GDG Cincinnati",
    meta: {
      room: "Community, all developers",
      length: "~40 min",
      demo: true,
    },
    // Transitional: mirrors the lightning arc until the GDG content pass.
    entries: baseArc,
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
