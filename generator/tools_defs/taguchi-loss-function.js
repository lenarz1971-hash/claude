{
slug:'taguchi-loss-function',
sections:[
 {type:'fields',title:'The characteristic and the loss',cols:4,hint:'Taguchi&rsquo;s loss function puts a cost on every unit that is off target, not only on the ones outside the specification. Give the goal, the tolerance and what a unit costs (scrap, rework, warranty, lost customer) when it reaches the edge of the tolerance.',fields:[
  {id:'ch',label:'Characteristic',ph:'e.g. Bore diameter',wide:true},
  {id:'unit',label:'Unit',ph:'e.g. mm'},
  {id:'goal',label:'Goal',type:'select',opts:['Nominal is best','Smaller is better','Larger is better']},
  {id:'T',label:'Target T (nominal is best)',type:'number'},
  {id:'D',label:'Tolerance Δ',type:'number',min:0,hint:'Nominal: the half-width, T ± Δ. Smaller or larger is better: the limit where the loss reaches A.'},
  {id:'A',label:'Loss A at the tolerance edge, $',type:'number',min:0},
  {id:'y',label:'Price one unit at y =',type:'number'},
  {id:'vol',label:'Units per year (optional)',type:'number',min:0}]},
 {type:'custom',id:'lf',title:'The loss function',html:'<div class="stat tg-k"></div><div class="svgw tg-svg"></div>'},
 {type:'fields',title:'Measurements from the process',hint:'Type or paste measured values, five to a row. The tool works out the average loss per unit and the signal-to-noise ratio for this data.',fields:[
  {id:'data',label:'Values, five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:6,minRows:3}]},
 {type:'custom',id:'avg',title:'Average loss and signal-to-noise for this data',html:'<div class="stat tg-avg"></div><div class="out tg-out"></div>'},
 {type:'grid',id:'runs',title:'Compare settings by signal-to-noise ratio',rows:3,hint:'In a Taguchi experiment each row is one run (one combination of control-factor settings), and the replicates are measured under the noise conditions. The S/N ratio uses the goal chosen above. Larger S/N is always better.',cols:[
  {id:'run',label:'Run or setting',w:170},
  {id:'y1',label:'y1',type:'number'},{id:'y2',label:'y2',type:'number'},{id:'y3',label:'y3',type:'number'},{id:'y4',label:'y4',type:'number'},{id:'y5',label:'y5',type:'number'},{id:'y6',label:'y6',type:'number'},
  {id:'mn',label:'Mean',calc:function(r,api){ var q=window.TOOL._q(r,api); return q.n?api.fmt(q.m,4):''; }},
  {id:'sd',label:'s',calc:function(r,api){ var q=window.TOOL._q(r,api); return q.n>1?api.fmt(q.s,4):''; }},
  {id:'sn',label:'S/N, dB',calc:function(r,api){ var q=window.TOOL._q(r,api); return isFinite(q.sn)?api.fmt(q.sn,2):''; }},
  {id:'ls',label:'Avg loss $',calc:function(r,api){ var q=window.TOOL._q(r,api); return isFinite(q.loss)?api.fmt(q.loss,2):''; }}]},
 {type:'custom',id:'sn',title:'Signal-to-noise by run',html:'<div class="svgw tg-sn"></div><div class="out tg-sno"></div>'}
],
_par:function(api){
 var S=api.state(), n=api.num, g=S.f.goal||'Nominal is best', D=n(S.f.D), A=n(S.f.A), T=n(S.f.T), k=NaN;
 var gi=g==='Smaller is better'?1:g==='Larger is better'?2:0;
 if(D>0&&A>=0) k=gi===2?A*D*D:A/(D*D);
 return {g:g,gi:gi,D:D,A:A,T:T,k:k,L:function(y){ return gi===0?k*(y-T)*(y-T):gi===1?k*y*y:k/(y*y); }};
},
_stats:function(x,P){
 var n=x.length, m=0, i; for(i=0;i<n;i++) m+=x[i]; m/=n;
 var ss=0, msd=0, inv=0, dev=0; for(i=0;i<n;i++){ ss+=(x[i]-m)*(x[i]-m); msd+=x[i]*x[i]; inv+=1/(x[i]*x[i]); dev+=(x[i]-P.T)*(x[i]-P.T); }
 var s=n>1?Math.sqrt(ss/(n-1)):NaN, sn;
 if(P.gi===0) sn=n>1&&ss>0?10*Math.log(m*m/(s*s))/Math.LN10:NaN;
 else if(P.gi===1) sn=-10*Math.log(msd/n)/Math.LN10;
 else sn=x.every(function(v){ return v!==0; })?-10*Math.log(inv/n)/Math.LN10:NaN;
 var loss=P.gi===0?(isFinite(P.T)?P.k*dev/n:NaN):P.gi===1?P.k*msd/n:(isFinite(sn)?P.k*inv/n:NaN);
 return {n:n,m:m,s:s,sig2:ss/n,sn:sn,loss:loss};
},
_q:function(r,api){
 var x=[]; ['y1','y2','y3','y4','y5','y6'].forEach(function(c){ var v=api.num(r[c]); if(isFinite(v)) x.push(v); });
 if(!x.length) return {n:0,sn:NaN,loss:NaN};
 return window.TOOL._stats(x,window.TOOL._par(api));
},
update:function(root,api){
 var S=api.state(), TL=window.TOOL, P=TL._par(api), u=api.esc(S.f.unit||''), f=[], y=api.num(S.f.y), vol=api.num(S.f.vol);
 var KS=root.querySelector('.tg-k'), SV=root.querySelector('.tg-svg'), AV=root.querySelector('.tg-avg'), O=root.querySelector('.tg-out');
 function $(v,d){ return isFinite(v)?'$'+api.fmt(v,d==null?2:d):'—'; }
 function sig(v){ if(!isFinite(v)) return '—'; var a=Math.abs(v); return a===0?'0':a>=1000?api.fmt(v,0):a>=1?api.fmt(v,4):Number(v.toPrecision(4)).toString(); }
 var x=[]; (S.f.data||'').split(/[\s,;]+/).filter(Boolean).forEach(function(t){ var v=Number(t); if(isFinite(v)) x.push(v); });
 var ready=isFinite(P.k)&&(P.gi!==0||isFinite(P.T));
 if(!ready){ KS.innerHTML=''; SV.innerHTML=''; AV.innerHTML=''; O.innerHTML=api.flags([],P.gi===0?'Enter the target, the tolerance and the loss at the tolerance edge.':'Enter the limit and the loss at that limit.'); TL._runs(root,api,P); return; }
 var kform=P.gi===0?'k = A / &Delta;<sup>2</sup>':P.gi===1?'k = A / &Delta;<sup>2</sup>':'k = A &times; &Delta;<sup>2</sup>';
 var lform=P.gi===0?'L(y) = k(y &minus; T)<sup>2</sup>':P.gi===1?'L(y) = k y<sup>2</sup>':'L(y) = k / y<sup>2</sup>';
 var tiles='<div><b>'+sig(P.k)+'</b><span>Loss constant '+kform+'</span></div><div><b>'+$(P.A)+'</b><span>Loss A at the tolerance edge</span></div>';
 if(isFinite(y)&&(P.gi!==2||y!==0)) tiles+='<div><b>'+$(P.L(y))+'</b><span>Loss for one unit at y = '+api.fmt(y,4)+'</span></div>';
 KS.innerHTML=tiles;
 /* loss curve */
 var lo, hi; if(P.gi===0){ lo=P.T-1.6*P.D; hi=P.T+1.6*P.D; } else if(P.gi===1){ lo=0; hi=1.5*P.D; } else { lo=0.45*P.D; hi=2.6*P.D; }
 x.concat(isFinite(y)?[y]:[]).forEach(function(v){ if(P.gi===2&&v<=0) return; if(v<lo) lo=v-(hi-lo)*0.04; if(v>hi) hi=v+(hi-lo)*0.04; });
 var Lmax=Math.min(4*P.A,Math.max(P.gi===2?0:P.L(lo),P.L(hi),P.gi===2?P.L(lo):0,1.2*P.A))*1.04||1, W=800, H=320, L0=64, R0=14, T0=16, B0=H-60, X=function(v){ return L0+(v-lo)/(hi-lo)*(W-L0-R0); }, Y=function(l){ return B0-Math.min(l,Lmax)/Lmax*(B0-T0); };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Quadratic loss function"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.l{font:600 11px \'IBM Plex Mono\',monospace}</style><rect x="'+L0+'" y="'+T0+'" width="'+(W-L0-R0)+'" height="'+(B0-T0)+'" fill="#fff" stroke="#DDE1E4"/>';
 function ticks(a,b,k){ var raw=(b-a)/k, p=Math.pow(10,Math.floor(Math.log(raw)/Math.LN10)), m=raw/p, st=(m<1.5?1:m<3?2:m<7?5:10)*p, t=[], v=Math.ceil(a/st-1e-9)*st; for(;v<=b+st*1e-9;v+=st) t.push(Math.round(v/st)*st); return {t:t,d:Math.max(0,-Math.floor(Math.log(st)/Math.LN10+1e-9))}; }
 var ty=ticks(0,Lmax,5), tx=ticks(lo,hi,7), i;
 ty.t.forEach(function(lv){ g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+Y(lv)+'" y2="'+Y(lv)+'" stroke="#F0F2F4"/><text x="'+(L0-6)+'" y="'+(Y(lv)+4)+'" text-anchor="end">$'+api.fmt(lv,ty.d)+'</text>'; });
 tx.t.forEach(function(xv){ g+='<line x1="'+X(xv)+'" x2="'+X(xv)+'" y1="'+B0+'" y2="'+(B0+4)+'" stroke="#9AA6B2"/><text x="'+X(xv)+'" y="'+(B0+17)+'" text-anchor="middle">'+api.fmt(xv,tx.d)+'</text>'; });
 /* goalpost (step) loss */
 var gp=P.gi===0?'M'+X(lo)+' '+Y(P.A)+' H'+X(P.T-P.D)+' V'+Y(0)+' H'+X(P.T+P.D)+' V'+Y(P.A)+' H'+X(hi):P.gi===1?'M'+X(lo)+' '+Y(0)+' H'+X(P.D)+' V'+Y(P.A)+' H'+X(hi):'M'+X(lo)+' '+Y(P.A)+' H'+X(P.D)+' V'+Y(0)+' H'+X(hi);
 g+='<path d="'+gp+'" fill="none" stroke="#9AA6B2" stroke-width="2" stroke-dasharray="6 4"/>';
 var pth=''; for(i=0;i<=160;i++){ var xx=lo+(hi-lo)*i/160; if(P.gi===2&&xx<=0) continue; pth+=(pth?' L':'M')+X(xx).toFixed(1)+' '+Y(P.L(xx)).toFixed(1); }
 g+='<path d="'+pth+'" fill="none" stroke="#0F3E68" stroke-width="2.5"/>';
 if(P.gi===0) g+='<line x1="'+X(P.T)+'" x2="'+X(P.T)+'" y1="'+T0+'" y2="'+B0+'" stroke="#1F8C55" stroke-dasharray="3 3"/><text class="l" x="'+(X(P.T)+4)+'" y="'+(T0+12)+'" style="fill:#1F8C55">T</text>';
 x.forEach(function(v){ if(P.gi===2&&v<=0) return; g+='<circle cx="'+X(v).toFixed(1)+'" cy="'+Y(P.L(v)).toFixed(1)+'" r="3.6" fill="#D8B147" fill-opacity=".85" stroke="#9C7C1F" stroke-width=".8"/>'; });
 if(isFinite(y)&&(P.gi!==2||y>0)) g+='<line x1="'+X(y)+'" x2="'+X(y)+'" y1="'+Y(P.L(y))+'" y2="'+B0+'" stroke="#C0392B" stroke-width="1.5"/><circle cx="'+X(y)+'" cy="'+Y(P.L(y))+'" r="5" fill="#C0392B"/>';
 var ly=H-12; g+='<line x1="'+L0+'" x2="'+(L0+24)+'" y1="'+(ly-4)+'" y2="'+(ly-4)+'" stroke="#0F3E68" stroke-width="2.5"/><text x="'+(L0+30)+'" y="'+ly+'">quadratic loss, '+lform.replace(/<sup>2<\/sup>/g,'&sup2;')+'</text><line x1="'+(L0+300)+'" x2="'+(L0+324)+'" y1="'+(ly-4)+'" y2="'+(ly-4)+'" stroke="#9AA6B2" stroke-width="2" stroke-dasharray="6 4"/><text x="'+(L0+330)+'" y="'+ly+'">goalpost: in or out of spec</text><circle cx="'+(L0+540)+'" cy="'+(ly-4)+'" r="3.6" fill="#D8B147" stroke="#9C7C1F" stroke-width=".8"/><text x="'+(L0+548)+'" y="'+ly+'">your data</text>';
 SV.innerHTML=g+'</svg>';
 /* data */
 if(x.length<2){ AV.innerHTML=''; O.innerHTML=api.flags([],'Enter at least two measurements to see the average loss and the S/N ratio.'); TL._runs(root,api,P); return; }
 var st=TL._stats(x,P), n=st.n, sg=Math.sqrt(st.sig2), out=0;
 x.forEach(function(v){ if(P.gi===0?Math.abs(v-P.T)>P.D:P.gi===1?v>P.D:v<P.D) out++; });
 var cells=[[n,'Values'],[sig(st.m),'Mean &#563;'],[sig(st.s),'Std dev s (n &minus; 1)'],[$(st.loss),'Average loss per unit'],[api.fmt(st.sn,2)+' dB','S/N, '+P.g.toLowerCase()]];
 if(isFinite(vol)&&vol>0) cells.push([$(st.loss*vol,0),'Loss per year, '+api.fmt(vol,0)+' units']);
 cells.push([$(P.A*out/n),'Goalpost loss per unit ('+out+' of '+n+' out)']);
 AV.innerHTML=cells.map(function(c){ return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'; }).join('');
 if(P.gi===0){ var vpart=P.k*st.sig2, bpart=P.k*(st.m-P.T)*(st.m-P.T), tot=vpart+bpart||1;
  f.push(['','Average loss = k[&sigma;<sup>2</sup> + (&#563; &minus; T)<sup>2</sup>] = '+sig(P.k)+' &times; ['+sig(st.sig2)+' + '+sig((st.m-P.T)*(st.m-P.T))+'] = <b>'+$(st.loss)+'</b> per unit. Here &sigma;<sup>2</sup> divides by n, so the figure is exactly the mean of the per-unit losses; with s<sup>2</sup> (n &minus; 1) it would be '+$(P.k*(st.s*st.s+(st.m-P.T)*(st.m-P.T)))+'.']);
  f.push([bpart/tot>0.5?'warn':'',api.fmt(100*vpart/tot,0)+'% of the loss comes from variation and '+api.fmt(100*bpart/tot,0)+'% from being off target (mean '+(st.m>=P.T?'+':'&minus;')+sig(Math.abs(st.m-P.T))+' '+u+' from T). '+(bpart/tot>0.5?'Centering the process is the cheap win: it removes '+$(bpart)+' per unit without reducing variation.':'Centering helps little; the loss is mainly variation, which needs a more robust process.')]); }
 else if(P.gi===1) f.push(['','Average loss = k &times; mean(y<sup>2</sup>) = k(&sigma;<sup>2</sup> + &#563;<sup>2</sup>) = <b>'+$(st.loss)+'</b> per unit. Both a lower mean and less variation reduce it; '+api.fmt(100*st.sig2/(st.sig2+st.m*st.m),0)+'% comes from variation.']);
 else f.push(['','Average loss = k &times; mean(1/y<sup>2</sup>) = <b>'+$(st.loss)+'</b> per unit. A higher mean and less variation both reduce it.']);
 f.push([out?'warn':'ok',out?out+' of '+n+' values are outside the tolerance. The goalpost view counts only those ('+$(P.A*out/n)+' per unit); the loss function also counts the cost of the ones that are inside but off target.':'Every value is inside the tolerance, so the goalpost view says the loss is zero. The loss function still puts it at '+$(st.loss)+' per unit, because parts near the edge perform worse than parts on target.']);
 if(P.gi===2&&x.some(function(v){ return v<=0; })) f.push(['warn','Larger-is-better needs values above zero.']);
 O.innerHTML=api.flags(f);
 TL._runs(root,api,P);
},
_runs:function(root,api,P){
 var S=api.state(), R=[], sv=root.querySelector('.tg-sn'), so=root.querySelector('.tg-sno'), f=[];
 S.g.runs.forEach(function(r,i){ var q=window.TOOL._q(r,api); if(q.n&&isFinite(q.sn)) R.push({nm:(r.run||'').trim()||('Run '+(i+1)),q:q}); });
 if(!R.length){ sv.innerHTML=''; so.innerHTML=api.flags([],P.gi===0?'Enter two or more replicates per run.':'Enter replicates for each run.'); return; }
 var best=R.reduce(function(a,b){ return b.q.sn>a.q.sn?b:a; }), mn=Math.min(0,Math.min.apply(null,R.map(function(r){ return r.q.sn; }))), mx=Math.max(0,Math.max.apply(null,R.map(function(r){ return r.q.sn; })));
 if(mx===mn) mx=mn+1;
 var W=800, rh=34, H=R.length*rh+40, L0=200, R0=70, X=function(v){ return L0+(v-mn)/(mx-mn)*(W-L0-R0); };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Signal-to-noise ratio by run"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:600 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
 R.forEach(function(r,i){ var y=14+i*rh, a=X(Math.min(0,r.q.sn)), b=X(Math.max(0,r.q.sn)), nm=r.nm.length>26?r.nm.slice(0,25)+'…':r.nm;
  g+='<text x="'+(L0-8)+'" y="'+(y+15)+'" text-anchor="end">'+api.esc(nm)+'</text><rect x="'+a+'" y="'+y+'" width="'+Math.max(1,b-a)+'" height="'+(rh-12)+'" fill="'+(r===best?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(r.q.sn>=0?b+6:a-6)+'" y="'+(y+15)+'" text-anchor="'+(r.q.sn>=0?'start':'end')+'">'+api.fmt(r.q.sn,2)+'</text>'; });
 g+='<line x1="'+X(0)+'" x2="'+X(0)+'" y1="8" y2="'+(H-24)+'" stroke="#4A5D71"/><text x="'+((L0+W-R0)/2)+'" y="'+(H-6)+'" text-anchor="middle">S/N ratio, dB ('+api.esc(P.g.toLowerCase())+'; larger is better)</text>';
 sv.innerHTML=g+'</svg>';
 var fm=P.gi===0?'S/N = 10 log<sub>10</sub>(&#563;<sup>2</sup>/s<sup>2</sup>)':P.gi===1?'S/N = &minus;10 log<sub>10</sub>(mean of y<sup>2</sup>)':'S/N = &minus;10 log<sub>10</sub>(mean of 1/y<sup>2</sup>)';
 f.push(['ok','Highest S/N: <b>'+api.esc(best.nm)+'</b>, '+api.fmt(best.q.sn,2)+' dB. '+fm+'.']);
 if(R.length>1){ var sorted=R.slice().sort(function(a,b){ return b.q.sn-a.q.sn; }), gap=sorted[0].q.sn-sorted[1].q.sn; f.push(['','The gap to the next best ('+api.esc(sorted[1].nm)+') is '+api.fmt(gap,2)+' dB. Every 3 dB is roughly a halving of the noise power (variance relative to the signal); 10 dB is a tenfold reduction.']); }
 if(P.gi===0){ f.push(['','Nominal is best is a two-step optimization: first choose the settings with the highest S/N (least variation relative to the mean), then use a factor that moves the mean without affecting S/N to bring it onto target.']);
  if(isFinite(P.T)) f.push(['','The best run&rsquo;s mean is '+api.fmt(best.q.m,4)+', '+api.fmt(Math.abs(best.q.m-P.T),4)+' from the target. Its average loss as run is $'+api.fmt(best.q.loss,2)+' per unit; after re-centering, the variation part alone would be about $'+api.fmt(P.k*best.q.s*best.q.s,2)+'.']); }
 if(R.some(function(r){ return r.q.n<3; })) f.push(['warn','Some runs have fewer than three replicates. The S/N ratio is unstable with so few.']);
 so.innerHTML=api.flags(f);
},
example:{f:{ch:'Bore diameter, pump housing PH-210',unit:'mm',goal:'Nominal is best',T:'25.000',D:'0.050',A:'18',y:'25.030',vol:'40000',
 data:'25.013 25.035 25.033 25.003 25.007 25.003 25.022 25.011 25.025 24.981 25.039 25.010 25.024 25.010 25.006 25.020 25.026 25.009 25.009 25.024 24.997 24.986 25.019 25.001 24.979 24.998 25.004 24.992 24.987 25.013'},
 g:{runs:[{run:'Run 1: feed low, coolant A',y1:'25.028',y2:'25.005',y3:'24.995',y4:'25.018',y5:'25.024'},
  {run:'Run 2: feed low, coolant B',y1:'25.000',y2:'25.011',y3:'25.017',y4:'25.002',y5:'24.994'},
  {run:'Run 3: feed high, coolant A',y1:'25.021',y2:'25.020',y3:'25.028',y4:'25.006',y5:'25.012'},
  {run:'Run 4: feed high, coolant B',y1:'24.983',y2:'24.968',y3:'24.998',y4:'25.004',y5:'24.984'}]}}
}
