/* Extracted from the app by extract_calc_app.py. Do not edit here; edit index.html and re-extract. */
const NS = 'http://www.w3.org/2000/svg';
function $(s, r){ return (r||document).querySelector(s); }
function $$(s, r){ return [].slice.call((r||document).querySelectorAll(s)); }
function el(tag, cls, txt){ const n=document.createElement(tag); if(cls) n.className=cls;
  if(txt!=null) n.textContent=txt; return n; }
function svgEl(tag, attrs){ const n=document.createElementNS(NS,tag);
  for(const k in attrs) n.setAttribute(k, attrs[k]); return n; }

/* ══════════════════════════════════════════════════════════════════
   DATAGRID — a small spreadsheet for the calculator inputs.

   The tools used to take a textarea and parse it. That works, but it
   asks somebody to know the format before they can type anything. A
   grid shows the shape instead.

   The parsers underneath are unchanged: every grid serialises back to
   exactly the text the tool already knew how to read, so the maths is
   untouched and a tool can be reverted by deleting one line.

   Features that matter in practice:
     · arrow keys, Tab and Enter move between cells
     · a paste from Excel fills the block from that cell, growing rows
     · a paste of one column into one cell fills down
     · rows are added and removed, with a minimum kept
     · non-numeric entries in numeric columns turn red in place
   ══════════════════════════════════════════════════════════════════ */

function DataGrid(cfg){
  /* cfg = {
       mount:   selector for the container
       cols:    [{key,label,type:'text'|'num',width}]
       rows:    starting row count
       minRows: never go below
       rowLabel: (i)=>string, optional left-hand label
       onChange: called after every edit
     } */
  const host = document.querySelector(cfg.mount);
  if(!host) return null;

  const G = {
    cols: cfg.cols,
    data: [],
    rows: cfg.rows || 10,
    minRows: cfg.minRows || 3
  };
  const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;};

  function blankRow(){ return G.cols.map(()=> ''); }
  function ensure(n){ while(G.data.length < n) G.data.push(blankRow()); }
  ensure(G.rows);

  /* ── the value the tool's own parser expects ── */
  function toText(){
    return G.data
      .filter(r => r.some(v => String(v).trim() !== ''))
      .map(r => r.map(v => String(v).trim()).join('\t'))
      .join('\n');
  }
  /* a flat list, for the tools that want one long stream of numbers */
  function toFlat(){
    const out = [];
    G.data.forEach(r => r.forEach(v => {
      const s = String(v).trim();
      if(s !== '') out.push(s);
    }));
    return out.join(' ');
  }

  /* Which separator is right depends on what the columns hold. A grid of
     numbers can split on any whitespace. A grid with a category or a step
     name in it cannot, or "Scratched paint" becomes two cells. Each grid
     declares its own; the fallback is the cautious one. */
  const SEP = cfg.sep || /[,;\t]+|\s{2,}/;
  function setText(text, sep){
    const lines = String(text).trim().split(/\n+/).filter(l => l.trim());
    G.data = [];
    lines.forEach(l => {
      const parts = l.split(sep || SEP).map(s => s.trim());
      const row = blankRow();
      parts.forEach((p,i) => { if(i < G.cols.length) row[i] = p; });
      G.data.push(row);
    });
    while(G.data.length < G.minRows) G.data.push(blankRow());
    draw();
  }
  /* for tools whose data is one long list of numbers */
  function setFlat(values){
    const per = G.cols.length;
    G.data = [];
    for(let i=0;i<values.length;i+=per){
      const row = blankRow();
      for(let j=0;j<per;j++) if(i+j < values.length) row[j] = values[i+j];
      G.data.push(row);
    }
    while(G.data.length < G.minRows) G.data.push(blankRow());
    draw();
  }
  function clear(){
    G.data = [];
    ensure(G.minRows);
    draw();
    if(cfg.onChange) cfg.onChange();
  }

  function focusCell(r,c){
    const n = host.querySelector('input[data-r="'+r+'"][data-c="'+c+'"]');
    if(n){ n.focus(); n.select(); }
  }

  function onKey(e, r, c){
    const k = e.key;
    if(k === 'ArrowRight' || (k === 'Tab' && !e.shiftKey)){
      if(c < G.cols.length-1){ e.preventDefault(); focusCell(r,c+1); }
      else if(r < G.data.length-1){ e.preventDefault(); focusCell(r+1,0); }
      return;
    }
    if(k === 'ArrowLeft' || (k === 'Tab' && e.shiftKey)){
      if(c > 0){ e.preventDefault(); focusCell(r,c-1); }
      else if(r > 0){ e.preventDefault(); focusCell(r-1,G.cols.length-1); }
      return;
    }
    if(k === 'ArrowDown' || k === 'Enter'){
      e.preventDefault();
      if(r === G.data.length-1){ G.data.push(blankRow()); draw(); }
      focusCell(r+1,c);
      return;
    }
    if(k === 'ArrowUp'){ if(r > 0){ e.preventDefault(); focusCell(r-1,c); } }
  }

  /* an Excel paste is tab separated across and newline down */
  function onPaste(e, r, c){
    const txt = (e.clipboardData || window.clipboardData).getData('text');
    if(!txt) return;
    if(!/[\t\n]/.test(txt)) return;          // a single value, let the browser do it
    e.preventDefault();
    const lines = txt.replace(/\r/g,'').split('\n').filter((l,i,a)=> l !== '' || i < a.length-1);
    lines.forEach((line,i) => {
      const cells = line.split('\t');
      const rr = r + i;
      while(G.data.length <= rr) G.data.push(blankRow());
      cells.forEach((v,j) => { if(c+j < G.cols.length) G.data[rr][c+j] = v.trim(); });
    });
    draw();
    if(cfg.onChange) cfg.onChange();
  }

  function draw(){
    host.innerHTML = '';
    const bar = el('div','dg-bar');
    const add = el('button','dg-btn','+ row');       add.type='button';
    const add5= el('button','dg-btn','+ 5 rows');    add5.type='button';
    const clr = el('button','dg-btn ghost','Clear'); clr.type='button';
    add.onclick =()=>{ G.data.push(blankRow()); draw(); };
    add5.onclick=()=>{ for(let i=0;i<5;i++) G.data.push(blankRow()); draw(); };
    clr.onclick = clear;
    bar.appendChild(add); bar.appendChild(add5); bar.appendChild(clr);
    const hint = el('span','dg-hint','Paste straight from a spreadsheet');
    bar.appendChild(hint);
    host.appendChild(bar);

    const scroll = el('div','dg-scroll');
    const t = el('table','dg');
    const head = el('tr');
    head.appendChild(el('th','dg-rh',''));
    G.cols.forEach(col=>{
      const th = el('th','', col.label);
      if(col.width) th.style.width = col.width;
      head.appendChild(th);
    });
    head.appendChild(el('th','dg-x',''));
    t.appendChild(head);

    G.data.forEach((row,r)=>{
      const tr = el('tr');
      tr.appendChild(el('td','dg-rh', cfg.rowLabel ? cfg.rowLabel(r) : String(r+1)));
      G.cols.forEach((col,c)=>{
        const td = el('td');
        const inp = el('input');
        inp.value = row[c] == null ? '' : row[c];
        inp.dataset.r = r; inp.dataset.c = c;
        if(col.type === 'num'){ inp.inputMode = 'decimal'; inp.classList.add('num'); }
        if(col.placeholder && r === 0) inp.placeholder = col.placeholder;
        inp.addEventListener('input', ()=>{
          G.data[r][c] = inp.value;
          if(col.type === 'num'){
            const s = inp.value.trim();
            inp.classList.toggle('bad', s !== '' && !isFinite(Number(s.replace(/,/g,''))));
          }
          if(cfg.onChange) cfg.onChange();
        });
        inp.addEventListener('keydown', e=>onKey(e,r,c));
        inp.addEventListener('paste',  e=>onPaste(e,r,c));
        td.appendChild(inp);
        tr.appendChild(td);
      });
      const x = el('td','dg-x');
      if(G.data.length > G.minRows){
        const b = el('button','dg-del','\u00d7'); b.type='button'; b.title='Remove this row';
        b.onclick=()=>{ G.data.splice(r,1); draw(); if(cfg.onChange) cfg.onChange(); };
        x.appendChild(b);
      }
      tr.appendChild(x);
      t.appendChild(tr);
    });
    scroll.appendChild(t);
    host.appendChild(scroll);
  }

  draw();
  return {toText, toFlat, setText, setFlat, clear, draw, data:()=>G.data};
}


/* ══════════════════════════════════════════════════════════════════
   The five grids, one per tool.

   Each exposes the same value the old textarea did, under the same
   id, so the tools' own parsers are untouched. A shim object stands
   in for the element: $('#capData').value still returns a string.
   ══════════════════════════════════════════════════════════════════ */
const GRIDS = {};

function gridShim(id, grid, mode){
  /* the tools read $('#id').value — give them something that answers */
  GRIDS[id] = {
    grid: grid,
    get value(){ return mode === 'flat' ? grid.toFlat() : grid.toText(); },
    set value(v){ mode === 'flat'
        ? grid.setFlat(String(v).split(/[\s,;]+/).filter(s=>s!==''))
        : grid.setText(v); }
  };
}

/* Each tool recalculates on its Run button. Editing a cell presses it,
   but only once the tool has already been run, so the page does not
   throw a verdict at somebody halfway through typing their first row. */
const RUN_BTN = {capability:'#capRun', spc:'#spcRun', grr:'#grrRun',
                 pareto:'#parRun', yield:'#yRun', linearity:'#linRun'};
let _gridTimer = null;
function recalcTool(which){
  const sel = RUN_BTN[which]; if(!sel) return;
  const btn = document.querySelector(sel); if(!btn) return;
  if(!btn.dataset.ran) return;                 // not run yet, stay quiet
  clearTimeout(_gridTimer);
  _gridTimer = setTimeout(()=>btn.click(), 180);
}

function initGrids(recalc){
  recalc = recalc || recalcTool;
  /* mark a tool as run the first time its button is pressed */
  Object.values(RUN_BTN).forEach(sel=>{
    const b = document.querySelector(sel);
    if(b && !b.dataset.wired){
      b.dataset.wired = '1';
      b.addEventListener('click', ()=>{ b.dataset.ran = '1'; });
    }
  });

  /* ── capability: one long stream of measurements, five to a row ── */
  if(document.querySelector('#capGrid') && !GRIDS.capData){
    const g = DataGrid({
      mount:'#capGrid', rows:5, minRows:3, sep:/[,;\s]+/,
      cols:[{label:'1',type:'num'},{label:'2',type:'num'},{label:'3',type:'num'},
            {label:'4',type:'num'},{label:'5',type:'num'}],
      rowLabel:i=>String(i*5+1)+'\u2013'+String(i*5+5),
      onChange:()=>recalc('capability')
    });
    gridShim('capData', g, 'flat');
  }
  /* ── control chart: one subgroup per row ── */
  if(document.querySelector('#spcGrid') && !GRIDS.spcData){
    const g = DataGrid({
      mount:'#spcGrid', rows:8, minRows:4, sep:/[,;\s]+/,
      cols:[{label:'READING 1',type:'num'},{label:'READING 2',type:'num'},
            {label:'READING 3',type:'num'},{label:'READING 4',type:'num'},
            {label:'READING 5',type:'num'}],
      rowLabel:i=>'SUBGROUP '+(i+1),
      onChange:()=>recalc('spc')
    });
    gridShim('spcData', g, 'rows');
  }
  /* ── gauge R&R: appraiser, part, then the trials ── */
  if(document.querySelector('#grrGrid') && !GRIDS.grrData){
    const g = DataGrid({
      mount:'#grrGrid', rows:9, minRows:6, sep:/[,;\s]+/,
      cols:[{label:'APPRAISER',type:'text',placeholder:'A'},
            {label:'PART',type:'text',placeholder:'1'},
            {label:'TRIAL 1',type:'num'},{label:'TRIAL 2',type:'num'},
            {label:'TRIAL 3',type:'num'}],
      onChange:()=>recalc('grr')
    });
    gridShim('grrData', g, 'rows');
  }
  /* ── pareto: category and count ── */
  if(document.querySelector('#parGrid') && !GRIDS.parData){
    const g = DataGrid({
      mount:'#parGrid', rows:6, minRows:3,
      cols:[{label:'CATEGORY',type:'text',placeholder:'Scratched',width:'62%'},
            {label:'COUNT',type:'num',placeholder:'120'}],
      onChange:()=>recalc('pareto')
    });
    gridShim('parData', g, 'rows');
  }
  /* ── linearity: one row per reference, readings across ── */
  if(document.querySelector('#linGrid') && !GRIDS.linGrid){
    const cols=[{label:'BLOCK ID',type:'text',placeholder:'TB-25',width:'12%'},
                {label:'CERTIFIED',type:'num',placeholder:'25.3'},
                {label:'LSL',type:'num',placeholder:'22'},
                {label:'USL',type:'num',placeholder:'28'}];
    for(let i=1;i<=10;i++) cols.push({label:'R'+i,type:'num'});
    const g = DataGrid({
      mount:'#linGrid', rows:5, minRows:2, cols:cols, sep:/[,;\t]+|\s{2,}/,
      rowLabel:i=>'REF '+(i+1),
      onChange:()=>recalc('linearity')
    });
    GRIDS.linGrid = {grid:g,
      get value(){ return g.toText(); },
      set value(v){ g.setText(v); }};
  }
  /* ── rolled yield: step, units in, defects ── */
  if(document.querySelector('#yGrid') && !GRIDS.yStepData){
    const g = DataGrid({
      mount:'#yGrid', rows:5, minRows:2,
      cols:[{label:'STEP',type:'text',placeholder:'Machining',width:'50%'},
            {label:'UNITS IN',type:'num',placeholder:'500'},
            {label:'DEFECTS',type:'num',placeholder:'12'}],
      onChange:()=>recalc('yield')
    });
    gridShim('yStepData', g, 'rows');
  }
}

