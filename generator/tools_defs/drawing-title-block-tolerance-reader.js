{
slug:'drawing-title-block-tolerance-reader',
h:{
 dp:function(v){ var m=String(v==null?'':v).split('.')[1]; return m?m.replace(/[^0-9]/g,'').length:0; },
 gen:function(k,api){ var S=api.state(), v=api.num(S.f[k]); return isNaN(v)||v<0?null:{v:v,s:S.f[k]}; },
 names:{t0:'whole-number',t1:'.X',t2:'.XX',t3:'.XXX',t4:'.XXXX'},
 parse:function(raw,api){
  var s=String(raw||'').trim(); if(!s) return null;
  var w=s.replace(/[−–—]/g,'-').replace(/\s+/g,' '), o={raw:s};
  if(/^\(.*\)$/.test(w)||/\bREF\b/i.test(w)) return {k:'ref',type:'Reference',src:'None. For information only'};
  if(/^\[.*\]$/.test(w)||/\b(BSC|BASIC)\b/i.test(w)) return {k:'bsc',type:'Basic',src:'None in the block. Set by a feature control frame'};
  o.mm=/\bmm\b/i.test(w); o.inch=/("|\bin\b|\binch)/i.test(w);
  w=w.replace(/\b(mm|in|inch)\b|"/gi,'').replace(/^\d+\s?[Xx]\s+/,'').replace(/^(\d+)[Xx](?=\s|[Ø⌀R])/,'').replace(/^(Ø|⌀|DIA\.?|SR|R)\s*/i,'').replace(/\s*(DIA\.?|THRU)\s*$/i,'').trim();
  var N='(\\d*\\.\\d+|\\d+)', m;
  if(/°/.test(w)){
   m=w.match(/^(\d+(?:\.\d+)?)°\s*(?:(\d+)['′]\s*)?(?:(?:±|\+\/-|\+-)\s*(\d*\.?\d+)(°|['′])?\s*(?:(\d+)['′])?)?$/);
   if(!m||(m[4]&&m[4]!=='°'&&m[5])||(m[2]&&+m[2]>=60)||(m[5]&&+m[5]>=60)) return {k:'bad'};
   var a=+m[1]+(m[2]?+m[2]/60:0);
   if(m[3]){ var at=(m[4]&&m[4]!=='°')?+m[3]/60:+m[3]+(m[5]?+m[5]/60:0); return {k:'exp',type:'Angle, stated tolerance',src:'On the dimension',lo:a-at,hi:a+at,d:Math.max(this.dp(m[1]),this.dp(m[3])),u:'°'}; }
   var g=this.gen('tang',api); if(!g) return {k:'need',type:'Angle',need:'angles',src:'Angular tolerance missing from the block'};
   return {k:'gen',type:'Angle, general tolerance',src:'Block: angles ±'+g.s+'°',lo:a-g.v,hi:a+g.v,d:Math.max(this.dp(m[1]),this.dp(g.s)),u:'°'};
  }
  if((m=w.match(new RegExp('^'+N+'\\s?(?:±|\\+/-|\\+-)\\s?'+N+'$')))) return {k:'exp',type:'Bilateral, stated',src:'On the dimension',lo:+m[1]-(+m[2]),hi:+m[1]+(+m[2]),d:Math.max(this.dp(m[1]),this.dp(m[2])),pn:this.dp(m[1]),pm:+m[2],bi:1};
  if((m=w.match(new RegExp('^'+N+'\\s?\\+\\s?'+N+'\\s?/?\\s?-\\s?'+N+'$')))){
   var p=+m[2], q=+m[3], t=(p===0||q===0)?'Unilateral':'Unequal bilateral';
   return {k:'exp',type:t+', stated',src:'On the dimension',lo:+m[1]-q,hi:+m[1]+p,d:Math.max(this.dp(m[1]),this.dp(m[2]),this.dp(m[3]))}; }
  if((m=w.match(/^(\d*\.\d+)\s?(?:-|\/|TO)\s?(\d*\.\d+)$/i))||(m=w.match(/^(\d*\.\d+|\d+)\s?(?:-|TO)\s?(\d*\.\d+|\d+)$/i))){ var x=+m[1], y=+m[2]; return {k:'lim',type:'Limit dimension',src:'On the dimension',lo:Math.min(x,y),hi:Math.max(x,y),d:Math.max(this.dp(m[1]),this.dp(m[2]))}; }
  if((m=w.match(new RegExp('^'+N+'\\s?(MAX|MIN)$','i')))) return {k:'lim',type:'Single limit ('+m[2].toUpperCase()+')',src:'On the dimension',lo:/MIN/i.test(m[2])?+m[1]:null,hi:/MAX/i.test(m[2])?+m[1]:null,d:this.dp(m[1])};
  if((m=w.match(/^(?:(\d+)[- ])?(\d+)\/(\d+)$/))){
   if(+m[3]===0) return {k:'bad'};
   var v=(m[1]?+m[1]:0)+(+m[2])/(+m[3]), gf=this.gen('tfr',api);
   if(!gf) return {k:'need',type:'Fraction',need:'fractions',src:'Fractional tolerance missing from the block'};
   return {k:'gen',type:'Fraction, general tolerance',src:'Block: fractions ±'+gf.s,lo:v-gf.v,hi:v+gf.v,d:Math.max(4,this.dp(gf.s))};
  }
  if((m=w.match(/^(\d*)\.(\d+)$|^(\d+)\.?$/))){
   var pl=m[2]?m[2].length:0, key='t'+pl, val=+w;
   if(pl>4) return {k:'need',type:pl+' decimal places',need:pl+' places',src:'No general tolerance for '+pl+' places'};
   var gg=this.gen(key,api); if(!gg) return {k:'need',type:pl?this.names[key]+' ('+pl+' place'+(pl===1?'':'s')+')':'Whole number',need:this.names[key],src:'No '+this.names[key]+' tolerance in the block'};
   return {k:'gen',type:this.names[key]+' general tolerance',src:'Block: '+this.names[key]+' ±'+gg.s,lo:val-gg.v,hi:val+gg.v,d:Math.max(pl,this.dp(gg.s)),mm:o.mm,inch:o.inch};
  }
  return {k:'bad'};
 },
 dms:function(a){ var s=Math.round(a*3600), d=Math.floor(s/3600), m=Math.floor((s%3600)/60), x=s%60; return d+'°'+(m||x?(m<10?'0':'')+m+'′':'')+(x?(x<10?'0':'')+x+'″':''); },
 lt:function(o){ if(o.lo==null&&o.hi==null) return ''; var u=o.u||'';
  if(u==='°') return this.dms(o.lo)+' to '+this.dms(o.hi);
  if(o.lo==null) return o.hi.toFixed(o.d)+u+' max'; if(o.hi==null) return o.lo.toFixed(o.d)+u+' min';
  return o.lo.toFixed(o.d)+u+' to '+o.hi.toFixed(o.d)+u; }
},
sections:[
 {type:'fields',title:'Title block',cols:3,hint:'Copy these from the title block of the drawing you are inspecting to.',fields:[
  {id:'org',label:'Company'},
  {id:'dwg',label:'Drawing number'},
  {id:'ttl',label:'Drawing title'},
  {id:'drev',label:'Drawing revision'},
  {id:'wrev',label:'Revision on the router, PO or work order'},
  {id:'units',label:'Units',type:'select',opts:['Inch','Millimeter']},
  {id:'scale',label:'Scale',ph:'1:1'},
  {id:'proj',label:'Projection symbol',type:'select',opts:['Third angle','First angle']},
  {id:'std',label:'Dimensioning standard',ph:'ASME Y14.5-2018'}]},
 {type:'fields',title:'General tolerance block',cols:4,hint:'The tolerances that apply to any dimension shown without its own tolerance, chosen by the number of decimal places written. Leave a line blank if the block does not give it. Enter values as plus-or-minus magnitudes in the drawing units.',fields:[
  {id:'t1',label:'.X ±',type:'number',min:0},
  {id:'t2',label:'.XX ±',type:'number',min:0},
  {id:'t3',label:'.XXX ±',type:'number',min:0},
  {id:'t4',label:'.XXXX ±',type:'number',min:0},
  {id:'t0',label:'Whole numbers ±',type:'number',min:0},
  {id:'tfr',label:'Fractions ±',type:'number',min:0,hint:'As a decimal, 1/64 = 0.0156.'},
  {id:'tang',label:'Angles ± (degrees)',type:'number',min:0,hint:'±0°30\' = 0.5'}]},
 {type:'grid',id:'d',title:'Dimensions as written on the drawing',rows:6,hint:'Type each dimension exactly as the drawing shows it. Understood: 2.50, Ø.750 ±.001, .750 +.000/-.002, .6245-.6250 (limits), .188 MAX, 45°, 30°15\', 45° ±0°30\', 10-12, 3/4, 4X Ø.281, R.06, (14.00) for reference and [2.000] or 2.000 BSC for basic.',cols:[
  {id:'dim',label:'Dimension as written',w:190},
  {id:'ft',label:'Feature',type:'textarea',rows:1,w:130},
  {id:'ty',label:'Type',calc:function(r,api){var o=window.TOOL.h.parse(r.dim,api);if(!o)return '';return o.k==='bad'?'<span class="tb-bad">Not recognized</span>':api.esc(o.type);}},
  {id:'src',label:'Tolerance from',calc:function(r,api){var o=window.TOOL.h.parse(r.dim,api);if(!o||o.k==='bad')return '';return '<span class="'+(o.k==='need'?'tb-bad':'')+'">'+api.esc(o.src)+'</span>';}},
  {id:'lim',label:'Limits',calc:function(r,api){var o=window.TOOL.h.parse(r.dim,api);return o&&(o.lo!=null||o.hi!=null)?'<b>'+window.TOOL.h.lt(o)+'</b>':'';}},
  {id:'tt',label:'Total tol',calc:function(r,api){var o=window.TOOL.h.parse(r.dim,api);return o&&o.lo!=null&&o.hi!=null?(o.u==='°'?window.TOOL.h.dms(o.hi-o.lo):(o.hi-o.lo).toFixed(o.d)):'';}}]},
 {type:'custom',id:'out',title:'Reading and checks',html:'<div class="out tb-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), f=[], esc=api.esc;
 var rows=S.g.d.filter(function(r){return String(r.dim||'').trim();});
 var anyBlock=['t0','t1','t2','t3','t4','tfr','tang'].some(function(k){return String(S.f[k]||'').trim();});
 if(!rows.length&&!anyBlock&&!S.f.dwg){ root.querySelector('.tb-out').innerHTML=api.flags([],'Enter the general tolerance block, then type the dimensions as the drawing shows them.'); return; }
 var c={gen:0,exp:0,lim:0,ref:0,bsc:0}, need={}, bad=[], unit=[], expl=[];
 var U=S.f.units==='Millimeter'?'mm':'in';
 rows.forEach(function(r,i){ var o=T.h.parse(r.dim,api), nm='<b>'+esc(r.dim)+'</b>'+(r.ft?' ('+esc(r.ft)+')':'');
  if(o.k==='bad') bad.push(nm); else if(o.k==='need'){ (need[o.need]=need[o.need]||[]).push(nm); } else c[o.k]++;
  if(o.bi){ var g=T.h.gen('t'+Math.min(o.pn,4),api); expl.push(nm+(g?(o.pm<g.v-1e-12?', tighter than':o.pm>g.v+1e-12?', looser than':', equal to')+' the block ±'+esc(g.s):'')); }
  else if(o.k==='exp'&&!o.u) expl.push(nm);
  if((U==='in'&&/\bmm\b/i.test(r.dim))||(U==='mm'&&/("|\bin\b|\binch)/i.test(r.dim))) unit.push(nm);
 });
 if(rows.length) f.push(['ok','<b>'+rows.length+' dimension'+(rows.length>1?'s':'')+' read:</b> '+c.gen+' take the general tolerance block, '+c.exp+' carry a stated tolerance, '+c.lim+' '+(c.lim===1?'is a limit dimension':'are limit dimensions')+', '+c.ref+' reference and '+c.bsc+' basic.']);
 Object.keys(need).forEach(function(k){ f.push(['warn','No general tolerance for <b>'+esc(k)+'</b> in the block, so '+need[k].join(', ')+' '+(need[k].length>1?'have':'has')+' no tolerance you can inspect to. Ask the design authority; do not borrow the nearest line of the block.']); });
 if(bad.length) f.push(['warn','Not recognized: '+bad.join(', ')+'. Check the entry against the formats in the hint.']);
 if(expl.length) f.push(['','A tolerance written on the dimension overrides the block: '+expl.join('; ')+'.']);
 if(c.ref) f.push(['','Reference dimensions, shown in parentheses, are for information. They carry no tolerance and are not used to accept or reject the part.']);
 if(c.bsc) f.push(['','Basic dimensions, shown in a box, are theoretically exact. Their tolerance comes from the geometric tolerance in the feature control frame, not from the block.']);
 var dr=String(S.f.drev||'').trim().toUpperCase(), wr=String(S.f.wrev||'').trim().toUpperCase();
 if(dr&&wr&&dr!==wr) f.push(['warn','Revision mismatch: the drawing is revision <b>'+esc(S.f.drev)+'</b> but the router or order calls for <b>'+esc(S.f.wrev)+'</b>. Stop and confirm which revision applies before inspecting; the tolerances may differ.']);
 else if(!dr) f.push(['warn','Record the drawing revision. An inspection result means nothing without the revision it was judged against.']);
 if(unit.length) f.push(['warn','Unit mismatch: '+unit.join(', ')+' '+(unit.length>1?'are':'is')+' marked in different units from the drawing ('+(U==='in'?'inch':'millimeter')+'). Check for dual dimensioning and convert with 1 in = 25.4 mm exactly.']);
 if(U==='mm') f.push(['','On metric drawings ASME Y14.5 drops trailing zeros (2.5, not 2.50), so the number of decimal places is a weaker signal. Many metric drawings refer instead to ISO 2768 tolerance classes by size range. Use whatever the block states.']);
 var sc=String(S.f.scale||'').trim();
 if(sc){ var sm=sc.match(/^(\d+(?:\.\d+)?)\s*[:\/]\s*(\d+(?:\.\d+)?)$/); f.push(['',(sm&&+sm[1]!==+sm[2]?'Scale '+esc(sc)+' means the views are drawn '+(+sm[1]>+sm[2]?'larger':'smaller')+' than the part. ':'Scale '+esc(sc)+'. ')+'Never measure the print to get a size: work only from the stated dimensions. Drawings commonly say DO NOT SCALE DRAWING for this reason.']); }
 if(S.f.proj==='First angle') f.push(['','<b>First-angle projection</b> (ISO practice in much of Europe and Asia): the object sits between the viewer and the plane, so the top view is drawn below the front view and the right side view to the left of it. In the symbol, the circles (the end view) sit beside the wide end of the truncated cone.']);
 else if(S.f.proj) f.push(['','<b>Third-angle projection</b> (ASME practice in North America): the plane sits between the viewer and the object, so the top view is drawn above the front view and the right side view to the right of it. In the symbol, the circles (the end view) sit beside the narrow end of the truncated cone.']);
 else f.push(['warn','Check the projection symbol in the title block. Reading a first-angle drawing as third angle puts features on the wrong side of the part.']);
 root.querySelector('.tb-out').innerHTML=api.flags(f);
 root.querySelectorAll('table.tg textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });

},
example:{f:{org:'Brightline Food Equipment Co.',dwg:'LFE-2210',ttl:'Conveyor idler shaft',drev:'D',wrev:'C',units:'Inch',scale:'1:2',proj:'Third angle',std:'ASME Y14.5-2018',t1:'0.030',t2:'0.010',t3:'0.005',t4:'',t0:'',tfr:'',tang:'0.5'},
 g:{d:[
  {dim:'12.50',ft:'Shaft overall length'},
  {dim:'1.0',ft:'Keyway length'},
  {dim:'2X Ø.750 +.000/-.002',ft:'Bearing journals'},
  {dim:'.094 +.005/-.000',ft:'Keyway depth'},
  {dim:'Ø1.250 ±.001',ft:'Sprocket seat'},
  {dim:'Ø.6245-.6250',ft:'Seal diameter'},
  {dim:'2.375',ft:'Keyway position from shoulder'},
  {dim:'45°',ft:'End chamfer angle'},
  {dim:'R.06',ft:'Shoulder fillet'},
  {dim:'4X Ø.281',ft:'Flange bolt holes'},
  {dim:'1.2500',ft:'Bearing spacing'},
  {dim:'(14.00)',ft:'Overall length with hub'}]}}
}
