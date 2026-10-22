'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, getNextLessonId } from '@/data/curriculum';
import { DrawingCanvas, DrawingCanvasHandle } from '@/components/Canvas/DrawingCanvas';
import { CanvasToolbar } from '@/components/Canvas/CanvasToolbar';
import { ReferencePanel } from '@/components/Lesson/ReferencePanel';
import { FeedbackModal, CritiqueData } from '@/components/Lesson/FeedbackModal';
import { evaluateSketchLocally } from '@/lib/heuristics';
import { recordLessonCompletion } from '@/lib/storage';

interface LessonRunnerProps {
  lesson: Lesson;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({ lesson }) => {
  const router = useRouter();
  const canvasRef = useRef<DrawingCanvasHandle>(null);

  // Canvas tool states
  const [tool, setTool] = useState<'pen' | 'pencil' | 'eraser'>('pen');
  const [color, setColor] = useState('#0f172a');
  const [brushSize, setBrushSize] = useState(6);
  const [showGuides, setShowGuides] = useState(true);
  const [gridType, setGridType] = useState<'none' | 'dots' | 'grid'>('none');
  const [strokeCount, setStrokeCount] = useState(0);

  // Undo/Redo state mirrors
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Evaluation & Modal states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);

  const nextLessonId = getNextLessonId(lesson.id);

  const handleStrokeChange = (count: number) => {
    setStrokeCount(count);
    if (canvasRef.current) {
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
    }
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
    handleStrokeChange(canvasRef.current?.getStrokes().length || 0);
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
    handleStrokeChange(canvasRef.current?.getStrokes().length || 0);
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    handleStrokeChange(0);
  };

  const handleSubmit = async () => {
    if (!canvasRef.current || strokeCount === 0 || isEvaluating) return;

    setIsEvaluating(true);

    try {
      const strokes = canvasRef.current.getStrokes();
      const heuristic = evaluateSketchLocally(strokes, lesson);
      const imageBase64 = canvasRef.current.getCleanCanvasPng();

      const res = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          imageBase64,
          heuristicResult: heuristic,
        }),
      });

      let critiqueResult: CritiqueData;

      if (res.ok) {
        critiqueResult = await res.json();
      } else {
        // Fallback to local heuristic if server error
        critiqueResult = {
          source: 'local-heuristic',
          score: heuristic.score,
          stars: heuristic.stars,
          lineQuality: heuristic.details.lineConfidence || 'Normal',
          proportions: 'Balanced',
          mentorTip: heuristic.feedback,
          encouragement: heuristic.stars >= 2 ? 'Great job!' : 'Keep practicing!',
        };
      }

      setCritique(critiqueResult);

      // Record gamification progress if completed
      if (critiqueResult.stars >= 1) {
        recordLessonCompletion(lesson.id, critiqueResult.score, critiqueResult.stars, lesson.xp);
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error('Critique submission error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    handleClear();
  };

  const handleNext = () => {
    setIsModalOpen(false);
    if (nextLessonId) {
      router.push(`/lesson/${nextLessonId}`);
    } else {
      router.push('/learn');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Lesson Reference & Instructions */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <ReferencePanel lesson={lesson} />
      </div>

      {/* Right Column: Canvas & Controls */}
      <div className="lg:col-span-8 order-1 lg:order-2 space-y-3">
        <CanvasToolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          showGuides={showGuides}
          setShowGuides={setShowGuides}
          gridType={gridType}
          setGridType={setGridType}
          onSubmit={handleSubmit}
          isEvaluating={isEvaluating}
          strokeCount={strokeCount}
        />

        <DrawingCanvas
          ref={canvasRef}
          tool={tool}
          color={color}
          brushSize={brushSize}
          guides={lesson.guides}
          showGuides={showGuides}
          gridType={gridType}
          onStrokeChange={handleStrokeChange}
        />
      </div>

      {/* Victory / Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        critique={critique}
        xpEarned={lesson.xp}
        onRetry={handleRetry}
        onNext={handleNext}
        hasNext={!!nextLessonId}
      />
    </div>
  );
};
