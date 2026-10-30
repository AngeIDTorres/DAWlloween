# Etiquetado (Labelling) - DAWlloween

Sistema de nomenclatura e identificadores de la interfaz, diseñados para mantener la coherencia y la inmersión del terror psicológico de los años 90.

| Módulo / Interfaz | Tipo de Elemento | Etiqueta Exacta (Texto en UI) | Descripción / Contexto |
| :--- | :--- | :--- | :--- |
| **Login** | Título Fijo | `Colegio Clausurado` / `Propiedad Privada` | Ambientación inicial en la pantalla de carga o muro. |
| **Login** | Input Text | `Usuario:` | Campo grabado en la placa del candado de hierro. |
| **Login** | Input Password | `Contraseña:` | Campo grabado en la placa del candado de hierro. |
| **Login** | Botón de Acción | `[ Entrar ]` | Intenta abrir el candado (vibra si hay error). |
| **Login** | Botón de Acción | `[ Registrarse ]` | Deriva a `altaUsuario.php`. |
| **Login** | Enlace | `¿Olvidaste la clave?` | Deriva a `cambioPass.php`. |
| **Registro** | Input Text | `Nuevo Usuario:` | Nombre para la matriz de sesión. |
| **Registro** | Input Email | `Correo Electrónico:` | Email de contacto. |
| **Registro** | Input Password | `Contraseña:` | Clave de acceso inicial. |
| **Registro** | Input Text | `Pregunta de Seguridad (Escribe tu propia pregunta):` | Campo libre para recuperar contraseña. |
| **Registro** | Input Text | `Respuesta Secreta:` | Respuesta para el desafío de seguridad. |
| **Registro** | Botón de Acción | `[ Forjar Acceso ]` | Efectúa el guardado (Alta) en la matriz. |
| **Recuperación** | Botón de Acción | `[ Restaurar Candado ]` | Actualiza la contraseña si la respuesta coincide. |
| **Global (Auth)** | Botón Secundario| `[ Volver a la Verja ]` | Retorna al `login.php` desde Registro o Recuperación. |
| **Mapa** | Textos de Zona | `AULAS`, `PASILLOS`, `SÓTANO`, `ZONA DERRUMBADA`, `GIMNASIO`, `COMEDOR` | Pintados con efecto sangre/óxido sobre el plano. |
| **Mapa** | Indicador | `ESTÁS AQUÍ` | Flecha roja indicando la posición del usuario en el plano. |
| **Mapa** | Footer / Pegatina | `Sobre mí` | Pegatina adhesiva amarillenta para acceder al modal del creador. |
| **Cartel MISSING**| Texto Fijo | `MISSING`, `ORDEN JUDICIAL EXP. 1993`, `CLAUSURADO` | Textos impresos y sellos sobre el documento avejentado. |
| **Correo**| Texto Fijo | `Destinatario: Jack Skellington` | A quién se dirige el email a través de la función `mail()`. |
| **Correo**| Placeholder | `Teclea tu mensaje en la máquina...` | Texto orientativo en la hoja en blanco de la máquina. |
| **Correo**| Botón de Acción | `[ Enviar Carta ]` | Dispara el envío SMTP. |