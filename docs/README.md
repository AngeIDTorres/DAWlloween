# Índice de Documentación Técnica - DAWlloween

Este directorio agrupa los manuales de arquitectura, infraestructura, diseño y lógica interactiva del proyecto DAWlloween de forma modular, desacoplada y sin numeración fija en los nombres de archivo.

---

## 1. Módulos Técnicos Activos

* **[despliegue.md](despliegue.md):** Infraestructura de contenedores Docker Compose, Virtual Host Apache (`000-default.conf`), mapeo de volúmenes, permisos y resolución DNS local `halloween.dev`.
* **[stack.md](stack.md):** Tecnologías empleadas, estándar de código limpio (cero comentarios en código fuente), paleta cromática inspirada en cómic de terror de los 90 (`globals.css`) y hojas de estilo modulares (`login.css`, `auth.css`).
* **[autenticacion.md](autenticacion.md):** Mecanismos de autenticación en backend PHP (`VarGlobales.php`), matriz en sesión `$_SESSION['mimatriz']`, registro de nuevos usuarios y recuperación de contraseña en dos pasos.
* **[mapa-navegacion.md](mapa-navegacion.md):** Arquitectura visual del escenario de entrada, transición de escala del candado (`padlock-wrapper`), salto y sacudida en contenedor interno (`padlock-hop-inner`), haz de linterna y accesibilidad IPO.
* **[audio.md](audio.md):** Motor de sonido dual (`AudioEngine`), decodificación Web Audio API, fondo ambiental comprimido en OGG Vorbis (`ambiente_noche.ogg`, `ambiente_interior.ogg`), precarga proactiva y prompts de efectos para ElevenLabs SFX.
* **[recetas.md](recetas.md):** Catálogo gastronómico del comedor escolar (`recetas.html`), modelo de datos de recetas (`recetasData.js`), iluminación de linterna, lámpara de tubos fluorescentes colgante con halo blanco neutro y navegación entre fichas.
* **[accesibilidad.md](accesibilidad.md):** Panel de accesibilidad (busca/mensáfono retro con assets gráficos dedicados), persistencia cross-page (`localStorage`), controles de retorno al mapa, linterna, silenciado global de audio e iluminación de sala fija.

---

## 2. Módulos Planificados (Roadmap de Fases)

* **`correo.md` (Fase 4):** Mecanismo del buzón interactivo en la máquina de escribir del despacho y servicio de envío de correos vía SMTP.
* **`minijuego.md` (Fase 5):** Lógica del juego 2D con matrices en JavaScript, detección de colisiones, IA de persecución y sistema de inventario/drop.
* **`manual-usuario.md` (Fase 6):** Guía de navegación y uso funcional no técnica para el usuario final.

---

## 3. Directrices Globales de Desarrollo

1. **Zero Comments Policy:** Prohibido incluir comentarios (`//`, `/* */`, `<!-- -->`) dentro de los archivos de código fuente (`.php`, `.js`, `.css`, `.html`). Toda explicación arquitectónica reside exclusivamente en este directorio.
2. **Sincronización Continua:** Cualquier modificación en la lógica, estilos o infraestructura que afecte a los flujos documentados debe sincronizarse de inmediato en su documento `.md` correspondiente.

