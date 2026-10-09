{
slug:'imte-accuracy-specification',
h:{
 spec:function(api){ var S=api.state(), n=api.num, z=function(v){ v=n(v); return isNaN(v)?0:v; };
  var ppm=/ppm/.test(S.f.rel||''), sc=ppm?1e-6:1e-2;
  var o={rd:z(S.f.rd)*sc, rg:z(S.f.rg)*sc, R:n(S.f.rng), res:n(S.f.res), cnt:z(S.f.cnt), fx:z(S.f.fx), fl:z(S.f.fl), ppm:ppm, un:S.f.un||''};
  o.ok=(o.rd>0||o.rg>0||o.cnt>0||o.fx>0||o.fl>0); o.rgOk=!(o.rg>0)||o.R>0; o.cntOk=!(o.cnt>0)||o.res>0;
  o.dec=o.res>0?Math.min(Math.max(window.TOOL.h.decs(o.res)+1,1),9):NaN; return o; },
 decs:function(x){ var s=String(x); if(/e-/.test(s)) return +s.split('e-')[1]+((s.split('e')[0].split('.')[1]||'').length); return (s.split('.')[1]||'').length; },
 terms:function(o,x){ var a=o.rd*Math.abs(x), b=o.rg>0&&o.R>0?o.rg*o.R:0, c=o.cnt>0&&o.res>0?o.cnt*o.res:0, d=o.fx, s=a+b+c+d; return {a:a,b:b,c:c,d:d,sum:s,E:Math.max(s,o.fl),floor:o.fl>s}; },
 f:function(o,x){ if(!isFinite(x)) return '—'; if(!isNaN(o.dec)) return x.toFixed(o.dec); return Number(x.toPrecision(6)).toString(); },
 g:function(x){ if(!isFinite(x)) return '—'; if(x===0) return '0'; return Number(x.toPrecision(4)).toString(); },
 pt:function(r,api){ var h=window.TOOL.h, o=h.spec(api), x=api.num(r.nom); if(!o.ok||isNaN(x)) return null; var t=h.terms(o,x), y=api.num(r.rd), p={o:o,x:x,E:t.E,lo:x-t.E,hi:x+t.E,t:t};
  if(!isNaN(y)){ p.y=y; p.err=y-x; p.pass=Math.abs(p.err)<=t.E*(1+1e-12)+1e-15; } return p; }
},
sections:[
 {type:'fields',title:'Instrument and specification',cols:3,hint:'Copy the accuracy specification from the data sheet: &plusmn;(% of reading + % of range or full scale + counts) + any fixed term. Leave out the terms the specification does not have. Note the qualifiers too: the period (for example 1 year since calibration) and the temperature band the figures apply in.',fields:[
  {id:'ins',label:'Instrument, function and range',wide:true,ph:'e.g. Handheld multimeter, DC voltage, 20 V range'},
  {id:'un',label:'Units',ph:'V'},
  {id:'rng',label:'Range or full-scale value',type:'number',min:0,hint:'The value the % of range term is a percentage of.'},
  {id:'rel',label:'Relative terms given in',type:'select',opts:['Percent (%)','Parts per million (ppm)']},
  {id:'rd',label:'± of reading',type:'number',min:0,hint:'% or ppm of the reading (gain or scale term).'},
  {id:'rg',label:'± of range or full scale',type:'number',min:0,hint:'% or ppm of range (offset term).'},
  {id:'res',label:'Resolution (one count)',type:'number',min:0,hint:'The smallest step the display shows on this range.'},
  {id:'cnt',label:'± counts (digits)',type:'number',min:0},
  {id:'fx',label:'± fixed term, in units',type:'number',min:0,hint:'An absolute term such as + 5 µV.'},
  {id:'fl',label:'Floor: never less than ±',type:'number',min:0,hint:'For "or X, whichever is greater" specifications.'},
  {id:'qual',label:'Qualifiers',wide:true,ph:'e.g. 1 year since calibration, 23 °C ± 5 °C, relative humidity below 80 %'},
  {id:'br',label:'Reading to break down',type:'number',hint:'The terms are shown in detail at this reading.'}]},
 {type:'custom',id:'bd',title:'The specification at one reading',html:'<div class="stat is-stat"></div><div class="tgw"><table class="mv is-t"></table></div>'},
 {type:'grid',id:'p',title:'Test points',rows:4,hint:'The applied (nominal) value at each test point, from the reference standard. Add the instrument\'s reading to check it against the limits; leave it blank to just list the limits for a procedure or data sheet.',cols:[
  {id:'nom',label:'Applied value',type:'number'},
  {id:'rd',label:'Reading (as found)',type:'number'},
  {id:'e',label:'Allowed ±',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p?window.TOOL.h.f(p.o,p.E):''; }},
  {id:'lo',label:'Low limit',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p?window.TOOL.h.f(p.o,p.lo):''; }},
  {id:'hi',label:'High limit',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p?window.TOOL.h.f(p.o,p.hi):''; }},
  {id:'pc',label:'± % of reading',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p&&p.x!==0?Number((p.E/Math.abs(p.x)*100).toPrecision(3)).toString()+'%':(p?'—':''); }},
  {id:'er',label:'Error',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p&&p.y!=null?window.TOOL.h.f(p.o,p.err):''; }},
  {id:'u',label:'% of allowed',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p&&p.y!=null&&p.E>0?(Math.abs(p.err)/p.E*100).toFixed(0)+'%':''; }},
  {id:'v',label:'Result',calc:function(r,api){ var p=window.TOOL.h.pt(r,api); return p&&p.y!=null?(p.pass?'<b class="is-ok">In tolerance</b>':'<b class="is-bad">Out of tolerance</b>'):''; }}]},
 {type:'custom',id:'ch',title:'Specification envelope',hint:'The band is the allowed error across the range. The dots are the errors found at the test points (reading minus applied value).',html:'<div class="svgw is-svg"></div>'},
 {type:'custom',id:'res',title:'Checks',html:'<div class="out is-out"></div>'}
],
update:function(root,api){
 var S=api.state(), h=window.TOOL.h, o=h.spec(api), un=api.esc(o.un), f=[], R=o.R, br=api.num(S.f.br);
 var st=root.querySelector('.is-stat'), tb=root.querySelector('.is-t'), sv=root.querySelector('.is-svg'), out=root.querySelector('.is-out');
 if(!o.ok){ st.innerHTML=''; tb.innerHTML=''; sv.innerHTML=''; out.innerHTML=api.flags([],'Enter the specification terms to see the allowed error.'); return; }
 if(!o.rgOk) f.push(['warn','There is a % of range term but no range. Enter the range or full-scale value it applies to.']);
 if(!o.cntOk) f.push(['warn','There are counts but no resolution. One count is one step of the last displayed digit; enter the resolution.']);
 var u=o.ppm?' ppm':'%', K=o.ppm?1e6:100;
 if(isNaN(br)) br=R>0?R:NaN;
 if(!isNaN(br)){
  var t=h.terms(o,br);
  st.innerHTML='<div><b>±'+h.f(o,t.E)+' '+un+'</b><span>Allowed error at '+api.esc(String(br))+' '+un+'</span></div><div><b>'+h.f(o,br-t.E)+' to '+h.f(o,br+t.E)+'</b><span>Limits at that reading</span></div><div><b>'+(br!==0?h.g(t.E/Math.abs(br)*100)+'%':'—')+'</b><span>As % of reading</span></div>'+(R>0?'<div><b>'+h.g(t.E/R*100)+'%</b><span>As % of range</span></div>':'');
  var rows=[['% of reading',(o.rd*K)+u+' × '+api.esc(String(Math.abs(br))),t.a],['% of range or full scale',(o.rg*K)+u+' × '+(R>0?R:'—'),t.b],['Counts',api.fmt(o.cnt,0)+' × '+(o.res>0?o.res:'—'),t.c],['Fixed term','',t.d]].filter(function(x){ return x[2]>0; });
  tb.innerHTML='<thead><tr><th>Term</th><th>How</th><th>±'+un+'</th><th>Share</th></tr></thead><tbody>'+rows.map(function(x){ return '<tr><td class="mo">'+x[0]+'</td><td>'+x[1]+'</td><td class="mt">'+h.f(o,x[2])+'</td><td>'+(t.sum>0?(x[2]/t.sum*100).toFixed(0)+'%':'')+'</td></tr>'; }).join('')+
   '<tr><td class="mo"><b>Sum of the terms</b></td><td></td><td class="mt">'+h.f(o,t.sum)+'</td><td></td></tr>'+(o.fl>0?'<tr><td class="mo">Floor (whichever is greater)</td><td>'+(t.floor?'applies: the floor is larger':'does not apply')+'</td><td class="mt">'+h.f(o,o.fl)+'</td><td></td></tr>':'')+'<tr><td class="mo"><b>Allowed error</b></td><td></td><td class="mt">±'+h.f(o,t.E)+'</td><td></td></tr></tbody>';
  if(t.sum>0&&rows.length>1){ var big=rows.slice().sort(function(a,b){return b[2]-a[2];})[0]; f.push(['','At '+api.esc(String(br))+' '+un+' the largest term is <b>'+big[0].toLowerCase()+'</b>, '+(big[2]/t.sum*100).toFixed(0)+'% of the allowed error.']); }
  if(o.res>0&&t.E<o.res) f.push(['warn','The allowed error (±'+h.f(o,t.E)+') is smaller than one count ('+o.res+'). The display cannot show whether the instrument meets it.']);
 } else { st.innerHTML=''; tb.innerHTML=''; }
 if(R>0&&(o.rg>0||o.cnt>0||o.fx>0)){
  var lo=h.terms(o,R*0.1).E, hi=h.terms(o,R).E;
  f.push(['','The fixed parts (range, counts and fixed terms) do not shrink with the reading, so the error allowed as a share of the reading grows near the bottom of the range: ±'+h.g(hi/R*100)+'% of reading at full scale, ±'+h.g(lo/(R*0.1)*100)+'% at 10% of range. Measure in the upper part of a range, or on a lower range, when you can.']);
 }
 /* test points */
 var pts=S.g.p.map(function(r){ return h.pt(r,api); }).filter(Boolean), chk=pts.filter(function(p){ return p.y!=null; }), bad=chk.filter(function(p){ return !p.pass; });
 if(chk.length){ if(bad.length) f.push(['warn',bad.length+' of '+chk.length+' test points out of tolerance: '+bad.map(function(p){ return api.esc(String(p.x))+' '+un+' (error '+h.f(o,p.err)+', allowed ±'+h.f(o,p.E)+')'; }).join('; ')+'. Record it as found, adjust if the procedure allows, and start an out-of-tolerance impact review for work measured since the last good calibration.']);
  else f.push(['ok','All '+chk.length+' test points are within the specification.']);
  var near=chk.filter(function(p){ return p.pass&&p.E>0&&Math.abs(p.err)/p.E>=0.8; });
  if(near.length) f.push(['warn',near.length+' point'+(near.length>1?'s use':' uses')+' 80% or more of the allowed error. With the calibration uncertainty added, a reading this close to the limit may not be a clear pass; see the decision rule on the certificate.']); }
 var over=pts.filter(function(p){ return R>0&&Math.abs(p.x)>R*1.0000001; });
 if(over.length) f.push(['warn','Test point'+(over.length>1?'s ':' ')+over.map(function(p){return api.esc(String(p.x));}).join(', ')+' '+(over.length>1?'are':'is')+' above the range or full-scale value. Check the range.']);
 f.push(['','A specification is the error the maker promises, under the stated conditions and for the stated period. It is not the measurement uncertainty, which also includes the reference standard, the method and the environment.']);
 /* chart */
 var xs=pts.map(function(p){return p.x;}); if(R>0) xs.push(R); if(!isNaN(br)) xs.push(br); xs.push(0);
 var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs); if(x1===x0) x1=x0+1;
 var W=640,H=280,L=70,Rm=20,Tp=18,B=40, ym=0, N=80, path1='', path2='', i, xv, e;
 for(i=0;i<=N;i++){ xv=x0+(x1-x0)*i/N; e=h.terms(o,xv).E; if(e>ym) ym=e; }
 chk.forEach(function(p){ if(Math.abs(p.err)>ym) ym=Math.abs(p.err); }); ym*=1.15; if(!(ym>0)) ym=1;
 var X=function(v){ return L+(v-x0)/(x1-x0)*(W-L-Rm); }, Y=function(v){ return Tp+(ym-v)/(2*ym)*(H-Tp-B); };
 var up=[], dn=[]; for(i=0;i<=N;i++){ xv=x0+(x1-x0)*i/N; e=h.terms(o,xv).E; up.push(X(xv).toFixed(1)+','+Y(e).toFixed(1)); dn.push(X(xv).toFixed(1)+','+Y(-e).toFixed(1)); }
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Allowed error across the range">';
 g+='<polygon points="'+up.join(' ')+' '+dn.reverse().join(' ')+'" fill="#0F3E68" fill-opacity=".10"/>';
 g+='<polyline points="'+up.join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2"/><polyline points="'+dn.reverse().join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2"/>';
 g+='<line x1="'+L+'" x2="'+(W-Rm)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'" stroke="#4A5D71" stroke-width="1"/>';
 [ym/1.15,-ym/1.15,ym/2.3,-ym/2.3].forEach(function(v){ g+='<text x="'+(L-6)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+(v>0?'+':'')+h.g(v)+'</text><line x1="'+(L-3)+'" x2="'+L+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" stroke="#4A5D71"/>'; });
 for(i=0;i<=4;i++){ xv=x0+(x1-x0)*i/4; g+='<text x="'+X(xv).toFixed(1)+'" y="'+(H-B+16)+'" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+h.g(xv)+'</text>'; }
 g+='<text x="'+((L+W-Rm)/2)+'" y="'+(H-6)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#4A5D71">Applied value'+(un?' ('+un+')':'')+'</text>';
 g+='<text x="14" y="'+((Tp+H-B)/2)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#4A5D71" transform="rotate(-90 14 '+((Tp+H-B)/2)+')">Error'+(un?' ('+un+')':'')+'</text>';
 chk.forEach(function(p){ g+='<circle cx="'+X(p.x).toFixed(1)+'" cy="'+Y(p.err).toFixed(1)+'" r="5" fill="'+(p.pass?'#fff':'#C0392B')+'" stroke="'+(p.pass?'#0F3E68':'#C0392B')+'" stroke-width="2"/>'; });
 g+='</svg>'; sv.innerHTML=g;
 out.innerHTML=api.flags(f);
},
example:{f:{ins:'Handheld digital multimeter DMM-07, DC voltage, 20 V range',un:'V',rng:'20',rel:'Percent (%)',rd:'0.05',rg:'0.01',res:'0.001',cnt:'2',fx:'',fl:'',qual:'1 year since calibration, 23 °C ± 5 °C, relative humidity below 80 %',br:'2'},
 g:{p:[{nom:'0',rd:'0.001'},{nom:'2',rd:'2.003'},{nom:'5',rd:'4.998'},{nom:'10',rd:'10.006'},{nom:'15',rd:'15.009'},{nom:'19',rd:'18.985'}]}}
}
