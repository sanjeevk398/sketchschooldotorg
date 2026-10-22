/**
 * Web Audio API synthesized sound effects and Speech Synthesis for Kids Corner
 * Zero external audio files required — runs natively in any browser!
 */

class KidsAudio {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Joyful bubble pop sound when child begins a stroke
   */
  playPop() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Bright, cheerful chime when completing a stroke
   */
  playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Victory celebration fanfare when a full letter/number is completed!
   */
  playFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // C5, G4, C5, E5, G5
      const melody = [
        { freq: 523.25, time: 0.0, duration: 0.15 },
        { freq: 659.25, time: 0.15, duration: 0.15 },
        { freq: 783.99, time: 0.3, duration: 0.2 },
        { freq: 1046.5, time: 0.5, duration: 0.45 },
      ];

      melody.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.35, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Text-to-speech pronunciation for English or Hindi words
   */
  speak(text: string, lang: 'en' | 'hi' = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.85; // Slightly slower, clear voice for kids
      utterance.pitch = 1.15; // Friendly, slightly higher pitch

      // Attempt to pick a natural voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const targetLang = lang === 'hi' ? 'hi' : 'en';
        const match = voices.find((v) => v.lang.startsWith(targetLang));
        if (match) utterance.voice = match;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const kidsAudio = new KidsAudio();