/* Quality toolkit. Everything here is computed from first principles in the browser.
   No data leaves the page. No table is transcribed from any published source. */

/* ── math core ────────────────────────────── */
function erf(x){
  const s = x<0 ? -1 : 1; x = Math.abs(x);
  const a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911;
  const t = 1/(1+p*x);
  return s*(1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));
}
const PHI = z => .5*(1+erf(z/Math.SQRT2));
const phi = z => Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
function invPHI(p){ // bisection, plenty accurate for display
  let lo=-9, hi=9;
  for(let i=0;i<80;i++){ const m=(lo+hi)/2; if(PHI(m)<p) lo=m; else hi=m; }
  return (lo+hi)/2;
}
const mean = a => a.reduce((s,x)=>s+x,0)/a.length;
function sd(a){ if(a.length<2) return 0; const m=mean(a);
  return Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/(a.length-1)); }
function fmt(v,d){ if(!isFinite(v)) return '—';
  return v.toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d}); }
/* The five data grids stand in for the textareas they replaced.
   $g('#capData') returns the shim when a grid owns that id, and the
   element otherwise, so every parser below is unchanged. */
function $g(sel){
  const id = sel.charAt(0) === '#' ? sel.slice(1) : sel;
  if(typeof GRIDS !== 'undefined' && GRIDS[id]) return GRIDS[id];
  return document.querySelector(sel);
}

function parseNums(t){
  return String(t).split(/[\s,;]+/).map(x=>parseFloat(x)).filter(x=>isFinite(x));
}
function parseRows(t){
  return String(t).trim().split(/\n+/).map(r=>parseNums(r)).filter(r=>r.length);
}

/* ── control chart constants, computed ────── */
const _cc = {};
function ccConst(n){
  if(_cc[n]) return _cc[n];
  const FW = w => { // P(range <= w) for n standard normals
    const lo=-6, hi=6, steps=420, h=(hi-lo)/steps; let s=0;
    for(let i=0;i<=steps;i++){
      const x=lo+i*h;
      s += phi(x)*Math.pow(PHI(x+w)-PHI(x), n-1) * (i===0||i===steps ? .5 : 1);
    }
    return n*s*h;
  };
  const wmax=10, steps=600, h=wmax/steps;
  let d2=0, e2=0;
  for(let i=0;i<=steps;i++){
    const w=i*h, S=1-FW(w), wt=(i===0||i===steps ? .5 : 1);
    d2 += S*wt; e2 += 2*w*S*wt;
  }
  d2*=h; e2*=h;
  const d3 = Math.sqrt(Math.max(e2-d2*d2,0));
  const o = { n:n, d2:d2, d3:d3, A2:3/(d2*Math.sqrt(n)),
              D3:Math.max(0,1-3*d3/d2), D4:1+3*d3/d2 };
  _cc[n]=o; return o;
}

/* ── plotting helpers ─────────────────────── */
function plot(host, W, H){
  const s = document.createElementNS(NS,'svg');
  s.setAttribute('viewBox','0 0 '+W+' '+H);
  host.innerHTML=''; host.appendChild(s); return s;
}
function pAdd(s,tag,attrs,text){
  const n=document.createElementNS(NS,tag);
  for(const k in attrs) n.setAttribute(k,attrs[k]);
  if(text!=null) n.textContent=text;
  s.appendChild(n); return n;
}

/* ══════════════ 1. SIGMA CONVERTER ══════════════ */
function toolSigma(){
  const sl = $('#sigRange'); if(!sl) return;
  const NOTES = [
    [1,'A one sigma process fails more often than it succeeds. That is not a process, it is a lottery.'],
    [2,'Roughly three defects in every ten. Inspection is doing all the work, and inspection is about 80 percent effective.'],
    [3,'About one part in fifteen escapes. Most organizations believe they are better than this and have never measured it.'],
    [4,'Where competent, well-run operations sit — and where 6,210 parts per million still get out.'],
    [5,'Costs real money to hold. Below 250 defects per million the effort curve turns steeply upward.'],
    [6,'3.4 defects per million opportunities. The number the method is named for, and the reason the 1.5 shift exists.']
  ];
  function draw(sigma){
    const s = plot($('#sigPlot'), 620, 320);
    const base=270, top=30, cx=310, px=42;
    pAdd(s,'line',{x1:12,y1:base,x2:608,y2:base,class:'ax'});
    const pts=[]; const zmax=(300)/px;
    for(let z=-zmax; z<=zmax; z+=.05) pts.push([cx+z*px, base-phi(z)/phi(0)*(base-top)]);
    const d='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L');
    pAdd(s,'path',{d:d+'L'+pts[pts.length-1][0]+','+base+'L'+pts[0][0]+','+base+'Z',class:'curve-fill'});
    [[cx+sigma*px,'USL',1],[cx-sigma*px,'LSL',-1]].forEach(([xs,lab,dir])=>{
      const tail=pts.filter(p=> dir>0 ? p[0]>=xs : p[0]<=xs);
      if(tail.length>1){
        const td='M'+tail.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L')
          +'L'+tail[tail.length-1][0]+','+base+'L'+tail[0][0]+','+base+'Z';
        pAdd(s,'path',{d:td,class:'tail'});
      }
      pAdd(s,'line',{x1:xs,y1:top-12,x2:xs,y2:base,class:'spec'});
      pAdd(s,'text',{x:xs,y:top-18,class:'lab-t sig','text-anchor':'middle'},lab);
    });
    pAdd(s,'path',{d:d,class:'curve-line'});
    pAdd(s,'text',{x:cx,y:base+22,class:'lab-t','text-anchor':'middle'},
      '\u00B1'+sigma.toFixed(1)+'\u03C3 BETWEEN THE MEAN AND EACH LIMIT');
  }
  function update(){
    const sigma = +sl.value/10;
    const dpmo = (1-PHI(sigma-1.5))*1e6;
    $('#sigLevel').textContent = sigma.toFixed(1)+'\u03C3';
    $('#sigDpmo').textContent  = dpmo>=100 ? Math.round(dpmo).toLocaleString() : dpmo.toFixed(1);
    $('#sigYield').textContent = (100-dpmo/1e4).toFixed(dpmo<1000?4:2)+'%';
    let best=NOTES[0];
    NOTES.forEach(n=>{ if(n[0]<=sigma+1e-9) best=n; });
    $('#sigNote').textContent = best[1];
    draw(sigma);
  }
  sl.addEventListener('input',update); update();
}

/* ══════════════ 2. PROCESS CAPABILITY ══════════════ */
function toolCapability(){
  const btn = $('#capRun'); if(!btn) return;
  function run(){
    const data = parseNums($g('#capData').value);
    const usl = parseFloat($('#capUSL').value);
    const lsl = parseFloat($('#capLSL').value);
    const nsub = Math.max(1, parseInt($('#capSub').value,10)||1);
    const out = $('#capOut'), vd = $('#capVerdict');
    if(data.length < 5 || !isFinite(usl) || !isFinite(lsl) || usl<=lsl){
      vd.className='verdict bad';
      vd.textContent = 'Needs at least five readings and an upper limit above the lower limit.';
      out.hidden = true; return;
    }
    out.hidden = false;
    const m = mean(data), sOverall = sd(data);

    // within-subgroup sigma from the average range, when subgroups are declared
    let sWithin = sOverall, basis = 'overall standard deviation (no subgroups declared) — Cp/Cpk equal Pp/Ppk here; for individuals use MR\u0304/d\u2082 for within-subgroup sigma';
    if(nsub > 1 && data.length >= nsub*2){
      const groups=[]; for(let i=0;i+nsub<=data.length;i+=nsub) groups.push(data.slice(i,i+nsub));
      const rbar = mean(groups.map(g=>Math.max.apply(null,g)-Math.min.apply(null,g)));
      const k = ccConst(nsub);
      if(rbar>0){ sWithin = rbar/k.d2; basis = 'R\u0304 \u00F7 d\u2082 over '+groups.length+' subgroups of '+nsub; }
    }
    const Cp  = (usl-lsl)/(6*sWithin);
    const Cpk = Math.min((usl-m)/(3*sWithin), (m-lsl)/(3*sWithin));
    const Pp  = (usl-lsl)/(6*sOverall);
    const Ppk = Math.min((usl-m)/(3*sOverall), (m-lsl)/(3*sOverall));
    const ppmU = (1-PHI((usl-m)/sOverall))*1e6, ppmL = PHI((lsl-m)/sOverall)*1e6;
    const ppm = ppmU+ppmL;
    const zBench = ppm>0 ? invPHI(1-ppm/1e6) : 6;
    const sigmaLvl = zBench + 1.5;

    const set = (id,v,cls)=>{ const e=$(id); e.textContent=v;
      e.parentElement.className='ro'+(cls?' '+cls:''); };
    const band = v => v>=1.33 ? 'good' : v>=1.0 ? 'warn' : 'bad';
    set('#capCp', fmt(Cp,2), band(Cp));
    set('#capCpk', fmt(Cpk,2), band(Cpk));
    set('#capPp', fmt(Pp,2), band(Pp));
    set('#capPpk', fmt(Ppk,2), band(Ppk));
    set('#capPpm', ppm>=1 ? Math.round(ppm).toLocaleString() : ppm.toFixed(2), band(Cpk));
    set('#capSig', fmt(Math.min(sigmaLvl,6.5),2)+'\u03C3', band(Cpk));
    $('#capStats').textContent =
      'n = '+data.length+'   mean = '+fmt(m,5)+'   overall sd = '+fmt(sOverall,5)+
      '   within sd = '+fmt(sWithin,5)+'   basis: '+basis;

    const gap = Cp - Cpk;
    if(Cpk < 1.0 && gap > 0.25){
      vd.className='verdict warn';
      vd.textContent = 'The spread is not the main problem — the aim is. Cp of '+fmt(Cp,2)+
        ' says the specification is wide enough for this variation, while Cpk of '+fmt(Cpk,2)+
        ' says the process is off center. Centering is usually the cheaper fix, and it is where to start.';
    } else if(Cpk < 1.0){
      vd.className='verdict bad';
      vd.textContent = 'Not capable. Both the spread and the position are working against you: Cp of '+
        fmt(Cp,2)+(Cp<1 ? ' means the variation alone will not fit inside the specification, so centering will not rescue it. ' : ' leaves little room even when centered, so centering alone will not get Cpk to 1.33. ')+
        'Variation reduction is the only route.';
    } else if(Cpk < 1.33){
      vd.className='verdict warn';
      vd.textContent = 'Marginal. Cpk of '+fmt(Cpk,2)+' clears 1.0 but leaves no room for the drift every process has. '+
        'Most customers ask for 1.33 for exactly this reason.'+
        (gap > 0.3 ? ' And the gap to Cp of '+fmt(Cp,2)+' says the shortfall is position, not spread \u2014 this process is off center, and centering it is almost always cheaper than reducing variation.' : '');
    } else {
      vd.className='verdict good';
      vd.textContent = 'Capable on these data. Cpk of '+fmt(Cpk,2)+
        ' carries margin for ordinary drift. Note that capability means nothing unless the process is first stable — check the control chart before quoting this number.';
    }
    if(Math.abs(Pp-Cp) > 0.15*Cp && nsub>1){
      vd.textContent += ' The gap between Cp ('+fmt(Cp,2)+') and Pp ('+fmt(Pp,2)+
        ') means there is drift between subgroups that the within-subgroup estimate does not see.';
    }
    drawCap(data, m, sOverall, usl, lsl);
  }
  function drawCap(data, m, s, usl, lsl){
    const svg = plot($('#capPlot'), 620, 300);
    const base=250, top=26, L=40, R=600;
    const lo = Math.min(lsl, Math.min.apply(null,data)) - s;
    const hi = Math.max(usl, Math.max.apply(null,data)) + s;
    const X = v => L + (v-lo)/(hi-lo)*(R-L);
    // Scott's rule on the data, applied across the plotted range (which spans the specs)
    const bwScott = 3.49*s/Math.cbrt(data.length);
    const bins = Math.max(10, Math.min(40, Math.ceil((hi-lo)/(bwScott||1))));
    const bw = (hi-lo)/bins, counts = new Array(bins).fill(0);
    data.forEach(v=>{ let i=Math.floor((v-lo)/bw); if(i>=bins) i=bins-1; if(i<0) i=0; counts[i]++; });
    const cmax = Math.max.apply(null,counts) || 1;
    counts.forEach((c,i)=>{
      if(!c) return;
      const x0=X(lo+i*bw), x1=X(lo+(i+1)*bw), h=(c/cmax)*(base-top-14);
      const mid = lo+(i+.5)*bw;
      pAdd(svg,'rect',{x:x0+1,y:base-h,width:Math.max(1,x1-x0-2),height:h,
        class:'bar'+((mid>usl||mid<lsl)?' hi':''),opacity:.85});
    });
    // fitted normal
    const pts=[];
    for(let v=lo; v<=hi; v+=(hi-lo)/240) pts.push([X(v), base-phi((v-m)/s)/phi(0)*(base-top-14)]);
    pAdd(svg,'path',{d:'M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L'),class:'curve-line'});
    pAdd(svg,'line',{x1:L,y1:base,x2:R,y2:base,class:'ax'});
    [[usl,'USL'],[lsl,'LSL']].forEach(([v,lab])=>{
      pAdd(svg,'line',{x1:X(v),y1:top-8,x2:X(v),y2:base,class:'spec'});
      pAdd(svg,'text',{x:X(v),y:top-14,class:'lab-t sig','text-anchor':'middle'},lab);
    });
    pAdd(svg,'line',{x1:X(m),y1:top,x2:X(m),y2:base,stroke:'#9C7C1F','stroke-width':1.4,'stroke-dasharray':'3 3'});
    pAdd(svg,'text',{x:X(m),y:base+20,class:'lab-t','text-anchor':'middle'},'x\u0304');
    pAdd(svg,'text',{x:L,y:base+20,class:'lab-t'},fmt(lo,3));
    pAdd(svg,'text',{x:R,y:base+20,class:'lab-t','text-anchor':'end'},fmt(hi,3));
  }
  btn.addEventListener('click',run);
  const demo = $('#capDemo');
  if(demo) demo.addEventListener('click',()=>{
    // simulated, seeded, slightly off center — the classic Cp-good / Cpk-poor picture
    let seed=7; const rnd=()=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; };
    const v=[]; for(let i=0;i<80;i++){
      const z=Math.sqrt(-2*Math.log(rnd()||1e-9))*Math.cos(2*Math.PI*rnd());
      v.push((2.0040+0.0018*z).toFixed(4));
    }
    $g('#capData').value=v.join(' '); $('#capUSL').value='2.010'; $('#capLSL').value='1.990';
    $('#capSub').value='4'; run();
  });
  $('#capDemo').click();   // arrive with a worked example loaded
}

