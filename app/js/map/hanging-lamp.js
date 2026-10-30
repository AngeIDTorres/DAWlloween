export function initHangingLamp(options = {}) {
  const hangingLamp = options.hangingLamp || document.getElementById('hangingLamp');
  const mapStage = options.mapStage || document.getElementById('mapStage');
  const AudioEngine = options.audioEngine;
  const lampType = options.lampType || 'bulb';
  const audioBasePath = options.audioBasePath || (lampType === 'tube' ? '../audio/recetas/' : 'audio/mapa/');

  const onToggle = options.onToggle || null;

  if (!hangingLamp || !mapStage) {
    return {
      turnOn: () => {},
      turnOff: () => {},
      toggle: () => {},
      isLit: () => false
    };
  }

  let flickerTimer = null;

  const scheduleNextFlicker = () => {
    if (flickerTimer) {
      clearTimeout(flickerTimer);
      flickerTimer = null;
    }
    if (mapStage.classList.contains('room-lit')) return;

    const delay = Math.floor(Math.random() * 4500) + 3500;
    flickerTimer = setTimeout(() => {
      triggerBulbFlicker();
    }, delay);
  };

  const triggerBulbFlicker = () => {
    if (mapStage.classList.contains('room-lit')) return;

    hangingLamp.classList.add('lamp-flickering');
    mapStage.classList.add('lamp-flickering-ambient');
    if (AudioEngine) {
      if (lampType === 'tube' && AudioEngine.playTubeLampFlicker) {
        AudioEngine.playTubeLampFlicker(audioBasePath);
      } else if (AudioEngine.playBulbFlicker) {
        AudioEngine.playBulbFlicker(audioBasePath);
      } else if (AudioEngine.playFlickerSpark) {
        AudioEngine.playFlickerSpark(audioBasePath);
      }
    }

    setTimeout(() => {
      hangingLamp.classList.remove('lamp-flickering');
      mapStage.classList.remove('lamp-flickering-ambient');
      scheduleNextFlicker();
    }, 420);
  };

  const turnOn = (playAudio = true) => {
    if (mapStage.classList.contains('room-lit')) return;
    mapStage.classList.add('room-lit');
    if (flickerTimer) {
      clearTimeout(flickerTimer);
      flickerTimer = null;
    }
    hangingLamp.classList.remove('lamp-flickering');
    mapStage.classList.remove('lamp-flickering-ambient');
    if (playAudio && AudioEngine) {
      if (lampType === 'tube' && AudioEngine.playTubeLampOn) {
        AudioEngine.playTubeLampOn(audioBasePath);
      } else if (AudioEngine.playBulbOn) {
        AudioEngine.playBulbOn(audioBasePath);
      } else if (AudioEngine.playLightSwitch) {
        AudioEngine.playLightSwitch(audioBasePath);
      }
    }
    if (typeof onToggle === 'function') {
      onToggle(true);
    }
  };

  const turnOff = (playAudio = true) => {
    if (!mapStage.classList.contains('room-lit')) return;
    mapStage.classList.remove('room-lit');
    if (playAudio && AudioEngine) {
      if (lampType === 'tube' && AudioEngine.playTubeLampOff) {
        AudioEngine.playTubeLampOff(audioBasePath);
      } else if (AudioEngine.playBulbOff) {
        AudioEngine.playBulbOff(audioBasePath);
      } else if (AudioEngine.playLightSwitch) {
        AudioEngine.playLightSwitch(audioBasePath);
      }
    }
    if (typeof onToggle === 'function') {
      onToggle(false);
    }
    scheduleNextFlicker();
  };

  const toggle = () => {
    if (mapStage.classList.contains('room-lit')) {
      turnOff();
    } else {
      turnOn();
    }
  };

  hangingLamp.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  scheduleNextFlicker();

  return {
    turnOn,
    turnOff,
    toggle,
    isLit: () => mapStage.classList.contains('room-lit')
  };
}
