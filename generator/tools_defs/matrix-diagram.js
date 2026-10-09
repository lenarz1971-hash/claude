{
slug:'matrix-diagram',
sections:[
 {type:'fields',title:'The lists to relate',cols:3,hint:'An <b>L-shaped</b> matrix relates two lists: rows against columns. A <b>T-shaped</b> matrix relates one list (the columns) to two others, one above and one below. Name each list, then enter its items, one per row.',fields:[
  {id:'p',label:'Purpose',wide:true,ph:'e.g. Which actions address which complaints, and who has to be involved'},
  {id:'shape',label:'Shape',type:'select',opts:['L-shaped (two lists)','T-shaped (three lists)']},
  {id:'na',label:'Row list name',ph:'e.g. Complaints'},
  {id:'nb',label:'Column list name',ph:'e.g. Actions'},
  {id:'nc',label:'Second row list name (T only)',ph:'e.g. Departments'},
  {id:'la',label:'Row list items',wide:false,type:'datagrid',cols:[{label:'Row item',type:'text'}],rows:5,minRows:3},
  {id:'lb',label:'Column list items',wide:false,type:'datagrid',cols:[{label:'Column item',type:'text'}],rows:5,minRows:3},
  {id:'lc',label:'Second row list items (T only)',wide:false,type:'datagrid',cols:[{label:'Row item',type:'text'}],rows:4,minRows:3}]},
 {type:'custom',id:'mx',title:'Mark the relationships',hint:'For each cell, ask whether the row item and the column item are related, and how strongly. Leave the cell blank when there is no real relationship; a matrix where every cell is marked tells you nothing.',html:'<div class="pillrow"><span>&#9678; STRONG = 9</span><span>&#9675; MEDIUM = 3</span><span>&#9651; WEAK = 1</span><span>BLANK = NONE</span></div><div class="tgw"><table class="mv mx-tab"></table></div>'},
 {type:'custom',id:'res',title:'What the matrix shows',hint:'Column totals add the symbol values (9, 3, 1) down each column. A high total marks a column item that touches many rows strongly.',html:'<div class="stat mx-stat"></div><div class="svgw mx-svg"></div><div class="out mx-out"></div>'}
],
blankX:function(){ return {m:{}}; },
SYM:{'':0,'◎ 9':9,'○ 3':3,'△ 1':1},
update:function(root,api){
 var S=api.state(), m=S.x.m||(S.x.m={}), T=/^T/.test(S.f.shape||''), SYM=window.TOOL.SYM, f=[];
 function uniq(k,name){ var L=api.lines(k), seen={}, out=[]; L.forEach(function(x){ if(seen[x]){ f.push(['warn',name+': "'+api.esc(x)+'" is listed twice; it is shown once.']); return; } seen[x]=1; out.push(x); }); return out; }
 var nA=(S.f.na||'').trim()||'Rows', nB=(S.f.nb||'').trim()||'Columns', nC=(S.f.nc||'').trim()||'Second rows';
 var A=uniq('la',nA), B=uniq('lb',nB), C=T?uniq('lc',nC):[];
 var tb=root.querySelector('.mx-tab'), sig=JSON.stringify([T,A,B,C,nA,nB,nC]);
 if(!A.length||!B.length){ tb.innerHTML='<tr><td class="th">Enter at least one row item and one column item.</td></tr>'; tb.dataset.sig=''; root.querySelector('.mx-stat').innerHTML=''; root.querySelector('.mx-svg').innerHTML=''; root.querySelector('.mx-out').innerHTML=api.flags(f,'Enter the two lists to relate.'); return; }
 var opts=Object.keys(SYM);
 function cell(blk,r,c){ var k=blk+'|'+r+'|'+c, v=m[k]||''; return '<td><select data-mx="'+api.esc(k)+'" aria-label="'+api.esc(r)+', '+api.esc(c)+'">'+opts.map(function(o){ return '<option value="'+o+'"'+(o===v?' selected':'')+'>'+o+'</option>'; }).join('')+'</select></td>'; }
 function block(blk,L,name){ return '<tr class="mx-sep"><td class="mo" colspan="'+(B.length+2)+'">'+api.esc(name)+'</td></tr>'+L.map(function(r,i){ return '<tr><td class="mo">'+api.esc(r)+'</td>'+B.map(function(c){ return cell(blk,r,c); }).join('')+'<td class="mt" data-rt="'+blk+i+'"></td></tr>'; }).join('')+
  '<tr class="mx-ct"><td class="mo">Column total, '+api.esc(name)+'</td>'+B.map(function(c,j){ return '<td class="mt" data-ct="'+blk+j+'"></td>'; }).join('')+'<td></td></tr>'; }
 if(tb.dataset.sig!==sig||!tb.querySelector('select')){
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>'+api.esc(nA)+(T?' / '+api.esc(nC):'')+' &darr; &nbsp; '+api.esc(nB)+' &rarr;</th>'+B.map(function(c){ return '<th>'+api.esc(c)+'</th>'; }).join('')+'<th>Row total</th></tr></thead><tbody>'+block('A',A,nA)+(T?block('C',C,nC)+'<tr class="mx-ct"><td class="mo">Column total, both lists</td>'+B.map(function(c,j){ return '<td class="mt" data-ct="T'+j+'"></td>'; }).join('')+'<td></td></tr>':'')+'</tbody>';
  tb.querySelectorAll('select[data-mx]').forEach(function(sel){ sel.onchange=function(){ if(sel.value) m[sel.dataset.mx]=sel.value; else delete m[sel.dataset.mx]; api.save(); }; });
 }
 function val(blk,r,c){ return SYM[m[blk+'|'+r+'|'+c]||'']||0; }
 var rt={A:[],C:[]}, ct={A:B.map(function(){return 0;}),C:B.map(function(){return 0;})}, cn={A:B.map(function(){return 0;}),C:B.map(function(){return 0;})}, marks=0, strong=0, cells=0;
 [['A',A],['C',C]].forEach(function(p){ var blk=p[0]; p[1].forEach(function(r,i){ var t=0, k=0, s=0; B.forEach(function(c,j){ var v=val(blk,r,c); cells++; if(v){ marks++; k++; cn[blk][j]++; if(v===9){ strong++; s++; } } t+=v; ct[blk][j]+=v; });
  rt[blk].push({r:r,t:t,k:k,s:s}); var td=tb.querySelector('[data-rt="'+blk+i+'"]'); if(td) td.textContent=t; }); });
 B.forEach(function(c,j){ ['A','C'].forEach(function(blk){ var td=tb.querySelector('[data-ct="'+blk+j+'"]'); if(td) td.textContent=ct[blk][j]; }); var td=tb.querySelector('[data-ct="T'+j+'"]'); if(td) td.textContent=ct.A[j]+ct.C[j]; });
 var colT=B.map(function(c,j){ return {c:c,a:ct.A[j],b:ct.C[j],t:ct.A[j]+ct.C[j],na:cn.A[j],nc:cn.C[j]}; }), rows=rt.A.concat(rt.C);
 var topC=colT.slice().sort(function(a,b){ return b.a-a.a; })[0], topR=rt.A.slice().sort(function(a,b){ return b.t-a.t; })[0], topRC=rt.C.slice().sort(function(a,b){ return b.t-a.t; })[0];
 root.querySelector('.mx-stat').innerHTML='<div><b>'+marks+' of '+cells+'</b><span>Cells marked</span></div><div><b>'+strong+'</b><span>Strong relationships</span></div><div><b>'+(topC.a?api.esc(topC.c):'—')+'</b><span>Highest column total'+(T?', '+api.esc(nA.toLowerCase()):'')+(topC.a?' ('+topC.a+')':'')+'</span></div><div><b>'+(topR.t?api.esc(topR.r):'—')+'</b><span>Highest row total'+(T?', '+api.esc(nA.toLowerCase()):'')+(topR.t?' ('+topR.t+')':'')+'</span></div>';
 /* column totals chart */
 var mx=Math.max.apply(null,colT.map(function(x){ return x.t; })), Wd=800, rh=28, Lw=250, srt=colT.slice().sort(function(a,b){ return b.t-a.t; }), sc=mx?(Wd-Lw-60)/mx:0;
 var g='<svg viewBox="0 0 '+Wd+' '+(srt.length*rh+(T?34:12))+'" role="img" aria-label="Column totals"><style>text{font:12.5px Archivo,sans-serif;fill:#16273A}.v{font:600 11.5px \'IBM Plex Mono\',monospace;fill:#0F3E68}.k{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.06em}</style>';
 srt.forEach(function(x,i){ var y=i*rh+6, lab=x.c.length>36?x.c.slice(0,35)+'…':x.c; g+='<text x="'+(Lw-10)+'" y="'+(y+14)+'" text-anchor="end">'+api.esc(lab)+'</text><rect x="'+Lw+'" y="'+y+'" width="'+(x.a*sc)+'" height="18" fill="#0F3E68"/>'+(T?'<rect x="'+(Lw+x.a*sc)+'" y="'+y+'" width="'+(x.b*sc)+'" height="18" fill="#D8B147"/>':'')+'<text class="v" x="'+(Lw+6+x.t*sc)+'" y="'+(y+14)+'">'+x.t+'</text>'; });
 if(T) g+='<rect x="'+Lw+'" y="'+(srt.length*rh+14)+'" width="10" height="10" fill="#0F3E68"/><text class="k" x="'+(Lw+15)+'" y="'+(srt.length*rh+23)+'">'+api.esc(nA.toUpperCase())+'</text><rect x="'+(Lw+170)+'" y="'+(srt.length*rh+14)+'" width="10" height="10" fill="#D8B147"/><text class="k" x="'+(Lw+185)+'" y="'+(srt.length*rh+23)+'">'+api.esc(nC.toUpperCase())+'</text>';
 root.querySelector('.mx-svg').innerHTML=mx?g+'</svg>':'';
 if(!marks){ root.querySelector('.mx-out').innerHTML=api.flags(f,'Mark the relationships in the matrix and the totals appear here.'); return; }
 /* checks */
 var eA=rt.A.filter(function(x){ return !x.k; }), eC=rt.C.filter(function(x){ return !x.k; });
 if(eA.length) f.push(['warn',eA.map(function(x){ return '<b>'+api.esc(x.r)+'</b>'; }).join(', ')+' ('+api.esc(nA.toLowerCase())+') '+(eA.length>1?'have':'has')+' no relationship at all. Nothing in '+api.esc(nB.toLowerCase())+' addresses '+(eA.length>1?'them':'it')+': a gap to fill, or an item that does not belong here.']);
 if(eC.length) f.push(['warn',eC.map(function(x){ return '<b>'+api.esc(x.r)+'</b>'; }).join(', ')+' ('+api.esc(nC.toLowerCase())+') '+(eC.length>1?'have':'has')+' no relationship to any of the '+api.esc(nB.toLowerCase())+'.']);
 var eB=colT.filter(function(x){ return !x.na&&!x.nc; });
 if(eB.length) f.push(['warn','Column'+(eB.length>1?'s':'')+' '+eB.map(function(x){ return '<b>'+api.esc(x.c)+'</b>'; }).join(', ')+' '+(eB.length>1?'relate':'relates')+' to nothing. If it serves no row, ask why it is there.']);
 if(T){ var half=colT.filter(function(x){ return (x.na>0)!==(x.nc>0); });
  half.forEach(function(x){ f.push(['warn','<b>'+api.esc(x.c)+'</b> is linked to '+(x.na?api.esc(nA.toLowerCase())+' but to no '+api.esc(nC.toLowerCase()):api.esc(nC.toLowerCase())+' but to no '+api.esc(nA.toLowerCase()))+'. In a T matrix each column item usually needs both.']); }); }
 var weak=rt.A.filter(function(x){ return x.k&&!x.s&&x.t<=3; });
 if(weak.length) f.push(['','Only weak or medium links for '+weak.map(function(x){ return '<b>'+api.esc(x.r)+'</b>'; }).join(', ')+'. Nothing addresses '+(weak.length>1?'them':'it')+' strongly.']);
 if(cells>=12&&marks/cells>0.6) f.push(['warn',Math.round(100*marks/cells)+'% of the cells are marked. A matrix this full is not discriminating; keep only relationships you could defend.']);
 if(topC.a) f.push(['ok','Highest column total'+(T?' against '+api.esc(nA.toLowerCase()):'')+': <b>'+api.esc(topC.c)+'</b> ('+topC.a+'). It relates most strongly to the most rows, so it is usually the item to look at first.']);
 if(T&&topRC&&topRC.t) f.push(['','In the '+api.esc(nC.toLowerCase())+' list, <b>'+api.esc(topRC.r)+'</b> has the highest row total ('+topRC.t+'), so the most involvement. Check it has the capacity.']);
 f.push(['','The totals count relationships; they do not weigh the rows by importance. If some rows matter more, use a <a href="/tools/project-selection-matrix.html">prioritization matrix</a> or a <a href="/tools/qfd-house-of-quality.html">house of quality</a>, which weight them.']);
 root.querySelector('.mx-out').innerHTML=api.flags(f);
},
example:{f:{p:'Which improvement actions address which customer complaints, and which departments have to be involved',shape:'T-shaped (three lists)',na:'Complaints',nb:'Actions',nc:'Departments',
  la:'Late delivery\nWrong item shipped\nDamaged in transit\nInvoice errors\nSlow reply to queries\nMissing material certificates',
  lb:'Barcode scan at packing\nDaily schedule meeting\nNew crate design\nOrder entry checklist\nShared customer inbox\nCarrier scorecard',
  lc:'Shipping\nCustomer service\nPlanning\nFinance'},
 g:{},
 x:{m:{
  'A|Late delivery|Daily schedule meeting':'◎ 9','A|Late delivery|Carrier scorecard':'○ 3','A|Late delivery|Shared customer inbox':'△ 1',
  'A|Wrong item shipped|Barcode scan at packing':'◎ 9','A|Wrong item shipped|Order entry checklist':'○ 3',
  'A|Damaged in transit|New crate design':'◎ 9','A|Damaged in transit|Carrier scorecard':'○ 3',
  'A|Invoice errors|Order entry checklist':'◎ 9',
  'A|Slow reply to queries|Shared customer inbox':'◎ 9','A|Slow reply to queries|Daily schedule meeting':'△ 1',
  'C|Shipping|Barcode scan at packing':'◎ 9','C|Shipping|New crate design':'◎ 9','C|Shipping|Carrier scorecard':'○ 3','C|Shipping|Daily schedule meeting':'○ 3',
  'C|Customer service|Shared customer inbox':'◎ 9','C|Customer service|Order entry checklist':'◎ 9','C|Customer service|Daily schedule meeting':'△ 1',
  'C|Planning|Daily schedule meeting':'◎ 9',
  'C|Finance|Order entry checklist':'○ 3'}}}
}
