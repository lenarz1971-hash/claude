{
slug:'fmea',
sections:[
 {type:'fields',title:'What is being analyzed',cols:4,fields:[
  {id:'item',label:'Process or product',wide:true,ph:'e.g. Pump assembly, line 3, seal installation'},
  {id:'type',label:'FMEA type',type:'select',opts:['Process (PFMEA)','Design (DFMEA)','Other']},
  {id:'team',label:'Team',ph:'Names or roles'},
  {id:'date',label:'Date',type:'date'},
  {id:'rev',label:'Revision',ph:'e.g. A'}]},
 {type:'custom',id:'scale',title:'Scoring scale used here',hint:'S, O and D are each scored 1 to 10. Higher is worse for all three; for detection, 10 means the failure will almost certainly not be caught. Agree your own scale wording with the team before scoring, and keep it with the FMEA.',html:'<div class="pillrow"><span>S &middot; SEVERITY OF THE EFFECT</span><span>O &middot; HOW OFTEN THE CAUSE OCCURS</span><span>D &middot; HOW LIKELY THE FAILURE ESCAPES THE CONTROLS</span><span>RPN = S &times; O &times; D, 1 TO 1000</span></div>'},
 {type:'grid',id:'rows',title:'Failure modes',rows:3,hint:'One row per cause. A failure mode with three causes takes three rows.',cols:[
  {id:'step',label:'Step or function',w:150,type:'textarea',rows:1},
  {id:'mode',label:'Failure mode',w:160,type:'textarea',rows:1},
  {id:'eff',label:'Effect',w:160,type:'textarea',rows:1},
  {id:'s',label:'S',type:'number',min:1,max:10,tip:'Severity 1-10'},
  {id:'cause',label:'Cause',w:160,type:'textarea',rows:1},
  {id:'o',label:'O',type:'number',min:1,max:10,tip:'Occurrence 1-10'},
  {id:'ctl',label:'Current controls',w:160,type:'textarea',rows:1},
  {id:'d',label:'D',type:'number',min:1,max:10,tip:'Detection 1-10'},
  {id:'rpn',label:'RPN',calc:function(r,api){var x=api.num(r.s)*api.num(r.o)*api.num(r.d);return isNaN(x)?'':x;}},
  {id:'act',label:'Recommended action',w:180,type:'textarea',rows:1},
  {id:'who',label:'Owner, due',w:120},
  {id:'s2',label:'S after',type:'number',min:1,max:10},
  {id:'o2',label:'O after',type:'number',min:1,max:10},
  {id:'d2',label:'D after',type:'number',min:1,max:10},
  {id:'rpn2',label:'RPN after',calc:function(r,api){var x=api.num(r.s2)*api.num(r.o2)*api.num(r.d2);return isNaN(x)?'':x;}}]},
 {type:'custom',id:'sum',title:'Where to act first',html:'<p class="noprint"><button type="button" class="tb ghost" id="sortr">Sort rows by RPN, highest first</button></p><div class="out fm-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, rows=S.g.rows, f=[];
 var trs=root.querySelectorAll('table[data-grid="rows"] tbody tr');
 var bad=[];
 rows.forEach(function(r,i){
  ['s','o','d','s2','o2','d2'].forEach(function(k){ var v=n(r[k]); if(r[k]!==''&&r[k]!=null&&(isNaN(v)||v<1||v>10||Math.round(v)!==v)) bad.push('row '+(i+1)+' '+k.toUpperCase().replace('2',' after')); });
  if(trs[i]) trs[i].classList.toggle('hi-row', n(r.s)>=9);
 });
 if(bad.length) f.push(['warn','Scores must be whole numbers from 1 to 10. Check '+bad.join(', ')+'.']);
 var scored=rows.map(function(r,i){return {i:i,r:r,rpn:n(r.s)*n(r.o)*n(r.d)};}).filter(function(x){return !isNaN(x.rpn);});
 if(scored.length){
  var top=scored.slice().sort(function(a,b){return b.rpn-a.rpn;}).slice(0,3);
  f.push(['','Highest RPN: '+top.map(function(x){return '<b>'+api.esc(x.r.mode||('row '+(x.i+1)))+'</b> ('+x.rpn+')';}).join(', ')+'.']);
  var sev=scored.filter(function(x){return n(x.r.s)>=9;});
  if(sev.length) f.push(['warn',sev.length+' row'+(sev.length>1?'s have':' has')+' severity 9 or 10 (shaded). Those need action whatever their RPN: a safety or compliance effect with a low RPN is still a safety or compliance effect.']);
  var same={}; scored.forEach(function(x){ (same[x.rpn]=same[x.rpn]||[]).push(x); });
  Object.keys(same).forEach(function(k){ var g=same[k]; if(g.length>1){ var ss=g.map(function(x){return n(x.r.s);}); if(Math.max.apply(null,ss)!==Math.min.apply(null,ss)) f.push(['warn','RPN '+k+' appears '+g.length+' times with different severities ('+ss.join(', ')+'). Equal RPNs are not equal risks; rank the higher severity first.']); } });
  var noact=top.filter(function(x){return !x.r.act;});
  if(noact.length) f.push(['warn',noact.length+' of the top '+top.length+' rows '+(noact.length===1?'has':'have')+' no recommended action yet.']);
  var done=scored.filter(function(x){return !isNaN(n(x.r.s2)*n(x.r.o2)*n(x.r.d2));});
  done.forEach(function(x){ var a=n(x.r.s2)*n(x.r.o2)*n(x.r.d2); f.push([a<x.rpn?'ok':'warn',api.esc(x.r.mode||('Row '+(x.i+1)))+': RPN '+x.rpn+' to '+a+(a<x.rpn?' after action.':', no reduction. Check the action addressed the cause.')]); });
 }
 root.querySelector('.fm-out').innerHTML=f.length?f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join(''):'<p>Score some rows and the ranking appears here.</p>';
 root.querySelector('#sortr').onclick=function(){ S.g.rows.sort(function(a,b){ var x=n(a.s)*n(a.o)*n(a.d), y=n(b.s)*n(b.o)*n(b.d); x=isNaN(x)?-1:x; y=isNaN(y)?-1:y; return y-x || (n(b.s)||0)-(n(a.s)||0); }); api.save(); api.rerender(); };
},
example:{f:{item:'Pump assembly, line 3, seal installation',type:'Process (PFMEA)',team:'Quality engineer, assembly lead, maintenance',date:'2026-09-14',rev:'A'},
 g:{rows:[
  {step:'Install O-ring in groove',mode:'Seal nicked',eff:'Leak in the field; warranty return',s:'8',cause:'Seal dragged over thread without a sleeve',o:'6',ctl:'Leak test at final',d:'5',act:'Add installation sleeve; add step to WI-3107',who:'ME, Oct 10',s2:'8',o2:'2',d2:'5'},
  {step:'Install O-ring in groove',mode:'Seal nicked',eff:'Leak in the field; warranty return',s:'8',cause:'Burr on housing cross-drill',o:'4',ctl:'First-piece visual',d:'7',act:'Deburr check added at machining',who:'Machining lead, Oct 24',s2:'',o2:'',d2:''},
  {step:'Install O-ring in groove',mode:'Seal missing',eff:'Gross leak, pump fails at customer start-up',s:'9',cause:'Operator skips step when the line is short-staffed',o:'2',ctl:'Leak test at final',d:'3',act:'',who:'',s2:'',o2:'',d2:''},
  {step:'Torque cover bolts',mode:'Under-torqued',eff:'Cover loosens; leak',s:'7',cause:'Tool out of calibration',o:'3',ctl:'Daily torque check',d:'4',act:'',who:'',s2:'',o2:'',d2:''}]}}
}
