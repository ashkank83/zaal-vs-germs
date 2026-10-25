'use strict';
// ---------- Level 4 · Snot Storm (inside Dad's nose) ----------
LEVELS[4] = (() => {
const NEU_TOTAL = 10, NEU_NEED = 7, NEU_SPEED = 32, NEU_GAP = 2.2;
const EXIT = { x: 38 * T, y: 14 * T, w: T, h: 4 * T };          // the nostril, behind the nose hairs
const HOME = { x: 34 * T, y: 13 * T, w: 4 * T, h: 5 * T };      // Rhino Rex's lair
const REX = { x: 36.2 * T, y: 18 * T };
const CAP = { x: 6 * T + 12, y: 18 * T };                       // the blood vessel the neutrophils squeeze out of
const NERVE = { x: 37.5 * T, y: 18 * T };                       // the sneeze nerve, just inside the nostril
const LIFT = { x: 24 * T, w: 2 * T, top: 14 * T - 2 };          // bubbling snot gland: floats things up to the turbinate
const CRUST = 5, HAIR = 6, BOGEY = 7, PLUG = 10, RIVER = 11;
const ZONE0 = 19, ZONE1 = 21;                                    // where Annie's bogeys land
const GUST_FIRST = 40, GUST_EVERY = 42, GUST_SPEED = 330;
const NAMES = ['Neutro Nelly', 'Neutro Ned', 'Neutro Nora', 'Neutro Nico', 'Neutro Nadia', 'Neutro Nate',
  'Neutro Nina', 'Neutro Noah', 'Neutro Nell', 'Neutro Nish'];
const SNOT = [['Clear', '#e4f2f2'], ['Cloudy', '#e8ecd8'], ['White', '#f6f2dc'], ['Creamy', '#f0e2a8'],
  ['Yellow', '#e8d454'], ['Yellowy-green', '#c4d444'], ['Green', '#98c438'], ['SUPER GREEN', '#62a62a']];
const BRAIN_LINES = [[18, 'My nose is SO runny. Where are the tissues?'],
  [70, 'I can\'t smell a thing. My dinner tastes of cardboard!'],
  [125, 'Could somebody make me a honey and lemon, please?'],
  [190, 'I\'ve used about a hundred tissues...'],
  [260, 'Are you nearly done down there? My nose is SO stuffy!']];
const BRAIN = {
  sneeze1: 'Ah... ah... CHOO! Oops, sorry down there!',
  sneeze2: 'Ah... CHOO! Bless me! Sorry again!',
  fake: 'Ah... ahh... Oh. It went away. I HATE it when that happens!',
  early: 'Not yet! If I sneeze now, the virus just spreads to everyone!',
  win: 'Ooh. My nose is getting tickly. REALLY tickly...',
};
const REX_OW = ['Ow! Snot fair!', 'Not the green ones!', 'Eww, I\'m all gooey!', 'Stop splatting me!',
  'My lovely cool nose!', 'I\'m turning GREEN!', 'Nooo!'];

// ---------- body facts ----------
const FACTS = {
  rhino: '<b>Rhinovirus</b> gets its name from the Greek word for <b>nose</b>. A rhinoceros is a "nose-horn"!',
  kinds: 'More than <b>200</b> different viruses can cause a cold. Rhinoviruses are the most common: they cause up to <b>half</b> of all colds.',
  types: 'There are more than <b>160</b> kinds of rhinovirus. Beating one kind doesn\'t protect you from the others, so you can catch cold after cold!',
  cool: 'Rhinoviruses grow best at about <b>33 to 35 degrees Celsius</b>. That\'s a bit cooler than the inside of your body, and just right for a nose full of cool air.',
  antibiotics: '<b>Antibiotics don\'t work on colds.</b> They only kill bacteria, and a cold is caused by a virus.',
  swallow: 'Your nose makes snot all day long, even when you\'re well. Most of it slides down the back of your throat, and you <b>swallow it</b> without noticing!',
  cilia: 'Your nose is lined with millions of tiny hairs called <b>cilia</b> (say "SILLY-uh"). They beat about <b>10 times a second</b> to sweep snot along.',
  turbinate: 'Inside your nose are curly shelves called <b>turbinates</b>. They warm up and wet the air you breathe in.',
  hairs: '<b>Nose hairs</b> catch dust and fluff before they get any further in.',
  bogey: 'A <b>bogey</b> is dried snot, with dust, pollen and germs trapped inside.',
  green: 'Snot goes yellow or green when it\'s full of <b>neutrophils</b>. They\'re packed with a green <b>enzyme</b> that has iron in it.',
  greenOk: 'Green snot doesn\'t mean you need antibiotics. It just means your white blood cells are hard at work!',
  neutrophil: '<b>Neutrophils</b> are the most common white blood cells. Your body makes about <b>100 billion</b> of them every day!',
  lobes: 'A neutrophil\'s nucleus is split into <b>2 to 5 blobs</b>, joined by thin strings. You can see them under a microscope.',
  squeeze: 'Neutrophils squeeze out of blood vessels through tiny gaps between the cells of the wall.',
  antibody: '<b>Antibodies</b> are Y-shaped. The tips of the Y fit one exact germ, like a key in a lock.',
  clump: 'An antibody has two arms, so it can grab two viruses at once. Lots of antibodies together glue viruses into <b>clumps</b> that can\'t get into cells.',
  iga: 'The antibodies in your snot are a special kind called <b>IgA</b>. They usually come in <b>pairs</b>, joined at the tail.',
  sneakIn: 'A rhinovirus gets into a cell by grabbing a special "door handle" on the outside, then sneaking in.',
  sneeze: 'A sneeze can blast a cloud of tiny droplets up to about <b>8 metres</b>. Catch it in a tissue or your elbow!',
  reflex: 'Sneezing is a <b>reflex</b>: your body does it all by itself. A nerve feels the tickle in your nose, and your <b>brainstem</b> fires off the sneeze.',
  photic: 'About <b>1 in 4</b> people sneeze when they step out into bright sunshine! It\'s called the photic sneeze reflex.',
  stuffy: 'A blocked nose isn\'t just snot. The blood vessels inside your nose <b>swell up</b> and squash the airway.',
  saline: '<b>Saline</b> is just salty water. A saline spray softens crusty snot so you can blow it out.',
  smell: 'With a blocked nose, food tastes boring. That\'s because most of the flavour of food comes from your sense of <b>smell</b>!',
  week: 'Most colds get better on their own in about <b>7 to 10 days</b>, once your immune system wins.',
  hands: 'Cold viruses can survive on hands and door handles for <b>hours</b>. Washing your hands with soap is one of the best ways to stop colds spreading.',
};

Object.assign(GLOSS, {
  'common cold': ['', 'An illness caused by a virus. It gives you a runny nose, sneezes and sometimes a sore throat.'],
  rhinovirus: ['RY-noh-VY-rus', 'The virus that causes most colds. "Rhino" means nose.'],
  nostril: ['NOS-tril', 'One of the two holes in your nose.'],
  snot: ['', 'The mucus in your nose. It traps dust and germs.'],
  cilia: ['SILLY-uh', 'Tiny hairs on the cells lining your nose. They wave to sweep snot along.'],
  turbinate: ['TUR-bin-ut', 'A curly shelf inside your nose that warms and wets the air.'],
  neutrophil: ['NEW-troh-fil', 'The most common white blood cell. It rushes to fight germs, and its green enzyme turns snot green.'],
  antibody: ['AN-tee-bod-ee', 'A Y-shaped protein that grabs on to one exact germ.'],
  saline: ['SAY-line', 'Salty water. Saline nose spray softens crusty snot.'],
  'trigeminal nerve': ['try-JEM-in-ul', 'A big nerve in your face. It feels tickles in your nose and starts off sneezes.'],
  bogey: ['BOH-gee', 'A bit of dried snot.'],
  enzyme: ['EN-zime', 'A protein that makes a chemical job happen much faster.'],
  brainstem: ['', 'The bottom part of your brain. It runs things you don\'t think about, like breathing and sneezing.'],
  reflex: ['REE-flex', 'Something your body does all by itself, without you deciding to.'],
});
Object.assign(ORGANS, { nose: [200, 114] });

// ---------- level ----------
let rexHP, rexDead, rexGone, rexHit, puffT, meltQ, meltAcc, meltWall, wallOpen, domeOpen;
let nameI, brainI, oops, gust, gulps, clumps, firstBubble, riverShut, sneezeAt;
let brainTimer = 0, tops = [];
const fin = {};
const fx = f => { if (!muted && actx) f(); };
// A synth sneeze: 'ah' is the breath in, 'choo' the blast.
function achoo(part) {
  fx(() => {
    if (part === 'ah') { tone(260, .6, 'sine', .07, 560); hiss(.6, .05, 1800); }
    else { hiss(.7, .38, 2600); hiss(.5, .28, 700); tone(190, .35, 'sawtooth', .08, 80); }
  });
}
// Tiles: 1 swollen nose lining (roof and walls), 9 nose floor, 4 turbinate shelf, 5 crusty dried bogey,
// 6 nose hairs in the nostril, 7 virus bogey (pushable), 10 bogey plugging the river, 11 runny snot river.
// Columns 1-2 are the back of the throat.
function buildGrid() {
  const g = [];
  for (let y = 0; y < ROWS; y++) g.push(new Array(COLS).fill(0));
  for (let x = 0; x < COLS; x++) { for (let y = 0; y < 3; y++) g[y][x] = 1; for (let y = 18; y < ROWS; y++) g[y][x] = 9; }
  for (let y = 0; y < ROWS; y++) { g[y][0] = 1; g[y][COLS - 1] = 1; }
  for (let y = 18; y < ROWS; y++) { g[y][1] = 0; g[y][2] = 0; }                  // down the throat
  for (let y = 3; y < 18; y++) { g[y][17] = CRUST; g[y][18] = CRUST; }           // crusty bogey wall
  g[18][22] = RIVER; g[18][23] = RIVER;                                           // runny snot river
  for (let x = 26; x <= 32; x++) for (let y = 14; y < 18; y++) g[y][x] = 4;      // the turbinate shelf
  for (let y = 3; y < 14; y++) g[y][33] = CRUST;                                 // crust round Rex's lair
  g[16][33] = 4; g[17][33] = 4;                                                   // a step down into the lair
  for (let y = 14; y < 18; y++) g[y][38] = HAIR;                                 // nose hairs in the nostril
  return g;
}
const solid = t => t === 1 || t === 4 || t === 9 || t === CRUST || t === HAIR || t === BOGEY || t === PLUG;
function tileAt(x, y) {
  const c = Math.floor(x / T), r = Math.floor(y / T);
  return r >= 0 && r < ROWS && c >= 0 && c < COLS ? grid[r][c] : 0;
}
function virus(c, r, range = 1.4) {
  return Object.assign(makeGerm(c, r), { w: 14, h: 14, y: (r + 1) * T - 14 - .01, speed: 16 + Math.random() * 8, range: range * T });
}
function reset() {
  grid = buildGrid();
  rexHP = NEU_NEED; rexDead = false; rexGone = 0; rexHit = 0; puffT = 15;
  meltQ = []; meltAcc = 0; meltWall = ''; wallOpen = domeOpen = false;
  nameI = 0; brainI = 0; oops = 0; gulps = 0; clumps = 0; firstBubble = true; riverShut = false; sneezeAt = 0;
  gust = { x: -1, next: GUST_FIRST, warned: false, fake: false, id: 0, n: 0, real: 0 };
  heroes = [
    makeHero('zaal', 'Zaal', 9, 16, 30, 150, 575, 'Super-jump · E at crusty bogey: saline spray'),
    makeHero('gob', 'Gobbler', 11, 30, 26, 95, 405, 'E next to a virus to swallow it'),
    makeHero('annie', 'Annie', 13, 20, 26, 115, 420, 'E near a virus: glue it into a bogey'),
  ];
  for (const h of heroes) Object.assign(h, { cpX: h.x, cpY: h.y });
  germs = [virus(19, 17, .4), virus(20.5, 17, .4), virus(29, 13)];
  clearTimeout(brainTimer);
  document.getElementById('brainSays').textContent = '';
}
// Dad's brain chats from upstairs.
function brainSay(text) {
  const el = document.getElementById('brainSays');
  el.textContent = text;
  clearTimeout(brainTimer);
  brainTimer = setTimeout(() => { el.textContent = ''; }, 6000);
  speak('Brain says: ' + text);
}

// ---------- powers ----------
function crustAhead(h) {
  const fr = Math.floor((h.y + h.h - 2) / T);
  for (const r of [fr, fr - 1]) for (const d of [4, 16]) {
    const c = Math.floor((h.facing > 0 ? h.x + h.w + d : h.x - d) / T);
    if (grid[r] && grid[r][c] === CRUST) return [r, c];
  }
  return null;
}
// Annie's glue turns a virus into a sticky bogey block. In the zone by the river it lands on the floor;
// anywhere else the clump is too small to matter, and the cilia sweep it off to the throat.
function clumpVirus(h, v) {
  clumps++;
  const home = clamp(Math.floor(cx(v) / T), ZONE0, ZONE1);
  const inZone = cx(v) > (ZONE0 - 1) * T && cx(v) < (ZONE1 + 3) * T && v.y + v.h > 17.5 * T && v.y + v.h < 19.5 * T;
  const free = [home, home - 1, home + 1, home - 2, home + 2].filter(c => c >= ZONE0 && c <= ZONE1 && grid[17][c] === 0);
  for (let i = 0; i < 14; i++) goo(cx(v), cy(v), pick(['rgba(150,200,60,.9)', 'rgba(242,193,74,.9)']));
  sfx('slime');
  if (!inZone || !free.length) {
    v.state = 'swept'; v.t = 0;
    say(v, 'Clumped! The cilia sweep it off to the throat. GULP!', '#e8f5b0');
    return fact('clump');
  }
  const c = free[0];
  v.state = 'gone';
  germs = germs.filter(g => g !== v);
  grid[17][c] = BOGEY;
  const tile = { x: c * T, y: 17 * T, w: T, h: T };
  for (const e of [...heroes, ...walkers]) if (overlap(e, tile)) e.y = 17 * T - e.h - .01;
  renderTerrain();
  say(h, pick(['Sticky! Now push it!', 'One virus bogey, coming up!', 'Glued! Push it in the river!']), '#ffe9a0');
  fact(clumps === 1 ? 'antibody' : clumps === 2 ? 'clump' : 'iga');
}
// Bogeys slide one tile when a hero walks into them, and a row of them slides together.
// A bogey that slides over the river drops in and plugs it.
function tryPush(h) {
  if (!h.onGround || !h.vx) { h.pushT = 0; return; }
  const dir = Math.sign(h.vx), fr = Math.floor((h.y + h.h - 2) / T);
  const ac = Math.floor((dir > 0 ? h.x + h.w + 2 : h.x - 2) / T);
  const isBogey = c => grid[fr] && grid[fr][c] === BOGEY;
  if (!isBogey(ac)) { h.pushT = 0; return; }
  const row = [];
  for (let c = ac; isBogey(c); c += dir) row.push(c);
  const tc = row[row.length - 1] + dir;
  if (tc < ZONE0 || tc > 23 || grid[fr][tc] !== 0 || row.some(c => solid(grid[fr - 1][c]))) { h.pushT = 0; return; }
  h.vx = 0; h.pushT = (h.pushT || 0) + STEP;
  if (h.pushT < .2) return;
  h.pushT = 0;
  for (const c of row.slice().reverse()) {          // front bogey first
    grid[fr][c] = 0;
    const to = c + dir;
    let r = fr;
    while (r + 1 < ROWS && grid[r + 1][to] === 0) r++;
    if (grid[r + 1] && grid[r + 1][to] === RIVER) {
      grid[r + 1][to] = PLUG; sfx('plop'); say(h, 'SPLODGE! Plugged the river!', '#d7ef6a');
      for (let i = 0; i < 12; i++) goo(to * T + 12, (r + 1) * T, 'rgba(160,210,70,.9)');
      fact('bogey');
    } else grid[r][to] = BOGEY;
  }
  renderTerrain(); sfx('push');
  if (!grid[18].includes(RIVER) && !riverShut) { riverShut = true; sfx('cheer'); setTimeout(() => fact('swallow'), 6000); }
}
function usePower(h) {
  if (h.id === 'zaal') {
    if (Math.hypot(NERVE.x - cx(h), NERVE.y - (h.y + h.h)) < 40) {
      if (!rexDead) { say(h, 'Not yet! Beat Rhino Rex first.', '#ffd88a'); return brainSay(BRAIN.early); }
      if (sneezeAt) return;
      return openMath('SNEEZE NERVE! Solve it to tickle the nerve:', () => {
        sneezeAt = gameTime; sfx('zap'); achoo('ah');
        say(h, 'Tickle tickle tickle!', '#fff2a0');
      }, () => say(h, 'Ah... ah... nope. Tickle it again!', '#ffb0b0'));
    }
    if (meltQ.length) return say(h, 'Still fizzing! Wait a moment...', '#cfefff');
    const at = crustAhead(h);
    if (!at) {
      if (gapCells(h, t => t === RIVER).cells.length) return say(h, 'Annie can make bogeys to plug the river!', '#ffd88a');
      return say(h, nearestGerm(h) ? 'A virus! Gobbler can eat it.' : 'No crusty bogey here! Find a crusty wall.');
    }
    openMath('SALINE SPRAY! Solve it to soften the crusty bogey:', () => {
      startMelt(...at);
      say(h, 'Psssht! Squelch...', '#cfefff'); fact('saline');
      for (let i = 0; i < 14; i++) goo(cx(h) + h.facing * 12, h.y + 12, 'rgba(190,230,255,.9)');
    }, () => say(h, 'Oops! It sprayed up Zaal\'s own nose. Ah-tishoo!', '#ffb0b0'));
  } else if (h.id === 'gob') {
    const best = nearestGerm(h);
    if (!best) {
      if (nearestGerm(h, 46, 'hidden')) return say(h, 'It\'s hiding inside a nose cell! Wait for it to come out.', '#ffd88a');
      return say(h, 'No virus close enough!');
    }
    openMath('GULP TIME! Solve it to swallow the virus:', () => {
      best.state = 'eaten'; best.t = 0; h.eatT = .7; h.eaten++; gulps++; h.facing = cx(best) > cx(h) ? 1 : -1;
      sfx('gulp');
      setTimeout(() => { sfx('burp'); say(h, 'BUUURP! Tastes like snot.', '#e8d0ff'); }, 900);
      fact(['rhino', 'cool', 'types'][Math.min(h.eaten, 3) - 1]);
    }, () => {
      best.state = 'hidden'; best.t = 0; sfx('squelch');
      say(best, 'It sneaked inside a nose cell!', '#ffd88a'); fact('sneakIn');
    });
  } else {
    const v = nearestGerm(h, 50);
    if (!v) {
      if (nearestGerm(h, 50, 'hidden')) return say(h, 'It\'s hiding! Wait for it to come out.', '#ffd88a');
      if (gapCells(h, t => t === RIVER).cells.length) return say(h, 'I need a virus to make a bogey!', '#ffd88a');
      return say(h, 'No virus close enough to grab!');
    }
    openMath('GLUE TIME! Solve it to glue the virus into a bogey:', () => clumpVirus(h, v),
      () => say(h, 'Boing! It bounced off my arms!', '#ffb0b0'));
  }
}
// Saline softens a whole connected lump of crusty bogey, starting where Zaal sprays it.
function startMelt(r, c) {
  const seen = new Set([r * COLS + c]), q = [[r, c]];
  for (let i = 0; i < q.length; i++) {
    const [y, x] = q[i];
    for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ny = y + dy, nx = x + dx, k = ny * COLS + nx;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx] === CRUST && !seen.has(k)) { seen.add(k); q.push([ny, nx]); }
    }
  }
  meltQ = q; meltAcc = 0; meltWall = c < 25 ? 'wall' : 'dome';
  sfx('slime');
}
function updateMelt(dt) {
  if (!meltQ.length) return;
  meltAcc += dt * 26;
  let changed = false;
  while (meltAcc >= 1 && meltQ.length) {
    const [r, c] = meltQ.shift();
    grid[r][c] = 0; meltAcc--; changed = true;
    for (let i = 0; i < 3; i++) goo(c * T + 12, r * T + 12, pick(['rgba(200,210,90,.9)', 'rgba(190,230,255,.8)', 'rgba(150,180,60,.8)']));
  }
  if (Math.random() < .2) fx(() => hiss(.25, .07, 1400));
  if (changed) renderTerrain();
  if (meltQ.length) return;
  if (meltWall === 'wall') { wallOpen = true; fact('hairs'); }
  else {
    domeOpen = true; sfx('bloop');
    floats.push({ x: REX.x, y: 12 * T, text: 'OI! Who washed my lovely crust?!', color: '#bff0ff', life: 2.6 });
    fact('stuffy'); setTimeout(() => fact('kinds'), 9000);
  }
}

