{
slug:'alcoa-plus-data-integrity-checklist',
h:{
 K:['k1','k2','k3','k4','k5','k6','k7','k8','k9'],
 NM:['Attributable','Legible','Contemporaneous','Original','Accurate','Complete','Consistent','Enduring','Available'],
 RISK:['who did it cannot be shown: shared logins, initials nobody can identify, missing signatures',
  'entries cannot be read or have been obscured: overwriting, correction fluid, faded thermal paper',
  'entries were not made when the work was done: back-dating, block entries at shift end, notes on scrap paper',
  'the first capture of the data is not the one kept: transcriptions, printouts kept while the electronic original is lost',
  'the data do not reflect what happened: unverified calculations, uncalibrated instruments, missing review',
  'data are missing: blank fields, deleted or excluded results, repeat tests without the first result',
  'the sequence or format does not hang together: dates out of order, clocks out of sync, different units',
  'the record will not last its retention period: no backup, local drives, thermal paper, loose sheets',
  'the record cannot be found and read when needed: unknown location, obsolete software, no index'],
 v:function(x){ return x==='Yes'?1:x==='Partly'?0.5:x==='No'?0:NaN; },
 /* score = (yes + half of partly) / answered, N/A and blank excluded */
 score:function(cells){ var s=0,n=0,self=this; cells.forEach(function(c){ var x=self.v(c); if(!isNaN(x)){ s+=x; n++; } }); return n?100*s/n:NaN; }
},
sections:[
 {type:'fields',title:'What is being assessed',cols:3,fields:[
  {id:'ref',label:'Audit or assessment reference',ph:'e.g. DI-2026-07'},
  {id:'area',label:'Area or process',ph:'e.g. Packaging cell 2 and the seal test lab'},
  {id:'rtype',label:'Record systems',type:'select',opts:['Paper','Electronic','Hybrid (paper and electronic)']},
  {id:'who',label:'Assessor'},
  {id:'date',label:'Date',type:'date'},
  {id:'thr',label:'Attribute score that needs action, below (%)',type:'number',min:0,max:100,ph:'90'},
  {id:'scope',label:'Scope and sample',type:'textarea',wide:true,ph:'Which records, which period, how the sample was chosen'}]},
 {type:'custom',id:'guide',title:'The nine ALCOA+ attributes',hint:'The first five are the original ALCOA; the "plus" adds four. Use the questions as prompts when you look at each record.',html:'<div class="tgw"><table class="al-g"><thead><tr><th>Attribute</th><th>Means</th><th>Look for</th></tr></thead><tbody>'+
  '<tr><td><b>Attributable</b></td><td>You can tell who created or changed each entry, and when.</td><td>Signatures or initials on a signature log; unique user IDs, no shared logins; audit trail shows who changed what.</td></tr>'+
  '<tr><td><b>Legible</b></td><td>It can be read, now and later, and corrections leave the original readable.</td><td>Single-line corrections with reason, initials and date; no correction fluid or overwriting; readable printouts.</td></tr>'+
  '<tr><td><b>Contemporaneous</b></td><td>It was recorded when the work was done.</td><td>Times that match the sequence of work; no block entries; system clocks locked and correct; no notes on loose paper.</td></tr>'+
  '<tr><td><b>Original</b></td><td>It is the first capture, or a certified true copy.</td><td>Raw data kept, not just a printout or transcription; electronic originals saved with their metadata.</td></tr>'+
  '<tr><td><b>Accurate</b></td><td>It reflects what actually happened, without error.</td><td>Calibrated instruments; validated calculations and spreadsheets; second-person review where needed.</td></tr>'+
  '<tr><td><b>Complete</b></td><td>All the data are there, including repeats and failures.</td><td>No blank fields left open; every test run accounted for; audit trail reviewed for deletions.</td></tr>'+
  '<tr><td><b>Consistent</b></td><td>Entries are in order and hang together across records.</td><td>Dates and times in sequence; same units and formats; the same event agrees in every record.</td></tr>'+
  '<tr><td><b>Enduring</b></td><td>It lasts for the whole retention period.</td><td>Durable media and ink; backups that are tested; no data held only on a local drive.</td></tr>'+
  '<tr><td><b>Available</b></td><td>It can be found and read when needed, for review, audit or inspection.</td><td>Indexed storage; retrieval in a reasonable time; software still able to open old files.</td></tr>'+
  '</tbody></table></div>'},
 {type:'grid',id:'r',title:'Records assessed',rows:3,hint:'One row per record or data set in the sample. Answer each attribute Yes, Partly, No or N/A. The score counts Yes as 1 and Partly as a half, over the attributes answered.',cols:[
  {id:'rid',label:'ID',w:50},
  {id:'rec',label:'Record',w:200,type:'textarea',rows:1},
  {id:'fmt',label:'Format',type:'select',opts:['Paper','Electronic','Hybrid']},
  {id:'k1',label:'Attrib.',tip:'Attributable',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k2',label:'Legible',tip:'Legible',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k3',label:'Contemp.',tip:'Contemporaneous',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k4',label:'Original',tip:'Original',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k5',label:'Accurate',tip:'Accurate',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k6',label:'Complete',tip:'Complete',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k7',label:'Consist.',tip:'Consistent',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k8',label:'Enduring',tip:'Enduring',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'k9',label:'Avail.',tip:'Available',type:'select',opts:['Yes','Partly','No','N/A']},
  {id:'sc',label:'Score',calc:function(r){ var H=window.TOOL.h, s=H.score(H.K.map(function(k){ return r[k]; })); return isNaN(s)?'':Math.round(s)+'%'; }},
  {id:'note',label:'Notes',w:160,type:'textarea',rows:1}]},
 {type:'custom',id:'res',title:'Results by attribute',hint:'The score of each attribute across the records sampled. Bars below your action level are red.',html:'<div class="stat al-stat"></div><div class="svgw al-svg"></div>'},
 {type:'grid',id:'fd',title:'Findings',rows:2,hint:'Write each finding as requirement, evidence and what was not met, with the record and attribute it concerns. Major: data cannot be trusted or may have been falsified; minor: a lapse that does not put the data in doubt.',cols:[
  {id:'no',label:'No.',w:50},
  {id:'rid',label:'Record ID',w:70},
  {id:'attr',label:'Attribute',type:'select',opts:['Attributable','Legible','Contemporaneous','Original','Accurate','Complete','Consistent','Enduring','Available']},
  {id:'obs',label:'Evidence observed',w:240,type:'textarea',rows:2},
  {id:'req',label:'Requirement',w:140,type:'textarea',rows:2},
  {id:'cls',label:'Class',type:'select',opts:['Major','Minor','Observation']},
  {id:'act',label:'Action required',w:180,type:'textarea',rows:2},
  {id:'own',label:'Owner',w:100},
  {id:'due',label:'Due',type:'date'}]},
 {type:'fields',title:'Conclusion',cols:1,fields:[
  {id:'concl',label:'Overall conclusion',type:'textarea',ph:'Can the data from this area be relied on? What has to happen before they can?'}]},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out al-out"></div>'}
],
update:function(root,api){
 var S=api.state(), H=window.TOOL.h, f=[], e=api.esc, thr=api.num(S.f.thr); if(isNaN(thr)) thr=90;
 var R=S.g.r.map(function(r,i){ return {r:r,id:(r.rid||'').trim()||('row '+(i+1))}; }).filter(function(x){ return x.r.rec||x.r.rid; });
 var F=S.g.fd.filter(function(x){ return x.obs||x.attr||x.rid; });
 var colScore=H.K.map(function(k){ return H.score(R.map(function(x){ return x.r[k]; })); });
 var all=[]; R.forEach(function(x){ H.K.forEach(function(k){ all.push(x.r[k]); }); });
 var overall=H.score(all), nNo=all.filter(function(c){ return c==='No'; }).length, nP=all.filter(function(c){ return c==='Partly'; }).length;
 var trs=root.querySelectorAll('table[data-grid="r"] tbody tr');
 S.g.r.forEach(function(r,i){ if(trs[i]) trs[i].classList.toggle('hi-row',H.K.some(function(k){ return r[k]==='No'; })); });
 function hasF(id,nm){ return F.some(function(q){ return String(q.rid||'').trim().toUpperCase()===id.toUpperCase()&&q.attr===nm; }); }
 R.forEach(function(x){ var r=x.r, b='<b>'+e(x.id)+'</b>', ans=H.K.filter(function(k){ return r[k]; }).length;
  if(!ans){ f.push(['warn',b+' has not been assessed yet.']); return; }
  if(ans<9) f.push(['',b+': '+(9-ans)+' attribute'+(9-ans>1?'s are':' is')+' not answered. Use N/A where an attribute does not apply.']);
  var el=r.fmt!=='Paper';
  H.K.forEach(function(k,j){ var nm=H.NM[j], a=r[k]; if((a!=='No'&&a!=='Partly')||hasF(x.id,nm)) return;
   if(k==='k1'&&el) f.push(['warn',b+' is '+(r.fmt||'electronic').toLowerCase()+' and not fully attributable, with no finding. Shared or generic logins defeat the audit trail: nobody can show who made an entry or a change.']);
   else if(k==='k3'&&a==='No') f.push(['warn',b+' was not recorded at the time of the work, with no finding. Find out why: an entry written up later may be a recollection, or a fabrication, rather than a record.']);
   else if(k==='k4'&&el&&a==='No') f.push(['warn',b+': the electronic original is not kept, with no finding. A printout is not a complete copy; it loses the metadata and the audit trail.']);
   else if(a==='No') f.push(['warn',b+' is not '+nm.toLowerCase()+', and there is no finding for it. Record one.']);
   else f.push(['',b+' is only partly '+nm.toLowerCase()+'. Record a finding or an observation, or note why it is acceptable.']); }); });
 colScore.forEach(function(s,j){ if(!isNaN(s)&&s<thr) f.push(['warn',H.NM[j]+' scores '+Math.round(s)+'%, below your action level of '+thr+'%. Typical cause: '+H.RISK[j]+'.']); });
 F.forEach(function(q,i){ var id='<b>Finding '+e(q.no||i+1)+'</b>';
  if(!q.cls) f.push(['warn',id+' has no class.']);
  if(q.rid&&!R.some(function(x){ return x.id.toUpperCase()===String(q.rid).trim().toUpperCase(); })) f.push(['warn',id+' refers to record '+e(q.rid)+', which is not in the records table.']);
  if(q.cls==='Major'&&!q.act) f.push(['warn',id+' is major and has no action. A major data integrity finding usually needs containment: assess the effect on product already released.']);
  if(q.cls&&q.cls!=='Observation'&&(!q.own||!q.due)) f.push(['',id+' needs an owner and a due date.']); });
 if(R.length&&!f.some(function(q){ return q[0]==='warn'; })) f.push(['ok','Every record is assessed, every gap has a finding, and no attribute is below your action level.']);
 var nMaj=F.filter(function(q){ return q.cls==='Major'; }).length;
 root.querySelector('.al-stat').innerHTML='<div><b>'+(isNaN(overall)?'—':Math.round(overall)+'%')+'</b><span>Overall score</span></div><div><b>'+R.length+'</b><span>Records assessed</span></div><div><b>'+nNo+'</b><span>Attributes answered No</span></div><div><b>'+nP+'</b><span>Answered Partly</span></div><div><b>'+F.length+(nMaj?' ('+nMaj+' major)':'')+'</b><span>Findings</span></div>';
 var nar=root.clientWidth&&root.clientWidth<560, L=nar?118:130, BW=nar?180:440, RH=26, W=L+BW+70, Hh=24+9*RH+26, g='<svg viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Score by attribute"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.v{font:700 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
 [0,50,100].forEach(function(p){ var x=L+BW*p/100; g+='<line x1="'+x+'" x2="'+x+'" y1="16" y2="'+(24+9*RH)+'" stroke="#E3E8EE"/><text class="ax" x="'+x+'" y="'+(Hh-6)+'" text-anchor="middle">'+p+'%</text>'; });
 var tx=L+BW*thr/100; g+='<line x1="'+tx+'" x2="'+tx+'" y1="14" y2="'+(24+9*RH)+'" stroke="#C0392B" stroke-dasharray="5 4" stroke-width="1.4"/><text class="ax" x="'+tx+'" y="11" text-anchor="middle" style="fill:#C0392B">ACTION LEVEL '+thr+'%</text>';
 H.NM.forEach(function(nm,j){ var y=24+j*RH, s=colScore[j]; g+='<text x="'+(L-8)+'" y="'+(y+RH/2+4)+'" text-anchor="end">'+nm+'</text>';
  if(!isNaN(s)) g+='<rect x="'+L+'" y="'+(y+5)+'" width="'+Math.max(1,BW*s/100)+'" height="'+(RH-10)+'" fill="'+(s<thr?'#E9A39B':'#0F3E68')+'"/><text class="v" x="'+(L+BW*s/100+6)+'" y="'+(y+RH/2+4)+'">'+Math.round(s)+'%</text>';
  else g+='<text class="ax" x="'+(L+6)+'" y="'+(y+RH/2+4)+'">NOT ASSESSED</text>'; });
 root.querySelector('.al-svg').innerHTML=g+'</svg>';
 root.querySelector('.al-out').innerHTML=api.flags(f,'Add the records you sampled and assess them, and the checks appear here.');
},
example:{f:{ref:'DI-2026-07',area:'Packaging cell 2 and the seal test lab (fictional plant)',rtype:'Hybrid (paper and electronic)',who:'Internal auditor',date:'2026-09-09',thr:'90',scope:'Records for packaging lot 2291, sealed 2026-08-25, chosen at random from August lots; the electronic records behind them; the room 2 cleaning log for the same week.',
 concl:'Paper production records are sound, with small lapses. The seal tester data are not reliable as kept: shared login, originals overwritten, no backup. Seal strength results from this tester cannot be relied on until the actions on findings 1 to 3 are complete; QA to assess lots released on these results.'},
 g:{r:[
  {rid:'R1',rec:'Batch record, lot 2291 (paper)',fmt:'Paper',k1:'Yes',k2:'Yes',k3:'Partly',k4:'Yes',k5:'Yes',k6:'Partly',k7:'Yes',k8:'Yes',k9:'Yes',note:'Six in-process checks timed 14:00 in the same pen'},
  {rid:'R2',rec:'Seal strength tester results, lot 2291',fmt:'Electronic',k1:'Partly',k2:'Yes',k3:'Yes',k4:'No',k5:'Yes',k6:'Yes',k7:'Yes',k8:'No',k9:'Partly',note:'Generic login LAB1; file overwritten by the next run'},
  {rid:'R3',rec:'Sealer temperature chart recorder file',fmt:'Electronic',k1:'Yes',k2:'Yes',k3:'Yes',k4:'Yes',k5:'Yes',k6:'Yes',k7:'Partly',k8:'Yes',k9:'Yes',note:'Recorder clock one hour behind since the time change'},
  {rid:'R4',rec:'Cleaning log, room 2, week 35',fmt:'Paper',k1:'Yes',k2:'Partly',k3:'No',k4:'Yes',k5:'Yes',k6:'Yes',k7:'Yes',k8:'Yes',k9:'Yes',note:'Whole week entered on Friday'},
  {rid:'R5',rec:'Operator training record, sealer',fmt:'Hybrid',k1:'Yes',k2:'Yes',k3:'Yes',k4:'Yes',k5:'Yes',k6:'Yes',k7:'Yes',k8:'Yes',k9:'Yes',note:''}],
 fd:[
  {no:'1',rid:'R2',attr:'Attributable',obs:'All four lab technicians log in to the seal tester as LAB1. The audit trail shows LAB1 for every result in August.',req:'Unique user IDs; entries attributable to a person (DI procedure SOP-114 s.4)',cls:'Major',act:'Individual accounts; disable LAB1; review August results with the lab supervisor',own:'Lab supervisor',due:'2026-09-30'},
  {no:'2',rid:'R2',attr:'Original',obs:'The tester overwrites its result file on each run. Only the printout for lot 2291 exists; it has no test parameters.',req:'Electronic raw data retained with metadata',cls:'Major',act:'Configure the tester to save each run; validate the change; keep files on the network share',own:'Validation engineer',due:'2026-10-15'},
  {no:'3',rid:'R2',attr:'Enduring',obs:'Result files are on the tester PC\'s local drive, with no backup.',req:'Records protected for the retention period',cls:'Minor',act:'Add the tester folder to the nightly backup and test a restore',own:'IT',due:'2026-10-15'},
  {no:'4',rid:'R4',attr:'Contemporaneous',obs:'Cleaning entries for Monday to Friday of week 35 are in the same ink and hand, and the operator said they were written on Friday.',req:'Records made at the time of the activity (SOP-031)',cls:'Major',act:'Interview the team; retrain; supervisor to check the log daily; assess whether room 2 cleaning was done',own:'Production supervisor',due:'2026-09-20'},
  {no:'5',rid:'R1',attr:'Complete',obs:'Two unused fields on page 4 left blank, not lined through.',req:'Unused fields closed (GDP rules, SOP-002)',cls:'Observation',act:'',own:'',due:''}]}}
}
