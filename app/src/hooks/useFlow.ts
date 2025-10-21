"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnSelectionChangeParams,
} from 'reactflow';
import initialNodes from '@/data/nodes.json';
import initialEdges from '@/data/edges.json';

export function useFlow() {
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

  const onSelectionChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    setSelectedNodes(nodes.map(n => n.id));
    setSelectedEdges(edges.map(e => e.id));
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    if (!node.parentNode) {
      const targetGroup = nodes.find(n => 
        n.type === 'group' &&
        node.id !== n.id &&
        node.position.x >= n.position.x &&
        node.position.y >= n.position.y &&
        node.position.x + (node.width ?? 0) <= n.position.x + (n.width ?? 0) &&
        node.position.y + (node.height ?? 0) <= n.position.y + (n.height ?? 0)
      );

      if (targetGroup) {
        setNodes(nds => nds.map(n => {
          if (n.id === node.id) {
            return {
              ...n,
              parentNode: targetGroup.id,
              extent: 'parent' as const,
              position: {
                x: n.position.x - targetGroup.position.x,
                y: n.position.y - targetGroup.position.y,
              },
            };
          }
          return n;
        }));
      }
    }
  }, [nodes, setNodes]);

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

  const handleRemoveFromGroup = useCallback((nodeId: string) => {
    setNodes(nds => {
      const nodeToRemove = nds.find(n => n.id === nodeId);
      const parentGroup = nodeToRemove ? nds.find(n => n.id === nodeToRemove.parentNode) : undefined;

      if (!nodeToRemove || !parentGroup) return nds;

      return nds.map(n => {
        if (n.id === nodeId) {
          const { parentNode, extent, ...rest } = n;
          return {
            ...rest,
            position: {
              x: n.position.x + parentGroup.position.x,
              y: n.position.y + parentGroup.position.y,
            },
          };
        }
        return n;
      });
    });
  }, [setNodes]);

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

    const padding = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedNodeObjects.forEach(node => {
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

    const groupNodeId = `group-${Date.now()}`;
    const groupNode: Node = {
      id: groupNodeId,
      type: 'group',
      position: groupNodePosition,
      data: { label: '新しいグループ', description: '' },
      style: {
        width: groupNodeWidth,
        height: groupNodeHeight,
      },
      connectable: true, // グループノードを接続可能にする
    };

    setNodes(nds => {
      const updatedNodes = nds.map(n => {
        if (selectedNodes.includes(n.id)) {
          return {
            ...n,
            parentNode: groupNodeId,
            extent: 'parent' as const,
            position: {
              x: n.position.x - groupNodePosition.x,
              y: n.position.y - groupNodePosition.y,
            },
          };
        }
        return n;
      });
      return [...updatedNodes, groupNode];
    });

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



  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNode,
    selectedNodes,
    selectedEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    onNodeClick,
    onNodeDragStop,
    handleSaveNode,
    handleRemoveFromGroup,
    addNode,
    addNewEdge,
    deleteSelectedElements,
    groupSelectedNodes,
    clearAll,
  };
}
