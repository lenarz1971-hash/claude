{
slug:'chi-square-proportions-test',
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
 {type:'fields',title:'The question',cols:3,hint:'Rows are the groups you compare; columns are the outcome categories. Enter counts, not percentages.',fields:[
  {id:'rv',label:'Rows are (groups)',ph:'e.g. Discharge unit'},
  {id:'cv',label:'Columns are (outcome)',ph:'e.g. 30-day readmission'},
  {id:'a',label:'Significance level α',type:'number',min:0.001,max:0.5,ph:'0.05'},
  {id:'cn',label:'Column names, separated by commas (2 to 5)',ph:'e.g. Readmitted, Not readmitted',wide:true}]},
 {type:'grid',id:'t',title:'Observed counts',rows:3,hint:'One row per group. Fill only as many count columns as you named.',cols:[
  {id:'g',label:'Group',w:170},{id:'c1',label:'Column 1',type:'number',min:0},{id:'c2',label:'Column 2',type:'number',min:0},{id:'c3',label:'Column 3',type:'number',min:0},{id:'c4',label:'Column 4',type:'number',min:0},{id:'c5',label:'Column 5',type:'number',min:0},
  {id:'tot',label:'Row total',calc:function(r,api){ var t=0,h=0; ['c1','c2','c3','c4','c5'].forEach(function(k){ var v=api.num(r[k]); if(isFinite(v)){t+=v;h=1;} }); return h?api.fmt(t,0):''; }}]},
 {type:'custom',id:'res',title:'Chi-square test of independence',html:'<div class="cs-st"></div><div class="tgw"><table class="mv cs-tb"></table></div>'},
 {type:'custom',id:'pl',title:'Outcome mix by group',html:'<div class="svgw cs-svg"></div><div class="tgw"><table class="mv cs-pr"></table></div>'},
 {type:'custom',id:'read',title:'What the result says',html:'<div class="out cs-out"></div>'}
],
update:function(root,api){
 var ST=window.TOOL.ST, S=api.state(), F=api.fmt, E=api.esc, a=api.num(S.f.a); if(!(a>0&&a<0.5)) a=0.05;
 var K=['c1','c2','c3','c4','c5'], nm=(S.f.cn||'').split(',').map(function(s){return s.trim();}).filter(Boolean), bad=[], used=0;
 S.g.t.forEach(function(r){ K.forEach(function(k,j){ var s=String(r[k]==null?'':r[k]).trim(); if(s!==''){ used=Math.max(used,j+1); var v=Number(s); if(!(v>=0)||Math.round(v)!==v) bad.push(s); } }); });
 var c=Math.max(nm.length,used), rows=[];
 S.g.t.forEach(function(r,i){ var o=[],h=false; for(var j=0;j<c;j++){ var v=api.num(r[K[j]]); if(isFinite(v)&&v>=0) h=true; o.push(isFinite(v)&&v>=0?v:0); } if(h||String(r.g||'').trim()) rows.push({nm:String(r.g||'').trim()||('Row '+(i+1)),o:o}); });
 rows=rows.filter(function(r){ return r.o.some(function(v){return v>0;}); });
 var cols=[]; for(var j=0;j<c;j++) cols.push(nm[j]||('Column '+(j+1)));
 var STt=root.querySelector('.cs-st'), TB=root.querySelector('.cs-tb'), SV=root.querySelector('.cs-svg'), PR=root.querySelector('.cs-pr'), O=root.querySelector('.cs-out'), f=[];
 function blank(msg){ STt.innerHTML=''; TB.innerHTML=''; SV.innerHTML=''; PR.innerHTML=''; O.innerHTML=api.flags(bad.length?[['warn','Counts must be whole numbers of zero or more: '+bad.map(E).join(', ')+'.']]:[],msg); }
 if(c<2||rows.length<2){ blank('Enter counts for at least two groups (rows) and two outcome categories (columns).'); return; }
 var R=rows.map(function(r){return r.o.reduce(function(s,v){return s+v;},0);}), Cs=cols.map(function(x,j){return rows.reduce(function(s,r){return s+r.o[j];},0);}), N=R.reduce(function(s,v){return s+v;},0);
 var zc=Cs.map(function(v,j){return v===0?cols[j]:null;}).filter(Boolean);
 if(zc.length){ blank('Every column needs at least one count. Empty: '+zc.map(E).join(', ')+'.'); return; }
 var chi=0, small=0, min=Infinity, cells=[];
 rows.forEach(function(r,i){ r.e=[]; r.ct=[]; r.o.forEach(function(o,j){ var e=R[i]*Cs[j]/N, ct=(o-e)*(o-e)/e; r.e.push(e); r.ct.push(ct); chi+=ct; if(e<5) small++; if(e<min) min=e; cells.push([ct,r.nm,cols[j],o,e]); }); });
 var df=(rows.length-1)*(c-1), p=ST.csf(chi,df), crit=(function(){ var lo=0,hi=1000; for(var i=0;i<200;i++){ var m=(lo+hi)/2; if(ST.csf(m,df)>a) lo=m; else hi=m; } return (lo+hi)/2; })(), rej=p<a, nc=rows.length*c;
 var V=Math.sqrt(chi/(N*Math.min(rows.length-1,c-1)));
 STt.innerHTML='<p class="th" style="margin:0 0 4px">H₀: '+E(S.f.cv||'the outcome')+' is independent of '+E(S.f.rv||'the group')+' (every group has the same outcome mix).</p><div class="stat">'+[[chi.toFixed(3),'Chi-square χ²'],[df,'df = (r − 1)(c − 1)'],[crit.toFixed(3),'Critical χ² at α = '+a],[ST.pfmt(p),'p value'],[rej?'Reject H₀':'Fail to reject H₀','Decision']].map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('')+'</div>';
 TB.innerHTML='<thead><tr><th>Group</th>'+cols.map(function(x){return '<th>'+E(x)+'<br>obs · exp · (O−E)²/E</th>';}).join('')+'<th>Total</th></tr></thead><tbody>'+rows.map(function(r,i){ return '<tr><td class="mo">'+E(r.nm)+'</td>'+r.o.map(function(o,j){ return '<td'+(r.e[j]<5?' class="lo"':'')+'>'+F(o,0)+' · '+F(r.e[j],1)+' · <b>'+r.ct[j].toFixed(2)+'</b></td>'; }).join('')+'<td>'+F(R[i],0)+'</td></tr>'; }).join('')+'</tbody><tfoot><tr><td class="mo">Total</td>'+Cs.map(function(v){return '<td>'+F(v,0)+'</td>';}).join('')+'<td>'+F(N,0)+'</td></tr></tfoot>';
 /* 100% stacked bars */
 var W=800, L=170, rh=34, H=rows.length*rh+52, pal=['#0F3E68','#D8B147','#7C8B99','#1F8C55','#C6CDD3'];
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Outcome mix by group"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.v{font:600 12px Archivo,sans-serif;fill:#fff}.d{font:600 12px Archivo,sans-serif;fill:#16273A}</style>';
 rows.forEach(function(r,i){ var x=L, y=i*rh+8, nmx=r.nm.length>22?r.nm.slice(0,21)+'…':r.nm; g+='<text x="'+(L-10)+'" y="'+(y+18)+'" text-anchor="end">'+E(nmx)+'</text>';
  r.o.forEach(function(o,j){ var w=(W-L-20)*o/R[i]; g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="26" fill="'+pal[j]+'"/>'; if(w>44) g+='<text class="'+(j===1||j===4?'d':'v')+'" x="'+(x+w/2)+'" y="'+(y+18)+'" text-anchor="middle">'+(o/R[i]*100).toFixed(1)+'%</text>'; x+=w; }); });
 var lx=L; cols.forEach(function(cn,j){ g+='<rect x="'+lx+'" y="'+(H-22)+'" width="12" height="12" fill="'+pal[j]+'"/><text x="'+(lx+17)+'" y="'+(H-12)+'">'+E(cn.length>18?cn.slice(0,17)+'…':cn)+'</text>'; lx+=Math.min(170,(W-L)/c); });
 SV.innerHTML=g+'</svg>';
 /* proportion of column 1 per group, with Wilson interval */
 var z=ST.zinv(1-a/2), conf=((1-a)*100).toFixed(0);
 PR.innerHTML='<thead><tr><th>Group</th><th>'+E(cols[0])+'</th><th>n</th><th>Proportion</th><th>'+conf+'% CI (Wilson)</th></tr></thead><tbody>'+rows.map(function(r,i){ var n=R[i], ph=r.o[0]/n, den=1+z*z/n, cen=(ph+z*z/(2*n))/den, hw=z*Math.sqrt(ph*(1-ph)/n+z*z/(4*n*n))/den; return '<tr><td class="mo">'+E(r.nm)+'</td><td>'+F(r.o[0],0)+'</td><td>'+F(n,0)+'</td><td>'+(ph*100).toFixed(2)+'%</td><td>'+((cen-hw)*100).toFixed(2)+'% to '+((cen+hw)*100).toFixed(2)+'%</td></tr>'; }).join('')+'</tbody>';
 cells.sort(function(x,y){return y[0]-x[0];});
 f.push([rej?'ok':'','<b>'+(rej?'Reject H₀':'Fail to reject H₀')+'</b>: χ² = '+chi.toFixed(2)+' with '+df+' df, '+(p<0.0001?'p &lt; 0.0001':'p = '+ST.pfmt(p))+(p<0.0001?', below α = ':(rej?' &lt; ':' ≥ '))+a+'. '+(rej?E(S.f.cv||'The outcome')+' is associated with '+E(S.f.rv||'the group')+'. The biggest contributor is '+E(cells[0][1])+' / '+E(cells[0][2])+' (observed '+F(cells[0][3],0)+', expected '+F(cells[0][4],1)+', contribution '+cells[0][0].toFixed(2)+').':'The data do not show that the outcome mix differs between groups.')]);
 if(small) f.push([small/nc>0.2||min<1?'warn':'',small+' of '+nc+' expected counts '+(small>1?'are':'is')+' below 5 (smallest '+F(min,2)+'). '+(small/nc>0.2||min<1?'The usual rule (no expected count below 1, no more than 20% below 5) is broken, so the chi-square p value is not reliable. Combine categories or collect more data; for a 2×2 table use Fisher’s exact test.':'That is within the usual rule (no more than 20% below 5, none below 1).')]);
 else f.push(['','All expected counts are 5 or more, so the chi-square approximation is reasonable.']);
 if(rows.length===2&&c===2){ var n1=R[0],n2=R[1],p1=rows[0].o[0]/n1,p2=rows[1].o[0]/n2,pp=Cs[0]/N, zz=(p1-p2)/Math.sqrt(pp*(1-pp)*(1/n1+1/n2)), pz=2*ST.nsf(Math.abs(zz)), se=Math.sqrt(p1*(1-p1)/n1+p2*(1-p2)/n2);
  var mf=function(v,d){ var s=Math.abs(v).toFixed(d); return (v<0&&Number(s)!==0?'−':'')+s; }, dlo=Math.max(-1,p1-p2-z*se), dhi=Math.min(1,p1-p2+z*se);
  f.push(['','Two-proportion z test ('+E(cols[0])+'): p̂₁ = '+(p1*100).toFixed(2)+'%, p̂₂ = '+(p2*100).toFixed(2)+'%, z = '+mf(zz,3)+', two-sided p = '+ST.pfmt(pz)+'. z² = '+(zz*zz).toFixed(3)+' equals χ² for a 2×2 table without the continuity correction. '+conf+'% CI for p₁ − p₂ (Wald): '+mf(dlo*100,2)+' to '+mf(dhi*100,2)+' percentage points'+(p1-p2-z*se<-1||p1-p2+z*se>1?', cut off at ±100 because a difference of proportions cannot go beyond that':'')+'. The Wald interval is rough when a proportion is near 0 or 1 or a group is small.']); }
 f.push(['','Cramér’s V = '+V.toFixed(3)+' (0 = no association, 1 = complete).'+(rej&&V<0.2?' Here χ² is significant but V is small: the association is real but weak. Large samples make small differences significant, so judge whether the size of the difference matters in practice.':(rej?' χ² measures whether there is an association; V measures how strong it is.':' V describes the strength of association in this sample, but the test did not show the association is real.'))]);
 if(bad.length) f.push(['warn','Counts must be whole numbers of zero or more: '+bad.map(E).join(', ')+'.']);
 if(nm.length&&used>nm.length) f.push(['warn','Counts were entered in '+used+' columns but only '+nm.length+' names were given.']);
 O.innerHTML=api.flags(f);
},
example:{f:{rv:'Discharge unit',cv:'30-day readmission',a:'0.05',cn:'Readmitted, Not readmitted'},
 g:{t:[{g:'4 West, medical',c1:'58',c2:'412'},{g:'5 East, surgical',c1:'31',c2:'389'},{g:'Cardiac step-down',c1:'52',c2:'298'},{g:'Orthopedics',c1:'19',c2:'291'}]}}
}
