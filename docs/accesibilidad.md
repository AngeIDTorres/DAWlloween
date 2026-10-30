# Panel de Accesibilidad y Control (Busca / Mensáfono Retro)

## 1. Visión General
El Panel de Accesibilidad (`.accessibility-pager`) proporciona un centro de control unificado, accesible y temático, inspirado visualmente en un mensáfono o busca militar/médico de los años 90 (`Referencia_Busca_Accesibilidad.jpg`).

Se sitúa por defecto en la esquina superior izquierda (`top: 1.25rem; left: 1.25rem; z-index: 95`) y está activo en todas las páginas interactivas de la experiencia escolar (`index.html`, `pages/recetas.html`), permaneciendo expresamente excluido de la portada de acceso (`login.php`) y del modal de autor (`aboutus.html`).

---

## 2. Arquitectura de Componentes
- **Controlador principal:** `app/js/core/accessibility.js` (`AccessibilityManager`, `initAccessibility`).
- **Hoja de estilos:** `app/css/accessibility.css`.
- **Integración:**
  - `app/index.html` y `app/js/map.js`
  - `app/pages/recetas.html` y `app/js/recetas.js`
- **Módulos sincronizados:**
  - `app/js/core/audio.js` (`AudioEngine.setMute()`, `AudioEngine.toggleMute()`).
  - `app/js/core/flashlight.js` (`FlashlightController.setOn()`, `FlashlightController.toggle()`, `FlashlightController.setDisabled()`).
  - `app/js/map/hanging-lamp.js` (`initHangingLamp.turnOn()`, `turnOff()`, `toggle()`, `isLit()`).
- **Assets gráficos de pantalla LCD (`app/img/common/accesibilidad/`):**
  - `busca_cuerpo.png`: Carcasa rugerizada noventera recortada con canal alfa limpio y ventana LCD transparente.
  - `busca_pantalla_bg.png`: Textura oscura de matriz de fósforo ámbar con viñeta.
  - `icono_mapa.png`: Icono LCD ámbar monocromo de plano arquitectónico y flecha cardinal.
  - `icono_linterna.png`: Icono LCD ámbar monocromo de linterna táctica industrial con haz cónico.
  - `icono_luces.png`: Icono LCD ámbar monocromo de bombilla incandescente radiante.
  - `icono_mute.png`: Icono LCD ámbar monocromo de altavoz con aspa diagonal de cancelación sonora.
- **Assets gráficos de pulsadores físicos (`app/img/common/accesibilidad/`):**
  - `btn_mapa.png`: Símbolo stencil ámbar de flecha de retorno ◄ sobre el pulsador.
  - `btn_linterna.png`: Símbolo stencil ámbar de linterna táctica sobre el pulsador.
  - `btn_luces.png`: Símbolo stencil ámbar de bombilla radiante sobre el pulsador.
  - `btn_mute.png`: Símbolo stencil ámbar de altavoz cancelado sobre el pulsador.
  - `btn_lock.png`: Símbolo stencil ámbar de candado cerrado para estado bloqueado.
  - `btn_lock_open.png`: Símbolo stencil ámbar de candado abierto para estado desbloqueado (móvil).

---

## 3. Modelo de Persistencia (`localStorage`)
Todos los ajustes de accesibilidad y la posición del aparato se almacenan en el navegador bajo la clave `daw_accessibility_state`. Al navegar entre diferentes salas (por ejemplo, del plano escolar al comedor escolar o viceversa), las preferencias se restauran automáticamente sin requerir interacción adicional:

```json
{
  "muted": false,
  "flashlight": true,
  "lights": false,
  "locked": true,
  "normX": null,
  "normY": null
}
```

