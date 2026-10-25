'use strict';
// ---------- Level 2 · The Great Poo Escape (colon) ----------
LEVELS[2] = (() => {
const BAC_TOTAL = 10, BAC_NEED = 7, BAC_SPEED = 34, BAC_GAP = 1.8;
const EXIT = { x: 38 * T, y: 13 * T, w: T, h: 5 * T };
const HOME = { x: 34 * T, y: 13 * T, w: 2 * T, h: 5 * T };     // the bare colon wall where good bacteria move in
const SWITCH = { x: 32 * T + 12, y: 18 * T };
const GAS = { x: 16 * T, w: 2 * T, top: 15 * T - 2 };          // gas vent column; floats things up to the poo bank
const SWAMP = 7, CRACK = 8;
const WAVE_FIRST = 35, WAVE_EVERY = 32, WAVE_SPEED = 240;
const NAMES = ['Bifido Bob', 'Lacto Lucy', 'Bactero Bert', 'Faecali Fred', 'Rosie Roseburia',
  'Akker Annie', 'Rumino Ron', 'Prevo Pete', 'Blautia Bea', 'Eubie'];
const STINK = [[0, 'Fresh(ish)'], [1, 'Old Sock'], [3, 'Cheese Factory'], [6, 'Rotten Egg'], [10, 'Wet Dog'],
  [15, 'Skunk Explosion'], [22, 'Toxic Cloud']];
const BRAIN_LINES = [[20, 'Was that a rumble down there?'], [80, 'Hmm. We might need a toilet soon...'],
  [140, 'We need a toilet SOON!'], [200, 'FIND A TOILET! I\'m crossing my legs up here!'], [270, 'Seriously. Toilet. NOW. Please?']];
const BRAIN = {
  fart: 'Pardon me! Was that you down there?',
  early: 'Hold it! We haven\'t found a toilet yet!',
  toilet: 'TOILET FOUND! Sitting down now... Zaal, zap the nerve to open the way out!',
  push: 'Ready... steady... PUSH! Everybody out!',
};

// ---------- body facts ----------
const FACTS = {
  antibiotic: '<b>Antibiotics</b> kill bacteria. They can\'t tell good gut bacteria from bad germs, so they often wipe out both.',
  crapsule: 'Poo-transplant pills have a real nickname: <b>"crapsules"</b>!',
  transplant: 'A <b>poo transplant</b> puts good bacteria from a healthy person\'s poo into a poorly gut. It cures most C. diff infections that keep coming back.',
  cdiff: '<b>C. diff</b> is short for <b>Clostridioides difficile</b>. "Difficile" means difficult, because it was so hard to grow in a lab!',
  toxin: 'C. diff makes <b>toxins</b> that damage the colon wall. That\'s what causes the runny diarrhoea.',
  drumstick: 'C. diff is rod-shaped. When it makes a spore, it bulges at one end like a <b>drumstick</b>!',
  microbiome: 'Your gut is home to about <b>38 trillion</b> bacteria. That\'s about as many as all the cells in the rest of your body!',
  spore: 'In danger, C. diff turns into a <b>spore</b>: a tough armoured shell. Spores can survive for <b>months</b> on things like door handles.',
  sporeWake: 'Spores wake up and turn back into germs when they sense <b>bile</b>, a juice from your liver, in the gut.',
  sporeOut: 'C. diff spores leave the body in poo. That\'s how they spread, so <b>always wash your hands</b> after the toilet!',
  water: 'Poo is about <b>75% water</b>. The colon soaks water back out, which is why poo gets firmer as it travels along.',
  bacteriaPoo: 'Up to about <b>half</b> of the solid part of poo is bacteria, alive and dead!',
  brown: 'Poo is brown because of old <b>red blood cells</b>! Their haemoglobin becomes bilirubin, then gut bacteria turn it into brown <b>stercobilin</b>.',
  farts: 'Most people fart about <b>15 times a day</b>. Most of the gas has no smell at all. The stinky part is less than 1%!',
  fartGas: 'Fart gas is mostly <b>nitrogen</b> from swallowed air, plus <b>hydrogen</b>, <b>carbon dioxide</b> and sometimes <b>methane</b> made by gut bacteria.',
  smell: 'Poo smells because gut bacteria make stinky chemicals called <b>skatole</b> and <b>indole</b>.',
  peristalsis: 'Muscles in your gut squeeze in waves to push food and poo along. That\'s <b>peristalsis</b>. It works even if you\'re upside down!',
  pili: 'Lots of good bacteria hold on to the gut with tiny hairs called <b>pili</b> (say "PIE-lie"). That\'s how they don\'t get swept away.',
  goblet: '<b>Goblet cells</b> are shaped like a wine glass. They squirt out <b>mucus</b> so poo slides along smoothly.',
  colon: 'Your <b>colon</b> is about <b>1.5 metres</b> long. The small intestine is about 6 metres long, but much thinner!',
  sphincter: 'You have <b>two</b> sphincters at the very end. The inner one works all by itself. The outer one is the one <b>you</b> control!',
  bristol: 'Doctors use the <b>Bristol Stool Chart</b> to describe poo. It has 7 types, from hard lumps (Type 1) to watery (Type 7).',
};

Object.assign(GLOSS, {
  colon: ['KOH-lon', 'The large intestine: the last part of your gut, where poo is made.'],
  'large intestine': ['in-TES-tin', 'The wide tube at the end of your gut. It soaks water out of poo. Its other name is the colon.'],
  'small intestine': ['', 'A long, thin tube after the stomach. Most of your food gets soaked into your blood here.'],
  villi: ['VIL-eye', 'Millions of tiny finger shapes lining the small intestine, like a fluffy carpet.'],
  appendix: ['uh-PEN-dix', 'A small dead-end tube that sticks out of the large intestine.'],
  microbiome: ['MY-kroh-BY-ohm', 'All the tiny living things that live in and on your body.'],
  antibiotic: ['AN-tee-by-OT-ik', 'A medicine that kills bacteria. It can\'t kill viruses, like the ones that give you colds.'],
  'C. diff': ['see DIFF', 'Short for Clostridioides difficile. A germ that can take over the gut and cause bad diarrhoea.'],
  toxin: ['TOK-sin', 'A poison made by a living thing, like a germ.'],
  diarrhoea: ['dye-uh-REE-uh', 'Very runny poo.'],
  spore: ['', 'A germ inside a tough armoured shell. It can sleep for months and wake up later.'],
  'poo transplant': ['', 'Putting good bacteria from a healthy person\'s poo into a poorly person\'s gut. It really works!'],
  'goblet cell': ['', 'A cell shaped like a wine glass that squirts out mucus.'],
  peristalsis: ['PERRY-stal-sis', 'Waves of muscle squeezing that push food and poo along your gut.'],
  pili: ['PIE-lie', 'Tiny hairs that bacteria use to hold on to things.'],
  rectum: ['REK-tum', 'The very end of the gut, where poo waits until you get to a toilet.'],
  sphincter: ['SFINK-ter', 'A ring of muscle that squeezes shut, like the drawstring on a bag.'],
  stercobilin: ['STER-koh-BY-lin', 'The stuff that makes poo brown. It comes from old red blood cells!'],
});

// ---------- level ----------
let innerOpen, outerOpen, innerAnim, outerAnim, nervePulse, stink, oops, nameI, brainI, firstFart, wave;
let dripT = 0, swampT = 0, brainTimer = 0;
const fin = {};
const stinkName = () => STINK.filter(s => stink >= s[0]).pop()[1];
// Tiles: 1 colon wall, 9 poo ground, 4 squishy poo, 5 dry boulder, 6 slimed boulder, 11 boulder stuck in a crack,
// 2 mucus raft, 7 swamp, 8 crack, 3 inner sphincter, 10 outer sphincter.
function buildGrid() {
  const g = [];
  for (let y = 0; y < ROWS; y++) g.push(new Array(COLS).fill(0));
  for (let x = 0; x < COLS; x++) { g[0][x] = 1; for (let y = 18; y < ROWS; y++) g[y][x] = 9; }
  for (let y = 0; y < ROWS; y++) { g[y][0] = 1; g[y][COLS - 1] = 1; }
  for (let x = 10; x <= 13; x++) { g[18][x] = SWAMP; g[19][x] = SWAMP; }        // diarrhoea swamp
  for (let x = 18; x <= 22; x++) for (let y = 15; y < 18; y++) g[y][x] = 9;        // poo bank, reached by the gas vent
  for (let x = 23; x <= 28; x++) { g[18][x] = 4; g[19][x] = SWAMP; }             // squishy poo over the swamp
  g[18][30] = CRACK; g[18][31] = CRACK;                                           // dry crack
  g[17][27] = 5; g[17][29] = 5;                                                   // hard poo boulders, pushed right into the crack
  for (let x = 36; x <= 38; x++) for (let y = 1; y < 13; y++) g[y][x] = 1;        // rectum wall
  for (let y = 13; y < 18; y++) { g[y][36] = 3; g[y][37] = 10; }                  // inner and outer sphincters
  for (const x of [13, 14, 15, 24, 25, 26]) g[1][x] = 1;                          // folds in the colon roof
  g[2][14] = 1; g[2][25] = 1;
  return g;
}
const solid = t => t === 1 || t === 2 || t === 4 || t === 5 || t === 6 || t === 9 || t === 11 ||
  (t === 3 && !innerOpen) || (t === 10 && !outerOpen);
function tileAt(x, y) {
  const c = Math.floor(x / T), r = Math.floor(y / T);
  return r >= 0 && r < ROWS && c >= 0 && c < COLS ? grid[r][c] : 0;
}
const cdiff = (c, r) => Object.assign(makeGerm(c, r), { speed: 18 + Math.random() * 8 });
function reset() {
  grid = buildGrid();
  innerOpen = outerOpen = false; innerAnim = outerAnim = 0; nervePulse = -1;
  stink = 0; oops = 0; nameI = 0; brainI = 0; firstFart = true;
  wave = { x: -1, next: WAVE_FIRST, warned: false, id: 0 };
  heroes = [
    makeHero('zaal', 'Zaal', 3, 16, 30, 150, 575, 'Super-jump · E near the nerve to zap it'),
    makeHero('gob', 'Gobbler', 5, 30, 26, 95, 405, 'E next to C. diff to swallow it'),
    makeHero('goblet', 'Goblet', 7, 20, 26, 115, 420, 'E: slime a boulder, or make a mucus raft'),
  ];
  for (const h of heroes) Object.assign(h, { cpX: h.x, cpY: h.y, sinkT: 0, sink: 0 });
  germs = [cdiff(15, 17), cdiff(20, 14), cdiff(24, 17), cdiff(32, 17)];
  clearTimeout(brainTimer);
  document.getElementById('brainSays').textContent = '';
}
// The person's brain chats from upstairs.
function brainSay(text) {
  const el = document.getElementById('brainSays');
  el.textContent = text;
  clearTimeout(brainTimer);
  brainTimer = setTimeout(() => { el.textContent = ''; }, 6000);
  speak('Brain says: ' + text);
}

// ---------- powers ----------
function usePower(h) {
  if (h.id === 'gob') {
    const best = nearestGerm(h);
    if (!best) {
      if (nearestGerm(h, 46, 'spore')) return say(h, 'A spore! Too tough to digest. A squeeze will sweep it out.', '#ffd88a');
      return say(h, 'No C. diff close enough!');
    }
    openMath('GULP TIME! Solve it to swallow the C. diff:', () => {
      best.state = 'eaten'; best.t = 0; h.eatT = .7; h.eaten++; h.facing = cx(best) > cx(h) ? 1 : -1;
      sfx('gulp');
      setTimeout(() => { sfx('burp'); say(h, 'BUUURP!', '#e8d0ff'); }, 900);
      fact(['cdiff', 'toxin', 'drumstick', 'microbiome'][Math.min(h.eaten, 4) - 1]);
    }, () => {
      best.state = 'spore'; best.t = 0;
      for (let i = 0; i < 10; i++) goo(cx(best), cy(best), '#c9a24a');
      sfx('squelch'); say(best, 'It turned into a spore!', '#ffd88a'); fact('spore');
    });
  } else if (h.id === 'goblet') {
    const fr = Math.floor((h.y + h.h - 2) / T);
    let bc = -1;
    for (const d of [4, 16]) {
      const c = Math.floor((h.facing > 0 ? h.x + h.w + d : h.x - d) / T);
      if (grid[fr] && grid[fr][c] === 5) { bc = c; break; }
    }
    if (bc >= 0) return openMath('SLIME TIME! Solve it to squirt mucus on the boulder:', () => {
      grid[fr][bc] = 6; renderTerrain(); sfx('slime');
      for (let i = 0; i < 12; i++) goo(bc * T + 12, fr * T + 8, 'rgba(225,235,170,.9)');
      say(h, 'Slimy! Now anyone can push it.', '#e8f5b0'); fact('goblet');
    }, () => say(h, 'Pfft... the mucus dribbled out.', '#ffb0b0'));
    const { row, cells } = gapCells(h, t => t === SWAMP);
    if (cells.length) return openMath('MUCUS RAFT! Solve it to squirt a slime raft:', () => {
      fillCells(row, cells, 2, 'rgba(225,235,170,.9)'); sfx('slime');
      say(h, 'All aboard the snot boat!', '#e8f5b0'); fact('goblet');
    }, () => say(h, 'The mucus sank. Blub blub...', '#ffb0b0'));
    if (gapCells(h, t => t === CRACK).cells.length) return say(h, 'Too dry here! Fill the crack with a poo boulder.', '#ffd88a');
    say(h, 'Nothing to slime! Stand by a boulder or the swamp.');
  } else {
    if (outerOpen) return say(h, 'The way out is already open!');
    const d = Math.hypot(SWITCH.x - cx(h), SWITCH.y - (h.y + h.h));
    if (d > 34) return say(h, 'Find the glowing nerve!');
    if (!innerOpen) {
      say(h, `Not yet! ${BAC_NEED} good bacteria need to move in first.`, '#ffd88a');
      return brainSay(BRAIN.early);
    }
    openMath('NERVE SIGNAL! Solve it to open the outer sphincter:', () => {
      outerOpen = true; nervePulse = 0; sfx('zap');
      brainSay(BRAIN.push);
    }, () => say(h, 'Fizzle... try again!', '#ffb0b0'));
  }
}
// A slimed boulder slides one tile when a hero walks into it; dry ones won't budge.
// Slimed boulders slide one tile when a hero walks into them, and a row of them slides together.
// Dry ones won't budge. A boulder that drops into the crack plugs it.
function tryPush(h) {
  if (!h.onGround || !h.vx) { h.pushT = 0; return; }
  const dir = Math.sign(h.vx), fr = Math.floor((h.y + h.h - 2) / T);
  const ac = Math.floor((dir > 0 ? h.x + h.w + 2 : h.x - 2) / T);
  const isBoulder = c => grid[fr] && (grid[fr][c] === 5 || grid[fr][c] === 6);
  if (!isBoulder(ac)) { h.pushT = 0; return; }
  const row = [];
  for (let c = ac; isBoulder(c); c += dir) row.push(c);
  if (row.some(c => grid[fr][c] === 5)) {
    h.vx = 0;
    if (!h.toldDry || gameTime - h.toldDry > 4) { h.toldDry = gameTime; say(h, 'Too dry and sticky to push! Goblet can slime it.', '#ffd88a'); }
    return;
  }
  const tc = row[row.length - 1] + dir;
  if (tc < 23 || tc > 33 || grid[fr][tc] !== 0 || row.some(c => solid(grid[fr - 1][c]))) {
    if (tc > 33 && (!h.toldHome || gameTime - h.toldHome > 4)) { h.toldHome = gameTime; say(h, 'Keep the bare wall clear for the bacteria!', '#ffd88a'); }
    h.pushT = 0; return;
  }
  h.vx = 0; h.pushT = (h.pushT || 0) + STEP;
  if (h.pushT < .2) return;
  h.pushT = 0;
  for (const c of row.slice().reverse()) {          // front boulder first
    grid[fr][c] = 0;
    const to = c + dir;
    let r = fr;
    while (r + 1 < ROWS && grid[r + 1][to] === 0) r++;
    if (grid[r + 1][to] === CRACK || grid[r + 1][to] === SWAMP) {
      grid[r + 1][to] = 11; sfx('plop'); say(h, 'Plugged the crack!', '#e8f5b0');
      for (let i = 0; i < 10; i++) goo(to * T + 12, (r + 1) * T, '#5a3a14');
      fact('water');
    } else grid[r][to] = 6;
  }
  renderTerrain(); sfx('push');
}

// ---------- update ----------
const inGas = e => cx(e) > GAS.x && cx(e) < GAS.x + GAS.w && e.y + e.h > GAS.top - 30 && e.y + e.h <= 18 * T + 1;
function toot(e) {
  const size = Math.random();
  sfx('fart', size); stink++;
  say(e, pick(size > .7 ? ['BRAAAP!', 'PFFFRRRT!', 'BLAAARP!'] : size > .35 ? ['PFFFT!', 'TOOT!', 'PARP!'] : ['squeak!', 'pfft', 'fip!']), '#d7ef6a');
  for (let i = 0; i < 6; i++) goo(cx(e), e.y + e.h, 'rgba(190,220,120,.6)');
  if (firstFart) { firstFart = false; brainSay(BRAIN.fart); fact('farts'); }
  else if (stink === 4) fact('fartGas');
  else if (stink === 9) fact('smell');
}
// Lift anything in the gas column up to the top of the poo bank. Returns true while floating.
function gasLift(e, speed) {
  if (!inGas(e)) { e.inGas = false; return false; }
  if (!e.inGas) { e.inGas = true; toot(e); }
  e.vy = e.y + e.h > GAS.top ? Math.min(e.vy, -speed) : Math.min(e.vy, 0);
  return true;
}
function sploosh(h, t) {
  for (let k = 0; k < 18; k++) goo(cx(h), h.y + h.h, t === CRACK ? '#3a2410' : '#7a5418');
  sfx('sploosh');
  Object.assign(h, { x: h.cpX, y: h.cpY, vx: 0, vy: 0, knockT: 0, sinkT: 0, sink: 0 });
  say(h, t === CRACK ? 'Stuck in a crack! POP! Back you go...' : 'SPLOOSH! Back you go...', '#e8c39a');
}
function heroAfter(h) {
  const t = tileAt(cx(h), h.y + h.h - 3);
  if (t === SWAMP || t === CRACK || h.y > H) return sploosh(h, t);
  // squishy poo: stand still too long and you sink in
  const under = h.onGround ? tileAt(cx(h), h.y + h.h + 2) : 0;
  if (under === 4 && Math.abs(h.vx) < 1) {
    h.sinkT += STEP;
    if (h.sinkT > .5 && !h.toldSink) { h.toldSink = true; say(h, 'Squelch! Keep moving!', '#e8c39a'); sfx('squelch'); }
    if (h.sinkT > 2.2) return sploosh(h, SWAMP);
  } else {
    h.sinkT = Math.max(0, h.sinkT - STEP * 2);
    if (!h.sinkT) h.toldSink = false;
  }
  h.sink = Math.min(12, h.sinkT * 6);
  if (under && under !== 4 && h.knockT <= 0) { h.cpX = h.x; h.cpY = h.y; }
}
function makeBact() {
  const name = NAMES[nameI % NAMES.length];
  return { x: 2.5 * T - 8, y: 4.6 * T, w: 16, h: 10, vx: 0, vy: 0, dir: 1, state: 'walk', t: 0, onGround: false,
    ph: Math.random() * 6, name, kind: nameI++ % 3 };
}
const slotPos = i => [HOME.x + 2 + (i % 4) * 11, 18 * T - 11 - Math.floor(i / 4) * 11];
function walkerStep(r, dt) {
  r.ph += dt;
  if (r.state === 'walk') {
    if (!r.named) { r.named = true; say(r, r.name, '#bff7c9'); }
    r.floating = gasLift(r, 85);
    const dir = r.dir;
    walkStep(r, dt, BAC_SPEED);
    if (r.floating && r.hitWall) r.dir = dir;          // hold course while riding the gas
    const t = tileAt(cx(r), r.y + r.h - 2);
    if (overlap({ x: cx(r) - 1, y: cy(r) - 1, w: 2, h: 2 }, HOME)) {
      r.state = 'home'; r.slot = saved++; r.t = 0; sfx('saved');
      say(r, `${r.name} moved in!`, '#bff7c9');
      if (saved === 1) fact('transplant');
      if (saved === 3) fact('bacteriaPoo');
      if (saved === 5) fact('brown');
    } else if (germs.some(g => g.state === 'alive' && overlap(g, r))) {
      r.state = 'bullied'; r.t = 0; sfx('squelch'); say(r, 'Bullied by C. diff!', '#ffd0a0');
    } else if (t === SWAMP || t === CRACK || r.y > H) {
      r.state = 'splash'; r.t = 0; sfx('sploosh');
      for (let k = 0; k < 10; k++) goo(cx(r), r.y + r.h, '#7a5418');
      say(r, t === CRACK ? 'Fell in a crack!' : 'Splosh!', '#e8c39a');
    }
  } else if (r.state === 'home') {
    const [sx, sy] = slotPos(r.slot), k = Math.min(1, dt * 4);
    r.x += (sx - r.x) * k; r.y += (sy - r.y) * k;
  } else {
    // bullied or splashed: zip back into the crapsule for another go
    r.t += dt;
    if (r.t > .8) {
      r.state = 'gone'; spawned--; oops++;
      floats.push({ x: 4 * T, y: 5.4 * T, text: `${r.name}: back in for another go!`, color: '#bff7c9', life: 1.8 });
    }
  }
}
// Spores sit still and harmless; they wake up after a while unless a squeeze wave sweeps them out.
function sporeStep(g, dt) {
  if (g.state === 'spore') {
    g.vx = 0; moveEntity(g, dt, false); g.t += dt;
    if (g.t > 14) { g.state = 'alive'; g.t = 0; say(g, 'The spore woke up!', '#ffd88a'); fact('sporeWake'); sfx('bloop'); }
    return true;
  }
  if (g.state === 'swept') { g.t += dt; g.x += 300 * dt; g.y -= 20 * dt; return g.t < 1.2 && g.x < W; }
  return true;
}
// A gentle peristalsis wave rolls left to right every so often. Heroes hop, spores get swept away.
function updateWave(dt) {
  if (wave.x < 0) {
    if (!wave.warned && gameTime > wave.next - 3) { wave.warned = true; sfx('rumble'); }
    if (gameTime >= wave.next) { wave.x = 0; wave.id++; }
    return;
  }
  wave.x += WAVE_SPEED * dt;
  const reached = e => {
    if (e.waveId === wave.id || Math.abs(cx(e) - wave.x) > 20) return false;
    e.waveId = wave.id;
    return true;
  };
  // heroes only hop in place, so a squeeze never undoes where you parked them
  for (const h of heroes) if (!h.inExit && reached(h)) {
    if (h.onGround) h.vy = -200;
    say(h, pick(['Wheee!', 'Whoa!', 'Squeeeeze!']), '#ffd0e0');
  }
  for (const r of walkers) if (r.state === 'walk' && reached(r)) say(r, 'Hold on tight!', '#bff7c9');
  for (const g of germs) if (g.state === 'spore' && reached(g)) { g.state = 'swept'; g.t = 0; say(g, 'Swept away!', '#ffd88a'); fact('sporeOut'); }
  if (wave.id === 1 && wave.x > W / 2 && !seenFacts.has('peristalsis')) { fact('peristalsis'); setTimeout(() => fact('pili'), 8000); }
  if (wave.x > W + 80) { wave.x = -1; wave.next = gameTime + WAVE_EVERY; wave.warned = false; }
}
function update(dt) {
  updateHeroes(dt, heroAfter, (h, i) => {
    gasLift(h, 130);
    if (i === active && h.knockT <= 0) tryPush(h);
  });
  if (ended || paused) return;
  updateGerms(dt, sporeStep);
  spawnWalkers(dt, BAC_TOTAL, BAC_GAP, makeBact);
  for (const r of walkers) walkerStep(r, dt);
  walkers = walkers.filter(r => r.state !== 'gone');
  updateWave(dt);

  // ambience: gas bubbles, swamp burps, mucus drips
  if (Math.random() < .5) parts.push({ x: GAS.x + 6 + Math.random() * (GAS.w - 12), y: 18 * T - 2, vx: (Math.random() - .5) * 10, vy: -30,
    life: 2.2, max: 2.2, color: 'rgba(190,220,120,.4)', size: 1.5 + Math.random() * 3, grav: -30 });
  swampT -= dt;
  if (swampT <= 0) {
    swampT = 1.5 + Math.random() * 2;
    const x = (10 + Math.random() * 4) * T;
    if (tileAt(x, 18 * T + 4) === SWAMP) {
      for (let i = 0; i < 5; i++) goo(x, 18 * T, '#8a6224');
      if (Math.random() < .2) { sfx('fart', Math.random() * .2); floats.push({ x, y: 18 * T - 6, text: 'blorp', color: '#e8c39a', life: 1.2 }); }
    }
  }
  dripT -= dt;
  if (dripT <= 0 && ceilTiles.length) {
    dripT = .4 + Math.random() * .6;
    const [c, r] = pick(ceilTiles);
    parts.push({ x: c * T + 4 + Math.random() * 16, y: (r + 1) * T + 6, vx: 0, vy: 0, life: 2, max: 2,
      color: 'rgba(210,190,110,.85)', size: 2.2, grav: 420, drip: true });
  }
  updateParticles(dt);

  // the brain upstairs, the sphincters and the way out
  if (!innerOpen && brainI < BRAIN_LINES.length && gameTime > BRAIN_LINES[brainI][0]) brainSay(BRAIN_LINES[brainI++][1]);
  if (saved >= BAC_NEED && !innerOpen) {
    innerOpen = true; sfx('cheer'); fact('sphincter');
    brainSay(BRAIN.toilet);
  }
  if (innerOpen) innerAnim = Math.min(1, innerAnim + dt * 1.2);
  if (outerOpen) outerAnim = Math.min(1, outerAnim + dt * 1.2);
  if (nervePulse >= 0 && nervePulse < 1) nervePulse += dt;
  if (outerOpen && heroes.every(h => h.inExit)) return finish();
  if (!released) hint = 'Make the path safe first, then press R to open the crapsule.';
  else if (grid[18][30] === CRACK || grid[18][31] === CRACK) hint = 'Plug the crack: Goblet slimes the poo boulders, then push them right into it.';
  else if (!innerOpen) hint = 'Lead the good bacteria to the bare pink wall. A hero standing still turns them around.';
  else if (!outerOpen) hint = `${saved} bacteria moved in! Zaal: zap the nerve to open the way out.`;
  else hint = 'Get every hero out through the rectum. Time to go!';
}
function finish() {
  ended = true; paused = true; hush();
  clearTimeout(brainTimer);
  document.getElementById('brainSays').textContent = '';
  document.getElementById('facts').innerHTML = '';
  sfx('win');
  flyStart(FINALE, showWin);
}
function showWin() {
  const golden = saved === BAC_TOTAL && oops === 0, gob = heroes[1].eaten;
  seenFacts.add('bristol');
  showEnd(golden ? 'GOLDEN POO!' : 'POO-FECT!',
    `<b>${saved} of ${BAC_TOTAL}</b> good bacteria moved in${saved === BAC_TOTAL ? ', every single one!' : '.'}` +
    `${oops ? ` (${oops} had a wobble and needed another go.)` : ''} Gobbler swallowed ${gob} C. diff. ` +
    `Final stink rating: <b>${stinkName()}</b>.<br>The colon went from <b>Type 7</b> (watery) to ` +
    `<b>Type 4${golden ? ', golden edition' : ''}</b>: the perfect poo!`, 'BURP');
  document.getElementById('btnAgain').textContent = 'Play again';
  drawBristol(golden);
}

// ---------- drawing: static layers ----------
function paintBackground(c) {
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3e1c14'); g.addColorStop(.6, '#2c130b'); g.addColorStop(1, '#1b0a04');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // haustra: the colon wall bulges into a row of puffy pouches
  for (let i = 0; i < 9; i++) {
    const x = i * 120 - 20;
    g = c.createRadialGradient(x + 60, H * .42, 20, x + 60, H * .42, 150);
    g.addColorStop(0, 'rgba(160,80,64,.24)'); g.addColorStop(1, 'rgba(60,20,10,0)');
    c.fillStyle = g; c.fillRect(x, 0, 120, H);
    c.strokeStyle = 'rgba(28,8,4,.55)'; c.lineWidth = 10;
    c.beginPath(); c.moveTo(x, 20); c.bezierCurveTo(x + 25, H * .3, x - 25, H * .6, x + 5, H); c.stroke();
    c.strokeStyle = 'rgba(210,130,110,.14)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x + 7, 20); c.bezierCurveTo(x + 32, H * .3, x - 18, H * .6, x + 12, H); c.stroke();
  }
  function branch(x, y, a, len, w, d) {
    if (d > 5 || w < .6) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    c.strokeStyle = `rgba(120,30,50,${.16 + w * .03})`; c.lineWidth = w;
    c.beginPath(); c.moveTo(x, y);
    c.quadraticCurveTo((x + x2) / 2 + Math.sin(d + a) * 12, (y + y2) / 2 + Math.cos(d) * 12, x2, y2); c.stroke();
    branch(x2, y2, a + .4 + hash(d, x | 0) * .4, len * .75, w * .7, d + 1);
    branch(x2, y2, a - .4 - hash(y | 0, d) * .4, len * .7, w * .65, d + 1);
  }
  for (let i = 0; i < 5; i++) branch(hash(i, 150) * W, hash(i, 151) * H * .6, hash(i, 152) * 6.3, 60, 5, 0);
  // brown murk: the lower colon is full of runny poo
  g = c.createLinearGradient(0, H * .4, 0, H);
  g.addColorStop(0, 'rgba(95,58,16,0)'); g.addColorStop(1, 'rgba(95,58,16,.45)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) {
    c.fillStyle = `rgba(${130 + hash(i, 3) * 60 | 0},${85 + hash(i, 4) * 40 | 0},30,${.12 + hash(i, 5) * .2})`;
    circle(c, hash(i, 1) * W, H * .25 + hash(i, 2) * H * .7, 1 + hash(i, 6) * 3);
  }
  g = c.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function drawBoulderTile(c, px, py, t, x, y) {
  const flat = t === 11;
  const top = flat ? py + 2 : py + 3;
  c.fillStyle = flat ? '#5e3e1a' : '#6e4a20'; c.strokeStyle = '#2e1c08'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(px + 2, py + T);
  for (let i = 0; i <= 6; i++) c.lineTo(px + 2 + i * (T - 4) / 6, top + (i % 2 ? 0 : 2) + hash(x, y, i) * 3);
  c.lineTo(px + T - 2, py + T); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(30,15,4,.7)'; c.lineWidth = 1;                      // dry cracks
  for (let i = 0; i < 3; i++) {
    const sx = px + 5 + hash(x, y, i + 10) * 14, sy = py + 7 + hash(x, y, i + 11) * 10;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 4, sy + 3); c.lineTo(sx + 2, sy + 7); c.stroke();
  }
  c.fillStyle = '#f2c933'; rr(c, px + 6 + hash(x, y, 30) * 10, py + 12, 5, 4, 1.5); c.fill();   // a sweetcorn kernel
  if (t === 6) {
    c.fillStyle = 'rgba(225,240,170,.55)'; rr(c, px + 1, py + 2, T - 2, T - 2, 6); c.fill();
    c.strokeStyle = 'rgba(255,255,230,.8)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(px + 5, py + 6); c.quadraticCurveTo(px + 12, py + 3, px + 19, py + 6); c.stroke();
    c.fillStyle = 'rgba(225,240,170,.8)';
    c.beginPath(); c.moveTo(px + 6, py + T - 2); c.quadraticCurveTo(px + 8, py + T + 6, px + 10, py + T - 2); c.fill();
  }
}
function paintTerrain(c) {
  const isSolid = (x, y) => x < 0 || x >= COLS || y < 0 || (y < ROWS && [1, 2, 4, 5, 6, 9, 11].includes(grid[y][x]));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = grid[y][x], px = x * T, py = y * T;
    if (t === 1) {
      // colon wall: pink and fleshy
      c.fillStyle = `hsl(6,44%,${34 + hash(x, y) * 9}%)`; c.fillRect(px, py, T, T);
      for (let i = 0; i < 4; i++) {
        c.fillStyle = `hsla(${355 + hash(x, y, i) * 20},48%,${28 + hash(y, x, i) * 18}%,.5)`;
        circle(c, px + hash(x, y, i + 9) * T, py + hash(x, y, i + 19) * T, 3 + hash(x, y, i + 29) * 7);
      }
    } else if (t === 9 || t === 4) {
      // poo: wet and glossy on the left, dry and cracked on the right
      const d = clamp((x - 8) / 26, 0, 1), soft = t === 4;
      c.fillStyle = soft ? `hsl(30,46%,${30 + hash(x, y) * 5}%)` : `hsl(${26 + d * 6},${52 - d * 18}%,${19 + d * 13 + hash(x, y) * 5}%)`;
      c.fillRect(px, py, T, T);
      for (let i = 0; i < 3; i++) {
        c.fillStyle = `rgba(${40 + hash(x, y, i) * 50 | 0},${22 + hash(x, y, i + 1) * 20 | 0},6,.45)`;
        circle(c, px + hash(x, y, i + 9) * T, py + hash(x, y, i + 19) * T, 2 + hash(x, y, i + 29) * 6);
      }
      if (!soft && hash(x, y, 40) < d * .7) {
        c.strokeStyle = 'rgba(30,15,4,.6)'; c.lineWidth = 1;
        const sx = px + hash(x, y, 41) * T;
        c.beginPath(); c.moveTo(sx, py + 2); c.lineTo(sx + 4, py + 9); c.lineTo(sx + 1, py + 16); c.stroke();
      }
      if (hash(x, y, 50) < .07) { c.fillStyle = '#f2c933'; rr(c, px + 4 + hash(x, y, 51) * 12, py + 4 + hash(x, y, 52) * 12, 6, 5, 2); c.fill();
        c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(px + 6 + hash(x, y, 51) * 12, py + 5 + hash(x, y, 52) * 12, 2, 1.5); }
      else if (hash(x, y, 53) < .025) { c.fillStyle = '#6a9a2a'; circle(c, px + 8 + hash(x, y, 54) * 8, py + 10, 3.2); }
      if (soft) { c.fillStyle = 'rgba(255,220,170,.18)'; c.beginPath(); c.ellipse(px + 12, py + 9, 8, 3, 0, 0, 7); c.fill(); }
    } else if (t === 5 || t === 6 || t === 11) {
      drawBoulderTile(c, px, py, t, x, y);
      continue;
    } else if (t === 2) {
      c.fillStyle = 'rgba(225,235,170,.92)'; rr(c, px - 1, py + 1, T + 2, T - 6, 6); c.fill();
      c.strokeStyle = 'rgba(160,180,90,.8)'; c.lineWidth = 1; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.55)';
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(px + 4 + hash(x, i, 7) * 16, py + 6 + hash(i, y, 8) * 10, 1.2 + hash(x, y, i) * 1.5, 0, 7); c.fill(); }
      c.fillStyle = 'rgba(225,235,170,.8)';
      c.beginPath(); c.moveTo(px + 8, py + T - 6); c.quadraticCurveTo(px + 11, py + T + 4, px + 14, py + T - 6); c.fill();
      continue;
    } else if (t === CRACK) {
      const g = c.createLinearGradient(0, py, 0, py + T);
      g.addColorStop(0, '#2a1606'); g.addColorStop(1, '#070302');
      c.fillStyle = g; c.fillRect(px, py, T, T);
      continue;
    } else continue;
    // darker rims where solid meets open space
    c.fillStyle = 'rgba(30,6,2,.45)';
    if (!isSolid(x - 1, y)) c.fillRect(px, py, 3, T);
    if (!isSolid(x + 1, y)) c.fillRect(px + T - 3, py, 3, T);
    if (!isSolid(x, y + 1) && y < ROWS - 1) {
      c.fillRect(px, py + T - 3, T, 3);
      ceilTiles.push([x, y]);
      c.fillStyle = 'rgba(215,195,120,.8)';
      for (let i = 0; i < 2; i++) if (hash(x, y, i + 60) < .55) {
        const dx = px + 4 + hash(x, y, i + 61) * 16, len = 4 + hash(x, y, i + 62) * 10;
        c.beginPath(); c.moveTo(dx - 3, py + T); c.quadraticCurveTo(dx, py + T + len * 1.4, dx + 3, py + T); c.fill();
      }
    }
    // a slimy coat on top surfaces
    if (!isSolid(x, y - 1) && y > 0) {
      const d = clamp((x - 8) / 26, 0, 1);
      c.fillStyle = t === 1 ? 'rgba(225,212,150,.85)' : `rgba(${110 + d * 60 | 0},${70 + d * 40 | 0},${25 + d * 20 | 0},.9)`;
      c.beginPath(); c.moveTo(px, py - 1); c.lineTo(px + T, py - 1);
      for (let i = 4; i >= 0; i--) c.lineTo(px + i * T / 4, py + 3 + hash(x, y, i + 80) * 5);
      c.fill();
      c.strokeStyle = `rgba(255,240,210,${t === 1 ? .55 : .45 - d * .35})`; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(px + 2, py + 1); c.lineTo(px + T - 4, py + 1); c.stroke();
    }
  }
}

