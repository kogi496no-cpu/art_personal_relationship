import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { NodeResizer /*, NodeToolbar */ } from '@reactflow/node-resizer'; // NodeToolbarをコメントアウト
import '@reactflow/node-resizer/dist/style.css';
import { Typography } from '@mui/material'; // Typographyを追加

export type GroupNodeProps = NodeProps & {
  label?: string;
};

const isValidConnection = (connection: any) => true; // For now, allow all connections

export function GroupNode({ selected, data }: GroupNodeProps) {
  return (
    <div className="group-node">
      <NodeResizer isVisible={selected} minWidth={100} minHeight={50} />
      {/* <NodeToolbar isVisible={selected} position={data.toolbarPosition}>
        <div style={{
          backgroundColor: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          {data.toolbarTitle}
        </div>
      </NodeToolbar> */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{data.label}</Typography>
      <Handle type="target" position={Position.Top} isValidConnection={isValidConnection} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} isValidConnection={isValidConnection} style={{ background: '#555' }} />
    </div>
  );
}

export default GroupNode;