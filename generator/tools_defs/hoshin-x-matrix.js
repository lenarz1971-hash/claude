{
slug:'hoshin-x-matrix',
sections:[
 {type:'fields',title:'Plan',cols:3,fields:[{id:'org',label:'Organization'},{id:'yr',label:'Plan year'},{id:'max',label:'Most priorities one person should lead',type:'number',min:1,max:10,ph:'2',hint:'Used to flag overloaded owners.'}]},
 {type:'grid',id:'b',title:'Breakthrough objectives (3 to 5 years)',rows:3,hint:'The few results that would change the organization\'s position. Written as an outcome, not an activity.',cols:[{id:'code',label:'Code',calc:function(r,api){return window.TOOL._code('b',r,api.state());}},{id:'n',label:'Breakthrough objective',w:380,type:'textarea',rows:1}]},
 {type:'grid',id:'a',title:'Annual objectives',rows:3,hint:'This year\'s step toward the breakthrough objectives.',cols:[{id:'code',label:'Code',calc:function(r,api){return window.TOOL._code('a',r,api.state());}},{id:'n',label:'Annual objective',w:380,type:'textarea',rows:1}]},
 {type:'grid',id:'p',title:'Top-level improvement priorities',rows:3,hint:'The projects and initiatives that will deliver the annual objectives.',cols:[{id:'code',label:'Code',calc:function(r,api){return window.TOOL._code('p',r,api.state());}},{id:'n',label:'Improvement priority',w:380,type:'textarea',rows:1}]},
 {type:'grid',id:'m',title:'Targets to improve (metrics)',rows:3,hint:'How progress on the priorities will be measured, with the target value.',cols:[{id:'code',label:'Code',calc:function(r,api){return window.TOOL._code('m',r,api.state());}},{id:'n',label:'Metric',w:260,type:'textarea',rows:1},{id:'t',label:'Target',w:150}]},
 {type:'grid',id:'r',title:'Resources and owners',rows:3,hint:'People or teams who lead or support the priorities.',cols:[{id:'code',label:'Code',calc:function(r,api){return window.TOOL._code('r',r,api.state());}},{id:'n',label:'Person or team',w:260}]},
 {type:'custom',id:'cx',title:'Correlations',hint:'Click a cell to cycle it: <b>●</b> strong, <b>○</b> weak, blank for none. In the resources table, ● means leads and ○ means supports. Each table is one corner of the X-matrix.',html:'<div class="hx-tabs"></div>'},
 {type:'custom',id:'xm',title:'X-matrix',hint:'Read it clockwise from the bottom: breakthrough objectives (south) drive annual objectives (west), which drive improvement priorities (north), which are measured by targets (east), which roll back up to the breakthrough objectives. Owners are on the right.',html:'<div class="svgw hx-svg"></div><div class="out hx-out"></div>'}
],
blankX:function(){return {c:{}};},
_P:{b:'B',a:'A',p:'P',m:'M',r:'R'},
_code:function(id,r,S){ if(!r.n) return ''; var i=S.g[id].filter(function(x){return x.n;}).indexOf(r); return i<0?'':window.TOOL._P[id]+(i+1); },
_M:[['BA','a','b','Which breakthrough objective does each annual objective serve?','SW corner'],['AP','p','a','Which annual objective does each priority deliver?','NW corner'],['PM','p','m','Which metric measures each priority?','NE corner'],['MB','m','b','Which breakthrough objective does each metric track?','SE corner'],['PR','p','r','Who leads (●) or supports (○) each priority?','right of NE']],
update:function(root,api){
 var S=api.state(), esc=api.esc, T=window.TOOL, c=S.x.c||(S.x.c={});
 var L={}; ['b','a','p','m','r'].forEach(function(k){ L[k]=S.g[k].filter(function(x){return x.n;}).map(function(x,i){return {code:T._P[k]+(i+1),n:String(x.n).trim(),t:x.t||''};}); });
 var key=function(m,ri,ci){return m+'|'+ri.n+'|'+ci.n;}, cut=function(s,n){return s.length>n?s.slice(0,n-1)+'…':s;};
 // correlation tables
 var host=root.querySelector('.hx-tabs'), sig=JSON.stringify(['b','a','p','m','r'].map(function(k){return L[k].map(function(x){return x.n;});}));
 if(host.dataset.sig!==sig){
  host.dataset.sig=sig;
  host.innerHTML=T._M.map(function(M){ var R=L[M[1]], C=L[M[2]];
   if(!R.length||!C.length) return '<div class="hx-t"><h4>'+M[3]+'</h4><p class="hx-e">Add items to both lists to fill this table.</p></div>';
   return '<div class="hx-t"><h4>'+M[3]+' <small>'+M[4]+'</small></h4><div class="tgw"><table class="hx"><thead><tr><th></th>'+C.map(function(x){return '<th title="'+esc(x.n)+'">'+x.code+'</th>';}).join('')+'</tr></thead><tbody>'+R.map(function(r){ return '<tr><td class="hx-r"><b>'+r.code+'</b> '+esc(cut(r.n,60))+'</td>'+C.map(function(x){ var k=key(M[0],r,x), v=c[k]; return '<td><button type="button" class="hx-c" data-xk="'+esc(k)+'" aria-label="'+esc(r.code+' with '+x.code)+'">'+(v==='S'?'●':v==='W'?'○':'')+'</button></td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div><p class="hx-k">'+C.map(function(x){return '<b>'+x.code+'</b> '+esc(cut(x.n,50));}).join(' · ')+'</p></div>';
  }).join('');
  host.onclick=function(e){ var b=e.target.closest('button[data-xk]'); if(!b) return; var k=b.dataset.xk, v=c[k], nv=v==='S'?'W':v==='W'?'':'S'; if(nv) c[k]=nv; else delete c[k]; b.textContent=nv==='S'?'●':nv==='W'?'○':''; api.save(); };
 }
 var get=function(m,r,x){return c[key(m,r,x)]||'';};
 var tot=L.b.length+L.a.length+L.p.length+L.m.length+L.r.length, svgEl=root.querySelector('.hx-svg');
 if(!tot){ svgEl.innerHTML=''; svgEl.style.display='none'; root.querySelector('.hx-out').innerHTML=api.flags([],'List the breakthrough objectives, annual objectives, priorities, metrics and owners, then mark the correlations.'); return; }
 svgEl.style.display='';
 // SVG
 var cs=30, C=340, pad=12, nA=L.a.length, nB=L.b.length, nP=L.p.length, nM=L.m.length, nR=L.r.length;
 var x0=pad, xL=x0+nA*cs, xR=xL+C, xRes=xR+nM*cs, W=xRes+nR*cs+pad, y0=pad, yT=y0+nP*cs, yB=yT+C, H=yB+nB*cs+44;
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Hoshin X-matrix"><style>text{font:14px Archivo,sans-serif;fill:#16273A}.cd{font-weight:700;fill:#0F3E68}.tl{font:700 13px Archivo,sans-serif;fill:#9C7C1F;letter-spacing:.03em}.lg{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
 var rect=function(x,y,w,h,fill){return w>0&&h>0?'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="#C6CDD3"/>':'';};
 var cells=function(x,y,nc,nr,fill){ var s=rect(x,y,nc*cs,nr*cs,fill); for(var i=1;i<nc;i++) s+='<line x1="'+(x+i*cs)+'" x2="'+(x+i*cs)+'" y1="'+y+'" y2="'+(y+nr*cs)+'" stroke="#DDE1E4"/>'; for(var j=1;j<nr;j++) s+='<line x1="'+x+'" x2="'+(x+nc*cs)+'" y1="'+(y+j*cs)+'" y2="'+(y+j*cs)+'" stroke="#DDE1E4"/>'; return s; };
 var dot=function(cx,cy,v){ return v==='S'?'<circle cx="'+cx+'" cy="'+cy+'" r="7.5" fill="#0F3E68"/>':v==='W'?'<circle cx="'+cx+'" cy="'+cy+'" r="6.5" fill="#fff" stroke="#0F3E68" stroke-width="2"/>':''; };
 // corners
 g+=cells(x0,y0,nA,nP,'#fff')+cells(xR,y0,nM,nP,'#fff')+cells(xRes,y0,nR,nP,'#FBF5E4')+cells(x0,yB,nA,nB,'#fff')+cells(xR,yB,nM,nB,'#fff');
 L.a.forEach(function(a,i){ L.p.forEach(function(p,j){ g+=dot(x0+i*cs+cs/2,y0+j*cs+cs/2,get('AP',p,a)); }); L.b.forEach(function(b,j){ g+=dot(x0+i*cs+cs/2,yB+j*cs+cs/2,get('BA',a,b)); }); });
 L.m.forEach(function(m,i){ L.p.forEach(function(p,j){ g+=dot(xR+i*cs+cs/2,y0+j*cs+cs/2,get('PM',p,m)); }); L.b.forEach(function(b,j){ g+=dot(xR+i*cs+cs/2,yB+j*cs+cs/2,get('MB',m,b)); }); });
 L.r.forEach(function(r,i){ L.p.forEach(function(p,j){ g+=dot(xRes+i*cs+cs/2,y0+j*cs+cs/2,get('PR',p,r)); }); });
 // arms: north and south rows, west and east columns
 var mx=Math.floor((C-16)/7.6);
 g+='<defs><clipPath id="hxv"><rect x="0" y="'+yT+'" width="'+W+'" height="'+C+'"/></clipPath><clipPath id="hxh"><rect x="'+xL+'" y="0" width="'+C+'" height="'+H+'"/></clipPath></defs>';
 g+=rect(xL,y0,C,nP*cs,'#EDEFEA')+rect(xL,yB,C,nB*cs,'#EDEFEA')+rect(x0,yT,nA*cs,C,'#EDEFEA')+rect(xR,yT,nM*cs,C,'#EDEFEA')+rect(xRes,yT,nR*cs,C,'#FBF5E4');
 L.p.forEach(function(p,j){ g+=(j?'<line x1="'+xL+'" x2="'+xR+'" y1="'+(y0+j*cs)+'" y2="'+(y0+j*cs)+'" stroke="#C6CDD3"/>':'')+'<text clip-path="url(#hxh)" x="'+(xL+8)+'" y="'+(y0+j*cs+20)+'"><tspan class="cd">'+p.code+'</tspan> '+esc(cut(p.n,mx-3))+'</text>'; });
 L.b.forEach(function(b,j){ g+=(j?'<line x1="'+xL+'" x2="'+xR+'" y1="'+(yB+j*cs)+'" y2="'+(yB+j*cs)+'" stroke="#C6CDD3"/>':'')+'<text clip-path="url(#hxh)" x="'+(xL+8)+'" y="'+(yB+j*cs+20)+'"><tspan class="cd">'+b.code+'</tspan> '+esc(cut(b.n,mx-3))+'</text>'; });
 var vcol=function(list,x,suffix){ var s=''; list.forEach(function(it,i){ var cx=x+i*cs, lab=it.n+(suffix&&it.t?' → '+it.t:''); s+=(i?'<line x1="'+cx+'" x2="'+cx+'" y1="'+yT+'" y2="'+yB+'" stroke="#C6CDD3"/>':'')+'<text transform="translate('+(cx+20)+' '+(yB-8)+') rotate(-90)"><tspan class="cd">'+it.code+'</tspan> '+esc(cut(lab,mx-3))+'</text>'; }); return s; };
 g+='<g clip-path="url(#hxv)">'+vcol(L.a,x0,false)+vcol(L.m,xR,true)+vcol(L.r,xRes,false)+'</g>';
 // centre X
 var cx=xL+C/2, cy=yT+C/2;
 g+='<rect x="'+xL+'" y="'+yT+'" width="'+C+'" height="'+C+'" fill="#fff" stroke="#0F3E68" stroke-width="1.5"/><line x1="'+xL+'" y1="'+yT+'" x2="'+xR+'" y2="'+yB+'" stroke="#0F3E68" stroke-width="1.5"/><line x1="'+xR+'" y1="'+yT+'" x2="'+xL+'" y2="'+yB+'" stroke="#0F3E68" stroke-width="1.5"/>';
 var tl=function(x,y,a,b){return '<text class="tl" x="'+x+'" y="'+y+'" text-anchor="middle">'+a+'</text><text class="tl" x="'+x+'" y="'+(y+16)+'" text-anchor="middle">'+b+'</text>';};
 g+=tl(cx,yT+46,'IMPROVEMENT','PRIORITIES')+tl(cx,yB-52,'BREAKTHROUGH','OBJECTIVES (3–5 YR)')+tl(xL+C*0.2,cy-6,'ANNUAL','OBJECTIVES')+tl(xR-C*0.2,cy-6,'TARGETS TO','IMPROVE');
 g+='<text class="lg" x="'+pad+'" y="'+(H-14)+'">● strong   ○ weak   ·   shaded right-hand block: ● leads, ○ supports</text>';
 svgEl.innerHTML=g+'</svg>';
 // flags
 var f=[], any=function(m,r,list,rowFirst){ return list.some(function(x){ return rowFirst?get(m,r,x):get(m,x,r); }); };
 f.push(['',L.b.length+' breakthrough objective'+(L.b.length===1?'':'s')+', '+L.a.length+' annual, '+L.p.length+' priorit'+(L.p.length===1?'y':'ies')+', '+L.m.length+' metric'+(L.m.length===1?'':'s')+', '+L.r.length+' owner'+(L.r.length===1?'':'s')+'.']);
 var nm=function(x){return '<b>'+x.code+'</b> '+esc(cut(x.n,70));};
 L.a.forEach(function(a){ if(L.b.length&&!any('BA',a,L.b,true)) f.push(['warn',nm(a)+' is not linked to any breakthrough objective. Either it supports one and the link is missing, or it belongs in daily management rather than the hoshin plan.']); });
 L.b.forEach(function(b){ if(L.a.length&&!L.a.some(function(a){return get('BA',a,b);})) f.push(['warn',nm(b)+' has no annual objective this year. Nothing moves it forward.']); });
 L.p.forEach(function(p){
  if(L.a.length&&!any('AP',p,L.a,true)) f.push(['warn',nm(p)+' does not deliver any annual objective.']);
  if(L.m.length&&!any('PM',p,L.m,true)||!L.m.length) f.push(['warn',nm(p)+' has no metric. Without one, the monthly review cannot tell whether it is working.']);
  var lead=L.r.filter(function(r){return get('PR',p,r)==='S';});
  if(!lead.length) f.push(['warn',nm(p)+' has no lead owner.']); else if(lead.length>1) f.push(['',nm(p)+' has '+lead.length+' leads. One accountable owner per priority is clearer.']);
 });
 L.m.forEach(function(m){ if(!m.t) f.push(['warn',nm(m)+' has no target value.']); if(L.p.length&&!L.p.some(function(p){return get('PM',p,m);})) f.push(['warn',nm(m)+' does not measure any priority.']); });
 var mxL=api.num(S.f.max); if(isNaN(mxL)||mxL<1) mxL=2;
 L.r.forEach(function(r){ var k=L.p.filter(function(p){return get('PR',p,r)==='S';}).length, s=L.p.filter(function(p){return get('PR',p,r)==='W';}).length;
  if(k>mxL) f.push(['warn',nm(r)+' leads '+k+' priorities (limit set at '+mxL+')'+(s?' and supports '+s:'')+'. Overloaded owners are where hoshin plans stall; rebalance or drop a priority.']);
  if(!k&&!s&&L.p.length) f.push(['',nm(r)+' has no role on any priority.']); });
 var emp=[['b','breakthrough objectives'],['a','annual objectives'],['p','improvement priorities'],['m','metrics'],['r','owners']].filter(function(k){return !L[k[0]].length;}).map(function(k){return k[1];});
 if(emp.length) f.push(['warn','Still empty: '+emp.join(', ')+'. The X-matrix needs all five lists before the links mean anything.']);
 if(f.length===1&&!emp.length) f.push(['ok','Every objective, priority and metric is linked, and every priority has a metric and a lead owner.']);
 f.push(['','Catchball: before the plan is fixed, pass it down a level and back. Each owner should confirm the targets are achievable with the resources shown, and the plan changes when they cannot.']);
 f.push(['','Review the X-matrix monthly against the metrics (Check), and adjust the priorities, not the breakthrough objectives, when results drift (Act).']);
 root.querySelector('.hx-out').innerHTML=api.flags(f);
},
example:{f:{org:'Kestrel Pump Works (industrial pumps, 650 employees)',yr:'2027',max:'2'},
 g:{b:[{n:'Cut the cost of poor quality from 4.2% to under 2% of sales by 2029'},{n:'Grow aftermarket service to 30% of revenue'},{n:'Become the on-time delivery leader in our segment (98% or better)'}],
  a:[{n:'Reduce internal scrap and rework cost by 25%'},{n:'Cut warranty claims per 1,000 units shipped by 20%'},{n:'Launch a field service contract offering in two regions'},{n:'Raise on-time delivery from 91% to 95%'},{n:'Complete ISO 14001 recertification'}],
  p:[{n:'Mistake-proof the top 10 assembly defect modes'},{n:'Supplier quality program for castings'},{n:'Build the field service team and contract terms'},{n:'Pull scheduling and daily production control in machining'},{n:'Root cause analysis training for all supervisors'}],
  m:[{n:'Scrap and rework cost',t:'≤ $1.875M (now $2.5M)'},{n:'Warranty claims per 1,000 units',t:'≤ 3.2 (now 4.0)'},{n:'Casting supplier PPM',t:'≤ 1,500 (now 4,800)'},{n:'Service contracts signed',t:'≥ 60'},{n:'On-time delivery',t:'≥ 95% (now 91%)'}],
  r:[{n:'VP operations'},{n:'Quality director'},{n:'Supply chain manager'},{n:'Service manager'},{n:'Plant manager'}]},
 x:{c:{
  'BA|Reduce internal scrap and rework cost by 25%|Cut the cost of poor quality from 4.2% to under 2% of sales by 2029':'S',
  'BA|Reduce internal scrap and rework cost by 25%|Become the on-time delivery leader in our segment (98% or better)':'W',
  'BA|Cut warranty claims per 1,000 units shipped by 20%|Cut the cost of poor quality from 4.2% to under 2% of sales by 2029':'S',
  'BA|Cut warranty claims per 1,000 units shipped by 20%|Grow aftermarket service to 30% of revenue':'W',
  'BA|Launch a field service contract offering in two regions|Grow aftermarket service to 30% of revenue':'S',
  'BA|Raise on-time delivery from 91% to 95%|Become the on-time delivery leader in our segment (98% or better)':'S',
  'AP|Mistake-proof the top 10 assembly defect modes|Reduce internal scrap and rework cost by 25%':'S',
  'AP|Mistake-proof the top 10 assembly defect modes|Cut warranty claims per 1,000 units shipped by 20%':'S',
  'AP|Supplier quality program for castings|Reduce internal scrap and rework cost by 25%':'S',
  'AP|Supplier quality program for castings|Cut warranty claims per 1,000 units shipped by 20%':'W',
  'AP|Supplier quality program for castings|Raise on-time delivery from 91% to 95%':'W',
  'AP|Build the field service team and contract terms|Launch a field service contract offering in two regions':'S',
  'AP|Pull scheduling and daily production control in machining|Raise on-time delivery from 91% to 95%':'S',
  'AP|Pull scheduling and daily production control in machining|Reduce internal scrap and rework cost by 25%':'W',
  'AP|Root cause analysis training for all supervisors|Reduce internal scrap and rework cost by 25%':'W',
  'AP|Root cause analysis training for all supervisors|Cut warranty claims per 1,000 units shipped by 20%':'W',
  'PM|Mistake-proof the top 10 assembly defect modes|Scrap and rework cost':'S',
  'PM|Mistake-proof the top 10 assembly defect modes|Warranty claims per 1,000 units':'S',
  'PM|Supplier quality program for castings|Casting supplier PPM':'S',
  'PM|Supplier quality program for castings|Scrap and rework cost':'W',
  'PM|Build the field service team and contract terms|Service contracts signed':'S',
  'PM|Pull scheduling and daily production control in machining|On-time delivery':'S',
  'MB|Scrap and rework cost|Cut the cost of poor quality from 4.2% to under 2% of sales by 2029':'S',
  'MB|Warranty claims per 1,000 units|Cut the cost of poor quality from 4.2% to under 2% of sales by 2029':'S',
  'MB|Warranty claims per 1,000 units|Grow aftermarket service to 30% of revenue':'W',
  'MB|Casting supplier PPM|Cut the cost of poor quality from 4.2% to under 2% of sales by 2029':'S',
  'MB|Casting supplier PPM|Become the on-time delivery leader in our segment (98% or better)':'W',
  'MB|Service contracts signed|Grow aftermarket service to 30% of revenue':'S',
  'MB|On-time delivery|Become the on-time delivery leader in our segment (98% or better)':'S',
  'PR|Mistake-proof the top 10 assembly defect modes|Quality director':'S',
  'PR|Mistake-proof the top 10 assembly defect modes|Plant manager':'W',
  'PR|Supplier quality program for castings|Quality director':'S',
  'PR|Supplier quality program for castings|Supply chain manager':'W',
  'PR|Build the field service team and contract terms|Service manager':'S',
  'PR|Build the field service team and contract terms|VP operations':'W',
  'PR|Pull scheduling and daily production control in machining|VP operations':'S',
  'PR|Pull scheduling and daily production control in machining|Plant manager':'W',
  'PR|Pull scheduling and daily production control in machining|Supply chain manager':'W',
  'PR|Root cause analysis training for all supervisors|Quality director':'S'}}}
}