// ---------- drawing: characters ----------
function drawGoblet(c, x, by, f, t, walking) {
  c.save(); c.translate(x, by); c.scale(f, 1);
  const s = walking ? Math.sin(t * 14) : 0, w = Math.sin(t * 3) * .6;
  c.fillStyle = '#b24a5c'; rr(c, -6 + s * 2, -3, 5, 3, 1.5); c.fill(); rr(c, 1 - s * 2, -3, 5, 3, 1.5); c.fill();
  // the stem, with its nucleus
  const g = c.createLinearGradient(-5, 0, 5, 0);
  g.addColorStop(0, '#c05a6c'); g.addColorStop(.5, '#ec8e9c'); g.addColorStop(1, '#c05a6c');
  c.fillStyle = g; c.beginPath(); c.moveTo(-4, -2); c.lineTo(4, -2); c.quadraticCurveTo(4, -12, 9, -17); c.lineTo(-9, -17);
  c.quadraticCurveTo(-4, -12, -4, -2); c.fill();
  c.fillStyle = '#7a2a6a'; c.beginPath(); c.ellipse(0, -8, 2.6, 3.2, 0, 0, 7); c.fill();
  // the "goblet": a cup stuffed with mucus
  c.fillStyle = 'rgba(236,242,214,.96)'; c.strokeStyle = '#c05a6c'; c.lineWidth = 1.4;
  c.beginPath(); c.moveTo(-9, -17); c.quadraticCurveTo(-12, -27, -6, -30 + w); c.quadraticCurveTo(0, -33, 6, -30 - w);
  c.quadraticCurveTo(12, -27, 9, -17); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = 'rgba(180,205,140,.7)'; for (let i = 0; i < 6; i++) circle(c, -6 + hash(i, 5) * 12, -28 + hash(i, 6) * 8, 1.4);
  c.fillStyle = 'rgba(222,236,170,.88)'; c.beginPath(); c.ellipse(0, -32 + w, 5 + w, 3, 0, 0, 7); c.fill();
  c.fillStyle = '#fff'; circle(c, 1.5, -21, 2.2); circle(c, 6, -20.5, 2);
  c.fillStyle = '#2a0b20'; circle(c, 2.2, -20.8, 1.1); circle(c, 6.6, -20.3, 1);
  c.strokeStyle = '#7a2a3a'; c.lineWidth = .9; c.beginPath(); c.arc(4, -17.6, 1.6, .2, Math.PI - .2); c.stroke();
  c.restore();
}
const BCOL = [['#62d4b4', '#2f8f7a'], ['#a8db4c', '#5f8a1c'], ['#bba6f2', '#6a52b0']];
function drawBact(c, x, y, dir, t, state, kind = 0, alpha = 1) {
  c.save(); c.translate(x, y); c.globalAlpha = alpha;
  const sq = state === 'walk' ? Math.sin(t * 12) * .7 : 0;
  c.strokeStyle = BCOL[kind][1]; c.lineWidth = .7;               // pili, for holding on
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 + Math.sin(t * 6 + i) * .1;
    c.beginPath(); c.moveTo(Math.cos(a) * 7, Math.sin(a) * 4); c.lineTo(Math.cos(a) * 10, Math.sin(a) * 6.5); c.stroke();
  }
  const g = c.createLinearGradient(0, -5, 0, 5);
  g.addColorStop(0, BCOL[kind][0]); g.addColorStop(1, BCOL[kind][1]);
  c.fillStyle = g; rr(c, -8 - sq, -4.5 + sq * .3, 16 + sq * 2, 9 - sq * .6, 4.5); c.fill();
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-2, -2.5, 4, 1.1, 0, 0, 7); c.fill();
  c.fillStyle = '#fff'; circle(c, 2 * dir, -1, 1.6); circle(c, 5.2 * dir, -1, 1.5);
  c.fillStyle = '#000'; circle(c, 2.5 * dir, -.9, .75); circle(c, 5.7 * dir, -.9, .75);
  if (state === 'home' || state === 'wait') {
    c.strokeStyle = '#123a2a'; c.lineWidth = .8; c.beginPath(); c.arc(3.6 * dir, 1.2, 1.6, .2, Math.PI - .2); c.stroke();
  }
  if (state === 'bullied' || state === 'splash') { c.fillStyle = 'rgba(120,80,20,.6)'; rr(c, -9, -5, 18, 10, 5); c.fill(); }
  c.restore();
}
function drawCdiff(c, x, y, dir, t, scale = 1) {
  c.save(); c.translate(x, y); c.scale(dir * scale, scale);
  c.strokeStyle = 'rgba(205,175,95,.7)'; c.lineWidth = .9;      // flagella all round its body
  for (let i = 0; i < 8; i++) {
    const bx = -9 + i * 2.6, side = i % 2 ? 1 : -1;
    c.beginPath(); c.moveTo(bx, side * 4);
    for (let s = 1; s <= 4; s++) c.lineTo(bx + Math.sin(t * 10 + s + i) * 2, side * (4 + s * 2));
    c.stroke();
  }
  c.fillStyle = '#8a6a22'; c.strokeStyle = '#3e2c08'; c.lineWidth = 1.3;   // rod body with a spore bulge: the "drumstick"
  rr(c, -10, -4.5, 22, 9, 4.5); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(-10, 0, 5, 5.5, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = 'rgba(240,220,140,.55)'; c.beginPath(); c.ellipse(-10, -1, 2.6, 3, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(60,40,10,.5)'; for (let i = 0; i < 5; i++) circle(c, -4 + hash(i, 9) * 13, -2 + hash(i, 8) * 4, .8);
  c.fillStyle = '#ffe9a0'; circle(c, 6, -1, 2); circle(c, 9.6, -.8, 1.8);
  c.fillStyle = '#7a0000'; circle(c, 6.5, -.8, 1); circle(c, 10, -.6, .9);
  c.strokeStyle = '#1c1406'; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(4, -4.5); c.lineTo(8, -2.6); c.moveTo(11.6, -3.6); c.lineTo(8.6, -2.6); c.stroke();
  c.lineWidth = .9; c.beginPath(); c.arc(8, 3.4, 1.7, Math.PI + .3, -.3); c.stroke();
  c.restore();
}
function drawSpore(c, x, y, t, alpha = 1) {
  c.save(); c.translate(x, y + Math.sin(t * 2) * .5); c.globalAlpha = alpha;
  const g = c.createRadialGradient(-2, -3, 1, 0, 0, 8);
  g.addColorStop(0, '#f2deaa'); g.addColorStop(1, '#a07a30');
  c.fillStyle = g; c.strokeStyle = '#4a3208'; c.lineWidth = 2;
  c.beginPath(); c.ellipse(0, 0, 6.5, 7.5, 0, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(80,50,10,.5)'; c.lineWidth = .8; c.beginPath(); c.ellipse(0, 0, 4.2, 5.2, 0, 0, 7); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-2.5, -3.5, 1.6, 2.4, -.4, 0, 7); c.fill();
  c.strokeStyle = '#3a2808'; c.lineWidth = 1;                   // sleepy eyes
  c.beginPath(); c.moveTo(-3, 0); c.lineTo(-.6, 0); c.moveTo(.8, 0); c.lineTo(3.2, 0); c.stroke();
  c.fillStyle = '#ffd88a'; c.font = 'bold 8px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('z', 7 + Math.sin(t * 2) * 2, -8 - (t * 6) % 6);
  c.restore();
}

// ---------- drawing: set pieces ----------
function drawCrapsule(c) {
  const x0 = .6 * T, y0 = 1.9 * T, w = 7 * T, h = 2.4 * T, left = BAC_TOTAL - spawned;
  c.save();
  rr(c, x0, y0, w, h, h / 2); c.clip();
  c.fillStyle = 'rgba(200,240,210,.3)'; c.fillRect(x0, y0, w / 2, h);           // see-through half, bacteria inside
  for (let i = 0; i < Math.min(left, 8); i++)
    drawBact(c, x0 + 22 + (i % 4) * 18, y0 + 17 + Math.floor(i / 4) * 21 + Math.sin(anim * 3 + i) * 1.5, 1, anim, 'wait', i % 3);
  c.fillStyle = '#c9a26a'; c.fillRect(x0 + w / 2, y0, w / 2, h);
  c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x0, y0 + 6, w, 6);
  c.restore();
  c.strokeStyle = 'rgba(255,240,210,.8)'; c.lineWidth = 2; rr(c, x0, y0, w, h, h / 2); c.stroke();
  c.beginPath(); c.moveTo(x0 + w / 2, y0); c.lineTo(x0 + w / 2, y0 + h); c.stroke();
  c.fillStyle = '#5a3a14'; c.font = 'bold 13px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('CRAPSULE', x0 + w * .75, y0 + h / 2 + 5);
  c.fillStyle = '#1a0a04';                                                      // torn opening underneath
  c.beginPath(); c.moveTo(1.6 * T, y0 + h - 3);
  for (let i = 0; i <= 8; i++) c.lineTo(1.6 * T + i * 6, y0 + h - 3 + (i % 2 ? 6 : -4));
  c.closePath(); c.fill();
  c.fillStyle = '#e8ffe8'; c.font = 'bold 11px Trebuchet MS'; c.textAlign = 'left';
  if (!released) c.fillText(`${left} good bacteria waiting: press R`, x0 + w + 14, y0 + h / 2 + 4);
}
function drawHome(c) {
  const g = c.createRadialGradient(HOME.x + T, HOME.y + 3 * T, 6, HOME.x + T, HOME.y + 3 * T, 70);
  const p = .75 + Math.sin(anim * 2) * .25;
  g.addColorStop(0, `rgba(255,150,175,${.45 * p})`); g.addColorStop(1, 'rgba(255,150,175,0)');
  c.fillStyle = g; c.fillRect(HOME.x - 30, HOME.y - 20, HOME.w + 60, HOME.h + 20);
  c.fillStyle = 'rgba(255,190,205,.35)';
  for (let i = 0; i < 14; i++) circle(c, HOME.x + 4 + hash(i, 1) * (HOME.w - 8), HOME.y + 10 + hash(i, 2) * (HOME.h - 14), 2 + hash(i, 3) * 2);
  if (!innerOpen) {
    c.fillStyle = '#ffd0dc'; c.font = 'bold 11px Trebuchet MS'; c.textAlign = 'center';
    c.fillText('BARE WALL', HOME.x + T - 14, HOME.y - 14);
    c.fillText('move in here!', HOME.x + T - 14, HOME.y - 2 + Math.sin(anim * 4) * 2);
  }
}
function drawSphincter(c, col, open, label) {
  const x0 = col * T, y0 = 13 * T, h = 5 * T, len = (h / 2) * (1 - open) + 4;
  for (const top of [true, false]) {
    c.save(); c.translate(x0 + T / 2, top ? y0 : y0 + h); if (!top) c.scale(1, -1);
    const g = c.createLinearGradient(-T / 2, 0, T / 2, 0);
    g.addColorStop(0, '#7a2232'); g.addColorStop(.5, '#d0606e'); g.addColorStop(1, '#7a2232');
    c.fillStyle = g; c.beginPath(); c.moveTo(-T / 2 - 2, 0); c.quadraticCurveTo(-T / 2, len * .7, 0, len);
    c.quadraticCurveTo(T / 2, len * .7, T / 2 + 2, 0); c.fill();
    c.strokeStyle = 'rgba(255,200,210,.35)'; c.lineWidth = 1;          // muscle rings
    for (let i = 1; i < 5; i++) { const yy = len * i / 5; c.beginPath(); c.moveTo(-T / 2 + 2, yy * .8); c.quadraticCurveTo(0, yy + 3, T / 2 - 2, yy * .8); c.stroke(); }
    c.restore();
  }
  c.fillStyle = '#ffd0dc'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText(label, x0 + T / 2, y0 - 5);
}
function drawExitLight(c) {
  const g = c.createLinearGradient(EXIT.x, 0, EXIT.x + T, 0), on = outerAnim;
  g.addColorStop(0, `rgba(255,250,220,${.08 + on * .6})`); g.addColorStop(1, `rgba(255,255,255,${.1 + on * .8})`);
  c.fillStyle = '#140804'; c.fillRect(EXIT.x, EXIT.y, EXIT.w, EXIT.h);
  c.fillStyle = g; c.fillRect(EXIT.x, EXIT.y, EXIT.w, EXIT.h);
  c.fillStyle = '#fff6d8'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
  if (outerOpen) c.fillText('🚽 OUT!', EXIT.x + T / 2, EXIT.y - 6 + Math.sin(anim * 5) * 2);
}
function drawNerve(c) {
  const sx = SWITCH.x, sy = SWITCH.y, tx = 37.5 * T, ty = 13 * T + 4;
  c.strokeStyle = outerOpen ? 'rgba(255,240,120,.8)' : 'rgba(250,210,140,.45)'; c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(sx, sy - 10); c.bezierCurveTo(sx + 10, sy - 140, tx - 60, ty - 70, tx, ty); c.stroke();
  if (nervePulse >= 0 && nervePulse < 1) {
    const u = nervePulse, v = 1 - u;
    const px = v ** 3 * sx + 3 * v * v * u * (sx + 10) + 3 * v * u * u * (tx - 60) + u ** 3 * tx;
    const py = v ** 3 * (sy - 10) + 3 * v * v * u * (sy - 140) + 3 * v * u * u * (ty - 70) + u ** 3 * ty;
    c.fillStyle = '#fffbd0'; c.shadowColor = '#ffee55'; c.shadowBlur = 18; circle(c, px, py, 5); c.shadowBlur = 0;
  }
  c.strokeStyle = 'rgba(250,210,140,.6)'; c.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(sx, sy - 8); c.quadraticCurveTo(sx + i * 6, sy - 4, sx + i * 9, sy); c.stroke(); }
  c.strokeStyle = '#e8c890'; c.lineWidth = 3; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx, sy - 10); c.stroke();
  const p = .6 + Math.sin(anim * 5) * .4;
  c.shadowColor = outerOpen ? '#ffee55' : '#6fe0ff'; c.shadowBlur = 10 + p * 12;
  c.fillStyle = outerOpen ? '#fff1a0' : `rgba(140,230,255,${.6 + p * .4})`; circle(c, sx, sy - 13, 5.5);
  c.shadowBlur = 0;
  if (!outerOpen) { c.fillStyle = '#c8f2ff'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center'; c.fillText('NERVE', sx, sy - 24); }
}
function drawSwamp(c) {
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    if (grid[y][x] !== SWAMP) continue;
    const px = x * T, py = y * T, surface = y > 0 && grid[y - 1][x] === 0;
    const g = c.createLinearGradient(0, py, 0, py + T);
    g.addColorStop(0, 'rgba(130,88,28,.95)'); g.addColorStop(1, 'rgba(80,50,14,.98)');
    c.fillStyle = g;
    if (!surface) { c.fillRect(px, py, T, T); continue; }
    c.beginPath(); c.moveTo(px, py + T);
    for (let i = 0; i <= 4; i++) c.lineTo(px + i * 6, py + 5 + Math.sin((px + i * 6) * .09 + anim * 2.2) * 2);
    c.lineTo(px + T, py + T); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(230,190,120,.5)'; c.lineWidth = 1.2; c.stroke();
    if (hash(x, y, Math.floor(anim * 1.3)) < .35) {
      const bx = px + 6 + hash(x, 3, Math.floor(anim * 1.3)) * 12, u = (anim * 1.3) % 1;
      c.strokeStyle = `rgba(230,200,140,${.7 - u * .7})`; c.beginPath(); c.arc(bx, py + 5, 1 + u * 4, Math.PI, 0); c.stroke();
    }
  }
}
function drawGasVent(c) {
  const g = c.createLinearGradient(0, GAS.top - 30, 0, 18 * T);
  g.addColorStop(0, 'rgba(170,210,90,0)'); g.addColorStop(1, `rgba(170,210,90,${.18 + Math.sin(anim * 3) * .05})`);
  c.fillStyle = g; c.fillRect(GAS.x, GAS.top - 30, GAS.w, 18 * T - GAS.top + 30);
  c.fillStyle = '#1a0c04'; c.beginPath(); c.ellipse(GAS.x + GAS.w / 2, 18 * T + 3, GAS.w / 2 - 3, 5, 0, 0, 7); c.fill();
  c.fillStyle = '#e6f5b0'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('GAS VENT', GAS.x + GAS.w / 2, GAS.top - 40);
  c.fillText('ride it up! 💨', GAS.x + GAS.w / 2, GAS.top - 28);
}
function drawWave(c) {
  if (wave.x < 0) return;
  const x = wave.x, g = c.createLinearGradient(x - 110, 0, x + 30, 0);
  g.addColorStop(0, 'rgba(150,50,50,0)'); g.addColorStop(.75, 'rgba(150,50,50,.32)'); g.addColorStop(1, 'rgba(150,50,50,0)');
  c.fillStyle = g; c.fillRect(x - 110, 0, 140, H);
  c.fillStyle = 'rgba(170,70,64,.75)';                                  // the wall squeezing in from top and bottom
  c.beginPath(); c.ellipse(x - 20, 24, 50, 46, 0, 0, Math.PI); c.fill();
  c.fillStyle = 'rgba(170,70,64,.45)';
  c.beginPath(); c.ellipse(x - 20, H - 22, 50, 30, 0, Math.PI, 0); c.fill();
  c.fillStyle = '#ffe0e6'; c.font = 'bold 14px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('SQUEEEEZE!', x - 20, 86 + Math.sin(anim * 10) * 3);
}