// ---------- update ----------
const inLift = e => cx(e) > LIFT.x && cx(e) < LIFT.x + LIFT.w && e.y + e.h > LIFT.top - 30 && e.y + e.h <= 18 * T + 1;
// Snot bubbles rise out of the gland, carrying anything in them up to the turbinate. Returns true while floating.
function liftUp(e, speed) {
  if (!inLift(e)) { e.inLift = false; return false; }
  if (!e.inLift) {
    e.inLift = true;
    if (heroes.includes(e)) { say(e, pick(['Bloop!', 'Bubble ride!', 'Wheee!', 'Snotty!']), '#d8f5b0'); sfx('bloop'); }
    if (firstBubble) { firstBubble = false; fact('turbinate'); }
  }
  e.vy = e.y + e.h > LIFT.top ? Math.min(e.vy, -speed) : Math.min(e.vy, 0);
  return true;
}
function heroAfter(h) {
  if (tileAt(cx(h), h.y + h.h - 3) === RIVER) {
    sfx('squelch');
    Object.assign(h, { x: h.cpX, y: h.cpY, vx: 0, vy: 0, knockT: 0 });
    return say(h, 'Slipped in the snot river! Back you go...', '#d8f5b0');
  }
  if (h.y > H) {
    for (let k = 0; k < 14; k++) goo(cx(h), H - 20, 'rgba(200,230,160,.9)');
    sfx('gulp');
    Object.assign(h, { x: h.cpX, y: h.cpY, vx: 0, vy: 0, knockT: 0 });
    return say(h, 'GULP! Swallowed! Patch spat you back up...', '#ffe0c8');
  }
  if (h.onGround && h.knockT <= 0 && !inLift(h) && solid(tileAt(cx(h), h.y + h.h + 2))) { h.cpX = h.x; h.cpY = h.y; }
}
function makeNeutro() {
  const name = NAMES[nameI % NAMES.length];
  return { x: CAP.x - 8, y: CAP.y - 16 - .01, w: 16, h: 16, vx: 0, vy: 0, dir: -1, state: 'walk', t: 0, onGround: true,
    ph: Math.random() * 6, name, kind: nameI++ % 3 };
}
const slotPos = i => [34 * T + 3 + (i % 3) * 15, 18 * T - 17 - Math.floor(i / 3) * 15];
function walkerStep(r, dt) {
  r.ph += dt;
  if (r.state === 'walk') {
    if (!r.named) { r.named = true; say(r, r.name, '#e8dcff'); }
    r.floating = liftUp(r, 85);
    const dir = r.dir;
    walkStep(r, dt, NEU_SPEED);
    if (r.floating && r.hitWall) r.dir = dir;          // hold course while riding a bubble
    if (overlap({ x: cx(r) - 1, y: cy(r) - 1, w: 2, h: 2 }, HOME)) {
      r.state = 'attack'; r.t = 0; r.fx = r.x; r.fy = r.y;
    } else if (r.y > H || tileAt(cx(r), r.y + r.h - 2) === RIVER) {
      r.state = 'splash'; r.t = 0; sfx(r.y > H ? 'gulp' : 'sploosh');
      say(r, r.y > H ? 'GULP! Swallowed!' : 'Swept down the snot river!', '#d8f5b0');
    }
  } else if (r.state === 'attack') {
    r.t += dt;
    const u = Math.min(1, r.t / .5);
    r.x = r.fx + (REX.x - 22 - r.fx) * u; r.y = r.fy + (REX.y - 40 - r.fy) * u - Math.sin(u * Math.PI) * 24;
    if (u >= 1) splatRex(r);
  } else if (r.state === 'home') {
    const [sx, sy] = slotPos(r.slot), k = Math.min(1, dt * 4);
    r.x += (sx - r.x) * k; r.y += (sy - r.y) * k;
  } else {
    // swallowed or swept away: back out of the blood vessel for another go
    r.t += dt;
    if (r.t > .8) {
      r.state = 'gone'; spawned--; oops++;
      floats.push({ x: CAP.x, y: 15.5 * T, text: `${r.name}: back for another go!`, color: '#e8dcff', life: 1.8 });
    }
  }
}
function splatRex(r) {
  r.state = 'home'; r.slot = saved++; sfx('splat'); rexHit = .5;
  say(r, 'SPLAT!', '#d7ef6a');
  for (let i = 0; i < 16; i++) goo(REX.x, REX.y - 36, pick(['#b8e04a', '#8cc43a', '#e4f2a0']));
  if (!rexDead) {
    rexHP = Math.max(0, rexHP - 1);
    floats.push({ x: REX.x, y: REX.y - 96, text: REX_OW[(saved - 1) % REX_OW.length], color: '#bff0ff', life: 1.8 });
  }
  if (saved === 1) fact('neutrophil');
  if (saved === 3) fact('green');
  if (saved === 5) fact('greenOk');
  if (saved >= NEU_NEED && !rexDead) beatRex();
}
function beatRex() {
  rexDead = true; sfx('cheer'); brainSay(BRAIN.win); fact('reflex');
  for (const g of germs) if (g.state === 'alive' || g.state === 'hidden') { g.state = 'swept'; g.t = 0; say(g, 'Bye bye!', '#bff0ff'); }
}
// Hidden viruses sit tight inside a nose cell, then pop out again. Swept ones fade away.
function virusStep(g, dt) {
  if (g.state === 'hidden') {
    g.vx = 0; moveEntity(g, dt, false); g.t += dt;
    if (g.t > 12) { g.state = 'alive'; g.t = 0; say(g, 'Peekaboo! The virus came out!', '#ffd88a'); sfx('bloop'); }
    return true;
  }
  if (g.state === 'swept') { g.t += dt; return g.t < 1; }
  return true;
}
// Until the river is plugged, Rex blows out a fresh virus by the river now and then, so Annie always has one to glue.
function updateRex(dt) {
  if (rexHit > 0) rexHit -= dt;
  if (rexDead) { rexGone = Math.min(1, rexGone + dt * .5); return; }
  if (riverShut) return;
  puffT -= dt;
  if (puffT > 0) return;
  puffT = 15;
  const inZone = g => (g.state === 'alive' || g.state === 'hidden') && cx(g) > (ZONE0 - 1) * T && cx(g) < (ZONE1 + 2) * T && g.y > 16 * T;
  if (germs.some(inZone)) return;
  const v = virus(20, 17, .5);
  germs.push(v);
  for (let i = 0; i < 10; i++) goo(cx(v), cy(v), 'rgba(120,210,220,.8)');
  sfx('bloop'); say(v, 'Rex blew out a new virus!', '#bff0ff');
}
// Every so often Dad nearly sneezes. Sometimes it's a false alarm; sometimes a gust of air whooshes through.
// Heroes only hop, so nobody gets moved off their spot.
function updateGust(dt) {
  if ((rexDead || sneezeAt) && gust.x < 0) return;
  if (gust.x < 0) {
    if (!gust.warned && gameTime > gust.next - 3) { gust.warned = true; gust.fake = gust.n % 3 === 1; achoo('ah'); }
    if (gameTime >= gust.next) {
      gust.n++;
      if (gust.fake) {
        if (gust.n === 2) brainSay(BRAIN.fake);
        floats.push({ x: W / 2, y: 4 * T, text: '...false alarm!', color: '#ffe0c8', life: 2.2 });
        gust.next = gameTime + GUST_EVERY; gust.warned = false;
      } else {
        gust.x = 0; gust.id++; gust.real++; achoo('choo');
        if (gust.real <= 2) brainSay(gust.real === 1 ? BRAIN.sneeze1 : BRAIN.sneeze2);
      }
    }
    return;
  }
  gust.x += GUST_SPEED * dt;
  const reached = e => {
    if (e.gustId === gust.id || Math.abs(cx(e) - gust.x) > 24) return false;
    e.gustId = gust.id;
    return true;
  };
  for (const h of heroes) if (reached(h)) {
    if (h.onGround) h.vy = -220;
    say(h, pick(['Whoa!', 'Bless you!', 'Hold on!', 'Windy!']), '#ffe0c8');
  }
  for (const r of walkers) if (r.state === 'walk' && reached(r)) say(r, 'Bless you!', '#e8dcff');
  if (gust.real === 1 && gust.x > W / 2) fact('sneeze');
  if (gust.real === 2 && gust.x > W / 2) fact('photic');
  if (gust.x > W + 80) { gust.x = -1; gust.next = gameTime + GUST_EVERY; gust.warned = false; }
}
function update(dt) {
  updateHeroes(dt, heroAfter, (h, i) => {
    liftUp(h, 130);
    if (i === active && h.knockT <= 0) tryPush(h);
  });
  if (ended || paused) return;
  updateGerms(dt, virusStep);
  spawnWalkers(dt, NEU_TOTAL, NEU_GAP, makeNeutro);
  for (const r of walkers) walkerStep(r, dt);
  walkers = walkers.filter(r => r.state !== 'gone');
  updateMelt(dt);
  updateRex(dt);
  updateGust(dt);

  // ambience: snot bubbles rising from the gland, and drips from the roof
  if (Math.random() < .25) parts.push({ x: LIFT.x + 8 + Math.random() * (LIFT.w - 16), y: 18 * T - 2, vx: (Math.random() - .5) * 8, vy: -50,
    life: 2.6, max: 2.6, color: 'rgba(210,240,170,.35)', size: 3 + Math.random() * 5, grav: -20, bubble: true });
  if (ceilTiles.length && Math.random() < .06) {
    const [x, y] = pick(ceilTiles);
    parts.push({ x: x * T + 4 + Math.random() * 16, y: (y + 1) * T, vx: 0, vy: 20, life: 3, max: 3,
      color: 'rgba(205,235,180,.75)', size: 2 + Math.random() * 1.5, grav: 420, drip: true });
  }
  updateParticles(dt);

  if (sneezeAt && gameTime - sneezeAt > 1.6) return finish();
  if (!rexDead && brainI < BRAIN_LINES.length && gameTime > BRAIN_LINES[brainI][0]) {
    brainSay(BRAIN_LINES[brainI][1]);
    if (brainI === 1) setTimeout(() => fact('smell'), 4000);
    brainI++;
  }
  for (const [t, k] of [[45, 'antibiotics'], [100, 'cilia'], [160, 'lobes'], [220, 'week']]) if (gameTime > t && !seenFacts.has(k)) { fact(k); break; }
  if (!wallOpen) hint = 'Zaal: press E by the crusty bogey wall.';
  else if (!riverShut) hint = 'Annie: glue a virus into a bogey, then push it in!';
  else if (!released) hint = 'Park a hero by the throat, then press R!';
  else if (!domeOpen) hint = 'Zaal: ride a bubble up and spray Rex\'s crust!';
  else if (!rexDead) hint = 'Lead the neutrophils to Rhino Rex!';
  else hint = 'Zaal: tickle the sneeze nerve by the nostril!';
}
function finish() {
  ended = true; paused = true; hush();
  clearTimeout(brainTimer);
  document.getElementById('brainSays').textContent = '';
  document.getElementById('facts').innerHTML = '';
  flyStart(FINALE, showWin);
}
function showWin() {
  const golden = saved === NEU_TOTAL && oops === 0;
  seenFacts.add('hands');
  showEnd(golden ? 'SNOT-TASTIC!' : 'BLESS YOU!',
    `<b>${saved} of ${NEU_TOTAL}</b> neutrophils splatted Rhino Rex${saved === NEU_TOTAL ? ', every single one!' : '.'}` +
    `${oops ? ` (${oops} got swallowed or swept away and needed another go.)` : ''} Gobbler swallowed ${gulps} virus${gulps === 1 ? '' : 'es'}` +
    ` and Annie glued ${clumps} into bogeys.${gust.real ? ` Dad sneezed on you <b>${gust.real}</b> time${gust.real === 1 ? '' : 's'}!` : ''}` +
    `<br>Final snot colour: <b style="color:${SNOT[Math.min(saved, 7)][1]}">${SNOT[Math.min(saved, 7)][0]}</b>. Dad can breathe through his nose again!`, 'ITCH');
  document.getElementById('btnAgain').textContent = 'Play again';
  drawTips();
}

