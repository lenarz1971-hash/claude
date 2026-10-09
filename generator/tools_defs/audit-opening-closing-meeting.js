{
slug:'audit-opening-closing-meeting',
sections:[
 {type:'fields',title:'The audit',cols:3,fields:[
  {id:'ref',label:'Audit reference'},
  {id:'type',label:'Type of audit',type:'select',opts:['Internal (first party)','Supplier (second party)','Certification (third party)','Regulatory or compliance']},
  {id:'auditee',label:'Auditee and site'},
  {id:'lead',label:'Lead auditor'},
  {id:'od',label:'Opening meeting date',type:'date'},
  {id:'ot',label:'Opening time',ph:'08:30'},
  {id:'cd',label:'Closing meeting date',type:'date'},
  {id:'ct',label:'Closing time',ph:'15:00'},
  {id:'mode',label:'Held',type:'select',opts:['On site','Remote','Hybrid']}]},
 {type:'grid',id:'att',title:'Attendance record',rows:4,hint:'Everyone at either meeting, with the meetings they attended. The attendance record is part of the audit evidence.',cols:[
  {id:'n',label:'Name',w:140},
  {id:'org',label:'Organization and job',w:190},
  {id:'role',label:'Role',type:'select',opts:['Lead auditor','Auditor','Technical expert','Observer','Guide','Auditee top management','Auditee representative','Process owner','Other auditee staff']},
  {id:'o',label:'Opening',type:'select',opts:['Yes','No']},
  {id:'c',label:'Closing',type:'select',opts:['Yes','No']}]},
 {type:'fields',title:'Confirmed at the opening meeting',hint:'Write what was confirmed, not what the plan said. If the auditee asked for a change, record it here.',fields:[
  {id:'obj',label:'Purpose and objectives',type:'textarea',wide:true},
  {id:'scope',label:'Scope',type:'textarea',wide:true},
  {id:'crit',label:'Criteria',type:'textarea',wide:true},
  {id:'grade',label:'Rating or grading criteria for findings',type:'textarea',wide:true,ph:'e.g. Major: a requirement not met at all, or a failure that could send nonconforming product to the customer. Minor: an isolated lapse. OFI: no requirement broken, but a risk or a better way.'},
  {id:'conf',label:'Confidentiality and information handling',type:'textarea',wide:true,ph:'e.g. No photos without the guide\'s consent; copies of records stay on site; personal data seen only as needed.'}]},
 {type:'custom',id:'oc',title:'Opening meeting agenda',hint:'Mark each point as it is covered. The list follows ISO 19011:2018, 6.4.3.',init:function(el,api){ el.innerHTML=window.TOOL._list('o',api); }},
 {type:'grid',id:'fs',title:'Findings presented at the closing meeting',rows:3,hint:'One row per finding, as presented. Record whether the auditee agrees with the <b>evidence</b>. Concurrence is about the facts; the auditee does not have to agree with the grade, and a disputed finding is recorded, not dropped.',cols:[
  {id:'no',label:'No.',w:46},
  {id:'g',label:'Grade',type:'select',opts:['Major nonconformity','Minor nonconformity','Opportunity for improvement','Positive practice']},
  {id:'s',label:'Finding in brief',w:260,type:'textarea',rows:1},
  {id:'cc',label:'Auditee concurrence',type:'select',opts:['Agrees with evidence','Agrees, with comment','Disputes the evidence']},
  {id:'cm',label:'Auditee comment',w:200,type:'textarea',rows:1}]},
 {type:'custom',id:'cc',title:'Closing meeting agenda',hint:'Mark each point as it is covered. The list follows ISO 19011:2018, 6.4.10.',init:function(el,api){ el.innerHTML=window.TOOL._list('c',api); }},
 {type:'grid',id:'ns',title:'Next steps',rows:2,hint:'Each step with one person responsible and a date: the report, the corrective action response, any follow-up audit or further evidence.',cols:[
  {id:'st',label:'Step',w:260,type:'textarea',rows:1},
  {id:'who',label:'Responsible',w:140},
  {id:'due',label:'By',type:'date'}]},
 {type:'fields',title:'Conclusion and report',cols:3,fields:[
  {id:'concl',label:'Audit conclusion as stated',type:'textarea',wide:true},
  {id:'rdate',label:'Report to be issued by',type:'date'},
  {id:'cadays',label:'Days to respond to nonconformities',type:'number',min:1,ph:'30'},
  {id:'dist',label:'Report distribution'}]},
 {type:'custom',id:'chk',title:'Record check',html:'<div class="stat ao-stat"></div><div class="out ao-out"></div>'}
],
_O:[['Introductions, and the roles of the audit team, guides and observers','The auditee needs to know who can ask what, and who is only watching.'],
 ['Objectives, scope and criteria confirmed','If scope or criteria are disputed later, findings can be disputed too.'],
 ['Schedule confirmed, including interim briefings and the closing meeting time','Without a closing time agreed now, top management may not be there for it.'],
 ['Audit methods explained, including that evidence is a sample','A sample carries uncertainty; saying so at the start avoids "you only looked at three" at the end.'],
 ['How findings will be graded','CMDA II.B.1 and ISO 19011 both ask for the rating or classification criteria to be explained before any finding is raised.'],
 ['Confidentiality and information security','The auditee is trusting the team with records, personal data and know-how; agree how they are handled.'],
 ['Safety, emergency and security arrangements, and PPE','An auditor who is hurt or breaches site security ends the audit.'],
 ['Guides, escorts and access to areas, people and records','Access problems found halfway through cost audit time.'],
 ['How findings will be shared during the audit, and how to raise concerns','No surprises at the closing meeting: the auditee hears of likely findings as they arise.'],
 ['Conditions under which the audit may be ended early','For example a safety incident, or no access to the evidence needed.'],
 ['How to appeal or complain about the conduct or conclusions','Required by most certification and supplier audit programs.'],
 ['Language of the audit and the report; questions answered','A finding misunderstood through a translator is a finding disputed.']],
_C:[['Purpose, scope and criteria restated','CMDA II.B.7 asks for the purpose, scope and criteria to be reiterated at the exit meeting.'],
 ['Grading criteria restated','So the grade of each finding is understood before the findings are read.'],
 ['Evidence was a sample: other nonconformities may exist','Audit evidence is based on a sample. Saying so protects the auditee and the auditor.'],
 ['Findings presented, each with its evidence and requirement','A finding without its evidence and requirement cannot be answered.'],
 ['Concurrence sought on the evidence for adverse findings','Agreeing the facts now makes corrective action faster and disputes rarer.'],
 ['Disagreements discussed and recorded','Unresolved diverging opinions are recorded and reported, not left out.'],
 ['Audit conclusion stated','The conclusion answers the audit objectives.'],
 ['Next steps explained: corrective action, follow-up, verification','The auditee should leave knowing what is expected and by when.'],
 ['Who is responsible for each next step','A next step without a name does not happen.'],
 ['Report date and distribution agreed','The auditee should know when the report will arrive and who else will see it.']],
_list:function(k,api){ var L=window.TOOL[k==='o'?'_O':'_C']; return '<div class="ao-l">'+L.map(function(x,i){ var id=k+(i+1); return '<label class="ao-r"><b>'+(i+1)+'</b><span>'+x[0]+'</span><select data-f="'+id+'" aria-label="'+api.esc(x[0])+'"><option value=""></option><option>Covered</option><option>Not covered</option><option>N/A</option></select></label>'; }).join('')+'</div>'; },
_add:function(d,n){ var t=new Date(d+'T00:00:00'); t.setDate(t.getDate()+n); return t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2); },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, esc=api.esc, n=api.num, f=[];
 var A=S.g.att.filter(function(r){return r.n;}), FS=S.g.fs.filter(function(r){return r.s||r.g;}), NS=S.g.ns.filter(function(r){return r.st;});
 var cov=function(k,L){ var c=0,nc=[],bl=0; L.forEach(function(x,i){ var v=F[k+(i+1)]||''; if(v==='Covered'||v==='N/A') c++; else if(v==='Not covered') nc.push(i); else bl++; }); return {c:c,nc:nc,bl:bl}; };
 var oc=cov('o',T._O), cc=cov('c',T._C);
 var at=function(k){ return A.filter(function(r){return r[k]==='Yes';}); }, ao=at('o'), ac=at('c');
 var grade={}; FS.forEach(function(r){ grade[r.g||'Not graded']=(grade[r.g||'Not graded']||0)+1; });
 var nc=FS.filter(function(r){return /nonconformity/.test(r.g||'');}), disp=FS.filter(function(r){return r.cc==='Disputes the evidence';});
 var cad=n(F.cadays); if(!(cad>0)) cad=NaN; var due=(F.rdate&&!isNaN(cad))?T._add(F.rdate,cad):'';
 root.querySelector('.ao-stat').innerHTML=(A.length||FS.length)?'<div><b>'+ao.length+' / '+ac.length+'</b><span>Attended opening / closing</span></div><div><b>'+oc.c+' of '+T._O.length+'</b><span>Opening points covered</span></div><div><b>'+cc.c+' of '+T._C.length+'</b><span>Closing points covered</span></div><div><b>'+(grade['Major nonconformity']||0)+' / '+(grade['Minor nonconformity']||0)+' / '+(grade['Opportunity for improvement']||0)+'</b><span>Major / minor / OFI</span></div><div><b>'+disp.length+'</b><span>Findings disputed</span></div><div><b>'+(due?new Date(due+'T00:00:00').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):'—')+'</b><span>Corrective action response due</span></div>':'';
 if(!A.length&&!FS.length&&!F.obj){ root.querySelector('.ao-out').innerHTML=api.flags([],'Fill in the attendance and the agenda points, and the checks appear here.'); return; }
 /* attendance */
 if(!A.length) f.push(['warn','No attendance record. Record who attended each meeting, with their job.']);
 else {
  var lead=A.filter(function(r){return r.role==='Lead auditor';});
  if(!lead.length) f.push(['warn','No lead auditor in the attendance list.']);
  else lead.forEach(function(r){ if(r.o!=='Yes'||r.c!=='Yes') f.push(['warn',esc(r.n)+' (lead auditor) is not marked present at both meetings. The lead auditor chairs them.']); });
  var mg=function(k){ return A.some(function(r){return r[k]==='Yes'&&(r.role==='Auditee top management'||r.role==='Auditee representative');}); };
  if(!mg('o')) f.push(['warn','No auditee management or representative at the opening meeting. Someone with authority has to confirm the plan, the access and the confidentiality terms.']);
  if(!mg('c')) f.push(['warn','No auditee management or representative at the closing meeting. The people who must act on the findings need to hear them.']);
  if(!A.some(function(r){return r.c==='Yes'&&r.role==='Auditee top management';})&&nc.length) f.push(['','No top management at the closing meeting, and there '+(nc.length>1?'are '+nc.length+' nonconformities':'is a nonconformity')+'. Their absence makes resources for corrective action harder to get.']);
  var noMark=A.filter(function(r){return !r.o&&!r.c;}); if(noMark.length) f.push(['warn','No attendance marked for '+noMark.map(function(r){return esc(r.n);}).join(', ')+'.']);
  var po=A.filter(function(r){return r.role==='Process owner'&&r.o==='Yes'&&r.c!=='Yes';}); if(po.length&&FS.length) f.push(['','Process owners at the opening but not the closing: '+po.map(function(r){return esc(r.n);}).join(', ')+'. If a finding is in their process, make sure they hear it first-hand.']);
 }
 /* opening content */
 var miss=[]; if(!F.obj) miss.push('objectives'); if(!F.scope) miss.push('scope'); if(!F.crit) miss.push('criteria'); if(miss.length) f.push(['warn','Not recorded as confirmed: '+miss.join(', ')+'.']);
 if(!F.grade) f.push(['warn','No grading criteria recorded. Explain at the opening how findings will be rated, so the grades at the closing are not a surprise.']);
 if(!F.conf&&(F.o6||'')!=='Covered') f.push(['warn','Confidentiality is neither recorded nor marked as covered.']);
 oc.nc.forEach(function(i){ f.push(['warn','Opening point '+(i+1)+' not covered: '+T._O[i][0].toLowerCase()+'. '+T._O[i][1]]); });
 if(oc.bl&&oc.bl<T._O.length) f.push(['',oc.bl+' opening point'+(oc.bl>1?'s':'')+' not marked yet.']);
 /* closing */
 cc.nc.forEach(function(i){ f.push(['warn','Closing point '+(i+1)+' not covered: '+T._C[i][0].toLowerCase()+'. '+T._C[i][1]]); });
 if(cc.bl&&cc.bl<T._C.length) f.push(['',cc.bl+' closing point'+(cc.bl>1?'s':'')+' not marked yet.']);
 FS.forEach(function(r,i){ var id='<b>Finding '+esc(r.no||(i+1))+'</b>';
  if(!r.g) f.push(['warn',id+' has no grade.']);
  if(/nonconformity/.test(r.g||'')&&!r.cc) f.push(['warn',id+': concurrence on the evidence not recorded.']);
  if(r.cc==='Disputes the evidence') f.push(['warn',id+' is disputed'+(r.cm?'':' and the auditee\'s reason is not recorded')+'. Check the evidence again if you can before the report; if the disagreement stands, record both views in the report.']); });
 if(nc.length&&!NS.some(function(r){return /correct|respon|capa|action plan/i.test(r.st);})) f.push(['warn','There '+(nc.length>1?'are nonconformities':'is a nonconformity')+' but no next step for the corrective action response.']);
 if(grade['Major nonconformity']&&!NS.some(function(r){return /follow|verif|re-?audit/i.test(r.st);})) f.push(['','A major nonconformity usually needs a follow-up audit or verification of the corrective action. None is in the next steps.']);
 NS.forEach(function(r){ var id='<b>'+esc(String(r.st).slice(0,50))+'</b>'; if(!String(r.who||'').trim()) f.push(['warn',id+' has no one responsible.']); else if(/(,|;|\/|&|\band\b)/i.test(r.who)) f.push(['warn',id+' has more than one person responsible. Name one.']); if(!r.due) f.push(['warn',id+' has no date.']); });
 if(!F.concl&&FS.length) f.push(['warn','No audit conclusion recorded. The closing meeting should state whether the audit objectives were met and what the findings mean for them.']);
 if(F.rdate&&F.cd){ var dd=Math.round((new Date(F.rdate+'T00:00:00')-new Date(F.cd+'T00:00:00'))/864e5); if(dd<0) f.push(['warn','The report date is before the closing meeting.']); else f.push(['','Report promised '+dd+' day'+(dd===1?'':'s')+' after the closing meeting'+(due?'; corrective action response due '+esc(due):'')+'. Check this against the audit program\'s deadline.']); }
 else if(FS.length) f.push(['warn','No report date agreed.']);
 if(F.od&&F.cd&&F.cd<F.od) f.push(['warn','The closing meeting is dated before the opening meeting.']);
 if(!f.some(function(x){return x[0]==='warn';})) f.push(['ok','The record covers attendance, both agendas, concurrence and next steps.']);
 root.querySelector('.ao-out').innerHTML=api.flags(f);
},
example:{f:{ref:'SA-2026-114',type:'Supplier (second party)',auditee:'Supplier 114 (precision compression springs), main plant',lead:'Grace Holloway',od:'2026-09-15',ot:'08:30',cd:'2026-09-16',ct:'14:00',mode:'On site',
 obj:'Determine whether the supplier\'s process controls for spring series PS-40 conform to the purchase order quality requirements, and whether last year\'s corrective actions are effective.',
 scope:'Coiling, stress relief, shot peening, final inspection and packing of PS-40 springs, both shifts; records from March to August 2026. Excludes the wire mill.',
 crit:'Purchase order quality clauses QC-3 to QC-9; drawing PS-40 rev F; ISO 9001:2015 clauses 8.5.1, 8.5.2, 8.7, 7.1.5; supplier\'s control plan CP-40 rev 2.',
 grade:'Major: a requirement not met at all, or a lapse that could ship nonconforming springs. Minor: an isolated lapse with no product at risk. OFI: no requirement broken, but a risk or a better practice.',
 conf:'Photos only with the guide\'s consent. Process parameters and prices stay confidential to purchasing and quality. Copies of records leave the site only for the findings.',
 o1:'Covered',o2:'Covered',o3:'Covered',o4:'Covered',o5:'Covered',o6:'Covered',o7:'Covered',o8:'Covered',o9:'Covered',o10:'Not covered',o11:'Covered',o12:'N/A',
 c1:'Covered',c2:'Covered',c3:'Not covered',c4:'Covered',c5:'Covered',c6:'Covered',c7:'Covered',c8:'Covered',c9:'Covered',c10:'Covered',
 concl:'The process controls for PS-40 conform in most respects. One major nonconformity (shot peening intensity not verified) means product could ship without the required fatigue life. Last year\'s corrective actions are effective except for gauge calibration recall.',
 rdate:'2026-09-23',cadays:'30',dist:'Supplier quality manager; buyer; auditee general manager'},
 g:{att:[
  {n:'Grace Holloway',org:'Customer: supplier quality engineer',role:'Lead auditor',o:'Yes',c:'Yes'},
  {n:'Victor Lund',org:'Customer: manufacturing engineer',role:'Technical expert',o:'Yes',c:'Yes'},
  {n:'Irene Castillo',org:'Supplier 114: general manager',role:'Auditee top management',o:'Yes',c:'No'},
  {n:'Hal Brennan',org:'Supplier 114: quality manager',role:'Auditee representative',o:'Yes',c:'Yes'},
  {n:'Ola Nwosu',org:'Supplier 114: production supervisor',role:'Process owner',o:'Yes',c:'No'},
  {n:'Kit Saunders',org:'Supplier 114: quality technician',role:'Guide',o:'Yes',c:'Yes'}],
 fs:[
  {no:'1',g:'Major nonconformity',s:'Almen strip intensity for shot peening not checked on 9 of 14 lots sampled (QC-6 requires every lot).',cc:'Agrees with evidence',cm:''},
  {no:'2',g:'Minor nonconformity',s:'Two free-length gauges past their calibration date on the inspection bench.',cc:'Agrees, with comment',cm:'Recall notices were raised; the gauges were not collected.'},
  {no:'3',g:'Minor nonconformity',s:'Packing labels for one lot showed the wrong drawing revision.',cc:'Disputes the evidence',cm:''},
  {no:'4',g:'Positive practice',s:'Coiling setup sheets with photos at every machine; first-off checks fully recorded.',cc:'',cm:''}],
 ns:[
  {st:'Issue the audit report',who:'Grace Holloway',due:'2026-09-23'},
  {st:'Corrective action response for findings 1 to 3',who:'Hal Brennan',due:'2026-10-23'},
  {st:'Follow-up visit to verify the shot peening correction',who:'Grace Holloway',due:'2026-11-20'}]}}
}
