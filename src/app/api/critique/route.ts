import { NextRequest, NextResponse } from 'next/server';
import { getLessonById } from '@/data/curriculum';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, imageBase64, heuristicResult } = body;

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, perform Multimodal Vision analysis
    if (apiKey && imageBase64) {
      try {
        const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const prompt = `You are an encouraging, expert art teacher at SketchSchool.org grading a beginner's interactive sketch exercise.
Lesson: "${lesson.title}" (${lesson.subtitle}).
Lesson Goal: "${lesson.evaluationCriteria.aiPromptGoal}".
Heuristic stats: Stroke count: ${heuristicResult?.details?.strokeCount || 'N/A'}, Straightness/Curve score: ${heuristicResult?.score || 'N/A'}.

Please critique the sketch image carefully. Output strictly valid JSON with this exact schema:
{
  "score": <number between 50 and 98>,
  "stars": <integer 1, 2, or 3>,
  "lineQuality": "<short phrase on line confidence and smoothness>",
  "proportions": "<short phrase on proportion, alignment, and scale>",
  "perspective": "<short phrase on volume, 3D depth or spatial orientation>",
  "mentorTip": "<1-2 sentences of specific, actionable advice for their next stroke>",
  "encouragement": "<1 short enthusiastic praise sentence>"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: 'image/png',
                        data: base64Clean,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              source: 'gemini-vision',
              ...parsed,
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini Vision API fallback triggered:', geminiErr);
      }
    }

    // Contextual intelligent heuristic fallback (zero config, works out of the box)
    const clientScore = heuristicResult?.score || 80;
    const clientStars = heuristicResult?.stars || 2;
    const clientTip = heuristicResult?.feedback || 'Good work keeping the lines fluid!';

    let mentorTip = clientTip;
    let encouragement = "Great effort! You're building genuine muscle memory.";

    if (clientStars === 3) {
      encouragement = "Fantastic work! That stroke has the confidence of a pro.";
      if (lesson.id === 'confident-straight-line') {
        mentorTip = "Your line acceleration was spot on. Notice how moving quickly eliminates jitter!";
      } else if (lesson.id === 'smooth-ellipses') {
        mentorTip = "Even curves all around and great closure. Your shoulder pivot is paying off.";
      } else if (lesson.id === 'perspective-cube') {
        mentorTip = "Clean vanishing lines! Your parallel verticals keep the box standing tall.";
      }
    } else {
      if (lesson.id === 'confident-straight-line') {
        mentorTip = "Try ghosting the movement above the screen once before touching down. Accelerate smoothly without stopping.";
      } else if (lesson.id === 'smooth-ellipses') {
        mentorTip = "Keep your wrist locked and draw through the ellipse twice in one fluid motion.";
      } else if (lesson.id === 'perspective-cube') {
        mentorTip = "Check your back horizontal line: make sure it stays strictly parallel to the front edge.";
      }
    }

    return NextResponse.json({
      source: 'heuristic-engine',
      score: clientScore,
      stars: clientStars,
      lineQuality: clientScore >= 85 ? 'Confident & Fluid' : 'Good steady attempt',
      proportions: 'Well balanced within target bounds',
      perspective: lesson.unitId === 'unit-2' ? 'Clear 3D depth established' : 'Accurate 2D orientation',
      mentorTip,
      encouragement,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to evaluate sketch' },
      { status: 500 }
    );
  }
}
