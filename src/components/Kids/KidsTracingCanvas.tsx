'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import getStroke from 'perfect-freehand';
import { kidsAudio } from '@/lib/kids-audio';

interface KidsPoint {
  x: number;
  y: number;
  pressure?: number;
  color?: string;
}

interface KidsStroke {
  points: KidsPoint[];
  color: string;
  size: number;
  isRainbow: boolean;
  tool: 'crayon' | 'rainbow' | 'eraser';
}

export interface KidsCanvasHandle {
  clear: () => void;
  getStrokes: () => KidsStroke[];
}

interface KidsTracingCanvasProps {
  character: string;
  subCharacter?: string;
  tool: 'crayon' | 'rainbow' | 'eraser';
  color: string;
  brushSize: number;
  onStrokeChange?: (count: number) => void;
  strokeHints?: string[];
  guides?: Array<{
    type: 'line' | 'curve';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    order: number;
  }>;
}

export const KidsTracingCanvas = forwardRef<KidsCanvasHandle, KidsTracingCanvasProps>(
  (
    {
      character,
      subCharacter,
      tool,
      color,
      brushSize,
      onStrokeChange,
      strokeHints,
      guides,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [dimensions, setDimensions] = useState({ width: 600, height: 480 });
    const [strokes, setStrokes] = useState<KidsStroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<KidsStroke | null>(null);
    const isDrawing = useRef(false);
    const rainbowHue = useRef(0);

    // Notify parent on stroke count change
    useEffect(() => {
      onStrokeChange?.(strokes.length);
    }, [strokes, onStrokeChange]);

    // Handle container resize
    useEffect(() => {
      const updateSize = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(300, Math.floor(rect.width));
        const height = Math.max(360, Math.floor(rect.height || 480));
        setDimensions({ width, height });
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Draw single stroke using perfect-freehand
    const drawStroke = (ctx: CanvasRenderingContext2D, stroke: KidsStroke) => {
      if (stroke.points.length < 2) return;

      const rawPoints = stroke.points.map((p) => [p.x, p.y, p.pressure ?? 0.5]);
      const outlinePoints = getStroke(rawPoints, {
        size: stroke.size,
        thinning: 0.2,
        smoothing: 0.6,
        streamline: 0.5,
      });

      if (outlinePoints.length === 0) return;

      ctx.save();
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#ffffff';
      } else if (stroke.isRainbow) {
        // Rainbow dynamic gradient along the stroke
        const first = stroke.points[0];
        const last = stroke.points[stroke.points.length - 1];
        const grad = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.3, '#f59e0b');
        grad.addColorStop(0.6, '#10b981');
        grad.addColorStop(0.8, '#3b82f6');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = stroke.color;
      }

      const path = outlinePoints.reduce(
        (acc, [x0, y0], i, arr) => {
          const [x1, y1] = arr[(i + 1) % arr.length];
          acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
          return acc;
        },
        ['M', ...outlinePoints[0], 'Q']
      );
      path.push('Z');

      const path2d = new Path2D(path.join(' '));
      ctx.fill(path2d);
      ctx.restore();
    };

    // Redraw canvas
    const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr);

      // Clean background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Render strokes
      const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
      for (const stroke of allStrokes) {
        drawStroke(ctx, stroke);
      }
    }, [dimensions, strokes, currentStroke]);

    useEffect(() => {
      redraw();
    }, [redraw]);

    // Pointer events with audio feedback
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawing.current = true;

      kidsAudio.playPop();

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.6;

      const newStroke: KidsStroke = {
        points: [{ x, y, pressure }],
        color,
        size: brushSize,
        isRainbow: tool === 'rainbow',
        tool,
      };

      setCurrentStroke(newStroke);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !currentStroke) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.6;

      rainbowHue.current = (rainbowHue.current + 4) % 360;

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

      if (currentStroke && currentStroke.points.length > 1) {
        kidsAudio.playChime();
        setStrokes((prev) => [...prev, currentStroke]);
        setCurrentStroke(null);
      }
    };

    // Imperative handle
    useImperativeHandle(ref, () => ({
      clear: () => {
        setStrokes([]);
        setCurrentStroke(null);
      },
      getStrokes: () => strokes,
    }));

    return (
      <div
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[500px] bg-white rounded-3xl border-4 border-amber-200 overflow-hidden shadow-lg select-none cursor-crosshair touch-none"
      >
        {/* Background Dotted Guideline Mask for Tracing */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="text-center">
            <span
              className="font-black text-slate-200 block tracking-wider leading-none select-none"
              style={{
                fontSize: `${Math.min(dimensions.width * 0.55, 280)}px`,
                textShadow: '0 0 2px #cbd5e1',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.02))',
              }}
            >
              {character}
            </span>
            {subCharacter && (
              <span className="text-4xl sm:text-5xl font-black text-slate-200 mt-2 block">
                {subCharacter}
              </span>
            )}
          </div>
        </div>

        {/* Tracing Stroke Starting Numbers (1, 2, 3) */}
        {guides && guides.length > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none select-none"
            width={dimensions.width}
            height={dimensions.height}
          >
            {guides.map((g, idx) => {
              // Scale guides to canvas size
              const scaleX = dimensions.width / 400;
              const scaleY = dimensions.height / 400;
              const cx = g.x1 * scaleX;
              const cy = g.y1 * scaleY;

              return (
                <g key={idx}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    className="fill-amber-400 stroke-amber-600 stroke-2 animate-pulse"
                  />
                  <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    className="text-xs font-black fill-slate-900 select-none"
                  >
                    {g.order}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* User Drawing Canvas */}
        <canvas
          ref={canvasRef}
          style={{ width: dimensions.width, height: dimensions.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 block touch-none"
        />
      </div>
    );
  }
);

KidsTracingCanvas.displayName = 'KidsTracingCanvas';
