'use client';

import React from 'react';
import { Star, Sparkles, Volume2 } from 'lucide-react';
import { kidsAudio } from '@/lib/kids-audio';

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
  // Mascot comment and reaction based on match percentage
  let mascotEmoji = '⭐';
  let mascotText = 'Trace over the lines to start! 🖍️';
  let badgeColor = 'bg-amber-100 text-amber-950 border-amber-300';

  if (percentage >= 80) {
    mascotEmoji = '🏆';
    mascotText = 'WOW! Super Drawing! Tap the Green Button! 🌟';
    badgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-400 ring-4 ring-emerald-300';
  } else if (percentage >= 50) {
    mascotEmoji = '🎉';
    mascotText = `You did it! More than 50%! It speaks "${char} for ${word}"!`;
    badgeColor = 'bg-indigo-100 text-indigo-950 border-indigo-400 ring-4 ring-indigo-300 animate-pulse';
  } else if (percentage >= 25) {
    mascotEmoji = '🎈';
    mascotText = "Halfway to 50%! Keep going!";
    badgeColor = 'bg-sky-100 text-sky-950 border-sky-300';
  }

  const handleSoundClick = () => {
    kidsAudio.playPop();
    onSpeakAgain?.();
  };

  return (
    <div
      className={`bg-white border-4 rounded-[2rem] p-4 sm:p-5 shadow-xl transition-all duration-300 ${
        hasPassedFifty
          ? 'border-indigo-400 ring-4 ring-indigo-200 bg-gradient-to-br from-white via-indigo-50/30 to-amber-50/40'
          : 'border-amber-300'
      }`}
    >
      {/* Top Header: Mascot & Giant Match Percentage */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Mascot Avatar & Big Percentage */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-3xl shadow-md animate-bounce select-none">
            {mascotEmoji}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Magic Tracing Meter</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{percentage}%</span>
              <span className="text-sm font-extrabold text-slate-400">matched</span>
              {hasPassedFifty && (
                <span className="text-xs font-black bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm animate-bounce">
                  ✨ Passed 50%!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mascot Speech Bubble & Listen Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div
            className={`px-4 py-2 rounded-2xl border-2 text-xs sm:text-sm font-black text-center shadow-xs transition-all ${badgeColor}`}
          >
            {mascotText}
          </div>

          {hasPassedFifty && onSpeakAgain && (
            <button
              onClick={handleSoundClick}
              title="Listen again"
              className="p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-90 text-white shadow-md shadow-indigo-500/30 transition-all flex items-center gap-1.5 font-black text-xs"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span className="hidden sm:inline">Hear Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Chunky Candy-Striped Progress Bar */}
      <div className="relative w-full h-8 sm:h-9 bg-slate-100 rounded-full overflow-hidden p-1 border-3 border-slate-200 shadow-inner mt-3">
        <div
          className={`h-full rounded-full transition-all duration-300 candy-bar shadow-sm ${
            percentage >= 80
              ? 'bg-emerald-500'
              : percentage >= 50
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-500'
              : 'bg-gradient-to-r from-amber-300 to-amber-400'
          }`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />

        {/* 50% Golden Milestone Flag */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-indigo-600 z-10 flex flex-col items-center"
          style={{ left: '50%' }}
        >
          <div className="w-4 h-4 -mt-1.5 rounded-full bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white font-black">
            50
          </div>
        </div>
      </div>

      {/* 3 Large Milestone Stars */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-500 px-2 pt-1">
        <div
          className={`flex items-center gap-1.5 transition-all ${
            percentage >= 25 ? 'text-amber-500 scale-105' : 'text-slate-300'
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              percentage >= 25
                ? 'fill-amber-400 text-amber-500 animate-spin'
                : 'text-slate-300'
            }`}
            style={{ animationDuration: '6s' }}
          />
          <span>25% Start</span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            percentage >= 50
              ? 'bg-indigo-500 text-white shadow-md scale-110 animate-bounce'
              : 'text-indigo-600 bg-indigo-50'
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              percentage >= 50 ? 'fill-amber-300 text-amber-300' : 'text-indigo-400'
            }`}
          />
          <span>50% Talks Aloud! 🔊</span>
        </div>

        <div
          className={`flex items-center gap-1.5 transition-all ${
            percentage >= 80 ? 'text-emerald-600 scale-105' : 'text-slate-300'
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              percentage >= 80 ? 'fill-emerald-400 text-emerald-500 animate-pulse' : 'text-slate-300'
            }`}
          />
          <span>80% Master ⭐</span>
        </div>
      </div>
    </div>
  );
};
