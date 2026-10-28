export function playGateSequence(options = {}) {
  const shackle = options.shackle || document.getElementById('shackleGraphic') || document.getElementById('shackle');
  const padlockWrapper = options.padlockWrapper || document.getElementById('padlockWrapper');
  const gateLeft = options.gateLeft || document.getElementById('gateLeft');
  const gateRight = options.gateRight || document.getElementById('gateRight');
  const blackoutCurtain = options.blackoutCurtain || document.getElementById('blackoutCurtain');
  const AudioEngine = options.audioEngine;
  const redirectUrl = options.redirectUrl || '../index.html';

  setTimeout(() => {
    if (shackle) shackle.classList.add('unlocked');
    if (AudioEngine) AudioEngine.playUnlock();
  }, 250);

  setTimeout(() => {
    if (padlockWrapper) padlockWrapper.classList.add('falling');
    if (AudioEngine) AudioEngine.playPadlockFall();
  }, 950);

  setTimeout(() => {
    if (gateLeft) gateLeft.classList.add('open-left');
    if (gateRight) gateRight.classList.add('open-right');
    if (AudioEngine) AudioEngine.playGateOpen();
  }, 1450);

  setTimeout(() => {
    if (blackoutCurtain) blackoutCurtain.classList.add('active');
  }, 2450);

  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 3850);
}
