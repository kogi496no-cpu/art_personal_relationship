'use client';

import { useState } from 'react';
import { Node } from 'reactflow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface AddEdgeFormProps {
  nodes: Node[];
  onAddEdge: (source: string, target: string, label: string) => void;
}

export default function AddEdgeForm({ nodes, onAddEdge }: AddEdgeFormProps) {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target) {
      alert('人物を両方選択してください。');
      return;
    }
    onAddEdge(source, target, label);
    setSource('');
    setTarget('');
    setLabel('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        新しい関係を追加
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <InputLabel id="source-select-label">From</InputLabel>
        <Select
          labelId="source-select-label"
          value={source}
          label="From"
          onChange={(e) => setSource(e.target.value)}
          required
        >
          {nodes.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.data.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <InputLabel id="target-select-label">To</InputLabel>
        <Select
          labelId="target-select-label"
          value={target}
          label="To"
          onChange={(e) => setTarget(e.target.value)}
          required
        >
          {nodes.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.data.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="関係 (例: 師匠, ライバル)"
        variant="outlined"
        size="small"
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth>
        追加
      </Button>
    </Box>
  );
}