// ---------- drawing: static layers ----------
function paintBackground(c) {
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#5a1626'); g.addColorStop(.5, '#46101e'); g.addColorStop(1, '#260610');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // the far wall of the nose: swollen pink lining, bumpy with cells, with fat red blood vessels
  for (let j = 0; j < 16; j++) for (let i = 0; i < 34; i++) {
    const x = i * 30 + (j % 2) * 15 + (hash(i, j, 1) - .5) * 8, y = 70 + j * 24 + (hash(i, j, 2) - .5) * 6;
    c.fillStyle = `rgba(${200 + hash(i, j, 3) * 40 | 0},${90 + hash(i, j, 4) * 30 | 0},${110 + hash(i, j, 5) * 20 | 0},.13)`;
    c.beginPath(); c.ellipse(x, y, 13, 10, 0, 0, 7); c.fill();
    if (hash(i, j, 6) < .12) { c.fillStyle = 'rgba(240,250,220,.16)'; c.beginPath(); c.ellipse(x, y - 2, 4, 6, 0, 0, 7); c.fill(); }   // goblet cells full of mucus
  }
  c.lineCap = 'round';
  for (let k = 0; k < 7; k++) {
    let x = hash(k, 9) * W, y = 80 + hash(k, 10) * 300;
    c.strokeStyle = 'rgba(190,30,50,.38)'; c.lineWidth = 5 - k * .4;
    c.beginPath(); c.moveTo(x, y);
    for (let s = 0; s < 8; s++) { x += 30 + hash(k, s) * 30; y += (hash(k, s + 20) - .5) * 50; c.lineTo(x, y); }
    c.stroke();
    c.strokeStyle = 'rgba(255,120,130,.18)'; c.lineWidth = 1.5; c.stroke();
  }
  // the upper turbinates, curling out of the far wall
  for (const [tx, ty, s] of [[260, 140, 1.1], [640, 110, .9]]) {
    c.save(); c.translate(tx, ty); c.scale(s, s);
    c.fillStyle = 'rgba(150,40,64,.3)'; c.strokeStyle = 'rgba(255,170,180,.14)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-150, -20); c.bezierCurveTo(-40, -50, 120, -40, 150, 0); c.bezierCurveTo(165, 30, 110, 50, 80, 30);
    c.bezierCurveTo(50, 12, 70, -6, 95, 4); c.bezierCurveTo(40, 30, -80, 30, -150, 20); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  // daylight coming in through the nostril on the right
  g = c.createRadialGradient(W - 10, 16 * T, 10, W - 10, 16 * T, 380);
  g.addColorStop(0, 'rgba(255,240,200,.45)'); g.addColorStop(.4, 'rgba(255,200,170,.12)'); g.addColorStop(1, 'rgba(255,200,170,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  g = c.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function paintTerrain(c) {
  tops = [];
  const isSolid = (x, y) => x < 0 || x >= COLS || y < 0 || (y < ROWS && solid(grid[y][x]));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = grid[y][x], px = x * T, py = y * T;
    if (t === 1 || t === 9) {
      // swollen nose lining: pink and bumpy, with little red vessels
      c.fillStyle = `hsl(348,${t === 1 ? 46 : 40}%,${(t === 1 ? 40 : 34) + hash(x, y) * 6}%)`; c.fillRect(px, py, T, T);
      c.fillStyle = 'rgba(255,170,180,.18)';
      for (let i = 0; i < 3; i++) circle(c, px + 4 + hash(x, y, i) * 16, py + 4 + hash(x, y, i + 3) * 16, 3 + hash(x, y, i + 6) * 2);
      if (hash(x, y, 9) < .3) {
        c.strokeStyle = 'rgba(170,20,40,.5)'; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(px + 2, py + 6 + hash(x, y, 10) * 12); c.quadraticCurveTo(px + 12, py + hash(x, y, 11) * 24, px + 22, py + 6 + hash(x, y, 12) * 12); c.stroke();
      }
      if (t === 9 && y === 18) tops.push(x);
    } else if (t === 4) {
      // the turbinate: a shelf of bone under the pink lining
      c.fillStyle = `hsl(345,38%,${42 + hash(x, y) * 6}%)`; c.fillRect(px, py, T, T);
      c.fillStyle = 'rgba(240,215,190,.22)'; c.fillRect(px, py + 8, T, 8);
      c.strokeStyle = 'rgba(255,190,200,.25)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(px, py + 8); c.lineTo(px + T, py + 8); c.moveTo(px, py + 16); c.lineTo(px + T, py + 16); c.stroke();
    } else if (t === CRUST) {
      // crusty dried bogey: yellow-green-brown, cracked, with dust stuck in it
      c.fillStyle = `hsl(${62 + hash(x, y) * 14},${34 + hash(x, y, 1) * 10}%,${36 + hash(x, y, 2) * 8}%)`; c.fillRect(px, py, T, T);
      c.fillStyle = 'rgba(220,230,140,.28)';
      for (let i = 0; i < 3; i++) circle(c, px + 4 + hash(x, y, i + 3) * 16, py + 4 + hash(x, y, i + 6) * 16, 3 + hash(x, y, i + 9) * 3);
      c.strokeStyle = 'rgba(40,40,10,.55)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(px + hash(x, y, 12) * T, py); c.lineTo(px + 8 + hash(x, y, 13) * 8, py + 12); c.lineTo(px + hash(x, y, 14) * T, py + T); c.stroke();
      c.fillStyle = 'rgba(30,20,10,.6)';
      for (let i = 0; i < 3; i++) circle(c, px + hash(x, y, i + 20) * T, py + hash(x, y, i + 23) * T, .9);
    } else if (t === BOGEY || t === PLUG) {
      // a sticky green bogey with glued-up viruses poking out
      const plug = t === PLUG, bx = px + T / 2, by = plug ? py + 10 : py + 13;
      c.fillStyle = plug ? '#7ea83a' : '#92c040'; c.strokeStyle = '#3e5a14'; c.lineWidth = 1.5;
      c.beginPath();
      for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2, r = (plug ? 12 : 10.5) + hash(x, y, i) * 2.5; c.lineTo(bx + Math.cos(a) * r * 1.05, by + Math.sin(a) * r * (plug ? .7 : .95)); }
      c.closePath(); c.fill(); c.stroke();
      if (plug) { c.fillStyle = '#7ea83a'; c.fillRect(px, py + 12, T, 12); }
      c.fillStyle = 'rgba(230,255,180,.6)'; c.beginPath(); c.ellipse(bx - 4, by - 4, 4, 2.4, -.5, 0, 7); c.fill();
      for (const [vx, vy] of [[-4, 2], [5, 0]]) {
        c.fillStyle = '#7ad0d8'; circle(c, bx + vx, by + vy, 3.2);
        c.fillStyle = '#fff'; circle(c, bx + vx - 1, by + vy - .5, 1.1); circle(c, bx + vx + 1.2, by + vy - .5, 1.1);
        c.fillStyle = '#012'; circle(c, bx + vx - 1, by + vy - .3, .5); circle(c, bx + vx + 1.2, by + vy - .3, .5);
      }
      if (!plug) { c.fillStyle = '#92c040'; c.beginPath(); c.moveTo(bx + 2, by + 9); c.quadraticCurveTo(bx + 4, by + 16, bx + 6, by + 9); c.fill(); }
      continue;
    } else if (t === RIVER) {
      const g = c.createLinearGradient(0, py, 0, py + T);
      g.addColorStop(0, 'rgba(200,235,190,.85)'); g.addColorStop(1, 'rgba(90,130,70,.95)');
      c.fillStyle = '#2a0a10'; c.fillRect(px, py, T, T);
      c.fillStyle = g; c.fillRect(px, py + 6, T, T - 6);
      continue;
    } else if (t === HAIR) {
      continue;                     // nose hairs are drawn over the top each frame
    } else continue;
    c.fillStyle = 'rgba(25,5,8,.45)';
    if (!isSolid(x - 1, y)) c.fillRect(px, py, 3, T);
    if (!isSolid(x + 1, y)) c.fillRect(px + T - 3, py, 3, T);
    if (!isSolid(x, y + 1) && y < ROWS - 1) { c.fillRect(px, py + T - 3, T, 3); ceilTiles.push([x, y]); }
    if (!isSolid(x, y - 1) && y > 0) {
      c.fillStyle = 'rgba(220,245,200,.45)'; c.fillRect(px, py, T, 3);       // a glistening layer of mucus on top
      if (t !== 9 && t !== CRUST) tops.push(x + y * 100);
    }
  }
  // the blood vessel the neutrophils come out of, running along under the floor
  c.strokeStyle = 'rgba(190,30,40,.85)'; c.lineWidth = 9; c.lineCap = 'round';
  c.beginPath(); c.moveTo(3.4 * T, 20.3 * T); c.lineTo(5.6 * T, 20.3 * T); c.quadraticCurveTo(CAP.x, 20.3 * T, CAP.x, 18.6 * T);
  c.moveTo(CAP.x, 19.4 * T); c.quadraticCurveTo(CAP.x, 20.3 * T, 7.6 * T, 20.3 * T); c.lineTo(39 * T, 20.3 * T); c.stroke();
  c.strokeStyle = 'rgba(255,120,120,.35)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(7.6 * T, 20.1 * T); c.lineTo(39 * T, 20.1 * T); c.stroke();
  // the back of the throat: a dark drop with a dangle of snot
  const g = c.createLinearGradient(0, 18 * T, 0, H);
  g.addColorStop(0, '#2a0810'); g.addColorStop(1, '#070102');
  c.fillStyle = g; c.fillRect(T, 18 * T, 2 * T, 4 * T);
  c.strokeStyle = 'rgba(210,235,180,.5)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(1.2 * T, 18 * T); c.quadraticCurveTo(1.5 * T, 19.5 * T, 1.3 * T, 20.6 * T); c.stroke();
  // the turbinate's curly end
  c.strokeStyle = 'rgba(240,215,190,.45)'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath();
  for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 4.2, r = 2 + i * .55; c.lineTo(27 * T + Math.cos(a) * r, 16 * T + Math.sin(a) * r); }
  c.stroke();
}

