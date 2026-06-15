// This module is a registry of slide components plus the SLIDE_REGISTRY map the
// variant manifest indexes into. The non-component export trips react-refresh's
// "only export components" rule (as the old SLIDE_SLUGS export did); fast-refresh
// of a single slide is not worth splitting the deck across files.
/* eslint-disable react-refresh/only-export-components */
import { Fragment } from "react";

// ── Primitives ──────────────────────────────────────────────────────────────

function Label({ n, title }) {
  return (
    <p className="sl-label">
      <span className="sl-label-n">{String(n).padStart(2, "0")}</span>
      <span className="sl-label-sep"> · </span>
      {title}
    </p>
  );
}

// ── Individual slides ─────────────────────────────────────────────────────────
//
// Slides are pure components, registered by id in SLIDE_REGISTRY and ordered per
// variant by the manifest in src/data/variants.js (architecture C). The section
// counter ("01" …) is NOT hardcoded here: it varies per variant, so numbered
// slides receive it as the `section` prop and the manifest supplies the value.
// Per-variant copy differences are passed as props too (see byline / close).

// taglineLines is plain data (array of strings) so the manifest can vary the
// byline per variant without JSX in the data file. Lines render stacked.
function TitleSlide({
  taglineLines = [
    "Structured requirements an agent can act on.",
    "Results that land closer to done.",
    "Fits how we already work.",
  ],
}) {
  return (
    <div className="slide slide--center slide--title">
      <img
        src="/logos/ingage-logo-orange-blue2025.png"
        alt="Ingage"
        className="sl-logo-hero"
      />
      <h1 className="sl-h1 sl-h1--hero">Understanding Spec&nbsp;Kit</h1>
      <p className="sl-tagline">
        {taglineLines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>
    </div>
  );
}

// Unnumbered epigraph (cold open) between Title and Hook. Anchors the talk in a
// discipline the room already knows, before the Hook reframes it as the AI-era
// trust problem. No Label on purpose: the section counter starts at the Hook.
function RequirementsSlide() {
  return (
    <div className="slide slide--center">
      <blockquote className="sl-quote sl-quote--hero">
        <span className="sl-quote-mark" aria-hidden="true">
          “
        </span>
        Don’t start coding until we understand the requirements.
        <cite className="sl-cite">– every senior dev, eventually</cite>
      </blockquote>
    </div>
  );
}

function HookSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What’s the Problem?" />
      <h1 className="sl-h1">
        Speed isn’t the problem.
        <br />
        Drift is.
      </h1>
      <p className="sl-body">
        Hand an agent a vague ask and it builds something in seconds: fast,
        confident, and <em className="sl-em">not always what you meant</em>. The
        distance between what you intended and what got built is where the
        surprises and rework hide.
      </p>
      {/* Bridge bold: foreshadows the next slide (SDD). See CLAUDE.md content principles. */}
      <p className="sl-body">
        <strong>Spec-Driven Development</strong> closes that gap.
      </p>
    </div>
  );
}

function SddSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What’s Spec-Driven Development?" />
      <div className="sl-split">
        <div className="sl-split-main">
          <h1 className="sl-h1">It’s the workflow you already do.</h1>
          <p className="sl-body">
            Spec-Driven Development (SDD) is just that. The difference: each
            artifact becomes an{" "}
            <em className="sl-em">executable input for an AI agent</em>, not a
            document that rots in a wiki or far away in an issue tracker.
          </p>
          {/* Bridge bold: foreshadows the next slide (Spec Kit). See CLAUDE.md content principles. */}
          <p className="sl-body">
            <strong>Spec Kit</strong> is a toolkit for SDD. OpenSpec, Kiro, and
            others exist too.
          </p>
        </div>
        {/* Vertical (top-to-bottom) to prime the same orientation as the #spec-kit-flow slide */}
        <div className="sl-split-aside">
          <div className="sl-chips">
            <span className="sl-chip">Kick-off</span>
            <span className="sl-chip-arrow">↓</span>
            <span className="sl-chip">Requirements</span>
            <span className="sl-chip-arrow">↓</span>
            <span className="sl-chip">Design</span>
            <span className="sl-chip-arrow">↓</span>
            <span className="sl-chip">Tasks</span>
            <span className="sl-chip-arrow">↓</span>
            <span className="sl-chip">Implement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecKitSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What’s Spec Kit?" />
      <h1 className="sl-h1">Specs, plans, and tasks, as plain Markdown.</h1>
      <p className="sl-body">
        Spec Kit is the toolkit that puts SDD into practice. It’s{" "}
        <em className="sl-em">agent-agnostic</em>: works with Claude, Copilot,
        Cursor, and more.
      </p>
      <p className="sl-body">
        Artifacts are text files, so your agents read them directly. Versioned
        with your code, so every decision is traceable.
      </p>
      <div className="sl-spec-wrap">
        <span className="sl-spec-file">spec.md</span>
        <div className="sl-spec" aria-label="Example spec.md">
          <span className="tok-h">
            # Feature: A lightning talk introducing Spec Kit
          </span>
          {"\n"}
          {"\n"}
          <span className="tok-sec">## Requirements</span>
          {"\n"}
          {"- Audience: experienced developers + delivery staff (~40)\n"}
          {"- Runtime: 8 minutes, **no live demo**\n"}
          {"- Outcome: audience can place Spec Kit in the SDD lifecycle\n"}
          {"\n"}
          <span className="tok-sec">## Acceptance criteria</span>
          {"\n"}
          <span className="tok-box">- [ ]</span>
          {" Every command maps to a step the audience already runs\n"}
          <span className="tok-box">- [ ]</span>
          {" A non-developer can follow the workflow end to end\n"}
          <span className="tok-box">- [ ]</span>
          {" Audience leaves with one concrete next step"}
        </div>
      </div>
    </div>
  );
}

function PredictabilitySlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="Why Should I Care?" />
      <h1 className="sl-h1">
        Less rework.
        <br />
        Fewer surprises at the end.
      </h1>
      <p className="sl-body">
        Let the agent handle the <em className="sl-em">how</em>. You own the{" "}
        <em className="sl-em">what and result</em>.
      </p>
      <p className="sl-body">
        Writing the spec sharpens your thinking and helps you communicate it.
        Agents use that to build closer to the right thing, faster.
      </p>
      {/* Both b-corp touches live here now, rooted in "less rework". See CLAUDE.md. */}
      <p className="sl-annotation sl-annotation--tight">
        ✦ less rework → fewer surprise weekends
        <br />✦ less rework → fewer wasted tokens → lower cost + less energy
      </p>
    </div>
  );
}

function HonestCloseSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What Am I Still Figuring Out?" />
      <h2 className="sl-h2">
        I’ve walked you through this like I’ve got it figured out. I don’t.
      </h2>
      <p className="sl-body">
        <em className="sl-em">Nothing here is new.</em> What’s new is trusting
        an agent with it. How that grows and holds up over time, I’m still
        learning.
      </p>
      <p className="sl-body">Some questions I’m thinking about…</p>
      <ul className="sl-bullets">
        <li>Are specs living truth, throwaway, or merged into docs?</li>
        <li>When is the SDD ceremony not useful?</li>
        <li>Who owns specs, and where do they clash with existing tools?</li>
        <li>
          <strong>
            How do we ensure a spec gets more than one perspective, human or
            model, before any code?
          </strong>
        </li>
      </ul>
    </div>
  );
}

// Where to start: the repo link and the install one-liner. Developer-facing
// "go do it" half of the former combined close; the explicit ask now lives on
// its own WhatsNextSlide.
function WhereToStartSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="Where to start?" />
      <h1 className="sl-h1">Your turn.</h1>
      <p className="sl-mono-link">https://github.com/github/spec-kit</p>
      <div className="sl-install">
        <span className="sl-install-line">
          <span className="sl-install-prompt">$</span>
          <code>{"uv tool install specify-cli \\"}</code>
        </span>
        <span className="sl-install-line sl-install-line--cont">
          <code>{"--from git+https://github.com/github/spec-kit.git"}</code>
        </span>
        <span className="sl-install-line">
          <span className="sl-install-prompt">$</span>
          <code>{"specify init <project>"}</code>
        </span>
      </div>
    </div>
  );
}

