{
slug:'distribution-explorer',
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
 function tcdf(t,v){ var p=0.5*ib(v/2,0.5,v/(v+t*t)); return t>0?1-p:p; }
 function ncdf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?1-q:q; }
 return {gln:gln,ib:ib,gq:gq,tcdf:tcdf,ncdf:ncdf};
})(),
sections:[
 {type:'fields',title:'Choose a distribution',cols:4,fields:[
  {id:'d',label:'Distribution',type:'select',opts:['Normal','Binomial','Poisson','Uniform','Exponential','Weibull','Lognormal','Hypergeometric','Student’s t','Chi-square','F','Multinomial'],wide:true},
  {id:'a',label:'Parameter 1',type:'number'},{id:'b',label:'Parameter 2',type:'number'},{id:'c',label:'Parameter 3',type:'number'},{id:'x',label:'Value of interest (x)',type:'number'},{id:'x2',label:'Upper value (optional)',type:'number',hint:'For the probability between two values.'},
  {id:'q',label:'Percentile: lower-tail probability (optional)',type:'number',min:0,max:1,hint:'e.g. 0.95 gives the value with 95% below it: a critical value.'},
  {id:'mc',label:'Multinomial categories: name, probability, count (one per line)',type:'textarea',rows:4,wide:true,ph:'Grade A, 0.70, 14'}]},
 {type:'custom',id:'p',title:'Shape and probabilities',html:'<p class="th de-par"></p><div class="svgw de-svg"></div><div class="de-st"></div><div class="tgw de-mt"></div><div class="out de-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, d=S.f.d||'Normal', a=n(S.f.a), b=n(S.f.b), c3=n(S.f.c), x=n(S.f.x), x2=n(S.f.x2), qq=n(S.f.q), ST=window.TOOL.ST;
 var par={Normal:['mean μ','standard deviation σ'],Binomial:['trials n','probability p'],Poisson:['mean rate λ',''],Uniform:['minimum a','maximum b'],Exponential:['mean (1/λ)',''],
  Weibull:['shape β','scale η (characteristic life)'],Lognormal:['mean of ln X (μ)','standard deviation of ln X (σ)'],Hypergeometric:['population size N','items of interest in the population, D','sample size n'],
  'Student’s t':['degrees of freedom ν',''],'Chi-square':['degrees of freedom k',''],F:['numerator degrees of freedom ν₁','denominator degrees of freedom ν₂'],Multinomial:['','']}[d]||['',''];
 /* show only the inputs this distribution uses */
 var vis=function(id,on){ var el=root.querySelector('[data-f="'+id+'"]'); if(el){ var lb=el.closest('.tf'); if(lb) lb.style.display=on?'':'none'; } };
 var mn=d==='Multinomial'; vis('a',!mn); vis('b',!mn); vis('x',!mn); vis('x2',!mn); vis('c',d==='Hypergeometric'); vis('mc',mn); vis('q',!mn);
 root.querySelector('.de-par').innerHTML=mn?'For the <b>Multinomial</b> distribution, list each category with its probability and the count you want the probability of. The counts add up to the number of trials n.':
  'For the <b>'+d+'</b> distribution, parameter 1 is the <b>'+par[0]+'</b>'+(par[2]?', parameter 2 is the <b>'+par[1]+'</b> and parameter 3 is the <b>'+par[2]+'</b>.':par[1]?' and parameter 2 is the <b>'+par[1]+'</b>.':'; parameter 2 is not used.');
 function erf(z){var s=z<0?-1:1;z=Math.abs(z);var t=1/(1+0.3275911*z);var y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-z*z);return s*y;}
 function lg(k){var s=0;for(var i=2;i<=k;i++)s+=Math.log(i);return s;}
 function lc(N,k){ return ST.gln(N+1)-ST.gln(k+1)-ST.gln(N-k+1); }
 var D={}, ok=true, err='', MT=root.querySelector('.de-mt');
 MT.innerHTML='';
 if(mn){ return this.multi(root,api); }
 if(d==='Normal'){ if(isNaN(a)||!(b>0)){ok=false;err='Enter a mean and a standard deviation greater than 0.';} else D={disc:false,lo:a-4*b,hi:a+4*b,pdf:function(t){return Math.exp(-0.5*Math.pow((t-a)/b,2))/(b*Math.sqrt(2*Math.PI));},cdf:function(t){return 0.5*(1+erf((t-a)/(b*Math.SQRT2)));},mu:a,sd:b}; }
 else if(d==='Binomial'){ if(!(a>=1)||Math.round(a)!==a||a>2000||!(b>=0&&b<=1)){ok=false;err='Enter whole-number trials n (1 to 2000) and a probability p from 0 to 1.';} else { var pm=function(k){ if(k<0||k>a) return 0; if(b===0) return k===0?1:0; if(b===1) return k===a?1:0; return Math.exp(lg(a)-lg(k)-lg(a-k)+k*Math.log(b)+(a-k)*Math.log(1-b)); }; D={disc:true,lo:0,hi:a,pmf:pm,mu:a*b,sd:Math.sqrt(a*b*(1-b))}; } }
 else if(d==='Poisson'){ if(!(a>0)||a>500){ok=false;err='Enter a mean rate λ greater than 0 (up to 500).';} else { var pp=function(k){ return k<0?0:Math.exp(-a+k*Math.log(a)-lg(k)); }; D={disc:true,lo:0,hi:Math.ceil(a+5*Math.sqrt(a)+5),pmf:pp,mu:a,sd:Math.sqrt(a)}; } }
 else if(d==='Uniform'){ if(isNaN(a)||!(b>a)){ok=false;err='Enter a minimum and a larger maximum.';} else D={disc:false,lo:a-(b-a)*0.15,hi:b+(b-a)*0.15,pdf:function(t){return t>=a&&t<=b?1/(b-a):0;},cdf:function(t){return t<a?0:t>b?1:(t-a)/(b-a);},mu:(a+b)/2,sd:(b-a)/Math.sqrt(12)}; }
 else if(d==='Exponential'){ if(!(a>0)){ok=false;err='Enter a mean greater than 0.';} else D={disc:false,lo:0,hi:a*5,pdf:function(t){return t<0?0:Math.exp(-t/a)/a;},cdf:function(t){return t<0?0:1-Math.exp(-t/a);},mu:a,sd:a}; }
 else if(d==='Weibull'){ if(!(a>0)||!(b>0)||a>50){ok=false;err='Enter a shape β greater than 0 (up to 50) and a scale η greater than 0.';} else { var g1=Math.exp(ST.gln(1+1/a)), g2=Math.exp(ST.gln(1+2/a));
   D={disc:false,nu:true,lo:0,hi:b*Math.pow(-Math.log(0.002),1/a),pdf:function(t){ if(t<0) return 0; if(t===0) return a<1?Infinity:a===1?1/b:0; return a/b*Math.pow(t/b,a-1)*Math.exp(-Math.pow(t/b,a)); },cdf:function(t){return t<=0?0:1-Math.exp(-Math.pow(t/b,a));},mu:b*g1,vr:b*b*(g2-g1*g1)}; } }
 else if(d==='Lognormal'){ if(isNaN(a)||!(b>0)||b>5){ok=false;err='Enter the mean μ of ln X and a standard deviation σ of ln X greater than 0 (up to 5).';} else
   D={disc:false,nu:true,lo:0,hi:Math.exp(a+2.576*b),pdf:function(t){ return t<=0?0:Math.exp(-0.5*Math.pow((Math.log(t)-a)/b,2))/(t*b*Math.sqrt(2*Math.PI)); },cdf:function(t){ return t<=0?0:ST.ncdf((Math.log(t)-a)/b); },mu:Math.exp(a+b*b/2),vr:(Math.exp(b*b)-1)*Math.exp(2*a+b*b)}; }
 else if(d==='Hypergeometric'){ if(!(a>=1)||Math.round(a)!==a||a>1e7||!(b>=0)||Math.round(b)!==b||b>a||!(c3>=1)||Math.round(c3)!==c3||c3>a||c3>5000){ok=false;err='Enter whole numbers: population size N (up to 10,000,000), items of interest D from 0 to N, and sample size n from 1 to N (up to 5,000).';}
   else { var hp=function(k){ if(k<Math.max(0,c3-a+b)||k>Math.min(c3,b)) return 0; return Math.exp(lc(b,k)+lc(a-b,c3-k)-lc(a,c3)); }, pD=b/a;
   D={disc:true,lo:Math.max(0,c3-a+b),hi:Math.min(c3,b),pmf:hp,mu:c3*pD,vr:a>1?c3*pD*(1-pD)*(a-c3)/(a-1):0}; } }
 else if(d==='Student’s t'){ if(!(a>0)||a>1e6){ok=false;err='Enter degrees of freedom ν greater than 0.';} else { var tk=Math.exp(ST.gln((a+1)/2)-ST.gln(a/2))/Math.sqrt(a*Math.PI);
   D={disc:false,nu:true,lo:0,hi:0,pdf:function(t){return tk*Math.pow(1+t*t/a,-(a+1)/2);},cdf:function(t){return ST.tcdf(t,a);},mu:a>1?0:NaN,vr:a>2?a/(a-2):a>1?Infinity:NaN};
   var th=Math.min(10,Math.max(4,pctl(D,0.995,-1,1))); D.lo=-th; D.hi=th; } }
 else if(d==='Chi-square'){ if(!(a>0)||a>1e5){ok=false;err='Enter degrees of freedom k greater than 0.';} else { var ck=-(a/2)*Math.LN2-ST.gln(a/2);
   D={disc:false,nu:true,lo:0,hi:1,pdf:function(t){ if(t<0) return 0; if(t===0) return a<2?Infinity:a===2?0.5:0; return Math.exp((a/2-1)*Math.log(t)-t/2+ck); },cdf:function(t){return t<=0?0:1-ST.gq(a/2,t/2);},mu:a,vr:2*a};
   D.hi=pctl(D,0.995,0,a+1); } }
 else if(d==='F'){ if(!(a>0)||!(b>0)||a>1e5||b>1e5){ok=false;err='Enter numerator and denominator degrees of freedom greater than 0.';} else { var fb=ST.gln(a/2)+ST.gln(b/2)-ST.gln((a+b)/2);
   D={disc:false,nu:true,lo:0,hi:1,pdf:function(t){ if(t<0) return 0; if(t===0) return a<2?Infinity:a===2?1:0; return Math.exp(0.5*(a*Math.log(a*t)+b*Math.log(b)-(a+b)*Math.log(a*t+b))-Math.log(t)-fb); },cdf:function(t){return t<=0?0:ST.ib(a/2,b/2,a*t/(a*t+b));},
   mu:b>2?b/(b-2):NaN,vr:b>4?2*b*b*(a+b-2)/(a*(b-2)*(b-2)*(b-4)):b>2?Infinity:NaN};
   D.hi=Math.max(pctl(D,0.98,0,2),2.5); } }
 function pctl(Dx,p,lo,hi){ var i=0; while(Dx.cdf(lo)>p&&i++<200) lo-=(hi-lo); i=0; while(Dx.cdf(hi)<p&&i++<200) hi+=(hi-lo); for(i=0;i<200;i++){ var m=(lo+hi)/2; if(Dx.cdf(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 var SV=root.querySelector('.de-svg'), ST2=root.querySelector('.de-st'), O=root.querySelector('.de-out');
 if(!ok){ SV.innerHTML=''; ST2.innerHTML=''; O.innerHTML=api.flags([['warn',err]]); return; }
 if(D.disc){ D.cdf=function(t){ var s=0; for(var k=0;k<=Math.floor(t)&&k<=D.hi+2000;k++) s+=D.pmf(k); return Math.min(1,s); }; }
 if(D.vr==null) D.vr=D.sd*D.sd; if(D.sd==null) D.sd=Math.sqrt(D.vr);
 if(D.nu){ /* newer distributions: stretch the axis to include the values asked about */
  [x,x2].forEach(function(v){ if(isFinite(v)&&v>D.hi) D.hi=v+(v-D.lo)*0.08; if(isFinite(v)&&v<D.lo) D.lo=v-(D.hi-v)*0.08; }); }
 var W=800,H=300,L=40,B=40,T=14, X=function(t){return L+(t-D.lo)/(D.hi-D.lo)*(W-L-10);};
 var pts=[], ymax=0;
 if(D.disc){ for(var k=D.lo;k<=D.hi;k++){ var v=D.pmf(k); pts.push([k,v]); ymax=Math.max(ymax,v); } }
 else { for(var i=0;i<=300;i++){ var t=D.lo+(D.hi-D.lo)*i/300, v=D.pdf(t); pts.push([t,v]); if(!D.nu||i>=4) ymax=Math.max(ymax,isFinite(v)?v:0); } }
 if(D.nu&&!D.disc) pts.forEach(function(p){ if(!(p[1]<=ymax*1.04)) p[1]=ymax*1.04; });
 var Y=function(v){return H-B-v/ymax*(H-B-T);};
 var inR=function(t){ if(isNaN(x)) return false; if(!isNaN(x2)) return t>=Math.min(x,x2)&&t<=Math.max(x,x2); return t<=x; };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Distribution"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 if(D.disc){ var bw=Math.max(1,(W-L-10)/(D.hi-D.lo+1)*0.8); pts.forEach(function(p){ g+='<rect x="'+(X(p[0])-bw/2)+'" y="'+Y(p[1])+'" width="'+bw+'" height="'+(H-B-Y(p[1]))+'" fill="'+(inR(p[0])?'#D8B147':'#0F3E68')+'"/>'; }); }
 else { var sh=pts.filter(function(p){return inR(p[0]);}); if(sh.length) g+='<path d="M'+X(sh[0][0])+' '+(H-B)+' '+sh.map(function(p){return 'L'+X(p[0])+' '+Y(p[1]);}).join(' ')+' L'+X(sh[sh.length-1][0])+' '+(H-B)+'Z" fill="#D8B147" fill-opacity=".55"/>';
  g+='<path d="'+pts.map(function(p,i){return (i?'L':'M')+X(p[0])+' '+Y(p[1]);}).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2.5"/>'; }
 g+='<line x1="'+L+'" x2="'+(W-10)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="#C6CDD3"/>';
 for(var j=0;j<=8;j++){ var tv=D.lo+(D.hi-D.lo)*j/8; g+='<text x="'+X(tv)+'" y="'+(H-B+16)+'" text-anchor="'+(j===8?'end':j===0?'start':'middle')+'">'+(D.disc?Math.round(tv):api.fmt(tv,Math.abs(D.hi-D.lo)<10?2:1))+'</text>'; }
 SV.innerHTML=g+'</svg>';
 var cells=[[api.fmt(D.mu,4),'Mean'],[api.fmt(D.sd,4),'Standard deviation'],[api.fmt(D.vr,4),'Variance']], f=[];
 if(!isNaN(x)){
  var le=D.cdf(x), lt=D.disc?D.cdf(Math.ceil(x)-1):le, ge=1-lt, gt=1-le;
  cells.push([api.fmt(le,4),'P(X ≤ '+x+')'],[api.fmt(D.disc?ge:gt,4),'P(X '+(D.disc?'≥':'&gt;')+' '+x+')']);
  if(D.disc) cells.push([api.fmt(D.pmf(Math.round(x)),4),'P(X = '+Math.round(x)+')']);
  if(!isNaN(x2)){ var lo=Math.min(x,x2), hi=Math.max(x,x2), pb=D.disc?D.cdf(hi)-D.cdf(Math.ceil(lo)-1):D.cdf(hi)-D.cdf(lo); cells.push([api.fmt(pb,4),'P('+lo+' ≤ X ≤ '+hi+')']); }
  if(d==='Normal') f.push(['','x = '+x+' is z = '+((x-a)/b).toFixed(3)+' standard deviations '+(x>=a?'above':'below')+' the mean.']);
  if(d==='Weibull'&&x>0) f.push(['','P(X &gt; '+x+') = '+api.fmt(gt,4)+' is the reliability R('+x+'): the share of units still working at '+x+'. The hazard (instantaneous failure rate) there is '+api.fmt(a/b*Math.pow(x/b,a-1),6)+'.']);
  if(D.disc&&Math.round(x)!==x) f.push(['warn','This distribution only takes whole numbers; x is treated as '+Math.floor(x)+' for "≤".']);
 } else f.push(['','Enter a value of interest to see probabilities. The shaded area is the probability.']);
 if(!isNaN(qq)){
  if(qq>0&&qq<1){ var xq;
   if(D.disc){ var cum=0; for(xq=0;;xq++){ cum+=D.pmf(xq); if(cum>=qq-1e-12||xq>=D.hi+2000) break; } if(d!=='Poisson') xq=Math.min(xq,D.hi);cells.push([String(xq),'Smallest x with P(X ≤ x) ≥ '+qq]); }
   else { xq=pctl(D,qq,D.lo,D.hi); cells.push([api.fmt(xq,4),'x with P(X ≤ x) = '+qq]);
    if(d==='Student’s t'||d==='Chi-square'||d==='F') f.push(['','The value with '+qq+' below it is '+api.fmt(xq,4)+'. That is the critical value a table gives for an upper-tail area of α = '+api.fmt(1-qq,4)+(d==='Student’s t'?' (for a two-sided test at α, use a lower-tail probability of 1 − α/2)':'')+'.']); }
  } else f.push(['warn','The percentile needs a lower-tail probability between 0 and 1.']);
 }
 if(d==='Student’s t'&&!(a>2)) f.push(['warn','With ν = '+a+' the '+(a>1?'variance is infinite':'mean and variance are undefined')+': the tails are so heavy that very large values are not rare. t needs ν &gt; 2 for a finite variance.']);
 if(d==='F'&&!(b>4)) f.push(['warn','With ν₂ = '+b+' the '+(b>2?'variance is infinite (it needs ν₂ &gt; 4)':'mean and variance are undefined (they need ν₂ &gt; 2 and ν₂ &gt; 4)')+'.']);
 if(d==='Weibull') f.push(['',a<1?'β &lt; 1: a falling failure rate, typical of early-life (infant mortality) failures.':Math.abs(a-1)<1e-9?'β = 1: a constant failure rate. The Weibull is then the exponential with mean η.':a<3.2?'β &gt; 1: a rising failure rate, typical of wear-out. Near β = 3.5 the shape is close to normal.':'β of about 3.5 or more: a rising failure rate and a nearly symmetric shape, close to normal.']);
 if(d==='Hypergeometric'&&a>0){ var fr=c3/a; f.push(['',fr>0.1?'The sample is '+api.fmt(fr*100,1)+'% of the population, so sampling without replacement matters and the binomial would mislead. Use the hypergeometric.':'The sample is only '+api.fmt(fr*100,1)+'% of the population, so the binomial with p = D/N = '+api.fmt(b/a,4)+' gives nearly the same answer.']); }
 var use={Normal:'Continuous measurements that cluster around a center: dimensions, weights, times from a stable process.',Binomial:'The number of defective items in a sample of n, when each item is defective with the same probability p.',Poisson:'The number of defects or events in a fixed amount of product, time or area, when they occur independently at an average rate.',Uniform:'Every value between two limits equally likely. Rare in processes; common as a "we know nothing more" assumption.',Exponential:'Time between independent random events, such as time between failures at a constant failure rate.',
  Weibull:'Life data: time or cycles to failure. The shape β tells you whether failures are early-life, random or wear-out; the scale η is the life by which 63.2% have failed.',
  Lognormal:'A positive quantity whose logarithm is normal: repair times, particle sizes, contaminant levels, some fatigue lives. Skewed to the right.',
  Hypergeometric:'The number of defectives in a sample drawn without replacement from a small, finite lot of N items holding D defectives. Lot-by-lot acceptance sampling of small lots.',
  'Student’s t':'The sampling distribution of a mean standardized with s instead of σ: t tests and confidence intervals for means. It approaches the normal as ν grows.',
  'Chi-square':'The sampling distribution of (n − 1)s²/σ²: tests and intervals for a variance, and the χ² tests of goodness of fit and of contingency tables.',
  F:'The ratio of two independent variance estimates: comparing two variances, and the F test in ANOVA and regression.'}[d];
 f.push(['','<b>Used for:</b> '+use]);
 ST2.innerHTML='<div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 O.innerHTML=api.flags(f);
},
multi:function(root,api){
 var S=api.state(), ST=window.TOOL.ST, F=api.fmt, E=api.esc, SV=root.querySelector('.de-svg'), STt=root.querySelector('.de-st'), MT=root.querySelector('.de-mt'), O=root.querySelector('.de-out'), f=[], C=[], bad=0;
 String(S.f.mc||'').split('\n').forEach(function(l){ l=l.trim(); if(!l) return; var m=l.match(/^(.*?)[,;\t ]+(-?[\d.]+(?:e-?\d+)?)\s*[,;\t ]+\s*(-?[\d.]+)\s*$/i);
  if(!m){ bad++; return; } var p=Number(m[2]), k=Number(m[3]); if(!(p>=0&&p<=1)||!(k>=0)||Math.round(k)!==k){ bad++; return; } C.push({nm:m[1].replace(/[,;]\s*$/,'').trim()||('Category '+(C.length+1)),p:p,k:k}); });
 SV.innerHTML=''; STt.innerHTML=''; MT.innerHTML='';
 if(bad) f.push(['warn',bad+' line'+(bad>1?'s':'')+' could not be read as "name, probability, count" with a probability from 0 to 1 and a whole-number count.']);
 if(C.length<2){ O.innerHTML=api.flags(f.concat([['warn','Enter at least two categories, one per line, as: name, probability, count.']])); return; }
 var sp=C.reduce(function(s,c){return s+c.p;},0), N=C.reduce(function(s,c){return s+c.k;},0);
 if(Math.abs(sp-1)>0.001){ O.innerHTML=api.flags(f.concat([['warn','The probabilities add to '+F(sp,4)+'. They must add to 1, because every trial lands in exactly one category.']])); return; }
 if(N<1||N>100000){ O.innerHTML=api.flags(f.concat([['warn','The counts must add to between 1 and 100,000 trials.']])); return; }
 var lp=ST.gln(N+1); C.forEach(function(c){ lp-=ST.gln(c.k+1); if(c.k>0) lp+=c.k*(c.p>0?Math.log(c.p):-Infinity); });
 var P=Math.exp(lp);
 function bcdf(k,n,p){ if(k>=n) return 1; if(p<=0) return 1; if(p>=1) return k>=n?1:0; return 1-ST.ib(k+1,n-k,p); }
 STt.innerHTML='<div class="stat"><div><b>'+F(N,0)+'</b><span>Trials n (sum of counts)</span></div><div><b>'+C.length+'</b><span>Categories</span></div><div><b>'+(P>0&&P<1e-4?P.toExponential(4):F(P,6))+'</b><span>P(exactly these counts)</span></div></div>';
 MT.innerHTML='<table class="tg de-mtb"><thead><tr><th>Category</th><th>p</th><th>Count x</th><th>Mean n·p</th><th>Variance n·p(1−p)</th><th>P(X ≤ x) on its own</th></tr></thead><tbody>'+C.map(function(c){ return '<tr><td>'+E(c.nm)+'</td><td>'+F(c.p,4)+'</td><td>'+c.k+'</td><td>'+F(N*c.p,4)+'</td><td>'+F(N*c.p*(1-c.p),4)+'</td><td>'+F(bcdf(c.k,N,c.p),4)+'</td></tr>'; }).join('')+'</tbody></table>';
 var W=800,H=280,L=48,B=50,T=24, mx=0; C.forEach(function(c){ mx=Math.max(mx,c.k,N*c.p); }); mx=mx*1.1||1;
 var bw=(W-L-10)/C.length, Y=function(v){return H-B-v/mx*(H-B-T);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Counts against expected counts"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}.lb{font:12px Archivo,sans-serif;fill:#16273A}</style>';
 g+='<rect x="'+(W-250)+'" y="4" width="12" height="12" fill="#0F3E68"/><text x="'+(W-232)+'" y="14">your count</text><rect x="'+(W-140)+'" y="4" width="12" height="12" fill="#D8B147"/><text x="'+(W-122)+'" y="14">mean n·p</text>';
 C.forEach(function(c,i){ var x0=L+i*bw, w=Math.min(46,bw*0.36);
  g+='<rect x="'+(x0+bw/2-w-2)+'" y="'+Y(c.k)+'" width="'+w+'" height="'+(H-B-Y(c.k))+'" fill="#0F3E68"/><rect x="'+(x0+bw/2+2)+'" y="'+Y(N*c.p)+'" width="'+w+'" height="'+(H-B-Y(N*c.p))+'" fill="#D8B147"/>';
  var nm=c.nm.length>(C.length>6?8:16)?c.nm.slice(0,C.length>6?7:15)+'…':c.nm; g+='<text class="lb" x="'+(x0+bw/2)+'" y="'+(H-B+18)+'" text-anchor="middle">'+E(nm)+'</text><text x="'+(x0+bw/2)+'" y="'+(H-B+34)+'" text-anchor="middle">p = '+F(c.p,3)+'</text>'; });
 g+='<line x1="'+L+'" x2="'+(W-10)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="#C6CDD3"/>';
 SV.innerHTML=g+'</svg>';
 f.push(['','P = n! ÷ (x₁!·x₂!·…·x<sub>k</sub>!) × p₁<sup>x₁</sup>·p₂<sup>x₂</sup>·…·p<sub>k</sub><sup>x<sub>k</sub></sup> = <b>'+(P>0&&P<1e-4?P.toExponential(4):F(P,6))+'</b>: the probability that '+F(N,0)+' independent trials fall into the categories in exactly these numbers.']);
 f.push(['','Each category on its own is binomial with n = '+F(N,0)+' and its own p, so its mean is n·p and its variance n·p(1 − p). The counts are not independent: they must add to n, so one category running high pushes the others down.']);
 f.push(['','<b>Used for:</b> more than two outcomes per trial: grades A, B and scrap; defect types; survey answers. With two categories it is the binomial.']);
 O.innerHTML=api.flags(f);
},
example:{f:{d:'Normal',a:'10.016',b:'0.0286',x:'10.05',x2:''}}
}