// ---------- drawing: characters ----------
// Annie Antibody: a Y with two sticky tips that grab one exact germ.
function drawAnnie(c, x, by, f, t, walking) {
  c.save(); c.translate(x, by); c.scale(f, 1);
  const s = walking ? Math.sin(t * 14) : 0;
  c.fillStyle = '#a8761a'; rr(c, -6 + s * 2, -3, 5, 3, 1.5); c.fill(); rr(c, 1 - s * 2, -3, 5, 3, 1.5); c.fill();
  c.lineCap = 'round';
  c.strokeStyle = '#a8761a'; c.lineWidth = 7.5;
  c.beginPath(); c.moveTo(0, -3); c.lineTo(0, -12); c.stroke();                         // the stem of the Y
  const wave = Math.sin(t * 4) * 1.5;
  for (const side of [-1, 1]) {                                                         // the two arms
    const ex = side * 9, ey = -23 + (side > 0 ? wave : -wave);
    c.strokeStyle = '#a8761a'; c.lineWidth = 6.5; c.beginPath(); c.moveTo(0, -12); c.lineTo(ex, ey); c.stroke();
    c.strokeStyle = '#f2c14a'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(0, -12); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = `rgba(160,220,80,${.75 + Math.sin(t * 6 + side) * .2})`; circle(c, ex, ey, 3.6);   // sticky tips
    c.fillStyle = 'rgba(255,255,220,.7)'; circle(c, ex - 1, ey - 1, 1.1);
  }
  c.strokeStyle = '#f2c14a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -3); c.lineTo(0, -12); c.stroke();
  const g = c.createRadialGradient(-2, -14, 1, 0, -12, 8);
  g.addColorStop(0, '#fff2c0'); g.addColorStop(1, '#e8a830');
  c.fillStyle = g; c.strokeStyle = '#8a5a10'; c.lineWidth = 1.2;
  c.beginPath(); c.arc(0, -12, 6.5, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#fff'; circle(c, 1.5, -13.5, 2.2); circle(c, 5, -13.2, 1.9);
  c.fillStyle = '#2a1a00'; circle(c, 2.1, -13.3, 1.1); circle(c, 5.5, -13, 1);
  c.strokeStyle = '#6a3a00'; c.lineWidth = .9; c.beginPath(); c.arc(3, -10, 1.8, .2, Math.PI - .2); c.stroke();
  c.fillStyle = 'rgba(255,120,120,.5)'; circle(c, -2, -10.5, 1.4);
  c.restore();
}
const NCOL = [['#f0e6f6', '#7a4aa0'], ['#f6eaee', '#8a4a80'], ['#e8eaf8', '#5a4aa8']];
// A neutrophil: a wobbly blob with a nucleus in 3 lumps and green granules inside.
function drawNeutro(c, x, y, dir, t, state, kind = 0, alpha = 1) {
  c.save(); c.translate(x, y); c.globalAlpha = alpha;
  const bob = state === 'walk' ? -Math.abs(Math.sin(t * 10)) * 1.2 : 0;
  c.translate(0, bob);
  c.fillStyle = NCOL[kind][0]; c.strokeStyle = NCOL[kind][1]; c.lineWidth = 1;
  c.beginPath();
  for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2, r = 8 + Math.sin(t * 6 + i * 2.1) * .7; c.lineTo(Math.cos(a) * r, Math.sin(a) * r * .95); }
  c.closePath(); c.fill(); c.stroke();
  c.fillStyle = 'rgba(130,190,50,.85)';
  for (let i = 0; i < 7; i++) circle(c, -5 + hash(i, kind, 31) * 10, -5 + hash(i, kind, 32) * 10, .8);
  c.fillStyle = NCOL[kind][1]; c.strokeStyle = NCOL[kind][1]; c.lineWidth = .8;
  c.beginPath(); c.moveTo(-3.6, 3); c.lineTo(3.6, 3); c.stroke();
  circle(c, -3.8, 3.2, 2.1); circle(c, 0, 4.4, 2.1); circle(c, 3.8, 3.2, 2.1);
  c.fillStyle = '#fff'; circle(c, 1.4 * dir, -2.6, 1.9); circle(c, 4.6 * dir, -2.4, 1.7);
  c.fillStyle = '#000'; circle(c, 1.9 * dir, -2.5, .9); circle(c, 5.1 * dir, -2.3, .85);
  c.strokeStyle = '#3a1a5a'; c.lineWidth = .9;
  c.beginPath(); c.arc(3 * dir, -.2, 1.5, .2, Math.PI - .2); c.stroke();
  c.restore();
}
// A rhinovirus: a little 20-sided ball with a tiny rhino horn.
function drawVirus(c, x, y, t, s = 1, alpha = 1) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5) * .15); c.scale(s, s); c.globalAlpha = alpha;
  const R = 7, pts = Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * R, Math.sin(i * Math.PI / 3 + Math.PI / 6) * R]);
  c.fillStyle = '#efe6d0'; c.strokeStyle = '#6a5a3a'; c.lineWidth = .9;                  // the horn
  c.beginPath(); c.moveTo(1, -5.5); c.quadraticCurveTo(4, -10, 2.5, -13); c.quadraticCurveTo(5.5, -9, 5.5, -4.5); c.closePath(); c.fill(); c.stroke();
  const g = c.createLinearGradient(0, -R, 0, R);
  g.addColorStop(0, '#9ce8f0'); g.addColorStop(1, '#2a8a9a');
  c.fillStyle = g; c.strokeStyle = '#0a3a4a'; c.lineWidth = 1.3;
  c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(10,60,80,.5)'; c.lineWidth = .8;
  c.beginPath(); c.moveTo(pts[0][0] * .45, pts[0][1] * .45);
  [2, 4, 0].forEach(i => c.lineTo(pts[i][0] * .45, pts[i][1] * .45));
  for (let i = 0; i < 6; i++) { c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i - i % 2][0] * .45, pts[i - i % 2][1] * .45); }
  c.stroke();
  c.fillStyle = '#fff'; circle(c, -2.4, -1, 1.7); circle(c, 2.4, -1, 1.7);
  c.fillStyle = '#012'; circle(c, -2.1, -.8, .85); circle(c, 2.7, -.8, .85);
  c.strokeStyle = '#012'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(-4, -3.4); c.lineTo(-1, -2.4); c.moveTo(4, -3.4); c.lineTo(1, -2.4); c.stroke();
  c.beginPath(); c.arc(0, 3.4, 1.6, Math.PI + .3, -.3); c.stroke();
  c.restore();
}
// A virus hiding inside a nose cell: just a pair of eyes peeking out.
function drawHidden(c, x, y, t) {
  c.fillStyle = 'rgba(230,130,150,.78)'; c.strokeStyle = 'rgba(120,40,60,.9)'; c.lineWidth = 1.2;
  c.beginPath(); c.ellipse(x, y, 11 + Math.sin(t * 2) * .6, 9, 0, 0, 7); c.fill(); c.stroke();
  drawVirus(c, x, y, t, .7, .35);
  const look = Math.sin(t * 1.3) * 2;
  c.fillStyle = '#fff'; circle(c, x - 2 + look, y - 1, 1.6); circle(c, x + 2 + look, y - 1, 1.6);
  c.fillStyle = '#012'; circle(c, x - 2 + look, y - 1, .8); circle(c, x + 2 + look, y - 1, .8);
}
// Rhino Rex, the boss: a giant rhinovirus with a horn, a stripy scarf (he loves a cool nose) and a crown.
// green (0-1) is how splatted with green neutrophil goo he is.
function drawRex(c, x, by, s, t, hit, green = 0, alpha = 1) {
  if (s <= .01) return;
  c.save(); c.translate(x + (hit > 0 ? Math.sin(t * 60) * 2 : 0), by); c.scale(s, s); c.globalAlpha = alpha;
  const cy0 = -40, R = 36, wob = Math.sin(t * 2) * 1.5;
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, -2, 34, 6, 0, 0, 7); c.fill();
  // the big horn, then the body on top of its root
  c.fillStyle = '#f2ead2'; c.strokeStyle = '#6a5a3a'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(6, cy0 - 26); c.quadraticCurveTo(26, cy0 - 50, 18, cy0 - 74 + wob); c.quadraticCurveTo(40, cy0 - 50, 34, cy0 - 18); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-14, cy0 - 30); c.quadraticCurveTo(-8, cy0 - 46, -12, cy0 - 56); c.quadraticCurveTo(0, cy0 - 44, 0, cy0 - 30); c.closePath(); c.fill(); c.stroke();
  const pts = Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * R, cy0 + Math.sin(i * Math.PI / 3 + Math.PI / 6) * R]);
  const g = c.createLinearGradient(0, cy0 - R, 0, cy0 + R);
  g.addColorStop(0, '#a8eef4'); g.addColorStop(1, '#1e7a8a');
  c.fillStyle = g; c.strokeStyle = '#0a3040'; c.lineWidth = 2.4;
  c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(10,60,80,.45)'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(pts[0][0] * .45, cy0 + (pts[0][1] - cy0) * .45);
  [2, 4, 0].forEach(i => c.lineTo(pts[i][0] * .45, cy0 + (pts[i][1] - cy0) * .45));
  for (let i = 0; i < 6; i++) { c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i - i % 2][0] * .45, cy0 + (pts[i - i % 2][1] - cy0) * .45); }
  c.stroke();
  // green goo splats from the neutrophils
  for (let i = 0; i < Math.round(green * 9); i++) {
    const sx = -24 + hash(i, 81) * 48, sy = cy0 - 26 + hash(i, 82) * 50, r = 4 + hash(i, 83) * 4;
    c.fillStyle = 'rgba(140,200,50,.9)'; circle(c, sx, sy, r);
    c.beginPath(); c.moveTo(sx - 2, sy); c.quadraticCurveTo(sx, sy + r + 7, sx + 2, sy); c.fill();
  }
  // crown
  c.fillStyle = '#f2c933'; c.strokeStyle = '#8a6410'; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(-26, cy0 - 26); c.lineTo(-28, cy0 - 40); c.lineTo(-21, cy0 - 33); c.lineTo(-16, cy0 - 44); c.lineTo(-11, cy0 - 33); c.lineTo(-5, cy0 - 39); c.lineTo(-6, cy0 - 27); c.closePath();
  c.fill(); c.stroke();
  c.fillStyle = '#e8303c'; circle(c, -16, cy0 - 33, 1.8);
  // face
  c.fillStyle = '#fff'; circle(c, -10, cy0 - 4, 6); circle(c, 10, cy0 - 4, 6);
  if (hit > 0) {
    c.strokeStyle = '#012'; c.lineWidth = 2;
    for (const ex of [-10, 10]) { c.beginPath(); c.moveTo(ex - 3.5, cy0 - 7.5); c.lineTo(ex + 3.5, cy0 - .5); c.moveTo(ex + 3.5, cy0 - 7.5); c.lineTo(ex - 3.5, cy0 - .5); c.stroke(); }
    c.fillStyle = '#3a0c10'; c.beginPath(); c.ellipse(0, cy0 + 14, 6, 7, 0, 0, 7); c.fill();
  } else {
    c.fillStyle = '#012'; circle(c, -9, cy0 - 3, 2.8); circle(c, 11, cy0 - 3, 2.8);
    c.strokeStyle = '#012'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(-18, cy0 - 15); c.lineTo(-5, cy0 - 10); c.moveTo(18, cy0 - 15); c.lineTo(5, cy0 - 10); c.stroke();
    c.lineWidth = 2.2; c.beginPath(); c.moveTo(-9, cy0 + 13); c.quadraticCurveTo(0, cy0 + 18, 10, cy0 + 11); c.stroke();
    c.fillStyle = '#fff'; c.fillRect(4, cy0 + 12, 4, 4);                                  // one smug tooth
  }
  // stripy scarf
  c.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    c.strokeStyle = i % 2 ? '#fff' : '#d8303c'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(-30 + i * 10, cy0 + 28); c.lineTo(-20 + i * 10, cy0 + 29); c.stroke();
  }
  c.strokeStyle = '#d8303c'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(22, cy0 + 30); c.quadraticCurveTo(30 + Math.sin(t * 3) * 3, cy0 + 40, 26, cy0 + 50); c.stroke();
  c.restore();
}
function drawSpray(c, x, y) {
  c.fillStyle = '#f4f8fc'; rr(c, x - 3, y - 4, 6, 9, 1.5); c.fill();
  c.fillStyle = '#4aa8e0'; c.fillRect(x - 3, y - 1, 6, 2.5);
  c.fillStyle = '#4aa8e0'; c.fillRect(x - 1.5, y - 8, 3, 4);
}

