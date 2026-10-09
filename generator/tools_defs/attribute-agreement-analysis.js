{
slug:'attribute-agreement-analysis',
sections:[
 {type:'fields',title:'The study',cols:4,hint:'Each appraiser judges every part, blind and in random order, two or three times. A known standard (the expert or reference decision for each part) lets you check accuracy as well as consistency. Up to three appraisers and three trials.',fields:[
  {id:'ch',label:'What is being judged',ph:'e.g. Flash on molded cap',wide:true},
  {id:'na',label:'Appraiser A',ph:'name'},
  {id:'nb',label:'Appraiser B',ph:'name'},
  {id:'nc',label:'Appraiser C',ph:'name'}]},
 {type:'grid',id:'r',title:'Ratings',rows:10,cls:'aa-sec',hint:'One row per part. <b>Standard</b> is the known correct rating; leave the whole column blank if there is none. <b>A1</b> is appraiser A, trial 1, and so on. Type the ratings exactly the same way each time (Pass and pass count as the same; Pass and P do not). Leave unused appraisers and trials blank. Any rating categories work: Pass/Fail, Go/No-go, or grades 1 to 5.',cols:[
  {id:'p',label:'Part',w:64},
  {id:'s',label:'Standard',w:64},
  {id:'a1',label:'A1',tip:'Appraiser A, trial 1'},{id:'a2',label:'A2',tip:'Appraiser A, trial 2'},{id:'a3',label:'A3',tip:'Appraiser A, trial 3'},
  {id:'b1',label:'B1',tip:'Appraiser B, trial 1'},{id:'b2',label:'B2',tip:'Appraiser B, trial 2'},{id:'b3',label:'B3',tip:'Appraiser B, trial 3'},
  {id:'c1',label:'C1',tip:'Appraiser C, trial 1'},{id:'c2',label:'C2',tip:'Appraiser C, trial 2'},{id:'c3',label:'C3',tip:'Appraiser C, trial 3'}]},
 {type:'custom',id:'res',title:'Agreement',hint:'<b>Within</b>: the appraiser gave the same rating in every trial. <b>Vs standard</b>: every trial matched the standard. <b>Between</b>: every rating by every appraiser was the same. Percentages are of parts; the 95% confidence intervals are exact (Clopper-Pearson) binomial intervals.',html:'<div class="stat aa-stat"></div><div class="tgw"><table class="tg aa-tab"></table></div><div class="svgw aa-svg"></div>'},
 {type:'custom',id:'mx',title:'Every rating against the standard',hint:'All trials pooled. Each row is one appraiser and one standard category; the cells count how that appraiser rated those parts. Off-diagonal cells are the misses and false alarms.',html:'<div class="tgw"><table class="tg aa-mx"></table></div>'},
 {type:'custom',id:'chk',title:'What the study says',html:'<div class="out aa-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=[], AP=['a','b','c'], NM={a:S.f.na||'A',b:S.f.nb||'B',c:S.f.nc||'C'};
 function v(x){ return String(x==null?'':x).trim(); }
 function K(x){ return v(x).toLowerCase(); }
 function pc(x,n){ return n?api.fmt(100*x/n,1)+'%':'—'; }
 function kf(k){ return isFinite(k)?k.toFixed(3):'—'; }
 /* --- exact binomial (Clopper-Pearson) interval from the inverse incomplete beta --- */
 function lgam(x){ var c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5], y=x, t=x+5.5; t-=(x+0.5)*Math.log(t); var s=1.000000000190015; for(var j=0;j<6;j++) s+=c[j]/++y; return -t+Math.log(2.5066282746310005*s/x); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap; if(Math.abs(d)<1e-300) d=1e-300; d=1/d; var h=d;
  for(var m=1;m<=300;m++){ var m2=2*m, aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300) d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300) c=1e-300; d=1/d; var del=d*c; h*=del; if(Math.abs(del-1)<3e-16) break; } return h; }
 function ibeta(x,a,b){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(lgam(a+b)-lgam(a)-lgam(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 function binv(p,a,b){ var lo=0,hi=1; for(var i=0;i<80;i++){ var m=(lo+hi)/2; if(ibeta(m,a,b)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function cp(x,n){ return [x===0?0:binv(0.025,x,n-x+1), x===n?1:binv(0.975,x+1,n-x)]; }
 /* --- kappa --- */
 function fleiss(M){ if(!M.length) return NaN; var N=M.length, n=M[0].reduce(function(a,b){return a+b;},0), k=M[0].length, pj=[], Pb=0, Pe=0, j;
  if(n<2) return NaN; for(j=0;j<k;j++) pj.push(0);
  M.forEach(function(r){ var s=0; r.forEach(function(c,i){ s+=c*c; pj[i]+=c; }); Pb+=(s-n)/(n*(n-1)); });
  Pb/=N; pj.forEach(function(c){ var p=c/(N*n); Pe+=p*p; }); return Pe>1-1e-12?NaN:(Pb-Pe)/(1-Pe); }
 function cohen(T){ var k=T.length, tot=0, d=0, rs=[], cs=[], i, j; for(i=0;i<k;i++){ rs.push(0); cs.push(0); }
  for(i=0;i<k;i++) for(j=0;j<k;j++){ tot+=T[i][j]; rs[i]+=T[i][j]; cs[j]+=T[i][j]; if(i===j) d+=T[i][j]; }
  if(!tot) return NaN; var po=d/tot, pe=0; for(i=0;i<k;i++) pe+=rs[i]*cs[i]/(tot*tot); return pe>1-1e-12?NaN:(po-pe)/(1-pe); }
 /* --- which appraisers and trials are in use --- */
 var used=[], tr={};
 AP.forEach(function(a){ var t=0; for(var j=1;j<=3;j++) if(S.g.r.some(function(r){ return v(r[a+j]); })) t=j; if(t){ used.push(a); tr[a]=t; } });
 var hasStd=S.g.r.some(function(r){ return v(r.s); });
 var cats=[], lab={}; function cat(x){ var k=K(x); if(!(k in lab)){ lab[k]=v(x); cats.push(k); } return k; }
 var rows=[], skipped=[];
 S.g.r.forEach(function(r,i){ var any=v(r.p)||v(r.s)||used.some(function(a){ for(var j=1;j<=tr[a];j++) if(v(r[a+j])) return true; return false; });
  if(!any) return;
  var ok=(!hasStd||v(r.s))&&used.every(function(a){ for(var j=1;j<=tr[a];j++) if(!v(r[a+j])) return false; return true; });
  if(!ok){ skipped.push(v(r.p)||('row '+(i+1))); return; }
  var o={id:v(r.p)||('row '+(i+1)), s:hasStd?cat(r.s):null, R:{}};
  used.forEach(function(a){ o.R[a]=[]; for(var j=1;j<=tr[a];j++) o.R[a].push(cat(r[a+j])); }); rows.push(o); });
 var ST=root.querySelector('.aa-stat'), TB=root.querySelector('.aa-tab'), SV=root.querySelector('.aa-svg'), MX=root.querySelector('.aa-mx'), O=root.querySelector('.aa-out');
 if(skipped.length) f.push(['warn','Left out because a rating'+(hasStd?' or the standard':'')+' is missing: '+skipped.slice(0,12).map(api.esc).join(', ')+(skipped.length>12?' …':'')+'. Every part needs every rating for the percentages to compare like with like.']);
 if(!used.length||rows.length<2){ ST.innerHTML=''; TB.innerHTML=''; SV.innerHTML=''; MX.innerHTML=''; O.innerHTML=api.flags(f,'Enter at least two parts, with ratings from at least one appraiser.'); return; }
 var N=rows.length, C=cats.length, ci=function(k){ return cats.indexOf(k); };
 var mtr=used.map(function(a){ return tr[a]; });
 if(Math.min.apply(null,mtr)!==Math.max.apply(null,mtr)) f.push(['warn','The appraisers have different numbers of trials ('+used.map(function(a){ return api.esc(NM[a])+' '+tr[a]; }).join(', ')+'). Each is assessed on its own trials, but the comparison between them is not even.']);
 function zeros(){ var z=[]; for(var i=0;i<C;i++) z.push(0); return z; }
 function counts(list){ var z=zeros(); list.forEach(function(k){ z[ci(k)]++; }); return z; }
 /* per appraiser */
 var A=used.map(function(a){
  var w=0, vs=0, mixed=0, wrong=0, M=[], T=[], i; for(i=0;i<C;i++) T.push(zeros());
  rows.forEach(function(o){ var rs=o.R[a], same=rs.every(function(x){ return x===rs[0]; }); if(same) w++; else mixed++;
   if(hasStd){ if(same&&rs[0]===o.s) vs++; if(same&&rs[0]!==o.s) wrong++; rs.forEach(function(x){ T[ci(o.s)][ci(x)]++; }); }
   M.push(counts(rs)); });
  return {a:a, nm:NM[a], m:tr[a], w:w, vs:vs, mixed:mixed, wrong:wrong, kw:tr[a]>1?fleiss(M):NaN, T:T, ks:hasStd?cohen(T):NaN, ciw:cp(w,N), civ:cp(vs,N)}; });
 /* overall */
 var btw=0, all=0, MB=[], TA=[], i; for(i=0;i<C;i++) TA.push(zeros());
 rows.forEach(function(o){ var rs=[]; used.forEach(function(a){ rs=rs.concat(o.R[a]); }); var same=rs.every(function(x){ return x===rs[0]; });
  if(same) btw++; if(hasStd&&same&&rs[0]===o.s) all++; MB.push(counts(rs)); if(hasStd) rs.forEach(function(x){ TA[ci(o.s)][ci(x)]++; }); });
 var kb=used.length>1?fleiss(MB):NaN, ka=hasStd?cohen(TA):NaN, multi=used.length>1, anyRep=Math.max.apply(null,mtr)>1;
 var cb=cp(btw,N), ca=cp(all,N);
 var tiles=[[N,'Parts in the study'],[used.length+' &times; '+Math.max.apply(null,mtr),'Appraisers &times; trials']];
 if(hasStd) tiles.push([pc(all,N),'All appraisers vs standard'],[kf(ka),'Kappa, all ratings vs standard']);
 if(multi) tiles.push([pc(btw,N),'Between appraisers'],[kf(kb),'Fleiss&rsquo; kappa, between appraisers']);
 ST.innerHTML=tiles.map(function(t){ return '<div><b>'+t[0]+'</b><span>'+t[1]+'</span></div>'; }).join('');
 function ciTxt(c){ return api.fmt(100*c[0],1)+' to '+api.fmt(100*c[1],1)+'%'; }
 function row(label,x,c,k,mx,wr,cls){ return '<tr'+(cls?' class="'+cls+'"':'')+'><td>'+label+'</td><td class="calc">'+N+'</td><td class="calc">'+x+'</td><td class="calc">'+pc(x,N)+'</td><td class="calc">'+ciTxt(c)+'</td><td class="calc">'+kf(k)+'</td><td class="calc">'+(mx==null?'':mx)+'</td><td class="calc">'+(wr==null?'':wr)+'</td></tr>'; }
 var h='<thead><tr><th>Assessment</th><th>Parts</th><th>Matched</th><th>Percent</th><th>95% CI</th><th>Kappa</th><th>Mixed</th><th>Wrong</th></tr></thead><tbody>';
 if(anyRep){ h+='<tr><th colspan="8" class="aa-h">Within each appraiser (repeatability) &middot; Fleiss&rsquo; kappa across the trials</th></tr>';
  A.forEach(function(x){ h+=x.m>1?row(api.esc(x.nm),x.w,x.ciw,x.kw,x.mixed,null):'<tr><td>'+api.esc(x.nm)+'</td><td colspan="7" class="aa-na">One trial only: repeatability cannot be checked</td></tr>'; }); }
 if(hasStd){ h+='<tr><th colspan="8" class="aa-h">Each appraiser vs standard (accuracy) &middot; Cohen&rsquo;s kappa, all trials vs standard</th></tr>';
  A.forEach(function(x){ h+=row(api.esc(x.nm),x.vs,x.civ,x.ks,x.mixed,x.wrong); }); }
 if(multi||hasStd){ h+='<tr><th colspan="8" class="aa-h">All appraisers</th></tr>';
  if(multi) h+=row('Between appraisers (reproducibility)',btw,cb,kb,null,null);
  if(hasStd) h+=row('All appraisers vs standard',all,ca,ka,null,null); }
 TB.innerHTML=h+'</tbody>';
 /* chart: percent with CI, two panels */
 var panels=[]; if(anyRep) panels.push({t:'WITHIN APPRAISERS',d:A.filter(function(x){ return x.m>1; }).map(function(x){ return {n:x.nm,p:x.w/N,c:x.ciw}; })});
 if(hasStd) panels.push({t:'APPRAISER VS STANDARD',d:A.map(function(x){ return {n:x.nm,p:x.vs/N,c:x.civ}; })});
 if(panels.length){
  var lo=1; panels.forEach(function(P){ P.d.forEach(function(d){ lo=Math.min(lo,d.c[0]); }); }); lo=Math.max(0,Math.floor(lo*10-0.0001)/10);
  var W=800, H=310, pw=(W-70)/panels.length, T0=34, B0=H-58, Y=function(p){ return B0-(p-lo)/(1-lo)*(B0-T0); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Percent agreement with 95% confidence intervals"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#4A5D71}.t{font:700 10.5px \'IBM Plex Mono\',monospace;fill:#0F3E68;letter-spacing:.06em}.v{font:600 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
  for(var t=lo;t<=1.0001;t+=0.1){ g+='<line x1="60" x2="'+(W-10)+'" y1="'+Y(t)+'" y2="'+Y(t)+'" stroke="#E6E9EC"/><text x="54" y="'+(Y(t)+4)+'" text-anchor="end">'+Math.round(t*100)+'%</text>'; }
  panels.forEach(function(P,pi){ var x0=60+pi*pw, step=pw/(P.d.length+1);
   g+='<text class="t" x="'+(x0+pw/2)+'" y="18" text-anchor="middle">'+P.t+'</text>'+(pi?'<line x1="'+x0+'" x2="'+x0+'" y1="'+T0+'" y2="'+B0+'" stroke="#C6CDD3"/>':'');
   P.d.forEach(function(d,j){ var X=x0+step*(j+1), wd=String(d.n).split(/\s+/), l1=wd[0], l2=wd.slice(1).join(' '); if(l1.length>14) l1=l1.slice(0,13)+'…'; if(l2.length>14) l2=l2.slice(0,13)+'…';
    g+='<line x1="'+X+'" x2="'+X+'" y1="'+Y(d.c[0])+'" y2="'+Y(d.c[1])+'" stroke="#0F3E68" stroke-width="2"/><line x1="'+(X-8)+'" x2="'+(X+8)+'" y1="'+Y(d.c[0])+'" y2="'+Y(d.c[0])+'" stroke="#0F3E68" stroke-width="2"/><line x1="'+(X-8)+'" x2="'+(X+8)+'" y1="'+Y(d.c[1])+'" y2="'+Y(d.c[1])+'" stroke="#0F3E68" stroke-width="2"/>'+
     '<circle cx="'+X+'" cy="'+Y(d.p)+'" r="6" fill="#D8B147" stroke="#9C7C1F"/><text class="v" x="'+(X+11)+'" y="'+(Y(d.p)+4)+'">'+api.fmt(100*d.p,1)+'%</text><text x="'+X+'" y="'+(B0+16)+'" text-anchor="middle">'+api.esc(l1)+'</text>'+(l2?'<text x="'+X+'" y="'+(B0+29)+'" text-anchor="middle">'+api.esc(l2)+'</text>':''); }); });
  g+='<line x1="60" x2="'+(W-10)+'" y1="'+B0+'" y2="'+B0+'" stroke="#C6CDD3"/><text x="'+(W/2)+'" y="'+(H-6)+'" text-anchor="middle">Dot: percent of parts matched &middot; bar: 95% confidence interval</text>';
  SV.innerHTML=g+'</svg>'; } else SV.innerHTML='';
 /* confusion table */
 if(hasStd){ var sc=cats.filter(function(k){ return rows.some(function(o){ return o.s===k; }); });
  var mh='<thead><tr><th>Appraiser</th><th>Standard</th>'+cats.map(function(k){ return '<th>Rated '+api.esc(lab[k])+'</th>'; }).join('')+'<th>Correct</th></tr></thead><tbody>';
  A.forEach(function(x){ sc.forEach(function(s,si){ var r=x.T[ci(s)], tot=r.reduce(function(a,b){return a+b;},0), ok=r[ci(s)];
   mh+='<tr'+(tot&&ok/tot<0.9?' class="hi-row"':'')+'><td>'+(si?'':api.esc(x.nm))+'</td><td>'+api.esc(lab[s])+'</td>'+r.map(function(c,j){ return '<td class="calc">'+c+'</td>'; }).join('')+'<td class="calc">'+pc(ok,tot)+'</td></tr>'; }); });
  MX.innerHTML=mh+'</tbody>'; } else MX.innerHTML='<tbody><tr><td>Enter a standard for each part to compare the ratings with it.</td></tr></tbody>';
 /* checks */
 function judge(k){ return !isFinite(k)?'':k>0.75?'good':k>=0.4?'fair to good':'poor'; }
 if(hasStd){ A.forEach(function(x){ var j=judge(x.ks), worst=null;
   cats.forEach(function(s){ var r=x.T[ci(s)], tot=r.reduce(function(a,b){return a+b;},0); r.forEach(function(c,k){ if(k!==ci(s)&&c&&(!worst||c/tot>worst.r)) worst={s:s,k:cats[k],c:c,t:tot,r:c/tot}; }); });
   f.push([j==='good'&&x.vs/N>=0.9?'ok':(j==='poor'||x.vs/N<0.8?'warn':''),'<b>'+api.esc(x.nm)+'</b> matched the standard on every trial for '+x.vs+' of '+N+' parts ('+pc(x.vs,N)+'), kappa '+kf(x.ks)+(j?' ('+j+')':'')+'.'+(worst?' Most common error: '+api.esc(lab[worst.s])+' parts rated '+api.esc(lab[worst.k])+', '+worst.c+' of '+worst.t+' ratings ('+api.fmt(100*worst.r,0)+'%).':' No errors.')+(x.wrong?' '+x.wrong+' part'+(x.wrong>1?'s were':' was')+' rated wrong in every trial, which points to a misunderstanding of the criterion rather than chance.':'')]); }); }
 else if(anyRep) A.forEach(function(x){ if(x.m>1) f.push(['','<b>'+api.esc(x.nm)+'</b> repeated the same rating on '+x.w+' of '+N+' parts ('+pc(x.w,N)+'), kappa '+kf(x.kw)+'.']); });
 if(anyRep){ var rep=A.filter(function(x){ return x.m>1; }).sort(function(p,q){ return p.w-q.w; }); if(rep.length&&rep[0].mixed) f.push([rep[0].w/N<0.9?'warn':'',
  'Least repeatable: <b>'+api.esc(rep[0].nm)+'</b>, with mixed ratings on '+rep[0].mixed+' part'+(rep[0].mixed>1?'s':'')+'. An appraiser who cannot repeat their own decision will not agree with anyone else; fix repeatability first.']); }
 var hard=rows.filter(function(o){ var rs=[]; used.forEach(function(a){ rs=rs.concat(o.R[a]); }); return rs.some(function(x){ return hasStd?x!==o.s:x!==rs[0]; }); });
 if(hard.length) f.push(['','Parts where '+(hasStd?'at least one rating missed the standard':'the ratings disagree')+': '+hard.slice(0,15).map(function(o){ return '<b>'+api.esc(o.id)+'</b>'; }).join(', ')+(hard.length>15?' …':'')+'. These sit near the boundary of the criterion. Review them together, then add boundary samples or photographs to the work instruction.']);
 if(multi&&hasStd) f.push([ka>0.75&&all/N>=0.9?'ok':ka<0.4||all/N<0.8?'warn':'','Overall, all '+used.length+' appraisers agreed with the standard and with each other on '+all+' of '+N+' parts ('+pc(all,N)+'), and Cohen&rsquo;s kappa for all ratings against the standard is '+kf(ka)+' ('+judge(ka)+'). The overall figure is always the lowest, because one slip by anyone on a part counts against it.']);
 var w95=Math.max.apply(null,A.map(function(x){ var c=hasStd?x.civ:x.ciw; return c[1]-c[0]; }));
 f.push(['','With '+N+' parts the 95% intervals are up to '+api.fmt(100*w95,0)+' points wide. '+(N<30?'Fewer than 30 parts gives intervals too wide to tell a good inspector from a marginal one; 50 parts is common for an important inspection.':'More parts narrow them; the interval halves when the number of parts is about four times larger.')]);
 if(hasStd){ var sc2=counts(rows.map(function(o){ return o.s; })), mn=Math.min.apply(null,sc2.filter(function(c,j){ return rows.some(function(o){ return ci(o.s)===j; }); }));
  if(mn/N<0.2) f.push(['warn','One standard category has only '+mn+' of '+N+' parts. A study made mostly of clearly good parts makes everyone look accurate; include plenty of bad and borderline parts.']); }
 f.push(['','Kappa corrects the percent agreement for the agreement expected by chance. A common guideline (Fleiss, used in the AIAG MSA manual): above 0.75 is good to excellent agreement, 0.40 to 0.75 is fair to good, below 0.40 is poor.']);
 O.innerHTML=api.flags(f);
},
example:(function(){
 var raw='C-01 P PPPPPPPPP|C-02 F FFFFFFFFF|C-03 P PPPPPPPPP|C-04 P PPPPPPFFF|C-05 F FFFFFFFFF|C-06 P PPPPPPPPP|C-07 P PPPPPPPPP|C-08 F FFFFFFFPF|C-09 P PPPPPPFPP|C-10 P PPPPPPPPP|C-11 F FFFFFFFFF|C-12 P PPPPPPPFP|C-13 F FFFFFFFPF|C-14 P PPPPPPPPP|C-15 F FFFFPFPFP|C-16 F FFFFFFFFF|C-17 P PPFFPFPFF|C-18 P PPPPPPPPP|C-19 F FFFFFFFFF|C-20 P PPPPPPPPF|C-21 P FPPPPPPPP|C-22 F FFFFFFFFF|C-23 P PPPPPPPPP|C-24 F FFFFFFFFF|C-25 P PPPPPPPPP|C-26 P PPFPPPPPP|C-27 F FFFFFFFFF|C-28 P PPPPPPPPP|C-29 F FFFFPFFFF|C-30 P PPPPPPPPP';
 var W={P:'Pass',F:'Fail'}, ids=['a1','a2','a3','b1','b2','b3','c1','c2','c3'];
 return {f:{ch:'Flash on the sealing face of a 38 mm molded cap, judged against the limit sample',na:'Marisol Okafor',nb:'Dev Lindqvist',nc:'Tomasz Reyes'},
  g:{r:raw.split('|').map(function(s){ var t=s.split(' '), o={p:t[0],s:W[t[1]]}; ids.forEach(function(id,i){ o[id]=W[t[2].charAt(i)]; }); return o; })}};
})()
}
