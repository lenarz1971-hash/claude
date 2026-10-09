{
slug:'is-is-not-problem-specification',
DIMS:['What: the object','What: the defect','Where: seen geographically','Where: on the object','When: first seen','When: pattern since then','When: in the life cycle','Extent: how many','Extent: how big','Extent: trend'],
V:['Explains','Only if (assumption)','Does not explain'],
key:function(){ return 'k'+Math.random().toString(36).slice(2,9); },
verdict:function(c){ if(c.N) return 'Eliminated'; if(c.B) return 'Not fully tested'; if(c.A) return 'Possible, with '+c.A+' assumption'+(c.A===1?'':'s'); return 'Explains every IS and IS NOT'; },
sections:[
 {type:'fields',title:'The deviation',cols:3,hint:'Name one object and one defect. If two different defects are mixed in one specification, split them; each has its own cause.',fields:[
  {id:'obj',label:'Object',ph:'e.g. Powder-coated door panel D-14'},
  {id:'dev',label:'Deviation (the defect)',ph:'e.g. Blisters in the coating'},
  {id:'own',label:'Owner and date'},
  {id:'stmt',label:'Problem statement',type:'textarea',wide:true,ph:'Object + deviation, with the extent: e.g. 6% of D-14 door panels from line 1 have coating blisters since 3 Sep.'}]},
 {type:'custom',id:'std',cls:'noprint',title:'Start from the standard questions',hint:'Adds a row for each of the ten Kepner-Tregoe dimensions: what, where, when and extent. Delete the ones that do not apply.',html:'<div class="tgbar"><button type="button" class="dg-btn ki-std">Add the standard questions</button><span class="dg-hint ki-msg"></span></div>',
  init:function(el,api){ el.querySelector('.ki-std').onclick=function(){
   var S=api.state(), T=window.TOOL, have={}, k=0;
   S.g.sp.forEach(function(r){ if(r.dim) have[r.dim]=1; });
   S.g.sp=S.g.sp.filter(function(r){ return r.dim||r.is||r.isnot||r.dist||r.chg; });
   T.DIMS.forEach(function(d){ if(!have[d]){ S.g.sp.push({dim:d,_k:T.key()}); k++; } });
   if(!S.g.sp.length) S.g.sp.push({});
   api.save(); api.rerender(); var m=document.querySelector('#tool .ki-msg'); if(m) m.textContent=k?('Added '+k+' question'+(k===1?'':'s')+'.'):'All ten are already on the list.'; }; }},
 {type:'grid',id:'sp',title:'Specify the problem: IS and IS NOT',rows:3,hint:'<b>IS</b>: where, when and how much the problem is seen. <b>IS NOT</b>: where it could reasonably be, but is not: the closest comparison. A <b>distinction</b> is what is true of the IS and not of the IS NOT. A <b>change</b> is anything that changed in, on or around a distinction, with its date.',cols:[
  {id:'dim',label:'Dimension',type:'select',opts:['What: the object','What: the defect','Where: seen geographically','Where: on the object','When: first seen','When: pattern since then','When: in the life cycle','Extent: how many','Extent: how big','Extent: trend']},
  {id:'is',label:'IS',w:190,type:'textarea',rows:1},
  {id:'isnot',label:'IS NOT (but could be)',w:190,type:'textarea',rows:1},
  {id:'dist',label:'Distinction: what is different about the IS',w:200,type:'textarea',rows:1},
  {id:'chg',label:'Change in or around it (when)',w:190,type:'textarea',rows:1}]},
 {type:'grid',id:'cz',title:'Possible causes',rows:2,hint:'Develop each possible cause from a distinction or a change, and write it as a mechanism: how this change could produce this defect. Then test each one below.',cols:[
  {id:'id',label:'ID',w:46},
  {id:'c',label:'Possible cause (how it would produce the defect)',w:260,type:'textarea',rows:1},
  {id:'from',label:'From which distinction or change',w:170,type:'textarea',rows:1},
  {id:'asm',label:'Assumptions needed',w:180,type:'textarea',rows:1},
  {id:'ver',label:'True cause check',type:'select',opts:['Not yet checked','Confirmed','Not confirmed']}]},
 {type:'custom',id:'mx',title:'Test each cause against the specification',hint:'For each cause and each row, ask: <i>if this is the cause, does it explain why the problem IS here and IS NOT there?</i> A cause must explain both sides. "Only if" means it explains it only with an assumption; write the assumption in the cause\'s row above.',html:'<div class="tgw"><table class="tg ki-mx"></table></div>',
  init:function(el,api){ el.addEventListener('change',function(e){ var s=e.target; if(!s.dataset||!s.dataset.mk) return; var S=api.state(); S.x.m=S.x.m||{}; if(s.value) S.x.m[s.dataset.mk]=s.value; else delete S.x.m[s.dataset.mk]; api.save(); }); }},
 {type:'custom',id:'res',title:'Most probable cause',html:'<div class="stat ki-stat"></div><div class="svgw ki-svg"></div><div class="out ki-out"></div>'}
],
blankX:function(){ return {m:{}}; },
update:function(root,api){
 var T=window.TOOL, S=api.state(), f=[], M=S.x.m=S.x.m||{};
 S.g.sp.forEach(function(r){ if(!r._k) r._k=T.key(); }); S.g.cz.forEach(function(r){ if(!r._k) r._k=T.key(); });
 var sp=S.g.sp.filter(function(r){ return r.is||r.isnot; }), cz=S.g.cz.filter(function(r){ return r.c; });
 function cid(c,i){ return (c.id||'').trim()||('C'+(i+1)); }
 /* matrix */
 var tb=root.querySelector('.ki-mx'), sig=sp.map(function(r){ return r._k+(r.dim||'')+(r.is||'')+(r.isnot||''); }).join('|')+'#'+cz.map(function(c,i){ return c._k+cid(c,i)+c.c; }).join('|');
 function short(s,k){ s=String(s||''); return s.length>k?s.slice(0,k-1)+'…':s; }
 if(tb.dataset.sig!==sig){ tb.dataset.sig=sig;
  if(!sp.length||!cz.length) tb.innerHTML='<tbody><tr><td style="padding:10px">Fill in at least one IS / IS NOT row and one possible cause.</td></tr></tbody>';
  else tb.innerHTML='<thead><tr><th class="rh">Row</th><th>IS / IS NOT</th>'+cz.map(function(c,i){ return '<th title="'+api.esc(c.c)+'">'+api.esc(cid(c,i))+'</th>'; }).join('')+'</tr></thead><tbody>'+sp.map(function(r,ri){
   return '<tr><td class="rh">'+api.esc(short(r.dim||('Row '+(ri+1)),24))+'</td><td style="padding:6px 8px;min-width:200px;font-size:13.5px"><b>IS</b> '+api.esc(short(r.is,70))+'<br><b>NOT</b> '+api.esc(short(r.isnot,70))+'</td>'+cz.map(function(c){ var k=r._k+'_'+c._k, v=M[k]||'';
    return '<td style="min-width:120px"><select data-mk="'+k+'" aria-label="'+api.esc(cid(c,0)+' against '+(r.dim||'row'))+'"><option value=""></option>'+T.V.map(function(o){ return '<option'+(o===v?' selected':'')+'>'+o+'</option>'; }).join('')+'</select></td>'; }).join('')+'</tr>'; }).join('')+'</tbody>'; }
 tb.querySelectorAll('select[data-mk]').forEach(function(s){ var v=s.value, c=v==='Explains'?'#E3F1E8':v==='Does not explain'?'#FDECEA':v?'#FBF3DC':''; s.parentNode.style.background=c; s.style.background=c||'#fff'; });
 /* tally */
 var res=cz.map(function(c,i){ var o={id:cid(c,i),c:c,E:0,A:0,N:0,B:0}; sp.forEach(function(r){ var v=M[r._k+'_'+c._k]; if(v==='Explains') o.E++; else if(v==='Does not explain') o.N++; else if(v) o.A++; else o.B++; }); o.v=T.verdict(o); return o; });
 var live=res.filter(function(o){ return !o.N&&!o.B; }).sort(function(a,b){ return a.A-b.A; }), best=live.length?live.filter(function(o){ return o.A===live[0].A; }):[];
 root.querySelector('.ki-stat').innerHTML='<div><b>'+sp.length+'</b><span>Rows specified</span></div><div><b>'+res.length+'</b><span>Possible causes</span></div><div><b>'+res.filter(function(o){ return o.N; }).length+'</b><span>Eliminated</span></div><div><b>'+(best.length?best.map(function(o){ return api.esc(o.id); }).join(', '):'—')+'</b><span>Most probable cause</span></div>';
 if(res.length&&sp.length){
  var L=70, BW=360, RH=30, W=L+BW+300, H=24+res.length*RH+28, K=[['E','Explains','#2E7D4F'],['A','Only if','#D8B147'],['N','Does not explain','#C0392B'],['B','Not tested','#C9D1DA']];
  var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Causes tested against the specification"><style>text{font:11.5px Archivo,sans-serif;fill:#16273A}.ax{font:700 9px \'IBM Plex Mono\',monospace;fill:#4A5D71}.id{font:700 11px \'IBM Plex Mono\',monospace;fill:#0F3E68}.best{font:700 11.5px Archivo,sans-serif;fill:#2E7D4F}.out{fill:#C0392B}</style>';
  res.forEach(function(o,i){ var y=16+i*RH, x=L; g+='<text class="id" x="'+(L-10)+'" y="'+(y+15)+'" text-anchor="end">'+api.esc(short(o.id,8))+'</text>';
   K.forEach(function(k){ var w=BW*o[k[0]]/sp.length; if(w>0){ g+='<rect x="'+x+'" y="'+(y+3)+'" width="'+w+'" height="'+(RH-10)+'" fill="'+k[2]+'" stroke="#fff"><title>'+k[1]+': '+o[k[0]]+'</title></rect>'; x+=w; } });
   g+='<text x="'+(L+BW+10)+'" y="'+(y+15)+'" class="'+(best.indexOf(o)>=0?'best':o.N?'out':'')+'">'+api.esc(o.v)+'</text>'; });
  var lx=L; K.forEach(function(k){ g+='<rect x="'+lx+'" y="'+(H-16)+'" width="10" height="10" fill="'+k[2]+'"/><text class="ax" x="'+(lx+14)+'" y="'+(H-7)+'">'+k[1].toUpperCase()+'</text>'; lx+=k[1].length*6.6+32; });
  root.querySelector('.ki-svg').innerHTML=g+'</svg>';
 } else root.querySelector('.ki-svg').innerHTML='';
 /* checks */
 var noNot=sp.filter(function(r){ return r.is&&!r.isnot; }); if(noNot.length) f.push(['warn',noNot.length+' row'+(noNot.length===1?' has':'s have')+' an IS but no IS NOT ('+noNot.map(function(r){ return api.esc(r.dim||'unnamed'); }).join(', ')+'). Without the comparison there is nothing to test a cause against; this is the half of the method most often skipped.']);
 var noD=sp.filter(function(r){ return r.is&&r.isnot&&!r.dist; }); if(noD.length) f.push(['','No distinction yet for '+noD.map(function(r){ return api.esc(r.dim||'unnamed'); }).join(', ')+'. Ask: what is unique, odd or different about the IS compared with the IS NOT?']);
 var nD=sp.filter(function(r){ return r.dist; }).length, nC=sp.filter(function(r){ return r.chg; }).length;
 if(nD&&!nC) f.push(['warn','Distinctions are listed but no changes. A problem that appeared at a point in time usually follows a change; look for one in or around each distinction.']);
 var dims={}; sp.forEach(function(r){ if(r.dim) dims[r.dim.split(':')[0]]=1; }); var miss=['What','Where','When','Extent'].filter(function(x){ return !dims[x]; });
 if(sp.length&&miss.length) f.push(['','The specification has nothing for '+miss.join(', ')+'.']);
 var dup={}; res.forEach(function(o){ dup[o.id]=(dup[o.id]||0)+1; }); Object.keys(dup).forEach(function(k){ if(dup[k]>1) f.push(['warn','Cause ID '+api.esc(k)+' is used more than once.']); });
 res.forEach(function(o){ var id='<b>'+api.esc(o.id)+'</b>';
  if(o.N) f.push(['',id+' is eliminated: it does not explain '+o.N+' row'+(o.N===1?'':'s')+' of the specification.']);
  else if(o.B) f.push(['warn',id+' has '+o.B+' row'+(o.B===1?'':'s')+' not tested yet.']);
  if(o.A&&!o.N&&!o.c.asm) f.push(['warn',id+' needs '+o.A+' assumption'+(o.A===1?'':'s')+' but none is written down. Each "only if" must say what has to be true.']);
  if(!o.c.from&&!o.N) f.push(['',id+' is not linked to a distinction or a change. Causes taken from the specification are the strong ones; causes from opinion are tested the same way, but usually fail.']);
  if(o.N&&o.c.ver==='Confirmed') f.push(['warn',id+' is marked confirmed but fails the test against the specification. Check the specification, or the confirmation.']); });
 if(best.length===1) f.push(['ok','Most probable cause: <b>'+api.esc(best[0].id)+'</b>, '+api.esc(best[0].v.toLowerCase())+'. '+(best[0].c.ver==='Confirmed'?'It has been confirmed.':'Next, confirm it is the true cause: check the assumptions, then turn the cause on and off and see the problem follow.')]);
 else if(best.length>1) f.push(['','Causes '+best.map(function(o){ return '<b>'+api.esc(o.id)+'</b>'; }).join(', ')+' survive with the same number of assumptions. Sharpen the specification (a more precise IS NOT) or test both.']);
 else if(res.length&&res.every(function(o){ return o.N; })) f.push(['warn','Every possible cause is eliminated. Go back to the distinctions and changes: the true cause is usually in a change nobody has listed yet.']);
 root.querySelector('.ki-out').innerHTML=api.flags(f,'Specify the problem and list possible causes, and the test results appear here.');
},
example:{f:{obj:'Powder-coated steel door panel D-14',dev:'Blisters in the coating, 1 to 3 mm',own:'Process engineer, coating; 22 Sep 2026',stmt:'Since 3 September, 6% of D-14 door panels coated on line 1 have blisters in the lower third of the face.'},
 g:{sp:[
  {_k:'s1',dim:'What: the object',is:'D-14 door panels, 2.0 mm steel',isnot:'D-12 side panels, 1.2 mm steel, same line and powder',dist:'D-14 is thicker: more mass, slower to heat and to dry',chg:'None to the part'},
  {_k:'s2',dim:'What: the defect',is:'Blisters 1 to 3 mm, coating intact around them',isnot:'Peeling, orange peel, or failed cross-hatch adhesion',dist:'Blisters come from gas or moisture under the film during cure',chg:''},
  {_k:'s3',dim:'Where: on the object',is:'Lower third of the panel as hung',isnot:'Upper two-thirds, or the edges',dist:'Rinse water drains down and collects at the lower edge',chg:''},
  {_k:'s4',dim:'Where: seen geographically',is:'Coating line 1',isnot:'Coating line 2 (same powder, same pretreatment chemistry)',dist:'Line 1 has its own dry-off oven',chg:'Line 1 dry-off oven setpoint lowered from 180 to 150 °C on 3 Sep (energy project)'},
  {_k:'s5',dim:'When: first seen',is:'3 Sep, night shift',isnot:'Before 3 Sep',dist:'First day after the dry-off oven change',chg:'Dry-off setpoint change, 3 Sep'},
  {_k:'s6',dim:'When: pattern since then',is:'First two hours after each start-up, every shift',isnot:'Later in the shift',dist:'Oven and parts are coolest after start-up',chg:''},
  {_k:'s7',dim:'Extent: how many',is:'6% of D-14 panels since 3 Sep',isnot:'0.3% before (the usual rate)',dist:'',chg:''}],
 cz:[
  {_k:'c1',id:'C1',c:'Rinse water not fully dried off at the lower setpoint; it boils out under the powder film during cure',from:'Dry-off setpoint lowered 3 Sep; lower edge; thick panels; start-up',asm:'Assumes line 2 dry-off runs hotter than 150 °C',ver:'Not yet checked'},
  {_k:'c2',id:'C2',c:'Contaminated or damp powder lot',from:'Opinion: the powder lot changed in August',asm:'',ver:'Not yet checked'},
  {_k:'c3',id:'C3',c:'Cure oven running too cool on line 1',from:'Line 1 only',asm:'',ver:'Not yet checked'},
  {_k:'c4',id:'C4',c:'Night-shift sprayer applying the film too thick',from:'First seen on night shift',asm:'',ver:'Not yet checked'}]},
 x:{m:{
  s1_c1:'Explains',s2_c1:'Explains',s3_c1:'Explains',s4_c1:'Only if (assumption)',s5_c1:'Explains',s6_c1:'Explains',s7_c1:'Explains',
  s1_c2:'Does not explain',s2_c2:'Explains',s3_c2:'Does not explain',s4_c2:'Does not explain',s5_c2:'Only if (assumption)',s6_c2:'Does not explain',s7_c2:'Only if (assumption)',
  s1_c3:'Only if (assumption)',s2_c3:'Only if (assumption)',s3_c3:'Does not explain',s4_c3:'Explains',s5_c3:'Does not explain',s6_c3:'Explains',s7_c3:'Only if (assumption)',
  s1_c4:'Only if (assumption)',s2_c4:'Explains',s3_c4:'Only if (assumption)',s4_c4:'Does not explain',s5_c4:'Explains',s6_c4:'Does not explain',s7_c4:'Only if (assumption)'}}}
}
