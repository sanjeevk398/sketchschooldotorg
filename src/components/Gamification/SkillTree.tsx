'use client';

import React from 'react';
import Link from 'next/link';
import { Unit } from '@/data/curriculum';
import { UserProgress } from '@/lib/storage';
import { Check, Star, Lock, Play, Sparkles } from 'lucide-react';

interface SkillTreeProps {
  units: Unit[];
  progress: UserProgress | null;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ units, progress }) => {
  const completedMap = progress?.completedLessons || {};

  // Check which lessons are unlocked (first lesson is always unlocked; subsequent lessons unlock if previous is completed)
  let previousCompleted = true;

  return (
    <div className="max-w-xl mx-auto space-y-12 py-8">
      {units.map((unit) => {
        return (
          <div key={unit.id} className="relative">
            {/* Unit Header Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 mb-8">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-100 mb-1">
                <span>Unit {unit.number}</span>
                <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {unit.badge}
                </span>
              </div>
              <h2 className="text-xl font-black">{unit.title}</h2>
              <p className="text-xs text-orange-100 mt-1 leading-relaxed">
                {unit.description}
              </p>
            </div>

            {/* Path Nodes */}
            <div className="relative flex flex-col items-center gap-8">
              {/* Vertical connector track */}
              <div className="absolute top-6 bottom-6 w-2 bg-slate-200 rounded-full -z-0" />

              {unit.lessons.map((lesson, idx) => {
                const completion = completedMap[lesson.id];
                const isCompleted = !!completion;
                const isUnlocked = previousCompleted;
                // If this lesson is not completed, subsequent lessons will be locked
                if (!isCompleted) {
                  previousCompleted = false;
                }

                // Node offset (zigzag path like Duolingo)
                const offsetClass =
                  idx % 3 === 0
                    ? 'translate-x-0'
                    : idx % 3 === 1
                    ? '-translate-x-10'
                    : 'translate-x-10';

                return (
                  <div
                    key={lesson.id}
                    className={`relative z-10 flex flex-col items-center transition-transform ${offsetClass}`}
                  >
                    <Link
                      href={isUnlocked ? `/lesson/${lesson.id}` : '#'}
                      className={`relative group flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-300 ${
                        isCompleted
                          ? 'bg-amber-400 border-amber-500 text-slate-900 hover:scale-105 active:scale-95 shadow-amber-400/30'
                          : isUnlocked
                          ? 'bg-orange-500 border-orange-600 text-white hover:scale-105 active:scale-95 shadow-orange-500/30 animate-pulse'
                          : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="flex flex-col items-center">
                          <Check className="w-8 h-8 stroke-[3]" />
                          <div className="flex items-center gap-0.5 -mt-1">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= completion.stars
                                    ? 'fill-amber-900 text-amber-900'
                                    : 'text-amber-700/40 fill-none'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : isUnlocked ? (
                        <Play className="w-8 h-8 fill-white ml-1" />
                      ) : (
                        <Lock className="w-7 h-7" />
                      )}
                    </Link>

                    {/* Node Title Card */}
                    <div className="mt-3 text-center max-w-[160px]">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>+{lesson.xp} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
