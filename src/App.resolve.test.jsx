import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import App from "./App.jsx";
import { isKnownVariant } from "./data/variants.js";

// Drive resolution by setting the address, then rendering <App/>. Picker mode
// renders a `.picker` root; deck mode renders a `.slideshow` root.
function visit(url) {
  window.history.replaceState({}, "", url);
  return render(<App />);
}

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("isKnownVariant", () => {
  it("is true for defined variants, false otherwise", () => {
    expect(isKnownVariant("ingage")).toBe(true);
    expect(isKnownVariant("gdg")).toBe(true);
    expect(isKnownVariant("zzz")).toBe(false);
    expect(isKnownVariant("")).toBe(false);
    expect(isKnownVariant(null)).toBe(false);
    expect(isKnownVariant(undefined)).toBe(false);
  });
});

describe("App variant resolution", () => {
  it("shows the picker when no variant is specified (US1)", () => {
    const { container } = visit("/");
    expect(container.querySelector(".picker")).not.toBeNull();
    expect(container.querySelector(".slideshow")).toBeNull();
  });

  it("opens the deck directly for a known variant (US2, no regression)", () => {
    const { container } = visit("/?variant=ingage");
    expect(container.querySelector(".slideshow")).not.toBeNull();
    expect(container.querySelector(".picker")).toBeNull();
  });

  it("preserves the in-deck hash deep link for a known variant (US2)", () => {
    const { container } = visit("/?variant=gdg#whats-sdd");
    expect(container.querySelector(".slideshow")).not.toBeNull();
    expect(container.querySelector(".picker")).toBeNull();
    // #whats-sdd resolves to the SDD slide, proving deep-linking still works
    expect(container.textContent).toContain(
      "It’s the workflow you already do.",
    );
  });

  it("shows the picker for an unknown variant instead of defaulting (US3)", () => {
    const { container } = visit("/?variant=zzz");
    expect(container.querySelector(".picker")).not.toBeNull();
    expect(container.querySelector(".slideshow")).toBeNull();
  });
});
