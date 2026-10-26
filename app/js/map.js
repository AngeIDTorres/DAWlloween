const MapEngine = {
  rooms: {
    comedor: {
      tag: 'ALA OESTE • SERVICIOS',
      name: 'Comedor y Cocinas',
      status: 'available',
      statusText: 'ACCESO PERMITIDO',
      desc: 'Bandejas metálicas oxidadas bajo fluorescentes parpadeantes. El recetario del personal aún descansa sobre el mostrador de acero.',
      target: 'pages/recetas.html',
      actionText: 'EXPLORAR COCINAS [ENTER]',
    },
    director: {
      tag: 'ALA NORTE • ADMINISTRACIÓN',
      name: 'Despacho de Dirección',
      status: 'available',
      statusText: 'TERMINAL ACTIVA',
      desc: 'Una pesada mesa de caoba preside el despacho. La terminal de red aguarda operativa para redactar y transmitir correos de socorro al exterior.',
      target: 'pages/correo.php',
      actionText: 'ACCEDER AL DESPACHO [ENTER]',
    },
    juego: {
      tag: 'ALA ESTE • SALA RECREATIVA',
      name: 'Sala de Juegos',
      status: 'warning',
      statusText: 'MINIJUEGO ACTIVO',
      desc: 'Mesa recreativa central y rastros arrastrados hacia el fondo del aula. Incursión interactiva de supervivencia.',
      target: 'pages/juego.html',
      actionText: 'INICIAR MINIJUEGO [ENTER]',
    },
    archivo: {
      tag: 'MARCO • EXPEDIENTE',
      name: 'Archivo Histórico',
      status: 'available',
      statusText: 'EXPEDIENTES OK',
      desc: 'Legajo confidencial y expediente personal sobre el creador de este proyecto.',
      target: 'pages/aboutus.html',
      actionText: 'CONSULTAR ARCHIVO [ENTER]',
    },
    musica: {
      tag: 'ALA OESTE • ARTES',
      name: 'Aula de Música',
      status: 'danger',
      statusText: 'CLAUSURADO JUDICIAL',
      desc: 'Cerradura bloqueada con precinto judicial. El piano de cola permanece cubierto por una lona mohosa. Acceso estrictamente prohibido.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
    aseos: {
      tag: 'ALA OESTE • HIGIENE',
      name: 'Aseos de Alumnos',
      status: 'danger',
      statusText: 'CERRADO POR SANIDAD',
      desc: 'Cerradura bloqueada desde el interior con pasador forzado. Espejos quebrados y tuberías secas sin suministro tras el desalojo del centro.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
    profesores: {
      tag: 'ALA NORTE • CLAUSTRO',
      name: 'Sala de Profesores',
      status: 'danger',
      statusText: 'CLAUSURADO JUDICIAL',
      desc: 'La puerta acristalada está atrancada con cadenas de acero y un precinto de 1993. Mesas volcadas y expedientes desparramados en el interior.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
    laboratorio: {
      tag: 'ALA ESTE • CIENCIAS',
      name: 'Laboratorio de Ciencias',
      status: 'danger',
      statusText: 'RIESGO TOXICOLÓGICO',
      desc: 'Frascos fracturados en las bancadas de granito. Atmósfera viciada por vapores volátiles y precinto de cuarentena biológica.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
    biblioteca: {
      tag: 'ALA ESTE • FONDO DOCUMENTAL',
      name: 'Biblioteca Central',
      status: 'danger',
      statusText: 'DERRUMBE ACTIVO',
      desc: 'Estanterías metálicas colapsadas y toneladas de libros húmedos bloqueando los pasillos. Peligro inminente de desprendimiento de techumbre.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
    gimnasio: {
      tag: 'ALA ESTE • DEPORTES',
      name: 'Gimnasio Polideportivo',
      status: 'danger',
      statusText: 'ESTRUCTURA DAÑADA',
      desc: 'Cancha reglamentaria clausurada con parqué podrido y canastas oxidadas. Precintado judicialmente tras el colapso del muro perimetral.',
      target: null,
      actionText: 'ACCESO DENEGADO [BLOQUEADO]',
    },
  },

  flashlightOn: true,
  ctx: null,
  ambientNode: null,

  initAudio() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.startSyntheticAmbient();
    }
  },

  startSyntheticAmbient() {
    if (!this.ctx || this.ambientNode) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(58, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

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

  playClick() {
    this.initAudio();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  },

  playHover() {
    this.initAudio();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.06);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  },

  playDenied() {
    this.initAudio();
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
  },

  playEnter() {
    this.initAudio();
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
  },

  playLightSwitch() {
    this.initAudio();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  },

  playFlickerSpark() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.setValueAtTime(115, now + 0.08);
      osc.frequency.setValueAtTime(55, now + 0.18);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.Q.setValueAtTime(2.2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.015, now + 0.12);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const mapFlashlight = document.getElementById('mapFlashlight');
  const darknessVeil = document.getElementById('mapDarknessVeil');
  const mapStage = document.getElementById('mapStage');
  const hangingLamp = document.getElementById('hangingLamp');
  const roomZones = document.querySelectorAll('.room-zone, .frame-sticker-about');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let rafId = null;

  const updateLightPosition = () => {
    document.documentElement.style.setProperty('--map-light-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--map-light-y', `${mouseY}px`);
    if (mapFlashlight && MapEngine.flashlightOn) {
      mapFlashlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      if (!mapFlashlight.classList.contains('visible')) {
        mapFlashlight.classList.add('visible');
      }
    }
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        updateLightPosition();
        rafId = null;
      });
    }
  });

  roomZones.forEach((zone) => {
    const roomId = zone.getAttribute('data-room-id');

    zone.addEventListener('mouseenter', () => {
      MapEngine.playHover();
    });

    zone.addEventListener('click', (e) => {
      e.stopPropagation();
      const data = MapEngine.rooms[roomId];
      if (!data) return;

      if (data.target) {
        MapEngine.playEnter();
        setTimeout(() => {
          window.location.href = data.target;
        }, 220);
      } else {
        MapEngine.playDenied();
      }
    });
  });

  const postitLinks = document.querySelectorAll('.postit-link');
  postitLinks.forEach((link) => {
    const roomId = link.getAttribute('data-target');

    link.addEventListener('mouseenter', () => {
      MapEngine.playHover();
    });

    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const data = MapEngine.rooms[roomId];
      if (!data || !data.target) return;

      MapEngine.playEnter();
      setTimeout(() => {
        window.location.href = data.target;
      }, 220);
    });
  });

  const framePostit = document.getElementById('framePostit');
  if (framePostit) {
    framePostit.addEventListener('click', (e) => {
      if (e.target.closest('.postit-close-btn')) {
        e.stopPropagation();
        framePostit.classList.remove('expanded');
        MapEngine.playClick();
        return;
      }

      if (e.target.closest('.postit-link')) {
        return;
      }

      if (!framePostit.classList.contains('expanded')) {
        framePostit.classList.add('expanded');
        MapEngine.playClick();
      }
    });

    document.addEventListener('click', (e) => {
      if (framePostit.classList.contains('expanded') && !framePostit.contains(e.target)) {
        framePostit.classList.remove('expanded');
        MapEngine.playClick();
      }
    });
  }

  let flickerTimer = null;

  const scheduleNextFlicker = () => {
    if (flickerTimer) {
      clearTimeout(flickerTimer);
      flickerTimer = null;
    }
    if (mapStage.classList.contains('room-lit')) return;

    const delay = Math.floor(Math.random() * 4500) + 3500;
    flickerTimer = setTimeout(() => {
      triggerBulbFlicker();
    }, delay);
  };

  const triggerBulbFlicker = () => {
    if (mapStage.classList.contains('room-lit')) return;

    if (hangingLamp) {
      hangingLamp.classList.add('lamp-flickering');
    }
    mapStage.classList.add('lamp-flickering-ambient');
    MapEngine.playFlickerSpark();

    setTimeout(() => {
      if (hangingLamp) {
        hangingLamp.classList.remove('lamp-flickering');
      }
      mapStage.classList.remove('lamp-flickering-ambient');
      scheduleNextFlicker();
    }, 420);
  };

  if (hangingLamp) {
    hangingLamp.addEventListener('click', (e) => {
      e.stopPropagation();
      const isLit = mapStage.classList.toggle('room-lit');
      MapEngine.playLightSwitch();

      if (isLit) {
        if (flickerTimer) {
          clearTimeout(flickerTimer);
          flickerTimer = null;
        }
        hangingLamp.classList.remove('lamp-flickering');
        mapStage.classList.remove('lamp-flickering-ambient');
      } else {
        scheduleNextFlicker();
      }
    });
  }

  const toggleFlashlight = () => {
    MapEngine.flashlightOn = !MapEngine.flashlightOn;
    MapEngine.playClick();

    if (MapEngine.flashlightOn) {
      mapFlashlight.classList.remove('off');
      darknessVeil.classList.remove('lights-off');
      mapStage.classList.remove('cursor-visible');
    } else {
      mapFlashlight.classList.add('off');
      darknessVeil.classList.add('lights-off');
      mapStage.classList.add('cursor-visible');
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      toggleFlashlight();
    }
  });

  window.addEventListener(
    'click',
    () => {
      MapEngine.initAudio();
    },
    { once: true },
  );

  scheduleNextFlicker();
  updateLightPosition();
});
