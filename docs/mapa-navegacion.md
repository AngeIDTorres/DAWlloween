# Arquitectura de Navegación, Animaciones del DOM e IPO

Este documento describe la experiencia de usuario (IPO), la estructura de navegación visual y las animaciones interactivas implementadas mediante JavaScript y CSS para el proyecto DAWlloween.

---

## 1. Entrada Principal y Fachada Animada (`app/pages/login.php`)

La pantalla de acceso actúa como metáfora visual de la entrada física a la institución clausurada.

### Estructura de Capas del Escenario (DOM)
1. **Marco Escénico Bloqueado (`login-scene-frame`):** Contenedor matemático de aspecto fijo (`aspect-ratio: 2752 / 1536`) dimensionado a `width: max(100vw, calc(100vh * (2752 / 1536)))` y `height: max(100vh, calc(100vw * (1536 / 2752)))` centrado en la base (`bottom: 0; left: 50%; transform: translateX(-50%)`). Carga la textura `bg_colegio_luna.png` con `background-size: 100% 100%`. Al alojar tanto la imagen como la cancela en este mismo sistema de coordenadas, erradica cualquier holgura o desajuste (gap de 0.0px) entre los goznes de la cancela y las caras de los pilares de piedra en todas las resoluciones (2560x1440, 1920x1080, portátiles y smartphones).
2. **Sistema de Luz y Rayos Lunares Volumétricos (`moon-light-system`):** Posicionado a `z-index: 4` dentro del marco escénico.
   * **Aura Lunar Pulsante (`moon-glow`):** Disco concéntrico con la luna (`top: 24.5%; left: 50%`) y halo suave `box-shadow: 0 0 45px rgba(215, 235, 255, 0.22)`.
   * **Rayos Volumétricos Proyectados (`moon-rays` y `secondary`):** Haces crepusculares divergentes con origen en el núcleo lunar (`top: 24.5%; left: 50%`) y máscara elíptica de caída progresiva.
3. **Cancela de Hierro (`gate-container`):** Posicionada a `z-index: 12`, fijada matemáticamente a `left: 19%` y `right: 19%` con altura del `73%` y base a `bottom: 1.5%`. Ambas hojas batientes (`gate-leaf.left` y `gate-leaf.right`) pivotan respectivamente desde sus goznes exteriores (`left center` y `right center`) abriéndose simétricamente hacia el interior (`rotateY(-85deg)` y `rotateY(85deg)`), convergiendo en el eje central exacto sin desfases espaciales.
4. **Candado de Bloqueo Interactivo (`padlock-wrapper`):** Posicionado a `z-index: 25`, cuelga en el centro de la verja (`top: 61%; left: 50%`). Diseñado con `container-type: inline-size` para fluidificar inputs y etiquetas. En dispositivos táctiles (`@media (hover: none)`), la llave se visualiza con opacidad previa para facilitar el accionamiento táctil.
5. **Velo de Sombra Atmosférico (`darkness-veil`):** Capa a pantalla completa superpuesta a `z-index: 28` sincronizada con las coordenadas del cursor o toque táctil (`--light-x`, `--light-y`).
6. **Haz de Linterna Óptico (`flashlight-beam`):** Posicionado a `z-index: 40`. Soporta tanto ratón como eventos touch (`touchstart`, `touchmove`) a través de `FlashlightController`.
7. **Cortina de Fundido (`blackout-curtain`):** Capa opaca superpuesta para transiciones suaves a negro total.

---

## 2. Arquitectura Modular en Cliente (`app/js/`)

Toda la interactividad se apoya en JavaScript Vanilla modularizado por casos de uso mediante módulos ES nativos (`<script type="module">`) y la API de Web Audio para evitar dependencias externas.

