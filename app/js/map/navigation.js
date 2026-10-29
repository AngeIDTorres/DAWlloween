export function initNavigation(options = {}) {
  const roomZones = options.roomZones || document.querySelectorAll('.room-zone, .frame-sticker-about');
  const stickerAbout = options.stickerAbout || document.getElementById('frameStickerAbout');
  const roomsRegistry = options.roomsRegistry || {};
  const AudioEngine = options.audioEngine;
  let isNavigating = false;

  const bindZone = (zone) => {
    if (!zone) return;
    const roomId = zone.getAttribute('data-room-id');

    zone.addEventListener('mouseenter', () => {
      if (AudioEngine) AudioEngine.playHover();
    });

    zone.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const data = roomsRegistry[roomId];
      if (!data) return;

      if (roomId === 'archivo') {
        const aboutBackdrop = document.getElementById('aboutBackdrop');
        const aboutModal = document.getElementById('aboutModalContainer');
        if (aboutBackdrop && aboutModal) {
          if (AudioEngine) AudioEngine.playPaper('audio/common/');
          aboutBackdrop.classList.add('active');
          aboutModal.classList.add('active');
          if (typeof options.onOpenAbout === 'function') {
            options.onOpenAbout();
          }
          return;
        }
      }

      if (data.target) {
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
      } else {
        if (AudioEngine) AudioEngine.playDenied();
      }
    });
  };

  roomZones.forEach(bindZone);
  if (stickerAbout && !Array.from(roomZones).includes(stickerAbout)) {
    bindZone(stickerAbout);
  }
}

