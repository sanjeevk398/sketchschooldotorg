# SketchSchool.org ✏️
> The AI-Powered Interactive Drawing Tutor ("Duolingo for Drawing")

SketchSchool is an open, interactive web application designed to teach anyone how to draw through step-by-step micro-drills on a digital canvas with real-time AI stroke evaluation.

---

## 🌟 Key Features

1. **Dual-Tier Stroke Evaluation Engine**:
   - **Tier 1 (Instant Client Heuristics)**: 0ms latency stroke smoothness, line straightness, jitter calculation, and bounding shape analysis running directly in browser JavaScript.
   - **Tier 2 (Multimodal AI Vision Critique)**: Evaluates overall 3D volume, perspective convergence, proportions, and shading using Google Gemini Vision with constructive art mentor feedback.
2. **Interactive HTML5 Drawing Canvas**:
   - Dynamic stroke smoothing and natural ink flow via `perfect-freehand`.
   - Native pressure sensitivity for Apple Pencil, Samsung S-Pen, and Wacom styluses.
   - Undo, Redo, Clear, Inking Pen, Soft Pencil, and Eraser modes.
   - Toggleable **Ghost Guides** (vector scaffolding) and grid systems.
3. **Gamification & Habit System**:
   - Duolingo-style Skill Tree with unlockable units.
   - Daily Practice Streaks (🔥), XP counters (⚡), and Energy/Hearts (❤️).
   - Star ratings (1 to 3 stars) with victory confetti celebrations.
4. **Frictionless Zero-Auth Onboarding**:
   - New visitors can jump straight into Lesson 1 without signing up. Progress is automatically persisted in `localStorage`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` if you want multimodal vision AI evaluations. If omitted, SketchSchool will automatically use its built-in geometric heuristic engine.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to `sketchschool.org`

### Option A: Vercel (Recommended)
1. Push your code to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Project Settings > Domains**, enter `sketchschool.org` and `www.sketchschool.org`.
4. Update your domain DNS records at your registrar (GoDaddy, Namecheap, Google Domains, Cloudflare):
   - **A Record**: `@` points to `76.76.21.21`
   - **CNAME Record**: `www` points to `cname.vercel-dns.com`

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/critique/      # Serverless AI Vision critique endpoint
│   │   ├── learn/             # Duolingo-style skill tree path
│   │   ├── lesson/[id]/       # Dynamic interactive lesson runner
│   │   ├── layout.tsx         # App wrapper, Navbar & metadata
│   │   └── page.tsx           # High-conversion landing page
│   ├── components/
│   │   ├── Canvas/            # Drawing canvas, toolbar & ghost guides
│   │   ├── Lesson/            # Reference panel, feedback modal & runner
│   │   ├── Gamification/      # Skill tree, streak badges & XP bars
│   │   └── Navbar.tsx         # Sticky header with real-time stats
│   ├── data/
│   │   └── curriculum.ts      # Lessons, instructions, guides & rubrics
│   └── lib/
│       ├── canvas-utils.ts    # Stroke rendering & perfect-freehand integration
│       ├── heuristics.ts      # Client-side math & geometry analysis
│       └── storage.ts         # LocalStorage persistence & levels
```
