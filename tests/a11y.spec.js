import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Mirror SLIDE_SLUGS from SlideShow.jsx — keep in sync when slides change.
const SLIDE_SLUGS = [
  "title",
  "requirements",
  "hook",
  "sdd",
  "spec-kit",
  "benefits",
  "honest-close",
  "whats-next",
  "learn-more",
  "qa-backup",
];

// At 1920×1080 (viewport set in playwright.config.js), vmin = 10.8px.
// Thresholds come from docs/accessibility.md.
const FONT = {
  HEADING: 54, // ≥5vmin — h1, h2
  BODY: 27, // ≥2.5vmin — body text, bullets, quotes
  SECONDARY: 22, // ≥2vmin — labels, captions, annotations
};

async function fontSize(page, selector) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  return parseFloat(await el.evaluate((n) => getComputedStyle(n).fontSize));
}

// ── Slides ──────────────────────────────────────────────────────────────────

for (const slug of SLIDE_SLUGS) {
  const url = slug === "title" ? "/" : `/#${slug}`;

  test(`slide:${slug} — no axe violations`, async ({ page }) => {
    await page.goto(url);
    await page.waitForSelector(".slide");

    const results = await new AxeBuilder({ page })
      .include(".slide-stage")
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test(`slide:${slug} — font sizes meet minimums`, async ({ page }) => {
    await page.goto(url);
    await page.waitForSelector(".slide");

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
  await page.goto("/#flow");
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
  await page.goto("/#flow/specify");
  await page.waitForSelector(".detail-panel");

  const results = await new AxeBuilder({ page })
    .include(".slide-stage")
    .exclude(".react-flow__arrowhead")
    .analyze();
  expect(results.violations).toEqual([]);
});

test("flow — detail panel font sizes meet minimums", async ({ page }) => {
  await page.goto("/#flow/specify");
  await page.waitForSelector(".detail-panel");

  const cmd = await fontSize(page, ".detail-cmd");
  if (cmd !== null)
    expect(cmd, ".detail-cmd").toBeGreaterThanOrEqual(FONT.HEADING);

  for (const sel of [".detail-sum", ".detail-pts li"]) {
    const px = await fontSize(page, sel);
    if (px !== null) expect(px, sel).toBeGreaterThanOrEqual(FONT.BODY);
  }

  for (const sel of [".detail-sub", ".detail-badge"]) {
    const px = await fontSize(page, sel);
    if (px !== null) expect(px, sel).toBeGreaterThanOrEqual(FONT.SECONDARY);
  }
});
