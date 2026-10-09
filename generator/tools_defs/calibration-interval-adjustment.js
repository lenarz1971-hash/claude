{
slug:'calibration-interval-adjustment',
h:{
 d:function(v){ if(!v) return null; var d=new Date(v+'T00:00:00'); return isNaN(d)?null:d; },
 ds:function(d){ return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); },
 cfg:function(api){ var S=api.state(), n=api.num, c={N:Math.round(n(S.f.n)),up:n(S.f.up),dn:n(S.f.dn),mn:n(S.f.mn),mx:n(S.f.mx),tg:n(S.f.tg)};
  if(!(c.N>=1)) c.N=3; if(!(c.up>1)) c.up=1.25; if(!(c.dn>0&&c.dn<1)) c.dn=0.5; if(!(c.mn>0)) c.mn=30; if(!(c.mx>0)) c.mx=730; if(!(c.tg>0&&c.tg<100)) c.tg=95; return c; },
 hist:function(s){ var t=String(s||'').toUpperCase().replace(/OOT/g,'O').replace(/IN|IT/g,'I').replace(/[\s,;\-\/]+/g,''), bad=t.replace(/[IO]/g,''); return {t:t.replace(/[^IO]/g,''),bad:bad}; },
 ev:function(r,api){
  var c=this.cfg(api), I=api.num(r.int), h=this.hist(r.hist), o={c:c,I:I,h:h.t,bad:h.bad};
  if(!(I>0)) return o;
  var n=h.t.length; o.n=n; if(!n){ o.act='none'; o.rec=I; return o; }
  o.oot=(h.t.match(/O/g)||[]).length; o.rel=(n-o.oot)/n*100;
  var s=0; for(var i=n-1;i>=0&&h.t[i]==='I';i--) s++; o.streak=s; o.last=h.t[n-1];
  if(o.last==='O'){ o.act='shorten'; o.rec=Math.max(c.mn,Math.round(I*c.dn)); }
  else if(s>=c.N&&o.rel>=c.tg-1e-9){ o.act='extend'; o.rec=Math.min(c.mx,Math.round(I*c.up)); }
  else { o.act='hold'; o.rec=I; }
  if(o.oot>0&&o.oot<n){ o.expRaw=Math.round(I*Math.log(c.tg/100)/Math.log(o.rel/100)); o.exp=Math.min(c.mx,Math.max(c.mn,o.expRaw)); }
  var ld=this.d(r.last); if(ld){ var x=new Date(ld.getTime()); x.setDate(x.getDate()+o.rec); o.due=x; }
  return o;
 }
},
sections:[
 {type:'fields',title:'Interval policy',cols:3,hint:'The settings below are a common practical adjustment rule, sometimes called a staircase or simple response method: extend after a run of in-tolerance results, shorten after an out-of-tolerance result. They are example values. Your calibration procedure sets the real ones.',fields:[
  {id:'org',label:'Lab or site',wide:true},
  {id:'tg',label:'Reliability target (% in tolerance at due date)',type:'number',min:1,max:99,ph:'95'},
  {id:'n',label:'Consecutive in-tolerance results to extend',type:'number',min:1,ph:'3'},
  {id:'up',label:'Extend by factor',type:'number',min:1,ph:'1.25'},
  {id:'dn',label:'Shorten by factor (after OOT)',type:'number',min:0,max:1,ph:'0.5'},
  {id:'mn',label:'Minimum interval (days)',type:'number',min:1,ph:'30'},
  {id:'mx',label:'Maximum interval (days)',type:'number',min:1,ph:'730'},
  {id:'asof',label:'Review date',type:'date'},
  {id:'own',label:'Reviewed by'}]},
 {type:'grid',id:'g',title:'Gauges and as-found history',rows:4,hint:'As-found history, oldest first: I for in tolerance, O for out of tolerance, as found before any adjustment. Enter the results since the interval was last changed; older results at a different interval say less about the current one.',cols:[
  {id:'id',label:'Gauge ID',w:80},
  {id:'desc',label:'Description',type:'textarea',rows:1,w:120},
  {id:'int',label:'Interval (days)',type:'number',min:1},
  {id:'last',label:'Last calibrated',type:'date'},
  {id:'hist',label:'As-found history',w:96},
  {id:'rel',label:'In tol',calc:function(r,api){var o=window.TOOL.h.ev(r,api);return o.n?o.rel.toFixed(0)+'% <small>('+(o.n-o.oot)+' of '+o.n+')</small>':'';}},
  {id:'act',label:'Action',calc:function(r,api){var o=window.TOOL.h.ev(r,api);if(!o.act)return '';var m={extend:['ok','Extend'],shorten:['bad','Shorten'],hold:['mid','Hold'],none:['mid','No history']}[o.act];return '<span class="ci-'+m[0]+'">'+m[1]+'</span>';}},
  {id:'rec',label:'Next interval',calc:function(r,api){var o=window.TOOL.h.ev(r,api);return o.rec?o.rec+' d':'';}},
  {id:'due',label:'Next due',calc:function(r,api){var o=window.TOOL.h.ev(r,api);return o.due?window.TOOL.h.ds(o.due):'';}}]},
 {type:'custom',id:'out',title:'Recommendations and checks',html:'<div class="out ci-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), f=[], esc=api.esc, c=T.h.cfg(api);
 var rows=S.g.g.filter(function(r){return r.id||r.desc||r.hist;});
 if(!rows.length){ root.querySelector('.ci-out').innerHTML=api.flags([],'Add a gauge with its current interval and as-found history.'); return; }
 var asof=T.h.d(S.f.asof)||T.h.d(api.today()), tgIn=api.num(S.f.tg);
 if(!isNaN(tgIn)&&!(tgIn>0&&tgIn<100)) f.push(['warn','A reliability target of '+api.esc(S.f.tg)+'% cannot be used: it must be above 0 and below 100 (no interval keeps every instrument in tolerance with certainty). The default of 95% is used instead.']);
 f.push(['','Rule in use: extend ×'+c.up+' after '+c.N+' consecutive in-tolerance results (only if the observed in-tolerance rate meets the '+c.tg+'% target), shorten ×'+c.dn+' after an out-of-tolerance result, otherwise hold; limits '+c.mn+' to '+c.mx+' days.']);
 rows.forEach(function(r,i){ var o=T.h.ev(r,api), nm='<b>'+esc(r.id||r.desc||('Row '+(i+1)))+'</b>';
  if(!(o.I>0)){ f.push(['warn',nm+': enter the current interval in days.']); return; }
  if(o.bad) f.push(['warn',nm+': ignored "'+esc(o.bad)+'" in the history. Use I and O only.']);
  if(o.act==='none'){ f.push(['warn',nm+': no as-found history. Keep the '+o.I+'-day interval, set from the manufacturer recommendation, a similar instrument or engineering judgment, until results build up.']); return; }
  var due=o.due?' Next due <b>'+T.h.ds(o.due)+'</b>'+(o.due<asof?', which is already past: calibrate now':'')+'.':' Enter the last calibration date to get the due date.';
  if(o.act==='extend') f.push(['ok',nm+': '+o.streak+' in-tolerance results in a row and '+o.rel.toFixed(0)+'% in tolerance overall. Extend from '+o.I+' to <b>'+o.rec+' days</b>'+(o.rec===c.mx?' (capped at the maximum)':'')+'.'+due]);
  else if(o.act==='shorten') f.push(['warn',nm+': found out of tolerance at the last calibration. Shorten from '+o.I+' to <b>'+o.rec+' days</b>'+(o.rec===c.mn?' (held at the minimum)':'')+'.'+due+' Also assess the product it accepted since its last good calibration (see the calibration recall and OOT impact tool).']);
  else f.push(['',nm+': hold at <b>'+o.I+' days</b>. '+(o.streak<c.N?'Only '+o.streak+' in-tolerance result'+(o.streak===1?'':'s')+(o.oot?' since the last out-of-tolerance':' at this interval'):'In-tolerance rate '+o.rel.toFixed(0)+'% is below the '+c.tg+'% target')+'.'+due]);
  if(o.rel<c.tg&&o.exp>0) f.push(['warn',nm+': observed in-tolerance rate '+o.rel.toFixed(0)+'% over '+o.n+' calibrations is below the '+c.tg+'% target. An exponential reliability model, R(t) = e<sup>−λt</sup>, would put the interval for '+c.tg+'% at about <b>'+o.exp+' days</b>'+(o.expRaw<c.mn?' (the raw estimate, '+o.expRaw+' days, is below the '+c.mn+'-day minimum, so the minimum applies)':o.expRaw>c.mx?' (the raw estimate, '+o.expRaw+' days, is above the '+c.mx+'-day maximum, so the maximum applies)':'')+'. With '+o.n+' results this estimate is very uncertain; use it to question the interval, not to set it.']);
  if(o.n<c.N&&o.act!=='shorten') f.push(['',nm+': only '+o.n+' result'+(o.n===1?'':'s')+' so far; too few to change the interval.']);
 });
 var all=rows.map(function(r){return T.h.ev(r,api);}).filter(function(o){return o.n;}), N=0, O=0; all.forEach(function(o){N+=o.n;O+=o.oot;});
 if(N) f.push([N-O>=c.tg/100*N?'ok':'warn','Across the list, '+(N-O)+' of '+N+' calibrations ('+((N-O)/N*100).toFixed(0)+'%) found the gauge in tolerance, against a '+c.tg+'% target. A program well above its target may be calibrating too often; one below it is accepting product with gauges that drifted.']);
 f.push(['','Statistical methods that fit a reliability model to the in-tolerance history of a whole group of similar instruments, and the simple response rules used here, are described in NCSL International RP-1, Establishment and Adjustment of Calibration Intervals, and in ILAC-G24 / OIML D 10. Base any change on as-found data, never as-left.']);
 root.querySelector('.ci-out').innerHTML=api.flags(f);
 root.querySelectorAll('table.tg textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });

},
example:{f:{org:'Dairy cooperative, QC laboratory',tg:'95',n:'3',up:'1.25',dn:'0.5',mn:'30',mx:'730',asof:'2026-10-01',own:'J. Whitfield'},
 g:{g:[
  {id:'BAL-01',desc:'Analytical balance, 220 g',int:'365',last:'2026-03-10',hist:'I I I I'},
  {id:'THM-07',desc:'Digital probe thermometer',int:'180',last:'2026-09-24',hist:'I I I I O'},
  {id:'PH-02',desc:'Bench pH meter',int:'90',last:'2026-08-15',hist:'I I I'},
  {id:'TW-04',desc:'Torque wrench, cap fitting',int:'365',last:'2025-11-20',hist:'I I'},
  {id:'PG-11',desc:'Pasteurizer pressure gauge',int:'365',last:'2026-05-02',hist:''}]}}
}
