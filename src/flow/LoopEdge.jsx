import { EdgeLabelRenderer } from "@xyflow/react";

export default function LoopEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}) {
  const spread =
    data?.offset ?? Math.max(80, Math.abs(targetY - sourceY) * 0.22);
  const side = data?.side ?? "left";
  const anchorX =
    side === "right"
      ? Math.max(sourceX, targetX) + spread
      : Math.min(sourceX, targetX) - spread;
  const midY = (sourceY + targetY) / 2;
  const d = `M ${sourceX} ${sourceY} C ${anchorX} ${sourceY}, ${anchorX} ${targetY}, ${targetX} ${targetY}`;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path loop-edge-path"
        d={d}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="loop-label"
            style={{
              transform: `translate(-50%, -50%) translate(${anchorX}px,${midY}px)`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
