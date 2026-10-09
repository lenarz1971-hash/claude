const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ORDER=[...SS,...QQ];
const TOOLBYID=Object.fromEntries(TOOLS.map(t=>[t.id,t]));
let view='all', cur='yb';

function tags(list){ return '<div class="tags">'+ORDER.filter(k=>list.includes(k)).map(k=>'<span>'+esc(CODE[k])+'</span>').join('')+'</div>'; }
function rcard(href,key,title,desc,go){
  return '<a class="rescard" href="'+href+'"><div class="resthumb" aria-hidden="true">'+(THUMB[key]||'')+'</div>'+
    '<div class="resin"><h4>'+title+'</h4><p>'+desc+'</p><span class="go">'+go+' &rarr;</span></div></a>';
}
function toolCard(t){ return rcard(SITE+'/calculators/'+t.page+'.html',t.id,esc(t.name),esc(t.desc),'Open the calculator'); }
function simCard(s){ return rcard(SITE+'/sim/'+s.id+'.html',s.id,esc(s.name),esc(s.desc),'Start the case'); }
function plannedCard(p){
  return '<div class="card planned"><span class="badge plan">PLANNED</span><h4>'+esc(p.name)+'</h4><p>'+esc(p.desc)+'</p>'+
    '<span class="kind">'+esc(p.kind.toUpperCase())+' &middot; CSSYB '+esc(p.yb.join(', '))+'</span></div>';
}
const BUILT_LIST=PLANNED.filter(p=>BUILT[p.id]), NOT_BUILT=PLANNED.filter(p=>!BUILT[p.id]);
function slugCard(slug){ return rcard(SITE+'/tools/'+slug+'.html',slug,TPAGE[slug].name,TPAGE[slug].lede,'Open the tool'); }
const TOOL_SLUGS=[...BUILT_LIST.map(p=>BUILT[p.id]),...MQ_TOOLS];
const EVERYONE=[
  ['Quality Clinic','Stuck on a concept? Ask it, and see what others have asked.',SITE+'/#/clinic','ASK A QUESTION'],
  ['Trivia hour','Timed rounds against other candidates. Low stakes, fast recall.',SITE+'/#/hour','PLAY'],
  ['Study groups','Twelve weeks with a cohort sitting the same exam. First groups form in 2027.',SITE+'/study-groups.html','FIND OUT MORE']
];
function everyoneCards(){ return EVERYONE.map(e=>'<a class="card" href="'+e[2]+'"><h4>'+e[0]+'</h4><p>'+e[1]+'</p><span class="go">'+e[3]+' &rarr;</span></a>').join(''); }

/* ---------- ALL RESOURCES ---------- */
function renderAll(){
  $('#crumbCert').textContent='All resources';
  document.title='Study Resources: Calculators, Tools and Simulations | SC Quality Guild';
  const live=ORDER.filter(k=>BANK[k]).length;
  const groups=[
    ['calcs','Calculators',TOOLS.length,'Free, in the browser, and each one explains the method as well as giving the answer.',
      TOOLS.map(toolCard).join('')],
    ['sims','Simulations',SIMS.length,'Two 8D investigations. You make the calls, commit to a root cause, and find out afterwards whether you were right.',
      SIMS.map(simCard).join('')],
    ['tools','Tools and templates',TOOL_SLUGS.length,'Tools for improvement projects and for running a quality system, all working in your browser: fill them in, print them, or save them to a file.',
      TOOL_SLUGS.map(slugCard).join('')],
    ['planned','Planned: Yellow Belt build-out',NOT_BUILT.length,'Placeholders for the rest of the tools, templates and explainers that would cover every topic in the Yellow Belt Body of Knowledge. Not built yet.',
      NOT_BUILT.map(plannedCard).join('')]
  ];
  groups.splice(0,groups.length,...groups.filter(g=>g[2]>0));
  let h='<nav class="typenav" aria-label="Jump to">'+groups.map(g=>'<button type="button" data-jump="g-'+g[0]+'">'+esc(g[1].split(':')[0])+' ('+g[2]+')</button>').join('')+'</nav>';
  h+=groups.map(g=>'<div class="group" id="g-'+g[0]+'"><h2>'+esc(g[1])+' <span class="ct">'+g[2]+'</span></h2><p class="sub">'+g[3]+'</p><div class="resgrid">'+g[4]+'</div></div>').join('');
  $('#out').innerHTML=h;
  document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump).scrollIntoView({behavior:'smooth'}));
}

