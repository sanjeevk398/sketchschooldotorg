import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, Zap, Flame, ShieldCheck, Heart, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>The &quot;Duolingo for Drawing&quot; is here</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Master drawing with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500">
            instant AI critique
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Stop watching passive tutorials. Draw directly on the interactive canvas, train your muscle memory with 3-minute drills, and receive real-time coaching on every stroke.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/lesson/confident-straight-line"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-extrabold text-base shadow-lg shadow-orange-500/30 transition-all"
          >
            <span>Start Lesson 1 (Free)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/kids"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-amber-950 font-black text-base shadow-lg shadow-amber-400/25 transition-all"
          >
            <span>Kids Corner 🧸 (ABC, हिंदी, 123)</span>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Stylus & Touch ready
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free & Open
          </span>
        </div>
      </section>

      {/* Kids Corner Showcase Banner */}
      <section className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
            <span>🧸 New: SketchSchool Junior</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Kids Tracing & Phonics Suite
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
            Designed for young learners aged 3–8: trace English alphabets (A–Z), Hindi Varnamala (स्वर व व्यंजन), and numbers (1–10 & १–१०) with rainbow magic ink, phonics audio, and collectible stickers!
          </p>
        </div>

        <Link
          href="/kids"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-amber-950 hover:bg-amber-50 active:scale-95 font-black text-sm shadow-md transition-all"
        >
          <span>Explore Kids Corner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Feature Showcase Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Dual-Tier AI Feedback</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get instant client-side straightness and jitter calculations, paired with deep multimodal AI vision critique on proportions and vanishing perspective.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Habit-Forming Streaks</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Short, focused 3-to-5 minute daily drills designed to fit into your morning coffee routine. Earn XP, maintain streaks, and level up from novice to master.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Dynamic Ghost Guides</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scaffold your hand motion with ghosted silhouettes, target connection dots, and 1-point and 2-point perspective grids that guide you toward master-level form.
          </p>
        </div>
      </section>
    </div>
  );
}
