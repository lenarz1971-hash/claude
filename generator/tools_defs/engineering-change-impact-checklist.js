{
slug:'engineering-change-impact-checklist',
STD:[
 ['Drawing or model','Design'],['Product specification or bill of materials','Design'],['Design FMEA','Design'],['Design verification and validation records','Design'],
 ['Process flow diagram','Process'],['Process FMEA','Process'],['Control plan','Process'],['Work instructions','Process'],['Machine programs and settings','Process'],['Tooling and fixtures','Process'],
 ['Inspection plan and test procedures','Quality'],['Gauges and test equipment','Quality'],['First article or PPAP resubmission','Quality'],
 ['Training records for affected operators','Training'],
 ['ERP item master, routing and BOM revision','Software and IT'],['Product or test software','Software and IT'],
 ['Labels, packaging and markings','Production'],
 ['Purchase orders and supplier drawings','Supply chain'],['Supplier stock and open orders','Supply chain'],
 ['Raw and purchased stock','Inventory'],['Work in process','Inventory'],['Finished goods and stock in transit','Inventory'],['Service and spare parts','Inventory'],
 ['Customer approval or notification','Customer and regulatory'],['Regulatory filing or technical file','Customer and regulatory'],['Manuals and service documents','Customer and regulatory']],
CATS:['Design','Process','Quality','Training','Software and IT','Production','Supply chain','Inventory','Customer and regulatory','Other'],
st:function(r){ if(!r.item) return ''; if(!r.aff||r.aff==='Not assessed') return 'Not assessed'; if(r.aff==='No') return 'Not affected';
 if(r.ver) return 'Closed'; if(r.upd) return 'Updated, not verified'; return 'Open'; },
sections:[
 {type:'fields',title:'The change',cols:3,hint:'One record per change. Say exactly what changes, from which revision to which, and why. The class decides who must approve it and whether the customer must be told before it is made.',fields:[
  {id:'num',label:'Change number',ph:'e.g. ECN-2026-118'},
  {id:'part',label:'Part or product affected',ph:'e.g. Valve body VB-220'},
  {id:'rev',label:'Revision, from and to',ph:'e.g. Rev C to Rev D'},
  {id:'desc',label:'What changes',type:'textarea',wide:true,ph:'e.g. Bore diameter tolerance tightened from ±0.05 to ±0.02 mm'},
  {id:'why',label:'Reason for the change',type:'textarea',wide:true},
  {id:'cls',label:'Change class',type:'select',opts:['Major: affects form, fit, function, safety or a regulatory requirement','Minor: no effect on form, fit or function','Administrative: correction of text only']},
  {id:'req',label:'Requested by'},
  {id:'own',label:'Change owner'}]},
 {type:'fields',title:'Effectivity and interchangeability',cols:3,hint:'Effectivity is the point from which the change applies: a date, a serial number or a lot. It has to be one that production, receiving and service can all see on the part or its paperwork.',fields:[
  {id:'eff',label:'Effectivity by',type:'select',opts:['Date','Serial number','Lot or batch','Use up existing stock, then change','Immediate (all stock affected)']},
  {id:'effd',label:'Effective date',type:'date'},
  {id:'effs',label:'First serial number or lot',ph:'e.g. Lot 26-1104 onward'},
  {id:'ic',label:'Interchangeability',type:'select',opts:['Fully interchangeable: old and new mix freely','One-way: new replaces old, not the reverse','Not interchangeable']},
  {id:'ident',label:'How new parts are identified',ph:'e.g. Rev D marked on the part and the label'}]},
 {type:'custom',id:'std',cls:'noprint',title:'Start from the standard list',hint:'Adds the usual documents, plans, records and stock locations that a change can touch. Mark each one affected or not; deleting a line hides it from the review, so mark it "No" instead.',html:'<div class="tgbar"><button type="button" class="dg-btn ec-std">Add the standard checklist</button><span class="dg-hint ec-msg"></span></div>',
  init:function(el,api){ el.querySelector('.ec-std').onclick=function(){
   var S=api.state(), T=window.TOOL, have={}, k=0;
   S.g.it.forEach(function(r){ if(r.item) have[r.item.toLowerCase()]=1; });
   S.g.it=S.g.it.filter(function(r){ return r.item||r.ref||r.aff||r.who; });
   T.STD.forEach(function(x){ if(!have[x[0].toLowerCase()]){ S.g.it.push({item:x[0],cat:x[1]}); k++; } });
   if(!S.g.it.length) S.g.it.push({});
   api.save(); api.rerender(); var m=document.querySelector('#tool .ec-msg'); if(m) m.textContent=k?('Added '+k+' item'+(k===1?'':'s')+'.'):'Every standard item is already on the list.'; }; }},
 {type:'grid',id:'it',title:'Everything the change touches',rows:3,hint:'One line per document, plan, record, program or stock location. <b>Updated</b> is the date the new revision was released; <b>verified</b> is the date someone other than the author checked it is right and in use.',cols:[
  {id:'item',label:'Item',w:200,type:'textarea',rows:1},
  {id:'cat',label:'Area',type:'select',opts:['Design','Process','Quality','Training','Software and IT','Production','Supply chain','Inventory','Customer and regulatory','Other']},
  {id:'ref',label:'Document or location',w:120},
  {id:'aff',label:'Affected?',type:'select',opts:['Yes','No','Not assessed']},
  {id:'act',label:'Action or new revision',w:170,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:100},
  {id:'due',label:'Due',type:'date'},
  {id:'upd',label:'Updated',type:'date'},
  {id:'vby',label:'Verified by',w:100},
  {id:'ver',label:'Verified',type:'date'},
  {id:'s',label:'Status',calc:function(r){ return window.TOOL.st(r); }}]},
 {type:'grid',id:'stk',title:'Existing stock and its disposition',rows:2,hint:'Every place old-revision material can be: your stores, the line, finished goods, in transit, at the supplier, at the customer and in service stock. Each needs a decision.',cols:[
  {id:'loc',label:'Location',type:'select',opts:['Raw or purchased stock','Work in process','Finished goods','In transit','Supplier stock and open orders','Customer stock','Service and spare parts']},
  {id:'q',label:'Quantity',type:'number',min:0},
  {id:'disp',label:'Disposition',type:'select',opts:['Use as is','Use up before effectivity','Rework to the new revision','Scrap','Return to supplier','Hold pending decision']},
  {id:'note',label:'Detail',w:200,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:100},
  {id:'done',label:'Done',type:'date'}]},
 {type:'grid',id:'ap',title:'Review and sign-off',rows:3,hint:'The change review board, or whoever your procedure names. Approval before the effective date, not after.',cols:[
  {id:'role',label:'Function',w:150},
  {id:'name',label:'Name',w:130},
  {id:'dec',label:'Decision',type:'select',opts:['Approved','Approved with conditions','Rejected','Pending']},
  {id:'cond',label:'Conditions or comments',w:220,type:'textarea',rows:1},
  {id:'d',label:'Date',type:'date'}]},
 {type:'custom',id:'res',title:'Status and open items',html:'<div class="stat ec-stat"></div><div class="svgw ec-svg"></div><div class="out ec-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), F=S.f, n=api.num, f=[], today=api.today();
 var it=S.g.it.filter(function(r){ return r.item; });
 var cnt={'Not assessed':0,'Not affected':0,'Open':0,'Updated, not verified':0,'Closed':0};
 it.forEach(function(r){ cnt[T.st(r)]++; });
 var aff=it.filter(function(r){ return r.aff==='Yes'; }), pct=aff.length?100*cnt.Closed/aff.length:NaN;
 var trs=root.querySelectorAll('table[data-grid="it"] tbody tr');
 S.g.it.forEach(function(r,i){ var s=T.st(r); if(trs[i]) trs[i].classList.toggle('hi-row', s==='Open'||s==='Not assessed'||(s==='Updated, not verified'&&r.due&&r.due<today)); });
 root.querySelector('.ec-stat').innerHTML='<div><b>'+it.length+'</b><span>Items listed</span></div><div><b>'+aff.length+'</b><span>Affected</span></div><div><b>'+cnt.Closed+'</b><span>Closed (updated and verified)</span></div><div><b>'+(cnt.Open+cnt['Updated, not verified'])+'</b><span>Still open</span></div><div><b>'+cnt['Not assessed']+'</b><span>Not assessed</span></div><div><b>'+(isNaN(pct)?'—':api.fmt(pct,0)+'%')+'</b><span>Affected items closed</span></div>';
 /* bars by area: closed / updated / open / not assessed */
 var cats=T.CATS.filter(function(c){ return it.some(function(r){ return (r.cat||'Other')===c; }); });
 if(cats.length){
  var L=150, BW=440, RH=24, H=32+cats.length*RH+30, W=L+BW+110, mx=1;
  var K=[['Closed','#2E7D4F'],['Updated, not verified','#D8B147'],['Open','#C0392B'],['Not assessed','#9AA6B2'],['Not affected','#E3E8EE']];
  var rows=cats.map(function(c){ var o={c:c,t:0}; K.forEach(function(k){ o[k[0]]=0; }); it.forEach(function(r){ if((r.cat||'Other')===c){ o[T.st(r)]++; o.t++; } }); if(o.t>mx) mx=o.t; return o; });
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Items by area and status"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  rows.forEach(function(o,i){ var y=22+i*RH, x=L; g+='<text x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+api.esc(o.c)+'</text>';
   K.forEach(function(k){ var w=BW*o[k[0]]/mx; if(w>0){ g+='<rect x="'+x+'" y="'+(y+3)+'" width="'+w+'" height="'+(RH-8)+'" fill="'+k[1]+'" stroke="#fff"><title>'+k[0]+': '+o[k[0]]+'</title></rect>'; x+=w; } });
   g+='<text class="ax" x="'+(x+6)+'" y="'+(y+14)+'">'+o.t+'</text>'; });
  var lx=L; K.forEach(function(k){ g+='<rect x="'+lx+'" y="'+(H-16)+'" width="10" height="10" fill="'+k[1]+'"/><text class="ax" x="'+(lx+14)+'" y="'+(H-7)+'">'+k[0].toUpperCase()+'</text>'; lx+=k[0].length*6.6+30; });
  g+='<text class="ax" x="'+L+'" y="12">ITEMS BY AREA</text>';
  root.querySelector('.ec-svg').innerHTML=g+'</svg>';
 } else root.querySelector('.ec-svg').innerHTML='';
 /* checks */
 var effOk=F.eff&&(F.eff==='Date'?!!F.effd:/Serial|Lot/.test(F.eff)?!!F.effs:true);
 if(!F.eff) f.push(['warn','No effectivity is set. Without one, nobody can tell which parts are built to which revision.']);
 else if(!effOk) f.push(['warn','Effectivity is by '+api.esc(F.eff.toLowerCase())+' but the '+(F.eff==='Date'?'date':'serial number or lot')+' is not filled in.']);
 if(F.eff&&F.eff!=='Date'&&F.eff!=='Immediate (all stock affected)'&&!F.ident) f.push(['warn','Say how new-revision parts are identified. Serial or lot effectivity only works if the revision can be seen on the part or its paperwork.']);
 if(cnt['Not assessed']) f.push(['warn',cnt['Not assessed']+' item'+(cnt['Not assessed']===1?' has':'s have')+' not been assessed. Every item on the list needs a yes or a no, with a reason for the no.']);
 var noOwn=aff.filter(function(r){ return !r.who; }); if(noOwn.length) f.push(['warn','No owner for: '+noOwn.map(function(r){ return api.esc(r.item); }).join(', ')+'.']);
 var noVer=aff.filter(function(r){ return r.upd&&!r.ver; }); if(noVer.length) f.push(['warn','Updated but not verified: '+noVer.map(function(r){ return api.esc(r.item); }).join(', ')+'. An update is not done until someone checks the new revision is correct and is the one in use.']);
 var selfV=aff.filter(function(r){ return r.ver&&r.vby&&r.who&&r.vby.trim().toLowerCase()===r.who.trim().toLowerCase(); }); if(selfV.length) f.push(['','Verified by the owner: '+selfV.map(function(r){ return api.esc(r.item); }).join(', ')+'. A second person catches more.']);
 var late=aff.filter(function(r){ return r.due&&r.due<today&&!r.ver; }); if(late.length) f.push(['warn','Past due: '+late.map(function(r){ return api.esc(r.item)+' ('+api.esc(r.due)+')'; }).join(', ')+'.']);
 if(F.effd){ var after=aff.filter(function(r){ return r.due&&r.due>F.effd; }); if(after.length) f.push(['warn','Due after the effective date of '+api.esc(F.effd)+': '+after.map(function(r){ return api.esc(r.item); }).join(', ')+'. Production would start on the new revision before these are ready.']);
  var openAtEff=aff.filter(function(r){ return !r.ver; }); if(F.effd<=today&&openAtEff.length) f.push(['warn','The change is already effective ('+api.esc(F.effd)+') with '+openAtEff.length+' affected item'+(openAtEff.length===1?'':'s')+' not closed. Parts are being made to a revision whose documents are not all in place.']); }
 var tr=aff.filter(function(r){ return r.cat==='Training'; }), wi=aff.filter(function(r){ return /work instruction|procedure|program/i.test(r.item); });
 if(wi.length&&!tr.length) f.push(['warn','Work instructions or programs change, but no training item is marked affected. Operators need to know about the change before the effective date.']);
 var major=/^Major/.test(F.cls||''), cust=it.filter(function(r){ return r.cat==='Customer and regulatory'; });
 if(major&&!cust.some(function(r){ return r.aff==='Yes'||r.aff==='No'; })) f.push(['warn','A major change, and customer notification and regulatory filings have not been assessed. Many customers and regulators require approval before a form, fit or function change is made.']);
 if(major&&!aff.some(function(r){ return /fmea|control plan/i.test(r.item); })) f.push(['warn','A major change with no FMEA or control plan marked affected. Check whether the risk analysis and the controls still match the new design or process.']);
 /* stock */
 var stk=S.g.stk.filter(function(r){ return r.loc||r.q||r.disp; }), ni=/^Not/.test(F.ic||''), oneway=/^One-way/.test(F.ic||'');
 if(!stk.length&&it.length) f.push(['warn','No existing stock is listed. Old-revision parts in stores, on the line, at the supplier and at the customer each need a disposition.']);
 stk.forEach(function(r,i){ var id='Stock line '+(i+1)+(r.loc?' ('+api.esc(r.loc.toLowerCase())+')':'');
  if(!r.disp) f.push(['warn',id+' has no disposition.']);
  else if(r.disp==='Hold pending decision') f.push(['warn',id+' is on hold pending a decision. Name who decides and by when.']);
  if(ni&&(r.disp==='Use as is'||r.disp==='Use up before effectivity')&&!(F.eff&&/Use up/.test(F.eff))) f.push(['warn',id+': "'+api.esc(r.disp)+'" for parts that are not interchangeable. Make sure old and new can never be mixed in one assembly or one shipment.']);
  if(oneway&&r.loc==='Service and spare parts'&&r.disp==='Use as is') f.push(['','Service stock is "use as is" under one-way interchangeability: old parts can still be fitted to older products, but must not go into new-revision ones.']); });
 var tot=stk.reduce(function(a,r){ var q=n(r.q); return a+(isNaN(q)?0:q); },0); if(stk.length) f.push(['','Old-revision stock listed: <b>'+api.fmt(tot,0)+'</b> units in '+stk.length+' location'+(stk.length===1?'':'s')+'.']);
 /* approval */
 var ap=S.g.ap.filter(function(r){ return r.role||r.name; });
 if(!ap.length) f.push(['warn','Nobody has signed off yet.']);
 else { var pend=ap.filter(function(r){ return !r.dec||r.dec==='Pending'; }), rej=ap.filter(function(r){ return r.dec==='Rejected'; }), cond=ap.filter(function(r){ return r.dec==='Approved with conditions'&&!r.cond; });
  if(rej.length) f.push(['warn','Rejected by '+rej.map(function(r){ return api.esc(r.role||r.name); }).join(', ')+'. The change cannot go ahead as written.']);
  if(pend.length) f.push(['warn','Sign-off pending from '+pend.map(function(r){ return api.esc(r.role||r.name); }).join(', ')+'.']);
  if(cond.length) f.push(['warn','Approved with conditions, but the conditions are not written down ('+cond.map(function(r){ return api.esc(r.role||r.name); }).join(', ')+').']);
  if(F.effd){ var lateAp=ap.filter(function(r){ return r.d&&r.d>F.effd; }); if(lateAp.length) f.push(['warn','Signed off after the effective date by '+lateAp.map(function(r){ return api.esc(r.role||r.name); }).join(', ')+'. Approval comes before the change is made.']); }
  if(!pend.length&&!rej.length&&aff.length&&cnt.Closed===aff.length&&effOk) f.push(['ok','Every affected item is updated and verified, the stock has a disposition and the sign-offs are in. The change can be closed.']); }
 root.querySelector('.ec-out').innerHTML=api.flags(f,'Describe the change and list what it touches, and the checks appear here.');
},
example:{f:{num:'ECN-2026-118',part:'Valve body VB-220, used in the Ardent 40 metering pump',rev:'Rev C to Rev D',desc:'Seal bore diameter tolerance tightened from 22.00 ±0.05 to 22.00 ±0.02 mm, and surface finish from Ra 1.6 to Ra 0.8.',why:'Field returns for seepage at the shaft seal (complaint file CF-0931). Analysis showed seals at the large end of the old tolerance lose compression after thermal cycling.',
 cls:'Major: affects form, fit, function, safety or a regulatory requirement',req:'Product engineering',own:'Hana Petrosyan, product engineer',eff:'Lot or batch',effd:'2026-11-02',effs:'Machining lot 26-1104 onward',ic:'One-way: new replaces old, not the reverse',ident:'Rev D etched next to the part number; lot traveler and label show Rev D'},
 g:{it:[
  {item:'Drawing or model',cat:'Design',ref:'DWG 40-220',aff:'Yes',act:'Rev D released',who:'H. Petrosyan',due:'2026-10-05',upd:'2026-10-03',vby:'Design checker',ver:'2026-10-06'},
  {item:'Design FMEA',cat:'Design',ref:'DFMEA-40',aff:'Yes',act:'Seal compression failure mode rescored',who:'H. Petrosyan',due:'2026-10-10',upd:'2026-10-08',vby:'Reliability engineer',ver:'2026-10-09'},
  {item:'Process FMEA',cat:'Process',ref:'PFMEA-220',aff:'Yes',act:'Bore boring step: new occurrence and detection',who:'Oren Vale, manufacturing engineer',due:'2026-10-17',upd:'2026-10-14',vby:'',ver:''},
  {item:'Control plan',cat:'Process',ref:'CP-220',aff:'Yes',act:'Bore diameter: 100% air gauge; finish 1 per 50',who:'O. Vale',due:'2026-10-17',upd:'',vby:'',ver:''},
  {item:'Work instructions',cat:'Process',ref:'WI-220-30',aff:'Yes',act:'Finish boring pass and tool change interval',who:'O. Vale',due:'2026-10-24',upd:'',vby:'',ver:''},
  {item:'Machine programs and settings',cat:'Process',ref:'CNC cell 4, O2204',aff:'Yes',act:'Add finish pass; offset limits',who:'Programmer',due:'2026-10-24',upd:'',vby:'',ver:''},
  {item:'Gauges and test equipment',cat:'Quality',ref:'Air gauge AG-22',aff:'Yes',act:'New master rings; gauge R&R on the ±0.02 tolerance',who:'Metrology',due:'2026-11-06',upd:'',vby:'',ver:''},
  {item:'Inspection plan and test procedures',cat:'Quality',ref:'IP-220',aff:'Yes',act:'Add finish check',who:'Quality engineer',due:'2026-10-24',upd:'',vby:'',ver:''},
  {item:'Training records for affected operators',cat:'Training',ref:'Cell 4, three shifts',aff:'',act:'',who:'',due:'',upd:'',vby:'',ver:''},
  {item:'Labels, packaging and markings',cat:'Production',ref:'',aff:'No',act:'Label already prints the revision from the ERP',who:'',due:'',upd:'',vby:'',ver:''},
  {item:'ERP item master, routing and BOM revision',cat:'Software and IT',ref:'Item 40-220',aff:'Yes',act:'Rev D, new routing step',who:'Planner',due:'2026-10-24',upd:'',vby:'',ver:''},
  {item:'Customer approval or notification',cat:'Customer and regulatory',ref:'Two OEM customers',aff:'Yes',act:'Change notice and PPAP level 3 resubmission',who:'Customer quality',due:'2026-10-20',upd:'',vby:'',ver:''}],
 stk:[
  {loc:'Work in process',q:'340',disp:'Rework to the new revision',note:'Re-bore and re-finish; check every part on the new gauge',who:'Cell 4 lead',done:''},
  {loc:'Finished goods',q:'1200',disp:'Hold pending decision',note:'Old-revision bodies in stores',who:'Quality manager',done:''},
  {loc:'Service and spare parts',q:'85',disp:'Use as is',note:'For pumps built before lot 26-1104 only',who:'Service planner',done:''}],
 ap:[
  {role:'Product engineering',name:'H. Petrosyan',dec:'Approved',cond:'',d:'2026-10-02'},
  {role:'Manufacturing engineering',name:'O. Vale',dec:'Approved with conditions',cond:'Second boring tool set to be ordered before the effective date',d:'2026-10-02'},
  {role:'Quality',name:'Quality manager',dec:'Pending',cond:'',d:''}]}}
}
