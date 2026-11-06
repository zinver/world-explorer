/* Reviews (posts with a 1-5 star rating) about COUNTRIES. Front end.
   - A review is a post: stars + text + up to 10 photos. Only for countries you have marked as visited.
   - "My reviews" (World page, Posts switch): tap one of your visited countries to see YOUR reviews of it.
   - "Reviews" tab: anyone picks a country and sees ALL reviews written about it (by everyone), with the average rating.
   Right now everything is stored on THIS device (localStorage) through `Store`.
   When the backend is ready, only the `Store` object below is replaced with Supabase calls. The screens stay the same. */
(function(){
const $ = id => document.getElementById(id);
const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MAXPH = 10;

/* ---------- strings ---------- */
Object.assign(I18N.en, {
  rev:'Reviews', revTitle:'Pick a country', revCnt:'with reviews',
  p_pick:'Pick places', p_posts:'My reviews', p_write:'✎ Write a review',
  p_tipOwner:'Tap a visited country to read or write your reviews. A red badge means it has your reviews.',
  p_tipView:'Tap a country with a red badge to read this traveller’s reviews.',
  p_tipReview:'Tap a country to read its reviews. A yellow badge shows the average rating.',
  p_notVisited:'You can only review countries you have visited. Mark it as visited first (use “Pick places”).',
  p_close:'Close', p_none:'No reviews about this country yet.', p_edit:'Edit', p_del:'Delete',
  p_comments:'comments', p_addCm:'Write a comment…', p_send:'Send', p_noCm:'No comments yet.',
  p_newTitle:'New review', p_editTitle:'Edit review', p_place:'Country',
  p_text:'Share your experience: what you saw, ate, tips for others…',
  p_addPhotos:'＋ Add photos (up to 10)', p_save:'Post review', p_update:'Save changes', p_cancel:'Cancel',
  p_needPlace:'Mark countries as visited first (World page), then you can review them.',
  p_emptyText:'Write something first.', p_needRating:'Pick 1 to 5 stars first.', p_rate:'Your rating',
  p_needVisit:'You can only review countries you have visited. Mark this country as visited on the World page first.',
  p_viewerNote:'To write a review, open your own map, mark this country as visited, then review it.',
  p_byOwner:'Reviews by the map owner',
  p_sortNew:'Newest', p_sortHigh:'Highest rated', p_sortLow:'Lowest rated',
  p_demo:'Demo mode: there is no backend yet, so reviews stay on this device only.',
  p_yourName:'Your name', p_needName:'Enter your name first.',
  p_login:'Log in with Google to review or comment',
  p_confirmDel:'Delete this review and its comments?', p_confirmDelCm:'Delete this comment?',
  p_failed:'Could not save. Check your connection and that this country is in your saved visited list, then try again.', p_full:'Storage is full. Remove a photo or delete old reviews.', p_edited:'edited', p_owner:'Owner'
});
Object.assign(I18N.bn, {
  rev:'রিভিউ', revTitle:'দেশ বাছুন', revCnt:'টিতে রিভিউ আছে',
  p_pick:'জায়গা বাছুন', p_posts:'আমার রিভিউ', p_write:'✎ রিভিউ লিখুন',
  p_tipOwner:'রিভিউ পড়তে বা লিখতে ঘোরা দেশে ট্যাপ করুন। লাল ব্যাজ মানে সেখানে আপনার রিভিউ আছে।',
  p_tipView:'এই ভ্রমণকারীর রিভিউ পড়তে লাল ব্যাজ দেওয়া দেশে ট্যাপ করুন।',
  p_tipReview:'রিভিউ পড়তে একটি দেশে ট্যাপ করুন। হলুদ ব্যাজে গড় রেটিং দেখা যায়।',
  p_notVisited:'শুধু ঘোরা দেশেরই রিভিউ লিখতে পারবেন। আগে দেশটি ঘোরা হিসেবে চিহ্নিত করুন (“জায়গা বাছুন” থেকে)।',
  p_close:'বন্ধ করুন', p_none:'এই দেশ নিয়ে এখনও কোনো রিভিউ নেই।', p_edit:'এডিট', p_del:'মুছুন',
  p_comments:'মন্তব্য', p_addCm:'একটি মন্তব্য লিখুন…', p_send:'পাঠান', p_noCm:'এখনও কোনো মন্তব্য নেই।',
  p_newTitle:'নতুন রিভিউ', p_editTitle:'রিভিউ এডিট', p_place:'দেশ',
  p_text:'আপনার অভিজ্ঞতা লিখুন: কী দেখলেন, কী খেলেন, অন্যদের জন্য টিপস…',
  p_addPhotos:'＋ ছবি যোগ করুন (সর্বোচ্চ ১০টি)', p_save:'রিভিউ করুন', p_update:'পরিবর্তন সেভ করুন', p_cancel:'বাতিল',
  p_needPlace:'আগে ঘোরা দেশ চিহ্নিত করুন (বিশ্ব পেজে), তারপর রিভিউ লিখতে পারবেন।',
  p_emptyText:'আগে কিছু লিখুন।', p_needRating:'আগে ১ থেকে ৫ স্টার বাছুন।', p_rate:'আপনার রেটিং',
  p_needVisit:'শুধু ঘোরা দেশেরই রিভিউ লিখতে পারবেন। আগে বিশ্ব পেজে দেশটি ঘোরা হিসেবে চিহ্নিত করুন।',
  p_viewerNote:'রিভিউ লিখতে নিজের মানচিত্র খুলুন, দেশটি ঘোরা হিসেবে চিহ্নিত করুন, তারপর রিভিউ লিখুন।',
  p_byOwner:'মানচিত্রের মালিকের রিভিউ',
  p_sortNew:'নতুন আগে', p_sortHigh:'সবচেয়ে বেশি রেটিং', p_sortLow:'সবচেয়ে কম রেটিং',
  p_demo:'ডেমো মোড: এখনও ব্যাকএন্ড নেই, তাই রিভিউ শুধু এই ডিভাইসে থাকবে।',
  p_yourName:'আপনার নাম', p_needName:'আগে আপনার নাম লিখুন।',
  p_login:'রিভিউ বা মন্তব্য করতে Google দিয়ে লগইন করুন',
  p_confirmDel:'এই রিভিউ ও এর মন্তব্যগুলো মুছবেন?', p_confirmDelCm:'এই মন্তব্যটি মুছবেন?',
  p_failed:'সেভ করা যায়নি। ইন্টারনেট দেখুন এবং দেশটি আপনার সেভ করা ভিজিটেড তালিকায় আছে কিনা দেখুন, তারপর আবার চেষ্টা করুন।', p_full:'জায়গা শেষ। একটি ছবি বাদ দিন বা পুরনো রিভিউ মুছুন।', p_edited:'এডিট করা', p_owner:'মালিক'
});

/* ---------- styles ---------- */
const css = document.createElement('style');
css.textContent = `
#interSwitch{margin-bottom:12px}
#postBar{margin:0 0 12px}
#postBar .btn{width:100%}
.pm{cursor:pointer}
#pSheet{z-index:25}
#pSheet .sheetBox{max-width:600px;min-height:50vh}
.stars{display:inline-block;font-size:18px;letter-spacing:2px;line-height:1;background:linear-gradient(90deg,#f5a623 var(--p),#9aa0a6aa var(--p));-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.rsum{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 12px}
.rsum .stars{font-size:24px}
.rsum b{font-size:22px}
.rsum small{color:var(--mut)}
.rate{display:flex;gap:4px;margin:6px 0 12px}
.rate button{border:0;background:none;font-size:34px;line-height:1;padding:2px;color:#9aa0a6aa;cursor:pointer}
.rate button.on{color:#f5a623}
.post{border:1px solid var(--line);border-radius:18px;padding:14px;margin:12px 0;background:var(--bg)}
.post header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.post header small{color:var(--mut);margin-left:6px}
.post .stars{margin-bottom:8px}
.post p{margin:0 0 10px;white-space:pre-wrap;word-break:break-word}
.pimgs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.pimgs img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px;cursor:zoom-in;display:block}
.pimgs.one{grid-template-columns:1fr}.pimgs.one img{aspect-ratio:4/3}
.pimgs.two{grid-template-columns:1fr 1fr}
.cmBox{border-top:1px solid var(--line);margin-top:10px;padding-top:10px}
.cm{padding:8px 0;border-bottom:1px solid var(--line);font-size:15px}
.cm:last-of-type{border-bottom:0}
.cm small{color:var(--mut);margin-left:6px}
.cm .lnk{font-size:13px;margin-left:8px}
.cmForm{display:flex;gap:8px;margin-top:8px}
.cmForm input{margin:0!important}
.pta{width:100%;min-height:140px;resize:vertical;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:18px;padding:14px;font:inherit}
.psel{width:100%;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:14px;padding:12px;font:inherit;margin:6px 0 12px}
.thumbs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.thumbs div{position:relative;width:84px;height:84px}
.thumbs img{width:100%;height:100%;object-fit:cover;border-radius:12px}
.thumbs button{position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;border:0;background:#111;color:#fff;font-size:14px;line-height:1;padding:0}
.pnote{background:var(--chip);border-radius:14px;padding:10px 14px;font-size:14px;color:var(--mut);margin:10px 0}
.pnote input{margin:8px 0 0!important;padding:10px 14px!important}
.chip small{opacity:.8;margin-left:6px;font-weight:700}
#pLb{position:fixed;inset:0;background:#000d;z-index:40;display:flex;align-items:center;justify-content:center;padding:16px}
#pLb img{max-width:100%;max-height:100%;border-radius:12px}
#pToast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#111;color:#fff;border-radius:999px;padding:12px 20px;z-index:50;font-size:15px;max-width:90vw;text-align:center}
`;
document.head.appendChild(css);

/* ---------- store (this device only for now) ---------- */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const LocalStore = {
  _r(){ try{ const d = JSON.parse(localStorage.getItem('tm_posts')); if(d && d.posts && d.comments) return d; }catch(_){} return {posts:[], comments:[]}; },
  _w(d){ localStorage.setItem('tm_posts', JSON.stringify(d)); },
  // owner = a map owner's id, or null for "everybody"
  async counts(owner){
    const n = {}, sum = {};
    this._r().posts.filter(p => p.kind === 'world' && (!owner || p.owner === owner)).forEach(p => { n[p.place] = (n[p.place] || 0) + 1; sum[p.place] = (sum[p.place] || 0) + (+p.rating || 0); });
    const avg = {}; for(const k in n) avg[k] = sum[k] / n[k];
    return {n, avg};
  },
  async list(owner, place){
    const d = this._r();
    return d.posts.filter(p => p.kind === 'world' && p.place === place && (!owner || p.owner === owner))
      .sort((a,b) => b.at.localeCompare(a.at))
      .map(p => Object.assign({}, p, {comments: d.comments.filter(c => c.post===p.id).sort((a,b) => a.at.localeCompare(b.at))}));
  },
  async savePost(p){ const d = this._r(), i = d.posts.findIndex(x => x.id===p.id); if(i<0) d.posts.push(p); else d.posts[i] = p; this._w(d); },
  async removePost(id){ const d = this._r(); d.posts = d.posts.filter(p => p.id!==id); d.comments = d.comments.filter(c => c.post!==id); this._w(d); },
  async addComment(c){ const d = this._r(); d.comments.push(c); this._w(d); },
  async removeComment(id){ const d = this._r(); d.comments = d.comments.filter(c => c.id!==id); this._w(d); }
};

/* ---------- Supabase store (shared, what visitors see) ---------- */
const BKT = 'review-photos';
const SBStore = {
  _url(path){ return /^(https?:|data:)/.test(path) ? path : sb.storage.from(BKT).getPublicUrl(path).data.publicUrl; },
  _path(u){ const i = u.indexOf('/' + BKT + '/'); return i >= 0 ? u.slice(i + BKT.length + 2).split('?')[0] : u; },
  _post(r, cms){ return {id:r.id, owner:null, kind:'world', place:r.country, rating:r.rating, text:r.body, photos:(r.photos || []).map(x => this._url(x)),
    authorId:r.user_id, authorName:r.author_name, at:r.created_at, edited:r.edited, comments:(cms || []).map(c => ({id:c.id, post:c.review_id, authorId:c.user_id, authorName:c.author_name, text:c.body, at:c.created_at}))}; },
  async counts(owner){
    const q = owner ? await sb.rpc('owner_review_stats', {p_map_id: owner}) : await sb.rpc('review_stats');
    if(q.error) throw q.error;
    const n = {}, avg = {}; (q.data || []).forEach(r => { n[r.country] = +r.n; avg[r.country] = +r.avg; });
    return {n, avg};
  },
  async list(owner, place){
    let rows;
    if(owner){ const q = await sb.rpc('owner_reviews', {p_map_id: owner, p_country: place}); if(q.error) throw q.error; rows = q.data || []; }
    else { const q = await sb.from('reviews').select('*').eq('country', place).order('created_at', {ascending:false}).limit(200); if(q.error) throw q.error; rows = q.data || []; }
    if(!rows.length) return [];
    const c = await sb.from('review_comments').select('*').in('review_id', rows.map(r => r.id)).order('created_at');
    if(c.error) throw c.error;
    return rows.map(r => this._post(r, (c.data || []).filter(x => x.review_id === r.id)));
  },
  async savePost(p, isNew){
    const { data:{ user:u } } = await sb.auth.getUser(); if(!u) throw new Error('login');
    const paths = [];
    for(const ph of p.photos){
      if(ph.indexOf('data:') === 0){
        const blob = await (await fetch(ph)).blob();
        const path = u.id + '/' + uid() + '.jpg';
        const up = await sb.storage.from(BKT).upload(path, blob, {contentType:'image/jpeg'});
        if(up.error) throw up.error;
        paths.push(path);
      } else paths.push(this._path(ph));
    }
    const row = {country:p.place, rating:p.rating, body:p.text, photos:paths, author_name:p.authorName};
    const q = isNew ? await sb.from('reviews').insert(row) : await sb.from('reviews').update(Object.assign(row, {edited:true})).eq('id', p.id);
    if(q.error) throw q.error;
  },
  async removePost(id){
    const g = await sb.from('reviews').select('photos').eq('id', id).maybeSingle();
    const q = await sb.from('reviews').delete().eq('id', id); if(q.error) throw q.error;
    const f = g.data && g.data.photos; if(f && f.length) sb.storage.from(BKT).remove(f);
  },
  async addComment(c){ const q = await sb.from('review_comments').insert({review_id:c.post, body:c.text, author_name:c.authorName}); if(q.error) throw q.error; },
  async removeComment(id){ const q = await sb.from('review_comments').delete().eq('id', id); if(q.error) throw q.error; }
};
const Store = new Proxy({}, {get:(_, k) => (typeof SUPABASE_URL === 'string' && SUPABASE_URL.indexOf('YOUR-PROJECT') >= 0 ? LocalStore : SBStore)[k].bind(typeof SUPABASE_URL === 'string' && SUPABASE_URL.indexOf('YOUR-PROJECT') >= 0 ? LocalStore : SBStore)});

/* ---------- state ---------- */
const PU = {m:'pick', counts:{world:{}}, avg:{}, cur:null, posts:[], view:'list', open:new Set(), c:null, err:'', sort:'new', _rv:null};
const demo = () => typeof SUPABASE_URL === 'string' && SUPABASE_URL.indexOf('YOUR-PROJECT') >= 0;
const ownerId = () => viewId || (me && me.id) || 'local';
const isRV = () => S.tab === 'review';
const kindOk = () => S.tab === 'world' || isRV();
const active = () => isRV() || (S.tab === 'world' && (mode === 'viewer' || PU.m === 'posts'));
const demoName = () => { try{ return localStorage.getItem('tm_demo_name') || S.name || ''; }catch(_){ return S.name || ''; } };
function who(){
  if(user){ const md = user.user_metadata || {}; return {id:user.id, name:md.name || md.full_name || (user.email || '').split('@')[0] || 'User'}; }
  if(demo()){ const n = demoName().trim(); return n ? {id:'demo:' + n.toLowerCase(), name:n} : null; }
  return null;
}
const fmtDate = iso => { try{ return new Date(iso).toLocaleDateString(lang==='bn' ? 'bn-BD' : 'en-GB', {day:'numeric', month:'short', year:'numeric'}); }catch(_){ return ''; } };
const stars = n => `<span class="stars" style="--p:${Math.max(0, Math.min(5, n)) / 5 * 100}%" aria-label="${(+n).toFixed(1)} / 5">★★★★★</span>`;
const avgTxt = n => dig((+n).toFixed(1));
const cntTxt = n => lang === 'bn' ? `${dig(n)}টি রিভিউ` : `${n} ${n === 1 ? 'review' : 'reviews'}`;
function toast(msg){
  let t = $('pToast'); if(!t){ t = document.createElement('div'); t.id = 'pToast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.remove('hide'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hide'), 3200);
}

/* ---------- badges on the maps ---------- */
function decorate(){
  if(!kindOk() || !G.world) return;
  const g = document.querySelector('#card #mapZ') || document.querySelector('#card svg g'); if(!g) return;
  const rv = isRV(), cnt = PU.counts.world || {}, by = new Map(G.world.items.map(i => [i.k, i]));
  let out = '';
  for(const k in cnt){
    const i = by.get(k); if(!i || (!rv && !S.world.has(k)) || !isFinite(i.c[0])) continue;
    const x = i.c[0], y = i.c[1] - 30, txt = rv ? avgTxt(PU.avg[k] || 0) : dig(cnt[k]);
    out += `<g class="pm" data-k="${h(k)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rv ? 23 : 19}" fill="${rv ? '#f5a623' : '#e11d48'}" stroke="#fff" stroke-width="4"/><text x="${x.toFixed(1)}" y="${(y+7).toFixed(1)}" text-anchor="middle" font-size="${rv ? 19 : 21}" font-weight="800" fill="${rv ? '#1a1a1a' : '#fff'}" pointer-events="none">${txt}</text></g>`;
  }
  if(out) g.insertAdjacentHTML('beforeend', out);
}
function globeMarks(ctx, proj, center){
  if(!kindOk() || !G.globe) return;
  const rv = isRV(), cnt = PU.counts.world || {}; if(PU._gs !== G.globe){ PU._gs = G.globe; PU._gm = new Map(G.globe.filter(c => c.k).map(c => [c.k, c])); }
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 11px system-ui, sans-serif';
  for(const k in cnt){
    const c = PU._gm.get(k); if(!c || (!rv && !S.world.has(k)) || !isFinite(c.c[0]) || d3.geoDistance(c.c, center) > 1.35) continue;
    const p = proj(c.c); if(!p) continue;
    ctx.beginPath(); ctx.arc(p[0], p[1] - 16, rv ? 12 : 10, 0, 6.2832); ctx.fillStyle = rv ? '#f5a623' : '#e11d48'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.fillStyle = rv ? '#1a1a1a' : '#fff'; ctx.fillText(rv ? avgTxt(PU.avg[k] || 0) : dig(cnt[k]), p[0], p[1] - 15.5);
  }
  ctx.restore();
}
function reviewed(){ return new Set(Object.keys(PU.counts.world || {})); }
const avgOf = k => PU.avg[k] || 0;
async function refresh(){
  PU._rv = isRV();
  try{ const c = await Store.counts(PU._rv ? null : ownerId()); PU.counts = {world:c.n}; PU.avg = c.avg; }catch(_){ PU.counts = {world:{}}; PU.avg = {}; }
  if(typeof renderCard === 'function') renderCard();
  if(typeof renderPicker === 'function') renderPicker();
}

/* ---------- switch (Pick places | My reviews) ---------- */
function sync(){
  const own = mode === 'owner', show = own && S.tab === 'world';
  const sw = $('interSwitch'); if(!sw) return;
  sw.classList.toggle('hide', !show);
  sw.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.m === PU.m));
  $('postBar').classList.toggle('hide', !(show && PU.m === 'posts'));
  if(PU._rv !== isRV()) refresh();   // the badges come from a different source on the Reviews tab
  setTip();
}
function setM(m){ PU.m = m; sync(); }
function tipText(){ return tr(isRV() ? 'p_tipReview' : mode === 'owner' ? 'p_tipOwner' : 'p_tipView'); }

