# Catálogo y Arquitectura de Audio

Resumen del motor de sonido dual, persistencia acústica y catálogo de efectos sonoros de DAWlloween.

---

## 1. Arquitectura de Audio (`app/js/core/audio.js`)

El motor `AudioEngine` gestiona todo el sonido mediante un sistema dual tolerante a fallos:

* **Sistema Dual (Archivos HD + Respaldo Procedural):** Intenta reproducir el archivo de alta fidelidad desde `app/audio/`. Si el archivo no carga o el navegador restringe la reproducción automática (*autoplay*), activa de inmediato síntesis procedimental con la Web Audio API nativa (osciladores, clics mecánicos y zumbidos).
* **Precarga Asíncrona (`AudioEngine.preload()`):** Precarga los clips principales al iniciar cada vista para garantizar latencia cero.
* **Continuidad Acústica Cross-Page (`sessionStorage`):** La pista ambiental interior (`ambiente_interior.ogg`) guarda su posición temporal (`daw_ambient_pos` y `daw_ambient_ts`), reanudándose sin saltos ni reinicios al navegar entre el plano y las dependencias.
* **Silenciado Global:** `AudioEngine.setMute()` y `toggleMute()` silencian tanto pistas HTML5 como nodos de ganancia en Web Audio.

---

## 2. Catálogo de Efectos de Sonido

*Todos los clips fueron generados y remasterizados mediante ElevenLabs SFX y procesados para bucles sin costuras.*

### Audios Compartidos (`app/audio/common/`)
| Archivo | Disparador / Evento |
| :--- | :--- |
| `ambiente_interior.ogg` | Fondo ambiental interior continuo en bucle (*drone* cavernoso y crujidos lejanos). |
| `linterna_click.mp3` | Clic mecánico seco al encender/apagar la linterna (`F`). |
| `papel_examinar.mp3` | Hojeo de documentos, cambio de ficha de recetas, post-it o cartel «Sobre mí». |
| `pasos_madera.mp3` | Pasos pesados sobre tarima sincronizados durante 1.75s con la cortina de transición. |

### Entrada y Acceso (`app/audio/login/`)
| Archivo | Disparador / Evento |
| :--- | :--- |
| `ambiente_noche.ogg` | Fondo exterior nocturno continuo (viento otoñal limpio, sin aves). |
| `candado_salto.mp3` | Saltos rítmicos del candado en reposo (se pausa al situar el cursor encima). |
| `candado_expandir.mp3` | Clic sobre el candado para desplegar el formulario de acceso. |
| `llave_insertar.mp3` | Cursor sobre el ojo de la cerradura. |
| `llave_girar.mp3` | Clic sobre la llave para girar el mecanismo. |
| `candado_error.mp3` | Sacudida violenta por credenciales incorrectas. |
| `candado_desbloqueo.mp3` | Salto elástico del arco del candado tras validación correcta. |
| `candado_caida.mp3` | Impacto del candado al soltarse y caer al suelo. |
| `verja_abrir.mp3` | Chirrido oxidado de las dos hojas de la cancela abriéndose simétricamente. |

### Plano del Colegio (`app/audio/mapa/`)
| Archivo | Disparador / Evento |
| :--- | :--- |
| `bombilla_on.mp3` / `off.mp3` | Encendido agudo ("plink") y apagado ("plonk") de la bombilla de techo. |
| `bombilla_chisporroteo.mp3` | Micro-parpadeo del filamento en penumbra. |
| `mapa_hover.mp3` | Toque táctil tenue al pasar el cursor sobre dependencias, post-it o etiqueta. |
| `puerta_clausurada.mp3` | Cerrojo trabado y cadenas al hacer clic en dependencias selladas. |

### Comedor y Cocinas (`app/audio/recetas/`)
| Archivo | Disparador / Evento |
| :--- | :--- |
| `lampara_tubo_on.mp3` / `off.mp3` | Arranque metálico y conmutador industrial de los tubos fluorescentes. |
| `lampara_tubo_chisporroteo.mp3` | Chisporroteo aleatorio del cebador/starter en penumbra. |
