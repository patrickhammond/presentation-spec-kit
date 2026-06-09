import { Handle, Position } from "@xyflow/react";
import { TIER_META } from "../data/steps.js";

export default function StepNode({ data }) {
  const { step, isActive, isDimmed } = data;
  const tier = TIER_META[step.tier];

  return (
    <div
      className="step-node"
      data-tier={step.tier}
      data-active={isActive || undefined}
      data-dimmed={isDimmed || undefined}
      style={{ "--tier-color": tier.color }}
    >
      {/* Standard top/bottom handles for main flow */}
      {step.id !== "constitution" && (
        <Handle
          id="top"
          type="target"
          position={Position.Top}
          className="step-handle"
        />
      )}
      {step.id !== "implement" && (
        <Handle
          id="bottom"
          type="source"
          position={Position.Bottom}
          className="step-handle"
        />
      )}

      {/* Specify: offset bottom source for optional branches + right target for returns */}
      {step.id === "specify" && (
        <>
          <Handle
            id="bottom-right"
            type="source"
            position={Position.Bottom}
            className="step-handle step-handle--offset-right"
          />
          <Handle
            id="right-in"
            type="target"
            position={Position.Right}
            className="step-handle"
          />
        </>
      )}

      {/* Clarify / Checklist: enter left, exit right */}
      {(step.id === "clarify" || step.id === "checklist") && (
        <>
          <Handle
            id="left-in"
            type="target"
            position={Position.Left}
            className="step-handle"
          />
          <Handle
            id="right-out"
            type="source"
            position={Position.Right}
            className="step-handle"
          />
        </>
      )}

      {/* Specify / Plan / Tasks: left targets for analyze loop-back arrows */}
      {(step.id === "specify" || step.id === "plan" || step.id === "tasks") && (
        <Handle
          id="left-in"
          type="target"
          position={Position.Left}
          className="step-handle"
        />
      )}

      {/* Tasks: offset bottom source for optional branch to analyze */}
      {step.id === "tasks" && (
        <Handle
          id="bottom-left"
          type="source"
          position={Position.Bottom}
          className="step-handle step-handle--offset-left"
        />
      )}

      {/* Analyze: right target for gate from tasks; left source for loop-backs */}
      {step.id === "analyze" && (
        <>
          <Handle
            id="right-in"
            type="target"
            position={Position.Right}
            className="step-handle"
          />
          <Handle
            id="left-out"
            type="source"
            position={Position.Left}
            className="step-handle"
          />
        </>
      )}

      <div className="step-node-bar" />
      <div className="step-node-body">
        <div className="step-node-cmd">{step.cmd}</div>
        <div className="step-node-sub">{step.sub}</div>
      </div>
      <div className="step-node-tier">{tier.label}</div>
    </div>
  );
}