/* ---------- BY EXAM ---------- */
function renderExam(){
  const c=CERTDATA[cur], code=CODE[cur];
  $('#crumbCert').textContent=code;
  document.title=code+' Study Resources | SC Quality Guild';
  const tools=TOOLS.filter(t=>(MAP[t.id]||[]).includes(cur));
  const exTools=TOOL_SLUGS.filter(s=>(TOOL_EX[s]||[]).includes(cur));
  const book=BOOKS[cur];
  let n=0, h='';
  const step=(title,body)=>{n++; return '<div class="step"><div class="n">0'+n+'</div><div><h2>'+title+'</h2>'+body+'</div></div>';};

  h+='<div class="kithead"><div><span class="eyebrow">Your study kit</span><h2 style="font-size:clamp(24px,3.4vw,34px)">'+esc(c.name)+'</h2></div><div class="code">'+esc(code)+'</div></div>';
  h+='<div class="facts">'+c.facts.map(f=>'<div><b>'+esc(f[0])+'</b><span>'+esc(f[1])+'</span></div>').join('')+'</div>';
  h+='<div class="secs">'+c.secs.map(s=>'<span>'+esc(s.replace(/\s+\d+ QUESTIONS$/,''))+'</span>').join('')+'</div>';

  h+=step('The calculators this exam uses','<p class="sub">'+tools.length+' of the Guild&rsquo;s 12 free calculators cover topics in the '+esc(code)+' Body of Knowledge.</p><div class="resgrid">'+tools.map(toolCard).join('')+'</div>');

  if(exTools.length)
    h+=step('Tools and templates','<p class="sub">'+exTools.length+' of the Guild&rsquo;s '+TOOL_SLUGS.length+' tools and templates cover topics in the '+esc(code)+' Body of Knowledge. Fill them in, print them, or save them to a file.</p><div class="resgrid">'+exTools.map(slugCard).join('')+'</div>');

  if(SIM_FOR.includes(cur))
    h+=step('Practice the problem solving','<p class="sub">Two 8D investigations. You make the calls, commit to a root cause, and find out afterwards whether you were right.</p><div class="resgrid">'+SIMS.map(simCard).join('')+'</div>');

  if(cur==='yb') h+=step('Every topic in the Body of Knowledge',bokMap());

  h+=step('Go deeper with the primer', book
    ? '<p class="sub">Volume 1 works the Body of Knowledge section by section. Volume 2 is practice with worked solutions.</p><a class="btn" href="https://www.amazon.com/dp/'+book[0]+'">Volume 1 on Amazon</a><a class="btn" href="https://www.amazon.com/dp/'+book[1]+'">Volume 2 on Amazon</a><a class="btn ghost" href="'+SITE+'/primers/'+c.page+'">The exam, section by section</a>'
    : '<p class="sub">The '+esc(code)+' primer is still being written. Its page already breaks the exam down section by section.</p><a class="btn ghost" href="'+SITE+'/primers/'+c.page+'">The exam, section by section</a>');

  $('#out').innerHTML=h;
  matrix();
}

