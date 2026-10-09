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
 {type:'fields',title:'Design',cols:3,hint:'Two levels per factor. Up to 7 factors with a fraction (section 2), up to 5 as a full factorial. Runs are listed in standard (Yates) order; randomize the order you actually run them in.',fields:[
  {id:'k',label:'Number of factors (k)',type:'select',opts:['2','3','4','5','6','7']},
  {id:'r',label:'Replicates of each run',type:'select',opts:['1','2','3']},
  {id:'a',label:'Significance level α',type:'number',min:0.001,max:0.5,ph:'0.05'},
  {id:'y',label:'Response, with units',ph:'e.g. Shrinkage, %'},
  {id:'goal',label:'Goal for the response',type:'select',opts:['Minimize','Maximize','Hit a target']},
  {id:'ip',label:'Interaction plot for',type:'select',opts:['Largest two-factor interaction','AB','AC','AD','AE','AF','AG','BC','BD','BE','BF','BG','CD','CE','CF','CG','DE','DF','DG','EF','EG','FG']},
  {id:'an',label:'Factor A name',ph:'e.g. Mold temperature, °C'},{id:'al',label:'A low (−)',ph:'e.g. 40'},{id:'ah',label:'A high (+)',ph:'e.g. 60'},
  {id:'bn',label:'Factor B name'},{id:'bl',label:'B low (−)'},{id:'bh',label:'B high (+)'},
  {id:'cn',label:'Factor C name'},{id:'cl',label:'C low (−)'},{id:'ch',label:'C high (+)'},
  {id:'dn',label:'Factor D name'},{id:'dl',label:'D low (−)'},{id:'dh',label:'D high (+)'},
  {id:'en',label:'Factor E name'},{id:'el',label:'E low (−)'},{id:'eh',label:'E high (+)'},
  {id:'fn',label:'Factor F name'},{id:'fl',label:'F low (−)'},{id:'fh',label:'F high (+)'},
  {id:'gn',label:'Factor G name'},{id:'gl',label:'G low (−)'},{id:'gh',label:'G high (+)'}]},
 {type:'custom',id:'alias',title:'Fraction, generators and alias structure',hint:'A <b>fractional factorial</b> runs a half, a quarter or less of the full set of runs. The extra factors are set by <b>generators</b> (D = ABC: run D at the sign of the A×B×C column), and the price is <b>aliasing</b>: some effects can no longer be told apart.',
  html:'<div class="tf-grid df-frf"><label class="tf"><span>Design</span><select data-f="fr" aria-label="Design"><option>Full factorial</option><option>Half fraction, 2^(k−1)</option><option>Quarter fraction, 2^(k−2)</option><option>Eighth fraction, 2^(k−3)</option><option>Sixteenth fraction, 2^(k−4)</option></select></label><label class="tf"><span>Generators (optional; blank = standard)</span><input type="text" data-f="gen" placeholder="e.g. D=ABC, or E=ABC F=BCD" aria-label="Generators"></label></div><div class="df-alias"></div><div class="out df-aout"></div><p class="noprint"><button type="button" class="tb ghost df-exfr">Load a fractional factorial example (2⁴⁻¹, resolution IV)</button></p>'},
 {type:'custom',id:'runs',title:'Runs and responses',hint:'Type each observed response. With two or more replicates the tool estimates pure error and tests every effect.',html:'<div class="tgw"><table class="mv df-runs"></table></div>'},
 {type:'custom',id:'eff',title:'Effects and coefficients (coded units)',html:'<div class="tgw"><table class="mv df-eff"></table></div><p class="th df-eq"></p><div class="svgw df-par"></div>'},
 {type:'custom',id:'plots',title:'Main effects plot and interaction plot',html:'<div class="svgw df-me"></div><div class="svgw df-ip"></div>'},
 {type:'custom',id:'read',title:'What the experiment says',html:'<div class="out df-out"></div>'}
],
blankX:function(){return {y:{}};},
FRAC:{opts:['Full factorial','Half fraction, 2^(k−1)','Quarter fraction, 2^(k−2)','Eighth fraction, 2^(k−3)','Sixteenth fraction, 2^(k−4)'],
 /* standard minimum-aberration generators, as tabulated in the DOE texts */
 std:{'3-1':['C=AB'],'4-1':['D=ABC'],'5-1':['E=ABCD'],'5-2':['D=AB','E=AC'],'6-1':['F=ABCDE'],'6-2':['E=ABC','F=BCD'],'6-3':['D=AB','E=AC','F=BC'],
  '7-1':['G=ABCDEF'],'7-2':['F=ABCD','G=ABDE'],'7-3':['E=ABC','F=BCD','G=ACD'],'7-4':['D=AB','E=AC','F=BC','G=ABC']},
 maxp:{2:0,3:1,4:1,5:2,6:3,7:4}},
