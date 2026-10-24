# Evaluación heurística del demo (23-oct-2026)

Método: las 10 heurísticas de Nielsen según la guía *Cimientos de UX* (Roberto Jirón), en sus 5 pasos.
Alcance: los tres flujos del demo (trabajador, médico en terreno, gerencia). Recorrido dos veces: la primera para
entender, la segunda pantalla por pantalla con el checklist. Severidad 0 a 4 (0 sin problema · 1 cosmético ·
2 menor · 3 mayor · 4 crítico). Todo lo de severidad 2 o más quedó corregido en esta versión.

## Hallazgos y qué se hizo

| # | Heurística | Pantalla | Problema | Sev. | Corrección aplicada |
|---|---|---|---|---|---|
| 1 | 05 Prevención de errores | Médico · activación | Cerrar la activación y fijar la conducta eran un solo toque sin vuelta atrás. En emergencia, un roce cierra el caso. | 4 | Confirmación en el lugar para la conducta ("Confirmar conducta" / "Cambiar") y para el cierre ("Sí, cerrar" / "Todavía no"), con el texto de qué pasa después. |
| 2 | 03 Control y libertad | Médico · activación | Una vez tocado ACTIVAR no había forma de cancelar una falsa alarma ni de volver a la sala desde el cierre. | 3 | "Cancelar · fue una falsa alarma" en los dos primeros pasos, con confirmación; "‹ Volver a la sala" antes de cerrar. |
| 3 | 02 Mundo real + 08 Minimalismo | Médico · triage | Pedía "dirección" (jerga del organigrama) y 13 opciones antes de conectar: 4 direcciones, 2 niveles, 6 mecanismos. | 3 | Se pregunta "¿qué tan grave?" y "¿qué especialista?" con nombres de personas (cirujano de trauma, neurocrítico…). Trauma viene marcado por defecto. El mecanismo pasa a la espera, mientras suena el aviso. De 13 opciones a 6 y de 4 toques a 2 para conectar. |
| 4 | 09 Recuperarse de errores | Trabajador · examen | Al fallar decía "Aún no" y devolvía al temario; no mostraba qué falló ni la respuesta correcta. | 3 | Revisión pregunta por pregunta (marcaste / correcta), "Intentar de nuevo" en el mismo lugar y "Repasar la clase 4". |
| 5 | 07 Eficiencia + 06 Reconocer | Trabajador · inicio | "Seguir con la clase 4" abría el temario, no la clase: un toque de más y la gente reabría clases ya vistas. | 3 | "Continuar · clase 4 de 6" abre la clase. El temario queda como "Ver todas las clases", con las vistas atenuadas y la actual resaltada. |
| 6 | 05 Prevención + 09 Errores | Trabajador · cédula | El campo aceptaba cualquier cosa y "Entrar" siempre estaba activo. | 2 | Validación mientras escribe ("Faltan 2 dígitos. Ejemplo: V-18.456.221"), botón deshabilitado hasta que el formato sea válido. |
| 7 | 03 Control | Trabajador · examen | Al tocar una respuesta avanzaba de inmediato: imposible corregir. | 2 | La respuesta se marca y aparece "Siguiente pregunta"; se puede cambiar antes de seguir. |
| 8 | 01 Visibilidad | Médico · triage | El botón "Conectar" aparecía deshabilitado sin decir por qué. | 2 | Texto bajo el botón: "Marca qué tan grave es para conectar". Hora de inicio visible. |
| 9 | 01 Visibilidad | Médico · sala | Tras elegir la conducta pasaban 0,9 s sin señal. | 2 | El botón cambia a "Avisando a la clínica…" y se bloquea; al terminar, aviso "Clínica receptora avisada". |
| 10 | 04 Consistencia | Trabajador | Volver atrás tenía dos formas: enlace "‹ Clases" y botón "Volver a las clases". | 2 | Una sola forma: enlace "‹ …" arriba a la izquierda en todas las pantallas. |
| 11 | 04 Consistencia + 02 Mundo real | Gerencia y trabajador | La misma cosa se llamaba "habilitación" en gerencia y "constancia" en el campus. "Dirección" en la tabla, "especialista" en el teléfono. | 2 | "Constancia" y "especialidad / especialista" en todas partes. |
| 12 | 07 Eficiencia + 06 Reconocer | Gerencia · filtros | La sede, el filtro que más se usa, estaba escondida en un desplegable. | 2 | Chips de sede a la vista (Todas · Maracaibo · … · Maturín), un toque cada una. |
| 13 | 09 Errores | Gerencia · tabla | Con un filtro sin resultados solo decía "Sin activaciones". | 2 | Estado vacío con explicación y botón "Quitar filtros". |
| 14 | 03 Control | Todo el demo | Lo hecho en una presentación quedaba guardado; no había cómo empezar de cero. | 2 | Botón "Reiniciar demo" en la cinta, con "Deshacer" durante 6 segundos. |
| 15 | 08 Minimalismo | Inicio | Cuatro tarjetas y cinco pestañas decían lo mismo; el enlace "Qué es real" competía con las tareas. | 2 | Las pestañas se numeran como recorrido (1 · 2 · 3) y hacen de "dónde estoy"; el enlace pasó al pie. |
| 16 | 10 Ayuda en contexto | Gerencia · indicadores | "Mediana" sin explicación. | 1 | Bajo el número: "la mitad de las activaciones fue más rápida que esto". |
| 17 | 02 Mundo real | Gerencia | "Exportar CSV". | 1 | "Descargar en Excel", con estado "Preparando…". |
| 18 | 01 Visibilidad | Médico · sala | Anotar una nota vacía no decía nada; una nota guardada tampoco. | 1 | Aviso "Escribe la nota antes de anotar" / "Nota guardada en el registro". |

Sin hallazgos de severidad 2 o más: el flujo de gerencia (100 % de éxito en la simulación, 1 a 2 toques por
pregunta) y el caso de Maturín.

## Antes y después con 200 usuarios simulados (misma semilla)

| Tarea | v2 (9-oct) | v3 (23-oct) | Soltura baja v2 → v3 |
|---|---|---|---|
| T1 Trabajador: entrar y ver su clase | 91 % | **95 %** | 82 → 90 |
| T2 Trabajador: clases + examen + constancia | 34 % | 33 % | 0 → 0 |
| T3 Trabajador: cuándo vence su constancia | 100 % | 100 % | 100 → 100 |
| T4 Médico: pedir apoyo por trauma grave | 97 % | **100 %** | 86 → 100 |
| T5 Médico: registrar conducta y cerrar | 92 % | 86 % | 57 → 56 |
| T6 a T8 Gerencia | 100 % | 100 % | 100 → 100 |
| **Total** | **86 %** | **90 %** | |

Dos lecturas honestas:

- **T2 no mejora y no va a mejorar en una sola sentada.** El camino mínimo son 12 toques (3 clases, 3 preguntas
  con confirmación, constancia) y un usuario de soltura baja se cansa a los 9. No es un defecto de pantalla: es
  una tarea pensada para hacerse en varios turnos. Lo que sí importa, y ahora cumple, es que el avance se guarda y
  "Continuar" retoma exactamente donde quedó.
- **T5 baja de 92 a 86 % a propósito.** Las dos confirmaciones (conducta y cierre) agregan un toque cada una. Es el
  precio de la heurística 05: en una emergencia, cerrar un caso por un roce es peor que un toque más.

Rerun: `cd sim && npm i jsdom@24.1.0 && node sim.js ../index.html 200 7`
