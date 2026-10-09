{
slug:'fault-tree-analysis',
sections:[
 {type:'fields',title:'The top event',cols:3,hint:'The top event is the one failure you are analyzing, stated precisely: what fails, in what condition. A vague top event ("pump problem") gives a vague tree.',fields:[
  {id:'sys',label:'System',ph:'e.g. Coolant pump PX-40'},
  {id:'top',label:'Top event',wide:true,ph:'e.g. No coolant flow while the motor is running'},
  {id:'per',label:'Probabilities are per',ph:'e.g. year of operation, demand, 1000 hours'},
  {id:'team',label:'Team'}]},
 {type:'custom',id:'key',title:'Symbols',hint:'Build the tree from the top down. Each gate lists its inputs by ID. An <b>OR gate</b> occurs if any input occurs; an <b>AND gate</b> only if all of them do. Basic events are where the tree stops, and need a probability.',html:'<div class="pillrow"><span>OR GATE &middot; ANY INPUT</span><span>AND GATE &middot; ALL INPUTS</span><span>CIRCLE &middot; BASIC EVENT</span><span>DIAMOND &middot; UNDEVELOPED EVENT</span></div>'},
 {type:'grid',id:'e',title:'Gates and events',rows:4,hint:'The first gate that is not an input to any other gate is the top. The same basic event can feed several gates; the calculation handles the repeat correctly.',cols:[
  {id:'id',label:'ID',w:60},
  {id:'txt',label:'Event',w:240,type:'textarea',rows:1},
  {id:'type',label:'Type',type:'select',opts:['OR gate','AND gate','Basic event','Undeveloped event']},
  {id:'in',label:'Inputs (gates only)',w:120,ph:'e.g. G2, B1'},
  {id:'p',label:'Probability',type:'number',min:0,max:1,tip:'Basic and undeveloped events: probability, 0 to 1'},
  {id:'src',label:'Source of the probability',w:150}]},
 {type:'custom',id:'tree',title:'The tree',html:'<div class="svgw ft-svg"></div>'},
 {type:'custom',id:'res',title:'Results',hint:'A <b>minimal cut set</b> is a smallest combination of basic events that causes the top event on its own. A cut set of one event is a single point of failure.',html:'<div class="stat ft-stat"></div><div class="tgw"><table class="tg ft-cuts"></table></div><div class="out ft-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], E={}, ids=[];
 S.g.e.forEach(function(r){ var id=(r.id||'').trim(); if(!id) { if(r.txt) f.push(['warn','"'+api.esc(r.txt)+'" has no ID.']); return; } if(E[id]){ f.push(['warn','ID <b>'+api.esc(id)+'</b> is used twice.']); return; }
  var gate=/gate/.test(r.type||''); E[id]={id:id,r:r,gate:gate,and:r.type==='AND gate',ins:gate?(r.in||'').split(/[,;\s]+/).filter(Boolean):[],p:n(r.p)}; ids.push(id); });
 var used={}; ids.forEach(function(id){ var e=E[id]; e.ins=e.ins.filter(function(x){ if(!E[x]){ f.push(['warn','Gate <b>'+api.esc(id)+'</b> has input "'+api.esc(x)+'", which is not an ID.']); return false; } used[x]=1; return true; });
  if(e.gate&&e.ins.length<2) f.push(['warn','Gate <b>'+api.esc(id)+'</b> has '+e.ins.length+' input'+(e.ins.length===1?'':'s')+'. A gate needs at least two; with one, it is just a restatement.']);
  if(!e.gate&&(isNaN(e.p)||e.p<0||e.p>1)) f.push(['warn','<b>'+api.esc(id)+'</b> needs a probability between 0 and 1.']); });
 var tops=ids.filter(function(id){ return E[id].gate&&!used[id]; }), host=root.querySelector('.ft-svg'), stat=root.querySelector('.ft-stat'), cuts=root.querySelector('.ft-cuts');
 function done(msg){ host.innerHTML=''; stat.innerHTML=''; cuts.innerHTML=''; root.querySelector('.ft-out').innerHTML=api.flags(f,msg); }
 if(!tops.length) return done('Add a gate for the top event, list its inputs, and give each basic event a probability.');
 if(tops.length>1) f.push(['warn','More than one gate is not an input to anything ('+tops.map(api.esc).join(', ')+'). <b>'+api.esc(tops[0])+'</b> is used as the top.']);
 var top=tops[0], cyc=false;
 function basics(id,stack){ if(stack[id]){ cyc=true; return []; } var e=E[id]; if(!e.gate) return [id]; var s={}; stack[id]=1; e.ins.forEach(function(x){ basics(x,stack).forEach(function(b){ s[b]=1; }); }); delete stack[id]; return Object.keys(s); }
 var B=basics(top,{}); if(cyc){ f.push(['warn','The tree loops back on itself. A gate cannot be an input to one of its own inputs.']); return done(); }
 if(B.some(function(b){ return isNaN(E[b].p)||E[b].p<0||E[b].p>1; })) return done('Give every basic event a probability between 0 and 1.');
 /* minimal cut sets, top down (MOCUS) */
 var CAP=400, capped=false;
 function minimize(sets){ sets=sets.map(function(s){ return s.slice().sort(); }); sets.sort(function(a,b){ return a.length-b.length; }); var out=[];
  sets.forEach(function(s){ if(!out.some(function(o){ return o.every(function(x){ return s.indexOf(x)>=0; }); })) out.push(s); }); return out; }
 function mcs(id){ var e=E[id]; if(!e.gate) return [[id]]; var kids=e.ins.map(mcs);
  if(!e.and) return minimize([].concat.apply([],kids));
  var acc=[[]]; kids.forEach(function(k){ var nx=[]; acc.forEach(function(a){ k.forEach(function(b){ if(nx.length<CAP*4){ var u=a.slice(); b.forEach(function(x){ if(u.indexOf(x)<0) u.push(x); }); nx.push(u); } else capped=true; }); }); acc=minimize(nx); if(acc.length>CAP){ acc=acc.slice(0,CAP); capped=true; } }); return acc; }
 var C=mcs(top), P=function(s){ return s.reduce(function(a,x){ return a*E[x].p; },1); };
 /* exact probability by enumerating basic-event states (independent events), when small enough */
 function evalG(id,st){ var e=E[id]; if(!e.gate) return st[id]; return e.and?e.ins.every(function(x){ return evalG(x,st); }):e.ins.some(function(x){ return evalG(x,st); }); }
 function exact(id){ var b=basics(id,{}); if(b.length>16) return NaN; var tot=0, st={};
  for(var m=0;m<(1<<b.length);m++){ var pr=1; for(var j=0;j<b.length;j++){ var on=(m>>j)&1; st[b[j]]=!!on; pr*=on?E[b[j]].p:1-E[b[j]].p; if(pr===0) break; } if(pr&&evalG(id,st)) tot+=pr; } return tot; }
 function approx(id){ var e=E[id]; if(!e.gate) return e.p; var ps=e.ins.map(approx); return e.and?ps.reduce(function(a,x){return a*x;},1):1-ps.reduce(function(a,x){return a*(1-x);},1); }
 var pEx=exact(top), rare=C.reduce(function(a,s){ return a+P(s); },0), ub=1-C.reduce(function(a,s){ return a*(1-P(s)); },1);
 var rep=B.filter(function(b){ var k=0; ids.forEach(function(id){ if(E[id].gate&&E[id].ins.indexOf(b)>=0) k++; }); return k>1; });
 function sci(v){ if(!isFinite(v)) return '—'; if(v===0) return '0'; if(v>=0.001) return api.fmt(v,4).replace(/0+$/,'').replace(/\.$/,''); var e=Math.floor(Math.log10(v)), m=v/Math.pow(10,e); return m.toFixed(2)+'&times;10<sup>'+e+'</sup>'; }
 var h='<div><b>'+sci(isNaN(pEx)?ub:pEx)+'</b><span>Top-event probability'+(isNaN(pEx)?' (upper bound)':'')+'</span></div><div><b>'+C.length+(capped?'+':'')+'</b><span>Minimal cut sets</span></div><div><b>'+C.filter(function(s){return s.length===1;}).length+'</b><span>Single points of failure</span></div><div><b>'+sci(rare)+'</b><span>Rare-event approximation (sum of cut sets)</span></div>';
 stat.innerHTML=h;
 var ranked=C.map(function(s){ return {s:s,p:P(s)}; }).sort(function(a,b){ return b.p-a.p; }), sumP=rare||1;
 cuts.innerHTML='<thead><tr><th>Rank</th><th>Minimal cut set</th><th>Order</th><th>Probability</th><th>Share of total</th></tr></thead><tbody>'+ranked.slice(0,25).map(function(c,i){ return '<tr'+(c.s.length===1?' class="hi-row"':'')+'><td class="calc">'+(i+1)+'</td><td>'+c.s.map(function(x){ return '<b>'+api.esc(x)+'</b> '+api.esc((E[x].r.txt||'').slice(0,40)); }).join(' <i>and</i> ')+'</td><td class="calc">'+c.s.length+'</td><td class="calc">'+sci(c.p)+'</td><td class="calc">'+api.fmt(100*c.p/sumP,1)+'%</td></tr>'; }).join('')+'</tbody>';
 /* importance: Fussell-Vesely (share of the cut-set sum containing each event) */
 var fv=B.map(function(b){ return {b:b,v:C.filter(function(s){ return s.indexOf(b)>=0; }).reduce(function(a,s){ return a+P(s); },0)/sumP}; }).sort(function(a,b){ return b.v-a.v; });
 /* tree drawing: expand from the top; a repeated event is drawn wherever it is used */
 var nodes=[], NW=124, NH=40, GW=40, LV=118, maxN=80;
 function lay(id,depth,x0){ var e=E[id], node={id:id,e:e,d:depth,kids:[]}; nodes.push(node);
  if(e.gate&&nodes.length<maxN){ var x=x0; e.ins.forEach(function(k){ var c=lay(k,depth+1,x); node.kids.push(c); x=c.x1; }); node.x1=x; node.cx=(node.kids[0].cx+node.kids[node.kids.length-1].cx)/2; }
  else { node.x1=x0+NW+16; node.cx=x0+(NW+16)/2; } return node; }
 var root0=lay(top,0,10), depthMax=Math.max.apply(null,nodes.map(function(x){return x.d;})), W=Math.max(root0.x1+10,300), H=(depthMax+1)*LV+20;
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Fault tree"><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.i{font:700 10px \'IBM Plex Mono\',monospace;fill:#0F3E68}.p{font:600 9.5px \'IBM Plex Mono\',monospace;fill:#9C7C1F}.gt{font:800 8px \'IBM Plex Mono\',monospace;fill:#fff}</style>';
 function wrap(s,cx,y,max){ var w=String(s).split(/\s+/).filter(Boolean), L=[], c=''; w.forEach(function(x){ if((c+' '+x).trim().length>max&&c){ L.push(c); c=x; } else c=(c+' '+x).trim(); }); if(c) L.push(c); if(L.length>2){ L=L.slice(0,2); L[1]=L[1].slice(0,max-1)+'…'; } return L.map(function(l,i){ return '<text x="'+cx+'" y="'+(y+i*12)+'" text-anchor="middle">'+api.esc(l)+'</text>'; }).join(''); }
 nodes.forEach(function(nd){ var y=10+nd.d*LV, cx=nd.cx, e=nd.e, pr=e.gate?exact(nd.id):e.p; if(e.gate&&isNaN(pr)) pr=approx(nd.id);
  g+='<rect x="'+(cx-NW/2)+'" y="'+y+'" width="'+NW+'" height="'+NH+'" fill="'+(nd.d?'#fff':'#FDECEA')+'" stroke="'+(nd.d?'#0F3E68':'#C0392B')+'" stroke-width="1.4"/>'+wrap(e.r.txt||'',cx,y+15,21)+'<text class="i" x="'+(cx-NW/2+3)+'" y="'+(y-3)+'">'+api.esc(nd.id)+'</text><text class="p" x="'+(cx+NW/2-2)+'" y="'+(y-3)+'" text-anchor="end">'+sci(pr).replace(/<\/?sup>/g,'').replace('&times;10','e')+'</text>';
  var gy=y+NH+8;
  if(e.gate){ g+='<line x1="'+cx+'" x2="'+cx+'" y1="'+(y+NH)+'" y2="'+gy+'" stroke="#4A5D71"/>';
   if(e.and) g+='<path d="M'+(cx-GW/2)+' '+(gy+30)+' V'+(gy+14)+' A'+(GW/2)+' 16 0 0 1 '+(cx+GW/2)+' '+(gy+14)+' V'+(gy+30)+' Z" fill="#0F3E68"/><text class="gt" x="'+cx+'" y="'+(gy+25)+'" text-anchor="middle">AND</text>';
   else g+='<path d="M'+(cx-GW/2)+' '+(gy+30)+' Q'+cx+' '+(gy+20)+' '+(cx+GW/2)+' '+(gy+30)+' Q'+(cx+GW/2)+' '+(gy+8)+' '+cx+' '+gy+' Q'+(cx-GW/2)+' '+(gy+8)+' '+(cx-GW/2)+' '+(gy+30)+' Z" fill="#9C7C1F"/><text class="gt" x="'+cx+'" y="'+(gy+21)+'" text-anchor="middle">OR</text>';
   nd.kids.forEach(function(k){ var ky=10+k.d*LV; g+='<path d="M'+cx+' '+(gy+27)+' V'+(gy+40)+' H'+k.cx+' V'+ky+'" fill="none" stroke="#4A5D71"/>'; }); }
  else if(e.r.type==='Undeveloped event') g+='<line x1="'+cx+'" x2="'+cx+'" y1="'+(y+NH)+'" y2="'+gy+'" stroke="#4A5D71"/><path d="M'+cx+' '+gy+' l18 14 -18 14 -18 -14z" fill="#fff" stroke="#0F3E68" stroke-width="1.4"/>';
  else g+='<line x1="'+cx+'" x2="'+cx+'" y1="'+(y+NH)+'" y2="'+gy+'" stroke="#4A5D71"/><circle cx="'+cx+'" cy="'+(gy+14)+'" r="14" fill="#fff" stroke="#0F3E68" stroke-width="1.4"/>'; });
 host.innerHTML=g+'</svg>';
 if(nodes.length>=maxN) f.push(['','The tree is large; only the first '+maxN+' boxes are drawn. The calculation uses all of it.']);
 var spf=ranked.filter(function(c){ return c.s.length===1; });
 if(spf.length) f.push(['warn','Single points of failure: '+spf.map(function(c){ return '<b>'+api.esc(c.s[0])+'</b>'; }).join(', ')+'. Any one of them causes the top event on its own. Redundancy (an AND gate) or prevention at the source is the usual answer.']);
 if(ranked.length) f.push(['','The largest contributor is cut set <b>'+ranked[0].s.map(api.esc).join(' + ')+'</b>, '+api.fmt(100*ranked[0].p/sumP,0)+'% of the total. Reducing it gives the biggest drop in the top-event probability.']);
 f.push(['','Most important basic events (Fussell-Vesely, the share of the risk in cut sets containing the event): '+fv.slice(0,4).map(function(x){ return '<b>'+api.esc(x.b)+'</b> '+api.fmt(100*x.v,0)+'%'; }).join(', ')+'.']);
 if(rep.length) f.push(['','Repeated events ('+rep.map(api.esc).join(', ')+') feed more than one gate. Multiplying gate by gate would double-count them; the result above is computed from the events themselves'+(isNaN(pEx)?'':', exactly')+'.']);
 if(isNaN(pEx)) f.push(['warn','More than 16 basic events: the top-event figure is the cut-set upper bound, 1 &minus; &prod;(1 &minus; P(cut set)), not the exact value.']);
 if(capped) f.push(['warn','The cut-set list was cut off at '+CAP+'. The tree has too many combinations to list them all.']);
 f.push(['','All probabilities assume the basic events are independent. A common cause (one power supply, one maintenance error) that hits several events at once makes the real figure higher; model it as its own basic event.']);
 root.querySelector('.ft-out').innerHTML=api.flags(f);
},
example:{f:{sys:'Coolant pump PX-40, with standby pump',top:'No coolant flow while the machine is running',per:'year of operation',team:'Reliability engineer, maintenance lead, design engineer'},
 g:{e:[
  {id:'TOP',txt:'No coolant flow while machine runs',type:'OR gate',in:'G1, G2, B5',p:'',src:''},
  {id:'G1',txt:'Both pumps fail to deliver',type:'AND gate',in:'G3, G4',p:'',src:''},
  {id:'G2',txt:'Flow path blocked',type:'OR gate',in:'B6, U1',p:'',src:''},
  {id:'G3',txt:'Duty pump fails',type:'OR gate',in:'B1, B2',p:'',src:''},
  {id:'G4',txt:'Standby pump fails',type:'OR gate',in:'B3, B2, B4',p:'',src:''},
  {id:'B1',txt:'Duty pump motor fails',type:'Basic event',in:'',p:'0.05',src:'Field data, 3 years'},
  {id:'B2',txt:'Shared power supply fails',type:'Basic event',in:'',p:'0.01',src:'Supplier MTBF'},
  {id:'B3',txt:'Standby pump motor fails',type:'Basic event',in:'',p:'0.05',src:'Field data, 3 years'},
  {id:'B4',txt:'Auto-changeover switch fails',type:'Basic event',in:'',p:'0.02',src:'Supplier data'},
  {id:'B5',txt:'Controller sends no run signal',type:'Basic event',in:'',p:'0.002',src:'Design estimate'},
  {id:'B6',txt:'Filter clogged',type:'Basic event',in:'',p:'0.03',src:'Maintenance records'},
  {id:'U1',txt:'Pipe damaged or kinked',type:'Undeveloped event',in:'',p:'0.001',src:'Judgment; not developed'}]}}
}
