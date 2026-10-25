'use strict';
// ---------- Level 3 · Wart Undercover (the palm of Zaal's left hand) ----------
LEVELS[3] = (() => {
const TC_TOTAL = 10, TC_NEED = 7, TC_SPEED = 32, TC_GAP = 2.2;
const EXIT = { x: 38 * T, y: 14 * T, w: T, h: 4 * T };          // the sweat pore, corked until the King is beaten
const HOME = { x: 34 * T, y: 13 * T, w: 4 * T, h: 5 * T };      // King Papilloma's chamber
const KING = { x: 36.6 * T, y: 18 * T };
const LYMPH = { x: 4 * T + 12, y: 18 * T };                     // where Langer raises the alarm
const CAP = { x: 6 * T + 12, y: 18 * T };                       // the capillary the T cells squeeze out of
const LIFT = { x: 24 * T, w: 2 * T, top: 14 * T - 2 };          // sweat duct: floats things up to the platform
const KER = 5, CORK = 6;
const NAIL_FIRST = 40, NAIL_EVERY = 45, NAIL_SPEED = 260;
const NAMES = ['Killer Tilly', 'Killer Theo', 'Killer Tess', 'Killer Tariq', 'Killer Tom', 'Killer Tara',
  'Killer Toby', 'Killer Tamsin', 'Killer Ted', 'Killer Tia'];
const SIZE = ['GONE!', 'Teeny', 'Small', 'Smallish', 'Medium', 'Big', 'Huge', 'MEGA'];
const BRAIN_LINES = [[20, 'Hmm. This lump on my hand feels all rough.'], [75, 'I keep rubbing it with my thumb...'],
  [130, 'It\'s SO tempting to pick it...'], [200, 'Must... not... pick...'],
  [270, 'Are you nearly done down there? I want to go swimming!']];
const BRAIN = {
  pick1: 'Oops! I picked it. Sorry down there!',
  pick2: 'I did it AGAIN! My fingers just won\'t listen!',
  early: 'Hey! Nobody has told my immune system yet!',
  alarm: 'Ooh, my wart feels a bit sore. Is something happening down there?',
  win: 'My wart is shrinking! Thanks, mini-me!',
};
const KING_OW = ['OUCH!', 'Who told on me?!', 'Not the T cells!', 'Ow ow ow!', 'My lovely wart!', 'Stop it!', 'Nooo!'];

// ---------- body facts ----------
const FACTS = {
  hpv: 'Warts are caused by <b>HPV</b>, the human papillomavirus. There are more than <b>200</b> kinds of HPV!',
  verruca: 'A <b>verruca</b> is a wart on the sole of your foot. A wart on your hand is a <b>common wart</b>. Its posh name is verruca vulgaris!',
  otherKind: 'Getting rid of one kind of wart virus doesn\'t protect you from the other kinds. That\'s why you can get a new wart somewhere else.',
  lucidum: 'Your palms and soles have the <b>thickest skin</b> on your body. They even have an extra see-through layer that most skin doesn\'t have!',
  tinyVirus: 'Viruses are tiny. About <b>10</b> wart viruses side by side would only just stretch across one bacterium!',
  shape: 'The wart virus is shaped like a <b>20-sided dice</b>. That shape is called an <b>icosahedron</b> (say "eye-koss-uh-HEE-drun").',
  keratin: 'Your hair, your nails and the tough top layer of your skin are all made of <b>keratin</b>. A wart is a lump of extra keratin.',
  dots: 'The black dots in a wart are not seeds! They are tiny <b>blood vessels</b> that grew into the wart and clotted.',
  noBlood: 'The <b>epidermis</b>, the top part of your skin, has no blood vessels. That makes it a great hiding place, because most immune cells travel in your blood.',
  hiding: 'Wart viruses don\'t burst the cells they live in, so nothing sets off the alarm. That\'s why warts can last for months or years.',
  papilloma: '<b>Papilloma</b> means a lump made of little bumps. "Papilla" is Latin for a tiny bump.',
  langerhans: '<b>Langerhans cells</b> are named after Paul Langerhans. He discovered them in 1868, when he was a 21-year-old student!',
  lymph: 'In real life, a Langerhans cell crawls all the way to a <b>lymph node</b>, the immune system\'s training camp, to show the T cells what to hunt.',
  tcell: '<b>Killer T cells</b> check the cells they touch. If a cell is infected, they make it self-destruct!',
  macrophage: '<b>Macrophages</b> can swallow virus particles whole. But a virus hiding inside a skin cell is out of their reach.',
  sweat: 'Your palms and the soles of your feet have more <b>sweat glands</b> than almost anywhere else on your body. That\'s why they get sweaty when you\'re nervous!',
  picking: '<b>Don\'t pick or bite warts!</b> It can spread the virus to your other fingers, and to the skin around your nails.',
  acid: '<b>Salicylic acid</b> softens the wart so it comes off one thin layer at a time. You put it on every day for up to <b>12 weeks</b>.',
  inflame: 'A wart that\'s about to go can turn darker or a bit sore. That can be a sign the immune system has found it!',
  wait: 'Most warts in children go away on their own. About <b>half</b> are gone within a year.',
  freeze: 'Doctors can freeze warts with <b>liquid nitrogen</b> at <b>minus 196 degrees Celsius</b>. A blister forms underneath, and the wart drops off.',
};

Object.assign(GLOSS, {
  wart: ['WORT', 'A small, hard, rough lump on the skin, caused by a virus.'],
  verruca: ['vuh-ROO-kuh', 'A wart on the sole of your foot.'],
  virus: ['VY-rus', 'A germ even smaller than bacteria. It can only make copies of itself inside your cells.'],
  HPV: ['aitch pee vee', 'Short for human papillomavirus: the virus that causes warts.'],
  epidermis: ['eh-pee-DER-mis', 'The top part of your skin. It has no blood vessels.'],
  dermis: ['DER-mis', 'The thick layer of skin under the epidermis, with blood vessels, nerves and sweat glands.'],
  keratin: ['KERRA-tin', 'A tough material that makes your hair, your nails and the top layer of your skin.'],
  'salicylic acid': ['sal-ih-SIL-ik', 'A wart medicine. It softens the wart so it comes off one layer at a time.'],
  'liquid nitrogen': ['NY-truh-jen', 'Super-cold liquid that doctors use to freeze warts off.'],
  'Langerhans cell': ['LANG-er-hans', 'An immune cell that lives in the skin and looks out for germs.'],
  'lymph vessel': ['LIMF', 'A thin tube that carries clear lymph fluid to the lymph nodes.'],
  'lymph node': ['LIMF', 'A small bean-shaped lump where immune cells meet and learn which germs to fight.'],
  'killer T cell': ['', 'A white blood cell that finds infected cells and makes them self-destruct.'],
  capillary: ['ka-PILL-uh-ree', 'The tiniest kind of blood vessel. Its wall is just one cell thick.'],
  'sweat gland': ['SWET', 'A coiled tube deep in your skin that makes sweat.'],
  papilloma: ['pap-ih-LOH-muh', 'A lump made of little bumps, like a wart.'],
});
Object.assign(ORGANS, { 'left hand': [334, 490] });

// ---------- level ----------
let alarm, kingHP, kingDead, kingGone, kingHit, puffT, meltQ, meltAcc, meltWall, wallOpen, domeOpen;
let nameI, brainI, oops, nail, gulps, firstSplish;
let brainTimer = 0;
const fin = {};
const fx = f => { if (!muted && actx) f(); };
// Tiles: 1 tough top skin (ceiling and side walls), 9 dermis floor, 4 stacked skin cells, 5 keratin (acid melts it),
// 6 keratin cork in the sweat pore. Columns 1-2 are the sweat gland pit.
function buildGrid() {
  const g = [];
  for (let y = 0; y < ROWS; y++) g.push(new Array(COLS).fill(0));
  for (let x = 0; x < COLS; x++) { for (let y = 0; y < 3; y++) g[y][x] = 1; for (let y = 18; y < ROWS; y++) g[y][x] = 9; }
  for (let y = 0; y < ROWS; y++) { g[y][0] = 1; g[y][COLS - 1] = 1; }
  for (let y = 18; y < ROWS; y++) { g[y][1] = 0; g[y][2] = 0; }                  // the sweat gland
  for (let y = 3; y < 18; y++) { g[y][17] = KER; g[y][18] = KER; }               // keratin wall
  for (let x = 26; x <= 32; x++) for (let y = 14; y < 18; y++) g[y][x] = 4;      // platform of skin cells
  for (let y = 3; y < 14; y++) g[y][33] = KER;                                   // the keratin dome round the King
  g[16][33] = 4; g[17][33] = 4;                                                   // a step down into his chamber
  for (let y = 14; y < 18; y++) g[y][38] = CORK;                                 // the corked sweat pore
  return g;
}
const solid = t => t === 1 || t === 4 || t === 9 || t === KER || t === CORK;
function tileAt(x, y) {
  const c = Math.floor(x / T), r = Math.floor(y / T);
  return r >= 0 && r < ROWS && c >= 0 && c < COLS ? grid[r][c] : 0;
}
function virus(c, r) {
  return Object.assign(makeGerm(c, r), { w: 14, h: 14, y: (r + 1) * T - 14 - .01, speed: 16 + Math.random() * 8, range: 1.4 * T });
}
function reset() {
  grid = buildGrid();
  alarm = false; kingHP = TC_NEED; kingDead = false; kingGone = 0; kingHit = 0; puffT = 30;
  meltQ = []; meltAcc = 0; meltWall = ''; wallOpen = domeOpen = false;
  nameI = 0; brainI = 0; oops = 0; gulps = 0; firstSplish = true;
  nail = { x: -1, next: NAIL_FIRST, warned: false, id: 0, n: 0 };
  heroes = [
    makeHero('zaal', 'Zaal', 9, 16, 30, 150, 575, 'Super-jump · E at keratin: squirt acid'),
    makeHero('gob', 'Gobbler', 11, 30, 26, 95, 405, 'E next to a virus to swallow it'),
    makeHero('langer', 'Langer', 13, 22, 24, 120, 420, 'E: grab a virus, then raise the alarm'),
  ];
  for (const h of heroes) Object.assign(h, { cpX: h.x, cpY: h.y, sample: false });
  germs = [virus(21, 17), virus(27, 13), virus(31, 13)];
  clearTimeout(brainTimer);
  document.getElementById('brainSays').textContent = '';
}
// Zaal's brain chats from upstairs.
function brainSay(text) {
  const el = document.getElementById('brainSays');
  el.textContent = text;
  clearTimeout(brainTimer);
  brainTimer = setTimeout(() => { el.textContent = ''; }, 6000);
  speak('Brain says: ' + text);
}

// ---------- powers ----------
function kerAhead(h) {
  const fr = Math.floor((h.y + h.h - 2) / T);
  for (const r of [fr, fr - 1]) for (const d of [4, 16]) {
    const c = Math.floor((h.facing > 0 ? h.x + h.w + d : h.x - d) / T);
    if (grid[r] && grid[r][c] === KER) return [r, c];
  }
  return null;
}
const nearKing = (h, d = 64) => !kingDead && Math.hypot(KING.x - cx(h), KING.y - 20 - cy(h)) < d;
function usePower(h) {
  if (h.id === 'zaal') {
    if (meltQ.length) return say(h, 'Still fizzing! Wait a moment...', '#ffe9a0');
    const at = kerAhead(h);
    if (!at) return say(h, nearestGerm(h) ? 'A virus! Gobbler can eat it.' : 'No keratin here! Find a yellow wall.');
    openMath('ACID TIME! Solve it to squirt salicylic acid:', () => {
      startMelt(...at);
      say(h, 'Squirt! Fizzzzz...', '#fff2a0'); fact('acid');
      for (let i = 0; i < 14; i++) goo(cx(h) + h.facing * 12, h.y + 12, 'rgba(200,240,140,.9)');
    }, () => say(h, 'Oops! It just tickled the wart.', '#ffb0b0'));
  } else if (h.id === 'gob') {
    const best = nearestGerm(h);
    if (!best) {
      if (nearestGerm(h, 46, 'hidden')) return say(h, 'It\'s hiding inside a skin cell! Wait for it to come out.', '#ffd88a');
      return say(h, 'No virus close enough!');
    }
    openMath('GULP TIME! Solve it to swallow the virus:', () => {
      best.state = 'eaten'; best.t = 0; h.eatT = .7; h.eaten++; gulps++; h.facing = cx(best) > cx(h) ? 1 : -1;
      sfx('gulp');
      setTimeout(() => { sfx('burp'); say(h, 'BUUURP!', '#e8d0ff'); }, 900);
      fact(['macrophage', 'shape', 'tinyVirus'][Math.min(h.eaten, 3) - 1]);
    }, () => {
      best.state = 'hidden'; best.t = 0; sfx('squelch');
      say(best, 'It hid inside a skin cell!', '#ffd88a'); fact('hiding');
    });
  } else {
    if (alarm) return say(h, 'The alarm is already ringing!');
    const atLymph = Math.hypot(LYMPH.x - cx(h), LYMPH.y - (h.y + h.h)) < 36;
    if (h.sample) {
      if (!atLymph) return say(h, 'Take the sample to the green lymph vessel!', '#e0ffb0');
      return openMath('ALARM! Solve it to send the sample down the lymph vessel:', () => raiseAlarm(h),
        () => say(h, 'The message got lost. Try again!', '#ffb0b0'));
    }
    const v = nearestGerm(h, 50);
    if (v || nearKing(h)) return openMath('SNAP! Solve it to grab a virus sample:', () => {
      h.sample = true; sfx('slime');
      say(h, 'Got a sample! Now to the lymph vessel!', '#e0ffb0'); fact('langerhans');
    }, () => say(h, 'It wriggled away!', '#ffb0b0'));
    if (nearestGerm(h, 50, 'hidden')) return say(h, 'It\'s hiding! Wait for it to come out.', '#ffd88a');
    say(h, atLymph ? 'You need a virus sample first!' : 'Find a virus to grab a sample!');
  }
}
function raiseAlarm(h) {
  alarm = true; h.sample = false; released = true; spawnT = 1.2;
  sfx('zap'); say(h, 'ALARM! Killer T cells, this way!', '#e0ffb0');
  brainSay(BRAIN.alarm); fact('lymph');
  setTimeout(() => fact('inflame'), 14000);
}
// Acid melts a whole connected lump of keratin, starting where Zaal squirts it.
function startMelt(r, c) {
  const seen = new Set([r * COLS + c]), q = [[r, c]];
  for (let i = 0; i < q.length; i++) {
    const [y, x] = q[i];
    for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ny = y + dy, nx = x + dx, k = ny * COLS + nx;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx] === KER && !seen.has(k)) { seen.add(k); q.push([ny, nx]); }
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
    for (let i = 0; i < 3; i++) goo(c * T + 12, r * T + 12, pick(['rgba(240,215,110,.9)', 'rgba(200,240,140,.8)', 'rgba(255,250,210,.8)']));
  }
  if (Math.random() < .2) fx(() => hiss(.25, .08, 2500));
  if (changed) renderTerrain();
  if (meltQ.length) return;
  if (meltWall === 'wall') { wallOpen = true; fact('keratin'); }
  else {
    domeOpen = true; sfx('bloop');
    floats.push({ x: KING.x, y: 12 * T, text: 'HEY! Who melted my roof?!', color: '#ffd0a0', life: 2.6 });
    fact('dots'); setTimeout(() => fact('papilloma'), 9000);
  }
}

