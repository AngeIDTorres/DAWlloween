# Navegación, Escenarios Interactivos y Experiencia de Usuario (IPO)

Resumen de la arquitectura de navegación, animaciones del DOM e interactividad de DAWlloween.

---

## 1. Entrada Principal y Fachada (`app/pages/login.php`)

Metáfora visual de la entrada física a la institución clausurada:

* **Escenario de Capas:** Fondo exterior con luna y rayos volumétricos, verjas batientes de hierro (`gate-leaf`), candado gótico interactivo, velo de penumbra y haz de linterna.
* **Candado Interactivo (`padlock.js`):** Da pequeños saltos en reposo (`padlockHop`), se pausa al situar el cursor encima (`stopPadlockHop`), se expande a formulario completo con un clic y se repliega si se pulsa fuera.
* **Secuencia de Error (`auth.js`):** Ante credenciales inválidas, aplica la clase `.shake` provocando una violenta sacudida horizontal acompañada del sonido metálico `candado_error.mp3`.
* **Secuencia de Entrada (`gate-cutscene.js`):** Tras la validación de credenciales:
  1. Giro completo de la llave antigua en la cerradura (`llave_girar.mp3`).
  2. Salto elástico del arco del candado (`candado_desbloqueo.mp3`).
  3. Desprendimiento y caída del candado fuera de la verja (`candado_caida.mp3`).
  4. Apertura batiente de las cancelas de hierro (`verja_abrir.mp3`).
  5. Fundido a negro mediante cortinilla (`.blackout-curtain`) y redirección a `index.html`.

---

## 2. Plano Arquitectónico del Colegio (`app/index.html`)

Hub neurálgico de exploración del centro clausurado en vista cenital:

* **Cuadro Institucional:** Fondo de pared con moldura perimetral de madera (`marco_madera_vacio.png`), vano acristalado con cristal cuarteado (`cristal_quebrado.png`) y plano arquitectónico en pergamino vectorial (SVG).
* **Iluminación Dinámica:**
  * **Bombilla Colgante (`hanging-lamp.js`):** Luminaria suspendida con balanceo pendular continuo. Conmuta entre encendido/apagado general (clic o tecla `L`), proyectando un haz cálido sobre el plano.
  * **Linterna Manual (`flashlight.js`):** Haz óptico sincronizado con las coordenadas del cursor sobre el velo oscuro continuo. Alternable mediante la tecla `F`.
* **Distribución de Salas:**
  * **Dependencias Operativas:**
    * `COMEDOR Y COCINAS` (`pages/recetas.html`): Acceso al recetario escolar temático.
    * `DESPACHO DE DIRECCIÓN` (`pages/correo.php`): Acceso a la terminal para redactar correos.
    * `SALA DE JUEGOS` (`pages/juego.html`): Acceso a la incursión interactiva de supervivencia.
    * `EXPEDIENTE` (`pages/aboutus.html`): Acceso a la ficha y biografía del proyecto.
  * **Dependencias Clausuradas:** Aula de Música, Aseos, Sala de Profesores, Laboratorio y Gimnasio Polideportivo. Están marcadas con aspas rojas y rótulos «INACCESIBLE»; al clicar sobre ellas emiten el foley de cerrojos bloqueados (`puerta_clausurada.mp3`) sin modales intrusivos.
* **Navegación Rápida:**
  * **Posit Desplegable (`frame-postit`):** Índice adhesivo en el marco con enlaces directos a las tres dependencias activas.
  * **Pegatina Adhesiva (`frame-sticker-about`):** Etiqueta «EXPEDIENTE / Sobre mí» en la base del marco para abrir el expediente del creador.
* **Transiciones de Sala:** Toda navegación activa el sonido de pasos pesados sobre tarima (`pasos_madera.mp3`, 1.75s) sincronizado con el telón de fundido a negro (`.blackout-curtain`), garantizando una transición inmersiva sin cortes abruptos.

---

## 3. Expediente del Estudiante / Sobre Mí (`aboutus.html` y modal)

Dossier biográfico e histórico del proyecto integrado como un cartel de persona desaparecida (*MISSING poster*):

* **Modal Integrado y Vista Independiente:** Disponible como modal in-place en `index.html` (enciende automáticamente la bombilla y desenfoca el plano de fondo) o como página accesible directamente en `pages/aboutus.html`.
* **Contenido del Cartel:** Fotografía retro tramada con barra de censura, datos del alumno (Ángel D. Torres, 2º DAW, Atlántida CIDEP III), enlaces directos a GitHub y LinkedIn, y descripción del proyecto DAWlloween.
* **Cierre:** Al pulsar fuera del cartel o la tecla `Esc`, emite el sonido de hojeo de papel (`papel_examinar.mp3`), apaga la bombilla silenciosamente y retorna al plano.

---

## 4. Arquitectura Modular en Cliente (`app/js/`)

Estructura de módulos Vanilla ES6 desacoplados por funcionalidad:

| Directorio / Módulo | Responsabilidad |
| :--- | :--- |
| `core/audio.js` | Motor de audio dual (`AudioEngine`): reproducción con respaldo sintético Web Audio y persistencia de ambiente. |
| `core/flashlight.js` | Controlador de linterna (`FlashlightController`): seguimiento del cursor a 60 FPS y alternancia con tecla `F`. |
| `core/accessibility.js` | Panel del busca/mensáfono (`AccessibilityManager`): control unificado de accesos, linterna, mute y luces. |
| `login/padlock.js` | Máquina de estados del candado de entrada: física de saltos, expansión al clic y repliegue. |
| `login/auth.js` | Validación del formulario de acceso, animación de la llave y feedback visual/sonoro. |
| `login/gate-cutscene.js` | Coreografía temporal de apertura de cancelas y redirección. |
| `map/rooms-data.js` | Registro y fuente de verdad (`ROOMS_REGISTRY`) de títulos, rutas y estados de las dependencias. |
| `map/navigation.js` | Controladores de eventos de las aulas SVG y etiqueta «Sobre mí». |
| `map/hanging-lamp.js` | Luminaria colgante: conmutación ON/OFF, balanceo pendular y parpadeos en penumbra. |
| `map/postit.js` | Acordeón interactivo del posit de índice y navegación rápida. |
| `main.js` / `map.js` / `recetas.js` / `aboutus.js` | Orquestadores y puntos de entrada de cada pantalla. |
