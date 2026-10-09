{
slug:'iq-oq-pq-validation-protocol',
h:{
 /* automatic verdict from a numeric result and the limits; inclusive limits */
 auto:function(r){ var n=function(v){ var s=String(v==null?'':v).trim().replace(/,/g,''); return s===''?NaN:Number(s); }, x=n(r.res), lo=n(r.lo), hi=n(r.hi);
  if(isNaN(x)||(isNaN(lo)&&isNaN(hi))) return ''; var e=1e-9*Math.max(1,Math.abs(x));
  return ((isNaN(lo)||x>=lo-e)&&(isNaN(hi)||x<=hi+e))?'Pass':'Fail'; }
},
sections:[
 {type:'fields',title:'Protocol header',cols:3,fields:[
  {id:'pno',label:'Protocol number',ph:'e.g. VP-0412'},
  {id:'rev',label:'Revision',ph:'e.g. A'},
  {id:'vtype',label:'Type of validation',type:'select',opts:['Process validation','Equipment qualification','Test method validation','Cleaning validation','Software validation (production or QMS)','Packaging or sealing validation','Sterilization validation','Rework validation']},
  {id:'title',label:'Title',wide:true,ph:'e.g. IQ/OQ/PQ of the pouch heat sealer, cell 2'},
  {id:'sys',label:'Equipment or process',ph:'e.g. SL-3 band sealer'},
  {id:'asset',label:'Asset or line ID',ph:'e.g. EQ-2214'},
  {id:'reason',label:'Reason',type:'select',opts:['New equipment or process','Change to a validated process','Relocation','Periodic revalidation','Trend or failure investigation']},
  {id:'prep',label:'Prepared by'},
  {id:'pdate',label:'Date',type:'date'}]},
 {type:'fields',title:'Scope and system description',cols:2,hint:'Validation is needed where the output of a process cannot be fully verified by later inspection and test, or where verification alone would not be enough or not economical: sealing, sterilization, welding, molding, software. Say which applies, and why.',fields:[
  {id:'scope',label:'Scope',type:'textarea',wide:true,ph:'What is covered: equipment, products, operating range, sites'},
  {id:'desc',label:'System description',type:'textarea',wide:true,ph:'What the equipment does, key parameters, controls, software version'},
  {id:'oos',label:'Out of scope',type:'textarea'},
  {id:'refs',label:'References',type:'textarea',ph:'User requirements, risk analysis, drawings, SOPs, the validation master plan'},
  {id:'verif',label:'Can the output be fully verified by later inspection and test?',type:'select',opts:['No: validation required','Yes, but validation chosen','Yes, and verification alone is sufficient','Not assessed']},
  {id:'samp',label:'Sampling and statistical rationale',type:'textarea',ph:'e.g. 30 seals per lot, attribute plan for 95% confidence of at least 99% conforming'}]},
 {type:'custom',id:'key',title:'The three stages',html:'<div class="pillrow"><span>IQ &middot; INSTALLED AS SPECIFIED</span><span>OQ &middot; WORKS ACROSS THE OPERATING WINDOW, INCLUDING WORST CASE</span><span>PQ &middot; CONSISTENTLY MAKES GOOD PRODUCT IN NORMAL PRODUCTION</span></div>'},
 {type:'grid',id:'t',title:'Test cases',rows:4,hint:'Write the acceptance criterion before anything is run. Where the result is a number, enter the limits and the result, and the tool checks it; for an attribute result, give the verdict yourself. A failed test keeps its Fail; the retest goes on a new row and the failure on a deviation.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'st',label:'Stage',type:'select',opts:['IQ','OQ','PQ']},
  {id:'test',label:'Test or check',w:200,type:'textarea',rows:2},
  {id:'cond',label:'Condition',type:'select',opts:['As installed','Nominal','Low limit (worst case)','High limit (worst case)','Challenge or fault','Normal production']},
  {id:'n',label:'Runs or lots',type:'number',min:0},
  {id:'crit',label:'Acceptance criterion',w:170,type:'textarea',rows:2},
  {id:'lo',label:'Min',type:'number'},
  {id:'hi',label:'Max',type:'number'},
  {id:'res',label:'Result',w:100},
  {id:'auto',label:'By limits',calc:function(r){ var a=window.TOOL.h.auto(r); return a?'<span class="vq-'+a.toLowerCase()+'">'+a+'</span>':''; }},
  {id:'v',label:'Verdict',type:'select',opts:['Pass','Fail','Not run']},
  {id:'dev',label:'Deviation',w:80},
  {id:'by',label:'Executed by',w:100},
  {id:'dt',label:'Date',type:'date'}]},
 {type:'grid',id:'d',title:'Deviations',rows:1,hint:'Every failure, and every departure from the approved protocol, gets a deviation: what happened, its effect on the validation, the cause, and how it was resolved.',cols:[
  {id:'id',label:'Deviation',w:80},
  {id:'tid',label:'Test ID',w:70},
  {id:'desc',label:'What happened',w:200,type:'textarea',rows:2},
  {id:'imp',label:'Impact on the validation',w:180,type:'textarea',rows:2},
  {id:'rc',label:'Cause',w:150,type:'textarea',rows:2},
  {id:'act',label:'Resolution',w:180,type:'textarea',rows:2},
  {id:'rt',label:'Retest',type:'select',opts:['Yes, passed','Yes, pending','No, justified']},
  {id:'st',label:'Status',type:'select',opts:['Open','Closed']}]},
 {type:'custom',id:'sum',title:'Status by stage',html:'<div class="svgw vq-svg"></div><div class="stat vq-stat"></div>'},
 {type:'grid',id:'a',title:'Approvals',rows:3,hint:'The protocol is approved before execution starts; the report after the last test and deviation are closed.',cols:[
  {id:'role',label:'Role',w:150},
  {id:'name',label:'Name',w:150},
  {id:'pa',label:'Protocol approved',type:'date'},
  {id:'ra',label:'Report approved',type:'date'}]},
 {type:'fields',title:'Summary report',cols:2,fields:[
  {id:'stat',label:'Validation status',type:'select',opts:['Draft protocol','Protocol approved','Executing','Report in review','Approved: validated','Not validated']},
  {id:'rdate',label:'Report number and date',ph:'e.g. VR-0412, 2026-08-28'},
  {id:'concl',label:'Conclusion',type:'textarea',wide:true,ph:'Does the evidence show the process consistently produces a result meeting its requirements? State the validated operating window.'},
  {id:'reval',label:'Revalidation triggers',type:'textarea',wide:true,ph:'e.g. Change of heater element or controller, change of pouch material, trend of seal failures, every 3 years'}]},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out vq-out"></div>'}
],
update:function(root,api){
 var S=api.state(), H=window.TOOL.h, f=[];
 var T=S.g.t.map(function(r,i){ return {r:r,i:i,id:(r.id||'').trim()||('row '+(i+1)),a:H.auto(r)}; }).filter(function(x){ return x.r.test||x.r.id; });
 var D={}; S.g.d.forEach(function(d){ var k=(d.id||'').trim(); if(k) D[k.toUpperCase()]=d; });
 var trs=root.querySelectorAll('table[data-grid="t"] tbody tr');
 S.g.t.forEach(function(r,i){ if(trs[i]) trs[i].classList.toggle('hi-row', r.v==='Fail'||(r.v==='Pass'&&H.auto(r)==='Fail')); });
 var stages={IQ:{p:0,f:0,o:0,n:0,lim:0,runs:0,first:'',last:'',fo:0},OQ:{p:0,f:0,o:0,n:0,lim:0,runs:0,first:'',last:'',fo:0},PQ:{p:0,f:0,o:0,n:0,lim:0,runs:0,first:'',last:'',fo:0}};
 var firstRun='', lastRun='';
 T.forEach(function(x){ var r=x.r, id='<b>'+api.esc(x.id)+'</b>', s=stages[r.st];
  if(!r.st) f.push(['warn',id+' has no stage (IQ, OQ or PQ).']);
  if(!String(r.crit||'').trim()&&!String(r.lo||'').trim()&&!String(r.hi||'').trim()) f.push(['warn',id+' has no acceptance criterion. Criteria are set and approved before the test is run, never after.']);
  if(x.a&&r.v&&r.v!=='Not run'&&r.v!==x.a) f.push(['warn',id+': the verdict is '+r.v+' but the result '+api.esc(r.res)+' is '+(x.a==='Pass'?'inside':'outside')+' the limits.']);
  if(r.v==='Pass'&&!String(r.res||'').trim()) f.push(['warn',id+' is marked Pass with no result recorded. Record the actual value or observation, not just the verdict.']);
  if(r.v==='Fail'){ var dv=(r.dev||'').trim().toUpperCase();
   if(!dv) f.push(['warn',id+' failed and has no deviation. Raise one, and assess its impact before going on.']);
   else if(!D[dv]) f.push(['warn',id+': deviation '+api.esc(r.dev)+' is not in the deviations table.']); }
  if(r.v&&r.v!=='Not run'&&!r.dt) f.push(['',id+': add the execution date and who ran it.']);
  if(s){ s.n++; if(r.v==='Pass') s.p++; else if(r.v==='Fail'){ s.f++; var dd=D[(r.dev||'').trim().toUpperCase()]; if(!dd||dd.st!=='Closed') s.fo++; } else s.o++;
   if(/limit|Challenge/.test(r.cond||'')) s.lim++;
   if(r.st==='PQ'){ var k=api.num(r.n); s.runs+=isNaN(k)?0:k; }
   if(r.dt&&r.v&&r.v!=='Not run'){ if(!s.first||r.dt<s.first) s.first=r.dt; if(!s.last||r.dt>s.last) s.last=r.dt; if(!firstRun||r.dt<firstRun) firstRun=r.dt; if(!lastRun||r.dt>lastRun) lastRun=r.dt; } }
  if(r.st==='PQ'&&/limit|Challenge/.test(r.cond||'')) f.push(['',id+': PQ is normally run at the nominal settings under normal production conditions. Worst-case and challenge tests belong in OQ.']); });
 Object.keys(D).forEach(function(k){ var d=D[k]; if(d.st!=='Closed') f.push(['warn','Deviation <b>'+api.esc(d.id)+'</b> is open. The report cannot be approved until it is closed or its impact is accepted.']); else if(!d.imp) f.push(['warn','Deviation <b>'+api.esc(d.id)+'</b> is closed with no impact assessment.']); if(d.rt==='Yes, pending') f.push(['','Deviation <b>'+api.esc(d.id)+'</b>: the retest is still pending.']); });
 if(T.length){
  if(!stages.IQ.n) f.push(['','No IQ tests. If the equipment was qualified before, reference that IQ in the scope.']);
  if(stages.OQ.n&&!stages.OQ.lim) f.push(['warn','No OQ test is run at a limit or under a challenge. OQ has to show the process works across the whole operating window, including the worst case, not just at nominal.']);
  if(!stages.OQ.n) f.push(['warn','No OQ tests. Without OQ there is no evidence for the operating window.']);
  if(!stages.PQ.n) f.push(['warn','No PQ tests. PQ shows that the process is consistent in routine production.']);
  else if(stages.PQ.runs<3) f.push(['','PQ covers '+stages.PQ.runs+' run'+(stages.PQ.runs===1?'':'s')+' or lots in total. Three consecutive runs is a common convention, not a rule; base the number on risk and on the statistics, and justify it.']);
  if((stages.IQ.o||stages.IQ.fo)&&stages.OQ.first) f.push(['','OQ was started while IQ was still incomplete. Acceptable only if the protocol allows it and the open IQ items cannot affect OQ.']);
  if((stages.OQ.o||stages.OQ.fo)&&stages.PQ.first) f.push(['','PQ was started while OQ was still incomplete. Acceptable only if the protocol allows it and the open OQ items cannot affect PQ.']);
 }
 var A=S.g.a.filter(function(a){ return a.role||a.name; }), pMax='', rMin='', rMiss=0, pMiss=0;
 A.forEach(function(a){ if(a.pa){ if(a.pa>pMax) pMax=a.pa; } else pMiss++; if(a.ra){ if(!rMin||a.ra<rMin) rMin=a.ra; } else rMiss++; });
 if(!A.length) f.push(['warn','No approvers listed. A protocol is approved, at least by the owner and by quality, before execution.']);
 if(firstRun&&pMiss) f.push(['warn','Tests have been run but '+pMiss+' protocol approval'+(pMiss>1?'s are':' is')+' missing.']);
 if(firstRun&&pMax&&firstRun<pMax) f.push(['warn','Testing started on '+api.esc(firstRun)+', before the last protocol approval on '+api.esc(pMax)+'. Results gathered before approval need a deviation and a justification.']);
 if(rMin&&lastRun&&rMin<lastRun) f.push(['warn','A report approval ('+api.esc(rMin)+') is dated before the last test ('+api.esc(lastRun)+').']);
 var open=T.filter(function(x){ return !x.r.v||x.r.v==='Not run'; }).length, failOpen=stages.IQ.fo+stages.OQ.fo+stages.PQ.fo;
 if(S.f.stat==='Approved: validated'){
  if(open) f.push(['warn','Status is validated but '+open+' test'+(open>1?'s have':' has')+' not been run.']);
  if(failOpen) f.push(['warn','Status is validated but '+failOpen+' failed test'+(failOpen>1?'s have':' has')+' no closed deviation.']);
  if(rMiss) f.push(['warn','Status is validated but '+rMiss+' report approval'+(rMiss>1?'s are':' is')+' missing.']); }
 if(firstRun&&!open&&rMiss&&S.f.stat!=='Approved: validated') f.push(['','Testing is finished; '+rMiss+' report approval'+(rMiss>1?'s are':' is')+' still outstanding.']);
 if(S.f.verif==='Yes, and verification alone is sufficient') f.push(['','You say the output can be fully verified. Validation may not be required; record that rationale in the validation master plan.']);
 if(S.f.verif==='Not assessed'||!S.f.verif) f.push(['','Answer whether the output can be fully verified. It is the first question in deciding whether a process needs validation.']);
 if(!S.f.reval&&T.length) f.push(['','List the revalidation triggers: the changes and trends that would take the process outside what this validation covers.']);
 if(T.length&&!f.some(function(q){ return q[0]==='warn'; })) f.push(['ok','Criteria are set, every failure has a closed deviation, and the approvals are in the right order.']);
 /* picture */
 var nar=root.clientWidth&&root.clientWidth<560, BW=230, G=45, Hh=150, W=nar?BW+20:20+3*BW+2*G, VH=nar?3*Hh-20+2*(G-20)+0:Hh, g='<svg viewBox="0 0 '+W+' '+VH+'" role="img" aria-label="Status by stage"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.s{font:800 22px Archivo,sans-serif;fill:#0F3E68}.m{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.06em}</style><defs><marker id="vqar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#4A5D71"/></marker></defs>';
 ['IQ','OQ','PQ'].forEach(function(k,i){ var s=stages[k], x=nar?10:10+i*(BW+G), oy=nar?i*(Hh-20+G-20):0, st=!s.n?'NO TESTS':(s.o?'IN PROGRESS':(s.fo?'FAILED, OPEN':(s.f?'COMPLETE, WITH DEVIATIONS':'COMPLETE'))), col=!s.n?'#4A5D71':s.fo?'#C0392B':s.o?'#9C7C1F':'#2E7D4F';
  g+='<g transform="translate(0 '+oy+')">';
  g+='<rect x="'+x+'" y="10" width="'+BW+'" height="'+(Hh-20)+'" rx="4" fill="#fff" stroke="'+col+'" stroke-width="2"/><text class="s" x="'+(x+12)+'" y="40">'+k+'</text><text class="m" x="'+(x+BW-12)+'" y="34" text-anchor="end" fill="'+col+'" style="fill:'+col+'">'+st+'</text>';
  var bw=BW-24, y=56; if(s.n){ var a=bw*s.p/s.n, b=bw*s.f/s.n; g+='<rect x="'+(x+12)+'" y="'+y+'" width="'+a+'" height="16" fill="#BFE0C9"/><rect x="'+(x+12+a)+'" y="'+y+'" width="'+b+'" height="16" fill="#E9A39B"/><rect x="'+(x+12+a+b)+'" y="'+y+'" width="'+(bw-a-b)+'" height="16" fill="#E3E8EE"/>'; } else g+='<rect x="'+(x+12)+'" y="'+y+'" width="'+bw+'" height="16" fill="none" stroke="#C9D2DC" stroke-dasharray="4 3"/>';
  g+='<text x="'+(x+12)+'" y="94">'+s.p+' passed &middot; '+s.f+' failed &middot; '+s.o+' not run</text>';
  g+='<text class="m" x="'+(x+12)+'" y="116">'+(k==='OQ'?s.lim+' AT LIMITS OR CHALLENGE':k==='PQ'?s.runs+' RUNS OR LOTS':s.n+' CHECKS')+'</text><text class="m" x="'+(x+12)+'" y="130">'+(s.first?api.esc(s.first)+(s.last!==s.first?' TO '+api.esc(s.last):''):'NOT STARTED')+'</text>';
  if(i<2) g+=nar?'<line x1="'+(x+BW/2)+'" y1="142" x2="'+(x+BW/2)+'" y2="160" stroke="#4A5D71" stroke-width="2" marker-end="url(#vqar)"/>':'<line x1="'+(x+BW+4)+'" y1="'+(Hh/2)+'" x2="'+(x+BW+G-4)+'" y2="'+(Hh/2)+'" stroke="#4A5D71" stroke-width="2" marker-end="url(#vqar)"/>';
  g+='</g>'; });
 root.querySelector('.vq-svg').innerHTML=g+'</svg>';
 var tot=T.length, pass=stages.IQ.p+stages.OQ.p+stages.PQ.p, fl=stages.IQ.f+stages.OQ.f+stages.PQ.f;
 root.querySelector('.vq-stat').innerHTML='<div><b>'+tot+'</b><span>Test cases</span></div><div><b>'+pass+'</b><span>Passed</span></div><div><b>'+fl+'</b><span>Failed</span></div><div><b>'+open+'</b><span>Not run yet</span></div><div><b>'+Object.keys(D).filter(function(k){ return D[k].st!=='Closed'; }).length+' / '+Object.keys(D).length+'</b><span>Deviations open / total</span></div>';
 root.querySelector('.vq-out').innerHTML=api.flags(f,'Add test cases, and the checks appear here.');
},
example:{f:{pno:'VP-0412',rev:'A',vtype:'Packaging or sealing validation',title:'IQ/OQ/PQ of the SL-3 band sealer for sterile barrier pouches, packaging cell 2',sys:'SL-3 continuous band sealer (fictional)',asset:'EQ-2214',reason:'New equipment or process',prep:'Validation engineer',pdate:'2026-07-28',
 scope:'Sealing of 150 x 250 mm peel pouches for the KX catheter kit on the SL-3 sealer in packaging cell 2. Validated window: 160 to 180 °C, 0.8 to 1.2 s dwell, 300 to 400 kPa.',desc:'Continuous band sealer with PID temperature control, a pressure regulator and a conveyor speed setting that sets the dwell. Controller firmware 2.07. Over-temperature and under-temperature alarms stop the conveyor.',oos:'Pouch printing; sterilization of the sealed pouch (covered by VP-0390).',refs:'URS-SL3 rev B; pFMEA PF-PK-02; seal strength method TM-018; dye penetration method TM-021',verif:'No: validation required',samp:'Seal strength: 10 seals per condition in OQ, 30 per lot in PQ. Dye penetration: 30 pouches per condition, accept on zero leaks (about 90% confidence of a leak rate below 7.4% per lot; 90 across three lots gives 95% confidence below 3.3%).',
 stat:'Report in review',rdate:'VR-0412, 2026-08-28',concl:'IQ, OQ and PQ met all acceptance criteria after deviation DEV-01 was resolved. The SL-3 consistently produces seals meeting TM-018 and TM-021 across 160 to 180 °C, 0.8 to 1.2 s and 300 to 400 kPa.',reval:'Replacement of the heater bands or controller; firmware change; a new pouch material or supplier; two or more seal failures in a quarter; otherwise every three years.'},
 g:{t:[
  {id:'IQ-01',st:'IQ',test:'Utilities: supply voltage and compressed air at the machine',cond:'As installed',n:'',crit:'230 V ±10%; air 550 to 700 kPa',lo:'',hi:'',res:'232 V; 610 kPa',v:'Pass',dev:'',by:'Technician',dt:'2026-08-05'},
  {id:'IQ-02',st:'IQ',test:'Temperature controller calibrated against a reference thermocouple',cond:'As installed',n:'',crit:'Error within ±2.0 °C at 170 °C',lo:'-2',hi:'2',res:'0.8',v:'Pass',dev:'',by:'Metrology',dt:'2026-08-05'},
  {id:'IQ-03',st:'IQ',test:'Firmware version, manuals, spare parts list and PM schedule recorded',cond:'As installed',n:'',crit:'Firmware 2.07; PM entered in the maintenance system',lo:'',hi:'',res:'Firmware 2.07; PM-2214 created',v:'Pass',dev:'',by:'Validation engineer',dt:'2026-08-06'},
  {id:'OQ-01',st:'OQ',test:'Seal strength at 160 °C, 0.8 s, 300 kPa (minimum of 10 seals, N/15 mm)',cond:'Low limit (worst case)',n:'1',crit:'Each seal at least 1.2 N/15 mm',lo:'1.2',hi:'',res:'1.6',v:'Pass',dev:'',by:'Validation engineer',dt:'2026-08-10'},
  {id:'OQ-02',st:'OQ',test:'Seal strength at 180 °C, 1.2 s, 400 kPa (maximum of 10 seals, N/15 mm)',cond:'High limit (worst case)',n:'1',crit:'No seal above 4.0 N/15 mm, so the pouch still peels cleanly',lo:'',hi:'4.0',res:'3.1',v:'Pass',dev:'',by:'Validation engineer',dt:'2026-08-11'},
  {id:'OQ-03',st:'OQ',test:'Dye penetration at both limit settings, 30 pouches each',cond:'High limit (worst case)',n:'1',crit:'No channels or leaks: 0 of 60',lo:'',hi:'',res:'0 of 60',v:'Pass',dev:'',by:'Lab technician',dt:'2026-08-11'},
  {id:'OQ-04',st:'OQ',test:'Under-temperature alarm: lower the set point by 15 °C during a run; time until the conveyor stops (s)',cond:'Challenge or fault',n:'1',crit:'Conveyor stops within 5 s',lo:'',hi:'5',res:'12',v:'Fail',dev:'DEV-01',by:'Validation engineer',dt:'2026-08-12'},
  {id:'OQ-04R',st:'OQ',test:'Retest of OQ-04 after the alarm delay setting was corrected (s)',cond:'Challenge or fault',n:'1',crit:'Conveyor stops within 5 s',lo:'',hi:'5',res:'3',v:'Pass',dev:'',by:'Validation engineer',dt:'2026-08-14'},
  {id:'PQ-01',st:'PQ',test:'Lot 1 at nominal 170 °C, 1.0 s, 350 kPa: minimum seal strength of 30 (N/15 mm)',cond:'Normal production',n:'1',crit:'At least 1.2 N/15 mm',lo:'1.2',hi:'4.0',res:'1.9',v:'Pass',dev:'',by:'Production operator',dt:'2026-08-18'},
  {id:'PQ-02',st:'PQ',test:'Lot 2, second shift: minimum seal strength of 30 (N/15 mm)',cond:'Normal production',n:'1',crit:'At least 1.2 N/15 mm',lo:'1.2',hi:'4.0',res:'2.0',v:'Pass',dev:'',by:'Production operator',dt:'2026-08-19'},
  {id:'PQ-03',st:'PQ',test:'Lot 3, new roll of pouch stock: minimum seal strength of 30 (N/15 mm)',cond:'Normal production',n:'1',crit:'At least 1.2 N/15 mm',lo:'1.2',hi:'4.0',res:'1.8',v:'Pass',dev:'',by:'Production operator',dt:'2026-08-20'},
  {id:'PQ-04',st:'PQ',test:'Dye penetration, 30 pouches from each PQ lot',cond:'Normal production',n:'',crit:'0 of 90 leak',lo:'',hi:'',res:'0 of 90',v:'Pass',dev:'',by:'Lab technician',dt:'2026-08-21'}],
  d:[{id:'DEV-01',tid:'OQ-04',desc:'Conveyor stopped 12 s after the temperature fell below the alarm limit; the criterion is 5 s.',imp:'Pouches sealed in the 12 s window during OQ-04 were scrapped. No effect on OQ-01 to OQ-03, which ran without alarms. PQ not yet started.',rc:'Alarm delay parameter left at the factory default of 10 s.',act:'Delay set to 2 s and locked under the supervisor password; parameter added to the IQ checklist for future installs. Retest OQ-04R passed.',rt:'Yes, passed',st:'Closed'}],
  a:[{role:'Validation engineer (author)',name:'',pa:'2026-08-03',ra:'2026-08-27'},{role:'Manufacturing engineering',name:'',pa:'2026-08-03',ra:'2026-08-27'},{role:'Quality assurance',name:'',pa:'2026-08-04',ra:''}]}}
}
