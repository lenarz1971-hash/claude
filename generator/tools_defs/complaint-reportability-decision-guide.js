{
slug:'complaint-reportability-decision-guide',
sections:[
 {type:'fields',title:'The complaint',cols:3,hint:'A study aid, not regulatory advice. Real reporting decisions follow your own procedures, the current text of 21 CFR Part 803 and the EU MDR, and your regulatory affairs function.',fields:[
  {id:'id',label:'Complaint number'},
  {id:'recv',label:'Date received',type:'date'},
  {id:'aware',label:'Date the company became aware',type:'date',hint:'The day anyone in the company first had information suggesting a possibly reportable event. The reporting clock starts here.'},
  {id:'dev',label:'Device and model'},
  {id:'lot',label:'Lot or serial number'},
  {id:'src',label:'How it came in',type:'select',opts:['Customer phone call','Email or letter','Sales or field service representative','Service or repair report','Returned product','Distributor','Literature or social media','Other']},
  {id:'desc',label:'What was reported',type:'textarea',wide:true,rows:3},
  {id:'outc',label:'Outcome for the patient or user',type:'textarea',wide:true,rows:2}]},
 {type:'fields',title:'Decision questions',cols:2,hint:'Answer in order. The path through the questions is drawn in section 3.',fields:[
  {id:'cpl',label:'1. Does it allege a deficiency in the identity, quality, durability, reliability, usability, safety or performance of a device after it left your control?',type:'select',opts:['Yes','No','Unsure'],hint:'If yes, it is a complaint, whoever sent it and however it arrived.'},
  {id:'dsi',label:'2. Was there a death or a serious injury?',type:'select',opts:['Death','Serious injury','No','Not known yet'],hint:'Serious injury: life-threatening, permanent impairment of a body function or permanent damage to a body structure, or needing medical or surgical intervention to prevent either.'},
  {id:'cc',label:'3. Does the information reasonably suggest the device may have caused or contributed to it?',type:'select',opts:['Yes','No','Cannot rule out'],hint:'Only for a death or serious injury. "Contributed" includes device failure, malfunction, improper design, labeling or user error related to the device.'},
  {id:'mal',label:'4. Did the device malfunction?',type:'select',opts:['Yes','No','Not known yet'],hint:'It failed to meet its performance specifications or to perform as intended.'},
  {id:'rec',label:'5. If the malfunction happened again, would it be likely to cause or contribute to a death or serious injury?',type:'select',opts:['Yes','No','Unsure']},
  {id:'rem',label:'6. Does the event need remedial action to prevent an unreasonable risk of substantial harm to public health, or has FDA asked in writing for a 5-day report?',type:'select',opts:['No','Yes']},
  {id:'us',label:'Is the device on the US market?',type:'select',opts:['Yes','No']},
  {id:'eu',label:'Is the device on the EU market?',type:'select',opts:['Yes','No']},
  {id:'prev',label:'Has a similar complaint already been investigated, with the justification on file?',type:'select',opts:['No','Yes']}]},
 {type:'custom',id:'path',title:'Decision path',hint:'The path taken is drawn in navy; an open question is outlined in gold.',html:'<div class="svgw cr-svg"></div>'},
 {type:'custom',id:'res',title:'Result',html:'<div class="stat cr-stat"></div>'},
 {type:'fields',title:'Trend: similar complaints',cols:4,hint:'Count complaints with the same failure mode on the same device family, and the units distributed in the same periods.',fields:[
  {id:'n1',label:'Similar complaints, last 12 months',type:'number',min:0},
  {id:'u1',label:'Units distributed, last 12 months',type:'number',min:0},
  {id:'n0',label:'Similar complaints, prior 12 months',type:'number',min:0},
  {id:'u0',label:'Units distributed, prior 12 months',type:'number',min:0}]},
 {type:'custom',id:'tr',title:'Trend result',html:'<div class="stat cr-tr"></div>'},
 {type:'fields',title:'Investigation and decision record',cols:3,fields:[
  {id:'inv',label:'Investigation summary',type:'textarea',wide:true,rows:3},
  {id:'rc',label:'Root cause or most likely cause',type:'textarea',wide:true,rows:2},
  {id:'why',label:'Rationale for the reporting decision',type:'textarea',wide:true,rows:2,hint:'Required when the decision is "not reportable": say which question was answered no, and on what evidence.'},
  {id:'by',label:'Decision made by'},
  {id:'dd',label:'Decision date',type:'date'},
  {id:'rpt',label:'Report number, if filed'},
  {id:'capa',label:'CAPA number, if opened'}]},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out cr-out"></div>'}
],
addDays:function(iso,n,work){ var d=new Date(iso+'T00:00:00Z'); if(isNaN(d)) return ''; var k=0; if(!work){ d.setUTCDate(d.getUTCDate()+n); } else { while(k<n){ d.setUTCDate(d.getUTCDate()+1); var w=d.getUTCDay(); if(w!==0&&w!==6) k++; } } return d.toISOString().slice(0,10); },
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[], T=window.TOOL;
 function fd(v){ if(!v) return '—'; var d=new Date(v+'T00:00:00'); return isNaN(d)?v:d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }
 /* walk the decision path */
 var P={A:1}, Ed={}, open='', out='';
 function go(a,b){ Ed[a+'-'+b]=1; P[b]=1; }
 go('A','D1');
 var cpl=F.cpl||'', isC=cpl==='Yes'||cpl==='Unsure';
 if(!cpl) open='D1';
 else if(cpl==='No'){ go('D1','N1'); out='N1'; }
 else {
  go('D1','D2');
  var dsi=F.dsi||'', d4=false;
  if(!dsi||dsi==='Not known yet') open='D2';
  else if(dsi==='No') { go('D2','D4'); d4=true; }
  else { go('D2','D3');
   if(!F.cc) open='D3';
   else if(F.cc==='No'){ go('D3','D4'); d4=true; }
   else { go('D3','R'); out='R'; } }
  if(d4){
   if(!F.mal||F.mal==='Not known yet') open='D4';
   else if(F.mal==='No'){ go('D4','NR'); out='NR'; }
   else { go('D4','D5'); if(!F.rec) open='D5'; else if(F.rec==='No'){ go('D5','NR'); out='NR'; } else { go('D5','R'); out='R'; } } }
  if(out==='R'){ go('R','D6'); if(F.rem==='Yes'){ go('D6','R5'); out='R5'; } else { go('D6','R30'); out='R30'; } }
 }
 var decided=!!out&&!open;
 /* diagram */
 var Bx={A:[10,10,'Complaint or event received'],D1:[230,10,'Is it a complaint?'],N1:[450,10,'Not a complaint: log it as an inquiry; still trend it'],
  D2:[230,90,'Death or serious injury?'],D3:[450,90,'Device may have caused or contributed?'],D4:[230,170,'Did the device malfunction?'],D5:[450,170,'Likely to cause death or serious injury if it recurred?'],
  R:[670,90,'Reportable event: US MDR, and EU serious incident if on that market'],NR:[10,250,'Not reportable: record the rationale'],D6:[670,250,'Remedial action needed, or FDA asked in writing?'],
  R5:[450,340,'5-work-day report'],R30:[670,340,'30-calendar-day report']};
 var DEC={D1:1,D2:1,D3:1,D4:1,D5:1,D6:1}, BW0=200, BH=56;
 var L=[['A','D1','','M210 38 H228',0,0],['D1','N1','No','M430 38 H448',433,32],['D1','D2','Yes','M330 66 V88',336,81],['D2','D3','Yes','M430 118 H448',433,112],['D2','D4','No','M330 146 V168',336,161],
  ['D3','R','Yes','M650 118 H668',652,112],['D3','D4','No','M550 146 V158 H390 V168',556,158],['D4','D5','Yes','M430 198 H448',433,192],['D4','NR','No','M330 226 V278 H212',336,244],['D5','R','Yes','M650 198 H660 V136 H668',665,196],
  ['D5','NR','No','M550 226 V300 H212',556,244],['R','D6','','M770 146 V248',0,0],['D6','R5','Yes','M670 278 H600 V338',634,272],['D6','R30','No','M770 306 V338',776,326]];
 var g='<svg viewBox="0 0 880 476" role="img" aria-label="Complaint reportability decision path"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.y{font:700 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.on{fill:#fff}.k{font:700 11px \'IBM Plex Mono\',monospace;fill:#0F3E68;letter-spacing:.05em}</style><defs><marker id="crA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#B8C2CC"/></marker><marker id="crB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0F3E68"/></marker></defs>';
 L.forEach(function(l){ var on=Ed[l[0]+'-'+l[1]];
  g+='<path d="'+l[3]+'" fill="none" stroke="'+(on?'#0F3E68':'#B8C2CC')+'" stroke-width="'+(on?2.4:1.2)+'" marker-end="url(#'+(on?'crB':'crA')+')"/>'+(l[2]?'<text class="y" x="'+l[4]+'" y="'+l[5]+'">'+l[2].toUpperCase()+'</text>':''); });
 function wrap(s,cx,cy,max,cls){ var w=s.split(' '), Ls=[], c=''; w.forEach(function(x){ if((c+' '+x).trim().length>max&&c){ Ls.push(c); c=x; } else c=(c+' '+x).trim(); }); if(c) Ls.push(c); var y0=cy-(Ls.length-1)*7+4; return Ls.map(function(t,i){ return '<text'+(cls?' class="'+cls+'"':'')+' x="'+cx+'" y="'+(y0+i*14)+'" text-anchor="middle">'+esc(t)+'</text>'; }).join(''); }
 Object.keys(Bx).forEach(function(k){ var b=Bx[k], on=P[k], end=(k==='R'||k==='R5'||k==='R30'), fill, stroke='#8795A3', sw=1.2, tc='';
  if(on){ fill=end?'#C0392B':(k==='NR'||k==='N1')?'#1E7B4F':'#0F3E68'; stroke=fill; tc='on'; } else fill='#fff';
  if(k===open){ fill='#FBF3DC'; stroke='#9C7C1F'; sw=2.6; tc=''; }
  var cx=b[0]+BW0/2, cy=b[1]+BH/2;
  if(DEC[k]) g+='<path d="M'+(b[0]+14)+' '+b[1]+' H'+(b[0]+BW0-14)+' L'+(b[0]+BW0)+' '+cy+' L'+(b[0]+BW0-14)+' '+(b[1]+BH)+' H'+(b[0]+14)+' L'+b[0]+' '+cy+' Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  else g+='<rect x="'+b[0]+'" y="'+b[1]+'" width="'+BW0+'" height="'+BH+'" rx="'+(k==='A'?28:4)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  g+=wrap(b[2],cx,cy,DEC[k]?26:30,tc); });
 var fin=decided?'#0F3E68':'#B8C2CC';
 g+='<text class="k" x="10" y="420">EVERY COMPLAINT, REPORTABLE OR NOT</text><rect x="10" y="428" width="420" height="40" rx="4" fill="#fff" stroke="'+fin+'" stroke-width="1.4"/>'+wrap('Investigate, unless a similar complaint was already investigated and the reason is on file',220,448,64)+'<rect x="450" y="428" width="420" height="40" rx="4" fill="#fff" stroke="'+fin+'" stroke-width="1.4"/>'+wrap('Trend with similar complaints; feed CAPA, risk files and management review',660,448,64);
 root.querySelector('.cr-svg').innerHTML=g+'</svg>';
 /* result */
 var us=F.us!=='No', eu=F.eu==='Yes', rep=out==='R5'||out==='R30', due='', dueTxt='—', usTxt, euTxt;
 if(rep&&F.aware) due=out==='R5'?T.addDays(F.aware,5,true):T.addDays(F.aware,30,false);
 if(!cpl) usTxt='Not decided';
 else if(open) usTxt='Decision open';
 else if(!us) usTxt='Not on US market';
 else usTxt=out==='R5'?'Reportable, 5-day':out==='R30'?'Reportable, 30-day':'Not reportable';
 euTxt=!eu?'Not on EU market':open||!cpl?'Decision open':rep?'Serious incident: report':'Not a serious incident';
 if(rep&&us) dueTxt=due?fd(due):'Enter the aware date';
 var invReq=rep?'Required':cpl==='No'?'Not a complaint':F.prev==='Yes'?'May rely on earlier one':'Required';
 root.querySelector('.cr-stat').innerHTML='<div><b>'+(cpl==='No'?'No':cpl?'Yes':'—')+'</b><span>A complaint?</span></div><div><b>'+usTxt+'</b><span>US medical device report</span></div><div><b>'+dueTxt+'</b><span>US report due</span></div><div><b>'+euTxt+'</b><span>EU vigilance</span></div><div><b>'+invReq+'</b><span>Investigation</span></div>';
 /* trend */
 var n=api.num, n1=n(F.n1), u1=n(F.u1), n0=n(F.n0), u0=n(F.u0), r1=n1/u1*1000, r0=n0/u0*1000, th='';
 if(isFinite(r1)&&u1>0){ th='<div><b>'+api.fmt(r1,3)+'</b><span>Per 1,000 units, last 12 months</span></div>';
  if(isFinite(r0)&&u0>0){ th+='<div><b>'+api.fmt(r0,3)+'</b><span>Per 1,000 units, prior 12 months</span></div><div><b>'+(r0>0?api.fmt(r1/r0,2)+'&times;':'—')+'</b><span>Ratio, last to prior</span></div>'; } }
 root.querySelector('.cr-tr').innerHTML=th;
 /* checks */
 if(!cpl){ root.querySelector('.cr-out').innerHTML=api.flags([],'Answer question 1 to start.'); return; }
 if(cpl==='Unsure') f.push(['warn','Unsure whether it is a complaint: treat it as one. Most complaint findings in audits are communications that were logged as "inquiries" and never evaluated.']);
 if(cpl==='No'){ f.push(['ok','Not a complaint on the answer given. Record it as an inquiry or feedback and include it in trending.']);
  if(F.dsi==='Death'||F.dsi==='Serious injury') f.push(['warn','But a death or serious injury is recorded. Reportability turns on the event, not on whether the communication was labeled a complaint. Evaluate it for reporting anyway.']); }
 if(open){ var Q={D1:'1',D2:'2',D3:'3',D4:'4',D5:'5'}[open]; f.push(['warn','Question '+Q+' is still open. The reporting clock runs from the aware date while information is gathered'+(F.aware?' ('+fd(F.aware)+'; 30 days ends '+fd(T.addDays(F.aware,30,false))+')':'')+'. Do not let a missing answer become a missed deadline.']); }
 if(rep&&us){ f.push(['warn','<b>US: reportable.</b> '+(out==='R5'?'File a 5-day report within 5 work days of becoming aware (the due date shown skips weekends only; federal holidays are not work days either, so check the calendar)':'File a medical device report within 30 calendar days of becoming aware')+(due?', by <b>'+fd(due)+'</b>':'')+'. New information found later goes in a supplemental report.']);
  if(F.cc==='Cannot rule out'&&P.D3) f.push(['','The causal link cannot be ruled out. When the information reasonably suggests the device may have caused or contributed, the event is reported; the report can say the cause is not yet known.']);
  if(F.rec==='Unsure'&&P.D5) f.push(['','Unsure whether a recurrence would be likely to cause serious harm: the conservative reading is to report, unless risk analysis or history shows otherwise and the rationale is recorded.']); }
 if(rep&&eu) f.push(['warn','<b>EU: serious incident.</b> Report it to the competent authority of the country where it happened, within the deadlines in the EU vigilance rules. The deadlines are shorter for deaths, unanticipated serious deterioration in health and serious public health threats than for other serious incidents. Check the current text of the regulation and its guidance.']);
 if(decided&&!rep&&out==='NR'){ f.push(['ok','Not reportable on the answers given.']); if(!(F.why||'').trim()) f.push(['warn','No rationale recorded for the "not reportable" decision. An auditor will ask for it: which question was answered no, and the evidence.']); }
 if(rep&&!F.aware) f.push(['warn','Enter the date the company became aware, so the due date can be set.']);
 if(rep&&F.dd&&due&&F.dd>due) f.push(['warn','The decision date ('+fd(F.dd)+') is after the report due date ('+fd(due)+'). A late report is itself a finding.']);
 if(F.recv&&F.aware&&F.aware>F.recv) f.push(['','The aware date is after the date received. Awareness usually starts when anyone in the company receives the information, including sales and service staff; check that the later date is justified.']);
 if(cpl!=='No'){ if(rep) f.push(['','A reportable complaint must be investigated. Record the investigation in the complaint file and link it to the report.']);
  else if(F.prev==='Yes') f.push(['','A similar complaint has already been investigated. You may rely on it, but record the justification and the reference in this file.']);
  else f.push(['','Investigate the complaint, or record why no investigation is needed.']); }
 if(F.src==='Service or repair report'||F.src==='Sales or field service representative') f.push(['','Service and field reports are complaint sources. Check that every service report describing a possible malfunction reaches the complaint process.']);
 if(isFinite(r1)&&isFinite(r0)&&u1>0&&u0>0){ if(r0>0&&r1/r0>=1.5) f.push(['warn','The rate of similar complaints is '+api.fmt(r1/r0,1)+' times last year\'s. That is a signal to investigate the trend and to consider whether it is reportable as a trend in the EU, even if no single complaint is.']); else if(r0===0&&n1>0) f.push(['warn','Similar complaints this year and none last year: a new failure mode. Investigate the trend.']); else f.push(['ok','The rate of similar complaints has not risen sharply. Keep trending it.']); }
 f.push(['','Study aid only. Reporting decisions belong to your procedures, the current regulations (21 CFR Part 803 in the US, the EU MDR and IVDR vigilance articles and guidance) and your regulatory affairs function. This page does not give regulatory advice.']);
 root.querySelector('.cr-out').innerHTML=api.flags(f);
},
example:{f:{id:'CMP-26-0418',recv:'2026-09-14',aware:'2026-09-14',dev:'VX-3 syringe infusion pump',lot:'Serial VX3-118204',src:'Customer phone call',
 desc:'A hospital nurse reported that a VX-3 pump running a heparin infusion did not sound its occlusion alarm when the line was clamped by a closed bed rail. The nurse found the line occluded about 40 minutes later during a routine check. The pump has been returned for evaluation.',
 outc:'The patient missed about 40 minutes of infusion. Clotting tests were repeated and the infusion restarted; no lasting harm and no medical intervention beyond monitoring.',
 cpl:'Yes',dsi:'No',cc:'',mal:'Yes',rec:'Yes',rem:'No',us:'Yes',eu:'Yes',prev:'No',
 n1:'7',u1:'5200',n0:'3',u0:'4900',
 inv:'Returned pump reproduces the fault: the occlusion pressure sensor reads low after the pump has been dropped. Device history record shows sensor lot PS-2291. Six of the seven similar complaints this year involve pumps with sensors from the same lot.',
 rc:'Sensor mounting bracket cracks on impact, so the sensor reads low and the alarm threshold is never reached.',
 why:'Malfunction: occlusion alarm failed. A recurrence with a critical drug would be likely to contribute to serious injury. Reportable as a 30-day MDR; no remedial action yet that would make it a 5-day report.',
 by:'M. Delacroix-Vance, regulatory affairs',dd:'2026-09-22',rpt:'',capa:'CAPA-26-077'}}
}
