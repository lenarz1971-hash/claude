{
slug:'make-buy-analysis',
h:{
 BEH:['Per unit','Per year (fixed)','One-time'],
 /* the cost model. One-time costs are spread evenly over the horizon (no discounting).
    Annual cost at volume V = F + U*V, where F = one-time/years + per-year fixed and U = sum of per-unit costs.
    Break-even V* = (F_make - F_buy) / (U_buy - U_make). */
 model:function(S,api){ var n=api.num, yrs=n(S.f.yrs); if(!(yrs>0)) yrs=5;
  var m={yrs:yrs,ex:[],ot:[0,0],fy:[0,0],u:[0,0],bad:[]};
  S.g.c.forEach(function(r,i){ if(!r.el&&r.mk==null&&r.by==null) return; if(!r.el&&!String(r.mk||'').trim()&&!String(r.by||'').trim()) return;
   if(/^Not relevant/.test(r.rel||'')){ m.ex.push(r.el||('row '+(i+1))); return; }
   var k=r.beh==='One-time'?'ot':r.beh==='Per year (fixed)'?'fy':'u';
   [r.mk,r.by].forEach(function(v,j){ if(v===''||v==null) return; var x=n(v); if(isNaN(x)) m.bad.push(r.el||('row '+(i+1))); else m[k][j]+=x; }); });
  m.F=[m.ot[0]/yrs+m.fy[0], m.ot[1]/yrs+m.fy[1]];
  m.U=m.u;
  m.cost=function(j,V){ return m.F[j]+m.U[j]*V; };
  var dU=m.U[1]-m.U[0], dF=m.F[0]-m.F[1];
  m.be=Math.abs(dU)<1e-12?NaN:dF/dU;
  return m; },
 rowAnnual:function(r,j,api){ var S=api.state(), n=api.num, v=n(j?r.by:r.mk), yrs=n(S.f.yrs), vol=n(S.f.vol); if(!(yrs>0)) yrs=5;
  if(!r.el||isNaN(v)) return ''; if(/^Not relevant/.test(r.rel||'')) return '<span class="mb-x">excluded</span>';
  var a=r.beh==='One-time'?v/yrs:r.beh==='Per year (fixed)'?v:(isNaN(vol)?NaN:v*vol);
  return isNaN(a)?'':'$'+api.fmt(a,0); },
 nice:function(x){ if(!(x>0)) return 1; var p=Math.pow(10,Math.floor(Math.log(x)/Math.LN10)), q=x/p; return (q<=1?1:q<=2?2:q<=2.5?2.5:q<=5?5:10)*p; }
},
sections:[
 {type:'fields',title:'The decision',cols:3,hint:'A make/buy decision compares the full cost and the capability of doing the work yourself with buying it from a supplier. Write down the volume and the horizon first; the answer often changes with them.',fields:[
  {id:'item',label:'Part, assembly or service',wide:true,ph:'e.g. VB-220 machined valve body'},
  {id:'sup',label:'Supplier being compared',ph:'e.g. the best quote received'},
  {id:'own',label:'Analysis owner'},
  {id:'date',label:'Date',type:'date'},
  {id:'vol',label:'Planned annual volume, units',type:'number',min:0,ph:'e.g. 18000'},
  {id:'yrs',label:'Horizon, years',type:'number',min:1,ph:'5',hint:'One-time costs are spread over these years.'},
  {id:'cur',label:'Volume range of the forecast',ph:'e.g. 14,000 to 22,000 a year'}]},
 {type:'grid',id:'c',title:'Cost model',rows:6,hint:'One row per cost element; put the amount under Make, Buy or both. <b>Per unit</b> costs scale with volume; <b>per year</b> costs are fixed each year; <b>one-time</b> costs (equipment, tooling, qualification) are spread evenly over the horizon. Include quality cost (inspection, scrap, returns) and a risk premium (the expected cost of a disruption) on both sides. Mark costs that do not change with the decision, such as allocated plant overhead or money already spent, <b>Not relevant</b>: they are shown but left out of the comparison.',cols:[
  {id:'el',label:'Cost element',w:220,type:'textarea',rows:1},
  {id:'beh',label:'Behaves as',type:'select',opts:['Per unit','Per year (fixed)','One-time']},
  {id:'rel',label:'Relevant?',type:'select',opts:['Relevant','Not relevant (sunk or allocated)']},
  {id:'mk',label:'Make $',type:'number',min:0},
  {id:'by',label:'Buy $',type:'number',min:0},
  {id:'am',label:'Make $/yr',tip:'At the planned volume; one-time spread over the horizon',calc:function(r,api){ return window.TOOL.h.rowAnnual(r,0,api); }},
  {id:'ab',label:'Buy $/yr',tip:'At the planned volume; one-time spread over the horizon',calc:function(r,api){ return window.TOOL.h.rowAnnual(r,1,api); }},
  {id:'note',label:'Basis or source',w:160,type:'textarea',rows:1}]},
 {type:'fields',title:'Capability and capacity',cols:4,hint:'Cost is only half the comparison. Use evidence: capability studies, the supplier\'s quality history on similar parts, and the capacity each side can actually commit. Leave a box blank if you have no data, and say so in the decision.',fields:[
  {id:'capM',label:'Internal capacity available, units/yr',type:'number',min:0},
  {id:'capB',label:'Supplier capacity committed, units/yr',type:'number',min:0},
  {id:'cpkM',label:'Internal Cpk on the key characteristic',type:'number',min:0},
  {id:'cpkB',label:'Supplier Cpk on the key characteristic',type:'number',min:0},
  {id:'ppmM',label:'Internal defect history, ppm',type:'number',min:0},
  {id:'ppmB',label:'Supplier defect history, ppm',type:'number',min:0},
  {id:'ltM',label:'Internal lead time, weeks',type:'number',min:0},
  {id:'ltB',label:'Supplier lead time, weeks',type:'number',min:0}]},
 {type:'grid',id:'s',title:'Weighted scoring',rows:5,hint:'Cost does not capture everything. Score each option 1 (poor) to 5 (strong) on the factors that matter, including the strategic ones: is this a core competence, does it protect intellectual property, how much control do you need over quality and schedule? Weights should total 100.',cols:[
  {id:'fac',label:'Factor',w:230,type:'textarea',rows:1},
  {id:'cat',label:'Type',type:'select',opts:['Cost','Quality and capability','Capacity and delivery','Strategic','Risk','Financial']},
  {id:'w',label:'Weight',type:'number',min:0},
  {id:'m',label:'Make 1-5',type:'number',min:1,max:5},
  {id:'b',label:'Buy 1-5',type:'number',min:1,max:5},
  {id:'wm',label:'Make wtd',calc:function(r,api){ var x=api.num(r.w)*api.num(r.m); return isNaN(x)?'':api.fmt(x,0); }},
  {id:'wb',label:'Buy wtd',calc:function(r,api){ var x=api.num(r.w)*api.num(r.b); return isNaN(x)?'':api.fmt(x,0); }}]},
 {type:'fields',title:'SWOT summary of making it in-house',cols:2,hint:'Strengths and weaknesses are internal: what your own operation brings or lacks. Opportunities and threats are external: the market, the supply base, technology and demand. One point per line.',fields:[
  {id:'sw_s',label:'Strengths',type:'textarea',rows:3},
  {id:'sw_w',label:'Weaknesses',type:'textarea',rows:3},
  {id:'sw_o',label:'Opportunities',type:'textarea',rows:3},
  {id:'sw_t',label:'Threats',type:'textarea',rows:3}]},
 {type:'fields',title:'Recommendation',cols:3,fields:[
  {id:'rec',label:'Recommendation',type:'select',opts:['Make','Buy','Make and buy (split volume)','Defer: more data needed']},
  {id:'appr',label:'Decided by'},
  {id:'rev',label:'Review the decision by',type:'date'},
  {id:'why',label:'Rationale',type:'textarea',wide:true,ph:'Why this option, what it depends on, and what would change the answer'}]},
 {type:'custom',id:'res',title:'Results',hint:'Annual cost of each option against annual volume. Where the lines cross is the break-even volume. The dashed lines mark the planned volume and the internal capacity.',html:'<div class="stat mb-stat"></div><div class="svgw mb-svg"></div><div class="stat mb-sc"></div><div class="out mb-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), n=api.num, esc=api.esc, f=[], M=H.model(S,api), vol=n(S.f.vol), $=function(v){ return (v<0?'−$':'$')+api.fmt(Math.abs(v),0); };
 var has=(M.F[0]||M.U[0])&&(M.F[1]||M.U[1]);
 var cm=has&&vol>=0?M.cost(0,vol):NaN, cb=has&&vol>=0?M.cost(1,vol):NaN, be=M.be;
 var beTxt=!has?'—':isNaN(be)||be<=0?'None':api.fmt(be,0);
 root.querySelector('.mb-stat').innerHTML='<div><b>'+(isNaN(cm)?'—':$(cm))+'</b><span>Make, cost per year</span></div><div><b>'+(isNaN(cb)?'—':$(cb))+'</b><span>Buy, cost per year</span></div><div><b>'+(isNaN(cm)||!vol?'—':'$'+api.fmt(cm/vol,2))+' / '+(isNaN(cb)||!vol?'—':'$'+api.fmt(cb/vol,2))+'</b><span>Cost per unit, make / buy</span></div><div><b>'+beTxt+'</b><span>Break-even, units per year</span></div><div><b>'+(isNaN(cm)?'—':$(Math.abs(cm-cb)*M.yrs))+'</b><span>Difference over '+api.fmt(M.yrs,0)+' years</span></div>';
 /* chart */
 var svg=root.querySelector('.mb-svg');
 if(has){
  var capM=n(S.f.capM), xs=[vol>0?vol*1.5:0, be>0?be*1.5:0, capM>0?capM*1.15:0], xm=H.nice(Math.max.apply(null,xs)||1000);
  var ym=H.nice(Math.max(M.cost(0,xm),M.cost(1,xm),1));
  var Wd=680, Hh=340, L=78, Rm=20, T=24, B=48, pw=Wd-L-Rm, ph=Hh-T-B, sx=function(v){return L+pw*v/xm;}, sy=function(v){return T+ph*(1-v/ym);};
  function kfmt(v){ return v>=1e6?api.fmt(v/1e6,v%1e6?1:0)+'M':v>=1e3?api.fmt(v/1e3,v%1e3?1:0)+'k':api.fmt(v,0); }
  var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Annual cost against annual volume, make and buy"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lb{font:700 11.5px Archivo,sans-serif}</style>';
  for(var i=0;i<=5;i++){ var yv=ym*i/5, xv=xm*i/5; g+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+sy(yv)+'" y2="'+sy(yv)+'" stroke="#E3E7EB"/><text class="ax" x="'+(L-8)+'" y="'+(sy(yv)+3)+'" text-anchor="end">$'+kfmt(yv)+'</text><line x1="'+sx(xv)+'" x2="'+sx(xv)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#E3E7EB"/><text class="ax" x="'+sx(xv)+'" y="'+(T+ph+15)+'" text-anchor="middle">'+kfmt(xv)+'</text>'; }
  g+='<rect x="'+L+'" y="'+T+'" width="'+pw+'" height="'+ph+'" fill="none" stroke="#B9C0C6"/><text class="ax" x="'+(L+pw/2)+'" y="'+(Hh-8)+'" text-anchor="middle">ANNUAL VOLUME, UNITS</text><text class="ax" transform="translate(13 '+(T+ph/2)+') rotate(-90)" text-anchor="middle">COST PER YEAR</text>';
  if(capM>0&&capM<=xm) g+='<line x1="'+sx(capM)+'" x2="'+sx(capM)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#4A5D71" stroke-dasharray="2 4"/><text class="ax" x="'+(sx(capM)-4)+'" y="'+(T+ph-8)+'" text-anchor="end">INTERNAL CAPACITY</text>';
  if(vol>0) g+='<line x1="'+sx(vol)+'" x2="'+sx(vol)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#0F3E68" stroke-dasharray="6 4"/><text class="ax" x="'+(sx(vol)+4)+'" y="'+(T+12)+'">PLANNED '+api.fmt(vol,0)+'</text>';
  [['#0F3E68','MAKE',0],['#D8B147','BUY',1]].forEach(function(c){ var y0=M.cost(c[2],0), y1=M.cost(c[2],xm);
   g+='<line x1="'+sx(0)+'" y1="'+sy(y0)+'" x2="'+sx(xm)+'" y2="'+sy(y1)+'" stroke="'+c[0]+'" stroke-width="3"/>'; });
  var yl0=sy(M.cost(0,xm)), yl1=sy(M.cost(1,xm)); if(Math.abs(yl0-yl1)<14){ var mid=(yl0+yl1)/2; yl0=mid+(M.cost(0,xm)>=M.cost(1,xm)?-8:8); yl1=mid+(M.cost(1,xm)>M.cost(0,xm)?-8:8); }
  g+='<text class="lb" x="'+(L+pw-6)+'" y="'+(yl0-7)+'" text-anchor="end" style="fill:#0F3E68">MAKE</text><text class="lb" x="'+(L+pw-6)+'" y="'+(yl1+(yl1>yl0?16:-7))+'" text-anchor="end" style="fill:#9C7C1F">BUY</text>';
  if(be>0&&be<=xm){ var bx=sx(be), by=sy(M.cost(0,be)); g+='<circle cx="'+bx+'" cy="'+by+'" r="6" fill="#C0392B" stroke="#fff" stroke-width="1.5"/><text class="lb" x="'+(bx+(bx>L+pw-170?-10:10))+'" y="'+(by+(by<T+40?18:-10))+'" text-anchor="'+(bx>L+pw-170?'end':'start')+'" style="fill:#C0392B">Break-even '+api.fmt(be,0)+' / yr</text>'; }
  svg.innerHTML=g+'</svg>';
 } else svg.innerHTML='';
 /* weighted scoring */
 var SR=S.g.s.filter(function(r){return r.fac;}), W=0, tm=0, tb=0, badS=[], miss=0;
 SR.forEach(function(r){ var w=n(r.w); if(isNaN(w)||w<=0) return; W+=w; ['m','b'].forEach(function(k){ var v=n(r[k]); if(r[k]===''||r[k]==null){ miss++; return; } if(isNaN(v)||v<1||v>5||Math.round(v)!==v){ badS.push(r.fac); return; } if(k==='m') tm+=w*v; else tb+=w*v; }); });
 var pm=W?tm/(5*W)*100:NaN, pb=W?tb/(5*W)*100:NaN;
 root.querySelector('.mb-sc').innerHTML='<div><b>'+(isNaN(pm)?'—':api.fmt(tm,0)+' ('+pm.toFixed(1)+'%)')+'</b><span>Make, weighted score</span></div><div><b>'+(isNaN(pb)?'—':api.fmt(tb,0)+' ('+pb.toFixed(1)+'%)')+'</b><span>Buy, weighted score</span></div><div><b>'+(api.fmt(W,0)||'0')+'</b><span>Total weight</span></div>';
 /* flags: cost */
 var cheap='';
 if(!has) f.push(['warn','Enter costs for both make and buy to compare them.']);
 else if(isNaN(vol)) f.push(['warn','Enter the planned annual volume.']);
 else {
  cheap=cm<cb?'Make':cm>cb?'Buy':'';
  f.push(['ok',cheap?'At '+api.fmt(vol,0)+' units a year, <b>'+cheap.toLowerCase()+'</b> costs less: '+$(Math.min(cm,cb))+' against '+$(Math.max(cm,cb))+' a year, '+$(Math.abs(cm-cb))+' a year or '+$(Math.abs(cm-cb)*M.yrs)+' over '+api.fmt(M.yrs,0)+' years.':'At '+api.fmt(vol,0)+' units a year the two options cost the same.']);
  if(be>0){ var above=M.U[0]<M.U[1]?'make':'buy', below=above==='make'?'buy':'make', gap=vol>0?(vol-be)/be*100:NaN;
   f.push(['','Break-even at '+api.fmt(be,0)+' units a year. Above it, <b>'+above+'</b> is cheaper, because its cost per unit is lower ($'+api.fmt(Math.min(M.U[0],M.U[1]),2)+' against $'+api.fmt(Math.max(M.U[0],M.U[1]),2)+'); below it, <b>'+below+'</b> is cheaper, because its fixed cost is lower.']);
   if(!isNaN(gap)&&Math.abs(gap)<20) f.push(['warn','The planned volume is within 20% of break-even ('+(gap>=0?'+':'')+gap.toFixed(0)+'%). A small miss in the forecast changes the answer; test the low and high ends of the forecast before deciding.']);
   else if(!isNaN(gap)) f.push(['','The planned volume is '+Math.abs(gap).toFixed(0)+'% '+(gap>=0?'above':'below')+' break-even, so the cost answer holds unless the forecast is badly wrong.']); }
  else if(!isNaN(be)||M.F[0]!==M.F[1]) f.push(['',(M.cost(0,1)<M.cost(1,1)?'Make':'Buy')+' is cheaper at every volume: it has both the lower fixed cost and the lower (or equal) cost per unit. There is no break-even.']);
 }
 if(M.ex.length) f.push(['','Left out as not relevant: '+M.ex.map(esc).join('; ')+'. Allocated overhead that stays whether you make or buy, and money already spent, should not decide the question.']);
 if(M.bad.length) f.push(['warn','Not a number: '+M.bad.map(esc).join(', ')+'.']);
 var ql=S.g.c.filter(function(r){ return /qualit|scrap|inspect|warrant|return/i.test(r.el||''); }), rk=S.g.c.filter(function(r){ return /risk|disrupt|contingen/i.test(r.el||''); });
 if(has&&!ql.length) f.push(['warn','No quality cost in the model. Inspection, scrap, rework and returns often differ between the options, and leaving them out favors whichever side has the worse quality.']);
 if(has&&!rk.length) f.push(['','No risk premium. Add the expected cost of a supply disruption (probability &times; cost) on each side, especially for a single overseas source.']);
 /* capability and capacity */
 var capB=n(S.f.capB), cpkM=n(S.f.cpkM), cpkB=n(S.f.cpkB), ppmM=n(S.f.ppmM), ppmB=n(S.f.ppmB), ltM=n(S.f.ltM), ltB=n(S.f.ltB);
 if(vol>0&&capM>=0&&capM<vol) f.push(['warn','Internal capacity ('+api.fmt(capM,0)+' a year) is below the planned volume ('+api.fmt(vol,0)+'). Making all of it needs more capacity than the cost model includes; either add that cost or split the volume.']);
 if(vol>0&&capB>=0&&capB<vol) f.push(['warn','The supplier has committed '+api.fmt(capB,0)+' a year, below the planned '+api.fmt(vol,0)+'.']);
 [['Internal',cpkM],['Supplier',cpkB]].forEach(function(x){ if(!isNaN(x[1])&&x[1]<1.33) f.push(['warn',x[0]+' Cpk is '+api.fmt(x[1],2)+', below the usual 1.33 minimum. Expect inspection and scrap costs above the model unless the process improves.']); });
 if(!isNaN(ppmM)&&!isNaN(ppmB)&&Math.max(ppmM,ppmB)>0&&Math.max(ppmM,ppmB)>=2*Math.max(1,Math.min(ppmM,ppmB))) f.push(['',(ppmM>ppmB?'Internal':'Supplier')+' defect history is '+api.fmt(Math.max(ppmM,ppmB)/Math.max(1,Math.min(ppmM,ppmB)),1)+' times the other side\'s (internal '+api.fmt(ppmM,0)+' ppm, supplier '+api.fmt(ppmB,0)+' ppm). Check that the quality cost rows reflect it.']);
 if(!isNaN(ltM)&&!isNaN(ltB)&&ltB>=2*Math.max(ltM,0.5)) f.push(['','Supplier lead time ('+api.fmt(ltB,0)+' weeks) is much longer than internal ('+api.fmt(ltM,0)+'). Longer lead time means more inventory and slower response to a quality problem.']);
 if(isNaN(cpkM)&&isNaN(cpkB)&&isNaN(ppmM)&&isNaN(ppmB)) f.push(['','No capability or quality history entered. The CSQP make/buy topic asks for internal and external capability analysis; use capability studies and historical performance.']);
 /* scoring */
 if(SR.length){
  if(Math.abs(W-100)>0.01&&W) f.push(['warn','Weights total '+api.fmt(W,1)+', not 100. The percentages are still right, but fix the weights so each shows its share of the decision.']);
  if(badS.length) f.push(['warn','Scores must be whole numbers 1 to 5: '+badS.map(esc).join(', ')+'.']);
  if(miss) f.push(['warn',miss+' score'+(miss>1?'s are':' is')+' blank and count as 0.']);
  var sw=isNaN(pm)?'':pm>pb?'Make':pb>pm?'Buy':'';
  if(sw) f.push(['','Weighted scoring favors <b>'+sw.toLowerCase()+'</b>, '+Math.max(pm,pb).toFixed(1)+'% against '+Math.min(pm,pb).toFixed(1)+'%.'+(Math.abs(pm-pb)<5?' A gap under 5 points is within the uncertainty of 1-to-5 scoring.':'')]);
  if(sw&&cheap&&sw!==cheap) f.push(['warn','Cost favors <b>'+cheap.toLowerCase()+'</b> but the weighted scoring favors <b>'+sw.toLowerCase()+'</b>. The strategic factors are outweighing cost; make sure the rationale says so explicitly.']);
  var cats=SR.map(function(r){return r.cat;}); if(cats.indexOf('Strategic')<0) f.push(['','No strategic factor scored. Core competence, protection of intellectual property and control over quality and schedule are usually what decide a close make/buy.']);
 } else f.push(['','Add weighted scoring factors to cover what cost leaves out.']);
 /* SWOT and recommendation */
 var nsw=['sw_s','sw_w','sw_o','sw_t'].filter(function(k){return api.lines(k).length;}).length;
 if(nsw<4) f.push(['',nsw?'The SWOT has '+(4-nsw)+' empty quadrant'+(4-nsw>1?'s':'')+'.':'Fill in the SWOT summary: it is the structured way to bring internal capability and the outside world into the decision.']);
 var rec=S.f.rec||'';
 if(!rec) f.push(['warn','No recommendation recorded yet.']);
 else { if((rec==='Make'||rec==='Buy')&&cheap&&rec!==cheap&&sw!==rec) f.push(['warn','The recommendation is <b>'+rec.toLowerCase()+'</b>, but neither the cost model nor the scoring favors it. Explain why in the rationale.']);
  if(rec==='Make'&&vol>0&&capM>=0&&capM<vol) f.push(['warn','Recommendation is make, but internal capacity is short of the planned volume.']);
  if(!S.f.why) f.push(['warn','Write the rationale: a decision without one cannot be reviewed later.']); }
 root.querySelector('.mb-out').innerHTML=api.flags(f);
},
example:{f:{item:'VB-220 machined aluminum valve body, for the Series 4 pump line',sup:'Brixwell Precision (best of three quotes)',own:'Supplier quality engineer, with finance and manufacturing engineering',date:'2026-10-05',vol:'18000',yrs:'5',cur:'14,000 to 22,000 a year',
 capM:'15000',capB:'25000',cpkM:'1.45',cpkB:'1.21',ppmM:'850',ppmB:'2400',ltM:'2',ltB:'8',
 sw_s:'Machining cell and machinists already run similar valve bodies\nCpk 1.45 on the main bore\nShort internal lead time; fast response to engineering changes',
 sw_w:'Capacity 15,000 a year, short of the 18,000 plan\n$420,000 of equipment up front\nNo spare CNC for breakdowns',
 sw_o:'The cell could take the VB-300 family next year\nCycle time reduction already identified on similar parts',
 sw_t:'Demand beyond year 3 is uncertain\nMachinist hiring market is tight\nAluminum bar price is volatile',
 rec:'Make and buy (split volume)',appr:'Operations director',rev:'2027-04-30',
 why:'Make is cheaper above about 9,600 a year and scores higher on capability, core competence and protection of the process know-how. Internal capacity is 15,000, so make about 14,000 a year in the new cell and place about 4,000 with Brixwell as a qualified second source, which also covers a cell breakdown. Review if the forecast drops below 12,000 a year or the quote moves by more than 5%.'},
 g:{c:[
  {el:'Purchase price per unit',beh:'Per unit',rel:'Relevant',mk:'',by:'38.50',note:'Quote BQ-4471, 18k/yr'},
  {el:'Aluminum bar stock',beh:'Per unit',rel:'Relevant',mk:'9.80',by:'',note:'Current contract price'},
  {el:'Direct labor and machine time',beh:'Per unit',rel:'Relevant',mk:'11.40',by:'',note:'14.2 min cycle at the cell rate'},
  {el:'Variable overhead: power, cutting tools, coolant',beh:'Per unit',rel:'Relevant',mk:'3.20',by:'',note:'Cost accounting'},
  {el:'Freight, duty and packaging',beh:'Per unit',rel:'Relevant',mk:'0.40',by:'2.10',note:'Internal move vs inbound freight'},
  {el:'Quality cost: inspection, scrap, returns',beh:'Per unit',rel:'Relevant',mk:'1.30',by:'1.60',note:'From ppm history and receiving inspection'},
  {el:'Risk premium: expected cost of supply disruption',beh:'Per unit',rel:'Relevant',mk:'0.30',by:'1.10',note:'Probability x cost of a 4-week stop'},
  {el:'CNC cell, fixtures and gauges',beh:'One-time',rel:'Relevant',mk:'420000',by:'',note:'Capital request CR-26-118'},
  {el:'Supplier tooling and first article',beh:'One-time',rel:'Relevant',mk:'',by:'18000',note:'Quoted with the part price'},
  {el:'Cell supervision, maintenance and floor space',beh:'Per year (fixed)',rel:'Relevant',mk:'96000',by:'',note:'New cost if we make'},
  {el:'Supplier management: audits, SQE time, scorecard',beh:'Per year (fixed)',rel:'Relevant',mk:'',by:'14000',note:'Two audits a year plus SQE time'},
  {el:'Plant general overhead allocation',beh:'Per year (fixed)',rel:'Not relevant (sunk or allocated)',mk:'55000',by:'',note:'Allocated; does not change with the decision'}],
 s:[
  {fac:'Total cost at the planned volume',cat:'Cost',w:'25',m:'5',b:'2'},
  {fac:'Process capability and quality history',cat:'Quality and capability',w:'20',m:'4',b:'3'},
  {fac:'Capacity and flexibility for volume swings',cat:'Capacity and delivery',w:'15',m:'2',b:'4'},
  {fac:'Core competence: precision machining is what we do',cat:'Strategic',w:'15',m:'5',b:'2'},
  {fac:'Protection of design and process know-how (IP)',cat:'Strategic',w:'10',m:'5',b:'3'},
  {fac:'Investment and cash needed',cat:'Financial',w:'10',m:'1',b:'5'},
  {fac:'Supply risk and lead time',cat:'Risk',w:'5',m:'4',b:'2'}]}}
}
