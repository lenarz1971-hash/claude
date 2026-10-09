{
slug:'voc-ctq-tree',
sections:[
 {type:'fields',title:'Whose voice',cols:3,fields:[{id:'cust',label:'Customer or segment',ph:'e.g. Pump OEM, installation team'},{id:'src',label:'Where the voice came from',ph:'e.g. complaints, interviews, surveys'},{id:'date',label:'Date',type:'date'}]},
 {type:'grid',id:'t',title:'From what they said to what you can measure',rows:3,hint:'Work left to right. <b>Voice</b> is their words. <b>Need</b> is what they want, in a few words. <b>Driver</b> is what makes the need met or not. <b>CTQ</b> is a characteristic you can measure, with a target or limit. One row per CTQ; repeat the need on each row it applies to.',cols:[
  {id:'voice',label:'Voice of the customer',w:200,type:'textarea',rows:1},
  {id:'need',label:'Need',w:140,type:'textarea',rows:1},
  {id:'drv',label:'Driver',w:150,type:'textarea',rows:1},
  {id:'ctq',label:'CTQ (measurable)',w:170,type:'textarea',rows:1},
  {id:'tgt',label:'Target or limit',w:130},
  {id:'kano',label:'Kano',type:'select',opts:['Basic (must-be)','Performance','Delighter']}]},
 {type:'custom',id:'tree',title:'Your CTQ tree',html:'<div class="ct-tree"></div><div class="out ct-out"></div>'}
],
update:function(root,api){
 var S=api.state(), rows=S.g.t.filter(function(r){return r.voice||r.need||r.ctq;}), f=[];
 var needs=[]; rows.forEach(function(r){ var n=(r.need||'(need not stated)').trim(); var N=needs.filter(function(x){return x.n===n;})[0]; if(!N){N={n:n,d:[]};needs.push(N);} var d=(r.drv||'(driver not stated)').trim(), D=N.d.filter(function(x){return x.d===d;})[0]; if(!D){D={d:d,c:[]};N.d.push(D);} D.c.push(r); });
 root.querySelector('.ct-tree').innerHTML=needs.length?needs.map(function(N){return '<div class="ct-n"><div class="ct-b need"><span>NEED</span>'+api.esc(N.n)+'</div><div class="ct-ds">'+N.d.map(function(D){return '<div class="ct-d"><div class="ct-b drv"><span>DRIVER</span>'+api.esc(D.d)+'</div><div class="ct-cs">'+D.c.map(function(r){return '<div class="ct-b ctq"><span>CTQ'+(r.kano?' &middot; '+api.esc(r.kano.split(' ')[0].toUpperCase()):'')+'</span>'+api.esc(r.ctq||'(no CTQ yet)')+(r.tgt?'<em>'+api.esc(r.tgt)+'</em>':'')+'</div>';}).join('')+'</div></div>';}).join('')+'</div></div>';}).join(''):'';
 rows.forEach(function(r,i){ var nm='Row '+(i+1);
  if(!r.ctq) f.push(['warn',nm+' has no CTQ yet. A need that never becomes a measurable CTQ cannot be checked.']);
  else if(!r.tgt||!/\d/.test(r.tgt)) f.push(['warn','<b>'+api.esc(r.ctq)+'</b> has no numeric target or limit. Without one, nobody can say whether it is met.']);
  if(r.ctq&&/\b(good|better|fast|quick|easy|reliable|quality|nice|clean)\b/i.test(r.ctq)&&!/\d/.test(r.ctq)) f.push(['warn','<b>'+api.esc(r.ctq)+'</b> still sounds like a need rather than a measure. A CTQ names a characteristic and a unit.']);
 });
 var k={}; rows.forEach(function(r){ if(r.kano) k[r.kano]=(k[r.kano]||0)+1; });
 if(rows.length&&!k['Basic (must-be)']) f.push(['','No basic (must-be) needs listed. Customers rarely mention these until they are missing, so they are under-reported in complaints and surveys. Ask about them directly.']);
 if(rows.length&&!f.some(function(x){return x[0]==='warn';})) f.unshift(['ok','Every row ends in a CTQ with a numeric target.']);
 root.querySelector('.ct-out').innerHTML=api.flags(f,'Add rows and the tree draws itself.');
},
example:{f:{cust:'Pump OEM, installation team',src:'Complaints, two site visits, warranty data',date:'2026-07-08'},
 g:{t:[{voice:'"Your pumps leak the day we fit them."',need:'Pump does not leak',drv:'Seal integrity at installation',ctq:'Leak rate at 2.5 bar, 30 s hold',tgt:'0 detectable leaks',kano:'Basic (must-be)'},
  {voice:'"Your pumps leak the day we fit them."',need:'Pump does not leak',drv:'Cover clamping force',ctq:'Cover bolt torque',tgt:'12 ± 1 N·m',kano:'Basic (must-be)'},
  {voice:'"We wait on you every time the line restarts."',need:'Pumps arrive when promised',drv:'Delivery reliability',ctq:'On-time delivery to promised date',tgt:'≥ 98% per month',kano:'Performance'},
  {voice:'"It would help if the label told us the build date."',need:'Easy traceability on site',drv:'Label content',ctq:'Build date and line on the label',tgt:'100% of units',kano:'Delighter'}]}}
}
