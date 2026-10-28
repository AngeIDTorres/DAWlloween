export function initHangingLamp(options = {}) {
  const hangingLamp = options.hangingLamp || document.getElementById('hangingLamp');
  const mapStage = options.mapStage || document.getElementById('mapStage');
  const AudioEngine = options.audioEngine;

  if (!hangingLamp || !mapStage) return;

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
    if (AudioEngine) AudioEngine.playFlickerSpark();

    setTimeout(() => {
      hangingLamp.classList.remove('lamp-flickering');
      mapStage.classList.remove('lamp-flickering-ambient');
      scheduleNextFlicker();
    }, 420);
  };

  hangingLamp.addEventListener('click', (e) => {
    e.stopPropagation();
    const isLit = mapStage.classList.toggle('room-lit');
    if (AudioEngine) AudioEngine.playLightSwitch();

    if (isLit) {
      if (flickerTimer) {
        clearTimeout(flickerTimer);
        flickerTimer = null;
      }
      hangingLamp.classList.remove('lamp-flickering');
      mapStage.classList.remove('lamp-flickering-ambient');
    } else {
      scheduleNextFlicker();
    }
  });

  scheduleNextFlicker();
}
