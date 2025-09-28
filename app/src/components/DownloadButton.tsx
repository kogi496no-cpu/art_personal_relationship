'use client';

import { Node, Edge } from 'reactflow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface DownloadButtonProps {
  nodes: Node[];
  edges: Edge[];
}

export default function DownloadButton({ nodes, edges }: DownloadButtonProps) {
  const handleDownload = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleDownloadNodes = () => {
    handleDownload(nodes, 'nodes.json');
  };

  const handleDownloadEdges = () => {
    handleDownload(edges, 'edges.json');
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
      <Button 
        variant="outlined" 
        onClick={handleDownloadNodes} 
        startIcon={<FileDownloadIcon />} 
        fullWidth
        size="small"
      >
        Nodes JSON
      </Button>
      <Button 
        variant="outlined" 
        onClick={handleDownloadEdges} 
        startIcon={<FileDownloadIcon />} 
        fullWidth
        size="small"
      >
        Edges JSON
      </Button>
    </Box>
  );
}
