'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface AddNodeFormProps {
  onAddNode: (data: { label: string; era: string; description: string; masterpieces: string }) => void;
}

export default function AddNodeForm({ onAddNode }: AddNodeFormProps) {
  const [label, setLabel] = useState('');
  const [era, setEra] = useState('');
  const [description, setDescription] = useState('');
  const [masterpieces, setMasterpieces] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label) {
      alert('人物名を入力してください。');
      return;
    }
    onAddNode({ label, era, description, masterpieces });
    setLabel('');
    setEra('');
    setDescription('');
    setMasterpieces('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        新しい人物を追加
      </Typography>
      <TextField
        label="人物名"
        variant="outlined"
        size="small"
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="時代"
        variant="outlined"
        size="small"
        fullWidth
        value={era}
        onChange={(e) => setEra(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="解説"
        variant="outlined"
        size="small"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="代表作 (カンマ区切り)"
        variant="outlined"
        size="small"
        fullWidth
        value={masterpieces}
        onChange={(e) => setMasterpieces(e.target.value)}
        sx={{ mb: 2 }}
        helperText="例: 作品A, 作品B, 作品C"
      />
      <Button type="submit" variant="contained" fullWidth>
        追加
      </Button>
    </Box>
  );
}
