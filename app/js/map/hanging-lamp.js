export function initHangingLamp(options = {}) {
  const hangingLamp = options.hangingLamp || document.getElementById('hangingLamp');
  const mapStage = options.mapStage || document.getElementById('mapStage');
  const AudioEngine = options.audioEngine;

  if (!hangingLamp || !mapStage) {
    return {
      turnOn: () => {},
      turnOff: () => {},
      toggle: () => {}
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
      AudioEngine.playFlickerSpark();
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
    if (playAudio && AudioEngine) AudioEngine.playLightSwitch();
    if (AudioEngine && AudioEngine.startBulbHum) AudioEngine.startBulbHum();
  };

  const turnOff = (playAudio = true) => {
    if (!mapStage.classList.contains('room-lit')) return;
    mapStage.classList.remove('room-lit');
    if (playAudio && AudioEngine) AudioEngine.playLightSwitch();
    if (AudioEngine && AudioEngine.stopBulbHum) AudioEngine.stopBulbHum();
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

  return { turnOn, turnOff, toggle };
}
