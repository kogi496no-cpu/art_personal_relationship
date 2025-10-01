'use client';

import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, MarkerType } from 'reactflow'; // Added MarkerType
import { useTheme } from '@mui/material/styles';
import { RELATION_TYPES } from './AddEdgeForm'; 

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) {
  const theme = useTheme();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  let strokeColor = theme.palette.text.secondary; // Default color
  let finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
  let finalMarkerStart = undefined;
  let strokeWidth = 2; // Default thickness

  if (data?.relationType) {
    switch (data.relationType) {
      case 'rival':
        strokeColor = theme.palette.error.main; // Red
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = { type: MarkerType.ArrowClosed, color: strokeColor }; // Both ends
        strokeWidth = 3;
        break;
      case 'master_apprentice':
        strokeColor = theme.palette.success.main; // Green
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = undefined; // Only end
        strokeWidth = 2;
        break;
      case 'inheritance':
        strokeColor = theme.palette.info.main; // Blue
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = undefined;
        strokeWidth = 2;
        break;
      case 'patron':
        strokeColor = theme.palette.warning.main; // Yellow
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = undefined;
        strokeWidth = 2;
        break;
      case 'friend':
        strokeColor = theme.palette.primary.main; // Purple or another distinct color
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = { type: MarkerType.ArrowClosed, color: strokeColor }; // Bidirectional
        strokeWidth = 2;
        break;
      case 'influence':
        strokeColor = theme.palette.secondary.main; // A different color
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = undefined;
        strokeWidth = 2;
        break;
      default:
        // For 'other' or custom labels, use default color but ensure marker is set
        strokeColor = theme.palette.text.secondary;
        finalMarkerEnd = { type: MarkerType.ArrowClosed, color: strokeColor };
        finalMarkerStart = undefined;
        strokeWidth = 2;
        break;
    }
  }

  // Get the Japanese label for the relationType
  const displayLabel = RELATION_TYPES.find(type => type.value === data?.relationType)?.label || data?.relationType || '関係';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={finalMarkerEnd} 
        markerStart={finalMarkerStart}
        style={{ ...style, stroke: strokeColor, strokeWidth: strokeWidth }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: theme.palette.background.paper,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: 12,
            fontWeight: 'bold',
            pointerEvents: 'all', // Allows interaction with the label
            color: theme.palette.text.primary,
            border: `1px solid ${strokeColor}`,
          }}
          className="nodrag nopan"
        >
          {displayLabel}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
