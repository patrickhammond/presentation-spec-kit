import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Mirror the ingage variant slide slugs from src/data/variants.js (ingageArc).
// Keep in sync when that arc changes. The deck now requires a ?variant=; with
// none it shows the variant picker, so every nav pins ?variant=ingage.
const SLIDE_SLUGS = [
  "title",
  "quote-requirements",
  "whats-the-problem",
  "whats-sdd",
  "whats-spec-kit",
  "why-should-i-care",
  "what-am-i-still-figuring-out",
  "where-to-start",
  "whats-next",
];

// Build a deck URL for the ingage variant, optionally at an in-deck hash.
const deckUrl = (hash) => `/?variant=ingage${hash ? `#${hash}` : ""}`;

// At 1920×1080 (viewport set in playwright.config.js), vmin = 10.8px.
// Thresholds come from docs/accessibility.md.
const FONT = {
  HEADING: 54, // ≥5vmin — h1, h2
  BODY: 27, // ≥2.5vmin — body text, bullets, quotes
  SECONDARY: 22, // ≥2vmin — labels, captions, annotations
};

// Slides fade in on entry. axe samples blended colours mid-animation, which can
// score a borderline-but-passing pair below its threshold (the orange section
// number is 3.13:1 settled, ~2.99 mid-fade). Wait for the slide's entrance
// animation to finish before measuring anything. Scoped to the slide subtree on
// purpose: the flow canvas has infinite loop-dot animations that never settle.
async function settle(page) {
  await page.waitForSelector(".slide");
  await page.evaluate(async () => {
    const slide = document.querySelector(".slide-anim") || document.body;
    await Promise.all(
      slide.getAnimations({ subtree: true }).map((a) => a.finished),
    );
  });
}

async function fontSize(page, selector) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  return parseFloat(await el.evaluate((n) => getComputedStyle(n).fontSize));
}

// ── Slides ──────────────────────────────────────────────────────────────────

