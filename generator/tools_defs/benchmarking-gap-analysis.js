{
slug:'benchmarking-gap-analysis',
g:function(r,api){
 var n=api.num, o=n(r.own), b=n(r.bm), t=n(r.tgt), low=r.dir==='Lower is better', hi=r.dir==='Higher is better', x={ok:false};
 if(!(low||hi)||!isFinite(o)||!isFinite(b)) return x;
 x.ok=true; x.low=low; x.gap=low?o-b:b-o;
 x.need=o!==0?100*x.gap/Math.abs(o):NaN;
 x.ach=low?(o!==0?100*b/o:NaN):(b!==0?100*o/b:NaN);
 x.close=isFinite(t)&&b!==o?100*(t-o)/(b-o):NaN;
 x.tach=isFinite(t)?(low?(t!==0?100*b/t:NaN):(b!==0?100*t/b:NaN)):NaN;
 return x;
},
sections:[
 {type:'fields',title:'The study',cols:3,hint:'Benchmark a process, not a company. Pick the partner for how well they do this process, which is often outside your industry.',fields:[
  {id:'subj',label:'Process benchmarked',wide:true,ph:'e.g. Order-to-ship for spare parts'},
  {id:'type',label:'Type of benchmarking',type:'select',opts:['Internal: another site or unit of your own organization','Competitive: a direct competitor','Functional: the same function in another industry','Generic: a best practice in any process','Collaborative: a group of organizations sharing data']},
  {id:'part',label:'Partner',ph:'e.g. Distributor in a benchmarking network'},
  {id:'team',label:'Team'},
  {id:'per',label:'Period of the data',ph:'e.g. Q2 2026, both sides'},
  {id:'comp',label:'Measure definitions agreed with the partner?',type:'select',opts:['Yes, same definitions and period','Partly','No, compared as published']}]},
 {type:'grid',id:'m',title:'Measures: own against the benchmark',rows:3,hint:'<b>Gap</b> is the benchmark&rsquo;s advantage in the measure&rsquo;s own units: positive means the partner is better. <b>Improve by</b> is the gap as a share of your current value. <b>Of benchmark</b> is your performance as a share of theirs. <b>Target closes</b> is the share of the gap your target would close.',cols:[
  {id:'id',label:'ID',w:46},
  {id:'mea',label:'Measure',w:200,type:'textarea',rows:1},
  {id:'unit',label:'Unit',w:70},
  {id:'dir',label:'Better is',type:'select',opts:['Higher is better','Lower is better']},
  {id:'own',label:'Own',type:'number'},
  {id:'bm',label:'Benchmark',type:'number'},
  {id:'gap',label:'Gap',calc:function(r,api){ var x=window.TOOL.g(r,api); return x.ok?api.fmt(x.gap,2):''; }},
  {id:'need',label:'Improve by',calc:function(r,api){ var x=window.TOOL.g(r,api); return x.ok&&isFinite(x.need)?api.fmt(x.need,1)+'%':''; }},
  {id:'ach',label:'Of benchmark',calc:function(r,api){ var x=window.TOOL.g(r,api); return x.ok&&isFinite(x.ach)?api.fmt(x.ach,1)+'%':''; }},
  {id:'tgt',label:'Our target',type:'number'},
  {id:'cl',label:'Target closes',calc:function(r,api){ var x=window.TOOL.g(r,api); return x.ok&&isFinite(x.close)?api.fmt(x.close,0)+'%':''; }}]},
 {type:'grid',id:'p',title:'Practices that explain the gap',rows:2,hint:'The numbers show how big the gap is; the practices show why. For each, say whether it transfers to your conditions as it is, needs adapting, or does not fit.',cols:[
  {id:'pr',label:'Partner practice',w:240,type:'textarea',rows:1},
  {id:'ms',label:'Measures it explains',w:80,ph:'M1, M2'},
  {id:'tr',label:'Transfer',type:'select',opts:['Adopt as is','Adapt','Not transferable']},
  {id:'ad',label:'How it would be adapted, or why not',w:240,type:'textarea',rows:1},
  {id:'en',label:'Enablers needed',w:160,type:'textarea',rows:1}]},
 {type:'grid',id:'a',title:'Adaptation plan',rows:2,cols:[
  {id:'act',label:'Action',w:260,type:'textarea',rows:1},
  {id:'ms',label:'Measures',w:80,ph:'M1'},
  {id:'who',label:'Owner',w:110},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Not started','In progress','Done']}]},
 {type:'custom',id:'res',title:'Gap chart and checks',hint:'Each bar is your performance as a percentage of the benchmark (100% = equal). The gold tick is your target. Bars past 100% are where you lead.',html:'<div class="stat bm-stat"></div><div class="svgw bm-svg"></div><div class="out bm-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), F=S.f, esc=api.esc, n=api.num, f=[];
 var ms=S.g.m.map(function(r,i){ return {r:r,id:(r.id||'').trim()||('M'+(i+1)),x:T.g(r,api)}; }).filter(function(o){ return o.r.mea||o.r.own||o.r.bm; });
 var ok=ms.filter(function(o){ return o.x.ok; }), behind=ok.filter(function(o){ return o.x.gap>0; }), ahead=ok.filter(function(o){ return o.x.gap<0; });
 var worst=behind.filter(function(o){ return isFinite(o.x.ach); }).sort(function(a,b){ return a.x.ach-b.x.ach; })[0];
 root.querySelector('.bm-stat').innerHTML='<div><b>'+ms.length+'</b><span>Measures</span></div><div><b>'+behind.length+'</b><span>Partner better</span></div><div><b>'+ahead.length+'</b><span>You lead</span></div><div><b>'+(worst?esc(worst.id)+' '+api.fmt(worst.x.ach,0)+'%':'—')+'</b><span>Largest gap (of benchmark)</span></div>';
 if(ok.length){
  var L=230, PW=400, RH=30, W=L+PW+70, H=30+ok.length*RH+26, MAX=Math.max(150,Math.min(300,Math.ceil(Math.max.apply(null,ok.map(function(o){ return isFinite(o.x.ach)?o.x.ach:0; }).concat(ok.map(function(o){ return isFinite(o.x.tach)?o.x.tach:0; })))/25)*25)), X=function(v){ return L+PW*Math.max(0,Math.min(v,MAX))/MAX; };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Performance as a percentage of the benchmark"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:700 10px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
  for(var k=0;k<=MAX;k+=25){ var x=X(k); g+='<line x1="'+x+'" x2="'+x+'" y1="22" y2="'+(H-22)+'" stroke="'+(k===100?'#16273A':'#E3E8EE')+'" stroke-width="'+(k===100?1.6:1)+'"/>'+(k%50===0?'<text class="ax" x="'+x+'" y="'+(H-8)+'" text-anchor="middle">'+k+'%</text>':''); }
  g+='<text class="ax" x="'+X(100)+'" y="14" text-anchor="middle">BENCHMARK</text>';
  ok.forEach(function(o,i){ var y=26+i*RH, a=o.x.ach, lab=o.id+'  '+(o.r.mea||''); lab=lab.length>36?lab.slice(0,35)+'…':lab;
   g+='<text x="'+(L-8)+'" y="'+(y+15)+'" text-anchor="end">'+esc(lab)+'</text>';
   if(isFinite(a)){ g+='<rect x="'+L+'" y="'+(y+4)+'" width="'+(X(a)-L)+'" height="'+(RH-12)+'" fill="'+(a>=100?'#2E7D4F':a<70?'#C0392B':'#0F3E68')+'"><title>'+esc(o.id)+': '+api.fmt(a,1)+'% of benchmark</title></rect><text class="v" x="'+(Math.max(X(a),isFinite(o.x.tach)?X(o.x.tach)+2:0)+5)+'" y="'+(y+15)+'">'+api.fmt(a,0)+'%'+(a>MAX?'+':'')+'</text>'; }
   if(isFinite(o.x.tach)) g+='<line x1="'+X(o.x.tach)+'" x2="'+X(o.x.tach)+'" y1="'+(y+1)+'" y2="'+(y+RH-5)+'" stroke="#D8B147" stroke-width="3"><title>Target: '+api.fmt(o.x.tach,1)+'% of benchmark</title></line>'; });
  root.querySelector('.bm-svg').innerHTML=g+'</svg>';
 } else root.querySelector('.bm-svg').innerHTML='';
 /* checks */
 ms.forEach(function(o){ var id='<b>'+esc(o.id)+'</b>', r=o.r, x=o.x;
  if(!r.dir) f.push(['warn',id+': choose whether higher or lower is better.']);
  else if(!isFinite(n(r.own))||!isFinite(n(r.bm))) f.push(['warn',id+' needs both your value and the benchmark.']);
  if(!r.unit&&r.mea) f.push(['',id+' has no unit. A gap is only meaningful when both sides measure the same thing the same way.']);
  if(!x.ok) return;
  if(n(r.own)===0) f.push(['',id+': your value is zero, so "improve by" cannot be expressed as a percentage.']);
  if(x.gap<0) f.push(['',id+': you lead the partner by '+api.fmt(-x.gap,2)+(r.unit==='%'?'':' ')+esc(r.unit||'')+'. Check the definitions match before claiming it; if they do, protect the practice that gets you there.']);
  var t=n(r.tgt);
  if(isFinite(t)&&x.gap>0){ var toward=x.low?t<n(r.own):t>n(r.own); if(!toward) f.push(['warn',id+': the target does not move toward the benchmark.']); else if(x.close>100) f.push(['',id+': the target goes past the benchmark ('+api.fmt(x.close,0)+'% of the gap). Ambitious; say what you will do that the partner does not.']); }
  if(x.gap>0&&!isFinite(t)) f.push(['',id+': no target set yet.']); });
 var dup={}; ms.forEach(function(o){ dup[o.id]=(dup[o.id]||0)+1; }); Object.keys(dup).forEach(function(k){ if(dup[k]>1) f.push(['warn','Measure ID '+esc(k)+' is used more than once.']); });
 function refs(s){ return String(s||'').toUpperCase().split(/[\s,;]+/).filter(Boolean); }
 var pr=S.g.p.filter(function(r){ return r.pr; }), ac=S.g.a.filter(function(r){ return r.act; });
 var explained={}; pr.forEach(function(r){ refs(r.ms).forEach(function(k){ explained[k]=1; }); });
 var unexpl=behind.filter(function(o){ return !explained[o.id.toUpperCase()]; });
 if(behind.length&&!pr.length) f.push(['warn','No practices are listed. Benchmarking is about learning how the partner gets the result, not only how big the gap is.']);
 else if(unexpl.length) f.push(['warn','No practice explains the gap in '+unexpl.map(function(o){ return '<b>'+esc(o.id)+'</b>'; }).join(', ')+'. Ask the partner how they achieve it before setting a target.']);
 var ids=ms.map(function(o){ return o.id.toUpperCase(); }); pr.forEach(function(r){ refs(r.ms).forEach(function(k){ if(ids.indexOf(k)<0) f.push(['warn','Practice "'+esc(r.pr.slice(0,40))+'" refers to '+esc(k)+', which is not a measure ID.']); }); });
 var planned={}; ac.forEach(function(r){ refs(r.ms).forEach(function(k){ planned[k]=1; }); });
 var usable=pr.filter(function(r){ return r.tr==='Adopt as is'||r.tr==='Adapt'; }), noPlan=usable.filter(function(r){ return !refs(r.ms).some(function(k){ return planned[k]; }); });
 if(noPlan.length) f.push(['warn',noPlan.length+' practice'+(noPlan.length===1?' is':'s are')+' marked to adopt or adapt with no action in the plan for '+(noPlan.length===1?'its':'their')+' measures.']);
 var noAd=pr.filter(function(r){ return r.tr==='Adapt'&&!r.ad; }); if(noAd.length) f.push(['warn',noAd.length+' practice'+(noAd.length===1?' is':'s are')+' marked "Adapt" without saying how.']);
 if(pr.length&&pr.every(function(r){ return r.tr==='Adopt as is'; })) f.push(['','Every practice is to be adopted as is. Practices rarely transfer unchanged; check each one against your volumes, products and people.']);
 var noOwn=ac.filter(function(r){ return !r.who||!r.due; }); if(noOwn.length) f.push(['warn',noOwn.length+' action'+(noOwn.length===1?' has':'s have')+' no owner or no due date.']);
 if(F.comp&&!/^Yes/.test(F.comp)) f.push(['warn','Definitions are not fully agreed with the partner. Differences in how a measure is defined or counted can create a gap that is not real; agree them before acting on the numbers.']);
 if(/^Competitive/.test(F.type||'')) f.push(['','Competitive benchmarking: follow a benchmarking code of conduct. Exchange only information you would be willing to receive, and never share prices, costs or plans that would raise antitrust concerns. Public sources and third parties are the usual route.']);
 if(worst) f.push(['','Largest gap: <b>'+esc(worst.id)+'</b> '+esc(worst.r.mea||'')+', at '+api.fmt(worst.x.ach,0)+'% of the benchmark. You would need to improve by '+api.fmt(worst.x.need,0)+'% to match it.']);
 root.querySelector('.bm-out').innerHTML=api.flags(f,'Enter your measures and the partner&rsquo;s, and the gaps appear here.');
},
example:{f:{subj:'Order-to-ship for spare parts orders',type:'Functional: the same function in another industry',part:'A specialty-parts distributor, through a benchmarking network (anonymous)',team:'Distribution manager, two warehouse leads, customer service lead, quality engineer',per:'April to June 2026, both sides',comp:'Yes, same definitions and period'},
 g:{m:[{id:'M1',mea:'Order-to-ship lead time',unit:'days',dir:'Lower is better',own:'6.5',bm:'1.5',tgt:'3'},
  {id:'M2',mea:'Order lines picked per labor hour',unit:'lines/h',dir:'Higher is better',own:'42',bm:'95',tgt:'70'},
  {id:'M3',mea:'Order accuracy (lines shipped correct)',unit:'%',dir:'Higher is better',own:'98.6',bm:'99.85',tgt:'99.5'},
  {id:'M4',mea:'Orders shipped complete first time',unit:'%',dir:'Higher is better',own:'91',bm:'97',tgt:'95'},
  {id:'M5',mea:'Inventory record accuracy (cycle count)',unit:'%',dir:'Higher is better',own:'99.2',bm:'98.5',tgt:'99.2'}],
 p:[{pr:'Orders released in waves every 30 minutes, not once a day',ms:'M1',tr:'Adapt',ad:'Release every 2 hours to start; our order volume is a third of theirs',en:'Change to the order release settings in the ERP'},
  {pr:'Fast movers slotted near the pack stations (velocity slotting), reviewed monthly',ms:'M2, M1',tr:'Adopt as is',ad:'',en:'Pick-frequency report; one weekend to re-slot'},
  {pr:'Scan-to-verify every line at pick and at pack',ms:'M3',tr:'Adapt',ad:'Scanning at pack only at first; handhelds for picking in year two',en:'Barcode labels on all bins; three scanners'},
  {pr:'Available-to-promise check at order entry, so short lines are known before release',ms:'M4',tr:'Not transferable',ad:'Our ERP version has no ATP; revisit at the upgrade',en:''}],
 a:[{act:'Re-slot the top 300 parts by pick frequency',ms:'M2, M1',who:'Warehouse lead',due:'2026-11-08',st:'In progress'},
  {act:'Pilot two-hour wave release on the day shift',ms:'M1',who:'Distribution manager',due:'2026-11-30',st:'Not started'},
  {act:'Label bins and add scan-to-verify at the pack stations',ms:'M3',who:'Quality engineer',due:'2026-12-15',st:'Not started'}]}}
}
