// Deck navigation: the pure location logic behind the keyboard walk and the
// URL hash. Extracted from App.jsx so it can be unit tested without rendering
// the React Flow canvas, and so the sub-step walk is written once.
//
// A deck location is `{ index, activeId }`: which manifest entry is showing,
// and (for entries that have sub-steps) which sub-step inside it is focused.
// `activeId: null` means the entry's own overview.
//
// Sub-steps were originally hardcoded for the interactive flow. Two entries
// need them now (the flow's step nodes and the artifacts walk's stops), so the
// map below is the single place that declares which slugs have an inner walk.
// Keying by slug (rather than by entry id or type) keeps src/data/variants.js
// plain data and makes the `#slug/subStepId` hash fall out for free.
import { STEP_IDS } from "../data/steps.js";
import { ARTIFACT_IDS } from "../data/artifacts.js";

export const FLOW_SLUG = "spec-kit-flow";
export const ARTIFACTS_SLUG = "artifacts";

const SUB_STEPS = {
  [FLOW_SLUG]: STEP_IDS,
  [ARTIFACTS_SLUG]: ARTIFACT_IDS,
};

// The ordered sub-step ids for an entry, or null if it has none. Entries
// without sub-steps are a single stop in the walk.
export function subStepsFor(entry) {
  if (!entry) return null;
  return SUB_STEPS[entry.slug] || null;
}

// #slug            -> that entry, at its overview
// #slug/subStepId  -> that entry, focused on a sub-step
// (no hash)        -> the first entry
// Anything unrecognized (an unknown slug, a sub-step an entry does not have,
// a flow hash in a variant with no flow) resolves to the safest nearby
// location rather than throwing, so a stale link is always recoverable.
export function parseDeckHash(entries, rawHash) {
  const raw = String(rawHash || "").replace(/^#\/?/, "");
  if (!raw) return { index: 0, activeId: null };

  const slug = raw.split("/")[0];
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) return { index: 0, activeId: null };

  const ids = subStepsFor(entries[index]);
  const sub = raw.slice(slug.length + 1);
  return { index, activeId: ids && ids.includes(sub) ? sub : null };
}

// The inverse of parseDeckHash. Returns "" for an out-of-range index so the
// caller can fall back to a bare path.
export function deckHash(entries, index, activeId) {
  const entry = entries[index];
  if (!entry) return "";
  const ids = subStepsFor(entry);
  return ids && activeId ? `#${entry.slug}/${activeId}` : `#${entry.slug}`;
}

function clamp(index, entries) {
  return Math.max(0, Math.min(index, entries.length - 1));
}

// One step forward. Inside an entry with sub-steps this advances through them
// first (overview -> first sub-step -> ... -> last), and only leaves the entry
// once the walk runs off the end.
export function advance(entries, { index, activeId }) {
  const ids = subStepsFor(entries[index]);
  if (ids) {
    const at = activeId ? ids.indexOf(activeId) : -1;
    if (at < ids.length - 1) return { index, activeId: ids[at + 1] };
  }
  return { index: clamp(index + 1, entries), activeId: null };
}

// One step back. The mirror of advance: retreat through the sub-steps, back
// out to the entry's overview, then leave the entry backwards.
export function retreat(entries, { index, activeId }) {
  const ids = subStepsFor(entries[index]);
  if (ids && activeId) {
    const at = ids.indexOf(activeId);
    return { index, activeId: at <= 0 ? null : ids[at - 1] };
  }
  return { index: clamp(index - 1, entries), activeId: null };
}

// Esc / Home: return the current entry to its overview without moving the
// deck, so pressing Esc to leave fullscreen never also jumps slides. Only
// meaningful for entries that have sub-steps.
export function resetSubStep(entries, { index }) {
  return { index, activeId: null };
}
