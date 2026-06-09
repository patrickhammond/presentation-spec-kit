import { Handle, Position } from "@xyflow/react";

export default function LabelNode({ data }) {
  return (
    <div className="label-node">
      {data.text}
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="step-handle"
      />
    </div>
  );
}
