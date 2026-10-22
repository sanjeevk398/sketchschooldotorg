import getStroke from 'perfect-freehand';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  size: number;
  tool: 'pen' | 'pencil' | 'eraser';
}

/**
 * Converts array of 2D points into an SVG path data string using perfect-freehand
 */
export function getSvgPathFromStroke(stroke: Stroke): string {
  if (stroke.points.length === 0) return '';

  const rawPoints = stroke.points.map((p) => [p.x, p.y, p.pressure ?? 0.5]);
  const outlinePoints = getStroke(rawPoints, {
    size: stroke.size,
    thinning: stroke.tool === 'pencil' ? 0.3 : 0.6,
    smoothing: 0.5,
    streamline: 0.55,
  });

  if (outlinePoints.length === 0) return '';

  const path = outlinePoints.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...outlinePoints[0], 'Q']
  );

  path.push('Z');
  return path.join(' ');
}

/**
 * Render all strokes on an HTML5 2D canvas context
 */
export function renderStrokesToCanvas(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  for (const stroke of strokes) {
    if (stroke.points.length < 2) continue;

    ctx.save();
    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#ffffff';
    } else if (stroke.tool === 'pencil') {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = stroke.color;
    } else {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = stroke.color;
    }

    const pathString = getSvgPathFromStroke(stroke);
    if (pathString) {
      const path2d = new Path2D(pathString);
      ctx.fill(path2d);
    }
    ctx.restore();
  }

  ctx.restore();
}
