{
slug:'risk-register-heat-map',
sections:[
 {type:'fields',title:'Scope and risk criteria',cols:3,hint:'Agree the criteria before scoring. Likelihood and impact are each scored 1 to 5; the score is likelihood &times; impact, 1 to 25. The two thresholds turn a score into low, medium or high, and decide what has to be treated.',fields:[
  {id:'scope',label:'Scope',wide:true,ph:'e.g. Launch of the PX-40 pump at the new contract assembler'},
  {id:'owner',label:'Register owner'},
  {id:'date',label:'Last reviewed',type:'date'},
  {id:'freq',label:'Review frequency',ph:'e.g. Monthly, and at each gate'},
  {id:'med',label:'Medium from score',type:'number',min:1,max:25,ph:'5'},
  {id:'high',label:'High from score',type:'number',min:1,max:25,ph:'12'},
  {id:'acc',label:'Acceptance rule',type:'textarea',wide:true,ph:'e.g. Low risks may be accepted by the risk owner. Medium needs a treatment or the project sponsor\'s sign-off. High must be treated before launch.'}]},
 {type:'custom',id:'scale',title:'Scales used here',html:'<div class="pillrow"><span>L1 RARE</span><span>L2 UNLIKELY</span><span>L3 POSSIBLE</span><span>L4 LIKELY</span><span>L5 ALMOST CERTAIN</span></div><div class="pillrow"><span>I1 NEGLIGIBLE</span><span>I2 MINOR</span><span>I3 MODERATE</span><span>I4 MAJOR</span><span>I5 SEVERE: SAFETY, REGULATORY OR CUSTOMER-STOPPING</span></div>'},
 {type:'grid',id:'r',title:'Risk register',rows:3,hint:'Write each risk as cause, event and effect: <i>because of</i> &hellip; <i>there is a risk that</i> &hellip; <i>which would</i> &hellip;. Residual L and I are the scores expected once the actions are in place.',cols:[
  {id:'id',label:'ID',w:50},
  {id:'risk',label:'Risk (cause, event, effect)',w:240,type:'textarea',rows:2},
  {id:'cat',label:'Category',type:'select',opts:['Strategic','Operational','Supplier or supply chain','Project','Product or safety','Regulatory or compliance','Information or cyber','Financial']},
  {id:'l',label:'L',type:'number',min:1,max:5,tip:'Likelihood 1-5'},
  {id:'i',label:'I',type:'number',min:1,max:5,tip:'Impact 1-5'},
  {id:'sc',label:'Score',calc:function(r,api){var x=api.num(r.l)*api.num(r.i);return isNaN(x)?'':x;}},
  {id:'tr',label:'Treatment',type:'select',opts:['Avoid','Reduce (mitigate)','Transfer or share','Accept']},
  {id:'act',label:'Actions and controls',w:200,type:'textarea',rows:2},
  {id:'who',label:'Owner',w:100},
  {id:'rev',label:'Review by',type:'date'},
  {id:'l2',label:'Residual L',type:'number',min:1,max:5},
  {id:'i2',label:'Residual I',type:'number',min:1,max:5},
  {id:'sc2',label:'Residual',calc:function(r,api){var x=api.num(r.l2)*api.num(r.i2);return isNaN(x)?'':x;}},
  {id:'st',label:'Status',type:'select',opts:['Open','Actions under way','Closed']}]},
 {type:'custom',id:'hm',title:'Heat maps',hint:'Each risk ID sits in the cell for its likelihood and impact. Left: as found. Right: residual, after the planned actions.',html:'<div class="rr-maps"><div class="svgw rr-a"></div><div class="svgw rr-b"></div></div>'},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="stat rr-stat"></div><div class="out rr-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], med=n(S.f.med), high=n(S.f.high);
 if(isNaN(med)) med=5; if(isNaN(high)) high=12;
 if(high<=med) f.push(['warn','The high threshold should be above the medium one.']);
 function lvl(s){ return isNaN(s)?'':s>=high?'High':s>=med?'Medium':'Low'; }
 var rows=S.g.r.map(function(r,i){ return {r:r,i:i,id:(r.id||'').trim()||('row '+(i+1)),s:n(r.l)*n(r.i),s2:n(r.l2)*n(r.i2)}; }).filter(function(x){ return x.r.risk||x.r.id; });
 var trs=root.querySelectorAll('table[data-grid="r"] tbody tr');
 S.g.r.forEach(function(r,i){ var s=n(r.l)*n(r.i); if(trs[i]) trs[i].classList.toggle('hi-row', s>=high); });
 var bad=[]; rows.forEach(function(x){ ['l','i','l2','i2'].forEach(function(k){ var v=x.r[k]; if(v!==''&&v!=null&&!(/^[1-5]$/.test(String(v).trim()))) bad.push(x.id+' '+k.toUpperCase().replace('2',' residual')); }); });
 if(bad.length) f.push(['warn','Scores must be whole numbers 1 to 5. Check '+bad.map(api.esc).join(', ')+'.']);
 function map(key,title){
  var C=60, L=58, T=24, W=L+5*C+10, H=T+5*C+44, g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+title+'"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.t{font:800 12px Archivo,sans-serif;fill:#0F3E68}.id{font:700 10px \'IBM Plex Mono\',monospace;fill:#16273A}</style><text class="t" x="'+(L+2.5*C)+'" y="14" text-anchor="middle">'+title+'</text>';
  for(var li=5;li>=1;li--) for(var ii=1;ii<=5;ii++){ var s=li*ii, c=s>=high?'#E9A39B':s>=med?'#F3DC9B':'#BFE0C9', x=L+(ii-1)*C, y=T+(5-li)*C; g+='<rect x="'+x+'" y="'+y+'" width="'+C+'" height="'+C+'" fill="'+c+'" stroke="#fff" stroke-width="2"/>'; }
  for(var k=1;k<=5;k++){ g+='<text class="ax" x="'+(L-8)+'" y="'+(T+(5-k)*C+C/2+3)+'" text-anchor="end">L'+k+'</text><text class="ax" x="'+(L+(k-1)*C+C/2)+'" y="'+(T+5*C+14)+'" text-anchor="middle">I'+k+'</text>'; }
  g+='<text class="ax" x="'+(L+2.5*C)+'" y="'+(T+5*C+32)+'" text-anchor="middle">IMPACT &rarr;</text><text class="ax" transform="translate(12 '+(T+2.5*C)+') rotate(-90)" text-anchor="middle">LIKELIHOOD &rarr;</text>';
  var cell={}; rows.forEach(function(x){ var l=n(x.r[key==='a'?'l':'l2']), i=n(x.r[key==='a'?'i':'i2']); if(l>=1&&l<=5&&i>=1&&i<=5&&l%1===0&&i%1===0) (cell[l+','+i]=cell[l+','+i]||[]).push(x.id); });
  Object.keys(cell).forEach(function(k){ var p=k.split(','), l=+p[0], i=+p[1], list=cell[k], x=L+(i-1)*C, y=T+(5-l)*C;
   var shown=list.slice(0,4); shown.forEach(function(id,j){ g+='<text class="id" x="'+(x+C/2)+'" y="'+(y+14+j*12)+'" text-anchor="middle">'+api.esc(id.length>7?id.slice(0,6)+'…':id)+'</text>'; });
   if(list.length>4) g+='<text class="id" x="'+(x+C/2)+'" y="'+(y+C-4)+'" text-anchor="middle">+'+(list.length-4)+'</text>'; });
  return g+'</svg>'; }
 root.querySelector('.rr-a').innerHTML=map('a','AS FOUND');
 root.querySelector('.rr-b').innerHTML=map('b','RESIDUAL');
 var cnt={High:0,Medium:0,Low:0}, cnt2={High:0,Medium:0,Low:0}; rows.forEach(function(x){ var a=lvl(x.s), b=lvl(x.s2); if(a) cnt[a]++; if(b) cnt2[b]++; });
 root.querySelector('.rr-stat').innerHTML='<div><b>'+rows.length+'</b><span>Risks</span></div><div><b>'+cnt.High+' &rarr; '+cnt2.High+'</b><span>High, as found &rarr; residual</span></div><div><b>'+cnt.Medium+' &rarr; '+cnt2.Medium+'</b><span>Medium</span></div><div><b>'+cnt.Low+' &rarr; '+cnt2.Low+'</b><span>Low</span></div>';
 var today=new Date().toISOString().slice(0,10);
 rows.forEach(function(x){ var r=x.r, id='<b>'+api.esc(x.id)+'</b>', L=lvl(x.s), L2=lvl(x.s2);
  if(isNaN(x.s)) { f.push(['warn',id+' is not scored yet.']); return; }
  if(L==='High'&&r.tr==='Accept') f.push(['warn',id+' is high (score '+x.s+') and marked Accept. Check the acceptance rule allows that, and record who accepted it.']);
  if(L!=='Low'&&!r.tr) f.push(['warn',id+' is '+L.toLowerCase()+' (score '+x.s+') and has no treatment.']);
  if(r.tr&&r.tr!=='Accept'&&!r.act) f.push(['warn',id+': treatment is "'+api.esc(r.tr)+'" but no actions are written.']);
  if(!r.who&&r.st!=='Closed') f.push(['warn',id+' has no owner. A risk without an owner is not being managed.']);
  if(r.rev&&r.rev<today&&r.st!=='Closed') f.push(['warn',id+': review date '+api.esc(r.rev)+' has passed.']);
  if(n(r.i)===5) f.push(['',id+' has the highest impact. Keep it on the watch list even when its likelihood is low; likelihood estimates for rare events are the least reliable.']);
  if(!isNaN(x.s2)){ if(x.s2>x.s) f.push(['warn',id+': residual score '+x.s2+' is higher than '+x.s+'. Check the scores.']);
   else if(L2==='High') f.push(['warn',id+' is still high after the planned actions (residual '+x.s2+'). It needs a stronger treatment or a decision at the right level.']);
   if(r.tr==='Transfer or share'&&n(r.i2)<n(r.i)) f.push(['',id+': transferring a risk usually moves who pays, not the impact on your customer. Check the residual impact.']); }
  else if(r.tr&&r.tr!=='Accept') f.push(['',id+': add residual scores to show what the actions are expected to achieve.']); });
 root.querySelector('.rr-out').innerHTML=api.flags(f,'Add risks and score them, and the checks appear here.');
},
example:{f:{scope:'Launch of the PX-40 pump, assembled by a new contract manufacturer',owner:'Supplier quality engineer',date:'2026-09-30',freq:'Every two weeks until launch, then monthly',med:'5',high:'12',acc:'Low risks may be accepted by the risk owner. Medium needs a treatment or the sponsor\'s sign-off. High must be treated before launch.'},
 g:{r:[
  {id:'R1',risk:'Because the contract assembler has no leak-test experience, there is a risk that leaking units ship, which would cause field failures and returns.',cat:'Product or safety',l:'4',i:'4',tr:'Reduce (mitigate)',act:'Leak tester qualified by our engineer; operator certification; 100% test results sent daily for the first 90 days',who:'SQE',rev:'2026-10-31',l2:'2',i2:'4',st:'Actions under way'},
  {id:'R2',risk:'Because the seal comes from a single source, there is a risk of a supply interruption, which would stop the line.',cat:'Supplier or supply chain',l:'3',i:'5',tr:'Reduce (mitigate)',act:'Qualify a second seal source; hold 6 weeks of safety stock',who:'Purchasing',rev:'2026-12-15',l2:'2',i2:'5',st:'Open'},
  {id:'R3',risk:'Because the launch date is fixed, there is a risk that PPAP is not approved in time, which would delay the launch.',cat:'Project',l:'3',i:'3',tr:'Reduce (mitigate)',act:'Weekly PPAP status review; start capability runs early',who:'Project manager',rev:'2026-10-15',l2:'2',i2:'3',st:'Actions under way'},
  {id:'R4',risk:'Because the price is quoted in another currency, there is a risk the landed cost rises, which would cut the margin.',cat:'Financial',l:'3',i:'2',tr:'Transfer or share',act:'Fixed-price clause for 12 months',who:'Finance',rev:'2027-01-31',l2:'1',i2:'2',st:'Closed'},
  {id:'R5',risk:'Because the shipping labels are printed by the assembler, there is a risk of a label mix-up, which would breach the labeling requirements.',cat:'Regulatory or compliance',l:'2',i:'4',tr:'Accept',act:'',who:'',rev:'',l2:'',i2:'',st:'Open'}]}}
}
