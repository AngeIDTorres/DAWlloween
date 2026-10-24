# Despliegue de la Aplicación y Configuración del Servidor

Este documento detalla la infraestructura, orquestación con Docker, configuración del Virtual Host de Apache, resolución de nombres en el archivo hosts del sistema y políticas de permisos para el proyecto DAWlloween.

---

## 1. Contenedorización con Docker Compose

La aplicación se despliega mediante Docker Compose utilizando la imagen oficial `php:8.2-apache`. El archivo de orquestación se sitúa en la raíz del repositorio (`docker-compose.yml`) y delega la ejecución de Apache y PHP sin necesidad de instalar dependencias directamente en la máquina local.

### Mapeo de Volúmenes y Puertos
* **Puerto 80:80:** Redirige las peticiones entrantes en el puerto 80 del anfitrión hacia el puerto 80 del contenedor.
* **`./app:/var/www/html`:** Monta el directorio público de la aplicación en el DocumentRoot de Apache. De esta forma, cualquier cambio en los archivos de la carpeta `app` tiene reflejo inmediato sin reconstruir la imagen.
* **`./config/halloween.conf:/etc/apache2/sites-available/000-default.conf`:** Sobrescribe la configuración por defecto de Apache con el Virtual Host específico del proyecto.
* **`./config/php.ini:/usr/local/etc/php/conf.d/custom-php.ini`:** Aplica configuraciones personalizadas de PHP (gestión de sesiones, depuración de errores y ruta del comando de correo).

---

## 2. Automatización con Makefile

Para agilizar el ciclo de vida del contenedor se dispone de un `Makefile` en la raíz con las siguientes directivas:

* `make install`: Construye y levanta el contenedor en segundo plano, aplicando automáticamente la configuración de permisos sobre `/var/www/html`.
* `make up`: Inicia los contenedores definidos en `docker-compose.yml` en modo desacoplado (`-d`).
* `make down`: Detiene y elimina los contenedores, redes y volúmenes temporales generados por Docker Compose.
* `make restart`: Reinicia el servicio Apache/PHP.

---

## 3. Configuración del Virtual Host (`halloween.conf`)

El archivo `config/halloween.conf` define el host virtual con las siguientes directivas:

* `ServerName halloween.dev`: Dominio asignado al proyecto.
* `ServerAlias www.halloween.dev`: Alias secundario de resolución.
* `DocumentRoot /var/www/html`: Ruta interna donde Apache sirve la carpeta `app/`.
* `Options -Indexes +FollowSymLinks`: Impide el listado de directorios cuando no existe un archivo de índice, reforzando la seguridad.
* `AllowOverride All`: Habilita el procesamiento de reglas `.htaccess` en caso de requerirse reescrituras de URL.
* `Require all granted`: Permite el acceso público a las peticiones dirigidas a este sitio.

---

## 4. Resolución DNS Local (Archivo `hosts`)

Para que el navegador web del equipo anfitrión resuelva el dominio `http://halloween.dev` y no intente buscarlo en los servidores DNS públicos de internet, es necesario vincular el nombre a la dirección de bucle local (`127.0.0.1`).

### Procedimiento de Configuración
1. **Windows (Máquina Cliente):**
   * Abrir un editor de texto con permisos de Administrador.
   * Abrir `C:\Windows\System32\drivers\etc\hosts`.
   * Si el servidor Docker corre en una máquina remota en la red local (ej. `192.168.2.214`), añadir:
     ```text
     192.168.2.214 halloween.dev
     ```
   * Si corre en la máquina local (localhost):
     ```text
     127.0.0.1 halloween.dev
     ```
   * Guardar los cambios.
2. **Linux / macOS:**
   * Editar con privilegios: `sudo nano /etc/hosts`.
   * Añadir la IP correspondiente (`192.168.2.214 halloween.dev` o `127.0.0.1 halloween.dev`).

Una vez guardado, cualquier petición a `http://halloween.dev` es interceptada por el sistema operativo y dirigida a `127.0.0.1:80`, donde Docker la traslada al contenedor de Apache.

---

## 5. Gestión de Permisos (`chmod`)

Para garantizar que el servidor web pueda leer los contenidos sin exponer la integridad del sistema:

* El proceso de Apache dentro del contenedor corre bajo el usuario `www-data` (UID 33). Si los directorios tienen permisos restrictivos `700` (`drwx------`) y los ficheros `600` (`-rw-------`) pertenecientes a `root`, Apache no puede comprobar la existencia de `.htaccess` ni leer los archivos montados, arrojando el error `403 Forbidden (Server unable to read htaccess file)`.
* **Comandos de corrección en el host del servidor:**
  ```bash
  # Asignar permisos de ejecución y lectura a todos los directorios
  find . -type d -exec chmod 755 {} +

  # Asignar permisos de lectura a todos los ficheros
  find . -type f -exec chmod 644 {} +
  ```
  O de forma directa y recursiva:
  ```bash
  chmod -R 755 app config
  chmod 755 .
  ```
* Esto asegura que `www-data` pueda entrar en `app/` y leer los archivos públicos y configuraciones sin riesgos de seguridad.