// ---------- drawing: set pieces ----------
function drawLift(c) {
  const g = c.createLinearGradient(0, LIFT.top - 30, 0, 18 * T);
  g.addColorStop(0, 'rgba(200,240,160,0)'); g.addColorStop(1, `rgba(200,240,160,${.2 + Math.sin(anim * 3) * .05})`);
  c.fillStyle = g; c.fillRect(LIFT.x, LIFT.top - 30, LIFT.w, 18 * T - LIFT.top + 30);
  c.fillStyle = '#20300c'; c.beginPath(); c.ellipse(LIFT.x + LIFT.w / 2, 18 * T + 3, LIFT.w / 2 - 3, 5, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(190,230,120,.8)'; c.beginPath(); c.ellipse(LIFT.x + LIFT.w / 2, 18 * T + 1, LIFT.w / 2 - 6, 3, 0, 0, 7); c.fill();
  c.fillStyle = '#e4ffc0'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('SNOT BUBBLES', LIFT.x + LIFT.w / 2, LIFT.top - 52);
  c.fillText('ride one up!', LIFT.x + LIFT.w / 2, LIFT.top - 40);
}
// Cilia waving along every top surface, all beating towards the throat.
function drawCilia(c) {
  c.strokeStyle = 'rgba(255,200,210,.5)'; c.lineWidth = 1;
  c.beginPath();
  for (const k of tops) {
    const x = k % 100, y = Math.floor(k / 100) || 18, px = x * T, py = y * T;
    if (solid(grid[y - 1][x])) continue;
    for (let i = 0; i < 5; i++) {
      const bx = px + 2 + i * 5, sway = Math.sin(anim * 9 + bx * .08) * 3;
      c.moveTo(bx, py); c.quadraticCurveTo(bx - 1, py - 3, bx - 2 + sway, py - 5);
    }
  }
  for (const [x, y] of ceilTiles) {
    if (y !== 2) continue;
    const py = (y + 1) * T;
    for (let i = 0; i < 5; i++) {
      const bx = x * T + 2 + i * 5, sway = Math.sin(anim * 9 + bx * .08) * 3;
      c.moveTo(bx, py); c.quadraticCurveTo(bx - 1, py + 3, bx - 2 + sway, py + 5);
    }
  }
  c.stroke();
}
// Strands of snot hanging from the roof, stretching and swinging.
const STRANDS = [5, 9, 14, 21, 29, 35];
function drawStrands(c) {
  for (const [i, x] of STRANDS.entries()) {
    const len = 22 + Math.sin(anim * .8 + i * 2) * 10 + hash(i, 5) * 20, sw = Math.sin(anim * 1.4 + i) * 5, px = x * T + 12;
    c.strokeStyle = 'rgba(210,240,190,.55)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(px - 4, 3 * T); c.quadraticCurveTo(px + sw, 3 * T + len * .6, px + sw * 1.4, 3 * T + len); c.stroke();
    c.fillStyle = 'rgba(210,240,190,.7)'; circle(c, px + sw * 1.4, 3 * T + len + 2, 3.5);
  }
}
function drawRiver(c) {
  for (let x = 22; x <= 23; x++) {
    if (grid[18][x] !== RIVER) continue;
    c.strokeStyle = 'rgba(240,255,220,.55)'; c.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
      const off = (anim * 18 + i * 12) % T;
      c.beginPath(); c.moveTo(x * T + T - off, 18 * T + 9 + i * 6); c.lineTo(x * T + T - off - 6, 18 * T + 10 + i * 6); c.stroke();
    }
  }
}
function drawHairs(c) {
  const x0 = 38 * T;
  const g = c.createLinearGradient(x0 - 30, 0, x0 + T, 0);
  g.addColorStop(0, 'rgba(255,245,210,0)'); g.addColorStop(1, 'rgba(255,245,210,.65)');
  c.fillStyle = g; c.fillRect(x0 - 30, 14 * T, 30 + T, 4 * T);
  c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const bx = x0 + 2 + hash(i, 91) * 20, base = i % 2 ? 18 * T : 14 * T, dir = i % 2 ? -1 : 1, sw = Math.sin(anim * 1.2 + i) * 2;
    c.strokeStyle = '#3a2214'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(bx, base); c.quadraticCurveTo(bx - 10 + sw, base + dir * 30, bx - 16 + sw, base + dir * (40 + hash(i, 92) * 18)); c.stroke();
  }
  c.fillStyle = '#fff6d8'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('NOSE', x0 + 12, 13 * T - 18); c.fillText('HAIRS', x0 + 12, 13 * T - 8);
}
function drawNerve(c) {
  if (!domeOpen) return;
  const p = rexDead ? .6 + Math.sin(anim * 8) * .4 : .35;
  c.strokeStyle = `rgba(255,230,120,${p})`; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(NERVE.x, 18 * T + 2); c.bezierCurveTo(NERVE.x - 10, 19 * T, NERVE.x + 6, 20 * T, NERVE.x - 4, 21.5 * T); c.stroke();
  c.fillStyle = `rgba(255,240,150,${p})`; circle(c, NERVE.x, 18 * T, 5);
  if (rexDead) {
    c.fillStyle = Math.sin(anim * 8) > 0 ? '#fff2a0' : '#ffb84a'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
    c.fillText('SNEEZE', NERVE.x - 8, 18 * T - 40); c.fillText('NERVE ⬇', NERVE.x - 8, 18 * T - 29);
  }
}
function drawCapillary(c) {
  const left = NEU_TOTAL - spawned;
  c.strokeStyle = 'rgba(200,40,50,.95)'; c.lineWidth = 7;
  c.beginPath(); c.ellipse(CAP.x, CAP.y, 10, 6, 0, Math.PI, 0); c.stroke();
  for (let i = 0; i < Math.min(left, 3); i++) {
    const peek = released ? 0 : Math.max(0, Math.sin(anim * 1.5 + i * 2)) * 3;
    drawNeutro(c, CAP.x - 6 + i * 6, CAP.y + 4 - peek, -1, anim + i, 'wait', i % 3, .75);
  }
  c.strokeStyle = 'rgba(200,40,50,.95)'; c.lineWidth = 7;
  c.beginPath(); c.moveTo(CAP.x - 10, CAP.y + 1); c.lineTo(CAP.x + 10, CAP.y + 1); c.stroke();
  c.fillStyle = '#ffd0d0'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('BLOOD VESSEL', CAP.x + 8, CAP.y - 22);
  if (!released) {
    c.fillStyle = '#e8dcff'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'left';
    c.fillText(`${left} neutrophils waiting · press R to call them`, CAP.x + 40, CAP.y - 74);
  }
}
function drawLabels(c) {
  c.fillStyle = '#ffe0c8'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('THROAT', 2 * T, 18 * T - 96); c.fillText('gulp! ⬇', 2 * T, 18 * T - 85);
  c.fillStyle = '#e4ffc0';
  if (!wallOpen) { c.fillText('CRUSTY', 18 * T, 10 * T); c.fillText('BOGEY', 18 * T, 10 * T + 11); }
  if (!riverShut) c.fillText('SNOT RIVER', 23 * T, 18 * T - 30 + Math.sin(anim * 4) * 2);
}
function drawFog(c) {
  if (domeOpen) return;
  c.fillStyle = 'rgba(140,150,70,.86)'; c.fillRect(34 * T, 3 * T, 4 * T, 15 * T);
  c.fillStyle = 'rgba(90,100,30,.5)';
  for (let i = 0; i < 18; i++) circle(c, 34 * T + hash(i, 41) * 4 * T, 3 * T + hash(i, 42) * 15 * T, 3 + hash(i, 43) * 6);
  c.fillStyle = '#2a3008'; c.font = 'bold 22px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('? ? ?', 36 * T, 8 * T + Math.sin(anim * 2) * 3);
  c.font = 'bold 10px Trebuchet MS'; c.fillText('someone is', 36 * T, 9.3 * T); c.fillText('snoring in here...', 36 * T, 9.9 * T);
  c.fillText('Zzz', 36.6 * T + Math.sin(anim) * 6, 11.4 * T - (anim * 10) % 20);
}
function drawGust(c) {
  if (gust.x < 0) return;
  const x = gust.x;
  c.strokeStyle = 'rgba(240,250,255,.5)'; c.lineWidth = 3; c.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const y = 3.5 * T + i * 1.6 * T + Math.sin(anim * 6 + i) * 6, len = 60 + hash(i, 7) * 80;
    c.beginPath(); c.moveTo(x - len, y); c.quadraticCurveTo(x - len / 2, y - 6, x, y); c.stroke();
  }
  c.fillStyle = 'rgba(220,245,200,.8)';
  for (let i = 0; i < 16; i++) circle(c, x - hash(i, 3) * 120, 3.4 * T + hash(i, 4) * 14 * T, 1.5 + hash(i, 5) * 2.5);
  c.save(); c.translate(x - 40, 5 * T); c.rotate(-.08);
  c.font = 'bold 30px Trebuchet MS'; c.textAlign = 'center'; c.lineJoin = 'round';
  c.strokeStyle = '#2b070c'; c.lineWidth = 5; c.strokeText('AH-CHOO!', 0, 0);
  c.fillStyle = '#fff6d8'; c.fillText('AH-CHOO!', 0, 0);
  c.restore();
}

