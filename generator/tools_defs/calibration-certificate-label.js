{
slug:'calibration-certificate-label',
RULES:['Simple acceptance (w = 0)','Guarded acceptance, w = U (binary)','Non-binary: pass, conditional pass, conditional fail, fail'],
h:{
 d:function(v){ if(!v) return null; var d=new Date(v+'T00:00:00'); return isNaN(d)?null:d; },
 ds:function(d){ return d?d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):''; },
 iso:function(d){ var m=d.getMonth()+1, dd=d.getDate(); return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd; },
 /* add whole months; a day that does not exist in the target month becomes its last day */
 addM:function(d,m){ var y=d.getFullYear(), mo=d.getMonth()+m, t=new Date(y,mo,1), last=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(); return new Date(t.getFullYear(),t.getMonth(),Math.min(d.getDate(),last)); },
 due:function(api){ var S=api.state(), d=this.d(S.f.cdate), m=api.num(S.f.int); return d&&m>0&&m%1===0?this.addM(d,m):null; },
 /* decision for one reading: returns P, CP, CF, F or '' */
 dec:function(v,lo,hi,U,rule){ if(isNaN(v)||isNaN(lo)||isNaN(hi)) return ''; if(!(U>0)) U=0; var ri=window.TOOL.RULES.indexOf(rule); if(ri<0) ri=0;
  var e=1e-12*Math.max(1,Math.abs(hi),Math.abs(lo)), inT=v>=lo-e&&v<=hi+e, inG=v>=lo+U-e&&v<=hi-U+e, inX=v>=lo-U-e&&v<=hi+U+e;
  if(ri===0) return inT?'P':'F'; if(ri===1) return inG?'P':'F'; return inG?'P':inT?'CP':inX?'CF':'F'; },
 lab:{P:'Pass',CP:'Conditional pass',CF:'Conditional fail',F:'Fail'},
 row:function(r,api){ var n=api.num, S=api.state(), nom=n(r.nom), lo=n(r.lo), hi=n(r.hi), af=n(r.af), al=n(r.al), U=n(r.U), h=this;
  if(isNaN(al)&&!isNaN(af)) al=af; var o={nom:nom,lo:lo,hi:hi,af:af,al:al,U:U,alGiven:!isNaN(n(r.al))};
  o.afd=h.dec(af,lo,hi,U,S.f.rule); o.ald=h.dec(al,lo,hi,U,S.f.rule); o.ok=!isNaN(lo)&&!isNaN(hi)&&hi>lo; return o; },
 tag:function(c){ return c?'<b class="cc-'+c+'">'+window.TOOL.h.lab[c]+'</b>':''; },
 dp:function(r){ var m=0; ['nom','lo','hi','af','al'].forEach(function(k){ var s=String(r[k]||''); if(s.indexOf('.')>=0) m=Math.max(m,s.split('.')[1].length); }); return m; }
},
sections:[
 {type:'fields',title:'Certificate',cols:3,hint:'The administrative elements ISO/IEC 17025:2017 clause 7.8 asks for on every calibration certificate.',fields:[
  {id:'lab',label:'Laboratory name and address',wide:true},
  {id:'cert',label:'Certificate number'},
  {id:'cust',label:'Customer'},
  {id:'acc',label:'Accreditation, if any',ph:'e.g. accreditation body and certificate number'},
  {id:'cdate',label:'Date of calibration',type:'date'},
  {id:'idate',label:'Date of issue',type:'date'},
  {id:'int',label:'Interval (months)',type:'number',min:1,hint:'Only state a due date the customer asked for or agreed to.'},
  {id:'proc',label:'Procedure or method',wide:true},
  {id:'env',label:'Environmental conditions',ph:'e.g. 20.4 °C ± 0.5 °C, 43 % RH'},
  {id:'tech',label:'Calibrated by'},
  {id:'auth',label:'Authorized by (name, title)'}]},
 {type:'fields',title:'Item calibrated',cols:3,fields:[
  {id:'iid',label:'IM&TE ID or asset number'},
  {id:'desc',label:'Description and range',wide:true},
  {id:'mfr',label:'Manufacturer and model'},
  {id:'sn',label:'Serial number'},
  {id:'rcv',label:'Condition as received',type:'select',opts:['Good working order','Damaged, still functional','Not functional','Missing parts or accessories']},
  {id:'adj',label:'Adjustment',type:'select',opts:['No adjustment made','Adjusted','Repaired and adjusted']},
  {id:'lim',label:'Limitation, if any',wide:true,ph:'e.g. Not calibrated above 80 N·m; use only below that'}]},
 {type:'grid',id:'std',title:'Reference standards used (traceability)',rows:2,hint:'Each standard\'s own certificate is the link in the traceability chain back to the SI through a national metrology institute.',cols:[
  {id:'id',label:'Standard ID',w:90},
  {id:'ds',label:'Description',w:200,type:'textarea',rows:1},
  {id:'ct',label:'Its certificate no.',w:120},
  {id:'due',label:'Its due date',type:'date'},
  {id:'st',label:'At calibration',calc:function(r,api){ var h=window.TOOL.h, d=h.d(r.due), c=h.d(api.state().f.cdate); if(!d||!c) return ''; return d<c?'<b class="cc-F">Overdue</b>':'<b class="cc-P">Current</b>'; }}]},
 {type:'fields',title:'Decision rule',cols:2,hint:'How a reading is judged against the limits, taking the measurement uncertainty U into account (ILAC-G8:09/2019). Agree it with the customer before the work, and state it on the certificate.',fields:[
  {id:'rule',label:'Decision rule',type:'select',opts:['Simple acceptance (w = 0)','Guarded acceptance, w = U (binary)','Non-binary: pass, conditional pass, conditional fail, fail']}]},
 {type:'grid',id:'m',title:'Results: as found and as left',rows:3,hint:'One row per test point. As found is the reading before any adjustment; as left is after. Leave as left blank when nothing was adjusted; the as-found reading is used. U is the expanded uncertainty at that point (k = 2).',cols:[
  {id:'pt',label:'Test point',w:110},
  {id:'un',label:'Units',w:60},
  {id:'nom',label:'Nominal',type:'number'},
  {id:'lo',label:'Low limit',type:'number'},
  {id:'hi',label:'High limit',type:'number'},
  {id:'af',label:'As found',type:'number'},
  {id:'al',label:'As left',type:'number'},
  {id:'U',label:'U (k=2)',type:'number',min:0},
  {id:'ae',label:'Error, found',calc:function(r,api){ var o=window.TOOL.h.row(r,api); return isNaN(o.af)||isNaN(o.nom)?'':(o.af-o.nom).toFixed(window.TOOL.h.dp(r)); }},
  {id:'ar',label:'Result, found',calc:function(r,api){ return window.TOOL.h.tag(window.TOOL.h.row(r,api).afd); }},
  {id:'lr',label:'Result, left',calc:function(r,api){ return window.TOOL.h.tag(window.TOOL.h.row(r,api).ald); }}]},
 {type:'custom',id:'sum',title:'Conformity statement and due date',html:'<div class="stat cc-stat"></div><div class="out cc-stm"></div><div class="out cc-out"></div>'},
 {type:'custom',id:'lbl',title:'Label preview',hint:'The label goes on the instrument so a user can see its status and due date at a glance.',html:'<div class="svgw cc-lbl"></div>'},
 {type:'custom',id:'el',title:'Certificate elements check',html:'<div class="out cc-el"></div>'}
],
update:function(root,api){
 var S=api.state(), T=window.TOOL, h=T.h, f=[], rule=T.RULES.indexOf(S.f.rule)<0?T.RULES[0]:S.f.rule, ri=T.RULES.indexOf(rule);
 var rows=S.g.m.map(function(r){ var o=h.row(r,api); o.r=r; return o; }).filter(function(o){ return o.afd||o.ald; });
 var afBad=rows.filter(function(o){ return o.afd==='F'||o.afd==='CF'; }), alBad=rows.filter(function(o){ return o.ald==='F'||o.ald==='CF'; }), alCond=rows.filter(function(o){ return o.ald==='CP'; });
 var due=h.due(api), cd=h.d(S.f.cdate), adj=S.f.adj||'No adjustment made', adjusted=adj!=='No adjustment made';
 root.querySelector('.cc-stat').innerHTML='<div><b>'+rows.length+'</b><span>Test points judged</span></div><div><b>'+afBad.length+'</b><span>Out of tolerance as found</span></div><div><b>'+alBad.length+'</b><span>Out of tolerance as left</span></div><div><b>'+(due?h.ds(due):'—')+'</b><span>Calibration due</span></div>';
 /* statement */
 var nm=api.esc(S.f.iid||'the instrument'), st='';
 if(rows.length){
  st='<p><b>Statement of conformity.</b> '+(afBad.length?nm+' was found out of tolerance as received at '+afBad.length+' of '+rows.length+' test point'+(rows.length>1?'s':'')+(adjusted?' and was '+(adj==='Adjusted'?'adjusted':'repaired and adjusted')+'. ':'. '):nm+' was found within tolerance as received at all '+rows.length+' test point'+(rows.length>1?'s':'')+(adjusted?' and was then '+(adj==='Adjusted'?'adjusted':'repaired and adjusted')+'. ':'. '))+
   (alBad.length?'As left it does <b>not conform</b> to the stated limits at '+alBad.length+' test point'+(alBad.length>1?'s':'')+'.':'As left it <b>conforms</b> to the stated limits'+(alCond.length?', '+alCond.length+' point'+(alCond.length>1?'s':'')+' only conditionally (within U of a limit)':'')+'.')+'</p>'+
   '<p><b>Decision rule.</b> '+(ri===0?'Simple acceptance (ILAC-G8:09/2019, guard band w = 0): a reading inside the limits is a pass. The risk of a false accept, up to 50% for a reading right at a limit, is shared with the customer.':ri===1?'Guarded acceptance with guard band w = U (ILAC-G8:09/2019): a reading is a pass only if it is at least U inside the limits, which keeps the probability of a false accept below about 2.5%.':'Non-binary statement with guard band w = U (ILAC-G8:09/2019): pass when the reading is at least U inside the limits; conditional pass when it is inside the limits but within U of one; conditional fail when it is outside but within U; fail when it is more than U outside.')+'</p><p>The results relate only to the item calibrated. Uncertainties are expanded uncertainties at a coverage factor k = 2, about 95% coverage.</p>';
 }
 root.querySelector('.cc-stm').innerHTML=st||'<p>Enter the results to draft the statement of conformity.</p>';
 /* checks */
 if(afBad.length) f.push(['warn','As found out of tolerance at '+afBad.map(function(o){ return api.esc(o.r.pt||String(o.nom)); }).join(', ')+'. Tell the customer, and start an out-of-tolerance impact review of the product measured since the last good calibration (see the <a href="/tools/cqt-calibration-oot-impact.html">OOT impact tool</a>).']);
 if(alBad.length) f.push(['warn','As left still out of tolerance at '+alBad.map(function(o){ return api.esc(o.r.pt||String(o.nom)); }).join(', ')+'. The instrument must not go back into service as calibrated: label it rejected, or issue a limited calibration if the customer can use it within a restricted range.']);
 if(adjusted&&!rows.some(function(o){ return o.alGiven; })) f.push(['warn','The instrument is marked as adjusted, but no as-left readings are entered. ISO/IEC 17025 asks for the results before and after adjustment.']);
 if(!adjusted&&rows.some(function(o){ return o.alGiven&&o.al!==o.af; })) f.push(['warn','As-left readings differ from as found but the record says no adjustment was made. Check the adjustment field.']);
 if(ri>0&&rows.some(function(o){ return !(o.U>0); })) f.push(['warn','The decision rule uses U, but some test points have no uncertainty entered; those are judged with U = 0.']);
 rows.forEach(function(o){ if(o.U>0&&o.ok&&o.U>=(o.hi-o.lo)/2) f.push(['warn',api.esc(o.r.pt||String(o.nom))+': U is as large as half the tolerance, so this point cannot be decided with any confidence.']); });
 var od=S.g.std.filter(function(r){ var d=h.d(r.due); return d&&cd&&d<cd; });
 if(od.length) f.push(['warn','Reference standard '+od.map(function(r){ return api.esc(r.id||''); }).join(', ')+' was past its own due date on the calibration date. Traceability is broken for this calibration; evaluate and repeat it with a current standard.']);
 var cdI=h.d(S.f.idate); if(cdI&&cd&&cdI<cd) f.push(['warn','The date of issue is before the date of calibration.']);
 if(!f.some(function(x){ return x[0]==='warn'; })&&rows.length) f.push(['ok','No problems found in the results, the standards or the dates.']);
 root.querySelector('.cc-out').innerHTML=api.flags(f,'Enter results to see the checks.');
 /* label */
 var lim=String(S.f.lim||'').trim(), stat=alBad.length?['REJECTED: DO NOT USE','#C0392B']:lim?['LIMITED CALIBRATION','#9C7C1F']:['CALIBRATED','#0F3E68'];
 var e=function(s,n){ s=String(s||'—'); return api.esc(s.length>n?s.slice(0,n-1)+'…':s); };
 var g='<svg viewBox="0 0 360 200" role="img" aria-label="Calibration label preview" class="cc-svg"><rect x="2" y="2" width="356" height="196" rx="10" fill="#fff" stroke="'+stat[1]+'" stroke-width="3"/><path d="M2,12 a10,10 0 0 1 10,-10 h336 a10,10 0 0 1 10,10 v32 h-356z" fill="'+stat[1]+'"/>'+
  '<text x="180" y="30" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="17" fill="#fff" letter-spacing="1.5">'+stat[0]+'</text>';
 var L=[['ID',S.f.iid],['CAL DATE',cd?h.ds(cd):''],['DUE',due?h.ds(due):(stat[0]==='CALIBRATED'?'':'—')],['BY',S.f.tech],['CERT',S.f.cert]];
 L.forEach(function(x,i){ var y=70+i*24; g+='<text x="20" y="'+y+'" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="700" fill="#4A5D71">'+x[0]+'</text><text x="110" y="'+y+'" font-family="IBM Plex Mono, monospace" font-size="14" font-weight="600" fill="#16273A">'+e(x[1],26)+'</text>'; });
 if(lim) g+='<text x="20" y="190" font-family="Archivo, sans-serif" font-size="10.5" fill="#9C7C1F">'+e(lim,60)+'</text>';
 g+='</svg>'; root.querySelector('.cc-lbl').innerHTML=g;
 /* elements */
 var el=[['Laboratory name and address',S.f.lab],['Unique certificate number',S.f.cert],['Customer',S.f.cust],['Method or procedure',S.f.proc],['Item description and identification',S.f.desc&&(S.f.iid||S.f.sn)],['Condition of the item as received',S.f.rcv],['Date of calibration',S.f.cdate],['Date of issue',S.f.idate],['Results with units',rows.length&&rows.every(function(o){ return o.r.un; })],['Measurement uncertainty at each point',rows.length&&rows.every(function(o){ return o.U>0; })],['Environmental conditions',S.f.env],['Traceability: reference standards and their certificates',S.g.std.some(function(r){ return r.id&&r.ct; })],['Results before and after adjustment',!adjusted||rows.some(function(o){ return o.alGiven; })],['Statement of conformity with the decision rule',rows.length&&S.f.rule],['Person authorizing the certificate',S.f.auth]];
 var miss=el.filter(function(x){ return !x[1]; });
 root.querySelector('.cc-el').innerHTML=api.flags([[miss.length?'warn':'ok',miss.length?'Missing from this record: '+miss.map(function(x){ return x[0].toLowerCase(); }).join('; ')+'.':'All '+el.length+' elements checked here are present.'],['','Checked against ISO/IEC 17025:2017 clause 7.8.2 (all reports), 7.8.4 (calibration certificates: uncertainty, environment, traceability, before and after adjustment) and 7.8.6 (statements of conformity). A calibration certificate or label should not recommend an interval unless the customer agreed to it (7.8.4.3).']]);
},
example:{f:{lab:'Calvero Metrology Lab, 1200 Instrument Way, Suite B',cert:'CML-26-04417',cust:'Tarnwick Pumps, Plant 2',acc:'',cdate:'2026-09-14',idate:'2026-09-15',int:'12',proc:'CP-TQ-03 rev D, torque wrench calibration (based on ISO 6789-2)',env:'20.6 °C ± 0.5 °C, 41 % RH',tech:'R. Delacroix',auth:'S. Moreno-Patel, Technical Manager',iid:'TQ-0417',desc:'Digital torque wrench, 20 to 100 N·m, ±4 % of reading',mfr:'Model TW-250',sn:'A55821',rcv:'Good working order',adj:'Adjusted',lim:'',rule:'Non-binary: pass, conditional pass, conditional fail, fail'},
 g:{std:[{id:'TS-02',ds:'Torque transducer, 0 to 200 N·m',ct:'TC-88213',due:'2027-03-01'},{id:'RD-11',ds:'Transducer readout',ct:'TC-88214',due:'2027-03-01'}],
  m:[{pt:'20 % of range',un:'N·m',nom:'20.0',lo:'19.2',hi:'20.8',af:'20.5',al:'20.2',U:'0.25'},{pt:'60 % of range',un:'N·m',nom:'60.0',lo:'57.6',hi:'62.4',af:'62.9',al:'60.3',U:'0.6'},{pt:'100 % of range',un:'N·m',nom:'100.0',lo:'96.0',hi:'104.0',af:'101.2',al:'100.6',U:'1.0'}]}}
}
