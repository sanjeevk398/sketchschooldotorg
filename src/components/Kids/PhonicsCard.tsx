'use client';

import React from 'react';
import { Volume2, Sparkles, BookOpen, Heart } from 'lucide-react';
import { kidsAudio } from '@/lib/kids-audio';

interface PhonicsCardProps {
  char: string;
  word: string;
  translation?: string;
  emoji: string;
  soundPrompt: string;
  funFact: string;
  strokeHints: string[];
  lang?: 'en' | 'hi';
}

export const PhonicsCard: React.FC<PhonicsCardProps> = ({
  char,
  word,
  translation,
  emoji,
  soundPrompt,
  funFact,
  strokeHints,
  lang = 'en',
}) => {
  const handlePronounce = () => {
    kidsAudio.speak(soundPrompt, lang);
  };

  return (
    <div className="bg-white border-4 border-amber-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
      {/* Big Phonics Hero Card */}
      <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-3xl p-6 relative overflow-hidden group">
        <div className="text-6xl sm:text-7xl animate-bounce duration-1000 mb-2 select-none">
          {emoji}
        </div>

        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {word}
        </div>

        {translation && (
          <div className="text-sm font-bold text-amber-700 mt-0.5">
            ({translation})
          </div>
        )}

        {/* Big Audio Pronunciation Button */}
        <button
          onClick={handlePronounce}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <Volume2 className="w-5 h-5" />
          <span>Say it out loud! 🔊</span>
        </button>
      </div>

      {/* Stroke Order Steps */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span>How to Trace:</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
          {strokeHints.map((hint, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100"
            >
              <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fun Fact Card */}
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-black text-sky-900">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Did You Know?</span>
        </div>
        <p className="text-xs text-sky-800 leading-relaxed font-medium">
          {funFact}
        </p>
      </div>
    </div>
  );
};
