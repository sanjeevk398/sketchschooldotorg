'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Sparkles, Check } from 'lucide-react';
import { HINDI_SWAR, HINDI_VYANJAN } from '@/data/kids-hindi';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';

export default function KidsHindiGridPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const completedMap = new Set(progress?.completedIds || []);

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>हिंदी वर्णमाला अभ्यास</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          हिंदी वर्णमाला ट्रेसिंग 🕉️
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          शिरोरेखा (छत) के साथ हिंदी अक्षरों को लिखना सीखें!
        </p>
      </div>

      {/* Section 1: Swar (स्वर - Vowels) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <h2 className="text-lg font-black text-slate-900">
            स्वर (Swar - Vowels)
          </h2>
          <span className="text-xs font-bold text-slate-400">13 अक्षर</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
          {HINDI_SWAR.map((item) => {
            const isDone = completedMap.has(item.id);

            return (
              <Link
                key={item.id}
                href={`/kids/hindi/${item.id}`}
                className={`group relative bg-white border-3 rounded-3xl p-4 text-center shadow-sm transition-all transform hover:-translate-y-1 hover:shadow-md active:scale-95 flex flex-col items-center justify-between ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-orange-400'
                }`}
              >
                {isDone && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>

                <div>
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {item.char}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 mt-1">
                    {item.word}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 2: Vyanjan (व्यंजन - Consonants) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <h2 className="text-lg font-black text-slate-900">
            व्यंजन (Vyanjan - Consonants)
          </h2>
          <span className="text-xs font-bold text-slate-400">प्रमुख अक्षर</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
          {HINDI_VYANJAN.map((item) => {
            const isDone = completedMap.has(item.id);

            return (
              <Link
                key={item.id}
                href={`/kids/hindi/${item.id}`}
                className={`group relative bg-white border-3 rounded-3xl p-4 text-center shadow-sm transition-all transform hover:-translate-y-1 hover:shadow-md active:scale-95 flex flex-col items-center justify-between ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-amber-400'
                }`}
              >
                {isDone && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>

                <div>
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {item.char}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 mt-1">
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
