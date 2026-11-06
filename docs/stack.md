# Stack Tecnológico, Diseño e Identidad Visual

Resumen de las tecnologías base, estándar de código, paleta de colores y arquitectura visual de DAWlloween.

---

## 1. Stack Tecnológico

* **Servidor Web:** Apache 2.4 en contenedor Docker (`php:8.2-apache`).
* **Backend:** PHP 8.2 (sesiones nativas en memoria, matrices bidimensionales y utilidades de servidor).
* **Frontend:** HTML5 semántico, CSS3 puro y JavaScript Vanilla (ES Modules, Web Audio API, Canvas/CSS para iluminación).
* **Estándar Zero-Comments:** Los archivos de código fuente no contienen comentarios (`//`, `/* */`, `<!-- -->`). Toda la documentación técnica reside exclusivamente en la carpeta `docs/`.

---

## 2. Paleta Cromática (Cómic de Terror de los 90)

Diseño inspirado en terror institucional y psicológico noventero, descartando verdes convencionales:

| Tono | Token CSS | HEX | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Morado Sombra** | `--purple-dark` | `#231733` | Fondos principales, sombras profundas y capas base |
| **Morado Medio** | `--purple-mid` | `#3A2346` | Gradientes de iluminación y penumbra |
| **Azul Nocturno** | `--blue-night` | `#1D263B` | Superficies de contenedores, marcos y tarjetas |
| **Azul Reflejos** | `--blue-reflect` | `#2A3A56` | Bordes secundarios y reflejos lunares |
| **Rojo Sangre** | `--red-blood` | `#6E2222` | Botones de acción, bordes de alerta y tachones del plano |
| **Rojo Óxido** | `--red-rust` | `#8A2E2E` | Subtítulos, estados de advertencia y desgaste |
| **Ámbar Luz** | `--amber-light` | `#C68E42` | Foco de la linterna y contrastes secundarios |
| **Ámbar Brillo** | `--amber-glow` | `#DDA95A` | Títulos principales, llave y elementos destacados |
| **Pergamino Fondo** | `--parchment-bg` | `#D3C6A6` | Fichas de recetas, carteles y papel rústico |
| **Pergamino Texto** | `--parchment-txt` | `#E0D5B5` | Tipografía principal sobre superficies oscuras |
| **Hierro Negro** | `--iron` | `#33373B` | Verjas, candados y herrajes metálicos |
| **Hierro Gastado** | `--iron-worn` | `#4A4F54` | Flechas de navegación y bisagras desgastadas |

---

## 3. Tipografía

* **Titulares y Rótulos de Advertencia:** `Creepster` (Google Fonts). Logotipos, carteles y cabeceras de impacto.
* **Cuerpo y Formularios:** `Special Elite` (Google Fonts). Estilo mecanografiado retro para legibilidad en textos, campos y fichas.

---

## 4. Arquitectura Modular de CSS (`app/css/`)

Hojas de estilo organizadas por contexto para evitar acoplamiento:

| Archivo | Ámbito y Propósito |
| :--- | :--- |
| `globals.css` | Variables cromáticas `:root`, reset global, tipografías y cortina de fundido `.blackout-curtain`. |
| `login.css` | Fachada exterior, cancelas batientes, animación del candado y cerradura con llave antigua. |
| `auth.css` | Formularios temáticos de registro (`altaUsuario.php`) y recuperación (`cambioPass.php`) sobre folio A4 de expediente institucional (`folio_expediente_a4.png`). |
| `map.css` | Plano del colegio, marco institucional de madera, cristal quebrado, bombilla oscilante y posit. |
| `recetas.css` | Comedor escolar, bandeja de acero, ficha de pergamino, flechas y lámpara de tubos fluorescentes. |
| `aboutus.css` | Expediente personal y modal del cartel "MISSING" con fotografía tramada. |
| `correo.css` | Despacho de dirección, escritorio con máquina de escribir, folio mecánico desplazable y lámpara de sobremesa. |
| `accessibility.css` | Panel del busca/mensáfono retro, pulsadores físicos y display LCD ámbar. |

---

## 5. Arquitectura Modular de JavaScript (`app/js/`)

Controladores ES Modules estructurados por ámbito de funcionalidad:

| Script | Propósito y Control |
| :--- | :--- |
| `main.js` | Orquestación de la cancela exterior, candado interactivo, giro de llave y autenticación AJAX (`login.php`). |
| `map.js` | Navegación interactiva por el plano, bombilla oscilante, post-it desplegable y accesibilidad. |
| `recetas.js` | Comedor escolar, carrusel de recetas, volteo de tarjetas y lámpara de tubos fluorescentes. |
| `correo.js` | Despacho de dirección, mecanografía a máquina con audio polifónico, elevación del folio y despacho AJAX. |
| `aboutus.js` | Ficha biográfica, modal interactivo del expediente y sonido de examen de papel. |
| `core/` | Motores transversales: `audio.js` (Web Audio API), `flashlight.js` (haz de linterna dinámico), `accessibility.js` (mensáfono retro). |
