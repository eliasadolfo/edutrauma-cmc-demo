# EduTrauma · Módulo de Conexión (demo)

Demo navegable para presentar el Módulo de Conexión a Critical Medicine Care: campus del trabajador,
línea de activación del médico en terreno y tablero de gerencia, con el caso de Maturín reproducible.

- **Datos ficticios.** Solo el flujo, las pantallas y el registro son reales.
- Página única sin dependencias: `index.html` (logo incrustado). `fuente_sin_logo.html` es la misma
  página con el logo como marcador `__LOGO__`, para editar sin arrastrar el base64.
- Deploy = `git push` (GitHub Pages). Dominio: `conexion.edutrauma.net`
  (CNAME `conexion` → `eliasadolfo.github.io` en el DNS de Kajabi).
- Sistema de diseño: tokens de `EduTrauma_Tools/design/edutrauma-ui.css`, un solo tema claro.
