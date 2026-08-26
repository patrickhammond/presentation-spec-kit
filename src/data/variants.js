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
  label: "Your Spec Is Your Contract",
  numbered: false,
};
const hook = {
  type: "slide",
  id: "hook",
  slug: "whats-the-problem",
  label: "What’s the Problem?",
};
const sdd = {
  type: "slide",
  id: "sdd",
  slug: "whats-sdd",
  label: "What’s Spec-Driven Development?",
};
const specKit = {
  type: "slide",
  id: "specKit",
  slug: "whats-spec-kit",
  label: "What’s Spec Kit?",
};
const flow = {
  type: "flow",
  slug: "spec-kit-flow",
  label: "What’s The Process?",
};
const why = {
  type: "slide",
  id: "why",
  slug: "why-should-i-care",
  label: "Why Should I Care?",
};
const honestClose = {
  type: "slide",
  id: "honestClose",
  slug: "what-am-i-still-figuring-out",
  label: "What Am I Still Figuring Out?",
};
const whereToStart = {
  type: "slide",
  id: "whereToStart",
  slug: "where-to-start",
  label: "Where to Start?",
};
const repo = {
  type: "slide",
  id: "repo",
  slug: "can-i-get-the-slides",
  label: "Can I Get the Slides?",
};

// The ingage lightning arc (7-8 min, delivered). Title and creed are unnumbered;
// the section counter starts at the Hook (sections 1-8). What's Next uses the
// component default invite (internal Slack).
const ingageArc = withSections([
  {
    type: "slide",
    id: "title",
    slug: "title",
    label: "Welcome",
    numbered: false,
  },
  creed,
  hook,
  sdd,
  specKit,
  flow,
  why,
  honestClose,
  whereToStart,
  repo,
  { type: "slide", id: "whatsNext", slug: "whats-next", label: "What's Next?" },
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
    label: "Welcome",
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
    label: "Who Am I?",
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
  flow,
  { type: "slide", id: "demo", slug: "demo", label: "Time for a Demo" },
  why,
  {
    type: "slide",
    id: "lessons",
    slug: "what-ive-learned",
    label: "What I've Learned",
  },
  honestClose,
  whereToStart,
  repo,
  {
    type: "slide",
    id: "whatsNext",
    slug: "whats-next",
    label: "What's Next?",
    props: {
      inviteLines: [
        "Let’s make this a group discussion, not a Q&A.",
        "What have you tried, what are you learning, where are you still curious?",
      ],
    },
  },
]);

// The Cincy.dev AI-Augmented Engineers arc (~40 min community talk, no live
// demo). A sibling of the GDG arc, not a fork of it: same shared entries, but
// the demo transition is replaced by two beats that carry the hands-on without
// a terminal on stage.
//
//   - `spectrum`: the tooling landscape, after the SDD slide. The room is
//     agent-fluent, so the four tool names are landmarks rather than subjects,
//     which is what lets it precede "What's Spec Kit?". Its payoff lands later
//     as a lead line on Why Should I Care?, not as a second showing of the
//     chart: the legend is most of the slide's ink, so repeating it read as a
//     duplicate rather than a callback.
//   - `artifacts`: a stepped walk through what each command actually writes,
//     using this repo's own outline-modal artifacts. Its stops are sub-steps of
//     one entry (see src/deck/navigation.js), not separate slides.
//
// The `sdd` ecosystem line is dropped here (`ecosystem: false`): the spectrum
// slide immediately after it names the same landscape in more detail. That line
// also carried the bridge bold, which with the spectrum in between would have
// pointed two slides ahead. See CLAUDE.md content principles.
const cincydevAiArc = withSections([
  {
    type: "slide",
    id: "title",
    slug: "title",
    numbered: false,
    label: "Welcome",
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
    label: "Who Am I?",
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
  {
    type: "slide",
    id: "sdd",
    slug: "whats-sdd",
    label: "What’s Spec-Driven Development?",
    // The spectrum slide is next: it names the landscape properly, so this
    // slide drops its one-line ecosystem mention (and with it the bridge bold,
    // which would otherwise point two slides ahead).
    props: { ecosystem: false },
  },
  {
    type: "slide",
    id: "spectrum",
    slug: "where-does-this-fit",
    label: "Where Does This Fit?",
    props: {
      title: "Where Does This Fit?",
      heading: "There isn’t a winner. There’s a trade.",
      // No body copy on purpose: the heading states the thesis and the chart
      // shows it, so the paragraph under it was read-aloud material the
      // presenter says better than the slide does.
    },
  },
  specKit,
  flow,
  {
    type: "slide",
    id: "artifacts",
    slug: "artifacts",
    label: "What Gets Generated?",
  },
  {
    type: "slide",
    id: "why",
    slug: "why-should-i-care",
    label: "Why Should I Care?",
    // The artifact walk just showed this room the whole cost side, so the
    // payoff slide names it. This replaces a second showing of the spectrum,
    // which repeated too much of its own ink to read as a callback.
    props: {
      leadLines: [
        "You just read everything Spec Kit writes before a line of code exists. *That is what the ceremony buys*: the most to write up front, the least to redo later.",
      ],
    },
  },
  {
    type: "slide",
    id: "lessons",
    slug: "what-ive-learned",
    label: "What I’ve Learned",
  },
  honestClose,
  // The closing run: where to start, then the deck itself, then the ask. Every
  // arc runs whereToStart here, so the "go do it" door sits next to the repo
  // link the room actually leaves with.
  whereToStart,
  // Ends on the repo slide. This arc has no What's Next? beat: the closing ask
  // is made out loud, not on a slide, so the deck the room takes away finishes
  // on the link and the contact details.
  repo,
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
  "cincydev-ai": {
    label: "Cincy.dev – AI-Augmented Engineers",
    meta: {
      room: "Community, agent-fluent developers",
      length: "~40 min",
      demo: false,
    },
    entries: cincydevAiArc,
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
