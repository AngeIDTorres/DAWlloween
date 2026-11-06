let loginMessageTimer = null;

export function scheduleLoginMessageDismiss(delay = 4500) {
  if (loginMessageTimer) {
    clearTimeout(loginMessageTimer);
    loginMessageTimer = null;
  }
  const messages = document.querySelectorAll('.plate-alert, .plate-success');
  if (messages.length === 0) return;
  messages.forEach(el => {
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.opacity = '1';
    el.style.display = 'block';
  });
  loginMessageTimer = setTimeout(() => {
    messages.forEach(el => {
      el.style.opacity = '0';
    });
    setTimeout(() => {
      messages.forEach(el => {
        el.style.display = 'none';
      });
      loginMessageTimer = null;
    }, 500);
  }, delay);
}

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
              const container = document.getElementById('plateMessages') || document.querySelector('.plate-content');
              if (container) container.appendChild(alertEl);
            }
            alertEl.textContent = data.error || 'Combinación errónea. Clave rechazada.';
            alertEl.style.display = 'block';
            alertEl.style.opacity = '1';
            scheduleLoginMessageDismiss(4500);
          }, 350);
        }
      })
      .catch(() => {
        loginForm.submit();
      });
    });
  }
}

