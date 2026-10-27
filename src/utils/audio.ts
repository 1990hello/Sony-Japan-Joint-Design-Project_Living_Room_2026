/**
 * Web Audio API synthesizer for adorable organic creature sounds,
 * crystal chimes, and ambient procedural cues without external audio files.
 */
import { SeasonalState } from "../types";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  // Seasonal ambience management
  private activeSeason: SeasonalState | null = null;
  private currentMasterGain: GainNode | null = null;
  private activeAmbienceNodes: Array<{ stop: () => void; gain: GainNode }> = [];
  private periodicInterval: number | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = this.ctx.sampleRate * 3; // 3 second loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Generate pink-ish noise for softer natural sound
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = lastOut * 0.92 + white * 0.08;
      data[i] = lastOut * 3.5;
    }
    this.noiseBuffer = buffer;
    return this.noiseBuffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.currentMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentMasterGain.gain.setValueAtTime(this.currentMasterGain.gain.value, now);
      this.currentMasterGain.gain.linearRampToValueAtTime(muted ? 0.0001 : 1.0, now + 0.3);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Cute rising chirp when Lumis greet or notice something
   */
  public playChirp(type: "greet" | "curious" | "happy" | "alert" = "greet") {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";

      if (type === "greet") {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      } else if (type === "curious") {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      } else if (type === "alert") {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1046, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      } else {
        // happy warble
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(990, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Satisfying pop sound when stuck Lumi is pulled out
   */
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  /**
   * Shimmering crystal water flow sound when waterfall starts
   */
  public playWaterfallChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C E G C E pentatonic
      notes.forEach((freq, i) => {
        const now = (this.ctx?.currentTime || 0) + i * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      });
    } catch {}
  }

  /**
   * Magical glass / orb resonance sound when pinch-calling or entering
   */
  public playOrbResonance() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 880, 1320].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.07 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {}
  }

  /**
   * Deep spatial whoosh when entering into the miniature orb world
   */
  public playOrbSpatialEnter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(220, now + 2.4);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(600, now + 2.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.6);

      // Harmonious crystal shimmer as threshold is crossed
      [659.25, 880, 1174.66, 1760].forEach((freq, idx) => {
        const chimeOsc = this.ctx!.createOscillator();
        const chimeGain = this.ctx!.createGain();
        const chimeStart = now + 1.1 + idx * 0.12;

        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(freq, chimeStart);
        chimeGain.gain.setValueAtTime(0.04, chimeStart);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeStart + 1.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx!.destination);
        chimeOsc.start(chimeStart);
        chimeOsc.stop(chimeStart + 1.3);
      });
    } catch {}
  }

  /**
   * Delicate crystal air chime when a seasonal swipe is accepted
   */
  public playSeasonalSwipeSound(direction: "next" | "prev" = "next") {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft wind-sweep whoosh
      const noise = this.ctx.createBufferSource();
      const buffer = this.getNoiseBuffer();
      if (buffer) {
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.setValueAtTime(1.5, now);
        if (direction === "next") {
          filter.frequency.setValueAtTime(450, now);
          filter.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
        } else {
          filter.frequency.setValueAtTime(1100, now);
          filter.frequency.exponentialRampToValueAtTime(450, now + 0.35);
        }
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + 0.5);
      }

      // Delicate sparkling chime note
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = "sine";
      const baseFreq = direction === "next" ? 880 : 784;
      chime.frequency.setValueAtTime(baseFreq, now);
      chime.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.25);
      chimeGain.gain.setValueAtTime(0.06, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chime.start(now);
      chime.stop(now + 0.42);
    } catch {}
  }

  /**
   * Procedural Seasonal Ambient Soundscapes with smooth crossfading
   */
  public setSeasonalAmbience(season: SeasonalState) {
    if (this.activeSeason === season) return;
    this.activeSeason = season;

    this.initCtx();
    if (!this.ctx) return;

    // Crossfade out previous ambience over 1.8s
    const oldNodes = [...this.activeAmbienceNodes];
    this.activeAmbienceNodes = [];
    if (this.periodicInterval) {
      window.clearInterval(this.periodicInterval);
      this.periodicInterval = null;
    }

    const fadeOutTime = this.ctx.currentTime + 1.8;
    oldNodes.forEach(({ gain, stop }) => {
      try {
        gain.gain.setValueAtTime(gain.gain.value, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, fadeOutTime);
        setTimeout(() => {
          stop();
        }, 1900);
      } catch {
        stop();
      }
    });

    // Ensure Master Gain exists
    if (!this.currentMasterGain) {
      this.currentMasterGain = this.ctx.createGain();
      this.currentMasterGain.gain.setValueAtTime(this.isMuted ? 0.0001 : 1.0, this.ctx.currentTime);
      this.currentMasterGain.connect(this.ctx.destination);
    }

    const now = this.ctx.currentTime;
    const isRainy =
      season === SeasonalState.SPRING_RAINY ||
      season === SeasonalState.SUMMER_RAINY ||
      season === SeasonalState.AUTUMN_RAINY ||
      season === SeasonalState.WINTER_RAINY;

    // 1. Weather Layer (Rain / Precipitation for rainy states)
    if (isRainy) {
      const rainNoise = this.ctx.createBufferSource();
      const buf = this.getNoiseBuffer();
      if (buf) {
        rainNoise.buffer = buf;
        rainNoise.loop = true;
        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = "lowpass";

        // Intensity differences based on season
        const rainCutoff =
          season === SeasonalState.SUMMER_RAINY
            ? 2400
            : season === SeasonalState.WINTER_RAINY
            ? 1100
            : 1800;
        rainFilter.frequency.setValueAtTime(rainCutoff, now);

        const rainGain = this.ctx.createGain();
        rainGain.gain.setValueAtTime(0.0001, now);
        rainGain.gain.linearRampToValueAtTime(
          season === SeasonalState.SUMMER_RAINY ? 0.055 : 0.04,
          now + 1.8
        );

        rainNoise.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(this.currentMasterGain);
        rainNoise.start(now);

        this.activeAmbienceNodes.push({
          gain: rainGain,
          stop: () => {
            try {
              rainNoise.stop();
              rainNoise.disconnect();
            } catch {}
          },
        });
      }
    }

    // 2. Wind / Breeze Layer
    const windNoise = this.ctx.createBufferSource();
    const windBuf = this.getNoiseBuffer();
    if (windBuf) {
      windNoise.buffer = windBuf;
      windNoise.loop = true;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = "bandpass";

      let targetFreq = 420;
      let targetQ = 1.8;
      let windVol = 0.035;

      if (season === SeasonalState.WINTER_SUNNY || season === SeasonalState.WINTER_RAINY) {
        targetFreq = 340;
        targetQ = 3.2; // hollow winter howl
        windVol = 0.05;
      } else if (season === SeasonalState.AUTUMN_SUNNY || season === SeasonalState.AUTUMN_RAINY) {
        targetFreq = 520;
        targetQ = 2.0; // crisp rustle
        windVol = 0.04;
      } else if (season === SeasonalState.SPRING_SUNNY) {
        targetFreq = 600;
        targetQ = 1.2; // soft warm breeze
        windVol = 0.025;
      }

      windFilter.frequency.setValueAtTime(targetFreq, now);
      windFilter.Q.setValueAtTime(targetQ, now);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.0001, now);
      windGain.gain.linearRampToValueAtTime(windVol, now + 1.8);

      windNoise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.currentMasterGain);
      windNoise.start(now);

      this.activeAmbienceNodes.push({
        gain: windGain,
        stop: () => {
          try {
            windNoise.stop();
            windNoise.disconnect();
          } catch {}
        },
      });
    }

    // 3. Seasonal Signature Accents
    if (season === SeasonalState.SPRING_SUNNY) {
      // Gentle periodic birdsong trill
      this.periodicInterval = window.setInterval(() => {
        if (this.isMuted || !this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(2200, t);
          osc.frequency.exponentialRampToValueAtTime(2800, t + 0.07);
          osc.frequency.exponentialRampToValueAtTime(3200, t + 0.16);
          g.gain.setValueAtTime(0.02, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.connect(g);
          g.connect(this.currentMasterGain!);
          osc.start(t);
          osc.stop(t + 0.25);
        } catch {}
      }, 5500);
    } else if (season === SeasonalState.SUMMER_SUNNY) {
      // Gentle summer cicada / cricket shimmer
      try {
        const cicadaOsc = this.ctx.createOscillator();
        const modOsc = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const cicadaGain = this.ctx.createGain();

        cicadaOsc.type = "sine";
        cicadaOsc.frequency.setValueAtTime(4600, now);

        modOsc.type = "sawtooth";
        modOsc.frequency.setValueAtTime(14, now); // 14Hz chirp flutter
        modGain.gain.setValueAtTime(0.015, now);

        modOsc.connect(cicadaGain.gain);
        cicadaGain.gain.setValueAtTime(0.0001, now);
        cicadaGain.gain.linearRampToValueAtTime(0.02, now + 1.8);

        cicadaOsc.connect(cicadaGain);
        cicadaGain.connect(this.currentMasterGain);

        cicadaOsc.start(now);
        modOsc.start(now);

        this.activeAmbienceNodes.push({
          gain: cicadaGain,
          stop: () => {
            try {
              cicadaOsc.stop();
              modOsc.stop();
              cicadaOsc.disconnect();
              modOsc.disconnect();
            } catch {}
          },
        });
      } catch {}
    } else if (season === SeasonalState.WINTER_SUNNY) {
      // Subdued crystalline tone
      try {
        const coldOsc = this.ctx.createOscillator();
        const coldGain = this.ctx.createGain();
        coldOsc.type = "sine";
        coldOsc.frequency.setValueAtTime(587.33, now); // D5
        coldGain.gain.setValueAtTime(0.0001, now);
        coldGain.gain.linearRampToValueAtTime(0.012, now + 1.8);

        coldOsc.connect(coldGain);
        coldGain.connect(this.currentMasterGain);
        coldOsc.start(now);

        this.activeAmbienceNodes.push({
          gain: coldGain,
          stop: () => {
            try {
              coldOsc.stop();
              coldOsc.disconnect();
            } catch {}
          },
        });
      } catch {}
    }
  }

  public stopSeasonalAmbience() {
    this.activeSeason = null;
    if (this.periodicInterval) {
      window.clearInterval(this.periodicInterval);
      this.periodicInterval = null;
    }
    const nodes = [...this.activeAmbienceNodes];
    this.activeAmbienceNodes = [];
    nodes.forEach(({ stop }) => stop());
  }
}

export const soundEngine = new SoundEngine();
