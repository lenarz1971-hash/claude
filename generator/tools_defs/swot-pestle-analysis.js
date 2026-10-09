{
slug:'swot-pestle-analysis',
sections:[
 {type:'fields',title:'Scope',cols:2,fields:[{id:'org',label:'Organization or unit'},{id:'per',label:'Scan date or period'},{id:'dec',label:'Decision this analysis supports',wide:true,type:'textarea',rows:1}]},
 {type:'grid',id:'p',title:'PESTLE scan (external)',rows:4,hint:'Factors outside the organization that it cannot control. Score <b>impact</b> (how much it would affect you) and <b>likelihood</b> (how likely it is to happen or keep happening in the planning period) from 1 to 5. Each factor becomes an opportunity or a threat in the SWOT.',cols:[
  {id:'cat',label:'Category',type:'select',opts:['Political','Economic','Social','Technological','Legal','Environmental']},
  {id:'fac',label:'Factor',w:280,type:'textarea',rows:1},
  {id:'ot',label:'Opportunity or threat',type:'select',opts:['Opportunity','Threat']},
  {id:'imp',label:'Impact 1-5',type:'number',min:1,max:5},{id:'lik',label:'Likelihood 1-5',type:'number',min:1,max:5},
  {id:'code',label:'Code',calc:function(r,api){return window.TOOL._code(r,api.state());}},
  {id:'sc',label:'Score',calc:function(r,api){var s=window.TOOL._score(r,api);return isNaN(s)?'':'<span class="sw-b '+(s>=15?'hi':s>=8?'md':'lo')+'">'+s+'</span>';}}]},
 {type:'grid',id:'s',title:'Internal assessment',rows:4,hint:'Strengths and weaknesses are inside the organization: capabilities, resources, performance, culture. Give the evidence; a strength nobody can show with data is an opinion.',cols:[
  {id:'type',label:'Strength or weakness',type:'select',opts:['Strength','Weakness']},
  {id:'item',label:'Item',w:280,type:'textarea',rows:1},{id:'ev',label:'Evidence',w:200,type:'textarea',rows:1},
  {id:'code',label:'Code',calc:function(r,api){return window.TOOL._code(r,api.state());}}]},
 {type:'custom',id:'sw',title:'SWOT and ranked external factors',html:'<div class="sw-grid"></div><div class="tgw"><table class="mv sw-rk"></table></div><div class="out sw-out"></div>'},
 {type:'custom',id:'pr',title:'TOWS prompts',hint:'TOWS pairs the internal and external items to generate strategy options. These prompts pair your first-listed internal items with your highest-scoring external factors.',html:'<div class="sw-tows"></div>'},
 {type:'grid',id:'t',title:'TOWS strategies',rows:4,hint:'Write the strategy options. In <b>Uses</b>, list the codes it draws on (for example S2, O1) so the check below can see which factors are covered.',cols:[
  {id:'q',label:'Type',type:'select',opts:['SO','WO','ST','WT']},{id:'str',label:'Strategy option',w:300,type:'textarea',rows:1},{id:'uses',label:'Uses',w:100},{id:'own',label:'Owner',w:130}]},
 {type:'custom',id:'tc',title:'Strategy check',html:'<div class="out sw-tout"></div>'}
],
_score:function(r,api){var i=api.num(r.imp),l=api.num(r.lik);return isNaN(i)||isNaN(l)?NaN:i*l;},
_code:function(r,S){
 var sw=('item' in r)||('type' in r)||('ev' in r), t=sw?r.type:r.ot, list, p; if(!t) return '';
 if(sw){ if(!r.item) return ''; list=S.g.s.filter(function(x){return x.item&&x.type===t;}); p=t==='Strength'?'S':'W'; }
 else { if(!r.fac) return ''; list=S.g.p.filter(function(x){return x.fac&&x.ot===t;}); p=t==='Opportunity'?'O':'T'; }
 var i=list.indexOf(r); return i<0?'':p+(i+1);},
update:function(root,api){
 var S=api.state(), esc=api.esc, T=window.TOOL, cut=function(s,n){s=String(s);return s.length>n?s.slice(0,n-1)+'…':s;};
 var ext=S.g.p.filter(function(r){return r.fac;}).map(function(r){return {r:r,c:T._code(r,S),s:T._score(r,api)};});
 var inn=S.g.s.filter(function(r){return r.item;}).map(function(r){return {r:r,c:T._code(r,S)};});
 var by=function(k){return ext.filter(function(x){return x.r.ot===k;}).sort(function(a,b){return (isNaN(b.s)?-1:b.s)-(isNaN(a.s)?-1:a.s);});};
 var Q={S:inn.filter(function(x){return x.r.type==='Strength';}),W:inn.filter(function(x){return x.r.type==='Weakness';}),O:by('Opportunity'),T:by('Threat')};
 var box=function(k,title,sub,list){ return '<div class="sw-q sw-'+k+'"><h4>'+title+' <small>'+sub+'</small></h4>'+(list.length?'<ul>'+list.map(function(x){return '<li><b>'+x.c+'</b> '+esc(x.r.item||x.r.fac)+(x.s!=null&&!isNaN(x.s)?' <span class="sw-b '+(x.s>=15?'hi':x.s>=8?'md':'lo')+'">'+x.s+'</span>':'')+'</li>';}).join('')+'</ul>':'<p class="sw-e">None listed</p>')+'</div>'; };
 var gEl=root.querySelector('.sw-grid');
 gEl.innerHTML=(ext.length||inn.length)?box('s','Strengths','internal, helpful',Q.S)+box('w','Weaknesses','internal, harmful',Q.W)+box('o','Opportunities','external, helpful',Q.O)+box('t','Threats','external, harmful',Q.T):'';
 var rk=ext.filter(function(x){return !isNaN(x.s);}).sort(function(a,b){return b.s-a.s;});
 root.querySelector('table.sw-rk').innerHTML=rk.length?'<thead><tr><th>Rank</th><th>Code</th><th>External factor</th><th>Category</th><th>I × L</th></tr></thead><tbody>'+rk.map(function(x,i){return '<tr><td class="mt">'+(i+1)+'</td><td class="mt">'+(x.c||'—')+'</td><td class="mo">'+esc(x.r.fac)+'</td><td>'+esc(x.r.cat||'—')+'</td><td class="mt"><span class="sw-b '+(x.s>=15?'hi':x.s>=8?'md':'lo')+'">'+x.s+'</span></td></tr>';}).join('')+'</tbody>':'';
 // flags, SWOT
 var f=[];
 if(!ext.length&&!inn.length){ root.querySelector('.sw-out').innerHTML=api.flags([],'Scan the external environment with PESTLE, then list internal strengths and weaknesses.'); root.querySelector('.sw-tows').innerHTML=''; root.querySelector('.sw-tout').innerHTML=api.flags([],'Add strategy options once the SWOT is filled in.'); return; }
 f.push(['',Q.S.length+' strengths, '+Q.W.length+' weaknesses, '+Q.O.length+' opportunities, '+Q.T.length+' threats.']);
 [['S','strengths'],['W','weaknesses'],['O','opportunities'],['T','threats']].forEach(function(k){ if(!Q[k[0]].length) f.push(['warn','No '+k[1]+' listed. An empty quadrant usually means the scan stopped early, not that there is nothing there.']); });
 var bad=ext.filter(function(x){var i=api.num(x.r.imp),l=api.num(x.r.lik);return isNaN(i)||isNaN(l)||i<1||i>5||l<1||l>5;});
 if(bad.length) f.push(['warn',bad.length+' external factor'+(bad.length>1?'s need':' needs')+' impact and likelihood scores from 1 to 5 before it can be ranked.']);
 var noOT=ext.filter(function(x){return !x.r.ot;}).length, noT=S.g.s.filter(function(r){return r.item&&!r.type;}).length, noC=ext.filter(function(x){return !x.r.cat;}).length;
 if(noOT) f.push(['warn',noOT+' external factor'+(noOT>1?'s are':' is')+' not marked opportunity or threat, so '+(noOT>1?'they do':'it does')+' not appear in the SWOT.']);
 if(noT) f.push(['warn',noT+' internal item'+(noT>1?'s are':' is')+' not marked strength or weakness.']);
 if(noC) f.push(['warn',noC+' external factor'+(noC>1?'s have':' has')+' no PESTLE category.']);
 var cats=['Political','Economic','Social','Technological','Legal','Environmental'], miss=cats.filter(function(c){return !ext.some(function(x){return x.r.cat===c;});});
 if(ext.length){
  if(miss.indexOf('Technological')>=0||miss.indexOf('Legal')>=0) f.push(['warn','No '+miss.filter(function(c){return c==='Technological'||c==='Legal';}).join(' or ').toLowerCase()+' factors considered. Automation, Quality 4.0, AI, cybersecurity, data privacy and new regulation are often among the fastest-changing external forces.']);
  var others=miss.filter(function(c){return c!=='Technological'&&c!=='Legal';}); if(others.length) f.push(['','No '+others.join(', ').toLowerCase()+' factors listed. Confirm that is a conscious judgment.']);
 }
 if(rk.length){ var top=rk.slice(0,3); f.push([top[0].s>=15&&top[0].r.ot==='Threat'?'warn':'','Highest-scoring external factors: '+top.map(function(x){return '<b>'+(x.c||'')+'</b> '+esc(cut(x.r.fac,60))+' ('+x.s+')';}).join('; ')+'.']); }
 f.push(['','Internal or external? Ask whether the item would still exist if your organization did not. A driver shortage would; your own driver turnover would not. "Our old software" is a weakness, not a threat, even though it feels like one.']);
 root.querySelector('.sw-out').innerHTML=api.flags(f);
 // TOWS prompts
 var two=function(a){return a.slice(0,2);}, lab=function(x){return '<b>'+x.c+'</b> '+esc(cut(x.r.item||x.r.fac,48));};
 var P=[['SO','Use which strength to capture which opportunity?',Q.S,Q.O],['WO','Which weakness must be fixed to capture an opportunity?',Q.W,Q.O],['ST','Use which strength to blunt which threat?',Q.S,Q.T],['WT','Which weakness leaves you exposed to a threat? Defend or exit.',Q.W,Q.T]];
 root.querySelector('.sw-tows').innerHTML=P.map(function(p){ return '<div class="sw-p"><h4>'+p[0]+'</h4><p>'+p[1]+'</p>'+(p[2].length&&p[3].length?'<p class="sw-c">'+two(p[2]).map(lab).join('<br>')+'<br><i>with</i><br>'+two(p[3]).map(lab).join('<br>')+'</p>':'<p class="sw-e">Needs items in both quadrants.</p>')+'</div>'; }).join('');
 // strategy check
 var g=[], strs=S.g.t.filter(function(r){return r.str;}), used={}, codes={};
 ext.concat(inn).forEach(function(x){ if(x.c) codes[x.c]=x; });
 strs.forEach(function(r){ (String(r.uses||'').toUpperCase().match(/[SWOT]\d+/g)||[]).forEach(function(c){ used[c]=(used[c]||[]).concat([r]); }); });
 if(!strs.length) g.push(['warn','No strategy options written yet. The SWOT is only useful once it produces choices.']);
 else {
  g.push(['',strs.length+' strategy option'+(strs.length>1?'s':'')+': '+['SO','WO','ST','WT'].map(function(k){return strs.filter(function(r){return r.q===k;}).length+' '+k;}).join(', ')+'.']);
  ['SO','WO','ST','WT'].forEach(function(k){ if(!strs.some(function(r){return r.q===k;})) g.push(['warn','No '+k+' strategy. '+({SO:'These are the options that play to the organization\'s strengths.',WO:'These fix the weaknesses that stand between you and an opportunity.',ST:'These use strengths to reduce exposure to threats.',WT:'These are the defensive moves for where you are weak and exposed.'})[k]]); });
  var unk=Object.keys(used).filter(function(c){return !codes[c];}); if(unk.length) g.push(['warn','Uses refers to codes that do not exist: '+unk.join(', ')+'.']);
  strs.forEach(function(r){ var cs=String(r.uses||'').toUpperCase().match(/[SWOT]\d+/g)||[]; if(r.q&&cs.length){ var need=r.q.split(''), has=need.filter(function(L){return cs.some(function(c){return c[0]===L;});}); if(has.length<2) g.push(['warn','<b>'+esc(cut(r.str,60))+'</b> is marked '+r.q+' but its Uses codes do not include both '+need.join(' and ')+' items.']); } if(!r.q) g.push(['warn','<b>'+esc(cut(r.str,60))+'</b> has no TOWS type.']); });
  rk.filter(function(x){return x.s>=15&&x.c&&!used[x.c];}).forEach(function(x){ g.push(['warn','<b>'+x.c+'</b> '+esc(cut(x.r.fac,70))+' scores '+x.s+' but no strategy option uses it.']); });
  if(!rk.some(function(x){return x.s>=15&&x.c&&!used[x.c];})&&rk.some(function(x){return x.s>=15;})) g.push(['ok','Every external factor scoring 15 or more is addressed by at least one strategy option.']);
 }
 g.push(['','The chosen options become strategic objectives in the plan. Score bands here: 15 to 25 high, 8 to 14 medium, below 8 low. They are a convention of this tool, not a standard.']);
 root.querySelector('.sw-tout').innerHTML=api.flags(g);
},
example:{f:{org:'Saltmarsh Distribution Co. (4 warehouses, 180 tractors)',per:'Annual planning scan, 2026',dec:'Which growth and risk priorities go into the 2027–2029 strategic plan'},
 g:{p:[{cat:'Political',fac:'State-funded port expansion opens a new container berth in 2027',ot:'Opportunity',imp:'4',lik:'4'},
  {cat:'Economic',fac:'Diesel price volatility; fuel is about a quarter of operating cost',ot:'Threat',imp:'4',lik:'4'},
  {cat:'Economic',fac:'Soft national freight volumes holding spot rates down',ot:'Threat',imp:'3',lik:'3'},
  {cat:'Social',fac:'Shrinking pool of CDL applicants; regional driver shortage',ot:'Threat',imp:'5',lik:'4'},
  {cat:'Technological',fac:'Shippers now require real-time shipment visibility through an API',ot:'Opportunity',imp:'4',lik:'5'},
  {cat:'Technological',fac:'Falling cost of autonomous mobile robots for picking',ot:'Opportunity',imp:'3',lik:'3'},
  {cat:'Technological',fac:'Ransomware attacks on logistics firms and their customers',ot:'Threat',imp:'5',lik:'3'},
  {cat:'Environmental',fac:'Large shippers asking for per-shipment emissions data for Scope 3 reporting',ot:'Opportunity',imp:'3',lik:'4'}],
 s:[{type:'Strength',item:'On-time delivery 97.8% over 12 months, best in the regional market',ev:'TMS on-time report; two customer scorecards'},
  {type:'Strength',item:'Four bonded warehouses within 30 miles of the port',ev:'Customs bond records'},
  {type:'Strength',item:'Long-standing customer base; top 10 customers average 9 years',ev:'Contract history'},
  {type:'Weakness',item:'Driver turnover of 68% a year',ev:'HR separation data, 2025'},
  {type:'Weakness',item:'Warehouse management system is 14 years old and has no customer API',ev:'IT asset register'}],
 t:[{q:'SO',str:'Sell bonded warehousing and drayage as one package to importers using the new berth',uses:'S2, O1',own:'VP sales'},
  {q:'WO',str:'Replace the WMS with a cloud system that offers customers a visibility API',uses:'W2, O2',own:'CIO'},
  {q:'ST',str:'Use the on-time record and customer tenure to win fuel surcharge clauses at contract renewal',uses:'S1, S3, T1',own:'CFO'}]}}
}
