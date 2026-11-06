# Autenticación, Sesiones y Gestión de Usuarios

Resumen del sistema de autenticación en backend PHP mediante sesiones nativas en memoria de servidor.

---

## 1. Modelo de Datos (`$_SESSION['mimatriz']`)

La persistencia de usuarios se gestiona en memoria de sesión nativa (`session_start()`) sin base de datos relacional. La variable `$_SESSION['mimatriz']` contiene una lista de arrays asociativos con los siguientes campos:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Usuario` | `string` | Nombre de usuario único (comparado sin distinguir mayúsculas) |
| `Contraseña` | `string` | Clave de acceso |
| `Email` | `string` | Dirección de correo electrónico |
| `Perfil` | `string` | Rol asignado (`admin` o `user`) |
| `Pregunta` | `string` | Pregunta de seguridad configurada en el registro |
| `Respuesta` | `string` | Respuesta requerida para restaurar la clave |
| `UsuarioActual` | `bool` | Indicador de sesión activa en el registro |

### Usuario Administrador Predefinido
Inicializado automáticamente en `VarGlobales.php`:
* **Usuario:** `halloween`
* **Contraseña:** `311026`
* **Email:** `halloween@dawlloween.dev`
* **Perfil:** `admin`
* **Pregunta:** `¿Cuál es tu peor pesadilla?`
* **Respuesta:** `suspenso`

---

## 2. Operaciones del Backend (`app/includes/VarGlobales.php`)

| Función | Descripción |
| :--- | :--- |
| `AltaUsuario($nuevoUser): bool` | Comprueba que el usuario no exista (`strcasecmp`) y lo añade a `$_SESSION['mimatriz']`. Retorna `true` en éxito y `false` si ya existe. |
| `cambioContraseña($usuario, $respuesta, $nuevaPassword): bool` | Valida la respuesta secreta (eliminando espacios con `trim`) y actualiza la clave por referencia. |
| `obtenerPreguntaUsuario($usuario): ?string` | Devuelve la pregunta secreta configurada por el usuario o `null` si no existe. |
| `currentUser($usuario): ?array` | Marca `UsuarioActual = true` en el usuario autenticado (y `false` en el resto), guardando copia en `$_SESSION['usuario_activo']`. |
| `obtenerUsuarioActivo(): ?array` | Retorna los datos del usuario actualmente autenticado. |
| `cerrarSesion(): void` | Limpia las marcas de sesión activa y la referencia en `$_SESSION['usuario_activo']`. |
| `redirect($url): void` | Envía cabecera `Location` y termina el script con `exit()`. |

---

## 3. Flujo de Vistas (`app/pages/`)

* **Acceso (`login.php`):**
  * Procesa credenciales por POST de forma síncrona o vía AJAX (retornando JSON `{success, error}`).
  * Si las credenciales son válidas, llama a `currentUser()` y redirige a `../index.php`.
  * Si fallan, muestra aviso de error y activa la animación de rechazo en el candado.
  * Muestra mensajes de confirmación tras registro (`?registrado=1`) o cambio de contraseña (`?pass_cambiada=1`).
  * **Ubicación de Notificaciones (`.plate-messages`):** Los avisos (`.plate-alert` y `.plate-success`) se ubican inmediatamente debajo de `[ REGISTRO ] • [ ¿CLAVE PERDIDA? ]` y bajo el marco rectangular del candado (`top: 64.8%`), en un contenedor estilizado de alto contraste que no comprime los campos de entrada ni obstaculiza la cerradura.
  * **Sistema de Brillo Lunar Refinado (`.moon-glow` y `.moon-rays`):** Centrado con exactitud matemática sobre el disco ilustrado del fondo (`top: 18.6%`, `left: 50%`) con tonalidades ámbar y crema cálidas (`#fffceee`, `#fed78c`, `#eab65e`) acordes a la ilustración gótica. Se elimina cualquier factor de escalado o crecimiento geométrico (`scale()`), sustituyéndolo por un efecto de luminiscencia estática con sutil respiración de brillo atmosférico (`filter: brightness()`).

