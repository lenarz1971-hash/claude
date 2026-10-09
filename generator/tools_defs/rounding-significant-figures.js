{
slug:'rounding-significant-figures',
RULES:['Round half up (away from zero)','Round half to even (ASTM E29, ISO 80000-1)','Truncate (toward zero)'],
/* Exact decimal arithmetic with BigInt: a number is {neg, c, e} meaning (-1)^neg * c * 10^e,
   so 2.345 is exactly 2345 x 10^-3 and a tie is really a tie. */
h:{
 B:function(x){ return BigInt(x); },
 parse:function(s){ s=String(s==null?'':s).replace(/[\s,  ]/g,'').replace(/^−/,'-'); var m=/^([+-])?(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(s); if(!m||!((m[2]||'')+(m[3]||'')).length) return null;
  var ip=m[2]||'', fp=m[3]||'', ex=+(m[4]||0), dig=(ip+fp).replace(/^0+/,'')||'0';
  var o={neg:m[1]==='-', c:this.B(dig), e:ex-fp.length, txt:s, dot:s.indexOf('.')>=0, ip:ip, fp:fp};
  /* significant figures as typed */
  var all=(ip+fp).replace(/^0+/,'');
  if(!all.replace(/0/g,'').length){ o.sf=null; o.sfMax=null; }
  else if(o.dot){ o.sf=all.length; o.sfMax=all.length; }
  else { o.sfMax=all.length; o.sf=all.replace(/0+$/,'').length; }
  o.lsd=o.e; return o; },
 len:function(c){ return c===this.B(0)?1:c.toString().length; },
 pow:function(n){ return this.B(10)**this.B(n); },
 /* round to a multiple of 10^p using the rule (0 half up, 1 half even, 2 truncate) */
 at:function(x,p,rule){ var B=this.B, h=this;
  if(x.e>=p) return {neg:x.neg,c:x.c*h.pow(x.e-p),e:p};
  var div=h.pow(p-x.e), q=x.c/div, r=x.c%div, two=r*B(2);
  if(rule===0){ if(two>=div) q+=B(1); } else if(rule===1){ if(two>div||(two===div&&q%B(2)===B(1))) q+=B(1); }
  return {neg:x.neg&&q!==B(0),c:q,e:p}; },
 sig:function(x,n,rule){ if(x.c===this.B(0)) return {neg:false,c:this.B(0),e:0}; var top=this.len(x.c)-1+x.e, p=top-n+1, y=this.at(x,p,rule);
  if(this.len(y.c)>n){ y={neg:y.neg,c:y.c/this.B(10),e:y.e+1}; } return y; },
 inc:function(x,I,rule){ var B=this.B, m=Math.min(x.e,I.e), X=x.c*this.pow(x.e-m), II=I.c*this.pow(I.e-m); if(II===B(0)) return null;
  var q=X/II, r=X%II, two=r*B(2);
  if(rule===0){ if(two>=II) q+=B(1); } else if(rule===1){ if(two>II||(two===II&&q%B(2)===B(1))) q+=B(1); }
  return {neg:x.neg&&q!==B(0),c:q*I.c,e:I.e}; },
 str:function(x){ var s=x.c.toString(); if(x.e>=0) s=s+(x.c===this.B(0)?'':new Array(x.e+1).join('0'));
  else { var k=-x.e; while(s.length<=k) s='0'+s; s=s.slice(0,s.length-k)+'.'+s.slice(s.length-k); }
  return (x.neg?'−':'')+s; },
 /* a whole number ending in zeros does not show which zeros are significant: add the scientific form */
 show:function(x,n){ var s=this.str(x); if(x.e>=0&&/0$/.test(s)&&x.c!==this.B(0)){ var d=x.c.toString(), z=d.length-1+x.e; if(n==null) n=d.replace(/0+$/,'').length;
   var digs=(d+new Array(x.e+1).join('0')).slice(0,n); s+=' ('+(x.neg?'−':'')+digs.charAt(0)+(digs.length>1?'.'+digs.slice(1):'')+'×10<sup>'+z+'</sup>)'; }
  return s; },
 place:function(e){ return e>=0?'1'+new Array(e+1).join('0'):'0.'+new Array(-e).join('0')+'1'; },
 /* apply the chosen mode to one value */
 go:function(x,api,rule){ var S=api.state(), mode=S.f.mode||'Significant figures', n=api.num(S.f.n);
  if(mode==='Nearest increment (resolution)'){ var I=this.parse(S.f.inc); if(!I||I.c===this.B(0)) return null; var y=this.inc(x,I,rule); return y?this.str(y):null; }
  if(!(n>=0)||n%1) return null;
  if(mode==='Decimal places') return this.str(this.at(x,-n,rule));
  if(!(n>=1)) return null; return this.show(this.sig(x,n,rule),n); },
 cell:function(r,api,rule){ var h=window.TOOL.h, x=h.parse(r.v); if(!x) return r.v?'<span class="rs-bad">not a number</span>':''; var y=h.go(x,api,rule); if(y==null) return '';
  var chosen=window.TOOL.RULES.indexOf(api.state().f.rule); if(chosen<0) chosen=1; return chosen===rule?'<b>'+y+'</b>':y; }
},
sections:[
 {type:'fields',title:'How to round',cols:4,hint:'Round to a number of significant figures, to a number of decimal places, or to the nearest multiple of an increment such as a scale division of 0.02 or 0.5. The rules only differ on an exact tie, a dropped part of exactly 5, 50, 500 &hellip;',fields:[
  {id:'mode',label:'Round to',type:'select',opts:['Significant figures','Decimal places','Nearest increment (resolution)']},
  {id:'n',label:'How many figures or places',type:'number',min:0,max:30},
  {id:'inc',label:'Increment (for the third mode)',ph:'e.g. 0.02'},
  {id:'rule',label:'Rule',type:'select',opts:['Round half up (away from zero)','Round half to even (ASTM E29, ISO 80000-1)','Truncate (toward zero)']}]},
 {type:'grid',id:'r',title:'Values to round',rows:5,hint:'Type the values exactly as recorded, trailing zeros included: 12.50 has four significant figures, 12.5 has three. Your chosen rule is in bold.',cols:[
  {id:'v',label:'Value as recorded',w:100,ph:'2.345'},
  {id:'sf',label:'Sig figs',calc:function(r,api){ var x=window.TOOL.h.parse(r.v); if(!x) return ''; return x.sf==null?'—':(x.sf===x.sfMax?x.sf:x.sf+' to '+x.sfMax); }},
  {id:'ls',label:'Least significant digit',calc:function(r,api){ var h=window.TOOL.h, x=h.parse(r.v); if(!x) return ''; return h.place(x.lsd)+(x.sf!=null&&x.sf!==x.sfMax?' ?':''); }},
  {id:'hu',label:'Half up',calc:function(r,api){ return window.TOOL.h.cell(r,api,0); }},
  {id:'he',label:'Half to even',calc:function(r,api){ return window.TOOL.h.cell(r,api,1); }},
  {id:'tr',label:'Truncated',calc:function(r,api){ return window.TOOL.h.cell(r,api,2); }}]},
 {type:'custom',id:'rc',title:'What to notice',html:'<div class="out rs-out"></div>'},
 {type:'fields',title:'Combine measured values',cols:2,hint:'Do the arithmetic at full precision and round once, at the end. A sum is reported to the decimal place of its least precise term. A product or quotient keeps as many significant figures as its least precise factor. Exact numbers (counts, defined constants such as 25.4 mm per inch) do not limit the result.',fields:[
  {id:'op',label:'Operation',type:'select',opts:['Sum (enter a negative value to subtract)','Product (multiply them all)','Quotient (the first value divided by the others)']}]},
 {type:'grid',id:'c',title:'Values to combine',rows:3,cols:[
  {id:'v',label:'Value',w:140},
  {id:'k',label:'Kind',type:'select',opts:['Measured','Exact (count or defined constant)']},
  {id:'sf',label:'Sig figs',calc:function(r,api){ var x=window.TOOL.h.parse(r.v); if(!x) return ''; return /^Exact/.test(r.k||'')?'exact':x.sf==null?'—':(x.sf===x.sfMax?x.sf:x.sf+' to '+x.sfMax); }},
  {id:'dp',label:'Decimal places',calc:function(r,api){ var x=window.TOOL.h.parse(r.v); if(!x) return ''; return /^Exact/.test(r.k||'')?'exact':Math.max(0,-x.e); }}]},
 {type:'custom',id:'cr',title:'Result',html:'<div class="stat rs-stat"></div><div class="out rs-cout"></div>'}
],
comb:function(api){
 var S=api.state(), h=this.h, B=h.B, op=/^Product/.test(S.f.op||'')?1:/^Quotient/.test(S.f.op||'')?2:0, xs=[];
 S.g.c.forEach(function(r){ var x=h.parse(r.v); if(x){ x.ex=/^Exact/.test(r.k||''); xs.push(x); } });
 if(xs.length<2) return null;
 var raw, z;
 if(op===0){ var m=Math.min.apply(null,xs.map(function(x){return x.e;})), s=B(0); xs.forEach(function(x){ var v=x.c*h.pow(x.e-m); s+=x.neg?-v:v; }); raw={neg:s<B(0),c:s<B(0)?-s:s,e:m}; }
 else if(op===1){ raw={neg:false,c:B(1),e:0}; xs.forEach(function(x){ raw={neg:raw.neg!==x.neg,c:raw.c*x.c,e:raw.e+x.e}; }); }
 else { var num={neg:xs[0].neg,c:xs[0].c,e:xs[0].e}, den={neg:false,c:B(1),e:0}; xs.slice(1).forEach(function(x){ den={neg:den.neg!==x.neg,c:den.c*x.c,e:den.e+x.e}; });
  if(den.c===B(0)) return {err:'Division by zero.'};
  var K=40, N=num.c*h.pow(K), q=N/den.c, r=N%den.c; q=q*B(10)+(r===B(0)?B(0):B(1)); raw={neg:num.neg!==den.neg,c:q,e:num.e-den.e-K-1,inexact:r!==B(0)}; }
 var meas=xs.filter(function(x){return !x.ex;}), rule=this.RULES.indexOf(S.f.rule); if(rule<0) rule=1;
 if(!meas.length) return {raw:raw,op:op,xs:xs,none:true};
 if(op===0){ var p=Math.max.apply(null,meas.map(function(x){return x.e;})); return {raw:raw,op:op,xs:xs,p:p,res:h.at(raw,p,rule)}; }
 var n=Math.min.apply(null,meas.map(function(x){ return x.sf==null?1:x.sf; }));
 return {raw:raw,op:op,xs:xs,n:n,res:h.sig(raw,n,rule)};
},
update:function(root,api){
 var S=api.state(), T=window.TOOL, h=T.h, f=[], rule=T.RULES.indexOf(S.f.rule); if(rule<0) rule=1;
 var mode=S.f.mode||'Significant figures', n=api.num(S.f.n);
 if(mode==='Nearest increment (resolution)'){ var I=h.parse(S.f.inc); if(!I||I.c===h.B(0)||I.neg) f.push(['warn','Enter a positive increment, for example 0.02 or 0.5.']); }
 else if(!(n>=0)||n%1||(mode==='Significant figures'&&n<1)) f.push(['warn','Enter how many '+(mode==='Decimal places'?'decimal places (0 or more)':'significant figures (1 or more)')+' to keep.']);
 var ties=0, amb=[], bad=0;
 S.g.r.forEach(function(r){ var x=h.parse(r.v); if(!x){ if(r.v) bad++; return; } var a=h.go(x,api,0), b=h.go(x,api,1); if(a!=null&&a!==b) ties++; if(x.sf!=null&&x.sf!==x.sfMax) amb.push(api.esc(r.v)); });
 if(bad) f.push(['warn',bad+' value'+(bad>1?'s are':' is')+' not a number. Use digits, one decimal point and e for a power of ten (6.022e23).']);
 if(ties) f.push(['',ties+' value'+(ties>1?'s are exact ties':' is an exact tie')+', so half up and half to even give different answers. Half to even rounds a tie to the even neighbor (2.345 → 2.34, 2.355 → 2.36), so ties do not push a set of results upward on average. ASTM E29 and ISO 80000-1 use it; many calculators and spreadsheets round half up.']);
 else f.push(['','No exact ties in this set, so half up and half to even agree. The rules only differ when the part dropped is exactly one half of the last kept place.']);
 if(amb.length) f.push(['warn','Ambiguous significant figures: '+amb.join(', ')+'. Trailing zeros in a whole number may or may not be significant. Write 1.250 × 10³ (4 figures) or 1.25 × 10³ (3 figures) to say which.']);
 f.push(['','Round once. Rounding 2.3449 first to 2.345 and then to three figures half up gives 2.35; rounding 2.3449 straight to three figures gives 2.34. Keep at least one extra digit in intermediate results.']);
 if(rule===2) f.push(['','Truncation always moves toward zero, so it biases results; use it only where a procedure says to, for example to report a reading as displayed.']);
 root.querySelector('.rs-out').innerHTML=api.flags(f);
 /* combine */
 var o=T.comb(api), cf=[], st='';
 if(o&&o.err) cf.push(['warn',o.err]);
 else if(o){
  var rawS=o.raw.inexact?h.str(h.sig(o.raw,15,0))+'…':h.str(o.raw);
  st='<div><b>'+rawS+'</b><span>Full-precision result'+(o.raw.inexact?' (first 15 figures)':'')+'</span></div>';
  if(o.none) cf.push(['','Every value is exact, so the result is exact and needs no rounding.']);
  else { st+='<div><b>'+h.show(o.res,o.op===0?null:o.n)+'</b><span>Reported, '+(o.op===0?'to the '+h.place(o.p)+' place':o.n+' significant figure'+(o.n>1?'s':''))+'</span></div>';
   if(o.op===0){ var lp=o.xs.filter(function(x){ return !x.ex&&x.e===o.p; })[0]; cf.push(['','Sum rule: the least precise measured term is '+api.esc(lp.txt)+', known to the '+h.place(o.p)+' place, so the sum is reported to that place.']); }
   else { var lf=o.xs.filter(function(x){ return !x.ex&&(x.sf==null?1:x.sf)===o.n; })[0]; cf.push(['','Product and quotient rule: the measured value with the fewest significant figures is '+api.esc(lf.txt)+' ('+o.n+'), so the result keeps '+o.n+'.']);
    if(o.xs.some(function(x){ return !x.ex&&x.sf!==x.sfMax; })) cf.push(['warn','A whole number with trailing zeros is in the set. Its zeros were taken as not significant; mark it exact if it is a count or a defined value.']); } }
 } else cf.push(['','Enter two or more values to combine.']);
 root.querySelector('.rs-stat').innerHTML=st;
 root.querySelector('.rs-cout').innerHTML=api.flags(cf);
},
example:{f:{mode:'Significant figures',n:'3',inc:'0.02',rule:'Round half to even (ASTM E29, ISO 80000-1)',op:'Sum (enter a negative value to subtract)'},
 g:{r:[{v:'2.345'},{v:'2.355'},{v:'0.004050'},{v:'1265'},{v:'12.50'},{v:'-7.4651'},{v:'99.96'},{v:'1250'}],
  c:[{v:'12.52',k:'Measured'},{v:'3.1',k:'Measured'},{v:'-0.448',k:'Measured'}]}}
}
