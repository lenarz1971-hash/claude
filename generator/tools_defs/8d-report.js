{
slug:'8d-report',
D:['D0 Prepare','D1 Team','D2 Describe','D3 Contain','D4 Root cause','D5 Choose and verify','D6 Implement and validate','D7 Prevent recurrence','D8 Recognize and close'],
sections:[
 {type:'fields',title:'D0 Prepare and respond',cols:4,hint:'Record the symptom and any emergency response taken in the first hours. Enter the customer\'s response deadlines, if they set them; the status chart measures against them.',fields:[
  {id:'num',label:'8D number',ph:'e.g. 8D-26-017'},
  {id:'cust',label:'Customer or source'},
  {id:'part',label:'Part, product or service'},
  {id:'opened',label:'Opened',type:'date'},
  {id:'sym',label:'Symptom as reported',type:'textarea',wide:true},
  {id:'era',label:'Emergency response action (ERA)',type:'textarea',wide:true,hint:'Immediate protection before the team is formed: stop shipment, alert the customer, hold suspect stock.'},
  {id:'dd3',label:'Containment due',type:'date'},
  {id:'dd4',label:'Root cause due',type:'date'},
  {id:'dd8',label:'Closure due',type:'date'},
  {id:'need',label:'Does this need a full 8D?',type:'select',opts:['Yes: cause unknown, or recurring, or customer requires it','No: cause known, fixed by a simple correction']}]},
 {type:'grid',id:'tm',title:'D1 The team',rows:3,hint:'A small cross-functional team with the knowledge, time and authority to solve the problem. The champion owns the resources and signs off at D8; the leader runs the work.',cols:[
  {id:'name',label:'Name',w:150},
  {id:'role',label:'Role',type:'select',opts:['Champion','Team leader','Member','Subject matter expert','Supplier representative','Customer representative','Facilitator']},
  {id:'dept',label:'Function',w:140},
  {id:'skill',label:'Brings to the team',w:220,type:'textarea',rows:1}]},
 {type:'fields',title:'D2 Describe the problem',cols:2,hint:'Quantify it with 5W2H. Describe the effect on the customer, not a suspected cause. For a full problem specification with distinctions and changes, use the <a href="/tools/is-is-not-problem-specification.html">Is / Is Not tool</a>.',fields:[
  {id:'stmt',label:'Problem statement (one sentence)',type:'textarea',wide:true},
  {id:'what',label:'What: object and defect',type:'textarea'},
  {id:'why',label:'Why it is a problem: requirement not met',type:'textarea'},
  {id:'where',label:'Where: seen and made',type:'textarea'},
  {id:'when',label:'When: first seen, since, pattern',type:'textarea'},
  {id:'who',label:'Who found it',type:'textarea'},
  {id:'how',label:'How it was detected',type:'textarea'},
  {id:'many',label:'How many: quantity, rate, trend',type:'textarea'},
  {id:'isnot',label:'Is / is not summary',type:'textarea',hint:'Where the problem could be but is not: other lines, lots, customers, shifts.'},
  {id:'d2',label:'D2 complete',type:'date'}]},
 {type:'grid',id:'ct',title:'D3 Interim containment',rows:2,hint:'Protect the customer until the permanent fix is in. Cover every place suspect product can be. Containment must be <b>verified</b>: show it caught what it was meant to.',cols:[
  {id:'a',label:'Containment action',w:220,type:'textarea',rows:1},
  {id:'loc',label:'Where',type:'select',opts:['Customer stock','In transit','Finished goods','Work in process','Supplier','Service stock','Process (added check)']},
  {id:'chk',label:'Checked',type:'number',min:0},
  {id:'bad',label:'Found bad',type:'number',min:0},
  {id:'pct',label:'% bad',calc:function(r,api){ var c=api.num(r.chk), b=api.num(r.bad); return c>0&&b>=0?api.fmt(100*b/c,2)+'%':''; }},
  {id:'who',label:'Owner',w:100},
  {id:'done',label:'In place',type:'date'},
  {id:'ver',label:'Verified effective?',type:'select',opts:['Yes','No','Not yet']}]},
 {type:'fields',title:'D4 Root cause and escape point',cols:2,hint:'Two causes, both verified: why it <b>occurred</b>, and why it <b>escaped</b>. The escape point is the first place in the process where it should have been caught. Use the <a href="/tools/fishbone-5-whys.html">fishbone and 5 whys</a> to get there.',fields:[
  {id:'rco',label:'Occurrence root cause',type:'textarea'},
  {id:'rcov',label:'How the occurrence cause was verified',type:'textarea',hint:'Turn the problem on and off with the cause.'},
  {id:'esc',label:'Escape point',type:'select',opts:['Design verification','Supplier outgoing inspection','Receiving inspection','In-process check','End-of-line test','Final inspection or audit','Shipping','No control existed']},
  {id:'escp',label:'Escape point: the specific check',ph:'e.g. Leak test station 3, 10 s hold'},
  {id:'rce',label:'Escape root cause: why the check missed it',type:'textarea'},
  {id:'rcev',label:'How the escape cause was verified',type:'textarea'},
  {id:'sys',label:'Systemic cause: why the system allowed it',type:'textarea',wide:true,hint:'Why the FMEA, control plan, design review or procedure did not prevent it. This is what D7 fixes.'},
  {id:'d4',label:'D4 complete',type:'date'}]},
 {type:'grid',id:'pca',title:'D5 and D6 Permanent corrective actions',rows:2,hint:'<b>D5 verify</b>: before full implementation, show the action removes the cause without side effects (a trial, a test). <b>D6 validate</b>: after implementation, show the problem is gone in production.',cols:[
  {id:'a',label:'Permanent corrective action',w:220,type:'textarea',rows:1},
  {id:'for',label:'Addresses',type:'select',opts:['Occurrence','Escape','Systemic']},
  {id:'v',label:'D5 verification (evidence before implementing)',w:200,type:'textarea',rows:1},
  {id:'vd',label:'Verified',type:'date'},
  {id:'who',label:'Owner',w:100},
  {id:'imp',label:'Implemented',type:'date'},
  {id:'val',label:'D6 validation (result in production)',w:200,type:'textarea',rows:1},
  {id:'vald',label:'Validated',type:'date'}]},
 {type:'fields',title:'D6 Remove the containment',cols:2,fields:[
  {id:'crem',label:'Containment removed on',type:'date',hint:'Only after the permanent actions are validated.'},
  {id:'crwhy',label:'Evidence for removing it',type:'textarea'}]},
 {type:'grid',id:'pr',title:'D7 Prevent recurrence',rows:3,hint:'Fix the system that allowed the cause, and read the fix across to similar products, processes and sites.',cols:[
  {id:'it',label:'Item',type:'select',opts:['Process FMEA','Design FMEA','Control plan','Work instruction or procedure','Design standard or checklist','Similar products or processes (read-across)','Other sites','Supplier requirements','Lessons learned']},
  {id:'ref',label:'What was changed, or where',w:240,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:100},
  {id:'done',label:'Done',type:'date'}]},
 {type:'fields',title:'D8 Recognize the team and close',cols:4,fields:[
  {id:'rec',label:'Recognition',type:'textarea',wide:true,hint:'Thank the team for the work and what it achieved, specifically. Share what was learned.'},
  {id:'champ',label:'Champion sign-off',ph:'Name'},
  {id:'d8',label:'Closed',type:'date'},
  {id:'cacc',label:'Customer accepted',type:'date'}]},
 {type:'custom',id:'st',title:'Status of the 8D',html:'<div class="stat d8-stat"></div><div class="svgw d8-svg"></div><div class="out d8-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), F=S.f, n=api.num, f=[], today=api.today();
 function rows(g,k){ return S.g[g].filter(function(r){ return r[k]; }); }
 function maxd(a,k){ var m=''; a.forEach(function(r){ if(r[k]&&r[k]>m) m=r[k]; }); return m; }
 function all(a,k){ return a.length>0&&a.every(function(r){ return r[k]; }); }
 var tm=S.g.tm.filter(function(r){ return r.name; }), ct=rows('ct','a'), pca=rows('pca','a'), pr=S.g.pr.filter(function(r){ return r.it||r.ref; });
 var st=[], dt=[];
 st[0]=F.sym?(F.era||F.need?2:1):0; dt[0]=F.opened||'';
 var hasL=tm.some(function(r){ return r.role==='Team leader'; }), hasC=tm.some(function(r){ return r.role==='Champion'; });
 st[1]=tm.length?(hasL&&hasC&&tm.length>=3?2:1):0; dt[1]='';
 var d2n=['what','why','where','when','who','how','many'].filter(function(k){ return F[k]; }).length;
 st[2]=F.d2&&F.stmt?2:(F.stmt||d2n?1:0); dt[2]=F.d2||'';
 var ctV=ct.length&&ct.every(function(r){ return r.done&&r.ver==='Yes'; });
 st[3]=ctV?2:(ct.length?1:0); dt[3]=ctV?maxd(ct,'done'):'';
 var d4ok=F.rco&&F.rcov&&F.rce&&F.rcev&&F.d4;
 st[4]=d4ok?2:(F.rco||F.rce?1:0); dt[4]=d4ok?F.d4:'';
 st[5]=all(pca,'vd')?2:(pca.length?1:0); dt[5]=st[5]===2?maxd(pca,'vd'):'';
 st[6]=all(pca,'vald')&&all(pca,'imp')?2:(pca.some(function(r){ return r.imp; })?1:0); dt[6]=st[6]===2?maxd(pca,'vald'):'';
 st[7]=all(pr,'done')?2:(pr.length?1:0); dt[7]=st[7]===2?maxd(pr,'done'):'';
 st[8]=F.d8?2:(F.rec||F.champ?1:0); dt[8]=F.d8||'';
 function days(a,b){ if(!a||!b) return NaN; return Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5); }
 var chk=0, bad=0; ct.forEach(function(r){ var c=n(r.chk), b=n(r.bad); if(c>0&&b>=0){ chk+=c; bad+=b; } });
 var open=F.d8?days(F.opened,F.d8):days(F.opened,today), done=st.filter(function(x){ return x===2; }).length;
 root.querySelector('.d8-stat').innerHTML='<div><b>'+done+' of 9</b><span>Disciplines complete</span></div><div><b>'+(isNaN(open)?'—':open)+'</b><span>Days '+(F.d8?'to close':'open')+'</span></div><div><b>'+api.fmt(chk,0)+'</b><span>Checked in containment</span></div><div><b>'+api.fmt(bad,0)+'</b><span>Found bad'+(chk?' ('+api.fmt(100*bad/chk,2)+'%)':'')+'</span></div><div><b>'+tm.length+'</b><span>Team members</span></div>';
 /* timeline: one row per discipline, bar from opening to completion date, due markers */
 var due={3:F.dd3,4:F.dd4,8:F.dd8}, ends=dt.filter(Boolean).concat([F.dd3,F.dd4,F.dd8].filter(Boolean)).concat([today]);
 var span=F.opened?Math.max(1,Math.max.apply(null,ends.map(function(d){ return days(F.opened,d); }).filter(isFinite))):0;
 var L=190, PW=430, RH=26, W=L+PW+120, H=36+9*RH+24, col=['#E3E8EE','#D8B147','#2E7D4F'], lab=['NOT STARTED','IN PROGRESS','COMPLETE'];
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="8D status and timeline"><style>text{font:11.5px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.dd{font:700 9px \'IBM Plex Mono\',monospace;fill:#C0392B}</style>';
 g+='<text class="ax" x="'+L+'" y="14">DAYS FROM OPENING'+(F.opened?'':' (ENTER THE OPENED DATE)')+'</text>';
 if(span){ var step=span<=14?2:span<=40?5:span<=100?10:span<=200?20:50; for(var d=0;d<=span;d+=step){ var x=L+PW*d/span; g+='<line x1="'+x+'" x2="'+x+'" y1="22" y2="'+(28+9*RH)+'" stroke="#E3E8EE"/><text class="ax" x="'+x+'" y="'+(42+9*RH)+'" text-anchor="middle">'+d+'</text>'; } }
 T.D.forEach(function(name,i){ var y=26+i*RH, c=col[st[i]];
  g+='<text x="'+(L-10)+'" y="'+(y+15)+'" text-anchor="end">'+name+'</text>';
  var dd=days(F.opened,dt[i]);
  if(span&&st[i]===2&&isFinite(dd)) g+='<rect x="'+L+'" y="'+(y+5)+'" width="'+Math.max(3,PW*dd/span)+'" height="'+(RH-10)+'" fill="'+c+'"/><text class="ax" x="'+(L+Math.max(3,PW*dd/span)+5)+'" y="'+(y+15)+'">'+dd+' D</text>';
  else g+='<rect x="'+L+'" y="'+(y+5)+'" width="'+(span&&st[i]===1?PW*Math.max(0,days(F.opened,today))/span:14)+'" height="'+(RH-10)+'" fill="'+c+'" '+(st[i]===1?'opacity=".55"':'')+'/><text class="ax" x="'+(L+(span&&st[i]===1?PW*Math.max(0,days(F.opened,today))/span:14)+5)+'" y="'+(y+15)+'">'+lab[st[i]]+'</text>';
  if(due[i]&&span){ var dx=L+PW*days(F.opened,due[i])/span; g+='<line x1="'+dx+'" x2="'+dx+'" y1="'+(y+2)+'" y2="'+(y+RH-2)+'" stroke="#C0392B" stroke-width="2"/><text class="dd" x="'+(dx+3)+'" y="'+(y+4)+'">DUE</text>'; } });
 root.querySelector('.d8-svg').innerHTML=g+'</svg>';
 /* checks */
 if(!F.opened) f.push(['warn','Enter the date the 8D was opened; every duration is measured from it.']);
 if(tm.length){ if(!hasC) f.push(['warn','D1: no champion. Someone with authority over resources has to own the 8D and sign it off.']);
  if(!hasL) f.push(['warn','D1: no team leader.']);
  if(tm.length<3) f.push(['warn','D1: a team of '+tm.length+'. An 8D needs the functions that touch the problem: usually design or process engineering, production, quality, and often the supplier.']);
  if(tm.length>9) f.push(['','D1: '+tm.length+' people is a large team. Four to eight usually works best; others can be consulted as experts.']); }
 else f.push(['warn','D1: no team is listed.']);
 if(d2n<7&&(F.stmt||d2n)) f.push(['warn','D2: '+(7-d2n)+' of the seven 5W2H questions are blank. A vague description sends the team after the wrong cause.']);
 if(F.stmt&&/\b(because|due to|caused by)\b/i.test(F.stmt)) f.push(['warn','D2: the problem statement names a cause ("because", "due to"). Describe the effect; the cause is D4\'s job.']);
 if(!ct.length) f.push(['warn','D3: no containment. Unless the description shows nothing suspect can reach the customer, containment comes first.']);
 else { var nv=ct.filter(function(r){ return r.ver!=='Yes'; }); if(nv.length) f.push(['warn','D3: '+nv.length+' containment action'+(nv.length===1?' is':'s are')+' not verified effective. Containment that is not checked is a hope.']);
  var locs={}; ct.forEach(function(r){ if(r.loc) locs[r.loc]=1; }); var miss=['Customer stock','In transit','Finished goods','Work in process'].filter(function(x){ return !locs[x]; });
  if(miss.length) f.push(['','D3: containment does not mention '+miss.join(', ').toLowerCase()+'. Check suspect product cannot be there.']);
  if(chk) f.push(['','D3: '+api.fmt(bad,0)+' bad out of '+api.fmt(chk,0)+' checked ('+api.fmt(100*bad/chk,2)+'%).']); }
 if(F.rco&&!F.rce) f.push(['warn','D4: an occurrence cause but no escape cause. The 8D must also say why the process let it reach the customer.']);
 if(F.rco&&!F.rcov) f.push(['warn','D4: the occurrence cause is not verified. Until it is turned on and off, it is a theory.']);
 if(F.rce&&!F.rcev) f.push(['warn','D4: the escape cause is not verified.']);
 if(F.rce&&!F.esc) f.push(['warn','D4: name the escape point, the first check that should have caught it.']);
 if(F.esc==='No control existed') f.push(['','D4: there was no check that could have caught it. The escape corrective action is to add one, and D7 should ask why the control plan had none.']);
 if(!F.sys&&(F.rco||F.rce)) f.push(['','D4: no systemic cause yet. Ask why the FMEA, control plan or design review did not prevent this; that is what D7 fixes.']);
 if(pca.length){ var occ=pca.some(function(r){ return r.for==='Occurrence'; }), es=pca.some(function(r){ return r.for==='Escape'; });
  if(!occ) f.push(['warn','D5: no permanent action addresses the occurrence cause.']);
  if(!es) f.push(['warn','D5: no permanent action addresses the escape point.']);
  var weak=/(retrain|re-train|training|remind|counsel|be more careful|awareness)/i, wk=pca.filter(function(r){ return weak.test(r.a); });
  if(wk.length&&wk.length===pca.length) f.push(['warn','D5: every action is training or a reminder. Those fade. Look for an action that changes the process, the tooling or the check (error-proofing).']);
  var nov=pca.filter(function(r){ return r.imp&&!r.vd; }); if(nov.length) f.push(['warn','D5: '+nov.length+' action'+(nov.length===1?' was':'s were')+' implemented without a D5 verification. Prove it works before rolling it out.']);
  var ord=pca.filter(function(r){ return r.vd&&r.imp&&r.imp<r.vd; }); if(ord.length) f.push(['warn','D5: implemented before it was verified ('+ord.map(function(r){ return api.esc(r.a.slice(0,40)); }).join('; ')+').']);
  var nval=pca.filter(function(r){ return r.imp&&!r.vald; }); if(nval.length) f.push(['','D6: '+nval.length+' action'+(nval.length===1?' is':'s are')+' implemented and waiting for validation in production.']); }
 else if(F.rco) f.push(['warn','D5: root cause found but no permanent corrective action listed.']);
 if(F.crem&&!(pca.length&&all(pca,'vald'))) f.push(['warn','D6: containment was removed before every permanent action was validated.']);
 if(st[6]===2&&!F.crem&&ct.length) f.push(['','D6: every action is validated. Decide whether the containment can now be removed, and record the evidence.']);
 if(F.sys&&!pr.length) f.push(['warn','D7: a systemic cause is named but nothing is listed to prevent recurrence.']);
 if(pr.length&&!pr.some(function(r){ return /read-across|Other sites/.test(r.it||''); })) f.push(['','D7: no read-across. Where else could the same cause occur: similar parts, other lines, other sites?']);
 if(pr.length&&!pr.some(function(r){ return /FMEA/.test(r.it||''); })) f.push(['','D7: neither FMEA is updated. A failure that reached a customer should be in the FMEA with its real occurrence and detection.']);
 if(F.d8){ if(st.slice(0,8).some(function(x){ return x<2; })) f.push(['warn','D8: closed with disciplines still open ('+T.D.filter(function(x,i){ return i<8&&st[i]<2; }).join(', ')+').']);
  if(!F.champ) f.push(['warn','D8: closed without the champion\'s sign-off.']); }
 [[3,F.dd3],[4,F.dd4],[8,F.dd8]].forEach(function(x){ var i=x[0], d=x[1]; if(!d) return; if(st[i]===2&&dt[i]>d) f.push(['warn',T.D[i]+' was completed on '+api.esc(dt[i])+', after its due date of '+api.esc(d)+'.']); else if(st[i]<2&&d<today) f.push(['warn',T.D[i]+' is overdue: due '+api.esc(d)+'.']); });
 if(F.need&&/^No/.test(F.need)) f.push(['','Marked as not needing a full 8D. Record the correction and its check; if the problem comes back, open the 8D. The <a href="/tools/corrective-action-capa.html">corrective action tool</a> is a lighter format.']);
 root.querySelector('.d8-out').innerHTML=api.flags(f);
},
example:{f:{num:'8D-26-017',cust:'Dishwasher assembly customer, plant 2',part:'Hose clamp assembly HC-38',opened:'2026-09-14',
 sym:'Customer line found hose clamps that do not close fully on the dishwasher drain hose: 14 clamps in one week at their assembly station 6.',
 era:'Stopped shipment of HC-38 on 14 Sep. Customer notified the same day; replacement clamps from lot 2637, 100% checked, sent by express.',
 dd3:'2026-09-16',dd4:'2026-09-28',dd8:'2026-11-13',need:'Yes: cause unknown, or recurring, or customer requires it',
 stmt:'HC-38 clamps from lots 2634 to 2636 do not close to the 31.0 mm maximum inside diameter, so hoses are not sealed at the customer.',
 what:'HC-38 clamp, band latch does not engage the last tooth',why:'Drawing HC-38 rev B: closed ID 31.0 mm max; customer leak test fails',where:'Found at the customer, station 6. Made on stamping press 2, our plant line B.',when:'First seen 11 Sep. Lots 2634 to 2636, made 1 to 5 Sep. Not seen before.',who:'Customer assembly operator, then their incoming quality',how:'Clamp could not be latched by hand; customer leak test',many:'14 found by customer of 6,000 used. 3 lots, 18,000 clamps shipped.',
 isnot:'IS press 2, lots 2634-2636, tooth 7. IS NOT press 1, lots before 2634, other clamp sizes on the same press.',d2:'2026-09-15',
 rco:'The latch tooth form on press 2 die station 4 was worn after a die insert was replaced with a non-hardened insert on 29 Aug. Tooth height fell below the minimum.',
 rcov:'Insert hardness 32 HRC against 58 required. Clamps from a hardened insert: 0 of 500 failed. With the soft insert after 2 shifts: 9 of 500.',
 esc:'In-process check',escp:'First-and-last-piece check on press 2: go/no-go on band width only',
 rce:'The in-process check measures band width, not tooth height or a closing test, so a worn tooth form cannot be seen.',
 rcev:'All 14 returned clamps pass the band-width gauge; all fail a closing test on a 31.0 mm mandrel.',
 sys:'Die inserts are not a controlled item: no hardness requirement on the purchase order, and the PFMEA rates tooth form wear as low occurrence because the original inserts were hardened.',d4:'2026-09-24',
 crem:'',crwhy:'',rec:'',champ:'',d8:'',cacc:''},
 g:{tm:[{name:'Mira Okafor',role:'Champion',dept:'Plant manager',skill:'Authority over press time and tooling spend'},{name:'Tomas Reyes',role:'Team leader',dept:'Quality engineering',skill:'8D lead, customer contact'},{name:'Ilse Brandt',role:'Member',dept:'Tool room',skill:'Die design and maintenance'},{name:'Kwame Asante',role:'Member',dept:'Production, line B',skill:'Press operation, setup history'},{name:'Lena Fisk',role:'Subject matter expert',dept:'Metallurgy lab',skill:'Hardness testing'}],
  ct:[{a:'Hold and 100% mandrel closing test of lots 2634 to 2636 at the customer',loc:'Customer stock',chk:'5200',bad:'61',who:'T. Reyes',done:'2026-09-15',ver:'Yes'},
   {a:'Sort finished goods and stock in transit with the mandrel test',loc:'Finished goods',chk:'6800',bad:'84',who:'K. Asante',done:'2026-09-15',ver:'Yes'},
   {a:'Add 100% mandrel closing test at the end of press 2',loc:'Process (added check)',chk:'9500',bad:'0',who:'K. Asante',done:'2026-09-16',ver:'Not yet'}],
  pca:[{a:'Replace the soft insert with a hardened one; add hardness 56-60 HRC to the insert drawing and purchase order',for:'Occurrence',v:'Trial run of 5,000 with the hardened insert: 0 failures on the mandrel test',vd:'2026-09-29',who:'I. Brandt',imp:'2026-10-01',val:'',vald:''},
   {a:'Replace the band-width check with a closing test on a 31.0 mm mandrel at first and last piece and hourly',for:'Escape',v:'Mandrel catches all 14 returned clamps; gauge R&R 0 misclassifications in 3 x 30 trials',vd:'2026-09-30',who:'T. Reyes',imp:'2026-10-02',val:'',vald:''}],
  pr:[{it:'Process FMEA',ref:'Tooth form wear: occurrence 6, detection 3 with the mandrel check',who:'T. Reyes',done:'2026-10-06'},{it:'Control plan',ref:'Mandrel closing test added, hourly',who:'T. Reyes',done:'2026-10-06'},{it:'Supplier requirements',ref:'All die inserts: hardness on drawing and certificate required',who:'Purchasing',done:''}]}}
}
