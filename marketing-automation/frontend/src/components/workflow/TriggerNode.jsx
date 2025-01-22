import React from 'react';
import { Handle } from 'reactflow';

const TriggerNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-500">
          <span className="material-icons text-white text-xl">play_circle</span>
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.triggerType || 'Select trigger type'}</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position="right"
        style={{ background: '#3b82f6', width: '8px', height: '8px' }}
      />
    </div>
  );
};

export default TriggerNode; 