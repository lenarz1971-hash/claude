{
slug:'tur-tar-guard-band-pfa',
MN:['simple acceptance (no guard band)','the subtract-U guard band','the RSS guard band','the managed (Dobbert) guard band','the guard band solved for the PFA target','the custom acceptance limits'],
M:['None: simple acceptance (A = T)','Subtract U (A = T − U)','RSS (A = √(T² − U²))','Managed guard band, Dobbert (PFA ≤ 2%)','Solve for the PFA target','Custom acceptance limits'],
h:{
 /* standard normal CDF: Marsaglia's series in the middle, the asymptotic tail series outside |x| > 6 */
 Phi:function(x){ if(x>-6&&x<6){ var s=x,t=0,b=x,q=x*x,i=1; while(s!==t) s=(t=s)+(b*=q/(i+=2)); return 0.5+s*Math.exp(-0.5*q-0.91893853320467274); }
  var a=Math.abs(x), x2=a*a, r=Math.exp(-x2/2-0.91893853320467274)/a*(1-1/x2+3/(x2*x2)-15/(x2*x2*x2)+105/(x2*x2*x2*x2)); return x<0?r:1-r; },
 simp:function(fn,a,b,n){ if(!(b>a)) return 0; var hh=(b-a)/n, s=fn(a)+fn(b), i; for(i=1;i<n;i++) s+=fn(a+i*hh)*(i%2?4:2); return s*hh/3; },
 /* PFA and PFR for true values x ~ N(mu, sp), readings y = x + e, e ~ N(0, um); accept when aL <= y <= aU */
 risk:function(m,aL,aU){ var h=this, mu=m.mu, sp=m.sp, um=m.um, L=m.L, U=m.U, lo=mu-10*sp, hi=mu+10*sp, br=[lo,hi,L,U];
  [aL,aU].forEach(function(a){ [-6,-3,-1,0,1,3,6].forEach(function(k){ br.push(a+k*um); }); });
  br=br.filter(function(v){ return v>=lo&&v<=hi; }).sort(function(a,b){return a-b;});
  var pdf=function(x){ var z=(x-mu)/sp; return Math.exp(-0.5*z*z)/(sp*2.5066282746310002); };
  var pacc=function(x){ return h.Phi((aU-x)/um)-h.Phi((aL-x)/um); };
  var fa=0, fr=0, i;
  for(i=0;i<br.length-1;i++){ var a=br[i], b=br[i+1], c=(a+b)/2; if(!(b>a)) continue;
   if(c<L||c>U) fa+=h.simp(function(x){ return pdf(x)*pacc(x); },a,b,64);
   else fr+=h.simp(function(x){ return pdf(x)*(1-pacc(x)); },a,b,64); }
  var pin=h.Phi((U-mu)/sp)-h.Phi((L-mu)/sp);
  return {pfa:Math.max(fa,0), pfr:Math.max(fr,0), pin:pin, pacc:pin-fr+fa}; },
 /* the population standard deviation that gives the stated in-tolerance probability */
 spFor:function(R,mu,L,U){ var h=this, lo=(U-L)*1e-6, hi=(U-L)*1e3, i, m;
  for(i=0;i<200;i++){ m=Math.sqrt(lo*hi); var p=h.Phi((U-mu)/m)-h.Phi((L-mu)/m); if(p>R) lo=m; else hi=m; } return Math.sqrt(lo*hi); },
 model:function(api){ var S=api.state(), n=api.num, h=this, L=n(S.f.ltl), U=n(S.f.utl), Ue=n(S.f.U), k=n(S.f.k); if(!(k>0)) k=2;
  var o={L:L,U:U,Ue:Ue,k:k,ok:false}; if(!(U>L)||!(Ue>0)) return o;
  o.mid=(L+U)/2; o.T=(U-L)/2; o.um=Ue/k; var mu=n(S.f.mu); o.mu=isNaN(mu)?o.mid:mu;
  var pv=n(S.f.pv), byS=/^Standard/.test(S.f.pm||'');
  if(byS){ if(!(pv>0)) return o; o.sp=pv; }
  else { if(!(pv>0&&pv<100)) return o; o.R=pv/100; o.sp=h.spFor(o.R,o.mu,L,U); }
  o.ok=true; o.tur=(U-L)/(2*Ue); var acc=n(S.f.acc); o.tar=acc>0?o.T/acc:NaN; return o; },
 A:function(o,i,api){ var S=api.state(), n=api.num, T=o.T, Ue=o.Ue;
  if(i===0) return T;
  if(i===1) return T-Ue;
  if(i===2) return Ue<T?Math.sqrt(T*T-Ue*Ue):NaN;
  if(i===3){ var M=1.04-Math.exp(0.38*Math.log(o.tur)-0.54); if(M<0) M=0; return T-Ue*M; }
  if(i===4){ var tg=n(S.f.tgt); if(!(tg>0&&tg<100)) return NaN; tg/=100; var h=this, f=function(A){ return h.risk(o,o.mid-A,o.mid+A).pfa; };
   var lo=1e-9*T, hi=3*T; if(f(hi)<=tg) return hi; if(f(lo)>tg) return NaN; for(var j=0;j<60;j++){ var m=(lo+hi)/2; if(f(m)>tg) hi=m; else lo=m; } return lo; }
  return NaN; },
 p:function(x){ if(!isFinite(x)) return '—'; x*=100; if(x===0) return '0%'; if(x<0.0001) return '< 0.0001%'; return (x>=10?x.toFixed(1):x>=1?x.toFixed(2):x.toPrecision(3))+'%'; },
 v:function(x,d){ if(!isFinite(x)) return '—'; return x.toFixed(d); }
},
sections:[
 {type:'fields',title:'Tolerance and measurement uncertainty',cols:3,hint:'T is half the tolerance span. U is the expanded uncertainty of the calibration process at this test point, normally at k = 2 (about 95%). Build U with the <a href="/tools/cqt-measurement-uncertainty-budget.html">uncertainty budget</a> if you do not have it.',fields:[
  {id:'what',label:'Instrument and test point',wide:true},
  {id:'un',label:'Units',ph:'psi'},
  {id:'ltl',label:'Lower tolerance limit',type:'number'},
  {id:'utl',label:'Upper tolerance limit',type:'number'},
  {id:'U',label:'Expanded uncertainty U',type:'number',min:0},
  {id:'k',label:'Coverage factor k',type:'number',min:1,ph:'2'},
  {id:'acc',label:'Reference standard accuracy ± (for TAR)',type:'number',min:0}]},
 {type:'fields',title:'The instruments being calibrated, and the guard band',cols:3,hint:'False-accept risk depends on how often instruments like this one arrive in tolerance. Give the in-tolerance probability (end-of-period reliability, EOPR) from your calibration history, or a standard deviation. The population is taken as normal, centered on the nominal unless you give a mean.',fields:[
  {id:'pm',label:'Describe the population by',type:'select',opts:['In-tolerance probability (EOPR), %','Standard deviation']},
  {id:'pv',label:'EOPR % or standard deviation',type:'number',min:0},
  {id:'mu',label:'Population mean (blank = nominal)',type:'number'},
  {id:'gm',label:'Guard-band method',type:'select',opts:['None: simple acceptance (A = T)','Subtract U (A = T − U)','RSS (A = √(T² − U²))','Managed guard band, Dobbert (PFA ≤ 2%)','Solve for the PFA target','Custom acceptance limits']},
  {id:'tgt',label:'PFA target, %',type:'number',min:0,max:100,ph:'2'},
  {id:'cal',label:'Custom: lower acceptance limit',type:'number'},
  {id:'cau',label:'Custom: upper acceptance limit',type:'number'}]},
 {type:'custom',id:'res',title:'Ratios and risk',html:'<div class="stat tg-stat"></div><div class="tgw"><table class="mv tg-t"></table></div>'},
 {type:'custom',id:'ch',title:'Pictures',hint:'Left: the population of true values, the tolerance limits (red) and the acceptance limits (gold), with the measurement spread drawn at the upper limit (dotted; its height is scaled to fit). Right: how PFA and PFR trade off as the acceptance limit moves.',html:'<div class="tg-charts"><div class="svgw tg-a"></div><div class="svgw tg-b"></div></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out tg-out"></div>'}
],
update:function(root,api){
 var S=api.state(), T=window.TOOL, h=T.h, o=h.model(api), un=api.esc(S.f.un||''), f=[], out=root.querySelector('.tg-out');
 var st=root.querySelector('.tg-stat'), tb=root.querySelector('.tg-t'), ca=root.querySelector('.tg-a'), cb=root.querySelector('.tg-b');
 var clear=function(msg){ st.innerHTML=''; tb.innerHTML=''; ca.innerHTML=''; cb.innerHTML=''; out.innerHTML=api.flags(f,msg); };
 if(!(o.U>o.L)){ if(!isNaN(o.L)&&!isNaN(o.U)) f.push(['warn','The upper tolerance limit must be above the lower one.']); return clear('Enter the tolerance limits and the expanded uncertainty.'); }
 if(!(o.Ue>0)) return clear('Enter the expanded uncertainty U.');
 if(!o.ok){ f.push(['warn',/^Standard/.test(S.f.pm||'')?'Enter the population standard deviation (greater than 0).':'Enter the in-tolerance probability (EOPR) as a percentage between 0 and 100, for example 95.']); return clear(); }
 var dp=Math.max(2,Math.min(8,Math.max((String(S.f.ltl).split('.')[1]||'').length,(String(S.f.utl).split('.')[1]||'').length,(String(S.f.U).split('.')[1]||'').length)+1));
 var gi=T.M.indexOf(S.f.gm); if(gi<0) gi=0;
 var rows=[];
 for(var i=0;i<5;i++){ if(i===4&&!(api.num(S.f.tgt)>0)) continue; var A=h.A(o,i,api); rows.push({i:i,A:A,aL:o.mid-A,aU:o.mid+A,ok:A>0}); }
 var cl=api.num(S.f.cal), cu=api.num(S.f.cau);
 if(!isNaN(cl)&&!isNaN(cu)&&cu>cl) rows.push({i:5,aL:cl,aU:cu,A:NaN,ok:true});
 rows.forEach(function(r){ if(r.ok){ var k=h.risk(o,r.aL,r.aU); r.pfa=k.pfa; r.pfr=k.pfr; r.pacc=k.pacc; } });
 var ch=rows.filter(function(r){ return r.i===gi; })[0];
 if(!ch){ ch=rows[0]; f.push(['warn',gi===5?'Enter both custom acceptance limits (upper above lower). Showing simple acceptance.':'Enter a PFA target to solve for. Showing simple acceptance.']); }
 if(!ch.ok){ f.push(['warn','The method "'+T.M[ch.i]+'" leaves no acceptance zone at this TUR (U is as large as the tolerance). Showing simple acceptance.']); ch=rows[0]; }
 var sp=o.sp, R=h.Phi((o.U-o.mu)/sp)-h.Phi((o.L-o.mu)/sp);
 st.innerHTML='<div><b>'+o.tur.toFixed(2)+' : 1</b><span>TUR = (UTL − LTL) / 2U</span></div>'+(isFinite(o.tar)?'<div><b>'+o.tar.toFixed(2)+' : 1</b><span>TAR = T / standard accuracy</span></div>':'')+
  '<div><b>'+h.p(ch.pfa)+'</b><span>PFA, false accept</span></div><div><b>'+h.p(ch.pfr)+'</b><span>PFR, false reject</span></div><div><b>'+h.v(ch.aL,dp)+' to '+h.v(ch.aU,dp)+'</b><span>Acceptance limits'+(un?', '+un:'')+'</span></div>'+
  '<div><b>'+h.p(R)+'</b><span>In-tolerance probability (EOPR)</span></div><div><b>'+Number(sp.toPrecision(4))+'</b><span>Population standard deviation</span></div><div><b>'+Number(o.um.toPrecision(4))+'</b><span>Standard uncertainty u = U/k</span></div>'+
  '<div><b>'+(ch.pacc>0?h.p(ch.pfa/ch.pacc):'—')+'</b><span>Of the accepted, share out of tolerance</span></div>';
 tb.innerHTML='<thead><tr><th>Method</th><th>Acceptance limits</th><th>Guard band each side</th><th>PFA</th><th>PFR</th></tr></thead><tbody>'+rows.map(function(r){
  var gb=r.i===5?'':h.v(o.T-r.A,dp);
  return '<tr'+(r===ch?' class="tg-hit"':'')+'><td class="mo">'+T.M[r.i]+'</td><td class="mt">'+(r.ok?h.v(r.aL,dp)+' to '+h.v(r.aU,dp):'none left')+'</td><td class="mt">'+(r.ok?gb:'—')+'</td><td class="mt">'+(r.ok?h.p(r.pfa):'—')+'</td><td class="mt">'+(r.ok?h.p(r.pfr):'—')+'</td></tr>'; }).join('')+'</tbody>';
 /* checks */
 if(o.tur>=4) f.push(['ok','TUR is '+o.tur.toFixed(2)+':1. ANSI/NCSL Z540.3 accepts a TUR of at least 4:1 where the false-accept probability is not calculated; here it is calculated anyway.']);
 else f.push(['warn','TUR is '+o.tur.toFixed(2)+':1, below 4:1. Z540.3 then asks for the false-accept probability to be shown to be 2% or less, which is what this calculation does; a guard band is the usual way to get there.']);
 f.push([ch.pfa<=0.02?'ok':'warn','With '+T.MN[ch.i]+', PFA is '+h.p(ch.pfa)+(ch.pfa<=0.02?', within the 2% limit in ANSI/NCSL Z540.3.':', above the 2% limit in ANSI/NCSL Z540.3. Widen the guard band, reduce U, or improve the in-tolerance rate (shorter interval).')+' The price is a false-reject probability of '+h.p(ch.pfr)+': instruments that were in tolerance but read outside the acceptance limits, and get adjusted or rejected anyway.']);
 if(isFinite(o.tar)&&isFinite(o.tur)&&o.tar>o.tur*1.5) f.push(['','TAR ('+o.tar.toFixed(1)+':1) looks much better than TUR ('+o.tur.toFixed(1)+':1). TAR compares accuracy specifications only; TUR includes every source of uncertainty in the calibration (resolution, repeatability, environment), which is why Z540.3 uses TUR.']);
 if(Math.abs(o.k-2)>0.05) f.push(['warn','TUR is defined with U at about 95% coverage (k ≈ 2). U was entered at k = '+api.fmt(o.k)+', so this TUR is not comparable with 4:1. The risk figures use u = U/k and are still correct.']);
 if(Math.abs(o.mu-o.mid)>1e-12) f.push(['','The population is off center by '+Number((o.mu-o.mid).toPrecision(3))+' '+un+', so more of the false accepts come from one side.']);
 f.push(['','PFA here is the unconditional (Z540.3) probability: the chance that a calibration both finds the instrument in tolerance and the instrument is really out of tolerance, across the population. Both distributions are taken as normal; the integral is evaluated numerically.']);
 out.innerHTML=api.flags(f);
 /* chart A: population, limits, measurement spread */
 var W=420,H=240,L0=14,R0=14,Tp=14,B=34, xlo=Math.min(o.mu-3.5*sp,o.L-o.T*0.25), xhi=Math.max(o.mu+3.5*sp,o.U+o.T*0.25);
 var X=function(v){ return L0+(v-xlo)/(xhi-xlo)*(W-L0-R0); }, pk=1/(sp*2.5066), pkm=Math.min(1/(o.um*2.5066),pk*1.05), ymax=Math.max(pk,pkm)*1.1, Y=function(v){ return H-B-v/ymax*(H-B-Tp); };
 var pts=[], tl=[], tr=[], N=160, x, y, j;
 for(j=0;j<=N;j++){ x=xlo+(xhi-xlo)*j/N; y=Math.exp(-0.5*Math.pow((x-o.mu)/sp,2))*pk; pts.push(X(x).toFixed(1)+','+Y(y).toFixed(1)); if(x<=o.L) tl.push([x,y]); if(x>=o.U) tr.push([x,y]); }
 var area=function(a,x0,x1){ if(!a.length) return ''; var p='M'+X(x0).toFixed(1)+','+Y(0).toFixed(1); a.forEach(function(q){ p+=' L'+X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1); }); return '<path d="'+p+' L'+X(x1).toFixed(1)+','+Y(0).toFixed(1)+' Z" fill="#C0392B" fill-opacity=".25"/>'; };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Population of true values with tolerance and acceptance limits">';
 g+=area(tl,xlo,Math.min(o.L,xhi))+area(tr,Math.max(o.U,xlo),xhi);
 g+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2"/>';
 var mp=[]; for(j=0;j<=60;j++){ x=o.U-4*o.um+8*o.um*j/60; y=Math.exp(-0.5*Math.pow((x-o.U)/o.um,2))*pkm; mp.push(X(x).toFixed(1)+','+Y(y).toFixed(1)); }
 g+='<polyline points="'+mp.join(' ')+'" fill="none" stroke="#4A5D71" stroke-width="1.4" stroke-dasharray="3 3"/>';
 g+='<line x1="'+L0+'" x2="'+(W-R0)+'" y1="'+Y(0)+'" y2="'+Y(0)+'" stroke="#4A5D71"/>';
 [[o.L,'#C0392B','LTL','6 4'],[o.U,'#C0392B','UTL','6 4'],[ch.aL,'#9C7C1F','A','2 0'],[ch.aU,'#9C7C1F','A','2 0']].forEach(function(l,ix){ var xx=X(l[0]); g+='<line x1="'+xx.toFixed(1)+'" x2="'+xx.toFixed(1)+'" y1="'+Tp+'" y2="'+Y(0)+'" stroke="'+l[1]+'" stroke-width="1.6" stroke-dasharray="'+l[3]+'"/><text x="'+xx.toFixed(1)+'" y="'+(H-B+14+(ix>1?12:0))+'" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="'+l[1]+'">'+l[2]+' '+Number(l[0].toPrecision(6))+'</text>'; });
 g+='</svg>'; ca.innerHTML=g;
 /* chart B: PFA and PFR against the acceptance limit */
 var W2=420,H2=240,L2=46,R2=12,T2=14,B2=36, fr=[], fa=[], k0=0.5, k1=1.1, mx=0;
 for(j=0;j<=30;j++){ var kk=k0+(k1-k0)*j/30, rk=h.risk(o,o.mid-kk*o.T,o.mid+kk*o.T); fa.push([kk,rk.pfa]); fr.push([kk,rk.pfr]); mx=Math.max(mx,rk.pfa,rk.pfr); }
 mx=Math.max(mx*1.1,0.025); var X2=function(v){ return L2+(v-k0)/(k1-k0)*(W2-L2-R2); }, Y2=function(v){ return H2-B2-v/mx*(H2-B2-T2); };
 var line=function(a,c,d){ return '<polyline points="'+a.map(function(q){ return X2(q[0]).toFixed(1)+','+Y2(q[1]).toFixed(1); }).join(' ')+'" fill="none" stroke="'+c+'" stroke-width="2"'+(d?' stroke-dasharray="'+d+'"':'')+'/>'; };
 var g2='<svg viewBox="0 0 '+W2+' '+H2+'" role="img" aria-label="PFA and PFR against the acceptance limit">';
 g2+='<line x1="'+L2+'" x2="'+(W2-R2)+'" y1="'+Y2(0)+'" y2="'+Y2(0)+'" stroke="#4A5D71"/><line x1="'+L2+'" x2="'+L2+'" y1="'+T2+'" y2="'+Y2(0)+'" stroke="#4A5D71"/>';
 g2+='<line x1="'+L2+'" x2="'+(W2-R2)+'" y1="'+Y2(0.02).toFixed(1)+'" y2="'+Y2(0.02).toFixed(1)+'" stroke="#C0392B" stroke-dasharray="5 4"/><text x="'+(W2-R2-2)+'" y="'+(Y2(0.02)-4).toFixed(1)+'" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#C0392B">2% PFA</text>';
 [0,0.5,1].forEach(function(t){ var v=mx*t/1.1; g2+='<text x="'+(L2-5)+'" y="'+(Y2(v)+4).toFixed(1)+'" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+Number((v*100).toPrecision(2))+'%</text>'; });
 [0.5,0.6,0.7,0.8,0.9,1,1.1].forEach(function(t){ g2+='<text x="'+X2(t).toFixed(1)+'" y="'+(H2-B2+14)+'" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+Math.round(t*100)+'%</text>'; });
 g2+='<text x="'+((L2+W2-R2)/2)+'" y="'+(H2-6)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#4A5D71">Acceptance limit A as % of T</text>';
 g2+=line(fa,'#C0392B')+line(fr,'#0F3E68','6 3');
 g2+='<text x="'+(L2+8)+'" y="'+(T2+10)+'" font-family="Archivo, sans-serif" font-size="11" fill="#C0392B">PFA</text><text x="'+(L2+44)+'" y="'+(T2+10)+'" font-family="Archivo, sans-serif" font-size="11" fill="#0F3E68">PFR (dashed)</text>';
 if(ch.i!==5&&isFinite(ch.A)){ var kc=ch.A/o.T; if(kc>=k0&&kc<=k1) g2+='<line x1="'+X2(kc).toFixed(1)+'" x2="'+X2(kc).toFixed(1)+'" y1="'+T2+'" y2="'+Y2(0)+'" stroke="#9C7C1F" stroke-width="1.6"/><circle cx="'+X2(kc).toFixed(1)+'" cy="'+Y2(ch.pfa).toFixed(1)+'" r="4.5" fill="#C0392B"/><circle cx="'+X2(kc).toFixed(1)+'" cy="'+Y2(ch.pfr).toFixed(1)+'" r="4.5" fill="#0F3E68"/>'; }
 g2+='</svg>'; cb.innerHTML=g2;
},
example:{f:{what:'Digital pressure gauge PG-300, 0 to 1000 psi, test point 500 psi, tolerance ±0.1% of full scale',un:'psi',ltl:'499.0',utl:'501.0',U:'0.30',k:'2',acc:'0.15',pm:'In-tolerance probability (EOPR), %',pv:'92',mu:'',gm:'Managed guard band, Dobbert (PFA ≤ 2%)',tgt:'1',cal:'',cau:''}}
}
