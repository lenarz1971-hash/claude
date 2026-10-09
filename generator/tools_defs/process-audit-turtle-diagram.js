{
slug:'process-audit-turtle-diagram',
sections:[
 {type:'fields',title:'Process audited',cols:3,fields:[
  {id:'org',label:'Organization'},
  {id:'proc',label:'Process',ph:'e.g. Coil brazing'},
  {id:'owner',label:'Process owner',ph:'Job title'},
  {id:'up',label:'Supplying processes (upstream)',ph:'e.g. Tube bending, purchasing'},
  {id:'down',label:'Receiving processes (downstream)',ph:'e.g. Leak test, assembly'},
  {id:'crit',label:'Audit criteria',ph:'e.g. ISO 9001:2015, WI-BR-02'}]},
 {type:'fields',title:'The six arms of the turtle',cols:2,hint:'One item per line. Be specific: name the document, machine, role or measure, so each line can become an audit question. The ISO 9001 clause for each line is suggested from its wording (inputs: customer requirements 8.2, purchased or external 8.4, internal 8.5.1); to set it yourself, end the line with a bar and the clause, for example <b>Resin, lot-certified | 8.4</b>.',fields:[
  {id:'inp',label:'Inputs: what comes in',type:'textarea',rows:4,ph:'Materials, information, orders, requirements'},
  {id:'outp',label:'Outputs: what goes out',type:'textarea',rows:4,ph:'Product, records, information for the next process'},
  {id:'what',label:'With what: equipment, materials, facilities',type:'textarea',rows:4},
  {id:'whom',label:'With whom: roles, competence, training',type:'textarea',rows:4},
  {id:'how',label:'How: procedures, methods, work instructions',type:'textarea',rows:4},
  {id:'meas',label:'How measured: KPIs with their targets',type:'textarea',rows:4,ph:'e.g. First-pass yield, target 98%'}]},
 {type:'custom',id:'tt',title:'Turtle diagram',html:'<div class="svgw pt-chart"></div>'},
 {type:'custom',id:'qq',title:'Audit questions by arm',hint:'Starting points for the checklist. Reword them for the people you will interview, and add the sample you will check.',html:'<div class="tgw"><table class="mv pt-q"></table></div><div class="out pt-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, f=[];
 var ch=root.querySelector('.pt-chart'), tq=root.querySelector('.pt-q'), out=root.querySelector('.pt-out');
 var INQ={'8.2':'How were these requirements reviewed and confirmed before work started, and how are changes passed on?','8.4':'How is this verified on receipt (certificate, inspection), and what happens to a nonconforming lot?','8.5.1':'How is this checked for correctness and completeness before use? What happens when it is wrong or missing?'};
 var inCl=function(x){ return /customer|order|drawing|contract|specification|requirement/i.test(x)?'8.2':(/supplier|purchas|certif|filler|alloy|raw material|resin|external|vendor/i.test(x)?'8.4':'8.5.1'); };
 var ARMS=[
  ['inp','Inputs','8.2, 8.4, 8.5.1',function(x,c){return INQ[c]||INQ['8.5.1'];},inCl],
  ['outp','Outputs','8.6, 8.7',function(){return 'What must this meet, and how is that confirmed before it is passed on or filed? Show me recent examples.';},function(){return '8.6, 8.7';}],
  ['what','With what','7.1.3, 7.1.5',function(){return 'How is it kept fit for use (maintenance, calibration, validation as applicable)? Show me its current status.';},function(x){return /calibrat|gauge|gage|thermocouple|meter|measur|survey/i.test(x)?'7.1.5':'7.1.3';}],
  ['whom','With whom','7.2',function(){return 'What competence does this role need, and how was it confirmed for the people working today?';},function(){return '7.2';}],
  ['how','How','8.1, 8.5.1, 7.5',function(){return 'Show me the version in use. Is it current, and does the work match it?';},function(){return '8.5.1, 7.5';}],
  ['meas','How measured','9.1.1, 6.2',function(){return 'What is the target, how has it trended, and what was done the last time it missed?';},function(){return '9.1.1, 6.2';}]];
 var split=function(x){ var m=/^(.*?)\s*\|\s*([0-9][0-9.]*(?:\s*[a-z]\))?(?:\s*,\s*[0-9][0-9.]*)*)\s*$/.exec(x); return m?{t:m[1],c:m[2]}:{t:x,c:''}; };
 var L={}, LC={}; ARMS.forEach(function(a){ LC[a[0]]=api.lines(a[0]).map(split); L[a[0]]=LC[a[0]].map(function(o){return o.t;}); });
 var any=ARMS.some(function(a){return L[a[0]].length;});
 if(!any&&!F.proc){ ch.innerHTML=''; tq.innerHTML=''; out.innerHTML=api.flags([],'Name the process and list items under each arm. The turtle diagram, audit questions and checks appear here.'); return; }
 /* diagram */
 var wrap=function(s,mx){var w=String(s).split(/\s+/),o=[],c='';w.forEach(function(t){if((c+' '+t).trim().length>mx&&c){o.push(c);c=t;}else c=(c+' '+t).trim();});if(c)o.push(c);return o;};
 var box=function(x,y,w,h,title,items,fill,mx,maxl){
  var s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="'+fill+'" stroke="#C6CDD3"/><text class="h" x="'+(x+12)+'" y="'+(y+22)+'">'+title+'</text>';
  var ln=[], more=0; items.forEach(function(it){ var ww=wrap(it,mx); if(ln.length+ww.length<=maxl){ ww.forEach(function(t,i){ln.push((i?'   ':'• ')+t);}); } else more++; });
  ln.forEach(function(t,i){ s+='<text x="'+(x+12)+'" y="'+(y+42+i*17)+'">'+esc(t)+'</text>'; });
  if(more) s+='<text class="m" x="'+(x+w-10)+'" y="'+(y+h-8)+'" text-anchor="end">+'+more+' more in the list</text>';
  if(!items.length) s+='<text class="m" x="'+(x+12)+'" y="'+(y+42)+'">Not filled in</text>';
  return s; };
 var W=900,H=620, g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Turtle diagram of the process"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.h{font:700 14px Archivo,sans-serif;fill:#0F3E68}.m{font:italic 12px Archivo,sans-serif;fill:#7C8B99}.p{font:700 17px Archivo,sans-serif;fill:#FFFFFF}.ps{font:12px Archivo,sans-serif;fill:#EDEFEA}</style>';
 g+='<defs><marker id="pta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9C7C1F"/></marker></defs>';
 g+='<line x1="230" y1="180" x2="330" y2="240" stroke="#C6CDD3" stroke-width="3"/><line x1="670" y1="180" x2="570" y2="240" stroke="#C6CDD3" stroke-width="3"/><line x1="230" y1="440" x2="330" y2="380" stroke="#C6CDD3" stroke-width="3"/><line x1="670" y1="440" x2="570" y2="380" stroke="#C6CDD3" stroke-width="3"/>';
 g+=box(10,10,430,170,'With what (resources)',L.what,'#FFFFFF',56,7)+box(460,10,430,170,'With whom (competence)',L.whom,'#FFFFFF',56,7);
 g+=box(10,440,430,170,'How (methods)',L.how,'#FFFFFF',56,7)+box(460,440,430,170,'How measured (KPIs)',L.meas,'#FFFFFF',56,7);
 g+=box(10,205,240,210,'Inputs',L.inp,'#EDEFEA',29,9)+box(650,205,240,210,'Outputs',L.outp,'#EDEFEA',29,9);
 g+='<line x1="252" y1="310" x2="296" y2="310" stroke="#9C7C1F" stroke-width="3" marker-end="url(#pta)"/><line x1="604" y1="310" x2="646" y2="310" stroke="#9C7C1F" stroke-width="3" marker-end="url(#pta)"/>';
 g+='<rect x="300" y="235" width="300" height="150" rx="14" fill="#0F3E68"/>';
 var pl=wrap(F.proc||'Process',24).slice(0,3); pl.forEach(function(t,i){ g+='<text class="p" x="450" y="'+(300-(pl.length-1)*11+i*22)+'" text-anchor="middle">'+esc(t)+'</text>'; });
 if(F.owner) g+='<text class="ps" x="450" y="'+(300+(pl.length-1)*11+30)+'" text-anchor="middle">Owner: '+esc(F.owner.length>36?F.owner.slice(0,35)+'…':F.owner)+'</text>';
 ch.innerHTML=g+'</svg>';
 /* questions */
 var Q=[];
 ARMS.forEach(function(a){ LC[a[0]].forEach(function(o){ var c=o.c||a[4](o.t); Q.push([a[1],o.t,a[3](o.t,c),c]); }); });
 if(F.owner) Q.push(['Owner',F.owner,'How do you know this process achieves its intended results? Show me the last review of its measures and what changed.','4.4.1, 9.1.3']);
 if(F.up) Q.push(['Interfaces',F.up,'When an input from upstream is wrong or late, how is that fed back, and what happened the last time?','4.4.1 b), 8.7']);
 if(F.down) Q.push(['Interfaces',F.down,'How does the receiving process report problems with outputs? Show me recent examples and the response.','4.4.1 b), 9.1.3']);
 tq.innerHTML=Q.length?'<thead><tr><th>Arm</th><th>Item</th><th>Question</th><th>ISO 9001</th></tr></thead><tbody>'+Q.map(function(q,i){return '<tr><td class="mo">'+q[0]+'</td><td class="mi">'+esc(q[1])+'</td><td class="mq">'+esc(q[2])+'</td><td class="mt">'+esc(q[3])+'</td></tr>';}).join('')+'</tbody>':'';
 /* checks */
 var filled=ARMS.filter(function(a){return L[a[0]].length;}).length;
 f.push([filled===6?'ok':'warn','<b>'+filled+' of 6</b> arms filled in, <b>'+Q.length+' audit question'+(Q.length===1?'':'s')+'</b> generated'+(F.proc?' for '+esc(F.proc):'')+'.']);
 var miss=ARMS.filter(function(a){return !L[a[0]].length;}).map(function(a){return a[1];}); if(miss.length) f.push(['warn','Empty: '+miss.join(', ')+'. Every process has something in each arm; an empty arm usually means it was not discussed with the process owner.']);
 var nt=L.meas.filter(function(x){return !/\d/.test(x);}); if(nt.length) f.push(['warn','Measures with no target or number: '+nt.map(esc).join('; ')+'. A measure without a target cannot show whether the process achieves its planned results (ISO 9001 4.4.1 c and 9.1.1).']);
 if(!F.proc) f.push(['warn','Name the process at the center of the turtle.']);
 if(!F.owner) f.push(['warn','No process owner. Someone must be accountable for the process (ISO 9001 4.4.1 e and 5.3).']);
 if(!F.up||!F.down) f.push(['warn','List the '+(!F.up&&!F.down?'supplying and receiving':(!F.up?'supplying':'receiving'))+' processes. Many findings sit at the hand-offs between processes, not inside them.']);
 var nm=L.whom.filter(function(x){return /^[A-Z]\.\s?[A-Z][a-z]+/.test(x);}); if(nm.length) f.push(['','"With whom" lists people by name ('+nm.map(esc).join(', ')+'). Roles with their required competence make better audit criteria; names change.']);
 f.push(['','ISO 9001 clause 4.4.1 asks the organization to determine, for each process, its inputs and outputs, sequence and interaction, criteria and methods including measures, resources, responsibilities, risks and opportunities, and how it is evaluated and improved. The turtle covers most of these; bring the risks from the process risk register and add questions for them.']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Ridgeview Thermal Products',proc:'Coil brazing (aluminum condenser coils)',owner:'Brazing area supervisor',up:'Tube bending and coil lacing',down:'Helium leak test',crit:'ISO 9001:2015, WI-BR-02 rev F, customer drawing notes',
 inp:'Laced coil assemblies with traveler\nCustomer drawing notes\nBrazing filler rings (4047 alloy)\nFlux, lot-certified\nBrazing program sheet from engineering\nDaily production schedule',
 outp:'Brazed coils for leak test\nCompleted traveler with braze parameters\nFurnace temperature chart\nScrap and rework tags',
 what:'Continuous brazing furnace F2 with profile controller\nThermocouple survey kit (calibrated)\nFlux application booth\nFixtures BR-11 to BR-18',
 whom:'Brazing operators qualified to WI-BR-02\nFurnace technician (profile setup)\nQuality technician for first-piece check\nMaintenance for furnace PM',
 how:'WI-BR-02 rev F brazing work instruction\nFurnace profile setup sheet FP-07\nFirst-piece visual and cut-section check\nControl plan CP-114',
 meas:'Leak test first-pass yield, target 98.5%\nBraze rework rate, target below 1.0%\nFurnace downtime, target below 4 h per week\nFlux consumption per coil'}}
}
