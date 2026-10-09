{
slug:'data-collection-plan',
sections:[
 {type:'fields',title:'Why you are collecting',hint:'Write down the question the data have to answer before anything else. Data collected without a question rarely answers one.',fields:[
  {id:'q',label:'Question the data must answer',type:'textarea',wide:true,ph:'e.g. Is the seal-nick rate different between shifts and between O-ring lots?'},
  {id:'owner',label:'Plan owner'},{id:'start',label:'Collection starts',type:'date'}]},
 {type:'grid',id:'plan',title:'The plan',rows:2,hint:'One row per measure. The <b>operational definition</b> is what makes two people record the same thing: exactly what counts, how it is measured, and what is excluded.',cols:[
  {id:'m',label:'Measure',w:140,type:'textarea',rows:1},
  {id:'type',label:'Data type',type:'select',opts:['Continuous (variable)','Discrete (count)','Attribute (pass/fail, category)']},
  {id:'def',label:'Operational definition',w:240,type:'textarea',rows:1},
  {id:'src',label:'Source, location',w:120,type:'textarea',rows:1},
  {id:'how',label:'How collected',w:120,type:'textarea',rows:1},
  {id:'n',label:'Sample size',w:80},
  {id:'freq',label:'Frequency',w:100},
  {id:'who',label:'Who',w:90},
  {id:'strat',label:'Stratify by',w:120,type:'textarea',rows:1,ph:'shift, lot, machine...'}]},
 {type:'custom',id:'chk',title:'Plan checks',html:'<div class="out dc-out"></div>'},
 {type:'custom',id:'cs',title:'Check sheet',hint:'Set the categories and the periods, then click a cell to add one. The totals can be pasted straight into the <a href=\"/calculators/pareto-chart.html\">Pareto builder</a>. Right-click, or long-press on a phone, to take one away. Print it to collect on paper instead.',
  html:'<div class="tf-grid printhide"><label class="tf"><span>Categories (one per line)</span><textarea rows="4" data-f="cats"></textarea></label><label class="tf"><span>Periods (one per line)</span><textarea rows="4" data-f="pers" placeholder="Mon&#10;Tue&#10;Wed"></textarea></label></div><div class="tgw"><table class="cs"></table></div><p class="noprint"><button type="button" class="tb ghost" id="cscopy">Copy totals for the Pareto builder</button> <button type="button" class="tb ghost" id="csclr">Zero the counts</button> <span class="tstamp cs-msg"></span></p>'},
 {type:'fields',title:'Location check sheet: the item',cols:4,hint:'A <b>location check sheet</b> (defect concentration diagram) records <i>where</i> on the item each defect is. Draw a simple outline split into zones: a rectangle in rows and columns, or a circle in rings and sectors.',fields:[
  {id:'lname',label:'Item and view',ph:'e.g. Door panel, outer face',wide:true},
  {id:'lshape',label:'Outline',type:'select',opts:['Rectangle (rows × columns)','Circle (rings × sectors)']},
  {id:'lc',label:'Columns (or sectors)',type:'number',min:1,max:24,ph:'6'},
  {id:'lr',label:'Rows (or rings)',type:'number',min:1,max:12,ph:'4'},
  {id:'ltypes',label:'Defect types (one per line)',type:'textarea',rows:3,ph:'Scratch&#10;Dent'}]},
 {type:'custom',id:'loc',title:'Location check sheet',hint:'Pick a defect type, then click or tap the zone where you found it. Right-click, or long-press on a phone, to take one away. Print it blank to mark on paper.',
  html:'<div class="pillrow lc-types noprint"></div><div class="svgw lc-svg"></div><div class="lc-st"></div><div class="tgw"><table class="tg lc-tb"></table></div><div class="out lc-out"></div><p class="noprint"><button type="button" class="tb ghost" id="lccsv">Download zone counts (CSV)</button> <button type="button" class="tb ghost" id="lcclr">Zero the location counts</button></p>'}
],
blankX:function(){return {t:{},lt:{},la:''};},
update:function(root,api){
 window.TOOL.loc(root,api);
 var S=api.state(), f=[], rows=S.g.plan.filter(function(r){return r.m;});
 if(!S.f.q) f.push(['warn','No question written yet.']);
 rows.forEach(function(r){
  var nm='<b>'+api.esc(r.m)+'</b>';
  if(!r.def) f.push(['warn',nm+' has no operational definition.']);
  else if(r.def.length<25) f.push(['warn',nm+': the operational definition is very short. Would two people reading it record the same thing?']);
  if(!r.type) f.push(['warn',nm+': choose the data type; it decides which charts and tests can be used later.']);
  if(!r.n||!r.freq) f.push(['warn',nm+': sample size and frequency are both needed.']);
  if(!r.strat) f.push(['',nm+': nothing to stratify by. Recording shift, machine, lot or operator at the time costs little and is impossible to add afterwards.']);
  if(r.type&&r.type.indexOf('Attribute')===0) f.push(['',nm+' is attribute data. Attribute data need far larger samples than continuous data to show the same change; if it can be measured on a scale, consider measuring it.']);
 });
 if(rows.length&&f.every(function(x){return x[0]!=='warn';})) f.unshift(['ok','Every measure has a definition, a type, a sample size and a frequency.']);
 root.querySelector('.dc-out').innerHTML=rows.length||!S.f.q?f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join(''):'<p>Add a measure and the checks appear here.</p>';
 var L=function(k){return (S.f[k]||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);};
 var cats=L('cats'), pers=L('pers'), t=S.x.t||(S.x.t={});
 var tb=root.querySelector('table.cs');
 if(!cats.length||!pers.length){ tb.innerHTML='<tr><td class="th">Add at least one category and one period.</td></tr>'; return; }
 var tot=0, colT=pers.map(function(){return 0;});
 var h='<thead><tr><th>Category</th>'+pers.map(function(p){return '<th>'+api.esc(p)+'</th>';}).join('')+'<th>Total</th></tr></thead><tbody>';
 cats.forEach(function(c){ var rt=0; h+='<tr><td class="cn">'+api.esc(c)+'</td>'; pers.forEach(function(p,j){ var v=t[c+'|'+p]||0; rt+=v; colT[j]+=v; h+='<td><button type="button" class="tal" data-k="'+api.esc(c+'|'+p)+'" aria-label="'+api.esc(c)+', '+api.esc(p)+': '+v+'">'+(v?'<span class="marks">'+'卌'.repeat(Math.floor(v/5))+'|'.repeat(v%5)+'</span><b>'+v+'</b>':'')+'</button></td>'; }); tot+=rt; h+='<td class="tt">'+rt+'</td></tr>'; });
 h+='<tr class="ft"><td>Total</td>'+colT.map(function(v){return '<td class="tt">'+v+'</td>';}).join('')+'<td class="tt">'+tot+'</td></tr></tbody>';
 tb.innerHTML=h;
 function bump(k,d){ t[k]=Math.max(0,(t[k]||0)+d); api.save(); }
 tb.querySelectorAll('.tal').forEach(function(b){
  b.onclick=function(){bump(b.dataset.k,1);};
  b.oncontextmenu=function(e){e.preventDefault();bump(b.dataset.k,-1);};
  var tm; b.ontouchstart=function(){tm=setTimeout(function(){tm=null;bump(b.dataset.k,-1);},550);}; b.ontouchend=function(e){ if(tm){clearTimeout(tm);} else e.preventDefault(); };
 });
 root.querySelector('#cscopy').onclick=function(){
  var txt=cats.map(function(c){ var s=0; pers.forEach(function(p){s+=t[c+'|'+p]||0;}); return c+'\t'+s; }).join('\n');
  var msg=root.querySelector('.cs-msg');
  function fallback(){ var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); msg.textContent='Copied. Click the first cell of the Pareto builder and paste.';}catch(e){msg.textContent='Could not copy; select the table instead.';} ta.remove(); }
  if(navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){msg.textContent='Copied. Click the first cell of the Pareto builder and paste.';},fallback); else fallback();
 };
 root.querySelector('#csclr').onclick=function(){ S.x.t={}; api.save(); };
},
gq:function(a,x){ /* regularized upper incomplete gamma Q(a,x), for the chi-square p value */
 var C=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 function gln(z){ if(z<0.5) return Math.log(Math.PI/Math.sin(Math.PI*z))-gln(1-z); z-=1; var s=C[0],t=z+7.5; for(var i=1;i<9;i++) s+=C[i]/(z+i); return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(s); }
 if(x<=0) return 1; var g=gln(a),s,del,ap,n,b,c,d,h,an,i;
 if(x<a+1){ ap=a; s=1/a; del=s; for(n=0;n<1000;n++){ ap++; del*=x/ap; s+=del; if(Math.abs(del)<Math.abs(s)*1e-16) break; } return 1-s*Math.exp(-x+a*Math.log(x)-g); }
 b=x+1-a; c=1e300; d=1/b; h=d; for(i=1;i<1000;i++){ an=-i*(i-a); b+=2; d=an*d+b; if(Math.abs(d)<1e-300)d=1e-300; c=b+an/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-16) break; }
 return Math.exp(-x+a*Math.log(x)-g)*h; },
