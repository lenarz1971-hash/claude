{
slug:'kanban-sizing-calculator',
K:function(r,api){
 /* one part: N = D x L x (1 + safety) / C, rounded up */
 var n=api.num, S=api.state(), D=n(r.d), L=n(r.lt), C=n(r.c), a=n(r.sf), dflt=n(S.f.sf);
 if(isNaN(a)) a=isNaN(dflt)?0:dflt;
 var raw=(D>0&&L>0&&C>0&&a>=0)?D*L*(1+a/100)/C:NaN;
 var N=isNaN(raw)?NaN:Math.max(1,Math.ceil(raw-1e-9));
 return {D:D,L:L,C:C,a:a,raw:raw,N:N,inv:N*C,cover:N*C/D,cur:n(r.cur),cost:n(r.uc)};
},
sections:[
 {type:'fields',title:'The loop',cols:3,hint:'A kanban loop runs between a supermarket and the process or supplier that refills it. <b>Number of kanbans N = D &times; L &times; (1 + safety) &divide; C</b>, rounded up: D is demand per day, L the replenishment lead time in days, C the quantity in one container.',fields:[
  {id:'loop',label:'Loop',wide:true,ph:'e.g. Machined housings, machining cell to assembly supermarket'},
  {id:'type',label:'Kanban type',type:'select',opts:['Withdrawal (move)','Production','Supplier']},
  {id:'days',label:'Working days per week',type:'number',min:1,max:7,ph:'5',hint:'Used only to show cover in weeks.'},
  {id:'sf',label:'Default safety factor (%)',type:'number',min:0,ph:'10',hint:'Used for any part with its own safety factor left blank.'}]},
 {type:'grid',id:'p',title:'Parts in the loop',rows:3,hint:'<b>Lead time</b> is the whole replenishment loop: the card waiting to be collected, the queue at the supplying process, changeover and run time, and the move back. Use average daily demand from the plan, not last week\'s orders. Current kanbans and unit cost are optional.',cols:[
  {id:'pn',label:'Part',w:150},
  {id:'d',label:'Demand per day',type:'number',min:0},
  {id:'lt',label:'Lead time (days)',type:'number',min:0},
  {id:'sf',label:'Safety %',type:'number',min:0,tip:'Blank uses the default'},
  {id:'c',label:'Container qty',type:'number',min:1},
  {id:'cur',label:'Kanbans now',type:'number',min:0},
  {id:'uc',label:'Unit cost ($)',type:'number',min:0},
  {id:'raw',label:'Exact N',calc:function(r,api){ var k=window.TOOL.K(r,api); return isNaN(k.raw)?'':api.fmt(k.raw,2); }},
  {id:'n',label:'Kanbans',calc:function(r,api){ var k=window.TOOL.K(r,api); return isNaN(k.N)?'':'<b>'+k.N+'</b>'; }},
  {id:'inv',label:'Max units in loop',calc:function(r,api){ var k=window.TOOL.K(r,api); return isNaN(k.N)?'':api.fmt(k.inv,0); }},
  {id:'cov',label:'Days of cover',calc:function(r,api){ var k=window.TOOL.K(r,api); return isNaN(k.N)?'':api.fmt(k.cover,2); }}]},
 {type:'custom',id:'res',title:'The loop in numbers',hint:'Max units in loop = kanbans &times; container quantity: the stock if every container were full. Days of cover = that stock &divide; daily demand. Some containers are always empty and on their way back, so the stock on hand is lower than this.',html:'<div class="stat kb-stat"></div><div class="svgw kb-svg"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out kb-out"></div>'}
],
update:function(root,api){
 var S=api.state(), T=window.TOOL, f=[], F=api.fmt, E=api.esc, wk=api.num(S.f.days); if(!(wk>0)) wk=5;
 var P=[]; S.g.p.forEach(function(r,i){ if(!r.pn&&!r.d&&!r.c) return; var k=T.K(r,api); k.nm=(r.pn||'').trim()||('Row '+(i+1)); k.own=r.sf!==''&&r.sf!=null; P.push(k); });
 var ok=P.filter(function(k){return !isNaN(k.N);});
 P.forEach(function(k){ if(isNaN(k.N)) f.push(['warn','<b>'+E(k.nm)+'</b>: enter demand per day, lead time and container quantity, all above zero.']); });
 var cards=0, units=0, val=0, hasVal=false, now=0, hasNow=false;
 ok.forEach(function(k){ cards+=k.N; units+=k.inv; if(k.cost>=0){ val+=k.inv*k.cost; hasVal=true; } if(k.cur>=0){ now+=k.cur; hasNow=true; } });
 var st=root.querySelector('.kb-stat');
 st.innerHTML=ok.length?'<div><b>'+ok.length+'</b><span>Parts sized</span></div><div><b>'+cards+'</b><span>Kanbans in the loop</span></div>'+(hasNow?'<div><b>'+now+' &rarr; '+cards+'</b><span>Kanbans now &rarr; calculated</span></div>':'')+'<div><b>'+F(units,0)+'</b><span>Max units in loop</span></div>'+(hasVal?'<div><b>$'+F(val,0)+'</b><span>Max inventory value</span></div>':''):'';
 /* chart: days of cover per part, split into lead-time demand, safety and rounding */
 var host=root.querySelector('.kb-svg');
 if(!ok.length){ host.innerHTML=''; }
 else {
  var W=720, L=170, R=60, RH=34, H=50+ok.length*RH+30, mx=Math.max.apply(null,ok.map(function(k){return k.cover;}))*1.05, sx=function(v){return L+v/mx*(W-L-R);};
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Days of cover by part"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  g+='<rect x="'+L+'" y="10" width="12" height="12" fill="#0F3E68"/><text class="ax" x="'+(L+16)+'" y="20">LEAD-TIME DEMAND</text><rect x="'+(L+150)+'" y="10" width="12" height="12" fill="#D8B147"/><text class="ax" x="'+(L+166)+'" y="20">SAFETY</text><rect x="'+(L+232)+'" y="10" width="12" height="12" fill="#C6CDD3"/><text class="ax" x="'+(L+248)+'" y="20">ROUNDING UP</text>';
  var step=mx>20?5:mx>8?2:mx>3?1:0.5;
  for(var t=0;t<=mx+1e-9;t+=step){ g+='<line x1="'+sx(t)+'" x2="'+sx(t)+'" y1="34" y2="'+(H-26)+'" stroke="#E4E7E1"/><text class="ax" x="'+sx(t)+'" y="'+(H-12)+'" text-anchor="middle">'+F(t,step<1?1:0)+'</text>'; }
  g+='<text class="ax" x="'+(W-R)+'" y="'+(H-12)+'" text-anchor="start" dx="8">DAYS</text>';
  ok.forEach(function(k,i){ var y=40+i*RH, a=k.L, b=k.L*(1+k.a/100), c=k.cover, nm=k.nm.length>24?k.nm.slice(0,23)+'…':k.nm;
   g+='<text x="'+(L-8)+'" y="'+(y+16)+'" text-anchor="end">'+E(nm)+'</text>'+
    '<rect x="'+L+'" y="'+(y+4)+'" width="'+(sx(a)-L)+'" height="18" fill="#0F3E68"/>'+
    '<rect x="'+sx(a)+'" y="'+(y+4)+'" width="'+Math.max(0,sx(b)-sx(a))+'" height="18" fill="#D8B147"/>'+
    '<rect x="'+sx(b)+'" y="'+(y+4)+'" width="'+Math.max(0,sx(c)-sx(b))+'" height="18" fill="#C6CDD3"/>'+
    '<text class="ax" x="'+(sx(c)+6)+'" y="'+(y+17)+'">'+k.N+' &times; '+F(k.C,0)+'</text>'; });
  host.innerHTML=g+'</svg>';
 }
 /* checks */
 ok.forEach(function(k){ var id='<b>'+E(k.nm)+'</b>';
  if(k.N<2) f.push(['warn',id+' needs only '+k.N+' kanban. With one container the user must wait while it is refilled; most loops need at least two (one in use, one being refilled). Check the container quantity.']);
  var up=(k.N-k.raw)/k.raw; if(k.N>1&&up>0.25) f.push(['',id+': rounding '+F(k.raw,2)+' up to '+k.N+' adds '+F(100*up,0)+'% extra stock. A smaller container would size the loop more closely.']);
  if(k.a>50) f.push(['warn',id+' carries a '+F(k.a,0)+'% safety factor. A factor that large usually hides an unreliable supplying process or lead time; fix that and cut the factor.']);
  if(!k.own&&isNaN(api.num(S.f.sf))&&k.a===0) f.push(['',id+' has no safety factor. That works only if demand and lead time are very steady.']);
  if(k.C>k.D*k.L*(1+k.a/100)) f.push(['',id+': one container holds more than the whole lead-time demand ('+F(k.D*k.L,(k.D*k.L)%1?1:0)+' units). The container size, not demand, is setting the stock.']);
  if(k.cover>2*wk) f.push(['',id+' holds '+F(k.cover,1)+' days of cover, more than two weeks. Look at shortening the lead time.']);
  if(k.cur>=0){ if(k.cur<k.N) f.push(['warn',id+' has '+k.cur+' kanbans in use but needs '+k.N+'. Expect shortages until cards are added or the lead time comes down.']); else if(k.cur>k.N) f.push(['ok',id+' has '+k.cur+' kanbans; '+k.N+(k.N===1?' is':' are')+' enough. Pulling '+(k.cur-k.N)+' card'+(k.cur-k.N>1?'s':'')+' frees '+F((k.cur-k.N)*k.C,0)+' units'+(k.cost>=0?' ($'+F((k.cur-k.N)*k.C*k.cost,0)+')':'')+'.']); } });
 if(ok.length) f.push(['','Recalculate when demand or lead time changes by more than about 10 to 20%. A kanban loop sized for last year\'s demand either starves the line or builds stock.']);
 root.querySelector('.kb-out').innerHTML=api.flags(f,'Enter the parts and the checks appear here.');
},
example:{f:{loop:'Valve bodies, machining cell to the pump assembly supermarket',type:'Production',days:'5',sf:'10'},
 g:{p:[
  {pn:'VB-210 valve body',d:'240',lt:'1.5',sf:'',c:'24',cur:'18',uc:'14.20'},
  {pn:'VB-212 valve body',d:'120',lt:'1.5',sf:'',c:'24',cur:'8',uc:'15.75'},
  {pn:'VB-330 high-pressure body',d:'36',lt:'3',sf:'25',c:'20',cur:'8',uc:'41.00'},
  {pn:'VC-14 cover plate',d:'400',lt:'0.5',sf:'',c:'250',cur:'3',uc:'2.10'}]}}
}
