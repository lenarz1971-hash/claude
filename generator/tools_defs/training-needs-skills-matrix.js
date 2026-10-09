{
slug:'training-needs-skills-matrix',
sections:[
 {type:'fields',title:'Scope of the analysis',cols:3,fields:[
  {id:'area',label:'Team or area',wide:true,ph:'e.g. Packaging lines 1 and 2, all shifts'},
  {id:'lvl',label:'Analysis level',type:'select',opts:['Organizational','Task or job','Individual','All three']},
  {id:'min',label:'Minimum qualified per skill',type:'number',min:1,ph:'2',hint:'Your cross-training target. Fewer than this is a coverage risk.'},
  {id:'date',label:'Date assessed',type:'date'},
  {id:'why',label:'What triggered this analysis',type:'textarea',wide:true,rows:2}]},
 {type:'grid',id:'k',title:'Skills and required levels',rows:4,hint:'Required level on the 0 to 4 scale below. List the roles that need the skill, separated by commas; leave blank if every role needs it. <b>Source</b> records where the need came from, which is the evidence an auditor will ask for.',cols:[
  {id:'n',label:'Skill',w:190,type:'textarea',rows:1},
  {id:'req',label:'Required 0-4',type:'number',min:0,max:4},
  {id:'roles',label:'Required for roles',w:150,type:'textarea',rows:1,tip:'Blank = every role'},
  {id:'crit',label:'Critical',type:'select',opts:['Yes','No'],tip:'Safety, product, regulatory or customer critical'},
  {id:'src',label:'Source of need',type:'select',opts:['Survey','Performance review','Regulation or customer','Audit finding','New process or equipment','Strategy or growth']}]},
 {type:'grid',id:'p',title:'People',rows:4,hint:'Role must match the role names used in the skills table for role-specific requirements to apply.',cols:[
  {id:'n',label:'Name',w:170},{id:'role',label:'Role',w:140},{id:'note',label:'Notes',w:220,type:'textarea',rows:1}]},
 {type:'custom',id:'mx',title:'Skills matrix: current proficiency 0 to 4',hint:'<b>0</b> no knowledge &middot; <b>1</b> aware, in training &middot; <b>2</b> can do it with supervision &middot; <b>3</b> fully proficient on their own &middot; <b>4</b> can train and assess others. Cells are shaded against the required level.',html:'<div class="tgw"><table class="mv sm"></table></div><div class="sm-key"><span class="h-ok">Meets requirement</span><span class="h-1">1 level short</span><span class="h-2">2 or more short</span><span class="h-na">Not required for this role</span><span class="h-miss">Not scored</span></div>'},
 {type:'custom',id:'res',title:'Coverage and training priorities',hint:'Ordered by coverage risk first (nobody qualified, then one person, then below your minimum), then critical skills, then total gap points.',html:'<div class="tgw"><table class="mv sm-pri"></table></div><div class="out sm-out"></div>'}
],
blankX:function(){return {s:{}};},
update:function(root,api){
 var S=api.state(), n=api.num, esc=api.esc, s=S.x.s||(S.x.s={});
 var K=S.g.k.filter(function(r){return r.n&&r.n.trim();}), P=S.g.p.filter(function(r){return r.n&&r.n.trim();});
 var mn=Math.round(n(S.f.min)); if(isNaN(mn)||mn<1) mn=2;
 var tb=root.querySelector('table.sm'), pri=root.querySelector('table.sm-pri'), out=root.querySelector('.sm-out');
 function applies(k,p){ var rl=(k.roles||'').split(',').map(function(x){return x.trim().toLowerCase();}).filter(Boolean); return !rl.length||rl.indexOf((p.role||'').trim().toLowerCase())>=0; }
 function key(p,k){ return p.n.trim()+'|'+k.n.trim(); }
 if(!K.length||!P.length){ tb.innerHTML='<tbody><tr><td class="mo">Add at least one named skill and one person, then score each person here.</td></tr></tbody>'; tb.dataset.sig=''; pri.innerHTML=''; out.innerHTML=api.flags([],'Add skills and people, then score each person 0 to 4.'); return; }
 var sig=JSON.stringify([P.map(function(p){return p.n.trim();}),K.map(function(k){return k.n.trim();})]);
 if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>Person</th>'+K.map(function(k){return '<th>'+esc(k.n)+'</th>';}).join('')+'<th>Gap points</th></tr><tr class="rq"><th>Required</th>'+K.map(function(k,j){return '<th data-rq="'+j+'"></th>';}).join('')+'<th></th></tr></thead><tbody>'+
   P.map(function(p,i){ return '<tr><td class="mo">'+esc(p.n)+'<small>'+esc(p.role||'')+'</small></td>'+K.map(function(k,j){ var kk=key(p,k); return '<td data-cell="'+i+'-'+j+'"><input type="number" min="0" max="4" step="1" data-sm="'+esc(kk)+'" value="'+(s[kk]!=null?s[kk]:'')+'" aria-label="'+esc(p.n)+', '+esc(k.n)+'"></td>'; }).join('')+'<td class="mt" data-gp="'+i+'"></td></tr>'; }).join('')+
   '</tbody><tfoot><tr><td>Qualified in required roles</td>'+K.map(function(k,j){return '<td data-cv="'+j+'"></td>';}).join('')+'<td></td></tr></tfoot>';
  tb.querySelectorAll('input[data-sm]').forEach(function(inp){ inp.oninput=function(){ var x=n(inp.value); if(isNaN(x)) delete s[inp.dataset.sm]; else s[inp.dataset.sm]=x; api.save(); }; });
 }
 var st=K.map(function(k){ var r=n(k.req); return {k:k,r:r,q:0,qn:[],need:0,below:0,gap:0,miss:0}; });
 var pp=P.map(function(p){ return {p:p,gap:0,cnt:0}; }), bad=0, met=0, tot=0, missAll=0;
 P.forEach(function(p,i){ K.forEach(function(k,j){
  var x=st[j], r=x.r, v=s[key(p,k)], c=v==null||v===''?NaN:+v, td=tb.querySelector('[data-cell="'+i+'-'+j+'"]'), cls='h-na';
  if(!isNaN(c)&&(c<0||c>4||Math.round(c)!==c)) bad++;
  if(!isNaN(r)&&r>0&&!isNaN(c)&&c>=r&&applies(k,p)){ x.q++; x.qn.push(p.n.trim()); }
  if(!isNaN(r)&&r>0&&applies(k,p)){
   x.need++; tot++;
   if(isNaN(c)){ x.miss++; missAll++; cls='h-miss'; }
   else { var g=Math.max(0,r-c); if(g===0){ met++; cls='h-ok'; } else { x.gap+=g; x.below++; pp[i].gap+=g; pp[i].cnt++; cls=g>=2?'h-2':'h-1'; } }
  }
  if(td) td.className=cls;
 }); });
 st.forEach(function(x,j){
  var h=tb.querySelector('[data-rq="'+j+'"]'); if(h) h.innerHTML=isNaN(x.r)?'—':esc(String(x.r))+(x.k.roles&&x.k.roles.trim()?'<small>'+esc(x.k.roles)+'</small>':'<small>All roles</small>');
  var c=tb.querySelector('[data-cv="'+j+'"]'); if(c){ c.textContent=isNaN(x.r)||x.r<=0?'—':x.q+' of '+x.need; c.className=isNaN(x.r)||x.r<=0?'':(x.q===0?'cv0':x.q===1?'cv1':x.q<mn?'cv2':'cvok'); }
 });
 pp.forEach(function(x,i){ var td=tb.querySelector('[data-gp="'+i+'"]'); if(td) td.textContent=x.gap; });
 var R=st.filter(function(x){return !isNaN(x.r)&&x.r>0&&x.need>0;});
 R.forEach(function(x){ x.tier=x.q===0?0:x.q===1?1:x.q<mn?2:x.gap>0?3:4; });
 R.sort(function(a,b){ return a.tier-b.tier||((a.k.crit==='Yes'?0:1)-(b.k.crit==='Yes'?0:1))||b.gap-a.gap; });
 var act=['Nobody meets the level. Train or hire now; until then, supervise the work.','Single point of failure. Cross-train a second person first.','Below the minimum of '+mn+'. Cross-train to reach it.','Close the individual gaps.','Covered. Maintain and refresh.'];
 pri.innerHTML=R.length?'<thead><tr><th>#</th><th>Skill</th><th>Critical</th><th>Source of need</th><th>Qualified in role</th><th>Below req.</th><th>Gap points</th><th>Action</th></tr></thead><tbody>'+R.map(function(x,i){ return '<tr class="t'+x.tier+'"><td class="mt">'+(i+1)+'</td><td class="mo">'+esc(x.k.n)+'</td><td>'+esc(x.k.crit||'—')+'</td><td>'+esc(x.k.src||'—')+'</td><td class="mt">'+x.q+'</td><td class="mt">'+x.below+(x.miss?' <small>+'+x.miss+' unscored</small>':'')+'</td><td class="mt">'+x.gap+'</td><td class="ac">'+act[x.tier]+'</td></tr>'; }).join('')+'</tbody>':'';
 var f=[];
 if(tot) f.push([met===tot?'ok':'','<b>'+met+' of '+tot+'</b> required person-skill combinations meet the required level ('+Math.round(met/tot*100)+'%).'+(missAll?' '+missAll+' are not scored yet.':'')]);
 if(bad) f.push(['warn',bad+' score'+(bad>1?'s are':' is')+' outside the scale. Use whole numbers 0 to 4.']);
 st.forEach(function(x){ if(isNaN(x.r)) f.push(['warn','<b>'+esc(x.k.n)+'</b> has no required level, so no gap can be calculated.']); else if(x.r<0||x.r>4) f.push(['warn','<b>'+esc(x.k.n)+'</b>: the required level must be 0 to 4.']); });
 R.forEach(function(x){
  if(x.q===0) f.push(['warn','Nobody meets the requirement for <b>'+esc(x.k.n)+'</b> (level '+x.r+'). This is an organizational capability gap, not an individual one.'+(x.k.crit==='Yes'?' It is marked critical: the work needs supervision or outside support until someone qualifies.':'')]);
  else if(x.q===1) f.push(['warn','Single point of failure: only <b>'+esc(x.qn[0])+'</b> is qualified in <b>'+esc(x.k.n)+'</b>.'+(x.k.crit==='Yes'?' A critical skill':' A skill')+' held by one person stops when that person is absent or leaves. Cross-train a backup.']);
  else if(x.q<mn) f.push(['','<b>'+esc(x.k.n)+'</b> has '+x.q+' qualified people, below your minimum of '+mn+'.']);
 });
 var mx=Math.max.apply(null,pp.map(function(x){return x.gap;}).concat([0]));
 if(mx>0){ var top=pp.filter(function(x){return x.gap===mx;}); f.push(['warn','Largest individual gap: <b>'+top.map(function(x){return esc(x.p.n);}).join(', ')+'</b> ('+mx+' gap point'+(mx>1?'s':'')+' across '+top[0].cnt+' skill'+(top[0].cnt>1?'s':'')+'). Build an individual development plan with dates, a trainer and a sign-off.']); }
 var nos=K.filter(function(k){return !k.src;}).length; if(nos) f.push(['',nos+' skill'+(nos>1?'s have':' has')+' no source of need recorded. Record why each requirement exists (regulation, audit finding, new equipment) so the plan can be traced and prioritized.']);
 if(tot&&met<tot) f.push(['','Before booking training, confirm each gap is a skill gap. If the person could do the task correctly when it really mattered, the cause is more likely motivation, feedback, tools, time or the process itself, and training will not fix it.']);
 out.innerHTML=api.flags(f,'Score people against the required levels and the checks appear here.');
},
example:{f:{area:'Brightwater Foods, Plant 2: packaging lines 1 and 2, both shifts',lvl:'All three',min:'2',date:'2026-09-14',why:'Customer audit in June found allergen changeover verification done differently on each shift. A new clean-in-place (CIP) skid was commissioned in July. The food safety plan requires trained monitors at each critical control point, and two experienced operators retired this year.'},
 g:{k:[
  {n:'CIP system operation',req:'3',roles:'Operator, Line lead',crit:'Yes',src:'New process or equipment'},
  {n:'Allergen changeover and verification',req:'3',roles:'',crit:'Yes',src:'Audit finding'},
  {n:'CCP monitoring and records',req:'3',roles:'Line lead, QA technician',crit:'Yes',src:'Regulation or customer'},
  {n:'Metal detector verification',req:'2',roles:'',crit:'Yes',src:'Audit finding'},
  {n:'Filler setup and changeover',req:'3',roles:'Operator, Line lead',crit:'No',src:'Performance review'},
  {n:'Root cause analysis (5 whys)',req:'2',roles:'Line lead, QA technician',crit:'No',src:'Strategy or growth'}],
 p:[
  {n:'Maria Lopez',role:'Line lead',note:'Day shift; trains new operators'},
  {n:'Alicia Grant',role:'Line lead',note:'Night shift'},
  {n:'Tom Becker',role:'QA technician',note:'Only QA technician on days'},
  {n:'Dev Patel',role:'Operator',note:''},
  {n:'Sam Okafor',role:'Operator',note:''},
  {n:'Chris Nguyen',role:'Operator',note:'Moved from line 4 in August'},
  {n:'Jenna Ruiz',role:'Operator',note:'Hired six weeks ago'}]},
 x:{s:{
  'Maria Lopez|CIP system operation':4,'Maria Lopez|Allergen changeover and verification':3,'Maria Lopez|CCP monitoring and records':2,'Maria Lopez|Metal detector verification':3,'Maria Lopez|Filler setup and changeover':4,'Maria Lopez|Root cause analysis (5 whys)':1,
  'Alicia Grant|CIP system operation':3,'Alicia Grant|Allergen changeover and verification':3,'Alicia Grant|CCP monitoring and records':2,'Alicia Grant|Metal detector verification':2,'Alicia Grant|Filler setup and changeover':3,'Alicia Grant|Root cause analysis (5 whys)':1,
  'Tom Becker|CIP system operation':1,'Tom Becker|Allergen changeover and verification':4,'Tom Becker|CCP monitoring and records':3,'Tom Becker|Metal detector verification':3,'Tom Becker|Filler setup and changeover':0,'Tom Becker|Root cause analysis (5 whys)':1,
  'Dev Patel|CIP system operation':3,'Dev Patel|Allergen changeover and verification':2,'Dev Patel|CCP monitoring and records':0,'Dev Patel|Metal detector verification':2,'Dev Patel|Filler setup and changeover':3,'Dev Patel|Root cause analysis (5 whys)':0,
  'Sam Okafor|CIP system operation':2,'Sam Okafor|Allergen changeover and verification':3,'Sam Okafor|CCP monitoring and records':0,'Sam Okafor|Metal detector verification':2,'Sam Okafor|Filler setup and changeover':2,'Sam Okafor|Root cause analysis (5 whys)':0,
  'Chris Nguyen|CIP system operation':3,'Chris Nguyen|Allergen changeover and verification':2,'Chris Nguyen|CCP monitoring and records':0,'Chris Nguyen|Metal detector verification':1,'Chris Nguyen|Filler setup and changeover':3,'Chris Nguyen|Root cause analysis (5 whys)':0,
  'Jenna Ruiz|CIP system operation':1,'Jenna Ruiz|Allergen changeover and verification':1,'Jenna Ruiz|CCP monitoring and records':0,'Jenna Ruiz|Metal detector verification':1,'Jenna Ruiz|Filler setup and changeover':1,'Jenna Ruiz|Root cause analysis (5 whys)':0}}}
}
