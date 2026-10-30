# Mapa del Sitio (Sitemap) - DAWlloween

A continuación se detalla la arquitectura de navegación inmersiva del colegio, desde el exterior (autenticación) hasta las distintas salas del interior.

```mermaid
graph TD
    %% Nivel 0: Exterior
    A[Exterior: La Verja<br>login.php] -->|Botón Registrarse| B(Formulario Registro<br>altaUsuario.php)
    A -->|Enlace Recuperar| C(Recuperar Clave<br>cambioPass.php)
    
    %% Flujo de Retorno
    B -.->|Volver a la Verja| A
    C -.->|Volver a la Verja| A

    %% Nivel 1: El Hub
    A ==>|Credenciales OK| D{Interior: Mapa del Colegio<br>index.html}

    %% Nivel 2: Salas (Accesos desde el Mapa)
    D -->|Clic en Pegatina Footer| E[Sala del Conserje<br>aboutus.html modal]
    D -->|Clic en Zona Comedor| F[Comedor / Bestiario<br>recetas.html]
    D -->|Clic en Zona Gimnasio| G[Patio Exterior<br>juego.html]
    D -->|Clic en Despacho| H[Despacho del Director<br>correo.php]
    
    %% Estilos del diagrama
    classDef exterior fill:#1D263B,stroke:#4E1414,stroke-width:2px,color:#D3C6A6;
    classDef hub fill:#231733,stroke:#DDA95A,stroke-width:3px,color:#F4EEDF;
    classDef interior fill:#4A4F54,stroke:#33373B,stroke-width:2px,color:#D3C6A6;
    
    class A,B,C exterior;
    class D hub;
    class E,F,G,H interior;