/* ══════════════ 3. CONTROL CHART BUILDER ══════════════ */
function toolSPC(){
  const btn=$('#spcRun'); if(!btn) return;
  function run(){
    const rows = parseRows($g('#spcData').value);
    const vd = $('#spcVerdict'), out = $('#spcOut');
    if(rows.length < 6){
      vd.className='verdict bad';
      vd.textContent='Needs at least six subgroups, one per line. Two to five readings on each line.';
      out.hidden=true; return;
    }
    const n = rows[0].length;
    if(rows.some(r=>r.length!==n)){
      vd.className='verdict bad';
      vd.textContent='Every line must have the same number of readings. Line lengths found: '+
        Array.from(new Set(rows.map(r=>r.length))).join(', ')+'.';
      out.hidden=true; return;
    }
    out.hidden=false;
    const useIndiv = (n===1);
    let xs, rs, k, label;
    if(useIndiv){
      xs = rows.map(r=>r[0]);
      rs = xs.slice(1).map((v,i)=>Math.abs(v-xs[i]));
      k  = ccConst(2); label='Individuals and moving range';
    } else {
      xs = rows.map(r=>mean(r));
      rs = rows.map(r=>Math.max.apply(null,r)-Math.min.apply(null,r));
      k  = ccConst(n); label='X\u0304 and R, subgroups of '+n;
    }
    const xbar = mean(xs), rbar = mean(rs);
    const A2 = useIndiv ? 3/ccConst(2).d2 : k.A2;
    const UCLx = xbar + A2*rbar, LCLx = xbar - A2*rbar;
    const UCLr = k.D4*rbar, LCLr = k.D3*rbar;
    const sigHat = rbar/k.d2;

    // Nelson rules on the means/individuals chart
    const s1=(UCLx-xbar)/3;
    const flags = xs.map(()=>[]);
    xs.forEach((v,i)=>{ if(v>UCLx||v<LCLx) flags[i].push(1); });
    for(let i=8;i<=xs.length;i++){
      const w=xs.slice(i-8,i);
      if(w.every(v=>v>xbar)||w.every(v=>v<xbar)) flags[i-1].push(2);
    }
    for(let i=6;i<=xs.length;i++){
      const w=xs.slice(i-6,i); let up=true,dn=true;
      for(let j=1;j<6;j++){ if(w[j]<=w[j-1]) up=false; if(w[j]>=w[j-1]) dn=false; }
      if(up||dn) flags[i-1].push(3);
    }
    for(let i=3;i<=xs.length;i++){
      const w=xs.slice(i-3,i);
      if(w.filter(v=>v>xbar+2*s1).length>=2 || w.filter(v=>v<xbar-2*s1).length>=2) flags[i-1].push(5);
    }
    for(let i=5;i<=xs.length;i++){
      const w=xs.slice(i-5,i);
      if(w.filter(v=>v>xbar+s1).length>=4 || w.filter(v=>v<xbar-s1).length>=4) flags[i-1].push(6);
    }
    const rFlag = rs.map(v=>v>UCLr||v<LCLr);
    const nFlagged = flags.filter(f=>f.length).length;
    const nR = rFlag.filter(Boolean).length;

    $('#spcBasis').textContent = label + '   \u2014   constants computed for n = ' + (useIndiv?2:n) +
      ':  d\u2082 = '+fmt(k.d2,4)+',  A\u2082 = '+fmt(A2,4)+',  D\u2083 = '+fmt(k.D3,4)+',  D\u2084 = '+fmt(k.D4,4);
    const set=(id,v)=>{ $(id).textContent=v; };
    set('#spcXbar',fmt(xbar,4)); set('#spcUCL',fmt(UCLx,4)); set('#spcLCL',fmt(LCLx,4));
    set('#spcRbar',fmt(rbar,4)); set('#spcUCLR',fmt(UCLr,4)); set('#spcLCLR',fmt(LCLr,4));
    set('#spcSig',fmt(sigHat,5)); set('#spcFlags',nFlagged+nR);
    set('#spcSub', useIndiv ? String(xs.length) : String(rows.length)+' \u00d7 '+n);
    set('#spcSubK', useIndiv ? 'READINGS' : 'SUBGROUPS');
    /* say which chart each block belongs to — "UCL" on its own is ambiguous
       when there are two charts, and the range limits were not shown at all */
    set('#spcLblX', useIndiv ? 'THE INDIVIDUALS CHART' : 'THE MEANS CHART');
    set('#spcLblR', useIndiv ? 'THE MOVING RANGE CHART' : 'THE RANGE CHART');

    if(nR){
      vd.className='verdict bad';
      vd.textContent = nR+' point'+(nR>1?'s':'')+' out of control on the range chart. Read the range chart first: '+
        'while the spread is unstable, the average range is not a valid estimate of variation, so the limits on the '+
        (useIndiv?'individuals':'means')+' chart are not trustworthy. Resolve the range signals before interpreting anything above.';
    } else if(nFlagged){
      vd.className='verdict warn';
      vd.textContent = 'Range chart is stable, so the limits above can be relied on. '+nFlagged+' point'+
        (nFlagged>1?'s carry':' carries')+' a signal on the '+(useIndiv?'individuals':'means')+
        ' chart. A signal is not a verdict — it is an instruction to go and find out what was different.';
    } else {
      vd.className='verdict good';
      vd.textContent = 'No signals on either chart. The process is behaving predictably, which means the variation you see is the variation the system produces. '+
        'Adjusting it in response to individual points would be tampering. Estimated \u03C3 from R\u0304 \u00F7 d\u2082 is '+fmt(sigHat,5)+'.';
    }
    drawChart('#spcPlotX', xs, xbar, UCLx, LCLx, flags.map(f=>f.length>0), (useIndiv?'INDIVIDUALS':'SUBGROUP MEAN'));
    drawChart('#spcPlotR', rs, rbar, UCLr, LCLr, rFlag, (useIndiv?'MOVING RANGE':'RANGE'));
    const tb=$('#spcRules'); tb.innerHTML='';
    const NAMES={1:'Beyond a control limit',2:'Eight in a row on one side of the center line',
                 3:'Six in a row steadily increasing or decreasing',
                 5:'Two of three beyond 2 sigma on the same side',
                 6:'Four of five beyond 1 sigma on the same side'};
    let any=false;
    flags.forEach((f,i)=>{ if(!f.length) return; any=true;
      const tr=el('tr','flag');
      tr.appendChild(el('td',null,String(i+1)));
      tr.appendChild(el('td','n',fmt(xs[i],4)));
      tr.appendChild(el('td',null,f.map(r=>'Rule '+r+' \u2014 '+NAMES[r]).join('; ')));
      tb.appendChild(tr);
    });
    rFlag.forEach((f,i)=>{ if(!f) return; any=true;
      const tr=el('tr','flag');
      tr.appendChild(el('td',null,String(i+1)));
      tr.appendChild(el('td','n',fmt(rs[i],4)));
      tr.appendChild(el('td',null,'Range chart \u2014 beyond a control limit'));
      tb.appendChild(tr);
    });
    if(!any){
      const tr=el('tr'); const td=el('td',null,'No rule violations detected.');
      td.setAttribute('colspan','3'); tr.appendChild(td); tb.appendChild(tr);
    }
  }
  function drawChart(sel, vals, ctr, ucl, lcl, flags, title){
    const svg = plot($(sel), 620, 220);
    const L=54, R=606, T=26, B=182;
    const lo = Math.min(lcl, Math.min.apply(null,vals));
    const hi = Math.max(ucl, Math.max.apply(null,vals));
    const padv = (hi-lo)*.12 || 1;
    const Y = v => B - (v-(lo-padv))/((hi+padv)-(lo-padv))*(B-T);
    const X = i => L + i*((R-L)/Math.max(1,vals.length-1));
    pAdd(svg,'text',{x:L,y:14,class:'lab-t'},title);
    [[ucl,'spec','UCL'],[lcl,'spec','LCL']].forEach(([v,c,lab])=>{
      pAdd(svg,'line',{x1:L,y1:Y(v),x2:R,y2:Y(v),class:c});
      pAdd(svg,'text',{x:8,y:Y(v)+3,class:'lab-t sig'},lab);
    });
    pAdd(svg,'line',{x1:L,y1:Y(ctr),x2:R,y2:Y(ctr),stroke:'rgba(207,225,239,.45)','stroke-width':1});
    pAdd(svg,'text',{x:8,y:Y(ctr)+3,class:'lab-t'},'CL');
    pAdd(svg,'polyline',{class:'cc-line',points:vals.map((v,i)=>X(i)+','+Y(v)).join(' ')});
    vals.forEach((v,i)=>{
      pAdd(svg,'circle',{cx:X(i),cy:Y(v),r:flags[i]?5.5:4,
        class:'cc-dot'+(flags[i]?' bad':'')});
    });
    pAdd(svg,'text',{x:R,y:B+18,class:'lab-t','text-anchor':'end'},'SUBGROUP '+vals.length);
  }
  btn.addEventListener('click',run);
  const d=$('#spcDemo');
  if(d) d.addEventListener('click',()=>{
    $g('#spcData').value =
"2.0010 2.0023 2.0028 2.0016\n2.0009 2.0019 2.0024 2.0029\n2.0010 2.0010 2.0026 2.0024\n2.0032 2.0028 2.0019 2.0018\n2.0041 2.0018 2.0014 2.0011\n2.0021 2.0021 2.0017 2.0020\n2.0022 2.0026 2.0029 2.0022\n2.0006 2.0026 2.0009 2.0019\n2.0044 2.0039 2.0047 2.0041\n2.0022 2.0020 2.0027 2.0015\n2.0018 2.0025 2.0019 2.0023\n2.0021 2.0012 2.0025 2.0014\n2.0035 2.0016 2.0025 2.0020\n2.0028 2.0015 2.0028 2.0019\n2.0030 2.0025 2.0021 2.0014\n2.0047 2.0045 2.0054 2.0038\n2.0045 2.0045 2.0043 2.0043\n2.0042 2.0036 2.0033 2.0038";
    run();
  });
  $('#spcDemo').click();   // arrive with a worked example loaded
}