* **Registro (`altaUsuario.php`):**
  * Solicita usuario, clave, email, pregunta y respuesta secreta.
  * Encabezado simplificado institucional: `ARCHIVO ESCOLAR` y subtítulo `Registro de Nuevo Alumno`.
  * Botón de envío de acción única en una sola línea: `[ Registrarse ]`.
  * Fuerza el perfil a `user` y valida el formato del email mediante `FILTER_VALIDATE_EMAIL`.
  * En éxito, redirige a `login.php?registrado=1`.

* **Recuperación de Clave (`cambioPass.php` en 2 Pasos):**
  1. **Paso 1:** Solicita el nombre de usuario y consulta su pregunta secreta (`obtenerPreguntaUsuario()`). Botón conciso en una línea: `[ Consultar ]`.
  2. **Paso 2:** Con la pregunta mostrada, solicita la respuesta secreta y la nueva contraseña. Al validar correctamente, actualiza la clave mediante el botón `[ Actualizar Contraseña ]` y redirige a `login.php?pass_cambiada=1`.

* **Protección de Estancias Interiores:**
  * Todas las vistas interiores del colegio (`index.php`, `pages/recetas.php`, `pages/correo.php`, `pages/juego.php`, `pages/aboutus.php`) incorporan un guardia de sesión al inicio de su ejecución:
    ```php
    if (!obtenerUsuarioActivo()) {
        redirect('login.php'); // o 'pages/login.php' según la profundidad de ruta
    }
    ```
  * Si no existe un usuario activo autenticado en memoria de servidor, se produce una redirección inmediata 302 hacia la cancela de acceso exterior (`login.php`).

---

## 4. Diseño e Interfaz de Soporte (Folio A4 en `app/css/auth.css`)

Tanto el formulario de registro (`altaUsuario.php`) como el de recuperación de credenciales (`cambioPass.php`) implementan la metáfora visual de un expediente escolar institucional en formato A4:

* **Escenario y Fondo:** Utiliza el mismo fondo de pared en ruinas del colegio (`bg_mapa_pared.png`) con viñeteado envolvente en Azul Nocturno (`#1D263B`) y Morado Sombra (`#231733`), manteniendo coherencia espacial directa con el plano central.
* **Folio de Expediente (`.folio-a4-sheet`):**
  * Proporción vertical basada en A4 ($1:1.41$) con sombra arrojada ambiental (`filter: drop-shadow`).
  * Capa de fondo con el asset ilustrado [`folio_expediente_a4.png`](../app/img/auth/folio_expediente_a4.png) (canal alfa transparente en el contorno exterior) y fallback procedural en pergamino (`#D3C6A6`).
  * **Encuadre Seguro dentro del Embellecedor:** Espaciado adaptativo con función `clamp()` (`padding: clamp(4.4rem, 8.5vw, 5.6rem) clamp(2.4rem, 7.5vw, 4.4rem) clamp(3.2rem, 6.5vw, 4.4rem)`), garantizando que rótulos, cajas de entrada y botones permanezcan estrictamente confinados dentro de las líneas y lazos ornamentales del marco gótico en cualquier tamaño de pantalla.
  * **Cabecera Institucional:** Rótulo `ARCHIVO ESCOLAR` posicionado debajo de las vueltas del embellecedor superior con espaciado de seguridad. Título en `Creepster` (Rojo Sangre `#6E2222` con sombra Ámbar Brillo `#DDA95A`) y subtítulo rústico.
* **Campos e Inputs:**
  * Superficie en pergamino claro `rgba(246, 241, 230, 0.94)`, tipografía `Special Elite` en Morado Sombra (`#231733`) y borde inferior de contraste en Rojo Sangre (`#6E2222`).
  * Estados de foco destacados con borde en Rojo Óxido (`#8A2E2E`) y halo ámbar `#DDA95A`.
  * Botones `.folio-btn` fluidos con ancho adaptativo (`width: min(100%, 340px)`) para evitar desbordamientos en terminales móviles.
* **Botones Cuadrados y Enlaces:**
  * Botones de bloque al 100% de ancho en Rojo Sangre (`#6E2222`), bisel Ámbar Luz (`#C68E42`) y texto en Pergamino (`#E0D5B5`).
  * Enlaces de pie de página estilizados para el retorno seguro a la entrada (`login.php`).
