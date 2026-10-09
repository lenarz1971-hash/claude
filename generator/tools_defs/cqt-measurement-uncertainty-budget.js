{
slug:'cqt-measurement-uncertainty-budget',
h:{
 dist:['Type A: std dev of readings','Normal, standard uncertainty (k=1)','Normal, expanded k=2 (certificate)','Rectangular (half-width)','Triangular (half-width)','U-shaped (half-width)'],
 div:function(d,r,api){ var i=this.dist.indexOf(d); if(i===0){ var n=api.num(r.n); if(!(n>=1)) n=1; return Math.sqrt(n); } return [NaN,1,2,Math.sqrt(3),Math.sqrt(6),Math.sqrt(2)][i]; },
 u:function(r,api){ var v=api.num(r.val), d=this.div(r.dist,r,api); if(!isFinite(v)||!(d>0)) return NaN; return Math.abs(v)/d; },
 cu:function(r,api){ var c=api.num(r.c); if(r.c===''||r.c==null) c=1; return Math.abs(c)*this.u(r,api); },
 rows:function(api){ var self=this; return api.state().g.c.filter(function(r){ return r.src&&isFinite(self.cu(r,api)); }); },
 uc:function(api){ var self=this, s=0; this.rows(api).forEach(function(r){ var x=self.cu(r,api); s+=x*x; }); return Math.sqrt(s); },
 g:function(x){ if(!isFinite(x)) return '—'; if(x===0) return '0'; return Number(x.toPrecision(3)).toString(); }
},
sections:[
 {type:'fields',title:'Measurement',cols:3,fields:[
  {id:'what',label:'Measurand (what is measured)',wide:true},
  {id:'unit',label:'Units',ph:'mm'},
  {id:'nom',label:'Nominal',type:'number'},
  {id:'tol',label:'Tolerance ± (half-width)',type:'number',min:0},
  {id:'k',label:'Coverage factor k',type:'number',min:1,ph:'2',hint:'k = 2 gives about 95 percent coverage for a normal distribution.'}]},
 {type:'grid',id:'c',title:'Uncertainty budget',rows:4,hint:'One row per source. Value is a standard deviation for Type A, the stated uncertainty for a certificate, or the half-width (±a) for a limit with an assumed distribution. Sensitivity converts the source into the measurand\'s units (1 if it is already in them).',cols:[
  {id:'src',label:'Source',w:170,type:'textarea',rows:1},
  {id:'dist',label:'Type and distribution',type:'select',w:150,opts:['Type A: std dev of readings','Normal, standard uncertainty (k=1)','Normal, expanded k=2 (certificate)','Rectangular (half-width)','Triangular (half-width)','U-shaped (half-width)']},
  {id:'val',label:'Value',type:'number'},
  {id:'n',label:'n averaged',type:'number',min:1,tip:'Type A only: number of readings averaged in the reported result (u = s/√n).'},
  {id:'c',label:'Sensitivity c',type:'number'},
  {id:'dv',label:'Divisor',calc:function(r,api){var d=window.TOOL.h.div(r.dist,r,api);return r.src&&isFinite(d)?d.toFixed(3):'';}},
  {id:'ui',label:'c × u',calc:function(r,api){var h=window.TOOL.h,x=h.cu(r,api);return r.src&&isFinite(x)?h.g(x):'';}},
  {id:'pc',label:'% of variance',calc:function(r,api){var h=window.TOOL.h,x=h.cu(r,api),u=h.uc(api);return r.src&&isFinite(x)&&u>0?(x*x/u/u*100).toFixed(1)+'%':'';}}]},
 {type:'custom',id:'res',title:'Combined and expanded uncertainty',html:'<div class="tgw"><table class="mv mu-t"></table></div><div class="svgw mu-svg"></div><div class="out mu-out"></div>'}
],
update:function(root,api){
 var S=api.state(), h=window.TOOL.h, n=api.num, rows=h.rows(api), uc=h.uc(api), kIn=n(S.f.k), k=kIn, kBad=!isNaN(kIn)&&!(kIn>=1); if(!(k>=1)) k=2;
 var U=k*uc, T=n(S.f.tol), nom=n(S.f.nom), un=api.esc(S.f.unit||''), f=[], tbl=root.querySelector('table.mu-t'), svg=root.querySelector('.mu-svg');
 var bad=S.g.c.filter(function(r){ return r.src&&!isFinite(h.cu(r,api)); });
 if(!rows.length){ tbl.innerHTML=''; svg.innerHTML=''; root.querySelector('.mu-out').innerHTML=api.flags(bad.length?[['warn','Pick a type and distribution and enter a value for each source.']]:[],'Add the sources of uncertainty to build the budget.'); return; }
 if(!(uc>0)){ tbl.innerHTML=''; svg.innerHTML=''; root.querySelector('.mu-out').innerHTML=api.flags([['warn','Every source with a value is zero, so the combined uncertainty is zero. No real measurement has zero uncertainty: enter the value for each source (standard deviation, certificate uncertainty or half-width).']].concat(kBad?[['warn','A coverage factor below 1 is not valid; k = 2 is used.']]:[])); return; }
 var tur=T>0&&U>0?T/U:NaN;
 var tr=[['Combined standard uncertainty u<sub>c</sub>','√(Σ (c·u)²)',h.g(uc)+' '+un],['Expanded uncertainty U','k × u<sub>c</sub> = '+api.fmt(k)+' × '+h.g(uc),h.g(U)+' '+un]];
 if(T>0) tr.push(['Test uncertainty ratio (TUR)','tolerance ± / U = '+h.g(T)+' / '+h.g(U),isFinite(tur)?tur.toFixed(2)+' : 1':'—']);
 if(T>0&&isFinite(nom)&&U<T){ var dp=Math.max(3,(String(S.f.nom).split('.')[1]||'').length+1); tr.push(['Guard-banded acceptance limits','(nominal − tol + U) to (nominal + tol − U)',(nom-T+U).toFixed(dp)+' to '+(nom+T-U).toFixed(dp)+' '+un]); }
 tbl.innerHTML='<thead><tr><th>Result</th><th>How</th><th>Value</th></tr></thead><tbody>'+tr.map(function(x){return '<tr><td class="mo">'+x[0]+'</td><td>'+x[1]+'</td><td class="mt">'+x[2]+'</td></tr>';}).join('')+'</tbody>';
 /* contribution bar chart */
 var srt=rows.map(function(r){ return {s:r.src,v:h.cu(r,api)}; }).sort(function(a,b){return b.v-a.v;}), W=640, rh=26, top=10, lw=230, H=top+srt.length*rh+30, mx=srt[0].v||1;
 var g='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Share of variance by source">';
 srt.forEach(function(x,i){ var y=top+i*rh, p=x.v*x.v/uc/uc, w=(W-lw-70)*p; var lab=x.s.length>34?x.s.slice(0,33)+'…':x.s;
  g+='<text x="'+(lw-8)+'" y="'+(y+16)+'" text-anchor="end" font-family="Archivo, sans-serif" font-size="12" fill="#16273A">'+api.esc(lab)+'</text>';
  g+='<rect x="'+lw+'" y="'+(y+4)+'" width="'+Math.max(w,1).toFixed(1)+'" height="16" fill="'+(i===0?'#0F3E68':'#7C8B99')+'"/>';
  g+='<text x="'+(lw+Math.max(w,1)+6).toFixed(1)+'" y="'+(y+16)+'" font-family="Archivo, sans-serif" font-size="12" fill="#4A5D71">'+(p*100).toFixed(1)+'%</text>'; });
 g+='<text x="'+lw+'" y="'+(H-8)+'" font-family="Archivo, sans-serif" font-size="11" fill="#7C8B99">Share of combined variance (c·u)² ÷ uc²</text></svg>';
 svg.innerHTML=g;
 f.push(['','Combined standard uncertainty u<sub>c</sub> = <b>'+h.g(uc)+' '+un+'</b>; expanded uncertainty U = <b>'+h.g(U)+' '+un+'</b> at k = '+api.fmt(k)+'. Report the result as value ± '+h.g(U)+' '+un+' (k = '+api.fmt(k)+').']);
 var top1=srt[0], sh=top1.v*top1.v/uc/uc*100;
 f.push([sh>=50?'warn':'','Largest contributor: <b>'+api.esc(top1.s)+'</b> at '+sh.toFixed(0)+'% of the variance. '+(sh>=50?'Reducing it is the only change that will move the total much; trimming the small sources barely helps, because they add as squares.':'No single source dominates.')]);
 if(T>0){
  if(tur>=4) f.push(['ok','TUR is '+tur.toFixed(2)+':1, meeting the common 4:1 rule of thumb. ANSI/NCSL Z540.3 allows a TUR of at least 4:1 as a fallback when the probability of false accept is not calculated directly. The measurement is adequate for this tolerance.']);
  else if(tur>=1) f.push(['warn','TUR is only '+tur.toFixed(2)+':1, below the common 4:1 target. Either reduce the uncertainty or apply a guard band so readings near the limits are not accepted on a coin toss.']);
  else f.push(['warn','U is larger than the tolerance (TUR '+(isFinite(tur)?tur.toFixed(2):'—')+':1). This measurement cannot decide conformance for this characteristic.']);
  if(isFinite(nom)&&U<T) f.push(['','Guard band of U: accept only readings inside the narrower limits shown above. It lowers the risk of accepting a bad part at the cost of rejecting some good ones near the limits.']);
   if(Math.abs(k-2)>0.1) f.push(['warn','TUR is normally stated with U at about 95 percent coverage (k ≈ 2). At k = '+api.fmt(k)+' this ratio is not comparable with the 4:1 rule; recalculate with k = 2 before judging it.']);
 } else f.push(['warn','Enter the tolerance to compare U against it (test uncertainty ratio).']);
 if(kBad) f.push(['warn','A coverage factor of '+api.esc(S.f.k)+' is not valid: k must be at least 1 (k = 1 is the standard uncertainty itself). k = 2 is used instead.']);
 if(bad.length) f.push(['warn','Ignored until complete: '+bad.map(function(r){return api.esc(r.src);}).join(', ')+'. Each needs a distribution and a value.']);
 var rep=rows.filter(function(r){ return r.dist===h.dist[0]; }).length;
 if(!rep) f.push(['warn','No Type A (repeatability) source. Almost every measurement needs one, evaluated from repeated readings.']);
 f.push(['','Standard uncertainties are added in quadrature (root-sum-square) only because the sources are assumed independent. Correlated sources need a covariance term (GUM, JCGM 100:2008).']);
 root.querySelector('.mu-out').innerHTML=api.flags(f);
},
example:{f:{what:'Shaft journal diameter, Ø12.000 ± 0.010 mm, measured with a 0–25 mm digital micrometer',unit:'mm',nom:'12.000',tol:'0.010',k:'2'},
 g:{c:[
  {src:'Repeatability (25 repeat readings, one reported)',dist:'Type A: std dev of readings',val:'0.0012',n:'1',c:'1'},
  {src:'Micrometer calibration certificate',dist:'Normal, expanded k=2 (certificate)',val:'0.0010',n:'',c:'1'},
  {src:'Display resolution 0.001 mm (±0.0005)',dist:'Rectangular (half-width)',val:'0.0005',n:'',c:'1'},
  {src:'Part temperature 20 ± 2 °C (steel, 11.5 µm/m/°C)',dist:'Rectangular (half-width)',val:'2',n:'',c:'0.000138'},
  {src:'Operator reproducibility (from GR&R)',dist:'Normal, standard uncertainty (k=1)',val:'0.0008',n:'',c:'1'}]}}
}
