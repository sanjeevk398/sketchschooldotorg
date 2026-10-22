export interface GuideLine {
  type: 'line' | 'circle' | 'rect' | 'point';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  w?: number;
  h?: number;
  label?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  unitTitle: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  durationMinutes: number;
  description: string;
  instructions: string[];
  tips: string[];
  guides: GuideLine[];
  referenceSvg?: string;
  evaluationCriteria: {
    minStrokes: number;
    maxStrokes?: number;
    targetAspectRatio?: number;
    heuristicType: 'line_straightness' | 'circle_roundness' | 'box_perspective' | 'cylinder_symmetry' | 'freehand';
    aiPromptGoal: string;
  };
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  badge: string;
  lessons: Lesson[];
}

export const CURRICULUM: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'The Foundation: Motor Control & Lines',
    description: 'Train your arm muscles, eliminate wobbly hand jitter, and draw confident strokes.',
    badge: '✏️ Line Apprentice',
    lessons: [
      {
        id: 'confident-straight-line',
        unitId: 'unit-1',
        unitTitle: 'Unit 1: The Foundation',
        title: 'The Confident Line',
        subtitle: 'Connect dots with swift, unbroken arm movements',
        difficulty: 'Beginner',
        xp: 50,
        durationMinutes: 3,
        description: 'Beginners tend to sketch with hairy, chicken-scratch wrist strokes. Professional artists draw with their elbow and shoulder in one swift, confident motion.',
        instructions: [
          'Ghost your stroke 2–3 times in the air above the two target dots.',
          'Place your stylus/cursor on the green Start dot.',
          'In one quick, smooth acceleration, draw a continuous straight stroke directly to the red End dot.',
          'Do not pause or redraw over the line!'
        ],
        tips: [
          'Lock your wrist and pivot from your shoulder.',
          'Speed creates straightness: moving too slowly causes hand tremors.'
        ],
        guides: [
          { type: 'point', cx: 120, cy: 300, label: 'Start (A)' },
          { type: 'point', cx: 580, cy: 300, label: 'Target (B)' },
          { type: 'line', x1: 120, y1: 300, x2: 580, y2: 300, label: 'Ghost Target' }
        ],
        evaluationCriteria: {
          minStrokes: 1,
          maxStrokes: 3,
          heuristicType: 'line_straightness',
          aiPromptGoal: 'Check if the student drew a single confident straight line connecting the two points without hesitation, wobble, or multiple chicken-scratch strokes.'
        }
      },
      {
        id: 'smooth-ellipses',
        unitId: 'unit-1',
        unitTitle: 'Unit 1: The Foundation',
        title: 'Smooth Ellipses & Circles',
        subtitle: 'Master continuous curves without flattening corners',
        difficulty: 'Beginner',
        xp: 60,
        durationMinutes: 4,
        description: 'Circles and ellipses are the building blocks of cylinders, wheels, eyes, and heads. The key is smooth circular rhythm.',
        instructions: [
          'Hover your pen and make 2 circular practice motions above the canvas.',
          'Drop the pen down while keeping the circular rhythm going.',
          'Close the circle in 1 or 2 continuous loops inside the bounding box.',
          'Keep your corners rounded and avoid flat diamond edges.'
        ],
        tips: [
          'Keep a loose, relaxed grip on your pen or stylus.',
          'Draw through the shape twice to build muscle memory.'
        ],
        guides: [
          { type: 'rect', x1: 200, y1: 150, w: 300, h: 300, label: 'Bounding Box' },
          { type: 'circle', cx: 350, cy: 300, r: 140, label: 'Target Ellipse' }
        ],
        evaluationCriteria: {
          minStrokes: 1,
          maxStrokes: 4,
          heuristicType: 'circle_roundness',
          aiPromptGoal: 'Evaluate the roundness, smoothness, and aspect ratio of the drawn ellipse. Look for smooth curvature and closed perimeter.'
        }
      },
      {
        id: 'cross-hatching',
        unitId: 'unit-1',
        unitTitle: 'Unit 1: The Foundation',
        title: 'Rhythmic Cross-Hatching',
        subtitle: 'Control spacing, parallel alignment, and shading density',
        difficulty: 'Beginner',
        xp: 75,
        durationMinutes: 5,
        description: 'Hatching creates texture, shadow, and tone. Drawing parallel lines at equal distances tests your fine motor spacing control.',
        instructions: [
          'Draw 5 to 8 diagonal parallel lines from top-right to bottom-left.',
          'Next, draw another set crossing over them from top-left to bottom-right.',
          'Keep the spacing between strokes even and uniform.'
        ],
        tips: [
          'Lift your pen completely between each stroke.',
          'Maintain the same 45-degree angle throughout each set.'
        ],
        guides: [
          { type: 'rect', x1: 220, y1: 180, w: 260, h: 240, label: 'Hatch Zone' }
        ],
        evaluationCriteria: {
          minStrokes: 6,
          heuristicType: 'freehand',
          aiPromptGoal: 'Verify that the student created clean, rhythmic cross-hatching with consistent spacing and angle inside the zone.'
        }
      }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    title: '3D Form & Perspective: Thinking in Volumes',
    description: 'Transform flat 2D shapes into solid 3-dimensional objects that jump off the screen.',
    badge: '📦 Volume Master',
    lessons: [
      {
        id: 'perspective-cube',
        unitId: 'unit-2',
        unitTitle: 'Unit 2: 3D Form & Perspective',
        title: 'The 1-Point Perspective Cube',
        subtitle: 'Construct a 3D box with converging depth lines',
        difficulty: 'Intermediate',
        xp: 100,
        durationMinutes: 6,
        description: 'Every complex object—cars, buildings, computers—starts as a simple box. Mastering the 3D cube is the gateway to realistic sketching.',
        instructions: [
          'Step 1: Draw the front square face of the cube.',
          'Step 2: Draw orthogonal depth lines extending back toward the vanishing point.',
          'Step 3: Cap the back edge with horizontal and vertical parallel lines.'
        ],
        tips: [
          'Remember: lines parallel in real life converge toward the horizon in perspective!',
          'Draw the hidden back edges lightly as if the box were made of glass.'
        ],
        guides: [
          { type: 'point', cx: 580, cy: 160, label: 'Vanishing Point (VP)' },
          { type: 'line', x1: 50, y1: 160, x2: 650, y2: 160, label: 'Horizon Line' },
          { type: 'rect', x1: 160, y1: 240, w: 180, h: 180, label: 'Front Face Guide' }
        ],
        evaluationCriteria: {
          minStrokes: 4,
          heuristicType: 'box_perspective',
          aiPromptGoal: 'Analyze whether the student successfully constructed a 3D box with clear depth, parallel edges, and proper convergence toward the vanishing area.'
        }
      },
      {
        id: '3d-cylinder',
        unitId: 'unit-2',
        unitTitle: 'Unit 2: 3D Form & Perspective',
        title: 'The 3D Cylinder',
        subtitle: 'Combine ellipses and straight lines for organic volumes',
        difficulty: 'Intermediate',
        xp: 110,
        durationMinutes: 5,
        description: 'Arms, legs, trees, bottles, and architectural pillars are all based on cylinders.',
        instructions: [
          'Draw the top ellipse (remember: perspective makes it look flatter).',
          'Drop two parallel vertical lines down from the widest points (the tangents).',
          'Draw the curved bottom ellipse matching the curve of the top.'
        ],
        tips: [
          'Avoid drawing a flat line at the bottom! The bottom curve must curve downwards to maintain 3D volume.'
        ],
        guides: [
          { type: 'circle', cx: 350, cy: 180, r: 90, label: 'Top Rim' },
          { type: 'line', x1: 260, y1: 180, x2: 260, y2: 420, label: 'Left Side' },
          { type: 'line', x1: 440, y1: 180, x2: 440, y2: 420, label: 'Right Side' }
        ],
        evaluationCriteria: {
          minStrokes: 3,
          heuristicType: 'cylinder_symmetry',
          aiPromptGoal: 'Evaluate the cylinder: round top rim, parallel sides, and properly curved bottom base.'
        }
      }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Light, Shadow & Everyday Objects',
    description: 'Add depth and realism with illumination, core shadows, and real objects.',
    badge: '☕ Real-World Artist',
    lessons: [
      {
        id: 'coffee-mug',
        unitId: 'unit-3',
        unitTitle: 'Unit 3: Real Objects',
        title: 'Drawing a Ceramic Coffee Mug',
        subtitle: 'Synthesize cylinder, handle curve, and rim thickness',
        difficulty: 'Intermediate',
        xp: 150,
        durationMinutes: 8,
        description: 'Put all your skills together! Combine a cylinder volume, an inner depth rim, and a sturdy 3D handle.',
        instructions: [
          'Sketch the primary cylinder body of the mug.',
          'Add the inner rim curve to give the ceramic thickness.',
          'Attach a C-shaped handle with double-thickness lines.',
          'Add light hatching on the shadow side opposite your imagined light source.'
        ],
        tips: [
          'Notice how the handle attaches at 90 degrees to the mug body.',
          'Keep your construction lines light, then darken the silhouette.'
        ],
        guides: [],
        evaluationCriteria: {
          minStrokes: 5,
          heuristicType: 'freehand',
          aiPromptGoal: 'Evaluate the coffee mug drawing: cylindrical body, inner rim depth, believable handle attachment, and overall proportion.'
        }
      }
    ]
  }
];

export function getLessonById(id: string): Lesson | undefined {
  for (const unit of CURRICULUM) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getNextLessonId(currentId: string): string | null {
  const allLessons = CURRICULUM.flatMap((u) => u.lessons);
  const idx = allLessons.findIndex((l) => l.id === currentId);
  if (idx !== -1 && idx < allLessons.length - 1) {
    return allLessons[idx + 1].id;
  }
  return null;
}
