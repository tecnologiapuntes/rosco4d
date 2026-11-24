# ROSCO 4D ANDALUCÍA — V5.1 · IES SIDÓN

Esta entrega parte del repositorio `rosco4d.rar` facilitado por el centro (V5.0) y conserva los 216 enunciados, los cuatro niveles, dos equipos con roscos independientes, editor y exportación HTML, ayudas docentes, vista previa, Deshacer, comodines y repaso de fallos.

## Novedades V5.1

- **Lector de preguntas:** en español, configurable como automático, manual o desactivado. Incluye selección de voz y tres velocidades. No lee soluciones. Detiene el cronómetro mientras pronuncia la pregunta. Depende de la síntesis de voz del navegador y las voces instaladas; sin Internet solo estará disponible si la voz correspondiente es local.
- **Modo presentador:** oculta el rosco circular y agranda la pregunta para la PDI, manteniendo las acciones docentes y el botón para mostrar/ocultar la respuesta en pantalla.
- **Avisos de tiempo:** a los 30 y 10 segundos, por equipo, visuales y con sonido opcional. Pueden desactivarse en la portada.

## Publicación en GitHub Pages

Para evitar conflictos anteriores, **sube SOLO el nuevo `index.html` a la raíz de la rama `main`** de tu repositorio. El `index.html` es autónomo e incorpora estilos, el banco de preguntas, el código y la plantilla exportable. Los archivos de `js/` y `css/` están sincronizados para servir como fuentes editables, pero no son necesarios para publicar.

## Uso en PDI

- Abre `index.html` en Chrome/Edge o publica en GitHub Pages.
- Elige nivel, equipos y tiempo. En «Presentador virtual» configura el lector y avisos.
- Juega. En la parte superior pulsa «Modo presentador» para agrandar la pregunta.
- Edita en «Editor docente», guarda cada pregunta y selecciona «Descargar mi rosco para PDI» para obtener **un solo HTML** con tus cambios y las nuevas funciones.
- Si no se detecta ninguna voz española, se podrá seguir jugando y corregir manualmente. Una PDI sin Internet requiere una voz española local instalada para leer en voz alta.

## Archivos

- `index.html` — web completa autónoma V5.1 para GitHub Pages
- `Rosco_4D_V5_1_LISTO_PARA_PDI.html` — HTML autónomo con preguntas originales
- `css/styles.css`, `js/app.js`, `js/questions.js`, `js/portable-template.js` — fuentes y banco para mantenimiento
- `solucionario.html` — solucionario
- `GUIA_DOCENTE.html` y PDFs — guías para docentes (los PDF explican el flujo de V4.9, que se mantiene)

Nota: el motor Web Speech API no requiere una API de pago, pero la disponibilidad de voces locales depende del sistema operativo. El lector no envía respuestas a un servidor del proyecto.
