'use client';

import { Node } from 'reactflow';
import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

interface NodeDetailProps {
  node: Node | null;
}

export default function NodeDetail({ node }: NodeDetailProps) {
  if (!node) {
    return (
      <Box sx={{ mt: 2, p: 2, background: '#f0f0f0', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ノードを選択すると、ここに詳細情報が表示されます。
        </Typography>
      </Box>
    );
  }

  const { label, era, description, masterpieces } = node.data;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>{label}</Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>{era}</Typography>
      
      {description && (
        <Typography variant="body2" paragraph sx={{ mt: 2 }}>
          {description}
        </Typography>
      )}

      {masterpieces && masterpieces.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>代表作:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {masterpieces.map((work: string) => (
              <Chip key={work} label={work} size="small" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
