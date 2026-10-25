'use strict';
// Shared engine: physics, maths, speech, sound, story pages, fly-in and input.
// Each level file registers itself in LEVELS; LV is the level being played.
// ---------- constants ----------
const T = 24, COLS = 40, ROWS = 22, W = COLS * T, H = ROWS * T;
const G = 1500, STEP = 1 / 60;
const LEVELS = {};
let LV = null;

const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

// ---------- helpers ----------
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function hash(a, b, c = 0) {
  let h = (a * 374761393 + b * 668265263 + c * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}
function rr(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function circle(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const cx = e => e.x + e.w / 2, cy = e => e.y + e.h / 2;

// ---------- body facts ----------
const seenFacts = new Set();
function fact(key) {
  if (seenFacts.has(key)) return;
  seenFacts.add(key);
  const box = document.getElementById('facts');
  const el = document.createElement('div');
  el.className = 'fact';
  el.innerHTML = '🧠 <b>BODY FACT:</b> ' + LV.facts[key];
  box.appendChild(el);
  while (box.children.length > 2) box.removeChild(box.firstChild);
  setTimeout(() => el.remove(), 12000);
  speak('Body fact! ' + LV.facts[key]);
}

// ---------- read aloud ----------
let readAloud = true, voice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  voice = vs.find(v => /en-GB/.test(v.lang) && /natural|google|serena|kate|daniel|libby|sonia/i.test(v.name)) ||
    vs.find(v => /en-GB/.test(v.lang)) || vs.find(v => /natural|google|samantha/i.test(v.name)) || vs[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
// Turn game HTML into something a speech voice reads naturally.
function speechText(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  el.querySelectorAll('.pron, .pic, .nospeak').forEach(n => n.remove());
  el.querySelectorAll('p, li, div, br, h1, h2').forEach(n => n.after('. '));
  return el.textContent
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}]/gu, '')
    .replace(/ \? /g, ' what number ').replace(/^\? /, 'what number ').replace(/\?(?= [×+])/g, 'what number')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ').replace(/→/g, ', ').replace(/…/g, ', and so on').replace(/·/g, ',')
    .replace(/([.!?:])(\s*\.)+/g, '$1').replace(/(\.\s*){2,}/g, '. ').replace(/\s+/g, ' ').trim();
}
// Lines recorded with tools/voice (voice/<key>.m4a, listed in voice/index.js) play as clips;
// anything else, like maths questions, uses the browser voice. Both share one queue.
const voiceKey = text => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
};
const recorded = window.VOICE_LINES || new Set();
let sayQ = [], sayNow = null, clip = null, sayTimer = 0;
function sayNext() {
  clearTimeout(sayTimer);
  const item = sayNow = sayQ.shift() || null;
  if (!item) return;
  let finished = false;
  const done = () => {
    if (finished || sayNow !== item) return;
    finished = true; clearTimeout(sayTimer);
    if (item.onend) item.onend();
    sayNext();
  };
  // Chrome sometimes never fires onend for long speech, so don't let the queue get stuck.
  sayTimer = setTimeout(done, 4000 + item.text.length * 110);
  if (item.src) {
    let fellBack = false;
    const fallBack = () => { if (!fellBack && sayNow === item) { fellBack = true; ttsSay(item.text, done); } };
    clip = new Audio(item.src);
    clip.onended = done; clip.onerror = fallBack;
    clip.play().catch(fallBack);
  } else ttsSay(item.text, done);
}
function ttsSay(text, done) {
  if (!('speechSynthesis' in window)) return done();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.rate = .92; u.pitch = 1.05;
  u.onend = done; u.onerror = done;
  speechSynthesis.speak(u);
}
function speak(html, interrupt = false) {
  if (!readAloud) return;
  const text = speechText(html), key = voiceKey(text), has = recorded.has(key);
  if (!text || (!has && !('speechSynthesis' in window))) return;
  if (interrupt) hush();
  const item = { text, src: has ? `voice/${key}.m4a` : null, onend: null };
  sayQ.push(item);
  if (!sayNow) sayNext();
  return item;
}
function hush() {
  sayQ = []; sayNow = null; clearTimeout(sayTimer);
  if (clip) { clip.onended = clip.onerror = null; clip.pause(); clip = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

// ---------- body words ----------
const GLOSS = {
  stomach: ['', 'A stretchy bag in your belly. It squishes food and mixes it with acid.'],
  acid: ['', 'A strong liquid that breaks things down. Stomach acid helps digest food.'],
  digest: ['', 'To break food down into tiny bits your body can use.'],
  mucus: ['MYOO-kus', 'Thick slime, a bit like snot. It coats the stomach so the acid can\'t burn it.'],
  germ: ['', 'A tiny living thing that can make you ill. Far too small to see without a microscope.'],
  bacteria: ['bak-TEER-ee-uh', 'One kind of germ. Each one is just a single tiny cell.'],
  'H. pylori': ['aitch pie-LOR-ee', 'A corkscrew-shaped bacterium that lives in stomachs and can cause ulcers.'],
  ulcer: ['UL-ser', 'A sore in the stomach wall, where the acid has burned through.'],
  cell: ['', 'The tiny building blocks your body is made of. You have trillions of them!'],
  'blood vessel': ['', 'A tube that carries blood around your body.'],
  vein: ['VAYN', 'A blood vessel that carries blood back to your heart.'],
  valve: ['', 'A little door inside a vein. It only lets blood flow one way.'],
  nerve: ['', 'A body wire that carries messages between your brain and the rest of you.'],
  'red blood cell': ['', 'A cell that carries oxygen around your body. Millions of them make blood red.'],
  oxygen: ['OK-si-jen', 'The part of the air your body needs to live. You breathe it in.'],
  'white blood cell': ['', 'A germ-fighting cell. White blood cells are your body\'s army.'],
  macrophage: ['MAK-roh-fayj', 'A big white blood cell that swallows germs whole. The name means "big eater".'],
  platelet: ['PLAYT-let', 'A tiny piece of a cell in your blood. Platelets stick together to plug leaks.'],
  clot: ['', 'A sticky plug made of platelets and stringy fibrin that stops bleeding. A scab is a dried clot!'],
  fibrin: ['FY-brin', 'A stringy protein that weaves a net over a platelet plug to make it strong.'],
  organ: ['', 'A body part with a special job, like your heart, lungs or stomach.'],
  oesophagus: ['ee-SOF-uh-gus', 'The food pipe. A muscly tube that squeezes food down from your mouth to your stomach.'],
  liver: ['', 'A big organ next to your stomach. It cleans your blood and helps digest fat.'],
  'immune system': ['ih-MYOON', 'All the parts of your body that fight germs.'],
};
const glossHTML = k => `<b>${k[0].toUpperCase() + k.slice(1)}</b>${GLOSS[k][0] ? ` <span class="pron">(say "${GLOSS[k][0]}")</span>` : ''}: ${GLOSS[k][1]}`;
function sayWord(k) {
  const tip = document.getElementById('wordTip');
  if (tip) tip.innerHTML = glossHTML(k);
  speak(`${k}. ${GLOSS[k][1]}`, true);
}
// A tappable glossary word for story text.
const Wd = (k, label = k) => `<span class="w" data-w="${k}">${label}</span>`;

// ---------- sound ----------
let actx = null, noiseBuf = null, muted = false;
function ensureAudio() {
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (actx.state === 'suspended') actx.resume();
  } catch (e) { actx = null; }
}
function tone(f, dur, type = 'sine', vol = .12, to = null, delay = 0) {
  const t0 = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + .02);
}
function hiss(dur, vol, freq, delay = 0) {
  const t0 = actx.currentTime + delay, s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
  s.buffer = noiseBuf; f.type = 'lowpass'; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  s.connect(f).connect(g).connect(actx.destination); s.start(t0); s.stop(t0 + dur + .02);
}
// A wobbly synth fart. size 0 is a tiny squeak, 1 is a trumpet blast.
function fart(size) {
  const t0 = actx.currentTime, dur = .15 + size * .85;
  const o = actx.createOscillator(), lfo = actx.createOscillator(), lg = actx.createGain();
  const f = actx.createBiquadFilter(), g = actx.createGain();
  const base = 170 - size * 110 + Math.random() * 25;
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(base, t0);
  o.frequency.linearRampToValueAtTime(base * (.55 + Math.random() * .5), t0 + dur);
  lfo.frequency.value = 14 + Math.random() * 26; lg.gain.value = base * .3;
  lfo.connect(lg).connect(o.frequency);
  f.type = 'lowpass'; f.frequency.value = 420 + size * 600; f.Q.value = 5;
  g.gain.setValueAtTime(.001, t0); g.gain.linearRampToValueAtTime(.16 + size * .1, t0 + .03);
  g.gain.setValueAtTime(.14 + size * .1, t0 + dur * .75); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  o.connect(f).connect(g).connect(actx.destination);
  o.start(t0); lfo.start(t0); o.stop(t0 + dur + .05); lfo.stop(t0 + dur + .05);
  hiss(dur * .8, .03 + size * .05, 350);
}
// Recorded CC0 sound effects (sfx/, credits in sfx/CREDITS.md). Plain Audio elements work even
// when the game is opened straight from a file. If a file can't play, the synth version is used.
const SAMPLES = {
  fart_s: ['fart_s1', 'fart_s2'], fart_m: ['fart_m1', 'fart_m2'], fart_l: ['fart_l1', 'fart_l2'],
  burp: ['burp'], plop: ['plop'], sploosh: ['sploosh'], squelch: ['squelch'], flush: ['flush'], gulp: ['gulp'],
};
const badSample = new Set();
function playSample(name) {
  const file = pick(SAMPLES[name]);
  if (badSample.has(file)) return false;
  const a = new Audio(`sfx/${file}.m4a`);
  a.volume = .85;
  a.onerror = () => badSample.add(file);
  a.play().catch(() => badSample.add(file));
  return true;
}
function sfx(name, arg) {
  if (muted || !actx) return;
  if (name === 'fart') {
    const size = arg ?? Math.random();
    if (playSample(size < .35 ? 'fart_s' : size < .7 ? 'fart_m' : 'fart_l')) return;
  } else if (SAMPLES[name] && playSample(name)) return;
  switch (name) {
    case 'jump': tone(220, .15, 'square', .05, 520); break;
    case 'gulp': tone(320, .35, 'sine', .25, 60); hiss(.3, .15, 600); break;
    case 'squelch': hiss(.25, .2, 900); tone(140, .2, 'sine', .1, 70); break;
    case 'splat': hiss(.4, .3, 1500); tone(90, .3, 'sawtooth', .06, 40); break;
    case 'right': tone(660, .12, 'triangle', .15); tone(990, .2, 'triangle', .15, null, .1); break;
    case 'wrong': tone(160, .35, 'sawtooth', .08, 110); break;
    case 'build': for (let i = 0; i < 4; i++) { tone(120, .12, 'sine', .2, 70, i * .1); hiss(.1, .12, 500, i * .1); } break;
    case 'zap': tone(1200, .4, 'sawtooth', .06, 80); hiss(.3, .1, 4000); break;
    case 'saved': tone(523, .1, 'sine', .12); tone(784, .15, 'sine', .12, null, .08); break;
    case 'bloop': tone(400, .12, 'sine', .12, 200); break;
    case 'switch': tone(300, .08, 'square', .05); break;
    case 'win': [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'triangle', .14, null, i * .15)); break;
    case 'lose': [400, 300, 200].forEach((f, i) => tone(f, .35, 'sawtooth', .07, null, i * .2)); break;
    case 'fart': fart(arg ?? Math.random()); break;
    case 'burp': tone(120, .55, 'sawtooth', .1, 70); tone(62, .55, 'square', .05, 48); hiss(.4, .08, 300); break;
    case 'plop': tone(700, .15, 'sine', .22, 120); hiss(.35, .2, 1800, .08); break;
    case 'sploosh': hiss(.5, .3, 700); tone(220, .35, 'sine', .14, 60); break;
    case 'rumble': tone(55, 1.6, 'sawtooth', .07, 38); hiss(1.4, .1, 160); break;
    case 'flush': hiss(2.8, .28, 900); hiss(2.5, .12, 3000, .3); tone(70, 2.5, 'sine', .12, 40); break;
    case 'slime': hiss(.3, .15, 1200); tone(500, .25, 'sine', .08, 180); break;
    case 'push': tone(90, .15, 'square', .06, 60); hiss(.15, .1, 400); break;
    case 'cheer': [784, 988, 1175].forEach((f, i) => tone(f, .14, 'triangle', .1, null, i * .07)); break;
  }
}

