{
slug:'heijunka-leveling',
COL:['#0F3E68','#D8B147','#1F8C55','#C0392B','#7A4E9C','#4A90C2','#C76B1E','#4A5D71'],
gcd:function(a,b){ while(b){ var t=b; b=a%b; a=t; } return a; },
calc:function(api){
 var T=window.TOOL, S=api.state(), n=api.num, days=n(S.f.days), av=n(S.f.av), cont=/^Containers/.test(S.f.unit||''), rep=n(S.f.rep), P=[], used={};
 S.g.p.forEach(function(r,i){ var D=n(r.d); if(!r.nm&&isNaN(D)) return;
  var code=(r.c||'').trim().toUpperCase().slice(0,2)||String.fromCharCode(65+P.length), pk=n(r.pk);
  var q=isNaN(D)?NaN:(cont?(pk>0?Math.ceil(D/pk-1e-9):NaN):D);
  P.push({i:i,code:code,nm:(r.nm||'').trim()||code,D:D,pk:pk,q:q}); });
 var ok=days>0&&P.length&&P.every(function(p){return p.q>=0&&p.q%1===0;});
 if(!ok) return {ok:false,P:P,cont:cont,days:days};
 P.forEach(function(p){ p.e=p.q/days; p.d=Math.round(p.e); p.days=[]; for(var j=1;j<=days;j++) p.days.push(Math.floor(j*p.q/days+1e-9)-Math.floor((j-1)*p.q/days+1e-9)); });
 var g=0; P.forEach(function(p){ if(p.d>0) g=T.gcd(g,p.d); });
 var r=rep>0&&rep%1===0?rep:g, auto=!(rep>0&&rep%1===0);
 P.forEach(function(p){ p.p=r>0?(p.d>0?Math.max(1,Math.round(p.d/r)):0):0; p.out=p.p*r*days; p.diff=p.out-p.q; });
 var L=P.reduce(function(s,p){return s+p.p;},0), seq=[], x=P.map(function(){return 0;});
 /* goal chasing: at slot k put the product furthest behind its even share k*p/L */
 for(var k=1;k<=L;k++){ var best=-1, gap=-Infinity; P.forEach(function(p,j){ var d=k*p.p/L-x[j]; if(d>gap+1e-12){ gap=d; best=j; } }); x[best]++; seq.push(best); }
 var tot=P.reduce(function(s,p){return s+p.e;},0);
 return {ok:true,P:P,cont:cont,days:days,g:g,r:r,auto:auto,L:L,seq:seq,tot:tot,takt:av>0&&tot>0?av*60/tot:NaN,av:av};
},
sections:[
 {type:'fields',title:'Period and capacity',cols:3,hint:'Heijunka levels both the volume and the mix: instead of running all of A, then all of B, the line makes a little of each product in a short pattern that repeats through the day. Level in units, or in containers if each kanban card is one container.',fields:[
  {id:'per',label:'Period',ph:'e.g. Week 42'},
  {id:'days',label:'Working days in the period',type:'number',min:1},
  {id:'av',label:'Available time per day (min)',type:'number',min:0},
  {id:'unit',label:'Level by',type:'select',opts:['Units','Containers (pack-out quantity)']},
  {id:'rep',label:'Pattern repeats per day',type:'number',min:1,hint:'Optional. Blank gives the shortest pattern that meets the daily quantities exactly.'},
  {id:'line',label:'Line or cell',ph:'e.g. Final assembly line 1'}]},
 {type:'grid',id:'p',title:'Products and demand',rows:3,hint:'Demand for the whole period, in units. The code is the letter used in the pattern. The pack-out quantity is needed only when leveling by containers.',cols:[
  {id:'c',label:'Code',w:50},
  {id:'nm',label:'Product',w:170},
  {id:'d',label:'Demand in period (units)',type:'number',min:0},
  {id:'pk',label:'Pack-out qty',type:'number',min:1},
  {id:'e',label:'Per day',calc:function(r,api){ var c=window.TOOL.calc(api), i=api.state().g.p.indexOf(r), p=c.ok&&c.P.filter(function(x){return x.i===i;})[0]; return p?api.fmt(p.e,2):''; }},
  {id:'pp',label:'In pattern',calc:function(r,api){ var c=window.TOOL.calc(api), i=api.state().g.p.indexOf(r), p=c.ok&&c.P.filter(function(x){return x.i===i;})[0]; return p?p.p:''; }}]},
 {type:'custom',id:'res',title:'Leveled pattern',html:'<div class="stat hj-stat"></div><div class="svgw hj-svg"></div><div class="tgw"><table class="tg hj-tab"></table></div>'},
 {type:'custom',id:'day',title:'Day-by-day quantities',hint:'Each product\'s period demand spread as evenly as whole numbers allow: the running total at the end of each day stays within one of the exact share.',html:'<div class="tgw"><table class="tg hj-days"></table></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out hj-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, c=T.calc(api), F=api.fmt, E=api.esc, f=[], u=c.cont?'containers':'units', st=root.querySelector('.hj-stat'), sv=root.querySelector('.hj-svg'), tb=root.querySelector('.hj-tab'), dt=root.querySelector('.hj-days');
 if(!c.ok){ st.innerHTML=''; sv.innerHTML=''; tb.innerHTML=''; dt.innerHTML='';
  if(!(c.days>0)) f.push(['warn','Enter the number of working days in the period.']);
  c.P.forEach(function(p){ if(isNaN(p.D)) f.push(['warn','<b>'+E(p.nm)+'</b> has no demand.']); else if(c.cont&&!(p.pk>0)) f.push(['warn','<b>'+E(p.nm)+'</b> needs a pack-out quantity to level by containers.']); else if(p.q%1) f.push(['warn','<b>'+E(p.nm)+'</b>: demand must be a whole number.']); });
  root.querySelector('.hj-out').innerHTML=api.flags(f,'Enter the period and the products, and the pattern appears here.'); return; }
 var P=c.P, pat=c.seq.map(function(j){return P[j].code;}), multi=P.some(function(p){return p.code.length>1;}), ps=pat.join(multi?' ':'');
 var dTot=P.reduce(function(s,p){return s+p.p*c.r;},0);
 st.innerHTML='<div><b>'+F(c.tot,c.tot%1?2:0)+'</b><span>'+u+' per day</span></div>'+(isNaN(c.takt)?'':'<div><b>'+F(c.takt,1)+' s'+(c.takt>=120?' ('+F(c.takt/60,1)+' min)':'')+'</b><span>'+(c.cont?'Pitch, one container every':'Takt, one unit every')+'</span></div>')+'<div><b>'+c.L+'</b><span>Pattern length, '+u+'</span></div><div><b>'+c.r+'</b><span>Pattern repeats per day</span></div>';
 /* picture: one pattern, then a day batched vs leveled */
 var W=760, L=110, R=16, cw=Math.min(36,(W-L-R)/Math.max(1,pat.length)), showN=Math.min(pat.length,Math.floor((W-L-R)/cw)), y0=36;
 var g='<svg viewBox="0 0 '+W+' 208" role="img" aria-label="Leveled pattern"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:700 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lt{font:800 12px \'IBM Plex Mono\',monospace;fill:#fff}</style>';
 g+='<text class="ax" x="'+L+'" y="20">ONE PATTERN ('+c.L+' '+u.toUpperCase()+'), REPEATED '+c.r+'&times; A DAY</text>';
 pat.slice(0,showN).forEach(function(cd,k){ var j=c.seq[k], col=T.COL[j%T.COL.length], x=L+k*cw; g+='<rect x="'+x+'" y="'+y0+'" width="'+(cw-2)+'" height="28" fill="'+col+'"/>'+(cw>=14?'<text class="lt" x="'+(x+cw/2-1)+'" y="'+(y0+18)+'" text-anchor="middle"'+(j%T.COL.length===1?' style="fill:#231A05"':'')+'>'+E(cd)+'</text>':''); });
 if(showN<pat.length) g+='<text class="ax" x="'+(W-R)+'" y="'+(y0+44)+'" text-anchor="end">+'+(pat.length-showN)+' MORE</text>';
 g+='<text x="'+(L-8)+'" y="'+(y0+18)+'" text-anchor="end">Pattern</text>';
 var bw=W-L-R, day=P.map(function(p){return p.p*c.r;}), dsum=day.reduce(function(a,b){return a+b;},0), yb=y0+68, yl=yb+50;
 g+='<text class="ax" x="'+L+'" y="'+(yb-8)+'">ONE DAY, BATCHED BY PRODUCT</text><text x="'+(L-8)+'" y="'+(yb+15)+'" text-anchor="end">Batched</text>';
 var x=L; P.forEach(function(p,j){ var w=dsum?day[j]/dsum*bw:0; if(w>0) g+='<rect x="'+x+'" y="'+yb+'" width="'+w+'" height="22" fill="'+T.COL[j%T.COL.length]+'"/>'; x+=w; });
 g+='<text class="ax" x="'+L+'" y="'+(yl-8)+'">ONE DAY, LEVELED</text><text x="'+(L-8)+'" y="'+(yl+15)+'" text-anchor="end">Leveled</text>';
 var unitW=dsum?bw/dsum:0, k2=0; for(var rr=0;rr<c.r;rr++) c.seq.forEach(function(j){ g+='<rect x="'+(L+k2*unitW)+'" y="'+yl+'" width="'+Math.max(0.6,unitW-(unitW>3?0.6:0))+'" height="22" fill="'+T.COL[j%T.COL.length]+'"/>'; k2++; });
 var lx=L; P.forEach(function(p,j){ g+='<rect x="'+lx+'" y="'+(yl+34)+'" width="10" height="10" fill="'+T.COL[j%T.COL.length]+'"/><text x="'+(lx+14)+'" y="'+(yl+43)+'">'+E(p.code)+' '+E(p.nm.length>14?p.nm.slice(0,13)+'…':p.nm)+'</text>'; lx+=Math.min(170,(W-L)/P.length); });
 sv.innerHTML=g+'</svg>';
 tb.innerHTML='<thead><tr><th>Code</th><th>Product</th><th>Demand, '+u+'</th><th>Exact per day</th><th>Per day in plan</th><th>In each pattern</th><th>Pattern output in period</th><th>Difference</th></tr></thead><tbody>'+P.map(function(p){ return '<tr'+(p.diff?' class="hi-row"':'')+'><td class="calc">'+E(p.code)+'</td><td>'+E(p.nm)+'</td><td class="calc">'+F(p.q,0)+'</td><td class="calc">'+F(p.e,2)+'</td><td class="calc">'+(p.p*c.r)+'</td><td class="calc">'+p.p+'</td><td class="calc">'+F(p.out,0)+'</td><td class="calc">'+(p.diff>0?'+':'')+F(p.diff,0)+'</td></tr>'; }).join('')+'</tbody>';
 dt.innerHTML='<thead><tr><th>Code</th>'+P[0].days.map(function(_,j){return '<th>Day '+(j+1)+'</th>';}).join('')+'<th>Total</th></tr></thead><tbody>'+P.map(function(p){ return '<tr><td class="calc">'+E(p.code)+'</td>'+p.days.map(function(v){return '<td class="calc">'+v+'</td>';}).join('')+'<td class="calc">'+F(p.q,0)+'</td></tr>'; }).join('')+'<tr><td class="calc">All</td>'+P[0].days.map(function(_,j){ return '<td class="calc">'+P.reduce(function(s,p){return s+p.days[j];},0)+'</td>'; }).join('')+'<td class="calc">'+F(P.reduce(function(s,p){return s+p.q;},0),0)+'</td></tr></tbody>';
 /* checks */
 f.push(['','Pattern: <b style="font-family:\'IBM Plex Mono\',monospace;letter-spacing:.06em">'+E(ps.length>90?ps.slice(0,89)+'…':ps)+'</b>, run '+c.r+' time'+(c.r>1?'s':'')+' a day.']);
 var off=P.filter(function(p){return p.diff!==0;});
 if(off.length) f.push(['warn','The pattern does not match demand exactly: '+off.map(function(p){ return '<b>'+E(p.code)+'</b> '+(p.diff>0?'+':'')+F(p.diff,0)+' '+u+' ('+(p.diff>0?'+':'')+F(p.q?p.diff/p.q*100:0,1)+'%)'; }).join(', ')+' over the period. Use the day-by-day quantities, or adjust the last pattern of the day.']);
 else f.push(['ok','Run '+c.r+' times a day for '+c.days+' days, the pattern makes exactly the period demand for every product.']);
 P.forEach(function(p){ if(p.e%1>1e-9&&!off.length) f.push(['','<b>'+E(p.code)+'</b>: '+F(p.q,0)+' '+u+' over '+c.days+' days is '+F(p.e,2)+' a day, so the daily quantity varies by one; see the day-by-day table.']);
  if(c.cont&&p.D%p.pk) f.push(['','<b>'+E(p.code)+'</b>: '+F(p.D,0)+' units fill '+p.q+' containers of '+F(p.pk,0)+', with '+F(p.q*p.pk-p.D,0)+' units over.']);
  if(p.d===0&&p.q>0) f.push(['','<b>'+E(p.code)+'</b> is needed less than once a day ('+F(p.e,2)+'). Schedule it on fixed days, for example every '+F(Math.round(1/p.e),0)+' days, rather than in the daily pattern.']); });
 if(c.L>30) f.push(['warn','The pattern is '+c.L+' '+u+' long. Long patterns are hard to run by hand. Set fewer repeats per day, or level by containers, to shorten it.']);
 if(c.auto&&c.r===1&&P.length>1) f.push(['','The daily quantities share no common factor, so the pattern repeats only once a day. Setting the repeats per day gives a shorter pattern with a small mismatch, which the checks above will show.']);
 if(!isNaN(c.takt)&&c.takt<1) f.push(['warn','Takt is under a second. Check the available time and the demand.']);
 root.querySelector('.hj-out').innerHTML=api.flags(f);
},
example:{f:{per:'Week 42',days:'5',av:'450',unit:'Units',rep:'',line:'Final assembly, garden pump line'},
 g:{p:[
  {c:'A',nm:'GP-100 standard pump',d:'1200',pk:'12'},
  {c:'B',nm:'GP-150 high-flow pump',d:'600',pk:'12'},
  {c:'C',nm:'GP-100S stainless pump',d:'300',pk:'6'},
  {c:'D',nm:'GP-200 twin pump',d:'300',pk:'4'}]}}
}