### Estructura de Módulos por Caso de Uso
* **`core/audio.js` (`AudioEngine`):** Síntesis Web Audio API procedural (drones, armónicos de osciladores triangle/sawtooth/sine, zumbadores de rechazo, interruptores y chispas) y gestor de pre-carga y reproducción con fallback ante bloqueos de autoplay.
* **`core/flashlight.js` (`FlashlightController`):** Controlador óptico del haz de linterna con seguimiento de ratón sincronizado a 60 FPS vía `requestAnimationFrame`, despacho de propiedades CSS personalizadas y alternancia mediante tecla `[F]`.
* **`login/padlock.js` (`initPadlock`):** Máquina de estados del candado gótico (física de saltitos, silenciado en hover, expansión al click y repliegue suave al clicar fuera).
* **`login/auth.js` (`initAuth`):** Manejador de credenciales, animación pivotante de la llave antigua (`antiqueKey`), validación en cliente, oscilación de error (`.shake`) y transmisión AJAX contra `login.php`.
* **`login/gate-cutscene.js` (`playGateSequence`):** Coreografía cronometrada tras autenticación exitosa (desbloqueo de arco a 250ms, caída de candado a 950ms, apertura de hojas a 1450ms, cortina de fundido a 2450ms y redirección a `../index.html` a 3850ms).
* **`map/rooms-data.js` (`ROOMS_REGISTRY`):** Fuente de verdad con el registro de dependencias, títulos, expedientes, estados judiciales y rutas.
* **`map/navigation.js` (`initNavigation`):** Controladores de eventos para aulas SVG (`.room-zone`) y etiqueta adhesiva (`.frame-sticker-about`) con emisión de foley contextual.
* **`map/hanging-lamp.js` (`initHangingLamp`):** Luminaria colgante con conmutación de estado iluminado (`.room-lit`), luz oscilante sincrónica y parpadeos aleatorios periódicos en penumbra.
* **`map/postit.js` (`initPostit`):** Acordeón interactivo del posit texturizado, botón de cierre y enlaces de navegación directa.
* **`main.js` y `map.js`:** Puntos de entrada y orquestadores declarativos de cada vista.

### Respuesta a Error de Autenticación
* Cuando el backend PHP detecta credenciales inválidas o campos incompletos, marca el atributo `data-error="true"` o emite una respuesta AJAX con error.
* El script aplica temporalmente la clase `.shake` sobre el candado, disparando una oscilación horizontal violenta (`@keyframes lockShake`) delegada sobre el contenedor interno (`.padlock-hop-inner`) para no interferir en la escala base del candado exterior.
* La clase `.shake` se limpia automáticamente tras 700 ms (y de forma forzada al pulsar fuera), asegurando que un fallo de contraseña no bloquee el retorno transitorio al origen (`scale(0.38)`).
* **Audio de rechazo:** Se coordina con el efecto `AudioEngine.playShake()` (sonido metálico áspero sintetizado con oscilador `sawtooth` o `candado_error.mp3`).

### Secuencia de Apertura en Éxito
Cuando las credenciales son validadas en `$_SESSION['mimatriz']`, se activa la secuencia coreografiada:
1. **Giro de Llave (0 ms):** La llave adopta la posición girada (`.turning`) completando su rotación mecánica dentro del ojo de la cerradura.
2. **Desbloqueo y Salto del Arco (+250 ms):** La clase `.unlocked` activa el salto elástico del arco (`shacklePop`) acompañado del sonido metálico de desbloqueo `playUnlock()`.
3. **Caída del Candado (+950 ms):** La clase `.falling` desvanece y traslada el candado hacia abajo simulando su desprendimiento de la verja.
4. **Apertura de Cancelas (+1450 ms):** Las hojas izquierda y derecha rotan sobre su eje (`rotateY(-85deg)` y `rotateY(85deg)`) simulando una apertura hacia el interior del recinto, acompañada por una reverberación de baja frecuencia.
5. **Fundido a Negro (+2450 ms):** Se activa la clase `.active` sobre la cortina opaca (`opacity: 1`), provocando un fundido suave (`fadeoutblack`).
6. **Redirección (+3850 ms):** El navegador redirige al mapa principal (`../index.html`).

---

## 3. Plano Arquitectónico 2D y Navegación Interior (`app/index.html`)

Actúa como el centro neurálgico de exploración del colegio clausurado tras franquear las cancelas de entrada, enfocado en una inmersión visual pura y ambiental sin barras HUD ni paneles flotantes de interfaz.

