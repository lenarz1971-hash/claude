{
slug:'one-way-anova',
ST:(function(){
 var C=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 function gln(x){ if(x<0.5) return Math.log(Math.PI/Math.sin(Math.PI*x))-gln(1-x); x-=1; var a=C[0],t=x+7.5; for(var i=1;i<9;i++) a+=C[i]/(x+i); return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a); }
 function bcf(a,b,x){ var qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap,m,m2,aa,del,h; if(Math.abs(d)<1e-300)d=1e-300; d=1/d; h=d;
  for(m=1;m<=300;m++){ m2=2*m; aa=m*(b-m)*x/((qam+m2)*(a+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; h*=d*c;
   aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); d=1+aa*d; if(Math.abs(d)<1e-300)d=1e-300; c=1+aa/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-15) break; }
  return h; }
 function ib(a,b,x){ if(x<=0) return 0; if(x>=1) return 1; var bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b; }
 function gq(a,x){ if(x<=0) return 1; var g=gln(a),s,del,ap,n,b,c,d,h,an,i;
  if(x<a+1){ ap=a; s=1/a; del=s; for(n=0;n<1000;n++){ ap++; del*=x/ap; s+=del; if(Math.abs(del)<Math.abs(s)*1e-16) break; } return 1-s*Math.exp(-x+a*Math.log(x)-g); }
  b=x+1-a; c=1e300; d=1/b; h=d; for(i=1;i<1000;i++){ an=-i*(i-a); b+=2; d=an*d+b; if(Math.abs(d)<1e-300)d=1e-300; c=b+an/c; if(Math.abs(c)<1e-300)c=1e-300; d=1/d; del=d*c; h*=del; if(Math.abs(del-1)<1e-16) break; }
  return Math.exp(-x+a*Math.log(x)-g)*h; }
 function t2(t,v){ return ib(v/2,0.5,v/(v+t*t)); }
 function tcdf(t,v){ var p=0.5*t2(t,v); return t>0?1-p:p; }
 function tsf(t,v){ var p=0.5*t2(t,v); return t>0?p:1-p; }
 function fsf(F,a,b){ return F<=0?1:ib(b/2,a/2,b/(b+a*F)); }
 function csf(x,k){ return gq(k/2,x/2); }
 function nsf(z){ var q=0.5*gq(0.5,z*z/2); return z>0?q:1-q; }
 function inv(fn,p,lo,hi){ for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(fn(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
 function tinv(p,v){ return inv(function(t){return tcdf(t,v);},p,-1e4,1e4); }
 function zinv(p){ return inv(function(z){return 1-nsf(z);},p,-40,40); }
 function finv(p,a,b){ return inv(function(F){return 1-fsf(F,a,b);},p,0,1e6); }
 function pfmt(p){ return !isFinite(p)?'—':p<0.0001?'&lt; 0.0001':p.toFixed(4); }
 return {gln:gln,ib:ib,gq:gq,t2:t2,tcdf:tcdf,tsf:tsf,fsf:fsf,csf:csf,nsf:nsf,tinv:tinv,zinv:zinv,finv:finv,pfmt:pfmt};
})(),
sections:[
 {type:'fields',title:'Groups and data',cols:3,hint:'One group per column, one observation per cell. Groups can have different sizes; leave the unused cells blank.',fields:[
  {id:'u',label:'Response, with units',ph:'e.g. Pick time per order, min'},
  {id:'fa',label:'Factor (what defines the groups)',ph:'e.g. Picking method'},
  {id:'a',label:'Significance level α',type:'number',min:0.001,max:0.5,ph:'0.05'},
  {id:'gn',label:'Group names, in column order, separated by commas',ph:'e.g. Paper, RF scanner, Pick-to-light, Voice',wide:true},
  {id:'d',label:'Observations, one group per column',type:'datagrid',cols:[{label:'Group 1'},{label:'Group 2'},{label:'Group 3'},{label:'Group 4'},{label:'Group 5'},{label:'Group 6'}],rows:10,minRows:4}]},
 {type:'custom',id:'tab',title:'ANOVA table',html:'<div class="tgw"><table class="mv av-tb"></table></div><div class="av-st"></div>'},
 {type:'custom',id:'grp',title:'Group means with confidence intervals',html:'<div class="tgw"><table class="mv av-g"></table></div><div class="svgw av-svg"></div>'},
 {type:'custom',id:'read',title:'What the result says',html:'<div class="out av-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, a=api.num(S.f.a); if(!(a>0&&a<0.5)) a=0.05;
 var names=(S.f.gn||'').split(',').map(function(s){return s.trim();}), cols=[[],[],[],[],[],[]], bad=0;
 (S.f.d||'').split('\n').forEach(function(l){ if(!l.replace(/\s/g,'')) return; var t=/\t/.test(l)?l.split('\t'):l.trim().split(/[\s,;]+/);
  t.forEach(function(v,j){ v=v.trim(); if(j>5||v==='') return; var z=Number(v); if(isFinite(z)) cols[j].push(z); else bad++; }); });
 var G=[]; cols.forEach(function(c,j){ if(c.length) G.push({nm:names[j]||('Group '+(j+1)),x:c}); });
 var TB=root.querySelector('.av-tb'), STt=root.querySelector('.av-st'), GT=root.querySelector('.av-g'), SV=root.querySelector('.av-svg'), O=root.querySelector('.av-out'), f=[];
 var N=0; G.forEach(function(g){N+=g.x.length;});
 if(G.length<2||N-G.length<1){ TB.innerHTML=''; STt.innerHTML=''; GT.innerHTML=''; SV.innerHTML=''; O.innerHTML=api.flags(bad?[['warn',bad+' cell'+(bad>1?'s were':' was')+' not a number.']]:[],'Enter at least two groups, with at least one group holding two or more values.'); return; }
 var gm=0; G.forEach(function(g){ var m=0; g.x.forEach(function(v){m+=v;}); g.n=g.x.length; g.m=m/g.n; gm+=m; }); gm/=N;
 var ssb=0, ssw=0; G.forEach(function(g){ var s=0; g.x.forEach(function(v){s+=(v-g.m)*(v-g.m);}); g.ss=s; g.s=g.n>1?Math.sqrt(s/(g.n-1)):NaN; ssw+=s; ssb+=g.n*(g.m-gm)*(g.m-gm); });
 var k=G.length, dfb=k-1, dfw=N-k, dft=N-1, msb=ssb/dfb, msw=ssw/dfw, Fv=msw>0?msb/msw:Infinity, p=msw>0?ST.fsf(Fv,dfb,dfw):0, fc=ST.finv(1-a,dfb,dfw), sp=Math.sqrt(msw), r2=ssb/(ssb+ssw);
 var dp=Math.max(2,Math.min(4,(String(G[0].x[0]).split('.')[1]||'').length+1));
 TB.innerHTML='<thead><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F</th><th>p value</th></tr></thead><tbody>'+
  '<tr><td class="mo">Between groups ('+E(S.f.fa||'factor')+')</td><td>'+F(ssb,dp+1)+'</td><td>'+dfb+'</td><td>'+F(msb,dp+1)+'</td><td>'+(isFinite(Fv)?Fv.toFixed(3):'—')+'</td><td>'+ST.pfmt(p)+'</td></tr>'+
  '<tr><td class="mo">Within groups (error)</td><td>'+F(ssw,dp+1)+'</td><td>'+dfw+'</td><td>'+F(msw,dp+1)+'</td><td></td><td></td></tr>'+
  '<tr><td class="mo"><b>Total</b></td><td>'+F(ssb+ssw,dp+1)+'</td><td>'+dft+'</td><td></td><td></td><td></td></tr></tbody>';
 STt.innerHTML='<div class="stat">'+[[isFinite(Fv)?Fv.toFixed(3):'—','F statistic'],[fc.toFixed(3),'Critical F at α = '+a],[ST.pfmt(p),'p value'],[(r2*100).toFixed(1)+'%','R² (SS between ÷ SS total)'],[F(sp,dp),'Pooled std dev √MSW']].map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 var tq=ST.tinv(1-a/2,dfw), conf=((1-a)*100).toFixed(0);
 G.forEach(function(g){ g.h=tq*sp/Math.sqrt(g.n); });
 GT.innerHTML='<thead><tr><th>Group</th><th>n</th><th>Mean</th><th>Std dev</th><th>'+conf+'% CI (pooled s)</th></tr></thead><tbody>'+G.map(function(g){return '<tr><td class="mo">'+E(g.nm)+'</td><td>'+g.n+'</td><td>'+F(g.m,dp)+'</td><td>'+(isFinite(g.s)?F(g.s,dp):'—')+'</td><td>'+F(g.m-g.h,dp)+' to '+F(g.m+g.h,dp)+'</td></tr>';}).join('')+'</tbody>';
 /* interval plot with the points */
 var all=[]; G.forEach(function(g){ all=all.concat(g.x); all.push(g.m-g.h,g.m+g.h); });
 var mn=Math.min.apply(null,all), mx=Math.max.apply(null,all), pd=(mx-mn)*0.07||1; mn-=pd; mx+=pd;
 var W=800,H=360,L=64,B=58,T=14, cw=(W-L-14)/k, Y=function(v){return H-B-(v-mn)/(mx-mn)*(H-B-T);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Interval plot"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.ax{font:12px Archivo,sans-serif;fill:#4A5D71}</style><rect x="'+L+'" y="'+T+'" width="'+(W-L-14)+'" height="'+(H-B-T)+'" fill="#fff" stroke="#DDE1E4"/>';
 for(var i=0;i<=5;i++){ var v=mn+(mx-mn)*i/5; g+='<line x1="'+L+'" x2="'+(W-14)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#EDEFEA"/><text class="ax" x="'+(L-6)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+F(v,dp-1)+'</text>'; }
 g+='<line x1="'+L+'" x2="'+(W-14)+'" y1="'+Y(gm)+'" y2="'+Y(gm)+'" stroke="#7C8B99" stroke-dasharray="5 4"/><text class="ax" x="'+(L+6)+'" y="'+(Y(gm)-5)+'">grand mean '+F(gm,dp)+'</text>';
 G.forEach(function(gr,j){ var cx=L+cw*(j+0.5), nm=gr.nm.length>16?gr.nm.slice(0,15)+'…':gr.nm;
  gr.x.forEach(function(v){ g+='<circle cx="'+(cx-22)+'" cy="'+Y(v)+'" r="3.5" fill="#0F3E68" fill-opacity=".55"/>'; });
  g+='<line x1="'+(cx+10)+'" x2="'+(cx+10)+'" y1="'+Y(gr.m-gr.h)+'" y2="'+Y(gr.m+gr.h)+'" stroke="#9C7C1F" stroke-width="2.5"/><line x1="'+(cx+3)+'" x2="'+(cx+17)+'" y1="'+Y(gr.m-gr.h)+'" y2="'+Y(gr.m-gr.h)+'" stroke="#9C7C1F" stroke-width="2"/><line x1="'+(cx+3)+'" x2="'+(cx+17)+'" y1="'+Y(gr.m+gr.h)+'" y2="'+Y(gr.m+gr.h)+'" stroke="#9C7C1F" stroke-width="2"/><rect x="'+(cx+5)+'" y="'+(Y(gr.m)-5)+'" width="10" height="10" fill="#D8B147" stroke="#9C7C1F"/>';
  g+='<text x="'+cx+'" y="'+(H-B+20)+'" text-anchor="middle">'+E(nm)+'</text>'; });
 g+='<text class="ax" x="'+((W+L)/2)+'" y="'+(H-10)+'" text-anchor="middle">'+E(S.f.u||'Response')+' · dots = data, square = mean, bar = '+conf+'% CI (pooled s)</text>';
 SV.innerHTML=g+'</svg>';
 var rej=p<a, hi=G.slice().sort(function(x,y){return y.m-x.m;});
 f.push([rej?'ok':'','<b>'+(rej?'Reject H₀':'Fail to reject H₀')+'</b>: F = '+(isFinite(Fv)?Fv.toFixed(2):'—')+' with ('+dfb+', '+dfw+') df, '+(p<0.0001?'p &lt; 0.0001':'p = '+ST.pfmt(p))+(p<0.0001?', below α = ':(rej?' &lt; ':' ≥ '))+a+'. '+(rej?'At least one group mean differs from the others. ANOVA does not say which; the highest mean is '+E(hi[0].nm)+' ('+F(hi[0].m,dp)+') and the lowest is '+E(hi[k-1].nm)+' ('+F(hi[k-1].m,dp)+').':'The data do not show a difference among the '+k+' group means.')]);
 if(rej) f.push(['','To find which groups differ, use a multiple-comparison method such as Tukey’s. Comparing every pair with separate t tests inflates the chance of a false alarm.']);
 f.push(['',(r2*100).toFixed(1)+'% of the total variation in the response is explained by '+E(S.f.fa||'the factor')+'; the rest is variation within groups.']);
 var med=function(v){ var s=v.slice().sort(function(x,y){return x-y;}), n=s.length; return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2; };
 var Z=G.map(function(gr){ var md=med(gr.x); return gr.x.map(function(v){return Math.abs(v-md);}); }), zg=0, zN=0, zb=0, zw=0;
 Z.forEach(function(z){ z.forEach(function(v){zg+=v;zN++;}); }); zg/=zN;
 Z.forEach(function(z){ var m=0; z.forEach(function(v){m+=v;}); m/=z.length; zb+=z.length*(m-zg)*(m-zg); z.forEach(function(v){zw+=(v-m)*(v-m);}); });
 if(zw>0&&dfw>0){ var LF=(zb/dfb)/(zw/dfw), lp=ST.fsf(LF,dfb,dfw); f.push([lp<a?'warn':'','Equal-variance check (Levene’s test, median version): F = '+LF.toFixed(3)+', p = '+ST.pfmt(lp)+'. '+(lp<a?'The group variances differ; the ANOVA p value is less trustworthy, especially with unequal group sizes. Consider Welch’s ANOVA.':'No evidence the group variances differ, so the equal-variance assumption looks reasonable.')]); }
 var sm=G.filter(function(gr){return gr.n<2;}); if(sm.length) f.push(['warn',sm.map(function(gr){return E(gr.nm);}).join(', ')+' '+(sm.length>1?'have':'has')+' a single value, which adds nothing to the within-group variation.']);
 if(names.filter(Boolean).length&&names.filter(Boolean).length!==k) f.push(['warn','You named '+names.filter(Boolean).length+' groups but '+k+' columns hold data. Check the names line up with the columns.']);
 if(bad) f.push(['warn',bad+' cell'+(bad>1?'s were':' was')+' not a number and skipped.']);
 O.innerHTML=api.flags(f);
},
example:{f:{u:'Pick time per order, min',fa:'Picking method',a:'0.05',gn:'Paper list, RF scanner, Pick-to-light, Voice',
 d:'14.2\t12.1\t10.4\t11.8\n15.1\t12.8\t10.9\t12.6\n13.6\t11.5\t9.8\t11.2\n14.8\t13.2\t11.3\t12.9\n15.6\t12.4\t10.1\t12.0\n13.9\t11.9\t10.7\t11.5\n14.5\t13.0\t11.0\t12.3\n15.3\t12.6\t10.6\t'}}
}