// ---------- level grid ----------
let grid, ceilTiles = [];
function solidAt(c, r) {
  if (c < 0 || c >= COLS || r < 0) return true;
  if (r >= ROWS) return false;
  return LV.solid(grid[r][c]);
}
function rectHits(x, y, w, h) {
  const x0 = Math.floor(x / T), x1 = Math.floor((x + w - .001) / T);
  const y0 = Math.floor(y / T), y1 = Math.floor((y + h - .001) / T);
  for (let r = y0; r <= y1; r++) for (let c = x0; c <= x1; c++) if (solidAt(c, r)) return true;
  return false;
}
function moveEntity(e, dt, canStep) {
  e.hitWall = false;
  const nx = e.x + e.vx * dt;
  if (rectHits(nx, e.y, e.w, e.h)) {
    let stepped = false;
    if (canStep && e.onGround) {
      for (let s = 1; s <= T + 1; s++) if (!rectHits(nx, e.y - s, e.w, e.h)) { e.y -= s; e.x = nx; stepped = true; break; }
    }
    if (!stepped) {
      if (e.vx > 0) e.x = Math.floor((nx + e.w) / T) * T - e.w - .01;
      else if (e.vx < 0) e.x = (Math.floor(nx / T) + 1) * T + .01;
      e.hitWall = true;
    }
  } else e.x = nx;
  e.vy = Math.min(e.vy + G * dt, 900);
  const ny = e.y + e.vy * dt;
  e.onGround = false;
  if (rectHits(e.x, ny, e.w, e.h)) {
    if (e.vy > 0) { e.y = Math.floor((ny + e.h) / T) * T - e.h - .01; e.onGround = true; }
    else e.y = (Math.floor(ny / T) + 1) * T + .01;
    e.vy = 0;
  } else e.y = ny;
}
const groundAhead = e => solidAt(Math.floor((e.vx > 0 ? e.x + e.w + 1 : e.x - 1) / T), Math.floor((e.y + e.h + 2) / T));

// ---------- state ----------
let heroes, germs, walkers, parts, floats, active, released, spawned, spawnT, saved, lost;
let gameTime, anim = 0, paused = true, ended = false, hint, hintT;
let started = false;

function makeHero(id, name, col, w, h, speed, jumpV, power, row = 18) {
  const x = col * T + (T - w) / 2, y = row * T - h - .01;
  return { id, name, x, spawnX: x, y, spawnY: y, w, h, vx: 0, vy: 0, onGround: true,
    facing: 1, speed, jumpV, power, walkT: 0, knockT: 0, knockVx: 0, inExit: false, eatT: 0, eaten: 0 };
}
function makeGerm(col, row) {
  const g = { x: col * T, y: (row + 1) * T - 12 - .01, w: 24, h: 12, vx: 0, vy: 0, dir: Math.random() < .5 ? -1 : 1,
    speed: 22 + Math.random() * 10, home: col * T, range: 1.6 * T, state: 'alive', t: 0, phase: Math.random() * 9, onGround: true };
  return g;
}
function resetLevel() {
  walkers = []; parts = []; floats = [];
  active = 0; released = false; spawned = 0; spawnT = 0; saved = 0; lost = 0;
  gameTime = 0; ended = false; hint = ''; hintT = 0;
  LV.reset();
  document.getElementById('facts').innerHTML = '';
  renderTerrain();
}
const bgCanvas = document.createElement('canvas'); bgCanvas.width = W; bgCanvas.height = H;
const terrCanvas = document.createElement('canvas'); terrCanvas.width = W; terrCanvas.height = H;
function renderBackground() { LV.renderBackground(bgCanvas.getContext('2d')); }
function renderTerrain() {
  const c = terrCanvas.getContext('2d');
  c.clearRect(0, 0, W, H);
  ceilTiles = [];
  LV.renderTerrain(c);
}

