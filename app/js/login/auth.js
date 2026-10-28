export function initAuth(options = {}) {
  const loginForm = options.loginForm || document.getElementById('loginForm');
  const padlockWrapper = options.padlockWrapper || document.getElementById('padlockWrapper');
  const keyholeBtn = options.keyholeBtn || document.getElementById('keyholeBtn');
  const antiqueKey = options.antiqueKey || document.getElementById('antiqueKey');
  const AudioEngine = options.audioEngine;
  const onSuccess = options.onSuccess || (() => {});
  const setIsSubmitting = options.setIsSubmitting || (() => {});

  if (keyholeBtn && antiqueKey) {
    keyholeBtn.addEventListener('mouseenter', () => {
      if (padlockWrapper && padlockWrapper.classList.contains('expanded') && !antiqueKey.classList.contains('turning')) {
        if (AudioEngine) AudioEngine.playKeyInsert();
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const userVal = document.getElementById('usuario').value.trim();
      const passVal = document.getElementById('password').value.trim();

      if (!userVal || !passVal) {
        if (antiqueKey) antiqueKey.classList.remove('turning');
        if (padlockWrapper) {
          padlockWrapper.classList.remove('shake');
          void padlockWrapper.offsetWidth;
          padlockWrapper.classList.add('shake');
        }
        if (AudioEngine) AudioEngine.playShake();
        setTimeout(() => {
          if (padlockWrapper) padlockWrapper.classList.remove('shake');
        }, 700);
        return;
      }

      setIsSubmitting(true);
      if (antiqueKey) antiqueKey.classList.add('turning');
      if (AudioEngine) AudioEngine.playKeyTurn();

      const formData = new FormData(loginForm);
      formData.append('ajax', '1');

      fetch('login.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess();
        } else {
          setIsSubmitting(false);
          setTimeout(() => {
            if (antiqueKey) antiqueKey.classList.remove('turning');
            if (padlockWrapper) {
              padlockWrapper.classList.remove('shake');
              void padlockWrapper.offsetWidth;
              padlockWrapper.classList.add('shake');
            }
            if (AudioEngine) AudioEngine.playShake();
            setTimeout(() => {
              if (padlockWrapper) padlockWrapper.classList.remove('shake');
            }, 700);

            let alertEl = document.querySelector('.plate-alert');
            if (!alertEl) {
              alertEl = document.createElement('div');
              alertEl.className = 'plate-alert';
              const plateContent = document.querySelector('.plate-content');
              if (plateContent) plateContent.prepend(alertEl);
            }
            alertEl.textContent = data.error || 'Combinación errónea. Clave rechazada.';
          }, 350);
        }
      })
      .catch(() => {
        loginForm.submit();
      });
    });
  }
}