/* ══════════════ 4. GAUGE R&R ══════════════ */
function toolGRR(){
  const btn=$('#grrRun'); if(!btn) return;
  function run(){
    // rows: one line per operator-part, values = trials. Header format: op,part,t1,t2...
    const lines = String($g('#grrData').value).trim().split(/\n+/).filter(l=>l.trim());
    const vd=$('#grrVerdict'), out=$('#grrOut');
    const recs=[];
    lines.forEach(l=>{
      const p = l.split(/[,;\t]+|\s{2,}/).map(x=>x.trim()).filter(Boolean);
      if(p.length<3) return;
      const trials = p.slice(2).map(parseFloat).filter(isFinite);
      if(trials.length<2) return;
      recs.push({op:p[0], part:p[1], t:trials});
    });
    if(recs.length<6){
      vd.className='verdict bad';
      vd.textContent='Needs at least six lines in the form: operator, part, trial1, trial2. Try the worked example.';
      out.hidden=true; return;
    }
    out.hidden=false;
    const ops=[...new Set(recs.map(r=>r.op))], parts=[...new Set(recs.map(r=>r.part))];
    const trials = recs[0].t.length;

    // average and range method
    const rbar = mean(recs.map(r=>Math.max.apply(null,r.t)-Math.min.apply(null,r.t)));
    const kTrial = ccConst(trials);
    const EV = rbar/kTrial.d2 * 3;                       // 3 sigma repeatability
    const opMeans = ops.map(o=>mean(recs.filter(r=>r.op===o).flatMap(r=>r.t)));
    const xDiff = Math.max.apply(null,opMeans)-Math.min.apply(null,opMeans);
    const D2S = {2:1.41421,3:1.91155,4:2.23887,5:2.48124,6:2.67253,7:2.82981,8:2.96288,9:3.07794,10:3.17905};  /* AIAG d2* for a single range (g = 1) */
    const kOp = {d2: D2S[ops.length] || ccConst(ops.length).d2};  /* K2 = 1/d2*: 0.7071 for 2 appraisers, 0.5231 for 3 */
    const nParts = parts.length;
    const avRaw = Math.pow(xDiff/kOp.d2*3, 2) - (EV*EV)/(nParts*trials);
    const AV = Math.sqrt(Math.max(avRaw,0));             // 3 sigma reproducibility
    const RR = Math.sqrt(EV*EV + AV*AV);
    const partMeans = parts.map(p=>mean(recs.filter(r=>r.part===p).flatMap(r=>r.t)));
    const rp = Math.max.apply(null,partMeans)-Math.min.apply(null,partMeans);
    const kPart = {d2: D2S[nParts] || ccConst(nParts).d2};  /* K3 = 1/d2*: 0.4030 for 5 parts, 0.3146 for 10 */
    const PV = rp/kPart.d2*3;
    const TV = Math.sqrt(RR*RR + PV*PV);
    const pct = x => TV>0 ? x/TV*100 : 0;
    const ndc = PV>0 && RR>0 ? Math.floor(1.41*PV/RR) : 0;

    const set=(id,v,cls)=>{ const e=$(id); e.textContent=v; e.parentElement.className='ro'+(cls?' '+cls:''); };
    const band = p => p<10 ? 'good' : p<=30 ? 'warn' : 'bad';
    set('#grrEV', fmt(pct(EV),1)+'%', band(pct(EV)));
    set('#grrAV', fmt(pct(AV),1)+'%', band(pct(AV)));
    set('#grrRR', fmt(pct(RR),1)+'%', band(pct(RR)));
    set('#grrPV', fmt(pct(PV),1)+'%');
    set('#grrNDC', String(ndc), ndc>=5 ? 'good' : 'bad');
    $('#grrBasis').textContent = ops.length+' operators \u00D7 '+nParts+' parts \u00D7 '+trials+
      ' trials.  Average and range method.  Constants (AIAG): d\u2082 for trials, d\u2082* for one range of operators and of parts: '+
      'trials '+fmt(kTrial.d2,4)+', operators '+fmt(kOp.d2,4)+', parts '+fmt(kPart.d2,4)+'.';

    const p = pct(RR);
    if(p<10){
      vd.className='verdict good';
      vd.textContent='Acceptable. The measurement system consumes '+fmt(p,1)+
        ' percent of total variation, and resolves '+ndc+' distinct categories.';
    } else if(p<=30){
      vd.className='verdict warn';
      vd.textContent='Marginal at '+fmt(p,1)+' percent. Acceptable in some applications depending on the '+
        'importance of the characteristic and the cost of improving the system, but it needs justifying rather than assuming. '+
        (pct(AV)>pct(EV) ? 'Reproducibility exceeds repeatability, which points at differences between operators \u2014 method or training rather than the gauge itself.'
                         : 'Repeatability exceeds reproducibility, which points at the gauge or the fixturing rather than the people.');
    } else {
      vd.className='verdict bad';
      vd.textContent='Unacceptable at '+fmt(p,1)+' percent. '+
        (pct(AV)>pct(EV) ? 'Reproducibility dominates: operators are not measuring the same way. Look at method, fixturing and training before replacing the gauge.'
                         : 'Repeatability dominates: the gauge cannot repeat itself. Look at the instrument, its resolution and how the part is held.');
    }
    if(ndc<5) vd.textContent += ' With '+ndc+' distinct categories the system cannot reliably separate parts, whatever the percentages say.';
  }
  btn.addEventListener('click',run);
  const d=$('#grrDemo');
  if(d) d.addEventListener('click',()=>{
    $g('#grrData').value =
"A, 1, 2.0011, 2.0014\nA, 2, 2.0035, 2.0031\nA, 3, 1.9982, 1.9986\nA, 4, 2.0057, 2.0053\nA, 5, 2.0003, 2.0008\n"+
"B, 1, 2.0018, 2.0021\nB, 2, 2.0041, 2.0038\nB, 3, 1.9990, 1.9993\nB, 4, 2.0063, 2.0060\nB, 5, 2.0010, 2.0014\n"+
"C, 1, 2.0009, 2.0006\nC, 2, 2.0030, 2.0034\nC, 3, 1.9979, 1.9975\nC, 4, 2.0052, 2.0056\nC, 5, 2.0001, 1.9998";
    run();
  });
  $('#grrDemo').click();   // arrive with a worked example loaded
}

/* ══════════════ 5. PARETO BUILDER ══════════════ */
function toolPareto(){
  const btn=$('#parRun'); if(!btn) return;
  function run(){
    const rows = String($g('#parData').value).trim().split(/\n+/).map(l=>{
      const m = l.match(/^(.*?)[,;\t]+\s*(-?[\d.]+)\s*$/);
      if(!m) return null;
      return { k:m[1].trim(), v:parseFloat(m[2]) };
    }).filter(r=>r && isFinite(r.v) && r.v>0);
    const vd=$('#parVerdict'), out=$('#parOut');
    if(rows.length<2){
      vd.className='verdict bad';
      vd.textContent='Needs at least two lines in the form: category, count.';
      out.hidden=true; return;
    }
    out.hidden=false;
    rows.sort((a,b)=>b.v-a.v);
    const total = rows.reduce((s,r)=>s+r.v,0);
    let cum=0; rows.forEach(r=>{ cum+=r.v; r.cum=cum/total*100; });
    const vital = rows.findIndex(r=>r.cum>=80)+1;
    const share = rows.slice(0,vital).reduce((s,r)=>s+r.v,0)/total*100;

    const svg = plot($('#parPlot'), 620, 320);
    const L=50, R=596, T=26, B=232;
    const maxv = rows[0].v, bw=(R-L)/rows.length;
    rows.forEach((r,i)=>{
      const h = r.v/maxv*(B-T);
      pAdd(svg,'rect',{x:L+i*bw+4,y:B-h,width:bw-8,height:h,class:'bar'+(i<vital?' hi':'')});
      const t=pAdd(svg,'text',{x:L+i*bw+bw/2,y:B+15,class:'lab-t','text-anchor':'end',
        transform:'rotate(-38 '+(L+i*bw+bw/2)+' '+(B+15)+')'}, r.k.slice(0,16));
      pAdd(svg,'text',{x:L+i*bw+bw/2,y:B-h-6,class:'lab-t','text-anchor':'middle'}, String(r.v));
    });
    pAdd(svg,'polyline',{class:'cum',points:rows.map((r,i)=>(L+i*bw+bw/2)+','+(B-r.cum/100*(B-T))).join(' ')});
    rows.forEach((r,i)=>pAdd(svg,'circle',{cx:L+i*bw+bw/2,cy:B-r.cum/100*(B-T),r:3,fill:'#9C7C1F'}));
    pAdd(svg,'line',{x1:L,y1:B-0.8*(B-T),x2:R,y2:B-0.8*(B-T),class:'spec'});
    pAdd(svg,'text',{x:R+2,y:B-0.8*(B-T)-5,class:'lab-t sig','text-anchor':'end'},'80%');
    pAdd(svg,'line',{x1:L,y1:B,x2:R,y2:B,class:'ax'});

    const tb=$('#parTable'); tb.innerHTML='';
    rows.forEach((r,i)=>{
      const tr=el('tr', i<vital ? 'flag' : null);
      tr.appendChild(el('td',null,r.k));
      tr.appendChild(el('td','n',String(r.v)));
      tr.appendChild(el('td','n',fmt(r.v/total*100,1)+'%'));
      tr.appendChild(el('td','n',fmt(r.cum,1)+'%'));
      tb.appendChild(tr);
    });
    vd.className='verdict';
    if(vital<=Math.ceil(rows.length*0.35)){
      vd.className='verdict good';
      vd.textContent = vital+' of '+rows.length+' categories account for '+fmt(share,1)+
        ' percent of the total. That is a usable vital few: work those and leave the rest alone until they matter. '+
        'Before committing, check that the categories are mutually exclusive and that the counting period covers a representative stretch.';
    } else {
      vd.className='verdict warn';
      vd.textContent = 'It takes '+vital+' of '+rows.length+' categories to reach 80 percent, so there is no strong vital few here. '+
        'A flat Pareto usually means the categories are too broad, or that the real signal is hidden in a stratifying variable \u2014 machine, shift, supplier \u2014 rather than in the defect names. Try re-cutting the data.';
    }
  }
  btn.addEventListener('click',run);
  const d=$('#parDemo');
  if(d) d.addEventListener('click',()=>{
    $g('#parData').value =
"Anodize finish, 96\nHole position, 54\nBurr at deburr, 31\nSurface scratch, 18\nThread damage, 9\nStamp illegible, 6\nEdge chip, 4";
    run();
  });
  $('#parDemo').click();   // arrive with a worked example loaded
}

