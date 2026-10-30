export class FlashlightController {
  constructor(options = {}) {
    this.element = document.getElementById(options.elementId);
    this.stage = document.querySelector(options.stageSelector || '.map-stage');
    this.cssVarPrefix = options.cssVarPrefix || '--map-light';
    this.activeCondition = options.activeCondition || (() => true);
    this.enableKeyToggle = Boolean(options.enableKeyToggle);
    this.onToggle = options.onToggle || null;
    this.isOn = true;
    this.disabled = false;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.rafId = null;

    if (this.element) {
      this.bindEvents();
      this.updatePosition();
    }
  }

  bindEvents() {
    const handlePointer = (clientX, clientY) => {
      if (!this.activeCondition()) return;
      this.mouseX = clientX;
      this.mouseY = clientY;
      if (!this.element.classList.contains('visible') && this.isOn && !this.disabled) {
        this.element.classList.add('visible');
      }
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.updatePosition();
          this.rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.element.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      if (this.activeCondition() && this.isOn && !this.disabled) {
        this.element.classList.add('visible');
      }
    });

    if (this.enableKeyToggle) {
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 'f' || e.key === 'F') {
          if (this.disabled) return;
          this.toggle();
        }
      });
    }
  }

  updatePosition() {
    if (!this.element) return;
    document.documentElement.style.setProperty(`${this.cssVarPrefix}-x`, `${this.mouseX}px`);
    document.documentElement.style.setProperty(`${this.cssVarPrefix}-y`, `${this.mouseY}px`);
    if (this.stage) {
      this.stage.style.setProperty(`${this.cssVarPrefix}-x`, `${this.mouseX}px`);
      this.stage.style.setProperty(`${this.cssVarPrefix}-y`, `${this.mouseY}px`);
    }
    if (this.isOn && !this.disabled) {
      this.element.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%, -50%)`;
    }
  }

  setDisabled(disabled) {
    this.disabled = Boolean(disabled);
    if (this.disabled && this.isOn) {
      this.setOn(false);
    }
  }

  toggle() {
    if (this.disabled) return;
    this.setOn(!this.isOn);
  }

  setOn(state, triggerCallback = true) {
    if (this.disabled && state) return;
    this.isOn = Boolean(state);
    if (this.isOn) {
      this.element.classList.remove('off');
      this.element.classList.add('visible');
    } else {
      this.element.classList.add('off');
      this.element.classList.remove('visible');
    }
    if (triggerCallback && typeof this.onToggle === 'function') {
      this.onToggle(this.isOn);
    }
  }

  setVisible(visible) {
    if (!this.element) return;
    if (visible && this.isOn && !this.disabled) {
      this.element.classList.add('visible');
    } else {
      this.element.classList.remove('visible');
    }
  }
}
