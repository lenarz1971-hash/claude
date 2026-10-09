{
slug:'cqt-calibration-oot-impact',
h:{
 d:function(v){ if(!v) return null; var d=new Date(v+'T00:00:00'); return isNaN(d)?null:d; },
 ds:function(d){ return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); },
 asof:function(api){ var S=api.state(); return this.d(S.f.asof)||this.d(api.today()); },
 due:function(r,api){ var d=this.d(r.last), i=api.num(r.int); if(!d||!(i>0)) return null; var x=new Date(d.getTime()); x.setDate(x.getDate()+Math.round(i)); return x; },
 status:function(r,api){ var du=this.due(r,api); if(!du) return null; var w=api.num(api.state().f.warn); if(!(w>=0)) w=30; var left=Math.round((du-this.asof(api))/86400000);
  if(left<0) return {c:'bad',t:'Overdue '+(-left)+' d'}; if(left<=w) return {c:'mid',t:'Due in '+left+' d'}; return {c:'ok',t:'Current'}; },
 pct:function(r,api){ var t=api.num(r.tol), a=api.num(r.af); if(!(t>0)||!isFinite(a)) return NaN; return Math.abs(a)/t*100; },
 cor:function(r,api){ var S=api.state(), e=api.num(S.f.err), lo=api.num(r.lo), hi=api.num(r.hi); if(!isFinite(e)) return null; if(!isFinite(lo)&&isFinite(hi)) lo=hi; if(!isFinite(hi)&&isFinite(lo)) hi=lo; if(!isFinite(lo)) return null;
  var dp=Math.max(this.dp(r.lo),this.dp(r.hi),this.dp(S.f.err)); return {lo:lo-e,hi:hi-e,t:(lo-e).toFixed(dp)+' to '+(hi-e).toFixed(dp)}; },
 dp:function(v){ var m=String(v||'').split('.')[1]; return m?m.length:0; },
 verdict:function(r,api){ var S=api.state(), c=this.cor(r,api); if(!c) return null; var g=this.d(S.f.good), dt=this.d(r.dt);
  if(g&&dt&&dt<g) return {c:'na',t:'Before window'}; var lsl=api.num(S.f.lsl), usl=api.num(S.f.usl), eps=1e-9;
  if((isFinite(lsl)&&c.lo<lsl-eps)||(isFinite(usl)&&c.hi>usl+eps)) return {c:'bad',t:'Suspect: outside limits'}; return {c:'ok',t:'Within limits'}; }
},
sections:[
 {type:'fields',title:'Calibration recall list',cols:3,fields:[
  {id:'org',label:'Site or lab',wide:true},
  {id:'asof',label:'Status as of',type:'date',hint:'Leave blank to use today.'},
  {id:'warn',label:'Warn when due within (days)',type:'number',min:0,ph:'30'},
  {id:'owner',label:'Calibration coordinator'}]},
 {type:'grid',id:'inst',title:'Instruments',rows:4,hint:'One row per gauge or instrument. As-found error is what the calibration found before any adjustment: instrument reading minus reference value, with its sign. Tolerance is the instrument\'s own accuracy limit (±), not the product tolerance.',cols:[
  {id:'id',label:'Gauge ID',w:90},{id:'desc',label:'Description',w:140,type:'textarea',rows:1},
  {id:'last',label:'Last calibrated',type:'date'},{id:'int',label:'Interval (days)',type:'number',min:1},
  {id:'tol',label:'Instrument tol ±',type:'number',min:0},{id:'af',label:'As-found error',type:'number'},
  {id:'due',label:'Due',calc:function(r,api){var d=window.TOOL.h.due(r,api);return d?window.TOOL.h.ds(d):'';}},
  {id:'st',label:'Status',calc:function(r,api){var s=window.TOOL.h.status(r,api);return s?'<span class="cc-'+s.c+'">'+s.t+'</span>':'';}},
  {id:'pct',label:'As-found % of tol',calc:function(r,api){var p=window.TOOL.h.pct(r,api);if(!isFinite(p))return '';return '<span class="cc-'+(p>100?'bad':p>=80?'mid':'ok')+'">'+p.toFixed(0)+'%'+(p>100?' OOT':'')+'</span>';}}]},
 {type:'fields',title:'Out-of-tolerance impact assessment',cols:3,hint:'For a gauge found out of tolerance. Every product result measured with it since its last good calibration is suspect. Enter the as-found error in product units (reading minus true), and the product limits it was used to accept.',fields:[
  {id:'gid',label:'Gauge found out of tolerance'},
  {id:'err',label:'As-found error (reading − true)',type:'number',hint:'Positive means the gauge read high.'},
  {id:'feat',label:'Product characteristic',wide:true},
  {id:'lsl',label:'Product LSL',type:'number'},{id:'usl',label:'Product USL',type:'number'},
  {id:'good',label:'Last good calibration',type:'date',hint:'The last calibration where it was found in tolerance.'},
  {id:'found',label:'Date found OOT',type:'date'}]},
 {type:'grid',id:'lots',title:'Product measured with that gauge',rows:3,hint:'One row per lot or job. Enter the smallest and largest readings recorded with the suspect gauge. The tool removes the as-found error to estimate the true values.',cols:[
  {id:'lot',label:'Lot or job',w:110},{id:'dt',label:'Date measured',type:'date'},{id:'qty',label:'Qty accepted',type:'number',min:0},
  {id:'lo',label:'Lowest reading',type:'number'},{id:'hi',label:'Highest reading',type:'number'},
  {id:'cor',label:'Corrected range',calc:function(r,api){var c=window.TOOL.h.cor(r,api);return c?c.t:'';}},
  {id:'v',label:'Verdict',calc:function(r,api){var v=window.TOOL.h.verdict(r,api);return v?'<span class="cc-'+v.c+'">'+v.t+'</span>':'';}}]},
 {type:'custom',id:'res',title:'Results and checks',html:'<div class="out cc-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=[], n=api.num, inst=S.g.inst.filter(function(r){return r.id||r.desc;});
 var over=[],soon=[],oot=[],noDate=[];
 inst.forEach(function(r){ var s=window.TOOL.h.status(r,api), p=window.TOOL.h.pct(r,api), nm=api.esc(r.id||r.desc);
  if(!s) noDate.push(nm); else if(s.c==='bad') over.push(nm+' (due '+window.TOOL.h.ds(window.TOOL.h.due(r,api))+')'); else if(s.c==='mid') soon.push(nm+' (due '+window.TOOL.h.ds(window.TOOL.h.due(r,api))+')');
  if(p>100) oot.push(nm+' at '+p.toFixed(0)+'% of its tolerance'); });
 if(inst.length){
  if(over.length||inst.length>noDate.length) f.push([over.length?'warn':'ok',over.length?'<b>'+over.length+' of '+inst.length+'</b> instruments are overdue and should be pulled from use until calibrated: '+over.join(', ')+'.':'No instrument on the list is overdue.']);
  if(soon.length) f.push(['','Due soon: '+soon.join(', ')+'. Schedule these before they lapse.']);
  if(noDate.length) f.push(['warn','No last calibration date or interval for: '+noDate.join(', ')+'. An instrument without a due date cannot be shown to be in calibration.']);
  if(oot.length) f.push(['warn','Found out of tolerance at calibration: '+oot.join(', ')+'. Each needs an impact assessment on the product it accepted since its last good calibration (ISO 9001:2015 clause 7.1.5.2).']);
 }
 var e=n(S.f.err), lsl=n(S.f.lsl), usl=n(S.f.usl), lots=S.g.lots.filter(function(r){return r.lot;});
 if(S.f.gid||lots.length){
  if(!isFinite(e)) f.push(['warn','Enter the as-found error of the suspect gauge to assess the product it measured.']);
  else if(!isFinite(lsl)&&!isFinite(usl)) f.push(['warn','Enter at least one product limit (LSL or USL).']);
  else {
   var bad=[],bq=0,ok=0,out=[],noRd=[],tot=0,bu=0,tu=0;
   lots.forEach(function(r){ var v=window.TOOL.h.verdict(r,api); if(!v){ noRd.push(api.esc(r.lot)); return; } var qn=n(r.qty); if(v.c==='bad'){ bad.push(api.esc(r.lot)); if(isNaN(qn)) bu++; else bq+=qn; } else if(v.c==='na') out.push(api.esc(r.lot)); else { ok++; if(isNaN(qn)) tu++; else tot+=qn; } });
   var qtxt=function(q,u,k){ return u===k?'quantity unknown':(u?'at least '+api.fmt(q,0)+' pieces; quantity not entered for '+u+' lot'+(u>1?'s':''):api.fmt(q,0)+' pieces'); };
   var gn=api.esc(S.f.gid||'The suspect gauge');
   f.push(['',gn+' read '+(e>0?'high':e<0?'low':'exactly right')+' by '+String(S.f.err).replace(/^[-−]/,'')+'. Each reading is corrected by subtracting that error: true ≈ reading − ('+api.esc(S.f.err)+').']);
   if(bad.length) f.push(['warn','<b>'+bad.length+' lot'+(bad.length>1?'s':'')+'</b> ('+qtxt(bq,bu,bad.length)+') may contain nonconforming product once the error is removed: '+bad.join(', ')+'. Locate and contain them, notify the customer if shipped, and re-inspect with a good gauge.']);
   else if(lots.length) f.push(['ok','After correction every listed lot stays inside the product limits. Record the assessment and its evidence; no recall is indicated.']);
   if(ok) f.push(['ok',ok+' lot'+(ok>1?'s':'')+' ('+qtxt(tot,tu,ok)+') remain within limits after correction.']);
   if(out.length) f.push(['','Measured before the last good calibration, so outside the suspect window: '+out.join(', ')+'.']);
   if(noRd.length) f.push(['warn','No readings for: '+noRd.join(', ')+'. Without the recorded values these lots must be treated as suspect.']);
   if(!S.f.good) f.push(['warn','Enter the last good calibration date. It sets how far back the suspect window goes.']);
  }
 }
 if(f.length) f.push(['','Calibration shows accuracy against a traceable standard at one moment. The as-found result tells you whether past product was measured correctly; the as-left result only tells you about the future.']);
 root.querySelector('.cc-out').innerHTML=api.flags(f,'Add instruments to see what is overdue, due soon or out of tolerance.');
},
example:{f:{org:'Ironwood Precision Fittings, gauge crib B',asof:'2026-09-30',warn:'30',owner:'R. Delgado',gid:'MIC-114',err:'0.0004',feat:'Spool land OD, 0.7500 ± 0.0010 in',lsl:'0.7490',usl:'0.7510',good:'2026-06-15',found:'2026-09-14'},
 g:{inst:[
  {id:'MIC-114',desc:'0–1 in outside micrometer',last:'2026-09-14',int:'90',tol:'0.0001',af:'0.0004'},
  {id:'MIC-121',desc:'1–2 in outside micrometer',last:'2026-06-20',int:'90',tol:'0.0001',af:'0.00005'},
  {id:'CAL-007',desc:'6 in digital caliper',last:'2026-04-02',int:'180',tol:'0.001',af:'-0.0003'},
  {id:'BG-033',desc:'0.750 in bore gauge',last:'2026-08-11',int:'60',tol:'0.0002',af:'0.0001'},
  {id:'HT-002',desc:'Rockwell hardness tester',last:'2026-01-20',int:'365',tol:'1.0',af:'0.4'},
  {id:'TW-019',desc:'Torque wrench 20–100 in·lb',last:'2026-07-10',int:'90',tol:'4',af:'1.5'}],
 lots:[
  {lot:'J-2604',dt:'2026-06-10',qty:'400',lo:'0.7491',hi:'0.7507'},
  {lot:'J-2611',dt:'2026-07-08',qty:'650',lo:'0.7497',hi:'0.7508'},
  {lot:'J-2618',dt:'2026-07-29',qty:'500',lo:'0.7492',hi:'0.7504'},
  {lot:'J-2625',dt:'2026-08-19',qty:'720',lo:'0.7495',hi:'0.7509'},
  {lot:'J-2631',dt:'2026-09-09',qty:'480',lo:'0.7493',hi:'0.7506'}]}}
}
