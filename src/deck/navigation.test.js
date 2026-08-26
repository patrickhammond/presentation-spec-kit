import { describe, it, expect } from "vitest";
import {
  FLOW_SLUG,
  ARTIFACTS_SLUG,
  subStepsFor,
  parseDeckHash,
  deckHash,
  advance,
  retreat,
  resetSubStep,
} from "./navigation.js";
import { STEP_IDS } from "../data/steps.js";
import { ARTIFACT_IDS } from "../data/artifacts.js";
import { VARIANTS } from "../data/variants.js";

// A minimal manifest shaped like a real one: a plain slide, an entry with
// sub-steps, and a trailing slide. Using a fixture rather than a real variant
// keeps these tests honest when the arcs are edited.
const entries = [
  { type: "slide", id: "title", slug: "title" },
  { type: "slide", id: "hook", slug: "whats-the-problem", section: 1 },
  { type: "flow", slug: FLOW_SLUG, label: "What’s The Process?", section: 2 },
  { type: "slide", id: "why", slug: "why-should-i-care", section: 3 },
];

const FLOW = 2;
const last = STEP_IDS[STEP_IDS.length - 1];

describe("subStepsFor", () => {
  it("returns the ordered sub-steps for entries that have them", () => {
    expect(subStepsFor(entries[FLOW])).toEqual(STEP_IDS);
    expect(subStepsFor({ slug: ARTIFACTS_SLUG })).toEqual(ARTIFACT_IDS);
  });

  it("returns null for ordinary slides and for nothing at all", () => {
    expect(subStepsFor(entries[1])).toBeNull();
    expect(subStepsFor(undefined)).toBeNull();
  });
});

describe("parseDeckHash", () => {
  it("resolves an empty hash to the first entry", () => {
    expect(parseDeckHash(entries, "")).toEqual({ index: 0, activeId: null });
    expect(parseDeckHash(entries, "#")).toEqual({ index: 0, activeId: null });
  });

  it("resolves a slug to its entry", () => {
    expect(parseDeckHash(entries, "#why-should-i-care")).toEqual({
      index: 3,
      activeId: null,
    });
  });

  it("tolerates the #/ prefix form", () => {
    expect(parseDeckHash(entries, "#/whats-the-problem")).toEqual({
      index: 1,
      activeId: null,
    });
  });

  it("resolves an entry with sub-steps to its overview", () => {
    expect(parseDeckHash(entries, `#${FLOW_SLUG}`)).toEqual({
      index: FLOW,
      activeId: null,
    });
  });

  it("resolves a sub-step deep link", () => {
    expect(parseDeckHash(entries, `#${FLOW_SLUG}/analyze`)).toEqual({
      index: FLOW,
      activeId: "analyze",
    });
  });

  it("falls back to the overview for a sub-step the entry does not have", () => {
    expect(parseDeckHash(entries, `#${FLOW_SLUG}/nope`)).toEqual({
      index: FLOW,
      activeId: null,
    });
  });

  it("falls back to the first entry for an unknown slug", () => {
    expect(parseDeckHash(entries, "#not-a-slide")).toEqual({
      index: 0,
      activeId: null,
    });
  });

  it("falls back to the first entry when the variant lacks that entry", () => {
    const noFlow = entries.filter((e) => e.type !== "flow");
    expect(parseDeckHash(noFlow, `#${FLOW_SLUG}/analyze`)).toEqual({
      index: 0,
      activeId: null,
    });
  });
});

describe("deckHash", () => {
  it("round-trips every entry and sub-step", () => {
    entries.forEach((entry, index) => {
      const hash = deckHash(entries, index, null);
      expect(parseDeckHash(entries, hash)).toEqual({ index, activeId: null });

      (subStepsFor(entry) || []).forEach((activeId) => {
        const deep = deckHash(entries, index, activeId);
        expect(parseDeckHash(entries, deep)).toEqual({ index, activeId });
      });
    });
  });

  it("keeps the established flow URLs unchanged", () => {
    expect(deckHash(entries, FLOW, null)).toBe("#spec-kit-flow");
    expect(deckHash(entries, FLOW, "analyze")).toBe("#spec-kit-flow/analyze");
  });

  it("ignores an activeId on an entry without sub-steps", () => {
    expect(deckHash(entries, 1, "analyze")).toBe("#whats-the-problem");
  });

  it("returns an empty hash for an out-of-range index", () => {
    expect(deckHash(entries, 99, null)).toBe("");
  });
});

describe("advance", () => {
  it("moves between ordinary slides", () => {
    expect(advance(entries, { index: 0, activeId: null })).toEqual({
      index: 1,
      activeId: null,
    });
  });

  it("enters an entry's sub-steps from its overview", () => {
    expect(advance(entries, { index: FLOW, activeId: null })).toEqual({
      index: FLOW,
      activeId: STEP_IDS[0],
    });
  });

  it("walks the sub-steps in order", () => {
    expect(advance(entries, { index: FLOW, activeId: STEP_IDS[0] })).toEqual({
      index: FLOW,
      activeId: STEP_IDS[1],
    });
  });

  it("leaves the entry forward past the last sub-step", () => {
    expect(advance(entries, { index: FLOW, activeId: last })).toEqual({
      index: FLOW + 1,
      activeId: null,
    });
  });

  it("stops at the last entry", () => {
    const end = entries.length - 1;
    expect(advance(entries, { index: end, activeId: null })).toEqual({
      index: end,
      activeId: null,
    });
  });
});

describe("retreat", () => {
  it("moves between ordinary slides", () => {
    expect(retreat(entries, { index: 3, activeId: null })).toEqual({
      index: 2,
      activeId: null,
    });
  });

  it("walks the sub-steps backwards", () => {
    expect(retreat(entries, { index: FLOW, activeId: STEP_IDS[1] })).toEqual({
      index: FLOW,
      activeId: STEP_IDS[0],
    });
  });

  it("returns to the overview from the first sub-step", () => {
    expect(retreat(entries, { index: FLOW, activeId: STEP_IDS[0] })).toEqual({
      index: FLOW,
      activeId: null,
    });
  });

  it("leaves the entry backward from the overview", () => {
    expect(retreat(entries, { index: FLOW, activeId: null })).toEqual({
      index: FLOW - 1,
      activeId: null,
    });
  });

  it("stops at the first entry", () => {
    expect(retreat(entries, { index: 0, activeId: null })).toEqual({
      index: 0,
      activeId: null,
    });
  });
});

describe("resetSubStep", () => {
  it("returns the entry to its overview without moving the deck", () => {
    expect(resetSubStep(entries, { index: FLOW, activeId: last })).toEqual({
      index: FLOW,
      activeId: null,
    });
  });
});

describe("a full forward walk", () => {
  it("visits every entry and every sub-step exactly once", () => {
    const expected = entries.flatMap((entry, index) => {
      const stops = [{ index, activeId: null }];
      (subStepsFor(entry) || []).forEach((activeId) =>
        stops.push({ index, activeId }),
      );
      return stops;
    });

    const seen = [];
    let at = { index: 0, activeId: null };
    for (let i = 0; i < expected.length; i += 1) {
      seen.push(at);
      at = advance(entries, at);
    }
    expect(seen).toEqual(expected);
  });
});

describe("every shipped variant", () => {
  it("has unique slugs, so hashes resolve to exactly one entry", () => {
    for (const [key, { entries: arc }] of Object.entries(VARIANTS)) {
      const slugs = arc.map((e) => e.slug);
      expect(new Set(slugs).size, `${key} has duplicate slugs`).toBe(
        slugs.length,
      );
    }
  });
});
