// Simulador de usuarios sintéticos sobre el demo real (index.html) con jsdom.
// Uso: node sim.js <ruta index.html> [n=200] [semilla=7]
'use strict';
const fs = require('fs');
const { JSDOM } = require('jsdom');

const file = process.argv[2];
const N = +(process.argv[3] || 200);
let seed = +(process.argv[4] || 7);
const html = fs.readFileSync(file, 'utf8');

// ---------- RNG determinista ----------
function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function gauss() { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function pick(arr, w) { let s = 0; const r = rnd() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < arr.length; i++) { s += w[i]; if (r <= s) return arr[i]; } return arr[arr.length - 1]; }

// ---------- Personas ----------
// literacy: soltura digital; patience: toques máximos; reads: probabilidad de leer la bajada; stress: urgencia (médico)
const PERSONAS = [
  { rol: 'trabajador', peso: 40 },
  { rol: 'medico', peso: 35 },
  { rol: 'gerente', peso: 25 },
];
function persona() {
  const rol = pick(PERSONAS, PERSONAS.map(p => p.peso)).rol;
  const lit = pick(['baja', 'media', 'alta'], rol === 'trabajador' ? [45, 40, 15] : rol === 'medico' ? [20, 50, 30] : [10, 45, 45]);
  return {
    rol, lit,
    sigma: { baja: 1.6, media: 0.9, alta: 0.35 }[lit],
    patience: { baja: 9, media: 13, alta: 18 }[lit],
    reads: { baja: 0.35, media: 0.6, alta: 0.85 }[lit],
    stress: rol === 'medico' ? 0.7 + rnd() * 0.3 : 0.2,
  };
}

