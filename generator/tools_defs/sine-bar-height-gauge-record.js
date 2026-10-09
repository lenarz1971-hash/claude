{
slug:'sine-bar-height-gauge-record',
h:{
 R:Math.PI/180,
 dp:function(v){ var m=String(v==null?'':v).split('.')[1]; return m?m.replace(/[^0-9]/g,'').length:0; },
 bar:function(api){ var S=api.state(), b=S.f.bar||'', m=b.match(/^(\d+) (in|mm)$/);
  if(m) return {L:+m[1],u:m[2]}; var L=api.num(S.f.lc); if(b==='Other'&&L>0) return {L:L,u:S.f.lu==='mm'?'mm':'in'}; return null; },
 dms:function(a){ if(!isFinite(a)) return '—'; var s=Math.round(Math.abs(a)*3600), d=Math.floor(s/3600), m=Math.floor((s%3600)/60), x=s%60; return (a<0?'−':'')+d+'° '+(m<10?'0':'')+m+'′ '+(x<10?'0':'')+x+'″'; },
 ang:function(api){ var S=api.state(), n=api.num, d=n(S.f.ad), m=n(S.f.am), s=n(S.f.as); if(isNaN(d)&&isNaN(m)&&isNaN(s)) return NaN; return (d||0)+(m||0)/60+(s||0)/3600; },
 /* one way to build a stack from the standard 81-piece inch set: clear the last digit first */
 stack:function(H){
  var r=Math.round(H*10000), out=[], k, d;
  if(r<=0) return null;
  if(r%10){ d=r%10; out.push(1000+d); r-=1000+d; }
  if(r<0) return null;
  if(r%500){ k=(((r-1000)/10)%50+50)%50; out.push(1000+10*k); r-=1000+10*k; }
  if(r<0) return null;
  if(r%10000){ out.push(r%10000); r-=r%10000; }
  var w=r/10000, best=null;
  for(var m=0;m<16;m++){ var sum=0, set=[]; for(var j=0;j<4;j++) if(m&(1<<j)){ sum+=j+1; set.push((j+1)*10000); } if(sum===w&&(!best||set.length<best.length)) best=set; }
  if(!best) return null;
  return out.concat(best.reverse());
 },
 hr:function(r,api){ var n=api.num, rd=n(r.rd), z=n(r.z), M=n(r.mst); if(isNaN(rd)) return null;
  if(isNaN(z)) z=0; var a=(isNaN(M)?0:M)+(rd-z), d=Math.max(this.dp(r.rd),this.dp(r.z),this.dp(r.mst),this.dp(r.nom));
  var nom=n(r.nom), tm=n(r.tm), tp=n(r.tp), o={a:a,d:d};
  if(!isNaN(nom)){ o.dev=a-nom; if(!isNaN(tm)||!isNaN(tp)){ var e=1e-9; o.ok=(isNaN(tm)||a>=nom-Math.abs(tm)-e)&&(isNaN(tp)||a<=nom+Math.abs(tp)+e); } }
  return o; }
},
sections:[
 {type:'fields',title:'Sine bar setup',cols:3,hint:'A sine bar tilted on a gauge block stack sets an angle by trigonometry: the stack height H under one roll is the side opposite the angle, and the center distance L between the rolls is the hypotenuse. H = L × sin θ.',fields:[
  {id:'org',label:'Shop or lab'},
  {id:'part',label:'Part or setup'},
  {id:'bar',label:'Sine bar (center distance)',type:'select',opts:['5 in','10 in','100 mm','200 mm','Other']},
  {id:'lc',label:'Other bar length',type:'number',min:0,hint:'Only when the bar is Other.'},
  {id:'lu',label:'Other bar units',type:'select',opts:['in','mm']},
  {id:'ad',label:'Target angle: degrees',type:'number',min:0,max:90},
  {id:'am',label:'Minutes',type:'number',min:0,max:59},
  {id:'as',label:'Seconds',type:'number',min:0,max:59},
  {id:'hs',label:'Or: angle from a stack you have (height)',type:'number',min:0,hint:'Gives θ = asin(H ÷ L).'}]},
 {type:'custom',id:'sb',title:'Gauge block stack and angle',html:'<div class="stat sb-stat"></div><div class="svgw sb-svg"></div>'},
 {type:'fields',title:'Check the angle on the part',cols:4,hint:'With the part clamped on the sine bar set to the nominal angle, the surface under test should be parallel to the surface plate. Run an indicator along it and record the readings at two points a known distance apart.',fields:[
  {id:'ra',label:'Indicator at point A',type:'number'},
  {id:'rb',label:'Indicator at point B',type:'number'},
  {id:'dab',label:'Distance A to B',type:'number',min:0},
  {id:'atol',label:'Angle tolerance ± (minutes)',type:'number',min:0}]},
 {type:'grid',id:'h',title:'Height gauge and comparator readings',rows:4,hint:'Comparator method: set the indicator on a gauge block master near the nominal, record its reading on the master as the zero reading (ideally 0), then the part reading. Actual = master + (part reading − zero reading). For a direct height gauge reading, leave the master blank and enter the reading taken on the surface plate as the zero reading.',cols:[
  {id:'ft',label:'Feature',type:'textarea',rows:1,w:150},
  {id:'nom',label:'Nominal',type:'number'},
  {id:'tm',label:'Tol −',type:'number',min:0},
  {id:'tp',label:'Tol +',type:'number',min:0},
  {id:'mst',label:'Master stack',type:'number',min:0},
  {id:'z',label:'Zero reading',tip:'Reading on the master, or on the surface plate for a direct reading',type:'number'},
  {id:'rd',label:'Part reading',type:'number'},
  {id:'act',label:'Actual',calc:function(r,api){var o=window.TOOL.h.hr(r,api);return o?o.a.toFixed(o.d):'';}},
  {id:'dv',label:'Deviation',calc:function(r,api){var o=window.TOOL.h.hr(r,api);return o&&o.dev!==undefined?(o.dev>0?'+':o.dev<0?'−':'')+Math.abs(o.dev).toFixed(o.d):'';}},
  {id:'res',label:'Result',calc:function(r,api){var o=window.TOOL.h.hr(r,api);return o&&o.ok!==undefined?'<span class="sb-'+(o.ok?'ok':'bad')+'">'+(o.ok?'Pass':'Fail')+'</span>':'';}}]},
 {type:'fields',title:'Zero drift',cols:3,hint:'Re-check the first master at the end of the run. If the reading moved, every reading in between is uncertain by up to that amount.',fields:[
  {id:'zs',label:'Master reading at start',type:'number'},
  {id:'ze',label:'Master reading at end',type:'number'},
  {id:'by',label:'Measured by'}]},
 {type:'custom',id:'out',title:'Checks',html:'<div class="out sb-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, H=T.h, S=api.state(), n=api.num, f=[], esc=api.esc;
 var B=H.bar(api), th=H.ang(api), hs=n(S.f.hs), st=root.querySelector('.sb-stat'), sv=root.querySelector('.sb-svg'), t='', dd=B&&B.u==='mm'?3:4;
 var Hx=NaN, Hr=NaN, back=NaN, blocks=null;
 if(B&&isFinite(th)){
  if(th<=0||th>=90){ f.push(['warn','Enter an angle between 0° and 90°.']); }
  else {
   Hx=B.L*Math.sin(th*H.R); Hr=Math.round(Hx*Math.pow(10,dd))/Math.pow(10,dd); back=Math.asin(Hr/B.L)/H.R;
   t+='<div><b>'+Hx.toFixed(dd+2)+' '+B.u+'</b><span>Exact stack H = '+B.L+' × sin '+H.dms(th)+'</span></div><div><b>'+Hr.toFixed(dd)+' '+B.u+'</b><span>Stack to build</span></div><div><b>'+H.dms(back)+'</b><span>Angle that stack gives</span></div>';
   if(B.u==='in'){ blocks=H.stack(Hr);
    t+='<div class="wide2"><b>'+(blocks?blocks.map(function(b){return (b/10000).toFixed(b%10?4:3);}).join(' + '):'—')+'</b><span>'+(blocks?blocks.length+' blocks from an 81-piece inch set':'Cannot build this height with the 81-piece method')+'</span></div>'; }
   if(th>45) f.push(['warn','Above about 45° the sine bar loses sensitivity: a small error in the stack makes a large error in angle. Set the complement on the bar and turn the part, or use another setup.']);
  }
 }
 if(B&&hs>0){ if(hs>=B.L) f.push(['warn','The stack height must be less than the bar length ('+B.L+' '+B.u+').']); else { var a2=Math.asin(hs/B.L)/H.R; t+='<div><b>'+H.dms(a2)+'</b><span>Angle from a '+esc(S.f.hs)+' '+B.u+' stack ('+a2.toFixed(4)+'°)</span></div>'; } }
 st.innerHTML=t; st.style.display=t?'':'none';
 if(isFinite(Hr)&&B){
  var L=B.L, ang=th*H.R, W=640, x0=70, sc=430/L, x1=x0+L*sc*Math.cos(ang), y0=210, y1=y0-L*sc*Math.sin(ang), g='';
  g+='<line x1="20" y1="'+(y0+12)+'" x2="620" y2="'+(y0+12)+'" stroke="#7C8B99" stroke-width="2"/><text x="24" y="'+(y0+30)+'" font-family="Archivo, sans-serif" font-size="12" fill="#4A5D71">surface plate</text>';
  g+='<rect x="'+(x1-26)+'" y="'+(y1+6)+'" width="52" height="'+(y0+12-y1-6)+'" fill="#F3E7BE" stroke="#9C7C1F"/>';
  g+='<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" stroke="#0F3E68" stroke-width="10" stroke-linecap="round"/>';
  g+='<circle cx="'+x0+'" cy="'+y0+'" r="6" fill="#fff" stroke="#0F3E68" stroke-width="2"/><circle cx="'+x1+'" cy="'+y1+'" r="6" fill="#fff" stroke="#0F3E68" stroke-width="2"/>';
  g+='<path d="M '+(x0+70)+' '+y0+' A 70 70 0 0 0 '+(x0+70*Math.cos(ang))+' '+(y0-70*Math.sin(ang))+'" fill="none" stroke="#9C7C1F" stroke-width="1.5"/>';
  g+='<text x="'+(x0+78)+'" y="'+(y0-8)+'" font-family="Archivo, sans-serif" font-size="13" fill="#16273A">θ = '+H.dms(th)+'</text>';
  g+='<text x="'+((x0+x1)/2-30)+'" y="'+((y0+y1)/2-16)+'" font-family="Archivo, sans-serif" font-size="13" fill="#0F3E68" transform="rotate('+(-th)+' '+((x0+x1)/2)+' '+((y0+y1)/2)+')">L = '+L+' '+B.u+' between rolls</text>';
  g+='<text x="'+(x1+34)+'" y="'+((y0+y1)/2+6)+'" font-family="Archivo, sans-serif" font-size="13" fill="#9C7C1F">H = '+Hr.toFixed(dd)+' '+B.u+'</text>';
  var vy=Math.max(0,Math.floor(y1-36)); sv.innerHTML='<svg viewBox="0 '+vy+' '+W+' '+(250-vy)+'" role="img" aria-label="Sine bar diagram">'+g+'</svg>'; sv.style.display='';
 } else { sv.innerHTML=''; sv.style.display='none'; }
 if(!B&&(S.f.bar==='Other')) f.push(['warn','Enter the length of the Other sine bar.']);
 if(B&&isFinite(Hx)) f.push(['ok','Set the bar to <b>'+H.dms(th)+'</b> on a <b>'+Hr.toFixed(dd)+' '+B.u+'</b> stack. '+(Math.abs(back-th)*3600<0.5?'Rounding the stack to '+(B.u==='in'?'0.0001 in':'0.001 mm')+' changes the angle by less than half a second.':'Rounding the stack to '+(B.u==='in'?'0.0001 in':'0.001 mm')+' changes the angle by '+(Math.abs(back-th)*3600).toFixed(1)+'″.')]);
 if(B&&B.u==='mm'&&isFinite(Hx)) f.push(['','Build the stack from your metric set with the fewest blocks, clearing the last decimal place first. The stack must total '+Hr.toFixed(dd)+' mm.']);
 if(blocks) f.push(['','Stack method: clear the rightmost digit first (a 0.100x block), then the thousandths with a 0.1xx block, then a 0.050 to 0.950 block, then whole inches. Fewest blocks means fewest wringing interfaces, each a small source of error.']);
 var ra=n(S.f.ra), rb=n(S.f.rb), D=n(S.f.dab), at=n(S.f.atol);
 if(!isNaN(ra)&&!isNaN(rb)&&D>0){
  var e=Math.atan((rb-ra)/D)/H.R, em=e*60;
  var msg='Across '+esc(S.f.dab)+' the indicator changed '+(rb-ra>=0?'+':'−')+Math.abs(rb-ra).toFixed(Math.max(H.dp(S.f.ra),H.dp(S.f.rb)))+', so the surface is off the nominal angle by <b>'+(em>=0?'+':'−')+Math.abs(em).toFixed(2)+'′</b> ('+(Math.abs(e)*3600).toFixed(0)+'″). The sign tells you which way it leans: positive means point B is high.';
  if(at>0) f.push([Math.abs(em)<=at+1e-9?'ok':'warn',msg+' Tolerance ±'+esc(S.f.atol)+'′: <b>'+(Math.abs(em)<=at+1e-9?'within tolerance':'out of tolerance')+'</b>.']);
  else f.push(['',msg+' Enter the angle tolerance to judge it.']);
 } else if(S.f.ra||S.f.rb||S.f.dab) f.push(['warn','The angle check needs both indicator readings and the distance between them.']);
 var rows=S.g.h.filter(function(r){return r.ft||r.rd||r.nom;}), fails=[], noTol=[], noRd=[], tt=[];
 rows.forEach(function(r,i){ var o=H.hr(r,api), nm='<b>'+esc(r.ft||('Row '+(i+1)))+'</b>';
  if(!o){ noRd.push(nm); return; }
  if(o.ok===false) fails.push(nm+' at '+o.a.toFixed(o.d)+' (nominal '+esc(r.nom)+')');
  if(o.ok===undefined) noTol.push(nm);
  var tm=n(r.tm), tp=n(r.tp); if(!isNaN(tm)&&!isNaN(tp)) tt.push(Math.abs(tm)+Math.abs(tp));
 });
 if(rows.length){
  var judged=rows.length-noRd.length-noTol.length;
  if(judged>0) f.push([fails.length?'warn':'ok','<b>'+(judged-fails.length)+' of '+judged+'</b> heights judged are within tolerance.'+(fails.length?' Out of tolerance: '+fails.join('; ')+'.':'')]);
  if(noRd.length) f.push(['warn','No reading for '+noRd.join(', ')+'.']);
  if(noTol.length) f.push(['warn','No nominal or tolerance for '+noTol.join(', ')+', so it cannot be judged.']);
 }
 var zs=n(S.f.zs), ze=n(S.f.ze);
 if(!isNaN(zs)&&!isNaN(ze)){ var dr=Math.abs(ze-zs), mt=tt.length?Math.min.apply(null,tt):NaN, dpz=Math.max(H.dp(S.f.zs),H.dp(S.f.ze));
  if(dr===0) f.push(['ok','No zero drift between the start and end of the run.']);
  else f.push([isFinite(mt)&&dr>mt/10+1e-12?'warn':'','Zero drifted '+dr.toFixed(dpz)+' during the run'+(isFinite(mt)?', '+(dr/mt*100).toFixed(0)+'% of the tightest total tolerance ('+mt.toFixed(dpz)+')':'')+'. '+(isFinite(mt)&&dr>mt/10+1e-12?'That is more than a tenth of the tolerance (the rule-of-ten guideline): re-zero and repeat the readings near the limits.':'Small against the tolerances; note it on the record.')]); }
 else if(rows.length) f.push(['','Record a master reading at the end of the run to show the setup did not drift.']);
 if(f.length) f.push(['','Work on a clean, calibrated surface plate, let the part and blocks reach the same temperature, and handle gauge blocks as little as possible: steel grows about 0.0000064 in per inch for each °F (11.5 µm per meter per °C), so heat from a hand shows up in a 0.0001 in reading.']);
 root.querySelectorAll('table.tg textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });
 root.querySelector('.sb-out').innerHTML=api.flags(f,'Choose a sine bar and enter a target angle, or enter height readings below.');
},
example:{f:{org:'Granite Ridge Precision Tooling, inspection lab',part:'Wedge fixture block WF-15, 15° face',bar:'5 in',lc:'',lu:'',ad:'15',am:'0',as:'0',hs:'1.7101',ra:'0.0000',rb:'0.0006',dab:'2.000',atol:'5',zs:'0.0000',ze:'0.0001',by:'M. Brandt'},
 g:{h:[
  {ft:'Base thickness',nom:'1.0000',tm:'0.0010',tp:'0.0010',mst:'1.0000',z:'0.0000',rd:'0.0004'},
  {ft:'Pocket floor height',nom:'0.7500',tm:'0.0010',tp:'0.0010',mst:'0.7500',z:'0.0000',rd:'-0.0012'},
  {ft:'Shoulder height',nom:'2.2500',tm:'0.0020',tp:'0.0020',mst:'2.2500',z:'0.0001',rd:'0.0009'},
  {ft:'Overall height, direct reading',nom:'3.000',tm:'0.005',tp:'0.005',mst:'',z:'0.0000',rd:'3.0020'}]}}
}
