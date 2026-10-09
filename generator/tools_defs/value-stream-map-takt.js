{
slug:'value-stream-map-takt',
K:function(api){
 var S=api.state(), n=api.num, sh=n(S.f.sh), sm=n(S.f.sm), br=n(S.f.br); if(!isFinite(br)) br=0;
 var av=sh*(sm-br)*60, dem=n(S.f.dem);
 return {av:av>0?av:NaN, dem:dem>0?dem:NaN, takt:(av>0&&dem>0)?av/dem:NaN};
},
sections:[
 {type:'fields',title:'Product family and customer demand',cols:3,hint:'Available time is the working time per day after planned breaks. <b>Takt time = available time ÷ customer demand</b>: the pace at which one unit must be finished to match what the customer takes.',fields:[
  {id:'fam',label:'Product family',ph:'e.g. Hydraulic hose assemblies'},
  {id:'cust',label:'Customer',ph:'e.g. Tractor assembly plant'},
  {id:'dem',label:'Customer demand per day (units)',type:'number',min:0},
  {id:'sh',label:'Shifts per day',type:'number',min:0},
  {id:'sm',label:'Minutes per shift',type:'number',min:0},
  {id:'br',label:'Planned breaks per shift (min)',type:'number',min:0},
  {id:'fg',label:'Finished goods inventory (units)',type:'number',min:0,hint:'Stock waiting to ship after the last step.'}]},
 {type:'grid',id:'p',title:'Process boxes, in flow order',rows:4,hint:'One row per process box, upstream first. <b>Inventory before</b> is the count in the triangle waiting in front of the step. C/T = cycle time per unit, C/O = changeover time, uptime = share of planned time the step is available. Leave value-added seconds blank to count the whole C/T as value-added; enter 0 for pure inspection or waiting inside the step.',cols:[
  {id:'n',label:'Process',w:150},
  {id:'inv',label:'Inventory before (units)',type:'number',min:0},
  {id:'ct',label:'C/T (sec)',type:'number',min:0},
  {id:'co',label:'C/O (min)',type:'number',min:0},
  {id:'up',label:'Uptime %',type:'number',min:0,max:100},
  {id:'op',label:'Operators',type:'number',min:0},
  {id:'va',label:'Value-added sec (blank = C/T)',type:'number',min:0},
  {id:'d',label:'Inventory days',calc:function(r,api){ var k=window.TOOL.K(api), i=api.num(r.inv); return isFinite(i)&&isFinite(k.dem)?api.fmt(i/k.dem,1):''; }},
  {id:'vs',label:'C/T ÷ takt',calc:function(r,api){ var k=window.TOOL.K(api), c=api.num(r.ct); if(!isFinite(c)||!isFinite(k.takt)) return ''; var p=c/k.takt*100; return c>k.takt?'<b style="color:#C0392B">'+p.toFixed(0)+'% over</b>':p.toFixed(0)+'%'; }}]},
 {type:'custom',id:'res',title:'Takt, lead time and process cycle efficiency',html:'<div class="stat vs-st"></div>'},
 {type:'custom',id:'map',title:'Current-state map and timeline',hint:'Process boxes with their data boxes, inventory triangles in front of each step, and the lead-time ladder underneath: upper rungs are days of inventory (non-value-added waiting), lower rungs are processing time in seconds.',html:'<div class="svgw vs-svg"></div>'},
 {type:'custom',id:'chk',title:'What the map says',html:'<div class="out vs-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, F=api.fmt, E=api.esc, k=window.TOOL.K(api), T=k.takt, f=[];
 var STt=root.querySelector('.vs-st'), SV=root.querySelector('.vs-svg'), O=root.querySelector('.vs-out');
 var P=[];
 S.g.p.forEach(function(r,i){ var nm=String(r.n||'').trim(), ct=n(r.ct), inv=n(r.inv); if(!nm&&!isFinite(ct)&&!isFinite(inv)) return; P.push({nm:nm||('Step '+(i+1)),ct:ct,co:n(r.co),up:n(r.up),op:n(r.op),inv:inv,va:n(r.va)}); });
 var fg=n(S.f.fg);
 if(!isFinite(T)) f.push(['warn','Enter the customer demand per day, shifts per day and minutes per shift to get the takt time and the days of inventory.']);
 if(!P.length){ STt.innerHTML=''; SV.innerHTML=''; if(isFinite(T)) f.unshift(['ok','Takt time is <b>'+F(T,1)+' seconds</b> ('+F(k.av,0)+' available seconds ÷ '+F(k.dem,0)+' units a day).']); O.innerHTML=api.flags(f,'Enter the available time, the customer demand and at least one process step.'); return; }
 var ctSum=0, vaSum=0, missCT=[], invU=0, missInv=[], opSum=0, opN=0, badUp=[], badVa=[];
 P.forEach(function(p){
  if(isFinite(p.ct)){ ctSum+=p.ct; var v=isFinite(p.va)?p.va:p.ct; if(v>p.ct){ badVa.push(p.nm); v=p.ct; } vaSum+=v; } else missCT.push(p.nm);
  if(isFinite(p.inv)) invU+=p.inv; else missInv.push(p.nm);
  if(isFinite(p.op)){ opSum+=p.op; opN++; }
  if(isFinite(p.up)&&(p.up<=0||p.up>100)) badUp.push(p.nm);
 });
 if(isFinite(fg)) invU+=fg;
 var days=isFinite(k.dem)?invU/k.dem:NaN, lead=isFinite(days)&&isFinite(k.av)?days*k.av+ctSum:NaN, ltd=lead/k.av, pce=lead>0?vaSum/lead:NaN;
 function pc(x){ if(!isFinite(x)) return '—'; x*=100; return x>=1?x.toFixed(2)+'%':x>=0.01?x.toFixed(3)+'%':x.toPrecision(2)+'%'; }
 STt.innerHTML=[[isFinite(T)?F(T,1)+' s':'—','Takt time'],[isFinite(k.av)?F(k.av/60,0)+' min':'—','Available time per day'],[isFinite(k.dem)?F(k.dem,0):'—','Demand per day (units)'],[isFinite(days)?F(days,1):'—','Inventory, days of demand'],[isFinite(ltd)?F(ltd,1)+' days':'—','Production lead time'],[F(ctSum,0)+' s','Processing time (sum of C/T)'],[F(vaSum,0)+' s','Value-added time'],[pc(pce),'Process cycle efficiency']].map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('');
 /* the map */
 var rows=Math.ceil(P.length/3), per=Math.ceil(P.length/rows), SW=220, W=Math.max(780,30+per*SW+90), RH=232, H=48+rows*RH+52;
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Current-state value stream map"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.h{font:700 13px Archivo,sans-serif;fill:#fff}.b{font:700 14px Archivo,sans-serif;fill:#0F3E68}.r{font:700 13px Archivo,sans-serif;fill:#C0392B}.s{font:12px Archivo,sans-serif;fill:#4A5D71}.l{font:600 13px Archivo,sans-serif;fill:#16273A}</style>';
 var hd=(S.f.fam?E(S.f.fam):'Value stream')+(S.f.cust?' → '+E(S.f.cust):'');
 g+='<text class="b" x="20" y="26">'+(hd.length>60?hd.slice(0,59)+'…':hd)+'</text><text class="l" x="'+(W-20)+'" y="26" text-anchor="end">'+(isFinite(k.dem)?F(k.dem,0)+' units/day · ':'')+'takt '+(isFinite(T)?F(T,1)+' s':'—')+'</text>';
 function tri(cx,cy,units,lab){
  var s='<polygon points="'+cx+','+(cy-26)+' '+(cx-25)+','+(cy+18)+' '+(cx+25)+','+(cy+18)+'" fill="#FBF3DC" stroke="#9C7C1F" stroke-width="1.5"/><text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" style="font:800 16px Archivo,sans-serif;fill:#9C7C1F">'+lab+'</text>';
  return s+'<text class="s" x="'+cx+'" y="'+(cy+38)+'" text-anchor="middle">'+(isFinite(units)?F(units,0)+' units':'—')+'</text>';
 }
 function ladderUp(x0,y0,units){ var d=isFinite(units)&&isFinite(k.dem)?F(units/k.dem,1)+' days':'—'; return '<line x1="'+x0+'" y1="'+(y0+160)+'" x2="'+(x0+90)+'" y2="'+(y0+160)+'" stroke="#0F3E68" stroke-width="2"/><text class="l" x="'+(x0+45)+'" y="'+(y0+152)+'" text-anchor="middle">'+d+'</text>'; }
 P.forEach(function(p,i){
  var r=Math.floor(i/per), c=i%per, x0=20+c*SW, y0=48+r*RH, over=isFinite(T)&&p.ct>T, bx=x0+90;
  g+=tri(x0+45,y0+58,p.inv,'I');
  g+='<rect x="'+bx+'" y="'+(y0+8)+'" width="126" height="30" fill="#0F3E68"/><text class="h" x="'+(bx+63)+'" y="'+(y0+28)+'" text-anchor="middle">'+E(p.nm.length>17?p.nm.slice(0,16)+'…':p.nm)+'</text>';
  g+='<rect x="'+bx+'" y="'+(y0+38)+'" width="126" height="90" fill="#fff" stroke="'+(over?'#C0392B':'#C6CDD3')+'" stroke-width="'+(over?2.5:1)+'"/>';
  [[over?'r':'','C/T',isFinite(p.ct)?F(p.ct,0)+' s':'—'],['','C/O',isFinite(p.co)?F(p.co,0)+' min':'—'],['','Uptime',isFinite(p.up)?F(p.up,0)+'%':'—'],['','Operators',isFinite(p.op)?F(p.op,0):'—']].forEach(function(d,j){
   g+='<text'+(d[0]?' class="r"':'')+' x="'+(bx+8)+'" y="'+(y0+58+j*20)+'">'+d[1]+'</text><text'+(d[0]?' class="r"':'')+' x="'+(bx+118)+'" y="'+(y0+58+j*20)+'" text-anchor="end">'+d[2]+'</text>'; });
  g+=ladderUp(x0,y0,p.inv);
  g+='<path d="M'+(x0+90)+' '+(y0+160)+'V'+(y0+196)+'H'+(x0+220)+'V'+(y0+160)+'" fill="none" stroke="#0F3E68" stroke-width="2"/><text class="l" x="'+(bx+63)+'" y="'+(y0+214)+'" text-anchor="middle">'+(isFinite(p.ct)?F(p.ct,0)+' s':'—')+'</text>';
 });
 var li=P.length-1, rL=Math.floor(li/per), cL=li%per+1, fx=20+cL*SW, fy=48+rL*RH;
 g+=tri(fx+45,fy+58,fg,'FG')+ladderUp(fx,fy,fg);
 var sy=48+rows*RH+4;
 g+='<rect x="20" y="'+sy+'" width="'+(W-40)+'" height="40" fill="#EDEFEA"/><text class="l" x="'+(W/2)+'" y="'+(sy+25)+'" text-anchor="middle">Lead time '+(isFinite(ltd)?F(ltd,1)+' days':'—')+'  ·  Processing time '+F(ctSum,0)+' s  ·  Value-added '+F(vaSum,0)+' s  ·  PCE '+pc(pce)+'</text>';
 SV.innerHTML=g+'</svg>';
 /* checks */
 if(isFinite(T)) f.push(['ok','Takt time is <b>'+F(T,1)+' seconds</b> ('+F(k.av,0)+' available seconds ÷ '+F(k.dem,0)+' units a day).'+(isFinite(ltd)?' Production lead time is <b>'+F(ltd,1)+' days</b> against '+F(vaSum,0)+' seconds of value-added time, so process cycle efficiency is <b>'+pc(pce)+'</b>.':'')]);
 P.forEach(function(p){
  if(!isFinite(T)||!isFinite(p.ct)) return;
  if(p.ct>T) f.push(['warn','<b>'+E(p.nm)+'</b>: C/T '+F(p.ct,0)+' s is over takt ('+(p.ct/T*100).toFixed(0)+'%). In the available time it cannot keep up with demand without overtime, extra capacity or moving work off the step.'+(isFinite(p.up)&&p.up>0&&p.up<100?' At '+F(p.up,0)+'% uptime the effective time per unit is '+F(p.ct/(p.up/100),0)+' s.':'')]);
  else if(isFinite(p.up)&&p.up>0&&p.up<=100&&p.ct/(p.up/100)>T) f.push(['warn','<b>'+E(p.nm)+'</b>: C/T '+F(p.ct,0)+' s is within takt, but at '+F(p.up,0)+'% uptime the effective time per unit is '+F(p.ct/(p.up/100),0)+' s, over takt. Downtime, not the cycle, is the constraint here.']);
 });
 if(isFinite(T)&&!missCT.length&&!P.some(function(p){return p.ct>T||(p.up>0&&p.up<=100&&p.ct/(p.up/100)>T);})) f.push(['ok','Every step runs within takt, including uptime losses.']);
 if(isFinite(T)&&ctSum>0){ var mo=ctSum/T; f.push(['','Total processing time ÷ takt = '+F(ctSum,0)+' ÷ '+F(T,1)+' = '+mo.toFixed(2)+', so at least <b>'+Math.ceil(mo-1e-9)+' operators</b> would be needed if the work were perfectly balanced to takt'+(opN?'; the map shows '+F(opSum,0)+'.':'.')]); }
 if(isFinite(days)&&days>0){
  var piles=P.filter(function(p){return isFinite(p.inv);}).map(function(p){return [p.inv,'in front of '+E(p.nm)];}); if(isFinite(fg)) piles.push([fg,'in finished goods']);
  piles.sort(function(a,b){return b[0]-a[0];});
  if(piles.length&&piles[0][0]>0) f.push(['','Largest pile: '+F(piles[0][0],0)+' units '+piles[0][1]+' ('+F(piles[0][0]/k.dem,1)+' days, '+(piles[0][0]/invU*100).toFixed(0)+'% of the inventory lead time). Waiting in inventory, not processing, is where the lead time goes.']);
 }
 if(vaSum<ctSum) f.push(['','Value-added time counts '+F(vaSum,0)+' of the '+F(ctSum,0)+' seconds of processing time; the rest (such as inspection or test) is necessary for now but adds no value the customer pays for.']);
 if(missCT.length) f.push(['warn','No C/T for: '+missCT.map(E).join(', ')+'. Processing time and the takt check leave these steps out.']);
 if(missInv.length) f.push(['warn','No inventory count in front of: '+missInv.map(E).join(', ')+'. Enter 0 if there is no queue; a blank is counted as 0.']);
 if(badUp.length) f.push(['warn','Uptime must be above 0 and at most 100%: '+badUp.map(E).join(', ')+'.']);
 if(badVa.length) f.push(['warn','Value-added seconds cannot exceed C/T: '+badVa.map(E).join(', ')+'. Capped at C/T.']);
 if(isFinite(lead)) f.push(['','Days of inventory = units ÷ daily demand (Little’s law: the pile is used at the customer rate). PCE converts lead time to seconds at '+F(k.av,0)+' working seconds per day; quoted in calendar time it would be lower still.']);
 O.innerHTML=api.flags(f);
},
example:{f:{fam:'Hydraulic hose assemblies, 1/2 in.',cust:'Tractor assembly plant',dem:'900',sh:'2',sm:'480',br:'30',fg:'3600'},
 g:{p:[{n:'Cut to length',inv:'4500',ct:'22',co:'15',up:'95',op:'1'},{n:'Skive',inv:'1350',ct:'38',co:'10',up:'90',op:'1'},{n:'Crimp fittings',inv:'2700',ct:'64',co:'45',up:'82',op:'1'},{n:'Pressure test',inv:'1800',ct:'55',co:'5',up:'98',op:'1',va:'0'},{n:'Cap, tag and pack',inv:'450',ct:'18',co:'0',up:'100',op:'1'}]}}
}