// ---------- Tareas ----------
// kw: palabras que atraen al usuario (peso). optimal: toques mínimos medidos a mano en el demo.
// done(doc): predicado de éxito sobre el DOM visible.
const TAREAS = {
  trabajador: [
    { id: 'T1', nombre: 'Entrar y ver la clase que te toca', optimal: 4,
      kw: { trabajador: 3, entrar: 3, 'cédula': 1, clase: 3, clases: 3, seguir: 2, continuar: 2, programas: 1, 'primer respondiente': 2, siguiente: 1 },
      done: d => vis(d, '.lesson') && /Clase 4/.test(txt(d, '.lesson')) },
    { id: 'T2', nombre: 'Terminar las clases, rendir el examen y ver la constancia', optimal: 11,
      kw: { trabajador: 3, entrar: 3, clase: 3, clases: 3, seguir: 2, siguiente: 3, vista: 2, examen: 3, rendir: 3, constancia: 3, 'ver mi constancia': 4, aprobado: 1, programas: 1 },
      done: d => vis(d, '.cert') },
    { id: 'T3', nombre: 'Saber cuándo vence tu habilitación de seguridad', optimal: 2,
      kw: { trabajador: 3, entrar: 3, vence: 4, seguridad: 3, 'inducción': 3, programas: 2, constancias: 1 },
      done: d => vis(d, '#v-trabajador') && /Vence 12-nov-2026/.test(txt(d, '#w-body')) },
  ],
  medico: [
    { id: 'T4', nombre: 'Pedir apoyo del especialista para un trauma grave', optimal: 5,
      kw: { 'médico': 3, terreno: 2, activar: 4, 'línea': 3, trauma: 3, rojo: 3, 'riesgo vital': 2, conectar: 4, especialista: 3, 'caída': 1 },
      done: d => vis(d, '.room') },
    { id: 'T5', nombre: 'Registrar la conducta y cerrar la activación', optimal: 7,
      kw: { 'médico': 3, terreno: 2, activar: 4, 'línea': 3, trauma: 3, rojo: 3, conectar: 4, traslado: 3, conducta: 3, 'clínica': 2, cerrar: 4, entregado: 3, manejo: 1 },
      done: d => /Activación #0147 cerrada/.test(txt(d, '#m-body')) },
  ],
  gerente: [
    { id: 'T6', nombre: 'Ver cuánto demoró en entrar el especialista en la última activación', optimal: 1,
      kw: { gerencia: 4, tablero: 3, activaciones: 2, especialista: 2, tiempo: 2 },
      done: d => vis(d, '#v-gerencia') && d.querySelector('#t-act tbody tr') !== null },
    { id: 'T7', nombre: 'Ver solo lo que pasa en Maturín', optimal: 2,
      kw: { gerencia: 4, tablero: 3, sede: 3, sedes: 3, 'maturín': 5, filtrar: 2 },
      done: d => vis(d, '#v-gerencia') && d.querySelector('#f-sede').value === 'Maturín' },
    { id: 'T8', nombre: 'Saber qué contratista tiene menor cobertura', optimal: 1,
      kw: { gerencia: 4, tablero: 3, contratista: 4, entrenado: 2, cobertura: 2 },
      done: d => vis(d, '#v-gerencia') && d.querySelector('#b-contra .bar-row') !== null },
  ],
};

// ---------- Utilidades DOM ----------
function hiddenAnc(el) { for (let e = el; e; e = e.parentElement) { if (e.hidden || e.hasAttribute('hidden')) return true; } return false; }
function vis(d, sel) { const e = d.querySelector(sel); return !!e && !hiddenAnc(e); }
function txt(d, sel) { const e = d.querySelector(sel); return e ? e.textContent : ''; }
function label(el) { return ((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '') + ' ' + (el.getAttribute('placeholder') || '')).replace(/\s+/g, ' ').trim().toLowerCase(); }
function candidatos(d) {
  const els = Array.from(d.querySelectorAll('button, select, [data-go]'));
  return els.filter(el => !hiddenAnc(el) && !el.disabled && !(el.closest('#sheet') && d.querySelector('#sheet').hidden));
}

// ---------- Modelo de decisión ----------
function score(el, tarea, p, hist) {
  const l = label(el);
  // nadie vuelve a tocar lo que ya está seleccionado (pestaña activa, chip marcado)
  if (el.getAttribute('aria-selected') === 'true') return -9;
  if (el.getAttribute('aria-pressed') === 'true' && !el.closest('#m-mec')) return -9;
  let s = 0;
  for (const k in tarea.kw) if (l.includes(k)) s += tarea.kw[k];
  // leer la bajada: solo quienes "leen" aprovechan textos largos (tarjetas de rol)
  if (l.length > 60 && rnd() > p.reads) s *= 0.5;
  if (el.classList.contains('cur')) s += 2.5; // resaltado visual (borde navy + 'Seguir ›')
  // elementos de la barra superior son pequeños: menos salientes para soltura baja
  if (el.classList.contains('tab')) s *= p.lit === 'baja' ? 0.55 : p.lit === 'media' ? 0.8 : 1;
  // urgencia: el botón grande rojo atrae, textos largos repelen
  if (p.stress > 0.6) { if (el.classList.contains('danger')) s += 2; if (l.length > 80) s *= 0.6; }
  // no repetir lo mismo que acaba de no servir
  const last = hist[hist.length - 1];
  if (last && last.label === l && !last.changed) s -= 3;
  return s + gauss() * p.sigma;
}

function firmaVista(d) {
  const v = ['inicio', 'trabajador', 'medico', 'gerencia', 'caso'].find(n => vis(d, '#v-' + n));
  const body = v === 'trabajador' ? txt(d, '#w-body') : v === 'medico' ? txt(d, '#m-body') : v === 'gerencia' ? (d.querySelector('#f-sede').value + '|' + d.querySelector('#f-dir').value) : '';
  const estados = Array.from(d.querySelectorAll('[aria-pressed="true"]')).filter(e => !hiddenAnc(e)).map(e => e.textContent.trim()).join(',');
  return v + '|' + body.slice(0, 120) + '|' + estados;
}

async function correr(tarea, p) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://demo.local/',
    beforeParse(w) {
      // tiempo acelerado ×100 para no esperar las animaciones de conexión
      const st = w.setTimeout.bind(w), si = w.setInterval.bind(w);
      w.setTimeout = (f, ms, ...a) => st(f, Math.max(1, (ms || 0) / 100), ...a);
      w.setInterval = (f, ms, ...a) => si(f, Math.max(1, (ms || 0) / 100), ...a);
      w.scrollTo = () => {};
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    },
  });
  const d = dom.window.document;
  await new Promise(r => setTimeout(r, 20));
  const hist = []; const vistas = new Set([firmaVista(d)]);
  let taps = 0, ok = false, sinCambio = 0, abandono = null;
  while (taps < p.patience) {
    if (tarea.done(d)) { ok = true; break; }
    const cands = candidatos(d);
    if (!cands.length) { abandono = 'sin opciones'; break; }
    // la gerencia usa <select>: elegir opción relevante si existe
    let scored = cands.map(el => ({ el, s: score(el, tarea, p, hist) })).sort((a, b) => b.s - a.s);
    const opts = cands.filter(el => el.classList.contains('opt'));
    if (opts.length) { const correcta = { 'un compañero': 0, 'la presión directa': 1, 'qué anotas': 1 }; const q = txt(d, '.card h3').toLowerCase(); const ci = Object.keys(correcta).find(k => q.includes(k)); const idx = (rnd() < 0.85 && ci !== undefined) ? correcta[ci] : Math.floor(rnd() * opts.length); scored = [{ el: opts[idx], s: 9 }]; }
    const best = scored[0];
    if (best.s < 0.8) { sinCambio++; if (sinCambio >= 3) { abandono = 'no encontró qué tocar'; break; } taps++; hist.push({ label: '(explora)', changed: false, view: firmaVista(d) }); continue; }
    const antes = firmaVista(d);
    const el = best.el;
    if (el.tagName === 'SELECT') {
      const opt = Array.from(el.options).find(o => label(o).includes('maturín')) || el.options[0];
      el.value = opt.value; el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    } else if (el.form && el.type === 'submit') {
      el.form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    } else {
      el.click();
    }
    taps++;
    await new Promise(r => setTimeout(r, 60)); // deja correr timers acelerados
    const despues = firmaVista(d);
    const changed = antes !== despues;
    vistas.add(despues);
    hist.push({ label: label(el).slice(0, 40), changed, view: despues.split('|')[0] });
    sinCambio = changed ? 0 : sinCambio + 1;
    if (sinCambio >= 3) { abandono = 'tocó 3 veces sin que pasara nada'; break; }
  }
  if (!ok && tarea.done(d)) ok = true;
  if (!ok && !abandono) abandono = 'se le acabó la paciencia';
  dom.window.close();
  const S = tarea.optimal + 1, Nn = vistas.size, R = new Set(hist.map(h => h.view + h.label)).size || 1;
  // lostness (Smith 1996): L = sqrt((N/S - 1)^2 + (R/N - 1)^2), con N = pantallas visitadas, S = mínimas, R = únicas
  const lost = Math.sqrt(Math.pow(Nn / S - 1, 2) + Math.pow(Math.min(R, Nn) / Nn - 1, 2));
  return { tarea: tarea.id, nombre: tarea.nombre, rol: p.rol, lit: p.lit, ok, taps, optimal: tarea.optimal, lost: +lost.toFixed(2), abandono, ruta: hist.map(h => h.label + (h.changed ? '' : '✗')).join(' › ') };
}

