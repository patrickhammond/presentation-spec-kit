# TODO

## Orange text contrast (WCAG AA — needs brand decision)

The Ingage orange `#EE6823` used as a text/foreground color fails WCAG AA.
On a P3/wide-gamut display, Chromium renders it as a lighter value (~`#f07d41`)
that measures **2.62:1** against the warm-white background — below the 3:1
large-text threshold even when bold.

**Affected elements:**

- `.sl-label-n` — section numbers ("01", "02" …)
- `.sl-kicker-sep` — title-slide separator "·"
- `.sl-em` — inline emphasis in body text
- `.sl-spec .tok-h` — `#` heading in the spec.md code block
- `.sl-chip-arrow` — lifecycle chip arrows ↓
- `.sl-invite em` — "I want to compare notes."
- `.sl-install-prompt` — `$` prompt in the install chip
- `.sl-bullets li::before` — `–` bullet markers
- `.detail-cmd` / `.detail-badge` — required-tier color in the flow detail panel

**What we tried:** Making these elements bold (font-weight: 700) to qualify for
the 3:1 large-text threshold. The math looked close (theoretical ~3.05:1) but
the P3 display pushes the measured value to 2.62:1.

**What we need:** A darker text-use variant of the orange that reads as
Ingage-branded but passes AA contrast. Options discussed:

1. A darker Ingage orange (exact value TBD — darker variants tried so far look
   too different from the brand color per Patrick)
2. Exclude color-contrast from axe for known brand-color elements (weakens tests)
3. Accept the gap for the live 7-min talk; fix before publishing the leave-behind

**9 Playwright tests currently failing** because of this — all the `no axe violations`
slide tests plus the flow detail panel test.
