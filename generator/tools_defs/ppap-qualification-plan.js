{
slug:'ppap-qualification-plan',
h:{
 /* AIAG PPAP 4th edition retention/submission table, levels 1 to 5.
    S = submit to the customer and retain; R = retain, available on request; * = retain, submit if the customer asks */
 std:[['Design records','RSS*R'],['Engineering change documents','RSS*R'],['Customer engineering approval','RRS*R'],['Design FMEA','RRS*R'],
  ['Process flow diagram','RRS*R'],['Process FMEA','RRS*R'],['Control plan','RRS*R'],['Measurement system analysis (MSA)','RRS*R'],
  ['Dimensional results (first article)','RSS*R'],['Material and performance test results','RSS*R'],['Initial process studies (capability)','RRS*R'],
  ['Qualified laboratory documentation','RSS*R'],['Appearance approval report','SSS*R'],['Sample production parts','RSS*R'],['Master sample','RRR*R'],
  ['Checking aids','RRR*R'],['Customer-specific requirements','RRS*R'],['Part submission warrant (PSW)','SSSSR']],
 extra:['Supplier process audit','Certificate of conformance or analysis (CoC, CoA)','Run at rate (significant production run)','Production readiness review'],
 code:function(name,lv){ var k=String(name||'').trim().toLowerCase(), L=parseInt(lv,10); if(!(L>=1&&L<=5)) L=3;
  for(var i=0;i<this.std.length;i++) if(this.std[i][0].toLowerCase()===k) return this.std[i][1].charAt(L-1);
  return 'P'; },
 lvl:function(S){ var m=String(S.f.lvl||'').match(/^Level (\d)/); return m?+m[1]:3; },
 cap:function(v){ return isNaN(v)?'':v>1.67?'ok':v>=1.33?'mid':'bad'; },
 grr:function(v){ return isNaN(v)?'':v<10?'ok':v<=30?'mid':'bad'; }
},
sections:[
 {type:'fields',title:'Part and submission',cols:3,hint:'A qualification plan lists everything the supplier and your team must show before the part, process or service is approved for production, who owns each item and when it is due. For automotive-style parts it follows the production part approval process (PPAP); the submission level says what is sent to the customer and what is kept on file.',fields:[
  {id:'pn',label:'Part number and revision'},
  {id:'pname',label:'Part or service name'},
  {id:'sup',label:'Supplier and site'},
  {id:'kind',label:'What is being qualified',type:'select',opts:['Part (PPAP)','Process','Service (calibration, laboratory, software, design)']},
  {id:'why',label:'Reason for submission',type:'select',opts:['New part or new supplier','Engineering change','Tooling transfer, replacement or refurbishment','Change of material or sub-tier source','Process or method change','Production moved to another site','Tooling inactive 12 months or more','Correction of a discrepancy']},
  {id:'lvl',label:'Submission level',type:'select',opts:['Level 1: warrant only (and appearance report)','Level 2: warrant, samples and limited data','Level 3: warrant, samples and complete data','Level 4: warrant and what the customer defines','Level 5: warrant, samples and complete data reviewed on site']},
  {id:'due',label:'PSW due to the customer',type:'date'},
  {id:'own',label:'Plan owner'},
  {id:'sqe',label:'Customer contact (approver)'}]},
 {type:'custom',id:'std',cls:'noprint',title:'Start from the standard elements',hint:'Fills the table with the 18 PPAP elements and the extra items a qualification plan usually adds. Rows you have already written are kept.',html:'<div class="pillrow"><button type="button" class="dg-btn pq-load">Add the 18 PPAP elements</button><button type="button" class="dg-btn ghost pq-extra">Add audit, CoC/CoA, run at rate and readiness review</button></div>',
  init:function(el,api){ var H=window.TOOL.h, S=api.state();
   function add(list){ var have=S.g.e.map(function(r){return String(r.el||'').trim().toLowerCase();}); S.g.e=S.g.e.filter(function(r){return r.el||r.st||r.who;});
    list.forEach(function(nm){ if(have.indexOf(nm.toLowerCase())<0) S.g.e.push({el:nm,req:'Required',st:'Not started'}); }); api.save(); api.rerender(); }
   el.querySelector('.pq-load').onclick=function(){ add(H.std.map(function(x){return x[0];})); };
   el.querySelector('.pq-extra').onclick=function(){ add(H.extra); }; }},
 {type:'grid',id:'e',title:'Qualification elements',rows:4,hint:'The level column comes from the AIAG PPAP table for the level chosen above: <b>S</b> submit to the customer and keep a copy, <b>R</b> keep on file and show on request, <b>*</b> keep, and submit if the customer asks, <b>P</b> an item of your own plan. Mark an element Not applicable only when it truly does not apply (no appearance item, no design responsibility), and say why in the evidence column.',cols:[
  {id:'el',label:'Element',w:210,type:'textarea',rows:1},
  {id:'lv',label:'At level',calc:function(r,api){ if(!r.el) return ''; var H=window.TOOL.h; return H.code(r.el,H.lvl(api.state())); }},
  {id:'req',label:'Required',type:'select',opts:['Required','Not applicable','Waived by customer']},
  {id:'st',label:'Status',type:'select',opts:['Not started','In progress','Complete, awaiting review','Accepted','Rejected, rework']},
  {id:'who',label:'Owner',w:110},
  {id:'due',label:'Due',type:'date'},
  {id:'ref',label:'Evidence, result or reason',w:220,type:'textarea',rows:1}]},
 {type:'grid',id:'k',title:'Special characteristics: measurement system and capability',rows:3,hint:'One row per critical or significant characteristic. PPAP acceptance for initial process studies: Ppk above 1.67 meets the criteria; 1.33 to 1.67 may be acceptable, ask the customer; below 1.33 does not, so a corrective action plan and 100% inspection are needed. Gauge R&amp;R as % of tolerance or process variation: under 10% acceptable, 10% to 30% may be acceptable, over 30% not acceptable.',cols:[
  {id:'c',label:'Characteristic',w:170,type:'textarea',rows:1},
  {id:'cl',label:'Class',type:'select',opts:['Critical','Significant','Other']},
  {id:'grr',label:'%GRR',type:'number',min:0},
  {id:'n',label:'Readings',type:'number',min:0},
  {id:'ppk',label:'Ppk',type:'number',min:0,tip:'Use Cpk if the process has a long history'},
  {id:'v',label:'Result',calc:function(r,api){ var H=window.TOOL.h, g=H.grr(api.num(r.grr)), p=H.cap(api.num(r.ppk)); if(!r.c) return ''; var t={ok:'Meets',mid:'Ask customer',bad:'Does not meet','':'—'};
   return '<span class="pq-'+(g||'x')+'">MSA '+t[g]+'</span><br><span class="pq-'+(p||'x')+'">Ppk '+t[p]+'</span>'; }}]},
 {type:'fields',title:'Run at rate',cols:3,hint:'The significant production run proves the process makes good parts at the quoted rate, with production tooling, gauges, people and materials. PPAP\'s default is one to eight hours of production and at least 300 consecutive parts, unless the customer agrees otherwise.',fields:[
  {id:'dreq',label:'Customer demand, parts per day',type:'number',min:0},
  {id:'hpd',label:'Planned production hours per day',type:'number',min:0},
  {id:'rq',label:'Parts made in the run',type:'number',min:0},
  {id:'rg',label:'Good parts in the run',type:'number',min:0},
  {id:'rh',label:'Run duration, hours',type:'number',min:0},
  {id:'rd',label:'Run date',type:'date'}]},
 {type:'custom',id:'sum',title:'Readiness summary',html:'<div class="stat pq-stat"></div><div class="svgw pq-tiles"></div><div class="stat pq-rar"></div><div class="out pq-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), n=api.num, esc=api.esc, f=[], L=H.lvl(S), today=api.today();
 var E=S.g.e.filter(function(r){return r.el;}), Rq=E.filter(function(r){return (r.req||'Required')==='Required';});
 var cnt={}; ['Not started','In progress','Complete, awaiting review','Accepted','Rejected, rework'].forEach(function(k){cnt[k]=0;});
 Rq.forEach(function(r){ cnt[r.st||'Not started']++; });
 var acc=cnt['Accepted'], pct=Rq.length?acc/Rq.length*100:NaN;
 var od=Rq.filter(function(r){return r.due&&r.due<today&&r.st!=='Accepted'&&r.st!=='Complete, awaiting review';});
 var psw=Rq.filter(function(r){return H.code(r.el,L)!=='P'&&/part submission warrant|\bpsw\b/i.test(r.el);})[0];
 var rest=Rq.filter(function(r){return r!==psw;}), open=rest.filter(function(r){return r.st!=='Accepted';});
 root.querySelector('.pq-stat').innerHTML='<div><b>'+Rq.length+'</b><span>Required elements</span></div><div><b>'+acc+' ('+(isNaN(pct)?'—':pct.toFixed(0)+'%')+')</b><span>Accepted</span></div><div><b>'+cnt['Complete, awaiting review']+'</b><span>Awaiting review</span></div><div><b>'+(cnt['In progress']+cnt['Not started'])+'</b><span>Open or not started</span></div><div><b>'+cnt['Rejected, rework']+'</b><span>Rejected, rework</span></div><div><b>'+od.length+'</b><span>Past due</span></div>';
 /* tiles */
 var col={'Not started':['#fff','#B9C0C6','#4A5D71'],'In progress':['#FBF3DC','#D8B147','#16273A'],'Complete, awaiting review':['#E4ECF4','#0F3E68','#0F3E68'],'Accepted':['#DDF0E4','#1F8C55','#16273A'],'Rejected, rework':['#FDECEA','#C0392B','#C0392B']};
 if(E.length){
  var per=6, tw=104, th=50, gap=4, Wd=per*(tw+gap)+8, rows=Math.ceil(E.length/per), Hh=rows*(th+gap)+44;
  var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Status of each element"><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.c{font:700 9px \'IBM Plex Mono\',monospace}.lg{font:700 8.5px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  E.forEach(function(r,i){ var x=4+(i%per)*(tw+gap), y=4+Math.floor(i/per)*(th+gap), na=(r.req||'Required')!=='Required', c=na?['#F3F5F7','#E3E7EB','#9AA6B2']:col[r.st||'Not started'], code=H.code(r.el,L);
   var words=String(r.el).replace(/\s*\(.*\)\s*/,' ').trim().split(/\s+/), l1='', l2='';
   words.forEach(function(w){ if((l1+' '+w).trim().length<=17&&!l2) l1=(l1+' '+w).trim(); else l2=(l2+' '+w).trim(); }); if(l2.length>17) l2=l2.slice(0,16)+'…';
   g+='<rect x="'+x+'" y="'+y+'" width="'+tw+'" height="'+th+'" rx="3" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.6"'+(na?' stroke-dasharray="3 3"':'')+'/><text class="c" x="'+(x+6)+'" y="'+(y+13)+'" style="fill:'+c[2]+'">'+(i+1)+'</text><text class="c" x="'+(x+tw-6)+'" y="'+(y+13)+'" text-anchor="end" style="fill:'+c[2]+'">'+(na?'N/A':code)+'</text><text x="'+(x+6)+'" y="'+(y+29)+'"'+(na?' style="fill:#9AA6B2"':'')+'>'+esc(l1)+'</text><text x="'+(x+6)+'" y="'+(y+42)+'"'+(na?' style="fill:#9AA6B2"':'')+'>'+esc(l2)+'</text>'; });
  var lx=4, ly=Hh-14; Object.keys(col).forEach(function(k){ g+='<rect x="'+lx+'" y="'+(ly-8)+'" width="10" height="10" fill="'+col[k][0]+'" stroke="'+col[k][1]+'" stroke-width="1.6"/><text class="lg" x="'+(lx+14)+'" y="'+ly+'">'+k.toUpperCase()+'</text>'; lx+=k.length*5.6+30; });
  root.querySelector('.pq-tiles').innerHTML=g+'</svg>';
 } else root.querySelector('.pq-tiles').innerHTML='';
 /* run at rate */
 var dreq=n(S.f.dreq), hpd=n(S.f.hpd), rq=n(S.f.rq), rg=n(S.f.rg), rh=n(S.f.rh), need=dreq/hpd, dem=rg/rh, ratio=dem/need, fpy=rg/rq, rarOK=null;
 var okn=function(x){return isFinite(x)&&!isNaN(x);};
 root.querySelector('.pq-rar').innerHTML='<div><b>'+(okn(need)?api.fmt(need,1):'—')+'</b><span>Required rate, parts per hour</span></div><div><b>'+(okn(dem)?api.fmt(dem,1):'—')+'</b><span>Demonstrated rate, good parts per hour</span></div><div><b>'+(okn(ratio)?(ratio*100).toFixed(0)+'%':'—')+'</b><span>Demonstrated ÷ required</span></div><div><b>'+(okn(fpy)?(fpy*100).toFixed(1)+'%':'—')+'</b><span>Good parts in the run</span></div><div><b>'+(okn(dem)&&okn(hpd)?api.fmt(dem*hpd,0):'—')+'</b><span>Demonstrated parts per day</span></div>';
 if(okn(ratio)){ rarOK=ratio>=1;
  f.push([rarOK?'ok':'warn','Run at rate: '+api.fmt(rg)+' good parts in '+api.fmt(rh)+' h = '+api.fmt(dem,1)+' per hour, against '+api.fmt(dreq)+' ÷ '+api.fmt(hpd)+' h = '+api.fmt(need,1)+' per hour needed ('+(ratio*100).toFixed(0)+'%).'+(rarOK?'':' The process cannot yet meet demand in the planned hours: add hours or shifts, cut downtime and setup, or raise yield, and run again.')]); }
 else if(S.f.rq||S.f.rh) f.push(['warn','Run at rate: enter demand, planned hours, good parts and run hours to compare the demonstrated rate with the rate needed.']);
 if(okn(rq)&&okn(rg)&&rg>rq) f.push(['warn','More good parts than parts made. Check the run figures.']);
 if(okn(rq)&&rq<300) f.push(['warn','The run made '+api.fmt(rq)+' parts. PPAP\'s default significant production run is at least 300 consecutive parts; get the customer\'s agreement to a smaller run in writing.']);
 if(okn(rh)&&(rh<1||rh>8)) f.push(['','The run lasted '+api.fmt(rh)+' hours. PPAP\'s default is one to eight hours of production unless the customer specifies otherwise.']);
 if(okn(fpy)&&fpy<0.98) f.push(['warn','Only '+(fpy*100).toFixed(1)+'% of the run was good. The rate counts good parts only; investigate the losses before the PSW is signed.']);
 /* capability and MSA */
 var K=S.g.k.filter(function(r){return r.c;}), capBad=[], capMid=[], grrBad=[], grrMid=[], kMiss=[];
 K.forEach(function(r){ var p=H.cap(n(r.ppk)), g=H.grr(n(r.grr)), nm=esc(r.c); if(!p||!g) kMiss.push(nm); if(p==='bad') capBad.push(nm+' (Ppk '+r.ppk+')'); if(p==='mid') capMid.push(nm+' (Ppk '+r.ppk+')'); if(g==='bad') grrBad.push(nm+' ('+r.grr+'% GRR)'); if(g==='mid') grrMid.push(nm+' ('+r.grr+'% GRR)');
  var rd=n(r.n); if(!isNaN(rd)&&rd<100) f.push(['','<b>'+nm+'</b>: '+rd+' readings. Initial process studies normally use at least 100 readings (for example 25 subgroups of 4); with fewer, agree the plan with the customer.']); });
 if(grrBad.length) f.push(['warn','Measurement system not acceptable (over 30% GRR): '+grrBad.join(', ')+'. Fix the gauge before trusting the capability figure for it.']);
 if(capBad.length) f.push(['warn','Ppk below 1.33: '+capBad.join(', ')+'. This does not meet PPAP acceptance; submit a corrective action plan and contain with 100% inspection or another control the customer accepts.']);
 if(capMid.length||grrMid.length) f.push(['','May be acceptable, needs the customer\'s agreement: '+capMid.concat(grrMid).join(', ')+'.']);
 if(kMiss.length) f.push(['warn','Capability or MSA result missing for: '+kMiss.join(', ')+'.']);
 if(!K.length&&L>=2) f.push(['warn','No special characteristics listed. Capability and MSA results are expected for every critical and significant characteristic.']);
 /* elements */
 var subm=Rq.filter(function(r){return H.code(r.el,L)==='S'&&r.st!=='Accepted';});
 if(subm.length) f.push(['','At level '+L+', '+subm.length+' element'+(subm.length>1?'s':'')+' to be submitted '+(subm.length>1?'are':'is')+' not accepted yet: '+subm.map(function(r){return esc(r.el);}).join(', ')+'.']);
 if(cnt['Rejected, rework']) f.push(['warn','Rejected and in rework: '+Rq.filter(function(r){return r.st==='Rejected, rework';}).map(function(r){return '<b>'+esc(r.el)+'</b>';}).join(', ')+'. Agree the fix and a new date with the owner.']);
 if(od.length) f.push(['warn','Past due: '+od.map(function(r){return esc(r.el)+' ('+esc(r.due)+')';}).join(', ')+'.']);
 var noOwn=Rq.filter(function(r){return !r.who&&r.st!=='Accepted';}); if(noOwn.length) f.push(['warn','No owner for: '+noOwn.map(function(r){return esc(r.el);}).join(', ')+'.']);
 var naNo=E.filter(function(r){return r.req&&r.req!=='Required'&&!r.ref;}); if(naNo.length) f.push(['warn','Not applicable or waived without a reason: '+naNo.map(function(r){return esc(r.el);}).join(', ')+'. Record why, and for a waiver who agreed it.']);
 if(S.f.due&&S.f.due<today&&!(psw&&psw.st==='Accepted')) f.push(['warn','The PSW due date ('+esc(S.f.due)+') has passed.']);
 var late=Rq.filter(function(r){return r!==psw&&r.due&&S.f.due&&r.due>S.f.due;}); if(late.length) f.push(['warn','Due after the PSW date: '+late.map(function(r){return esc(r.el);}).join(', ')+'. The warrant can only be signed when they are done.']);
 var stdN=E.filter(function(r){return H.code(r.el,L)!=='P';}).length; if((S.f.kind||'').indexOf('Part')===0&&stdN&&stdN<18) f.push(['','The table has '+stdN+' of the 18 standard PPAP elements. Use the button above to add the rest, and mark those that do not apply.']);
 if(S.f.kind&&S.f.kind.indexOf('Service')===0) f.push(['','For a service (calibration, testing, software, design), the qualification usually rests on a provider audit, accreditation (for example ISO/IEC 17025 for a laboratory), a trial job checked against a known result, and the agreed service levels, rather than parts and capability studies.']);
 /* verdict */
 var block=[]; if(open.length) block.push(open.length+' element'+(open.length>1?'s':'')+' not accepted');
 if(capBad.length) block.push('capability below 1.33'); if(grrBad.length) block.push('a measurement system over 30%'); if(rarOK===false) block.push('run at rate below demand'); if(rarOK===null) block.push('no run-at-rate result');
 if(Rq.length) f.unshift(block.length?['warn','<b>Not ready to sign the part submission warrant:</b> '+block.join('; ')+'.']:['ok','<b>Ready to sign the part submission warrant.</b> Every required element is accepted, capability and measurement results meet the criteria, and the run at rate meets demand.'+(capMid.length||grrMid.length?' Get the customer\'s written agreement on the results marked "Ask customer".':'')]);
 root.querySelector('.pq-out').innerHTML=api.flags(f,'Add the elements of the plan and the checks appear here.');
},
example:{f:{pn:'HB-3310 rev C',pname:'Pump housing, die-cast and machined',sup:'Kestrel Diecast, plant 2',kind:'Part (PPAP)',why:'New part or new supplier',lvl:'Level 3: warrant, samples and complete data',due:'2026-11-13',own:'Supplier quality engineer',sqe:'Customer SQE, Vantrell Fluid Systems',
  dreq:'1400',hpd:'15',rq:'720',rg:'708',rh:'7.5',rd:'2026-10-06'},
 g:{e:[{el:'Design records',req:'Required',st:'Accepted',who:'Design engineer',due:'2026-09-12',ref:'Drawing HB-3310 rev C, ballooned'},
  {el:'Engineering change documents',req:'Not applicable',st:'',who:'',due:'',ref:'New part, no changes since release'},
  {el:'Customer engineering approval',req:'Waived by customer',st:'',who:'',due:'',ref:'Customer SQE waived by e-mail, 2026-09-03'},
  {el:'Design FMEA',req:'Not applicable',st:'',who:'',due:'',ref:'Supplier is not design-responsible; build to print'},
  {el:'Process flow diagram',req:'Required',st:'Accepted',who:'Supplier ME',due:'2026-09-19',ref:'PFD-3310 rev B'},
  {el:'Process FMEA',req:'Required',st:'Accepted',who:'Supplier ME',due:'2026-09-26',ref:'PFMEA-3310 rev B, linked to PFD'},
  {el:'Control plan',req:'Required',st:'Complete, awaiting review',who:'Supplier quality',due:'2026-10-03',ref:'Pre-launch control plan CP-3310'},
  {el:'Measurement system analysis (MSA)',req:'Required',st:'In progress',who:'Supplier quality',due:'2026-10-10',ref:'Bore gauge study done; CMM study to repeat'},
  {el:'Dimensional results (first article)',req:'Required',st:'Accepted',who:'Supplier quality',due:'2026-10-03',ref:'Full layout, 6 parts, 1 per cavity'},
  {el:'Material and performance test results',req:'Required',st:'Rejected, rework',who:'Supplier lab',due:'2026-10-07',ref:'Leak test at wrong pressure; retest at 3.5 bar'},
  {el:'Initial process studies (capability)',req:'Required',st:'In progress',who:'Supplier quality',due:'2026-10-24',ref:'See capability table'},
  {el:'Qualified laboratory documentation',req:'Required',st:'Accepted',who:'Supplier lab',due:'2026-09-26',ref:'ISO/IEC 17025 scope covers leak and hardness'},
  {el:'Appearance approval report',req:'Not applicable',st:'',who:'',due:'',ref:'No appearance item on the drawing'},
  {el:'Sample production parts',req:'Required',st:'Not started',who:'Logistics',due:'2026-11-06',ref:'6 parts from the production run'},
  {el:'Master sample',req:'Required',st:'Not started',who:'Supplier quality',due:'2026-11-06',ref:''},
  {el:'Checking aids',req:'Required',st:'In progress',who:'Supplier ME',due:'2026-10-17',ref:'Bore plug gauge certified; position fixture at calibration'},
  {el:'Customer-specific requirements',req:'Required',st:'Complete, awaiting review',who:'Supplier quality',due:'2026-10-17',ref:'Vantrell SQ manual rev 7 checklist'},
  {el:'Part submission warrant (PSW)',req:'Required',st:'Not started',who:'Supplier quality manager',due:'2026-11-13',ref:''},
  {el:'Run at rate (significant production run)',req:'Required',st:'Complete, awaiting review',who:'Supplier production',due:'2026-10-06',ref:'7.5 h run, 720 parts'},
  {el:'Certificate of conformance or analysis (CoC, CoA)',req:'Required',st:'Accepted',who:'Supplier quality',due:'2026-10-03',ref:'Alloy A380 CoA from the ingot supplier'}],
 k:[{c:'Bore Ø 32.000 ±0.015',cl:'Critical',grr:'8.4',n:'125',ppk:'1.82'},
  {c:'Port position 0.10 to datum A-B',cl:'Significant',grr:'17.5',n:'125',ppk:'1.41'},
  {c:'Flange flatness 0.05',cl:'Significant',grr:'34',n:'60',ppk:'1.12'}]}}
}
