"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
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
  SelectionChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import initialNodes from '@/data/nodes.json';
import initialEdges from '@/data/edges.json';
import AddNodeForm from './AddNodeForm';
import CustomNode from './CustomNode';
import GroupNode from './GroupNode';
import NodeDetail from './NodeDetail';
import AddEdgeForm from './AddEdgeForm';
import DownloadButton from './DownloadButton';
import UploadButton from './UploadButton';
import CustomEdge from './CustomEdge';

const defaultEdgeOptions = {
  // Default options are now handled by CustomEdge
};

function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>(() => {
    if (typeof window !== 'undefined') {
      const savedNodes = localStorage.getItem('flow-nodes');
      return savedNodes ? JSON.parse(savedNodes) : initialNodes;
    }
    return initialNodes;
  });
  const [edges, setEdges] = useState<Edge[]>(() => {
    if (typeof window !== 'undefined') {
      const savedEdges = localStorage.getItem('flow-edges');
      return savedEdges ? JSON.parse(savedEdges) : initialEdges;
    }
    return initialEdges;
  });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flow-nodes', JSON.stringify(nodes));
    }
  }, [nodes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flow-edges', JSON.stringify(edges));
    }
  }, [edges]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode, group: GroupNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  const updatedNodes = useMemo(() => {
    const edgeCounts = edges.reduce((acc, edge) => {
      acc[edge.source] = (acc[edge.source] || 0) + 1;
      acc[edge.target] = (acc[edge.target] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        edgeCount: edgeCounts[node.id] || 0,
      },
    }));
  }, [nodes, edges]);

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

  const onSelectionChange = useCallback((changes: SelectionChanges) => {
    setSelectedNodes(changes.nodes.map(n => n.id));
    setSelectedEdges(changes.edges.map(e => e.id));
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleSaveNode = useCallback((updatedData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode?.id
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
    setSelectedNode((prev) =>
      prev ? { ...prev, data: { ...prev.data, ...updatedData } } : null
    );
  }, [selectedNode, setNodes]);

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

  const addNewEdge = useCallback((source: string, target: string, relationType: string) => {
    const newEdge = {
      id: `edge-${source}-${target}-${Date.now()}`,
      source,
      target,
      label: relationType,
      type: 'custom',
      data: { relationType },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !selectedNodes.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !selectedEdges.includes(e.id)));
    setSelectedNodes([]);
    setSelectedEdges([]);
    setSelectedNode(null); 
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  const groupSelectedNodes = useCallback(() => {
    const selectedNodeObjects = nodes.filter(n => selectedNodes.includes(n.id) && !n.parentNode);
    if (selectedNodeObjects.length < 2) return;

    // 1. Calculate bounding box of selected nodes
    const padding = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedNodeObjects.forEach(node => {
      // Fallback for width/height, though React Flow should provide them
      const nodeWidth = node.width || 150;
      const nodeHeight = node.height || 50;

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });

    const groupNodePosition = { x: minX - padding, y: minY - padding };
    const groupNodeWidth = maxX - minX + padding * 2;
    const groupNodeHeight = maxY - minY + padding * 2;

    // 2. Create the new group node
    const groupNodeId = `group-${Date.now()}`;
    const groupNode: Node = {
      id: groupNodeId,
      type: 'group',
      position: groupNodePosition,
      data: { label: '新しいグループ' },
      style: {
        width: groupNodeWidth,
        height: groupNodeHeight,
        zIndex: -1,
      },
    };

    // 3. Update nodes: add the group and update children
    setNodes(nds => {
      const otherNodes = nds.filter(n => !selectedNodes.includes(n.id));
      const updatedChildNodes = nds.filter(n => selectedNodes.includes(n.id)).map(node => {
        return {
          ...node,
          parentNode: groupNodeId,
          extent: 'parent' as const,
          position: {
            x: node.position.x - groupNodePosition.x,
            y: node.position.y - groupNodePosition.y,
          },
        };
      });
      return [...otherNodes, ...updatedChildNodes, groupNode];
    });

    // 4. Clear selection
    setSelectedNodes([]);
    setSelectedEdges([]);
    setSelectedNode(null);
  }, [nodes, selectedNodes, setNodes]);

  const clearAll = useCallback(() => {
    if (window.confirm('すべてのノードとエッジを削除しますか？')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Box sx={{ 
        flex: '1 1 0%', 
        height: '100%',
        bgcolor: 'background.default'
      }}>
        <ReactFlow
          nodes={updatedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onSelectionChange={onSelectionChange}
          fitView
          defaultEdgeOptions={defaultEdgeOptions}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          {/* Removed custom markers */}
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
          <NodeDetail node={selectedNode} onSave={handleSaveNode} />
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>編集</Typography>
          <Stack spacing={1}>
            <Button 
              variant="outlined" 
              onClick={groupSelectedNodes}
              disabled={selectedNodes.length < 2}
            >
              選択項目をグループ化
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={deleteSelectedElements}
              disabled={selectedNodes.length === 0 && selectedEdges.length === 0}
            >
              選択項目を削除
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={clearAll}
              disabled={nodes.length === 0 && edges.length === 0}
            >
              すべてクリア
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FlowChart;
