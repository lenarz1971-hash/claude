{
slug:'corrective-action-capa',
sections:[
 {type:'fields',title:'Record',cols:4,fields:[
  {id:'num',label:'CAPA number'},
  {id:'opened',label:'Opened',type:'date'},
  {id:'source',label:'Source',type:'select',opts:['Customer complaint','Internal nonconformance','Audit finding','Supplier issue','Field return','Other']},
  {id:'owner',label:'Owner'}]},
 {type:'fields',title:'Describe the problem',hint:'Facts only: what, where, when, how many, and how it was found. The cause comes later.',fields:[
  {id:'what',label:'What happened',type:'textarea',wide:true},
  {id:'where',label:'Where and when',type:'textarea'},
  {id:'extent',label:'How many, how big',type:'textarea'},
  {id:'req',label:'Requirement that was not met',type:'textarea',wide:true,hint:'Drawing, specification, procedure clause or customer requirement. If you cannot name one, check it is a nonconformance.'}]},
 {type:'grid',id:'cont',title:'Contain it now',rows:2,hint:'Protect the customer while the cause is found: stock, work in process, shipped product, and the same part elsewhere.',cols:[
  {id:'a',label:'Containment action',w:300,type:'textarea',rows:1},
  {id:'who',label:'Who',w:110},{id:'due',label:'Due',type:'date'},{id:'done',label:'Done',type:'date'},
  {id:'res',label:'Result (how many suspect, how many bad)',w:220,type:'textarea',rows:1}]},
 {type:'fields',title:'Find the root cause',hint:'Use the <a href="/tools/fishbone-5-whys.html">fishbone and 5 whys</a> tool for the analysis and record the conclusion here. Answer both questions: why did it happen, and why did it escape?',fields:[
  {id:'rcOcc',label:'Why it happened (occurrence)',type:'textarea',wide:true},
  {id:'rcEsc',label:'Why it was not caught (escape)',type:'textarea',wide:true},
  {id:'rcVer',label:'How the cause was verified',type:'textarea',wide:true}]},
 {type:'grid',id:'ca',title:'Corrective actions',rows:2,hint:'Each action should remove or control a cause named above. Mark which cause it addresses.',cols:[
  {id:'a',label:'Action',w:300,type:'textarea',rows:1},
  {id:'addr',label:'Addresses',type:'select',opts:['Occurrence','Escape','Both']},
  {id:'who',label:'Who',w:110},{id:'due',label:'Due',type:'date'},{id:'done',label:'Done',type:'date'}]},
 {type:'grid',id:'pa',title:'Prevent it elsewhere',rows:2,hint:'Where else could the same cause happen? Similar parts, other lines, other sites, the next design. This is what turns a corrective action into a preventive one.',cols:[
  {id:'where',label:'Where else',w:220,type:'textarea',rows:1},
  {id:'chk',label:'Checked: at risk?',type:'select',opts:['Not yet','At risk','Not at risk']},
  {id:'a',label:'Action taken',w:260,type:'textarea',rows:1},
  {id:'done',label:'Done',type:'date'}]},
 {type:'fields',title:'Check it worked, then close',cols:3,hint:'Effectiveness is checked against the problem, after enough time or volume to see a recurrence, not by confirming that the action was completed.',fields:[
  {id:'vMeth',label:'Effectiveness check: method and criteria',type:'textarea',wide:true,ph:'e.g. Seal-nick rate at final test below 1.0% for 8 consecutive weeks'},
  {id:'vRes',label:'Result',type:'textarea',wide:true},
  {id:'vDate',label:'Checked on',type:'date'},
  {id:'docs',label:'Documents updated',ph:'e.g. WI-3107 rev D, PFMEA rev B'},
  {id:'closed',label:'Closed on',type:'date'}]},
 {type:'custom',id:'st',title:'Status',html:'<div class="out ca-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, f=[], filled=function(g,k){return S.g[g].filter(function(r){return r[k];});};
 var steps=[['Problem described',!!(F.what&&F.extent)],['Contained',filled('cont','a').length>0&&filled('cont','a').every(function(r){return r.done;})],
  ['Root cause found',!!(F.rcOcc&&F.rcEsc)],['Cause verified',!!F.rcVer],['Corrective actions done',filled('ca','a').length>0&&filled('ca','a').every(function(r){return r.done;})],
  ['Checked elsewhere',filled('pa','where').length>0&&filled('pa','where').every(function(r){return r.chk&&r.chk!=='Not yet';})],
  ['Effective',!!(F.vRes&&F.vDate)],['Closed',!!F.closed]];
 var done=steps.filter(function(s){return s[1];}).length;
 f.push(['','<b>'+done+' of '+steps.length+'</b> stages complete. '+steps.map(function(s){return (s[1]?'✓ ':'○ ')+s[0];}).join(' &middot; ')]);
 if(F.rcOcc&&!F.rcEsc) f.push(['warn','There is a cause for why it happened but not for why it escaped. Fixing only the occurrence leaves the detection gap that let it reach the customer.']);
 var ca=filled('ca','a'), occ=ca.some(function(r){return r.addr==='Occurrence'||r.addr==='Both';}), esc=ca.some(function(r){return r.addr==='Escape'||r.addr==='Both';});
 if(ca.length&&!esc) f.push(['warn','No corrective action addresses the escape.']);
 if(ca.length&&!occ) f.push(['warn','No corrective action addresses the occurrence.']);
 var weak=/(retrain|re-train|training|remind|counsel|be more careful|awareness)/i;
 var tr=ca.filter(function(r){return weak.test(r.a);});
 if(tr.length&&tr.length===ca.length) f.push(['warn','Every corrective action is training or a reminder. Those fade; look for an action that changes the process, the tooling or the check.']);
 if(F.closed&&!(F.vRes&&F.vDate)) f.push(['warn','The CAPA is closed but has no effectiveness result.']);
 if(F.vDate&&F.closed&&F.closed<F.vDate) f.push(['warn','Closed before the effectiveness check date.']);
 if(F.opened&&!F.closed){ var d=Math.round((Date.now()-new Date(F.opened+'T00:00'))/864e5); if(d>=0) f.push(['', 'Open for '+d+' day'+(d===1?'':'s')+'.']); }
 root.querySelector('.ca-out').innerHTML=f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join('');
},
example:{f:{num:'CAPA-2026-041',opened:'2026-06-30',source:'Customer complaint',owner:'Quality engineer',
 what:'Customer reported two pumps leaking at the seal on installation.',where:'Customer site, reported 30 June. Both built on line 3, week 24.',extent:'2 field failures. Line 3 internal seal-nick reject rate 4.2% January to June.',
 req:'Drawing 4410 note 7: no leakage at 2.5 bar for 30 s. Customer specification CS-12 section 4.',
 rcOcc:'Seals are dragged over the housing thread during installation. Line 3 was set up without the protective sleeve used on lines 1 and 2, and the work instruction does not call for it.',
 rcEsc:'The final leak test was set to a 10 s hold. Small nicks leak slowly and pass a 10 s test; they fail at 30 s.',
 rcVer:'200 assemblies with a sleeve: 0.5% nicked. 200 without: 4.0%. Reproduced at 30 s hold on returned parts.',
 vMeth:'Seal-nick rate at final test below 1.0% for 8 consecutive weeks, and no field leaks on line 3 product for 6 months.',vRes:'',vDate:'',docs:'WI-3107 rev D; leak test program LT-4410 rev F; PFMEA rev B',closed:''},
 g:{cont:[{a:'Quarantine line 3 stock and WIP; retest at 30 s hold',who:'Quality tech',due:'2026-07-01',done:'2026-07-01',res:'640 suspect, 11 failed'},{a:'Notify customer; sort their stock of week 22-26 builds',who:'Customer quality',due:'2026-07-03',done:'2026-07-06',res:'212 sorted, 2 failed'}],
  ca:[{a:'Add installation sleeve to line 3 and to WI-3107',addr:'Occurrence',who:'ME',due:'2026-08-15',done:'2026-08-12'},{a:'Change leak test hold time to 30 s on all lines',addr:'Escape',who:'Test engineer',due:'2026-07-20',done:'2026-07-18'}],
  pa:[{where:'Lines 1 and 2, same pump family',chk:'Not at risk',a:'Sleeve already in use; leak test hold changed with line 3',done:'2026-07-18'},{where:'New pump 4520 launching Q1',chk:'At risk',a:'Sleeve and 30 s hold added to the launch control plan',done:''}]}}
}
