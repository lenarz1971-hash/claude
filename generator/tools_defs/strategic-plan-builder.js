{
slug:'strategic-plan-builder',
sections:[
 {type:'fields',title:'Direction',cols:2,hint:'The mission says why the organization exists and whom it serves today. The vision describes the future it is working toward. Values say how people behave on the way.',fields:[
  {id:'org',label:'Organization'},{id:'hz',label:'Planning horizon',ph:'2026–2028'},
  {id:'mis',label:'Mission',type:'textarea',rows:2,wide:true},
  {id:'vis',label:'Vision',type:'textarea',rows:2,wide:true},
  {id:'val',label:'Values',type:'textarea',rows:2,wide:true,hint:'Separate with semicolons.'},
  {id:'qp',label:'Quality policy',type:'textarea',rows:3,wide:true,hint:'ISO 9001:2015 clause 5.2.1, in summary: the policy suits the organization and its direction, gives a basis for setting quality objectives, and commits to meeting applicable requirements and to continual improvement.'}]},
 {type:'grid',id:'o',title:'Strategic objectives',rows:3,hint:'The few long-range results the strategy must deliver. Give each a short code (SO1, SO2) so tactics can point to it.',cols:[
  {id:'code',label:'Code',w:70},{id:'obj',label:'Strategic objective',w:260,type:'textarea',rows:1},{id:'by',label:'By year',type:'number',min:2000,max:2100},{id:'own',label:'Executive owner',w:140},
  {id:'nt',label:'Tactics',calc:function(r,api){if(!r.obj&&!r.code)return '';var k=window.TOOL._links(api.state()).cnt[(r.code||r.obj).trim().toLowerCase()]||0;return k?String(k):'<span class="sp-no">0</span>';}}]},
 {type:'grid',id:'t',title:'Tactical plans',rows:4,hint:'The specific actions that deliver an objective. Enter the objective code (or its full name) in <b>Objective</b>. The SMART column is worked out from the row: <b>S</b> = described with an owner, <b>M</b> = measure and a numeric target, <b>A</b> = your achievability judgment, <b>R</b> = linked to an objective, <b>T</b> = due date.',cols:[
  {id:'tac',label:'Tactic',w:240,type:'textarea',rows:1},{id:'obj',label:'Objective',w:80},{id:'own',label:'Owner',w:140},
  {id:'meas',label:'Measure',w:170,type:'textarea',rows:1},{id:'tgt',label:'Target',w:90},{id:'due',label:'Due',type:'date'},
  {id:'ach',label:'Achievable?',type:'select',opts:['Yes','Stretch','Doubtful']},
  {id:'sm',label:'SMART',calc:function(r,api){if(!r.tac)return '';var c=window.TOOL._smart(r,api.state()),L=['S','M','A','R','T'],T=['Specific: described, with an owner','Measurable: measure and numeric target','Achievable: your judgment','Relevant: linked to a strategic objective','Time-bound: due date'];return L.map(function(l,i){var v=c[i];return '<span class="sm '+(v===true?'y':v===false?'n':'q')+'" title="'+T[i]+'">'+l+'</span>';}).join('');}}]},
 {type:'custom',id:'res',title:'Plan check',html:'<div class="tgw"><table class="mv sp"></table></div><div class="out sp-out"></div>'}
],
_k:function(s){return String(s||'').trim().toLowerCase();},
_links:function(S){ var K=window.TOOL._k, objs=S.g.o.filter(function(o){return o.obj||o.code;}), map={}, cnt={};
 objs.forEach(function(o){ var k=K(o.code||o.obj); cnt[k]=0; if(o.code) map[K(o.code)]=k; if(o.obj) map[K(o.obj)]=k; });
 S.g.t.forEach(function(t){ if(!t.tac) return; var k=map[K(t.obj)]; if(k!=null) cnt[k]++; });
 return {map:map,cnt:cnt,objs:objs}; },
_smart:function(r,S){ var K=window.TOOL._k, L=window.TOOL._links(S);
 return [!!(r.tac&&String(r.tac).trim().split(/\s+/).length>=3&&r.own), !!(r.meas&&/\d/.test(r.tgt||'')), r.ach==='Yes'||r.ach==='Stretch'?true:r.ach==='Doubtful'?false:null, !!(r.obj&&L.map[K(r.obj)]!=null), !!r.due]; },
update:function(root,api){
 var S=api.state(), esc=api.esc;
 var L=window.TOOL._links(S), tacs=S.g.t.filter(function(t){return t.tac;}), f=[];
 var tb=root.querySelector('table.sp');
 if(L.objs.length){
  tb.innerHTML='<thead><tr><th>Strategic objective</th><th>Tactics</th><th>Fully SMART</th><th>Latest due</th></tr></thead><tbody>'+L.objs.map(function(o){ var k=window.TOOL._k(o.code||o.obj), ts=tacs.filter(function(t){return L.map[window.TOOL._k(t.obj)]===k;}), full=ts.filter(function(t){return window.TOOL._smart(t,S).every(function(v){return v===true;});}).length, last=ts.map(function(t){return t.due||'';}).sort().pop()||'';
   return '<tr><td class="mo">'+(o.code?'<b>'+esc(o.code)+'</b> ':'')+esc(o.obj||'')+'</td><td class="mt'+(ts.length?'':' sp-no')+'">'+ts.length+'</td><td class="mt">'+(ts.length?full+' of '+ts.length:'—')+'</td><td class="mt">'+(last?esc(last):'—')+'</td></tr>'; }).join('')+'</tbody>';
 } else tb.innerHTML='';
 // direction
 var miss=[['mis','mission'],['vis','vision'],['val','values'],['qp','quality policy']].filter(function(x){return !String(S.f[x[0]]||'').trim();}).map(function(x){return x[1];});
 var any=L.objs.length||tacs.length||!miss.length||S.f.org;
 if(!any){ root.querySelector('.sp-out').innerHTML=api.flags([],'Write the mission, vision, values and quality policy, then add objectives and the tactics that deliver them.'); return; }
 if(miss.length&&miss.length<4) f.push(['warn','No '+miss.join(', ')+' written yet. Objectives should trace back to the mission and vision.']);
 // summary
 var fullN=tacs.filter(function(t){return window.TOOL._smart(t,S).every(function(v){return v===true;});}).length;
 if(L.objs.length||tacs.length) f.push([fullN===tacs.length&&tacs.length?'ok':'', L.objs.length+' strategic objective'+(L.objs.length===1?'':'s')+' and '+tacs.length+' tactic'+(tacs.length===1?'':'s')+'; '+fullN+' of '+tacs.length+' tactics meet every SMART element.']);
 // codes
 var seen={}, dup=[]; L.objs.forEach(function(o){ var k=window.TOOL._k(o.code); if(!k) return; if(seen[k]) dup.push(o.code); seen[k]=1; });
 if(dup.length) f.push(['warn','Objective code used twice: '+dup.map(esc).join(', ')+'. Tactics cannot tell them apart.']);
 // objectives without tactics
 L.objs.forEach(function(o){ var k=window.TOOL._k(o.code||o.obj); if(!L.cnt[k]) f.push(['warn','<b>'+esc(o.code||o.obj)+'</b>'+(o.code&&o.obj?' ('+esc(o.obj)+')':'')+' has no tactics. An objective with no plan behind it is a wish; add the actions that will deliver it, or drop it.']); if(!o.own) f.push(['warn','<b>'+esc(o.code||o.obj)+'</b> has no executive owner.']); });
 // tactics
 var byObj={}; L.objs.forEach(function(o){ byObj[window.TOOL._k(o.code||o.obj)]=o; });
 tacs.forEach(function(t){ var c=window.TOOL._smart(t,S), nm='<b>'+esc(t.tac.length>60?t.tac.slice(0,59)+'…':t.tac)+'</b>';
  if(!c[3]) f.push(['warn',nm+(t.obj?' points to "'+esc(t.obj)+'", which matches no objective code or name.':' is not linked to a strategic objective.')+' Every tactic should serve an objective, or it competes with the plan for resources.']);
  var m=[]; if(!t.own) m.push('owner'); if(!t.meas) m.push('measure'); if(!t.tgt) m.push('target'); else if(!/\d/.test(t.tgt)) m.push('a number in the target'); if(!t.due) m.push('due date');
  if(m.length) f.push(['warn',nm+' is missing: '+m.join(', ')+'.']);
  if(c[2]===false) f.push(['warn',nm+' is marked doubtful. Re-scope it, add resources, or move the target; a plan everyone expects to miss loses credibility.']);
  var o=byObj[L.map[window.TOOL._k(t.obj)]], y=o?api.num(o.by):NaN;
  if(t.due&&!isNaN(y)&&+String(t.due).slice(0,4)>y) f.push(['warn',nm+' is due '+esc(t.due)+', after its objective\'s '+y+' end year.']);
 });
 // quality policy
 var qp=String(S.f.qp||'');
 if(qp.trim()){
  var q=[];
  if(!/requirement|regulat|statut|complian|comply|accredit/i.test(qp)) q.push('a commitment to satisfy applicable requirements (5.2.1 c)');
  if(!/continu(al|ous)(ly)?\s+improv|improv\w*\s+continu/i.test(qp)) q.push('a commitment to continual improvement (5.2.1 d)');
  if(!/objective/i.test(qp)) q.push('a framework for setting quality objectives (5.2.1 b)');
  f.push(q.length?['warn','Clause 5.2.1: the quality policy does not appear to include '+q.join('; ')+'. This is a word search, so check the wording yourself.']:['ok','Clause 5.2.1: the quality policy appears to include a framework for quality objectives and commitments to applicable requirements and to continual improvement (word search; confirm it also fits the organization\'s purpose, context and strategic direction).']);
  var cu=/customer|client|patient|consumer|user|interested part|stakeholder/i.test(qp);
  f.push(cu?['ok','Good practice (not a 5.2.1 requirement): the policy names who it serves, such as customers, patients or users.']:['','Good practice (not a 5.2.1 requirement): the policy does not say who it serves or how their needs are met. Naming customers or other interested parties makes the policy easier to connect to objectives.']);
 }
 f.push(['','Strategy chooses where to compete and what to achieve over several years; tactics are the shorter-term actions, owners and dates that carry it out. Review the plan against results at least quarterly and adjust the tactics before the objectives.']);
 root.querySelector('.sp-out').innerHTML=api.flags(f);
},
example:{f:{org:'Harlow County Medical Center (240 beds)',hz:'2026–2028',
 mis:'Harlow County Medical Center provides safe, compassionate hospital care to the people of Harlow County and the surrounding region.',
 vis:'By 2030, the region\'s most trusted community hospital, recognized for clinical outcomes and patient experience.',
 val:'Safety first; respect for every patient and colleague; accountability; teamwork; stewardship of community resources',
 qp:'Harlow County Medical Center is committed to safe, effective, patient-centered care. We listen to our patients and families, and we comply with all applicable regulatory and accreditation requirements. Each year leadership sets measurable quality objectives from this policy and reviews progress against them.'},
 g:{o:[{code:'SO1',obj:'Reduce preventable patient harm',by:'2028',own:'Chief medical officer'},
  {code:'SO2',obj:'Improve the patient experience',by:'2028',own:'Chief nursing officer'},
  {code:'SO3',obj:'Improve patient flow: cut ED boarding and length of stay',by:'2027',own:'Chief operating officer'},
  {code:'SO4',obj:'Build a stable, engaged nursing workforce',by:'2028',own:'Chief nursing officer'}],
 t:[{tac:'Roll out the CAUTI bundle with a daily catheter-necessity review on all inpatient units',obj:'SO1',own:'Infection prevention manager',meas:'CAUTI per 1,000 catheter days',tgt:'≤ 0.8 (now 1.6)',due:'2027-06-30',ach:'Yes'},
  {tac:'Falls bundle for high-risk patients: bed alarms and scheduled toileting',obj:'SO1',own:'Falls committee chair',meas:'Falls with injury per 1,000 patient days',tgt:'≤ 0.5 (now 0.9)',due:'2027-12-31',ach:'Stretch'},
  {tac:'Hourly purposeful rounding on the medical-surgical units',obj:'SO2',own:'Director of nursing, med-surg',meas:'HCAHPS staff responsiveness, top-box %',tgt:'70% (now 61%)',due:'2027-12-31',ach:'Stretch'},
  {tac:'Discharge-before-noon program with next-day discharge planning at evening huddle',obj:'SO3',own:'Director of case management',meas:'% of discharges before noon',tgt:'35% (now 18%)',due:'2027-03-31',ach:'Yes'},
  {tac:'Open a 12-chair results-pending area beside the ED',obj:'SO3',own:'ED medical director',meas:'Median ED boarding time',tgt:'',due:'',ach:'Yes'},
  {tac:'Replace the incident reporting software',obj:'',own:'IT director',meas:'Incident reports filed per month',tgt:'120',due:'2026-12-31',ach:'Yes'}]}}
}
