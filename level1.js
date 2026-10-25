'use strict';
// ---------- Level 1 · The Bleeding Ulcer (stomach) ----------
LEVELS[1] = (() => {
const RBC_TOTAL = 10, RBC_NEED = 7, RBC_SPEED = 38, RBC_GAP = 1.7;
const ACID_START = 75, ACID_RATE = 0.9, ACID_Y0 = 20 * T;
const EXIT = { x: 36 * T, y: 9 * T, w: 3 * T, h: 3 * T };
const SWITCH = { x: 22 * T + 12, y: 14 * T };
const GATE_COL = 26, GATE_TOP = 12, GATE_BOT = 17;

// ---------- body facts ----------
const FACTS = {
  ulcer: 'An <b>ulcer</b> is a sore in the lining of the stomach. Lots of them are caused by the germ <b>H. pylori</b>.',
  hpylori: '<b>H. pylori</b> is spiral-shaped. It spins like a corkscrew to drill into the stomach\'s slimy mucus.',
  ammonia: 'Acid can\'t easily kill <b>H. pylori</b>: it makes a cloud of <b>ammonia</b> around itself as a shield!',
  nobel: 'Barry Marshall <b>drank a cup of H. pylori</b> to prove it makes stomachs sick. He and Robin Warren won a <b>Nobel Prize</b> in 2005.',
  macro: '<b>Macrophage</b> means "big eater" in Greek. They swallow germs whole and digest them inside.',
  split: 'Bacteria multiply by <b>splitting in two</b>. Some kinds can double every 20 minutes!',
  platelet: '<b>Platelets</b> aren\'t whole cells. They\'re tiny fragments that stick together to plug leaks.',
  fibrin: 'Platelets make a plug, then a stringy protein called <b>fibrin</b> weaves a net over it. That\'s a <b>clot</b>!',
  valve: '<b>Veins</b> have little valves inside them, like doors, so blood can\'t flow backwards.',
  nerve: '<b>Nerve signals</b> are electrical. The fastest ones travel over 100 metres per second!',
  rbc: '<b>Red blood cells</b> have no nucleus. That leaves more room for <b>haemoglobin</b>, which carries oxygen.',
  rbcLife: 'A red blood cell lives about <b>120 days</b>. A grown-up has about <b>25 trillion</b> of them!',
  acid: 'Stomach acid is <b>hydrochloric acid</b>. It\'s strong enough to dissolve some metals!',
  mucus: 'Your stomach coats itself in thick <b>mucus</b> so it doesn\'t digest itself.',
};

// ---------- level ----------
let gateOpen = false, gateAnim = 0, nervePulse = -1, acidY = ACID_Y0, dripT = 0;
function buildGrid() {
  const g = [];
  for (let y = 0; y < ROWS; y++) g.push(new Array(COLS).fill(0));
  for (let x = 0; x < COLS; x++) { g[0][x] = 1; for (let y = 18; y < ROWS; y++) g[y][x] = 1; }
  for (let y = 0; y < ROWS; y++) { g[y][0] = 1; g[y][COLS - 1] = 1; }
  for (let x = 9; x <= 12; x++) for (let y = 18; y < ROWS; y++) g[y][x] = 0;     // acid pit
  for (let x = 21; x <= 23; x++) g[14][x] = 1;                                     // nerve ledge
  for (let y = 0; y < GATE_TOP; y++) g[y][GATE_COL] = 1;                           // wall above valve
  for (let y = GATE_TOP; y <= GATE_BOT; y++) g[y][GATE_COL] = 3;                   // vein valve
  const stairs = { 29: 17, 30: 16, 31: 15, 32: 14, 33: 13 };
  for (const c in stairs) for (let y = stairs[c]; y < 18; y++) g[y][c] = 1;
  for (let x = 34; x <= 38; x++) for (let y = 12; y < 18; y++) g[y][x] = 1;        // exit platform
  for (const x of [12, 13, 14, 15, 30, 31, 32]) g[1][x] = 1;                       // ceiling lumps
  g[2][13] = 1; g[2][14] = 1; g[2][31] = 1;
  return g;
}
const solid = t => t === 1 || t === 2 || (t === 3 && !gateOpen);
function reset() {
  grid = buildGrid();
  gateOpen = false; gateAnim = 0; nervePulse = -1; acidY = ACID_Y0;
  heroes = [
    makeHero('zaal', 'Zaal', 3, 16, 30, 150, 575, 'Super-jump · E near a nerve to zap it'),
    makeHero('gob', 'Gobbler', 5, 30, 26, 95, 405, 'E next to a germ to swallow it'),
    makeHero('patch', 'Patch', 7, 20, 18, 125, 420, 'E at an edge to build a clot bridge'),
  ];
  germs = [makeGerm(15, 17), makeGerm(17, 17), makeGerm(19, 17), makeGerm(35, 11)];
}

// ---------- powers ----------
function usePower(h) {
  if (h.id === 'gob') {
    const best = nearestGerm(h);
    if (!best) return say(h, 'No germ close enough!');
    openMath('GULP TIME! Solve it to swallow the germ:', () => {
      best.state = 'eaten'; best.t = 0; h.eatT = .7; h.eaten++; h.facing = cx(best) > cx(h) ? 1 : -1;
      sfx('gulp');
      fact(h.eaten === 1 ? 'macro' : h.eaten === 2 ? 'hpylori' : h.eaten === 3 ? 'ammonia' : 'nobel');
    }, () => {
      if (germs.filter(g => g.state === 'alive').length < 9) {
        const n = makeGerm(0, 0);
        Object.assign(n, { x: best.x + 6, y: best.y - 4, home: best.home, dir: -best.dir });
        germs.push(n);
      }
      for (let i = 0; i < 10; i++) goo(cx(best), cy(best), '#9bb33c');
      sfx('squelch'); say(best, 'It split in two!', '#d7ef6a'); fact('split');
    });
  } else if (h.id === 'patch') {
    const { row, cells } = gapCells(h, t => t === 0);
    if (!cells.length) return say(h, 'Nothing to bridge here!');
    openMath('BUILD A CLOT BRIDGE! Solve it to stick the platelets together:', () => {
      fillCells(row, cells, 2, '#7a0d16'); sfx('build');
      fact(seenFacts.has('platelet') ? 'fibrin' : 'platelet');
    }, () => say(h, 'The platelets slid apart...', '#ffb0b0'));
  } else {
    if (gateOpen) return say(h, 'The valve is already open!');
    const d = Math.hypot(SWITCH.x - cx(h), SWITCH.y - (h.y + h.h));
    if (d > 34) return say(h, 'Find the glowing nerve!');
    openMath('NERVE SIGNAL! Solve it to zap the valve open:', () => {
      gateOpen = true; nervePulse = 0; sfx('zap'); fact('nerve');
      setTimeout(() => fact('valve'), 2500);
    }, () => say(h, 'Fizzle... try again!', '#ffb0b0'));
  }
}

// ---------- update ----------
function update(dt) {
  updateHeroes(dt, h => {
    if (h.y + h.h > acidY + 4 || h.y > H) {
      for (let k = 0; k < 20; k++) goo(cx(h), acidY, '#b8d63c');
      sfx('splat');
      if (acidY < 18 * T) return fail(`Oh no! ${h.name} got caught in the acid flood and digested. Yuck!`);
      Object.assign(h, { x: h.spawnX, y: h.spawnY, vx: 0, vy: 0, knockT: 0 });
      say(h, 'Dissolved! Back to the start...', '#d7ef6a');
    }
  });
  if (ended || paused) return;
  updateGerms(dt);

  // red blood cells
  spawnWalkers(dt, RBC_TOTAL, RBC_GAP, () =>
    ({ x: 2.5 * T - 7, y: 4.6 * T, w: 14, h: 12, vx: 0, vy: 0, dir: 1, state: 'walk', t: 0, onGround: false, ph: Math.random() * 6 }));
  for (const r of walkers) {
    r.ph += dt;
    if (r.state === 'walk') {
      walkStep(r, dt, RBC_SPEED);
      if (overlap({ x: cx(r) - 1, y: cy(r) - 1, w: 2, h: 2 }, EXIT)) {
        r.state = 'saved'; r.t = 0; saved++; sfx('saved');
        if (saved === 1) fact('rbc');
        if (saved === 5) fact('rbcLife');
      } else if (germs.some(g => g.state === 'alive' && overlap(g, r))) {
        r.state = 'infected'; r.t = 0; lost++; sfx('squelch');
        say(r, 'Infected!', '#d7ef6a');
      } else if (r.y + r.h > acidY + 3 || r.y > H) {
        r.state = 'gone'; lost++; sfx('splat');
        for (let k = 0; k < 12; k++) goo(cx(r), acidY, '#c41a24');
      }
    } else if (r.state === 'saved') {
      r.t += dt; r.x += (EXIT.x + EXIT.w - 10 - r.x) * dt * 3;
      if (r.t > .8) r.state = 'gone';
    } else if (r.state === 'infected') {
      r.t += dt;
      if (r.t > .8) { r.state = 'gone'; for (let k = 0; k < 14; k++) goo(cx(r), cy(r), k % 2 ? '#9bb33c' : '#c41a24'); sfx('splat'); }
    }
  }
  walkers = walkers.filter(r => r.state !== 'gone');

  // valve, acid, ambience
  if (gateOpen) gateAnim = Math.min(1, gateAnim + dt * 1.5);
  if (nervePulse >= 0) nervePulse = nervePulse < 1 ? nervePulse + dt : nervePulse;
  if (gameTime > ACID_START) {
    if (acidY === ACID_Y0) { fact('acid'); setTimeout(() => fact('mucus'), 7000); }
    acidY -= ACID_RATE * dt;
  }
  dripT -= dt;
  if (dripT <= 0 && ceilTiles.length) {
    dripT = .25 + Math.random() * .5;
    const [c, r] = pick(ceilTiles);
    parts.push({ x: c * T + 4 + Math.random() * 16, y: (r + 1) * T + 6, vx: 0, vy: 0, life: 2, max: 2,
      color: 'rgba(230,220,160,.85)', size: 2.2, grav: 420, drip: true });
  }
  if (Math.random() < .05) parts.push({ x: 2.5 * T + (Math.random() - .5) * 20, y: 4.4 * T, vx: 0, vy: 0, life: 1.5, max: 1.5, color: '#9e0f19', size: 2.5, grav: 500, drip: true });
  updateParticles(dt, acidY);

  // hints and win / lose
  const allHome = heroes.every(h => h.inExit);
  if (lost > RBC_TOTAL - RBC_NEED) return fail(`Too many blood cells were lost (${lost}). You need to save ${RBC_NEED} of ${RBC_TOTAL}.`);
  if (released && spawned === RBC_TOTAL && saved + lost === RBC_TOTAL) {
    if (allHome) return win();
    hint = 'All the blood cells are done. Now get every hero into the vein!';
  } else if (!released) hint = 'Clear the way first, then press R to release the blood cells.';
  else hint = 'Guide the blood cells to the vein. Heroes standing still make them turn around.';
}
function win() {
  sfx('win');
  showEnd('ULCER HEALED!', `You saved <b>${saved} of ${RBC_TOTAL}</b> blood cells${saved === RBC_TOTAL ? ', every single one!' : '.'} ` +
    `Gobbler swallowed ${heroes[1].eaten} germ${heroes[1].eaten === 1 ? '' : 's'}. Brain power reached ${'★'.repeat(mathLevel)}.<br>` +
    `<i>Coming next: the colon, where things are getting very, very runny...</i>`, 'PLOP');
  document.getElementById('btnAgain').textContent = 'Play again';
}

// ---------- drawing: static layers ----------
function paintBackground(c) {
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3d0b12'); g.addColorStop(1, '#1c0306');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // stomach folds (rugae)
  for (let i = 0; i < 16; i++) {
    c.strokeStyle = `rgba(${100 + hash(i, 9) * 30 | 0},20,32,${.12 + hash(i, 1) * .15})`;
    c.lineWidth = 8 + hash(i, 2) * 22; c.lineCap = 'round';
    const y = hash(i, 3) * H;
    c.beginPath(); c.moveTo(-30, y);
    for (let x = 0; x <= W + 60; x += 70) c.quadraticCurveTo(x + 35, y + (hash(i, x) - .5) * 90, x + 70, y + (hash(i, x + 7) - .5) * 40);
    c.stroke();
  }
  // veins
  function branch(x, y, a, len, w, d) {
    if (d > 5 || w < .6) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    c.strokeStyle = `rgba(80,30,100,${.18 + w * .03})`; c.lineWidth = w;
    c.beginPath(); c.moveTo(x, y);
    c.quadraticCurveTo((x + x2) / 2 + Math.sin(d + a) * 12, (y + y2) / 2 + Math.cos(d) * 12, x2, y2); c.stroke();
    branch(x2, y2, a + .4 + hash(d, x | 0) * .4, len * .75, w * .7, d + 1);
    branch(x2, y2, a - .4 - hash(y | 0, d) * .4, len * .7, w * .65, d + 1);
  }
  for (let i = 0; i < 6; i++) branch(hash(i, 50) * W, hash(i, 51) * H, hash(i, 52) * 6.3, 60, 5, 0);
  // blobby cells in the wall
  for (let i = 0; i < 90; i++) {
    const x = hash(i, 70) * W, y = hash(i, 71) * H, r = 6 + hash(i, 72) * 18;
    g = c.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r);
    g.addColorStop(0, 'rgba(230,120,130,.10)'); g.addColorStop(1, 'rgba(120,20,30,0)');
    c.fillStyle = g; circle(c, x, y, r);
    c.fillStyle = 'rgba(70,10,30,.12)'; circle(c, x + r * .1, y, r * .25);
  }
  g = c.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function paintTerrain(c) {
  const isSolid = (x, y) => x < 0 || x >= COLS || y < 0 || (y < ROWS && (grid[y][x] === 1 || grid[y][x] === 2));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = grid[y][x];
    if (t !== 1 && t !== 2) continue;
    const px = x * T, py = y * T;
    if (t === 1) {
      const l = 30 + hash(x, y) * 10;
      c.fillStyle = `hsl(352,48%,${l}%)`; c.fillRect(px, py, T, T);
      for (let i = 0; i < 4; i++) {
        c.fillStyle = `hsla(${345 + hash(x, y, i) * 15},50%,${25 + hash(y, x, i) * 20}%,.55)`;
        circle(c, px + hash(x, y, i + 9) * T, py + hash(x, y, i + 19) * T, 3 + hash(x, y, i + 29) * 7);
      }
      if (hash(x, y, 77) < .3) { c.strokeStyle = 'rgba(90,20,70,.45)'; c.lineWidth = 1.2; c.beginPath();
        c.moveTo(px, py + hash(x, y, 5) * T); c.quadraticCurveTo(px + 12, py + hash(x, y, 6) * T, px + T, py + hash(x, y, 8) * T); c.stroke(); }
    } else {
      c.fillStyle = '#4e0910'; c.fillRect(px, py, T, T);
      for (let i = 0; i < 5; i++) {
        c.fillStyle = '#a5131d';
        c.beginPath(); c.ellipse(px + 3 + hash(x, i, 3) * 18, py + 4 + hash(i, y, 4) * 16, 3.5, 2.4, hash(x, y, i) * 3, 0, 7); c.fill();
      }
      c.strokeStyle = 'rgba(240,215,190,.55)'; c.lineWidth = .8;
      for (let i = 0; i < 7; i++) {
        c.beginPath(); c.moveTo(px + hash(x, y, i) * T, py + hash(y, x, i) * T);
        c.lineTo(px + hash(x, y, i + 40) * T, py + hash(y, x, i + 40) * T); c.stroke();
      }
    }
    // darker rims where flesh meets open space
    c.fillStyle = 'rgba(40,0,8,.45)';
    if (!isSolid(x - 1, y)) c.fillRect(px, py, 3, T);
    if (!isSolid(x + 1, y)) c.fillRect(px + T - 3, py, 3, T);
    if (!isSolid(x, y + 1) && y < ROWS - 1) {
      c.fillRect(px, py + T - 3, T, 3);
      ceilTiles.push([x, y]);
      c.fillStyle = 'rgba(225,215,150,.8)';
      for (let i = 0; i < 2; i++) if (hash(x, y, i + 60) < .55) {
        const dx = px + 4 + hash(x, y, i + 61) * 16, len = 4 + hash(x, y, i + 62) * 10;
        c.beginPath(); c.moveTo(dx - 3, py + T); c.quadraticCurveTo(dx, py + T + len * 1.4, dx + 3, py + T); c.fill();
      }
      c.fillStyle = 'rgba(40,0,8,.45)';
    }
    // slimy mucus coating on top surfaces
    if (!isSolid(x, y - 1)) {
      c.fillStyle = t === 2 ? 'rgba(160,30,40,.9)' : 'rgba(228,216,150,.85)';
      c.beginPath(); c.moveTo(px, py - 1); c.lineTo(px + T, py - 1);
      for (let i = 4; i >= 0; i--) c.lineTo(px + i * T / 4, py + 3 + hash(x, y, i + 80) * 5);
      c.fill();
      if (hash(x, y, 90) < .4 && t === 1) { const dx = px + 5 + hash(x, y, 91) * 14;
        c.beginPath(); c.moveTo(dx - 3, py + 4); c.quadraticCurveTo(dx, py + 14 + hash(x, y, 92) * 6, dx + 3, py + 4); c.fill(); }
      c.strokeStyle = 'rgba(255,255,240,.55)'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(px + 2, py + 1); c.lineTo(px + T - 4, py + 1); c.stroke();
    }
  }
}

// ---------- drawing: characters ----------
function drawPatch(c, x, by, f, t, walking) {
  c.save(); c.translate(x, by - 9); c.scale(f, 1);
  c.strokeStyle = '#d6a83e'; c.lineWidth = 1.6; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + .3, w = Math.sin(t * 4 + i * 2) * .25;
    c.beginPath(); c.moveTo(Math.cos(a) * 7, Math.sin(a) * 6);
    c.quadraticCurveTo(Math.cos(a + w) * 11, Math.sin(a + w) * 9, Math.cos(a - w) * 13, Math.sin(a - w) * 10); c.stroke();
  }
  const g = c.createRadialGradient(-2, -2, 1, 0, 0, 9);
  g.addColorStop(0, '#fbe2a0'); g.addColorStop(1, '#dcae4a');
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 9, 7.5, 0, 0, 7); c.fill();
  c.strokeStyle = '#a07624'; c.lineWidth = 1; c.stroke();
  c.fillStyle = 'rgba(140,60,140,.6)'; for (let i = 0; i < 5; i++) circle(c, -6 + hash(i, 1) * 8, -1 + hash(i, 2) * 6, 1);
  c.fillStyle = '#fff'; circle(c, 3, -1.5, 2.3); circle(c, 7, -1, 2);
  c.fillStyle = '#2b1606'; circle(c, 3.8, -1.2, 1.1); circle(c, 7.6, -.8, 1);
  c.fillStyle = '#f39a1c'; c.beginPath(); c.arc(1, -6, 6.5, Math.PI, 0); c.fill();           // hard hat
  c.fillRect(-6.5, -6.6, 15, 1.8);
  c.fillStyle = '#ffd36b'; c.fillRect(0, -11.5, 2, 5);
  c.restore();
}
function drawRBC(c, x, y, dir, t, state, alpha = 1) {
  c.save(); c.translate(x, y); c.globalAlpha = alpha;
  const sq = state === 'walk' ? Math.sin(t * 12) * .6 : 0;
  c.fillStyle = '#5e060c';
  c.fillRect(-4 + sq * 2, 5, 2, 2); c.fillRect(2 - sq * 2, 5, 2, 2);
  const g = c.createRadialGradient(-2, -2, 1, 0, 0, 8);
  g.addColorStop(0, '#e2323a'); g.addColorStop(1, '#a10e17');
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 7.5 + sq, 5.6 - sq * .5, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(110,5,12,.75)'; c.beginPath(); c.ellipse(0, .5, 3.6, 2.2, 0, 0, 7); c.fill();  // dimple
  c.fillStyle = 'rgba(255,190,190,.5)'; c.beginPath(); c.ellipse(-3, -3, 2.5, 1, -.4, 0, 7); c.fill();
  c.fillStyle = '#fff'; circle(c, 2 * dir, -2, 1.5); circle(c, 5 * dir, -2, 1.4);
  c.fillStyle = '#000'; circle(c, 2.5 * dir, -2, .7); circle(c, 5.5 * dir, -2, .7);
  if (state === 'infected') { c.fillStyle = 'rgba(140,190,40,.75)'; c.beginPath(); c.ellipse(0, 0, 8, 6, 0, 0, 7); c.fill(); }
  c.restore();
}
function drawGerm(c, x, y, dir, t, scale = 1) {
  c.save(); c.translate(x, y); c.scale(dir * scale, scale);
  c.strokeStyle = 'rgba(210,205,150,.8)'; c.lineWidth = 1;
  for (let i = 0; i < 5; i++) {                                  // flagella at the tail
    c.beginPath(); c.moveTo(-11, 0);
    for (let s = 1; s <= 6; s++) c.lineTo(-11 - s * 2.4, Math.sin(t * 14 + s + i * 1.3) * 2 + (i - 2) * 1.8 * s * .3);
    c.stroke();
  }
  const pts = [];
  for (let s = 0; s <= 14; s++) pts.push([-11 + s * 22 / 14, Math.sin(s / 14 * Math.PI * 3 - t * 7) * 2.6]);
  const stroke = (col, w) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
    pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); };
  stroke('#3b4a12', 8.5); stroke('#7d952d', 6.5); stroke('rgba(220,240,140,.5)', 1.6);
  const hy = pts[14][1];
  c.fillStyle = '#ffe9a0'; circle(c, 8, hy - 1.5, 2.1); circle(c, 11.5, hy - 1, 1.8);
  c.fillStyle = '#b00000'; circle(c, 8.6, hy - 1.3, 1); circle(c, 12, hy - .8, .9);
  c.strokeStyle = '#1c2406'; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(6, hy - 4.5); c.lineTo(10, hy - 3); c.moveTo(13.5, hy - 3.8); c.lineTo(10.5, hy - 3); c.stroke();
  c.restore();
}

