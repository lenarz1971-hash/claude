{
slug:'data-collection-plan',
sections:[
 {type:'fields',title:'Why you are collecting',hint:'Write down the question the data have to answer before anything else. Data collected without a question rarely answers one.',fields:[
  {id:'q',label:'Question the data must answer',type:'textarea',wide:true,ph:'e.g. Is the seal-nick rate different between shifts and between O-ring lots?'},
  {id:'owner',label:'Plan owner'},{id:'start',label:'Collection starts',type:'date'}]},
 {type:'grid',id:'plan',title:'The plan',rows:2,hint:'One row per measure. The <b>operational definition</b> is what makes two people record the same thing: exactly what counts, how it is measured, and what is excluded.',cols:[
  {id:'m',label:'Measure',w:140,type:'textarea',rows:1},
  {id:'type',label:'Data type',type:'select',opts:['Continuous (variable)','Discrete (count)','Attribute (pass/fail, category)']},
  {id:'def',label:'Operational definition',w:240,type:'textarea',rows:1},
  {id:'src',label:'Source, location',w:120,type:'textarea',rows:1},
  {id:'how',label:'How collected',w:120,type:'textarea',rows:1},
  {id:'n',label:'Sample size',w:80},
  {id:'freq',label:'Frequency',w:100},
  {id:'who',label:'Who',w:90},
  {id:'strat',label:'Stratify by',w:120,type:'textarea',rows:1,ph:'shift, lot, machine...'}]},
 {type:'custom',id:'chk',title:'Plan checks',html:'<div class="out dc-out"></div>'},
 {type:'custom',id:'cs',title:'Check sheet',hint:'Set the categories and the periods, then click a cell to add one. The totals can be pasted straight into the <a href=\"/calculators/pareto-chart.html\">Pareto builder</a>. Right-click, or long-press on a phone, to take one away. Print it to collect on paper instead.',
  html:'<div class="tf-grid printhide"><label class="tf"><span>Categories (one per line)</span><textarea rows="4" data-f="cats"></textarea></label><label class="tf"><span>Periods (one per line)</span><textarea rows="4" data-f="pers" placeholder="Mon&#10;Tue&#10;Wed"></textarea></label></div><div class="tgw"><table class="cs"></table></div><p class="noprint"><button type="button" class="tb ghost" id="cscopy">Copy totals for the Pareto builder</button> <button type="button" class="tb ghost" id="csclr">Zero the counts</button> <span class="tstamp cs-msg"></span></p>'}
],
blankX:function(){return {t:{}};},
update:function(root,api){
 var S=api.state(), f=[], rows=S.g.plan.filter(function(r){return r.m;});
 if(!S.f.q) f.push(['warn','No question written yet.']);
 rows.forEach(function(r){
  var nm='<b>'+api.esc(r.m)+'</b>';
  if(!r.def) f.push(['warn',nm+' has no operational definition.']);
  else if(r.def.length<25) f.push(['warn',nm+': the operational definition is very short. Would two people reading it record the same thing?']);
  if(!r.type) f.push(['warn',nm+': choose the data type; it decides which charts and tests can be used later.']);
  if(!r.n||!r.freq) f.push(['warn',nm+': sample size and frequency are both needed.']);
  if(!r.strat) f.push(['',nm+': nothing to stratify by. Recording shift, machine, lot or operator at the time costs little and is impossible to add afterwards.']);
  if(r.type&&r.type.indexOf('Attribute')===0) f.push(['',nm+' is attribute data. Attribute data need far larger samples than continuous data to show the same change; if it can be measured on a scale, consider measuring it.']);
 });
 if(rows.length&&f.every(function(x){return x[0]!=='warn';})) f.unshift(['ok','Every measure has a definition, a type, a sample size and a frequency.']);
 root.querySelector('.dc-out').innerHTML=rows.length||!S.f.q?f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join(''):'<p>Add a measure and the checks appear here.</p>';
 var L=function(k){return (S.f[k]||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);};
 var cats=L('cats'), pers=L('pers'), t=S.x.t||(S.x.t={});
 var tb=root.querySelector('table.cs');
 if(!cats.length||!pers.length){ tb.innerHTML='<tr><td class="th">Add at least one category and one period.</td></tr>'; return; }
 var tot=0, colT=pers.map(function(){return 0;});
 var h='<thead><tr><th>Category</th>'+pers.map(function(p){return '<th>'+api.esc(p)+'</th>';}).join('')+'<th>Total</th></tr></thead><tbody>';
 cats.forEach(function(c){ var rt=0; h+='<tr><td class="cn">'+api.esc(c)+'</td>'; pers.forEach(function(p,j){ var v=t[c+'|'+p]||0; rt+=v; colT[j]+=v; h+='<td><button type="button" class="tal" data-k="'+api.esc(c+'|'+p)+'" aria-label="'+api.esc(c)+', '+api.esc(p)+': '+v+'">'+(v?'<span class="marks">'+'卌'.repeat(Math.floor(v/5))+'|'.repeat(v%5)+'</span><b>'+v+'</b>':'')+'</button></td>'; }); tot+=rt; h+='<td class="tt">'+rt+'</td></tr>'; });
 h+='<tr class="ft"><td>Total</td>'+colT.map(function(v){return '<td class="tt">'+v+'</td>';}).join('')+'<td class="tt">'+tot+'</td></tr></tbody>';
 tb.innerHTML=h;
 function bump(k,d){ t[k]=Math.max(0,(t[k]||0)+d); api.save(); }
 tb.querySelectorAll('.tal').forEach(function(b){
  b.onclick=function(){bump(b.dataset.k,1);};
  b.oncontextmenu=function(e){e.preventDefault();bump(b.dataset.k,-1);};
  var tm; b.ontouchstart=function(){tm=setTimeout(function(){tm=null;bump(b.dataset.k,-1);},550);}; b.ontouchend=function(e){ if(tm){clearTimeout(tm);} else e.preventDefault(); };
 });
 root.querySelector('#cscopy').onclick=function(){
  var txt=cats.map(function(c){ var s=0; pers.forEach(function(p){s+=t[c+'|'+p]||0;}); return c+'\t'+s; }).join('\n');
  var msg=root.querySelector('.cs-msg');
  function fallback(){ var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); msg.textContent='Copied. Click the first cell of the Pareto builder and paste.';}catch(e){msg.textContent='Could not copy; select the table instead.';} ta.remove(); }
  if(navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){msg.textContent='Copied. Click the first cell of the Pareto builder and paste.';},fallback); else fallback();
 };
 root.querySelector('#csclr').onclick=function(){ S.x.t={}; api.save(); };
},
example:{f:{q:'Is the seal-nick rate different between shifts, and between O-ring lots?',owner:'Yellow Belt, second shift',start:'2026-08-03',
  cats:'Seal nicked\nSeal missing\nSeal twisted\nWrong seal\nOther',pers:'Mon\nTue\nWed\nThu\nFri'},
 g:{plan:[{m:'Seal defects at final test',type:'Attribute (pass/fail, category)',def:'Any assembly failing the 30 s leak test, then opened and classified by the defect categories on the check sheet. Assemblies failing for other reasons are recorded as Other.',src:'Final test station, line 3',how:'Check sheet at the station',n:'All',freq:'Every assembly, 2 weeks',who:'Test operator',strat:'Shift, O-ring lot number'},
  {m:'Installation force',type:'Continuous (variable)',def:'Peak force in newtons on the installation press, read from the press display for the cycle, to the nearest 1 N.',src:'Press P-3',how:'Recorded on the traveler',n:'5',freq:'Each hour',who:'Assembler',strat:'Shift, sleeve fitted yes/no'}]},
 x:{t:{'Seal nicked|Mon':6,'Seal nicked|Tue':4,'Seal nicked|Wed':7,'Seal nicked|Thu':5,'Seal nicked|Fri':6,'Seal missing|Tue':1,'Seal twisted|Mon':1,'Seal twisted|Thu':2,'Other|Wed':1,'Other|Fri':1}}}
}
