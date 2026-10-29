import { AudioEngine } from './core/audio.js';

const audioBasePath = '../audio/mapa/';

function initAudio() {
  AudioEngine.init();
  AudioEngine.playAmbientInterior(audioBasePath);
  AudioEngine.preloadHoverBuffer(audioBasePath);
}

function returnToMap() {
  AudioEngine.playPaper(audioBasePath);
  AudioEngine.playLightSwitch(audioBasePath);
  const mapStage = document.getElementById('mapStage');
  if (mapStage) mapStage.classList.remove('room-lit');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 120);
}

function setup() {
  initAudio();

  const handleFirstInteraction = () => {
    initAudio();
    document.removeEventListener('pointerdown', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };

  document.addEventListener('pointerdown', handleFirstInteraction);
  document.addEventListener('keydown', handleFirstInteraction);

  const backdrop = document.getElementById('aboutBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', returnToMap);
  }

  const modalContainer = document.getElementById('aboutModalContainer');
  if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        returnToMap();
      }
    });
  }

  const posterWrapper = document.getElementById('posterWrapper');
  if (posterWrapper) {
    posterWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      returnToMap();
    }
  });

  const buttons = document.querySelectorAll('.dossier-link-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      AudioEngine.playHover(audioBasePath);
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.playPaper(audioBasePath);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
