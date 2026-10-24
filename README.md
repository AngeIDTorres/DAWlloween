# DAWlloween - Proyecto Transversal

Proyecto web temático de terror institucional ambientado en un colegio clausurado, desarrollado para las asignaturas de Diseño de Interfaces Web (DIW), Despliegue de Aplicaciones Web (DAW), Desarrollo Web en Entorno Cliente (DWEC) y Desarrollo Web en Entorno Servidor (DWES).

---

## Estructura del Repositorio

* `app/`: Directorio raíz montado en el servidor web Apache (`/var/www/html/`).
  * `index.html`: Portal principal y punto de entrada al mapa cenital del colegio.
  * `pages/`: Vistas y pantallas accesibles de la aplicación (`login.php`, `aboutus.html`, `recetas.html`, `juego.html`, `altaUsuario.php`, `cambioPass.php`, `correo.php`).
  * `includes/`: Lógica PHP que no se muestra directamente en el navegador (`VarGlobales.php`).
  * `css/`: Hojas de estilo temáticas.
  * `js/`: Scripts interactivos de cliente.
  * `img/`: Recursos gráficos, texturas y sprites.
  * `audio/`: Efectos de sonido y ambientación.
* `config/`: Archivos de configuración para el entorno servidor (Virtual Host de Apache, directivas de `php.ini` y parámetros SMTP de correo).
* `docs/`: Documentación técnica y manuales funcionales organizados por secciones.
* `docker-compose.yml`: Orquestador de contenedores para el servicio web Apache + PHP.
* `Makefile`: Automatización de tareas de despliegue (`make install`, `make up`, `make down`, `make restart`).

---

## Índice de Documentación (`docs/`)

A continuación se detalla la finalidad de cada documento presente en la carpeta [`docs/`](file:///Z:/docs/):

* [**despliegue.md**](file:///Z:/docs/despliegue.md): Explica la arquitectura de despliegue con Docker, la configuración del Virtual Host `halloween.conf`, la resolución DNS mediante el archivo `hosts` del sistema operativo y las políticas de permisos (`chmod`).
* [**stack.md**](file:///Z:/docs/stack.md): Define el stack de tecnologías empleado, la paleta cromática exacta (HEX) inspirada en el cómic de terror de los 90 y las tipografías de Google Fonts utilizadas en la interfaz.
* [**autenticacion.md**](file:///Z:/docs/autenticacion.md): *(Fase 2)* Describe el ciclo de vida de las sesiones en PHP, la estructura de la matriz bidimensional de usuarios y los formularios de login, registro y recuperación de contraseña.
* [**mapa-navegacion.md**](file:///Z:/docs/mapa-navegacion.md): *(Fase 3)* Detalla la arquitectura de navegación, la animación de la verja y el candado, el efecto de linterna interactiva y las pautas de Interacción Persona-Ordenador (IPO).
* [**recetas.md**](file:///Z:/docs/recetas.md): *(Fase 4)* Documenta el catálogo del comedor escolar, el carrusel de recetas en bandeja metálica y los estilos distintivos de platos destacados.
* [**correo.md**](file:///Z:/docs/correo.md): *(Fase 4)* Describe el funcionamiento del buzón interactivo en la máquina de escribir del despacho y la integración del envío de correos vía SMTP.
* [**minijuego.md**](file:///Z:/docs/minijuego.md): *(Fase 5)* Especifica la lógica 2D del minijuego con matrices en JavaScript, el sistema de detección de colisiones, la IA del enemigo y el mecanismo de vidas y drop de objetos.
* [**manual-usuario.md**](file:///Z:/docs/manual-usuario.md): *(Fase 6)* Guía de uso no técnica redactada en lenguaje sencillo y accesible para cualquier usuario final.

---

## Puesta en Marcha Rápida

1. Añadir la siguiente entrada en el archivo `hosts` del sistema (`C:\Windows\System32\drivers\etc\hosts` en Windows o `/etc/hosts` en Linux):
   ```text
   127.0.0.1 halloween.dev
   ```
2. Levantar el entorno con Docker:
   ```bash
   make up
   ```
3. Acceder en el navegador a:
   [http://halloween.dev](http://halloween.dev)
4. Para detener los contenedores:
   ```bash
   make down
   ```

