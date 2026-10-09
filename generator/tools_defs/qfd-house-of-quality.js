{
slug:'qfd-house-of-quality',
sections:[
 {type:'fields',title:'Product and source of the customer voice',cols:3,fields:[
  {id:'prod',label:'Product, service or release',wide:true,ph:'e.g. Field service mobile app, version 3'},
  {id:'team',label:'Team',ph:'Names or roles'},
  {id:'date',label:'Date',type:'date'},
  {id:'comp',label:'Competitor compared',ph:'e.g. Leading competitor app'},
  {id:'voc',label:'Where the customer requirements came from',type:'textarea',rows:2,wide:true,ph:'Interviews, surveys, complaints, observation; how many customers and which segments'}]},
 {type:'grid',id:'w',title:'Customer requirements (the whats)',rows:4,hint:'In the customer\'s words, one need per row. Importance 1 to 5 from the customer, not the team. The two ratings are optional: how customers rate your current offer and the competitor\'s on each need, 1 (poor) to 5 (excellent).',cols:[
  {id:'n',label:'Customer requirement',w:230,type:'textarea',rows:1},
  {id:'imp',label:'Importance 1–5',type:'number',min:1,max:5},
  {id:'us',label:'Our rating 1–5',type:'number',min:1,max:5},
  {id:'cp',label:'Competitor 1–5',type:'number',min:1,max:5}]},
 {type:'grid',id:'h',title:'Technical characteristics (the hows)',rows:4,hint:'Measurable characteristics the organization controls, stated without choosing a solution. Give each a direction of improvement and, if known, a target.',cols:[
  {id:'n',label:'Technical characteristic',w:230,type:'textarea',rows:1},
  {id:'u',label:'Unit',w:90},
  {id:'dir',label:'Direction',type:'select',opts:['↑ Maximize','↓ Minimize','◎ Hit target']},
  {id:'tgt',label:'Target value',w:100}]},
 {type:'custom',id:'rm',title:'Relationship matrix',hint:'For each pair, how strongly does the technical characteristic affect the customer requirement? Use the standard 9 / 3 / 1 scale: ● strong = 9, ○ medium = 3, △ weak = 1. Leave blank where there is no relationship. The bottom rows are the technical importance: the sum of importance × relationship down each column.',html:'<div class="tgw"><table class="mv qf-m"></table></div><p class="th qf-key">● 9 strong &nbsp; ○ 3 medium &nbsp; △ 1 weak</p>'},
 {type:'custom',id:'roof',title:'Correlation roof (optional)',hint:'Does improving one technical characteristic help or hurt another, each moved in its own direction of improvement? Positive means they support each other; negative means improving one makes the other worse, a trade-off to resolve.',html:'<div class="tgw"><table class="mv qf-r"></table></div>'},
 {type:'custom',id:'res',title:'Technical priorities',html:'<div class="tgw"><table class="mv qf-t"></table></div><div class="svgw qf-chart"></div><div class="out qf-out"></div>'}
],
blankX:function(){return {r:{},c:{}};},
update:function(root,api){
 var S=api.state(), n=api.num, esc=api.esc, f=[];
 var r=S.x.r||(S.x.r={}), cr=S.x.c||(S.x.c={});
 var W=S.g.w.filter(function(x){return x.n;}), H=S.g.h.filter(function(x){return x.n;});
 var mt=root.querySelector('table.qf-m'), rf=root.querySelector('table.qf-r'), tt=root.querySelector('table.qf-t'), ch=root.querySelector('.qf-chart'), out=root.querySelector('.qf-out');
 var SYM={9:'●',3:'○',1:'△'};
 function sel(attr,key,val,opts,label){ return '<select '+attr+'="'+esc(key)+'" aria-label="'+esc(label)+'"><option value=""></option>'+opts.map(function(o){return '<option value="'+o[0]+'"'+(String(val)===String(o[0])?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>'; }
 if(!W.length||!H.length){
  mt.innerHTML='<tr><td class="th">Add at least one customer requirement and one technical characteristic.</td></tr>'; mt.dataset.sig=''; rf.innerHTML=''; rf.dataset.sig=''; tt.innerHTML=''; ch.innerHTML='';
  out.innerHTML=api.flags([],'List the whats and the hows, then fill in the relationship matrix. The ranked technical priorities and checks appear here.'); return; }
 var sig=JSON.stringify([W.map(function(x){return x.n;}),H.map(function(x){return x.n;})]);
 if(mt.dataset.sig!==sig||!mt.querySelector('select')){
  mt.dataset.sig=sig;
  mt.innerHTML='<thead><tr><th>Customer requirement</th><th>Imp.</th>'+H.map(function(h,j){return '<th title="'+esc(h.n)+'"><span class="qf-hn">'+String.fromCharCode(65+j%26)+'</span>'+esc(h.n.length>34?h.n.slice(0,33)+'…':h.n)+'</th>';}).join('')+'</tr></thead><tbody>'+W.map(function(w){return '<tr><td class="mo">'+esc(w.n)+'</td><td class="mt qf-imp" data-wi="'+esc(w.n)+'"></td>'+H.map(function(h){var k=w.n+'|'+h.n;return '<td>'+sel('data-qr',k,r[k],[[9,'● 9'],[3,'○ 3'],[1,'△ 1']],w.n+' / '+h.n)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody><tfoot><tr><td colspan="2">Absolute importance</td>'+H.map(function(h,j){return '<td class="qf-abs" data-j="'+j+'"></td>';}).join('')+'</tr><tr><td colspan="2">Relative importance</td>'+H.map(function(h,j){return '<td class="qf-rel" data-j="'+j+'"></td>';}).join('')+'</tr><tr><td colspan="2">Rank</td>'+H.map(function(h,j){return '<td class="qf-rk" data-j="'+j+'"></td>';}).join('')+'</tr></tfoot>';
  mt.querySelectorAll('select[data-qr]').forEach(function(s){ s.onchange=function(e){ e.stopPropagation(); var x=n(s.value); if(isNaN(x)) delete r[s.dataset.qr]; else r[s.dataset.qr]=x; api.save(); }; });
 }
 mt.querySelectorAll('[data-wi]').forEach(function(td){ var w=W.filter(function(x){return x.n===td.dataset.wi;})[0]; td.textContent=w&&w.imp?w.imp:'—'; });
 /* roof */
 function ck(a,b){ return cr[a+'|'+b]!=null?a+'|'+b:(cr[b+'|'+a]!=null?b+'|'+a:a+'|'+b); }
 if(H.length<2){ rf.innerHTML='<tr><td class="th">Needs at least two technical characteristics.</td></tr>'; rf.dataset.sig=''; }
 else if(rf.dataset.sig!==sig||!rf.querySelector('select')){
  rf.dataset.sig=sig;
  rf.innerHTML='<thead><tr><th>Technical characteristic</th>'+H.slice(0,-1).map(function(h,j){return '<th title="'+esc(h.n)+'">'+String.fromCharCode(65+j%26)+'</th>';}).join('')+'</tr></thead><tbody>'+H.slice(1).map(function(h,i0){var i=i0+1;return '<tr><td class="mo"><span class="qf-hn">'+String.fromCharCode(65+i%26)+'</span>'+esc(h.n)+'</td>'+H.slice(0,-1).map(function(g,j){ if(j>=i) return '<td></td>'; var k=ck(h.n,g.n); return '<td>'+sel('data-qc',k,cr[k],[[2,'++'],[1,'+'],[-1,'−'],[-2,'−−']],h.n+' with '+g.n)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>';
  rf.querySelectorAll('select[data-qc]').forEach(function(s){ s.onchange=function(e){ e.stopPropagation(); var x=n(s.value); if(isNaN(x)) delete cr[s.dataset.qc]; else cr[s.dataset.qc]=x; api.save(); }; });
 }
 /* compute */
 var badImp=[], noImp=[];
 W.forEach(function(w){ var i=n(w.imp); if(isNaN(i)) noImp.push(w.n); else if(i<1||i>5) badImp.push(w.n); });
 var abs=H.map(function(h){ return W.reduce(function(a,w){ var i=n(w.imp), v=r[w.n+'|'+h.n]; return a+(isNaN(i)||!v?0:i*v); },0); });
 var tot=abs.reduce(function(a,b){return a+b;},0);
 var order=abs.map(function(a,j){return j;}).sort(function(a,b){return abs[b]-abs[a];}), rank=[]; order.forEach(function(j,k){ rank[j]=(k>0&&abs[j]===abs[order[k-1]])?rank[order[k-1]]:k+1; });
 mt.querySelectorAll('.qf-abs').forEach(function(td){ td.textContent=api.fmt(abs[+td.dataset.j],0); });
 mt.querySelectorAll('.qf-rel').forEach(function(td){ td.textContent=tot?(abs[+td.dataset.j]/tot*100).toFixed(1)+'%':'—'; });
 mt.querySelectorAll('.qf-rk').forEach(function(td){ td.textContent=tot&&abs[+td.dataset.j]?rank[+td.dataset.j]:'—'; });
 tt.innerHTML=tot?'<thead><tr><th>Rank</th><th>Technical characteristic</th><th>Direction</th><th>Target</th><th>Absolute</th><th>Relative</th></tr></thead><tbody>'+order.map(function(j){var h=H[j];return '<tr><td class="mt">'+(abs[j]?rank[j]:'—')+'</td><td class="mo">'+esc(h.n)+'</td><td>'+esc(h.dir||'—')+'</td><td>'+esc((h.tgt||'—')+(h.tgt&&h.u?' '+h.u:''))+'</td><td class="mt">'+api.fmt(abs[j],0)+'</td><td class="mt">'+(abs[j]/tot*100).toFixed(1)+'%</td></tr>';}).join('')+'</tbody>':'';
 if(tot){
  var Wd=640, rh=28, L=250, R=60, top=8, Hh=top+order.length*rh+6;
  var g='<svg viewBox="0 0 '+Wd+' '+Hh+'" role="img" aria-label="Relative technical importance"><style>text{font:12px Archivo,sans-serif;fill:#16273A}</style>';
  var mx=abs[order[0]]/tot*100;
  order.forEach(function(j,k){ var p=abs[j]/tot*100, w=(Wd-L-R)*p/mx, y=top+k*rh, lab=H[j].n.length>36?H[j].n.slice(0,35)+'…':H[j].n;
   g+='<text x="'+(L-8)+'" y="'+(y+17)+'" text-anchor="end">'+esc(lab)+'</text><rect x="'+L+'" y="'+(y+4)+'" width="'+Math.max(p?2:0,w)+'" height="18" fill="'+(k<3&&p?'#D8B147':'#0F3E68')+'"/><text x="'+(L+w+6)+'" y="'+(y+17)+'">'+p.toFixed(1)+'%</text>'; });
  ch.innerHTML=g+'</svg>';
 } else ch.innerHTML='';
 /* flags */
 if(tot){ var top3=order.filter(function(j){return abs[j];}).slice(0,3); f.push(['ok','Highest technical priorities: '+top3.map(function(j){return '<b>'+esc(H[j].n)+'</b> ('+(abs[j]/tot*100).toFixed(1)+'%)';}).join(', ')+'. These are where design effort, targets and controls do the most for the customer needs as weighted.']); }
 else f.push(['warn','No relationships entered yet. Fill in the matrix with 9, 3 or 1.']);
 if(noImp.length) f.push(['warn','No importance for: '+noImp.map(esc).join(', ')+'. Those needs add nothing to the technical importance.']);
 if(badImp.length) f.push(['warn','Importance should be 1 to 5: '+badImp.map(esc).join(', ')+'.']);
 var none=[], weak=[];
 W.forEach(function(w){ var vals=H.map(function(h){return r[w.n+'|'+h.n]||0;}); var m=Math.max.apply(null,vals); if(!m) none.push(w.n); else if(m<9) weak.push(w.n); });
 if(none.length) f.push(['warn','No technical characteristic addresses: '+none.map(function(x){return '<b>'+esc(x)+'</b>';}).join(', ')+'. That row is empty: a customer need the design does not measure. Add a how for it.']);
 if(weak.length) f.push(['warn','No strong (9) relationship for: '+weak.map(function(x){return '<b>'+esc(x)+'</b>';}).join(', ')+'. Only medium or weak links cover this need, so it may go unmet. Look for a characteristic that controls it directly.']);
 var unused=H.filter(function(h,j){return !W.some(function(w){return r[w.n+'|'+h.n];});});
 if(unused.length) f.push(['warn','No relationship to any customer requirement: '+unused.map(function(h){return '<b>'+esc(h.n)+'</b>';}).join(', ')+'. That column is empty. Either it serves a need nobody listed (add the need) or it is not needed for this customer and can be dropped from the house.']);
 var cells=W.length*H.length, filled=0; W.forEach(function(w){H.forEach(function(h){ if(r[w.n+'|'+h.n]) filled++; });});
 if(cells>=12&&filled/cells>0.6) f.push(['warn',(filled/cells*100).toFixed(0)+'% of the matrix is filled. When almost everything relates to everything, the priorities flatten out. Keep only relationships the team can defend.']);
 var nodir=H.filter(function(h){return !h.dir;}); if(nodir.length) f.push(['warn','No direction of improvement for: '+nodir.map(function(h){return esc(h.n);}).join(', ')+'.']);
 var neg=[], pos=0;
 for(var i=0;i<H.length;i++) for(var j=0;j<i;j++){ var k=ck(H[i].n,H[j].n), v=cr[k]; if(v<0) neg.push([H[i].n,H[j].n,v]); else if(v>0) pos++; }
 neg.forEach(function(x){ f.push(['warn','Trade-off: <b>'+esc(x[0])+'</b> and <b>'+esc(x[1])+'</b> are '+(x[2]===-2?'strongly ':'')+'negatively correlated. Improving one works against the other; resolve it by design (an engineering trade study, or an inventive solution that removes the conflict) rather than letting each team optimize its own.']); });
 if(pos) f.push(['',pos+' positive correlation'+(pos>1?'s':'')+' in the roof. Those characteristics move together, so work on one helps the other; check that you are not counting the same effort twice.']);
 var gaps=W.filter(function(w){var a=n(w.us),b=n(w.cp),i=n(w.imp);return !isNaN(a)&&!isNaN(b)&&b>a&&i>=4;});
 if(gaps.length) f.push(['warn','Competitive gap on important needs: '+gaps.map(function(w){return '<b>'+esc(w.n)+'</b> (us '+w.us+', competitor '+w.cp+')';}).join('; ')+'. Customers rate the competitor higher where it matters most to them.']);
 var lead=W.filter(function(w){var a=n(w.us),b=n(w.cp),i=n(w.imp);return !isNaN(a)&&!isNaN(b)&&a>b&&i>=4;});
 if(lead.length) f.push(['ok','You lead the competitor on important needs: '+lead.map(function(w){return esc(w.n);}).join('; ')+'. Protect these as sales points.']);
 f.push(['','The 9 / 3 / 1 scale is deliberately uneven so that strong relationships dominate the ranking. The house shows where to focus; it does not prove the relationships, which are team judgment until tested.']);
 out.innerHTML=api.flags(f);
},
example:{f:{prod:'Ridgeline Software field service app, version 3',team:'Product manager, two developers, QA lead, support lead, two field technicians',date:'2026-09-15',comp:'Leading competitor app',voc:'22 technician ride-alongs and interviews across three customer companies, 140 support tickets from the last six months, app store reviews.'},
 g:{w:[{n:'Works with no signal (basements, rural sites)',imp:'5',us:'2',cp:'4'},{n:'Opens the right job quickly',imp:'5',us:'3',cp:'3'},{n:'Logging parts used is quick',imp:'4',us:'3',cp:'4'},{n:'Phone battery lasts the whole shift',imp:'4',us:'3',cp:'3'},{n:'Customer signature and invoice on the spot',imp:'3',us:'4',cp:'3'},{n:'Looks professional in front of the customer',imp:'2',us:'3',cp:'4'}],
  h:[{n:'Job data available offline',u:'% of fields',dir:'↑ Maximize',tgt:'100'},{n:'Time to open a work order',u:'s, median',dir:'↓ Minimize',tgt:'2'},{n:'Taps to record a part used',u:'taps',dir:'↓ Minimize',tgt:'3'},{n:'Battery used per 8-hour shift',u:'%',dir:'↓ Minimize',tgt:'15'},{n:'Sync success without user action',u:'%',dir:'↑ Maximize',tgt:'99.5'},{n:'Crash-free sessions',u:'%',dir:'↑ Maximize',tgt:'99.8'},{n:'Screens to complete sign-off and invoice',u:'screens',dir:'↓ Minimize',tgt:'3'},{n:'Number of color themes',u:'themes',dir:'↑ Maximize',tgt:'3'}]},
 x:{r:{'Works with no signal (basements, rural sites)|Job data available offline':9,'Works with no signal (basements, rural sites)|Sync success without user action':9,'Works with no signal (basements, rural sites)|Time to open a work order':3,'Works with no signal (basements, rural sites)|Battery used per 8-hour shift':1,
  'Opens the right job quickly|Time to open a work order':9,'Opens the right job quickly|Job data available offline':3,'Opens the right job quickly|Crash-free sessions':3,
  'Logging parts used is quick|Taps to record a part used':9,'Logging parts used is quick|Job data available offline':3,
  'Phone battery lasts the whole shift|Battery used per 8-hour shift':9,'Phone battery lasts the whole shift|Sync success without user action':3,
  'Customer signature and invoice on the spot|Screens to complete sign-off and invoice':9,'Customer signature and invoice on the spot|Job data available offline':3,
  'Looks professional in front of the customer|Crash-free sessions':3,'Looks professional in front of the customer|Screens to complete sign-off and invoice':1,'Looks professional in front of the customer|Time to open a work order':1},
 c:{'Time to open a work order|Job data available offline':1,'Battery used per 8-hour shift|Job data available offline':-1,'Battery used per 8-hour shift|Sync success without user action':-1,'Screens to complete sign-off and invoice|Taps to record a part used':1}}}
}
