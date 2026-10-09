{
slug:'auditor-competence-evaluation',
sections:[
 {type:'fields',title:'Auditor and role',cols:3,fields:[
  {id:'name',label:'Auditor'},
  {id:'role',label:'Evaluated for',type:'select',opts:['Auditor in training','Auditor','Audit team leader']},
  {id:'prog',label:'Audit program and discipline',ph:'e.g. Internal QMS audits, ISO 9001'},
  {id:'evr',label:'Evaluated by'},
  {id:'date',label:'Evaluation date',type:'date'},
  {id:'next',label:'Next evaluation',type:'date'}]},
 {type:'grid',id:'cp',title:'Competence profile and evaluation',rows:4,hint:'List what the role needs under each heading, the level required, the level found, how it was evaluated and the evidence. Rating scale used here: <b>0</b> none, <b>1</b> aware, <b>2</b> can do with supervision, <b>3</b> does it independently, <b>4</b> can coach others. The scale is a convention of this tool; use your program’s own if it has one.',cols:[
  {id:'cat',label:'Area',type:'select',w:215,opts:['Personal behavior','Generic audit knowledge and skills','Discipline and sector knowledge','Team leader knowledge and skills','Education','Work experience','Auditor training','Audit experience']},
  {id:'item',label:'Competence required',w:220,type:'textarea',rows:1},
  {id:'req',label:'Required',type:'select',opts:['0','1','2','3','4']},
  {id:'cur',label:'Found',type:'select',opts:['0','1','2','3','4']},
  {id:'gap',label:'Gap',calc:function(r){ if(r.req===''||r.req==null||r.cur===''||r.cur==null) return ''; var g=(+r.cur)-(+r.req); return g<0?'<span class="bad">'+g+'</span>':'<span class="good">met</span>'; }},
  {id:'m',label:'Evaluation method',type:'select',opts:['Review of records','Feedback','Interview','Observation','Testing','Post-audit review']},
  {id:'ev',label:'Evidence',w:200,type:'textarea',rows:1},
  {id:'act',label:'Development action',w:200,type:'textarea',rows:1},
  {id:'due',label:'Action due',type:'date'}]},
 {type:'custom',id:'res',title:'Profile against requirement',hint:'Navy dot: level found. Gold ring: level required. Red dots are below the requirement.',html:'<div class="svgw ace-chart"></div><div class="tgw"><table class="mv ace-t"></table></div><div class="out ace-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[];
 var ch=root.querySelector('.ace-chart'), tb=root.querySelector('.ace-t'), out=root.querySelector('.ace-out');
 var R=S.g.cp.filter(function(r){return r.item||r.cat;});
 if(!R.length){ ch.innerHTML=''; tb.innerHTML=''; out.innerHTML=api.flags([],'Add the competences the role needs, with required and found levels, and the profile and checks appear here.'); return; }
 var nf=function(r){return esc(String(r.item||r.cat||'').replace(/\s+/g,' '));};
 var rated=function(r){return r.req!==''&&r.req!=null&&r.cur!==''&&r.cur!=null;};
 var nm=function(r){var s=String(r.item||r.cat||'').replace(/\s+/g,' ');return esc(s.length>48?s.slice(0,47)+'…':s);};
 /* chart */
 var W=760, Lb=330, rh=26, H=40+R.length*rh+6, sx=function(v){return Lb+20+v*((W-Lb-50)/4);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Competence found against required"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.a{font:600 11px Archivo,sans-serif;fill:#4A5D71}</style>';
 var lv=['0 none','1 aware','2 supervised','3 independent','4 coach'];
 for(var k=0;k<=4;k++){ g+='<line x1="'+sx(k)+'" x2="'+sx(k)+'" y1="30" y2="'+(H-6)+'" stroke="#DDE1E4"/><text class="a" x="'+sx(k)+'" y="20" text-anchor="middle">'+lv[k]+'</text>'; }
 R.forEach(function(r,i){ var y=40+i*rh+rh/2, lab=nm(r);
  g+='<text x="'+(Lb)+'" y="'+(y+4)+'" text-anchor="end">'+lab+'</text>';
  if(!rated(r)){ g+='<text class="a" x="'+sx(0)+'" y="'+(y+4)+'">not rated</text>'; return; }
  var q=+r.req, c=+r.cur, col=c<q?'#C0392B':'#0F3E68';
  if(c<q) g+='<line x1="'+sx(c)+'" x2="'+sx(q)+'" y1="'+y+'" y2="'+y+'" stroke="#C0392B" stroke-width="3"/>';
  g+='<circle cx="'+sx(q)+'" cy="'+y+'" r="9" fill="none" stroke="#D8B147" stroke-width="3"/><circle cx="'+sx(c)+'" cy="'+y+'" r="6" fill="'+col+'"/>'; });
 ch.innerHTML=g+'</svg>';
 /* by area */
 var CATS=['Personal behavior','Generic audit knowledge and skills','Discipline and sector knowledge','Team leader knowledge and skills','Education','Work experience','Auditor training','Audit experience'];
 var rows=CATS.map(function(c){ var X=R.filter(function(r){return r.cat===c;}), Y=X.filter(rated), met=Y.filter(function(r){return +r.cur>=+r.req;}).length; return {c:c,n:X.length,y:Y.length,met:met}; });
 var oth=R.filter(function(r){return CATS.indexOf(r.cat)<0;}).length;
 tb.innerHTML='<thead><tr><th>Area</th><th>Items</th><th>Met</th><th>Below</th></tr></thead><tbody>'+rows.filter(function(o){return o.n;}).map(function(o){return '<tr><td class="mo">'+o.c+'</td><td>'+o.n+'</td><td class="mt">'+o.met+'</td><td class="mu'+(o.y-o.met?' bad':'')+'">'+(o.y-o.met)+'</td></tr>';}).join('')+(oth?'<tr><td class="mo">No area chosen</td><td>'+oth+'</td><td></td><td></td></tr>':'')+'</tbody>';
 /* checks */
 var Y=R.filter(rated), gaps=Y.filter(function(r){return +r.cur<+r.req;});
 var role=F.role||'the role';
 if(!Y.length) f.push(['warn','No competence has both a required and a found level yet, so readiness cannot be judged.']); else f.push([gaps.length?'warn':'ok','<b>'+(Y.length-gaps.length)+' of '+Y.length+'</b> rated competences meet the requirement for '+esc(role.toLowerCase())+'. '+(gaps.length?'<b>Not yet ready</b>: '+gaps.length+' gap'+(gaps.length>1?'s':'')+' to close: '+gaps.map(function(r){return nf(r)+' ('+r.cur+' vs '+r.req+')';}).join('; ')+'.':'Ready for the role on this evidence; record the decision and the next evaluation date.')]);
 var ur=R.filter(function(r){return !rated(r);}); if(ur.length) f.push(['warn','Not rated yet: '+ur.map(nf).join('; ')+'.']);
 var pb=gaps.filter(function(r){return r.cat==='Personal behavior';}); if(pb.length) f.push(['warn','Gap in personal behavior: '+pb.map(nf).join('; ')+'. Behaviors are built through coaching, feedback and observed practice, not a course. Pair the auditor with an experienced team leader and observe again.']);
 var na=gaps.filter(function(r){return !String(r.act||'').trim();}); if(na.length) f.push(['warn','Gap with no development action: '+na.map(nf).join('; ')+'.']);
 var nd=R.filter(function(r){return String(r.act||'').trim()&&!r.due;}); if(nd.length) f.push(['warn','Development action with no due date: '+nd.map(nf).join('; ')+'.']);
 var ne=Y.filter(function(r){return !String(r.ev||'').trim();}); if(ne.length) f.push(['warn','Rated with no evidence recorded: '+ne.map(nf).join('; ')+'. Another evaluator should be able to see why the rating was given.']);
 var rr=Y.filter(function(r){return (r.cat==='Personal behavior'||r.cat==='Generic audit knowledge and skills'||r.cat==='Team leader knowledge and skills')&&r.m==='Review of records'&&+r.cur>=3;}); if(rr.length) f.push(['warn','Skill or behavior rated 3 or higher from records alone: '+rr.map(nf).join('; ')+'. A certificate shows the training happened, not that the skill is used. Confirm by observation, feedback or post-audit review.']);
 var M={}; R.forEach(function(r){ if(r.m) M[r.m]=1; }); var mc=Object.keys(M).length;
 if(mc===0) f.push(['warn','No evaluation method recorded. Record how each rating was reached.']); else if(mc<2) f.push(['warn','Only one evaluation method used. ISO 19011:2018 (7.4) describes several methods (review of records, feedback, interview, observation, testing, post-audit review) and expects at least two of them to be combined so the evaluation is reliable.']);
 else f.push(['ok',mc+' evaluation methods used: '+Object.keys(M).join(', ').toLowerCase()+'.']);
 var used={}; R.forEach(function(r){used[r.cat]=1;});
 var want=CATS.filter(function(c){return c!=='Team leader knowledge and skills'||F.role==='Audit team leader';}).filter(function(c){return !used[c];});
 if(want.length) f.push(['warn','No items under: '+want.join(', ').toLowerCase()+'. ISO 19011:2018 clause 7.2 covers personal behavior, knowledge and skills (generic and discipline-specific), and how they are achieved through education, work experience, auditor training and audit experience'+(F.role==='Audit team leader'?', plus additional competence for leading a team':'')+'.']);
 if(F.date&&F.next&&F.next<=F.date) f.push(['warn','The next evaluation date is not after this one.']);
 if(F.date&&!F.next) f.push(['warn','Set the next evaluation date. Competence has to be maintained (ISO 19011 7.6), and the program should re-evaluate auditors periodically.']);
 f.push(['','Required levels come from the audit program’s needs: the processes, risks and standards to be audited. The same auditor can be ready for one program and not another.']);
 out.innerHTML=api.flags(f);
},
example:{f:{name:'D. Alvarez, process engineer',role:'Audit team leader',prog:'Internal QMS audits, ISO 9001:2015 and authority SOPs',evr:'Quality and compliance manager',date:'2026-09-22',next:'2027-09-22'},
 g:{cp:[
  {cat:'Personal behavior',item:'Ethical, open-minded and diplomatic with auditees',req:'3',cur:'3',m:'Feedback',ev:'Auditee feedback forms from 4 audits, all rated good or better on courtesy and fairness',act:'',due:''},
  {cat:'Personal behavior',item:'Decisive: reaches conclusions on the evidence and holds them under pushback',req:'3',cur:'2',m:'Observation',ev:'Observed at distribution audit (Jun 2026): softened a supported finding to an OFI after the manager objected',act:'Co-lead two audits with the senior lead auditor; debrief each closing meeting',due:'2027-02-28'},
  {cat:'Generic audit knowledge and skills',item:'Planning an audit, sampling and working papers',req:'3',cur:'3',m:'Post-audit review',ev:'Review of plans and working papers for audits IA-26-04 and IA-26-09; samples defined and recorded',act:'',due:''},
  {cat:'Generic audit knowledge and skills',item:'Writing nonconformity statements (requirement, evidence, statement)',req:'3',cur:'3',m:'Testing',ev:'Scored 9 of 10 on the finding-writing exercise',act:'',due:''},
  {cat:'Generic audit knowledge and skills',item:'Interviewing: open questions, listening, confirming facts',req:'3',cur:'3',m:'Observation',ev:'Observed two interviews at treatment plant audit (Mar 2026)',act:'',due:''},
  {cat:'Discipline and sector knowledge',item:'Water treatment processes and drinking water regulations',req:'3',cur:'4',m:'Interview',ev:'12 years in plant operations; holds state Grade IV operator license',act:'',due:''},
  {cat:'Discipline and sector knowledge',item:'ISO 9001:2015 requirements',req:'3',cur:'2',m:'Testing',ev:'Scored 64% on the clause knowledge test (pass 80%)',act:'Complete ISO 9001 requirements refresher and retake the test',due:'2026-12-15'},
  {cat:'Team leader knowledge and skills',item:'Leading a team: assigning work, resolving conflict, chairing meetings',req:'3',cur:'2',m:'Observation',ev:'Chaired one opening meeting under supervision; no closing meeting yet',act:'Chair opening and closing meetings on the next two audits with the senior lead auditor observing',due:'2027-02-28'},
  {cat:'Education',item:'Technical degree or equivalent experience',req:'2',cur:'3',m:'Review of records',ev:'BS chemical engineering (HR file)',act:'',due:''},
  {cat:'Work experience',item:'At least 4 years in a technical or quality role',req:'3',cur:'4',m:'Review of records',ev:'12 years with the authority, operations and engineering',act:'',due:''},
  {cat:'Auditor training',item:'Internal auditor course with exam',req:'3',cur:'3',m:'Review of records',ev:'3-day internal auditor course, passed exam (Feb 2025)',act:'',due:''},
  {cat:'Audit experience',item:'Audits completed as a team member',req:'3',cur:'3',m:'Review of records',ev:'6 audits, 14 audit days since Mar 2025',act:'',due:''}]}}
}
