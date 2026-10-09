{
slug:'hazard-analysis-risk-control',
blankX:function(){ return {m:'AAAARAAARRAARRUARRUUARUUU'}; },
h:{
 SEV:['Negligible','Minor','Serious','Critical','Catastrophic'],
 PRB:['Improbable','Remote','Occasional','Probable','Frequent'],
 OPT:['A','R','U'],
 NAME:{A:'Acceptable',R:'Reduce further',U:'Unacceptable'},
 COL:{A:'#BFE0C9',R:'#F3DC9B',U:'#E9A39B'},
 /* a probability typed as 0.001, 1e-3, 1/1000 or 0.1% */
 p:function(v){ var s=String(v==null?'':v).trim().replace(',','.'); if(!s) return NaN; var m=s.match(/^([\d.eE+-]+)\s*\/\s*([\d.eE+-]+)$/); if(m) return Number(m[1])/Number(m[2]); if(/%$/.test(s)) return Number(s.slice(0,-1))/100; return Number(s); },
 bounds:function(S){ var d=[1e-3,1e-4,1e-5,1e-6], o=[], self=this; ['b5','b4','b3','b2'].forEach(function(k,i){ var x=self.p(S.f[k]); o.push(isNaN(x)||x<=0?d[i]:x); }); return o; },
 /* probability level 1-5 from P; each bound is the lower edge of its level, inclusive */
 lvl:function(P,b){ if(isNaN(P)) return NaN; var t=1-1e-9; return P>=b[0]*t?5:P>=b[1]*t?4:P>=b[2]*t?3:P>=b[3]*t?2:1; },
 sci:function(x){ if(isNaN(x)) return ''; if(x===0) return '0'; if(x>=0.01) return String(Number(x.toPrecision(3))); var e=Math.floor(Math.log10(x)+1e-12), m=x/Math.pow(10,e); if(m>=9.995){ m=1; e++; } var ms=String(Number(m.toFixed(2))); if(ms.indexOf('.')<0) ms+='.0'; return ms+'&times;10<sup><span class="hz-c">^</span>'+String(e).replace('-','&minus;')+'</sup>'; },
 sev:function(v){ var s=Number(String(v==null?'':v).trim()); return (s>=1&&s<=5&&s%1===0)?s:NaN; },
 risk:function(S,P,s){ if(isNaN(P)||isNaN(s)) return ''; return (S.x.m||'')[(P-1)*5+(s-1)]||'A'; },
 row:function(r,S){ var h=this, b=h.bounds(S), p0=h.p(r.p1)*h.p(r.p2), p1=h.p(r.p1b)*h.p(r.p2b), s0=h.sev(r.s), s1=h.sev(r.sb); if(isNaN(s1)&&!isNaN(p1)) s1=s0;
  var L0=h.lvl(p0,b), L1=h.lvl(p1,b); return {p0:p0,p1:p1,L0:L0,L1:L1,s0:s0,s1:s1,r0:h.risk(S,L0,s0),r1:h.risk(S,L1,s1)}; },
 cell:function(k){ return k?'<span class="hz-k hz-'+k+'">'+this.NAME[k]+'</span>':''; }
},
sections:[
 {type:'fields',title:'Device and scope of the analysis',cols:3,hint:'Risk management covers the whole life of the device: design, production, use, servicing and disposal. State the intended use first; reasonably foreseeable misuse is analyzed against it.',fields:[
  {id:'dev',label:'Device',ph:'e.g. HX-7 heated humidifier for home respiratory therapy'},
  {id:'use',label:'Intended use and users',wide:true,ph:'e.g. Warms and humidifies gas from a home ventilator; used by lay caregivers'},
  {id:'rmf',label:'Risk management file',ph:'e.g. RMF-HX7, plan RMP-HX7 rev B'},
  {id:'team',label:'Team',ph:'Roles: design, clinical, quality, service'},
  {id:'date',label:'Date',type:'date'},
  {id:'rev',label:'Revision',ph:'e.g. C'}]},
 {type:'fields',title:'Risk criteria: severity and probability',cols:5,hint:'Agree these in the risk management plan before estimating anything. Write what each severity level means for this device. Probability levels are set by the probability of harm, P = P1 &times; P2; each number below is the lowest probability in that level.',fields:[
  {id:'sd1',label:'S1 Negligible',ph:'Discomfort, no treatment'},
  {id:'sd2',label:'S2 Minor',ph:'Temporary injury, first aid'},
  {id:'sd3',label:'S3 Serious',ph:'Injury needing medical treatment'},
  {id:'sd4',label:'S4 Critical',ph:'Permanent impairment, life-threatening'},
  {id:'sd5',label:'S5 Catastrophic',ph:'Death'},
  {id:'b5',label:'P5 Frequent from',ph:'1e-3'},
  {id:'b4',label:'P4 Probable from',ph:'1e-4'},
  {id:'b3',label:'P3 Occasional from',ph:'1e-5'},
  {id:'b2',label:'P2 Remote from',ph:'1e-6'},
  {id:'per',label:'Probabilities are per',ph:'e.g. device-year of use'}]},
 {type:'custom',id:'mx',title:'Risk acceptability matrix',hint:'Click a cell to change it: <b>Acceptable</b>, <b>Reduce further</b> (reduce as far as practicable and record why no more can be done) or <b>Unacceptable</b> (needs risk control, or a benefit-risk analysis if no further control is practicable). The matrix is your policy; the starting pattern is only an example.',html:'<div class="hz-mx"></div>'},
 {type:'custom',id:'key',title:'Risk control options, in order of priority',html:'<div class="pillrow"><span>1 &middot; INHERENT SAFETY BY DESIGN AND MANUFACTURE</span><span>2 &middot; PROTECTIVE MEASURES IN THE DEVICE OR PROCESS</span><span>3 &middot; INFORMATION FOR SAFETY, AND TRAINING</span></div>'},
 {type:'grid',id:'h',title:'Hazard analysis and risk control',rows:3,hint:'One row per hazardous situation. <b>P1</b> is the probability that the sequence of events leads to the hazardous situation; <b>P2</b> the probability that the hazardous situation leads to the harm. Type them as 0.001, 1e-3, 1/1000 or 0.1%. Severity is 1 to 5. "After" columns are the estimates once the controls are in place; leave S after blank if severity does not change.',cols:[
  {id:'id',label:'ID',w:50},
  {id:'cat',label:'Hazard type',type:'select',opts:['Energy: electrical','Energy: thermal','Energy: mechanical','Energy: radiation','Biological or microbial','Chemical or toxic','Biocompatibility','Wrong or no output','Use error','Information or labeling','Software','Environment or EMC']},
  {id:'haz',label:'Hazard',w:150,type:'textarea',rows:2},
  {id:'seq',label:'Sequence of events',w:200,type:'textarea',rows:2},
  {id:'sit',label:'Hazardous situation',w:180,type:'textarea',rows:2},
  {id:'harm',label:'Harm',w:130,type:'textarea',rows:2},
  {id:'p1',label:'P1',w:70,tip:'Probability the hazardous situation occurs'},
  {id:'p2',label:'P2',w:70,tip:'Probability the hazardous situation leads to harm'},
  {id:'p',label:'P = P1×P2',calc:function(r,api){ var h=window.TOOL.h; return h.sci(h.p(r.p1)*h.p(r.p2)); }},
  {id:'s',label:'S',type:'number',min:1,max:5,tip:'Severity 1-5'},
  {id:'r0',label:'Risk before',calc:function(r,api){ var h=window.TOOL.h, x=h.row(r,api.state()); return isNaN(x.L0)||isNaN(x.s0)?'':'P'+x.L0+' S'+x.s0+'<br>'+h.cell(x.r0); }},
  {id:'ctl',label:'Risk control measures',w:220,type:'textarea',rows:2},
  {id:'ct',label:'Control type',type:'select',opts:['1 Design','2 Protective','3 Information','1 + 2','1 + 3','2 + 3','1 + 2 + 3']},
  {id:'ver',label:'Verification of implementation and effectiveness',w:180,type:'textarea',rows:2},
  {id:'p1b',label:'P1 after',w:70},
  {id:'p2b',label:'P2 after',w:70},
  {id:'pb',label:'P after',calc:function(r,api){ var h=window.TOOL.h; return h.sci(h.p(r.p1b)*h.p(r.p2b)); }},
  {id:'sb',label:'S after',type:'number',min:1,max:5},
  {id:'r1',label:'Risk after',calc:function(r,api){ var h=window.TOOL.h, x=h.row(r,api.state()); return isNaN(x.L1)||isNaN(x.s1)?'':'P'+x.L1+' S'+x.s1+'<br>'+h.cell(x.r1); }},
  {id:'nh',label:'New hazards from the controls?',type:'select',opts:['No','Yes, added as new rows','Not yet assessed']},
  {id:'br',label:'Benefit-risk note',w:200,type:'textarea',rows:2}]},
 {type:'custom',id:'chain',title:'From hazard to harm',hint:'The chain for one row. Pick the row to draw.',html:'<label class="tf hz-pick noprint"><span>Row</span><select data-f="pick" aria-label="Row to draw"></select></label><div class="svgw hz-chain"></div>'},
 {type:'custom',id:'maps',title:'Risk before and after control',hint:'Each ID sits in the cell for its probability level and severity, colored by your matrix.',html:'<div class="hz-maps"><div class="svgw hz-before"></div><div class="svgw hz-after"></div></div>'},
 {type:'fields',title:'Overall residual risk',cols:3,hint:'After every risk is controlled, judge the residual risks together, against the benefits of the intended use. Significant residual risks are disclosed to users.',fields:[
  {id:'ov',label:'Overall residual risk',type:'select',opts:['Acceptable','Acceptable: benefits outweigh the residual risk','Not acceptable','Not yet evaluated']},
  {id:'disc',label:'Residual risks disclosed in the instructions for use?',type:'select',opts:['Yes','No','Not yet']},
  {id:'appr',label:'Approved by, date',ph:'Role and date'},
  {id:'ovn',label:'Rationale',type:'textarea',wide:true,ph:'e.g. Clinical benefit of humidified gas, compared with similar devices on the market and published data'}]},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="stat hz-stat"></div><div class="out hz-out"></div>'}
],
update:function(root,api){
 var S=api.state(), h=window.TOOL.h, f=[], m=S.x.m||'';
 if(m.length!==25){ m=S.x.m='AAAARAAARRAARRUARRUUARUUU'; }
 /* the clickable matrix */
 var mx=root.querySelector('.hz-mx');
 if(mx){ var t='<table class="hz-mt"><tbody>';
  for(var P=5;P>=1;P--){ t+='<tr><th scope="row">P'+P+'<span class="hz-nm"> '+h.PRB[P-1]+'</span></th>'; for(var s=1;s<=5;s++){ var k=m[(P-1)*5+s-1]; t+='<td><button type="button" class="hz-btn hz-'+k+'" data-mx="'+((P-1)*5+s-1)+'" aria-label="P'+P+' S'+s+': '+h.NAME[k]+'"><span class="hz-nm">'+h.NAME[k]+'</span><span class="hz-sh">'+k+'</span></button></td>'; } t+='</tr>'; }
  t+='<tr><th></th>'; for(var s2=1;s2<=5;s2++) t+='<th scope="col">S'+s2+'<span class="hz-nm"> '+h.SEV[s2-1]+'</span></th>'; t+='</tr></tbody></table>';
  mx.innerHTML=t+'<p class="hz-key"><span class="hz-k hz-A">A &middot; Acceptable</span> <span class="hz-k hz-R">R &middot; Reduce further</span> <span class="hz-k hz-U">U &middot; Unacceptable</span></p>';
  if(!mx.dataset.on){ mx.dataset.on='1'; mx.addEventListener('click',function(e){ var b=e.target.closest('[data-mx]'); if(!b) return; var i=+b.dataset.mx, cur=S.x.m, k=h.OPT[(h.OPT.indexOf(cur[i])+1)%3]; S.x.m=cur.slice(0,i)+k+cur.slice(i+1); api.save(); }); } }
 var b=h.bounds(S);
 if(!(b[0]>b[1]&&b[1]>b[2]&&b[2]>b[3])) f.push(['warn','The probability levels must fall in order: P5 above P4 above P3 above P2.']);
 /* matrix sanity: risk should not get better as severity or probability rises */
 var rank={A:0,R:1,U:2}, mono=true; for(var P2=1;P2<=5;P2++) for(var s3=1;s3<=5;s3++){ var c=rank[m[(P2-1)*5+s3-1]]; if(s3<5&&rank[m[(P2-1)*5+s3]]<c) mono=false; if(P2<5&&rank[m[P2*5+s3-1]]<c) mono=false; }
 if(!mono) f.push(['warn','In your matrix a cell is rated better than a cell with lower severity or lower probability. Check the matrix; a higher risk should never be easier to accept.']);
 var rows=S.g.h.map(function(r,i){ var x=h.row(r,S); x.r=r; x.i=i; x.id=(r.id||'').trim()||('row '+(i+1)); return x; }).filter(function(x){ return x.r.haz||x.r.sit||x.r.harm||x.r.id; });
 var trs=root.querySelectorAll('table[data-grid="h"] tbody tr');
 S.g.h.forEach(function(r,i){ var x=h.row(r,S); if(trs[i]) trs[i].classList.toggle('hi-row',(x.r1||x.r0)==='U'); });
 /* chain picture */
 var pick=root.querySelector('[data-f="pick"]');
 if(pick){ var cur=S.f.pick; if(!rows.some(function(x){ return x.id===cur; })) cur=rows.length?rows[0].id:''; pick.innerHTML=rows.map(function(x){ return '<option'+(x.id===cur?' selected':'')+'>'+api.esc(x.id)+'</option>'; }).join(''); }
 var sel=rows.filter(function(x){ return x.id===(pick?pick.value:''); })[0], ch=root.querySelector('.hz-chain');
 function wrap(s,x,y,max,n){ var w=String(s||'').split(/\s+/).filter(Boolean), L=[], c=''; w.forEach(function(q){ if((c+' '+q).trim().length>max&&c){ L.push(c); c=q; } else c=(c+' '+q).trim(); }); if(c) L.push(c); if(L.length>n){ L=L.slice(0,n); L[n-1]=L[n-1].slice(0,max-1)+'…'; } return L.map(function(l,i){ return '<text x="'+x+'" y="'+(y+i*14)+'">'+api.esc(l)+'</text>'; }).join(''); }
 function plain(x){ return h.sci(x).replace(/<span[^>]*>\^<\/span>/,'').replace(/<sup>(.*)<\/sup>/,'<tspan baseline-shift="super" font-size="9">$1</tspan>'); }
 if(ch){ if(!sel){ ch.innerHTML='<p style="padding:10px">Add a row to see its chain.</p>'; } else {
  var r=sel.r, BW=170, G=26, X=[10,10+BW+G,10+2*(BW+G),10+3*(BW+G)], W=X[3]+BW+10, H=250, g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Hazard to harm chain"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.hd{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.08em}.pp{font:700 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}.big{font:800 13px Archivo,sans-serif;fill:#0F3E68}</style><defs><marker id="hzar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#4A5D71"/></marker></defs>';
  var box=[['HAZARD',(r.haz||'')+(r.cat?' ('+r.cat.toLowerCase()+')':'')],['SEQUENCE OF EVENTS',r.seq],['HAZARDOUS SITUATION',r.sit],['HARM',r.harm]];
  box.forEach(function(bx,i){ var red=i===3; g+='<rect x="'+X[i]+'" y="30" width="'+BW+'" height="118" rx="3" fill="'+(red?'#FDECEA':i===2?'#FBF5E3':'#fff')+'" stroke="'+(red?'#C0392B':i===2?'#9C7C1F':'#0F3E68')+'" stroke-width="1.6"/><text class="hd" x="'+(X[i]+8)+'" y="22">'+bx[0]+'</text>'+wrap(bx[1],X[i]+8,50,25,7);
   if(i<3) g+='<line x1="'+(X[i]+BW+2)+'" y1="89" x2="'+(X[i+1]-3)+'" y2="89" stroke="#4A5D71" stroke-width="1.6" marker-end="url(#hzar)"/>'; });
  g+='<text class="pp" x="'+(X[2]-G/2)+'" y="166" text-anchor="middle">P1 = '+api.esc(r.p1||'?')+'</text><text class="pp" x="'+(X[3]-G/2)+'" y="166" text-anchor="middle">P2 = '+api.esc(r.p2||'?')+'</text>';
  g+='<path d="M'+(X[2]-G/2)+' 172 V184 H'+(X[3]-G/2)+' V172" fill="none" stroke="#9C7C1F" stroke-width="1.4"/>';
  g+='<text class="big" x="'+(X[2]+BW/2+G/2)+'" y="204" text-anchor="middle">P = P1 &times; P2 = '+(isNaN(sel.p0)?'?':plain(sel.p0))+(isNaN(sel.L0)?'':'  (P'+sel.L0+' '+h.PRB[sel.L0-1]+')')+'</text>';
  g+='<text class="big" x="'+(X[3]+BW/2)+'" y="170" text-anchor="middle">'+(isNaN(sel.s0)?'S ?':'S'+sel.s0+' '+h.SEV[sel.s0-1])+'</text>';
  var rb=sel.r0?h.NAME[sel.r0]:'not estimated', ra=sel.r1?h.NAME[sel.r1]:'not estimated';
  g+='<rect x="10" y="218" width="'+(W-20)+'" height="24" fill="#F4F6F8"/><text x="18" y="234"><tspan class="hd">RISK BEFORE CONTROL </tspan><tspan font-weight="700" fill="'+(sel.r0==='U'?'#C0392B':'#0F3E68')+'">'+rb+'</tspan><tspan class="hd">   &#8594;   AFTER </tspan><tspan font-weight="700" fill="'+(sel.r1==='U'?'#C0392B':'#0F3E68')+'">'+ra+(isNaN(sel.p1)?'':'  (P = '+plain(sel.p1)+', P'+sel.L1+' S'+sel.s1+')')+'</tspan></text>';
  ch.innerHTML=g+'</svg>'; } }
 /* before and after maps */
 function map(after,title){ var C=56, L=96, T=24, W=L+5*C+10, H=T+5*C+56, g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+title+'"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.t{font:800 12px Archivo,sans-serif;fill:#0F3E68}.id{font:700 10px \'IBM Plex Mono\',monospace;fill:#16273A}</style><text class="t" x="'+(L+2.5*C)+'" y="14" text-anchor="middle">'+title+'</text>';
  for(var P=5;P>=1;P--) for(var s=1;s<=5;s++){ g+='<rect x="'+(L+(s-1)*C)+'" y="'+(T+(5-P)*C)+'" width="'+C+'" height="'+C+'" fill="'+h.COL[m[(P-1)*5+s-1]]+'" stroke="#fff" stroke-width="2"/>'; }
  for(var k=1;k<=5;k++) g+='<text class="ax" x="'+(L-6)+'" y="'+(T+(5-k)*C+C/2+3)+'" text-anchor="end">P'+k+' '+h.PRB[k-1].toUpperCase()+'</text><text class="ax" x="'+(L+(k-1)*C+C/2)+'" y="'+(T+5*C+14)+'" text-anchor="middle">S'+k+'</text>';
  g+='<text class="ax" x="'+(L+2.5*C)+'" y="'+(T+5*C+32)+'" text-anchor="middle">SEVERITY &#8594;</text>';
  var cell={}; rows.forEach(function(x){ var P=after?x.L1:x.L0, s=after?x.s1:x.s0; if(P>=1&&s>=1) (cell[P+','+s]=cell[P+','+s]||[]).push(x.id); });
  Object.keys(cell).forEach(function(key){ var p=key.split(','), P=+p[0], s=+p[1], list=cell[key], x=L+(s-1)*C, y=T+(5-P)*C;
   list.slice(0,4).forEach(function(id,j){ g+='<text class="id" x="'+(x+C/2)+'" y="'+(y+14+j*12)+'" text-anchor="middle">'+api.esc(id.length>7?id.slice(0,6)+'…':id)+'</text>'; });
   if(list.length>4) g+='<text class="id" x="'+(x+C/2)+'" y="'+(y+C-4)+'" text-anchor="middle">+'+(list.length-4)+'</text>'; });
  return g+'</svg>'; }
 var ma=root.querySelector('.hz-before'), mb=root.querySelector('.hz-after');
 if(ma) ma.innerHTML=map(false,'BEFORE RISK CONTROL'); if(mb) mb.innerHTML=map(true,'AFTER RISK CONTROL');
 /* checks */
 var c0={A:0,R:0,U:0}, c1={A:0,R:0,U:0};
 rows.forEach(function(x){ var r=x.r, id='<b>'+api.esc(x.id)+'</b>';
  if(x.r0) c0[x.r0]++; if(x.r1) c1[x.r1]++;
  var probs=[['P1',r.p1],['P2',r.p2],['P1 after',r.p1b],['P2 after',r.p2b]].filter(function(q){ var v=h.p(q[1]); return String(q[1]||'').trim()!==''&&(isNaN(v)||v<=0||v>1); });
  if(probs.length) f.push(['warn',id+': '+probs.map(function(q){ return q[0]; }).join(', ')+' must be a probability above 0 and no more than 1.']);
  if((r.s||r.sb)&&((r.s&&isNaN(h.sev(r.s)))||(r.sb&&isNaN(h.sev(r.sb))))) f.push(['warn',id+': severity must be a whole number from 1 to 5.']);
  if(!x.r0){ f.push(['warn',id+': the risk before control is not estimated yet. It needs P1, P2 and S.']); return; }
  if(x.r0!=='A'&&!r.ctl) f.push(['warn',id+' is '+h.NAME[x.r0].toLowerCase()+' before control and has no risk control measure.']);
  if(r.ctl&&!r.ct) f.push(['warn',id+': record the control type, so the order of priority can be checked.']);
  if(r.ctl&&r.ct==='3 Information'&&x.r0==='U') f.push(['warn',id+' was unacceptable and is controlled only by information for safety. Information is the last option: record why a design change or a protective measure was not practicable.']);
  if(r.ctl&&!r.ver) f.push(['warn',id+': no verification recorded. Each control needs evidence that it was implemented and that it works.']);
  if(r.ctl&&!x.r1) f.push(['warn',id+': estimate the risk after control (P1 after, P2 after).']);
  if(r.ctl&&(!r.nh||r.nh==='Not yet assessed')) f.push(['',id+': check whether the control introduces a new hazard or changes another risk, and record the answer.']);
  if(x.r1){
   if(x.p1>x.p0*(1+1e-9)) f.push(['warn',id+': the probability after control is higher than before. Check P1 and P2.']);
   if(x.s1>x.s0) f.push(['warn',id+': severity after control is higher than before. Check S after.']);
   else if(x.s1<x.s0&&!/1/.test(r.ct||'')) f.push(['',id+': severity drops from S'+x.s0+' to S'+x.s1+' without a design control. Warnings and guards usually lower the probability of harm, not the severity of the harm itself; check the claim.']);
   if(x.r1==='U') f.push(['warn',id+' is still unacceptable after control. Add controls; if none is practicable, a benefit-risk analysis must show the medical benefit outweighs this risk'+(r.br?'.':', and none is recorded.')]);
   else if(x.r1==='R'&&!r.br) f.push(['',id+' is in the reduce-further region after control. Record why no further control is practicable; the benefit-risk note is empty.']); } });
 var unacc=rows.filter(function(x){ return x.r1==='U'||(!x.r1&&x.r0==='U'); }).length;
 if(rows.length&&/^Acceptable/.test(S.f.ov||'')&&unacc) f.push(['warn','The overall residual risk is marked acceptable while '+unacc+' risk'+(unacc>1?'s are':' is')+' still unacceptable. Resolve each one first.']);
 if(rows.length&&S.f.ov&&/^Acceptable/.test(S.f.ov)&&S.f.disc!=='Yes') f.push(['','Residual risks that matter to users should be disclosed in the instructions for use. Mark the disclosure when it is done.']);
 if(rows.length&&!f.some(function(q){ return q[0]==='warn'; })) f.push(['ok','Every row is estimated, controlled where needed and verified, and none is unacceptable after control.']);
 var st=root.querySelector('.hz-stat');
 if(st) st.innerHTML='<div><b>'+rows.length+'</b><span>Hazardous situations</span></div><div><b>'+c0.U+' &rarr; '+c1.U+'</b><span>Unacceptable, before &rarr; after</span></div><div><b>'+c0.R+' &rarr; '+c1.R+'</b><span>Reduce further</span></div><div><b>'+c0.A+' &rarr; '+c1.A+'</b><span>Acceptable</span></div><div><b>'+api.esc((S.f.ov||'Not set').split(':')[0])+'</b><span>Overall residual risk</span></div>';
 root.querySelector('.hz-out').innerHTML=api.flags(f,'Add hazardous situations and estimate them, and the checks appear here.');
},
example:{f:{dev:'HX-7 heated humidifier for home respiratory therapy (fictional)',use:'Warms and humidifies breathing gas from a home ventilator, for adults; set up and cleaned by lay caregivers',rmf:'RMF-HX7; plan RMP-HX7 rev B',team:'Design lead, clinical specialist, quality engineer, service lead',date:'2026-09-22',rev:'C',
 sd1:'Discomfort, no treatment',sd2:'Temporary injury, first aid only',sd3:'Injury needing medical treatment',sd4:'Permanent impairment or life-threatening',sd5:'Death',b5:'1e-3',b4:'1e-4',b3:'1e-5',b2:'1e-6',per:'device-year of use',pick:'H1',
 ov:'Acceptable: benefits outweigh the residual risk',disc:'Yes',appr:'Quality director, 2026-09-29',ovn:'Humidified gas prevents airway drying and mucus plugging in long-term ventilated patients. Residual risks H1 and H2 are at or below those of comparable humidifiers in published field data, and both are disclosed in the instructions for use.'},
 x:{m:'AAAARAAARRAARRUARRUUARUUU'},
 g:{h:[
  {id:'H1',cat:'Energy: thermal',haz:'Heater plate at up to 120 °C',seq:'Heater control triac fails short; the chamber runs low on water and the gas outlet temperature climbs',sit:'Patient breathes gas above 43 °C',harm:'Thermal injury to the airway',p1:'1e-3',p2:'0.1',s:'4',ctl:'Independent hardware cutoff opens the heater circuit at 41 °C gas temperature; audible and visual over-temperature alarm',ct:'2 Protective',ver:'Single-fault test TR-118 (pass, 20 of 20); alarm verification VR-31',p1b:'1e-5',p2b:'0.1',sb:'',nh:'No',br:'A second redundant cutoff was assessed and adds a failure mode (nuisance trips stopping humidification). Residual risk disclosed in the IFU.'},
  {id:'H2',cat:'Energy: electrical',haz:'Mains voltage inside the base',seq:'Power cord damaged by the bed frame; caregiver handles the device with wet hands',sit:'Caregiver touches live conductive parts',harm:'Electric shock',p1:'1e-4',p2:'0.01',s:'5',ctl:'Double-insulated enclosure; strain relief and cord guard; medical-grade external power supply',ct:'1 + 2',ver:'Electrical safety type test ES-HX7 (pass); cord flex test 10,000 cycles',p1b:'1e-6',p2b:'0.01',sb:'',nh:'No',br:'Remaining risk comes from abuse of the cord; covered by the inspection step in the IFU.'},
  {id:'H3',cat:'Biological or microbial',haz:'Bacteria growing in standing water',seq:'Chamber refilled with tap water and not cleaned for several days',sit:'Patient inhales contaminated aerosol',harm:'Respiratory infection',p1:'0.05',p2:'0.02',s:'3',ctl:'IFU and chamber label: use distilled water, empty and clean daily; cleaning step in caregiver training',ct:'3 Information',ver:'Label comprehension test UT-07, 14 of 15 users correct',p1b:'0.01',p2b:'0.02',sb:'',nh:'No',br:''},
  {id:'H4',cat:'Use error',haz:'Wrong therapy mode selected',seq:'Caregiver selects mask mode while the patient is on an invasive circuit',sit:'Patient receives gas below the humidity needed',harm:'Airway drying, thick secretions',p1:'0.01',p2:'0.1',s:'2',ctl:'Mode set automatically from the coded circuit connector; manual override needs a two-step confirm',ct:'1 Design',ver:'Summative usability study US-HX7-02 (no use errors on this task)',p1b:'1e-4',p2b:'0.1',sb:'',nh:'Not yet assessed',br:''},
  {id:'H5',cat:'Energy: mechanical',haz:'Hot water in an unstable unit',seq:'Unit placed on a soft surface is knocked by the patient circuit',sit:'Hot water spills onto the patient',harm:'Scald',p1:'1e-3',p2:'0.05',s:'3',ctl:'Weighted, wide base; chamber locks into the base; spill-proof lid',ct:'1 + 2',ver:'Tip test at 10° (pass), drop test DT-4',p1b:'1e-4',p2b:'0.05',sb:'',nh:'No',br:''}]}}
}