// ---------- drawing: frame ----------
function render(c) {
  c.drawImage(bgCanvas, 0, 0);
  drawHome(c);
  drawGasVent(c);
  drawExitLight(c);
  drawCrapsule(c);
  drawNerve(c);
  c.drawImage(terrCanvas, 0, 0);
  drawSwamp(c);
  drawSphincter(c, 36, innerAnim, 'inner');
  drawSphincter(c, 37, outerAnim, 'outer');
  c.fillStyle = '#ffd0dc'; c.font = 'bold 9px Trebuchet MS'; c.fillText('SPHINCTERS', 37.5 * T, 12 * T - 6);
  for (const g of germs) {
    if (g.state === 'spore' || g.state === 'swept') drawSpore(c, cx(g), cy(g) - 2, anim + g.phase, g.state === 'swept' ? Math.max(0, 1 - g.t) : 1);
    else drawCdiff(c, cx(g), cy(g), g.dir, g.phase, g.state === 'eaten' ? Math.max(.1, 1 - g.t / .6) : 1);
  }
  for (const r of walkers) drawBact(c, cx(r), cy(r), r.state === 'home' ? 1 : r.dir, r.ph, r.state, r.kind,
    r.state === 'bullied' || r.state === 'splash' ? Math.max(0, 1 - r.t) : 1);
  drawHeroes(c, (c, h, x, by, walking) => drawGoblet(c, x, by, h.facing, anim, walking));
  drawParts(c);
  drawWave(c);
  drawFloats(c);
  hudTop(c, 'Good bacteria:', saved, 0, 'home');
  c.textAlign = 'right';
  if (wave.warned && wave.x < 0) {
    c.fillStyle = Math.sin(anim * 8) > 0 ? '#ffd0e0' : '#ff8aa0';
    c.fillText('RUMBLE... a squeeze is coming!', W - 8, 12.5);
  } else {
    c.fillStyle = '#d7ef6a';
    c.fillText(`Stink: ${stinkName()} ${'💨'.repeat(Math.min(5, Math.ceil(stink / 3)))}`, W - 8, 12.5);
  }
  hudBottom(c);
}

