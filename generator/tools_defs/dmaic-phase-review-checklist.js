{
slug:'dmaic-phase-review-checklist',
sections:[
 {type:'fields',title:'Which review',cols:4,fields:[{id:'name',label:'Project',wide:true},{id:'ph',label:'Phase being reviewed',type:'select',opts:['Define','Measure','Analyze','Improve','Control']},{id:'date',label:'Review date',type:'date'},{id:'rev',label:'Reviewer (sponsor)'},{id:'lead',label:'Presented by'}]},
 {type:'custom',id:'q',title:'The questions',hint:'Answer each one with the evidence in front of you. "Partly" with a note is more useful than a generous "yes".',html:'<div class="pr-q"></div>'},
 {type:'custom',id:'res',title:'Decision',html:'<div class="out pr-out"></div>'},
 {type:'fields',title:'Actions and sign-off',fields:[{id:'acts',label:'Actions agreed before or after moving on',type:'textarea',wide:true},{id:'dec',label:'Decision recorded',type:'select',opts:['Go','Go, with actions','Not yet: repeat the review','Stop the project']},{id:'sign',label:'Signed by'}]}
],
blankX:function(){return {a:{},nt:{}};},
update:function(root,api){
 var S=api.state(), a=S.x.a||(S.x.a={}), nt=S.x.nt||(S.x.nt={}), ph=S.f.ph||'Define';
 var Q={Define:['Is the problem stated as a measurable fact, with no cause or solution in it?','Is the goal stated with a baseline, a target and a date?','Are the scope boundaries agreed, including what is out of scope?','Is it clear who the customers are and what they need (CTQs)?','Is there a SIPOC or high-level process map?','Are the team, roles and time commitment agreed?','Is there a project plan with milestones?','Does the business case still justify the effort?'],
  Measure:['Is there a data collection plan with operational definitions?','Has the measurement system been checked before the data were trusted?','Is the baseline measured on the same metric as the goal?','Was enough data collected to describe the current process, including its variation?','Were the data stratified (shift, machine, lot) where it might matter?','Is the problem still the size the charter said it was?','Is the goal still realistic given the baseline?'],
  Analyze:['Were possible causes gathered widely before narrowing down (fishbone, process walk)?','Were the main causes prioritized with data rather than by vote alone?','Has each root cause been verified with data, not just agreed on?','Is it clear how much of the problem each verified cause explains?','Were causes outside the team\'s control identified and escalated?','Does the team have evidence for why the defect escaped, as well as why it occurred?'],
  Improve:['Were several solutions considered before one was chosen?','Does each solution act on a verified root cause?','Were costs, benefits and risks compared (and an FMEA updated where the change adds risk)?','Was the change piloted before full rollout, with a prediction written down first?','Did the pilot result show a real improvement against the baseline?','Are the people who do the work on board with the change?'],
  Control:['Is there a control plan owned by the process owner?','Is the key output being monitored (for example on a control chart) with a reaction plan?','Have work instructions, SOPs, FMEA and training been updated?','Has the improvement held for long enough to be confident?','Have the benefits been confirmed by finance or the sponsor?','Has the process owner formally accepted the handover?','Have lessons learned been recorded and shared?']};
 var qs=Q[ph], host=root.querySelector('.pr-q');
 if(host.dataset.ph!==ph){ host.dataset.ph=ph;
  host.innerHTML=qs.map(function(q,i){ var k=ph+i; return '<div class="pr-r"><p><b>'+(i+1)+'.</b> '+q+'</p><div class="pr-a" role="radiogroup" aria-label="Question '+(i+1)+'">'+['Yes','Partly','No','N/A'].map(function(v){return '<label><input type="radio" name="'+k+'" value="'+v+'"'+(a[k]===v?' checked':'')+'><b class="v'+v.replace('/','')+'">'+v+'</b></label>';}).join('')+'</div><input type="text" class="pr-n" data-nk="'+k+'" placeholder="Evidence or note" value="'+api.esc(nt[k]||'')+'" aria-label="Note for question '+(i+1)+'"></div>'; }).join('');
  host.querySelectorAll('input[type=radio]').forEach(function(r){ r.onchange=function(){ a[r.name]=r.value; api.save(); }; });
  host.querySelectorAll('.pr-n').forEach(function(t){ t.oninput=function(){ nt[t.dataset.nk]=t.value; api.save(); }; });
 }
 var c={Yes:0,Partly:0,No:0,'N/A':0}, un=0; qs.forEach(function(q,i){ var v=a[ph+i]; if(v) c[v]++; else un++; });
 var f=[['','<b>'+ph+'</b> review: '+c.Yes+' yes, '+c.Partly+' partly, '+c.No+' no, '+c['N/A']+' not applicable'+(un?', '+un+' unanswered':'')+'.']];
 var noNote=qs.filter(function(q,i){return (a[ph+i]==='Partly'||a[ph+i]==='No')&&!nt[ph+i];}).length;
 if(un) f.push(['','Answer every question before deciding.']);
 else if(c.No===0&&c.Partly===0) f.push(['ok','Suggested decision: <b>Go</b>.']);
 else if(c.No===0) f.push(['','Suggested decision: <b>Go, with actions</b> for the '+c.Partly+' partly answered question'+(c.Partly>1?'s':'')+'. Write each one in the actions box with an owner.']);
 else f.push(['warn','Suggested decision: <b>Not yet</b>. '+c.No+' question'+(c.No>1?'s are':' is')+' answered no. Moving on with a gap here usually costs more later than closing it now.']);
 if(noNote) f.push(['warn',noNote+' "partly" or "no" answer'+(noNote>1?'s have':' has')+' no note. Write down what is missing.']);
 if(S.f.dec&&!un){ var sug=c.No?'Not yet':c.Partly?'Go, with actions':'Go'; if(S.f.dec.indexOf(sug)!==0&&S.f.dec!=='Stop the project') f.push(['','The recorded decision ('+S.f.dec+') differs from the suggestion. That is the reviewer\'s call; note the reason in the actions box.']); }
 root.querySelector('.pr-out').innerHTML=api.flags(f);
},
example:{f:{name:'Reduce seal-nick rejects on line 3',ph:'Measure',date:'2026-08-27',rev:'Plant manager',lead:'Quality engineer',acts:'Confirm the baseline with 2 more weeks on second shift. Owner: YB. Due Sept. 10.',dec:'Go, with actions',sign:''},
 x:{a:{Measure0:'Yes',Measure1:'Yes',Measure2:'Yes',Measure3:'Partly',Measure4:'Yes',Measure5:'Yes',Measure6:'Yes'},nt:{Measure0:'Data collection plan rev 2',Measure1:'Leak tester MSA, Aug. 18',Measure3:'Only one week of second-shift data'}}}
}
