import { AudioEngine } from './core/audio.js';
import { FlashlightController } from './core/flashlight.js';
import { initAccessibility } from './core/accessibility.js';

document.addEventListener('DOMContentLoaded', () => {
  AudioEngine.init();
  AudioEngine.playAmbientInterior('../audio/common/');

  const blackoutCurtain = document.getElementById('blackoutCurtain');
  if (blackoutCurtain) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        blackoutCurtain.classList.remove('active');
      }, 50);
    });
  }

  const officeStage = document.getElementById('officeStage');
  const darknessVeil = document.getElementById('officeDarknessVeil');
  const deskLamp = document.getElementById('officeDeskLamp');
  const paperSheet = document.getElementById('typewriterPaperSheet');
  const destinatarioInput = document.getElementById('destinatario');
  const asuntoInput = document.getElementById('asunto');
  const cuerpoTextarea = document.getElementById('cuerpo');
  const sendBtn = document.getElementById('sendEmailBtn');
  const mailForm = document.getElementById('typewriterMailForm');

  let isNavigatingBack = false;
  let accessibility = null;

  const navigateBackToMap = () => {
    if (isNavigatingBack) return;
    isNavigatingBack = true;
    if (AudioEngine) {
      if (AudioEngine.playFootsteps) {
        AudioEngine.playFootsteps('../audio/common/');
      } else if (AudioEngine.playEnter) {
        AudioEngine.playEnter('../audio/common/');
      }
    }
    if (blackoutCurtain) {
      blackoutCurtain.classList.add('active');
    }
    setTimeout(() => {
      window.location.href = '../index.php';
    }, 1750);
  };

  const flashlight = new FlashlightController({
    elementId: 'officeFlashlight',
    stageSelector: '.office-stage',
    cssVarPrefix: '--office-light',
    enableKeyToggle: true,
    onToggle: (isOn) => {
      if (isOn) {
        if (darknessVeil) darknessVeil.classList.remove('lights-off');
        if (officeStage) officeStage.classList.remove('cursor-visible');
      } else {
        if (darknessVeil) darknessVeil.classList.add('lights-off');
        if (officeStage) officeStage.classList.add('cursor-visible');
      }
      AudioEngine.playClick('../audio/common/');
      if (accessibility) {
        accessibility.state.flashlight = isOn;
        accessibility.saveState();
        accessibility.updateUI();
      }
    }
  });

  const lampController = {
    turnOn(playAudio = true) {
      if (!officeStage) return;
      officeStage.classList.add('room-lit');
      if (playAudio && AudioEngine) {
        if (AudioEngine.playBulbOn) {
          AudioEngine.playBulbOn('../audio/mapa/');
        } else if (AudioEngine.playLightSwitch) {
          AudioEngine.playLightSwitch('../audio/mapa/');
        }
      }
      if (accessibility) {
        accessibility.onLampToggle(true);
      }
    },

    turnOff(playAudio = true) {
      if (!officeStage) return;
      officeStage.classList.remove('room-lit');
      if (playAudio && AudioEngine) {
        if (AudioEngine.playBulbOff) {
          AudioEngine.playBulbOff('../audio/mapa/');
        } else if (AudioEngine.playLightSwitch) {
          AudioEngine.playLightSwitch('../audio/mapa/');
        }
      }
      if (accessibility) {
        accessibility.onLampToggle(false);
      }
    },

    toggle() {
      if (!officeStage) return;
      if (officeStage.classList.contains('room-lit')) {
        this.turnOff();
      } else {
        this.turnOn();
      }
    },

    isLit() {
      return officeStage ? officeStage.classList.contains('room-lit') : false;
    }
  };

  if (deskLamp) {
    deskLamp.addEventListener('click', (e) => {
      e.stopPropagation();
      lampController.toggle();
    });
  }

  accessibility = initAccessibility({
    audioEngine: AudioEngine,
    flashlightController: flashlight,
    lampController: lampController,
    onNavigateMap: navigateBackToMap,
    isMapPage: false
  });

  lampController.turnOn(false);

  const calculatePaperShift = () => {
    if (!paperSheet) return;

    const activeEl = document.activeElement;
    if (activeEl === destinatarioInput) {
      paperSheet.style.transform = 'translateY(0)';
      return;
    }

    if (activeEl === asuntoInput) {
      paperSheet.style.transform = 'translateY(-28px)';
      return;
    }

    if (activeEl === cuerpoTextarea) {
      const textUntilCursor = cuerpoTextarea.value.substring(0, cuerpoTextarea.selectionStart || 0);
      const lines = textUntilCursor.split('\n').length;
      const baseShift = 62;
      const lineStep = 22;
      const totalShift = Math.min(220, baseShift + (lines - 1) * lineStep);
      paperSheet.style.transform = `translateY(-${totalShift}px)`;
      return;
    }

    paperSheet.style.transform = 'translateY(0)';
  };

  if (destinatarioInput) {
    destinatarioInput.addEventListener('focus', calculatePaperShift);
    destinatarioInput.addEventListener('keydown', () => {
      AudioEngine.playClick('../audio/common/');
    });
  }

  if (asuntoInput) {
    asuntoInput.addEventListener('focus', calculatePaperShift);
    asuntoInput.addEventListener('keydown', () => {
      AudioEngine.playClick('../audio/common/');
    });
  }

  if (cuerpoTextarea) {
    cuerpoTextarea.addEventListener('focus', calculatePaperShift);
    cuerpoTextarea.addEventListener('input', calculatePaperShift);
    cuerpoTextarea.addEventListener('click', calculatePaperShift);
    cuerpoTextarea.addEventListener('keyup', calculatePaperShift);

    cuerpoTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        AudioEngine.playPaper('../audio/common/');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        AudioEngine.playClick('../audio/common/');
      }
      setTimeout(calculatePaperShift, 10);
    });
  }

  if (mailForm) {
    mailForm.addEventListener('submit', () => {
      AudioEngine.playPaper('../audio/common/');
    });
  }
});