// The close: the explicit ask, on its own. Picks up the open questions from the
// previous slide and turns them into an invitation to keep talking. This is the
// load-bearing beat (see docs/speaker-notes.md → closing guardrails). The
// invite line varies per variant (internal Slack vs. community), so it is a prop.
// The default (ingage) invite keeps its inline emphasis. A variant can override
// with plain-string `inviteLines` from the manifest (e.g. the community close,
// which must not point at the internal Slack channel).
function WhatsNextSlide({ section, inviteLines }) {
  const body = inviteLines ? (
    inviteLines.map((line, i) => <p key={i}>{line}</p>)
  ) : (
    <>
      <p>
        If you’re poking at any of this, <em>I want to compare notes.</em>
      </p>
      <p>
        Let’s pick it up in our <em>#ai-practitioners</em> Slack channel.
      </p>
    </>
  );
  return (
    <div className="slide">
      <Label n={section} title="What’s Next?" />
      <h1 className="sl-h1">Let’s keep talking.</h1>
      <div className="sl-invite">{body}</div>
    </div>
  );
}

// ── GDG-only slides (community 40-min variant) ───────────────────────────────
// Added for the gdg arc; not used by the ingage lightning talk. See
// docs/audience-gdg-cincinnati.md and CLAUDE.md (gdg arc).

// Intro / who-am-I. Placeholder copy for now (props let the manifest or a later
// pass fill in real details). Unnumbered: it sits before the section counter.
function WhoAmISlide({
  name = "[Your name]",
  role = "[Your role], Ingage",
  points = [
    "[How long you’ve been building software]",
    "[How you started using Spec-Driven Development]",
    "[Why this matters to you, and what you’re hoping to share]",
  ],
}) {
  return (
    <div className="slide">
      <p className="sl-tagline">Hi, I’m</p>
      <h1 className="sl-h1">{name}.</h1>
      <p className="sl-body">{role}</p>
      <ul className="sl-bullets">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

// "Time for the demo" transition. The screen switches to a terminal after this;
// keep it a single, punchy beat.
function DemoSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="Time for a Demo" />
      <h1 className="sl-h1">Let’s build it live.</h1>
      <p className="sl-body">
        We’ll add a real feature to <em className="sl-em">this very deck</em>{" "}
        with Spec Kit, and let an agent write the code.
      </p>
      <p className="sl-body">
        Watch the <em className="sl-em">constitution</em> keep it in line.
      </p>
    </div>
  );
}

// Practitioner "what I've learned" beat: honest lessons that stuck. Distinct
// from the open questions on the next slide. One bolded standout.
function LessonsSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What I’ve Learned" />
      <h1 className="sl-h1">A few things that actually stuck.</h1>
      <ul className="sl-bullets">
        <li>
          I catch more bugs in <em className="sl-em">spec review</em> than code
          review now.
        </li>
        <li>A tight constitution earns its keep. A vague one gets ignored.</li>
        <li>
          The optional commands, clarify and analyze, are where the quality
          hides.
        </li>
        <li>
          <strong>Small, sharp specs beat big ones the agent skims.</strong>
        </li>
      </ul>
    </div>
  );
}

// ── Slide registry ───────────────────────────────────────────────────────────
//
// Maps the stable slide `id` (used in the variant manifest) to its component.
// The manifest (src/data/variants.js) decides which slides appear, in what
// order, with which section number and props, per talk variant.

export const SLIDE_REGISTRY = {
  title: TitleSlide,
  whoami: WhoAmISlide,
  requirements: RequirementsSlide,
  hook: HookSlide,
  sdd: SddSlide,
  specKit: SpecKitSlide,
  demo: DemoSlide,
  why: PredictabilitySlide,
  lessons: LessonsSlide,
  honestClose: HonestCloseSlide,
  whereToStart: WhereToStartSlide,
  whatsNext: WhatsNextSlide,
};
