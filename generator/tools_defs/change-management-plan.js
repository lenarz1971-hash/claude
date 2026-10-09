{
slug:'change-management-plan',
sections:[
 {type:'fields',title:'The change',cols:3,fields:[
  {id:'name',label:'Change',wide:true,ph:'e.g. Barcode medication administration on all inpatient units'},
  {id:'spon',label:'Sponsor'},
  {id:'lead',label:'Change lead'},
  {id:'go',label:'Target date',type:'date'},
  {id:'desc',label:'What will be different',type:'textarea',wide:true,rows:2,hint:'Processes, systems, roles and behaviors that change, and who is affected.'},
  {id:'why',label:'Case for change',type:'textarea',wide:true,rows:3,hint:'Why now, and what it costs to stay as we are. This is the raw material for step 1, urgency.'}]},
 {type:'custom',id:'kot',title:'Kotter\'s eight steps',hint:'Kotter\'s steps are sequential: each builds the conditions for the next. Record what has been done or is planned for each. Lewin\'s three stages map onto them: steps 1 to 4 <b>unfreeze</b>, steps 5 to 7 <b>change</b>, step 8 <b>refreezes</b>.',html:'<div class="tgw"><table class="mv kt"></table></div>'},
 {type:'grid',id:'s',title:'Stakeholder resistance and strategy',rows:4,hint:'One row per group affected. The <b>reason</b> options are Kotter and Schlesinger\'s four common causes of resistance, plus workload. The <b>strategy</b> options are their six approaches for dealing with resistance.',cols:[
  {id:'g',label:'Group',w:160,type:'textarea',rows:1},
  {id:'now',label:'Support now',type:'select',opts:['Strongly resists','Resists','Neutral','Supports','Champions']},
  {id:'need',label:'Support needed',type:'select',opts:['Strongly resists','Resists','Neutral','Supports','Champions']},
  {id:'gap',label:'Gap',calc:function(r,api){var L=['Strongly resists','Resists','Neutral','Supports','Champions'],a=L.indexOf(r.now),b=L.indexOf(r.need);return a<0||b<0?'':(b-a>0?'+'+(b-a):String(b-a));}},
  {id:'why',label:'Likely reason for resistance',w:250,type:'select',opts:['Parochial self-interest','Misunderstanding and lack of trust','Different assessment','Low tolerance for change','Workload or resources','None expected']},
  {id:'str',label:'Strategy',w:250,type:'select',opts:['Education and communication','Participation and involvement','Facilitation and support','Negotiation and agreement','Manipulation and co-optation','Explicit and implicit coercion']},
  {id:'act',label:'Actions',w:220,type:'textarea',rows:1}]},
 {type:'fields',title:'Empowerment and engagement',cols:2,fields:[
  {id:'dec',label:'Decisions delegated to the people doing the work',type:'textarea',rows:2},
  {id:'bar',label:'Barriers removed (systems, structures, policies)',type:'textarea',rows:2},
  {id:'wins',label:'Short-term wins planned',type:'textarea',rows:2,hint:'Visible, unambiguous, clearly tied to the change, within months.'},
  {id:'anc',label:'How the change will be anchored (refreeze)',type:'textarea',rows:2,hint:'Measures, procedures, hiring, training, recognition.'}]},
 {type:'custom',id:'res',title:'Support gap and checks',html:'<div class="svgw cm-chart"></div><div class="out cm-out"></div>'}
],
blankX:function(){var k=[];for(var i=0;i<8;i++)k.push({s:'',a:''});return {k:k};},
update:function(root,api){
 var S=api.state(), esc=api.esc, f=[];
 var K=['Create a sense of urgency','Build a guiding coalition','Develop a vision and strategy','Communicate the change vision','Empower broad-based action and remove barriers','Generate short-term wins','Consolidate gains and produce more change','Anchor the new approaches in the culture'];
 var ST=['Not started','Planned','In progress','Done','Skipped'], LW=['Unfreeze','Unfreeze','Unfreeze','Unfreeze','Change','Change','Change','Refreeze'];
 var k=S.x.k; if(!Array.isArray(k)) k=S.x.k=[]; while(k.length<8) k.push({s:'',a:''});
 var tb=root.querySelector('table.kt');
 if(!tb.querySelector('select')){
  tb.innerHTML='<thead><tr><th>Step</th><th>Lewin</th><th>Status</th><th>What has been done or is planned</th></tr></thead><tbody>'+K.map(function(t,i){ return '<tr data-kr="'+i+'"><td class="mo"><b>'+(i+1)+'.</b> '+t+'</td><td class="lw">'+LW[i]+'</td><td><select data-ks="'+i+'" aria-label="Status, step '+(i+1)+'"><option value=""></option>'+ST.map(function(o){return '<option'+(k[i].s===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></td><td><textarea rows="1" data-ka="'+i+'" aria-label="Actions, step '+(i+1)+'">'+esc(k[i].a||'')+'</textarea></td></tr>'; }).join('')+'</tbody>';
  tb.querySelectorAll('textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });
  tb.querySelectorAll('[data-ks]').forEach(function(el){ el.addEventListener('input',function(){ k[+el.dataset.ks].s=el.value; api.save(); }); });
  tb.querySelectorAll('[data-ka]').forEach(function(el){ el.addEventListener('input',function(){ k[+el.dataset.ka].a=el.value; el.style.height='auto'; el.style.height=(el.scrollHeight+2)+'px'; api.save(); }); });
 }
 k.forEach(function(x,i){ var tr=tb.querySelector('[data-kr="'+i+'"]'); if(tr) tr.className=x.s==='Skipped'?'sk':x.s==='Done'?'dn':''; });
 // stakeholder gaps
 var L=['Strongly resists','Resists','Neutral','Supports','Champions'];
 var R=S.g.s.filter(function(r){return r.g&&r.g.trim();});
 var rows=R.map(function(r){ var a=L.indexOf(r.now), b=L.indexOf(r.need); return {r:r,a:a,b:b,gap:a<0||b<0?NaN:b-a}; });
 var V=rows.filter(function(x){return !isNaN(x.gap);});
 var W=640, rh=34, top=40, H=top+V.length*rh+16, x0=230, x1=W-50, X=function(i){return x0+i*(x1-x0)/4;};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Support now and support needed by group"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 11px Archivo,sans-serif;fill:#4A5D71}</style>';
 L.forEach(function(l,i){ g+='<line x1="'+X(i)+'" x2="'+X(i)+'" y1="'+(top-8)+'" y2="'+(H-10)+'" stroke="#DDE1E4"/><text class="ax" x="'+X(i)+'" y="'+(top-16)+'" text-anchor="middle">'+l.replace('Strongly resists','Strongly resist').replace('Resists','Resist').replace('Supports','Support').replace('Champions','Champion')+'</text>'; });
 V.forEach(function(x,i){ var y=top+i*rh+rh/2, c=x.gap>=2?'#C0392B':x.gap===1?'#9C7C1F':'#1F8C55', lab=x.r.g.length>30?x.r.g.slice(0,29)+'…':x.r.g;
  g+='<text x="'+(x0-14)+'" y="'+(y+4)+'" text-anchor="end">'+esc(lab)+'</text>';
  if(x.gap!==0) g+='<line x1="'+X(x.a)+'" x2="'+X(x.b)+'" y1="'+y+'" y2="'+y+'" stroke="'+c+'" stroke-width="4"/>';
  g+='<circle cx="'+X(x.a)+'" cy="'+y+'" r="7" fill="#fff" stroke="'+c+'" stroke-width="3"/><circle cx="'+X(x.b)+'" cy="'+y+'" r="7" fill="'+c+'"/>';
 });
 g+='</svg>';
 root.querySelector('.cm-chart').innerHTML=V.length?g+'':'';
 if(V.length){ var big=V.filter(function(x){return x.gap>=2;}); f.push([big.length?'':'ok','<b>'+V.length+'</b> group'+(V.length>1?'s':'')+' mapped; '+big.length+' need to move two or more levels. Open circle = support now, filled circle = support needed.']); }
 rows.forEach(function(x){ var r=x.r;
  if(!isNaN(x.gap)&&x.gap>=2&&!r.str) f.push(['warn','<b>'+esc(r.g)+'</b> must move '+x.gap+' levels ('+r.now.toLowerCase()+' to '+r.need.toLowerCase()+') and has no strategy. Large gaps with no plan are where changes stall.']);
  else if(!isNaN(x.gap)&&x.gap>0&&!r.str) f.push(['','<b>'+esc(r.g)+'</b> has a support gap and no strategy yet.']);
  if(r.str==='Manipulation and co-optation') f.push(['warn','<b>'+esc(r.g)+'</b>: manipulation and co-optation. It can be quick and cheap, but if people feel they have been tricked or bought, resistance comes back stronger and the leader\'s credibility suffers for later changes.']);
  if(r.str==='Explicit and implicit coercion') f.push(['warn','<b>'+esc(r.g)+'</b>: coercion. It is fast and can overcome any resistance, but it risks resentment and minimum compliance rather than commitment. Kotter and Schlesinger reserve it for when speed is essential and the change initiators have considerable power; pair it with education so people know why.']);
  var fit={'Misunderstanding and lack of trust':'Education and communication','Different assessment':'Participation and involvement','Low tolerance for change':'Facilitation and support','Parochial self-interest':'Negotiation and agreement','Workload or resources':'Facilitation and support'}[r.why];
  if(fit&&r.str&&r.str!==fit&&r.str.indexOf('Manip')<0&&r.str.indexOf('coercion')<0) f.push(['','<b>'+esc(r.g)+'</b>: resistance from '+r.why.toLowerCase()+' is usually met with '+fit.toLowerCase()+'. Check that '+r.str.toLowerCase()+' addresses the cause.']);
  if(fit&&r.str&&(r.str.indexOf('Manip')>=0||r.str.indexOf('coercion')>=0)) f.push(['','<b>'+esc(r.g)+'</b>: the likely cause is '+r.why.toLowerCase()+', which '+fit.toLowerCase()+' addresses directly.']);
  if(!isNaN(x.gap)&&x.gap<0) f.push(['','<b>'+esc(r.g)+'</b>: support needed is lower than support now. Check the entries.']);
 });
 var sk=[], lastAct=-1; k.forEach(function(x,i){ if(x.s==='Skipped') sk.push(i); if(x.s==='In progress'||x.s==='Done') lastAct=i; });
 if(sk.length) f.push(['warn','Kotter step'+(sk.length>1?'s':'')+' skipped: '+sk.map(function(i){return '<b>'+(i+1)+'. '+K[i]+'</b>';}).join(', ')+'. Kotter found that skipping steps gives only the illusion of speed; the missing step usually has to be done later, at greater cost.']);
 var behind=[]; for(var i=0;i<lastAct;i++){ if(!k[i].s||k[i].s==='Not started') behind.push(i+1); }
 if(behind.length) f.push(['warn','Step'+(behind.length>1?'s ':' ')+behind.join(', ')+' not started while a later step is under way. The steps build on each other.']);
 if(!(S.f.wins||'').trim()||k[5].s==='Skipped') f.push(['warn','No short-term wins planned. Without visible early results within months, skeptics gain ground and supporters lose momentum. Plan wins deliberately; do not wait for them.']);
 if(!(S.f.why||'').trim()) f.push(['warn','No case for change recorded. People need to understand why before they will accept what.']);
 if(!(S.f.dec||'').trim()&&!(S.f.bar||'').trim()) f.push(['','Record what decisions are delegated and which barriers are being removed. Empowerment without removing structural barriers frustrates the people you asked to act.']);
 if(k[7].s&&k[7].s!=='Skipped'&&!(S.f.anc||'').trim()) f.push(['','Step 8 has a status but nothing is recorded on how the change will be anchored.']);
 var used=k.some(function(x){return x.s;});
 root.querySelector('.cm-out').innerHTML=used||R.length?api.flags(f):api.flags([],'Fill in the Kotter steps and the stakeholder groups and the checks appear here.');
},
example:{f:{name:'Barcode medication administration (BCMA) on all inpatient units',spon:'Chief nursing officer',lead:'Nursing informatics manager',go:'2027-02-01',
 desc:'Nurses scan the patient wristband and each medication before giving it; the system checks patient, drug, dose, route and time against the order. Affects about 420 inpatient nurses, pharmacy, hospitalists, agency staff and IT. The paper medication administration record is retired.',
 why:'Pharmacy reports 11 administration errors that reached patients in the last 12 months, two with temporary harm, most of them wrong patient or wrong dose. Published studies have linked barcode administration with fewer administration errors. The current paper process depends on memory and manual checks at the end of 12-hour shifts.',
 dec:'Each unit decides scanner mounting and the bedside workflow for its own rooms. Super-users can approve documented downtime workarounds without calling IT.',
 bar:'Wi-Fi dead spots on 3 East fixed; wristband printers replaced; pharmacy now barcodes unit-dose items that arrived without a usable barcode.',
 wins:'4 West pilot in November: publish scan compliance and the number of wrong-patient or wrong-dose scans caught in the first 30 days at the December town hall.',
 anc:'Scan compliance added to unit scorecards and new-hire orientation; paper MAR forms withdrawn; managers recognize top units monthly.'},
 g:{s:[
  {g:'Med-surg night-shift nurses',now:'Resists',need:'Supports',why:'Low tolerance for change',str:'Facilitation and support',act:'Super-user on every night shift for four weeks; scanner at every bed; time study after go-live'},
  {g:'Surgical unit nurses',now:'Strongly resists',need:'Supports',why:'Workload or resources',str:'',act:''},
  {g:'Hospitalists',now:'Neutral',need:'Supports',why:'Different assessment',str:'Participation and involvement',act:'Two hospitalists on the design team for order timing rules'},
  {g:'Pharmacy',now:'Supports',need:'Champions',why:'None expected',str:'Participation and involvement',act:'Pharmacy leads unit-dose barcode labeling'},
  {g:'Agency and travel nurses',now:'Neutral',need:'Supports',why:'Misunderstanding and lack of trust',str:'Explicit and implicit coercion',act:'Scanning made a condition of the agency contract from go-live'},
  {g:'Nurse managers',now:'Supports',need:'Champions',why:'None expected',str:'Education and communication',act:'Weekly scan-rate data at the managers\' huddle'}]},
 x:{k:[
  {s:'Done',a:'Error data presented at nursing grand rounds and at every unit huddle'},
  {s:'Done',a:'CNO, CMIO, pharmacy director, two unit managers and a night-shift charge nurse'},
  {s:'Skipped',a:'Assumed obvious: safer medication administration'},
  {s:'In progress',a:'Monthly town halls; unit huddle scripts; FAQ on the intranet'},
  {s:'In progress',a:'Super-users chosen by each unit; scanner placement decided by unit staff'},
  {s:'Planned',a:'4 West pilot in November'},
  {s:'Not started',a:''},
  {s:'Not started',a:''}]}}
}
