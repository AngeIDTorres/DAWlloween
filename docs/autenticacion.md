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
  * Si las credenciales son válidas, llama a `currentUser()` y redirige a `../index.html`.
  * Si fallan, muestra aviso de error y activa la animación de rechazo en el candado.
  * Muestra mensajes de confirmación tras registro (`?registrado=1`) o cambio de contraseña (`?pass_cambiada=1`).

* **Registro (`altaUsuario.php`):**
  * Solicita usuario, clave, email, pregunta y respuesta secreta.
  * Fuerza el perfil a `user` y valida el formato del email mediante `FILTER_VALIDATE_EMAIL`.
  * En éxito, redirige a `login.php?registrado=1`.

* **Recuperación de Clave (`cambioPass.php` en 2 Pasos):**
  1. **Paso 1:** Solicita el nombre de usuario y consulta su pregunta secreta (`obtenerPreguntaUsuario()`).
  2. **Paso 2:** Con la pregunta mostrada, solicita la respuesta secreta y la nueva contraseña. Al validar correctamente, actualiza la clave y redirige a `login.php?pass_cambiada=1`.
