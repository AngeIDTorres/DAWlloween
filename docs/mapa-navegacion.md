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

## 2. Lógica de Animación e Interacción en Cliente (`app/js/main.js`)

Toda la interactividad se apoya en JavaScript Vanilla y la API de Web Audio para evitar dependencias externas.

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

