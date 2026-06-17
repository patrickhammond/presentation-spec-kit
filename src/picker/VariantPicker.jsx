import { VARIANTS } from "../data/variants.js";

// The variant picker landing screen. Shown when the deck is opened without a
// known variant (no ?variant= or an unknown one). Lists every variant straight
// from the manifest, so adding a variant in src/data/variants.js makes it appear
// here with no other change. Styling lives in src/index.css (.picker-*).
//
// Native <button>s give keyboard and assistive-technology support for free:
// Tab to move, Enter/Space to choose. onSelect receives the variant key.
export default function VariantPicker({ onSelect }) {
  return (
    <div className="slideshow">
      <div className="slide-stage">
        <img
          src="/logos/ingage-logo-orange-blue2025.png"
          alt="Ingage"
          className="slide-logo-mark"
          aria-hidden="true"
        />
        <div className="slide-anim">
          <div className="slide slide--center picker">
            <h1 className="sl-h1 picker-title">Pick a talk</h1>
            <p className="picker-sub">Choose which version to present.</p>
            <ul className="picker-list">
              {Object.entries(VARIANTS).map(([key, { label, meta }]) => (
                <li key={key}>
                  <button
                    type="button"
                    className="picker-card"
                    onClick={() => onSelect(key)}
                  >
                    <span className="picker-card-text">
                      <span className="picker-card-name">{label}</span>
                      <span className="picker-card-meta">
                        <span className="picker-card-room">{meta.room}</span>
                        <span className="picker-card-dot" aria-hidden="true">
                          ·
                        </span>
                        <span className="picker-card-length">
                          {meta.length}
                        </span>
                        {meta.demo && (
                          <span className="picker-card-demo">live demo</span>
                        )}
                      </span>
                    </span>
                    <span className="picker-card-go" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