// ---------- maths ----------
let mathLevel = 2, streak = 0, misses = 0;
try { mathLevel = clamp(+localStorage.getItem('zvg-brain') || 2, 1, 5); } catch (e) {}
function saveBrain() { try { localStorage.setItem('zvg-brain', mathLevel); } catch (e) {} }
const P = (kind, x, y, q, a) => ({ kind, x, y, q, a });
function makeProblem() {
  const L = mathLevel, kinds = [];
  if (L === 1) kinds.push('add10', 'sub20');
  if (L === 2) kinds.push('add30', 'sub30', 'miss20');
  if (L === 3) kinds.push('add100', 'sub100', 'miss20', 'times2510');
  if (L === 4) kinds.push('add2d', 'sub2d', 'times2510', 'timesEasy', 'divEasy');
  if (L === 5) kinds.push('times', 'div', 'missTimes', 'double', 'add2d');
  let a, b;
  switch (pick(kinds)) {
    case 'add10': a = rnd(1, 10); b = rnd(1, 10); return P('add', a, b, `${a} + ${b}`, a + b);
    case 'sub20': a = rnd(6, 20); b = rnd(1, a - 1); return P('sub', a, b, `${a} − ${b}`, a - b);
    case 'add30': a = rnd(5, 20); b = rnd(3, 10); return P('add', a, b, `${a} + ${b}`, a + b);
    case 'sub30': a = rnd(12, 30); b = rnd(3, 11); return P('sub', a, b, `${a} − ${b}`, a - b);
    case 'miss20': a = rnd(3, 12); b = rnd(2, 9); return P('miss', a, a + b, `${a} + ? = ${a + b}`, b);
    case 'add100': a = rnd(2, 8) * 10 + rnd(0, 9); b = pick([rnd(2, 9), rnd(1, 3) * 10]); return P('add', a, b, `${a} + ${b}`, a + b);
    case 'sub100': a = rnd(30, 99); b = pick([rnd(2, 9), rnd(1, 2) * 10]); return P('sub', a, b, `${a} − ${b}`, a - b);
    case 'times2510': a = pick([2, 5, 10]); b = rnd(1, 6); return P('times', b, a, `${b} × ${a}`, a * b);
    case 'timesEasy': a = pick([2, 3, 4, 5, 10]); b = rnd(2, 6); return P('times', b, a, `${b} × ${a}`, a * b);
    case 'divEasy': b = pick([2, 5, 10]); a = rnd(2, 6); return P('div', a * b, b, `${a * b} ÷ ${b}`, a);
    case 'add2d': a = rnd(15, 59); b = rnd(12, 39); return P('add', a, b, `${a} + ${b}`, a + b);
    case 'sub2d': a = rnd(50, 99); b = rnd(12, a - 10); return P('sub', a, b, `${a} − ${b}`, a - b);
    case 'times': a = rnd(2, 10); b = rnd(2, 10); return P('times', a, b, `${a} × ${b}`, a * b);
    case 'missTimes': a = rnd(2, 8); b = pick([2, 3, 4, 5, 10]); return P('missTimes', b, a * b, `? × ${b} = ${a * b}`, a);
    case 'div': a = rnd(2, 10); b = rnd(2, 6); return P('div', a * b, b, `${a * b} ÷ ${b}`, a);
    case 'double': a = rnd(11, 49); return P('double', a, a, `double ${a}`, a * 2);
  }
}

// Step-by-step help for a problem. With reveal=false it teaches the method but leaves the last step to the player.
const D = (n, cls = '') => `<i class="d ${cls}"></i>`.repeat(n);
const upTo = (start, step, n) => Array.from({ length: n }, (_, i) => start + step * (i + 1));
function countLine(list, reveal) {
  return `<p class="count">${reveal ? list.join(', ') : list.slice(0, -1).join(', ') + (list.length > 1 ? ', …' : '…')}</p>`;
}
function groupsPic(groups, each) {
  return groups * each <= 60 ? `<div class="pic">${Array.from({ length: groups }, () => `<span class="grp">${D(each)}</span>`).join('')}</div>` : '';
}
function explain(p, reveal) {
  const A = reveal ? `<b class="ans">${p.a}</b>` : '<b>?</b>';
  const { x, y } = p;
  switch (p.kind) {
    case 'add': {
      if (y <= 10 && x + y <= 30) {
        const big = Math.max(x, y), small = Math.min(x, y);
        return `<p>The <b>+</b> sign means <b>add</b>: put them together.</p>
          <p>Start at the bigger number, <b>${big}</b>, and count on <b>${small}</b> more:</p>
          <div class="pic">${D(big)}<span class="op">+</span>${D(small, 'g')}</div>
          <p>${big} → </p>${countLine(upTo(big, 1, small), reveal)}<p>So ${x} + ${y} = ${A}</p>`;
      }
      const tx = x - x % 10, ox = x % 10, ty = y - y % 10, oy = y % 10;
      return `<p>Big numbers? Split them into <b>tens</b> and <b>ones</b>.</p>
        <p class="steps">${x} = ${tx} + ${ox}<br>${y} = ${ty} + ${oy}</p>
        <p>Add the tens: <span class="steps">${tx} + ${ty} = ${tx + ty}</span></p>
        <p>Add the ones: <span class="steps">${ox} + ${oy} = ${ox + oy}</span></p>
        <p>Put them together: <span class="steps">${tx + ty} + ${ox + oy} = ${A}</span></p>`;
    }
    case 'sub': {
      if (x <= 20) return `<p>The <b>−</b> sign means <b>take away</b>.</p>
        <p>Start with <b>${x}</b>. Cross out <b>${y}</b>. Count what's left!</p>
        <div class="pic">${D(x - y)}${D(y, 'x')}</div><p>So ${x} − ${y} = ${A}</p>`;
      const ty = y - y % 10, oy = y % 10;
      if (!ty) return `<p>The <b>−</b> sign means <b>take away</b>. Count back <b>${y}</b> from <b>${x}</b>:</p>
        <p>${x} → </p>${countLine(upTo(x, -1, y), reveal)}<p>So ${x} − ${y} = ${A}</p>`;
      if (!oy) return `<p>Taking away tens? Only the <b>tens</b> digit changes.</p>
        <p>${x} has ${Math.floor(x / 10)} tens. Take away ${ty / 10} tens:</p>
        <p class="steps">${x} − ${y} = ${A}</p>`;
      return `<p>The <b>−</b> sign means <b>take away</b>. Take away the <b>tens</b> first, then the <b>ones</b>.</p>
        <p class="steps">${y} = ${ty} + ${oy}</p>
        <p>Tens first: <span class="steps">${x} − ${ty} = ${x - ty}</span></p>
        <p>Then the ones: <span class="steps">${x - ty} − ${oy} = ${A}</span></p>`;
    }
    case 'miss':
      return `<p>What do you add to <b>${x}</b> to make <b>${y}</b>?</p>
        <p>Start at ${x} and count up to ${y}. Count how many jumps!</p>
        <div class="pic">${D(x)}<span class="op">+</span>${D(y - x, 'o')}</div>
        <p>${x} → </p><p class="count">${upTo(x, 1, y - x).join(', ')}</p>
        <p>${reveal ? `That's ${A} jumps.` : 'How many jumps was that?'}</p>`;
    case 'times': {
      const tip = y === 10 ? 'Times 10 trick: just put a <b>0</b> on the end!'
        : y === 2 ? 'Times 2 is the same as <b>doubling</b>.'
        : y === 5 ? 'Counting in 5s goes 5, 10, 15, 20… like the minutes on a clock!'
        : x < y ? `Trick: ${x} × ${y} is the same as ${y} × ${x}. Swap them if that's easier!` : '';
      return `<p>The <b>×</b> sign means <b>groups of</b>.</p>
        <p><b>${x} × ${y}</b> means <b>${x} groups of ${y}</b>. How many altogether?</p>
        ${groupsPic(x, y)}
        <p>Count in ${y}s, one jump for each group:</p>${countLine(upTo(0, y, x), reveal)}
        <p>So ${x} × ${y} = ${A}</p>${tip ? `<p class="tipbox">${tip}</p>` : ''}`;
    }
    case 'missTimes':
      return `<p><b>? × ${x} = ${y}</b> asks: <b>how many groups of ${x}</b> make ${y}?</p>
        <p>Count in ${x}s until you reach ${y}, and count the jumps:</p>
        ${groupsPic(p.a, x)}<p class="count">${upTo(0, x, p.a).join(', ')}</p>
        <p>${reveal ? `That's ${A} jumps, so ${A} groups.` : 'How many jumps was that?'}</p>`;
    case 'div':
      return `<p>The <b>÷</b> sign means <b>sharing out equally</b>.</p>
        <p><b>${x} ÷ ${y}</b>: share ${x} into <b>${y} equal groups</b>. How many in each group?</p>
        ${groupsPic(y, p.a)}
        <p class="tipbox">Trick: dividing is the opposite of times! Ask: <b>${y} × what = ${x}</b>? Count in ${y}s until you reach ${x}:</p>
        <p class="count">${upTo(0, y, p.a).join(', ')}</p>
        <p>${reveal ? `That's ${A} jumps, so ${x} ÷ ${y} = ${A}` : 'Count the jumps. That\'s your answer!'}</p>`;
    case 'double': {
      const t = x - x % 10, o = x % 10;
      return `<p><b>Double</b> means add it to itself: <b>${x} + ${x}</b>.</p>
        <p>Split it into tens and ones: <span class="steps">${x} = ${t} + ${o}</span></p>
        <p>Double the tens: <span class="steps">${t} + ${t} = ${t * 2}</span></p>
        <p>Double the ones: <span class="steps">${o} + ${o} = ${o * 2}</span></p>
        <p>Put them together: <span class="steps">${t * 2} + ${o * 2} = ${A}</span></p>`;
    }
  }
}

const PRAISE = ['Correct!', 'Brilliant!', 'Yes! Power up!', 'Spot on!'];
let mathCtx = null;
const mathEl = document.getElementById('math');
const helpEl = document.getElementById('mathHelp');
const questionText = p => (p.q.includes('?') ? p.q : p.q + ' = ?');
const questionSpeech = p => (p.q.includes('?') ? p.q : 'What is ' + p.q + '?');
function openMath(who, onRight, onWrong) {
  const p = makeProblem();
  mathCtx = { p, typed: '', onRight, onWrong, locked: false };
  document.getElementById('mathWho').textContent = who;
  document.getElementById('mathQ').textContent = questionText(p);
  document.getElementById('mathA').textContent = '';
  document.getElementById('mathMsg').textContent = '';
  document.getElementById('mathStars').textContent = 'Brain power: ' + '★'.repeat(mathLevel) + '☆'.repeat(5 - mathLevel);
  document.getElementById('btnGotIt').hidden = true;
  document.getElementById('btnHelp').hidden = false;
  helpEl.classList.remove('show'); helpEl.innerHTML = '';
  mathEl.classList.add('show');
  paused = true;
  speak(questionSpeech(p), true);
}
function showHelp() {
  if (!mathCtx || mathCtx.locked) return;
  helpEl.innerHTML = explain(mathCtx.p, false);
  helpEl.classList.add('show');
  speak(helpEl.innerHTML, true);
}
function mathKey(k) {
  if (!mathCtx) return;
  if (mathCtx.wrong && k === 'ok') return closeMath(mathCtx.onWrong);
  if (mathCtx.locked) return;
  if (k === 'del') mathCtx.typed = mathCtx.typed.slice(0, -1);
  else if (k === 'ok') return submitMath();
  else if (mathCtx.typed.length < 4) mathCtx.typed += k;
  document.getElementById('mathA').textContent = mathCtx.typed;
}
function submitMath() {
  if (!mathCtx.typed) return;
  const m = mathCtx, msg = document.getElementById('mathMsg');
  m.locked = true;
  if (parseInt(m.typed, 10) === m.p.a) {
    const praise = pick(PRAISE);
    msg.style.color = '#c7e04f'; msg.textContent = praise;
    sfx('right'); speak(praise, true); streak++; misses = 0;
    if (streak >= (mathLevel < 3 ? 3 : 4) && mathLevel < 5) { mathLevel++; streak = 0; saveBrain(); }
    setTimeout(() => closeMath(m.onRight), 900);
  } else {
    msg.style.color = '#ff9a9a'; msg.textContent = `Not quite! The answer is ${m.p.a}. Here's how:`;
    sfx('wrong'); streak = 0; misses++;
    if (misses >= 2 && mathLevel > 1) { mathLevel--; misses = 0; saveBrain(); }
    helpEl.innerHTML = explain(m.p, true);
    helpEl.classList.add('show');
    m.wrong = true;
    document.getElementById('btnGotIt').hidden = false;
    document.getElementById('btnHelp').hidden = true;
    speak(`Not quite! The answer is ${m.p.a}. Here's how. ` + helpEl.innerHTML, true);
  }
}
function closeMath(after) {
  mathEl.classList.remove('show');
  mathCtx = null; paused = false; hush();
  if (after) after();
}
(function buildPad() {
  const pad = document.getElementById('pad');
  ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'del', '0', 'ok'].forEach(k => {
    const b = document.createElement('button');
    b.textContent = k === 'del' ? '⌫' : k === 'ok' ? '✔' : k;
    if (k === 'del') b.className = 'del';
    if (k === 'ok') b.className = 'ok';
    b.onclick = () => mathKey(k);
    pad.appendChild(b);
  });
})();

