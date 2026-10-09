{
slug:'customer-value-segmentation',
sections:[
 {type:'fields',title:'Assumptions',cols:4,hint:'The discount rate converts future margin to today\'s dollars; ask finance for the rate your organization uses. The satisfaction target is the score below which a segment counts as at risk.',fields:[
  {id:'org',label:'Organization and year',wide:true,ph:'e.g. Regional logistics provider, FY2026 data'},
  {id:'d',label:'Discount rate %',type:'number',min:0,max:50,ph:'10'},
  {id:'lift',label:'Retention improvement to test, points',type:'number',min:0,max:50,ph:'5'},
  {id:'sat',label:'Satisfaction target, 0–100',type:'number',min:0,max:100,ph:'80'},
  {id:'scale',label:'Satisfaction measure',ph:'e.g. CSAT % satisfied or very satisfied'}]},
 {type:'grid',id:'sg',title:'Customer segments',rows:3,hint:'One row per segment, all figures per customer per year. Annual margin per customer = revenue × gross margin % − cost to serve. Cost to serve is what it costs to support the customer beyond the cost of goods: account management, special handling, returns, small orders, support calls.',cols:[
  {id:'seg',label:'Segment',w:170,type:'textarea',rows:1},
  {id:'nc',label:'Customers',type:'number',min:0},
  {id:'rev',label:'Revenue per customer $',type:'number',min:0},
  {id:'gm',label:'Gross margin %',type:'number'},
  {id:'ret',label:'Retention %',type:'number',min:0,max:99},
  {id:'cts',label:'Cost to serve $',type:'number',min:0},
  {id:'sat',label:'Satisfaction 0–100',type:'number',min:0,max:100},
  {id:'gr',label:'Growth potential',type:'select',opts:['High','Medium','Low']},
  {id:'m',label:'Margin per customer',calc:function(r,api){var n=api.num,v=n(r.rev)*n(r.gm)/100-(n(r.cts)||0);if(!r.seg||isNaN(v))return '';return (v<0?'−$':'$')+api.fmt(Math.abs(v),0);}}]},
 {type:'fields',title:'Diverse customers: conflicts and capacity',hint:'Segments often want things that pull against each other (speed against cost, customization against standard work) and compete for the same capacity. Write down where that happens and how you will decide.',fields:[
  {id:'conf',label:'Where segment requirements conflict, and how it will be resolved',type:'textarea',rows:3,wide:true},
  {id:'cap',label:'Shared capacity and how it is allocated',type:'textarea',rows:2,wide:true}]},
 {type:'custom',id:'res',title:'Customer value by segment',html:'<div class="stat cv-stat"></div><div class="tgw"><table class="mv cv-t"></table></div><div class="svgw cv-chart"></div><div class="out cv-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, esc=api.esc, f=[];
 var d=n(S.f.d); if(isNaN(d)) d=10; d=d/100;
 var L=n(S.f.lift); if(isNaN(L)) L=5;
 var T=n(S.f.sat); if(isNaN(T)) T=80;
 var $m=function(v){return (v<0?'−$':'$')+api.fmt(Math.abs(v),0);};
 function clv(m,r){ return m*r/(1+d-r); }
 var rows=S.g.sg.filter(function(x){return x.seg;}), bad=[], miss=[];
 var R=rows.map(function(x){
  var nc=n(x.nc), rev=n(x.rev), gm=n(x.gm), ret=n(x.ret), cts=n(x.cts); if(isNaN(cts)) cts=0;
  if(isNaN(nc)||isNaN(rev)||isNaN(gm)||isNaN(ret)) miss.push(x.seg);
  if(!isNaN(ret)&&(ret<0||ret>=100)) bad.push(x.seg);
  var m=rev*gm/100-cts, r=ret/100, ok=!isNaN(m)&&!isNaN(r)&&r>=0&&r<1&&!isNaN(nc);
  var r2=Math.min(0.99,r+L/100), c=ok?clv(m,r):NaN, c2=ok?clv(m,r2):NaN;
  return {x:x,nc:nc,m:m,r:r,r2:r2,ok:ok,c:c,c2:c2,gain:c2-c,prof:m*nc,eq:c*nc,geq:(c2-c)*nc,sat:n(x.sat),gr:x.gr,gp:rev*gm/100,cts:cts};
 });
 var V=R.filter(function(z){return z.ok;});
 var st=root.querySelector('.cv-stat'), tb=root.querySelector('table.cv-t'), ch=root.querySelector('.cv-chart'), out=root.querySelector('.cv-out');
 if(!V.length){ st.innerHTML=''; tb.innerHTML=''; ch.innerHTML=''; out.innerHTML=api.flags(miss.length||bad.length?[['warn','Each segment needs customers, revenue per customer, gross margin % and a retention rate from 0 to 99%.']]:[],'Add segments with customers, revenue, margin and retention. The lifetime values, the value of retention and the checks appear here.'); return; }
 var posEq=V.reduce(function(a,z){return a+Math.max(0,z.eq);},0), totP=V.reduce(function(a,z){return a+z.prof;},0), totEq=V.reduce(function(a,z){return a+z.eq;},0), totC=V.reduce(function(a,z){return a+z.nc;},0), totG=V.reduce(function(a,z){return a+z.geq;},0);
 V.forEach(function(z){
  z.share=posEq>0?Math.max(0,z.eq)/posEq:0; z.hi=z.share>=0.2; z.low=!isNaN(z.sat)&&z.sat<T;
  if(z.m<=0) z.rec='Reprice or redesign service: minimums, fees for special handling, self-service tools, standard service levels. Keep what drives their retention; cut what they do not value.';
  else if(z.hi&&z.low) z.rec='Fix first, retention risk: executive sponsor, quarterly business reviews, root cause on the main complaints, protected capacity.';
  else if(z.hi) z.rec='Protect and grow: dedicated account management, priority capacity, joint improvement projects, service level agreements.';
  else if(z.gr==='High') z.rec='Develop: invest selectively in the service features this segment values and track lifetime value as it grows.';
  else z.rec='Efficient standard service: standard service levels, self-service and automation, no custom work without a price.';
 });
 st.innerHTML='<div><b>'+api.fmt(totC,0)+'</b><span>Customers</span></div><div><b>'+$m(totP)+'</b><span>Annual profit after cost to serve</span></div><div><b>'+$m(totEq)+'</b><span>Customer equity (sum of lifetime values)</span></div><div><b>'+$m(totG)+'</b><span>Added equity from +'+L+' retention points</span></div>';
 tb.innerHTML='<thead><tr><th>Segment</th><th>Annual profit</th><th>CLV per customer</th><th>Customer equity</th><th>Share</th><th>CLV gain per customer, +'+L+' pts</th><th>Segment gain</th><th>Service alignment</th></tr></thead><tbody>'+V.map(function(z){return '<tr><td class="mo">'+esc(z.x.seg)+'</td><td class="mt">'+$m(z.prof)+'</td><td class="mt">'+$m(z.c)+'</td><td class="mt">'+$m(z.eq)+'</td><td class="mt">'+(z.share*100).toFixed(0)+'%</td><td class="mt">'+$m(z.gain)+'</td><td class="mt">'+$m(z.geq)+'</td><td class="cv-rec">'+z.rec+'</td></tr>';}).join('')+'</tbody>';
 /* chart: annual profit by segment, diverging around zero */
 var Wd=640, rh=30, Lb=200, top=26, H=top+V.length*rh+8, mn=Math.min(0,Math.min.apply(null,V.map(function(z){return z.prof;}))), mx=Math.max(0,Math.max.apply(null,V.map(function(z){return z.prof;}))), span=(mx-mn)||1;
 var sx=function(v){return Lb+(Wd-Lb-80)*(v-mn)/span;};
 var g='<svg viewBox="0 0 '+Wd+' '+H+'" role="img" aria-label="Annual profit by segment"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.t{font-size:11px;fill:#4A5D71}</style><text class="t" x="'+Lb+'" y="14">Annual profit after cost to serve; gold = high-value segment</text><line x1="'+sx(0)+'" x2="'+sx(0)+'" y1="'+(top-4)+'" y2="'+(H-4)+'" stroke="#7C8B99"/>';
 V.forEach(function(z,i){ var y=top+i*rh, x0=sx(Math.min(0,z.prof)), w=Math.abs(sx(z.prof)-sx(0)), lab=z.x.seg.length>28?z.x.seg.slice(0,27)+'…':z.x.seg, col=z.prof<0?'#C0392B':z.hi?'#D8B147':'#0F3E68';
  g+='<text x="'+(Lb-8)+'" y="'+(y+18)+'" text-anchor="end">'+esc(lab)+'</text><rect x="'+x0+'" y="'+(y+5)+'" width="'+Math.max(1,w)+'" height="18" fill="'+col+'"/><text x="'+(z.prof<0?sx(0)+6:sx(z.prof)+6)+'" y="'+(y+18)+'">'+$m(z.prof)+'</text>'; });
 ch.innerHTML=g+'</svg>';
 /* flags */
 var top1=V.slice().sort(function(a,b){return b.eq-a.eq;})[0];
 f.push(['ok','Most valuable segment: <b>'+esc(top1.x.seg)+'</b>, '+$m(top1.eq)+' of customer equity ('+(top1.share*100).toFixed(0)+'% of the positive total) from '+api.fmt(top1.nc,0)+' customers.']);
 V.forEach(function(z){
  if(z.m<=0) f.push(['warn','<b>'+esc(z.x.seg)+'</b>: cost to serve ('+$m(z.cts)+') exceeds gross margin ('+$m(z.gp)+') per customer, so each customer loses '+$m(-z.m)+' a year and the segment loses '+$m(-z.prof)+'. Revenue is not value; reprice or change how this segment is served.']);
  if(z.hi&&z.low) f.push(['warn','Retention risk: <b>'+esc(z.x.seg)+'</b> holds '+(z.share*100).toFixed(0)+'% of customer equity but scores '+z.sat+' against a target of '+T+'. Raising retention by '+L+' points ('+(z.r*100).toFixed(0)+'% to '+(z.r2*100).toFixed(0)+'%) would add '+$m(z.geq)+' of equity.']);
 });
 var bg=V.slice().sort(function(a,b){return b.geq-a.geq;})[0];
 if(bg&&bg.geq>0) f.push(['','Largest gain from +'+L+' retention points: <b>'+esc(bg.x.seg)+'</b>, '+$m(bg.geq)+'. Retention is worth most where margin per customer is high and retention is already high, because each added point extends an already long, profitable relationship.']);
 var vz=top1; f.push(['','CLV check for '+esc(vz.x.seg)+': margin '+$m(vz.m)+' × retention '+vz.r.toFixed(2)+' ÷ (1 + '+d.toFixed(2)+' − '+vz.r.toFixed(2)+') = '+$m(vz.c)+'. Formula: CLV = m × r ÷ (1 + d − r), margin received at the end of each year the customer stays, retention and margin constant. It is a simplified model: it ignores acquisition cost, margin growth and differences within the segment.']);
 if(miss.length) f.push(['warn','Incomplete rows left out of the totals: '+miss.map(esc).join(', ')+'.']);
 if(bad.length) f.push(['warn','Retention must be at least 0% and below 100%: '+bad.map(esc).join(', ')+'. At 100% the customer never leaves and the formula only stops growing because of discounting.']);
 var capped=V.filter(function(z){return z.r+L/100>0.99;}); if(capped.length) f.push(['','Retention after improvement is capped at 99% for '+capped.map(function(z){return esc(z.x.seg);}).join(', ')+'.']);
 if(V.length>=2&&!(S.f.conf||'').trim()) f.push(['warn','No conflicts recorded. With '+V.length+' segments, some requirements will pull against each other (lead time against price, custom handling against standard work). Write down the conflicts and the rule for resolving them before they are settled call by call.']);
 if(V.length>=2&&!(S.f.cap||'').trim()) f.push(['warn','No capacity allocation recorded. When segments share people, docks, lines or support hours, decide in advance who gets priority at peak and why.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Crossline Logistics, contract warehousing and distribution, FY2026',d:'10',lift:'5',sat:'80',scale:'CSAT, % satisfied or very satisfied',
 conf:'National retail accounts want guaranteed dock appointments and same-day turns; e-commerce brands want late order cutoffs that collide with the same evening shift. Rule: contracted service levels first, then by segment margin. E-commerce cutoffs move to 2 p.m. unless the brand pays for the late wave.',
 cap:'Peak season (October to December) dock doors and the evening shift are allocated weekly by the operations planning meeting; healthcare cold-chain capacity is reserved year round.'},
 g:{sg:[{seg:'National retail accounts',nc:'6',rev:'2400000',gm:'18',ret:'92',cts:'210000',sat:'71',gr:'Medium'},
  {seg:'Regional manufacturers',nc:'24',rev:'380000',gm:'22',ret:'85',cts:'38000',sat:'84',gr:'High'},
  {seg:'E-commerce brands',nc:'40',rev:'150000',gm:'25',ret:'70',cts:'41000',sat:'78',gr:'High'},
  {seg:'Spot and transactional shippers',nc:'210',rev:'9000',gm:'15',ret:'45',cts:'600',sat:'80',gr:'Low'},
  {seg:'Healthcare distributors',nc:'8',rev:'900000',gm:'24',ret:'95',cts:'70000',sat:'88',gr:'Medium'}]}}
}
