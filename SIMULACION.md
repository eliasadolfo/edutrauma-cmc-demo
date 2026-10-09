# Simulación de 200 usuarios sobre el demo (9-oct-2026, versión v2 del campus)

**Qué se hizo.** 200 usuarios sintéticos recorrieron el `index.html` real del demo (motor jsdom, sin navegador),
cada uno con un rol, una tarea y una soltura digital distinta. El usuario modelado ve los botones visibles, elige
el que más se parece a lo que busca (con ruido según su soltura), se cansa tras 9/13/18 toques y abandona si toca
tres veces sin que pase nada. Mezcla: 40 % trabajadores (45 % de soltura baja), 35 % médicos de campo, 25 % gerencia.

**Límite honesto.** Son usuarios modelados, no personas. Sirve para encontrar callejones sin salida, pasos de más
y pantallas con demasiadas opciones. No reemplaza una prueba con 5 personas reales de CMC.

Rerun: `cd sim && npm i jsdom@24.1.0 && node sim.js ../index.html 200 7`

## Resultados por tarea

| Tarea | Éxito | Óptimo (toques) | Mediana real | Perdido (lostness) | Soltura baja / media / alta |
|---|---|---|---|---|---|
| T1 Trabajador: entrar y ver la clase que le toca | 91 % | 4 | 4 | 0,20 | 82 / 100 / 100 |
| T2 Trabajador: terminar clases, examen y constancia | **34 %** | 12 | 12 | 0,17 | **0** / 44 / 57 |
| T3 Trabajador: saber cuándo vence su habilitación | 100 % | 2 | 2 | 0,33 | 100 / 100 / 100 |
| T4 Médico: pedir apoyo para un trauma grave | 97 % | 5 | 5 | 0,17 | 86 / 100 / 100 |
| T5 Médico: registrar conducta y cerrar | 92 % | 7 | 7 | 0,13 | **57** / 100 / 100 |
| T6 Gerencia: ver cuánto demoró el especialista | 100 % | 1 | 1 | — | 100 / 100 / 100 |
| T7 Gerencia: ver solo Maturín | 100 % | 2 | 2 | — | — / 100 / 100 |
| T8 Gerencia: qué contratista tiene menor cobertura | 100 % | 1 | 1 | — | 100 / 100 / 100 |
| **Total** | **86 %** | | | | |

Lostness (Smith, 1996): < 0,4 el usuario no se pierde; > 0,5 está perdido. En tareas de 1 toque la fórmula no aplica.

## Contra el benchmark

| Indicador | Benchmark | Demo | Veredicto |
|---|---|---|---|
| Éxito de tarea promedio | 78 % promedio de la industria (MeasuringU); ≥ 90 % = bueno | 86 % total; 7 de 8 tareas ≥ 91 % | Bien, salvo T2 |
| Éxito con soltura digital baja | el público real de CMC (operadores de plataforma) | T2 0 %, T5 57 % | **Aquí está el problema** |
| Activación de emergencia (patrón Pulsara) | 1 toque para iniciar; nivel elegido y equipo asignado solo; conectado en ≤ 3 toques | 1 toque inicia; conectar exige 3 elecciones (dirección, nivel, mecanismo) = 4 toques en la app real | Un paso de más |
| "Continuar" en un campus (patrón Kajabi / Coursera) | el botón Continuar abre la clase directamente | "Seguir con la clase 4" abre el temario y hay que tocar la clase | Un paso de más |
| Opciones por pantalla (Hick) | 7 ± 2 | Triage del médico: 13 opciones; Inicio: 4 tarjetas + 5 pestañas = 9 | Triage sobrecargado; Inicio duplicado |
| Reintento de examen | se reintenta en el mismo lugar y se muestra qué falló | al fallar vuelve a "las clases" y hay que reentrar al examen (+5 toques) | Fuga de usuarios |
| Tablero de gerencia | 1 a 2 toques por pregunta | 1 a 2 toques, 100 % | Cumple |

## Qué hay que mejorar, en orden

1. **Triage del médico: pedir menos antes de conectar.** Dirección por defecto Trauma (es el programa), nivel en un
   toque, mecanismo y foto después de conectar. De 4 toques a 2. Es lo que hunde a los médicos de soltura baja (T5 57 %).
2. **"Seguir con la clase 4" debe abrir la clase.** Hoy abre el temario y la gente de soltura baja toca clases ya
   vistas (T1 82 %, T2 0 %). El temario queda como vista secundaria ("Ver todas las clases").
3. **Examen: reintento en el lugar y constancia automática.** Si falla, mostrar la respuesta correcta y "Intentar de
   nuevo" sin salir; al aprobar, pasar solo a la constancia. Recorta 5 toques al camino de T2.
4. **Clases vistas en gris, la actual como botón.** En el temario las clases ya vistas pesan igual que la actual; los
   usuarios las reabren. Atenuarlas y poner arriba un botón grande "Continuar: clase 4".
5. **Inicio sin duplicación.** Tarjetas y pestañas dicen lo mismo; los de soltura baja saltan de pestaña en mitad
   de una tarea (rutas pasan por "gerencia", "inicio", "caso maturín"). Dejar un recorrido 1 · 2 · 3 y las pestañas
   solo como migas de dónde estoy.
6. **Botón "Reiniciar demo"** para presentar siempre desde cero (hoy la activación y la constancia quedan guardadas).
7. **El enlace "Qué es real y qué está simulado"** atrae toques en mitad de una tarea; moverlo al pie.

Las tareas de gerencia no necesitan cambios: 100 % con el mínimo de toques.
