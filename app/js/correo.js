import { AudioEngine, ROOM_TRANSITION_DELAY_MS } from './core/audio.js';
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
    if (AudioEngine && AudioEngine.navigateWithTransition) {
      AudioEngine.navigateWithTransition('../index.php', '../audio/common/');
    } else {
      window.location.href = '../index.php';
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      navigateBackToMap();
    }
  });

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

  const countVisualLines = (text, maxChars = 37) => {
    if (!text) return 1;
    const paragraphs = text.split('\n');
    let totalLines = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (!p) {
        totalLines += 1;
        continue;
      }
      const words = p.split(' ');
      let currentLen = 0;
      let paragraphLines = 1;
      for (let j = 0; j < words.length; j++) {
        let w = words[j];
        while (w.length > maxChars) {
          if (currentLen > 0) {
            paragraphLines += 1;
            currentLen = 0;
          }
          w = w.substring(maxChars);
          paragraphLines += 1;
        }
        if (!w) continue;
        const space = currentLen > 0 ? 1 : 0;
        if (currentLen + space + w.length <= maxChars) {
          currentLen += space + w.length;
        } else {
          paragraphLines += 1;
          currentLen = w.length;
        }
      }
      totalLines += paragraphLines;
    }
    return Math.max(1, totalLines);
  };

  let previousVisualLine = 1;
  let enterKeyTriggered = false;

  const calculatePaperShift = () => {
    if (!paperSheet) return;

    const INITIAL_PAPER_SHIFT = 255;
    const LINE_HEIGHT_SHIFT = 26;
    const MIN_PAPER_SHIFT = 40;
    const activeEl = document.activeElement;

    if (activeEl === destinatarioInput || activeEl === asuntoInput) {
      paperSheet.style.setProperty('--paper-shift', `${INITIAL_PAPER_SHIFT}px`);
      return;
    }

    if (activeEl === cuerpoTextarea) {
      const val = cuerpoTextarea.value;
      const cursorPos = cuerpoTextarea.selectionStart ?? val.length;
      const textUpToCursor = val.substring(0, cursorPos);
      const activeLine = countVisualLines(textUpToCursor, 37);
      if (activeLine > previousVisualLine && !enterKeyTriggered) {
        AudioEngine.playCarriageReturn('../audio/correo/');
      }
      enterKeyTriggered = false;
      previousVisualLine = activeLine;
      const targetShift = Math.max(MIN_PAPER_SHIFT, 240 - (activeLine - 1) * LINE_HEIGHT_SHIFT);
      paperSheet.style.setProperty('--paper-shift', `${targetShift}px`);
      return;
    }

    if (cuerpoTextarea && cuerpoTextarea.value.trim().length > 0) {
      const totalLines = countVisualLines(cuerpoTextarea.value, 37);
      const targetShift = Math.max(MIN_PAPER_SHIFT, 240 - (totalLines - 1) * LINE_HEIGHT_SHIFT);
      paperSheet.style.setProperty('--paper-shift', `${targetShift}px`);
      return;
    }

    paperSheet.style.setProperty('--paper-shift', `${INITIAL_PAPER_SHIFT}px`);
  };

  calculatePaperShift();

  if (destinatarioInput) {
    destinatarioInput.addEventListener('focus', calculatePaperShift);
    destinatarioInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        AudioEngine.playCarriageReturn('../audio/correo/');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        AudioEngine.playTypewriterKey('../audio/correo/');
      }
    });
  }

  if (asuntoInput) {
    asuntoInput.addEventListener('focus', calculatePaperShift);
    asuntoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        AudioEngine.playCarriageReturn('../audio/correo/');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        AudioEngine.playTypewriterKey('../audio/correo/');
      }
    });
  }

  if (cuerpoTextarea) {
    cuerpoTextarea.addEventListener('focus', () => {
      const cursorPos = cuerpoTextarea.selectionStart ?? cuerpoTextarea.value.length;
      previousVisualLine = countVisualLines(cuerpoTextarea.value.substring(0, cursorPos), 37);
      calculatePaperShift();
    });
    cuerpoTextarea.addEventListener('blur', calculatePaperShift);
    cuerpoTextarea.addEventListener('input', calculatePaperShift);
    cuerpoTextarea.addEventListener('click', () => {
      const cursorPos = cuerpoTextarea.selectionStart ?? cuerpoTextarea.value.length;
      previousVisualLine = countVisualLines(cuerpoTextarea.value.substring(0, cursorPos), 37);
      calculatePaperShift();
    });
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
        enterKeyTriggered = true;
        AudioEngine.playCarriageReturn('../audio/correo/');
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        AudioEngine.playTypewriterKey('../audio/correo/');
      }
      setTimeout(calculatePaperShift, 10);
    });
  }

  let stampDismissTimer = null;

  const scheduleStampDismiss = (stampEl, delay = 4500) => {
    if (!stampEl) return;
    if (stampDismissTimer) {
      clearTimeout(stampDismissTimer);
      stampDismissTimer = null;
    }
    stampEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    stampEl.style.opacity = '1';
    stampDismissTimer = setTimeout(() => {
      stampEl.style.opacity = '0';
      setTimeout(() => {
        stampEl.style.display = 'none';
        stampDismissTimer = null;
      }, 500);
    }, delay);
  };

  const initialStamp = document.getElementById('typewriterStampStatus');
  if (initialStamp && initialStamp.style.display !== 'none' && initialStamp.textContent.trim().length > 0) {
    scheduleStampDismiss(initialStamp, 4500);
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
          scheduleStampDismiss(stampEl, 4500);
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
          scheduleStampDismiss(stampEl, 4500);
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
