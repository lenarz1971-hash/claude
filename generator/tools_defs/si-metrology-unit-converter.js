{
slug:'si-metrology-unit-converter',
/* Conversion factors to the SI unit of each quantity. Values marked E are exact by
   definition (SI; international yard and pound, 1959; NIST SP 811 Appendix B).
   C marks a conventional value (manometric units, the IT and thermochemical calorie). */
U:{
 'Length':{si:'m',u:[
  ['m','meter',1,'E'],['km','kilometer',1e3,'E'],['cm','centimeter',1e-2,'E'],['mm','millimeter',1e-3,'E'],['µm','micrometer (micron)',1e-6,'E',['um','micron']],['nm','nanometer',1e-9,'E'],
  ['in','inch',0.0254,'E',['inch','inches']],['ft','foot',0.3048,'E',['feet']],['yd','yard',0.9144,'E'],['mi','mile (international)',1609.344,'E'],['mil','mil, thou (0.001 in)',2.54e-5,'E',['thou']],['µin','microinch',2.54e-8,'E',['uin']],['nmi','nautical mile',1852,'E']]},
 'Area':{si:'m²',u:[
  ['m²','square meter',1,'E',['m2','sq m']],['cm²','square centimeter',1e-4,'E',['cm2']],['mm²','square millimeter',1e-6,'E',['mm2']],['km²','square kilometer',1e6,'E',['km2']],['ha','hectare',1e4,'E'],
  ['in²','square inch',0.00064516,'E',['in2','sq in']],['ft²','square foot',0.09290304,'E',['ft2','sq ft']],['yd²','square yard',0.83612736,'E',['yd2']],['acre','acre (international)',4046.8564224,'E',['ac']],['mi²','square mile',2589988.110336,'E',['mi2']]]},
 'Volume and capacity':{si:'m³',u:[
  ['m³','cubic meter',1,'E',['m3']],['L','liter',1e-3,'E',['l']],['mL','milliliter',1e-6,'E',['ml']],['cm³','cubic centimeter',1e-6,'E',['cm3','cc']],['mm³','cubic millimeter',1e-9,'E',['mm3']],
  ['in³','cubic inch',1.6387064e-5,'E',['in3','cu in']],['ft³','cubic foot',0.028316846592,'E',['ft3','cu ft']],['yd³','cubic yard',0.764554857984,'E',['yd3']],
  ['gal','US gallon (231 in³)',0.003785411784,'E',['gallon']],['qt','US liquid quart',0.000946352946,'E'],['pt','US liquid pint',0.000473176473,'E'],['fl oz','US fluid ounce',2.95735295625e-5,'E',['floz']],['gal (UK)','imperial gallon',0.00454609,'E',['galUK','imp gal']]]},
 'Mass':{si:'kg',u:[
  ['kg','kilogram',1,'E'],['g','gram',1e-3,'E'],['mg','milligram',1e-6,'E'],['µg','microgram',1e-9,'E',['ug','mcg']],['t','metric ton (tonne)',1e3,'E',['tonne']],
  ['lb','pound (avoirdupois)',0.45359237,'E',['lbm','lbs']],['oz','ounce (avoirdupois)',0.028349523125,'E'],['gr','grain',6.479891e-5,'E',['grain']],['ton','short ton (2000 lb)',907.18474,'E',['short ton']],['slug','slug (lbf·s²/ft)',14.593902937206364,'E']]},
 'Force':{si:'N',u:[
  ['N','newton',1,'E'],['kN','kilonewton',1e3,'E'],['mN','millinewton',1e-3,'E'],['lbf','pound-force',4.4482216152605,'E'],['ozf','ounce-force',0.2780138509537812,'E'],
  ['kgf','kilogram-force',9.80665,'E',['kgf','kp']],['kip','kip (1000 lbf)',4448.2216152605,'E',['kips']],['dyn','dyne',1e-5,'E'],['pdl','poundal',0.138254954376,'E']]},
 'Pressure':{si:'Pa',u:[
  ['Pa','pascal',1,'E'],['kPa','kilopascal',1e3,'E',['kpa']],['MPa','megapascal',1e6,'E'],['hPa','hectopascal',1e2,'E'],['bar','bar',1e5,'E'],['mbar','millibar',1e2,'E'],
  ['psi','pound-force per square inch',6894.757293168362,'E',['lbf/in2','lbf/in²']],['ksi','kip per square inch',6894757.293168361,'E'],['atm','standard atmosphere',101325,'E'],['Torr','torr (1/760 atm)',133.32236842105263,'E',['torr']],
  ['mmHg','millimeter of mercury, conventional',133.322387415,'C'],['inHg','inch of mercury, conventional',3386.388640341,'C'],['inH₂O','inch of water, conventional (1 g/cm³)',249.08891,'C',['inH2O','inWC']],['kgf/cm²','kilogram-force per square centimeter',98066.5,'E',['kgf/cm2']]]},
 'Temperature':{si:'K',t:1,u:[
  ['°C','degree Celsius',0,'E',['C','degC']],['°F','degree Fahrenheit',0,'E',['F','degF']],['K','kelvin',0,'E',['kelvin']],['°R','degree Rankine',0,'E',['R','degR']]]},
 'Temperature difference':{si:'K',u:[
  ['ΔK','kelvin (difference)',1,'E',['dK']],['Δ°C','Celsius degree (difference)',1,'E',['dC','delta C']],['Δ°F','Fahrenheit degree (difference)',5/9,'E',['dF','delta F']],['Δ°R','Rankine degree (difference)',5/9,'E',['dR']]]},
 'Torque':{si:'N·m',u:[
  ['N·m','newton meter',1,'E',['Nm','N-m','N.m']],['N·cm','newton centimeter',1e-2,'E',['Ncm','N-cm']],['mN·m','millinewton meter',1e-3,'E',['mNm']],['kN·m','kilonewton meter',1e3,'E',['kNm']],
  ['lbf·ft','pound-force foot',1.3558179483314003,'E',['lbf-ft','ft-lb','ft·lbf','ft-lbf','lb-ft','ftlb']],['lbf·in','pound-force inch',0.1129848290276167,'E',['lbf-in','in-lb','in-lbf','lb-in','inlb']],['ozf·in','ounce-force inch',0.0070615518142260435,'E',['ozf-in','in-oz','oz-in']],
  ['kgf·m','kilogram-force meter',9.80665,'E',['kgf-m']],['kgf·cm','kilogram-force centimeter',0.0980665,'E',['kgf-cm']]]},
 'Flow (volume)':{si:'m³/s',u:[
  ['m³/s','cubic meter per second',1,'E',['m3/s']],['m³/h','cubic meter per hour',1/3600,'E',['m3/h']],['L/s','liter per second',1e-3,'E',['l/s']],['L/min','liter per minute',1/60000,'E',['l/min','lpm','LPM']],['mL/min','milliliter per minute',1/6e7,'E',['ml/min']],
  ['gal/min','US gallon per minute',6.30901964e-5,'E',['gpm','GPM']],['gal/h','US gallon per hour',1.0515032733333334e-6,'E',['gph']],['ft³/min','cubic foot per minute',4.719474432e-4,'E',['cfm','CFM','ft3/min']],['ft³/s','cubic foot per second',0.028316846592,'E',['cfs','ft3/s']]]},
 'Energy':{si:'J',u:[
  ['J','joule',1,'E'],['mJ','millijoule',1e-3,'E'],['kJ','kilojoule',1e3,'E'],['MJ','megajoule',1e6,'E'],['Wh','watt hour',3600,'E'],['kWh','kilowatt hour',3.6e6,'E'],
  ['cal','calorie (thermochemical)',4.184,'C',['calth']],['cal (IT)','calorie (International Table)',4.1868,'C',['calIT']],['Btu','British thermal unit (IT)',1055.05585262,'C',['BTU']],['ft·lbf','foot pound-force',1.3558179483314003,'E',['ft-lbf']],['eV','electronvolt',1.602176634e-19,'E'],['erg','erg',1e-7,'E']]},
 'Power':{si:'W',u:[
  ['W','watt',1,'E'],['mW','milliwatt',1e-3,'E'],['kW','kilowatt',1e3,'E'],['MW','megawatt',1e6,'E'],['hp','horsepower (550 ft·lbf/s)',745.6998715822702,'E',['HP']],['hp (metric)','metric horsepower',735.49875,'E',['PS']],
  ['Btu/h','Btu (IT) per hour',0.2930710701722222,'C',['BTU/h','Btuh']],['ft·lbf/s','foot pound-force per second',1.3558179483314003,'E',['ft-lbf/s']]]},
 'Speed':{si:'m/s',u:[
  ['m/s','meter per second',1,'E'],['km/h','kilometer per hour',1/3.6,'E',['kph']],['mi/h','mile per hour',0.44704,'E',['mph']],['ft/s','foot per second',0.3048,'E',['fps']],['ft/min','foot per minute',0.00508,'E',['fpm']],['in/s','inch per second',0.0254,'E',['ips']],['kn','knot',1852/3600,'E',['knot','kt']]]}
},
PFX:[['Q','quetta',30],['R','ronna',27],['Y','yotta',24],['Z','zetta',21],['E','exa',18],['P','peta',15],['T','tera',12],['G','giga',9],['M','mega',6],['k','kilo',3],['h','hecto',2],['da','deka',1],['','(no prefix)',0],['d','deci',-1],['c','centi',-2],['m','milli',-3],['µ','micro',-6],['n','nano',-9],['p','pico',-12],['f','femto',-15],['a','atto',-18],['z','zepto',-21],['y','yocto',-24],['r','ronto',-27],['q','quecto',-30]],
h:{
 /* a symbol can belong to two quantities (ft-lbf is torque or energy); prefer the quantity given */
 find:function(sym,pq){ var T=window.TOOL, s=String(sym||'').trim(), hit=null; if(!s) return null;
  var qs=Object.keys(T.U); if(pq&&T.U[pq]) qs=[pq].concat(qs);
  qs.forEach(function(q){ T.U[q].u.forEach(function(u){ if(!hit&&(u[0]===s||(u[4]&&u[4].indexOf(s)>=0))) hit={q:q,u:u}; }); });
  return hit; },
 unit:function(q,sym){ var L=window.TOOL.U[q]; if(!L) return null; for(var i=0;i<L.u.length;i++) if(L.u[i][0]===sym) return L.u[i]; return null; },
 /* to and from the SI unit; temperature needs the offsets */
 toSI:function(q,u,v){ if(window.TOOL.U[q].t){ var s=u[0]; return s==='°C'?v+273.15:s==='°F'?(v+459.67)*5/9:s==='°R'?v*5/9:v; } return v*u[2]; },
 fromSI:function(q,u,v){ if(window.TOOL.U[q].t){ var s=u[0]; return s==='°C'?v-273.15:s==='°F'?v*9/5-459.67:s==='°R'?v*9/5:v; } return v/u[2]; },
 conv:function(q,a,b,v){ var h=window.TOOL.h; return h.fromSI(q,b,h.toSI(q,a,v)); },
 g:function(x,p){ if(!isFinite(x)) return '—'; if(x===0) return '0'; p=p||8; var a=Math.abs(x);
  if(a<1e-4||a>=1e9){ var s=x.toExponential(p-1).split('e'), m=s[0].replace(/\.?0+$/,''); return m+' × 10<sup>'+(+s[1])+'</sup>'; }
  return x.toLocaleString('en-US',{maximumSignificantDigits:p}); },
 num:function(s){ s=String(s==null?'':s).replace(/[\s,  ]/g,'').replace(/[×x]10\^?/i,'e').replace(/^\+/,''); if(!/^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN; return Number(s); },
 sigOf:function(s){ s=String(s||'').replace(/[\s,  ]/g,'').replace(/^[-+]/,'').split(/e/i)[0]; var d=s.replace('.','').replace(/^0+/,''); if(s.indexOf('.')<0) d=d.replace(/0+$/,''); return Math.max(d.length,1); },
 /* scientific, engineering and SI-prefix forms with n significant digits, built from the digit string so nothing drifts */
 sci:function(x,n){ var s=Math.abs(x).toExponential(n-1).split('e'); return {neg:x<0,d:s[0].replace('.',''),e:+s[1]}; },
 eng:function(o){ var e3=Math.floor(o.e/3)*3, sh=o.e-e3, d=o.d; while(d.length<sh+1) d+='0'; var ip=d.slice(0,sh+1), fp=d.slice(sh+1); return {m:(o.neg?'−':'')+ip+(fp?'.'+fp:''),e:e3}; },
 dms:function(deg,dp){ var neg=deg<0, a=Math.abs(deg), d=Math.floor(a), mf=(a-d)*60, m=Math.floor(mf), s=(mf-m)*60, f=Math.pow(10,dp);
  s=Math.round(s*f)/f; if(s>=60){ s-=60; m+=1; } if(m>=60){ m-=60; d+=1; }
  return (neg?'−':'')+d+'° '+(m<10?'0':'')+m+'′ '+(s<10?'0':'')+s.toFixed(dp)+'″'; },
 pdms:function(t){ t=String(t||'').trim(); if(!t) return NaN; var neg=/^[-−]/.test(t), p=t.replace(/^[-−+]/,'').split(/[°′″'"dms:\s]+/).filter(Boolean).map(Number);
  if(!p.length||p.length>3||p.some(function(x){return !isFinite(x)||x<0;})) return NaN; if((p[1]||0)>=60||(p[2]||0)>=60) return NaN;
  var v=p[0]+(p[1]||0)/60+(p[2]||0)/3600; return neg?-v:v; }
},
sections:[
 {type:'custom',id:'cv',title:'Convert a value',hint:'Pick the quantity, enter the value and choose the units. The table below the result shows the same value in every unit of that quantity. Temperature converts a reading (with the offsets); use <b>Temperature difference</b> for a change or a tolerance such as ±2 °F.',
  html:'<div class="tf-grid c4"><label class="tf"><span>Quantity</span><select data-f="q" aria-label="Quantity" class="uc-q"></select></label><label class="tf"><span>Value</span><input type="number" step="any" inputmode="decimal" data-f="v" aria-label="Value"></label><label class="tf"><span>From</span><select data-f="fu" aria-label="From unit" class="uc-fu"></select></label><label class="tf"><span>To</span><select data-f="tu" aria-label="To unit" class="uc-tu"></select></label></div><div class="stat uc-main"></div><div class="tgw"><table class="mv uc-all"></table></div>',
  init:function(el,api){ var T=window.TOOL; el.querySelector('.uc-q').innerHTML=Object.keys(T.U).map(function(q){ return '<option>'+api.esc(q)+'</option>'; }).join(''); T.fillUnits(el,api); }},
 {type:'grid',id:'w',title:'Conversion worksheet',rows:4,hint:'Several conversions on one sheet, for a procedure or a homework set. Type the unit symbols: m, mm, in, ft, µm (or um), lb, kg, lbf, N, psi, kPa, bar, inHg, °C or C, °F or F, K, lbf·ft (or ft-lb), lbf·in (or in-lb), N·m (or Nm), gal, L, gpm, L/min, cfm, Btu, kWh, hp, W, mph and the others in the table above.',cols:[
  {id:'v',label:'Value',type:'number'},
  {id:'f',label:'From unit',w:90,ph:'in'},
  {id:'t',label:'To unit',w:90,ph:'mm'},
  {id:'r',label:'Result',calc:function(r,api){ var o=window.TOOL.wk(r,api); return o.ok?window.TOOL.h.g(o.y,8)+' '+api.esc(o.b[0]):(o.msg||''); }},
  {id:'k',label:'Multiply by',calc:function(r,api){ var o=window.TOOL.wk(r,api); if(!o.ok) return ''; return window.TOOL.U[o.q].t?'offset':window.TOOL.h.g(o.a[2]/o.b[2],10)+(o.a[3]==='E'&&o.b[3]==='E'?' (exact)':''); }},
  {id:'qq',label:'Quantity',calc:function(r,api){ var o=window.TOOL.wk(r,api); return o.q?api.esc(o.q):''; }}]},
 {type:'fields',title:'Scientific and engineering notation, SI prefixes',cols:3,hint:'Scientific notation puts one digit before the decimal point. Engineering notation keeps the exponent a multiple of 3, so it lines up with the SI prefixes. Leave significant digits blank to keep the digits you typed.',fields:[
  {id:'nx',label:'Number',ph:'0.000045670 or 4.567e-5'},
  {id:'nd',label:'Significant digits',type:'number',min:1,max:15},
  {id:'nu',label:'Unit symbol (optional)',ph:'A'},
  {id:'pv',label:'Prefix conversion: value',type:'number'},
  {id:'pf',label:'From prefix',type:'select',opts:['Q quetta 10^30','R ronna 10^27','Y yotta 10^24','Z zetta 10^21','E exa 10^18','P peta 10^15','T tera 10^12','G giga 10^9','M mega 10^6','k kilo 10^3','h hecto 10^2','da deka 10^1','(no prefix) 10^0','d deci 10^-1','c centi 10^-2','m milli 10^-3','µ micro 10^-6','n nano 10^-9','p pico 10^-12','f femto 10^-15','a atto 10^-18','z zepto 10^-21','y yocto 10^-24','r ronto 10^-27','q quecto 10^-30']},
  {id:'pt',label:'To prefix',type:'select',opts:['Q quetta 10^30','R ronna 10^27','Y yotta 10^24','Z zetta 10^21','E exa 10^18','P peta 10^15','T tera 10^12','G giga 10^9','M mega 10^6','k kilo 10^3','h hecto 10^2','da deka 10^1','(no prefix) 10^0','d deci 10^-1','c centi 10^-2','m milli 10^-3','µ micro 10^-6','n nano 10^-9','p pico 10^-12','f femto 10^-15','a atto 10^-18','z zepto 10^-21','y yocto 10^-24','r ronto 10^-27','q quecto 10^-30']}]},
 {type:'custom',id:'nt',title:'Notation results',html:'<div class="stat uc-nt"></div><div class="stat uc-pf"></div>'},
 {type:'fields',title:'Angles',cols:3,hint:'Degrees, minutes and seconds can be typed as 12° 30′ 15″, 12 30 15 or 12:30:15. One full turn is 360°, 2π rad, 400 grad and 6400 NATO mils.',fields:[
  {id:'av',label:'Angle',ph:'12° 30′ 15″'},
  {id:'au',label:'Given in',type:'select',opts:['Degrees, minutes, seconds','Decimal degrees','Radians','Grads (gon)','Arcminutes','Arcseconds','Mils (NATO, 6400 per turn)','Revolutions']},
  {id:'ad',label:'Decimals on seconds',type:'number',min:0,max:6,ph:'2'}]},
 {type:'custom',id:'an',title:'The angle in every unit',html:'<div class="stat uc-an"></div>'},
 {type:'fields',title:'Ratios: percent, ppm, ppb and decibels',cols:3,hint:'Percent, ppm and ppb are the same ratio on different scales: 1% = 10,000 ppm = 10,000,000 ppb. Decibels compare two powers with 10 log<sub>10</sub>(P<sub>2</sub>/P<sub>1</sub>), or two amplitudes such as voltages with 20 log<sub>10</sub>(V<sub>2</sub>/V<sub>1</sub>).',fields:[
  {id:'rv',label:'Ratio value',type:'number'},
  {id:'ra',label:'Given as',type:'select',opts:['Fraction (decimal)','Percent (%)','Parts per million (ppm)','Parts per billion (ppb)']},
  {id:'dr',label:'Ratio to express in dB',type:'number',min:0},
  {id:'dk',label:'Kind of ratio',type:'select',opts:['Power ratio (P2/P1)','Amplitude ratio: voltage, current, pressure (V2/V1)']},
  {id:'dv',label:'dB value to turn back into ratios',type:'number'}]},
 {type:'custom',id:'ro',title:'Ratio results',html:'<div class="stat uc-ra"></div><div class="stat uc-db"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out uc-out"></div>'}
],
fillUnits:function(el,api){
 var T=this, S=api.state(), q=T.U[S.f.q]?S.f.q:'Length', L=T.U[q], fu=el.querySelector('.uc-fu'), tu=el.querySelector('.uc-tu');
 if(fu.dataset.q===q) return; fu.dataset.q=q;
 var o=L.u.map(function(u){ return '<option value="'+api.esc(u[0])+'">'+api.esc(u[0]+' — '+u[1])+'</option>'; }).join(''); fu.innerHTML=o; tu.innerHTML=o;
 if(!T.h.unit(q,S.f.fu)) S.f.fu=L.u[0][0]; if(!T.h.unit(q,S.f.tu)) S.f.tu=L.u[1][0];
 S.f.q=q; el.querySelector('.uc-q').value=q; fu.value=S.f.fu; tu.value=S.f.tu;
},
wk:function(r,api){
 var T=window.TOOL, h=T.h, v=api.num(r.v), b0=h.find(r.t), a=h.find(r.f,b0&&b0.q), b=h.find(r.t,a&&a.q);
 if(!r.f&&!r.t&&(r.v===''||r.v==null)) return {ok:false};
 if(r.f&&!a) return {ok:false,msg:'<span class="uc-bad">unknown unit "'+api.esc(r.f)+'"</span>'};
 if(r.t&&!b) return {ok:false,msg:'<span class="uc-bad">unknown unit "'+api.esc(r.t)+'"</span>'};
 if(!a||!b||isNaN(v)) return {ok:false,q:a?a.q:''};
 if(a.q!==b.q) return {ok:false,q:a.q,msg:'<span class="uc-bad">'+api.esc(a.q)+' ≠ '+api.esc(b.q)+'</span>'};
 return {ok:true,q:a.q,a:a.u,b:b.u,y:h.conv(a.q,a.u,b.u,v)};
},
update:function(root,api){
 var T=window.TOOL, h=T.h, S=api.state(), f=[];
 /* 1. main converter */
 var el=root.querySelector('[data-custom="cv"]'); T.fillUnits(el,api);
 var q=S.f.q, a=h.unit(q,S.f.fu), b=h.unit(q,S.f.tu), v=api.num(S.f.v), L=T.U[q];
 if(a&&b&&!isNaN(v)){
  var y=h.conv(q,a,b,v), K=L.t?NaN:a[2]/b[2];
  root.querySelector('.uc-main').innerHTML='<div><b>'+h.g(y,8)+' '+api.esc(b[0])+'</b><span>'+api.esc(S.f.v)+' '+api.esc(a[0])+' =</span></div>'+(L.t?'<div><b>'+(a[0]===b[0]?'none':'offset')+'</b><span>Not a single factor: temperature scales have different zeros</span></div>':'<div><b>'+h.g(K,10)+'</b><span>Multiply by'+(a[3]==='E'&&b[3]==='E'?' (exact)':'')+'</span></div><div><b>'+h.g(1/K,10)+'</b><span>The reverse factor, '+api.esc(b[0])+' to '+api.esc(a[0])+'</span></div>');
  var si=h.toSI(q,a,v);
  root.querySelector('.uc-all').innerHTML='<thead><tr><th>Unit</th><th>Name</th><th>Value</th><th>'+(L.t?'From kelvin':'1 unit in '+api.esc(L.si))+'</th></tr></thead><tbody>'+L.u.map(function(u){
   var rel=L.t?({'°C':'K − 273.15','°F':'K × 9/5 − 459.67','K':'K','°R':'K × 9/5'})[u[0]]:h.g(u[2],12)+(u[3]==='C'?' conventional':u[3]==='E'?' exact':'');
   return '<tr'+(u===b?' class="uc-hit"':'')+'><td class="mt">'+api.esc(u[0])+'</td><td class="mo">'+api.esc(u[1])+'</td><td class="mt">'+h.g(h.fromSI(q,u,si),8)+'</td><td>'+rel+'</td></tr>'; }).join('')+'</tbody>';
  if(L.t){
   f.push(['','A temperature reading converts with an offset: °F = °C × 9/5 + 32 and K = °C + 273.15. A temperature <i>difference</i> does not: a tolerance of ±2 °C is ±3.6 °F, not ±35.6 °F. Use <b>Temperature difference</b> for tolerances, drifts and uncertainties.']);
   if(h.toSI(q,a,v)<0) f.push(['warn','That temperature is below absolute zero (0 K = −273.15 °C = −459.67 °F), so it cannot be a real reading. If it is a difference, use <b>Temperature difference</b>.']);
  } else f.push([a[3]==='E'&&b[3]==='E'?'ok':'',a[3]==='E'&&b[3]==='E'?'Both units are defined exactly, so the factor '+h.g(K,12)+' is fixed by definition (shown rounded to 12 digits). Any rounding of the result is your choice, not the conversion\'s.':'One of the units has a conventional value (manometric pressure units or a calorie-based unit), defined at standard conditions. Say which definition you used on the record.']);
 } else { root.querySelector('.uc-main').innerHTML=''; root.querySelector('.uc-all').innerHTML=''; f.push(['','Enter a value to convert.']); }
 /* 2. worksheet */
 var bad=0, mism=0; S.g.w.forEach(function(r){ var o=T.wk(r,api); if(o.msg) { if(/≠/.test(o.msg)) mism++; else bad++; } });
 if(bad) f.push(['warn',bad+' worksheet row'+(bad>1?'s have':' has')+' a unit symbol the tool does not know. Symbols are case sensitive: mm is a millimeter, Mm would be a megameter, and mPa is a thousand times smaller than MPa.']);
 if(mism) f.push(['warn',mism+' worksheet row'+(mism>1?'s convert':' converts')+' between different quantities (for example lbf to kg). Force and mass are not interchangeable: 1 kgf is the weight of 1 kg under standard gravity, 9.80665 N.']);
 /* 3. notation */
 var x=h.num(S.f.nx), nd=api.num(S.f.nd), nt='', pf='';
 if(String(S.f.nx||'').trim()!==''&&isNaN(x)) f.push(['warn','The number "'+api.esc(S.f.nx)+'" could not be read. Use digits with a decimal point, and e or E for a power of ten (4.567e-5).']);
 if(!isNaN(x)){
  var n=nd>=1&&nd<=15?Math.round(nd):Math.min(h.sigOf(S.f.nx),15), un=api.esc(S.f.nu||'');
  if(x===0) nt='<div><b>0</b><span>Zero has no exponent</span></div>';
  else { var o=h.sci(x,n), e=h.eng(o), m=(o.neg?'−':'')+o.d.charAt(0)+(o.d.length>1?'.'+o.d.slice(1):''), P=null;
   T.PFX.forEach(function(p){ if(p[2]===e.e&&(p[2]%3===0)) P=p; });
   nt='<div><b>'+m+' × 10<sup>'+o.e+'</sup></b><span>Scientific notation, '+n+' significant digit'+(n>1?'s':'')+'</span></div><div><b>'+e.m+' × 10<sup>'+e.e+'</sup></b><span>Engineering notation</span></div>'+(P?'<div><b>'+e.m+' '+api.esc(P[0])+un+'</b><span>With the SI prefix '+P[1]+(un?'':' (add your unit symbol)')+'</span></div>':'')+'<div><b>'+api.esc(Number(x.toPrecision(n)).toLocaleString('en-US',{minimumSignificantDigits:n,maximumSignificantDigits:n}))+'</b><span>Plain decimal, rounded</span></div>';
   if(!(nd>=1)) f.push(['','Significant digits taken from the number as typed: '+n+'. Trailing zeros after the decimal point count; trailing zeros in a whole number without a decimal point are ambiguous and are not counted.']);
  }
 }
 root.querySelector('.uc-nt').innerHTML=nt;
 var pv=api.num(S.f.pv), ex=function(s){ var m=/10\^(-?\d+)$/.exec(s||''); return m?+m[1]:NaN; }, e1=ex(S.f.pf), e2=ex(S.f.pt);
 if(!isNaN(pv)&&!isNaN(e1)&&!isNaN(e2)){ var sym=function(s){ return s.indexOf('(no')===0?'':s.split(' ')[0]; };
  pf='<div><b>'+h.g(pv*Math.pow(10,e1-e2),10)+' '+sym(S.f.pt)+'</b><span>'+api.esc(S.f.pv)+' '+sym(S.f.pf)+' = (move the point '+Math.abs(e1-e2)+' place'+(Math.abs(e1-e2)===1?'':'s')+' to the '+(e1>=e2?'right':'left')+')</span></div><div><b>10<sup>'+(e1-e2)+'</sup></b><span>Multiply by 10<sup>(from − to)</sup></span></div>'; }
 root.querySelector('.uc-pf').innerHTML=pf;
 /* 4. angles */
 var au=S.f.au||'Degrees, minutes, seconds', at=S.f.av, dp=api.num(S.f.ad); if(!(dp>=0&&dp<=6)) dp=2; dp=Math.round(dp);
 var deg=NaN, A=[1,1,180/Math.PI,0.9,1/60,1/3600,360/6400,360], AU=['Degrees, minutes, seconds','Decimal degrees','Radians','Grads (gon)','Arcminutes','Arcseconds','Mils (NATO, 6400 per turn)','Revolutions'];
 if(String(at||'').trim()!==''){ if(au===AU[0]) deg=h.pdms(at); else { var av=h.num(at); deg=isNaN(av)?NaN:av*A[AU.indexOf(au)]; } }
 if(String(at||'').trim()!==''&&isNaN(deg)) f.push(['warn','The angle "'+api.esc(at)+'" could not be read as '+api.esc(au.toLowerCase())+'. Minutes and seconds must each be below 60.']);
 root.querySelector('.uc-an').innerHTML=isNaN(deg)?'':'<div><b>'+h.dms(deg,dp)+'</b><span>Degrees, minutes, seconds</span></div><div><b>'+h.g(deg,10)+'°</b><span>Decimal degrees</span></div><div><b>'+h.g(deg*Math.PI/180,10)+'</b><span>Radians</span></div><div><b>'+h.g(deg/0.9,10)+'</b><span>Grads (gon)</span></div><div><b>'+h.g(deg*60,10)+'′</b><span>Arcminutes</span></div><div><b>'+h.g(deg*3600,10)+'″</b><span>Arcseconds</span></div><div><b>'+h.g(deg*6400/360,10)+'</b><span>NATO mils</span></div><div><b>'+h.g(deg/360,10)+'</b><span>Revolutions</span></div>';
 if(!isNaN(deg)&&Math.abs(deg)>=360) f.push(['','The angle is more than a full turn. Reduced to one turn it is '+h.dms(((deg%360)+360)%360,dp)+'.']);
 /* 5. ratios and dB */
 var rv=api.num(S.f.rv), ri=['Fraction (decimal)','Percent (%)','Parts per million (ppm)','Parts per billion (ppb)'].indexOf(S.f.ra||'Fraction (decimal)'), RS=[1,100,1e6,1e9];
 if(ri<0) ri=0;
 if(!isNaN(rv)){ var fr=rv/RS[ri]; root.querySelector('.uc-ra').innerHTML='<div><b>'+h.g(fr,10)+'</b><span>Fraction</span></div><div><b>'+h.g(fr*100,10)+'%</b><span>Percent</span></div><div><b>'+h.g(fr*1e6,10)+'</b><span>ppm (parts per million)</span></div><div><b>'+h.g(fr*1e9,10)+'</b><span>ppb (parts per billion)</span></div>'; }
 else root.querySelector('.uc-ra').innerHTML='';
 var dr=api.num(S.f.dr), amp=/^Amplitude/.test(S.f.dk||''), dv=api.num(S.f.dv), dh='';
 if(!isNaN(dr)){ if(dr>0) dh+='<div><b>'+h.g((amp?20:10)*Math.log(dr)/Math.LN10,6)+' dB</b><span>'+(amp?'20':'10')+' log<sub>10</sub>('+api.esc(S.f.dr)+'), '+(amp?'amplitude':'power')+' ratio</span></div>'; else f.push(['warn','A ratio must be greater than zero to be expressed in decibels.']); }
 if(!isNaN(dv)) dh+='<div><b>'+h.g(Math.pow(10,dv/10),8)+'</b><span>Power ratio for '+api.esc(S.f.dv)+' dB (10<sup>dB/10</sup>)</span></div><div><b>'+h.g(Math.pow(10,dv/20),8)+'</b><span>Amplitude ratio for '+api.esc(S.f.dv)+' dB (10<sup>dB/20</sup>)</span></div>';
 root.querySelector('.uc-db').innerHTML=dh;
 if(!isNaN(dr)||!isNaN(dv)) f.push(['','A power ratio of 2 is +3.01 dB but a voltage ratio of 2 is +6.02 dB, because power goes as voltage squared. Check which kind of ratio a specification means before converting.']);
 f.push(['','Exact by definition: 1 in = 25.4 mm, 1 lb = 0.45359237 kg, standard gravity 9.80665 m/s², so 1 lbf = 4.4482216152605 N and 1 psi = 6894.757 Pa. Factors from NIST SP 811, Appendix B.']);
 root.querySelector('.uc-out').innerHTML=api.flags(f);
},
example:{f:{q:'Pressure',v:'150',fu:'psi',tu:'kPa',nx:'0.000045670',nd:'',nu:'A',pv:'4.7',pf:'M mega 10^6',pt:'k kilo 10^3',av:'12° 30′ 15″',au:'Degrees, minutes, seconds',ad:'2',rv:'250',ra:'Parts per million (ppm)',dr:'0.5',dk:'Power ratio (P2/P1)',dv:'20'},
 g:{w:[{v:'0.750',f:'in',t:'mm'},{v:'25',f:'lbf·ft',t:'N·m'},{v:'68',f:'°F',t:'°C'},{v:'2.5',f:'gal',t:'L'},{v:'12',f:'kgf',t:'N'},{v:'30',f:'gpm',t:'L/min'},{v:'0.0005',f:'in',t:'µm'},{v:'3.6',f:'Δ°F',t:'Δ°C'}]}}
}