### Componentes del Escenario
1. **Pared y Cuadro Institucional (`map-stage` y `map-viewport`):**
   * **Fondo de Pared (`bg_mapa_pared.png`):** Muro institucional en decadencia con zócalo de madera y ladrillo visto, ocupando el 100% de la ventana (`100vw x 100vh`).
   * **Bombilla Colgante Dinámica con Haz Móvil (`hanging-lamp`):** Luminaria suspendida del techo con posición horizontal calibrada (`left: clamp(16px, calc(50% - clamp(60px, 16vw, 220px)), calc(50% - 220px)); width: clamp(66px, 7vw, 96px); aspect-ratio: 96 / 194;`), impidiendo desbordes o coordenadas negativas fuera de pantalla en pantallas compactas y dispositivos móviles. En estado apagado se sitúa tras el velo de penumbra exterior (`z-index: 50` tras `.map-darkness-veil` a `z-index: 60`), manteniéndose oculta en la oscuridad hasta que la linterna la ilumina; al encenderse o parpadear se eleva automáticamente a `z-index: 65`, mostrándose nítida, cálida y sin velo oscuro superpuesto. Construida a partir de `bombilla_apagada.png` y `bombilla_encendida.png`. Ejecuta un balanceo pendular lento y atmosférico (`@keyframes lampSwayCycle`, período de 7.8s con oscilación de -6° a +6° desde el techo `transform-origin: 50% 0%`). Su cono de luz volumétrico (`lamp-light-cone`, 540px x 460px) emula una lámpara antigua de baja potencia con un haz cálido contenido (`backdrop-filter: brightness(1.22) contrast(1.04)`) y máscara elíptica de atenuación progresiva sin cortes superiores, que barre de forma claramente perceptible y sincrónica el plano a través de la penumbra institucional del velo exterior (`.map-darkness-veil` al 72% de opacidad).
   * **Marco de Madera y Hierro (`marco_madera_vacio.png`):** Moldura perimetral exterior recortada a 2198x1378 px dimensionada a `width: min(88vw, 1340px); max-height: min(82vh, 840px); aspect-ratio: 2198 / 1378;` e interactuando como contenedor de contexto (`container-type: inline-size`).
   * **Vano Interior Acristalado (`map-inner-window`):** Delimitado estrictamente al cuadro interno del marco (`top: 15.82%; left: 10.37%; width: 79.3%; height: 68.87%; overflow: hidden;`), garantizando que ni el papel ni el cristal quebrado invadan las esquinas salientes del marco exterior.
   * **Textura Base de Pergamino (`papel_mapa_pergamino.png`):** Capa de fondo (`map-paper-layer`) ajustada al vano interno (1743x949 px).
   * **Plano Arquitectónico Vectorial Estilo Novela Gráfica (`map-svg-container`):** Cartografía técnica en entintado gótico limpio y realista (`viewBox="0 0 1380 750"`) con muros dobles en `#1A1412`, distribución institucional simétrica y funcional (Ala Oeste, Claustro Central abierto y Ala Este simétrica con Pasillo Este horizontal idéntico al Pasillo Oeste), accesos arquitectónicos sin parches ni cuñas triangulares (vano real de muro, hoja batiente y arco sutil de giro), gran pabellón de gimnasio polideportivo a escala completa ocupando el cuadrante inferior este, aspas judiciales de precinto (`#9E1B1B`), sellos tipográficos vectoriales «INACCESIBLE» y un indicador de orientación minimalista «ESTÁS AQUÍ» (diana circular reducida y limpia, sin cartelas ornamentales superfluas). El texto de acceso sur se rotula como `[ ENTRADA PRINCIPAL ]` situado por debajo de la línea de muro perimetral (`y="738"`).
   * **Posit Desplegable de Índice en el Marco (`frame-postit`):** Cuadro amarillo texturizado fijado en la parte central superior del marco (`top: 1.8%; left: 50%; transform: translateX(-50%)`) que utiliza `posit.png` (`clamp(74px, 8cqi, 104px)` expandible a `min(90cqi, 242px)`), adaptándose al ancho del marco sin provocar desbordes. Al hacer clic, se expande fluidamente con sangrado interior ampliado (padding izquierdo de 28px y margen de lista) para situar las opciones limpiamente sobre la zona de escritura («• Recetas», «• Enviar correo», «• Minijuego»), botón de cierre (`[×]`) y navegación directa.
   * **Cristal Quebrado (`cristal_quebrado.png`):** Lámina en `mix-blend-mode: screen` al 65% de opacidad, restringida de borde a borde al vano interno acristalado sobre el plano pergamino oscurecido.
   * **Pegatina Adhesiva en el Marco (`frame-sticker-about`):** Etiqueta institucional (`etiqueta_sobre_mi_blank.png`) fijada a lo largo del listón inferior de madera anclada a la derecha (`right: 4.8%; bottom: 1.8%; width: clamp(82px, 11cqi, 144px); aspect-ratio: 144 / 108;`), garantizando un escalado orgánico y que nunca sobresalga del lateral del cuadro. Textos en tipografía fluida de contenedor (`cqi`). Su animación de hover pivota sobre la cinta adhesiva superior (`transform-origin: 50% 4px; transform: perspective(600px) rotateX(24deg)`), desplegando físicamente el papel hacia el espectador con sombra proyectada hacia abajo y enlace directo al expediente.
   * **Sistema Óptico de Linterna y Velo Continuo:** Velo oscuro a pantalla completa oscurecido drásticamente (`circle 340px`, periférico al 94% de opacidad) junto a un oscurecimiento base del pergamino (`brightness(0.82)`), logrando que en estado nocturno el haz de la linterna (`brightness(1.38) contrast(1.1)`) resulte imprescindible y 100% funcional para examinar el plano. Conmutación disponible mediante la tecla `[F]`.

