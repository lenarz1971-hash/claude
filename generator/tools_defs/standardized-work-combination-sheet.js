{
slug:'standardized-work-combination-sheet',
calc:function(api){
 var S=api.state(), n=api.num, av=n(S.f.av), dm=n(S.f.dm), to=n(S.f.takt), takt=to>0?to:(av>0&&dm>0?av*60/dm:NaN), t=0, P=[];
 S.g.s.forEach(function(r,i){ var m=n(r.m), w=n(r.w), a=n(r.a); if(!r.n&&isNaN(m)&&isNaN(w)&&isNaN(a)) return;
  m=m>0?m:0; w=w>0?w:0; a=a>0?a:0; P.push({i:i,nm:(r.n||'').trim()||('Step '+(i+1)),m:m,w:w,a:a,st:t}); t+=m+w; });
 var C=t, mc=0; P.forEach(function(p){ p.mc=p.a>0?p.m+p.a:0; if(p.mc>mc) mc=p.mc; });
 var CT=Math.max(C,mc);
 P.forEach(function(p){ p.wait=p.a>0?Math.max(0,p.mc-C):0; p.idle=p.a>0?CT-p.mc:0; });
 return {takt:takt,P:P,C:C,CT:CT,mc:mc,tm:P.reduce(function(s,p){return s+p.m;},0),tw:P.reduce(function(s,p){return s+p.w;},0),ta:P.reduce(function(s,p){return s+p.a;},0),owait:CT-C};
},
sections:[
 {type:'fields',title:'Station and takt',cols:3,hint:'<b>Takt time = available time &divide; customer demand</b>, the pace the station must keep. Enter the available time and demand, or type a takt time directly. All step times are in seconds.',fields:[
  {id:'proc',label:'Process or station',wide:true,ph:'e.g. Shaft cell 2: lathe, mill, wash, gauge'},
  {id:'op',label:'Operator or position'},
  {id:'av',label:'Available time per shift (min)',type:'number',min:0,hint:'Shift minutes less planned breaks and meetings.'},
  {id:'dm',label:'Demand per shift (units)',type:'number',min:0},
  {id:'takt',label:'Or takt time (sec)',type:'number',min:0,hint:'Overrides the two fields above.'},
  {id:'date',label:'Date observed',type:'date'}]},
 {type:'grid',id:'s',title:'Work elements, in order',rows:4,hint:'One row per element of the operator\'s routine. <b>Manual</b> is hands-on time, including loading and unloading a machine. <b>Walk</b> is the walk to the next element (the last row is the walk back to the start). <b>Machine</b> is the automatic time a machine runs after it is started, while the operator moves on. Use the lowest repeatable time from timed observations, not an average with problems in it.',cols:[
  {id:'n',label:'Element',w:220,type:'textarea',rows:1},
  {id:'m',label:'Manual (s)',type:'number',min:0},
  {id:'w',label:'Walk (s)',type:'number',min:0},
  {id:'a',label:'Machine (s)',type:'number',min:0},
  {id:'st',label:'Starts at',calc:function(r,api){ var i=api.state().g.s.indexOf(r), p=window.TOOL.calc(api).P.filter(function(x){return x.i===i;})[0]; return p?api.fmt(p.st,1).replace(/\.0$/,''):''; }}]},
 {type:'custom',id:'res',title:'Cycle against takt',html:'<div class="stat sw-stat"></div>'},
 {type:'custom',id:'ch',title:'Combination chart',hint:'Solid bars are manual work, wavy lines are walking, dashed bars are machine time. A machine run that goes past the operator\'s cycle wraps round to the start of the next cycle. The red line is takt; the navy line is the cycle the station actually runs at.',html:'<div class="svgw sw-svg"></div>'},
 {type:'custom',id:'chk',title:'What the sheet says',html:'<div class="out sw-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, c=T.calc(api), S=api.state(), F=api.fmt, E=api.esc, f=[], fm=function(v){ return F(v,1).replace(/\.0$/,''); };
 var tk=c.takt, st=root.querySelector('.sw-stat');
 st.innerHTML=c.P.length?'<div><b>'+(isNaN(tk)?'&ndash;':fm(tk)+' s')+'</b><span>Takt time</span></div><div><b>'+fm(c.C)+' s</b><span>Operator cycle (manual + walk)</span></div><div><b>'+fm(c.CT)+' s</b><span>Station cycle time</span></div><div><b>'+fm(c.tm)+' / '+fm(c.tw)+' / '+fm(c.ta)+'</b><span>Manual / walk / machine, s</span></div>'+(isNaN(tk)?'':'<div><b>'+F(c.CT/tk*100,0)+'%</b><span>Cycle as % of takt</span></div>'):'';
 /* chart */
 var host=root.querySelector('.sw-svg');
 if(!c.P.length){ host.innerHTML=''; }
 else {
  var mx=Math.max(c.CT,isNaN(tk)?0:tk)*1.08, W=760, L=200, R=24, RH=30, top=56, H=top+c.P.length*RH+34, sx=function(v){return L+v/mx*(W-L-R);};
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Standardized work combination chart"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  var step=[1,2,5,10,15,20,30,60,120,300].filter(function(s){return mx/s<=14;})[0]||600;
  for(var t=0;t<=mx;t+=step) g+='<line x1="'+sx(t)+'" x2="'+sx(t)+'" y1="'+(top-6)+'" y2="'+(H-28)+'" stroke="#E4E7E1"/><text class="ax" x="'+sx(t)+'" y="'+(H-14)+'" text-anchor="middle">'+t+'</text>';
  g+='<text class="ax" x="'+(L-16)+'" y="'+(H-14)+'" text-anchor="end">SECONDS</text>';
  function lab(x,y,txt,col,left){ var right=left||x+8+txt.length*7>W; return '<text class="ax" x="'+(right?x-4:x+4)+'" y="'+y+'"'+(right?' text-anchor="end"':'')+' style="fill:'+col+'">'+txt+'</text>'; }
  g+='<rect x="'+L+'" y="6" width="22" height="9" fill="#0F3E68"/><text class="ax" x="'+(L+28)+'" y="14">MANUAL</text><path d="M'+(L+96)+' 11 q3 -5 6 0 t6 0 t6 0 t6 0" fill="none" stroke="#1F8C55" stroke-width="1.8"/><text class="ax" x="'+(L+126)+'" y="14">WALK</text><line x1="'+(L+176)+'" x2="'+(L+198)+'" y1="11" y2="11" stroke="#9C7C1F" stroke-width="3" stroke-dasharray="5 3"/><text class="ax" x="'+(L+204)+'" y="14">MACHINE</text>';
  function wave(x1,x2,y){ var d='M'+x1+' '+y, x=x1, up=true; if(x2-x1<4) return '<line x1="'+x1+'" x2="'+x2+'" y1="'+y+'" y2="'+y+'" stroke="#1F8C55" stroke-width="1.8"/>'; while(x+3<=x2){ d+=' q1.5 '+(up?-4:4)+' 3 0'; x+=3; up=!up; } return '<path d="'+d+'" fill="none" stroke="#1F8C55" stroke-width="1.6"/>'; }
  c.P.forEach(function(p,k){ var y=top+k*RH, nm=p.nm.length>28?p.nm.slice(0,27)+'…':p.nm, x0=sx(p.st), x1=sx(p.st+p.m), yb=y+RH/2;
   g+='<text x="'+(L-8)+'" y="'+(yb+4)+'" text-anchor="end">'+(k+1)+'. '+E(nm)+'</text>';
   if(p.m>0) g+='<rect x="'+x0+'" y="'+(yb-7)+'" width="'+Math.max(1,x1-x0)+'" height="14" fill="#0F3E68"/>';
   if(p.a>0){ var s=p.st+p.m, e=s+p.a, end1=Math.min(e,c.CT);
    g+='<line x1="'+sx(s)+'" x2="'+sx(end1)+'" y1="'+(yb+10)+'" y2="'+(yb+10)+'" stroke="#9C7C1F" stroke-width="3" stroke-dasharray="5 3"/>';
    if(e>c.CT+1e-9) g+='<line x1="'+sx(0)+'" x2="'+sx(Math.min(e-c.CT,c.CT))+'" y1="'+(yb+10)+'" y2="'+(yb+10)+'" stroke="#9C7C1F" stroke-width="3" stroke-dasharray="5 3"/>'; }
   if(p.w>0){ var ny=k<c.P.length-1?top+(k+1)*RH+RH/2:top+RH/2; g+=wave(x1,sx(p.st+p.m+p.w),yb); if(k<c.P.length-1) g+='<line x1="'+sx(p.st+p.m+p.w)+'" x2="'+sx(p.st+p.m+p.w)+'" y1="'+yb+'" y2="'+ny+'" stroke="#1F8C55" stroke-width="1" stroke-dasharray="2 2"/>'; }
   else if(k<c.P.length-1) g+='<line x1="'+x1+'" x2="'+x1+'" y1="'+yb+'" y2="'+(yb+RH)+'" stroke="#4A5D71" stroke-width="1" stroke-dasharray="2 2"/>'; });
  if(c.CT>c.C+1e-9){ var yl=top+(c.P.length-1)*RH+RH/2; g+='<line x1="'+sx(c.C)+'" x2="'+sx(c.CT)+'" y1="'+yl+'" y2="'+yl+'" stroke="#C0392B" stroke-width="2" stroke-dasharray="1 3"/><text class="ax" x="'+(sx(c.CT)-5)+'" y="'+(yl+16)+'" text-anchor="end" style="fill:#C0392B">OPERATOR WAITS '+fm(c.CT-c.C)+' s</text>'; }
  g+='<line x1="'+sx(c.CT)+'" x2="'+sx(c.CT)+'" y1="'+(top-14)+'" y2="'+(H-28)+'" stroke="#0F3E68" stroke-width="2"/>'+lab(sx(c.CT),top-16,'CYCLE '+fm(c.CT),'#0F3E68',true);
  if(!isNaN(tk)) g+='<line x1="'+sx(tk)+'" x2="'+sx(tk)+'" y1="'+(top-28)+'" y2="'+(H-28)+'" stroke="#C0392B" stroke-width="2" stroke-dasharray="6 4"/>'+lab(sx(tk),top-30,'TAKT '+fm(tk),'#C0392B');
  host.innerHTML=g+'</svg>';
 }
 /* checks */
 if(c.P.length){
  if(isNaN(tk)) f.push(['warn','Enter the available time and demand, or a takt time, to compare the cycle against takt.']);
  else if(c.CT>tk+1e-9) f.push(['warn','The station cycle ('+fm(c.CT)+' s) is over takt ('+fm(tk)+' s) by '+fm(c.CT-tk)+' s. At this pace the station makes about '+F(tk/c.CT*100,0)+'% of demand, so it needs overtime or the work rebalanced.']);
  else if(c.CT>0.95*tk) f.push(['warn','The cycle is within 5% of takt ('+fm(c.CT)+' of '+fm(tk)+' s). Any problem in a cycle means a missed unit; there is no room to recover.']);
  else f.push(['ok','The cycle ('+fm(c.CT)+' s) fits within takt ('+fm(tk)+' s), with '+fm(tk-c.CT)+' s to spare each cycle.'+(c.CT<0.7*tk?' That is a lot of spare time; the operator could take on more work from a neighboring station.':'')]);
  c.P.forEach(function(p){ if(p.wait>1e-9) f.push(['warn','<b>'+E(p.nm)+'</b>: the machine needs '+fm(p.mc)+' s (manual '+fm(p.m)+' + machine '+fm(p.a)+') but the operator is back after '+fm(c.C)+' s, so the operator waits '+fm(p.wait)+' s each cycle. Shorten the machine time or add work to the routine.']);
   if(!isNaN(tk)&&p.a>0&&p.mc>tk+1e-9) f.push(['warn','<b>'+E(p.nm)+'</b> alone takes '+fm(p.mc)+' s of machine and load time, over takt. A second machine or a faster cycle is needed whatever the operator does.']); });
  var idl=c.P.filter(function(p){return p.a>0&&p.idle>1e-9;}); if(idl.length) f.push(['','Machines finished and waiting for the operator: '+idl.map(function(p){return E(p.nm)+' '+fm(p.idle)+' s';}).join(', ')+'. That is normal: in a lean cell the machines wait for the person, not the other way round.']);
  if(c.C>0&&c.tw/c.C>0.15) f.push(['',' Walking is '+F(c.tw/c.C*100,0)+'% of the operator\'s cycle ('+fm(c.tw)+' s). Moving the machines closer together, or into a U shape, gives that time back.']);
  if(c.P.length>1&&c.P[c.P.length-1].w===0) f.push(['','The last element has no walk time. If the operator walks back to the first machine, enter it on the last row.']);
 }
 root.querySelector('.sw-out').innerHTML=api.flags(f,'Enter the work elements and the checks appear here.');
},
example:{f:{proc:'Shaft cell 2: saw, lathe, mill, wash and gauge one pump shaft',op:'Cell operator, first shift',av:'440',dm:'330',takt:'',date:'2026-09-24'},
 g:{s:[
  {n:'Pick blank, load saw, start',m:'6',w:'3',a:'18'},
  {n:'Unload lathe, load, start',m:'11',w:'3',a:'62'},
  {n:'Unload mill, load, start',m:'10',w:'4',a:'47'},
  {n:'Unload washer, load, start',m:'5',w:'2',a:'30'},
  {n:'Gauge diameters and runout',m:'14',w:'2',a:''},
  {n:'Mark, place on outbound rack',m:'4',w:'6',a:''}]}}
}
