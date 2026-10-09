{
slug:'correlation-regression',
sections:[
 {type:'fields',title:'Your paired data',cols:3,hint:'One pair per row: <b>x</b> in the first column, <b>y</b> in the second. Two columns copied from a spreadsheet paste straight in.',fields:[
  {id:'xl',label:'x is',ph:'e.g. Installation force, N'},{id:'yl',label:'y is',ph:'e.g. Leak rate, mbar·l/s'},{id:'px',label:'Predict y at x =',type:'number'},
  {id:'d',label:'Data, one pair per row',type:'datagrid',cols:[{label:'X'},{label:'Y'}],rows:8,minRows:4}]},
 {type:'custom',id:'p',title:'Scatter diagram and fitted line',html:'<div class="svgw cr-svg"></div><div class="cr-st"></div><div class="out cr-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, P=[], bad=0;
 (S.f.d||'').split('\n').forEach(function(l){ l=l.trim(); if(!l) return; var t=l.split(/[\s,;\t]+/).map(Number); if(t.length>=2&&isFinite(t[0])&&isFinite(t[1])) P.push([t[0],t[1]]); else bad++; });
 var SV=root.querySelector('.cr-svg'), ST=root.querySelector('.cr-st'), O=root.querySelector('.cr-out');
 if(P.length<3){ SV.innerHTML=''; ST.innerHTML=''; O.innerHTML=api.flags(bad?[['warn',bad+' line'+(bad>1?'s':'')+' could not be read as two numbers.']]:[],'Enter at least three x y pairs.'); return; }
 var k=P.length, mx=0,my=0; P.forEach(function(p){mx+=p[0];my+=p[1];}); mx/=k; my/=k;
 var sxx=0,syy=0,sxy=0; P.forEach(function(p){sxx+=(p[0]-mx)*(p[0]-mx);syy+=(p[1]-my)*(p[1]-my);sxy+=(p[0]-mx)*(p[1]-my);});
 if(sxx===0||syy===0){ O.innerHTML=api.flags([['warn','All the '+(sxx===0?'x':'y')+' values are the same; there is nothing to correlate.']]); SV.innerHTML=''; ST.innerHTML=''; return; }
 var r=sxy/Math.sqrt(sxx*syy), b1=sxy/sxx, b0=my-b1*mx, sse=syy-b1*sxy, se=k>2?Math.sqrt(Math.max(0,sse)/(k-2)):NaN;
 var t=Math.abs(r)<1?r*Math.sqrt((k-2)/(1-r*r)):Infinity;
 var tq=[0,12.706,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.101,2.093,2.086,2.080,2.074,2.069,2.064,2.060,2.056,2.052,2.048,2.045,2.042], df=k-2, tc=df<=30?tq[df]:df<=40?2.021:df<=60?2.000:df<=120?1.980:1.960, sig=Math.abs(t)>tc;
 var xs=P.map(function(p){return p[0];}), ys=P.map(function(p){return p[1];}), x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
 var padx=(x1-x0)*0.06||1, pady=(y1-y0)*0.08||1; x0-=padx; x1+=padx; y0-=pady; y1+=pady;
 var W=800,H=380,L=60,B=46,T=14, X=function(v){return L+(v-x0)/(x1-x0)*(W-L-14);}, Y=function(v){return H-B-(v-y0)/(y1-y0)*(H-B-T);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Scatter diagram"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(var i=0;i<=5;i++){ var xv=x0+(x1-x0)*i/5, yv=y0+(y1-y0)*i/5; g+='<text x="'+X(xv)+'" y="'+(H-B+16)+'" text-anchor="'+(i===0?'start':i===5?'end':'middle')+'">'+api.fmt(xv,2)+'</text>'+(i?'<text x="'+(L-6)+'" y="'+(Y(yv)+4)+'" text-anchor="end">'+api.fmt(yv,2)+'</text>':''); }
 g+='<line x1="'+X(x0)+'" y1="'+Y(b0+b1*x0)+'" x2="'+X(x1)+'" y2="'+Y(b0+b1*x1)+'" stroke="#D8B147" stroke-width="2.5"/>';
 P.forEach(function(p){ g+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="4.5" fill="#0F3E68" fill-opacity=".8"/>'; });
 g+='<text x="'+((W+L)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+api.esc((S.f.xl||'x').toUpperCase())+'</text><text transform="translate(14 '+((H-B)/2)+') rotate(-90)" text-anchor="middle">'+api.esc((S.f.yl||'y').toUpperCase())+'</text>';
 SV.innerHTML=g+'</svg>';
 var cells=[[k,'Pairs (n)'],[r.toFixed(4),'Correlation r'],[(r*r).toFixed(4),'r² (share of variation in y explained)'],[api.fmt(b1,5),'Slope b₁'],[api.fmt(b0,5),'Intercept b₀'],[api.fmt(se,5),'Standard error of the fit']];
 var px=n(S.f.px); if(!isNaN(px)) cells.push([api.fmt(b0+b1*px,4),'Predicted y at x = '+px]);
 ST.innerHTML='<p class="th" style="margin:8px 0 0">Fitted line: <b>y = '+api.fmt(b0,5)+' '+(b1<0?'−':'+')+' '+api.fmt(Math.abs(b1),5)+' x</b></p><div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 var ar=Math.abs(r), str=ar>=0.8?'strong':ar>=0.5?'moderate':ar>=0.3?'weak':'very weak or no';
 var f=[[sig?'ok':'warn','r = '+r.toFixed(3)+': a '+str+' '+(r>0?'positive':'negative')+' linear relationship. '+(sig?'It is statistically significant at 95% (|t| = '+Math.abs(t).toFixed(2)+' &gt; '+tc.toFixed(3)+').':'It is <b>not</b> statistically significant at 95% (|t| = '+(isFinite(t)?Math.abs(t).toFixed(2):'—')+' ≤ '+tc.toFixed(3)+'); with '+k+' pairs, a correlation this size could be chance.')]];
 f.push(['','Correlation is not causation. A strong r says x and y move together; it does not say changing x will change y. Test that with a controlled change.']);
 if(!isNaN(px)&&(px<Math.min.apply(null,xs)||px>Math.max.apply(null,xs))) f.push(['warn','x = '+px+' is outside the range of the data ('+Math.min.apply(null,xs)+' to '+Math.max.apply(null,xs)+'). Predictions outside the range assume the line carries on straight, which it may not.']);
 if(bad) f.push(['warn',bad+' line'+(bad>1?'s':'')+' could not be read as two numbers and were skipped.']);
 if(k<10) f.push(['','Only '+k+' pairs. Small samples can show strong correlations by chance; collect more before acting.']);
 O.innerHTML=api.flags(f);
},
example:{f:{xl:'Installation force, N',yl:'Seal nicks per 100 assemblies',px:'60',
 d:'42 1.1\n45 1.4\n48 1.2\n50 1.9\n52 2.3\n55 2.1\n57 2.8\n60 3.0\n62 3.6\n65 3.4\n68 4.1\n70 4.6\n72 4.4\n75 5.2'}}
}
