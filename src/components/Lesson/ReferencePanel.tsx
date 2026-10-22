'use client';

import React from 'react';
import { Lesson } from '@/data/curriculum';
import { Lightbulb, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

interface ReferencePanelProps {
  lesson: Lesson;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ lesson }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Lesson Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
          <span>{lesson.unitTitle}</span>
          <span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> +{lesson.xp} XP
          </span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{lesson.title}</h1>
        <p className="text-xs text-slate-500 mt-1">{lesson.subtitle}</p>
      </div>

      {/* Description */}
      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed">
        <p>{lesson.description}</p>
      </div>

      {/* Step by Step Checklist */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Instructions
        </h3>
        <ul className="space-y-2 text-xs text-slate-700">
          {lesson.instructions.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pro Tips Card */}
      {lesson.tips.length > 0 && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Master Coach Tip</span>
          </div>
          <ul className="text-xs text-amber-800/90 space-y-1 list-disc list-inside">
            {lesson.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Goal Criteria Pill */}
      <div className="mt-auto pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        <span>Goal: {lesson.evaluationCriteria.aiPromptGoal}</span>
      </div>
    </div>
  );
};
