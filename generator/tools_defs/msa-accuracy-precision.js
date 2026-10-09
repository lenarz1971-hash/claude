{
slug:'msa-accuracy-precision',
sections:[
 {type:'fields',title:'The check',cols:4,hint:'Measure one reference part (a master or a part with a known, certified value) several times with the gauge, under normal conditions. Ten readings or more is usual. Enter them in the grid, or paste them from a spreadsheet.',fields:[
  {id:'g',label:'Gauge',wide:true,ph:'e.g. Bore gauge BG-14'},{id:'ref',label:'Reference value',type:'number'},{id:'lsl',label:'Lower spec limit',type:'number'},{id:'usl',label:'Upper spec limit',type:'number'},{id:'unit',label:'Unit',ph:'e.g. mm'},
  {id:'r',label:'Readings, five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:3,minRows:2}]},
 {type:'custom',id:'res',title:'Accuracy and precision',html:'<div class="ma-wrap"><div class="ma-tgt"></div><div class="ma-st"></div></div><div class="out ma-out"></div>'},
 {type:'custom',id:'terms',title:'The five terms, side by side',html:'<div class="ma-terms"><div><b>Accuracy</b><span>Bias</span><p>How far the <i>average</i> reading is from the true value. Checked here.</p></div><div><b>Precision</b><span>Repeatability</span><p>How much repeat readings of the same part scatter. Checked here.</p></div><div><b>Reproducibility</b><p>How much the average shifts between appraisers. Needs a <a href="/calculators/gage-r-and-r.html">gauge R&amp;R</a>.</p></div><div><b>Linearity</b><p>Whether the bias changes across the range of the gauge. Needs several references: <a href="/calculators/linearity-study.html">linearity study</a>.</p></div><div><b>Stability</b><p>Whether the bias drifts over time. Needs the same check repeated over weeks, plotted on a control chart.</p></div></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, ref=n(S.f.ref), lsl=n(S.f.lsl), usl=n(S.f.usl), u=S.f.unit?' '+api.esc(S.f.unit):'';
 var x=(S.f.r||'').split(/[\s,;]+/).filter(Boolean).map(Number).filter(isFinite);
 var T=root.querySelector('.ma-tgt'), ST=root.querySelector('.ma-st'), O=root.querySelector('.ma-out');
 if(x.length<2||isNaN(ref)){ T.innerHTML=''; ST.innerHTML=''; O.innerHTML=api.flags([],'Enter the reference value and at least two readings.'); return; }
 var k=x.length, m=x.reduce(function(a,b){return a+b;},0)/k, s=Math.sqrt(x.reduce(function(a,b){return a+(b-m)*(b-m);},0)/(k-1)), bias=m-ref, tol=usl-lsl;
 var tq=[0,12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045,2.042];
 var df=k-1, tc=df<=30?tq[df]:(df<=40?2.021:(df<=60?2.000:(df<=120?1.980:1.960))), t=s>0?bias/(s/Math.sqrt(k)):Infinity, sig=Math.abs(t)>tc;
 var dec=Math.max.apply(null,(S.f.r||'').split(/[\s,;]+/).filter(Boolean).map(function(z){var p=z.split('.')[1];return p?p.length:0;}))+2;
 var F=function(v){return isFinite(v)?v.toFixed(dec):'—';};
 var cells=[[F(m)+u,'Average reading'],[(bias>=0?'+':'')+F(bias)+u,'Bias (average − reference)'],[F(s)+u,'Repeatability (s)'],[k,'Readings']];
 if(tol>0) cells.push([(Math.abs(bias)/tol*100).toFixed(1)+'%','Bias as % of tolerance'],[(6*s/tol*100).toFixed(1)+'%','6s as % of tolerance']);
 cells.push([t===Infinity?'—':Math.abs(t).toFixed(2),'|t| for the bias'],[tc.toFixed(3),'t critical, 95%']);
 ST.innerHTML='<div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 var R=150, cx=170, cy=170, sc=Math.max(Math.abs(bias)+3*s, 1e-12), g='<svg viewBox="0 0 340 340" role="img" aria-label="Readings on a target" style="min-width:0;max-width:340px">';
 [1,0.66,0.33].forEach(function(f,i){ g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R*f+'" fill="'+(i===2?'#FBF5E4':'#fff')+'" stroke="#C6CDD3"/>'; });
 g+='<line x1="'+cx+'" x2="'+cx+'" y1="'+(cy-R)+'" y2="'+(cy+R)+'" stroke="#EDEFEA"/><line y1="'+cy+'" y2="'+cy+'" x1="'+(cx-R)+'" x2="'+(cx+R)+'" stroke="#EDEFEA"/><circle cx="'+cx+'" cy="'+cy+'" r="3" fill="#0F3E68"/>';
 x.forEach(function(v,i){ var dx=(v-ref)/sc*R*0.95, ang=(i*137.5)*Math.PI/180, jit=((i%5)-2)*R*0.05; g+='<circle cx="'+(cx+dx+Math.cos(ang)*Math.abs(jit)*0.4)+'" cy="'+(cy+jit)+'" r="5" fill="#0F3E68" fill-opacity=".75"/>'; });
 var mx=cx+bias/sc*R*0.95; g+='<line x1="'+mx+'" x2="'+mx+'" y1="'+(cy-R*0.8)+'" y2="'+(cy+R*0.8)+'" stroke="#D8B147" stroke-width="2" stroke-dasharray="5 3"/><text x="'+(mx+4)+'" y="'+(cy-R*0.8+10)+'" style="font:600 10px \'IBM Plex Mono\',monospace;fill:#9C7C1F">AVERAGE</text>';
 g+='<text x="'+cx+'" y="334" text-anchor="middle" style="font:600 10px \'IBM Plex Mono\',monospace;fill:#7C8B99">LEFT–RIGHT = READING − REFERENCE</text></svg>';
 T.innerHTML=g;
 var f=[];
 f.push([sig?'warn':'ok', sig?'The bias of '+(bias>=0?'+':'')+F(bias)+u+' is statistically significant (|t| = '+Math.abs(t).toFixed(2)+' &gt; '+tc.toFixed(3)+'). The gauge reads '+(bias>0?'high':'low')+' on average; it is <b>not accurate</b> at this value.':'The bias is not statistically significant (|t| = '+(t===Infinity?'—':Math.abs(t).toFixed(2))+' ≤ '+tc.toFixed(3)+'). On this evidence the gauge is <b>accurate</b> at this value.']);
 if(tol>0){ var p=6*s/tol*100; f.push([p<=10?'ok':p<=30?'':'warn','Repeat readings spread over '+p.toFixed(1)+'% of the tolerance (6s). '+(p<=10?'That is <b>precise</b> enough by the common 10% rule of thumb.':p<=30?'That is <b>marginal</b>: between 10% and 30% is often accepted with conditions.':'That is <b>not precise</b> enough: above 30% the gauge cannot reliably tell good parts from bad near the limits.')+' The 10/30% thresholds are borrowed from gauge R&amp;R practice; this check covers repeatability only.']);
  if(sig&&Math.abs(bias)/tol*100<5) f.push(['','The bias is real but small against the tolerance ('+(Math.abs(bias)/tol*100).toFixed(1)+'%). Whether to correct it is an engineering call.']); }
 else f.push(['','Enter the specification limits to judge the results against the tolerance.']);
 if(k<10) f.push(['','Only '+k+' readings. With fewer than about ten, small biases will not show as significant.']);
 O.innerHTML=api.flags(f);
},
example:{f:{g:'Bore gauge BG-14 on master ring MR-25',ref:'25.000',lsl:'24.950',usl:'25.050',unit:'mm',r:'25.004 25.006 25.003 25.007 25.005 25.002 25.006 25.004 25.005 25.003 25.006 25.004'}}
}
