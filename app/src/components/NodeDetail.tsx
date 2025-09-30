'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Box, Typography, Chip, Button, TextField, Stack } from '@mui/material';

interface NodeDetailProps {
  node: Node | null;
  onSave: (data: any) => void;
}

export default function NodeDetail({ node, onSave }: NodeDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(node?.data);

  useEffect(() => {
    setFormData(node?.data);
  }, [node]);

  if (!node) {
    return (
      <Box sx={{ mt: 2, p: 2, background: '#f0f0f0', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ノードを選択すると、ここに詳細情報が表示されます。
        </Typography>
      </Box>
    );
  }

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleMasterpiecesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev: any) => ({ ...prev, masterpieces: value.split(',').map(s => s.trim()) }));
  };

  if (isEditing) {
    return (
      <Box sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="ラベル"
            name="label"
            value={formData?.label || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="時代"
            name="era"
            value={formData?.era || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="説明"
            name="description"
            value={formData?.description || ''}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="代表作 (カンマ区切り)"
            name="masterpieces"
            value={formData?.masterpieces?.join(', ') || ''}
            onChange={handleMasterpiecesChange}
            fullWidth
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => setIsEditing(false)} size="small">キャンセル</Button>
            <Button onClick={handleSave} variant="contained" size="small">保存</Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  const { label, era, description, masterpieces } = node.data;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h3" gutterBottom>{label}</Typography>
        <Button onClick={() => setIsEditing(true)} size="small">編集</Button>
      </Box>
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
