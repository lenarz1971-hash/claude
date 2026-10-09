{
slug:'kraljic-portfolio-matrix',
h:{
 Q:{'Strategic':['#0F3E68','Partner. Long-term agreements, joint planning and development, shared improvement targets, supplier development. Map the sub-tier supply chain and keep a contingency plan.','Deep involvement: early design input, PPAP or full qualification, process audits, capability on special characteristics, regular business reviews.'],
  'Leverage':['#9C7C1F','Use buying power. Competitive bids, consolidate volume, target pricing, shorter contracts. Switching is easy, so suppliers compete.','Hold quality in every tender: approval requirements, scorecards, and total cost of ownership rather than price alone. Watch for quality slipping after a price squeeze.'],
  'Bottleneck':['#C0392B','Secure supply. Safety stock, long-term or volume contracts, qualify a second source, or redesign and standardize to escape the specialty item.','Protect continuity: business continuity and contingency plans, change-notification terms, close monitoring of the supplier\'s health and capacity.'],
  'Non-critical':['#4A5D71','Simplify. Catalogs, blanket orders, e-procurement, fewer suppliers and less purchasing effort per order.','Light touch: certificate of conformance, skip-lot or reduced inspection, and periodic checks. Spend supplier quality time elsewhere.']},
 mean:function(r,keys,api){ var t=0,k=0; keys.forEach(function(x){ var v=api.num(r[x]); if(!isNaN(v)){t+=v;k++;} }); return k?t/k:NaN; },
 cut:function(api){ var c=api.num(api.state().f.cut); return isNaN(c)?3:c; },
 quad:function(sr,pi,c){ if(isNaN(sr)||isNaN(pi)) return ''; return pi>=c?(sr>=c?'Strategic':'Leverage'):(sr>=c?'Bottleneck':'Non-critical'); }
},
sections:[
 {type:'fields',title:'Scope',cols:3,hint:'Kraljic\'s portfolio model sorts purchased items by two things: <b>profit impact</b> (how much the item matters to cost, quality and the business) and <b>supply risk</b> (how hard it would be to get it if something went wrong). Score categories of purchases, not individual suppliers.',fields:[
  {id:'org',label:'Organization and spend analyzed',wide:true,ph:'e.g. Direct materials, product line A'},
  {id:'per',label:'Spend period',ph:'e.g. FY 2026'},
  {id:'cut',label:'High at or above (1 to 5 scale)',type:'number',min:1,max:5,ph:'3'},
  {id:'team',label:'Scored by'}]},
 {type:'grid',id:'i',title:'Items and scores',rows:4,hint:'Score each factor 1 (low) to 5 (high). <b>Supply risk:</b> Sources (1 = many qualified sources, 5 = single source), Switching (cost and time to change supplier), Market (scarcity, lead time, geopolitical or regulatory exposure). <b>Profit impact:</b> Spend (share of spend or volume), Impact (effect on product quality, safety, performance or revenue). Each axis is the average of the factors scored.',cols:[
  {id:'it',label:'Item or category',w:180,type:'textarea',rows:1},
  {id:'sup',label:'Supplier(s)',w:140,type:'textarea',rows:1},
  {id:'sp',label:'Annual spend',type:'number',min:0},
  {id:'sh',label:'Share',calc:function(r,api){ var S=api.state(), t=S.g.i.reduce(function(a,x){var v=api.num(x.sp);return a+(isNaN(v)?0:v);},0), v=api.num(r.sp); return isNaN(v)||!t?'':(v/t*100).toFixed(1)+'%'; }},
  {id:'s1',label:'Sources',type:'number',min:1,max:5},
  {id:'s2',label:'Switching',type:'number',min:1,max:5},
  {id:'s3',label:'Market',type:'number',min:1,max:5},
  {id:'p1',label:'Spend',type:'number',min:1,max:5},
  {id:'p2',label:'Impact',type:'number',min:1,max:5},
  {id:'sr',label:'Supply risk',calc:function(r,api){ var v=window.TOOL.h.mean(r,['s1','s2','s3'],api); return isNaN(v)?'':v.toFixed(2); }},
  {id:'pi',label:'Profit impact',calc:function(r,api){ var v=window.TOOL.h.mean(r,['p1','p2'],api); return isNaN(v)?'':v.toFixed(2); }},
  {id:'q',label:'Quadrant',calc:function(r,api){ var H=window.TOOL.h; return H.quad(H.mean(r,['s1','s2','s3'],api),H.mean(r,['p1','p2'],api),H.cut(api)); }}]},
 {type:'custom',id:'mx',title:'Portfolio matrix',hint:'Bubble area is proportional to annual spend. Items close to a dividing line are borderline; check their scores with the team before acting on the quadrant.',html:'<div class="svgw kj-chart"></div><div class="stat kj-stat"></div>'},
 {type:'custom',id:'st',title:'Strategy by quadrant',html:'<div class="kj-q"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out kj-out"></div>'}
],
update:function(root,api){
 var H=window.TOOL.h, S=api.state(), n=api.num, esc=api.esc, f=[], c=H.cut(api);
 var I=S.g.i.filter(function(r){return r.it;}), tot=I.reduce(function(a,r){var v=n(r.sp);return a+(isNaN(v)?0:v);},0);
 var res=I.map(function(r){ var sr=H.mean(r,['s1','s2','s3'],api), pi=H.mean(r,['p1','p2'],api); return {r:r,sr:sr,pi:pi,q:H.quad(sr,pi,c),sp:n(r.sp)}; });
 var names=['Strategic','Leverage','Bottleneck','Non-critical'];
 /* chart: x = supply risk, y = profit impact */
 var Wd=640, Hh=470, L=60, Rm=20, T=20, B=48, pw=Wd-L-Rm, ph=Hh-T-B, lo=0.55, hi=5.45, sx=function(v){return L+pw*(v-lo)/(hi-lo);}, sy=function(v){return T+ph*(hi-v)/(hi-lo);}, used=[];
 var cc=Math.max(1,Math.min(5,c));
 var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Kraljic portfolio matrix"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.qn{font:800 13px Archivo,sans-serif;letter-spacing:.04em}</style>';
 [[lo,cc,cc,hi,'#FBF3DC','LEVERAGE','#9C7C1F'],[cc,hi,cc,hi,'#E4ECF4','STRATEGIC','#0F3E68'],[lo,cc,lo,cc,'#F3F5F7','NON-CRITICAL','#4A5D71'],[cc,hi,lo,cc,'#FDECEA','BOTTLENECK','#C0392B']].forEach(function(q){
  var x=sx(q[0]), y=sy(q[3]), w=sx(q[1])-x, h=sy(q[2])-y; g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+q[4]+'"/>';
  if(w>60&&h>24){ var ty=q[3]===hi?y+18:y+h-8, tx=q[0]===lo?x+8:x+w-8; g+='<text class="qn" x="'+tx+'" y="'+ty+'" text-anchor="'+(q[0]===lo?'start':'end')+'" style="fill:'+q[6]+'">'+q[5]+'</text>'; used.push({x:q[0]===lo?tx:tx-q[5].length*9,y:ty-12,w:q[5].length*9,h:15}); } });
 for(var k=1;k<=5;k++) g+='<text class="ax" x="'+sx(k)+'" y="'+(T+ph+15)+'" text-anchor="middle">'+k+'</text><text class="ax" x="'+(L-8)+'" y="'+(sy(k)+3)+'" text-anchor="end">'+k+'</text>';
 g+='<line x1="'+sx(cc)+'" x2="'+sx(cc)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#4A5D71" stroke-dasharray="4 3"/><line x1="'+L+'" x2="'+(L+pw)+'" y1="'+sy(cc)+'" y2="'+sy(cc)+'" stroke="#4A5D71" stroke-dasharray="4 3"/><rect x="'+L+'" y="'+T+'" width="'+pw+'" height="'+ph+'" fill="none" stroke="#B9C0C6"/>';
 g+='<text class="ax" x="'+(L+pw/2)+'" y="'+(Hh-10)+'" text-anchor="middle">SUPPLY RISK &rarr;</text><text class="ax" transform="translate(16 '+(T+ph/2)+') rotate(-90)" text-anchor="middle">PROFIT IMPACT &rarr;</text>';
 var pts=res.filter(function(x){return x.q;}), mx=Math.max.apply(null,pts.map(function(x){return isNaN(x.sp)?0:x.sp;}).concat([0]));
 pts.slice().sort(function(a,b){return (b.sp||0)-(a.sp||0);}).forEach(function(x){ var r=mx>0&&!isNaN(x.sp)?5+19*Math.sqrt(x.sp/mx):6, X=sx(x.sr), Y=sy(x.pi), col=H.Q[x.q][0];
  g+='<circle cx="'+X+'" cy="'+Y+'" r="'+r.toFixed(1)+'" fill="'+col+'" fill-opacity=".55" stroke="'+col+'" stroke-width="1.5"/>';
  x.lab={X:X,Y:Y,r:r}; });
 pts.forEach(function(x){ used.push({x:x.lab.X-x.lab.r,y:x.lab.Y-x.lab.r,w:2*x.lab.r,h:2*x.lab.r}); });
 function hit(b){ return b.x<L||b.x+b.w>L+pw||b.y<T||b.y+b.h>T+ph||used.some(function(u){ return b.x<u.x+u.w&&b.x+b.w>u.x&&b.y<u.y+u.h&&b.y+b.h>u.y; }); }
 pts.forEach(function(x){ var lab=x.r.it.length>22?x.r.it.slice(0,21)+'…':x.r.it, w=lab.length*5.9, X=x.lab.X, Y=x.lab.Y, r=x.lab.r, pick=null;
  [[X+r+4,Y-6,'start'],[X-r-4-w,Y-6,'end'],[X-w/2,Y-r-15,'middle'],[X-w/2,Y+r+3,'middle'],[X+r+2,Y-r-10,'start'],[X-r-2-w,Y-r-10,'end'],[X+r+2,Y+r-2,'start'],[X-r-2-w,Y+r-2,'end']].some(function(c){ var b={x:c[0],y:c[1],w:w,h:13}; if(!hit(b)){ pick=c; return true; } return false; });
  if(!pick) pick=[X+r+4,Y-6,'start'];
  used.push({x:pick[0],y:pick[1],w:w,h:13});
  var tx=pick[2]==='start'?pick[0]:pick[2]==='end'?pick[0]+w:pick[0]+w/2;
  g+='<text x="'+tx+'" y="'+(pick[1]+10)+'" text-anchor="'+pick[2]+'" style="paint-order:stroke;stroke:#fff;stroke-width:3px">'+esc(lab)+'</text>'; });
 root.querySelector('.kj-chart').innerHTML=g+'</svg>';
 var by={}; names.forEach(function(q){ by[q]={n:0,sp:0}; }); res.forEach(function(x){ if(x.q){ by[x.q].n++; by[x.q].sp+=isNaN(x.sp)?0:x.sp; } });
 root.querySelector('.kj-stat').innerHTML=names.map(function(q){ return '<div><b>'+by[q].n+(tot?' · '+(by[q].sp/tot*100).toFixed(0)+'%':'')+'</b><span>'+q+(tot?': items · share of spend':': items')+'</span></div>'; }).join('');
 root.querySelector('.kj-q').innerHTML='<div class="tgw"><table class="mv kj-t"><thead><tr><th>Quadrant</th><th>Items</th><th>Purchasing strategy</th><th>Supplier quality focus</th></tr></thead><tbody>'+names.map(function(q){ var its=res.filter(function(x){return x.q===q;}).map(function(x){return esc(x.r.it);}); return '<tr><td class="mo"><b style="color:'+H.Q[q][0]+'">'+q+'</b><br><small>'+(q==='Strategic'?'High impact, high risk':q==='Leverage'?'High impact, low risk':q==='Bottleneck'?'Low impact, high risk':'Low impact, low risk')+'</small></td><td class="kj-its" data-l="Items">'+(its.join('<br>')||'—')+'</td><td class="kj-tx" data-l="Purchasing strategy">'+H.Q[q][1]+'</td><td class="kj-tx" data-l="Supplier quality focus">'+H.Q[q][2]+'</td></tr>'; }).join('')+'</tbody></table></div>';
 /* checks */
 if(!I.length){ root.querySelector('.kj-out').innerHTML=api.flags([],'Add items and score them, and the checks appear here.'); return; }
 var bad=[], miss=[]; res.forEach(function(x){ ['s1','s2','s3','p1','p2'].forEach(function(k){ var v=x.r[k]; if(v!==''&&v!=null&&!/^[1-5]$/.test(String(v).trim())) bad.push(x.r.it+' '+k); }); if(!x.q) miss.push(x.r.it); });
 if(bad.length) f.push(['warn','Scores must be whole numbers 1 to 5. Check '+bad.slice(0,6).map(esc).join(', ')+'.']);
 if(miss.length) f.push(['warn','Not placed, because a whole axis is unscored: '+miss.map(esc).join(', ')+'.']);
 var placed=res.filter(function(x){return x.q;});
 if(placed.length) f.unshift(['ok',names.map(function(q){return by[q].n+' '+q.toLowerCase();}).join(', ')+'.'+(tot?' Strategic and leverage items carry '+((by.Strategic.sp+by.Leverage.sp)/tot*100).toFixed(0)+'% of the spend.':'')]);
 var bl=placed.filter(function(x){return Math.abs(x.sr-c)<0.34||Math.abs(x.pi-c)<0.34;});
 if(bl.length) f.push(['','Borderline (within a third of a point of a dividing line): '+bl.map(function(x){return esc(x.r.it)+' ('+x.q+', risk '+x.sr.toFixed(2)+', impact '+x.pi.toFixed(2)+')';}).join('; ')+'. One score changed by one point moves them; agree those scores before acting.']);
 placed.forEach(function(x){ var nm='<b>'+esc(x.r.it)+'</b>', sh=tot&&!isNaN(x.sp)?x.sp/tot:NaN;
  if(x.q==='Strategic'&&n(x.r.s1)>=5) f.push(['warn',nm+' is strategic and single-source. It needs a written contingency plan: what happens in the first week if this supplier stops.']);
  if(x.q==='Bottleneck'&&n(x.r.s1)>=4) f.push(['warn',nm+' is a bottleneck with few or one source. Hold safety stock sized to the time it would take to qualify another source, and ask design whether a standard part would do.']);
  if(!isNaN(sh)&&sh>=0.2&&n(x.r.p1)<=2) f.push(['warn',nm+' is '+(sh*100).toFixed(0)+'% of the spend but has a spend score of '+x.r.p1+'. Check the score.']);
  if(!isNaN(sh)&&sh<0.01&&n(x.r.p1)>=4) f.push(['',nm+' is under 1% of the spend but has a spend score of '+x.r.p1+'. If its impact is on quality or safety, score that under Impact instead.']);
  if(x.q==='Non-critical'&&n(x.r.p2)>=4) f.push(['warn',nm+' lands in non-critical but its impact on the product is scored '+x.r.p2+'. Do not reduce its quality controls just because its spend is small.']); });
 if(by.Leverage.n&&by.Strategic.n===0) f.push(['','No strategic items. That is unusual; check whether any item with a single source and a large effect on the product was scored too low on risk.']);
 f.push(['','Repeat the analysis when the supply market or the product changes. Items move: a leverage commodity becomes a bottleneck when a shortage hits, and a strategic item becomes leverage when new sources are qualified.']);
 root.querySelector('.kj-out').innerHTML=api.flags(f);
},
example:{f:{org:'Direct and indirect purchases, Ardentis Mobility (powered patient-transport carts)',per:'FY 2026',cut:'3',team:'Purchasing manager, supplier quality engineer, design lead'},
 g:{i:[{it:'Motor controller board, custom',sup:'Varrick Circuit Assembly (only qualified source)',sp:'2150000',s1:'5',s2:'5',s3:'4',p1:'5',p2:'5'},
  {it:'Lithium battery pack',sup:'Ferro Cell Systems, Brennic Power',sp:'1780000',s1:'4',s2:'4',s3:'5',p1:'5',p2:'5'},
  {it:'Steel tube and sheet',sup:'Three service centers',sp:'960000',s1:'1',s2:'2',s3:'3',p1:'4',p2:'3'},
  {it:'Injection-molded covers',sup:'Orvex Plastics, Tamrex Molding',sp:'720000',s1:'2',s2:'3',s3:'2',p1:'4',p2:'3'},
  {it:'Casters and wheels',sup:'Four catalog suppliers',sp:'410000',s1:'1',s2:'1',s3:'2',p1:'3',p2:'4'},
  {it:'Brake actuator, proprietary',sup:'Quorvel Motion (sole source)',sp:'95000',s1:'5',s2:'5',s3:'4',p1:'2',p2:'2'},
  {it:'Membrane keypad',sup:'Pellux Interface',sp:'64000',s1:'4',s2:'3',s3:'3',p1:'1',p2:'2'},
  {it:'Fasteners',sup:'Quillon Fasteners (distributor)',sp:'58000',s1:'1',s2:'1',s3:'1',p1:'1',p2:'2'},
  {it:'Corrugated packaging',sup:'Two local box plants',sp:'52000',s1:'1',s2:'1',s3:'2',p1:'1',p2:'1'},
  {it:'Labels and manuals',sup:'Print vendors',sp:'21000',s1:'1',s2:'2',s3:'1',p1:'1',p2:'4'}]}}
}
