# Stack Tecnológico, Diseño e Identidad Visual

Este documento describe las tecnologías base seleccionadas, la paleta cromática y la tipografía para el proyecto DAWlloween.

---

## 1. Stack Tecnológico

* **Servidor Web:** Apache 2.4 sobre contenedor Docker Debian-based (`php:8.2-apache`).
* **Backend:** PHP 8.2 (sesiones nativas, matrices bidimensionales y función de correo).
* **Frontend:** HTML5 semántico, CSS3 puro y JavaScript Vanilla (manipulación de DOM, Canvas/CSS para efectos de iluminación y matrices 2D para minijuego).
* **Estándar de Código:** Ausencia total de comentarios en los archivos de código fuente. Toda la documentación se canaliza a través de los archivos descriptivos en la carpeta `docs/`.

---

## 2. Paleta Cromática (Estilo Cómic de Terror de los 90)

Se descarta el uso de tonos verdes para evitar la estética convencional de Halloween y enfocar el ambiente en el terror psicológico institucional (estilo Junji Ito / Silent Hill).

| Tono | Código HEX | Aplicación |
| :--- | :--- | :--- |
| **Morado Sombra** | `#231733` | Fondos principales, sombras profundas y capas base |
| **Morado Medio** | `#3A2346` | Gradientes de iluminación y degradados de linterna |
| **Azul Nocturno** | `#1D263B` | Superficies de contenedores, marcos y tarjetas |
| **Azul Reflejos** | `#2A3A56` | Bordes secundarios y reflejos lunares |
| **Rojo Sangre** | `#6E2222` | Bordes de advertencia, botones de acción y tachones de mapa |
| **Rojo Óxido** | `#8A2E2E` | Subtítulos, estados de alerta y manchas de desgaste |
| **Ámbar Luz** | `#C68E42` | Foco de la linterna y contrastes secundarios |
| **Ámbar Brillo** | `#DDA95A` | Títulos principales y resaltados luminosos |
| **Pergamino Fondo** | `#D3C6A6` | Fichas de recetas, carteles y hojas de máquina de escribir |
| **Pergamino Texto** | `#E0D5B5` | Color tipográfico principal sobre fondos oscuros |
| **Hierro Negro** | `#33373B` | Verjas, candados y rejas metálicas |
| **Hierro Gastado** | `#4A4F54` | Flechas de carrusel y mecanismos desgastados |

---

## 3. Tipografía

* **Encabezados y Títulos:** `Creepster` (Google Fonts). Uso reservado a carteles de advertencia, cabeceras principales y logotipos temáticos.
* **Cuerpo y Formularios:** `Special Elite` (Google Fonts). Tipografía estilo máquina de escribir antigua con alta legibilidad para textos descriptivos, etiquetas de formulario y fichas de recetas.

---

## 4. Estructura Modular de Hojas de Estilo (CSS)

Para optimizar la carga y la mantenibilidad, los estilos se encuentran desacoplados por contexto de uso:

* **`app/css/globals.css`:** Variables cromáticas (`:root`), reseteo universal, tipografías globales, contenedores de alerta genéricos (`.warning-container`, `.badge`) y cortina de transición (`.blackout-curtain`).
* **`app/css/login.css`:** Escenario de entrada (`.login-stage`), cancelas batientes (`.gate-container`), animación física del candado (`.padlock-wrapper`), cerradura y llave antigua interactiva (`.antique-key`).
* **`app/css/auth.css`:** Formularios temáticos de registro y recuperación de clave (`altaUsuario.php`, `cambioPass.php`).
* **`app/css/map.css`:** Escenario del plano arquitectónico (`.map-stage`), marco institucional recortado, vano interno acristalado, luminaria colgante con balanceo pendular (`.hanging-lamp`), velo nocturno con foco de linterna y posit texturizado (`.frame-postit`).
* **`app/css/style.css`:** Puente de compatibilidad que importa las hojas modulares.

