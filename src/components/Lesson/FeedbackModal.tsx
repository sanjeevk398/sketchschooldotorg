'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export interface CritiqueData {
  source?: string;
  score: number;
  stars: number;
  lineQuality?: string;
  proportions?: string;
  perspective?: string;
  mentorTip: string;
  encouragement: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  critique: CritiqueData | null;
  xpEarned: number;
  onRetry: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  critique,
  xpEarned,
  onRetry,
  onNext,
  hasNext,
}) => {
  useEffect(() => {
    if (isOpen && critique && critique.stars >= 2) {
      confetti({
        particleCount: critique.stars === 3 ? 80 : 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff5c35', '#f59e0b', '#10b981', '#3b82f6'],
      });
    }
  }, [isOpen, critique]);

  if (!isOpen || !critique) return null;

  const isSuccess = critique.stars >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100">
        {/* Header Ribbon */}
        <div
          className={`p-6 text-center text-white ${
            critique.stars === 3
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : critique.stars === 2
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : 'bg-gradient-to-r from-slate-700 to-slate-800'
          }`}
        >
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-9 h-9 transition-transform duration-300 ${
                  starIndex <= critique.stars
                    ? 'fill-amber-300 text-amber-300 drop-shadow-md scale-110'
                    : 'text-white/30 fill-transparent'
                }`}
              />
            ))}
          </div>

          <h2 className="text-2xl font-black tracking-tight">{critique.encouragement}</h2>

          <div className="flex items-center justify-center gap-3 mt-2 text-xs font-semibold">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              Score: {critique.score}%
            </span>
            <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" /> +{xpEarned} XP
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Mentor Feedback Card */}
          <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>Teacher Critique</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              &ldquo;{critique.mentorTip}&rdquo;
            </p>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {critique.lineQuality && (
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block font-medium">Line Quality</span>
                <span className="text-slate-800 font-semibold">{critique.lineQuality}</span>
              </div>
            )}
            {critique.proportions && (
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-slate-400 block font-medium">Form & Proportion</span>
                <span className="text-slate-800 font-semibold">{critique.proportions}</span>
              </div>
            )}
          </div>

          {/* Evaluation Engine Attribution */}
          <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-slate-500">
              {critique.source === 'gemini-vision' ? 'Gemini Vision AI' : 'Geometric Stroke Engine'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            {hasNext ? (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Back to Path</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
