{
slug:'probability-plot-stem-leaf-dot-plot',
sections:[
 {type:'fields',title:'Your data',cols:3,hint:'One column of measurements, five to a row, or paste a block from a spreadsheet. Blank cells are ignored. For the histogram, box plot and summary statistics, use <a href="/tools/basic-statistics.html">basic statistics</a>; this page draws the other standard pictures of a distribution.',fields:[
  {id:'label',label:'What was measured',ph:'e.g. Repair turnaround, hours',wide:true},
  {id:'data',label:'Values, five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:8,minRows:3}]},
 {type:'custom',id:'dot',title:'Dot plot',hint:'One dot per value, stacked where values repeat. It shows every point, so gaps, clusters and outliers are plain to see. Best for up to about 50 values.',html:'<div class="svgw gm-dot"></div>'},
 {type:'fields',title:'Stem-and-leaf settings',cols:3,hint:'Leave these blank for an automatic choice.',fields:[
  {id:'lu',label:'Leaf unit',type:'number',min:0,ph:'auto',hint:'e.g. 0.1 means a leaf of 3 is 0.3.'},
  {id:'lps',label:'Lines per stem',type:'select',opts:['Auto','1','2','5']}]},
 {type:'custom',id:'sl',title:'Stem-and-leaf display',hint:'Each value is split into a stem (the leading digits) and a leaf (the next digit; later digits are dropped, not rounded). Read it on its side as a histogram that keeps the numbers. The left column is the depth: the count from the nearer end of the data, with the line that holds the median showing its own count in parentheses.',html:'<div class="gm-sl"></div>'},
 {type:'custom',id:'pp',title:'Normal probability plot',hint:'Each value is plotted against the percent of a normal distribution expected below it (Blom plotting positions, (i &minus; 0.375)/(n + 0.25)). If the data are normal the points fall along the straight line, which is the normal distribution with the sample mean and standard deviation.',html:'<div class="stat gm-st"></div><div class="svgw gm-pp"></div><div class="out gm-ppo"></div>'},
 {type:'fields',title:'Frequency classes',cols:3,hint:'Leave blank for automatic classes: about log<sub>2</sub>n + 1 of them (Sturges), with a round width.',fields:[
  {id:'cw',label:'Class width',type:'number',min:0,ph:'auto'},
  {id:'c0',label:'First class starts at',type:'number',ph:'auto'}]},
 {type:'custom',id:'cf',title:'Cumulative frequency and ogive',hint:'Classes include their lower boundary and exclude the upper one; the last class includes both. The ogive plots the cumulative percent at each upper class boundary, so you can read off the share of values below any point.',html:'<div class="tgw"><table class="tg gm-tab"></table></div><div class="svgw gm-og"></div><div class="out gm-cfo"></div>'}
],
update:function(root,api){
 var S=api.state(), raw=(S.f.data||'').split(/[\s,;]+/).filter(Boolean), x=[], bad=[];
 raw.forEach(function(t){ var v=Number(t); if(isFinite(v)) x.push(v); else bad.push(t); });
 var D=root.querySelector('.gm-dot'), SL=root.querySelector('.gm-sl'), ST=root.querySelector('.gm-st'), PP=root.querySelector('.gm-pp'), PO=root.querySelector('.gm-ppo'), TB=root.querySelector('.gm-tab'), OG=root.querySelector('.gm-og'), CO=root.querySelector('.gm-cfo');
 if(x.length<3){ [D,SL,ST,PP,TB,OG,CO].forEach(function(e){ e.innerHTML=''; }); PO.innerHTML=api.flags(bad.length?[['warn','Not numbers, ignored: '+bad.map(api.esc).join(', ')]]:[],'Enter at least three values.'); return; }
 var n=x.length, s=x.slice().sort(function(a,b){ return a-b; }), mn=s[0], mx=s[n-1], R=mx-mn;
 var dec=Math.min(6,Math.max.apply(null,raw.filter(function(t){ return isFinite(Number(t)); }).map(function(t){ var m=String(t).split('.')[1]; return m?m.length:0; })));
 function F(v,d){ return isFinite(v)?api.fmt(v,d==null?dec:d):'—'; }
 var mean=x.reduce(function(a,b){ return a+b; },0)/n, ss=0, m3=0, m4=0; x.forEach(function(v){ var d=v-mean; ss+=d*d; m3+=d*d*d; m4+=d*d*d*d; });
 var sd=Math.sqrt(ss/(n-1)), sk=n>2&&sd>0?n/((n-1)*(n-2))*m3/Math.pow(sd,3):NaN;
 var ku=n>3&&sd>0?n*(n+1)/((n-1)*(n-2)*(n-3))*m4/Math.pow(sd,4)-3*(n-1)*(n-1)/((n-2)*(n-3)):NaN;
 var med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
 var W=800, sty='<style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.l{font:600 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
 function ticks(a,b,k){ var raw=(b-a)/k, p=Math.pow(10,Math.floor(Math.log(raw)/Math.LN10)), m=raw/p, st=(m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p, t=[], v=Math.ceil(a/st-1e-9)*st; for(;v<=b+st*1e-9;v+=st) t.push(Math.round(v/st)*st); return t; }
 /* ---- dot plot ---- */
 (function(){ var lo=mn-(R||1)*0.04, hi=mx+(R||1)*0.04, L0=30, R0=30, B0=0, X=function(v){ return L0+(v-lo)/(hi-lo)*(W-L0-R0); };
  var distinct={}; s.forEach(function(v){ distinct[v]=1; }); var nd=Object.keys(distinct).length, bins=70, key=nd<=bins?function(v){ return v; }:function(v){ var b=Math.min(bins-1,Math.floor((v-mn)/((R||1)/bins))); return mn+(b+0.5)*(R||1)/bins; };
  var st={}; s.forEach(function(v){ var k=key(v); st[k]=(st[k]||0)+1; }); var top=Math.max.apply(null,Object.keys(st).map(function(k){ return st[k]; }));
  var r=Math.max(2.5,Math.min(6,90/(2*top+1))), H=Math.max(110,Math.round(top*2.2*r+64)); B0=H-34;
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Dot plot">'+sty;
  Object.keys(st).forEach(function(k){ for(var j=0;j<st[k];j++) g+='<circle cx="'+X(+k).toFixed(1)+'" cy="'+(B0-r-1-j*2.2*r).toFixed(1)+'" r="'+r.toFixed(1)+'" fill="#0F3E68" fill-opacity=".85"/>'; });
  g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+B0+'" y2="'+B0+'" stroke="#4A5D71"/>';
  ticks(lo,hi,8).forEach(function(t){ g+='<line x1="'+X(t)+'" x2="'+X(t)+'" y1="'+B0+'" y2="'+(B0+5)+'" stroke="#4A5D71"/><text x="'+X(t)+'" y="'+(B0+19)+'" text-anchor="middle">'+api.fmt(t,4)+'</text>'; });
  if(nd>bins) g+='<text x="'+(W-R0)+'" y="14" text-anchor="end">each dot is one value, grouped into '+bins+' bins</text>';
  D.innerHTML=g+'</svg>'; })();
 /* ---- stem-and-leaf ---- */
 function build(u,m){ var lines={}, kmin=Infinity, kmax=-Infinity;
  s.forEach(function(v){ var t=Math.trunc(Math.round(v/u*1e6)/1e6), neg=v<0, a=Math.abs(t), st=Math.floor(a/10), lf=a%10, j=Math.floor(lf/(10/m)), K=neg?-(st*m+j)-1:st*m+j;
   (lines[K]=lines[K]||[]).push(lf); if(K<kmin) kmin=K; if(K>kmax) kmax=K; });
  return {u:u,m:m,lines:lines,kmin:kmin,kmax:kmax,count:kmax-kmin+1}; }
 var lu=api.num(S.f.lu), lps=S.f.lps&&S.f.lps!=='Auto'?+S.f.lps:0, target=Math.max(6,Math.min(25,Math.round(2*Math.sqrt(n)))), best=null, cands=[];
 var e0=Math.floor(Math.log((R||Math.abs(mx)||1))/Math.LN10);
 var us=lu>0?[lu]:[e0-3,e0-2,e0-1,e0,e0+1].map(function(e){ return Math.pow(10,e); });
 us.forEach(function(u){ (lps?[lps]:[1,2,5]).forEach(function(m){ var b=build(u,m); if(b.count<=200) cands.push(b); }); });
 cands.forEach(function(b){ var sc=Math.abs(b.count-target)+(b.count<4?50:0)+(b.m===1?0:b.m===2?0.3:0.6); if(!best||sc<best.sc){ best=b; best.sc=sc; } });
 if(best){ var u=best.u, m=best.m, rows=[], cum=0, half=null, K;
  for(K=best.kmin;K<=best.kmax;K++){ var lv=best.lines[K]||[], neg=K<0, stem=neg?Math.floor((-K-1)/m):Math.floor(K/m); rows.push({stem:(neg?'-':'')+stem,leaves:lv.join(''),c:lv.length}); }
  rows.forEach(function(r){ cum+=r.c; r.top=cum; }); cum=0; for(var i=rows.length-1;i>=0;i--){ cum+=rows[i].c; rows[i].bot=cum; }
  var exact=n%2===0&&rows.some(function(r){ return r.top===n/2; }), ml=-1; if(!exact) for(i=0;i<rows.length;i++) if(rows[i].top>=(n+1)/2){ ml=i; break; }
  var foundExact=false; rows.forEach(function(r,i){ if(exact){ r.d=foundExact?r.bot:r.top; if(r.top===n/2) foundExact=true; } else r.d=i<ml?r.top:i>ml?r.bot:'('+r.c+')'; });
  var sw=Math.max.apply(null,rows.map(function(r){ return r.stem.length; })), dw=Math.max.apply(null,rows.map(function(r){ return String(r.d).length; }));
  function pad(t,w){ t=String(t); while(t.length<w) t=' '+t; return t; }
  var ud=Math.max(0,-Math.round(Math.log(u)/Math.LN10)), keyStem=rows[Math.floor(rows.length/2)], ex=keyStem.leaves?keyStem.leaves.charAt(0):'0', exv=(keyStem.stem.charAt(0)==='-'?-1:1)*(Math.abs(parseInt(keyStem.stem,10))*10+(+ex))*u;
  SL.innerHTML='<p class="gm-key">Leaf unit = '+api.fmt(u,ud)+' &middot; '+m+' line'+(m>1?'s':'')+' per stem &middot; key: '+api.esc(keyStem.stem)+' | '+ex+' = '+api.fmt(exv,ud)+'</p><pre class="gm-pre" aria-label="Stem-and-leaf display">'+rows.map(function(r){ return pad(r.d,dw)+'  '+pad(r.stem,sw)+' | '+r.leaves; }).join('\n')+'</pre>';
 } else SL.innerHTML='<p class="th">Could not find a sensible leaf unit for these values. Enter one above.</p>';
 /* ---- normal probability plot and Anderson-Darling ---- */
 function erfc(z0){ var z=Math.abs(z0), t=1/(1+0.5*z), r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277))))))))); return z0>=0?r:2-r; }
 function Phi(z){ return 0.5*erfc(-z/Math.SQRT2); }
 function Pinv(p){ var a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416],q,r,z;
  if(p<0.02425){ q=Math.sqrt(-2*Math.log(p)); z=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  else if(p>1-0.02425){ q=Math.sqrt(-2*Math.log(1-p)); z=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  else { q=p-0.5; r=q*q; z=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1); }
  var e=Phi(z)-p, uu=e*Math.sqrt(2*Math.PI)*Math.exp(z*z/2); return z-uu/(1+z*uu/2); }
 var f=[]; if(bad.length) f.push(['warn','Not numbers, ignored: '+bad.map(api.esc).join(', ')]);
 if(sd>0){
  var zs=s.map(function(v,i){ return Pinv((i+1-0.375)/(n+0.25)); });
  var A2=0; for(var i2=0;i2<n;i2++){ var lo1=Phi((s[i2]-mean)/sd), hi1=Phi((s[n-1-i2]-mean)/sd); A2+=(2*(i2+1)-1)*(Math.log(Math.max(lo1,1e-300))+Math.log(Math.max(1-hi1,1e-300))); } A2=-n-A2/n;
  var As=A2*(1+0.75/n+2.25/(n*n)), pv=As>=0.6?Math.exp(1.2937-5.709*As+0.0186*As*As):As>=0.34?Math.exp(0.9177-4.279*As-1.38*As*As):As>=0.2?1-Math.exp(-8.318+42.796*As-59.938*As*As):1-Math.exp(-13.436+101.14*As-223.73*As*As);
  pv=Math.max(0,Math.min(1,pv));
  var zm=zs.reduce(function(a,b){ return a+b; },0)/n, sxz=0, szz=0; s.forEach(function(v,i){ sxz+=(v-mean)*(zs[i]-zm); szz+=(zs[i]-zm)*(zs[i]-zm); }); var rr=sxz/Math.sqrt(ss*szz);
  ST.innerHTML=[[n,'Values'],[F(mean,dec+2),'Mean'],[F(sd,dec+2),'Std dev s'],[A2.toFixed(3),'Anderson-Darling A&sup2;'],[pv<0.005?'&lt; 0.005':pv.toFixed(3),'p-value, normality'],[rr.toFixed(4),'Plot correlation r']].map(function(c){ return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'; }).join('');
  var zl=Math.min(-2.6,zs[0]-0.25), zh=Math.max(2.6,zs[n-1]+0.25), xl=Math.min(mn,mean+sd*zl), xh=Math.max(mx,mean+sd*zh), px=(xh-xl)*0.03; xl-=px; xh+=px;
  var H=380, L0=58, R0=16, T0=12, B0=H-44, X=function(v){ return L0+(v-xl)/(xh-xl)*(W-L0-R0); }, Y=function(z){ return B0-(z-zl)/(zh-zl)*(B0-T0); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Normal probability plot">'+sty+'<rect x="'+L0+'" y="'+T0+'" width="'+(W-L0-R0)+'" height="'+(B0-T0)+'" fill="#fff" stroke="#DDE1E4"/>';
  [0.1,1,5,10,20,30,50,70,80,90,95,99,99.9].forEach(function(p){ var z=Pinv(p/100); if(z<zl||z>zh) return; g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+Y(z)+'" y2="'+Y(z)+'" stroke="#EEF0F2"/><text x="'+(L0-6)+'" y="'+(Y(z)+4)+'" text-anchor="end">'+p+'</text>'; });
  ticks(xl,xh,8).forEach(function(t){ g+='<line x1="'+X(t)+'" x2="'+X(t)+'" y1="'+T0+'" y2="'+B0+'" stroke="#F4F5F6"/><text x="'+X(t)+'" y="'+(B0+16)+'" text-anchor="middle">'+api.fmt(t,4)+'</text>'; });
  g+='<line x1="'+X(mean+sd*zl)+'" y1="'+Y(zl)+'" x2="'+X(mean+sd*zh)+'" y2="'+Y(zh)+'" stroke="#D8B147" stroke-width="2.5"/>';
  s.forEach(function(v,i){ g+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(zs[i]).toFixed(1)+'" r="4" fill="#0F3E68" fill-opacity=".85"/>'; });
  g+='<text x="'+((L0+W-R0)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+api.esc((S.f.label||'value').toUpperCase())+'</text><text transform="translate(14 '+((B0+T0)/2)+') rotate(-90)" text-anchor="middle">PERCENT</text>';
  PP.innerHTML=g+'</svg>';
  f.push([pv<0.05?'warn':'ok','Anderson-Darling A&sup2; = '+A2.toFixed(3)+', p '+(pv<0.005?'&lt; 0.005':'= '+pv.toFixed(3))+'. '+(pv<0.05?'The data depart from a normal distribution at the 5% level. Normal-based capability indices, tolerance intervals and variables sampling plans will be misleading without a transformation or a better-fitting distribution.':'No evidence against normality at the 5% level. That is not proof the data are normal, especially with few values; it means a normal model is not contradicted.')]);
  if(isFinite(sk)&&Math.abs(sk)>=0.5) f.push(['','Skewness '+sk.toFixed(2)+': '+(sk>0?'a long right tail. On the plot the points bend away from the line in an arc, with the largest values far to the right of it.':'a long left tail. On the plot the points bend away from the line in an arc, with the smallest values far to the left of it.')]);
  if(isFinite(ku)&&Math.abs(ku)>=1) f.push(['',(ku>0?'Heavy tails':'Light tails')+' (excess kurtosis '+ku.toFixed(2)+'): the points form an S around the line, '+(ku>0?'steeper in the middle and flattening at both ends.':'flatter in the middle and steep at both ends.')]);
  if(n<20) f.push(['','With '+n+' values the plot and the test have little power. Even data from a normal process wander around the line.']);
  f.push(['','A point well off the line at either end, with the rest straight, is an outlier rather than a non-normal process. Find out what happened to it before deciding.']);
 } else { ST.innerHTML=''; PP.innerHTML=''; f.push(['warn','All the values are the same; there is no spread to plot.']); }
 PO.innerHTML=api.flags(f);
 /* ---- frequency table and ogive ---- */
 var cw=api.num(S.f.cw), c0=api.num(S.f.c0), cf=[];
 if(!(cw>0)){ var kk=Math.ceil(Math.log(n)/Math.LN2+1), raw2=(R||1)/kk, p10=Math.pow(10,Math.floor(Math.log(raw2)/Math.LN10)), mm=raw2/p10; cw=(mm<1.5?1:mm<2.25?2:mm<3.5?2.5:mm<7.5?5:10)*p10; }
 if(!isFinite(c0)) c0=Math.floor(mn/cw+1e-9)*cw; else if(c0>mn){ cf.push(['warn','The first class starts above the smallest value ('+F(mn)+'); the start was moved down to cover it.']); c0=c0-Math.ceil((c0-mn)/cw-1e-9)*cw; }
 var nc=Math.max(1,Math.ceil((mx-c0)/cw-1e-9)); if(c0+nc*cw<mx-1e-9*cw) nc++;
 if(nc>60){ TB.innerHTML=''; OG.innerHTML=''; CO.innerHTML=api.flags([['warn','That class width gives '+nc+' classes. Use a wider class.']]); return; }
 var fr=[]; for(var c=0;c<nc;c++) fr.push(0); s.forEach(function(v){ var j=Math.floor((v-c0)/cw+1e-9); if(j>=nc) j=nc-1; if(j<0) j=0; fr[j]++; });
 var cd=Math.max(dec,Math.max(0,-Math.floor(Math.log(cw)/Math.LN10+1e-9))+(Math.abs(cw*10-Math.round(cw*10))>1e-9?1:0)), cum=0, th='<thead><tr><th>Class</th><th>Midpoint</th><th>Frequency</th><th>Percent</th><th>Cumulative</th><th>Cumulative %</th></tr></thead><tbody>', pts=[[c0,0]];
 fr.forEach(function(q,j){ cum+=q; var a=c0+j*cw, b=a+cw; pts.push([b,100*cum/n]); th+='<tr><td>'+F(a,cd)+' to &lt; '+F(b,cd)+(j===nc-1?' (incl.)':'')+'</td><td class="calc">'+F(a+cw/2,cd+1)+'</td><td class="calc">'+q+'</td><td class="calc">'+api.fmt(100*q/n,1)+'%</td><td class="calc">'+cum+'</td><td class="calc">'+api.fmt(100*cum/n,1)+'%</td></tr>'; });
 TB.innerHTML=th+'</tbody>';
 var b4=0, gm=NaN; for(c=0;c<nc;c++){ if(b4+fr[c]>=n/2){ gm=c0+c*cw+(n/2-b4)/fr[c]*cw; break; } b4+=fr[c]; }
 var H2=320, l0=58, r0=16, t0=12, b0=H2-44, xa=c0, xb=c0+nc*cw, X2=function(v){ return l0+(v-xa)/(xb-xa)*(W-l0-r0); }, Y2=function(p){ return b0-p/100*(b0-t0); };
 var g2='<svg viewBox="0 0 '+W+' '+H2+'" role="img" aria-label="Ogive, cumulative percent">'+sty+'<rect x="'+l0+'" y="'+t0+'" width="'+(W-l0-r0)+'" height="'+(b0-t0)+'" fill="#fff" stroke="#DDE1E4"/>';
 var cmax=Math.max.apply(null,fr); fr.forEach(function(q,j){ var h=q/cmax*(b0-t0)*0.45; g2+='<rect x="'+(X2(c0+j*cw)+1)+'" y="'+(b0-h)+'" width="'+Math.max(1,X2(c0+cw)-X2(c0)-2)+'" height="'+h+'" fill="#E3E8EE"/>'; });
 for(var p=0;p<=100;p+=25) g2+='<line x1="'+l0+'" x2="'+(W-r0)+'" y1="'+Y2(p)+'" y2="'+Y2(p)+'" stroke="#EEF0F2"/><text x="'+(l0-6)+'" y="'+(Y2(p)+4)+'" text-anchor="end">'+p+'%</text>';
 var step=Math.max(1,Math.ceil((nc+1)/10)); for(c=0;c<=nc;c+=step) g2+='<text x="'+X2(c0+c*cw)+'" y="'+(b0+16)+'" text-anchor="middle">'+api.fmt(c0+c*cw,cd)+'</text>';
 if(isFinite(gm)) g2+='<path d="M'+l0+' '+Y2(50)+' H'+X2(gm)+' V'+b0+'" fill="none" stroke="#9C7C1F" stroke-dasharray="4 3"/><text class="l" x="'+(X2(gm)+5)+'" y="'+(Y2(50)-6)+'" style="fill:#9C7C1F">median &asymp; '+api.fmt(gm,cd+1)+'</text>';
 g2+='<polyline points="'+pts.map(function(q){ return X2(q[0]).toFixed(1)+','+Y2(q[1]).toFixed(1); }).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2.5"/>'+pts.map(function(q){ return '<circle cx="'+X2(q[0]).toFixed(1)+'" cy="'+Y2(q[1]).toFixed(1)+'" r="3.5" fill="#0F3E68"/>'; }).join('');
 g2+='<text x="'+((l0+W-r0)/2)+'" y="'+(H2-8)+'" text-anchor="middle">UPPER CLASS BOUNDARY (bars: class frequency)</text>';
 OG.innerHTML=g2+'</svg>';
 cf.push(['','Median read from the ogive (grouped data): L + ((n/2 &minus; F) / f) &times; w = '+api.fmt(gm,cd+1)+'. The median of the raw values is '+F(med)+'. Grouping loses a little detail; the two are close when the classes are narrow.']);
 var mode=fr.indexOf(cmax); cf.push(['','Modal class: '+F(c0+mode*cw,cd)+' to '+F(c0+(mode+1)*cw,cd)+', with '+cmax+' of '+n+' values. '+nc+' classes of width '+api.fmt(cw,cd)+'.']);
 if(nc<5||nc>20) cf.push(['warn',nc+' classes. Between about 5 and 20 is usual; too few hides the shape, too many leaves it ragged.']);
 CO.innerHTML=api.flags(cf);
},
example:{f:{label:'Repair turnaround, hours (40 warranty returns)',lu:'',lps:'Auto',cw:'',c0:'',
 data:'40.7 6.5 21.3 14.3 15.0 16.5 8.0 16.4 12.7 47.5 19.7 15.6 16.1 13.8 11.8 15.4 21.8 16.4 26.4 16.6 18.2 33.4 22.4 14.7 16.7 22.3 39.0 16.2 16.3 26.9 12.6 16.0 25.6 22.7 18.7 23.5 5.8 27.1 12.3 9.2'}}
}
