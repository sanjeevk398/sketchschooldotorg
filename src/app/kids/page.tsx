'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, BookOpen, Volume2, Award } from 'lucide-react';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';

export default function KidsLobbyPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const totalStickers = progress?.stickers?.length || 0;
  const totalStars = progress?.totalStars || 0;

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Playful Hero Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/20 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-black mb-3">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Welcome to SketchSchool Junior! 🧸</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
          Learn, Trace & Play!
        </h1>
        <p className="text-sm sm:text-base text-amber-100 font-semibold max-w-xl mx-auto mt-2">
          Pick your favorite activity below. Trace with magic rainbow ink, listen to phonics, and collect all the animal stickers!
        </p>

        {/* Kids Stats Bar */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs sm:text-sm">
            <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
            <span>{totalStars} Gold Stars</span>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs sm:text-sm">
            <Award className="w-5 h-5 text-amber-200" />
            <span>{totalStickers} Stickers Collected</span>
          </div>
        </div>
      </div>

      {/* The 3 Core Learning Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portal 1: English ABC */}
        <Link
          href="/kids/english"
          className="group relative bg-white border-4 border-sky-300 hover:border-sky-500 rounded-3xl p-6 shadow-lg shadow-sky-500/10 transition-all transform hover:-translate-y-1.5 active:scale-98 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform">
              🔤
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 mb-1">
              <span>English Alphabets</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">ABC (A to Z)</h2>
            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              Trace uppercase & lowercase letters with stroke order arrows and listen to fun phonics!
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-sky-100">
            <span className="text-xs font-black text-sky-600">26 Letters</span>
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Portal 2: Hindi Varnamala */}
        <Link
          href="/kids/hindi"
          className="group relative bg-white border-4 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-lg shadow-orange-500/10 transition-all transform hover:-translate-y-1.5 active:scale-98 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform">
              🕉️
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 mb-1">
              <span>हिंदी वर्णमाला</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">स्वर और व्यंजन</h2>
            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              अ से अनार, क से कमल! शिरोरेखा (छत) के साथ हिंदी अक्षरों को लिखना सीखें।
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-orange-100">
            <span className="text-xs font-black text-orange-600">स्वर व व्यंजन</span>
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Portal 3: Numbers 123 */}
        <Link
          href="/kids/numbers"
          className="group relative bg-white border-4 border-emerald-300 hover:border-emerald-500 rounded-3xl p-6 shadow-lg shadow-emerald-500/10 transition-all transform hover:-translate-y-1.5 active:scale-98 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform">
              🔢
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">
              <span>Numbers & Counting</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">1 to 10 & १ to १०</h2>
            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              Count balloons, stars, and fruits. Learn English numbers alongside traditional Hindi numerals!
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-100">
            <span className="text-xs font-black text-emerald-600">English & Hindi</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Collectible Sticker Book Section */}
      <div className="bg-white border-4 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
              📘
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">My Sticker Album</h3>
              <p className="text-xs text-slate-500 font-medium">
                Finish any letter or number to paste a new sticker here!
              </p>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            {totalStickers} Unlocked
          </span>
        </div>

        {totalStickers > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 pt-2">
            {progress?.stickers?.map((stk, idx) => (
              <div
                key={idx}
                className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center transform hover:scale-110 transition-transform"
              >
                <div className="text-3xl mb-1">{stk.emoji}</div>
                <div className="text-[10px] font-black text-slate-800 line-clamp-1">
                  {stk.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">
              No stickers yet! Trace your first letter to unlock an animal badge. 🎨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
