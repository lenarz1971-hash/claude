{
slug:'tolerance-stack-up',
ev:function(r,api){
 var n=api.num, nom=n(r.nom), tp=Math.abs(n(r.tp)), tm=Math.abs(n(r.tm)), nt=isNaN(tp)&&isNaN(tm);
 if(isNaN(tp)) tp=0; if(isNaN(tm)) tm=0;
 var s=(r.dir||'').charAt(0)==='−'?-1:((r.dir||'').charAt(0)==='+'?1:0);
 return {ok:!isNaN(nom)&&s!==0, nt:nt, s:s, nom:nom, mean:nom+(tp-tm)/2, half:(tp+tm)/2};
},
dp:function(api){ return api.state().f.unit==='mm'?3:4; },
sections:[
 {type:'fields',title:'The gap you are calculating',cols:3,hint:'Start at one side of the gap and walk the loop of dimensions around to the other side. Dimensions that make the gap bigger are +, those that make it smaller are −.',fields:[
  {id:'name',label:'Assembly and gap',wide:true},
  {id:'unit',label:'Units',type:'select',opts:['in','mm']},
  {id:'gmin',label:'Required gap minimum',type:'number',hint:'Use a negative number for an interference fit.'},
  {id:'gmax',label:'Required gap maximum',type:'number',hint:'Leave blank if there is no upper limit.'}]},
 {type:'grid',id:'s',title:'Dimension chain',rows:4,hint:'Enter both tolerances as positive numbers. 2.500 +0.005 / −0.002 is plus tol 0.005, minus tol 0.002. Unequal tolerances are converted to a mean dimension with an equal bilateral tolerance.',cols:[
  {id:'dim',label:'Dimension',w:190,type:'textarea',rows:1},
  {id:'dir',label:'Direction',type:'select',opts:['+ increases gap','− decreases gap']},
  {id:'nom',w:86,label:'Nominal',type:'number'},
  {id:'tp',w:86,label:'Plus tol',type:'number',min:0},
  {id:'tm',w:86,label:'Minus tol',type:'number',min:0},
  {id:'eq',label:'Mean ± equal tol',calc:function(r,api){var o=window.TOOL.ev(r,api),d=window.TOOL.dp(api);return o.ok?o.mean.toFixed(d)+' ± '+o.half.toFixed(d):(r.dim?'<span class="gp-bad">needs direction and nominal</span>':'');}}]},
 {type:'custom',id:'res',title:'Stack-up result',html:'<div class="tgw"><table class="mv ts"></table></div><div class="svgw ts-svg"></div><div class="out ts-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), f=S.f, n=api.num, d=T.dp(api), u=api.esc(f.unit||'');
 var rows=S.g.s.map(function(r){return {r:r,o:T.ev(r,api)};}).filter(function(x){return x.o.ok;});
 var fx=function(v){return (v<0?'−':'')+api.fmt(Math.abs(v),d);}, fl=[], tb=root.querySelector('table.ts'), sv=root.querySelector('.ts-svg');
 var bad=S.g.s.filter(function(r){return (r.dim||r.nom)&&!T.ev(r,api).ok;}).length;
 if(bad) fl.push(['warn',bad+' row'+(bad>1?'s are':' is')+' missing a direction or nominal and '+(bad>1?'are':'is')+' left out of the stack.']);
 var nt=rows.filter(function(x){return x.o.nt;}).map(function(x){return '<b>'+api.esc(x.r.dim||'unnamed row')+'</b>';});
 if(nt.length) fl.push(['warn',nt.join(', ')+(nt.length>1?' have':' has')+' no tolerance entered and '+(nt.length>1?'are':'is')+' counted as exact (± 0). Enter the tolerance from the drawing, or the title block default if none is shown.']);
 if(!rows.length){ tb.innerHTML=''; sv.innerHTML=''; root.querySelector('.ts-out').innerHTML=api.flags(fl,'Add the dimensions in the loop to see the stack.'); return; }
 var gn=0, gm=0, sw=0, sq=0;
 rows.forEach(function(x){ gn+=x.o.s*x.o.nom; gm+=x.o.s*x.o.mean; sw+=x.o.half; sq+=x.o.half*x.o.half; });
 var rss=Math.sqrt(sq), lo=n(f.gmin), hi=n(f.gmax);
 if(!isNaN(lo)&&!isNaN(hi)&&lo>hi){ fl.push(['warn','The required gap minimum ('+fx(lo)+') is larger than the maximum ('+fx(hi)+'). Check the requirement; until it is corrected the stack is calculated but not judged.']); lo=NaN; hi=NaN; }
 var chk=function(a,b){ var p=(isNaN(lo)||a>=lo-1e-12)&&(isNaN(hi)||b<=hi+1e-12); return (isNaN(lo)&&isNaN(hi))?'—':(p?'<b class="gp-ok">Meets</b>':'<b class="gp-bad">Fails</b>'); };
 tb.innerHTML='<thead><tr><th>Method</th><th>Gap min</th><th>Gap max</th><th>± range</th><th>Requirement</th></tr></thead><tbody>'+
  '<tr><td class="mo">Nominal (no tolerances)</td><td class="mt" colspan="2">'+fx(gn)+'</td><td class="mt">—</td><td>'+chk(gn,gn)+'</td></tr>'+
  '<tr><td class="mo">Worst case (arithmetic)</td><td class="mt">'+fx(gm-sw)+'</td><td class="mt">'+fx(gm+sw)+'</td><td class="mt">± '+api.fmt(sw,d)+'</td><td>'+chk(gm-sw,gm+sw)+'</td></tr>'+
  '<tr><td class="mo">Statistical (RSS)</td><td class="mt">'+fx(gm-rss)+'</td><td class="mt">'+fx(gm+rss)+'</td><td class="mt">± '+api.fmt(rss,d)+'</td><td>'+chk(gm-rss,gm+rss)+'</td></tr></tbody>';
 var k='font-family="Archivo, sans-serif"', h=28, H=40+rows.length*h, mx=0;
 rows.forEach(function(x){ mx=Math.max(mx,sq?x.o.half*x.o.half/sq:0); });
 var svg='<svg viewBox="0 0 640 '+H+'" width="100%" role="img" aria-label="Contribution to the RSS stack"><text x="0" y="16" font-size="13" font-weight="700" fill="#16273A" '+k+'>Share of RSS variance (tolerance squared)</text>';
 rows.forEach(function(x,i){ var p=sq?x.o.half*x.o.half/sq:0, y=30+i*h, w=Math.max(1,p/(mx||1)*330);
  svg+='<text x="0" y="'+(y+15)+'" font-size="12" fill="#16273A" '+k+'>'+api.esc(String(x.r.dim||'Row').slice(0,26))+'</text><rect x="210" y="'+(y+2)+'" width="'+w.toFixed(1)+'" height="18" fill="'+(p===mx?'#0F3E68':'#7C8B99')+'"/><text x="'+(216+w).toFixed(1)+'" y="'+(y+15)+'" font-size="12" fill="#16273A" '+k+'>'+(p*100).toFixed(1)+'%</text>'; });
 sv.innerHTML=svg+'</svg>';
 var wcOk=(isNaN(lo)||gm-sw>=lo-1e-12)&&(isNaN(hi)||gm+sw<=hi+1e-12), rsOk=(isNaN(lo)||gm-rss>=lo-1e-12)&&(isNaN(hi)||gm+rss<=hi+1e-12);
 if(isNaN(lo)&&isNaN(hi)){ if(!(n(f.gmin)>n(f.gmax))) fl.push(['warn','No gap requirement entered. The stack is calculated, but nothing is judged.']); }
 else {
  fl.push([wcOk?'ok':'warn','Worst case: gap '+fx(gm-sw)+' to '+fx(gm+sw)+' '+u+'. '+(wcOk?'Every assembly built from in-tolerance parts meets the requirement.':'Some combinations of in-tolerance parts can miss the requirement.')]);
  fl.push([rsOk?'ok':'warn','RSS: gap '+fx(gm-rss)+' to '+fx(gm+rss)+' '+u+'. '+(rsOk?'Meets the requirement statistically.':'Fails even statistically; the design or the tolerances must change.')]);
  if(!wcOk){
   var short=Math.max(isNaN(lo)?0:lo-(gm-sw), isNaN(hi)?0:(gm+sw)-hi), big=rows.slice().sort(function(a,b){return b.o.half-a.o.half;})[0];
   if(gm+sw-(gm-sw)>(isNaN(lo)||isNaN(hi)?Infinity:hi-lo)) fl.push(['warn','The total worst-case spread ('+api.fmt(2*sw,d)+') is wider than the allowed gap range ('+api.fmt(hi-lo,d)+'). Re-centering cannot fix it; tolerances must shrink.']);
   else if(big.o.half>short) fl.push(['','To close the worst-case shortfall of '+api.fmt(short,d)+' '+u+', tightening <b>'+api.esc(big.r.dim||'the largest tolerance')+'</b> from ± '+api.fmt(big.o.half,d)+' to ± '+api.fmt(big.o.half-short,d)+' would do it (or re-center the nominal gap).']);
  }
  if(!wcOk&&rsOk) fl.push(['','RSS passing where worst case fails is acceptable only if each dimension is independent, roughly normal and centered, with its tolerance at about ± 3 standard deviations. Without process data, worst case is the safe answer.']);
 }
 if(Math.abs(gm-gn)>1e-12) fl.push(['','Unequal tolerances move the mean gap to '+fx(gm)+' from the nominal '+fx(gn)+'. Stacks are calculated on the mean with equal bilateral tolerances.']);
 var top=rows.slice().sort(function(a,b){return b.o.half-a.o.half;})[0];
 if(rows.length>1&&sq) fl.push(['','Largest contributor: <b>'+api.esc(top.r.dim||'row')+'</b>, '+(top.o.half*top.o.half/sq*100).toFixed(0)+'% of the RSS variance. Because RSS squares each tolerance, tightening the largest one does the most good.']);
 root.querySelector('.ts-out').innerHTML=api.flags(fl);
},
example:{f:{name:'Gearbox output shaft end play: gap between retaining ring and bearing spacer',unit:'in',gmin:'0.040',gmax:'0.070'},
 g:{s:[{dim:'A Housing bore depth to ring groove',dir:'+ increases gap',nom:'2.500',tp:'0.005',tm:'0.005'},{dim:'B Bearing width',dir:'− decreases gap',nom:'0.750',tp:'0.002',tm:'0.002'},{dim:'C Spacer length',dir:'− decreases gap',nom:'1.000',tp:'0.002',tm:'0.004'},{dim:'D Retaining ring thickness',dir:'− decreases gap',nom:'0.700',tp:'0.002',tm:'0.002'}]}}
}