// ---------- end: the Bristol Stool Chart ----------
function drawStool(c, type, x, y, gold) {
  const body = gold ? '#e2b235' : '#6b4220', dark = gold ? '#8a6410' : '#3a220c', shine = 'rgba(255,230,180,.45)';
  c.save(); c.translate(x, y);
  c.fillStyle = body; c.strokeStyle = dark; c.lineWidth = 1.6;
  const blob = (bx, by, r) => { c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill(); c.stroke(); };
  if (type === 1) [[-20, -3, 6], [-6, 6, 6.5], [8, -5, 6], [21, 5, 5.5]].forEach(b => blob(...b));
  else if (type === 2) for (let i = 0; i < 6; i++) blob(-25 + i * 10, Math.sin(i * 2) * 2, 8);
  else if (type === 3) {
    rr(c, -32, -9, 64, 18, 9); c.fill(); c.stroke();
    c.strokeStyle = dark; c.lineWidth = 1.2;
    for (const k of [-18, -4, 12, 24]) { c.beginPath(); c.moveTo(k, -9); c.lineTo(k + 3, -2); c.lineTo(k, 2); c.stroke(); }
  } else if (type === 4) {
    c.lineCap = 'round'; c.strokeStyle = dark; c.lineWidth = 19;
    c.beginPath(); c.moveTo(-32, 4); c.bezierCurveTo(-14, -14, 10, 14, 32, -4); c.stroke();
    c.strokeStyle = body; c.lineWidth = 16; c.stroke();
    c.strokeStyle = shine; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-28, -1); c.bezierCurveTo(-12, -15, 10, 7, 28, -8); c.stroke();
    if (gold) { c.fillStyle = '#fff6c0'; for (const [sx, sy] of [[-30, -16], [26, -20], [4, 16]]) { c.font = '12px Trebuchet MS'; c.fillText('✦', sx, sy); } }
  } else if (type === 5) [[-20, 2, 9], [0, -4, 10], [20, 4, 8.5]].forEach(b => blob(...b));
  else if (type === 6) {
    c.beginPath();
    for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI * 2, r = 15 + hash(i, 77) * 9; c.lineTo(Math.cos(a) * r * 1.6, Math.sin(a) * r * .8); }
    c.closePath(); c.fill(); c.stroke();
  } else {
    c.fillStyle = 'rgba(130,88,28,.8)'; c.beginPath(); c.ellipse(0, 6, 36, 8, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(130,88,28,.8)'; for (const [dx, dy] of [[-14, -8], [10, -12], [24, -4]]) blob(dx, dy, 3);
  }
  c.restore();
}
function drawBristol(golden) {
  const cv = document.getElementById('endArt'), c = cv.getContext('2d');
  const LABELS = ['hard lumps', 'lumpy', 'cracked', 'smooth', 'soft blobs', 'mushy', 'watery'];
  cv.hidden = false; c.clearRect(0, 0, cv.width, cv.height);
  c.textAlign = 'center'; c.font = 'bold 12px Trebuchet MS'; c.fillStyle = '#ffd88a';
  c.fillText('THE BRISTOL STOOL CHART', 320, 14);
  for (let i = 0; i < 7; i++) {
    const type = i + 1, x = 47 + i * 91;
    if (type === 4) { c.fillStyle = golden ? 'rgba(255,215,80,.22)' : 'rgba(199,224,79,.18)'; rr(c, x - 44, 22, 88, 126, 10); c.fill();
      c.strokeStyle = golden ? '#ffd750' : '#c7e04f'; c.lineWidth = 2; c.stroke(); }
    if (type === 7) { c.strokeStyle = '#ff8a8a'; c.lineWidth = 1.5; c.setLineDash([4, 3]); rr(c, x - 44, 22, 88, 126, 10); c.stroke(); c.setLineDash([]); }
    drawStool(c, type, x, 70, golden && type === 4);
    c.textAlign = 'center';
    c.fillStyle = '#f3e6d8'; c.font = 'bold 12px Trebuchet MS'; c.fillText('Type ' + type, x, 112);
    c.fillStyle = '#e8c9c0'; c.font = '11px Trebuchet MS'; c.fillText(LABELS[i], x, 127);
    c.font = 'bold 11px Trebuchet MS';
    if (type === 4) { c.fillStyle = golden ? '#ffd750' : '#d7ef6a'; c.fillText('★ YOU! ★', x, 142); }
    if (type === 7) { c.fillStyle = '#ff9a9a'; c.fillText('C. diff did this', x, 142); }
  }
}

