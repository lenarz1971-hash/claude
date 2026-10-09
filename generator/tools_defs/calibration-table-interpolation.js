{
slug:'calibration-table-interpolation',
KINDS:['Correction (true = reading + correction)','Error (true = reading − error)','True (reference) value at that reading'],
h:{
 pts:function(api){ var S=api.state(), n=api.num, seen={}, out=[], dup=0;
  S.g.t.forEach(function(r){ var x=n(r.x), y=n(r.y); if(isNaN(x)||isNaN(y)) return; if(seen[x]){ dup++; return; } seen[x]=1; out.push([x,y]); });
  out.sort(function(a,b){ return a[0]-b[0]; }); out.dup=dup; return out; },
 /* linear interpolation on the segment holding x; the end segments are extended outside the table */
 at:function(P,x){ if(P.length<2||isNaN(x)) return null; var i=0, k=P.length-1, how='';
  if(x<P[0][0]){ i=0; how='below'; } else if(x>P[k][0]){ i=k-1; how='above'; }
  else { for(i=0;i<k-1&&x>P[i+1][0];i++){} how=(x===P[i][0]||x===P[i+1][0])?'point':'in'; }
  var a=P[i], b=P[i+1], m=(b[1]-a[1])/(b[0]-a[0]), c=a[1]-m*a[0], y=(x===b[0])?b[1]:(x===a[0])?a[1]:a[1]+(x-a[0])*m;
  return {y:y,m:m,c:c,i:i,a:a,b:b,how:how}; },
 tv:function(x,y,kind){ var k=window.TOOL.KINDS.indexOf(kind); if(k<0) k=0; return k===0?x+y:k===1?x-y:y; },
 dp:function(api){ var S=api.state(), d=api.num(S.f.dp); if(d>=0&&d<=10) return Math.round(d); var m=0; S.g.t.forEach(function(r){ ['x','y'].forEach(function(k){ var s=String(r[k]||''); if(s.indexOf('.')>=0) m=Math.max(m,s.split('.')[1].length); }); }); return Math.min(m+1,8); },
 fit:function(P){ var n=P.length; if(n<2) return null; var sx=0,sy=0,sxx=0,sxy=0,syy=0; P.forEach(function(p){ sx+=p[0]; sy+=p[1]; sxx+=p[0]*p[0]; sxy+=p[0]*p[1]; syy+=p[1]*p[1]; });
  var Sxx=sxx-sx*sx/n, Sxy=sxy-sx*sy/n, Syy=syy-sy*sy/n; if(!(Sxx>0)) return null; var b=Sxy/Sxx, a=(sy-b*sx)/n, mr=0, mi=0;
  P.forEach(function(p,i){ var r=p[1]-(a+b*p[0]); if(Math.abs(r)>Math.abs(mr)){ mr=r; mi=i; } });
  return {b:b,a:a,r2:Syy>0?Sxy*Sxy/(Sxx*Syy):1,mr:mr,mi:mi}; },
 ticks:function(a,b){ var r=b-a, st=Math.pow(10,Math.floor(Math.log(r/4)/Math.LN10)), m=r/4/st; st*=m>=5?5:m>=2?2:1; var out=[], v=Math.ceil(a/st)*st, d=Math.max(0,-Math.floor(Math.log(st)/Math.LN10+1e-9)); for(;v<=b+1e-12;v+=st) out.push(Number(v.toFixed(d))); return out; },
 q:function(r,api){ var T=window.TOOL, h=T.h, x=api.num(r.x); if(isNaN(x)) return null; var P=h.pts(api), o=h.at(P,x); if(!o) return null; o.x=x; o.t=h.tv(x,o.y,api.state().f.kind); return o; }
},
sections:[
 {type:'fields',title:'The calibration table',cols:3,hint:'A calibration certificate often gives the error or correction at a few points. Between them, assume a straight line from one point to the next. Say what the second column is, so the corrected value comes out the right way round.',fields:[
  {id:'what',label:'Instrument and certificate',wide:true},
  {id:'xu',label:'Reading (x) units',ph:'psi'},
  {id:'kind',label:'The table gives',type:'select',opts:['Correction (true = reading + correction)','Error (true = reading − error)','True (reference) value at that reading']},
  {id:'dp',label:'Decimals to show',type:'number',min:0,max:10,hint:'Blank: one more than the table.'}]},
 {type:'grid',id:'t',title:'Table points',rows:5,hint:'One row per calibrated point, in any order.',cols:[
  {id:'x',label:'Reading x',type:'number'},
  {id:'y',label:'Table value y',type:'number'},
  {id:'s',label:'Slope to the next point',calc:function(r,api){ var h=window.TOOL.h, P=h.pts(api), x=api.num(r.x); for(var i=0;i<P.length-1;i++) if(P[i][0]===x) return Number(((P[i+1][1]-P[i][1])/(P[i+1][0]-P[i][0])).toPrecision(4)).toString(); return ''; }}]},
 {type:'grid',id:'q',title:'Readings to correct',rows:4,hint:'Each reading is placed on the table segment that holds it. Outside the table the end segment is extended, and the row is flagged as an extrapolation.',cols:[
  {id:'x',label:'Reading',type:'number'},
  {id:'y',label:'Table value here',calc:function(r,api){ var o=window.TOOL.h.q(r,api); return o?o.y.toFixed(window.TOOL.h.dp(api)):''; }},
  {id:'tv',label:'Corrected value',calc:function(r,api){ var o=window.TOOL.h.q(r,api); return o?'<b>'+o.t.toFixed(window.TOOL.h.dp(api))+'</b>':''; }},
  {id:'sg',label:'Segment',calc:function(r,api){ var o=window.TOOL.h.q(r,api); return o?o.a[0]+' to '+o.b[0]:''; }},
  {id:'m',label:'Slope',calc:function(r,api){ var o=window.TOOL.h.q(r,api); return o?Number(o.m.toPrecision(4)).toString():''; }},
  {id:'c',label:'Intercept',calc:function(r,api){ var o=window.TOOL.h.q(r,api); return o?Number(o.c.toPrecision(4)).toString():''; }},
  {id:'hw',label:'How',calc:function(r,api){ var o=window.TOOL.h.q(r,api); if(!o) return ''; return o.how==='in'?'Interpolated':o.how==='point'?'At a table point':'<b class="ct-x">Extrapolated '+o.how+'</b>'; }}]},
 {type:'custom',id:'pl',title:'Table, straight-line fit and readings',hint:'Dots are the table points, joined by the segments used for interpolation. The dashed line is the least-squares straight line through the table. Diamonds are your readings; red ones are extrapolated.',html:'<div class="stat ct-stat"></div><div class="svgw ct-svg"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out ct-out"></div>'}
],
update:function(root,api){
 var S=api.state(), T=window.TOOL, h=T.h, P=h.pts(api), f=[], un=api.esc(S.f.xu||''), dp=h.dp(api);
 var st=root.querySelector('.ct-stat'), sv=root.querySelector('.ct-svg');
 if(P.dup) f.push(['warn',P.dup+' table row'+(P.dup>1?'s repeat':' repeats')+' a reading already in the table and '+(P.dup>1?'were':'was')+' ignored. Each reading can have only one table value.']);
 if(P.length<2){ st.innerHTML=''; sv.innerHTML=''; root.querySelector('.ct-out').innerHTML=api.flags(f,'Enter at least two table points.'); return; }
 var F=h.fit(P), Q=S.g.q.map(function(r){ return h.q(r,api); }).filter(Boolean), ex=Q.filter(function(o){ return o.how==='below'||o.how==='above'; });
 var span=P[P.length-1][0]-P[0][0];
 st.innerHTML='<div><b>'+P.length+'</b><span>Table points</span></div><div><b>'+Number(F.b.toPrecision(4))+'</b><span>Best-fit slope</span></div><div><b>'+Number(F.a.toPrecision(4))+'</b><span>Best-fit intercept</span></div><div><b>'+F.r2.toFixed(4)+'</b><span>r²</span></div><div><b>'+(F.mr>=0?'+':'−')+Math.abs(F.mr).toFixed(dp)+'</b><span>Largest departure from the line (at '+P[F.mi][0]+')</span></div>';
 if(ex.length) f.push(['warn',ex.length+' reading'+(ex.length>1?'s are':' is')+' outside the table ('+ex.map(function(o){ return o.x; }).join(', ')+' '+un+'). The value is extrapolated by extending the end segment, and nothing on the certificate supports it. Calibrate over the range you use, or treat the result as unverified.']);
 else if(Q.length) f.push(['ok','All '+Q.length+' readings are inside the calibrated range ('+P[0][0]+' to '+P[P.length-1][0]+' '+un+').']);
 var k=T.KINDS.indexOf(S.f.kind); if(k<0) k=0;
 f.push(['',k===0?'A correction is added to the reading: true value = reading + correction. It is the error with the sign reversed.':k===1?'An error is subtracted from the reading: true value = reading − error, where error = reading − true value.':'The table gives the true value directly, so the result is read off the line.']);
 var steep=0; for(var i=0;i<P.length-2;i++){ var m1=(P[i+1][1]-P[i][1])/(P[i+1][0]-P[i][0]), m2=(P[i+2][1]-P[i+1][1])/(P[i+2][0]-P[i+1][0]); if(m1*m2<0) steep++; }
 if(k<2&&steep) f.push(['','The '+(k===0?'correction':'error')+' changes direction '+steep+' time'+(steep>1?'s':'')+' across the table, so a single straight line (slope '+Number(F.b.toPrecision(3))+', intercept '+Number(F.a.toPrecision(3))+') departs from the table by up to '+Math.abs(F.mr).toFixed(dp)+' '+un+'. Point-to-point interpolation follows the table; a single fitted line would not.']);
 f.push(['','Linear interpolation assumes the instrument is straight between the calibrated points. The closer the points, the safer that is. The interpolated value carries at least the uncertainty of the table points either side.']);
 root.querySelector('.ct-out').innerHTML=api.flags(f);
 /* chart */
 var xs=P.map(function(p){return p[0];}).concat(Q.map(function(o){return o.x;})), ys=P.map(function(p){return p[1];}).concat(Q.map(function(o){return o.y;}));
 var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys); if(k<2){ y0=Math.min(y0,0); y1=Math.max(y1,0); }
 var py=(y1-y0)*0.12||1, px=(x1-x0)*0.04||1; y0-=py; y1+=py; x0-=px; x1+=px;
 var W=640,H=300,L=64,R=16,Tp=14,B=40, X=function(v){ return L+(v-x0)/(x1-x0)*(W-L-R); }, Y=function(v){ return Tp+(y1-v)/(y1-y0)*(H-Tp-B); };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Calibration table with interpolated readings">';
 g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="#4A5D71"/><line x1="'+L+'" x2="'+L+'" y1="'+Tp+'" y2="'+(H-B)+'" stroke="#4A5D71"/>';
 if(k<2&&y0<0&&y1>0) g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'" stroke="#C6CDD3"/>';
 h.ticks(x0,x1).forEach(function(xv){ g+='<text x="'+X(xv).toFixed(1)+'" y="'+(H-B+15)+'" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+xv+'</text><line x1="'+X(xv).toFixed(1)+'" x2="'+X(xv).toFixed(1)+'" y1="'+(H-B)+'" y2="'+(H-B+4)+'" stroke="#4A5D71"/>'; });
 h.ticks(y0,y1).forEach(function(yv){ g+='<text x="'+(L-6)+'" y="'+(Y(yv)+4).toFixed(1)+'" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#4A5D71">'+yv+'</text><line x1="'+(L-4)+'" x2="'+L+'" y1="'+Y(yv).toFixed(1)+'" y2="'+Y(yv).toFixed(1)+'" stroke="#4A5D71"/>'; });
 g+='<text x="'+((L+W-R)/2)+'" y="'+(H-6)+'" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" fill="#4A5D71">Reading'+(un?' ('+un+')':'')+'</text>';
 g+='<line x1="'+X(x0).toFixed(1)+'" y1="'+Y(F.a+F.b*x0).toFixed(1)+'" x2="'+X(x1).toFixed(1)+'" y2="'+Y(F.a+F.b*x1).toFixed(1)+'" stroke="#7C8B99" stroke-width="1.4" stroke-dasharray="6 4"/>';
 g+='<polyline points="'+P.map(function(p){ return X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1); }).join(' ')+'" fill="none" stroke="#0F3E68" stroke-width="2"/>';
 var qx=Q.map(function(o){return o.x;}), qlo=Math.min.apply(null,qx.concat([P[0][0]])), qhi=Math.max.apply(null,qx.concat([P[P.length-1][0]])), e0=h.at(P,qlo), e1=h.at(P,qhi);
 if(qlo<P[0][0]) g+='<line x1="'+X(qlo).toFixed(1)+'" y1="'+Y(e0.y).toFixed(1)+'" x2="'+X(P[0][0]).toFixed(1)+'" y2="'+Y(P[0][1]).toFixed(1)+'" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="3 3"/>';
 if(qhi>P[P.length-1][0]) g+='<line x1="'+X(P[P.length-1][0]).toFixed(1)+'" y1="'+Y(P[P.length-1][1]).toFixed(1)+'" x2="'+X(qhi).toFixed(1)+'" y2="'+Y(e1.y).toFixed(1)+'" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="3 3"/>';
 P.forEach(function(p){ g+='<circle cx="'+X(p[0]).toFixed(1)+'" cy="'+Y(p[1]).toFixed(1)+'" r="4.5" fill="#fff" stroke="#0F3E68" stroke-width="2"/>'; });
 Q.forEach(function(o){ var cx=X(o.x), cy=Y(o.y), c=(o.how==='below'||o.how==='above')?'#C0392B':'#9C7C1F'; g+='<path d="M'+cx.toFixed(1)+','+(cy-7).toFixed(1)+' l7,7 -7,7 -7,-7z" fill="'+c+'"/>'; });
 g+='</svg>'; sv.innerHTML=g;
},
example:{f:{what:'Test gauge PG-114, 0 to 300 psi; corrections from calibration certificate CML-26-03981',xu:'psi',kind:'Correction (true = reading + correction)',dp:''},
 g:{t:[{x:'0',y:'0.00'},{x:'50',y:'0.15'},{x:'100',y:'0.25'},{x:'150',y:'0.30'},{x:'200',y:'0.20'},{x:'250',y:'0.05'},{x:'300',y:'-0.10'}],
  q:[{x:'37.5'},{x:'120'},{x:'212.4'},{x:'300'},{x:'315'}]}}
}