/* ══════════════ 6. OC CURVE ══════════════ */
function toolOC(){
  if(!$('#ocN')) return;
  function lchoose(n,k){
    let s=0; for(let i=0;i<k;i++) s += Math.log(n-i)-Math.log(i+1); return s;
  }
  function Pa(n,c,p){
    if(p<=0) return 1; if(p>=1) return 0;
    let s=0;
    for(let k=0;k<=c;k++) s += Math.exp(lchoose(n,k) + k*Math.log(p) + (n-k)*Math.log(1-p));
    return Math.min(1,s);
  }
  function run(){
    const n=Math.max(1,parseInt($('#ocN').value,10)||50);
    const c=Math.max(0,parseInt($('#ocC').value,10)||0);
    const aql=(parseFloat($('#ocAQL').value)||1)/100;
    const rql=(parseFloat($('#ocRQL').value)||8)/100;
    if(c>=n){ $('#ocVerdict').className='verdict bad';
      $('#ocVerdict').textContent='Acceptance number must be smaller than the sample size.'; return; }
    const alpha = 1-Pa(n,c,aql), beta = Pa(n,c,rql);
    const set=(id,v,cls)=>{ const e=$(id); e.textContent=v; e.parentElement.className='ro'+(cls?' '+cls:''); };
    set('#ocAlpha', fmt(alpha*100,1)+'%', alpha>0.10 ? 'bad' : alpha>0.05 ? 'warn':'good');
    set('#ocBeta',  fmt(beta*100,1)+'%',  beta>0.20 ? 'bad' : beta>0.10 ? 'warn':'good');
    // indifference quality (Pa = 0.5)
    let lo=0,hi=1; for(let i=0;i<60;i++){ const m=(lo+hi)/2; if(Pa(n,c,m)>0.5) lo=m; else hi=m; }
    set('#ocIQ', fmt((lo+hi)/2*100,2)+'%');
    set('#ocRatio', fmt(rql/aql,1)+':1');

    const svg=plot($('#ocPlot'),620,300);
    const L=52,R=600,T=40,B=246, pmax=Math.max(rql*1.9,0.12);
    const X=p=>L+p/pmax*(R-L), Y=v=>B-v*(B-T);
    for(let g=0;g<=10;g+=2) pAdd(svg,'line',{x1:L,y1:Y(g/10),x2:R,y2:Y(g/10),class:'gl'});
    const pts=[]; for(let i=0;i<=200;i++){ const p=pmax*i/200; pts.push([X(p),Y(Pa(n,c,p))]); }
    pAdd(svg,'path',{d:'M'+pts.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join('L'),class:'curve-line'});
    [[aql,'AQL','#1F8C55'],[rql,'RQL','#C0392B']].forEach(([p,lab,col])=>{
      if(p>pmax) return;
      pAdd(svg,'line',{x1:X(p),y1:T,x2:X(p),y2:B,stroke:col,'stroke-width':1.3,'stroke-dasharray':'5 4'});
      pAdd(svg,'text',{x:X(p),y:T-8,class:'lab-t','text-anchor':'middle',fill:col},lab);
      pAdd(svg,'circle',{cx:X(p),cy:Y(Pa(n,c,p)),r:4,fill:col});
    });
    pAdd(svg,'line',{x1:L,y1:B,x2:R,y2:B,class:'ax'});
    pAdd(svg,'line',{x1:L,y1:T,x2:L,y2:B,class:'ax'});
    pAdd(svg,'text',{x:L-6,y:Y(1)+4,class:'lab-t','text-anchor':'end'},'1.0');
    pAdd(svg,'text',{x:L-6,y:Y(0.5)+4,class:'lab-t','text-anchor':'end'},'0.5');
    pAdd(svg,'text',{x:L-6,y:Y(0)+4,class:'lab-t','text-anchor':'end'},'0');
    pAdd(svg,'text',{x:(L+R)/2,y:B+22,class:'lab-t','text-anchor':'middle'},
      'INCOMING FRACTION NONCONFORMING \u2014 0 TO '+fmt(pmax*100,1)+'%');
    pAdd(svg,'text',{x:L,y:15,class:'lab-t'},'PROBABILITY OF ACCEPTANCE');

    const vd=$('#ocVerdict');
    if(alpha>0.10 && beta>0.20){
      vd.className='verdict bad';
      vd.textContent='This plan serves neither party. Producer risk of '+fmt(alpha*100,1)+
        ' percent rejects good lots too often, and consumer risk of '+fmt(beta*100,1)+
        ' percent lets bad ones through. A larger sample is the only way to sharpen both at once.';
    } else if(beta>0.20){
      vd.className='verdict warn';
      vd.textContent='Consumer risk is '+fmt(beta*100,1)+' percent: better than one lot in five at the rejectable quality level '+
        'would be accepted. Raising n, or lowering c, will pull this down.';
    } else if(alpha>0.10){
      vd.className='verdict warn';
      vd.textContent='Producer risk is '+fmt(alpha*100,1)+' percent: acceptable lots will be rejected that often, '+
        'which costs the supplier and eventually costs you. Raising c is the usual response, at the price of consumer risk.';
    } else {
      vd.className='verdict good';
      vd.textContent='A workable balance: '+fmt(alpha*100,1)+' percent producer risk and '+fmt(beta*100,1)+
        ' percent consumer risk. Remember that no sampling plan improves quality \u2014 it only decides what you find out about it.';
    }
  }
  ['#ocN','#ocC','#ocAQL','#ocRQL'].forEach(s=>{ const e=$(s); if(e) e.addEventListener('input',run); });
  run();
}

/* ══════════════ 7. CONSTANTS ══════════════ */
function toolConstants(){
  const tb=$('#ccTable'); if(!tb) return;
  tb.innerHTML='';
  for(let n=2;n<=10;n++){
    const k=ccConst(n);
    const tr=el('tr');
    [String(n),fmt(k.d2,4),fmt(k.d3,4),fmt(k.A2,4),fmt(k.D3,4),fmt(k.D4,4),
     fmt(3/(k.d2*Math.sqrt(n)),4)].forEach((v,i)=>{
      tr.appendChild(el('td', i?'n':null, v));
    });
    tb.appendChild(tr);
  }
}

function initTools(){ initGrids(); toolSigma(); toolCapability(); toolSPC(); toolGRR();
  toolPareto(); toolOC(); toolConstants(); toolYield(); toolSampleSize(); toolHypothesis(); toolLinearity(); toolGrrCpk(); }

/* ══════════════ 8. YIELD, DPMO AND SIGMA ══════════════ */
function toolYield(){
  if(!$g('#yStepData')) return;
  function run(){
    const rows = String($g('#yStepData').value).trim().split(/\n+/).map(l=>{
      const m = l.match(/^(.*?)[,;\t]+\s*([\d.]+)\s*[,;\t]+\s*([\d.]+)\s*$/);
      if(!m) return null;
      return { k:m[1].trim(), units:parseFloat(m[2]), def:parseFloat(m[3]) };
    }).filter(r=>r && isFinite(r.units) && r.units>0 && isFinite(r.def) && r.def>=0);
    const opp = Math.max(1, parseFloat($('#yOpp').value)||1);
    const vd = $('#yVerdict'), out = $('#yOut');
    if(!rows.length){
      vd.className='verdict bad';
      vd.textContent='Needs at least one line in the form: step name, units in, defects.';
      out.hidden=true; return;
    }
    out.hidden=false;
    let rty=1, totalDef=0, totalUnits=0;
    rows.forEach(r=>{ r.fty = Math.max(0,(r.units-r.def)/r.units); rty*=r.fty;
      totalDef+=r.def; totalUnits+=r.units; });
    const nStep = rows.length;
    const normYield = Math.pow(rty, 1/nStep);
    const dpu = totalDef / rows[0].units;   /* defects per unit started; -ln(RTY) is only the Poisson estimate */
    const dpmo = totalUnits>0 ? totalDef/(totalUnits*opp)*1e6 : 0;
    const z = dpmo>0 && dpmo<1e6 ? invPHI(1-dpmo/1e6) : 6;
    const sigma = Math.min(z+1.5, 6.5);

    const set=(id,v,cls)=>{ const e=$(id); e.textContent=v; e.parentElement.className='ro'+(cls?' '+cls:''); };
    const band = y => y>=.99 ? 'good' : y>=.95 ? 'warn' : 'bad';
    set('#yRTY', fmt(rty*100,2)+'%', band(rty));
    set('#yNorm', fmt(normYield*100,2)+'%', band(normYield));
    set('#yDPU', fmt(dpu,4));
    set('#yDPMO', dpmo>=100 ? Math.round(dpmo).toLocaleString() : fmt(dpmo,1), band(1-dpmo/1e6));
    set('#ySigma', fmt(sigma,2)+'\u03C3', sigma>=4.5?'good':sigma>=3.5?'warn':'bad');

    const worst = rows.slice().sort((a,b)=>a.fty-b.fty)[0];
    const simpleAvg = rows.reduce((s,r)=>s+r.fty,0)/nStep;
    vd.className = rty>=.95 ? 'verdict good' : rty>=.85 ? 'verdict warn' : 'verdict bad';
    vd.textContent = 'Rolled throughput yield is '+fmt(rty*100,2)+' percent \u2014 the probability a unit passes every '+
      'step with no rework. The simple average of the step yields is '+fmt(simpleAvg*100,2)+
      ' percent, and the gap between those two numbers is why averaging step yields flatters the line. '+
      'The weakest step is '+worst.k+' at '+fmt(worst.fty*100,2)+' percent, and it is where the next project belongs.';

    const svg = plot($('#yPlot'), 620, 300);
    const L=54,R=600,T=26,B=232;
    const bw=(R-L)/rows.length;
    rows.forEach((r,i)=>{
      const h=r.fty*(B-T);
      pAdd(svg,'rect',{x:L+i*bw+5,y:B-h,width:bw-10,height:h,class:'bar'+(r===worst?' hi':'')});
      pAdd(svg,'text',{x:L+i*bw+bw/2,y:B-h-6,class:'lab-t','text-anchor':'middle'},fmt(r.fty*100,1)+'%');
      pAdd(svg,'text',{x:L+i*bw+bw/2,y:B+15,class:'lab-t','text-anchor':'end',
        transform:'rotate(-34 '+(L+i*bw+bw/2)+' '+(B+15)+')'}, r.k.slice(0,15));
    });
    // cumulative RTY line
    let c=1; const pts=[];
    rows.forEach((r,i)=>{ c*=r.fty; pts.push((L+i*bw+bw/2)+','+(B-c*(B-T))); });
    pAdd(svg,'polyline',{class:'cum',points:pts.join(' ')});
    pts.forEach(p=>{ const [x,y]=p.split(','); pAdd(svg,'circle',{cx:x,cy:y,r:3.5,fill:'#9C7C1F'}); });
    pAdd(svg,'line',{x1:L,y1:B,x2:R,y2:B,class:'ax'});
    pAdd(svg,'text',{x:L,y:16,class:'lab-t'},'BARS: FIRST PASS YIELD PER STEP   LINE: CUMULATIVE RTY');
  }
  $('#yRun').addEventListener('click',run);
  ['#yOpp'].forEach(s=>$(s).addEventListener('input',run));
  $('#yDemo').addEventListener('click',()=>{
    $g('#yStepData').value =
"Saw, 12000, 96\nMill, 12000, 148\nDrill, 11756, 211\nDeburr, 11545, 340\nAnodize, 11205, 218\nFinal test, 10987, 62";
    $('#yOpp').value='5'; run();
  });
  $('#yDemo').click();
}

