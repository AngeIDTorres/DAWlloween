# DAWlloween - Proyecto Transversal

Proyecto web temático de terror institucional ambientado en un colegio clausurado, desarrollado para las asignaturas de Diseño de Interfaces Web (DIW), Despliegue de Aplicaciones Web (DAW), Desarrollo Web en Entorno Cliente (DWEC) y Desarrollo Web en Entorno Servidor (DWES).

---

## Estructura del Repositorio

* `app/`: Directorio raíz montado en el servidor web Apache (`/var/www/html/`).
  * `index.php`: Portal principal y punto de entrada al mapa cenital del colegio (requiere sesión).
  * `pages/`: Vistas y pantallas accesibles de la aplicación (`login.php`, `aboutus.php`, `recetas.php`, `juego.php`, `altaUsuario.php`, `cambioPass.php`, `correo.php`).
  * `includes/`: Lógica PHP que no se muestra directamente en el navegador (`VarGlobales.php`).
  * `css/`: Hojas de estilo temáticas.
  * `js/`: Scripts interactivos de cliente.
  * `img/`: Recursos gráficos, texturas y sprites.
  * `audio/`: Efectos de sonido y ambientación.
* `config/`: Archivos de configuración para el entorno servidor (Virtual Host de Apache con soporte SSL, directivas de `php.ini` y parámetros SMTP).
* `docs/`: Documentación técnica y manuales funcionales organizados por secciones.
* `docker-compose.yml`: Orquestador de contenedores para el servicio web Apache + PHP (puertos 80 y 443).
* `Makefile`: Automatización de tareas de despliegue (`make install`, `make up`, `make down`, `make restart`, `make ssl`).

---

## Documentación Técnica

La documentación del proyecto se organiza de manera modular y desacoplada dentro del directorio [`docs/`](docs/). Consulta el [**Índice de Documentación Técnica (`docs/README.md`)**](docs/README.md) para el detalle funcional y técnico completo.

| Documento | Temática Principal |
| :--- | :--- |
| [**despliegue.md**](docs/despliegue.md) | Contenedores Docker Compose, Virtual Host Apache con SSL/HTTPS y resolución DNS `halloween.dev`. |
| [**stack.md**](docs/stack.md) | Tecnologías centrales, estándar zero-comments, paleta cómic de los 90 y arquitectura CSS. |
| [**autenticacion.md**](docs/autenticacion.md) | Sesiones en backend PHP, matriz de credenciales y flujos de recuperación. |
| [**mapa-navegacion.md**](docs/mapa-navegacion.md) | Escenario de entrada, candado interactivo, haz de linterna y accesibilidad IPO. |
| [**audio.md**](docs/audio.md) | Motor Web Audio API, catálogo de efectos ElevenLabs SFX y precarga optimizada. |

---

## Requisitos

- Clonar el repo Linux o WSL
- Instalar docker y docker compose
- Instalar make
- Comando para instalar todos los requisitos:
   ```bash
   sudo apt install make docker.io docker-compose-v2 -y
   ```

## Puesta en Marcha Rápida

1. Añadir la siguiente entrada en el archivo `hosts` del sistema (`C:\Windows\System32\drivers\etc\hosts` en Windows o `/etc/hosts` en Linux):
   ```text
   127.0.0.1 halloween.dev
   ```
2. Levantar el entorno con Docker (genera automáticamente el certificado SSL al arrancar):
   ```bash
   # Instalar y levantar el contenedor
   make install
   ```
   ```bash
   # O levantar el contenedor directamente si ya está construido
   make up
   ```
3. Acceder en el navegador a:
   * **HTTPS:** [https://halloween.dev](https://halloween.dev) *(Acepta la advertencia de certificado autofirmado en "Configuración avanzada" la primera vez).*
   * **HTTP:** [http://halloween.dev](http://halloween.dev) o [http://halloween.local](http://halloween.local)
4. Para detener los contenedores:
   ```bash
   make down
   ```
