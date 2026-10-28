export const AudioEngine = {
  ctx: null,
  cache: {},
  ambientPlaying: false,
  ambientSource: null,
  ambientGain: null,
  ambientAudio: null,
  hopAudio: null,
  ambientNode: null,
  bulbHumNode: null,
  bulbHumAudio: null,
  bulbHumSource: null,
  bulbHumGain: null,
  bulbHumBuffer: null,
  bulbHumActive: false,
  hoverBuffer: null,
  lastHoverTime: 0,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  preload(files, basePath = '../audio/') {
    files.forEach(filename => {
      const path = basePath + filename;
      if (!this.cache[path]) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = path;
        this.cache[path] = audio;
      }
    });
  },

  playFileOrFallback(filename, fallbackFn, basePath = '../audio/login/', volume = 1) {
    const path = basePath + filename;
    let audio = this.cache[path];
    if (!audio) {
      audio = new Audio(path);
      audio.preload = 'auto';
      this.cache[path] = audio;
    }
    if (typeof volume === 'number') {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (typeof fallbackFn === 'function') {
          fallbackFn();
        }
      });
    }
  },

  playPadlockExpand(basePath = '../audio/login/') {
    this.playFileOrFallback('candado_expandir.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(55, now + 0.16);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.19);
    });
  },

  playKeyInsert(basePath = '../audio/login/') {
    this.playFileOrFallback('llave_insertar.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    });
  },

  playKeyTurn(basePath = '../audio/login/') {
    this.playFileOrFallback('llave_girar.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    });
  },

  playShake(basePath = '../audio/login/') {
    this.playFileOrFallback('candado_error.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    });
  },

  playUnlock(basePath = '../audio/login/') {
    this.playFileOrFallback('candado_desbloqueo.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.17);
    });
  },

  playGateOpen(basePath = '../audio/login/') {
    this.playFileOrFallback('verja_abrir.mp3', () => {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(40, now + 1.2);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  },

  playPadlockFall(basePath = '../audio/login/') {
    this.playFileOrFallback('candado_caida.mp3', () => {}, basePath);
  },

  playPadlockHop(basePath = '../audio/login/') {
    this.init();
    const path = basePath + 'candado_salto.mp3';
    let audio = this.cache[path];
    if (!audio) {
      audio = new Audio(path);
      this.cache[path] = audio;
    }
    this.hopAudio = audio;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      });
    }
  },

  stopPadlockHop() {
    if (this.hopAudio) {
      this.hopAudio.pause();
      this.hopAudio.currentTime = 0;
    }
  },

  playAmbientNight(basePath = '../audio/login/') {
    if (this.ambientPlaying) return;
    this.ambientPlaying = true;
    this.init();
    const ambientFile = 'ambiente_noche.ogg';
    if (this.ctx) {
      fetch(basePath + ambientFile)
        .then(res => res.arrayBuffer())
        .then(buf => this.ctx.decodeAudioData(buf))
        .then(decoded => {
          if (!this.ambientPlaying) return;
          const source = this.ctx.createBufferSource();
          source.buffer = decoded;
          source.loop = true;
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
          source.connect(gain);
          gain.connect(this.ctx.destination);
          source.start(0);
          this.ambientSource = source;
          this.ambientGain = gain;
        })
        .catch(() => {
          this.playAmbientAudioElement(ambientFile, basePath);
        });
    } else {
      this.playAmbientAudioElement(ambientFile, basePath);
    }
  },

  playAmbientAudioElement(ambientFile, basePath = '../audio/login/', onFallback) {
    if (this.ambientAudio) return;
    const file = ambientFile || 'ambiente_noche.ogg';
    this.ambientAudio = new Audio(basePath + file);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0.35;
    const p = this.ambientAudio.play();
    if (p !== undefined) {
      p.catch(() => {
        if (typeof onFallback === 'function') {
          onFallback();
        }
      });
    }
  },

  playAmbientInterior(basePath = 'audio/mapa/') {
    if (this.ambientPlaying) return;
    this.ambientPlaying = true;
    this.init();
    const ambientFile = 'ambiente_interior.ogg';
    if (this.ctx) {
      fetch(basePath + ambientFile)
        .then(res => res.arrayBuffer())
        .then(buf => this.ctx.decodeAudioData(buf))
        .then(decoded => {
          if (!this.ambientPlaying) return;
          const source = this.ctx.createBufferSource();
          source.buffer = decoded;
          source.loop = true;
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
          source.connect(gain);
          gain.connect(this.ctx.destination);
          source.start(0);
          this.ambientSource = source;
          this.ambientGain = gain;
        })
        .catch(() => {
          this.playAmbientAudioElement(ambientFile, basePath, () => {
            this.startSyntheticAmbient();
          });
        });
    } else {
      this.playAmbientAudioElement(ambientFile, basePath, () => {
        this.startSyntheticAmbient();
      });
    }
  },

  stopAmbient() {
    this.ambientPlaying = false;
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (e) {}
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
    this.stopSyntheticAmbient();
  },

  startSyntheticAmbient() {
    this.init();
    if (!this.ctx || this.ambientNode) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(48, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(80, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientNode = { osc1, osc2, gainNode };
    } catch (e) {}
  },

  stopSyntheticAmbient() {
    if (this.ambientNode) {
      try {
        this.ambientNode.osc1.stop();
        this.ambientNode.osc2.stop();
      } catch (e) {}
      this.ambientNode = null;
    }
  },

  startBulbHum(basePath = 'audio/mapa/') {
    if (this.bulbHumActive) return;
    this.bulbHumActive = true;
    this.init();

    if (this.ctx && this.bulbHumBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.bulbHumBuffer;
        source.loop = true;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.088, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(0);
        this.bulbHumSource = source;
        this.bulbHumGain = gain;
        return;
      } catch (e) {}
    }

    const path = basePath + 'bombilla_zumbido.mp3';
    let audio = this.cache[path];
    if (!audio) {
      audio = new Audio(path);
      this.cache[path] = audio;
    }
    audio.loop = true;
    audio.volume = 0.088;
    audio.currentTime = 0;
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        if (!this.bulbHumActive) {
          audio.pause();
          audio.currentTime = 0;
          return;
        }
        this.bulbHumAudio = audio;
      }).catch(() => {
        if (!this.bulbHumActive) return;
        this.startSyntheticBulbHum();
      });
    }

    if (this.ctx && !this.bulbHumBuffer) {
      fetch(path)
        .then(res => res.arrayBuffer())
        .then(buf => this.ctx.decodeAudioData(buf))
        .then(decoded => {
          this.bulbHumBuffer = decoded;
          if (this.bulbHumActive && this.bulbHumAudio) {
            this.bulbHumAudio.pause();
            this.bulbHumAudio.currentTime = 0;
            this.bulbHumAudio = null;
            const source = this.ctx.createBufferSource();
            source.buffer = decoded;
            source.loop = true;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.088, this.ctx.currentTime);
            source.connect(gain);
            gain.connect(this.ctx.destination);
            source.start(0);
            this.bulbHumSource = source;
            this.bulbHumGain = gain;
          }
        })
        .catch(() => {});
    }
  },

  preloadBulbHumBuffer(basePath = 'audio/mapa/') {
    this.init();
    if (!this.ctx || this.bulbHumBuffer) return;
    fetch(basePath + 'bombilla_zumbido.mp3')
      .then(res => res.arrayBuffer())
      .then(buf => this.ctx.decodeAudioData(buf))
      .then(decoded => {
        this.bulbHumBuffer = decoded;
      })
      .catch(() => {});
  },

  stopBulbHum() {
    this.bulbHumActive = false;
    if (this.bulbHumSource) {
      try {
        this.bulbHumSource.stop();
        this.bulbHumSource.disconnect();
      } catch (e) {}
      this.bulbHumSource = null;
    }
    if (this.bulbHumGain) {
      try {
        this.bulbHumGain.disconnect();
      } catch (e) {}
      this.bulbHumGain = null;
    }
    if (this.bulbHumAudio) {
      this.bulbHumAudio.pause();
      this.bulbHumAudio.currentTime = 0;
      this.bulbHumAudio = null;
    }
    this.stopSyntheticBulbHum();
  },

  startSyntheticBulbHum() {
    this.init();
    if (!this.ctx || this.bulbHumNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.bulbHumNode = { osc, gain };
    } catch (e) {}
  },

  stopSyntheticBulbHum() {
    if (this.bulbHumNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.bulbHumNode.gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
        this.bulbHumNode.osc.stop(now + 0.22);
      } catch (e) {}
      this.bulbHumNode = null;
    }
  },

  playClick(basePath = 'audio/mapa/') {
    this.playFileOrFallback('linterna_click.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.018);
      } catch (e) {}
    }, basePath);
  },

  preloadHoverBuffer(basePath = 'audio/mapa/') {
    this.init();
    if (!this.ctx || this.hoverBuffer) return;
    fetch(basePath + 'mapa_hover.mp3')
      .then(res => res.arrayBuffer())
      .then(buf => this.ctx.decodeAudioData(buf))
      .then(decoded => {
        this.hoverBuffer = decoded;
      })
      .catch(() => {});
  },

  playHover(basePath = 'audio/mapa/') {
    const now = Date.now();
    if (now - this.lastHoverTime < 110) return;
    this.lastHoverTime = now;

    if (this.ctx && this.hoverBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.hoverBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.40, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch (e) {}
    }
    this.playFileOrFallback('mapa_hover.mp3', null, basePath, 0.40);
  },

  playDenied(basePath = 'audio/mapa/') {
    this.playFileOrFallback('puerta_clausurada.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(95, now);
        osc2.frequency.setValueAtTime(142, now);
        gainNode.gain.setValueAtTime(0.22, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      } catch (e) {}
    }, basePath);
  },

  playEnter(basePath = 'audio/mapa/') {
    this.playFileOrFallback('pasos_madera.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } catch (e) {}
    }, basePath);
  },

  playLightSwitch(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_interruptor.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1250, now);
        osc1.frequency.exponentialRampToValueAtTime(1750, now + 0.012);
        gain1.gain.setValueAtTime(0.04, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.018);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(900, now + 0.012);
        osc2.frequency.exponentialRampToValueAtTime(450, now + 0.038);
        gain2.gain.setValueAtTime(0.06, now + 0.012);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.012);
        osc2.stop(now + 0.042);
      } catch (e) {}
    }, basePath, 0.45);
  },

  playFlickerOff(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_flicker_off.mp3', null, basePath);
  },

  playFlickerOn(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_flicker_on.mp3', null, basePath);
  },

  playFlickerSpark(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_chisporroteo.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.095);
      } catch (e) {}
    }, basePath);
  },

  playPaper(basePath = 'audio/mapa/') {
    this.playFileOrFallback('papel_examinar.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(1100, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }, basePath);
  }
};

