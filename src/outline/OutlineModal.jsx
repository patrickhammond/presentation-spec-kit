import { useState, useEffect, useRef } from "react";

export default function OutlineModal({ entries, onNavigate, onClose }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRefs = useRef([]);

  useEffect(() => {
    const btn = buttonRefs.current[focusedIndex];
    if (btn) btn.focus();
  }, [focusedIndex]);

  function handleKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, entries.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onNavigate(focusedIndex);
    }
  }

  return (
    <div className="outline-backdrop" onClick={onClose}>
      <div
        className="outline-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Slide outline"
        onKeyDown={handleKey}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="outline-list" role="listbox" aria-label="Slide outline">
          {entries.map((entry, i) => (
            <button
              key={entry.slug}
              ref={(el) => (buttonRefs.current[i] = el)}
              className="outline-entry"
              role="option"
              tabIndex={-1}
              data-type={entry.type}
              data-focused={i === focusedIndex || undefined}
              aria-selected={i === focusedIndex}
              onClick={() => onNavigate(i)}
            >
              <span className="outline-section-num">
                {entry.section != null
                  ? String(entry.section).padStart(2, "0")
                  : ""}
              </span>
              <span className="outline-title">{entry.label}</span>
              {entry.type === "flow" && (
                <span className="outline-flow-badge">interactive</span>
              )}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}
