import { useState, useEffect, useCallback } from "react";
import SpecKitFlow from "./flow/SpecKitFlow.jsx";
import { SLIDE_REGISTRY } from "./slides/SlideShow.jsx";
import { VARIANTS, isKnownVariant } from "./data/variants.js";
import { STEP_IDS } from "./data/steps.js";
import VariantPicker from "./picker/VariantPicker.jsx";

const FLOW_SLUG = "spec-kit-flow";

// The active variant resolved from the URL: a known ?variant= key, else null
// (which means "show the picker"). An unknown key resolves to null too, so a bad
// link is recoverable rather than silently defaulting.
function variantFromUrl() {
  const key = new URLSearchParams(window.location.search).get("variant");
  return isKnownVariant(key) ? key : null;
}

export default function App() {
  // Variant lives in component state, so switching is an in-app transition (no
  // full reload): instant, and it never re-downloads the bundle or re-inits the
  // flow graph mid-talk. The URL is kept in sync for shareability + back/forward.
  const [variantKey, setVariantKey] = useState(variantFromUrl);

  // Switch into a deck: push a shareable URL (path + query, no fragment so the
  // deck opens at the title) and update state. The ?variant= param persists for
  // the deck's lifetime (in-deck hash navigation preserves the query string), so
  // the deck is shareable and the in-deck "Pick a talk" switcher stays hidden.
  function selectVariant(key) {
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}?variant=${encodeURIComponent(key)}`,
    );
    setVariantKey(key);
  }

  // Return to the picker: drop the variant (and any in-deck hash) from the URL.
  function backToPicker() {
    window.history.pushState(null, "", window.location.pathname);
    setVariantKey(null);
  }

  // Browser back/forward across picker <-> deck transitions: re-resolve from URL.
  useEffect(() => {
    function onPop() {
      setVariantKey(variantFromUrl());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (!variantKey) return <VariantPicker onSelect={selectVariant} />;
  // Keying the deck on the variant remounts it on switch, so its in-deck
  // location resets to the title (the pushed URL carries no hash).
  return (
    <Deck key={variantKey} variantKey={variantKey} onExit={backToPicker} />
  );
}

function Deck({ variantKey, onExit }) {
  const entries = VARIANTS[variantKey].entries;
  const flowIndex = entries.findIndex((e) => e.type === "flow");

  // The "Pick a talk" switcher shows only when there is no ?variant= query param.
  // Both direct links and picker selections stamp the param, so in normal use the
  // deck is param-backed and the switcher stays hidden; it only appears if a deck
  // is somehow reached without the param. The param is fixed for the deck's
  // lifetime (hash navigation preserves it, and the deck remounts on a variant
  // switch), so reading it once at render is enough.
  const lockedToVariant = new URLSearchParams(window.location.search).has(
    "variant",
  );

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
    // Flow hashes only resolve if this variant actually has a flow entry;
    // otherwise fall through to the slug lookup (which lands on the title).
    if (flowIndex !== -1) {
      if (raw === FLOW_SLUG) return { index: flowIndex, activeId: null };
      if (raw.startsWith(`${FLOW_SLUG}/`)) {
        const id = raw.slice(FLOW_SLUG.length + 1);
        return {
          index: flowIndex,
          activeId: STEP_IDS.includes(id) ? id : null,
        };
      }
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
          // Esc/Home returns the flow to its overview (per CLAUDE.md interaction
          // model). It never advances the deck, so pressing Esc to leave
          // fullscreen does not also jump slides. To exit the flow, arrow back.
          e.preventDefault();
          setActiveId(null);
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
        {/* Return to the variant picker to switch talks (keyboard reachable).
            Hidden on the flow, where the section label occupies the same
            top-left corner; arrow back out of the flow to reach it. */}
        {!inFlow && !lockedToVariant && (
          <button type="button" className="deck-to-picker" onClick={onExit}>
            Pick a talk
          </button>
        )}
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
                e.type === "flow"
                  ? "Interactive flow"
                  : e.section
                    ? `Section ${e.section}`
                    : e.slug === "title"
                      ? "Title"
                      : e.slug.replace(/-/g, " ")
              }
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
