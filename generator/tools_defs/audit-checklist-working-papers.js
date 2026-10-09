{
slug:'audit-checklist-working-papers',
sections:[
 {type:'fields',title:'Working paper header',cols:3,fields:[
  {id:'ref',label:'Audit reference'},
  {id:'proc',label:'Process or area audited'},
  {id:'aud',label:'Auditor'},
  {id:'date',label:'Date',type:'date'},
  {id:'strat',label:'Audit strategy',type:'select',opts:['Process approach','Forward trace (input to output)','Backward trace (output to input)','Element or clause','Department','Discovery']},
  {id:'who',label:'People interviewed',hint:'Job titles, not names, if the report will be widely shared.'}]},
 {type:'grid',id:'cl',title:'Checklist and evidence',rows:4,hint:'Plan the first four columns before the audit; fill in the sample checked, the evidence and the result on site. Write questions as open prompts ("Show me how...", "How do you...") and record evidence as facts someone else could verify: document numbers, dates, quantities, locations.',cols:[
  {id:'ref',label:'Criterion',w:110,tip:'Clause, procedure section or requirement'},
  {id:'q',label:'Question or what to verify',w:230,type:'textarea',rows:1},
  {id:'m',label:'Method',type:'select',opts:['Interview','Observation','Document review','Record sample','Measurement or test']},
  {id:'sp',label:'Sample planned',type:'number',w:70},
  {id:'sc',label:'Sample checked',type:'number',w:70},
  {id:'ev',label:'Evidence observed',w:260,type:'textarea',rows:1},
  {id:'r',label:'Result',type:'select',opts:['Conforms','Nonconformity','Opportunity for improvement','Not yet audited']}]},
 {type:'custom',id:'sum',title:'Coverage and checks',html:'<div class="svgw acw-chart"></div><div class="out acw-out"></div>'}
],
update:function(root,api){
 var S=api.state(), esc=api.esc, f=[], n=api.num;
 var R=S.g.cl.filter(function(r){return r.q||r.ref;}), chart=root.querySelector('.acw-chart'), out=root.querySelector('.acw-out');
 if(!R.length){ chart.innerHTML=''; out.innerHTML=api.flags([],'Add checklist lines (criterion and question) and the coverage and checks appear here.'); return; }
 var lab=function(r,i){return 'line '+(S.g.cl.indexOf(r)+1)+(r.ref?' ('+esc(r.ref)+')':'');};
 var K=[['Conforms','#1F8C55'],['Nonconformity','#C0392B'],['Opportunity for improvement','#D8B147'],['Not yet audited','#C6CDD3']], cnt={};
 K.forEach(function(k){cnt[k[0]]=0;}); R.forEach(function(r){ cnt[r.r&&cnt[r.r]!=null?r.r:'Not yet audited']++; });
 var done=R.length-cnt['Not yet audited'];
 /* stacked bar */
 var W=800, x=10, bw=W-20, g='<svg viewBox="0 0 '+W+' 92" role="img" aria-label="Checklist results"><style>text{font:12px Archivo,sans-serif;fill:#16273A}</style>';
 K.forEach(function(k){ var w=bw*cnt[k[0]]/R.length; if(w>0){ g+='<rect x="'+x+'" y="10" width="'+w+'" height="32" fill="'+k[1]+'"/>'; if(w>26) g+='<text x="'+(x+w/2)+'" y="31" text-anchor="middle" style="fill:'+(k[0]==='Not yet audited'||k[0]==='Opportunity for improvement'?'#16273A':'#FFFFFF')+';font-weight:700">'+cnt[k[0]]+'</text>'; x+=w; } });
 var lx=10; K.forEach(function(k){ g+='<rect x="'+lx+'" y="58" width="12" height="12" fill="'+k[1]+'"/><text x="'+(lx+17)+'" y="69">'+k[0]+' ('+cnt[k[0]]+')</text>'; lx+=k[0].length*6.6+60; });
 chart.innerHTML=g+'</svg>';
 f.push([done===R.length?'ok':'','<b>'+done+' of '+R.length+'</b> checklist lines audited ('+Math.round(done/R.length*100)+'%): '+cnt['Conforms']+' conforming, '+cnt['Nonconformity']+' nonconformit'+(cnt['Nonconformity']===1?'y':'ies')+', '+cnt['Opportunity for improvement']+' opportunit'+(cnt['Opportunity for improvement']===1?'y':'ies')+' for improvement.']);
 var noEv=R.filter(function(r){return (r.r==='Conforms'||r.r==='Nonconformity'||r.r==='Opportunity for improvement')&&!String(r.ev||'').trim();});
 if(noEv.length) f.push(['warn','A result with no evidence recorded: '+noEv.map(lab).join(', ')+'. A conclusion with nothing behind it cannot be verified or defended at the closing meeting.']);
 var noCrit=R.filter(function(r){return r.r==='Nonconformity'&&!r.ref;}); if(noCrit.length) f.push(['warn','Nonconformity with no criterion: '+noCrit.map(lab).join(', ')+'. A nonconformity is the failure to meet a stated requirement; name it.']);
 var short=R.filter(function(r){var p=n(r.sp),c=n(r.sc);return r.r&&r.r!=='Not yet audited'&&!isNaN(p)&&!isNaN(c)&&c<p;});
 if(short.length) f.push(['warn','Sample smaller than planned: '+short.map(function(r){return lab(r)+' '+r.sc+' of '+r.sp;}).join(', ')+'. Note why in the evidence, and do not generalize beyond what was checked.']);
 var op=/\b(seems?|appears?|probably|i think|i feel|i believe|sloppy|careless|lazy|poor|messy|good job|excellent)\b/i;
 var opin=R.filter(function(r){return op.test(r.ev||'');}); if(opin.length) f.push(['warn','Opinion words in the evidence: '+opin.map(lab).join(', ')+'. Objective evidence is what was seen, read or heard and can be verified: record the fact, not the judgment.']);
 var closed=/^\s*(do|does|did|is|are|was|were|have|has|can|will|should)\b/i;
 var cq=R.filter(function(r){return closed.test(r.q||'');}); if(cq.length) f.push(['','Closed questions on '+cq.map(lab).join(', ')+'. "Is there a procedure?" invites yes or no. Ask "Show me..." or "How do you...?" so the answer produces evidence.']);
 var nc=R.filter(function(r){return r.r==='Nonconformity';});
 if(nc.length) f.push(['','Carry the nonconformit'+(nc.length===1?'y on ':'ies on ')+nc.map(lab).join(', ')+' into the <a href="/tools/audit-nonconformity-report.html">nonconformity and report writer</a> to state, grade and report them.']);
 var meth={}; R.forEach(function(r){ if(r.m) meth[r.m]=1; }); var mk=Object.keys(meth);
 if(R.length>=4&&mk.length===1) f.push(['warn','Every line uses '+esc(mk[0]).toLowerCase()+'. Corroborate interviews with records and observation; a single source of evidence is weak.']);
 if(R.length>=4&&mk.length>1&&!meth['Interview']) f.push(['','No interviews planned. People can tell you how the process really runs and where to look; follow up what they say with records.']);
 out.innerHTML=api.flags(f);
},
example:{f:{ref:'IA-2026-11',proc:'Order picking and shipping',aud:'K. Alvarez',date:'2026-10-14',strat:'Backward trace (output to input)',who:'Shipping supervisor, two pickers, inventory control analyst'},
 g:{cl:[{ref:'ISO 9001 8.5.1',q:'Show me how a picker knows which orders to pick and in what sequence.',m:'Observation',sp:'',sc:'',ev:'Pickers use RF scanners; wave release in WMS by carrier cut-off. Observed 2 pickers on waves W-1014-03 and W-1014-04.',r:'Conforms'},
  {ref:'WI-SH-02 sec 4',q:'Trace shipped orders back to pick confirmation and the scan of each line.',m:'Record sample',sp:'20',sc:'20',ev:'20 of 20 bills of lading from 7-13 Oct traced to pick confirmations in WMS. 19 of 20 had all lines scanned; order 448213 line 3 was keyed manually with no override reason.',r:'Nonconformity'},
  {ref:'ISO 9001 7.1.5',q:'How are the shipping scales checked and calibrated?',m:'Document review',sp:'3',sc:'3',ev:'Scales SC-01 to SC-03 calibration certificates dated 2026-04-02, due 2027-04-02. Daily check sheets complete for October.',r:'Conforms'},
  {ref:'ISO 9001 7.2',q:'How is a new picker trained and signed off before working alone?',m:'Record sample',sp:'5',sc:'3',ev:'Training records for 3 of 5 sampled pickers hired since June; 2 records held at the staffing agency and not available on the day. The 3 reviewed were signed off after 5 supervised shifts per WI-SH-01.',r:'Conforms'},
  {ref:'WI-SH-05 sec 2',q:'Is damaged freight segregated?',m:'Observation',sp:'',sc:'',ev:'Hold cage at dock 6 labeled. Damage area seems disorganized.',r:'Opportunity for improvement'},
  {ref:'ISO 9001 8.5.4',q:'Show me how temperature-sensitive orders are staged and loaded.',m:'Observation',sp:'',sc:'',ev:'',r:'Not yet audited'},
  {ref:'Customer CR-7',q:'Trace three mis-ship complaints from September back to their root cause and actions.',m:'Record sample',sp:'3',sc:'3',ev:'Complaints C-0912, C-0917, C-0925 each have a CAR. Two cite label printer misfeeds; actions closed 30 Sep, effectiveness check not yet due.',r:'Conforms'},
  {ref:'ISO 9001 8.7',q:'How are short-shipped or mis-picked orders identified and controlled before dispatch?',m:'Interview',sp:'',sc:'',ev:'Supervisor described an audit-at-dock check for orders over 50 lines. Not yet verified against records.',r:'Not yet audited'}]}}
}
