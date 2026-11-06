# Despacho de Dirección y Módulo de Correo

Resumen técnico, estético y arquitectónico del sistema de correspondencia interactiva mediante máquina de escribir de DAWlloween.

---

## 1. Visión General (`app/pages/correo.php`)

Estancia temática ambientada en el despacho abandonado del director escolar:

* **Escenario y Atmósfera:** Fondo inmersivo en alta definición (`bg_despacho_director.png`, 2752x1536) que ilustra el escritorio presidencial, estanterías victorianas, ventanal gótico nocturno y una máquina de escribir clásica con rodillo mecánico ensangrentado.
* **Iluminación Dinámica:**
  * **Lámpara de sobremesa:** Lámpara de escritorio vintage interactiva (`lampara_mesa_off.png` y `lampara_mesa_on.png`) con aura cálida difusa, conmutable mediante clic directo o mediante la tecla `L`.
  * **Haz de linterna:** Linterna seguidora de cursor con atajo de teclado (`F`), sincronizada con el velo de oscuridad ambiental.
  * **Integración con Busca:** Totalmente compatible con el mensáfono de accesibilidad (`.daw-pager-container`), permitiendo silenciar audio (`M`), alternar linterna (`F`), encender o apagar la lámpara (`L`) y regresar al plano central (`Esc`).
* **Protección de Sesión:** Requiere sesión de usuario activa (`obtenerUsuarioActivo()`), redirigiendo automáticamente a `login.php` en accesos anónimos.

---

## 2. Mecanismo del Folio y Máquina de Escribir

El sistema replica fielmente la cinemática de carga y avance de papel en una máquina de escribir analógica:

* **Ranura del Rodillo y Capa Superpuesta (Platen Feeder):** El contenedor `.typewriter-paper-feeder` se encuentra anclado entre `top: 5.5%` con altura `44%`, extendiéndose detrás del cilindro metálico. Para evitar cualquier corte recto artificial visible, la capa `.typewriter-roller-overlay` (`app/img/correo/rodillo_maquina_front.png`, `z-index: 35`) superpone la barra del rodillo y el contorno del tambor por encima del papel, asegurando que el folio emerja físicamente desde el interior de la máquina. La textura del escenario en `.office-stage` se renderiza de forma limpia con `#020104 url(...)` sin filtros de oscurecimiento local en el background para garantizar que la máscara del rodillo conserve exactamente el mismo tono, brillo y saturación que la máquina de escribir original, delegando el sombreado ambiental de forma homogénea a `.office-darkness-veil` (`z-index: 60`).
* **Área de Redacción Despejada:** El campo de texto `#cuerpo` no posee bordes de resalte laterales invasivos, integrándose de forma limpia directamente sobre la textura del pergamino.
* **Posición Inicial Descendente:** El folio (`.typewriter-paper-sheet`) comienza insertado a una altura calibrada dentro de la máquina mediante la variable CSS `--paper-shift: 255px`, asentando la base del encabezado `PEORES PESADILLAS:` justo al nivel del rodillo mecánico, sin sobresalir excesivamente hacia el ventanal gótico.
* **Elevación Dinámica por Línea Mecanografiada:** A medida que el usuario mecanografía en el área de texto (`#cuerpo`), la función `calculatePaperShift()` en `app/js/correo.js` evalúa las líneas visuales activas calculando el salto de línea tanto en retornos explícitos (`\n`) como en el límite natural de 37 caracteres por renglón (`countVisualLines`). Al escribir en la primera línea se aplica una cota base de 240px, y por cada salto de línea posterior el folio asciende un paso exacto de 26px (`(activeLine - 1) * 26px`), manteniendo la línea en curso siempre en foco sobre el rodillo y limitando el desplazamiento a un tope de seguridad de 40px para evitar que el borde inferior del papel se desancle.
* **Márgenes Rústicos Ampliados:** La capa `.typewriter-form-content` aplica un espaciado interno generoso (`padding: 11% 13% 10% 13%`), asegurando que las líneas mecanografiadas nunca colisionen con los bordes rasgados, quemados ni salpicaduras del folio pergamino (`folio_maquina_escribir.png`).

---

## 3. Disposición de Acciones y Botón de Envío