// ---------- finale: out of the body and down the toilet ----------
function bathroom(c) {
  c.fillStyle = '#cfe6ee'; c.fillRect(0, 0, W, H);
  c.strokeStyle = '#b4d3de'; c.lineWidth = 2;
  for (let x = 0; x <= W; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 430); c.stroke(); }
  for (let y = 0; y <= 430; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  c.fillStyle = '#c9b597'; c.fillRect(0, 430, W, H - 430);
}
function bowlInside(c) {
  c.beginPath(); c.moveTo(272, 262); c.bezierCurveTo(286, 340, 340, 392, 440, 396); c.bezierCurveTo(520, 398, 610, 372, 628, 262); c.closePath();
}
// A cut-away toilet so we can see inside the bowl. swirl (0 to 1) spins the water.
function drawToilet(c, swirl) {
  c.fillStyle = '#f7f7f2'; c.strokeStyle = '#9fb0b6'; c.lineWidth = 3;
  rr(c, 610, 90, 150, 150, 14); c.fill(); c.stroke();                                       // cistern
  c.fillStyle = '#b8c4c8'; rr(c, 700, 110, 30, 10, 4); c.fill();                           // flush handle
  c.fillStyle = '#f7f7f2';
  c.beginPath(); c.moveTo(390, 330); c.lineTo(420, 430); c.lineTo(600, 430); c.lineTo(620, 300); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(250, 240); c.lineTo(690, 240); c.lineTo(690, 262); c.lineTo(640, 262);
  c.bezierCurveTo(620, 380, 520, 420, 440, 410); c.bezierCurveTo(330, 400, 280, 330, 272, 262); c.lineTo(250, 262); c.closePath();
  c.fill(); c.stroke();
  c.fillStyle = '#e2eaec'; bowlInside(c); c.fill();
  c.save(); bowlInside(c); c.clip();
  c.fillStyle = 'rgba(110,185,220,.8)'; c.fillRect(250, 330 + swirl * 30, 400, 120);
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(250, 330 + swirl * 30); c.lineTo(650, 330 + swirl * 30); c.stroke();
  if (swirl > 0) for (let i = 0; i < 6; i++) {
    c.beginPath(); c.arc(455, 372, 12 + i * 10, anim * 8 + i, anim * 8 + i + 2.2); c.stroke();
  }
  c.restore();
  c.strokeStyle = '#9fb0b6'; c.lineWidth = 3; c.fillStyle = '#ffffff';
  rr(c, 240, 228, 460, 16, 8); c.fill(); c.stroke();                                       // seat
}
function drawLog(c, x, y, rot, s = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = '#6b4220'; c.strokeStyle = '#3a220c'; c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(-60, 4); c.bezierCurveTo(-62, -18, -20, -20, 0, -16); c.bezierCurveTo(30, -12, 62, -16, 62, 2);
  c.bezierCurveTo(62, 18, 20, 16, 0, 16); c.bezierCurveTo(-30, 18, -58, 22, -60, 4); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(40,20,5,.6)'; c.lineWidth = 2;
  for (const k of [-30, 0, 28]) { c.beginPath(); c.moveTo(k - 4, -14); c.quadraticCurveTo(k + 3, 0, k - 2, 14); c.stroke(); }
  c.strokeStyle = 'rgba(255,220,170,.35)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-44, -10); c.quadraticCurveTo(0, -16, 44, -9); c.stroke();
  c.fillStyle = '#f2c933'; rr(c, 12, -4, 7, 6, 2); c.fill();                                // sweetcorn, of course
  c.restore();
}
function drawRiders(c, x, y, s = 2) {
  c.save(); c.translate(x, y); c.scale(s, s);
  drawZaal(c, -20, 0, 1, anim, false); drawGobbler(c, 2, 0, 1, anim, 0, 3); drawGoblet(c, 22, 0, -1, anim, false);
  c.restore();
}
function splash(c, x, y, u) {
  if (u > 1) return;
  c.fillStyle = `rgba(150,210,235,${1 - u})`;
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI * (.1 + .8 * hash(i, 4)), v = 160 + hash(i, 5) * 160;
    circle(c, x + Math.cos(a) * v * u, y + Math.sin(a) * v * u + 420 * u * u, 3 + hash(i, 6) * 3);
  }
}
// A comic speech bubble with its tail pointing down at (x, y).
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
// Big comic lettering, like "SLAM!" in a cartoon.
function boom(c, x, y, text, size, fill, rot = -.12) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.font = `bold ${size}px Trebuchet MS`; c.textAlign = 'center'; c.lineJoin = 'round';
  c.strokeStyle = '#2b070c'; c.lineWidth = size / 6; c.strokeText(text, 0, 0);
  c.fillStyle = fill; c.fillText(text, 0, 0);
  c.restore();
}
// Drops of toilet water flying up; u runs 0 to 1. height 1 is a small splash, 2 a big one.
function bigSplash(c, x, y, u, height) {
  if (u < 0 || u > 1.2) return;
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI * (.32 + .36 * hash(i, 4)), v = (200 + hash(i, 5) * 300) * height;
    const px = x + Math.cos(a) * v * u * .5, py = y + Math.sin(a) * v * u + 520 * height * u * u;
    if (py > y + 10) continue;
    c.fillStyle = `rgba(120,195,235,${Math.min(1, 1.3 - u)})`; circle(c, px, py, 4 + hash(i, 6) * 6);
  }
}
function drawPaper(c, x, y, rot) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = '#fbfbf6'; c.strokeStyle = '#b9c6ca'; c.lineWidth = 2;
  rr(c, -55, -70, 110, 140, 6); c.fill(); c.stroke();
  c.setLineDash([4, 5]); c.beginPath(); c.moveTo(-55, -2); c.lineTo(55, -2); c.stroke(); c.setLineDash([]);
  c.strokeStyle = 'rgba(180,195,200,.5)';
  for (let i = -3; i <= 3; i++) for (let k = -2; k <= 2; k++) { c.beginPath(); c.arc(i * 15, k * 26 + 6, 2, 0, 7); c.stroke(); }  // quilting
  c.restore();
}
function hand(c, x, y, f) {
  c.save(); c.translate(x, y); c.scale(f, 1);
  c.fillStyle = '#d99a72'; c.strokeStyle = '#8a5a3a'; c.lineWidth = 2.5;
  c.beginPath(); c.ellipse(0, 0, 60, 34, -.2, 0, 7); c.fill(); c.stroke();
  for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(52, -26 + i * 15, 22, 7, -.2, 0, 7); c.fill(); c.stroke(); }
  c.beginPath(); c.ellipse(-8, -34, 9, 20, .9, 0, 7); c.fill(); c.stroke();
  c.restore();
}
// fin.cues holds which sound cues have played in the current scene.
function cue(name, t, at, play) { if (t >= at && !fin.cues.has(name)) { fin.cues.add(name); play(); } }
const freshCues = () => { fin.cues = new Set(); };
const FINALE = [
  { dur: 2.6, onShow: freshCues,
    text: 'Upstairs, the brain spots a toilet! The person sprints in and slams the door. Phew, just in time!',
    draw(c, t) {
      c.fillStyle = '#ead9b8'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#c9b597'; c.fillRect(0, 410, W, H - 410);
      c.fillStyle = '#8a6a48'; c.fillRect(0, 400, W, 12);
      const shut = t > 1.1, shake = shut && t < 1.8 ? Math.sin(t * 60) * 4 : 0;
      c.save(); c.translate(shake, 0);
      c.fillStyle = '#5a3a1e'; c.fillRect(372, 52, 216, 352);                                  // frame
      c.fillStyle = '#9a6a3a'; c.fillRect(384, 64, 192, 340);                                  // door
      c.strokeStyle = '#7a4e26'; c.lineWidth = 4; c.strokeRect(404, 88, 152, 120); c.strokeRect(404, 230, 152, 150);
      c.fillStyle = '#e8c860'; circle(c, 554, 240, 9);
      c.fillStyle = '#fff'; rr(c, 440, 110, 80, 44, 8); c.fill();
      c.font = '30px Trebuchet MS'; c.textAlign = 'center'; c.fillText('🚽', 480, 144);
      c.restore();
      if (!shut) {                                                                             // whoosh of someone running in
        const x = 140 + t * 200;
        c.strokeStyle = 'rgba(90,60,30,.6)'; c.lineWidth = 4;
        for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x - 140, 200 + i * 40); c.lineTo(x - 20, 200 + i * 40); c.stroke(); }
        for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(200,180,150,.7)'; circle(c, x - 150 - i * 22, 395 - hash(i, 2) * 20, 12 + i * 3); }
      }
      bubble(c, 170, 128, 'TOILET FOUND!', 22);
      c.font = '40px Trebuchet MS'; c.textAlign = 'center'; c.fillText('🧠', 150, 160);
      if (shut) boom(c, 690, 170, 'SLAM!', 64, '#ffd84a');
      if (t > 1.9) bubble(c, 480, 50, 'Phew!', 20);
      cue('slam', t, 1.1, () => sfx('splat'));
    } },
  { dur: 2.8, onShow: freshCues,
    text: 'Down below, Zaal zaps the outer sphincter. It opens up like a camera lens, and there\'s light at the end of the tunnel!',
    draw(c, t) {
      const ox = 480, oy = 210, open = clamp((t - .9) / 1, 0, 1);
      c.fillStyle = '#4a1414'; c.fillRect(0, 0, W, H);
      for (let i = 9; i >= 1; i--) {                                                            // rings of the rectum, shrinking into the distance
        const r = i * 62 + Math.sin(anim * 2 + i) * 4;
        c.fillStyle = i % 2 ? '#a8404a' : '#8a3038';
        c.beginPath(); c.ellipse(ox, oy, r * 1.25, r * .82, 0, 0, 7); c.fill();
        c.strokeStyle = 'rgba(255,190,190,.25)'; c.lineWidth = 3; c.stroke();
      }
      const g = c.createRadialGradient(ox, oy, 2, ox, oy, 4 + open * 66);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#fff2b0');
      c.fillStyle = '#2a0608'; c.beginPath(); c.arc(ox, oy, 100, 0, 7); c.fill();
      c.fillStyle = g; c.beginPath(); c.arc(ox, oy, 4 + open * 66, 0, 7); c.fill();
      const hole = 4 + open * 66;                                                              // the sphincter: a ring of muscle
      c.fillStyle = '#b8505e'; c.beginPath(); c.arc(ox, oy, 100, 0, 7); c.moveTo(ox + hole, oy); c.arc(ox, oy, hole, 0, 7, true); c.fill('evenodd');
      c.strokeStyle = '#6a1c26'; c.lineWidth = 3; c.beginPath(); c.arc(ox, oy, 100, 0, 7); c.stroke();
      c.lineWidth = 2;
      for (let i = 0; i < 16; i++) {                                                         // puckered folds
        const a = i / 16 * Math.PI * 2 + open * .6, w = .12 * (1 - open * .7);
        c.beginPath(); c.moveTo(ox + Math.cos(a) * hole, oy + Math.sin(a) * hole);
        c.quadraticCurveTo(ox + Math.cos(a + w) * (hole + 100) / 2, oy + Math.sin(a + w) * (hole + 100) / 2, ox + Math.cos(a) * 96, oy + Math.sin(a) * 96);
        c.stroke();
      }
      c.strokeStyle = '#4a0e16'; c.lineWidth = 4; c.beginPath(); c.arc(ox, oy, hole, 0, 7); c.stroke();
      const by = 400 + Math.sin(t * 3) * 3;
      drawLog(c, 480, by, 0, 1.3); drawRiders(c, 480, by - 21, 2.2);
      if (t > .5 && t < 1.2) {                                                                  // Zaal's zap
        c.strokeStyle = '#fff36a'; c.lineWidth = 5; c.shadowColor = '#ffee55'; c.shadowBlur = 20;
        c.beginPath(); c.moveTo(436, by - 90);
        for (let i = 1; i <= 6; i++) c.lineTo(436 + (ox - 436) * i / 6 + (i % 2 ? 18 : -18), by - 90 + (oy - by + 90) * i / 6);
        c.stroke(); c.shadowBlur = 0;
      }
      if (t > .5) bubble(c, 400, 280, 'ZAP!', 18);
      if (t > 1.7) bubble(c, 590, 300, 'Is that... daylight?', 16);
      cue('zap', t, .5, () => sfx('zap'));
      cue('open', t, 1, () => sfx('squelch'));
    } },
  { dur: 2.8, onShow: freshCues,
    text: 'BOMBS AWAY! PLOP! The splash flies all the way back up. That\'s called splashback. Eww!',
    draw(c, t) {
      bathroom(c); drawToilet(c, 0);
      const land = 1.1, y = t < land ? -90 + 420 * (t / land) ** 2 : 330 + Math.sin((t - land) * 7) * 6 * Math.max(0, 1 - (t - land));
      drawLog(c, 450, y, .05 + (t < land ? Math.sin(t * 9) * .08 : 0), 1.2); drawRiders(c, 450, y - 19);
      if (t < land) bubble(c, 450, y - 75, 'AAAAAAAH!', 18);
      bigSplash(c, 450, 330, (t - land) * .9, 2.2);
      if (t > land + .35) boom(c, 450, 120, 'SPLASHBACK!', 58, '#8fd6ff', -.06);
      cue('plop', t, land, () => sfx('plop'));
      cue('splash', t, land + .15, () => sfx('sploosh'));
    } },
  { dur: 3, onShow: freshCues,
    text: 'A perfect Type 4! The judges hold up their scores: ten, nine and a half, and ten. Gobbler took off half a point for the smell.',
    draw(c, t) {
      bathroom(c); drawToilet(c, 0);
      const y = 330 + Math.sin(t * 2) * 3;
      drawLog(c, 450, y, .05, 1.2); drawRiders(c, 450, y - 19);
      c.strokeStyle = 'rgba(120,160,40,.7)'; c.lineWidth = 3;                                 // stink lines
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        for (let k = 0; k <= 8; k++) c.lineTo(310 + i * 290 * .5 + Math.sin(k + t * 4 + i) * 6, 300 - k * 9 - (t * 20) % 20);
        c.stroke();
      }
      [['10', 395, .4, 0], ['9.5', 455, .9, 16], ['10', 515, 1.4, 0]].forEach(([n, x, at, up]) => {   // score cards over each hero
        if (t < at) return;
        const pop = Math.min(1, (t - at) * 6), cy0 = y - 125 - up;
        c.save(); c.translate(x, cy0); c.scale(pop, pop);
        c.fillStyle = '#fff'; c.strokeStyle = '#2b070c'; c.lineWidth = 2.5; rr(c, -23, -22, 46, 40, 6); c.fill(); c.stroke();
        c.fillStyle = '#2b070c'; c.fillRect(-2, 18, 4, 30 + up);
        c.fillStyle = n === '9.5' ? '#c0392b' : '#23360a'; c.font = 'bold 24px Trebuchet MS'; c.textAlign = 'center'; c.fillText(n, 0, 7);
        c.restore();
      });
      if (t > 1.8) bubble(c, 610, 200, 'Minus half a point. PEE-YEW!', 15);
      c.fillStyle = '#c7e04f'; rr(c, 60, 70, 180, 64, 14); c.fill();
      c.fillStyle = '#23360a'; c.font = 'bold 30px Trebuchet MS'; c.textAlign = 'center'; c.fillText('TYPE 4 ✓', 150, 113);
      cue('c1', t, .4, () => sfx('saved')); cue('c2', t, .9, () => sfx('saved')); cue('c3', t, 1.4, () => sfx('saved'));
      cue('toot', t, 2, () => sfx('fart', .15));
    } },
  { dur: 2.4, onShow: freshCues,
    text: 'Uh-oh. Incoming toilet paper! Everybody duck!',
    draw(c, t) {
      bathroom(c); drawToilet(c, 0);
      const y = 330 + Math.sin(t * 2) * 3, duck = t > 1 ? Math.min(10, (t - 1) * 30) : 0;
      drawLog(c, 450, y, .05, 1.2); drawRiders(c, 450, y - 19 + duck);
      for (let i = 0; i < 3; i++) {
        const py = -160 + t * 170 - i * 70;
        drawPaper(c, 330 + i * 120 + Math.sin(t * 3 + i * 2) * 25, Math.min(py, 270 - i * 10), Math.sin(t * 2 + i) * .3);
      }
      bubble(c, 450, y - 80 + duck, t < 1 ? 'INCOMING!' : t < 1.9 ? 'DUCK!' : 'Mmmf!', 20);
      cue('swish', t, .2, () => sfx('slime'));
    } },
  { dur: 3, onShow() { freshCues(); sfx('flush'); },
    text: 'Somebody pulls the flush... WHOOOOOSH!',
    draw(c, t) {
      bathroom(c);
      const u = Math.min(1, t / 2.6);
      drawToilet(c, u);
      c.save(); c.translate(450 + 6 * u, 330 + 45 * u); c.rotate(t * 7 * u); c.scale(1 - u * .85, 1 - u * .85);
      drawLog(c, 0, 0, 0, 1.2); drawRiders(c, 0, -19);
      c.restore();
      if (t > .4) bubble(c, 250, 210, 'Wheeee!', 18);
      if (t > 1.1) bubble(c, 690, 205, 'I feel sick...', 16);
      if (t > 1.8) bubble(c, 470, 120, 'Best. Day. EVER!', 20);
    } },
  { dur: 3.2, onShow: freshCues,
    text: 'Round the U-bend we go, with the C. diff spores tumbling after. Bye bye, germs!',
    draw(c, t) {
      c.fillStyle = '#1c2a30'; c.fillRect(0, 0, W, H);
      const path = [[-60, 120], [180, 300], [420, 400], [640, 360], [800, 200], [1040, 120]];
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (const [w, col] of [[150, '#e8eef0'], [126, '#5a7f8c'], [110, 'rgba(110,185,220,.85)']]) {
        c.strokeStyle = col; c.lineWidth = w; c.beginPath(); path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      }
      const u = Math.min(1, t / 3.2), [x, y] = alongPath(path, u * .9 + .03), [x2, y2] = alongPath(path, Math.min(1, u * .9 + .05));
      drawLog(c, x, y, Math.atan2(y2 - y, x2 - x), 1); drawRiders(c, x, y - 16, 1.7);
      for (let i = 1; i <= 3; i++) {
        const [sx, sy] = alongPath(path, Math.max(0, u * .9 + .03 - i * .07));
        c.save(); c.translate(sx, sy); c.rotate(t * 5 + i); c.scale(2.2, 2.2); drawSpore(c, 0, 0, t); c.restore();
      }
      bubble(c, x + 10, y - 80, 'Bye bye, germs!', 18);
    } },
  { dur: 3.2, onShow: freshCues,
    text: 'The poo water flows all the way to the sewage works. There, even more helpful bacteria gobble up the mess and help clean the water!',
    draw(c, t) {
      let g = c.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, '#9fd3f0'); g.addColorStop(1, '#dff1f8');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = '#8fb55a'; c.fillRect(0, 300, W, H - 300);
      c.fillStyle = '#5a6a70'; rr(c, 40, 30, 290, 50, 8); c.fill();
      c.fillStyle = '#fff'; c.font = 'bold 26px Trebuchet MS'; c.textAlign = 'center'; c.fillText('SEWAGE WORKS', 185, 65);
      for (let k = 0; k < 2; k++) {                                                            // two cut-away tanks
        const tx = 120 + k * 400;
        c.fillStyle = '#b9c2c4'; rr(c, tx, 170, 330, 220, 12); c.fill();
        c.fillStyle = '#7a5a24'; c.fillRect(tx + 14, 200, 302, 176);
        for (let i = 0; i < 14; i++) {                                                         // air bubbles feeding the bacteria
          const bx = tx + 24 + hash(i, k) * 282, by = 376 - ((t * 60 + hash(i, k + 5) * 176) % 176);
          c.strokeStyle = 'rgba(230,240,240,.7)'; c.lineWidth = 1.5; c.beginPath(); c.arc(bx, by, 3 + hash(i, 9) * 3, 0, 7); c.stroke();
        }
        for (let i = 0; i < 3; i++) {                                                          // bacteria munching poo crumbs
          const bx = tx + 70 + i * 95, by = 290 + Math.sin(t * 3 + i + k) * 10, crumb = Math.max(0, 1 - ((t * .8 + i * .3) % 1.2));
          c.fillStyle = '#4a2e10'; circle(c, bx + 26, by, 9 * crumb);
          c.save(); c.translate(bx, by); c.scale(2.6, 2.6); drawBact(c, 0, 0, 1, t + i, 'home', (i + k) % 3); c.restore();
          if (Math.sin(t * 8 + i) > .7) { c.fillStyle = '#fff'; c.font = 'bold 13px Trebuchet MS'; c.fillText('nom!', bx + 4, by - 26); }
        }
      }
      drawLog(c, 480, 150, 0, .8); drawRiders(c, 480, 136, 1.4);
      bubble(c, 600, 100, 'We made it!', 16);
    } },
  { dur: 4.2, onShow: freshCues,
    text: 'Back upstairs, the person washes their hands with soap for 20 seconds. That\'s about as long as singing Happy Birthday twice! Hand gel can\'t kill C. diff spores, but soap washes them away.',
    draw(c, t) {
      c.fillStyle = '#dff1f5'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#f7f7f2'; c.strokeStyle = '#9fb0b6'; c.lineWidth = 3;                    // sink
      c.beginPath(); c.moveTo(200, 330); c.lineTo(760, 330); c.quadraticCurveTo(750, 470, 480, 470); c.quadraticCurveTo(210, 470, 200, 330); c.fill(); c.stroke();
      c.fillStyle = '#b8c4c8'; rr(c, 455, 150, 50, 20, 6); c.fill(); rr(c, 470, 150, 20, 70, 6); c.fill();
      const rub = Math.sin(t * 9) * 14;
      hand(c, 420 + rub, 270, 1); hand(c, 540 - rub, 290, -1);
      for (let i = 0; i < 22; i++) {                                                           // soap bubbles, some with a spore trapped inside
        const life = (t * (.25 + hash(i, 2) * .2) + hash(i, 3)) % 1, r = 6 + hash(i, 4) * 14;
        const bx = 380 + hash(i, 1) * 200 + Math.sin(life * 6 + i) * 10, by = 300 - life * 260;
        if (life > .92) { c.fillStyle = '#fff'; c.font = 'bold 12px Trebuchet MS'; c.textAlign = 'center'; c.fillText('pop!', bx, by); continue; }
        if (i % 4 === 0) { c.save(); c.translate(bx, by); c.scale(.9, .9); drawSpore(c, 0, 0, t); c.restore(); }
        c.strokeStyle = 'rgba(150,195,230,.85)'; c.lineWidth = 2; c.beginPath(); c.arc(bx, by, r, 0, 7); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.7)'; circle(c, bx - r * .35, by - r * .35, r * .25);
      }
      const secs = Math.min(20, Math.floor(t / 4 * 20));                                      // the 20-second timer
      c.fillStyle = '#2b070c'; rr(c, 790, 60, 130, 80, 12); c.fill();
      c.fillStyle = secs >= 20 ? '#c7e04f' : '#ffd84a'; c.font = 'bold 44px Trebuchet MS'; c.textAlign = 'center';
      c.fillText(`${secs}s`, 855, 117);
      bubble(c, 230, 200, secs >= 20 ? 'Squeaky clean! ✓' : 'Happy birthday to youuu ♪', 17);
      c.save(); c.translate(130, 330); c.scale(2.6, 2.6); drawZaal(c, 0, 0, 1, anim, false); c.restore();
      cue('ding', t, 4, () => sfx('win'));
    } },
];

