{
slug:'supplier-onboarding-checklist',
h:{
 PH:['Orientation','Access and systems','Requirements','Qualification','Performance and communication','Training'],
 ST:['Not started','In progress','Done','Blocked'],
 /* [item, phase, gate before first production shipment] */
 std:[['Company overview: vision, mission and guiding principles','Orientation','No'],
  ['How the part is used and why it is critical (what happens if it fails)','Orientation','Yes'],
  ['Supplier quality manual issued and receipt acknowledged','Orientation','Yes'],
  ['Supplier code of conduct acknowledged','Orientation','No'],
  ['Supplier portal access set up (the supplier signs in with its own account)','Access and systems','No'],
  ['Ordering, forecast and EDI or ASN set up','Access and systems','No'],
  ['Supplier quality agreement signed','Requirements','Yes'],
  ['Drawings, specifications and revisions issued; requirements flowdown confirmed','Requirements','Yes'],
  ['Special characteristics and control plan expectations explained','Requirements','Yes'],
  ['Packaging, labeling and shipping requirements issued','Requirements','No'],
  ['Regulatory declarations received (RoHS, REACH, conflict minerals)','Requirements','No'],
  ['First article or PPAP expectations and submission level agreed','Qualification','Yes'],
  ['Change notification process explained','Qualification','Yes'],
  ['Nonconforming material and SCAR process explained','Qualification','No'],
  ['KPIs and scorecard explained: PPM, on-time delivery, responsiveness','Performance and communication','No'],
  ['Communication cadence agreed (launch calls, scorecard, business reviews)','Performance and communication','No'],
  ['Escalation path agreed','Performance and communication','No'],
  ['Training on customer-specific requirements delivered','Training','No'],
  ['Training effectiveness checked (quiz, walk-through or first-lot review)','Training','No']]
},
sections:[
 {type:'fields',title:'The supplier',cols:3,hint:'Onboarding is the orientation a new supplier gets after it is selected and before it ships production parts: who you are, what you need, how you will measure it, and who to call. A supplier that understands the expectations from the start needs far fewer corrective actions later.',fields:[
  {id:'sup',label:'Supplier and site'},
  {id:'what',label:'Parts or services supplied',wide:true},
  {id:'crit',label:'Criticality of what they supply',type:'select',opts:['Critical: safety, regulatory or key function','Major','Minor']},
  {id:'own',label:'Onboarding owner (our side)'},
  {id:'start',label:'Onboarding started',type:'date'},
  {id:'ship',label:'First production shipment planned',type:'date'}]},
 {type:'grid',id:'c',title:'Contacts',rows:3,hint:'Name a contact on each side for each role. The escalation contact on the supplier side should be someone with authority to commit resources, not the account manager.',cols:[
  {id:'role',label:'Role',w:150},
  {id:'us',label:'Our contact',w:150},
  {id:'them',label:'Supplier contact',w:150},
  {id:'how',label:'Email or phone',w:190}]},
 {type:'custom',id:'std',cls:'noprint',title:'Start from the standard items',hint:'Fills the checklist with 19 common onboarding items in six phases. Items marked as a gate must be done before the first production shipment. Rows you have already written are kept.',html:'<div class="pillrow"><button type="button" class="dg-btn ob-load">Add the 19 standard items</button></div>',
  init:function(el,api){ var H=window.TOOL.h, S=api.state();
   el.querySelector('.ob-load').onclick=function(){ var have=S.g.k.map(function(r){return String(r.it||'').trim().toLowerCase();}); S.g.k=S.g.k.filter(function(r){return r.it||r.st||r.who;});
    H.std.forEach(function(x){ if(have.indexOf(x[0].toLowerCase())<0) S.g.k.push({it:x[0],ph:x[1],gate:x[2],req:'Required',st:'Not started'}); }); api.save(); api.rerender(); }; }},
 {type:'grid',id:'k',title:'Onboarding checklist',rows:4,hint:'<b>Gate</b> marks an item that must be done before the first production shipment. Mark an item Not applicable only when it truly does not apply, and say why in the evidence column.',cols:[
  {id:'it',label:'Item',w:250,type:'textarea',rows:1},
  {id:'ph',label:'Phase',type:'select',opts:['Orientation','Access and systems','Requirements','Qualification','Performance and communication','Training']},
  {id:'gate',label:'Gate',type:'select',opts:['Yes','No'],tip:'Must be done before the first production shipment'},
  {id:'req',label:'Required',type:'select',opts:['Required','Not applicable']},
  {id:'who',label:'Owner',w:100},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Not started','In progress','Done','Blocked']},
  {id:'ev',label:'Evidence or notes',w:200,type:'textarea',rows:1}]},
 {type:'grid',id:'m',title:'Communication plan',rows:3,hint:'How often you will talk, and about what. During launch the cadence is usually tighter; it relaxes once the supplier is stable.',cols:[
  {id:'mt',label:'Meeting or report',w:180},
  {id:'fr',label:'Frequency',type:'select',opts:['Daily','Weekly','Every two weeks','Monthly','Quarterly','Twice a year','Yearly','As needed']},
  {id:'att',label:'Who takes part',w:180},
  {id:'pur',label:'Purpose',w:220,type:'textarea',rows:1}]},
 {type:'custom',id:'sum',title:'Readiness',html:'<div class="stat ob-stat"></div><div class="svgw ob-svg"></div><div class="out ob-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), esc=api.esc, f=[], today=api.today();
 var K=S.g.k.filter(function(r){return r.it;}), R=K.filter(function(r){return (r.req||'Required')==='Required';});
 var done=R.filter(function(r){return r.st==='Done';}), G=R.filter(function(r){return r.gate==='Yes';}), gd=G.filter(function(r){return r.st==='Done';});
 var blk=R.filter(function(r){return r.st==='Blocked';}), od=R.filter(function(r){return r.due&&r.due<today&&r.st!=='Done';});
 var pct=R.length?done.length/R.length*100:NaN, ready=G.length>0&&gd.length===G.length;
 var days=S.f.ship?Math.round((new Date(S.f.ship+'T00:00:00Z')-new Date(today+'T00:00:00Z'))/864e5):NaN;
 root.querySelector('.ob-stat').innerHTML='<div><b>'+done.length+' / '+R.length+(isNaN(pct)?'':' ('+pct.toFixed(0)+'%)')+'</b><span>Required items done</span></div><div><b>'+gd.length+' / '+G.length+'</b><span>Gate items done</span></div><div><b>'+blk.length+'</b><span>Blocked</span></div><div><b>'+od.length+'</b><span>Past due</span></div><div><b>'+(isNaN(days)?'—':days)+'</b><span>Days to first shipment</span></div><div><b>'+(ready?'Ready':'Not ready')+'</b><span>For first shipment</span></div>';
 /* picture: stacked bar per phase */
 var col={'Done':'#1F8C55','In progress':'#D8B147','Not started':'#D5DBE1','Blocked':'#C0392B'};
 var phases=H.PH.slice(); R.forEach(function(r){ if(r.ph&&phases.indexOf(r.ph)<0) phases.push(r.ph); }); if(R.some(function(r){return !r.ph;})) phases.push('(no phase)');
 var rowsP=phases.map(function(p){ var L=R.filter(function(r){return (r.ph||'(no phase)')===p;}), c={}; H.ST.forEach(function(s){ c[s]=L.filter(function(r){return (r.st||'Not started')===s;}).length; }); return {p:p,n:L.length,c:c}; }).filter(function(x){return x.n;});
 if(rowsP.length){
  var mx=Math.max.apply(null,rowsP.map(function(x){return x.n;})), L0=200, bw=420, bh=22, gp=10, Wd=L0+bw+60, Hh=rowsP.length*(bh+gp)+48, g='';
  rowsP.forEach(function(x,i){ var y=10+i*(bh+gp), xx=L0; g+='<text x="'+(L0-8)+'" y="'+(y+15)+'" text-anchor="end">'+esc(x.p)+'</text>';
   ['Done','In progress','Blocked','Not started'].forEach(function(s){ var w=bw*x.c[s]/mx; if(w>0){ g+='<rect x="'+xx+'" y="'+y+'" width="'+w+'" height="'+bh+'" fill="'+col[s]+'" stroke="#fff"/>'; if(w>=16) g+='<text class="v" x="'+(xx+w/2)+'" y="'+(y+15)+'" text-anchor="middle" style="fill:'+(s==='Not started'||s==='In progress'?'#16273A':'#fff')+'">'+x.c[s]+'</text>'; xx+=w; } });
   g+='<text class="ax" x="'+(xx+6)+'" y="'+(y+15)+'">'+x.c['Done']+'/'+x.n+'</text>'; });
  var lx=L0, ly=Hh-12; ['Done','In progress','Blocked','Not started'].forEach(function(s){ g+='<rect x="'+lx+'" y="'+(ly-9)+'" width="11" height="11" fill="'+col[s]+'"/><text class="ax" x="'+(lx+15)+'" y="'+ly+'">'+s.toUpperCase()+'</text>'; lx+=s.length*6.2+34; });
  root.querySelector('.ob-svg').innerHTML='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Status of the onboarding items by phase"><style>text{font:11.5px Archivo,sans-serif;fill:#16273A}.v{font:700 10px \'IBM Plex Mono\',monospace}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>'+g+'</svg>';
 } else root.querySelector('.ob-svg').innerHTML='';
 /* flags */
 if(!K.length) f.push(['warn','No checklist items yet. Use the button above to start from the standard list.']);
 else {
  if(ready) f.push(['ok','All '+G.length+' gate items are done. The supplier is ready for the first production shipment'+(R.length>done.length?'; '+(R.length-done.length)+' other item'+(R.length-done.length>1?'s are':' is')+' still open and should be finished during launch.':'.')]);
  else if(G.length){ var gopen=G.filter(function(r){return r.st!=='Done';}); f.push(['warn','Not ready for the first production shipment: '+gopen.length+' gate item'+(gopen.length>1?'s':'')+' open: '+gopen.map(function(r){return esc(r.it)+' ('+(r.st||'Not started').toLowerCase()+')';}).join('; ')+'.']); }
  else f.push(['warn','No item is marked as a gate. Decide which items must be done before the first production shipment; at least the quality agreement, the requirements and the first article or PPAP.']);
  if(!isNaN(days)&&!ready){ if(days<0) f.push(['warn','The planned first shipment date has passed and the gate items are not all done.']); else if(days<=14) f.push(['warn','First shipment is '+days+' day'+(days===1?'':'s')+' away with gate items still open.']); }
  blk.forEach(function(r){ f.push(['warn','Blocked: <b>'+esc(r.it)+'</b>.'+(r.ev?' '+esc(r.ev).replace(/([^.!?])$/,'$1.'):' Record what it is waiting for.')]); });
  od.filter(function(r){return r.st!=='Blocked';}).forEach(function(r){ f.push(['warn','Past due ('+esc(r.due)+'): '+esc(r.it)+'.']); });
  var noOwn=R.filter(function(r){return !r.who&&r.st!=='Done';}); if(noOwn.length) f.push(['',noOwn.length+' open item'+(noOwn.length>1?'s have':' has')+' no owner.']);
  function has(re){ return K.some(function(r){return re.test(r.it)&&(r.req||'Required')==='Required';}); }
  [[/quality agreement/i,'the quality agreement'],[/first article|ppap/i,'first article or PPAP expectations'],[/kpi|scorecard/i,'how performance will be measured (KPIs and scorecard)'],[/change notif/i,'change notification'],[/train/i,'training']].forEach(function(x){ if(!has(x[0])) f.push(['','The checklist has nothing on '+x[1]+'.']); });
  var naCrit=K.filter(function(r){return r.req==='Not applicable'&&!r.ev;}); if(naCrit.length) f.push(['','Say why '+naCrit.length+' item'+(naCrit.length>1?'s are':' is')+' not applicable.']);
  var tr=R.filter(function(r){return /train/i.test(r.it);}), te=tr.filter(function(r){return /effective|quiz|test|evaluat/i.test(r.it);});
  if(tr.length&&!te.length) f.push(['','Training is planned but nothing checks that it worked. Add an effectiveness check: a short quiz, a walk-through of the first lot, or a review of the first PPAP submission.']);
 }
 /* contacts */
 var C=S.g.c.filter(function(r){return r.role;});
 if(!C.length) f.push(['warn','No contacts listed.']);
 else { var noThem=C.filter(function(r){return !r.them;}); if(noThem.length) f.push(['warn','No supplier contact for: '+noThem.map(function(r){return esc(r.role);}).join(', ')+'.']);
  if(!C.some(function(r){return /quality/i.test(r.role);})) f.push(['warn','No quality contact named.']);
  if(!C.some(function(r){return /escalat|management|executive|director/i.test(r.role);})) f.push(['','No escalation contact. Agree who to call when the normal contacts cannot resolve a problem.']); }
 /* communication */
 var Mm=S.g.m.filter(function(r){return r.mt;});
 if(!Mm.length) f.push(['','No communication plan. Agree at least a regular review of the scorecard.']);
 else { if(!Mm.some(function(r){return /scorecard|kpi|performance/i.test(r.mt+' '+(r.pur||''));})) f.push(['','The communication plan has no regular review of performance or the scorecard.']);
  if(/^Critical/.test(S.f.crit||'')&&!Mm.some(function(r){return r.fr==='Daily'||r.fr==='Weekly';})) f.push(['','For a critical supplier in launch, a weekly call or tighter is usual until the first lots are stable.']); }
 root.querySelector('.ob-out').innerHTML=api.flags(f);
},
example:{f:{sup:'Dunmore Fastening, main plant',what:'Stainless thread-forming screws and captive panel fasteners for the HX-series heat exchanger enclosures',crit:'Major',own:'Supplier quality engineer',start:'2026-09-14',ship:'2026-11-16'},
 g:{c:[
  {role:'Quality',us:'J. Varga, SQE',them:'P. Lindqvist, quality manager',how:'quality@dunmore-fastening.example'},
  {role:'Purchasing and orders',us:'M. Ortiz, buyer',them:'S. Achebe, customer service',how:'orders@dunmore-fastening.example'},
  {role:'Engineering',us:'T. Novak, design engineer',them:'R. Hale, applications engineer',how:'+1 555 0142'},
  {role:'Escalation (management)',us:'Supplier quality manager',them:'',how:''}],
 k:[
  {it:'Company overview: vision, mission and guiding principles',ph:'Orientation',gate:'No',req:'Required',who:'SQE',due:'2026-09-18',st:'Done',ev:'Kickoff meeting 18 Sep, slides sent'},
  {it:'How the part is used and why it is critical (what happens if it fails)',ph:'Orientation',gate:'Yes',req:'Required',who:'Design engineer',due:'2026-09-18',st:'Done',ev:'Panel retention and vibration requirements reviewed'},
  {it:'Supplier quality manual issued and receipt acknowledged',ph:'Orientation',gate:'Yes',req:'Required',who:'SQE',due:'2026-09-25',st:'Done',ev:'Acknowledgment form signed 22 Sep'},
  {it:'Supplier code of conduct acknowledged',ph:'Orientation',gate:'No',req:'Required',who:'Buyer',due:'2026-09-25',st:'Done',ev:''},
  {it:'Supplier portal access set up (the supplier signs in with its own account)',ph:'Access and systems',gate:'No',req:'Required',who:'Buyer',due:'2026-10-02',st:'Done',ev:''},
  {it:'Ordering, forecast and EDI or ASN set up',ph:'Access and systems',gate:'No',req:'Required',who:'Buyer',due:'2026-10-30',st:'In progress',ev:'ASN test file failed format check; resend due'},
  {it:'Supplier quality agreement signed',ph:'Requirements',gate:'Yes',req:'Required',who:'SQE',due:'2026-10-16',st:'In progress',ev:'Draft with supplier legal'},
  {it:'Drawings, specifications and revisions issued; requirements flowdown confirmed',ph:'Requirements',gate:'Yes',req:'Required',who:'Design engineer',due:'2026-09-25',st:'Done',ev:'Drawing list rev C acknowledged'},
  {it:'Special characteristics and control plan expectations explained',ph:'Requirements',gate:'Yes',req:'Required',who:'SQE',due:'2026-10-09',st:'Done',ev:''},
  {it:'Packaging, labeling and shipping requirements issued',ph:'Requirements',gate:'No',req:'Required',who:'Logistics',due:'2026-10-16',st:'In progress',ev:''},
  {it:'Regulatory declarations received (RoHS, REACH, conflict minerals)',ph:'Requirements',gate:'No',req:'Required',who:'SQE',due:'2026-10-23',st:'Not started',ev:''},
  {it:'First article or PPAP expectations and submission level agreed',ph:'Qualification',gate:'Yes',req:'Required',who:'SQE',due:'2026-10-09',st:'Done',ev:'PPAP level 3; FAI on 5 pieces per cavity'},
  {it:'Change notification process explained',ph:'Qualification',gate:'Yes',req:'Required',who:'SQE',due:'2026-10-23',st:'Not started',ev:''},
  {it:'Nonconforming material and SCAR process explained',ph:'Qualification',gate:'No',req:'Required',who:'SQE',due:'2026-10-23',st:'Not started',ev:''},
  {it:'KPIs and scorecard explained: PPM, on-time delivery, responsiveness',ph:'Performance and communication',gate:'No',req:'Required',who:'SQE',due:'2026-10-30',st:'Not started',ev:''},
  {it:'Communication cadence agreed (launch calls, scorecard, business reviews)',ph:'Performance and communication',gate:'No',req:'Required',who:'Buyer',due:'2026-10-09',st:'Done',ev:'See communication plan'},
  {it:'Escalation path agreed',ph:'Performance and communication',gate:'No',req:'Required',who:'Supplier quality manager',due:'2026-10-30',st:'Blocked',ev:'Waiting for the supplier to name a plant manager contact'},
  {it:'Training on customer-specific requirements delivered',ph:'Training',gate:'No',req:'Required',who:'SQE',due:'2026-11-06',st:'Not started',ev:''},
  {it:'Training effectiveness checked (quiz, walk-through or first-lot review)',ph:'Training',gate:'No',req:'Required',who:'SQE',due:'2026-12-04',st:'Not started',ev:'Review of the first three lots'}],
 m:[
  {mt:'Launch call',fr:'Weekly',att:'SQE, buyer, supplier quality and customer service',pur:'Open items, PPAP status, first lots'},
  {mt:'Supplier scorecard',fr:'Monthly',att:'Issued by SQE',pur:'PPM, on-time delivery, SCAR response'},
  {mt:'Business review',fr:'Quarterly',att:'Purchasing and quality managers, supplier management',pur:'Performance trend, capacity, improvement plans'}]}}
}
