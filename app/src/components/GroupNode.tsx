
import React from 'react';

const GroupNode = ({ data }: { data: { label?: string } }) => {
  return (
    <div style={{
      // width and height will be set by the style prop on the node
      border: '2px solid #777',
      borderRadius: '15px',
      background: 'rgba(0, 100, 255, 0.05)',
    }}>
      {data.label && (
        <div style={{ padding: '10px', fontWeight: 'bold' }}>
          {data.label}
        </div>
      )}
    </div>
  );
};

export default GroupNode;
