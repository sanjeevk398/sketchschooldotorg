'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Stroke, Point, renderStrokesToCanvas } from '@/lib/canvas-utils';
import { GhostGuideOverlay } from './GhostGuideOverlay';
import { GuideLine } from '@/data/curriculum';

export interface DrawingCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getStrokes: () => Stroke[];
  getCleanCanvasPng: () => string;
}

interface DrawingCanvasProps {
  tool: 'pen' | 'pencil' | 'eraser';
  color: string;
  brushSize: number;
  guides: GuideLine[];
  showGuides: boolean;
  gridType: 'none' | 'dots' | 'grid';
  onStrokeChange?: (strokeCount: number) => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  (
    {
      tool,
      color,
      brushSize,
      guides,
      showGuides,
      gridType,
      onStrokeChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [dimensions, setDimensions] = useState({ width: 700, height: 500 });
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const isDrawing = useRef(false);

    // Keep parent updated on stroke count
    useEffect(() => {
      onStrokeChange?.(strokes.length);
    }, [strokes, onStrokeChange]);

    // Handle container resize
    useEffect(() => {
      const updateSize = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(320, Math.floor(rect.width));
        const height = Math.max(360, Math.floor(rect.height || 500));
        setDimensions({ width, height });
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Redraw canvas whenever strokes or dimensions change
    const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr);

      const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
      renderStrokesToCanvas(ctx, allStrokes, dimensions.width, dimensions.height);
    }, [dimensions, strokes, currentStroke]);

    useEffect(() => {
      redraw();
    }, [redraw]);

    // Pointer events with stylus pressure support
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawing.current = true;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;

      const newStroke: Stroke = {
        points: [{ x, y, pressure }],
        color: tool === 'eraser' ? '#ffffff' : color,
        size: brushSize,
        tool,
      };

      setCurrentStroke(newStroke);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !currentStroke) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;

      setCurrentStroke((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, { x, y, pressure }],
        };
      });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }

      if (currentStroke && currentStroke.points.length > 0) {
        setStrokes((prev) => [...prev, currentStroke]);
        setUndoStack([]); // Clear redo history on new action
        setCurrentStroke(null);
      }
    };

    // Imperative methods for Toolbar
    useImperativeHandle(ref, () => ({
      undo: () => {
        if (strokes.length === 0) return;
        const last = strokes[strokes.length - 1];
        setUndoStack((prev) => [...prev, [last]]);
        setStrokes((prev) => prev.slice(0, -1));
      },
      redo: () => {
        if (undoStack.length === 0) return;
        const lastRedoGroup = undoStack[undoStack.length - 1];
        setUndoStack((prev) => prev.slice(0, -1));
        setStrokes((prev) => [...prev, ...lastRedoGroup]);
      },
      clear: () => {
        if (strokes.length === 0) return;
        setUndoStack((prev) => [...prev, strokes]);
        setStrokes([]);
      },
      canUndo: strokes.length > 0,
      canRedo: undoStack.length > 0,
      getStrokes: () => strokes,
      getCleanCanvasPng: () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = dimensions.width;
        offCanvas.height = dimensions.height;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          renderStrokesToCanvas(offCtx, strokes, dimensions.width, dimensions.height);
          return offCanvas.toDataURL('image/png');
        }
        return '';
      },
    }));

    return (
      <div
        ref={containerRef}
        className="relative w-full h-[520px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm select-none cursor-crosshair touch-none"
      >
        <canvas
          ref={canvasRef}
          style={{ width: dimensions.width, height: dimensions.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 block touch-none"
        />

        {/* Ghost guides and grids overlay */}
        <GhostGuideOverlay
          guides={guides}
          width={dimensions.width}
          height={dimensions.height}
          showGuides={showGuides}
          gridType={gridType}
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
