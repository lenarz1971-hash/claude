{
slug:'lot-traceability-genealogy',
sections:[
 {type:'fields',title:'The trace',cols:3,hint:'Name the suspect lot to trace <b>forward</b> (where did it go?) and a unit, lot or shipment to trace <b>back</b> (what went into it?). Both traces run on the links in section 2.',fields:[
  {id:'prod',label:'Product',ph:'e.g. OX-7 handheld pulse oximeter'},
  {id:'owner',label:'Trace done by'},
  {id:'date',label:'Date of trace',type:'date'},
  {id:'fwd',label:'Suspect lot or serial (trace forward)',ph:'e.g. CEL-2207'},
  {id:'bwd',label:'Unit, lot or shipment (trace back)',ph:'e.g. FG-103'},
  {id:'src',label:'Records used',ph:'e.g. ERP lot records, batch records, shipping log'},
  {id:'why',label:'Reason for the trace',type:'textarea',wide:true,rows:2}]},
 {type:'grid',id:'l',title:'Genealogy links',rows:4,hint:'One row each time a lot, serial or finished lot went into something else: a component lot into a subassembly lot, a subassembly into a finished lot or serial, a finished lot into a shipment. A lot that never appears under <b>Went into</b> is treated as a purchased component or material lot. Give shipments their customer.',cols:[
  {id:'from',label:'From (lot or serial used)',w:110},
  {id:'part',label:'Part or material',w:150},
  {id:'into',label:'Went into',w:110},
  {id:'type',label:'Type of "went into"',type:'select',opts:['Subassembly lot','Finished lot','Serial number','Shipment']},
  {id:'qty',label:'Qty',type:'number',min:0,tip:'Quantity of the From lot that went into it. For a shipment: units shipped.'},
  {id:'cust',label:'Customer (shipments)',w:150},
  {id:'date',label:'Date',type:'date'}]},
 {type:'custom',id:'dia',title:'Genealogy diagram',hint:'Inputs on the left, shipments on the right. <b>Red</b>: everything the suspect lot reached. <b>Gold</b>: everything that went into the unit traced back.',html:'<div class="pillrow"><span>RED &middot; FORWARD FROM SUSPECT LOT</span><span>GOLD &middot; BACKWARD FROM UNIT</span><span>GRAY &middot; NOT IN EITHER TRACE</span></div><div class="svgw lt-svg"></div>'},
 {type:'custom',id:'fw',title:'Forward trace and recall bounding',hint:'Who received product that may contain the suspect lot. This is the population a correction, removal or recall would have to reach.',html:'<div class="stat lt-fs"></div><div class="tgw"><table class="tg lt-cust"></table></div><div class="tgw"><table class="tg lt-fwd"></table></div>'},
 {type:'custom',id:'bw',title:'Backward trace',html:'<div class="stat lt-bs"></div><div class="tgw"><table class="tg lt-bwd"></table></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out lt-out"></div>'}
],
update:function(root,api){
 var S=api.state(), esc=api.esc, n=api.num, f=[], N={}, ids=[], E=[];
 var LV={'Component lot':0,'Subassembly lot':1,'Finished lot':2,'Serial number':3,'Shipment':4};
 function node(id){ if(!N[id]){ N[id]={id:id,type:'',part:'',cust:'',ins:[],outs:[]}; ids.push(id); } return N[id]; }
 var half=0, noCust=[], shipFrom=[];
 S.g.l.forEach(function(r){
  var a=(r.from||'').trim(), b=(r.into||'').trim();
  if(!a&&!b) return;
  if(!a||!b){ half++; return; }
  if(a===b){ f.push(['warn','Row <b>'+esc(a)+'</b> goes into itself.']); return; }
  var A=node(a), B=node(b), q=n(r.qty);
  if(r.part&&!A.part) A.part=r.part;
  if(r.type){ if(B.type&&B.type!==r.type) f.push(['warn','<b>'+esc(b)+'</b> is listed as both '+esc(B.type)+' and '+esc(r.type)+'. Use one type per lot.']); else B.type=r.type; }
  if(r.cust&&!B.cust) B.cust=r.cust;
  if(r.type==='Shipment'&&!(r.cust||'').trim()&&noCust.indexOf(b)<0) noCust.push(b);
  var e={a:a,b:b,q:q}; E.push(e); A.outs.push(e); B.ins.push(e);
 });
 ids.forEach(function(id){ var x=N[id]; if(!x.type) x.type=x.ins.length?'Subassembly lot':'Component lot'; if(x.type==='Shipment'&&x.outs.length) shipFrom.push(id); });
 if(half) f.push(['warn',half+' row'+(half>1?'s have':' has')+' only one side filled in. Every link needs both a From and a Went into.']);
 if(noCust.length) f.push(['warn','Shipment'+(noCust.length>1?'s':'')+' with no customer: '+noCust.map(function(x){return '<b>'+esc(x)+'</b>';}).join(', ')+'. Without the customer, the forward trace stops short of the people who would have to be notified.']);
 if(shipFrom.length) f.push(['warn','Shipment'+(shipFrom.length>1?'s':'')+' used as an input: '+shipFrom.map(esc).join(', ')+'. A shipment is the end of the chain; check the rows.']);
 /* cycles */
 var st={}, cyc=false;
 function dfs(id){ st[id]=1; N[id].outs.forEach(function(e){ if(st[e.b]===1) cyc=true; else if(!st[e.b]) dfs(e.b); }); st[id]=2; }
 ids.forEach(function(id){ if(!st[id]) dfs(id); });
 var out=root.querySelector('.lt-out'), svg=root.querySelector('.lt-svg');
 function clr(){ ['.lt-fs','.lt-cust','.lt-fwd','.lt-bs','.lt-bwd'].forEach(function(s){ root.querySelector(s).innerHTML=''; }); }
 if(cyc){ f.push(['warn','The links loop back on themselves: a lot cannot go into something that went into it. Check the rows.']); svg.innerHTML=''; clr(); out.innerHTML=api.flags(f); return; }
 if(!ids.length){ svg.innerHTML=''; clr(); out.innerHTML=api.flags(f,'Enter the links between lots, and the traces appear here.'); return; }
 function reach(id,dir){ var seen={}, q=[id], d={}; d[id]=0; seen[id]=1; while(q.length){ var c=q.shift(); (dir>0?N[c].outs:N[c].ins).forEach(function(e){ var k=dir>0?e.b:e.a; if(!seen[k]){ seen[k]=1; d[k]=d[c]+1; q.push(k); } }); } return d; }
 var fid=(S.f.fwd||'').trim(), bid=(S.f.bwd||'').trim(), FW=null, BW=null;
 if(fid){ if(N[fid]) FW=reach(fid,1); else f.push(['warn','The suspect lot <b>'+esc(fid)+'</b> does not appear in the links. Check the ID; a lot missing from the record cannot be traced.']); }
 if(bid){ if(N[bid]) BW=reach(bid,-1); else f.push(['warn','<b>'+esc(bid)+'</b> (trace back) does not appear in the links.']); }
 /* layout: column = longest path from an input; shipments in the last column */
 var col={};
 function c(id){ if(col[id]!=null) return col[id]; var m=0; N[id].ins.forEach(function(e){ m=Math.max(m,c(e.a)+1); }); col[id]=m; return m; }
 ids.forEach(c); var maxc=0; ids.forEach(function(id){ maxc=Math.max(maxc,col[id]); });
 ids.forEach(function(id){ if(N[id].type==='Shipment') col[id]=maxc; });
 var cols=[]; for(var i=0;i<=maxc;i++) cols.push([]);
 ids.forEach(function(id){ cols[col[id]].push(id); });
 var Y={};
 cols.forEach(function(cl,ci){ if(ci){ cl.forEach(function(id){ var ys=N[id].ins.map(function(e){ return Y[e.a]; }).filter(function(v){ return v!=null; }); N[id].bary=ys.length?ys.reduce(function(a,b){return a+b;},0)/ys.length:1e9; }); cl.sort(function(a,b){ return N[a].bary-N[b].bary; }); } cl.forEach(function(id,k){ Y[id]=k; }); });
 var CW=190, BW0=138, BH=38, RH=50, top=34, rows=Math.max.apply(null,cols.map(function(x){return x.length;})), W=Math.max(640,cols.length*CW+10), H=top+rows*RH+6;
 var off=cols.map(function(cl){ return (rows-cl.length)*RH/2; });
 function px(id){ return 10+col[id]*CW; } function py(id){ return top+off[col[id]]+Y[id]*RH; }
 function inF(id){ return FW&&FW[id]!=null; } function inB(id){ return BW&&BW[id]!=null; }
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Lot genealogy diagram"><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.i{font:700 10.5px \'IBM Plex Mono\',monospace;fill:#0F3E68}.h{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.06em}</style>';
 cols.forEach(function(cl,ci){ var cnt={}; cl.forEach(function(id){ cnt[N[id].type]=(cnt[N[id].type]||0)+1; }); var t=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a];})[0]||''; g+='<text class="h" x="'+(10+ci*CW+BW0/2)+'" y="14" text-anchor="middle">'+esc(t.toUpperCase())+(Object.keys(cnt).length>1?' ETC.':'')+'</text>'; });
 E.forEach(function(e){ var x1=px(e.a)+BW0, y1=py(e.a)+BH/2, x2=px(e.b), y2=py(e.b)+BH/2, m=(x1+x2)/2;
  var hot=inF(e.a)&&inF(e.b), gold=inB(e.a)&&inB(e.b);
  g+='<path d="M'+x1+' '+y1+' C'+m+' '+y1+' '+m+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="'+(hot?'#C0392B':gold?'#9C7C1F':'#B8C2CC')+'" stroke-width="'+(hot||gold?1.8:1.1)+'"/>'; });
 ids.forEach(function(id){ var x=px(id), y=py(id), nd=N[id], F=inF(id), B=inB(id);
  var fill=F?'#FDECEA':B?'#FBF3DC':'#fff', stroke=F?'#C0392B':B?'#9C7C1F':'#8795A3', sw=(id===fid||id===bid)?2.6:1.3;
  var sub=nd.type==='Shipment'?(nd.cust||'no customer'):(nd.part||nd.type);
  if(sub.length>22) sub=sub.slice(0,21)+'…';
  g+='<rect x="'+x+'" y="'+y+'" width="'+BW0+'" height="'+BH+'" rx="3" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"'+(F&&B?' stroke-dasharray="5 2"':'')+'/><text class="i" x="'+(x+7)+'" y="'+(y+15)+'">'+esc(id.length>18?id.slice(0,17)+'…':id)+'</text><text x="'+(x+7)+'" y="'+(y+30)+'">'+esc(sub)+'</text>'; });
 svg.innerHTML=g+'</svg>';
 /* forward trace */
 var fs=root.querySelector('.lt-fs'), ct=root.querySelector('.lt-cust'), ft=root.querySelector('.lt-fwd');
 if(FW){
  var aff=Object.keys(FW).filter(function(id){ return id!==fid; }), ships=aff.filter(function(id){ return N[id].type==='Shipment'; });
  var C={}, corder=[], units=0, qmiss=0;
  ships.forEach(function(s){ var nd=N[s], cu=(nd.cust||'(no customer)').trim(), q=0, lots=[];
   nd.ins.forEach(function(e){ if(inF(e.a)){ lots.push(e.a); if(isNaN(e.q)) qmiss++; else q+=e.q; } });
   if(!C[cu]){ C[cu]={s:[],lots:[],q:0}; corder.push(cu); } C[cu].s.push(s); lots.forEach(function(l){ if(C[cu].lots.indexOf(l)<0) C[cu].lots.push(l); }); C[cu].q+=q; units+=q; });
  var made=aff.filter(function(id){ return N[id].type==='Finished lot'||N[id].type==='Serial number'; });
  fs.innerHTML='<div><b>'+aff.filter(function(id){return N[id].type!=='Shipment';}).length+'</b><span>Lots and serials reached</span></div><div><b>'+made.length+'</b><span>Finished lots and serials</span></div><div><b>'+ships.length+'</b><span>Shipments</span></div><div><b>'+corder.length+'</b><span>Customers to notify</span></div><div><b>'+api.fmt(units,0)+(qmiss?'+':'')+'</b><span>Units shipped in scope</span></div>';
  ct.innerHTML=corder.length?'<thead><tr><th>Customer</th><th>Shipments</th><th>Lots or serials shipped</th><th>Units</th></tr></thead><tbody>'+corder.map(function(cu){ var x=C[cu]; return '<tr><td>'+esc(cu)+'</td><td>'+x.s.map(esc).join(', ')+'</td><td>'+x.lots.map(esc).join(', ')+'</td><td class="calc">'+api.fmt(x.q,0)+'</td></tr>'; }).join('')+'</tbody>':'';
  var order=aff.slice().sort(function(a,b){ return FW[a]-FW[b]||col[a]-col[b]; });
  ft.innerHTML=order.length?'<thead><tr><th>Step</th><th>Lot, serial or shipment</th><th>Type</th><th>Part or customer</th><th>Came from (in trace)</th></tr></thead><tbody>'+order.map(function(id){ var nd=N[id]; return '<tr><td class="calc">'+FW[id]+'</td><td><b>'+esc(id)+'</b></td><td>'+esc(nd.type)+'</td><td>'+esc(nd.type==='Shipment'?nd.cust:nd.part)+'</td><td>'+nd.ins.filter(function(e){return inF(e.a);}).map(function(e){return esc(e.a);}).join(', ')+'</td></tr>'; }).join('')+'</tbody>':'';
  if(!aff.length) f.push(['ok','<b>'+esc(fid)+'</b> has not gone into anything yet. Hold it in place; nothing has left the building.']);
  else f.push(['warn','Forward trace of <b>'+esc(fid)+'</b>: '+aff.length+' lots, serials and shipments reached; '+ships.length+' shipment'+(ships.length===1?'':'s')+' to '+corder.length+' customer'+(corder.length===1?'':'s')+(units?', '+api.fmt(units,0)+' units':'')+'. That is the recall boundary on the present record.']);
  /* commingling: an affected lot that also used another lot of the same part */
  aff.forEach(function(id){ var nd=N[id]; if(nd.type==='Shipment') return;
   var hotParts={}; nd.ins.forEach(function(e){ if(inF(e.a)||e.a===fid) hotParts[(N[e.a].part||'').toLowerCase()]=e.a; });
   var mix=nd.ins.filter(function(e){ var p=(N[e.a].part||'').toLowerCase(); return !inF(e.a)&&p&&hotParts[p]; });
   if(mix.length) f.push(['warn','<b>'+esc(id)+'</b> was built from '+esc(hotParts[(N[mix[0].a].part||'').toLowerCase()])+' and also from '+mix.map(function(e){return esc(e.a);}).join(', ')+' (same part: '+esc(N[mix[0].a].part)+'). Unless a record shows which units got which lot, every unit of '+esc(id)+' is in scope. Finer traceability (serial level) narrows a recall.']); });
  var held=made.filter(function(id){ return !Object.keys(reach(id,1)).some(function(k){ return N[k].type==='Shipment'; }); });
  if(held.length) f.push(['','Not shipped: '+held.map(function(x){return '<b>'+esc(x)+'</b>';}).join(', ')+'. Quarantine them now.']);
  var part=made.filter(function(id){ return held.indexOf(id)<0; });
  if(part.length) f.push(['','Check stock, work in process and returns for any units of '+part.map(esc).join(', ')+' not yet shipped, and hold them. The links show what shipped, not what is left.']);
  if(qmiss) f.push(['warn',qmiss+' shipment link'+(qmiss>1?'s have':' has')+' no quantity, so the unit count is a minimum.']);
 } else { fs.innerHTML=''; ct.innerHTML=''; ft.innerHTML=''; }
 /* backward trace */
 var bs=root.querySelector('.lt-bs'), bt=root.querySelector('.lt-bwd');
 if(BW){
  var anc=Object.keys(BW).filter(function(id){ return id!==bid; }), comps=anc.filter(function(id){ return !N[id].ins.length; }), parts={};
  comps.forEach(function(id){ var p=N[id].part||'(part not named)'; (parts[p]=parts[p]||[]).push(id); });
  var gens=anc.length?Math.max.apply(null,anc.map(function(id){return BW[id];})):0;
  bs.innerHTML='<div><b>'+anc.length+'</b><span>Lots and serials in its history</span></div><div><b>'+comps.length+'</b><span>Component or material lots</span></div><div><b>'+Object.keys(parts).length+'</b><span>Different parts</span></div><div><b>'+gens+'</b><span>Levels back</span></div>';
  var ord=anc.slice().sort(function(a,b){ return BW[a]-BW[b]||col[b]-col[a]; });
  bt.innerHTML=ord.length?'<thead><tr><th>Back</th><th>Lot or serial</th><th>Type</th><th>Part or material</th><th>Went into (in trace)</th></tr></thead><tbody>'+ord.map(function(id){ var nd=N[id]; return '<tr'+(id===fid?' class="hi-row"':'')+'><td class="calc">'+BW[id]+'</td><td><b>'+esc(id)+'</b></td><td>'+esc(nd.type)+'</td><td>'+esc(nd.part)+'</td><td>'+nd.outs.filter(function(e){return inB(e.b);}).map(function(e){return esc(e.b);}).join(', ')+'</td></tr>'; }).join('')+'</tbody>':'';
  if(!anc.length) f.push(['warn','<b>'+esc(bid)+'</b> has no inputs recorded. A finished unit with no genealogy cannot be traced back; the record has a gap.']);
  else f.push(['','Backward trace of <b>'+esc(bid)+'</b>: '+comps.length+' component or material lot'+(comps.length===1?'':'s')+' across '+Object.keys(parts).length+' part'+(Object.keys(parts).length===1?'':'s')+': '+Object.keys(parts).map(function(p){ return esc(p)+' ('+parts[p].map(esc).join(', ')+')'; }).join('; ')+'.']);
  var multi=Object.keys(parts).filter(function(p){ return parts[p].length>1&&p!=='(part not named)'; });
  if(multi.length) f.push(['','More than one lot of the same part is in its history ('+multi.map(esc).join('; ')+'). The record cannot say which one a given unit contains; treat it as containing any of them.']);
  if(fid&&N[fid]){ f.push(BW[fid]!=null?['warn','<b>'+esc(bid)+'</b> contains the suspect lot <b>'+esc(fid)+'</b>. It is inside the recall boundary.']:['ok','<b>'+esc(bid)+'</b> does not contain the suspect lot <b>'+esc(fid)+'</b> on this record. It is outside the recall boundary.']); }
 } else { bs.innerHTML=''; bt.innerHTML=''; }
 var noPart=ids.filter(function(id){ return N[id].outs.length&&!N[id].part; });
 if(noPart.length) f.push(['','No part named for '+noPart.slice(0,6).map(esc).join(', ')+(noPart.length>6?' and others':'')+'. Naming the part lets the tool spot mixed lots of the same part.']);
 f.push(['','The trace is only as good as the records. Test it the way an auditor would: pick a shipped unit and trace it back to the component lots, then pick a component lot and find every customer, and time both.']);
 out.innerHTML=api.flags(f);
},
example:{f:{prod:'OX-7 handheld pulse oximeter, Kestrova Devices',owner:'R. Okafor, quality engineer',date:'2026-10-06',fwd:'CEL-2207',bwd:'FG-103',src:'ERP lot genealogy, device history records, shipping log',
 why:'Supplier notice: lithium-ion cell lot CEL-2207 may have a separator defect that can make cells swell. Find every unit and customer that received it, and confirm finished lot FG-103 is clear before its remaining stock is released.'},
 g:{l:[
  {from:'CEL-2207',part:'Lithium-ion cell',into:'BP-0610',type:'Subassembly lot',qty:'400',date:'2026-07-08'},
  {from:'CEL-2211',part:'Lithium-ion cell',into:'BP-0611',type:'Subassembly lot',qty:'400',date:'2026-07-15'},
  {from:'PCB-1145',part:'Bare circuit board',into:'MB-0412',type:'Subassembly lot',qty:'150',date:'2026-07-09'},
  {from:'PCB-1146',part:'Bare circuit board',into:'MB-0413',type:'Subassembly lot',qty:'150',date:'2026-07-16'},
  {from:'BP-0610',part:'Battery pack',into:'FG-101',type:'Finished lot',qty:'120',date:'2026-07-21'},
  {from:'BP-0610',part:'Battery pack',into:'FG-102',type:'Finished lot',qty:'80',date:'2026-07-28'},
  {from:'BP-0611',part:'Battery pack',into:'FG-102',type:'Finished lot',qty:'40',date:'2026-07-28'},
  {from:'BP-0611',part:'Battery pack',into:'FG-103',type:'Finished lot',qty:'120',date:'2026-08-04'},
  {from:'MB-0412',part:'Main board assembly',into:'FG-101',type:'Finished lot',qty:'120',date:'2026-07-21'},
  {from:'MB-0412',part:'Main board assembly',into:'FG-102',type:'Finished lot',qty:'30',date:'2026-07-28'},
  {from:'MB-0413',part:'Main board assembly',into:'FG-102',type:'Finished lot',qty:'90',date:'2026-07-28'},
  {from:'MB-0413',part:'Main board assembly',into:'FG-103',type:'Finished lot',qty:'120',date:'2026-08-04'},
  {from:'FG-101',part:'OX-7 oximeter',into:'SH-5501',type:'Shipment',qty:'80',cust:'Velmora Medical Supply',date:'2026-07-30'},
  {from:'FG-101',part:'OX-7 oximeter',into:'SH-5502',type:'Shipment',qty:'40',cust:'Quillon Care Group',date:'2026-08-02'},
  {from:'FG-102',part:'OX-7 oximeter',into:'SH-5503',type:'Shipment',qty:'60',cust:'Velmora Medical Supply',date:'2026-08-11'},
  {from:'FG-102',part:'OX-7 oximeter',into:'SH-5504',type:'Shipment',qty:'30',cust:'Tarvex Home Health',date:'2026-08-14'},
  {from:'FG-103',part:'OX-7 oximeter',into:'SH-5505',type:'Shipment',qty:'100',cust:'Ambrel Clinics',date:'2026-08-20'}]}}
}
