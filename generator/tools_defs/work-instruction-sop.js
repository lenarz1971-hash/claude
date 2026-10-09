{
slug:'work-instruction-sop',
sections:[
 {type:'fields',title:'Document control',cols:4,hint:'Every controlled document carries who owns it, which revision it is, who approved it and when. That is what lets the person at the station know the copy in front of them is the current one.',fields:[
  {id:'title',label:'Title',wide:true,ph:'e.g. Install O-ring seal, pump 4410'},{id:'num',label:'Document number'},{id:'rev',label:'Revision'},{id:'eff',label:'Effective date',type:'date'},{id:'type',label:'Type',type:'select',opts:['Work instruction','Standard operating procedure (SOP)','Procedure','Form or checklist']},
  {id:'owner',label:'Owner'},{id:'appr',label:'Approved by'},{id:'apd',label:'Approval date',type:'date'},{id:'review',label:'Next review due',type:'date'}]},
 {type:'fields',title:'Scope and safety',fields:[{id:'scope',label:'Applies to',type:'textarea'},{id:'ppe',label:'Safety and PPE',type:'textarea'},{id:'tools',label:'Tools, materials and gauges',type:'textarea',wide:true}]},
 {type:'grid',id:'st',title:'Steps',rows:4,hint:'One action per step, starting with a verb. <b>Key point</b> is what makes the step right: quality, safety or ease. <b>Reason</b> says why, which is what people remember. The layout follows the job breakdown used in Training Within Industry.',cols:[
  {id:'n',label:'#',calc:function(){return '';}},
  {id:'step',label:'Step (what to do)',w:220,type:'textarea',rows:1},{id:'key',label:'Key point (how)',w:220,type:'textarea',rows:1},{id:'why',label:'Reason (why)',w:200,type:'textarea',rows:1},{id:'img',label:'Photo or figure',w:100}]},
 {type:'grid',id:'rv',title:'Revision history',rows:2,cols:[{id:'r',label:'Rev',w:60},{id:'d',label:'Date',type:'date'},{id:'ch',label:'What changed and why',w:300,type:'textarea',rows:1},{id:'by',label:'By',w:110}]},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out wi-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, f=[], steps=S.g.st.filter(function(r){return r.step;});
 root.querySelectorAll('table[data-grid="st"] tbody tr').forEach(function(tr,i){ var c=tr.querySelector('[data-c="n"]'); if(c) c.textContent=i+1; });
 ['num','rev','owner','appr','eff'].forEach(function(k){ if(!F[k]) f.push(['warn','No '+{num:'document number',rev:'revision',owner:'owner',appr:'approver',eff:'effective date'}[k]+'. An uncontrolled document cannot be trusted to be current.']); });
 if(F.rev&&!S.g.rv.some(function(r){return (r.r||'').trim()===F.rev.trim();})) f.push(['warn','Revision '+api.esc(F.rev)+' has no entry in the revision history.']);
 if(F.apd&&F.eff&&F.eff<F.apd) f.push(['warn','Effective before it was approved.']);
 if(F.review&&F.review<api.today()) f.push(['warn','The review date has passed.']);
 var nokey=steps.filter(function(r){return !r.key;}).length; if(nokey) f.push(['',nokey+' step'+(nokey>1?'s have':' has')+' no key point. Not every step needs one, but the steps where defects happen always do.']);
 var long=steps.filter(function(r){return (r.step.match(/\band\b|;|,/g)||[]).length>=2;}); if(long.length) f.push(['','Step'+(long.length>1?'s ':' ')+long.map(function(r){return S.g.st.indexOf(r)+1;}).join(', ')+' may contain more than one action. One action per step is easier to follow and to train.']);
 if(steps.length>15) f.push(['',steps.length+' steps. Long instructions are rarely read; consider splitting the job.']);
 if(steps.length&&!f.some(function(x){return x[0]==='warn';})) f.unshift(['ok','Controlled: number, revision, owner, approval and history are all present.']);
 root.querySelector('.wi-out').innerHTML=api.flags(f);
},
example:{f:{title:'Install O-ring seal, pump 4410',num:'WI-3107',rev:'D',eff:'2026-08-14',type:'Work instruction',owner:'Line 3 supervisor',appr:'Quality engineer',apd:'2026-08-12',review:'2027-08-12',
 scope:'Line 3 seal installation station, all shifts.',ppe:'Safety glasses. Cut-resistant gloves when handling housings.',tools:'Installation sleeve IS-4410 (check before each shift), O-ring 4410-OR from the dispenser, fixture F-31, lint-free cloth.'},
 g:{st:[{step:'Check the installation sleeve',key:'No cuts, burrs or flat spots on the lead-in',why:'A damaged sleeve nicks every seal it touches',img:'Fig 1'},
  {step:'Fit the sleeve over the housing thread',key:'Sleeve fully seated against the shoulder',why:'Covers the thread so the seal cannot drag on it',img:'Fig 2'},
  {step:'Take one O-ring from the dispenser',key:'Never from the bag; check for lint',why:'Dispenser rings are lot-traceable and clean',img:''},
  {step:'Roll the O-ring over the sleeve into the groove',key:'Roll, do not stretch past the mark on the sleeve',why:'Overstretching thins the section and causes leaks',img:'Fig 3'},
  {step:'Remove the sleeve and check the seal',key:'Seal seated all around, no twist',why:'A twisted seal passes a short leak test and fails in service',img:'Fig 4'}],
  rv:[{r:'C',d:'2025-11-02',ch:'New fixture F-31',by:'ME'},{r:'D',d:'2026-08-12',ch:'Installation sleeve added (CAPA-2026-041)',by:'Quality engineer'}]}}
}
