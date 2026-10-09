{
slug:'supplier-selection-matrix',
h:{
 crit:[['Quality performance and capability','Quality','Past PPM on similar parts, audit result, process capability (Cpk), sample results'],
  ['Delivery and lead time','Delivery','Quoted lead time, on-time delivery record, logistics plan'],
  ['Total cost of ownership','Cost','Price plus tooling, freight, duties, inspection, inventory and expected scrap'],
  ['Capacity','Capacity','Spare capacity at your volume plus growth; shifts, equipment, staffing'],
  ['Financial stability','Financial','Credit report, years in business, share of revenue from one customer'],
  ['Certification and compliance','Certification','ISO 9001, IATF 16949, AS9100 or ISO 13485 status; RoHS and REACH record'],
  ['Technical capability','Technical','Engineering support, design for manufacture, in-house test lab'],
  ['Responsiveness and service','Service','Quote turnaround, communication, corrective action history'],
  ['Location and logistics','Logistics','Distance, freight mode, customs, time zone'],
  ['Sustainability and social responsibility','Sustainability','Environmental record, labor practices, conflict minerals']],
 risk:[['Single or sole source','Only this supplier can make it; no qualified alternate'],
  ['Geographic and natural hazard','Flood, earthquake or storm zone; long or fragile shipping lane'],
  ['Financial distress','Weak credit, losses, one customer is most of the revenue'],
  ['Capacity constraint','Already near full capacity; your volume would be a large share'],
  ['Sub-tier supplier dependence','Critical material from one sub-tier source you cannot see'],
  ['Regulatory, trade or tariff','Export controls, tariffs, pending regulation'],
  ['Counterfeit, IP or information security','Distributor sourcing, weak traceability, poor data security'],
  ['Quality escape history','Recent recalls, field failures or repeat SCARs']],
 /* weighted % of maximum: sum(w*s)/(sum(w)*5)*100, scores 1-5 */
 score:function(sup,C,s,api,wOver){ var n=api.num,t=0,W=0,miss=0; C.forEach(function(c,j){ var w=wOver?wOver[j]:n(c.w); if(isNaN(w)||w<=0) return; var x=s[sup+'|'+c.n]; if(x==null||isNaN(x)){miss++; x=0;} t+=w*x; W+=w; }); return {t:t,pct:W?t/(W*5)*100:NaN,miss:miss}; },
 trf:function(sup,R,r,api){ var n=api.num,t=0,W=0,miss=0; R.forEach(function(c){ var w=n(c.w); if(isNaN(w)||w<=0) return; var x=r[sup+'|'+c.n]; if(x==null||isNaN(x)){miss++; return;} t+=w*x; W+=w; }); return {v:W?t/W:NaN,miss:miss}; },
 mtx:function(tb,rows,cols,store,cls,api,tail){
  var esc=api.esc, sig=JSON.stringify([rows,cols,tail||'']);
  if(tb.dataset.sig===sig&&tb.querySelector('input')) return;
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>Candidate supplier</th>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+(tail?'<th>'+tail+'</th>':'')+'</tr></thead><tbody>'+rows.map(function(p,i){return '<tr><td class="mo">'+esc(p)+'</td>'+cols.map(function(c){var k=p+'|'+c;return '<td><input type="number" min="1" max="5" step="1" data-'+cls+'="'+esc(k)+'" value="'+(store[k]!=null?store[k]:'')+'" aria-label="'+esc(p)+', '+esc(c)+'"></td>';}).join('')+(tail?'<td class="mt" data-row="'+i+'"></td>':'')+'</tr>';}).join('')+'</tbody>';
  tb.querySelectorAll('input[data-'+cls+']').forEach(function(inp){ inp.oninput=function(){ var x=api.num(inp.value); if(isNaN(x)) delete store[inp.dataset[cls]]; else store[inp.dataset[cls]]=x; api.save(); }; });
 }
},
sections:[
 {type:'fields',title:'The sourcing decision',cols:3,hint:'Agree what is being bought, the must-have requirements and the risk thresholds before anyone scores a candidate. A candidate that fails a must-have is out, however well it scores on the rest.',fields:[
  {id:'dec',label:'Part, material or service being sourced',wide:true,ph:'e.g. Machined aluminum valve body VB-220, 40,000 a year'},
  {id:'team',label:'Evaluation team',ph:'e.g. SQE, buyer, design engineer, planner'},
  {id:'date',label:'Decision date',type:'date'},
  {id:'need',label:'Annual volume or spend'},
  {id:'med',label:'Total risk factor: medium from',type:'number',min:1,max:5,ph:'2.0'},
  {id:'high',label:'Total risk factor: high from',type:'number',min:1,max:5,ph:'3.0'},
  {id:'must',label:'Must-have requirements (knock-out criteria), one per row',type:'datagrid',cols:[{label:'A candidate that does not meet this is not selected',type:'text'}],rows:4,minRows:3}]},
 {type:'custom',id:'lib',cls:'noprint',title:'Criteria library',hint:'Click to add a common criterion or risk factor to the tables below, then edit the wording and weights to suit the purchase.',html:'<p class="ss-lh">Selection criteria</p><div class="pillrow ss-lib ss-lc"></div><p class="ss-lh">Risk factors</p><div class="pillrow ss-lib ss-lr"></div>',
  init:function(el,api){ var T=window.TOOL.h, S=api.state();
   function add(gid,obj){ var g=S.g[gid], i=0; while(i<g.length&&(g[i].n||g[i].w)) i++; if(i<g.length) g[i]=obj; else g.push(obj); api.save(); api.rerender(); }
   el.querySelector('.ss-lc').innerHTML=T.crit.map(function(c,i){return '<button type="button" class="dg-btn ghost" data-lc="'+i+'">+ '+api.esc(c[0])+'</button>';}).join('');
   el.querySelector('.ss-lr').innerHTML=T.risk.map(function(c,i){return '<button type="button" class="dg-btn ghost" data-lr="'+i+'">+ '+api.esc(c[0])+'</button>';}).join('');
   el.querySelectorAll('[data-lc]').forEach(function(b){ b.onclick=function(){ var c=T.crit[+b.dataset.lc]; add('c',{n:c[0],cat:c[1],w:'',how:c[2]}); }; });
   el.querySelectorAll('[data-lr]').forEach(function(b){ b.onclick=function(){ var c=T.risk[+b.dataset.lr]; add('r',{n:c[0],w:'',hi:c[1]}); }; }); }},
 {type:'grid',id:'c',title:'Selection criteria and weights',rows:4,hint:'Weights are percentages and should total 100. Each candidate is scored 1 to 5 on each criterion, where 5 is best. Write down what earns a 1, a 3 and a 5 so every evaluator scores the same way.',cols:[
  {id:'n',label:'Criterion',w:190,type:'textarea',rows:1},
  {id:'cat',label:'Category',type:'select',opts:['Quality','Delivery','Cost','Capacity','Financial','Certification','Technical','Service','Logistics','Sustainability','Other']},
  {id:'w',label:'Weight %',type:'number',min:0,max:100},
  {id:'how',label:'Evidence and scoring guide',w:250,type:'textarea',rows:1}]},
 {type:'grid',id:'s',title:'Candidate suppliers',rows:3,hint:'Record where the evidence came from: an on-site or virtual audit, a self-assessment questionnaire, samples, a financial report. Mark whether the candidate meets every must-have; "Not verified" keeps it in the ranking but is flagged.',cols:[
  {id:'sup',label:'Candidate supplier',w:170},
  {id:'type',label:'Type',type:'select',opts:['Current supplier','New supplier','Distributor']},
  {id:'cert',label:'Certification',type:'select',opts:['ISO 9001','IATF 16949','AS9100','ISO 13485','Other third-party','None','Expired or suspended']},
  {id:'must',label:'Meets all must-haves',type:'select',opts:['Yes','No','Not verified']},
  {id:'ev',label:'Evidence used',w:220,type:'textarea',rows:1}]},
 {type:'custom',id:'mx',title:'Score each candidate, 1 to 5 (5 = best)',html:'<div class="tgw"><table class="mv ss-m"></table></div>'},
 {type:'grid',id:'r',title:'Risk factors and weights',rows:3,hint:'Total risk factor analysis looks at what could stop or spoil supply even when a candidate scores well. Weight each factor; the total risk factor is the weighted average of the ratings, from 1 (low risk) to 5 (high risk).',cols:[
  {id:'n',label:'Risk factor',w:190,type:'textarea',rows:1},
  {id:'w',label:'Weight',type:'number',min:0},
  {id:'hi',label:'What a rating of 5 looks like',w:280,type:'textarea',rows:1}]},
 {type:'custom',id:'rx',title:'Rate each candidate\'s risk, 1 to 5 (5 = highest risk)',html:'<div class="tgw"><table class="mv ss-r"></table></div>'},
 {type:'custom',id:'res',title:'Ranking, total risk factor and recommendation',html:'<div class="stat ss-stat"></div><div class="tgw"><table class="mv ss-res"></table></div><div class="svgw ss-chart"></div><div class="tgw"><table class="mv ss-sens"></table></div><div class="out ss-out"></div>'}
],
blankX:function(){return {s:{},r:{}};},
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), n=api.num, esc=api.esc, f=[];
 var s=S.x.s||(S.x.s={}), rk=S.x.r||(S.x.r={});
 var C=S.g.c.filter(function(r){return r.n;}), R=S.g.r.filter(function(r){return r.n;}), P=S.g.s.filter(function(r){return r.sup;});
 var names=P.map(function(p){return p.sup;}), med=n(S.f.med), high=n(S.f.high); if(isNaN(med)) med=2; if(isNaN(high)) high=3;
 var tm=root.querySelector('table.ss-m'), tr=root.querySelector('table.ss-r'), tres=root.querySelector('table.ss-res'), tsen=root.querySelector('table.ss-sens'), ch=root.querySelector('.ss-chart'), st=root.querySelector('.ss-stat'), out=root.querySelector('.ss-out');
 if(!P.length||!C.length){ tm.innerHTML='<tr><td class="th">Add at least one candidate and one named criterion.</td></tr>'; tm.dataset.sig=''; }
 else H.mtx(tm,names,C.map(function(c){return c.n;}),s,'ss',api,'Weighted');
 if(!P.length||!R.length){ tr.innerHTML='<tr><td class="th">Add at least one candidate and one named risk factor.</td></tr>'; tr.dataset.sig=''; }
 else H.mtx(tr,names,R.map(function(c){return c.n;}),rk,'sr',api,'Total risk factor');
 if(!P.length||!C.length){ tres.innerHTML=''; tsen.innerHTML=''; ch.innerHTML=''; st.innerHTML=''; out.innerHTML=api.flags([],'Add the criteria, the candidates and their scores, and the ranking appears here.'); return; }
 var W=C.reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)||w<0?0:w);},0), WR=R.reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)||w<0?0:w);},0);
 function lvl(v){ return isNaN(v)?'':v>=high?'High':v>=med?'Medium':'Low'; }
 var res=P.map(function(p){ var sc=H.score(p.sup,C,s,api), tf=H.trf(p.sup,R,rk,api); return {p:p,t:sc.t,pct:sc.pct,miss:sc.miss,trf:tf.v,rmiss:tf.miss,lv:lvl(tf.v),out:p.must==='No'}; });
 function order(list){ return list.slice().sort(function(a,b){ return (b.pct-a.pct)||((isNaN(a.trf)?9:a.trf)-(isNaN(b.trf)?9:b.trf)); }); }
 var srt=order(res).sort(function(a,b){ return (a.out?1:0)-(b.out?1:0); });
 srt.forEach(function(r,i){ r.rank=r.out?'—':i+1; });
 var el=srt.filter(function(r){return !r.out&&!isNaN(r.pct);});
 var rec=el.filter(function(r){return r.lv!=='High';})[0]||null, top=el[0]||null;
 /* tail cells in the score and risk matrices */
 res.forEach(function(r,i){ var a=tm.querySelector('[data-row="'+i+'"]'); if(a) a.textContent=isNaN(r.pct)?'':api.fmt(r.t,0)+' ('+r.pct.toFixed(1)+'%)'; var b=tr.querySelector('[data-row="'+i+'"]'); if(b) b.textContent=isNaN(r.trf)?'':r.trf.toFixed(2)+' '+r.lv; });
 st.innerHTML='<div><b>'+P.length+'</b><span>Candidates</span></div><div><b>'+el.length+'</b><span>Still in (must-haves not failed)</span></div><div><b>'+(top?esc(top.p.sup):'—')+'</b><span>Highest weighted score</span></div><div><b>'+(rec?esc(rec.p.sup):'—')+'</b><span>Recommended (not high risk)</span></div>';
 tres.innerHTML='<thead><tr><th>Rank</th><th>Candidate supplier</th><th>Weighted total</th><th>% of maximum</th><th>Total risk factor</th><th>Risk</th><th>Must-haves</th></tr></thead><tbody>'+srt.map(function(r){return '<tr'+(r===rec?' class="ss-win"':'')+'><td class="mt">'+r.rank+'</td><td class="mo">'+esc(r.p.sup)+'</td><td class="mt">'+(isNaN(r.pct)?'—':api.fmt(r.t,0))+'</td><td class="mt">'+(isNaN(r.pct)?'—':r.pct.toFixed(1)+'%')+'</td><td class="mt">'+(isNaN(r.trf)?'—':r.trf.toFixed(2))+'</td><td class="ss-l ss-'+(r.lv||'x').toLowerCase()+'">'+(r.lv||'—')+'</td><td>'+(r.p.must||'—')+'</td></tr>';}).join('')+'</tbody>';
 /* chart: weighted score (x) against total risk factor (y) */
 var pts=res.filter(function(r){return !isNaN(r.pct)&&!isNaN(r.trf);});
 if(pts.length){
  var Wd=640, Hh=330, L=56, Rm=24, T=26, B=46, pw=Wd-L-Rm, ph=Hh-T-B, x0=Math.min(40,Math.floor(Math.min.apply(null,pts.map(function(r){return r.pct;}))/10)*10);
  var sx=function(v){return L+pw*(v-x0)/(100-x0);}, sy=function(v){return T+ph*(5-v)/4;};
  var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Weighted score against total risk factor"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lb{font:700 11px Archivo,sans-serif}</style>';
  g+='<rect x="'+L+'" y="'+sy(5)+'" width="'+pw+'" height="'+(sy(Math.min(5,high))-sy(5))+'" fill="#FDECEA"/><rect x="'+L+'" y="'+sy(Math.min(5,high))+'" width="'+pw+'" height="'+Math.max(0,sy(Math.min(high,Math.max(1,med)))-sy(Math.min(5,high)))+'" fill="#FBF3DC"/>';
  for(var k=1;k<=5;k++) g+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+sy(k)+'" y2="'+sy(k)+'" stroke="#E3E7EB"/><text class="ax" x="'+(L-8)+'" y="'+(sy(k)+3)+'" text-anchor="end">'+k+'</text>';
  for(var v=x0;v<=100;v+=10) g+='<line x1="'+sx(v)+'" x2="'+sx(v)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#E3E7EB"/><text class="ax" x="'+sx(v)+'" y="'+(T+ph+15)+'" text-anchor="middle">'+v+'%</text>';
  g+='<rect x="'+L+'" y="'+T+'" width="'+pw+'" height="'+ph+'" fill="none" stroke="#B9C0C6"/><text class="ax" x="'+(L+pw/2)+'" y="'+(Hh-8)+'" text-anchor="middle">WEIGHTED SCORE, % OF MAXIMUM &rarr; BETTER</text><text class="ax" transform="translate(14 '+(T+ph/2)+') rotate(-90)" text-anchor="middle">TOTAL RISK FACTOR &rarr; RISKIER</text><text class="ax" x="'+(L+pw-6)+'" y="'+(T+13)+'" text-anchor="end">HIGH RISK</text>';
  var used=[];
  function place(x,y,w){ var opts=[[1,0],[-1,0],[1,13],[-1,13],[1,-13],[-1,-13],[1,26],[-1,26]];
   for(var i=0;i<opts.length;i++){ var o=opts[i], bx=o[0]>0?x+11:x-11-w, by=y+4+o[1];
    if(bx<L+2||bx+w>L+pw-2) continue;
    if(!used.some(function(u){ return bx<u.x+u.w+4&&bx+w+4>u.x&&Math.abs(by-u.y)<12; })){ used.push({x:bx,y:by,w:w}); return {x:o[0]>0?x+11:x-11,y:by,a:o[0]>0?'start':'end'}; } }
   used.push({x:x+11,y:y+4,w:w}); return {x:x+11,y:y+4,a:'start'}; }
  pts.forEach(function(r){ var x=sx(r.pct), y=sy(r.trf); used.push({x:x-7,y:y+4,w:14}); });
  pts.forEach(function(r){ var x=sx(r.pct), y=sy(r.trf), c=r.out?'#B9C0C6':r===rec?'#D8B147':'#0F3E68', lab=r.p.sup.length>24?r.p.sup.slice(0,23)+'…':r.p.sup, pl=place(x,y,lab.length*6.6);
   g+='<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+c+'" stroke="#fff" stroke-width="1.5"/><text class="lb" x="'+pl.x+'" y="'+pl.y+'" text-anchor="'+pl.a+'"'+(r.out?' style="fill:#7C8B99;text-decoration:line-through"':'')+'>'+esc(lab)+'</text>'; });
  ch.innerHTML=g+'</svg>';
 } else ch.innerHTML='';
 /* sensitivity: does the winner change if one weight is removed or doubled, or with equal weights? */
 var base=C.map(function(c){var w=n(c.w);return isNaN(w)||w<0?0:w;});
 function winner(wv){ var b=null; spool.forEach(function(r){ var x=H.score(r.p.sup,C,s,api,wv).pct; if(!isNaN(x)&&(!b||x>b.x+1e-9)) b={r:r,x:x}; }); return b; }
 var sens=[], spool=el.filter(function(r){return r.lv!=='High';}); if(spool.length<2) spool=el;
 if(top&&spool.length>1&&W){
  var w0=winner(base);
  C.forEach(function(c,j){ if(!base[j]) return; var a=base.slice(); a[j]=0; var d=base.slice(); d[j]=base[j]*2; sens.push(['Drop '+c.n,winner(a)]); sens.push(['Double '+c.n,winner(d)]); });
  sens.push(['Equal weights',winner(C.map(function(){return 1;}))]);
  var flips=sens.filter(function(x){return x[1]&&x[1].r!==w0.r;});
  tsen.innerHTML='<thead><tr><th>Weight change</th><th>'+(spool.length<el.length?'Best candidate that is not high risk':'Top candidate')+'</th><th>Score</th><th>Same as now?</th></tr></thead><tbody>'+sens.map(function(x){var same=x[1]&&x[1].r===w0.r;return '<tr><td class="mo">'+esc(x[0])+'</td><td>'+(x[1]?esc(x[1].r.p.sup):'—')+'</td><td class="mt">'+(x[1]?x[1].x.toFixed(1)+'%':'—')+'</td><td class="ss-l '+(same?'ss-low':'ss-high')+'">'+(same?'Yes':'No')+'</td></tr>';}).join('')+'</tbody>';
  var pool=el.filter(function(r){return r.lv!=='High';}), gap=pool[1]?pool[0].pct-pool[1].pct:NaN;
  if(!flips.length) f.push(['ok','Sensitivity'+(spool.length<el.length?' (candidates that are not high risk)':'')+': <b>'+esc(w0.r.p.sup)+'</b> stays on top in all '+sens.length+' weight changes tested. The choice does not hang on one weight.']);
  else f.push(['warn','Sensitivity'+(spool.length<el.length?' (candidates that are not high risk)':'')+': the top candidate changes in '+flips.length+' of '+sens.length+' weight changes ('+flips.slice(0,4).map(function(x){return esc(x[0])+' &rarr; '+esc(x[1].r.p.sup);}).join('; ')+(flips.length>4?'; …':'')+'). Agree those weights with the team and record why before deciding.']);
  if(!isNaN(gap)&&gap<5) f.push(['','<b>'+esc(pool[0].p.sup)+'</b> leads <b>'+esc(pool[1].p.sup)+'</b> by '+gap.toFixed(1)+' percentage points. A gap under 5 is inside the uncertainty of 1-to-5 scoring; decide between them on the evidence, not the decimal.']);
 } else tsen.innerHTML='';
 /* flags */
 if(rec) f.unshift(['ok','Recommended: <b>'+esc(rec.p.sup)+'</b>, '+rec.pct.toFixed(1)+'% of the maximum score, total risk factor '+(isNaN(rec.trf)?'not rated':rec.trf.toFixed(2)+' ('+rec.lv.toLowerCase()+')')+'.']);
 if(top&&top!==rec) f.push(['warn','<b>'+esc(top.p.sup)+'</b> has the highest score ('+top.pct.toFixed(1)+'%) but a high total risk factor ('+top.trf.toFixed(2)+'). Select it only with a risk mitigation plan: a qualified second source, safety stock, a financial watch or a capacity commitment.'+(rec?' The best candidate that is not high risk is <b>'+esc(rec.p.sup)+'</b>.':'')]);
 if(!rec&&!top) f.push(['warn','No candidate is left: every one fails a must-have or is unscored.']);
 else if(!rec) f.push(['warn','Every remaining candidate is high risk. Look for more candidates, or plan to develop one, before committing.']);
 if(!W) f.push(['warn','Give the selection criteria weights.']);
 else if(Math.abs(W-100)>0.01) f.push(['warn','Criteria weights total '+api.fmt(W,1)+'%, not 100%. The percentages are still correct, because the total is divided by the weight actually used, but fix the weights so each one shows its share of the decision.']);
 if(R.length&&!WR) f.push(['warn','Give the risk factors weights.']);
 if(!R.length) f.push(['warn','No risk factors. A weighted matrix shows who is best today; total risk factor analysis shows who could fail you tomorrow. Add at least sole source, financial and capacity risk.']);
 var bad=[]; Object.keys(s).concat(Object.keys(rk)).forEach(function(k){ var v=s.hasOwnProperty(k)?s[k]:rk[k]; if(v<1||v>5||Math.round(v)!==v) bad.push(k.replace('|',' / ')); });
 if(bad.length) f.push(['warn','Scores and ratings must be whole numbers 1 to 5: '+bad.slice(0,6).map(esc).join(', ')+'.']);
 var miss=res.filter(function(r){return r.miss;}); if(miss.length) f.push(['warn','Missing scores count as 0 and pull the total down: '+miss.map(function(r){return esc(r.p.sup)+' ('+r.miss+')';}).join(', ')+'.']);
 var rm=res.filter(function(r){return r.rmiss&&R.length;}); if(rm.length) f.push(['warn','Risk ratings missing for '+rm.map(function(r){return esc(r.p.sup);}).join(', ')+'. The total risk factor uses only the factors rated.']);
 res.forEach(function(r){ var nm='<b>'+esc(r.p.sup)+'</b>';
  if(r.out) f.push(['',nm+' fails a must-have and is out of the ranking'+(isNaN(r.pct)?'':', whatever its score ('+r.pct.toFixed(1)+'%)')+'.']);
  else if(!r.p.must||r.p.must==='Not verified') f.push(['warn',nm+': must-haves not verified yet. Confirm them, with evidence, before the decision.']);
  if(!r.out&&r.p.cert==='Expired or suspended') f.push(['warn',nm+' has an expired or suspended certificate. Verify certification status with the registrar, not the supplier\'s copy of the certificate.']);
  if(!r.out&&r.p.type==='Distributor') f.push(['',nm+' is a distributor. Ask for traceability to the original manufacturer and its certificate of conformance; distributors are the usual route for counterfeit parts.']); });
 var cats=C.map(function(c){return c.cat;});
 ['Quality','Delivery','Cost'].forEach(function(k){ if(cats.indexOf(k)<0) f.push(['warn','No '+k.toLowerCase()+' criterion. Quality, delivery and cost belong in almost every supplier selection.']); });
 if(W){ var cw=C.filter(function(c){return c.cat==='Cost';}).reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)?0:w);},0); if(cw/W>=0.4) f.push(['warn','Cost carries '+(cw/W*100).toFixed(0)+'% of the weight. A selection dominated by price tends to buy problems; use total cost of ownership and keep quality and risk in view.']); }
 if(!api.lines('must').length) f.push(['warn','No must-have requirements. List the knock-outs (certification, regulatory approval, capability on critical characteristics) so a weak candidate cannot win on points.']);
 out.innerHTML=api.flags(f);
},
example:{f:{dec:'Machined aluminum valve body VB-220 for the Model 7 irrigation controller, 40,000 a year',team:'Supplier quality engineer, commodity buyer, design engineer, production planner',date:'2026-10-20',need:'40,000 pieces a year, about $1.1 million',med:'2.0',high:'3.0',
 must:'ISO 9001 or IATF 16949 certificate, verified with the registrar\nCpk of at least 1.33 on the three critical bores, shown on samples\nRoHS and REACH declarations for the material and finish\nSigned quality agreement, including change notification'},
 g:{c:[{n:'Quality performance and capability',cat:'Quality',w:'30',how:'Audit score, sample Cpk on critical bores, PPM on similar parts. 5 = Cpk ≥ 1.67 and audit ≥ 90%; 3 = Cpk 1.33 to 1.67; 1 = Cpk < 1.33'},
  {n:'Total cost of ownership',cat:'Cost',w:'25',how:'Piece price plus tooling, freight, duty and inspection. 5 = lowest TCO; 1 = 15% or more above lowest'},
  {n:'Delivery and lead time',cat:'Delivery',w:'20',how:'Quoted lead time and on-time record. 5 = ≤ 4 weeks and ≥ 98% on time'},
  {n:'Capacity',cat:'Capacity',w:'15',how:'Spare spindle hours at 40,000 a year plus 30% growth'},
  {n:'Technical capability',cat:'Technical',w:'10',how:'Engineering support, in-house CMM and leak test'}],
 s:[{sup:'Tarnwick Precision',type:'Current supplier',cert:'IATF 16949',must:'Yes',ev:'On-site process audit 92%; 3-year delivery record; samples measured'},
  {sup:'Corvale Machine Works',type:'New supplier',cert:'ISO 9001',must:'Yes',ev:'On-site audit 85%; samples Cpk 1.52; financial report'},
  {sup:'Tidewell Manufacturing',type:'New supplier',cert:'ISO 9001',must:'Yes',ev:'Virtual audit 88%; samples Cpk 1.71; credit report shows losses two years running'},
  {sup:'Fenmark Components',type:'Distributor',cert:'Other third-party',must:'Not verified',ev:'Self-assessment questionnaire only; samples from an unnamed mill'},
  {sup:'Ashvane Metalcraft',type:'New supplier',cert:'None',must:'No',ev:'Self-assessment; no certificate, samples Cpk 1.10'}],
 r:[{n:'Single or sole source',w:'3',hi:'Only source of the casting; no alternate qualified'},
  {n:'Financial distress',w:'3',hi:'Losses, weak credit, one customer is most of revenue'},
  {n:'Capacity constraint',w:'2',hi:'Our volume would fill the remaining capacity'},
  {n:'Geographic and natural hazard',w:'1',hi:'Flood zone or long ocean lane'},
  {n:'Sub-tier supplier dependence',w:'1',hi:'Bar stock or anodizing from one sub-tier source'}]},
 x:{s:{'Tarnwick Precision|Quality performance and capability':4,'Tarnwick Precision|Total cost of ownership':3,'Tarnwick Precision|Delivery and lead time':5,'Tarnwick Precision|Capacity':2,'Tarnwick Precision|Technical capability':4,
  'Corvale Machine Works|Quality performance and capability':3,'Corvale Machine Works|Total cost of ownership':4,'Corvale Machine Works|Delivery and lead time':4,'Corvale Machine Works|Capacity':4,'Corvale Machine Works|Technical capability':3,
  'Tidewell Manufacturing|Quality performance and capability':5,'Tidewell Manufacturing|Total cost of ownership':4,'Tidewell Manufacturing|Delivery and lead time':3,'Tidewell Manufacturing|Capacity':5,'Tidewell Manufacturing|Technical capability':4,
  'Fenmark Components|Quality performance and capability':2,'Fenmark Components|Total cost of ownership':5,'Fenmark Components|Delivery and lead time':4,'Fenmark Components|Capacity':3,'Fenmark Components|Technical capability':2,
  'Ashvane Metalcraft|Quality performance and capability':2,'Ashvane Metalcraft|Total cost of ownership':5,'Ashvane Metalcraft|Delivery and lead time':3,'Ashvane Metalcraft|Capacity':4,'Ashvane Metalcraft|Technical capability':2},
 r:{'Tarnwick Precision|Single or sole source':2,'Tarnwick Precision|Financial distress':1,'Tarnwick Precision|Capacity constraint':4,'Tarnwick Precision|Geographic and natural hazard':2,'Tarnwick Precision|Sub-tier supplier dependence':2,
  'Corvale Machine Works|Single or sole source':2,'Corvale Machine Works|Financial distress':2,'Corvale Machine Works|Capacity constraint':2,'Corvale Machine Works|Geographic and natural hazard':1,'Corvale Machine Works|Sub-tier supplier dependence':3,
  'Tidewell Manufacturing|Single or sole source':3,'Tidewell Manufacturing|Financial distress':5,'Tidewell Manufacturing|Capacity constraint':1,'Tidewell Manufacturing|Geographic and natural hazard':4,'Tidewell Manufacturing|Sub-tier supplier dependence':3,
  'Fenmark Components|Single or sole source':2,'Fenmark Components|Financial distress':2,'Fenmark Components|Capacity constraint':2,'Fenmark Components|Geographic and natural hazard':3,'Fenmark Components|Sub-tier supplier dependence':5,
  'Ashvane Metalcraft|Single or sole source':2,'Ashvane Metalcraft|Financial distress':3,'Ashvane Metalcraft|Capacity constraint':2,'Ashvane Metalcraft|Geographic and natural hazard':2,'Ashvane Metalcraft|Sub-tier supplier dependence':2}}}
}
