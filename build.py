#!/usr/bin/env python3
"""Construye index.html a partir de fuente_sin_logo.html incrustando el logo EduTrauma."""
import base64, re, pathlib
raiz = pathlib.Path(__file__).parent
logo = pathlib.Path.home() / 'Desktop/EduTrauma_Tools/logo-blanco-trim.png'
src = (raiz / 'fuente_sin_logo.html').read_text()
b64 = base64.b64encode(logo.read_bytes()).decode()
body = src.replace('__LOGO__', 'data:image/png;base64,' + b64)
m = re.search(r'<title>.*?</title>\n', body); title = m.group(0); body = body.replace(title, '', 1)
head = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="Demo del Módulo de Conexión de EduTrauma: línea de activación, campus y tablero de gerencia. Datos ficticios.">
<style>[hidden]{display:none!important}html{color-scheme:light}</style>
'''
(raiz / 'index.html').write_text(head + title + '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
# copia para artefacto (sin doctype, con logo)
(raiz / 'sim' / 'artefacto.html').write_text(title + body)
js = re.search(r'<script>(.*)</script>', src, re.S).group(1)
(raiz / 'sim' / 'check.js').write_text(js)
print('index.html', len(body))