// ---------- powers ----------
function say(e, text, color = '#fff') { floats.push({ x: cx(e), y: e.y - 8, text, color, life: 1.8 }); }
function usePower() {
  const h = heroes[active];
  if (h.inExit) return;
  LV.usePower(h);
}
function nearestGerm(h, range = 46, state = 'alive') {
  let best = null, bd = range;
  for (const g of germs) {
    if (g.state !== state) continue;
    const d = Math.hypot(cx(g) - cx(h), cy(g) - cy(h));
    if (d < bd) { bd = d; best = g; }
  }
  return best;
}
// Gap cells just ahead of a hero's feet, for building a bridge across.
function gapCells(h, isGap) {
  const row = Math.floor((h.y + h.h + 2) / T), cells = [];
  if (h.onGround && row < ROWS) {
    let c = Math.floor(cx(h) / T) + h.facing;
    for (let i = 0; i < 7 && cells.length < 4; i++, c += h.facing) {
      if (c <= 0 || c >= COLS - 1) break;
      if (isGap(grid[row][c])) cells.push(c);
      else if (cells.length) break;
    }
  }
  return { row, cells };
}
function fillCells(row, cells, type, color) {
  for (const c of cells) {
    grid[row][c] = type;
    for (let i = 0; i < 6; i++) goo(c * T + 12, row * T + 12, color);
    const tile = { x: c * T, y: row * T, w: T, h: T };
    for (const e of [...heroes, ...walkers, ...germs]) if (overlap(e, tile)) e.y = row * T - e.h - .01;
  }
  renderTerrain();
}

// ---------- particles ----------
function goo(x, y, color, n = 1) {
  for (let i = 0; i < n; i++)
    parts.push({ x, y, vx: (Math.random() - .5) * 160, vy: -Math.random() * 160, life: .7 + Math.random() * .5, max: 1.2,
      color, size: 2 + Math.random() * 3, grav: 500 });
}

// ---------- update ----------
const keys = {};
let jumpQ = false, powerQ = false;
function update(dt) {
  gameTime += dt;
  LV.update(dt);
}
// Move the heroes; the active one follows the keys. pre(h) runs just before each move, after(h) just after.
function updateHeroes(dt, after, pre) {
  heroes.forEach((h, i) => {
    if (h.knockT > 0) { h.knockT -= dt; h.vx = h.knockVx; }
    else if (i === active) {
      const d = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      h.vx = d * h.speed;
      if (d) h.facing = d;
      if (jumpQ && h.onGround) { h.vy = -h.jumpV; sfx('jump'); }
    } else h.vx = 0;
    if (pre) pre(h, i);
    moveEntity(h, dt, true);
    if (h.onGround && h.vx) h.walkT += dt; else h.walkT = 0;
    if (h.eatT > 0) h.eatT -= dt;
    h.inExit = overlap({ x: cx(h) - 1, y: cy(h) - 1, w: 2, h: 2 }, LV.exit);
    if (after) after(h, i);
  });
  jumpQ = false;
  if (powerQ) { powerQ = false; usePower(); }
}
// Germs patrol, bump heroes away, and get sucked into Gobbler when eaten. special(g, dt) handles any other state.
function updateGerms(dt, special) {
  const gob = heroes.find(h => h.id === 'gob');
  germs = germs.filter(g => {
    g.phase += dt;
    if (g.state === 'eaten') {
      g.t += dt;
      g.x += (cx(gob) - cx(g)) * Math.min(1, dt * 7);
      g.y += (cy(gob) - cy(g)) * Math.min(1, dt * 7);
      if (Math.random() < .3) goo(cx(g), cy(g), '#9bb33c');
      return g.t < .6;
    }
    if (g.state !== 'alive') return special ? special(g, dt) : true;
    g.vx = g.dir * g.speed;
    moveEntity(g, dt, false);
    if (g.hitWall || (g.onGround && !groundAhead(g))) g.dir *= -1;
    if (g.x < g.home - g.range) g.dir = 1;
    if (g.x > g.home + g.range) g.dir = -1;
    for (const h of heroes) {
      if (!overlap(g, h) || h.knockT > 0) continue;
      if (h.id === 'gob') { g.dir = cx(g) < cx(h) ? -1 : 1; continue; }
      h.knockT = .35; h.knockVx = (cx(h) < cx(g) ? -1 : 1) * 150; h.vy = -220;
      sfx('squelch'); say(h, 'Ew, slimy!', '#d7ef6a');
    }
    return g.y < H;
  });
}
// The walkers (the cells you rescue) come out one at a time once released.
function spawnWalkers(dt, total, gap, make) {
  if (!released || spawned >= total) return;
  spawnT -= dt;
  if (spawnT <= 0) { walkers.push(make()); spawned++; spawnT = gap; sfx('bloop'); }
}
// Lemmings-style walking: keep going, turn at walls, and turn back at any hero in the way.
function walkStep(r, dt, speed) {
  r.vx = r.onGround || r.floating ? r.dir * speed : 0;
  moveEntity(r, dt, true);
  if (r.hitWall) r.dir *= -1;
  for (const h of heroes) {
    if (h.inExit) continue;
    const hb = { x: h.x - 2, y: h.y, w: h.w + 4, h: h.h };
    if (overlap(r, hb) && (cx(h) - cx(r)) * r.dir > 0) r.dir *= -1;
  }
}
function updateParticles(dt, killY = H) {
  for (const p of parts) {
    p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if (p.drip && (p.y > killY || solidAt(Math.floor(p.x / T), Math.floor(p.y / T)))) p.life = 0;
  }
  parts = parts.filter(p => p.life > 0);
  for (const f of floats) { f.y -= 22 * dt; f.life -= dt; }
  floats = floats.filter(f => f.life > 0);
}

