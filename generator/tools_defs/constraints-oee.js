{
slug:'constraints-oee',
sections:[
 {type:'fields',title:'Process and demand',cols:3,fields:[
  {id:'proc',label:'Process or value stream',wide:true},
  {id:'dem',label:'Demand, units per hour',type:'number',min:0,hint:'What the customer or the schedule needs.'},
  {id:'unit',label:'Unit name',ph:'units',hint:'Orders, parts, patients, cases.'}]},
 {type:'grid',id:'s',title:'Process steps in flow order',rows:4,hint:'Enter each step\'s capacity per hour, or its cycle time in seconds per unit and the tool converts it. Use the rate the step actually achieves, after its normal losses, not the nameplate rate. If a step has several machines or people in parallel, enter the combined capacity.',cols:[
  {id:'n',label:'Step',w:190,type:'textarea',rows:1},
  {id:'cap',label:'Capacity per hour',type:'number',min:0},
  {id:'ct',label:'or cycle time sec',type:'number',min:0},
  {id:'ec',label:'Capacity used',calc:function(r,api){var c=api.num(r.cap),t=api.num(r.ct),v=c>0?c:(t>0?3600/t:NaN);return isNaN(v)?'':api.fmt(v,0)+'/hr';}},
  {id:'ld',label:'Demand load',tip:'Demand divided by capacity. Over 100% means the step cannot meet demand.',calc:function(r,api){var d=api.num(api.state().f.dem),c=api.num(r.cap),t=api.num(r.ct),v=c>0?c:(t>0?3600/t:NaN);return isNaN(v)||!(d>0)?'':(d/v*100).toFixed(0)+'%';}},
  {id:'ut',label:'Utilization',tip:'Expected throughput (the lower of demand and constraint capacity) divided by this step\'s capacity.',calc:function(r,api){var S=api.state(),cp=function(x){var c=api.num(x.cap),t=api.num(x.ct);return c>0?c:(t>0?3600/t:NaN);},m=Infinity;S.g.s.forEach(function(x){var v=cp(x);if(v<m)m=v;});var v=cp(r),d=api.num(S.f.dem),tp=d>0?Math.min(d,m):m;return isNaN(v)||m===Infinity?'':(tp/v*100).toFixed(0)+'%';}}]},
 {type:'custom',id:'tc',title:'Constraint and throughput',html:'<div class="stat co-stat"></div><div class="svgw co-chart"></div><div class="out co-out"></div><ol class="co-5"></ol>'},
 {type:'fields',title:'OEE for the constraint or a chosen machine',cols:3,hint:'Planned production time is the shift time minus planned stops such as breaks and planned maintenance. Downtime is unplanned stops plus setups and changeovers inside planned time. Ideal cycle time is the fastest the machine is designed to run, in seconds per unit.',fields:[
  {id:'m',label:'Machine or cell',wide:true},
  {id:'ppt',label:'Planned production time, minutes',type:'number',min:0},
  {id:'dt',label:'Downtime, minutes',type:'number',min:0},
  {id:'ict',label:'Ideal cycle time, seconds per unit',type:'number',min:0},
  {id:'tot',label:'Total count (all units made)',type:'number',min:0},
  {id:'good',label:'Good count (right first time)',type:'number',min:0}]},
 {type:'custom',id:'oee',title:'OEE result',html:'<div class="stat oe-stat"></div><div class="out oe-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], D=n(S.f.dem), U=api.esc(S.f.unit||'units'), steps=[], part=[];
 S.g.s.forEach(function(r,i){ var c=n(r.cap), t=n(r.ct), v=c>0?c:(t>0?3600/t:NaN), lab=r.n?api.esc(r.n):'Step '+(i+1);
  if(!r.n&&isNaN(c)&&isNaN(t)) return;
  if(isNaN(v)){ part.push(lab); return; }
  if(c>0&&t>0&&Math.abs(3600/t-c)/c>0.02) f.push(['warn',lab+': capacity '+api.fmt(c,0)+'/hr and cycle time '+t+' s ('+api.fmt(3600/t,0)+'/hr) disagree. The tool uses the capacity per hour.']);
  steps.push({lab:lab,raw:r.n||('Step '+(i+1)),cap:v}); });
 var st=root.querySelector('.co-stat'), ch=root.querySelector('.co-chart'), five=root.querySelector('.co-5');
 if(!steps.length){ st.innerHTML=''; ch.innerHTML=''; ch.style.display='none'; five.innerHTML='';
  root.querySelector('.co-out').innerHTML=api.flags(part.length?[['warn','Give a capacity or cycle time for '+part.join(', ')+'.']]:[],'Enter the process steps with a capacity or cycle time for each.'); }
 else {
  var con=steps.reduce(function(a,b){return b.cap<a.cap?b:a;}), TP=D>0?Math.min(D,con.cap):con.cap;
  st.innerHTML='<div><b>'+api.esc(con.raw)+'</b><span>Constraint (lowest capacity)</span></div><div><b>'+api.fmt(con.cap,0)+'/hr</b><span>System capacity</span></div><div><b>'+(D>0?api.fmt(D,0)+'/hr':'—')+'</b><span>Demand</span></div><div><b>'+api.fmt(TP,0)+'/hr</b><span>Expected throughput</span></div>';
  var W=640, bh=28, H=steps.length*bh+64, x0=170, x1=W-70, mx=Math.max(D>0?D:0, Math.max.apply(null,steps.map(function(s){return s.cap;})))*1.08, sx=function(v){return x0+(x1-x0)*v/mx;};
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Capacity by step against demand"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.v{font:600 11.5px \'IBM Plex Mono\',monospace;fill:#0F3E68}.s{font-size:11px;fill:#4A5D71}</style>';
  g+='<text x="'+x0+'" y="16" font-weight="700">Capacity per hour by step</text>';
  steps.forEach(function(s,i){ var y=28+i*bh, lab=s.raw.length>24?s.raw.slice(0,23)+'…':s.raw, w=sx(s.cap)-x0, isC=s===con;
   g+='<text x="'+(x0-8)+'" y="'+(y+15)+'" text-anchor="end"'+(isC?' font-weight="700"':'')+'>'+api.esc(lab)+'</text><rect x="'+x0+'" y="'+y+'" width="'+w+'" height="20" fill="'+(isC?(D>con.cap?'#C0392B':'#D8B147'):'#0F3E68')+'"/><text class="v" x="'+(D>0&&x0+w+45>sx(D)&&x0+w<sx(D)+4?sx(D)+6:x0+w+5)+'" y="'+(y+15)+'">'+api.fmt(s.cap,0)+'</text>'; });
  if(D>0) g+='<line x1="'+sx(D)+'" y1="24" x2="'+sx(D)+'" y2="'+(28+steps.length*bh)+'" stroke="#16273A" stroke-width="2" stroke-dasharray="5 3"/><text class="s" x="'+sx(D)+'" y="'+(H-14)+'" text-anchor="middle">Demand '+api.fmt(D,0)+'/hr</text>';
  g+='</svg>'; ch.innerHTML=g; ch.style.display='';
  f.unshift(['ok','The constraint is <b>'+con.lab+'</b> at '+api.fmt(con.cap,0)+' '+U+' per hour. The whole process can deliver no more than that, whatever the other steps can do.']);
  if(!(D>0)) f.push(['warn','Enter demand per hour to see whether the constraint is inside the process or in the market.']);
  else if(D>con.cap) f.push(['warn','Demand of '+api.fmt(D,0)+'/hr exceeds the constraint by '+api.fmt(D-con.cap,0)+' '+U+' per hour ('+((D-con.cap)/D*100).toFixed(1)+'% short). This is an internal, physical constraint: every hour lost at '+con.lab+' is an hour of output lost to the whole system.']);
  else f.push(['','Every step has at least as much capacity as the demand of '+api.fmt(D,0)+'/hr, so the constraint is the market (or a policy such as batch size or a release rule), not equipment. Raising capacity will not raise sales; look at demand and policy constraints.']);
  var others=steps.filter(function(s){return s!==con;}).sort(function(a,b){return a.cap-b.cap;});
  if(others.length&&(others[0].cap-con.cap)/con.cap<0.1) f.push(['warn','<b>'+others[0].lab+'</b> ('+api.fmt(others[0].cap,0)+'/hr) is within 10% of the constraint. Elevate the constraint and the constraint moves there almost at once; plan both together.']);
  var spare=others.filter(function(s){return s.cap>=con.cap*1.3;});
  if(spare.length) f.push(['','Local optimum warning: '+spare.map(function(s){return s.lab;}).join(', ')+' '+(spare.length>1?'have':'has')+' at least 30% more capacity than the constraint. Improving '+(spare.length>1?'them':'it')+' adds no throughput; at best it frees operating expense, at worst it builds inventory in front of the constraint.']);
  if(part.length) f.push(['warn','No capacity or cycle time for '+part.join(', ')+'. Those steps are left out.']);
  f.push(['','Utilization column: only the constraint should run near 100%. The other steps should have idle time by design; keeping them busy only builds work-in-process.']);
  var cn=con.lab;
  five.innerHTML='<li><b>Identify</b> the constraint: '+cn+'.</li><li><b>Exploit</b> it: never let '+cn+' wait for work, people or material; run it through breaks; check quality before it, not after.</li><li><b>Subordinate</b> everything else: release work at the pace of '+cn+' (drum-buffer-rope), not at the pace of the fastest step.</li><li><b>Elevate</b> it: only if still short, add capacity at '+cn+' (overtime, another machine, offloading work).</li><li><b>Repeat</b>: when the constraint moves, start again, and do not let inertia or old policies become the new constraint.</li>';
 }
 root.querySelector('.co-out').innerHTML=steps.length?api.flags(f):root.querySelector('.co-out').innerHTML;
 var q=[], P=n(S.f.ppt), DT=n(S.f.dt), IC=n(S.f.ict), TC=n(S.f.tot), GC=n(S.f.good), os=root.querySelector('.oe-stat');
 var any=[P,DT,IC,TC,GC].some(function(v){return !isNaN(v);});
 if(P>0&&DT>=0&&DT<=P&&IC>0&&TC>=0&&GC>=0&&GC<=TC&&(TC>0||DT===P)){
  var run=P-DT, A=run/P, Pf=run>0?IC*TC/(run*60):NaN, Q=TC>0?GC/TC:NaN, O=(run>0&&TC>0)?A*Pf*Q:0, gph=GC/(P/60);
  var pc=function(v){return isNaN(v)?'—':(v*100).toFixed(1)+'%';};
  os.innerHTML='<div><b>'+api.fmt(run,0)+' min</b><span>Run time</span></div><div><b>'+pc(A)+'</b><span>Availability</span></div><div><b>'+pc(Pf)+'</b><span>Performance</span></div><div><b>'+pc(Q)+'</b><span>Quality</span></div><div><b>'+pc(O)+'</b><span>OEE</span></div>';
  var M=S.f.m?api.esc(S.f.m):'This machine';
  q.push([O>=0.85?'ok':'','<b>'+M+'</b>: OEE = '+pc(A)+' × '+pc(Pf)+' × '+pc(Q)+' = <b>'+pc(O)+'</b>.'+(run===0?' Downtime used all of the planned time, so availability and OEE are zero and performance cannot be calculated.':'')+' Good output was '+api.fmt(gph,0)+' per planned hour against an ideal of '+api.fmt(3600/IC,0)+' per hour.']);
  if(run===0&&TC>0) q.push(['warn','Units are counted but downtime equals planned time. Either some run time is missing or the counts belong to another period.']);
  if(Pf>1) q.push(['warn','Performance is over 100%. The machine cannot run faster than its ideal cycle time, so the ideal cycle time entered is too long (or the count includes units from outside the run time).']);
  var lo=[['Availability',A],['Performance',Pf],['Quality',Q]].filter(function(z){return !isNaN(z[1]);}).sort(function(a,b){return a[1]-b[1];})[0];
  q.push(['','The biggest loss is in <b>'+lo[0].toLowerCase()+'</b> ('+(lo[1]*100).toFixed(1)+'%). Losses in time: downtime '+api.fmt(DT,0)+' min; speed loss '+api.fmt(Math.max(0,run-IC*TC/60),0)+' min; quality loss '+api.fmt(IC*(TC-GC)/60,0)+' min of ideal running time spent on rejects.']);
  if(steps.length&&S.f.m&&S.f.m.trim().toLowerCase()===String(steps.reduce(function(a,b){return b.cap<a.cap?b:a;}).raw).trim().toLowerCase()) q.push(['','This is the constraint, so each point of OEE gained here is about '+api.fmt(3600/IC/100,1)+' more good units per hour for the whole process. OEE gains on a non-constraint machine do not raise system output.']);
  q.push(['','The six big losses map onto the three factors: availability (breakdowns; setup and adjustment), performance (idling and minor stops; reduced speed) and quality (process defects; reduced yield at start-up).']);
  q.push(['','An OEE of 85% is often cited as world class, a figure usually attributed to Seiichi Nakajima\'s TPM work. Treat it as a reference point, not a target for every machine: compare a machine with its own history.']);
 } else {
  os.innerHTML='';
  if(any){
   if(P>0&&DT>P) q.push(['warn','Downtime cannot be more than planned production time.']);
   if(DT<0||TC<0||GC<0) q.push(['warn','Times and counts cannot be negative.']);
   if(P>0&&DT<P&&TC===0) q.push(['warn','Total count is zero with run time available. Enter the units made to calculate performance and quality.']);
   if(TC>0&&GC>TC) q.push(['warn','Good count cannot be more than total count.']);
   if(!q.length) q.push(['warn','Enter planned production time, downtime, ideal cycle time, total count and good count to calculate OEE.']);
  }
 }
 root.querySelector('.oe-out').innerHTML=api.flags(q,'Enter the five OEE inputs above.');
},
example:{f:{proc:'Outbound order fulfillment, Meridian Logistics distribution center, day shift',dem:'420',unit:'orders',m:'Pack and bag',ppt:'480',dt:'62',ict:'6',tot:'3270',good:'3200'},
 g:{s:[
  {n:'Release and wave planning',cap:'1500',ct:''},
  {n:'Pick',cap:'520',ct:''},
  {n:'Pack and bag',cap:'',ct:'9'},
  {n:'Label and sort',cap:'1100',ct:''},
  {n:'Load trucks',cap:'650',ct:''}]}}
}
