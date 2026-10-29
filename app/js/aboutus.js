import { AudioEngine } from './core/audio.js?v=20261029_11';

const commonAudioPath = '../audio/common/';
const mapaAudioPath = '../audio/mapa/';

function initAudio() {
  AudioEngine.init();
  AudioEngine.playAmbientInterior(commonAudioPath);
  AudioEngine.preloadHoverBuffer(mapaAudioPath);
}

function returnToMap() {
  AudioEngine.playPaper(commonAudioPath);
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
      AudioEngine.playHover(mapaAudioPath);
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.playPaper(commonAudioPath);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
