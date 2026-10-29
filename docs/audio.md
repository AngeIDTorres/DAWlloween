# Catálogo de Efectos de Sonido y Prompts para ElevenLabs

Este documento define la arquitectura de audio del proyecto DAWlloween, el sistema dual de reproducción (archivos de audio en alta definición con respaldo sintético procedural) y los prompts de generación para la herramienta de efectos de sonido de ElevenLabs (https://elevenlabs.io/sound-effects).

---

## 1. Arquitectura de Audio (`app/js/core/audio.js`)

El motor de audio `AudioEngine` implementa un flujo dual tolerante a fallos:
1. **Precarga Proactiva (`AudioEngine.preload()`):** Se precargan de forma asíncrona todos los efectos de sonido primarios al iniciar cada vista (`login.php` e `index.html`), garantizando latencia cero en los eventos de interacción.
2. **Fondos Ambientales Optimizados en OGG Vorbis:**
   * **`ambiente_noche.ogg`:** Fondo exterior nocturno de 10 segundos remasterizado sin estridencias (sin canto de búho), comprimido a 159 KB en OGG Vorbis con bucle continuo sin costuras y decodificación en Web Audio API mediante `AudioBufferSourceNode`.
   * **`ambiente_interior.ogg`:** Fondo interior del colegio clausurado para el plano arquitectónico (`app/index.html`) y dependencias interiores (`app/pages/recetas.html`), remasterizado con fundido cruzado continuo (9.2 s) y reproducción sample-accurate persistente mediante `AudioBufferSourceNode` (`loop = true`). Se inicia de forma inmediata en `DOMContentLoaded` y preserva el offset de reproducción temporal a través de `sessionStorage` (`daw_ambient_pos` y `daw_ambient_ts`), eliminando pausas, reinicios o silencios al conmutar de página.
3. **Prioridad Primaria con Respaldo Automático (`playFileOrFallback`):** Intenta reproducir el archivo de sonido de alta fidelidad ubicado en `app/audio/`. Si el archivo aún no ha sido generado o el navegador bloquea la carga/reproducción por restricciones de autoplay, se activa inmediatamente el respaldo sintetizado con la API Web Audio nativa (clicks táctiles limpios, interruptores mecánicos y zumbido tenue de filamento a 60 Hz).
4. **Control Dinámico de Estados:**
   * `stopPadlockHop()`: Pausa y reinicio del sonido de saltitos del candado en hover.
   * `playBulbOn()` / `playBulbOff()`: Encendido ("plink" agudo) y apagado ("plonk" grave) de la bombilla de techo en el mapa. Sin zumbidos continuos.
   * `playTubeLampOn()` / `playTubeLampOff()`: Encendido ("plink" metálico de arranque de tubo) y apagado ("plonk" de conmutación industrial) de la luminaria fluorescente en el comedor.
   * `playBulbFlicker()` / `playTubeLampFlicker()`: Chisporroteos aleatorios en penumbra para bombilla incandescente y tubo fluorescente respectivamente.
   * `playHover()`: Reproducción táctil de `mapa_hover.mp3` con control de estrangulamiento (`throttle` de 110 ms) y nivel balanceado (`volume = 0.40`).

---

## 2. Catálogo de Audios para la Fachada y Entrada (`app/pages/login.php`)

Archivos exportados ubicados en la ruta `app/audio/login/`:

| Archivo | Estado | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- | :--- |
| **`candado_salto.mp3`** | Generado | Salto periódico del candado pequeño en reposo (`padlockHop`). Se pausa/detiene al hacer hover (`stopPadlockHop()`). | 0.8 s | `Small antique iron padlock hopping and bouncing with a light metallic jingle, subtle chain link clinks, gentle iron rattle on metal latch, short subtle cartoonish yet realistic spooky foley` |
| **`candado_expandir.mp3`** | Generado | Click sobre el candado pequeño inicial para expandirlo a tamaño completo. | 1.5 s | `A heavy antique iron padlock suddenly jerking and expanding on rusty metal chains, deep hollow metallic thud, dark gothic dungeon sound effect, close-up, high detail` |
| **`llave_insertar.mp3`** | Generado | Hover del cursor sobre el ojo de la cerradura. | 1.0 s | `Inserting an antique iron skeleton key into an old lock keyhole, subtle metallic friction, gentle scrape against aged brass and iron, crisp high-frequency foley, close-up` |
| **`llave_girar.mp3`** | Generado | Click sobre la cerradura para girar la llave. | 1.2 s | `Turning an antique heavy skeleton key inside a massive rusted padlock, deep mechanical ratchet click, heavy spring tension, tumblers turning, crisp mechanical lock click` |
| **`candado_error.mp3`** | Generado | Rechazo por credenciales incorrectas (sacudida del candado). | 1.5 s | `Violent shaking of heavy iron chains and rusted padlock rattling violently against iron bars, dull aggressive metal rattling, mechanism jamming shut` |
| **`candado_desbloqueo.mp3`** | Generado | Salto elástico del arco del candado (`candado_arco.png`). | 1.5 s | `A heavy iron padlock latch suddenly springing open, loud sharp mechanical metallic snap and pop, spring-loaded shackle unlatching with metallic resonance` |
| **`candado_caida.mp3`** | Generado | Desprendimiento y caída del candado al suelo. | 2.0 s | `Heavy iron padlock falling off metal chains and dropping onto wet stone ground, dull heavy metallic impact with loose chain links clinking` |
| **`verja_abrir.mp3`** | Generado | Apertura simultánea de las hojas batientes de la cancela. | 3.5 s | `Old rusty wrought iron gate hinge squeaking and creaking slowly, dry metal on metal friction, antique rusted iron gate opening, realistic high-pitched metallic squeaks and hinges, quiet eerie atmospheric resonance, foley sound effect` |
| **`ambiente_noche.ogg`** | Generado | Fondo ambiental nocturno en bucle continuo de alta fidelidad (versión limpia sin búho). | 10.0 s | `Cold autumn night wind blowing, crisp dry fallen leaves rustling and skittering on ground, subtle eerie atmospheric drone, dark quiet Halloween night ambience, seamless looping foley, no bird calls` |

---

## 3. Catálogo de Audios Compartidos y Transiciones (`app/audio/common/`)

Archivos ubicados en la ruta `app/audio/common/` reutilizados transversalmente en múltiples dependencias:

| Archivo | Estado | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- | :--- |
| **`ambiente_interior.ogg`** | Generado | Fondo ambiental interior en bucle continuo sample-accurate (`AudioBufferSourceNode`) para el plano escolar y dependencias. | 10.0 s | `Low ominous interior drone inside a cavernous abandoned building, faint wind whistling through cracked window panes, distant subtle wood creak, eerie horror ambience, seamless loop` |
| **`linterna_click.mp3`** | Generado | Encendido y apagado de la linterna manual mediante tecla `[F]` o icono. Click táctil seco sin chispas. | 0.5 s | `A single crisp tactile button click on a small handheld plastic flashlight, clean dry single click switch sound effect, no sparks, no power hum, minimal close-up foley` |
| **`papel_examinar.mp3`** | Generado | Manipulación de documentos rústicos, post-it de índice, ficha de recetas y cartela «Sobre mí». | 0.8 s | `Turning a single crisp paper page of an old book, gentle clean dry page flip, delicate paper friction, close-up book page turning sound effect` |
| **`pasos_madera.mp3`** | Generado | Transición entre salas del colegio mediante clic en plano, post-it o regreso («VOLVER AL PLANO»). Se sincroniza con el telón de oscuridad (`blackoutCurtain`) durante 1.75 s para completar la cadencia completa de pasos sin cortes abruptos mid-stride. | 1.8 s | `Slow deliberate footsteps creaking and echoing down a dusty old wooden floorboard corridor, ominous hollow wooden floor creaks, abandoned institutional hall acoustics` |

---

## 4. Catálogo de Audios para Mapa y Navegación (`app/audio/mapa/`)

Archivos ubicados en la ruta `app/audio/mapa/`:

| Archivo | Estado | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- | :--- |
| **`puerta_clausurada.mp3`** | Generado | Clic sobre dependencias selladas con aspas judiciales («INACCESIBLE»). | 1.2 s | `Heavy iron padlock and thick chain links violently rattling against a deadbolted solid wood door, muffled heavy thud, locked door refusal, abandoned school horror foley` |
| **`mapa_hover.mp3`** | Generado | Cursor sobre habitaciones del plano, post-it colapsado («Índice») y cartela («Sobre mí»). Micro-toque táctil sobre pergamino. | 0.5 s | `Subtle delicate fingertip tap on old thick parchment paper, ultra quiet minimal parchment touch, soft dry muted paper contact, minimal UI hover foley, no rustle, instant decay, isolated close-up` |
| **`bombilla_on.mp3`** | Generado | Encendido de la bombilla de filamento (sonido agudo y brillante tipo "plink"). | 0.3 s | `Single antique lightbulb filament turning on with a crisp glass tink and delicate high-pitch plink ping, vintage tungsten activation snap, completely dry, isolated sound effect, NO buzz, NO background noise` |
| **`bombilla_off.mp3`** | Generado | Apagado de la bombilla de filamento (sonido más grave tipo "plonk"). | 0.4 s | `Single vintage ceiling light toggle turning off with a deep hollow metallic thud and dull plonk click, muffled mechanical release, completely dry, isolated sound effect, NO background noise` |
| **`bombilla_chisporroteo.mp3`** | Generado | Micro-parpadeo y sutil chisporroteo del filamento en penumbra. | 0.8 s | `Subtle delicate filament flicker and faint electrical sputter of a dying incandescent lightbulb, quiet intermittent micro-buzz and soft click, eerie atmospheric horror foley, low volume` |

---

## 5. Catálogo de Audios para Comedor y Lámpara de Tubos (`app/pages/recetas.html`)

Archivos ubicados en la ruta `app/audio/recetas/`:

| Archivo | Estado | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- | :--- |
| **`lampara_tubo_on.mp3`** | Generado | Encendido de los tubos fluorescentes (arranque con "plink" metálico y destello, sin zumbido posterior ni corte brusco). | 0.4 s | `Single fluorescent ceiling light turning on, sharp metallic starter snap followed by clean high-frequency glass tube excitation ping and instantaneous gas ignition, natural fast fade into total silence, crisp dry isolated foley, ABSOLUTELY NO buzz, NO electrical hum, NO background noise, NO drone` |
| **`lampara_tubo_off.mp3`** | Generado | Apagado de la luminaria de tubos (conmutador mecánico industrial grave tipo "plonk"). | 0.4 s | `Heavy industrial metal toggle light switch flicking off with a solid deep clunk and heavy mechanical plonk thud, clean instantaneous cutoff, isolated sound effect` |
| **`lampara_tubo_chisporroteo.mp3`** | Generado | Parpadeo errático del cebador/starter de tubos fluorescentes en penumbra. | 0.6 s | `Old flickering fluorescent light starter blinking, erratic metallic capacitor clicks and faint gas discharge pop sputtering in abandoned hallway, isolated eerie foley` |
