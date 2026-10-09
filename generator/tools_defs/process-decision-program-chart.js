{
slug:'process-decision-program-chart',
sections:[
 {type:'fields',title:'The plan',cols:3,hint:'The objective is what the plan must achieve. The steps usually come from a tree diagram or a project plan; PDPC takes each one and asks what could go wrong.',fields:[
  {id:'goal',label:'Objective',wide:true,ph:'e.g. Move the KX-200 assembly cell to Building 2 without missing a shipment'},
  {id:'team',label:'Team',ph:'Names or roles'},
  {id:'date',label:'Date',type:'date'}]},
 {type:'custom',id:'key',title:'How to fill it in',hint:'Work one plan step at a time. For each, list what could go wrong, then a countermeasure for each problem. Mark each countermeasure <b>O</b> if it is practical (cost, time, people) or <b>X</b> if it is not. Leave <b>Plan step</b> or <b>What could go wrong</b> blank to carry on under the one above, as in an indented list.',html:'<div class="pillrow"><span>PLAN STEP</span><span>WHAT COULD GO WRONG</span><span>COUNTERMEASURE</span><span>O &middot; PRACTICAL, ADOPT</span><span>X &middot; IMPRACTICAL, REJECT</span></div>'},
 {type:'grid',id:'p',title:'Steps, problems and countermeasures',rows:5,cols:[
  {id:'s',label:'Plan step',w:170,type:'textarea',rows:1},
  {id:'r',label:'What could go wrong',w:190,type:'textarea',rows:1},
  {id:'c',label:'Countermeasure',w:200,type:'textarea',rows:1},
  {id:'ok',label:'O / X',type:'select',opts:['O practical','X impractical']},
  {id:'who',label:'Owner',w:100}]},
 {type:'custom',id:'tree',title:'The chart',hint:'Read left to right: objective, plan steps, what could go wrong, countermeasures. A red problem box has no practical countermeasure.',html:'<div class="svgw pd-svg"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="stat pd-stat"></div><div class="out pd-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=[], steps=[], curS=null, curR=null;
 S.g.p.forEach(function(row){ var s=(row.s||'').trim(), r=(row.r||'').trim(), c=(row.c||'').trim();
  if(!s&&!r&&!c) return;
  if(s){ curS={t:s,R:[]}; steps.push(curS); curR=null; }
  if(!curS){ curS={t:'(plan step not written)',R:[]}; steps.push(curS); }
  if(r){ curR={t:r,C:[]}; curS.R.push(curR); }
  if(c){ if(!curR){ curR={t:'(problem not written)',C:[]}; curS.R.push(curR); f.push(['warn','Countermeasure "'+api.esc(c)+'" has no problem above it under step "'+api.esc(curS.t)+'".']); }
   curR.C.push({t:c,ok:row.ok?row.ok.charAt(0):'',who:(row.who||'').trim()}); } });
 var host=root.querySelector('.pd-svg'), stat=root.querySelector('.pd-stat');
 var nR=0, nC=0, nO=0, nX=0, cov=0, open=[], allX=[], noMark=[], noOwn=[], noRisk=[];
 steps.forEach(function(s){ if(!s.R.length) noRisk.push(s.t); s.R.forEach(function(r){ nR++; var o=0; r.C.forEach(function(c){ nC++; if(c.ok==='O'){ nO++; o++; if(!c.who) noOwn.push(c.t); } else if(c.ok==='X') nX++; else noMark.push(c.t); });
  r.cov=o>0; if(o) cov++; else if(!r.C.length) open.push(r.t); else if(r.C.every(function(c){ return c.ok==='X'; })) allX.push(r.t); }); });
 stat.innerHTML='<div><b>'+steps.length+'</b><span>Plan steps</span></div><div><b>'+nR+'</b><span>Things that could go wrong</span></div><div><b>'+nC+'</b><span>Countermeasures ('+nO+' O, '+nX+' X)</span></div><div><b>'+cov+' of '+nR+'</b><span>Problems with a practical countermeasure</span></div>';
 if(!steps.length&&!(S.f.goal||'').trim()){ host.innerHTML=''; root.querySelector('.pd-out').innerHTML=api.flags(f,'Write the objective and the plan steps, then what could go wrong at each.'); return; }
 /* layout: one row per leaf */
 var BW=[150,160,170,180], X=[10,190,380,580], RH=56, BH=44, rows=0, g='', W=X[3]+BW[3]+10;
 function wrap(s,max,n){ var w=String(s).split(/\s+/).filter(Boolean), L=[], cur=''; w.forEach(function(x){ if((cur+' '+x).trim().length>max&&cur){ L.push(cur); cur=x; } else cur=(cur+' '+x).trim(); }); if(cur) L.push(cur); if(L.length>n){ L=L.slice(0,n); L[n-1]=L[n-1].slice(0,max-1)+'…'; } return L; }
 function box(col,y,t,fill,st,dash,mark){ var x=X[col], w=BW[col], L=wrap(t,col===3?26:col===0?22:24,col===0?6:3), bh=col===0?Math.max(BH,L.length*12+14):BH, s='<rect x="'+x+'" y="'+(y-bh/2)+'" width="'+w+'" height="'+bh+'" rx="'+(col===0?8:2)+'" fill="'+fill+'" stroke="'+st+'" stroke-width="1.4"'+(dash?' stroke-dasharray="4 3"':'')+'/>';
  L.forEach(function(l,k){ s+='<text x="'+(x+(mark?24:w/2))+'" y="'+(y+4+(k-(L.length-1)/2)*12)+'"'+(mark?'':' text-anchor="middle"')+(col===0?' class="g"':'')+'>'+api.esc(l)+'</text>'; });
  if(mark==='O') s+='<circle cx="'+(x+12)+'" cy="'+y+'" r="7" fill="none" stroke="#2E7D4F" stroke-width="2.4"/>';
  else if(mark==='X') s+='<path d="M'+(x+6)+' '+(y-6)+' l12 12 M'+(x+18)+' '+(y-6)+' l-12 12" stroke="#C0392B" stroke-width="2.4"/>';
  else if(mark==='?') s+='<text class="q" x="'+(x+12)+'" y="'+(y+4)+'" text-anchor="middle">?</text>';
  return s; }
 function link(c0,y0,c1,y1){ var xa=X[c0]+BW[c0], xb=X[c1], xm=xa+(xb-xa)/2; return '<path d="M'+xa+' '+y0+' H'+xm+' V'+y1+' H'+xb+'" fill="none" stroke="#4A5D71" stroke-width="1.2"/>'; }
 var y0=50, sy=[];
 steps.forEach(function(s){ var top=rows, rys=[];
  if(!s.R.length){ rows++; }
  s.R.forEach(function(r){ var rt=rows, cys=[];
   if(!r.C.length){ rows++; } r.C.forEach(function(c){ var y=y0+rows*RH; cys.push(y); g+=box(3,y,c.t,c.ok==='X'?'#F7F6F1':'#fff',c.ok==='X'?'#9AA6B1':'#0F3E68',c.ok==='X',c.ok||'?'); rows++; });
   var ry=y0+(rt+(rows-1))/2*RH; rys.push(ry); r.y=ry;
   g+=box(2,ry,r.t,r.cov?'#FBF5E3':'#FDECEA',r.cov?'#9C7C1F':'#C0392B',false);
   cys.forEach(function(y){ g+=link(2,ry,3,y); }); });
  var y=y0+(top+(rows-1))/2*RH; sy.push(y);
  g+=box(1,y,s.t,'#fff','#0F3E68',false); rys.forEach(function(ry){ g+=link(1,y,2,ry); }); });
 if(!rows) rows=1;
 var gy=y0+(rows-1)/2*RH;
 g+=box(0,gy,(S.f.goal||'').trim()||'(objective not written)','#0F3E68','#0F3E68',false); sy.forEach(function(y){ g+=link(0,gy,1,y); });
 var H=Math.max(y0+(rows-1)*RH+BH/2+12,gy+60), hd=['OBJECTIVE','PLAN STEPS','WHAT COULD GO WRONG','COUNTERMEASURES'].map(function(t,k){ return '<text class="h" x="'+(X[k]+BW[k]/2)+'" y="12" text-anchor="middle">'+t+'</text>'; }).join('');
 host.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Process decision program chart"><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.g{font:700 11px Archivo,sans-serif;fill:#fff}.h{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.08em}.q{font:700 12px \'IBM Plex Mono\',monospace;fill:#9C7C1F}</style>'+hd+g+'</svg>';
 /* checks */
 if(!(S.f.goal||'').trim()) f.push(['warn','Write the objective. Every step and countermeasure should serve it.']);
 if(noRisk.length) f.push(['warn','No problems listed for: '+noRisk.map(function(t){ return '<b>'+api.esc(t)+'</b>'; }).join(', ')+'. Ask what could go wrong at every step, even the routine ones; those are the ones nobody watches.']);
 if(open.length) f.push(['warn','No countermeasure yet for: '+open.map(function(t){ return '<b>'+api.esc(t)+'</b>'; }).join('; ')+'.']);
 if(allX.length) f.push(['warn','Every countermeasure is marked X (impractical) for: '+allX.map(function(t){ return '<b>'+api.esc(t)+'</b>'; }).join('; ')+'. The plan is exposed here. Find a practical response, change the plan step, or accept the risk as a decision someone signs.']);
 if(noMark.length) f.push(['warn',noMark.length+' countermeasure'+(noMark.length>1?'s have':' has')+' no O or X. Decide whether each is practical; that decision is the point of the chart.']);
 if(noOwn.length) f.push(['',noOwn.length+' practical countermeasure'+(noOwn.length>1?'s have':' has')+' no owner. An adopted countermeasure needs someone to put it in place: '+noOwn.slice(0,4).map(function(t){ return '"'+api.esc(t)+'"'; }).join(', ')+(noOwn.length>4?'&hellip;':'')+'.']);
 if(nR&&cov===nR&&!noMark.length) f.unshift(['ok','Every problem identified has at least one practical (O) countermeasure.']);
 if(nO) f.push(['','Build the '+nO+' adopted countermeasure'+(nO>1?'s':'')+' into the project plan, with dates, or the chart stays a list of good intentions. Review it at each milestone; new problems appear as the plan meets reality.']);
 root.querySelector('.pd-out').innerHTML=api.flags(f);
},
example:{f:{goal:'Move the KX-200 assembly cell to Building 2 without missing a shipment',team:'Cell lead, facilities engineer, planner, quality engineer, EHS coordinator',date:'2026-09-29'},
 g:{p:[
  {s:'Build two weeks of stock ahead of the move',r:'Not enough castings to build ahead',c:'Pull forward the castings order by three weeks',ok:'O practical',who:'Buyer'},
  {s:'',r:'',c:'Rent extra floor space for the stock',ok:'X impractical',who:''},
  {s:'',r:'Overtime not approved',c:'Get overtime approved at the next staff meeting',ok:'O practical',who:'Cell lead'},
  {s:'Move and reinstall the equipment',r:'Test bench damaged in transit',c:'Use the bench maker\'s rigging contractor',ok:'O practical',who:'Facilities'},
  {s:'',r:'',c:'Buy a second test bench as a spare',ok:'X impractical',who:''},
  {s:'',r:'Compressed air supply not ready in Building 2',c:'Hook-up checked and signed off a week before the move',ok:'O practical',who:'Facilities'},
  {s:'Requalify the cell',r:'First articles fail after the move',c:'Run a capability study on the critical bores before shipping',ok:'O practical',who:'Quality engineer'},
  {s:'',r:'Customer must approve the new location',c:'Submit the change notice now, with the move date',ok:'O practical',who:'Quality engineer'},
  {s:'Restart production',r:'Operators not familiar with the new layout',c:'',ok:'',who:''}]}}
}
