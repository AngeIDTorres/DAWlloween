export function initPostit(options = {}) {
  const framePostit = options.framePostit || document.getElementById('framePostit');
  const postitLinks = options.postitLinks || document.querySelectorAll('.postit-link');
  const roomsRegistry = options.roomsRegistry || {};
  const AudioEngine = options.audioEngine;
  let isNavigating = false;

  postitLinks.forEach((link) => {
    const roomId = link.getAttribute('data-target');

    link.addEventListener('mouseenter', () => {
      if (AudioEngine) AudioEngine.playHover();
    });

    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const data = roomsRegistry[roomId];
      if (!data || !data.target) return;
      if (isNavigating) return;
      isNavigating = true;

      if (AudioEngine) {
        if (AudioEngine.playFootsteps) {
          AudioEngine.playFootsteps('audio/common/');
        } else if (AudioEngine.playEnter) {
          AudioEngine.playEnter('audio/common/');
        }
      }
      const blackoutCurtain = document.getElementById('blackoutCurtain');
      if (blackoutCurtain) {
        blackoutCurtain.classList.add('active');
      }
      setTimeout(() => {
        window.location.href = data.target;
      }, 1750);
    });
  });

  if (framePostit) {
    framePostit.addEventListener('mouseenter', () => {
      if (!framePostit.classList.contains('expanded') && AudioEngine) {
        AudioEngine.playHover();
      }
    });

    framePostit.addEventListener('click', (e) => {
      if (e.target.closest('.postit-close-btn')) {
        e.stopPropagation();
        framePostit.classList.remove('expanded');
        if (AudioEngine && AudioEngine.playPaper) AudioEngine.playPaper('audio/common/');
        else if (AudioEngine) AudioEngine.playClick('audio/common/');
        return;
      }

      if (e.target.closest('.postit-link')) {
        return;
      }

      if (!framePostit.classList.contains('expanded')) {
        framePostit.classList.add('expanded');
        if (AudioEngine && AudioEngine.playPaper) AudioEngine.playPaper('audio/common/');
        else if (AudioEngine) AudioEngine.playClick('audio/common/');
      }
    });

    document.addEventListener('click', (e) => {
      if (framePostit.classList.contains('expanded') && !framePostit.contains(e.target)) {
        framePostit.classList.remove('expanded');
        if (AudioEngine && AudioEngine.playPaper) AudioEngine.playPaper('audio/common/');
        else if (AudioEngine) AudioEngine.playClick('audio/common/');
      }
    });
  }
}

