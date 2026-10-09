{
slug:'kaizen-pdca-planner',
sections:[
 {type:'fields',title:'The event',cols:4,hint:'A kaizen blitz (kaizen event) is a short, focused improvement on one area, usually three to five days, by a small team who do the work there. Plan the scope tightly; a blitz that tries to fix a whole plant fixes nothing.',fields:[
  {id:'area',label:'Area and process',wide:true},{id:'start',label:'Start',type:'date'},{id:'days',label:'Days',type:'number',min:1},{id:'lead',label:'Facilitator'},{id:'spon',label:'Sponsor'},
  {id:'team',label:'Team, one person per row',type:'datagrid',cols:[{label:'Name and role',type:'text',ph:'Dana Ruiz, assembler'}],rows:6,minRows:3,hint:'Most should be people who do the work in the area.'}]},
 {type:'fields',title:'Plan',hint:'Write the prediction before the change. A PDCA cycle without a prediction cannot tell you whether you understood the process or got lucky.',fields:[
  {id:'prob',label:'Problem and current condition',type:'textarea',wide:true},
  {id:'metric',label:'Measure of success'},{id:'base',label:'Baseline',type:'number'},
  {id:'change',label:'Change to be tried',type:'textarea',wide:true},
  {id:'pred',label:'Prediction: what will happen to the measure',type:'number',hint:'The value you expect after the change.'},{id:'why',label:'Why you expect it',type:'textarea'}]},
 {type:'fields',title:'Do',fields:[{id:'did',label:'What was actually done, and any differences from the plan',type:'textarea',wide:true}]},
 {type:'fields',title:'Check',fields:[{id:'act',label:'Actual result',type:'number'},{id:'obs',label:'What else was observed',type:'textarea'}]},
 {type:'custom',id:'cmp',title:'Prediction against result',html:'<div class="out kz-out"></div>'},
 {type:'fields',title:'Act',fields:[{id:'dec',label:'Decision',type:'select',opts:['Adopt: standardize the change','Adapt: change it and run another cycle','Abandon: try something else']},{id:'std',label:'How it will be standardized or what the next cycle tests',type:'textarea',wide:true}]},
 {type:'grid',id:'ac',title:'Action list (30-day follow-up)',rows:3,cols:[{id:'a',label:'Action',w:260,type:'textarea',rows:1},{id:'who',label:'Who',w:110},{id:'due',label:'Due',type:'date'},{id:'done',label:'Done',type:'date'}]}
],
update:function(root,api){
 var S=api.state(), n=api.num, b=n(S.f.base), p=n(S.f.pred), a=n(S.f.act), f=[];
 if(!isNaN(b)&&!isNaN(p)){
  f.push(['','Predicted change: '+api.fmt(b,2)+' → '+api.fmt(p,2)+' ('+(b?((p-b)/Math.abs(b)*100).toFixed(0)+'%':'')+').']);
  if(!isNaN(a)){
   var pc=p-b, ac=a-b, ratio=pc?ac/pc:NaN;
   f.push(['','Actual: '+api.fmt(b,2)+' → '+api.fmt(a,2)+' ('+(b?((a-b)/Math.abs(b)*100).toFixed(0)+'%':'')+').']);
   if(isNaN(ratio)) f.push(['','No change was predicted.']);
   else if(ratio<0) f.push(['warn','The measure moved the <b>opposite way</b> to the prediction. The theory behind the change needs another look before trying again.']);
   else if(ratio<0.5) f.push(['warn','The result achieved '+Math.round(ratio*100)+'% of the predicted improvement. Something about the process is not as the team believed; find out what before adopting.']);
   else if(ratio<=1.5) f.push(['ok','The result is close to the prediction ('+Math.round(ratio*100)+'% of the predicted improvement). The team understood the process well enough to predict it.']);
   else f.push(['','The result beat the prediction ('+Math.round(ratio*100)+'%). Good news, and also a sign something else changed too; check before crediting the change with all of it.']);
  } else f.push(['','Record the actual result in Check to compare.']);
 } else f.push(['','Enter a baseline and a prediction in Plan.']);
 if(S.f.act&&!S.f.dec) f.push(['','Record the decision in Act.']);
 if(S.f.dec&&S.f.dec.indexOf('Adopt')===0&&!S.f.std) f.push(['warn','Adopted but not yet standardized. Without an updated work instruction or control plan, the change will drift back.']);
 var open=S.g.ac.filter(function(r){return r.a&&!r.done;}); if(open.length) f.push(['',open.length+' follow-up action'+(open.length>1?'s':'')+' still open.']);
 var team=api.lines('team').length; if(team&&(team<3||team>10)) f.push(['',team+' people on the team. Four to eight is the usual size for a blitz.']);
 root.querySelector('.kz-out').innerHTML=api.flags(f);
},
example:{f:{area:'Line 3 assembly: seal installation station',start:'2026-10-12',days:'3',lead:'CI coordinator',spon:'Line 3 supervisor',team:'Two assemblers (first and second shift)\nMaintenance technician\nYellow Belt\nQuality technician',
 prob:'Assemblers walk to the crib for installation sleeves and reach across the fixture for O-rings. Station cycle 74 s against a takt of 60 s.',
 metric:'Station cycle time, s',base:'74',change:'Shadow board with two spare sleeves at the station; O-ring dispenser moved to the left of the fixture; sleeve check added to start-up.',pred:'62',why:'Time study: walking and reaching account for 13 s of the 74 s.',
 did:'All three changes made on day 2. Dispenser mounted 10 cm higher than planned to clear the guard.',act:'64',obs:'Second-shift assembler asked for the same board at final test.',
 dec:'Adopt: standardize the change',std:'WI-3107 rev E with the new layout photo; shadow board on the 5S audit.'},
 g:{ac:[{a:'Update WI-3107 with the layout photo',who:'ME',due:'2026-10-23',done:''},{a:'Add the shadow board to the 5S audit sheet',who:'Line 3 supervisor',due:'2026-10-30',done:''},{a:'Look at the same change for final test',who:'Yellow Belt',due:'2026-11-13',done:''}]}}
}