* **Ubicación en el Chasis de la Máquina:** El botón de envío principal (`#sendEmailBtn.typewriter-chassis-send-btn`) se sitúa integrado en el frontis metálico del chasis de la máquina de escribir (`left: 50.7%`, `top: 82.55%`), directamente debajo de la barra espaciadora del teclado analógico. Al residir dentro de `.office-interactive-area`, escala de forma simétrica y fija con el teclado en cualquier resolución y relación de aspecto.
* **Vinculación con el Formulario:** Utiliza el atributo nativo HTML5 `form="typewriterMailForm"`, lo que permite disparar el envío del formulario mecanografiado desde fuera del contenedor del folio sin interferir en los márgenes ni en la cinemática de desplazamiento del papel.
* **Atajos Rápidos:** El formulario permite enviarse cómodamente mediante la combinación `Ctrl + Enter` (o `Cmd + Enter`) mientras el usuario redacta en el cuerpo de la carta o en cualquier campo.
* **Respuesta Auditiva Temática y Polifonía:**
  * **Tecleo Polifónico:** `AudioEngine.playTypewriterKey()` implementa un pool de 12 canales independientes con rotación round-robin, permitiendo que las pulsaciones mecanografiadas rápidas se superpongan de manera natural sin cortarse ni pisarse entre sí (`maquina_tecla.mp3`).
  * **Retorno de carro polifónico:** `AudioEngine.playCarriageReturn()` cuenta con un pool dedicado de 6 canales independientes y volumen calibrado (0.85) para reproducir fielmente el deslizamiento mecánico y la campana analógica (`maquina_salto_linea.mp3`). Se reproduce automáticamente tanto al pulsar `Enter` como al cambiar de línea de forma natural tras superar el tope de 37 caracteres por renglón sin solapamiento destructivo.
  * **Envío:** `AudioEngine.playMailSend()` al presionar `[ ENVIAR ]` o `Ctrl + Enter` reproduce el golpe seco de matasellos postal sobre papel (`correo_enviar.mp3`).
  * **Lámpara de sobremesa:** `AudioEngine.playDeskLampOn()` y `playDeskLampOff()` conmutan el conmutador de sobremesa sin activar el chasquido secundario de la linterna.
* **Envío Asíncrono sin Recarga (AJAX):** El evento `submit` intercepta el flujo tradicional mediante `fetch()` asíncrono hacia `correo.php` con cabeceras `X-Requested-With: XMLHttpRequest` y `Accept: application/json`. El backend procesa el despacho y responde en formato JSON (`{"success": true, "message": "...", "status": "exito"}`), actualizando dinámicamente el matasellos `.typewriter-stamp-status` sobre el folio con animación de sellado sin recargar nunca la página. Tras mostrarse, el matasellos desaparece suavemente tras 4,5 segundos mediante una transición de desvanecimiento (`opacity: 0`).
* **Seguridad y Hardening en el Envío:**
  * **Protección Anti-CSRF:** El formulario incrusta un token seguro generado en servidor (`generarCsrfToken()`) verificado obligatoriamente en cada despacho POST.
  * **Prevención de Inyección de Cabeceras (CWE-93):** Se eliminan rigurosamente retornos de carro y saltos de línea (`\r`, `\n`) en el campo `$asunto` antes de transferirlo a `mail()`, evitando la inserción ilegítima de directivas `Bcc:` o `Cc:`.
  * **Límites de Longitud:** Se restringen las dimensiones de entrada para prevenir ataques de denegación de servicio por saturación de búfer ($150$ caracteres para asunto/destinatario y $5000$ caracteres para el cuerpo).

---

## 4. Backend de Envío y Configuración SMTP

El backend procesa los envíos a través del wrapper PHP estándar `mail()`, el cual ha sido configurado en el entorno de despliegue para apoyarse en un cliente SMTP CLI con cifrado TLS:

* **Configuración del Servidor (`config/sendmail.ini`):**
  * `smtp_server`: `smtp.gmail.com`
  * `smtp_port`: `587`
  * `smtp_ssl`: `tls`
  * `auth_username` y `auth_password`: Credenciales protegidas para autenticación SMTP mediante contraseña de aplicación de 16 caracteres.
* **Motor de Transmisión (`config/sendmail.php`):** Script CLI ejecutable montado en `/usr/sbin/sendmail` con terminación estricta de línea Unix (LF), lo que previene fallos de invocación por caracteres de retorno de carro (`\r`) en el intérprete `php`. Sanitiza automáticamente contraseñas de aplicación con espacios (formato 4x4 de Google), lee el flujo del mensaje desde `php://stdin`, conecta mediante socket TLS a Gmail, realiza el handshake `EHLO / STARTTLS / AUTH LOGIN`, valida los destinatarios y entrega el contenido.
* **Sellado y Estado:** Tras procesar la petición POST, la página muestra un matasellos temático vintage (`.typewriter-stamp-status`) sobre el folio indicando el éxito del despacho o notificando cualquier incidencia en la entrega.

---

## 5. Tabla de Controles y Atajos

| Acción | Disparador en Pantalla | Teclado |
| :--- | :--- | :--- |
| **Enviar Despacho** | Botón `[ ENVIAR ]` (Bajo la barra espaciadora) | `Ctrl + Enter` |
| **Avanzar Papel / Salto de línea** | Tecla Enter en el cuerpo del folio | `Enter` |
| **Alternar Lámpara de Mesa** | Clic en la lámpara / 3º Botón del busca | `L` |
| **Alternar Haz de Linterna** | 2º Botón del busca (Linterna) | `F` |
| **Silenciar Audio** | 4º Botón del busca (Altavoz) | `M` |
| **Volver al Plano Central** | 1º Botón del busca (Icono Plano) | `Esc` |

