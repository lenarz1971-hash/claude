{
slug:'cqt-reliability-mtbf-calculator',
h:{
 t:function(api){ var t=api.num(api.state().f.mt); return t>=0?t:NaN; },
 ru:function(r,api){ var R=api.num(r.r), m=api.num(r.mtbf), t=this.t(api);
  if(isFinite(R)&&R>=0&&R<=1) return R; if(m>0&&isFinite(t)) return Math.exp(-t/m); return NaN; },
 nn:function(r,api){ var k=Math.round(api.num(r.n)); return k>=1?k:1; },
 stages:function(api){ var self=this, map={}, order=[];
  api.state().g.b.forEach(function(r){ if(!r.blk) return; var R=self.ru(r,api); if(!isFinite(R)) return; var st=(r.st||r.blk).trim(); if(!map[st]){ map[st]={name:st,q:1,items:[]}; order.push(st); }
   var n=self.nn(r,api); map[st].q*=Math.pow(1-R,n); map[st].items.push({b:r.blk,R:R,n:n}); });
  return order.map(function(k){ var s=map[k]; s.R=1-s.q; return s; }); },
 p:function(x){ return isFinite(x)?(x>=0.99995&&x<1?x.toFixed(6):x.toFixed(4)):'—'; }
},
sections:[
 {type:'fields',title:'Life test or field data',cols:3,hint:'Total operating time across all units divided by the number of failures gives MTBF, assuming a constant failure rate (the exponential model, the flat middle of the bathtub curve).',fields:[
  {id:'item',label:'Item or system',wide:true},
  {id:'units',label:'Units on test',type:'number',min:0},
  {id:'hrs',label:'Hours per unit',type:'number',min:0,hint:'Or leave blank and enter total unit-hours.'},
  {id:'tot',label:'Total unit-hours (optional)',type:'number',min:0},
  {id:'fail',label:'Failures',type:'number',min:0},
  {id:'mt',label:'Mission time t (hours)',type:'number',min:0}]},
 {type:'grid',id:'b',title:'System blocks',rows:3,hint:'One row per block. Give either its reliability R for the mission or its MTBF (R = e^(−t/MTBF)). Rows with the same stage name are in active parallel; different stages are in series. n is the number of identical units in active redundancy.',cols:[
  {id:'st',label:'Stage',w:110},{id:'blk',label:'Block',w:170,type:'textarea',rows:1},
  {id:'r',label:'R (0–1)',type:'number',min:0,max:1},{id:'mtbf',label:'or MTBF (h)',type:'number',min:0},
  {id:'n',label:'n parallel',type:'number',min:1},
  {id:'ru',label:'R per unit',calc:function(r,api){var x=window.TOOL.h.ru(r,api);return r.blk&&isFinite(x)?window.TOOL.h.p(x):'';}},
  {id:'rb',label:'R of block',calc:function(r,api){var h=window.TOOL.h,x=h.ru(r,api);return r.blk&&isFinite(x)?h.p(1-Math.pow(1-x,h.nn(r,api))):'';}}]},
 {type:'custom',id:'res',title:'Results',html:'<div class="tgw"><table class="mv rl-t"></table></div><div class="svgw rl-svg"></div><div class="out rl-out"></div>'}
],
update:function(root,api){
 var S=api.state(), h=window.TOOL.h, n=api.num, f=[], rows=[], t=h.t(api);
 var T=n(S.f.tot); if(!(T>0)){ var u=n(S.f.units), hr=n(S.f.hrs); T=u>0&&hr>0?u*hr:NaN; }
 var r=n(S.f.fail);
 if(T>0&&r>0){ var lam=r/T, m=T/r; rows.push(['Failure rate λ','r / T = '+api.fmt(r,0)+' / '+api.fmt(T,0)+' h',lam.toExponential(3)+' per h']); rows.push(['MTBF','T / r = 1 / λ',api.fmt(m,1)+' h']);
  if(isFinite(t)){ var R=Math.exp(-t/m); rows.push(['Reliability at t = '+api.fmt(t,0)+' h','R(t) = e^(−λt) = e^(−'+api.fmt(lam*t,4)+')',h.p(R)]); rows.push(['Probability of failure by t','F(t) = 1 − R(t)',h.p(1-R)]);
   f.push(['','From the test data: MTBF = <b>'+api.fmt(m,0)+' h</b>, λ = '+lam.toExponential(2)+' per hour, and a single unit survives a '+api.fmt(t,0)+'-hour mission with probability <b>'+h.p(R)+'</b>.']); }
  else f.push(['warn','Enter a mission time to turn the MTBF into a reliability.']);
  if(isFinite(t)&&t>=m) f.push(['warn','The mission is as long as the MTBF or longer. At t = MTBF an exponential item survives only 36.8% of the time; MTBF is an average, not a guaranteed life.']);
  if(r<3) f.push(['warn','Only '+r+' failure'+(r>1?'s':'')+'. A point estimate of MTBF from so few failures is very uncertain; report a lower confidence bound (chi-square method) before relying on it.']);
 } else if(T>0&&r===0) f.push(['warn','No failures in '+api.fmt(T,0)+' unit-hours. MTBF cannot be computed as T/r; only a lower confidence bound can be stated.']);
 else if(S.f.units||S.f.hrs||S.f.tot||S.f.fail) f.push(['warn','Enter the operating time and the number of failures to estimate MTBF.']);
 var st=h.stages(api), Rs=1; st.forEach(function(s){ Rs*=s.R; });
 var missing=S.g.b.filter(function(x){ return x.blk&&!isFinite(h.ru(x,api)); });
 if(st.length){
  rows.push(['System reliability','Π of '+st.length+' stage'+(st.length>1?'s':'')+' in series',h.p(Rs)]);
  var weak=st.slice().sort(function(a,b){return a.R-b.R;})[0];
  f.push(['','System reliability for the mission: <b>'+h.p(Rs)+'</b> ('+(Rs*100).toFixed(2)+'% chance of completing it without a system failure).']);
  f.push(['','Weakest stage: <b>'+api.esc(weak.name)+'</b> at '+h.p(weak.R)+'. In a series system the total can never be better than the weakest stage, so that is where redundancy or a better part pays off first.']);
  var allSer=S.g.b.filter(function(x){return x.blk;}).every(function(x){ return n(x.mtbf)>0&&!(n(x.r)>=0)&&h.nn(x,api)===1; })&&st.every(function(s){return s.items.length===1;});
  if(allSer&&st.length>1){ var L=0; S.g.b.forEach(function(x){ if(x.blk) L+=1/n(x.mtbf); }); f.push(['','All blocks are exponential and in series, so failure rates add: λ<sub>sys</sub> = '+L.toExponential(3)+' per h, system MTBF = '+api.fmt(1/L,0)+' h.']); }
  if(st.some(function(s){return s.items.length>1||s.items[0].n>1;})) f.push(['','Parallel stages are modeled as active redundancy: the stage fails only if every unit in it fails, R = 1 − Π(1 − R<sub>i</sub>). A standby unit with a switch is a different model.']);
 }
 if(missing.length) f.push(['warn','No R or MTBF (or no mission time) for: '+missing.map(function(x){return api.esc(x.blk);}).join(', ')+'. Left out of the system figure.']);
 root.querySelector('table.rl-t').innerHTML=rows.length?'<thead><tr><th>Result</th><th>How</th><th>Value</th></tr></thead><tbody>'+rows.map(function(x){return '<tr><td class="mo">'+x[0]+'</td><td>'+x[1]+'</td><td class="mt">'+x[2]+'</td></tr>';}).join('')+'</tbody>':'';
 /* block diagram */
 var svg='';
 if(st.length){
  var bw=118, gap=26, x0=10, maxk=1; st.forEach(function(s){ var k=0; s.items.forEach(function(it){k+=Math.min(it.n,3);}); s.k=k; if(k>maxk) maxk=k; });
  var bh=34, vg=10, H=Math.max(maxk*(bh+vg)+60,110), W=Math.max(640,x0*2+st.length*(bw+gap)+40), mid=(H-30)/2;
  svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Reliability block diagram">';
  svg+='<line x1="0" y1="'+mid+'" x2="'+(W-10)+'" y2="'+mid+'" stroke="#C6CDD3" stroke-width="2"/>';
  st.forEach(function(s,i){ var x=x0+20+i*(bw+gap), k=s.k, y0=mid-(k*(bh+vg)-vg)/2, j=0;
   if(k>1){ svg+='<line x1="'+(x-8)+'" y1="'+(y0+bh/2)+'" x2="'+(x-8)+'" y2="'+(y0+(k-1)*(bh+vg)+bh/2)+'" stroke="#7C8B99" stroke-width="2"/><line x1="'+(x+bw+8)+'" y1="'+(y0+bh/2)+'" x2="'+(x+bw+8)+'" y2="'+(y0+(k-1)*(bh+vg)+bh/2)+'" stroke="#7C8B99" stroke-width="2"/>'; }
   s.items.forEach(function(it){ for(var q=0;q<Math.min(it.n,3);q++){ var y=y0+j*(bh+vg); j++;
    var lab=it.b.length>16?it.b.slice(0,15)+'…':it.b; if(it.n>3&&q===2) lab='… ('+it.n+' units)';
    if(k>1) svg+='<line x1="'+(x-8)+'" y1="'+(y+bh/2)+'" x2="'+x+'" y2="'+(y+bh/2)+'" stroke="#7C8B99" stroke-width="2"/><line x1="'+(x+bw)+'" y1="'+(y+bh/2)+'" x2="'+(x+bw+8)+'" y2="'+(y+bh/2)+'" stroke="#7C8B99" stroke-width="2"/>';
    svg+='<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="3" fill="#EDEFEA" stroke="#0F3E68" stroke-width="1.5"/><text x="'+(x+bw/2)+'" y="'+(y+15)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11.5" fill="#16273A">'+api.esc(lab)+'</text><text x="'+(x+bw/2)+'" y="'+(y+29)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#4A5D71">R '+h.p(it.R)+'</text>'; } });
   svg+='<text x="'+(x+bw/2)+'" y="'+(H-10)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11.5" font-weight="700" fill="'+(s===st.slice().sort(function(a,b){return a.R-b.R;})[0]?'#C0392B':'#0F3E68')+'">'+api.esc(s.name.length>16?s.name.slice(0,15)+'…':s.name)+': '+h.p(s.R)+'</text>'; });
  svg+='</svg>';
 }
 root.querySelector('.rl-svg').innerHTML=svg;
 if(f.length) f.push(['','The exponential model assumes a constant failure rate. It does not fit infant mortality, where the failure rate falls, or wear-out, where it rises: the two ends of the bathtub curve.']);
 root.querySelector('.rl-out').innerHTML=api.flags(f,'Enter test data or system blocks to calculate reliability.');
},
example:{f:{item:'Booster pump station, Riverbend Water Authority (fictional)',units:'20',hrs:'500',tot:'',fail:'4',mt:'200'},
 g:{b:[
  {st:'Intake',blk:'Intake screen',r:'0.995',mtbf:'',n:'1'},
  {st:'Pumping',blk:'Booster pump',r:'',mtbf:'2500',n:'2'},
  {st:'Control',blk:'Motor controller',r:'',mtbf:'8000',n:'1'},
  {st:'Dosing',blk:'Chlorine dosing skid',r:'0.98',mtbf:'',n:'1'},
  {st:'Power',blk:'Utility feed',r:'',mtbf:'1500',n:'1'},
  {st:'Power',blk:'On-site generator',r:'0.90',mtbf:'',n:'1'}]}}
}
