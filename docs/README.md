# Índice de Documentación Técnica - DAWlloween

Directorio central de arquitectura, infraestructura, diseño y lógica interactiva del proyecto DAWlloween.

---

## 1. Módulos Técnicos Activos

| Documento | Temática y Alcance |
| :--- | :--- |
| [**despliegue.md**](despliegue.md) | Contenedor Docker Compose (`php:8.2-apache`), automatización con `Makefile`, Virtual Host de Apache, DNS local `halloween.dev` y permisos de archivos. |
| [**stack.md**](stack.md) | Tecnologías base, política de cero comentarios en código, paleta de colores de terror noventero, tipografías y hojas de estilo modulares. |
| [**autenticacion.md**](autenticacion.md) | Persistencia de usuarios en memoria de sesión PHP (`$_SESSION['mimatriz']`), modelo de datos en `VarGlobales.php` y flujos de login, registro y recuperación en 2 pasos. |
| [**mapa-navegacion.md**](mapa-navegacion.md) | Fachada exterior con cancela y candado interactivo, plano central del colegio (SVG), expediente estilo "MISSING" y arquitectura modular JavaScript. |
| [**recetas.md**](recetas.md) | Comedor escolar, catálogo de 7 recetas temáticas (`recetasData.js`), iluminación de linterna y tubos fluorescentes, y navegación entre fichas. |
| [**correo.md**](correo.md) | Despacho de dirección, mecanismo cinemático de folio en máquina de escribir analógica y backend de transmisión SMTP (`config/sendmail.php`). |
| [**accesibilidad.md**](accesibilidad.md) | Panel de control estilo busca/mensáfono noventero (`.accessibility-pager`), sincronización en tiempo real, atajos de teclado y persistencia en `localStorage`. |
| [**audio.md**](audio.md) | Motor dual `AudioEngine` (archivos HD ElevenLabs SFX con respaldo procedimental Web Audio API), persistencia de ambiente interior y catálogo sonoro completo. |
| [**labelling.md**](labelling.md) | Nomenclatura y rótulos exactos presentes en formularios, plano, expediente y recetario confirmados con el código del repositorio. |
| [**sitemap.md**](sitemap.md) | Diagrama de flujo Mermaid que detalla la jerarquía de navegación desde la entrada exterior hasta cada una de las estancias interiores. |

---

## 2. Bocetos y Diseño Preliminar

La carpeta [**`diseño_lofi/`**](diseño_lofi/) almacena los wireframes de baja fidelidad originales:
* `login.jpg`: Boceto de cancela exterior y candado.
* `mapa_index.jpg`: Esquema inicial de distribución del plano del colegio.
* `comedor.jpg`: Composición de la mesa y ficha de recetas.
* `aboutus.jpg`: Estructura del cartel "MISSING".
* `correo.jpg`: Boceto de la máquina de escribir del despacho.

---

## 3. Módulos en Desarrollo (Roadmap)

* **`minijuego.md` (Fase 5):** Minijuego 2D con cuadrícula en JavaScript, lógica de persecución y escape en la sala de recreo (`juego.php`).
* **`manual-usuario.md` (Fase 6):** Guía de usuario no técnica orientada a la navegación y uso del centro escolar.
