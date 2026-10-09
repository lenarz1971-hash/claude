{
slug:'multivoting-nominal-group-technique',
sections:[
 {type:'fields',title:'Set up the vote',cols:3,fields:[
  {id:'q',label:'Question being decided',wide:true,ph:'e.g. Which cause should the team verify first?'},
  {id:'m',label:'Method',type:'select',opts:['Multivoting','Nominal group technique']},
  {id:'k',label:'Votes or ranks per person',type:'number',min:1,hint:'Multivoting: votes each. NGT: how many items each person ranks.'},
  {id:'opts',label:'Options, one per row',wide:false,type:'datagrid',cols:[{label:'Option',type:'text'}],rows:6,minRows:3},
  {id:'mem',label:'People voting, one per row',wide:false,type:'datagrid',cols:[{label:'Name',type:'text'}],rows:6,minRows:3}]},
 {type:'custom',id:'mx',title:'Votes',hint:'',html:'<p class="th mv-how"></p><div class="tgw"><table class="mv"></table></div>'},
 {type:'custom',id:'res',title:'Result',html:'<div class="svgw mv-chart"></div><div class="out mv-out"></div>'}
],
blankX:function(){return {v:{}};},
update:function(root,api){
 var S=api.state(), v=S.x.v||(S.x.v={}), O=api.lines('opts'), M=api.lines('mem'), ngt=S.f.m==='Nominal group technique';
 var k=Math.round(api.num(S.f.k)); if(isNaN(k)||k<1) k=Math.max(1,Math.ceil(O.length/3));
 root.querySelector('.mv-how').innerHTML=ngt?'Each person ranks their top <b>'+k+'</b>: give <b>'+k+'</b> to their first choice, '+(k-1)+' to the second, and so on. Each number once.':'Each person has <b>'+k+'</b> votes to spread across the options (about a third of the number of options is the usual allowance). More than one vote on the same option is allowed unless the team agrees otherwise.';
 var tb=root.querySelector('table.mv'), sig=JSON.stringify([O,M]);
 if(!O.length||!M.length){ tb.innerHTML='<tr><td class="th">Add at least one option and one person.</td></tr>'; tb.dataset.sig=''; }
 else if(tb.dataset.sig!==sig||!tb.querySelector('input')){
  tb.dataset.sig=sig;
  tb.innerHTML='<thead><tr><th>Option</th>'+M.map(function(m){return '<th>'+api.esc(m)+'</th>';}).join('')+'<th>Total</th></tr></thead><tbody>'+
   O.map(function(o,i){return '<tr><td class="mo">'+api.esc(o)+'</td>'+M.map(function(m){var key=o+'|'+m;return '<td><input type="number" min="0" inputmode="numeric" data-mv="'+api.esc(key)+'" value="'+(v[key]!=null?v[key]:'')+'" aria-label="'+api.esc(m)+', '+api.esc(o)+'"></td>';}).join('')+'<td class="mt" data-row="'+i+'"></td></tr>';}).join('')+
   '</tbody><tfoot><tr><td>Used</td>'+M.map(function(m,j){return '<td class="mu" data-col="'+j+'"></td>';}).join('')+'<td></td></tr></tfoot>';
  tb.querySelectorAll('input[data-mv]').forEach(function(inp){ inp.oninput=function(){ var x=api.num(inp.value); if(isNaN(x)) delete v[inp.dataset.mv]; else v[inp.dataset.mv]=x; api.save(); }; });
 }
 var f=[]; if(!O.length||!M.length){ root.querySelector('.mv-chart').innerHTML=''; root.querySelector('.mv-out').innerHTML=api.flags(f,'Set up the options and people.'); return; }
 var tot=O.map(function(o){ var s=0,c=0; M.forEach(function(m){var x=v[o+'|'+m]; if(x){s+=x;c++;}}); return {o:o,s:s,c:c}; });
 tot.forEach(function(t,i){ var td=tb.querySelector('[data-row="'+i+'"]'); if(td) td.textContent=t.s; });
 M.forEach(function(m,j){ var used=O.reduce(function(a,o){return a+(v[o+'|'+m]||0);},0), td=tb.querySelector('[data-col="'+j+'"]');
  var vals=O.map(function(o){return v[o+'|'+m];}).filter(function(x){return x;});
  var bad=false, msg='';
  if(ngt){ var want=[]; for(var r=1;r<=k;r++) want.push(r); var sv=vals.slice().sort(function(a,b){return a-b;}); if(vals.length&&JSON.stringify(sv)!==JSON.stringify(want.slice(0,Math.min(k,O.length)))){bad=true;msg=api.esc(m)+' should use each rank from 1 to '+Math.min(k,O.length)+' once (has '+(sv.join(', ')||'none')+').';} }
  else if(used>k){bad=true;msg=api.esc(m)+' has used '+used+' votes; the allowance is '+k+'.';}
  if(td){ td.textContent=ngt?vals.length+'/'+Math.min(k,O.length):used+'/'+k; td.style.color=bad?'#C0392B':''; }
  if(bad) f.push(['warn',msg]);
 });
 var srt=tot.slice().sort(function(a,b){return b.s-a.s||b.c-a.c;}), mx=srt[0].s||1, W=800, rh=30;
 var g='<svg viewBox="0 0 '+W+' '+(srt.length*rh+10)+'" role="img" aria-label="Vote totals"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.v{font:600 12px \'IBM Plex Mono\',monospace;fill:#0F3E68}</style>';
 srt.forEach(function(t,i){ var w=(W-420)*t.s/mx, lab=t.o.length>36?t.o.slice(0,35)+'…':t.o; g+='<text x="250" y="'+(i*rh+20)+'" text-anchor="end">'+api.esc(lab)+'</text><rect x="260" y="'+(i*rh+6)+'" width="'+w+'" height="20" fill="'+(i===0&&t.s?'#D8B147':'#0F3E68')+'"/><text class="v" x="'+(266+w)+'" y="'+(i*rh+20)+'">'+t.s+' ('+t.c+' of '+M.length+')</text>'; });
 root.querySelector('.mv-chart').innerHTML=g+'</svg>';
 if(srt[0].s){
  f.unshift(['ok','Top: <b>'+api.esc(srt[0].o)+'</b> with '+srt[0].s+' point'+(srt[0].s===1?'':'s')+' from '+srt[0].c+' of '+M.length+' people.']);
  if(srt[1]&&srt[1].s===srt[0].s) f.push(['warn','Tied at the top with <b>'+api.esc(srt[1].o)+'</b>. Discuss the two, then vote again on just those.']);
  if(srt[0].c<=Math.ceil(M.length/3)&&M.length>2) f.push(['','The top option was chosen by only '+srt[0].c+' people. Check the rest of the team can live with it.']);
  var zero=tot.filter(function(t){return !t.s;}).length; if(zero) f.push(['',zero+' option'+(zero>1?'s got':' got')+' no votes. Those can usually be set aside.']);
 }
 root.querySelector('.mv-out').innerHTML=api.flags(f,'Enter votes and the result appears here.');
},
example:{f:{q:'Which suspected cause of seal nicks should we verify first?',m:'Multivoting',k:'3',
 opts:'Seal dragged over thread, no sleeve\nBurr at the cross-drill\nO-ring hardness varies by lot\nInstallation tool worn\nNew operators on second shift\nLow humidity in winter',
 mem:'Ana\nBen\nCarla\nDev\nEli'},
 x:{v:{'Seal dragged over thread, no sleeve|Ana':2,'Burr at the cross-drill|Ana':1,'Seal dragged over thread, no sleeve|Ben':1,'Burr at the cross-drill|Ben':1,'Installation tool worn|Ben':1,'Seal dragged over thread, no sleeve|Carla':3,'O-ring hardness varies by lot|Dev':2,'Seal dragged over thread, no sleeve|Dev':1,'Burr at the cross-drill|Eli':2,'New operators on second shift|Eli':1}}}
}
