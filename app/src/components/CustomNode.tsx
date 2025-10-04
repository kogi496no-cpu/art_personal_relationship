'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';

function CustomNode({ data }: NodeProps) {
  const getGlowStyle = (count: number) => {
    if (count === 0) return {};
    if (count <= 2) return { boxShadow: '0 0 8px 2px #C5E1A5' }; // Light Green
    if (count <= 4) return { boxShadow: '0 0 12px 4px #FFD54F' }; // Amber
    return { boxShadow: '0 0 20px 6px #FF8A65' }; // Deep Orange
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        borderRadius: '8px',
        padding: '12px 18px',
        minWidth: '150px',
        background: '#fffaf2',
        border: '1px solid #e0e0e0',
        ...getGlowStyle(data.edgeCount || 0),
        transition: 'box-shadow 0.3s ease-in-out',
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
