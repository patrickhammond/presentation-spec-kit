import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import App from "./App.jsx";
import { isKnownVariant } from "./data/variants.js";

// Drive resolution by setting the address, then rendering <App/>. Both modes
// render the shared `.slideshow` stage; the picker is distinguished by its
// `.picker` root, which the deck does not render.
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
  it("shows the picker when no variant is specified", () => {
    const { container } = visit("/");
    expect(container.querySelector(".picker")).not.toBeNull();
  });

  it("opens the deck directly for a known variant", () => {
    const { container } = visit("/?variant=ingage");
    expect(container.querySelector(".slideshow")).not.toBeNull();
    expect(container.querySelector(".picker")).toBeNull();
  });

  it("preserves the in-deck hash deep link for a known variant", () => {
    const { container } = visit("/?variant=gdg#whats-sdd");
    expect(container.querySelector(".slideshow")).not.toBeNull();
    expect(container.querySelector(".picker")).toBeNull();
    // #whats-sdd resolves to the SDD slide, proving deep-linking still works
    expect(container.textContent).toContain(
      "It’s the workflow you already do.",
    );
  });

  it("shows the picker for an unknown variant instead of defaulting", () => {
    const { container } = visit("/?variant=zzz");
    expect(container.querySelector(".picker")).not.toBeNull();
  });
});

describe("Pick a talk switcher visibility", () => {
  it("is hidden when the deck is opened via a ?variant= link", () => {
    const { container } = visit("/?variant=ingage");
    expect(container.querySelector(".deck-to-picker")).toBeNull();
  });

  it("stamps ?variant= on a picker selection so the switcher stays hidden", () => {
    const { container } = visit("/");
    fireEvent.click(container.querySelector("button.picker-card"));
    expect(container.querySelector(".slideshow")).not.toBeNull();
    expect(window.location.search).toContain("variant=");
    expect(container.querySelector(".deck-to-picker")).toBeNull();
  });
});

describe("Outline modal dismiss behaviors", () => {
  it("opens on m and closes on second m without changing the slide", () => {
    const { container } = visit("/?variant=ingage");
    expect(container.querySelector(".outline-backdrop")).toBeNull();

    // Capture slide text before touching the outline at all
    const textBefore = container.querySelector(".slideshow").textContent;

    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).not.toBeNull();

    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).toBeNull();
    expect(container.querySelector(".slideshow").textContent).toBe(textBefore);
  });

  it("closes on Escape without changing the slide", () => {
    const { container } = visit("/?variant=ingage");

    // Capture slide text before opening the outline
    const textBefore = container.querySelector(".slideshow").textContent;

    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).not.toBeNull();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(container.querySelector(".outline-backdrop")).toBeNull();
    expect(container.querySelector(".slideshow").textContent).toBe(textBefore);
  });

  it("closes on backdrop click", () => {
    const { container } = visit("/?variant=ingage");
    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).not.toBeNull();

    fireEvent.click(container.querySelector(".outline-backdrop"));
    expect(container.querySelector(".outline-backdrop")).toBeNull();
  });

  it("Escape closes the outline but does not clear a focused flow node", () => {
    const { container } = visit("/?variant=ingage#spec-kit-flow/specify");
    // The deck is on the flow with a focused node; open the outline
    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).not.toBeNull();

    // Escape dismisses the outline; the deck must still be on the flow entry
    fireEvent.keyDown(window, { key: "Escape" });
    expect(container.querySelector(".outline-backdrop")).toBeNull();
    expect(container.querySelector(".flow-anim")).not.toBeNull();
  });

  it("m key is a no-op on the picker (no deck rendered)", () => {
    const { container } = visit("/");
    expect(container.querySelector(".picker")).not.toBeNull();
    fireEvent.keyDown(window, { key: "m" });
    expect(container.querySelector(".outline-backdrop")).toBeNull();
  });
});
