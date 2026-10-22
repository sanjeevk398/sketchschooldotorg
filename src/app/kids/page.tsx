'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, Award } from 'lucide-react';
import { getKidsProgress, KidsProgress } from '@/lib/kids-storage';
import { kidsAudio } from '@/lib/kids-audio';

export default function KidsLobbyPage() {
  const [progress, setProgress] = useState<KidsProgress | null>(null);

  useEffect(() => {
    setProgress(getKidsProgress());
  }, []);

  const totalStickers = progress?.stickers?.length || 0;
  const totalStars = progress?.totalStars || 0;

  const handlePortalClick = () => {
    kidsAudio.playPop();
  };

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Playful Giant Hero Card with Floating Balloons */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-amber-300 rounded-[3rem] p-8 sm:p-12 text-white shadow-2xl shadow-orange-500/25 text-center relative overflow-hidden">
        {/* Decorative Floating Elements */}
        <div className="absolute top-4 left-6 text-4xl animate-float opacity-80 select-none">
          🎈
        </div>
        <div className="absolute top-6 right-8 text-4xl animate-wiggle opacity-80 select-none">
          ⭐
        </div>
        <div className="absolute bottom-4 left-10 text-3xl animate-bounce opacity-70 select-none">
          🎨
        </div>
        <div className="absolute bottom-6 right-10 text-4xl animate-float opacity-80 select-none">
          🚀
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/30 backdrop-blur-md text-white text-sm sm:text-base font-black mb-4 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
          <span>SketchSchool Junior 🧸</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
          Learn, Trace & Talk!
        </h1>
        <p className="text-base sm:text-xl text-amber-100 font-extrabold max-w-xl mx-auto mt-3 leading-relaxed">
          Draw with magic rainbow ink! Reach 50% to make letters speak out loud! 🔊
        </p>

        {/* Kids Giant Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
          <div className="bg-white/25 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-base sm:text-lg shadow-sm">
            <Star className="w-7 h-7 fill-amber-300 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{totalStars} Gold Stars</span>
          </div>

          <div className="bg-white/25 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-base sm:text-lg shadow-sm">
            <Award className="w-7 h-7 text-amber-200" />
            <span>{totalStickers} Stickers Collected</span>
          </div>
        </div>
      </div>

      {/* The 3 Core Giant Learning Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Portal 1: English ABC */}
        <Link
          href="/kids/english"
          onClick={handlePortalClick}
          className="group relative bg-white border-8 border-sky-300 hover:border-sky-500 rounded-[2.5rem] p-7 shadow-xl shadow-sky-500/10 transition-all transform hover:-translate-y-2 active:scale-95 flex flex-col justify-between"
        >
          <div>
            <div className="w-20 h-20 rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center text-4xl font-black mb-5 group-hover:scale-115 transition-transform shadow-inner">
              🔤
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-sky-600 mb-1">
              English Alphabet
            </div>
            <h2 className="text-3xl font-black text-slate-900">ABC (A to Z)</h2>
            <p className="text-sm text-slate-600 font-bold mt-2 leading-relaxed">
              Trace uppercase & lowercase letters with rainbow ink and hear fun phonics!
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between pt-5 border-t-2 border-sky-100">
            <span className="text-sm font-black text-sky-600">26 Letters</span>
            <div className="w-12 h-12 rounded-2xl btn-3d-sky text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </Link>

        {/* Portal 2: Hindi Varnamala */}
        <Link
          href="/kids/hindi"
          onClick={handlePortalClick}
          className="group relative bg-white border-8 border-orange-300 hover:border-orange-500 rounded-[2.5rem] p-7 shadow-xl shadow-orange-500/10 transition-all transform hover:-translate-y-2 active:scale-95 flex flex-col justify-between"
        >
          <div>
            <div className="w-20 h-20 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center text-4xl font-black mb-5 group-hover:scale-115 transition-transform shadow-inner">
              🕉️
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-orange-600 mb-1">
              हिंदी वर्णमाला
            </div>
            <h2 className="text-3xl font-black text-slate-900">अ से ज्ञ</h2>
            <p className="text-sm text-slate-600 font-bold mt-2 leading-relaxed">
              अ से अनार, क से कमल! शिरोरेखा के साथ सुंदर हिंदी लिखना सीखें।
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between pt-5 border-t-2 border-orange-100">
            <span className="text-sm font-black text-orange-600">स्वर व व्यंजन</span>
            <div className="w-12 h-12 rounded-2xl btn-3d-amber text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </Link>

        {/* Portal 3: Numbers 123 */}
        <Link
          href="/kids/numbers"
          onClick={handlePortalClick}
          className="group relative bg-white border-8 border-emerald-300 hover:border-emerald-500 rounded-[2.5rem] p-7 shadow-xl shadow-emerald-500/10 transition-all transform hover:-translate-y-2 active:scale-95 flex flex-col justify-between"
        >
          <div>
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl font-black mb-5 group-hover:scale-115 transition-transform shadow-inner">
              🔢
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">
              Numbers & Counting
            </div>
            <h2 className="text-3xl font-black text-slate-900">1 to 10 & १ to १०</h2>
            <p className="text-sm text-slate-600 font-bold mt-2 leading-relaxed">
              Pop balloons and stars! Learn English numbers and traditional Hindi अंक.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between pt-5 border-t-2 border-emerald-100">
            <span className="text-sm font-black text-emerald-600">English & Hindi</span>
            <div className="w-12 h-12 rounded-2xl btn-3d-emerald text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </Link>
      </div>

      {/* Collectible Sticker Book Section */}
      <div className="bg-white border-4 border-amber-300 rounded-[2.5rem] p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner animate-wiggle">
              📘
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">My Magic Sticker Album</h3>
              <p className="text-sm text-slate-500 font-bold">
                Finish any letter or number to paste a shiny new badge here!
              </p>
            </div>
          </div>
          <span className="text-sm font-black bg-amber-100 text-amber-950 px-5 py-2 rounded-2xl border-2 border-amber-300 shadow-xs">
            {totalStickers} Badges Collected
          </span>
        </div>

        {totalStickers > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pt-2">
            {progress?.stickers?.map((stk, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-4 text-center transform hover:scale-115 transition-transform shadow-md animate-pop"
              >
                <div className="text-4xl sm:text-5xl mb-2 animate-bounce">{stk.emoji}</div>
                <div className="text-xs font-black text-slate-800 line-clamp-1">
                  {stk.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-amber-50/60 border-3 border-dashed border-amber-200 rounded-3xl">
            <p className="text-base text-amber-900 font-extrabold">
              Your sticker book is empty! Trace your first letter to unlock a shiny animal sticker. 🎨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