// ---------- end screens ----------
const endEl = document.getElementById('end');
function showEnd(title, text, award) {
  ended = true; paused = true;
  document.getElementById('facts').innerHTML = '';
  document.getElementById('endTitle').textContent = title;
  document.getElementById('endText').innerHTML = text;
  const codeEl = document.getElementById('endCode'), hasNext = !!(award && LEVELS[LV.num + 1]);
  codeEl.hidden = !award;
  document.getElementById('btnNextLevel').hidden = !hasNext;
  if (award) {
    codeEl.innerHTML = `Your secret code for the next level:<b>${award}</b>` +
      `<span class="tip">${hasNext ? 'Write it down! Type it on the title screen to jump straight there.'
        : `Level ${LV.num + 1} is still being built. Keep the code safe for when it's ready!`}</span>`;
    setTimeout(() => speak(`Your secret code is ${award.split('').join(', ')}. ${award}!`), 400);
  }
  const list = document.getElementById('endList');
  list.innerHTML = '';
  if (seenFacts.size) {
    list.style.display = '';
    list.innerHTML = '<b>Body facts you collected (' + seenFacts.size + ' of ' + Object.keys(LV.facts).length + '):</b>' +
      [...seenFacts].map(k => '<li>' + LV.facts[k] + '</li>').join('');
  } else list.style.display = 'none';
  endEl.classList.add('show');
}
function fail(reason) {
  if (ended) return;
  sfx('lose');
  showEnd('BLEURGH!', reason);
  document.getElementById('btnAgain').textContent = 'Try again';
}

// ---------- drawing: shared characters ----------
function drawZaal(c, x, by, f, t, walking) {
  c.save(); c.translate(x, by); c.scale(f, 1);
  const s = walking ? Math.sin(t * 16) : 0, bob = walking ? Math.abs(s) * -1.2 : 0;
  c.fillStyle = '#d4d9e0'; c.fillRect(-5 + s * 2, -9, 4, 8); c.fillRect(1 - s * 2, -9, 4, 8);
  c.fillStyle = '#e06a22'; rr(c, -6 + s * 2, -3, 6, 3, 1); c.fill(); rr(c, 0 - s * 2, -3, 6, 3, 1); c.fill();
  c.fillStyle = '#e06a22'; rr(c, -10, -21 + bob, 5, 11, 2); c.fill();                // oxygen tank
  c.fillStyle = '#eef1f4'; rr(c, -7, -21 + bob, 14, 13, 4); c.fill();
  c.fillStyle = '#e06a22'; c.fillRect(-7, -16 + bob, 14, 2);
  c.fillStyle = '#2b9fd6'; circle(c, 3, -12 + bob, 1.5);
  c.fillStyle = '#c98e62'; circle(c, 1, -27 + bob, 5.3);                             // face
  c.fillStyle = '#24160f'; c.beginPath(); c.arc(1, -28 + bob, 5.6, Math.PI * 1.05, Math.PI * 2.05); c.fill();
  c.fillRect(-4.5, -29 + bob, 3, 3);
  c.fillStyle = '#fff'; circle(c, 3.6, -26.5 + bob, 1.5); circle(c, .2, -26.5 + bob, 1.5);
  c.fillStyle = '#1a0d08'; circle(c, 4, -26.4 + bob, .8); circle(c, .6, -26.4 + bob, .8);
  c.strokeStyle = '#6b2e1c'; c.lineWidth = .8; c.beginPath(); c.arc(2, -24.6 + bob, 1.6, .2, Math.PI - .2); c.stroke();
  c.fillStyle = 'rgba(170,225,255,.22)'; circle(c, 1, -27 + bob, 8.5);                 // helmet
  c.strokeStyle = 'rgba(230,248,255,.85)'; c.lineWidth = 1.2; c.beginPath(); c.arc(1, -27 + bob, 8.5, 0, 7); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(1, -27 + bob, 6.5, Math.PI * 1.1, Math.PI * 1.45); c.stroke();
  c.strokeStyle = '#bbb'; c.lineWidth = 1; c.beginPath(); c.moveTo(-3, -35 + bob); c.lineTo(-5, -39 + bob); c.stroke();
  c.fillStyle = Math.sin(t * 5) > 0 ? '#ff4040' : '#801010'; circle(c, -5, -39.5 + bob, 1.6);
  c.restore();
}
function drawGobbler(c, x, by, f, t, eat, eaten) {
  c.save(); c.translate(x, by - 14); c.scale(f, 1);
  const n = 18; c.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2;
    let r = 15 + Math.sin(t * 3 + i * 1.7) * 1.4;
    if (i % 6 === 2) r += 3 + Math.sin(t * 2.2 + i) * 2.5;      // wobbly pseudopods
    let px = Math.cos(a) * r * 1.08, py = Math.sin(a) * r;
    if (py > 13) py = 13 + (py - 13) * .2;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  const g = c.createRadialGradient(-4, -6, 2, 0, 0, 19);
  g.addColorStop(0, 'rgba(240,225,245,.95)'); g.addColorStop(1, 'rgba(175,140,195,.9)');
  c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(105,60,125,.95)'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = 'rgba(105,50,140,.75)';
  c.beginPath(); c.ellipse(-5, 3, 6.5, 4.2, -.4, 0, 7); c.fill();
  c.beginPath(); c.ellipse(-8, -1, 3.5, 3, .3, 0, 7); c.fill();
  for (let i = 0; i < Math.min(eaten, 6) + 3; i++) {
    c.fillStyle = i < 3 ? 'rgba(150,90,160,.6)' : 'rgba(140,170,50,.75)';
    circle(c, -8 + hash(i, 3) * 12, 4 + hash(i, 4) * 6 - 4, 1.4);
  }
  c.fillStyle = '#fff'; circle(c, 4, -6, 4); circle(c, 11, -5, 3.4);
  c.fillStyle = '#2a0b30'; circle(c, 5.5, -5.5, 1.9); circle(c, 12, -4.6, 1.6);
  if (eat > 0) {
    const o = Math.sin(eat / .7 * Math.PI);
    c.fillStyle = '#3a0c22'; c.beginPath(); c.ellipse(10, 4, 4 + o * 3, 1 + o * 6, 0, 0, 7); c.fill();
  } else {
    c.strokeStyle = '#4a1840'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(6, 4); c.quadraticCurveTo(10, 7, 14, 3); c.stroke();
  }
  c.restore();
}

