{
slug:'management-review',
sections:[
 {type:'fields',title:'Review details',cols:3,fields:[
  {id:'org',label:'Organization and QMS scope',wide:true},
  {id:'date',label:'Review date',type:'date'},
  {id:'prev',label:'Previous review date',type:'date'},
  {id:'tm',label:'Top management present',type:'select',opts:['Yes','No']},
  {id:'att',label:'Attendees',type:'textarea',wide:true,ph:'Names and roles'}]},
 {type:'grid',id:'pa',title:'Actions from previous reviews',rows:3,hint:'Clause 9.3.2 a. Carry every open action forward until it is closed or formally cancelled.',cols:[
  {id:'a',label:'Action',w:230,type:'textarea',rows:1},
  {id:'o',label:'Owner',w:120},
  {id:'d',label:'Due',type:'date'},
  {id:'s',label:'Status',type:'select',opts:['Closed','Open','Cancelled']},
  {id:'st',label:'At review date',calc:function(r,api){var R=api.state().f.date;if(!r.a&&!r.d)return '';if(r.s==='Closed'||r.s==='Cancelled')return r.s;if(r.d&&R&&r.d<R)return '<span style="color:#C0392B">Overdue</span>';return r.d?'Open':'No due date';}}]},
 {type:'custom',id:'in',title:'Review inputs (ISO 9001:2015, 9.3.2)',hint:'Summarized from ISO 9001:2015 clause 9.3.2. Mark each input and summarize what was presented, with the data and the trend, not just "reviewed".',html:'<div class="tgw"><table class="mv mr-in"></table></div>'},
 {type:'grid',id:'k',title:'QMS effectiveness scorecard',rows:4,hint:'The evidence behind the inputs. Choose whether a higher or lower value is better for each measure.',cols:[
  {id:'m',label:'Measure',w:220,type:'textarea',rows:1},
  {id:'t',label:'Target',type:'number'},
  {id:'v',label:'Actual',type:'number'},
  {id:'p',label:'Prior period',type:'number'},
  {id:'dir',label:'Better is',type:'select',opts:['Higher','Lower']},
  {id:'ok',label:'Result',calc:function(r,api){var t=api.num(r.t),v=api.num(r.v);if(isNaN(t)||isNaN(v)||!r.dir)return '';var ok=r.dir==='Higher'?v>=t:v<=t;return ok?'<span style="color:#1F8C55">Met</span>':'<span style="color:#C0392B">Missed</span>';}},
  {id:'tr',label:'Trend',calc:function(r,api){var p=api.num(r.p),v=api.num(r.v);if(isNaN(p)||isNaN(v)||!r.dir)return '';if(v===p)return 'Flat';var b=r.dir==='Higher'?v>p:v<p;return b?'Better':'Worse';}}]},
 {type:'grid',id:'o',title:'Review outputs: decisions and actions (9.3.3)',rows:3,hint:'Every decision gets a category, an owner and a due date. If the review decides no change or no new resource is needed, record that decision too.',cols:[
  {id:'a',label:'Decision or action',w:260,type:'textarea',rows:1},
  {id:'c',label:'Category',type:'select',opts:['Improvement opportunity','Change to the QMS','Resource need']},
  {id:'o',label:'Owner',w:120},
  {id:'d',label:'Due',type:'date'}]},
 {type:'custom',id:'res',title:'Completeness checks',html:'<div class="stat mr-stat"></div><div class="out mr-out"></div>'}
],
blankX:function(){return {i:{}};},
update:function(root,api){
 var S=api.state(), x=S.x.i||(S.x.i={}), f=[];
 var IN=[['a','a','Where the actions from earlier reviews stand'],['b','b','Shifts in the internal and external issues that affect the QMS'],
  ['c1','c 1','How satisfied customers are, and what relevant interested parties are saying'],['c2','c 2','Progress against the quality objectives'],
  ['c3','c 3','How processes are performing and whether products and services conform'],['c4','c 4','Nonconformities found and the corrective actions taken'],
  ['c5','c 5','What monitoring and measurement show'],['c6','c 6','Findings from audits'],['c7','c 7','How suppliers and other external providers are performing'],
  ['d','d','Whether resources are adequate'],['e','e','Whether the actions on risks and opportunities (6.1) worked'],['f','f','Where the QMS could improve']];
 var tb=root.querySelector('table.mr-in');
 if(!tb.querySelector('select')){
  tb.innerHTML='<thead><tr><th>Item</th><th>Input</th><th>Status</th><th>Summary of what was presented</th></tr></thead><tbody>'+IN.map(function(r){var v=x[r[0]]||{};return '<tr><td class="mt">'+r[1]+'</td><td class="mo">'+r[2]+'</td><td><select data-mr="'+r[0]+'" data-k="s" aria-label="Status: '+r[2]+'"><option value=""></option>'+['Covered','Partly covered','Not covered'].map(function(o){return '<option'+(v.s===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></td><td><textarea rows="1" data-mr="'+r[0]+'" data-k="t" aria-label="Summary: '+r[2]+'">'+api.esc(v.t||'')+'</textarea></td></tr>';}).join('')+'</tbody>';
  tb.querySelectorAll('[data-mr]').forEach(function(el){ var h=function(){ var k=el.dataset.mr; x[k]=x[k]||{}; x[k][el.dataset.k]=el.value; if(el.tagName==='TEXTAREA'){ el.style.height='auto'; el.style.height=(el.scrollHeight+2)+'px'; } api.save(); }; el.oninput=h; el.onchange=h; });
  setTimeout(function(){ tb.querySelectorAll('textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; }); },0);
 }
 var cov=0, part=[], miss=[];
 IN.forEach(function(r){ var v=x[r[0]]||{}; if(v.s==='Covered') cov++; else { var lc=r[2].charAt(0).toLowerCase()+r[2].slice(1); if(v.s==='Partly covered') part.push(r[1]+', '+lc); else miss.push(r[1]+', '+lc); } if(v.s&&v.s!=='Not covered'&&!(v.t||'').trim()) f.push(['warn','Input '+r[1]+' is marked '+v.s.toLowerCase()+' but has no summary. Record what was presented, so the record shows evidence, not a tick.']); });
 var R=S.f.date, prior=S.g.pa.filter(function(r){return r.a;}), over=prior.filter(function(r){return r.s!=='Closed'&&r.s!=='Cancelled'&&r.d&&R&&r.d<R;}), opn=prior.filter(function(r){return r.s!=='Closed'&&r.s!=='Cancelled';});
 var outs=S.g.o.filter(function(r){return r.a;}), noOD=outs.filter(function(r){return !r.o||!r.d;}), cats=['Improvement opportunity','Change to the QMS','Resource need'], absent=cats.filter(function(c){return !outs.some(function(r){return r.c===c;});}), noCat=outs.filter(function(r){return !r.c;});
 var K=S.g.k.filter(function(r){return r.m&&!isNaN(api.num(r.t))&&!isNaN(api.num(r.v))&&r.dir;}), met=K.filter(function(r){var t=api.num(r.t),v=api.num(r.v);return r.dir==='Higher'?v>=t:v<=t;}), worse=S.g.k.filter(function(r){var p=api.num(r.p),v=api.num(r.v);return r.m&&r.dir&&!isNaN(p)&&!isNaN(v)&&(r.dir==='Higher'?v<p:v>p);});
 root.querySelector('.mr-stat').innerHTML='<div><b>'+cov+' of '+IN.length+'</b><span>Inputs fully covered</span></div><div><b>'+(prior.length?(prior.length-opn.length)+' of '+prior.length:'—')+'</b><span>Prior actions closed</span></div><div><b>'+(K.length?met.length+' of '+K.length:'—')+'</b><span>Scorecard targets met</span></div><div><b>'+outs.length+'</b><span>Output decisions recorded</span></div>';
 var any=S.f.org||S.f.date||prior.length||outs.length||K.length||cov||Object.keys(x).some(function(k){return x[k]&&(x[k].s||x[k].t);});
 if(any){
  if(cov===IN.length) f.unshift(['ok','All twelve inputs in 9.3.2 are covered.']);
  else f.unshift([miss.length?'warn':'','Inputs covered: '+cov+' of '+IN.length+'.'+(miss.length?' <b>Not covered:</b> '+miss.map(api.esc).join('; ')+'. Each is a required input; if it was not discussed, the review is incomplete for audit purposes.':'')+(part.length?' <b>Partly covered:</b> '+part.map(api.esc).join('; ')+'.':'')]);
  if(S.f.tm==='No') f.push(['warn','Top management did not attend. Clause 9.3.1 requires top management to review the QMS; a review held only by the quality team does not meet it.']);
  else if(!S.f.tm) f.push(['warn','Record whether top management took part. Auditors check this first.']);
  if(!R) f.push(['warn','Enter the review date. Overdue actions are judged against it.']);
  if(over.length) f.push(['warn',over.length+' action'+(over.length>1?'s':'')+' from the previous review '+(over.length>1?'are':'is')+' overdue: '+over.map(function(r){return '<b>'+api.esc(r.a)+'</b>'+(r.o?' ('+api.esc(r.o)+')':'');}).join('; ')+'. Decide whether to re-plan, escalate or cancel with a reason, and record the decision.']);
  else if(prior.length&&!opn.length) f.push(['ok','All actions from the previous review are closed or cancelled.']);
  if(!outs.length) f.push(['warn','No outputs recorded. Clause 9.3.3 requires decisions and actions on improvement opportunities, any needed changes to the QMS, and resource needs.']);
  else {
   if(absent.length) f.push(['warn','No output recorded for: '+absent.map(function(c){return c.charAt(0).toLowerCase()+c.slice(1);}).join(', ')+'. If the review decided nothing is needed there, record that decision so the record covers all three output areas.']);
   if(noOD.length) f.push(['warn',noOD.length+' output'+(noOD.length>1?'s have':' has')+' no owner or no due date: '+noOD.map(function(r){return '<b>'+api.esc(r.a)+'</b>';}).join('; ')+'. An action without both is not likely to happen.']);
   if(noCat.length) f.push(['warn',noCat.length+' output'+(noCat.length>1?'s have':' has')+' no category.']);
  }
  if(K.length&&met.length<K.length) f.push(['warn','Scorecard: '+(K.length-met.length)+' of '+K.length+' targets missed ('+K.filter(function(r){return met.indexOf(r)<0;}).map(function(r){return api.esc(r.m);}).join('; ')+'). A missed target should lead to an output: an action, a changed target with a reason, or a resource decision.']);
  else if(K.length) f.push(['ok','Scorecard: all '+K.length+' targets met.']);
  if(worse.length) f.push(['','Getting worse against the prior period: '+worse.map(function(r){return api.esc(r.m);}).join('; ')+'. A worsening trend needs attention even where the target is still being met.']);
  f.push(['','Keep this record (or the minutes it feeds) as documented information: 9.3.3 requires evidence of the results of the review. Judge effectiveness on results such as audit findings, complaints, warranty cost, recalls and survey scores, not on how many procedures exist.']);
 }
 root.querySelector('.mr-out').innerHTML=api.flags(f,'Fill in the review details, the inputs and the outputs, and the completeness checks appear here.');
},
example:{f:{org:'Ridgeway Hydraulics Inc., design and manufacture of hydraulic cylinders, main site',date:'2026-09-22',prev:'2026-03-24',tm:'Yes',att:'General manager (chair), operations director, quality manager, engineering manager, supply chain manager, HR manager'},
 g:{pa:[
  {a:'Add leak-test data to the weekly quality dashboard',o:'Quality manager',d:'2026-05-15',s:'Closed'},
  {a:'Qualify a second source for chrome rod',o:'Supply chain manager',d:'2026-08-31',s:'Open'},
  {a:'Train cell leads in 8D problem solving',o:'HR manager',d:'2026-06-30',s:'Closed'},
  {a:'Update the context and interested-parties register',o:'Quality manager',d:'2026-10-31',s:'Open'}],
 k:[
  {m:'Major nonconformities from internal and registrar audits',t:'0',v:'1',p:'2',dir:'Lower'},
  {m:'Customer complaints per 1,000 cylinders shipped',t:'2.0',v:'1.6',p:'2.3',dir:'Lower'},
  {m:'Warranty cost, % of sales',t:'0.50',v:'0.62',p:'0.55',dir:'Lower'},
  {m:'Field recalls or retrofit campaigns',t:'0',v:'0',p:'0',dir:'Lower'},
  {m:'Customer survey score (1 to 10)',t:'8.0',v:'8.3',p:'8.1',dir:'Higher'},
  {m:'Quality objectives met (of 6)',t:'6',v:'4',p:'4',dir:'Higher'}],
 o:[
  {a:'Rod-seal leak project: Six Sigma team to cut warranty cost back under 0.5% of sales',c:'Improvement opportunity',o:'Engineering manager',d:'2027-02-26'},
  {a:'Add supplier on-time and PPM data to the monthly supplier review procedure',c:'Change to the QMS',o:'Supply chain manager',d:'2026-11-30'},
  {a:'Revise the risk register review so action effectiveness is checked each quarter',c:'Change to the QMS',o:'',d:'2026-12-15'},
  {a:'Approve a second CMM operator for the night shift',c:'Resource need',o:'Operations director',d:'2026-11-15'}]},
 x:{i:{
  a:{s:'Covered',t:'4 actions: 2 closed, 2 open; chrome-rod second source is 3 weeks late.'},
  b:{s:'Covered',t:'New OEM customer requires IATF-style PPAP; steel tariff changes raised rod cost 7%.'},
  c1:{s:'Covered',t:'Survey 8.3 (up from 8.1); complaints 1.6 per 1,000, down from 2.3.'},
  c2:{s:'Covered',t:'4 of 6 objectives met; warranty and on-time delivery missed.'},
  c3:{s:'Covered',t:'First-pass yield 96.8% (target 97%); leak-test failures concentrated on 3-inch bore.'},
  c4:{s:'Covered',t:'38 NCRs, 9 CARs; 2 CARs past 60 days.'},
  c5:{s:'Covered',t:'Calibration 100% on time; Cpk on rod OD 1.21 (target 1.33).'},
  c6:{s:'Covered',t:'Registrar surveillance: 1 major (calibration records), 3 minor. Internal: 11 findings.'},
  c7:{s:'Partly covered',t:'On-time delivery by supplier shown; supplier PPM not available.'},
  d:{s:'Covered',t:'CMM capacity short on nights; overtime 14% in inspection.'},
  e:{s:'Not covered',t:''},
  f:{s:'Covered',t:'Rod-seal leak project; automate leak-test data capture.'}}}}
}
