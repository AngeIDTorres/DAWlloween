const STORAGE_KEY = 'daw_accessibility_state';

const DEFAULT_STATE = {
  muted: false,
  flashlight: true,
  lights: false,
  locked: true,
  normX: null,
  normY: null
};

export class AccessibilityManager {
  constructor(options = {}) {
    this.options = options;
    this.audioEngine = options.audioEngine || null;
    this.flashlightController = options.flashlightController || null;
    this.lampController = options.lampController || null;
    this.onNavigateMap = options.onNavigateMap || null;
    this.isMapPage = Boolean(options.isMapPage);
    this.basePath = options.basePath || (this.isMapPage ? 'img/common/accesibilidad/' : '../img/common/accesibilidad/');

    this.state = this.loadState();
    this.container = null;

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragInitialLeft = 0;
    this.dragInitialTop = 0;
    this.dragHasMoved = false;

    this.initDOM();
    this.applyInitialState();
    this.bindEvents();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, DEFAULT_STATE, JSON.parse(saved));
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_STATE);
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {}
  }

  playBeep() {
    if (this.state.muted || !this.audioEngine) return;
    try {
      this.audioEngine.init();
      const ctx = this.audioEngine.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2600, now);
      osc.frequency.setValueAtTime(3200, now + 0.02);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  applyPosition() {
    if (!this.container) return;
    if (typeof this.state.normX === 'number' && typeof this.state.normY === 'number') {
      const rect = this.container.getBoundingClientRect();
      const w = rect.width || 240;
      const h = rect.height || 180;
      const maxLeft = Math.max(0, window.innerWidth - w);
      const maxTop = Math.max(0, window.innerHeight - h);
      const left = Math.min(Math.max(0, this.state.normX * window.innerWidth), maxLeft);
      const top = Math.min(Math.max(0, this.state.normY * window.innerHeight), maxTop);
      this.container.style.left = `${left}px`;
      this.container.style.top = `${top}px`;
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    }
  }

  syncLightsAndFlashlight(isLit) {
    this.state.lights = Boolean(isLit);
    if (this.state.lights) {
      this.state.flashlight = false;
      if (this.flashlightController) {
        this.flashlightController.setDisabled(true);
        this.flashlightController.setOn(false);
      }
    } else {
      if (this.flashlightController) {
        this.flashlightController.setDisabled(false);
        this.flashlightController.setOn(true);
      }
      this.state.flashlight = true;
    }
    this.saveState();
    this.updateUI();
  }

  onLampToggle(isLit) {
    this.syncLightsAndFlashlight(isLit);
  }

  applyInitialState() {
    if (this.state.muted && this.audioEngine) {
      this.audioEngine.setMute(true);
    }

    if (this.state.lights) {
      if (this.lampController) {
        this.lampController.turnOn(false);
      }
      this.syncLightsAndFlashlight(true);
    } else {
      if (this.flashlightController) {
        this.flashlightController.setDisabled(false);
        this.flashlightController.setOn(Boolean(this.state.flashlight));
      }
    }

    this.applyPosition();
    this.updateUI();
  }

  initDOM() {
    const existing = document.getElementById('accessibilityPager');
    if (existing) {
      this.container = existing;
      return;
    }

    const pager = document.createElement('aside');
    pager.id = 'accessibilityPager';
    pager.className = 'accessibility-pager';
    pager.setAttribute('aria-label', 'Panel de accesibilidad y control');

    const bp = this.basePath;

    pager.innerHTML = `
      <div class="pager-device">
        <div class="pager-screen-window">
          <img src="${bp}busca_pantalla_bg.png" alt="" class="pager-screen-bg" draggable="false">
          <div class="pager-screen-content">
            <div class="pager-lcd-header">
              <span class="lcd-brand">DAWlloween</span>
              <span class="lcd-channel">CH-94</span>
            </div>

            <div class="pager-lcd-grid">
              <button class="pager-lcd-btn" data-action="map" title="Volver al plano escolar (Esc)" aria-label="Volver al plano">
                <img src="${bp}icono_mapa.png" alt="Mapa" class="lcd-icon-img" draggable="false">
              </button>

              <button class="pager-lcd-btn" data-action="flashlight" title="Linterna ON/OFF (F)" aria-label="Linterna">
                <img src="${bp}icono_linterna.png" alt="Linterna" class="lcd-icon-img" draggable="false">
              </button>

              <button class="pager-lcd-btn" data-action="lights" title="Iluminación fija de sala (L)" aria-label="Iluminación de la sala">
                <img src="${bp}icono_luces.png" alt="Luces" class="lcd-icon-img" draggable="false">
              </button>

              <button class="pager-lcd-btn" data-action="mute" title="Silenciar audio (M)" aria-label="Silenciar sonido">
                <img src="${bp}icono_mute.png" alt="Silencio" class="lcd-icon-img" draggable="false">
              </button>
            </div>
          </div>
        </div>

        <img src="${bp}busca_cuerpo.png" alt="Busca de accesibilidad" class="pager-casing-overlay" draggable="false">

        <div class="pager-physical-strip">
          <button class="pager-phys-btn phys-btn-1" data-action="map" title="Volver al plano escolar (Esc)" aria-label="Volver al plano">
            <img src="${bp}btn_mapa.png" alt="Mapa" class="phys-btn-img" draggable="false">
          </button>
          <button class="pager-phys-btn phys-btn-2" data-action="flashlight" title="Linterna ON/OFF (F)" aria-label="Linterna">
            <img src="${bp}btn_linterna.png" alt="Linterna" class="phys-btn-img" draggable="false">
          </button>
          <button class="pager-phys-btn phys-btn-3" data-action="lights" title="Iluminación fija de sala (L)" aria-label="Iluminación de la sala">
            <img src="${bp}btn_luces.png" alt="Luces" class="phys-btn-img" draggable="false">
          </button>
          <button class="pager-phys-btn phys-btn-4" data-action="mute" title="Silenciar audio (M)" aria-label="Silenciar sonido">
            <img src="${bp}btn_mute.png" alt="Silencio" class="phys-btn-img" draggable="false">
          </button>
          <button class="pager-phys-btn phys-btn-5" data-action="toggle-lock" id="pagerBtnLock" title="Bloquear o desbloquear posición" aria-label="Bloquear posición">
            <img src="${bp}btn_lock.png" alt="Bloquear" class="phys-btn-img lock-img" draggable="false">
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(pager);
    this.container = pager;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      if (this.dragHasMoved) return;
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      if (btn.classList.contains('is-disabled') || btn.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const action = btn.dataset.action;
      this.handleAction(action);
    });

    this.container.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (this.state.locked) return;
      if (e.target.closest('.pager-phys-btn') || e.target.closest('.pager-lcd-btn')) return;
      e.preventDefault();
      this.isDragging = true;
      this.dragHasMoved = false;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      const rect = this.container.getBoundingClientRect();
      this.dragInitialLeft = rect.left;
      this.dragInitialTop = rect.top;
      this.container.classList.add('is-dragging');
      try {
        this.container.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    this.container.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        this.dragHasMoved = true;
      }
      const rect = this.container.getBoundingClientRect();
      const maxLeft = Math.max(0, window.innerWidth - rect.width);
      const maxTop = Math.max(0, window.innerHeight - rect.height);
      const newLeft = Math.max(0, Math.min(this.dragInitialLeft + dx, maxLeft));
      const newTop = Math.max(0, Math.min(this.dragInitialTop + dy, maxTop));
      this.container.style.left = `${newLeft}px`;
      this.container.style.top = `${newTop}px`;
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    });

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.classList.remove('is-dragging');
      try {
        this.container.releasePointerCapture(e.pointerId);
      } catch (err) {}
      if (this.dragHasMoved) {
        const rect = this.container.getBoundingClientRect();
        this.state.normX = rect.left / window.innerWidth;
        this.state.normY = rect.top / window.innerHeight;
        this.saveState();
        setTimeout(() => {
          this.dragHasMoved = false;
        }, 60);
      }
    };

    this.container.addEventListener('pointerup', onPointerUp);
    this.container.addEventListener('pointercancel', onPointerUp);

    window.addEventListener('resize', () => {
      this.applyPosition();
    });

    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        if (this.state.lights) {
          e.preventDefault();
          return;
        }
        if (!this.flashlightController) {
          this.handleAction('flashlight');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        this.handleAction('mute');
      } else if (e.key === 'l' || e.key === 'L') {
        this.handleAction('lights');
      }
    });
  }

  handleAction(action) {
    if (action === 'flashlight' && this.state.lights) {
      return;
    }

    this.playBeep();

    switch (action) {
      case 'map':
        if (this.isMapPage) {
          return;
        }
        if (typeof this.onNavigateMap === 'function') {
          this.onNavigateMap();
        } else {
          window.location.href = '../index.html';
        }
        break;

      case 'flashlight':
        if (this.flashlightController) {
          this.flashlightController.toggle();
          this.state.flashlight = this.flashlightController.isOn;
        } else {
          this.state.flashlight = !this.state.flashlight;
        }
        this.saveState();
        this.updateUI();
        break;

      case 'lights':
        if (this.lampController) {
          this.lampController.toggle();
          const isLit = this.lampController.isLit ? this.lampController.isLit() : !this.state.lights;
          this.syncLightsAndFlashlight(isLit);
        } else {
          this.syncLightsAndFlashlight(!this.state.lights);
        }
        break;

      case 'mute':
        if (this.audioEngine) {
          const newMuted = this.audioEngine.toggleMute();
          this.state.muted = newMuted;
        } else {
          this.state.muted = !this.state.muted;
        }
        this.saveState();
        this.updateUI();
        break;

      case 'toggle-lock':
        this.state.locked = !this.state.locked;
        this.saveState();
        this.updateUI();
        break;
    }
  }

  updateUI() {
    if (!this.container) return;

    const isFlashDisabled = Boolean(this.state.lights);

    const mapBtns = this.container.querySelectorAll('[data-action="map"]');
    mapBtns.forEach(btn => {
      btn.classList.toggle('active', this.isMapPage);
    });

    const fBtns = this.container.querySelectorAll('[data-action="flashlight"]');
    fBtns.forEach(btn => {
      btn.classList.toggle('active', Boolean(this.state.flashlight) && !isFlashDisabled);
      btn.classList.toggle('is-disabled', isFlashDisabled);
      if (isFlashDisabled) {
        btn.setAttribute('aria-disabled', 'true');
        btn.title = 'Linterna deshabilitada (La luz de la sala está encendida)';
      } else {
        btn.removeAttribute('aria-disabled');
        btn.title = 'Linterna ON/OFF (F)';
      }
    });

    const lBtns = this.container.querySelectorAll('[data-action="lights"]');
    lBtns.forEach(btn => {
      btn.classList.toggle('active', Boolean(this.state.lights));
    });

    const mBtns = this.container.querySelectorAll('[data-action="mute"]');
    mBtns.forEach(btn => {
      btn.classList.toggle('active', Boolean(this.state.muted));
    });

    const lockBtn = this.container.querySelector('#pagerBtnLock');
    const isLocked = Boolean(this.state.locked);
    this.container.classList.toggle('is-locked', isLocked);
    this.container.classList.toggle('is-unlocked', !isLocked);

    if (lockBtn) {
      lockBtn.classList.toggle('active', !isLocked);
      lockBtn.setAttribute('aria-label', isLocked ? 'Posición bloqueada' : 'Posición desbloqueada');
      lockBtn.title = isLocked
        ? 'Posición fija (haz clic para desbloquear y mover el busca)'
        : 'Posición móvil (arrastra el busca por la pantalla; clic para fijar)';
      const lockImg = lockBtn.querySelector('.lock-img');
      if (lockImg) {
        lockImg.src = isLocked ? `${this.basePath}btn_lock.png` : `${this.basePath}btn_lock_open.png`;
      }
    }
  }
}

export function initAccessibility(options = {}) {
  return new AccessibilityManager(options);
}
