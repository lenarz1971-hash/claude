{
slug:'wbs-gantt-chart',
sections:[
 {type:'fields',title:'Project',cols:3,fields:[{id:'name',label:'Project',wide:true},{id:'due',label:'Must finish by',type:'date'},{id:'wk',label:'Count working days only',type:'select',opts:['No, calendar days','Yes, Monday to Friday']}]},
 {type:'grid',id:'t',title:'Work breakdown',rows:5,hint:'Number the work like an outline: 1, 1.1, 1.2, 2... A row with <b>0</b> days is a milestone. Put a WBS number in <b>After</b> and the start date fills itself from that task\'s finish.',cols:[
  {id:'id',label:'WBS',w:60},{id:'task',label:'Task or deliverable',w:220,type:'textarea',rows:1},{id:'who',label:'Owner',w:100},
  {id:'start',label:'Start',type:'date'},{id:'days',label:'Days',type:'number',min:0},{id:'dep',label:'After',w:60,ph:'WBS'},
  {id:'end',label:'Finish',calc:function(r,api){var x=api.state().x.calc&&api.state().x.calc[r.id];if(!(x&&x.e)) return ''; var d=new Date(x.e+'T00:00:00'); return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});}}]},
 {type:'custom',id:'g',title:'Gantt chart',html:'<div class="svgw gt-svg"></div><div class="out gt-out"></div>'}
],
blankX:function(){return {calc:{}};},
update:function(root,api){
 var S=api.state(), n=api.num, wk=(S.f.wk||'').indexOf('Yes')===0;
 function D(s){var d=new Date(s+'T00:00:00');return isNaN(d)?null:d;}
 function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
 function add(d,k){var x=new Date(d); if(!wk){x.setDate(x.getDate()+k);return x;} var s=k>0?1:-1; k=Math.abs(k); while(k>0){x.setDate(x.getDate()+s); if(x.getDay()%6) k--;} return x;}
 function nextWork(d){var x=new Date(d); if(wk) while(!(x.getDay()%6)) x.setDate(x.getDate()+1); return x;}
 var rows=S.g.t, byId={}, calc={}, f=[];
 rows.forEach(function(r){ if(r.id) byId[r.id.trim()]=r; });
 function solve(r,seen){
  var id=(r.id||'').trim(); if(calc[id]) return calc[id]; seen=seen||{}; if(seen[id]) return null; seen[id]=1;
  var s=r.start?D(r.start):null, dep=(r.dep||'').trim(), dd=dep&&byId[dep]?solve(byId[dep],seen):null;
  var auto=false; if(!s&&dd&&dd.end){ s=nextWork(add(dd.end,1)); auto=true; if(n(r.days)===0) s=dd.end; }
  var days=n(r.days); if(!s||isNaN(days)) return (calc[id]={});
  var e=days===0?s:add(s,days-1); if(days>0&&wk&&!(s.getDay()%6)) s=nextWork(s), e=add(s,days-1);
  return (calc[id]={start:s,end:e,s:iso(s),e:iso(e),auto:auto,ms:days===0,dep:dd});
 }
 rows.forEach(function(r){ if(r.id) solve(r); });
 S.x.calc={}; Object.keys(calc).forEach(function(k){ if(calc[k].e) S.x.calc[k]={e:calc[k].e,s:calc[k].s}; });
 var trs=root.querySelectorAll('table[data-grid="t"] tbody tr');
 rows.forEach(function(r,i){ var c=calc[(r.id||'').trim()], td=trs[i]&&trs[i].querySelector('[data-c="end"]'); if(td) td.textContent=c&&c.e?new Date(c.e+'T00:00:00').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):''; if(c&&c.auto&&trs[i]){ var si=trs[i].querySelector('[data-col="start"]'); if(si){ si.classList.add('autoval'); if(!si.value) si.placeholder=c.s; } } });
 var items=rows.filter(function(r){var c=calc[(r.id||'').trim()];return c&&c.start;});
 var host=root.querySelector('.gt-svg');
 if(!items.length){ host.innerHTML=''; root.querySelector('.gt-out').innerHTML=api.flags([],'Give tasks a WBS number, a start (or an After) and a number of days.'); return; }
 var t0=Math.min.apply(null,items.map(function(r){return calc[r.id.trim()].start;})), t1=Math.max.apply(null,items.map(function(r){return calc[r.id.trim()].end;}));
 var due=S.f.due?D(S.f.due):null; if(due&&due>t1) t1=+due;
 var day=864e5, span=Math.round((t1-t0)/day)+2, L=230, W=1000, rh=26, H=items.length*rh+40, px=(W-L-10)/span;
 var x=function(d){return L+Math.round((d-t0)/day)*px;};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Gantt chart"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.d{font:600 10px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 var step=span>120?28:span>50?14:7, d0=new Date(t0); while(d0.getDay()!==1) d0.setDate(d0.getDate()-1);
 for(var d=new Date(d0); d<=t1; d.setDate(d.getDate()+step)){ if(d<t0) continue; var X=x(d); g+='<line x1="'+X+'" x2="'+X+'" y1="22" y2="'+H+'" stroke="#EDEFEA"/><text class="d" x="'+(X+2)+'" y="14">'+(d.getMonth()+1)+'/'+d.getDate()+'</text>'; }
 items.forEach(function(r,i){ var c=calc[r.id.trim()], y=30+i*rh, depth=(r.id.match(/\./g)||[]).length, lab=(r.id+' '+(r.task||'')).trim();
  g+='<text x="'+(8+depth*12)+'" y="'+(y+13)+'"'+(depth?'':' style="font-weight:700"')+'>'+api.esc(lab.length>30?lab.slice(0,29)+'…':lab)+'</text>';
  if(c.ms){ var X=x(c.start)+px/2; g+='<path d="M'+X+' '+(y+2)+' l8 8 -8 8 -8 -8z" fill="#D8B147"/>'; }
  else g+='<rect x="'+x(c.start)+'" y="'+(y+3)+'" width="'+Math.max(2,(Math.round((c.end-c.start)/day)+1)*px)+'" height="'+(rh-10)+'" rx="2" fill="'+(depth?'#0F3E68':'#9C7C1F')+'"/>';
  if(c.dep&&c.dep.end){ var j=items.indexOf(byId[r.dep.trim()]); if(j>=0){ var x1=x(c.dep.end)+px, y1=30+j*rh+rh/2; g+='<path d="M'+x1+' '+y1+' h4 V'+(y+rh/2)+' H'+(x(c.start)-1)+'" fill="none" stroke="#7C8B99" stroke-width="1"/>'; } }
 });
 var today=new Date(); today.setHours(0,0,0,0); if(today>=t0&&today<=t1){ var Xt=x(today); g+='<line x1="'+Xt+'" x2="'+Xt+'" y1="18" y2="'+H+'" stroke="#C0392B" stroke-dasharray="4 3"/><text class="d" x="'+(Xt+3)+'" y="'+(H-4)+'" style="fill:#C0392B">TODAY</text>'; }
 if(due){ var Xd=x(due)+px; g+='<line x1="'+Xd+'" x2="'+Xd+'" y1="18" y2="'+H+'" stroke="#1F8C55" stroke-width="2"/><text class="d" x="'+(Xd-3)+'" y="'+(H-4)+'" text-anchor="end" style="fill:#1F8C55">DUE</text>'; }
 host.innerHTML=g+'</svg>';
 var end=new Date(t1); var last=items.map(function(r){return calc[r.id.trim()];}).sort(function(a,b){return b.end-a.end;})[0];
 f.push(['','Planned finish: <b>'+last.end.toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'})+'</b>, '+(Math.round((last.end-t0)/day)+1)+' calendar days from the first start.']);
 if(due&&last.end>due) f.push(['warn','That is '+Math.round((last.end-due)/day)+' days after the required finish. Look at the longest chain of "After" links: shortening anything off it will not help.']);
 rows.forEach(function(r){ var id=(r.id||'').trim(); if(!r.task&&!id) return;
  if(r.dep&&!byId[r.dep.trim()]) f.push(['warn','<b>'+api.esc(id)+'</b> is after "'+api.esc(r.dep)+'", which is not a WBS number in the list.']);
  var c=calc[id]; if(c&&c.dep&&c.dep.end&&c.start&&c.start<=c.dep.end&&!c.ms) f.push(['warn','<b>'+api.esc(id)+'</b> starts on or before '+api.esc(r.dep)+' finishes.']);
  if(id&&!r.who&&!/^\d+$/.test(id)) f.push(['','<b>'+api.esc(id)+'</b> has no owner.']);
  if(!id&&r.task) f.push(['warn','"'+api.esc(r.task)+'" has no WBS number, so it cannot be scheduled.']); });
 root.querySelector('.gt-out').innerHTML=api.flags(f);
},
example:{f:{name:'Reduce seal-nick rejects on line 3',due:'2026-12-18',wk:'Yes, Monday to Friday'},
 g:{t:[{id:'1',task:'Define',who:'GB',start:'2026-07-01',days:'10'},{id:'1.1',task:'Charter and SIPOC',who:'GB',start:'2026-07-01',days:'5'},{id:'1.2',task:'VOC and stakeholders',who:'YB',dep:'1.1',days:'5'},{id:'1.3',task:'Define review',who:'Sponsor',dep:'1.2',days:'0'},
  {id:'2',task:'Measure',who:'GB',dep:'1.3',days:'20'},{id:'2.1',task:'Data collection plan and MSA',who:'YB',dep:'1.3',days:'10'},{id:'2.2',task:'Baseline data, 2 weeks',who:'YB',dep:'2.1',days:'10'},{id:'2.3',task:'Measure review',who:'Sponsor',dep:'2.2',days:'0'},
  {id:'3',task:'Analyze',who:'GB',dep:'2.3',days:'20'},{id:'4',task:'Improve: pilot the fix',who:'GB',dep:'3',days:'30'},{id:'5',task:'Control and handover',who:'Process owner',dep:'4',days:'15'},{id:'5.1',task:'Project closed',who:'Sponsor',dep:'5',days:'0'}]}}
}