// ---------- drawing: set pieces ----------
function drawVessel(c) {
  const y0 = 2 * T, y1 = 4.3 * T;
  let g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#6e0f1a'); g.addColorStop(.35, '#c03040'); g.addColorStop(.6, '#8c1522'); g.addColorStop(1, '#4a0610');
  c.fillStyle = g; rr(c, T * .5, y0, 9 * T, y1 - y0, 22); c.fill();
  c.strokeStyle = 'rgba(255,200,200,.25)'; c.lineWidth = 2;
  for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(i * T + 10, y0 + 3); c.quadraticCurveTo(i * T + 16, (y0 + y1) / 2, i * T + 10, y1 - 3); c.stroke(); }
  c.fillStyle = '#1a0205';
  c.beginPath(); c.moveTo(1.4 * T, y1 - 4);
  for (let i = 0; i <= 8; i++) c.lineTo(1.4 * T + i * 6, y1 - 4 + (i % 2 ? 7 : -5));
  c.lineTo(1.4 * T + 48, y1 - 4); c.closePath(); c.fill();
  if (spawned < RBC_TOTAL) for (let i = 0; i < Math.min(3, RBC_TOTAL - spawned); i++)
    drawRBC(c, 1.7 * T + i * 14, y1 - 6 + Math.sin(anim * 3 + i) * 1.5, 1, anim, 'wait');
  c.fillStyle = '#ffd0d0'; c.font = 'bold 11px Trebuchet MS'; c.textAlign = 'center';
  c.fillText(released ? 'torn blood vessel' : `torn blood vessel: ${RBC_TOTAL - spawned} cells waiting (R)`, 5 * T, y0 - 6);
}
function drawExit(c) {
  const x0 = 35.6 * T, y0 = 8.7 * T, y1 = 12 * T;
  let g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, '#3a1440'); g.addColorStop(.4, '#7a2a6a'); g.addColorStop(1, '#2a0a2a');
  c.fillStyle = g; c.fillRect(x0 + 10, y0, W - T - x0 - 10, y1 - y0);
  const glow = .5 + Math.sin(anim * 3) * .25;
  c.fillStyle = `rgba(255,120,160,${glow * .5})`; c.beginPath(); c.ellipse(x0 + 10, (y0 + y1) / 2, 14, (y1 - y0) / 2 + 4, 0, 0, 7); c.fill();
  c.fillStyle = '#150310'; c.beginPath(); c.ellipse(x0 + 10, (y0 + y1) / 2, 9, (y1 - y0) / 2 - 2, 0, 0, 7); c.fill();
  c.fillStyle = '#ffd0e8'; c.font = 'bold 12px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('VEIN: way home', x0 + 22, y0 - 8);
  c.fillText('↓', x0 + 22, y0 + 4 + Math.sin(anim * 4) * 3);
}
function drawGate(c) {
  const x0 = GATE_COL * T, y0 = GATE_TOP * T, h = (GATE_BOT - GATE_TOP + 1) * T;
  c.fillStyle = 'rgba(60,10,40,.6)'; c.fillRect(x0 - 3, y0, T + 6, h);
  const len = (h / 2) * (1 - gateAnim) + 6;
  for (const top of [true, false]) {
    c.save(); c.translate(x0 + T / 2, top ? y0 : y0 + h); if (!top) c.scale(1, -1);
    const g = c.createLinearGradient(-T / 2, 0, T / 2, 0);
    g.addColorStop(0, '#5a1a3a'); g.addColorStop(.5, '#a84a72'); g.addColorStop(1, '#5a1a3a');
    c.fillStyle = g; c.beginPath(); c.moveTo(-T / 2 - 3, 0); c.quadraticCurveTo(-T / 2, len * .7, 0, len);
    c.quadraticCurveTo(T / 2, len * .7, T / 2 + 3, 0); c.fill();
    c.strokeStyle = 'rgba(255,190,220,.35)'; c.lineWidth = 1;
    for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(-8 + i * 4, 2); c.lineTo(-6 + i * 3, len * .8); c.stroke(); }
    c.restore();
  }
  if (!gateOpen) { c.fillStyle = '#ffd0e8'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center'; c.fillText('VALVE', x0 + T / 2, y0 - 4); }
}
function drawNerve(c) {
  const sx = SWITCH.x, sy = SWITCH.y, tx = GATE_COL * T + T / 2, ty = GATE_TOP * T + 4;
  c.strokeStyle = gateOpen ? 'rgba(255,240,120,.8)' : 'rgba(250,210,140,.45)'; c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(sx, sy - 10); c.bezierCurveTo(sx + 20, sy - 70, tx - 30, ty - 60, tx, ty); c.stroke();
  if (nervePulse >= 0 && nervePulse < 1) {
    const u = nervePulse, v = 1 - u;
    const px = v ** 3 * sx + 3 * v * v * u * (sx + 20) + 3 * v * u * u * (tx - 30) + u ** 3 * tx;
    const py = v ** 3 * (sy - 10) + 3 * v * v * u * (sy - 70) + 3 * v * u * u * (ty - 60) + u ** 3 * ty;
    c.fillStyle = '#fffbd0'; c.shadowColor = '#ffee55'; c.shadowBlur = 18; circle(c, px, py, 5); c.shadowBlur = 0;
  }
  c.strokeStyle = 'rgba(250,210,140,.6)'; c.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(sx, sy - 8); c.quadraticCurveTo(sx + i * 6, sy - 4, sx + i * 9, sy); c.stroke(); }
  c.strokeStyle = '#e8c890'; c.lineWidth = 3; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx, sy - 10); c.stroke();
  const p = .6 + Math.sin(anim * 5) * .4;
  c.shadowColor = gateOpen ? '#ffee55' : '#6fe0ff'; c.shadowBlur = 10 + p * 12;
  c.fillStyle = gateOpen ? '#fff1a0' : `rgba(140,230,255,${.6 + p * .4})`; circle(c, sx, sy - 13, 5.5);
  c.shadowBlur = 0;
  if (!gateOpen) { c.fillStyle = '#c8f2ff'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center'; c.fillText('NERVE', sx, sy - 24); }
}
function drawAcid(c) {
  if (acidY >= H) return;
  const g = c.createLinearGradient(0, acidY, 0, H);
  g.addColorStop(0, 'rgba(190,225,50,.78)'); g.addColorStop(1, 'rgba(80,120,15,.92)');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, H);
  for (let x = 0; x <= W; x += 12) c.lineTo(x, acidY + Math.sin(x * .05 + anim * 2.5) * 2.5 + Math.sin(x * .13 - anim * 1.7) * 1.5);
  c.lineTo(W, H); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(240,255,170,.7)'; c.lineWidth = 1.5; c.stroke();
  for (let i = 0; i < 26; i++) {
    const bx = hash(i, 5) * W, life = (anim * (.3 + hash(i, 6) * .4) + hash(i, 7)) % 1;
    const by = H - life * (H - acidY);
    if (by < acidY + 2) continue;
    c.strokeStyle = 'rgba(230,255,160,.6)'; c.lineWidth = 1; c.beginPath(); c.arc(bx + Math.sin(life * 9) * 3, by, 1.5 + hash(i, 8) * 2.5, 0, 7); c.stroke();
  }
}

