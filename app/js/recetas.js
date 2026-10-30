import { AudioEngine } from './core/audio.js?v=20261029_11';
import { RECETAS_DATA } from './data/recetasData.js';
import { FlashlightController } from './core/flashlight.js';
import { initHangingLamp } from './map/hanging-lamp.js?v=20261029_11';
import { initAccessibility } from './core/accessibility.js?v=20261029_13';

document.addEventListener('DOMContentLoaded', () => {
  AudioEngine.init();
  AudioEngine.playAmbientInterior('../audio/common/');

  const blackoutCurtain = document.getElementById('blackoutCurtain');
  if (blackoutCurtain) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        blackoutCurtain.classList.remove('active');
      }, 50);
    });
  }

  let currentIndex = 0;
  let isTransitioning = false;
  let isNavigatingBack = false;
  const totalRecipes = RECETAS_DATA.length;

  const diningStage = document.getElementById('diningStage');
  const darknessVeil = document.getElementById('diningDarknessVeil');
  const hangingLamp = document.getElementById('diningHangingLamp');
  const prevBtn = document.getElementById('prevRecipeBtn');
  const nextBtn = document.getElementById('nextRecipeBtn');
  const card = document.getElementById('recipeCard');
  const counterEl = document.getElementById('recipeCounter');
  const titleEl = document.getElementById('recipeTitle');
  const imageEl = document.getElementById('recipeImage');
  const timeEl = document.getElementById('recipeTime');
  const ingredientsEl = document.getElementById('recipeIngredients');
  const elaborationEl = document.getElementById('recipeElaboration');

  let accessibility = null;

  const navigateBackToMap = () => {
    if (isNavigatingBack) return;
    isNavigatingBack = true;
    if (AudioEngine) {
      if (AudioEngine.playFootsteps) {
        AudioEngine.playFootsteps('../audio/common/');
      } else if (AudioEngine.playEnter) {
        AudioEngine.playEnter('../audio/common/');
      }
    }
    if (blackoutCurtain) {
      blackoutCurtain.classList.add('active');
    }
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1750);
  };

  const flashlight = new FlashlightController({
    elementId: 'diningFlashlight',
    stageSelector: '.dining-stage',
    cssVarPrefix: '--dining-light',
    enableKeyToggle: true,
    onToggle: (isOn) => {
      if (isOn) {
        if (darknessVeil) darknessVeil.classList.remove('lights-off');
        if (diningStage) diningStage.classList.remove('cursor-visible');
      } else {
        if (darknessVeil) darknessVeil.classList.add('lights-off');
        if (diningStage) diningStage.classList.add('cursor-visible');
      }
      AudioEngine.playClick('../audio/common/');
      if (accessibility) {
        accessibility.state.flashlight = isOn;
        accessibility.saveState();
        accessibility.updateUI();
      }
    }
  });

  const lampController = initHangingLamp({
    hangingLamp,
    mapStage: diningStage,
    audioEngine: AudioEngine,
    audioBasePath: '../audio/recetas/',
    lampType: 'tube',
    onToggle: (isLit) => {
      if (accessibility) {
        accessibility.onLampToggle(isLit);
      }
    }
  });

  accessibility = initAccessibility({
    audioEngine: AudioEngine,
    flashlightController: flashlight,
    lampController: lampController,
    onNavigateMap: navigateBackToMap,
    isMapPage: false
  });

  AudioEngine.preload([
    'lampara_tubo_on.mp3',
    'lampara_tubo_off.mp3',
    'lampara_tubo_chisporroteo.mp3'
  ], '../audio/recetas/');

  AudioEngine.preload([
    'linterna_click.mp3',
    'papel_examinar.mp3',
    'pasos_madera.mp3',
    'ambiente_interior.ogg'
  ], '../audio/common/');

  function renderRecipe(index) {
    const data = RECETAS_DATA[index];
    if (!data) return;

    if (counterEl) counterEl.textContent = `RECETA ${index + 1} / ${totalRecipes}`;
    if (titleEl) titleEl.textContent = data.nombre || '';
    if (imageEl) {
      imageEl.src = data.imagen || '../img/recetas/receta_dedos_bruja.png';
      imageEl.alt = data.nombre || 'Receta de Halloween';
      imageEl.onerror = () => {
        imageEl.src = '../img/recetas/receta_dedos_bruja.png';
      };
    }
    if (timeEl) timeEl.textContent = `${data.tiempo_minutos || 0} min`;
    if (ingredientsEl) ingredientsEl.textContent = data.ingredientes || '';
    if (elaborationEl) elaborationEl.textContent = data.elaboracion || '';
  }

  function navigate(direction) {
    if (isTransitioning || totalRecipes <= 1) return;
    isTransitioning = true;

    AudioEngine.playPaper('../audio/common/');

    const exitClass = direction > 0 ? 'card-anim-exit-next' : 'card-anim-exit-prev';
    const enterClass = direction > 0 ? 'card-anim-enter-next' : 'card-anim-enter-prev';

    if (card) card.classList.add(exitClass);

    setTimeout(() => {
      currentIndex = (currentIndex + direction + totalRecipes) % totalRecipes;
      renderRecipe(currentIndex);

      if (card) {
        card.classList.remove(exitClass);
        card.classList.add(enterClass);
        void card.offsetWidth;

        requestAnimationFrame(() => {
          card.classList.remove(enterClass);
          setTimeout(() => {
            isTransitioning = false;
          }, 240);
        });
      } else {
        isTransitioning = false;
      }
    }, 220);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      startAmbientOnInteraction();
      navigate(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      startAmbientOnInteraction();
      navigate(1);
    });
  }

  window.addEventListener('keydown', (e) => {
    startAmbientOnInteraction();
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      navigate(-1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      navigate(1);
    } else if (e.key === 'Escape') {
      navigateBackToMap();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    startAmbientOnInteraction();
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        navigate(-1);
      } else {
        navigate(1);
      }
    }
  }, { passive: true });

  function startAmbientOnInteraction() {
    AudioEngine.init();
    AudioEngine.playAmbientInterior('../audio/common/');
  }

  document.body.addEventListener('click', startAmbientOnInteraction, { once: true });
  document.body.addEventListener('keydown', startAmbientOnInteraction, { once: true });

  renderRecipe(currentIndex);
});
