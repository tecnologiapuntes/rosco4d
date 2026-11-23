# ROSCO 4D ANDALUCÍA · IES SIDÓN · V4

Aplicación web para el **4 de diciembre, Día de la Bandera de Andalucía**. Pensada para pizarras digitales interactivas (PDI), ordenadores y pantallas táctiles. No necesita servidor ni internet al abrir los archivos una vez descargados.

**Centro:** IES Sidón · Medina Sidonia (Cádiz). Imagen de cabecera: logo proporcionado para este proyecto.

## Abrir la aplicación

Descomprime el ZIP y abre **`index.html`** con Chrome, Edge o Firefox. El botón «Pantalla completa» y la tecla F11 permiten ocupar toda la PDI. La página **`solucionario.html`** se puede abrir por separado para consulta e impresión.

## Contenido y modalidades

- Cuatro niveles de dificultad: **1.º, 2.º, 3.º y 4.º ESO**.
- **216 preguntas:** 27 letras por equipo × 2 equipos × 4 cursos. Incluye Ñ.
- En cada curso, **equipo verde y equipo blanco tienen 27 preguntas diferentes** (no comparten respuestas correctas).
- **Toda la clase:** puedes escoger el banco verde o blanco, con 27 preguntas.
- **Duelo:** 54 preguntas por partida, dos roscos independientes de 27 letras. Los dos equipos empiezan en A. En acierto se conserva el turno. En fallo o «Pasapalabra» se cede el turno (salvo que el otro equipo ya haya terminado). Cada equipo mantiene sus aciertos, errores, pendientes y su siguiente letra. «Pasapalabra» no marca la letra como error: se retoma en una vuelta posterior.
- Respuesta escrita opcional, con alternativas aceptadas; o juego oral dirigido por el docente, pulsando «Correcto», «Fallo» o «Pasapalabra».
- El botón «Ver solución» muestra la respuesta sin puntuarla. Después de un acierto o fallo se muestra una explicación.
- Cronómetro con varios límites o sin tiempo. El reloj se pausa durante las explicaciones y cuando se abandona temporalmente la pantalla.
- Botones, atajos de teclado, sonidos opcionales, pantalla final, recuperador de partidas.

## Editor docente (8 bancos editables)

1. Desde la portada, pulsa **«Editor docente»**.
2. Selecciona **curso**, **equipo verde o blanco** y **letra**. También puedes pulsar directamente cualquier letra de la cuadrícula, o navegar con «Anterior/Siguiente».
3. Para cada letra elige **«Empieza por…» o «Contiene la…»** (se comprueba automáticamente la coincidencia entre letra y respuesta; la Ñ se trata como letra diferente de la N).
4. Cambia enunciado, respuesta, sinónimos válidos y explicación. La vista previa permite comprobar la pista. Pulsa **«Guardar esta pregunta»**.
5. El editor impide que el equipo contrario tenga **la misma respuesta** en ese curso. También puedes restaurar **una sola letra** o restablecer los ocho roscos originales.
6. **Exportar JSON** descarga los 216 registros, incluidos todos los cambios. **Importar JSON** permite cargarlos en cualquier otro ordenador/PDI. El editor acepta también archivos antiguos de 108 preguntas para usar como equipo verde (manteniendo el blanco).

**Importante:** las ediciones guardadas se conservan solo en el almacenamiento local del navegador y equipo donde se hicieron. Si se publica en GitHub Pages, **no se sincronizan automáticamente** entre ordenadores. Para disponer de las mismas preguntas en todas las PDI, exporta el JSON y usa «Importar banco JSON» en cada una, o actualiza `js/questions.js` en la web publicada.

Al iniciar una partida se copia el banco de ese momento; editar después no modifica una partida que ya esté en curso.

**Compatibilidad con V3:** si existe un banco de preguntas personalizado guardado en la V3, la V4 intenta conservarlo como equipo verde (si es válido y no coincide con el blanco). Las partidas guardadas de la V3 no se pueden continuar en V4 porque cambia la estructura de sus preguntas.

## Solucionario

En `solucionario.html` selecciona el curso y:

- **Ambos equipos:** 54 preguntas y respuestas.
- **Equipo verde:** 27 preguntas.
- **Equipo blanco:** 27 preguntas.

Puedes imprimirlo o guardarlo como PDF desde el navegador. Muestra también los cambios realizados en el editor **en ese mismo navegador**.

## Publicar en GitHub Pages

1. Abre el repositorio GitHub que ya usas para el rosco.
2. Descomprime **`Rosco_4D_Andalucia_V4_SOLO_CAMBIOS.zip`** o **`WEB_COMPLETA.zip`** y sube los archivos **dentro del repositorio**, dejando `index.html` en la raíz.
3. Si GitHub pregunta, reemplaza los archivos anteriores. Asegúrate de subir las carpetas `js`, `css` y `assets`.
4. Si es la primera publicación, ve a **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
5. El enlace normalmente tendrá la forma `https://TUUSUARIO.github.io/rosco-4d-andalucia/`.

## Estructura

```text
index.html                 Juego y editor docente
solucionario.html          Solucionario doble, imprimible
css/styles.css             Diseño responsive para PDI
js/questions.js            216 preguntas originales editables en código
js/app.js                  Motor del rosco y editor
assets/logo-ies-sidon.png  Logo del centro
assets/favicon.svg         Icono
README.md                  Estas instrucciones
```

## Fuentes para trabajar el 4D en el aula

- [Junta de Andalucía · Decreto 541/2022, de 8 de noviembre](https://www.juntadeandalucia.es/boja/2022/217/1).
- [Junta de Andalucía · Símbolos de Andalucía](https://www.juntadeandalucia.es/organismos/transparencia/informacion-institucional-organizativa/simbolos.html).
- [Parlamento de Andalucía · El proceso autonómico](https://www.parlamentodeandalucia.es/web/guest/proceso-autonomico).

**Licencia de uso:** material didáctico para el IES Sidón. El logo pertenece a su titular; no se concede licencia de terceros sobre él.
