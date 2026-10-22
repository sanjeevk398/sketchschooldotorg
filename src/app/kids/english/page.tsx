'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Sparkles, Check } from 'lucide-react';
import { ENGLISH_ALPHABET } from '@/data/kids-english';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';

export default function KidsEnglishGridPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const completedMap = new Set(progress?.completedIds || []);

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kids Corner</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{completedMap.size} / 26 Letters</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          English ABC Tracing 🔤
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Choose a letter to start tracing with rainbow magic ink!
        </p>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
        {ENGLISH_ALPHABET.map((letter) => {
          const isDone = completedMap.has(letter.id);

          return (
            <Link
              key={letter.id}
              href={`/kids/english/${letter.id}`}
              className={`group relative bg-white border-3 rounded-3xl p-4 text-center shadow-sm transition-all transform hover:-translate-y-1 hover:shadow-md active:scale-95 flex flex-col items-center justify-between ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-sky-400'
              }`}
            >
              {isDone && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">
                {letter.emoji}
              </div>

              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {letter.char}{' '}
                  <span className="text-lg font-bold text-slate-400">
                    {letter.lowercase}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-1">
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
