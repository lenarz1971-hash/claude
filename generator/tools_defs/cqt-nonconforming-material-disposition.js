{
slug:'cqt-nonconforming-material-disposition',
h:{
 d:['Use as is','Repair','Rework','Regrade','Return to supplier','Scrap'],
 dev:function(x){ return x==='Use as is'||x==='Repair'; }
},
sections:[
 {type:'fields',title:'Nonconformance',cols:3,fields:[
  {id:'ncr',label:'NCR number'},{id:'date',label:'Date found',type:'date'},
  {id:'where',label:'Detected at',type:'select',opts:['Receiving inspection','In-process','Final inspection','Customer','Audit']},
  {id:'part',label:'Part number and revision'},{id:'desc',label:'Part description'},
  {id:'src',label:'Source (supplier, line or cell)'},
  {id:'req',label:'Requirement (drawing, spec, clause)',wide:true,type:'textarea'},
  {id:'act',label:'Actual condition found',wide:true,type:'textarea'},
  {id:'cls',label:'Classification',type:'select',opts:['Critical','Major','Minor']},
  {id:'lot',label:'Lot size',type:'number',min:0},
  {id:'tag',label:'Hold tag or segregation location'}]},
 {type:'grid',id:'loc',title:'Containment: where the suspect product is',rows:3,hint:'One row per location. Count what is suspect there, how many have been inspected, and how many of those were nonconforming. The totals must reconcile with the lot.',cols:[
  {id:'l',label:'Location',w:150,type:'textarea',rows:1},{id:'s',label:'Qty suspect',type:'number',min:0},
  {id:'i',label:'Qty inspected',type:'number',min:0},{id:'nc',label:'Qty nonconforming',type:'number',min:0},
  {id:'by',label:'Contained by',w:100},
  {id:'st',label:'Status',calc:function(r,api){var s=api.num(r.s),i=api.num(r.i),nc=api.num(r.nc);if(!r.l)return '';if(!(s>=0))return '<span class="nm-bad">Qty?</span>';if(i>s||nc>i)return '<span class="nm-bad">Check counts</span>';if(!(i>=0)||i<s)return '<span class="nm-mid">'+api.fmt(s-(i||0),0)+' to sort</span>';return '<span class="nm-ok">Sorted</span>';}}]},
 {type:'grid',id:'dsp',title:'Disposition (MRB)',rows:3,hint:'Split the nonconforming quantity across dispositions. Use as is and repair leave the part not meeting the original requirement, so they need engineering approval and, where the contract requires it, the customer\'s written concession.',cols:[
  {id:'d',label:'Disposition',type:'select',w:140,opts:['Use as is','Repair','Rework','Regrade','Return to supplier','Scrap']},
  {id:'q',label:'Qty',type:'number',min:0},{id:'c',label:'Cost each $',type:'number',min:0},
  {id:'ap',label:'Approved by',w:120},{id:'cc',label:'Customer concession no.',w:110},
  {id:'ext',label:'Cost',calc:function(r,api){var q=api.num(r.q),c=api.num(r.c);return r.d&&q>=0&&c>=0?'$'+api.fmt(q*c,0):'';}},
  {id:'nx',label:'Then',calc:function(r,api){return ({'Use as is':'Record concession; mark','Repair':'Approved procedure; reinspect','Rework':'Reinspect to original spec','Regrade':'Relabel; restrict use','Return to supplier':'RMA; supplier CAPA','Scrap':'Mutilate; record'})[r.d]||'';}}]},
 {type:'fields',title:'Closure',cols:3,fields:[
  {id:'capa',label:'Corrective action reference',hint:'Leave blank if the MRB decided none is needed, and say why below.'},
  {id:'mrb',label:'MRB members'},{id:'close',label:'Closed',type:'date'},
  {id:'note',label:'Notes and rationale',wide:true,type:'textarea'}]},
 {type:'custom',id:'res',title:'Reconciliation and checks',html:'<div class="tgw"><table class="mv nm-t"></table></div><div class="out nm-out"></div>'}
],
update:function(root,api){
 var S=api.state(), h=window.TOOL.h, n=api.num, f=[], L=S.g.loc.filter(function(r){return r.l;}), D=S.g.dsp.filter(function(r){return r.d;});
 var ts=0,ti=0,tn=0; L.forEach(function(r){ ts+=n(r.s)||0; ti+=n(r.i)||0; tn+=n(r.nc)||0; });
 var tq=0,cost=0,by={}; D.forEach(function(r){ var q=n(r.q)||0; tq+=q; cost+=q*(n(r.c)||0); by[r.d]=(by[r.d]||0)+q; });
 var lot=n(S.f.lot), any=L.length||D.length||S.f.ncr||S.f.act;
 var tb=root.querySelector('table.nm-t');
 if(L.length||D.length){
  var rr=[['Suspect quantity located',api.fmt(ts,0)+(lot>0?' of '+api.fmt(lot,0)+' in the lot':'')],['Inspected (sorted)',api.fmt(ti,0)+(ts>0?' ('+(ti/ts*100).toFixed(0)+'%)':'')],['Nonconforming found',api.fmt(tn,0)+(ti>0?' ('+(tn/ti*100).toFixed(1)+'% of inspected)':'')],['Dispositioned',api.fmt(tq,0)+(tn>0?' of '+api.fmt(tn,0)+' nonconforming':'')],['Cost of disposition','$'+api.fmt(cost,0)]];
  tb.innerHTML='<tbody>'+rr.map(function(x){return '<tr><td class="mo">'+x[0]+'</td><td class="mt">'+x[1]+'</td></tr>';}).join('')+'</tbody>';
 } else tb.innerHTML='';
 if(!any){ root.querySelector('.nm-out').innerHTML=api.flags([],'Describe the nonconformance and where the product is to start the record.'); return; }
 if(!S.f.req||!S.f.act) f.push(['warn','State both the requirement and the actual condition. A nonconformance is the gap between the two; without the requirement the MRB has nothing to judge against.']);
 if(!S.f.tag) f.push(['warn','No hold tag or segregation location recorded. Nonconforming product must be identified and kept apart so it cannot be used by mistake (ISO 9001:2015 clause 8.7).']);
 if(lot>0&&L.length){ if(ts<lot) f.push(['warn','Containment located '+api.fmt(ts,0)+' of '+api.fmt(lot,0)+' pieces. '+api.fmt(lot-ts,0)+' are unaccounted for; find them (shipped, in transit, consumed) before closing containment.']); else if(ts>lot) f.push(['warn','Locations add to '+api.fmt(ts,0)+', more than the lot of '+api.fmt(lot,0)+'. Check for double counting.']); else f.push(['ok','Containment reconciles: all '+api.fmt(lot,0)+' pieces in the lot are located.']); }
 if(ti<ts) f.push(['warn',api.fmt(ts-ti,0)+' suspect pieces are still unsorted and remain on hold.']);
 L.forEach(function(r){ var s=n(r.s),i=n(r.i),c=n(r.nc); if(i>s||c>i) f.push(['warn','Counts do not add up at <b>'+api.esc(r.l)+'</b>: inspected cannot exceed suspect, and nonconforming cannot exceed inspected.']); if(/customer|shipped|field/i.test(r.l)&&s>0) f.push(['warn','Suspect product has reached <b>'+api.esc(r.l)+'</b>. Notify the customer and agree how it will be contained there.']); });
 if(D.length||tn){ if(tq<tn) f.push(['warn',api.fmt(tn-tq,0)+' nonconforming pieces have no disposition yet.']); else if(tq>tn) f.push(['warn','Dispositions total '+api.fmt(tq,0)+', more than the '+api.fmt(tn,0)+' nonconforming pieces found.']); else f.push(['ok','Every nonconforming piece found ('+api.fmt(tn,0)+') has a disposition. Cost of disposition: $'+api.fmt(cost,0)+'.']); }
 D.forEach(function(r){ var q=api.esc(r.q||'?')+' × '+api.esc(r.d);
  if(!r.ap) f.push(['warn',q+' has no approver. Dispositions are decided by people with the authority to do so, usually the MRB.']);
  if(h.dev(r.d)&&!r.cc) f.push(['warn',q+': the parts will not meet the original requirement. Get engineering approval and check the contract; many customers require a written concession before this is shipped.']);
  if(h.dev(r.d)&&S.f.cls==='Critical') f.push(['warn',q+' on a critical characteristic. Critical nonconformities are not normally accepted by concession; justify this in writing.']); });
 if(by['Rework']) f.push(['','Rework brings the part back to the original requirement, so reworked parts are reinspected to that requirement before release. Repair makes the part usable but still not conforming, which is why it needs the same approval as use as is.']);
 if(!S.f.capa) f.push([S.f.cls==='Minor'?'':'warn','No corrective action reference. Disposition deals with the parts; a corrective action deals with the cause. Record why none is needed if the MRB decided so.']);
 else f.push(['ok','Linked to corrective action <b>'+api.esc(S.f.capa)+'</b>. Disposition fixes this lot; the corrective action is what stops the next one.']);
 root.querySelector('.nm-out').innerHTML=api.flags(f);
},
example:{f:{ncr:'NCR-26-0418',date:'2026-09-22',where:'In-process',part:'HB-2207 rev C',desc:'Aluminum mounting bracket, anodized',src:'Supplier: Granite Ridge Metal Finishing (anodize)',req:'Drawing HB-2207C note 4: Type II anodize, 0.0004–0.0008 in coating thickness; hole Ø0.257–0.261 in after finish',act:'Coating 0.0011–0.0014 in on sampled parts; finished holes measure Ø0.2555–0.2565 in, below minimum',cls:'Major',lot:'1200',tag:'Red-tag cage 3, tag H-5521',capa:'CAR-26-061 (supplier)',mrb:'Quality, manufacturing engineering, purchasing',close:'',note:'Customer agreement 7.3 requires a concession for any use-as-is on a drawn dimension. Oversize coating can be stripped and re-anodized by the supplier.'},
 g:{loc:[
  {l:'Receiving / stores',s:'640',i:'640',nc:'612',by:'J. Ortiz'},
  {l:'Assembly cell 2 WIP',s:'380',i:'380',nc:'351',by:'K. Brandt'},
  {l:'Finished goods',s:'180',i:'180',nc:'158',by:'J. Ortiz'}],
 dsp:[
  {d:'Return to supplier',q:'920',c:'0',ap:'MRB 9/24',cc:''},
  {d:'Rework',q:'166',c:'3.40',ap:'MRB 9/24',cc:''},
  {d:'Scrap',q:'35',c:'11.80',ap:'MRB 9/24',cc:''}]}}
}
