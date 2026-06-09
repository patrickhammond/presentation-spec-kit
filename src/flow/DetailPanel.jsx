import { TIER_META } from "../data/steps.js";

function renderCmds(text) {
  const parts = text.split(/(\/[a-z]+(?:\.[a-z]+)*)/g);
  return parts.map((part, i) =>
    part.startsWith("/") ? (
      <code key={i} className="detail-inline-cmd">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

export default function DetailPanel({ step }) {
  if (!step) return null;
  const tier = TIER_META[step.tier];

  return (
    <aside className="detail-panel" style={{ "--tier-color": tier.color }}>
      <div className="detail-cmd">{step.cmd}</div>
      <div className="detail-sub">{step.sub}</div>
      <span className="detail-badge">{tier.label}</span>

      <p className="detail-sum">{renderCmds(step.sum)}</p>

      <ul className="detail-pts">
        {step.pts.map((pt, i) => (
          <li key={i}>{renderCmds(pt)}</li>
        ))}
      </ul>

      <div className="detail-writes">
        <span className="detail-writes-label">Writes</span>
        <code className="detail-writes-path">{step.writes}</code>
      </div>
    </aside>
  );
}
