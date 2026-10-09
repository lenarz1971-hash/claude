/* SC Quality Guild tool engine. Runs in the browser; nothing is sent anywhere. */
(function(){
"use strict";
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

var T=window.TOOL, KEY='scqg-tool-'+T.slug, root=document.getElementById('tool');
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function blank(){
  var s={v:1,tool:T.slug,f:{},g:{},x:{}};
  T.sections.forEach(function(sec){ if(sec.type==='grid'){ s.g[sec.id]=[]; for(var i=0;i<(sec.rows||3);i++) s.g[sec.id].push({}); } });
  if(T.blankX) s.x=T.blankX();
  return s;
}
var S=blank();
function adopt(o){
  var b=blank();
  if(!o||o.tool!==T.slug) return false;
  b.f=o.f||{};
  Object.keys(b.g).forEach(function(k){ if(o.g&&Array.isArray(o.g[k])) b.g[k]=o.g[k]; });
  if(o.x) for(var k in o.x) b.x[k]=o.x[k];
  S.f=b.f; S.g=b.g; S.x=b.x; return true;
}
function store(){ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} var st=root.querySelector('.tstamp'); if(st) st.textContent='Saved in this browser'; }
function loadExample(){ var ex=JSON.parse(JSON.stringify(T.example)); ex.tool=T.slug; adopt(ex); }
function restore(){ var got=false; try{ var r=localStorage.getItem(KEY); if(r) got=adopt(JSON.parse(r)); }catch(e){} if(!got&&T.example) loadExample(); }

var api={state:function(){return S;}, save:function(){store();update();}, rerender:function(){render();}, esc:esc, num:num};
function num(v){ if(v===''||v==null) return NaN; return Number(String(v).replace(',','.')); }

function control(c,val,attrs){
  var a=attrs+' aria-label="'+esc(c.label)+'"';
  if(c.type==='datagrid') return '<div class="dgmount" data-dgf="'+c.id+'"></div>';
  if(c.type==='textarea') return '<textarea rows="'+(c.rows||2)+'" '+a+' placeholder="'+esc(c.ph||'')+'">'+esc(val)+'</textarea>';
  if(c.type==='select') return '<select '+a+'><option value=""></option>'+c.opts.map(function(o){return '<option'+(o===val?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>';
  var t=c.type==='number'?'number':(c.type==='date'?'date':'text');
  var extra=c.type==='number'?' inputmode="decimal"'+(c.min!=null?' min="'+c.min+'"':'')+(c.max!=null?' max="'+c.max+'"':''):'';
  return '<input type="'+t+'"'+extra+' value="'+esc(val)+'" '+a+' placeholder="'+esc(c.ph||'')+'">';
}

function secFields(sec){
  return '<div class="tf-grid'+(sec.cols?' c'+sec.cols:'')+'">'+sec.fields.map(function(f){
    var tag=f.type==='datagrid'?'div':'label';
    return '<'+tag+' class="tf'+(f.wide||(f.type==='datagrid'&&f.wide!==false)?' wide':'')+'"><span>'+esc(f.label)+'</span>'+control(f,S.f[f.id]||'','data-f="'+f.id+'"')+(f.hint?'<small>'+esc(f.hint)+'</small>':'')+'</'+tag+'>';
  }).join('')+'</div>';
}
function gridRows(sec){
  return S.g[sec.id].map(function(row,i){
    return '<tr><td class="rh">'+(i+1)+'</td>'+sec.cols.map(function(c){
      if(c.calc) return '<td class="calc" data-c="'+c.id+'"></td>';
      return '<td'+(c.w?' style="min-width:'+c.w+'px"':'')+'>'+control(c,row[c.id]||'','data-g="'+sec.id+'" data-r="'+i+'" data-col="'+c.id+'"')+'</td>';
    }).join('')+'<td class="del"><button type="button" class="x noprint" data-del="'+sec.id+'" data-r="'+i+'" aria-label="Delete row '+(i+1)+'">&times;</button></td></tr>';
  }).join('');
}
function secGrid(sec){
  return '<div class="dg-bar noprint"><button type="button" class="dg-btn" data-add="'+sec.id+'">+ row</button><button type="button" class="dg-btn" data-add5="'+sec.id+'">+ 5 rows</button><button type="button" class="dg-btn ghost" data-csv="'+sec.id+'">Download CSV</button><span class="dg-hint">Paste straight from a spreadsheet</span></div>'+
    '<div class="tgw dg-scroll"><table class="tg" data-grid="'+sec.id+'"><thead><tr><th class="rh"></th>'+sec.cols.map(function(c){return '<th'+(c.tip?' title="'+esc(c.tip)+'"':'')+'>'+esc(c.label)+'</th>';}).join('')+'<th class="del"></th></tr></thead><tbody>'+gridRows(sec)+'</tbody></table></div>';
}
function render(){
  var h='<div class="toolbar noprint"><button type="button" class="tb" data-act="example">Load the worked example</button>'+
    '<button type="button" class="tb" data-act="print">Print or save as PDF</button>'+
    '<button type="button" class="tb" data-act="download">Save to a file</button>'+
    '<label class="tb">Open a saved file<input type="file" accept=".json,application/json" data-act="open" hidden></label>'+
    '<button type="button" class="tb ghost" data-act="clear">Clear</button><span class="tstamp" aria-live="polite"></span></div>';
  T.sections.forEach(function(sec,i){
    h+='<section class="tsec'+(sec.cls?' '+sec.cls:'')+'" data-sec="'+i+'"><h3><span class="tn">'+(i+1)+'</span>'+esc(sec.title)+'</h3>'+(sec.hint?'<p class="th">'+sec.hint+'</p>':'');
    if(sec.type==='fields') h+=secFields(sec);
    else if(sec.type==='grid') h+=secGrid(sec);
    else if(sec.type==='custom') h+='<div class="tcustom" data-custom="'+sec.id+'">'+(sec.html||'')+'</div>';
    h+='</section>';
  });
  root.innerHTML=h;
  T.sections.forEach(function(sec){ if(sec.type==='custom'&&sec.init) sec.init(root.querySelector('[data-custom="'+sec.id+'"]'),api); });
  root.querySelectorAll('.tcustom [data-f]').forEach(function(el){ var v=S.f[el.dataset.f]; if(v!=null&&el.value!==v) el.value=v; });
  root.querySelectorAll('[data-dgf]').forEach(mountDG);
  root.querySelectorAll('textarea').forEach(grow);
  update();
}
function fieldDef(id){ var f=null; T.sections.forEach(function(sec){ (sec.fields||[]).forEach(function(x){ if(x.id===id) f=x; }); }); return f; }
function mountDG(host){
  var c=fieldDef(host.dataset.dgf), n=c.cols.length, txt=c.cols.some(function(x){return x.type==='text';}), sep=c.flat?/[,;\s]+/:(txt?/\t/:/[,;\t]+|\s+/);
  var g=DataGrid({mount:'[data-dgf="'+c.id+'"]', rows:c.rows||5, minRows:c.minRows||3, sep:sep,
    cols:c.cols.map(function(x){ return {label:x.label, type:x.type||'num', placeholder:x.ph||''}; }),
    rowLabel:c.flat?function(i){ return (i*n+1)+'\u2013'+(i*n+n); }:undefined,
    onChange:function(){ S.f[c.id]=c.flat?g.toFlat():g.toText(); store(); update(); }});
  var v=S.f[c.id]||'';
  if(c.flat) g.setFlat(String(v).split(/[\s,;]+/).filter(Boolean)); else g.setText(v, sep);
}
function grow(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; }
function update(){
  T.sections.forEach(function(sec){
    if(sec.type!=='grid') return;
    var calcs=sec.cols.filter(function(c){return c.calc;}); if(!calcs.length) return;
    var trs=root.querySelectorAll('table[data-grid="'+sec.id+'"] tbody tr');
    S.g[sec.id].forEach(function(row,i){ calcs.forEach(function(c){ var td=trs[i]&&trs[i].querySelector('[data-c="'+c.id+'"]'); if(td){ var r=c.calc(row,api); td.innerHTML=r==null?'':r; } }); });
  });
  if(T.update) T.update(root,api);
  syncPV();
}
function fmtDate(v){ var d=new Date(v+'T00:00:00'); return isNaN(d)?v:d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }
function syncPV(){
  root.querySelectorAll('input,select,textarea').forEach(function(el){
    var t=el.type; if(t==='checkbox'||t==='radio'||t==='file'||el.closest('.noprint')) return;
    var pv=el.nextElementSibling; if(!pv||!pv.classList.contains('pv')){ pv=document.createElement('div'); pv.className='pv'; pv.setAttribute('aria-hidden','true'); el.insertAdjacentElement('afterend',pv); }
    var v=el.tagName==='SELECT'?(el.value?el.options[el.selectedIndex].text:''):el.value, auto=false;
    if(!v&&el.classList.contains('autoval')&&el.placeholder){ v=el.placeholder; auto=true; }
    if(v&&t==='date') v=fmtDate(v); else if(auto&&/^\d{4}-\d\d-\d\d$/.test(v)) v=fmtDate(v);
    pv.textContent=v; pv.classList.toggle('auto',auto); pv.classList.toggle('empty',!v);
  });
}
root.addEventListener('input',function(e){
  var el=e.target;
  if(el.tagName==='TEXTAREA') grow(el);
  if(el.dataset.f){ S.f[el.dataset.f]=el.value; }
  else if(el.dataset.g){ S.g[el.dataset.g][+el.dataset.r][el.dataset.col]=el.value; }
  else return;
  store(); update();
});
root.addEventListener('change',function(e){
  var el=e.target;
  if(el.dataset.act==='open'&&el.files&&el.files[0]){
    var fr=new FileReader();
    fr.onload=function(){ var ok=false; try{ ok=adopt(JSON.parse(fr.result)); }catch(err){} if(ok){ store(); render(); } else alertBox('That file was not saved from this tool.'); };
    fr.readAsText(el.files[0]); el.value='';
  } else if(el.tagName==='SELECT'){ el.dispatchEvent(new Event('input',{bubbles:true})); }
});
function alertBox(msg){ var st=root.querySelector('.tstamp'); if(st) st.textContent=msg; }
function csvCell(v){ v=String(v==null?'':v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
function download(name,text,type){
  var b=new Blob([text],{type:type}); var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name;
  document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href); a.remove();},500);
}
function today(){ return new Date().toISOString().slice(0,10); }
api.download=download; api.today=today;
api.flags=function(f,empty){ return f.length?f.map(function(x){return '<span class="flag '+(x[0]||'')+'">'+x[1]+'</span>';}).join(''):'<p>'+(empty||'Fill in the tool and the checks appear here.')+'</p>'; };
api.lines=function(k){ return (S.f[k]||'').split('\n').map(function(x){return x.trim();}).filter(Boolean); };
api.fmt=function(v,d){ if(!isFinite(v)) return '—'; return Number(v).toLocaleString('en-US',{minimumFractionDigits:d==null?0:d,maximumFractionDigits:d==null?2:d}); };
root.addEventListener('click',function(e){
  var b=e.target.closest('button'); if(!b) return;
  if(b.dataset.add5){ for(var a5=0;a5<5;a5++) S.g[b.dataset.add5].push({}); store(); render(); }
  else if(b.dataset.add){ S.g[b.dataset.add].push({}); store(); render(); var t=root.querySelectorAll('table[data-grid="'+b.dataset.add+'"] tbody tr'); var last=t[t.length-1]; if(last){ var inp=last.querySelector('input,textarea,select'); if(inp) inp.focus(); } }
  else if(b.dataset.del){ S.g[b.dataset.del].splice(+b.dataset.r,1); if(!S.g[b.dataset.del].length) S.g[b.dataset.del].push({}); store(); render(); }
  else if(b.dataset.csv){
    var sec=T.sections.filter(function(s){return s.id===b.dataset.csv;})[0];
    var lines=[sec.cols.map(function(c){return csvCell(c.label);}).join(',')];
    S.g[sec.id].forEach(function(row){ lines.push(sec.cols.map(function(c){ var v=c.calc?String(c.calc(row,api)||'').replace(/<[^>]+>/g,''):row[c.id]; return csvCell(v); }).join(',')); });
    download(T.slug+'-'+sec.id+'-'+today()+'.csv','﻿'+lines.join('\r\n'),'text/csv');
  }
  else if(b.dataset.act==='print'){ window.print(); }
  else if(b.dataset.act==='download'){ download(T.slug+'-'+today()+'.json',JSON.stringify(S,null,1),'application/json'); alertBox('Saved to your downloads. Use "Open a saved file" to bring it back.'); }
  else if(b.dataset.act==='clear'){ if(b.dataset.armed){ var k=blank(); S.f=k.f; S.g=k.g; S.x=k.x; store(); render(); } else { b.dataset.armed='1'; b.textContent='Click again to clear everything'; setTimeout(function(){ if(b.isConnected){ delete b.dataset.armed; b.textContent='Clear'; } },4000); } }
  else if(b.dataset.act==='example'){ loadExample(); store(); render(); }
});

/* spreadsheet behaviour for the row tables: Enter or the arrow keys move between rows,
   Shift+Enter starts a new line inside a cell, and a paste from Excel fills the block */
function cellAt(gid,r,col){ return root.querySelector('[data-g="'+gid+'"][data-r="'+r+'"][data-col="'+col+'"]'); }
root.addEventListener('keydown',function(e){
  var el=e.target; if(!el.dataset||!el.dataset.g) return;
  var gid=el.dataset.g, r=+el.dataset.r, col=el.dataset.col, k=e.key;
  var down=(k==='Enter'&&!e.shiftKey&&!e.altKey)||(k==='ArrowDown'&&el.tagName==='INPUT');
  var up=(k==='ArrowUp'&&el.tagName==='INPUT');
  if(el.tagName==='SELECT'&&k!=='Enter') return;
  if(down){ e.preventDefault();
    if(r>=S.g[gid].length-1){ S.g[gid].push({}); store(); render(); }
    var n=cellAt(gid,r+1,col); if(n){ n.focus(); if(n.select) n.select(); } }
  else if(up&&r>0){ e.preventDefault(); var p=cellAt(gid,r-1,col); if(p){ p.focus(); if(p.select) p.select(); } }
});
root.addEventListener('paste',function(e){
  var el=e.target; if(!el.dataset||!el.dataset.g) return;
  var txt=(e.clipboardData||window.clipboardData).getData('text'); if(!txt||!/[\t\n]/.test(txt.replace(/\n$/,''))) return;
  e.preventDefault();
  var gid=el.dataset.g, sec=T.sections.filter(function(s){return s.id===gid;})[0];
  var cols=sec.cols.filter(function(c){return !c.calc;}), c0=cols.map(function(c){return c.id;}).indexOf(el.dataset.col), r0=+el.dataset.r;
  txt.replace(/\r/g,'').replace(/\n$/,'').split('\n').forEach(function(line,i){
    while(S.g[gid].length<=r0+i) S.g[gid].push({});
    line.split('\t').forEach(function(v,j){ var c=cols[c0+j]; if(c) S.g[gid][r0+i][c.id]=v.trim(); });
  });
  store(); render();
});
window.addEventListener('beforeprint',syncPV);
restore(); render();
})();
