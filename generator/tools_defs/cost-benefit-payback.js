{
slug:'cost-benefit-payback',
sections:[
 {type:'fields',title:'Assumptions',cols:3,fields:[{id:'name',label:'Decision being made',wide:true},{id:'yrs',label:'Years to evaluate',type:'number',min:1,max:20,ph:'3'},{id:'rate',label:'Discount rate %',type:'number',min:0,ph:'8',hint:'For net present value. Ask finance for the rate your company uses.'}]},
 {type:'grid',id:'o',title:'Options',rows:3,hint:'One row per option. One-time cost is the up-front spend; annual figures are per year once running. Benefits are savings or added revenue; ongoing cost is what it costs to keep running.',cols:[
  {id:'opt',label:'Option',w:200,type:'textarea',rows:1},{id:'once',label:'One-time cost $',type:'number',min:0},{id:'ben',label:'Annual benefit $',type:'number',min:0},{id:'run',label:'Annual ongoing cost $',type:'number',min:0},
  {id:'net',label:'Net per year',calc:function(r,api){var b=api.num(r.ben)||0,c=api.num(r.run)||0,v=b-c;return r.opt?(v<0?'\u2212$':'$')+api.fmt(Math.abs(v),0):'';}},
  {id:'pb',label:'Payback',calc:function(r,api){var o=api.num(r.once)||0,net=(api.num(r.ben)||0)-(api.num(r.run)||0);if(!r.opt)return '';if(net<=0)return 'Never';return o?(o/net*12).toFixed(1)+' mo':'Immediate';}}]},
 {type:'custom',id:'res',title:'Comparison',html:'<div class="tgw"><table class="mv cb"></table></div><div class="out cb-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, Y=Math.round(n(S.f.yrs)); if(isNaN(Y)||Y<1) Y=3; var R=n(S.f.rate); if(isNaN(R)) R=8; var r=R/100;
 var rows=S.g.o.filter(function(x){return x.opt;}), $m=function(v){return (v<0?'\u2212$':'$')+api.fmt(Math.abs(v),0);};
 var res=rows.map(function(x){ var o=n(x.once)||0, net=(n(x.ben)||0)-(n(x.run)||0), npv=-o; for(var t=1;t<=Y;t++) npv+=net/Math.pow(1+r,t); var tot=net*Y-o; return {o:x.opt,once:o,net:net,tot:tot,npv:npv,roi:o?tot/o*100:NaN,pb:net>0?(o?o/net*12:0):Infinity}; });
 root.querySelector('table.cb').innerHTML=res.length?'<thead><tr><th>Option</th><th>Net over '+Y+' yr</th><th>NPV at '+R+'%</th><th>ROI over '+Y+' yr</th><th>Payback</th></tr></thead><tbody>'+res.map(function(x){return '<tr><td class="mo">'+api.esc(x.o)+'</td><td class="mt">'+$m(x.tot)+'</td><td class="mt">'+$m(x.npv)+'</td><td class="mt">'+(isNaN(x.roi)?'—':x.roi.toFixed(0)+'%')+'</td><td class="mt">'+(x.pb===Infinity?'Never':x.pb===0?'Immediate':x.pb.toFixed(1)+' mo')+'</td></tr>';}).join('')+'</tbody>':'';
 var f=[];
 if(res.length){
  var best=res.slice().sort(function(a,b){return b.npv-a.npv;})[0], fast=res.filter(function(x){return x.pb!==Infinity;}).sort(function(a,b){return a.pb-b.pb;})[0];
  f.push([best.npv>0?'ok':'warn','Highest net present value: <b>'+api.esc(best.o)+'</b>, '+$m(best.npv)+' over '+Y+' years at '+R+'%.'+(best.npv<=0?' No option pays back its cost in that time.':'')]);
  if(fast&&fast!==best) f.push(['','Fastest payback: <b>'+api.esc(fast.o)+'</b> ('+(fast.pb===0?'immediate':fast.pb.toFixed(1)+' months')+'). The fastest payback and the best long-run value are different options; which matters more is a business decision.']);
  res.forEach(function(x){ if(x.net<=0) f.push(['warn','<b>'+api.esc(x.o)+'</b> costs more to run each year than it saves. It never pays back.']); });
  f.push(['','Net present value discounts each future year\'s net benefit by the discount rate, because a dollar next year is worth less than a dollar now. Payback ignores that and everything after the payback point.']);
 }
 root.querySelector('.cb-out').innerHTML=api.flags(f,'Add options to compare.');
},
example:{f:{name:'How to stop seal nicks on line 3',yrs:'3',rate:'8'},
 g:{o:[{opt:'Installation sleeve and updated work instruction',once:'2400',ben:'58000',run:'600'},{opt:'Automated seal press with vision check',once:'145000',ben:'72000',run:'9000'},{opt:'Extra inspector on second shift',once:'0',ben:'30000',run:'52000'}]}}
}