// ---------- drawing: frame ----------
function render(c) {
  c.save();
  if (sneezeAt) { const k = Math.min(1, (gameTime - sneezeAt) / 1.6) * 6; c.translate((Math.random() - .5) * k, (Math.random() - .5) * k); }
  c.drawImage(bgCanvas, 0, 0);
  drawStrands(c);
  drawLift(c);
  c.drawImage(terrCanvas, 0, 0);
  drawCilia(c);
  drawRiver(c);
  drawCapillary(c);
  drawLabels(c);
  drawRex(c, REX.x, REX.y, rexDead ? .4 * (1 - rexGone) : .4 + .6 * rexHP / NEU_NEED, anim, rexHit, saved / NEU_NEED);
  drawNerve(c);
  for (const g of germs) {
    if (g.state === 'hidden') drawHidden(c, cx(g), cy(g), anim + g.phase);
    else drawVirus(c, cx(g), cy(g), anim + g.phase, g.state === 'eaten' ? Math.max(.1, 1 - g.t / .6) : 1, g.state === 'swept' ? Math.max(0, 1 - g.t) : 1);
  }
  drawFog(c);
  drawHairs(c);
  for (const r of walkers) drawNeutro(c, cx(r), cy(r), r.state === 'home' ? 1 : r.dir, r.ph, r.state, r.kind,
    r.state === 'splash' ? Math.max(0, 1 - r.t) : 1);
  drawHeroes(c, (c, h, x, by, walking) => drawAnnie(c, x, by, h.facing, anim, walking));
  const z = heroes[0];
  drawSpray(c, cx(z) + z.facing * 7, z.y + 17);
  for (const p of parts) if (p.bubble) { c.globalAlpha = clamp(p.life / p.max * 1.5, 0, 1); c.strokeStyle = 'rgba(230,255,200,.6)'; c.lineWidth = 1; c.beginPath(); c.arc(p.x, p.y, p.size, 0, 7); c.stroke(); }
  c.globalAlpha = 1;
  drawParts(c);
  drawGust(c);
  if (sneezeAt) {
    c.save(); c.translate(W / 2, 7 * T); c.rotate(-.06);
    const u = Math.min(1, (gameTime - sneezeAt) / 1.6);
    c.font = `bold ${30 + u * 30 | 0}px Trebuchet MS`; c.textAlign = 'center'; c.lineJoin = 'round';
    c.strokeStyle = '#2b070c'; c.lineWidth = 6; c.strokeText(u < .5 ? 'Ah...' : 'Ah... AHHH...', 0, 0);
    c.fillStyle = '#fff6d8'; c.fillText(u < .5 ? 'Ah...' : 'Ah... AHHH...', 0, 0);
    c.restore();
  }
  c.restore();
  drawFloats(c);
  hudTop(c, 'Neutrophils:', saved, 0, 'arrived');
  c.textAlign = 'right';
  if (gust.warned && gust.x < 0 && !rexDead) {
    c.fillStyle = Math.sin(anim * 8) > 0 ? '#ffe0c8' : '#ff9a7a';
    c.fillText('Ah... ahh... (a sneeze is coming!)', W - 8, 12.5);
  } else {
    const [name, col] = SNOT[Math.min(saved, 7)];
    c.fillStyle = '#f3e6d8'; c.fillText(`Snot colour: ${name}`, W - 26, 12.5);
    c.fillStyle = col; c.beginPath(); c.ellipse(W - 14, 12, 7, 6, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(W - 17, 15); c.quadraticCurveTo(W - 15, 23, W - 12, 15); c.fill();
  }
  hudBottom(c);
}

// ---------- end: how to beat a cold ----------
function drawTips() {
  const cv = document.getElementById('endArt'), c = cv.getContext('2d');
  const TIPS = [['🛌', 'Rest', 'and keep cosy'], ['🍯', 'Lots of drinks', 'water, honey and lemon'],
    ['🛡️', 'Immune system', 'wins in about a week'], ['💊', 'Antibiotics', 'don\'t work on colds']];
  cv.hidden = false; c.clearRect(0, 0, cv.width, cv.height);
  c.textAlign = 'center'; c.font = 'bold 12px Trebuchet MS'; c.fillStyle = '#ffd88a';
  c.fillText('HOW TO BEAT A COLD', 320, 14);
  TIPS.forEach(([icon, name, sub], i) => {
    const x = 84 + i * 157;
    c.fillStyle = i === 2 ? 'rgba(199,224,79,.18)' : 'rgba(255,255,255,.06)'; rr(c, x - 72, 22, 144, 124, 10); c.fill();
    if (i === 2) { c.strokeStyle = '#c7e04f'; c.lineWidth = 2; c.stroke(); }
    c.fillStyle = '#fff'; c.font = '38px Trebuchet MS'; c.fillText(icon, x, 76);
    if (i === 3) { c.strokeStyle = '#e8303c'; c.lineWidth = 5; c.beginPath(); c.arc(x, 63, 26, 0, 7); c.moveTo(x - 18, 45); c.lineTo(x + 18, 81); c.stroke(); }
    c.fillStyle = '#f3e6d8'; c.font = 'bold 13px Trebuchet MS'; c.fillText(name, x, 106);
    c.fillStyle = '#e8c9c0'; c.font = '11px Trebuchet MS'; c.fillText(sub, x, 122);
    if (i === 2) { c.fillStyle = '#d7ef6a'; c.font = 'bold 11px Trebuchet MS'; c.fillText('★ YOU DID THIS! ★', x, 139); }
  });
}

// ---------- cut-scene helpers ----------
function cue(name, t, at, play) { if (t >= at && !fin.cues.has(name)) { fin.cues.add(name); play(); } }
const freshCues = () => { fin.cues = new Set(); };
function bubble(c, x, y, text, size = 16) {
  c.font = `bold ${size}px Trebuchet MS`;
  const w = c.measureText(text).width + 22, h = size + 16, top = y - h - 12;
  c.fillStyle = '#fff'; c.strokeStyle = '#2b070c'; c.lineWidth = 2.5;
  rr(c, x - w / 2, top, w, h, 12); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(x - 7, top + h - 1); c.lineTo(x, y); c.lineTo(x + 7, top + h - 1); c.fill();
  c.beginPath(); c.moveTo(x - 7, top + h); c.lineTo(x, y); c.lineTo(x + 7, top + h); c.stroke();
  c.fillStyle = '#2b070c'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, x, top + h / 2 + 1); c.textBaseline = 'alphabetic';
}
function boom(c, x, y, text, size, fill, rot = -.12) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.font = `bold ${size}px Trebuchet MS`; c.textAlign = 'center'; c.lineJoin = 'round';
  c.strokeStyle = '#2b070c'; c.lineWidth = size / 6; c.strokeText(text, 0, 0);
  c.fillStyle = fill; c.fillText(text, 0, 0);
  c.restore();
}
// The shrink-ship, big, for the cut-scenes.
function drawShip(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * 5) * .08);
  c.fillStyle = 'rgba(120,230,255,.25)';
  for (let i = 1; i < 6; i++) circle(c, 9 + i * 5, Math.sin(t * 8 + i) * 1.5, 3 - i * .4);
  c.shadowColor = '#7fe6ff'; c.shadowBlur = 14;
  c.fillStyle = '#e8fbff'; c.beginPath(); c.ellipse(0, 0, 12, 6, 0, 0, 7); c.fill();
  c.shadowBlur = 0; c.fillStyle = '#2b9fd6'; c.beginPath(); c.ellipse(-3, -1.5, 5, 3.2, 0, 0, 7); c.fill();
  c.fillStyle = '#fff'; circle(c, -4.5, -2.5, 1.2);
  c.restore();
}
// The inside of a nostril tunnel, glowing with daylight at the far end.
function drawTunnel(c, t, shake = 0) {
  c.fillStyle = '#4a0f1c'; c.fillRect(0, 0, W, H);
  const ox = 120 + Math.sin(t * 13) * shake, oy = 250 + Math.cos(t * 11) * shake;
  for (let i = 8; i >= 1; i--) {
    const r = i * 70;
    c.fillStyle = i % 2 ? '#a83a52' : '#902e44';
    c.beginPath(); c.ellipse(ox + i * 40, oy, r * 1.3, r * .85, 0, 0, 7); c.fill();
  }
  const g = c.createRadialGradient(ox, oy, 4, ox, oy, 90);
  g.addColorStop(0, '#fff6d8'); g.addColorStop(1, 'rgba(255,220,180,0)');
  c.fillStyle = g; c.beginPath(); c.arc(ox, oy, 90, 0, 7); c.fill();
}
function drawHairJungle(c, t) {
  c.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const bx = 60 + i * 70 + hash(i, 1) * 30, top = i % 2 === 0, base = top ? -10 : H + 10, dir = top ? 1 : -1;
    const len = 180 + hash(i, 2) * 120, sw = Math.sin(t * 1.3 + i) * 10;
    c.strokeStyle = '#2a160c'; c.lineWidth = 12 + hash(i, 3) * 8;
    c.beginPath(); c.moveTo(bx, base); c.quadraticCurveTo(bx + 40 + sw, base + dir * len * .6, bx + 70 + sw * 2, base + dir * len); c.stroke();
    c.strokeStyle = 'rgba(255,220,180,.18)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(bx - 3, base); c.quadraticCurveTo(bx + 37 + sw, base + dir * len * .6, bx + 67 + sw * 2, base + dir * len); c.stroke();
  }
}
function drawBogeyBlob(c, x, y, r, t) {
  c.fillStyle = '#86b83a'; c.strokeStyle = '#3e5a14'; c.lineWidth = 3;
  c.beginPath();
  for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI * 2, rr2 = r * (1 + Math.sin(i * 3 + t * 2) * .08 + hash(i, 7) * .15); c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * .85); }
  c.closePath(); c.fill(); c.stroke();
  c.fillStyle = 'rgba(230,255,180,.55)'; c.beginPath(); c.ellipse(x - r * .35, y - r * .35, r * .3, r * .15, -.5, 0, 7); c.fill();
  c.fillStyle = 'rgba(60,40,20,.5)'; for (let i = 0; i < 6; i++) circle(c, x + (hash(i, 8) - .5) * r * 1.2, y + (hash(i, 9) - .5) * r, 2 + hash(i, 10) * 2);
}
// Dad's face, front on. ah runs 0 (normal) to 1 (just about to sneeze); choo shows the blast face.
function drawDad(c, x, y, s, t, ah = 0, choo = false) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(choo ? .12 : -ah * .18);
  c.fillStyle = '#e4b090'; c.strokeStyle = '#8a5a3a'; c.lineWidth = 3;
  c.beginPath(); c.ellipse(-92, 10, 16, 26, 0, 0, 7); c.fill(); c.stroke();                 // ears
  c.beginPath(); c.ellipse(92, 10, 16, 26, 0, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(0, 0, 90, 110, 0, 0, 7); c.fill(); c.stroke();                   // face
  c.fillStyle = '#3a2418';                                                                  // messy hair
  c.beginPath(); c.moveTo(-88, -30);
  for (let i = 0; i <= 10; i++) c.lineTo(-88 + i * 17.6, -96 - (i % 2 ? 26 : 0) - Math.sin(i) * 6);
  c.lineTo(88, -30); c.quadraticCurveTo(0, -80, -88, -30); c.fill();
  // eyes: watery, squeezing shut as the sneeze builds
  for (const ex of [-34, 34]) {
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, -18, 18, Math.max(1.5, 13 * (1 - ah)), 0, 0, 7); c.fill();
    c.strokeStyle = '#5a3a2a'; c.lineWidth = 2.5; c.stroke();
    if (ah < .8 && !choo) { c.fillStyle = '#3a2a1a'; circle(c, ex, -16, 6 * (1 - ah * .6)); }
    else { c.strokeStyle = '#3a2418'; c.lineWidth = 4; c.beginPath(); c.moveTo(ex - 16, -24); c.lineTo(ex + 14, -16); c.moveTo(ex - 16, -10); c.lineTo(ex + 14, -16); c.stroke(); }
    c.strokeStyle = '#3a2418'; c.lineWidth = 6;                                             // eyebrows, rising
    c.beginPath(); c.moveTo(ex - 18, -42 - ah * 14); c.lineTo(ex + 18, -44 - ah * 10); c.stroke();
  }
  c.fillStyle = 'rgba(160,220,255,.8)'; c.beginPath(); c.ellipse(-46, -2, 3, 6, 0, 0, 7); c.fill();   // a watery tear
  // big red cold nose, nostrils flaring
  const g = c.createRadialGradient(-6, 6, 4, 0, 14, 34);
  g.addColorStop(0, '#ff9a8a'); g.addColorStop(1, '#d8404a');
  c.fillStyle = g; c.strokeStyle = '#8a2a2a'; c.lineWidth = 3;
  c.beginPath(); c.ellipse(0, 18 + ah * 4, 30 + ah * 6, 28, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#5a1418';
  c.beginPath(); c.ellipse(-12, 32 + ah * 4, 7 + ah * 5, 5 + ah * 3, .3, 0, 7); c.fill();
  c.beginPath(); c.ellipse(12, 32 + ah * 4, 7 + ah * 5, 5 + ah * 3, -.3, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-10, 6, 8, 4, -.4, 0, 7); c.fill();
  if (!choo) {                                                                              // a drip, wobbling
    const d = 10 + Math.sin(t * 3) * 4;
    c.fillStyle = 'rgba(200,235,170,.9)'; c.beginPath(); c.moveTo(8, 36); c.quadraticCurveTo(14, 36 + d, 12, 40 + d); c.quadraticCurveTo(6, 40 + d, 10, 36); c.fill();
    circle(c, 12, 42 + d, 5);
  }
  // mouth
  c.fillStyle = '#5a1418'; c.strokeStyle = '#5a1418'; c.lineWidth = 4;
  if (choo) { c.beginPath(); c.ellipse(0, 72, 30, 22, 0, 0, 7); c.fill(); }
  else if (ah > .3) { c.beginPath(); c.ellipse(0, 72, 14 + ah * 8, 6 + ah * 14, 0, 0, 7); c.fill(); }
  else { c.beginPath(); c.arc(0, 62, 18, .3, Math.PI - .3); c.stroke(); }
  c.fillStyle = 'rgba(255,120,120,.35)'; circle(c, -56, 30, 14); circle(c, 56, 30, 14);
  c.restore();
}
function drawTissue(c, x, y, w, h, t) {
  c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(x, y + h * .55, w * .55, 18, 0, 0, 7); c.fill();
  c.fillStyle = '#fbfbff'; c.strokeStyle = '#b8c0d0'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x - w / 2, y);
  for (let i = 0; i <= 8; i++) c.lineTo(x - w / 2 + i * w / 8, y - 14 - (i % 2 ? 18 : 0) + Math.sin(t * 2 + i) * 3);
  c.lineTo(x + w / 2, y); c.quadraticCurveTo(x + w / 2 + 10, y + h * .4, x + w * .3, y + h * .5);
  c.lineTo(x - w * .3, y + h * .5); c.quadraticCurveTo(x - w / 2 - 10, y + h * .4, x - w / 2, y); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(160,170,190,.5)'; c.lineWidth = 2;
  for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(x - w / 2 + i * w / 4, y - 20); c.quadraticCurveTo(x - w / 2 + i * w / 4 + 10, y + h * .2, x - w / 2 + i * w / 4 - 6, y + h * .45); c.stroke(); }
}
function drawTeam(c, x, y, s, t, hop = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  drawZaal(c, -40, -Math.abs(Math.sin(t * 6)) * hop, 1, anim, false);
  drawGobbler(c, 2, -Math.abs(Math.sin(t * 6 + 1)) * hop, 1, anim, 0, 3);
  drawAnnie(c, 40, -Math.abs(Math.sin(t * 6 + 2)) * hop, -1, anim, false);
  c.restore();
}
// A tumbling thing flying out on the sneeze: u runs 0 to 1 along its path.
function flung(c, u, x0, y0, x1, y1, spin, draw) {
  const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 60;
  c.save(); c.translate(x, y); c.rotate(u * spin); draw(c); c.restore();
}

