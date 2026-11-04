# Despliegue de la Aplicación y Configuración del Servidor

Guía concisa de infraestructura, contenedorización con Docker, configuración del Virtual Host de Apache con soporte SSL/HTTPS, resolución de nombres y permisos.

---

## 1. Contenedorización (Docker Compose)

El entorno se orquesta desde la raíz mediante `docker-compose.yml` utilizando la imagen oficial `php:8.2-apache`:

* **Servicio:** `web` (nombre de contenedor: `halloween_apache`).
* **Puertos expuestos:**
  * `80:80`: Acceso HTTP estándar.
  * `443:443`: Acceso HTTPS con certificado SSL autofirmado.
* **Volúmenes montados:**
  * `./app:/var/www/html`: Código de la aplicación en el DocumentRoot de Apache.
  * `./config/halloween.conf:/etc/apache2/sites-available/000-default.conf`: Virtual Host de Apache (HTTP y HTTPS).
  * `./config/php.ini:/usr/local/etc/php/conf.d/custom-php.ini`: Configuración PHP (sesiones y entorno).
  * `./config/ssl:/etc/apache2/ssl`: Directorio para certificados SSL generados.
* **Automatización SSL al inicio:** El contenedor activa `mod_ssl` y genera automáticamente un certificado autofirmado de 2048 bits válido por 365 días para `halloween.dev` si no existe previamente.
* **Zona Horaria:** `TZ=Europe/Madrid`.

---

## 2. Automatización con Makefile

Directivas disponibles en el `Makefile` de la raíz:

| Comando | Acción |
| :--- | :--- |
| `make install` | Construye y levanta el contenedor (`up -d --build`), autogenera el certificado SSL y asigna permisos `755` a `/var/www/html`. |
| `make up` | Levanta los contenedores en segundo plano (`docker compose up -d`). |
| `make down` | Detiene y elimina contenedores, redes y volúmenes (`docker compose down`). |
| `make restart` | Reinicia el servicio Apache/PHP (`docker compose restart`). |
| `make ssl` | Fuerza la regeneración del certificado SSL autofirmado dentro del contenedor y recarga Apache. |

---

## 3. Virtual Host de Apache (`config/halloween.conf`)

Define la configuración para tráfico HTTP (puerto 80) y HTTPS seguro (puerto 443):

* **Dominios reconocidos:** `halloween.dev`, `www.halloween.dev`, `halloween.local`, `www.halloween.local`.
* **Directivas SSL:**
  * `SSLEngine on`
  * `SSLCertificateFile /etc/apache2/ssl/halloween.crt`
  * `SSLCertificateKeyFile /etc/apache2/ssl/halloween.key`
* **Directivas de seguridad:**
  * `Options -Indexes +FollowSymLinks` (evita listado de ficheros).
  * `AllowOverride All` (habilita procesamiento de reglas `.htaccess`).
  * `Require all granted`.

---

## 4. Resolución DNS Local (Archivo `hosts`) y Acceso Web

El archivo `hosts` del sistema operativo asocia direcciones IP a nombres de dominio:

* **Rutas:**
  * Windows: `C:\Windows\System32\drivers\etc\hosts`
  * Linux / macOS: `/etc/hosts`
* **Entrada requerida en `hosts`:**
  ```text
  127.0.0.1 halloween.dev www.halloween.dev halloween.local www.halloween.local
  ```
* **Acceso en el navegador:**
  * **HTTPS (Recomendado):** [https://halloween.dev](https://halloween.dev)  
    *(Al ser un certificado autofirmado, pulsa en «Configuración avanzada» -> «Acceder a halloween.dev (no seguro)» la primera vez).*
  * **HTTP:** [http://halloween.dev](http://halloween.dev) o [http://halloween.local](http://halloween.local)

---

## 5. Permisos de Archivos

Apache corre dentro del contenedor bajo el usuario `www-data` (UID 33). Si surgen errores `403 Forbidden`:

```bash
chmod -R 755 app config
find app config -type f -exec chmod 644 {} +
```
