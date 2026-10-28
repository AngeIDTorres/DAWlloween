export function initNavigation(options = {}) {
  const roomZones = options.roomZones || document.querySelectorAll('.room-zone, .frame-sticker-about');
  const roomsRegistry = options.roomsRegistry || {};
  const AudioEngine = options.audioEngine;

  roomZones.forEach((zone) => {
    const roomId = zone.getAttribute('data-room-id');

    zone.addEventListener('mouseenter', () => {
      if (AudioEngine) AudioEngine.playHover();
    });

    zone.addEventListener('click', (e) => {
      e.stopPropagation();
      const data = roomsRegistry[roomId];
      if (!data) return;

      if (data.target) {
        if (AudioEngine) AudioEngine.playEnter();
        setTimeout(() => {
          window.location.href = data.target;
        }, 220);
      } else {
        if (AudioEngine) AudioEngine.playDenied();
      }
    });
  });
}
