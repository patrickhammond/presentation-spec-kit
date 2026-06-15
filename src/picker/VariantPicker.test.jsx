import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import VariantPicker from "./VariantPicker.jsx";
import { VARIANTS } from "../data/variants.js";

// jsdom cannot compute vmin/contrast; rendered as a fragment, so region is N/A.
const AXE_OPTS = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

const variantKeys = Object.keys(VARIANTS);

describe("VariantPicker", () => {
  it("renders one selectable control per variant in the manifest", () => {
    const { container } = render(<VariantPicker onSelect={() => {}} />);
    const cards = container.querySelectorAll("button.picker-card");
    expect(cards).toHaveLength(variantKeys.length);
    // Data-driven: every manifest variant's label and meta appear
    for (const key of variantKeys) {
      const { label, meta } = VARIANTS[key];
      expect(container.textContent).toContain(label);
      expect(container.textContent).toContain(meta.room);
      expect(container.textContent).toContain(meta.length);
    }
  });

  it("shows a live-demo indicator only for demo variants", () => {
    const { container } = render(<VariantPicker onSelect={() => {}} />);
    const demoBadges = container.querySelectorAll(".picker-card-demo");
    const demoCount = variantKeys.filter((k) => VARIANTS[k].meta.demo).length;
    expect(demoBadges).toHaveLength(demoCount);
  });

  it("calls onSelect with the variant key when a card is activated", () => {
    const onSelect = vi.fn();
    const { container } = render(<VariantPicker onSelect={onSelect} />);
    const firstCard = container.querySelector("button.picker-card");
    fireEvent.click(firstCard);
    expect(onSelect).toHaveBeenCalledWith(variantKeys[0]);
  });

  it("uses native buttons (keyboard reachable)", () => {
    const { container } = render(<VariantPicker onSelect={() => {}} />);
    container.querySelectorAll(".picker-card").forEach((el) => {
      expect(el.tagName).toBe("BUTTON");
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(<VariantPicker onSelect={() => {}} />);
    expect(await axe(container, AXE_OPTS)).toHaveNoViolations();
  });

  it("contains no em dashes and no straight quotes in copy", () => {
    const { container } = render(<VariantPicker onSelect={() => {}} />);
    expect(container.textContent).not.toContain("—");
    expect(container.textContent).not.toMatch(/[A-Za-z]'[A-Za-z]/);
  });
});