/* ══════════════ 9. SAMPLE SIZE ══════════════ */
function toolSampleSize(){
  if(!$('#ssMode')) return;
  function run(){
    const mode = $('#ssMode').value;
    const conf = Math.min(99.9, Math.max(50, parseFloat($('#ssConf').value)||95));
    const z = invPHI(1-(1-conf/100)/2);
    const N = parseFloat($('#ssPop').value);
    $('#ssAttrFields').hidden = (mode!=='attr');
    $('#ssVarFields').hidden  = (mode!=='var');
    let n, basis;
    if(mode==='attr'){
      const p = Math.min(.999, Math.max(.001, (parseFloat($('#ssP').value)||50)/100));
      const E = Math.max(.0001,(parseFloat($('#ssE').value)||5)/100);
      n = z*z*p*(1-p)/(E*E);
      basis = 'n = z\u00B2 \u00D7 p(1\u2212p) \u00F7 E\u00B2 with z = '+fmt(z,4)+', p = '+fmt(p*100,1)+'%, E = \u00B1'+fmt(E*100,2)+'%';
    } else {
      const sd = Math.abs(parseFloat($('#ssSD').value)||1);
      const E  = Math.abs(parseFloat($('#ssME').value)||1);
      n = Math.pow(z*sd/E, 2);
      basis = 'n = (z \u00D7 \u03C3 \u00F7 E)\u00B2 with z = '+fmt(z,4)+', \u03C3 = '+fmt(sd,4)+', E = \u00B1'+fmt(E,4);
    }
    let nAdj = n, fpc = false;
    if(isFinite(N) && N>0){ nAdj = n / (1 + (n-1)/N); fpc = true; }
    const set=(id,v,cls)=>{ const e=$(id); e.textContent=v; e.parentElement.className='ro'+(cls?' '+cls:''); };
    set('#ssN', String(Math.ceil(n)));
    set('#ssNAdj', fpc ? String(Math.ceil(nAdj)) : '\u2014', fpc?'good':'');
    set('#ssZ', fmt(z,3));
    $('#ssBasis').textContent = basis + (fpc ? '   Finite population correction applied for N = '+N+'.' : '');
    const vd = $('#ssVerdict');
    vd.className='verdict';
    vd.textContent = 'Take '+Math.ceil(fpc?nAdj:n)+' units. '+
      (mode==='attr'
        ? 'This sizes a proportion estimate, and it assumes simple random sampling from a stable process. Using p = 50 percent when the true proportion is unknown is deliberately conservative \u2014 it produces the largest sample any proportion would require.'
        : 'This sizes an estimate of a mean and needs a usable estimate of \u03C3. If you do not have one, run a small pilot first; guessing \u03C3 low is the commonest way to end up underpowered.') +
      ' A sample size is not a substitute for a representative sample: thirty consecutive parts from one machine tell you about that machine.';
  }
  ['#ssMode','#ssConf','#ssP','#ssE','#ssSD','#ssME','#ssPop'].forEach(s=>{
    const e=$(s); if(e) e.addEventListener('input',run);
  });
  run();
}

/* ══════════════ 10. HYPOTHESIS TEST SELECTOR ══════════════ */
const HTREE = {
  start:{ q:'What kind of data is the response?',
    a:[['Continuous \u2014 measurements','cont'],['Attribute \u2014 counts, proportions, pass/fail','attr']] },
  cont:{ q:'What are you comparing?',
    a:[['A mean against a target value','c1'],['Two groups','c2'],['Three or more groups','c3'],['Spread rather than center','cv']] },
  c1:{ q:'Do you know the population standard deviation?',
    a:[['No \u2014 estimated from the sample','r:One-sample t test|The usual case. Uses the sample standard deviation and the t distribution, which is wider than the normal to account for that estimate. Check the data are roughly symmetric at small n.'],
       ['Yes \u2014 known from long history','r:One-sample z test|Rare in practice. Only defensible when sigma is genuinely established from a large stable history, not estimated from the same data.']] },
  c2:{ q:'Are the two groups independent?',
    a:[['Yes \u2014 separate units in each group','c2i'],
       ['No \u2014 the same units measured twice','r:Paired t test|Test the differences, not the two sets of readings. Pairing removes unit-to-unit variation and is far more powerful when it applies. Before-and-after on the same parts is the classic case.']] },
  c2i:{ q:'Are the data reasonably normal, or is n large?',
    a:[['Yes','r:Two-sample t test|Welch\u2019s unequal-variance form is the safer default; it loses little when the variances are in fact equal. This is the workhorse comparison on most examinations.'],
       ['No, and n is small','r:Mann-Whitney test|A nonparametric comparison of two independent samples. Compares distributions rather than means, and does not require normality. Less powerful when normality does hold.']] },
  c3:{ q:'How many factors are you varying?',
    a:[['One','r:One-way ANOVA|Tests whether all group means are equal. A significant F says they are not all equal; it does not say which pair differs, so follow with a multiple comparison such as Tukey.'],
       ['Two or more','r:Two-way ANOVA or a designed experiment|Lets you separate main effects from interactions. If the objective is optimization rather than comparison, move to a designed experiment.']] },
  cv:{ q:'How many groups?',
    a:[['Two','r:F test for two variances|Sensitive to non-normality. Levene or Bartlett is the safer choice when the data are not clearly normal.'],
       ['Three or more','r:Levene or Bartlett test|Tests equality of variance across several groups. Often run as a precondition for ANOVA rather than as the question of interest.']] },
  attr:{ q:'What are you testing?',
    a:[['One proportion against a target','r:One-proportion z test|Requires enough events and non-events for the normal approximation \u2014 the usual rule is at least five of each. Use an exact binomial test when counts are small.'],
       ['Two proportions','r:Two-proportion z test|Same approximation condition applies to both groups. With small counts, Fisher\u2019s exact test is the correct alternative.'],
       ['Association between two categorical variables','r:Chi-square test of independence|Works on a contingency table of counts. Expected counts below five in any cell undermine it; combine categories or use an exact test.'],
       ['Counts against an expected distribution','r:Chi-square goodness of fit|Compares observed counts with those expected under a stated distribution. The same expected-count condition applies.']] }
};
function toolHypothesis(){
  const host = $('#htBody'); if(!host) return;
  let path = [];
  function render(node){
    const n = HTREE[node];
    host.innerHTML='';
    // breadcrumb of choices so far
    if(path.length){
      const bc = el('div','htpath');
      path.forEach(p=>{ const s=el('span',null,p); bc.appendChild(s); });
      host.appendChild(bc);
    }
    const q = el('p','htq', n.q); host.appendChild(q);
    const box = el('div','htopts');
    n.a.forEach(([label,next])=>{
      const b = el('button','htbtn'); b.type='button'; b.textContent=label;
      b.addEventListener('click',()=>{
        path.push(label.replace(/ \u2014.*$/,''));
        if(next.indexOf('r:')===0) result(next.slice(2));
        else render(next);
      });
      box.appendChild(b);
    });
    host.appendChild(box);
    const reset = el('button','btn sm ghost','Start over');
    reset.type='button'; reset.style.marginTop='20px';
    reset.addEventListener('click',()=>{ path=[]; render('start'); });
    if(path.length) host.appendChild(reset);
  }
  function result(payload){
    const [name, note] = payload.split('|');
    host.innerHTML='';
    const bc = el('div','htpath');
    path.forEach(p=>bc.appendChild(el('span',null,p)));
    host.appendChild(bc);
    const r = el('div','htresult');
    r.innerHTML = '<span class="lbl">RECOMMENDED TEST</span><h4>'+name+'</h4><p>'+note+'</p>'+
      '<p class="ht-warn">Whatever the test says, a p-value answers only whether the data are surprising under the '+
      'null hypothesis. It does not tell you the effect is large enough to matter, and it never establishes cause.</p>';
    host.appendChild(r);
    const again = el('button','btn sm','Start over');
    again.type='button'; again.style.marginTop='20px';
    again.addEventListener('click',()=>{ path=[]; render('start'); });
    host.appendChild(again);
  }
  render('start');
}


/* ══════════════ 11. LINEARITY AND BIAS STUDY ══════════════
   AIAG MSA linearity method. One appraiser, g references across the
   range, m readings each. Validated against the handoff spec's own
   test vectors: slope 0.009614, s 0.2197, t slope 4.207, and the
   NOT ACCEPTABLE verdict on the worked example.
   ═════════════════════════════════════════════════════════ */
