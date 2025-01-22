import React from 'react';

const StepByStepBreakdown = ({ nodes, edges }) => {
  // Function to get the next nodes in the workflow
  const getNextNodes = (nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => ({
        node: nodes.find(n => n.id === edge.target),
        condition: edge.sourceHandle === 'true' ? 'If True' : 
                  edge.sourceHandle === 'false' ? 'If False' : null
      }));
  };

  // Function to get node icon based on type
  const getNodeIcon = (type) => {
    switch (type) {
      case 'trigger': return 'play_circle';
      case 'action': return 'bolt';
      case 'condition': return 'call_split';
      case 'delay': return 'schedule';
      case 'aiAction': return 'psychology';
      case 'integration': return 'extension';
      default: return 'circle';
    }
  };

  // Function to build the step sequence
  const buildStepSequence = () => {
    const steps = [];
    const visited = new Set();

    const traverse = (nodeId, level = 0, condition = null) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      steps.push({
        node,
        level,
        condition
      });

      const nextNodes = getNextNodes(nodeId);
      nextNodes.forEach(({ node: nextNode, condition }) => {
        if (nextNode) {
          traverse(nextNode.id, level + 1, condition);
        }
      });
    };

    // Start with trigger nodes
    const triggerNodes = nodes.filter(node => node.type === 'trigger');
    triggerNodes.forEach(node => traverse(node.id));

    return steps;
  };

  const steps = buildStepSequence();

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.node.id}
          className="flex items-start"
          style={{ paddingLeft: `${step.level * 2}rem` }}
        >
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 mr-4">
            <span className="material-icons text-indigo-600 text-xl">
              {getNodeIcon(step.node.type)}
            </span>
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Step {index + 1}:</span>
              {step.condition && (
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 mr-2">
                  {step.condition}
                </span>
              )}
              <span className="font-medium">{step.node.data.label}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {step.node.type === 'trigger' && (
                <div>Triggers when: {step.node.data.triggerType || 'Any trigger occurs'}</div>
              )}
              {step.node.type === 'action' && (
                <div>Action: {step.node.data.actionType || 'Perform action'}</div>
              )}
              {step.node.type === 'condition' && (
                <div>Checks if: {step.node.data.conditionType || 'Condition is met'}</div>
              )}
              {step.node.type === 'delay' && (
                <div>Waits for: {step.node.data.duration || '1'} {step.node.data.durationType || 'hour(s)'}</div>
              )}
              {step.node.type === 'aiAction' && (
                <div>AI Action: {step.node.data.actionType || 'Process with AI'}</div>
              )}
              {step.node.data.description && (
                <div className="mt-1 text-gray-500">{step.node.data.description}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {steps.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No steps found in this workflow
        </div>
      )}
    </div>
  );
};

export default StepByStepBreakdown; 