### Comportamiento de Restauración y Sincronización:
1. **Silencio de Audio (`muted`):** Si está activo, silencia inmediatamente el `ambientAudio` HTML5, anula la ganancia de WebAudio (`ambientGain`, `bulbHumGain`, `ambientNode`) y bloquea la reproducción de cualquier efecto de sonido (`playFileOrFallback`).
2. **Iluminación de Sala y Exclusión de Linterna (`lights` / `flashlight`):**
   - Cuando las luces de la sala están encendidas (`lights: true`), la linterna se apaga forzosamente (`setOn(false)`), se desactiva del estado del busca y se deshabilita por completo (`setDisabled(true)`).
   - Tanto la tecla `F` como el clic sobre el botón de linterna (físico o LCD) quedan bloqueados. El icono y el pulsador permanecen siempre visibles en pantalla en estado pasivo/desactivado con cursor `not-allowed`, sin desaparecer de la interfaz.
   - Al apagar las luces de la sala, la linterna se reactiva y vuelve a encenderse automáticamente para iluminar el escenario oscuro.
3. **Posición en Pantalla (`normX`, `normY`):** Si el usuario movió el busca mientras estaba desbloqueado, las coordenadas relativas al viewport se guardan y se aplican fielmente al cargar cualquier página y durante eventos de redimensionamiento (`resize`).

---

## 4. Controles y Orden de Botones del Busca

El dispositivo cuenta con una interfaz dual con 4 iconos simétricos en la pantalla LCD y 5 pulsadores físicos inferiores con gráficos integrados directos sin rebordes redundantes:

| Nº | Acción | Tecla | Icono LCD | Pulsador Físico | Descripción Técnica |
|---|---|---|---|---|---|
| **1º** | **Volver al Mapa** | `Esc` | `icono_mapa.png` | `btn_mapa.png` | En páginas interiores (`recetas.html`), ejecuta la transición con cortinilla oscura (`blackoutCurtain`) y pasos de madera (`pasos_madera.mp3`) redirigiendo a `index.html`. En el mapa, emite feedback de ubicación activa. |
| **2º** | **Linterna (Flash)** | `F` | `icono_linterna.png` | `btn_linterna.png` | Alterna el controlador `FlashlightController`. Bloqueado e inerte si la luz de la sala está encendida (mantiene visibilidad pasiva). |
| **3º** | **Luces Fijas de Sala** | `L` | `icono_luces.png` | `btn_luces.png` | Conmuta la iluminación fija de la sala (bombilla en el plano o luminaria fluorescente en el comedor). Al activarse apaga y deshabilita la linterna. |
| **4º** | **Silenciar (Mute)** | `M` | `icono_mute.png` | `btn_mute.png` | Conmuta globalmente el audio mediante `AudioEngine.toggleMute()`. |
| **5º** | **Bloquear / Desbloquear** | - | - | `btn_lock.png` / `btn_lock_open.png` | Alterna el bloqueo de posición. Por defecto está bloqueado (`btn_lock.png`). Al desbloquearse conmuta a candado abierto (`btn_lock_open.png`), el cursor pasa a modo arrastre (`grab`/`grabbing`) y mantener el clic izquierdo en cualquier parte del cuerpo permite mover libremente el busca por el viewport. |

---

## 5. Diseño Visual, LCD y Drag & Drop
- **Carcasa Rugerizada:** Estilo militar/médico de los 90 con tornillería perimetral, clip metálico superior y corte alfa sin velos blancos ni halos residuales.
- **Pantalla LCD Oscura con Fósforo Ámbar:** Fondo de matriz oscura con velo translúcido de contraste (`rgba(10, 12, 8, 0.45)`) e iconos en resplandor ámbar `#e5be53` distribuidos en cuadrícula simétrica de 4 columnas que ocupan todo el ancho de visualización.
- **Pulsadores Físicos Integrados:** Coordenadas de los 5 botones con gráficos stencil transparentes serigrafiados directamente en el pulsador, sin marcos ni bordes ámbar adicionales.
- **Sistema Drag & Drop:** Manejadores mediante API `PointerEvent` (`pointerdown`, `pointermove`, `pointerup`) con captura de puntero (`setPointerCapture`), acotación estricta a los límites de pantalla y filtrado para no interferir con las pulsaciones táctiles o de ratón de los botones de función.
- **Feedback Sonoro:** Cada pulsación física emite un sutil pitido digital sintetizado (`playBeep()`, 2600-3200Hz por WebAudio) que respeta el estado de silencio.
- **Diseño Adaptativo (Responsive):** Proporción fija del chasis (`aspect-ratio: 2408 / 1800`) y ancho fluido de `clamp(175px, 16vw, 270px)`.
