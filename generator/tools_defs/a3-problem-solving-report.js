{
slug:'a3-problem-solving-report',
calc:function(S,api){
 var n=api.num, F=S.f, low=F.dir!=='Higher is better', pts=S.g.d.map(function(r,i){ return {i:i,p:r.p||String(i+1),v:n(r.v),ph:r.ph||'Before'}; }).filter(function(x){ return isFinite(x.v); });
 function mean(a){ return a.length?a.reduce(function(s,x){ return s+x.v; },0)/a.length:NaN; }
 var bef=pts.filter(function(x){ return x.ph==='Before'; }), aft=pts.filter(function(x){ return x.ph==='After'; });
 var mb=mean(bef), ma=mean(aft), base=n(F.base); if(isNaN(base)) base=mb; var tgt=n(F.tgt);
 var imp=isFinite(base)&&isFinite(ma)&&base!==0?100*(low?(base-ma):(ma-base))/Math.abs(base):NaN;
 var gap=isFinite(base)&&isFinite(ma)&&isFinite(tgt)&&tgt!==base?100*(ma-base)/(tgt-base):NaN;
 var met=isFinite(ma)&&isFinite(tgt)?(low?ma<=tgt:ma>=tgt):null;
 return {pts:pts,bef:bef,aft:aft,mb:mb,ma:ma,base:base,tgt:tgt,imp:imp,gap:gap,met:met,low:low};
},
sections:[
 {type:'fields',cls:'printhide',title:'Title and people',cols:3,hint:'An A3 is owned by one person, usually with a coach. The title names the problem, not the solution.',fields:[
  {id:'title',label:'Title',wide:true,ph:'e.g. Reducing late shipments from the kitting area'},
  {id:'own',label:'Owner'},{id:'coach',label:'Coach or sponsor'},{id:'date',label:'Date',type:'date'},
  {id:'team',label:'Team',wide:true}]},
 {type:'fields',cls:'printhide',title:'Background',hint:'Why this problem, why now: the business reason and how it links to a goal the organization already has.',fields:[
  {id:'bg',label:'Background',type:'textarea',wide:true,rows:3}]},
 {type:'fields',cls:'printhide',title:'Current condition',cols:3,hint:'What is happening now, from going to see: facts, a simple picture of the process, and one measure with its baseline.',fields:[
  {id:'cur',label:'Current condition',type:'textarea',wide:true,rows:3},
  {id:'met',label:'Measure',ph:'e.g. Late shipments per week'},
  {id:'unit',label:'Unit',ph:'e.g. %'},
  {id:'dir',label:'Better is',type:'select',opts:['Lower is better','Higher is better']},
  {id:'base',label:'Baseline',type:'number',hint:'Leave blank to use the mean of the "Before" data.'},
  {id:'tgt',label:'Target',type:'number'},
  {id:'tdate',label:'Target date',type:'date'}]},
 {type:'grid',id:'d',cls:'printhide',title:'The measure over time',rows:4,hint:'One row per period. Mark each Before or After the countermeasures. The A3 draws them as a run chart with the target.',cols:[
  {id:'p',label:'Period',w:110},
  {id:'v',label:'Value',type:'number'},
  {id:'ph',label:'Phase',type:'select',opts:['Before','After']}]},
 {type:'fields',cls:'printhide',title:'Goal',hint:'How much, by when, measured how. The goal states the condition you want, not the action you will take.',fields:[
  {id:'goal',label:'Goal',type:'textarea',wide:true}]},
 {type:'fields',cls:'printhide',title:'Root cause analysis',hint:'The analysis that links the current condition to its causes: a fishbone, 5 whys, a Pareto chart. Summarize it here; keep the detail in the <a href="/tools/fishbone-5-whys.html">fishbone and 5 whys</a> tool.',fields:[
  {id:'rca',label:'Analysis summary',type:'textarea',wide:true,rows:3},
  {id:'rc',label:'Root causes, one per line',type:'textarea',wide:true,rows:3}]},
 {type:'grid',id:'cm',cls:'printhide',title:'Countermeasures',rows:2,hint:'Each countermeasure answers a root cause. "Countermeasure", not "solution": it is the best answer known now, and may change.',cols:[
  {id:'c',label:'Countermeasure',w:260,type:'textarea',rows:1},
  {id:'rc',label:'Root cause it addresses',w:200,type:'textarea',rows:1},
  {id:'eff',label:'Expected effect',w:180,type:'textarea',rows:1}]},
 {type:'grid',id:'pl',cls:'printhide',title:'Implementation plan',rows:3,hint:'What, who, when. One owner per action.',cols:[
  {id:'a',label:'Action',w:260,type:'textarea',rows:1},
  {id:'who',label:'Who',w:110},
  {id:'when',label:'When',type:'date'},
  {id:'s',label:'Status',type:'select',opts:['Not started','In progress','Done']}]},
 {type:'fields',cls:'printhide',title:'Follow-up',hint:'How and when the result will be checked, what it showed, and what happens next: standardize, spread, or start another cycle.',fields:[
  {id:'fu',label:'How and when it will be checked',type:'textarea'},
  {id:'resu',label:'Results so far',type:'textarea'},
  {id:'next',label:'Standardize and next steps',type:'textarea',wide:true}]},
 {type:'custom',id:'a3',cls:'a3sec',title:'Your A3',hint:'The whole story on one page. Print or save as PDF: only this sheet prints, on one landscape page.',html:'<div class="a3"></div>'},
 {type:'custom',id:'chk',cls:'printhide',title:'Checks',html:'<div class="stat a3-stat"></div><div class="out a3-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), F=S.f, esc=api.esc, f=[], C=T.calc(S,api), u=F.unit?((F.unit==='%'?'':' ')+esc(F.unit)):'';
 function para(v,empty){ return v?'<p>'+esc(v)+'</p>':'<p class="empty">'+empty+'</p>'; }
 function box(i,t,body){ return '<div class="a3-b"><h4><i>'+i+'</i>'+t+'</h4>'+body+'</div>'; }
 function d(v){ if(!v) return ''; var x=new Date(v+'T00:00'); return isNaN(x)?esc(v):x.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
 function fm(v){ return isFinite(v)?api.fmt(v,Math.abs(v)<10?2:1):'—'; }
 /* run chart */
 var ch='';
 if(C.pts.length){
  var W=520, H=200, L=44, R=26, Tp=14, B=34, vals=C.pts.map(function(x){ return x.v; }).concat([C.tgt,C.base].filter(isFinite)), lo=Math.min.apply(null,vals), hi=Math.max.apply(null,vals); if(hi===lo){ hi+=1; lo-=1; } var pad=(hi-lo)*0.12; lo-=pad; hi+=pad; if(lo<0&&Math.min.apply(null,vals)>=0) lo=0;
  var N=C.pts.length, X=function(i){ return L+(N===1?(W-L-R)/2:(W-L-R)*i/(N-1)); }, Y=function(v){ return Tp+(H-Tp-B)*(hi-v)/(hi-lo); };
  ch='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Run chart of the measure"><style>text{font:10px Archivo,sans-serif;fill:#16273A}.ax{font:600 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  for(var k=0;k<=4;k++){ var v=lo+(hi-lo)*k/4, y=Y(v); ch+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="#E3E8EE"/><text class="ax" x="'+(L-5)+'" y="'+(y+3)+'" text-anchor="end">'+api.fmt(v,Math.abs(hi-lo)<10?1:0)+'</text>'; }
  var ia=C.pts.map(function(x){ return x.ph; }).indexOf('After'); if(ia>0){ var xs=(X(ia-1)+X(ia))/2; ch+='<line x1="'+xs+'" x2="'+xs+'" y1="'+Tp+'" y2="'+(H-B)+'" stroke="#4A5D71" stroke-dasharray="3 3"/><text class="ax" x="'+(xs+4)+'" y="'+(Tp+8)+'">COUNTERMEASURES</text>'; }
  if(isFinite(C.tgt)) ch+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(C.tgt)+'" y2="'+Y(C.tgt)+'" stroke="#2E7D4F" stroke-width="1.6" stroke-dasharray="6 4"/><text class="ax" x="'+(L+4)+'" y="'+(Y(C.tgt)+(C.low?12:-4))+'" style="fill:#2E7D4F">TARGET '+api.fmt(C.tgt,2)+'</text>';
  if(isFinite(C.base)) ch+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(C.base)+'" y2="'+Y(C.base)+'" stroke="#C0392B" stroke-width="1.2" stroke-dasharray="2 3"/><text class="ax" x="'+(L+4)+'" y="'+(Y(C.base)+(C.low?-4:12))+'" style="fill:#C0392B">BASELINE '+api.fmt(C.base,2)+'</text>';
  ch+='<polyline fill="none" stroke="#0F3E68" stroke-width="1.8" points="'+C.pts.map(function(x,i){ return X(i)+','+Y(x.v); }).join(' ')+'"/>';
  var every=Math.ceil(N/12);
  C.pts.forEach(function(x,i){ ch+='<circle cx="'+X(i)+'" cy="'+Y(x.v)+'" r="3.6" fill="'+(x.ph==='After'?'#D8B147':'#0F3E68')+'" stroke="#fff"><title>'+esc(x.p)+': '+x.v+'</title></circle>'; if(i%every===0) ch+='<text class="ax" x="'+X(i)+'" y="'+(H-B+14)+'" text-anchor="middle">'+esc(String(x.p).slice(0,9))+'</text>'; });
  ch+='<text class="ax" x="'+L+'" y="'+(H-4)+'">'+esc((F.met||'Measure').toUpperCase())+(F.unit?' ('+esc(F.unit)+')':'')+'</text></svg>';
 }
 var kpi='<div class="a3-kpi"><span>Baseline <b>'+fm(C.base)+u+'</b></span><span>Target <b>'+fm(C.tgt)+u+'</b>'+(F.tdate?' by '+d(F.tdate):'')+'</span>'+(C.aft.length?'<span>After <b>'+fm(C.ma)+u+'</b></span>':'')+'</div>';
 var rcs=api.lines('rc');
 var cm=S.g.cm.filter(function(r){ return r.c; }), pl=S.g.pl.filter(function(r){ return r.a; });
 var left=box(1,'Background',para(F.bg,'Why this problem matters, and why now.'))+
  box(2,'Current condition',para(F.cur,'What is happening now, with the facts.')+kpi+(ch?'<div class="a3-ch">'+ch+'</div>':''))+
  box(3,'Goal',para(F.goal,'How much, by when.'))+
  box(4,'Root cause analysis',para(F.rca,'The analysis, summarized.')+(rcs.length?'<ul>'+rcs.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>':''));
 var right=box(5,'Countermeasures',cm.length?'<table class="a3t"><thead><tr><th>Countermeasure</th><th>Root cause</th><th>Expected effect</th></tr></thead><tbody>'+cm.map(function(r){ return '<tr><td>'+esc(r.c)+'</td><td>'+esc(r.rc||'')+'</td><td>'+esc(r.eff||'')+'</td></tr>'; }).join('')+'</tbody></table>':'<p class="empty">Each countermeasure, against the root cause it answers.</p>')+
  box(6,'Plan',pl.length?'<table class="a3t"><thead><tr><th>Action</th><th>Who</th><th>When</th><th>Status</th></tr></thead><tbody>'+pl.map(function(r){ return '<tr><td>'+esc(r.a)+'</td><td>'+esc(r.who||'')+'</td><td class="k">'+d(r.when)+'</td><td>'+esc(r.s||'')+'</td></tr>'; }).join('')+'</tbody></table>':'<p class="empty">What, who, when.</p>')+
  box(7,'Follow-up',para(F.fu,'How and when the result will be checked.')+(F.resu?'<p><b>Results:</b> '+esc(F.resu)+'</p>':'')+(C.aft.length?'<div class="a3-kpi"><span>Change <b>'+(isFinite(C.imp)?(C.imp>=0?'':'−')+api.fmt(Math.abs(C.imp),1)+'% '+(C.imp>=0?'better':'worse'):'—')+'</b></span><span>Gap closed <b>'+(isFinite(C.gap)?api.fmt(C.gap,0)+'%':'—')+'</b></span></div>':'')+(F.next?'<p><b>Next:</b> '+esc(F.next)+'</p>':''));
 root.querySelector('.a3').innerHTML='<div class="a3-hd"><b>'+(esc(F.title)||'A3 title')+'</b><span>Owner: '+(esc(F.own)||'—')+'</span><span>Coach: '+(esc(F.coach)||'—')+'</span>'+(F.team?'<span>Team: '+esc(F.team)+'</span>':'')+'<span>'+(d(F.date)||'')+'</span></div><div class="a3-cols"><div class="a3-col">'+left+'</div><div class="a3-col">'+right+'</div></div>';
 /* stats and checks */
 root.querySelector('.a3-stat').innerHTML='<div><b>'+fm(C.base)+u+'</b><span>Baseline'+(isNaN(api.num(F.base))&&C.bef.length?' (mean of before)':'')+'</span></div><div><b>'+fm(C.tgt)+u+'</b><span>Target</span></div><div><b>'+fm(C.ma)+u+'</b><span>Mean after ('+C.aft.length+' point'+(C.aft.length===1?'':'s')+')</span></div><div><b>'+(isFinite(C.imp)?api.fmt(C.imp,1)+'%':'—')+'</b><span>Improvement on baseline</span></div><div><b>'+(isFinite(C.gap)?api.fmt(C.gap,0)+'%':'—')+'</b><span>Share of the gap closed</span></div>';
 if(!F.title) f.push(['warn','Give the A3 a title that names the problem.']);
 if(!F.met||!isFinite(C.tgt)) f.push(['warn','Name one measure and a target. An A3 without a measure cannot show whether the problem was solved.']);
 if(isFinite(C.tgt)&&isFinite(C.base)&&(C.low?C.tgt>=C.base:C.tgt<=C.base)) f.push(['warn','The target is not better than the baseline. Check "Better is".']);
 if(F.goal&&!/\d/.test(F.goal)) f.push(['warn','The goal has no number in it. Say how much and by when.']);
 if(F.goal&&/\b(implement|install|buy|train|introduce|create|develop)\b/i.test(F.goal)) f.push(['','The goal reads like an action ("implement", "install", "train"). State the condition you want; the actions belong in the plan.']);
 if(!rcs.length) f.push(['warn','No root causes are listed. Countermeasures that are not tied to a cause are guesses.']);
 var un=cm.filter(function(r){ return !r.rc; }); if(un.length) f.push(['warn',un.length+' countermeasure'+(un.length===1?' does':'s do')+' not say which root cause '+(un.length===1?'it answers':'they answer')+'.']);
 if(rcs.length&&cm.length){ var hit=rcs.filter(function(rc){ var w=rc.toLowerCase().split(/\W+/).filter(function(x){ return x.length>4; }); return cm.some(function(r){ var t=(r.rc||'').toLowerCase(); return t.indexOf(rc.toLowerCase().slice(0,20))>=0||w.some(function(x){ return t.indexOf(x)>=0; }); }); }); var miss=rcs.filter(function(rc){ return hit.indexOf(rc)<0; }); if(miss.length) f.push(['','No countermeasure seems to answer: '+miss.map(esc).join('; ')+'.']); }
 var nop=pl.filter(function(r){ return !r.who||!r.when; }); if(nop.length) f.push(['warn',nop.length+' action'+(nop.length===1?' has':'s have')+' no owner or no date.']);
 var today=api.today(), late=pl.filter(function(r){ return r.when&&r.when<today&&r.s!=='Done'; }); if(late.length) f.push(['warn','Overdue: '+late.map(function(r){ return esc(r.a.slice(0,50)); }).join('; ')+'.']);
 if(!F.fu) f.push(['warn','Follow-up is blank. Say how and when the result will be checked; that is the Check in PDCA.']);
 if(C.aft.length){ if(C.met===true) f.push(['ok','The mean after the countermeasures ('+fm(C.ma)+u+') meets the target. Standardize the change and keep watching the measure.']);
  else if(C.met===false) f.push(['warn','The mean after the countermeasures ('+fm(C.ma)+u+') does not meet the target of '+fm(C.tgt)+u+' ('+(isFinite(C.gap)?api.fmt(C.gap,0)+'% of the gap closed':'')+'). Go back to the root cause analysis: another cause, or a countermeasure that is not working as planned.']);
  if(C.aft.length<3) f.push(['','Only '+C.aft.length+' point'+(C.aft.length===1?'':'s')+' after the change. A few more will show whether the improvement holds.']); }
 else if(pl.length&&pl.every(function(r){ return r.s==='Done'; })) f.push(['','Every action is done. Add the "After" data to show the effect.']);
 var len=['bg','cur','goal','rca','rc','fu','resu','next'].reduce(function(a,k){ return a+(F[k]||'').length; },0)+cm.concat(pl).reduce(function(a,r){ return a+(r.c||r.a||'').length+(r.rc||'').length+(r.eff||'').length; },0);
 if(len>3200) f.push(['warn','About '+api.fmt(len,0)+' characters of text. Much over 3,000 will not fit on one page; an A3 is short on purpose. Cut to the facts that carry the story.']);
 root.querySelector('.a3-out').innerHTML=api.flags(f);
},
example:{f:{title:'Reducing late shipments from the kitting area',own:'Priya Raman, operations analyst',coach:'Dev Holloway, plant manager',date:'2026-09-30',team:'Kitting lead, planner, warehouse lead, quality technician',
 bg:'On-time delivery is a plant goal for 2026 (98%). Kitting supplies the final assembly cells for the RX controller family; when a kit is late, the order ships late. Kitting caused 41% of late orders in the second quarter.',
 cur:'Late shipments caused by kitting averaged 6.2% of orders a week (April to June). Going to see: kits are picked from a printed list in bin-number order, not route order; 1 kit in 5 waits for a part found short at the end of picking; shortages are only known when the picker reaches the empty bin.',
 met:'Late shipments caused by kitting',unit:'%',dir:'Lower is better',base:'',tgt:'2',tdate:'2026-11-30',
 goal:'Late shipments caused by kitting at or below 2% of orders a week by 30 November 2026, sustained for 6 weeks.',
 rca:'Pareto of 112 late kits: 58% waited for a short part, 27% were picked in the wrong sequence for the cell, 15% other. 5 whys on shortages: bins are replenished on a fixed weekly count, not on use, so fast movers run out mid-week.',
 rc:'Bins replenished on a weekly count, not on use\nPick list printed in bin order, not in the order the cell needs\nShortages found only at the empty bin',
 fu:'Weekly late-shipment report, reviewed at the Monday operations meeting until 6 weeks at or below target. Owner reviews the A3 with the coach on 30 Nov.',
 resu:'Four weeks after the change, late shipments from kitting averaged 2.45%, and the last week was below target. Shortage-related lateness is down to one or two kits a week.',
 next:'Extend two-bin replenishment to the remaining 60 slow-moving parts. Standardize the route-order pick list in the kitting work instruction.'},
 g:{d:[{p:'Wk 27',v:'6.4',ph:'Before'},{p:'Wk 28',v:'5.9',ph:'Before'},{p:'Wk 29',v:'6.8',ph:'Before'},{p:'Wk 30',v:'5.7',ph:'Before'},{p:'Wk 31',v:'6.1',ph:'Before'},{p:'Wk 32',v:'6.3',ph:'Before'},{p:'Wk 35',v:'3.1',ph:'After'},{p:'Wk 36',v:'2.6',ph:'After'},{p:'Wk 37',v:'2.2',ph:'After'},{p:'Wk 38',v:'1.9',ph:'After'}],
 cm:[{c:'Two-bin kanban for the 40 fastest-moving parts',rc:'Bins replenished on a weekly count, not on use',eff:'Shortages at picking cut by most of the 58%'},
  {c:'Pick list sorted in the cell\'s build order',rc:'Pick list printed in bin order, not in the order the cell needs',eff:'Sequence errors close to zero'},
  {c:'Empty-bin card triggers a same-day refill',rc:'Shortages found only at the empty bin',eff:'Short parts known a day earlier'}],
 pl:[{a:'Size and label two-bin locations',who:'Warehouse lead',when:'2026-08-15',s:'Done'},{a:'Change the pick-list report sort order',who:'Planner',when:'2026-08-20',s:'Done'},{a:'Train pickers and warehouse staff on the card system',who:'Kitting lead',when:'2026-08-22',s:'Done'},{a:'Extend two-bin to remaining 60 parts',who:'Warehouse lead',when:'2026-11-15',s:'In progress'}]}}
}
