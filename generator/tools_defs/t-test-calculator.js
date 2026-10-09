{
slug:'t-test-calculator',
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
 function tsf(t,v){ var p=0.5*t2(t,v); return t>0?p:1-p; }
 function fsf(F,a,b){ return F<=0?1:ib(b/2,a/2,b/(b+a*F)); }
 function csf(x,k){ return gq(k/2,x/2); }
 function nsf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?q:1-q; }
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function tinv(p,v){ return inv(function(t){return tcdf(t,v);},p,-1e4,1e4); }
 function zinv(p){ return inv(function(z){return 1-nsf(z);},p,-40,40); }
 function finv(p,a,b){ return inv(function(F){return 1-fsf(F,a,b);},p,0,1e6); }
 function pfmt(p){ return !isFinite(p)?'—':p<0.0001?'&lt; 0.0001':p.toFixed(4); }
 return {gln:gln,ib:ib,gq:gq,t2:t2,tcdf:tcdf,tsf:tsf,fsf:fsf,csf:csf,nsf:nsf,tinv:tinv,zinv:zinv,finv:finv,pfmt:pfmt};
})(),
sections:[
 {type:'fields',title:'The question',cols:3,hint:'Pick the test, state the null hypothesis value and the direction of the alternative before you look at the data.',fields:[
  {id:'test',label:'Test',type:'select',opts:['One-sample t','Two-sample t, unequal variances (Welch)','Two-sample t, pooled (equal variances)','Paired t']},
  {id:'alt',label:'Alternative hypothesis Hₐ',type:'select',opts:['Not equal (two-sided)','Less than','Greater than']},
  {id:'a',label:'Significance level α',type:'number',min:0.001,max:0.5,ph:'0.05'},
  {id:'h0',label:'Null value: μ₀ or the difference μ₁ − μ₂',type:'number',ph:'0'},
  {id:'n1',label:'Sample 1 is',ph:'e.g. Line 1'},{id:'n2',label:'Sample 2 is',ph:'e.g. Line 2'},
  {id:'u',label:'What was measured, with units',ph:'e.g. Fill weight, g',wide:true},
  {id:'d',label:'Data, one value per cell (a one-sample test uses column 1 only; a paired test needs both values on the same row)',type:'datagrid',cols:[{label:'Sample 1'},{label:'Sample 2'}],rows:10,minRows:4}]},
 {type:'custom',id:'res',title:'Test result',html:'<div class="tt-st"></div><div class="tgw"><table class="mv tt-tb"></table></div>'},
 {type:'custom',id:'plot',title:'Dot plot with the confidence interval for each mean',html:'<div class="svgw tt-svg"></div>'},
 {type:'custom',id:'read',title:'What the result says',html:'<div class="out tt-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc;
 var test=S.f.test||'One-sample t', alt=S.f.alt||'Not equal (two-sided)', a=api.num(S.f.a), h0=api.num(S.f.h0);
 var aOk=isFinite(a)&&a>0&&a<0.5; if(!aOk) a=0.05; if(!isFinite(h0)) h0=0;
 var one=test==='One-sample t', pair=test==='Paired t', welch=/Welch/.test(test), two=!one&&!pair;
 var n1=S.f.n1||'Sample 1', n2=S.f.n2||'Sample 2', x=[], y=[], dd=[], bad=0, half=0;
 (S.f.d||'').split('\n').forEach(function(l){ if(!l.replace(/\s/g,'')) return; var t=/\t/.test(l)?l.split('\t'):l.trim().split(/[\s,;]+/);
  var u=(t[0]||'').trim(), v=(t[1]||'').trim(), p=u===''?NaN:Number(u), q=v===''?NaN:Number(v);
  if((u!==''&&!isFinite(p))||(v!==''&&!isFinite(q))) { bad++; }
  if(isFinite(p)) x.push(p); if(isFinite(q)) y.push(q);
  if(isFinite(p)&&isFinite(q)) dd.push(p-q); else if(isFinite(p)||isFinite(q)) half++; });
 function ds(v){ var n=v.length,m=0,s=0; v.forEach(function(z){m+=z;}); m/=n; v.forEach(function(z){s+=(z-m)*(z-m);}); return {n:n,m:m,s:n>1?Math.sqrt(s/(n-1)):NaN}; }
 var StE=root.querySelector('.tt-st'), TB=root.querySelector('.tt-tb'), SV=root.querySelector('.tt-svg'), O=root.querySelector('.tt-out'), f=[];
 var need=one?(x.length<2?'Enter at least two values in column 1.':''):pair?(dd.length<2?'A paired test needs at least two rows with both values filled in.':''):(x.length<2||y.length<2?'Enter at least two values in each column.':'');
 if(need){ StE.innerHTML=''; TB.innerHTML=''; SV.innerHTML=''; O.innerHTML=api.flags(bad?[['warn',bad+' row'+(bad>1?'s':'')+' had a value that is not a number.']]:[],need); return; }
 var A=ds(x), B=ds(y), D=ds(dd), est, se, df, rows=[];
 if(one){ est=A.m; se=A.s/Math.sqrt(A.n); df=A.n-1; rows=[[n1,A]]; }
 else if(pair){ est=D.m; se=D.s/Math.sqrt(D.n); df=D.n-1; rows=[[n1,ds(pairX())],[n2,ds(pairY())],['Difference ('+n1+' − '+n2+')',D]]; }
 else { est=A.m-B.m; rows=[[n1,A],[n2,B]];
  if(welch){ var v1=A.s*A.s/A.n, v2=B.s*B.s/B.n; se=Math.sqrt(v1+v2); df=(v1+v2)*(v1+v2)/(v1*v1/(A.n-1)+v2*v2/(B.n-1)); }
  else { var sp=Math.sqrt(((A.n-1)*A.s*A.s+(B.n-1)*B.s*B.s)/(A.n+B.n-2)); se=sp*Math.sqrt(1/A.n+1/B.n); df=A.n+B.n-2; } }
 function pairX(){ var r=[]; (S.f.d||'').split('\n').forEach(function(l){ var t=/\t/.test(l)?l.split('\t'):l.trim().split(/[\s,;]+/), p=Number((t[0]||'').trim()), q=Number((t[1]||'').trim()); if((t[0]||'').trim()!==''&&(t[1]||'').trim()!==''&&isFinite(p)&&isFinite(q)) r.push(p); }); return r; }
 function pairY(){ var r=[]; (S.f.d||'').split('\n').forEach(function(l){ var t=/\t/.test(l)?l.split('\t'):l.trim().split(/[\s,;]+/), p=Number((t[0]||'').trim()), q=Number((t[1]||'').trim()); if((t[0]||'').trim()!==''&&(t[1]||'').trim()!==''&&isFinite(p)&&isFinite(q)) r.push(q); }); return r; }
 if(!(se>0)){ StE.innerHTML=''; TB.innerHTML=''; SV.innerHTML=''; O.innerHTML=api.flags([['warn','The data have no variation (standard deviation 0), so a t statistic cannot be computed.']]); return; }
 var t=(est-h0)/se, p=alt==='Less than'?ST.tcdf(t,df):alt==='Greater than'?ST.tsf(t,df):ST.t2(t,df), conf=(1-a)*100, lo=-Infinity, hi=Infinity, tc;
 if(alt==='Not equal (two-sided)'){ tc=ST.tinv(1-a/2,df); lo=est-tc*se; hi=est+tc*se; } else { tc=ST.tinv(1-a,df); if(alt==='Less than') hi=est+tc*se; else lo=est-tc*se; }
 var rej=p<a, sym=alt==='Less than'?'&lt;':alt==='Greater than'?'&gt;':'≠', par=one?'μ':pair?'μ<sub>d</sub>':'μ₁ − μ₂', dp=Math.max(2,Math.min(5,(String(x[0]).split('.')[1]||'').length+2));
 var ci=isFinite(lo)&&isFinite(hi)?F(lo,dp)+' to '+F(hi,dp):isFinite(lo)?'≥ '+F(lo,dp):'≤ '+F(hi,dp);
 StE.innerHTML='<p class="th" style="margin:0 0 4px">H₀: '+par+' = '+F(h0,dp)+' &nbsp; Hₐ: '+par+' '+sym+' '+F(h0,dp)+' &nbsp; α = '+a+'</p><div class="stat">'+
  [[F(est,dp),one?'Sample mean x̄':pair?'Mean difference d̄':'Difference x̄₁ − x̄₂'],[F(se,dp+1),'Standard error'],[t.toFixed(3),'t statistic'],[welch?df.toFixed(2):df,'Degrees of freedom'],[ST.pfmt(p),'p value'],[ci,conf.toFixed(0)+'% confidence '+(isFinite(lo)&&isFinite(hi)?'interval':'bound')],[(alt==='Not equal (two-sided)'?'±':'')+tc.toFixed(3),'Critical t'],[rej?'Reject H₀':'Fail to reject H₀','Decision at α = '+a]].map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 TB.innerHTML='<thead><tr><th>Sample</th><th>n</th><th>Mean</th><th>Std dev</th><th>SE mean</th></tr></thead><tbody>'+rows.map(function(r){ return '<tr><td class="mo">'+E(r[0])+'</td><td>'+r[1].n+'</td><td>'+F(r[1].m,dp)+'</td><td>'+F(r[1].s,dp)+'</td><td>'+F(r[1].s/Math.sqrt(r[1].n),dp+1)+'</td></tr>'; }).join('')+'</tbody>';
 /* dot plot */
 var strips=one?[[n1,x]]:pair?[['Difference ('+n1+' − '+n2+')',dd]]:[[n1,x],[n2,y]], all=[], W=800, L=190, R=24, rh=74, H=strips.length*rh+46;
 strips.forEach(function(s){ all=all.concat(s[1]); var q=ds(s[1]), tq=ST.tinv(1-a/2,q.n-1)*q.s/Math.sqrt(q.n); s.push(q,tq); all.push(q.m-tq,q.m+tq); });
 if(one||pair) all.push(h0);
 var mn=Math.min.apply(null,all), mx=Math.max.apply(null,all), pd=(mx-mn)*0.06||1; mn-=pd; mx+=pd;
 var X=function(v){return L+(v-mn)/(mx-mn)*(W-L-R);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Dot plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
 for(var i=0;i<=5;i++){ var v=mn+(mx-mn)*i/5; g+='<line x1="'+X(v)+'" y1="8" x2="'+X(v)+'" y2="'+(H-34)+'" stroke="#EDEFEA"/><text class="ax" x="'+X(v)+'" y="'+(H-16)+'" text-anchor="middle">'+F(v,dp-1)+'</text>'; }
 if(one||pair) g+='<line x1="'+X(h0)+'" y1="8" x2="'+X(h0)+'" y2="'+(H-34)+'" stroke="#C0392B" stroke-dasharray="5 4" stroke-width="1.6"/><text x="'+(X(h0)+4)+'" y="20" style="fill:#C0392B;font-size:12px">H₀ '+F(h0,dp)+'</text>';
 strips.forEach(function(s,j){ var cy=j*rh+40, seen={}, nm=s[0].length>26?s[0].slice(0,25)+'…':s[0];
  g+='<text x="'+(L-12)+'" y="'+(cy+5)+'" text-anchor="end">'+E(nm)+'</text>';
  s[1].slice().sort(function(p,q){return p-q;}).forEach(function(v){ var k=Math.round(X(v)/7); seen[k]=(seen[k]||0)+1; g+='<circle cx="'+X(v)+'" cy="'+(cy-6-(seen[k]-1)*7)+'" r="3.6" fill="#0F3E68" fill-opacity=".75"/>'; });
  g+='<line x1="'+X(s[2].m-s[3])+'" y1="'+(cy+14)+'" x2="'+X(s[2].m+s[3])+'" y2="'+(cy+14)+'" stroke="#9C7C1F" stroke-width="2.5"/><line x1="'+X(s[2].m-s[3])+'" y1="'+(cy+9)+'" x2="'+X(s[2].m-s[3])+'" y2="'+(cy+19)+'" stroke="#9C7C1F" stroke-width="2"/><line x1="'+X(s[2].m+s[3])+'" y1="'+(cy+9)+'" x2="'+X(s[2].m+s[3])+'" y2="'+(cy+19)+'" stroke="#9C7C1F" stroke-width="2"/><rect x="'+(X(s[2].m)-4)+'" y="'+(cy+10)+'" width="8" height="8" fill="#D8B147" stroke="#9C7C1F"/>'; });
 g+='<text class="ax" x="'+((W+L)/2)+'" y="'+(H-2)+'" text-anchor="middle">'+E(S.f.u||'Value')+' · square = mean, bar = '+(100-a*100).toFixed(0)+'% CI for the mean</text>';
 SV.innerHTML=g+'</svg>';
 /* flags */
 f.push([rej?'ok':'','<b>'+(rej?'Reject H₀':'Fail to reject H₀')+'</b>: '+(p<0.0001?'p &lt; 0.0001':'p = '+ST.pfmt(p))+(p<0.0001?', below ':(rej?' &lt; ':' ≥ '))+'α = '+a+'. '+(rej?'The data are evidence that '+par+' '+sym+' '+F(h0,dp)+'.':'The data are not strong enough evidence that '+par+' '+sym+' '+F(h0,dp)+'. That is not proof that H₀ is true.')]);
 if(alt==='Not equal (two-sided)') f.push(['','The '+conf.toFixed(0)+'% confidence interval for '+par+' is '+ci+'. It '+(lo<=h0&&h0<=hi?'contains':'does not contain')+' '+F(h0,dp)+', which agrees with the test decision.']);
 if(two){ var Fv=A.s*A.s/(B.s*B.s), pf=2*Math.min(ST.fsf(Fv,A.n-1,B.n-1),1-ST.fsf(Fv,A.n-1,B.n-1));
  f.push([pf<a&&!welch?'warn':'','F test for equal variances: F = s₁²/s₂² = '+Fv.toFixed(3)+' with ('+(A.n-1)+', '+(B.n-1)+') df, p = '+ST.pfmt(pf)+'. '+(pf<a?(welch?'The variances differ, so the Welch test is the right choice.':'The variances differ; the pooled test assumes they are equal. Switch to the Welch test.'):(welch?'No evidence the variances differ; the pooled test would give a similar answer.':'No evidence the variances differ, so pooling is reasonable.'))]); }
 if(pair&&half) f.push(['warn',half+' row'+(half>1?'s have':' has')+' only one value and '+(half>1?'were':'was')+' left out of the paired test. Each row must be the same unit measured twice.']);
 if(one&&y.length) f.push(['warn','A one-sample test uses column 1 only; the '+y.length+' values in column 2 are ignored.']);
 if(bad) f.push(['warn',bad+' row'+(bad>1?'s':'')+' had a value that is not a number; it was skipped.']);
 var nmin=one?A.n:pair?D.n:Math.min(A.n,B.n);
 if(nmin<30) f.push(['','With '+(two?'samples of '+A.n+' and '+B.n:nmin+' '+(pair?'pairs':'values'))+', the t test assumes the '+(pair?'differences':'data')+' come from a roughly normal population. Check a normal probability plot or histogram for strong skew or outliers.']);
 f.push(['','Statistical significance is not practical significance. Compare the estimate, '+F(est,dp)+', with the change that would matter to the customer or the process.']);
 O.innerHTML=api.flags(f);
},
example:{f:{test:'Two-sample t, unequal variances (Welch)',alt:'Not equal (two-sided)',a:'0.05',h0:'0',n1:'Filler 1',n2:'Filler 2',u:'Net fill weight, g (label 340 g)',
 d:'342.6\t340.1\n341.8\t343.9\n343.1\t338.7\n342.2\t341.5\n340.9\t339.2\n343.5\t342.8\n341.4\t337.9\n342.9\t340.6\n344.0\t341.9\n341.7\t339.6\n342.4\n343.0'}}
}
