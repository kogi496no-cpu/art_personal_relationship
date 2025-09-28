'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';

function CustomNode({ data }: NodeProps) {
  return (
    <Paper 
      elevation={3}
      sx={{
        borderRadius: '8px',
        padding: '12px 18px',
        minWidth: '150px',
        background: '#fffaf2', // Parchment paper color
        border: '1px solid #e0e0e0'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{data.label}</Typography>
        {data.era && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{data.era}</Typography>
        )}
      </Box>
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </Paper>
  );
}

export default CustomNode;