function _logGamma(x){
  const c=[76.18009172947146,-86.50532032941677,24.01409824083091,
           -1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
  let y=x, tmp=x+5.5; tmp-=(x+0.5)*Math.log(tmp);
  let ser=1.000000000190015;
  for(let j=0;j<6;j++) ser+=c[j]/++y;
  return -tmp+Math.log(2.5066282746310005*ser/x);
}
function _betacf(a,b,x){
  const MAXIT=200, EPS=3e-12, FPMIN=1e-300;
  let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;
  if(Math.abs(d)<FPMIN) d=FPMIN;
  d=1/d; let h=d;
  for(let m=1;m<=MAXIT;m++){
    const m2=2*m;
    let aa=m*(b-m)*x/((qam+m2)*(a+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN) d=FPMIN;
    c=1+aa/c;  if(Math.abs(c)<FPMIN) c=FPMIN;
    d=1/d; h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN) d=FPMIN;
    c=1+aa/c;  if(Math.abs(c)<FPMIN) c=FPMIN;
    d=1/d; const del=d*c; h*=del;
    if(Math.abs(del-1)<EPS) break;
  }
  return h;
}
function _betai(a,b,x){
  if(x<=0) return 0;
  if(x>=1) return 1;
  const bt=Math.exp(_logGamma(a+b)-_logGamma(a)-_logGamma(b)+a*Math.log(x)+b*Math.log(1-x));
  return x<(a+1)/(a+b+2) ? bt*_betacf(a,b,x)/a : 1-bt*_betacf(b,a,1-x)/b;
}
function tdist2(t,df){ return (!isFinite(t)||df<1) ? NaN : _betai(df/2,0.5,df/(df+t*t)); }
function tinv2(alpha,df){
  if(df<1) return NaN;
  let lo=0, hi=200;
  for(let i=0;i<200;i++){ const m=(lo+hi)/2; if(tdist2(m,df)>alpha) lo=m; else hi=m; }
  return (lo+hi)/2;
}

function toolLinearity(){
  const btn=$('#linRun'); if(!btn) return;
  const vd=$('#linVerdict'), out=$('#linOut');
  const f=(v,d)=> isFinite(v)?v.toFixed(d):'\u2014';
  const pc=(v,d)=> isFinite(v)?(v*100).toFixed(d)+'%':'\u2014';
  const evCls=v=> !isFinite(v)?'':(v<0.10?'ok':(v<=0.30?'warn':'bad'));

  function run(){
    const rows=$g('#linGrid').grid ? $g('#linGrid').grid.data() : [];
    const conf=Number($('#linConf').value)||0.95, alpha=1-conf;
    const k=parseFloat($('#linK').value)||6;
    const cut=(parseFloat($('#linCut').value)||10)/100;

    const per=[];
    rows.forEach((r,i)=>{
      const id=String(r[0]||'').trim() || ('Ref '+(i+1));
      const R=parseFloat(r[1]);
      const L=parseFloat(r[2]), U=parseFloat(r[3]);
      const xs=r.slice(4).map(v=>parseFloat(v)).filter(v=>isFinite(v));
      if(!isFinite(R) || !xs.length) return;
      const n=xs.length, avg=mean(xs), B=avg-R;
      const sr=n>1?sd(xs):NaN, sb=n>1?sr/Math.sqrt(n):NaN;
      const t=(isFinite(sb)&&sb>0)?B/sb:0;
      const tc=n>1?tinv2(alpha,n-1):NaN;
      const lo=isFinite(tc)?B-tc*sb:NaN, hi=isFinite(tc)?B+tc*sb:NaN;
      const okBias=isFinite(lo)&&lo<=0&&0<=hi;
      const tol=(isFinite(L)&&isFinite(U)&&U>L)?U-L:NaN;
      const ev=(isFinite(tol)&&isFinite(sr))?k*sr/tol:NaN;
      const bpc=isFinite(tol)?Math.abs(B)/tol:NaN;
      let call,cls;
      if(okBias){ call='No significant bias'; cls='ok'; }
      else if(isFinite(tol)){
        if(bpc<=cut){ call='Significant, small'; cls='warn'; }
        else { call='Significant, material'; cls='bad'; }
      } else { call='Significant \u2014 no spec'; cls='bad'; }
      per.push({id,R,xs,n,avg,B,sr,sb,t,tc,lo,hi,okBias,tol,ev,bpc,call,cls});
    });

    if(per.length<2){
      vd.className='verdict bad'; vd.hidden=false;
      vd.textContent='Needs at least two references, each with a certified value and one or more '+
        'readings. Try the worked example.';
      out.hidden=true; return;
    }

    let pn=0,pd=0;
    per.forEach(p=>{ if(p.n>1){ pn+=(p.n-1)*p.sr*p.sr; pd+=p.n-1; } });
    const sp=pd>0?Math.sqrt(pn/pd):NaN;
    const tols=per.map(p=>p.tol).filter(isFinite);
    const minTol=tols.length?Math.min.apply(null,tols):NaN;
    const evP=(isFinite(sp)&&isFinite(minTol))?k*sp/minTol:NaN;

    const X=[],Y=[];
    per.forEach(p=>p.xs.forEach(x=>{ X.push(p.R); Y.push(x-p.R); }));
    const N=X.length;
    let reg=null;
    if(N>=3){
      const xb=mean(X), yb=mean(Y);
      const Sxx=X.reduce((s,x)=>s+(x-xb)*(x-xb),0);
      if(Sxx>0){
        const Sxy=X.reduce((s,x,i)=>s+(x-xb)*(Y[i]-yb),0);
        const a=Sxy/Sxx, bb=yb-a*xb;
        const sse=X.reduce((s,x,i)=>{const e=Y[i]-bb-a*x; return s+e*e;},0);
        const se=Math.sqrt(sse/(N-2));
        const Syy=Y.reduce((s,y)=>s+(y-yb)*(y-yb),0);
        const R2=Syy>0?(Sxy*Sxy)/(Sxx*Syy):0;
        const tc=tinv2(alpha,N-2);
        const tS=se>0?Math.abs(a)/(se/Math.sqrt(Sxx)):Infinity;
        const tI=se>0?Math.abs(bb)/(se*Math.sqrt(1/N+xb*xb/Sxx)):Infinity;
        reg={N,xb,Sxx,a,b:bb,s:se,R2,tc,tS,tI,slopeZero:tS<=tc,intZero:tI<=tc,
             fit:x=>bb+a*x, half:x=>tc*se*Math.sqrt(1/N+(x-xb)*(x-xb)/Sxx)};
      }
    }
    if(!reg){
      vd.className='verdict bad'; vd.hidden=false;
      vd.textContent='At least three readings across two or more different reference values are '+
        'needed before a line can be fitted.';
      out.hidden=true; return;
    }

    const Rs=per.map(p=>p.R);
    const rlo=Math.min.apply(null,Rs), rhi=Math.max.apply(null,Rs);
    const pts=Rs.slice().concat([rlo,rhi]).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
    let allIn=true;
    const bands=pts.map(x=>{
      const fv=reg.fit(x), h=reg.half(x), inside=(fv-h)<=0&&0<=(fv+h);
      if(!inside) allIn=false;
      return {x,f:fv,h,lo:fv-h,hi:fv+h,inside};
    });
    let fineIn=true;
    for(let i=0;i<=100;i++){
      const x=rlo+(rhi-rlo)*i/100, fv=reg.fit(x), h=reg.half(x);
      if(!((fv-h)<=0&&0<=(fv+h))){ fineIn=false; break; }
    }

    const g=per.length;
    let ss,ssCls;
    if(g>=5&&per.every(p=>p.n>=10)){ ss='OK (g \u2265 5, m \u2265 10)'; ssCls='ok'; }
    else if(g<5){ ss='Manual calls for g \u2265 5 references'; ssCls='bad'; }
    else { ss='Manual calls for m \u2265 10 readings each'; ssCls='bad'; }

    /* verdict */
    vd.hidden=false;
    vd.className='verdict '+(allIn?'good':'bad');
    vd.textContent = allIn
      ? 'Acceptable. The bias = 0 line stays inside the confidence band across the range, so there '+
        'is no significant linearity error across the references tested.'
      : 'Not acceptable. The bias = 0 line falls outside the confidence band, so the gauge is not '+
        'equally accurate across its operating range. ' +
        (reg.slopeZero
          ? 'The slope itself is not significant, so this is an offset rather than a trend.'
          : 'The slope is significant: bias changes as the reference value changes.') +
        (!fineIn && bands.every(x=>x.inside)
          ? ' The reference points pass but a point between them does not.' : '');
    out.hidden=false;

    const worst=per.reduce((a,p)=> (isFinite(p.ev)&&(!a||p.ev>a.ev))?p:a, null);
    $('#linStats').innerHTML =
      st(pc(evP,1),'%EV POOLED', isFinite(minTol)?('against the tightest tolerance, '+f(minTol,1)):'no tolerances')+
      st(worst?pc(worst.ev,1):'\u2014','WORST SINGLE REFERENCE', worst?worst.id:'')+
      st(f(sp,4),'POOLED \u03C3r','repeatability across the range')+
      st(reg.slopeZero?'PASS':'FAIL','LINEARITY',
         reg.slopeZero?'slope not significant':'slope significant');

    /* repeatability leads; the bias columns sit to the right of the rule,
       because %EV is what the study is being read for */
    $('#linPerRef').innerHTML =
      '<table class="grid lin"><tr>'+
        '<th>Block</th><th>Ref</th><th>n</th><th>&sigma;r</th><th>Tol</th><th>%EV</th>'+
        '<th class="split">Average</th><th>Bias</th><th>Significant?</th>'+
      '</tr>'+
      per.map(p=>'<tr><td>'+esc(p.id)+'</td><td>'+f(p.R,2)+'</td><td>'+p.n+'</td>'+
        '<td>'+f(p.sr,4)+'</td><td>'+f(p.tol,1)+'</td>'+
        '<td><b class="'+evCls(p.ev)+'">'+pc(p.ev,1)+'</b></td>'+
        '<td class="split dim">'+f(p.avg,3)+'</td>'+
        '<td class="dim">'+f(p.B,3)+'</td>'+
        '<td class="dim"><b class="'+(p.okBias?'ok':'warn')+'">'+
          (p.okBias?'no':(isFinite(p.bpc)&&p.bpc<=cut?'yes, small':'yes'))+'</b></td>'+
        '</tr>').join('')+
      '</table>'+
      '<p class="note" style="margin-top:10px">%EV is k&sigma;r over the tolerance: how much of the '+
      'part tolerance the gauge\u2019s own scatter consumes. Under 10 percent is good, 10 to 30 '+
      'conditional, over 30 not acceptable. Bias is shown to the right because it is what the '+
      'linearity test below is built from, not because it is the headline.</p>';

    $('#linReg').innerHTML='<table class="grid">'+
      rw('References (g) / readings (N)', g+' / '+reg.N)+
      rw('Mean reference value', f(reg.xb,2))+
      rw('Slope', f(reg.a,6))+
      rw('Intercept', f(reg.b,4))+
      rw('Standard error of fit', f(reg.s,4))+
      rw('R squared', f(reg.R2,3))+
      rw('t critical (df '+(reg.N-2)+')', f(reg.tc,4))+
      rw('t slope', f(reg.tS,3)+' <b class="'+(reg.slopeZero?'ok':'bad')+'">'+
         (reg.slopeZero?'SLOPE = 0':'SLOPE \u2260 0')+'</b>')+
      rw('t intercept', f(reg.tI,3)+' <b class="'+(reg.intZero?'ok':'bad')+'">'+
         (reg.intZero?'INTERCEPT = 0':'OFFSET PRESENT')+'</b>')+
      rw('Sample size', '<b class="'+ssCls+'">'+esc(ss)+'</b>')+rw('Study variation k', k.toFixed(2)+' \u2014 '+(k>=6?'99.73 percent':'99 percent')+' coverage')+'</table>';

    $('#linBands').innerHTML='<table class="grid"><tr><th>Reference value</th><th>Fitted bias</th>'+
      '<th>Half-width</th><th>Lower</th><th>Upper</th><th>0 inside?</th></tr>'+
      bands.map(x=>'<tr><td>'+f(x.x,1)+'</td><td>'+f(x.f,4)+'</td><td>'+f(x.h,4)+'</td>'+
        '<td>'+f(x.lo,4)+'</td><td>'+f(x.hi,4)+'</td>'+
        '<td><b class="'+(x.inside?'ok':'bad')+'">'+(x.inside?'YES':'NO')+'</b></td></tr>').join('')+
      '</table>';

    drawLin(per, reg, rlo, rhi);
  }
  function st(a,b,c){
    return '<div class="stat"><b>'+a+'</b><span>'+b+'</span><i>'+esc(c||'')+'</i></div>';
  }
  function rw(a,b){ return '<tr><td>'+a+'</td><td colspan="13">'+b+'</td></tr>'; }
  function esc(s){ return String(s==null?'':s).replace(/[<>&]/g,
    c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

  function drawLin(per, reg, rlo, rhi){
    const host=$('#linPlot'); if(!host) return;
    const W=880,H=400,P={l:66,r:22,t:20,b:50};
    const iw=W-P.l-P.r, ih=H-P.t-P.b;
    const padX=(rhi-rlo)*0.06||1, X0=rlo-padX, X1=rhi+padX;
    const ys=[0];
    per.forEach(p=>p.xs.forEach(x=>ys.push(x-p.R)));
    for(let i=0;i<=40;i++){ const x=X0+(X1-X0)*i/40;
      ys.push(reg.fit(x)+reg.half(x), reg.fit(x)-reg.half(x)); }
    let ylo=Math.min.apply(null,ys), yhi=Math.max.apply(null,ys);
    const padY=(yhi-ylo)*0.12||0.1; ylo-=padY; yhi+=padY;
    const sx=x=>P.l+(x-X0)/(X1-X0)*iw, sy=y=>P.t+ih-(y-ylo)/(yhi-ylo)*ih;
    let g='';
    for(let i=0;i<=5;i++){
      const y=ylo+(yhi-ylo)*i/5;
      g+='<line x1="'+P.l+'" y1="'+sy(y).toFixed(1)+'" x2="'+(W-P.r)+'" y2="'+sy(y).toFixed(1)+
         '" stroke="#DDE1E4"/><text x="'+(P.l-8)+'" y="'+(sy(y)+4).toFixed(1)+
         '" text-anchor="end" style="font:600 10px var(--mono);fill:#7C8B99">'+y.toFixed(2)+'</text>';
    }
    per.forEach(p=>{ g+='<text x="'+sx(p.R).toFixed(1)+'" y="'+(H-28)+'" text-anchor="middle" '+
      'style="font:600 10px var(--mono);fill:#7C8B99">'+p.R+'</text>'; });
    g+='<text x="'+(P.l+iw/2)+'" y="'+(H-7)+'" text-anchor="middle" '+
       'style="font:700 10px var(--mono);letter-spacing:.1em;fill:#4A5D71">REFERENCE VALUE</text>';
    g+='<text transform="translate(16,'+(P.t+ih/2)+') rotate(-90)" text-anchor="middle" '+
       'style="font:700 10px var(--mono);letter-spacing:.1em;fill:#4A5D71">BIAS</text>';
    const up=[],dn=[];
    for(let i=0;i<=60;i++){ const x=X0+(X1-X0)*i/60;
      up.push(sx(x).toFixed(1)+','+sy(reg.fit(x)+reg.half(x)).toFixed(1));
      dn.push(sx(x).toFixed(1)+','+sy(reg.fit(x)-reg.half(x)).toFixed(1)); }
    g+='<polygon points="'+up.join(' ')+' '+dn.slice().reverse().join(' ')+
       '" fill="#0F3E68" fill-opacity=".08"/>';
    g+='<polyline points="'+up.join(' ')+'" fill="none" stroke="#7C8B99" stroke-width="1.5" stroke-dasharray="6 4"/>';
    g+='<polyline points="'+dn.join(' ')+'" fill="none" stroke="#7C8B99" stroke-width="1.5" stroke-dasharray="6 4"/>';
    g+='<line x1="'+P.l+'" y1="'+sy(0).toFixed(1)+'" x2="'+(W-P.r)+'" y2="'+sy(0).toFixed(1)+
       '" stroke="#C0392B" stroke-width="2"/>';
    g+='<line x1="'+sx(X0).toFixed(1)+'" y1="'+sy(reg.fit(X0)).toFixed(1)+'" x2="'+sx(X1).toFixed(1)+
       '" y2="'+sy(reg.fit(X1)).toFixed(1)+'" stroke="#0F3E68" stroke-width="2.6"/>';
    per.forEach(p=>p.xs.forEach(x=>{
      g+='<circle cx="'+sx(p.R).toFixed(1)+'" cy="'+sy(x-p.R).toFixed(1)+
         '" r="3" fill="#7C8B99" fill-opacity=".55"/>'; }));
    per.forEach(p=>{ const x=sx(p.R), y=sy(p.B);
      g+='<rect x="'+(x-5).toFixed(1)+'" y="'+(y-5).toFixed(1)+'" width="10" height="10" '+
         'transform="rotate(45 '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="#0F3E68" stroke="#fff" '+
         'stroke-width="1.5"/>'; });
    host.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" '+
      'style="width:100%;height:auto;display:block">'+g+'</svg>';
  }

  $('#linEx').addEventListener('click',()=>{
    $g('#linGrid').grid.setText(
      'TB-25\t25.3\t22\t28\t25.0\t24.9\t25.2\t25.3\t25.5\t25.2\t25.1\t25.0\t25.4\t25.6\n'+
      'TB-35\t35.1\t32\t38\t35.2\t34.8\t34.9\t35.5\t35.2\t34.7\t35.1\t34.8\t35.0\t35.0\n'+
      'TB-45\t45.2\t42\t48\t45.2\t45.5\t45.3\t45.2\t45.5\t45.6\t44.9\t45.3\t45.1\t45.3\n'+
      'TB-55\t55.0\t52\t58\t54.9\t55.3\t55.3\t55.2\t55.0\t55.2\t55.0\t54.9\t55.3\t55.0\n'+
      'TB-63\t63.4\t60\t65\t64.1\t63.9\t63.3\t63.8\t63.5\t63.8\t63.8\t63.3\t63.7\t63.7', '\t');
    btn.dataset.ran='1'; run();
  });
  btn.addEventListener('click',()=>{ btn.dataset.ran='1'; run(); });
  ['linConf','linK','linCut'].forEach(id=>{
    const n=$('#'+id); if(n) n.addEventListener('input',()=>{ if(btn.dataset.ran) run(); });
  });
}


/* ══════════════ 12. GAUGE R&R AGAINST CPK ══════════════
   Variances add: sigma_obs^2 = sigma_process^2 + sigma_gauge^2.
   With %GRR expressed against total variation, that gives
       Cpk_observed = Cpk_true * sqrt(1 - GRR^2)
   exactly. The misclassification figures integrate over the true
   value, with the probability of a wrong call at each point coming
   from the measurement distribution around it.
   ═══════════════════════════════════════════════════════ */
function toolGrrCpk(){
  const sCpk=$('#gcCpk'), sGrr=$('#gcGrr');
  if(!sCpk || !sGrr) return;
  const LSL=-3, USL=3, T=3;                 /* fixed spec; sigma moves instead */

  const pdf=(x,m,s)=> Math.exp(-0.5*((x-m)/s)*((x-m)/s))/(s*Math.sqrt(2*Math.PI));
  const cdf=(x,m,s)=> 0.5*(1+erf((x-m)/(s*Math.SQRT2)));

  function calc(cpkTrue, grr){
    const sa=T/(3*cpkTrue);                                  /* the process itself */
    const sm=grr>0 ? grr*sa/Math.sqrt(1-grr*grr) : 0;        /* the gauge */
    const so=Math.sqrt(sa*sa+sm*sm);                         /* what you measure */
    const cpkObs=T/(3*so);
    const ppmTrue=(1-cdf(USL,0,sa)+cdf(LSL,0,sa))*1e6;
    const ppmObs =(1-cdf(USL,0,so)+cdf(LSL,0,so))*1e6;
    let fr=0, fa=0;
    const n=1200, lo=-6*sa, hi=6*sa, step=(hi-lo)/n;
    for(let i=0;i<n;i++){
      const x=lo+(i+0.5)*step, px=pdf(x,0,sa)*step;
      const inMeas = sm>0 ? (cdf(USL,x,sm)-cdf(LSL,x,sm)) : ((x>=LSL&&x<=USL)?1:0);
      if(x>=LSL && x<=USL) fr += px*(1-inMeas); else fa += px*inMeas;
    }
    return {sa,sm,so,cpkObs,ppmTrue,ppmObs,fr:fr*1e6,fa:fa*1e6,
            wider:(so/sa-1)*100};
  }

  function draw(r){
    const host=$('#gcPlot'); if(!host) return;
    const W=880,H=340,P={l:40,r:24,t:20,b:48};
    const iw=W-P.l-P.r, ih=H-P.t-P.b;
    /* the window is fixed by the spec, so a widening curve genuinely looks wider */
    const X0=-4.6, X1=4.6;
    const peak=pdf(0,0,r.sa);
    const sx=x=>P.l+(x-X0)/(X1-X0)*iw;
    const sy=y=>P.t+ih-(y/peak)*ih*0.92;
    let g='';
    g+='<rect x="'+P.l+'" y="'+P.t+'" width="'+(sx(LSL)-P.l).toFixed(1)+'" height="'+ih+
       '" fill="#C0392B" fill-opacity=".05"/>';
    g+='<rect x="'+sx(USL).toFixed(1)+'" y="'+P.t+'" width="'+(W-P.r-sx(USL)).toFixed(1)+
       '" height="'+ih+'" fill="#C0392B" fill-opacity=".05"/>';
    g+='<line x1="'+P.l+'" y1="'+(P.t+ih)+'" x2="'+(W-P.r)+'" y2="'+(P.t+ih)+'" stroke="#C6CDD3"/>';

    const pts=s=>{ const a=[];
      for(let i=0;i<=260;i++){ const x=X0+(X1-X0)*i/260;
        a.push([sx(x),sy(pdf(x,0,s))]); }
      return a; };
    const A=pts(r.sa), O=pts(r.so);
    const str=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');

    /* what the gauge added: the region between the two curves */
    if(r.sm>0){
      g+='<polygon points="'+str(O)+' '+str(A.slice().reverse())+
         '" fill="#C0392B" fill-opacity=".20"/>';
    }
    /* the process itself */
    g+='<polygon points="'+str(A)+' '+sx(X1).toFixed(1)+','+(P.t+ih)+' '+
       sx(X0).toFixed(1)+','+(P.t+ih)+'" fill="#0F3E68" fill-opacity=".16"/>';
    g+='<polyline points="'+str(A)+'" fill="none" stroke="#0F3E68" stroke-width="2.6"/>';
    g+='<polyline points="'+str(O)+'" fill="none" stroke="#C0392B" stroke-width="2.6"/>';

    [[LSL,'LSL'],[USL,'USL']].forEach(function(p){
      g+='<line x1="'+sx(p[0]).toFixed(1)+'" y1="'+(P.t-4)+'" x2="'+sx(p[0]).toFixed(1)+
         '" y2="'+(P.t+ih)+'" stroke="#9C7C1F" stroke-width="2"/>'+
         '<text x="'+sx(p[0]).toFixed(1)+'" y="'+(P.t-8)+'" text-anchor="middle" '+
         'style="font:700 10px var(--mono);letter-spacing:.09em;fill:#9C7C1F">'+p[1]+'</text>';
    });
    /* how far three sigma reaches, on each curve */
    const arr=(y,s,col,lbl)=>{
      const x1=sx(-3*s), x2=sx(3*s);
      return '<line x1="'+x1.toFixed(1)+'" y1="'+y+'" x2="'+x2.toFixed(1)+'" y2="'+y+
        '" stroke="'+col+'" stroke-width="1.6"/>'+
        '<line x1="'+x1.toFixed(1)+'" y1="'+(y-4)+'" x2="'+x1.toFixed(1)+'" y2="'+(y+4)+
        '" stroke="'+col+'" stroke-width="1.6"/>'+
        '<line x1="'+x2.toFixed(1)+'" y1="'+(y-4)+'" x2="'+x2.toFixed(1)+'" y2="'+(y+4)+
        '" stroke="'+col+'" stroke-width="1.6"/>'+
        '<text x="'+(x2+7).toFixed(1)+'" y="'+(y+3.5)+'" '+
        'style="font:700 9px var(--mono);fill:'+col+'">'+lbl+'</text>';
    };
    g+=arr(P.t+ih-14, r.so, '#C0392B', '\u00b13\u03c3 measured');
    g+=arr(P.t+ih-40, r.sa, '#0F3E68', '\u00b13\u03c3 actual');
    host.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" '+
      'style="width:100%;height:auto;display:block">'+g+'</svg>';
  }

  function fm(v){
    if(v>=1e5) return Math.round(v/1000)+'k';
    if(v>=100) return Math.round(v).toLocaleString();
    if(v>=1)   return v.toFixed(0);
    if(v>=0.01)return v.toFixed(2);
    return v<1e-4 ? '<0.001' : v.toFixed(3);
  }

  function update(){
    const cpkTrue=parseFloat(sCpk.value), grr=parseFloat(sGrr.value)/100;
    $('#gcCpkV').textContent=cpkTrue.toFixed(2);
    $('#gcGrrV').textContent=Math.round(grr*100)+'%';
    const r=calc(cpkTrue,grr);
    draw(r);

    /* the equation, with this setting's numbers in it */
    $('#gcEqn').innerHTML=
      '<span class="t">MEASURED VARIATION</span>'+
      '<span class="v ev-meas">'+r.so.toFixed(4)+'</span>'+
      '<span class="op">&sup2; =</span>'+
      '<span class="t">ACTUAL</span>'+
      '<span class="v ev-act">'+r.sa.toFixed(4)+'</span>'+
      '<span class="op">&sup2; +</span>'+
      '<span class="t">MEASUREMENT SYSTEM</span>'+
      '<span class="v ev-gage">'+r.sm.toFixed(4)+'</span>'+
      '<span class="op">&sup2;</span>';

    const lost=cpkTrue-r.cpkObs;
    $('#gcStats').innerHTML=
      '<div class="stat"><b>'+r.cpkObs.toFixed(3)+'</b><span>Cpk YOU WOULD REPORT</span>'+
        '<i>the process is really '+cpkTrue.toFixed(2)+'</i></div>'+
      '<div class="stat"><b>'+r.wider.toFixed(1)+'%</b><span>WIDER THAN THE PROCESS</span>'+
        '<i>the measured curve against the actual one</i></div>'+
      '<div class="stat"><b>'+fm(r.ppmObs)+'</b><span>ppm, AS MEASURED</span>'+
        '<i>truly '+fm(r.ppmTrue)+'</i></div>'+
      '<div class="stat"><b>'+fm(r.fr+r.fa)+'</b><span>WRONG CALLS PER MILLION</span>'+
        '<i>parts judged incorrectly</i></div>';

    const zone=$('#gcZone');
    if(zone) zone.innerHTML = grr===0
      ? 'A perfect gauge. The two curves sit exactly on top of each other, because there is nothing '
        + 'to add. Nothing real behaves like this.'
      : 'The red fill is what the gauge added. At '+Math.round(grr*100)+' percent it makes the '
        + 'measured curve <b>'+r.wider.toFixed(1)+' percent wider</b> than the process itself, and '
        + 'drops the Cpk you would report from '+cpkTrue.toFixed(2)+' to '+r.cpkObs.toFixed(2)+'.';

    const vd=$('#gcVerdict');
    const band = grr<0.10 ? 'good' : (grr<=0.30 ? 'warn' : 'bad');
    vd.className='verdict '+(band==='good'?'good':(band==='warn'?'':'bad'));
    vd.textContent = grr===0
      ? 'Everything you measure is the process.'
      : (band==='good'
        ? 'Under 10 percent. The gauge widens the curve by '+r.wider.toFixed(1)+' percent and '
          + 'costs '+((lost/cpkTrue)*100).toFixed(1)+' percent of your Cpk. Small enough to ignore.'
        : band==='warn'
          ? 'Between 10 and 30 percent, conditional rather than acceptable. The curve is '
            + r.wider.toFixed(1)+' percent wider than the process, you lose '
            + ((lost/cpkTrue)*100).toFixed(1)+' percent of your Cpk, and about '+fm(r.fr)
            + ' good parts per million are rejected for no reason.'
          : 'Over 30 percent. The curve is now '+r.wider.toFixed(1)+' percent wider than the '
            + 'process, '+((lost/cpkTrue)*100).toFixed(1)+' percent of your Cpk has gone to the '
            + 'gauge, and '+fm(r.fr)+' good parts per million are rejected. Improve the measurement '
            + 'system before you act on anything this data says about the process.');

    $('#gcMis').innerHTML='<table class="grid">'+
      '<tr><th>Wrong call</th><th>ppm</th><th>What it costs</th></tr>'+
      '<tr><td>Good part, measured out of spec</td><td>'+fm(r.fr)+'</td>'+
        '<td>scrap and rework on parts that were fine</td></tr>'+
      '<tr><td>Bad part, measured in spec</td><td>'+fm(r.fa)+'</td>'+
        '<td>an escape to the customer</td></tr>'+
      '<tr><td><b>Together</b></td><td><b>'+fm(r.fr+r.fa)+'</b></td>'+
        '<td>'+(r.fr>r.fa
          ? 'false rejects outnumber escapes '+(r.fa>0?(r.fr/r.fa).toFixed(1)+' to one':'entirely')
          : 'escapes dominate')+'</td></tr></table>';
  }
  sCpk.addEventListener('input',update);
  sGrr.addEventListener('input',update);
  update();
}


/* ── router ── */
