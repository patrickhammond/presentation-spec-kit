# Audience – Ingage Lightning Talk (delivered)

**Variant slug:** `ingage` · **Format:** 7–8 min lightning talk · **Status:** delivered (archived reference)

This is the original audience profile, for the 7–8 minute lightning talk given to an
internal Ingage audience. It is kept verbatim as the canonical record of that talk and as
the source for the `ingage` deck variant. New work targets [`audience-gdg-cincinnati.md`](audience-gdg-cincinnati.md);
see [`audience.md`](audience.md) for the index.

## Who is in the room

- ~40 people at Ingage.
- **Mostly mature, experienced software development consultants.** Assume deep SDLC fluency. Do not explain basics, and do not use framing that reads as junior (no "vibe coding," no demo-gone-wrong tropes).
- **Plus org admins through project-delivery staff.** A meaningful slice are non-developers. They should still be able to follow the whole workflow, because it maps onto a project lifecycle they already run.

This mixed makeup is the central design constraint: the talk has to land for someone who writes the code _and_ someone who scopes and delivers the work. The "you already do this" recognition beat is what serves both at once.

## Format

- Lightning talk: **7–8 minutes of content + 2–3 minutes Q&A.**
- Brisk delivery is fine and expected. Favor smaller, punchier slides the room reads in a glance over dense slides talked over.
- **No live demo, deliberately.** The people who would benefit from one are already comfortable with `uvx`; the install one-liner lives on the closing "What's Next?" slide as a pointer, not a walkthrough.
- Target **16:10** (1920×1200). Design for humans scanning a projected screen, not a developer at a desk.
- The deck is also shared afterward (pushed to GitHub), so it doubles as a self-guided, interactive leave-behind.

## Goal

Create **curiosity, awareness, and familiarity**, so people feel comfortable taking a next step and can place Spec Kit in the wider ecosystem. **This is not a how-to.** It is a "you already understand this, here is where it fits" talk.

## Success criteria

Any one of these is a win:

- People feel curious to keep the conversation going about this and other AI techniques.
- People take a first step on their own.
- People understand the value tools like this bring to their work.

## What this implies for the content

- **Lead with recognition.** The "this is just the SDLC, with executable artifacts" moment is the hook for an SDLC-literate, mildly skeptical crowd. It earns the right to make any payoff claim.
- **Two doors for the next step.** Developers: run the init. Non-developers: read a real `spec.md` and see it is just a PRD with acceptance criteria. Do not pitch the next step at developers only.
- **Place it in the ecosystem.** "Understand where it fits" is an explicit goal, so the close names the landscape (Spec Kit / OpenSpec, plus plugins like Superpowers, GSD, and Grill Me) rather than leaving it to Q&A.
- **End on curiosity.** Open questions invite the conversation to continue better than a summary or a "Questions?" slide.

## Leave-behind design implications

The deck is shared after the talk as a GitHub repo link (one link that serves both "where to learn more" and "get the deck"). This makes the interactive flow a self-guided artifact, not just a stage prop. Two constraints follow:

- **Per-node `pts` must be self-explanatory without narration.** Someone clicking through solo has no speaker. Write talking points so they stand alone as complete thoughts, not as prompts for a speaker to riff from.
- **The "want the deck, it is interactive" offer is made verbally on stage** at the close. The on-slide note was dropped to keep the closing "What's Next?" slide uncluttered; the repo link there still does double duty (learn more / get the deck), and the spoken offer remains the curiosity hook.

The implication for live delivery: detail you cut from the spoken talk is not lost; it lives in the leave-behind. You can narrate lightly and let the copy carry the depth.

## Variant-specific notes

- **Close is internal:** the "What's Next?" slide points to the internal `#ai-practitioners` Slack channel. This is Ingage-only and does **not** carry to community variants.
- **Branding:** Ingage light theme, logo on every slide. This is the house deck.
