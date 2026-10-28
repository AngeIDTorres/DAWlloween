import { AudioEngine } from './core/audio.js';
import { FlashlightController } from './core/flashlight.js';
import { ROOMS_REGISTRY } from './map/rooms-data.js';
import { initNavigation } from './map/navigation.js';
import { initHangingLamp } from './map/hanging-lamp.js';
import { initPostit } from './map/postit.js';

document.addEventListener('DOMContentLoaded', () => {
  const mapStage = document.getElementById('mapStage');
  const darknessVeil = document.getElementById('mapDarknessVeil');
  const hangingLamp = document.getElementById('hangingLamp');
  const framePostit = document.getElementById('framePostit');
  const postitLinks = document.querySelectorAll('.postit-link');
  const roomZones = document.querySelectorAll('.room-zone, .frame-sticker-about');

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
    }
  });

  initNavigation({
    roomZones,
    roomsRegistry: ROOMS_REGISTRY,
    audioEngine: AudioEngine
  });

  initPostit({
    framePostit,
    postitLinks,
    roomsRegistry: ROOMS_REGISTRY,
    audioEngine: AudioEngine
  });

  initHangingLamp({
    hangingLamp,
    mapStage,
    audioEngine: AudioEngine
  });

  window.addEventListener('click', () => {
    AudioEngine.startSyntheticAmbient();
  }, { once: true });
});
