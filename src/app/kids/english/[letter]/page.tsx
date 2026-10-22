'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ENGLISH_ALPHABET, getEnglishLetter } from '@/data/kids-english';
import { KidsTracingCanvas, KidsCanvasHandle } from '@/components/Kids/KidsTracingCanvas';
import { KidsToolbar } from '@/components/Kids/KidsToolbar';
import { PhonicsCard } from '@/components/Kids/PhonicsCard';
import { KidsStickerModal } from '@/components/Kids/KidsStickerModal';
import { recordKidItemCompleted } from '@/lib/kids-storage';

interface KidsLetterPageProps {
  params: {
    letter: string;
  };
}

export default function KidsLetterPage({ params }: KidsLetterPageProps) {
  const router = useRouter();
  const letter = getEnglishLetter(params.letter);
  const canvasRef = useRef<KidsCanvasHandle>(null);

  const [tool, setTool] = useState<'crayon' | 'rainbow' | 'eraser'>('rainbow');
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(14);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!letter) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-black">Letter not found!</h2>
        <Link
          href="/kids/english"
          className="inline-block px-5 py-2.5 bg-amber-400 text-amber-950 font-black rounded-2xl"
        >
          Back to ABCs
        </Link>
      </div>
    );
  }

  // Find next letter in alphabet
  const currentIndex = ENGLISH_ALPHABET.findIndex((l) => l.id === letter.id);
  const nextLetter =
    currentIndex < ENGLISH_ALPHABET.length - 1
      ? ENGLISH_ALPHABET[currentIndex + 1]
      : null;

  const handleClear = () => {
    canvasRef.current?.clear();
    setStrokeCount(0);
  };

  const handleSubmit = () => {
    if (strokeCount === 0) return;
    recordKidItemCompleted(letter.id, letter.sticker);
    setIsModalOpen(true);
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    handleClear();
  };

  const handleNext = () => {
    setIsModalOpen(false);
    if (nextLetter) {
      router.push(`/kids/english/${nextLetter.id}`);
    } else {
      router.push('/kids');
    }
  };

  return (
    <div className="space-y-4 py-2 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids/english"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Letters</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
          <span>
            Letter {currentIndex + 1} of {ENGLISH_ALPHABET.length}
          </span>
        </div>
      </div>

      {/* Main Tracing Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Phonics & Instructions */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <PhonicsCard
            char={letter.char}
            word={letter.word}
            translation={letter.hindiWord}
            emoji={letter.emoji}
            soundPrompt={letter.soundPrompt}
            funFact={letter.funFact}
            strokeHints={letter.strokeHints}
            lang="en"
          />
        </div>

        {/* Right Column: Tracing Canvas & Kid Toolbar */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-3">
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
            character={letter.char}
            subCharacter={letter.lowercase}
            tool={tool}
            color={color}
            brushSize={brushSize}
            guides={letter.strokeGuideLines}
            onStrokeChange={setStrokeCount}
          />
        </div>
      </div>

      {/* Celebration & Sticker Modal */}
      <KidsStickerModal
        isOpen={isModalOpen}
        sticker={letter.sticker}
        onRetry={handleRetry}
        onNext={handleNext}
        nextLabel={nextLetter ? `Next: Letter ${nextLetter.char} 🚀` : 'Back to Lobby 🎈'}
      />
    </div>
  );
}
