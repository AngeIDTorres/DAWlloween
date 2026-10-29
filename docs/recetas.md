# Comedor Escolar y Recetario Temático

## 1. Visión General
El Comedor Escolar (`app/pages/recetas.html`) es la estancia culinaria e interactiva de DAWlloween. Presenta una perspectiva frontal inmersiva a pantalla completa del comedor abandonado sumido en la penumbra. 

Cuenta con el mismo sistema de iluminación inmersiva que el plano escolar (`index.html`):
- **Velo de Oscuridad y Linterna:** La estancia, la bandeja, las flechas y la ficha de receta están situadas detrás del velo de penumbra, siendo exploradas dinámicamente mediante el haz de la linterna guiada por el cursor del ratón (o alternada mediante la tecla `F`).
- **Lámpara Colgante de Tubos:** Lámpara industrial suspendida en el techo que parpadea aleatoriamente con chispas de audio. Al hacer clic sobre ella, conmuta entre encendido/apagado general de la sala, revelando toda la escena, activando el zumbido de reactancia y restaurando el cursor estándar.

---

## 2. Estructura de Archivos
- **Vista principal:** `app/pages/recetas.html`
- **Estilos:** `app/css/recetas.css` (hereda `app/css/globals.css`)
- **Controlador e interacción:** `app/js/recetas.js`
- **Módulos core reutilizados:**
  - `app/js/core/flashlight.js` (`FlashlightController`)
  - `app/js/map/hanging-lamp.js` (`initHangingLamp`)
  - `app/js/core/audio.js` (`AudioEngine`)
- **Modelo de datos:** `app/js/data/recetasData.js`
- **Assets gráficos:** `app/img/recetas/`
  - `bg_comedor.png` (2752x1536): Fondo del comedor nocturno con luz difusa fría y bandeja metálica integrada.
  - `ficha_receta.png` (1792x2400): Pergamino con bordes quemados, textura rústica y marco ilustrado interior.
  - `flecha_navegacion_izquierda.png` (1024x1024): Flecha gótica orientada a la izquierda (◄).
  - `flecha_navegacion_derecha.png` (1024x1024): Flecha gótica orientada a la derecha (►).
  - `receta_dedos_bruja.png` (1024x1024): Ilustración del plato "Dedos de bruja de galleta" con canal alfa transparente.
  - `receta_momias_salchicha.png` (1024x1024): Ilustración del plato "Momias de salchicha y hojaldre" con canal alfa transparente.
  - `receta_pizzas_arana.png` (1024x1024): Ilustración del plato "Mini pizzas de araña" con canal alfa transparente.
  - `receta_ojos_gelatina.png` (1024x1024): Ilustración del plato "Ojos de gelatina" con canal alfa transparente.
  - `receta_pocion_humeante.png` (1024x1024): Matraz de vidrio con humo ámbar translúcido y fondo blanco extraído mediante desmultiplicación alfa.
  - `receta_fantasmas_platano.png` (1024x1024): Ilustración del plato "Fantasmas de plátano y chocolate" con canal alfa transparente.
  - `receta_bocas_manzana.png` (1024x1024): Ilustración del plato "Bocas de manzana monstruosas" con canal alfa transparente.
  - `lampara_tubo_off.png` / `lampara_tubo_on.png` (2516x1317): Luminaria industrial doble fluorescente recortada con canal alfa transparente y montaje flush al techo.

---

## 3. Modelo de Datos (`RECETAS_DATA`)
Cada receta en `app/js/data/recetasData.js` cuenta con el siguiente esquema:
```javascript
{
  id: "receta-01",
  nombre: "Dedos de bruja de galleta",
  tiempo_minutos: 35,
  ingredientes: "Masa quebrada dulce, almendras tostadas enteras, confitura espesa de frutos del bosque.",
  elaboracion: "Talla los nudillos con ligeros cortes horizontales y fija las uñas de almendra con la mermelada sangrienta antes del horneado.",
  imagen: "../img/recetas/receta_dedos_bruja.png"
}
```

---

## 4. Capas de Renderizado y Profundidad (Z-Index)
1. **Fondo de Escenario:** `.dining-stage` (`z-index: 0`).
2. **Área Interactiva:** `.dining-interactive-area` (`z-index: 20`). Contiene el contenedor `.recipe-card-container` con la ficha de pergamino y las flechas de navegación góticas (`.nav-arrow`). Se encuentra físicamente por debajo de la oscuridad.
3. **Lámpara de Tubos Colgante (Apagada):** `.dining-hanging-lamp` (`z-index: 50`). Situada detrás del velo de penumbra, requiere el haz de la linterna para verse con claridad. Presenta un ajuste de montaje superior calibrado (`top: clamp(-54px, -4.5vh, -28px)`) y escala reactiva (`width: clamp(220px, 18.5vw, 360px); aspect-ratio: 2516 / 1317`). Cuenta con una animación de balanceo armónico adaptado (`diningLampSway` de 8.6s en bucle `ease-in-out infinite`) que combina oscilación angular leve (`±1.3deg`) con deriva horizontal lateral (`±7px`), simulando la inercia pesada de una luminaria industrial colgada de dos cadenas paralelas.
4. **Velo de Penumbra:** `.dining-darkness-veil` (`z-index: 60`, `pointer-events: none`). Oculta el fondo, la ficha y la lámpara apagada.
5. **Lámpara de Tubos (Encendida o Parpadeando):** `.dining-stage.room-lit .dining-hanging-lamp`, `.dining-hanging-lamp.lamp-flickering` (`z-index: 65`). Se eleva sobre la penumbra para proyectar su brillo. Su halo perimetral (`.lamp-glow-aura`) y el haz cónico proyectado hacia la ficha y la mesa (`.lamp-light-cone`) están calibrados en tono fluorescente blanco neutro `#f2efe4` (`rgba(242, 239, 228, ...)`), erradicando el matiz amarillento de tungsteno reservado para la bombilla incandescente del mapa en `index.html`.
6. **Haz de Linterna:** `.dining-flashlight` (`z-index: 70`, `pointer-events: none`). Proyecta luz animada sobre el cursor.
7. **Botón Volver al Plano:** `.dining-back-btn` (`z-index: 100`, `pointer-events: auto`). Siempre visible en la esquina superior izquierda.

