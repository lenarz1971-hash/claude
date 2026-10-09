{
slug:'error-proofing-poka-yoke',
AP:['1 Eliminate: designed out','2 Prevent: the error cannot be made','3 Detect the error before it makes a defect','4 Detect the defect at the station','5 Detect the defect downstream'],
lvl:function(r){ var m=/^([1-5])/.exec(r.ap||''); return m?+m[1]:NaN; },
/* strength 10 (designed out, stops the process) down to 1 (downstream, warning only) */
str:function(r){ var L=window.TOOL.lvl(r); if(isNaN(L)) return NaN; return (6-L)*2-(/^Warning/.test(r.fn||'')?1:0); },
red:function(r,api){ var b=api.num(r.b), a=api.num(r.a); return b>0&&a>=0?(b-a)/b*100:NaN; },
sections:[
 {type:'fields',title:'Scope',cols:3,hint:'Error-proofing (poka-yoke) stops a human error from turning into a defect that reaches the customer. The strongest devices remove the chance of the error; the weakest catch the defect after it is made.',fields:[
  {id:'proc',label:'Process or product',wide:true,ph:'e.g. Wire-harness assembly, cell 4'},
  {id:'team',label:'Team'},
  {id:'per',label:'Escape counts are per',ph:'e.g. month, 10,000 units'},
  {id:'old',label:'Flag verification older than (days)',type:'number',min:1,ph:'30'}]},
 {type:'custom',id:'ref',title:'The terms',html:'<div class="pillrow"><span>APPROACH: ELIMINATE &gt; PREVENT &gt; DETECT ERROR &gt; DETECT DEFECT &gt; DOWNSTREAM</span><span>CONTROL: STOPS THE PROCESS</span><span>WARNING: SIGNAL ONLY</span></div><div class="pillrow"><span>CONTACT: SHAPE, SIZE, POSITION</span><span>FIXED-VALUE: A SET NUMBER OF PARTS OR MOVES</span><span>MOTION-STEP: STEPS IN THE RIGHT ORDER</span></div>'},
 {type:'grid',id:'d',title:'Errors and devices',rows:3,hint:'One row per error or failure mode, from the PFMEA, a defect Pareto or the line. <b>Severity</b> (1 to 10, as in the FMEA) is optional but drives the checks. Before and after are escapes or defects in the same period, to show the device works. Strength runs from 10 (designed out, stops the process) to 1 (caught downstream, warning only).',cols:[
  {id:'id',label:'ID',w:44},
  {id:'st',label:'Process step',w:130,type:'textarea',rows:1},
  {id:'er',label:'Error or failure mode',w:200,type:'textarea',rows:1},
  {id:'sv',label:'Sev',type:'number',min:1,max:10,tip:'Severity 1-10'},
  {id:'ap',label:'Approach',type:'select',opts:['1 Eliminate: designed out','2 Prevent: the error cannot be made','3 Detect the error before it makes a defect','4 Detect the defect at the station','5 Detect the defect downstream']},
  {id:'me',label:'Method',type:'select',opts:['Contact','Fixed-value','Motion-step']},
  {id:'fn',label:'Function',type:'select',opts:['Control: stops the process','Warning: signal only']},
  {id:'dv',label:'Device',w:200,type:'textarea',rows:1},
  {id:'vm',label:'How it is verified',w:160,type:'textarea',rows:1},
  {id:'vd',label:'Last verified',type:'date'},
  {id:'b',label:'Before',type:'number',min:0},
  {id:'a',label:'After',type:'number',min:0},
  {id:'sg',label:'Strength',calc:function(r){ var s=window.TOOL.str(r); return isNaN(s)?'':s; }},
  {id:'rd',label:'Reduction',calc:function(r,api){ var x=window.TOOL.red(r,api); return isNaN(x)?'':api.fmt(x,0)+'%'; }}]},
 {type:'custom',id:'mx',title:'Where the devices sit',hint:'Each ID is placed by approach and function. The top-left cells are the strongest. Devices in the lower rows depend on inspection; devices in the right column depend on someone responding to a signal.',html:'<div class="svgw pk-svg"></div>'},
 {type:'custom',id:'rk',title:'Ranked by strength',html:'<div class="stat pk-stat"></div><div class="tgw"><table class="tg pk-tab"></table></div>'},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out pk-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), n=api.num, E=api.esc, F=api.fmt, f=[], old=n(S.f.old); if(!(old>0)) old=30;
 var D=S.g.d.map(function(r,i){ return {r:r,id:(r.id||'').trim()||('row '+(i+1)),L:T.lvl(r),s:T.str(r),sv:n(r.sv),red:T.red(r,api),warn:/^Warning/.test(r.fn||'')}; }).filter(function(x){return x.r.er||x.r.dv||x.r.id;});
 var trs=root.querySelectorAll('table[data-grid="d"] tbody tr');
 S.g.d.forEach(function(r,i){ if(trs[i]) trs[i].classList.toggle('hi-row', n(r.sv)>=9&&T.lvl(r)>=4); });
 /* matrix */
 var C1=150, CW=190, RH=52, top=30, W=C1+2*CW+20, H=top+5*RH+10;
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Devices by approach and function"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:700 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.id{font:700 11px \'IBM Plex Mono\',monospace;fill:#16273A}</style>';
 g+='<text class="ax" x="'+(C1+CW/2)+'" y="18" text-anchor="middle">CONTROL: STOPS</text><text class="ax" x="'+(C1+CW*1.5)+'" y="18" text-anchor="middle">WARNING: SIGNAL</text>';
 var lab=['Eliminate','Prevent','Detect error','Detect defect','Downstream'], fill={10:'#BFE0C9',9:'#CFE7D5',8:'#D9EDDD',7:'#E6F1E0',6:'#F3EBC4',5:'#F3DC9B',4:'#F1CFA0',3:'#EDBA9E',2:'#E9A39B',1:'#E39189'};
 for(var L=1;L<=5;L++){ var y=top+(L-1)*RH;
  g+='<text x="'+(C1-10)+'" y="'+(y+RH/2-2)+'" text-anchor="end" style="font-weight:700">'+L+'. '+lab[L-1]+'</text>';
  [0,1].forEach(function(w){ var s=(6-L)*2-w, x=C1+w*CW, ids=D.filter(function(d){return d.L===L&&d.warn===!!w;}).map(function(d){return d.id;});
   g+='<rect x="'+x+'" y="'+y+'" width="'+CW+'" height="'+RH+'" fill="'+fill[s]+'" stroke="#fff" stroke-width="2"/><text class="ax" x="'+(x+CW-6)+'" y="'+(y+13)+'" text-anchor="end" style="opacity:.7">'+s+'</text>';
   var line=[], lines=[], len=0; ids.forEach(function(id){ var t=id.length>8?id.slice(0,7)+'…':id; if(len+t.length>20&&line.length){ lines.push(line.join(' ')); line=[]; len=0; } line.push(t); len+=t.length+1; }); if(line.length) lines.push(line.join(' '));
   lines.slice(0,2).forEach(function(t,j){ g+='<text class="id" x="'+(x+10)+'" y="'+(y+26+j*14)+'">'+E(t)+(j===1&&lines.length>2?' …':'')+'</text>'; }); }); }
 root.querySelector('.pk-svg').innerHTML=g+'</svg>';
 /* ranked table */
 var rk=D.filter(function(d){return !isNaN(d.s);}).slice().sort(function(a,b){ return b.s-a.s||(b.sv||0)-(a.sv||0); });
 root.querySelector('.pk-tab').innerHTML=rk.length?'<thead><tr><th>Rank</th><th>ID</th><th>Error</th><th>Sev</th><th>Approach</th><th>Function</th><th>Strength</th><th>Reduction</th></tr></thead><tbody>'+rk.map(function(d,i){ return '<tr'+(d.sv>=9&&d.L>=4?' class="hi-row"':'')+'><td class="calc">'+(i+1)+'</td><td class="calc">'+E(d.id)+'</td><td>'+E(d.r.er||'')+'</td><td class="calc">'+(isNaN(d.sv)?'':d.sv)+'</td><td>'+E(lab[d.L-1])+'</td><td>'+(d.warn?'Warning':(d.r.fn?'Control':''))+'</td><td class="calc">'+d.s+'</td><td class="calc">'+(isNaN(d.red)?'':F(d.red,0)+'%')+'</td></tr>'; }).join('')+'</tbody>':'';
 var prev=D.filter(function(d){return d.L<=2;}).length, ctl=D.filter(function(d){return d.r.fn&&!d.warn;}).length, tb=0, ta=0, both=0;
 D.forEach(function(d){ var b=n(d.r.b), a=n(d.r.a); if(b>=0&&a>=0){ tb+=b; ta+=a; both++; } });
 root.querySelector('.pk-stat').innerHTML=D.length?'<div><b>'+D.length+'</b><span>Errors listed</span></div><div><b>'+prev+' of '+D.length+'</b><span>Eliminated or prevented</span></div><div><b>'+ctl+' of '+D.length+'</b><span>Stop the process</span></div>'+(both?'<div><b>'+F(tb,0)+' &rarr; '+F(ta,0)+'</b><span>Escapes before &rarr; after'+(S.f.per?', per '+E(S.f.per):'')+'</span></div>'+(tb>0?'<div><b>'+F((tb-ta)/tb*100,0)+'%</b><span>Overall reduction</span></div>':''):''):'';
 /* checks */
 var today=api.today(), lim=new Date(Date.now()-old*864e5).toISOString().slice(0,10);
 D.forEach(function(d){ var r=d.r, id='<b>'+E(d.id)+'</b>';
  if(isNaN(d.L)) { f.push(['warn',id+' has no approach chosen.']); return; }
  if(d.sv>=9&&d.L>=4) f.push(['warn',id+' has severity '+d.sv+' and relies on catching the defect after it is made. For a safety or regulatory effect, aim to prevent the error (approach 1 or 2).']);
  else if(d.sv>=9&&d.warn) f.push(['warn',id+' has severity '+d.sv+' and only a warning. A warning relies on someone noticing and acting every time; make it stop the process.']);
  else if(d.warn&&d.L>=3) f.push(['',id+' gives a warning only. Check what happens on a busy shift when the signal is missed.']);
  if(d.L===5) f.push(['',id+' is caught downstream. That is inspection, not error-proofing: the defect has already been made and may be made many times before it is found.']);
  if(d.L>=2&&!r.me) f.push(['',id+': choose the method (contact, fixed-value or motion-step) so the device can be compared with others.']);
  if(d.L>1&&!r.vm) f.push(['warn',id+' has no verification method. A device that is never challenged can fail or be bypassed without anyone knowing. Use a known-bad part or a test at start of shift.']);
  if(d.L>1&&r.vm&&!r.vd) f.push(['warn',id+' has a verification method but no date it was last verified.']);
  if(r.vd&&r.vd<lim) f.push(['warn',id+' was last verified on '+E(r.vd)+', more than '+old+' days ago.']);
  if(r.vd&&r.vd>today) f.push(['warn',id+': the last verified date is in the future.']);
  var b=n(r.b), a=n(r.a);
  if(b>=0&&a>=0){ if(a>=b&&b>0) f.push(['warn',id+': escapes did not fall ('+F(b,0)+' before, '+F(a,0)+' after). The device is not working, is bypassed, or the error has another cause.']);
   else if(a>0&&d.L<=2) f.push(['',id+' should make the error impossible, yet '+F(a,0)+' escaped after it was fitted. Check for a bypass or a second failure mode.']);
   else if(b>0&&a===0) f.push(['ok',id+': no escapes since the device was fitted (from '+F(b,0)+').']); }
  else if(d.L>1&&!(b>=0)) f.push(['',id+': record escapes before and after to show the device is effective.']); });
 if(D.length&&prev===0) f.push(['warn','None of the devices eliminates or prevents an error. Every one depends on detection. Start with the highest-severity error and ask whether the design can make it impossible.']);
 root.querySelector('.pk-out').innerHTML=api.flags(f,'List the errors and devices and the checks appear here.');
},
example:{f:{proc:'Wire-harness assembly for a dishwasher control board, cell 4',team:'Cell lead, process engineer, quality technician',per:'month (about 18,000 harnesses)',old:'30'},
 g:{d:[
  {id:'E1',st:'Crimp terminal',er:'Wrong terminal loaded in the crimp press',sv:'7',ap:'2 Prevent: the error cannot be made',me:'Contact',fn:'Control: stops the process',dv:'Keyed applicator: each terminal reel fits only its own applicator',vm:'Try the wrong reel at start of shift',vd:'2026-10-05',b:'11',a:'0'},
  {id:'E2',st:'Insert wires in connector',er:'Wire inserted in the wrong cavity',sv:'9',ap:'4 Detect the defect at the station',me:'Contact',fn:'Control: stops the process',dv:'Continuity test fixture; the board will not release a failed harness',vm:'Known-bad harness each shift',vd:'2026-10-06',b:'23',a:'2'},
  {id:'E3',st:'Fit ground strap',er:'Ground strap left off',sv:'10',ap:'3 Detect the error before it makes a defect',me:'Fixed-value',fn:'Warning: signal only',dv:'Pick-to-light bin; light stays on until a strap is taken',vm:'',vd:'',b:'4',a:'1'},
  {id:'E4',st:'Tape and label',er:'Label for the wrong model',sv:'6',ap:'1 Eliminate: designed out',me:'',fn:'',dv:'Label printed by the test fixture from the scanned model code; no label stock at the station',vm:'',vd:'',b:'6',a:'0'},
  {id:'E5',st:'Final assembly',er:'Connector latch not fully seated',sv:'8',ap:'5 Detect the defect downstream',me:'Motion-step',fn:'Warning: signal only',dv:'Audit pull test at the customer\'s receiving inspection',vm:'Audit sheet',vd:'2026-07-14',b:'9',a:'9'}]}}
}