loc:function(root,api){
 var S=api.state(), E=api.esc, F=api.fmt, X=S.x, t=X.lt||(X.lt={}), f=[];
 var TY=root.querySelector('.lc-types'), SV=root.querySelector('.lc-svg'), STt=root.querySelector('.lc-st'), TB=root.querySelector('.lc-tb'), O=root.querySelector('.lc-out');
 if(!SV) return;
 var circ=/^Circle/.test(S.f.lshape||''), nc=Math.round(api.num(S.f.lc)), nrw=Math.round(api.num(S.f.lr));
 if(!(nc>=1)) nc=circ?8:6; if(!(nrw>=1)) nrw=circ?1:4; nc=Math.min(nc,24); nrw=Math.min(nrw,12); if(!circ) nc=Math.min(nc,12); else nrw=Math.min(nrw,6);
 var types=api.lines('ltypes'); if(!types.length) types=['Defect'];
 var col=['#0F3E68','#C0392B','#9C7C1F','#2E7D32','#6A4C93','#4A5D71','#E67E22','#16A085'];
 if(types.indexOf(X.la)<0) X.la=types[0];
 TY.innerHTML='<span class="lc-lab">Recording:</span>'+types.map(function(ty,i){ return '<button type="button" class="lc-ty'+(ty===X.la?' on':'')+'" data-ty="'+E(ty)+'"><i style="background:'+col[i%col.length]+'"></i>'+E(ty)+'</button>'; }).join('');
 TY.querySelectorAll('[data-ty]').forEach(function(b){ b.onclick=function(){ X.la=b.dataset.ty; api.save(); }; });
 /* zones */
 var Z=[], LET='ABCDEFGHIJKL';
 for(var r=0;r<nrw;r++) for(var c=0;c<nc;c++){ var z={r:r,c:c,id:r+'|'+c,lab:circ?(nrw>1?'R'+(r+1)+'·'+(c+1):String(c+1)):LET[c]+(r+1),w:circ?(2*r+1):1,n:0,by:{}};
  types.forEach(function(ty){ var v=t[z.id+'|'+ty]||0; z.by[ty]=v; z.n+=v; }); Z.push(z); }
 var N=Z.reduce(function(s2,z){return s2+z.n;},0), Wt=Z.reduce(function(s2,z){return s2+z.w;},0), mxn=Math.max.apply(null,Z.map(function(z){return z.n;}))||1;
 Z.forEach(function(z){ z.e=N*z.w/Wt; });
 /* drawing */
 var tt=S.f.lname||'Item'; if(tt.length>78) tt=tt.slice(0,77)+'…';
 var W=640, H, g='', dots=function(z,cx,cy,room){ var list=[]; types.forEach(function(ty,i){ for(var q=0;q<z.by[ty];q++) list.push(col[i%col.length]); }); var per=Math.max(1,Math.floor(room/11)), out='';
   if(list.length>per*per||room<22) return z.n?'<text x="'+cx+'" y="'+(cy+6)+'" text-anchor="middle" class="lc-n">'+z.n+'</text>':''; var x0=cx-(Math.min(per,list.length)*11)/2+5.5, rowsN=Math.ceil(list.length/per), y0=cy-rowsN*11/2+5.5;
   list.forEach(function(cl,i){ out+='<circle cx="'+(x0+(i%per)*11)+'" cy="'+(y0+Math.floor(i/per)*11)+'" r="4" fill="'+cl+'"/>'; }); return out; };
 var heat=function(z){ return z.n?'rgba(216,177,71,'+(0.12+0.5*z.n/mxn).toFixed(3)+')':'#fff'; };
 if(!circ){ var cs=Math.min(560/nc,340/nrw), w0=cs*nc, h0=cs*nrw, ox=(W-w0)/2, oy=26; H=h0+oy+30;
  g+='<text x="'+ox+'" y="16" class="lc-t">'+E(tt)+'</text>';
  Z.forEach(function(z){ var x=ox+z.c*cs, y=oy+z.r*cs; g+='<g class="lz" data-z="'+z.id+'" tabindex="0" role="button" aria-label="Zone '+z.lab+': '+z.n+'"><rect x="'+x+'" y="'+y+'" width="'+cs+'" height="'+cs+'" fill="'+heat(z)+'" stroke="#4A5D71" stroke-width="1"/>'+
   '<text x="'+(x+4)+'" y="'+(y+12)+'" class="lc-z">'+z.lab+'</text>'+(z.n?'<text x="'+(x+cs-4)+'" y="'+(y+cs-5)+'" text-anchor="end" class="lc-n">'+z.n+'</text>':'')+dots(z,x+cs/2,y+cs/2+2,cs-26).replace(/^<text[^]*$/,'')+'</g>'; });
  g+='<rect x="'+ox+'" y="'+oy+'" width="'+w0+'" height="'+h0+'" fill="none" stroke="#0F3E68" stroke-width="3" pointer-events="none"/>';
 } else { var R0=Math.min(200,(W-80)/2), cx=W/2, cy=R0+52; H=2*R0+84;
  g+='<text x="20" y="18" class="lc-t">'+E(tt)+'</text>';
  var pt=function(rad,ang){ return (cx+rad*Math.sin(ang)).toFixed(2)+' '+(cy-rad*Math.cos(ang)).toFixed(2); };
  Z.forEach(function(z){ var r1=R0*z.r/nrw, r2=R0*(z.r+1)/nrw, a1=((z.c+0.5)/nc-0.5/nc*0)*2*Math.PI, step=2*Math.PI/nc, ac=(z.c+1)*step, aa=ac-step/2, ab=ac+step/2, d;
   if(nc===1) d=r1>0?'M'+pt(r2,0)+' A'+r2+' '+r2+' 0 1 1 '+pt(r2,Math.PI)+' A'+r2+' '+r2+' 0 1 1 '+pt(r2,2*Math.PI-1e-6)+' Z M'+pt(r1,0)+' A'+r1+' '+r1+' 0 1 0 '+pt(r1,Math.PI)+' A'+r1+' '+r1+' 0 1 0 '+pt(r1,2*Math.PI-1e-6)+' Z':'M'+pt(r2,0)+' A'+r2+' '+r2+' 0 1 1 '+pt(r2,Math.PI)+' A'+r2+' '+r2+' 0 1 1 '+pt(r2,2*Math.PI-1e-6)+' Z';
   else d='M'+pt(r2,aa)+' A'+r2+' '+r2+' 0 '+(step>Math.PI?1:0)+' 1 '+pt(r2,ab)+(r1>0?' L'+pt(r1,ab)+' A'+r1+' '+r1+' 0 '+(step>Math.PI?1:0)+' 0 '+pt(r1,aa):' L'+cx+' '+cy)+' Z';
   var rm=(r1+r2)/2, mid=pt(rm,ac).split(' '), room=Math.min(r2-r1,rm*step)*0.8;
   g+='<g class="lz" data-z="'+z.id+'" tabindex="0" role="button" aria-label="Zone '+z.lab+': '+z.n+'"><path d="'+d+'" fill="'+heat(z)+'" stroke="#4A5D71" stroke-width="1" fill-rule="evenodd"/>'+dots(z,+mid[0],+mid[1],room)+'</g>';
   if(z.r===nrw-1){ var lp=pt(R0+14,ac).split(' '); g+='<text x="'+lp[0]+'" y="'+(+lp[1]+4)+'" text-anchor="middle" class="lc-z">'+(c1(z.c))+'</text>'; } });
  g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R0+'" fill="none" stroke="#0F3E68" stroke-width="3" pointer-events="none"/>';
  if(nrw>1) for(var rr=0;rr<nrw;rr++){ var lp2=pt(R0*(rr+0.5)/nrw,0).split(' '); g+='<text x="'+(+lp2[0]+3)+'" y="'+lp2[1]+'" class="lc-z" pointer-events="none">R'+(rr+1)+'</text>'; }
 }
 function c1(c){ return String(c+1); }
 SV.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Location check sheet"><style>.lc-t{font:600 14px Archivo,sans-serif;fill:#16273A}.lc-z{font:600 11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lc-n{font:800 15px Archivo,sans-serif;fill:#0F3E68}.lz{cursor:pointer}.lz:hover path,.lz:hover rect{stroke:#D8B147;stroke-width:3}</style>'+g+'</svg>';
 function bump(id,d){ var k=id+'|'+X.la; t[k]=Math.max(0,(t[k]||0)+d); if(!t[k]) delete t[k]; api.save(); }
 SV.querySelectorAll('.lz').forEach(function(el){ var id=el.getAttribute('data-z'), tm;
  el.onclick=function(){ bump(id,1); }; el.oncontextmenu=function(e){ e.preventDefault(); bump(id,-1); };
  el.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); bump(id,1); } else if(e.key==='Backspace'||e.key==='Delete'){ e.preventDefault(); bump(id,-1); } };
  el.ontouchstart=function(){ tm=setTimeout(function(){ tm=null; bump(id,-1); },550); }; el.ontouchend=function(e){ if(tm) clearTimeout(tm); else e.preventDefault(); }; });
 /* totals */
 var byT=types.map(function(ty){ return Z.reduce(function(s2,z){return s2+z.by[ty];},0); });
 STt.innerHTML='<div class="stat"><div><b>'+N+'</b><span>Defects recorded</span></div><div><b>'+Z.length+'</b><span>Zones</span></div>'+types.map(function(ty,i){ return '<div><b>'+byT[i]+'</b><span>'+E(ty)+'</span></div>'; }).join('')+'</div>';
 var used=Z.filter(function(z){return z.n>0;}).sort(function(a,b){return b.n-a.n||a.r-b.r||a.c-b.c;});
 TB.innerHTML=used.length?'<thead><tr><th>Zone</th>'+types.map(function(ty){return '<th>'+E(ty)+'</th>';}).join('')+'<th>Total</th><th>Share</th><th>Expected if even'+(circ&&nrw>1?' (by area)':'')+'</th><th>Observed ÷ expected</th></tr></thead><tbody>'+used.map(function(z){ return '<tr><td><b>'+z.lab+'</b></td>'+types.map(function(ty){return '<td>'+(z.by[ty]||'')+'</td>';}).join('')+'<td><b>'+z.n+'</b></td><td>'+F(100*z.n/N,1)+'%</td><td>'+F(z.e,2)+'</td><td>'+F(z.n/z.e,2)+'</td></tr>'; }).join('')+'</tbody>':'';
 if(!N){ O.innerHTML=api.flags([],'Click a zone to record a defect there. Zones that collect many defects point to a cause at that spot.'); return; }
 var chi=Z.reduce(function(s2,z){ return s2+(z.n-z.e)*(z.n-z.e)/z.e; },0), df=Z.length-1, pv=df>0?window.TOOL.gq(df/2,chi/2):NaN, top=used[0], minE=Math.min.apply(null,Z.map(function(z){return z.e;}));
 f.push(['',(used.length>1?'Most defects are in zone <b>':'Every defect is in zone <b>')+top.lab+'</b>: '+top.n+' of '+N+' ('+F(100*top.n/N,1)+'%), '+F(top.n/top.e,1)+' times what an even spread would put there.']);
 if(df>0){ f.push([pv<0.05?'warn':'ok','Chi-square test of an even spread'+(circ&&nrw>1?' (by area)':'')+': χ² = '+F(chi,2)+' with '+df+' df, p '+(pv<0.0001?'&lt; 0.0001':'= '+pv.toFixed(4))+'. '+(pv<0.05?'The defects are concentrated, not scattered at random: look for a cause at the busy zones (a tool, a fixture contact point, a handling spot).':'The pattern is consistent with defects landing anywhere at random; no zone stands out yet.')]);
  if(minE<5) f.push(['','The expected count per zone is only '+F(minE,2)+' (below 5), so the chi-square p value is approximate. Collect more, or use fewer, larger zones.']); }
 f.push(['','Sort the zones from most to fewest defects and you have a Pareto of locations. Stratify the sheet (one per shift, machine or lot) if you suspect the pattern changes.']);
 O.innerHTML=api.flags(f);
 var cv=root.querySelector('#lccsv'); if(cv) cv.onclick=function(){ var cs2=function(v){ v=String(v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; };
  var lines=[['Zone'].concat(types).concat(['Total','Expected if even']).map(cs2).join(',')].concat(Z.map(function(z){ return [z.lab].concat(types.map(function(ty){return z.by[ty];})).concat([z.n,z.e.toFixed(3)]).map(cs2).join(','); }));
  api.download('location-check-sheet-'+api.today()+'.csv','﻿'+lines.join('\r\n'),'text/csv'); };
 var cl=root.querySelector('#lcclr'); if(cl) cl.onclick=function(){ X.lt={}; api.save(); };
},
example:{f:{q:'Is the seal-nick rate different between shifts, and between O-ring lots?',owner:'Yellow Belt, second shift',start:'2026-08-03',
  cats:'Seal nicked\nSeal missing\nSeal twisted\nWrong seal\nOther',pers:'Mon\nTue\nWed\nThu\nFri',
  lname:'Pump cover seal groove, viewed from the pump side (sector 3 = cross-drilled port)',lshape:'Circle (rings × sectors)',lc:'12',lr:'1',ltypes:'Nick\nCut\nTwist'},
 g:{plan:[{m:'Seal defects at final test',type:'Attribute (pass/fail, category)',def:'Any assembly failing the 30 s leak test, then opened and classified by the defect categories on the check sheet. Assemblies failing for other reasons are recorded as Other.',src:'Final test station, line 3',how:'Check sheet at the station',n:'All',freq:'Every assembly, 2 weeks',who:'Test operator',strat:'Shift, O-ring lot number'},
  {m:'Installation force',type:'Continuous (variable)',def:'Peak force in newtons on the installation press, read from the press display for the cycle, to the nearest 1 N.',src:'Press P-3',how:'Recorded on the traveler',n:'5',freq:'Each hour',who:'Assembler',strat:'Shift, sleeve fitted yes/no'}]},
 x:{t:{'Seal nicked|Mon':6,'Seal nicked|Tue':4,'Seal nicked|Wed':7,'Seal nicked|Thu':5,'Seal nicked|Fri':6,'Seal missing|Tue':1,'Seal twisted|Mon':1,'Seal twisted|Thu':2,'Other|Wed':1,'Other|Fri':1},
  la:'Nick',lt:{'0|0|Nick':1,'0|1|Nick':4,'0|2|Nick':9,'0|3|Nick':3,'0|5|Nick':1,'0|8|Nick':1,'0|10|Nick':1,'0|1|Cut':1,'0|2|Cut':2,'0|7|Cut':1,'0|5|Twist':1,'0|6|Twist':1,'0|11|Twist':1}}}
}