---

## 5. Efectos de Sonido Integrados
- **Linterna (`F`):** `AudioEngine.playClick()` al encender/apagar el foco manual.
- **Parpadeos Espontáneos:** `AudioEngine.playTubeLampFlicker()` reproduce el chisporroteo del cebador fluorescente (`lampara_tubo_chisporroteo.mp3`).
- **Encendido de Luminaria:** `AudioEngine.playTubeLampOn()` reproduce el "plink" metálico de arranque de tubos (`lampara_tubo_on.mp3`).
- **Apagado de Luminaria:** `AudioEngine.playTubeLampOff()` reproduce el conmutador mecánico pesado "plonk" (`lampara_tubo_off.mp3`).
- **Transición de Recetas:** `AudioEngine.playPaper()` al deslizar fichas con las flechas o teclado.
- **Ambiente General:** `AudioEngine.playAmbientInterior()` sincronizado de forma continua mediante `sessionStorage` (`daw_ambient_pos` y `daw_ambient_ts`), ejecutado automáticamente en `DOMContentLoaded` para mantener el fondo continuo sin cortes al transicionar entre dependencias.
- **Navegación y Pasos:** `AudioEngine.playFootsteps()` activado al pulsar «VOLVER AL PLANO» o tecla `[Escape]`, con retardo de 1.75s que sincroniza la cadencia completa de `pasos_madera.mp3` con el telón de fundido a negro.

---

## 6. Arquitectura Responsiva y Posicionamiento Centrado

Para asegurar una visualización equilibrada en todo tipo de pantallas (2560x1440, 1920x1080, tablets y móviles) y eliminar solapamientos tanto con los embellecedores del pergamino como con la lámpara de techo:

1. **Centrado Absoluto en Pantalla con Escala Ampliada (+25%):**
   ```css
   .recipe-card-container {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     width: min(88vw, 675px, calc(87.5vh * (1792 / 2400)));
     aspect-ratio: 1792 / 2400;
     max-height: min(87.5vh, 900px);
     z-index: 20;
     pointer-events: auto;
     container-type: size;
   }
   ```
   La ficha se posiciona en el centro de la pantalla escalada un 25% más respecto a su tamaño base original (anchura de 540px a 675px y altura máxima de 720px a 900px). La luminaria superior se calibra a una cota equilibrada (`top: clamp(-54px, -4.5vh, -28px); width: clamp(220px, 18.5vw, 360px)`), dejando visibles sus cadenas colgantes y manteniendo una perspectiva espacial natural. Al ser hijos directos del contenedor, los botones góticos laterales (`.nav-arrow`) acompañan verticalmente a la ficha manteniéndose centrados en todo momento.

2. **Protección de Ornamentos Superior e Inferior del Pergamino:**
   El gráfico de pergamino (`ficha_receta.png`, 1792x2400) presenta ornamentos góticos tanto en su cabecera (y=0 a y=400px, 16.7%) como en su base (y=2030 a y=2260px, comenzando en el 84.6% desde la parte superior, es decir, a un 15.4% del borde inferior).
   El acolchado de `.recipe-card-content` se calibra al `padding: 19% 18% 18.5% 18%`:
   - El **19% superior** garantiza que el título comience por debajo de los remates de la cabecera.
   - El **18.5% inferior** sitúa el pie de ficha (`.recipe-footer`) y el contador (`RECETA x / 7`) limpiamente por encima de los ornamentos góticos de la base, evitando cualquier solapamiento visual.

3. **Tipografía Fluida Continua (Container Queries `cqmin`):**
   Los títulos y textos emplean unidades relativas al contenedor (`cqmin`) con límites elásticos aumentados en proporción al 25% (`clamp(0.55rem, 3.7cqmin, 1.85rem)` en títulos, `clamp(0.38rem, 2.05cqmin, 0.95rem)` en bloques de texto, `clamp(0.44rem, 2.3cqmin, 1.0rem)` en metadatos y `clamp(0.44rem, 2.3cqmin, 1.02rem)` en contador), asegurando legibilidad sin desbordamientos al variar el tamaño de la ventana.

4. **Adaptación Móvil y Viewports Compactos:**
   - En viewports estrechos (`@media (max-width: 900px)`), las flechas se fijan a los laterales de la pantalla (`position: fixed; top: 50%; left/right: clamp(6px, 1.8vw, 16px)`), mientras que la ficha preserva su centrado vertical (`top: 50%; transform: translate(-50%, -50%)`), dimensiones escaladas (`width: min(84vw, 450px, calc(76vh * (1792 / 2400))); max-height: min(76vh, 600px)`) y sangrado protector (`padding: 19% 15% 18.5% 15%`).
   - En pantallas apaisadas de baja altura (`@media (max-height: 600px)`), la lámpara se compacta a `top: -40px` y la tarjeta ajusta su altura al `76vh` centrado con padding protegido `18% 13% 18% 13%`.
