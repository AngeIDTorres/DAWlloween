export function initPostit(options = {}) {
  const framePostit = options.framePostit || document.getElementById('framePostit');
  const postitLinks = options.postitLinks || document.querySelectorAll('.postit-link');
  const roomsRegistry = options.roomsRegistry || {};
  const AudioEngine = options.audioEngine;

  postitLinks.forEach((link) => {
    const roomId = link.getAttribute('data-target');

    link.addEventListener('mouseenter', () => {
      if (AudioEngine) AudioEngine.playHover();
    });

    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const data = roomsRegistry[roomId];
      if (!data || !data.target) return;

      if (AudioEngine) AudioEngine.playEnter();
      setTimeout(() => {
        window.location.href = data.target;
      }, 220);
    });
  });

  if (framePostit) {
    framePostit.addEventListener('click', (e) => {
      if (e.target.closest('.postit-close-btn')) {
        e.stopPropagation();
        framePostit.classList.remove('expanded');
        if (AudioEngine) AudioEngine.playClick();
        return;
      }

      if (e.target.closest('.postit-link')) {
        return;
      }

      if (!framePostit.classList.contains('expanded')) {
        framePostit.classList.add('expanded');
        if (AudioEngine) AudioEngine.playClick();
      }
    });

    document.addEventListener('click', (e) => {
      if (framePostit.classList.contains('expanded') && !framePostit.contains(e.target)) {
        framePostit.classList.remove('expanded');
        if (AudioEngine) AudioEngine.playClick();
      }
    });
  }
}
