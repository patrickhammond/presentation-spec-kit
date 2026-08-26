// This module is a registry of slide components plus the SLIDE_REGISTRY map the
// variant manifest indexes into. The non-component export trips react-refresh's
// "only export components" rule (as the old SLIDE_SLUGS export did); fast-refresh
// of a single slide is not worth splitting the deck across files.
/* eslint-disable react-refresh/only-export-components */
import { Fragment } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  SPECTRUM_AXES,
  SPECTRUM_TOOLS,
  SPECTRUM_ALSO,
} from "../data/spectrum.js";
import { ARTIFACTS, ARTIFACT_FEATURE } from "../data/artifacts.js";

// A deliberately tiny inline markup subset for copy that lives in data modules:
// `backticks` become inline code, *asterisks* become the orange .sl-em accent.
// Lets src/data/artifacts.js name commands and files, and mark the one phrase
// that carries a stop, without putting JSX in a data module. Monospace here is
// code, which is the one use the brand rules allow outside labels and titles.
const INLINE_MARKUP = /(`[^`]+`|\*[^*]+\*)/g;

function withInline(text) {
  return String(text)
    .split(INLINE_MARKUP)
    .filter(Boolean)
    .map((part, i) => {
      const inner = part.slice(1, -1);
      if (part.startsWith("`"))
        return (
          <code className="sl-code" key={i}>
            {inner}
          </code>
        );
      if (part.startsWith("*"))
        return (
          <em className="sl-em" key={i}>
            {inner}
          </em>
        );
      return <Fragment key={i}>{part}</Fragment>;
    });
}

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

const REPO_URL = "https://github.com/patrickhammond/presentation-spec-kit";

const EMAIL = "patrick.hammond@ingagepartners.com";

function RepoSlide({ section }) {
  return (
    <div className="slide slide--wide">
      <Label n={section} title="Can I Get The Slides?" />
      <h1 className="sl-h1">We all learn together.</h1>
      <div className="sl-artifacts">
        <div className="sl-artifact">
          <div className="sl-repo-qa">
            <p className="sl-body">Want a copy of the presentation?</p>
            <a
              href={REPO_URL}
              className="sl-mono-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {REPO_URL.replace("https://", "")}
            </a>
          </div>
          <div className="sl-repo-qa">
            <p className="sl-body">
              Want to chat about AI, SDD, or Spec Kit for your teams?
            </p>
            <a href={`mailto:${EMAIL}`} className="sl-mono-link">
              {EMAIL}
            </a>
          </div>
        </div>
        <QRCodeSVG
          value={REPO_URL}
          size={240}
          bgColor="transparent"
          fgColor="#20282d"
          className="sl-qr-svg"
          aria-label="QR code linking to the presentation GitHub repository"
        />
      </div>
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
        gap between what you asked for and what you got is rework.
      </p>
      {/* Bridge bold: foreshadows the next slide (SDD). See CLAUDE.md content principles. */}
      <p className="sl-body">
        <strong>Spec-Driven Development</strong> closes the gap.
      </p>
    </div>
  );
}

