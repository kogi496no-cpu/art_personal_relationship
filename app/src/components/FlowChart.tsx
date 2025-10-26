import { useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useFlow } from '@/hooks/useFlow';
import AddNodeForm from './AddNodeForm';
import CustomNode from './CustomNode';
import GroupNode from './GroupNode';
import NodeDetail from './NodeDetail';
import AddEdgeForm from './AddEdgeForm';
import DownloadButton from './DownloadButton';
import UploadButton from './UploadButton'; // パスを修正
import CustomEdge from './CustomEdge';

const defaultEdgeOptions = {
  // Default options are now handled by CustomEdge
};

// nodeTypesとedgeTypesをコンポーネントの外で定義
const nodeTypes = { custom: CustomNode, group: GroupNode };
const edgeTypes = { custom: CustomEdge };

function FlowChart() {
  const {
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
    onNodeClick, // useFlowからのonNodeClickを再度取得
    onNodeDragStop,
    handleSaveNode,
    handleRemoveFromGroup,
    addNode,
    addNewEdge,
    deleteSelectedElements,
    groupSelectedNodes,
    clearAll,
  } = useFlow();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // nodesのz-indexを調整
  const adjustedNodes = nodes.map(node => {
    if (node.type === 'custom') {
      return { ...node, zIndex: 100 }; // CustomNodeのz-indexを高くする
    }
    if (node.type === 'group') {
      return { ...node, zIndex: 10 }; // GroupNodeのz-indexを低くする
    }
    return node;
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Box sx={{ 
        flex: '1 1 0%', 
        height: '100%',
        bgcolor: 'background.default'
      }}>
        <ReactFlow
          nodes={adjustedNodes} // 調整済みのノードを渡す
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick} // 元のonNodeClickに戻す
          onNodeDragStop={onNodeDragStop}
          onSelectionChange={onSelectionChange}
          fitView
          defaultEdgeOptions={defaultEdgeOptions}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Controls />
          <Background variant={BackgroundVariant.Lines} gap={24} color="#ccc" />
        </ReactFlow>
      </Box>
      <Card 
        variant="outlined"
        sx={{
          width: isPanelOpen ? '320px' : '56px',
          minWidth: '56px',
          margin: 2,
          position: 'absolute',
          right: 0,
          top: 16,
          maxHeight: 'calc(100vh - 32px)',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.9)',
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <IconButton onClick={() => setIsPanelOpen(!isPanelOpen)} sx={{ mr: 1 }}>
            {isPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {isPanelOpen && (
            <Typography variant="h5" component="h2" noWrap>
              操作パネル
            </Typography>
          )}
        </Box>
        <Box sx={{ display: isPanelOpen ? 'block' : 'none', overflowY: 'auto', maxHeight: 'calc(100vh - 90px)' }}>
          <CardContent>
            <Divider sx={{ my: 2 }} />
            <NodeDetail node={selectedNode} nodes={nodes} onSave={handleSaveNode} onRemoveFromGroup={handleRemoveFromGroup} />
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
        </Box>
      </Card>
    </Box>
  );
}

export default FlowChart;

