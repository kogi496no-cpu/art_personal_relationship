"use client";

import { useState } from 'react';

interface AddNodeFormProps {
  onAddNode: (label: string, era: string) => void;
}

export default function AddNodeForm({ onAddNode }: AddNodeFormProps) {
  const [label, setLabel] = useState('');
  const [era, setEra] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label) {
      alert('人物名を入力してください。');
      return;
    }
    onAddNode(label, era);
    setLabel('');
    setEra('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <h4>新しい人物を追加</h4>
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="label" style={{ display: 'block', marginBottom: '4px' }}>人物名:</label>
        <input
          type="text"
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ width: '100%', padding: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label htmlFor="era" style={{ display: 'block', marginBottom: '4px' }}>時代:</label>
        <input
          type="text"
          id="era"
          value={era}
          onChange={(e) => setEra(e.target.value)}
          style={{ width: '100%', padding: '4px' }}
        />
      </div>
      <button type="submit" style={{ width: '100%', padding: '8px' }}>追加</button>
    </form>
  );
}
