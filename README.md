# ROSCO 4D ANDALUCÍA · IES SIDÓN · V4.4 — VALIDACIÓN REVISADA

## Cambio importante respecto a V4.3

- **Una sola letra (A, B, C… Ñ… Z) nunca cuenta como acierto al escribirla y pulsar «Comprobar».** Se marca como fallo.
- Es necesario introducir la solución **completa** o una alternativa completa indicada en el editor. Se ignoran las alternativas de un solo carácter.
- **En la parte superior de la web se lee «V4.4 · REVISADA»**. Si no ves ese distintivo, estás abriendo una versión anterior.
- El archivo `index.html` contiene ahora todos los scripts, preguntas, estilos y logo. **Para actualizar GitHub Pages basta con sustituir `index.html`**. Esto evita cargar por error un `js/app.js` anterior que pueda seguir en la caché.
- El archivo HTML generado con «Descargar mi rosco para PDI» incluye la misma validación. **Los HTML descargados anteriormente NO se actualizan solos**: se deben generar de nuevo desde esta V4.4.
- Las preguntas personalizadas en el mismo navegador se conservan; las partidas anteriores se reinician para no mezclar marcadores de otras versiones.

## Comprobación rápida en el aula

1. Abre `index.html` y comprueba que aparece el distintivo `V4.4 · REVISADA`.
2. Elige cualquier dificultad y juega.
3. Escribe solo «A» y pulsa «Comprobar». Debe marcar **fallo**, nunca correcto.
4. Repite con «B», con otras letras y con las preguntas del equipo blanco.
5. Usa la respuesta completa para verificar que sí se acepta.

## Instrucciones generales

## Los cuatro niveles

1. **Nivel 1 · ¡Con salero!** — Para entrar en compás.
2. **Nivel 2 · ¡Olé tu arte!** — La cosa se anima.
3. **Nivel 3 · ¡Aquí hay duende!** — Hay que tener tablas.
4. **Nivel 4 · ¡Quillo, qué nivelazo!** — Para auténticas eminencias.

Son las mismas 216 preguntas originales de la V4: 4 dificultades × 2 equipos × 27 letras (incluida Ñ). Solo cambia el nombre de las dificultades.

## Para el profesorado: procedimiento recomendado

1. Descarga y **descomprime** el ZIP original (clic derecho → Extraer todo).
2. Abre `index.html` en Chrome/Edge. No lo ejecutes desde dentro del ZIP.
3. Pulsa **Editor docente**. Selecciona dificultad, equipo y letra; edita la pregunta y pulsa **Guardar esta pregunta**. Puedes elegir «Empieza por» o «Contiene la».
4. Al terminar pulsa el botón verde **«Descargar mi rosco para PDI (.html)»** dentro del editor. Esto descarga un **único HTML autónomo** con tus 216 preguntas, logotipo y estilo incluidos.
5. Comparte o lleva **ese HTML** al aula (USB, unidad de red, correo del centro, Drive, OneDrive, etc.). En la PDI abre el HTML con un navegador. No hace falta conexión para usarlo una vez que se ha descargado.
6. Para modificar el HTML más adelante, ábrelo con el navegador, entra en Editor docente, guarda tus nuevas preguntas y vuelve a descargar tu HTML actualizado.

**Importante:** el botón «Guardar esta pregunta» guarda la modificación en el navegador local, **NO** dentro del ZIP ni de `index.html`. El botón «Descargar mi rosco para PDI» sí crea un nuevo archivo HTML con las preguntas incrustadas. Conserva una copia del HTML en un lugar seguro.

La copia **JSON** es solo una copia de respaldo opcional; también puede importarse desde el editor. No es necesario importarla para jugar con el HTML personalizado.

Puedes abrir `GUIA_DOCENTE.html` para ver **instrucciones ilustradas paso a paso e imprimirlas**, o desde la portada pulsar «Ayuda para docentes». El botón de ayuda de la cabecera sigue explicando las reglas del juego.

## Corrección V4.2 — importante

Se eliminan **todos los atajos globales de una sola letra** (`A`, `F`, `P`, `S`) para impedir que pulsar una tecla fuera de la casilla de respuesta contabilice aciertos o fallos. También se elimina el atajo global de Espacio para evitar activar acciones cuando el foco está en botones de la PDI.

- Tocar una letra de la rueda **solo selecciona la pregunta**, nunca cambia su puntuación.
- En la casilla de respuesta, escribir una letra (por ejemplo `A`) no se considera respuesta correcta a `Alhambra`. La evaluación se realiza solamente con **Comprobar** o **Intro** dentro de la casilla.
- Los botones **Correcto**, **Fallo** y **Pasapalabra** son de control manual por el docente; `Correcto` no comprueba automáticamente lo hablado en voz alta.
- Los HTML portátiles descargados desde esta versión incluyen el mismo arreglo. **Los HTML que se descargaron con la V4.1 mantienen el fallo y deben generarse de nuevo** con la V4.4 si se quieren corregidos.

## Corrección adicional V4.3

Se impide que una respuesta de **una sola letra** («A», «F» o «P») pueda aceptarse como acierto cuando se pulsa «Comprobar»: aparece como **fallo**. La coincidencia se realiza contra la **respuesta completa** o sus alternativas, no contra la inicial de la letra del rosco.

Las teclas A, F y P **no ejecutan ninguna acción** al pulsarlas fuera de la casilla de respuesta: ya no hay atajos de teclado para Correcto, Fallo o Pasapalabra. Al pulsar una letra del rosco con el ratón o con el dedo, **solo se muestra su pregunta** y no hay puntuación.

**Si ya tienes un HTML para PDI descargado de la V4.1, debes volver a generarlo con la V4.3**, porque los HTML anteriores no se actualizan solos.

## Juego y marcador

- «Toda la clase»: 27 preguntas del banco verde o blanco.
- «Duelo»: cada equipo tiene su propia pregunta por letra, su marcador y su recorrido. Ambos comienzan en A. Fallo/Pasapalabra cambia de equipo. Acierto conserva el turno.
- Cronómetro, controles explícitos de corrección, opción de pantalla completa, sonido, respuesta oral/escrita, explicación de cada respuesta, solucionario e impresión.
- Tanto el juego como el HTML personalizado funcionan sin Internet.

## Archivos

`index.html`: portada, juego y editor; `GUIA_DOCENTE.html`: guía de uso e impresión; `GUIA_DOCENTE_PARA_COMPARTIR.pdf`: guía A4 para compartir con el claustro; `solucionario.html`: solucionario del paquete original; `css/styles.css`: diseño; `js/questions.js`: las 216 preguntas de serie; `js/app.js`: motor del rosco; `js/portable-template.js`: generador del archivo HTML portátil; `assets/`: logo y favicon.

## GitHub Pages

Sube los archivos descomprimidos a la **raíz** de tu repositorio existente, manteniendo las carpetas `css`, `js` y `assets`. El botón «Descargar mi rosco para PDI» funciona también cuando editas la web online, pero **tus cambios no se sincronizan a GitHub automáticamente**. Cada docente puede descargar su propio HTML sin modificar la web pública.

IES Sidón · Medina Sidonia (Cádiz) · Día de la Bandera de Andalucía.
