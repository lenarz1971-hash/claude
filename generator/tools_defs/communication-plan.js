{
slug:'communication-plan',
sections:[
 {type:'fields',title:'Project',cols:3,fields:[{id:'name',label:'Project',wide:true},{id:'owner',label:'Plan owner'},{id:'date',label:'Date',type:'date'}]},
 {type:'grid',id:'c',title:'Who hears what, how and when',rows:4,hint:'One row per audience and message. Start from the <a href="/tools/stakeholder-analysis.html">stakeholder analysis</a>: everyone in "manage closely" needs a row.',cols:[
  {id:'aud',label:'Audience',w:150},{id:'msg',label:'What they need to hear',w:220,type:'textarea',rows:1},{id:'why',label:'Purpose',type:'select',opts:['Inform','Get input','Get a decision','Build support','Escalate']},
  {id:'how',label:'Method',type:'select',opts:['Face to face','Meeting','Email','Report or dashboard','Visual board','Phone or video call','Newsletter or intranet']},
  {id:'dir',label:'Direction',type:'select',opts:['One-way','Two-way']},
  {id:'freq',label:'Frequency',type:'select',opts:['Once','Daily','Weekly','Every two weeks','Monthly','At each phase review','As needed']},
  {id:'who',label:'Sender',w:110},{id:'fb',label:'How you know it landed',w:180,type:'textarea',rows:1}]},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out cm-out"></div>'}
],
update:function(root,api){
 var S=api.state(), rows=S.g.c.filter(function(r){return r.aud;}), f=[];
 rows.forEach(function(r){ var nm='<b>'+api.esc(r.aud)+'</b>';
  if(!r.how||!r.freq||!r.who) f.push(['warn',nm+': method, frequency and sender are all needed.']);
  if((r.why==='Get input'||r.why==='Get a decision'||r.why==='Build support')&&r.dir==='One-way') f.push(['warn',nm+': the purpose is to '+r.why.toLowerCase()+', but the method is one-way. Input, decisions and support need a way to answer back.']);
  if(r.why==='Build support'&&(r.how==='Email'||r.how==='Newsletter or intranet')) f.push(['',nm+': support is rarely built by '+r.how.toLowerCase()+'. Consider face to face.']);
  if(!r.fb) f.push(['',nm+': nothing says how you will know the message was understood.']);
 });
 if(rows.length){ var fr={}; rows.forEach(function(r){fr[r.freq]=1;}); if(!fr['At each phase review']&&!fr['Monthly']&&!fr['Fortnightly']&&!fr['Weekly']) f.push(['warn','Nothing recurs. A plan made only of one-off messages goes quiet after the kickoff.']);
  if(!f.some(function(x){return x[0]==='warn';})) f.unshift(['ok','Every row has a method, a frequency and a sender, and two-way purposes have two-way methods.']); }
 root.querySelector('.cm-out').innerHTML=api.flags(f,'Add rows and the checks appear here.');
},
example:{f:{name:'Reduce seal-nick rejects on line 3',owner:'Quality engineer (Green Belt)',date:'2026-07-10'},
 g:{c:[{aud:'Plant manager (sponsor)',msg:'Progress against the goal, decisions needed, risks',why:'Get a decision',how:'Meeting',dir:'Two-way',freq:'At each phase review',who:'Project lead',fb:'Tollgate sign-off recorded'},
  {aud:'Line 3 assemblers, both shifts',msg:'Why the project exists, what will change at their station, how to give ideas',why:'Build support',how:'Face to face',dir:'Two-way',freq:'Fortnightly',who:'Line 3 supervisor',fb:'Ideas raised at the huddle; questions answered'},
  {aud:'OEM quality contact',msg:'Containment status and the date the fix is in place',why:'Inform',how:'Email',dir:'One-way',freq:'Fortnightly',who:'Customer quality',fb:'Acknowledged in reply'},
  {aud:'Finance',msg:'Savings method and baseline',why:'Get input',how:'Email',dir:'One-way',freq:'Once',who:'Project lead',fb:''}]}}
}
