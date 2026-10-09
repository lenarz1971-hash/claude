{
slug:'meeting-agenda-action-log',
sections:[
 {type:'fields',title:'The meeting',cols:3,hint:'Send the purpose, the agenda and any pre-work before the meeting. Times are 24-hour HH:MM.',fields:[
  {id:'title',label:'Meeting',wide:true,ph:'e.g. Weekly project team meeting: line 4 changeover project'},
  {id:'date',label:'Date',type:'date'},
  {id:'start',label:'Start time',ph:'09:00'},
  {id:'end',label:'Scheduled end',ph:'10:00'},
  {id:'where',label:'Place or link'},
  {id:'facil',label:'Facilitator'},
  {id:'time',label:'Timekeeper'},
  {id:'scribe',label:'Scribe (minutes)'},
  {id:'asof',label:'Action status as of',type:'date',hint:'Leave blank for today.'},
  {id:'purpose',label:'Purpose: why meet at all',type:'textarea',wide:true,ph:'e.g. Decide the changeover sequence to pilot, and review open actions.'},
  {id:'outcomes',label:'Outcomes expected by the end',type:'textarea',wide:true,ph:'e.g. Pilot sequence chosen; pilot date and owner agreed.'},
  {id:'prework',label:'Pre-work for attendees',type:'textarea',wide:true},
  {id:'att',label:'Attendees, one per line',type:'textarea',wide:true,rows:3},
  {id:'rules',label:'Ground rules',type:'textarea',wide:true,ph:'e.g. Start on time; phones away; one conversation at a time; decisions by consensus, sponsor decides if none by the end of the item.'}]},
 {type:'grid',id:'ag',title:'Timed agenda',rows:4,hint:'One row per item. Say what kind of item it is and what should exist at the end of it. Planned minutes set the clock; fill in actual minutes as you go.',cols:[
  {id:'item',label:'Agenda item',w:200,type:'textarea',rows:1},
  {id:'kind',label:'Purpose',type:'select',opts:['Inform','Discuss','Decide','Generate ideas','Review actions','Break']},
  {id:'out',label:'Outcome wanted',w:180,type:'textarea',rows:1},
  {id:'lead',label:'Lead',w:100},
  {id:'min',label:'Planned min',type:'number',min:0},
  {id:'slot',label:'Planned slot',calc:function(r,api){ return window.TOOL._slot(r,api); }},
  {id:'act',label:'Actual min',type:'number',min:0},
  {id:'var',label:'Over (+) / under',calc:function(r,api){ var p=api.num(r.min), a=api.num(r.act); if(isNaN(p)||isNaN(a)) return ''; var d=a-p; return d>0?'<span class="bad">+'+d+'</span>':String(d); }}]},
 {type:'custom',id:'tl',title:'Agenda against the clock',hint:'Planned time in navy, actual time underneath in gold (red where it ran over). The dashed line is the scheduled end.',html:'<div class="svgw mt-svg"></div><div class="stat mt-stat"></div>'},
 {type:'grid',id:'dec',title:'Decisions made',rows:2,hint:'Write the decision itself, not the discussion. Record how it was made, so nobody reopens it later without reason.',cols:[
  {id:'no',label:'Item no.',w:50},
  {id:'d',label:'Decision',w:300,type:'textarea',rows:1},
  {id:'how',label:'How decided',type:'select',opts:['Consensus','Majority vote','Multivoting or NGT','Leader decided after input','Sponsor decided','Deferred']},
  {id:'by',label:'Decided by',w:120}]},
 {type:'grid',id:'ac',title:'Action log',rows:3,hint:'One action per row, written as a verb and a result. Each action gets <b>one</b> owner, a named person, and <b>one</b> due date. "Team" or "Ana and Raj" is not an owner.',cols:[
  {id:'no',label:'Item no.',w:50},
  {id:'a',label:'Action',w:260,type:'textarea',rows:1},
  {id:'who',label:'Owner',w:110},
  {id:'due',label:'Due',type:'date'},
  {id:'st',label:'Status',type:'select',opts:['Open','In progress','Done','Cancelled']},
  {id:'age',label:'Days late',calc:function(r,api){ var d=window.TOOL._late(r,api); return d>0?'<span class="bad">'+d+'</span>':''; }}]},
 {type:'fields',title:'Parking lot and next meeting',cols:2,fields:[
  {id:'park',label:'Parking lot: raised but not on the agenda',type:'textarea',wide:true},
  {id:'next',label:'Next meeting',ph:'e.g. Tuesday 14 Oct, 09:00'},
  {id:'eval',label:'Meeting evaluation (plus / delta)',ph:'e.g. + data sent ahead; – item 3 ran long'}]},
 {type:'custom',id:'chk',title:'What needs attention',html:'<div class="out mt-out"></div>'}
],
_hm:function(s){ var m=/^(\d{1,2})[:.](\d\d)$/.exec(String(s||'').trim()); return m&&+m[1]<24&&+m[2]<60?+m[1]*60+ +m[2]:NaN; },
_fmt:function(m){ m=((m%1440)+1440)%1440; return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+Math.round(m%60)).slice(-2); },
_slot:function(r,api){ var T=window.TOOL, S=api.state(), s=T._hm(S.f.start), i=S.g.ag.indexOf(r); if(isNaN(s)||i<0||isNaN(api.num(r.min))) return '';
 var t=s; for(var k=0;k<i;k++){ var m=api.num(S.g.ag[k].min); if(!isNaN(m)) t+=m; } return T._fmt(t)+'–'+T._fmt(t+api.num(r.min)); },
