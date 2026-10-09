{
slug:'alert-action-levels',
sections:[
 {type:'fields',title:'What is monitored',cols:3,hint:'Alert and action levels are set from your own history of results, below the specification or regulatory limit. An <b>alert level</b> is an early warning: a result above it calls for a closer look. An <b>action level</b> is the result that calls for an investigation and corrective action.',fields:[
  {id:'area',label:'Area or system',ph:'e.g. Cleanroom 2, final packaging'},
  {id:'param',label:'What is measured',ph:'e.g. Settle plates, CFU per plate'},
  {id:'kind',label:'Kind of data',type:'select',opts:['Counts (whole numbers)','Measurements']},
  {id:'lim',label:'Specification or regulatory limit',type:'number',hint:'The action level must not be above it. Optional.'},
  {id:'method',label:'Method used for the levels',type:'select',opts:['Percentile (empirical)','Mean + k SD (normal)','Poisson (counts)','Negative binomial (counts)']},
  {id:'period',label:'History covers',ph:'e.g. Sept 2025 to Aug 2026, 60 results'},
  {id:'pa',label:'Alert percentile, %',type:'number',min:50,max:99.99,hint:'Percentile, Poisson and negative binomial methods. Usual: 95.'},
  {id:'pc',label:'Action percentile, %',type:'number',min:50,max:99.99,hint:'Usual: 99.'},
  {id:'ka',label:'Alert k (mean + k SD)',type:'number',min:0,hint:'Usual: 2.'},
  {id:'kc',label:'Action k (mean + k SD)',type:'number',min:0,hint:'Usual: 3.'}]},
 {type:'fields',title:'Historical results',hint:'At least 30 results from a period when the area or system was in control; a year of routine data is better, so seasonal changes are included. Leave out results from known upsets that were investigated and corrected.',fields:[
  {id:'hist',label:'Results, ten to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'},{label:'6'},{label:'7'},{label:'8'},{label:'9'},{label:'10'}],rows:6,minRows:3}]},
 {type:'custom',id:'lv',title:'Levels from the history',hint:'All four methods, for comparison. The highlighted row is the method chosen in section 1, and it is the one used below. A result <b>above</b> a level is an excursion.',html:'<div class="stat aa-stat"></div><div class="tgw"><table class="tg aa-tab"></table></div>'},
 {type:'grid',id:'n',title:'New results',rows:4,hint:'Enter results in time order. The location lets the tool spot repeated alerts at one place.',cols:[
  {id:'d',label:'Date',type:'date'},
  {id:'loc',label:'Location or sample point',w:120},
  {id:'v',label:'Result',type:'number'},
  {id:'st',label:'Status',calc:function(r,api){ var T=window.TOOL, L=T._lv, v=api.num(r.v); if(!L||isNaN(v)) return ''; return v>L.c?'<b style="color:#C0392B">ACTION</b>':v>L.a?'<b style="color:#9C7C1F">ALERT</b>':'<span style="color:#1E7B4F">OK</span>'; }},
  {id:'note',label:'Note or investigation reference',w:200}]},
 {type:'custom',id:'ch',title:'Run chart',hint:'History in gray, then the new results. Gold dashed line: alert level. Red line: action level.',html:'<div class="svgw aa-svg"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="stat aa-ns"></div><div class="out aa-out"></div>'}
],
lgam:function(x){ var c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 if(x<0.5) return Math.log(Math.PI/Math.abs(Math.sin(Math.PI*x)))-this.lgam(1-x); x-=1; var a=c[0], t=x+7.5; for(var i=1;i<9;i++) a+=c[i]/(x+i); return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a); },
ppf:function(q,lp,cap){ var cdf=0; for(var k=0;k<=cap;k++){ cdf+=Math.exp(lp(k)); if(cdf>=q-1e-12) return k; } return NaN; },
poisPpf:function(q,lam){ var T=this; if(lam<=0) return 0; return T.ppf(q,function(k){ return -lam+k*Math.log(lam)-T.lgam(k+1); },Math.ceil(lam+60*Math.sqrt(lam)+200)); },
nbPpf:function(q,r,p){ var T=this; var m=r*(1-p)/p, sd=Math.sqrt(m/p); return T.ppf(q,function(k){ return T.lgam(k+r)-T.lgam(r)-T.lgam(k+1)+r*Math.log(p)+k*Math.log(1-p); },Math.ceil(m+80*sd+200)); },
binomSf:function(x,n,p){ var T=this, s=0; if(x<=0) return 1; if(p<=0) return 0; if(p>=1) return 1; for(var k=x;k<=n;k++) s+=Math.exp(T.lgam(n+1)-T.lgam(k+1)-T.lgam(n-k+1)+k*Math.log(p)+(n-k)*Math.log(1-p)); return Math.min(1,s); },
normSf:function(z){ var x=Math.abs(z)/Math.SQRT2, t=1/(1+0.5*x), y=t*Math.exp(-x*x-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277))))))))); var erfc=y; return z>=0?erfc/2:1-erfc/2; },
update:function(root,api){
 var S=api.state(), F=S.f, n=api.num, T=window.TOOL, f=[];
 var raw=(F.hist||'').split(/[\s,;]+/).filter(Boolean), x=[], bad=[];
 raw.forEach(function(t){ var v=Number(t); if(isFinite(v)) x.push(v); else bad.push(t); });
 var st=root.querySelector('.aa-stat'), tb=root.querySelector('.aa-tab'), svg=root.querySelector('.aa-svg'), ns=root.querySelector('.aa-ns'), out=root.querySelector('.aa-out');
 var counts=(F.kind||'Counts (whole numbers)')!=='Measurements';
 if(bad.length) f.push(['warn','Not numbers, ignored: '+bad.slice(0,8).map(api.esc).join(', ')+'.']);
 T._lv=null;
 if(x.length<3){ st.innerHTML=''; tb.innerHTML=''; svg.innerHTML=''; ns.innerHTML=''; out.innerHTML=api.flags(f,'Enter at least 30 historical results to set the levels.'); root.querySelectorAll('td[data-c="st"]').forEach(function(td){ td.innerHTML=''; }); return; }
 var N=x.length, s=x.slice().sort(function(a,b){return a-b;}), mean=x.reduce(function(a,b){return a+b;},0)/N;
 var vr=x.reduce(function(a,b){return a+(b-mean)*(b-mean);},0)/(N-1), sd=Math.sqrt(vr), disp=mean>0?vr/mean:NaN, zeros=x.filter(function(v){return v===0;}).length;
 function pct(p){ var h=(N-1)*p, lo=Math.floor(h); return lo+1<N?s[lo]+(h-lo)*(s[lo+1]-s[lo]):s[N-1]; }
 var pa=n(F.pa), pc=n(F.pc), ka=n(F.ka), kc=n(F.kc); if(!(pa>0&&pa<100)) pa=95; if(!(pc>0&&pc<100)) pc=99; if(!(ka>0)) ka=2; if(!(kc>0)) kc=3;
 var nonint=x.some(function(v){ return v<0||v%1!==0; });
 var M={};
 M.pct={nm:'Percentile (empirical)',a:pct(pa/100),c:pct(pc/100),how:pa+'th and '+pc+'th percentiles of the history'};
 M.norm={nm:'Mean + k SD (normal)',a:mean+ka*sd,c:mean+kc*sd,how:'mean + '+ka+'s and mean + '+kc+'s'};
 if(counts&&!nonint){
  M.pois={nm:'Poisson (counts)',a:T.poisPpf(pa/100,mean),c:T.poisPpf(pc/100,mean),how:'smallest count c with P(X &le; c) &ge; '+pa+'% and '+pc+'%, &lambda; = mean'};
  if(disp>1){ var r=mean*mean/(vr-mean), p=mean/vr; M.nb={nm:'Negative binomial (counts)',a:T.nbPpf(pa/100,r,p),c:T.nbPpf(pc/100,r,p),how:'fitted by moments: r = '+api.fmt(r,3)+', p = '+api.fmt(p,4),r:r,p:p}; }
  else M.nb={nm:'Negative binomial (counts)',a:M.pois.a,c:M.pois.c,how:'variance not above the mean, so it reduces to Poisson'};
 }
 var key={'Percentile (empirical)':'pct','Mean + k SD (normal)':'norm','Poisson (counts)':'pois','Negative binomial (counts)':'nb'}[F.method||'Percentile (empirical)']||'pct';
 if(!M[key]){ f.push(['warn','The '+api.esc(F.method)+' method needs whole-number counts; the percentile method is used instead.']); key='pct'; }
 var L=M[key]; T._lv=L;
 function above(lv){ return x.filter(function(v){ return v>lv; }).length; }
 function fx(v){ return counts&&v%1===0?api.fmt(v,0):api.fmt(v,2); }
 st.innerHTML='<div><b>'+N+'</b><span>Historical results</span></div><div><b>'+api.fmt(mean,3)+'</b><span>Mean</span></div><div><b>'+api.fmt(sd,3)+'</b><span>Std dev (s)</span></div>'+(counts?'<div><b>'+(isFinite(disp)?api.fmt(disp,2):'—')+'</b><span>Variance / mean</span></div><div><b>'+api.fmt(100*zeros/N,0)+'%</b><span>Zero results</span></div>':'')+'<div><b>'+fx(s[N-1])+'</b><span>Largest</span></div>';
 tb.innerHTML='<thead><tr><th>Method</th><th>Alert level</th><th>Action level</th>'+(counts?'<th>First count over alert</th><th>First count over action</th>':'')+'<th>History over alert</th><th>History over action</th><th>Basis</th></tr></thead><tbody>'+['pct','norm','pois','nb'].filter(function(k){return M[k];}).map(function(k){ var m=M[k];
  return '<tr'+(k===key?' class="hi-row"':'')+'><td>'+m.nm+'</td><td class="calc">'+fx(m.a)+'</td><td class="calc">'+fx(m.c)+'</td>'+(counts?'<td class="calc">'+api.fmt(Math.floor(m.a)+1,0)+'</td><td class="calc">'+api.fmt(Math.floor(m.c)+1,0)+'</td>':'')+'<td class="calc">'+api.fmt(100*above(m.a)/N,1)+'%</td><td class="calc">'+api.fmt(100*above(m.c)/N,1)+'%</td><td>'+m.how+'</td></tr>'; }).join('')+'</tbody>';
 /* the new results */
 var R=[]; S.g.n.forEach(function(r,i){ var v=n(r.v); if(!isNaN(v)) R.push({i:i,v:v,loc:(r.loc||'').trim(),d:r.d||''}); });
 root.querySelectorAll('table[data-grid="n"] tbody tr').forEach(function(tr,i){ var td=tr.querySelector('[data-c="st"]'), r=S.g.n[i], v=r?n(r.v):NaN; if(td) td.innerHTML=isNaN(v)?'':v>L.c?'<b style="color:#C0392B">ACTION</b>':v>L.a?'<b style="color:#9C7C1F">ALERT</b>':'<span style="color:#1E7B4F">OK</span>'; });
 var na=R.filter(function(r){ return r.v>L.a&&r.v<=L.c; }), nc=R.filter(function(r){ return r.v>L.c; }), nx=R.filter(function(r){ return r.v>L.a; });
 var p0=key==='norm'?T.normSf(ka):1-pa/100, ptail=R.length?T.binomSf(nx.length,R.length,p0):1;
 ns.innerHTML=R.length?'<div><b>'+fx(L.a)+'</b><span>Alert level</span></div><div><b>'+fx(L.c)+'</b><span>Action level</span></div><div><b>'+R.length+'</b><span>New results</span></div><div><b>'+na.length+'</b><span>Alert excursions</span></div><div><b>'+nc.length+'</b><span>Action excursions</span></div><div><b>'+api.fmt(100*p0,1)+'%</b><span>Expected share over alert</span></div><div><b>'+api.fmt(ptail,4)+'</b><span>P(this many or more by chance)</span></div>':'<div><b>'+fx(L.a)+'</b><span>Alert level</span></div><div><b>'+fx(L.c)+'</b><span>Action level</span></div>';
 /* chart */
 var all=x.map(function(v){return {v:v,h:1};}).concat(R.map(function(r){return {v:r.v,h:0,r:r};})), W=Math.max(640,Math.min(1400,60+all.length*9)), H=260, ml=44, mr=70, mt=14, mb=28;
 var lim=n(F.lim), ymax=Math.max.apply(null,all.map(function(p){return p.v;}).concat([L.c*1.15, L.a*1.15])); if(isFinite(lim)&&lim<=ymax*1.6) ymax=Math.max(ymax,lim*1.05); ymax=ymax||1;
 var ymin=Math.min(0,Math.min.apply(null,all.map(function(p){return p.v;})));
 var X=function(i){ return ml+(i+0.5)*(W-ml-mr)/all.length; }, Y=function(v){ return mt+(ymax-v)/(ymax-ymin)*(H-mt-mb); };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Run chart against alert and action levels"><style>text{font:10.5px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lb{font:700 10.5px \'IBM Plex Mono\',monospace}</style>';
 var step=Math.pow(10,Math.floor(Math.log10((ymax-ymin)/4||1))); var nt=(ymax-ymin)/step; if(nt>8) step*=2; if((ymax-ymin)/step>8) step*=2.5;
 for(var t=Math.ceil(ymin/step)*step;t<=ymax+1e-9;t+=step){ g+='<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+Y(t)+'" y2="'+Y(t)+'" stroke="#EEF1F4"/><text x="'+(ml-6)+'" y="'+(Y(t)+4)+'" text-anchor="end">'+api.fmt(t,step<1?1:0)+'</text>'; }
 if(R.length) g+='<line x1="'+((X(N-1)+X(N))/2)+'" x2="'+((X(N-1)+X(N))/2)+'" y1="'+mt+'" y2="'+(H-mb)+'" stroke="#8795A3" stroke-dasharray="3 3"/><text x="'+((X(N-1)+X(N))/2+4)+'" y="'+(H-mb+16)+'">NEW</text>';
 g+='<text x="'+ml+'" y="'+(H-mb+16)+'">HISTORY</text>';
 [[L.a,'#9C7C1F','6 4','ALERT'],[L.c,'#C0392B','','ACTION']].concat(isFinite(lim)&&lim<=ymax?[[lim,'#16273A','2 3','LIMIT']]:[]).forEach(function(l){ g+='<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+Y(l[0])+'" y2="'+Y(l[0])+'" stroke="'+l[1]+'" stroke-width="1.6"'+(l[2]?' stroke-dasharray="'+l[2]+'"':'')+'/><text class="lb" x="'+(W-mr+4)+'" y="'+(Y(l[0])+4)+'" style="fill:'+l[1]+'">'+l[3]+'</text>'; });
 var nl=R.length?all.slice(N).map(function(p,i){ return (i?'L':'M')+X(N+i).toFixed(1)+' '+Y(p.v).toFixed(1); }).join(' '):'';
 if(nl) g+='<path d="'+nl+'" fill="none" stroke="#0F3E68" stroke-width="1.2" opacity=".5"/>';
 all.forEach(function(p,i){ var c=p.h?'#AEB8C2':p.v>L.c?'#C0392B':p.v>L.a?'#D8B147':'#0F3E68'; g+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(p.v).toFixed(1)+'" r="'+(p.h?2.6:4)+'" fill="'+c+'"'+(p.h?'':' stroke="#16273A" stroke-width=".6"')+'>'+(p.h?'':'<title>'+api.esc((p.r.d||'')+' '+p.r.loc+': '+p.v)+'</title>')+'</circle>'; });
 svg.innerHTML=g+'</svg>';
 /* checks on the levels */
 if(N<30) f.push(['warn','Only '+N+' historical results. Levels from fewer than 30 results move a lot as data are added; treat them as provisional and recalculate when a year of data is in.']);
 if(L.a>=L.c) f.push(['warn','The alert level is not below the action level. Use a lower alert percentile or k.']);
 if(isFinite(lim)){ if(L.c>lim) f.push(['warn','The action level ('+fx(L.c)+') is above the limit ('+fx(lim)+'). Levels must sit below the limit: set the action level at or below it.']); else f.push(['ok','Both levels are below the limit of '+fx(lim)+'.']); }
 if(counts&&!nonint&&isFinite(disp)){
  if(disp>1.5) f.push([key==='pois'?'warn':'','Variance is '+api.fmt(disp,2)+' times the mean: the counts are overdispersed (clumped), as environmental counts usually are. '+(key==='pois'?'The Poisson levels are too tight and will raise false alerts; the negative binomial or percentile method fits better.':'Poisson levels would be too tight; the negative binomial allows for it.')]);
  else if(key==='nb'&&disp<=1) f.push(['','The variance is not above the mean, so the negative binomial reduces to Poisson.']); }
 if(key==='norm'&&counts) f.push(['warn','Mean + k SD assumes roughly normal, symmetric data. Counts near zero are skewed, so these levels can be misleading; compare them with the percentile or count-based rows.']);
 if(zeros===N) f.push(['','Every historical result is zero, so any recovery is an excursion. That is normal for the cleanest areas, where levels are often fixed by the limit rather than by statistics.']);
 if(key==='pct'&&N<100&&pc>=99) f.push(['','With '+N+' results, the '+pc+'th percentile is set by the top one or two values. It becomes stable only with more data.']);
 /* checks on the new results */
 if(R.length){
  nc.forEach(function(r){ f.push(['warn','<b>Action excursion</b>: '+fx(r.v)+(r.loc?' at '+api.esc(r.loc):'')+(r.d?' on '+api.esc(r.d):'')+'. Investigate: identify the organism or cause, assess product impact, correct, and record it.']); });
  var byLoc={}, trend=[]; R.forEach(function(r){ var k=r.loc||'(no location)'; (byLoc[k]=byLoc[k]||[]).push(r); });
  Object.keys(byLoc).forEach(function(k){ var a=byLoc[k], run=0, mx=0; a.forEach(function(r){ run=r.v>L.a?run+1:0; mx=Math.max(mx,run); }); if(mx>=2) trend.push(k+' ('+mx+' in a row)'); });
  if(trend.length) f.push(['warn','<b>Adverse trend</b>: consecutive results over the alert level at '+trend.map(api.esc).join(', ')+'. Repeated alerts at one location call for investigation even if none reached the action level.']);
  var last=R.slice(-10), l3=last.filter(function(r){ return r.v>L.a; }).length; if(l3>=3) f.push(['warn','<b>Adverse trend</b>: '+l3+' of the last '+last.length+' results are over the alert level.']);
  if(ptail<0.05&&nx.length) f.push(['warn',nx.length+' of '+R.length+' new results ('+api.fmt(100*nx.length/R.length,0)+'%) are over the alert level, against about '+api.fmt(100*p0,1)+'% expected. The chance of that many by chance alone is '+api.fmt(ptail,4)+', so conditions have probably changed.']);
  if(!nx.length) f.push(['ok','No new result is over the alert level.']);
 }
 f.push(['','Review the levels at least once a year, and after changes to the area, the process or the method. Levels that are never exceeded are probably too loose; levels exceeded every week are too tight to be useful.']);
 out.innerHTML=api.flags(f);
},
example:{f:{area:'Brannoc Medical, Cleanroom 2 (Grade C), final packaging',param:'Settle plates, 90 mm, 4 h exposure, CFU per plate',kind:'Counts (whole numbers)',lim:'50',method:'Negative binomial (counts)',period:'Sept 2025 to Aug 2026, 60 results, 4 sample points',pa:'95',pc:'99',ka:'2',kc:'3',
 hist:'0 1 0 2 0 0 1 3 0 1\n2 0 0 1 0 4 1 0 0 2\n1 0 3 0 1 0 0 2 1 0\n0 5 1 0 2 0 1 0 0 1\n3 0 0 1 0 2 0 7 1 0\n0 1 2 0 0 1 0 3 0 2'},
 g:{n:[
  {d:'2026-09-01',loc:'SP-01',v:'0'},{d:'2026-09-01',loc:'SP-02',v:'1'},{d:'2026-09-01',loc:'SP-03',v:'2'},{d:'2026-09-01',loc:'SP-04',v:'0'},
  {d:'2026-09-08',loc:'SP-01',v:'1'},{d:'2026-09-08',loc:'SP-02',v:'0'},{d:'2026-09-08',loc:'SP-03',v:'5'},{d:'2026-09-08',loc:'SP-04',v:'1'},
  {d:'2026-09-15',loc:'SP-01',v:'0'},{d:'2026-09-15',loc:'SP-02',v:'2'},{d:'2026-09-15',loc:'SP-03',v:'6',note:'Second alert at SP-03; door seal checked'},{d:'2026-09-15',loc:'SP-04',v:'0'},
  {d:'2026-09-22',loc:'SP-01',v:'1'},{d:'2026-09-22',loc:'SP-02',v:'0'},{d:'2026-09-22',loc:'SP-03',v:'12',note:'INV-26-031 opened'},{d:'2026-09-22',loc:'SP-04',v:'1'},
  {d:'2026-09-29',loc:'SP-01',v:'0'},{d:'2026-09-29',loc:'SP-02',v:'1'},{d:'2026-09-29',loc:'SP-03',v:'3'},{d:'2026-09-29',loc:'SP-04',v:'0'}]}}
}