// ---------- update ----------
const inLift = e => cx(e) > LIFT.x && cx(e) < LIFT.x + LIFT.w && e.y + e.h > LIFT.top - 30 && e.y + e.h <= 18 * T + 1;
// Sweat flows up the duct, carrying anything in it up to the platform. Returns true while floating.
function liftUp(e, speed) {
  if (!inLift(e)) { e.inLift = false; return false; }
  if (!e.inLift) {
    e.inLift = true;
    if (heroes.includes(e)) { say(e, pick(['Splish!', 'Salty!', 'Wheee!', 'Sweaty!']), '#bfe8ff'); sfx('bloop'); }
    if (firstSplish) { firstSplish = false; fact('sweat'); }
  }
  e.vy = e.y + e.h > LIFT.top ? Math.min(e.vy, -speed) : Math.min(e.vy, 0);
  return true;
}
function heroAfter(h) {
  if (h.y > H) {
    for (let k = 0; k < 14; k++) goo(cx(h), H - 20, 'rgba(170,220,255,.9)');
    sfx('sploosh');
    Object.assign(h, { x: h.cpX, y: h.cpY, vx: 0, vy: 0, knockT: 0 });
    return say(h, 'Salty swim in the sweat gland! Back you go...', '#bfe8ff');
  }
  if (h.onGround && h.knockT <= 0 && !inLift(h) && solid(tileAt(cx(h), h.y + h.h + 2))) { h.cpX = h.x; h.cpY = h.y; }
}
function makeTcell() {
  const name = NAMES[nameI % NAMES.length];
  return { x: CAP.x - 8, y: CAP.y - 16 - .01, w: 16, h: 16, vx: 0, vy: 0, dir: -1, state: 'walk', t: 0, onGround: true,
    ph: Math.random() * 6, name, kind: nameI++ % 3 };
}
const slotPos = i => [34 * T + 3 + (i % 3) * 15, 18 * T - 17 - Math.floor(i / 3) * 15];
function walkerStep(r, dt) {
  r.ph += dt;
  if (r.state === 'walk') {
    if (!r.named) { r.named = true; say(r, r.name, '#cdeeff'); }
    r.floating = liftUp(r, 85);
    const dir = r.dir;
    walkStep(r, dt, TC_SPEED);
    if (r.floating && r.hitWall) r.dir = dir;          // hold course while riding the sweat
    if (overlap({ x: cx(r) - 1, y: cy(r) - 1, w: 2, h: 2 }, HOME)) {
      r.state = 'attack'; r.t = 0; r.fx = r.x; r.fy = r.y;
    } else if (r.y > H) {
      r.state = 'splash'; r.t = 0; sfx('sploosh');
      say(r, 'Salty swim!', '#bfe8ff');
    }
  } else if (r.state === 'attack') {
    r.t += dt;
    const u = Math.min(1, r.t / .5);
    r.x = r.fx + (KING.x - 26 - r.fx) * u; r.y = r.fy + (KING.y - 30 - r.fy) * u - Math.sin(u * Math.PI) * 20;
    if (u >= 1) zapKing(r);
  } else if (r.state === 'home') {
    const [sx, sy] = slotPos(r.slot), k = Math.min(1, dt * 4);
    r.x += (sx - r.x) * k; r.y += (sy - r.y) * k;
  } else {
    // fell in the sweat gland: back into the capillary for another go
    r.t += dt;
    if (r.t > .8) {
      r.state = 'gone'; spawned--; oops++;
      floats.push({ x: CAP.x, y: 15.5 * T, text: `${r.name}: back for another go!`, color: '#cdeeff', life: 1.8 });
    }
  }
}
function zapKing(r) {
  r.state = 'home'; r.slot = saved++; sfx('zap'); kingHit = .5;
  say(r, 'ZAP!', '#fff6a0');
  for (let i = 0; i < 14; i++) goo(KING.x, KING.y - 24, pick(['#fff6a0', '#c9a184', '#ff9ad0']));
  if (!kingDead) {
    kingHP = Math.max(0, kingHP - 1);
    floats.push({ x: KING.x + 4, y: KING.y - 64, text: KING_OW[(saved - 1) % KING_OW.length], color: '#ffd0a0', life: 1.8 });
  }
  if (saved === 1) fact('tcell');
  if (saved >= TC_NEED && !kingDead) beatKing();
}
function beatKing() {
  kingDead = true; sfx('cheer'); brainSay(BRAIN.win); fact('wait');
  for (let y = 14; y < 18; y++) grid[y][38] = 0;
  renderTerrain();
  for (const g of germs) if (g.state === 'alive' || g.state === 'hidden') { g.state = 'swept'; g.t = 0; say(g, 'Bye bye!', '#ffd0f0'); }
}
// Hidden viruses sit tight inside a skin cell, then pop out again. Swept ones fade away.
function virusStep(g, dt) {
  if (g.state === 'hidden') {
    g.vx = 0; moveEntity(g, dt, false); g.t += dt;
    if (g.t > 12) { g.state = 'alive'; g.t = 0; say(g, 'Peekaboo! The virus came out!', '#ffd88a'); sfx('bloop'); }
    return true;
  }
  if (g.state === 'swept') { g.t += dt; return g.t < 1; }
  return true;
}
// Until the alarm goes off, the King puffs out a fresh virus now and then, so Langer always has something to sample.
function updateKing(dt) {
  if (kingHit > 0) kingHit -= dt;
  if (kingDead) { kingGone = Math.min(1, kingGone + dt * .5); return; }
  if (alarm) return;
  puffT -= dt;
  if (puffT > 0) return;
  puffT = 30;
  if (germs.some(g => g.state === 'alive' || g.state === 'hidden')) return;
  const v = virus(30, 13);
  germs.push(v);
  for (let i = 0; i < 10; i++) goo(cx(v), cy(v), 'rgba(240,160,230,.8)');
  sfx('bloop'); say(v, 'The King puffed out a new virus!', '#ffd0f0');
}
// Zaal's fingernail scrapes across the top of the wart. Heroes only hop, so nobody gets moved off their spot.
function updateNail(dt) {
  if (kingDead && nail.x < 0) return;
  if (nail.x < 0) {
    if (!nail.warned && gameTime > nail.next - 3) { nail.warned = true; fx(() => hiss(1.2, .06, 900)); }
    if (gameTime >= nail.next) {
      nail.x = 0; nail.id++; nail.n++;
      if (nail.n <= 2) brainSay(nail.n === 1 ? BRAIN.pick1 : BRAIN.pick2);
      fx(() => { for (let i = 0; i < 6; i++) hiss(.12, .14, 3500, i * .18); });
    }
    return;
  }
  nail.x += NAIL_SPEED * dt;
  const reached = e => {
    if (e.nailId === nail.id || Math.abs(cx(e) - nail.x) > 20) return false;
    e.nailId = nail.id;
    return true;
  };
  for (const h of heroes) if (!h.inExit && reached(h)) {
    if (h.onGround) h.vy = -200;
    say(h, pick(['Whoa!', 'Earthquake!', 'Hold on!', 'Stop picking!']), '#ffe0c8');
  }
  for (const r of walkers) if (r.state === 'walk' && reached(r)) say(r, 'Whoa!', '#cdeeff');
  if (nail.n === 1 && nail.x > W / 2) fact('picking');
  if (nail.x > W + 80) { nail.x = -1; nail.next = gameTime + NAIL_EVERY; nail.warned = false; }
}
function update(dt) {
  updateHeroes(dt, heroAfter, h => liftUp(h, 130));
  if (ended || paused) return;
  updateGerms(dt, virusStep);
  spawnWalkers(dt, TC_TOTAL, TC_GAP, makeTcell);
  for (const r of walkers) walkerStep(r, dt);
  walkers = walkers.filter(r => r.state !== 'gone');
  updateMelt(dt);
  updateKing(dt);
  updateNail(dt);

  // ambience: sweat drops rising up the duct
  if (Math.random() < .4) parts.push({ x: LIFT.x + 6 + Math.random() * (LIFT.w - 12), y: 18 * T - 2, vx: (Math.random() - .5) * 10, vy: -40,
    life: 2.4, max: 2.4, color: 'rgba(170,220,255,.45)', size: 1.5 + Math.random() * 2.5, grav: -30 });
  updateParticles(dt);

  if (!kingDead && brainI < BRAIN_LINES.length && gameTime > BRAIN_LINES[brainI][0]) brainSay(BRAIN_LINES[brainI++][1]);
  for (const [t, k] of [[45, 'verruca'], [95, 'lucidum'], [150, 'otherKind']]) if (gameTime > t && !seenFacts.has(k)) { fact(k); break; }
  if (kingDead && heroes.every(h => h.inExit)) return finish();
  const lg = heroes[2];
  if (!wallOpen) hint = 'Zaal: press E by the yellow keratin wall.';
  else if (!alarm && !lg.sample) hint = 'Langer: ride the sweat up, grab a virus.';
  else if (!alarm) hint = 'Langer: take it to the green lymph vessel!';
  else if (!domeOpen) hint = 'Zaal: melt the dome! Guard the lymph vessel!';
  else if (!kingDead) hint = 'Lead the Killer T cells to the King!';
  else hint = 'Wart beaten! Everyone into the sweat pore!';
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
  const golden = saved === TC_TOTAL && oops === 0;
  seenFacts.add('freeze');
  showEnd(golden ? 'WART-LESS WONDER!' : 'WART-ASTIC!',
    `<b>${saved} of ${TC_TOTAL}</b> Killer T cells reached King Papilloma${saved === TC_TOTAL ? ', every single one!' : '.'}` +
    `${oops ? ` (${oops} took a salty swim and needed another go.)` : ''} Gobbler swallowed ${gulps} virus particle${gulps === 1 ? '' : 's'}.` +
    `${nail.n ? ` Zaal's fingernail picked the wart <b>${nail.n}</b> time${nail.n === 1 ? '' : 's'}. Naughty fingers!` : ''}` +
    `<br>The wart is gone, and brand new skin is growing in its place.`, 'GOOP');
  document.getElementById('btnAgain').textContent = 'Play again';
  drawTips();
}

