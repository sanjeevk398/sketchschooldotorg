'use client';

import React from 'react';
import { Sparkles, Eraser, RotateCcw, CheckCircle2 } from 'lucide-react';
import { kidsAudio } from '@/lib/kids-audio';

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
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#1e293b' },
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
  const handleToolSelect = (newTool: 'crayon' | 'rainbow' | 'eraser') => {
    kidsAudio.playPop();
    setTool(newTool);
  };

  const handleColorSelect = (hex: string) => {
    kidsAudio.playPop();
    setColor(hex);
  };

  const handleClearClick = () => {
    kidsAudio.playPop();
    onClear();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-4 border-amber-300 rounded-[2rem] shadow-xl">
      {/* Tool Selection (Chunky, oversized buttons with 3D press feel) */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => handleToolSelect('crayon')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm sm:text-base transition-all transform active:scale-95 ${
            tool === 'crayon'
              ? 'btn-3d-amber text-amber-950 scale-105 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span className="text-xl">🖍️</span>
          <span>Crayon</span>
        </button>

        <button
          onClick={() => handleToolSelect('rainbow')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm sm:text-base transition-all transform active:scale-95 ${
            tool === 'rainbow'
              ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500 text-white shadow-lg border-b-4 border-indigo-700 scale-105'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span>Rainbow Magic</span>
        </button>

        <button
          onClick={() => handleToolSelect('eraser')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm sm:text-base transition-all transform active:scale-95 ${
            tool === 'eraser'
              ? 'btn-3d-rose text-white scale-105 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span className="text-xl">🧽</span>
          <span>Sponge</span>
        </button>
      </div>

      {/* Large Colorful Blobs */}
      {tool !== 'eraser' && tool !== 'rainbow' && (
        <div className="flex items-center gap-2.5 bg-amber-50 p-2 rounded-2xl border-2 border-amber-200">
          {BRIGHT_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => handleColorSelect(c.hex)}
              title={c.name}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-4 transition-transform shadow-xs ${
                color === c.hex
                  ? 'scale-125 border-white ring-4 ring-amber-400 shadow-md animate-bounce'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}

      {/* Thickness & Clear & Done Button */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              kidsAudio.playPop();
              setBrushSize(12);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
              brushSize === 12
                ? 'bg-white shadow-sm text-slate-900 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Chunky
          </button>
          <button
            onClick={() => {
              kidsAudio.playPop();
              setBrushSize(22);
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
              brushSize === 22
                ? 'bg-white shadow-sm text-slate-900 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Super Chunky!
          </button>
        </div>

        <button
          onClick={handleClearClick}
          title="Clear everything"
          className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border-2 border-rose-200 transition-all active:scale-90"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Big Done Button */}
        <button
          onClick={onSubmit}
          disabled={strokeCount === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all transform active:scale-95 ${
            strokeCount === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'btn-3d-emerald text-white animate-bounce'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>I Did It! ⭐</span>
        </button>
      </div>
    </div>
  );
};
