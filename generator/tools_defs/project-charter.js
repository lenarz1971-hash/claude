{
slug:'project-charter',
sections:[
 {type:'fields',title:'Project and people',cols:3,fields:[
  {id:'title',label:'Project title',wide:true,ph:'e.g. Reduce seal-nick rejects on line 3'},
  {id:'sponsor',label:'Sponsor',ph:'Owns the budget and the result'},
  {id:'owner',label:'Process owner',ph:'Runs the process day to day'},
  {id:'lead',label:'Project lead (belt)',ph:'Leads the team'},
  {id:'team',label:'Team members, one per row',type:'datagrid',cols:[{label:'Name and role',type:'text'}],rows:5,minRows:3}]},
 {type:'fields',title:'Why this project, and what is wrong',hint:'Write the problem as a fact you can measure: what, where, when, how big. Leave causes and solutions out; the project is there to find them.',fields:[
  {id:'case',label:'Business case',type:'textarea',wide:true,ph:'Why this matters now, in money, customers or risk'},
  {id:'problem',label:'Problem statement',type:'textarea',wide:true,ph:'e.g. Since January, 4.2% of line 3 assemblies are rejected for seal nicks, against 1% on lines 1 and 2.'}]},
 {type:'fields',title:'The goal, in numbers',cols:4,fields:[
  {id:'metric',label:'Primary metric',ph:'e.g. Seal-nick reject rate'},
  {id:'unit',label:'Unit',ph:'e.g. %'},
  {id:'base',label:'Baseline',type:'number'},
  {id:'target',label:'Target',type:'number'},
  {id:'due',label:'Target date',type:'date'},
  {id:'benefit',label:'Estimated annual benefit',ph:'e.g. $84,000 scrap and rework'},
  {id:'goal',label:'Goal statement',type:'textarea',wide:true,ph:'Built for you from the numbers above, or write your own'}]},
 {type:'custom',id:'goalchk',title:'Statement checks',html:'<div class="out ch-out"></div>'},
 {type:'fields',title:'Scope',fields:[
  {id:'inscope',label:'In scope',wide:false,type:'datagrid',cols:[{label:'In scope',type:'text'}],rows:4,minRows:2},
  {id:'outscope',label:'Out of scope',wide:false,type:'datagrid',cols:[{label:'Out of scope',type:'text'}],rows:4,minRows:2,hint:'Saying it now saves arguing later.'}]},
 {type:'grid',id:'ms',title:'Milestones',rows:5,hint:'One line per DMAIC phase is the usual minimum; each ends with a phase review.',cols:[
  {id:'ph',label:'Phase',type:'select',opts:['Define','Measure','Analyze','Improve','Control','Other']},
  {id:'what',label:'Deliverable',w:240},
  {id:'plan',label:'Planned',type:'date'},
  {id:'act',label:'Actual',type:'date'},
  {id:'st',label:'Status',calc:function(r){ if(r.act) return '<span style="color:var(--green)">Done</span>'; if(r.plan&&r.plan<new Date().toISOString().slice(0,10)) return '<span style="color:#C0392B">Late</span>'; return r.plan?'Open':''; }}]},
 {type:'fields',title:'Risks and sign-off',cols:3,fields:[
  {id:'risks',label:'Risks and constraints',type:'textarea',wide:true},
  {id:'signs',label:'Sponsor sign-off',ph:'Name'},
  {id:'signd',label:'Date',type:'date'},
  {id:'rev',label:'Revision',ph:'e.g. 1'}]}
],
update:function(root,api){
 var S=api.state(), f=[];
 var p=(S.f.problem||'').toLowerCase(), g=(S.f.goal||'');
 if(!p) f.push(['','Write a problem statement and it is checked here.']);
 else{
  var cause=['because','due to','caused by','lack of','root cause','fault of'].filter(function(w){return p.indexOf(w)>=0;});
  var sol=['implement','install','buy ','purchase','need to','should ','replace ','train '].filter(function(w){return p.indexOf(w)>=0;});
  if(cause.length) f.push(['warn','The problem statement names a cause ("'+cause.join('", "')+'"). Leave the cause for the Analyze phase; stating it now means the team sets out to prove it rather than find it.']);
  if(sol.length) f.push(['warn','The problem statement contains a solution ("'+sol.join('", "').trim()+'"). A charter that names its solution has skipped the project.']);
  if(!/\d/.test(p)) f.push(['warn','The problem statement has no number in it. How big is the problem?']);
  if(!cause.length&&!sol.length&&/\d/.test(p)) f.push(['ok','The problem statement has a number and names no cause or solution.']);
 }
 var b=api.num(S.f.base), t=api.num(S.f.target);
 if(!isNaN(b)&&!isNaN(t)&&b!==0){
  var ch=(t-b)/Math.abs(b)*100;
  var U=S.f.unit?(S.f.unit==='%'?'%':' '+api.esc(S.f.unit)):''; f.push(['', 'Baseline '+b+U+' to target '+t+U+' is a '+Math.abs(ch).toFixed(0)+'% '+(ch<0?'reduction':'increase')+'.']);
 }
 if(g){
  if(!/\d/.test(g)) f.push(['warn','The goal statement has no number. Make it measurable.']);
  if(!/(\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|week|month|quarter)/i.test(g)) f.push(['warn','The goal statement has no date. Make it time-bound.']);
 }
 root.querySelector('.ch-out').innerHTML=f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join('')+
  '<p class="noprint" style="margin-top:8px"><button type="button" class="tb ghost" id="mkgoal">Write the goal statement from the numbers</button></p>';
 root.querySelector('#mkgoal').onclick=function(){
  var m=S.f.metric||'the metric', u=S.f.unit?' '+S.f.unit:'', d=S.f.due?new Date(S.f.due+'T00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}):'[date]';
  var verb=(!isNaN(b)&&!isNaN(t)&&t<b)?'Reduce':'Increase';
  S.f.goal=verb+' '+m+' from '+(isNaN(b)?'[baseline]':b+u)+' to '+(isNaN(t)?'[target]':t+u)+' by '+d+'.';
  var el=root.querySelector('[data-f="goal"]'); el.value=S.f.goal; el.dispatchEvent(new Event('input',{bubbles:true}));
 };
},
example:{f:{title:'Reduce seal-nick rejects on line 3',sponsor:'Plant manager',owner:'Line 3 supervisor',lead:'Quality engineer (Green Belt)',
 team:'Assembly lead, line 3\nMaintenance technician\nIncoming inspection\nYellow Belt, second shift',
 case:'Seal-nick rejects on line 3 cost about $7,000 a month in scrap and rework, and two escapes reached the customer last quarter.',
 problem:'From January to June, 4.2% of line 3 pump assemblies were rejected at final test for nicked O-ring seals, against 1.0% on lines 1 and 2 building the same part.',
 metric:'Seal-nick reject rate at final test',unit:'%',base:'4.2',target:'1.0',due:'2026-12-18',benefit:'About $64,000 a year in scrap and rework',
 goal:'Reduce seal-nick reject rate at final test from 4.2% to 1.0% by December 18, 2026.',
 inscope:'Line 3 seal installation and handling\nIncoming O-rings for the pump family',outscope:'Lines 1 and 2\nRedesign of the seal groove',
 risks:'Line 3 cannot stop for more than one shift for trials.\nO-ring supplier change is outside the plant\'s authority.',signs:'',rev:'1'},
 g:{ms:[{ph:'Define',what:'Charter signed, SIPOC, VOC',plan:'2026-07-17',act:'2026-07-15'},{ph:'Measure',what:'Baseline confirmed, MSA on the leak test',plan:'2026-08-21',act:'2026-08-27'},{ph:'Analyze',what:'Root cause verified',plan:'2026-09-25',act:''},{ph:'Improve',what:'Fix piloted on one shift',plan:'2026-11-06',act:''},{ph:'Control',what:'Control plan handed to the process owner',plan:'2026-12-18',act:''}]}}
}
