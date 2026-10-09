{
slug:'audit-plan-schedule',
sections:[
 {type:'fields',title:'The audit',cols:3,fields:[
  {id:'num',label:'Audit number'},
  {id:'type',label:'Type of audit',type:'select',opts:['Internal (first party)','Supplier (second party)','Certification (third party)','Combined or integrated']},
  {id:'client',label:'Audit client',hint:'Who asked for the audit and receives the report.'},
  {id:'auditee',label:'Auditee and site'},
  {id:'d1',label:'First day',type:'date'},
  {id:'d2',label:'Last day',type:'date'}]},
 {type:'fields',title:'Objectives, scope and criteria',hint:'Objectives say why the audit is done, scope says where and what (sites, processes, shifts, period), and criteria are the requirements evidence is compared with.',fields:[
  {id:'obj',label:'Objectives',type:'textarea',wide:true},
  {id:'scope',label:'Scope',type:'textarea',wide:true},
  {id:'crit',label:'Criteria',type:'textarea',wide:true},
  {id:'areas',label:'Processes and areas in scope, one per row',type:'datagrid',cols:[{label:'Process or area',type:'text'}],rows:5,minRows:3}]},
 {type:'grid',id:'team',title:'Audit team',rows:3,hint:'Give each member a role. Guides and observers accompany the team but do not audit; a technical expert supports an auditor; an auditor in training works under supervision.',cols:[
  {id:'n',label:'Name',w:150},
  {id:'role',label:'Role',type:'select',opts:['Lead auditor','Auditor','Auditor in training','Technical expert','Observer','Guide']},
  {id:'dept',label:'Home department',w:150},
  {id:'comp',label:'Competence for this audit',w:220,type:'textarea',rows:1}]},
 {type:'grid',id:'tt',title:'Timetable',rows:4,hint:'One row per session. Times as 24-hour HH:MM. In the auditor column, separate names with commas, or write <b>All</b> for the whole team (technical experts and observers included) or <b>All auditors</b> for auditors only.',cols:[
  {id:'day',label:'Day',type:'date'},{id:'from',label:'From',ph:'08:00',w:62},{id:'to',label:'To',ph:'09:00',w:62},
  {id:'act',label:'Activity',w:160,type:'textarea',rows:1},
  {id:'area',label:'Process or area',w:150},
  {id:'cl',label:'Criteria or clauses',w:120},
  {id:'aud',label:'Auditor(s)',w:150},
  {id:'who',label:'Auditee contact',w:110},
  {id:'h',label:'Hours',calc:function(r,api){var a=/^(\d{1,2}):(\d\d)$/.exec((r.from||'').trim()),b=/^(\d{1,2}):(\d\d)$/.exec((r.to||'').trim());if(!a||!b)return '';var h=((+b[1]*60+ +b[2])-(+a[1]*60+ +a[2]))/60;return h>0?h.toFixed(2).replace(/\.?0+$/,''):'<span class="bad">check</span>';}}]},
 {type:'custom',id:'chk',title:'Hours and checks',html:'<div class="tgw"><table class="mv apl-t"></table></div><div class="out apl-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[], lc=function(s){return String(s||'').trim().toLowerCase();};
 var T=S.g.team.filter(function(t){return t.n;}), R=S.g.tt.filter(function(r){return r.act||r.area;}), A=api.lines('areas');
 var tb=root.querySelector('.apl-t'), out=root.querySelector('.apl-out');
 if(!R.length&&!T.length&&!F.obj&&!F.scope){ tb.innerHTML=''; out.innerHTML=api.flags([],'Fill in the objectives, scope, team and timetable, and the checks appear here.'); return; }
 var mins=function(s){var m=/^(\d{1,2}):(\d\d)$/.exec(String(s||'').trim());return m?+m[1]*60+ +m[2]:NaN;};
 var auditors=T.filter(function(t){return /auditor/i.test(t.role||'')||/lead/i.test(t.role||'');});
 var byName={}; T.forEach(function(t){byName[lc(t.n)]=t;});
 var who=function(r){ var s=String(r.aud||'').trim(); if(!s) return []; if(/^(all|team|whole team)$/i.test(s)) return T.map(function(t){return t.n;}); if(/^all auditors$/i.test(s)) return auditors.map(function(t){return t.n;}); return s.split(/\s*(?:,|;|&|\band\b)\s*/).filter(Boolean); };
 var sess=R.map(function(r){ var a=mins(r.from),b=mins(r.to); return {r:r,a:a,b:b,h:(b>a)?(b-a)/60:0,p:who(r),meet:/meeting|briefing|opening|closing/i.test(r.act||'')}; });
 /* hours table */
 var hrs={}; T.forEach(function(t){hrs[lc(t.n)]={t:t,au:0,mt:0};});
 sess.forEach(function(s){ s.p.forEach(function(n){ var k=lc(n); if(hrs[k]){ if(s.meet) hrs[k].mt+=s.h; else hrs[k].au+=s.h; } }); });
 tb.innerHTML=T.length?'<thead><tr><th>Team member</th><th>Role</th><th>Auditing hours</th><th>Meeting hours</th></tr></thead><tbody>'+T.map(function(t){var H=hrs[lc(t.n)];return '<tr><td class="mo">'+esc(t.n)+'</td><td>'+esc(t.role||'—')+'</td><td class="mt">'+api.fmt(H.au,2)+'</td><td>'+api.fmt(H.mt,2)+'</td></tr>';}).join('')+'</tbody>':'';
 var isAud=function(n){ var t=byName[lc(n)]; return !t||!/technical expert|observer|guide/i.test(t.role||''); };
 var tot=sess.filter(function(s){return !s.meet;}).reduce(function(a,s){return a+s.h*Math.max(1,s.p.filter(isAud).length);},0);
 if(R.length) f.push(['ok','<b>'+R.length+' session'+(R.length===1?'':'s')+'</b>, '+api.fmt(tot,1)+' auditor-hours of auditing outside meetings, across '+T.length+' team member'+(T.length===1?'':'s')+'.']);
 var miss=[]; if(!F.obj)miss.push('objectives'); if(!F.scope)miss.push('scope'); if(!F.crit)miss.push('criteria'); var why={objectives:'without objectives the team cannot tell what the audit has to conclude',scope:'without a scope the boundaries (sites, processes, shifts, period) are open to dispute',criteria:'without criteria there is nothing to compare evidence with, so nothing can be called a nonconformity'};
 if(miss.length){ var ws=miss.map(function(m){return why[m];}).join('; '); f.push(['warn','The plan has no '+(miss.length>1?miss.slice(0,-1).join(', ')+' or '+miss[miss.length-1]:miss[0])+'. '+ws.charAt(0).toUpperCase()+ws.slice(1)+'.']); }
 var leads=T.filter(function(t){return t.role==='Lead auditor';}); if(T.length&&leads.length!==1) f.push(['warn',leads.length?'More than one lead auditor. Name one person accountable for the audit.':'No lead auditor named.']);
 var noRole=T.filter(function(t){return !t.role;}); if(noRole.length) f.push(['warn','No role for: '+noRole.map(function(t){return esc(t.n);}).join(', ')+'.']);
 if(R.length){
  var ord=sess.slice().sort(function(x,y){return ((x.r.day||'')+(isNaN(x.a)?'':('000'+x.a).slice(-4)))<((y.r.day||'')+(isNaN(y.a)?'':('000'+y.a).slice(-4)))?-1:1;});
  if(!/opening/i.test(ord[0].r.act||'')) f.push(['warn','The timetable does not start with an opening meeting. It confirms the plan, introduces the team, agrees communication and the closing meeting time with the auditee.']);
  if(!/closing|exit/i.test(ord[ord.length-1].r.act||'')) f.push(['warn','The timetable does not end with a closing meeting, where findings and conclusions are presented to the auditee.']);
  if(!sess.some(function(s){return /team meeting|briefing/i.test(s.r.act||'')&&!/opening|closing/i.test(s.r.act||'');})) f.push(['','No auditor team meeting or daily briefing is scheduled. Plan time to share evidence and agree findings before the closing meeting.']);
 }
 var bad=sess.filter(function(s){return (s.r.from||s.r.to)&&!(s.b>s.a);}); if(bad.length) f.push(['warn',bad.length+' session'+(bad.length>1?'s have':' has')+' a missing or impossible time. Use 24-hour HH:MM, with the end after the start.']);
 var match=function(a,b){a=lc(a);b=lc(b);return a&&b&&(a===b||a.indexOf(b)>=0||b.indexOf(a)>=0);};
 var nonMeet=sess.filter(function(s){return !s.meet;});
 var uncovered=A.filter(function(a){return !nonMeet.some(function(s){return match(a,s.r.area);});});
 if(uncovered.length) f.push(['warn','In scope but not in the timetable: '+uncovered.map(esc).join(', ')+'. Add a session or narrow the scope statement.']);
 var outside=[]; nonMeet.forEach(function(s){ if(s.r.area&&A.length&&!A.some(function(a){return match(a,s.r.area);})&&outside.indexOf(s.r.area)<0) outside.push(s.r.area); });
 if(outside.length) f.push(['warn','In the timetable but not in the scope: '+outside.map(esc).join(', ')+'. Either add it to the scope or drop the session; auditing outside the agreed scope surprises the auditee and the client.']);
 var unk=[]; sess.forEach(function(s){ s.p.forEach(function(n){ if(!byName[lc(n)]&&unk.indexOf(n)<0) unk.push(n); }); }); if(unk.length) f.push(['warn','Named in the timetable but not on the team: '+unk.map(esc).join(', ')+'.']);
 var noAud=nonMeet.filter(function(s){return !s.p.length;}); if(noAud.length) f.push(['warn',noAud.length+' audit session'+(noAud.length>1?'s have':' has')+' no auditor.']);
 var clash=[];
 for(var i=0;i<sess.length;i++) for(var j=i+1;j<sess.length;j++){ var x=sess[i],y=sess[j]; if(x.r.day!==y.r.day||!(x.b>x.a)||!(y.b>y.a)) continue; if(x.a<y.b&&y.a<x.b){ var o1=Math.max(x.a,y.a), o2=Math.min(x.b,y.b), hm=function(m){return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+(m%60)).slice(-2);}; x.p.forEach(function(n){ if(y.p.some(function(m){return lc(m)===lc(n);})) clash.push(esc(n)+' from '+hm(o1)+' to '+hm(o2)+' on '+esc(x.r.day)+' ('+esc(x.r.area||x.r.act)+' and '+esc(y.r.area||y.r.act)+')'); }); } }
 if(clash.length) f.push(['warn','Double-booked: '+clash.join('; ')+'.']);
 var own=[]; nonMeet.forEach(function(s){ s.p.forEach(function(n){ var t=byName[lc(n)]; if(t&&t.dept&&match(t.dept,s.r.area)) own.push(esc(n)+' on '+esc(s.r.area)); }); });
 if(own.length) f.push(['warn','Auditing their own area: '+own.join('; ')+'. Auditors should be independent of the activity they audit; swap the assignment.']);
 var solo=[]; nonMeet.forEach(function(s){ var roles=s.p.map(function(n){var t=byName[lc(n)];return t?t.role:'';}); if(roles.length&&!roles.some(function(r){return r==='Lead auditor'||r==='Auditor';})) solo.push(esc(s.r.area||s.r.act)+' ('+s.p.map(esc).join(', ')+')'); });
 if(solo.length) f.push(['warn','No qualified auditor in: '+solo.join('; ')+'. An auditor in training should be supervised, and a technical expert, observer or guide does not conduct the audit.']);
 f.push(['','ISO 19011:2018 (6.3.2) lists what an audit plan covers: objectives, scope, criteria, dates and places, methods, roles of team members and guides, and allocation of resources. Share the plan with the auditee before the audit and adjust it as the audit progresses.']);
 out.innerHTML=api.flags(f);
},
example:{f:{num:'IA-2027-03',type:'Internal (first party)',client:'Plant manager',auditee:'Harvest Ridge Foods, main bakery',d1:'2027-03-09',d2:'2027-03-10',
 obj:'Determine whether production, sanitation and allergen controls conform to the quality and food safety management system, and whether corrective actions from audit IA-2026-07 are effective.',
 scope:'main bakery, both shifts, receiving through shipping, records from September 2026 to February 2027. Excludes product development and the corporate office.',
 crit:'ISO 9001:2015 clauses 7.1.3, 7.1.5, 8.4, 8.5, 8.6, 8.7 and 10.2; Harvest Ridge food safety plan rev 12; customer requirements CR-2 (allergen labeling).',
 areas:'Receiving and raw material storage\nProduction (mixing and baking)\nAllergen control\nSanitation\nPackaging and labeling\nMaintenance\nWarehouse and shipping\nCalibration'},
 g:{team:[{n:'Dana Ruiz',role:'Lead auditor',dept:'Quality',comp:'Lead auditor trained; 6 years of plant audits'},{n:'Marcus Hale',role:'Auditor',dept:'Maintenance',comp:'Internal auditor trained 2025; equipment background'},{n:'Priya Shah',role:'Auditor in training',dept:'Finance',comp:'Internal auditor course completed January 2027'},{n:'Tom Becker',role:'Technical expert',dept:'Corporate food safety',comp:'Allergen management specialist'}],
 tt:[{day:'2027-03-09',from:'08:00',to:'08:30',act:'Opening meeting',area:'',cl:'',aud:'All',who:'Plant manager, supervisors'},
  {day:'2027-03-09',from:'08:30',to:'10:30',act:'Audit',area:'Receiving and raw material storage',cl:'8.4, 8.5.4',aud:'Marcus Hale',who:'Receiving lead'},
  {day:'2027-03-09',from:'08:30',to:'10:30',act:'Audit',area:'Production (mixing and baking)',cl:'8.5.1, 7.1.5',aud:'Dana Ruiz, Priya Shah',who:'Production supervisor'},
  {day:'2027-03-09',from:'10:45',to:'12:00',act:'Audit',area:'Allergen control',cl:'8.5.1, food safety plan 5',aud:'Dana Ruiz, Tom Becker',who:'Food safety coordinator'},
  {day:'2027-03-09',from:'10:45',to:'12:00',act:'Audit',area:'Sanitation',cl:'8.5.1, SSOP-04',aud:'Marcus Hale',who:'Sanitation lead'},
  {day:'2027-03-09',from:'13:00',to:'15:00',act:'Audit',area:'Packaging and labeling',cl:'8.5.2, 8.6, CR-2',aud:'Marcus Hale, Priya Shah',who:'Packaging supervisor'},
  {day:'2027-03-09',from:'15:00',to:'16:00',act:'Audit',area:'Maintenance',cl:'7.1.3',aud:'Marcus Hale',who:'Maintenance planner'},
  {day:'2027-03-09',from:'16:00',to:'16:30',act:'Auditor team meeting',area:'',cl:'',aud:'All',who:''},
  {day:'2027-03-10',from:'08:00',to:'10:00',act:'Audit',area:'Warehouse and shipping',cl:'8.5.4, 8.6',aud:'Dana Ruiz',who:'Warehouse supervisor'},
  {day:'2027-03-10',from:'08:00',to:'09:30',act:'Records review',area:'Sanitation',cl:'SSOP-04 records',aud:'Priya Shah',who:'Sanitation lead'},
  {day:'2027-03-10',from:'09:30',to:'10:30',act:'Follow-up of IA-2026-07 actions',area:'Allergen control',cl:'10.2',aud:'Dana Ruiz, Tom Becker',who:'Food safety coordinator'},
  {day:'2027-03-10',from:'12:30',to:'13:30',act:'Auditor team meeting: agree findings',area:'',cl:'',aud:'All',who:''},
  {day:'2027-03-10',from:'14:00',to:'14:45',act:'Closing meeting',area:'',cl:'',aud:'All',who:'Plant manager, supervisors'}]}}
}
