{
slug:'full-factorial-doe',
ST:(function(){
 var C=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 function gln(x){ if(x<0.5) return Math.log(Math.PI/Math.sin(Math.PI*x))-gln(1-x); x-=1; var a=C[0],t=x+7.5; for(var i=1;i<9;i++) a+=C[i]/(x+i); return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap,m,m2,aa,del,h; if(Math.abs(d)<1e-300)d=1e-300; d=1/d; h=d;
  for(m=1;m<=300;m++){ m2=2*m; aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-15) break; }
  return h; }
 function ib(a,b,x){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 function gq(a,x){ if(x<=0) return 1; var g=gln(a),s,del,ap,n,b,c,d,h,an,i;
  if(x<a+1){ ap=a; s=1/a; del=s; for(n=0;n<1000;n++){ ap++; del*=x/ap; s+=del; if(Math.abs(del)<Math.abs(s)*1e-16) break; } return 1-s*Math.exp(-x+a*Math.log(x)-g); }
  b=x+1-a; c=1e300; d=1/b; h=d; for(i=1;i<1000;i++){ an=-i*(i-a); b+=2; d=an*d+b; if(Math.abs(d)<1e-300)d=1e-300; c=b+an/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-16) break; }
  return Math.exp(-x+a*Math.log(x)-g)*h; }
 function t2(t,v){ return ib(v/2,0.5,v/(v+t*t)); }
 function tcdf(t,v){ var p=0.5*t2(t,v); return t>0?1-p:p; }
 function tsf(t,v){ var p=0.5*t2(t,v); return t>0?p:1-p; }
 function fsf(F,a,b){ return F<=0?1:ib(b/2,a/2,b/(b+a*F)); }
 function csf(x,k){ return gq(k/2,x/2); }
 function nsf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?q:1-q; }
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function tinv(p,v){ return inv(function(t){return tcdf(t,v);},p,-1e4,1e4); }
 function zinv(p){ return inv(function(z){return 1-nsf(z);},p,-40,40); }
 function finv(p,a,b){ return inv(function(F){return 1-fsf(F,a,b);},p,0,1e6); }
 function pfmt(p){ return !isFinite(p)?'—':p<0.0001?'&lt; 0.0001':p.toFixed(4); }
 return {gln:gln,ib:ib,gq:gq,t2:t2,tcdf:tcdf,tsf:tsf,fsf:fsf,csf:csf,nsf:nsf,tinv:tinv,zinv:zinv,finv:finv,pfmt:pfmt};
})(),
sections:[
 {type:'fields',title:'Design',cols:3,hint:'Two levels per factor. Runs are listed in standard (Yates) order; randomize the order you actually run them in.',fields:[
  {id:'k',label:'Number of factors (k)',type:'select',opts:['2','3','4']},
  {id:'r',label:'Replicates of each run',type:'select',opts:['1','2','3']},
  {id:'a',label:'Significance level α',type:'number',min:0.001,max:0.5,ph:'0.05'},
  {id:'y',label:'Response, with units',ph:'e.g. Shrinkage, %'},
  {id:'goal',label:'Goal for the response',type:'select',opts:['Minimize','Maximize','Hit a target']},
  {id:'ip',label:'Interaction plot for',type:'select',opts:['Largest two-factor interaction','AB','AC','AD','BC','BD','CD']},
  {id:'an',label:'Factor A name',ph:'e.g. Mold temperature, °C'},{id:'al',label:'A low (−)',ph:'e.g. 40'},{id:'ah',label:'A high (+)',ph:'e.g. 60'},
  {id:'bn',label:'Factor B name'},{id:'bl',label:'B low (−)'},{id:'bh',label:'B high (+)'},
  {id:'cn',label:'Factor C name'},{id:'cl',label:'C low (−)'},{id:'ch',label:'C high (+)'},
  {id:'dn',label:'Factor D name'},{id:'dl',label:'D low (−)'},{id:'dh',label:'D high (+)'}]},
 {type:'custom',id:'runs',title:'Runs and responses',hint:'Type each observed response. With two or more replicates the tool estimates pure error and tests every effect.',html:'<div class="tgw"><table class="mv df-runs"></table></div>'},
 {type:'custom',id:'eff',title:'Effects and coefficients (coded units)',html:'<div class="tgw"><table class="mv df-eff"></table></div><p class="th df-eq"></p><div class="svgw df-par"></div>'},
 {type:'custom',id:'plots',title:'Main effects plot and interaction plot',html:'<div class="svgw df-me"></div><div class="svgw df-ip"></div>'},
 {type:'custom',id:'read',title:'What the experiment says',html:'<div class="out df-out"></div>'}
],
blankX:function(){return {y:{}};},
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, Y=S.x.y||(S.x.y={}), a=api.num(S.f.a); if(!(a>0&&a<0.5)) a=0.05;
 var k=+(S.f.k||3), r=+(S.f.r||1), nr=1<<k, L='ABCD'.slice(0,k).split(''), fid=['a','b','c','d'];
 var fn=L.map(function(l,j){ return (S.f[fid[j]+'n']||'').trim()||('Factor '+l); }), lo=L.map(function(l,j){return (S.f[fid[j]+'l']||'').trim()||'low';}), hi=L.map(function(l,j){return (S.f[fid[j]+'h']||'').trim()||'high';}), hasLv=L.map(function(l,j){return !!((S.f[fid[j]+'l']||'').trim()||(S.f[fid[j]+'h']||'').trim());});
 var M=function(v,d){ var s=F(Math.abs(v),d); return (v<0&&/[1-9]/.test(s)?'−':'')+s; };
 var nice=function(a0,a1){ var rg=(a1-a0)||1, raw=rg/4, p10=Math.pow(10,Math.floor(Math.log(raw)/Math.LN10)), st=p10; [1,2,2.5,5,10].some(function(m){ if(m*p10>=raw-1e-12){ st=m*p10; return true; } return false; }); var dd=Math.max(0,-Math.floor(Math.log(st)/Math.LN10+1e-9)); if(Math.abs(st/p10-2.5)<1e-9) dd++; return {lo:Math.floor(a0/st+1e-9)*st,hi:Math.ceil(a1/st-1e-9)*st,st:st,d:dd}; };
 function lev(i,j){ return (i>>j)&1?1:-1; }
 var tb=root.querySelector('.df-runs'), sig=k+'|'+r+'|'+fn.join('|')+'|'+lo.join('|')+'|'+hi.join('|');
 if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig; var h='<thead><tr><th>Std order</th>'+L.map(function(l,j){return '<th>'+l+'<br>'+E(fn[j].length>18?fn[j].slice(0,17)+'…':fn[j])+'</th>';}).join('');
  for(var q=0;q<r;q++) h+='<th>'+E(S.f.y||'Response')+(r>1?'<br>rep '+(q+1):'')+'</th>';
  h+='<th>Run mean</th></tr></thead><tbody>';
  for(var i=0;i<nr;i++){ h+='<tr><td>'+(i+1)+'</td>'+L.map(function(l,j){ var p=lev(i,j)>0; return '<td class="'+(p?'hi':'lo')+'">'+(p?'+':'−')+(hasLv[j]?' <small>'+E(p?hi[j]:lo[j])+'</small>':'')+'</td>'; }).join('');
   for(var q2=0;q2<r;q2++){ var key=(i+1)+'|'+(q2+1), v=Y[key]; h+='<td><input type="number" inputmode="decimal" step="any" data-y="'+key+'" value="'+(v!=null?E(v):'')+'" aria-label="Run '+(i+1)+' replicate '+(q2+1)+'"></td>'; }
   h+='<td class="rm" data-rm="'+i+'"></td></tr>'; }
  tb.innerHTML=h+'</tbody>';
  tb.querySelectorAll('input[data-y]').forEach(function(inp){ inp.oninput=function(){ var s=inp.value.trim(); if(s==='') delete Y[inp.dataset.y]; else Y[inp.dataset.y]=s; api.save(); }; });
 }
 var EF=root.querySelector('.df-eff'), EQ=root.querySelector('.df-eq'), PA=root.querySelector('.df-par'), ME=root.querySelector('.df-me'), IP=root.querySelector('.df-ip'), O=root.querySelector('.df-out'), f=[];
 var ym=[], cnt=0, miss=0, sse=0, bal=true, all=[], inv=0, nrep=0;
 for(var i2=0;i2<nr;i2++){ var v2=[]; for(var q3=0;q3<r;q3++){ var z=api.num(Y[(i2+1)+'|'+(q3+1)]); if(isFinite(z)) v2.push(z); else miss++; }
  if(v2.length<r) bal=false; if(v2.length) inv+=1/v2.length; if(v2.length>1) nrep++; var m=v2.length?v2.reduce(function(s,x){return s+x;},0)/v2.length:NaN; ym.push(m); cnt+=v2.length; v2.forEach(function(x){ sse+=(x-m)*(x-m); all.push(x); });
  var td=tb.querySelector('[data-rm="'+i2+'"]'); if(td) td.textContent=isFinite(m)?F(m,4):''; }
 var empty=ym.filter(function(x){return !isFinite(x);}).length;
 if(empty){ EF.innerHTML=''; EQ.innerHTML=''; PA.innerHTML=''; ME.innerHTML=''; IP.innerHTML=''; O.innerHTML=api.flags(cnt?[['warn',empty+' of '+nr+' runs have no response yet. Every run needs at least one value before effects can be estimated.']]:[],'Enter a response for every run.'); return; }
 /* terms */
 var T=[]; for(var s=1;s<nr;s++){ var nm='',bits=[]; for(var j=0;j<k;j++) if((s>>j)&1){ nm+=L[j]; bits.push(j); } T.push({nm:nm,b:bits}); }
 T.sort(function(x,y){ return x.b.length-y.b.length||(x.nm<y.nm?-1:1); });
 var gm=ym.reduce(function(s2,x){return s2+x;},0)/nr;
 T.forEach(function(t){ var sp=0; for(var i=0;i<nr;i++){ var sg=1; t.b.forEach(function(j){ sg*=lev(i,j); }); sp+=sg*ym[i]; } t.e=sp/(nr/2); t.c=t.e/2; });
 var dfe=r>1?cnt-nr:0, se=NaN, crit=NaN, how='', why='', ub=r>1&&!bal&&dfe>0;
 if(dfe>0&&sse>0){ var s2e=sse/dfe; se=(2/nr)*Math.sqrt(s2e*inv); crit=ST.tinv(1-a/2,dfe)*se; T.forEach(function(t){ t.t=t.e/se; t.p=ST.t2(t.t,dfe); }); how='pure error ('+dfe+' df'+(ub?', unbalanced':'')+')'; }
 else if(dfe>0){ why='The replicates agree exactly, so the pure error is zero and the effects cannot be tested. Check that the replicates are independent repeats of the run, not repeat readings of one part.'; dfe=0; }
 if(!isFinite(crit)&&!why&&T.length>=7){ var ab=T.map(function(t){return Math.abs(t.e);}).sort(function(x,y){return x-y;}), md=function(v){var n=v.length;return n%2?v[(n-1)/2]:(v[n/2-1]+v[n/2])/2;};
  var s0=1.5*md(ab), pse=1.5*md(ab.filter(function(x){return x<2.5*s0;})); if(pse>0){ se=pse; crit=ST.tinv(1-a/2,T.length/3)*pse; T.forEach(function(t){ t.t=t.e/pse; }); how='Lenth’s pseudo standard error ('+(T.length/3).toFixed(1)+' df)'; } else why='Lenth’s pseudo standard error is zero (most of the effects are exactly zero), so there is nothing to judge the other effects against. Replicate some runs to get a pure error estimate.'; }
 if(!isFinite(crit)&&!why) why='A 2² design has only three effects, too few for Lenth’s method, so it needs at least one run replicated to estimate error.';
 var dp=4;
 EF.innerHTML='<thead><tr><th>Term</th><th>Effect</th><th>Coefficient</th>'+(dfe?'<th>t</th><th>p value</th>':isFinite(crit)?'<th>Effect ÷ PSE</th>':'')+'</tr></thead><tbody><tr><td class="mo">Constant (grand mean)</td><td></td><td>'+M(gm,dp)+'</td>'+(dfe?'<td></td><td></td>':isFinite(crit)?'<td></td>':'')+'</tr>'+
  T.map(function(t){ var sigf=isFinite(crit)&&Math.abs(t.e)>crit; return '<tr'+(sigf?' class="sig"':'')+'><td class="mo">'+t.nm+(t.b.length===1?' '+E(fn[t.b[0]]):'')+'</td><td>'+M(t.e,dp)+'</td><td>'+M(t.c,dp)+'</td>'+(dfe?'<td>'+(isFinite(t.t)?M(t.t,2):'—')+'</td><td>'+ST.pfmt(t.p)+'</td>':isFinite(crit)?'<td>'+M(t.t,2)+'</td>':'')+'</tr>'; }).join('')+'</tbody>';
 var act=T.filter(function(t){ return isFinite(crit)?Math.abs(t.e)>crit:true; });
 EQ.innerHTML='Model in coded units'+(isFinite(crit)?', significant terms only':'')+': <b>ŷ = '+M(gm,dp)+act.map(function(t){ return ' '+(t.c<0?'−':'+')+' '+F(Math.abs(t.c),dp)+'·'+t.nm.split('').join('·'); }).join('')+'</b>';
 /* Pareto of |effects| */
 var srt=T.slice().sort(function(x,y){return Math.abs(y.e)-Math.abs(x.e);}), W=800, Lp=70, rh=24, Hh=srt.length*rh+40, mx=Math.max(Math.abs(srt[0].e),isFinite(crit)?crit:0)*1.08||1, Xp=function(v){return Lp+v/mx*(W-Lp-80);};
 var g='<svg viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Pareto of effects"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
 srt.forEach(function(t,i){ var y=i*rh+6, sigf=isFinite(crit)&&Math.abs(t.e)>crit; g+='<text x="'+(Lp-8)+'" y="'+(y+15)+'" text-anchor="end">'+t.nm+'</text><rect x="'+Lp+'" y="'+y+'" width="'+Math.max(1,Xp(Math.abs(t.e))-Lp)+'" height="18" fill="'+(sigf?'#0F3E68':'#C6CDD3')+'"/><text class="ax" x="'+(Xp(Math.abs(t.e))+5)+'" y="'+(y+14)+'">'+F(Math.abs(t.e),dp)+'</text>'; });
 if(isFinite(crit)) g+='<line x1="'+Xp(crit)+'" x2="'+Xp(crit)+'" y1="2" y2="'+(Hh-30)+'" stroke="#C0392B" stroke-dasharray="5 4" stroke-width="1.6"/><text x="'+Xp(crit)+'" y="'+(Hh-12)+'" text-anchor="middle" style="fill:#C0392B;font-size:12px">critical |effect| '+F(crit,dp)+' (α = '+a+')</text>';
 else g+='<text class="ax" x="'+Lp+'" y="'+(Hh-12)+'">No error estimate: replicate runs to judge which effects are real.</text>';
 PA.innerHTML=g+'</svg>';
 /* main effects plot */
 var means=L.map(function(l,j){ var sl=0,sh=0; for(var i=0;i<nr;i++){ if(lev(i,j)>0) sh+=ym[i]; else sl+=ym[i]; } return [sl/(nr/2),sh/(nr/2)]; });
 var vals=[]; means.forEach(function(m){vals.push(m[0],m[1]);});
 var pair=null, ipc=S.f.ip||'Largest two-factor interaction';
 var two=T.filter(function(t){return t.b.length===2;});
 if(/^[A-D]{2}$/.test(ipc)) pair=two.filter(function(t){return t.nm===ipc;})[0]||null;
 if(!pair) pair=two.slice().sort(function(x,y){return Math.abs(y.e)-Math.abs(x.e);})[0];
 var im=[[0,0],[0,0]], ic=[[0,0],[0,0]], j1=pair.b[0], j2=pair.b[1];
 for(var i3=0;i3<nr;i3++){ var u=lev(i3,j1)>0?1:0, w=lev(i3,j2)>0?1:0; im[w][u]+=ym[i3]; ic[w][u]++; }
 for(var w2=0;w2<2;w2++) for(var u2=0;u2<2;u2++){ im[w2][u2]/=ic[w2][u2]; vals.push(im[w2][u2]); }
 var y0=Math.min.apply(null,vals), y1=Math.max.apply(null,vals), pd=(y1-y0)*0.08||0.5, NT=nice(y0-pd,y1+pd); y0=NT.lo; y1=NT.hi;
 var H2=300, T2=34, B2=56, Lm=64, pw=(W-Lm-10)/k, Yv=function(v){return H2-B2-(v-y0)/(y1-y0)*(H2-B2-T2);};
 g='<svg viewBox="0 0 '+W+' '+H2+'" role="img" aria-label="Main effects plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><text x="'+Lm+'" y="18" style="font-weight:600">Main effects: mean '+E(S.f.y||'response')+' at each level</text>';
 for(var vv=y0;vv<=y1+NT.st*1e-6;vv+=NT.st){ g+='<line x1="'+(Lm-3)+'" x2="'+Lm+'" y1="'+Yv(vv)+'" y2="'+Yv(vv)+'" stroke="#7C8B99"/><text class="ax" x="'+(Lm-6)+'" y="'+(Yv(vv)+4)+'" text-anchor="end">'+M(vv,NT.d)+'</text>'; }
 means.forEach(function(m,j){ var x0=Lm+j*pw+28, x1=Lm+(j+1)*pw-28; g+='<rect x="'+(Lm+j*pw+6)+'" y="'+T2+'" width="'+(pw-12)+'" height="'+(H2-B2-T2)+'" fill="#fff" stroke="#DDE1E4"/><line x1="'+(Lm+j*pw+6)+'" x2="'+(Lm+(j+1)*pw-6)+'" y1="'+Yv(gm)+'" y2="'+Yv(gm)+'" stroke="#7C8B99" stroke-dasharray="4 4"/>'+
  '<line x1="'+x0+'" y1="'+Yv(m[0])+'" x2="'+x1+'" y2="'+Yv(m[1])+'" stroke="#0F3E68" stroke-width="2.5"/><circle cx="'+x0+'" cy="'+Yv(m[0])+'" r="5" fill="#0F3E68"/><circle cx="'+x1+'" cy="'+Yv(m[1])+'" r="5" fill="#0F3E68"/>'+
  '<text class="ax" x="'+x0+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(lo[j].slice(0,8))+'</text><text class="ax" x="'+x1+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(hi[j].slice(0,8))+'</text><text x="'+(Lm+(j+0.5)*pw)+'" y="'+(H2-B2+36)+'" text-anchor="middle">'+L[j]+': '+E(fn[j].length>(k>3?14:22)?fn[j].slice(0,k>3?13:21)+'…':fn[j])+'</text>'; });
 ME.innerHTML=g+'</svg>';
 var x0i=Lm+120, x1i=W-200;
 g='<svg viewBox="0 0 '+W+' '+H2+'" role="img" aria-label="Interaction plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><text x="'+Lm+'" y="18" style="font-weight:600">Interaction '+pair.nm+': effect '+M(pair.e,dp)+'</text><rect x="'+Lm+'" y="'+T2+'" width="'+(W-Lm-160)+'" height="'+(H2-B2-T2)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(var v6=y0;v6<=y1+NT.st*1e-6;v6+=NT.st){ g+='<line x1="'+(Lm-3)+'" x2="'+Lm+'" y1="'+Yv(v6)+'" y2="'+Yv(v6)+'" stroke="#7C8B99"/><text class="ax" x="'+(Lm-6)+'" y="'+(Yv(v6)+4)+'" text-anchor="end">'+M(v6,NT.d)+'</text>'; }
 [0,1].forEach(function(w3){ var col=w3?'#D8B147':'#0F3E68'; g+='<line x1="'+x0i+'" y1="'+Yv(im[w3][0])+'" x2="'+x1i+'" y2="'+Yv(im[w3][1])+'" stroke="'+col+'" stroke-width="2.5"'+(w3?'':' stroke-dasharray="7 4"')+'/><circle cx="'+x0i+'" cy="'+Yv(im[w3][0])+'" r="5" fill="'+col+'"/><circle cx="'+x1i+'" cy="'+Yv(im[w3][1])+'" r="5" fill="'+col+'"/>'+
  '<line x1="'+(W-146)+'" x2="'+(W-120)+'" y1="'+(T2+20+w3*24)+'" y2="'+(T2+20+w3*24)+'" stroke="'+col+'" stroke-width="2.5"'+(w3?'':' stroke-dasharray="7 4"')+'/><text x="'+(W-114)+'" y="'+(T2+24+w3*24)+'">'+L[j2]+' '+(w3?'high':'low')+(hasLv[j2]?' ('+E((w3?hi[j2]:lo[j2]).slice(0,8))+')':'')+'</text>'; });
 g+='<text class="ax" x="'+x0i+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(lo[j1].slice(0,10))+'</text><text class="ax" x="'+x1i+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(hi[j1].slice(0,10))+'</text><text x="'+((x0i+x1i)/2)+'" y="'+(H2-B2+36)+'" text-anchor="middle">'+L[j1]+': '+E(fn[j1])+'</text>';
 IP.innerHTML=g+'</svg>';
 /* flags */
 var big=srt[0];
 if(isFinite(crit)){ var sg=srt.filter(function(t){return Math.abs(t.e)>crit;});
  f.push([sg.length?'ok':'',sg.length?'Significant at α = '+a+' (judged against '+how+'): <b>'+sg.map(function(t){return t.nm;}).join(', ')+'</b>. Largest: '+big.nm+' with effect '+M(big.e,dp)+'.':'No effect exceeds the critical value '+F(crit,dp)+' at α = '+a+'. The factors as varied did not move the response more than the noise.']); }
 else f.push(['warn','No estimate of error is available, so no effect can be tested. '+why+' Largest effect: '+big.nm+' ('+M(big.e,dp)+').']);
 if(!bal&&r>1) f.push(['warn','Unbalanced replication: '+miss+' of '+(nr*r)+' responses '+(miss>1?'are':'is')+' missing. Effects are computed from the run means'+(nrep>0?', and the error estimate pools the '+nrep+' run'+(nrep>1?'s':'')+' with more than one response ('+(cnt-nr)+' df), so the tests are approximate':', and no run has more than one response, so there is no pure error'+(isFinite(crit)?' and Lenth’s method is used instead':''))+'. Fill every cell if you can.']);
 if(r===1&&isFinite(crit)) f.push(['','Unreplicated design: significance comes from Lenth’s method, which assumes most effects are inactive (effect sparsity). Confirm with replicated runs.']);
 var goal=S.f.goal||'Minimize'; if(goal!=='Hit a target'){ var mn=goal==='Minimize', best=0, bv=mn?Infinity:-Infinity; ym.forEach(function(v,i){ if(mn?v<bv:v>bv){bv=v;best=i;} });
  f.push(['','Best observed run for “'+goal.toLowerCase()+'”: run '+(best+1)+' ('+L.map(function(l,j){ return l+' '+(hasLv[j]?(lev(best,j)>0?'+':'−')+' '+E(lev(best,j)>0?hi[j]:lo[j]):(lev(best,j)>0?'high':'low')); }).join(', ')+') with mean '+M(bv,dp)+'. Confirm the setting with a few verification runs before you change the process.']); }
 var ii=T.filter(function(t){return t.b.length>=2&&(isFinite(crit)?Math.abs(t.e)>crit:false);});
 if(ii.length) f.push(['',(ii.length>1?'Interactions ':'Interaction ')+ii.map(function(t){return t.nm;}).join(', ')+(ii.length>1?' are':' is')+' significant: the effect of one factor depends on the level of the other, so read the main effects of '+ii[0].nm.split('').join(' and ')+' from the interaction plot, not on their own. Non-parallel lines show it.']);
 f.push(['','A two-level design fits straight lines between low and high. Add center points to check for curvature before predicting between the levels, and do not extrapolate beyond them.']);
 O.innerHTML=api.flags(f);
},
example:{f:{k:'3',r:'2',a:'0.05',y:'Shrinkage, %',goal:'Minimize',ip:'Largest two-factor interaction',an:'Mold temperature, °C',al:'40',ah:'60',bn:'Hold pressure, bar',bl:'600',bh:'800',cn:'Cooling time, s',cl:'10',ch:'20'},
 x:{y:{'1|1':'1.45','1|2':'1.45','2|1':'1.75','2|2':'1.74','3|1':'1.41','3|2':'1.43','4|1':'1.53','4|2':'1.51','5|1':'1.42','5|2':'1.41','6|1':'1.73','6|2':'1.74','7|1':'1.37','7|2':'1.40','8|1':'1.49','8|2':'1.48'}}}
}