2. **Transición Cinematográfica (Fade In / Fade Out) y Pasos de Madera:**
   * **Entrada al Plano (Fade In):** La cortina opaca (.blackout-curtain.active) inicia cubriendo la pantalla y se desvanece de forma suave en 1.2s al cargar index.html, conectando fluidamente con el fundido a negro proveniente de la cancela en login.php.
   * **Navegación a Secciones (Fade Out + Pasos):** Al hacer clic en cualquier sala transitable (`.room-zone` o enlaces del post-it `.postit-link`), se activa inmediatamente el sonido de pasos pesados sobre tarima (`app/audio/common/pasos_madera.mp3`), se alza la cortina opaca (`.blackout-curtain.active`) y tras un retardo atmosférico de 1.75s se ejecuta la navegación hacia la estancia correspondiente, permitiendo que la cadencia de pasos culmine de manera natural en la oscuridad total sin cortes abruptos mid-stride.

3. **Distribución e Interacción de Dependencias:**
   * **Salas Activas y Operativas (3 Dependencias Únicas):**
     * **01. Despacho de Dirección (`pages/correo.php`):** Marcado en plano como `DESPACHO DE DIRECCIÓN [ ENVIAR CORREO ]`. Trazo arquitectónico sobrio con mesa principal y vano abierto al pasillo central; acceso a la terminal para correspondencia exterior.
     * **02. Comedor y Cocinas (`pages/recetas.html`):** Marcado en plano como `COMEDOR Y COCINAS [ MENÚ HALLOWEEN ]`. Distribución limpia de comedor y cocinas con acceso directo desde el pasillo central; acceso al recetario temático.
     * **03. Sala de Juegos (`pages/juego.html`):** Marcada en plano como `SALA DE JUEGOS [ MINIJUEGO ]`. Mesa de ocio central con acceso directo y abierto desde el pasillo central; acceso a la incursión interactiva de supervivencia.
     * **04. Expediente Personal (`pages/aboutus.html`):** Accesible mediante la pegatina `EXPEDIENTE` en el marco de madera.
   * **Salas Inaccesibles (Tachadas con aspas rojas y rotuladas INACCESIBLE):**
     * **Aula de Música:** Precinto policial en pomo y piano cubierto de lona.
     * **Aseos de Alumnos:** Pasador forzado desde el interior y tuberías secas.
     * **Sala de Profesores:** Cadenas de acero en puertas acristaladas y legajos dispersos.
     * **Laboratorio de Ciencias:** Frascos fracturados y precinto por riesgo toxicológico.
     * **Gimnasio Polideportivo:** Gran cancha polideportiva que abarca todo el cuadrante sureste, precintada por colapso perimetral.
     * *Interacción acústica sin bloqueos modales:* Al hacer clic sobre cualquiera de estas dependencias cerradas, no se abren ventanas emergentes; el sistema emite de manera inmediata el foley de cerrojo y cadenas atrancadas (AudioEngine.playDenied(), cargando puerta_clausurada.mp3 con respaldo procedural), señalizando sin interrupciones la inviabilidad del acceso.

