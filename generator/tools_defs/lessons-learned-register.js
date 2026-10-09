{
slug:'lessons-learned-register',
sections:[
 {type:'fields',title:'Project close-out summary',cols:3,fields:[
  {id:'proj',label:'Project',wide:true},
  {id:'spon',label:'Sponsor'},
  {id:'pm',label:'Project manager'},
  {id:'start',label:'Start date',type:'date'},
  {id:'pend',label:'Planned finish',type:'date'},
  {id:'aend',label:'Actual finish',type:'date'},
  {id:'obj',label:'Objective',type:'textarea',rows:2,wide:true},
  {id:'metric',label:'Success measure',ph:'e.g. Trays with a missing or wrong instrument, %'},
  {id:'dir',label:'Better is',type:'select',opts:['Lower','Higher']},
  {id:'base',label:'Baseline',type:'number'},
  {id:'goal',label:'Goal',type:'number'},
  {id:'act',label:'Actual result',type:'number'},
  {id:'bplan',label:'Budget $',type:'number',min:0},
  {id:'bact',label:'Actual cost $',type:'number',min:0}]},
 {type:'grid',id:'l',title:'Lessons learned',rows:3,hint:'One lesson per row. Record what went well as well as what went wrong, the cause, and a recommendation someone can act on. Tacit knowledge lives in people (judgment, know-how, relationships); explicit knowledge can be written down.',cols:[
  {id:'what',label:'What happened',w:200,type:'textarea',rows:2},
  {id:'cat',label:'Category',type:'select',opts:['Scope','Schedule','Cost','Quality','Risk','Communication','Stakeholders','Team','Supplier or vendor','Technical','Process','Training']},
  {id:'imp',label:'Impact',type:'select',opts:['Positive','Negative']},
  {id:'rc',label:'Root cause or reason',w:170,type:'textarea',rows:2},
  {id:'rec',label:'Recommendation',w:190,type:'textarea',rows:2},
  {id:'own',label:'Owner',w:110},
  {id:'act',label:'Action type',type:'select',opts:['Procedure or document update','Template or checklist update','Training','Share only','No action']},
  {id:'where',label:'Where shared or stored',w:140,type:'textarea',rows:1},
  {id:'kt',label:'Knowledge',type:'select',opts:['Explicit','Tacit']}]},
 {type:'grid',id:'k',title:'Knowledge-transfer plan',rows:3,hint:'Who needs to know, and how they will learn it. Give the lesson number from the register above. Tacit knowledge rarely moves through documents; it needs mentoring, job shadowing, a community of practice or storytelling.',cols:[
  {id:'ref',label:'Lesson #',type:'number',min:1},
  {id:'who',label:'Who needs to know',w:170,type:'textarea',rows:1},
  {id:'how',label:'Method',type:'select',opts:['Community of practice','Procedure update','Training','Mentoring or job shadowing','After-action review','Lessons-learned database','Storytelling or lunch-and-learn']},
  {id:'own',label:'Owner',w:110},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Planned','In progress','Done']}]},
 {type:'custom',id:'sum',title:'Close-out review',html:'<div class="stat ll-stat"></div><div class="svgw ll-chart"></div><div class="out ll-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, n=api.num, esc=api.esc, f=[];
 var st=root.querySelector('.ll-stat'), ch=root.querySelector('.ll-chart'), out=root.querySelector('.ll-out');
 var L=S.g.l.map(function(r,i){return {r:r,i:i+1};}).filter(function(x){return (x.r.what||'').trim();});
 var K=S.g.k.filter(function(r){return r.ref||r.who||r.how;});
 /* goal */
 var b=n(F.base), g=n(F.goal), a=n(F.act), lower=F.dir!=='Higher', met=null;
 if(!isNaN(g)&&!isNaN(a)) met=lower?a<=g:a>=g;
 var gtxt='—', gsub='';
 if(met!==null){ gtxt=met?'Met':'Not met'; if(!isNaN(b)&&b!==g){ var pct=(b-a)/(b-g)*100; gsub=pct.toFixed(0)+'% of the planned improvement'; } }
 /* schedule and cost */
 function days(x,y){ var p=new Date(x+'T00:00:00'), q=new Date(y+'T00:00:00'); return (isNaN(p)||isNaN(q))?NaN:Math.round((q-p)/864e5); }
 var slip=days(F.pend,F.aend), dur=days(F.start,F.pend), bp=n(F.bplan), ba=n(F.bact), bv=(!isNaN(bp)&&!isNaN(ba)&&bp>0)?(ba-bp)/bp*100:NaN;
 var pos=L.filter(function(x){return x.r.imp==='Positive';}).length, neg=L.filter(function(x){return x.r.imp==='Negative';}).length;
 st.innerHTML='<div><b>'+esc(gtxt)+'</b><span>Result against goal'+(gsub?'; '+gsub:'')+'</span></div><div><b>'+(isNaN(slip)?'—':slip>0?slip+' days late':slip<0?(-slip)+' days early':'On time')+'</b><span>Schedule</span></div><div><b>'+(isNaN(bv)?'—':(bv>0?'+':'')+bv.toFixed(1)+'%')+'</b><span>Cost against budget</span></div><div><b>'+L.length+'</b><span>Lessons recorded</span></div><div><b>'+pos+' / '+neg+'</b><span>Positive / negative</span></div>';
 if(!L.length){ ch.innerHTML=''; }
 else {
  var cats={}; L.forEach(function(x){ var c=x.r.cat||'Uncategorized'; if(!cats[c]) cats[c]={p:0,n:0,o:0}; if(x.r.imp==='Positive') cats[c].p++; else if(x.r.imp==='Negative') cats[c].n++; else cats[c].o++; });
  var keys=Object.keys(cats).sort(function(a,b){var A=cats[a],B=cats[b];return (B.p+B.n+B.o)-(A.p+A.n+A.o);});
  var mx=Math.max.apply(null,keys.map(function(k){return cats[k].p+cats[k].n+cats[k].o;})), Wd=640, rh=26, Lb=170, top=26, H=top+keys.length*rh+6, u=(Wd-Lb-40)/Math.max(mx,5);
  var s='<svg viewBox="0 0 '+Wd+' '+H+'" role="img" aria-label="Lessons by category"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.t{font-size:11px;fill:#4A5D71}</style><rect x="'+Lb+'" y="5" width="12" height="12" fill="#1F8C55"/><text class="t" x="'+(Lb+18)+'" y="15">Positive</text><rect x="'+(Lb+90)+'" y="5" width="12" height="12" fill="#C0392B"/><text class="t" x="'+(Lb+108)+'" y="15">Negative</text>';
  keys.forEach(function(k,i){ var c=cats[k], y=top+i*rh, x=Lb;
   s+='<text x="'+(Lb-8)+'" y="'+(y+15)+'" text-anchor="end">'+esc(k)+'</text>';
   [[c.p,'#1F8C55'],[c.n,'#C0392B'],[c.o,'#7C8B99']].forEach(function(p){ if(p[0]){ s+='<rect x="'+x+'" y="'+(y+3)+'" width="'+(p[0]*u-2)+'" height="16" fill="'+p[1]+'"/><text x="'+(x+p[0]*u/2-1)+'" y="'+(y+15)+'" text-anchor="middle" style="fill:#fff;font-weight:700">'+p[0]+'</text>'; x+=p[0]*u; } });
  });
  ch.innerHTML=s+'</svg>';
 }
 /* flags */
 if(met===true) f.push(['ok','Goal met. '+esc(F.metric||'Success measure')+': '+esc(F.act)+' against a goal of '+esc(F.goal)+'.']);
 if(met===false) f.push(['warn','Goal not met. '+esc(F.metric||'Success measure')+': '+esc(F.act)+' against a goal of '+esc(F.goal)+(isNaN(b)?'':' and a baseline of '+esc(F.base))+(gsub?', '+gsub:'')+'. Say in the summary whether the remaining gap is handed to an owner or accepted, and by whom.']);
 if(met===null&&(F.proj||L.length)) f.push(['warn','Enter the goal and the actual result so the close-out says whether the project delivered what the charter promised.']);
 if(!isNaN(slip)&&slip>0) f.push(['warn','Finished '+slip+' days after the planned date'+(dur>0?' ('+(slip/dur*100).toFixed(0)+'% of the planned duration)':'')+'. Check that at least one lesson explains the slip.']);
 if(!isNaN(bv)&&bv>5) f.push(['warn','Cost ran '+bv.toFixed(1)+'% over budget. Check that at least one lesson explains the overrun.']);
 if(!L.length){ out.innerHTML=api.flags(f,'Fill in the summary and record the lessons. The checks appear here.'); return; }
 var noRec=L.filter(function(x){return !(x.r.rec||'').trim();}), noOwn=L.filter(function(x){return !(x.r.own||'').trim()&&x.r.act!=='No action';});
 if(noRec.length) f.push(['warn','No recommendation for lesson '+noRec.map(function(x){return x.i;}).join(', ')+'. A lesson without a recommendation is a story; say what the next project should do differently or keep doing.']);
 if(noOwn.length) f.push(['warn','No owner for lesson '+noOwn.map(function(x){return x.i;}).join(', ')+'. Without an owner the recommendation is recorded but not learned.']);
 if(!L.some(function(x){return x.r.act==='Procedure or document update'||x.r.act==='Template or checklist update';})) f.push(['warn','No lesson leads to a procedure, document, template or checklist update. Lessons that change nothing in the system tend to be repeated on the next project.']);
 if(neg&&!pos) f.push(['warn','Only negative lessons. Record what went well too, so the next team repeats it on purpose.']);
 var noImp=L.filter(function(x){return !x.r.imp;}); if(noImp.length) f.push(['warn','No impact marked for lesson '+noImp.map(function(x){return x.i;}).join(', ')+'.']);
 var refs={}; K.forEach(function(k){ var r=Math.round(n(k.ref)); if(!isNaN(r)) refs[r]=(refs[r]||[]).concat(k); });
 var tac=L.filter(function(x){return x.r.kt==='Tacit';}), tacNo=tac.filter(function(x){return !refs[x.i]||!refs[x.i].some(function(k){return k.how;});});
 if(tacNo.length) f.push(['warn','Tacit knowledge with no transfer method: lesson '+tacNo.map(function(x){return x.i;}).join(', ')+'. Know-how that lives in people does not move through a report; plan mentoring, job shadowing or a community of practice.']);
 var docOnly=tac.filter(function(x){return refs[x.i]&&refs[x.i].length&&refs[x.i].every(function(k){return k.how==='Procedure update'||k.how==='Lessons-learned database';});});
 if(docOnly.length) f.push(['','Lesson '+docOnly.map(function(x){return x.i;}).join(', ')+' is tacit but transferred only by document. Writing it down is externalization; the receiving team still has to practice it.']);
 var badRef=K.filter(function(k){var r=Math.round(n(k.ref));return !isNaN(r)&&!L.some(function(x){return x.i===r;});}); if(badRef.length) f.push(['warn','Transfer plan refers to lesson numbers that are not in the register: '+badRef.map(function(k){return esc(k.ref);}).join(', ')+'.']);
 var noWho=K.filter(function(k){return !(k.who||'').trim()||!k.how;}); if(noWho.length) f.push(['warn',noWho.length+' transfer plan row'+(noWho.length>1?'s are':' is')+' missing who needs to know or the method.']);
 var noStore=L.filter(function(x){return !(x.r.where||'').trim();}); if(noStore.length) f.push(['warn','No storage location for lesson '+noStore.map(function(x){return x.i;}).join(', ')+'. If the next project manager cannot find it, it was not captured.']);
 f.push(['','In Nonaka and Takeuchi\'s SECI terms, the register externalizes tacit knowledge (tacit to explicit), the procedure updates combine it with what the organization already has, and mentoring and practice internalize it in the next team.']);
 out.innerHTML=api.flags(f);
},
example:{f:{proj:'Sterile processing department relocation and instrument tray tracking go-live',spon:'Vice president, perioperative services',pm:'Quality and patient safety project manager',start:'2025-09-02',pend:'2026-06-30',aend:'2026-08-14',
 obj:'Move sterile processing to the new lower-level suite without interrupting surgical cases, and implement barcode tracking of every instrument tray from decontamination to the operating room.',
 metric:'Trays reaching the OR with a missing or wrong instrument, %',dir:'Lower',base:'3.1',goal:'1.0',act:'1.4',bplan:'1850000',bact:'1970000'},
 g:{l:[
  {what:'Tray count sheets were rebuilt in the tracking system by technicians who knew the trays, and the OR checked them before go-live.',cat:'Quality',imp:'Positive',rc:'Content owners did the build; surgeons and OR leads reviewed the 40 highest-volume trays.',rec:'Have the people who assemble the work build the master data, with a user review before go-live.',own:'SPD manager',act:'Template or checklist update',where:'Project site; IT go-live checklist',kt:'Explicit'},
  {what:'Washer-disinfector validation took seven weeks longer than planned.',cat:'Schedule',imp:'Negative',rc:'Vendor validation protocol was not reviewed by infection prevention until the equipment was installed.',rec:'Put validation protocol review in the plan before purchase order, with infection prevention and biomedical engineering sign-off.',own:'Director, facilities projects',act:'Procedure or document update',where:'Capital equipment procedure; lessons-learned database',kt:'Explicit'},
  {what:'Senior technicians knew which loaner trays arrive late and which surgeons add instruments, and this was missing from the new workflow.',cat:'Process',imp:'Negative',rc:'Workflow design used written procedures only; experienced staff were scheduled on the floor during design sessions.',rec:'Backfill senior technicians so they can attend design sessions; pair new hires with them for loaner handling.',own:'SPD manager',act:'Training',where:'Team meeting notes',kt:'Tacit'},
  {what:'Daily huddle between SPD and OR charge nurses during the first month caught tray problems within a shift.',cat:'Communication',imp:'Positive',rc:'Short, fixed-time huddle with a visual board of open tray issues.',rec:'Use a daily cross-department huddle for the first 30 days of any go-live.',own:'',act:'Share only',where:'Perioperative leadership meeting',kt:'Tacit'},
  {what:'Construction change orders for ventilation in the decontamination room added $120,000.',cat:'Cost',imp:'Negative',rc:'Air-exchange and pressure requirements were not in the original design brief.',rec:'Include infection prevention requirements (air changes, pressure, humidity) in design briefs for any clinical space.',own:'Director, facilities projects',act:'Template or checklist update',where:'Design brief template',kt:'Explicit'},
  {what:'Staff barcode scanning reached 98% compliance by week three.',cat:'Training',imp:'Positive',rc:'Super-users on every shift and hands-on practice in the new suite before go-live.',rec:'Train super-users per shift and run practice sessions in the real space.',own:'Clinical educator, SPD',act:'Training',where:'Education department; lessons-learned database',kt:'Tacit'}],
  k:[{ref:'2',who:'Facilities project managers, purchasing, infection prevention',how:'Procedure update',own:'Director, facilities projects',due:'2026-10-31',st:'In progress'},
   {ref:'3',who:'New SPD technicians and the evening shift',how:'Mentoring or job shadowing',own:'SPD manager',due:'2026-11-30',st:'Planned'},
   {ref:'5',who:'Facilities, architects on contract',how:'Procedure update',own:'Director, facilities projects',due:'2026-10-31',st:'Planned'},
   {ref:'6',who:'Clinical educators planning other go-lives',how:'Community of practice',own:'Clinical educator, SPD',due:'2026-12-15',st:'Planned'}]}}
}
