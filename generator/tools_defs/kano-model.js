{
slug:'kano-model',
EV:['QAAAO','RIIIM','RIIIM','RIIIM','RRRRQ'],
NM:{A:'Attractive',O:'One-dimensional',M:'Must-be',I:'Indifferent',R:'Reverse',Q:'Questionable'},
P:function(s){ s=String(s==null?'':s).trim(); if(!s) return null; var d=s.replace(/[^0-9]/g,''); if(d.length!==2||!/^[1-5][1-5]$/.test(d)) return 'X'; return window.TOOL.EV[+d[0]-1][+d[1]-1]; },
sections:[
 {type:'fields',title:'The survey',cols:3,hint:'Each feature gets a pair of questions. <b>Functional</b>: how do you feel if the product has this feature? <b>Dysfunctional</b>: how do you feel if it does not? Both use the same five answers.',fields:[
  {id:'prod',label:'Product or service',ph:'e.g. Field-service mobile app'},
  {id:'seg',label:'Respondent group',ph:'e.g. Service technicians'},
  {id:'nr',label:'Number of respondents (1 to 60)',type:'number',min:1,max:60}]},
 {type:'grid',id:'ft',title:'Features asked about',rows:3,hint:'One row per feature, in the same order as the answer columns below. Deleting a feature row shifts the answer columns, so add features at the end.',cols:[
  {id:'n',label:'Feature',w:220},
  {id:'q',label:'Notes or question wording',w:240},
  {id:'cat',label:'Category (mode)',calc:function(r,api){ var T=window.TOOL, S=api.state(), j=S.g.ft.indexOf(r), nr=Math.min(60,Math.round(api.num(S.f.nr))), c={A:0,O:0,M:0,I:0,R:0,Q:0}, t=0; if(!String(r.n||'').trim()||!(nr>=1)) return ''; for(var i=0;i<nr;i++){ var k=T.P((S.x.a||{})[i+'|'+j]); if(k&&k!=='X'){ c[k]++; t++; } } if(!t) return ''; var mx=Math.max(c.A,c.O,c.M,c.I,c.R,c.Q); return '<b>'+['M','O','A','I','R','Q'].filter(function(k){return c[k]===mx;}).map(function(k){return T.NM[k];}).join(' / ')+'</b>'; }}]},
 {type:'custom',id:'ans',title:'Answers, one row per respondent',hint:'Type two digits per cell: the functional answer, then the dysfunctional answer. <b>1</b> I like it, <b>2</b> I expect it (must be), <b>3</b> I am neutral, <b>4</b> I can live with it, <b>5</b> I dislike it. So 25 means "expected if present, disliked if absent". The letter beside each cell is its Kano category. You can paste a block from a spreadsheet.',html:'<div class="tgw"><table class="mv kn-in"></table></div>'},
 {type:'custom',id:'ev',title:'Kano evaluation table (Berger et al., 1993)',html:'<div class="tgw"><table class="mv kn-ev"></table></div>',init:function(el,api){
  var T=window.TOOL, H=['Like','Must-be','Neutral','Live with','Dislike'], c={A:'kA',O:'kO',M:'kM',I:'kI',R:'kR',Q:'kQ'};
  el.querySelector('.kn-ev').innerHTML='<thead><tr><th>Functional ↓ / Dysfunctional →</th>'+H.map(function(h,j){return '<th>'+(j+1)+' '+h+'</th>';}).join('')+'</tr></thead><tbody>'+H.map(function(h,i){ return '<tr><td class="mo">'+(i+1)+' '+h+'</td>'+T.EV[i].split('').map(function(x){return '<td class="'+c[x]+'"><b>'+x+'</b></td>';}).join('')+'</tr>'; }).join('')+'</tbody>';
 }},
 {type:'custom',id:'res',title:'Category counts and better/worse coefficients',html:'<div class="tgw"><table class="mv kn-res"></table></div><div class="svgw kn-svg"></div>'},
 {type:'custom',id:'chk',title:'What the survey says',html:'<div class="out kn-out"></div>'}
],
blankX:function(){ return {a:{}}; },
update:function(root,api){
 var T=window.TOOL, S=api.state(), A=S.x.a||(S.x.a={}), F=api.fmt, E=api.esc, f=[];
 var nr=Math.round(api.num(S.f.nr)); if(!(nr>=1)) nr=0; if(nr>60) nr=60;
 var FT=[]; S.g.ft.forEach(function(r,j){ var nm=String(r.n||'').trim(); if(nm) FT.push({j:j,nm:nm}); });
 var tb=root.querySelector('.kn-in'), RS=root.querySelector('.kn-res'), SV=root.querySelector('.kn-svg'), O=root.querySelector('.kn-out');
 if(!FT.length||!nr){ tb.innerHTML='<tr><td class="th">'+(!FT.length?'Name at least one feature':'Enter the number of respondents')+' to get the answer grid.</td></tr>'; tb.dataset.sig=''; RS.innerHTML=''; SV.innerHTML=''; O.innerHTML=api.flags([],'Name the features, enter the number of respondents and type their answers to classify each feature.'); return; }
 var sig=JSON.stringify([FT,nr]);
 if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig;
  var h='<thead><tr><th>Respondent</th>'+FT.map(function(x,k){return '<th title="'+E(x.nm)+'">F'+(k+1)+' '+E(x.nm.length>14?x.nm.slice(0,13)+'…':x.nm)+'</th>';}).join('')+'</tr></thead><tbody>';
  for(var i=0;i<nr;i++) h+='<tr><td class="mo">R'+(i+1)+'</td>'+FT.map(function(x,k){ var key=i+'|'+x.j; return '<td><span class="kc"><input type="text" inputmode="numeric" maxlength="5" data-kn="'+key+'" data-ri="'+i+'" data-fi="'+k+'" value="'+E(A[key]||'')+'" aria-label="Respondent '+(i+1)+', '+E(x.nm)+'"><i data-kb="'+key+'"></i></span></td>'; }).join('')+'</tr>';
  tb.innerHTML=h+'</tbody>';
  tb.querySelectorAll('input[data-kn]').forEach(function(inp){
   inp.oninput=function(){ var v=inp.value.trim(); if(v) A[inp.dataset.kn]=v; else delete A[inp.dataset.kn]; api.save(); };
   inp.onpaste=function(e){ var t=(e.clipboardData||window.clipboardData).getData('text'); if(!t||!/[\t\n]/.test(t.replace(/\n$/,''))) return; e.preventDefault();
    var r0=+inp.dataset.ri, c0=+inp.dataset.fi;
    t.replace(/\r/g,'').replace(/\n$/,'').split('\n').forEach(function(line,di){ line.split('\t').forEach(function(v,dj){ var ri=r0+di, fk=c0+dj; if(ri<nr&&fk<FT.length){ v=v.trim(); var key=ri+'|'+FT[fk].j; if(v) A[key]=v; else delete A[key]; } }); });
    tb.dataset.sig=''; api.save(); };
  });
 }
 var res=FT.map(function(x){ return {nm:x.nm,j:x.j,c:{A:0,O:0,M:0,I:0,R:0,Q:0},bad:0,blank:0}; }), resp=[], bad=0, blanks=0;
 for(var i=0;i<nr;i++){ var q=0; FT.forEach(function(x,k){ var key=i+'|'+x.j, cat=T.P(A[key]), b=tb.querySelector('[data-kb="'+key+'"]'), inp=tb.querySelector('[data-kn="'+key+'"]');
   if(b){ b.textContent=cat&&cat!=='X'?cat:(cat==='X'?'?':''); b.className=cat?'k'+cat:''; }
   if(inp) inp.classList.toggle('bad',cat==='X');
   if(cat===null){ res[k].blank++; blanks++; } else if(cat==='X'){ res[k].bad++; bad++; } else { res[k].c[cat]++; if(cat==='Q') q++; } });
  if(q) resp.push([i+1,q]); }
 res.forEach(function(r){ var c=r.c, d=c.A+c.O+c.M+c.I, tot=d+c.R+c.Q; r.d=d; r.tot=tot; r.better=d?(c.A+c.O)/d:NaN; r.worse=d?-(c.O+c.M)/d:NaN;
  var mx=Math.max(c.A,c.O,c.M,c.I,c.R,c.Q); r.mode=tot?['M','O','A','I','R','Q'].filter(function(k){return c[k]===mx;}):[];
  var srt=['A','O','M','I','R','Q'].map(function(k){return c[k];}).sort(function(a,b){return b-a;}); r.gap=srt[0]-srt[1]; });
 function co(v){ return isFinite(v)?(v<0?'−':'')+Math.abs(v).toFixed(2):'—'; }
 RS.innerHTML='<thead><tr><th>Feature</th><th>A</th><th>O</th><th>M</th><th>I</th><th>R</th><th>Q</th><th>n</th><th>Category (mode)</th><th>Better</th><th>Worse</th></tr></thead><tbody>'+res.map(function(r,k){ return '<tr><td class="mo">F'+(k+1)+' '+E(r.nm)+'</td>'+['A','O','M','I','R','Q'].map(function(c){return '<td'+(r.mode.indexOf(c)>=0?' class="k'+c+'"':'')+'>'+r.c[c]+'</td>';}).join('')+'<td>'+r.tot+'</td><td>'+(r.mode.length?r.mode.map(function(c){return T.NM[c];}).join(' / '):'—')+'</td><td>'+co(r.better)+'</td><td>'+co(r.worse)+'</td></tr>'; }).join('')+'</tbody>';
 /* better / worse plot */
 var RQ=function(r){ return r.mode.length&&r.mode.every(function(c){return c==='R'||c==='Q';}); }, anyRQ=res.some(function(r){return r.d>0&&RQ(r);});
 var W=640, H=anyRQ?500:470, x0=78, x1=600, y0=28, y1=400, pts=res.filter(function(r){return r.d>0;});
 function X(v){return x0+(x1-x0)*v;} function Y(v){return y1-(y1-y0)*v;}
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Better and worse coefficients"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.q{font:700 15px Archivo,sans-serif;fill:#7C8B99}.a{font:12px Archivo,sans-serif;fill:#4A5D71}.p{font:700 12px Archivo,sans-serif;fill:#fff}</style>';
 g+='<rect x="'+x0+'" y="'+y0+'" width="'+(x1-x0)+'" height="'+(y1-y0)+'" fill="#fff" stroke="#C6CDD3"/><line x1="'+X(.5)+'" y1="'+y0+'" x2="'+X(.5)+'" y2="'+y1+'" stroke="#C6CDD3" stroke-dasharray="4 3"/><line x1="'+x0+'" y1="'+Y(.5)+'" x2="'+x1+'" y2="'+Y(.5)+'" stroke="#C6CDD3" stroke-dasharray="4 3"/>';
 g+='<text class="q" x="'+(x0+10)+'" y="'+(y0+22)+'">Attractive</text><text class="q" x="'+(x1-10)+'" y="'+(y0+22)+'" text-anchor="end">One-dimensional</text><text class="q" x="'+(x0+10)+'" y="'+(y1-10)+'">Indifferent</text><text class="q" x="'+(x1-10)+'" y="'+(y1-10)+'" text-anchor="end">Must-be</text>';
 [0,.25,.5,.75,1].forEach(function(v){ g+='<text class="a" x="'+X(v)+'" y="'+(y1+18)+'" text-anchor="middle">'+v.toFixed(2)+'</text><text class="a" x="'+(x0-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v.toFixed(2)+'</text>'; });
 g+='<text x="'+((x0+x1)/2)+'" y="'+(y1+42)+'" text-anchor="middle">|Worse|: dissatisfaction if the feature is missing</text><text x="22" y="'+((y0+y1)/2)+'" text-anchor="middle" transform="rotate(-90 22 '+((y0+y1)/2)+')">Better: satisfaction if it is present</text>';
 var boxes=pts.map(function(r){ var px=X(Math.abs(r.worse)), py=Y(r.better); return [px-12,py-12,px+12,py+12]; }), lbl='';
 boxes.push([x0+5,y0+5,x0+100,y0+28],[x1-140,y0+5,x1-5,y0+28],[x0+5,y1-28,x0+100,y1-5],[x1-75,y1-28,x1-5,y1-5]);
 function hit(b){ if(b[0]<x0+2||b[2]>x1-2||b[1]<y0+2||b[3]>y1-2) return true; return boxes.some(function(o){ return b[0]<o[2]&&b[2]>o[0]&&b[1]<o[3]&&b[3]>o[1]; }); }
 pts.forEach(function(r){ var k=res.indexOf(r), px=X(Math.abs(r.worse)), py=Y(r.better);
  var rq=RQ(r), sfx=rq?' ('+r.mode.join('/')+')':'';
  g+=rq?'<circle cx="'+px+'" cy="'+py+'" r="10" fill="#fff" stroke="#C0392B" stroke-width="2.5" stroke-dasharray="4 2"/><text x="'+px+'" y="'+(py+4)+'" text-anchor="middle" style="font-weight:700;fill:#C0392B;font-size:12px">'+(k+1)+'</text>':'<circle cx="'+px+'" cy="'+py+'" r="11" fill="#0F3E68"/><text class="p" x="'+px+'" y="'+(py+4)+'" text-anchor="middle">'+(k+1)+'</text>';
  for(var L=r.nm.length>26?26:r.nm.length;L>=8;L-=6){ var lab=(r.nm.length>L?r.nm.slice(0,L-1)+'…':r.nm)+sfx, w=lab.length*6.9, c=[[px+16,py-9,px+16+w,py+8,px+16,'start'],[px-16-w,py-9,px-16,py+8,px-16,'end'],[px-w/2,py-32,px+w/2,py-15,px,'middle'],[px-w/2,py+15,px+w/2,py+32,px,'middle']], ok=null;
   for(var q=0;q<4&&!ok;q++) if(!hit(c[q])) ok=c[q];
   if(ok){ boxes.push(ok); lbl+='<text x="'+ok[4]+'" y="'+(ok[3]-4)+'" text-anchor="'+ok[5]+'">'+E(lab)+'</text>'; break; } } });
 g+=lbl;
 if(anyRQ) g+='<circle cx="'+(x0+8)+'" cy="'+(H-14)+'" r="7" fill="#fff" stroke="#C0392B" stroke-width="2" stroke-dasharray="3 2"/><text class="a" x="'+(x0+22)+'" y="'+(H-10)+'">Hollow red: mostly R or Q answers, which Better and Worse leave out.</text>';
 SV.innerHTML=pts.length?g+'</svg>':'';
 /* checks */
 var grp={}; res.forEach(function(r){ if(r.mode.length===1) (grp[r.mode[0]]=grp[r.mode[0]]||[]).push(r.nm); });
 var sum=['M','O','A','I','R','Q'].filter(function(k){return grp[k];}).map(function(k){return '<b>'+T.NM[k]+'</b>: '+grp[k].map(E).join(', ');});
 if(sum.length) f.push(['ok','Classification by the most frequent answer. '+sum.join('. ')+'.']);
 res.forEach(function(r,k){
  if(r.mode.length>1) f.push(['warn','F'+(k+1)+' '+E(r.nm)+': tie between '+r.mode.map(function(c){return T.NM[c];}).join(' and ')+' ('+r.c[r.mode[0]]+' each). A common rule of thumb breaks ties in the order Must-be, One-dimensional, Attractive, Indifferent; a tie also suggests the respondents are two segments.']);
  else if(r.tot>=4&&r.gap<=1) f.push(['','F'+(k+1)+' '+E(r.nm)+' is a close call: '+T.NM[r.mode[0]]+' leads the next category by only '+r.gap+' answer. Look for segments before acting on it.']);
  if(r.mode[0]==='R'&&r.mode.length===1) f.push(['warn','F'+(k+1)+' '+E(r.nm)+' is <b>Reverse</b> for this group: '+r.c.R+' of '+r.tot+' would rather not have it. Check whether another group (buyers, managers) wants it before deciding; it may need to be optional. It is drawn hollow on the chart because Better and Worse leave out Reverse answers, so its quadrant there does not describe it.']);
  if(r.tot&&r.d<5) f.push(['warn','F'+(k+1)+' '+E(r.nm)+': better and worse rest on only '+r.d+' A, O, M or I answer'+(r.d===1?'':'s')+'. Treat the point on the chart as rough.']);
 });
 if(res.some(function(r){return r.d>0;})) f.push(['','Usual priority: deliver every Must-be first (missing one causes dissatisfaction no matter what else is there), then compete on One-dimensional features, then add Attractive ones to delight. Indifferent features are candidates to drop or simplify. Better near 1 means the feature lifts satisfaction; worse near −1 means its absence hurts.']);
 resp.forEach(function(x){ f.push(['warn','Respondent '+x[0]+' gave '+x[1]+' questionable answer'+(x[1]>1?'s':'')+' (Q: the same answer to both questions at the extremes, such as liking the feature and liking its absence). Check whether the questions were understood; many analysts drop a respondent with several Q answers.']); });
 if(bad) f.push(['warn',bad+' answer'+(bad>1?'s are':' is')+' not two digits from 1 to 5 (marked ?). They are left out.']);
 if(blanks) f.push(['',blanks+' cell'+(blanks>1?'s are':' is')+' blank and not counted.']);
 O.innerHTML=api.flags(f,'Type the respondents’ answers to classify each feature.');
},
example:{f:{prod:'Field-service mobile app',seg:'Service technicians',nr:'12'},
 g:{ft:[{n:'Offline access to work orders',q:'Open and close work orders with no signal'},{n:'Automatic route planning',q:'App orders the day’s jobs to cut drive time'},{n:'Photo markup in job reports',q:'Draw on photos before attaching'},{n:'Dark mode',q:'Dark screen theme'},{n:'Live GPS tracking of technicians',q:'Dispatch sees each van’s position'}]},
 x:{a:{
  '0|0':'25','1|0':'35','2|0':'15','3|0':'25','4|0':'45','5|0':'35','6|0':'15','7|0':'25','8|0':'33','9|0':'25','10|0':'35','11|0':'15',
  '0|1':'15','1|1':'15','2|1':'14','3|1':'15','4|1':'25','5|1':'13','6|1':'15','7|1':'15','8|1':'33','9|1':'15','10|1':'25','11|1':'15',
  '0|2':'13','1|2':'13','2|2':'15','3|2':'14','4|2':'33','5|2':'13','6|2':'14','7|2':'15','8|2':'11','9|2':'13','10|2':'34','11|2':'33',
  '0|3':'33','1|3':'33','2|3':'13','3|3':'34','4|3':'33','5|3':'43','6|3':'13','7|3':'33','8|3':'33','9|3':'34','10|3':'32','11|3':'33',
  '0|4':'51','1|4':'53','2|4':'33','3|4':'51','4|4':'41','5|4':'52','6|4':'33','7|4':'53','8|4':'55','9|4':'31','10|4':'34','11|4':'15'}}}
}