3. **Motor de Audio (AudioEngine):** Reproduce el fondo ambiental interior (`ambiente_interior.ogg`) continuo sample-accurate, conmutación táctil limpia de la linterna (`playClick`), encendido tipo "plink" y apagado tipo "plonk" de la bombilla (`playBulbOn` / `playBulbOff`), sutil micro-parpadeo en penumbra (`playBulbFlicker`), paso de página en el posit (`playPaper`), sonido de inspección en hovers (`playHover`) y denegación de acceso en aulas clausuradas (`playDenied`).

---

## 4. Expediente del Estudiante / Sobre Mí (app/pages/aboutus.html e index.html)

Actúa como el dossier biográfico e histórico del proyecto, integrado estéticamente como una ventana flotante (*MISSING poster*) sobre el plano arquitectónico general del colegio iluminado con la bombilla y oscurecido en penumbra.

### Estructura de Directorios Dedicada
* Las imágenes específicas de esta vista se gestionan en su propia carpeta: app/img/aboutus/ (cartel_missing_base.png, foto_desarrollador_retro.svg), reutilizando la pared general app/img/mapa/bg_mapa_pared.png para evitar duplicidad de texturas.

### Componentes del Escenario
1. **Escenario de Fondo Integrado (.map-stage.room-lit):**
   * Conserva el plano arquitectónico completo con la luminaria de techo (.hanging-lamp) encendida, el cuadro institucional de madera y el plano de pergamino.
   * **Velo Oscuro Flotante (.about-backdrop):** Capa a pantalla completa superpuesta a z-index: 50 con atenuación lumínica (rgba(4, 3, 6, 0.84)) y desenfoque suave (backdrop-filter: blur(2.5px)), permitiendo apreciar la luminaria y el mapa de fondo en penumbra. Al hacer clic sobre cualquier punto fuera del cartel o pulsar [Escape], emite sonido de papel (AudioEngine.playPaper()) y retorna al plano principal.

