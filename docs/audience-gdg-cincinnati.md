# Audience – GDG Cincinnati (primary)

**Variant slug:** `gdg` · **Format:** ~40 min talk + Q&A, with 1–2 live demos · **Status:** in development (primary target)

This is the current primary target. Every new content decision should trace back here. The
delivered Ingage lightning talk lives in [`audience-ingage-lightning.md`](audience-ingage-lightning.md);
the reusable client template is [`audience-client.md`](audience-client.md). Index: [`audience.md`](audience.md).

## Who is in the room

- A **GDG Cincinnati** (Google Developer Group) community meetup audience.
- **All developers.** No non-developer accommodation needed. This removes the "two doors" constraint that shaped the Ingage talk: pitch the next step at developers directly.
- **Curious about learning or growing their Spec Kit experience.** Some have never run it; some use it already and want to get better. Assume goodwill and genuine interest, not skepticism to overcome.
- **Full spectrum of experience**, junior through senior. The "you already run this lifecycle" recognition beat still earns its place for the less experienced; it just does not need to carry the whole talk the way it did for the mixed Ingage room.
- **Community, not internal team.** No shared internal context, no internal Slack, no assumed Ingage tooling. The speaker represents Ingage but the room does not.

## Format

- **~40 minutes + Q&A.** Roughly 5x the lightning talk. Pace can slow down; the lightning talk was tight with fast talking, this one breathes.
- **1–2 live demos**, with the demo as the centerpiece (playbook: [`../playbook.md`](../playbook.md)). The Ingage "no live demo, deliberately" rule is **reversed** here.
- New structural slides this variant adds: an **intro / who-am-I** slide and a **"time for the demo"** transition slide (and a way back out of the demo).
- Target **16:10** (1920×1200), same projected-screen design discipline.
- Shared afterward as a GitHub repo link; the deck doubles as a self-guided, interactive leave-behind, same as Ingage.

## Goal

Create **curiosity and momentum**, and help people **grow their Spec Kit experience**: leave able and motivated to try it (or try it better). More hands-on in spirit than the Ingage talk, but the hands-on lives in the **live demo, not the slides** – slides stay conceptual and scannable.

## Success criteria

Any one of these is a win:

- People are curious to keep exploring Spec Kit and adjacent AI techniques.
- People who have never tried it take a first step.
- People who already use it pick up at least one new idea (a command, a loop, a habit).
- People can place Spec Kit in the wider ecosystem (Spec Kit / OpenSpec / Kiro).

## What this implies for the content

- **Slides stay conceptual; the demo carries the hands-on.** Do not bloat slides with `spec.md` / `plan.md` / `tasks.md` dumps or step-by-step how-to. Keep the cadence bet from the lightning talk (one idea per slide, large type, near-zero reading load). Show the real artifacts live, in the demo.
- **Lead with recognition, but lighter.** "This is the SDLC with executable artifacts" still opens well, but for an all-dev, already-curious room it can compress; you have earned attention without it.
- **The flow can breathe.** With ~40 minutes, the eight-command flow walk is no longer time-starved. Spend real time on the loops (where iteration and quality live), since that is the part practitioners under-use.
- **Add a practitioner / "what I've learned" beat.** A community dev room values honest, in-the-trenches detail more than a polished pitch. The "What Am I Still Figuring Out?" beat expands here.
- **Place it in the ecosystem.** Same explicit goal: name the landscape so it does not get relegated to Q&A.
- **End on curiosity + a community-appropriate next step**, not the internal Slack channel.

## Demo implications

- **Meta demo on this repository, safety-netted.** The demo specs a real feature in this very repo (the deck app), which is self-referential ("I specced a talk about specs, now watch me spec a feature in the talk") and clone-able afterward.
- **The constitution is a teaching moment.** This repo's constitution encodes its real house rules (no inline styles, no em dashes, curly quotes, `vmin` type). The room watches the constitution enforce house style on agent-written code, which makes the most abstract command concrete.
- **Build the real feature ahead of time; re-derive a slice live.** The variant system that powers this very talk is built for real (so all decks run); the live demo re-derives a self-contained slice against a pre-built safety branch, so the talk does not ride on a cold agent run.
- **Two paths, both supported:** a clean run from a repo state with no pre-generated artifacts, and a safety branch holding the full artifacts as a fallback.

## Leave-behind design implications

Same as the lightning talk: per-node flow `pts` must stand alone without narration, and the repo link does double duty (learn more / get the deck). The spoken "the deck is interactive, clone it" offer is made at the close.

## What carries over vs. what changes from the Ingage talk

| Aspect                      | Ingage (lightning)                 | GDG Cincinnati                               |
| --------------------------- | ---------------------------------- | -------------------------------------------- |
| Room                        | Internal, mixed dev + delivery/org | Community, all developers                    |
| Length                      | 7–8 min                            | ~40 min + Q&A                                |
| Live demo                   | None, deliberately                 | 1–2, the centerpiece                         |
| "Two doors" (dev + non-dev) | Required                           | Dropped (all devs)                           |
| How-to depth                | Avoided                            | In the demo, not the slides                  |
| Intro / who-am-I            | None                               | Added                                        |
| Close                       | Internal `#ai-practitioners` Slack | Community-appropriate (repo + keep-in-touch) |
| Branding                    | Ingage house deck                  | Ingage-represented, community-facing         |

## Open questions to resolve as content develops

- **Branding for a community room:** keep the full Ingage light theme + logo, or soften it for a vendor-neutral GDG audience? (Leaning: keep it; the speaker is from Ingage and it is a clean brand.)
- **Close / next step:** what replaces `#ai-practitioners`? Candidates: the spec-kit repo, the GDG community, the speaker's own contact/handle, an "open questions" rallying point.
- **One demo or two?** A single meta demo on this repo, or a quick fresh-`init` happy path first, then the meta demo. (Current lean: one safety-netted meta demo, expandable to two if rehearsal time allows.)
- **Who-am-I content:** placeholder for now, to be filled in with role, Spec Kit experience, and why the speaker cares.
