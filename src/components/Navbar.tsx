'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Zap, Heart, Pencil, Compass, Sparkles } from 'lucide-react';
import { getLocalProgress, getUserLevel, UserProgress } from '@/lib/storage';

export const Navbar: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  const levelInfo = getUserLevel(progress?.xp || 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/learn" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Pencil className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Sketch<span className="text-orange-500">School</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
              .org
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Learning Path</span>
          </Link>
          <Link
            href="/lesson/confident-straight-line"
            className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
          >
            <span>Daily Practice</span>
          </Link>
          <Link
            href="/kids"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-all transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kids Corner 🧸</span>
          </Link>
        </nav>

        {/* Gamification Stats */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Kids Corner Link */}
          <Link
            href="/kids"
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold"
          >
            <span>🧸 Kids</span>
          </Link>

          {/* Daily Streak */}
          <div
            title="Daily Practice Streak"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-orange-50 border border-orange-200/60 rounded-full text-xs font-bold text-orange-600 shadow-xs"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{progress?.streak || 1}</span>
          </div>

          {/* XP & Level */}
          <div
            title={`Level ${levelInfo.level}: ${levelInfo.title}`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-bold text-amber-700 shadow-xs"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{progress?.xp || 0} XP</span>
          </div>

          {/* Hearts */}
          <div
            title="Practice Energy"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200/60 rounded-full text-xs font-bold text-rose-600 shadow-xs"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{progress?.hearts || 5}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
