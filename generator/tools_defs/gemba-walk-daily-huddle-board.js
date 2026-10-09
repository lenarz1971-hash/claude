{
slug:'gemba-walk-daily-huddle-board',
sections:[
 {type:'fields',title:'The board',cols:3,hint:'One board per team. A tier 1 huddle is the team at the start of the shift; tier 2 is the area leaders with what tier 1 could not solve; tier 3 is the site leaders.',fields:[
  {id:'team',label:'Team or area',ph:'e.g. Valve body cell 7'},
  {id:'tier',label:'Huddle tier',type:'select',opts:['Tier 1: team','Tier 2: area or department','Tier 3: site']},
  {id:'when',label:'Huddle time and length',ph:'e.g. 06:45, 10 minutes, at the board'},
  {id:'lead',label:'Huddle leader'},
  {id:'week',label:'Week starting (Monday)',type:'date'},
  {id:'asof',label:'Status as of',type:'date',hint:'Leave blank for today.'},
  {id:'esc',label:'Escalate open actions older than (days)',type:'number',min:1,ph:'7'}]},
 {type:'grid',id:'k',title:'Huddle KPIs: safety, quality, delivery, cost, people',rows:4,hint:'One row per measure, with the daily result. A day is <b>green</b> when it meets the target and <b>red</b> when it does not; there is no amber on a huddle board. Keep it to what the team can affect today.',cols:[
  {id:'cat',label:'Category',type:'select',opts:['Safety','Quality','Delivery','Cost','People']},
  {id:'m',label:'Measure',w:180},
  {id:'dir',label:'Better when',type:'select',opts:['Higher','Lower']},
  {id:'t',label:'Target',type:'number'},
  {id:'d1',label:'Mon',type:'number'},{id:'d2',label:'Tue',type:'number'},{id:'d3',label:'Wed',type:'number'},{id:'d4',label:'Thu',type:'number'},{id:'d5',label:'Fri',type:'number'},
  {id:'now',label:'Latest',calc:function(r,api){ var s=window.TOOL._days(r,api), l=null; s.forEach(function(x){ if(x) l=x; }); return l?'<span class="gh-p '+l+'">'+(l==='g'?'Green':'Red')+'</span>':''; }},
  {id:'red',label:'Red days',calc:function(r,api){ var s=window.TOOL._days(r,api); if(!s.some(Boolean)) return ''; return String(s.filter(function(x){return x==='r';}).length); }}]},
 {type:'custom',id:'board',title:'The board',hint:'Green met the target, red missed it, blank means no result was posted.',html:'<div class="svgw gh-board"></div>'},
 {type:'grid',id:'o',title:'Gemba observations and actions',rows:4,hint:'Go and see. Write what you saw, where and when, as a fact someone else could check, not an opinion of a person. Then the gap to the standard, one action, one owner and a due date. Age counts from the day it was seen.',cols:[
  {id:'seen',label:'Seen',type:'date'},
  {id:'where',label:'Where',w:100},
  {id:'obs',label:'What was seen',w:220,type:'textarea',rows:1},
  {id:'cat',label:'Category',type:'select',opts:['Safety','Quality','Delivery','Cost','People','5S or standard work']},
  {id:'gap',label:'Problem: gap to standard',w:170,type:'textarea',rows:1},
  {id:'act',label:'Action (countermeasure)',w:190,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:100},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Open','In progress','Done','Escalated']},
  {id:'done',label:'Closed on',type:'date'},
  {id:'age',label:'Age (days)',calc:function(r,api){ var a=window.TOOL._age(r,api); if(a==null) return ''; var lim=window.TOOL._lim(api); return (r.st!=='Done'&&a>lim)?'<span class="bad">'+a+'</span>':String(a); }}]},
 {type:'custom',id:'aging',title:'Open actions by age',hint:'Each bar is one open action. The dashed line is the escalation limit; anything past it moves up a tier.',html:'<div class="svgw gh-age"></div><div class="stat gh-stat"></div>'},
 {type:'custom',id:'chk',title:'For the huddle',html:'<div class="out gh-out"></div>'}
],
_days:function(r,api){ var t=api.num(r.t), out=[]; for(var i=1;i<=5;i++){ var v=api.num(r['d'+i]); out.push(isNaN(v)||isNaN(t)?'':((r.dir==='Lower'?v<=t:v>=t)?'g':'r')); } return out; },
_asof:function(api){ var a=api.state().f.asof; return /^\d{4}-\d\d-\d\d$/.test(a||'')?a:api.today(); },
_lim:function(api){ var x=api.num(api.state().f.esc); return x>0?x:7; },
_dd:function(a,b){ return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5); },
_age:function(r,api){ var T=window.TOOL; if(!/^\d{4}-\d\d-\d\d$/.test(r.seen||'')) return null; if(r.st==='Done') return /^\d{4}-\d\d-\d\d$/.test(r.done||'')?T._dd(r.seen,r.done):null; return T._dd(r.seen,T._asof(api)); },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, esc=api.esc, n=api.num, f=[], asof=T._asof(api), lim=T._lim(api);
 var aso=root.querySelector('[data-f="asof"]'); if(aso){ aso.classList.add('autoval'); aso.placeholder=api.today(); }
 var K=S.g.k.filter(function(r){return r.m;}), O=S.g.o.filter(function(r){return r.obs||r.act;});
 /* board */
 var bd=root.querySelector('.gh-board');
 if(K.length){
  var W=760, L=250, cw=78, rh=34, H=K.length*rh+36, days=['MON','TUE','WED','THU','FRI'];
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Huddle board"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:700 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.c{font:800 15px Archivo,sans-serif;fill:#fff}.v{font:600 12px \'IBM Plex Mono\',monospace;fill:#fff}.e{font:600 12px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
  g+='<text class="ax" x="'+(L+10)+'" y="20" text-anchor="middle">TARGET</text>'; days.forEach(function(d,i){ g+='<text class="ax" x="'+(L+60+i*cw+cw/2)+'" y="20" text-anchor="middle">'+d+'</text>'; });
  K.forEach(function(r,j){ var y=28+j*rh, s=T._days(r,api), m=String(r.m); if(m.length>28) m=m.slice(0,27)+'…';
   g+='<rect x="0" y="'+y+'" width="28" height="'+(rh-4)+'" fill="#0F3E68"/><text class="c" x="14" y="'+(y+21)+'" text-anchor="middle">'+esc((r.cat||'?').charAt(0))+'</text>';
   g+='<text x="36" y="'+(y+19)+'">'+esc(m)+'</text><text class="ax" x="'+(L+10)+'" y="'+(y+19)+'" text-anchor="middle">'+(r.dir==='Lower'?'≤ ':'≥ ')+esc(r.t||'—')+'</text>';
   for(var i=0;i<5;i++){ var x=L+60+i*cw, v=r['d'+(i+1)]; g+='<rect x="'+(x+3)+'" y="'+y+'" width="'+(cw-6)+'" height="'+(rh-4)+'" fill="'+(s[i]==='g'?'#1F8C55':s[i]==='r'?'#C0392B':'#F4F6F8')+'" stroke="#C6CDD3" stroke-width="'+(s[i]?0:1)+'"/>'+(String(v||'').trim()!==''?'<text class="'+(s[i]?'v':'e')+'" x="'+(x+cw/2)+'" y="'+(y+19)+'" text-anchor="middle">'+esc(v)+'</text>':''); } });
  bd.innerHTML=g+'</svg>'; bd.style.display='';
 } else { bd.innerHTML=''; bd.style.display='none'; }
 /* aging */
 var op=O.filter(function(r){return r.st!=='Done';}).map(function(r){ return {r:r,a:T._age(r,api)}; }).filter(function(x){return x.a!=null;}).sort(function(a,b){return b.a-a.a;});
 var ag=root.querySelector('.gh-age');
 if(op.length){
  var W2=760, L2=230, R2=40, mx=Math.max(lim*1.25,op[0].a,1), sc=(W2-L2-R2)/mx, rh2=26, H2=op.length*rh2+40;
  var g2='<svg viewBox="0 0 '+W2+' '+H2+'" role="img" aria-label="Open actions by age"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}.v{font:700 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
  op.forEach(function(x,i){ var y=6+i*rh2, lab=String(x.r.act||x.r.obs); if(lab.length>32) lab=lab.slice(0,31)+'…'; var over=x.a>lim;
   g2+='<text x="'+(L2-8)+'" y="'+(y+15)+'" text-anchor="end">'+esc(lab)+'</text><rect x="'+L2+'" y="'+(y+4)+'" width="'+Math.max(x.a*sc,2)+'" height="15" fill="'+(over?'#C0392B':x.r.st==='Escalated'?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(L2+Math.max(x.a*sc,2)+5)+'" y="'+(y+16)+'">'+x.a+'</text>'; });
  var yb=6+op.length*rh2; g2+='<line x1="'+(L2+lim*sc)+'" y1="2" x2="'+(L2+lim*sc)+'" y2="'+yb+'" stroke="#C0392B" stroke-width="1.4" stroke-dasharray="5 4"/><text class="ax" x="'+(L2+lim*sc)+'" y="'+(yb+16)+'" text-anchor="middle" style="fill:#C0392B">ESCALATE AFTER '+lim+' DAYS</text><text class="ax" x="'+L2+'" y="'+(yb+30)+'">DAYS OPEN AS OF '+esc(asof)+'</text>';
  ag.innerHTML=g2+'</svg>'; ag.style.display='';
 } else { ag.innerHTML=''; ag.style.display='none'; }
 var closed=O.filter(function(r){return r.st==='Done';}).map(function(r){return T._age(r,api);}).filter(function(a){return a!=null;});
 var med=NaN; if(closed.length){ closed.sort(function(a,b){return a-b;}); var m=closed.length; med=m%2?closed[(m-1)/2]:(closed[m/2-1]+closed[m/2])/2; }
 var late=O.filter(function(r){return r.st!=='Done'&&r.due&&r.due<asof;});
 var reds=K.filter(function(r){ var s=T._days(r,api), l=''; s.forEach(function(x){ if(x) l=x; }); return l==='r'; });
 root.querySelector('.gh-stat').innerHTML=(K.length||O.length)?'<div><b>'+reds.length+' of '+K.length+'</b><span>KPIs red at latest</span></div><div><b>'+op.length+'</b><span>Open actions</span></div><div><b>'+op.filter(function(x){return x.a>lim;}).length+'</b><span>Older than '+lim+' days</span></div><div><b>'+late.length+'</b><span>Past due</span></div><div><b>'+(op.length?op.reduce(function(a,x){return a+x.a;},0)/op.length:NaN).toFixed(1).replace('NaN','—')+'</b><span>Mean age, open (days)</span></div><div><b>'+(isNaN(med)?'—':api.fmt(med,1))+'</b><span>Median days to close</span></div>':'';
 /* checks */
 if(!K.length&&!O.length){ root.querySelector('.gh-out').innerHTML=api.flags([],'Add the KPIs and the observations, and the huddle points appear here.'); return; }
 var cats=['Safety','Quality','Delivery','Cost']; var missing=cats.filter(function(c){return !K.some(function(r){return r.cat===c;});}); if(K.length&&missing.length) f.push(['','No '+missing.join(', ').toLowerCase()+' measure on the board. Most boards start with safety, quality, delivery and cost (SQDC), then add people.']);
 if(K.length>8) f.push(['warn',K.length+' measures. A huddle of ten minutes cannot discuss more than about six; move the rest to a weekly review.']);
 K.forEach(function(r){ var s=T._days(r,api), id='<b>'+esc(r.m)+'</b>';
  if(isNaN(n(r.t))) { f.push(['warn',id+' has no target, so the day cannot be called green or red.']); return; }
  var run=0; for(var i=s.length-1;i>=0;i--){ if(s[i]==='') continue; if(s[i]==='r') run++; else break; }
  var nr=s.filter(function(x){return x==='r';}).length;
  if(run>=3) f.push(['warn',id+' has been red '+run+' days running. That is a pattern, not a bad day: start problem solving and escalate to the next tier if the team cannot fix it.']);
  else if(nr>=3) f.push(['warn',id+' was red on '+nr+' of 5 days.']);
  var lastR=false; s.forEach(function(x){ if(x) lastR=x==='r'; });
  if(lastR&&!O.some(function(o){return o.cat===r.cat&&o.st!=='Done'&&o.act;})) f.push(['warn',id+' is red and there is no open action in '+esc(String(r.cat||'its category').toLowerCase())+'. Every red needs a countermeasure, an owner and a date, or a note that it is understood.']);
  var gaps=[]; s.forEach(function(x,i){ if(!x&&i<4&&s.slice(i+1).some(Boolean)) gaps.push(['Mon','Tue','Wed','Thu','Fri'][i]); }); if(gaps.length) f.push(['',id+': no result for '+gaps.join(', ')+'. A blank square on the board hides a red as easily as a green.']); });
 var cut=function(x,k){ x=String(x||''); return esc(x.length>k?x.slice(0,k-1).replace(/\s+\S*$/,'')+'…':x); };
 O.forEach(function(r){ var lab='<b>'+cut(r.act||r.obs,50)+'</b>', a=T._age(r,api);
  if(r.obs&&!r.act) f.push(['warn','Observation with no action: <b>'+cut(r.obs,60)+'</b>. Decide: act, add it to a bigger project, or record that no action is needed and why.']);
  if(r.obs&&/\b(lazy|careless|bad attitude|doesn.t care|don.t care|always|never|seems|sloppy)\b/i.test(r.obs)) f.push(['warn','"'+cut(r.obs,60)+'" reads as an opinion or a judgment of a person. Write what was seen: the count, the place, the time. Gemba is about the process, not blame.']);
  if(r.act&&!String(r.who||'').trim()) f.push(['warn',lab+' has no owner.']);
  else if(r.act&&/(,|;|\/|&|\band\b|^team$|^all$)/i.test(String(r.who).trim())) f.push(['warn',lab+' has more than one owner ('+esc(r.who)+'). Name one.']);
  if(r.act&&!r.due&&r.st!=='Done') f.push(['warn',lab+' has no due date.']);
  if(r.st==='Done'&&!r.done) f.push(['',lab+' is done but has no closing date, so its time to close is unknown.']);
  if(r.st!=='Done'&&a!=null&&a>lim&&r.st!=='Escalated') f.push(['warn',lab+' has been open '+a+' days, past the '+lim+'-day limit. Escalate it to the next tier, with what help is needed.']);
  if(r.st!=='Done'&&r.due&&r.due<asof) f.push(['warn',lab+' was due '+esc(r.due)+'.']); });
 if(!O.length) f.push(['','No gemba observations recorded. Leaders who walk the area regularly see problems before they reach the board.']);
 if(K.length&&!reds.length&&!late.length) f.push(['ok','All measures green at the latest result and no actions past due.']);
 f.push(['','Keep the huddle short and standing: what happened yesterday, what is in the way today, who needs help. Problem solving happens after the huddle, with the people who can fix it.']);
 root.querySelector('.gh-out').innerHTML=api.flags(f);
},
example:{f:{team:'Valve body cell 7, day shift',tier:'Tier 1: team',when:'06:45, 10 minutes, at the cell board',lead:'Nadia Petrov, cell lead',week:'2026-10-05',asof:'2026-10-09',esc:'7'},
 g:{k:[
  {cat:'Safety',m:'Injuries (incl. first aid)',dir:'Lower',t:'0',d1:'0',d2:'0',d3:'0',d4:'1',d5:'0'},
  {cat:'Safety',m:'Near misses reported',dir:'Higher',t:'1',d1:'1',d2:'0',d3:'2',d4:'1',d5:'1'},
  {cat:'Quality',m:'First-pass yield %',dir:'Higher',t:'98',d1:'98.4',d2:'97.1',d3:'96.5',d4:'96.8',d5:'97.2'},
  {cat:'Delivery',m:'Output vs plan %',dir:'Higher',t:'100',d1:'102',d2:'95',d3:'99',d4:'101',d5:'100'},
  {cat:'Cost',m:'Scrap cost ($)',dir:'Lower',t:'250',d1:'180',d2:'320',d3:'',d4:'290',d5:'210'},
  {cat:'People',m:'Positions staffed (of 12)',dir:'Higher',t:'12',d1:'12',d2:'11',d3:'12',d4:'12',d5:'10'}],
 o:[
  {seen:'2026-09-24',where:'Station 3 hone',obs:'Coolant concentration read 3% at 07:10; the standard is 5-7%. No check recorded since Monday.',cat:'Quality',gap:'Concentration below standard; daily check not done',act:'Add the coolant check to the start-up checklist and post the refractometer at the station',who:'Ivan Torres',due:'2026-10-01',st:'In progress',done:''},
  {seen:'2026-10-06',where:'Station 5 leak test',obs:'Seven of the 41 first-pass rejects on Tuesday were leak test fails on the same fixture position B',cat:'Quality',gap:'FPY 97.1% against 98%',act:'Check fixture B seal and run the master part on both positions',who:'Ivan Torres',due:'2026-10-08',st:'Done',done:'2026-10-07'},
  {seen:'2026-10-08',where:'Deburr bench',obs:'Operator cut a finger on a burr while unloading; first aid given. Gloves on the bench were the wrong cut level.',cat:'Safety',gap:'Cut-resistant level A4 required; A2 in use',act:'Replace bench gloves with A4 and check the other benches',who:'Nadia Petrov',due:'2026-10-10',st:'Open',done:''},
  {seen:'2026-09-29',where:'Kanban rack',obs:'Two empty kanban cards for O-rings sat in the rack for a full shift',cat:'Delivery',gap:'Cards should be collected every 2 hours',act:'Add card pickup to the water spider route',who:'Sam Okafor',due:'2026-10-03',st:'Escalated',done:''},
  {seen:'2026-10-07',where:'Station 2',obs:'Torque wrench calibration label expired 2026-09-30',cat:'Quality',gap:'Tool out of calibration in use',act:'Quarantine the wrench, swap from the crib, assess parts made since 30 Sep',who:'Ivan Torres',due:'2026-10-07',st:'Done',done:'2026-10-07'},
  {seen:'2026-10-09',where:'Cell entrance',obs:'Second shift seems careless about putting tools back on the shadow board',cat:'5S or standard work',gap:'',act:'',who:'',due:'',st:'Open',done:''}]}}
}
