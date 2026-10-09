{
slug:'supplier-scorecard',
sections:[
 {type:'fields',title:'Scorecard setup',cols:3,hint:'Set the classification thresholds before you score anyone. A supplier at or above the first threshold is Preferred; below the last one is Disqualify.',fields:[
  {id:'org',label:'Organization and scope',wide:true,ph:'e.g. Packaging and ingredient suppliers, plant 2'},
  {id:'per',label:'Scoring period',ph:'e.g. Q3 2026'},
  {id:'own',label:'Scorecard owner',ph:'Name or role'},
  {id:'rev',label:'Review with suppliers on',type:'date'},
  {id:'tp',label:'Preferred at or above',type:'number',min:0,max:100,ph:'85'},
  {id:'ta',label:'Approved at or above',type:'number',min:0,max:100,ph:'70'},
  {id:'tc',label:'Conditional at or above',type:'number',min:0,max:100,ph:'55'}]},
 {type:'fields',title:'Selection and approval criteria',hint:'What a new supplier must show before the first order, and what certification means in your system. The scorecard below rates suppliers who are already approved.',fields:[
  {id:'appr',label:'Approval requirements, one per row',type:'datagrid',cols:[{label:'Requirement a new supplier must meet',type:'text'}],rows:5,minRows:3},
  {id:'certn',label:'Certification status note',type:'textarea',rows:3,wide:true,ph:'e.g. Certified (ship-to-stock) status requires 12 months at Preferred and a passed process audit; lapses on any Conditional quarter.'}]},
 {type:'grid',id:'c',title:'Criteria and weights',rows:4,hint:'Weights are percentages and should total 100. Each criterion is converted to 0 to 100 points: enter the value that earns 0 points and the value that earns 100, and the tool scales linearly between them (it works in either direction, so for PPM the 100-point value is the low one). Leave both blank to enter points 0 to 100 directly. Set Source to "PPM from receipts" to calculate PPM from the supplier table.',cols:[
  {id:'n',label:'Criterion',w:170,type:'textarea',rows:1},
  {id:'cat',label:'Category',type:'select',opts:['Quality','Delivery','Cost','Service','Other']},
  {id:'w',label:'Weight %',type:'number',min:0,max:100},
  {id:'how',label:'How it is measured',w:200,type:'textarea',rows:1},
  {id:'src',label:'Source',w:175,type:'select',opts:['Entered per supplier','PPM from receipts']},
  {id:'z',label:'0 points at',type:'number'},
  {id:'full',label:'100 points at',type:'number'},
  {id:'rule',label:'Scoring',calc:function(r,api){var z=api.num(r.z),f=api.num(r.full);if(!r.n)return '';if(isNaN(z)&&isNaN(f))return 'Points 0–100';if(isNaN(z)||isNaN(f))return 'Needs both';if(z===f)return 'Invalid';return (f<z?'≤':'≥')+api.fmt(f)+' = 100<br>'+(f<z?'≥':'≤')+api.fmt(z)+' = 0';}}]},
 {type:'grid',id:'s',title:'Suppliers and receipts',rows:3,hint:'Units received and units defective for the period give parts per million (PPM). Use the same unit for both: pieces, bags, labels, pallets.',cols:[
  {id:'sup',label:'Supplier',w:170},
  {id:'com',label:'Commodity',w:130},
  {id:'cert',label:'Certification',type:'select',opts:['GFSI scheme (SQF, BRCGS, FSSC 22000)','ISO 9001','IATF 16949','AS9100','ISO 13485','Internal: certified ship-to-stock','None','Lapsed or suspended']},
  {id:'rec',label:'Units received',type:'number',min:0},
  {id:'def',label:'Units defective',type:'number',min:0},
  {id:'ppm',label:'PPM',calc:function(r,api){var a=api.num(r.rec),d=api.num(r.def);if(!r.sup||isNaN(a)||isNaN(d)||a<=0)return '';return api.fmt(d/a*1e6,0);}}]},
 {type:'custom',id:'mx',title:'Performance this period',hint:'Enter each supplier\'s actual result in the criterion\'s own unit (on-time %, TCO ratio, survey score). PPM columns fill themselves from the receipts table.',html:'<div class="tgw"><table class="mv sc-in"></table></div>'},
 {type:'custom',id:'res',title:'Scores and classification',html:'<div class="tgw"><table class="mv sc-res"></table></div><div class="svgw sc-chart"></div><div class="out sc-out"></div>'}
],
blankX:function(){return {v:{}};},
update:function(root,api){
 var S=api.state(), n=api.num, v=S.x.v||(S.x.v={}), esc=api.esc, f=[];
 var C=S.g.c.filter(function(r){return r.n;}), P=S.g.s.filter(function(r){return r.sup;});
 var tP=n(S.f.tp), tA=n(S.f.ta), tC=n(S.f.tc); if(isNaN(tP))tP=85; if(isNaN(tA))tA=70; if(isNaN(tC))tC=55;
 var tb=root.querySelector('table.sc-in'), rt=root.querySelector('table.sc-res'), ch=root.querySelector('.sc-chart'), out=root.querySelector('.sc-out');
 var appr=api.lines('appr');
 if(!C.length||!P.length){
  tb.innerHTML='<tr><td class="th">Add at least one named criterion and one supplier.</td></tr>'; tb.dataset.sig=''; rt.innerHTML=''; ch.innerHTML='';
  out.innerHTML=api.flags([],'Name the criteria and the suppliers, then enter each supplier\'s results. The weighted scores and checks appear here.'); return; }
 function ppmOf(p){ var a=n(p.rec), d=n(p.def); return (isNaN(a)||isNaN(d)||a<=0)?NaN:d/a*1e6; }
 var sig=JSON.stringify([P.map(function(p){return p.sup;}),C.map(function(c){return c.n+'|'+c.src;})]);
 if(tb.dataset.sig!==sig||!tb.querySelector('thead')){
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>Supplier</th>'+C.map(function(c){return '<th>'+esc(c.n)+'</th>';}).join('')+'</tr></thead><tbody>'+P.map(function(p,i){return '<tr><td class="mo">'+esc(p.sup)+'</td>'+C.map(function(c,j){var k=p.sup+'|'+c.n; if(c.src==='PPM from receipts') return '<td class="mt" data-pp="'+i+'"></td>'; return '<td><input type="number" data-sv="'+esc(k)+'" value="'+(v[k]!=null?v[k]:'')+'" aria-label="'+esc(p.sup)+', '+esc(c.n)+'"></td>';}).join('')+'</tr>';}).join('')+'</tbody>';
  tb.querySelectorAll('input[data-sv]').forEach(function(inp){ inp.oninput=function(){ var x=n(inp.value); if(isNaN(x)) delete v[inp.dataset.sv]; else v[inp.dataset.sv]=x; api.save(); }; });
 }
 tb.querySelectorAll('[data-pp]').forEach(function(td){ var x=ppmOf(P[+td.dataset.pp]); td.textContent=isNaN(x)?'—':api.fmt(x,0); });
 var W=C.reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)?0:w);},0);
 var badRule=[], outRange=[], miss=[];
 C.forEach(function(c){ var z=n(c.z), u=n(c.full); if((isNaN(z)!==isNaN(u))||(!isNaN(z)&&z===u)) badRule.push(c.n); });
 var res=P.map(function(p){
  var tot=0, pts=[];
  C.forEach(function(c){
   var w=n(c.w), x=c.src==='PPM from receipts'?ppmOf(p):v[p.sup+'|'+c.n], z=n(c.z), u=n(c.full), pt;
   if(x==null||isNaN(x)){ miss.push(p.sup+' / '+c.n); pts.push(NaN); return; }
   if(isNaN(z)&&isNaN(u)){ if(x<0||x>100) outRange.push(p.sup+' / '+c.n); pt=Math.max(0,Math.min(100,x)); }
   else if(isNaN(z)||isNaN(u)||z===u){ pts.push(NaN); return; }
   else pt=Math.max(0,Math.min(100,(x-z)/(u-z)*100));
   pts.push(pt); if(!isNaN(w)) tot+=w*pt; });
  var sc=W?tot/W:NaN, cls=isNaN(sc)?'':sc>=tP?'Preferred':sc>=tA?'Approved':sc>=tC?'Conditional':'Disqualify';
  return {p:p,pts:pts,sc:sc,cls:cls}; });
 rt.innerHTML='<thead><tr><th>Supplier</th>'+C.map(function(c){return '<th>'+esc(c.n)+(isNaN(n(c.w))?'':'<br>'+api.fmt(n(c.w),0)+'%')+'</th>';}).join('')+'<th>Weighted score</th><th>Class</th></tr></thead><tbody>'+res.map(function(r){return '<tr><td class="mo">'+esc(r.p.sup)+'</td>'+r.pts.map(function(x){return '<td>'+(isNaN(x)?'—':x.toFixed(0))+'</td>';}).join('')+'<td class="mt">'+(isNaN(r.sc)?'—':r.sc.toFixed(1))+'</td><td class="sc-c sc-'+(r.cls||'x').toLowerCase()+'">'+(r.cls||'—')+'</td></tr>';}).join('')+'</tbody><tfoot><tr><td>Points per criterion, 0 to 100</td>'+C.map(function(){return '<td></td>';}).join('')+'<td>Weights '+api.fmt(W,0)+'%</td><td></td></tr></tfoot>';
 /* chart */
 var ok=res.filter(function(r){return !isNaN(r.sc);}).sort(function(a,b){return b.sc-a.sc;});
 if(ok.length){
  var Wd=640, rh=30, L=190, R=70, top=24, H=top+ok.length*rh+8, sx=function(x){return L+(Wd-L-R)*x/100;};
  var col={Preferred:'#1F8C55',Approved:'#0F3E68',Conditional:'#D8B147',Disqualify:'#C0392B'};
  var g='<svg viewBox="0 0 '+Wd+' '+H+'" role="img" aria-label="Weighted supplier scores"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.t{font-size:11px;fill:#4A5D71}</style>';
  [[tC,'Conditional'],[tA,'Approved'],[tP,'Preferred']].forEach(function(t){ g+='<line x1="'+sx(t[0])+'" x2="'+sx(t[0])+'" y1="'+(top-6)+'" y2="'+(H-4)+'" stroke="#7C8B99" stroke-dasharray="3 3"/><text class="t" x="'+sx(t[0])+'" y="'+(top-10)+'" text-anchor="middle">'+t[0]+'</text>'; });
  ok.forEach(function(r,i){ var y=top+i*rh, lab=r.p.sup.length>26?r.p.sup.slice(0,25)+'…':r.p.sup;
   g+='<text x="'+(L-8)+'" y="'+(y+18)+'" text-anchor="end">'+esc(lab)+'</text><rect x="'+L+'" y="'+(y+5)+'" width="'+Math.max(1,sx(r.sc)-L)+'" height="18" fill="'+col[r.cls]+'"/><text x="'+(sx(r.sc)+6)+'" y="'+(y+18)+'">'+r.sc.toFixed(1)+'</text>'; });
  ch.innerHTML=g+'</svg>';
 } else ch.innerHTML='';
 /* flags */
 if(ok.length) f.push(['ok','Highest score: <b>'+esc(ok[0].p.sup)+'</b> at '+ok[0].sc.toFixed(1)+' ('+ok[0].cls+'). '+['Preferred','Approved','Conditional','Disqualify'].map(function(k){var m=res.filter(function(r){return r.cls===k;}).length;return m+' '+k;}).join(', ')+'.']);
 if(!W) f.push(['warn','Give the criteria weights.']);
 else if(Math.abs(W-100)>0.01) f.push(['warn','Weights total '+api.fmt(W,1)+'%, not 100%. The scores are divided by the total so they stay on a 0 to 100 scale, but fix the weights so each one says what share of the decision it carries.']);
 if(!(tP>tA&&tA>tC)) f.push(['warn','The thresholds should run Preferred &gt; Approved &gt; Conditional. Check '+tP+' / '+tA+' / '+tC+'.']);
 if(W){
  var mx=C.reduce(function(a,c){var w=n(c.w);return !isNaN(w)&&w>a.w?{w:w,c:c}:a;},{w:0,c:null});
  if(mx.c&&mx.w/W>=0.5) f.push(['warn','<b>'+esc(mx.c.n)+'</b> carries '+(mx.w/W*100).toFixed(0)+'% of the weight. One criterion that heavy decides the classification almost on its own; the others become decoration.']);
  var cw=C.filter(function(c){return c.cat==='Cost';}).reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)?0:w);},0);
  if(cw/W>=0.4) f.push(['warn','Cost criteria carry '+(cw/W*100).toFixed(0)+'% of the weight. A scorecard dominated by price rewards the cheapest quote and hides the cost of poor quality, late deliveries and expediting. Consider total cost of ownership instead of unit price.']);
  else if(C.some(function(c){return c.cat==='Cost'&&/price/i.test(c.n)&&!/total|tco|ownership/i.test(c.n);})) f.push(['','A cost criterion is based on price. Purchase price is only part of total cost of ownership; freight, inspection, inventory, scrap and administration often change the ranking.']);
  ['Quality','Delivery'].forEach(function(k){ if(!C.some(function(c){return c.cat===k;})) f.push(['warn','No '+k.toLowerCase()+' criterion. Quality, delivery, cost and service are the usual four; leaving one out means a supplier can fail it without the score showing it.']); });
 }
 if(badRule.length) f.push(['warn','Scoring range incomplete or invalid for: '+badRule.map(esc).join(', ')+'. Enter both the 0-point and the 100-point value, and make them different, or leave both blank.']);
 if(outRange.length) f.push(['warn','Points entered directly must be 0 to 100: '+outRange.map(esc).join(', ')+'.']);
 if(miss.length) f.push(['warn','Missing results score as 0 points, which pulls the total down: '+miss.slice(0,6).map(esc).join(', ')+(miss.length>6?' and '+(miss.length-6)+' more':'')+'.']);
 var badD=P.filter(function(p){return n(p.def)>n(p.rec);}); if(badD.length) f.push(['warn','More defective units than units received for '+badD.map(function(p){return esc(p.sup);}).join(', ')+'. Check the units; both counts must be in the same unit.']);
 var pp=P.filter(function(p){return !isNaN(ppmOf(p));});
 if(pp.length) f.push(['','PPM check: defective ÷ received × 1,000,000. '+pp.slice(0,3).map(function(p){return esc(p.sup)+': '+api.fmt(n(p.def))+' ÷ '+api.fmt(n(p.rec))+' × 1,000,000 = '+api.fmt(ppmOf(p),0)+' PPM';}).join('; ')+'. For scale, 0.1% defective is 1,000 PPM.']);
 C.forEach(function(c){ if(c.src!=='PPM from receipts'&&/ppm/i.test(c.n)){ var low=P.filter(function(p){var x=v[p.sup+'|'+c.n];return x!=null&&x>0&&x<1;}); if(low.length) f.push(['warn','<b>'+esc(c.n)+'</b> has values below 1 for '+low.map(function(p){return esc(p.sup);}).join(', ')+'. That looks like a fraction or percent, not PPM. Multiply a fraction by 1,000,000 or a percent by 10,000.']); } });
 res.forEach(function(r){
  var cert=r.p.cert||'';
  var wi=-1; r.pts.forEach(function(x,j){ if(!isNaN(x)&&(wi<0||x<r.pts[wi])) wi=j; }); var weak=wi<0?'the weakest criterion':esc(C[wi].n)+' ('+r.pts[wi].toFixed(0)+' points)';
  var wcat=wi<0?'':(C[wi].cat||'');
  if(r.cls==='Conditional') f.push(['warn','<b>'+esc(r.p.sup)+'</b> is Conditional ('+r.sc.toFixed(1)+'). '+(wcat==='Cost'||wcat==='Delivery'||wcat==='Service'?'Agree an improvement plan with the supplier on '+weak+', with the cause, actions, owners and a due date, and re-score next period. A SCAR with containment is for product quality problems; use one if the weakness turns out to affect the product.':'Issue a supplier corrective action request (SCAR) on '+weak+', with a containment step, a root cause and a due date; consider tightened incoming inspection and re-score next period.')]);
  if(r.cls==='Disqualify') f.push(['warn','<b>'+esc(r.p.sup)+'</b> is below '+tC+' ('+r.sc.toFixed(1)+'); weakest is '+weak+'. Issue a SCAR now and start an exit plan in parallel: qualify an alternate source, build safety stock, set the date the decision will be made, and agree how open orders, tooling and records transfer.']);
  if(r.cls==='Preferred'&&(cert==='None'||cert==='Lapsed or suspended')) f.push(['warn','<b>'+esc(r.p.sup)+'</b> scores Preferred but has '+(cert==='None'?'no certification':'a lapsed or suspended certification')+'. Decide whether performance alone is enough under your approval criteria.']);
  else if(cert==='Lapsed or suspended') f.push(['warn','<b>'+esc(r.p.sup)+'</b> has a lapsed or suspended certification. Confirm whether it still meets your approval requirements before the next order.']);
 });
 if(!appr.length) f.push(['warn','No approval requirements listed. The scorecard measures approved suppliers; it does not replace the selection and approval criteria a new supplier must meet first.']);
 f.push(['','A scorecard is a lagging measure. Share it with each supplier, agree the targets in advance, and use it to decide where to develop a partnership and where to plan an exit, not only to rank.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Hearthstone Snack Foods, packaging and ingredient suppliers, plant 2',per:'Q3 2026',own:'Supplier quality manager',rev:'2026-10-20',tp:'85',ta:'70',tc:'55',
 appr:'Current GFSI-benchmarked or ISO 9001 certificate, or a passed on-site audit\nFood-contact compliance letters for all packaging materials\nFirst-article approval on three consecutive lots\nAllergen and change-notification agreement signed\nFinancial review and a second-source or continuity plan for single-source items',
 certn:'Certified ship-to-stock status requires four consecutive quarters at Preferred and a passed process audit. It lapses after any Conditional quarter, and incoming inspection resumes.'},
 g:{c:[{n:'Quality: PPM defective at receipt',cat:'Quality',w:'35',how:'Defective units ÷ units received × 1,000,000, from receiving inspection and line rejects',src:'PPM from receipts',z:'3000',full:'100'},
  {n:'Delivery: on-time in full %',cat:'Delivery',w:'25',how:'Receipts on the confirmed date, complete, ÷ all receipts',src:'Entered per supplier',z:'85',full:'98'},
  {n:'Cost: TCO ratio',cat:'Cost',w:'25',how:'Total cost of ownership ÷ purchase price (adds freight, inspection, inventory, scrap and expediting)',src:'Entered per supplier',z:'1.30',full:'1.05'},
  {n:'Service: responsiveness 1–5',cat:'Service',w:'15',how:'Buyer and quality survey: response to issues, change notices, documentation',src:'Entered per supplier',z:'1',full:'5'}],
 s:[{sup:'Northfield Flexpack',com:'Snack pouch film',cert:'GFSI scheme (SQF, BRCGS, FSSC 22000)',rec:'1240000',def:'310'},
  {sup:'Summit Corrugated',com:'Shipping cartons',cert:'ISO 9001',rec:'286000',def:'572'},
  {sup:'Tri-County Seasonings',com:'Seasoning blends, bags',cert:'GFSI scheme (SQF, BRCGS, FSSC 22000)',rec:'48200',def:'37'},
  {sup:'Lakeside Labels',com:'Printed labels',cert:'Lapsed or suspended',rec:'3150000',def:'4410'},
  {sup:'Greenway Pallet',com:'Pallets',cert:'ISO 9001',rec:'9800',def:'12'}]},
 x:{v:{'Northfield Flexpack|Delivery: on-time in full %':97.5,'Northfield Flexpack|Cost: TCO ratio':1.08,'Northfield Flexpack|Service: responsiveness 1–5':4.5,
  'Summit Corrugated|Delivery: on-time in full %':93,'Summit Corrugated|Cost: TCO ratio':1.12,'Summit Corrugated|Service: responsiveness 1–5':3.8,
  'Tri-County Seasonings|Delivery: on-time in full %':91.5,'Tri-County Seasonings|Cost: TCO ratio':1.21,'Tri-County Seasonings|Service: responsiveness 1–5':3,
  'Lakeside Labels|Delivery: on-time in full %':81,'Lakeside Labels|Cost: TCO ratio':1.26,'Lakeside Labels|Service: responsiveness 1–5':2.5,
  'Greenway Pallet|Delivery: on-time in full %':99,'Greenway Pallet|Cost: TCO ratio':1.06,'Greenway Pallet|Service: responsiveness 1–5':4.2}}}
}
