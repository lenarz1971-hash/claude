{
slug:'five-s-audit-scorecard',
SS:['Sort','Set in order','Shine','Standardize','Sustain','Safety'],
KEYS:['s1','s2','s3','s4','s5','s6'],
nS:function(api){ return /6S/.test(api.state().f.mode||'')?6:5; },
/* this audit: average of the criteria scores in each S, and the overall % (each S weighted equally) */
cur:function(api){
 var T=window.TOOL, S=api.state(), k=T.nS(api), by={}, n=api.num;
 T.SS.forEach(function(s){ by[s]={sum:0,n:0,low:[]}; });
 S.g.c.forEach(function(r,i){ var v=n(r.sc); if(!r.s||isNaN(v)||!by[r.s]) return; by[r.s].sum+=v; by[r.s].n++; });
 var avg=T.SS.slice(0,k).map(function(s){ return by[s].n?by[s].sum/by[s].n:NaN; });
 var done=avg.filter(function(v){return !isNaN(v);});
 return {k:k,by:by,avg:avg,pct:done.length?done.reduce(function(a,b){return a+b;},0)/done.length/4*100:NaN,complete:done.length===k};
},
hpct:function(r,api){
 var T=window.TOOL, k=T.nS(api), v=T.KEYS.slice(0,k).map(function(x){return api.num(r[x]);}).filter(function(x){return !isNaN(x);});
 return v.length?v.reduce(function(a,b){return a+b;},0)/v.length/4*100:NaN;
},
sections:[
 {type:'fields',title:'This audit',cols:3,hint:'Score each criterion 0 to 4: <b>0</b> not started, <b>1</b> started, <b>2</b> partly in place, <b>3</b> in place with few gaps, <b>4</b> in place and kept up. Each S is the average of its criteria; the overall score gives each S equal weight.',fields:[
  {id:'area',label:'Area audited',ph:'e.g. Press line 2'},
  {id:'date',label:'Audit date',type:'date'},
  {id:'who',label:'Auditor'},
  {id:'mode',label:'Method',type:'select',opts:['5S','6S (5S plus Safety)']},
  {id:'tgt',label:'Target score (%)',type:'number',min:0,max:100,ph:'80'},
  {id:'note',label:'Notes',ph:'e.g. Second shift, after the weekend clean-up'}]},
 {type:'grid',id:'c',title:'Checklist',rows:5,hint:'One row per criterion. Write each criterion so two auditors would score it the same way: "Only today\'s dies are at the press", not "Area is tidy". Any score of 2 or less should have a finding and an action.',cols:[
  {id:'s',label:'S',type:'select',opts:['Sort','Set in order','Shine','Standardize','Sustain','Safety']},
  {id:'q',label:'Criterion',w:240,type:'textarea',rows:1},
  {id:'sc',label:'Score 0-4',type:'number',min:0,max:4},
  {id:'fd',label:'Finding and action',w:220,type:'textarea',rows:1},
  {id:'ow',label:'Owner',w:100}]},
 {type:'custom',id:'res',title:'Score for this audit',html:'<div class="stat fs-stat"></div><div class="svgw fs-bars"></div><div class="tgbar noprint"><button type="button" class="dg-btn fs-add">Add this audit to the history</button><span class="dg-hint fs-msg"></span></div>',
  init:function(el,api){ var b=el.querySelector('.fs-add'); b.onclick=function(){
   var T=window.TOOL, S=api.state(), c=T.cur(api), msg;
   if(isNaN(c.pct)){ el.querySelector('.fs-msg').textContent='Score the checklist first.'; return; }
   var row={d:S.f.date||api.today(),a:S.f.area||''}; T.KEYS.forEach(function(x,i){ row[x]=i<c.k&&!isNaN(c.avg[i])?String(Math.round(c.avg[i]*1000)/1000):''; });
   var at=-1; S.g.h.forEach(function(r,i){ if(r.d===row.d&&(r.a||'')===row.a) at=i; });
   if(at>=0){ S.g.h[at]=row; msg='Replaced the history row for this area and date.'; }
   else { var e=-1; S.g.h.forEach(function(r,i){ if(e<0&&!r.d&&!r.a&&!r.s1&&!r.s2) e=i; }); if(e>=0) S.g.h[e]=row; else S.g.h.push(row); msg='Added to the history.'; }
   api.save(); api.rerender(); var m=document.querySelector('#tool .fs-msg'); if(m) m.textContent=msg; }; }},
 {type:'grid',id:'h',title:'Audit history',rows:3,hint:'One row per audit: the average score (0 to 4) for each S. The button above adds this audit; you can also type in past audits from paper. Leave Safety blank for 5S audits.',cols:[
  {id:'d',label:'Date',type:'date'},
  {id:'a',label:'Area',w:120},
  {id:'s1',label:'Sort',type:'number',min:0,max:4},
  {id:'s2',label:'Set in order',type:'number',min:0,max:4},
  {id:'s3',label:'Shine',type:'number',min:0,max:4},
  {id:'s4',label:'Standardize',type:'number',min:0,max:4},
  {id:'s5',label:'Sustain',type:'number',min:0,max:4},
  {id:'s6',label:'Safety',type:'number',min:0,max:4},
  {id:'t',label:'Score %',calc:function(r,api){ var p=window.TOOL.hpct(r,api); return isNaN(p)?'':api.fmt(p,0)+'%'; }}]},
 {type:'custom',id:'tr',title:'Trend by area',hint:'Overall score for each area at each audit, with the target. A score that climbs and then slides back usually means Sustain is weak: the clean-up happened, the habits did not.',html:'<div class="svgw fs-trend"></div>'},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out fs-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), F=api.fmt, E=api.esc, n=api.num, f=[], c=T.cur(api), k=c.k, tgt=n(S.f.tgt); if(isNaN(tgt)) tgt=80;
 var st=root.querySelector('.fs-stat');
 st.innerHTML='<div><b>'+(isNaN(c.pct)?'&ndash;':F(c.pct,0)+'%')+'</b><span>Overall, '+(k===6?'6S':'5S')+'</span></div>'+T.SS.slice(0,k).map(function(s,i){ return '<div><b>'+(isNaN(c.avg[i])?'&ndash;':F(c.avg[i],2))+'</b><span>'+s+' (of 4)</span></div>'; }).join('');
 /* bars for this audit */
 var W=720, L=120, R=70, RH=30, H=26+k*RH+30, sx=function(v){return L+v/4*(W-L-R);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Score by S"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
 for(var t=0;t<=4;t++) g+='<line x1="'+sx(t)+'" x2="'+sx(t)+'" y1="12" y2="'+(H-24)+'" stroke="#E4E7E1"/><text class="ax" x="'+sx(t)+'" y="'+(H-10)+'" text-anchor="middle">'+t+'</text>';
 g+='<line x1="'+sx(tgt/25)+'" x2="'+sx(tgt/25)+'" y1="8" y2="'+(H-24)+'" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="5 4"/><text class="ax" x="'+(sx(tgt/25)+4)+'" y="10" style="fill:#C0392B" dominant-baseline="hanging">TARGET '+F(tgt,0)+'%</text>';
 T.SS.slice(0,k).forEach(function(s,i){ var v=c.avg[i], y=22+i*RH;
  g+='<text x="'+(L-8)+'" y="'+(y+15)+'" text-anchor="end">'+s+'</text>';
  if(!isNaN(v)) g+='<rect x="'+L+'" y="'+(y+3)+'" width="'+(sx(v)-L)+'" height="18" fill="'+(v*25<tgt?'#D8B147':'#0F3E68')+'"/><text class="ax" x="'+(sx(v)+6)+'" y="'+(y+16)+'">'+F(v,2)+'</text>';
  else g+='<text class="ax" x="'+(L+6)+'" y="'+(y+16)+'">NOT SCORED</text>'; });
 root.querySelector('.fs-bars').innerHTML=g+'</svg>';
 /* trend chart */
 var H2=[]; S.g.h.forEach(function(r){ var p=T.hpct(r,api), d=r.d&&!isNaN(new Date(r.d+'T00:00:00'))?new Date(r.d+'T00:00:00').getTime():NaN; if(!isNaN(p)&&!isNaN(d)) H2.push({d:d,ds:r.d,a:(r.a||'').trim()||'(no area)',p:p,r:r}); });
 H2.sort(function(a,b){return a.d-b.d;});
 var areas=[]; H2.forEach(function(x){ if(areas.indexOf(x.a)<0) areas.push(x.a); });
 var tr=root.querySelector('.fs-trend');
 if(!H2.length) tr.innerHTML='<p style="padding:10px 12px;margin:0">Add audits to the history to see the trend.</p>';
 else {
  var Wt=720, Lt=50, Rt=150, Ht=280, top=20, bot=40, d0=H2[0].d, d1=H2[H2.length-1].d, span=d1-d0||1;
  var X=function(d){ return d1===d0?Lt+(Wt-Lt-Rt)/2:Lt+(d-d0)/span*(Wt-Lt-Rt); }, Y=function(p){ return top+(100-p)/100*(Ht-top-bot); };
  var cols=['#0F3E68','#9C7C1F','#1F8C55','#7A4E9C','#4A5D71','#C76B1E'];
  var h='<svg viewBox="0 0 '+Wt+' '+Ht+'" role="img" aria-label="Score trend by area"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  for(var p=0;p<=100;p+=20) h+='<line x1="'+Lt+'" x2="'+(Wt-Rt)+'" y1="'+Y(p)+'" y2="'+Y(p)+'" stroke="#E4E7E1"/><text class="ax" x="'+(Lt-6)+'" y="'+(Y(p)+3)+'" text-anchor="end">'+p+'%</text>';
  h+='<line x1="'+Lt+'" x2="'+(Wt-Rt)+'" y1="'+Y(tgt)+'" y2="'+Y(tgt)+'" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="5 4"/><text class="ax" x="'+(Wt-Rt+6)+'" y="'+(Y(tgt)+3)+'" style="fill:#C0392B">TARGET</text>';
  var dates=[]; H2.forEach(function(x){ if(dates.indexOf(x.d)<0) dates.push(x.d); });
  var lastX=-99; dates.forEach(function(d){ var x=X(d); if(x-lastX<56) return; lastX=x; var dt=new Date(d); h+='<text class="ax" x="'+x+'" y="'+(Ht-bot+16)+'" text-anchor="middle">'+dt.toLocaleDateString('en-US',{month:'short',day:'numeric'}).toUpperCase()+'</text>'; });
  var ly=[]; areas.forEach(function(a,i){ var pts=H2.filter(function(x){return x.a===a;}), col=cols[i%cols.length];
   h+='<polyline fill="none" stroke="'+col+'" stroke-width="2.2" points="'+pts.map(function(x){return X(x.d)+','+Y(x.p);}).join(' ')+'"/>';
   pts.forEach(function(x){ h+='<circle cx="'+X(x.d)+'" cy="'+Y(x.p)+'" r="4" fill="#fff" stroke="'+col+'" stroke-width="2"/>'; });
   var last=pts[pts.length-1], yy=Y(last.p)+4; ly.forEach(function(v){ if(Math.abs(v-yy)<14) yy=v+14; }); ly.push(yy);
   var nm=a.length>16?a.slice(0,15)+'…':a; h+='<text x="'+(Wt-Rt+10)+'" y="'+yy+'" style="fill:'+col+';font-weight:700">'+E(nm)+' '+F(last.p,0)+'%</text>'; });
  tr.innerHTML=h+'</svg>';
 }
 /* checks on this audit */
 var rows=S.g.c.filter(function(r){return r.q||r.sc;});
 rows.forEach(function(r,i){ var v=n(r.sc), nm=(r.q||'').slice(0,60)+((r.q||'').length>60?'…':'');
  if(r.sc!==''&&r.sc!=null&&!(v>=0&&v<=4)) f.push(['warn','"'+E(nm)+'": scores run 0 to 4.']);
  if(!r.s) f.push(['warn','"'+E(nm)+'" has no S chosen, so it is not counted.']);
  if(r.s==='Safety'&&k===5) f.push(['','"'+E(nm)+'" is a Safety criterion, and the method is 5S, so it is not counted. Choose 6S to include it.']);
  if(v<=2&&!r.fd) f.push(['warn','"'+E(nm)+'" scored '+v+' with no finding or action written.']);
  if(r.s==='Safety'&&k===6&&v<=1) f.push(['warn','Safety: "'+E(nm)+'" scored '+v+'. Treat a safety gap as an action now, whatever the overall score.']); });
 if(!isNaN(c.pct)){
  var sc=T.SS.slice(0,k).map(function(s,i){return {s:s,v:c.avg[i]};}).filter(function(x){return !isNaN(x.v);}).sort(function(a,b){return a.v-b.v;});
  f.push([c.pct>=tgt?'ok':'warn','This audit scores <b>'+F(c.pct,0)+'%</b> against a target of '+F(tgt,0)+'%. The weakest S is <b>'+sc[0].s+'</b> ('+F(sc[0].v,2)+' of 4).']);
  if(!c.complete) f.push(['warn','Not every S has a scored criterion: '+T.SS.slice(0,k).filter(function(s,i){return isNaN(c.avg[i]);}).join(', ')+'. The overall score uses only the S that were scored.']);
  T.SS.slice(0,k).forEach(function(s){ if(c.by[s].n===1) f.push(['',s+' rests on one criterion. Two or three per S give a steadier score.']); });
  var su=c.avg[4], rest=c.avg.slice(0,4).filter(function(v){return !isNaN(v);}); if(!isNaN(su)&&rest.length&&su<Math.min.apply(null,rest)) f.push(['warn','Sustain is the lowest S. The first four S are in place but nothing yet keeps them there: audits, standard work and leaders checking.']);
 }
 /* checks on the history */
 areas.forEach(function(a){ var pts=H2.filter(function(x){return x.a===a;}); if(pts.length<2) return; var l=pts[pts.length-1], p=pts[pts.length-2], dlt=l.p-p.p;
  if(dlt<=-10) f.push(['warn','<b>'+E(a)+'</b> fell '+F(-dlt,0)+' points, from '+F(p.p,0)+'% to '+F(l.p,0)+'%, at the last audit.']);
  else if(dlt>=10) f.push(['ok','<b>'+E(a)+'</b> rose '+F(dlt,0)+' points to '+F(l.p,0)+'% at the last audit.']);
  var below=0; for(var j=pts.length-1;j>=0&&pts[j].p<tgt;j--) below++; if(below>=3) f.push(['warn','<b>'+E(a)+'</b> has been below target for '+below+' audits in a row.']); });
 if(k===5&&S.g.h.some(function(r){return n(r.s6)>=0;})) f.push(['','Some history rows have a Safety score, but the method is 5S, so it is left out of their totals.']);
 root.querySelector('.fs-out').innerHTML=api.flags(f,'Score the checklist and the checks appear here.');
},
blankX:function(){ return {}; },
example:{f:{area:'Press line 2',date:'2026-09-29',who:'L. Okafor',mode:'6S (5S plus Safety)',tgt:'80',note:'First shift, mid-week'},
 g:{c:[
  {s:'Sort',q:'Only dies and tools for this week\'s jobs are at the presses',sc:'3',fd:'Two obsolete dies behind press 4; red-tagged',ow:'Setup lead'},
  {s:'Sort',q:'No personal items or unneeded paperwork at workstations',sc:'4',fd:'',ow:''},
  {s:'Set in order',q:'Every die cart has a marked, labeled location',sc:'3',fd:'Cart 7 location not marked',ow:'Setup lead'},
  {s:'Set in order',q:'Hand tools on shadow boards; none missing',sc:'2',fd:'Shadow board at press 3 missing 2 wrenches; add sign-out tag',ow:'Line supervisor'},
  {s:'Shine',q:'No oil or slug buildup on the floor around the presses',sc:'2',fd:'Oil under press 2; leak reported to maintenance',ow:'Maintenance'},
  {s:'Shine',q:'Cleaning checklist done and signed for each shift this week',sc:'3',fd:'Second shift missed Friday',ow:'Line supervisor'},
  {s:'Standardize',q:'Visual standards (photos, floor marking) posted and current',sc:'3',fd:'',ow:''},
  {s:'Standardize',q:'Min and max marks on the scrap and slug bins',sc:'2',fd:'Add fill-line labels to the four bins',ow:'Line supervisor'},
  {s:'Sustain',q:'Last two audits\' actions are closed',sc:'1',fd:'3 of 5 actions still open; review at the weekly meeting',ow:'Area manager'},
  {s:'Sustain',q:'Operators can explain the area standard',sc:'2',fd:'New hires not yet trained on the standard',ow:'Trainer'},
  {s:'Safety',q:'Light curtains and guards in place and tested this shift',sc:'4',fd:'',ow:''},
  {s:'Safety',q:'Aisles and exits clear, floor markings intact',sc:'3',fd:'Pallet parked across the yellow line at press 1',ow:'Material handler'}],
 h:[
  {d:'2026-06-30',a:'Press line 2',s1:'2.5',s2:'2',s3:'1.5',s4:'1.5',s5:'1',s6:'3'},
  {d:'2026-06-30',a:'Tool crib',s1:'3',s2:'3',s3:'2.5',s4:'2',s5:'2',s6:'3.5'},
  {d:'2026-07-31',a:'Press line 2',s1:'3',s2:'2.5',s3:'2.5',s4:'2',s5:'1.5',s6:'3'},
  {d:'2026-07-31',a:'Tool crib',s1:'3.5',s2:'3.5',s3:'3',s4:'3',s5:'2.5',s6:'3.5'},
  {d:'2026-08-29',a:'Press line 2',s1:'3.5',s2:'3',s3:'3',s4:'2.5',s5:'2',s6:'3.5'},
  {d:'2026-08-29',a:'Tool crib',s1:'3.5',s2:'3',s3:'2.5',s4:'2.5',s5:'2',s6:'3'}]}}
}
