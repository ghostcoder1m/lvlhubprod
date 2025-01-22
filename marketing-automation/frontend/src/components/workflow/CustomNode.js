import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const getNodeStyle = (type) => {
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    minWidth: '150px',
  };

  switch (type) {
    case 'trigger':
      return {
        ...baseStyle,
        background: '#dcfce7',
        border: '2px solid #22c55e',
      };
    case 'action':
      return {
        ...baseStyle,
        background: '#dbeafe',
        border: '2px solid #3b82f6',
      };
    case 'condition':
      return {
        ...baseStyle,
        background: '#fef9c3',
        border: '2px solid #eab308',
      };
    case 'aiAction':
      return {
        ...baseStyle,
        background: '#f3e8ff',
        border: '2px solid #9333ea',
      };
    default:
      return baseStyle;
  }
};

const getHandleStyle = (type) => {
  const baseStyle = {
    width: '8px',
    height: '8px',
  };

  switch (type) {
    case 'trigger':
      return { ...baseStyle, background: '#22c55e' };
    case 'action':
      return { ...baseStyle, background: '#3b82f6' };
    case 'condition':
      return { ...baseStyle, background: '#eab308' };
    case 'aiAction':
      return { ...baseStyle, background: '#9333ea' };
    default:
      return baseStyle;
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'trigger':
      return 'play_circle';
    case 'action':
      return 'bolt';
    case 'condition':
      return 'call_split';
    case 'aiAction':
      return 'psychology';
    default:
      return 'circle';
  }
};

const CustomNode = ({ data, type }) => {
  const nodeStyle = getNodeStyle(type);
  const handleStyle = getHandleStyle(type);
  const icon = getIcon(type);

  return (
    <div style={nodeStyle}>
      {type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          style={handleStyle}
          isConnectable={true}
        />
      )}

      <div className="flex items-center">
        <span className="material-icons mr-2" style={{ fontSize: '20px' }}>
          {icon}
        </span>
        <div>
          <div className="font-medium">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
          )}
        </div>
      </div>

      {type === 'condition' ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            style={{ ...handleStyle, left: '30%' }}
            isConnectable={true}
          >
            <div className="text-xs absolute -bottom-5 left-1/2 -translate-x-1/2 text-gray-500">
              True
            </div>
          </Handle>
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            style={{ ...handleStyle, left: '70%' }}
            isConnectable={true}
          >
            <div className="text-xs absolute -bottom-5 left-1/2 -translate-x-1/2 text-gray-500">
              False
            </div>
          </Handle>
        </>
      ) : (
        type !== 'trigger' && (
          <Handle
            type="source"
            position={Position.Bottom}
            style={handleStyle}
            isConnectable={true}
          />
        )
      )}
    </div>
  );
};

export default memo(CustomNode); 