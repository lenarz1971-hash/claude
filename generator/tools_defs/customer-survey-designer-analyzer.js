{
slug:'customer-survey-designer-analyzer',
sections:[
 {type:'fields',title:'The survey',cols:3,hint:'Say who the survey is for and how it reaches them before writing a single question. The scale and confidence settings below are used in the analysis.',fields:[
  {id:'title',label:'Survey',wide:true,ph:'e.g. Post-repair customer survey, Q3'},
  {id:'purpose',label:'Decision the results will inform',type:'textarea',wide:true,ph:'e.g. Where to spend next year\'s service improvement budget.'},
  {id:'pop',label:'Population',ph:'e.g. Customers with a repair closed in Q3'},
  {id:'N',label:'Population size',type:'number',min:1,hint:'Optional. Used for the finite-population correction.'},
  {id:'method',label:'Method',type:'select',opts:['Email or web link','Paper','Phone interview','In person','In-app or point of service']},
  {id:'sent',label:'Invitations sent',type:'number',min:0},
  {id:'resp',label:'Completed responses',type:'number',min:0,hint:'Blank: the largest count among the questions.'},
  {id:'pts',label:'Rating scale points',type:'select',opts:['4','5','6','7']},
  {id:'box',label:'Top and bottom box',type:'select',opts:['Top 1 / bottom 1','Top 2 / bottom 2','Top 3 / bottom 3']},
  {id:'conf',label:'Confidence level',type:'select',opts:['90%','95%','99%']},
  {id:'moe',label:'Margin of error wanted (± points)',type:'number',min:0.1,ph:'5'}]},
 {type:'grid',id:'q',title:'Questions: design check',rows:4,hint:'Write each question as the respondent will see it. For rating questions, give the scale labels from lowest to highest, separated by <b>/</b>. The checks column flags common wording faults; read the explanations below and decide for yourself.',cols:[
  {id:'no',label:'No.',w:46},
  {id:'t',label:'Question as worded',w:300,type:'textarea',rows:1},
  {id:'type',label:'Type',type:'select',opts:['Agreement (Likert)','Satisfaction rating','Frequency','0-10 likelihood (NPS)','Yes / no','Multiple choice','Open text']},
  {id:'lab',label:'Scale labels, low to high',w:240,type:'textarea',rows:1},
  {id:'chk',label:'Checks',calc:function(r,api){ var q=window.TOOL._qc(r,api); return q.length?'<span class="sv-tags">'+q.map(function(x){return '<i class="'+(x[2]?'w':'')+'">'+x[0]+'</i>';}).join('')+'</span>':(r.t?'<span class="sv-ok">none</span>':''); }}]},
 {type:'custom',id:'qc',title:'Wording checks explained',html:'<div class="out sv-qout"></div>'},
 {type:'grid',id:'r',title:'Rating responses: counts per scale point',rows:3,hint:'One row per rating question: how many respondents chose each point, 1 = lowest. Use as many columns as the scale has points; leave the rest blank. Counts, not percentages.',cols:[
  {id:'no',label:'Q no.',w:46},
  {id:'lab',label:'Short label',w:170},
  {id:'c1',label:'1',type:'number',min:0},{id:'c2',label:'2',type:'number',min:0},{id:'c3',label:'3',type:'number',min:0},{id:'c4',label:'4',type:'number',min:0},{id:'c5',label:'5',type:'number',min:0},{id:'c6',label:'6',type:'number',min:0},{id:'c7',label:'7',type:'number',min:0},
  {id:'n',label:'n',calc:function(r,api){ var s=window.TOOL._st(r,api); return s?s.n:''; }}]},
 {type:'custom',id:'res',title:'Rating results',hint:'Mean and standard deviation treat the scale as equally spaced; the median and the box scores do not, and are the safer summary for ordinal data. The margin of error is for the top-box percentage.',html:'<div class="tgw"><table class="mv sv-t"></table></div><div class="svgw sv-div"></div>'},
 {type:'grid',id:'np',title:'Net promoter: counts of 0 to 10 answers',rows:2,hint:'"How likely are you to recommend us to a friend or colleague?" One row per segment (for example by product line or channel); counts of each answer 0 to 10.',cols:[
  {id:'seg',label:'Segment',w:150},
  {id:'s0',label:'0',type:'number',min:0},{id:'s1',label:'1',type:'number',min:0},{id:'s2',label:'2',type:'number',min:0},{id:'s3',label:'3',type:'number',min:0},{id:'s4',label:'4',type:'number',min:0},{id:'s5',label:'5',type:'number',min:0},{id:'s6',label:'6',type:'number',min:0},{id:'s7',label:'7',type:'number',min:0},{id:'s8',label:'8',type:'number',min:0},{id:'s9',label:'9',type:'number',min:0},{id:'s10',label:'10',type:'number',min:0}]},
 {type:'custom',id:'nps',title:'Net promoter score',hint:'Promoters answer 9 or 10, passives 7 or 8, detractors 0 to 6. NPS = % promoters &minus; % detractors, from &minus;100 to +100.',html:'<div class="tgw"><table class="mv sv-nt"></table></div><div class="svgw sv-nsvg"></div>'},
 {type:'custom',id:'chk',title:'What the results say',html:'<div class="stat sv-stat"></div><div class="out sv-out"></div>'}
],
_z:function(api){ return {'90%':1.6448536,'99%':2.5758293}[api.state().f.conf]||1.9599640; },
_k:function(api){ var k=parseInt(api.state().f.pts,10); return k>=4&&k<=7?k:5; },
_b:function(api){ var m=/Top (\d)/.exec(api.state().f.box||''); return m?+m[1]:2; },
_qc:function(r,api){
 var t=String(r.t||''), lc=' '+t.toLowerCase().replace(/[’']/g,'\'')+' ', out=[], type=r.type||'';
 if(!t.trim()) return out;
 if(/\band\/or\b/.test(lc)||(/\b(and|or)\b/.test(lc)&&type!=='Multiple choice'&&type!=='Open text'&&type!=='0-10 likelihood (NPS)')) out.push(['double-barreled?','asks about two things joined by "and" or "or". A respondent who likes one and not the other cannot answer. Split it, unless the two words name one thing.',1]);
 if(/\b(don't you|wouldn't you|isn't it|aren't you|didn't you|do you agree that|how (much|great|good|helpful|excellent|wonderful) (was|were|is|did)|most (people|customers)|everyone (knows|agrees)|as you know)\b/.test(lc)||/\b(excellent|wonderful|amazing|outstanding|award-winning|friendly|great)\b/.test(lc)) out.push(['leading','suggests the answer the asker wants, by praising the thing rated or by telling the respondent what others think. Ask neutrally: "How would you rate&hellip;".',1]);
 if(/\b(waste[sd]?|wasteful|fail(ed|ure)?|terrible|awful|outrageous|careless|lazy|ripped off|forced|incompetent|unacceptable|still)\b/.test(lc)) out.push(['loaded','uses an emotionally charged word or assumes something about the respondent ("still", "failed"). Remove the charge or the assumption.',1]);
 if(/\b(always|never|all|every|everyone|everything|ever|none|nobody|nothing)\b/.test(lc)) out.push(['absolute','contains an absolute word (always, never, all, every). Few people can agree to an absolute, so answers pile up at "disagree" for the wrong reason.',1]);
 if((type==='Agreement (Likert)'||type==='')&&(/\b(not|no|never)\b/.test(lc)||/n't\b/.test(lc))) out.push(['negative','is worded negatively. Disagreeing with a negative statement is a double negative, and respondents misread it.',0]);
 var acr=t.match(/\b[A-Z]{2,6}s?\b/g); if(acr) out.push(['jargon?','uses '+acr.map(api.esc).join(', ')+'. Will every respondent know it? Spell it out.',0]);
 if(t.split(/\s+/).length>25) out.push(['long','is over 25 words. Shorter questions get more careful answers.',0]);
 var labs=String(r.lab||'').split(/\s*[\/|]\s*/).filter(Boolean);
 if(labs.length>1){
  var neg=0,pos=0,neu=0; labs.forEach(function(l){ l=l.toLowerCase();
   if(/neither|neutral|average|about the same|undecided|sometimes|^ok$|fair/.test(l)) neu++;
   else if(/\b(dis|un|not|never|poor|bad|worse|rarely|low|very low|terrible)|dissatisf|disagree|unlikely/.test(l)) neg++;
   else if(/agree|satisf|good|excellent|likely|always|often|better|high|easy|very/.test(l)) pos++; });
  if(pos!==neg&&pos+neg>0) out.push(['unbalanced scale','has '+pos+' positive and '+neg+' negative choices. An unbalanced scale pushes answers toward the side with more choices.',1]);
  var k=window.TOOL._k(api); if(/Agreement|Satisfaction|Frequency/.test(type)&&labs.length!==k) out.push(['scale points','has '+labs.length+' labels, but the survey is set to a '+k+'-point scale.',0]);
 } else if(/Agreement|Satisfaction|Frequency/.test(type)) out.push(['no labels','is a rating question with no scale labels written. Label at least the two ends, and preferably every point.',0]);
 return out; },
_st:function(r,api){ var k=window.TOOL._k(api), c=[], n=0, extra=0; for(var i=1;i<=7;i++){ var v=api.num(r['c'+i]); if(isNaN(v)) v=0; if(i<=k){ c.push(v); n+=v; } else extra+=v; }
 if(!n) return null; var m=0; c.forEach(function(v,i){ m+=(i+1)*v; }); m/=n;
 var ss=0; c.forEach(function(v,i){ ss+=v*(i+1-m)*(i+1-m); }); var sd=n>1?Math.sqrt(ss/(n-1)):NaN;
 var at=function(pos){ var cum=0; for(var i=0;i<k;i++){ cum+=c[i]; if(cum>=pos) return i+1; } return k; };
 var med=n%2?at((n+1)/2):(at(n/2)+at(n/2+1))/2;
 var b=window.TOOL._b(api), top=0, bot=0; for(var j=0;j<b;j++){ top+=c[k-1-j]; bot+=c[j]; }
 var p=top/n, z=window.TOOL._z(api);
 return {c:c,n:n,k:k,mean:m,sd:sd,med:med,top:p,bot:bot/n,moe:z*Math.sqrt(p*(1-p)/n),extra:extra}; },
_nps:function(r,api){ var n=0,P=0,D=0; for(var i=0;i<=10;i++){ var v=api.num(r['s'+i]); if(isNaN(v)) v=0; n+=v; if(i>=9) P+=v; else if(i<=6) D+=v; }
 if(!n) return null; var p=P/n, d=D/n, nps=p-d, v=p+d-nps*nps, se=Math.sqrt(v/n);
 return {n:n,P:P,D:D,p:p,d:d,pa:1-p-d,nps:100*nps,se:100*se,moe:100*window.TOOL._z(api)*se}; },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, esc=api.esc, n=api.num, f=[], z=T._z(api), k=T._k(api), b=T._b(api), pc=function(x,d){return api.fmt(100*x,d==null?1:d)+'%';};
 /* wording checks */
 var Q=S.g.q.filter(function(r){return r.t;}), qf=[];
 Q.forEach(function(r,i){ var id='<b>Q'+esc(r.no||(i+1))+'</b>'; T._qc(r,api).forEach(function(x){ qf.push([x[2]?'warn':'',id+' '+x[1]]); }); });
 if(Q.length&&!qf.length) qf.push(['ok','No wording faults found by the checks. Pilot the survey with five or so real respondents anyway; they find what rules cannot.']);
 if(Q.length) qf.push(['','The checks match words, so they raise false alarms ("and" inside a product name) and miss subtler faults. Treat each as a question to ask, not a verdict.']);
 if(Q.length>25) qf.push(['warn',Q.length+' questions. Long surveys lose respondents part way, and the ones who stay are not typical.']);
 root.querySelector('.sv-qout').innerHTML=api.flags(qf,'Write the questions and the checks appear here.');
 /* rating results */
 var R=S.g.r.map(function(r,i){ return {r:r,i:i,s:T._st(r,api)}; }).filter(function(x){return x.s;});
 var tb=root.querySelector('.sv-t'), dv=root.querySelector('.sv-div');
 if(R.length){
  tb.innerHTML='<thead><tr><th>Question</th><th>n</th><th>Mean</th><th>SD</th><th>Median</th><th>Top '+b+' box</th><th>± MOE</th><th>Bottom '+b+' box</th></tr></thead><tbody>'+R.map(function(x){ var s=x.s; return '<tr><td class="mo"><b>Q'+esc(x.r.no||'?')+'</b> '+esc(x.r.lab||'')+'</td><td class="mt">'+s.n+'</td><td class="mt">'+api.fmt(s.mean,2)+'</td><td class="mt">'+api.fmt(s.sd,2)+'</td><td class="mt">'+api.fmt(s.med,1)+'</td><td class="mt">'+pc(s.top)+'</td><td class="mt">'+api.fmt(100*s.moe,1)+'</td><td class="mt">'+pc(s.bot)+'</td></tr>'; }).join('')+'</tbody>';
  var W=760, L=220, Rr=60, mid=L+(W-L-Rr)/2, sc=(W-L-Rr)/2, rh=30, H=R.length*rh+52, h=Math.floor(k/2), odd=k%2;
  var negP=['#C0392B','#E07B6F','#F2B8B0'].slice(0,h), posP=['#A9C1D9','#4F7AA6','#0F3E68'].slice(3-h);
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Diverging bar chart of rating responses"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  R.forEach(function(x,i){ var s=x.s, y=8+i*rh, lab='Q'+(x.r.no||'?')+' '+(x.r.lab||''); if(lab.length>32) lab=lab.slice(0,31)+'…';
   g+='<text x="'+(L-8)+'" y="'+(y+15)+'" text-anchor="end">'+esc(lab)+'</text>';
   var negW=0; for(var j=0;j<h;j++) negW+=s.c[j]/s.n; if(odd) negW+=s.c[h]/s.n/2;
   var x0=mid-negW*sc;
   s.c.forEach(function(v,j){ var w=v/s.n*sc, col=j<h?negP[j]:(odd&&j===h?'#C6CDD3':posP[j-h-odd]); if(w>0) g+='<rect x="'+x0+'" y="'+(y+3)+'" width="'+w+'" height="18" fill="'+col+'"><title>'+(j+1)+': '+v+' ('+pc(v/s.n)+')</title></rect>'; x0+=w; });
   g+='<text class="ax" x="'+(W-Rr+6)+'" y="'+(y+16)+'" style="fill:#0F3E68">'+api.fmt(100*s.top,0)+'%</text>'; });
  var yb=8+R.length*rh; g+='<line x1="'+mid+'" y1="4" x2="'+mid+'" y2="'+yb+'" stroke="#16273A" stroke-width="1"/>';
  [-100,-50,0,50,100].forEach(function(v){ var xx=mid+v/100*sc; g+='<text class="ax" x="'+xx+'" y="'+(yb+14)+'" text-anchor="middle">'+Math.abs(v)+'%</text>'; });
  g+='<text class="ax" x="'+(mid-8)+'" y="'+(yb+32)+'" text-anchor="end" style="fill:#C0392B">&larr; LOWER RATINGS</text><text class="ax" x="'+(mid+8)+'" y="'+(yb+32)+'" style="fill:#0F3E68">HIGHER RATINGS &rarr;</text><text class="ax" x="'+(W-Rr+6)+'" y="'+(yb+32)+'">TOP '+b+'</text>';
  dv.innerHTML=g+'</svg>'; dv.style.display='';
 } else { tb.innerHTML=''; dv.innerHTML=''; dv.style.display='none'; }
 /* NPS */
 var NP=S.g.np.map(function(r){ return {r:r,s:T._nps(r,api)}; }).filter(function(x){return x.s;}), nt=root.querySelector('.sv-nt'), ns=root.querySelector('.sv-nsvg');
 if(NP.length>1){ var tot={seg:'All segments'}; for(var i=0;i<=10;i++) tot['s'+i]=NP.reduce(function(a,x){var v=n(x.r['s'+i]);return a+(isNaN(v)?0:v);},0); NP.push({r:tot,s:T._nps(tot,api),all:true}); }
 if(NP.length){
  nt.innerHTML='<thead><tr><th>Segment</th><th>n</th><th>Promoters</th><th>Passives</th><th>Detractors</th><th>NPS</th><th>± MOE</th><th>Interval</th></tr></thead><tbody>'+NP.map(function(x){ var s=x.s; return '<tr'+(x.all?' class="sv-all"':'')+'><td class="mo">'+esc(x.r.seg||'(unnamed)')+'</td><td class="mt">'+s.n+'</td><td class="mt">'+pc(s.p)+'</td><td class="mt">'+pc(s.pa)+'</td><td class="mt">'+pc(s.d)+'</td><td class="mt">'+api.fmt(s.nps,1)+'</td><td class="mt">'+api.fmt(s.moe,1)+'</td><td class="mt">'+api.fmt(Math.max(-100,s.nps-s.moe),1)+' to '+api.fmt(Math.min(100,s.nps+s.moe),1)+'</td></tr>'; }).join('')+'</tbody>';
  var W2=760, L2=170, R2=70, sc2=W2-L2-R2, rh2=30, H2=NP.length*rh2+40;
  var g2='<svg viewBox="0 0 '+W2+' '+H2+'" role="img" aria-label="Promoters, passives and detractors by segment"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:700 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
  NP.forEach(function(x,i){ var s=x.s, y=6+i*rh2, lab=String(x.r.seg||'(unnamed)'); if(lab.length>24) lab=lab.slice(0,23)+'…';
   g2+='<text x="'+(L2-8)+'" y="'+(y+15)+'" text-anchor="end"'+(x.all?' style="font-weight:700"':'')+'>'+esc(lab)+'</text>';
   g2+='<rect x="'+L2+'" y="'+(y+3)+'" width="'+(s.d*sc2)+'" height="18" fill="#C0392B"/><rect x="'+(L2+s.d*sc2)+'" y="'+(y+3)+'" width="'+(s.pa*sc2)+'" height="18" fill="#C6CDD3"/><rect x="'+(L2+(s.d+s.pa)*sc2)+'" y="'+(y+3)+'" width="'+(s.p*sc2)+'" height="18" fill="#0F3E68"/>';
   g2+='<text class="v" x="'+(W2-R2+8)+'" y="'+(y+16)+'">'+(s.nps>0?'+':'')+api.fmt(s.nps,0)+'</text>'; });
  var yb2=6+NP.length*rh2; g2+='<text class="ax" x="'+L2+'" y="'+(yb2+16)+'" style="fill:#C0392B">DETRACTORS 0-6</text><text class="ax" x="'+(L2+sc2/2)+'" y="'+(yb2+16)+'" text-anchor="middle">PASSIVES 7-8</text><text class="ax" x="'+(L2+sc2)+'" y="'+(yb2+16)+'" text-anchor="end" style="fill:#0F3E68">PROMOTERS 9-10</text><text class="ax" x="'+(W2-R2+8)+'" y="'+(yb2+16)+'">NPS</text>';
  ns.innerHTML=g2+'</svg>'; ns.style.display='';
 } else { nt.innerHTML=''; ns.innerHTML=''; ns.style.display='none'; }
 /* stats and conclusions */
 var maxN=R.reduce(function(a,x){return Math.max(a,x.s.n);},0);
 var npsAll=NP.length?NP[NP.length-1].s:null; if(npsAll) maxN=Math.max(maxN,npsAll.n);
 var resp=n(F.resp); if(isNaN(resp)) resp=maxN; var sent=n(F.sent), rr=sent>0&&resp>=0?resp/sent:NaN;
 var E=n(F.moe); if(!(E>0)) E=5; var N=n(F.N), n0=z*z*0.25/Math.pow(E/100,2), need=Math.ceil(N>0?n0/(1+(n0-1)/N):n0);
 var h='';
 if(R.length||NP.length) h='<div><b>'+(resp||0)+'</b><span>Responses</span></div><div><b>'+(isNaN(rr)?'—':pc(rr,0))+'</b><span>Response rate</span></div><div><b>'+need+'</b><span>Needed for ± '+api.fmt(E,1)+' points at '+(F.conf||'95%')+'</span></div>'+(npsAll?'<div><b>'+(npsAll.nps>0?'+':'')+api.fmt(npsAll.nps,1)+'</b><span>NPS ± '+api.fmt(npsAll.moe,1)+'</span></div>':'');
 root.querySelector('.sv-stat').innerHTML=h;
 if(!R.length&&!NP.length){ root.querySelector('.sv-out').innerHTML=api.flags([],'Enter response counts and the results appear here.'); return; }
 if(!F.purpose) f.push(['warn','No decision named. A survey with no decision behind it produces numbers nobody acts on.']);
 if(!isNaN(rr)){ if(rr>1) f.push(['warn','More responses than invitations. Check the counts.']); else if(rr<0.3) f.push(['warn','Response rate '+pc(rr,0)+'. People who answer can differ from those who do not (non-response bias): very pleased and very unhappy customers are the most likely to reply. Compare early and late responders, or follow up a sample of non-responders.']); else f.push(['','Response rate '+pc(rr,0)+'.']); }
 if(resp>0&&resp<need) f.push(['','With '+resp+' responses the margin of error on a percentage near 50% is about ± '+api.fmt(100*z*Math.sqrt(0.25/resp)*(N>resp?Math.sqrt((N-resp)/(N-1)):1),1)+' points; '+need+' are needed for ± '+api.fmt(E,1)+'.']);
 var ext=R.filter(function(x){return x.s.extra>0;}); if(ext.length) f.push(['warn','Counts entered beyond point '+k+' (the scale is set to '+k+' points) for '+ext.map(function(x){return 'Q'+esc(x.r.no||'?');}).join(', ')+'. They are left out.']);
 if(R.length){
  var srt=R.slice().sort(function(a,c){return c.s.bot-a.s.bot;}), worst=srt[0], best=R.slice().sort(function(a,c){return c.s.top-a.s.top;})[0];
  f.push(['','Highest top-'+b+'-box: <b>Q'+esc(best.r.no||'?')+' '+esc(best.r.lab||'')+'</b> ('+pc(best.s.top)+'). Highest bottom-'+b+'-box: <b>Q'+esc(worst.r.no||'?')+' '+esc(worst.r.lab||'')+'</b> ('+pc(worst.s.bot)+').']);
  R.forEach(function(x){ var s=x.s, id='<b>Q'+esc(x.r.no||'?')+'</b>';
   if(s.bot>=0.2) f.push(['warn',id+': '+pc(s.bot)+' chose the bottom '+b+'. That is a clear group of unhappy respondents; read their comments before looking at the mean.']);
   if(s.n<30) f.push(['',id+' has only '+s.n+' answers; the top-box margin of error (± '+api.fmt(100*s.moe,1)+' points) is wide and the normal approximation is rough.']);
   if(s.sd>=1.2&&s.n>=10&&k<=5) f.push(['',id+': standard deviation '+api.fmt(s.sd,2)+'. Opinions are split, so the mean ('+api.fmt(s.mean,2)+') describes almost nobody. The diverging bar shows the split.']); });
  for(var a=0;a<R.length;a++) for(var c2=a+1;c2<R.length;c2++){ var A=R[a].s, B=R[c2].s, se=Math.sqrt(A.moe*A.moe+B.moe*B.moe); if(Math.abs(A.top-B.top)<se&&Math.abs(A.top-B.top)>=0.05) f.push(['','Q'+esc(R[a].r.no||'?')+' and Q'+esc(R[c2].r.no||'?')+' differ by '+api.fmt(100*Math.abs(A.top-B.top),1)+' points in top-box, within the combined margin of error. Do not rank one above the other on this survey alone.']); }
 }
 if(NP.length){ var segs=NP.filter(function(x){return !x.all;});
  if(npsAll) f.push(['','NPS '+(npsAll.nps>0?'+':'')+api.fmt(npsAll.nps,1)+', with a '+(F.conf||'95%')+' interval of '+api.fmt(Math.max(-100,npsAll.nps-npsAll.moe),1)+' to '+api.fmt(Math.min(100,npsAll.nps+npsAll.moe),1)+'. The margin on NPS is wider than on a single percentage because it is the difference of two.']);
  if(segs.length>1){ var hi=segs.slice().sort(function(a,c){return c.s.nps-a.s.nps;}), x1=hi[0], x2=hi[hi.length-1], d=x1.s.nps-x2.s.nps, sed=Math.sqrt(x1.s.se*x1.s.se+x2.s.se*x2.s.se), zz=sed>0?d/sed:0;
   f.push([zz>z?'warn':'','Highest segment <b>'+esc(x1.r.seg||'?')+'</b> ('+api.fmt(x1.s.nps,1)+') against lowest <b>'+esc(x2.r.seg||'?')+'</b> ('+api.fmt(x2.s.nps,1)+'): a gap of '+api.fmt(d,1)+' points, z = '+api.fmt(zz,2)+'. '+(zz>z?'The gap is larger than chance would explain at '+(F.conf||'95%')+' confidence.':'The gap could be chance at '+(F.conf||'95%')+' confidence; collect more responses before acting on it.')]); }
  segs.forEach(function(x){ if(x.s.n<50) f.push(['','<b>'+esc(x.r.seg||'?')+'</b> has '+x.s.n+' answers; its NPS is uncertain by ± '+api.fmt(x.s.moe,1)+' points.']); });
 }
 f.push(['','A score tells you how many are unhappy, not why. Pair each rating with an open question, and close the loop with the respondents who asked for contact.']);
 root.querySelector('.sv-out').innerHTML=api.flags(f);
},
example:{f:{title:'Post-repair customer survey, third quarter',purpose:'Decide which part of the repair service gets next year\'s improvement budget: turnaround, communication or repair quality.',pop:'Customers whose repair order closed between July and September',N:'2400',method:'Email or web link',sent:'1850',resp:'423',pts:'5',box:'Top 2 / bottom 2',conf:'95%',moe:'5'},
 g:{q:[
  {no:'1',t:'Overall, how satisfied are you with your repair?',type:'Satisfaction rating',lab:'Very dissatisfied / Dissatisfied / Neither / Satisfied / Very satisfied'},
  {no:'2',t:'How satisfied were you with the speed and cost of the repair?',type:'Satisfaction rating',lab:'Very dissatisfied / Dissatisfied / Neither / Satisfied / Very satisfied'},
  {no:'3',t:'Our friendly technicians always explained the work clearly.',type:'Agreement (Likert)',lab:'Strongly disagree / Disagree / Neither / Agree / Strongly agree'},
  {no:'4',t:'The RMA process was easy to follow.',type:'Agreement (Likert)',lab:'Disagree / Neither / Agree / Strongly agree / Very strongly agree'},
  {no:'5',t:'The repaired unit has worked correctly since it came back.',type:'Agreement (Likert)',lab:'Strongly disagree / Disagree / Neither / Agree / Strongly agree'},
  {no:'6',t:'How likely are you to recommend our repair service to a friend or colleague?',type:'0-10 likelihood (NPS)',lab:'0 Not at all likely / 10 Extremely likely'},
  {no:'7',t:'What one thing should we change about the repair service?',type:'Open text',lab:''}],
 r:[
  {no:'1',lab:'Overall satisfaction',c1:'18',c2:'31',c3:'52',c4:'187',c5:'121'},
  {no:'2',lab:'Speed and cost',c1:'41',c2:'78',c3:'96',c4:'131',c5:'60'},
  {no:'3',lab:'Work explained clearly',c1:'12',c2:'25',c3:'61',c4:'175',c5:'133'},
  {no:'5',lab:'Unit works since return',c1:'22',c2:'34',c3:'40',c4:'158',c5:'153'}],
 np:[
  {seg:'Walk-in counter',s0:'3',s1:'2',s2:'3',s3:'5',s4:'6',s5:'10',s6:'12',s7:'22',s8:'31',s9:'34',s10:'40'},
  {seg:'Mail-in',s0:'5',s1:'4',s2:'6',s3:'8',s4:'10',s5:'14',s6:'15',s7:'25',s8:'34',s9:'30',s10:'27'},
  {seg:'On-site field service',s0:'0',s1:'1',s2:'1',s3:'2',s4:'2',s5:'3',s6:'5',s7:'8',s8:'14',s9:'21',s10:'20'}]}}
}
