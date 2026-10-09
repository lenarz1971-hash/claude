{
slug:'probability-calculator',
sections:[
 {type:'fields',title:'Two events: A and B',cols:4,hint:'Enter probabilities as decimals (0.25, not 25%). Say how A and B are related, and give the joint figure if you know it.',fields:[
  {id:'a',label:'P(A)',type:'number',min:0,max:1},
  {id:'b',label:'P(B)',type:'number',min:0,max:1},
  {id:'rel',label:'How A and B are related',type:'select',opts:['Independent','Mutually exclusive','I know P(A and B)','I know P(B given A)']},
  {id:'j',label:'P(A and B) or P(B given A)',type:'number',min:0,max:1,hint:'Only for the last two choices.'},
  {id:'na',label:'A means',ph:'e.g. Part from line 1'},
  {id:'nb',label:'B means',ph:'e.g. Part is defective'}]},
 {type:'custom',id:'ev',title:'Event results',html:'<div class="stat pr-ev"></div><div class="out pr-evo"></div>'},
 {type:'fields',title:'Counting: combinations and permutations',cols:4,hint:'n things, choose r. Order matters for permutations, not for combinations.',fields:[
  {id:'n',label:'n (how many to choose from)',type:'number',min:0},
  {id:'r',label:'r (how many chosen)',type:'number',min:0}]},
 {type:'custom',id:'ct',title:'Counts',html:'<div class="stat pr-ct"></div><div class="out pr-cto"></div>'},
 {type:'fields',title:'At least one in n tries',cols:3,hint:'The chance an event with probability p happens at least once in n independent tries is 1 &minus; (1 &minus; p)<sup>n</sup>.',fields:[
  {id:'p1',label:'p, probability each try',type:'number',min:0,max:1},
  {id:'n1',label:'n, number of tries',type:'number',min:0}]},
 {type:'custom',id:'al',title:'At least one',html:'<div class="stat pr-al"></div>'},
 {type:'grid',id:'c',title:'System reliability: series and parallel',rows:3,hint:'Give each component its reliability (probability it works). Components with the same <b>Block</b> name are in parallel: the block works if any of them works. The blocks are in series: the system works only if every block works. Components are assumed to fail independently.',cols:[
  {id:'blk',label:'Block',w:90,ph:'e.g. Pumps'},
  {id:'nm',label:'Component',w:180},
  {id:'r',label:'Reliability R',type:'number',min:0,max:1},
  {id:'q',label:'Unreliability 1 − R',calc:function(r,api){var x=api.num(r.r);return isNaN(x)?'':api.fmt(1-x,4);}}]},
 {type:'custom',id:'sy',title:'System result',html:'<div class="stat pr-sy"></div><div class="out pr-syo"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, F=function(v){ return isFinite(v)?api.fmt(v,4):'&mdash;'; };
 var A=n(S.f.a), B=n(S.f.b), rel=S.f.rel||'Independent', J=n(S.f.j), f=[], an=api.esc(S.f.na||'A'), bn=api.esc(S.f.nb||'B'), out='';
 var ok=A>=0&&A<=1&&B>=0&&B<=1;
 if(!isNaN(A)&&!(A>=0&&A<=1)||!isNaN(B)&&!(B>=0&&B<=1)) f.push(['warn','A probability must be between 0 and 1.']);
 if(ok){
  var AB;
  if(rel==='Independent') AB=A*B;
  else if(rel==='Mutually exclusive'){ AB=0; if(A+B>1+1e-12) f.push(['warn','P(A) + P(B) is more than 1, so A and B cannot be mutually exclusive.']); }
  else if(rel==='I know P(A and B)') AB=J;
  else AB=J*A;
  if(isNaN(AB)) f.push(['','Enter the joint figure for "'+api.esc(rel)+'".']);
  else if(AB<0||AB>1) { f.push(['warn','The joint figure must be between 0 and 1.']); AB=NaN; }
  else if(AB>Math.min(A,B)+1e-12||AB<A+B-1-1e-12){ f.push(['warn','P(A and B) = '+F(AB)+' is impossible with these P(A) and P(B): it must lie between '+F(Math.max(0,A+B-1))+' and '+F(Math.min(A,B))+'.']); AB=NaN; }
  if(!isNaN(AB)){
   var U=A+B-AB, AgB=B>0?AB/B:NaN, BgA=A>0?AB/A:NaN;
   out='<div><b>'+F(U)+'</b><span>P(A or B) = P(A) + P(B) &minus; P(A and B)</span></div><div><b>'+F(AB)+'</b><span>P(A and B)</span></div><div><b>'+F(AgB)+'</b><span>P(A given B) = P(A and B) / P(B)</span></div><div><b>'+F(BgA)+'</b><span>P(B given A)</span></div><div><b>'+F(1-A)+'</b><span>P(not A)</span></div><div><b>'+F(1-B)+'</b><span>P(not B)</span></div><div><b>'+F(1-U)+'</b><span>P(neither)</span></div><div><b>'+F(U-AB)+'</b><span>P(exactly one)</span></div>';
   f.push(['','In words: the chance of <b>'+an+'</b> or <b>'+bn+'</b> (or both) is '+F(U)+'; the chance of both is '+F(AB)+'.']);
   if(rel!=='Independent'&&A>0&&B>0){ var ind=Math.abs(AB-A*B)<1e-9; f.push([ind?'ok':'',ind?'P(A and B) = P(A) &times; P(B), so A and B are independent.':'P(A and B) = '+F(AB)+' differs from P(A) &times; P(B) = '+F(A*B)+', so A and B are not independent: knowing one changes the chance of the other.']); }
   if(rel==='Independent'&&A>0&&B>0) f.push(['','Independent is not the same as mutually exclusive. Two events with nonzero probabilities that are mutually exclusive cannot be independent: if one happens, the other cannot.']);
  }
 }
 root.querySelector('.pr-ev').innerHTML=out;
 root.querySelector('.pr-evo').innerHTML=api.flags(f,'Enter P(A) and P(B) and say how they are related.');
 /* counting, exact with BigInt */
 var N=n(S.f.n), R=n(S.f.r), cf=[], ch='';
 function big(x){ var s=x.toString(); if(s.length<=15) return Number(s).toLocaleString('en-US'); return s.slice(0,1)+'.'+s.slice(1,5)+'&times;10<sup>'+(s.length-1)+'</sup>'; }
 if(!isNaN(N)&&!isNaN(R)){
  if(N<0||R<0||N%1||R%1) cf.push(['warn','n and r must be whole numbers, 0 or more.']);
  else if(N>5000||R>5000) cf.push(['warn','Keep n and r to 5000 or less here.']);
  else { var nb=BigInt(N), rb=BigInt(R), perm=1n, comb=1n, i;
   if(R<=N){ for(i=0n;i<rb;i++) perm*=nb-i; var k=rb<nb-rb?rb:nb-rb; for(i=1n;i<=k;i++) comb=comb*(nb-k+i)/i; }
   else { perm=0n; comb=0n; cf.push(['','r is larger than n, so without repetition there are no ways to choose.']); }
   var rep=nb**rb, mul=1n, top=nb+rb-1n, kk=rb; if(N===0&&R>0) mul=0n; else for(i=1n;i<=kk;i++) mul=mul*(top-kk+i)/i;
   ch='<div><b>'+big(comb)+'</b><span>Combinations nCr = n! / (r!(n&minus;r)!)</span></div><div><b>'+big(perm)+'</b><span>Permutations nPr = n! / (n&minus;r)!</span></div><div><b>'+big(rep)+'</b><span>Ordered, with repetition: n<sup>r</sup></span></div><div><b>'+big(mul)+'</b><span>Unordered, with repetition: C(n+r&minus;1, r)</span></div>';
   if(R<=N&&R>1) cf.push(['','Each combination of '+R+' can be arranged in '+R+'! = '+big(perm/comb)+' orders, which is why nPr = nCr &times; r!.']); } }
 root.querySelector('.pr-ct').innerHTML=ch;
 root.querySelector('.pr-cto').innerHTML=api.flags(cf,'Enter n and r.');
 var p1=n(S.f.p1), n1=n(S.f.n1);
 root.querySelector('.pr-al').innerHTML=(p1>=0&&p1<=1&&n1>=0)?'<div><b>'+F(1-Math.pow(1-p1,n1))+'</b><span>P(at least one in '+api.fmt(n1,0)+')</span></div><div><b>'+F(Math.pow(1-p1,n1))+'</b><span>P(none)</span></div>'+(p1>0&&p1<1?'<div><b>'+api.fmt(Math.ceil(Math.log(0.05)/Math.log(1-p1)),0)+'</b><span>Tries for a 95% chance of at least one</span></div>':''):'';
 /* system reliability */
 var blocks={}, order=[], sf=[], bad=0;
 S.g.c.forEach(function(r){ var x=n(r.r); if(isNaN(x)) return; if(x<0||x>1){ bad++; return; } var b=(r.blk||'').trim()||('('+(r.nm||'component')+')'); if(!blocks[b]){ blocks[b]=[]; order.push(b); } blocks[b].push({nm:r.nm||'',r:x}); });
 if(bad) sf.push(['warn','Reliabilities must be between 0 and 1.']);
 var sh='';
 if(order.length){ var Rs=1, weakest=null;
  order.forEach(function(b){ var q=blocks[b].reduce(function(a,c){ return a*(1-c.r); },1), Rb=1-q; blocks[b].Rb=Rb; Rs*=Rb; if(!weakest||Rb<blocks[weakest].Rb) weakest=b; });
  sh='<div><b>'+F(Rs)+'</b><span>System reliability</span></div><div><b>'+F(1-Rs)+'</b><span>System unreliability</span></div><div><b>'+order.length+'</b><span>Blocks in series</span></div>';
  sf.push(['',order.map(function(b){ var k=blocks[b].length; return '<b>'+api.esc(b)+'</b>: '+(k>1?k+' in parallel, R = 1 &minus; &prod;(1 &minus; R<sub>i</sub>) = ':'R = ')+F(blocks[b].Rb); }).join('<br>')]);
  if(order.length>1) sf.push(['','In series the system is never more reliable than its weakest block. The weakest here is <b>'+api.esc(weakest)+'</b> ('+F(blocks[weakest].Rb)+'); improving or duplicating it helps most.']);
  sf.push(['','Parallel redundancy only helps if the failures are independent. A shared power supply or the same maintenance error can take out both "redundant" parts at once.']); }
 root.querySelector('.pr-sy').innerHTML=sh;
 root.querySelector('.pr-syo').innerHTML=api.flags(sf,'Add components with their reliability.');
},
example:{f:{a:'0.6',b:'0.04',rel:'I know P(B given A)',j:'0.05',na:'Part made on line 1',nb:'Part is defective',n:'10',r:'3',p1:'0.02',n1:'50'},
 g:{c:[{blk:'Power',nm:'Power supply',r:'0.99'},{blk:'Pumps',nm:'Duty pump',r:'0.95'},{blk:'Pumps',nm:'Standby pump',r:'0.95'},{blk:'Control',nm:'Controller',r:'0.998'}]}}
}
