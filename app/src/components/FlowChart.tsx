"use client";

import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import initialNodes from '@/data/nodes.json';
import initialEdges from '@/data/edges.json';
import AddNodeForm from './AddNodeForm';

const defaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed },
};

function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = useCallback((label: string, era: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom', // or default
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label, era },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div style={{ flex: '1 1 0%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <aside style={{ width: '250px', padding: '16px', borderLeft: '1px solid #ccc', background: '#f7f7f7' }}>
        <h2>操作パネル</h2>
        <AddNodeForm onAddNode={addNode} />
      </aside>
    </div>
  );
}

export default FlowChart;