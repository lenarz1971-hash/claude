{
slug:'design-review-dfx-checklist',
sections:[
 {type:'fields',title:'The review',cols:3,hint:'A design review is a planned, documented check of the design at a stage gate, by the functions that will have to make, test, buy, service and support it, and by at least one reviewer who did not do the work.',fields:[
  {id:'prod',label:'Product or design',wide:true,ph:'e.g. HX-200 handheld moisture meter, rev C'},
  {id:'stage',label:'Review stage',type:'select',opts:['Concept review','Preliminary design review (PDR)','Critical design review (CDR)','Final or pre-production review','Design transfer review']},
  {id:'date',label:'Review date',type:'date'},
  {id:'owner',label:'Design owner'},
  {id:'docs',label:'Documents reviewed',type:'textarea',wide:true,ph:'e.g. Requirements spec rev 4, drawings pack rev C, DFMEA rev 3, test report TR-118, cost model v6'}]},
 {type:'grid',id:'p',title:'Participants',rows:4,hint:'One row per person. Each function brings the questions only it will ask: can we make it, test it, buy it, fix it in the field. Mark as independent anyone with no direct responsibility for the design stage under review.',cols:[
  {id:'n',label:'Name',w:140},
  {id:'fn',label:'Function',type:'select',opts:['Design engineering','Manufacturing or process engineering','Quality','Reliability','Test','Service or field support','Purchasing or supply chain','Regulatory','Marketing or customer','Other']},
  {id:'role',label:'Role in the review',type:'select',opts:['Chair','Presenter','Reviewer','Scribe','Approver']},
  {id:'ind',label:'Independent?',type:'select',opts:['No','Yes']}]},
 {type:'custom',id:'q',title:'Design for X questions',hint:'Answer for the design as it stands at this stage. <b>Partly</b> counts half. Mark <b>N/A</b> only when the question truly does not apply; every <b>No</b> should lead to a finding below.',init:function(el,api){ var T=window.TOOL; el.innerHTML='<div class="dr-q">'+T._A.map(function(a){ return '<div class="dr-a"><h4>'+a[1]+' <small>'+a[2]+'</small></h4>'+a[3].map(function(q,i){ var id='q_'+a[0]+(i+1); return '<label class="dr-r"><span>'+q+'</span><select data-f="'+id+'" aria-label="'+api.esc(q)+'"><option value=""></option><option>Yes</option><option>Partly</option><option>No</option><option>N/A</option></select></label>'; }).join('')+'</div>'; }).join('')+'</div>'; }},
 {type:'custom',id:'sc',title:'Readiness by area',hint:'Share of applicable questions answered Yes (Partly counts half). Gold marks the weakest area.',html:'<div class="svgw dr-svg"></div><div class="stat dr-stat"></div>'},
 {type:'grid',id:'fd',title:'Findings and actions',rows:3,hint:'One finding per row: what is wrong or missing, how serious it is for the next stage, and one action with one owner and a date.',cols:[
  {id:'no',label:'No.',w:46},
  {id:'area',label:'Area',type:'select',opts:['General','Manufacturability','Assembly','Test','Service','Reliability','Cost','Environment']},
  {id:'f',label:'Finding',w:230,type:'textarea',rows:1},
  {id:'sev',label:'Severity',type:'select',opts:['Must close before next stage','Should close','Observation']},
  {id:'a',label:'Action',w:200,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:100},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Open','Closed']}]},
 {type:'fields',title:'Outcome',cols:3,fields:[
  {id:'dec',label:'Decision',type:'select',opts:['Proceed','Proceed with conditions','Repeat the review']},
  {id:'appr',label:'Approved by'},
  {id:'adate',label:'Approval date',type:'date'},
  {id:'cond',label:'Conditions or reasons',type:'textarea',wide:true}]},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out dr-out"></div>'}
],
_A:[
 ['g','General','design inputs, outputs and changes',['Design inputs are complete, unambiguous and approved, and each is traced to a design output.','Results shown at this review demonstrate the outputs meet the inputs so far.','Actions from the previous review are closed, or carried forward with a reason.','The risk analysis (DFMEA or risk file) has been updated for the design as it now stands.','Changes since the last review are listed and their impact assessed.']],
 ['m','Manufacturability','DFM',['Tolerances are no tighter than the function needs, and the planned processes can hold them.','Materials and processes are already in use here or at the supplier, or new ones have a qualification plan.','Features suit the process: draft, even wall thickness, standard hole sizes, sensible bend radii.','Critical characteristics are marked on the drawing and carried into the PFMEA and control plan.','Manufacturing engineering agrees the design can be made at the planned volume and yield.']],
 ['a','Assembly','DFA',['Part count has been challenged: each part moves, is a different material, or must be separate for service.','Parts cannot be assembled the wrong way (error-proofed or clearly asymmetric).','Assembly works from one direction, with self-locating features.','Fasteners are few and standard, with as few types and sizes as possible.','Every step has tool access and clearance without special fixtures.']],
 ['t','Test','DFT',['Every critical requirement has a verification method: test, inspection or analysis.','Test points, datums or access exist to check critical characteristics in production.','Production tests would catch the highest-risk failure modes in the DFMEA.','Measurement systems for the critical characteristics are capable, or MSA is planned.','Self-test or diagnostics are built in where there is electronics or software.']],
 ['s','Service','DFS, maintainability',['Wear and consumable parts can be reached and replaced without removing unrelated parts.','Service intervals, procedures and any special tools are defined.','Faults can be diagnosed in the field (indicators, error codes, access).','Spare parts are identified and modules are interchangeable.','Field service or repair staff have reviewed the design.']],
 ['r','Reliability','DFR',['Reliability targets (life, MTBF, failure rate) are set and allocated to the subsystems.','The DFMEA is complete and its high-risk items have actions.','Components are derated against load, temperature and voltage.','Environmental and life testing is planned, with pass criteria.','Field failures of similar products have been reviewed for lessons.']],
 ['c','Cost','DFC',['A target cost is set and the current estimate is known.','Standard or catalog parts are used wherever they will do.','Value engineering has looked for features the customer does not pay for.','Tooling and capital cost are estimated and approved.','Risks to scrap, rework and warranty cost have been considered.']],
 ['e','Environment','DFE',['Restricted substances are checked (RoHS, REACH, customer lists).','Materials suit recycling or reuse, and plastic parts are marked.','Energy use in production and in use has been considered.','Packaging is minimal and recyclable.','Disassembly and end-of-life handling are planned.']]],
_need:{'Concept review':['Design engineering','Marketing or customer','Quality'],'Preliminary design review (PDR)':['Design engineering','Manufacturing or process engineering','Quality','Reliability','Test'],'Critical design review (CDR)':['Design engineering','Manufacturing or process engineering','Quality','Reliability','Test','Service or field support','Purchasing or supply chain'],'Final or pre-production review':['Design engineering','Manufacturing or process engineering','Quality','Test','Service or field support','Purchasing or supply chain'],'Design transfer review':['Design engineering','Manufacturing or process engineering','Quality','Purchasing or supply chain','Service or field support']},
_score:function(S,a){ var y=0,p=0,no=0,na=0,blank=0; for(var i=1;i<=a[3].length;i++){ var v=S.f['q_'+a[0]+i]||''; if(v==='Yes') y++; else if(v==='Partly') p++; else if(v==='No') no++; else if(v==='N/A') na++; else blank++; }
 var app=y+p+no; return {y:y,p:p,no:no,na:na,blank:blank,app:app,pct:app?(y+0.5*p)/app:NaN}; },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, esc=api.esc, f=[];
 var sc=T._A.map(function(a){ return {a:a,s:T._score(S,a)}; });
 var svg=root.querySelector('.dr-svg'), any=sc.some(function(x){return x.s.app;});
 var worst=null; sc.forEach(function(x){ if(x.s.app&&(!worst||x.s.pct<worst.s.pct)) worst=x; });
 if(any){
  var W=760, L=170, R=150, rh=30, H=sc.length*rh+34, w=W-L-R;
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Readiness by area"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:700 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
  sc.forEach(function(x,i){ var y=6+i*rh, s=x.s; g+='<text x="'+(L-8)+'" y="'+(y+15)+'" text-anchor="end">'+x.a[1]+'</text><rect x="'+L+'" y="'+(y+3)+'" width="'+w+'" height="17" fill="#F4F6F8"/>';
   if(s.app){ g+='<rect x="'+L+'" y="'+(y+3)+'" width="'+(w*s.pct)+'" height="17" fill="'+(x===worst?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(L+w+8)+'" y="'+(y+16)+'">'+Math.round(100*s.pct)+'%</text><text class="ax" x="'+(L+w+48)+'" y="'+(y+16)+'"'+(s.no?' style="fill:#C0392B"':'')+'>'+s.no+' NO'+(s.blank?' · '+s.blank+' OPEN':'')+'</text>'; }
   else g+='<text class="ax" x="'+(L+w+8)+'" y="'+(y+16)+'">'+(s.na===5?'N/A':'NOT ANSWERED')+'</text>'; });
  var yb=6+sc.length*rh; [0,25,50,75,100].forEach(function(v){ g+='<text class="ax" x="'+(L+w*v/100)+'" y="'+(yb+14)+'" text-anchor="middle">'+v+'%</text>'; });
  svg.innerHTML=g+'</svg>'; svg.style.display='';
 } else { svg.innerHTML=''; svg.style.display='none'; }
 var tot={y:0,p:0,no:0,app:0,blank:0}; sc.forEach(function(x){ ['y','p','no','app','blank'].forEach(function(k){ tot[k]+=x.s[k]; }); });
 var FD=S.g.fd.filter(function(r){return r.f;}), must=FD.filter(function(r){return r.sev==='Must close before next stage'&&r.st!=='Closed';});
 root.querySelector('.dr-stat').innerHTML=any?'<div><b>'+(tot.app?Math.round(100*(tot.y+0.5*tot.p)/tot.app)+'%':'—')+'</b><span>Overall readiness</span></div><div><b>'+tot.no+'</b><span>Questions answered No</span></div><div><b>'+tot.blank+'</b><span>Not answered</span></div><div><b>'+FD.length+'</b><span>Findings</span></div><div><b>'+must.length+'</b><span>Must-close findings open</span></div>':'';
 var P=S.g.p.filter(function(r){return r.n;});
 if(!any&&!P.length&&!FD.length){ root.querySelector('.dr-out').innerHTML=api.flags([],'Fill in the participants and answer the questions, and the checks appear here.'); return; }
 if(!F.stage) f.push(['warn','Choose the review stage. What a review must cover, and who must attend, depends on the stage.']);
 else { var need=T._need[F.stage]||[], have=P.map(function(r){return r.fn;}), miss=need.filter(function(x){return have.indexOf(x)<0;}); if(miss.length) f.push(['warn','Not represented at a '+esc(F.stage.replace(/ \(.*\)/,'').toLowerCase())+': '+miss.map(function(m){return m.toLowerCase();}).join(', ')+'. Their questions will come up later, when changes cost more.']); }
 if(P.length&&!P.some(function(r){return r.ind==='Yes';})) f.push(['warn','No independent reviewer. At least one participant should have no direct responsibility for the stage being reviewed; the designers cannot see their own blind spots. Medical device design control has long required this.']);
 if(P.length&&!P.some(function(r){return r.role==='Chair';})) f.push(['warn','No chair named. Someone has to keep the review to its purpose and record the decision.']);
 if(P.length&&!P.some(function(r){return r.role==='Scribe';})) f.push(['','No scribe named. The record of the review is part of the design history.']);
 sc.forEach(function(x){ var s=x.s, nf=FD.filter(function(r){return r.area===x.a[1];}).length;
  if(s.no>nf) f.push(['warn','<b>'+x.a[1]+'</b>: '+s.no+' question'+(s.no>1?'s':'')+' answered No but '+(nf?'only '+nf:'no')+' finding'+(nf===1?'':'s')+' raised. Each gap needs a finding and an action, or an explanation of why it is acceptable.']);
  if(s.na>=4) f.push(['',x.a[1]+': '+s.na+' of 5 marked N/A. Check that is a decision, not a skipped section.']); });
 if(tot.blank&&any) f.push(['',tot.blank+' question'+(tot.blank>1?'s are':' is')+' not answered yet.']);
 if(worst&&worst.s.pct<0.6) f.push(['warn','Weakest area: <b>'+worst.a[1]+'</b> at '+Math.round(100*worst.s.pct)+'%.']);
 FD.forEach(function(r,i){ var id='<b>Finding '+esc(r.no||(i+1))+'</b>';
  if(!r.sev) f.push(['warn',id+' has no severity.']);
  if(r.sev!=='Observation'&&!r.a) f.push(['warn',id+' has no action.']);
  if(r.a&&!String(r.who||'').trim()) f.push(['warn',id+' has no owner.']); else if(r.a&&/(,|;|\/|&|\band\b|^team$)/i.test(String(r.who).trim())) f.push(['warn',id+' has more than one owner. Name one.']);
  if(r.a&&!r.due&&r.st!=='Closed') f.push(['warn',id+' has no due date.']); });
 if(F.dec==='Proceed'&&must.length) f.push(['warn','The decision is Proceed, but '+must.length+' must-close finding'+(must.length>1?'s are':' is')+' open. Either close them, change the severity with a reason, or proceed with conditions.']);
 if(F.dec==='Proceed with conditions'&&!F.cond) f.push(['warn','Proceed with conditions, but no conditions are written.']);
 if(!F.dec&&(any||FD.length)) f.push(['','No decision recorded yet. A review ends with a decision: proceed, proceed with conditions, or repeat the review.']);
 if(F.dec&&F.dec!=='Repeat the review'&&must.length===0&&tot.no===0&&any) f.push(['ok','No open must-close findings and no questions answered No.']);
 root.querySelector('.dr-out').innerHTML=api.flags(f);
},
example:{f:{prod:'HX-200 handheld moisture meter, rev C (new product for grain and timber dealers)',stage:'Critical design review (CDR)',date:'2026-09-17',owner:'Tomas Lindqvist, lead design engineer',docs:'Requirements specification rev 4; drawing pack rev C; DFMEA rev 3; prototype test report TR-118; cost model v6; preliminary control plan',
 q_g1:'Yes',q_g2:'Partly',q_g3:'Yes',q_g4:'Yes',q_g5:'Yes',
 q_m1:'Partly',q_m2:'Yes',q_m3:'Yes',q_m4:'No',q_m5:'Yes',
 q_a1:'Yes',q_a2:'No',q_a3:'Yes',q_a4:'Partly',q_a5:'Yes',
 q_t1:'Yes',q_t2:'Partly',q_t3:'Yes',q_t4:'No',q_t5:'Yes',
 q_s1:'Yes',q_s2:'Partly',q_s3:'Yes',q_s4:'Yes',q_s5:'No',
 q_r1:'Yes',q_r2:'Yes',q_r3:'Partly',q_r4:'Yes',q_r5:'Yes',
 q_c1:'Yes',q_c2:'Yes',q_c3:'Partly',q_c4:'Yes',q_c5:'Yes',
 q_e1:'Yes',q_e2:'Partly',q_e3:'N/A',q_e4:'Yes',q_e5:'Partly',
 dec:'Proceed with conditions',appr:'Helen Brandt, engineering director',adate:'2026-09-18',cond:'Pilot build may start. Findings 1, 2 and 3 must be closed before the pre-production review on 30 October.'},
 g:{p:[{n:'Tomas Lindqvist',fn:'Design engineering',role:'Presenter',ind:'No'},{n:'Helen Brandt',fn:'Design engineering',role:'Approver',ind:'No'},{n:'Ruth Achebe',fn:'Quality',role:'Chair',ind:'Yes'},{n:'Paolo Greco',fn:'Manufacturing or process engineering',role:'Reviewer',ind:'Yes'},{n:'Mei Tanaka',fn:'Reliability',role:'Reviewer',ind:'Yes'},{n:'Jon Ferris',fn:'Test',role:'Reviewer',ind:'Yes'},{n:'Alma Duarte',fn:'Purchasing or supply chain',role:'Scribe',ind:'Yes'}],
 fd:[
  {no:'1',area:'Manufacturability',f:'Probe pin height and the sensor gap are critical to accuracy but are not marked as critical characteristics on drawing 200-014.',sev:'Must close before next stage',a:'Mark both as critical characteristics; add to PFMEA and control plan',who:'Tomas Lindqvist',due:'2026-10-03',st:'Open'},
  {no:'2',area:'Assembly',f:'The battery door can be fitted rotated 180 degrees; it closes but the contacts do not meet.',sev:'Must close before next stage',a:'Add an offset locating tab to the door and housing',who:'Tomas Lindqvist',due:'2026-10-10',st:'Open'},
  {no:'3',area:'Test',f:'No gauge study yet for the moisture reference cells used in the end-of-line calibration check.',sev:'Must close before next stage',a:'Run a gauge R&R on the reference cells with three operators',who:'Jon Ferris',due:'2026-10-17',st:'Open'},
  {no:'4',area:'Cost',f:'The rubber overmold on the grip adds $1.40 a unit; dealers in the survey did not rank grip feel.',sev:'Observation',a:'',who:'',due:'',st:'Open'}]}}
}
