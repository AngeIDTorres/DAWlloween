# Etiquetado (Labelling) - DAWlloween

Catálogo exacto de identificadores, rótulos e indicaciones textuales presentes en la interfaz de usuario, alineados con el código del repositorio.

---

## 1. Entrada y Autenticación

| Vista | Elemento | Texto Exacto en UI | Contexto |
| :--- | :--- | :--- | :--- |
| **Login (`login.php`)** | Título de página | `DAWlloween - Entrada al Colegio` | Pestaña del navegador |
| **Login (`login.php`)** | Input Text | `USUARIO:` | Campo grabado en la chapa del candado |
| **Login (`login.php`)** | Input Password | `CLAVE:` | Campo grabado en la chapa del candado |
| **Login (`login.php`)** | Botón de Envío | Llave antigua (título: `Gira la llave para entrar`) | Accionamiento mecánico en el ojo de la cerradura |
| **Login (`login.php`)** | Enlaces secundarios | `[ REGISTRO ]` • `[ ¿CLAVE PERDIDA? ]` | Accesos directos bajo los campos del candado |
| **Registro (`altaUsuario.php`)** | Títulos | `DAWlloween` / `Ficha de Ingreso` | Cabecera del formulario institucional |
| **Registro (`altaUsuario.php`)** | Etiquetas de formulario | `Nombre de Usuario:`, `Contraseña:`, `Correo Electrónico:`, `Pregunta de Seguridad Secreta:`, `Respuesta Secreta:` | Campos de alta de nuevo usuario |
| **Registro (`altaUsuario.php`)** | Botón principal | `[ Registrar Usuario ]` | Guarda el alumno en `$_SESSION['mimatriz']` |
| **Registro (`altaUsuario.php`)** | Enlace de retorno | `[ Volver a la Entrada ]` | Regreso a `login.php` |
| **Recuperación (`cambioPass.php`)** | Títulos | `DAWlloween` / `Recuperación de Clave` | Cabecera del formulario en 2 pasos |
| **Recuperación - Paso 1** | Campo y Botón | `Introduce tu Nombre de Usuario:` / `[ Consultar Pregunta Secreta ]` | Consulta la pregunta de seguridad |
| **Recuperación - Paso 2** | Campos y Botón | `Tu Respuesta Secreta:`, `Nueva Contraseña:` / `[ Actualizar Contraseña ]` | Valida respuesta y actualiza clave |
| **Recuperación (`cambioPass.php`)** | Enlaces auxiliares | `[ Consultar con otro usuario ]` / `[ Volver a la Entrada ]` | Navegación secundaria |

---

## 2. Plano del Colegio (`index.html`)

| Elemento | Texto Exacto en UI | Contexto |
| :--- | :--- | :--- |
| **Rótulos Generales** | `PASILLO OESTE`, `PASILLO ESTE`, `CLAUSTRO CENTRAL`, `ESTÁS AQUÍ`, `[ ENTRADA PRINCIPAL ]` | Cartografía técnica del plano vectorial |
| **Salas Activas** | `COMEDOR Y COCINAS [ MENÚ HALLOWEEN ]`<br>`DESPACHO DE DIRECCIÓN [ ENVIAR CORREO ]`<br>`SALA DE JUEGOS [ MINIJUEGO ]` | Dependencias interactivas accesibles |
| **Salas Clausuradas** | `AULA DE MÚSICA [ INACCESIBLE ]`<br>`ASEOS [ INACCESIBLE ]`<br>`SALA DE PROFESORES [ INACCESIBLE ]`<br>`LABORATORIO [ INACCESIBLE ]`<br>`GIMNASIO POLIDEPORTIVO [ INACCESIBLE ]` | Zonas precintadas judicialmente con sonido de rechazo |
| **Posit de Índice** | `Índice` (cerrado)<br>`ÍNDICE` (abierto)<br>`• Recetas`, `• Enviar correo`, `• Minijuego` | Menú desplegable en el marco de madera |
| **Pegatina de Expediente** | `EXPEDIENTE` / `Sobre mí` | Etiqueta adhesiva inferior derecha hacia `aboutus.html` |

---

## 3. Expediente del Proyecto (`aboutus.html` y modal)

| Sección | Textos Exactos en UI | Contexto |
| :--- | :--- | :--- |
| **Encabezado** | `MISSING` | Cabecera del cartel de persona desaparecida |
| **Ficha Académica** | `DESARROLLADOR: Ángel D. Torres`<br>`CURSO: 2º DAW`<br>`CENTRO: Atlántida CIDEP III`<br>`PROYECTO: DAWlloween`<br>`ENLACES` (GitHub, LinkedIn) | Bloque superior del cartel |
| **Cuerpo del Legajo** | `EXPEDIENTE · SOBRE EL PROYECTO`<br>`CONTENIDO DE LA PLATAFORMA` | Sección central rayada con descripción del ejercicio temático |

---

## 4. Recetario Temático (`recetas.html`)

| Elemento | Texto en UI | Contexto |
| :--- | :--- | :--- |
| **Metadatos de Ficha** | `TIEMPO: [X] min` | Duración del plato en minutos |
| **Bloques de Contenido** | `Ingredientes:` / `Elaboración:` | Secciones del pergamino de cocina |
| **Contador de Progreso** | `RECETA [X] / 7` | Pie de la ficha de receta |