/* the design: base factors, generated columns, defining relation and alias chains */
design:function(S){
 var FR=window.TOOL.FRAC, k=+(S.f.k||3), p=Math.max(0,FR.opts.indexOf(S.f.fr||'Full factorial')), LL='ABCDEFG', res={k:k,p:p,err:'',warn:''};
 if(!(k>=2&&k<=7)) k=res.k=3;
 if(p>FR.maxp[k]){ res.err=p===0?'':'A '+FR.opts[p].split(',')[0].toLowerCase()+' of '+k+' factors would leave '+(1<<(k-p))+' runs, too few columns for '+k+' factors. Choose a smaller fraction.'; return res; }
 if(p===0&&k>5){ res.err='A full factorial in '+k+' factors needs '+(1<<k)+' runs per replicate. This tool runs full factorials up to 5 factors (32 runs); for '+k+' factors choose a fraction.'; return res; }
 var kb=k-p, gens=[], txt=String(S.f.gen||'').trim(), custom=false;
 function parse(list){ var out=[], seen={}; for(var i=0;i<list.length;i++){ var m=String(list[i]).toUpperCase().replace(/\s+/g,'').match(/^([A-G])=([+\-−]?)([A-G]+)$/); if(!m) return null;
   var j=LL.indexOf(m[1]); if(j<kb||j>=k||seen[j]) return null; seen[j]=1; var mask=0;
   for(var c=0;c<m[3].length;c++){ var b=LL.indexOf(m[3][c]); if(b>=kb||(mask>>b)&1) return null; mask|=1<<b; }
   if(m[3].length<2) return null; out.push({j:j,mask:mask,sign:m[2]==='-'||m[2]==='−'?-1:1}); }
  return out.length===p?out:null; }
 if(p>0){
  if(txt){ var cu=parse(txt.split(/[,;]+|\s+(?=[A-Ga-g]\s*=)/).filter(function(x){return x.trim();})); if(cu){ gens=cu; custom=true; } else res.warn='The generators “'+txt+'” could not be used: give one generator for each of the last '+p+' factor'+(p>1?'s':'')+' ('+LL.slice(kb,k).split('').join(', ')+'), each a product of two or more of '+LL.slice(0,kb).split('').join(', ')+', for example '+FR.std[k+'-'+p].join(', ')+'. The standard generators are used instead.'; }
  if(!gens.length) gens=parse(FR.std[k+'-'+p]);
 }
 gens.sort(function(a,b){return a.j-b.j;});
 var G={}; gens.forEach(function(g){ G[g.j]=g; });
 /* defining relation: every product of the generator words */
 var words=[]; for(var s=1;s<(1<<p);s++){ var w=0,sg=1; for(var t=0;t<p;t++) if((s>>t)&1){ w^=(1<<gens[t].j)|gens[t].mask; sg*=gens[t].sign; } words.push({w:w,s:sg}); }
 var pc=function(w){ var c=0; while(w){ c+=w&1; w>>=1; } return c; }, nm=function(w){ var o=''; for(var j=0;j<k;j++) if((w>>j)&1) o+=LL[j]; return o; };
 var better=function(a,b){ var la=pc(a), lb=pc(b); if(la!==lb) return la<lb; return nm(a)<nm(b); };
 words.sort(function(a,b){ return pc(a.w)-pc(b.w)||(nm(a.w)<nm(b.w)?-1:1); });
 var resn=words.length?Math.min.apply(null,words.map(function(d){return pc(d.w);})):0;
 /* alias chains: one per estimable contrast of the base factors */
 var chains=[]; for(var m=1;m<(1<<kb);m++){ var rep=m; words.forEach(function(d){ if(better(m^d.w,rep)) rep=m^d.w; });
  var al=words.map(function(d){ return {w:rep^d.w,s:d.s,o:pc(rep^d.w)}; }).sort(function(a,b){ return a.o-b.o||(nm(a.w)<nm(b.w)?-1:1); });
  var bits=[]; for(var j2=0;j2<k;j2++) if((rep>>j2)&1) bits.push(j2);
  chains.push({w:rep,nm:nm(rep),b:bits,al:al,txt:nm(rep)+al.map(function(x){ return ' '+(x.s<0?'−':'+')+' '+nm(x.w); }).join('')}); }
 res.kb=kb; res.nr=1<<kb; res.gens=gens; res.G=G; res.words=words; res.resn=resn; res.chains=chains; res.custom=custom; res.nm=nm; res.pc=pc;
 res.gtxt=gens.map(function(g){ return LL[g.j]+' = '+(g.sign<0?'−':'')+nm(g.mask); });
 res.col=function(i,j){ if(j<kb) return (i>>j)&1?1:-1; var g=G[j], v=g.sign; for(var b=0;b<kb;b++) if((g.mask>>b)&1) v*=(i>>b)&1?1:-1; return v; };
 return res;
},
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, Y=S.x.y||(S.x.y={}), a=api.num(S.f.a); if(!(a>0&&a<0.5)) a=0.05;
 var DS=window.TOOL.design(S), k=DS.k, r=+(S.f.r||1), LL='ABCDEFG', fid=['a','b','c','d','e','f','g'];
 /* show the factor name and level fields for the k factors in use */
 fid.forEach(function(x,j){ ['n','l','h'].forEach(function(q){ var el=root.querySelector('[data-f="'+x+q+'"]'); if(el){ var lb=el.closest('.tf'); if(lb) lb.style.display=j<k?'':'none'; } }); });
 var AS=root.querySelector('.df-alias'), AO=root.querySelector('.df-aout'), tb=root.querySelector('.df-runs'), EF=root.querySelector('.df-eff'), EQ=root.querySelector('.df-eq'), PA=root.querySelector('.df-par'), ME=root.querySelector('.df-me'), IP=root.querySelector('.df-ip'), O=root.querySelector('.df-out'), f=[];
 var lb=root.querySelector('.df-exfr'); if(lb&&!lb.onclick) lb.onclick=function(){ var X=window.TOOL.exFrac; Object.keys(S.f).forEach(function(q){ delete S.f[q]; }); Object.keys(X.f).forEach(function(q){ S.f[q]=X.f[q]; }); S.x.y=JSON.parse(JSON.stringify(X.y)); api.rerender(); api.save(); };
 if(DS.err){ AS.innerHTML=''; AO.innerHTML=api.flags([['warn',DS.err]]); tb.innerHTML=''; tb.dataset.sig=''; EF.innerHTML=''; EQ.innerHTML=''; PA.innerHTML=''; ME.innerHTML=''; IP.innerHTML=''; O.innerHTML=api.flags([['warn',DS.err]]); return; }
 var nr=DS.nr, p=DS.p, kb=DS.kb, L=LL.slice(0,k).split(''), col=DS.col, rom=['','I','II','III','IV','V','VI','VII','VIII'];
 var fn=L.map(function(l,j){ return (S.f[fid[j]+'n']||'').trim()||('Factor '+l); }), lo=L.map(function(l,j){return (S.f[fid[j]+'l']||'').trim()||'low';}), hi=L.map(function(l,j){return (S.f[fid[j]+'h']||'').trim()||'high';}), hasLv=L.map(function(l,j){return !!((S.f[fid[j]+'l']||'').trim()||(S.f[fid[j]+'h']||'').trim());});
 var M=function(v,d){ var s=F(Math.abs(v),d); return (v<0&&/[1-9]/.test(s)?'−':'')+s; };
 var nice=function(a0,a1){ var rg=(a1-a0)||1, raw=rg/4, p10=Math.pow(10,Math.floor(Math.log(raw)/Math.LN10)), st=p10; [1,2,2.5,5,10].some(function(m){ if(m*p10>=raw-1e-12){ st=m*p10; return true; } return false; }); var dd=Math.max(0,-Math.floor(Math.log(st)/Math.LN10+1e-9)); if(Math.abs(st/p10-2.5)<1e-9) dd++; return {lo:Math.floor(a0/st+1e-9)*st,hi:Math.ceil(a1/st-1e-9)*st,st:st,d:dd}; };
 /* ---- the fraction, generators and alias structure ---- */
 var af=[];
 if(DS.warn) af.push(['warn',DS.warn]);
 if(p===0){ AS.innerHTML='<div class="stat"><div><b>2<sup>'+k+'</sup> = '+nr+'</b><span>Runs per replicate</span></div><div><b>Full</b><span>Fraction</span></div><div><b>None</b><span>Aliasing</span></div></div>';
  af.push(['ok','Full factorial: every main effect and every interaction gets its own column, so nothing is aliased (confounded) with anything else.']);
  if(k>=4) af.push(['','With '+k+' factors a fraction would save runs: a 2<sup>'+k+'−1</sup> needs '+(nr/2)+' runs per replicate'+(k===4?' at resolution IV':' at resolution '+rom[k])+'. Choose it above to see what it would confound.']);
 } else {
  var dr='I = '+DS.words.map(function(d){ return (d.s<0?'−':'')+DS.nm(d.w); }).join(' = ');
  AS.innerHTML='<div class="stat"><div><b>2<sup>'+k+'−'+p+'</sup> = '+nr+'</b><span>Runs per replicate</span></div><div><b>1/'+(1<<p)+'</b><span>Fraction of the '+(1<<k)+'-run full factorial</span></div><div><b>'+rom[DS.resn]+'</b><span>Resolution</span></div><div><b>'+DS.gtxt.join(', ')+'</b><span>Generator'+(p>1?'s':'')+(DS.custom?' (yours)':' (standard)')+'</span></div></div>'+
   '<p class="th df-dr">Defining relation: <b>'+dr+'</b></p><div class="tgw"><table class="mv df-atb"><thead><tr><th>Estimated as</th><th>Alias chain (what the contrast really estimates)</th><th>Status</th></tr></thead><tbody>'+
   DS.chains.slice().sort(function(x,y){ return x.b.length-y.b.length||(x.nm<y.nm?-1:1); }).map(function(c){ var o=c.b.length, mn=c.al.length?c.al[0].o:99, st;
    if(o===1) st=mn>=3?'<span class="ok">clear of two-factor interactions</span>':mn===2?'<span class="wn">aliased with a two-factor interaction</span>':'<span class="wn">aliased with a main effect</span>';
    else if(o===2) st=mn>=3?'<span class="ok">clear</span>':'<span class="wn">aliased with another '+(mn===1?'main effect':'two-factor interaction')+'</span>';
    else st='higher-order';
    return '<tr><td class="mo">'+c.nm+'</td><td class="mo2">'+c.txt+'</td><td>'+st+'</td></tr>'; }).join('')+'</tbody></table></div>';
  af.push(['','Resolution '+rom[DS.resn]+' (the shortest word in the defining relation has '+DS.resn+' letters). '+(DS.resn===3?'Main effects are aliased with two-factor interactions. Use it to screen many factors when interactions are expected to be small, and plan a fold-over to separate them.':DS.resn===4?'Main effects are clear of two-factor interactions, but two-factor interactions are aliased with each other.':DS.resn>=5?'Main effects and two-factor interactions are clear of each other; two-factor interactions are aliased only with three-factor and higher interactions, which are usually negligible.':'')]);
  af.push(['','Each contrast estimates the sum of the effects in its alias chain. The tool reports it under the shortest name; if a chain holds two plausible effects, the data cannot tell them apart. Effect heredity helps: an interaction is more likely real when its parent main effects are.']);
  if(DS.gens.some(function(g){return g.sign<0;})) af.push(['','A generator with a minus sign gives the other fraction (the alternate half): the same alias pairs with the opposite sign.']);
 }
 AO.innerHTML=api.flags(af);
 /* ---- runs table ---- */
 var sig=k+'|'+p+'|'+DS.gtxt.join(',')+'|'+r+'|'+fn.join('|')+'|'+lo.join('|')+'|'+hi.join('|');
 if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig; var h='<thead><tr><th>Std order</th>'+L.map(function(l,j){return '<th>'+l+(j>=kb?' = '+DS.gtxt[j-kb].split(' = ')[1]:'')+'<br>'+E(fn[j].length>18?fn[j].slice(0,17)+'…':fn[j])+'</th>';}).join('');
  for(var q=0;q<r;q++) h+='<th>'+E(S.f.y||'Response')+(r>1?'<br>rep '+(q+1):'')+'</th>';
  h+='<th>Run mean</th></tr></thead><tbody>';
  for(var i=0;i<nr;i++){ h+='<tr><td>'+(i+1)+'</td>'+L.map(function(l,j){ var pp=col(i,j)>0; return '<td class="'+(pp?'hi':'lo')+'">'+(pp?'+':'−')+(hasLv[j]?' <small>'+E(pp?hi[j]:lo[j])+'</small>':'')+'</td>'; }).join('');
   for(var q2=0;q2<r;q2++){ var key=(i+1)+'|'+(q2+1), v=Y[key]; h+='<td><input type="number" inputmode="decimal" step="any" data-y="'+key+'" value="'+(v!=null?E(v):'')+'" aria-label="Run '+(i+1)+' replicate '+(q2+1)+'"></td>'; }
   h+='<td class="rm" data-rm="'+i+'"></td></tr>'; }
  tb.innerHTML=h+'</tbody>';
  tb.querySelectorAll('input[data-y]').forEach(function(inp){ inp.oninput=function(){ var s=inp.value.trim(); if(s==='') delete Y[inp.dataset.y]; else Y[inp.dataset.y]=s; api.save(); }; });
 }
 var ym=[], cnt=0, miss=0, sse=0, bal=true, all=[], inv=0, nrep=0;
 for(var i2=0;i2<nr;i2++){ var v2=[]; for(var q3=0;q3<r;q3++){ var z=api.num(Y[(i2+1)+'|'+(q3+1)]); if(isFinite(z)) v2.push(z); else miss++; }
  if(v2.length<r) bal=false; if(v2.length) inv+=1/v2.length; if(v2.length>1) nrep++; var m=v2.length?v2.reduce(function(s,x){return s+x;},0)/v2.length:NaN; ym.push(m); cnt+=v2.length; v2.forEach(function(x){ sse+=(x-m)*(x-m); all.push(x); });
  var td=tb.querySelector('[data-rm="'+i2+'"]'); if(td) td.textContent=isFinite(m)?F(m,4):''; }
 var empty=ym.filter(function(x){return !isFinite(x);}).length;
 if(empty){ EF.innerHTML=''; EQ.innerHTML=''; PA.innerHTML=''; ME.innerHTML=''; IP.innerHTML=''; O.innerHTML=api.flags(cnt?[['warn',empty+' of '+nr+' runs have no response yet. Every run needs at least one value before effects can be estimated.']]:[],'Enter a response for every run.'); return; }
 /* terms: one per alias chain (for a full factorial, every effect) */
 var T=DS.chains.map(function(c){ return {nm:c.nm,b:c.b,al:c.al,txt:c.txt}; });
 T.sort(function(x,y){ return x.b.length-y.b.length||(x.nm<y.nm?-1:1); });
 var gm=ym.reduce(function(s2,x){return s2+x;},0)/nr;
 T.forEach(function(t){ var sp=0; for(var i=0;i<nr;i++){ var sg=1; t.b.forEach(function(j){ sg*=col(i,j); }); sp+=sg*ym[i]; } t.e=sp/(nr/2); t.c=t.e/2; });
 var dfe=r>1?cnt-nr:0, se=NaN, crit=NaN, how='', why='', ub=r>1&&!bal&&dfe>0;
 if(dfe>0&&sse>0){ var s2e=sse/dfe; se=(2/nr)*Math.sqrt(s2e*inv); crit=ST.tinv(1-a/2,dfe)*se; T.forEach(function(t){ t.t=t.e/se; t.p=ST.t2(t.t,dfe); }); how='pure error ('+dfe+' df'+(ub?', unbalanced':'')+')'; }
 else if(dfe>0){ why='The replicates agree exactly, so the pure error is zero and the effects cannot be tested. Check that the replicates are independent repeats of the run, not repeat readings of one part.'; dfe=0; }
 if(!isFinite(crit)&&!why&&T.length>=7){ var ab=T.map(function(t){return Math.abs(t.e);}).sort(function(x,y){return x-y;}), md=function(v){var n=v.length;return n%2?v[(n-1)/2]:(v[n/2-1]+v[n/2])/2;};
  var s0=1.5*md(ab), pse=1.5*md(ab.filter(function(x){return x<2.5*s0;})); if(pse>0){ se=pse; crit=ST.tinv(1-a/2,T.length/3)*pse; T.forEach(function(t){ t.t=t.e/pse; }); how='Lenth’s pseudo standard error ('+(T.length/3).toFixed(1)+' df)'; } else why='Lenth’s pseudo standard error is zero (most of the effects are exactly zero), so there is nothing to judge the other effects against. Replicate some runs to get a pure error estimate.'; }
 if(!isFinite(crit)&&!why) why=p?'A '+nr+'-run design estimates only '+T.length+' effects, too few for Lenth’s method, so it needs replicated runs to estimate error.':'A 2² design has only three effects, too few for Lenth’s method, so it needs at least one run replicated to estimate error.';
 var dp=4, alc=p>0;
 EF.innerHTML='<thead><tr><th>Term</th>'+(alc?'<th>Alias chain</th>':'')+'<th>Effect</th><th>Coefficient</th>'+(dfe?'<th>t</th><th>p value</th>':isFinite(crit)?'<th>Effect ÷ PSE</th>':'')+'</tr></thead><tbody><tr><td class="mo">Constant (grand mean)</td>'+(alc?'<td class="mo2">I'+DS.words.map(function(d){return ' '+(d.s<0?'−':'+')+' '+DS.nm(d.w);}).join('')+'</td>':'')+'<td></td><td>'+M(gm,dp)+'</td>'+(dfe?'<td></td><td></td>':isFinite(crit)?'<td></td>':'')+'</tr>'+
  T.map(function(t){ var sigf=isFinite(crit)&&Math.abs(t.e)>crit; return '<tr'+(sigf?' class="sig"':'')+'><td class="mo">'+t.nm+(t.b.length===1?' '+E(fn[t.b[0]]):'')+'</td>'+(alc?'<td class="mo2">'+t.txt+'</td>':'')+'<td>'+M(t.e,dp)+'</td><td>'+M(t.c,dp)+'</td>'+(dfe?'<td>'+(isFinite(t.t)?M(t.t,2):'—')+'</td><td>'+ST.pfmt(t.p)+'</td>':isFinite(crit)?'<td>'+M(t.t,2)+'</td>':'')+'</tr>'; }).join('')+'</tbody>';
 var act=T.filter(function(t){ return isFinite(crit)?Math.abs(t.e)>crit:true; });
 EQ.innerHTML='Model in coded units'+(isFinite(crit)?', significant terms only':'')+': <b>ŷ = '+M(gm,dp)+act.map(function(t){ return ' '+(t.c<0?'−':'+')+' '+F(Math.abs(t.c),dp)+'·'+t.nm.split('').join('·'); }).join('')+'</b>'+(alc?' <span class="df-alnote">(each term stands for its whole alias chain)</span>':'');
 /* Pareto of |effects| */
 var srt=T.slice().sort(function(x,y){return Math.abs(y.e)-Math.abs(x.e);}), W=800, Lp=70, rh=24, Hh=srt.length*rh+40, mx=Math.max(Math.abs(srt[0].e),isFinite(crit)?crit:0)*1.08||1, Xp=function(v){return Lp+v/mx*(W-Lp-80);};
 var g='<svg viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Pareto of effects"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style>';
 srt.forEach(function(t,i){ var y=i*rh+6, sigf=isFinite(crit)&&Math.abs(t.e)>crit; g+='<text x="'+(Lp-8)+'" y="'+(y+15)+'" text-anchor="end">'+t.nm+'</text><rect x="'+Lp+'" y="'+y+'" width="'+Math.max(1,Xp(Math.abs(t.e))-Lp)+'" height="18" fill="'+(sigf?'#0F3E68':'#C6CDD3')+'"/><text class="ax" x="'+(Xp(Math.abs(t.e))+5)+'" y="'+(y+14)+'">'+F(Math.abs(t.e),dp)+'</text>'; });
 if(isFinite(crit)) g+='<line x1="'+Xp(crit)+'" x2="'+Xp(crit)+'" y1="2" y2="'+(Hh-30)+'" stroke="#C0392B" stroke-dasharray="5 4" stroke-width="1.6"/><text x="'+Xp(crit)+'" y="'+(Hh-12)+'" text-anchor="middle" style="fill:#C0392B;font-size:12px">critical |effect| '+F(crit,dp)+' (α = '+a+')</text>';
 else g+='<text class="ax" x="'+Lp+'" y="'+(Hh-12)+'">No error estimate: replicate runs to judge which effects are real.</text>';
 PA.innerHTML=g+'</svg>';
 /* main effects plot */
 var means=L.map(function(l,j){ var sl=0,sh=0; for(var i=0;i<nr;i++){ if(col(i,j)>0) sh+=ym[i]; else sl+=ym[i]; } return [sl/(nr/2),sh/(nr/2)]; });
 var vals=[]; means.forEach(function(m){vals.push(m[0],m[1]);});
 var pair=null, ipc=S.f.ip||'Largest two-factor interaction';
 var two=T.filter(function(t){return t.b.length===2;});
 if(/^[A-G]{2}$/.test(ipc)&&LL.indexOf(ipc[0])<k&&LL.indexOf(ipc[1])<k){ pair=two.filter(function(t){return t.nm===ipc;})[0]||null;
  if(!pair){ var jj=[LL.indexOf(ipc[0]),LL.indexOf(ipc[1])].sort(), ww=(1<<jj[0])|(1<<jj[1]), ch=DS.chains.filter(function(c){ return c.w===ww||c.al.some(function(x){return x.w===ww;}); })[0], sp2=0;
   for(var i5=0;i5<nr;i5++) sp2+=col(i5,jj[0])*col(i5,jj[1])*ym[i5];
   pair={nm:LL[jj[0]]+LL[jj[1]],b:jj,e:sp2/(nr/2),chain:ch}; } }
 if(!pair) pair=two.slice().sort(function(x,y){return Math.abs(y.e)-Math.abs(x.e);})[0]||null;
 var im=[[0,0],[0,0]], ic=[[0,0],[0,0]], j1, j2;
 if(pair){ j1=pair.b[0]; j2=pair.b[1];
  for(var i3=0;i3<nr;i3++){ var u=col(i3,j1)>0?1:0, w=col(i3,j2)>0?1:0; im[w][u]+=ym[i3]; ic[w][u]++; }
  for(var w2=0;w2<2;w2++) for(var u2=0;u2<2;u2++){ im[w2][u2]/=ic[w2][u2]; vals.push(im[w2][u2]); } }
 var y0=Math.min.apply(null,vals), y1=Math.max.apply(null,vals), pd=(y1-y0)*0.08||0.5, NT=nice(y0-pd,y1+pd); y0=NT.lo; y1=NT.hi;
 var H2=300, T2=34, B2=56, Lm=64, pw=(W-Lm-10)/k, Yv=function(v){return H2-B2-(v-y0)/(y1-y0)*(H2-B2-T2);}, cut=k>5?7:k>3?14:22;
 g='<svg viewBox="0 0 '+W+' '+H2+'" role="img" aria-label="Main effects plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><text x="'+Lm+'" y="18" style="font-weight:600">Main effects: mean '+E(S.f.y||'response')+' at each level</text>';
 for(var vv=y0;vv<=y1+NT.st*1e-6;vv+=NT.st){ g+='<line x1="'+(Lm-3)+'" x2="'+Lm+'" y1="'+Yv(vv)+'" y2="'+Yv(vv)+'" stroke="#7C8B99"/><text class="ax" x="'+(Lm-6)+'" y="'+(Yv(vv)+4)+'" text-anchor="end">'+M(vv,NT.d)+'</text>'; }
 var ins=k>4?14:28;
 means.forEach(function(m,j){ var x0=Lm+j*pw+ins, x1=Lm+(j+1)*pw-ins; g+='<rect x="'+(Lm+j*pw+6)+'" y="'+T2+'" width="'+(pw-12)+'" height="'+(H2-B2-T2)+'" fill="#fff" stroke="#DDE1E4"/><line x1="'+(Lm+j*pw+6)+'" x2="'+(Lm+(j+1)*pw-6)+'" y1="'+Yv(gm)+'" y2="'+Yv(gm)+'" stroke="#7C8B99" stroke-dasharray="4 4"/>'+
  '<line x1="'+x0+'" y1="'+Yv(m[0])+'" x2="'+x1+'" y2="'+Yv(m[1])+'" stroke="#0F3E68" stroke-width="2.5"/><circle cx="'+x0+'" cy="'+Yv(m[0])+'" r="5" fill="#0F3E68"/><circle cx="'+x1+'" cy="'+Yv(m[1])+'" r="5" fill="#0F3E68"/>'+
  '<text class="ax" x="'+x0+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(lo[j].slice(0,k>5?5:8))+'</text><text class="ax" x="'+x1+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(hi[j].slice(0,k>5?5:8))+'</text><text x="'+(Lm+(j+0.5)*pw)+'" y="'+(H2-B2+36)+'" text-anchor="middle">'+L[j]+': '+E(fn[j].length>cut?fn[j].slice(0,cut-1)+'…':fn[j])+'</text>'; });
 ME.innerHTML=g+'</svg>';
 if(pair){
 var x0i=Lm+120, x1i=W-200, chn=alc?(pair.chain?pair.chain:DS.chains.filter(function(c){return c.nm===pair.nm;})[0]):null, alt=chn?chn.txt.split(/ [+−] /).filter(function(x){return x!==pair.nm;}):[];
 g='<svg viewBox="0 0 '+W+' '+H2+'" role="img" aria-label="Interaction plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><text x="'+Lm+'" y="18" style="font-weight:600">Interaction '+pair.nm+': effect '+M(pair.e,dp)+(alt.length?' (aliased with '+alt.slice(0,3).join(', ')+(alt.length>3?', …':'')+')':'')+'</text><rect x="'+Lm+'" y="'+T2+'" width="'+(W-Lm-160)+'" height="'+(H2-B2-T2)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(var v6=y0;v6<=y1+NT.st*1e-6;v6+=NT.st){ g+='<line x1="'+(Lm-3)+'" x2="'+Lm+'" y1="'+Yv(v6)+'" y2="'+Yv(v6)+'" stroke="#7C8B99"/><text class="ax" x="'+(Lm-6)+'" y="'+(Yv(v6)+4)+'" text-anchor="end">'+M(v6,NT.d)+'</text>'; }
 [0,1].forEach(function(w3){ var cl=w3?'#D8B147':'#0F3E68'; g+='<line x1="'+x0i+'" y1="'+Yv(im[w3][0])+'" x2="'+x1i+'" y2="'+Yv(im[w3][1])+'" stroke="'+cl+'" stroke-width="2.5"'+(w3?'':' stroke-dasharray="7 4"')+'/><circle cx="'+x0i+'" cy="'+Yv(im[w3][0])+'" r="5" fill="'+cl+'"/><circle cx="'+x1i+'" cy="'+Yv(im[w3][1])+'" r="5" fill="'+cl+'"/>'+
  '<line x1="'+(W-146)+'" x2="'+(W-120)+'" y1="'+(T2+20+w3*24)+'" y2="'+(T2+20+w3*24)+'" stroke="'+cl+'" stroke-width="2.5"'+(w3?'':' stroke-dasharray="7 4"')+'/><text x="'+(W-114)+'" y="'+(T2+24+w3*24)+'">'+L[j2]+' '+(w3?'high':'low')+(hasLv[j2]?' ('+E((w3?hi[j2]:lo[j2]).slice(0,8))+')':'')+'</text>'; });
 g+='<text class="ax" x="'+x0i+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(lo[j1].slice(0,10))+'</text><text class="ax" x="'+x1i+'" y="'+(H2-B2+16)+'" text-anchor="middle">'+E(hi[j1].slice(0,10))+'</text><text x="'+((x0i+x1i)/2)+'" y="'+(H2-B2+36)+'" text-anchor="middle">'+L[j1]+': '+E(fn[j1])+'</text>';
 IP.innerHTML=g+'</svg>';
 } else IP.innerHTML='<p class="th" style="margin:12px">Every two-factor interaction in this resolution '+rom[DS.resn]+' design is aliased with a main effect, so there is no separate interaction to plot. Pick a pair under “Interaction plot for” to see its plot anyway, knowing it shows the alias chain.</p>';
 /* flags */
 var big=srt[0];
 if(isFinite(crit)){ var sg=srt.filter(function(t){return Math.abs(t.e)>crit;});
  f.push([sg.length?'ok':'',sg.length?'Significant at α = '+a+' (judged against '+how+'): <b>'+sg.map(function(t){return t.nm;}).join(', ')+'</b>. Largest: '+big.nm+' with effect '+M(big.e,dp)+'.':'No effect exceeds the critical value '+F(crit,dp)+' at α = '+a+'. The factors as varied did not move the response more than the noise.']);
  if(alc){ var amb=sg.filter(function(t){ return t.al.some(function(x){ return x.o<=2; }); });
   if(amb.length) f.push(['warn','Aliased: '+amb.map(function(t){ return '<b>'+t.nm+'</b> is really '+t.txt.split(' ').slice(0,1+2*Math.min(3,t.al.filter(function(x){return x.o<=2;}).length)).join(' '); }).join('; ')+'. The experiment cannot separate the effects in each chain. Use effect heredity (an interaction of two active main effects is the likelier one), or run the fold-over or a few added runs to break the alias.']); } }
 else f.push(['warn','No estimate of error is available, so no effect can be tested. '+why+' Largest effect: '+big.nm+' ('+M(big.e,dp)+').']);
 if(!bal&&r>1) f.push(['warn','Unbalanced replication: '+miss+' of '+(nr*r)+' responses '+(miss>1?'are':'is')+' missing. Effects are computed from the run means'+(nrep>0?', and the error estimate pools the '+nrep+' run'+(nrep>1?'s':'')+' with more than one response ('+(cnt-nr)+' df), so the tests are approximate':', and no run has more than one response, so there is no pure error'+(isFinite(crit)?' and Lenth’s method is used instead':''))+'. Fill every cell if you can.']);
 if(r===1&&isFinite(crit)) f.push(['','Unreplicated design: significance comes from Lenth’s method, which assumes most effects are inactive (effect sparsity). Confirm with replicated runs.']);
 var goal=S.f.goal||'Minimize'; if(goal!=='Hit a target'){ var mn=goal==='Minimize', best=0, bv=mn?Infinity:-Infinity; ym.forEach(function(v,i){ if(mn?v<bv:v>bv){bv=v;best=i;} });
  f.push(['','Best observed run for “'+goal.toLowerCase()+'”: run '+(best+1)+' ('+L.map(function(l,j){ return l+' '+(hasLv[j]?(col(best,j)>0?'+':'−')+' '+E(col(best,j)>0?hi[j]:lo[j]):(col(best,j)>0?'high':'low')); }).join(', ')+') with mean '+M(bv,dp)+'. Confirm the setting with a few verification runs before you change the process.']); }
 var ii=T.filter(function(t){return t.b.length>=2&&(isFinite(crit)?Math.abs(t.e)>crit:false);});
 if(ii.length) f.push(['',(ii.length>1?'Interactions ':'Interaction ')+ii.map(function(t){return t.nm;}).join(', ')+(ii.length>1?' are':' is')+' significant: the effect of one factor depends on the level of the other, so read the main effects of '+ii[0].nm.split('').join(' and ')+' from the interaction plot, not on their own. Non-parallel lines show it.']);
 f.push(['','A two-level design fits straight lines between low and high. Add center points to check for curvature before predicting between the levels, and do not extrapolate beyond them.']);
 O.innerHTML=api.flags(f);
},
exFrac:{f:{k:'4',fr:'Half fraction, 2^(k−1)',gen:'',r:'2',a:'0.05',y:'Coating thickness, µm',goal:'Maximize',ip:'Largest two-factor interaction',an:'Bath temperature, °C',al:'50',ah:'60',bn:'Line speed, m/min',bl:'2',bh:'3',cn:'Additive, g/L',cl:'4',ch:'8',dn:'Rinse time, s',dl:'20',dh:'40'},
 y:{'1|1':'17.5','1|2':'17.6','2|1':'19.2','2|2':'18.9','3|1':'17.8','3|2':'17.6','4|1':'19.4','4|2':'19.8','5|1':'18.1','5|2':'18.0','6|1':'24.6','6|2':'24.6','7|1':'18.4','7|2':'18.0','8|1':'24.9','8|2':'25.2'}},
example:{f:{k:'3',r:'2',a:'0.05',y:'Shrinkage, %',goal:'Minimize',ip:'Largest two-factor interaction',an:'Mold temperature, °C',al:'40',ah:'60',bn:'Hold pressure, bar',bl:'600',bh:'800',cn:'Cooling time, s',cl:'10',ch:'20'},
 x:{y:{'1|1':'1.45','1|2':'1.45','2|1':'1.75','2|2':'1.74','3|1':'1.41','3|2':'1.43','4|1':'1.53','4|2':'1.51','5|1':'1.42','5|2':'1.41','6|1':'1.73','6|2':'1.74','7|1':'1.37','7|2':'1.40','8|1':'1.49','8|2':'1.48'}}}
}