function liveFor(ref){
  const out=[];
  Object.entries(LIVE_YB).forEach(([id,refs])=>{
    if(!refs.includes(ref)) return;
    if(id==='sims') SIMS.forEach(s=>out.push('<a class="pill" href="'+SITE+'/sim/'+s.id+'.html">'+esc(s.name.split(' · ')[0])+' simulation</a>'));
    else out.push('<a class="pill" href="'+SITE+'/calculators/'+TOOLBYID[id].page+'.html">'+esc(TOOLBYID[id].name)+'</a>');
  });
  return out;
}
function bokMap(){
  let all=0, covered=0, h='';
  YB_BOK.forEach(sec=>{
    h+='<div class="sec"><div class="sech">'+sec.sec+'. '+esc(sec.title)+'<span>'+sec.q+' QUESTIONS &middot; '+sec.topics.length+' TOPICS</span></div>';
    sec.topics.forEach(([ref,name])=>{
      all++;
      const live=liveFor(ref), plan=PLANNED.filter(p=>p.yb.includes(ref)).map(p=>BUILT[p.id]?'<a class="pill" href="'+SITE+'/tools/'+BUILT[p.id]+'.html">'+esc(p.name)+'</a>':'<span class="pill" title="Planned, not built yet">'+esc(p.name)+'</span>');
      if(live.length||PLANNED.some(p=>p.yb.includes(ref)&&BUILT[p.id])) covered++;
      h+='<div class="row"><div class="ref">'+ref+'</div><div class="tn">'+esc(name)+'</div><div class="res">'+live.join('')+plan.join('')+'</div></div>';
    });
    h+='</div>';
  });
  return '<p class="sub">All '+all+' topics in the 2022 Yellow Belt Body of Knowledge, and what supports each one. '+covered+' of '+all+' topics have a live resource.</p>'+
    '<div class="legend"><span><a class="pill" href="#" tabindex="-1">Live</a> open it now</span><span><span class="pill">Planned</span> placeholder, not built yet</span></div>'+
    '<div class="bok">'+h+'</div>';
}

function matrix(){
  let t='<table><thead><tr><th>Resource</th>'+ORDER.map(k=>'<th class="'+(k===cur?'on':'')+'">'+esc(CODE[k])+'</th>').join('')+'</tr></thead><tbody>';
  const row=(name,list)=>'<tr><td>'+esc(name)+'</td>'+ORDER.map(k=>{const y=list.includes(k);return '<td class="'+(k===cur?'on ':'')+(y?'y':'')+'">'+(y?'&#10003;':'')+'</td>';}).join('')+'</tr>';
  TOOLS.forEach(x=>{t+=row(x.name,MAP[x.id]||[]);});
  t+=row('8D simulations',SIM_FOR);
  TOOL_SLUGS.forEach(s=>{t+=row(TPAGE[s].name.replace(/&amp;/g,'&'),TOOL_EX[s]||[]);});
  t+='</tbody></table>';
  $('#mx').innerHTML=t;
}

function render(){
  $('#vAll').setAttribute('aria-pressed',String(view==='all'));
  $('#vExam').setAttribute('aria-pressed',String(view==='exam'));
  $('#selWrap').hidden=view!=='exam';
  $('#matrix').hidden=view!=='exam';
  $('#examSel').value=cur;
  history.replaceState(null,'',view==='all'?'#all':'#'+cur);
  view==='all'?renderAll():renderExam();
}

/* dropdown */
(function(){
  const sel=$('#examSel');
  [['Six Sigma',SS],['Quality',QQ]].forEach(([lab,list])=>{
    const g=document.createElement('optgroup'); g.label=lab;
    list.forEach(k=>{const o=document.createElement('option'); o.value=k; o.textContent=CODE[k]+' — '+CERTDATA[k].name.replace(/\s*\([^)]*\)$/,''); g.appendChild(o);});
    sel.appendChild(g);
  });
  sel.onchange=()=>{cur=sel.value; render();};
  $('#vAll').onclick=()=>{view='all'; render();};
  $('#vExam').onclick=()=>{view='exam'; render(); sel.focus();};
  const h0=(location.hash||'').slice(1);
  if(CODE[h0]){cur=h0; view='exam';}
  render();
})();