2. **Cartel de Búsqueda Flotante (.poster-wrapper):**
   * **Contenedor Modal (.about-modal-container):** Capa centrada a z-index: 60 sin barras de cabecera ni insignias auxiliares, aislando el cartel como único elemento focal. Integrado tanto en app/pages/aboutus.html como embebido directamente en app/index.html para apertura sin recarga.
   * **Lienzo Base (app/img/aboutus/cartel_missing_base.png):** Cartel gótico envejecido con cintas en las esquinas y rotulación de «MISSING». Dimensionado para ocupar casi la totalidad del alto de pantalla (height: min(95.5vh, 1120px); max-height: 96.5vh; max-width: 95vw; aspect-ratio: 1792 / 2400;), fondo completamente transparente (background: transparent) y posición fija sin oscilación de hover para máxima nitidez de lectura. Contenedor gobernado por container-type: size.
   * **Retrato Polaroid (.polaroid-photo-box):** Posicionado con precisión milimétrica (left: 14.3%; top: 23.5%; width: 26.2%; height: 23.6%) en el recuadro fotográfico del cartel. Carga la plantilla vectorial monocromática app/img/aboutus/foto_desarrollador_retro.svg con textura de fotocopia de medio tono y barra de censura [REDACTED].
   * **Alineación Milimétrica sobre las Líneas Rayadas del Papel:**
      * Las líneas impresas del cartel poseen un paso de línea físico regular de exactamente 72 px (3.00% del lienzo de 2400 px de alto).
      * **Ficha Superior (.poster-top-info):** Situada a left: 47%; width: 41%; top: 22.08% naciendo exactamente donde comienza la pauta rayada del póster, con cada fila (.info-row) dimensionada a height: 3.00cqb; line-height: 1.2; align-items: flex-end; padding-bottom: 0.12cqb; font-size: clamp(12px, 1.91cqi, 16px); (16px a escala completa): DESARROLLADOR: Ángel D. Torres, CURSO: 2º DAW, CENTRO: Atlántida CIDEP III, PROYECTO: DAWlloween, línea vacía de separación, cabecera centrada ENLACES (.info-heading, a 18px / clamp(14px, 2.15cqi, 18px)) y fila de sellos con iconos SVG centrados horizontalmente mediante display: flex; justify-content: center; agrandados a dos renglones (.info-links-row, height: 6.00cqb) hacia GitHub y LinkedIn.
      * **Cuerpo del Expediente (.poster-body-lines):** Cabecera a top: 51.4% (EXPEDIENTE · SOBRE EL PROYECTO, .dossier-heading, a 18px / clamp(14px, 2.15cqi, 18px)) asentada rasante sobre la línea, y cuerpo de renglones centrado sobre el folio rayado a left: 14.3%; width: 73.7%; top: 53.88%, donde cada fila (.ruled-line) mide height: 3.00cqb; line-height: 1.2; align-items: flex-end; padding-bottom: 0.12cqb; font-size: clamp(11.5px, 1.88cqi, 16px); letter-spacing: -0.2px; (16px a escala completa): estudiante de 2º DAW, ejercicio temático de Halloween 2026, renglón vacío de separación, título de sección CONTENIDO DE LA PLATAFORMA (.ruled-heading, entintado en burdeos #5E1212, negrita 800 y 18px) y desglose de dependencias activas (plano interactivo, minijuego de supervivencia, recetario y correo de dirección), totalizando exactamente los 8 renglones físicos del papel.
      * **Contraste Entintado:** Texto formateado en tinta de imprenta negra (`#080605` y `#000000`, `font-weight: 600` a `900`) con `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` para garantizar que cada línea descanse en su renglón correspondiente sin desbordamientos.
      * **Enlaces por Iconos Estampados (.dossier-icon-btn):** Iconos de GitHub y LinkedIn dimensionados a doble renglón (5.2cqb, hasta 60px) en el bloque superior con fondo transparente, borde discontinuo en tinta roja (border: 1.8px dashed rgba(120, 24, 24, 0.65)), color #3A1010 y transición en hover estrictamente cromática hacia #911414 sin alteraciones de fondo ni de escala.

3. **Continuidad del Audio Ambiental Interior (AudioEngine):**
   * **Persistencia de Posición Acústica:** Implementación de `saveAmbientPosition()`, `getSavedAmbientOffset()` y `startAmbientSync()` en `app/js/core/audio.js` apoyados en `sessionStorage`.
   * Al navegar entre el mapa principal (`index.html`) y el expediente (`aboutus.html`), o al recargar la página, el motor recupera los segundos reproducidos más el tiempo transcurrido, reanudando la pista de ambiente interior exactamente en el punto temporal donde se encontraba sin reiniciarse desde el segundo 0.
   * **Apertura In-Place y Control de Iluminación:** Al hacer clic en la etiqueta adhesiva «Sobre mí» en `app/index.html`, la vista abre la ventana flotante en el propio DOM sin recargar la página y enciende automáticamente la bombilla de techo (`lampController.turnOn()`, activando `.room-lit` y sonido de interruptor). Al cerrar el modal (clic en velo o tecla [Escape]), emite el sonido de papel `app/audio/common/papel_examinar.mp3`, la bombilla se apaga de inmediato de forma silenciosa (`lampController.turnOff(false)`, eliminando `.room-lit`) para evitar enmascarar el papel y restaura la penumbra con linterna sin interrumpir la pista ambiental.
