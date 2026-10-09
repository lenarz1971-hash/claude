{
slug:'variables-sampling-plan',
sections:[
 {type:'fields',title:'The lot and the plan',cols:4,hint:'Read the sample size n and the acceptability constant k (Form 1) or the maximum allowable percent nonconforming M (Form 2) from your plan, for example ANSI/ASQ Z1.9 at your lot size, inspection level and AQL. This tool does not contain the standard&rsquo;s tables. Give one or both specification limits.',fields:[
  {id:'lot',label:'Lot',ph:'e.g. Lot 26-114, 1,200 pcs'},
  {id:'ch',label:'Characteristic',ph:'e.g. Spring force at 20 mm'},
  {id:'unit',label:'Unit',ph:'e.g. N'},
  {id:'sig',label:'Variability',type:'select',opts:['Unknown: standard deviation method','Known: sigma from long-run data']},
  {id:'sg',label:'Known σ (only for known variability)',type:'number',min:0},
  {id:'n',label:'Sample size n, from the plan',type:'number',min:2},
  {id:'k',label:'k, Form 1',type:'number',min:0},
  {id:'M',label:'M %, Form 2 (optional)',type:'number',min:0,max:100},
  {id:'L',label:'Lower spec limit L',type:'number'},
  {id:'U',label:'Upper spec limit U',type:'number'}]},
 {type:'fields',title:'The sample measurements',hint:'Measure every unit in the random sample and enter the values, five to a row. Variables plans assume the characteristic is normally distributed.',fields:[
  {id:'data',label:'Values, five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:3,minRows:2}]},
 {type:'custom',id:'f1',title:'Form 1: the k-method',hint:'Quality index Q<sub>U</sub> = (U &minus; x&#772;)/s and Q<sub>L</sub> = (x&#772; &minus; L)/s (&sigma; in place of s when it is known). Accept if Q &ge; k. In other words, the sample mean must sit at least k standard deviations inside the limit.',html:'<div class="stat vs-st"></div><div class="svgw vs-svg"></div>'},
 {type:'custom',id:'f2',title:'Form 2: estimated percent nonconforming',hint:'Form 2 turns each Q into an estimate of the percent of the lot beyond that limit and compares the total with M. It is the form used for two specification limits.',html:'<div class="stat vs-f2"></div>'},
 {type:'custom',id:'oc',title:'What this n and k protect against',hint:'Operating characteristic (OC) curve for one specification limit: the chance of accepting a lot against the percent of it beyond the limit.',html:'<div class="stat vs-ocs"></div><div class="svgw vs-oc"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out vs-out"></div>'}
],
update:function(root,api){
 var S=api.state(), nm=api.num, f=[], u=api.esc(S.f.unit||'');
 /* normal distribution, incomplete beta, log-gamma */
 function erfc(x){ var z=Math.abs(x), t=1/(1+0.5*z), r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277))))))))); return x>=0?r:2-r; }
 function Phi(z){ return 0.5*erfc(-z/Math.SQRT2); }
 function Pinv(p){ var a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416],q,r,x;
  if(p<0.02425){ q=Math.sqrt(-2*Math.log(p)); x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  else if(p>1-0.02425){ q=Math.sqrt(-2*Math.log(1-p)); x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  else { q=p-0.5; r=q*q; x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1); }
  var e=Phi(x)-p, uu=e*Math.sqrt(2*Math.PI)*Math.exp(x*x/2); return x-uu/(1+x*uu/2); }
 function lgam(x){ var c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5], y=x, t=x+5.5; t-=(x+0.5)*Math.log(t); var s=1.000000000190015; for(var j=0;j<6;j++) s+=c[j]/++y; return -t+Math.log(2.5066282746310005*s/x); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap; if(Math.abs(d)<1e-300) d=1e-300; d=1/d; var h=d;
  for(var m=1;m<=300;m++){ var m2=2*m, aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; var del=d*c; h*=del; if(Math.abs(del-1)<3e-16) break; } return h; }
 function ibeta(x,a,b){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(lgam(a+b)-lgam(a)-lgam(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 /* minimum-variance unbiased estimate of the fraction beyond a limit */
 function phat(Q,n,known){ if(!isFinite(Q)) return NaN; if(known) return 1-Phi(Q*Math.sqrt(n/(n-1)));
  var x=0.5-0.5*Q*Math.sqrt(n)/(n-1); if(x<=0) return 0; if(x>=1) return 1; return ibeta(x,n/2-1,n/2-1); }
 /* chance of acceptance, one limit, k-method */
 function pa(p,n,k,known){ var zp=-Pinv(p); if(known) return Phi(Math.sqrt(n)*(zp-k));
  var nu=n-1, dl=zp*Math.sqrt(n), c=k*Math.sqrt(n), top=1+9/Math.sqrt(2*nu)+0.5, N=800, h=top/N, s=0, lc=Math.log(2)+(nu/2)*Math.log(nu/2)-lgam(nu/2);
  for(var i=0;i<=N;i++){ var w=i*h, fw=w>0?Math.exp(lc+(nu-1)*Math.log(w)-nu*w*w/2):(nu===1?Infinity:0), g=Phi(dl-c*w)*fw; s+=(i===0||i===N?1:(i%2?4:2))*g; } return Math.min(1,Math.max(0,s*h/3)); }
 function solve(target,n,k,known){ var lo=Math.log(1e-7), hi=Math.log(0.6); for(var i=0;i<60;i++){ var m=(lo+hi)/2; if(pa(Math.exp(m),n,k,known)>target) lo=m; else hi=m; } return Math.exp((lo+hi)/2); }
 var x=[]; (S.f.data||'').split(/[\s,;]+/).filter(Boolean).forEach(function(t){ var v=Number(t); if(isFinite(v)) x.push(v); });
 var known=/^Known/.test(S.f.sig||''), sg=nm(S.f.sg), n=nm(S.f.n), k=nm(S.f.k), M=nm(S.f.M), L=nm(S.f.L), U=nm(S.f.U), hasL=isFinite(L), hasU=isFinite(U);
 var ST=root.querySelector('.vs-st'), SV=root.querySelector('.vs-svg'), F2=root.querySelector('.vs-f2'), OS=root.querySelector('.vs-ocs'), OC=root.querySelector('.vs-oc'), O=root.querySelector('.vs-out');
 function F(v,d){ return isFinite(v)?api.fmt(v,d==null?3:d):'—'; }
 function P(v){ return isFinite(v)?(v>0&&v<0.0001?'&lt;0.01%':api.fmt(100*v,v<0.01?3:2)+'%'):'—'; }
 /* OC curve: needs n and k only */
 if(n>=3&&n%1===0&&k>=0){
  var p95=solve(0.95,n,k,known), p50=solve(0.5,n,k,known), p10=solve(0.10,n,k,known), pmax=Math.min(0.6,solve(0.01,n,k,known)*1.05);
  OS.innerHTML='<div><b>'+P(p95)+'</b><span>Beyond the limit, 95% chance to accept</span></div><div><b>'+P(p50)+'</b><span>50% chance to accept (indifference)</span></div><div><b>'+P(p10)+'</b><span>Beyond the limit, 10% chance to accept</span></div>';
  var W=800, H=300, L0=60, R0=16, T0=14, B0=H-42, X=function(p){ return L0+p/pmax*(W-L0-R0); }, Y=function(a){ return B0-a*(B0-T0); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Operating characteristic curve"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.l{font:600 11px \'IBM Plex Mono\',monospace}</style><rect x="'+L0+'" y="'+T0+'" width="'+(W-L0-R0)+'" height="'+(B0-T0)+'" fill="#fff" stroke="#DDE1E4"/>';
  for(var i=0;i<=5;i++){ g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+Y(i/5)+'" y2="'+Y(i/5)+'" stroke="#F0F2F4"/><text x="'+(L0-6)+'" y="'+(Y(i/5)+4)+'" text-anchor="end">'+(i*20)+'%</text>'; var pv=pmax*i/5; g+='<text x="'+X(pv)+'" y="'+(B0+16)+'" text-anchor="'+(i===0?'start':i===5?'end':'middle')+'">'+api.fmt(100*pv,pmax<0.05?2:1)+'%</text>'; }
  var pth=''; for(i=0;i<=120;i++){ var pp=Math.max(1e-7,pmax*i/120); pth+=(i?' L':'M')+X(pmax*i/120).toFixed(1)+' '+Y(pa(pp,n,k,known)).toFixed(1); }
  g+='<path d="'+pth+'" fill="none" stroke="#0F3E68" stroke-width="2.5"/>';
  [[p95,0.95,'#1F8C55'],[p10,0.10,'#C0392B']].forEach(function(m){ g+='<line x1="'+X(m[0])+'" x2="'+X(m[0])+'" y1="'+Y(m[1])+'" y2="'+B0+'" stroke="'+m[2]+'" stroke-dasharray="4 3"/><circle cx="'+X(m[0])+'" cy="'+Y(m[1])+'" r="4.5" fill="'+m[2]+'"/><text class="l" x="'+(X(m[0])+7)+'" y="'+(Y(m[1])-6)+'" style="fill:'+m[2]+'">'+P(m[0])+'</text>'; });
  g+='<text x="'+((L0+W-R0)/2)+'" y="'+(H-6)+'" text-anchor="middle">Percent of the lot beyond the limit &middot; n = '+n+', k = '+api.fmt(k,3)+', &sigma; '+(known?'known':'unknown')+'</text><text transform="translate(14 '+((B0+T0)/2)+') rotate(-90)" text-anchor="middle">Chance of accepting</text>';
  OC.innerHTML=g+'</svg>';
 } else { OS.innerHTML=''; OC.innerHTML=''; }
 /* the sample */
 var ready=x.length>=2&&(hasL||hasU)&&(!known||sg>0);
 if(!ready){ ST.innerHTML=''; SV.innerHTML=''; F2.innerHTML='';
  if(known&&!(sg>0)) f.push(['warn','Known variability needs the known standard deviation &sigma;.']);
  O.innerHTML=api.flags(f,'Enter the plan (n and k), at least one specification limit, and the sample measurements.'); return; }
 var N=x.length, m=x.reduce(function(a,b){ return a+b; },0)/N, ss=x.reduce(function(a,b){ return a+(b-m)*(b-m); },0), s=Math.sqrt(ss/(N-1)), sd=known?sg:s;
 var QU=hasU?(U-m)/sd:NaN, QL=hasL?(m-L)/sd:NaN, okU=!hasU||QU>=k, okL=!hasL||QL>=k, ok1=isFinite(k)&&okU&&okL;
 var tiles=[[N,'Units measured'],[F(m,4),'Sample mean x&#772;'],[F(sd,4),known?'Known &sigma;':'Sample std dev s']];
 if(hasU) tiles.push([F(QU,3),'Q<sub>U</sub> = (U &minus; x&#772;) / '+(known?'&sigma;':'s')]);
 if(hasL) tiles.push([F(QL,3),'Q<sub>L</sub> = (x&#772; &minus; L) / '+(known?'&sigma;':'s')]);
 if(isFinite(k)) tiles.push(['<span class="vs-d '+(ok1?'ok':'no')+'">'+(ok1?'Accept':'Reject')+'</span>','Form 1 decision (k = '+api.fmt(k,3)+')']);
 ST.innerHTML=tiles.map(function(t){ return '<div><b>'+t[0]+'</b><span>'+t[1]+'</span></div>'; }).join('');
 /* picture: limits, acceptance zone for the mean, the sample */
 var lo=Math.min.apply(null,x.concat(hasL?[L]:[]).concat(hasU?[U]:[])), hi=Math.max.apply(null,x.concat(hasL?[L]:[]).concat(hasU?[U]:[]));
 if(!hasL) lo=Math.min(lo,m-4*sd); if(!hasU) hi=Math.max(hi,m+4*sd); var pad=(hi-lo)*0.06||1; lo-=pad; hi+=pad;
 var W2=800, H2=170, l0=20, r0=20, Xs=function(v){ return l0+(v-lo)/(hi-lo)*(W2-l0-r0); }, y0=96;
 var aL=hasL?L+(isFinite(k)?k:0)*sd:lo, aU=hasU?U-(isFinite(k)?k:0)*sd:hi;
 var g2='<svg viewBox="0 0 '+W2+' '+H2+'" role="img" aria-label="Sample against the specification limits"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.l{font:700 11px \'IBM Plex Mono\',monospace}</style>';
 if(isFinite(k)&&aU>aL) g2+='<rect x="'+Xs(Math.max(lo,aL))+'" y="'+(y0-46)+'" width="'+(Xs(Math.min(hi,aU))-Xs(Math.max(lo,aL)))+'" height="62" fill="#E7F4EC"/><text x="'+((Xs(Math.max(lo,aL))+Xs(Math.min(hi,aU)))/2)+'" y="'+(y0-32)+'" text-anchor="middle" style="fill:#1F8C55" class="l">x&#772; HERE ACCEPTS</text>';
 g2+='<line x1="'+l0+'" x2="'+(W2-r0)+'" y1="'+(y0+16)+'" y2="'+(y0+16)+'" stroke="#C6CDD3"/>';
 [[hasL,L,'L'],[hasU,U,'U']].forEach(function(z){ if(!z[0]) return; g2+='<line x1="'+Xs(z[1])+'" x2="'+Xs(z[1])+'" y1="'+(y0-58)+'" y2="'+(y0+24)+'" stroke="#C0392B" stroke-width="2"/><text class="l" x="'+Xs(z[1])+'" y="'+(y0-62)+'" text-anchor="middle" style="fill:#C0392B">'+z[2]+' = '+api.fmt(z[1],4)+'</text>'; });
 if(isFinite(k)){ if(hasL) g2+='<line x1="'+Xs(aL)+'" x2="'+Xs(aL)+'" y1="'+(y0-46)+'" y2="'+(y0+16)+'" stroke="#1F8C55" stroke-dasharray="4 3"/><text x="'+Xs(aL)+'" y="'+(y0+40)+'" text-anchor="middle" style="fill:#1F8C55">L + k'+(known?'&sigma;':'s')+'</text>';
  if(hasU) g2+='<line x1="'+Xs(aU)+'" x2="'+Xs(aU)+'" y1="'+(y0-46)+'" y2="'+(y0+16)+'" stroke="#1F8C55" stroke-dasharray="4 3"/><text x="'+Xs(aU)+'" y="'+(y0+40)+'" text-anchor="middle" style="fill:#1F8C55">U &minus; k'+(known?'&sigma;':'s')+'</text>'; }
 var stack={}; x.slice().sort(function(a,b){ return a-b; }).forEach(function(v){ var b=Math.round(Xs(v)/7); stack[b]=(stack[b]||0)+1; g2+='<circle cx="'+Xs(v).toFixed(1)+'" cy="'+(y0+10-(stack[b]-1)*8)+'" r="3.6" fill="#0F3E68" fill-opacity=".75"/>'; });
 g2+='<path d="M'+Xs(m)+' '+(y0+18)+' l-7 12 h14 z" fill="'+(ok1||!isFinite(k)?'#D8B147':'#C0392B')+'"/><text class="l" x="'+Xs(m)+'" y="'+(y0+60)+'" text-anchor="middle" style="fill:#0F3E68">x&#772; = '+api.fmt(m,4)+'</text></svg>';
 SV.innerHTML=g2;
 /* Form 2 */
 var pU=hasU&&N>=3?phat(QU,N,known):NaN, pL=hasL&&N>=3?phat(QL,N,known):NaN, pT=(isFinite(pU)?pU:0)+(isFinite(pL)?pL:0);
 var t2=[]; if(hasU) t2.push([P(pU),'p&#770;<sub>U</sub>, estimated beyond U']); if(hasL) t2.push([P(pL),'p&#770;<sub>L</sub>, estimated beyond L']);
 if(hasU&&hasL) t2.push([P(pT),'p&#770; total']);
 if(isFinite(M)) t2.push(['<span class="vs-d '+(100*pT<=M?'ok':'no')+'">'+(100*pT<=M?'Accept':'Reject')+'</span>','Form 2 decision (M = '+api.fmt(M,3)+'%)']);
 F2.innerHTML=N>=3?t2.map(function(t){ return '<div><b>'+t[0]+'</b><span>'+t[1]+'</span></div>'; }).join(''):'<p class="th">Form 2 needs at least three measurements.</p>';
 /* checks */
 if(isFinite(n)&&N!==n) f.push(['warn','The plan calls for n = '+n+' but '+N+' values are entered. The k and M values in the plan only apply at that sample size.']);
 if(isFinite(k)){ var parts=[]; if(hasU) parts.push('Q<sub>U</sub> = '+F(QU,3)+(okU?' &ge; ':' &lt; ')+'k'); if(hasL) parts.push('Q<sub>L</sub> = '+F(QL,3)+(okL?' &ge; ':' &lt; ')+'k');
  f.push([ok1?'ok':'warn','Form 1: '+parts.join(', ')+' = '+api.fmt(k,3)+'. '+(ok1?'Accept the lot.':'Reject the lot.')+' Equivalently, x&#772; must lie '+(hasL&&hasU?'between L + k'+(known?'&sigma;':'s')+' = '+F(aL,4)+' and U &minus; k'+(known?'&sigma;':'s')+' = '+F(aU,4):hasU?'at or below U &minus; k'+(known?'&sigma;':'s')+' = '+F(aU,4):'at or above L + k'+(known?'&sigma;':'s')+' = '+F(aL,4))+'.']); }
 else f.push(['','Enter k from the plan for the Form 1 decision.']);
 if(hasL&&hasU) f.push(['warn','Two specification limits: ANSI/ASQ Z1.9 decides these lots with <b>Form 2</b> (the M method): accept if p&#770;<sub>U</sub> + p&#770;<sub>L</sub> &le; M when one AQL covers both limits. The k test on each limit above is a quick screen, not the standard&rsquo;s criterion. The standard also gives a maximum standard deviation (MSD) for double limits; a sample s above it means the lot cannot be accepted however well centered.']);
 if(isFinite(M)&&isFinite(k)&&!(hasL&&hasU)&&((100*pT<=M)!==ok1)) f.push(['','Form 1 and Form 2 disagree here. For a single limit the two forms of the same plan give the same decision, so check that k and M were read from the same row of the plan.']);
 if(isFinite(k)&&n>=3){ var Meq=phat(k,n,known); f.push(['','For a single limit, Form 2 with M = '+P(Meq)+' gives exactly the same decisions as Form 1 with k = '+api.fmt(k,3)+' at n = '+n+'. The two forms are the same plan written two ways.']); }
 var out=x.filter(function(v){ return (hasL&&v<L)||(hasU&&v>U); }).length;
 if(out) f.push(['warn',out+' sampled unit'+(out>1?'s are':' is')+' outside the specification. Those units are nonconforming whatever the lot decision; segregate them.']);
 else if(!ok1&&isFinite(k)) f.push(['','Every sampled unit is inside the specification, yet the lot is rejected. That is how a variables plan works: it judges how much of the lot is likely beyond the limit from the mean and spread, not from the sampled units alone.']);
 if(N>=8){ var sk=x.reduce(function(a,b){ return a+Math.pow((b-m)/s,3); },0)*N/((N-1)*(N-2)); if(Math.abs(sk)>1) f.push(['warn','The sample is skewed (skewness '+F(sk,2)+'). Variables plans assume a normal distribution; with a skewed characteristic the estimated percent nonconforming can be badly wrong. Check normality on past lots, or use an attributes plan.']); }
 if(known) f.push(['','Known variability: use this only when &sigma; comes from a long, stable record (a control chart in control). With &sigma; known the same protection needs a smaller sample.']);
 else f.push(['','Unknown variability, standard deviation method: s is the sample standard deviation (n &minus; 1). The estimate p&#770; uses the beta distribution with (n &minus; 2)/2 and (n &minus; 2)/2, the minimum-variance unbiased estimate behind the standard&rsquo;s Form 2 table.']);
 O.innerHTML=api.flags(f);
},
example:{f:{lot:'Lot 26-114, 1,200 springs, Pellmont Spring Works',ch:'Spring force at 20 mm working height',unit:'N',sig:'Unknown: standard deviation method',sg:'',n:'10',k:'1.70',M:'3.41',L:'48.0',U:'',
 data:'49.6 48.8 50.4 51.4 52.5 51.0 50.0 49.6 51.9 53.3'}}
}
