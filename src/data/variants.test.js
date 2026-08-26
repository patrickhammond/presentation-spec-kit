import { describe, it, expect } from "vitest";
import { VARIANTS, isKnownVariant } from "./variants.js";
import { SLIDE_REGISTRY } from "../slides/SlideShow.jsx";

// The manifest is the single source of truth for slide order, section numbers,
// and slugs, so these assert the shape every arc must hold, then pin the
// cincydev-ai arc specifically (its two spectrum showings and its stepped
// artifacts entry are the parts most likely to drift).

describe("every variant", () => {
  for (const [key, { label, meta, entries }] of Object.entries(VARIANTS)) {
    describe(key, () => {
      it("is a known variant with a label and picker metadata", () => {
        expect(isKnownVariant(key)).toBe(true);
        expect(label).toBeTruthy();
        expect(meta.room).toBeTruthy();
        expect(meta.length).toBeTruthy();
        expect(typeof meta.demo).toBe("boolean");
      });

      it("registers a component for every slide entry", () => {
        entries
          .filter((e) => e.type === "slide")
          .forEach((e) =>
            expect(SLIDE_REGISTRY[e.id], `${key}/${e.id}`).toBeDefined(),
          );
      });

      it("numbers its numbered entries sequentially from one", () => {
        const sections = entries
          .map((e) => e.section)
          .filter((s) => s !== undefined);
        expect(sections).toEqual(sections.map((_, i) => i + 1));
      });

      // The presenter outline modal lists every entry by its label, so an
      // entry without one renders as a blank row.
      it("gives every entry an outline label", () => {
        entries.forEach((e) =>
          expect(e.label, `${key}/${e.slug} has no label`).toBeTruthy(),
        );
      });

      it("gives every entry a unique slug", () => {
        const slugs = entries.map((e) => e.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
      });
    });
  }
});

describe("cincydev-ai arc", () => {
  const { entries, meta } = VARIANTS["cincydev-ai"];
  const slugs = entries.map((e) => e.slug);
  const at = (slug) => entries.find((e) => e.slug === slug);

  it("carries no live demo", () => {
    expect(meta.demo).toBe(false);
    expect(entries.some((e) => e.id === "demo")).toBe(false);
  });

  // The closing ask is spoken, not a slide, so this arc ends on the repo link.
  // The other arcs keep their What's Next? beat.
  it("ends on the repo slide, with no What's Next? beat", () => {
    expect(entries.some((e) => e.id === "whatsNext")).toBe(false);
    expect(entries[entries.length - 1].id).toBe("repo");
    for (const key of ["ingage", "gdg"]) {
      const arc = VARIANTS[key].entries;
      expect(arc[arc.length - 1].id, `${key} closes on What's Next?`).toBe(
        "whatsNext",
      );
    }
  });

  it("runs the beats in order, with the spectrum bookending the walk", () => {
    expect(slugs).toEqual([
      "title",
      "who-am-i",
      "quote-requirements",
      "whats-the-problem",
      "whats-sdd",
      "where-does-this-fit",
      "whats-spec-kit",
      "spec-kit-flow",
      "artifacts",
      "why-should-i-care",
      "what-ive-learned",
      "what-am-i-still-figuring-out",
      "where-to-start",
      "can-i-get-the-slides",
    ]);
  });

  it("shows the spectrum once, as the landscape, with nothing highlighted", () => {
    const spectrum = entries.filter((e) => e.id === "spectrum");
    expect(spectrum).toHaveLength(1);
    expect(spectrum[0].slug).toBe("where-does-this-fit");
    expect(spectrum[0].props.highlight).toBeUndefined();
  });

  // The spectrum's payoff moved onto Why Should I Care? rather than a second
  // showing of the chart, whose legend repeated too much to read as a callback.
  it("lands the ceremony payoff on Why Should I Care?, in this arc only", () => {
    expect(at("why-should-i-care").props.leadLines).toHaveLength(1);
    for (const key of ["ingage", "gdg"]) {
      const why = VARIANTS[key].entries.find((e) => e.id === "why");
      expect(why.props?.leadLines, `${key} keeps the shared why slide`).toBe(
        undefined,
      );
    }
  });

  // The spectrum slide names the landscape right after this one, so the SDD
  // slide's one-line ecosystem mention is dropped here. That line also carried
  // the bridge bold, which would otherwise point two slides ahead. The other
  // arcs, where "What's Spec Kit?" comes next, must keep both.
  it("drops the SDD ecosystem line, and only in this arc", () => {
    expect(at("whats-sdd").props.ecosystem).toBe(false);
    for (const key of ["ingage", "gdg"]) {
      const sdd = VARIANTS[key].entries.find((e) => e.id === "sdd");
      expect(sdd.props?.ecosystem, `${key} keeps its ecosystem line`).toBe(
        undefined,
      );
    }
  });
});

describe("existing arcs are untouched", () => {
  it("keeps the ingage lightning arc at its delivered shape", () => {
    const slugs = VARIANTS.ingage.entries.map((e) => e.slug);
    expect(slugs).toEqual([
      "title",
      "quote-requirements",
      "whats-the-problem",
      "whats-sdd",
      "whats-spec-kit",
      "spec-kit-flow",
      "why-should-i-care",
      "what-am-i-still-figuring-out",
      "where-to-start",
      "can-i-get-the-slides",
      "whats-next",
    ]);
  });

  it("keeps the gdg arc demo-centric", () => {
    expect(VARIANTS.gdg.meta.demo).toBe(true);
    expect(VARIANTS.gdg.entries.some((e) => e.id === "demo")).toBe(true);
  });
});
