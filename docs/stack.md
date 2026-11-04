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

| Tono | HEX | Uso Principal |
| :--- | :--- | :--- |
| **Morado Sombra** | `#231733` | Fondos principales, sombras profundas y capas base |
| **Morado Medio** | `#3A2346` | Gradientes de iluminación y penumbra |
| **Azul Nocturno** | `#1D263B` | Superficies de contenedores, marcos y tarjetas |
| **Azul Reflejos** | `#2A3A56` | Bordes secundarios y reflejos lunares |
| **Rojo Sangre** | `#6E2222` | Botones de acción, bordes de alerta y tachones del plano |
| **Rojo Óxido** | `#8A2E2E` | Subtítulos, estados de advertencia y desgaste |
| **Ámbar Luz** | `#C68E42` | Foco de la linterna y contrastes secundarios |
| **Ámbar Brillo** | `#DDA95A` | Títulos principales, llave y elementos destacados |
| **Pergamino Fondo** | `#D3C6A6` | Fichas de recetas, carteles y papel rústico |
| **Pergamino Texto** | `#E0D5B5` | Tipografía principal sobre superficies oscuras |
| **Hierro Negro** | `#33373B` | Verjas, candados y herrajes metálicos |
| **Hierro Gastado** | `#4A4F54` | Flechas de navegación y bisagras desgastadas |

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
| `auth.css` | Formularios temáticos de registro (`altaUsuario.php`) y recuperación (`cambioPass.php`). |
| `map.css` | Plano del colegio, marco institucional de madera, cristal quebrado, bombilla oscilante y posit. |
| `recetas.css` | Comedor escolar, bandeja de acero, ficha de pergamino, flechas y lámpara de tubos fluorescentes. |
| `aboutus.css` | Expediente personal y modal del cartel "MISSING" con fotografía tramada. |
| `accessibility.css` | Panel del busca/mensáfono retro, pulsadores físicos y display LCD ámbar. |
| `style.css` | Hoja de compatibilidad e importación global. |