// ---------- drawing: static layers ----------
function paintBackground(c) {
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#4c3c20'); g.addColorStop(.25, '#46262a'); g.addColorStop(.75, '#36161e'); g.addColorStop(1, '#22080e');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // skin cells: flat and dry near the top, plump with a nucleus in the middle, tall at the bottom.
  // Round the King they're infected: a clear halo round a wrinkly nucleus.
  for (let j = 0; j < 12; j++) {
    const y = 74 + j * 30;
    for (let i = 0; i < 26; i++) {
      const x = i * 40 + (j % 2) * 20 + (hash(i, j, 1) - .5) * 8, k = hash(i, j, 2);
      const top = y < 130, base = y > 360, infected = x > 33.4 * T && y > 70;
      const rw = 17 + k * 3, rh = top ? 6 + k * 2 : base ? 14 : 12 + k * 2;
      c.fillStyle = top ? 'rgba(190,160,90,.22)' : base ? 'rgba(150,100,175,.22)' : 'rgba(205,115,125,.18)';
      c.strokeStyle = top ? 'rgba(230,200,130,.18)' : 'rgba(255,180,190,.16)'; c.lineWidth = 1.2;
      c.beginPath(); c.ellipse(x, y, rw, rh, (hash(i, j, 3) - .5) * .3, 0, 7); c.fill(); c.stroke();
      if (top) { c.fillStyle = 'rgba(60,40,10,.35)'; for (let n = 0; n < 3; n++) circle(c, x - 8 + hash(i, j, n + 5) * 16, y - 2 + hash(i, j, n + 8) * 4, 1); continue; }
      if (infected) {
        c.fillStyle = 'rgba(255,235,225,.18)'; c.beginPath(); c.ellipse(x, y, 9, 7, 0, 0, 7); c.fill();
        c.fillStyle = 'rgba(60,10,40,.6)'; c.beginPath();
        for (let n = 0; n <= 8; n++) { const a = n / 8 * 7, r = 3 + hash(i, j, n + 20) * 2; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .8); }
        c.fill();
      } else {
        c.fillStyle = base ? 'rgba(70,30,100,.45)' : 'rgba(110,40,80,.35)';
        c.beginPath(); c.ellipse(x + (k - .5) * 4, y, base ? 4 : 5, base ? 6 : 4, 0, 0, 7); c.fill();
      }
      if (!top && !base) {                                   // the "prickles" that rivet skin cells together
        c.strokeStyle = 'rgba(255,190,200,.13)'; c.lineWidth = 1;
        for (let n = 0; n < 6; n++) { const a = n / 6 * 7 + k; c.beginPath(); c.moveTo(x + Math.cos(a) * rw, y + Math.sin(a) * rh); c.lineTo(x + Math.cos(a) * (rw + 4), y + Math.sin(a) * (rh + 3)); c.stroke(); }
      }
    }
  }
  // capillary loops pushed up into the wart, with clotted black tips: the wart's "black dots"
  for (let k = 0; k < 3; k++) {
    const x = (34.6 + k * 1.3) * T, top = (8 + k * 1.5) * T;
    c.strokeStyle = 'rgba(170,30,40,.55)'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x - 5, 18 * T); c.lineTo(x - 5, top + 6); c.quadraticCurveTo(x, top - 4, x + 5, top + 6); c.lineTo(x + 5, 18 * T); c.stroke();
    c.fillStyle = 'rgba(20,4,6,.9)'; circle(c, x, top + 1, 4.5);
  }
  g = c.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function paintTerrain(c) {
  const isSolid = (x, y) => x < 0 || x >= COLS || y < 0 || (y < ROWS && solid(grid[y][x]));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = grid[y][x], px = x * T, py = y * T;
    if (t === 1) {
      // the tough top layer: flat dead cells stacked like flaky pastry
      c.fillStyle = `hsl(40,32%,${36 + hash(x, y) * 6}%)`; c.fillRect(px, py, T, T);
      c.strokeStyle = 'rgba(255,235,180,.22)'; c.lineWidth = 1;
      for (let i = 0; i < 4; i++) { const ly = py + 3 + i * 6 + hash(x, y, i) * 2; c.beginPath(); c.moveTo(px, ly); c.quadraticCurveTo(px + 12, ly + (hash(x, y, i + 4) - .5) * 4, px + T, ly); c.stroke(); }
    } else if (t === 9) {
      // dermis: pink, with wavy collagen fibres
      c.fillStyle = `hsl(352,38%,${30 + hash(x, y) * 5}%)`; c.fillRect(px, py, T, T);
      c.strokeStyle = 'rgba(255,200,205,.18)'; c.lineWidth = 1.4;
      for (let i = 0; i < 2; i++) { const ly = py + 6 + i * 10; c.beginPath(); c.moveTo(px, ly); c.bezierCurveTo(px + 8, ly - 4, px + 16, ly + 4, px + T, ly); c.stroke(); }
      if (y === 18) { c.fillStyle = 'rgba(150,90,190,.75)'; c.fillRect(px, py, T, 4); }   // the basement membrane
    } else if (t === 4) {
      // a stack of living skin cells
      c.fillStyle = '#7a3a48'; c.fillRect(px, py, T, T);
      c.fillStyle = `hsl(350,40%,${44 + hash(x, y) * 8}%)`; c.strokeStyle = 'rgba(60,15,25,.8)'; c.lineWidth = 1.2;
      rr(c, px + 1, py + 1, T - 2, T - 2, 7); c.fill(); c.stroke();
      c.fillStyle = 'rgba(90,30,80,.7)'; circle(c, px + 10 + hash(x, y, 2) * 4, py + 12, 3.5);
    } else if (t === KER || t === CORK) {
      // keratin: yellow, horny and flaky; the cork is older and browner
      const cork = t === CORK;
      c.fillStyle = cork ? `hsl(34,45%,${32 + hash(x, y) * 6}%)` : `hsl(46,70%,${54 + hash(x, y) * 8}%)`; c.fillRect(px, py, T, T);
      c.strokeStyle = cork ? 'rgba(40,20,5,.45)' : 'rgba(150,110,20,.5)'; c.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const sx = px + hash(x, y, i) * 16, sy = py + 4 + i * 7;
        c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + 5, sy - 3, sx + 10, sy); c.stroke();
      }
      c.fillStyle = cork ? 'rgba(255,220,170,.12)' : 'rgba(255,250,210,.35)'; c.fillRect(px + 3, py + 3, 5, 2);
    } else continue;
    c.fillStyle = 'rgba(25,5,8,.45)';
    if (!isSolid(x - 1, y)) c.fillRect(px, py, 3, T);
    if (!isSolid(x + 1, y)) c.fillRect(px + T - 3, py, 3, T);
    if (!isSolid(x, y + 1) && y < ROWS - 1) { c.fillRect(px, py + T - 3, T, 3); ceilTiles.push([x, y]); }
    if (!isSolid(x, y - 1) && y > 0 && t !== 9) {
      c.fillStyle = 'rgba(255,235,200,.35)'; c.fillRect(px + 1, py, T - 2, 2);
    }
  }
  // a capillary running through the dermis, rising to the floor where the T cells come out
  c.strokeStyle = 'rgba(190,30,40,.85)'; c.lineWidth = 9; c.lineCap = 'round';
  c.beginPath(); c.moveTo(3.4 * T, 20.3 * T); c.lineTo(5.6 * T, 20.3 * T); c.quadraticCurveTo(CAP.x, 20.3 * T, CAP.x, 18.6 * T);
  c.moveTo(CAP.x, 19.4 * T); c.quadraticCurveTo(CAP.x, 20.3 * T, 7.6 * T, 20.3 * T); c.lineTo(39 * T, 20.3 * T); c.stroke();
  c.strokeStyle = 'rgba(255,120,120,.35)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(7.6 * T, 20.1 * T); c.lineTo(39 * T, 20.1 * T); c.stroke();
  // the lymph vessel, going down to a lymph node far away
  c.strokeStyle = 'rgba(170,215,90,.85)'; c.lineWidth = 10;
  c.beginPath(); c.moveTo(LYMPH.x, 18.2 * T); c.lineTo(LYMPH.x, 22 * T); c.stroke();
  c.strokeStyle = 'rgba(60,90,20,.7)'; c.lineWidth = 1.5;                 // one-way valves
  for (const vy of [19.2, 20.8]) { c.beginPath(); c.moveTo(LYMPH.x - 4, vy * T); c.lineTo(LYMPH.x, vy * T + 5); c.lineTo(LYMPH.x + 4, vy * T); c.stroke(); }
  // the sweat gland: a coiled tube at the bottom of the pit
  c.fillStyle = '#1a0a10'; c.fillRect(T, 18 * T, 2 * T, 4 * T);
  c.strokeStyle = 'rgba(150,200,240,.6)'; c.lineWidth = 5;
  c.beginPath(); c.moveTo(1.5 * T, 18 * T);
  for (let i = 0; i < 5; i++) c.bezierCurveTo(2.7 * T, (18.6 + i * .6) * T, .9 * T, (18.9 + i * .6) * T, 2 * T, (19.2 + i * .6) * T);
  c.stroke();
}

