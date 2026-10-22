'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Award, CheckCircle } from 'lucide-react';
import { kidsAudio } from '@/lib/kids-audio';

interface KidsStickerModalProps {
  isOpen: boolean;
  sticker: {
    name: string;
    emoji: string;
  };
  onRetry: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export const KidsStickerModal: React.FC<KidsStickerModalProps> = ({
  isOpen,
  sticker,
  onRetry,
  onNext,
  nextLabel = 'Next Letter 🚀',
}) => {
  useEffect(() => {
    if (isOpen) {
      kidsAudio.playFanfare();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden text-center transform scale-100">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 text-white">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className="w-8 h-8 fill-amber-200 text-amber-200 drop-shadow-md animate-bounce"
                style={{ animationDelay: `${s * 150}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-black tracking-tight">Super Duper! 🌟</h2>
          <p className="text-xs font-bold text-amber-100 mt-0.5">
            You completed the tracing!
          </p>
        </div>

        {/* Sticker Unlocked Card */}
        <div className="p-6 space-y-4">
          <div className="p-5 bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-3xl inline-block w-full">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 block mb-1">
              New Sticker Unlocked!
            </span>
            <div className="text-6xl my-2 animate-pulse">{sticker.emoji}</div>
            <div className="text-lg font-black text-slate-900">{sticker.name}</div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Saved into your Kids Sticker Album! 📘
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Draw Again</span>
            </button>

            <button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md shadow-amber-400/30 active:scale-95 transition-all"
            >
              <span>{nextLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