// ---------- drawing: frame ----------
function render(c) {
  c.drawImage(bgCanvas, 0, 0);
  drawVessel(c);
  drawExit(c);
  drawNerve(c);
  c.drawImage(terrCanvas, 0, 0);
  drawGate(c);
  for (const g of germs) {
    const s = g.state === 'eaten' ? Math.max(.1, 1 - g.t / .6) : 1;
    drawGerm(c, cx(g), cy(g), g.dir, g.phase, s);
  }
  for (const r of walkers) drawRBC(c, cx(r), cy(r), r.dir, r.ph, r.state, r.state === 'saved' ? Math.max(0, 1 - r.t) : 1);
  drawHeroes(c, (c, h, x, by, walking) => drawPatch(c, x, by, h.facing, anim, walking));
  drawParts(c);
  drawAcid(c);
  drawFloats(c);
  hudTop(c, 'Blood cells:', saved, lost);
  c.textAlign = 'right';
  if (gameTime < ACID_START) {
    const s = Math.ceil(ACID_START - gameTime);
    c.fillStyle = s < 15 ? '#ffd36b' : '#c7e04f';
    c.fillText(`Acid starts rising in ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, W - 8, 12.5);
  } else {
    c.fillStyle = Math.sin(anim * 8) > 0 ? '#e8ff60' : '#ff6060';
    c.fillText(acidY > 18 * T ? 'ACID RISING! Get off the floor soon!' : 'ACID FLOODING! Climb to the vein!', W - 8, 12.5);
  }
  hudBottom(c);
}

// ---------- story ----------
Object.assign(IMG, {
  patch: portrait(c => drawPatch(c, 32, 46, 1, 0, false)),
  germ: portrait(c => drawGerm(c, 32, 36, 1, .5, 1.3)),
  rbc: portrait(c => drawRBC(c, 32, 36, 1, 0, 'wait')),
});
const STORY = [
  `<h1>ZAAL vs GERMS</h1><h2>Level 1 · The Bleeding Ulcer</h2>
   <div class="pics"><img src="${IMG.zaal}"></div>
   <p>Zaal has shrunk down smaller than a grain of sand and flown all the way into a person's ${Wd('stomach')}!</p>
   <p>The stomach is a stretchy bag in your belly. It squishes up your food and mixes it with strong ${Wd('acid')} to break it into tiny bits. That's called ${Wd('digest', 'digesting')}.</p>
   <p class="tip nospeak">Tap any <span class="w" data-w="digest">underlined word</span> to find out what it means.</p>`,
  `<h2>Uh-oh. What went wrong?</h2>
   <div class="pics"><img src="${IMG.germ}"></div>
   <p>The stomach protects itself with a thick coat of slime called ${Wd('mucus')}, a bit like snot. The slime stops the acid from burning the stomach wall.</p>
   <p>But corkscrew-shaped ${Wd('germ', 'germs')} called ${Wd('H. pylori')} <span class="pron">(say "aitch pie-LOR-ee")</span> drilled through the slime, like tiny screwdrivers.</p>
   <p>With no slime to protect it, the acid burned a sore into the stomach wall. A sore like this is called an ${Wd('ulcer')}.</p>`,
  `<h2>Now it's bleeding!</h2>
   <div class="pics"><img src="${IMG.rbc}"><img src="${IMG.rbc}"><img src="${IMG.rbc}"></div>
   <p>The ulcer went so deep that it broke open a tiny ${Wd('blood vessel')}, one of the tubes that carry blood around your body. Now ${Wd('red blood cell', 'red blood cells')} are spilling out into the stomach!</p>
   <p>Red blood cells are your body's delivery drivers. They carry ${Wd('oxygen')}, the part of the air you breathe in, to every part of you. You can't live without it.</p>
   <p>If they stay in the stomach, the acid will digest them just like food. They have to get back into the blood through a ${Wd('vein')}. And the acid is starting to rise...</p>`,
  `<h2>Meet your team</h2>
   <div class="team">
     <div class="card"><img src="${IMG.zaal}"><b>1 · Zaal</b><span>The explorer. He can <b>super-jump</b>. He can also zap a ${Wd('nerve')} (one of the body's message wires) to open a ${Wd('valve')}, a little door inside the vein.</span></div>
     <div class="card"><img src="${IMG.gob}"><b>2 · Gobbler</b><span>A ${Wd('macrophage')} <span class="pron">(MAK-roh-fayj)</span>, a big ${Wd('white blood cell')}. White blood cells are your body's army against germs. Gobbler <b>swallows germs whole</b>!</span></div>
     <div class="card"><img src="${IMG.patch}"><b>3 · Patch</b><span>A ${Wd('platelet')} <span class="pron">(PLAYT-let)</span>, a tiny bit of a cell in your blood. Platelets stick together to plug leaks with a ${Wd('clot')}. Patch <b>builds clot bridges</b>.</span></div>
   </div>`,
  `<h2>Your mission</h2>
   <ul>
     <li>Get at least <b>7 of the 10</b> red blood cells into the vein, and all 3 heroes too.</li>
     <li>Blood cells walk all by themselves. They turn around when they bump into a hero, so a hero standing still is a wall.</li>
     <li>The blood cells wait in the torn vessel until you press <kbd>R</kbd>. Clear the way first!</li>
     <li>Every power needs a maths problem. Stuck? Press <b>💡 Show me how</b>.</li>
     <li>After a while the acid starts to rise, so don't hang around!</li>
   </ul>
   <p class="keys" style="text-align:center"><span class="nospeak"><kbd>←</kbd> <kbd>→</kbd> move · <kbd>Space</kbd> jump · <kbd>E</kbd> use power ·
     <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> or <kbd>Tab</kbd> switch hero · <kbd>R</kbd> release blood cells</span></p>`,
];
// Each level lists its own route: camera target, zoom, the ship's path, labels and narration.
const FLY_ROUTE = [
  { cam: [200, 420, 1], path: [[430, 130], [330, 160]], labels: ['brain', 'lungs', 'heart', 'liver', 'stomach', 'intestines'],
    text: `This is a person, a lot like you. Inside are lots of ${Wd('organ', 'organs')}: body parts that each have a special job. Somewhere in here, germs are causing trouble!` },
  { cam: [200, 122, 3.4], path: [[330, 160], [250, 132], [200, 128]], labels: [],
    text: 'Zaal jumps into his tiny ship, shrinks smaller than a grain of sand, and flies in through the mouth!' },
  { cam: [202, 245, 2.6], path: [[200, 128], [200, 150], [201, 200], [204, 280], [206, 328]], labels: ['oesophagus'],
    text: `Down the food pipe! Its proper name is the ${Wd('oesophagus')} <span class="pron">(say "ee-SOF-uh-gus")</span>. Its muscles squeeze food down to the stomach.` },
  { cam: [226, 366, 3.6], path: [[206, 328], [228, 345], [246, 362]], labels: ['stomach', 'liver'],
    text: `Splash! This is the ${Wd('stomach')}. It sits on the left side of the belly (on your right as you look at them), tucked just under the ribs.` },
  { cam: [254, 372, 70], path: [[246, 362], [254, 372]], labels: [], fade: true,
    text: 'Zoom in close to the stomach wall... Uh-oh. Something is very wrong down here!' },
];

// The ulcer on the stomach, with germs crawling round it.
function flyExtras(c) {
  c.fillStyle = '#5c0710'; c.beginPath(); c.ellipse(254, 372, 4.2, 3.2, .4, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(200,30,40,.8)'; c.beginPath(); c.ellipse(254, 372, 2.4, 1.6, .4, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#9bc43a'; for (let i = 0; i < 7; i++) { const w = i * 2.4 + Math.sin(anim * 3 + i) * .25; circle(c, 254 + Math.cos(w) * 4.6, 372 + Math.sin(w) * 3.6, .55); }
}

return {
  num: 1, code: 'GERM', award: 'PLOP', title: 'Level 1 · The Bleeding Ulcer',
  facts: FACTS, exit: EXIT, escort: { total: RBC_TOTAL, need: RBC_NEED, color: '#e2323a' },
  solid, reset, usePower, update, render, renderBackground: paintBackground, renderTerrain: paintTerrain,
  story: STORY, fly: FLY_ROUTE, flyExtras,
  onStart() { setTimeout(() => fact('hpylori'), 1500); },
  onRelease() { say(heroes[active], 'Here they come!', '#ffb0b0'); fact('ulcer'); },
};
})();