// ---------- drawing: characters ----------
function drawLanger(c, x, by, f, t, walking) {
  c.save(); c.translate(x, by - 12); c.scale(f, 1);
  const s = walking ? Math.sin(t * 14) : 0;
  c.fillStyle = '#6a3a9a'; rr(c, -6 + s * 2, 9, 5, 3, 1.5); c.fill(); rr(c, 1 - s * 2, 9, 5, 3, 1.5); c.fill();
  // long wavy arms, called dendrites, for feeling around between skin cells
  c.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI + i * .62 - .1, wob = Math.sin(t * 3 + i * 1.7) * 3;
    const ex = Math.cos(a) * 17 + wob * .5, ey = Math.sin(a) * 13 + wob;
    c.strokeStyle = '#9a68d8'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(Math.cos(a) * 5, Math.sin(a) * 4); c.quadraticCurveTo(Math.cos(a + .4) * 11, Math.sin(a + .4) * 9, ex, ey); c.stroke();
    c.strokeStyle = '#b892ec'; c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + Math.cos(a - .6) * 4, ey + Math.sin(a - .6) * 4);
    c.moveTo(ex, ey); c.lineTo(ex + Math.cos(a + .6) * 4, ey + Math.sin(a + .6) * 4); c.stroke();
  }
  const g = c.createRadialGradient(-2, -3, 1, 0, 0, 11);
  g.addColorStop(0, '#efe0ff'); g.addColorStop(1, '#9a6ad8');
  c.fillStyle = g; c.strokeStyle = '#5a2a8a'; c.lineWidth = 1.3;
  c.beginPath(); c.ellipse(0, 0, 10, 9, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = 'rgba(90,40,140,.75)'; c.beginPath(); c.ellipse(-3, 3, 4.5, 3, .3, 0, 7); c.fill();    // nucleus
  c.strokeStyle = 'rgba(90,40,140,.7)'; c.lineWidth = .8;                                            // tennis-racket granules
  for (const [gx, gy] of [[-6, -3], [4, 4]]) { c.beginPath(); c.arc(gx, gy, 1.3, 0, 7); c.moveTo(gx + 1.2, gy + 1); c.lineTo(gx + 3, gy + 3); c.stroke(); }
  c.fillStyle = '#fff'; circle(c, 2.5, -2.5, 2.4); circle(c, 7, -2.2, 2.1);
  c.fillStyle = '#2a0b40'; circle(c, 3.2, -2.3, 1.2); circle(c, 7.6, -2, 1.1);
  c.strokeStyle = '#4a1a6a'; c.lineWidth = .9; c.beginPath(); c.arc(5, 1.4, 1.6, .2, Math.PI - .2); c.stroke();
  c.restore();
}
const TCOL = [['#a8dcff', '#2c5a9a'], ['#9ff0e0', '#1f7a6a'], ['#c8d0ff', '#3a3a9a']];
function drawTcell(c, x, y, dir, t, state, kind = 0, alpha = 1) {
  c.save(); c.translate(x, y); c.globalAlpha = alpha;
  const bob = state === 'walk' ? -Math.abs(Math.sin(t * 10)) * 1.2 : 0;
  c.translate(0, bob);
  c.strokeStyle = TCOL[kind][1]; c.lineWidth = .8;              // receptors, for checking other cells
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + t * .3, r0 = 7.5, r1 = 10;
    const ex = Math.cos(a) * r1, ey = Math.sin(a) * r1;
    c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(ex, ey);
    c.lineTo(ex + Math.cos(a - .8) * 2, ey + Math.sin(a - .8) * 2); c.moveTo(ex, ey); c.lineTo(ex + Math.cos(a + .8) * 2, ey + Math.sin(a + .8) * 2); c.stroke();
  }
  c.fillStyle = TCOL[kind][0]; circle(c, 0, 0, 7.8);
  c.fillStyle = TCOL[kind][1]; circle(c, -dir * 1, .6, 5.8);   // a T cell is nearly all nucleus
  c.fillStyle = '#e8303c'; c.fillRect(-7, -6, 14, 2.6);        // karate headband
  c.beginPath(); c.moveTo(-6 * dir, -5); c.lineTo(-11 * dir, -8 + Math.sin(t * 9)); c.lineTo(-10 * dir, -3); c.fill();
  c.fillStyle = '#fff'; circle(c, 1.5 * dir, -1, 1.8); circle(c, 4.8 * dir, -1, 1.7);
  c.fillStyle = '#000'; circle(c, 2 * dir, -.9, .9); circle(c, 5.3 * dir, -.9, .85);
  c.strokeStyle = '#fff'; c.lineWidth = .9;
  if (state === 'home') { c.beginPath(); c.arc(3.2 * dir, 2, 1.8, .2, Math.PI - .2); c.stroke(); }
  else { c.beginPath(); c.moveTo(1.6 * dir, 2.8); c.lineTo(5 * dir, 2.8); c.stroke(); }
  c.restore();
}
function drawVirus(c, x, y, t, s = 1, alpha = 1) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5) * .15); c.scale(s, s); c.globalAlpha = alpha;
  const R = 7.5, pts = Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * R, Math.sin(i * Math.PI / 3 + Math.PI / 6) * R]);
  const g = c.createLinearGradient(0, -R, 0, R);
  g.addColorStop(0, '#f6a8e6'); g.addColorStop(1, '#9a3a9a');
  c.fillStyle = g; c.strokeStyle = '#4a0a4a'; c.lineWidth = 1.3;
  c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(80,10,80,.55)'; c.lineWidth = .8;                       // the facets of a 20-sided dice
  c.beginPath(); c.moveTo(pts[0][0] * .45, pts[0][1] * .45);
  [2, 4, 0].forEach(i => c.lineTo(pts[i][0] * .45, pts[i][1] * .45));
  for (let i = 0; i < 6; i++) { c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i - i % 2][0] * .45, pts[i - i % 2][1] * .45); }
  c.stroke();
  c.fillStyle = '#ffd6f4'; for (const [px, py] of pts) circle(c, px, py, 1.3);
  c.fillStyle = '#fff'; circle(c, -2.4, -1, 1.7); circle(c, 2.4, -1, 1.7);
  c.fillStyle = '#300'; circle(c, -2.1, -.8, .85); circle(c, 2.7, -.8, .85);
  c.strokeStyle = '#300'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(-4, -3.4); c.lineTo(-1, -2.4); c.moveTo(4, -3.4); c.lineTo(1, -2.4); c.stroke();
  c.beginPath(); c.arc(0, 3.4, 1.6, Math.PI + .3, -.3); c.stroke();
  c.restore();
}
// A virus hiding inside a bloated skin cell: just a pair of eyes peeking out.
function drawHidden(c, x, y, t) {
  c.fillStyle = 'rgba(220,130,150,.75)'; c.strokeStyle = 'rgba(120,40,60,.9)'; c.lineWidth = 1.2;
  c.beginPath(); c.ellipse(x, y, 11 + Math.sin(t * 2) * .6, 9, 0, 0, 7); c.fill(); c.stroke();
  drawVirus(c, x, y, t, .7, .35);
  const look = Math.sin(t * 1.3) * 2;
  c.fillStyle = '#fff'; circle(c, x - 2 + look, y - 1, 1.6); circle(c, x + 2 + look, y - 1, 1.6);
  c.fillStyle = '#300'; circle(c, x - 2 + look, y - 1, .8); circle(c, x + 2 + look, y - 1, .8);
}
const KBUMPS = [[-24, -6, 10], [24, -6, 10], [-17, -16, 13], [17, -16, 13], [0, -22, 15], [-10, -36, 11], [10, -37, 11], [0, -47, 9]];
function drawKing(c, x, by, s, t, hit, alpha = 1) {
  if (s <= .01) return;
  c.save(); c.translate(x + (hit > 0 ? Math.sin(t * 60) * 2 : 0), by); c.scale(s, s); c.globalAlpha = alpha;
  for (const [bx, by2, r] of KBUMPS) {                     // a lumpy cauliflower of keratin
    const g = c.createRadialGradient(bx - r * .3, by2 - r * .4, 1, bx, by2, r);
    g.addColorStop(0, '#e6c4a6'); g.addColorStop(1, '#a87c60');
    c.fillStyle = g; c.strokeStyle = '#5a3a28'; c.lineWidth = 1.6;
    c.beginPath(); c.arc(bx, by2, r, 0, 7); c.fill(); c.stroke();
  }
  c.fillStyle = '#e6c4a6'; c.fillRect(-30, -6, 60, 6);
  c.fillStyle = '#1e0606';                                 // the black dots
  for (let i = 0; i < 9; i++) circle(c, -22 + hash(i, 71) * 44, -40 + hash(i, 72) * 36, 1.3 + hash(i, 73));
  c.fillStyle = '#f2c933'; c.strokeStyle = '#8a6410'; c.lineWidth = 1.4;      // crown
  c.beginPath(); c.moveTo(-10, -52); c.lineTo(-10, -62); c.lineTo(-5, -57); c.lineTo(0, -65); c.lineTo(5, -57); c.lineTo(10, -62); c.lineTo(10, -52); c.closePath();
  c.fill(); c.stroke();
  c.fillStyle = '#e8303c'; circle(c, 0, -57, 1.6);
  c.fillStyle = '#fff'; circle(c, -6, -24, 4); circle(c, 6, -24, 4);
  if (hit > 0) {
    c.strokeStyle = '#300'; c.lineWidth = 1.6;
    for (const ex of [-6, 6]) { c.beginPath(); c.moveTo(ex - 2.5, -26.5); c.lineTo(ex + 2.5, -21.5); c.moveTo(ex + 2.5, -26.5); c.lineTo(ex - 2.5, -21.5); c.stroke(); }
    c.fillStyle = '#3a0c10'; c.beginPath(); c.ellipse(0, -12, 4, 5, 0, 0, 7); c.fill();
  } else {
    c.fillStyle = '#300'; circle(c, -5.4, -23.4, 2); circle(c, 5.4, -23.4, 2);
    c.strokeStyle = '#300'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-11, -32); c.lineTo(-3, -28); c.moveTo(11, -32); c.lineTo(3, -28); c.stroke();
    c.beginPath(); c.arc(0, -10, 5, Math.PI + .4, -.4); c.stroke();
  }
  c.restore();
}
function drawAcidBottle(c, x, y) {
  c.fillStyle = '#7a4a1c'; rr(c, x - 3, y - 4, 6, 9, 1.5); c.fill();
  c.fillStyle = '#f3e6d8'; c.fillRect(x - 3, y - 1, 6, 3);
  c.fillStyle = '#3a8a3a'; c.fillRect(x - 1.5, y - 7, 3, 3);
}

