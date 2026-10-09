{
slug:'correlation-regression',
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
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function tinv(p,v){ return inv(function(t){return tcdf(t,v);},p,-1e4,1e4); }
 function zinv(p){ return inv(ncdf,p,-40,40); }
 return {gln:gln,ib:ib,gq:gq,tcdf:tcdf,ncdf:ncdf,tinv:tinv,zinv:zinv};
})(),
sections:[
 {type:'fields',title:'Your paired data',cols:3,hint:'One pair per row: <b>x</b> in the first column, <b>y</b> in the second. Two columns copied from a spreadsheet paste straight in.',fields:[
  {id:'xl',label:'x is',ph:'e.g. Installation force, N'},{id:'yl',label:'y is',ph:'e.g. Leak rate, mbar·l/s'},{id:'px',label:'Predict y at x =',type:'number'},
  {id:'d',label:'Data, one pair per row',type:'datagrid',cols:[{label:'X'},{label:'Y'}],rows:8,minRows:4}]},
 {type:'custom',id:'p',title:'Scatter diagram and fitted line',html:'<div class="svgw cr-svg"></div><div class="cr-st"></div><div class="out cr-out"></div>'},
 {type:'fields',title:'Intervals: settings',cols:2,fields:[
  {id:'cl',label:'Confidence level, %',type:'number',min:50,max:99.99,ph:'95'},
  {id:'bd',label:'On the scatter diagram',type:'select',opts:['Confidence and prediction bands','Fitted line only']}]},
 {type:'custom',id:'iv',title:'Confidence intervals for r, the slope and y at a given x',html:'<div class="cr-ist"></div><div class="out cr-iout"></div>'},
 {type:'custom',id:'res',title:'Residual plots',hint:'A residual is what the line misses: y − ŷ. If the straight-line model is right, the residuals scatter evenly around zero with no pattern and fall close to a straight line on the normal probability plot.',html:'<div class="cr-rplots"><div class="svgw cr-rf"></div><div class="svgw cr-np"></div></div><div class="tgw"><table class="tg cr-rtb"></table></div><div class="out cr-rout"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, P=[], bad=0;
 (S.f.d||'').split('\n').forEach(function(l){ l=l.trim(); if(!l) return; var t=l.split(/[\s,;\t]+/).map(Number); if(t.length>=2&&isFinite(t[0])&&isFinite(t[1])) P.push([t[0],t[1]]); else bad++; });
 var SV=root.querySelector('.cr-svg'), ST=root.querySelector('.cr-st'), O=root.querySelector('.cr-out');
 var IV=root.querySelector('.cr-ist'), IO=root.querySelector('.cr-iout'), RF=root.querySelector('.cr-rf'), NP=root.querySelector('.cr-np'), RT=root.querySelector('.cr-rtb'), RO=root.querySelector('.cr-rout');
 IV.innerHTML=''; IO.innerHTML=''; RF.innerHTML=''; NP.innerHTML=''; RT.innerHTML=''; RO.innerHTML='';
 if(P.length<3){ SV.innerHTML=''; ST.innerHTML=''; O.innerHTML=api.flags(bad?[['warn',bad+' line'+(bad>1?'s':'')+' could not be read as two numbers.']]:[],'Enter at least three x y pairs.'); IO.innerHTML=api.flags([],'Enter at least three x y pairs.'); return; }
 var k=P.length, mx=0,my=0; P.forEach(function(p){mx+=p[0];my+=p[1];}); mx/=k; my/=k;
 var sxx=0,syy=0,sxy=0; P.forEach(function(p){sxx+=(p[0]-mx)*(p[0]-mx);syy+=(p[1]-my)*(p[1]-my);sxy+=(p[0]-mx)*(p[1]-my);});
 if(sxx===0||syy===0){ O.innerHTML=api.flags([['warn','All the '+(sxx===0?'x':'y')+' values are the same; there is nothing to correlate.']]); SV.innerHTML=''; ST.innerHTML=''; return; }
 var r=sxy/Math.sqrt(sxx*syy), b1=sxy/sxx, b0=my-b1*mx, sse=syy-b1*sxy, se=k>2?Math.sqrt(Math.max(0,sse)/(k-2)):NaN;
 var t=Math.abs(r)<1?r*Math.sqrt((k-2)/(1-r*r)):Infinity;
 var tq=[0,12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045,2.042], df=k-2, tc=df<=30?tq[df]:df<=40?2.021:df<=60?2.000:df<=120?1.980:1.960, sig=Math.abs(t)>tc;
 var xs=P.map(function(p){return p[0];}), ys=P.map(function(p){return p[1];}), x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
 var padx=(x1-x0)*0.06||1, pady=(y1-y0)*0.08||1; x0-=padx; x1+=padx; y0-=pady; y1+=pady;
 var W=800,H=380,L=60,B=46,T=14, X=function(v){return L+(v-x0)/(x1-x0)*(W-L-14);}, Y=function(v){return H-B-(v-y0)/(y1-y0)*(H-B-T);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Scatter diagram"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(var i=0;i<=5;i++){ var xv=x0+(x1-x0)*i/5, yv=y0+(y1-y0)*i/5; g+='<text x="'+X(xv)+'" y="'+(H-B+16)+'" text-anchor="'+(i===0?'start':i===5?'end':'middle')+'">'+api.fmt(xv,2)+'</text>'+(i?'<text x="'+(L-6)+'" y="'+(Y(yv)+4)+'" text-anchor="end">'+api.fmt(yv,2)+'</text>':''); }
 var BAND=window.TOOL.band(S,api,P,k,mx,sxx,b0,b1,se,x0,x1,X,Y,L,T,W,H,B); g+=BAND;
 g+='<line x1="'+X(x0)+'" y1="'+Y(b0+b1*x0)+'" x2="'+X(x1)+'" y2="'+Y(b0+b1*x1)+'" stroke="#D8B147" stroke-width="2.5"/>';
 P.forEach(function(p){ g+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="4.5" fill="#0F3E68" fill-opacity=".8"/>'; });
 g+='<text x="'+((W+L)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+api.esc((S.f.xl||'x').toUpperCase())+'</text><text transform="translate(14 '+((H-B)/2)+') rotate(-90)" text-anchor="middle">'+api.esc((S.f.yl||'y').toUpperCase())+'</text>';
 SV.innerHTML=g+'</svg>';
 var cells=[[k,'Pairs (n)'],[r.toFixed(4),'Correlation r'],[(r*r).toFixed(4),'r² (share of variation in y explained)'],[api.fmt(b1,5),'Slope b₁'],[api.fmt(b0,5),'Intercept b₀'],[api.fmt(se,5),'Standard error of the fit']];
 var px=n(S.f.px); if(!isNaN(px)) cells.push([api.fmt(b0+b1*px,4),'Predicted y at x = '+px]);
 ST.innerHTML='<p class="th" style="margin:8px 0 0">Fitted line: <b>y = '+api.fmt(b0,5)+' '+(b1<0?'−':'+')+' '+api.fmt(Math.abs(b1),5)+' x</b></p><div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 var ar=Math.abs(r), str=ar>=0.8?'strong':ar>=0.5?'moderate':ar>=0.3?'weak':'very weak or no';
 var f=[[sig?'ok':'warn','r = '+r.toFixed(3)+': a '+str+' '+(r>0?'positive':'negative')+' linear relationship. '+(sig?'It is statistically significant at 95% (|t| = '+Math.abs(t).toFixed(2)+' &gt; '+tc.toFixed(3)+').':'It is <b>not</b> statistically significant at 95% (|t| = '+(isFinite(t)?Math.abs(t).toFixed(2):'—')+' ≤ '+tc.toFixed(3)+'); with '+k+' pairs, a correlation this size could be chance.')]];
 f.push(['','Correlation is not causation. A strong r says x and y move together; it does not say changing x will change y. Test that with a controlled change.']);
 if(!isNaN(px)&&(px<Math.min.apply(null,xs)||px>Math.max.apply(null,xs))) f.push(['warn','x = '+px+' is outside the range of the data ('+Math.min.apply(null,xs)+' to '+Math.max.apply(null,xs)+'). Predictions outside the range assume the line carries on straight, which it may not.']);
 if(bad) f.push(['warn',bad+' line'+(bad>1?'s':'')+' could not be read as two numbers and were skipped.']);
 if(k<10) f.push(['','Only '+k+' pairs. Small samples can show strong correlations by chance; collect more before acting.']);
 O.innerHTML=api.flags(f);
 window.TOOL.more(root,api,{P:P,k:k,mx:mx,my:my,sxx:sxx,syy:syy,sxy:sxy,r:r,b0:b0,b1:b1,se:se,px:px,xs:xs});
},
band:function(S,api,P,k,mx,sxx,b0,b1,se,x0,x1,X,Y,L,T,W,H,B){
 if(S.f.bd==='Fitted line only'||!(k>2)||!(se>0)) return '';
 var ST=window.TOOL.ST, cl=api.num(S.f.cl); if(!(cl>=50&&cl<100)) cl=95;
 var tc=ST.tinv(1-(1-cl/100)/2,k-2), up=[], dn=[], cu=[], cd=[];
 for(var i=0;i<=60;i++){ var x=x0+(x1-x0)*i/60, yh=b0+b1*x, q=1/k+(x-mx)*(x-mx)/sxx, hc=tc*se*Math.sqrt(q), hp=tc*se*Math.sqrt(1+q);
  up.push(X(x)+' '+Y(yh+hp)); dn.unshift(X(x)+' '+Y(yh-hp)); cu.push(X(x)+' '+Y(yh+hc)); cd.unshift(X(x)+' '+Y(yh-hc)); }
 var cid='crclip'+Math.round(Math.random()*1e6);
 return '<defs><clipPath id="'+cid+'"><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'"/></clipPath></defs><g clip-path="url(#'+cid+')"><path d="M'+up.join(' L')+' L'+dn.join(' L')+'Z" fill="#D8B147" fill-opacity=".13" stroke="#D8B147" stroke-opacity=".7" stroke-dasharray="5 4"/><path d="M'+cu.join(' L')+' L'+cd.join(' L')+'Z" fill="#0F3E68" fill-opacity=".10" stroke="#0F3E68" stroke-opacity=".45"/></g>'+
  '<rect x="'+(L+10)+'" y="'+(T+8)+'" width="14" height="10" fill="#0F3E68" fill-opacity=".18" stroke="#0F3E68" stroke-opacity=".45"/><text x="'+(L+30)+'" y="'+(T+17)+'">'+(Math.round(cl*100)/100)+'% confidence band for the mean y</text><rect x="'+(L+10)+'" y="'+(T+24)+'" width="14" height="10" fill="#D8B147" fill-opacity=".25" stroke="#D8B147" stroke-dasharray="3 2"/><text x="'+(L+30)+'" y="'+(T+33)+'">'+(Math.round(cl*100)/100)+'% prediction band for one new y</text>';
},
more:function(root,api,R){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, f=[], k=R.P.length, df=k-2;
 var IV=root.querySelector('.cr-ist'), IO=root.querySelector('.cr-iout'), RF=root.querySelector('.cr-rf'), NP=root.querySelector('.cr-np'), RT=root.querySelector('.cr-rtb'), RO=root.querySelector('.cr-rout');
 var cl=api.num(S.f.cl), clOk=isFinite(cl)&&cl>=50&&cl<100; if(S.f.cl&&!clOk) f.push(['warn','The confidence level must be at least 50% and below 100%; 95% is used.']); if(!clOk) cl=95;
 var a=1-cl/100, clS=(Math.round(cl*100)/100)+'%', tc=ST.tinv(1-a/2,df), zc=ST.zinv(1-a/2), cells=[], dpy=4;
 /* r: Fisher z */
 if(k>=4&&Math.abs(R.r)<1){ var zr=0.5*Math.log((1+R.r)/(1-R.r)), sz=1/Math.sqrt(k-3), rl=Math.tanh(zr-zc*sz), rh=Math.tanh(zr+zc*sz);
  cells.push([rl.toFixed(4)+' to '+rh.toFixed(4),clS+' interval for ρ (Fisher z)']);
  f.push([rl>0||rh<0?'ok':'',clS+' confidence interval for the population correlation ρ: <b>'+rl.toFixed(3)+' to '+rh.toFixed(3)+'</b>. Fisher’s z = ½ ln((1 + r)/(1 − r)) = '+zr.toFixed(4)+' is close to normal with standard error 1/√(n − 3) = '+sz.toFixed(4)+'; the limits are z ± '+zc.toFixed(3)+' × '+sz.toFixed(4)+', turned back into r. '+(rl>0||rh<0?'The interval excludes 0.':'The interval includes 0, so the data are consistent with no linear relationship.')+' It is not symmetric around r = '+R.r.toFixed(3)+'.']); }
 else if(k<4) f.push(['warn','The interval for ρ needs at least four pairs.']);
 else f.push(['','r is exactly ±1, so there is no interval for ρ to compute.']);
 if(df>=1&&R.se>=0){
  var seb=R.se/Math.sqrt(R.sxx), tb=seb>0?R.b1/seb:Infinity, pb=seb>0?2*(1-ST.tcdf(Math.abs(tb),df)):0;
  cells.push([M(R.b1-tc*seb)+' to '+M(R.b1+tc*seb),clS+' interval for the slope β₁'],[pb<0.0001?'&lt; 0.0001':pb.toFixed(4),'p value, slope = 0 ('+df+' df)']);
  f.push(['','Slope: b₁ = '+F(R.b1,5)+' with standard error s/√Sxx = '+F(seb,5)+'. The '+clS+' interval is b₁ ± t × SE with t = '+tc.toFixed(3)+' ('+df+' df). The test of slope = 0 (t = '+(isFinite(tb)?tb.toFixed(3):'∞')+', p '+(pb<0.0001?'&lt; 0.0001':'= '+pb.toFixed(4))+') is the same test as the one for r.']);
 }
 if(isFinite(R.px)&&df>=1){
  var yh=R.b0+R.b1*R.px, q=1/k+(R.px-R.mx)*(R.px-R.mx)/R.sxx, hc=tc*R.se*Math.sqrt(q), hp=tc*R.se*Math.sqrt(1+q);
  cells.push([F(yh-hc,dpy)+' to '+F(yh+hc,dpy),clS+' CI for the mean y at x = '+R.px],[F(yh-hp,dpy)+' to '+F(yh+hp,dpy),clS+' PI for one new y at x = '+R.px]);
  f.push(['ok','At x = '+R.px+': ŷ = '+F(yh,dpy)+'. The <b>confidence interval</b> for the <i>average</i> y of all items at this x is '+F(yh-hc,dpy)+' to '+F(yh+hc,dpy)+' (± t·s·√(1/n + (x − x̄)²/Sxx)). The <b>prediction interval</b> for <i>one</i> new item is '+F(yh-hp,dpy)+' to '+F(yh+hp,dpy)+' (± t·s·√(1 + 1/n + (x − x̄)²/Sxx)): wider, because a single item also carries its own scatter around the line.']);
  if(Math.abs(R.px-R.mx)>0) f.push(['','Both intervals are narrowest at x̄ = '+F(R.mx,4)+' and widen as x moves away from it, which is why the bands on the scatter diagram flare at the ends.']);
 } else f.push(['','Enter a value in "Predict y at x =" for the confidence and prediction intervals for y at that x.']);
 IV.innerHTML='<div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 IO.innerHTML=api.flags(f);
 function M(v){ return (v<0?'−':'')+F(Math.abs(v),5); }
 /* residuals */
 var rs=R.P.map(function(p,i){ var fit=R.b0+R.b1*p[0], e=p[1]-fit, h=1/k+(p[0]-R.mx)*(p[0]-R.mx)/R.sxx, sr=R.se>0&&h<1?e/(R.se*Math.sqrt(1-h)):NaN; return {i:i+1,x:p[0],y:p[1],fit:fit,e:e,h:h,sr:sr}; });
 var ord=rs.slice().sort(function(u,v){return u.e-v.e;}); ord.forEach(function(o,j){ o.ns=ST.zinv((j+1-0.375)/(k+0.25)); });
 var W=640,H=300,L=58,B=44,T=30, g;
 function axes(xa,xb,ya,yb,xl,yl,title){ var Xf=function(v){return L+(v-xa)/(xb-xa)*(W-L-14);}, Yf=function(v){return H-B-(v-ya)/(yb-ya)*(H-B-T);};
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+title+'"><style>text{font:13px \'IBM Plex Mono\',monospace;fill:#7C8B99}.tt{font:600 16px Archivo,sans-serif;fill:#16273A}</style><text class="tt" x="'+L+'" y="18">'+title+'</text><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'" fill="#fff" stroke="#DDE1E4"/>';
  for(var i=0;i<=4;i++){ var xv=xa+(xb-xa)*i/4, yv=ya+(yb-ya)*i/4; s+='<text x="'+Xf(xv)+'" y="'+(H-B+15)+'" text-anchor="'+(i===0?'start':i===4?'end':'middle')+'">'+api.fmt(xv,2)+'</text><text x="'+(L-5)+'" y="'+(Yf(yv)+4)+'" text-anchor="end">'+api.fmt(yv,2)+'</text>'; }
  s+='<text x="'+((W+L)/2)+'" y="'+(H-6)+'" text-anchor="middle">'+xl+'</text><text transform="translate(12 '+((H-B+T)/2)+') rotate(-90)" text-anchor="middle">'+yl+'</text>';
  return {s:s,X:Xf,Y:Yf}; }
 var em=Math.max.apply(null,rs.map(function(o){return Math.abs(o.e);}))*1.15||1, fa=Math.min.apply(null,rs.map(function(o){return o.fit;})), fb=Math.max.apply(null,rs.map(function(o){return o.fit;})), fp=(fb-fa)*0.06||1;
 var A=axes(fa-fp,fb+fp,-em,em,'FITTED VALUE ŷ','RESIDUAL','Residuals versus fitted values');
 g=A.s+'<line x1="'+L+'" x2="'+(W-14)+'" y1="'+A.Y(0)+'" y2="'+A.Y(0)+'" stroke="#D8B147" stroke-width="2"/>';
 if(R.se>0) [-2,2].forEach(function(m2){ var yv=m2*R.se; if(Math.abs(yv)<em) g+='<line x1="'+L+'" x2="'+(W-14)+'" y1="'+A.Y(yv)+'" y2="'+A.Y(yv)+'" stroke="#C0392B" stroke-dasharray="4 4" stroke-opacity=".6"/>'; });
 rs.forEach(function(o){ g+='<circle cx="'+A.X(o.fit)+'" cy="'+A.Y(o.e)+'" r="4.5" fill="'+(Math.abs(o.sr)>2?'#C0392B':'#0F3E68')+'" fill-opacity=".85"/>'; });
 RF.innerHTML=g+'</svg>';
 var nz=Math.max(Math.abs(ord[0].ns),Math.abs(ord[k-1].ns))*1.12;
 A=axes(-em,em,-nz,nz,'RESIDUAL','NORMAL SCORE','Normal probability plot of residuals');
 g=A.s; if(R.se>0) g+='<line x1="'+A.X(-em)+'" y1="'+A.Y(-em/R.se)+'" x2="'+A.X(em)+'" y2="'+A.Y(em/R.se)+'" stroke="#D8B147" stroke-width="2"/>';
 ord.forEach(function(o){ g+='<circle cx="'+A.X(o.e)+'" cy="'+A.Y(o.ns)+'" r="4.5" fill="#0F3E68" fill-opacity=".85"/>'; });
 NP.innerHTML=g.replace('<rect','<defs><clipPath id="crnp"><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'"/></clipPath></defs><rect').replace('stroke="#D8B147" stroke-width="2"/>','stroke="#D8B147" stroke-width="2" clip-path="url(#crnp)"/>')+'</svg>';
 RT.innerHTML='<thead><tr><th>#</th><th>x</th><th>y</th><th>Fitted ŷ</th><th>Residual</th><th>Standardized</th><th>Leverage h</th><th>Normal score</th></tr></thead><tbody>'+rs.map(function(o){ return '<tr'+(Math.abs(o.sr)>2?' class="hi-row"':'')+'><td>'+o.i+'</td><td>'+o.x+'</td><td>'+o.y+'</td><td>'+F(o.fit,4)+'</td><td>'+M4(o.e)+'</td><td>'+(isFinite(o.sr)?M2(o.sr):'—')+'</td><td>'+F(o.h,3)+'</td><td>'+M2(o.ns)+'</td></tr>'; }).join('')+'</tbody>';
 function M4(v){ return (v<0?'−':'')+F(Math.abs(v),4); } function M2(v){ return (v<0?'−':'')+F(Math.abs(v),3); }
 var rf=[], big=rs.filter(function(o){return Math.abs(o.sr)>2;}), huge=rs.filter(function(o){return Math.abs(o.sr)>3;}), lev=rs.filter(function(o){return o.h>4/k;});
 if(huge.length) rf.push(['warn','Point'+(huge.length>1?'s ':' ')+huge.map(function(o){return '#'+o.i;}).join(', ')+' '+(huge.length>1?'have':'has a')+' standardized residual beyond ±3: a likely outlier. Check it for a recording or measurement error before trusting the line.']);
 else if(big.length) rf.push(['','Point'+(big.length>1?'s ':' ')+big.map(function(o){return '#'+o.i+' ('+M2(o.sr)+')';}).join(', ')+' '+(big.length>1?'have':'has a')+' standardized residual beyond ±2 (shaded red). About 1 point in 20 does this by chance; look at it, but one is not alarming.']);
 else rf.push(['ok','No standardized residual is beyond ±2.']);
 if(lev.length) rf.push(['','Point'+(lev.length>1?'s ':' ')+lev.map(function(o){return '#'+o.i;}).join(', ')+' '+(lev.length>1?'have':'has')+' high leverage (h &gt; 4/n = '+F(4/k,3)+'): '+(lev.length>1?'their x values are':'its x value is')+' far from the others, so '+(lev.length>1?'they pull':'it pulls')+' the line harder. Check the fit with and without '+(lev.length>1?'them':'it')+'.']);
 rf.push(['','How to read them. <b>Residuals versus fitted</b>: a random band around zero is good; a curve means a straight line is the wrong model; a funnel (spread growing with ŷ) means the variation is not constant and the intervals above are not trustworthy. <b>Normal probability plot</b>: points near the line mean the residuals are close to normal, which the t-based intervals assume; an S-shape or bent ends mean heavy or skewed tails. Normal scores use Blom’s positions (i − 0.375)/(n + 0.25).']);
 if(k<10) rf.push(['','With only '+k+' points, residual plots show little; patterns need more data to stand out.']);
 RO.innerHTML=api.flags(rf);
},
example:{f:{xl:'Installation force, N',yl:'Seal nicks per 100 assemblies',px:'60',
 d:'42 1.1\n45 1.4\n48 1.2\n50 1.9\n52 2.3\n55 2.1\n57 2.8\n60 3.0\n62 3.6\n65 3.4\n68 4.1\n70 4.6\n72 4.4\n75 5.2'}}
}
