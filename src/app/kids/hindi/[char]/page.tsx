'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ALL_HINDI_CHARS, getHindiCharById } from '@/data/kids-hindi';
import { KidsTracingCanvas, KidsCanvasHandle } from '@/components/Kids/KidsTracingCanvas';
import { KidsToolbar } from '@/components/Kids/KidsToolbar';
import { PhonicsCard } from '@/components/Kids/PhonicsCard';
import { KidsStickerModal } from '@/components/Kids/KidsStickerModal';
import { recordKidItemCompleted } from '@/lib/kids-storage';

interface KidsHindiCharPageProps {
  params: {
    char: string;
  };
}

export default function KidsHindiCharPage({ params }: KidsHindiCharPageProps) {
  const router = useRouter();
  const hindiItem = getHindiCharById(params.char);
  const canvasRef = useRef<KidsCanvasHandle>(null);

  const [tool, setTool] = useState<'crayon' | 'rainbow' | 'eraser'>('rainbow');
  const [color, setColor] = useState('#f97316');
  const [brushSize, setBrushSize] = useState(14);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!hindiItem) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-black">अक्षर नहीं मिला!</h2>
        <Link
          href="/kids/hindi"
          className="inline-block px-5 py-2.5 bg-orange-400 text-orange-950 font-black rounded-2xl"
        >
          वर्णमाला पर वापस जाएं
        </Link>
      </div>
    );
  }

  const currentIndex = ALL_HINDI_CHARS.findIndex((h) => h.id === hindiItem.id);
  const nextItem =
    currentIndex < ALL_HINDI_CHARS.length - 1
      ? ALL_HINDI_CHARS[currentIndex + 1]
      : null;

  const handleClear = () => {
    canvasRef.current?.clear();
    setStrokeCount(0);
  };

  const handleSubmit = () => {
    if (strokeCount === 0) return;
    recordKidItemCompleted(hindiItem.id, hindiItem.sticker);
    setIsModalOpen(true);
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    handleClear();
  };

  const handleNext = () => {
    setIsModalOpen(false);
    if (nextItem) {
      router.push(`/kids/hindi/${nextItem.id}`);
    } else {
      router.push('/kids');
    }
  };

  return (
    <div className="space-y-4 py-2 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/kids/hindi"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सभी अक्षर</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
          <span>
            अक्षर: {hindiItem.char} ({hindiItem.transliteration})
          </span>
        </div>
      </div>

      {/* Main Tracing Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Hindi Phonics & Instructions */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <PhonicsCard
            char={hindiItem.char}
            word={hindiItem.word}
            translation={hindiItem.englishMeaning}
            emoji={hindiItem.emoji}
            soundPrompt={hindiItem.soundPrompt}
            funFact={hindiItem.funFact}
            strokeHints={hindiItem.strokeHints}
            lang="hi"
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
            character={hindiItem.char}
            tool={tool}
            color={color}
            brushSize={brushSize}
            onStrokeChange={setStrokeCount}
          />
        </div>
      </div>

      {/* Celebration & Sticker Modal */}
      <KidsStickerModal
        isOpen={isModalOpen}
        sticker={hindiItem.sticker}
        onRetry={handleRetry}
        onNext={handleNext}
        nextLabel={nextItem ? `अगला अक्षर: ${nextItem.char} 🚀` : 'लॉबी पर वापस जाएं 🎈'}
      />
    </div>
  );
}