// ---------- story ----------
Object.assign(IMG, {
  goblet: portrait(c => drawGoblet(c, 32, 56, 1, 0, false)),
  bact: portrait(c => { c.translate(32, 37); c.scale(1.8, 1.8); drawBact(c, 0, 0, 1, 0, 'home', 0); }),
  bact2: portrait(c => { c.translate(32, 37); c.scale(1.8, 1.8); drawBact(c, 0, 0, -1, 0, 'home', 1); }),
  bact3: portrait(c => { c.translate(32, 37); c.scale(1.8, 1.8); drawBact(c, 0, 0, 1, 0, 'home', 2); }),
  cdiff: portrait(c => { c.translate(32, 37); c.scale(1.4, 1.4); drawCdiff(c, 0, 0, 1, .5); }),
  spore: portrait(c => { c.translate(32, 38); c.scale(1.8, 1.8); drawSpore(c, 0, 0, 0); }),
  crapsule: portrait(c => {
    c.fillStyle = 'rgba(200,240,210,.5)'; rr(c, 12, 29, 40, 18, 9); c.fill();
    c.fillStyle = '#c9a26a'; c.fillRect(32, 29, 16, 18); rr(c, 40, 29, 12, 18, 9); c.fill();
    drawBact(c, 22, 38, 1, 0, 'home', 0);
    c.strokeStyle = '#fff'; c.lineWidth = 1; rr(c, 12, 29, 40, 18, 9); c.stroke();
  }),
});
const STORY = [
  `<h1>ZAAL vs GERMS</h1><h2>Level 2 · The Great Poo Escape</h2>
   <div class="pics"><img src="${IMG.zaal}"><img src="${IMG.bact}"><img src="${IMG.cdiff}"></div>
   <p>Remember the person whose stomach ulcer we fixed? Their tummy feels much better. But now it's gurgling, and they keep running to the toilet!</p>
   <p>Zaal has flown further down the gut, into the ${Wd('large intestine')}. Its other name is the ${Wd('colon')} <span class="pron">(say "KOH-lon")</span>. It's the last part of the gut, where poo is made.</p>
   <p class="tip nospeak">Tap any <span class="w" data-w="colon">underlined word</span> to find out what it means.</p>`,
  `<h2>What went wrong?</h2>
   <div class="pics"><img src="${IMG.bact}"><img src="${IMG.bact2}"><img src="${IMG.bact3}"></div>
   <p>Your colon is home to trillions of <b>good</b> ${Wd('bacteria')}. They help break down food, and they fill up all the space so bad germs can't move in. All the tiny living things in your gut together are called your ${Wd('microbiome')}.</p>
   <p>Last week the person had a bad ear infection, so the doctor gave them ${Wd('antibiotic', 'antibiotics')}: medicine that kills bacteria.</p>
   <p>The antibiotics killed the germs in the ear... but they also wiped out loads of the good bacteria in the gut. Oops!</p>`,
  `<h2>A bully moves in</h2>
   <div class="pics"><img src="${IMG.cdiff}"><img src="${IMG.spore}"></div>
   <p>With the good bacteria gone, a nasty germ called ${Wd('C. diff')} <span class="pron">(say "see DIFF")</span> moved into the empty space. It makes ${Wd('toxin', 'toxins')}, which are poisons. They hurt the colon wall and cause ${Wd('diarrhoea')}: very, very runny poo.</p>
   <p>C. diff has a sneaky trick. When it's in danger, it turns into a ${Wd('spore')}: a tough, armoured shell that's really hard to destroy.</p>
   <p>Everything down here is SLOPPY. And the smell! Pee-yew!</p>`,
  `<h2>The cure: a poo transplant!</h2>
   <div class="pics"><img src="${IMG.crapsule}"></div>
   <p>Doctors have a real cure for this, and it's brilliantly gross. It's called a ${Wd('poo transplant')}: good bacteria from a healthy person's poo are put into the poorly person's gut.</p>
   <p>The bacteria can even come in pills. Their real nickname is <b>"crapsules"</b>! (Don't worry, they're sealed and clean.)</p>
   <p>A crapsule has just landed in the colon with <b>10 good bacteria</b> inside. They need to reach the <b>bare colon wall</b> and move in, so there's no room left for C. diff.</p>`,
  `<h2>Meet your team</h2>
   <div class="team">
     <div class="card"><img src="${IMG.zaal}"><b>1 · Zaal</b><span>The explorer. He can <b>super-jump</b>, and he can zap a ${Wd('nerve')} to open a ${Wd('sphincter')} <span class="pron">(SFINK-ter)</span>: a ring of muscle that squeezes shut.</span></div>
     <div class="card"><img src="${IMG.gob}"><b>2 · Gobbler</b><span>Our hungry ${Wd('macrophage')}. He <b>swallows C. diff</b>. But if one turns into a spore, it's too tough for him!</span></div>
     <div class="card"><img src="${IMG.goblet}"><b>3 · Goblet</b><span>New! A ${Wd('goblet cell')}, shaped like a wine glass. She squirts ${Wd('mucus')}: <b>slime</b> for poo boulders and <b>mucus rafts</b> across the swamp.</span></div>
   </div>
   <p class="tip">Patch stayed behind in the stomach to keep the ulcer patched up.</p>`,
  `<h2>Your mission</h2>
   <ul>
     <li>Get at least <b>7 of the 10</b> good bacteria to the <b>bare pink wall</b>. Then get all 3 heroes out through the ${Wd('rectum')}.</li>
     <li>Good bacteria walk by themselves. A hero standing still is a wall that turns them around.</li>
     <li>If a bacterium falls in the swamp or gets bullied by C. diff, it pops back into the crapsule for another go. No rush!</li>
     <li><b>Gas vents</b> float you up. Yes, they're farts. 💨</li>
     <li>Squishy poo sinks if you stand still on it. Keep moving!</li>
     <li>Bacteria can't cross the dry crack. Goblet slimes the poo boulders, then any hero can push them in.</li>
     <li>Now and then a big ${Wd('peristalsis')} <span class="pron">(PERRY-stal-sis)</span> squeeze rolls by. It makes everyone hop and sweeps spores away.</li>
   </ul>
   <p class="keys" style="text-align:center"><span class="nospeak"><kbd>←</kbd> <kbd>→</kbd> move · <kbd>Space</kbd> jump · <kbd>E</kbd> use power ·
     <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> or <kbd>Tab</kbd> switch hero · <kbd>R</kbd> open the crapsule</span></p>`,
];
const FLY = [
  { cam: [200, 420, 1], path: [[430, 130], [330, 160]], labels: ['stomach', 'small intestine', 'large intestine'],
    text: 'Back to our person! We fixed their stomach ulcer, but now their tummy is gurgling and they keep running to the toilet. Something is wrong further down...' },
  { cam: [236, 380, 3.6], path: [[330, 160], [300, 300], [246, 366]], labels: ['stomach'],
    text: 'Zaal\'s tiny ship zooms back down into the stomach...' },
  { cam: [204, 448, 3.4], path: [[246, 366], [236, 404], [214, 434], [182, 446], [222, 458], [186, 470]], labels: ['small intestine'],
    text: `...and on into the ${Wd('small intestine')}: a long, thin tube about 6 metres long, all coiled up! It's lined with millions of tiny fingers called ${Wd('villi')} <span class="pron">(say "VIL-eye")</span>, like a fluffy carpet.` },
  { cam: [156, 468, 4.2], path: [[186, 470], [166, 478], [150, 484]], labels: ['appendix', 'large intestine'],
    text: `Into the ${Wd('large intestine')}! That little dead-end tube is the ${Wd('appendix')}. It's on the person's right side, so it's on our left as we look at them.` },
  { cam: [196, 420, 3.6], path: [[150, 484], [149, 422], [166, 412], [200, 412]], labels: ['large intestine'],
    text: `Up, then across the top. The large intestine is also called the ${Wd('colon')}. It's wide, and about 1.5 metres long.` },
  { cam: [204, 412, 70], path: [[200, 412], [204, 412]], labels: [], fade: 'rgba(62,28,20,A)',
    text: 'Zoom in close... Uh-oh. It is VERY runny down here. And what is that SMELL?!' },
];
// Appendix, the last bend of the colon and the rectum, plus runny poo and C. diff inside.
function flyExtras(c) {
  c.strokeStyle = '#d99a72'; c.lineCap = 'round';
  c.lineWidth = 4; c.beginPath(); c.moveTo(147, 488); c.quadraticCurveTo(140, 500, 147, 507); c.stroke();
  c.lineWidth = 10; c.beginPath(); c.moveTo(252, 484); c.quadraticCurveTo(252, 506, 226, 502); c.quadraticCurveTo(202, 498, 202, 516); c.lineTo(202, 526); c.stroke();
  c.fillStyle = 'rgba(120,80,20,.6)';
  for (let i = 0; i < 18; i++) circle(c, 158 + i * 5, 412 + Math.sin(i * 1.7) * 2, 1.4);
  c.fillStyle = '#c9a03a';
  for (let i = 0; i < 9; i++) circle(c, 166 + i * 8 + Math.sin(anim * 3 + i) * 1.2, 412 + Math.cos(anim * 2 + i * 2) * 2.5, .6);
}

return {
  num: 2, code: 'PLOP', award: 'BURP', title: 'Level 2 · The Great Poo Escape',
  facts: FACTS, exit: EXIT, escort: { total: BAC_TOTAL, need: BAC_NEED, color: '#62d4b4' },
  solid, reset, usePower, update, render, renderBackground: paintBackground, renderTerrain: paintTerrain,
  story: STORY, fly: FLY, finale: FINALE, flyExtras,
  lines: [...BRAIN_LINES.map(b => b[1]), ...Object.values(BRAIN)].map(t => 'Brain says: ' + t),
  dbg: () => ({ stink, oops, innerOpen, outerOpen, wave }),   // for testing from the console
  onStart() { setTimeout(() => fact('antibiotic'), 1500); setTimeout(() => fact('colon'), 16000); },
  onRelease() { say(heroes[active], 'Pop! Here they come!', '#bff7c9'); sfx('plop'); fact('crapsule'); },
};
})();
