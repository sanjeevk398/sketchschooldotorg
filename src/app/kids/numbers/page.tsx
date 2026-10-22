'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Sparkles, Check } from 'lucide-react';
import { KIDS_NUMBERS } from '@/data/kids-numbers';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';

export default function KidsNumbersGridPage() {
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>1 to 10 & १ to १०</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Numbers & Counting 🔢
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Count objects and trace numbers in English and Hindi!
        </p>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {KIDS_NUMBERS.map((item) => {
          const isDone = completedMap.has(`num-${item.id}`);

          return (
            <Link
              key={item.id}
              href={`/kids/numbers/${item.id}`}
              className={`group relative bg-white border-3 rounded-3xl p-5 text-center shadow-sm transition-all transform hover:-translate-y-1 hover:shadow-md active:scale-95 flex flex-col items-center justify-between ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              {isDone && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {item.englishDigit}
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ({item.hindiDigit})
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
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
