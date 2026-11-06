# Mapa del Sitio (Sitemap) - DAWlloween

Estructura de navegación de la aplicación, desde la cancela exterior de acceso hasta las estancias interiores del colegio.

```mermaid
graph TD
    %% Nivel 0: Exterior
    A[Exterior: Fachada y Candado<br>login.php] -->|Registro| B(Ficha de Ingreso<br>altaUsuario.php)
    A -->|Recuperar Clave| C(Recuperación en 2 Pasos<br>cambioPass.php)
    
    %% Retornos de autenticación
    B -.->|Volver a la Entrada| A
    C -.->|Volver a la Entrada| A

    %% Nivel 1: Hub Central
    A ==>|Credenciales Válidas| D{Interior: Plano del Colegio<br>index.php}

    %% Nivel 2: Dependencias Operativas
    D -->|Plano o Posit| E[Comedor y Cocinas<br>recetas.php]
    D -->|Plano o Posit| F[Despacho de Dirección<br>correo.php]
    D -->|Plano o Posit| G[Sala de Juegos<br>juego.php]
    D -->|Pegatina Sobre mí| H[Expediente Personal<br>aboutus.php / modal]

    %% Dependencias Clausuradas
    D -.->|Clic en zona sellada| I[/Aulas Clausuradas<br>Sonido puerta_clausurada/]

    %% Estilos del diagrama
    classDef exterior fill:#1D263B,stroke:#6E2222,stroke-width:2px,color:#E0D5B5;
    classDef hub fill:#231733,stroke:#DDA95A,stroke-width:3px,color:#E0D5B5;
    classDef interior fill:#3A2346,stroke:#C68E42,stroke-width:2px,color:#E0D5B5;
    classDef clausurado fill:#1A1412,stroke:#8A2E2E,stroke-width:1.5px,stroke-dasharray: 4 4,color:#8A2E2E;

    class A,B,C exterior;
    class D hub;
    class E,F,G,H interior;
    class I clausurado;
```

### Resumen de Rutas

* **Nivel 0 (Autenticación - Acceso Público):**
  * `pages/login.php`: Fachada exterior interactiva con candado y validación de sesiones.
  * `pages/altaUsuario.php`: Registro de nuevo alumno sobre folio A4 de expediente institucional (`folio_expediente_a4.png`).
  * `pages/cambioPass.php`: Flujo en 2 pasos para recuperar la contraseña mediante respuesta secreta sobre folio A4 de expediente.
* **Nivel 1 (Hub Principal - Requiere Sesión):**
  * `index.php`: Plano arquitectónico general con linterna, bombilla de sala, posit de índice y panel de accesibilidad.
* **Nivel 2 (Dependencias Operativas - Requiere Sesión):**
  * `pages/recetas.php`: Comedor escolar con recetario temático de Halloween y lámpara fluorescente.
  * `pages/correo.php`: Despacho de dirección con máquina de escribir analógica y correspondencia exterior vía SMTP ([correo.md](correo.md)).
  * `pages/juego.php`: Sala de juegos recreativa con minijuego 2D (en desarrollo).
  * `pages/aboutus.php`: Expediente y biografía del creador (accesible como modal o vista dedicada).
