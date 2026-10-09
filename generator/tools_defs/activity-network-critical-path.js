{
slug:'activity-network-critical-path',
sections:[
 {type:'fields',title:'Project',cols:3,fields:[
  {id:'name',label:'Project',wide:true,ph:'e.g. Move the seal line to bay 4'},
  {id:'unit',label:'Time unit',type:'select',opts:['days','weeks','hours']},
  {id:'target',label:'Target duration',type:'number',min:0,hint:'Optional. Gives the chance of finishing by then.'},
  {id:'near',label:'Near-critical if slack is at most',type:'number',min:0,hint:'Optional. Flags paths that could become critical.'}]},
 {type:'grid',id:'a',title:'Activities',rows:4,hint:'One row per activity. <b>Before it</b> lists the activities that must finish first, separated by commas. For a fixed duration fill in <b>Most likely</b> only. For PERT, give all three estimates: the expected time is (a + 4m + b) / 6.',cols:[
  {id:'id',label:'ID',w:50},
  {id:'task',label:'Activity',w:220,type:'textarea',rows:1},
  {id:'pred',label:'Before it',w:90,ph:'e.g. A, B'},
  {id:'a',label:'Optimistic a',type:'number',min:0},
  {id:'m',label:'Most likely m',type:'number',min:0},
  {id:'b',label:'Pessimistic b',type:'number',min:0},
  {id:'who',label:'Owner',w:110}]},
 {type:'custom',id:'res',title:'Schedule',hint:'ES and EF are the earliest start and finish, from a forward pass. LS and LF are the latest start and finish that do not delay the project, from a backward pass. Slack = LS &minus; ES. Activities with zero slack form the critical path.',html:'<div class="stat cp-stat"></div><div class="tgw"><table class="tg cp-tab"></table></div>'},
 {type:'custom',id:'net',title:'Activity network',hint:'Activity on node. Each box shows ES, duration and EF on top, LS, slack and LF underneath. The critical path is in red.',html:'<div class="svgw cp-svg"></div>'},
 {type:'custom',id:'chk',title:'Reading it',html:'<div class="out cp-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], u=S.f.unit||'days', fmt=function(v){return api.fmt(v,2).replace(/\.00$/,'');};
 var rows=S.g.a.filter(function(r){return (r.id||'').trim();}), A={}, ids=[];
 rows.forEach(function(r){ var id=r.id.trim(); if(A[id]){ f.push(['warn','ID <b>'+api.esc(id)+'</b> is used twice; only the first row is used.']); return; }
  var a=n(r.a), m=n(r.m), b=n(r.b), te, v=0, pert=false;
  if(!isNaN(a)&&!isNaN(m)&&!isNaN(b)){ te=(a+4*m+b)/6; v=Math.pow((b-a)/6,2); pert=true; if(!(a<=m&&m<=b)) f.push(['warn','<b>'+api.esc(id)+'</b>: the estimates should run a &le; m &le; b.']); }
  else if(!isNaN(m)) te=m; else if(!isNaN(a)&&!isNaN(b)) { te=(a+b)/2; f.push(['warn','<b>'+api.esc(id)+'</b> has no most-likely time; the midpoint of a and b is used.']); }
  else te=NaN;
  if(isNaN(te)) f.push(['warn','<b>'+api.esc(id)+'</b> has no duration.']);
  A[id]={id:id,r:r,te:te,v:v,pert:pert,pred:(r.pred||'').split(/[,;\s]+/).map(function(x){return x.trim();}).filter(Boolean),succ:[]}; ids.push(id); });
 ids.forEach(function(id){ var a=A[id]; a.pred=a.pred.filter(function(p){ if(!A[p]){ f.push(['warn','<b>'+api.esc(id)+'</b> follows "'+api.esc(p)+'", which is not an ID in the list.']); return false; } if(p===id){ f.push(['warn','<b>'+api.esc(id)+'</b> lists itself.']); return false; } return true; }); a.pred.forEach(function(p){ A[p].succ.push(id); }); });
 /* topological order (Kahn) */
 var indeg={}, topo=[], q=[]; ids.forEach(function(id){ indeg[id]=A[id].pred.length; if(!indeg[id]) q.push(id); });
 while(q.length){ var c=q.shift(); topo.push(c); A[c].succ.forEach(function(s){ if(--indeg[s]===0) q.push(s); }); }
 var tab=root.querySelector('.cp-tab'), host=root.querySelector('.cp-svg'), st=root.querySelector('.cp-stat');
 if(topo.length<ids.length){ f.push(['warn','There is a loop in the "Before it" links among '+ids.filter(function(id){return topo.indexOf(id)<0;}).map(api.esc).join(', ')+'. A network cannot loop back on itself.']); }
 var ok=topo.length===ids.length&&ids.length&&ids.every(function(id){return !isNaN(A[id].te);});
 if(!ok){ tab.innerHTML=''; host.innerHTML=''; st.innerHTML=''; root.querySelector('.cp-out').innerHTML=api.flags(f,'Give each activity an ID, a duration and the activities before it.'); return; }
 topo.forEach(function(id){ var a=A[id]; a.es=a.pred.length?Math.max.apply(null,a.pred.map(function(p){return A[p].ef;})):0; a.ef=a.es+a.te; });
 var T=Math.max.apply(null,ids.map(function(id){return A[id].ef;})), eps=1e-9;
 topo.slice().reverse().forEach(function(id){ var a=A[id]; a.lf=a.succ.length?Math.min.apply(null,a.succ.map(function(s){return A[s].ls;})):T; a.ls=a.lf-a.te; a.sl=a.ls-a.es; a.crit=Math.abs(a.sl)<eps; });
 /* critical paths: walk critical activities from critical starts */
 var paths=[]; function walk(id,p){ p=p.concat(id); var nx=A[id].succ.filter(function(s){return A[s].crit&&Math.abs(A[s].es-A[id].ef)<eps;}); if(!nx.length){ if(Math.abs(A[id].ef-T)<eps) paths.push(p); return; } nx.forEach(function(s){ walk(s,p); }); }
 ids.filter(function(id){return A[id].crit&&!A[id].pred.some(function(p){return A[p].crit&&Math.abs(A[p].ef-A[id].es)<eps;});}).forEach(function(id){ if(paths.length<20) walk(id,[]); });
 var main=paths[0]||[], varT=main.reduce(function(s,id){return s+A[id].v;},0), sd=Math.sqrt(varT), anyPert=ids.some(function(id){return A[id].pert;});
 function Phi(z){ var t=1/(1+0.2316419*Math.abs(z)), d=0.3989422804014327*Math.exp(-z*z/2), p=d*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429)))); return z>0?1-p:p; }
 var h='<div><b>'+fmt(T)+'</b><span>'+(anyPert?'Expected project duration, ':'Project duration, ')+u+'</span></div><div><b>'+main.map(api.esc).join('&ndash;')+'</b><span>Critical path'+(paths.length>1?' (1 of '+paths.length+')':'')+'</span></div>';
 if(anyPert) h+='<div><b>'+api.fmt(sd,2)+'</b><span>Std dev of critical path, '+u+'</span></div>';
 var tgt=n(S.f.target);
 if(!isNaN(tgt)&&anyPert&&sd>0){ var z=(tgt-T)/sd, P=Phi(z); h+='<div><b>'+api.fmt(100*P,1)+'%</b><span>Chance of finishing by '+fmt(tgt)+' '+u+' (z = '+api.fmt(z,2)+')</span></div>'; }
 st.innerHTML=h;
 tab.innerHTML='<thead><tr><th>ID</th><th>Activity</th><th>Before it</th><th>t<sub>e</sub></th>'+(anyPert?'<th>Std dev</th>':'')+'<th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Slack</th><th></th></tr></thead><tbody>'+topo.map(function(id){ var a=A[id];
  return '<tr'+(a.crit?' class="hi-row"':'')+'><td class="calc">'+api.esc(id)+'</td><td>'+api.esc(a.r.task||'')+'</td><td class="calc">'+(a.pred.length?api.esc(a.pred.join(', ')):'&ndash;')+'</td><td class="calc">'+fmt(a.te)+'</td>'+(anyPert?'<td class="calc">'+(a.pert?api.fmt(Math.sqrt(a.v),2):'&ndash;')+'</td>':'')+'<td class="calc">'+fmt(a.es)+'</td><td class="calc">'+fmt(a.ef)+'</td><td class="calc">'+fmt(a.ls)+'</td><td class="calc">'+fmt(a.lf)+'</td><td class="calc">'+fmt(a.sl)+'</td><td class="calc">'+(a.crit?'CRITICAL':'')+'</td></tr>'; }).join('')+'</tbody>';
 /* network diagram: columns by longest chain of predecessors */
 var lvl={}; topo.forEach(function(id){ lvl[id]=A[id].pred.length?1+Math.max.apply(null,A[id].pred.map(function(p){return lvl[p];})):0; });
 var cols=[]; topo.forEach(function(id){ (cols[lvl[id]]=cols[lvl[id]]||[]).push(id); });
 var BW=130, BH=62, CW=180, RH=86, maxR=Math.max.apply(null,cols.map(function(c){return c.length;})), W=cols.length*CW+20, H=maxR*RH+20, pos={};
 cols.forEach(function(c,i){ var off=(maxR-c.length)*RH/2; c.forEach(function(id,j){ pos[id]={x:10+i*CW,y:10+off+j*RH}; }); });
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Activity network"><defs><marker id="cpa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4A5D71"/></marker><marker id="cpr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C0392B"/></marker></defs><style>text{font:11px Archivo,sans-serif;fill:#16273A}.m{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.i{font:800 12px Archivo,sans-serif;fill:#0F3E68}</style>';
 ids.forEach(function(id){ A[id].succ.forEach(function(s){ var p=pos[id], q2=pos[s], cr=A[id].crit&&A[s].crit&&Math.abs(A[s].es-A[id].ef)<eps;
  g+='<path d="M'+(p.x+BW)+' '+(p.y+BH/2)+' C'+(p.x+BW+30)+' '+(p.y+BH/2)+' '+(q2.x-30)+' '+(q2.y+BH/2)+' '+(q2.x-2)+' '+(q2.y+BH/2)+'" fill="none" stroke="'+(cr?'#C0392B':'#9AA6B1')+'" stroke-width="'+(cr?2.2:1.2)+'" marker-end="url(#'+(cr?'cpr':'cpa')+')"/>'; }); });
 ids.forEach(function(id){ var a=A[id], p=pos[id], c=a.crit?'#C0392B':'#0F3E68', nm=(a.r.task||'');
  if(nm.length>20) nm=nm.slice(0,19)+'…';
  g+='<rect x="'+p.x+'" y="'+p.y+'" width="'+BW+'" height="'+BH+'" rx="3" fill="'+(a.crit?'#FDECEA':'#fff')+'" stroke="'+c+'" stroke-width="'+(a.crit?2:1.3)+'"/>'+
   '<line x1="'+p.x+'" x2="'+(p.x+BW)+'" y1="'+(p.y+18)+'" y2="'+(p.y+18)+'" stroke="#DCDFD8"/><line x1="'+p.x+'" x2="'+(p.x+BW)+'" y1="'+(p.y+BH-18)+'" y2="'+(p.y+BH-18)+'" stroke="#DCDFD8"/>'+
   '<text class="m" x="'+(p.x+5)+'" y="'+(p.y+13)+'">'+fmt(a.es)+'</text><text class="m" x="'+(p.x+BW/2)+'" y="'+(p.y+13)+'" text-anchor="middle">'+fmt(a.te)+'</text><text class="m" x="'+(p.x+BW-5)+'" y="'+(p.y+13)+'" text-anchor="end">'+fmt(a.ef)+'</text>'+
   '<text class="i" x="'+(p.x+5)+'" y="'+(p.y+35)+'">'+api.esc(id)+'</text><text x="'+(p.x+22+id.length*4)+'" y="'+(p.y+35)+'">'+api.esc(nm)+'</text>'+
   '<text class="m" x="'+(p.x+5)+'" y="'+(p.y+BH-5)+'">'+fmt(a.ls)+'</text><text class="m" x="'+(p.x+BW/2)+'" y="'+(p.y+BH-5)+'" text-anchor="middle"'+(a.crit?' style="fill:#C0392B"':'')+'>'+fmt(a.sl)+'</text><text class="m" x="'+(p.x+BW-5)+'" y="'+(p.y+BH-5)+'" text-anchor="end">'+fmt(a.lf)+'</text>'; });
 host.innerHTML=g+'</svg>';
 /* findings */
 f.push(['','The project takes '+fmt(T)+' '+u+(anyPert?' on expected times':'')+'. Shortening anything off the critical path does not shorten the project; it only adds slack.']);
 if(paths.length>1) f.push(['warn',paths.length+' critical paths: '+paths.slice(0,4).map(function(p){return p.map(api.esc).join('&ndash;');}).join('; ')+'. Each of them has to be shortened to bring the finish in.']);
 var near=n(S.f.near); if(!isNaN(near)){ var nc=ids.filter(function(id){return !A[id].crit&&A[id].sl<=near+eps;}); if(nc.length) f.push(['warn','Near-critical (slack &le; '+fmt(near)+'): '+nc.map(function(id){return '<b>'+api.esc(id)+'</b> ('+fmt(A[id].sl)+')';}).join(', ')+'. A small slip there makes a new critical path.']); }
 if(anyPert){ var nonP=main.filter(function(id){return !A[id].pert;}); if(nonP.length) f.push(['','Critical activities with one estimate only ('+nonP.map(api.esc).join(', ')+') add no variance, so the spread is understated.']);
  f.push(['','The probability assumes the critical path\'s total is roughly normal (many activities, central limit theorem) and ignores paths that are nearly critical. Both make it optimistic.']);
  if(!isNaN(tgt)&&sd>0&&Phi((tgt-T)/sd)<0.5) f.push(['warn','The target is shorter than the expected duration, so it is more likely to be missed than met.']); }
 root.querySelector('.cp-out').innerHTML=api.flags(f);
},
example:{f:{name:'Move the seal-installation cell to a new bay',unit:'days',target:'30',near:'2'},
 g:{a:[
  {id:'A',task:'Approve layout and budget',pred:'',a:'2',m:'3',b:'6',who:'Plant manager'},
  {id:'B',task:'Order new conveyor section',pred:'A',a:'8',m:'12',b:'20',who:'Purchasing'},
  {id:'C',task:'Prepare floor and utilities',pred:'A',a:'5',m:'7',b:'10',who:'Facilities'},
  {id:'D',task:'Move and level equipment',pred:'C',a:'2',m:'3',b:'5',who:'Maintenance'},
  {id:'E',task:'Install conveyor',pred:'B, D',a:'3',m:'4',b:'6',who:'Maintenance'},
  {id:'F',task:'Update work instructions',pred:'A',a:'3',m:'5',b:'8',who:'Quality'},
  {id:'G',task:'Requalify cell: first article and capability',pred:'E, F',a:'2',m:'4',b:'9',who:'Quality'},
  {id:'H',task:'Train operators',pred:'F',a:'2',m:'3',b:'4',who:'Supervisor'},
  {id:'I',task:'Release to production',pred:'G, H',a:'1',m:'1',b:'1',who:'Plant manager'}]}}
}
