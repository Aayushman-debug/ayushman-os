/**
 * soundEngine.ts — Cyberpunk Web Audio Synthesizer
 *
 * Zero external audio files! Uses native Web Audio API oscillators,
 * noise generators, and biquad filters to produce procedural sci-fi audio.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isAmbienceRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /** Short click for typewriter text reveal */
  public playTypewriter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.025);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.025);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /** Cyber chirp for dialog advance or UI click */
  public playClick(freq = 900) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.05);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  /** Futuristic terminal boot sweep */
  public playTerminalOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const chords = [300, 450, 600, 900];

      chords.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + i * 0.04 + 0.15);

        gain.gain.setValueAtTime(0.03, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.15);
      });
    } catch {}
  }

  /** Low sci-fi power-down for terminal close */
  public playTerminalClose() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch {}
  }

  /** Soft synthetic footsteps */
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 40, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  /** Procedural cyberpunk city ambient hum (low synth drone + filtered neon resonance) */
  public startAmbience() {
    if (this.isAmbienceRunning) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const t = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.06, t);
      this.ambientGain.connect(this.masterGain);

      // Low sub drone (55Hz / A1)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, t);

      // Warm 5th harmonic (82.4Hz / E2)
      const fifthOsc = this.ctx.createOscillator();
      fifthOsc.type = 'triangle';
      fifthOsc.frequency.setValueAtTime(82.4, t);

      // Filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, t);

      subOsc.connect(filter);
      fifthOsc.connect(filter);
      filter.connect(this.ambientGain);

      subOsc.start(t);
      fifthOsc.start(t);

      this.isAmbienceRunning = true;
    } catch {}
  }

  public stopAmbience() {
    if (!this.isAmbienceRunning || !this.ambientGain || !this.ctx) return;
    try {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        this.isAmbienceRunning = false;
      }, 500);
    } catch {}
  }
}

export const sound = new SoundEngine();
