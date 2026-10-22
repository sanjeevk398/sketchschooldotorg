'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { HINDI_SWAR, HINDI_VYANJAN } from '@/data/kids-hindi';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';
import { kidsAudio } from '@/lib/kids-audio';

export default function KidsHindiGridPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const completedMap = new Set(progress?.completedIds || []);

  const handleTileClick = () => {
    kidsAudio.playPop();
  };

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids"
          onClick={handleTileClick}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-3d-amber text-amber-950 font-black text-sm shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kids Lobby</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-100 border-2 border-orange-300 text-orange-950 text-sm font-black shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>हिंदी वर्णमाला अभ्यास</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          हिंदी वर्णमाला ट्रेसिंग 🕉️
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-bold">
          अक्षर चुनें और सुंदर शिरोरेखा के साथ लिखना सीखें!
        </p>
      </div>

      {/* Section 1: Swar (स्वर - 13 Vowels) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-orange-500 shadow-sm" />
          <h2 className="text-2xl font-black text-slate-900">
            स्वर (Swar - 13 Vowels)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-5">
          {HINDI_SWAR.map((item) => {
            const isDone = completedMap.has(item.id);

            return (
              <Link
                key={item.id}
                href={`/kids/hindi/${item.id}`}
                onClick={handleTileClick}
                className={`group relative bg-white border-4 rounded-[2rem] p-5 text-center shadow-md transition-all transform hover:-translate-y-2 hover:shadow-xl active:scale-90 flex flex-col items-center justify-between ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-orange-400'
                }`}
              >
                {isDone && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div className="text-5xl my-2 group-hover:scale-125 transition-transform animate-float select-none">
                  {item.emoji}
                </div>

                <div className="mt-2">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                    {item.char}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-600 mt-2">
                    {item.word}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 2: Vyanjan (व्यंजन - Consonants) */}
      <div className="space-y-4 pt-6 border-t-4 border-slate-200">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-amber-500 shadow-sm" />
          <h2 className="text-2xl font-black text-slate-900">
            व्यंजन (Vyanjan - Consonants)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-5">
          {HINDI_VYANJAN.map((item) => {
            const isDone = completedMap.has(item.id);

            return (
              <Link
                key={item.id}
                href={`/kids/hindi/${item.id}`}
                onClick={handleTileClick}
                className={`group relative bg-white border-4 rounded-[2rem] p-5 text-center shadow-md transition-all transform hover:-translate-y-2 hover:shadow-xl active:scale-90 flex flex-col items-center justify-between ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-amber-400'
                }`}
              >
                {isDone && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div className="text-5xl my-2 group-hover:scale-125 transition-transform animate-float select-none">
                  {item.emoji}
                </div>

                <div className="mt-2">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                    {item.char}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-600 mt-2">
                    {item.word}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
