import React from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../workflow/CustomNode';
import TriggerNode from '../workflow/TriggerNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: CustomNode,
  condition: CustomNode,
  delay: CustomNode,
  aiAction: CustomNode,
  integration: CustomNode
};

const WorkflowVisualization = ({ nodes, edges }) => {
  return (
    <div className="h-[400px] w-full bg-gray-50 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'trigger') return '#ff0072';
            if (n.type === 'action') return '#1a192b';
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.type === 'trigger') return '#ff0072';
            if (n.type === 'action') return '#1a192b';
            return '#fff';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowVisualization; 