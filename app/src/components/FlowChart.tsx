"use client";

import { useState, useCallback, useMemo } from 'react';
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
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import initialNodes from '@/data/nodes.json';
import initialEdges from '@/data/edges.json';
import AddNodeForm from './AddNodeForm';
import CustomNode from './CustomNode';
import NodeDetail from './NodeDetail';
import AddEdgeForm from './AddEdgeForm';
import DownloadButton from './DownloadButton';
import UploadButton from './UploadButton';

const defaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed },
};

function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

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

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = useCallback((data: { label: string; era: string; description: string; masterpieces: string }) => {
    const { label, era, description, masterpieces } = data;
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label,
        era,
        description,
        masterpieces: masterpieces ? masterpieces.split(',').map(s => s.trim()) : [],
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const addNewEdge = useCallback((source: string, target: string, label: string) => {
    const newEdge = {
      id: `edge-${source}-${target}-${Date.now()}`,
      source,
      target,
      label,
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Box sx={{ 
        flex: '1 1 0%', 
        height: '100%',
        bgcolor: 'background.default'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Controls />
          <Background variant={BackgroundVariant.Lines} gap={24} color="#ccc" />
        </ReactFlow>
      </Box>
      <Card 
        variant="outlined"
        sx={{
          width: '320px',
          margin: 2,
          position: 'absolute',
          right: 0,
          top: 16,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            操作パネル
          </Typography>
          <Divider sx={{ my: 2 }} />
          <NodeDetail node={selectedNode} />
          <Divider sx={{ my: 2 }} />
          <AddNodeForm onAddNode={addNode} />
          <Divider sx={{ my: 2 }} />
          <AddEdgeForm nodes={nodes} onAddEdge={addNewEdge} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>データ読み込み</Typography>
          <UploadButton onUploadNodes={setNodes} onUploadEdges={setEdges} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>データ保存</Typography>
          <DownloadButton nodes={nodes} edges={edges} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default FlowChart;
