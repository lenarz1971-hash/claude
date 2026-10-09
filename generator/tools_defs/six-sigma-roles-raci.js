{
slug:'six-sigma-roles-raci',
sections:[
 {type:'custom',id:'key',title:'How to read it',html:'<div class="pillrow"><span>R &middot; RESPONSIBLE: DOES THE WORK</span><span>A &middot; ACCOUNTABLE: OWNS THE OUTCOME, ONE PER ROW</span><span>C &middot; CONSULTED: ASKED BEFORE</span><span>I &middot; INFORMED: TOLD AFTER</span></div>'},
 {type:'fields',title:'Project',fields:[{id:'name',label:'Project',wide:true}]},
 {type:'grid',id:'m',title:'Who does what',rows:4,hint:'One row per activity or decision. Leave a cell blank if that role has no part in it. Rename nothing here; if your organization does not use a role, leave its column blank.',cols:[
  {id:'act',label:'Activity or decision',w:220,type:'textarea',rows:1},
  {id:'ex',label:'Executive',type:'select',opts:['R','A','C','I']},
  {id:'ch',label:'Champion / sponsor',type:'select',opts:['R','A','C','I']},
  {id:'po',label:'Process owner',type:'select',opts:['R','A','C','I']},
  {id:'mbb',label:'Master Black Belt',type:'select',opts:['R','A','C','I']},
  {id:'bb',label:'Black Belt',type:'select',opts:['R','A','C','I']},
  {id:'gb',label:'Green Belt',type:'select',opts:['R','A','C','I']},
  {id:'yb',label:'Yellow Belt',type:'select',opts:['R','A','C','I']},
  {id:'tm',label:'Team member',type:'select',opts:['R','A','C','I']},
  {id:'ok',label:'Check',calc:function(r){ if(!r.act) return ''; var ks=['ex','ch','po','mbb','bb','gb','yb','tm'], a=ks.filter(function(k){return r[k]==='A';}).length, rr=ks.filter(function(k){return r[k]==='R';}).length; if(a!==1) return '<span style="color:#C0392B">'+a+' A</span>'; if(!rr) return '<span style="color:#C0392B">no R</span>'; return '<span style="color:var(--green)">OK</span>'; }}]},
 {type:'custom',id:'sum',title:'Checks',html:'<div class="out rc-out"></div>'}
],
update:function(root,api){
 var S=api.state(), ks=[['ex','Executive'],['ch','Champion / sponsor'],['po','Process owner'],['mbb','Master Black Belt'],['bb','Black Belt'],['gb','Green Belt'],['yb','Yellow Belt'],['tm','Team member']];
 var rows=S.g.m.filter(function(r){return r.act;}), f=[];
 rows.forEach(function(r){ var a=ks.filter(function(k){return r[k[0]]==='A';}), rr=ks.filter(function(k){return r[k[0]]==='R';});
  if(a.length===0) f.push(['warn','<b>'+api.esc(r.act)+'</b>: nobody is accountable. Exactly one role should own the outcome.']);
  if(a.length>1) f.push(['warn','<b>'+api.esc(r.act)+'</b>: '+a.map(function(k){return k[1];}).join(' and ')+' are both accountable. When two people own a decision, neither does.']);
  if(!rr.length) f.push(['warn','<b>'+api.esc(r.act)+'</b>: nobody is responsible for doing the work.']);
  if(rr.length>3) f.push(['','<b>'+api.esc(r.act)+'</b>: '+rr.length+' roles are responsible. Check the work is really shared, or split the row.']);
 });
 if(rows.length){
  ks.forEach(function(k){ var c=rows.filter(function(r){return r[k[0]];}).length, aa=rows.filter(function(r){return r[k[0]]==='A';}).length;
   if(aa>Math.max(2,rows.length*0.6)) f.push(['','The '+k[1]+' is accountable for '+aa+' of '+rows.length+' activities. That may be a bottleneck.']); });
  var idle=ks.filter(function(k){return !rows.some(function(r){return r[k[0]];});}).map(function(k){return k[1];});
  if(idle.length) f.push(['','No part in any activity: '+idle.join(', ')+'.']);
  if(!f.some(function(x){return x[0]==='warn';})) f.unshift(['ok','Every activity has exactly one accountable role and at least one responsible.']);
 }
 root.querySelector('.rc-out').innerHTML=api.flags(f,'Add activities and the checks appear here.');
},
example:{f:{name:'Reduce seal-nick rejects on line 3'},g:{m:[
 {act:'Select and approve the project',ex:'A',ch:'R',po:'C',mbb:'C',bb:'',gb:'I',yb:'',tm:''},
 {act:'Write the charter',ex:'',ch:'A',po:'C',mbb:'',bb:'C',gb:'R',yb:'I',tm:''},
 {act:'Collect baseline data',ex:'',ch:'I',po:'C',mbb:'',bb:'',gb:'A',yb:'R',tm:'R'},
 {act:'Analyze root cause',ex:'',ch:'I',po:'C',mbb:'C',bb:'C',gb:'A',yb:'R',tm:'C'},
 {act:'Approve the solution and its cost',ex:'I',ch:'A',po:'A',mbb:'',bb:'',gb:'R',yb:'I',tm:'I'},
 {act:'Run the control plan after handover',ex:'',ch:'I',po:'A',mbb:'',bb:'',gb:'C',yb:'I',tm:'R'}]}}
}
