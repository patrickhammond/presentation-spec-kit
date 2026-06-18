import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import OutlineModal from "./OutlineModal.jsx";

const entries = [
  { slug: "title", label: "Welcome", type: "slide", section: null },
  { slug: "hook", label: "What’s the Problem?", type: "slide", section: 1 },
  { slug: "flow", label: "What’s The Process?", type: "flow", section: 2 },
  { slug: "why", label: "Why Should I Care?", type: "slide", section: 3 },
];

function renderModal(props = {}) {
  const onNavigate = vi.fn();
  const onClose = vi.fn();
  const result = render(
    <OutlineModal
      entries={entries}
      onNavigate={onNavigate}
      onClose={onClose}
      {...props}
    />,
  );
  return { ...result, onNavigate, onClose };
}

describe("OutlineModal", () => {
  it("renders one button per entry", () => {
    const { container } = renderModal();
    const buttons = container.querySelectorAll(".outline-entry");
    expect(buttons.length).toBe(entries.length);
  });

  it("shows all entry labels", () => {
    const { container } = renderModal();
    for (const entry of entries) {
      expect(container.textContent).toContain(entry.label);
    }
  });

  it("calls onNavigate with the correct index on click", () => {
    const { container, onNavigate } = renderModal();
    const buttons = container.querySelectorAll(".outline-entry");
    fireEvent.click(buttons[2]);
    expect(onNavigate).toHaveBeenCalledWith(2);
  });

  it("moves focus down on ArrowDown then calls onNavigate(1) on Enter", () => {
    const { container, onNavigate } = renderModal();
    const panel = container.querySelector(".outline-panel");
    fireEvent.keyDown(panel, { key: "ArrowDown" });
    fireEvent.keyDown(panel, { key: "Enter" });
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it("clamps ArrowUp at focusedIndex 0 so Enter still calls onNavigate(0)", () => {
    const { container, onNavigate } = renderModal();
    const panel = container.querySelector(".outline-panel");
    fireEvent.keyDown(panel, { key: "ArrowUp" });
    fireEvent.keyDown(panel, { key: "Enter" });
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const { container, onClose, onNavigate } = renderModal();
    fireEvent.click(container.querySelector(".outline-backdrop"));
    expect(onClose).toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("does not call onClose when the panel is clicked", () => {
    const { container, onClose } = renderModal();
    fireEvent.click(container.querySelector(".outline-panel"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders no em dashes or straight apostrophes in the middle of words", () => {
    const { container } = renderModal();
    const text = container.textContent;
    expect(text).not.toMatch(/—/);
    expect(text).not.toMatch(/[A-Za-z]'[A-Za-z]/);
  });

  it("passes axe accessibility check", async () => {
    const { container } = renderModal();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
