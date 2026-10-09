{
slug:'voc-ctq-tree',
sections:[
 {type:'fields',title:'Kind of tree',cols:2,hint:'A <b>CTQ tree</b> turns what customers say into measurable requirements. A <b>generic tree diagram</b> breaks any goal into the means of reaching it, then into tasks someone can do: ask “how?” moving right, “why?” moving left.',fields:[
  {id:'mode',label:'Tree',type:'select',opts:['VOC to CTQ tree','Generic tree diagram (goal → means → tasks)']}]},
 {type:'fields',title:'Whose voice',cols:3,fields:[{id:'cust',label:'Customer or segment',ph:'e.g. Pump OEM, installation team'},{id:'src',label:'Where the voice came from',ph:'e.g. complaints, interviews, surveys'},{id:'date',label:'Date',type:'date'}]},
 {type:'grid',id:'t',title:'From what they said to what you can measure',rows:3,hint:'Work left to right. <b>Voice</b> is their words. <b>Need</b> is what they want, in a few words. <b>Driver</b> is what makes the need met or not. <b>CTQ</b> is a characteristic you can measure, with a target or limit. One row per CTQ; repeat the need on each row it applies to.',cols:[
  {id:'voice',label:'Voice of the customer',w:200,type:'textarea',rows:1},
  {id:'need',label:'Need',w:140,type:'textarea',rows:1},
  {id:'drv',label:'Driver',w:150,type:'textarea',rows:1},
  {id:'ctq',label:'CTQ (measurable)',w:170,type:'textarea',rows:1},
  {id:'tgt',label:'Target or limit',w:130},
  {id:'kano',label:'Kano',type:'select',opts:['Basic (must-be)','Performance','Delighter']}]},
 {type:'custom',id:'tree',title:'Your CTQ tree',html:'<div class="ct-tree"></div><div class="out ct-out"></div>'},
 {type:'grid',id:'gt',title:'From the goal to the tasks',rows:3,hint:'One row per task. Write the goal, then the means that would achieve it, then finer means, then the task. Repeat the goal and means on each row they apply to; leave the deeper columns blank where a branch stops.',cols:[
  {id:'goal',label:'Goal (what)',w:170,type:'textarea',rows:1},
  {id:'l2',label:'Means (how)',w:160,type:'textarea',rows:1},
  {id:'l3',label:'Sub-means (how)',w:160,type:'textarea',rows:1},
  {id:'l4',label:'Task or action',w:180,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:110},
  {id:'when',label:'Due',type:'date'}]},
 {type:'custom',id:'gtree',title:'Your tree diagram',html:'<div class="gt-tree"></div><div class="out gt-out"></div>'}
],
update:function(root,api){
 var gen=/^Generic/.test(api.state().f.mode||''), vis=gen?[0,4,5]:[0,1,2,3], n=0, TL=window.TOOL, md=gen?'g':'v';
 /* switching mode redraws the page; the other mode's sections are emptied and hidden, so their inputs stay out of the way */
 if(TL._mode&&TL._mode!==md){ TL._mode=md; api.rerender(); return; } TL._mode=md;
 root.querySelectorAll('section.tsec').forEach(function(sec,i){ var on=vis.indexOf(i)>=0; if(!on){ sec.innerHTML=''; sec.style.display='none'; } else { var tn=sec.querySelector('.tn'); if(tn) tn.textContent=++n; } });
 if(gen){ window.TOOL.generic(root,api); return; }
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
generic:function(root,api){
 var S=api.state(), E=api.esc, f=[], K=['goal','l2','l3','l4'], rows=S.g.gt.filter(function(r){ return K.some(function(k){return (r[k]||'').trim();}); });
 var top={c:[]}, maxd=0;
 rows.forEach(function(r){ var vals=K.map(function(k){return (r[k]||'').trim();}), last=-1; vals.forEach(function(v,i){ if(v) last=i; });
  var node=top; for(var i=0;i<=last;i++){ var t=vals[i]||'(not stated)', ch=node.c.filter(function(x){return x.t===t;})[0]; if(!ch){ ch={t:t,c:[],d:i,rows:[]}; node.c.push(ch); } node=ch; }
  node.rows.push(r); maxd=Math.max(maxd,last); });
 var lab=['GOAL','MEANS','SUB-MEANS','TASK'];
 function draw(nd,depth){ var rest=maxd-depth, own=nd.rows.filter(function(r){return r.who||r.when;})[0];
  var box='<div class="ct-b gt'+depth+'"><span>'+lab[depth]+'</span>'+E(nd.t)+(own&&!nd.c.length?'<em>'+E(own.who||'')+(own.who&&own.when?' · ':'')+E(own.when||'')+'</em>':'')+'</div>';
  if(!nd.c.length) return '<div class="gt-n" style="grid-template-columns:minmax(0,1fr)'+(rest>0?' minmax(0,'+rest+'fr)':'')+'">'+box+'</div>';
  return '<div class="gt-n" style="grid-template-columns:minmax(0,1fr) minmax(0,'+rest+'fr)">'+box+'<div class="gt-cs">'+nd.c.map(function(c){return draw(c,depth+1);}).join('')+'</div></div>'; }
 root.querySelector('.gt-tree').innerHTML=top.c.map(function(g){return draw(g,0);}).join('');
 if(!rows.length){ root.querySelector('.gt-out').innerHTML=api.flags([],'Add rows and the tree draws itself.'); return; }
 if(top.c.length>1) f.push(['','There are '+top.c.length+' goals. A tree diagram usually serves one goal; consider one tree per goal.']);
 if(top.c.some(function(g){return g.t==='(not stated)';})) f.push(['warn','Some rows have no goal. Every branch should trace back to the goal it serves.']);
 var leaves=[], ones=[]; (function walk(nd){ nd.c.forEach(function(c){ if(!c.c.length) leaves.push(c); else { if(c.c.length===1&&c.d<maxd-1) ones.push(c); walk(c); } }); })(top);
 var shallow=leaves.filter(function(l){return l.d<maxd;});
 if(shallow.length) f.push(['warn',shallow.map(function(l){return '<b>'+E(l.t)+'</b>';}).join(', ')+(shallow.length>1?' stop':' stops')+' before the '+lab[maxd].toLowerCase()+' level the other branches reach. Ask “how?” once more, or say why this branch needs no more detail.']);
 if(ones.length) f.push(['',ones.map(function(o){return '<b>'+E(o.t)+'</b>';}).join(', ')+(ones.length>1?' each have':' has')+' only one branch under it. Either the two levels say the same thing, or other means are missing: ask “how else?”']);
 var noown=leaves.filter(function(l){ return !l.rows.some(function(r){return (r.who||'').trim();}); });
 if(maxd>=1&&noown.length) f.push(['warn',noown.length+' of '+leaves.length+' tasks '+(noown.length>1?'have':'has')+' no owner. A task without a name against it rarely gets done.']);
 else if(maxd>=1) f.push(['ok','Every task at the end of a branch has an owner.']);
 if(top.c[0]&&!/\d/.test(top.c[0].t)) f.push(['','The goal has no number in it. A measurable goal (from what, to what, by when) tells you when the tree has done its job.']);
 f.push(['','Check it both ways: reading right to left, would doing every task under a means achieve that means (“why?”)? Reading left to right, is each step a real answer to “how?”']);
 root.querySelector('.gt-out').innerHTML=api.flags(f);
},
example:{f:{cust:'Pump OEM, installation team',src:'Complaints, two site visits, warranty data',date:'2026-07-08'},
 g:{t:[{voice:'"Your pumps leak the day we fit them."',need:'Pump does not leak',drv:'Seal integrity at installation',ctq:'Leak rate at 2.5 bar, 30 s hold',tgt:'0 detectable leaks',kano:'Basic (must-be)'},
  {voice:'"Your pumps leak the day we fit them."',need:'Pump does not leak',drv:'Cover clamping force',ctq:'Cover bolt torque',tgt:'12 ± 1 N·m',kano:'Basic (must-be)'},
  {voice:'"We wait on you every time the line restarts."',need:'Pumps arrive when promised',drv:'Delivery reliability',ctq:'On-time delivery to promised date',tgt:'≥ 98% per month',kano:'Performance'},
  {voice:'"It would help if the label told us the build date."',need:'Easy traceability on site',drv:'Label content',ctq:'Build date and line on the label',tgt:'100% of units',kano:'Delighter'}],
 gt:[{goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Stop seal damage at installation',l3:'Lower the installation force',l4:'Fit a tapered lead-in sleeve to press P-3',who:'Tooling engineer',when:'2026-09-15'},
  {goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Stop seal damage at installation',l3:'Lower the installation force',l4:'Specify O-ring lubricant and amount in the work instruction',who:'Process engineer',when:'2026-09-08'},
  {goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Stop seal damage at installation',l3:'Remove sharp edges the seal passes',l4:'Add a 0.3 mm chamfer to the cross-drilled port',who:'Design engineer',when:'2026-10-01'},
  {goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Catch damaged seals before final test',l3:'Inspect the seal after fitting',l4:'Add a mirror check at station 3-4 to the control plan',who:'Quality engineer',when:'2026-09-10'},
  {goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Catch damaged seals before final test',l3:'Inspect the seal after fitting',l4:'Train both shifts on the new check',who:'',when:'2026-09-20'},
  {goal:'Cut leak-test failures on line 3 from 4.1% to under 1% by December',l2:'Keep O-ring lots within specification',l3:'Verify incoming O-ring dimensions',l4:'Add cross-section to the receiving inspection plan',who:'Supplier quality',when:'2026-09-30'}]}}
}
