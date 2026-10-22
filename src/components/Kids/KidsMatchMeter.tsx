'use client';

import React from 'react';
import { Star, Sparkles, Volume2 } from 'lucide-react';

interface KidsMatchMeterProps {
  percentage: number;
  hasPassedFifty: boolean;
  char: string;
  word: string;
  onSpeakAgain?: () => void;
}

export const KidsMatchMeter: React.FC<KidsMatchMeterProps> = ({
  percentage,
  hasPassedFifty,
  char,
  word,
  onSpeakAgain,
}) => {
  // Mascot comment based on match percentage
  let mascotText = 'Trace over the dotted lines to start! 🖍️';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';

  if (percentage >= 80) {
    mascotText = '🌟 Masterpiece! You can tap "I Did It!" now!';
    badgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-400';
  } else if (percentage >= 50) {
    mascotText = `🎉 Woohoo! More than 50% matched! It's ${char} for ${word}!`;
    badgeColor = 'bg-indigo-100 text-indigo-950 border-indigo-400';
  } else if (percentage >= 25) {
    mascotText = "🎈 You're halfway to 50%! Keep tracing!";
    badgeColor = 'bg-sky-100 text-sky-950 border-sky-300';
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border-3 border-amber-200 rounded-3xl p-3.5 sm:p-4 shadow-md space-y-3">
      {/* Top Header: Percentage & Mascot Tip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-sm font-black shadow-xs">
            ✨
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block -mb-0.5">
              Magic Match Meter
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>{percentage}% Matched</span>
              {hasPassedFifty && (
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  &gt; 50% Pass! 🔊
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Mascot Speech Bubble */}
        <div
          className={`px-3 py-1.5 rounded-2xl border text-xs font-bold text-center sm:text-right transition-all flex items-center gap-2 ${badgeColor}`}
        >
          <span>{mascotText}</span>
          {hasPassedFifty && onSpeakAgain && (
            <button
              onClick={onSpeakAgain}
              title="Hear speech again"
              className="p-1 rounded-full bg-white hover:bg-slate-100 shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          )}
        </div>
      </div>

      {/* The Animated Progress Track */}
      <div className="relative w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
        {/* Fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage >= 80
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
              : percentage >= 50
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500'
              : 'bg-gradient-to-r from-amber-300 to-amber-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(4, percentage))}%` }}
        />

        {/* 50% Flag Indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10"
          style={{ left: '50%' }}
        >
          <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600 shadow-xs" />
        </div>
      </div>

      {/* Star Milestones (25%, 50%, 80%) */}
      <div className="flex items-center justify-between text-[11px] font-black text-slate-500 px-1">
        <span className="flex items-center gap-1">
          <Star
            className={`w-3.5 h-3.5 ${
              percentage >= 25 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
          <span>25% Start</span>
        </span>

        <span className="flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          <Star
            className={`w-3.5 h-3.5 ${
              percentage >= 50 ? 'fill-indigo-500 text-indigo-500' : 'text-indigo-300'
            }`}
          />
          <span>50% Talks Aloud! 🔊</span>
        </span>

        <span className="flex items-center gap-1">
          <Star
            className={`w-3.5 h-3.5 ${
              percentage >= 80 ? 'fill-emerald-500 text-emerald-500' : 'text-slate-300'
            }`}
          />
          <span>80% Master</span>
        </span>
      </div>
    </div>
  );
};
