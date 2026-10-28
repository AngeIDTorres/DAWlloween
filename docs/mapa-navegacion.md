# Arquitectura de Navegación, Animaciones del DOM e IPO

Este documento describe la experiencia de usuario (IPO), la estructura de navegación visual y las animaciones interactivas implementadas mediante JavaScript y CSS para el proyecto DAWlloween.

---

## 1. Entrada Principal y Fachada Animada (`app/pages/login.php`)

La pantalla de acceso actúa como metáfora visual de la entrada física a la institución clausurada.

### Estructura de Capas del Escenario (DOM)
1. **Fondo de Escenario (`login-stage`):** Imagen de fondo en alta resolución `app/img/bg_colegio_luna.png` con iluminación nocturna equilibrada (`rgba(18, 12, 28, 0.25)` a `rgba(3, 2, 6, 0.78)`), permitiendo apreciar con total nitidez la silueta del colegio, la luna llena y los pilares. Viñeteado perimetral posterior (`login-stage::after`) a `z-index: 2`.
2. **Sistema de Luz y Rayos Lunares Volumétricos (`moon-light-system`):** Posicionado a `z-index: 4` (estrictamente detrás de la verja de hierro).
   * **Aura Lunar Pulsante Equilibrada (`moon-glow`):** Disco de resplandor blanco/plateado calibrado a 460px (`top: 15vh; left: 50%`) con núcleo al 60% de opacidad, halo perimetral suave `box-shadow: 0 0 45px rgba(215, 235, 255, 0.22)` y respiración cíclica `@keyframes moonGlowPulse`.
   * **Rayos Volumétricos Proyectados (`moon-rays` y `secondary`):** Haces crepusculares cónicos divergentes calibrados a un punto intermedio de luminosidad (picos al 16% y 14% de opacidad en modo `screen`), con desenfoque suave (3.5px y 5px) y máscara elíptica de caída progresiva (`mask-image: radial-gradient(ellipse 70% 85% ...)`), proyectando haces etéreos perfectamente distinguibles entre los barrotes sin saturar el cielo nocturno.
3. **Cancela de Hierro (`gate-container`):** Posicionada a `z-index: 12`, por delante de los rayos y la luna, logrando que los barrotes de hierro fundido de las dos hojas batientes (`gate-leaf left` y `gate-leaf right`) corten físicamente la luz de la luna con brillo calibrado (`brightness(0.85)`).
4. **Candado de Bloqueo Interactivo (`padlock-wrapper`):** Posicionado a `z-index: 25`, cuelga en el centro de la verja.
   * **Dimensiones y Sombra Base:** Incrementado un 20% para presencia gótica (`width: min(600px, 55vw); aspect-ratio: 600 / 768;`), con brillo nocturno natural (`brightness(0.88)`).
   * **Estado Inicial y Transición de Hover:** Inicia en escala reducida (`scale(0.38)`) con una animación cíclica de saltitos ejecutada sobre el contenedor interno (`.padlock-hop-inner`) mediante `@keyframes padlockHop`, sincronizada con `candado_salto.mp3`. Al situar el cursor/linterna sobre el candado en estado de salto (`.hopping:hover`), cesa el salto y el sonido (`stopPadlockHop()`), mientras que el contenedor exterior (`.padlock-wrapper`) escala de forma puramente transitoria de `0.38` a `0.46` mediante `transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)` sin movimiento ni oscilaciones. Al retirar el puntero, se reduce transitoriamente a `0.38` y reanuda el salto; al hacer click, se expande a tamaño completo (`.expanded`, `scale(1)`), desactiva el haz de linterna y revela el formulario grabado y la cerradura.
   * **Retorno al Origen por Click Exterior:** Al hacer click fuera del cuerpo del candado cuando se encuentra expandido (`.expanded`), el sistema repliega el candado suavemente al estado inicial (`.hopping`, `scale(0.38)`), restaura el haz de linterna sobre las coordenadas del cursor y oculta el puntero del ratón, permitiendo cancelar o retroceder la selección.
   * **Arco superior (`shackle-graphic`):** Carga `app/img/candado_arco.png` al 100% de ancho con `aspect-ratio: 1 / 1`, elevándose nítidamente sobre el cuerpo e insertado en sus zócalos. Al desbloquearse, ejecuta `@keyframes shacklePop` con un desenganche vertical inicial hacia arriba seguido de un giro pivotante (`transform-origin: 27.8% 70.8%`).
   * **Cuerpo de cerradura (`padlock-graphic`):** Carga `app/img/candado_cuerpo.png` con `aspect-ratio: 1 / 1` en la base del contenedor.
   * **Placa de formulario (`plate-content`):** Incrustada de forma centrada (`left: 24%; width: 52%; top: 41.2%; height: 23%`). Las cajas de texto disponen de un ancho contenido (`135px`), fondo traslúcido fundido en el metal (`rgba(14, 11, 16, 0.38)`), foco sobrio en acero `#554e5c` y tipografía ampliada (`0.88rem` en etiquetas y `0.95rem` en inputs) para máxima legibilidad. Los enlaces inferiores (`.plate-links a`) responden al hover adoptando un tono sangre coagulada oscuro (`--red-rust: #4E1414`) a bajo relieve sin desplazamientos.
   * **Cerradura y Llave Gótica (`keyhole-btn`, `antique-key`):** Botón posicionado milimétricamente sobre el ojo de la cerradura (`top: 78.3%; left: 50.1%; transform: translate(-50%, -50%)`). Sin resplandor artificial en el agujero. Al hacer hover sobre el orificio, se manifiesta la llave antigua a escala duplicada (`250px` x `500px`), insertándose con la cabeza hacia el Este (derecha) y los dientes hacia abajo (`rotate(90deg) rotateY(180deg)`). La llave mantiene interacción de puntero activa (`pointer-events: auto`) a lo largo de todo su cuerpo para evitar intermitencias al desplazar el ratón. Al hacer click, gira 180° sobre su propio vástago longitudinal (`rotate(90deg) rotateY(0deg)`), manteniendo la cabeza en el Este y orientando los dientes hacia arriba.
