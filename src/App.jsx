import { useState, useEffect, useCallback } from "react";
import SpecKitFlow from "./flow/SpecKitFlow.jsx";
import { SLIDE_REGISTRY } from "./slides/SlideShow.jsx";
import { VARIANTS, isKnownVariant } from "./data/variants.js";
import { STEP_IDS } from "./data/steps.js";
import VariantPicker from "./picker/VariantPicker.jsx";

const FLOW_SLUG = "spec-kit-flow";

function readVariantParam() {
  return new URLSearchParams(window.location.search).get("variant");
}

// Choosing a variant reflects it in the URL; the reload enters deck mode at the
// first slide (no hash). The variant is fixed for the session, so switching is a
// reload, consistent with how variant resolution already works.
function selectVariant(key) {
  window.location.search = `?variant=${encodeURIComponent(key)}`;
}

// Returning to the picker drops the variant (and any in-deck hash) so resolution
// falls back to picker mode.
function backToPicker() {
  window.location.assign(window.location.pathname);
}

export default function App() {
  const variantKey = readVariantParam();
  // No variant, or an unknown one: show the picker rather than silently
  // defaulting. A known variant goes straight into its deck, preserving the
  // existing deep-link behavior (including the in-deck hash).
  if (!isKnownVariant(variantKey)) {
    return <VariantPicker onSelect={selectVariant} />;
  }
  return <Deck variantKey={variantKey} />;
}

function Deck({ variantKey }) {
  const entries = VARIANTS[variantKey].entries;
  const flowIndex = entries.findIndex((e) => e.type === "flow");

  // ── URL hash <-> in-deck location (shareable / deep-linkable) ──────────────
  //   (no hash)                       -> first entry (title)
  //   #whats-the-problem, #whats-sdd… -> that slide, by slug
  //   #spec-kit-flow                  -> interactive flow, overview
  //   #spec-kit-flow/analyze          -> interactive flow, focused on a step node
  // entries is stable for the session (fixed variant), so these are memoized and
  // can be honest effect dependencies without re-running on every render.
  const parseHash = useCallback(() => {
    const raw = window.location.hash.replace(/^#\/?/, "");
    if (!raw) return { index: 0, activeId: null };
    if (raw === FLOW_SLUG) return { index: flowIndex, activeId: null };
    if (raw.startsWith(`${FLOW_SLUG}/`)) {
      const id = raw.slice(FLOW_SLUG.length + 1);
      return {
        index: flowIndex,
        activeId: STEP_IDS.includes(id) ? id : null,
      };
    }
    const idx = entries.findIndex((e) => e.slug === raw);
    return idx === -1
      ? { index: 0, activeId: null }
      : { index: idx, activeId: null };
  }, [entries, flowIndex]);

  const locationToHash = useCallback(
    (index, activeId) => {
      const entry = entries[index];
      if (!entry) return "";
      if (entry.type === "flow")
        return activeId ? `#${FLOW_SLUG}/${activeId}` : `#${FLOW_SLUG}`;
      return `#${entry.slug}`;
    },
    [entries],
  );

  const initial = parseHash();
  const [index, setIndex] = useState(initial.index);
  const [activeId, setActiveId] = useState(initial.activeId);

  const entry = entries[index];
  const inFlow = entry?.type === "flow";

  function navigateTo(target) {
    setActiveId(null);
    setIndex(Math.max(0, Math.min(target, entries.length - 1)));
  }

  useEffect(() => {
    function onKey(e) {
      const forward =
        e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ";
      const back = e.key === "ArrowLeft" || e.key === "ArrowUp";

      if (inFlow) {
        if (e.key === "Escape" || e.key === "Home") {
          // First Esc/Home returns the flow to overview; a second exits forward.
          if (activeId) setActiveId(null);
          else setIndex((i) => Math.min(i + 1, entries.length - 1));
          return;
        }
        const idx = activeId ? STEP_IDS.indexOf(activeId) : -1;
        if (forward) {
          e.preventDefault();
          if (idx >= STEP_IDS.length - 1) {
            // Past the last node: leave the flow forward.
            setActiveId(null);
            setIndex((i) => Math.min(i + 1, entries.length - 1));
          } else {
            setActiveId(STEP_IDS[idx + 1]);
          }
        } else if (back) {
          e.preventDefault();
          if (activeId !== null) {
            if (idx <= 0) setActiveId(null);
            else setActiveId(STEP_IDS[idx - 1]);
          } else {
            // Overview, going back: leave the flow backward.
            setIndex((i) => Math.max(i - 1, 0));
          }
        }
      } else {
        if (forward) {
          e.preventDefault();
          setActiveId(null);
          setIndex((i) => Math.min(i + 1, entries.length - 1));
        } else if (back) {
          e.preventDefault();
          setActiveId(null);
          setIndex((i) => Math.max(i - 1, 0));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inFlow, activeId, entries.length]);

  // Reflect the current location in the URL hash. replaceState keeps the URL
  // shareable without pushing a history entry for every step, and preserves the
  // ?variant= query param.
  useEffect(() => {
    const desired = locationToHash(index, activeId);
    if (desired === window.location.hash) return;
    window.history.replaceState(
      null,
      "",
      desired || window.location.pathname + window.location.search,
    );
  }, [index, activeId, locationToHash]);

  // Sync state when the hash changes externally (opened link, manual edit, back/forward).
  useEffect(() => {
    function onHashChange() {
      const loc = parseHash();
      setIndex(loc.index);
      setActiveId(loc.activeId);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [parseHash]);

  return (
    <div className="slideshow">
      <div className="slide-stage">
        {/* Title slide already shows the hero logo up top; reserve the corner mark for the rest */}
        {entry?.id !== "title" && (
          <img
            src="/logos/ingage-logo-orange-blue2025.png"
            alt="Ingage"
            className="slide-logo-mark"
            aria-hidden="true"
          />
        )}
        {/* Return to the variant picker to switch talks (keyboard reachable). */}
        <button type="button" className="deck-to-picker" onClick={backToPicker}>
          Pick a talk
        </button>
        {inFlow ? (
          <>
            <p className="sl-label flow-label">
              <span className="sl-label-n">
                {String(entry.section).padStart(2, "0")}
              </span>
              <span className="sl-label-sep"> · </span>
              {entry.label}
            </p>
            <div key="flow" className="flow-anim">
              <SpecKitFlow activeId={activeId} setActiveId={setActiveId} />
            </div>
          </>
        ) : (
          <div key={index} className="slide-anim">
            {(() => {
              const Slide = SLIDE_REGISTRY[entry.id];
              return Slide ? (
                <Slide section={entry.section} {...(entry.props || {})} />
              ) : null;
            })()}
          </div>
        )}

        <nav className="slide-dots">
          {entries.map((e, i) => (
            <button
              key={i}
              className="slide-dot"
              data-active={i === index || undefined}
              onClick={() => navigateTo(i)}
              aria-label={
                e.type === "flow" ? "Interactive Flow" : `Slide ${i + 1}`
              }
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
