'use client';

import React from 'react';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
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
    kidsAudio.playPop();
    kidsAudio.speak(soundPrompt, lang);
  };

  return (
    <div className="bg-white border-4 border-amber-300 rounded-[2.5rem] p-5 sm:p-7 shadow-xl space-y-6">
      {/* Giant Toy Flashcard */}
      <div className="text-center bg-gradient-to-br from-amber-100/70 via-orange-50 to-rose-50 border-4 border-amber-300/80 rounded-[2rem] p-6 relative overflow-hidden group shadow-inner">
        {/* Floating Huge Emoji */}
        <div className="text-8xl sm:text-9xl animate-float my-2 select-none filter drop-shadow-lg">
          {emoji}
        </div>

        {/* Word Display with Big Font */}
        <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
          {word}
        </div>

        {translation && (
          <div className="text-lg sm:text-xl font-black text-amber-700 mt-1">
            ({translation})
          </div>
        )}

        {/* Giant Tactile Audio Button */}
        <button
          onClick={handlePronounce}
          className="mt-5 w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl btn-3d-amber text-amber-950 font-black text-base sm:text-lg shadow-md transition-all active:scale-95"
        >
          <Volume2 className="w-7 h-7 animate-wiggle" />
          <span>Tap to Hear Phonics! 🔊</span>
        </button>
      </div>

      {/* Simplified, Big Step-by-Step Instructions */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <span>How to Trace:</span>
        </h3>
        <div className="space-y-2">
          {strokeHints.map((hint, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-amber-50/70 border-2 border-amber-200/80 p-3 rounded-2xl text-xs sm:text-sm font-black text-slate-800"
            >
              <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 text-sm font-black flex items-center justify-center flex-shrink-0 shadow-xs">
                {idx + 1}
              </span>
              <span>{hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Fact with Larger Font */}
      <div className="p-4 bg-sky-50 border-3 border-sky-200 rounded-2xl space-y-1.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-sky-900">
          <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
          <span>Fun Fact!</span>
        </div>
        <p className="text-xs sm:text-sm text-sky-800 leading-relaxed font-bold">
          {funFact}
        </p>
      </div>
    </div>
  );
};
