{
slug:'kpi-dashboard-builder',
sections:[
 {type:'fields',title:'The dashboard',cols:3,hint:'A dashboard is for the people who act on it. Say whose it is and how often it is reviewed. Periods are listed oldest first.',fields:[
  {id:'name',label:'Dashboard',wide:true,ph:'e.g. Plant operations dashboard'},
  {id:'owner',label:'Reviewed by',ph:'e.g. Plant leadership team'},
  {id:'freq',label:'Review frequency',ph:'e.g. Monthly'},
  {id:'band',label:'Default amber band %',type:'number',min:0,max:50,ph:'5',hint:'Used when a KPI has no red limit of its own.'},
  {id:'per',label:'Periods, oldest first, separated by commas',wide:true,ph:'e.g. Apr, May, Jun, Jul, Aug, Sep'}]},
 {type:'grid',id:'ob',title:'Objectives (OKRs) the measures serve',rows:3,hint:'The objectives each measure should move: an objective and its key result, in the OKR style, or a strategic goal. Give each a short ID; the KPIs below link to it.',cols:[
  {id:'id',label:'ID',w:50},
  {id:'o',label:'Objective',w:240,type:'textarea',rows:1},
  {id:'kr',label:'Key result: measurable, with a date',w:240,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:110}]},
 {type:'grid',id:'k',title:'KPIs',rows:4,hint:'<b>Leading</b> measures move first and can still be influenced (training done, schedule attainment); <b>lagging</b> measures report the result (on-time delivery, complaints). <b>Green</b> meets the target; <b>red</b> is beyond the red limit; <b>amber</b> is between. Values are one per period, oldest first, separated by commas; the last is the actual.',cols:[
  {id:'m',label:'KPI',w:170,type:'textarea',rows:1},
  {id:'ob',label:'Objective ID',w:56},
  {id:'ll',label:'Type',type:'select',opts:['Leading','Lagging']},
  {id:'dir',label:'Better when',type:'select',opts:['Higher','Lower']},
  {id:'t',label:'Target',type:'number'},
  {id:'red',label:'Red limit',type:'number',tip:'Worse than this is red. Blank: target minus (or plus) the default amber band.'},
  {id:'v',label:'Values, oldest first',w:190},
  {id:'who',label:'Owner',w:100},
  {id:'act',label:'Actual',calc:function(r,api){ var s=window.TOOL._s(r,api); return s?window.TOOL._f(s.a):''; }},
  {id:'st',label:'Status',calc:function(r,api){ var s=window.TOOL._s(r,api); return s&&s.st?'<span class="kp-p '+s.st+'">'+{G:'Green',A:'Amber',R:'Red'}[s.st]+'</span>':''; }},
  {id:'tr',label:'Trend',calc:function(r,api){ var s=window.TOOL._s(r,api); return s?{up:'&#9650; improving',down:'&#9660; worsening',flat:'&#9644; flat','':'—'}[s.tr]:''; }}]},
 {type:'custom',id:'dash',title:'Dashboard',hint:'One tile per KPI: the actual, the target and the run of values. The dashed line is the target; the dotted line is the red limit.',html:'<div class="kp-tiles"></div><div class="stat kp-stat"></div>'},
 {type:'custom',id:'los',title:'Line of sight',hint:'Each objective with the measures that track it. An objective with no leading measure can only be watched, not steered; a measure with no objective may not be worth the effort of collecting.',html:'<div class="svgw kp-los"></div>'},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out kp-out"></div>'}
],
_f:function(x){ return isFinite(x)?Number(x).toLocaleString('en-US',{maximumFractionDigits:2}):'—'; },
_vals:function(r){ return String(r.v||'').split(/[,;\s]+/).filter(function(x){return x!=='';}).map(function(x){return Number(x);}); },
_s:function(r,api){
 var v=window.TOOL._vals(r).filter(function(x){return isFinite(x);}); if(!v.length||!r.m) return null;
 var S=api.state(), t=api.num(r.t), band=api.num(S.f.band); if(isNaN(band)||band<0) band=5;
 var lo=r.dir==='Lower', a=v[v.length-1], red=api.num(r.red), st='';
 if(isNaN(red)&&!isNaN(t)) red=lo?t+Math.abs(t)*band/100:t-Math.abs(t)*band/100;
 if(!isNaN(t)) st=lo?(a<=t?'G':a>red?'R':'A'):(a>=t?'G':a<red?'R':'A');
 var tr='', slope=NaN, n=v.length;
 if(n>=3){ var mx=(n-1)/2, my=v.reduce(function(s,x){return s+x;},0)/n, sxy=0, sxx=0; v.forEach(function(y,i){ sxy+=(i-mx)*(y-my); sxx+=(i-mx)*(i-mx); }); slope=sxy/sxx;
  var ch=slope*(n-1), thr=isNaN(t)||isNaN(red)?Math.abs(my)*0.025:Math.abs(t-red)/2; if(!(thr>0)) thr=1e-9;
  var good=lo?-ch:ch; tr=good>thr?'up':good<-thr?'down':'flat'; }
 var runR=0; if(!isNaN(t)) for(var i=n-1;i>=0;i--){ var x=v[i], s=lo?(x<=t?'G':x>red?'R':'A'):(x>=t?'G':x<red?'R':'A'); if(s==='R') runR++; else break; }
 return {v:v,a:a,t:t,red:red,st:st,tr:tr,slope:slope,runR:runR,lo:lo}; },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, esc=api.esc, f=[];
 var K=S.g.k.filter(function(r){return r.m;}).map(function(r){ return {r:r,s:T._s(r,api)}; });
 var OB=S.g.ob.filter(function(r){return r.o||r.id;}), ids=OB.map(function(o){return String(o.id||'').trim().toUpperCase();});
 var per=String(F.per||'').split(/\s*,\s*/).filter(Boolean);
 var col={G:'#1F8C55',A:'#D8B147',R:'#C0392B','':'#7C8B99'};
 /* tiles */
 var tiles=root.querySelector('.kp-tiles');
 tiles.innerHTML=K.map(function(x){ var s=x.s, r=x.r; if(!s) return '<div class="kp-t"><h4>'+esc(r.m)+'</h4><p class="kp-e">No values yet.</p></div>';
  var W=220, H=70, P=8, all=s.v.concat(isNaN(s.t)?[]:[s.t]).concat(isNaN(s.red)?[]:[s.red]), mn=Math.min.apply(null,all), mx=Math.max.apply(null,all); if(mx===mn){ mx+=1; mn-=1; }
  var X=function(i){ return P+(s.v.length>1?i*(W-2*P)/(s.v.length-1):(W-2*P)/2); }, Y=function(y){ return H-P-(y-mn)/(mx-mn)*(H-2*P); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Trend of '+esc(r.m)+'">';
  if(!isNaN(s.red)) g+='<line x1="'+P+'" x2="'+(W-P)+'" y1="'+Y(s.red)+'" y2="'+Y(s.red)+'" stroke="#C0392B" stroke-width="1" stroke-dasharray="2 3"/>';
  if(!isNaN(s.t)) g+='<line x1="'+P+'" x2="'+(W-P)+'" y1="'+Y(s.t)+'" y2="'+Y(s.t)+'" stroke="#1F8C55" stroke-width="1.2" stroke-dasharray="6 4"/>';
  g+='<polyline fill="none" stroke="#0F3E68" stroke-width="2" stroke-linejoin="round" points="'+s.v.map(function(y,i){return X(i).toFixed(1)+','+Y(y).toFixed(1);}).join(' ')+'"/>';
  g+='<circle cx="'+X(s.v.length-1)+'" cy="'+Y(s.a)+'" r="4.5" fill="'+col[s.st]+'" stroke="#fff" stroke-width="1.5"/></svg>';
  return '<div class="kp-t" style="border-left-color:'+col[s.st]+'"><h4>'+esc(r.m)+'</h4><div class="kp-n"><b>'+window.TOOL._f(s.a)+'</b><span>target '+(r.dir==='Lower'?'&le; ':'&ge; ')+(isNaN(s.t)?'—':window.TOOL._f(s.t))+'</span></div>'+g+'<div class="kp-f"><span>'+esc(r.ll||'—')+(r.ob?' · '+esc(r.ob):'')+'</span><span>'+{up:'&#9650; improving',down:'&#9660; worsening',flat:'&#9644; flat','':''}[s.tr]+'</span></div></div>'; }).join('');
 var cnt={G:0,A:0,R:0}; K.forEach(function(x){ if(x.s&&x.s.st) cnt[x.s.st]++; });
 root.querySelector('.kp-stat').innerHTML=K.length?'<div><b>'+K.length+'</b><span>KPIs</span></div><div><b style="color:#1F8C55">'+cnt.G+'</b><span>Green</span></div><div><b style="color:#9C7C1F">'+cnt.A+'</b><span>Amber</span></div><div><b style="color:#C0392B">'+cnt.R+'</b><span>Red</span></div><div><b>'+K.filter(function(x){return x.r.ll==='Leading';}).length+' : '+K.filter(function(x){return x.r.ll==='Lagging';}).length+'</b><span>Leading : lagging</span></div>':'';
 /* line of sight */
 var los=root.querySelector('.kp-los'), groups=OB.map(function(o){ var id=String(o.id||'').trim().toUpperCase(); return {o:o,id:id,k:K.filter(function(x){return String(x.r.ob||'').trim().toUpperCase()===id&&id;})}; });
 var orphan=K.filter(function(x){ var id=String(x.r.ob||'').trim().toUpperCase(); return !id||ids.indexOf(id)<0; });
 if(orphan.length) groups.push({o:{o:'No objective'},id:'?',k:orphan,orph:true});
 if(groups.length&&(K.length||OB.length)){
  var W2=760, rh=24, y=8, g2='', L1=10, W1=300, L2=400, cut=function(s,n){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;};
  groups.forEach(function(gp){ var nk=Math.max(gp.k.length,1), h=nk*rh+8, cy=y+h/2;
   g2+='<rect x="'+L1+'" y="'+(y+2)+'" width="'+W1+'" height="'+(h-4)+'" fill="'+(gp.orph?'#FBEDEB':'#F4F6F8')+'" stroke="'+(gp.orph?'#C0392B':'#0F3E68')+'"/><text x="'+(L1+10)+'" y="'+(cy+4)+'"><tspan class="b">'+esc(gp.orph?'':gp.o.id||'')+'</tspan> '+esc(cut(gp.o.o,gp.orph?40:38))+'</text>';
   if(!gp.k.length) g2+='<text class="ax" x="'+L2+'" y="'+(cy+4)+'" style="fill:#C0392B">NO MEASURE</text>';
   gp.k.forEach(function(x,i){ var ky=y+4+i*rh+rh/2; g2+='<path d="M'+(L1+W1)+','+cy+' C'+(L1+W1+45)+','+cy+' '+(L2-45)+','+ky+' '+(L2-8)+','+ky+'" fill="none" stroke="#C6CDD3" stroke-width="1.4"/><circle cx="'+(L2)+'" cy="'+ky+'" r="6" fill="'+col[x.s?x.s.st:'']+'"/><text x="'+(L2+12)+'" y="'+(ky+4)+'">'+esc(cut(x.r.m,40))+'</text><text class="ax" x="'+(W2-8)+'" y="'+(ky+4)+'" text-anchor="end">'+(x.r.ll?x.r.ll.toUpperCase():'TYPE?')+'</text>'; });
   y+=h+6; });
  los.innerHTML='<svg viewBox="0 0 '+W2+' '+(y+4)+'" role="img" aria-label="Line of sight from objectives to KPIs"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.b{font-weight:800;fill:#0F3E68}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>'+g2+'</svg>'; los.style.display='';
 } else { los.innerHTML=''; los.style.display='none'; }
 /* checks */
 if(!K.length&&!OB.length){ root.querySelector('.kp-out').innerHTML=api.flags([],'Add objectives and KPIs, and the checks appear here.'); return; }
 if(K.length) f.push([cnt.R?'':'ok',K.length+' KPIs: '+cnt.G+' green, '+cnt.A+' amber, '+cnt.R+' red.']);
 if(K.length>12) f.push(['warn',K.length+' KPIs. A dashboard with more than about a dozen measures gets looked at, not used. Keep the vital few here and move the rest to the owners\' own reports.']);
 K.forEach(function(x){ var r=x.r, s=x.s, id='<b>'+esc(r.m)+'</b>', oid=String(r.ob||'').trim().toUpperCase();
  if(!s){ f.push(['warn',id+' has no values.']); return; }
  if(isNaN(s.t)) f.push(['warn',id+' has no target, so it cannot be green, amber or red.']);
  if(!r.dir) f.push(['warn',id+': say whether higher or lower is better.']);
  if(!isNaN(api.num(r.red))&&!isNaN(s.t)&&(s.lo?api.num(r.red)<s.t:api.num(r.red)>s.t)) f.push(['warn',id+': the red limit is on the good side of the target. For "'+(s.lo?'lower':'higher')+' is better" it should be '+(s.lo?'above':'below')+' the target.']);
  if(!oid) f.push(['warn',id+' is not linked to an objective. If nobody can say which objective it serves, ask whether it is worth collecting.']);
  else if(ids.indexOf(oid)<0) f.push(['warn',id+' links to objective '+esc(r.ob)+', which is not in the list.']);
  if(!String(r.who||'').trim()) f.push(['warn',id+' has no owner. A measure nobody owns turns red and stays red.']);
  if(!r.ll) f.push(['',id+': mark it leading or lagging.']);
  if(per.length&&s.v.length!==per.length) f.push(['warn',id+' has '+s.v.length+' values for '+per.length+' periods. Check that the values line up with the periods.']);
  if(s.v.length<3) f.push(['',id+' has fewer than 3 values, too few to call a trend.']);
  if(s.st==='G'&&s.tr==='down') f.push(['warn',id+' is green but worsening. Act now, while there is still room.']);
  if(s.runR>=3&&s.tr==='up') f.push(['warn',id+' has been red for '+s.runR+' periods running, though it is improving. Check whether the current pace reaches the target in time; if the target is a year-end goal, set interim targets for each period.']);
  else if(s.runR>=3) f.push(['warn',id+' has been red for '+s.runR+' periods running. It needs a problem-solving project or a review of the target, not another month of watching.']);
  else if(s.st==='R'&&s.tr==='up') f.push(['',id+' is red but improving. Check whether the current pace reaches the target in time.']);
  if(s.st==='A'&&s.tr==='down') f.push(['warn',id+' is amber and worsening.']); });
 OB.forEach(function(o){ var id=String(o.id||'').trim().toUpperCase(), ks=K.filter(function(x){return String(x.r.ob||'').trim().toUpperCase()===id&&id;}), lab='<b>'+esc(o.id||'?')+'</b> '+esc(String(o.o||'').slice(0,60));
  if(!id) f.push(['warn','An objective has no ID, so no KPI can link to it.']);
  if(!ks.length) f.push(['warn',lab+' has no KPI. Nothing on the dashboard shows whether it is being achieved.']);
  else if(!ks.some(function(x){return x.r.ll==='Leading';})) f.push(['warn',lab+' has only lagging measures. By the time they move it is too late to act; add a leading measure that predicts them.']);
  else if(!ks.some(function(x){return x.r.ll==='Lagging';})) f.push(['',lab+' has only leading measures. Add the lagging result they are meant to drive, to check that they do.']);
  if(!o.kr) f.push(['',lab+' has no key result. An OKR names the measurable result and the date.']); });
 f.push(['','The trend calls a change only when the fitted line moves more than half the amber band across the periods shown. It is a prompt, not a test: to tell a real shift from noise, plot the measure on a control chart.']);
 root.querySelector('.kp-out').innerHTML=api.flags(f);
},
example:{f:{name:'Instrument assembly plant: operations dashboard',owner:'Plant leadership team',freq:'Monthly, first Tuesday',band:'5',per:'Apr, May, Jun, Jul, Aug, Sep'},
 g:{ob:[
  {id:'O1',o:'Customers get complete orders when promised',kr:'On-time in-full delivery at 97% or better from December 2026',who:'Operations manager'},
  {id:'O2',o:'Cut the cost of poor quality',kr:'Cost of poor quality below 2.0% of sales in Q4 2026',who:'Quality manager'},
  {id:'O3',o:'Every operator can lead a structured problem solve',kr:'80% of operators complete A3 training and one A3 by December 2026',who:'HR and training lead'}],
 k:[
  {m:'On-time in-full delivery %',ob:'O1',ll:'Lagging',dir:'Higher',t:'97',red:'93',v:'91.5, 92.8, 94.0, 94.6, 95.3, 96.1',who:'Operations manager'},
  {m:'Schedule attainment %',ob:'O1',ll:'Leading',dir:'Higher',t:'95',red:'90',v:'96, 95.5, 94, 93, 92.5, 91',who:'Production planner'},
  {m:'Cost of poor quality, % of sales',ob:'O2',ll:'Lagging',dir:'Lower',t:'2.0',red:'3.0',v:'3.4, 3.3, 3.1, 3.2, 3.1, 3.2',who:'Quality manager'},
  {m:'First-pass yield, final test %',ob:'O2',ll:'Leading',dir:'Higher',t:'98',red:'96',v:'97.9, 98.2, 98.4, 98.1, 98.3, 98.5',who:'Test engineering lead'},
  {m:'Customer complaints per month',ob:'O2',ll:'Lagging',dir:'Lower',t:'4',red:'8',v:'1, 2, 2, 3, 3, 4',who:'Customer quality engineer'},
  {m:'Operators A3-trained %',ob:'O3',ll:'Leading',dir:'Higher',t:'80',red:'50',v:'10, 18, 25, 33, 41, 48',who:'HR and training lead'},
  {m:'Near-miss reports per month',ob:'',ll:'Leading',dir:'Higher',t:'10',red:'',v:'6, 8, 7, 9, 11, 12',who:''}]}}
}
