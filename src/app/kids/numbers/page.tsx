'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { KIDS_NUMBERS } from '@/data/kids-numbers';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';
import { kidsAudio } from '@/lib/kids-audio';

export default function KidsNumbersGridPage() {
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
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-3d-emerald text-white font-black text-sm shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kids Lobby</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-sm font-black shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>1 to 10 & १ to १०</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Numbers & Counting 🔢
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-bold">
          Count fun objects and trace English & Hindi numbers!
        </p>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {KIDS_NUMBERS.map((item) => {
          const isDone = completedMap.has(`num-${item.id}`);

          return (
            <Link
              key={item.id}
              href={`/kids/numbers/${item.id}`}
              onClick={handleTileClick}
              className={`group relative bg-white border-4 rounded-[2rem] p-6 text-center shadow-md transition-all transform hover:-translate-y-2 hover:shadow-xl active:scale-90 flex flex-col items-center justify-between ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              {isDone && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="text-5xl sm:text-6xl my-2 group-hover:scale-125 transition-transform animate-float select-none">
                {item.emoji}
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">
                    {item.englishDigit}
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                    ({item.hindiDigit})
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-600 mt-2">
                  {item.englishWord} / {item.hindiWord}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
