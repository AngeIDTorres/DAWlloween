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
  const stickerAbout = document.getElementById('frameStickerAbout');

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
    stickerAbout,
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

  AudioEngine.preload([
    'linterna_click.mp3',
    'bombilla_interruptor.mp3',
    'bombilla_zumbido.mp3',
    'bombilla_chisporroteo.mp3',
    'bombilla_flicker_off.mp3',
    'bombilla_flicker_on.mp3',
    'puerta_clausurada.mp3',
    'pasos_madera.mp3',
    'papel_examinar.mp3',
    'mapa_hover.mp3'
  ], 'audio/mapa/');

  window.addEventListener('click', () => {
    AudioEngine.playAmbientInterior('audio/mapa/');
    AudioEngine.preloadHoverBuffer('audio/mapa/');
    AudioEngine.preloadBulbHumBuffer('audio/mapa/');
  }, { once: true });
});
