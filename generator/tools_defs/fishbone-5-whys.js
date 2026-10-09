{
slug:'fishbone-5-whys',
sections:[
 {type:'fields',title:'The effect',hint:'State the problem as an effect you can observe, not as a cause. It goes in the head of the fish.',fields:[
  {id:'effect',label:'Effect (the problem)',wide:true,ph:'e.g. O-ring seals nicked at assembly'}]},
 {type:'custom',id:'bones',cls:'printhide',title:'Brainstorm causes by category',hint:'One cause per line. The six categories are the usual 6M set; rename any of them to suit your process. Mark the causes the team thinks are most likely with a <b>*</b> at the start of the line.',html:'<div class="fb-in"></div>',
  init:function(host,api){
   var S=api.state(), d=['People','Machine','Method','Material','Measurement','Environment'];
   var h=''; for(var i=0;i<6;i++){ h+='<div class="fb-cat"><input type="text" data-f="cat'+i+'" value="'+api.esc(S.f['cat'+i]||d[i])+'" aria-label="Category '+(i+1)+' name"><textarea rows="4" data-f="c'+i+'" aria-label="Causes under category '+(i+1)+'" placeholder="One cause per line">'+api.esc(S.f['c'+i]||'')+'</textarea></div>'; }
   host.querySelector('.fb-in').innerHTML=h;
  }},
 {type:'custom',id:'draw',title:'Your fishbone diagram',html:'<div class="svgw fb-svg"></div>'},
 {type:'fields',title:'Ask why, starting from the most likely cause',hint:'Take one starred cause and ask why it happens. Each answer becomes the next question. Stop when you reach something you can act on and verify, which is often fewer or more than five.',fields:[
  {id:'start',label:'Starting cause',wide:true,ph:'Pick one of the starred causes'}]},
 {type:'grid',id:'why',title:'Five whys',rows:5,cols:[
  {id:'n',label:'#',calc:function(r,api){return '';}},
  {id:'q',label:'Why?',w:260,type:'textarea',rows:1,ph:'The question, in your words'},
  {id:'a',label:'Because',w:300,type:'textarea',rows:1},
  {id:'ev',label:'Evidence that this is true',w:220,type:'textarea',rows:1}]},
 {type:'fields',title:'Root cause and how it will be checked',fields:[
  {id:'root',label:'Root cause (proposed)',type:'textarea',wide:true},
  {id:'verify',label:'How it will be verified',type:'textarea',wide:true,hint:'A root cause is a hypothesis until a test shows that removing it removes the effect, and that putting it back brings the effect back.'}]},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="out fw-out"></div>'}
],
update:function(root,api){
 var S=api.state(), d=['People','Machine','Method','Material','Measurement','Environment'];
 var cats=[], W=1200, H=560, mid=H/2, headX=990;
 for(var i=0;i<6;i++) cats.push({n:S.f['cat'+i]||d[i], c:(S.f['c'+i]||'').split('\n').map(function(x){return x.trim();}).filter(Boolean)});
 function t(x,y,s,a,cl){return '<text x="'+x+'" y="'+y+'" text-anchor="'+(a||'start')+'" class="'+(cl||'')+'">'+api.esc(s.length>31?s.slice(0,30)+'…':s)+'</text>';}
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Fishbone diagram"><style>text{font:13px \'Source Serif 4\',Georgia,serif;fill:#16273A}.cat{font:700 13px Archivo,sans-serif;fill:#0F3E68;letter-spacing:.02em}.star{fill:#9C7C1F;font-weight:600}.head{font:700 14px Archivo,sans-serif;fill:#fff}</style>';
 g+='<line x1="30" y1="'+mid+'" x2="'+headX+'" y2="'+mid+'" stroke="#0F3E68" stroke-width="4"/>';
 g+='<rect x="'+headX+'" y="'+(mid-46)+'" width="200" height="92" rx="4" fill="#0F3E68"/>';
 var ef=(S.f.effect||'Effect').split(' '), lines=[''], li=0; ef.forEach(function(w){ if((lines[li]+' '+w).length>22&&lines[li]){li++;lines[li]='';} lines[li]=(lines[li]+' '+w).trim(); });
 lines=lines.slice(0,4); lines.forEach(function(l,k){ g+='<text x="'+(headX+100)+'" y="'+(mid-((lines.length-1)*9)+k*18+5)+'" text-anchor="middle" class="head">'+api.esc(l)+'</text>'; });
 var xs=[380,650,920];
 cats.forEach(function(c,i){
  var top=i<3, x=xs[i%3], y0=top?40:H-40, x0=x-110;
  g+='<line x1="'+x0+'" y1="'+y0+'" x2="'+x+'" y2="'+mid+'" stroke="#9C7C1F" stroke-width="2.5"/>';
  g+='<text x="'+(x0-4)+'" y="'+(top?y0-12:y0+22)+'" class="cat" text-anchor="middle">'+api.esc(c.n.toUpperCase())+'</text>';
  var n=Math.min(c.c.length,8);
  for(var k=0;k<n;k++){
   var fr=(k+1)/(n+1), yy=top?y0+(mid-y0)*fr:y0-(y0-mid)*fr, xx=x0+(x-x0)*fr;
   var s=c.c[k], star=s.charAt(0)==='*'; s=s.replace(/^\*\s*/,'');
   g+='<line x1="'+(xx-8)+'" y1="'+yy+'" x2="'+(xx-50)+'" y2="'+yy+'" stroke="#C6CDD3" stroke-width="1.2"/>';
   var full=(star?'★ ':'')+s, lim=n<=5?2:1, ws=full.split(' '), ln=[''], j=0;
   ws.forEach(function(w){ if((ln[j]+' '+w).trim().length>28&&ln[j]){ if(j+1<lim){j++;ln[j]='';} else { ln[j]+=' '+w; return; } } ln[j]=(ln[j]+' '+w).trim(); });
   ln=ln.map(function(l){return l.length>30?l.slice(0,29)+'…':l;});
   ln.forEach(function(l,q){ g+='<text x="'+(xx-54)+'" y="'+(yy+4+(q-(ln.length-1)/2)*15)+'" text-anchor="end" class="'+(star?'star':'')+'">'+api.esc(l)+'</text>'; });
  }
  if(c.c.length>8) g+=t(x0+20,top?y0+(mid-y0)*0.98-6:y0-(y0-mid)*0.98+16,'+'+(c.c.length-8)+' more','start','');
 });
 g+='</svg>';
 root.querySelector('.fb-svg').innerHTML=g;
 var trs=root.querySelectorAll('table[data-grid="why"] tbody tr');
 trs.forEach(function(tr,i){ var c=tr.querySelector('[data-c="n"]'); if(c) c.textContent=i+1; });
 var f=[], all=[].concat.apply([],cats.map(function(c){return c.c;}));
 var stars=all.filter(function(x){return x.charAt(0)==='*';}).length;
 var empty=cats.filter(function(c){return !c.c.length;}).map(function(c){return c.n;});
 if(all.length){
  f.push(['',all.length+' causes listed, '+stars+' starred as most likely.']);
  if(empty.length&&empty.length<6) f.push(['warn','No causes yet under '+empty.join(', ')+'. An empty bone is sometimes right, but check it was considered rather than skipped.']);
  if(!stars) f.push(['warn','Nothing is starred. Agree which causes are most likely before starting the whys, or the whys will chase whichever cause was mentioned first.']);
 }
 var w=S.g.why.filter(function(r){return r.a;});
 if(w.length){
  var noev=w.filter(function(r){return !r.ev;}).length;
  if(noev) f.push(['warn',noev+' of '+w.length+' answers have no evidence written against them. A chain of whys built on opinion leads to a confident wrong answer.']);
  else f.push(['ok','Every answer in the chain has evidence written against it.']);
 }
 if(S.f.root&&!S.f.verify) f.push(['warn','There is a proposed root cause but no plan to verify it.']);
 var bl=/(human error|operator error|carelessness|not paying attention)/i.exec(S.f.root||'');
 if(bl) f.push(['warn','"'+api.esc(bl[0])+'" is rarely a root cause. Ask why the process allowed the error to happen and go undetected.']);
 root.querySelector('.fw-out').innerHTML=f.length?f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join(''):'<p>Fill in the diagram and the whys, and the checks appear here.</p>';
},
example:{f:{effect:'O-ring seals nicked at assembly',
 c0:'New operators on second shift\nNo training on seal handling',
 c1:'*Burr on the housing cross-drill\nInstallation tool worn',
 c2:'*Seal rolled over the threads, no sleeve used\nWork instruction has no photo',
 c3:'O-ring hardness varies by lot\nHousings from second supplier',
 c4:'Leak test cannot tell a nick from a missing seal\nVisual check only on first piece',
 c5:'Low humidity in winter, seals stiffer',
 start:'Seal rolled over the threads, no sleeve used',
 root:'The assembly method has no protective sleeve for the thread, and the work instruction does not call for one, so seals are dragged over sharp threads on every build.',
 verify:'Build 200 assemblies with a sleeve on line 3 and compare the nick rate with 200 built without. Then remove the sleeve for 50 and check the nicks return.'},
 g:{why:[{q:'Why are seals nicked?',a:'They are dragged over the thread on the housing during installation.',ev:'Nicks are on the outside diameter, in line with the thread pitch (lab, 30 parts).'},
  {q:'Why are they dragged over the thread?',a:'The seal has to pass the thread to reach the groove and nothing covers it.',ev:'Watched 10 installs on line 3.'},
  {q:'Why does nothing cover the thread?',a:'Lines 1 and 2 use a sleeve; line 3 was set up without one.',ev:'Line 1 and 2 setup sheets list the sleeve; line 3 does not.'},
  {q:'Why was line 3 set up without one?',a:'The work instruction does not call for the sleeve, so it was missed at line start-up.',ev:'WI-3107 rev C has no sleeve step.'},
  {q:'',a:'',ev:''}]}}
}
