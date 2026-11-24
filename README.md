# ROSCO 4D ANDALUCÍA — V5.2 · IES SIDÓN

Esta edición parte de la V5.1 y **elimina íntegramente el lector automático de preguntas**. Conserva el diseño, las 216 preguntas, los cuatro niveles, dos equipos con roscos independientes, cronómetros, comodines, editor, vista previa, Deshacer, repaso de errores, exportación HTML y las dos ayudas docentes.

## Cambios en V5.2

- **Sin lector de voz**: se han eliminado sus controles y el motor de lectura de la web principal y del archivo portable.
- **Modo presentador**: mantiene la pregunta ampliada y el control manual de Correcto, Fallo y Pasapalabra.
- **Avisos de tiempo**: independientes del lector; se pueden activar/desactivar en la portada. Siguen siendo visuales y, si el sonido del juego está activo, reproducen un aviso breve a 30 y 10 segundos.
- **Exportación docente**: el HTML personalizado generado por cada profesor tampoco incluye el lector.

## Para actualizar GitHub Pages

1. Abre el repositorio limpio desde GitHub Desktop, en la rama `main`.
2. Para publicar el cambio sin conflictos, copia **únicamente `index.html`** desde el ZIP `SOLO_CAMBIOS` a la raíz del repositorio.
3. Haz **Commit to main** y después **Push origin**.
4. Abre la web y comprueba que indique **V5.2 · PDI**. Si sigues viendo la antigua, prueba Ctrl+F5.

El archivo `index.html` contiene todo lo necesario: estilos, preguntas, código y la plantilla para descargar un HTML personalizado. No es necesario reemplazar CSS ni JS para publicar esta versión.

## Para el profesorado

- Entra en **Editor docente**, modifica las preguntas, guarda cada una y elige **Descargar mi rosco para PDI**.
- El archivo descargado funciona como HTML independiente en Chrome o Edge, con o sin Internet.
- La sección **Ayuda para docentes** conserva dos procedimientos: desde la web y a partir de un ZIP.
- Para usar el modo presentador, pulsa el botón correspondiente durante el juego. Los avisos de tiempo se controlan en la portada.

## Contenido

- `index.html`: web principal V5.2 autónoma para GitHub Pages.
- `Rosco_4D_V5_2_LISTO_PARA_PDI.html`: juego autónomo con las preguntas originales.
- `js/app.js`, `js/questions.js`, `js/portable-template.js`, `css/styles.css`: fuentes para futuras ediciones, sincronizadas con la web.
- `solucionario.html`: solucionario.
- `GUIA_DOCENTE.html` y guías PDF: procedimientos para editar, guardar y usar el juego.
