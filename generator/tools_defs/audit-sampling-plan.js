{
slug:'audit-sampling-plan',
aspl:(function(){ var Z=window.ASPL={};
    Z.need=function(F,api){var C=api.num(F.conf)/100,p=api.num(F.p)/100;if(!(C>0&&C<1&&p>0&&p<1))return NaN;return Math.ceil(Math.log(1-C)/Math.log(1-p)-1e-9);};
    Z.alloc=function(S,api){var n=Z.need(S.f,api),mn=api.num(S.f.min);if(isNaN(mn)||mn<0)mn=0;
     var R=S.g.st.filter(function(r){return r.n&&api.num(r.sz)>0;}),T=R.reduce(function(a,r){return a+api.num(r.sz);},0),out={};
     if(isNaN(n)||!T)return {map:out,tot:0,T:T};
     var raw=R.map(function(r){var q=n*api.num(r.sz)/T;return {r:r,b:Math.floor(q),f:q-Math.floor(q)};}),left=n-raw.reduce(function(a,x){return a+x.b;},0);
     raw.slice().sort(function(a,b){return b.f-a.f;}).forEach(function(x){if(left>0){x.b++;left--;}});
     var tot=0;raw.forEach(function(x){var v=Math.min(api.num(x.r.sz),Math.max(x.b,mn));out[S.g.st.indexOf(x.r)]=v;tot+=v;});
     return {map:out,tot:tot,T:T};};
 return Z; })(),
sections:[
 {type:'fields',title:'Population and purpose',cols:3,fields:[
  {id:'org',label:'Organization'},
  {id:'aud',label:'Audit and criterion',ph:'e.g. Internal audit, procedure LG-04 sec 3'},
  {id:'attr',label:'Attribute tested',ph:'What counts as an error',hint:'Define the error before sampling, so every item gets the same yes or no test.'},
  {id:'pop',label:'Population',ph:'e.g. Shipment records, Jan to Jun 2026',wide:true},
  {id:'N',label:'Population size (N)',type:'number',min:1},
  {id:'conf',label:'Confidence (%)',type:'number',min:50,max:99.9,hint:'Commonly 90 or 95.'},
  {id:'p',label:'Tolerable error rate (%)',type:'number',min:0.1,max:50,hint:'The highest error rate you could accept and still call the control effective.'}]},
 {type:'grid',id:'st',title:'Strata (optional)',rows:3,hint:'Split the population into groups that may behave differently (sites, shifts, product lines, months, transaction size). The sample is shared out in proportion to each stratum’s size, with at least the minimum below in each.',cols:[
  {id:'n',label:'Stratum',w:200},
  {id:'sz',label:'Items in stratum',type:'number',w:110},
  {id:'al',label:'Sample allocated',calc:function(r,api){
   var Z=window.ASPL;
   var S=api.state(),a=Z.alloc(S,api),i=S.g.st.indexOf(r);return a.map[i]!=null?'<b>'+a.map[i]+'</b>':'';
  }}]},
 {type:'fields',title:'Selection and results',cols:3,fields:[
  {id:'meth',label:'Selection method',type:'select',opts:['Simple random','Systematic interval','Stratified random','Judgmental']},
  {id:'seed',label:'Random seed',type:'number',hint:'Any whole number. Record it so the selection can be repeated.'},
  {id:'min',label:'Minimum per stratum',type:'number',min:0},
  {id:'chk',label:'Items actually checked',type:'number',min:0},
  {id:'err',label:'Errors found',type:'number',min:0},
  {id:'note',label:'Judgmental additions',ph:'e.g. all rush orders, all records by new staff',hint:'Items picked on purpose. Report them separately; they do not count toward the statistical sample.'}]},
 {type:'custom',id:'res',title:'Sample size, selection and conclusion',html:'<div class="tgw"><table class="mv asp-t"></table></div><div class="svgw asp-chart"></div><div class="asp-sel"></div><div class="out asp-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[], n=api.num, Z=window.ASPL;
 var tb=root.querySelector('.asp-t'), ch=root.querySelector('.asp-chart'), sel=root.querySelector('.asp-sel'), out=root.querySelector('.asp-out');
 var C=n(F.conf)/100, p=n(F.p)/100, N=n(F.N);
 if(!(C>0&&C<1&&p>0&&p<1)){ tb.innerHTML=''; ch.innerHTML=''; sel.innerHTML=''; out.innerHTML=api.flags(!F.conf&&!F.p?[]:[['warn','Enter a confidence between 50 and 99.9 percent and a tolerable error rate between 0.1 and 50 percent.']],'Enter the confidence and the tolerable error rate and the sample size, selection and conclusion appear here.'); return; }
 var need=Z.need(F,api), pc=function(v,d){if(d===0&&Math.abs(v*100-Math.round(v*100))>1e-9)d=1;return api.fmt(v*100,d==null?1:d)+'%';};
 /* finite population: smallest n with P(0 errors | D errors in N) <= 1-C */
 var hyp=NaN, D=NaN;
 if(N>0&&N===Math.floor(N)){ D=Math.max(1,Math.ceil(p*N-1e-9)); var pr=1; for(var k=0;k<N;k++){ pr*=(N-D-k)/(N-k); if(pr<=1-C+1e-12){ hyp=k+1; break; } } }
 var al=Z.alloc(S,api), strata=S.g.st.filter(function(r){return r.n&&n(r.sz)>0;});
 var planN=(F.meth==='Stratified random'&&strata.length)?al.tot:need;
 var ub0=function(m){return 1-Math.pow(1-C,1/m);};
 var bcdf=function(k,m,q){var s=0,t=Math.pow(1-q,m);for(var i=0;i<=k;i++){s+=t;t=t*(m-i)/(i+1)*q/(1-q);}return s;};
 var ub=function(k,m){if(k>=m)return 1;if(k===0)return ub0(m);var lo=0,hi=1;for(var it=0;it<60;it++){var mid=(lo+hi)/2;if(bcdf(k,m,mid)>1-C)lo=mid;else hi=mid;}return (lo+hi)/2;};
 var rows=[['Sample size, zero-failure (binomial)','<b>'+need+'</b>','n = ln(1 − '+api.fmt(C,3)+') / ln(1 − '+api.fmt(p,3)+') = '+api.fmt(Math.log(1-C)/Math.log(1-p),2)+', rounded up']];
 if(!isNaN(hyp)) rows.push(['Exact for N = '+api.fmt(N,0)+' (hypergeometric)','<b>'+hyp+'</b>','smallest n where finding none is unlikely if '+D+' of '+api.fmt(N,0)+' items were errors']);
 if(strata.length) rows.push(['Allocated across '+strata.length+' strata','<b>'+al.tot+'</b>','proportional, largest remainder, minimum '+(n(F.min)>0?n(F.min):0)+' each']);
 rows.push(['Upper error bound if the planned sample is clean',pc(ub0(planN),2),'at '+pc(C,1)+' confidence, with 0 errors in '+planN]);
 tb.innerHTML='<thead><tr><th>Quantity</th><th>Value</th><th>How it was found</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td class="mo">'+r[0]+'</td><td class="mt">'+r[1]+'</td><td class="mh">'+r[2]+'</td></tr>';}).join('')+'</tbody>';
 /* chart: upper bound vs clean sample size */
 var W=720,H=250,L=58,R=20,T=16,B=44,mx=Math.max(20,Math.ceil(planN*2.2/10)*10), ymax=Math.min(1,Math.ceil(Math.max(p*2,ub0(planN)*2)*100/5-1e-9)*5/100);
 var X=function(m){return L+(m/mx)*(W-L-R);}, Y=function(v){return T+(1-v/ymax)*(H-T-B);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Upper bound on the error rate after a clean sample"><style>text{font:12px Archivo,sans-serif;fill:#4A5D71}.k{fill:#16273A;font-weight:700}</style>';
 for(var j=0;j<=5;j++){ var v=ymax*j/5; g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#DDE1E4"/><text x="'+(L-6)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+api.fmt(v*100,ymax<0.05?1:0)+'%</text>'; }
 for(j=0;j<=5;j++){ var m=Math.round(mx*j/5); g+='<text x="'+X(m)+'" y="'+(H-B+18)+'" text-anchor="middle">'+m+'</text>'; }
 g+='<text x="'+((L+W-R)/2)+'" y="'+(H-6)+'" text-anchor="middle">items checked, no errors found</text>';
 var d=''; for(var mm=1;mm<=mx;mm++){ d+=(mm===1?'M':'L')+X(mm).toFixed(1)+' '+Y(ub0(mm)).toFixed(1); }
 g+='<clipPath id="aspc"><rect x="'+L+'" y="'+T+'" width="'+(W-L-R)+'" height="'+(H-T-B)+'"/></clipPath><path d="'+d+'" fill="none" stroke="#0F3E68" stroke-width="2.5" clip-path="url(#aspc)"/>';
 g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(p)+'" y2="'+Y(p)+'" stroke="#C0392B" stroke-dasharray="5 4"/><text x="'+(W-R-4)+'" y="'+(Y(p)-6)+'" text-anchor="end" fill="#C0392B">tolerable '+pc(p,1)+'</text>';
 g+='<circle cx="'+X(planN)+'" cy="'+Y(ub0(planN))+'" r="5" fill="#D8B147" stroke="#9C7C1F"/><text class="k" x="'+(X(planN)+9)+'" y="'+(Y(ub0(planN))-8)+'">n = '+planN+', bound '+pc(ub0(planN),2)+'</text>';
 ch.innerHTML=g+'</svg>';
 /* selection */
 var seed=n(F.seed); if(isNaN(seed)) seed=1;
 var rng=function(a){a=a>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};};
 var pick=function(pop,k,r){var s={},o=[];k=Math.min(k,pop);while(o.length<k){var v=1+Math.floor(r()*pop);if(!s[v]){s[v]=1;o.push(v);}}return o.sort(function(a,b){return a-b;});};
 var list=function(a){return a.length>80?a.slice(0,80).join(', ')+' … ('+a.length+' in all)':a.join(', ');};
 var sh='', meth=F.meth||'';
 if(meth==='Simple random'&&N>0) sh='<p><b>Items to pull</b> (numbered 1 to '+api.fmt(N,0)+' in the population list, seed '+seed+'): '+list(pick(N,need,rng(seed)))+'</p>';
 else if(meth==='Systematic interval'&&N>0){ var iv=N/need, r0=rng(seed), st=1+r0()*iv, o=[]; for(var q=0;q<need&&q<N;q++) o.push(Math.floor(st+q*iv)); sh='<p><b>Items to pull</b>: every '+api.fmt(iv,2)+'th item from a random start of '+api.fmt(st,2)+' (seed '+seed+'): '+list(o)+'</p>'; }
 else if(meth==='Stratified random'&&strata.length) sh=strata.map(function(r,i){var k=al.map[S.g.st.indexOf(r)]||0;return '<p><b>'+esc(r.n)+'</b> ('+k+' of '+api.fmt(n(r.sz),0)+'): '+list(pick(n(r.sz),k,rng(seed+i*7919)))+'</p>';}).join('');
 sel.innerHTML=sh?'<div class="asp-list">'+sh+'</div>':'';
 /* checks */
 var chk=n(F.chk), err=n(F.err);
 f.push(['ok','To claim, with <b>'+pc(C,0)+'</b> confidence, that the error rate is no more than <b>'+pc(p,1)+'</b>, check <b>'+planN+'</b> items'+(strata.length&&meth==='Stratified random'?' across the strata':'')+' and find <b>no</b> errors.'+(!isNaN(hyp)&&hyp<need?' For a population of '+api.fmt(N,0)+' the exact figure is '+hyp+'; the binomial result is slightly conservative.':'')]);
 if(chk>0&&!isNaN(err)){
  if(err>chk) f.push(['warn','More errors than items checked. Check the entries.']);
  else { var b=ub(err,chk);
   if(err===0) f.push([b<=p+1e-9?'ok':'warn','Result: 0 errors in '+chk+' items. With '+pc(C,0)+' confidence the population error rate is no more than <b>'+pc(b,2)+'</b>.'+(b<=p+1e-9?' That meets the tolerable rate of '+pc(p,1)+'.':' That is above the tolerable rate, because fewer items were checked than planned. Limit the conclusion or check more.')]);
   else f.push(['warn','Result: <b>'+err+' error'+(err>1?'s':'')+' in '+chk+' items</b> (observed '+pc(err/chk,1)+'). The '+pc(C,0)+' upper bound is <b>'+pc(b,1)+'</b>, '+(b>p?'above':'within')+' the tolerable '+pc(p,1)+'. A zero-failure plan has failed, so the sample cannot support "effective". Each error is objective evidence: record it, look for a pattern across the strata, and decide whether it is a finding. Do not keep adding items until the rate looks acceptable.']); }
  if(chk<planN&&err===0) f.push(['warn','Only '+chk+' of the '+planN+' planned items were checked.']);
 } else f.push(['','Enter the number of items checked and errors found after the audit to get the conclusion.']);
 if(strata.length){ var sT=al.T; if(N>0&&sT!==N) f.push(['warn','The strata add up to '+api.fmt(sT,0)+' items, not the population of '+api.fmt(N,0)+'. Every item should belong to exactly one stratum.']);
  if(al.tot>need) f.push(['','The stratum minimum raises the sample from '+need+' to '+al.tot+'.']);
  if(meth&&meth!=='Stratified random') f.push(['','Strata are listed but the method is '+esc(meth.toLowerCase())+'. Choose stratified random to draw from each stratum.']); }
 if(meth==='Judgmental') f.push(['warn','A judgmental sample can find problems, but it cannot support a confidence statement about the whole population. Use it to aim at risk; use a random or systematic sample when you need to say how good the population is.']);
 if(meth==='Systematic interval') f.push(['','Check the list order for a cycle that matches the interval (for example a weekly pattern with an interval of 7); a periodic population can make a systematic sample biased.']);
 if(!meth) f.push(['warn','Choose a selection method and record it in the working papers.']);
 if(!isNaN(N)&&need>=N) f.push(['warn','The sample size reaches the whole population. Check all '+api.fmt(N,0)+' items (a 100 percent check) instead.']);
 if(F.note) f.push(['','Judgmental additions ('+esc(F.note)+') are reported on their own and are not part of the statistical conclusion.']);
 if(!F.attr) f.push(['warn','Define the attribute being tested (what counts as an error) before drawing the sample.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Pinecrest Logistics',aud:'Internal audit of cold chain, procedure CC-04 sec 3.2',attr:'Reefer temperature log missing, incomplete, or shows a reading outside 33 to 38 °F without a deviation record',pop:'Refrigerated shipment records, January to June 2026, all three depots',N:'2400',conf:'95',p:'5',meth:'Stratified random',seed:'2026',min:'5',chk:'59',err:'0',note:'All 6 shipments with a customer temperature complaint'},
 g:{st:[{n:'North depot',sz:'1200'},{n:'Central depot',sz:'800'},{n:'South depot',sz:'400'}]}}
}
