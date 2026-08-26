import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { SLIDE_REGISTRY } from "./SlideShow";
import { ARTIFACTS, ARTIFACT_IDS } from "../data/artifacts.js";
import { SPECTRUM_TOOLS } from "../data/spectrum.js";

// The per-variant sweep in SlideShow.test.jsx renders each slide exactly as the
// manifest declares it, which for the artifacts walk means its overview only.
// Its six stops and the spectrum's highlighted showing are extra render states,
// so the same accessibility and copy rules are enforced against them here.
const AXE_OPTS = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

function expectHouseStyle(container) {
  expect(container.textContent).not.toContain("—");
  expect(container.textContent).not.toMatch(/[A-Za-z]'[A-Za-z]/);
}

describe("ArtifactsSlide – every stop", () => {
  const Artifacts = SLIDE_REGISTRY.artifacts;

  for (const stop of ARTIFACTS) {
    describe(stop.id, () => {
      const renderStop = () =>
        render(<Artifacts section={7} activeId={stop.id} />);

      it("has no axe violations", async () => {
        const { container } = renderStop();
        expect(await axe(container, AXE_OPTS)).toHaveNoViolations();
      });

      it("obeys the em dash and curly apostrophe rules", () => {
        expectHouseStyle(renderStop().container);
      });

      it("shows its command, title, structure, pull quote, and callout", () => {
        const { container } = renderStop();
        const text = container.textContent;
        expect(text).toContain(stop.cmd);
        expect(text).toContain(stop.title);
        expect(text).toContain(stop.pull);
        // Backticks and asterisks are inline markup, rendered as elements
        // rather than text, so they are stripped before comparing.
        stop.callout.forEach((para) =>
          expect(text).toContain(para.replaceAll("`", "").replaceAll("*", "")),
        );
        stop.shape.forEach((heading) => expect(text).toContain(heading));
      });

      it("marks itself as the active step in the stepper", () => {
        const { container } = renderStop();
        const on = container.querySelectorAll(".sl-steps li[data-on]");
        expect(on).toHaveLength(1);
        expect(on[0].textContent).toBe(stop.cmd.replace("/speckit.", ""));
      });
    });
  }

  it("shows the overview, with no active step, when no stop is focused", () => {
    const { container } = render(<Artifacts section={7} />);
    expect(container.querySelectorAll(".sl-steps li")).toHaveLength(
      ARTIFACTS.length,
    );
    expect(container.querySelectorAll(".sl-steps li[data-on]")).toHaveLength(0);
    expectHouseStyle(container);
  });

  it("labels the analyze stop as writing no file", () => {
    const analyze = ARTIFACTS.find((a) => a.id === "analyze");
    expect(analyze.files).toHaveLength(0);
    const { container } = render(<Artifacts section={7} activeId="analyze" />);
    expect(container.querySelector(".sl-spec-file").textContent).toMatch(
      /never written/i,
    );
  });

  it("has unique, stable stop ids", () => {
    expect(new Set(ARTIFACT_IDS).size).toBe(ARTIFACT_IDS.length);
  });
});

describe("SpectrumSlide", () => {
  const Spectrum = SLIDE_REGISTRY.spectrum;

  const showings = [
    { name: "landscape", props: { heading: "There isn’t a winner." } },
    {
      name: "callback",
      props: { heading: "That’s the ceremony, priced.", highlight: "speckit" },
    },
  ];

  for (const { name, props } of showings) {
    describe(name, () => {
      it("has no axe violations", async () => {
        const { container } = render(<Spectrum section={3} {...props} />);
        expect(await axe(container, AXE_OPTS)).toHaveNoViolations();
      });

      it("obeys the em dash and curly apostrophe rules", () => {
        const { container } = render(<Spectrum section={3} {...props} />);
        expectHouseStyle(container);
      });

      it("names every tool and its when-to-reach-for-it line", () => {
        const { container } = render(<Spectrum section={3} {...props} />);
        SPECTRUM_TOOLS.forEach((tool) => {
          expect(container.textContent).toContain(tool.name);
          expect(container.textContent).toContain(tool.when);
        });
      });
    });
  }

  it("highlights exactly the named tool, and nothing when none is named", () => {
    const { container: off } = render(<Spectrum section={3} heading="x" />);
    expect(off.querySelectorAll("[data-on]")).toHaveLength(0);

    const { container: on } = render(
      <Spectrum section={3} heading="x" highlight="speckit" />,
    );
    // One marker on the plot, one row in the legend.
    expect(on.querySelectorAll("[data-on]")).toHaveLength(2);
  });

  it("describes the plot for assistive tech, since the markers are decorative", () => {
    const { container } = render(<Spectrum section={3} heading="x" />);
    const plot = container.querySelector(".sl-plot");
    expect(plot.getAttribute("role")).toBe("img");
    expect(plot.getAttribute("aria-label")).toBeTruthy();
  });
});

describe("spectrum data", () => {
  it("keeps every coordinate inside the plot", () => {
    SPECTRUM_TOOLS.forEach(({ id, x, y }) => {
      expect(x, `${id} x`).toBeGreaterThanOrEqual(0);
      expect(x, `${id} x`).toBeLessThanOrEqual(1);
      expect(y, `${id} y`).toBeGreaterThanOrEqual(0);
      expect(y, `${id} y`).toBeLessThanOrEqual(1);
    });
  });

  // The editorial claim of the slide: more ceremony buys less churn, no
  // exceptions. If a future edit breaks the monotonic diagonal, the drawn
  // trend line would be lying, so this is a content test, not a style one.
  it("stays on a monotonic diagonal, in declared order", () => {
    for (let i = 1; i < SPECTRUM_TOOLS.length; i += 1) {
      const prev = SPECTRUM_TOOLS[i - 1];
      const curr = SPECTRUM_TOOLS[i];
      expect(curr.x, `${curr.id} ceremony`).toBeGreaterThan(prev.x);
      expect(curr.y, `${curr.id} churn`).toBeLessThan(prev.y);
    }
  });
});
