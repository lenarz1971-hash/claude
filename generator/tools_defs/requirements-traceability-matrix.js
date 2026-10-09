{
slug:'requirements-traceability-matrix',
h:{
 ids:function(v){ return String(v==null?'':v).split(/[,;\s]+/).map(function(x){ return x.trim().toUpperCase(); }).filter(Boolean); },
 /* the whole trace: links, coverage and gaps, from the five tables */
 trace:function(S){ var H=this, out={dup:[],unk:[]}, seen={};
  function list(g,lab){ return (S.g[g]||[]).map(function(r,i){ var id=(r.id||'').trim(); return {r:r,id:id,key:id.toUpperCase(),lab:lab}; }).filter(function(x){ var txt=Object.keys(x.r).some(function(k){ return k!=='id'&&String(x.r[k]||'').trim(); }); return x.id||txt; }); }
  var N=list('n','User need'), I=list('i','Design input'), O=list('o','Design output'), V=list('v','Verification'), W=list('w','Validation');
  [N,I,O,V,W].forEach(function(L){ L.forEach(function(x){ if(!x.key) return; if(seen[x.key]) out.dup.push(x.id); seen[x.key]=x; }); });
  function idx(L){ var m={}; L.forEach(function(x){ if(x.key) m[x.key]=x; }); return m; }
  var mN=idx(N), mI=idx(I), mO=idx(O);
  function links(x,field,target,tname){ return H.ids(x.r[field]).filter(function(k){ if(target[k]) return true; out.unk.push([x.id||'('+x.lab.toLowerCase()+')',k,tname]); return false; }); }
  I.forEach(function(x){ x.needs=links(x,'need',mN,'user need'); x.outs=[]; x.vers=[]; });
  O.forEach(function(x){ x.ins=links(x,'inp',mI,'design input'); x.ins.forEach(function(k){ mI[k].outs.push(x.key); }); });
  V.forEach(function(x){ x.ins=links(x,'inp',mI,'design input'); x.ins.forEach(function(k){ mI[k].vers.push(x.key); }); });
  N.forEach(function(x){ x.ins=[]; x.vals=[]; });
  I.forEach(function(x){ x.needs.forEach(function(k){ mN[k].ins.push(x.key); }); });
  W.forEach(function(x){ x.needs=links(x,'need',mN,'user need'); x.needs.forEach(function(k){ mN[k].vals.push(x.key); }); });
  var mV=idx(V), mW=idx(W);
  I.forEach(function(x){ x.verPass=x.vers.some(function(k){ return mV[k].r.res==='Pass'; }); });
  N.forEach(function(x){ x.valPass=x.vals.some(function(k){ return mW[k].r.res==='Pass'; }); });
  out.N=N; out.I=I; out.O=O; out.V=V; out.W=W; out.mV=mV; out.mW=mW; out.mO=mO;
  function pct(a,b){ return b?100*a/b:NaN; }
  out.cov={
   needIn:pct(N.filter(function(x){ return x.ins.length; }).length,N.length),
   inNeed:pct(I.filter(function(x){ return x.needs.length; }).length,I.length),
   inOut:pct(I.filter(function(x){ return x.outs.length; }).length,I.length),
   inVer:pct(I.filter(function(x){ return x.verPass; }).length,I.length),
   needVal:pct(N.filter(function(x){ return x.valPass; }).length,N.length)};
  return out; }
},
sections:[
 {type:'fields',title:'Product and design project',cols:3,fields:[
  {id:'prod',label:'Product',ph:'e.g. HX-7 heated humidifier'},
  {id:'proj',label:'Design project or file',ph:'e.g. DHF-HX7'},
  {id:'phase',label:'Design phase',type:'select',opts:['Planning','Design inputs approved','Design outputs released','Verification','Validation','Design transfer','Design change']},
  {id:'own',label:'Owner'},
  {id:'date',label:'Date',type:'date'},
  {id:'rev',label:'Revision'}]},
 {type:'custom',id:'key',title:'How the trace runs',hint:'Each table points back to the one before it, by ID. Several IDs go in one cell, separated by commas.',html:'<div class="pillrow"><span>USER NEED</span><span>&rarr; DESIGN INPUT (TRACES TO NEEDS)</span><span>&rarr; DESIGN OUTPUT (IMPLEMENTS INPUTS)</span><span>VERIFICATION: OUTPUT MEETS INPUT</span><span>VALIDATION: DEVICE MEETS NEED</span></div>'},
 {type:'grid',id:'n',title:'User needs',rows:3,hint:'What the user, patient or market needs, in their terms. Needs are validated, on the finished device, in the intended use.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'txt',label:'User need',w:320,type:'textarea',rows:1},
  {id:'src',label:'Source',type:'select',opts:['User or customer','Clinical','Regulatory','Standard','Business','Risk analysis']}]},
 {type:'grid',id:'i',title:'Design inputs',rows:3,hint:'Requirements the design must meet, written so they can be verified: a number, a limit, a test. Inputs that implement a risk control carry the hazard ID.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'txt',label:'Design input (requirement)',w:260,type:'textarea',rows:1},
  {id:'type',label:'Type',type:'select',opts:['Functional','Performance','Safety','Risk control','Usability','Interface','Regulatory or standard','Environmental','Labeling','Software','Business']},
  {id:'crit',label:'Acceptance criterion',w:150},
  {id:'need',label:'Traces to needs',w:100,ph:'e.g. UN1'},
  {id:'risk',label:'Risk control for',w:90,tip:'Hazard ID from the hazard analysis, if this input is a risk control'}]},
 {type:'grid',id:'o',title:'Design outputs',rows:3,hint:'The drawings, specifications, software, labeling and process documents that make up the design.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'txt',label:'Design output',w:260,type:'textarea',rows:1},
  {id:'doc',label:'Document and revision',w:160},
  {id:'inp',label:'Implements inputs',w:110,ph:'e.g. DI-1, DI-2'}]},
 {type:'grid',id:'v',title:'Design verification',rows:3,hint:'Did we build the design right? Each test shows that design outputs meet design inputs.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'txt',label:'Test, inspection or analysis',w:260,type:'textarea',rows:1},
  {id:'inp',label:'Verifies inputs',w:110},
  {id:'res',label:'Result',type:'select',opts:['Pass','Fail','Planned']},
  {id:'rep',label:'Report',w:100}]},
 {type:'grid',id:'w',title:'Design validation',rows:2,hint:'Did we build the right design? Validation shows the device meets the user needs and intended use, under actual or simulated use, on initial production units or their equivalent.',cols:[
  {id:'id',label:'ID',w:70},
  {id:'txt',label:'Validation study',w:260,type:'textarea',rows:1},
  {id:'need',label:'Validates needs',w:110},
  {id:'units',label:'Units used',type:'select',opts:['Production or production-equivalent','Prototype','Simulation or analysis only']},
  {id:'res',label:'Result',type:'select',opts:['Pass','Fail','Planned']},
  {id:'rep',label:'Report',w:100}]},
 {type:'custom',id:'mx',title:'Traceability matrix',hint:'Built from the tables above. A red cell is a gap.',html:'<div class="stat rt-stat"></div><div class="tgw rt-tw"><table class="tg rt-mx"></table></div>'},
 {type:'custom',id:'pic',title:'Trace diagram',hint:'Each box is an item; each line a link. A red box has a gap.',html:'<div class="svgw rt-svg"></div>'},
 {type:'custom',id:'chk',title:'Gaps and checks',html:'<div class="out rt-out"></div>'}
],
update:function(root,api){
 var S=api.state(), H=window.TOOL.h, t=H.trace(S), f=[], e=api.esc;
 function b(x){ return '<b>'+e(x)+'</b>'; }
 t.dup.forEach(function(d){ f.push(['warn','ID '+b(d)+' is used more than once. Every item needs its own ID.']); });
 t.unk.forEach(function(u){ f.push(['warn',b(u[0])+' points to '+b(u[1])+', which is not a '+u[2]+' in the tables.']); });
 [t.N,t.I,t.O,t.V,t.W].forEach(function(L){ L.forEach(function(x){ if(!x.id) f.push(['warn','A '+x.lab.toLowerCase()+' has no ID, so nothing can trace to it.']); }); });
 t.N.forEach(function(x){ if(!x.id) return;
  if(!x.ins.length) f.push(['warn','User need '+b(x.id)+' has no design input. Either a requirement is missing or the need is not being met.']);
  if(!x.vals.length) f.push([/Regulatory|Standard/.test(x.r.src||'')?'':'warn','User need '+b(x.id)+' has no validation.'+(/Regulatory|Standard/.test(x.r.src||'')?' A regulatory or standard need is often shown by verification of its inputs instead; say so in the validation plan.':'')]);
  else if(!x.valPass) f.push(['warn','User need '+b(x.id)+': no validation has passed yet.']); });
 t.I.forEach(function(x){ if(!x.id) return; var r=x.r;
  if(!x.needs.length) f.push([r.type==='Regulatory or standard'?'':'warn','Design input '+b(x.id)+' does not trace to any user need. An orphan requirement either serves a need nobody wrote down, or should not be there.']);
  if(!x.outs.length) f.push(['warn','Design input '+b(x.id)+' has no design output. Nothing in the design implements it yet.']);
  if(!x.vers.length) f.push(['warn','Design input '+b(x.id)+' has no verification.']);
  else if(!x.verPass) f.push(['warn','Design input '+b(x.id)+': no verification has passed yet.']);
  if(!String(r.crit||'').trim()) f.push(['','Design input '+b(x.id)+' has no acceptance criterion. An input that cannot be measured cannot be verified.']);
  if((r.risk||r.type==='Risk control')&&!x.verPass) f.push(['warn',b(x.id)+' is a risk control'+(r.risk?' for '+e(r.risk):'')+' and is not yet verified. The risk file needs evidence that each control is implemented and effective.']); });
 t.O.forEach(function(x){ if(x.id&&!x.ins.length) f.push(['warn','Design output '+b(x.id)+' implements no design input. Either the input is missing, or the output is not needed.']); });
 t.V.forEach(function(x){ if(!x.id) return; if(!x.ins.length) f.push(['','Verification '+b(x.id)+' is not linked to any design input.']); if(x.r.res==='Fail') f.push(['warn','Verification '+b(x.id)+' failed. Change the design and reverify, or change the input through design review.']); });
 t.W.forEach(function(x){ if(!x.id) return; if(!x.needs.length) f.push(['','Validation '+b(x.id)+' is not linked to any user need.']); if(x.r.res==='Fail') f.push(['warn','Validation '+b(x.id)+' failed.']); if(x.r.units&&x.r.units!=='Production or production-equivalent') f.push(['',b(x.id)+' uses '+e(x.r.units.toLowerCase())+'. Design validation is done on initial production units or their equivalent; justify the difference.']); });
 var gaps=f.filter(function(q){ return q[0]==='warn'; }).length;
 if((t.N.length||t.I.length)&&!gaps) f.push(['ok','Every need has inputs and a passing validation, every input traces to a need and has an output and a passing verification, and there are no orphans.']);
 function pc(v){ return isNaN(v)?'—':api.fmt(v,0)+'%'; }
 root.querySelector('.rt-stat').innerHTML='<div><b>'+pc(t.cov.needIn)+'</b><span>Needs with design inputs</span></div><div><b>'+pc(t.cov.inNeed)+'</b><span>Inputs traced to a need</span></div><div><b>'+pc(t.cov.inOut)+'</b><span>Inputs with outputs</span></div><div><b>'+pc(t.cov.inVer)+'</b><span>Inputs verified (pass)</span></div><div><b>'+pc(t.cov.needVal)+'</b><span>Needs validated (pass)</span></div><div><b>'+gaps+'</b><span>Gaps and errors</span></div>';
 /* matrix: one block per need, one line per input */
 var mI={}; t.I.forEach(function(x){ if(x.key) mI[x.key]=x; });
 function gap(){ return '<td class="rt-gap">gap</td>'; }
 function vlist(keys,M){ return keys.map(function(k){ var r=M[k].r; return e(M[k].id)+(r.res?' <span class="rt-r rt-'+(r.res||'').toLowerCase()+'">'+e(r.res)+'</span>':''); }).join('<br>'); }
 var h='<thead><tr><th>User need</th><th>Design input</th><th>Design output</th><th>Verification</th><th>Validation</th></tr></thead><tbody>';
 function inCells(x){ return '<td>'+b(x.id)+' '+e(x.r.txt||'')+(x.r.risk?' <span class="rt-r">'+e(x.r.risk)+'</span>':'')+'</td>'+(x.outs.length?'<td>'+x.outs.map(function(k){ return e(t.mO[k].id); }).join(', ')+'</td>':gap())+(x.vers.length?'<td class="'+(x.verPass?'':'rt-warn')+'">'+vlist(x.vers,t.mV)+'</td>':gap()); }
 t.N.forEach(function(n){ var rows=n.ins.map(function(k){ return mI[k]; }), span=Math.max(1,rows.length), nc='<td rowspan="'+span+'">'+b(n.id)+' '+e(n.r.txt||'')+'</td>', vc=n.vals.length?'<td rowspan="'+span+'" class="'+(n.valPass?'':'rt-warn')+'">'+vlist(n.vals,t.mW)+'</td>':'<td rowspan="'+span+'" class="'+(/Regulatory|Standard/.test(n.r.src||'')?'rt-na':'rt-gap')+'">'+(/Regulatory|Standard/.test(n.r.src||'')?'by verification':'gap')+'</td>';
  if(!rows.length){ h+='<tr>'+nc+gap()+'<td class="rt-na"></td><td class="rt-na"></td>'+vc+'</tr>'; return; }
  rows.forEach(function(x,j){ h+='<tr>'+(j?'':nc)+inCells(x)+(j?'':vc)+'</tr>'; }); });
 var orph=t.I.filter(function(x){ return !x.needs.length; });
 orph.forEach(function(x){ h+='<tr><td class="'+(x.r.type==='Regulatory or standard'?'rt-na':'rt-gap')+'">no user need</td>'+inCells(x)+'<td class="rt-na"></td></tr>'; });
 t.O.filter(function(x){ return !x.ins.length; }).forEach(function(x){ h+='<tr><td class="rt-na"></td><td class="rt-gap">no design input</td><td>'+b(x.id)+' '+e(x.r.txt||'')+'</td><td class="rt-na"></td><td class="rt-na"></td></tr>'; });
 root.querySelector('.rt-mx').innerHTML=h+'</tbody>';
 /* diagram: validation | needs | inputs | outputs, then verification */
 var cW=t.W.filter(function(x){ return x.key; }), cN=t.N.filter(function(x){ return x.key; }), cI=t.I.filter(function(x){ return x.key; }), cO=t.O.filter(function(x){ return x.key; }), cV=t.V.filter(function(x){ return x.key; });
 var BW=150, BH=30, GX=60, GY=10, top=30, SEP=34, X=[10,10+BW+GX,10+2*(BW+GX),10+3*(BW+GX)], W=X[3]+BW+10;
 var h3=(cO.length+cV.length)*(BH+GY)+(cO.length&&cV.length?SEP:0), hh=Math.max(h3,Math.max(cW.length,cN.length,cI.length,1)*(BH+GY)), Hh=top+hh+20, pos={};
 function place(L,col,pre,y0){ L.forEach(function(x,j){ pos[pre+x.key]={x:X[col],y:y0+j*(BH+GY)}; }); }
 place(cW,0,'w:',top+(hh-cW.length*(BH+GY))/2); place(cN,1,'n:',top+(hh-cN.length*(BH+GY))/2); place(cI,2,'i:',top+(hh-cI.length*(BH+GY))/2);
 var y3=top+(hh-h3)/2; place(cO,3,'o:',y3); var yv=y3+cO.length*(BH+GY)+(cO.length?SEP:0); place(cV,3,'v:',yv);
 var g='<svg viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Trace diagram"><style>text{font:10.5px Archivo,sans-serif;fill:#16273A}.i{font:700 10px \'IBM Plex Mono\',monospace;fill:#0F3E68}.hd{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71;letter-spacing:.06em}</style>';
 ['VALIDATION','USER NEEDS','DESIGN INPUTS','DESIGN OUTPUTS'].forEach(function(nm,i){ g+='<text class="hd" x="'+(X[i]+BW/2)+'" y="16" text-anchor="middle">'+nm+'</text>'; });
 if(cV.length) g+='<text class="hd" x="'+(X[3]+BW/2)+'" y="'+(yv-8)+'" text-anchor="middle">VERIFICATION</text>';
 function link(a,b2,col){ var A=pos[a], B=pos[b2]; if(!A||!B) return ''; var x1=A.x+BW, y1=A.y+BH/2, x2=B.x, y2=B.y+BH/2;
  return '<path d="M'+x1+' '+y1+' C'+((x1+x2)/2)+' '+y1+' '+((x1+x2)/2)+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="'+col+'" stroke-width="1.2" opacity=".7"/>'; }
 cW.forEach(function(x){ x.needs.forEach(function(k){ g+=link('w:'+x.key,'n:'+k,'#9C7C1F'); }); });
 cI.forEach(function(x){ x.needs.forEach(function(k){ g+=link('n:'+k,'i:'+x.key,'#0F3E68'); }); x.outs.forEach(function(k){ g+=link('i:'+x.key,'o:'+k,'#0F3E68'); }); });
 cV.forEach(function(x){ x.ins.forEach(function(k){ g+=link('i:'+k,'v:'+x.key,'#9C7C1F'); }); });
 function reg(x){ return /Regulatory|Standard/.test(x.r.src||''); }
 function box(x,pre,bad){ var p=pos[pre+x.key], tx=String(x.r.txt||''); tx=tx.length>23?tx.slice(0,22)+'…':tx;
  return '<rect x="'+p.x+'" y="'+p.y+'" width="'+BW+'" height="'+BH+'" rx="3" fill="'+(bad?'#FDECEA':'#fff')+'" stroke="'+(bad?'#C0392B':'#0F3E68')+'" stroke-width="'+(bad?1.8:1.2)+'"/><text class="i" x="'+(p.x+6)+'" y="'+(p.y+12)+'">'+e(x.id)+'</text><text x="'+(p.x+6)+'" y="'+(p.y+25)+'">'+e(tx)+'</text>'; }
 cW.forEach(function(x){ g+=box(x,'w:',x.r.res==='Fail'||!x.needs.length); });
 cN.forEach(function(x){ g+=box(x,'n:',!x.ins.length||(!x.valPass&&!reg(x))); });
 cI.forEach(function(x){ g+=box(x,'i:',(!x.needs.length&&x.r.type!=='Regulatory or standard')||!x.outs.length||!x.verPass); });
 cO.forEach(function(x){ g+=box(x,'o:',!x.ins.length); });
 cV.forEach(function(x){ g+=box(x,'v:',x.r.res==='Fail'||!x.ins.length); });
 root.querySelector('.rt-svg').innerHTML=g+'</svg>';
 root.querySelector('.rt-out').innerHTML=api.flags(f,'Add user needs and design inputs, and the checks appear here.');
},
example:{f:{prod:'HX-7 heated humidifier (fictional)',proj:'DHF-HX7',phase:'Verification',own:'Design lead',date:'2026-09-15',rev:'D'},
 g:{n:[
  {id:'UN1',txt:'Delivers warm, humid gas that is comfortable to breathe around the clock',src:'User or customer'},
  {id:'UN2',txt:'Safe for home use by lay caregivers',src:'Clinical'},
  {id:'UN3',txt:'Easy to fill and clean every day',src:'User or customer'},
  {id:'UN4',txt:'Meets the electrical safety requirements for home-use medical equipment',src:'Regulatory'},
  {id:'UN5',txt:'Quiet enough to sleep beside',src:'User or customer'}],
 i:[
  {id:'DI-1',txt:'Gas outlet temperature 37 °C ±2 °C at flows of 5 to 60 L/min',type:'Performance',crit:'35.0 to 39.0 °C at 5, 30, 60 L/min',need:'UN1',risk:''},
  {id:'DI-2',txt:'Absolute humidity at least 33 mg/L at the patient end',type:'Performance',crit:'≥ 33 mg/L',need:'UN1',risk:''},
  {id:'DI-3',txt:'Gas temperature does not exceed 43 °C under any single fault',type:'Risk control',crit:'≤ 43 °C, 20 of 20 fault trials',need:'UN2',risk:'H1'},
  {id:'DI-4',txt:'A lay user can remove, fill and refit the chamber in under 60 s',type:'Usability',crit:'90% of users under 60 s',need:'UN3',risk:''},
  {id:'DI-5',txt:'Leakage currents within the limits of the applicable electrical safety standard',type:'Regulatory or standard',crit:'Per standard, normal and single fault',need:'UN4',risk:''},
  {id:'DI-6',txt:'Therapy mode is set automatically from the coded circuit connector',type:'Risk control',crit:'Correct mode in 100% of connector codes',need:'UN2',risk:'H4'},
  {id:'DI-7',txt:'Housing color matches the product family',type:'Business',crit:'Color standard CS-12',need:'',risk:''}],
 o:[
  {id:'DO-1',txt:'Heater control board assembly',doc:'100-221 rev C',inp:'DI-1, DI-2'},
  {id:'DO-2',txt:'Independent thermal cutoff circuit',doc:'100-305 rev B',inp:'DI-3'},
  {id:'DO-3',txt:'Water chamber and lid',doc:'200-110, 200-111 rev A',inp:'DI-4'},
  {id:'DO-4',txt:'Power supply and insulation diagram',doc:'100-400 rev B',inp:'DI-5'},
  {id:'DO-5',txt:'Firmware mode detection module',doc:'FW-MODE v1.3',inp:'DI-6'},
  {id:'DO-6',txt:'Shipping carton',doc:'300-010 rev A',inp:''},
  {id:'DO-7',txt:'Housing',doc:'200-001 rev C',inp:'DI-7'}],
 v:[
  {id:'VER-1',txt:'Outlet temperature test at 5, 30 and 60 L/min',inp:'DI-1',res:'Pass',rep:'TR-101'},
  {id:'VER-2',txt:'Humidity output test',inp:'DI-2',res:'Pass',rep:'TR-102'},
  {id:'VER-3',txt:'Single-fault thermal test, 20 trials',inp:'DI-3',res:'Pass',rep:'TR-118'},
  {id:'VER-4',txt:'Electrical safety type test',inp:'DI-5',res:'Pass',rep:'ES-HX7'},
  {id:'VER-5',txt:'Firmware unit and integration tests, mode detection',inp:'DI-6',res:'Planned',rep:''},
  {id:'VER-6',txt:'Color check against standard',inp:'DI-7',res:'Pass',rep:'QC-77'}],
 w:[
  {id:'VAL-1',txt:'Simulated home use, 15 caregivers, 14 days',need:'UN1, UN3',units:'Production or production-equivalent',res:'Pass',rep:'VAL-HX7-01'},
  {id:'VAL-2',txt:'Summative usability study',need:'UN2',units:'Production or production-equivalent',res:'Pass',rep:'US-HX7-02'}]}}
}
