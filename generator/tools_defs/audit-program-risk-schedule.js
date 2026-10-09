{
slug:'audit-program-risk-schedule',
sections:[
 {type:'fields',title:'Audit program',cols:3,fields:[
  {id:'org',label:'Organization'},
  {id:'std',label:'Program criteria',ph:'e.g. ISO 9001:2015 and internal procedures'},
  {id:'mgr',label:'Audit program manager'},
  {id:'start',label:'Program year starts',type:'date'},
  {id:'asof',label:'Status as of',type:'date',hint:'Overdue checks use this date.'},
  {id:'hi',label:'High-risk score from',type:'number',min:1,max:27,hint:'Scores at or above this are audited every 6 months.'},
  {id:'lo',label:'Low-risk score up to',type:'number',min:1,max:27,hint:'Scores at or below this are audited every 24 months. Everything between: every 12 months.'}]},
 {type:'grid',id:'aud',title:'Auditor pool',rows:3,hint:'List each auditor with the department they work in, so the tool can check they are not auditing their own work, and the audit days they can give in the program year.',cols:[
  {id:'n',label:'Auditor',w:160},{id:'dept',label:'Home department',w:160},{id:'cap',label:'Days available',type:'number'}]},
 {type:'grid',id:'proc',title:'Processes and areas to audit',rows:4,hint:'Score each 1 (low) to 3 (high). <b>Importance</b>: effect on the customer, safety or compliance. <b>Past results</b>: findings, complaints and performance since the last audit (3 = poor). <b>Change</b>: new people, equipment, methods, sites or requirements (3 = major change). Score = importance × results × change, 1 to 27.',cols:[
  {id:'n',label:'Process or area',w:200},{id:'dept',label:'Department',w:130},
  {id:'imp',label:'Importance',type:'select',opts:['1','2','3']},
  {id:'res',label:'Past results',type:'select',opts:['1','2','3']},
  {id:'chg',label:'Change',type:'select',opts:['1','2','3']},
  {id:'sc',label:'Score',calc:function(r,api){if(!window.APRS)return '';var s=window.APRS.score(r,api);return isNaN(s)?'':'<b>'+s+'</b>';}},
  {id:'fq',label:'Audit every',calc:function(r,api){if(!window.APRS)return '';var m=window.APRS.months(r,api);return m?m+' months':'';}},
  {id:'last',label:'Last audited',type:'date',tip:'Leave blank if never audited'},
  {id:'due',label:'Next due',calc:function(r,api){if(!window.APRS)return '';var d=window.APRS.due(r,api);return d?window.APRS.show(d):'';}},
  {id:'a',label:'Assigned auditor',w:130},
  {id:'d',label:'Days per audit',type:'number'}]},
 {type:'custom',id:'sch',title:'Program schedule for the year',hint:'Each dot is a planned audit. The first one falls in the month the audit is due (or the first month, if it is already due), then repeats at the frequency.',html:'<div class="svgw ap-chart"></div><div class="tgw"><table class="mv ap-load"></table></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out ap-out"></div>'}
],
update:function(root,api){
 var A=window.APRS||(window.APRS={});
 A.score=function(r,api){var a=+r.imp,b=+r.res,c=+r.chg;return a&&b&&c?a*b*c:NaN;};
 A.months=function(r,api){var S=api.state(),s=A.score(r,api),hi=api.num(S.f.hi),lo=api.num(S.f.lo);if(isNaN(s))return 0;if(isNaN(hi))hi=12;if(isNaN(lo))lo=3;return s>=hi?6:(s<=lo?24:12);};
 A.add=function(ds,m){var p=ds.split('-');var y=+p[0],mo=+p[1]-1+m,d=+p[2];y+=Math.floor(mo/12);mo=((mo%12)+12)%12;var dim=new Date(y,mo+1,0).getDate();if(d>dim)d=dim;return y+'-'+(mo<9?'0':'')+(mo+1)+'-'+(d<10?'0':'')+d;};
 A.due=function(r,api){var S=api.state(),m=A.months(r,api);if(!m)return '';if(!r.last)return S.f.asof||S.f.start||'';return A.add(r.last,m);};
 A.show=function(d){var p=d.split('-');return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+p[1]-1]+' '+p[0];};
 var S=api.state(), F=S.f, esc=api.esc, f=[], MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 /* engine computes calc columns before update on first render; recompute now that helpers exist */
 var trs=root.querySelectorAll('table[data-grid="proc"] tbody tr');
 S.g.proc.forEach(function(r,i){ if(!trs[i])return; var s=A.score(r,api),m=A.months(r,api),d=A.due(r,api);
  var a=trs[i].querySelector('[data-c="sc"]'),b=trs[i].querySelector('[data-c="fq"]'),c=trs[i].querySelector('[data-c="due"]');
  if(a)a.innerHTML=isNaN(s)?'':'<b>'+s+'</b>'; if(b)b.textContent=m?m+' months':''; if(c)c.textContent=d?A.show(d):''; });
 var P=S.g.proc.filter(function(r){return r.n;}), chart=root.querySelector('.ap-chart'), lt=root.querySelector('.ap-load'), out=root.querySelector('.ap-out');
 if(!P.length){ chart.innerHTML=''; lt.innerHTML=''; out.innerHTML=api.flags([],'Add the processes or areas in the audit program, score them, and the schedule and checks appear here.'); return; }
 var st=/^\d{4}-\d\d-\d\d$/.test(F.start||'')?F.start:'', sy=st?+st.slice(0,4):0, sm=st?+st.slice(5,7)-1:0;
 var rows=P.map(function(r){ var s=A.score(r,api), m=A.months(r,api), d=A.due(r,api), plan=[];
  if(st&&m&&d){ var k=(+d.slice(0,4)-sy)*12+(+d.slice(5,7)-1-sm); if(k<0)k=0; for(;k<12;k+=m) plan.push(k); }
  return {r:r,s:s,m:m,d:d,plan:plan,days:api.num(r.d)}; });
 /* chart */
 if(st){
  var W=820, L=270, cw=(W-L-10)/12, rh=26, H=40+rows.length*rh+8;
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Audit schedule by month"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.m{font:600 11px Archivo,sans-serif;fill:#4A5D71}</style>';
  for(var c=0;c<12;c++){ var mi=(sm+c)%12; g+='<rect x="'+(L+c*cw)+'" y="8" width="'+cw+'" height="'+(H-16)+'" fill="'+(c%2?'#FFFFFF':'#EDEFEA')+'"/><text class="m" x="'+(L+c*cw+cw/2)+'" y="26" text-anchor="middle">'+MN[mi]+'</text>'; }
  rows.forEach(function(o,i){ var y=40+i*rh, lab=o.r.n.length>34?o.r.n.slice(0,33)+'…':o.r.n, col=o.m===6?'#C0392B':(o.m===24?'#7C8B99':'#0F3E68');
   g+='<line x1="8" x2="'+(W-8)+'" y1="'+(y+rh-2)+'" y2="'+(y+rh-2)+'" stroke="#DDE1E4"/><text x="'+(L-36)+'" y="'+(y+16)+'" text-anchor="end">'+esc(lab)+'</text>';
   g+='<text class="m" x="'+(L-8)+'" y="'+(y+16)+'" text-anchor="end">'+(isNaN(o.s)?'':o.s)+'</text>';
   o.plan.forEach(function(k){ g+='<circle cx="'+(L+k*cw+cw/2)+'" cy="'+(y+12)+'" r="7" fill="'+col+'"/>'; }); });
  g+='</svg>';
  chart.innerHTML=g+'<p class="ap-key"><span style="background:#C0392B"></span>every 6 months <span style="background:#0F3E68"></span>every 12 months <span style="background:#7C8B99"></span>every 24 months</p>';
 } else chart.innerHTML='<p class="th" style="padding:10px">Enter the date the program year starts to see the schedule.</p>';
 /* auditor workload */
 var AU=S.g.aud.filter(function(a){return a.n;}), load={};
 AU.forEach(function(a){ load[a.n.trim().toLowerCase()]={a:a,days:0,n:0}; });
 var unknown=[];
 rows.forEach(function(o){ var k=(o.r.a||'').trim().toLowerCase(); if(!k)return; if(!load[k]){ if(unknown.indexOf(o.r.a)<0)unknown.push(o.r.a); return; } load[k].n+=o.plan.length; load[k].days+=o.plan.length*(isNaN(o.days)?0:o.days); });
 if(AU.length){
  lt.innerHTML='<thead><tr><th>Auditor</th><th>Audits</th><th>Days planned</th><th>Days available</th><th>Use</th></tr></thead><tbody>'+AU.map(function(a){ var L=load[a.n.trim().toLowerCase()], cap=api.num(a.cap); return '<tr><td class="mo">'+esc(a.n)+'</td><td>'+L.n+'</td><td class="mt">'+api.fmt(L.days,1)+'</td><td>'+(isNaN(cap)?'—':api.fmt(cap,1))+'</td><td class="mu">'+(cap>0?Math.round(L.days/cap*100)+'%':'—')+'</td></tr>'; }).join('')+'</tbody>';
 } else lt.innerHTML='';
 /* checks */
 var tot=rows.reduce(function(a,o){return a+o.plan.length;},0), td=rows.reduce(function(a,o){return a+o.plan.length*(isNaN(o.days)?0:o.days);},0);
 var nh=rows.filter(function(o){return o.m===6;}).length, nl=rows.filter(function(o){return o.m===24;}).length;
 if(st) f.push(['ok','<b>'+tot+' audits</b> planned in the program year, <b>'+api.fmt(td,1)+' auditor-days</b>. '+nh+' high-risk area'+(nh===1?'':'s')+' audited twice, '+nl+' low-risk area'+(nl===1?'':'s')+' on a two-year cycle.']);
 var unsc=rows.filter(function(o){return isNaN(o.s);}); if(unsc.length) f.push(['warn','Not scored yet, so not scheduled: '+unsc.map(function(o){return esc(o.r.n);}).join(', ')+'.']);
 var asof=F.asof||'';
 if(asof){ var od=rows.filter(function(o){return o.r.last&&o.d&&o.d<asof;}); if(od.length) f.push(['warn','Overdue as of '+A.show(asof)+': '+od.map(function(o){return esc(o.r.n)+' (due '+A.show(o.d)+')';}).join(', ')+'. Schedule these first and record why they slipped; a slipping high-risk audit is itself a program finding.']); }
 var nv=rows.filter(function(o){return !o.r.last&&!isNaN(o.s);}); if(nv.length) f.push(['warn','Never audited: '+nv.map(function(o){return esc(o.r.n);}).join(', ')+'. Treated as due now.']);
 var off=rows.filter(function(o){return st&&o.m&&!o.plan.length;}); if(off.length) f.push(['','Not audited this program year (next due later): '+off.map(function(o){return esc(o.r.n)+' ('+A.show(o.d)+')';}).join(', ')+'. Confirm the program still covers every process within the cycle you have set.']);
 var na=rows.filter(function(o){return o.plan.length&&!o.r.a;}); if(na.length) f.push(['warn','Scheduled with no auditor assigned: '+na.map(function(o){return esc(o.r.n);}).join(', ')+'.']);
 if(unknown.length) f.push(['warn','Assigned to someone not in the auditor pool: '+unknown.map(esc).join(', ')+'.']);
 var own=[]; rows.forEach(function(o){ var k=(o.r.a||'').trim().toLowerCase(), L=load[k]; if(L&&L.a.dept&&o.r.dept&&L.a.dept.trim().toLowerCase()===o.r.dept.trim().toLowerCase()) own.push(esc(o.r.a)+' on '+esc(o.r.n)); });
 if(own.length) f.push(['warn','Auditor from the same department as the area audited: '+own.join('; ')+'. ISO 9001 (9.2.2 c) asks for auditors chosen so the audit is objective and impartial; ISO 19011 adds that auditors should, wherever practicable, be independent of the activity audited. Reassign or record the justification.']);
 AU.forEach(function(a){ var L=load[a.n.trim().toLowerCase()], cap=api.num(a.cap); if(cap>0&&L.days>cap) f.push(['warn',esc(a.n)+' is planned for '+api.fmt(L.days,1)+' days against '+api.fmt(cap,1)+' available. Rebalance, add auditors, or agree the release time with their manager now.']); });
 var nd=rows.filter(function(o){return o.plan.length&&isNaN(o.days);}); if(nd.length) f.push(['warn','No audit duration for: '+nd.map(function(o){return esc(o.r.n);}).join(', ')+'. Workload is understated.']);
 f.push(['','ISO 9001 clause 9.2.2 a) asks the program to take into account the importance of the processes, changes affecting the organization, and the results of previous audits. Those are the three scores here. Review the scores at least once a year and after any major change, complaint trend or failed audit.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Harrow Bend Regional Medical Center',std:'ISO 9001:2015, hospital policies and accreditation standards',mgr:'Director of Quality',start:'2027-01-01',asof:'2026-12-01',hi:'12',lo:'3'},
 g:{aud:[{n:'R. Okafor',dept:'Quality',cap:'12'},{n:'J. Patel',dept:'Pharmacy',cap:'4'},{n:'M. Chen',dept:'Surgical services',cap:'8'},{n:'L. Brooks',dept:'Facilities',cap:'6'}],
 proc:[{n:'Medication management',dept:'Pharmacy',imp:'3',res:'3',chg:'2',last:'2026-05-14',a:'M. Chen',d:'2'},
  {n:'Surgical services',dept:'Surgical services',imp:'3',res:'2',chg:'3',last:'2026-08-20',a:'J. Patel',d:'2'},
  {n:'Emergency department',dept:'Emergency',imp:'3',res:'2',chg:'2',last:'2026-09-10',a:'R. Okafor',d:'1.5'},
  {n:'Infection prevention',dept:'Quality',imp:'3',res:'1',chg:'2',last:'2026-04-02',a:'R. Okafor',d:'1'},
  {n:'Laboratory services',dept:'Laboratory',imp:'2',res:'2',chg:'1',last:'2026-06-15',a:'L. Brooks',d:'1'},
  {n:'Patient registration and billing',dept:'Revenue cycle',imp:'2',res:'1',chg:'2',last:'2026-10-05',a:'M. Chen',d:'1'},
  {n:'Purchasing and supplier control',dept:'Supply chain',imp:'2',res:'2',chg:'2',last:'2026-03-18',a:'J. Patel',d:'1'},
  {n:'Facilities and biomedical equipment',dept:'Facilities',imp:'2',res:'1',chg:'1',last:'2025-11-04',a:'L. Brooks',d:'1'},
  {n:'Document and record control',dept:'Quality',imp:'1',res:'1',chg:'1',last:'2026-02-11',a:'J. Patel',d:'0.5'},
  {n:'Training and competence',dept:'Human resources',imp:'2',res:'1',chg:'1',last:'',a:'R. Okafor',d:'1'}]}}
}
