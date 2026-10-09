{
slug:'flowchart-swimlane',
sections:[
 {type:'fields',title:'The process',cols:3,fields:[
  {id:'proc',label:'Process',wide:true,ph:'e.g. Customer return, from call to credit'},
  {id:'start',label:'Starts when',ph:'e.g. Customer calls with a complaint'},
  {id:'end',label:'Ends when',ph:'e.g. Credit note issued'},
  {id:'owner',label:'Process owner'},
  {id:'mode',label:'Draw as',type:'select',opts:['Swimlanes (one lane per department or role)','Simple flowchart (no lanes)']},
  {id:'unit',label:'Time unit',type:'select',opts:['minutes','hours','days']}]},
 {type:'custom',id:'key',title:'Symbols',hint:'Give every step a number and say where it goes next. A decision lists its exits with their answers, for example <b>Yes:5, No:3</b>. An exit back to an earlier step is a loop, usually rework.',html:'<div class="pillrow"><span>OVAL &middot; START OR END</span><span>BOX &middot; PROCESS STEP</span><span>DIAMOND &middot; DECISION</span><span>WAVY BOX &middot; DOCUMENT</span><span>D SHAPE &middot; WAIT OR DELAY</span><span>CIRCLE &middot; INSPECTION</span><span>GOLD DOT &middot; HANDOFF BETWEEN LANES</span></div>'},
 {type:'grid',id:'s',title:'Steps',rows:4,hint:'List the steps in the order they usually happen. <b>Next</b> is the number of the step that follows; leave it blank only on an End. <b>Time</b> is optional and counts working time plus waiting time for the step.',cols:[
  {id:'id',label:'No.',w:50},
  {id:'txt',label:'Step',w:220,type:'textarea',rows:1},
  {id:'type',label:'Symbol',type:'select',opts:['Start or end','Process','Decision','Document','Wait or delay','Inspection']},
  {id:'lane',label:'Lane (who)',w:120},
  {id:'next',label:'Next',w:110,ph:'e.g. 4 or Yes:5, No:3'},
  {id:'t',label:'Time',type:'number',min:0},
  {id:'va',label:'Value added?',type:'select',opts:['Yes','No','Required, not value added']}]},
 {type:'custom',id:'map',title:'The map',html:'<div class="svgw fc-svg"></div>'},
 {type:'custom',id:'chk',title:'What the map shows',html:'<div class="stat fc-stat"></div><div class="out fc-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], rows=S.g.s.filter(function(r){return (r.id||'').trim()||(r.txt||'').trim();});
 var lanesOn=(S.f.mode||'').indexOf('Simple')!==0, unit=S.f.unit||'minutes';
 var byId={}, order=[];
 rows.forEach(function(r){ var id=(r.id||'').trim(); if(!id){ f.push(['warn','"'+api.esc(r.txt)+'" has no step number, so nothing can point to it.']); return; } if(byId[id]) f.push(['warn','Step number <b>'+api.esc(id)+'</b> is used twice.']); else { byId[id]=r; order.push(id); } });
 function exits(r){ return (r.next||'').split(/[,;]+/).map(function(x){ x=x.trim(); if(!x) return null; var m=x.match(/^(.*?)\s*:\s*(\S+)$/); return m?{lab:m[1].trim(),to:m[2]}:{lab:'',to:x}; }).filter(Boolean); }
 var edges=[];
 order.forEach(function(id){ var r=byId[id]; exits(r).forEach(function(e){ if(!byId[e.to]) f.push(['warn','Step <b>'+api.esc(id)+'</b> goes to "'+api.esc(e.to)+'", which is not a step number.']); else edges.push({a:id,b:e.to,lab:e.lab}); }); });
 var lanes=[]; order.forEach(function(id){ var l=lanesOn?((byId[id].lane||'').trim()||'(no lane)'):''; if(lanes.indexOf(l)<0) lanes.push(l); });
 var col={}; order.forEach(function(id,i){ col[id]=i; });
 var host=root.querySelector('.fc-svg');
 if(!order.length){ host.innerHTML=''; root.querySelector('.fc-stat').innerHTML=''; root.querySelector('.fc-out').innerHTML=api.flags(f,'Number the steps and say which step comes next, and the map draws itself.'); return; }
 var LW=lanesOn?120:0, CW=150, BW=118, BH=50, RH=lanesOn?120:130, W=LW+order.length*CW+20, H=lanes.length*RH+40;
 var X=function(id){ return LW+10+col[id]*CW+CW/2; }, Y=function(id){ var l=lanesOn?((byId[id].lane||'').trim()||'(no lane)'):''; return 20+lanes.indexOf(l)*RH+RH/2; };
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Process map"><defs><marker id="fca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4A5D71"/></marker></defs><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ln{font:700 11px Archivo,sans-serif;fill:#0F3E68}.el{font:600 10px \'IBM Plex Mono\',monospace;fill:#9C7C1F}.no{font:700 9px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 if(lanesOn) lanes.forEach(function(l,i){ var y=20+i*RH; g+='<rect x="0" y="'+y+'" width="'+W+'" height="'+RH+'" fill="'+(i%2?'#F7F6F1':'#fff')+'" stroke="#DCDFD8"/><rect x="0" y="'+y+'" width="'+LW+'" height="'+RH+'" fill="#EEF2F6" stroke="#DCDFD8"/>'+wrapText(l,LW/2,y+RH/2,LW-12,'ln'); });
 var hand=0, loops=0;
 function hw(id){ var t=byId[id].type; return t==='Inspection'?40:t==='Decision'?BW/2+4:BW/2; }
 function hh(id){ var t=byId[id].type; return t==='Inspection'?40:t==='Decision'?BH/2+8:BH/2; }
 edges.forEach(function(e){
  var x1=X(e.a), y1=Y(e.a), x2=X(e.b), y2=Y(e.b), back=col[e.b]<=col[e.a], d, dec=byId[e.a].type==='Decision', xm=x1+hw(e.a)+(dec?30:12);
  if(back){ loops++; var yb=Math.max(y1,y2)+BH/2+14+(loops%3)*6; d='M'+x1+' '+(y1+hh(e.a))+' V'+yb+' H'+x2+' V'+(y2+hh(e.b)+2); }
  else if(y1===y2) d='M'+(x1+hw(e.a))+' '+y1+' H'+(x2-hw(e.b)-2);
  else d='M'+(x1+hw(e.a))+' '+y1+' H'+xm+' V'+y2+' H'+(x2-hw(e.b)-2);
  g+='<path d="'+d+'" fill="none" stroke="'+(back?'#C0392B':'#4A5D71')+'" stroke-width="1.4"'+(back?' stroke-dasharray="5 3"':'')+' marker-end="url(#fca)"/>';
  if(lanesOn&&y1!==y2){ hand++; g+='<circle cx="'+(back?x2:xm)+'" cy="'+(back?y2+hh(e.b)+8:(y1+y2)/2)+'" r="5" fill="#D8B147" stroke="#9C7C1F"/>'; }
  if(e.lab) g+='<text class="el" x="'+(back?x1+5:x1+hw(e.a)+3)+'" y="'+(back?y1+hh(e.a)+12:y1-5)+'">'+api.esc(e.lab.slice(0,8))+'</text>';
 });
 order.forEach(function(id){ var r=byId[id], x=X(id), y=Y(id), t=r.type||'Process', s='';
  var st=' fill="#fff" stroke="#0F3E68" stroke-width="1.6"';
  if(t==='Start or end') s='<rect x="'+(x-BW/2)+'" y="'+(y-BH/2)+'" width="'+BW+'" height="'+BH+'" rx="25"'+st.replace('#fff','#E8EEF4')+'/>';
  else if(t==='Decision') s='<path d="M'+x+' '+(y-BH/2-8)+' L'+(x+BW/2+4)+' '+y+' L'+x+' '+(y+BH/2+8)+' L'+(x-BW/2-4)+' '+y+' Z"'+st.replace('#fff','#FBF5E3')+'/>';
  else if(t==='Document') s='<path d="M'+(x-BW/2)+' '+(y-BH/2)+' H'+(x+BW/2)+' V'+(y+BH/2-6)+' C'+(x+BW/4)+' '+(y+BH/2-16)+' '+(x-BW/4)+' '+(y+BH/2+8)+' '+(x-BW/2)+' '+(y+BH/2-4)+' Z"'+st+'/>';
  else if(t==='Wait or delay') s='<path d="M'+(x-BW/2)+' '+(y-BH/2)+' H'+(x+BW/2-25)+' A25 25 0 0 1 '+(x+BW/2-25)+' '+(y+BH/2)+' H'+(x-BW/2)+' Z"'+st.replace('#fff','#FDECEA')+'/>';
  else if(t==='Inspection') s='<circle cx="'+x+'" cy="'+y+'" r="40"'+st+'/>';
  else s='<rect x="'+(x-BW/2)+'" y="'+(y-BH/2)+'" width="'+BW+'" height="'+BH+'" rx="2"'+st+'/>';
  g+=s+'<text class="no" x="'+(x-BW/2+3)+'" y="'+(y-hh(id)-3)+'">'+api.esc(id)+'</text>'+wrapText(r.txt||'',x,y,t==='Decision'?BW-34:t==='Inspection'?72:BW-12,'');
 });
 host.innerHTML=g+'</svg>';
 function wrapText(s,cx,cy,w,cls){ var words=String(s).split(/\s+/).filter(Boolean), lines=[], cur='', max=Math.max(6,Math.floor(w/6.4));
  words.forEach(function(wd){ if((cur+' '+wd).trim().length>max&&cur){ lines.push(cur); cur=wd; } else cur=(cur+' '+wd).trim(); }); if(cur) lines.push(cur);
  if(lines.length>3){ lines=lines.slice(0,3); lines[2]=lines[2].slice(0,max-1)+'…'; }
  return lines.map(function(l,i){ return '<text'+(cls?' class="'+cls+'"':'')+' x="'+cx+'" y="'+(cy+(i-(lines.length-1)/2)*13+4)+'" text-anchor="middle">'+api.esc(l)+'</text>'; }).join(''); }
 /* checks */
 var into={}; edges.forEach(function(e){ into[e.b]=(into[e.b]||0)+1; });
 var starts=order.filter(function(id){ return byId[id].type==='Start or end'&&!into[id]; });
 var ends=order.filter(function(id){ return !exits(byId[id]).length; });
 if(!starts.length) f.push(['warn','No Start shape with nothing flowing into it. Say where the process begins.']);
 ends.forEach(function(id){ if(byId[id].type!=='Start or end') f.push(['warn','Step <b>'+api.esc(id)+'</b> goes nowhere. Give it a Next, or make it an End.']); });
 order.forEach(function(id){ var r=byId[id], k=exits(r).length;
  if(r.type==='Decision'&&k<2) f.push(['warn','Decision <b>'+api.esc(id)+'</b> has '+k+' exit'+(k===1?'':'s')+'. A decision needs at least two, one per answer.']);
  if(r.type==='Decision'&&!/\?\s*$/.test(r.txt||'')) f.push(['','Decision <b>'+api.esc(id)+'</b>: write it as a question with one answer per exit, for example "Part in tolerance?"']);
  if(r.type!=='Decision'&&k>1) f.push(['warn','Step <b>'+api.esc(id)+'</b> has '+k+' exits but is not a decision. Who decides which way it goes?']); });
 var seen={}, q=starts.length?starts.slice():[order[0]]; while(q.length){ var c=q.shift(); if(seen[c]) continue; seen[c]=1; edges.forEach(function(e){ if(e.a===c) q.push(e.b); }); }
 var orphan=order.filter(function(id){ return !seen[id]; }); if(orphan.length) f.push(['warn','No path from the start reaches step'+(orphan.length>1?'s ':' ')+'<b>'+orphan.map(api.esc).join(', ')+'</b>.']);
 if(loops) f.push(['',loops+' loop'+(loops>1?'s':'')+' back to an earlier step (red dashed). Loops are usually rework or a hidden factory: ask how often each one is taken.']);
 if(lanesOn&&hand) f.push(['',hand+' handoff'+(hand>1?'s':'')+' between lanes (gold dots). Each handoff is a place where work waits, and information gets lost.']);
 var tot=0, va=0, wait=0, nv=0; order.forEach(function(id){ var r=byId[id], t=n(r.t); if(isNaN(t)) return; tot+=t; if(r.va==='Yes') va+=t; if(r.type==='Wait or delay') wait+=t; if(r.va==='No') nv+=t; });
 var stat='<div><b>'+order.length+'</b><span>Steps</span></div><div><b>'+order.filter(function(id){return byId[id].type==='Decision';}).length+'</b><span>Decisions</span></div>'+(lanesOn?'<div><b>'+hand+'</b><span>Handoffs</span></div><div><b>'+lanes.length+'</b><span>Lanes</span></div>':'')+'<div><b>'+loops+'</b><span>Loops</span></div>';
 if(tot>0){ stat+='<div><b>'+api.fmt(tot,0)+'</b><span>Total time, '+unit+'</span></div><div><b>'+api.fmt(100*va/tot,0)+'%</b><span>Value-added share</span></div>';
  if(va/tot<0.25) f.push(['','Only '+api.fmt(100*va/tot,0)+'% of the time is value added'+(wait?' and '+api.fmt(100*wait/tot,0)+'% is waiting':'')+'. That is common: most of a process is the work waiting between steps.']); }
 root.querySelector('.fc-stat').innerHTML=stat;
 root.querySelector('.fc-out').innerHTML=api.flags(f);
},
example:{f:{proc:'Customer return, from call to credit',start:'Customer calls about a faulty unit',end:'Credit note issued or claim declined',owner:'Customer service manager',mode:'Swimlanes (one lane per department or role)',unit:'hours'},
 g:{s:[
  {id:'1',txt:'Customer calls about a faulty unit',type:'Start or end',lane:'Customer service',next:'2',t:'0.2',va:'Required, not value added'},
  {id:'2',txt:'Log complaint and issue RMA number',type:'Document',lane:'Customer service',next:'3',t:'0.5',va:'Required, not value added'},
  {id:'3',txt:'Unit waits in receiving',type:'Wait or delay',lane:'Receiving',next:'4',t:'40',va:'No'},
  {id:'4',txt:'Inspect and test returned unit',type:'Inspection',lane:'Quality',next:'5',t:'2',va:'Yes'},
  {id:'5',txt:'Fault confirmed?',type:'Decision',lane:'Quality',next:'Yes:6, No:9',t:'0.2',va:'Yes'},
  {id:'6',txt:'Approve credit',type:'Process',lane:'Finance',next:'7',t:'24',va:'No'},
  {id:'7',txt:'Details complete?',type:'Decision',lane:'Finance',next:'Yes:8, No:2',t:'0.5',va:'No'},
  {id:'8',txt:'Issue credit note',type:'Start or end',lane:'Finance',next:'',t:'0.5',va:'Yes'},
  {id:'9',txt:'Return unit, explain finding',type:'Start or end',lane:'Customer service',next:'',t:'1',va:'Yes'}]}}
}
