import { notFound } from 'next/navigation';
import { getLessonById, CURRICULUM } from '@/data/curriculum';
import { LessonRunner } from '@/components/Lesson/LessonRunner';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return CURRICULUM.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      id: lesson.id,
    }))
  );
}

export default function LessonPage({ params }: LessonPageProps) {
  const lesson = getLessonById(params.id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="py-2">
      <LessonRunner lesson={lesson} />
    </div>
  );
}
