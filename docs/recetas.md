# Comedor Escolar y Recetario Temático

Resumen funcional y técnico del módulo de recetas culinarias interactivas de DAWlloween.

---

## 1. Visión General (`app/pages/recetas.php`)

Estancia temática ambientada en el comedor escolar abandonado bajo penumbra:

* **Iluminación Dual:** Cuenta con velo oscuro y haz de linterna (`F`), complementado por una lámpara fluorescente industrial oscilante colgada del techo (halo blanco neutro `#f2efe4`, conmutable mediante clic o tecla `L`).
* **Ficha de Receta Central:** Pergamino rústico quemado (`ficha_receta.png`) con fotografía del plato, tiempo de preparación, ingredientes, modo de elaboración y contador de progreso (`RECETA x / 7`).
* **Navegación:** Flechas góticas laterales (`flecha_navegacion_izquierda.png` y `derecha`) para avanzar o retroceder entre platos.
* **Control de Accesibilidad:** Integra el panel del busca noventero (`.accessibility-pager`) para silenciar audio (`M`), conmutar luces (`L`), linterna (`F`) y retornar al plano central (`Esc`).

---

## 2. Catálogo de Recetas (`app/js/data/recetasData.js`)

El catálogo incluye 7 recetas de repostería y platos temáticos de Halloween:

| ID | Plato | Tiempo | Ingredientes Clave |
| :--- | :--- | :--- | :--- |
| `receta-01` | Dedos de bruja de galleta | 35 min | Masa quebrada, almendras tostadas, confitura de frutos del bosque. |
| `receta-02` | Momias de salchicha y hojaldre | 25 min | Mini salchichas, láminas de hojaldre, mostaza antigua. |
| `receta-03` | Mini pizzas de araña | 20 min | Masa fina, salsa de tomate especiada, mozzarella, aceitunas negras. |
| `receta-04` | Ojos de gelatina sangrientos | 45 min | Gelatina neutra, leche condensada, arándanos, sirope de fresa. |
| `receta-05` | Poción humeante de ponche | 15 min | Zumo de manzana, arándanos, refresco de jengibre, hielo seco. |
| `receta-06` | Fantasmas de plátano y chocolate | 15 min | Plátanos maduros, chocolate blanco, pepitas de chocolate negro. |
| `receta-07` | Bocas de manzana monstruosas | 20 min | Manzanas rojas, mantequilla de cacahuete, nubes mini, fresas. |

---

## 3. Efectos y Sonidos Asociados

* **Hojeo de Recetas:** Emite sonido de papel rústico (`papel_examinar.mp3`) en cada cambio de ficha.
* **Iluminación Fluorescente:** Encendido metálico instantáneo (`lampara_tubo_on.mp3`), apagado mecánico industrial (`lampara_tubo_off.mp3`) y chisporroteo ocasional en penumbra (`lampara_tubo_chisporroteo.mp3`).
* **Retorno al Plano:** Al pulsar el botón de retorno en el busca o la tecla `Esc`, alza la cortina de fundido y reproduce la cadencia completa de pasos de madera (`pasos_madera.mp3`, 1.75s) antes de redirigir a `index.php`.

---

## 4. Controles y Atajos de Teclado

| Acción | Disparador en Pantalla | Teclado |
| :--- | :--- | :--- |
| **Cambiar de receta** | Flechas laterales góticas | `←` / `→` (Flechas de dirección) |
| **Volver al plano escolar** | Pulsador 1º del busca (Icono Plano) | `Esc` |
| **Alternar linterna** | Pulsador 2º del busca (Icono Linterna) | `F` |
| **Conmutar iluminación** | Clic en la lámpara / Pulsador 3º (Icono Bombilla) | `L` |
| **Silenciar sonido** | Pulsador 4º del busca (Icono Altavoz) | `M` |
