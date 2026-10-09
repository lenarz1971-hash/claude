{
slug:'force-field-analysis',
sections:[
 {type:'fields',title:'The change',cols:3,hint:'Describe the change as a move from a present state to a desired state. The forces are whatever pushes toward the desired state (driving) or holds things where they are (restraining).',fields:[
  {id:'chg',label:'Proposed change',wide:true,ph:'e.g. Replace paper travelers with digital work instructions'},
  {id:'now',label:'Present state',type:'textarea',rows:2,ph:'How things are today'},
  {id:'want',label:'Desired state',type:'textarea',rows:2,ph:'How things will be after the change'},
  {id:'team',label:'Team',ph:'Names or roles'}]},
 {type:'grid',id:'d',title:'Driving forces (for the change)',rows:3,hint:'Weight each force 1 (weak) to 5 (strong). <b>Action</b> is how you could strengthen it; <b>After</b> is the weight you expect once the action is done. Leave After blank if there is no action.',cols:[
  {id:'f',label:'Driving force',w:260,type:'textarea',rows:1},
  {id:'w',label:'Weight 1–5',type:'number',min:1,max:5},
  {id:'act',label:'Action to strengthen it',w:220,type:'textarea',rows:1},
  {id:'w2',label:'After',type:'number',min:1,max:5,tip:'Expected weight after the action'}]},
 {type:'grid',id:'r',title:'Restraining forces (against the change)',rows:3,hint:'The same scale. Reducing a restraining force usually does more than adding drive: pushing harder tends to raise the resistance.',cols:[
  {id:'f',label:'Restraining force',w:260,type:'textarea',rows:1},
  {id:'w',label:'Weight 1–5',type:'number',min:1,max:5},
  {id:'act',label:'Action to reduce it',w:220,type:'textarea',rows:1},
  {id:'w2',label:'After',type:'number',min:1,max:5,tip:'Expected weight after the action'}]},
 {type:'custom',id:'dia',title:'The force field',hint:'Arrow length is the weight. Driving forces push from the left, restraining forces from the right. A dashed outline shows the weight expected after the actions.',html:'<div class="svgw ff-svg"></div>'},
 {type:'custom',id:'chk',title:'Balance and checks',html:'<div class="stat ff-stat"></div><div class="out ff-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, f=[], bad=[];
 function side(k,name){ return S.g[k].filter(function(r){ return (r.f||'').trim(); }).map(function(r){ var w=n(r.w), w2=n(r.w2);
  if(r.w!==''&&r.w!=null&&!(w>=1&&w<=5&&w%1===0)) bad.push('"'+api.esc(r.f)+'"'); if(r.w2!==''&&r.w2!=null&&!(w2>=1&&w2<=5&&w2%1===0)) bad.push('"'+api.esc(r.f)+'" (after)');
  var ok=w>=1&&w<=5&&w%1===0, ok2=w2>=1&&w2<=5&&w2%1===0;
  return {t:r.f.trim(),w:ok?w:NaN,w2:ok2?w2:(ok?w:NaN),has2:ok2,act:(r.act||'').trim(),side:name}; }); }
 var D=side('d','d'), R=side('r','r');
 function tot(L,k){ return L.reduce(function(a,x){ return a+(isNaN(x[k])?0:x[k]); },0); }
 var dT=tot(D,'w'), rT=tot(R,'w'), dA=tot(D,'w2'), rA=tot(R,'w2'), any2=D.concat(R).some(function(x){ return x.has2; });
 function sg(v){ return (v>0?'+':v<0?'&minus;':'')+Math.abs(v); }
 root.querySelector('.ff-stat').innerHTML='<div><b>'+dT+'</b><span>Driving total</span></div><div><b>'+rT+'</b><span>Restraining total</span></div><div><b>'+sg(dT-rT)+'</b><span>Balance (driving &minus; restraining)</span></div>'+(any2?'<div><b>'+dA+' vs '+rA+'</b><span>Totals after the actions</span></div><div><b>'+sg(dA-rA)+'</b><span>Balance after the actions</span></div>':'');
 var host=root.querySelector('.ff-svg');
 if(!D.length&&!R.length){ host.innerHTML=''; root.querySelector('.ff-out').innerHTML=api.flags(f,'List the forces for and against the change, and weight each one.'); return; }
 /* drawing */
 var U=38, RH=40, W=900, cx=W/2, top=46, rows=Math.max(D.length,R.length,1), H=top+rows*RH+16, g='';
 function wrap(s,max){ var w=String(s).split(/\s+/).filter(Boolean), L=[], cur=''; w.forEach(function(x){ if((cur+' '+x).trim().length>max&&cur){ L.push(cur); cur=x; } else cur=(cur+' '+x).trim(); }); if(cur) L.push(cur); if(L.length>2){ L=L.slice(0,2); L[1]=L[1].slice(0,max-1)+'…'; } return L; }
 function arrow(x0,x1,y,fill,stroke,dash){ var dir=x1>x0?1:-1, hd=Math.min(14,Math.abs(x1-x0)), xb=x1-dir*hd; return '<path d="M'+x0+' '+(y-8)+' H'+xb+' V'+(y-13)+' L'+x1+' '+y+' L'+xb+' '+(y+13)+' V'+(y+8)+' H'+x0+' Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.3"'+(dash?' stroke-dasharray="4 3"':'')+'/>'; }
 function draw(L,left){ L.forEach(function(x,i){ var y=top+i*RH+RH/2, w=isNaN(x.w)?0:x.w, len=w*U, ww=x.w2*U, tail=left?cx-6-len:cx+6+len, head=left?cx-6:cx+6;
  if(x.has2&&x.w2>w) g+=arrow(left?cx-6-ww:cx+6+ww,head,y,'none',left?'#0F3E68':'#C0392B',true);
  if(w) g+=arrow(tail,head,y,left?'#0F3E68':'#C0392B',left?'#0F3E68':'#C0392B',false)+(x.has2&&x.w2<w?arrow(left?cx-6-ww:cx+6+ww,head,y,'none','#fff',true):'')+'<text class="w" x="'+(left?tail+10:tail-10)+'" y="'+(y+4)+'" text-anchor="'+(left?'start':'end')+'">'+w+(x.has2&&x.w2!==w?'&rarr;'+x.w2:'')+'</text>';
  var room=Math.max(left?Math.min(tail,cx-6-(x.has2?ww:0)):W-Math.max(tail,cx+6+(x.has2?ww:0)),60)-14, Ls=wrap(x.t,Math.max(10,Math.floor(room/6)));
  Ls.forEach(function(l,k){ g+='<text x="'+(left?Math.min(tail,cx-6-(x.has2?ww:0))-8:Math.max(tail,cx+6+(x.has2?ww:0))+8)+'" y="'+(y+4+(k-(Ls.length-1)/2)*12)+'" text-anchor="'+(left?'end':'start')+'">'+api.esc(l)+'</text>'; }); }); }
 draw(D,true); draw(R,false);
 var head='<text class="h" x="'+(cx-12)+'" y="16" text-anchor="end">DRIVING FORCES &middot; '+dT+(any2?' &rarr; '+dA:'')+'</text><text class="h r" x="'+(cx+12)+'" y="16">RESTRAINING FORCES &middot; '+rT+(any2?' &rarr; '+rA:'')+'</text><line x1="'+cx+'" x2="'+cx+'" y1="40" y2="'+(H-4)+'" stroke="#9C7C1F" stroke-width="3"/><text class="c" x="'+cx+'" y="34" text-anchor="middle">PRESENT STATE</text>';
 host.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Force field diagram"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.w{font:700 11px \'IBM Plex Mono\',monospace;fill:#fff}.h{font:700 10px \'IBM Plex Mono\',monospace;fill:#0F3E68;letter-spacing:.06em}.h.r{fill:#C0392B}.c{font:700 8.5px \'IBM Plex Mono\',monospace;fill:#9C7C1F;letter-spacing:.06em}</style>'+head+g+'</svg>';
 /* checks */
 if(bad.length) f.push(['warn','Weights must be whole numbers 1 to 5. Check '+bad.join(', ')+'.']);
 var nw=D.concat(R).filter(function(x){ return isNaN(x.w); }); if(nw.length) f.push(['warn',nw.length+' force'+(nw.length>1?'s have':' has')+' no weight and '+(nw.length>1?'are':'is')+' left out of the totals.']);
 if(D.length<2||R.length<2) f.push(['warn','List at least two forces on each side. A one-sided list usually means the team has not yet talked to the people the change affects.']);
 if(D.length&&R.length){ if(dT>rT) f.push(['ok','Driving forces outweigh restraining forces, '+dT+' to '+rT+'. The change has momentum, but the scores are the team\'s judgment; test them with the people affected.']);
  else if(dT===rT) f.push(['warn','The forces are in balance ('+dT+' each). That is why things stay as they are. Something has to shift the balance: reduce a restraining force or strengthen a driving one.']);
  else f.push(['warn','Restraining forces outweigh driving forces, '+rT+' to '+dT+'. As planned, the change is likely to stall. Work on the biggest restraining forces before launch.']); }
 var big=R.filter(function(x){ return x.w>=4&&!x.act; }); if(big.length) f.push(['warn','Strong restraining force'+(big.length>1?'s':'')+' with no action: '+big.map(function(x){ return '<b>'+api.esc(x.t)+'</b>'; }).join(', ')+'. These are the ones to plan for first.']);
 var up=R.filter(function(x){ return x.has2&&x.w2>x.w; }).concat(D.filter(function(x){ return x.has2&&x.w2<x.w; })); if(up.length) f.push(['warn','The after weight goes the wrong way for '+up.map(function(x){ return '<b>'+api.esc(x.t)+'</b>'; }).join(', ')+'. An action should strengthen a driving force or weaken a restraining one.']);
 if(any2){ if(dA>rA) f.push(['','With the actions, the balance moves to '+dA+' against '+rA+'. '+(dT-rT<=0?'That is what turns a stalled change into one that can move.':'')+' Put each action in the project plan with an owner.']);
  else f.push(['warn','Even after the planned actions the restraining forces are '+rA+' against '+dA+'. More, or stronger, actions are needed.']);
  var dg=dA-dT, rg=rT-rA; if(dg>0&&rg>0&&dg>rg) f.push(['','Most of the planned gain comes from adding drive (+'+dg+') rather than reducing resistance (&minus;'+rg+'). Lewin\'s advice is the opposite: removing restraining forces gives a change that lasts.']); }
 else if(D.length&&R.length) f.push(['','Add actions, with the weight you expect after each, to see whether they shift the balance.']);
 root.querySelector('.ff-out').innerHTML=api.flags(f);
},
example:{f:{chg:'Replace paper travelers with digital work instructions on tablets at the assembly stations',now:'Printed travelers and work instructions, updated by hand; changes reach the floor in two to five days',want:'Current instructions on a tablet at every station; changes live the same day; sign-offs recorded electronically',team:'Manufacturing engineer, assembly supervisor, two operators, IT technician, quality engineer'},
 g:{d:[
  {f:'Customer asking for electronic build records',w:'5',act:'',w2:''},
  {f:'Documentation errors found in the last two audits',w:'4',act:'',w2:''},
  {f:'Engineering changes reach the floor the same day',w:'3',act:'Show the change-notice delay data at the kickoff',w2:'4'},
  {f:'Supervisors spend less time chasing paperwork',w:'2',act:'',w2:''}],
  r:[
  {f:'Operators unfamiliar with tablets',w:'4',act:'Hands-on training and one floor champion per shift',w2:'2'},
  {f:'Worry that screens will be used to monitor people',w:'4',act:'Agree in writing with operators what data is collected and why',w2:'2'},
  {f:'Cost of tablets, mounts and licenses',w:'3',act:'Start on one line and fund the rest from the paper savings',w2:'2'},
  {f:'Weak Wi-Fi coverage in the paint area',w:'3',act:'Add two access points before rollout',w2:'1'}]}}
}
