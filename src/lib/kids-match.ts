/**
 * Kids Letter & Number Match Accuracy Engine
 * Rasterizes character glyphs into target checkpoints and evaluates
 * real-time drawing coverage against the letter outline.
 */

export interface TargetPoint {
  x: number;
  y: number;
}

/**
 * Extracts normalized target sample points from a character glyph using offscreen canvas
 */
export function extractGlyphTargetPoints(
  char: string,
  width: number,
  height: number,
  subChar?: string
): TargetPoint[] {
  if (typeof window === 'undefined') return [];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  // Draw background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw character glyph in black
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.min(width * 0.55, 270);
  ctx.font = `900 ${fontSize}px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

  const centerY = subChar ? height / 2 - 25 : height / 2;
  ctx.fillText(char, width / 2, centerY);

  if (subChar) {
    ctx.font = `bold ${fontSize * 0.35}px "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(subChar, width / 2, height / 2 + fontSize * 0.42);
  }

  // Sample pixels on a coarse grid for fast 0ms computation
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const step = 14; // Sample every 14 pixels
  const points: TargetPoint[] = [];

  for (let y = 10; y < height - 10; y += step) {
    for (let x = 10; x < width - 10; x += step) {
      const idx = (y * width + x) * 4;
      // If pixel is dark (black glyph)
      if (data[idx] < 120) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

/**
 * Calculates what percentage of the character's target points
 * have been drawn over by the child's strokes within a forgiving hit-radius.
 */
export function calculateMatchPercentage(
  targetPoints: TargetPoint[],
  strokePoints: Array<{ x: number; y: number }>,
  hitRadius: number = 32
): {
  percentage: number;
  coveredPointsCount: number;
  totalPointsCount: number;
  uncoveredPoints: TargetPoint[];
} {
  if (targetPoints.length === 0) {
    return { percentage: 0, coveredPointsCount: 0, totalPointsCount: 0, uncoveredPoints: [] };
  }

  if (strokePoints.length === 0) {
    return {
      percentage: 0,
      coveredPointsCount: 0,
      totalPointsCount: targetPoints.length,
      uncoveredPoints: [...targetPoints],
    };
  }

  const radiusSquared = hitRadius * hitRadius;
  let coveredCount = 0;
  const uncovered: TargetPoint[] = [];

  for (const tp of targetPoints) {
    let hit = false;
    for (const sp of strokePoints) {
      const dx = sp.x - tp.x;
      const dy = sp.y - tp.y;
      if (dx * dx + dy * dy <= radiusSquared) {
        hit = true;
        break;
      }
    }
    if (hit) {
      coveredCount++;
    } else {
      uncovered.push(tp);
    }
  }

  const percentage = Math.min(100, Math.round((coveredCount / targetPoints.length) * 100));

  return {
    percentage,
    coveredPointsCount: coveredCount,
    totalPointsCount: targetPoints.length,
    uncoveredPoints: uncovered,
  };
}
