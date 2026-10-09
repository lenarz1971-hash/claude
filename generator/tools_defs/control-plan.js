{
slug:'control-plan',
sections:[
 {type:'fields',title:'Header',cols:4,fields:[
  {id:'part',label:'Part or process',wide:true,ph:'e.g. Pump assembly 4410, line 3'},
  {id:'phase',label:'Phase',type:'select',opts:['Prototype','Pre-launch','Production']},
  {id:'num',label:'Control plan number'},
  {id:'rev',label:'Revision'},
  {id:'date',label:'Date',type:'date'},
  {id:'owner',label:'Process owner'},
  {id:'contact',label:'Key contact'},
  {id:'team',label:'Core team',wide:true}]},
 {type:'grid',id:'rows',title:'What is controlled, and how',rows:3,hint:'One row per characteristic. <b>Product</b> characteristics are on the part (a diameter); <b>process</b> characteristics are settings that drive them (a press force). The reaction plan says what happens when the check fails, not just that someone is told.',cols:[
  {id:'step',label:'Process step',w:130,type:'textarea',rows:1},
  {id:'mach',label:'Machine, tool, fixture',w:120,type:'textarea',rows:1},
  {id:'char',label:'Characteristic',w:140,type:'textarea',rows:1},
  {id:'kind',label:'Product or process',type:'select',opts:['Product','Process']},
  {id:'sc',label:'Special',type:'select',opts:['','Critical','Significant'],tip:'Special characteristic class, if any'},
  {id:'spec',label:'Specification, tolerance',w:120,type:'textarea',rows:1},
  {id:'meas',label:'Measurement technique',w:130,type:'textarea',rows:1},
  {id:'n',label:'Sample size',w:70},
  {id:'freq',label:'Frequency',w:100},
  {id:'meth',label:'Control method',w:130,type:'textarea',rows:1},
  {id:'react',label:'Reaction plan',w:180,type:'textarea',rows:1}]},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out cp-out"></div>'}
],
update:function(root,api){
 var S=api.state(), rows=S.g.rows.filter(function(r){return r.char;}), f=[];
 if(!rows.length){ root.querySelector('.cp-out').innerHTML='<p>Add characteristics and the checks appear here.</p>'; return; }
 var noR=rows.filter(function(r){return !r.react;}), weak=rows.filter(function(r){return r.react&&/^\s*(notify|inform|tell|call|contact|escalate)( the)? (supervisor|lead|quality|engineer|manager)\.?\s*$/i.test(r.react);});
 var noM=rows.filter(function(r){return !r.meas;}), noF=rows.filter(function(r){return !r.freq;});
 var spec=rows.filter(function(r){return r.sc;});
 var specWeak=spec.filter(function(r){return r.meth&&/visual|first.piece|first piece|audit/i.test(r.meth)&&!/spc|chart|100%|poka|error.proof|mistake/i.test(r.meth);});
 f.push(['',rows.length+' characteristics: '+rows.filter(function(r){return r.kind==='Product';}).length+' product, '+rows.filter(function(r){return r.kind==='Process';}).length+' process, '+spec.length+' marked special.']);
 if(noR.length) f.push(['warn',noR.length+' row'+(noR.length>1?'s have':' has')+' no reaction plan: '+noR.map(function(r){return api.esc(r.char);}).join(', ')+'. A check with no reaction plan finds problems and lets them through.']);
 if(weak.length) f.push(['warn','The reaction plan for '+weak.map(function(r){return api.esc(r.char);}).join(', ')+' only says who to tell. Say what happens to the suspect parts and the process: stop, contain back to the last good check, correct, verify.']);
 if(noM.length) f.push(['warn','No measurement technique for '+noM.map(function(r){return api.esc(r.char);}).join(', ')+'.']);
 if(noF.length) f.push(['warn','No sample size or frequency for '+noF.map(function(r){return api.esc(r.char);}).join(', ')+'.']);
 if(specWeak.length) f.push(['warn','Special characteristic'+(specWeak.length>1?'s ':' ')+specWeak.map(function(r){return api.esc(r.char);}).join(', ')+(specWeak.length>1?' are':' is')+' controlled only by visual or first-piece checks. Special characteristics usually call for stronger control: SPC, 100% check or error-proofing.']);
 if(S.g.rows.length&&!S.g.rows.some(function(r){return r.kind==='Process';})) f.push(['warn','Every row is a product characteristic. Controlling the process settings that drive them catches problems before parts are made.']);
 if(!noR.length&&!noM.length&&!noF.length&&!weak.length) f.push(['ok','Every characteristic has a measurement, a frequency and a reaction plan.']);
 root.querySelector('.cp-out').innerHTML=f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join('');
},
example:{f:{part:'Pump assembly 4410, line 3',phase:'Production',num:'CP-4410-03',rev:'B',date:'2026-12-18',owner:'Line 3 supervisor',contact:'Quality engineer',team:'Quality engineer, line 3 supervisor, maintenance, assembly lead'},
 g:{rows:[
  {step:'Machine housing cross-drill',mach:'CNC cell 2, deburr tool',char:'Burr at cross-drill',kind:'Product',sc:'Significant',spec:'No burr; edge break 0.2-0.5 mm',meas:'Visual with 10x loupe, edge gauge',n:'5',freq:'Each hour',meth:'Check sheet, SPC on edge break',react:'Stop the cell. Quarantine parts back to the last good check. Replace the deburr tool. Re-check 5 before restart.'},
  {step:'Install O-ring',mach:'Installation sleeve, fixture F-31',char:'Sleeve fitted and undamaged',kind:'Process',sc:'',spec:'Sleeve present, no cuts',meas:'Visual',n:'1',freq:'Start of shift and each tool change',meth:'Start-up checklist',react:'Do not build. Replace the sleeve from the crib. Check the last 20 assemblies for nicks.'},
  {step:'Install O-ring',mach:'',char:'O-ring seal integrity (no nicks)',kind:'Product',sc:'Critical',spec:'No nicks or cuts',meas:'Leak test 2.5 bar, 30 s',n:'All',freq:'100%',meth:'Automatic leak test, reject lockout',react:'Notify the supervisor.'},
  {step:'Torque cover bolts',mach:'DC nutrunner NR-7',char:'Cover bolt torque',kind:'Process',sc:'Significant',spec:'12 ± 1 N·m',meas:'Nutrunner controller log',n:'All',freq:'Every cycle',meth:'Controller limits, X̄-R chart daily',react:'Line stops on out-of-limit. Re-torque and re-test the assembly. Maintenance checks calibration.'}]}}
}
