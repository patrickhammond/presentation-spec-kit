import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { SLIDE_REGISTRY } from "./SlideShow";
import { VARIANTS } from "../data/variants.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexCss = readFileSync(resolve(__dirname, "../index.css"), "utf8");

// jsdom cannot compute vmin-based styles, so color-contrast and font-size
// enforcement requires Playwright / browser-based testing.
// Slides are rendered as fragments, not full documents, so region is N/A.
const AXE_OPTS = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

// Every slide entry across every variant (architecture C: slides are rendered
// from the per-variant manifest, not a fixed index). Deduplicated by the
// id + section + props combination a variant actually renders.
const slideCases = Object.entries(VARIANTS).flatMap(([variant, { entries }]) =>
  entries.filter((e) => e.type === "slide").map((e) => ({ variant, ...e })),
);

function renderSlide({ id, section, props }) {
  const Slide = SLIDE_REGISTRY[id];
  return render(<Slide section={section} {...(props || {})} />);
}

describe("SlideShow – WCAG & copy-rule checks", () => {
  for (const slideCase of slideCases) {
    const { variant, id, slug } = slideCase;

    describe(`${variant} / ${id} (${slug})`, () => {
      it("has no axe violations", async () => {
        const { container } = renderSlide(slideCase);
        expect(await axe(container, AXE_OPTS)).toHaveNoViolations();
      });

      it("contains no em dashes", () => {
        const { container } = renderSlide(slideCase);
        expect(container.textContent).not.toContain("—");
      });

      it("uses curly apostrophes, not straight, in contractions", () => {
        const { container } = renderSlide(slideCase);
        // Straight apostrophe (U+0027) between letters = straight quote in copy
        expect(container.textContent).not.toMatch(/[A-Za-z]'[A-Za-z]/);
      });

      it("all images have non-empty alt text", () => {
        const { container } = renderSlide(slideCase);
        container.querySelectorAll("img").forEach((img) => {
          // Decorative images carry role="presentation" and intentionally use alt=""
          if (img.getAttribute("role") !== "presentation") {
            expect(
              img.getAttribute("alt"),
              `img[src="${img.getAttribute("src")}"] is missing alt text`,
            ).toBeTruthy();
          }
        });
      });
    });
  }

  it("index.css includes a prefers-reduced-motion media query", () => {
    expect(indexCss).toContain("prefers-reduced-motion");
    expect(indexCss).toContain("reduce");
  });

  // Regression: an empty inviteLines array must fall back to the default invite,
  // not render the load-bearing closing slide with a blank body.
  it("WhatsNext falls back to the default invite for empty inviteLines", () => {
    const WhatsNext = SLIDE_REGISTRY.whatsNext;
    const { container } = render(<WhatsNext section={8} inviteLines={[]} />);
    expect(container.querySelector(".sl-invite").textContent.trim()).not.toBe(
      "",
    );
  });
});
