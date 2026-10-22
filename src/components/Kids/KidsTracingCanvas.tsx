'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import getStroke from 'perfect-freehand';
import { kidsAudio } from '@/lib/kids-audio';
import {
  extractGlyphTargetPoints,
  calculateMatchPercentage,
  TargetPoint,
} from '@/lib/kids-match';

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

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  opacity: number;
}

export interface KidsCanvasHandle {
  clear: () => void;
  getStrokes: () => KidsStroke[];
  getMatchPercentage: () => number;
}

interface KidsTracingCanvasProps {
  character: string;
  subCharacter?: string;
  tool: 'crayon' | 'rainbow' | 'eraser';
  color: string;
  brushSize: number;
  onStrokeChange?: (count: number) => void;
  onMatchChange?: (percentage: number) => void;
  onFiftyPercentReached?: () => void;
  guides?: Array<{
    type: 'line' | 'curve';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    order: number;
  }>;
}

const SPARKLE_EMOJIS = ['✨', '⭐', '🎈', '💖', '🌟', '🌈'];

export const KidsTracingCanvas = forwardRef<KidsCanvasHandle, KidsTracingCanvasProps>(
  (
    {
      character,
      subCharacter,
      tool,
      color,
      brushSize,
      onStrokeChange,
      onMatchChange,
      onFiftyPercentReached,
      guides,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [dimensions, setDimensions] = useState({ width: 600, height: 480 });
    const [strokes, setStrokes] = useState<KidsStroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<KidsStroke | null>(null);
    const [targetPoints, setTargetPoints] = useState<TargetPoint[]>([]);
    const [matchPercentage, setMatchPercentage] = useState(0);
    const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);

    const isDrawing = useRef(false);
    const rainbowHue = useRef(0);
    const hasTriggeredFifty = useRef(false);

    // Update dimensions on mount & resize
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

    // Extract target points whenever character or dimensions change
    useEffect(() => {
      if (dimensions.width > 0 && dimensions.height > 0) {
        const pts = extractGlyphTargetPoints(
          character,
          dimensions.width,
          dimensions.height,
          subCharacter
        );
        setTargetPoints(pts);
        hasTriggeredFifty.current = false;
        setMatchPercentage(0);
        onMatchChange?.(0);
      }
    }, [character, subCharacter, dimensions, onMatchChange]);

    // Update stroke count to parent
    useEffect(() => {
      onStrokeChange?.(strokes.length);
    }, [strokes, onStrokeChange]);

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
        const first = stroke.points[0];
        const last = stroke.points[stroke.points.length - 1];
        const grad = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.25, '#f59e0b');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(0.75, '#3b82f6');
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

      // Clean white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Render all completed strokes + active stroke
      const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
      for (const stroke of allStrokes) {
        drawStroke(ctx, stroke);
      }
    }, [dimensions, strokes, currentStroke]);

    useEffect(() => {
      redraw();
    }, [redraw]);

    // Match calculation helper
    const updateMatchScore = useCallback(
      (allStrokes: KidsStroke[]) => {
        if (targetPoints.length === 0) return;

        // Flatten all stroke points
        const allPoints: Array<{ x: number; y: number }> = [];
        for (const s of allStrokes) {
          if (s.tool !== 'eraser') {
            for (const pt of s.points) {
              allPoints.push({ x: pt.x, y: pt.y });
            }
          }
        }

        const result = calculateMatchPercentage(targetPoints, allPoints, 32);
        setMatchPercentage(result.percentage);
        onMatchChange?.(result.percentage);

        // Check if passed 50% threshold for the first time
        if (result.percentage >= 50 && !hasTriggeredFifty.current) {
          hasTriggeredFifty.current = true;
          kidsAudio.playFiftyPercentMatchSound();
          onFiftyPercentReached?.();
        }
      },
      [targetPoints, onMatchChange, onFiftyPercentReached]
    );

    // Pointer events with audio feedback and particle spawning
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

      // Spawn touch sparkle particle occasionally
      if (Math.random() < 0.25) {
        const randomEmoji =
          SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
        const newParticle: SparkleParticle = {
          id: Date.now() + Math.random(),
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 20 - 10),
          emoji: randomEmoji,
          opacity: 1,
        };
        setSparkles((prev) => [...prev.slice(-12), newParticle]);
      }

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
        const nextStrokes = [...strokes, currentStroke];
        setStrokes(nextStrokes);
        setCurrentStroke(null);
        updateMatchScore(nextStrokes);
      }
    };

    // Fade and clean up particles
    useEffect(() => {
      if (sparkles.length === 0) return;
      const timer = setTimeout(() => {
        setSparkles((prev) =>
          prev
            .map((p) => ({ ...p, opacity: p.opacity - 0.25, y: p.y - 4 }))
            .filter((p) => p.opacity > 0)
        );
      }, 50);
      return () => clearTimeout(timer);
    }, [sparkles]);

    // Imperative handle
    useImperativeHandle(ref, () => ({
      clear: () => {
        setStrokes([]);
        setCurrentStroke(null);
        hasTriggeredFifty.current = false;
        setMatchPercentage(0);
        onMatchChange?.(0);
      },
      getStrokes: () => strokes,
      getMatchPercentage: () => matchPercentage,
    }));

    return (
      <div
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[500px] bg-white rounded-3xl border-4 border-amber-200 overflow-hidden shadow-lg select-none cursor-crosshair touch-none"
      >
        {/* Background Dotted Guideline Mask */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="text-center">
            <span
              className="font-black text-slate-200 block tracking-wider leading-none select-none transition-colors"
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

        {/* Dynamic Target Dots along the Letter Contour */}
        <svg
          className="absolute inset-0 pointer-events-none select-none"
          width={dimensions.width}
          height={dimensions.height}
        >
          {targetPoints.map((tp, idx) => (
            <circle
              key={idx}
              cx={tp.x}
              cy={tp.y}
              r={3}
              className="fill-slate-300/60"
            />
          ))}

          {/* Numbered stroke order starting badges (1, 2, 3) */}
          {guides &&
            guides.map((g, idx) => {
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

        {/* Floating Sparkle Particles */}
        {sparkles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none select-none text-xl transition-all duration-75"
            style={{
              left: p.x,
              top: p.y,
              opacity: p.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {p.emoji}
          </div>
        ))}

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
