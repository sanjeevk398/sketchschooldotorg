'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2 } from 'lucide-react';
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
  const [brushSize, setBrushSize] = useState(14);
  const [strokeCount, setStrokeCount] = useState(0);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poppedCount, setPoppedCount] = useState<number[]>([]);

  if (!numItem) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-black">Number not found!</h2>
        <Link
          href="/kids/numbers"
          className="inline-block px-5 py-2.5 bg-emerald-400 text-emerald-950 font-black rounded-2xl"
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
    // Automatically speak when match exceeds 50%!
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
    <div className="space-y-4 py-2 max-w-5xl mx-auto">
      {/* Top Bar Navigation & Language Switcher */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids/numbers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Numbers</span>
        </Link>

        {/* English / Hindi Digit Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setMode('english');
              handleClear();
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              mode === 'english'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600'
            }`}
          >
            English (123)
          </button>
          <button
            onClick={() => {
              setMode('hindi');
              handleClear();
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              mode === 'hindi'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600'
            }`}
          >
            हिंदी (१२३)
          </button>
        </div>
      </div>

      {/* Main Tracing & Counting Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Counting Card & Phonics */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
          <div className="bg-white border-4 border-emerald-200 rounded-3xl p-6 shadow-md space-y-5">
            <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/60 rounded-3xl p-6">
              <div className="text-5xl font-black text-slate-900 mb-1">
                {activeChar}{' '}
                <span className="text-2xl font-bold text-emerald-600">
                  ({activeWord})
                </span>
              </div>

              {/* Audio button */}
              <button
                onClick={handlePronounce}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-xs sm:text-sm shadow-md shadow-emerald-400/30 transition-all transform hover:scale-105 active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                <span>Hear Counting Sound 🔊</span>
              </button>
            </div>

            {/* Interactive Tappable Counting Playground */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Tap to Count {numItem.emoji}:</span>
                <span className="text-emerald-600">
                  {poppedCount.length} / {numItem.emojiCount}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50 border-2 border-dashed border-emerald-200 rounded-2xl">
                {Array.from({ length: numItem.emojiCount }).map((_, i) => {
                  const isPopped = poppedCount.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleTapObject(i)}
                      className={`text-4xl transition-all transform active:scale-75 ${
                        isPopped
                          ? 'scale-115 drop-shadow-md ring-2 ring-emerald-400 rounded-full bg-emerald-100 p-1'
                          : 'hover:scale-110 opacity-70'
                      }`}
                    >
                      {numItem.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stroke Tips */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                How to trace:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1">
                {activeHints.map((hint, idx) => (
                  <li key={idx} className="bg-slate-50 p-2 rounded-xl">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Tracing Canvas, Match Meter & Kid Toolbar */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-3">
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