// ---------- drawing: shared frame pieces ----------
// drawOther(c, h, x, by, walking) draws the level's own third hero.
function drawHeroes(c, drawOther) {
  heroes.forEach((h, i) => {
    const x = cx(h), by = h.y + h.h + (h.sink || 0), walking = h.walkT > 0;
    if (i === active && !ended) {
      c.fillStyle = 'rgba(255,240,150,.18)'; c.beginPath(); c.ellipse(x, by, h.w * .9, 4, 0, 0, 7); c.fill();
    }
    if (h.id === 'zaal') drawZaal(c, x, by, h.facing, anim, walking);
    else if (h.id === 'gob') drawGobbler(c, x, by, h.facing, anim, h.eatT, h.eaten);
    else drawOther(c, h, x, by, walking);
    if (i === active && !ended) {
      const ay = h.y - (h.id === 'zaal' ? 20 : 12) + Math.sin(anim * 6) * 3;
      c.fillStyle = '#ffe36b'; c.beginPath(); c.moveTo(x - 6, ay - 8); c.lineTo(x + 6, ay - 8); c.lineTo(x, ay); c.fill();
    }
  });
}
function drawParts(c) {
  for (const p of parts) { c.globalAlpha = clamp(p.life / p.max * 1.5, 0, 1); c.fillStyle = p.color; circle(c, p.x, p.y, p.size); }
  c.globalAlpha = 1;
}
function drawFloats(c) {
  c.textAlign = 'center'; c.font = 'bold 12px Trebuchet MS';
  for (const f of floats) {
    c.globalAlpha = clamp(f.life, 0, 1); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillText(f.text, f.x + 1, f.y + 1);
    c.fillStyle = f.color; c.fillText(f.text, f.x, f.y);
  }
  c.globalAlpha = 1;
}
// Top bar: hero tabs and the rescue tally. Leaves textBaseline 'middle' so the level can add its own text on the right.
function hudTop(c, label, done, gone, word = 'saved') {
  const { total, need } = LV.escort;
  c.fillStyle = 'rgba(12,2,4,.72)'; c.fillRect(0, 0, W, 24);
  c.font = 'bold 12px Trebuchet MS'; c.textAlign = 'left'; c.textBaseline = 'middle';
  heroes.forEach((h, i) => {
    const x = 6 + i * 104;
    c.fillStyle = i === active ? '#ffe36b' : 'rgba(255,255,255,.12)'; rr(c, x, 3, 98, 18, 5); c.fill();
    c.fillStyle = i === active ? '#2b070c' : '#f3e6d8';
    c.fillText(`${i + 1} ${h.name}${h.inExit ? ' ✓' : ''}`, x + 8, 12.5);
  });
  c.fillStyle = '#f3e6d8'; c.fillText(label, 330, 12.5);
  const x0 = 330 + c.measureText(label).width + 12;
  for (let i = 0; i < total; i++) {
    const x = x0 + i * 15;
    if (i < done) { c.fillStyle = LV.escort.color; circle(c, x, 12, 5.5); c.fillStyle = '#7dff7d'; c.fillText('✓', x - 3.5, 12.5); }
    else if (i < done + gone) { c.fillStyle = '#555'; circle(c, x, 12, 5.5); c.fillStyle = '#ccc'; c.fillText('×', x - 3, 12); }
    else { c.strokeStyle = i < need ? '#ff8a8a' : '#a05050'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, 12, 5, 0, 7); c.stroke(); }
  }
  c.fillStyle = '#f3e6d8'; c.fillText(`${word} ${done} · need ${need}`, x0 + total * 15 + 6, 12.5);
}
function hudBottom(c) {
  c.fillStyle = 'rgba(12,2,4,.72)'; c.fillRect(0, H - 22, W, 22);
  c.textAlign = 'left'; c.fillStyle = '#ffe36b'; c.textBaseline = 'middle';
  const h = heroes[active];
  c.fillText(`${h.name}: ${h.power}`, 8, H - 11);
  c.fillStyle = '#e8c9c0'; c.fillText(hint, 300, H - 11);
  c.textBaseline = 'alphabetic';
}
function render() { LV.render(ctx); }

// ---------- loop ----------
let last = performance.now(), acc = 0;
function frame(now) {
  const d = Math.min(.1, (now - last) / 1000); last = now;
  anim += d;
  if (!paused && !ended) { acc += d; while (acc >= STEP && !paused && !ended) { update(STEP); acc -= STEP; } }
  else acc = 0;
  render();
  requestAnimationFrame(frame);
}

// ---------- story ----------
function portrait(draw) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); g.scale(1.4, 1.4); g.translate(-9, -14); draw(g);
  return c.toDataURL();
}
const IMG = {
  zaal: portrait(c => drawZaal(c, 32, 56, 1, 0, false)),
  gob: portrait(c => drawGobbler(c, 32, 50, 1, 0, 0, 0)),
};
let page = 0;
const storyBody = document.getElementById('storyBody');
function showPage(n, read) {
  const story = LV.story;
  page = clamp(n, 0, story.length - 1);
  storyBody.innerHTML = story[page];
  document.getElementById('wordTip').innerHTML = '';
  document.getElementById('storyDots').textContent = story.map((_, i) => (i === page ? '●' : '○')).join('');
  document.getElementById('btnBack').style.visibility = page ? 'visible' : 'hidden';
  document.getElementById('btnNext').textContent = page === story.length - 1 ? 'Start!' : 'Next ▶';
  if (read) speak(story[page], true); else hush();
}
function startGame() {
  ensureAudio(); hush();
  document.getElementById('intro').classList.remove('show');
  started = true; paused = false;
  LV.onStart();
}
document.getElementById('btnNext').onclick = () => (page === LV.story.length - 1 ? startGame() : showPage(page + 1, true));
document.getElementById('btnBack').onclick = () => showPage(page - 1, true);
document.getElementById('btnReadPage').onclick = () => { ensureAudio(); speak(LV.story[page], true); };
document.getElementById('stage').addEventListener('click', e => {
  const w = e.target.closest('.w');
  if (w && GLOSS[w.dataset.w]) sayWord(w.dataset.w);
});

// ---------- fly-in: from outside the body to where the level happens ----------
// Body drawing space is 400 x 800 units; the person faces us, so their left is our right.
const BODY_FIT = 528 * .92 / 800;
const ORGANS = {
  brain: [200, 56], heart: [218, 296], lungs: [150, 282], liver: [166, 352], stomach: [246, 368],
  intestines: [200, 448], oesophagus: [203, 250],
  'small intestine': [212, 446], 'large intestine': [150, 440], appendix: [146, 496], rectum: [202, 520],
};
// Each level lists its own steps. A route step moves the camera and ship over the body;
// a scene step ({ text, dur, draw(c, t) }) paints its own picture instead.
const flyEl = document.getElementById('fly'), flyC = document.getElementById('flyCvs').getContext('2d');
const flyCap = document.getElementById('flyCap');
const fly = { k: -1, t: 0, cam: { x: 200, y: 420, z: 1 }, from: null, spoke: true, wait: 0, trail: [], ship: [430, 130], on: true,
  steps: [], done: null };
const TWEEN = 2.6;
const ease = t => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
function alongPath(pts, u) {
  const segs = []; let total = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); total += l; }
  let d = u * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const f = segs[i] ? Math.min(1, d / segs[i]) : 1;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
}
function flyGo(k) {
  if (k >= fly.steps.length) return flyEnd();
  fly.k = k; fly.t = 0; fly.from = { ...fly.cam };
  const r = fly.steps[k];
  flyCap.innerHTML = r.text;
  fly.spoke = false;
  fly.wait = 2 + speechText(r.text).length * .06;     // reading time when there is no voice
  const u = speak(r.text, true);
  fly.voiced = !!u;
  if (u) u.onend = () => { fly.spoke = true; };
  if (r.onShow) r.onShow();
}
function flyEnd() {
  fly.on = false; hush();
  flyEl.classList.remove('show');
  const done = fly.done; fly.done = null;
  if (done) done();
}
function flyStart(steps, done) {
  fly.steps = steps; fly.done = done; fly.trail = []; fly.on = true;
  document.getElementById('flyTitle').hidden = true;
  document.getElementById('flyBtns').hidden = false;
  flyEl.classList.add('show');
  runFlyLoop();
  flyGo(0);
}
document.getElementById('btnJourney').onclick = () => {
  ensureAudio();
  flyStart(LV.fly, () => { document.getElementById('intro').classList.add('show'); showPage(0, true); });
};
document.getElementById('btnFlyNext').onclick = () => flyGo(fly.k + 1);
document.getElementById('btnFlySkip').onclick = flyEnd;