(async () => {
  const res = [];
  for (let i = 0; i < N; i++) {
    const p = persona();
    const ts = TAREAS[p.rol];
    const t = ts[Math.floor(rnd() * ts.length)];
    res.push(await correr(t, p));
  }
  fs.writeFileSync(__dirname + '/resultados.json', JSON.stringify(res, null, 1));
  // resumen por tarea
  const by = {};
  for (const r of res) { (by[r.tarea] = by[r.tarea] || []).push(r); }
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const out = [];
  for (const k of Object.keys(by).sort()) {
    const a = by[k]; const oks = a.filter(r => r.ok);
    out.push({ tarea: k, nombre: a[0].nombre, n: a.length, exito: Math.round(oks.length / a.length * 100), optimo: a[0].optimal, toques_mediana: med(oks.map(r => r.taps)), lost_mediana: med(a.map(r => r.lost)),
      exito_baja: pct(a.filter(r => r.lit === 'baja')), exito_media: pct(a.filter(r => r.lit === 'media')), exito_alta: pct(a.filter(r => r.lit === 'alta')),
      abandonos: cuenta(a.filter(r => !r.ok).map(r => r.abandono)) });
  }
  function pct(a) { return a.length ? Math.round(a.filter(r => r.ok).length / a.length * 100) : null; }
  function cuenta(a) { const c = {}; a.forEach(x => c[x] = (c[x] || 0) + 1); return c; }
  // pasos muertos más frecuentes (toques que no cambiaron nada)
  const muertos = {};
  for (const r of res) for (const h of r.ruta.split(' › ')) if (h.endsWith('✗')) muertos[h] = (muertos[h] || 0) + 1;
  const total = { n: res.length, exito: Math.round(res.filter(r => r.ok).length / res.length * 100) };
  fs.writeFileSync(__dirname + '/resumen.json', JSON.stringify({ total, tareas: out, toques_muertos: Object.entries(muertos).sort((a, b) => b[1] - a[1]).slice(0, 12) }, null, 1));
  console.log(JSON.stringify({ total, tareas: out, toques_muertos: Object.entries(muertos).sort((a, b) => b[1] - a[1]).slice(0, 12) }, null, 1));
})();
