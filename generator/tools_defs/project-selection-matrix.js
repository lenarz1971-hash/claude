{
slug:'project-selection-matrix',
sections:[
 {type:'fields',title:'Candidate projects',fields:[{id:'p',label:'Projects, one per row',type:'datagrid',cols:[{label:'Candidate project',type:'text'}],rows:5,minRows:3}]},
 {type:'grid',id:'c',title:'Criteria and weights',rows:4,hint:'Weight each criterion 1 to 10 for how much it matters. Mark the ones where a higher score is worse (cost, effort, risk) so they count against a project.',cols:[
  {id:'n',label:'Criterion',w:200},{id:'w',label:'Weight 1-10',type:'number',min:1,max:10},{id:'dir',label:'Higher score is',type:'select',opts:['Better','Worse']},
  {id:'pct',label:'Share of weight',calc:function(r,api){var S=api.state(),t=S.g.c.reduce(function(a,x){var w=api.num(x.w);return a+(isNaN(w)?0:w);},0),w=api.num(r.w);return isNaN(w)||!t?'':Math.round(w/t*100)+'%';}}]},
 {type:'custom',id:'mx',title:'Score each project against each criterion, 1 to 5',hint:'1 = low, 5 = high, on the criterion as written. For a "worse" criterion, score the raw amount (high effort = 5); the matrix reverses it.',html:'<div class="tgw"><table class="mv ps"></table></div>'},
 {type:'custom',id:'res',title:'Ranking',html:'<div class="svgw ps-chart"></div><div class="out ps-out"></div>'}
],
blankX:function(){return {s:{}};},
update:function(root,api){
 var S=api.state(), s=S.x.s||(S.x.s={}), P=api.lines('p'), C=S.g.c.filter(function(r){return r.n;}), n=api.num;
 var tb=root.querySelector('table.ps'), sig=JSON.stringify([P,C.map(function(c){return c.n;})]);
 if(!P.length||!C.length){ tb.innerHTML='<tr><td class="th">Add at least one project and one named criterion.</td></tr>'; tb.dataset.sig=''; root.querySelector('.ps-chart').innerHTML=''; root.querySelector('.ps-out').innerHTML=''; return; }
 if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>Project</th>'+C.map(function(c){return '<th>'+api.esc(c.n)+'</th>';}).join('')+'<th>Weighted score</th></tr></thead><tbody>'+P.map(function(p,i){return '<tr><td class="mo">'+api.esc(p)+'</td>'+C.map(function(c){var k=p+'|'+c.n;return '<td><input type="number" min="1" max="5" data-ps="'+api.esc(k)+'" value="'+(s[k]!=null?s[k]:'')+'" aria-label="'+api.esc(p)+', '+api.esc(c.n)+'"></td>';}).join('')+'<td class="mt" data-row="'+i+'"></td></tr>';}).join('')+'</tbody>';
  tb.querySelectorAll('input[data-ps]').forEach(function(inp){ inp.oninput=function(){ var x=n(inp.value); if(isNaN(x)) delete s[inp.dataset.ps]; else s[inp.dataset.ps]=x; api.save(); }; });
 }
 var f=[], bad=[], W=C.reduce(function(a,c){var w=n(c.w);return a+(isNaN(w)?0:w);},0);
 var res=P.map(function(p){ var t=0, miss=0; C.forEach(function(c){ var w=n(c.w), x=s[p+'|'+c.n]; if(isNaN(w)) return; if(x==null){miss++;return;} if(x<1||x>5||Math.round(x)!==x) bad.push(p+' / '+c.n); var v=c.dir==='Worse'?6-x:x; t+=w*v; }); return {p:p,t:t,pct:W?t/(W*5)*100:0,miss:miss}; });
 res.forEach(function(r,i){ var td=tb.querySelector('[data-row="'+i+'"]'); if(td) td.textContent=W?api.fmt(r.t,0)+' ('+r.pct.toFixed(0)+'%)':''; });
 if(!W) f.push(['warn','Give the criteria weights.']);
 if(bad.length) f.push(['warn','Scores must be whole numbers 1 to 5: '+bad.map(api.esc).join(', ')+'.']);
 var miss=res.filter(function(r){return r.miss;}); if(miss.length) f.push(['warn',miss.length+' project'+(miss.length>1?'s are':' is')+' missing scores, which pulls their total down: '+miss.map(function(r){return api.esc(r.p);}).join(', ')+'.']);
 var srt=res.slice().sort(function(a,b){return b.t-a.t;}), Wd=800, rh=30;
 var g='<svg viewBox="0 0 '+Wd+' '+(srt.length*rh+10)+'" role="img" aria-label="Weighted scores"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.v{font:600 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
 srt.forEach(function(r,i){ var w=(Wd-330)*r.pct/100, lab=r.p.length>36?r.p.slice(0,35)+'…':r.p; g+='<text x="250" y="'+(i*rh+20)+'" text-anchor="end">'+api.esc(lab)+'</text><rect x="260" y="'+(i*rh+6)+'" width="'+w+'" height="20" fill="'+(i===0?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(266+w)+'" y="'+(i*rh+20)+'">'+r.pct.toFixed(0)+'%</text>'; });
 root.querySelector('.ps-chart').innerHTML=W?g+'</svg>':'';
 if(W&&srt[0].t){ f.unshift(['ok','Highest: <b>'+api.esc(srt[0].p)+'</b> at '+srt[0].pct.toFixed(0)+'% of the maximum possible score.']);
  if(srt[1]&&srt[0].pct-srt[1].pct<5) f.push(['','<b>'+api.esc(srt[1].p)+'</b> is within 5 points. A gap that small is inside the noise of the scoring; decide between the two on judgment, not the number.']); }
 f.push(['','The matrix ranks the candidates against the criteria you chose. Check the criteria with the sponsor before trusting the ranking; change a weight and see if the winner changes.']);
 root.querySelector('.ps-out').innerHTML=api.flags(f);
},
example:{f:{p:'Seal-nick rejects on line 3\nPaint rework on covers\nLate deliveries to the OEM\nCrib stock-outs'},
 g:{c:[{n:'Customer impact',w:'10',dir:'Better'},{n:'Annual savings',w:'8',dir:'Better'},{n:'Effort and cost',w:'6',dir:'Worse'},{n:'Data available now',w:'4',dir:'Better'},{n:'Time to result',w:'5',dir:'Worse'}]},
 x:{s:{'Seal-nick rejects on line 3|Customer impact':5,'Seal-nick rejects on line 3|Annual savings':4,'Seal-nick rejects on line 3|Effort and cost':2,'Seal-nick rejects on line 3|Data available now':4,'Seal-nick rejects on line 3|Time to result':2,
  'Paint rework on covers|Customer impact':2,'Paint rework on covers|Annual savings':3,'Paint rework on covers|Effort and cost':2,'Paint rework on covers|Data available now':3,'Paint rework on covers|Time to result':2,
  'Late deliveries to the OEM|Customer impact':5,'Late deliveries to the OEM|Annual savings':3,'Late deliveries to the OEM|Effort and cost':4,'Late deliveries to the OEM|Data available now':2,'Late deliveries to the OEM|Time to result':4,
  'Crib stock-outs|Customer impact':1,'Crib stock-outs|Annual savings':2,'Crib stock-outs|Effort and cost':1,'Crib stock-outs|Data available now':5,'Crib stock-outs|Time to result':1}}}
}
