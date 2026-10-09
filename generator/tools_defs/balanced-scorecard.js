{
slug:'balanced-scorecard',
sections:[
 {type:'fields',title:'Scorecard',cols:3,fields:[{id:'org',label:'Organization or unit'},{id:'per',label:'Reporting period'},{id:'tol',label:'Near-target tolerance %',type:'number',min:0,max:50,ph:'5',hint:'An actual within this percent of target, on the wrong side, shows as near.'}]},
 {type:'grid',id:'m',title:'Objectives and measures',rows:4,hint:'One row per measure; an objective can have several. <b>Leading</b> measures predict future results (training completed, defects found early); <b>lagging</b> measures report results already achieved (revenue, churn). In <b>Drives</b>, name the objective this one is expected to improve, to draw the cause-and-effect arrows on the strategy map.',cols:[
  {id:'per',label:'Perspective',type:'select',opts:['Financial','Customer','Internal process','Learning and growth']},
  {id:'obj',label:'Objective',w:170,type:'textarea',rows:1},{id:'meas',label:'Measure',w:190,type:'textarea',rows:1},
  {id:'ll',label:'Leading or lagging',type:'select',opts:['Leading','Lagging']},
  {id:'dir',label:'Better when',type:'select',opts:['Higher','Lower']},
  {id:'base',label:'Baseline',type:'number'},{id:'tgt',label:'Target',type:'number'},{id:'act',label:'Actual',type:'number'},
  {id:'st',label:'Status',calc:function(r,api){var s=window.TOOL._st(r,api);return s?'<span class="bs-p '+s+'">'+window.TOOL._lab[s]+'</span>':'';}},
  {id:'drv',label:'Drives objective',w:160}]},
 {type:'custom',id:'sc',title:'Scorecard',html:'<div class="tgw"><table class="mv bs"></table></div><div class="out bs-out"></div>'},
 {type:'custom',id:'mp',title:'Strategy map',hint:'Objectives by perspective, learning and growth at the bottom, financial at the top. Box color is the worst status among the objective\'s measures; arrows come from the Drives column.',html:'<div class="svgw bs-map"></div>'}
],
_lab:{on:'On target',near:'Near',off:'Off target'},
_P:['Financial','Customer','Internal process','Learning and growth'],
_st:function(r,api){ var t=api.num(r.tgt), a=api.num(r.act), S=api.state(), tol=api.num(S.f.tol); if(isNaN(tol)||tol<0) tol=5; if(isNaN(t)||isNaN(a)||!r.meas) return '';
 var band=Math.abs(t)*tol/100, lo=r.dir==='Lower';
 if(lo?a<=t:a>=t) return 'on'; if(lo?a<=t+band:a>=t-band) return 'near'; return 'off'; },
update:function(root,api){
 var S=api.state(), esc=api.esc, T=window.TOOL, n=api.num, tol=n(S.f.tol); if(isNaN(tol)||tol<0) tol=5;
 var rows=S.g.m.filter(function(r){return r.meas||r.obj;}), f=[], cut=function(s,k){s=String(s);return s.length>k?s.slice(0,k-1)+'…':s;};
 var fmt=function(v){return isNaN(v)?'—':api.fmt(v,Math.abs(v)<100&&Math.round(v)!==v?1:0);};
 var tb=root.querySelector('table.bs'), mapEl=root.querySelector('.bs-map');
 if(!rows.length){ tb.innerHTML=''; mapEl.innerHTML=''; mapEl.style.display='none'; root.querySelector('.bs-out').innerHTML=api.flags([],'Add objectives and measures under each of the four perspectives.'); return; }
 mapEl.style.display='';
 var html='<thead><tr><th>Objective and measure</th><th>Type</th><th>Baseline</th><th>Target</th><th>Actual</th><th>Gap closed</th><th>Status</th></tr></thead><tbody>';
 T._P.concat(['']).forEach(function(p){ var rs=rows.filter(function(r){return (r.per||'')===p;}); if(!rs.length) return;
  html+='<tr class="bs-h"><td colspan="7">'+(p||'No perspective chosen')+'</td></tr>';
  rs.forEach(function(r){ var s=T._st(r,api), b=n(r.base), t=n(r.tgt), a=n(r.act), gc=(!isNaN(b)&&!isNaN(t)&&!isNaN(a)&&t!==b)?(a-b)/(t-b)*100:NaN;
   html+='<tr><td class="mo"><b>'+esc(r.obj||'(no objective)')+'</b><br><span class="bs-m">'+esc(r.meas||'(no measure)')+(r.dir?' · '+(r.dir==='Lower'?'lower':'higher')+' is better':'')+'</span></td><td>'+esc(r.ll||'—')+'</td><td class="mt">'+fmt(b)+'</td><td class="mt">'+fmt(t)+'</td><td class="mt">'+fmt(a)+'</td><td class="mt">'+(isNaN(gc)?'—':Math.round(gc)+'%')+'</td><td>'+(s?'<span class="bs-p '+s+'">'+T._lab[s]+'</span>':'—')+'</td></tr>'; });
 });
 tb.innerHTML=html+'</tbody>';
 // flags
 var st=rows.map(function(r){return T._st(r,api);}), cnt={on:0,near:0,off:0}; st.forEach(function(s){ if(s) cnt[s]++; });
 var nm=rows.filter(function(r){return r.meas;}).length;
 if(!nm) f.push(['warn','No measures entered yet. Each objective needs at least one measure.']); else f.push([cnt.off?'':'ok',nm+' measure'+(nm>1?'s':'')+': '+cnt.on+' on target, '+cnt.near+' near (within '+tol+'%), '+cnt.off+' off target.']);
 T._P.forEach(function(p){ var rs=rows.filter(function(r){return r.per===p;});
  if(!rs.length) f.push(['warn','No measures in the <b>'+p.toLowerCase()+'</b> perspective. The scorecard is balanced only if all four perspectives are measured.']);
  else if(p!=='Financial'&&rs.every(function(r){return r.ll==='Lagging';})) f.push(['warn','Every <b>'+p.toLowerCase()+'</b> measure is lagging. By the time these move, the cause is months old. Add a leading measure that predicts them.']);
 });
 var nop=rows.filter(function(r){return !r.per;}).length; if(nop) f.push(['warn',nop+' measure'+(nop>1?'s have':' has')+' no perspective.']);
 rows.forEach(function(r,i){ if(st[i]==='off') f.push(['warn','Off target: <b>'+esc(cut(r.meas,70))+'</b> at '+fmt(n(r.act))+' against '+fmt(n(r.tgt))+' ('+esc(r.obj||'')+').']); });
 var nb=rows.filter(function(r){return r.meas&&isNaN(n(r.base));}); if(nb.length) f.push(['warn','No baseline for '+nb.map(function(r){return '<b>'+esc(cut(r.meas,50))+'</b>';}).join(', ')+'. Without a starting point there is no way to tell whether the target is a stretch or already met.']);
 var nt=rows.filter(function(r){return r.meas&&(isNaN(n(r.tgt))||isNaN(n(r.act)));}); if(nt.length) f.push(['warn',nt.length+' measure'+(nt.length>1?'s are':' is')+' missing a target or an actual, so '+(nt.length>1?'they have':'it has')+' no status.']);
 var nd=rows.filter(function(r){return r.meas&&!r.dir;}).length; if(nd) f.push(['warn',nd+' measure'+(nd>1?'s do':' does')+' not say whether higher or lower is better; treated as higher.']);
 // objectives and links
 var objs=[], ok={};
 T._P.forEach(function(p,pi){ rows.filter(function(r){return r.per===p&&r.obj;}).forEach(function(r){ var k=String(r.obj).trim().toLowerCase(); if(ok[k]) { ok[k].rs.push(r); return; } ok[k]={n:String(r.obj).trim(),p:pi,rs:[r],drv:[]}; objs.push(ok[k]); }); });
 objs.forEach(function(o){ o.rs.forEach(function(r){ var d=String(r.drv||'').trim().toLowerCase(); if(d&&o.drv.indexOf(d)<0) o.drv.push(d); }); });
 var badL=[]; objs.forEach(function(o){ o.drv.forEach(function(d){ if(!ok[d]) badL.push(o.n+' → '+d); }); }); if(badL.length) f.push(['warn','Drives names an objective that does not exist: '+badL.map(esc).join('; ')+'.']);
 var anyL=objs.some(function(o){return o.drv.length;});
 if(anyL){ var orph=objs.filter(function(o){return o.p>0&&!o.drv.some(function(d){return ok[d];});}); if(orph.length) f.push(['','Not linked to anything above: '+orph.map(function(o){return '<b>'+esc(o.n)+'</b>';}).join(', ')+'. On a strategy map, every objective below financial should drive at least one objective above it.']); }
 f.push(['','Leading measures tell you whether the lagging results are likely to follow. A scorecard reports progress on strategy against targets; a dashboard monitors operations, often in real time. Most organizations need both.']);
 root.querySelector('.bs-out').innerHTML=api.flags(f);
 // strategy map
 var W=760, lw=118, bh=104, top=8, H=top+4*bh+8, col={on:'#1F8C55',near:'#D8B147',off:'#C0392B','':'#7C8B99'}, fill={on:'#E3F2EA',near:'#FBF5E4',off:'#FBEDEB','':'#F6F7F4'}, rank={'':0,on:1,near:2,off:3};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Strategy map"><defs><marker id="bsA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#4A5D71"/></marker></defs><style>text{font:13.5px Archivo,sans-serif;fill:#16273A}.pl{font:700 13px Archivo,sans-serif;fill:#0F3E68}</style>';
 var PL=[['FINANCIAL'],['CUSTOMER'],['INTERNAL','PROCESS'],['LEARNING','AND GROWTH']];
 T._P.forEach(function(p,i){ var y=top+i*bh; g+='<rect x="0" y="'+y+'" width="'+W+'" height="'+(bh-6)+'" fill="'+(i%2?'#fff':'#F6F7F4')+'" stroke="#DDE1E4"/>'; PL[i].forEach(function(t,j){ g+='<text class="pl" x="10" y="'+(y+(bh-6)/2+5-(PL[i].length-1)*8+j*16)+'">'+t+'</text>'; }); });
 var pos={};
 T._P.forEach(function(p,i){ var os=objs.filter(function(o){return o.p===i;}), k=os.length; if(!k) return; var avail=W-lw-10, bw=Math.min(210,avail/k-14), gap=(avail-bw*k)/(k+1), y=top+i*bh+14;
  os.forEach(function(o,j){ var x=lw+gap+j*(bw+gap), w=0; o.rs.forEach(function(r){ var s=T._st(r,api); if(rank[s]>rank[w?w:'']) w=s; }); o.s=w||''; pos[o.n.toLowerCase()]={x:x,y:y,w:bw,h:bh-34,o:o}; }); });
 // arrows first
 objs.forEach(function(o){ var a=pos[o.n.toLowerCase()]; o.drv.forEach(function(d){ var b=pos[d]; if(!a||!b) return; var x1=a.x+a.w/2, x2=b.x+b.w/2, y1, y2;
  if(b.y<a.y){ y1=a.y; y2=b.y+b.h; } else if(b.y>a.y){ y1=a.y+a.h; y2=b.y; } else { y1=a.y+a.h/2; y2=y1; x1=a.x+(x2>x1?a.w:0); x2=b.x+(x2>x1?0:b.w); }
  g+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#4A5D71" stroke-width="1.6" marker-end="url(#bsA)"/>'; }); });
 Object.keys(pos).forEach(function(k){ var q=pos[k], o=q.o, cpl=Math.max(8,Math.floor((q.w-14)/7.2)), words=o.n.split(/\s+/), lines=[''], li=0;
  words.forEach(function(w){ if((lines[li]+' '+w).trim().length>cpl&&lines[li]){ li++; lines[li]=''; } lines[li]=(lines[li]+' '+w).trim(); });
  if(lines.length>3){ lines=lines.slice(0,3); lines[2]=cut(lines[2],cpl-1)+'…'; }
  g+='<rect x="'+q.x+'" y="'+q.y+'" width="'+q.w+'" height="'+q.h+'" rx="6" fill="'+fill[o.s]+'" stroke="'+col[o.s]+'" stroke-width="2"/>';
  var y0=q.y+q.h/2-(lines.length-1)*8+5; lines.forEach(function(l,i){ g+='<text x="'+(q.x+q.w/2)+'" y="'+(y0+i*16)+'" text-anchor="middle">'+esc(l)+'</text>'; }); });
 mapEl.innerHTML=g+'</svg>';
},
example:{f:{org:'Ledgerline Software (accounting SaaS, 420 employees)',per:'FY2026, third quarter year to date',tol:'5'},
 g:{m:[{per:'Financial',obj:'Grow recurring revenue',meas:'Annual recurring revenue growth, % year over year',ll:'Lagging',dir:'Higher',base:'14',tgt:'20',act:'19.2',drv:''},
  {per:'Financial',obj:'Improve gross margin',meas:'Gross margin %',ll:'Lagging',dir:'Higher',base:'71',tgt:'75',act:'75.4',drv:''},
  {per:'Customer',obj:'Keep customers longer',meas:'Annual gross logo churn %',ll:'Lagging',dir:'Lower',base:'9',tgt:'7',act:'8.1',drv:'Grow recurring revenue'},
  {per:'Customer',obj:'Expand within existing accounts',meas:'Net revenue retention %',ll:'Lagging',dir:'Higher',base:'104',tgt:'110',act:'106',drv:'Grow recurring revenue'},
  {per:'Internal process',obj:'Ship reliable releases',meas:'Change failure rate %',ll:'Leading',dir:'Lower',base:'18',tgt:'10',act:'12',drv:'Keep customers longer'},
  {per:'Internal process',obj:'Ship reliable releases',meas:'Defects escaping to production per release',ll:'Leading',dir:'Lower',base:'',tgt:'5',act:'4',drv:'Keep customers longer'},
  {per:'Internal process',obj:'Resolve support issues fast',meas:'Median hours to resolve a ticket',ll:'Leading',dir:'Lower',base:'30',tgt:'20',act:'21',drv:'Keep customers longer'},
  {per:'Learning and growth',obj:'Build secure-coding skills',meas:'% of engineers certified in secure coding',ll:'Leading',dir:'Higher',base:'35',tgt:'80',act:'62',drv:'Ship reliable releases'},
  {per:'Learning and growth',obj:'Retain key engineering talent',meas:'Voluntary attrition %, rolling 12 months',ll:'Lagging',dir:'Lower',base:'14',tgt:'10',act:'11.5',drv:'Resolve support issues fast'}]}}
}
