/**
 * Sovereign of the Seas: Empire & Admiralty
 * Procedural Web Audio API Sound Engine
 * Synthesizes Authentic 18th-Century Naval Warfare Acoustics:
 * Heavy 32-Pounder Cannon Broadsides, Timber Splintering, Ocean Swell, Ship Bells & Martial Fanfare
 */

class AdmiraltyAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientGain = null;
    this.ambientOsc = null;
    this.ambientNoise = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.enabled ? 0.08 : 0, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.enabled;
  }

  // --- 1. Authentic Rolling Cannon Broadside (دوي نيران المدافع الملكية) ---
  playBroadside(gunCount = 6, intensity = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const count = Math.min(Math.max(gunCount, 3), 12);
    // Stagger cannons for realistic rolling broadside ("Fire as you bear!")
    for (let i = 0; i < count; i++) {
      const delay = (i * 0.045) + (Math.random() * 0.035);
      setTimeout(() => {
        this.playSingleCannon(intensity * (0.85 + Math.random() * 0.3));
      }, delay * 1000);
    }
  }

  playSingleCannon(volume = 1.0) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass thump (Body punch)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

    oscGain.gain.setValueAtTime(0.7 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);

    // Black powder explosion crack (Filtered noise)
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 400, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.5);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9 * volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.6);
  }

  // --- 2. Timber Splinter & Hull Impact (تحطم ألواح البلوط بقذائف العدو) ---
  playTimberCrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sharp crunch
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.Q.setValueAtTime(3.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.4);
  }

  // --- 3. Cannonball Water Splash (ارتطام القذيفة في ماء البحر) ---
  playWaterSplash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.5);
  }

  // --- 4. Ship's Brass Bell (جرس السفينة الملكي للتأهب) ---
  playShipBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Harmonic bell tones
    const freqs = [1046.5, 2093, 3135.9]; // C6 and overtones
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = (0.35 / (idx + 1));
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  // --- 5. Boarding Horn / Charge Call (بوق الاقتحام والالتحام) ---
  playBoardingHorn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = [293.66, 369.99, 440.0, 587.33]; // D major brass fanfarillo
    notes.forEach((freq, idx) => {
      const startT = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.2, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.28);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startT);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.3);
    });
  }

  // --- 6. Royal Victory Fanfare (نغمة النصر الملكي البريطاني "Rule Britannia" Motif) ---
  playVictoryFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Classic triumphant cadence
    const melody = [
      { f: 523.25, d: 0.25 }, // C5
      { f: 587.33, d: 0.25 }, // D5
      { f: 659.25, d: 0.35 }, // E5
      { f: 523.25, d: 0.25 }, // C5
      { f: 783.99, d: 0.55 }, // G5
      { f: 659.25, d: 0.30 }, // E5
      { f: 1046.5, d: 0.80 }  // C6 (Triumph)
    ];

    let t = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + note.d);

      t += note.d + 0.05;
    });
  }

  // --- 7. Ambient Ocean & Sea Wind Soundscape ---
  startAmbientSea() {
    if (this.isAmbientPlaying || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      this.ambientNoise = this.ctx.createBufferSource();
      this.ambientNoise.buffer = buffer;
      this.ambientNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

      this.ambientNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNoise.start();
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Audio Ambient init error', e);
    }
  }

  stopAmbientSea() {
    if (this.ambientNoise && this.isAmbientPlaying) {
      try {
        this.ambientNoise.stop();
        this.isAmbientPlaying = false;
      } catch (e) {}
    }
  }
}

window.AdmiraltyAudio = new AdmiraltyAudioEngine();
