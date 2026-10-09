{
slug:'gauge-resolution-10-to-1',
cv:function(v,from,to){ if(from===to) return v; return from==='in'?v*25.4:v/25.4; },
ev:function(r,api){
 var T=window.TOOL, S=api.state(), n=api.num, su=r.su||'', iu=r.iu||su, lo=n(r.lo), hi=n(r.hi), res=n(r.res), acc=Math.abs(n(r.acc));
 var RR=n(S.f.rr), AR=n(S.f.ar); if(isNaN(RR)||RR<=0) RR=10; if(isNaN(AR)||AR<=0) AR=4;
 var o={ok:su&&!isNaN(lo)&&!isNaN(hi)&&hi>lo, su:su, RR:RR, AR:AR};
 if(!o.ok) return o;
 o.tol=hi-lo;
 o.resS=isNaN(res)||res<=0?NaN:T.cv(res,iu,su);
 o.accS=isNaN(acc)||acc<=0?NaN:T.cv(acc,iu,su);
 o.rr=o.tol/o.resS; o.ar=(o.tol/2)/o.accS;
 o.rOk=!isNaN(o.rr)&&o.rr>=RR-1e-9; o.aOk=isNaN(o.ar)?null:o.ar>=AR-1e-9;
 o.v=isNaN(o.rr)?'':(o.rOk&&o.aOk!==false?'ok':'no');
 return o;
},
sections:[
 {type:'fields',title:'Rules applied',cols:3,hint:'The rule of ten compares the instrument resolution with the total tolerance. The accuracy check compares the half tolerance with the instrument accuracy (both stated as ±). Use the ratios your quality manual or customer specifies if they differ.',fields:[
  {id:'part',label:'Part or inspection plan',wide:true},
  {id:'rr',label:'Minimum tolerance ÷ resolution',type:'number',min:1,ph:'10'},
  {id:'ar',label:'Minimum ± tolerance ÷ ± accuracy',type:'number',min:1,ph:'4'}]},
 {type:'grid',id:'c',title:'Characteristics and proposed instruments',rows:5,hint:'Specification limits in the drawing units. Resolution is the smallest increment the instrument displays; accuracy is the ± figure on its calibration certificate or data sheet, in the instrument units. 1 in = 25.4 mm exactly.',cols:[
  {id:'ch',label:'Characteristic',w:150,type:'textarea',rows:1},
  {id:'su',w:70,label:'Spec units',type:'select',opts:['in','mm']},
  {id:'lo',w:86,label:'Lower limit',type:'number'},
  {id:'hi',w:86,label:'Upper limit',type:'number'},
  {id:'ins',label:'Instrument',w:130,type:'textarea',rows:1},
  {id:'iu',w:70,label:'Instrument units',type:'select',opts:['in','mm']},
  {id:'res',w:86,label:'Resolution',type:'number',min:0},
  {id:'acc',w:86,label:'Accuracy ±',type:'number',min:0},
  {id:'cv',label:'Limits in other unit',calc:function(r,api){var T=window.TOOL,n=api.num,lo=n(r.lo),hi=n(r.hi);if(!r.su||isNaN(lo)||isNaN(hi))return '';var o=r.su==='in'?'mm':'in',d=o==='mm'?3:4;return T.cv(lo,r.su,o).toFixed(d)+' – '+T.cv(hi,r.su,o).toFixed(d)+' '+o;}},
  {id:'rr',label:'Tol ÷ res',calc:function(r,api){var o=window.TOOL.ev(r,api);return o.ok&&!isNaN(o.rr)?'<b class="'+(o.rOk?'gp-ok':'gp-bad')+'">'+o.rr.toFixed(1)+' : 1</b>':'';}},
  {id:'ar',label:'±Tol ÷ ±acc',calc:function(r,api){var o=window.TOOL.ev(r,api);return o.ok&&!isNaN(o.ar)?'<b class="'+(o.aOk?'gp-ok':'gp-bad')+'">'+o.ar.toFixed(1)+' : 1</b>':(o.ok&&!isNaN(o.rr)?'no accuracy':'');}},
  {id:'v',label:'Verdict',calc:function(r,api){var o=window.TOOL.ev(r,api);return o.v==='ok'?'<b class="gp-ok">Adequate</b>':o.v==='no'?'<b class="gp-bad">Not adequate</b>':'';}}]},
 {type:'custom',id:'res',title:'Checks',html:'<div class="out gr-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), fl=[], all=S.g.c.filter(function(r){return r.ch||r.lo||r.hi||r.ins;});
 var ev=all.map(function(r){return {r:r,o:T.ev(r,api)};}), done=ev.filter(function(x){return x.o.v;});
 if(done.length){ var ok=done.filter(function(x){return x.o.v==='ok';}).length; fl.push([ok===done.length?'ok':'warn','<b>'+ok+' of '+done.length+'</b> instrument choices are adequate under the '+done[0].o.RR+':1 resolution and '+done[0].o.AR+':1 accuracy rules.']); }
 ev.forEach(function(x,i){ var o=x.o, nm=api.esc(x.r.ch||('Row '+(i+1))), ins=api.esc(x.r.ins||'the instrument'), su=o.su, d=su==='mm'?4:5;
  if(!o.ok){ fl.push(['warn','<b>'+nm+'</b>: needs spec units and a lower limit smaller than the upper limit.']); return; }
  if(isNaN(o.rr)){ fl.push(['warn','<b>'+nm+'</b>: enter the resolution of '+ins+'.']); return; }
  if(!o.rOk) fl.push(['warn','<b>'+nm+'</b>: '+ins+' resolves '+api.fmt(o.resS,d)+' '+su+' against a tolerance of '+api.fmt(o.tol,d)+' '+su+' ('+o.rr.toFixed(1)+':1). It needs a resolution of '+api.fmt(o.tol/o.RR,d)+' '+su+' ('+api.fmt(T.cv(o.tol/o.RR,su,su==='in'?'mm':'in'),su==='in'?4:5)+' '+(su==='in'?'mm':'in')+') or finer.']);
  if(o.aOk===false) fl.push(['warn','<b>'+nm+'</b>: accuracy ± '+api.fmt(o.accS,d)+' '+su+' uses '+(100/o.ar).toFixed(0)+'% of the ± '+api.fmt(o.tol/2,d)+' tolerance. Readings near the limits cannot be trusted to accept or reject.']);
  if(o.aOk===null) fl.push(['warn','<b>'+nm+'</b>: no accuracy entered for '+ins+'. Resolution alone does not show the instrument is accurate enough.']);
 });
 if(done.length){
  var mixed=done.filter(function(x){return x.r.iu&&x.r.iu!==x.r.su;}).length;
  if(mixed) fl.push(['',mixed+' instrument'+(mixed>1?'s read':' reads')+' in different units from the drawing. Conversions here use 1 in = 25.4 mm exactly; carry at least one more decimal place than the tolerance when converting, and round only the final result.']);
  fl.push(['','Resolution is what the instrument displays, not what it can be trusted to. A display with more digits than the accuracy supports shows precision it does not have; that is why the accuracy check sits beside the rule of ten.']);
 }
 root.querySelector('.gr-out').innerHTML=api.flags(fl,'Add a characteristic and the instrument you plan to use.');
},
example:{f:{part:'Catheter hub HB-220, incoming and first article inspection',rr:'10',ar:'4'},
 g:{c:[{ch:'Hub bore diameter',su:'mm',lo:'4.000',hi:'4.050',ins:'Digital caliper, 6 in',iu:'in',res:'0.0005',acc:'0.001'},
  {ch:'Hub bore diameter',su:'mm',lo:'4.000',hi:'4.050',ins:'Digital bore gauge',iu:'mm',res:'0.001',acc:'0.002'},
  {ch:'Flange outside diameter',su:'in',lo:'0.745',hi:'0.755',ins:'Outside micrometer, 0 to 1 in',iu:'in',res:'0.0001',acc:'0.0001'},
  {ch:'Overall length',su:'in',lo:'1.240',hi:'1.260',ins:'Digital caliper, 150 mm',iu:'mm',res:'0.01',acc:'0.02'},
  {ch:'Flange wall thickness',su:'mm',lo:'0.38',hi:'0.42',ins:'Steel rule, 1/64 in graduations',iu:'in',res:'0.015625',acc:''}]}}
}