function drawBody(c, z) {
  const skin = c.createLinearGradient(80, 0, 320, 0);
  skin.addColorStop(0, 'rgba(230,170,140,.18)'); skin.addColorStop(.5, 'rgba(240,190,160,.32)'); skin.addColorStop(1, 'rgba(230,170,140,.18)');
  c.fillStyle = skin; c.strokeStyle = 'rgba(255,215,190,.75)'; c.lineWidth = 2.5 / z; c.lineJoin = 'round';
  c.beginPath();                                                   // one outline: head, arms, torso, legs
  c.ellipse(200, 88, 60, 74, 0, 0, Math.PI * 2);
  c.moveTo(176, 156); c.lineTo(176, 196);
  c.bezierCurveTo(130, 198, 98, 205, 92, 236); c.lineTo(58, 470); c.quadraticCurveTo(52, 505, 70, 508);
  c.quadraticCurveTo(84, 505, 86, 476); c.lineTo(116, 300); c.lineTo(122, 470); c.lineTo(132, 790);
  c.quadraticCurveTo(148, 800, 182, 792); c.lineTo(196, 540); c.lineTo(204, 540); c.lineTo(218, 792);
  c.quadraticCurveTo(252, 800, 268, 790); c.lineTo(278, 470); c.lineTo(284, 300); c.lineTo(314, 476);
  c.quadraticCurveTo(316, 505, 330, 508); c.quadraticCurveTo(348, 505, 342, 470); c.lineTo(308, 236);
  c.bezierCurveTo(302, 205, 270, 198, 224, 196); c.lineTo(224, 156);
  c.fill(); c.stroke();
  c.strokeStyle = 'rgba(255,240,230,.13)'; c.lineWidth = 6 / Math.sqrt(z);  // ribs
  for (let i = 0; i < 6; i++) { const y = 228 + i * 19;
    c.beginPath(); c.moveTo(196, y); c.quadraticCurveTo(140, y + 4, 128, y + 26); c.moveTo(204, y); c.quadraticCurveTo(260, y + 4, 272, y + 26); c.stroke(); }
  c.fillStyle = 'rgba(255,240,230,.12)'; c.fillRect(196, 210, 8, 150);
  // brain
  c.fillStyle = '#e8a6b4'; c.beginPath(); c.ellipse(200, 56, 44, 28, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = 'rgba(150,60,90,.6)'; c.lineWidth = 1.6 / Math.sqrt(z);
  for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(162 + i * 12, 38 + (i % 2) * 6); c.quadraticCurveTo(170 + i * 12, 58, 160 + i * 12, 76); c.stroke(); }
  c.beginPath(); c.moveTo(200, 30); c.lineTo(200, 83); c.stroke();
  // face
  c.fillStyle = 'rgba(40,20,20,.7)'; circle(c, 178, 100, 5); circle(c, 222, 100, 5);
  c.fillStyle = '#5a1a20'; c.beginPath(); c.ellipse(200, 130, 13, 6, 0, 0, Math.PI * 2); c.fill();
  // lungs and heart
  c.fillStyle = 'rgba(232,150,165,.85)';
  c.beginPath(); c.ellipse(152, 284, 34, 62, .08, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(250, 284, 32, 60, -.08, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#c0222e'; c.beginPath(); c.moveTo(216, 322);
  c.bezierCurveTo(186, 300, 196, 272, 212, 280); c.bezierCurveTo(228, 268, 246, 290, 216, 322); c.fill();
  // liver
  c.fillStyle = '#8a3626'; c.beginPath(); c.ellipse(168, 352, 54, 26, .18, 0, Math.PI * 2); c.fill();
  // oesophagus
  c.strokeStyle = '#c96a72'; c.lineWidth = 11; c.lineCap = 'round';
  c.beginPath(); c.moveTo(200, 140); c.lineTo(201, 200); c.quadraticCurveTo(204, 280, 206, 330); c.stroke();
  c.strokeStyle = 'rgba(120,30,40,.5)'; c.lineWidth = 1.2 / Math.sqrt(z);
  for (let y = 150; y < 326; y += 8) { c.beginPath(); c.moveTo(195, y); c.lineTo(211, y + 1); c.stroke(); }
  // stomach (J-shape)
  c.fillStyle = '#d4747c'; c.strokeStyle = '#8e2f3a'; c.lineWidth = 2 / Math.sqrt(z);
  c.beginPath(); c.moveTo(204, 328);
  c.bezierCurveTo(230, 322, 272, 335, 270, 368); c.bezierCurveTo(268, 398, 235, 410, 205, 402);
  c.bezierCurveTo(192, 398, 184, 390, 182, 382); c.lineTo(190, 377);
  c.bezierCurveTo(205, 386, 232, 384, 238, 366); c.bezierCurveTo(242, 350, 226, 342, 212, 338); c.closePath();
  c.fill(); c.stroke();
  c.strokeStyle = 'rgba(140,40,55,.55)'; c.lineWidth = 1.2 / Math.sqrt(z);
  for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(244 + i * 4, 345 + i * 3); c.quadraticCurveTo(262, 370 + i * 3, 228 + i * 2, 396 - i); c.stroke(); }
  // intestines
  c.strokeStyle = '#d99a72'; c.lineWidth = 12; c.lineCap = 'round';
  c.beginPath(); c.moveTo(150, 485); c.lineTo(148, 420); c.quadraticCurveTo(150, 410, 165, 412); c.lineTo(238, 412);
  c.quadraticCurveTo(254, 410, 254, 425); c.lineTo(252, 486); c.stroke();
  c.strokeStyle = '#e8b48c'; c.lineWidth = 7;
  c.beginPath(); c.moveTo(170, 432);
  for (let i = 0; i < 6; i++) c.bezierCurveTo(235, 432 + i * 9, 235, 437 + i * 9, 170, 441 + i * 9);
  c.stroke();
  c.fillStyle = 'rgba(240,210,120,.6)'; c.beginPath(); c.ellipse(200, 505, 16, 11, 0, 0, Math.PI * 2); c.fill();
  if (LV.flyExtras) LV.flyExtras(c, z);
}
function flyRender(dt) {
  const c = flyC, r = fly.steps[fly.k];
  fly.t += dt;
  if (r && r.draw) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    r.draw(c, fly.t);
    if (fly.t > r.dur + 1 && (fly.spoke || fly.t > r.dur + fly.wait + (fly.voiced ? 4 : 0))) flyGo(fly.k + 1);
    return;
  }
  if (r) {
    const u = ease(Math.min(1, fly.t / TWEEN));
    const [tx, ty, tz] = r.cam;
    fly.cam.x = fly.from.x + (tx - fly.from.x) * u;
    fly.cam.y = fly.from.y + (ty - fly.from.y) * u;
    fly.cam.z = Math.exp(Math.log(fly.from.z) + (Math.log(tz) - Math.log(fly.from.z)) * u);
    fly.ship = alongPath(r.path, u);
    if (fly.t > TWEEN + 1 && (fly.spoke || fly.t > TWEEN + fly.wait + (fly.voiced ? 4 : 0))) flyGo(fly.k + 1);
    if (!fly.on || fly.steps[fly.k].draw) return;
  } else { fly.cam.x = 20; fly.cam.y = 420 + Math.sin(anim * .6) * 8; }
  const z = fly.cam.z, s = BODY_FIT * z;
  c.setTransform(1, 0, 0, 1, 0, 0);
  const bg = c.createRadialGradient(480, 264, 50, 480, 264, 600);
  bg.addColorStop(0, '#1c1430'); bg.addColorStop(1, '#05030a');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(200,190,255,.35)';
  for (let i = 0; i < 70; i++) circle(c, (hash(i, 1) * W + anim * (4 + hash(i, 2) * 8)) % W, hash(i, 3) * H, .6 + hash(i, 4));
  c.setTransform(s, 0, 0, s, W / 2 - fly.cam.x * s, H / 2 - fly.cam.y * s);
  drawBody(c, z);
  // ship and its glowing trail, drawn in screen space
  c.setTransform(1, 0, 0, 1, 0, 0);
  const toScreen = ([x, y]) => [W / 2 + (x - fly.cam.x) * s, H / 2 + (y - fly.cam.y) * s];
  if (fly.k >= 0) {
    const [sx, sy] = toScreen(fly.ship);
    fly.trail.push([sx, sy]); if (fly.trail.length > 24) fly.trail.shift();
    fly.trail.forEach(([x, y], i) => { c.fillStyle = `rgba(120,230,255,${i / fly.trail.length * .5})`; circle(c, x, y, 1 + i / 8); });
    c.shadowColor = '#7fe6ff'; c.shadowBlur = 16;
    c.fillStyle = '#e8fbff'; c.beginPath(); c.ellipse(sx, sy, 7, 4, 0, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0; c.fillStyle = '#2b9fd6'; circle(c, sx + 2, sy - .5, 2);
  }
  // organ labels
  c.font = 'bold 14px Trebuchet MS'; c.textAlign = 'left'; c.textBaseline = 'middle';
  const lab = r ? r.labels : [];
  const la = r ? Math.min(1, Math.max(0, (fly.t - TWEEN * .8) / .6)) : 1;
  for (const name of lab) {
    const [ox, oy] = toScreen(ORGANS[name]);
    const right = ORGANS[name][0] >= 200, lx = ox + (right ? 70 : -70);
    c.globalAlpha = la; c.strokeStyle = 'rgba(255,240,200,.8)'; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(lx, oy - 18); c.stroke();
    c.fillStyle = '#ffe9b0'; c.textAlign = right ? 'left' : 'right';
    c.fillText(name, lx + (right ? 4 : -4), oy - 18);
  }
  c.globalAlpha = 1;
  if (r && r.fade) {
    const f = clamp((fly.t - TWEEN * .55) / (TWEEN * .45), 0, 1);
    c.fillStyle = r.fade === true ? `rgba(61,11,18,${f})` : r.fade.replace('A', f); c.fillRect(0, 0, W, H);
  }
}
let flyLast = performance.now(), flyRunning = false;
function flyLoop(now) {
  const dt = Math.min(.1, (now - flyLast) / 1000); flyLast = now;
  if (fly.on) { flyRender(dt); requestAnimationFrame(flyLoop); } else flyRunning = false;
}
function runFlyLoop() {
  if (flyRunning) return;
  flyRunning = true; flyLast = performance.now(); requestAnimationFrame(flyLoop);
}

// ---------- glossary ----------
const glossEl = document.getElementById('gloss');
function buildGloss() {
  document.getElementById('glossList').innerHTML = Object.keys(GLOSS).map(k => `<div data-k="${k}">${glossHTML(k)}</div>`).join('');
}
document.getElementById('glossList').onclick = e => {
  const d = e.target.closest('[data-k]');
  if (d) speak(`${d.dataset.k}. ${GLOSS[d.dataset.k][1]}`, true);
};
function openGloss() {
  if (mathCtx) return;
  glossEl.classList.add('show'); paused = true;
}
function closeGloss() {
  glossEl.classList.remove('show'); hush();
  paused = !started || ended || !!mathCtx;
}
document.getElementById('btnWords').onclick = e => { e.target.blur(); openGloss(); };
document.getElementById('btnGlossClose').onclick = closeGloss;

// ---------- level codes ----------
// Each level has a code that opens it; finishing a level shows the next one's code (its award).
function goToCode(code) { location.hash = code; location.reload(); }
function submitCode() {
  const inp = document.getElementById('codeIn'), msg = document.getElementById('codeMsg');
  const code = inp.value.trim().toUpperCase();
  const lv = Object.values(LEVELS).find(l => l.code === code);
  if (!lv) { msg.textContent = 'Hmm, that code doesn\'t work. Check the letters!'; sfx('wrong'); return; }
  if (lv === LV) { msg.textContent = 'You\'re already on this level. Press Start!'; return; }
  goToCode(code);
}
document.getElementById('btnCode').onclick = e => {
  ensureAudio();
  e.target.hidden = true;
  document.getElementById('codeBox').hidden = false;
  document.getElementById('codeIn').focus();
};
document.getElementById('btnCodeGo').onclick = submitCode;
document.getElementById('btnNextLevel').onclick = () => goToCode(LV.award);

// ---------- input ----------
const KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' };
addEventListener('keydown', e => {
  ensureAudio();
  if (e.target.tagName === 'INPUT') {
    if (e.key === 'Enter') { e.preventDefault(); submitCode(); }
    return;
  }
  if (mathCtx) {
    if (/^Digit\d$|^Numpad\d$/.test(e.code)) mathKey(e.code.slice(-1));
    else if (e.key === 'Backspace') mathKey('del');
    else if (e.key === 'Enter') mathKey('ok');
    else if (e.key === 'Escape') closeMath(null);
    e.preventDefault(); return;
  }
  if (glossEl.classList.contains('show')) {
    if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); closeGloss(); }
    return;
  }
  if (fly.on) {
    if (e.key === 'Escape') flyEnd();
    else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (fly.k < 0) document.getElementById('btnJourney').click(); else flyGo(fly.k + 1);
    }
    return;
  }
  if (!started) {
    if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); document.getElementById('btnNext').click(); }
    if (e.key === 'ArrowLeft' && page) { e.preventDefault(); showPage(page - 1, true); }
    return;
  }
  if (ended) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const next = document.getElementById('btnNextLevel');
      (next.hidden ? document.getElementById('btnAgain') : next).click();
    }
    return;
  }
  if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; e.preventDefault(); }
  if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) { if (!e.repeat) jumpQ = true; e.preventDefault(); }
  if (e.code === 'KeyE' || e.code === 'Enter') { if (!e.repeat) powerQ = true; e.preventDefault(); }
  if (/^Digit[1-9]$/.test(e.code) && +e.code.slice(-1) <= heroes.length) { active = +e.code.slice(-1) - 1; sfx('switch'); }
  if (e.code === 'Tab') { active = (active + (e.shiftKey ? heroes.length - 1 : 1)) % heroes.length; sfx('switch'); e.preventDefault(); }
  if (e.code === 'KeyR' && !released) { released = true; spawnT = 0; LV.onRelease(); }
});
addEventListener('keyup', e => { if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false; });
addEventListener('blur', () => { keys.left = keys.right = false; });

