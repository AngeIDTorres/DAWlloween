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
  ambientStartTime: null,
  ambientDuration: null,
  ambientSyncTimer: null,

  autoUnlockBound: false,

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
    this.setupAutoUnlock();
  },

  setupAutoUnlock() {
    if (this.autoUnlockBound) return;
    this.autoUnlockBound = true;
    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.ambientPlaying && this.ambientAudio && this.ambientAudio.paused) {
        this.ambientAudio.play().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, { capture: true, passive: true });
    window.addEventListener('click', unlock, { capture: true, passive: true });
    window.addEventListener('touchstart', unlock, { capture: true, passive: true });
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

  saveAmbientPosition() {
    if (this.ambientPlaying && this.ambientDuration && this.ctx && typeof this.ambientStartTime === 'number') {
      const currentPos = (this.ctx.currentTime - this.ambientStartTime) % this.ambientDuration;
      if (!isNaN(currentPos) && currentPos >= 0) {
        sessionStorage.setItem('daw_ambient_pos', currentPos.toFixed(3));
        sessionStorage.setItem('daw_ambient_ts', Date.now().toString());
      }
    } else if (this.ambientAudio && !isNaN(this.ambientAudio.currentTime)) {
      sessionStorage.setItem('daw_ambient_pos', this.ambientAudio.currentTime.toFixed(3));
      sessionStorage.setItem('daw_ambient_ts', Date.now().toString());
    }
  },

  getSavedAmbientOffset(duration) {
    const savedPos = parseFloat(sessionStorage.getItem('daw_ambient_pos'));
    const savedTs = parseInt(sessionStorage.getItem('daw_ambient_ts'), 10);
    if (!isNaN(savedPos) && !isNaN(savedTs) && duration > 0) {
      const elapsed = (Date.now() - savedTs) / 1000;
      return (savedPos + elapsed) % duration;
    }
    return 0;
  },

  startAmbientSync() {
    if (this.ambientSyncTimer) {
      clearInterval(this.ambientSyncTimer);
    }
    this.ambientSyncTimer = setInterval(() => {
      this.saveAmbientPosition();
    }, 200);
    window.addEventListener('pagehide', () => this.saveAmbientPosition(), { capture: true });
    window.addEventListener('beforeunload', () => this.saveAmbientPosition(), { capture: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveAmbientPosition();
      }
    });
  },

  playAmbientAudioElement(ambientFile, basePath = '../audio/login/', onFallback) {
    if (this.ambientAudio) return;
    const file = ambientFile || 'ambiente_noche.ogg';
    const audio = new Audio(basePath + file);
    audio.loop = true;
    audio.volume = 0.35;

    if (file.includes('interior')) {
      audio.addEventListener('loadedmetadata', () => {
        const offset = this.getSavedAmbientOffset(audio.duration || 60);
        if (offset > 0 && offset < audio.duration) {
          audio.currentTime = offset;
        }
      });
      audio.addEventListener('timeupdate', () => {
        this.saveAmbientPosition();
      });
      this.startAmbientSync();
    }

    this.ambientAudio = audio;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        if (typeof onFallback === 'function') {
          onFallback();
        }
      });
    }
  },

  playAmbientInterior(basePath = 'audio/common/') {
    if (this.ambientPlaying) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
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
          
          const offset = this.getSavedAmbientOffset(decoded.duration);
          source.start(0, offset);

          this.ambientStartTime = this.ctx.currentTime - offset;
          this.ambientDuration = decoded.duration;
          this.ambientSource = source;
          this.ambientGain = gain;
          this.startAmbientSync();
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
    this.saveAmbientPosition();
    if (this.ambientSyncTimer) {
      clearInterval(this.ambientSyncTimer);
      this.ambientSyncTimer = null;
    }
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

  startBulbHum() {},

  stopBulbHum() {},

  preloadBulbHumBuffer() {},

  playClick(basePath = 'audio/common/') {
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

  playEnter(basePath = 'audio/common/') {
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

  playFootsteps(basePath = 'audio/common/') {
    this.playEnter(basePath);
  },

  playBulbOn(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_on.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1550, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } catch (e) {}
    }, basePath, 0.55);
  },

  playBulbOff(basePath = 'audio/mapa/') {
    this.playFileOrFallback('bombilla_off.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
      } catch (e) {}
    }, basePath, 0.55);
  },

  playBulbFlicker(basePath = 'audio/mapa/') {
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

  playLightSwitch(basePath = 'audio/mapa/') {
    this.playBulbOn(basePath);
  },

  playFlickerSpark(basePath = 'audio/mapa/') {
    this.playBulbFlicker(basePath);
  },

  playTubeLampOn(basePath = '../audio/recetas/') {
    this.playFileOrFallback('lampara_tubo_on.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1850, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } catch (e) {}
    }, basePath, 0.55);
  },

  playTubeLampOff(basePath = '../audio/recetas/') {
    this.playFileOrFallback('lampara_tubo_off.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }, basePath, 0.28);
  },

  playTubeLampFlicker(basePath = '../audio/recetas/') {
    this.playFileOrFallback('lampara_tubo_chisporroteo.mp3', () => {
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    }, basePath, 0.55);
  },

  playPaper(basePath = 'audio/common/') {
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

