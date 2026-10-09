{
slug:'distribution-explorer',
sections:[
 {type:'fields',title:'Choose a distribution',cols:4,fields:[
  {id:'d',label:'Distribution',type:'select',opts:['Normal','Binomial','Poisson','Uniform','Exponential'],wide:true},
  {id:'a',label:'Parameter 1',type:'number'},{id:'b',label:'Parameter 2',type:'number'},{id:'x',label:'Value of interest (x)',type:'number'},{id:'x2',label:'Upper value (optional)',type:'number',hint:'For the probability between two values.'}]},
 {type:'custom',id:'p',title:'Shape and probabilities',html:'<p class="th de-par"></p><div class="svgw de-svg"></div><div class="de-st"></div><div class="out de-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, d=S.f.d||'Normal', a=n(S.f.a), b=n(S.f.b), x=n(S.f.x), x2=n(S.f.x2);
 var par={Normal:['mean μ','standard deviation σ'],Binomial:['trials n','probability p'],Poisson:['mean rate λ',''],Uniform:['minimum a','maximum b'],Exponential:['mean (1/λ)','']}[d];
 root.querySelector('.de-par').innerHTML='For the <b>'+d+'</b> distribution, parameter 1 is the <b>'+par[0]+'</b>'+(par[1]?' and parameter 2 is the <b>'+par[1]+'</b>.':'; parameter 2 is not used.');
 function erf(z){var s=z<0?-1:1;z=Math.abs(z);var t=1/(1+0.3275911*z);var y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-z*z);return s*y;}
 function lg(k){var s=0;for(var i=2;i<=k;i++)s+=Math.log(i);return s;}
 var D={}, ok=true, err='';
 if(d==='Normal'){ if(isNaN(a)||!(b>0)){ok=false;err='Enter a mean and a standard deviation greater than 0.';} else D={disc:false,lo:a-4*b,hi:a+4*b,pdf:function(t){return Math.exp(-0.5*Math.pow((t-a)/b,2))/(b*Math.sqrt(2*Math.PI));},cdf:function(t){return 0.5*(1+erf((t-a)/(b*Math.SQRT2)));},mu:a,sd:b}; }
 else if(d==='Binomial'){ if(!(a>=1)||Math.round(a)!==a||a>2000||!(b>=0&&b<=1)){ok=false;err='Enter whole-number trials n (1 to 2000) and a probability p from 0 to 1.';} else { var pm=function(k){ if(k<0||k>a) return 0; if(b===0) return k===0?1:0; if(b===1) return k===a?1:0; return Math.exp(lg(a)-lg(k)-lg(a-k)+k*Math.log(b)+(a-k)*Math.log(1-b)); }; D={disc:true,lo:0,hi:a,pmf:pm,mu:a*b,sd:Math.sqrt(a*b*(1-b))}; } }
 else if(d==='Poisson'){ if(!(a>0)||a>500){ok=false;err='Enter a mean rate λ greater than 0 (up to 500).';} else { var pp=function(k){ return k<0?0:Math.exp(-a+k*Math.log(a)-lg(k)); }; D={disc:true,lo:0,hi:Math.ceil(a+5*Math.sqrt(a)+5),pmf:pp,mu:a,sd:Math.sqrt(a)}; } }
 else if(d==='Uniform'){ if(isNaN(a)||!(b>a)){ok=false;err='Enter a minimum and a larger maximum.';} else D={disc:false,lo:a-(b-a)*0.15,hi:b+(b-a)*0.15,pdf:function(t){return t>=a&&t<=b?1/(b-a):0;},cdf:function(t){return t<a?0:t>b?1:(t-a)/(b-a);},mu:(a+b)/2,sd:(b-a)/Math.sqrt(12)}; }
 else if(d==='Exponential'){ if(!(a>0)){ok=false;err='Enter a mean greater than 0.';} else D={disc:false,lo:0,hi:a*5,pdf:function(t){return t<0?0:Math.exp(-t/a)/a;},cdf:function(t){return t<0?0:1-Math.exp(-t/a);},mu:a,sd:a}; }
 var SV=root.querySelector('.de-svg'), ST=root.querySelector('.de-st'), O=root.querySelector('.de-out');
 if(!ok){ SV.innerHTML=''; ST.innerHTML=''; O.innerHTML=api.flags([['warn',err]]); return; }
 if(D.disc){ D.cdf=function(t){ var s=0; for(var k=0;k<=Math.floor(t)&&k<=D.hi+2000;k++) s+=D.pmf(k); return Math.min(1,s); }; }
 var W=800,H=300,L=40,B=40,T=14, X=function(t){return L+(t-D.lo)/(D.hi-D.lo)*(W-L-10);};
 var pts=[], ymax=0;
 if(D.disc){ for(var k=D.lo;k<=D.hi;k++){ var v=D.pmf(k); pts.push([k,v]); ymax=Math.max(ymax,v); } }
 else { for(var i=0;i<=300;i++){ var t=D.lo+(D.hi-D.lo)*i/300, v=D.pdf(t); pts.push([t,v]); ymax=Math.max(ymax,v); } }
 var Y=function(v){return H-B-v/ymax*(H-B-T);};
 var inR=function(t){ if(isNaN(x)) return false; if(!isNaN(x2)) return t>=Math.min(x,x2)&&t<=Math.max(x,x2); return t<=x; };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Distribution"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 if(D.disc){ var bw=Math.max(1,(W-L-10)/(D.hi-D.lo+1)*0.8); pts.forEach(function(p){ g+='<rect x="'+(X(p[0])-bw/2)+'" y="'+Y(p[1])+'" width="'+bw+'" height="'+(H-B-Y(p[1]))+'" fill="'+(inR(p[0])?'#D8B147':'#0F3E68')+'"/>'; }); }
 else { var sh=pts.filter(function(p){return inR(p[0]);}); if(sh.length) g+='<path d="M'+X(sh[0][0])+' '+(H-B)+' '+sh.map(function(p){return 'L'+X(p[0])+' '+Y(p[1]);}).join(' ')+' L'+X(sh[sh.length-1][0])+' '+(H-B)+'Z" fill="#D8B147" fill-opacity=".55"/>';
  g+='<path d="'+pts.map(function(p,i){return (i?'L':'M')+X(p[0])+' '+Y(p[1]);}).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2.5"/>'; }
 g+='<line x1="'+L+'" x2="'+(W-10)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="#C6CDD3"/>';
 for(var j=0;j<=8;j++){ var tv=D.lo+(D.hi-D.lo)*j/8; g+='<text x="'+X(tv)+'" y="'+(H-B+16)+'" text-anchor="'+(j===8?'end':j===0?'start':'middle')+'">'+(D.disc?Math.round(tv):api.fmt(tv,Math.abs(D.hi-D.lo)<10?2:1))+'</text>'; }
 SV.innerHTML=g+'</svg>';
 var cells=[[api.fmt(D.mu,4),'Mean'],[api.fmt(D.sd,4),'Standard deviation']], f=[];
 if(!isNaN(x)){
  var le=D.cdf(x), lt=D.disc?D.cdf(Math.ceil(x)-1):le, ge=1-lt, gt=1-le;
  cells.push([api.fmt(le,4),'P(X ≤ '+x+')'],[api.fmt(D.disc?ge:gt,4),'P(X '+(D.disc?'≥':'&gt;')+' '+x+')']);
  if(D.disc) cells.push([api.fmt(D.pmf(Math.round(x)),4),'P(X = '+Math.round(x)+')']);
  if(!isNaN(x2)){ var lo=Math.min(x,x2), hi=Math.max(x,x2), pb=D.disc?D.cdf(hi)-D.cdf(Math.ceil(lo)-1):D.cdf(hi)-D.cdf(lo); cells.push([api.fmt(pb,4),'P('+lo+' ≤ X ≤ '+hi+')']); }
  if(d==='Normal') f.push(['','x = '+x+' is z = '+((x-a)/b).toFixed(3)+' standard deviations '+(x>=a?'above':'below')+' the mean.']);
  if(D.disc&&Math.round(x)!==x) f.push(['warn','This distribution only takes whole numbers; x is treated as '+Math.floor(x)+' for "≤".']);
 } else f.push(['','Enter a value of interest to see probabilities. The shaded area is the probability.']);
 var use={Normal:'Continuous measurements that cluster around a center: dimensions, weights, times from a stable process.',Binomial:'The number of defective items in a sample of n, when each item is defective with the same probability p.',Poisson:'The number of defects or events in a fixed amount of product, time or area, when they occur independently at an average rate.',Uniform:'Every value between two limits equally likely. Rare in processes; common as a "we know nothing more" assumption.',Exponential:'Time between independent random events, such as time between failures at a constant failure rate.'}[d];
 f.push(['','<b>Used for:</b> '+use]);
 ST.innerHTML='<div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 O.innerHTML=api.flags(f);
},
example:{f:{d:'Normal',a:'10.016',b:'0.0286',x:'10.05',x2:''}}
}
