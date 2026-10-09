{
slug:'affinity-diagram',
sections:[
 {type:'fields',title:'The question',cols:3,hint:'Write the question the team is answering as a full sentence. The cards are answers to it, so a clear question gives cards that can be sorted.',fields:[
  {id:'q',label:'Question or issue',wide:true,ph:'e.g. What gets in the way of shipping the KX-200 valve on time?'},
  {id:'team',label:'Team',ph:'Names or roles'},
  {id:'date',label:'Date',type:'date'},
  {id:'src',label:'Where the ideas came from',ph:'e.g. Brainstorm, interviews, complaint log'}]},
 {type:'grid',id:'c',title:'Idea cards',rows:6,hint:'One idea per card, in a few words: a noun and a verb, not one word and not a paragraph. Write all the cards first. Then sort them in silence, and only then type a <b>group code</b> against each card (A, B, C&hellip;).',cols:[
  {id:'t',label:'Idea card',w:300,type:'textarea',rows:1},
  {id:'g',label:'Group',w:60,ph:'A',tip:'The code of the group the card belongs to'},
  {id:'hd',label:'Header of that group',calc:function(r,api){ var g=(r.g||'').trim().toUpperCase(); if(!g) return ''; var h=api.state().g.h.filter(function(x){ return (x.code||'').trim().toUpperCase()===g; })[0]; return h&&h.h?api.esc(h.h.length>34?h.h.slice(0,33)+'…':h.h):'<span style="color:#C0392B">no header yet</span>'; }}]},
 {type:'grid',id:'h',title:'Header cards',rows:3,hint:'Once the groups have settled, write a header card for each: a short phrase that says what the cards in it have in common, so a reader gets the point without reading the cards.',cols:[
  {id:'code',label:'Code',w:60,ph:'A'},
  {id:'h',label:'Header card',w:320,type:'textarea',rows:1},
  {id:'n',label:'Cards',calc:function(r,api){ var g=(r.code||'').trim().toUpperCase(); if(!g) return ''; return api.state().g.c.filter(function(x){ return (x.t||'').trim()&&(x.g||'').trim().toUpperCase()===g; }).length; }}]},
 {type:'custom',id:'dia',title:'The affinity diagram',hint:'Each group is drawn under its header card. Cards not yet in a group sit in the dashed box at the end.',html:'<div class="svgw af-svg"></div>'},
 {type:'custom',id:'chk',title:'Checks',html:'<div class="stat af-stat"></div><div class="out af-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=[], H=[], byCode={};
 S.g.h.forEach(function(r){ var c=(r.code||'').trim().toUpperCase(); if(!c&&!(r.h||'').trim()) return; if(!c){ f.push(['warn','Header "'+api.esc(r.h)+'" has no code, so no card can be put under it.']); return; } if(byCode[c]){ f.push(['warn','Group code <b>'+api.esc(c)+'</b> is used for two headers.']); return; } byCode[c]={code:c,h:(r.h||'').trim(),cards:[]}; H.push(byCode[c]); });
 var cards=S.g.c.filter(function(r){ return (r.t||'').trim(); }), loose=[], noHead={};
 cards.forEach(function(r){ var c=(r.g||'').trim().toUpperCase(), t=r.t.trim();
  if(!c){ loose.push(t); return; }
  if(!byCode[c]){ byCode[c]={code:c,h:'',cards:[],auto:true}; H.push(byCode[c]); noHead[c]=1; }
  byCode[c].cards.push(t); });
 var G=H.filter(function(x){ return x.cards.length; }), empty=H.filter(function(x){ return !x.cards.length; });
 /* drawing */
 var host=root.querySelector('.af-svg');
 function wrap(s,max){ var w=String(s).split(/\s+/).filter(Boolean), L=[], cur=''; w.forEach(function(x){ if((cur+' '+x).trim().length>max&&cur){ L.push(cur); cur=x; } else cur=(cur+' '+x).trim(); }); if(cur) L.push(cur); if(L.length>4){ L=L.slice(0,4); L[3]=L[3].slice(0,max-1)+'…'; } return L.length?L:['']; }
 var cols=G.slice(); if(loose.length) cols.push({code:'',h:'NOT YET GROUPED',cards:loose,loose:true});
 if(!cols.length){ host.innerHTML=''; }
 else {
  var PER=4, CW=196, GAP=14, CH=26, LH=13, W=PER*(CW+GAP)+GAP, y0=10, svg='', rowY=y0;
  for(var i=0;i<cols.length;i+=PER){ var rowH=0;
   cols.slice(i,i+PER).forEach(function(g,j){ var x=GAP+j*(CW+GAP), y=rowY, hl=wrap(g.h||'(header card not written)',27), hh=14+hl.length*LH, inner='';
    var hy=y+18; inner+='<rect x="'+(x+6)+'" y="'+hy+'" width="'+(CW-12)+'" height="'+hh+'" rx="2" fill="'+(g.loose?'#fff':g.h?'#0F3E68':'#FDECEA')+'" stroke="'+(g.loose?'none':g.h?'#0F3E68':'#C0392B')+'" stroke-width="1.4"/>';
    if(g.loose) hy-=10; hl.forEach(function(l,k){ inner+='<text class="'+(g.loose?'lz':g.h?'hd':'hx')+'" x="'+(x+CW/2)+'" y="'+(hy+16+k*LH)+'" text-anchor="middle">'+api.esc(l)+'</text>'; });
    if(g.code) inner+='<text class="cd" x="'+(x+8)+'" y="'+(y+13)+'">GROUP '+api.esc(g.code)+' &middot; '+g.cards.length+' CARD'+(g.cards.length===1?'':'S')+'</text>';
    var cy=hy+hh+8;
    g.cards.forEach(function(t){ var cl=wrap(t,29), ch=10+cl.length*LH; inner+='<rect x="'+(x+12)+'" y="'+cy+'" width="'+(CW-24)+'" height="'+ch+'" fill="#FBF5E3" stroke="#D8B147"/>'; cl.forEach(function(l,k){ inner+='<text x="'+(x+18)+'" y="'+(cy+14+k*LH)+'">'+api.esc(l)+'</text>'; }); cy+=ch+6; });
    var gh=cy-y+4; rowH=Math.max(rowH,gh);
    g._svg=inner; g._x=x; g._y=y; });
   cols.slice(i,i+PER).forEach(function(g){ svg+='<rect x="'+g._x+'" y="'+g._y+'" width="'+CW+'" height="'+rowH+'" fill="'+(g.loose?'#fff':'#F7F6F1')+'" stroke="'+(g.loose?'#C0392B':'#DCDFD8')+'"'+(g.loose?' stroke-dasharray="5 3"':'')+'/>'+g._svg; });
   rowY+=rowH+GAP; }
  host.innerHTML='<svg viewBox="0 0 '+W+' '+rowY+'" role="img" aria-label="Affinity diagram"><style>text{font:11px Archivo,sans-serif;fill:#16273A}.hd{font:700 11.5px Archivo,sans-serif;fill:#fff}.hx{font:700 11.5px Archivo,sans-serif;fill:#C0392B}.lz{font:700 10px \'IBM Plex Mono\',monospace;fill:#C0392B;letter-spacing:.06em}.cd{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}</style>'+svg+'</svg>';
 }
 /* checks */
 var grouped=cards.length-loose.length, sizes=G.map(function(g){ return g.cards.length; }), big=G.slice().sort(function(a,b){ return b.cards.length-a.cards.length; })[0];
 root.querySelector('.af-stat').innerHTML='<div><b>'+cards.length+'</b><span>Cards</span></div><div><b>'+G.length+'</b><span>Groups</span></div><div><b>'+loose.length+'</b><span>Not yet grouped</span></div><div><b>'+(big?big.cards.length:0)+'</b><span>Largest group'+(big?' ('+api.esc(big.code)+')':'')+'</span></div>';
 if(!cards.length){ root.querySelector('.af-out').innerHTML=api.flags(f,'Write the idea cards, then sort them into groups.'); return; }
 if(loose.length) f.push(['warn',loose.length+' card'+(loose.length>1?'s are':' is')+' not in a group yet. Put each one where it fits best, or keep it as a deliberate loner if it really stands apart.']);
 Object.keys(noHead).forEach(function(c){ f.push(['warn','Group <b>'+api.esc(c)+'</b> has '+byCode[c].cards.length+' card'+(byCode[c].cards.length>1?'s':'')+' but no header card. Add it under Header cards.']); });
 empty.forEach(function(g){ f.push(['','Header <b>'+api.esc(g.code)+'</b> ("'+api.esc(g.h)+'") has no cards under it. Drop it, or check the codes typed on the cards.']); });
 var ones=G.filter(function(g){ return g.cards.length===1; });
 if(ones.length) f.push(['warn','Group'+(ones.length>1?'s ':' ')+ones.map(function(g){ return '<b>'+api.esc(g.code)+'</b>'; }).join(', ')+' '+(ones.length>1?'have':'has')+' a single card. A group of one is either a loner that belongs with another group, or a header card in disguise. Look again before keeping it.']);
 if(G.length>10||(cards.length>=8&&G.length>cards.length/2)) f.push(['warn',G.length+' groups for '+cards.length+' cards is a lot. Affinity sorting usually settles at about five to ten groups. Look for groups that are saying the same thing and merge them.']);
 if(G.length===1&&cards.length>=8) f.push(['warn','Every card is in one group. That is a list, not a grouping. Sort again, looking for the natural clusters within it.']);
 if(big&&G.length>1&&big.cards.length>=6&&big.cards.length>2*cards.length/G.length) f.push(['','Group <b>'+api.esc(big.code)+'</b> holds '+big.cards.length+' of the '+grouped+' grouped cards. It may contain two ideas; try splitting it, with its own subheaders.']);
 G.forEach(function(g){ if(g.h&&g.h.split(/\s+/).length<3) f.push(['','Header <b>'+api.esc(g.code)+'</b> ("'+api.esc(g.h)+'") is a label, not a statement. A good header says what the cards add up to, for example "Paperwork waits for one approver" rather than "Approvals".']); });
 var long=cards.filter(function(r){ return r.t.trim().split(/\s+/).length>14; }); if(long.length) f.push(['',long.length+' card'+(long.length>1?'s are':' is')+' longer than about 14 words. Long cards are hard to sort; cut each to one idea.']);
 var seen={}, dup=[]; cards.forEach(function(r){ var k=r.t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); if(seen[k]) dup.push(r.t.trim()); seen[k]=1; });
 if(dup.length) f.push(['','Repeated card'+(dup.length>1?'s':'')+': '+dup.map(function(x){ return '"'+api.esc(x)+'"'; }).join(', ')+'. Keep one; the number of repeats is not a vote.']);
 if(!f.some(function(x){ return x[0]==='warn'; })) f.unshift(['ok','Every card is in a group and every group has a header card.']);
 f.push(['','The diagram organizes ideas; it does not rank them or prove anything. Next steps are usually a vote to pick the groups to work on, an <a href="/tools/interrelationship-digraph.html">interrelationship digraph</a> to see how the groups drive each other, or data to test them.']);
 root.querySelector('.af-out').innerHTML=api.flags(f);
},
example:{f:{q:'What gets in the way of shipping the KX-200 valve on time?',team:'Planner, cell lead, buyer, quality technician, shipping lead',date:'2026-09-17',src:'Brainstorm at the weekly delivery review'},
 g:{c:[
  {t:'Castings arrive late from the foundry',g:'A'},
  {t:'Foundry ships short quantities',g:'A'},
  {t:'No safety stock of bodies',g:'A'},
  {t:'Purchase orders released too late',g:'A'},
  {t:'Test bench down twice a week',g:'B'},
  {t:'Only one person trained on the test bench',g:'B'},
  {t:'Lapping machine waits for spare parts',g:'B'},
  {t:'Seat leak failures sent back for rework',g:'C'},
  {t:'Rework queue has no priority rule',g:'C'},
  {t:'First-off inspection waits for the inspector',g:'C'},
  {t:'Schedule changed several times a week',g:'D'},
  {t:'Rush orders jump the queue',g:'D'},
  {t:'Planner does not see the real stock level',g:'D'},
  {t:'Certificates of conformance typed by hand',g:'E'},
  {t:'Shipping waits for the signed test report',g:'E'},
  {t:'Crates built to order on the day',g:''}],
  h:[{code:'A',h:'Body castings are late or short'},{code:'B',h:'Test and lapping capacity hangs on one machine or one person'},{code:'C',h:'Quality holds and rework stop the flow'},{code:'D',h:'The schedule keeps changing'},{code:'E',h:'Paperwork holds finished valves'}]}}
}