_asof:function(api){ var a=api.state().f.asof; return /^\d{4}-\d\d-\d\d$/.test(a||'')?a:api.today(); },
_late:function(r,api){ if(!r.due||r.st==='Done'||r.st==='Cancelled'||!r.a) return 0; var d=(new Date(window.TOOL._asof(api)+'T00:00:00')-new Date(r.due+'T00:00:00'))/864e5; return d>0?Math.round(d):0; },
update:function(root,api){
 var S=api.state(), F=S.f, T=window.TOOL, n=api.num, esc=api.esc, f=[];
 var asof=T._asof(api); var aso=root.querySelector('[data-f="asof"]'); if(aso){ aso.classList.add('autoval'); aso.placeholder=api.today(); }
 var A=S.g.ag.filter(function(r){return r.item||r.min;}), st=T._hm(F.start), en=T._hm(F.end);
 var slot=(!isNaN(st)&&!isNaN(en))?en-st:NaN; if(slot<=0) slot=NaN;
 var plan=0, act=0, anyAct=false; A.forEach(function(r){ var p=n(r.min), a=n(r.act); if(!isNaN(p)) plan+=p; if(!isNaN(a)){ act+=a; anyAct=true; } });
 /* timeline */
 var svg=root.querySelector('.mt-svg');
 if(A.length&&plan>0){
  var tot=Math.max(plan,anyAct?act:0,isNaN(slot)?0:slot), W=760, L=255, R=20, sc=(W-L-R)/tot, rh=34, H=A.length*rh+46;
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Agenda timeline"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.ax{font:600 10px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>';
  var tp=0, ta=0;
  A.forEach(function(r,i){ var p=n(r.min)||0, a=n(r.act), y=10+i*rh, lab=String(r.item||'(no title)'); if(lab.length>31) lab=lab.slice(0,30)+'…';
   g+='<text x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+(i+1)+'. '+esc(lab)+'</text>';
   g+='<rect x="'+(L+tp*sc)+'" y="'+(y+2)+'" width="'+Math.max(p*sc,1)+'" height="12" fill="'+(r.kind==='Break'?'#C6CDD3':'#0F3E68')+'"/>';
   if(!isNaN(a)) g+='<rect x="'+(L+ta*sc)+'" y="'+(y+16)+'" width="'+Math.max(a*sc,1)+'" height="9" fill="'+(a>p?'#C0392B':'#D8B147')+'"/>';
   tp+=p; if(!isNaN(a)) ta+=a; });
  var yb=10+A.length*rh; g+='<line x1="'+L+'" y1="'+yb+'" x2="'+(W-R)+'" y2="'+yb+'" stroke="#C6CDD3"/>';
  var step=tot>150?30:tot>60?15:10; for(var m=0;m<=tot+0.01;m+=step){ g+='<line x1="'+(L+m*sc)+'" y1="'+yb+'" x2="'+(L+m*sc)+'" y2="'+(yb+4)+'" stroke="#4A5D71"/><text class="ax" x="'+(L+m*sc)+'" y="'+(yb+16)+'" text-anchor="middle">'+(isNaN(st)?m+'′':T._fmt(st+m))+'</text>'; }
  if(!isNaN(slot)) g+='<line x1="'+(L+slot*sc)+'" y1="4" x2="'+(L+slot*sc)+'" y2="'+yb+'" stroke="#C0392B" stroke-width="1.4" stroke-dasharray="5 4"/><text class="ax" x="'+(L+slot*sc-4)+'" y="'+(yb+30)+'" text-anchor="end" style="fill:#C0392B">SCHEDULED END</text>';
  svg.innerHTML=g+'</svg>'; svg.style.display='';
 } else { svg.innerHTML=''; svg.style.display='none'; }
 var ACT=S.g.ac.filter(function(r){return r.a;}), open=ACT.filter(function(r){return r.st!=='Done'&&r.st!=='Cancelled';}), late=open.filter(function(r){return T._late(r,api)>0;});
 root.querySelector('.mt-stat').innerHTML=A.length?'<div><b>'+plan+' min</b><span>Planned agenda</span></div><div><b>'+(isNaN(slot)?'—':slot+' min')+'</b><span>Time scheduled</span></div><div><b>'+(anyAct?act+' min':'—')+'</b><span>Actual so far</span></div><div><b>'+ACT.length+'</b><span>Actions</span></div><div><b>'+open.length+'</b><span>Open actions</span></div><div><b>'+late.length+'</b><span>Late as of '+esc(asof)+'</span></div>':'';
 /* checks */
 if(!A.length&&!ACT.length&&!F.purpose){ root.querySelector('.mt-out').innerHTML=api.flags([],'Fill in the purpose, the agenda and the actions, and the checks appear here.'); return; }
 if(!F.purpose) f.push(['warn','No purpose written. If nobody can say why the meeting is needed, it may not be.']);
 if(!F.outcomes) f.push(['warn','No outcomes written. Say what should exist at the end (a decision, a plan, a list), so everyone can tell whether the meeting worked.']);
 var miss=[]; if(!F.facil) miss.push('facilitator'); if(!F.time) miss.push('timekeeper'); if(!F.scribe) miss.push('scribe'); if(miss.length) f.push(['warn','No '+miss.join(', ')+' named. Each role keeps a different thing on track: the process, the clock and the record.']);
 if(F.facil&&F.time&&F.facil.trim().toLowerCase()===F.time.trim().toLowerCase()) f.push(['','The facilitator is also the timekeeper. That works for small meetings; in larger ones the facilitator is busy with the discussion and loses the clock.']);
 if(F.start&&isNaN(st)||F.end&&isNaN(en)) f.push(['warn','Write the start and end as 24-hour HH:MM, for example 09:00 and 13:30.']);
 if(!isNaN(st)&&!isNaN(en)&&en<=st) f.push(['warn','The scheduled end is not after the start.']);
 if(!isNaN(slot)&&plan>slot) f.push(['warn','The agenda needs '+plan+' minutes but only '+slot+' are scheduled ('+(plan-slot)+' over). Cut or move items before the meeting, not during it.']);
 else if(!isNaN(slot)&&plan) f.push(['ok','The agenda fits: '+plan+' of '+slot+' minutes planned'+(slot-plan?', leaving '+(slot-plan)+' spare':'')+'.']);
 var noMin=A.filter(function(r){return isNaN(n(r.min));}).length; if(noMin) f.push(['warn',noMin+' agenda item'+(noMin>1?'s have':' has')+' no planned time. An item without a time box tends to take whatever is left.']);
 var noOut=[]; A.forEach(function(r,i){ if(r.kind!=='Break'&&(!r.kind||!r.out)) noOut.push(i+1); }); if(noOut.length) f.push(['warn','Item'+(noOut.length>1?'s ':' ')+noOut.join(', ')+': give each a purpose (inform, discuss, decide) and the outcome wanted.']);
 var over=[]; A.forEach(function(r,i){ var p=n(r.min),a=n(r.act); if(!isNaN(p)&&!isNaN(a)&&a>p) over.push('item '+(i+1)+' +'+(a-p)); });
 if(over.length) f.push(['warn','Ran over: '+over.join(', ')+' min.'+(anyAct&&!isNaN(slot)&&act>slot?' The meeting ran '+(act-slot)+' minutes past the scheduled end.':'')]);
 else if(anyAct&&!isNaN(slot)&&act>slot) f.push(['warn','The meeting ran '+(act-slot)+' minutes past the scheduled end.']);
 var run=0, longest=0; A.forEach(function(r){ if(r.kind==='Break') run=0; else { run+=n(r.min)||0; longest=Math.max(longest,run); } }); if(longest>90) f.push(['','There is a stretch of '+longest+' minutes without a break. Attention drops after about an hour and a half.']);
 var D=S.g.dec.filter(function(r){return r.d;});
 A.forEach(function(r,i){ if(r.kind==='Decide'&&!D.some(function(d){return String(d.no).trim()===String(i+1);})) f.push(['warn','Item '+(i+1)+' was meant to reach a decision, and none is recorded against it. Record the decision, or record that it was deferred and to when.']); });
 var multi=/(,|;|\/|&|\+|\band\b)/i, group=/^(all|everyone|team|the team|tbd|tba|\?+|group|committee|management)$/i;
 ACT.forEach(function(r){ var id='<b>'+esc(String(r.a).slice(0,48))+(String(r.a).length>48?'…':'')+'</b>';
  if(!String(r.who||'').trim()) f.push(['warn',id+' has no owner.']);
  else if(group.test(String(r.who).trim())) f.push(['warn',id+': "'+esc(r.who)+'" is not an owner. Name one person who will make sure it happens.']);
  else if(multi.test(r.who)) f.push(['warn',id+' has more than one owner ('+esc(r.who)+'). Others can help, but one person owns it.']);
  if(!r.due) f.push(['warn',id+' has no due date.']);
  else if(F.date&&r.due<F.date) f.push(['warn',id+': the due date is before the meeting.']); });
 if(late.length) f.push(['warn',late.length+' action'+(late.length>1?'s are':' is')+' late as of '+esc(asof)+': '+late.map(function(r){return esc(String(r.who||'?'))+' ('+T._late(r,api)+' days)';}).join(', ')+'. Review them first at the next meeting.']);
 var ACTnoItem=ACT.filter(function(r){return !String(r.no||'').trim();}).length; if(ACTnoItem) f.push(['',ACTnoItem+' action'+(ACTnoItem>1?'s are':' is')+' not tied to an agenda item. That is fine for carried-over actions; otherwise note where it came from.']);
 if(!F.next) f.push(['','No next meeting set. Agree the date before people leave.']);
 root.querySelector('.mt-out').innerHTML=api.flags(f);
},
example:{f:{title:'Weekly project team meeting: Line 4 changeover reduction',date:'2026-10-06',start:'09:00',end:'10:00',where:'Conference room B and video link',facil:'Lena Ostrowski',time:'Femi Adeyemi',scribe:'Carla Mendes',asof:'2026-10-20',
 purpose:'Choose which changeover sequence to pilot on Line 4, and check progress on the measurement plan.',
 outcomes:'Pilot sequence chosen, with a date and an owner. Open actions reviewed. Risks for the pilot listed.',
 prework:'Read the two candidate sequences (sent Friday). Bring the last four weeks of changeover times for your shift.',
 att:'Lena Ostrowski (facilitator, CI lead)\nFemi Adeyemi (process engineer)\nCarla Mendes (quality technician)\nDev Ramaswamy (Line 4 supervisor, day shift)\nRosa Klein (Line 4 supervisor, night shift)\nOwen Pratt (maintenance planner)\nMarta Silva (sponsor, plant manager; item 4 only)',
 rules:'Start and stop on time. Phones away. One conversation at a time. Decisions by consensus; if none by the end of the item, the sponsor decides.',
 park:'Night shift asks for a second set of quick-release clamps. Owen to price it before the next meeting.',next:'Tuesday 13 Oct, 09:00, same room',eval:'+ data sent ahead; – item 3 ran long, needed more time for the risks'},
 g:{ag:[
  {item:'Check-in, purpose and agenda',kind:'Inform',out:'Agenda agreed',lead:'Lena',min:'5',act:'5'},
  {item:'Review open actions from last week',kind:'Review actions',out:'Status of each action',lead:'Carla',min:'10',act:'12'},
  {item:'Compare the two changeover sequences',kind:'Discuss',out:'Pros, cons and risks of each',lead:'Femi',min:'15',act:'22'},
  {item:'Choose the sequence to pilot',kind:'Decide',out:'One sequence chosen',lead:'Marta',min:'15',act:'14'},
  {item:'Pilot plan: who, when, measures',kind:'Decide',out:'Pilot date and owner',lead:'Femi',min:'10',act:'10'},
  {item:'Recap actions, evaluate the meeting',kind:'Review actions',out:'Actions read back',lead:'Carla',min:'5',act:'4'}],
 dec:[{no:'4',d:'Pilot sequence B (external setup of die cart and pre-staged tooling) on Line 4 day shift.',how:'Consensus',by:'Team, sponsor present'}],
 ac:[
  {no:'2',a:'Finish the gauge R&R on the changeover first-piece check',who:'Carla Mendes',due:'2026-10-09',st:'Done'},
  {no:'5',a:'Write the pilot plan with the measures and the start date',who:'Femi Adeyemi',due:'2026-10-12',st:'In progress'},
  {no:'5',a:'Build and label the second die cart',who:'Owen Pratt',due:'2026-10-16',st:'Open'},
  {no:'3',a:'Brief both shifts on sequence B',who:'Dev and Rosa',due:'2026-10-15',st:'Open'},
  {no:'',a:'Price a second set of quick-release clamps',who:'Owen Pratt',due:'',st:'Open'}]}}
}
