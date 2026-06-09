import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import SlideShow, { SLIDE_COUNT, SLIDE_SLUGS } from "./SlideShow";

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

describe("SlideShow – WCAG & copy-rule checks", () => {
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const slug = SLIDE_SLUGS[i];

    describe(`slide ${i}: ${slug}`, () => {
      it("has no axe violations", async () => {
        const { container } = render(<SlideShow slideIndex={i} />);
        expect(await axe(container, AXE_OPTS)).toHaveNoViolations();
      });

      it("contains no em dashes", () => {
        const { container } = render(<SlideShow slideIndex={i} />);
        expect(container.textContent).not.toContain("—");
      });

      it("uses curly apostrophes, not straight, in contractions", () => {
        const { container } = render(<SlideShow slideIndex={i} />);
        // Straight apostrophe (U+0027) between letters = straight quote in copy
        expect(container.textContent).not.toMatch(/[A-Za-z]'[A-Za-z]/);
      });

      it("all images have non-empty alt text", () => {
        const { container } = render(<SlideShow slideIndex={i} />);
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
});
