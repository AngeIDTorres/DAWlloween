import { AudioEngine } from './core/audio.js?v=20261029_11';
import { FlashlightController } from './core/flashlight.js';
import { ROOMS_REGISTRY } from './map/rooms-data.js';
import { initNavigation } from './map/navigation.js?v=20261029_11';
import { initHangingLamp } from './map/hanging-lamp.js?v=20261029_11';
import { initPostit } from './map/postit.js?v=20261029_11';
import { initAccessibility } from './core/accessibility.js?v=20261029_13';

document.addEventListener('DOMContentLoaded', () => {
  AudioEngine.init();
  AudioEngine.playAmbientInterior('audio/common/');

  const blackoutCurtain = document.getElementById('blackoutCurtain');
  if (blackoutCurtain) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        blackoutCurtain.classList.remove('active');
      }, 50);
    });
  }

  const mapStage = document.getElementById('mapStage');
  const darknessVeil = document.getElementById('mapDarknessVeil');
  const hangingLamp = document.getElementById('hangingLamp');
  const framePostit = document.getElementById('framePostit');
  const postitLinks = document.querySelectorAll('.postit-link');
  const roomZones = document.querySelectorAll('.room-zone, .frame-sticker-about');
  const stickerAbout = document.getElementById('frameStickerAbout');

  let accessibility = null;

  const flashlight = new FlashlightController({
    elementId: 'mapFlashlight',
    stageSelector: '.map-stage',
    cssVarPrefix: '--map-light',
    enableKeyToggle: true,
    onToggle: (isOn) => {
      if (isOn) {
        if (darknessVeil) darknessVeil.classList.remove('lights-off');
        if (mapStage) mapStage.classList.remove('cursor-visible');
      } else {
        if (darknessVeil) darknessVeil.classList.add('lights-off');
        if (mapStage) mapStage.classList.add('cursor-visible');
      }
      AudioEngine.playClick();
      if (accessibility) {
        accessibility.state.flashlight = isOn;
        accessibility.saveState();
        accessibility.updateUI();
      }
    }
  });

  const lampController = initHangingLamp({
    hangingLamp,
    mapStage,
    audioEngine: AudioEngine,
    lampType: 'bulb',
    onToggle: (isLit) => {
      if (accessibility) {
        accessibility.onLampToggle(isLit);
      }
    }
  });

  accessibility = initAccessibility({
    audioEngine: AudioEngine,
    flashlightController: flashlight,
    lampController: lampController,
    isMapPage: true
  });

  initNavigation({
    roomZones,
    stickerAbout,
    roomsRegistry: ROOMS_REGISTRY,
    audioEngine: AudioEngine,
    onOpenAbout: () => {
      if (lampController && lampController.turnOn) {
        lampController.turnOn(true);
      }
    }
  });

  initPostit({
    framePostit,
    postitLinks,
    roomsRegistry: ROOMS_REGISTRY,
    audioEngine: AudioEngine
  });

  AudioEngine.preload([
    'bombilla_on.mp3',
    'bombilla_off.mp3',
    'bombilla_chisporroteo.mp3',
    'puerta_clausurada.mp3',
    'mapa_hover.mp3'
  ], 'audio/mapa/');

  AudioEngine.preload([
    'linterna_click.mp3',
    'pasos_madera.mp3',
    'papel_examinar.mp3',
    'ambiente_interior.ogg'
  ], 'audio/common/');

  const aboutBackdrop = document.getElementById('aboutBackdrop');
  const aboutModal = document.getElementById('aboutModalContainer');
  const posterWrapper = document.getElementById('posterWrapper');

  const closeAboutModal = () => {
    if (aboutBackdrop && aboutBackdrop.classList.contains('active')) {
      AudioEngine.playPaper('audio/common/');
      aboutBackdrop.classList.remove('active');
      if (aboutModal) aboutModal.classList.remove('active');
      if (lampController && lampController.turnOff) {
        lampController.turnOff(false);
      }
    }
  };

  if (aboutBackdrop) {
    aboutBackdrop.addEventListener('click', closeAboutModal);
  }
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeAboutModal();
    });
  }
  if (posterWrapper) {
    posterWrapper.addEventListener('click', (e) => e.stopPropagation());
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAboutModal();
  });

  const dossierBtns = document.querySelectorAll('.dossier-link-btn');
  dossierBtns.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      AudioEngine.playHover('audio/mapa/');
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.playPaper('audio/common/');
    });
  });

  const initAudioOnUserGesture = () => {
    AudioEngine.playAmbientInterior('audio/common/');
    AudioEngine.preloadHoverBuffer('audio/mapa/');
    AudioEngine.preloadBulbHumBuffer('audio/mapa/');
    window.removeEventListener('pointerdown', initAudioOnUserGesture);
    window.removeEventListener('keydown', initAudioOnUserGesture);
    window.removeEventListener('click', initAudioOnUserGesture);
  };
  window.addEventListener('pointerdown', initAudioOnUserGesture);
  window.addEventListener('keydown', initAudioOnUserGesture);
  window.addEventListener('click', initAudioOnUserGesture);
});