// ---------- finale: green snot, the sneeze nerve, AH-CHOO, into a tissue ----------
const FINALE = [
  { dur: 3.2, onShow: freshCues,
    text: 'SPLAT! SPLAT! SPLAT! The neutrophils pile on to Rhino Rex. They\'re packed with a green enzyme, so the snot turns GREEN!',
    draw(c, t) {
      c.drawImage(bgCanvas, 0, 0);
      const k = clamp(t / 2.6, 0, 1);
      c.fillStyle = `rgba(${200 - k * 90 | 0},${230 - k * 30 | 0},${200 - k * 150 | 0},${.25 + k * .35})`; c.fillRect(0, 0, W, H);
      drawRex(c, 480, 420, 2.4, anim, Math.sin(t * 9) > .3 ? 1 : 0, k);
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2 + t * 1.4, r = 230 - k * 70;
        c.save(); c.translate(480 + Math.cos(a) * r, 300 + Math.sin(a) * r * .55); c.scale(2.6, 2.6);
        drawNeutro(c, 0, 0, Math.cos(a) > 0 ? -1 : 1, t * 3 + i, 'home', i % 3); c.restore();
      }
      c.textAlign = 'center';                                                    // the snot colour chart, filling up
      SNOT.forEach(([name, col], i) => {
        const on = i <= k * 7.99, x = 165 + i * 90;
        c.globalAlpha = on ? 1 : .25; c.fillStyle = col; rr(c, x - 42, 58, 84, 28, 8); c.fill();
        c.fillStyle = '#2b070c'; c.font = 'bold 11px Trebuchet MS'; c.fillText(name, x, 77);
      });
      c.globalAlpha = 1;
      if (t > 1.2) bubble(c, 680, 170, 'Not the green ones!', 20);
      for (const [at, x, y] of [[.4, 300, 220], [1, 660, 260], [1.7, 380, 330], [2.3, 580, 200]]) {
        if (t > at && t < at + .7) boom(c, x, y, 'SPLAT!', 34, '#b8e04a');
        cue('s' + at, t, at, () => sfx('splat'));
      }
    } },
  { dur: 3.2, onShow: freshCues,
    text: 'Rex is beaten, but the nose is full of virus goo. Time to blast it all out! Zaal tickles the sneeze nerve, and the message zooms up to Dad\'s brainstem...',
    draw(c, t) {
      c.fillStyle = '#20101c'; c.fillRect(0, 0, W, H);
      // Dad's head from the side, with the brain and the nerve path drawn in
      c.fillStyle = '#c8907a'; c.strokeStyle = '#6a3a2a'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(250, 470); c.bezierCurveTo(240, 380, 220, 300, 300, 200); c.bezierCurveTo(360, 110, 560, 80, 650, 160);
      c.bezierCurveTo(720, 220, 720, 300, 700, 330); c.lineTo(745, 380); c.lineTo(705, 395); c.quadraticCurveTo(715, 420, 700, 440); c.lineTo(690, 470); c.fill(); c.stroke();
      c.fillStyle = '#e8a6b4'; c.beginPath(); c.ellipse(470, 210, 150, 90, -.1, 0, 7); c.fill();        // brain
      c.strokeStyle = 'rgba(150,60,90,.6)'; c.lineWidth = 3;
      for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(360 + i * 30, 150 + (i % 2) * 12); c.quadraticCurveTo(375 + i * 30, 210, 355 + i * 30, 270); c.stroke(); }
      c.fillStyle = '#c8708a'; c.beginPath(); c.ellipse(420, 320, 26, 50, .2, 0, 7); c.fill();          // brainstem
      c.fillStyle = '#fff'; c.font = 'bold 14px Trebuchet MS'; c.textAlign = 'center'; c.fillText('BRAINSTEM', 420, 395);
      // the trigeminal nerve, from inside the nose back to the brainstem
      const path = [[715, 360], [640, 330], [560, 300], [480, 300], [432, 320]];
      c.strokeStyle = 'rgba(255,230,120,.6)'; c.lineWidth = 5; c.beginPath(); path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      const u = clamp(t / 1.6, 0, 1), [sx, sy] = alongPath(path, u);
      c.shadowColor = '#fff2a0'; c.shadowBlur = 20; c.fillStyle = '#fff6c0'; circle(c, sx, sy, 10); c.shadowBlur = 0;
      boom(c, 800, 300, 'tickle tickle!', 22, '#fff2a0', .05);
      if (t > 1.6) {
        const on = Math.sin(t * 16) > 0;
        c.fillStyle = on ? '#ff4a3a' : '#ffd84a'; circle(c, 420, 320, 22);
        boom(c, 300, 110, 'SNEEZE!!!', 64, on ? '#ff6a4a' : '#ffe36b');
        cue('alarm', t, 1.6, () => { sfx('zap'); fx(() => [0, .2, .4].forEach(d => tone(880, .12, 'square', .06, null, d))); });
      }
    } },
  { dur: 3.4, onShow: freshCues,
    text: 'Ah... ahh... AHHHH...',
    draw(c, t) {
      const ah = clamp(t / 3, 0, 1), sh = ah * ah * 10;
      c.fillStyle = '#f2e6d0'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#d8c4a4'; c.fillRect(0, 400, W, H - 400);
      c.save(); c.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
      drawDad(c, 480, 250, 1.5, t, ah);
      c.restore();
      const n = 1 + Math.floor(ah * 5);
      boom(c, 190, 120 + Math.sin(t * 9) * 3, 'A' + 'H'.repeat(n) + '...', 28 + ah * 34, '#fff6d8', -.15);
      cue('a1', t, .1, () => achoo('ah')); cue('a2', t, 1.3, () => achoo('ah')); cue('a3', t, 2.4, () => achoo('ah'));
      if (t > 2.6) bubble(c, 790, 140, 'Here it comes...', 18);
    } },
  { dur: 2.8, onShow: freshCues,
    text: 'CHOOOOOO! Out shoot the viruses, the bogeys, Rhino Rex... and our heroes too! Wheeeee!',
    draw(c, t) {
      c.fillStyle = '#f2e6d0'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#d8c4a4'; c.fillRect(0, 400, W, H - 400);
      const u = clamp(t / 2.2, 0, 1);
      c.save(); c.translate((Math.random() - .5) * 12 * (1 - u), (Math.random() - .5) * 12 * (1 - u));
      drawDad(c, 150, 240, 1.15, t, 1, true);
      c.restore();
      c.fillStyle = 'rgba(220,245,200,.35)';                                    // the spray cone
      c.beginPath(); c.moveTo(190, 270); c.lineTo(980, 40); c.lineTo(980, 520); c.closePath(); c.fill();
      for (let i = 0; i < 70; i++) {
        const v = (hash(i, 11) * .7 + .3) * u, a = (hash(i, 12) - .5) * .9;
        c.fillStyle = hash(i, 13) < .3 ? 'rgba(150,200,60,.9)' : 'rgba(220,245,210,.85)';
        circle(c, 190 + Math.cos(a) * v * 900, 270 + Math.sin(a) * v * 900, 2 + hash(i, 14) * 5);
      }
      flung(c, u, 200, 270, 860, 120, 9, c => { c.scale(1.4, 1.4); drawRex(c, 0, 40, 1, anim, 1, 1); });
      flung(c, clamp(u * 1.1, 0, 1), 200, 270, 780, 330, 12, c => { c.scale(2.4, 2.4); drawZaal(c, 0, 15, 1, anim, false); });
      flung(c, clamp(u * 1.05, 0, 1), 200, 270, 700, 230, -10, c => { c.scale(2.2, 2.2); drawGobbler(c, 0, 12, 1, anim, 0, 3); });
      flung(c, clamp(u * 1.15, 0, 1), 200, 270, 860, 420, 14, c => { c.scale(2.4, 2.4); drawAnnie(c, 0, 13, 1, anim, false); });
      for (let i = 0; i < 6; i++) flung(c, clamp(u * (.8 + hash(i, 15) * .5), 0, 1), 200, 270, 500 + hash(i, 16) * 460, 40 + hash(i, 17) * 440, 8,
        c => { if (i % 2) drawBogeyBlob(c, 0, 0, 16, t); else { c.scale(2.2, 2.2); drawVirus(c, 0, 0, anim); } });
      boom(c, 560, 110, 'CHOOOOO!', 84, '#ffe36b', -.08);
      if (u > .4) { c.fillStyle = '#2b070c'; c.font = 'bold 22px Trebuchet MS'; c.textAlign = 'center'; c.fillText('WHEEEEE!', 760, 300); }
      if (t < .15) { c.fillStyle = `rgba(255,255,255,${1 - t / .15})`; c.fillRect(0, 0, W, H); }
      cue('choo', t, 0, () => { achoo('choo'); setTimeout(() => sfx('splat'), 200); });
    } },
  { dur: 3.6, onShow: freshCues,
    text: 'SPLAT! Everyone lands in a tissue. Rhino Rex is stuck in a giant green bogey. "Ewww! Snot fair!" Bless you, Dad!',
    draw(c, t) {
      c.fillStyle = '#dfeaf2'; c.fillRect(0, 0, W, H);
      const land = clamp(t / .5, 0, 1);
      drawTissue(c, 480, 300, 680, 220, t);
      c.save(); c.translate(0, -300 * (1 - land));
      drawBogeyBlob(c, 640, 300, 70, t);
      drawRex(c, 640, 330, .9, anim, 1, 1);
      c.fillStyle = 'rgba(134,184,58,.85)'; c.beginPath(); c.ellipse(640, 330, 72, 26, 0, 0, 7); c.fill();   // stuck fast
      drawTeam(c, 330, 300, 2.4, t, land >= 1 ? 30 : 0);
      c.restore();
      if (t > .6) bubble(c, 650, 200, 'Ewww! Snot fair!', 20);
      if (t > 1.4) bubble(c, 300, 170, 'Bless you, Dad!', 22);
      if (t > .5 && t < 1.1) boom(c, 480, 110, 'SPLAT!', 56, '#b8e04a');
      cue('land', t, .5, () => sfx('splat'));
      cue('cheer', t, 1.4, () => sfx('cheer'));
    } },
  { dur: 3.8, onShow: freshCues,
    text: 'Remember: catch it, bin it, kill it! Sneeze into a tissue, put it in the bin, then wash your hands with soap.',
    draw(c, t) {
      c.fillStyle = '#e8f4f6'; c.fillRect(0, 0, W, H);
      c.save(); c.translate(0, -70);
      // catch it: a tissue
      drawTissue(c, 170, 230, 200, 110, t);
      // bin it: a scrunched tissue (with Rex inside) arcing into the bin
      c.fillStyle = '#6a7a84'; c.strokeStyle = '#3a4a54'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(420, 190); c.lineTo(540, 190); c.lineTo(525, 340); c.lineTo(435, 340); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#4a5a64'; rr(c, 410, 175, 140, 18, 6); c.fill();
      const u = clamp((t % 2.2) / 1.2, 0, 1);
      if (u < 1) {
        const bx = 300 + u * 180, by = 200 - Math.sin(u * Math.PI) * 90 + u * 10;
        c.fillStyle = '#fbfbff'; c.strokeStyle = '#b8c0d0'; c.lineWidth = 2; circle(c, bx, by, 22); c.stroke();
        c.fillStyle = '#86b83a'; circle(c, bx + 6, by - 4, 8);
        c.fillStyle = '#2b070c'; c.font = 'bold 12px Trebuchet MS'; c.textAlign = 'center'; c.fillText('Nooo!', bx, by - 30);
      }
      // kill it: soap and bubbles
      c.fillStyle = '#f2a0c0'; c.strokeStyle = '#a05070'; c.lineWidth = 3; rr(c, 720, 210, 120, 70, 24); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.6)'; rr(c, 735, 220, 60, 14, 7); c.fill();
      for (let i = 0; i < 9; i++) {
        const by = 200 - ((t * 40 + i * 30) % 160), bx = 700 + hash(i, 21) * 160 + Math.sin(t * 2 + i) * 8;
        c.strokeStyle = 'rgba(120,170,220,.7)'; c.lineWidth = 2; c.beginPath(); c.arc(bx, by, 6 + hash(i, 22) * 10, 0, 7); c.stroke();
      }
      c.fillStyle = '#2b3a40'; c.font = 'bold 30px Trebuchet MS'; c.textAlign = 'center';
      c.fillText('CATCH IT', 170, 420); c.fillText('BIN IT', 480, 420); c.fillText('KILL IT', 780, 420);
      c.font = '16px Trebuchet MS';
      c.fillText('sneeze into a tissue', 170, 446); c.fillText('straight in the bin', 480, 446); c.fillText('wash hands with soap', 780, 446);
      c.restore();
    } },
];

