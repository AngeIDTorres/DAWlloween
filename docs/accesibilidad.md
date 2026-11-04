# Panel de Accesibilidad y Control (Busca / Mensáfono Retro)

Resumen del centro de control temático unificado para navegación, iluminación y sonido de DAWlloween.

---

## 1. Visión General

El panel de accesibilidad (`.accessibility-pager`) está inspirado en un mensáfono o busca noventero con carcasa rugerizada y pantalla LCD ámbar:

* **Disponibilidad:** Activo en las vistas de exploración interactiva (`index.php` y `pages/recetas.php`). Excluido de la entrada (`login.php`) y del expediente (`aboutus.php`).
* **Ubicación:** Fijado por defecto en la esquina superior izquierda del viewport, con libertad de reubicación mediante arrastre.
* **Módulos Sincronizados:** Sincroniza en tiempo real el motor de sonido (`audio.js`), el haz de linterna (`flashlight.js`) y la luminaria de sala (`hanging-lamp.js`).

---

## 2. Controles, Atajos y Acciones

El dispositivo cuenta con una pantalla LCD de 4 iconos y 5 pulsadores físicos inferiores:

| Pulsador | Tecla | Icono LCD | Pulsador Físico | Comportamiento |
| :---: | :---: | :---: | :---: | :--- |
| **1º** | `Esc` | Mapa | Flecha retorno | En páginas interiores (`recetas.php`), reproduce pasos de madera y cortina oscura regresando a `index.php`. En el mapa, emite feedback de ubicación activa. |
| **2º** | `F` | Linterna | Linterna táctica | Alterna el haz de la linterna. Si la luz fija de sala está encendida, se bloquea con cursor `not-allowed`. |
| **3º** | `L` | Bombilla | Bombilla radiante | Conmuta la luz fija de la estancia. Al encenderla, apaga y bloquea automáticamente la linterna. |
| **4º** | `M` | Altavoz | Altavoz cancelado | Alterna el silenciado global de audio (`AudioEngine.toggleMute()`). |
| **5º** | - | - | Candado cerrado / abierto | Desbloquea el dispositivo para permitir moverlo libremente por la pantalla mediante arrastre (*Drag & Drop*). |

*Cada pulsación emite un sutil pitido digital sintetizado (`playBeep()`).*

---

## 3. Persistencia de Preferencias (`localStorage`)

Los ajustes y la posición del dispositivo se almacenan en el navegador bajo la clave `daw_accessibility_state`, conservando las preferencias entre cambios de página y recargas:

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

* **Silencio (`muted`):** Bloquea de inmediato la ganancia ambiental de Web Audio y cualquier efecto de sonido.
* **Exclusión de Linterna (`lights`):** Con sala iluminada, la linterna permanece inhabilitada; al apagar la sala, la linterna se reactiva automáticamente.
* **Posición (`normX`, `normY`):** Guarda las coordenadas normalizadas relativas a la ventana para reposicionar el aparato fielmente al redimensionar la pantalla.
