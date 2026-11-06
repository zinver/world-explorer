const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const L = require('./public/lists.js');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const BD_URL = process.env.BD_GEO_URL ||
  'https://raw.githubusercontent.com/yasserius/bangladesh_geojson_shapefile/main/small/small_bangladesh_geojson_adm2_64_districts_zillas.json';

fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, 'maps.json');
let db = {};
try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (_) {}
let persistT = null;
function persist() {
  clearTimeout(persistT);
  persistT = setTimeout(() => {
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, DB_FILE);
  }, 300);
}

const DSET = new Set(L.DISTRICTS), CSET = new Set(L.COUNTRIES);
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const ALPHA = 'abcdefghjkmnpqrstuvwxyz23456789';
function newId() {
  for (;;) {
    const b = crypto.randomBytes(8);
    let id = '';
    for (const x of b) id += ALPHA[x % ALPHA.length];
    if (!db[id]) return id;
  }
}
function clean(b) {
  b = b || {};
  const photo = typeof b.photo === 'string' && b.photo.startsWith('data:image/jpeg;base64,') && b.photo.length < 150000 ? b.photo : '';
  return {
    name: String(b.name || '').slice(0, 40),
    theme: Number.isInteger(b.theme) && b.theme >= 0 && b.theme <= 4 ? b.theme : 0,
    photo,
    bd: [...new Set((b.bd || []).filter(x => DSET.has(x)))],
    world: [...new Set((b.world || []).filter(x => CSET.has(x)))],
    names: { bd: !(b.names && b.names.bd === false), world: !(b.names && b.names.world === false) }
  };
}

// tiny in-memory rate limiter
const hits = new Map();
function limit(kind, max) {
  return (req, res, next) => {
    const k = kind + req.ip, now = Date.now();
    const arr = (hits.get(k) || []).filter(t => now - t < 3600e3);
    if (arr.length >= max) return res.status(429).json({ error: 'Too many requests' });
    arr.push(now); hits.set(k, arr); next();
  };
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '400kb' }));

app.post('/api/maps', limit('c', 10), (req, res) => {
  const id = newId(), token = crypto.randomBytes(18).toString('hex');
  db[id] = { ...clean(req.body), tokenHash: sha(token), created: Date.now(), updated: Date.now() };
  persist();
  res.json({ id, token });
});

app.get('/api/maps/:id', (req, res) => {
  const m = db[req.params.id];
  if (!m) return res.status(404).json({ error: 'Not found' });
  const { tokenHash, ...pub } = m;
  res.set('Cache-Control', 'no-store').json(pub);
});

app.put('/api/maps/:id', limit('u', 200), (req, res) => {
  const m = db[req.params.id];
  if (!m) return res.status(404).json({ error: 'Not found' });
  const t = req.get('x-edit-token') || '';
  if (!t || sha(t) !== m.tokenHash) return res.status(403).json({ error: 'Forbidden' });
  db[req.params.id] = { ...m, ...clean(req.body), updated: Date.now() };
  persist();
  res.json({ ok: true });
});

// Bangladesh district boundaries: fetched once from GitHub, then cached on disk.
app.get('/geo/bd.json', async (req, res) => {
  const f = path.join(DATA_DIR, 'bd.geojson');
  if (!fs.existsSync(f)) {
    try {
      const r = await fetch(BD_URL);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    } catch (e) {
      return res.status(502).json({ error: 'Could not fetch district map data', detail: String(e.message || e) });
    }
  }
  res.set('Cache-Control', 'public, max-age=86400').type('application/json').sendFile(f);
});

app.use(express.static(path.join(__dirname, 'public')));
app.get(['/u/:id', '/e/:id'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log('Listening on ' + PORT));