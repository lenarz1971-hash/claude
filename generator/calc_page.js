/* Calculator page wrapper: the same toolbar, autosave and file handling as the tools.
   window.CALC = {id, slug}. Runs after runtime.js has defined the calculator code. */
(function(){
'use strict';
var C=window.CALC, KEY='scqg-calc-'+C.slug, root=document.getElementById('tool'), panel=document.getElementById(C.id);
var runSel=(typeof RUN_BTN!=='undefined')&&RUN_BTN[C.id];

/* the panel's own example button is replaced by the toolbar's */
var exBtn=null;
panel.querySelectorAll('button').forEach(function(b){ if(/example/i.test(b.textContent)){ exBtn=b; b.classList.add('dupe'); } });

function fields(){ return [].slice.call(panel.querySelectorAll('input[id],select[id],textarea[id]')).filter(function(e){ return e.type!=='file'; }); }
function grids(){ var o={}; if(typeof GRIDS==='undefined') return o; Object.keys(GRIDS).forEach(function(k){ o[k]=GRIDS[k]; }); return o; }

/* the values the calculator starts with, before anything saved is restored */
var defaults={};

function capture(){
  var s={v:1, calc:C.slug, f:{}, g:{}};
  fields().forEach(function(e){ s.f[e.id]= e.type==='checkbox'? e.checked : e.value; });
  var g=grids(); Object.keys(g).forEach(function(k){ try{ s.g[k]=g[k].value; }catch(e){} });
  return s;
}
function fire(e){ e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); }
function rerun(){
  if(runSel){ var b=document.querySelector(runSel); if(b){ b.click(); return; } }
  fields().forEach(fire);
}
function apply(s){
  fields().forEach(function(e){ if(s.f && (e.id in s.f)){ if(e.type==='checkbox') e.checked=!!s.f[e.id]; else e.value=s.f[e.id]; } });
  var g=grids(); Object.keys(g).forEach(function(k){ if(s.g && (k in s.g)){ try{ g[k].value=s.g[k]; }catch(e){} } });
  fields().forEach(fire);
  rerun();
}
var timer=null;
function store(){ clearTimeout(timer); timer=setTimeout(function(){ try{ localStorage.setItem(KEY,JSON.stringify(capture())); stamp('Saved in this browser'); }catch(e){} },400); }
function stamp(t){ var st=root.querySelector('.tstamp'); if(st) st.textContent=t; }

/* toolbar, identical to the tools */
var bar=document.createElement('div'); bar.className='toolbar noprint';
bar.innerHTML='<button type="button" class="tb" data-act="example">Load the worked example</button>'+
  '<button type="button" class="tb" data-act="print">Print or save as PDF</button>'+
  '<button type="button" class="tb" data-act="download">Save to a file</button>'+
  '<label class="tb">Open a saved file<input type="file" accept=".json,application/json" data-act="open" hidden></label>'+
  '<button type="button" class="tb ghost" data-act="clear">Clear</button><span class="tstamp" aria-live="polite"></span>';
root.insertBefore(bar, root.firstChild);
/* a calculator with nothing to enter (the constants table, the test selector) only needs Print */
var nothingToSave = fields().length===0 && Object.keys(grids()).length===0;
if(nothingToSave) bar.querySelectorAll('[data-act]:not([data-act=print]), label.tb').forEach(function(x){ (x.closest('label')||x).style.display='none'; });

bar.addEventListener('click',function(e){
  var b=e.target.closest('button[data-act]'); if(!b) return;
  var a=b.dataset.act;
  if(a==='example'){ if(exBtn) exBtn.click(); else apply(defaults); store(); stamp('Worked example loaded'); }
  else if(a==='print') window.print();
  else if(a==='download'){
    var blob=new Blob([JSON.stringify(capture(),null,1)],{type:'application/json'}), l=document.createElement('a');
    l.href=URL.createObjectURL(blob); l.download=C.slug+'-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(l); l.click(); setTimeout(function(){ URL.revokeObjectURL(l.href); l.remove(); },500);
    stamp('Saved to your downloads. Use "Open a saved file" to bring it back.');
  }
  else if(a==='clear'){
    if(b.dataset.armed){
      var hasGrid=Object.keys(grids()).length>0, s={v:1,f:{},g:{}};
      fields().forEach(function(f){ s.f[f.id]= (hasGrid && (f.type==='number'||f.type==='text'||f.tagName==='TEXTAREA')) ? '' : defaults.f[f.id]; });
      Object.keys(grids()).forEach(function(k){ s.g[k]=''; });
      apply(s); store(); delete b.dataset.armed; b.textContent='Clear'; stamp('Cleared');
    } else { b.dataset.armed='1'; b.textContent='Click again to clear everything';
      setTimeout(function(){ if(b.isConnected){ delete b.dataset.armed; b.textContent='Clear'; } },4000); }
  }
});
bar.addEventListener('change',function(e){
  if(e.target.dataset.act!=='open' || !e.target.files[0]) return;
  var r=new FileReader(); r.onload=function(){
    try{ var s=JSON.parse(r.result); if(!s||s.calc!==C.slug) throw 0; apply(s); store(); stamp('Opened '+e.target.files[0].name); }
    catch(x){ stamp('That file is not a saved '+document.querySelector('h1').textContent+' file.'); }
    e.target.value='';
  }; r.readAsText(e.target.files[0]);
});

/* print: every field prints as text, the same way the tools do */
function syncPV(){
  panel.querySelectorAll('input,select,textarea').forEach(function(el){
    var t=el.type; if(t==='checkbox'||t==='radio'||t==='file'||t==='hidden') return;
    var pv=el.nextElementSibling; if(!pv||!pv.classList.contains('pv')){ pv=document.createElement('div'); pv.className='pv'; pv.setAttribute('aria-hidden','true'); el.insertAdjacentElement('afterend',pv); }
    var v=el.tagName==='SELECT'?(el.value?el.options[el.selectedIndex].text:''):el.value;
    pv.textContent=v; pv.classList.toggle('empty',!v);
  });
}
window.addEventListener('beforeprint',syncPV);
var mq=window.matchMedia&&window.matchMedia('print'); if(mq&&mq.addListener) mq.addListener(function(m){ if(m.matches) syncPV(); });

/* start: build the calculator, note its example values, then bring back saved work */
initTools();
if(runSel){ var rb=document.querySelector(runSel); if(rb) rb.dataset.ran='1'; }
defaults=capture();
try{ var saved=JSON.parse(localStorage.getItem(KEY)||'null'); if(saved&&saved.calc===C.slug){ apply(saved); stamp('Your last session, restored from this browser'); } }catch(e){}
panel.addEventListener('input',store); panel.addEventListener('change',store); panel.addEventListener('click',function(e){ if(e.target.closest('button')) store(); });
})();
