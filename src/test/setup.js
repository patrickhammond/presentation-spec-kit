import "@testing-library/jest-dom";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom has no ResizeObserver, which @xyflow/react constructs on mount. Without
// it, any test that renders the deck on its flow entry throws before asserting.
// A no-op stub is enough: the flow's layout is fixed data, and anything that
// depends on measured size is covered by the Playwright suite in a real browser.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
