/* DataGrid: the spreadsheet input shared by the calculators and the tools.
   Copied from the app (index.html) by the tools build; keep the two identical. */
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
