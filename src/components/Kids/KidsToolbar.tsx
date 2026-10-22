'use client';

import React from 'react';
import { Sparkles, Eraser, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface KidsToolbarProps {
  tool: 'crayon' | 'rainbow' | 'eraser';
  setTool: (tool: 'crayon' | 'rainbow' | 'eraser') => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClear: () => void;
  onSubmit: () => void;
  strokeCount: number;
}

const BRIGHT_COLORS = [
  { name: 'Cherry Red', hex: '#ef4444' },
  { name: 'Sky Blue', hex: '#3b82f6' },
  { name: 'Grass Green', hex: '#10b981' },
  { name: 'Sunshine Yellow', hex: '#f59e0b' },
  { name: 'Magic Purple', hex: '#8b5cf6' },
  { name: 'Bubblegum Pink', hex: '#ec4899' },
  { name: 'Ink Black', hex: '#1e293b' },
];

export const KidsToolbar: React.FC<KidsToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  onClear,
  onSubmit,
  strokeCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-2 border-amber-200 rounded-3xl shadow-md">
      {/* Tool Selection (Big touch targets) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTool('crayon')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all transform active:scale-95 ${
            tool === 'crayon'
              ? 'bg-amber-400 text-amber-950 shadow-md scale-105 ring-2 ring-amber-500'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="text-base">🖍️</span>
          <span>Crayon</span>
        </button>

        <button
          onClick={() => setTool('rainbow')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all transform active:scale-95 ${
            tool === 'rainbow'
              ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500 text-white shadow-md scale-105 ring-2 ring-indigo-400'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Rainbow Magic</span>
        </button>

        <button
          onClick={() => setTool('eraser')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all transform active:scale-95 ${
            tool === 'eraser'
              ? 'bg-rose-400 text-white shadow-md scale-105 ring-2 ring-rose-500'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Eraser className="w-4 h-4" />
          <span>Sponge</span>
        </button>
      </div>

      {/* Color Palette (Large bubbles) */}
      {tool !== 'eraser' && tool !== 'rainbow' && (
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {BRIGHT_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              title={c.name}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-3 transition-transform ${
                color === c.hex
                  ? 'scale-115 border-white ring-2 ring-amber-500 shadow-sm'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}

      {/* Thickness & Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setBrushSize(10)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              brushSize === 10 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            Chunky
          </button>
          <button
            onClick={() => setBrushSize(20)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              brushSize === 20 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            Super
          </button>
        </div>

        <button
          onClick={onClear}
          title="Clear everything"
          className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-90"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Done / Check button */}
        <button
          onClick={onSubmit}
          disabled={strokeCount === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg transition-all transform active:scale-95 ${
            strokeCount === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 scale-105 animate-bounce'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>I Did It! ⭐</span>
        </button>
      </div>
    </div>
  );
};