// ---------- drawing: set pieces ----------
function drawLift(c) {
  const g = c.createLinearGradient(0, LIFT.top - 30, 0, 18 * T);
  g.addColorStop(0, 'rgba(150,200,240,0)'); g.addColorStop(1, `rgba(150,200,240,${.22 + Math.sin(anim * 3) * .05})`);
  c.fillStyle = g; c.fillRect(LIFT.x, LIFT.top - 30, LIFT.w, 18 * T - LIFT.top + 30);
  c.fillStyle = '#10060a'; c.beginPath(); c.ellipse(LIFT.x + LIFT.w / 2, 18 * T + 3, LIFT.w / 2 - 3, 5, 0, 0, 7); c.fill();
  c.fillStyle = '#d8eeff'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('SWEAT DUCT', LIFT.x + LIFT.w / 2, LIFT.top - 52);
  c.fillText('ride it up! 💦', LIFT.x + LIFT.w / 2, LIFT.top - 40);
}
function drawLymph(c, langerHas) {
  const p = .6 + Math.sin(anim * 5) * .4;
  c.fillStyle = alarm ? `rgba(255,${120 + p * 100 | 0},80,.9)` : langerHas ? `rgba(210,255,120,${.5 + p * .5})` : 'rgba(170,215,90,.7)';
  c.beginPath(); c.ellipse(LYMPH.x, LYMPH.y + 1, 9, 4, 0, 0, 7); c.fill();
  c.fillStyle = '#e4ffb0'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('LYMPH VESSEL', LYMPH.x, LYMPH.y - 60);
  if (alarm) { c.fillStyle = Math.sin(anim * 8) > 0 ? '#ffdd66' : '#ff7a50'; c.fillText('🚨 ALARM!', LYMPH.x, LYMPH.y - 72); }
  else if (langerHas) c.fillText('bring the sample here!', LYMPH.x + 6, LYMPH.y - 72 + Math.sin(anim * 4) * 2);
}
function drawCapillary(c) {
  const left = TC_TOTAL - spawned;
  c.strokeStyle = 'rgba(200,40,50,.95)'; c.lineWidth = 7;
  c.beginPath(); c.ellipse(CAP.x, CAP.y, 10, 6, 0, Math.PI, 0); c.stroke();
  for (let i = 0; i < Math.min(left, 3); i++) {
    const peek = alarm ? 0 : Math.max(0, Math.sin(anim * 1.5 + i * 2)) * 3;
    drawTcell(c, CAP.x - 6 + i * 6, CAP.y + 4 - peek, -1, anim + i, 'wait', i % 3, .75);
  }
  c.strokeStyle = 'rgba(200,40,50,.95)'; c.lineWidth = 7;
  c.beginPath(); c.moveTo(CAP.x - 10, CAP.y + 1); c.lineTo(CAP.x + 10, CAP.y + 1); c.stroke();
  c.fillStyle = '#ffd0d0'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('BLOOD VESSEL', CAP.x + 8, CAP.y - 22);
  c.fillStyle = '#cdeeff'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'left';
  if (!alarm) c.fillText(`${left} Killer T cells waiting for the alarm`, CAP.x + 50, CAP.y - 74);
}
function drawGlandLabel(c) {
  c.fillStyle = '#d8eeff'; c.font = 'bold 9px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('SWEAT GLAND', 2 * T, 18 * T - 96);
  c.fillText('salty! ⬇', 2 * T, 18 * T - 85);
}
function drawExitPore(c) {
  if (!kingDead) return;
  const g = c.createLinearGradient(EXIT.x, 0, EXIT.x + T, 0);
  g.addColorStop(0, 'rgba(255,250,220,.25)'); g.addColorStop(1, 'rgba(255,255,255,.75)');
  c.fillStyle = g; c.fillRect(EXIT.x, 3 * T, EXIT.w, 15 * T);
  c.fillStyle = '#fff6d8'; c.font = 'bold 10px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('⬆ OUT!', EXIT.x + T / 2, EXIT.y - 6 + Math.sin(anim * 5) * 2);
}
function drawFog(c) {
  if (domeOpen) return;
  c.fillStyle = 'rgba(205,175,105,.82)'; c.fillRect(34 * T, 3 * T, 5 * T, 15 * T);
  c.fillStyle = 'rgba(150,110,40,.5)';
  for (let i = 0; i < 18; i++) circle(c, 34 * T + hash(i, 41) * 5 * T, 3 * T + hash(i, 42) * 15 * T, 3 + hash(i, 43) * 6);
  c.fillStyle = '#5a3a10'; c.font = 'bold 22px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('? ? ?', 36.5 * T, 8 * T + Math.sin(anim * 2) * 3);
  c.font = 'bold 10px Trebuchet MS'; c.fillText('something is', 36.5 * T, 9.3 * T); c.fillText('hiding in here...', 36.5 * T, 9.9 * T);
}
function drawNail(c) {
  if (nail.x < 0) return;
  const x = nail.x;
  c.fillStyle = 'rgba(255,240,210,.18)'; c.fillRect(x - 160, 0, 160, 3 * T);          // scratch marks
  c.save(); c.translate(x, -34);
  c.fillStyle = '#e8b896'; c.strokeStyle = '#9a6a4a'; c.lineWidth = 2;                  // fingertip
  c.beginPath(); c.ellipse(-60, 0, 90, 56, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#f8e0d8'; c.strokeStyle = '#c09080'; c.lineWidth = 2;                  // the nail
  c.beginPath(); c.ellipse(-30, 6, 52, 34, -.1, 0, 7); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(-36, -4, 30, 8, -.1, 0, 7); c.fill();
  c.restore();
  c.fillStyle = '#ffe0c8'; c.font = 'bold 14px Trebuchet MS'; c.textAlign = 'center';
  c.fillText('SCRATCH! SCRATCH!', x - 40, 96 + Math.sin(anim * 10) * 3);
}

// ---------- drawing: frame ----------
function render(c) {
  c.drawImage(bgCanvas, 0, 0);
  drawLift(c);
  drawExitPore(c);
  c.drawImage(terrCanvas, 0, 0);
  drawLymph(c, heroes[2].sample);
  drawCapillary(c);
  drawGlandLabel(c);
  drawKing(c, KING.x, KING.y, kingDead ? .35 * (1 - kingGone) : .35 + .65 * kingHP / TC_NEED, anim, kingHit);
  for (const g of germs) {
    if (g.state === 'hidden') drawHidden(c, cx(g), cy(g), anim + g.phase);
    else drawVirus(c, cx(g), cy(g), anim + g.phase, g.state === 'eaten' ? Math.max(.1, 1 - g.t / .6) : 1, g.state === 'swept' ? Math.max(0, 1 - g.t) : 1);
  }
  drawFog(c);
  for (const r of walkers) drawTcell(c, cx(r), cy(r), r.state === 'home' ? 1 : r.dir, r.ph, r.state, r.kind,
    r.state === 'splash' ? Math.max(0, 1 - r.t) : 1);
  drawHeroes(c, (c, h, x, by, walking) => drawLanger(c, x, by, h.facing, anim, walking));
  const z = heroes[0], lg = heroes[2];
  drawAcidBottle(c, cx(z) + z.facing * 7, z.y + 17);
  if (lg.sample) {
    c.fillStyle = 'rgba(220,255,140,.35)'; circle(c, cx(lg), lg.y - 26, 9);
    drawVirus(c, cx(lg), lg.y - 26, anim, .7);
  }
  drawParts(c);
  drawNail(c);
  drawFloats(c);
  hudTop(c, 'Killer T cells:', saved, 0, 'arrived');
  c.textAlign = 'right';
  if (nail.warned && nail.x < 0 && !kingDead) {
    c.fillStyle = Math.sin(anim * 8) > 0 ? '#ffe0c8' : '#ff9a7a';
    c.fillText('Uh-oh... a fingernail is coming!', W - 8, 12.5);
  } else {
    c.fillStyle = '#f2c933';
    c.fillText(`👑 Wart size: ${SIZE[kingDead ? 0 : kingHP]}`, W - 8, 12.5);
  }
  hudBottom(c);
}

// ---------- end: how to beat a wart ----------
function drawTips() {
  const cv = document.getElementById('endArt'), c = cv.getContext('2d');
  const TIPS = [['🧴', 'Salicylic acid', 'every day, for weeks'], ['❄️', 'Freezing', 'at the doctor\'s'],
    ['🛡️', 'Immune system', 'wins in the end'], ['🚫', 'Don\'t pick!', 'or it spreads']];
  cv.hidden = false; c.clearRect(0, 0, cv.width, cv.height);
  c.textAlign = 'center'; c.font = 'bold 12px Trebuchet MS'; c.fillStyle = '#ffd88a';
  c.fillText('HOW TO BEAT A WART', 320, 14);
  TIPS.forEach(([icon, name, sub], i) => {
    const x = 84 + i * 157;
    c.fillStyle = i === 2 ? 'rgba(199,224,79,.18)' : 'rgba(255,255,255,.06)'; rr(c, x - 72, 22, 144, 124, 10); c.fill();
    if (i === 2) { c.strokeStyle = '#c7e04f'; c.lineWidth = 2; c.stroke(); }
    c.fillStyle = '#fff'; c.font = '38px Trebuchet MS'; c.fillText(icon, x, 76);
    c.fillStyle = '#f3e6d8'; c.font = 'bold 13px Trebuchet MS'; c.fillText(name, x, 106);
    c.fillStyle = '#e8c9c0'; c.font = '11px Trebuchet MS'; c.fillText(sub, x, 122);
    if (i === 2) { c.fillStyle = '#d7ef6a'; c.font = 'bold 11px Trebuchet MS'; c.fillText('★ YOU DID THIS! ★', x, 139); }
    c.fillStyle = '#ffd88a';
  });
}

// ---------- finale: the King pops, new skin grows, out onto the palm ----------
function drawPalm(c) {
  c.fillStyle = '#e8b896'; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(160,100,70,.35)'; c.lineWidth = 1.2;                 // friction ridges, like fingerprints
  for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(480, 900, 420 + i * 14, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  c.strokeStyle = 'rgba(150,80,60,.6)'; c.lineWidth = 4;                     // palm creases
  c.beginPath(); c.moveTo(-20, 150); c.bezierCurveTo(300, 120, 600, 200, 980, 140); c.stroke();
  c.beginPath(); c.moveTo(-20, 300); c.bezierCurveTo(250, 260, 520, 330, 700, 420); c.stroke();
}
function drawTeam(c, x, y, s, t, hop = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  drawZaal(c, -40, -Math.abs(Math.sin(t * 6)) * hop, 1, anim, false);
  drawGobbler(c, 2, -Math.abs(Math.sin(t * 6 + 1)) * hop, 1, anim, 0, 3);
  drawLanger(c, 40, -Math.abs(Math.sin(t * 6 + 2)) * hop, -1, anim, false);
  c.restore();
}
const FINALE = [
  { dur: 3, text: 'ZAP! ZAP! ZAP! The Killer T cells make every infected cell self-destruct. King Papilloma shrinks... and shrinks... and POP!',
    onShow() { fin.pop = false; },
    draw(c, t) {
      c.drawImage(bgCanvas, 0, 0);
      c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, W, H);
      const s = Math.max(0, 2.6 * (1 - t / 2.4));
      drawKing(c, 480, 400, s, anim, Math.sin(t * 9) > 0 ? 1 : 0);
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * Math.PI * 2 + t * 1.6, r = 150 - Math.min(t, 2.4) * 30;
        c.save(); c.translate(480 + Math.cos(a) * r, 330 + Math.sin(a) * r * .6); c.scale(2.6, 2.6); drawTcell(c, 0, 0, Math.cos(a) > 0 ? -1 : 1, t * 3 + i, 'home', i % 3); c.restore();
      }
      if (t > 2.4) {
        if (!fin.pop) { fin.pop = true; sfx('plop'); }
        const u = (t - 2.4) * 2;
        for (let i = 0; i < 20; i++) { const a = i / 20 * 7; c.fillStyle = `rgba(230,196,166,${Math.max(0, 1 - u)})`; circle(c, 480 + Math.cos(a) * u * 200, 360 + Math.sin(a) * u * 140, 7); }
        c.fillStyle = '#fff6a0'; c.font = 'bold 60px Trebuchet MS'; c.textAlign = 'center'; c.fillText('POP!', 480, 300);
      }
    } },
  { dur: 3.4, text: 'With the virus gone, brand new skin cells grow up from the bottom layer. They push the old wart skin up and away. Your skin makes a whole new top layer about every month!',
    draw(c, t) {
      c.fillStyle = '#36161e'; c.fillRect(0, 0, W, H);
      for (let j = 0; j < 9; j++) {
        const y = 520 - j * 56 - (t * 30) % 56;
        for (let i = 0; i < 14; i++) {
          const x = i * 76 + (j % 2) * 38, k = clamp((520 - y) / 520, 0, 1);
          c.fillStyle = `hsl(${350 + k * 40},${45 - k * 15}%,${45 + k * 10}%)`;
          c.strokeStyle = 'rgba(40,10,15,.6)'; c.lineWidth = 2;
          c.beginPath(); c.ellipse(x, y, 34, 24 - k * 14, 0, 0, 7); c.fill(); c.stroke();
          if (k < .7) { c.fillStyle = 'rgba(90,30,80,.6)'; circle(c, x, y, 7 * (1 - k)); }
        }
      }
      for (let i = 0; i < 6; i++) {                              // old wart flakes floating away
        const u = (t * .4 + i / 6) % 1;
        c.save(); c.translate(120 + i * 140, 90 - u * 160); c.rotate(u * 4 + i);
        c.fillStyle = 'rgba(210,180,110,.9)'; rr(c, -24, -8, 48, 16, 6); c.fill(); c.restore();
      }
      c.fillStyle = '#c7e04f'; rr(c, 330, 190, 300, 50, 14); c.fill();
      c.fillStyle = '#23360a'; c.font = 'bold 24px Trebuchet MS'; c.textAlign = 'center'; c.fillText('NEW SKIN ⬆', 480, 224);
    } },
  { dur: 3, text: 'The team climbs out of a sweat pore onto Zaal\'s palm. The rough lump is gone. High five!',
    draw(c, t) {
      drawPalm(c);
      c.fillStyle = 'rgba(240,150,140,.35)'; c.beginPath(); c.ellipse(480, 330, 120, 70, 0, 0, 7); c.fill();   // where the wart was
      c.fillStyle = '#5a2a1a'; c.beginPath(); c.ellipse(480, 360, 26, 9, 0, 0, 7); c.fill();                   // the pore
      const up = Math.min(1, t / 1.2);
      drawTeam(c, 480, 360 - up * 30, 3, t, up >= 1 ? 22 : 0);
      c.fillStyle = '#c7e04f'; rr(c, 80, 70, 230, 60, 14); c.fill();
      c.fillStyle = '#23360a'; c.font = 'bold 26px Trebuchet MS'; c.textAlign = 'center'; c.fillText('WART GONE ✓', 195, 110);
    } },
  { dur: 3.4, text: 'Wart tips! Don\'t pick or bite warts. Don\'t share towels or socks. And wear flip-flops at the swimming pool!',
    draw(c, t) {
      c.fillStyle = '#dff1f5'; c.fillRect(0, 0, W, H);
      c.save(); c.translate(180, 270);                           // flip-flops
      for (const dx of [-40, 40]) {
        c.fillStyle = '#3aa0d8'; c.beginPath(); c.ellipse(dx, 0, 32, 80, dx > 0 ? .08 : -.08, 0, 7); c.fill();
        c.strokeStyle = '#f2c933'; c.lineWidth = 7; c.beginPath(); c.moveTo(dx - 26, 10); c.lineTo(dx, -40); c.lineTo(dx + 26, 10); c.stroke();
      }
      c.restore();
      c.fillStyle = '#e8303c'; rr(c, 400, 170, 160, 200, 10); c.fill();       // your own towel
      c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) c.fillRect(400, 200 + i * 44, 160, 12);
      c.save(); c.translate(780, 270);                          // a crossed-out picking fingernail
      c.fillStyle = '#e8b896'; c.strokeStyle = '#9a6a4a'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 10, 50, 80, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#f8e0d8'; c.beginPath(); c.ellipse(0, -30, 32, 36, 0, 0, 7); c.fill(); c.stroke();
      c.strokeStyle = '#e8303c'; c.lineWidth = 12; c.beginPath(); c.arc(0, 0, 100, 0, 7); c.moveTo(-70, -70); c.lineTo(70, 70); c.stroke();
      c.restore();
      c.fillStyle = '#2b3a40'; c.font = 'bold 22px Trebuchet MS'; c.textAlign = 'center';
      c.fillText('Flip-flops at the pool', 180, 420); c.fillText('Your own towel', 480, 420); c.fillText('No picking!', 780, 420);
    } },
];

