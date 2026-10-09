{
slug:'interrelationship-digraph',
sections:[
 {type:'fields',title:'The problem',cols:3,hint:'State the problem or goal the issues relate to. The issues often come straight from the header cards of an affinity diagram.',fields:[
  {id:'q',label:'Problem or goal',wide:true,ph:'e.g. Why do new-product launches run late?'},
  {id:'team',label:'Team',ph:'Names or roles'},
  {id:'date',label:'Date',type:'date'}]},
 {type:'grid',id:'i',title:'Issues',rows:5,hint:'Five to ten issues work best; with more than about fifteen the picture becomes unreadable. Give each a short ID.',cols:[
  {id:'id',label:'ID',w:50},
  {id:'t',label:'Issue',w:320,type:'textarea',rows:1}]},
 {type:'grid',id:'a',title:'Cause and effect arrows',rows:5,hint:'Take the issues two at a time and ask: does one cause or influence the other? If so, which way is the <b>stronger</b> influence? Enter one arrow, from the cause to the effect. Leave the pair out if there is no real link.',cols:[
  {id:'from',label:'From (cause)',w:80,ph:'e.g. 6'},
  {id:'to',label:'To (effect)',w:80,ph:'e.g. 5'},
  {id:'why',label:'Why (optional)',w:300,type:'textarea',rows:1}]},
 {type:'custom',id:'dg',title:'The digraph',hint:'Gold: key driver, the issue with the most arrows going out. Red: key outcome, the one with the most arrows coming in. Each box shows its arrows in and out.',html:'<div class="svgw id-svg"></div>'},
 {type:'custom',id:'res',title:'Arrow counts',html:'<div class="stat id-stat"></div><div class="tgw"><table class="tg id-tab"></table></div><div class="out id-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=[], I=[], by={};
 S.g.i.forEach(function(r){ var id=(r.id||'').trim(); if(!id){ if((r.t||'').trim()) f.push(['warn','"'+api.esc(r.t)+'" has no ID, so no arrow can point to it.']); return; } if(by[id]){ f.push(['warn','ID <b>'+api.esc(id)+'</b> is used twice.']); return; } by[id]={id:id,t:(r.t||'').trim(),o:0,n:0}; I.push(by[id]); });
 var E=[], seen={}, bad=[];
 S.g.a.forEach(function(r){ var a=(r.from||'').trim(), b=(r.to||'').trim(); if(!a&&!b) return;
  if(!by[a]||!by[b]){ bad.push(api.esc(a||'?')+' &rarr; '+api.esc(b||'?')); return; }
  if(a===b){ f.push(['warn','Arrow '+api.esc(a)+' &rarr; '+api.esc(b)+' points to itself and is ignored.']); return; }
  if(seen[a+'>'+b]){ f.push(['','Arrow '+api.esc(a)+' &rarr; '+api.esc(b)+' is entered twice; it is counted once.']); return; }
  seen[a+'>'+b]=1; E.push({a:a,b:b}); by[a].o++; by[b].n++; });
 if(bad.length) f.push(['warn','These arrows use an ID that is not in the issue list and are ignored: '+bad.join(', ')+'.']);
 var two=E.filter(function(e){ return seen[e.b+'>'+e.a]&&e.a<e.b; });
 if(two.length) f.push(['warn','Arrows both ways between '+two.map(function(e){ return '<b>'+api.esc(e.a)+'</b> and <b>'+api.esc(e.b)+'</b>'; }).join(', ')+'. The method asks for one arrow per pair, in the direction of the stronger influence. Decide which, and delete the other; both are counted until you do.']);
 var host=root.querySelector('.id-svg'), tab=root.querySelector('.id-tab'), stat=root.querySelector('.id-stat');
 if(!I.length){ host.innerHTML=''; tab.innerHTML=''; stat.innerHTML=''; root.querySelector('.id-out').innerHTML=api.flags(f,'List the issues with an ID each, then enter the arrows.'); return; }
 var maxO=Math.max.apply(null,I.map(function(x){ return x.o; })), maxN=Math.max.apply(null,I.map(function(x){ return x.n; }));
 var drv=maxO?I.filter(function(x){ return x.o===maxO; }):[], out=maxN?I.filter(function(x){ return x.n===maxN; }):[];
 function role(x){ if(!x.o&&!x.n) return 'Not connected'; if(maxO&&x.o===maxO) return 'Key driver'; if(maxN&&x.n===maxN) return 'Key outcome'; return x.o>x.n?'Driver (mostly a cause)':x.n>x.o?'Outcome (mostly an effect)':'Linking (in = out)'; }
 /* drawing: issues round a circle */
 var n=I.length, BW=150, BH=50, Ry=Math.max(140,n*28), Rx=Math.round(Ry*1.5), cx=Rx+BW/2+20, cy=Ry+BH/2+20, W=2*cx, H=2*cy, pos={};
 I.forEach(function(x,k){ var ang=-Math.PI/2+2*Math.PI*k/n; pos[x.id]={x:cx+Rx*Math.cos(ang),y:cy+Ry*Math.sin(ang)}; });
 function edgePt(p,q){ var dx=q.x-p.x, dy=q.y-p.y, t=Math.min((BW/2+3)/Math.abs(dx||1e-9),(BH/2+3)/Math.abs(dy||1e-9)); return {x:p.x+dx*t,y:p.y+dy*t}; }
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Interrelationship digraph"><defs><marker id="ida" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4A5D71"/></marker><marker id="idb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9C7C1F"/></marker></defs><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.i{font:700 10px \'IBM Plex Mono\',monospace;fill:#0F3E68}.c{font:600 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
 E.forEach(function(e){ var p=pos[e.a], q=pos[e.b], mx=(p.x+q.x)/2, my=(p.y+q.y)/2, dx=q.x-p.x, dy=q.y-p.y, L=Math.sqrt(dx*dx+dy*dy)||1, off=seen[e.b+'>'+e.a]?22:10, c={x:mx-dy/L*off,y:my+dx/L*off};
  var s=edgePt(p,c), t=edgePt(q,c), hot=drv.indexOf(by[e.a])>=0;
  g+='<path d="M'+s.x.toFixed(1)+' '+s.y.toFixed(1)+' Q'+c.x.toFixed(1)+' '+c.y.toFixed(1)+' '+t.x.toFixed(1)+' '+t.y.toFixed(1)+'" fill="none" stroke="'+(hot?'#9C7C1F':'#4A5D71')+'" stroke-width="'+(hot?1.8:1.2)+'" marker-end="url(#'+(hot?'idb':'ida')+')"/>'; });
 function wrap(s,max){ var w=String(s).split(/\s+/).filter(Boolean), L=[], cur=''; w.forEach(function(x){ if((cur+' '+x).trim().length>max&&cur){ L.push(cur); cur=x; } else cur=(cur+' '+x).trim(); }); if(cur) L.push(cur); if(L.length>2){ L=L.slice(0,2); L[1]=L[1].slice(0,max-1)+'…'; } return L; }
 I.forEach(function(x){ var p=pos[x.id], r=role(x), fill=r==='Key driver'?'#FBF5E3':r==='Key outcome'?'#FDECEA':'#fff', st=r==='Key driver'?'#9C7C1F':r==='Key outcome'?'#C0392B':'#0F3E68';
  g+='<rect x="'+(p.x-BW/2)+'" y="'+(p.y-BH/2)+'" width="'+BW+'" height="'+BH+'" rx="4" fill="'+fill+'" stroke="'+st+'" stroke-width="'+(st==='#0F3E68'?1.3:2.2)+'"/><text class="i" x="'+(p.x-BW/2+5)+'" y="'+(p.y-BH/2+12)+'">'+api.esc(x.id.length>6?x.id.slice(0,6):x.id)+'</text><text class="c" x="'+(p.x+BW/2-5)+'" y="'+(p.y-BH/2+12)+'" text-anchor="end">IN '+x.n+' &middot; OUT '+x.o+'</text>';
  wrap(x.t,26).forEach(function(l,k){ g+='<text x="'+p.x+'" y="'+(p.y+4+k*12)+'" text-anchor="middle">'+api.esc(l)+'</text>'; }); });
 host.innerHTML=g+'</svg>';
 var list=function(a){ return a.length?a.map(function(x){ return api.esc(x.id); }).join(', '):'—'; };
 stat.innerHTML='<div><b>'+n+'</b><span>Issues</span></div><div><b>'+E.length+'</b><span>Arrows</span></div><div><b>'+list(drv)+'</b><span>Key driver (most out'+(maxO?', '+maxO:'')+')</span></div><div><b>'+list(out)+'</b><span>Key outcome (most in'+(maxN?', '+maxN:'')+')</span></div>';
 tab.innerHTML='<thead><tr><th>ID</th><th>Issue</th><th>Out</th><th>In</th><th>Total</th><th>Role</th></tr></thead><tbody>'+I.map(function(x){ var r=role(x); return '<tr'+(r==='Key driver'?' class="hi-row"':'')+'><td class="calc">'+api.esc(x.id)+'</td><td>'+api.esc(x.t)+'</td><td class="calc">'+x.o+'</td><td class="calc">'+x.n+'</td><td class="calc">'+(x.o+x.n)+'</td><td>'+r+'</td></tr>'; }).join('')+'</tbody>';
 if(!E.length){ root.querySelector('.id-out').innerHTML=api.flags(f,'Enter the arrows, from cause to effect.'); return; }
 if(drv.length) f.push(['ok','Key driver'+(drv.length>1?'s':'')+': '+drv.map(function(x){ return '<b>'+api.esc(x.id)+'</b> '+api.esc(x.t); }).join('; ')+', with '+maxO+' arrows out. Work here first: improving a driver moves the issues downstream of it.']);
 if(drv.length>1) f.push(['','There is a tie for the most arrows out. Look at which of the tied issues the team can act on, or which feeds the other.']);
 if(out.length) f.push(['','Key outcome'+(out.length>1?'s':'')+': '+out.map(function(x){ return '<b>'+api.esc(x.id)+'</b> '+api.esc(x.t); }).join('; ')+', with '+maxN+' arrows in. An outcome is a symptom; it makes a good measure of success (the Y), but attacking it directly rarely lasts.']);
 var iso=I.filter(function(x){ return !x.o&&!x.n; });
 if(iso.length) f.push(['warn','Not connected to anything: '+iso.map(function(x){ return '<b>'+api.esc(x.id)+'</b>'; }).join(', ')+'. Either it does not belong to this problem, or a link was missed. Check each pair again.']);
 var pairs=n*(n-1)/2; if(n>=4&&E.length<n-1) f.push(['warn','Only '+E.length+' arrows among '+n+' issues. Work through every pair (there are '+pairs+') before trusting the counts.']);
 if(n>15) f.push(['warn',n+' issues is a lot for one digraph. Group them first with an <a href="/tools/affinity-diagram.html">affinity diagram</a> and use the header cards.']);
 if(E.length>0.6*pairs&&n>=5) f.push(['','Almost every pair has an arrow ('+E.length+' of '+pairs+'). If everything causes everything, the arrows are not discriminating; keep only the strong influences.']);
 f.push(['','The counts reflect the team\'s judgment, not data. Confirm the key driver with data before committing resources to it.']);
 root.querySelector('.id-out').innerHTML=api.flags(f);
},
example:{f:{q:'Why do new-product launches run late?',team:'Program manager, design lead, test lab supervisor, buyer, plant engineer',date:'2026-09-24'},
 g:{i:[
  {id:'1',t:'Requirements change after design freeze'},
  {id:'2',t:'Supplier tooling is late'},
  {id:'3',t:'Too few test technicians'},
  {id:'4',t:'Prototypes fail validation tests'},
  {id:'5',t:'Design reviews skipped under time pressure'},
  {id:'6',t:'Launch dates set before the plan is made'},
  {id:'7',t:'Late engineering changes reach the plant'},
  {id:'8',t:'Overtime and burnout in the project team'}],
  a:[
  {from:'6',to:'5',why:'No time in the plan for the reviews'},
  {from:'6',to:'3',why:'Test staffing is sized to the date, not the workload'},
  {from:'6',to:'8',why:''},
  {from:'6',to:'2',why:'Suppliers get too little lead time'},
  {from:'1',to:'7',why:''},
  {from:'1',to:'2',why:'Tooling is reworked to the new requirement'},
  {from:'1',to:'4',why:''},
  {from:'5',to:'4',why:'Design weaknesses are found at test instead of at review'},
  {from:'5',to:'1',why:'Gaps in the requirements surface late'},
  {from:'4',to:'7',why:''},
  {from:'4',to:'8',why:''},
  {from:'3',to:'8',why:''},
  {from:'2',to:'4',why:'Prototypes built from soft tooling'},
  {from:'7',to:'8',why:''}]}}
}
