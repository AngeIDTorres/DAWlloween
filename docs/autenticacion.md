# Autenticación, Sesiones y Gestión de Usuarios en Servidor

Este documento detalla la arquitectura de backend implementada en PHP para la gestión de usuarios, el almacenamiento en sesiones nativas y la lógica de validación de credenciales del proyecto DAWlloween.

---

## 1. Ciclo de Vida de la Sesión y Matriz Bidimensional

El backend no utiliza bases de datos relacionales en esta fase, sino una persistencia en memoria de servidor a través de sesiones nativas de PHP (`session_start()`).

### Estructura de Datos (`$_SESSION['mimatriz']`)
La variable de sesión `$_SESSION['mimatriz']` almacena una matriz bidimensional (array de arrays asociativos) donde cada registro representa un usuario con los siguientes campos obligatorios:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Usuario` | `string` | Nombre de usuario único para autenticación |
| `Contraseña` | `string` | Clave de acceso del usuario |
| `Email` | `string` | Correo electrónico (utilizado posteriormente en la cabecera `FROM` del correo) |
| `Perfil` | `string` | Rol del usuario (`admin` para el director, `user` para alumnos registrados) |
| `Pregunta` | `string` | Pregunta de seguridad formulada por el usuario al registrarse |
| `Respuesta` | `string` | Respuesta secreta requerida para restablecer la contraseña |
| `UsuarioActual` | `bool` | Indicador booleano que señala si este registro corresponde a la sesión activa |

### Usuario Predefinido
Al inicializarse la sesión por primera vez, `VarGlobales.php` inyecta automáticamente el usuario administrativo:
* **Usuario:** `halloween`
* **Contraseña:** `311026`
* **Email:** `halloween@dawlloween.dev`
* **Perfil:** `admin`
* **Pregunta:** `¿Cuál es tu peor pesadilla?`
* **Respuesta:** `suspenso`
* **UsuarioActual:** `false`

---

## 2. Funciones Centrales (`app/includes/VarGlobales.php`)

El archivo `VarGlobales.php` centraliza las operaciones del modelo de datos:

* `AltaUsuario(array $nuevoUser): bool`:
  Valida que el nombre de usuario no esté repetido en la matriz (insensible a mayúsculas con `strcasecmp`). Si no existe, añade el nuevo elemento al final de la matriz mediante `$_SESSION['mimatriz'][] = $nuevoUser` y retorna `true`.
* `cambioContraseña(string $usuario, string $respuesta, string $nuevaPassword): bool`:
  Busca al usuario por nombre. Si coincide la respuesta secreta (eliminando espacios con `trim`), actualiza el campo `Contraseña` por referencia (`&$user`) y retorna `true`.
* `obtenerPreguntaUsuario(string $usuario): ?string`:
  Busca un usuario en la matriz y retorna el texto de su pregunta de seguridad secreta para mostrarla en el proceso de recuperación de clave, o `null` si no existe.
* `currentUser(string $usuario): ?array`:
  Establece el campo `UsuarioActual` a `true` en el registro correspondiente y a `false` en los demás. Almacena además la copia del usuario en `$_SESSION['usuario_activo']` para acceso directo en cabeceras de correo y vistas.
* `redirect(string $url): void`:
  Emite una cabecera HTTP `Location` y finaliza la ejecución con `exit()` para garantizar que no se procese código posterior tras la redirección.
* `cerrarSesion(): void`:
  Restablece todas las marcas `UsuarioActual` a `false` y limpia la referencia del usuario activo.

---

## 3. Flujo de Formularios (`app/pages/`)

### Acceso (`login.php`)
1. Procesa peticiones mediante método POST contra sí mismo.
2. Compara el usuario y contraseña recibidos contra los registros de `$_SESSION['mimatriz']`.
3. Si coinciden, invoca `currentUser($usuario)` y redirige al mapa principal (`../index.html`).
4. Si fallan o los campos están vacíos, emite un aviso de error sin interrumpir el renderizado del formulario.
5. Incluye enlaces de navegación rápida hacia el alta de alumnos y la recuperación de clave.

### Registro (`altaUsuario.php`)
1. Recoge los campos: `usuario`, `password`, `email`, `pregunta` y `respuesta`.
2. Fuerza el campo `perfil` al valor `user` mediante campo oculto y validación de servidor.
3. Valida el formato del correo mediante `filter_var($email, FILTER_VALIDATE_EMAIL)`.
4. Llama a `AltaUsuario()`. Si el registro es satisfactorio, redirige a `login.php?registrado=1` mostrando un mensaje de confirmación.

### Recuperación de Contraseña (`cambioPass.php`)
1. **Flujo en 2 Pasos (IPO):**
   * **Paso 1:** Solicita el nombre de usuario y ejecuta `obtenerPreguntaUsuario($usuario)`. Si el usuario existe, recupera y muestra en pantalla la pregunta secreta configurada por dicho usuario en su registro.
   * **Paso 2:** Con la pregunta secreta visible, solicita la respuesta y la nueva contraseña.
2. Ejecuta `cambioContraseña()`. Si la respuesta coincide, actualiza la clave en la matriz por referencia y redirige a `login.php?pass_cambiada=1`.
3. Si los datos no coinciden o el usuario no existe, muestra advertencia de error.