// ---------- story ----------
Object.assign(IMG, {
  langer: portrait(c => drawLanger(c, 32, 50, 1, 0, false)),
  tcell: portrait(c => { c.translate(32, 36); c.scale(2.2, 2.2); drawTcell(c, 0, 0, 1, 0, 'home', 0); }),
  hpv: portrait(c => { c.translate(32, 36); c.scale(2.4, 2.4); drawVirus(c, 0, 0, 0); }),
  king: portrait(c => drawKing(c, 32, 58, .62, 0, 0)),
  acid: portrait(c => {
    c.fillStyle = '#7a4a1c'; rr(c, 22, 26, 20, 30, 4); c.fill();
    c.fillStyle = '#f3e6d8'; c.fillRect(22, 34, 20, 12);
    c.fillStyle = '#3a8a3a'; c.fillRect(27, 16, 10, 10);
    c.fillStyle = '#7a4a1c'; c.font = 'bold 6px Trebuchet MS'; c.textAlign = 'center'; c.fillText('ACID', 32, 42);
  }),
});
const STORY = [
  `<h1>ZAAL vs GERMS</h1><h2>Level 3 · Wart Undercover</h2>
   <div class="pics"><img src="${IMG.zaal}"><img src="${IMG.king}"><img src="${IMG.hpv}"></div>
   <p>This time the patient is... <b>Zaal himself</b>! There's a rough little lump on the palm of his left hand. It's a ${Wd('wart')}.</p>
   <p>Last year Zaal had a ${Wd('verruca')} on the sole of his foot. That one got cured. So where did this new one come from? And how do we get rid of it?</p>
   <p>Zaal jumps into his shrink-ship and flies into... his own hand. (Don't think about it too hard!)</p>
   <p class="tip nospeak">Tap any <span class="w" data-w="wart">underlined word</span> to find out what it means.</p>`,
  `<h2>What is a wart?</h2>
   <div class="pics"><img src="${IMG.hpv}"></div>
   <p>A wart is caused by a ${Wd('virus')} called ${Wd('HPV')}, short for <b>human papillomavirus</b> <span class="pron">(say "PAP-ih-LOH-muh virus")</span>. Viruses are much, much smaller than bacteria.</p>
   <p>The virus sneaks into the skin through a tiny cut or scratch. Warts spread when you touch them, share towels, or walk barefoot on wet floors, like at the swimming pool.</p>
   <p>Did the verruca on Zaal's foot jump to his hand? Maybe! Picking or scratching a wart can carry the virus to another part of you. But there are more than 200 kinds of HPV, so it might be a brand new one.</p>`,
  `<h2>The sneaky hide-out</h2>
   <div class="pics"><img src="${IMG.king}"></div>
   <p>The virus moves into the bottom layer of the ${Wd('epidermis')}, the top part of your skin. It makes the skin cells grow far too fast, and they pile up into a hard lump of ${Wd('keratin')} <span class="pron">(say "KERRA-tin")</span>.</p>
   <p>See the tiny black dots in a wart? They're not seeds! They're tiny blood vessels that grew into the wart and clotted.</p>
   <p>The epidermis has no blood vessels, and the virus doesn't burst the cells it lives in. So the ${Wd('immune system')} hardly notices it. The boss of this wart, <b>King Papilloma</b>, thinks he's found the perfect hiding place!</p>`,
  `<h2>How do you get rid of a wart?</h2>
   <div class="pics"><img src="${IMG.acid}"><img src="${IMG.tcell}"></div>
   <p>Lots of warts in children go away on their own, because in the end the immune system finds the virus. But that can take months, or even years.</p>
   <p>${Wd('salicylic acid', 'Salicylic acid')} <span class="pron">(say "sal-ih-SIL-ik")</span> from the pharmacy softens the wart so it comes off one thin layer at a time. Doctors can also freeze warts with super-cold ${Wd('liquid nitrogen')}.</p>
   <p>Our plan: melt the keratin, find the hidden virus, and <b>tell the immune system where it is!</b></p>`,
  `<h2>Meet your team</h2>
   <div class="team">
     <div class="card"><img src="${IMG.zaal}"><b>1 · Zaal</b><span>The explorer. He can <b>super-jump</b>, and he squirts ${Wd('salicylic acid')} to <b>melt yellow keratin walls</b>.</span></div>
     <div class="card"><img src="${IMG.gob}"><b>2 · Gobbler</b><span>Our hungry ${Wd('macrophage')}. He <b>swallows virus particles</b>. But if a virus hides inside a skin cell, he can't reach it!</span></div>
     <div class="card"><img src="${IMG.langer}"><b>3 · Langer</b><span>New! A ${Wd('Langerhans cell')} <span class="pron">(LANG-er-hans)</span>, the skin's lookout. She <b>grabs a virus sample</b> and takes it to the ${Wd('lymph vessel')} to <b>raise the alarm</b>.</span></div>
   </div>
   <p class="tip">Goblet stayed in the colon, and Patch is still guarding the stomach.</p>`,
  `<h2>Your mission</h2>
   <ul>
     <li>Raise the alarm, then get at least <b>7 of the 10</b> ${Wd('killer T cell', 'Killer T cells')} to <b>King Papilloma</b>. Then all 3 heroes leave through the sweat pore.</li>
     <li>Zaal melts the <b>yellow keratin</b> with acid.</li>
     <li>Langer grabs a <b>virus sample</b>, then takes it to the green <b>lymph vessel</b> to raise the alarm. That calls the Killer T cells out of the ${Wd('capillary')}.</li>
     <li>T cells walk by themselves, and they come out walking <b>left</b>, towards the salty ${Wd('sweat gland')}! A hero standing still turns them around.</li>
     <li>If a T cell falls in the sweat gland, it goes back to the capillary for another go. No rush!</li>
     <li>The <b>sweat duct</b> floats you up. 💦 And watch out: Zaal's fingers can't stop picking the wart...</li>
   </ul>
   <p class="keys" style="text-align:center"><span class="nospeak"><kbd>←</kbd> <kbd>→</kbd> move · <kbd>Space</kbd> jump · <kbd>E</kbd> use power ·
     <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> or <kbd>Tab</kbd> switch hero</span></p>`,
];
const FLY = [
  { cam: [200, 420, 1], path: [[430, 130], [372, 260]], labels: [],
    text: 'This time, the patient is... ZAAL! He has a rough little lump on the palm of his left hand.' },
  { cam: [318, 400, 2.4], path: [[372, 260], [330, 330], [326, 440]], labels: ['left hand'],
    text: 'Zaal is facing us, so his left hand is on OUR right. Down the arm we go...' },
  { cam: [332, 492, 9], path: [[326, 440], [333, 490]], labels: ['left hand'],
    text: 'There it is: the wart! A hard, bumpy lump with tiny black dots. Those dots are tiny clotted blood vessels.' },
  { cam: [333, 492, 90], path: [[333, 490], [333, 492]], labels: [], fade: 'rgba(76,60,32,A)',
    text: 'Shrink... shrink... SHRINK! Down through the tough top layer of skin, into the wart itself. The virus is hiding somewhere in here...' },
];
// The wart on the palm of Zaal's left hand (our right).
function flyExtras(c) {
  c.fillStyle = '#c9a184'; c.strokeStyle = '#7a5038'; c.lineWidth = .4;
  for (const [dx, dy, r] of [[-1.2, .4, 1.4], [1.2, .4, 1.4], [0, -.8, 1.6]]) { c.beginPath(); c.arc(333 + dx, 492 + dy, r, 0, 7); c.fill(); c.stroke(); }
  c.fillStyle = '#1e0606';
  for (let i = 0; i < 5; i++) circle(c, 331.6 + hash(i, 61) * 2.8, 490.8 + hash(i, 62) * 2.4, .22);
}

return {
  num: 3, code: 'BURP', award: 'GOOP', title: 'Level 3 · Wart Undercover',
  facts: FACTS, exit: EXIT, escort: { total: TC_TOTAL, need: TC_NEED, color: '#8fd3ff' },
  solid, reset, usePower, update, render, renderBackground: paintBackground, renderTerrain: paintTerrain,
  story: STORY, fly: FLY, finale: FINALE, flyExtras,
  lines: [...BRAIN_LINES.map(b => b[1]), ...Object.values(BRAIN)].map(t => 'Brain says: ' + t),
  dbg: () => ({ alarm, kingHP, kingDead, wallOpen, domeOpen, meltQ: meltQ.length, nail, oops, gulps }),   // for testing from the console
  onStart() { setTimeout(() => fact('hpv'), 1500); setTimeout(() => fact('noBlood'), 16000); },
  onRelease() {
    if (alarm) return;
    released = false;
    say(heroes[active], 'Langer has to raise the alarm first!', '#ffd88a');
    brainSay(BRAIN.early);
  },
};
})();
