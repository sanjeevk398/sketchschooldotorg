import { Stroke, Point } from './canvas-utils';
import { Lesson } from '../data/curriculum';

export interface HeuristicResult {
  passed: boolean;
  score: number; // 0 - 100
  stars: number; // 1 - 3
  feedback: string;
  details: {
    lineConfidence?: string;
    strokeCount: number;
    straightnessRatio?: number;
    closureRatio?: number;
  };
}

function distance(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function calculateStrokeArcLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
  }
  return length;
}

/**
 * Evaluates line straightness (chord distance vs arc length)
 */
export function evaluateLineStraightness(stroke: Stroke): { ratio: number; confidence: string } {
  if (stroke.points.length < 2) return { ratio: 0, confidence: 'Too short' };

  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const chordDist = distance(start, end);
  const arcLength = calculateStrokeArcLength(stroke.points);

  if (arcLength === 0) return { ratio: 0, confidence: 'Too short' };

  // Ratio of 1.0 is a perfectly straight line
  const ratio = Math.min(1.0, chordDist / arcLength);

  let confidence = 'Wobbly or hesitant';
  if (ratio > 0.96) {
    confidence = 'Exceptional, razor-sharp straight line!';
  } else if (ratio > 0.90) {
    confidence = 'Great confident stroke with minimal hesitation.';
  } else if (ratio > 0.82) {
    confidence = 'Good attempt, but notice some wobble in the middle.';
  }

  return { ratio, confidence };
}

/**
 * Evaluates circle / ellipse roundness and closure
 */
export function evaluateCircleRoundness(stroke: Stroke): { score: number; closureRatio: number } {
  if (stroke.points.length < 10) return { score: 40, closureRatio: 0 };

  const xs = stroke.points.map((p) => p.x);
  const ys = stroke.points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  // Aspect ratio check (1.0 = perfect circle, 0.5-0.9 = ellipse)
  const aspect = Math.min(width, height) / Math.max(width, height);

  // Closure check: distance between first and last point
  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const gap = distance(start, end);
  const perimeterApprox = (width + height) * Math.PI / 2;
  const closureRatio = Math.max(0, 1 - gap / perimeterApprox);

  const score = Math.round((aspect * 0.5 + closureRatio * 0.5) * 100);
  return { score, closureRatio };
}

/**
 * Main Tier-1 Heuristic Evaluator
 */
export function evaluateSketchLocally(strokes: Stroke[], lesson: Lesson): HeuristicResult {
  const drawingStrokes = strokes.filter((s) => s.tool !== 'eraser' && s.points.length > 2);

  if (drawingStrokes.length === 0) {
    return {
      passed: false,
      score: 0,
      stars: 0,
      feedback: 'Canvas is empty! Draw your strokes according to the lesson goal before checking.',
      details: { strokeCount: 0 }
    };
  }

  const { heuristicType, minStrokes, maxStrokes } = lesson.evaluationCriteria;

  if (drawingStrokes.length < minStrokes) {
    return {
      passed: false,
      score: 30,
      stars: 1,
      feedback: `You need at least ${minStrokes} stroke(s) for this exercise. Complete the full shape!`,
      details: { strokeCount: drawingStrokes.length }
    };
  }

  if (maxStrokes && drawingStrokes.length > maxStrokes) {
    return {
      passed: true,
      score: 70,
      stars: 2,
      feedback: `Good effort, but try to use fewer strokes (${drawingStrokes.length} used). Aim for ${maxStrokes} confident, continuous stroke(s) instead of redrawing!`,
      details: { strokeCount: drawingStrokes.length }
    };
  }

  if (heuristicType === 'line_straightness') {
    const mainStroke = drawingStrokes[0];
    const { ratio, confidence } = evaluateLineStraightness(mainStroke);
    const score = Math.round(ratio * 100);
    const stars = score >= 92 ? 3 : score >= 84 ? 2 : 1;

    return {
      passed: score >= 75,
      score,
      stars,
      feedback: confidence,
      details: {
        strokeCount: drawingStrokes.length,
        straightnessRatio: ratio,
        lineConfidence: confidence,
      }
    };
  }

  if (heuristicType === 'circle_roundness') {
    const mainStroke = drawingStrokes[0];
    const { score, closureRatio } = evaluateCircleRoundness(mainStroke);
    const stars = score >= 80 ? 3 : score >= 65 ? 2 : 1;

    return {
      passed: score >= 55,
      score,
      stars,
      feedback:
        score >= 80
          ? 'Beautiful, fluid curve with great roundness!'
          : 'Nice circular flow. Remember to keep your arm moving continuously to avoid flat spots.',
      details: {
        strokeCount: drawingStrokes.length,
        closureRatio,
      }
    };
  }

  // General freehand or multi-stroke shapes (boxes, cylinders, mugs)
  const baseScore = Math.min(95, 60 + drawingStrokes.length * 5);
  return {
    passed: true,
    score: baseScore,
    stars: baseScore >= 85 ? 3 : 2,
    feedback: 'Great construction! The primary proportions and depth lines are clearly established.',
    details: {
      strokeCount: drawingStrokes.length,
    }
  };
}
