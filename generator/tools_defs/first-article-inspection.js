{
slug:'first-article-inspection',
h:{
 dp:function(v){ var m=String(v==null?'':v).trim().split('.')[1]; return m?m.replace(/[^0-9]/g,'').length:0; },
 lim:function(r,api){
  var n=api.num, nom=n(r.nom), tm=n(r.tm), tp=n(r.tp);
  if(isNaN(nom)||(isNaN(tm)&&isNaN(tp))) return null;
  var d=Math.max(this.dp(r.nom),this.dp(r.tm),this.dp(r.tp));
  var o={lo:isNaN(tm)?null:nom-Math.abs(tm), hi:isNaN(tp)?null:nom+Math.abs(tp), d:d};
  o.t=(o.lo===null?'— ':o.lo.toFixed(d))+' to '+(o.hi===null?'max — ':o.hi.toFixed(d));
  if(o.lo===null) o.t=o.hi.toFixed(d)+' max'; if(o.hi===null) o.t=o.lo.toFixed(d)+' min';
  return o;
 },
 res:function(r,api){
  var m=String(r.meas||'').trim(); if(!m) return null;
  var L=this.lim(r,api), v=api.num(m.replace(/^[+]/,''));
  if(L){ if(isNaN(v)) return {c:'mid',t:'Enter a number'};
   var e=1e-9, ok=(L.lo===null||v>=L.lo-e)&&(L.hi===null||v<=L.hi+e); return {c:ok?'ok':'bad',t:ok?'Pass':'Fail',v:v}; }
  if(/^(fail|nonconf|non-conf|nc\b|rej|no\b|does not|not\s*(conform|ok|acc|pass|meet))/i.test(m)) return {c:'bad',t:'Fail'};
  if(/^(conform|pass|ok|acc|yes|meets)/i.test(m)) return {c:'ok',t:'Pass'};
  if(!isNaN(v)) return {c:'mid',t:'No requirement'};
  return {c:'mid',t:'Unclear'};
 }
},
sections:[
 {type:'fields',title:'Part and reason for the first article',cols:3,hint:'A first article inspection (FAI) verifies, on a part made by the production process, that every design requirement on the drawing and its referenced specifications is met. It is a record of objective evidence, not a sample check.',fields:[
  {id:'org',label:'Organization (manufacturer)'},
  {id:'cust',label:'Customer'},
  {id:'po',label:'Purchase order'},
  {id:'pn',label:'Part number'},
  {id:'pname',label:'Part name'},
  {id:'sn',label:'FAI part serial or lot'},
  {id:'dwg',label:'Drawing number'},
  {id:'drev',label:'Drawing revision'},
  {id:'prev',label:'Revision on the purchase order',hint:'Must match the drawing revision inspected.'},
  {id:'why',label:'Reason for FAI',type:'select',opts:['New part, first production run','Design change (drawing or specification revision)','Process change (method, tooling, machine, location or source)','Lapse in production','Corrective action after a failed FAI']},
  {id:'kind',label:'Full or partial FAI',type:'select',opts:['Full','Partial (affected characteristics only)']},
  {id:'nb',label:'Balloons on the drawing (total)',type:'number',min:0,hint:'Highest characteristic number on the ballooned drawing.'},
  {id:'insp',label:'Inspected by'},
  {id:'dt',label:'Date',type:'date'},
  {id:'scope',label:'Scope of a partial FAI (which changes, which balloons)',type:'textarea',rows:1,wide:true}]},
 {type:'grid',id:'ch',title:'Characteristic accountability',rows:6,hint:'One row per balloon. Tolerances are magnitudes: enter 0.005 and 0.005 for ±0.005, 0 and 0.001 for +0.001/−0.000. Leave a side blank when there is no limit on that side (a max-only callout such as Ra 63 max: nominal 63, − blank, + 0). For notes and visual checks, leave the nominal blank and write Conforms or Fails as the result.',cols:[
  {id:'b',label:'Balloon',type:'number',min:1,w:60},
  {id:'req',label:'Characteristic and requirement',type:'textarea',rows:1,w:200},
  {id:'nom',label:'Nominal',type:'number'},
  {id:'tm',label:'Tol −',type:'number',min:0},
  {id:'tp',label:'Tol +',type:'number',min:0},
  {id:'lim',label:'Limits',calc:function(r,api){var L=window.TOOL.h.lim(r,api);return L?L.t:'';}},
  {id:'meas',label:'Measured result',w:96},
  {id:'tool',label:'Tool or gauge ID',w:96},
  {id:'res',label:'Result',calc:function(r,api){var x=window.TOOL.h.res(r,api);return x?'<span class="fa-'+x.c+'">'+x.t+'</span>':'';}}]},
 {type:'grid',id:'cert',title:'Material, special process and functional test evidence',rows:3,hint:'Raw material, special processes (heat treat, plating, anodize, welding, nondestructive testing) and any functional test the drawing or purchase order calls for. Each needs a certificate or report you can trace to this part.',cols:[
  {id:'item',label:'Material, process or test',type:'textarea',rows:1,w:170},
  {id:'spec',label:'Specification',w:130},
  {id:'src',label:'Supplier or source',w:120},
  {id:'cno',label:'Certificate or report no.',w:110},
  {id:'appr',label:'Approved source',type:'select',opts:['Yes','No','Not required']},
  {id:'rs',label:'Result',type:'select',opts:['Conforms','Nonconforming','Pending']}]},
 {type:'custom',id:'out',title:'FAI status and checks',html:'<div class="stat fa-stat"></div><div class="out fa-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), n=api.num, f=[], esc=api.esc;
 var rows=S.g.ch.filter(function(r){return r.b||r.req||r.meas||r.nom;});
 var certs=S.g.cert.filter(function(r){return r.item||r.cno||r.spec;});
 var st=root.querySelector('.fa-stat');
 if(!rows.length&&!certs.length&&!S.f.pn){ root.querySelectorAll('table.tg textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });  st.innerHTML=''; st.style.display='none'; root.querySelector('.fa-out').innerHTML=api.flags([],'Enter the part, then one row per balloon on the drawing. The checks show unaccounted characteristics, failures and missing evidence.'); return; }
 st.style.display='';
 var pass=0,fail=[],open=[],noTool=[],unclear=[],seen={},dup=[],bad=[];
 var NB=Math.round(n(S.f.nb)), partial=/^Partial/.test(S.f.kind||'');
 rows.forEach(function(r,i){
  var b=Math.round(n(r.b)), nm=isNaN(b)?'row '+(i+1):'balloon '+b, x=T.h.res(r,api);
  if(isNaN(b)) bad.push('row '+(i+1)); else { if(seen[b]) dup.push(b); seen[b]=1; }
  if(!x) open.push(nm); else if(x.c==='ok') pass++; else if(x.c==='bad') fail.push('<b>'+nm+'</b> ('+esc(r.req||'')+(x.v!==undefined?': measured '+esc(r.meas):'')+')'); else unclear.push(nm+' ('+x.t.toLowerCase()+')');
  if(String(r.meas||'').trim()&&!String(r.tool||'').trim()) noTool.push(nm);
 });
 var missing=[], extra=[];
 if(NB>0){ for(var k=1;k<=NB;k++) if(!seen[k]) missing.push(k); Object.keys(seen).forEach(function(k){ if(+k>NB||+k<1) extra.push(k); }); }
 var cOpen=certs.filter(function(c){return c.rs!=='Conforms';}), cNC=certs.filter(function(c){return c.rs==='Nonconforming';});
 var acc=NB>0?(NB-missing.length):rows.length;
 st.innerHTML='<div><b>'+rows.length+'</b><span>Characteristics recorded</span></div>'+
  '<div><b>'+(NB>0?(partial?rows.length+' of '+NB:acc+' of '+NB):'—')+'</b><span>'+(partial?'Balloons in this partial FAI':'Balloons accounted for')+'</span></div>'+
  '<div><b>'+pass+'</b><span>Pass</span></div><div><b class="'+(fail.length?'fa-bad':'')+'">'+fail.length+'</b><span>Fail</span></div>'+
  '<div><b>'+open.length+'</b><span>No result yet</span></div><div><b>'+(certs.length-cOpen.length)+' of '+certs.length+'</b><span>Certificates conforming</span></div>';
 var complete=!fail.length&&!open.length&&!unclear.length&&!noTool.length&&!cOpen.length&&rows.length&&(partial||(NB>0&&!missing.length))&&!dup.length;
 f.push([complete?'ok':'warn',complete?'<b>FAI complete.</b> Every characteristic in scope has a conforming result, a recorded tool and traceable evidence. The production process is verified for this part number and revision.':'<b>FAI not complete.</b> The part cannot be released on this FAI until every item below is closed: a failed characteristic means correcting the process and repeating the FAI for at least the affected characteristics.']);
 if(S.f.drev&&S.f.prev&&String(S.f.drev).trim().toUpperCase()!==String(S.f.prev).trim().toUpperCase()) f.push(['warn','Drawing revision <b>'+esc(S.f.drev)+'</b> does not match the revision on the purchase order (<b>'+esc(S.f.prev)+'</b>). Resolve which revision the customer ordered before accepting the FAI.']);
 if(!S.f.why) f.push(['warn','Record the reason for the FAI. It decides whether a full or a partial FAI is enough.']);
 if(fail.length) f.push(['warn','Failed: '+fail.join('; ')+'. Document a nonconformance, correct the cause and re-inspect on a part from the corrected process.']);
 if(!partial&&NB>0&&missing.length) f.push(['warn','<b>Unaccounted balloon'+(missing.length>1?'s':'')+': '+missing.join(', ')+'.</b> A full FAI must show a result for every characteristic on the drawing, including notes, finishes and referenced specifications. A missing balloon is a common reason an FAI is rejected.']);
 if(!partial&&!(NB>0)&&rows.length) f.push(['warn','Enter the total number of balloons on the drawing so the tool can check that every characteristic is accounted for.']);
 if(extra.length) f.push(['warn','Balloon number'+(extra.length>1?'s':'')+' '+extra.join(', ')+' '+(extra.length>1?'are':'is')+' outside 1 to '+NB+'. Check the balloon count or the numbering.']);
 if(dup.length) f.push(['warn','Balloon'+(dup.length>1?'s':'')+' '+dup.join(', ')+' '+(dup.length>1?'appear':'appears')+' more than once. Give each feature of a multiple callout (4X) one row with its own result, or record the worst case once and note it.']);
 if(bad.length) f.push(['warn','No balloon number on '+bad.join(', ')+'.']);
 if(noTool.length) f.push(['warn','No tool or gauge recorded for '+noTool.join(', ')+'. The record must show what each result was measured with, so the gauge calibration can be traced.']);
 if(open.length) f.push(['warn','No result yet for '+open.join(', ')+'.']);
 if(unclear.length) f.push(['warn','Check the result entry for '+unclear.join(', ')+'.']);
 if(partial){
  f.push(['','<b>Partial FAI.</b> Only the characteristics affected by the change are re-verified; the earlier full FAI stays the record for the rest. '+(S.f.scope?'Scope: '+esc(S.f.scope)+'.':'Describe the scope: which change, which balloons.')]);
  if(/^New part/.test(S.f.why||'')) f.push(['warn','A new part needs a full FAI. A partial FAI applies only to changes after a full FAI has been accepted.']);
 }
 if(/^Lapse/.test(S.f.why||'')) f.push(['','A lapse in production is usually defined by the customer or the standard (AS9102 uses two years). Check the customer requirement for the period that triggers a new FAI.']);
 cNC.forEach(function(c){ f.push(['warn','<b>'+esc(c.item)+'</b> is nonconforming. The FAI cannot be accepted on this material or process lot.']); });
 certs.forEach(function(c){ var nm='<b>'+esc(c.item||c.spec||'Certificate')+'</b>';
  if(c.rs==='Pending'||!c.rs) f.push(['warn',nm+': result '+(c.rs?'pending':'not entered')+'.'+(c.cno?'':' No certificate number recorded.')]);
  else if(!c.cno&&c.rs==='Conforms') f.push(['warn',nm+': no certificate or report number. Evidence must be traceable to this part.']);
  if(c.appr==='No') f.push(['warn',nm+': source is not approved. Customer-specified special processes must come from approved sources.']);
 });
 if(rows.length&&!certs.length) f.push(['warn','No material or special process evidence listed. A full FAI also covers raw material and every specification the drawing references.']);
 root.querySelector('.fa-out').innerHTML=api.flags(f);
 root.querySelectorAll('table.tg textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });

},
example:{f:{org:'Larkspur Aerostructures, cell 3',cust:'Westwind Rotor Systems',po:'PO 58831',pn:'4471-202',pname:'Actuator mounting bracket',sn:'S/N 0001',dwg:'4471-202',drev:'B',prev:'B',why:'New part, first production run',kind:'Full',nb:'14',insp:'T. Okafor',dt:'2026-09-22',scope:''},
 g:{ch:[
  {b:'1',req:'Overall length 4.500 ±.010',nom:'4.500',tm:'0.010',tp:'0.010',meas:'4.503',tool:'CAL-07'},
  {b:'2',req:'Overall width 2.250 ±.010',nom:'2.250',tm:'0.010',tp:'0.010',meas:'2.247',tool:'CAL-07'},
  {b:'3',req:'Thickness .375 ±.005',nom:'0.375',tm:'0.005',tp:'0.005',meas:'0.3762',tool:'MIC-12'},
  {b:'4',req:'Bore Ø.5000 +.0010/−.0000',nom:'0.5000',tm:'0',tp:'0.0010',meas:'0.5004',tool:'BG-03'},
  {b:'5',req:'Bore location X 1.250 ±.005',nom:'1.250',tm:'0.005',tp:'0.005',meas:'1.2515',tool:'CMM-1'},
  {b:'6',req:'Bore location Y 1.125 ±.005',nom:'1.125',tm:'0.005',tp:'0.005',meas:'1.1278',tool:'CMM-1'},
  {b:'7',req:'4X hole Ø.201 ±.003 (largest of 4)',nom:'0.201',tm:'0.003',tp:'0.003',meas:'0.2052',tool:'PIN-SET-2'},
  {b:'8',req:'Hole pattern spacing 3.000 ±.005',nom:'3.000',tm:'0.005',tp:'0.005',meas:'3.0021',tool:'CMM-1'},
  {b:'10',req:'4X corner radius R.125 ±.010',nom:'',tm:'',tp:'',meas:'Conforms',tool:'RG-01'},
  {b:'11',req:'Flatness .003 max, datum A face',nom:'0.003',tm:'',tp:'0',meas:'0.0018',tool:'CMM-1'},
  {b:'12',req:'Surface finish Ra 63 µin max',nom:'63',tm:'',tp:'0',meas:'48',tool:''},
  {b:'13',req:'Note 2: break sharp edges .005–.015',nom:'',tm:'',tp:'',meas:'Conforms',tool:'Visual, EB-02'},
  {b:'14',req:'Note 4: part mark P/N and S/N per spec',nom:'',tm:'',tp:'',meas:'Conforms',tool:'Visual'}],
 cert:[
  {item:'Raw material 6061-T651 plate',spec:'AMS-QQ-A-250/11',src:'Metals distributor (mill cert)',cno:'Heat 7Z4419',appr:'Yes',rs:'Conforms'},
  {item:'Anodize, sulfuric, Type II Class 1',spec:'MIL-PRF-8625',src:'Approved finisher',cno:'C-22817',appr:'Yes',rs:'Conforms'},
  {item:'Chemical film on masked bore',spec:'MIL-DTL-5541',src:'Approved finisher',cno:'',appr:'Yes',rs:'Pending'}]}}
}
