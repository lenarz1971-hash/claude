{
slug:'attribute-capability',
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
 function nsf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?q:1-q; }
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function zinv(p){ return p<=0?-Infinity:p>=1?Infinity:inv(function(z){return 1-nsf(z);},p,-40,40); }
 function chiinv(p,k){ return inv(function(x){return 1-gq(k/2,x/2);},p,0,1e7); }
 function betainv(p,a,b){ return inv(function(x){return ib(a,b,x);},p,0,1); }
 return {zinv:zinv,chiinv:chiinv,betainv:betainv};
})(),
sections:[
 {type:'fields',title:'The process',cols:2,hint:'A defective is a unit that fails (it may carry one defect or several). A defect is each individual nonconformity. Count opportunities only for the distinct ways a unit can fail that the customer cares about and that you actually check.',fields:[
  {id:'unit',label:'Unit inspected',ph:'e.g. Claim, invoice, circuit board'},
  {id:'opp',label:'Opportunities for a defect per unit (for DPMO)',type:'number',min:1},
  {id:'cl',label:'Confidence level for the intervals, %',type:'number',min:50,max:99.9,ph:'95'},
  {id:'tgt',label:'Target, maximum % defective (optional)',type:'number',min:0,max:100}]},
 {type:'grid',id:'sg',title:'Inspection results by subgroup',rows:5,hint:'One row per day, week or lot. Fill in defective units for the binomial view, total defects for the Poisson view, or both.',cols:[
  {id:'lab',label:'Subgroup',w:90},
  {id:'n',label:'Units inspected',type:'number',w:80},
  {id:'d',label:'Defective units',type:'number',w:80},
  {id:'c',label:'Total defects',type:'number',w:80},
  {id:'p',label:'% defective',calc:function(r,api){ var n=api.num(r.n), d=api.num(r.d); return n>0&&d>=0&&d<=n?(d/n*100).toFixed(2)+'%':''; }},
  {id:'u',label:'DPU',calc:function(r,api){ var n=api.num(r.n), c=api.num(r.c); return n>0&&c>=0?(c/n).toFixed(4):''; }}]},
 {type:'custom',id:'cap',title:'Capability summary',hint:'Z.bench is the standard normal value that leaves the defective rate in one tail, Φ⁻¹(1 − p). It is a long-term figure because the data span the whole study period. The short-term rows add the conventional 1.5 shift.',html:'<div class="ac-st"></div><div class="tgw"><table class="mv ac-tb"></table></div>'},
 {type:'custom',id:'chart',title:'Stability check',hint:'Capability only means something for a stable process. The limits move with the subgroup size: wider for small subgroups.',html:'<div class="svgw ac-svg"></div><div class="svgw ac-svg2"></div>'},
 {type:'custom',id:'read',title:'What the study says',html:'<div class="out ac-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, f=[];
 var STT=root.querySelector('.ac-st'), TB=root.querySelector('.ac-tb'), SV=root.querySelector('.ac-svg'), SV2=root.querySelector('.ac-svg2'), O=root.querySelector('.ac-out');
 var cl=api.num(S.f.cl); if(!(cl>=50&&cl<100)){ if(S.f.cl) f.push(['warn','The confidence level must be at least 50% and below 100%; 95% is used.']); cl=95; }
 var a=1-cl/100, opp=api.num(S.f.opp), tgt=api.num(S.f.tgt), unit=(S.f.unit||'unit').toLowerCase(), clS=(Math.round(cl*10)/10)+'%';
 var B=[], P=[], bad=[], partial=0;
 S.g.sg.forEach(function(r,i){ var n=api.num(r.n), d=api.num(r.d), c=api.num(r.c), lab=r.lab||('Row '+(i+1));
  if(!isFinite(n)&&!isFinite(d)&&!isFinite(c)) return;
  if(!(n>0)){ bad.push(E(lab)+': units inspected must be above zero'); return; }
  if(isFinite(d)){ if(d<0||d>n||Math.round(d)!==d) bad.push(E(lab)+': defective units must be a whole number from 0 to '+n); else B.push({lab:lab,n:n,x:d}); }
  if(isFinite(c)){ if(c<0||Math.round(c)!==c) bad.push(E(lab)+': total defects must be a whole number of 0 or more'); else { P.push({lab:lab,n:n,x:c}); if(isFinite(d)&&c<d) bad.push(E(lab)+': fewer defects ('+c+') than defective units ('+d+'); every defective unit has at least one defect'); } }
  if(!isFinite(d)&&!isFinite(c)) partial++; });
 if(bad.length) f.push(['warn','Check these rows: '+bad.join('; ')+'.']);
 if(partial) f.push(['warn',partial+' row'+(partial>1?'s have':' has')+' units inspected but no defective or defect count, and '+(partial>1?'were':'was')+' left out.']);
 if(!B.length&&!P.length){ STT.innerHTML=''; TB.innerHTML=''; SV.innerHTML=''; SV2.innerHTML=''; O.innerHTML=api.flags(f,'Enter units inspected with defective units, total defects or both, one row per subgroup. The capability figures appear here.'); return; }
 function sum(A,k){ var s=0; A.forEach(function(r){ s+=r[k]; }); return s; }
 var tiles=[], rows=[], pc=function(v,d){ return (v*100).toFixed(d==null?2:d)+'%'; }, zf=function(z){ return isFinite(z)?z.toFixed(2):'—'; }, zi=function(z){ return isFinite(z)?z.toFixed(2):(z>0?'∞':'—'); };
 var Nb=sum(B,'n'), Db=sum(B,'x'), pb=NaN, Zb=NaN, pL, pU, Np=sum(P,'n'), Cp=sum(P,'x'), dpu=NaN, uL, uU;
 if(B.length){
  pb=Db/Nb; pL=Db===0?0:ST.betainv(a/2,Db,Nb-Db+1); pU=Db===Nb?1:ST.betainv(1-a/2,Db+1,Nb-Db); Zb=ST.zinv(1-pb);
  tiles.push([pc(pb),'% defective (p̄)'],[F(pb*1e6,0),'PPM defective'],[zf(Zb),'Z.bench, long-term']);
  rows.push(['Binomial: % defective p̄',F(Db,0)+' / '+F(Nb,0),pc(pb,3),pc(pL,3)+' to '+pc(pU,3)]);
  rows.push(['PPM defective','p̄ × 1,000,000',F(pb*1e6,0),F(pL*1e6,0)+' to '+F(pU*1e6,0)]);
  rows.push(['Yield (defect-free units)','1 − p̄',pc(1-pb,2),pc(1-pU,2)+' to '+pc(1-pL,2)]);
  rows.push(['Z.bench, long-term','Φ⁻¹(1 − p̄)',zf(Zb),zi(ST.zinv(1-pU))+' to '+zi(ST.zinv(1-pL))]);
  rows.push(['Sigma, short-term convention','Z.bench + 1.5',zf(Zb+1.5),zi(ST.zinv(1-pU)+1.5)+' to '+zi(ST.zinv(1-pL)+1.5)]);
 }
 if(P.length){
  dpu=Cp/Np; uL=Cp===0?0:ST.chiinv(a/2,2*Cp)/2/Np; uU=ST.chiinv(1-a/2,2*Cp+2)/2/Np;
  rows.push(['Poisson: defects per unit (DPU)',F(Cp,0)+' / '+F(Np,0),F(dpu,4),F(uL,4)+' to '+F(uU,4)]);
  rows.push(['Defect-free yield predicted, e<sup>−DPU</sup>','Poisson P(0 defects)',pc(Math.exp(-dpu),2),pc(Math.exp(-uU),2)+' to '+pc(Math.exp(-uL),2)]);
  if(opp>0){ var dpo=dpu/opp, zl=ST.zinv(1-dpo);
   tiles.push([F(dpo*1e6,0),'DPMO ('+F(opp,0)+' opp/unit)'],[zf(zl+1.5),'Sigma from DPMO, with 1.5 shift']);
   rows.push(['DPO = DPU ÷ opportunities','÷ '+F(opp,0)+' per '+E(unit),F(dpo,6),F(uL/opp,6)+' to '+F(uU/opp,6)]);
   rows.push(['DPMO','DPO × 1,000,000',F(dpo*1e6,0),F(uL/opp*1e6,0)+' to '+F(uU/opp*1e6,0)]);
   rows.push(['Z from DPMO, long-term (no shift)','Φ⁻¹(1 − DPO)',zf(zl),zi(ST.zinv(1-uU/opp))+' to '+zi(ST.zinv(1-uL/opp))]);
   rows.push(['Sigma from DPMO, short-term (+1.5)','Φ⁻¹(1 − DPO) + 1.5',zf(zl+1.5),zi(ST.zinv(1-uU/opp)+1.5)+' to '+zi(ST.zinv(1-uL/opp)+1.5)]);
  } else tiles.push([F(dpu,4),'DPU']);
 }
 STT.innerHTML='<div class="stat">'+tiles.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 TB.innerHTML='<thead><tr><th>Measure</th><th>From</th><th>Estimate</th><th>'+clS+' confidence interval</th></tr></thead><tbody>'+rows.map(function(r){ return '<tr><td class="mo">'+r[0]+'</td><td>'+r[1]+'</td><td><b>'+r[2]+'</b></td><td>'+r[3]+'</td></tr>'; }).join('')+'</tbody>';
 /* control charts */
 function chart(A,cen,isP,title){
  if(A.length<2) return '';
  var lim=A.map(function(r){ var sd=isP?Math.sqrt(cen*(1-cen)/r.n):Math.sqrt(cen/r.n); return {v:r.x/r.n,u:cen+3*sd,l:Math.max(0,cen-3*sd)}; });
  var vals=[cen]; lim.forEach(function(q){ vals.push(q.v,q.u,q.l); }); var mx=Math.max.apply(null,vals)*1.08||1, mn=0;
  var W=800, L=64, R=64, top=30, ph=190, H=top+ph+44, k=A.length, sx=(W-L-R)/k, X=function(i){ return L+sx*(i+0.5); }, Y=function(v){ return top+ph-(v-mn)/(mx-mn)*ph; };
  var fm=function(v){ return isP?(v*100).toFixed(1)+'%':v.toFixed(3); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+title+'"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><text x="'+L+'" y="18" style="font-weight:700">'+title+'</text>';
  var st0=(mx-mn)/4, mg=Math.pow(10,Math.floor(Math.log(st0)/Math.LN10)), st=[1,2,2.5,5,10].map(function(k){return k*mg;}).filter(function(k){return k>=st0;})[0]||10*mg;
  fm=function(v){ var d=Math.max(0,-Math.floor(Math.log(isP?st*100:st)/Math.LN10+1e-9))+(st/mg===2.5?1:0); return isP?(v*100).toFixed(d)+'%':v.toFixed(d); };
  for(var tv=0;tv<=mx+1e-12;tv+=st){ g+='<line x1="'+L+'" y1="'+Y(tv)+'" x2="'+(W-R)+'" y2="'+Y(tv)+'" stroke="#EDEFEA"/><text class="ax" x="'+(L-6)+'" y="'+(Y(tv)+4)+'" text-anchor="end">'+fm(tv)+'</text>'; }
  var up='', lo='';
  lim.forEach(function(q,i){ var x1=L+sx*i, x2=x1+sx; up+=(i?'L':'M')+x1+' '+Y(q.u)+'L'+x2+' '+Y(q.u); lo+=(i?'L':'M')+x1+' '+Y(q.l)+'L'+x2+' '+Y(q.l); });
  g+='<path d="'+up+'" fill="none" stroke="#C0392B" stroke-width="1.4" stroke-dasharray="5 3"/><path d="'+lo+'" fill="none" stroke="#C0392B" stroke-width="1.4" stroke-dasharray="5 3"/>';
  g+='<line x1="'+L+'" y1="'+Y(cen)+'" x2="'+(W-R)+'" y2="'+Y(cen)+'" stroke="#1F8C55" stroke-width="1.6"/><text x="'+(W-R+4)+'" y="'+(Y(cen)+4)+'" style="fill:#1F8C55;font-size:12px">'+(isP?'p̄ '+(cen*100).toFixed(2)+'%':'ū '+cen.toFixed(4))+'</text>';
  g+='<text x="'+(W-R+4)+'" y="'+(Y(lim[k-1].u)+4)+'" style="fill:#C0392B;font-size:12px">UCL</text>';
  g+='<polyline points="'+lim.map(function(q,i){ return X(i)+','+Y(q.v); }).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="1.5"/>';
  var out=0; lim.forEach(function(q,i){ var o=q.v>q.u||q.v<q.l; if(o) out++; g+='<circle cx="'+X(i)+'" cy="'+Y(q.v)+'" r="'+(o?5.5:3.8)+'" fill="'+(o?'#C0392B':'#0F3E68')+'"/>'; });
  var step=Math.ceil(k/16); A.forEach(function(r,i){ if(i%step===0) g+='<text class="ax" x="'+X(i)+'" y="'+(top+ph+18)+'" text-anchor="middle" style="font-size:11px">'+E(r.lab.length>7?r.lab.slice(0,6)+'…':r.lab)+'</text>'; });
  g+='<line x1="'+L+'" y1="'+(top+ph)+'" x2="'+(W-R)+'" y2="'+(top+ph)+'" stroke="#C6CDD3"/></svg>';
  chart.out=out; chart.outLabs=A.filter(function(r,i){ return lim[i].v>lim[i].u||lim[i].v<lim[i].l; }).map(function(r){ return E(r.lab); });
  return g; }
 SV.innerHTML=chart(B,pb,true,'p chart: proportion defective'); var outP=B.length>1?chart.out:0, labP=B.length>1?chart.outLabs:[];
 SV2.innerHTML=chart(P,dpu,false,'u chart: defects per unit'); var outU=P.length>1?chart.out:0, labU=P.length>1?chart.outLabs:[];
 /* reading */
 if(B.length&&Db===0) f.unshift(['ok','<b>Binomial capability</b>: no defective '+E(unit)+'s in '+F(Nb,0)+' inspected, so p̄ = 0 and Z.bench from p̄ is unbounded. Quote the upper end of the '+clS+' interval instead: p ≤ '+pc(pU)+', which means Z.bench ≥ '+zf(ST.zinv(1-pU))+' (long-term). The Z.bench tile shows — because the point estimate has no finite value.']);
 else if(B.length) f.unshift(['ok','<b>Binomial capability</b>: '+pc(pb)+' of '+E(unit)+'s are defective ('+F(pb*1e6,0)+' PPM), '+clS+' interval '+pc(pL)+' to '+pc(pU)+'. Z.bench = Φ⁻¹(1 − '+F(pb,4)+') = '+zf(Zb)+'. This is the long-term figure; quoted with the 1.5 shift it would be '+zf(Zb+1.5)+' sigma.']);
 if(P.length&&opp>0){ var dpo2=dpu/opp, zp=ST.zinv(1-dpo2); f.push(['',Cp===0?'<b>Poisson capability</b>: no defects in '+F(Np,0)+' '+E(unit)+'s, so DPU = 0 and a sigma level from the point estimate is unbounded (shown as —). Quote the upper end of the '+clS+' interval instead: DPMO ≤ '+F(uU/opp*1e6,0)+', which means Z ≥ '+zf(ST.zinv(1-uU/opp))+' long-term, or '+zf(ST.zinv(1-uU/opp)+1.5)+' with the 1.5 shift.':'<b>Poisson capability</b>: DPU = '+F(dpu,4)+', so DPMO = '+F(dpu,4)+' ÷ '+F(opp,0)+' × 1,000,000 = '+F(dpo2*1e6,0)+'. Without the shift that is Z = '+zf(zp)+'; with the 1.5 shift, the figure usually quoted as the process sigma, it is '+zf(zp+1.5)+'.']);
  if(B.length&&isFinite(zp)&&isFinite(Zb)) f.push(['warn','The DPMO sigma ('+zf(ST.zinv(1-dpo2)+1.5)+') looks far better than the defective-based figure ('+zf(Zb+1.5)+') only because each '+E(unit)+' is credited with '+F(opp,0)+' opportunities. Adding opportunities lowers DPMO without changing what the customer sees. Compare processes on the same definition, and state the opportunity count with any DPMO.']); }
 else if(P.length) f.push(['','DPU = '+F(dpu,4)+' defects per '+E(unit)+'. Enter the opportunities per unit to get DPMO and a sigma level.']);
 if(B.length&&P.length){ var yp=Math.exp(-dpu); f.push(['','The Poisson model predicts '+pc(yp)+' defect-free '+E(unit)+'s (e<sup>−DPU</sup>); the data show '+pc(1-pb)+'. '+(1-yp>=pL&&1-yp<=pU?'The predicted defective rate, '+pc(1-yp)+', is inside the confidence interval for p, so the defects look independent and randomly spread over units.':'The predicted defective rate, '+pc(1-yp)+', is outside the confidence interval for p. '+(yp<1-pb?'Fewer defective units than predicted means defects tend to cluster on the same units':'More defective units than predicted means defects are spread more evenly than random')+', so use the observed yield rather than e<sup>−DPU</sup> for this process.')]); }
 if(B.length>1||P.length>1){ var outs=outP+outU, labs=labP.concat(labU.filter(function(l){ return labP.indexOf(l)<0; }));
  f.push([outs?'warn':'ok',outs?'Out-of-control subgroup'+(labs.length>1?'s':'')+': '+labs.join(', ')+'. Find and remove the special cause before trusting the capability figures; an unstable process has no single capability.':'All subgroups are inside the control limits'+(B.length>1&&P.length>1?' on both charts':'')+', so the process looks stable and the capability figures describe what it will keep producing.']); }
 else f.push(['warn','With one subgroup there is no way to check stability. Collect 20 or more subgroups over the normal range of conditions before quoting capability.']);
 if(B.length&&isFinite(tgt)&&tgt>=0){ var t=tgt/100; f.push([pU<=t?'ok':'warn',pU<=t?'Even the upper confidence bound ('+pc(pU)+') is at or below the '+F(tgt,2)+'% target: the process meets it.':pL>t?'Even the lower confidence bound ('+pc(pL)+') is above the '+F(tgt,2)+'% target: the process does not meet it.':'The target of '+F(tgt,2)+'% lies inside the interval ('+pc(pL)+' to '+pc(pU)+'): the data cannot yet show whether the process meets it.']); }
 if(B.length&&Db<10) f.push(['warn',(Db?'Only '+Db:'No')+' defective '+E(unit)+'s in the data. Estimates of a small defective rate need many units: the interval is wide and Z.bench can swing by half a sigma.']);
 f.push(['','For the sigma, DPMO and yield conversion table and the 1.5 shift explained, see the <a href="/calculators/sigma-level-dpmo.html">sigma level and DPMO calculator</a>.']);
 O.innerHTML=api.flags(f);
},
example:{f:{unit:'Claim',opp:'12',cl:'95',tgt:'2.0'},g:{sg:[{lab:'Wk 1',n:'179',d:'5',c:'7'},{lab:'Wk 2',n:'179',d:'2',c:'2'},{lab:'Wk 3',n:'198',d:'3',c:'3'},{lab:'Wk 4',n:'235',d:'12',c:'16'},{lab:'Wk 5',n:'231',d:'7',c:'10'},{lab:'Wk 6',n:'196',d:'5',c:'5'},{lab:'Wk 7',n:'194',d:'7',c:'9'},{lab:'Wk 8',n:'225',d:'9',c:'12'},{lab:'Wk 9',n:'239',d:'5',c:'7'},{lab:'Wk 10',n:'239',d:'7',c:'9'},{lab:'Wk 11',n:'235',d:'5',c:'7'},{lab:'Wk 12',n:'212',d:'9',c:'10'},{lab:'Wk 13',n:'225',d:'5',c:'5'},{lab:'Wk 14',n:'203',d:'9',c:'11'},{lab:'Wk 15',n:'187',d:'7',c:'8'},{lab:'Wk 16',n:'180',d:'9',c:'11'},{lab:'Wk 17',n:'213',d:'4',c:'5'},{lab:'Wk 18',n:'172',d:'5',c:'8'},{lab:'Wk 19',n:'214',d:'5',c:'5'},{lab:'Wk 20',n:'219',d:'4',c:'8'}]}}
}
