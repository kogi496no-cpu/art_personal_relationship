
import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';

import '@reactflow/node-resizer/dist/style.css';

const GroupNode = ({ data, selected }: NodeProps<{ label?: string }>) => {
  return (
    <div style={{
      // width and height will be set by the style prop on the node
      border: '2px solid #777',
      borderRadius: '15px',
      background: 'rgba(0, 100, 255, 0.05)',
    }}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={120} 
        minHeight={120} 
      />
      {data.label && (
        <div style={{ padding: '10px', fontWeight: 'bold' }}>
          {data.label}
        </div>
      )}
    </div>
  );
};

export default GroupNode;
