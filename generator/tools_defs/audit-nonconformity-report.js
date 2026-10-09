{
slug:'audit-nonconformity-report',
sections:[
 {type:'fields',title:'Report header',cols:3,fields:[
  {id:'ref',label:'Audit reference'},
  {id:'type',label:'Type of audit',type:'select',opts:['Internal (first party)','Supplier (second party)','Certification (third party)']},
  {id:'auditee',label:'Auditee'},
  {id:'lead',label:'Lead auditor'},
  {id:'adate',label:'Audit dates',ph:'e.g. 15-16 Sep 2026'},
  {id:'issued',label:'Report issued',type:'date'},
  {id:'dMaj',label:'Days to respond to a major',type:'number',min:1},
  {id:'dMin',label:'Days to respond to a minor',type:'number',min:1},
  {id:'dist',label:'Distribution',ph:'Audit client, auditee management'}]},
 {type:'grid',id:'fd',title:'Findings',rows:3,hint:'Write each nonconformity in three parts: the <b>requirement</b> (and where it comes from), the <b>objective evidence</b> (what was seen, with references and quantities), and the <b>statement</b> of how the evidence fails the requirement. Then answer the two grading questions; the tool suggests a grade.',cols:[
  {id:'id',label:'No.',w:50},
  {id:'req',label:'Requirement and source',w:220,type:'textarea',rows:1},
  {id:'ev',label:'Objective evidence',w:260,type:'textarea',rows:1},
  {id:'st',label:'Statement of nonconformity',w:220,type:'textarea',rows:1},
  {id:'sys',label:'Missing or system breakdown?',type:'select',opts:['No','Yes'],tip:'The requirement is not implemented at all, or the process has failed across the board rather than in an isolated case'},
  {id:'risk',label:'Could reach customer?',type:'select',opts:['No','Yes'],tip:'Could nonconforming product or service reach the customer?'},
  {id:'g',label:'Grade assigned',type:'select',opts:['Major','Minor','Opportunity for improvement']},
  {id:'sg',label:'Suggested',calc:function(r){ if(!r.req&&!r.ev&&!r.st) return ''; if(!String(r.req||'').trim()) return 'OFI'; return (r.sys==='Yes'||r.risk==='Yes')?'Major':'Minor'; }}]},
 {type:'fields',title:'Conclusion',fields:[
  {id:'concl',label:'Audit conclusion',type:'textarea',wide:true,rows:3,hint:'Answer the audit objectives: the extent of conformity with the criteria, and the system’s ability to achieve its intended results. Note anything that limits the conclusion, such as areas not reached.'},
  {id:'pos',label:'Positive practices noted',type:'textarea',wide:true}]},
 {type:'custom',id:'sum',title:'Report summary and checks',html:'<div class="tgw"><table class="mv anr-t"></table></div><div class="out anr-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[];
 var R=S.g.fd.filter(function(r){return r.req||r.ev||r.st;}), tb=root.querySelector('.anr-t'), out=root.querySelector('.anr-out');
 if(!R.length){ tb.innerHTML=''; out.innerHTML=api.flags([],'Add the findings and the summary, response dates and checks appear here.'); return; }
 var sug=function(r){ if(!String(r.req||'').trim()) return 'Opportunity for improvement'; return (r.sys==='Yes'||r.risk==='Yes')?'Major':'Minor'; };
 var nm=function(r){return r.id?'finding '+esc(r.id):'line '+(S.g.fd.indexOf(r)+1);};
 var add=function(ds,d){ if(!/^\d{4}-\d\d-\d\d$/.test(ds||'')||isNaN(d)) return ''; var x=new Date(ds+'T00:00:00'); x.setDate(x.getDate()+d); return x.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); };
 var c={Major:0,Minor:0,'Opportunity for improvement':0,'':0};
 tb.innerHTML='<thead><tr><th>Finding</th><th>Grade</th><th>Response due</th></tr></thead><tbody>'+R.map(function(r){ var g=r.g||''; c[g]=(c[g]||0)+1; var d=g==='Major'?add(F.issued,api.num(F.dMaj)):(g==='Minor'?add(F.issued,api.num(F.dMin)):''); var s=String(r.st||r.ev||'').replace(/\s+/g,' '); return '<tr><td class="mo">'+nm(r)+(s?' &middot; '+esc(s.length>90?s.slice(0,89)+'…':s):'')+'</td><td>'+(g?esc(g==='Opportunity for improvement'?'OFI':g):'—')+'</td><td class="mt">'+(g==='Opportunity for improvement'?'no response required':(d||'—'))+'</td></tr>'; }).join('')+'</tbody>';
 f.push([c.Major?'warn':'ok','<b>'+c.Major+' major</b>, <b>'+c.Minor+' minor</b> and <b>'+c['Opportunity for improvement']+'</b> opportunit'+(c['Opportunity for improvement']===1?'y':'ies')+' for improvement'+(c['']?', '+c['']+' not graded':'')+'.'+(c.Major?' A major nonconformity normally needs correction and verified corrective action before a certification or approval decision.':'')]);
 var mism=R.filter(function(r){return r.g&&r.g!==sug(r);});
 if(mism.length) f.push(['warn','Grade differs from the grading answers: '+mism.map(function(r){return nm(r)+' is graded '+esc(r.g).toLowerCase()+', answers suggest '+sug(r).toLowerCase();}).join('; ')+'. Either the grade or the answers need another look; record the reason if you keep the grade.']);
 var nr=R.filter(function(r){return (r.g==='Major'||r.g==='Minor')&&!String(r.req||'').trim();}); if(nr.length) f.push(['warn','Graded as a nonconformity with no requirement: '+nr.map(nm).join(', ')+'. Without a requirement it can only be an opportunity for improvement.']);
 var ne=R.filter(function(r){return (r.g==='Major'||r.g==='Minor')&&!String(r.ev||'').trim();}); if(ne.length) f.push(['warn','No objective evidence for: '+ne.map(nm).join(', ')+'.']);
 var ns=R.filter(function(r){return (r.g==='Major'||r.g==='Minor')&&!String(r.st||'').trim();}); if(ns.length) f.push(['warn','No statement of nonconformity for: '+ns.map(nm).join(', ')+'.']);
 var vg=/\b(some|several|many|various|numerous|a few|a number of|often|frequently|always|never|most|lots? of)\b/i;
 var vv=R.filter(function(r){return vg.test(r.ev||'');}); if(vv.length) f.push(['warn','Vague quantity in the evidence: '+vv.map(nm).join(', ')+'. Say how many of how many were checked, and which ones, so the auditee can find them and size the problem.']);
 var bl=/\b(careless|negligent|lazy|ignored|refused|incompetent|sloppy|failed to bother)\b/i;
 var bb=R.filter(function(r){return bl.test((r.st||'')+' '+(r.ev||''));}); if(bb.length) f.push(['warn','Wording that blames people: '+bb.map(nm).join(', ')+'. Findings describe the system against its requirement, not an individual’s attitude.']);
 if(!String(F.concl||'').trim()) f.push(['warn','No audit conclusion. The report should answer the audit objectives, not only list findings.']);
 if(c.Major+c.Minor&&!F.issued) f.push(['warn','Enter the report issue date to set response due dates.']);
 f.push(['','Grading definitions vary between schemes and customers. A common rule: <b>major</b> when a required element is missing, the system has broken down, or nonconforming product or service is likely to reach the customer; <b>minor</b> for an isolated lapse that does not cast doubt on the system; <b>opportunity for improvement</b> when no requirement is breached. Use the definitions in the audit program or the client’s procedure.']);
 out.innerHTML=api.flags(f);
},
example:{f:{ref:'SA-2026-22',type:'Supplier (second party)',auditee:'Northline Precision Machining',lead:'Supplier quality engineer, Altair Pumps',adate:'15-16 Sep 2026',issued:'2026-09-18',dMaj:'15',dMin:'30',dist:'Altair Pumps supplier quality manager; Northline general manager and quality manager',
 concl:'The quality management system is implemented for order review, machining and final inspection of Altair parts, but control of monitoring and measuring equipment and the internal audit program are not effective. Product released with an overdue micrometer has not been evaluated. Approval status is held at conditional until the major finding (1) is closed with verified corrective action; the minor findings are followed up through the corrective action request process. Heat treatment (subcontracted) was not audited.',
 pos:'Setup verification sheets at CNC cells 1 to 4 are complete and signed for every job sampled; the visual work instructions with photos at the deburr bench are clear and current.'},
 g:{fd:[{id:'1',req:'ISO 9001:2015 7.1.5.2: measuring equipment used for product acceptance is calibrated or verified at specified intervals. Northline QP-07 sec 4.3: overdue equipment is removed from use and product measured with it since the due date is evaluated.',ev:'Micrometer M-114 used for final inspection of Altair PN 22-180 on travelers for lots 4471, 4472 and 4473 (3 of 3 sampled). Calibration due 31 Jul 2026; still in use 15 Sep 2026. No evaluation of product measured since 31 Jul.',st:'Measuring equipment past its calibration due date was used for product acceptance, and the effect on product already released was not evaluated.',sys:'No',risk:'Yes',g:'Major'},
  {id:'2',req:'Northline QP-12 sec 5.2: first article inspection report approved before the production run is released.',ev:'2 of 10 job travelers sampled (jobs 8812 and 8840) show production start 1 and 3 days before the FAI approval signature. The other 8 conform.',st:'Production was released before first article approval on 2 of 10 jobs sampled.',sys:'No',risk:'No',g:'Minor'},
  {id:'3',req:'ISO 9001:2015 9.2.1 and 9.2.2: internal audits at planned intervals according to an audit program.',ev:'2026 audit schedule lists 9 internal audits. 1 completed (February). No audit of machining or final inspection since March 2025. Quality manager confirmed no audits have been done since February.',st:'The internal audit program has not been carried out as planned; core production processes have not been audited for 18 months.',sys:'Yes',risk:'No',g:'Minor'},
  {id:'4',req:'Altair purchase order clause QA-3: certificates of conformance for raw material retained for 10 years.',ev:'Several material certificates for 2024 bar stock could not be found.',st:'Material certificates required by the purchase order were not retained.',sys:'No',risk:'No',g:'Minor'},
  {id:'5',req:'',ev:'Rework tags in cell 4 are handwritten and filed by date; rework hours are not compiled or trended.',st:'',sys:'No',risk:'No',g:'Opportunity for improvement'}]}}
}