// ---------- story ----------
Object.assign(IMG, {
  annie: portrait(c => drawAnnie(c, 32, 50, 1, 0, false)),
  neutro: portrait(c => { c.translate(32, 36); c.scale(2.2, 2.2); drawNeutro(c, 0, 0, 1, 0, 'home', 0); }),
  rhino: portrait(c => { c.translate(32, 40); c.scale(2.3, 2.3); drawVirus(c, 0, 0, 0); }),
  rex: portrait(c => drawRex(c, 32, 62, .5, 0, 0, 0)),
  spray: portrait(c => {
    c.fillStyle = '#f4f8fc'; rr(c, 23, 26, 18, 30, 4); c.fill();
    c.fillStyle = '#4aa8e0'; c.fillRect(23, 34, 18, 10); c.fillRect(29, 14, 6, 12);
    c.fillStyle = '#fff'; c.font = 'bold 5px Trebuchet MS'; c.textAlign = 'center'; c.fillText('SALINE', 32, 41);
  }),
});
const STORY = [
  `<h1>ZAAL vs GERMS</h1><h2>Level 4 · Snot Storm</h2>
   <div class="pics"><img src="${IMG.zaal}"><img src="${IMG.rex}"><img src="${IMG.rhino}"></div>
   <p>This time the patient is... <b>Dad</b>! He's got a stinking ${Wd('common cold')}. His nose is red, runny and stuffed up, and he's sneezed 47 times since breakfast.</p>
   <p>Zaal jumps into his shrink-ship and flies... straight up Dad's nose. (Yes, really. Hold your breath!)</p>
   <p class="tip nospeak">Tap any <span class="w" data-w="snot">underlined word</span> to find out what it means.</p>`,
  `<h2>What is a cold?</h2>
   <div class="pics"><img src="${IMG.rhino}"></div>
   <p>A cold is caused by a ${Wd('virus')}. The most common one is the ${Wd('rhinovirus')} <span class="pron">(say "RY-noh-VY-rus")</span>. "Rhino" means nose, just like a rhinoceros is a "nose-horn"!</p>
   <p>Cold viruses fly out in sneezes and coughs, and they sit on hands and door handles. Then someone touches their nose or eyes... and the virus moves in.</p>
   <p>${Wd('antibiotic', 'Antibiotics')} can't help. They only kill bacteria, and a virus isn't a bacterium. So it's up to the ${Wd('immune system')}!</p>`,
  `<h2>Inside the nose</h2>
   <div class="pics"><img src="${IMG.rex}"></div>
   <p>Your nose is a cave full of ${Wd('snot')}. Snot is sticky ${Wd('mucus')} that traps dust and germs. Tiny hairs called ${Wd('cilia')} <span class="pron">(say "SILLY-uh")</span> sweep it to the back of your throat, and you swallow it. Every day!</p>
   <p>Curly shelves called ${Wd('turbinate', 'turbinates')} warm the air. Dried-up snot goes crusty: that's a ${Wd('bogey')}!</p>
   <p>The rhinovirus loves a nose, because it's a bit cooler than the rest of you. The boss of this cold, <b>Rhino Rex</b>, has moved in with his scarf on, and he's not leaving!</p>`,
  `<h2>How do you beat a cold?</h2>
   <div class="pics"><img src="${IMG.neutro}"><img src="${IMG.annie}"></div>
   <p>${Wd('white blood cell', 'White blood cells')} called ${Wd('neutrophil', 'neutrophils')} <span class="pron">(say "NEW-troh-fils")</span> rush in from the blood. They're packed with a green ${Wd('enzyme')}, so when lots of them arrive, snot turns <b>yellow</b>, then <b>green</b>!</p>
   <p>${Wd('antibody', 'Antibodies')} grab the viruses and glue them into clumps. And then... a big ${Wd('reflex')} blasts the whole lot out. Can you guess what it is?</p>
   <p>Our plan: wash away the crust, call the neutrophils, splat Rhino Rex... and then <b>the biggest sneeze ever</b>!</p>`,
  `<h2>Meet your team</h2>
   <div class="team">
     <div class="card"><img src="${IMG.zaal}"><b>1 · Zaal</b><span>The explorer. He can <b>super-jump</b>, and his ${Wd('saline')} spray <b>softens crusty bogeys</b>. At the end he tickles the <b>sneeze nerve</b>!</span></div>
     <div class="card"><img src="${IMG.gob}"><b>2 · Gobbler</b><span>Our hungry ${Wd('macrophage')}. He <b>swallows viruses</b>. But if one sneaks inside a nose cell, he can't reach it!</span></div>
     <div class="card"><img src="${IMG.annie}"><b>3 · Annie</b><span>New! Annie ${Wd('antibody', 'Antibody')} is shaped like a Y with two sticky arms. She <b>glues a virus into a bogey</b> that anyone can <b>push</b>.</span></div>
   </div>
   <p class="tip">Langer is still guarding Zaal's hand, and Goblet says the snot in here is "very good work".</p>`,
  `<h2>Your mission</h2>
   <ul>
     <li>Get at least <b>7 of the 10</b> ${Wd('neutrophil', 'neutrophils')} to <b>Rhino Rex</b>. Then Zaal tickles the <b>sneeze nerve</b> by the ${Wd('nostril')}.</li>
     <li>Zaal's spray softens <b>crusty bogey</b> walls. Annie glues viruses into <b>bogeys</b>: push them into the <b>snot river</b> to plug it.</li>
     <li>Press <kbd class="nospeak">R</kbd> to call the neutrophils out of the ${Wd('blood vessel')}. They come out walking <b>left</b>, towards the <b>throat</b>! A hero standing still turns them around.</li>
     <li>If one gets swallowed, it comes back for another go. No rush!</li>
     <li><b>Snot bubbles</b> float you up. And watch out: Dad keeps nearly sneezing...</li>
   </ul>
   <p class="keys" style="text-align:center"><span class="nospeak"><kbd>←</kbd> <kbd>→</kbd> move · <kbd>Space</kbd> jump · <kbd>E</kbd> use power ·
     <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> or <kbd>Tab</kbd> switch hero · <kbd>R</kbd> call neutrophils</span></p>`,
];
const FLY = [
  { cam: [200, 420, 1], path: [[430, 130], [300, 96]], labels: [],
    text: 'This time, the patient is... DAD! He has a stinking cold. AH-CHOO!' },
  { cam: [200, 108, 4.5], path: [[300, 96], [236, 112]], labels: ['nose'],
    text: 'Look at that nose: red, runny and stuffed up. He\'s sneezed 47 times since breakfast!' },
  { cam: [205, 119, 26], path: [[236, 112], [205, 120]], labels: [], fade: 'rgba(74,15,28,A)',
    text: 'Dad is facing us, so his left nostril is on OUR right. In we go... hold your breath!' },
  { dur: 3.6, onShow: freshCues,
    text: 'Past the nose hairs! They\'re like a giant jungle. And WATCH OUT for that bogey!',
    draw(c, t) {
      drawTunnel(c, t);
      drawHairJungle(c, t);
      const sw = Math.sin(t * 2.2) * 50, bx = 520 + sw, by = 220;
      c.strokeStyle = 'rgba(160,200,90,.9)'; c.lineWidth = 6; c.beginPath(); c.moveTo(520, 0); c.quadraticCurveTo(520 + sw * .5, 110, bx, by - 50); c.stroke();
      drawBogeyBlob(c, bx, by, 56, t);
      const sx = 900 - t * 230, sy = 300 + Math.sin(t * 3) * 40 + (sx < 650 && sx > 400 ? 90 : 0) * Math.sin(clamp((650 - sx) / 250, 0, 1) * Math.PI);
      drawShip(c, sx, sy, 4, t);
      if (t > 1 && t < 2.4) boom(c, 300, 110, 'WATCH OUT!', 46, '#ffe36b');
      if (t > 2.5) bubble(c, sx, sy - 34, 'Phew!', 18);
    } },
  { dur: 3.6, onShow: freshCues,
    text: 'Uh-oh. Ah... ah... ahhh... Phew, false alarm! Deeper into the nose we go, to find where the virus is hiding.',
    draw(c, t) {
      const ah = clamp(t / 2.2, 0, 1), calm = t > 2.4;
      drawTunnel(c, t, calm ? 0 : ah * 14);
      c.strokeStyle = 'rgba(255,240,240,.4)'; c.lineWidth = 3;
      if (!calm) for (let i = 0; i < 8; i++) { const y = 60 + i * 55, x = (t * 600 + i * 130) % (W + 200) - 100; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 80 * ah, y); c.stroke(); }
      drawShip(c, 480 + (calm ? 0 : Math.sin(t * 20) * 20 * ah), 280, 4.5, t);
      if (!calm) boom(c, 480, 130, 'A' + 'H'.repeat(1 + Math.floor(ah * 4)) + '...', 40 + ah * 24, '#fff6d8');
      else boom(c, 480, 130, '...false alarm!', 44, '#c7e04f', 0);
      cue('ah', t, .2, () => achoo('ah'));
      if (t > 2.8) { c.fillStyle = `rgba(90,22,38,${clamp((t - 2.8) / .8, 0, 1)})`; c.fillRect(0, 0, W, H); }
    } },
];
// Dad's red cold nose, with a drip hanging out of his left nostril (our right).
function flyExtras(c, z) {
  const g = c.createRadialGradient(198, 110, 1, 200, 114, 10);
  g.addColorStop(0, '#ff9a8a'); g.addColorStop(1, '#d8404a');
  c.fillStyle = g; c.beginPath(); c.ellipse(200, 114, 9, 7, 0, 0, 7); c.fill();
  c.fillStyle = '#5a1418'; c.beginPath(); c.ellipse(196, 118, 2, 1.2, .3, 0, 7); c.fill(); c.beginPath(); c.ellipse(204.5, 118, 2, 1.2, -.3, 0, 7); c.fill();
  const d = 2 + Math.sin(anim * 2) * .8;
  c.fillStyle = 'rgba(200,235,170,.9)'; c.beginPath(); c.moveTo(204, 119); c.quadraticCurveTo(206, 119 + d, 205, 120 + d); c.quadraticCurveTo(203.5, 120 + d, 204, 119); c.fill();
  circle(c, 205, 120.6 + d, 1);
  if (z > 12) {                                   // point out which nostril is his left
    c.globalAlpha = clamp((z - 10) / 4, 0, 1);
    c.strokeStyle = '#ffe9b0'; c.fillStyle = '#ffe9b0'; c.lineWidth = .25;
    c.beginPath(); c.moveTo(212, 124); c.lineTo(206.5, 119.6); c.stroke();
    c.font = 'bold 2px Trebuchet MS'; c.textAlign = 'left'; c.fillText('his LEFT nostril', 211, 126);
    c.globalAlpha = 1;
  }
}

return {
  num: 4, code: 'GOOP', award: 'ITCH', title: 'Level 4 · Snot Storm',
  facts: FACTS, exit: EXIT, escort: { total: NEU_TOTAL, need: NEU_NEED, color: '#c8a8f0' },
  solid, reset, usePower, update, render, renderBackground: paintBackground, renderTerrain: paintTerrain,
  story: STORY, fly: FLY, finale: FINALE, flyExtras,
  lines: [...BRAIN_LINES.map(b => b[1]), ...Object.values(BRAIN)].map(t => 'Brain says: ' + t),
  dbg: () => ({ rexHP, rexDead, wallOpen, domeOpen, riverShut, meltQ: meltQ.length, gust, oops, gulps, clumps, sneezeAt }),   // for testing from the console
  onStart() { setTimeout(() => fact('rhino'), 1500); setTimeout(() => fact('kinds'), 16000); },
  onRelease() {
    say(heroes[active], 'Here come the neutrophils!', '#e8dcff');
    setTimeout(() => fact('squeeze'), 3000);
  },
};
})();
