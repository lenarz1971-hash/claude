{
slug:'shelf-life-accelerated-aging',
sections:[
 {type:'fields',title:'The product and the shelf-life claim',cols:3,hint:'The model assumes the reactions that age the package or device speed up with temperature at a steady rate. ASTM F1980 uses the Q<sub>10</sub> form: every 10 &deg;C rise multiplies the rate by Q<sub>10</sub>. A Q<sub>10</sub> of 2 is the usual conservative choice.',fields:[
  {id:'prod',label:'Product and package',wide:true,ph:'e.g. Trocar kit in a PETG tray with coated nonwoven lid'},
  {id:'claim',label:'Shelf life to claim',type:'number',min:0},
  {id:'unit',label:'Unit',type:'select',opts:['Years','Months','Weeks','Days']},
  {id:'trt',label:'Ambient (storage) temperature, °C',type:'number',hint:'T_RT, usually 20 to 25 °C.'},
  {id:'model',label:'Model',type:'select',opts:['Q10 (ASTM F1980)','Arrhenius (activation energy)']},
  {id:'q10',label:'Q10 (Q10 model)',type:'number',min:1},
  {id:'ea',label:'Activation energy, eV (Arrhenius)',type:'number',min:0},
  {id:'tmax',label:'Lowest material transition, °C',type:'number',hint:'E.g. glass transition or softening point of the most heat-sensitive material. Optional.'},
  {id:'rh',label:'Chamber humidity',ph:'e.g. Ambient, not controlled'}]},
 {type:'fields',title:'Find the aging time',cols:3,fields:[
  {id:'taa',label:'Chamber temperature T_AA, °C',type:'number'}]},
 {type:'custom',id:'r1',title:'Aging time at that temperature',html:'<div class="stat sl-s1"></div><div class="out sl-f1"></div>'},
 {type:'fields',title:'Or find the chamber temperature',cols:3,hint:'If the chamber time available is fixed, this solves for the temperature that would cover the claim in that time.',fields:[
  {id:'avail',label:'Chamber time available, days',type:'number',min:0}]},
 {type:'custom',id:'r2',title:'Temperature needed',html:'<div class="stat sl-s2"></div>'},
 {type:'custom',id:'ch',title:'Aging time against chamber temperature',hint:'Days in the chamber needed to simulate the claim, on a log scale. The marked point is the chamber temperature in section 2.',html:'<div class="svgw sl-svg"></div><div class="tgw"><table class="tg sl-tab"></table></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out sl-out"></div>'}
],
K:8.617333262e-5,
aaf:function(model,q10,ea,trt,taa){ if(model==='A') return Math.exp(ea/this.K*(1/(trt+273.15)-1/(taa+273.15))); return Math.pow(q10,(taa-trt)/10); },
temp:function(model,q10,ea,trt,aaf){ if(model==='A') return 1/(1/(trt+273.15)-this.K*Math.log(aaf)/ea)-273.15; return trt+10*Math.log(aaf)/Math.log(q10); },
update:function(root,api){
 var S=api.state(), F=S.f, n=api.num, T=window.TOOL, f=[];
 var model=/Arrhenius/.test(F.model||'')?'A':'Q', q10=n(F.q10), ea=n(F.ea), trt=n(F.trt), taa=n(F.taa), cl=n(F.claim), tmax=n(F.tmax), avail=n(F.avail);
 var per={Years:365,Months:365/12,Weeks:7,Days:1}[F.unit||'Years'], rt=cl*per;
 var s1=root.querySelector('.sl-s1'), o1=root.querySelector('.sl-f1'), s2=root.querySelector('.sl-s2'), svg=root.querySelector('.sl-svg'), tab=root.querySelector('.sl-tab'), out=root.querySelector('.sl-out');
 var okM=model==='Q'?(q10>1):(ea>0), okB=okM&&isFinite(trt)&&rt>0;
 if(model==='Q'&&!(q10>1)) f.push(['warn','Enter a Q<sub>10</sub> greater than 1. ASTM F1980 uses 2 unless data support another value.']);
 if(model==='A'&&!(ea>0)) f.push(['warn','Enter the activation energy in electron volts (eV) for the Arrhenius model.']);
 if(!isFinite(trt)) f.push(['warn','Enter the ambient storage temperature.']);
 if(!(rt>0)) f.push(['warn','Enter the shelf life to claim.']);
 function F1(v,d){ return api.fmt(v,d==null?1:d); }
 function days(v){ return F1(v,1)+' d'; }
 var aaf1=NaN, aat=NaN;
 if(okB&&isFinite(taa)){
  if(taa<=trt){ f.push(['warn','The chamber temperature must be above the ambient temperature, or nothing is accelerated.']); }
  else { aaf1=T.aaf(model,q10,ea,trt,taa); aat=rt/aaf1;
   var eq=model==='A'?Math.pow(aaf1,10/(taa-trt)):NaN;
   s1.innerHTML='<div><b>'+F1(aaf1,3)+'</b><span>Accelerated aging factor (AAF)</span></div><div><b>'+days(aat)+'</b><span>Accelerated aging time</span></div><div><b>'+F1(aat/7,1)+'</b><span>Weeks in the chamber</span></div><div><b>'+F1(rt,1)+' d</b><span>Real time simulated</span></div>'+(model==='A'?'<div><b>'+F1(eq,3)+'</b><span>Equivalent Q10 over this range</span></div>':'');
   o1.innerHTML='<p>'+(model==='Q'?'AAF = Q<sub>10</sub><sup>(T<sub>AA</sub> &minus; T<sub>RT</sub>)/10</sup> = '+F1(q10,2)+'<sup>('+F1(taa,1)+' &minus; '+F1(trt,1)+')/10</sup> = '+F1(aaf1,3)
     :'AAF = exp[(E<sub>a</sub>/k)(1/T<sub>RT</sub> &minus; 1/T<sub>AA</sub>)] with temperatures in kelvin and k = 8.617&times;10<sup>&minus;5</sup> eV/K = '+F1(aaf1,3))+'. Aging time = '+F1(rt,1)+' days / '+F1(aaf1,3)+' = <b>'+days(aat)+'</b>.</p>'; }
 }
 if(!isFinite(aat)){ s1.innerHTML=''; o1.innerHTML=''; }
 var t2=NaN;
 if(okB&&avail>0){ var need=rt/avail;
  if(need<=1){ s2.innerHTML='<div><b>'+F1(trt,1)+' &deg;C</b><span>Real time is already enough</span></div>'; f.push(['','The chamber time available is at least the claim itself, so no acceleration is needed.']); }
  else { t2=T.temp(model,q10,ea,trt,need); s2.innerHTML='<div><b>'+F1(t2,1)+' &deg;C</b><span>Chamber temperature needed</span></div><div><b>'+F1(need,3)+'</b><span>AAF needed</span></div><div><b>'+F1(avail,0)+' d</b><span>Chamber time available</span></div>';
   if(t2>60) f.push(['warn','Covering the claim in '+F1(avail,0)+' days needs '+F1(t2,1)+' &deg;C, above 60 &deg;C. Allow more chamber time, or claim a shorter shelf life now and extend it later.']); }
 } else s2.innerHTML='';
 /* chart */
 if(okB){
  var lo=Math.ceil(trt+5), hi=Math.max(70,isFinite(taa)?Math.ceil(taa+5):0, isFinite(t2)?Math.ceil(t2+5):0); if(isFinite(tmax)) hi=Math.max(hi,Math.min(tmax+5,100));
  var pts=[], ymin=Infinity, ymax=0; for(var t=lo;t<=hi;t+=0.5){ var d=rt/T.aaf(model,q10,ea,trt,t); pts.push([t,d]); ymin=Math.min(ymin,d); ymax=Math.max(ymax,d); }
  var L0=Math.floor(Math.log10(ymin)), L1=Math.ceil(Math.log10(ymax)); if(L1===L0) L1++;
  var W=640, H=300, ml=56, mr=16, mt=14, mb=40, X=function(t){ return ml+(t-lo)/(hi-lo)*(W-ml-mr); }, Y=function(d){ return mt+(L1-Math.log10(d))/(L1-L0)*(H-mt-mb); };
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Aging time against chamber temperature"><style>text{font:10.5px \'IBM Plex Mono\',monospace;fill:#4A5D71}.lb{font:600 10.5px Archivo,sans-serif;fill:#16273A}</style>';
  for(var e=L0;e<=L1;e++){ [1,2,5].forEach(function(m){ var v=m*Math.pow(10,e); if(v<Math.pow(10,L0)||v>Math.pow(10,L1)) return; var y=Y(v); g+='<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+y+'" y2="'+y+'" stroke="'+(m===1?'#D5DCE3':'#EEF1F4')+'"/><text x="'+(ml-6)+'" y="'+(y+4)+'" text-anchor="end">'+(v>=1?api.fmt(v,0):v)+'</text>'; }); }
  for(var tt=Math.ceil(lo/5)*5;tt<=hi;tt+=5){ g+='<line x1="'+X(tt)+'" x2="'+X(tt)+'" y1="'+mt+'" y2="'+(H-mb)+'" stroke="#EEF1F4"/><text x="'+X(tt)+'" y="'+(H-mb+15)+'" text-anchor="middle">'+tt+'</text>'; }
  g+='<text x="'+((ml+W-mr)/2)+'" y="'+(H-6)+'" text-anchor="middle">CHAMBER TEMPERATURE, &deg;C</text><text x="12" y="'+((mt+H-mb)/2)+'" transform="rotate(-90 12 '+((mt+H-mb)/2)+')" text-anchor="middle">DAYS IN CHAMBER</text>';
  if(hi>=60){ g+='<line x1="'+X(60)+'" x2="'+X(60)+'" y1="'+mt+'" y2="'+(H-mb)+'" stroke="#C0392B" stroke-dasharray="5 3" stroke-width="1.4"/><text class="lb" x="'+(X(60)+4)+'" y="'+(mt+12)+'" style="fill:#C0392B">60 &deg;C</text>'; }
  if(isFinite(tmax)&&tmax<=hi&&tmax>=lo){ g+='<line x1="'+X(tmax)+'" x2="'+X(tmax)+'" y1="'+mt+'" y2="'+(H-mb)+'" stroke="#9C7C1F" stroke-dasharray="2 3" stroke-width="1.4"/><text class="lb" x="'+(X(tmax)-4)+'" y="'+(mt+26)+'" text-anchor="end" style="fill:#9C7C1F">Material limit</text>'; }
  g+='<path d="'+pts.map(function(p,i){ return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1); }).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2.2"/>';
  if(isFinite(aat)&&taa>=lo&&taa<=hi) g+='<circle cx="'+X(taa)+'" cy="'+Y(aat)+'" r="5.5" fill="#D8B147" stroke="#0F3E68" stroke-width="1.6"/><text class="lb" x="'+(X(taa)+9)+'" y="'+(Y(aat)-8)+'">'+F1(taa,0)+' &deg;C: '+days(aat)+'</text>';
  if(isFinite(t2)&&t2>=lo&&t2<=hi) g+='<circle cx="'+X(t2)+'" cy="'+Y(avail)+'" r="4.5" fill="#fff" stroke="#9C7C1F" stroke-width="2"/><text class="lb" x="'+(X(t2)-10)+'" y="'+(Y(avail)+22)+'" text-anchor="end" style="fill:#9C7C1F">'+F1(avail,0)+' d: '+F1(t2,1)+' &deg;C</text>';
  svg.innerHTML=g+'</svg>';
  var rows=[40,45,50,55,60].filter(function(t){ return t>trt; });
  tab.innerHTML='<thead><tr><th>Chamber &deg;C</th><th>AAF</th><th>Days</th><th>Weeks</th></tr></thead><tbody>'+rows.map(function(t){ var a=T.aaf(model,q10,ea,trt,t); return '<tr'+(t===taa?' class="hi-row"':'')+'><td class="calc">'+t+'</td><td class="calc">'+F1(a,3)+'</td><td class="calc">'+F1(rt/a,1)+'</td><td class="calc">'+F1(rt/a/7,1)+'</td></tr>'; }).join('')+'</tbody>';
 } else { svg.innerHTML=''; tab.innerHTML=''; }
 /* checks */
 if(okB&&isFinite(aat)){
  f.push(['','To simulate '+F1(cl,cl%1?2:0)+' '+(F.unit||'Years').toLowerCase()+' ('+F1(rt,1)+' days) at '+F1(trt,1)+' &deg;C, age for <b>'+days(aat)+'</b> at '+F1(taa,1)+' &deg;C.']);
  if(taa>60) f.push(['warn','The chamber temperature is above 60 &deg;C. ASTM F1980 cautions against such temperatures: materials can change in ways they never would on the shelf (softening, distortion, seal creep), so the test can fail good product or, worse, mislead.']);
  if(isFinite(tmax)){ if(taa>=tmax) f.push(['warn','The chamber temperature reaches the material limit you entered ('+F1(tmax,0)+' &deg;C). The aging would no longer represent shelf storage. Choose a lower temperature.']); else if(taa>tmax-10) f.push(['warn','The chamber temperature is within 10 &deg;C of the material limit ('+F1(tmax,0)+' &deg;C). Keep the aging temperature well below any transition temperature.']); }
  if(aat<14) f.push(['warn','Under two weeks in the chamber. A very high acceleration factor rests heavily on the model; check that it holds for these materials.']);
 }
 if(model==='Q'&&q10>2.0001) f.push(['warn','Q<sub>10</sub> of '+F1(q10,2)+' is above the conventional 2.0. A higher Q<sub>10</sub> shortens the test and needs data showing the materials age that fast.']);
 if(model==='Q'&&q10>1&&q10<2) f.push(['','Q<sub>10</sub> below 2 lengthens the test. It is more conservative.']);
 if(model==='A'&&ea>0&&isFinite(trt)){ var eq2=Math.log(2)*T.K/(1/(trt+273.15)-1/(trt+283.15)); f.push(['','For comparison, Q<sub>10</sub> = 2 from '+F1(trt,0)+' to '+F1(trt+10,0)+' &deg;C corresponds to an activation energy of about '+F1(eq2,2)+' eV. The Arrhenius factor needs a measured or well-supported E<sub>a</sub>.']); }
 if(isFinite(trt)&&(trt<20||trt>25)) f.push(['warn','Ambient temperature of '+F1(trt,1)+' &deg;C is outside the usual 20 to 25 &deg;C. A lower ambient makes the test shorter and less conservative; use the warmest temperature the product is expected to see in storage.']);
 if(okB) f.push(['','Accelerated aging supports a shelf-life claim only until real-time data are available. Start real-time aged samples at the same time, at the ambient temperature, and test both at the same intervals.']);
 if(okB&&!(F.rh||'').trim()) f.push(['','Record the chamber humidity. Some materials are sensitive to moisture; F1980 leaves humidity to the user, but it must be justified and must not cause condensation.']);
 out.innerHTML=api.flags(f,'Enter the claim, the ambient temperature and the model.');
},
example:{f:{prod:'Single-use trocar kit, Pellwyn Surgical: PETG thermoformed tray with a coated nonwoven lid, ethylene oxide sterilized',claim:'3',unit:'Years',trt:'25',model:'Q10 (ASTM F1980)',q10:'2',ea:'',tmax:'80',rh:'Ambient, below 30% RH, no condensation',taa:'55',avail:'120'}}
}
