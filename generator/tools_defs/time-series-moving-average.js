{
slug:'time-series-moving-average',
sections:[
 {type:'fields',title:'The series',cols:4,hint:'Equally spaced periods in time order: days, weeks, months or quarters, with no gaps. Give a season length to separate the seasonal pattern from the trend (4 for quarters in a year, 12 for months, 7 for days in a week).',fields:[
  {id:'label',label:'What is measured',ph:'e.g. Service calls per quarter',wide:true},
  {id:'w',label:'Moving average window',type:'number',min:2,hint:'Number of periods averaged.'},
  {id:'ctr',label:'Moving average type',type:'select',opts:['Trailing','Centered']},
  {id:'L',label:'Season length (optional)',type:'number',min:2},
  {id:'h',label:'Periods to forecast',type:'number',min:0,max:24},
  {id:'d',label:'Data, one period per row',type:'datagrid',cols:[{label:'Period',type:'text',ph:'e.g. Q1 2022'},{label:'Value'}],rows:8,minRows:4}]},
 {type:'custom',id:'ch',title:'Series, moving average and trend',html:'<div class="stat ts-st"></div><div class="svgw ts-svg"></div>'},
 {type:'custom',id:'si',title:'Seasonal indices',hint:'Ratio-to-moving-average method: each value is divided by a centered moving average one season long, which holds the trend but no seasonal pattern. The ratios are averaged for each position in the season and scaled so they average exactly 1. An index of 1.20 means that season runs 20% above the trend.',html:'<div class="ts-si"></div>'},
 {type:'custom',id:'tb',title:'Period by period',html:'<div class="tgw"><table class="tg ts-tab"></table></div>'},
 {type:'custom',id:'chk',title:'What the series says',html:'<div class="out ts-out"></div>'}
],
update:function(root,api){
 var S=api.state(), nm=api.num, f=[], P=[], bad=0;
 (S.f.d||'').split('\n').forEach(function(l){ if(!l.trim()) return; var t=l.split('\t'), v=nm((t[1]||'').trim());
  if(t.length<2){ var m=l.trim().match(/^(.*?)[\s,;]+(-?[\d.]+(?:e-?\d+)?)$/i); if(m){ t=[m[1],m[2]]; v=Number(m[2]); } }
  if(isFinite(v)) P.push({lab:(t[0]||'').trim(),y:v}); else bad++; });
 var ST=root.querySelector('.ts-st'), SV=root.querySelector('.ts-svg'), SI=root.querySelector('.ts-si'), TB=root.querySelector('.ts-tab'), O=root.querySelector('.ts-out');
 if(bad) f.push(['warn',bad+' row'+(bad>1?'s':'')+' without a number in the Value column '+(bad>1?'were':'was')+' left out. A missing period shifts everything after it; fill the gap rather than skip it.']);
 var N=P.length; if(N<4){ ST.innerHTML=''; SV.innerHTML=''; SI.innerHTML=''; TB.innerHTML=''; O.innerHTML=api.flags(f,'Enter at least four periods.'); return; }
 var y=P.map(function(p){ return p.y; }), w=Math.round(nm(S.f.w)), ctr=S.f.ctr==='Centered', L=Math.round(nm(S.f.L)), H=Math.round(nm(S.f.h)), i, j;
 if(!(w>=2)) w=Math.min(3,N); if(w>N){ f.push(['warn','The window is longer than the series; it was cut to '+N+'.']); w=N; }
 if(!(H>=0)) H=0; H=Math.min(H,24);
 /* moving averages */
 function cma(per){ var out=[], half=Math.floor(per/2); for(var t=0;t<N;t++){ if(per%2){ if(t-half<0||t+half>=N){ out.push(NaN); continue; } var s=0; for(var q=t-half;q<=t+half;q++) s+=y[q]; out.push(s/per); }
  else { if(t-half<0||t+half>=N){ out.push(NaN); continue; } var s2=0.5*y[t-half]+0.5*y[t+half]; for(var q2=t-half+1;q2<t+half;q2++) s2+=y[q2]; out.push(s2/per); } } return out; }
 var trail=[]; for(i=0;i<N;i++){ if(i<w-1){ trail.push(NaN); continue; } var s=0; for(j=i-w+1;j<=i;j++) s+=y[j]; trail.push(s/w); }
 var ma=ctr?cma(w):trail;
 /* seasonal indices */
 var seas=L>=2, SIx=null, ratio=null, pos=function(t){ return t%L; };
 if(seas&&N<2*L){ f.push(['warn','Seasonal indices need at least two full seasons ('+(2*L)+' periods); there are '+N+'. They were not calculated.']); seas=false; }
 if(seas&&y.some(function(v){ return v<=0; })){ f.push(['warn','The ratio-to-moving-average method needs values above zero. Seasonal indices were not calculated.']); seas=false; }
 if(seas){ var cm=cma(L), sum=[], cnt=[]; ratio=[]; for(j=0;j<L;j++){ sum.push(0); cnt.push(0); }
  for(i=0;i<N;i++){ var r=cm[i]>0?y[i]/cm[i]:NaN; ratio.push(r); if(isFinite(r)){ sum[pos(i)]+=r; cnt[pos(i)]++; } }
  var avg=sum.map(function(s,k){ return cnt[k]?s/cnt[k]:NaN; }), mAvg=avg.reduce(function(a,b){ return a+b; },0)/L; SIx=avg.map(function(a){ return a/mAvg; }); }
 var de=y.map(function(v,t){ return seas?v/SIx[pos(t)]:v; });
 /* least-squares trend on t = 1..N (deseasonalized if seasonal) */
 var tm=(N+1)/2, dm=de.reduce(function(a,b){ return a+b; },0)/N, stt=0, std=0, sdd=0;
 de.forEach(function(v,t){ var tt=t+1-tm; stt+=tt*tt; std+=tt*(v-dm); sdd+=(v-dm)*(v-dm); });
 var b1=std/stt, b0=dm-b1*tm, sse=Math.max(0,sdd-b1*std), r2=sdd>0?1-sse/sdd:NaN, df=N-2, seb=df>0?Math.sqrt(sse/df/stt):NaN, tst=seb>0?b1/seb:(b1===0?0:Infinity);
 function lgam(x){ var c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5], yy=x, t=x+5.5; t-=(x+0.5)*Math.log(t); var s=1.000000000190015; for(var k=0;k<6;k++) s+=c[k]/++yy; return -t+Math.log(2.5066282746310005*s/x); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap; if(Math.abs(d)<1e-300) d=1e-300; d=1/d; var h=d;
  for(var m=1;m<=300;m++){ var m2=2*m, aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; var del=d*c; h*=del; if(Math.abs(del-1)<3e-16) break; } return h; }
 function ibeta(x,a,b){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(lgam(a+b)-lgam(a)-lgam(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 var pval=df>0&&isFinite(tst)?ibeta(df/(df+tst*tst),df/2,0.5):(isFinite(tst)?NaN:0);
 var fit=function(t){ return b0+b1*t; }, fc=[];
 for(i=0;i<H;i++){ var t=N+1+i; fc.push({t:t,tr:fit(t),y:fit(t)*(seas?SIx[pos(t-1)]:1)}); }
 /* MA as a one-step forecast */
 var errs=[]; for(i=w-1;i<N-1;i++) errs.push({e:Math.abs(y[i+1]-trail[i]),p:y[i+1]!==0?Math.abs((y[i+1]-trail[i])/y[i+1]):NaN});
 var mad=errs.length?errs.reduce(function(a,b){ return a+b.e; },0)/errs.length:NaN, mape=errs.length&&errs.every(function(e){ return isFinite(e.p); })?100*errs.reduce(function(a,b){ return a+b.p; },0)/errs.length:NaN;
 var dec=Math.min(4,Math.max.apply(null,P.map(function(p){ var m=String(p.y).split('.')[1]; return m?m.length:0; }))), F=function(v,d){ return isFinite(v)?api.fmt(v,d==null?dec+1:d):''; };
 var tiles=[[N,'Periods'],[(b1>=0?'+':'')+F(b1,dec+2),'Trend slope per period'+(seas?' (deseasonalized)':'')],[F(r2,3),'R&sup2; of the trend line'],[pval<0.001?'&lt; 0.001':F(pval,3),'p-value, slope = 0'],[F(trail[N-1]),'Latest '+w+'-period moving average']];
 if(seas){ var hiS=Math.max.apply(null,SIx), loS=Math.min.apply(null,SIx); tiles.push([F(hiS,3)+' / '+F(loS,3),'Highest / lowest seasonal index']); }
 if(H) tiles.push([F(fc[0].y,dec),'Forecast, next period']);
 ST.innerHTML=tiles.map(function(c){ return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'; }).join('');
 /* season names: the shared first word of the labels at each position */
 var sname=[]; if(seas) for(j=0;j<L;j++){ var words={}, k2=0; P.forEach(function(p,t){ if(pos(t)===j){ words[(p.lab.split(/\s+/)[0]||'')]=1; k2++; } }); var ks=Object.keys(words); sname.push(ks.length===1&&ks[0]?ks[0]:'Season '+(j+1)); }
 /* main chart */
 var all=y.concat(fc.map(function(q){ return q.y; })).concat(ma.filter(isFinite)), lo=Math.min.apply(null,all), hi=Math.max.apply(null,all), pd=(hi-lo)*0.08||1; lo-=pd; hi+=pd;
 var W=800, Ht=340, L0=64, R0=16, T0=14, B0=Ht-62, NT=N+H, X=function(t){ return L0+(NT>1?(t-1)/(NT-1):0.5)*(W-L0-R0); }, Y=function(v){ return B0-(v-lo)/(hi-lo)*(B0-T0); };
 var g='<svg viewBox="0 0 '+W+' '+Ht+'" role="img" aria-label="Time series with moving average and trend"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.l{font:600 11px \'IBM Plex Mono\',monospace}</style><rect x="'+L0+'" y="'+T0+'" width="'+(W-L0-R0)+'" height="'+(B0-T0)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(i=0;i<=5;i++){ var v=lo+(hi-lo)*i/5; g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#F0F2F4"/><text x="'+(L0-6)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+api.fmt(v,Math.abs(hi-lo)<10?2:0)+'</text>'; }
 var every=Math.max(1,Math.ceil(NT/14));
 for(i=1;i<=NT;i+=every){ var lab=i<=N?(P[i-1].lab||String(i)):'+'+(i-N); if(lab.length>9) lab=lab.slice(0,8)+'…'; g+='<text transform="translate('+X(i)+' '+(B0+12)+') rotate(-35)" text-anchor="end">'+api.esc(lab)+'</text>'; }
 if(H) g+='<rect x="'+X(N+0.5)+'" y="'+T0+'" width="'+(W-R0-X(N+0.5))+'" height="'+(B0-T0)+'" fill="#FBF6E6"/><text class="l" x="'+(X(N+0.5)+5)+'" y="'+(T0+13)+'" style="fill:#9C7C1F">FORECAST</text>';
 g+='<line x1="'+X(1)+'" y1="'+Y(fit(1))+'" x2="'+X(NT)+'" y2="'+Y(fit(NT))+'" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="6 4"/>';
 function poly(arr,off){ var d='', pen=false; arr.forEach(function(v,t){ if(!isFinite(v)){ pen=false; return; } d+=(pen?' L':'M')+X(t+off).toFixed(1)+' '+Y(v).toFixed(1); pen=true; }); return d; }
 g+='<path d="'+poly(y,1)+'" fill="none" stroke="#0F3E68" stroke-width="1.6"/>'+y.map(function(v,t){ return '<circle cx="'+X(t+1).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="3.4" fill="#0F3E68"/>'; }).join('');
 g+='<path d="'+poly(ma,1)+'" fill="none" stroke="#D8B147" stroke-width="3"/>';
 if(H) g+='<path d="M'+X(N)+' '+Y(y[N-1])+fc.map(function(q){ return ' L'+X(q.t).toFixed(1)+' '+Y(q.y).toFixed(1); }).join('')+'" fill="none" stroke="#9C7C1F" stroke-width="1.6" stroke-dasharray="4 3"/>'+fc.map(function(q){ return '<circle cx="'+X(q.t).toFixed(1)+'" cy="'+Y(q.y).toFixed(1)+'" r="3.6" fill="#fff" stroke="#9C7C1F" stroke-width="1.6"/>'; }).join('');
 var ly=Ht-12; g+='<line x1="'+L0+'" x2="'+(L0+22)+'" y1="'+(ly-4)+'" y2="'+(ly-4)+'" stroke="#0F3E68" stroke-width="2"/><text x="'+(L0+28)+'" y="'+ly+'">data</text><line x1="'+(L0+80)+'" x2="'+(L0+102)+'" y1="'+(ly-4)+'" y2="'+(ly-4)+'" stroke="#D8B147" stroke-width="3"/><text x="'+(L0+108)+'" y="'+ly+'">'+w+'-period '+(ctr?'centered':'trailing')+' moving average</text><line x1="'+(L0+400)+'" x2="'+(L0+422)+'" y1="'+(ly-4)+'" y2="'+(ly-4)+'" stroke="#C0392B" stroke-width="2" stroke-dasharray="6 4"/><text x="'+(L0+428)+'" y="'+ly+'">'+(seas?'trend (deseasonalized)':'least-squares trend')+'</text>';
 SV.innerHTML=g+'</svg>';
 /* seasonal index bars */
 if(seas){ var bw=Math.min(90,(W-80)/L), H3=210, base=150, mxI=Math.max(1.3,Math.max.apply(null,SIx)+0.05), mnI=Math.min(0.7,Math.min.apply(null,SIx)-0.05), Ys=function(v){ return 20+(mxI-v)/(mxI-mnI)*(base-20); };
  var g3='<svg viewBox="0 0 '+W+' '+H3+'" role="img" aria-label="Seasonal indices"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:600 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style><line x1="40" x2="'+(W-10)+'" y1="'+Ys(1)+'" y2="'+Ys(1)+'" stroke="#4A5D71"/><text x="34" y="'+(Ys(1)+4)+'" text-anchor="end">1.00</text>';
  SIx.forEach(function(v,k){ var x0=50+k*((W-60)/L)+((W-60)/L-bw)/2+4, a=Ys(Math.max(v,1)), b=Ys(Math.min(v,1)); g3+='<rect x="'+x0+'" y="'+a+'" width="'+(bw-8)+'" height="'+Math.max(1,b-a)+'" fill="'+(v>=1?'#0F3E68':'#9C7C1F')+'"/><text class="v" x="'+(x0+(bw-8)/2)+'" y="'+(v>=1?a-5:b+14)+'" text-anchor="middle">'+v.toFixed(3)+'</text><text x="'+(x0+(bw-8)/2)+'" y="'+(base+40)+'" text-anchor="middle">'+api.esc(sname[k].length>10?sname[k].slice(0,9)+'…':sname[k])+'</text>'; });
  SI.innerHTML='<div class="svgw">'+g3+'</svg></div>'; }
 else SI.innerHTML='<p class="th">Enter a season length to calculate seasonal indices.</p>';
 /* table */
 var th='<thead><tr><th>#</th><th>Period</th><th>Value</th><th>'+w+'-pt MA</th><th>Trend</th>'+(seas?'<th>Ratio to CMA</th><th>Seasonal index</th><th>Deseasonalized</th>':'')+'</tr></thead><tbody>';
 P.forEach(function(p,t){ th+='<tr><td class="calc">'+(t+1)+'</td><td>'+api.esc(p.lab)+'</td><td class="calc">'+F(p.y,dec)+'</td><td class="calc">'+F(ma[t])+'</td><td class="calc">'+F(fit(t+1))+'</td>'+(seas?'<td class="calc">'+F(ratio[t],4)+'</td><td class="calc">'+F(SIx[pos(t)],4)+'</td><td class="calc">'+F(de[t])+'</td>':'')+'</tr>'; });
 fc.forEach(function(q){ th+='<tr class="ts-fc"><td class="calc">'+q.t+'</td><td>Forecast +'+(q.t-N)+'</td><td class="calc">'+F(q.y,dec)+'</td><td></td><td class="calc">'+F(q.tr)+'</td>'+(seas?'<td></td><td class="calc">'+F(SIx[pos(q.t-1)],4)+'</td><td></td>':'')+'</tr>'; });
 TB.innerHTML=th+'</tbody>';
 /* checks */
 var mean=y.reduce(function(a,b){ return a+b; },0)/N;
 f.push([pval<0.05?'':'ok',(pval<0.05?'A real trend: ':'No clear trend: ')+'the '+(seas?'deseasonalized ':'')+'series changes by '+(b1>=0?'+':'&minus;')+F(Math.abs(b1),dec+2)+' per period ('+(mean?api.fmt(100*b1/Math.abs(mean),2)+'% of the mean':'')+'), p '+(pval<0.001?'&lt; 0.001':'= '+F(pval,3))+', R&sup2; = '+F(r2,3)+'. '+(pval<0.05?'Over the '+N+' periods that is '+(b1*(N-1)>=0?'+':'&minus;')+F(Math.abs(b1*(N-1)),dec)+' in all.':'The slope could be chance; do not project it forward.')]);
 if(seas){ var kh=SIx.indexOf(Math.max.apply(null,SIx)), kl=SIx.indexOf(Math.min.apply(null,SIx));
  f.push(['','Seasonal pattern: <b>'+api.esc(sname[kh])+'</b> runs '+api.fmt(100*(SIx[kh]-1),1)+'% above the trend and <b>'+api.esc(sname[kl])+'</b> '+api.fmt(100*(1-SIx[kl]),1)+'% below it. Comparing one period with the one before it without allowing for this mixes season with real change; compare deseasonalized values, or the same season a year earlier.']);
  if(w!==L&&w%L!==0) f.push(['','The '+w+'-period moving average is not a multiple of the season length ('+L+'), so it still carries some of the seasonal pattern. A window equal to the season length smooths the season out completely.']); }
 f.push(['','A '+w+'-period '+(ctr?'centered moving average sits in the middle of its window, so it cannot be computed for the first and last '+Math.floor(w/2)+' periods.':'trailing moving average lags the data by about '+api.fmt((w-1)/2,1)+' periods, so it turns late when the series turns. A longer window is smoother and lags more.')]);
 if(isFinite(mad)) f.push(['','Used as a forecast of the next period, the trailing moving average missed by '+F(mad,dec+1)+' on average (MAD)'+(isFinite(mape)?', '+api.fmt(mape,1)+'% (MAPE)':'')+', over '+errs.length+' periods.'+(seas&&b1!==0?' With a trend and a season, a moving average alone forecasts poorly; the trend times seasonal index forecast in the table allows for both.':'')]);
 if(H&&!seas&&L) f.push(['warn','The forecast does not include a seasonal pattern.']);
 if(H) f.push(['','Forecasts assume the trend'+(seas?' and the seasonal pattern':'')+' carry on unchanged. Treat anything beyond one season ahead as a rough guide, and check it against the actual values as they come in.']);
 O.innerHTML=api.flags(f);
},
example:{f:{label:'Warranty service calls per quarter, Varden Home Comfort',w:'4',ctr:'Centered',L:'4',h:'4',
 d:'Q1 2021\t330\nQ2 2021\t409\nQ3 2021\t457\nQ4 2021\t373\nQ1 2022\t347\nQ2 2022\t410\nQ3 2022\t497\nQ4 2022\t370\nQ1 2023\t366\nQ2 2023\t452\nQ3 2023\t545\nQ4 2023\t408\nQ1 2024\t372\nQ2 2024\t449\nQ3 2024\t588\nQ4 2024\t433\nQ1 2025\t432\nQ2 2025\t507\nQ3 2025\t580\nQ4 2025\t459'}}
}
