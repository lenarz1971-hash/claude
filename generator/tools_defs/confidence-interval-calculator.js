{
slug:'confidence-interval-calculator',
ST:(function(){
 var C=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 function gln(x){ if(x<0.5) return Math.log(Math.PI/Math.sin(Math.PI*x))-gln(1-x); x-=1; var a=C[0],t=x+7.5; for(var i=1;i<9;i++) a+=C[i]/(x+i); return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap,m,m2,aa,del,h; if(Math.abs(d)<1e-300)d=1e-300; d=1/d; h=d;
  for(m=1;m<=300;m++){ m2=2*m; aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-15) break; }
  return h; }
 function ib(a,b,x){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 function gq(a,x){ if(x<=0) return 1; var g=gln(a),s,del,ap,n,b,c,d,h,an,i;
  if(x<a+1){ ap=a; s=1/a; del=s; for(n=0;n<1000;n++){ ap++; del*=x/ap; s+=del; if(Math.abs(del)<Math.abs(s)*1e-16) break; } return 1-s*Math.exp(-x+a*Math.log(x)-g); }
  b=x+1-a; c=1e300; d=1/b; h=d; for(i=1;i<1000;i++){ an=-i*(i-a); b+=2; d=an*d+b; if(Math.abs(d)<1e-300)d=1e-300; c=b+an/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-16) break; }
  return Math.exp(-x+a*Math.log(x)-g)*h; }
 function t2(t,v){ return ib(v/2,0.5,v/(v+t*t)); }
 function tcdf(t,v){ var p=0.5*t2(t,v); return t>0?1-p:p; }
 function nsf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?q:1-q; }
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function tinv(p,v){ return inv(function(t){return tcdf(t,v);},p,-1e4,1e4); }
 function zinv(p){ return inv(function(z){return 1-nsf(z);},p,-40,40); }
 function chiinv(p,k){ return inv(function(x){return 1-gq(k/2,x/2);},p,0,1e5); }
 function betainv(p,a,b){ return inv(function(x){return ib(a,b,x);},p,0,1); }
 return {tinv:tinv,zinv:zinv,chiinv:chiinv,betainv:betainv};
})(),
sections:[
 {type:'fields',title:'Settings',cols:3,hint:'A two-sided interval brackets the parameter; a one-sided bound puts all of α in one tail, for questions like "is the mean at most 45 minutes?"',fields:[
  {id:'cl',label:'Confidence level, %',type:'number',min:50,max:99.99,ph:'95'},
  {id:'side',label:'Interval',type:'select',opts:['Two-sided interval','Lower bound only','Upper bound only']},
  {id:'u',label:'What was measured, with units',ph:'e.g. Turnaround time, min'}]},
 {type:'fields',title:'Measurement data: mean and standard deviation',cols:2,hint:'Enter summary statistics, or paste the raw values below; raw values, when there are two or more, replace the summary fields.',fields:[
  {id:'n',label:'Sample size n',type:'number',min:2},
  {id:'m',label:'Sample mean x̄',type:'number'},
  {id:'s',label:'Sample standard deviation s',type:'number',min:0},
  {id:'sig',label:'Known population σ (optional; switches the mean interval to z)',type:'number',min:0},
  {id:'d',label:'Raw values (optional), five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:3,minRows:3}]},
 {type:'custom',id:'mres',title:'Interval for the mean and for the standard deviation',html:'<div class="ci-mst"></div><div class="tgw"><table class="mv ci-mtb"></table></div>'},
 {type:'fields',title:'Count data: a proportion',cols:3,fields:[
  {id:'x',label:'Number with the attribute (x)',type:'number',min:0},
  {id:'np',label:'Sample size n',type:'number',min:1},
  {id:'pl',label:'What is counted',ph:'e.g. Specimens rejected'}]},
 {type:'custom',id:'pres',title:'Interval for the proportion: three methods compared',html:'<div class="tgw"><table class="mv ci-ptb"></table></div><div class="svgw ci-svg"></div>'},
 {type:'fields',title:'Sample size for a target margin of error',cols:2,hint:'The margin of error is the half-width of a two-sided interval, or the distance to a one-sided bound. Leave a planning value blank to use the estimate from the data above.',fields:[
  {id:'em',label:'Margin for the mean (±, in the units above)',type:'number',min:0},
  {id:'sp',label:'Planning σ (blank = s from the data)',type:'number',min:0},
  {id:'ep',label:'Margin for the proportion (±, as a decimal, e.g. 0.03)',type:'number',min:0,max:0.5},
  {id:'pp',label:'Planning p (blank = p̂ from the data)',type:'number',min:0,max:1}]},
 {type:'custom',id:'read',title:'Sample sizes and what the results say',html:'<div class="tgw"><table class="mv ci-ntb"></table></div><div class="out ci-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, f=[];
 var MS=root.querySelector('.ci-mst'), MT=root.querySelector('.ci-mtb'), PT=root.querySelector('.ci-ptb'), SV=root.querySelector('.ci-svg'), NT=root.querySelector('.ci-ntb'), O=root.querySelector('.ci-out');
 var cl=api.num(S.f.cl), clOk=isFinite(cl)&&cl>=50&&cl<100; if(!clOk) cl=95;
 var side=S.f.side||'Two-sided interval', two=side==='Two-sided interval', lowOnly=side==='Lower bound only', a=1-cl/100, aT=two?a/2:a;
 var u=S.f.u||'', zc=ST.zinv(1-aT), clS=(Math.round(cl*100)/100)+'%', what=two?'interval':(lowOnly?'lower bound':'upper bound');
 if(S.f.cl&&!clOk) f.push(['warn','The confidence level must be at least 50% and below 100%; 95% is used.']);
 function rngT(lo,hi,d){ return two?F(lo,d)+' to '+F(hi,d):lowOnly?F(lo,d):F(hi,d); }
 function rng(lo,hi,d){ return two?F(lo,d)+' to '+F(hi,d):lowOnly?'≥ '+F(lo,d):'≤ '+F(hi,d); }
 /* ---- measurement data ---- */
 var raw=String(S.f.d||'').split(/[\s,;]+/).filter(Boolean), rv=[], rbad=0; raw.forEach(function(v){ var q=Number(v); if(isFinite(q)) rv.push(q); else rbad++; });
 var n=api.num(S.f.n), m=api.num(S.f.m), s=api.num(S.f.s), sig=api.num(S.f.sig), fromRaw=rv.length>=2, dp=2;
 if(fromRaw){ n=rv.length; m=0; rv.forEach(function(v){m+=v;}); m/=n; var ss=0; rv.forEach(function(v){ss+=(v-m)*(v-m);}); s=Math.sqrt(ss/(n-1));
  dp=Math.min(5,Math.max(1,rv.reduce(function(k,v){ return Math.max(k,(String(v).split('.')[1]||'').length); },0)+1)); }
 else dp=Math.min(5,Math.max(1,(String(S.f.m||'').split('.')[1]||'').length+1));
 if(rbad) f.push(['warn',rbad+' raw value'+(rbad>1?'s are':' is')+' not a number and '+(rbad>1?'were':'was')+' skipped.']);
 if(rv.length===1) f.push(['warn','Only one raw value was entered; at least two are needed, so the summary fields are used.']);
 var nOk=isFinite(n)&&n>=2&&Math.round(n)===n, sigOk=isFinite(sig)&&sig>0, sOk=isFinite(s)&&s>0;
 var mt=[], tiles=[], mTxt='', vTxt='';
 if(nOk&&isFinite(m)&&(sigOk||sOk)){
  var useZ=sigOk, cv=useZ?zc:ST.tinv(1-aT,n-1), sd=useZ?sig:s, se=sd/Math.sqrt(n), me=cv*se, lo=m-me, hi=m+me;
  tiles=[[F(n,0),'n'+(fromRaw?' (from raw data)':'')],[F(m,dp),'Mean x̄'],[F(se,dp+1),'Standard error '+(useZ?'σ/√n':'s/√n')],[(useZ?'z = ':'t = ')+cv.toFixed(3),useZ?'Critical z':'Critical t, '+(n-1)+' df'],['±'+F(me,dp),'Margin of error'],[rng(lo,hi,dp),clS+' '+what+' for μ']];
  mt.push(['Mean μ',useZ?'z, σ known':'t, '+(n-1)+' df',F(m,dp),two?F(lo,dp):lowOnly?F(lo,dp):'—',two?F(hi,dp):lowOnly?'—':F(hi,dp)]);
  mTxt='The '+clS+' '+what+' for the mean'+(u?' ('+E(u)+')':'')+' is '+rngT(lo,hi,dp)+'. The method captures the true mean in '+clS+' of samples drawn this way; any one interval either contains it or does not.';
  if(useZ) f.push(['','σ is entered as known, so the mean interval uses z = '+zc.toFixed(3)+'. That is only right when σ comes from long, stable history, not from this sample; otherwise clear it and use t.']);
  else if(n<30) f.push(['','With n = '+n+', the t interval assumes the data come from a roughly normal population. The t value ('+cv.toFixed(3)+') is wider than z ('+zc.toFixed(3)+') because s is itself an estimate.']);
 } else if(S.f.n||S.f.m||S.f.s||rv.length) f.push(['warn','The mean interval needs n (2 or more, a whole number), x̄, and s or a known σ.']);
 if(nOk&&sOk){
  var cU=ST.chiinv(1-aT,n-1), cL=ST.chiinv(aT,n-1), vLo=(n-1)*s*s/cU, vHi=(n-1)*s*s/cL;
  mt.push(['Variance σ²','χ², '+(n-1)+' df',F(s*s,dp+1),two||lowOnly?F(vLo,dp+1):'—',two||!lowOnly?F(vHi,dp+1):'—']);
  mt.push(['Standard deviation σ','√ of the variance limits',F(s,dp+1),two||lowOnly?F(Math.sqrt(vLo),dp+1):'—',two||!lowOnly?F(Math.sqrt(vHi),dp+1):'—']);
  vTxt='The '+clS+' '+what+' for σ is '+rngT(Math.sqrt(vLo),Math.sqrt(vHi),dp+1)+' (χ² = '+(two?cL.toFixed(3)+' and '+cU.toFixed(3):(lowOnly?cU:cL).toFixed(3))+'). It is not symmetric around s = '+F(s,dp+1)+', and it depends heavily on the data being normal.';
 }
 MS.innerHTML=tiles.length?'<div class="stat">'+tiles.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>':'';
 MT.innerHTML=mt.length?'<thead><tr><th>Parameter</th><th>Method</th><th>Estimate</th><th>Lower</th><th>Upper</th></tr></thead><tbody>'+mt.map(function(r){ return '<tr><td class="mo">'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td><b>'+r[3]+'</b></td><td><b>'+r[4]+'</b></td></tr>'; }).join('')+'</tbody>':'<tbody><tr><td class="mo">Enter n, x̄ and s (or raw values) to see the intervals.</td></tr></tbody>';
 if(mTxt) f.push(['ok',mTxt]); if(vTxt) f.push(['',vTxt]);
 /* ---- proportion ---- */
 var x=api.num(S.f.x), N=api.num(S.f.np), pl=S.f.pl||'items with the attribute', ph=NaN;
 var pOk=isFinite(x)&&isFinite(N)&&N>=1&&x>=0&&x<=N&&Math.round(x)===x&&Math.round(N)===N;
 if(pOk){
  ph=x/N; var sw=Math.sqrt(ph*(1-ph)/N), wl=ph-zc*sw, wh=ph+zc*sw, z2=zc*zc, den=1+z2/N, cen=(ph+z2/(2*N))/den, hw=zc/den*Math.sqrt(ph*(1-ph)/N+z2/(4*N*N));
  var ol=cen-hw, oh=cen+hw, el=x===0?0:ST.betainv(aT,x,N-x+1), eh=x===N?1:ST.betainv(1-aT,x+1,N-x);
  var M=[['Normal approximation (Wald)','p̂ ± z√(p̂(1−p̂)/n)',wl,wh],['Wilson score','solves |p̂ − p| = z√(p(1−p)/n) for p',ol,oh],['Exact (Clopper–Pearson)','from the binomial (beta) distribution',el,eh]];
  var pc=function(v){ return (v*100).toFixed(2)+'%'; };
  PT.innerHTML='<thead><tr><th>Method</th><th>How</th><th>Lower</th><th>Upper</th><th>Width</th></tr></thead><tbody>'+M.map(function(r){
   var lo=Math.max(0,r[2]), hi=Math.min(1,r[3]); return '<tr><td class="mo">'+r[0]+'</td><td class="mo2">'+r[1]+'</td><td'+(r[2]<0?' class="lo"':'')+'><b>'+(two||lowOnly?pc(lo):'—')+'</b></td><td'+(r[3]>1?' class="lo"':'')+'><b>'+(two||!lowOnly?pc(hi):'—')+'</b></td><td>'+(two?pc(hi-lo):'')+'</td></tr>'; }).join('')+'</tbody><tfoot><tr><td class="mo">p̂ = '+F(x,0)+' / '+F(N,0)+'</td><td></td><td colspan="3">'+pc(ph)+'</td></tr></tfoot>';
  /* chart */
  var W=800, L=190, R=30, rh=44, H=M.length*rh+58, all=[0,ph]; M.forEach(function(r){ all.push(Math.max(0,r[2]),Math.min(1,r[3])); });
  var mx=Math.max.apply(null,all), mn=Math.min(0,Math.min.apply(null,M.map(function(r){return r[2];}))); mx+=(mx-mn)*0.06||0.05; if(mn<0) mn-=(mx-mn)*0.03;
  var X=function(v){ return L+(v-mn)/(mx-mn)*(W-L-R); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Proportion intervals compared"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
  var st0=(mx-mn)/5, mg=Math.pow(10,Math.floor(Math.log(st0)/Math.LN10)), st=[1,2,2.5,5,10].map(function(k){return k*mg;}).filter(function(k){return k>=st0;})[0]||10*mg, tdp=Math.max(0,-Math.floor(Math.log(st*100)/Math.LN10+1e-9))+(st/mg===2.5?1:0);
  for(var tv=Math.ceil(mn/st-1e-9)*st;tv<=mx+1e-12;tv+=st){ g+='<line x1="'+X(tv)+'" y1="10" x2="'+X(tv)+'" y2="'+(H-38)+'" stroke="#EDEFEA"/><text class="ax" x="'+X(tv)+'" y="'+(H-22)+'" text-anchor="middle">'+(Math.abs(tv)<1e-12?0:tv*100).toFixed(tdp)+'%</text>'; }
  if(mn<0) g+='<rect x="'+X(mn)+'" y="10" width="'+(X(0)-X(mn))+'" height="'+(H-48)+'" fill="#FBEDEB"/><line x1="'+X(0)+'" y1="10" x2="'+X(0)+'" y2="'+(H-38)+'" stroke="#C0392B" stroke-dasharray="4 3"/>';
  g+='<line x1="'+X(ph)+'" y1="10" x2="'+X(ph)+'" y2="'+(H-38)+'" stroke="#0F3E68" stroke-dasharray="5 4"/>';
  M.forEach(function(r,j){ var cy=j*rh+34, lo=two||lowOnly?r[2]:mn, hi=two||!lowOnly?r[3]:mx;
   g+='<text x="'+(L-12)+'" y="'+(cy+5)+'" text-anchor="end">'+r[0].replace(/ \(.*\)/,'').replace('Normal approximation','Normal approx. (Wald)')+'</text>';
   g+='<line x1="'+X(lo)+'" y1="'+cy+'" x2="'+X(hi)+'" y2="'+cy+'" stroke="'+(j?'#0F3E68':'#9C7C1F')+'" stroke-width="3"/>';
   if(two||lowOnly) g+='<line x1="'+X(lo)+'" y1="'+(cy-7)+'" x2="'+X(lo)+'" y2="'+(cy+7)+'" stroke="'+(j?'#0F3E68':'#9C7C1F')+'" stroke-width="2"/>';
   if(two||!lowOnly) g+='<line x1="'+X(hi)+'" y1="'+(cy-7)+'" x2="'+X(hi)+'" y2="'+(cy+7)+'" stroke="'+(j?'#0F3E68':'#9C7C1F')+'" stroke-width="2"/>';
   g+='<circle cx="'+X(ph)+'" cy="'+cy+'" r="4" fill="#D8B147" stroke="#9C7C1F"/>'; });
  g+='<text class="ax" x="'+((W+L)/2)+'" y="'+(H-4)+'" text-anchor="middle">Dot = p̂, bar = '+clS+' '+what+(mn<0?'; shaded = below 0%':'')+'</text>';
  SV.innerHTML=g+'</svg>';
  var npq=Math.min(x,N-x);
  f.push(['ok','The '+clS+' Wilson '+what+' for the proportion of '+E(pl)+' is '+(two?pc(ol)+' to '+pc(oh):lowOnly?pc(ol):pc(oh))+' (p̂ = '+pc(ph)+').']);
  if(wl<0||wh>1) f.push(['warn','The normal-approximation interval runs '+(wl<0?'below 0%':'above 100%')+', which is impossible for a proportion; it was cut off at the boundary. That is the clearest sign the approximation has failed here.']);
  if(npq<10) f.push([wl<0||wh>1?'warn':'','np̂ = '+F(x,0)+' and n(1 − p̂) = '+F(N-x,0)+'. With fewer than about 10 '+(x<N-x?'items with the attribute':'items without it')+', the normal approximation is poor: it is centered on p̂ and symmetric, while the true sampling distribution is skewed near 0 or 1. Report the Wilson or the exact interval.']);
  else f.push(['','np̂ and n(1 − p̂) are both 10 or more, so all three methods agree closely. The Wilson interval is still the better default because it never leaves 0 to 100% and keeps its stated coverage better at small n.']);
 } else { PT.innerHTML=''; SV.innerHTML=''; if(S.f.x||S.f.np) f.push(['warn','The proportion interval needs whole numbers with 0 ≤ x ≤ n and n of at least 1.']); }
 /* ---- sample size ---- */
 var em=api.num(S.f.em), sp=api.num(S.f.sp), ep=api.num(S.f.ep), pp=api.num(S.f.pp), rows=[];
 var sPlan=isFinite(sp)&&sp>0?sp:(sOk?s:(sigOk?sig:NaN)), sSrc=isFinite(sp)&&sp>0?'planning σ':(sOk?'s from the data':'known σ');
 if(isFinite(em)&&em>0&&isFinite(sPlan)){
  var nz=Math.ceil(Math.pow(zc*sPlan/em,2)-1e-9), nt=Math.max(2,nz); while(nt<100000&&ST.tinv(1-aT,nt-1)*sPlan/Math.sqrt(nt)>em) nt++;
  rows.push(['Mean, z formula n = (zσ/E)²','σ = '+F(sPlan,dp+1)+' ('+sSrc+'), E = ±'+F(em,dp),F(nz,0)]);
  rows.push(['Mean, solved with t','smallest n with t·σ/√n ≤ E',F(nt,0)]);
  f.push(['','To estimate the mean within ±'+F(em,dp)+' at '+clS+' needs about '+F(nz,0)+' observations by the textbook z formula, or '+F(nt,0)+' when σ will be estimated from the sample and t is used. The answer is only as good as the planning σ.']);
 } else if(S.f.em) rows.push(['Mean','needs a margin above 0 and a planning σ (or s above)','—']);
 var pPlan=isFinite(pp)&&pp>0&&pp<1?pp:(isFinite(ph)&&ph>0&&ph<1?ph:0.5), pSrc=isFinite(pp)&&pp>0&&pp<1?'planning p':(isFinite(ph)&&ph>0&&ph<1?'p̂ from the data':'0.5, the most conservative value');
 if(isFinite(ep)&&ep>0&&ep<1){
  var npn=Math.ceil(zc*zc*pPlan*(1-pPlan)/(ep*ep)-1e-9), n5=Math.ceil(zc*zc*0.25/(ep*ep)-1e-9);
  rows.push(['Proportion, n = z²p(1−p)/E²','p = '+F(pPlan,3)+' ('+pSrc+'), E = ±'+F(ep,3),F(npn,0)]);
  if(pPlan!==0.5) rows.push(['Proportion, p = 0.5 (worst case)','used when there is no prior estimate',F(n5,0)]);
  f.push(['','To estimate the proportion within ±'+(ep*100).toFixed(1)+' percentage points needs about '+F(npn,0)+' items with p = '+F(pPlan,3)+(pPlan!==0.5?', or '+F(n5,0)+' if you assume nothing and plan with p = 0.5':'')+'. Halving the margin multiplies the sample size by four.']);
 } else if(S.f.ep) rows.push(['Proportion','needs a margin between 0 and 1','—']);
 NT.innerHTML=rows.length?'<thead><tr><th>Target</th><th>Inputs</th><th>Required n</th></tr></thead><tbody>'+rows.map(function(r){ return '<tr><td class="mo">'+r[0]+'</td><td class="mo2">'+r[1]+'</td><td><b>'+r[2]+'</b></td></tr>'; }).join('')+'</tbody>':'';
 if(!rows.length&&(mt.length||pOk)) f.push(['','Enter a margin of error in section 6 to see the sample size needed for it.']);
 O.innerHTML=api.flags(f,'Enter a sample (n, x̄, s) or a count (x of n) and the intervals appear here.');
},
example:{f:{cl:'95',side:'Two-sided interval',u:'STAT potassium turnaround time, min',n:'30',m:'38.4',s:'9.6',sig:'',d:'',x:'3',np:'60',pl:'hemolyzed specimens',em:'3',sp:'',ep:'0.03',pp:''}}
}
