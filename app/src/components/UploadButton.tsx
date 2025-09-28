'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React from 'react';
import { Node, Edge } from 'reactflow';

interface UploadButtonProps {
  onUploadNodes: (nodes: Node[]) => void;
  onUploadEdges: (edges: Edge[]) => void;
}

export default function UploadButton({ onUploadNodes, onUploadEdges }: UploadButtonProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'nodes' | 'edges') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (type === 'nodes') {
          onUploadNodes(data);
        }
        if (type === 'edges') {
          onUploadEdges(data);
        }
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} JSONファイルを読み込みました。`);
      } catch (error) {
        alert('JSONファイルの読み込みに失敗しました。ファイル形式を確認してください。');
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
      <Button 
        variant="outlined" 
        component="label" 
        startIcon={<UploadFileIcon />} 
        fullWidth
        size="small"
      >
        Nodes JSON
        <input 
          type="file" 
          hidden 
          accept=".json" 
          onChange={(e) => handleFileUpload(e, 'nodes')}
        />
      </Button>
      <Button 
        variant="outlined" 
        component="label" 
        startIcon={<UploadFileIcon />} 
        fullWidth
        size="small"
      >
        Edges JSON
        <input 
          type="file" 
          hidden 
          accept=".json" 
          onChange={(e) => handleFileUpload(e, 'edges')}
        />
      </Button>
    </Box>
  );
}
