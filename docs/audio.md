# Catálogo de Efectos de Sonido y Prompts para ElevenLabs

Este documento define la arquitectura de audio del proyecto DAWlloween, el sistema dual de reproducción (archivos de audio en alta definición con respaldo sintético procedural) y los prompts de generación para la herramienta de efectos de sonido de ElevenLabs (https://elevenlabs.io/sound-effects).

---

## 1. Arquitectura de Audio (`app/js/main.js`)

El motor de audio `AudioEngine` implementa un flujo dual tolerante a fallos:
1. **Precarga Proactiva (`AudioEngine.preload()`):** Se precargan de forma asíncrona todos los efectos de sonido primarios al iniciar la aplicación, garantizando latencia cero en los eventos de interacción.
2. **Ambiente Optimizado en OGG Vorbis (`ambiente_noche.ogg`):** Fondo ambiental exclusivo de 10 segundos remasterizado sin estridencias (sin canto de búho), comprimido a 159 KB en OGG Vorbis con bucle continuo sin costuras y decodificación en Web Audio API mediante `AudioBufferSourceNode`. Suprime variantes redundantes (.wav y .mp3) para optimizar la carga del portal.
3. **Prioridad Primaria (Archivos MP3/OGG):** Intenta reproducir el archivo de sonido correspondiente alojado en la carpeta `app/audio/`.
4. **Respaldo Procedural (Web Audio API):** Si el archivo no existe aún o el navegador bloquea la carga, se activan de manera automática los sintetizadores de osciladores Web Audio API (ondas seno, triángulo y diente de sierra con curvas exponenciales de ganancia).
5. **Control Dinámico de Estados:** Permite la detención inmediata y reseteo de efectos continuos o periódicos, como `stopPadlockHop()` cuando el usuario interacciona mediante hover con el candado en reposo.

---

## 2. Catálogo de Audios para la Fachada y Entrada (`app/pages/login.php`)

Ubicar los archivos exportados en la ruta `app/audio/`:

| Archivo | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- |
| **`candado_salto.mp3`** | Salto periódico del candado pequeño en reposo (`padlockHop`). Se pausa/detiene al hacer hover (`stopPadlockHop()`). | 0.8 s | `Small antique iron padlock hopping and bouncing with a light metallic jingle, subtle chain link clinks, gentle iron rattle on metal latch, short subtle cartoonish yet realistic spooky foley` |
| **`candado_expandir.mp3`** | Click sobre el candado pequeño inicial para expandirlo a tamaño completo. | 1.5 s | `A heavy antique iron padlock suddenly jerking and expanding on rusty metal chains, deep hollow metallic thud, dark gothic dungeon sound effect, close-up, high detail` |
| **`llave_insertar.mp3`** | Hover del cursor sobre el ojo de la cerradura. | 1.0 s | `Inserting an antique iron skeleton key into an old lock keyhole, subtle metallic friction, gentle scrape against aged brass and iron, crisp high-frequency foley, close-up` |
| **`llave_girar.mp3`** | Click sobre la cerradura para girar la llave. | 1.2 s | `Turning an antique heavy skeleton key inside a massive rusted padlock, deep mechanical ratchet click, heavy spring tension, tumblers turning, crisp mechanical lock click` |
| **`candado_error.mp3`** | Rechazo por credenciales incorrectas (sacudida del candado). | 1.5 s | `Violent shaking of heavy iron chains and rusted padlock rattling violently against iron bars, dull aggressive metal rattling, mechanism jamming shut` |
| **`candado_desbloqueo.mp3`** | Salto elástico del arco del candado (`candado_arco.png`). | 1.5 s | `A heavy iron padlock latch suddenly springing open, loud sharp mechanical metallic snap and pop, spring-loaded shackle unlatching with metallic resonance` |
| **`candado_caida.mp3`** | Desprendimiento y caída del candado al suelo. | 2.0 s | `Heavy iron padlock falling off metal chains and dropping onto wet stone ground, dull heavy metallic impact with loose chain links clinking` |
| **`verja_abrir.mp3`** | Apertura simultánea de las hojas batientes de la cancela. | 3.5 s | `Old rusty wrought iron gate hinge squeaking and creaking slowly, dry metal on metal friction, antique rusted iron gate opening, realistic high-pitched metallic squeaks and hinges, quiet eerie atmospheric resonance, foley sound effect` |
| **`ambiente_noche.ogg`** | Fondo ambiental nocturno en bucle continuo de alta fidelidad (versión limpia sin búho). | 10.0 s | `Cold autumn night wind blowing, crisp dry fallen leaves rustling and skittering on ground, subtle eerie atmospheric drone, dark quiet Halloween night ambience, seamless looping foley, no bird calls` |

---

## 3. Catálogo de Audios para Mapa y Navegación (`app/index.html` y Subpáginas)

| Archivo | Evento / Disparador | Duración | Prompt para ElevenLabs SFX |
| :--- | :--- | :--- | :--- |
| **`linterna_click.mp3`** | Encendido y apagado de la linterna sobre el mapa 2D. | 0.8 s | `Heavy vintage flashlight toggle switch clicking on and off, solid plastic and metal button click, crisp mechanical tactile snap` |
| **`papel_examinar.mp3`** | Apertura y cierre del cartel MISSING o notas en mesas. | 1.2 s | `Old dry parchment paper unfolding and rustling, tactile dry newspaper page turn, aged paper handling foley, close-up` |
| **`pasos_madera.mp3`** | Desplazamiento por pasillos interiores en el plano. | 2.0 s | `Slow footsteps creaking on old dusty wooden floorboards, eerie abandoned school hallway acoustics` |

