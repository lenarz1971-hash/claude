{
slug:'audit-car-verification-tracker',
sections:[
 {type:'fields',title:'Tracker settings',cols:3,fields:[
  {id:'org',label:'Organization'},
  {id:'prog',label:'Audit program',ph:'e.g. 2026 internal audits'},
  {id:'owner',label:'Follow-up owner',ph:'Audit program manager'},
  {id:'asof',label:'Status as of',type:'date',hint:'Overdue and aging checks use this date.'},
  {id:'eff',label:'Days from implementation to effectiveness check',type:'number',min:1,hint:'Long enough for the problem to have had a chance to recur.'},
  {id:'esc',label:'Escalate when overdue by more than (days)',type:'number',min:0,hint:'Your escalation rule, for example to the area manager and then top management.'}]},
 {type:'grid',id:'car',title:'Corrective action requests',rows:3,hint:'One row per CAR raised from an audit finding. Review each element of the auditee’s response: <b>containment</b> (what was done about product, service or records already affected), <b>root cause</b>, <b>correction</b> (fixing this instance) and <b>corrective action</b> (removing the cause). Then record when implementation was verified and the result of the effectiveness check.',cols:[
  {id:'id',label:'CAR',w:60},
  {id:'fd',label:'Finding',w:200,type:'textarea',rows:1},
  {id:'gr',label:'Grade',type:'select',opts:['Major','Minor']},
  {id:'iss',label:'Issued',type:'date'},
  {id:'rdue',label:'Response due',type:'date'},
  {id:'rrec',label:'Response received',type:'date'},
  {id:'cn',label:'Containment',type:'select',opts:['Adequate','Inadequate','Not needed']},
  {id:'rc',label:'Root cause',type:'select',opts:['Adequate','Inadequate']},
  {id:'co',label:'Correction',type:'select',opts:['Adequate','Inadequate']},
  {id:'ca',label:'Corrective action',type:'select',opts:['Adequate','Inadequate']},
  {id:'adue',label:'Action due',type:'date',tip:'Implementation date committed in the accepted response'},
  {id:'ver',label:'Implementation verified',type:'date'},
  {id:'effd',label:'Effectiveness checked',type:'date'},
  {id:'res',label:'Effectiveness result',type:'select',opts:['Effective','Not effective']},
  {id:'cl',label:'Closed',type:'date'},
  {id:'st',label:'Status',calc:function(r,api){
   var A=window.ACVT;
   if(!A){ A=window.ACVT={};
    A.ok=function(s){return /^\d{4}-\d\d-\d\d$/.test(s||'');};
    A.days=function(a,b){return Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/864e5);};
    A.add=function(a,n){var d=new Date(Date.parse(a+'T00:00:00Z')+n*864e5);return d.toISOString().slice(0,10);};
    A.show=function(s){var p=s.split('-');return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+p[1]-1]+' '+(+p[2])+', '+p[0];};
    A.stat=function(r,F,api){
     var asof=A.ok(F.asof)?F.asof:'', ed=api.num(F.eff); if(isNaN(ed))ed=90;
     var over=function(d){return asof&&A.ok(d)?A.days(d,asof):NaN;};
     if(A.ok(r.cl)){ if(r.res==='Effective') return {k:'closed',t:'Closed',c:'ok'}; return {k:'closednoeff',t:'Closed without effectiveness',c:'bad'}; }
     if(r.res==='Not effective') return {k:'ineff',t:'Not effective: reopen',c:'bad',od:over(r.effd)};
     if(r.res==='Effective') return {k:'ready',t:'Ready to close',c:'ok'};
     if(A.ok(r.ver)){ var due=A.add(r.ver,ed), o=over(due); return o>0?{k:'effover',t:'Effectiveness check overdue '+o+' d',c:'bad',od:o,due:due}:{k:'effwait',t:'Effectiveness check due '+A.show(due),c:'',due:due}; }
     if(!A.ok(r.rrec)){ var o2=over(r.rdue); return o2>0?{k:'respover',t:'Response overdue '+o2+' d',c:'bad',od:o2}:{k:'noresp',t:'Awaiting response',c:''}; }
     var el=[r.cn,r.rc,r.co,r.ca];
     if(el.indexOf('Inadequate')>=0){ var o3=over(r.rrec); return {k:'returned',t:'Response returned',c:'bad',od:o3}; }
     if(el.some(function(x){return !x;})) return {k:'review',t:'Response under review',c:''};
     var o4=over(r.adue); return o4>0?{k:'implover',t:'Implementation overdue '+o4+' d',c:'bad',od:o4}:{k:'impl',t:'Awaiting implementation',c:''};
    };
   }
   if(!r.id&&!r.fd) return '';
   var s=A.stat(r,api.state().f,api); return '<span class="'+(s.c==='bad'?'bad':(s.c==='ok'?'good':''))+'">'+s.t+'</span>';
  }}]},
 {type:'custom',id:'sum',title:'Follow-up status and escalation',hint:'Each bar counts the CARs at that follow-up stage, closed ones included. Red stages need action from the program manager.',html:'<div class="svgw acv-chart"></div><div class="out acv-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[], A=window.ACVT;
 var chart=root.querySelector('.acv-chart'), out=root.querySelector('.acv-out');
 var R=S.g.car.filter(function(r){return r.id||r.fd;});
 if(!A||!R.length){ chart.innerHTML=''; out.innerHTML=api.flags([],'Add the corrective action requests from your audits and the status, aging and escalation checks appear here.'); return; }
 var nm=function(r){return 'CAR '+esc(r.id||('line '+(S.g.car.indexOf(r)+1)));};
 var escd=api.num(F.esc); if(isNaN(escd)) escd=30;
 var X=R.map(function(r){return {r:r,s:A.stat(r,F,api)};});
 var ST=[['noresp','Awaiting response','#7C8B99'],['respover','Response overdue','#C0392B'],['review','Under review','#7C8B99'],['returned','Returned to auditee','#C0392B'],['impl','Awaiting implementation','#0F3E68'],['implover','Implementation overdue','#C0392B'],['effwait','Awaiting effectiveness check','#0F3E68'],['effover','Effectiveness check overdue','#C0392B'],['ineff','Not effective','#C0392B'],['ready','Ready to close','#1F8C55'],['closednoeff','Closed without check','#C0392B'],['closed','Closed','#1F8C55']];
 var cnt={}; X.forEach(function(x){cnt[x.s.k]=(cnt[x.s.k]||0)+1;});
 var shown=ST.filter(function(s){return cnt[s[0]];}), mx=Math.max.apply(null,shown.map(function(s){return cnt[s[0]];}));
 var W=720, L=250, rh=28, H=14+shown.length*rh+6, bw=W-L-60;
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="CARs by follow-up stage"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.n{font:700 13px Archivo,sans-serif}</style>';
 shown.forEach(function(s,i){ var y=10+i*rh, w=Math.max(4,cnt[s[0]]/mx*bw);
  g+='<text x="'+(L-10)+'" y="'+(y+17)+'" text-anchor="end">'+s[1]+'</text><rect x="'+L+'" y="'+(y+3)+'" width="'+w+'" height="'+(rh-8)+'" rx="3" fill="'+s[2]+'"/><text class="n" x="'+(L+w+8)+'" y="'+(y+17)+'">'+cnt[s[0]]+'</text>'; });
 chart.innerHTML=g+'</svg>';
 var open=X.filter(function(x){return x.s.k!=='closed'&&x.s.k!=='closednoeff';});
 f.push([open.some(function(x){return x.s.c==='bad';})?'warn':'ok','<b>'+R.length+' CAR'+(R.length===1?'':'s')+'</b>: '+(cnt.closed||0)+' closed with effectiveness confirmed, '+(cnt.closednoeff?cnt.closednoeff+' closed without an effectiveness check, ':'')+'<b>'+open.length+' open</b>'+(cnt.ready?' (including '+cnt.ready+' ready to close)':'')+'.'+(A.ok(F.asof)?' Status as of '+A.show(F.asof)+'.':' Enter the status date to see overdue items.')]);
 var E=X.filter(function(x){return x.s.k==='ineff'||(x.s.od>escd&&x.s.k!=='returned')||(x.s.k==='returned'&&x.s.od>escd);});
 if(E.length) f.push(['warn','<b>Escalate</b>: '+E.map(function(x){return nm(x.r)+' ('+(x.s.k==='ineff'?'action not effective':x.s.t.toLowerCase()+(x.s.k==='returned'?' '+x.s.od+' days ago':''))+')';}).join('; ')+'. Rule in use: more than '+escd+' days overdue, or any ineffective action.']);
 var E2=X.filter(function(x){return E.indexOf(x)<0&&x.s.od>0&&x.s.k!=='returned';}); if(E2.length) f.push(['warn','Overdue, not yet at the escalation point: '+E2.map(function(x){return nm(x.r)+' ('+x.s.t.toLowerCase()+')';}).join('; ')+'. Remind the action owner now.']);
 var ie=X.filter(function(x){return x.s.k==='ineff';}); if(ie.length) f.push(['warn','Corrective action not effective: '+ie.map(function(x){return nm(x.r);}).join(', ')+'. Do not close it. Reopen the CAR (or raise a new one that references it), ask for a fresh root cause analysis, and consider whether the original finding should be regraded or the area audited sooner.']);
 var rt=X.filter(function(x){return x.s.k==='returned';}); if(rt.length) f.push(['warn','Response returned: '+rt.map(function(x){var r=x.r,b=[];if(r.cn==='Inadequate')b.push('containment');if(r.rc==='Inadequate')b.push('root cause');if(r.co==='Inadequate')b.push('correction');if(r.ca==='Inadequate')b.push('corrective action');return nm(r)+' ('+b.join(', ')+')';}).join('; ')+'. Tell the auditee specifically what is missing and set a resubmission date. "Retrain the operator" or "human error" rarely survives the question of why the system allowed it.']);
 var cn=X.filter(function(x){return x.s.k==='closednoeff';}); if(cn.length) f.push(['warn','Closed without a confirmed effective result: '+cn.map(function(x){return nm(x.r);}).join(', ')+'. Verifying that an action was implemented is not the same as showing it worked. Reopen, or record the effectiveness evidence.']);
 var nv=X.filter(function(x){return A.ok(x.r.cl)&&!A.ok(x.r.ver);}); if(nv.length) f.push(['warn','Closed with no implementation verification date: '+nv.map(function(x){return nm(x.r);}).join(', ')+'.']);
 var ed=api.num(F.eff); if(isNaN(ed)) ed=90;
 var early=X.filter(function(x){var r=x.r;return A.ok(r.ver)&&A.ok(r.effd)&&r.res==='Effective'&&A.days(r.ver,r.effd)<ed;}); if(early.length) f.push(['warn','Effectiveness judged sooner than the set period after implementation: '+early.map(function(x){return nm(x.r)+' ('+A.days(x.r.ver,x.r.effd)+' days)';}).join(', ')+'. A short window may not show whether the problem returns.']);
 var bad=X.filter(function(x){var r=x.r;return (A.ok(r.rrec)&&A.ok(r.iss)&&r.rrec<r.iss)||(A.ok(r.ver)&&A.ok(r.rrec)&&r.ver<r.rrec)||(A.ok(r.cl)&&A.ok(r.ver)&&r.cl<r.ver);}); if(bad.length) f.push(['warn','Dates out of order for: '+bad.map(function(x){return nm(x.r);}).join(', ')+'.']);
 var nd=X.filter(function(x){return !A.ok(x.r.rdue)&&!A.ok(x.r.rrec);}); if(nd.length) f.push(['warn','No response due date: '+nd.map(function(x){return nm(x.r);}).join(', ')+'. Without one, the CAR cannot become overdue and will drift.']);
 var mj=X.filter(function(x){return x.r.gr==='Major'&&x.s.k!=='closed';}); if(mj.length) f.push(['','Major findings still open: '+mj.map(function(x){return nm(x.r);}).join(', ')+'. Report their status to the audit client and in management review.']);
 var age=X.filter(function(x){return A.ok(x.r.iss)&&A.ok(x.r.cl);}).map(function(x){return A.days(x.r.iss,x.r.cl);});
 if(age.length) f.push(['','Average time from issue to closure for closed CARs: <b>'+api.fmt(age.reduce(function(a,b){return a+b;},0)/age.length,0)+' days</b> ('+age.length+' closed).']);
 f.push(['','The auditor reviews the response, verifies the actions were taken, and later checks whether they worked; the auditee owns the root cause analysis and the actions. ISO 9001:2015 clause 10.2.1 d) requires the organization to review the effectiveness of any corrective action taken.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Fernbrook Snack Co. (snack plant)',prog:'2026 internal food safety and quality audits',owner:'Food safety and quality manager',asof:'2026-10-01',eff:'90',esc:'30'},
 g:{car:[
  {id:'26-01',fd:'Metal detector verification checks missed on Line 2 night shift (4 of 14 shifts sampled).',gr:'Major',iss:'2026-05-12',rdue:'2026-05-26',rrec:'2026-05-22',cn:'Adequate',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-06-15',ver:'2026-06-18',effd:'2026-09-18',res:'Effective',cl:'2026-09-21'},
  {id:'26-02',fd:'Glass and brittle plastics register not updated after packing line rebuild.',gr:'Minor',iss:'2026-03-10',rdue:'2026-04-09',rrec:'2026-04-02',cn:'Not needed',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-05-01',ver:'2026-05-29',effd:'',res:'',cl:'2026-06-02'},
  {id:'26-03',fd:'Document revision at packing station 3 obsolete (rev C posted, rev E current).',gr:'Minor',iss:'2026-03-10',rdue:'2026-04-09',rrec:'2026-04-06',cn:'Adequate',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-04-15',ver:'2026-04-15',effd:'',res:'',cl:''},
  {id:'26-04',fd:'Pest control trend reports not reviewed by site team (Jan to Mar).',gr:'Minor',iss:'2026-04-07',rdue:'2026-05-07',rrec:'2026-04-30',cn:'Not needed',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-05-15',ver:'2026-05-20',effd:'2026-08-25',res:'Not effective',cl:''},
  {id:'26-05',fd:'Allergen changeover sign-off missing on 3 of 12 changeovers sampled.',gr:'Minor',iss:'2026-06-03',rdue:'2026-07-03',rrec:'2026-09-15',cn:'Adequate',rc:'Inadequate',co:'Adequate',ca:'Inadequate',adue:'',ver:'',effd:'',res:'',cl:''},
  {id:'26-06',fd:'Fryer oil thermometer T-07 past calibration due date.',gr:'Minor',iss:'2026-07-14',rdue:'2026-08-13',rrec:'2026-08-10',cn:'Adequate',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-09-30',ver:'',effd:'',res:'',cl:''},
  {id:'26-07',fd:'New seasoning supplier used without approval or risk assessment.',gr:'Major',iss:'2026-08-04',rdue:'2026-08-18',rrec:'',cn:'',rc:'',co:'',ca:'',adue:'',ver:'',effd:'',res:'',cl:''},
  {id:'26-08',fd:'Sanitation hire started work before GMP training was recorded.',gr:'Minor',iss:'2026-08-25',rdue:'2026-09-24',rrec:'2026-09-20',cn:'Not needed',rc:'Adequate',co:'Adequate',ca:'Adequate',adue:'2026-10-31',ver:'',effd:'',res:'',cl:''}]}}
}
