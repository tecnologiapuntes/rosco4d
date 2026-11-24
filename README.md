# Rosco 4D Andalucía · V4.7 · IES Sidón

Juego estático para PDI, desde el proyecto V4.5. Sin cuentas ni servidor. **216 preguntas**: 27 por equipo × 2 equipos × 4 dificultades.

## NOVEDADES V4.7

- Cronómetro de equipo independiente en duelo; solo consume el equipo activo; se detiene durante la corrección, pausa o al finalizar sus 27 letras. Al agotarse el tiempo, el otro equipo puede seguir usando el suyo.
- Modo PDI de alto contraste visual, controles amplios y preguntas grandes; alterna desde el juego.
- Nombres propios y sorteo opcional del equipo inicial.
- Comodines: una «mijita» (segunda letra) y «¡Échame un cable!» (longitud y última letra), una vez por equipo; la ayuda no puntúa.
- Pantalla de victoria con porcentajes, confeti y diploma imprimible.
- Verificador docente de las 216 preguntas, revisa pista, respuesta, alternativas y duplicados antes de exportar.
- Exportación con nombre personalizado: UN HTML autocontenido que funciona sin conexión en una PDI.
- Respuestas: comparación exacta de la palabra o expresión; una sola letra o respuesta abreviada NO puntúa. Se han retirado las alternativas que solo eran prefijos incompletos de respuestas más largas.

## USO
1. Abre `index.html` en Chrome, Firefox o Edge. También puedes publicarlo en GitHub Pages.
2. Selecciona dificultad, duelo o clase; si hay duelo escribe nombres y sortea el comienzo.
3. Juega en la PDI, pulsa «Modo PDI» para facilitar el uso táctil.
4. En Editor docente, cambia nivel, equipo, letra, pista, solución y explicación; guarda cada pregunta.
5. Pulsa «Verificar las 216 preguntas» y después «Descargar mi rosco para PDI (.html)».
6. Abre el HTML obtenido directamente en la PDI o compártelo con el profesorado. ¡No depende de carpetas ni de Internet!

**Recuerda:** el navegador guarda cambios locales solo en ese navegador, pero el HTML descargado los incorpora. Para usar nuevas ediciones en otra PDI, descarga un nuevo HTML.

La web conserva el solucionario, PDF de ayuda, los cuatro niveles con nombres andaluces y el logo del IES Sidón.


## V4.7 · Identificación visual de turnos

- Equipo **A**, color verde; equipo **B**, color azul. Se conservan los nombres personalizados.
- Al jugar en duelo, una franja visible indica **AHORA JUEGA** y el equipo, con su letra A/B.
- El color del borde de las preguntas, la zona central del rosco y los marcadores identifica al equipo.
- Al fallar, la pantalla de corrección identifica qué equipo acaba de responder y cuál juega después.
- También funciona en el **HTML portátil** exportado desde el editor.
- La guía `GUIA_DOCENTE_EDITAR_DESDE_WEB.pdf` está incluida para compartir con el claustro.

**Compatibilidad:** la clave interna `white` sigue identificando al banco B; no cambia ninguna pregunta, respuesta ni regla de validación.
