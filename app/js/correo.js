import { AudioEngine } from './core/audio.js';
import { FlashlightController } from './core/flashlight.js';
import { initAccessibility } from './core/accessibility.js';

document.addEventListener('DOMContentLoaded', () => {
  AudioEngine.init();
  AudioEngine.preload([
    'lampara_mesa_on.mp3',
    'lampara_mesa_off.mp3',
    'maquina_tecla.mp3',
    'maquina_salto_linea.mp3',
    'correo_enviar.mp3'
  ], '../audio/correo/');
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
    onToggle: (isOn, playAudio = true) => {
      if (isOn) {
        if (darknessVeil) darknessVeil.classList.remove('lights-off');
        if (officeStage) officeStage.classList.remove('cursor-visible');
      } else {
        if (darknessVeil) darknessVeil.classList.add('lights-off');
        if (officeStage) officeStage.classList.add('cursor-visible');
      }
      if (playAudio === true) {
        AudioEngine.playClick('../audio/common/');
      }
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
        if (AudioEngine.playDeskLampOn) {
          AudioEngine.playDeskLampOn('../audio/correo/');
        } else if (AudioEngine.playBulbOn) {
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
        if (AudioEngine.playDeskLampOff) {
          AudioEngine.playDeskLampOff('../audio/correo/');
        } else if (AudioEngine.playBulbOff) {
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
  flashlight.setDisabled(true, false);
  flashlight.setOn(false, false, false);
  if (accessibility) {
    accessibility.syncLightsAndFlashlight(true);
  }

  const calculatePaperShift = () => {
    if (!paperSheet) return;

    const initialShift = 210;
    const maxRise = 210;
    const activeEl = document.activeElement;

    if (activeEl === destinatarioInput) {
      paperSheet.style.setProperty('--paper-shift', `${initialShift}px`);
      return;
    }

    if (activeEl === asuntoInput) {
      paperSheet.style.setProperty('--paper-shift', `${initialShift - 35}px`);
      return;
    }

    if (activeEl === cuerpoTextarea) {
      const val = cuerpoTextarea.value;
      const cursorPos = cuerpoTextarea.selectionStart || val.length;
      const textUpToCursor = val.substring(0, cursorPos);
      const linesUpToCursor = textUpToCursor.split('\n').length;
      const totalLines = val.split('\n').length;
      const effectiveLines = Math.max(linesUpToCursor, Math.min(totalLines, 8));

      const charCount = val.length;
      const charRise = Math.min(45, Math.floor(charCount / 20) * 8);
      const lineRise = (effectiveLines - 1) * 26;

      const totalRise = Math.min(maxRise, 35 + lineRise + charRise);
      const targetShift = Math.max(0, initialShift - totalRise);

      paperSheet.style.setProperty('--paper-shift', `${targetShift}px`);
      return;
    }

    if (cuerpoTextarea && cuerpoTextarea.value.trim().length > 0) {
      const val = cuerpoTextarea.value;
      const totalLines = Math.min(8, val.split('\n').length);
      const charRise = Math.min(45, Math.floor(val.length / 20) * 8);
      const lineRise = (totalLines - 1) * 26;
      const totalRise = Math.min(maxRise, 30 + lineRise + charRise);
      const targetShift = Math.max(0, initialShift - totalRise);
      paperSheet.style.setProperty('--paper-shift', `${targetShift}px`);
      return;
    }

    paperSheet.style.setProperty('--paper-shift', `${initialShift}px`);
  };

  calculatePaperShift();

  if (destinatarioInput) {
    destinatarioInput.addEventListener('focus', calculatePaperShift);
    destinatarioInput.addEventListener('keydown', () => {
      AudioEngine.playTypewriterKey('../audio/correo/');
    });
  }

  if (asuntoInput) {
    asuntoInput.addEventListener('focus', calculatePaperShift);
    asuntoInput.addEventListener('keydown', () => {
      AudioEngine.playTypewriterKey('../audio/correo/');
    });
  }

  if (cuerpoTextarea) {
    cuerpoTextarea.addEventListener('focus', calculatePaperShift);
    cuerpoTextarea.addEventListener('input', calculatePaperShift);
    cuerpoTextarea.addEventListener('click', calculatePaperShift);
    cuerpoTextarea.addEventListener('keyup', calculatePaperShift);

    cuerpoTextarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (mailForm) {
          mailForm.requestSubmit();
        }
        return;
      }

      if (e.key === 'Enter') {
        AudioEngine.playCarriageReturn('../audio/correo/');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        AudioEngine.playTypewriterKey('../audio/correo/');
      }
      setTimeout(calculatePaperShift, 10);
    });
  }

  if (mailForm) {
    mailForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const destinatario = destinatarioInput ? destinatarioInput.value.trim() : '';
      const asunto = asuntoInput ? asuntoInput.value.trim() : '';
      const cuerpo = cuerpoTextarea ? cuerpoTextarea.value.trim() : '';

      if (!destinatario || !asunto || !cuerpo) {
        return;
      }

      const sendBtn = document.getElementById('sendEmailBtn');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = '[ ENVIANDO... ]';
      }

      if (AudioEngine && AudioEngine.playMailSend) {
        AudioEngine.playMailSend('../audio/correo/');
      }

      const formData = new FormData(mailForm);
      formData.append('ajax', '1');

      try {
        const resp = await fetch('correo.php', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
          }
        });

        const data = await resp.json();

        let stampEl = document.getElementById('typewriterStampStatus');
        if (!stampEl && paperSheet) {
          const formContent = paperSheet.querySelector('.typewriter-form-content');
          if (formContent) {
            stampEl = document.createElement('div');
            stampEl.id = 'typewriterStampStatus';
            stampEl.className = 'typewriter-stamp-status';
            formContent.insertBefore(stampEl, formContent.firstChild);
          }
        }

        if (stampEl) {
          stampEl.textContent = data.message || (data.success ? '¡Correo enviado con éxito!' : 'Error al enviar el correo.');
          stampEl.className = `typewriter-stamp-status ${data.success ? 'stamp-success' : 'stamp-error'}`;
          stampEl.style.display = 'block';
        }

        if (data.success) {
          if (cuerpoTextarea) cuerpoTextarea.value = '';
          if (asuntoInput) asuntoInput.value = '';
          calculatePaperShift();
        }
      } catch (err) {
        let stampEl = document.getElementById('typewriterStampStatus');
        if (stampEl) {
          stampEl.textContent = 'Error de conexión al enviar el correo.';
          stampEl.className = 'typewriter-stamp-status stamp-error';
          stampEl.style.display = 'block';
        }
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.textContent = '[ ENVIAR ]';
        }
      }
    });
  }
});
