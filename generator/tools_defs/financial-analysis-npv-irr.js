{
slug:'financial-analysis-npv-irr',
sections:[
 {type:'fields',title:'Decision and discount rate',cols:3,fields:[
  {id:'name',label:'Decision being made',wide:true},
  {id:'rate',label:'Discount rate % (cost of capital)',type:'number',min:0,ph:'8',hint:'The hurdle rate your finance group uses.'},
  {id:'mx',label:'The projects are',type:'select',opts:['Mutually exclusive (fund one)','Independent (fund each that passes)']}]},
 {type:'grid',id:'p',title:'Projects and cash flows',rows:3,hint:'Year 0 is the initial investment, entered as a positive number. Years 1 to 6 are net cash flows (benefits minus running costs) at the end of each year; enter a cost year as a negative number and leave unused years blank.',cols:[
  {id:'n',label:'Project',w:200,type:'textarea',rows:1},
  {id:'y0',label:'Year 0 outlay $',type:'number',min:0},
  {id:'y1',label:'Year 1 $',type:'number'},{id:'y2',label:'Year 2 $',type:'number'},{id:'y3',label:'Year 3 $',type:'number'},
  {id:'y4',label:'Year 4 $',type:'number'},{id:'y5',label:'Year 5 $',type:'number'},{id:'y6',label:'Year 6 $',type:'number'}]},
 {type:'custom',id:'res',title:'Results and ranking',hint:'Ranked by net present value. Payback figures assume cash arrives evenly through each year.',html:'<div class="tgw"><table class="mv fa-t"></table></div><div class="svgw fa-chart"></div><div class="out fa-out"></div>'},
 {type:'fields',title:'Return on assets (optional)',cols:3,hint:'A whole-organization ratio, separate from the project figures above. Use average total assets for the period if you have it.',fields:[
  {id:'ni',label:'Net income for the year $',type:'number'},
  {id:'ta',label:'Total assets $',type:'number',min:0},
  {id:'roan',label:'Note',ph:'e.g. FY2026 audited statements'}]},
 {type:'custom',id:'roa',title:'Return on assets result',html:'<div class="out fa-roa"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], R=n(S.f.rate), r=R/100, hasR=!isNaN(R)&&R>-100, Y=['y1','y2','y3','y4','y5','y6'];
 var sg=function(v,d){ var s=Math.abs(v).toFixed(d); return (v<0&&Number(s)!==0?'−':'')+s; };
 var pct=function(v,d){ return sg(v*100,d==null?1:d)+'%'; };
 var $=function(v){ return isFinite(v)?(v<0&&Math.round(Math.abs(v))>0?'−$':'$')+api.fmt(Math.abs(v),0):'—'; };
 function npv(rt,cf){ var s=0; for(var t=0;t<cf.length;t++) s+=cf[t]/Math.pow(1+rt,t); return s; }
 function irrs(cf){
  var out=[], lo=-0.99, step=0.005, a=lo, fa=npv(a,cf);
  while(a<10){ var b=a+step, fb=npv(b,cf);
   if(fa===0) out.push(Math.abs(a)<1e-9?0:a);
   else if(isFinite(fa)&&isFinite(fb)&&fa*fb<0){ var x=a, y=b, fx=fa; for(var k=0;k<80;k++){ var m=(x+y)/2, fm=npv(m,cf); if(fx*fm<=0) y=m; else { x=m; fx=fm; } } var rt=(x+y)/2; out.push(Math.abs(rt)<1e-9?0:rt); }
   a=b; fa=fb; }
  return out;
 }
 function pay(cf,rt){ var cum=cf[0]; for(var t=1;t<cf.length;t++){ var c=cf[t]/(rt==null?1:Math.pow(1+rt,t)); if(cum<0&&cum+c>=0&&c>0) return t-1+(-cum)/c; cum+=c; } return cum>=0&&cf[0]>=0?0:Infinity; }
 var bad=[], res=[];
 S.g.p.forEach(function(row,i){
  var o=n(row.y0), last=-1, cf=[], any=row.n||!isNaN(o);
  Y.forEach(function(k,j){ if(!isNaN(n(row[k]))) { last=j; any=true; } });
  if(!any) return;
  var lab=row.n?api.esc(row.n):'Row '+(i+1);
  if(isNaN(o)||o<=0||last<0){ bad.push(lab); return; }
  cf.push(-o); for(var j=0;j<=last;j++){ var v=n(row[Y[j]]); cf.push(isNaN(v)?0:v); }
  var sc=0, prev=0; cf.forEach(function(v){ if(v!==0){ if(prev&&(v>0)!==(prev>0)) sc++; prev=v; } });
  var gain=cf.slice(1).reduce(function(a,b){return a+b;},0), N=hasR?npv(r,cf):NaN, ir=irrs(cf);
  res.push({raw:row.n||('Row '+(i+1)),lab:lab,cf:cf,yrs:last+1,npv:N,irr:ir,sc:sc,pb:pay(cf),dpb:hasR?pay(cf,r):NaN,roi:(gain-o)/o*100,pi:hasR?(N+o)/o:NaN,o:o});
 });
 var irrTxt=function(x){ return x.irr.length?x.irr.map(function(v){return pct(v);}).join(' and '):(x.sc?'not found':'none'); };
 var pbTxt=function(v,x){ return isNaN(v)?'—':v===Infinity?'Not in '+x.yrs+' yr':v.toFixed(2)+' yr'; };
 var srt=res.slice().sort(function(a,b){ return hasR?b.npv-a.npv:0; });
 root.querySelector('.fa-t').innerHTML=res.length?'<thead><tr><th>Rank</th><th>Project</th><th>NPV'+(hasR?' at '+R+'%':'')+'</th><th>IRR</th><th>Payback</th><th>Discounted payback</th><th>ROI</th><th>PI</th></tr></thead><tbody>'+srt.map(function(x,i){return '<tr'+(hasR&&x.npv<0?' class="hi-row"':'')+'><td class="mt">'+(hasR?i+1:'—')+'</td><td class="mo">'+x.lab+'</td><td class="mt">'+$(x.npv)+'</td><td class="mt">'+irrTxt(x)+'</td><td class="mt">'+pbTxt(x.pb,x)+'</td><td class="mt">'+pbTxt(x.dpb,x)+'</td><td class="mt">'+pct(x.roi/100)+'</td><td class="mt">'+(isFinite(x.pi)?sg(x.pi,2):'—')+'</td></tr>';}).join('')+'</tbody>':'';
 var ch=root.querySelector('.fa-chart'), g='';
 if(res.length){
  var LR=Math.ceil(res.length/2),W=640,H=300+LR*20,x0=80,x1=W-20,y0=24,y1=254, RM=40, pts=[], mn=0, mx=0, COLS=['#0F3E68','#D8B147','#1F8C55','#C0392B','#7C8B99','#9C7C1F'];
  res.forEach(function(x){ var p=[]; for(var k=0;k<=RM;k+=1){ var v=npv(k/100,x.cf); p.push(v); if(v<mn) mn=v; if(v>mx) mx=v; } pts.push(p); });
  if(mx===mn) mx=mn+1;
  var sx=function(k){return x0+(x1-x0)*k/RM;}, sy=function(v){return y0+(y1-y0)*(mx-v)/(mx-mn);};
  g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="NPV profile"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.s{font-size:11px;fill:#4A5D71}</style>';
  g+='<text x="'+x0+'" y="14" font-weight="700">NPV profile: NPV at each discount rate</text>';
  for(var k=0;k<=RM;k+=10) g+='<line x1="'+sx(k)+'" y1="'+y0+'" x2="'+sx(k)+'" y2="'+y1+'" stroke="#DDE1E4"/><text class="s" x="'+sx(k)+'" y="'+(y1+16)+'" text-anchor="middle">'+k+'%</text>';
  g+='<text class="s" x="'+((x0+x1)/2)+'" y="'+(y1+34)+'" text-anchor="middle">Discount rate</text>';
  g+='<line x1="'+x0+'" y1="'+sy(0)+'" x2="'+x1+'" y2="'+sy(0)+'" stroke="#16273A"/><text class="s" x="'+(x0-6)+'" y="'+(sy(0)+4)+'" text-anchor="end">$0</text>';
  g+='<text class="s" x="'+(x0-6)+'" y="'+(y0+10)+'" text-anchor="end">'+$(mx)+'</text>';
  if(mn<0) g+='<text class="s" x="'+(x0-6)+'" y="'+y1+'" text-anchor="end">'+$(mn)+'</text>';
  if(hasR&&R>=0&&R<=RM) g+='<line x1="'+sx(R)+'" y1="'+y0+'" x2="'+sx(R)+'" y2="'+y1+'" stroke="#9C7C1F" stroke-dasharray="4 3"/><text class="s" x="'+(sx(R)+4)+'" y="'+(y0+10)+'">'+R+'% rate</text>';
  pts.forEach(function(p,i){ var c=COLS[i%COLS.length]; g+='<polyline fill="none" stroke="'+c+'" stroke-width="2.5" points="'+p.map(function(v,k){return sx(k).toFixed(1)+','+sy(v).toFixed(1);}).join(' ')+'"/>';
   var lab=res[i].raw; lab=lab.length>40?lab.slice(0,39)+'…':lab, lx=20+(i%2)*310, ly=y1+46+Math.floor(i/2)*20;
   g+='<rect x="'+lx+'" y="'+ly+'" width="12" height="12" fill="'+c+'"/><text x="'+(lx+17)+'" y="'+(ly+11)+'">'+api.esc(lab)+'</text>'; });
  g+='</svg>';
 }
 ch.innerHTML=g; ch.style.display=g?'':'none';
 if(res.length){
  if(!hasR) f.push(['warn','Enter the discount rate to calculate NPV, discounted payback and the profitability index.']);
  else {
   var best=srt[0], pos=res.filter(function(x){return x.npv>0;});
   var mxx=S.f.mx||'Mutually exclusive (fund one)', excl=mxx.indexOf('Mutually')===0;
   f.push([best.npv>0?'ok':'warn','Highest NPV: <b>'+best.lab+'</b>, '+$(best.npv)+' at '+R+'%.'+(best.npv<=0?' No project earns the discount rate.':'')]);
   if(!excl&&pos.length) f.push(['ok','Independent projects: fund each project with NPV above zero ('+pos.map(function(x){return x.lab;}).join(', ')+') if capital allows. When capital is limited, rank by profitability index instead.']);
   var withIrr=res.filter(function(x){return x.irr.length===1;}).sort(function(a,b){return b.irr[0]-a.irr[0];});
   if(withIrr.length&&withIrr[0]!==best&&res.length>1&&!(best.irr.length===1&&withIrr[0].irr[0]-best.irr[0]<0.0005)) f.push(['warn','Ranking conflict: <b>'+withIrr[0].lab+'</b> has the highest IRR ('+pct(withIrr[0].irr[0])+') but <b>'+best.lab+'</b> has the highest NPV. Differences in size and timing cause this; the NPV profile lines cross. '+(excl?'For mutually exclusive projects choose by NPV: it measures the dollars of value added at the actual cost of capital, while IRR assumes cash is reinvested at the IRR itself and ignores scale.':'For independent projects both are accepted if they pass; the conflict matters only when you must choose.')]);
   res.filter(function(x){return x.npv<0;}).forEach(function(x){ f.push(['warn','<b>'+x.lab+'</b> has a negative NPV ('+$(x.npv)+'): it returns less than the '+R+'% cost of capital'+(x.irr.length===1?' (IRR '+pct(x.irr[0])+')':'')+'. On financial grounds alone it destroys value; fund it only for a compliance, safety or strategic reason, and say so.']); });
  }
  res.forEach(function(x){
   if(x.sc>1) f.push(['warn','<b>'+x.lab+'</b>: the cash flows change sign '+x.sc+' times, so there can be more than one IRR'+(x.irr.length>1?' (this one has '+x.irr.map(function(v){return pct(v);}).join(' and ')+')':'')+'. IRR is not reliable here; use NPV.']);
   else if(!x.irr.length) f.push(['warn','<b>'+x.lab+'</b>: '+(x.sc?'no IRR found between −99% and 1,000%. Check the cash flows; IRR is not a useful measure for this project, so use NPV.':'no IRR. The cash flows never repay the outlay, so no discount rate makes NPV zero.')]);
   if(x.pb===Infinity) f.push(['warn','<b>'+x.lab+'</b> does not pay back within '+x.yrs+' year'+(x.yrs>1?'s':'')+'.']);
  });
  f.push(['','Payback and ROI ignore the time value of money, and payback ignores everything after the payback year. Use them as a liquidity and risk check alongside NPV, not instead of it.']);
 }
 if(bad.length) f.push(['warn','Each project needs a year 0 outlay above zero and at least one year of cash flow. Check '+bad.join(', ')+'.']);
 root.querySelector('.fa-out').innerHTML=api.flags(f,'Add a project with its year 0 outlay and yearly cash flows.');
 var ni=n(S.f.ni), ta=n(S.f.ta), q=[];
 if(!isNaN(ni)&&ta>0){ var roa=ni/ta*100; q.push([roa>0?'ok':'warn','Return on assets = net income / total assets = '+$(ni)+' / '+$(ta)+' = <b>'+pct(roa/100,2)+'</b>. '+(roa<0?'Each dollar of assets lost '+sg(-roa/100,3)+' dollars':'Each dollar of assets produced '+sg(roa/100,3)+' dollars of profit')+' this year.']); q.push(['','Compare ROA with the same organization in earlier years or with peers in the same industry. Asset-heavy industries (utilities, hospitals, heavy manufacturing) run lower ROAs than software or services.']); }
 else if(!isNaN(ni)||!isNaN(ta)) q.push(['warn','Enter both net income and total assets (above zero) to calculate return on assets.']);
 root.querySelector('.fa-roa').innerHTML=api.flags(q,'Optional: enter net income and total assets to calculate return on assets.');
},
example:{f:{name:'Medication error reduction: choose one option for the FY2027 capital plan',rate:'8',mx:'Mutually exclusive (fund one)',ni:'9600000',ta:'240000000',roan:'Harrow Bend Regional Medical Center, FY2026 statements'},
 g:{p:[
  {n:'Closed-loop barcode medication administration',y0:'400000',y1:'60000',y2:'120000',y3:'160000',y4:'180000',y5:'180000'},
  {n:'Automated dispensing cabinets only',y0:'150000',y1:'70000',y2:'70000',y3:'60000',y4:'40000',y5:'20000'},
  {n:'Pharmacy IV compounding robot',y0:'250000',y1:'40000',y2:'60000',y3:'70000',y4:'70000',y5:'60000'},
  {n:'Unit-dose packager (year 5 removal and site work)',y0:'120000',y1:'60000',y2:'60000',y3:'60000',y4:'40000',y5:'-70000'}]}}
}
