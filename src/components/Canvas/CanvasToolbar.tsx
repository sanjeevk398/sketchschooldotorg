'use client';

import React from 'react';
import {
  Pen,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Eye,
  EyeOff,
  Grid,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface CanvasToolbarProps {
  tool: 'pen' | 'pencil' | 'eraser';
  setTool: (tool: 'pen' | 'pencil' | 'eraser') => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  showGuides: boolean;
  setShowGuides: (show: boolean) => void;
  gridType: 'none' | 'dots' | 'grid';
  setGridType: (type: 'none' | 'dots' | 'grid') => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  strokeCount: number;
}

const COLORS = [
  { name: 'Ink Black', value: '#0f172a' },
  { name: 'Cobalt Blue', value: '#2563eb' },
  { name: 'Graphite', value: '#64748b' },
  { name: 'Accent Red', value: '#ef4444' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 3 },
  { label: 'Medium', size: 6 },
  { label: 'Broad', size: 12 },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  showGuides,
  setShowGuides,
  gridType,
  setGridType,
  onSubmit,
  isEvaluating,
  strokeCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Tool Selection */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setTool('pen')}
          title="Pen (Inking)"
          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
            tool === 'pen'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pen className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Pen</span>
        </button>

        <button
          onClick={() => setTool('pencil')}
          title="Pencil (Soft Sketching)"
          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
            tool === 'pencil'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pencil className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Pencil</span>
        </button>

        <button
          onClick={() => setTool('eraser')}
          title="Eraser"
          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
            tool === 'eraser'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eraser className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Eraser</span>
        </button>
      </div>

      {/* Colors & Brush Size */}
      <div className="flex items-center gap-3">
        {tool !== 'eraser' && (
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c.value ? 'scale-110 border-orange-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Brush Size Presets */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.size}
              onClick={() => setBrushSize(b.size)}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                brushSize === b.size
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions (Undo, Redo, Clear, Overlays) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-35 transition-all"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-35 transition-all"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClear}
          title="Clear canvas"
          className="p-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* Ghost guides toggle */}
        <button
          onClick={() => setShowGuides(!showGuides)}
          title={showGuides ? 'Hide Guides' : 'Show Guides'}
          className={`p-2 rounded-lg transition-all ${
            showGuides ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          {showGuides ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Grid mode toggle */}
        <button
          onClick={() => {
            const next = gridType === 'none' ? 'dots' : gridType === 'dots' ? 'grid' : 'none';
            setGridType(next);
          }}
          title={`Grid: ${gridType}`}
          className={`p-2 rounded-lg transition-all ${
            gridType !== 'none' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Submit / Grade button */}
      <div>
        <button
          onClick={onSubmit}
          disabled={isEvaluating || strokeCount === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            strokeCount === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-orange-500 hover:bg-orange-600 active:scale-98 text-white shadow-orange-500/25'
          }`}
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Check My Sketch</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
