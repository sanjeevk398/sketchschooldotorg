import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SketchSchool.org — The AI-Powered Interactive Drawing Tutor',
  description:
    'Learn to draw step-by-step with interactive canvas drills, real-time AI stroke analysis, and gamified daily lessons.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="w-full border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-semibold text-slate-700">
              SketchSchool<span className="text-orange-500">.org</span> — The Open Art Academy
            </div>
            <div className="text-slate-400">
              Interactive stroke training powered by Gemini Vision & Geometric AI.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
