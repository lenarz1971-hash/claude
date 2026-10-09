{
slug:'supplier-classification-lifecycle',
h:{
 K:['Disqualified','Non-approved','Conditional','Approved','Preferred','Certified','Partnership'],
 rules:function(S,api){ var n=api.num, g=function(k,d){var v=n(S.f[k]);return isNaN(v)?d:v;};
  return {tC:g('tc',55),tA:g('ta',70),tP:g('tp',85),nP:g('np',2),nC:g('nc',4),ppm:g('ppm',500),age:g('age',12),cert:S.f.creq||'Yes'}; },
 /* returns {k: eligible class index, why: [[cap index, reason]]} */
 judge:function(r,R,api,today){
  var n=api.num, sc=n(r.sc), np=n(r.np), ppm=n(r.ppm), scar=n(r.scar), aud=r.aud||'Not audited', cert=r.cert||'None', why=[];
  function cap(k,t){ why.push([k,t]); }
  if(isNaN(sc)&&aud==='Not audited') cap(1,'not assessed yet: no audit and no performance score');
  if(aud==='Fail') cap(0,'failed the last audit');
  else if(aud==='Major findings open') cap(2,'major audit findings still open');
  else if(aud==='Not audited') cap(2,'no audit on record');
  if(isNaN(sc)) cap(3,'no performance score yet');
  else if(sc<R.tC) cap(0,'score '+sc+' is below '+R.tC);
  else if(sc<R.tA) cap(2,'score '+sc+' is below '+R.tA);
  else if(sc<R.tP) cap(3,'score '+sc+' is below '+R.tP);
  if(cert==='Expired or suspended') cap(2,'certificate expired or suspended');
  else if(cert==='None'&&R.cert==='Yes') cap(2,'no QMS certificate, which approval requires');
  if(scar>0) cap(3,scar+' open SCAR'+(scar>1?'s':''));
  if(isNaN(np)||np<R.nP) cap(3,(isNaN(np)?0:np)+' period'+(np===1?'':'s')+' at the preferred level; '+R.nP+' needed');
  else if(np<R.nC) cap(4,np+' periods at the preferred level; '+R.nC+' needed for certified');
  if(cert!=='Valid') cap(4,'certified status needs a valid certificate');
  if(isNaN(ppm)) cap(4,'no PPM figure; certified needs '+R.ppm+' or less');
  else if(ppm>R.ppm) cap(4,'PPM '+ppm+' is above '+R.ppm);
  if(!r.ad) cap(4,'no audit date; certified needs an audit within '+R.age+' months');
  else { var days=(new Date(today+'T00:00:00')-new Date(r.ad+'T00:00:00'))/864e5; if(days>R.age*365.25/12) cap(4,'last audit is more than '+R.age+' months old'); }
  if(r.part!=='Yes') cap(5,'no partnership agreement');
  var k=6; why.forEach(function(w){ if(w[0]<k) k=w[0]; });
  return {k:k,why:why.filter(function(w){return w[0]===k;}).map(function(w){return w[1];})};
 }
},
sections:[
 {type:'fields',title:'Classification rules',cols:3,hint:'Write the rules down before you apply them, so every supplier is classified the same way. The tool applies them in order: a supplier rises to the highest class whose every condition it meets. Scores come from your <a href="/tools/supplier-scorecard.html">supplier scorecard</a>.',fields:[
  {id:'org',label:'Organization and scope',wide:true,ph:'e.g. Purchased components, all plants'},
  {id:'per',label:'Review period',ph:'e.g. Q3 2026'},
  {id:'tc',label:'Conditional: score at or above',type:'number',min:0,max:100,ph:'55'},
  {id:'ta',label:'Approved: score at or above',type:'number',min:0,max:100,ph:'70'},
  {id:'tp',label:'Preferred: score at or above',type:'number',min:0,max:100,ph:'85'},
  {id:'np',label:'Preferred: periods in a row at that score',type:'number',min:0,ph:'2'},
  {id:'nc',label:'Certified: periods in a row at the preferred score',type:'number',min:0,ph:'4'},
  {id:'ppm',label:'Certified: PPM at or below',type:'number',min:0,ph:'500'},
  {id:'age',label:'Certified: audit within, months',type:'number',min:0,ph:'12'},
  {id:'creq',label:'Approved needs a QMS certificate',type:'select',opts:['Yes','No']}]},
 {type:'custom',id:'key',title:'The classes',html:'<div class="pillrow"><span>NON-APPROVED: NOT YET ASSESSED</span><span>CONDITIONAL: MAY SUPPLY UNDER LIMITS, WITH A PLAN</span><span>APPROVED: MEETS REQUIREMENTS</span><span>PREFERRED: SUSTAINED HIGH PERFORMANCE, FIRST CALL FOR NEW WORK</span><span>CERTIFIED: SHIP-TO-STOCK, REDUCED INSPECTION</span><span>PARTNERSHIP: CERTIFIED, PLUS A LONG-TERM AGREEMENT</span><span>DISQUALIFIED: NO NEW ORDERS, EXIT</span></div>'},
 {type:'grid',id:'p',title:'Suppliers',rows:3,hint:'"Periods" counts consecutive review periods at or above the preferred score, up to and including this one. The last two columns show the class the rules allow and what to do.',cols:[
  {id:'sup',label:'Supplier',w:170,type:'textarea',rows:1},
  {id:'com',label:'Commodity',w:140,type:'textarea',rows:1},
  {id:'cur',label:'Current class',type:'select',opts:['Non-approved','Conditional','Approved','Preferred','Certified','Partnership','Disqualified']},
  {id:'sc',label:'Score',type:'number',min:0,max:100},
  {id:'np',label:'Periods',type:'number',min:0,tip:'Consecutive periods at or above the preferred score'},
  {id:'ppm',label:'PPM',type:'number',min:0},
  {id:'scar',label:'Open SCARs',type:'number',min:0},
  {id:'aud',label:'Last audit',type:'select',opts:['Pass','Pass with minor findings','Major findings open','Fail','Not audited']},
  {id:'ad',label:'Audit date',type:'date'},
  {id:'cert',label:'QMS certificate',type:'select',opts:['Valid','Expired or suspended','None']},
  {id:'part',label:'Partnership agreement',type:'select',opts:['Yes','No']},
  {id:'el',label:'Rules allow',calc:function(r,api){ if(!r.sup) return ''; var H=window.TOOL.h; return H.K[H.judge(r,H.rules(api.state(),api),api,api.today()).k]; }},
  {id:'mv',label:'Action',calc:function(r,api){ if(!r.sup) return ''; var H=window.TOOL.h, k=H.judge(r,H.rules(api.state(),api),api,api.today()).k, c=H.K.indexOf(r.cur||'');
   if(c<0) return 'Set to '+H.K[k]; if(k===c) return 'Hold';
   if(c===0) return k>=2?'Requalify':'Hold'; if(c===1&&k===0) return 'Do not approve';
   if(k===0) return 'Disqualify'; return (k>c?'Promote to ':'Demote to ')+H.K[k]; }}]},
 {type:'custom',id:'res',title:'Classification summary and flow',html:'<div class="stat cl-stat"></div><div class="tgw"><table class="mv cl-res"></table></div><div class="svgw cl-flow"></div><div class="out cl-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), R=H.rules(S,api), esc=api.esc, f=[], today=api.today();
 var P=S.g.p.filter(function(r){return r.sup;});
 var res=P.map(function(r){ var j=H.judge(r,R,api,today); return {r:r,k:j.k,why:j.why,c:H.K.indexOf(r.cur||'')}; });
 var trs=root.querySelectorAll('table[data-grid="p"] tbody tr');
 S.g.p.forEach(function(r,i){ if(!trs[i]) return; var td=trs[i].querySelector('[data-c="mv"]'); if(!td) return; var t=td.textContent; td.className='calc '+(/^Promote|Requalify/.test(t)?'cl-up':/^Demote|Disqualify|Do not/.test(t)?'cl-dn':''); });
 if(!(R.tP>R.tA&&R.tA>R.tC)) f.push(['warn','Score thresholds should run preferred &gt; approved &gt; conditional. Check '+R.tP+' / '+R.tA+' / '+R.tC+'.']);
 if(R.nC<R.nP) f.push(['warn','Certified should need at least as many periods at the preferred score as preferred does.']);
 if(!P.length){ root.querySelector('.cl-stat').innerHTML=''; root.querySelector('.cl-res').innerHTML=''; root.querySelector('.cl-flow').innerHTML=''; root.querySelector('.cl-out').innerHTML=api.flags(f,'Add suppliers and the classification appears here.'); return; }
 var now=H.K.map(function(){return 0;}), rule=now.slice(); res.forEach(function(x){ if(x.c>=0) now[x.c]++; rule[x.k]++; });
 var up=res.filter(function(x){return x.c>=0&&x.k>x.c;}).length, dn=res.filter(function(x){return x.c>=0&&x.k<x.c;}).length;
 root.querySelector('.cl-stat').innerHTML='<div><b>'+P.length+'</b><span>Suppliers</span></div><div><b>'+(res.length-up-dn)+'</b><span>Hold</span></div><div><b>'+up+'</b><span>Promote or requalify</span></div><div><b>'+dn+'</b><span>Demote or disqualify</span></div><div><b>'+rule[0]+'</b><span>Disqualified by the rules</span></div>';
 function act(x){ var K=H.K; if(x.c<0) return 'Set to '+K[x.k]; if(x.k===x.c) return 'Hold'; if(x.c===0) return x.k>=2?'Requalify':'Hold'; if(x.c===1&&x.k===0) return 'Do not approve'; if(x.k===0) return 'Disqualify'; return (x.k>x.c?'Promote to ':'Demote to ')+K[x.k]; }
 root.querySelector('.cl-res').innerHTML='<thead><tr><th>Supplier</th><th>Now</th><th>Rules allow</th><th>Action</th><th>What holds it at that class</th></tr></thead><tbody>'+res.map(function(x){ var a=act(x); return '<tr><td class="mo">'+esc(x.r.sup)+'</td><td>'+(x.c<0?'—':H.K[x.c])+'</td><td class="mt">'+H.K[x.k]+'</td><td class="cl-a '+(/^Promote|Requalify/.test(a)?'cl-up':/^Demote|Disqualify|Do not/.test(a)?'cl-dn':'')+'">'+a+'</td><td class="cl-w">'+(x.why.length?esc(x.why.join('; ')):'Meets every rule')+'</td></tr>'; }).join('')+'</tbody>';
 /* flow picture */
 var Wd=700, bw=98, bg=12, x0=(Wd-6*bw-5*bg)/2, yT=96, bh=58, yD=262, Hh=330;
 var bx=function(k){ return k===0?Wd/2-bw/2:x0+(k-1)*(bw+bg); }, cx=function(k){ return bx(k)+bw/2; };
 var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Supplier classes and the moves the rules call for"><defs><marker id="clA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1F8C55"/></marker><marker id="clB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#C0392B"/></marker></defs><style>text{font:11px Archivo,sans-serif;fill:#16273A}.nm{font:700 9px \'IBM Plex Mono\',monospace;fill:#0F3E68}.big{font:800 20px Archivo,sans-serif;fill:#0F3E68}.sm{font:600 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.ct{font:700 11px \'IBM Plex Mono\',monospace}</style>';
 g+='<path d="M'+(bx(1)-4)+','+(yT+bh/2)+' H'+(bx(6)+bw+4)+'" stroke="#E3E7EB" stroke-width="10"/>';
 H.K.forEach(function(nm,k){ var x=bx(k), y=k===0?yD:yT, fill=k===0?'#FDECEA':k>=4?'#DDF0E4':k===1?'#F3F5F7':k===2?'#FBF3DC':'#E4ECF4', st=k===0?'#C0392B':k>=4?'#1F8C55':k===2?'#D8B147':'#0F3E68';
  g+='<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="4" fill="'+fill+'" stroke="'+st+'" stroke-width="1.6"/><text class="nm" x="'+(x+bw/2)+'" y="'+(y+14)+'" text-anchor="middle">'+nm.toUpperCase()+'</text><text class="big" x="'+(x+bw/2)+'" y="'+(y+37)+'" text-anchor="middle">'+now[k]+'</text><text class="sm" x="'+(x+bw/2)+'" y="'+(y+51)+'" text-anchor="middle">RULES: '+rule[k]+'</text>'; });
 var mv={}; res.forEach(function(x){ if(x.c>=0&&x.k!==x.c){ var key=x.c+','+x.k; mv[key]=(mv[key]||0)+1; } });
 Object.keys(mv).forEach(function(key){ var p=key.split(','), a=+p[0], b=+p[1], m=mv[key], d;
  if(b===0||a===0){ var down=b===0, xa=down?cx(a):cx(0)-16, ya=down?yT+bh:yD, xb=down?cx(0)+(cx(a)<cx(0)?-16:16)*(Math.abs(cx(a)-cx(0))>bw?1:0):cx(b), yb=down?yD-2:yT+bh+2, col=down?'#C0392B':'#1F8C55';
   d='M'+xa+','+ya+' C'+xa+','+((ya+yb)/2)+' '+xb+','+((ya+yb)/2)+' '+xb+','+yb;
   g+='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="1.8" marker-end="url(#'+(down?'clB':'clA')+')"/><text class="ct" x="'+((xa+xb)/2+(xa<=xb?8:-8))+'" y="'+((ya+yb)/2-2)+'" text-anchor="'+(xa<=xb?'start':'end')+'" style="fill:'+col+'">'+m+'</text>'; return; }
  var upw=b>a, span=Math.abs(cx(b)-cx(a)), y=upw?yT:yT+bh, ctrl=upw?yT-22-span*0.12:yT+bh+22+span*0.12, xa=cx(a)+(upw?8:-8), xb=cx(b)+(upw?-8:8);
  d='M'+xa+','+y+' Q'+((xa+xb)/2)+','+ctrl+' '+xb+','+(upw?y-2:y+2);
  g+='<path d="'+d+'" fill="none" stroke="'+(upw?'#1F8C55':'#C0392B')+'" stroke-width="1.8" marker-end="url(#'+(upw?'clA':'clB')+')"/><text class="ct" x="'+((xa+xb)/2)+'" y="'+((y+ctrl)/2+(upw?-2:10))+'" text-anchor="middle" style="fill:'+(upw?'#1F8C55':'#C0392B')+'">'+m+'</text>'; });
 g+='<text class="sm" x="8" y="14">BIG NUMBER: SUPPLIERS IN THE CLASS NOW. GREEN ARROWS: PROMOTIONS. RED: DEMOTIONS.</text>';
 root.querySelector('.cl-flow').innerHTML=g+'</svg>';
 /* per-supplier checks */
 res.forEach(function(x){ var r=x.r, nm='<b>'+esc(r.sup)+'</b>', K=H.K, why=x.why.join('; ');
  if(x.c<0){ f.push(['warn',nm+' has no current class. The rules allow '+K[x.k]+' ('+why+').']); return; }
  if(x.k===x.c){ if(x.k<6&&x.k>0) f.push(['',nm+' holds at '+K[x.k]+'. To move up: '+why+'.']); return; }
  if(x.c===0){ if(x.k>=2) f.push(['warn',nm+' is disqualified but now meets the rules for '+K[x.k]+'. A disqualified supplier comes back only through the full new-supplier approval: audit, first article, a probation period as Conditional.']); else f.push(['',nm+' stays disqualified: '+why+'.']); return; }
  if(x.k===0) f.push(['warn',nm+': '+(x.c===1?'do not approve':'disqualify')+' ('+why+'). '+(x.c===1?'Tell the supplier why and what would change the decision.':'Stop new orders, start the exit plan: alternate source, safety stock, transfer of tooling, records and open orders. Issue a SCAR if product is affected.')]);
  else if(x.k<x.c) f.push(['warn',nm+': demote from '+K[x.c]+' to '+K[x.k]+' because '+why+'.'+(x.c>=5?' Restore normal incoming inspection now; ship-to-stock depends on certified status.':'')+(x.k===2?' Agree an improvement plan with dates; conditional status should have an end date.':'')]);
  else f.push(['ok',nm+': promote from '+K[x.c]+' to '+K[x.k]+'.'+(x.k-x.c>1?' The rules allow a jump of '+(x.k-x.c)+' classes; many systems still move one step per review, so confirm that is intended.':'')+(x.k>=5?' Reduce incoming inspection only as the certification procedure says, and keep periodic verification.':'')]); });
 var cond=res.filter(function(x){return x.c===2&&x.k===2;}); if(cond.length>1) f.push(['','Conditional is meant to be temporary. '+cond.length+' suppliers stay conditional; set a date for each to reach approved or exit.']);
 f.push(['','Rules make the classification consistent; they do not replace judgment. A supplier\'s strategic value, sole-source status and risk (see the <a href="/tools/kraljic-portfolio-matrix.html">Kraljic matrix</a>) decide how hard you work to develop one rather than exit.']);
 root.querySelector('.cl-out').innerHTML=api.flags(f);
},
example:{f:{org:'Purchased components and services, Corvane Instruments, all three plants',per:'Q3 2026',tc:'55',ta:'70',tp:'85',np:'2',nc:'4',ppm:'500',age:'12',creq:'Yes'},
 g:{p:[{sup:'Varrick Circuit Assembly',com:'Printed circuit assemblies',cur:'Preferred',sc:'92',np:'5',ppm:'180',scar:'0',aud:'Pass',ad:'2026-03-18',cert:'Valid',part:'No'},
  {sup:'Tallisk Springs',com:'Springs and clips',cur:'Approved',sc:'87',np:'2',ppm:'420',scar:'0',aud:'Pass with minor findings',ad:'2025-11-04',cert:'Valid',part:'No'},
  {sup:'Orvex Plastics',com:'Molded enclosures',cur:'Certified',sc:'81',np:'0',ppm:'950',scar:'1',aud:'Pass',ad:'2026-02-11',cert:'Valid',part:'No'},
  {sup:'Quillon Fasteners',com:'Fasteners (distributor)',cur:'Conditional',sc:'62',np:'0',ppm:'2300',scar:'2',aud:'Major findings open',ad:'2026-08-20',cert:'Valid',part:'No'},
  {sup:'Kelvane Coatings',com:'Powder coating service',cur:'Approved',sc:'48',np:'0',ppm:'6100',scar:'3',aud:'Pass with minor findings',ad:'2025-06-30',cert:'Expired or suspended',part:'No'},
  {sup:'Veldt Optics',com:'Lenses and windows',cur:'Certified',sc:'95',np:'9',ppm:'40',scar:'0',aud:'Pass',ad:'2026-05-06',cert:'Valid',part:'Yes'},
  {sup:'Tessaline Calibration Lab',com:'Calibration service',cur:'Non-approved',sc:'',np:'',ppm:'',scar:'0',aud:'Pass',ad:'2026-09-15',cert:'Valid',part:'No'}]}}
}