/* ---------- tap on a country ---------- */
function tap(k){
  if(!active()) return false;
  if(isRV()){ openPlace(k, 'all'); return true; }
  if(!S.world.has(k)){ if(mode === 'owner') toast(tr('p_notVisited')); return true; }
  openPlace(k, 'owner'); return true;
}
function openReview(k){ openPlace(k, 'all'); }

/* ---------- the sheet ---------- */
function sheet(){
  let s = $('pSheet');
  if(!s){
    s = document.createElement('div'); s.id = 'pSheet'; s.className = 'sheet hide';
    s.innerHTML = '<div class="sheetBox" id="pBox"></div>';
    document.body.appendChild(s);
    s.addEventListener('click', onClick);
    s.addEventListener('input', onInput);
    const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.multiple = true; f.id = 'pFile'; f.className = 'hide';
    f.onchange = onFiles; document.body.appendChild(f);
    document.addEventListener('keydown', e => { if(e.key === 'Escape'){ if($('pLb')) $('pLb').remove(); else closeSheet(); } });
  }
  return s;
}
function closeSheet(){ const s = $('pSheet'); if(s) s.classList.add('hide'); PU.cur = null; }
async function openPlace(place, scope){
  PU.cur = {place, scope}; PU.view = 'list'; PU.err = ''; sheet().classList.remove('hide');
  await reload(); render();
}
async function reload(){
  if(!PU.cur || !PU.cur.place) return;
  try{ PU.posts = await Store.list(PU.cur.scope === 'all' ? null : ownerId(), PU.cur.place); }catch(_){ PU.posts = []; }
}
function idBox(){
  if(user) return '';
  if(demo()) return `<div class="pnote">${tr('p_demo')}<input type="text" id="pName" maxlength="30" placeholder="${h(tr('p_yourName'))}" value="${h(demoName())}"></div>`;
  return `<div class="pnote"><button class="btn" data-act="login" style="width:100%">${tr('p_login')}</button></div>`;
}
function render(){
  const box = $('pBox'); if(!box || !PU.cur) return;
  box.innerHTML = PU.view === 'compose' ? composeHTML() : listHTML();
}
function canEdit(p){
  const w = who();
  return (w && p.authorId === w.id) || (PU.cur && PU.cur.scope === 'owner' && mode === 'owner');
}
function listHTML(){
  const {place, scope} = PU.cur, n = PU.posts.length;
  const avg = n ? PU.posts.reduce((s, p) => s + (+p.rating || 0), 0) / n : 0;
  let html = `<div class="row"><h2>${h(nm(place))}</h2><button class="lnk" data-act="close">${tr('p_close')}</button></div>`;
  html += n ? `<div class="rsum">${stars(avg)}<b>${avgTxt(avg)}</b><small>${cntTxt(n)}</small></div>` : '';
  if(scope === 'owner') html += `<div class="tip" style="text-align:left;margin:0 0 10px">${tr('p_byOwner')}</div>`;
  if(mode === 'owner' && S.world.has(place)) html += `<button class="btn" data-act="new" style="width:100%">${tr('p_write')}</button>`;
  else if(mode === 'owner') html += `<div class="pnote">${tr('p_needVisit')}</div>`;
  else html += `<div class="pnote">${tr('p_viewerNote')} <a href="/app.html" style="color:var(--acc)">${tr('start')}</a></div>`;
  if(!n) html += `<p class="tip" style="margin:22px 0">${tr('p_none')}</p>`;
  else if(n > 1) html += `<select class="psel" id="pSort" style="margin-top:12px">${[['new','p_sortNew'],['high','p_sortHigh'],['low','p_sortLow']].map(([v,k]) => `<option value="${v}"${PU.sort === v ? ' selected' : ''}>${tr(k)}</option>`).join('')}</select>`;
  const list = PU.posts.slice();
  if(PU.sort === 'high') list.sort((a,b) => (b.rating||0) - (a.rating||0) || b.at.localeCompare(a.at));
  if(PU.sort === 'low') list.sort((a,b) => (a.rating||0) - (b.rating||0) || b.at.localeCompare(a.at));
  html += list.map(postHTML).join('');
  return html;
}
function postHTML(p){
  const open = PU.open.has(p.id), nc = p.comments.length, edit = canEdit(p);
  const imgs = (p.photos || []).map(s => `<img src="${s}" alt="" data-act="img">`).join('');
  const cls = p.photos && p.photos.length === 1 ? 'one' : p.photos && p.photos.length === 2 ? 'two' : '';
  return `<article class="post" data-id="${p.id}">
    <header><span><b>${h(p.authorName)}</b><small>${fmtDate(p.at)}${p.edited ? ' · ' + tr('p_edited') : ''}</small></span>
      ${edit ? `<span><button class="lnk" data-act="edit" data-id="${p.id}">${tr('p_edit')}</button> <button class="lnk" data-act="del" data-id="${p.id}">${tr('p_del')}</button></span>` : ''}</header>
    ${stars(p.rating || 0)}
    <p>${h(p.text)}</p>
    ${imgs ? `<div class="pimgs ${cls}">${imgs}</div>` : ''}
    <button class="lnk" data-act="cm" data-id="${p.id}">💬 ${dig(nc)} ${lang==='en' && nc===1 ? 'comment' : tr('p_comments')}</button>
    ${open ? cmHTML(p) : ''}
  </article>`;
}
function cmHTML(p){
  const me_ = who(), ownScope = PU.cur.scope === 'owner' && mode === 'owner';
  const list = p.comments.length ? p.comments.map(c => `<div class="cm"><b>${h(c.authorName)}</b><small>${fmtDate(c.at)}</small>
      ${ownScope || (me_ && (me_.id === c.authorId || me_.id === p.authorId)) ? `<button class="lnk" data-act="delcm" data-id="${c.id}">${tr('p_del')}</button>` : ''}<div>${h(c.text)}</div></div>`).join('')
    : `<div class="tip" style="text-align:left">${tr('p_noCm')}</div>`;
  const form = me_ || (!user && demo())
    ? `${me_ ? '' : idBox()}<div class="cmForm"><input type="text" id="cmIn-${p.id}" maxlength="300" placeholder="${h(tr('p_addCm'))}"><button class="btn" data-act="send" data-id="${p.id}">${tr('p_send')}</button></div>`
    : idBox();
  return `<div class="cmBox">${list}${form}${PU.err && PU.err.id === p.id ? `<div class="err">${h(PU.err.msg)}</div>` : ''}</div>`;
}
function composeHTML(){
  const c = PU.c, editing = !!c.id;
  const places = [...S.world].sort((a, b) => nm(a).localeCompare(nm(b)));
  const opts = places.map(k => `<option value="${h(k)}"${k === c.place ? ' selected' : ''}>${h(nm(k))}</option>`).join('');
  const th = c.photos.map((s, i) => `<div><img src="${s}" alt=""><button data-act="rmph" data-i="${i}" aria-label="Remove">✕</button></div>`).join('');
  const rate = [1,2,3,4,5].map(n => `<button data-act="star" data-n="${n}" class="${c.rating >= n ? 'on' : ''}" aria-label="${n}">★</button>`).join('');
  return `<div class="row"><h2>${tr(editing ? 'p_editTitle' : 'p_newTitle')}</h2><button class="lnk" data-act="cancel">${tr('p_cancel')}</button></div>
    ${places.length ? `<label style="color:var(--mut);font-size:14px">${tr('p_place')}</label>
    <select class="psel" id="pPlace"${editing ? ' disabled' : ''}>${opts}</select>
    <label style="color:var(--mut);font-size:14px">${tr('p_rate')}</label>
    <div class="rate" id="pRate">${rate}</div>
    <textarea class="pta" id="pText" maxlength="1500" placeholder="${h(tr('p_text'))}">${h(c.text)}</textarea>
    <div class="thumbs">${th}</div>
    ${c.photos.length < MAXPH ? `<button class="photo" data-act="addph" style="margin:0 0 12px">${tr('p_addPhotos')}</button>` : ''}
    ${idBox()}
    ${PU.err && PU.err.msg && !PU.err.id ? `<div class="err">${h(PU.err.msg)}</div>` : ''}
    <button class="btn" data-act="save" style="width:100%">${tr(editing ? 'p_update' : 'p_save')}</button>`
    : `<p class="tip" style="margin:22px 0">${tr('p_needPlace')}</p>`}`;
}

