import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { STEPS, STEP_MAP } from "../data/steps.js";
import StepNode from "./StepNode.jsx";
import LoopEdge from "./LoopEdge.jsx";
import DetailPanel from "./DetailPanel.jsx";

// Layout constants
const NODE_W_MAIN = 260;
const NODE_W_OPT = 240;
const NODE_H = 78;

const POSITIONS = {
  constitution: { x: 100, y: 20 },
  specify: { x: 100, y: 160 },
  clarify: { x: 440, y: 270 },
  checklist: { x: 440, y: 390 },
  plan: { x: 100, y: 510 },
  tasks: { x: 100, y: 660 },
  analyze: { x: -200, y: 780 },
  implement: { x: 100, y: 960 },
};

// Edge styles
const ARROW = { type: MarkerType.ArrowClosed, width: 12, height: 12 };
const FLOW_STYLE = { stroke: "#9BAAB8", strokeWidth: 2 };
const GATE_STYLE = {
  stroke: "#B8C4CC",
  strokeWidth: 1.5,
  strokeDasharray: "5 4",
};
const INITIAL_EDGES = [
  // Main flow — tasks goes directly to implement; analyze is optional
  {
    id: "e-cs",
    source: "constitution",
    target: "specify",
    type: "smoothstep",
    style: FLOW_STYLE,
    markerEnd: ARROW,
  },
  {
    id: "e-sp",
    source: "specify",
    target: "plan",
    type: "smoothstep",
    style: FLOW_STYLE,
    markerEnd: ARROW,
  },
  {
    id: "e-pt",
    source: "plan",
    target: "tasks",
    type: "smoothstep",
    style: FLOW_STYLE,
    markerEnd: ARROW,
  },
  {
    id: "e-ti",
    source: "tasks",
    target: "implement",
    type: "smoothstep",
    style: FLOW_STYLE,
    markerEnd: ARROW,
  },

  // Optional gate branches — bidirectional (single edge, arrows on both ends)
  {
    id: "e-sp-cl",
    source: "specify",
    sourceHandle: "bottom-right",
    target: "clarify",
    targetHandle: "left-in",
    type: "default",
    style: GATE_STYLE,
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-cl-sp",
    source: "clarify",
    sourceHandle: "right-out",
    target: "specify",
    targetHandle: "right-in",
    type: "loopEdge",
    style: GATE_STYLE,
    data: { side: "right", offset: 85 },
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-sp-ch",
    source: "specify",
    sourceHandle: "bottom-right",
    target: "checklist",
    targetHandle: "left-in",
    type: "default",
    style: GATE_STYLE,
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-ch-sp",
    source: "checklist",
    sourceHandle: "right-out",
    target: "specify",
    targetHandle: "right-in",
    type: "loopEdge",
    style: GATE_STYLE,
    data: { side: "right", offset: 125 },
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-ta",
    source: "tasks",
    sourceHandle: "bottom-left",
    target: "analyze",
    targetHandle: "right-in",
    type: "default",
    style: GATE_STYLE,
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },

  // Analyze loop-back arcs (left side), fanned at increasing offsets to show
  // analyze surfaces gaps in any of spec / plan / tasks; you loop back to fix them
  {
    id: "e-at",
    source: "analyze",
    sourceHandle: "left-out",
    target: "tasks",
    targetHandle: "left-in",
    type: "loopEdge",
    style: GATE_STYLE,
    data: { offset: 55 },
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-ap",
    source: "analyze",
    sourceHandle: "left-out",
    target: "plan",
    targetHandle: "left-in",
    type: "loopEdge",
    style: GATE_STYLE,
    data: { offset: 105 },
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
  {
    id: "e-as",
    source: "analyze",
    sourceHandle: "left-out",
    target: "specify",
    targetHandle: "left-in",
    type: "loopEdge",
    style: GATE_STYLE,
    data: { offset: 155 },
    markerEnd: { ...ARROW, color: "#B8C4CC" },
  },
];

function buildInitialNodes() {
  return STEPS.map((step) => ({
    id: step.id,
    type: "stepNode",
    position: POSITIONS[step.id],
    data: { step, isActive: false, isDimmed: false },
    style: { width: step.tier === "optional" ? NODE_W_OPT : NODE_W_MAIN },
  }));
}

const nodeTypes = { stepNode: StepNode };
const edgeTypes = { loopEdge: LoopEdge };
const initNodes = buildInitialNodes();

// ── outer wrapper provides the ReactFlow context ────────────────────────────
export default function SpecKitFlow({ activeId, setActiveId }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas activeId={activeId} setActiveId={setActiveId} />
    </ReactFlowProvider>
  );
}

