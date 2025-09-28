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

export const RELATION_TYPES = [
  { value: 'rival', label: 'ライバル' },
  { value: 'master_apprentice', label: '師匠と弟子' },
  { value: 'inheritance', label: '継承' },
  { value: 'patron', label: 'パトロン' },
  { value: 'other', label: 'その他' }, // Fallback for custom labels
];

interface AddEdgeFormProps {
  nodes: Node[];
  onAddEdge: (source: string, target: string, relationType: string) => void; 
}

export default function AddEdgeForm({ nodes, onAddEdge }: AddEdgeFormProps) {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [relationType, setRelationType] = useState(''); 
  const [customLabel, setCustomLabel] = useState(''); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target || !relationType) {
      alert('人物と関係の種類をすべて選択してください。');
      return;
    }
    
    const finalRelationType = relationType === 'other' ? customLabel : relationType;
    if (relationType === 'other' && !customLabel) {
      alert('その他の関係のラベルを入力してください。');
      return;
    }

    onAddEdge(source, target, finalRelationType);
    setSource('');
    setTarget('');
    setRelationType('');
    setCustomLabel('');
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
      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <InputLabel id="relation-type-select-label">関係の種類</InputLabel>
        <Select
          labelId="relation-type-select-label"
          value={relationType}
          label="関係の種類"
          onChange={(e) => setRelationType(e.target.value)}
          required
        >
          {RELATION_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {relationType === 'other' && (
        <TextField
          label="その他の関係ラベル"
          variant="outlined"
          size="small"
          fullWidth
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
      )}
      <Button type="submit" variant="contained" fullWidth>
        追加
      </Button>
    </Box>
  );
}