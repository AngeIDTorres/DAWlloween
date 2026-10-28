export function initPadlock(options = {}) {
  const padlockWrapper = options.padlockWrapper || document.getElementById('padlockWrapper');
  const stage = options.stage || document.querySelector('.login-stage');
  const flashlight = options.flashlight;
  const usuarioInput = options.usuarioInput || document.getElementById('usuario');
  const antiqueKey = options.antiqueKey || document.getElementById('antiqueKey');
  const AudioEngine = options.audioEngine;
  const getIsSubmitting = options.getIsSubmitting || (() => false);

  if (!padlockWrapper) return;

  if (padlockWrapper.classList.contains('expanded')) {
    if (stage) stage.classList.add('form-active');
    if (flashlight) flashlight.setVisible(false);
  }

  let isHoveringPadlock = false;
  let lastHopTime = 0;

  const playHopIfAllowed = (e) => {
    if (e && e.animationName && e.animationName !== 'padlockHop') return;
    const now = Date.now();
    if (now - lastHopTime < 1500) return;
    if (padlockWrapper.classList.contains('hopping') && !isHoveringPadlock && !padlockWrapper.matches(':hover')) {
      lastHopTime = now;
      if (AudioEngine) AudioEngine.playPadlockHop();
    }
  };

  padlockWrapper.addEventListener('animationiteration', playHopIfAllowed);
  padlockWrapper.addEventListener('animationstart', playHopIfAllowed);

  padlockWrapper.addEventListener('mouseenter', () => {
    if (padlockWrapper.classList.contains('hopping')) {
      isHoveringPadlock = true;
      if (AudioEngine) AudioEngine.stopPadlockHop();
    }
  });

  padlockWrapper.addEventListener('mouseleave', () => {
    if (padlockWrapper.classList.contains('hopping')) {
      isHoveringPadlock = false;
    }
  });

  padlockWrapper.addEventListener('click', (e) => {
    if (!padlockWrapper.classList.contains('expanded')) {
      e.stopPropagation();
      isHoveringPadlock = false;
      if (AudioEngine) AudioEngine.stopPadlockHop();
      if (stage) stage.classList.add('form-active');
      if (flashlight) flashlight.setVisible(false);
      padlockWrapper.classList.remove('hopping');
      padlockWrapper.classList.add('expanded');
      if (AudioEngine) AudioEngine.playPadlockExpand();
      setTimeout(() => {
        if (usuarioInput) usuarioInput.focus();
      }, 400);
    }
  });

  document.addEventListener('click', (e) => {
    if (!padlockWrapper || !padlockWrapper.classList.contains('expanded')) return;
    if (getIsSubmitting()) return;
    if (padlockWrapper.classList.contains('falling')) return;
    if (document.body.dataset.loginSuccess === 'true') return;
    if (!padlockWrapper.contains(e.target)) {
      padlockWrapper.classList.remove('shake');
      padlockWrapper.classList.remove('expanded');
      padlockWrapper.classList.add('hopping');
      padlockWrapper.dataset.error = 'false';
      if (stage) stage.classList.remove('form-active');
      if (flashlight) {
        flashlight.mouseX = e.clientX;
        flashlight.mouseY = e.clientY;
        flashlight.updatePosition();
        flashlight.setVisible(true);
      }
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
    }
  });

  if (padlockWrapper.dataset.error === 'true') {
    padlockWrapper.classList.remove('hopping');
    padlockWrapper.classList.add('expanded');
    padlockWrapper.classList.add('shake');
    if (AudioEngine) AudioEngine.playShake();
    setTimeout(() => {
      padlockWrapper.classList.remove('shake');
      if (antiqueKey) antiqueKey.classList.remove('turning');
    }, 700);
  }
}