// ── inner canvas has access to useReactFlow ──────────────────────────────────
function FlowCanvas({ activeId, setActiveId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges] = useEdgesState(INITIAL_EDGES);
  const { setCenter, fitView } = useReactFlow();
  const canvasWidth = useStore((s) => s.width);
  // Keep a ref so onInit reads the latest canvas width without taking it as a
  // closure dependency. Synced in an effect (writing a ref during render is not
  // allowed); the positioning effect below reads canvasWidth directly.
  const canvasWidthRef = useRef(canvasWidth);
  useEffect(() => {
    canvasWidthRef.current = canvasWidth;
  }, [canvasWidth]);
  // Guard: don't call setCenter/fitView until ReactFlow has initialized
  const isInitialized = useRef(false);

  // Sync active/dimmed state and pan to focused node
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isActive: n.id === activeId,
          isDimmed: activeId !== null && n.id !== activeId,
        },
      })),
    );
    // onInit handles the first viewport positioning; skip until then
    if (!isInitialized.current) return;
    if (activeId) {
      const pos = POSITIONS[activeId];
      const isOpt = STEP_MAP[activeId]?.tier === "optional";
      const zoom = 1.6;
      const cx = pos.x + (isOpt ? NODE_W_OPT : NODE_W_MAIN) / 2;
      const cy = pos.y + NODE_H / 2;
      // Shift left so the node centres in the open 67% (panel covers right 33%)
      const offset = (canvasWidth * 0.165) / zoom;
      setCenter(cx + offset, cy, { zoom, duration: 500 });
    } else {
      fitView({ duration: 500, padding: 0.12 });
    }
  }, [activeId, setNodes, setCenter, fitView, canvasWidth]);

  // onInit fires after ReactFlow has measured its container and is ready to
  // accept setCenter/fitView calls — use it to apply the initial viewport so
  // deep links like #spec-kit-flow/analyze zoom correctly on first load.
  const handleInit = useCallback(() => {
    isInitialized.current = true;
    if (activeId) {
      const pos = POSITIONS[activeId];
      const isOpt = STEP_MAP[activeId]?.tier === "optional";
      const zoom = 1.6;
      const cx = pos.x + (isOpt ? NODE_W_OPT : NODE_W_MAIN) / 2;
      const cy = pos.y + NODE_H / 2;
      const offset = (canvasWidthRef.current * 0.165) / zoom;
      setCenter(cx + offset, cy, { zoom, duration: 0 });
    } else {
      fitView({ duration: 0, padding: 0.08 });
    }
  }, [activeId, setCenter, fitView]);

  const handleNodeClick = useCallback(
    (_, node) => {
      setActiveId((prev) => (prev === node.id ? null : node.id));
    },
    [setActiveId],
  );

  const activeMeta = activeId ? STEP_MAP[activeId] : null;

  return (
    <div className="flow-root">
      <div className="flow-canvas-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={handleNodeClick}
          onInit={handleInit}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          colorMode="light"
          zoomOnScroll={true}
          panOnDrag={true}
          minZoom={0.25}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#D8D0C8" gap={32} size={1} />
        </ReactFlow>

        {activeMeta && <DetailPanel step={activeMeta} />}
      </div>
    </div>
  );
}
