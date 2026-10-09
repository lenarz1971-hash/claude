{
slug:'eight-wastes-waste-walk',
sections:[
 {type:'custom',id:'ref',title:'The eight wastes',hint:'Lean names eight kinds of work that use time and resources and add nothing the customer would pay for. The initials spell <b>DOWNTIME</b>.',html:'<div class="ww-ref"></div>'},
 {type:'fields',title:'The walk',cols:3,fields:[{id:'area',label:'Area walked',wide:true,ph:'e.g. Line 3 assembly and the stores cage'},{id:'date',label:'Date',type:'date'},{id:'who',label:'Walked by'},{id:'per',label:'Cost per hour, for estimates ($)',type:'number',hint:'Optional. A loaded labor rate turns hours into dollars.'}]},
 {type:'grid',id:'obs',title:'What you saw',rows:4,hint:'One line per observation. Write what you saw, not what you think caused it. Estimate the time lost per week if you can; a rough number is better than none.',cols:[
  {id:'what',label:'Observation',w:260,type:'textarea',rows:1},
  {id:'where',label:'Where',w:110},
  {id:'type',label:'Waste',type:'select',opts:['Defects','Overproduction','Waiting','Non-utilized talent','Transportation','Inventory','Motion','Extra-processing']},
  {id:'hrs',label:'Hours lost per week',type:'number',min:0},
  {id:'idea',label:'Idea to remove it',w:200,type:'textarea',rows:1}]},
 {type:'custom',id:'res',title:'What the walk found',html:'<div class="svgw ww-chart"></div><div class="out ww-out"></div>'}
],
update:function(root,api){
 var W=[['D','Defects','Work that has to be scrapped, reworked, sorted or inspected again.'],['O','Overproduction','Making more, or sooner, than the next step needs.'],['W','Waiting','People or parts idle until something else happens.'],['N','Non-utilized talent','Not using people\'s skills, ideas or knowledge of the job.'],['T','Transportation','Moving material or information further than it needs to go.'],['I','Inventory','More material, work in process or stock than the flow needs.'],['M','Motion','People reaching, walking, bending or searching to do the work.'],['E','Extra-processing','Doing more to the product than the customer requires.']];
 var ref=root.querySelector('.ww-ref'); if(!ref.innerHTML) ref.innerHTML=W.map(function(w){return '<div><b>'+w[0]+'</b><span>'+w[1]+'</span><p>'+w[2]+'</p></div>';}).join('');
 var S=api.state(), rows=S.g.obs.filter(function(r){return r.what;}), by={};
 W.forEach(function(w){by[w[1]]={n:0,h:0};});
 rows.forEach(function(r){ if(by[r.type]){ by[r.type].n++; var h=api.num(r.hrs); if(!isNaN(h)) by[r.type].h+=h; } });
 var useH=rows.some(function(r){return !isNaN(api.num(r.hrs));});
 var data=W.map(function(w){return [w[1],useH?by[w[1]].h:by[w[1]].n];}).sort(function(a,b){return b[1]-a[1];});
 var mx=Math.max.apply(null,data.map(function(d){return d[1];}))||1, Wd=800, rh=30;
 var g='<svg viewBox="0 0 '+Wd+' '+(data.length*rh+30)+'" role="img" aria-label="Waste totals"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.v{font:600 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
 data.forEach(function(d,i){ var w=(Wd-260)*d[1]/mx; g+='<text x="170" y="'+(i*rh+20)+'" text-anchor="end">'+d[0]+'</text><rect x="180" y="'+(i*rh+6)+'" width="'+w+'" height="20" fill="'+(i===0&&d[1]?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(186+w)+'" y="'+(i*rh+20)+'">'+api.fmt(d[1],useH?1:0)+(useH?' h':'')+'</text>'; });
 g+='<text x="180" y="'+(data.length*rh+24)+'" class="v" style="fill:#7C8B99">'+(useH?'HOURS LOST PER WEEK':'NUMBER OF OBSERVATIONS')+'</text></svg>';
 root.querySelector('.ww-chart').innerHTML=rows.length?g:'';
 var f=[];
 if(rows.length){
  var tot=rows.reduce(function(a,r){var h=api.num(r.hrs);return a+(isNaN(h)?0:h);},0), rate=api.num(S.f.per);
  f.push(['',rows.length+' observations. '+(useH?'About <b>'+api.fmt(tot,1)+' hours</b> a week'+(!isNaN(rate)?', roughly <b>$'+api.fmt(tot*rate*48,0)+'</b> a year at $'+api.fmt(rate,2)+' an hour over 48 weeks':'')+'.':'')]);
  if(data[0][1]) f.push(['','Largest: <b>'+data[0][0]+'</b>. Start there.']);
  var none=W.filter(function(w){return !by[w[1]].n;}).map(function(w){return w[1];});
  if(none.length&&none.length<8) f.push(['','Not seen on this walk: '+none.join(', ')+'. Check that is because they are absent, not because nobody looked. Non-utilized talent is the one most often missed.']);
  var unt=rows.filter(function(r){return !r.type;}).length; if(unt) f.push(['warn',unt+' observation'+(unt>1?'s have':' has')+' no waste type yet.']);
  var noidea=rows.filter(function(r){return !r.idea;}).length; if(noidea) f.push(['',noidea+' observation'+(noidea>1?'s have':' has')+' no improvement idea yet. That is fine on the walk itself; fill them in with the people who do the work.']);
 }
 root.querySelector('.ww-out').innerHTML=api.flags(f,'Add observations and the totals appear here.');
},
example:{f:{area:'Line 3 assembly and stores',date:'2026-09-09',who:'Yellow Belt team',per:'38'},
 g:{obs:[{what:'Assemblers walk to the crib for a new installation sleeve, about 6 times a shift',where:'Line 3',type:'Motion',hrs:'3',idea:'Keep two spare sleeves on a shadow board at the station'},
  {what:'Housings wait at the leak tester while it runs a 30 s cycle',where:'Final test',type:'Waiting',hrs:'5',idea:'Second test fixture so loading overlaps testing'},
  {what:'Two days of housings stacked at line side',where:'Line 3',type:'Inventory',hrs:'1',idea:'Kanban of half a shift'},
  {what:'Nicked seals replaced and re-tested',where:'Rework bench',type:'Defects',hrs:'9',idea:'Sleeve now standard (CAPA-2026-041)'},
  {what:'Covers polished on the inside face, which nobody sees',where:'Line 3',type:'Extra-processing',hrs:'2',idea:'Ask engineering whether the drawing requires it'},
  {what:'Second-shift lead suggested the sleeve months ago; nobody asked',where:'Line 3',type:'Non-utilized talent',hrs:'',idea:'Weekly 10-minute idea huddle'}]}}
}