document.getElementById('btnHelp').onclick = showHelp;
document.getElementById('btnHear').onclick = () => {
  if (!mathCtx) return;
  ensureAudio();
  const on = readAloud; readAloud = 'speechSynthesis' in window;
  speak(questionSpeech(mathCtx.p) + (helpEl.classList.contains('show') ? '. ' + helpEl.innerHTML : ''), true);
  readAloud = on;
};
document.getElementById('btnGotIt').onclick = () => mathKey('ok');
document.getElementById('btnAgain').onclick = () => {
  endEl.classList.remove('show'); resetLevel(); paused = false;
};
document.getElementById('btnRestart').onclick = e => {
  e.target.blur();
  if (mathCtx || fly.on) return;
  endEl.classList.remove('show'); resetLevel(); paused = !started;
};
document.getElementById('btnSound').onclick = e => {
  muted = !muted; e.target.textContent = 'Sound: ' + (muted ? 'off' : 'on'); e.target.blur();
};
const btnRead = document.getElementById('btnRead');
btnRead.onclick = e => {
  readAloud = !readAloud; if (!readAloud) hush();
  btnRead.textContent = '🔊 Read aloud: ' + (readAloud ? 'on' : 'off'); e.target.blur();
};

// ---------- layout ----------
function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  const st = document.getElementById('stage');
  st.style.width = W * s + 'px'; st.style.height = H * s + 'px'; st.style.fontSize = 16 * s + 'px';
}
addEventListener('resize', fit);

// Every fixed line the game can say, so tools/voice can pre-record them. Speech built from
// numbers (maths questions and help) is left to the browser voice.
function allSpeech() {
  const out = new Map(), add = html => { const t = speechText(html); if (t) out.set(voiceKey(t), t); };
  for (const lv of Object.values(LEVELS)) {
    lv.story.forEach(add);
    lv.fly.forEach(s => add(s.text));
    (lv.finale || []).forEach(s => add(s.text));
    Object.values(lv.facts).forEach(f => add('Body fact! ' + f));
    (lv.lines || []).forEach(add);
    add(`Your secret code is ${lv.award.split('').join(', ')}. ${lv.award}!`);
  }
  Object.keys(GLOSS).forEach(k => add(`${k}. ${GLOSS[k][1]}`));
  PRAISE.forEach(add);
  return [...out].map(([key, text]) => ({ key, text }));
}

// ---------- boot ----------
// Called from index.html once every level file has loaded. The URL hash (#CODE) picks the level.
function boot() {
  const code = decodeURIComponent(location.hash.slice(1)).trim().toUpperCase();
  LV = Object.values(LEVELS).find(l => l.code === code) || LEVELS[1];
  document.querySelector('#flyTitle h2').textContent = LV.title;
  document.getElementById('facts').classList.add('lv' + LV.num);
  fly.steps = LV.fly; fly.ship = [...LV.fly[0].path[0]];
  buildGloss();
  renderBackground();
  resetLevel();
  fit();
  showPage(0, false);
  requestAnimationFrame(frame);
  runFlyLoop();
}
