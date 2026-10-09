{
slug:'spaghetti-diagram',
COL:['#0F3E68','#C0392B','#1F8C55','#9C7C1F','#7A4E9C','#4A90C2'],
calc:function(api){
 var S=api.state(), n=api.num, man=!/^Straight/.test(S.f.rule||''), St={}, bad=[], hasP=false;
 S.g.s.forEach(function(r){ var c=(r.c||'').trim().toUpperCase(); if(!c) return; var x=n(r.x), y=n(r.y), px=n(r.px), py=n(r.py);
  if(!isNaN(px)||!isNaN(py)) hasP=true;
  St[c]={c:c,nm:(r.n||'').trim(),x:x,y:y,px:isNaN(px)?x:px,py:isNaN(py)?y:py}; });
 function d(a,b,p){ var ax=p?a.px:a.x, ay=p?a.py:a.y, bx=p?b.px:b.x, by=p?b.py:b.y, dx=Math.abs(ax-bx), dy=Math.abs(ay-by); return man?dx+dy:Math.sqrt(dx*dx+dy*dy); }
 var R=[];
 S.g.r.forEach(function(r,i){ var seq=(r.seq||'').toUpperCase().replace(/-+>/g,' ').split(/[\s,;>\u2192]+/).map(function(x){return x.trim();}).filter(Boolean); if(!seq.length) return;
  var t=n(r.t); if(!(t>=0)) t=1;
  var legs=[], one=0, oneP=0;
  for(var k=1;k<seq.length;k++){ var a=St[seq[k-1]], b=St[seq[k]];
   if(!a||isNaN(a.x)||isNaN(a.y)){ bad.push(seq[k-1]); continue; } if(!b||isNaN(b.x)||isNaN(b.y)){ bad.push(seq[k]); continue; }
   var L=d(a,b,false), LP=d(a,b,true); legs.push({a:a.c,b:b.c,L:L,LP:LP}); one+=L; oneP+=LP; }
  R.push({i:i,who:(r.w||'').trim()||('Route '+(i+1)),seq:seq,t:t,legs:legs,one:one,oneP:oneP,day:one*t,dayP:oneP*t}); });
 var tot=R.reduce(function(s,r){return s+r.day;},0), totP=R.reduce(function(s,r){return s+r.dayP;},0);
 return {St:St,R:R,man:man,tot:tot,totP:totP,hasP:hasP,bad:bad};
},
sections:[
 {type:'fields',title:'The area',cols:3,hint:'A spaghetti diagram traces the path people or material actually take through an area. Give each station a position (x across, y down, in feet or meters from one corner of the area), then list the routes as station codes in order.',fields:[
  {id:'area',label:'Area',wide:true,ph:'e.g. Sample-prep lab, building 3'},
  {id:'unit',label:'Unit',type:'select',opts:['feet','meters']},
  {id:'rule',label:'Distance measured',type:'select',opts:['Along the aisles (right angles)','Straight line']},
  {id:'date',label:'Date observed',type:'date'}]},
 {type:'grid',id:'s',title:'Stations',rows:4,hint:'Codes are short labels used in the routes. Fill in the proposed position only for stations that would move in a new layout; leave it blank to keep a station where it is.',cols:[
  {id:'c',label:'Code',w:56},
  {id:'n',label:'Station',w:170},
  {id:'x',label:'x',type:'number'},
  {id:'y',label:'y',type:'number'},
  {id:'px',label:'Proposed x',type:'number'},
  {id:'py',label:'Proposed y',type:'number'}]},
 {type:'grid',id:'r',title:'Routes',rows:2,hint:'One row per route: who or what moves, the stations visited in order (separated by spaces or commas), and how many times a day the route is walked or driven.',cols:[
  {id:'w',label:'Who or what moves',w:150},
  {id:'seq',label:'Sequence of stations',w:260,type:'textarea',rows:1},
  {id:'t',label:'Times per day',type:'number',min:0},
  {id:'one',label:'One pass',calc:function(r,api){ var c=window.TOOL.calc(api), i=api.state().g.r.indexOf(r), x=c.R.filter(function(q){return q.i===i;})[0]; return x?api.fmt(x.one,0):''; }},
  {id:'day',label:'Per day',calc:function(r,api){ var c=window.TOOL.calc(api), i=api.state().g.r.indexOf(r), x=c.R.filter(function(q){return q.i===i;})[0]; return x?api.fmt(x.day,0):''; }}]},
 {type:'custom',id:'res',title:'Distance',html:'<div class="stat sp-stat"></div>'},
 {type:'custom',id:'map',title:'Spaghetti diagram',hint:'Each line is one leg of a route. Thicker lines are walked more often. Arrows show the direction.',html:'<div class="svgw sp-a"></div><div class="svgw sp-b"></div>'},
 {type:'custom',id:'legs',title:'Longest legs',html:'<div class="tgw"><table class="tg sp-tab"></table></div>'},
 {type:'custom',id:'chk',title:'What the diagram says',html:'<div class="out sp-out"></div>'}
],
draw:function(c,api,prop){
 var T=window.TOOL, E=api.esc, codes=Object.keys(c.St).filter(function(k){var s=c.St[k]; return !isNaN(s.x)&&!isNaN(s.y);});
 if(!codes.length) return '';
 var X=function(s){return prop?s.px:s.x;}, Y=function(s){return prop?s.py:s.y;};
 var xs=[], ys=[]; codes.forEach(function(k){ var s=c.St[k]; xs.push(s.x,s.px); ys.push(s.y,s.py); });
 var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys), sp=Math.max(x1-x0,y1-y0,1);
 var W=760, pad=56, sc=Math.min((W-2*pad)/Math.max(x1-x0,sp*0.3),(440-2*pad)/Math.max(y1-y0,sp*0.2)), H=Math.round((y1-y0)*sc+2*pad+20);
 var px=function(v){return pad+(v-x0)*sc;}, py=function(v){return pad+10+(v-y0)*sc;};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Spaghetti diagram"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:700 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.cd{font:800 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style><defs>'+T.COL.map(function(col,i){return '<marker id="spm'+(prop?'p':'c')+i+'" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="'+col+'"/></marker>';}).join('')+'</defs>';
 g+='<text class="ax" x="'+pad+'" y="18">'+(prop?'PROPOSED LAYOUT':'CURRENT LAYOUT')+' &middot; '+api.fmt(prop?c.totP:c.tot,0)+' '+E((api.state().f.unit||'feet').toUpperCase())+' A DAY</text>';
 /* grid every nice step */
 var stp=[1,2,5,10,20,25,50,100,200,500].filter(function(s){return sp/s<=12;})[0]||1000;
 for(var gx=Math.ceil(x0/stp)*stp;gx<=x1;gx+=stp) g+='<line x1="'+px(gx)+'" x2="'+px(gx)+'" y1="'+(pad-14)+'" y2="'+(H-pad+24)+'" stroke="#EEF0EC"/>';
 for(var gy=Math.ceil(y0/stp)*stp;gy<=y1;gy+=stp) g+='<line x1="'+(pad-30)+'" x2="'+(W-pad+30)+'" y1="'+py(gy)+'" y2="'+py(gy)+'" stroke="#EEF0EC"/>';
 var mxT=Math.max.apply(null,c.R.map(function(r){return r.t;}).concat([1]));
 var seen={};
 c.R.forEach(function(r,ri){ var col=T.COL[ri%T.COL.length], wd=1.2+3*r.t/mxT;
  r.legs.forEach(function(l){ var a=c.St[l.a], b=c.St[l.b], key=[l.a,l.b].sort().join('|'), o=(seen[key]=(seen[key]||0)+1)-1, off=(o%2?1:-1)*Math.ceil(o/2)*4;
   var ax=px(X(a))+off, ay=py(Y(a))+off, bx=px(X(b))+off, by=py(Y(b))+off, d;
   if(c.man) d='M'+ax+' '+ay+' L'+bx+' '+ay+' L'+bx+' '+by; else d='M'+ax+' '+ay+' L'+bx+' '+by;
   var mx2=c.man?(Math.abs(bx-ax)>Math.abs(by-ay)?(ax+bx)/2:bx):(ax+bx)/2, my2=c.man?(Math.abs(bx-ax)>Math.abs(by-ay)?ay:(ay+by)/2):(ay+by)/2;
   g+='<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+wd.toFixed(1)+'" stroke-opacity=".75" stroke-linejoin="round"/>';
   var dirx=c.man?(Math.abs(bx-ax)>Math.abs(by-ay)?bx-ax:0):bx-ax, diry=c.man?(Math.abs(bx-ax)>Math.abs(by-ay)?0:by-ay):by-ay, ln=Math.sqrt(dirx*dirx+diry*diry)||1;
   g+='<path d="M'+(mx2-dirx/ln*5)+' '+(my2-diry/ln*5)+' L'+(mx2+dirx/ln*1)+' '+(my2+diry/ln*1)+'" stroke="'+col+'" stroke-width="'+wd.toFixed(1)+'" marker-end="url(#spm'+(prop?'p':'c')+(ri%T.COL.length)+')"/>'; }); });
 var placed=[]; codes.forEach(function(k){ var s=c.St[k], x=px(X(s)), y=py(Y(s)), moved=prop&&(s.px!==s.x||s.py!==s.y), nm=s.nm.length>18?s.nm.slice(0,17)+'…':s.nm;
  g+='<rect x="'+(x-22)+'" y="'+(y-13)+'" width="44" height="26" rx="3" fill="'+(moved?'#FBF5E4':'#fff')+'" stroke="'+(moved?'#9C7C1F':'#0F3E68')+'" stroke-width="1.8"/><text class="cd" x="'+x+'" y="'+(y+4)+'" text-anchor="middle">'+E(k)+'</text>';
  var lw=nm.length*5.6+6, ly=y+27; if(placed.some(function(q){return Math.abs(q.x-x)<(q.w+lw)/2&&Math.abs(q.y-ly)<12;})) ly=y-18; placed.push({x:x,y:ly,w:lw});
  if(nm) g+='<text x="'+x+'" y="'+ly+'" text-anchor="middle" style="font-size:10.5px;fill:#4A5D71;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">'+E(nm)+'</text>'; });
 var lx=pad; c.R.forEach(function(r,ri){ var nm=r.who.length>22?r.who.slice(0,21)+'…':r.who; g+='<rect x="'+lx+'" y="'+(H-14)+'" width="14" height="4" fill="'+T.COL[ri%T.COL.length]+'"/><text x="'+(lx+18)+'" y="'+(H-9)+'">'+E(nm)+'</text>'; lx+=Math.min(200,(W-pad)/Math.max(1,c.R.length)); });
 return g+'</svg>';
},
update:function(root,api){
 var T=window.TOOL, c=T.calc(api), S=api.state(), F=api.fmt, E=api.esc, f=[], u=S.f.unit||'feet', big=u==='meters'?1000:5280, bigU=u==='meters'?'km':'miles';
 root.querySelector('.sp-stat').innerHTML=c.R.length?'<div><b>'+F(c.tot,0)+' '+E(u)+'</b><span>Per day, current</span></div><div><b>'+F(c.tot/big,2)+' '+bigU+'</b><span>Per day, current</span></div>'+c.R.map(function(r){return '<div><b>'+F(r.one,0)+'</b><span>'+E(r.who)+', '+E(u)+' per pass</span></div>';}).join('')+(c.hasP?'<div><b>'+F(c.totP,0)+' '+E(u)+'</b><span>Per day, proposed</span></div><div><b>'+(c.tot>0?F((c.tot-c.totP)/c.tot*100,0)+'%':'&ndash;')+'</b><span>Saving</span></div>':''):'';
 root.querySelector('.sp-a').innerHTML=T.draw(c,api,false);
 var b=root.querySelector('.sp-b'); b.innerHTML=c.hasP?T.draw(c,api,true):''; b.style.display=c.hasP?'':'none';
 /* legs table: combine by pair, per day */
 var pr={}; c.R.forEach(function(r){ r.legs.forEach(function(l){ var k=[l.a,l.b].sort().join(' ↔ '); var o=pr[k]=pr[k]||{k:k,n:0,d:0,dp:0,L:l.L}; o.n+=r.t; o.d+=l.L*r.t; o.dp+=l.LP*r.t; }); });
 var top=Object.keys(pr).map(function(k){return pr[k];}).sort(function(a,b){return b.d-a.d;});
 root.querySelector('.sp-tab').innerHTML=top.length?'<thead><tr><th>Between</th><th>Length, '+E(u)+'</th><th>Trips a day</th><th>Per day, '+E(u)+'</th><th>Share</th>'+(c.hasP?'<th>Proposed per day</th>':'')+'</tr></thead><tbody>'+top.slice(0,8).map(function(o){ return '<tr><td class="calc">'+E(o.k)+'</td><td class="calc">'+F(o.L,1)+'</td><td class="calc">'+F(o.n,0)+'</td><td class="calc">'+F(o.d,0)+'</td><td class="calc">'+(c.tot>0?F(o.d/c.tot*100,0)+'%':'')+'</td>'+(c.hasP?'<td class="calc">'+F(o.dp,0)+'</td>':'')+'</tr>'; }).join('')+'</tbody>':'';
 /* checks */
 var bad=c.bad.filter(function(x,i,a){return a.indexOf(x)===i;});
 if(bad.length) f.push(['warn','These codes in the routes are not stations with a position: '+bad.map(E).join(', ')+'. Their legs are left out.']);
 if(c.R.length&&c.tot>0){
  f.push(['','Current layout: <b>'+F(c.tot,0)+' '+E(u)+'</b> a day ('+F(c.tot/big,2)+' '+bigU+'), measured '+(c.man?'along the aisles':'in straight lines')+'.'+(c.man?'':' Straight lines understate the real walk, which follows aisles.')]);
  var t3=top.slice(0,3), sh=t3.reduce(function(s,o){return s+o.d;},0)/c.tot;
  if(top.length>3&&sh>0.5) f.push(['','The three busiest legs ('+t3.map(function(o){return E(o.k);}).join(', ')+') make up '+F(sh*100,0)+'% of the distance. Moving those stations closer together gives most of the gain.']);
  c.R.forEach(function(r){ var vis={}, back=[]; r.seq.forEach(function(s,k){ if(vis[s]&&k>0) back.push(s); vis[s]=1; });
   back=back.filter(function(x,i,a){return a.indexOf(x)===i&&x!==r.seq[0];}); if(back.length) f.push(['warn','<b>'+E(r.who)+'</b> returns to '+back.map(E).join(', ')+' during the route. Backtracking usually means the stations are not in process order.']); });
  if(c.tot/big>3) f.push(['warn','That is more than 3 '+bigU+' a day. Every step is time not spent on the work.']);
  if(c.hasP) f.push([c.totP<c.tot?'ok':'warn','Proposed layout: <b>'+F(c.totP,0)+' '+E(u)+'</b> a day, '+(c.totP<c.tot?F(c.tot-c.totP,0)+' '+E(u)+' less ('+F((c.tot-c.totP)/c.tot*100,0)+'%)':'no shorter than now')+'.']);
 }
 root.querySelector('.sp-out').innerHTML=api.flags(f,'Place the stations and enter a route, and the diagram appears here.');
},
example:{f:{area:'Sample-preparation lab, materials testing',unit:'feet',rule:'Along the aisles (right angles)',date:'2026-09-17'},
 g:{s:[
  {c:'IN',n:'Sample receiving',x:'0',y:'0',px:'',py:''},
  {c:'LOG',n:'Login terminal',x:'38',y:'0',px:'8',py:'0'},
  {c:'SAW',n:'Cut-off saw',x:'12',y:'30',px:'',py:''},
  {c:'MNT',n:'Mounting press',x:'52',y:'30',px:'24',py:'30'},
  {c:'POL',n:'Polishers',x:'24',y:'54',px:'38',py:'30'},
  {c:'MIC',n:'Microscope',x:'60',y:'6',px:'52',py:'30'},
  {c:'RPT',n:'Report desk',x:'4',y:'54',px:'52',py:'10'}],
 r:[
  {w:'Technician, per sample',seq:'IN LOG SAW MNT POL MIC RPT LOG IN',t:'24'},
  {w:'Supplies cart',seq:'IN POL SAW IN',t:'2'}]}}
}
