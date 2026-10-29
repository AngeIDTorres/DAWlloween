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
2. **Área Interactiva:** `.dining-interactive-area` (`z-index: 20`). Contiene el contenedor `.recipe-card-container` con la ficha de pergamino y las flechas de navegación góticas (`.nav-arrow`) ancladas a sus flancos laterales centradas verticalmente a media altura (`top: 50%`, `transform: translateY(-50%)`). Se encuentra físicamente por debajo de la oscuridad.
3. **Lámpara de Tubos Colgante (Apagada):** `.dining-hanging-lamp` (`z-index: 50`). Situada detrás del velo de penumbra, requiere el haz de la linterna para verse con claridad. Presenta un ajuste de montaje superior elevado (`top: clamp(-46px, -4.2vw, -24px)`) para reducir la longitud visible de las cadenas de suspensión y una escala ampliada al 1.3x (`width: clamp(325px, 33.8vw, 520px)`). Cuenta con una animación de balanceo armónico adaptado (`diningLampSway` de 8.6s en bucle `ease-in-out infinite`) que combina oscilación angular leve (`±1.3deg`) con deriva horizontal lateral (`±7px`), simulando la inercia pesada de una luminaria industrial colgada de dos cadenas paralelas.
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
