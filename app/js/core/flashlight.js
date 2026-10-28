export class FlashlightController {
  constructor(options = {}) {
    this.element = document.getElementById(options.elementId);
    this.stage = document.querySelector(options.stageSelector || '.map-stage');
    this.cssVarPrefix = options.cssVarPrefix || '--map-light';
    this.activeCondition = options.activeCondition || (() => true);
    this.enableKeyToggle = Boolean(options.enableKeyToggle);
    this.onToggle = options.onToggle || null;
    this.isOn = true;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.rafId = null;

    if (this.element) {
      this.bindEvents();
      this.updatePosition();
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!this.activeCondition()) return;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (!this.element.classList.contains('visible') && this.isOn) {
        this.element.classList.add('visible');
      }
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.updatePosition();
          this.rafId = null;
        });
      }
    });

    document.addEventListener('mouseleave', () => {
      this.element.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      if (this.activeCondition() && this.isOn) {
        this.element.classList.add('visible');
      }
    });

    if (this.enableKeyToggle) {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
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
    if (this.isOn) {
      this.element.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%, -50%)`;
    }
  }

  toggle() {
    this.isOn = !this.isOn;
    if (this.isOn) {
      this.element.classList.remove('off');
      this.element.classList.add('visible');
    } else {
      this.element.classList.add('off');
      this.element.classList.remove('visible');
    }
    if (typeof this.onToggle === 'function') {
      this.onToggle(this.isOn);
    }
  }

  setVisible(visible) {
    if (!this.element) return;
    if (visible && this.isOn) {
      this.element.classList.add('visible');
    } else {
      this.element.classList.remove('visible');
    }
  }
}

