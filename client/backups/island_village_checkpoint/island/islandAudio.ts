/**
 * islandAudio.ts — Tropical Island Web Audio Synthesizer
 *
 * Zero external audio files! Synthesizes:
 * - Ocean waves ambient whoosh (filtered white noise modulated by slow LFO)
 * - Soft footsteps on grass (muffled rustle) and sand
 * - Playful jump "boing" / bounce
 * - Pleasant island chime on interactions
 */

class IslandAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oceanGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isAmbiencePlaying: boolean = false;

  private init() {
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

  /** Soft grass footstep */
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      // Soft low thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90 + Math.random() * 25, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.06);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }

  /** Cheerful jump sound */
  public playJump() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  /** Friendly island bell chime for interactions */
  public playChime(freq = 659.25) { // E5 note
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      [freq, freq * 1.5].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.08);

        gain.gain.setValueAtTime(0.06, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.35);
      });
    } catch {}
  }

  /** Bright collectible star pickup fanfare */
  public playCollectible() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      // Arpeggio notes: C5 (523), E5 (659), G5 (784), C6 (1046)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.07);

        gain.gain.setValueAtTime(0.08, t + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t + idx * 0.07);
        osc.stop(t + idx * 0.07 + 0.4);
      });
    } catch {}
  }

  /** Warm wooden door entrance sound */
  public playDoor() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      // Creak
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.12);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.15);

      // Latch click
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(480, t + 0.12);
      clickGain.gain.setValueAtTime(0.05, t + 0.12);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      click.connect(clickGain);
      clickGain.connect(this.masterGain);

      click.start(t + 0.12);
      click.stop(t + 0.18);
    } catch {}
  }

  /** Cute animal-crossing style dialogue blip */
  public playTalk(pitchOffset = 0) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 420 + pitchOffset * 40 + Math.random() * 50;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, t + 0.05);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }

  /** Start natural ocean breeze ambient wash */
  public startAmbience() {
    if (this.isAmbiencePlaying) return;
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for gentle surf
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Low frequency oscillator for wave cycle (swell every ~6 seconds)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.16, this.ctx.currentTime); // ~6s period

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.oceanGain = this.ctx.createGain();
      this.oceanGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.oceanGain);
      this.oceanGain.connect(this.masterGain);

      whiteNoise.start();
      lfo.start();
      this.isAmbiencePlaying = true;
    } catch {}
  }

  public stopAmbience() {
    if (this.oceanGain && this.ctx) {
      try {
        this.oceanGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.isAmbiencePlaying = false;
        }, 300);
      } catch {}
    }
  }
}

export const islandAudio = new IslandAudioEngine();
