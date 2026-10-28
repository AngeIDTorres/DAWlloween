import { AudioEngine } from './core/audio.js';
import { FlashlightController } from './core/flashlight.js';
import { initPadlock } from './login/padlock.js';
import { initAuth } from './login/auth.js';
import { playGateSequence } from './login/gate-cutscene.js';

AudioEngine.preload([
  'candado_salto.mp3',
  'candado_expandir.mp3',
  'llave_insertar.mp3',
  'llave_girar.mp3',
  'candado_error.mp3',
  'candado_desbloqueo.mp3',
  'candado_caida.mp3',
  'verja_abrir.mp3'
], '../audio/login/');

document.addEventListener('DOMContentLoaded', () => {
  const padlockWrapper = document.getElementById('padlockWrapper');
  const stage = document.querySelector('.login-stage');
  const shackle = document.getElementById('shackleGraphic') || document.getElementById('shackle');
  const gateLeft = document.getElementById('gateLeft');
  const gateRight = document.getElementById('gateRight');
  const blackoutCurtain = document.getElementById('blackoutCurtain');
  const loginForm = document.getElementById('loginForm');
  const keyholeBtn = document.getElementById('keyholeBtn');
  const antiqueKey = document.getElementById('antiqueKey');
  const usuarioInput = document.getElementById('usuario');

  let isSubmitting = false;

  const startAmbient = () => {
    AudioEngine.playAmbientNight('../audio/login/');
  };
  startAmbient();
  window.addEventListener('pointerdown', startAmbient, { once: true });
  window.addEventListener('keydown', startAmbient, { once: true });
  window.addEventListener('click', startAmbient, { once: true });
  window.addEventListener('mousemove', startAmbient, { once: true });

  const flashlight = new FlashlightController({
    elementId: 'flashlightBeam',
    stageSelector: '.login-stage',
    cssVarPrefix: '--light',
    activeCondition: () => {
      const currentStage = document.querySelector('.login-stage');
      return !currentStage || !currentStage.classList.contains('form-active');
    }
  });

  const runGateSequence = () => {
    playGateSequence({
      shackle,
      padlockWrapper,
      gateLeft,
      gateRight,
      blackoutCurtain,
      audioEngine: AudioEngine,
      redirectUrl: '../index.html'
    });
  };

  initPadlock({
    padlockWrapper,
    stage,
    flashlight,
    usuarioInput,
    antiqueKey,
    audioEngine: AudioEngine,
    getIsSubmitting: () => isSubmitting
  });

  initAuth({
    loginForm,
    padlockWrapper,
    keyholeBtn,
    antiqueKey,
    audioEngine: AudioEngine,
    setIsSubmitting: (val) => { isSubmitting = val; },
    onSuccess: runGateSequence
  });

  if (document.body.dataset.loginSuccess === 'true') {
    runGateSequence();
  }
});