5. **Velo de Sombra Atmosférico (`darkness-veil`):** Capa a pantalla completa superpuesta a `z-index: 28` con un viñeteado periférico moderado (`rgba(1, 0, 3, 0.48)`), que mantiene visible la escena global y abre una apertura circular suave de 380px sincronizada a 60 FPS con las coordenadas del cursor (`--light-x`, `--light-y`), con gradiente continuo sin quiebres de luminosidad.
6. **Haz de Linterna Óptico con Difuminado Progresivo (`flashlight-beam`):** Posicionado a `z-index: 40`. Utiliza `backdrop-filter: brightness(1.3) contrast(1.05)` para iluminar y aclarar físicamente los elementos apuntados con el cursor, manteniendo el centro transparente. Para erradicar cualquier corte o reborde circular visible, se aplica una máscara radial (`-webkit-mask-image` y `mask-image`) tanto al contenedor principal como a la textura (`::before`), con curva de caída suave de 5 paradas (`black 0% 20%` -> `0.75 45%` -> `0.35 65%` -> `0.08 82%` -> `transparent 96%`). Esto difumina por completo el `backdrop-filter`, la textura de lente al 32% y el halo interior concéntrico (`::after`, `filter: blur(18px)`), logrando una atenuación natural hacia la penumbra sin líneas de corte perimetrales.
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
   * **Bombilla Colgante Dinámica con Haz Móvil (`hanging-lamp`):** Luminaria suspendida del techo (`left: calc(50% - 220px); width: 96px; height: 194px;`). En estado apagado se sitúa tras el velo de penumbra exterior (`z-index: 50` tras `.map-darkness-veil` a `z-index: 60`), manteniéndose oculta en la oscuridad hasta que la linterna la ilumina; al encenderse o parpadear se eleva automáticamente a `z-index: 65`, mostrándose nítida, cálida y sin velo oscuro superpuesto. Construida a partir de `bombilla_apagada.png` y `bombilla_encendida.png`. Ejecuta un balanceo pendular lento y atmosférico (`@keyframes lampSwayCycle`, período de 7.8s con oscilación de -6° a +6° desde el techo `transform-origin: 50% 0%`). Su cono de luz volumétrico (`lamp-light-cone`, 540px x 460px) emula una lámpara antigua de baja potencia con un haz cálido contenido (`backdrop-filter: brightness(1.22) contrast(1.04)`) y máscara elíptica de atenuación progresiva sin cortes superiores, que barre de forma claramente perceptible y sincrónica el plano a través de la penumbra institucional del velo exterior (`.map-darkness-veil` al 72% de opacidad).
   * **Marco de Madera y Hierro (`marco_madera_vacio.png`):** Moldura perimetral exterior recortada a 2198x1378 px con saneado de píxeles perimetrales (eliminando los halos y líneas aclaradas del corte blanco original), proyectando sombra orgánica mediante `filter: drop-shadow` y dimensionada a `width: min(88vw, 1340px); max-height: min(82vh, 840px); aspect-ratio: 2198 / 1378;`.
   * **Vano Interior Acristalado (`map-inner-window`):** Delimitado estrictamente al cuadro interno del marco (`top: 15.82%; left: 10.37%; width: 79.3%; height: 68.87%; overflow: hidden;`), garantizando que ni el papel ni el cristal quebrado invadan las esquinas salientes del marco exterior.
   * **Textura Base de Pergamino (`papel_mapa_pergamino.png`):** Capa de fondo (`map-paper-layer`) ajustada al vano interno (1743x949 px).
   * **Plano Arquitectónico Vectorial Estilo Novela Gráfica (`map-svg-container`):** Cartografía técnica en entintado gótico limpio y realista (`viewBox="0 0 1380 750"`) con muros dobles en `#1A1412`, distribución institucional simétrica y funcional (Ala Oeste, Claustro Central abierto y Ala Este simétrica con Pasillo Este horizontal idéntico al Pasillo Oeste), accesos arquitectónicos sin parches ni cuñas triangulares (vano real de muro, hoja batiente y arco sutil de giro), gran pabellón de gimnasio polideportivo a escala completa ocupando el cuadrante inferior este, aspas judiciales de precinto (`#9E1B1B`), sellos tipográficos vectoriales «INACCESIBLE» y un indicador de orientación minimalista «ESTÁS AQUÍ» (diana circular reducida y limpia, sin cartelas ornamentales superfluas). El texto de acceso sur se rotula como `[ ENTRADA PRINCIPAL ]` situado por debajo de la línea de muro perimetral (`y="738"`).
   * **Posit Desplegable de Índice en el Marco (`frame-postit`):** Cuadro amarillo texturizado fijado en la parte central superior del marco (`top: 1.8%; left: 50%; transform: translateX(-50%)`) que utiliza el asset ilustrado `posit.png` (`104px x 104px`, expandible a `242px x 232px`), incorporando textura de papel apergaminado gastado, cinta adhesiva envejecida en el borde superior y esquina doblada. Al hacer clic, se expande fluidamente con sangrado interior ampliado (padding izquierdo de 36px y margen de lista) para situar las opciones limpiamente sobre la zona de escritura sin tocar el borde del papel («• Recetas», «• Enviar correo», «• Minijuego»), botón de cierre (`[×]`) y navegación directa al pulsar cualquiera de los apartados.
   * **Cristal Quebrado (`cristal_quebrado.png`):** Lámina en `mix-blend-mode: screen` al 65% de opacidad, restringida de borde a borde al vano interno acristalado sobre el plano pergamino oscurecido.
   * **Pegatina Adhesiva en el Marco (`frame-sticker-about`):** Etiqueta institucional (`etiqueta_sobre_mi_blank.png`) fijada a lo largo del listón inferior de madera a aproximadamente el 74% de la anchura (`left: 74%; bottom: 1.8%`), despejando el herraje de la esquina. Cabecera «EXPEDIENTE» y cuerpo «Sobre mí» renderizados vía DOM. Su animación de hover pivota sobre la cinta adhesiva superior (`transform-origin: 50% 4px; transform: perspective(600px) rotateX(24deg)`), desplegando físicamente el papel hacia el espectador con sombra proyectada hacia abajo y enlace directo a `pages/aboutus.html`.
   * **Sistema Óptico de Linterna y Velo Continuo:** Velo oscuro a pantalla completa oscurecido drásticamente (`circle 340px`, periférico al 94% de opacidad) junto a un oscurecimiento base del pergamino (`brightness(0.82)`), logrando que en estado nocturno el haz de la linterna (`brightness(1.38) contrast(1.1)`) resulte imprescindible y 100% funcional para examinar el plano. Conmutación disponible mediante la tecla `[F]`.

2. **Distribución e Interacción de Dependencias:**
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
     * *Interacción acústica sin bloqueos modales:* Al hacer clic sobre cualquiera de estas dependencias cerradas, no se abren ventanas emergentes; el sistema emite de manera inmediata un chasquido procedural de zumbador sordo (`MapEngine.playDenied()`), señalizando sin interrupciones la inviabilidad del acceso.

3. **Motor de Audio Sintético (`MapEngine`):** Emite zumbido eléctrico de fondo, conmutación táctil del interruptor de la linterna, interruptor acústico de la bombilla de techo (`playLightSwitch`), chisporroteo eléctrico de parpadeo aleatorio (`playFlickerSpark`) y sonido de denegación de acceso (`playDenied`) al interactuar con las salas inaccesibles.

