{
slug:'out-of-control-action-plan',
TY:['Check (yes/no question)','Action','Escalate','End: resume production'],
model:function(S){
 var N={}, ids=[], err=[];
 S.g.st.forEach(function(r){ var id=(r.id||'').trim(); if(!id){ if(r.t) err.push(['warn','A step with no ID: "'+String(r.t).slice(0,40)+'".']); return; } if(N[id]){ err.push(['warn','Step ID '+id+' is used twice.']); return; }
  var ty=r.ty||'Action', chk=/^Check/.test(ty), end=/^End/.test(ty), esc=ty==='Escalate';
  N[id]={id:id,r:r,chk:chk,end:end,esc:esc,yes:(r.y||'').trim(),no:(r.n||'').trim()}; ids.push(id); });
 var sig=S.g.sg.map(function(r,i){ return {id:(r.id||'').trim()||('S'+(i+1)),r:r,start:(r.start||'').trim()}; }).filter(function(x){ return x.r.rule||x.r.det||x.r.id; });
 return {N:N,ids:ids,sig:sig,err:err};
},
sections:[
 {type:'fields',title:'Process and chart',cols:3,hint:'One OCAP per control chart. It tells the operator exactly what to do when the chart signals, in what order, and when to call for help, so the reaction is the same on every shift.',fields:[
  {id:'proc',label:'Process and characteristic',wide:true,ph:'e.g. CNC lathe 7, shaft OD 25.00 mm'},
  {id:'chart',label:'Chart',type:'select',opts:['X-bar and R','X-bar and s','Individuals and moving range','p','np','c','u','Other']},
  {id:'lim',label:'Control limits in use',ph:'e.g. UCL 25.030, CL 25.004, LCL 24.978'},
  {id:'spec',label:'Specification',ph:'e.g. 25.00 ± 0.05'},
  {id:'own',label:'OCAP owner'},
  {id:'rev',label:'Revision and date'},
  {id:'appr',label:'Approved by'}]},
 {type:'grid',id:'sg',title:'Signals that start the plan (activators)',rows:2,hint:'The chart rules in use for this chart, and the step each one starts at. Most plans send every signal to the same first check.',cols:[
  {id:'id',label:'ID',w:46},
  {id:'rule',label:'Signal',type:'select',opts:['Point beyond a control limit','Run: 8 or more in a row on one side of the center line','Trend: 6 or more in a row steadily rising or falling','2 of 3 points beyond 2 sigma, same side','4 of 5 points beyond 1 sigma, same side','14 points in a row alternating up and down','15 points in a row within 1 sigma (hugging)','Point outside the specification','Other (describe)']},
  {id:'det',label:'Detail',w:200,type:'textarea',rows:1},
  {id:'start',label:'Start at step',w:80}]},
 {type:'grid',id:'st',title:'Checks and actions',rows:4,hint:'Each <b>check</b> is a yes/no question with the step to go to for each answer. Write them so that <b>Yes</b> means "found it" and leads to an action, and <b>No</b> moves on to the next check. List the quick, likely checks first: the measurement, then recent changes, then the 6Ms. An <b>action</b> or <b>escalation</b> uses only "Yes / then".',cols:[
  {id:'id',label:'ID',w:46},
  {id:'ty',label:'Type',type:'select',opts:['Check (yes/no question)','Action','Escalate','End: resume production']},
  {id:'t',label:'Question or action',w:260,type:'textarea',rows:1},
  {id:'y',label:'Yes / then',w:70},
  {id:'n',label:'No',w:70},
  {id:'who',label:'Who',w:110},
  {id:'lim',label:'Time limit',w:90}]},
 {type:'custom',id:'fc',title:'The OCAP flowchart',hint:'Signals at the top, checks down the left, actions to the right. Hover a box for its full text.',html:'<div class="svgw oc-svg"></div>'},
 {type:'grid',id:'lg',title:'Event log',rows:3,hint:'One row each time the plan is used: what signaled, where the cause was found, what was done and how much product was suspect. Repeats in the log are the input to corrective action.',cols:[
  {id:'d',label:'Date',type:'date'},
  {id:'sig',label:'Signal',w:60},
  {id:'val',label:'Value or point',w:110},
  {id:'step',label:'Found at step',w:70},
  {id:'cause',label:'Cause found',w:180,type:'textarea',rows:1},
  {id:'act',label:'Action taken',w:180,type:'textarea',rows:1},
  {id:'q',label:'Suspect qty',type:'number',min:0},
  {id:'who',label:'By',w:90},
  {id:'cl',label:'Status',type:'select',opts:['Open','Closed']}]},
 {type:'custom',id:'res',title:'Checks on the plan and the log',html:'<div class="stat oc-stat"></div><div class="svgw oc-log"></div><div class="out oc-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), esc=api.esc, n=api.num, M=T.model(S), N=M.N, f=M.err.map(function(x){ return [x[0],esc(x[1])]; });
 function wrap(s,max,lines){ var w=String(s||'').split(/\s+/).filter(Boolean), L=[], c=''; w.forEach(function(x){ if((c+' '+x).trim().length>max&&c){ L.push(c); c=x; } else c=(c+' '+x).trim(); }); if(c) L.push(c); if(L.length>lines){ L=L.slice(0,lines); L[lines-1]=L[lines-1].slice(0,max-1)+'…'; } return L; }
 /* references */
 M.ids.forEach(function(id){ var e=N[id];
  [['yes',e.yes],['no',e.no]].forEach(function(p){ if(p[1]&&!N[p[1]]) f.push(['warn','Step <b>'+esc(id)+'</b> goes to "'+esc(p[1])+'", which is not a step ID.']); });
  if(e.chk&&(!e.yes||!e.no)) f.push(['warn','Check <b>'+esc(id)+'</b> needs a step for both Yes and No.']);
  if(!e.chk&&e.no) f.push(['','<b>'+esc(id)+'</b> is not a check, so its "No" is ignored.']);
  if(!e.chk&&!e.end&&!e.esc&&!e.yes) f.push(['warn','Action <b>'+esc(id)+'</b> does not say what happens next. Every path should end at "resume production" or an escalation.']); });
 M.sig.forEach(function(s){ if(!s.r.rule) f.push(['warn','Signal <b>'+esc(s.id)+'</b> has no rule chosen.']); if(!s.start) f.push(['warn','Signal <b>'+esc(s.id)+'</b> does not say which step it starts at.']); else if(!N[s.start]) f.push(['warn','Signal <b>'+esc(s.id)+'</b> starts at "'+esc(s.start)+'", which is not a step ID.']); });
 function nx(e){ var a=[]; if(e.yes&&N[e.yes]) a.push(e.yes); if(e.chk&&e.no&&N[e.no]) a.push(e.no); return a; }
 var reach={}, q=M.sig.map(function(s){ return s.start; }).filter(function(x){ return N[x]; }); while(q.length){ var x=q.shift(); if(reach[x]) continue; reach[x]=1; nx(N[x]).forEach(function(y){ q.push(y); }); }
 var unr=M.ids.filter(function(id){ return !reach[id]; }); if(M.sig.length&&unr.length) f.push(['warn','No signal leads to: '+unr.map(function(x){ return '<b>'+esc(x)+'</b>'; }).join(', ')+'.']);
 /* which steps can reach an end or an escalation */
 var ok={}, ch=true; M.ids.forEach(function(id){ if(N[id].end||(N[id].esc&&!N[id].yes)) ok[id]=1; });
 while(ch){ ch=false; M.ids.forEach(function(id){ if(!ok[id]&&nx(N[id]).some(function(y){ return ok[y]; })){ ok[id]=1; ch=true; } }); }
 var stuck=M.ids.filter(function(id){ return reach[id]&&!ok[id]; }); if(stuck.length) f.push(['warn','From '+stuck.map(function(x){ return '<b>'+esc(x)+'</b>'; }).join(', ')+' no path reaches "resume production" or an escalation. The operator could go round in a loop.']);
 var chks=M.ids.filter(function(id){ return N[id].chk; }), all=M.ids.map(function(id){ return N[id]; });
 if(M.ids.length&&!all.some(function(e){ return e.esc; })) f.push(['warn','There is no escalation step. When the checks find nothing, the operator needs to know who to call and whether the process stays stopped.']);
 if(M.ids.length&&!all.some(function(e){ return /contain|quarantine|hold|segregat|suspect|since the last/i.test(e.r.t||''); })) f.push(['warn','No step deals with the product made since the last good point. An OCAP must say what happens to suspect product: hold it, check it, release or reject it.']);
 if(chks.length&&!chks.some(function(id){ return /measur|gauge|gage|data|plot|calculat|record/i.test(N[id].r.t||''); })) f.push(['','No check covers the measurement itself. Many signals are a gauge, data-entry or plotting error; checking that first is quick and avoids adjusting a stable process.']);
 var noWho=all.filter(function(e){ return !e.end&&!e.r.who; }); if(noWho.length) f.push(['','No one named for: '+noWho.map(function(e){ return esc(e.id); }).join(', ')+'.']);
 if(chks.length>8) f.push(['','There are '+chks.length+' checks in a row. Long chains are skipped in practice; put the most likely causes first and escalate sooner.']);
 /* layout */
 var pos={}, rowsUsed=0, occ={}, ends=all.filter(function(e){ return e.end; });
 function free(c,r){ while(occ[c+','+r]) r++; return r; }
 function put(id,c,r){ pos[id]={c:c,r:r}; occ[c+','+r]=1; if(r+1>rowsUsed) rowsUsed=r+1; }
 function branch(id,r){ var c=1; while(id&&N[id]&&!pos[id]&&!N[id].end&&!N[id].chk){ put(id,c,free(c,r)); id=N[id].yes; c++; if(c>3) break; } }
 function spine(id){ while(id&&N[id]&&!pos[id]&&!N[id].end){ var e=N[id], r=rowsUsed; put(id,0,r); if(e.chk){ branch(e.yes,r); id=e.no; } else id=e.yes; } }
 M.sig.forEach(function(s){ spine(s.start); });
 M.ids.forEach(function(id){ if(!pos[id]&&!N[id].end) spine(id); });
 var er=rowsUsed; ends.forEach(function(e,i){ pos[e.id]={c:i,r:er}; }); if(ends.length) rowsUsed=er+1;
 var maxC=0; Object.keys(pos).forEach(function(k){ if(pos[k].c>maxC) maxC=pos[k].c; });
 var CW=230, BW=184, BH=70, RH=112, TOP=M.sig.length?92:20, LM=20, W=Math.max(LM*2+(maxC+1)*CW,640), H=TOP+rowsUsed*RH+10;
 function cx(id){ return LM+pos[id].c*CW+BW/2; } function ty(id){ return TOP+pos[id].r*RH; }
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="OCAP flowchart"><defs><marker id="oca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4A5D71"/></marker></defs><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.i{font:700 9.5px \'IBM Plex Mono\',monospace;fill:#0F3E68}.yn{font:800 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.w{font:700 10px Archivo,sans-serif;fill:#fff}</style>';
 var edges='', boxes='';
 if(M.sig.length){ var sw=Math.min(170,(W-LM*2)/M.sig.length-10); M.sig.forEach(function(s,i){ var x=LM+i*(sw+10), y=8;
  boxes+='<g><title>'+esc(s.r.rule||'')+(s.r.det?' — '+esc(s.r.det):'')+'</title><rect x="'+x+'" y="'+y+'" width="'+sw+'" height="44" rx="6" fill="#0F3E68"/>'+wrap((s.id+': '+(s.r.rule||'')).replace(/\s*\(.*\)$/,''),Math.floor(sw/6.2),2).map(function(l,j){ return '<text class="w" x="'+(x+8)+'" y="'+(y+18+j*13)+'">'+esc(l)+'</text>'; }).join('')+'</g>';
  if(pos[s.start]) edges+='<path d="M'+(x+sw/2)+' '+(y+44)+' V'+(TOP-14-i*3)+' H'+cx(s.start)+' V'+(ty(s.start)-1)+'" fill="none" stroke="#0F3E68" stroke-width="1.3" marker-end="url(#oca)"/>'; }); }
 function edge(a,b,lab){ if(!pos[a]||!pos[b]) return; var A=pos[a], B=pos[b], ax=cx(a), ay=ty(a), bx=cx(b), by=ty(b), p;
  if(A.r===B.r&&B.c>A.c) p='M'+(ax+BW/2)+' '+(ay+BH/2)+' H'+(bx-BW/2-1);
  else if(A.c===B.c&&B.r>A.r) p='M'+ax+' '+(ay+BH)+' V'+(by-1);
  else if(B.r>A.r){ var gx=LM+A.c*CW+BW+14+(A.c===B.c?0:6); p='M'+(ax+BW/2)+' '+(ay+BH/2)+' H'+gx+' V'+(by-16)+' H'+(bx+(B.c===A.c?0:20))+' V'+(by-1); }
  else { var gx2=LM+A.c*CW+BW+18, yy=by-12; p='M'+(ax+BW/2)+' '+(ay+BH/2+6)+' H'+gx2+' V'+yy+' H'+(bx+30)+' V'+(by-1); }
  edges+='<path d="'+p+'" fill="none" stroke="#4A5D71" stroke-width="1.3" marker-end="url(#oca)"/>';
  if(lab){ var lx=A.r===B.r&&B.c>A.c?ax+BW/2+6:A.c===B.c&&B.r>A.r?ax+6:ax+BW/2+6, ly=A.r===B.r&&B.c>A.c?ay+BH/2-5:A.c===B.c&&B.r>A.r?ay+BH+12:ay+BH/2-5; edges+='<text class="yn" x="'+lx+'" y="'+ly+'">'+lab+'</text>'; } }
 M.ids.forEach(function(id){ var e=N[id]; if(e.chk){ edge(id,e.yes,'YES'); edge(id,e.no,'NO'); } else if(e.yes) edge(id,e.yes,''); });
 Object.keys(pos).forEach(function(id){ var e=N[id], x=cx(id), y=ty(id), t=e.r.t||'', ln, sh;
  if(e.chk){ sh='<path d="M'+(x-BW/2)+' '+(y+BH/2)+' L'+x+' '+y+' L'+(x+BW/2)+' '+(y+BH/2)+' L'+x+' '+(y+BH)+' Z" fill="#FBF3DC" stroke="#9C7C1F" stroke-width="1.4"/>'; ln=wrap(t,18,3); }
  else if(e.end){ sh='<rect x="'+(x-BW/2)+'" y="'+y+'" width="'+BW+'" height="'+BH+'" rx="'+(BH/2)+'" fill="#E3F1E8" stroke="#2E7D4F" stroke-width="1.4"/>'; ln=wrap(t,28,3); }
  else if(e.esc){ sh='<rect x="'+(x-BW/2)+'" y="'+y+'" width="'+BW+'" height="'+BH+'" fill="#FDECEA" stroke="#C0392B" stroke-width="2"/>'; ln=wrap(t,30,3); }
  else { sh='<rect x="'+(x-BW/2)+'" y="'+y+'" width="'+BW+'" height="'+BH+'" fill="#fff" stroke="#0F3E68" stroke-width="1.4"/>'; ln=wrap(t,30,3); }
  var y0=y+BH/2-(ln.length-1)*6.5+3.5;
  boxes+='<g><title>'+esc(id+': '+t+(e.r.who?' ('+e.r.who+(e.r.lim?', '+e.r.lim:'')+')':''))+'</title>'+sh+ln.map(function(l,j){ return '<text x="'+x+'" y="'+(y0+j*13)+'" text-anchor="middle">'+esc(l)+'</text>'; }).join('')+'<text class="i" x="'+(x-BW/2)+'" y="'+(y-3)+'">'+esc(id)+'</text>'+(e.r.who?'<text class="yn" x="'+(x+BW/2)+'" y="'+(y-3)+'" text-anchor="end">'+esc(String(e.r.who).toUpperCase().slice(0,22))+'</text>':'')+'</g>'; });
 root.querySelector('.oc-svg').innerHTML=Object.keys(pos).length?g+edges+boxes+'</svg>':'';
 /* log */
 var lg=S.g.lg.filter(function(r){ return r.d||r.sig||r.cause; }), bySig={}, byStep={}, qt=0, open=0;
 lg.forEach(function(r){ var s=(r.sig||'?').trim(), st=(r.step||'').trim(); bySig[s]=(bySig[s]||0)+1; if(st) byStep[st]=(byStep[st]||0)+1; var v=n(r.q); if(isFinite(v)) qt+=v; if(r.cl!=='Closed') open++; });
 var topStep=Object.keys(byStep).sort(function(a,b){ return byStep[b]-byStep[a]; })[0];
 root.querySelector('.oc-stat').innerHTML='<div><b>'+M.sig.length+'</b><span>Signals</span></div><div><b>'+chks.length+'</b><span>Checks</span></div><div><b>'+all.filter(function(e){ return !e.chk&&!e.end; }).length+'</b><span>Actions and escalations</span></div><div><b>'+lg.length+'</b><span>Events logged</span></div><div><b>'+open+'</b><span>Events open</span></div><div><b>'+api.fmt(qt,0)+'</b><span>Suspect units</span></div>';
 var keys=Object.keys(byStep).sort(function(a,b){ return byStep[b]-byStep[a]; });
 if(keys.length){ var L=210, BWd=360, RHd=24, Hd=26+keys.length*RHd, Wd=L+BWd+60, mx=byStep[keys[0]];
  var h='<svg viewBox="0 0 '+Wd+' '+Hd+'" role="img" aria-label="Events by the step where the cause was found"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style><text class="ax" x="'+L+'" y="12">EVENTS BY WHERE THE CAUSE WAS FOUND</text>';
  keys.forEach(function(k,i){ var y=18+i*RHd, lab=k+(N[k]?': '+(N[k].r.t||''):''); h+='<text x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+esc(lab.length>34?lab.slice(0,33)+'…':lab)+'</text><rect x="'+L+'" y="'+(y+3)+'" width="'+(BWd*byStep[k]/mx)+'" height="'+(RHd-8)+'" fill="'+(byStep[k]>=3?'#C0392B':'#0F3E68')+'"/><text class="ax" x="'+(L+BWd*byStep[k]/mx+6)+'" y="'+(y+14)+'">'+byStep[k]+'</text>'; });
  root.querySelector('.oc-log').innerHTML=h+'</svg>'; } else root.querySelector('.oc-log').innerHTML='';
 var sigIds=M.sig.map(function(s){ return s.id; });
 lg.forEach(function(r,i){ var id='Log row '+(i+1);
  if(r.sig&&sigIds.length&&sigIds.indexOf(r.sig.trim())<0) f.push(['warn',id+': signal "'+esc(r.sig)+'" is not one of the signals above.']);
  if(r.step&&!N[r.step.trim()]) f.push(['warn',id+': step "'+esc(r.step)+'" is not a step in the plan.']);
  if(!r.act) f.push(['warn',id+' has no action recorded.']);
  if(r.cl!=='Closed'&&r.d&&r.d<api.today()) f.push(['',id+' ('+esc(r.d)+') is still open.']); });
 keys.forEach(function(k){ if(byStep[k]>=3) f.push(['warn','The cause at <b>'+esc(k)+'</b>'+(N[k]?' ('+esc((N[k].r.t||'').slice(0,60))+')':'')+' was found '+byStep[k]+' times. The OCAP reacts each time; a cause that keeps coming back needs a corrective action that stops it, such as a tool-life limit or a preventive maintenance task.']); });
 var unk=lg.filter(function(r){ var s=(r.step||'').trim(); return s&&N[s]&&N[s].esc; }).length; if(unk) f.push(['',unk+' event'+(unk===1?' was':'s were')+' escalated with no cause found by the checks. If that happens often, the plan is missing a check.']);
 if(M.ids.length&&!f.some(function(x){ return x[0]==='warn'; })) f.unshift(['ok','Every signal leads to a check, every check has both answers, and every path ends at "resume production" or an escalation.']);
 root.querySelector('.oc-out').innerHTML=api.flags(f,'Add the signals and the steps, and the flowchart and checks appear here.');
},
example:{f:{proc:'CNC lathe 7, shaft outside diameter 25.00 mm',chart:'X-bar and R',lim:'X-bar: UCL 25.030, CL 25.004, LCL 24.978. R: UCL 0.048',spec:'25.00 ± 0.05 mm',own:'Process engineer, turning',rev:'Rev B, 1 Sep 2026',appr:'Production supervisor; quality engineer'},
 g:{sg:[{id:'S1',rule:'Point beyond a control limit',det:'On either chart',start:'C1'},{id:'S2',rule:'Run: 8 or more in a row on one side of the center line',det:'X-bar chart',start:'C1'},{id:'S3',rule:'Trend: 6 or more in a row steadily rising or falling',det:'X-bar chart',start:'C1'}],
  st:[{id:'C1',ty:'Check (yes/no question)',t:'Was the point measured, recorded or plotted wrong? Re-measure the subgroup on a gauge checked against its master.',y:'A1',n:'A0',who:'Operator',lim:'10 min'},
   {id:'A1',ty:'Action',t:'Correct the data and re-plot. If the corrected point is in control, resume.',y:'E1',n:'',who:'Operator',lim:''},
   {id:'A0',ty:'Action',t:'Stop the machine. Hold all parts made since the last in-control subgroup and tag them suspect.',y:'C2',n:'',who:'Operator',lim:'Immediately'},
   {id:'C2',ty:'Check (yes/no question)',t:'Is the cutting insert worn or chipped?',y:'A2',n:'C3',who:'Operator',lim:'10 min'},
   {id:'A2',ty:'Action',t:'Replace the insert, re-set the offset from the setup sheet, measure 5 parts.',y:'E1',n:'',who:'Operator',lim:'20 min'},
   {id:'C3',ty:'Check (yes/no question)',t:'Is the bar stock from a new heat or lot since the last good subgroup?',y:'A3',n:'C4',who:'Operator',lim:'10 min'},
   {id:'A3',ty:'Action',t:'Check the material certificate, tell the quality engineer, measure 5 parts.',y:'E1',n:'',who:'Lead',lim:'30 min'},
   {id:'C4',ty:'Check (yes/no question)',t:'Is coolant concentration or temperature outside its range?',y:'A4',n:'X1',who:'Operator',lim:'10 min'},
   {id:'A4',ty:'Action',t:'Correct the coolant, let the machine stabilize 15 min, measure 5 parts.',y:'E1',n:'',who:'Lead',lim:'30 min'},
   {id:'X1',ty:'Escalate',t:'No cause found. Call the process engineer. The machine stays stopped.',y:'',n:'',who:'Supervisor',lim:'Within 1 hour'},
   {id:'E1',ty:'End: resume production',t:'Resume. 100% check the held parts; record the event in the log.',y:'',n:'',who:'Operator',lim:''}],
  lg:[{d:'2026-09-02',sig:'S1',val:'X-bar 25.036',step:'C2',cause:'Insert chipped',act:'Insert replaced, offset reset',q:'40',who:'R. Lindqvist',cl:'Closed'},
   {d:'2026-09-09',sig:'S2',val:'8 above CL',step:'C1',cause:'Wrong gauge used on second shift',act:'Re-measured on the correct gauge; in control',q:'0',who:'T. Nakamura',cl:'Closed'},
   {d:'2026-09-17',sig:'S1',val:'R 0.051',step:'C2',cause:'Insert worn',act:'Insert replaced',q:'35',who:'R. Lindqvist',cl:'Closed'},
   {d:'2026-09-29',sig:'S3',val:'6 rising',step:'C4',cause:'Coolant concentration 3% (range 5-7%)',act:'Coolant topped up and checked',q:'60',who:'A. Moreau',cl:'Closed'},
   {d:'2026-10-06',sig:'S1',val:'X-bar 24.975',step:'C2',cause:'Insert chipped',act:'Insert replaced; held parts being checked',q:'25',who:'T. Nakamura',cl:'Open'}]}}
}