/* ---------- events ---------- */
function onInput(e){
  if(e.target.id === 'pName'){ try{ localStorage.setItem('tm_demo_name', e.target.value); }catch(_){} }
  if(e.target.id === 'pText' && PU.c) PU.c.text = e.target.value;
  if(e.target.id === 'pPlace' && PU.c) PU.c.place = e.target.value;
  if(e.target.id === 'pSort'){ PU.sort = e.target.value; render(); }
}
async function onClick(e){
  const s = $('pSheet');
  if(e.target === s){ closeSheet(); return; }
  const el = e.target.closest('[data-act]'); if(!el) return;
  const act = el.dataset.act, id = el.dataset.id;
  if(act === 'close') return closeSheet();
  if(act === 'login'){ const b = $('authBtn'); if(b) b.click(); return; }
  if(act === 'img'){ const lb = document.createElement('div'); lb.id = 'pLb'; lb.innerHTML = `<img src="${el.src}" alt="">`; lb.onclick = () => lb.remove(); document.body.appendChild(lb); return; }
  if(act === 'new') return startCompose(PU.cur.place);
  if(act === 'cancel'){ if(PU.cur && PU.cur.place){ PU.view = 'list'; await reload(); render(); } else closeSheet(); return; }
  if(act === 'edit'){ const p = PU.posts.find(x => x.id === id); if(p){ PU.c = {id:p.id, place:p.place, rating:p.rating || 0, text:p.text, photos:(p.photos || []).slice(), at:p.at}; PU.view = 'compose'; PU.err = ''; render(); } return; }
  if(act === 'del'){ if(!confirm(tr('p_confirmDel'))) return; await Store.removePost(id); await reload(); await refresh(); render(); return; }
  if(act === 'cm'){ PU.open.has(id) ? PU.open.delete(id) : PU.open.add(id); PU.err = ''; render(); return; }
  if(act === 'delcm'){ if(!confirm(tr('p_confirmDelCm'))) return; await Store.removeComment(id); await reload(); render(); return; }
  if(act === 'addph') return $('pFile').click();
  if(act === 'rmph'){ PU.c.photos.splice(+el.dataset.i, 1); render(); return; }
  if(act === 'star'){ PU.c.rating = +el.dataset.n; PU.err = ''; render(); return; }
  if(act === 'send') return sendComment(id);
  if(act === 'save') return savePost();
}
function startCompose(place){
  PU.c = {id:null, place: place || ([...S.world][0] || ''), rating:0, text:'', photos:[]};
  PU.view = 'compose'; PU.err = ''; sheet().classList.remove('hide');
  if(!PU.cur) PU.cur = {place:'', scope: isRV() ? 'all' : 'owner'};
  render();
}
async function sendComment(pid){
  const inp = $('cmIn-' + pid), text = inp ? inp.value.trim() : '';
  const w = who();
  if(!w){ PU.err = {id:pid, msg:tr('p_needName')}; render(); return; }
  if(!text) return;
  try{ await Store.addComment({id:uid(), post:pid, authorId:w.id, authorName:w.name, text, at:new Date().toISOString()}); PU.err = ''; }
  catch(_){ PU.err = {id:pid, msg:tr('p_failed')}; }
  await reload(); render();
}
async function savePost(){
  const c = PU.c, w = who(), text = (c.text || '').trim();
  if(!S.world.has(c.place)){ PU.err = {msg:tr('p_notVisited')}; render(); return; }   // only visited countries
  if(!w){ PU.err = {msg:tr('p_needName')}; render(); return; }
  if(!(c.rating >= 1 && c.rating <= 5)){ PU.err = {msg:tr('p_needRating')}; render(); return; }
  if(!text){ PU.err = {msg:tr('p_emptyText')}; render(); return; }
  const old = c.id ? PU.posts.find(x => x.id === c.id) : null;
  const p = old ? Object.assign({}, old, {text, rating:c.rating, photos:c.photos, edited:true}) :
    {id:uid(), owner:ownerId(), kind:'world', place:c.place, rating:c.rating, text, photos:c.photos, authorId:w.id, authorName:w.name, at:new Date().toISOString()};
  delete p.comments;
  try{ await Store.savePost(p, !old); }catch(e){ PU.err = {msg:tr(e && /quota|size|exceed|large|payload/i.test(e.message || '') ? 'p_full' : 'p_failed')}; render(); return; }
  PU.cur = {place:c.place, scope: PU.cur && PU.cur.scope ? PU.cur.scope : (isRV() ? 'all' : 'owner')}; PU.view = 'list'; PU.err = '';
  await reload(); await refresh(); render();
}
function onFiles(e){
  const files = [...e.target.files].slice(0, MAXPH - PU.c.photos.length); e.target.value = '';
  Promise.all(files.map(shrink)).then(arr => { arr.filter(Boolean).forEach(s => PU.c.photos.push(s)); PU.c.photos = PU.c.photos.slice(0, MAXPH); render(); });
}
function shrink(f){
  return new Promise(res => {
    const r = new FileReader();
    r.onerror = () => res(null);
    r.onload = () => { const img = new Image(); img.onerror = () => res(null); img.onload = () => {
      const m = 900, k = Math.min(1, m / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .65));
    }; img.src = r.result; };
    r.readAsDataURL(f);
  });
}

/* ---------- wire up ---------- */
function bind(){
  const sw = $('interSwitch'); if(sw) sw.onclick = e => { const b = e.target.closest('button'); if(b) setM(b.dataset.m); };
  const nb = $('newPost'); if(nb) nb.onclick = () => { sheet(); PU.cur = null; startCompose(''); };
}
window.PostsUI = {active, tap, decorate, globeMarks, refresh, sync, tipText, bind, openReview, reviewed, avg:avgOf};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();