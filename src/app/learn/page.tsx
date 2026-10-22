'use client';

import React, { useEffect, useState } from 'react';
import { CURRICULUM } from '@/data/curriculum';
import { SkillTree } from '@/components/Gamification/SkillTree';
import { getLocalProgress, UserProgress } from '@/lib/storage';

export default function LearnPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Sketching Journey
        </h1>
        <p className="text-xs text-slate-500">
          Complete daily challenges, unlock new units, and earn mastery badges.
        </p>
      </div>

      <SkillTree units={CURRICULUM} progress={progress} />
    </div>
  );
}
