{
slug:'supplier-quality-agreement-checklist',
h:{
 /* [element, default criticality] */
 std:[['Scope: parts, services, sites and programs covered','Critical'],
  ['Definitions and order of precedence (agreement, PO, drawing, standards)','Important'],
  ['Roles and responsibilities of each party','Important'],
  ['Quality management system requirements and certification','Important'],
  ['Specifications, drawings and revision control','Critical'],
  ['Special and critical characteristics and how they are controlled','Critical'],
  ['Product and process approval: first article, PPAP or validation','Critical'],
  ['Change notification and approval before implementation','Critical'],
  ['Nonconforming product: notification, containment, deviations','Critical'],
  ['Corrective action (SCAR, 8D) and response times','Important'],
  ['Inspection, test and certificates (CoC, CoA)','Important'],
  ['Records and retention periods','Important'],
  ['Right of access: audits by the customer and regulators','Critical'],
  ['Sub-tier supplier control and requirements flowdown','Important'],
  ['Counterfeit and suspect part prevention','Important'],
  ['Identification and traceability (lot, batch, serial)','Important'],
  ['Packaging, labeling and preservation','Standard'],
  ['Performance metrics (KPIs) and scorecard','Standard'],
  ['Escalation and controlled shipping','Important'],
  ['Confidentiality and intellectual property','Important'],
  ['Regulatory and compliance declarations (RoHS, REACH, conflict minerals)','Important'],
  ['Business continuity and contingency','Standard'],
  ['Term, periodic review, revision and signatures','Important']],
 W:{Critical:3,Important:2,Standard:1},
 credit:function(x){ return x==='Yes, fully'?1:x==='Partly'?0.5:x==='No'?0:NaN; },
 /* completeness = sum(weight x credit) / sum(weight), over elements answered Yes, Partly or No.
    Not applicable and not yet reviewed are left out of the score. */
 score:function(rows){ var s=0,w=0,self=this; rows.forEach(function(r){ var c=self.credit(r.inc), k=self.W[r.crit||'Important']||2; if(!isNaN(c)){ s+=k*c; w+=k; } }); return w?100*s/w:NaN; }
},
sections:[
 {type:'fields',title:'The agreement',cols:3,hint:'A supplier quality agreement sets out who does what to assure quality, beyond the price and delivery terms of the purchase order. Review a draft against the elements below before it goes for signature, or review an existing agreement when a supplier\'s risk changes.',fields:[
  {id:'cust',label:'Customer (your organization)'},
  {id:'sup',label:'Supplier and site'},
  {id:'ref',label:'Agreement number and revision'},
  {id:'scope',label:'Parts, services or commodities covered',wide:true},
  {id:'risk',label:'Product risk',type:'select',opts:['High: safety, regulatory or critical function','Medium','Low']},
  {id:'ind',label:'Industry',type:'select',opts:['General manufacturing','Automotive','Aerospace and defense','Electronics','Medical device','Food, pharmaceutical or cosmetics','Services']},
  {id:'who',label:'Reviewer'},
  {id:'date',label:'Review date',type:'date'},
  {id:'thr',label:'Completeness needed to sign, %',type:'number',min:0,max:100,ph:'90'}]},
 {type:'custom',id:'std',cls:'noprint',title:'Start from the standard elements',hint:'Fills the table with 23 common elements of a supplier quality agreement and a suggested criticality. Rows you have already written are kept. Change the criticality to suit the product and industry.',html:'<div class="pillrow"><button type="button" class="dg-btn qa-load">Add the 23 standard elements</button></div>',
  init:function(el,api){ var H=window.TOOL.h, S=api.state();
   el.querySelector('.qa-load').onclick=function(){ var have=S.g.e.map(function(r){return String(r.el||'').trim().toLowerCase();}); S.g.e=S.g.e.filter(function(r){return r.el||r.inc||r.ref;});
    H.std.forEach(function(x){ if(have.indexOf(x[0].toLowerCase())<0) S.g.e.push({el:x[0],crit:x[1]}); }); api.save(); api.rerender(); }; }},
 {type:'grid',id:'e',title:'Elements of the agreement',rows:4,hint:'For each element, say whether the agreement covers it fully, partly or not at all, and where (clause or section). <b>Critical</b> elements count three times in the completeness score, <b>Important</b> twice, <b>Standard</b> once. Fully counts 1, partly a half, no 0; not applicable and blank are left out of the score.',cols:[
  {id:'el',label:'Element',w:250,type:'textarea',rows:1},
  {id:'crit',label:'Criticality',type:'select',opts:['Critical','Important','Standard']},
  {id:'inc',label:'Included?',type:'select',opts:['Yes, fully','Partly','No','Not applicable']},
  {id:'ref',label:'Clause',w:70},
  {id:'note',label:'Notes: what it says or what is missing',w:240,type:'textarea',rows:1}]},
 {type:'fields',title:'Change notification terms',cols:3,hint:'Uncontrolled change is one of the most common causes of supplier escapes. Record what the agreement actually says. The notice period has to be long enough for you to requalify the part (first article, PPAP or validation) before the change ships.',fields:[
  {id:'cn_days',label:'Notice the supplier must give, days',type:'number',min:0},
  {id:'rq_days',label:'Time you need to requalify a change, days',type:'number',min:0},
  {id:'cn_appr',label:'Your approval needed before the change ships?',type:'select',opts:['Yes','No, notice only','Not stated']},
  {id:'cn_sub',label:'Covers sub-tier supplier changes?',type:'select',opts:['Yes','No','Not stated']},
  {id:'ret_ag',label:'Record retention in the agreement, years',type:'number',min:0},
  {id:'ret_rq',label:'Record retention you need, years',type:'number',min:0},
  {id:'cn_what',label:'Changes that need notice',type:'textarea',wide:true,ph:'e.g. material, process, equipment, site, sub-tier source, test method, software'}]},
 {type:'grid',id:'a',title:'Review and approval',rows:3,hint:'Quality agreements usually need more than one level of review: supplier quality, engineering, purchasing, legal and the supplier\'s own signatory. The agreement is final only when every required reviewer has approved and both parties have signed.',cols:[
  {id:'role',label:'Role',w:180},
  {id:'nm',label:'Name',w:140},
  {id:'st',label:'Decision',type:'select',opts:['Not yet reviewed','Comments to resolve','Approved','Signed']},
  {id:'dt',label:'Date',type:'date'},
  {id:'cm',label:'Comments',w:220,type:'textarea',rows:1}]},
 {type:'custom',id:'sum',title:'Completeness and readiness',html:'<div class="stat qa-stat"></div><div class="svgw qa-svg"></div><div class="out qa-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), n=api.num, esc=api.esc, f=[], thr=n(S.f.thr); if(isNaN(thr)) thr=90;
 var E=S.g.e.filter(function(r){return r.el;}), sc=H.score(E);
 var cnt={'Yes, fully':0,'Partly':0,'No':0,'Not applicable':0,'':0}; E.forEach(function(r){ cnt[r.inc||'']++; });
 var crit=E.filter(function(r){return (r.crit||'Important')==='Critical';});
 var critGap=crit.filter(function(r){return r.inc!=='Yes, fully'&&r.inc!=='Not applicable';});
 var A=S.g.a.filter(function(r){return r.role;}), aOK=A.filter(function(r){return r.st==='Approved'||r.st==='Signed';});
 var ready=E.length&&!critGap.length&&!cnt['']&&!isNaN(sc)&&sc>=thr;
 root.querySelector('.qa-stat').innerHTML='<div><b>'+(isNaN(sc)?'—':sc.toFixed(1)+'%')+'</b><span>Weighted completeness</span></div><div><b>'+cnt['Yes, fully']+' / '+(E.length-cnt['Not applicable'])+'</b><span>Elements fully covered</span></div><div><b>'+critGap.length+'</b><span>Critical elements not fully covered</span></div><div><b>'+cnt['']+'</b><span>Not yet reviewed</span></div><div><b>'+aOK.length+' / '+A.length+'</b><span>Approvals</span></div><div><b>'+(ready&&A.length&&aOK.length===A.length?'Final':ready?'Ready to sign':'Not ready')+'</b><span>Status</span></div>';
 /* picture: one tile per element, grouped by criticality */
 var col={'Yes, fully':['#DDF0E4','#1F8C55'],'Partly':['#FBF3DC','#D8B147'],'No':['#FDECEA','#C0392B'],'Not applicable':['#F3F5F7','#B9C0C6'],'':['#fff','#B9C0C6']};
 if(E.length){
  var groups=['Critical','Important','Standard'], per=8, tw=78, th=34, gap=5, Wd=118+per*(tw+gap), y=8, g='';
  groups.forEach(function(gp){ var list=[]; E.forEach(function(r,i){ if((r.crit||'Important')===gp) list.push({r:r,i:i}); }); if(!list.length) return;
   var rows=Math.ceil(list.length/per);
   g+='<text class="gl" x="6" y="'+(y+21)+'">'+gp.toUpperCase()+'</text>';
   list.forEach(function(x,j){ var c=col[x.r.inc||''], xx=112+(j%per)*(tw+gap), yy=y+Math.floor(j/per)*(th+gap), short=String(x.r.el).replace(/\s*\(.*?\)/g,'').split(/[:,]/)[0].trim();
    var w=short.split(/\s+/), l1='', l2=''; w.forEach(function(t){ if((l1+' '+t).trim().length<=13&&!l2) l1=(l1+' '+t).trim(); else l2=(l2+' '+t).trim(); }); if(l2.length>13) l2=l2.slice(0,12)+'…';
    g+='<rect x="'+xx+'" y="'+yy+'" width="'+tw+'" height="'+th+'" rx="3" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.6"'+(x.r.inc?'':' stroke-dasharray="3 3"')+'/><text class="c" x="'+(xx+4)+'" y="'+(yy+10)+'">'+(x.i+1)+'</text><text x="'+(xx+tw/2)+'" y="'+(yy+(l2?20:23))+'" text-anchor="middle">'+esc(l1)+'</text>'+(l2?'<text x="'+(xx+tw/2)+'" y="'+(yy+30)+'" text-anchor="middle">'+esc(l2)+'</text>':''); });
   y+=rows*(th+gap)+8; });
  var lx=6, ly=y+12; [['Yes, fully','FULLY'],['Partly','PARTLY'],['No','NO'],['Not applicable','N/A'],['','NOT REVIEWED']].forEach(function(k){ var c=col[k[0]]; g+='<rect x="'+lx+'" y="'+(ly-9)+'" width="11" height="11" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.6"/><text class="lg" x="'+(lx+15)+'" y="'+ly+'">'+k[1]+'</text>'; lx+=k[1].length*6+34; });
  root.querySelector('.qa-svg').innerHTML='<svg viewBox="0 0 '+Wd+' '+(ly+8)+'" role="img" aria-label="Coverage of each element"><style>text{font:9.5px Archivo,sans-serif;fill:#16273A}.c{font:700 8px \'IBM Plex Mono\',monospace;fill:#4A5D71}.gl{font:700 9px \'IBM Plex Mono\',monospace;fill:#0F3E68;letter-spacing:.08em}.lg{font:700 8.5px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>'+g+'</svg>';
 } else root.querySelector('.qa-svg').innerHTML='';
 /* flags */
 if(!E.length) f.push(['warn','No elements listed. Use the button above to start from the standard list.']);
 else {
  if(ready) f.push(['ok','Every critical element is fully covered and the weighted completeness is '+sc.toFixed(1)+'%, at or above the '+api.fmt(thr,0)+'% needed. The content is ready for signature.']);
  else if(!isNaN(sc)) f.push(['warn','Weighted completeness '+sc.toFixed(1)+'%'+(sc<thr?', below the '+api.fmt(thr,0)+'% needed to sign':'')+'.'+(critGap.length?' Critical gaps must be closed first, whatever the score.':'')]);
  critGap.forEach(function(r){ f.push(['warn','Critical: <b>'+esc(r.el)+'</b> is '+(r.inc?(r.inc==='No'?'missing':'only partly covered'):'not yet reviewed')+'.'+(r.note?' '+esc(r.note):'')]); });
  var imp=E.filter(function(r){return (r.crit||'Important')!=='Critical'&&r.inc==='No';}); if(imp.length) f.push(['','Also missing: '+imp.map(function(r){return esc(r.el);}).join('; ')+'.']);
  if(cnt['']) f.push(['warn',cnt['']+' element'+(cnt['']>1?'s have':' has')+' not been reviewed yet.']);
  var noRef=E.filter(function(r){return (r.inc==='Yes, fully'||r.inc==='Partly')&&!r.ref;}); if(noRef.length) f.push(['','Add the clause reference for '+noRef.length+' element'+(noRef.length>1?'s':'')+' marked included, so the next reviewer can find '+(noRef.length>1?'them':'it')+'.']);
  var na=E.filter(function(r){return r.inc==='Not applicable'&&(r.crit||'Important')==='Critical';}); if(na.length) f.push(['','Critical element'+(na.length>1?'s':'')+' marked not applicable: '+na.map(function(r){return esc(r.el);}).join('; ')+'. Record why in the notes.']);
  var hi=/^High/.test(S.f.risk||''), ind=S.f.ind||'';
  function findEl(re){ return E.filter(function(r){return re.test(r.el);})[0]; }
  var cf=findEl(/counterfeit/i);
  if((ind==='Aerospace and defense'||ind==='Electronics')&&(!cf||cf.crit!=='Critical')) f.push(['warn','For '+ind.toLowerCase()+', counterfeit and suspect part prevention is usually a critical element. '+(cf?'Raise its criticality.':'Add it.')]);
  var tr=findEl(/traceab/i);
  if((ind==='Medical device'||ind==='Food, pharmaceutical or cosmetics'||ind==='Aerospace and defense')&&(!tr||tr.crit!=='Critical')) f.push(['','In '+ind.toLowerCase()+', lot traceability is normally treated as critical, because a recall depends on it.']);
  if(hi){ var lowC=E.filter(function(r){return /change notif|nonconform|right of access|audit/i.test(r.el)&&r.crit!=='Critical';}); if(lowC.length) f.push(['','High-risk product: consider making '+lowC.map(function(r){return esc(r.el);}).join('; ')+' critical.']); }
 }
 /* change notification and retention */
 var cd=n(S.f.cn_days), rq=n(S.f.rq_days), ra=n(S.f.ret_ag), rr=n(S.f.ret_rq);
 if(!isNaN(cd)&&!isNaN(rq)){ if(cd<rq) f.push(['warn','Change notice is '+api.fmt(cd,0)+' days but requalification takes '+api.fmt(rq,0)+' days. A change could ship '+api.fmt(rq-cd,0)+' days before you can approve it. Lengthen the notice period or require approval before shipment.']);
  else f.push(['ok','Change notice ('+api.fmt(cd,0)+' days) covers the '+api.fmt(rq,0)+' days you need to requalify.']); }
 else if(isNaN(cd)) f.push(['','Record the change notice period the agreement requires.']);
 if(S.f.cn_appr==='No, notice only') f.push([hi?'warn':'','The agreement asks only for notice, not for your approval before a changed part ships.'+(hi?' For a high-risk product, require approval.':'')]);
 if(S.f.cn_appr==='Not stated') f.push(['warn','The agreement does not say whether a change needs your approval. Make it explicit.']);
 if(S.f.cn_sub&&S.f.cn_sub!=='Yes') f.push(['warn','Change notification does not clearly cover the supplier\'s own suppliers. Many escapes start with an unannounced sub-tier change of material or process.']);
 if(!isNaN(ra)&&!isNaN(rr)&&ra<rr) f.push(['warn','Records are kept '+api.fmt(ra,0)+' years under the agreement, short of the '+api.fmt(rr,0)+' years you need.']);
 if(ind==='Medical device'&&S.f.cn_appr!=='Yes') f.push(['','Medical device purchasing controls (ISO 13485:2016, 7.4.2) expect a written agreement that the supplier notifies you of changes before they are made.']);
 /* approvals */
 if(!A.length) f.push(['','List the reviewers and signatories. An agreement that has not been through review and signature by both parties is not in force.']);
 else { var open=A.filter(function(r){return r.st!=='Approved'&&r.st!=='Signed';});
  if(open.length) f.push(['warn','Awaiting: '+open.map(function(r){return esc(r.role)+(r.st==='Comments to resolve'?' (comments to resolve)':'');}).join('; ')+'.']);
  else f.push(['ok','All '+A.length+' reviewers have approved or signed.']);
  if(!A.some(function(r){return /supplier/i.test(r.role)&&r.st==='Signed';})&&!open.length) f.push(['warn','No signature from the supplier is recorded.']);
  if(!ready&&A.some(function(r){return r.st==='Signed';})) f.push(['warn','The agreement has been signed with gaps still open. Plan a revision to close them.']); }
 root.querySelector('.qa-out').innerHTML=api.flags(f);
},
example:{f:{cust:'Arvensa Medical Systems',sup:'Kellford Molding, plant 2',ref:'SQA-0412 rev B (draft)',scope:'Injection-molded polycarbonate housings and battery doors for the AV-7 infusion pump',risk:'High: safety, regulatory or critical function',ind:'Medical device',who:'Supplier quality engineer',date:'2026-10-02',thr:'90',
 cn_days:'60',rq_days:'90',cn_appr:'Yes',cn_sub:'No',ret_ag:'7',ret_rq:'10',cn_what:'Resin grade or source, colorant, mold or cavity changes, process parameters outside the validated window, molding site, sub-tier changes (not yet included)'},
 g:{e:[
  {el:'Scope: parts, services, sites and programs covered',crit:'Critical',inc:'Yes, fully',ref:'1',note:''},
  {el:'Definitions and order of precedence (agreement, PO, drawing, standards)',crit:'Important',inc:'Yes, fully',ref:'2',note:''},
  {el:'Roles and responsibilities of each party',crit:'Important',inc:'Yes, fully',ref:'3, App. A',note:'Responsibility matrix in appendix A'},
  {el:'Quality management system requirements and certification',crit:'Important',inc:'Yes, fully',ref:'4',note:'ISO 13485 certification maintained'},
  {el:'Specifications, drawings and revision control',crit:'Critical',inc:'Yes, fully',ref:'5.1',note:''},
  {el:'Special and critical characteristics and how they are controlled',crit:'Critical',inc:'Partly',ref:'5.3',note:'Lists the CTQ dimensions but not the capability required'},
  {el:'Product and process approval: first article, PPAP or validation',crit:'Critical',inc:'Yes, fully',ref:'6',note:'IQ/OQ/PQ on each mold'},
  {el:'Change notification and approval before implementation',crit:'Critical',inc:'Partly',ref:'7',note:'60 days notice; sub-tier changes not covered'},
  {el:'Nonconforming product: notification, containment, deviations',crit:'Critical',inc:'Yes, fully',ref:'8',note:'Notify within 24 hours of a suspect shipment'},
  {el:'Corrective action (SCAR, 8D) and response times',crit:'Important',inc:'Yes, fully',ref:'9',note:'Containment 24 h, root cause 10 days, closure 30 days'},
  {el:'Inspection, test and certificates (CoC, CoA)',crit:'Important',inc:'Yes, fully',ref:'10',note:''},
  {el:'Records and retention periods',crit:'Important',inc:'Partly',ref:'11',note:'7 years; device lifetime plus 2 years needed'},
  {el:'Right of access: audits by the customer and regulators',crit:'Critical',inc:'Yes, fully',ref:'12',note:''},
  {el:'Sub-tier supplier control and requirements flowdown',crit:'Important',inc:'No',ref:'',note:'Resin distributor not covered'},
  {el:'Counterfeit and suspect part prevention',crit:'Standard',inc:'Not applicable',ref:'',note:'Molded parts from approved resin lots only'},
  {el:'Identification and traceability (lot, batch, serial)',crit:'Critical',inc:'Yes, fully',ref:'13',note:'Lot to resin lot and mold cavity'},
  {el:'Packaging, labeling and preservation',crit:'Standard',inc:'Yes, fully',ref:'14',note:''},
  {el:'Performance metrics (KPIs) and scorecard',crit:'Standard',inc:'Yes, fully',ref:'15',note:'PPM, on-time delivery, SCAR response'},
  {el:'Escalation and controlled shipping',crit:'Important',inc:'Partly',ref:'15.3',note:'Escalation levels listed; no controlled shipping'},
  {el:'Confidentiality and intellectual property',crit:'Important',inc:'Yes, fully',ref:'16',note:'Refers to the NDA of March 2026'},
  {el:'Regulatory and compliance declarations (RoHS, REACH, conflict minerals)',crit:'Important',inc:'Yes, fully',ref:'17',note:''},
  {el:'Business continuity and contingency',crit:'Standard',inc:'No',ref:'',note:''},
  {el:'Term, periodic review, revision and signatures',crit:'Important',inc:'Yes, fully',ref:'18',note:'Reviewed every two years'}],
 a:[
  {role:'Supplier quality engineer',nm:'D. Okafor',st:'Approved',dt:'2026-10-02',cm:''},
  {role:'Design engineering',nm:'L. Brandt',st:'Comments to resolve',dt:'2026-10-03',cm:'Add capability requirement for CTQ dimensions'},
  {role:'Purchasing',nm:'R. Yamada',st:'Approved',dt:'2026-10-03',cm:''},
  {role:'Legal',nm:'',st:'Not yet reviewed',dt:'',cm:''},
  {role:'Supplier quality manager (supplier)',nm:'',st:'Not yet reviewed',dt:'',cm:''}]}}
}
