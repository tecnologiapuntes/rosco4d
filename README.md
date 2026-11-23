# ROSCO 4D ANDALUCÍA · IES SIDÓN · V4.5

## Actualización de la validación de respuestas

Se ha comprobado el banco de **216 preguntas (4 niveles × 2 equipos × 27 letras)**, limpiando 10 alternativas que no respetaban «Empieza por» o «Contiene la». La comprobación requiere una coincidencia completa con la solución o con una alternativa válida.

### Respuesta escrita
- Teclear **solo A, B, Q o cualquier otra letra** y pulsar «Comprobar»: **Respuesta incompleta**, 0 puntos y pregunta sin cerrar; se puede escribir la palabra entera.
- Escribir una respuesta completa incorrecta: fallo.
- Escribir la respuesta completa correcta (o alternativa válida): acierto.
- Cuando hay texto en la casilla, el botón manual **Correcto** queda desactivado para evitar aciertos involuntarios. Los botones docentes siguen funcionando con respuestas orales cuando la casilla está vacía.
- En la tarjeta de resultado se indica lo que se escribió o que la evaluación fue manual.

### Actualización de GitHub y PDI
- El archivo `index.html` contiene preguntas, estilos, logo, código y exportador. Para actualizar GitHub, sustituye el `index.html` anterior.
- Debe aparecer **V4.5 · VERIFICADA** en la cabecera; si no aparece, estás usando un archivo anterior.
- Abre la página de nuevo con **Ctrl + F5**; los HTML personalizados descargados antes NO se corrigen solos. Genera el HTML PDI desde esta versión.

### Profesorado
- Se mantienen los niveles «¡Con salero!», «¡Olé tu arte!», «¡Aquí hay duende!» y «¡Quillo, qué nivelazo!».
- Se conservan 27 preguntas distintas para cada uno de los dos equipos en cada nivel, con 216 preguntas totales.
- Para personalizar las preguntas: abre `index.html`, entra en **Editor docente**, cambia letra / equipo / nivel, guarda, pulsa **Descargar mi rosco para PDI** y abre el HTML resultante en el aula.
- El juego funciona también sin Internet en cualquier navegador moderno. En un ordenador compartido, cada docente debería conservar su archivo HTML personal.

### Contenido
La V4.5 se basa en la V4.4 conservando el aspecto visual, el logo IES Sidón, el juego independiente por equipos y la guía. El archivo `js/questions.js` está incluido por transparencia y mantenimiento, pero el navegador ejecuta la versión integrada en `index.html`.
