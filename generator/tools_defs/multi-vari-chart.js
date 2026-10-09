{
slug:'multi-vari-chart',
ST:(function(){
 var C=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 function gln(x){ if(x<0.5) return Math.log(Math.PI/Math.sin(Math.PI*x))-gln(1-x); x-=1; var a=C[0],t=x+7.5; for(var i=1;i<9;i++) a+=C[i]/(x+i); return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap,m,m2,aa,del,h; if(Math.abs(d)<1e-300)d=1e-300; d=1/d; h=d;
  for(m=1;m<=300;m++){ m2=2*m; aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-15) break; }
  return h; }
 function ib(a,b,x){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 function fsf(F,a,b){ return !(F>0)?1:ib(b/2,a/2,b/(b+a*F)); }
 function pfmt(p){ return !isFinite(p)?'—':p<0.0001?'&lt; 0.0001':p.toFixed(4); }
 return {fsf:fsf,pfmt:pfmt};
})(),
sections:[
 {type:'fields',title:'The study',cols:3,hint:'Measure several positions on each piece, several consecutive pieces at each time, and repeat at several times. The three families of variation are then within-piece, piece-to-piece and time-to-time.',fields:[
  {id:'u',label:'Characteristic measured, with units',ph:'e.g. Bearing journal diameter, mm',wide:true},
  {id:'lsl',label:'Lower spec limit (optional)',type:'number'},
  {id:'usl',label:'Upper spec limit (optional)',type:'number'},
  {id:'who',label:'Process and study notes',ph:'e.g. Lathe 4, one shift'},
  {id:'d',label:'Measurements, one reading per row: the time period, the piece it came from, the position on the piece, and the value',type:'datagrid',cols:[{label:'Time period',type:'text',ph:'07:00'},{label:'Piece',type:'text',ph:'1'},{label:'Position',type:'text',ph:'Left'},{label:'Measurement',ph:'25.003'}],rows:12,minRows:6}]},
 {type:'custom',id:'chart',title:'Multi-vari chart',hint:'Each vertical bar is one piece, from its lowest to its highest reading; the dots are the positions. The navy line joins the piece means inside each time period and the gold diamonds are the time-period means.',html:'<div class="svgw mvc-svg"></div>'},
 {type:'custom',id:'vc',title:'Share of variation by family',hint:'Method: nested (hierarchical) analysis of variance with all three families treated as random, variance components estimated from the expected mean squares (method of moments); a negative estimate is set to zero. Readings on the same piece are the within-piece family.',html:'<div class="mvc-st"></div><div class="tgw"><table class="mv mvc-tb"></table></div>'},
 {type:'custom',id:'read',title:'What the study says',html:'<div class="out mvc-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F0=api.fmt, E=api.esc, F=function(v,d){ return (v<0?'−':'')+F0(Math.abs(v),d); }, pf=function(p){ return isFinite(p)&&p<0.0001?'p &lt; 0.0001':'p = '+ST.pfmt(p); };
 var SV=root.querySelector('.mvc-svg'), STT=root.querySelector('.mvc-st'), TB=root.querySelector('.mvc-tb'), O=root.querySelector('.mvc-out'), f=[];
 var lsl=api.num(S.f.lsl), usl=api.num(S.f.usl), bad=0, miss=0, dp=0, recs=[];
 (S.f.d||'').split('\n').forEach(function(l){ if(!l.replace(/\s/g,'')) return; var t=l.split('\t');
  var tm=(t[0]||'').trim(), pc=(t[1]||'').trim(), ps=(t[2]||'').trim(), vs=(t[3]||'').trim().replace(',','.'), v=vs===''?NaN:Number(vs);
  if(vs===''){ return; } if(!isFinite(v)){ bad++; return; } if(!tm||!pc){ miss++; return; }
  dp=Math.max(dp,(vs.split('.')[1]||'').length); recs.push({t:tm,p:pc,s:ps,v:v}); });
 dp=Math.min(Math.max(dp,1),6);
 var times=[], tmap={}, pieces=[], pmap={}, posn=[], pos={};
 recs.forEach(function(r){
  if(!tmap[r.t]){ tmap[r.t]={name:r.t,pcs:[],v:[]}; times.push(tmap[r.t]); }
  var k=r.t+'\t'+r.p; if(!pmap[k]){ pmap[k]={name:r.p,t:tmap[r.t],v:[],r:[]}; pieces.push(pmap[k]); tmap[r.t].pcs.push(pmap[k]); }
  pmap[k].v.push(r.v); pmap[k].r.push(r); tmap[r.t].v.push(r.v);
  if(r.s&&!(r.s in pos)){ pos[r.s]=posn.length; posn.push(r.s); } });
 function mean(v){ var s=0; v.forEach(function(x){s+=x;}); return s/v.length; }
 var N=recs.length, a=times.length, b=pieces.length;
 if(!N){ SV.innerHTML=''; STT.innerHTML=''; TB.innerHTML=''; O.innerHTML=api.flags(bad||miss?[['warn',(bad?bad+' row'+(bad>1?'s have':' has')+' a measurement that is not a number. ':'')+(miss?miss+' row'+(miss>1?'s are':' is')+' missing the time period or the piece.':'')]]:[],'Enter the readings, one per row, with the time period and the piece each came from. The chart and the breakdown appear here.'); return; }
 var gm=mean(recs.map(function(r){return r.v;}));
 times.forEach(function(t){ t.m=mean(t.v); }); pieces.forEach(function(p){ p.m=mean(p.v); p.lo=Math.min.apply(null,p.v); p.hi=Math.max.apply(null,p.v); });
 /* ---- chart ---- */
 var cols=['#0F3E68','#1F8C55','#C0392B','#7C8B99','#4A5D71','#16273A'];
 var vals=recs.map(function(r){return r.v;}); if(isFinite(lsl)) vals.push(lsl); if(isFinite(usl)) vals.push(usl);
 var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), pd=(mx-mn)*0.08||Math.abs(mx)*0.01||1; mn-=pd; mx+=pd;
 var L=78, R=20, top=14, ph=250, gap=26, pw=Math.max(16,Math.min(56,(800-L-R-a*gap)/b)), W=Math.max(640,Math.round(L+R+a*gap+b*pw)), lg=posn.length?26:0, H=top+ph+56+lg;
 var Y=function(v){return top+ph-(v-mn)/(mx-mn)*ph;};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Multi-vari chart"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
 var st0=(mx-mn)/5, mg=Math.pow(10,Math.floor(Math.log(st0)/Math.LN10)), st=[1,2,2.5,5,10].map(function(k){return k*mg;}).filter(function(k){return k>=st0;})[0]||10*mg, tdp=Math.max(0,-Math.floor(Math.log(st)/Math.LN10+1e-9))+(st/mg===2.5?1:0);
 for(var tv=Math.ceil(mn/st-1e-9)*st;tv<=mx+1e-12;tv+=st){ g+='<line x1="'+L+'" y1="'+Y(tv)+'" x2="'+(W-R)+'" y2="'+Y(tv)+'" stroke="#EDEFEA"/><text class="ax" x="'+(L-6)+'" y="'+(Y(tv)+4)+'" text-anchor="end">'+F(tv,Math.max(tdp,dp))+'</text>'; }
 [[lsl,'LSL'],[usl,'USL']].forEach(function(s){ if(isFinite(s[0])) g+='<line x1="'+L+'" y1="'+Y(s[0])+'" x2="'+(W-R)+'" y2="'+Y(s[0])+'" stroke="#C0392B" stroke-dasharray="6 4" stroke-width="1.4"/><text x="'+(W-R-4)+'" y="'+(Y(s[0])-4)+'" text-anchor="end" style="fill:#C0392B;font-size:12px">'+s[1]+' '+F(s[0],dp)+'</text>'; });
 var x0=L, tx=[];
 times.forEach(function(t,ti){ var xs=x0+gap/2, pts=[];
  if(ti) g+='<line x1="'+x0+'" y1="'+top+'" x2="'+x0+'" y2="'+(top+ph)+'" stroke="#DDE1E4"/>';
  t.pcs.forEach(function(p,j){ var cx=xs+pw*(j+0.5); p.cx=cx; pts.push(cx+','+Y(p.m));
   g+='<line x1="'+cx+'" y1="'+Y(p.lo)+'" x2="'+cx+'" y2="'+Y(p.hi)+'" stroke="#7C8B99" stroke-width="2"/>';
   p.r.forEach(function(r){ var c=r.s?cols[pos[r.s]%cols.length]:'#4A5D71'; g+='<circle cx="'+cx+'" cy="'+Y(r.v)+'" r="3.8" fill="'+c+'" fill-opacity=".85"/>'; });
   if(b<=40) g+='<text class="ax" x="'+cx+'" y="'+(top+ph+16)+'" text-anchor="middle" style="font-size:11px">'+E(p.name.length>5?p.name.slice(0,4)+'…':p.name)+'</text>'; });
  if(pts.length>1) g+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="1.6"/>';
  var cxm=x0+(gap+t.pcs.length*pw)/2; tx.push(cxm+','+Y(t.m));
  g+='<text x="'+cxm+'" y="'+(top+ph+36)+'" text-anchor="middle">'+E(t.name.length>14?t.name.slice(0,13)+'…':t.name)+'</text>';
  x0+=gap+t.pcs.length*pw; });
 if(tx.length>1) g+='<polyline points="'+tx.join(' ')+'" fill="none" stroke="#D8B147" stroke-width="2" stroke-dasharray="6 4"/>';
 tx.forEach(function(q){ var c=q.split(','), x=+c[0], y=+c[1]; g+='<path d="M'+x+' '+(y-7)+'L'+(x+7)+' '+y+'L'+x+' '+(y+7)+'L'+(x-7)+' '+y+'Z" fill="#D8B147" stroke="#9C7C1F"/>'; });
 g+='<line x1="'+L+'" y1="'+(top+ph)+'" x2="'+(W-R)+'" y2="'+(top+ph)+'" stroke="#C6CDD3"/>';
 g+='<text class="ax" transform="translate(14,'+(top+ph/2)+') rotate(-90)" text-anchor="middle">'+E((S.f.u||'Measurement').slice(0,40))+'</text>';
 if(posn.length){ var lx=L, ly=H-10; g+='<text class="ax" x="'+lx+'" y="'+ly+'">Position:</text>'; lx+=62;
  posn.slice(0,6).forEach(function(s,k){ g+='<circle cx="'+(lx+5)+'" cy="'+(ly-4)+'" r="4.5" fill="'+cols[k]+'"/><text class="ax" x="'+(lx+14)+'" y="'+ly+'">'+E(s.length>12?s.slice(0,11)+'…':s)+'</text>'; lx+=24+Math.min(s.length,12)*7.2; });
  if(posn.length>6) g+='<text class="ax" x="'+lx+'" y="'+ly+'">(colors repeat)</text>'; }
 SV.innerHTML=g+'</svg>';
 /* ---- nested ANOVA ---- */
 var ssT=0, ssP=0, ssE=0, sumN2i=0, sumNij2overNi=0, sumNij2=0;
 times.forEach(function(t){ var ni=t.v.length, s2=0; ssT+=ni*(t.m-gm)*(t.m-gm); sumN2i+=ni*ni;
  t.pcs.forEach(function(p){ var nij=p.v.length; ssP+=nij*(p.m-t.m)*(p.m-t.m); s2+=nij*nij; sumNij2+=nij*nij; p.v.forEach(function(v){ ssE+=(v-p.m)*(v-p.m); }); });
  sumNij2overNi+=s2/ni; });
 var dfT=a-1, dfP=b-a, dfE=N-b;
 var bal=true, n0=pieces[0].v.length, b0=times[0].pcs.length; pieces.forEach(function(p){ if(p.v.length!==n0) bal=false; }); times.forEach(function(t){ if(t.pcs.length!==b0) bal=false; });
 var need=a<2?'Enter readings from at least two time periods.':dfP<1?'Each time period has only one piece, so piece-to-piece variation cannot be separated from time-to-time. Measure two or more consecutive pieces per period.':dfE<1?'Each piece has only one reading, so within-piece variation cannot be estimated. Measure two or more positions per piece.':'';
 if(bad) f.push(['warn',bad+' row'+(bad>1?'s have':' has')+' a measurement that is not a number and '+(bad>1?'were':'was')+' left out.']);
 if(miss) f.push(['warn',miss+' row'+(miss>1?'s are':' is')+' missing the time period or the piece and '+(miss>1?'were':'was')+' left out.']);
 if(need){ STT.innerHTML=''; TB.innerHTML=''; O.innerHTML=api.flags(f.concat([['warn',need]])); return; }
 if(!(ssT+ssP+ssE>0)){ STT.innerHTML=''; TB.innerHTML=''; O.innerHTML=api.flags(f.concat([['warn','All readings are identical, so there is no variation to break down. Check that the gauge resolution is fine enough to see the variation (a common rule is one tenth of the tolerance or better).']])); return; }
 var msT=ssT/dfT, msP=ssP/dfP, msE=ssE/dfE;
 var k1=(N-sumNij2overNi)/dfP, k2=(sumNij2overNi-sumNij2/N)/dfT, k3=(N-sumN2i/N)/dfT;
 var vE=msE, vPraw=(msP-msE)/k1, vP=Math.max(0,vPraw), vTraw=(msT-msE-k2*vP)/k3, vT=Math.max(0,vTraw), vTot=vE+vP+vT;
 var FP=msP/msE, pP=ST.fsf(FP,dfP,dfE), FT=msT/msP, pT=ST.fsf(FT,dfT,dfP);
 var sh=function(v){ return vTot>0?v/vTot*100:0; };
 var fam=[['Time-to-time',vT,'Between time periods'],['Piece-to-piece',vP,'Pieces within a period'],['Within-piece',vE,'Positions within a piece']];
 STT.innerHTML='<div class="stat">'+fam.map(function(x){ return '<div><b>'+sh(x[1]).toFixed(1)+'%</b><span>'+x[0]+'</span></div>'; }).join('')+'<div><b>'+F(Math.sqrt(vTot),dp+1)+'</b><span>Total std dev</span></div></div>';
 TB.innerHTML='<thead><tr><th>Family</th><th>df</th><th>SS</th><th>MS</th><th>F</th><th>p</th><th>Variance</th><th>Std dev</th><th>% of variance</th></tr></thead><tbody>'+
  [['Time-to-time',dfT,ssT,msT,FT,pT,vT],['Piece-to-piece',dfP,ssP,msP,FP,pP,vP],['Within-piece',dfE,ssE,msE,NaN,NaN,vE]].map(function(r){
   return '<tr><td class="mo">'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2].toExponential(3)+'</td><td>'+r[3].toExponential(3)+'</td><td>'+(isFinite(r[4])?r[4].toFixed(2):'')+'</td><td>'+(isFinite(r[5])?ST.pfmt(r[5]):'')+'</td><td>'+r[6].toExponential(3)+'</td><td>'+F(Math.sqrt(r[6]),dp+1)+'</td><td><b>'+sh(r[6]).toFixed(1)+'%</b></td></tr>'; }).join('')+
  '</tbody><tfoot><tr><td class="mo">Total</td><td>'+(N-1)+'</td><td>'+(ssT+ssP+ssE).toExponential(3)+'</td><td></td><td></td><td></td><td>'+vTot.toExponential(3)+'</td><td>'+F(Math.sqrt(vTot),dp+1)+'</td><td>100%</td></tr></tfoot>';
 /* ---- reading ---- */
 var ord=fam.slice().sort(function(p,q){return q[1]-p[1];}), top1=ord[0], hint={
  'Within-piece':'look at the piece itself: taper, out-of-round, fixturing and clamping, tool or workpiece deflection, or a measurement system that cannot repeat',
  'Piece-to-piece':'look at what changes from one cycle to the next: material, loading and location, cycle-to-cycle machine variation, operator technique',
  'Time-to-time':'look at what changes over hours or shifts: warm-up and temperature, tool wear, adjustments, shift and lot changes'};
 if(vTot>0) f.unshift(['ok','<b>'+top1[0]+' is the largest family</b> at '+sh(top1[1]).toFixed(1)+'% of the total variance (std dev '+F(Math.sqrt(top1[1]),dp+1)+'), followed by '+ord[1][0].toLowerCase()+' at '+sh(ord[1][1]).toFixed(1)+'%. To find the cause, '+hint[top1[0]]+'.']);
 else f.unshift(['warn','All readings are identical, so there is no variation to break down. Check the gauge resolution.']);
 f.push(['','Piece-to-piece F = '+(isFinite(FP)?FP.toFixed(2):'—')+' ('+dfP+', '+dfE+' df), '+pf(pP)+'; time-to-time F = '+(isFinite(FT)?FT.toFixed(2):'—')+' ('+dfT+', '+dfP+' df), '+pf(pT)+'. In a nested design the time periods are tested against the piece-to-piece mean square, not against the within-piece one.'+(bal?'':' With unequal numbers of pieces or readings, the time F test is approximate.')]);
 if(vPraw<0||vTraw<0) f.push(['','The '+(vPraw<0?'piece-to-piece':'time-to-time')+' mean square was smaller than expected from the family below it, which gives a negative variance estimate. It is set to zero, the usual convention: that family is too small to detect with this sample.']);
 /* position pattern: only when every piece has each position once */
 if(posn.length>1){ var full=pieces.every(function(p){ if(p.r.length!==posn.length) return false; var seen={}; return p.r.every(function(r){ if(!r.s||seen[r.s]) return false; seen[r.s]=1; return true; }); });
  if(full){ var dev=posn.map(function(){return 0;}); pieces.forEach(function(p){ p.r.forEach(function(r){ dev[pos[r.s]]+=r.v-p.m; }); });
   dev=dev.map(function(d){return d/b;}); var ssPos=0; dev.forEach(function(d){ ssPos+=b*d*d; });
   var dfPos=posn.length-1, dfR=dfE-dfPos, Fp=dfR>0&&ssE-ssPos>0?(ssPos/dfPos)/((ssE-ssPos)/dfR):NaN, pp=isFinite(Fp)?ST.fsf(Fp,dfPos,dfR):NaN, shp=ssE>0?ssPos/ssE*100:0;
   var hiI=0, loI=0; dev.forEach(function(d,k){ if(d>dev[hiI]) hiI=k; if(d<dev[loI]) loI=k; });
   f.push([pp<0.05?'warn':'','<b>Position pattern</b>: averaged over all '+b+' pieces, '+E(posn[hiI])+' reads '+(dev[hiI]>0?'+':'')+F(dev[hiI],dp+1)+' and '+E(posn[loI])+' reads '+F(dev[loI],dp+1)+' from the piece mean. A consistent position pattern accounts for '+shp.toFixed(0)+'% of the within-piece sum of squares (F = '+(isFinite(Fp)?Fp.toFixed(2):'—')+', '+pf(pp)+'). '+(pp<0.05?'A repeatable pattern such as taper points to a fixed cause in the setup, the tooling or the fixture rather than random noise.':'No consistent position pattern stands out; the within-piece variation looks random from piece to piece.')]); }
  else f.push(['','The position pattern check needs every piece to carry each position once; some pieces do not, so it was skipped.']); }
 if(isFinite(lsl)||isFinite(usl)){ var out=recs.filter(function(r){ return (isFinite(lsl)&&r.v<lsl)||(isFinite(usl)&&r.v>usl); }).length;
  var tol=isFinite(lsl)&&isFinite(usl)&&usl>lsl?usl-lsl:NaN;
  f.push([out?'warn':'',(out?out+' of '+N+' readings fall outside the specification.':'All '+N+' readings are inside the specification.')+(isFinite(tol)?' Six total standard deviations span '+F(6*Math.sqrt(vTot),dp)+', '+(6*Math.sqrt(vTot)/tol*100).toFixed(0)+'% of the tolerance; removing the '+top1[0].toLowerCase()+' family would cut that to '+(6*Math.sqrt(vTot-top1[1])/tol*100).toFixed(0)+'%.':'')]); }
 if(!bal) f.push(['warn','The study is unbalanced (different numbers of pieces per period or readings per piece). The components use the general unbalanced expected mean squares and are approximate; a balanced study is easier to read.']);
 if(a<6) f.push(['','The time-to-time estimate rests on only '+a+' periods ('+dfT+' df), so it is the least precise of the three. Sample more periods before acting on a small difference in this family.']);
 f.push(['','A multi-vari study is passive: it observes the process as it runs. It narrows the search to one family of variation; it does not prove a cause. Confirm the suspected cause with a designed experiment or a before-and-after test.']);
 O.innerHTML=api.flags(f);
},
example:{f:{u:'Pump shaft bearing journal diameter, mm',lsl:'24.980',usl:'25.020',who:'Kessler Pump Works, CNC lathe 4, day shift',
 d:'07:00\t1\tLeft\t24.998\n07:00\t1\tCenter\t24.995\n07:00\t1\tRight\t24.991\n07:00\t2\tLeft\t24.999\n07:00\t2\tCenter\t24.996\n07:00\t2\tRight\t24.995\n07:00\t3\tLeft\t24.997\n07:00\t3\tCenter\t24.995\n07:00\t3\tRight\t24.994\n09:00\t4\tLeft\t24.999\n09:00\t4\tCenter\t24.997\n09:00\t4\tRight\t24.996\n09:00\t5\tLeft\t25.001\n09:00\t5\tCenter\t24.998\n09:00\t5\tRight\t24.997\n09:00\t6\tLeft\t25.001\n09:00\t6\tCenter\t25.001\n09:00\t6\tRight\t24.998\n11:00\t7\tLeft\t24.996\n11:00\t7\tCenter\t24.996\n11:00\t7\tRight\t24.994\n11:00\t8\tLeft\t25.006\n11:00\t8\tCenter\t25.006\n11:00\t8\tRight\t25.000\n11:00\t9\tLeft\t25.007\n11:00\t9\tCenter\t25.003\n11:00\t9\tRight\t25.001\n13:00\t10\tLeft\t25.005\n13:00\t10\tCenter\t25.005\n13:00\t10\tRight\t25.003\n13:00\t11\tLeft\t25.004\n13:00\t11\tCenter\t25.003\n13:00\t11\tRight\t25.000\n13:00\t12\tLeft\t25.008\n13:00\t12\tCenter\t25.006\n13:00\t12\tRight\t25.003\n15:00\t13\tLeft\t25.007\n15:00\t13\tCenter\t25.004\n15:00\t13\tRight\t25.001\n15:00\t14\tLeft\t25.005\n15:00\t14\tCenter\t25.005\n15:00\t14\tRight\t25.001\n15:00\t15\tLeft\t25.006\n15:00\t15\tCenter\t25.003\n15:00\t15\tRight\t25.002'}}
}