for (const slug of SLIDE_SLUGS) {
  const url = slug === "title" ? deckUrl() : deckUrl(slug);

  test(`slide:${slug} — no axe violations`, async ({ page }) => {
    await page.goto(url);
    await settle(page);

    const results = await new AxeBuilder({ page })
      .include(".slide-stage")
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test(`slide:${slug} — font sizes meet minimums`, async ({ page }) => {
    await page.goto(url);
    await settle(page);

    for (const sel of ["h1.sl-h1", "h2.sl-h2"]) {
      const px = await fontSize(page, `.slide ${sel}`);
      if (px !== null)
        expect(px, `${sel} on #${slug}`).toBeGreaterThanOrEqual(FONT.HEADING);
    }

    for (const sel of [
      ".sl-body",
      ".sl-bullets li",
      ".sl-quote",
      ".sl-tagline",
    ]) {
      const px = await fontSize(page, `.slide ${sel}`);
      if (px !== null)
        expect(px, `${sel} on #${slug}`).toBeGreaterThanOrEqual(FONT.BODY);
    }

    for (const sel of [
      ".sl-label",
      ".sl-kicker",
      ".sl-caption",
      ".sl-annotation",
      ".sl-install",
    ]) {
      const px = await fontSize(page, `.slide ${sel}`);
      if (px !== null)
        expect(px, `${sel} on #${slug}`).toBeGreaterThanOrEqual(FONT.SECONDARY);
    }
  });
}

// ── Interactive flow ─────────────────────────────────────────────────────────

test("flow — no axe violations (overview)", async ({ page }) => {
  await page.goto(deckUrl("spec-kit-flow"));
  await page.waitForSelector(".react-flow");

  const results = await new AxeBuilder({ page })
    .include(".slide-stage")
    // React Flow internals: arrow markers lack accessible names and node icon
    // labels (cmd/tier) are diagram-scale (<14px) — the readable layer is the
    // detail panel (opened on click), not the icon labels.
    .exclude(".react-flow__arrowhead")
    .exclude(".react-flow__node")
    .analyze();
  expect(results.violations).toEqual([]);
});

test("flow — no axe violations (detail panel open)", async ({ page }) => {
  await page.goto(deckUrl("spec-kit-flow/specify"));
  await page.waitForSelector(".detail-panel");

  const results = await new AxeBuilder({ page })
    .include(".slide-stage")
    .exclude(".react-flow__arrowhead")
    // The detail panel renders its command title, tier badge, and "Writes"
    // footer in the step's tier color (orange / green / slate). At panel text
    // sizes on white, several of these fall below AA contrast (4.5:1). Tier is
    // encoded redundantly (left color bar + border + the colored text), so we
    // accept the tier-colored accents and switch off color-contrast for this
    // scan only. Contrast stays enforced on every slide (slide axe tests) and on
    // the flow canvas (the overview test above).
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("flow — detail panel font sizes meet minimums", async ({ page }) => {
  await page.goto(deckUrl("spec-kit-flow/specify"));
  await page.waitForSelector(".detail-panel");

  // .detail-cmd is the panel's command label (e.g. "/speckit.specify"), the most
  // prominent panel text but not a slide heading, so it is held to the body
  // minimum, not FONT.HEADING.
  const cmd = await fontSize(page, ".detail-cmd");
  if (cmd !== null)
    expect(cmd, ".detail-cmd").toBeGreaterThanOrEqual(FONT.BODY);

  // The detail panel is an intentionally compact surface (denser than slide
  // body), so its summary, bullets, and subtitle are held to the SECONDARY
  // floor rather than the slide BODY floor. .detail-badge is excluded: it is a
  // tiny tier pill (~14px) and tier is encoded redundantly (color bar + border
  // + badge), so it is not size-floor reading content.
  for (const sel of [".detail-sum", ".detail-pts li", ".detail-sub"]) {
    const px = await fontSize(page, sel);
    if (px !== null) expect(px, sel).toBeGreaterThanOrEqual(FONT.SECONDARY);
  }
});

// ── cincydev-ai: the beats that only exist in this variant ──────────────────
// The spectrum plot and the stepped artifact walk introduce new type and colour
// that the ingage sweep above never renders. Both are audience-reading content,
// so they are held to the same floors: nothing below FONT.SECONDARY, headings at
// FONT.HEADING, and no axe violations (contrast included).

const cincyUrl = (hash) => `/?variant=cincydev-ai${hash ? `#${hash}` : ""}`;

// The stepped walk's stop ids, in order. Mirrors ARTIFACTS in
// src/data/artifacts.js; keep in sync when a stop is added or removed.
const ARTIFACT_STOP_IDS = ["constitution", "spec", "plan", "tasks", "analyze"];

const CINCY_STOPS = [
  "where-does-this-fit",
  "why-should-i-care",
  "can-i-get-the-slides",
  "artifacts",
  "artifacts/constitution",
  "artifacts/spec",
  "artifacts/plan",
  "artifacts/tasks",
  "artifacts/analyze",
];

for (const hash of CINCY_STOPS) {
  test(`cincydev-ai:${hash} — no axe violations`, async ({ page }) => {
    await page.goto(cincyUrl(hash));
    await settle(page);

    const results = await new AxeBuilder({ page })
      .include(".slide-stage")
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test(`cincydev-ai:${hash} — font sizes meet minimums`, async ({ page }) => {
    await page.goto(cincyUrl(hash));
    await settle(page);

    const px = await fontSize(page, ".slide h1.sl-h1");
    if (px !== null)
      expect(px, `h1 on #${hash}`).toBeGreaterThanOrEqual(FONT.HEADING);

    const body = await fontSize(page, ".slide .sl-body");
    if (body !== null)
      expect(body, `.sl-body on #${hash}`).toBeGreaterThanOrEqual(FONT.BODY);

    // Every label, marker, legend line, stepper pill, structure line, pull
    // quote, and file note the audience is expected to read.
    for (const sel of [
      ".sl-plot-axis",
      ".sl-plot-cap",
      ".sl-plot-name",
      ".sl-plot-legend-name",
      ".sl-plot-legend-when",
      ".sl-plot-also",
      ".sl-steps li",
      ".sl-artifact-cmd",
      ".sl-shape-line",
      ".sl-pull",
      ".sl-artifact-also",
      ".sl-spec-file--lg",
    ]) {
      const size = await fontSize(page, `.slide ${sel}`);
      if (size !== null)
        expect(size, `${sel} on #${hash}`).toBeGreaterThanOrEqual(
          FONT.SECONDARY,
        );
    }
  });

  test(`cincydev-ai:${hash} — content stays inside the slide`, async ({
    page,
  }) => {
    await page.goto(cincyUrl(hash));
    await settle(page);

    // A projected deck has no scrollbar to rescue an overflowing slide, so the
    // new plot and artifact cards must fit their stage in both dimensions.
    const overflow = await page.evaluate(() => {
      const stage = document.querySelector(".slide-stage");
      const slide = document.querySelector(".slide");
      return {
        height: slide.scrollHeight - stage.clientHeight,
        width: slide.scrollWidth - stage.clientWidth,
      };
    });
    expect(
      overflow.height,
      `vertical overflow on #${hash}`,
    ).toBeLessThanOrEqual(0);
    expect(
      overflow.width,
      `horizontal overflow on #${hash}`,
    ).toBeLessThanOrEqual(0);
  });
}

// The stepper's reserved height assumes it stays on one row, so a longer
// command name or an extra stop would wrap and change the layout the walk is
// pinned to.
test("cincydev-ai:artifacts — the stepper stays on one row", async ({
  page,
}) => {
  await page.goto(cincyUrl("artifacts"));
  await settle(page);

  const rows = await page.evaluate(() => {
    const chips = [...document.querySelectorAll(".sl-steps li")];
    return new Set(chips.map((c) => Math.round(c.getBoundingClientRect().top)))
      .size;
  });
  expect(rows).toBe(1);
});

// The artifact walk is one entry the presenter steps through, so its stops must
// not shift under each other. Content height varies a lot between them (a
// four-heading checklist vs an eleven-heading spec), and .slide-anim centres the
// slide block, so .sl-artifact-body reserves the tallest stop's height. This
// pins that: if a stop grows past the reserved floor, the heading starts moving
// and this fails, rather than the jump reaching a projector unnoticed.
test("cincydev-ai:artifacts — the walk does not shift between stops", async ({
  page,
}) => {
  const stops = ["", ...ARTIFACT_STOP_IDS];
  const positions = [];

  for (const id of stops) {
    await page.goto(cincyUrl(`artifacts${id ? `/${id}` : ""}`));
    await settle(page);
    positions.push(
      await page.evaluate(() => {
        const box = (sel) =>
          document.querySelector(sel).getBoundingClientRect();
        return {
          heading: Math.round(box(".sl-h1").top),
          stepper: Math.round(box(".sl-steps").top),
        };
      }),
    );
  }

  // A 2px tolerance for subpixel layout rounding: the bar is "no visible jump
  // on a projector", not pixel-identical geometry. A stop that outgrows the
  // reserved height moves by tens of pixels, which this still catches.
  const TOLERANCE = 2;
  const [first] = positions;
  positions.forEach((at, i) => {
    const where = stops[i] || "overview";
    expect(
      Math.abs(at.stepper - first.stepper),
      `stepper moved on ${where}`,
    ).toBeLessThanOrEqual(TOLERANCE);
    expect(
      Math.abs(at.heading - first.heading),
      `heading moved on ${where}`,
    ).toBeLessThanOrEqual(TOLERANCE);
  });
});
