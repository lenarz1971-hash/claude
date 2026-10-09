{
slug:'training-plan-kirkpatrick',
sections:[
 {type:'fields',title:'Link to strategy',cols:3,fields:[
  {id:'name',label:'Training plan',wide:true,ph:'e.g. Pick accuracy training, second half 2026'},
  {id:'obj',label:'Strategic objective it supports',type:'textarea',wide:true,rows:2},
  {id:'kpi',label:'Business measure: baseline and target',type:'textarea',wide:true,rows:2,hint:'The level 4 result the plan is meant to move.'},
  {id:'own',label:'Plan owner'},
  {id:'start',label:'Plan start',type:'date'},
  {id:'bud',label:'Training budget $',type:'number',min:0}]},
 {type:'grid',id:'c',title:'Courses',rows:3,hint:'Write each objective as what the trainee will be able to <b>do</b>, under what conditions, to what standard. "Understand" and "be aware of" cannot be observed or measured. Cost is the direct cost of the course (trainer, licenses, venue).',cols:[
  {id:'n',label:'Course',w:160,type:'textarea',rows:1},
  {id:'aud',label:'Audience',w:130,type:'textarea',rows:1},
  {id:'obj',label:'Learning objective',w:240,type:'textarea',rows:1},
  {id:'m',label:'Method',type:'select',opts:['Classroom','On-the-job','E-learning','Coaching or mentoring','Simulation','Self-directed']},
  {id:'ppl',label:'People',type:'number',min:0},
  {id:'hrs',label:'Hours each',type:'number',min:0},
  {id:'cost',label:'Cost $',type:'number',min:0},
  {id:'d',label:'Scheduled',type:'date'},
  {id:'th',label:'Total hours',calc:function(r,api){var p=api.num(r.ppl),h=api.num(r.hrs);return isNaN(p)||isNaN(h)?'':api.fmt(p*h,1);}}]},
 {type:'grid',id:'e',title:'Evaluation plan: Kirkpatrick\'s four levels',rows:4,hint:'Plan at least one measure at each level before the training runs. <b>1 Reaction:</b> did they find it relevant and useful? <b>2 Learning:</b> did they gain the knowledge and skill? <b>3 Behavior:</b> do they use it on the job? <b>4 Results:</b> did the business measure move?',cols:[
  {id:'lv',label:'Level',type:'select',opts:['1 Reaction','2 Learning','3 Behavior','4 Results']},
  {id:'ms',label:'Measure and method',w:240,type:'textarea',rows:1},
  {id:'when',label:'When',w:120,type:'textarea',rows:1},
  {id:'dir',label:'Better if',type:'select',opts:['Higher','Lower']},
  {id:'t',label:'Target',type:'number'},
  {id:'a',label:'Actual',type:'number'},
  {id:'st',label:'Status',calc:function(r,api){var t=api.num(r.t),a=api.num(r.a);if(!r.lv&&!r.ms)return '';if(isNaN(t))return '<span class="kp-pd">No target</span>';if(isNaN(a))return '<span class="kp-pd">Pending</span>';var ok=r.dir==='Lower'?a<=t:a>=t;return ok?'<span class="kp-ok">Met</span>':'<span class="kp-no">Below target</span>';}}]},
 {type:'fields',title:'Return on investment (optional): Phillips level 5',cols:2,hint:'Jack Phillips added ROI as a fifth level to Kirkpatrick\'s model. Convert the level 4 result to money, isolate the part caused by the training, and compare with the fully loaded cost. <b>ROI % = (net program benefits ÷ program costs) × 100</b>, where net benefits = benefits − costs.',fields:[
  {id:'ben',label:'Annual monetary benefit of the result $',type:'number',min:0,hint:'Before isolating the effect of training.'},
  {id:'att',label:'Share caused by the training %',type:'number',min:0,max:100,hint:'After isolating other causes such as new equipment or seasonal volume.'},
  {id:'iso',label:'How the training effect was isolated',type:'select',opts:['Control group','Trend line analysis','Participant or manager estimate','Not isolated']},
  {id:'oth',label:'Other program costs $',type:'number',min:0,hint:'Participants\' time, design, materials, evaluation. Course costs above are added to this.'}]},
 {type:'custom',id:'res',title:'Plan summary and checks',html:'<div class="stat kp-stat"></div><div class="svgw kp-chart"></div><div class="out kp-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, esc=api.esc, $=function(v){return (v<0?'−$':'$')+api.fmt(Math.abs(v),0);};
 var C=S.g.c.filter(function(r){return r.n&&r.n.trim();}), E=S.g.e.filter(function(r){return r.lv||(r.ms&&r.ms.trim());});
 var hrs=0, cost=0, f=[];
 C.forEach(function(r){ var p=n(r.ppl),h=n(r.hrs),c=n(r.cost); if(!isNaN(p)&&!isNaN(h)) hrs+=p*h; if(!isNaN(c)) cost+=c; });
 var bud=n(S.f.bud), oth=n(S.f.oth), ben=n(S.f.ben), att=n(S.f.att), tc=cost+(isNaN(oth)?0:oth);
 var roi=NaN, bcr=NaN, nb=NaN;
 if(!isNaN(ben)&&tc>0){ nb=ben*(isNaN(att)?100:att)/100; roi=(nb-tc)/tc*100; bcr=nb/tc; }
 var stat='<div><b>'+C.length+'</b><span>Courses</span></div><div><b>'+api.fmt(hrs,0)+'</b><span>Training hours</span></div><div><b>'+$(cost)+'</b><span>Course costs</span></div>'+
  (isNaN(bud)?'':'<div><b>'+(bud>0?Math.round(cost/bud*100)+'%':'—')+'</b><span>Of budget used</span></div>')+
  (isNaN(roi)?'':'<div><b>'+api.fmt(roi,0)+'%</b><span>ROI (Phillips)</span></div>');
 root.querySelector('.kp-stat').innerHTML=C.length||!isNaN(roi)?stat:'';
 // status per level
 var L=['1 Reaction','2 Learning','3 Behavior','4 Results'], st={};
 E.forEach(function(r){ var t=n(r.t),a=n(r.a),k=r.lv||'?', s=isNaN(t)?'nt':isNaN(a)?'pd':((r.dir==='Lower'?a<=t:a>=t)?'ok':'no'); if(!st[k]) st[k]=[]; st[k].push({r:r,s:s,t:t,a:a}); });
 var W=640, H=290, col={ok:'#1F8C55',no:'#C0392B',pd:'#D8B147',nt:'#D8B147',none:'#fff'}, word={ok:'Met target',no:'Below target',pd:'Pending',nt:'No target set',none:'No measure planned'};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Kirkpatrick levels and status"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.lv{font:700 12px Archivo,sans-serif;fill:#fff}.lvd{font:700 12px Archivo,sans-serif;fill:#16273A}.s{font:600 12px Archivo,sans-serif}</style>';
 var steps=L.concat(isNaN(roi)?[]:['5 ROI']);
 steps.forEach(function(k,i){
  var y=H-14-(i+1)*52, x=20+i*20, w=W-40-i*40, list=st[k]||[], worst='none', txt='';
  if(k==='5 ROI'){ worst=roi>=0?'ok':'no'; txt='ROI '+api.fmt(roi,0)+'%, benefit-cost ratio '+bcr.toFixed(2); }
  else if(list.length){ var ord=['no','nt','pd','ok']; worst=list.map(function(x){return x.s;}).sort(function(a,b){return ord.indexOf(a)-ord.indexOf(b);})[0];
   var x0=list[0]; txt=word[worst]+(isNaN(x0.t)?'':': actual '+(isNaN(x0.a)?'—':api.fmt(x0.a))+' vs target '+api.fmt(x0.t))+(list.length>1?' ('+list.length+' measures)':''); }
  else txt=word.none;
  var fill=worst==='none'?'#fff':(worst==='ok'?'#0F3E68':'#EDEFEA');
  g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="44" fill="'+fill+'" stroke="'+(worst==='none'?'#C0392B':'#C6CDD3')+'"'+(worst==='none'?' stroke-dasharray="5 4"':'')+'/>';
  g+='<rect x="'+x+'" y="'+y+'" width="8" height="44" fill="'+col[worst==='none'?'no':worst]+'"/>';
  g+='<text class="'+(worst==='ok'?'lv':'lvd')+'" x="'+(x+20)+'" y="'+(y+27)+'">LEVEL '+esc(k.toUpperCase())+(k==='5 ROI'?' (PHILLIPS)':'')+'</text>';
  g+='<text class="s" x="'+(x+w-14)+'" y="'+(y+27)+'" text-anchor="end" style="fill:'+(worst==='ok'?'#fff':(worst==='no'||worst==='none'?'#C0392B':'#9C7C1F'))+'">'+esc(txt)+'</text>';
 });
 root.querySelector('.kp-chart').innerHTML=(C.length||E.length)?g+'</svg>':'';
 if(!C.length&&!E.length){ root.querySelector('.kp-out').innerHTML=api.flags([],'Add courses and an evaluation plan and the checks appear here.'); return; }
 // flags
 if(!isNaN(roi)) f.push([roi>=0?'ok':'warn','ROI (Phillips level 5) = ('+$(nb)+' − '+$(tc)+') ÷ '+$(tc)+' × 100 = <b>'+api.fmt(roi,0)+'%</b>. Benefit-cost ratio '+bcr.toFixed(2)+'. Costs are '+$(cost)+' course costs plus '+$(isNaN(oth)?0:oth)+' other program costs'+(isNaN(att)?'':'; benefits are '+api.fmt(att,0)+'% of '+$(ben)+' attributed to the training')+'.']);
 if(!isNaN(ben)&&isNaN(att)) f.push(['warn','No share is attributed to training, so the ROI assumes the training caused 100% of the improvement. Isolate the effect of training from other causes before reporting ROI.']);
 if(!isNaN(roi)&&S.f.iso==='Not isolated') f.push(['warn','The training effect has not been isolated. ROI calculated on the whole improvement overstates what the training did.']);
 if(!isNaN(ben)&&tc<=0) f.push(['warn','Enter program costs to calculate ROI.']);
 var has=function(k){return (st[k]||[]).length>0;};
 if(!has('3 Behavior')&&!has('4 Results')) f.push(['warn','No level 3 (behavior) or level 4 (results) measure is planned. Without them you can show people liked the training and passed a test, but not that anything changed on the job or in the business.']);
 else { if(!has('3 Behavior')) f.push(['warn','No level 3 (behavior) measure is planned. Results cannot be credited to the training without evidence that people changed what they do.']); if(!has('4 Results')) f.push(['warn','No level 4 (results) measure is planned, so the plan cannot show it moved the strategic objective.']); }
 if(!has('1 Reaction')||!has('2 Learning')) f.push(['',(has('1 Reaction')?'Level 2 (learning)':has('2 Learning')?'Level 1 (reaction)':'Levels 1 and 2')+' not planned. Lower levels are cheap to measure and help explain a failure at a higher level.']);
 E.forEach(function(r){ var t=n(r.t),a=n(r.a); if(!isNaN(t)&&!isNaN(a)&&!(r.dir==='Lower'?a<=t:a>=t)) f.push(['warn','Below target at level <b>'+esc(r.lv||'?')+'</b>: '+esc(r.ms||'')+', actual '+api.fmt(a)+' against a target of '+api.fmt(t)+(r.dir==='Lower'?' (lower is better)':'')+'.']); if(isNaN(t)&&(r.ms||'').trim()) f.push(['','<b>'+esc(r.lv||'Measure')+'</b> has no target, so it cannot be judged.']); });
 var ok=function(k){return (st[k]||[]).length&&st[k].every(function(x){return x.s==='ok';});}, no=function(k){return (st[k]||[]).some(function(x){return x.s==='no';});};
 if(ok('2 Learning')&&no('3 Behavior')) f.push(['','People learned (level 2 met) but are not applying it on the job (level 3 below target). Look at the work environment: supervisor reinforcement, time, tools, and what happens when the new method is or is not used. Kirkpatrick treats these "required drivers" as part of the program, not as someone else\'s problem.']);
 if(ok('1 Reaction')&&(no('2 Learning')||no('3 Behavior')||no('4 Results'))) f.push(['','Reaction met target while a higher level did not. A good reaction score shows people liked the training, not that they learned or changed anything.']);
 var vague=/\b(understand|understanding|know|knowledge of|be aware|awareness|appreciate|learn about|familiar|familiarity)\b/i, meas=/\d|\b(demonstrate|perform|complete|identify|calculate|list|resolve|operate|use|apply|pick|set up|measure|inspect|propose|write|explain)\b/i;
 var vg=C.filter(function(r){ var o=(r.obj||'').trim(); return !o||(vague.test(o)&&!/\d/.test(o))||!meas.test(o); });
 if(vg.length) f.push(['warn','Objective'+(vg.length>1?'s':'')+' not measurable as written: '+vg.map(function(r){return '<b>'+esc(r.n)+'</b>'+(r.obj?' ("'+esc(r.obj)+'")':' (blank)');}).join('; ')+'. Rewrite as an observable action with a standard, for example "coach a picker through a scan-verify error using the five-step guide, observed by the manager". (This check looks for vague verbs; it is a prompt, not a judgment.)']);
 if(!isNaN(bud)&&bud>0&&cost>bud) f.push(['warn','Course costs of '+$(cost)+' exceed the budget of '+$(bud)+'.']);
 if(!(S.f.obj||'').trim()) f.push(['warn','No strategic objective recorded. A training plan that is not tied to an objective is hard to defend when budgets are cut.']);
 var nod=C.filter(function(r){return !r.d;}).length; if(nod) f.push(['',nod+' course'+(nod>1?'s have':' has')+' no scheduled date.']);
 root.querySelector('.kp-out').innerHTML=api.flags(f);
},
example:{f:{name:'Ridgeline Distribution, central DC: pick accuracy training, second half 2026',obj:'Network perfect-order rate of 99.5% by the end of 2026 (customer pillar of the three-year strategic plan).',kpi:'Mispick rate: baseline 0.45% of order lines (about 11,700 mispicks a year on 2.6 million lines); target 0.20% by December. Each mispick costs about $28 in returns, re-shipping and customer credits.',own:'DC training coordinator',start:'2026-07-06',bud:'35000',ben:'152880',att:'60',iso:'Participant or manager estimate',oth:'22000'},
 g:{c:[
  {n:'Scan-verify pick standard work',aud:'Pickers, all shifts',obj:'Pick a 20-line order with a scan at every location and zero skipped scans, observed by a certified trainer',m:'On-the-job',ppl:'64',hrs:'4',cost:'9600',d:'2026-07-13'},
  {n:'Mispick root cause and error-proofing',aud:'Leads and supervisors',obj:'Use the 5 whys on three recorded mispicks and propose one error-proofing change accepted by the area manager',m:'Classroom',ppl:'12',hrs:'8',cost:'6000',d:'2026-07-21'},
  {n:'WMS exception handling',aud:'Pickers and inventory control',obj:'Resolve a short pick and a location mismatch in the WMS practice environment within 5 minutes each',m:'E-learning',ppl:'70',hrs:'1.5',cost:'4900',d:'2026-08-03'},
  {n:'Accuracy coaching for leads',aud:'Leads',obj:'Understand how to coach pickers on accuracy',m:'Coaching or mentoring',ppl:'12',hrs:'6',cost:'11000',d:'2026-08-17'}],
 e:[
  {lv:'1 Reaction',ms:'End-of-session survey, average of relevance and usefulness items (1 to 5 scale)',when:'End of each session',dir:'Higher',t:'4.2',a:'4.5'},
  {lv:'2 Learning',ms:'Scored practical test: 20-line pick with scan-verify, percent of steps correct',when:'End of course',dir:'Higher',t:'90',a:'94'},
  {lv:'3 Behavior',ms:'Lead observation audits: percent of picks with every location scanned',when:'30, 60 and 90 days',dir:'Higher',t:'98',a:'91'},
  {lv:'4 Results',ms:'Mispick rate, percent of order lines (WMS report)',when:'Monthly, September to December',dir:'Lower',t:'0.20',a:'0.24'}]}}
}
