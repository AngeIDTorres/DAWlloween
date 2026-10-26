const AudioEngine = {
  ctx: null,
  cache: {},
  preloadList: ['candado_salto.mp3', 'candado_expandir.mp3', 'llave_insertar.mp3', 'llave_girar.mp3', 'candado_error.mp3', 'candado_desbloqueo.mp3', 'candado_caida.mp3', 'verja_abrir.mp3'],
  preload() {
    this.preloadList.forEach((filename) => {
      const path = '../audio/' + filename;
      if (!this.cache[path]) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = path;
        this.cache[path] = audio;
      }
    });
  },
  playFileOrFallback(filename, fallbackFn) {
    const path = '../audio/' + filename;
    let audio = this.cache[path];
    if (!audio) {
      audio = new Audio(path);
      audio.preload = 'auto';
      this.cache[path] = audio;
    }
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackFn();
      });
    }
  },
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
  playPadlockExpand() {
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
  playKeyInsert() {
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
  playKeyTurn() {
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
  playShake() {
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
  playUnlock() {
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
  playGateOpen() {
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
  playPadlockFall() {
    this.playFileOrFallback('candado_caida.mp3', () => {});
  },
  playPadlockHop() {
    this.init();
    const path = '../audio/candado_salto.mp3';
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
  playAmbientNight() {
    if (this.ambientPlaying) return;
    this.ambientPlaying = true;
    this.init();
    const ambientFile = 'ambiente_noche.ogg';
    if (this.ctx) {
      fetch('../audio/' + ambientFile)
        .then((res) => res.arrayBuffer())
        .then((buf) => this.ctx.decodeAudioData(buf))
        .then((decoded) => {
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
          this.playAmbientAudioElement(ambientFile);
        });
    } else {
      this.playAmbientAudioElement(ambientFile);
    }
  },
  playAmbientAudioElement(ambientFile) {
    if (this.ambientAudio) return;
    const file = ambientFile || 'ambiente_noche.ogg';
    this.ambientAudio = new Audio('../audio/' + file);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0.35;
    const p = this.ambientAudio.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
  },
};

AudioEngine.preload();

document.addEventListener('DOMContentLoaded', () => {
  const padlockWrapper = document.getElementById('padlockWrapper');
  const shackle = document.getElementById('shackleGraphic') || document.getElementById('shackle');
  const gateLeft = document.getElementById('gateLeft');
  const gateRight = document.getElementById('gateRight');
  const blackoutCurtain = document.getElementById('blackoutCurtain');
  const loginForm = document.getElementById('loginForm');
  const keyholeBtn = document.getElementById('keyholeBtn');
  const antiqueKey = document.getElementById('antiqueKey');
  const usuarioInput = document.getElementById('usuario');
  const flashlight = document.getElementById('flashlightBeam');
  let isSubmitting = false;

  const startAmbient = () => {
    AudioEngine.playAmbientNight();
  };
  startAmbient();
  window.addEventListener('pointerdown', startAmbient, { once: true });
  window.addEventListener('keydown', startAmbient, { once: true });
  window.addEventListener('click', startAmbient, { once: true });
  window.addEventListener('mousemove', startAmbient, { once: true });

  if (flashlight) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = null;

    window.addEventListener('mousemove', (e) => {
      const stage = document.querySelector('.login-stage');
      if (stage && stage.classList.contains('form-active')) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!flashlight.classList.contains('visible')) {
        flashlight.classList.add('visible');
      }
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          flashlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
          if (stage) {
            stage.style.setProperty('--light-x', mouseX + 'px');
            stage.style.setProperty('--light-y', mouseY + 'px');
          }
          rafId = null;
        });
      }
    });

    document.addEventListener('mouseleave', () => {
      flashlight.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      const stage = document.querySelector('.login-stage');
      if (!stage || !stage.classList.contains('form-active')) {
        flashlight.classList.add('visible');
      }
    });
  }

  const triggerOpenSequence = () => {
    setTimeout(() => {
      if (shackle) shackle.classList.add('unlocked');
      AudioEngine.playUnlock();
    }, 250);

    setTimeout(() => {
      if (padlockWrapper) padlockWrapper.classList.add('falling');
      AudioEngine.playPadlockFall();
    }, 950);

    setTimeout(() => {
      if (gateLeft) gateLeft.classList.add('open-left');
      if (gateRight) gateRight.classList.add('open-right');
      AudioEngine.playGateOpen();
    }, 1450);

    setTimeout(() => {
      if (blackoutCurtain) blackoutCurtain.classList.add('active');
    }, 2450);

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 3850);
  };

  if (padlockWrapper) {
    if (padlockWrapper.classList.contains('expanded')) {
      const stage = document.querySelector('.login-stage');
      if (stage) stage.classList.add('form-active');
      if (flashlight) flashlight.classList.remove('visible');
    }

    let isHoveringPadlock = false;
    let lastHopTime = 0;

    const playHopIfAllowed = (e) => {
      if (e && e.animationName && e.animationName !== 'padlockHop') return;
      const now = Date.now();
      if (now - lastHopTime < 1500) return;
      if (padlockWrapper.classList.contains('hopping') && !isHoveringPadlock && !padlockWrapper.matches(':hover')) {
        lastHopTime = now;
        AudioEngine.playPadlockHop();
      }
    };

    padlockWrapper.addEventListener('animationiteration', playHopIfAllowed);
    padlockWrapper.addEventListener('animationstart', playHopIfAllowed);

    padlockWrapper.addEventListener('mouseenter', () => {
      if (padlockWrapper.classList.contains('hopping')) {
        isHoveringPadlock = true;
        AudioEngine.stopPadlockHop();
      }
    });

    padlockWrapper.addEventListener('mouseleave', () => {
      if (padlockWrapper.classList.contains('hopping')) {
        isHoveringPadlock = false;
      }
    });

    padlockWrapper.addEventListener('click', (e) => {
      if (!padlockWrapper.classList.contains('expanded')) {
        e.stopPropagation();
        isHoveringPadlock = false;
        AudioEngine.stopPadlockHop();
        const stage = document.querySelector('.login-stage');
        if (stage) stage.classList.add('form-active');
        if (flashlight) flashlight.classList.remove('visible');
        padlockWrapper.classList.remove('hopping');
        padlockWrapper.classList.add('expanded');
        AudioEngine.playPadlockExpand();
        setTimeout(() => {
          if (usuarioInput) usuarioInput.focus();
        }, 400);
      }
    });

    document.addEventListener('click', (e) => {
      if (!padlockWrapper || !padlockWrapper.classList.contains('expanded')) return;
      if (isSubmitting) return;
      if (padlockWrapper.classList.contains('falling')) return;
      if (document.body.dataset.loginSuccess === 'true') return;
      if (!padlockWrapper.contains(e.target)) {
        padlockWrapper.classList.remove('shake');
        padlockWrapper.classList.remove('expanded');
        padlockWrapper.classList.add('hopping');
        padlockWrapper.dataset.error = 'false';
        const stage = document.querySelector('.login-stage');
        if (stage) stage.classList.remove('form-active');
        if (flashlight) {
          flashlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
          flashlight.classList.add('visible');
          if (stage) {
            stage.style.setProperty('--light-x', e.clientX + 'px');
            stage.style.setProperty('--light-y', e.clientY + 'px');
          }
        }
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }
    });
  }

  if (keyholeBtn && antiqueKey) {
    keyholeBtn.addEventListener('mouseenter', () => {
      if (padlockWrapper.classList.contains('expanded') && !antiqueKey.classList.contains('turning')) {
        AudioEngine.playKeyInsert();
      }
    });
  }

  if (padlockWrapper && padlockWrapper.dataset.error === 'true') {
    padlockWrapper.classList.remove('hopping');
    padlockWrapper.classList.add('expanded');
    padlockWrapper.classList.add('shake');
    AudioEngine.playShake();
    setTimeout(() => {
      padlockWrapper.classList.remove('shake');
      if (antiqueKey) antiqueKey.classList.remove('turning');
    }, 700);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const userVal = document.getElementById('usuario').value.trim();
      const passVal = document.getElementById('password').value.trim();

      if (!userVal || !passVal) {
        if (antiqueKey) antiqueKey.classList.remove('turning');
        padlockWrapper.classList.remove('shake');
        void padlockWrapper.offsetWidth;
        padlockWrapper.classList.add('shake');
        AudioEngine.playShake();
        setTimeout(() => {
          padlockWrapper.classList.remove('shake');
        }, 700);
        return;
      }

      isSubmitting = true;
      if (antiqueKey) antiqueKey.classList.add('turning');
      AudioEngine.playKeyTurn();

      const formData = new FormData(loginForm);
      formData.append('ajax', '1');

      fetch('login.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            triggerOpenSequence();
          } else {
            isSubmitting = false;
            setTimeout(() => {
              if (antiqueKey) antiqueKey.classList.remove('turning');
              padlockWrapper.classList.remove('shake');
              void padlockWrapper.offsetWidth;
              padlockWrapper.classList.add('shake');
              AudioEngine.playShake();
              setTimeout(() => {
                padlockWrapper.classList.remove('shake');
              }, 700);

              let alertEl = document.querySelector('.plate-alert');
              if (!alertEl) {
                alertEl = document.createElement('div');
                alertEl.className = 'plate-alert';
                const plateContent = document.querySelector('.plate-content');
                if (plateContent) plateContent.prepend(alertEl);
              }
              alertEl.textContent = data.error || 'Combinación errónea. Clave rechazada.';
            }, 350);
          }
        })
        .catch(() => {
          loginForm.submit();
        });
    });
  }

  if (document.body.dataset.loginSuccess === 'true') {
    triggerOpenSequence();
  }
});
