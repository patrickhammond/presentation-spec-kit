import { useState, useEffect } from "react";
import SpecKitFlow from "./flow/SpecKitFlow.jsx";
import SlideShow, {
  SLIDE_COUNT,
  FLOW_SLIDE_INDEX,
  SLIDE_SLUGS,
} from "./slides/SlideShow.jsx";
import { STEP_IDS } from "./data/steps.js";

const FLOW_POSITION = FLOW_SLIDE_INDEX + 1; // dot index 5 in the combined nav
const TOTAL_POSITIONS = SLIDE_COUNT + 1; // 10 dots total (9 slides + flow)

function slideToPosition(i) {
  return i <= FLOW_SLIDE_INDEX ? i : i + 1;
}

// ── URL hash <-> presentation location (shareable / deep-linkable) ───────────
//   (no hash)      -> title slide
//   #whats-the-problem, #whats-sdd…   -> that slide, by slug
//   #spec-kit-flow                     -> interactive flow, overview
//   #spec-kit-flow/analyze             -> interactive flow, focused on a step node
function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  if (!raw) return { mode: "slides", slideIndex: 0, activeId: null };
  if (raw === "spec-kit-flow")
    return { mode: "flow", slideIndex: FLOW_SLIDE_INDEX, activeId: null };
  if (raw.startsWith("spec-kit-flow/")) {
    const id = raw.slice(14);
    return {
      mode: "flow",
      slideIndex: FLOW_SLIDE_INDEX,
      activeId: STEP_IDS.includes(id) ? id : null,
    };
  }
  const idx = SLIDE_SLUGS.indexOf(raw);
  return idx === -1
    ? { mode: "slides", slideIndex: 0, activeId: null }
    : { mode: "slides", slideIndex: idx, activeId: null };
}

function locationToHash(mode, slideIndex, activeId) {
  if (mode === "flow")
    return activeId ? `#spec-kit-flow/${activeId}` : "#spec-kit-flow";
  return `#${SLIDE_SLUGS[slideIndex] ?? ""}`;
}

export default function App() {
  const [mode, setMode] = useState(() => parseHash().mode);
  const [slideIndex, setSlideIndex] = useState(() => parseHash().slideIndex);
  const [activeId, setActiveId] = useState(() => parseHash().activeId);

  const position =
    mode === "flow" ? FLOW_POSITION : slideToPosition(slideIndex);

  function enterFlow() {
    setActiveId(null);
    setMode("flow");
  }

  function exitFlow() {
    setActiveId(null);
    setMode("slides");
    setSlideIndex(FLOW_SLIDE_INDEX + 1);
  }

  function navigateTo(pos) {
    if (pos === FLOW_POSITION) {
      enterFlow();
    } else if (pos < FLOW_POSITION) {
      setActiveId(null);
      setMode("slides");
      setSlideIndex(pos);
    } else {
      setActiveId(null);
      setMode("slides");
      setSlideIndex(pos - 1);
    }
  }

  useEffect(() => {
    function onKey(e) {
      if (mode === "slides") {
        if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          setSlideIndex((i) => {
            if (i === FLOW_SLIDE_INDEX) {
              enterFlow();
              return i;
            }
            return Math.min(i + 1, SLIDE_COUNT - 1);
          });
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          if (slideIndex === FLOW_SLIDE_INDEX + 1) {
            enterFlow();
          } else {
            setSlideIndex((i) => Math.max(i - 1, 0));
          }
        }
      } else {
        const idx = activeId ? STEP_IDS.indexOf(activeId) : -1;
        if (e.key === "Escape" || e.key === "Home") {
          if (activeId) setActiveId(null);
          else exitFlow();
        } else if (
          e.key === "ArrowRight" ||
          e.key === "ArrowDown" ||
          e.key === " "
        ) {
          e.preventDefault();
          if (idx >= STEP_IDS.length - 1) exitFlow();
          else setActiveId(STEP_IDS[idx + 1]);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          if (activeId !== null) {
            if (idx <= 0) setActiveId(null);
            else setActiveId(STEP_IDS[idx - 1]);
          } else {
            setMode("slides");
            setSlideIndex(FLOW_SLIDE_INDEX);
          }
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, activeId, slideIndex]);

  // Reflect the current location in the URL hash. replaceState keeps the URL
  // shareable without pushing a history entry for every step.
  useEffect(() => {
    const desired = locationToHash(mode, slideIndex, activeId);
    const current = window.location.hash;
    if (desired === current) return;
    if (desired === "" && (current === "" || current === "#")) return;
    const url =
      desired === ""
        ? window.location.pathname + window.location.search
        : desired;
    window.history.replaceState(null, "", url);
  }, [mode, slideIndex, activeId]);

  // Sync state when the hash changes externally (opened link, manual edit, back/forward).
  useEffect(() => {
    function onHashChange() {
      const loc = parseHash();
      setMode(loc.mode);
      setSlideIndex(loc.slideIndex);
      setActiveId(loc.activeId);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="slideshow">
      <div className="slide-stage">
        {/* Title slide already shows the hero logo up top; reserve the corner mark for the rest */}
        {!(mode === "slides" && slideIndex === 0) && (
          <img
            src="/logos/ingage-logo-orange-blue2025.png"
            alt="Ingage"
            className="slide-logo-mark"
            aria-hidden="true"
          />
        )}
        {mode === "slides" ? (
          <div key={slideIndex} className="slide-anim">
            <SlideShow slideIndex={slideIndex} />
          </div>
        ) : (
          <>
            <p className="sl-label flow-label">
              <span className="sl-label-n">04</span>
              <span className="sl-label-sep"> · </span>
              What’s The Process?
            </p>
            <div key="flow" className="flow-anim">
              <SpecKitFlow activeId={activeId} setActiveId={setActiveId} />
            </div>
          </>
        )}

        <nav className="slide-dots">
          {Array.from({ length: TOTAL_POSITIONS }, (_, i) => (
            <button
              key={i}
              className="slide-dot"
              data-active={i === position || undefined}
              onClick={() => navigateTo(i)}
              aria-label={
                i === FLOW_POSITION ? "Interactive Flow" : `Slide ${i + 1}`
              }
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
