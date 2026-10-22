'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { KIDS_NUMBERS, getKidNumberById } from '@/data/kids-numbers';
import { KidsTracingCanvas, KidsCanvasHandle } from '@/components/Kids/KidsTracingCanvas';
import { KidsToolbar } from '@/components/Kids/KidsToolbar';
import { KidsMatchMeter } from '@/components/Kids/KidsMatchMeter';
import { KidsStickerModal } from '@/components/Kids/KidsStickerModal';
import { kidsAudio } from '@/lib/kids-audio';
import { recordKidItemCompleted } from '@/lib/kids-storage';

interface KidsNumberPageProps {
  params: {
    num: string;
  };
}

export default function KidsNumberPage({ params }: KidsNumberPageProps) {
  const router = useRouter();
  const numItem = getKidNumberById(params.num);
  const canvasRef = useRef<KidsCanvasHandle>(null);

  const [mode, setMode] = useState<'english' | 'hindi'>('english');
  const [tool, setTool] = useState<'crayon' | 'rainbow' | 'eraser'>('rainbow');
  const [color, setColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(16);
  const [strokeCount, setStrokeCount] = useState(0);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poppedCount, setPoppedCount] = useState<number[]>([]);

  if (!numItem) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-3xl font-black">Number not found!</h2>
        <Link
          href="/kids/numbers"
          className="inline-block px-6 py-3 btn-3d-emerald text-white font-black rounded-2xl text-base"
        >
          Back to Numbers
        </Link>
      </div>
    );
  }

  const currentIndex = KIDS_NUMBERS.findIndex((n) => n.id === numItem.id);
  const nextItem =
    currentIndex < KIDS_NUMBERS.length - 1 ? KIDS_NUMBERS[currentIndex + 1] : null;

  const activeChar = mode === 'english' ? numItem.englishDigit : numItem.hindiDigit;
  const activeWord = mode === 'english' ? numItem.englishWord : numItem.hindiWord;
  const activeHints =
    mode === 'english' ? numItem.strokeHintsEn : numItem.strokeHintsHi;

  const handleClear = () => {
    canvasRef.current?.clear();
    setStrokeCount(0);
    setMatchPercentage(0);
  };

  const handleFiftyPercentReached = () => {
    kidsAudio.speakRewardOnFifty(
      activeChar,
      activeWord,
      mode === 'english' ? 'en' : 'hi',
      true
    );
  };

  const handleSpeakAgain = () => {
    kidsAudio.speakRewardOnFifty(
      activeChar,
      activeWord,
      mode === 'english' ? 'en' : 'hi',
      true
    );
  };

  const handleSubmit = () => {
    if (strokeCount === 0) return;
    recordKidItemCompleted(`num-${numItem.id}`, numItem.sticker);
    setIsModalOpen(true);
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    handleClear();
    setPoppedCount([]);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    if (nextItem) {
      router.push(`/kids/numbers/${nextItem.id}`);
    } else {
      router.push('/kids');
    }
  };

  const handlePronounce = () => {
    kidsAudio.playPop();
    if (mode === 'english') {
      kidsAudio.speak(numItem.soundPromptEn, 'en');
    } else {
      kidsAudio.speak(numItem.soundPromptHi, 'hi');
    }
  };

  const handleTapObject = (idx: number) => {
    kidsAudio.playPop();
    if (!poppedCount.includes(idx)) {
      setPoppedCount((prev) => [...prev, idx]);
    }
  };

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      {/* Top Bar Navigation & Language Switcher */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids/numbers"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl btn-3d-emerald text-white font-black text-sm shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>All Numbers</span>
        </Link>

        {/* English / Hindi Digit Toggle (Chunky Tactile) */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border-2 border-slate-200">
          <button
            onClick={() => {
              kidsAudio.playPop();
              setMode('english');
              handleClear();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              mode === 'english'
                ? 'btn-3d-emerald text-white scale-105 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English (123)
          </button>
          <button
            onClick={() => {
              kidsAudio.playPop();
              setMode('hindi');
              handleClear();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              mode === 'hindi'
                ? 'btn-3d-emerald text-white scale-105 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी (१२३)
          </button>
        </div>
      </div>

      {/* Main Tracing & Counting Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Counting Card & Phonics */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
          <div className="bg-white border-4 border-emerald-300 rounded-[2.5rem] p-6 sm:p-7 shadow-xl space-y-6">
            {/* Giant Number Display */}
            <div className="text-center bg-gradient-to-br from-emerald-100/70 via-teal-50 to-emerald-50 border-4 border-emerald-300/80 rounded-[2rem] p-6 shadow-inner">
              <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight mb-1 animate-float">
                {activeChar}{' '}
                <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                  ({activeWord})
                </span>
              </div>

              {/* Audio button */}
              <button
                onClick={handlePronounce}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl btn-3d-emerald text-white font-black text-base shadow-md active:scale-95"
              >
                <Volume2 className="w-6 h-6 animate-wiggle" />
                <span>Hear Counting Sound! 🔊</span>
              </button>
            </div>

            {/* Interactive Tappable Counting Playground */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-black text-slate-700">
                <span>Tap each {numItem.emoji} to count:</span>
                <span className="text-emerald-600 text-base font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {poppedCount.length} / {numItem.emojiCount}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 p-5 bg-emerald-50/50 border-3 border-dashed border-emerald-300 rounded-3xl">
                {Array.from({ length: numItem.emojiCount }).map((_, i) => {
                  const isPopped = poppedCount.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleTapObject(i)}
                      className={`text-5xl sm:text-6xl transition-all transform active:scale-75 select-none ${
                        isPopped
                          ? 'scale-125 drop-shadow-lg ring-4 ring-emerald-400 rounded-3xl bg-emerald-200 p-2 animate-bounce'
                          : 'hover:scale-115 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {numItem.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stroke Tips */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                How to trace:
              </h4>
              <div className="space-y-2">
                {activeHints.map((hint, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
                    {hint}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tracing Canvas, Match Meter & Kid Toolbar */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
          {/* Real-time Match Meter */}
          <KidsMatchMeter
            percentage={matchPercentage}
            hasPassedFifty={matchPercentage >= 50}
            char={activeChar}
            word={activeWord}
            onSpeakAgain={handleSpeakAgain}
          />

          <KidsToolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onClear={handleClear}
            onSubmit={handleSubmit}
            strokeCount={strokeCount}
          />

          <KidsTracingCanvas
            ref={canvasRef}
            character={activeChar}
            tool={tool}
            color={color}
            brushSize={brushSize}
            onStrokeChange={setStrokeCount}
            onMatchChange={setMatchPercentage}
            onFiftyPercentReached={handleFiftyPercentReached}
          />
        </div>
      </div>

      {/* Celebration & Sticker Modal */}
      <KidsStickerModal
        isOpen={isModalOpen}
        sticker={numItem.sticker}
        onRetry={handleRetry}
        onNext={handleNext}
        nextLabel={nextItem ? `Next: Number ${nextItem.num} 🚀` : 'Back to Lobby 🎈'}
      />
    </div>
  );
}
