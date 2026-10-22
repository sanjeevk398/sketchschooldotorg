'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { ENGLISH_ALPHABET } from '@/data/kids-english';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';
import { kidsAudio } from '@/lib/kids-audio';

export default function KidsEnglishGridPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const completedMap = new Set(progress?.completedIds || []);

  const handleTileClick = () => {
    kidsAudio.playPop();
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids"
          onClick={handleTileClick}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-3d-sky text-white font-black text-sm shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kids Lobby</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 text-sm font-black shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{completedMap.size} / 26 Letters</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          English ABC Tracing 🔤
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-bold">
          Tap any letter to start tracing with magic rainbow ink!
        </p>
      </div>

      {/* Giant Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-5">
        {ENGLISH_ALPHABET.map((letter) => {
          const isDone = completedMap.has(letter.id);

          return (
            <Link
              key={letter.id}
              href={`/kids/english/${letter.id}`}
              onClick={handleTileClick}
              className={`group relative bg-white border-4 rounded-[2rem] p-5 text-center shadow-md transition-all transform hover:-translate-y-2 hover:shadow-xl active:scale-90 flex flex-col items-center justify-between ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-sky-400'
              }`}
            >
              {isDone && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="text-5xl my-2 group-hover:scale-125 transition-transform animate-float select-none">
                {letter.emoji}
              </div>

              <div className="mt-2">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                  {letter.char}{' '}
                  <span className="text-2xl font-black text-slate-400">
                    {letter.lowercase}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-600 mt-1.5">
                  {letter.word}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
