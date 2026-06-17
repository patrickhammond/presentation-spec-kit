// Per-variant deck manifest. Single source of truth for which slides appear, in
// what order, with what section counter and URL slug, per talk variant
// (architecture C: one slide set, many variants). Audience profiles for each
// variant live in docs/audience-*.md; the index is docs/audience.md.
//
// Entry shapes:
//   { type: "slide", id, slug, numbered?, props? }
//     - `id` maps to a component in SLIDE_REGISTRY (src/slides/SlideShow.jsx)
//     - `numbered: false` marks a slide that is not numbered presentation
//       content: a cold open or meta slide (title, creed, who-am-I). The
//       who-am-I keeps a hardcoded "00" label (see WhoAmISlide) as a cute "this
//       is a slide, but not content" marker. Every other entry is numbered in
//       order by withSections.
//     - `props` are passed to the slide component, for per-variant copy
//   { type: "flow", slug, label }
//     - the interactive React Flow block; has no slide component, but IS numbered
//
// Section counters are derived from position (withSections), not written by hand,
// so inserting or reordering an entry renumbers the rest automatically.
//
// Selected at load time by the `?variant=` query param, validated against the
// keys below via isKnownVariant. When no (or an unknown) variant is given, the
// app shows the variant picker (src/picker/VariantPicker.jsx) instead of
// silently defaulting.

export const DEFAULT_VARIANT = "ingage";

// Assign sequential section numbers ("01", "02" …) to numbered entries by
// position, leaving `numbered: false` entries without a section. Returns fresh
// objects so shared entry constants below are never mutated (and the `numbered`
// marker is stripped from the result the app sees).
function withSections(entries) {
  let n = 0;
  return entries.map(({ numbered, ...rest }) => {
    if (numbered === false) return rest;
    n += 1;
    return { ...rest, section: n };
  });
}

// Entries shared verbatim across variants (defined once). Title and What's Next
// differ by per-variant props, so they are written inline in each arc; who-am-I,
// the demo transition, and the lessons beat are gdg-only.
const creed = {
  type: "slide",
  id: "requirements",
  slug: "quote-requirements",
  numbered: false,
};
const hook = { type: "slide", id: "hook", slug: "whats-the-problem" };
const sdd = { type: "slide", id: "sdd", slug: "whats-sdd" };
const specKit = { type: "slide", id: "specKit", slug: "whats-spec-kit" };
const flow = {
  type: "flow",
  slug: "spec-kit-flow",
  label: "What’s The Process?",
};
const why = { type: "slide", id: "why", slug: "why-should-i-care" };
const honestClose = {
  type: "slide",
  id: "honestClose",
  slug: "what-am-i-still-figuring-out",
};
const whereToStart = {
  type: "slide",
  id: "whereToStart",
  slug: "where-to-start",
};

// The ingage lightning arc (7-8 min, delivered). Title and creed are unnumbered;
// the section counter starts at the Hook (sections 1-8). What's Next uses the
// component default invite (internal Slack).
const ingageArc = withSections([
  { type: "slide", id: "title", slug: "title", numbered: false },
  creed,
  hook,
  sdd,
  specKit,
  flow,
  why,
  honestClose,
  whereToStart,
  { type: "slide", id: "whatsNext", slug: "whats-next" },
]);

// The GDG Cincinnati arc (~40 min community talk, all-dev). Superset of the
// lightning arc: adds an unnumbered who-am-I, a "time for the demo" transition
// (the centerpiece), and a practitioner "what I've learned" beat; re-points the
// close to a community invite (no internal Slack). Sections renumber to 1-10
// automatically. Per-variant copy is plain-data props (no JSX in this module).
const gdgArc = withSections([
  {
    type: "slide",
    id: "title",
    slug: "title",
    numbered: false,
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
    numbered: false,
    props: {
      name: "Patrick Hammond",
      points: [
        "Director at Ingage Partners.",
        "Previous co-founder and CTO at Atomic Robot.",
        "Co-organizer of GDG Cincinnati and Ohio DevFest.",
      ],
      standout:
        "20+ years creating software… and having more fun now than ever before!",
      photo: "/img/patrick-hammond.jpg",
      photoAlt: "Patrick Hammond",
    },
  },
  creed,
  hook,
  sdd,
  specKit,
  whereToStart,
  flow,
  { type: "slide", id: "demo", slug: "demo" },
  why,
  { type: "slide", id: "lessons", slug: "what-ive-learned" },
  honestClose,
  {
    type: "slide",
    id: "whatsNext",
    slug: "whats-next",
    props: {
      inviteLines: [
        "Let’s make this a group discussion, not a Q&A.",
        "What have you tried, what are you learning, where are you still curious?",
      ],
    },
  },
]);

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
