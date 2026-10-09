{
slug:'cost-of-quality',
sections:[
 {type:'fields',title:'Scope of the study',cols:3,fields:[
  {id:'org',label:'Organization or site',ph:'e.g. Plant 2, all product lines'},
  {id:'per',label:'Period',ph:'e.g. FY2026'},
  {id:'sales',label:'Sales or revenue for the period $',type:'number',min:0,hint:'Used for COQ as a percent of sales.'}]},
 {type:'grid',id:'c',title:'Cost items',rows:6,hint:'One row per cost item, with the annual amount and its PAF category. Prevention stops defects being made; appraisal finds them; internal failure is a defect caught before the customer has it; external failure is one the customer found.',cols:[
  {id:'item',label:'Cost item',w:230,type:'textarea',rows:1},
  {id:'cat',label:'Category',type:'select',opts:['Prevention','Appraisal','Internal failure','External failure']},
  {id:'amt',label:'Annual $',type:'number',min:0},
  {id:'grp',label:'Group',calc:function(r){return r.cat==='Prevention'||r.cat==='Appraisal'?'Good quality':(r.cat?'Poor quality':'');}},
  {id:'sh',label:'Share of COQ',calc:function(r,api){var S=api.state(),t=0;S.g.c.forEach(function(x){var v=api.num(x.amt);if(x.cat&&v>0)t+=v;});var v=api.num(r.amt);return r.cat&&v>0&&t?(v/t*100).toFixed(1)+'%':'';}}]},
 {type:'custom',id:'res',title:'Cost of quality summary',html:'<div class="stat cq-stat"></div><div class="tgw"><table class="mv cq-t"></table></div><div class="svgw cq-chart"></div><div class="out cq-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], CATS=['Prevention','Appraisal','Internal failure','External failure'], COL={'Prevention':'#1F8C55','Appraisal':'#0F3E68','Internal failure':'#D8B147','External failure':'#C0392B'};
 var tot={}, cnt={}; CATS.forEach(function(c){tot[c]=0;cnt[c]=0;});
 var noCat=[], noAmt=[], neg=[], mis=[];
 var RULES=[
  {re:/warrant|recall|field (repair|service|failure)|complain|customer return|returns?\b|chargeback|withdrawal|liabilit|penalt|concession/i, ok:['External failure'], why:'customer-facing failure costs (warranty, returns, recalls, complaints, penalties) are external failure'},
  {re:/re-?inspect|re-?test|re-?screen|sort(ing)? of (suspect|held)/i, ok:['Internal failure'], why:'re-inspection and retest after a failure are part of the cost of that failure, so they count as internal failure'},
  {re:/scrap|rework|repack|downgrad|regrad|failure analysis|quality hold|downtime/i, ok:['Internal failure'], why:'scrap, rework, downgrading and failure-caused downtime are internal failure'},
  {re:/training|quality planning|design review|capabilit|supplier (qualification|development)|fmea|error.?proof|poka|process planning|haccp/i, ok:['Prevention'], why:'planning, training, design review, capability work and supplier development are prevention'},
  {re:/audit/i, ok:['Appraisal','Prevention'], why:''},
  {re:/inspect|test|calibrat|laborator|\blab\b|metrolog|measur/i, ok:['Appraisal'], why:'inspection, test, calibration of measuring equipment and lab checks are appraisal'}];
 S.g.c.forEach(function(r,i){
  var v=n(r.amt), has=r.item||r.cat||!isNaN(v), lab=r.item?'<b>'+api.esc(r.item)+'</b>':'row '+(i+1);
  if(!has) return;
  if(!isNaN(v)&&v<0){ neg.push(lab); return; }
  if(!r.cat){ noCat.push(lab); return; }
  if(isNaN(v)){ noAmt.push(lab); return; }
  tot[r.cat]+=v; cnt[r.cat]++;
  if(r.item){ for(var k=0;k<RULES.length;k++){ if(RULES[k].re.test(r.item)){ if(RULES[k].ok.indexOf(r.cat)<0&&RULES[k].why) mis.push(lab+' is entered as '+r.cat.toLowerCase()+'; '+RULES[k].why+'.'); break; } } }
 });
 var T=CATS.reduce(function(a,c){return a+tot[c];},0), good=tot.Prevention+tot.Appraisal, poor=tot['Internal failure']+tot['External failure'], sales=n(S.f.sales);
 var $=function(v){return '$'+api.fmt(v,0);}, pc=function(v){return T?(v/T*100).toFixed(1)+'%':'—';}, ps=function(v){return sales>0?(v/sales*100).toFixed(2)+'%':'—';};
 root.querySelector('.cq-stat').innerHTML=T?'<div><b>'+$(T)+'</b><span>Total cost of quality</span></div><div><b>'+ps(T)+'</b><span>COQ as % of sales</span></div><div><b>'+$(good)+'</b><span>Cost of good quality (P + A)</span></div><div><b>'+$(poor)+'</b><span>Cost of poor quality (IF + EF)</span></div><div><b>'+pc(poor)+'</b><span>Failure share of COQ</span></div>':'';
 root.querySelector('.cq-t').innerHTML=T?'<thead><tr><th>Category</th><th>Items</th><th>Annual $</th><th>% of COQ</th><th>% of sales</th></tr></thead><tbody>'+CATS.map(function(c){return '<tr><td class="mo">'+c+'</td><td class="mt">'+cnt[c]+'</td><td class="mt">'+$(tot[c])+'</td><td class="mt">'+pc(tot[c])+'</td><td class="mt">'+ps(tot[c])+'</td></tr>';}).join('')+'</tbody><tfoot><tr><td>TOTAL</td><td>'+CATS.reduce(function(a,c){return a+cnt[c];},0)+'</td><td>'+$(T)+'</td><td>100%</td><td>'+ps(T)+'</td></tr></tfoot>':'';
 var g='';
 if(T){
  var W=640, H=250, x0=70, bw=90, gap=(W-x0-20-4*bw)/4, mx=Math.max.apply(null,CATS.map(function(c){return tot[c];})), top=40, base=170;
  g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Cost of quality by category"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.v{font:600 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}.s{font-size:11px;fill:#4A5D71}</style>';
  g+='<line x1="'+x0+'" y1="'+base+'" x2="'+(W-10)+'" y2="'+base+'" stroke="#C6CDD3"/>';
  CATS.forEach(function(c,i){ var h=mx?(base-top)*tot[c]/mx:0, x=x0+gap/2+i*(bw+gap); g+='<rect x="'+x+'" y="'+(base-h)+'" width="'+bw+'" height="'+h+'" fill="'+COL[c]+'"/><text class="v" x="'+(x+bw/2)+'" y="'+(base-h-6)+'" text-anchor="middle">'+$(tot[c])+'</text><text x="'+(x+bw/2)+'" y="'+(base+16)+'" text-anchor="middle">'+c+'</text><text class="s" x="'+(x+bw/2)+'" y="'+(base+30)+'" text-anchor="middle">'+pc(tot[c])+'</text>'; });
  g+='<text x="'+x0+'" y="20" font-weight="700">Annual cost by PAF category</text>';
  var by=H-28, bwid=W-x0-20, gw=bwid*good/T;
  g+='<text x="'+(x0-8)+'" y="'+(by+14)+'" text-anchor="end" class="s">Split</text><rect x="'+x0+'" y="'+by+'" width="'+gw+'" height="20" fill="#1F8C55"/><rect x="'+(x0+gw)+'" y="'+by+'" width="'+(bwid-gw)+'" height="20" fill="#C0392B"/>';
  if(gw>150) g+='<text x="'+(x0+6)+'" y="'+(by+14)+'" style="fill:#fff;font-weight:600">Good quality '+pc(good)+'</text>';
  if(bwid-gw>150) g+='<text x="'+(x0+bwid-6)+'" y="'+(by+14)+'" text-anchor="end" style="fill:#fff;font-weight:600">Poor quality '+pc(poor)+'</text>';
  g+='</svg>';
 }
 root.querySelector('.cq-chart').innerHTML=g;
 root.querySelector('.cq-chart').style.display=T?'':'none';
 if(T){
  f.push(['ok','Total cost of quality is <b>'+$(T)+'</b>'+(sales>0?', <b>'+ps(T)+'</b> of sales':'')+'. Cost of good quality (prevention and appraisal) is '+$(good)+'; cost of poor quality (internal and external failure) is '+$(poor)+'.']);
  if(!(sales>0)) f.push(['warn','Enter sales or revenue for the period to see COQ as a percent of sales, the figure management usually asks for first.']);
  if(poor/T>0.5) f.push(['warn','Failure costs are <b>'+pc(poor)+'</b> of the total. Failure-dominated spending is the typical profile of an organization that finds problems rather than prevents them.']);
  if(tot.Prevention/T<0.1) f.push(['warn','Prevention is only <b>'+pc(tot.Prevention)+'</b> of the total (this tool checks for under 10 percent). Low prevention spend usually shows up later as appraisal and failure cost.']);
  if(tot['External failure']>tot['Internal failure']) f.push(['warn','External failure ('+$(tot['External failure'])+') exceeds internal failure ('+$(tot['Internal failure'])+'). Customer-found failures usually cost the most per defect, so this is where the cost of poor quality is concentrated; check how many defects escape detection.']);
  else if(tot['External failure']>0) f.push(['','Internal failure cost is larger than external failure cost, so more of the failure cost arises before product reaches the customer. The next gain is moving cost from both failure categories into prevention.']);
  if(tot.Appraisal>tot.Prevention*3&&tot.Appraisal/T>0.15) f.push(['','Appraisal is '+(tot.Prevention?(tot.Appraisal/tot.Prevention).toFixed(1)+' times':'far above')+' prevention. Inspection finds defects but does not stop them being made; check which appraisal steps exist only because a process is not capable.']);
 }
 mis.forEach(function(m){ f.push(['warn','Check the category: '+m]); });
 if(noCat.length) f.push(['warn','No category for '+noCat.join(', ')+'. Those amounts are left out of the totals.']);
 if(noAmt.length) f.push(['warn','No amount for '+noAmt.join(', ')+'.']);
 if(neg.length) f.push(['warn','Negative amount for '+neg.join(', ')+'. Enter costs as positive numbers; record recoveries (such as scrap sold for salvage) as a note, not a negative cost.']);
 if(T){
  if(sales>0) f.push(['','Figures of 15 to 25 percent of sales are often quoted for the cost of poor quality, but they are estimates, not benchmarks, and measured results vary widely. A low measured COQ often means hidden costs (lost sales, engineering time, expediting, excess inventory) are not being captured.']);
  f.push(['','Teaching note: in the classic model (Juran; PAF categories from Feigenbaum), spending more on prevention reduces failure cost faster than it adds cost, so total COQ falls. The older curve put the optimum short of perfect quality; the modern view is that, as prevention gets cheaper and failures get costlier, the optimum moves toward zero defects.']);
 }
 root.querySelector('.cq-out').innerHTML=api.flags(f,'Add cost items with a category and an annual amount to see the summary.');
},
example:{f:{org:'Fairbrook Bakery Co., plant 1',per:'FY2026',sales:'48000000'},
 g:{c:[
  {item:'Quality planning and HACCP plan updates',cat:'Prevention',amt:'42000'},
  {item:'Supplier qualification program',cat:'Prevention',amt:'28000'},
  {item:'Food safety and quality training',cat:'Prevention',amt:'36000'},
  {item:'Process capability studies on ovens and depositors',cat:'Prevention',amt:'14000'},
  {item:'Incoming ingredient testing',cat:'Appraisal',amt:'96000'},
  {item:'In-process inspection by QC technicians',cat:'Appraisal',amt:'210000'},
  {item:'Metal detector checks and lab micro testing',cat:'Appraisal',amt:'88000'},
  {item:'Calibration of scales and thermometers',cat:'Appraisal',amt:'18000'},
  {item:'Third-party certification audit (SQF)',cat:'Appraisal',amt:'24000'},
  {item:'Re-inspection of held lots',cat:'Appraisal',amt:'38000'},
  {item:'Scrap of out-of-spec product',cat:'Internal failure',amt:'520000'},
  {item:'Rework and repack',cat:'Internal failure',amt:'140000'},
  {item:'Line downtime from quality holds',cat:'Internal failure',amt:'95000'},
  {item:'Customer complaint handling',cat:'External failure',amt:'64000'},
  {item:'Retailer returns and credits',cat:'External failure',amt:'310000'},
  {item:'Retailer chargebacks for short-coded product',cat:'External failure',amt:'120000'},
  {item:'Market withdrawal of one mislabeled lot',cat:'External failure',amt:'185000'}]}}
}