// `ecosystem` controls the paragraph that names the wider tooling landscape.
// That paragraph also carries the bridge bold into "What's Spec Kit?" (see
// CLAUDE.md content principles), so the two travel together: a variant whose
// next slide is the tooling spectrum sets it false, because that slide names
// the landscape in far more detail and the bridge would point past it.
function SddSlide({ section, ecosystem = true }) {
  return (
    <div className="slide">
      <Label n={section} title="What’s Spec-Driven Development?" />
      <div className="sl-split">
        <div className="sl-split-main">
          <h1 className="sl-h1">Spoiler: It’s already your workflow.</h1>
          <p className="sl-body">
            Spec-Driven Development (SDD) is just that. The difference: each
            artifact becomes an{" "}
            <em className="sl-em">executable input for an AI agent</em>, not a
            document that rots in a wiki or far away in an issue tracker.
          </p>
          {/* Bridge bold: foreshadows the next slide (Spec Kit). See CLAUDE.md content principles. */}
          {ecosystem && (
            <p className="sl-body">
              <strong>Spec Kit</strong> is a toolkit for SDD. OpenSpec and
              others exist too, plus plugins like Superpowers, GSD, and Grill
              Me.
            </p>
          )}
          <p className="sl-body">
            {ecosystem ? "Whatever you pick, the" : "Those"} artifacts are{" "}
            <em className="sl-em">plain Markdown</em> that lives with your code.
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
      <h1 className="sl-h1">Specs, plans, and tasks, as commands you run.</h1>
      <p className="sl-body">
        Spec Kit is a toolkit that puts SDD into practice. It’s{" "}
        <em className="sl-em">harness-agnostic</em>: works with Claude Code,
        Copilot, Cursor, Antigravity, and more.
      </p>
      <p className="sl-body">
        Versioned with your code, so every decision is traceable and available
        where you’re working.
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

// `leadLines` is optional per-variant copy that lands before the shared body:
// an arc that has just shown the room something concrete can tie it to the
// payoff here. Plain strings, rendered through withInline, so the manifest
// stays a data module.
function PredictabilitySlide({ section, leadLines = [] }) {
  return (
    <div className="slide">
      <Label n={section} title="Why Should I Care?" />
      <h1 className="sl-h1">
        Less rework.
        <br />
        Fewer surprises at the end.
      </h1>
      {leadLines.map((line, i) => (
        <p className="sl-body" key={i}>
          {withInline(line)}
        </p>
      ))}
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
        I’ve walked you through this like I’ve got it figured out.{" "}
        <em className="sl-em">I don’t.</em>
      </h2>
      <p className="sl-body">
        Nothing here is new. Most of this just makes problems we already had
        more visible.
      </p>
      <p className="sl-body">Some questions I’m thinking about…</p>
      <ul className="sl-bullets">
        <li>When is the SDD ceremony not useful?</li>
        <li>
          Once the code ships, do specs live on, merge into docs, or expire?
        </li>
        <li>
          Which roles own specs, and where do they clash with existing
          processes?
        </li>
        <li>How do you actually work with a thousand specs?</li>
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
          <code>{"specify init --here"}</code>
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
  const body = inviteLines?.length ? (
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
// pass fill in real details). Unnumbered presentation-wise: it keeps a hardcoded
// "00" label as a cute "this is a slide, but not content" marker, so it does not
// consume a section number (it is `numbered: false` in the manifest).
function WhoAmISlide({
  name = "[Your name]",
  points = [
    "[Your role], Ingage",
    "[How long you’ve been building software]",
    "[How you started using Spec-Driven Development]",
  ],
  standout = "[Why this matters to you, and what you’re hoping to share]",
  photo,
  photoAlt,
}) {
  return (
    <div className="slide whoami">
      <Label n={0} title="Who is this guy?" />
      <div className="whoami-body">
        <div className="whoami-text">
          <h1 className="sl-h1">{name}</h1>
          <ul className="sl-bullets">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
            {standout && (
              <li>
                <strong>{standout}</strong>
              </li>
            )}
          </ul>
        </div>
        {photo && (
          <img className="whoami-photo" src={photo} alt={photoAlt || name} />
        )}
      </div>
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
        Heads up: the agent needs a minute to think, so we’ll jump{" "}
        <em className="sl-em">back and forth</em> between the demo and the
        slides while we wait.
      </p>
    </div>
  );
}

// Practitioner "what I've learned" beat: what running these tools has actually
// taught the speaker. Distinct from the open questions on the next slide, which
// are the things still unresolved. One bolded standout.
function LessonsSlide({ section }) {
  return (
    <div className="slide">
      <Label n={section} title="What I’ve Learned" />
      {/* A fragment on purpose: the heading runs straight into the list. */}
      <h1 className="sl-h1">Using these tools…</h1>
      <ul className="sl-bullets">
        <li>I catch more “bugs” in spec review than code review now.</li>
        <li>
          The more specs I have, and the more they reference each other, the
          more obvious drift becomes. It usually surfaces during{" "}
          <code className="sl-code">plan</code>,{" "}
          <code className="sl-code">tasks</code>, or{" "}
          <code className="sl-code">analyze</code>, but still sometimes not
          until <code className="sl-code">implement</code>.
        </li>
        <li>
          The optional commands, <code className="sl-code">clarify</code> and{" "}
          <code className="sl-code">analyze</code>, drastically improve spec
          artifact quality and final output.
        </li>
        <li>
          <strong>
            Creating small, minimally scoped specs keeps the work focused and
            keeps the agent from wandering, no different from scoping it well
            for a person.
          </strong>
        </li>
      </ul>
    </div>
  );
}

// Tooling spectrum: ceremony up front vs churn later, with the four tools the
// room already knows plotted on it. `highlight` lights one marker and its
// legend row; no arc uses it today (the cincydev-ai callback showing was cut in
// favour of a line on Why Should I Care?), but it is what makes a second,
// earned showing cheap if one is ever wanted again. Coordinates and
// copy come from src/data/spectrum.js; the plot is HTML positioned by --x/--y
// custom properties so every label stays real, vmin-scaled text.
function SpectrumSlide({
  section,
  title = "Where Does This Fit?",
  heading,
  lines = [],
  highlight = null,
}) {
  const order = SPECTRUM_TOOLS.map((t) => t.name).join(", then ");
  return (
    <div className="slide slide--wide">
      <Label n={section} title={title} />
      <h1 className="sl-h1">{heading}</h1>
      <div className="sl-spectrum">
        <div
          className="sl-plot"
          role="img"
          aria-label={`Scatter plot. Horizontal axis: ${SPECTRUM_AXES.x.label}, light to heavy. Vertical axis: ${SPECTRUM_AXES.y.label}, low to high. Plotted on a descending diagonal: ${order}.`}
        >
          <span className="sl-plot-axis sl-plot-axis--y" aria-hidden="true">
            {SPECTRUM_AXES.y.label}
          </span>
          <span className="sl-plot-cap sl-plot-cap--top" aria-hidden="true">
            {SPECTRUM_AXES.y.high}
          </span>
          <span className="sl-plot-cap sl-plot-cap--bottom" aria-hidden="true">
            {SPECTRUM_AXES.y.low}
          </span>
          <span className="sl-plot-axis sl-plot-axis--x" aria-hidden="true">
            {SPECTRUM_AXES.x.label}
          </span>
          <span className="sl-plot-cap sl-plot-cap--left" aria-hidden="true">
            {SPECTRUM_AXES.x.low}
          </span>
          <span className="sl-plot-cap sl-plot-cap--right" aria-hidden="true">
            {SPECTRUM_AXES.x.high}
          </span>
          <span className="sl-plot-trend" aria-hidden="true" />
          {SPECTRUM_TOOLS.map((tool) => (
            <span
              key={tool.id}
              className="sl-plot-dot"
              style={{ "--x": tool.x, "--y": tool.y }}
              data-on={tool.id === highlight || undefined}
              data-flip={tool.x > 0.55 || undefined}
              aria-hidden="true"
            >
              <span className="sl-plot-name">{tool.name}</span>
            </span>
          ))}
        </div>
        <ul className="sl-plot-legend">
          {SPECTRUM_TOOLS.map((tool) => (
            <li key={tool.id} data-on={tool.id === highlight || undefined}>
              <span className="sl-plot-legend-name">{tool.name}</span>
              <span className="sl-plot-legend-when">{tool.when}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="sl-plot-also">{SPECTRUM_ALSO}</p>
      {lines.map((line, i) => (
        <p className="sl-body" key={i}>
          {line}
        </p>
      ))}
    </div>
  );
}

// Stepped walkthrough of what Spec Kit actually generates. `activeId` is the
// deck's sub-step cursor (see src/deck/navigation.js): null shows the overview
// map, and each artifact id shows that stop. Content is the real output for
// this repo's own outline modal feature, from src/data/artifacts.js. The
// treatment is structure over prose on purpose: section headings stay readable
// from the back of the room where a wall of Markdown would not.
function ArtifactsSlide({ section, activeId = null }) {
  const stop = ARTIFACTS.find((a) => a.id === activeId) || null;
  const tab = stop && (stop.files[0] || "report (never written to disk)");

  return (
    <div className="slide slide--wide">
      <Label n={section} title="What Gets Generated?" />
      <ol className="sl-steps">
        {ARTIFACTS.map((a) => (
          <li key={a.id} data-on={a.id === activeId || undefined}>
            {a.cmd.replace("/speckit.", "")}
          </li>
        ))}
      </ol>

      <div className="sl-artifact-body">
        {!stop ? (
          <>
            <h1 className="sl-h1">So what does it actually write?</h1>
            <p className="sl-body">
              Every artifact ahead is real output from one feature of{" "}
              <em className="sl-em">this deck</em>: the {ARTIFACT_FEATURE.name}.
              It all lives in{" "}
              <code className="sl-code">{ARTIFACT_FEATURE.dir}</code> in the
              repo you can clone at the end.
            </p>
            <p className="sl-body">
              Six commands, six different kinds of artifacts. Watch what each
              one is actually for.
            </p>
          </>
        ) : (
          <>
            <h1 className="sl-h1">{stop.title}</h1>
            <div className="sl-split">
              <div className="sl-split-main">
                <div className="sl-spec-wrap">
                  <span className="sl-spec-file sl-spec-file--lg">{tab}</span>
                  <div className="sl-spec sl-shape">
                    {stop.shape.map((heading) => (
                      <span className="sl-shape-line" key={heading}>
                        {heading}
                      </span>
                    ))}
                  </div>
                </div>
                {stop.files.length > 1 && (
                  <p className="sl-artifact-also">
                    <span>Alongside it:</span>
                    {stop.files.slice(1).map((f) => (
                      <code className="sl-code" key={f}>
                        {f}
                      </code>
                    ))}
                  </p>
                )}
              </div>
              <div className="sl-split-aside sl-split-aside--stack">
                <p className="sl-artifact-cmd">{stop.cmd}</p>
                <blockquote className="sl-pull">{stop.pull}</blockquote>
                {stop.callout.map((para, i) => (
                  <p className="sl-body" key={i}>
                    {withInline(para)}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
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
  spectrum: SpectrumSlide,
  artifacts: ArtifactsSlide,
  demo: DemoSlide,
  why: PredictabilitySlide,
  lessons: LessonsSlide,
  honestClose: HonestCloseSlide,
  whereToStart: WhereToStartSlide,
  whatsNext: WhatsNextSlide,
  repo: RepoSlide,
};
