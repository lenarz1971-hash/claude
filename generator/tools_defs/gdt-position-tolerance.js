{
slug:'gdt-position-tolerance',
ev:function(r,api){
 var f=api.state().f, n=api.num, lsl=n(f.lsl), usl=n(f.usl), tol=n(f.ptol), s=n(r.size), dx=n(r.dx), dy=n(r.dy);
 var ext=f.ftype==='External (pin, boss, shaft)', mod=(f.mod||'').charAt(0);
 var o={has:!isNaN(s)||!isNaN(dx)||!isNaN(dy), ok:!isNaN(lsl)&&!isNaN(usl)&&!isNaN(tol)&&lsl<=usl};
 o.mmc=ext?usl:lsl; o.lmc=ext?lsl:usl;
 o.pos=(isNaN(dx)||isNaN(dy))?NaN:2*Math.sqrt(dx*dx+dy*dy);
 o.sizeOk=!isNaN(s)&&o.ok&&s>=lsl-1e-9&&s<=usl+1e-9;
 o.bonus=!o.sizeOk?NaN:(mod==='M'?Math.abs(s-o.mmc):(mod==='L'?Math.abs(s-o.lmc):0));
 o.allow=tol+o.bonus;
 o.v=(!o.ok||isNaN(s)||isNaN(o.pos))?'':(!o.sizeOk?'size':(o.pos<=o.allow+1e-9?'acc':'pos'));
 o.byBonus=o.v==='acc'&&o.pos>tol+1e-9;
 return o;
},
dp:function(api){ return api.state().f.unit==='in'?4:3; },
sections:[
 {type:'fields',title:'Feature control frame and size limits',cols:3,hint:'Copy these from the drawing. The position tolerance is the diameter in the feature control frame; the modifier is the circled M, circled L or no symbol (regardless of feature size).',fields:[
  {id:'part',label:'Part and drawing',wide:true},
  {id:'feat',label:'Feature',ph:'Ø10 hole, 4 places'},
  {id:'ftype',label:'Feature type',type:'select',opts:['Internal (hole, slot)','External (pin, boss, shaft)']},
  {id:'unit',label:'Units',type:'select',opts:['mm','in']},
  {id:'lsl',label:'Size lower limit',type:'number'},
  {id:'usl',label:'Size upper limit',type:'number'},
  {id:'ptol',label:'Position tolerance (diameter)',type:'number',min:0},
  {id:'mod',label:'Material condition modifier',type:'select',opts:['MMC (circled M)','LMC (circled L)','RFS (no modifier)']},
  {id:'dat',label:'Datum reference frame',ph:'A | B | C'}]},
 {type:'grid',id:'m',title:'Measured features',rows:5,hint:'One row per feature measured. X and Y deviation are measured location minus the basic (true) location, in the datum reference frame, with sign.',cols:[
  {id:'id',label:'Feature or part',w:120,type:'textarea',rows:1},
  {id:'size',w:86,label:'Actual size',type:'number'},
  {id:'dx',w:86,label:'X deviation',type:'number'},
  {id:'dy',w:86,label:'Y deviation',type:'number'},
  {id:'pos',label:'Position Ø',calc:function(r,api){var o=window.TOOL.ev(r,api);return isNaN(o.pos)?'':o.pos.toFixed(window.TOOL.dp(api));}},
  {id:'bon',label:'Bonus',calc:function(r,api){var o=window.TOOL.ev(r,api);return isNaN(o.bonus)?(o.v==='size'?'none':''):o.bonus.toFixed(window.TOOL.dp(api));}},
  {id:'all',label:'Allowed Ø',calc:function(r,api){var o=window.TOOL.ev(r,api);return isNaN(o.allow)?'':o.allow.toFixed(window.TOOL.dp(api));}},
  {id:'res',label:'Result',calc:function(r,api){var o=window.TOOL.ev(r,api);return o.v==='acc'?'<b class="gp-ok">Accept</b>':o.v==='size'?'<b class="gp-bad">Reject: size</b>':o.v==='pos'?'<b class="gp-bad">Reject: position</b>':'';}}]},
 {type:'custom',id:'res',title:'Position plot and checks',hint:'Each point is a measured axis, plotted against the true position at the center. The gold circle is the stated tolerance zone; the dashed gray circle is the largest zone the modifier can allow (feature at the opposite size limit).',html:'<div class="svgw gp-svg"></div><div class="out gp-out"></div>'}
],
update:function(root,api){
 var T=window.TOOL, S=api.state(), f=S.f, n=api.num, d=T.dp(api), u=f.unit||'', us=u?' '+api.esc(u):'';
 var lsl=n(f.lsl), usl=n(f.usl), tol=n(f.ptol), mod=(f.mod||'').charAt(0), ext=f.ftype==='External (pin, boss, shaft)';
 var rows=S.g.m.map(function(r){return {r:r,o:T.ev(r,api)};}).filter(function(x){return x.o.has;});
 var fl=[], fx=function(v){return api.fmt(v,d);};
 var setup=!isNaN(lsl)&&!isNaN(usl)&&!isNaN(tol);
 if(!setup){ if(rows.length) fl.push(['warn','Enter the size limits and the position tolerance from the drawing before judging any feature.']); }
 else if(lsl>usl) fl.push(['warn','The size lower limit is larger than the upper limit. Check the entries.']);
 var maxB=setup&&mod!=='R'?usl-lsl:0;
 var svg='';
 var pts=rows.filter(function(x){return !isNaN(x.o.pos);});
 if(setup&&lsl<=usl&&tol>=0&&(tol>0||maxB>0||pts.length)){
  var R=tol/2+maxB/2;
  pts.forEach(function(x){ var dx=n(x.r.dx), dy=n(x.r.dy); R=Math.max(R,Math.abs(dx),Math.abs(dy),x.o.pos/2); });
  if(!(R>0)) R=Math.pow(10,-d);
  R*=1.15; var cx=190, cy=180, sc=150/R, k='font-family="Archivo, sans-serif"';
  svg='<svg viewBox="0 0 640 360" width="100%" role="img" aria-label="Position plot">';
  svg+='<line x1="'+(cx-165)+'" y1="'+cy+'" x2="'+(cx+165)+'" y2="'+cy+'" stroke="#C6CDD3"/><line x1="'+cx+'" y1="'+(cy-165)+'" x2="'+cx+'" y2="'+(cy+165)+'" stroke="#C6CDD3"/>';
  if(maxB>0) svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+((tol+maxB)/2*sc).toFixed(1)+'" fill="none" stroke="#7C8B99" stroke-dasharray="5 4"/>';
  svg+=tol>0?'<circle cx="'+cx+'" cy="'+cy+'" r="'+(tol/2*sc).toFixed(1)+'" fill="#EDEFEA" fill-opacity="0.6" stroke="#D8B147" stroke-width="2"/>':'<circle cx="'+cx+'" cy="'+cy+'" r="3" fill="#D8B147"/>';
  svg+='<text x="'+(cx+168)+'" y="'+(cy+4)+'" font-size="12" fill="#4A5D71" '+k+'>X</text><text x="'+(cx-4)+'" y="'+(cy-168)+'" font-size="12" fill="#4A5D71" '+k+'>Y</text>';
  var boxes=[], rings=[tol/2*sc].concat(maxB>0?[(tol+maxB)/2*sc]:[]), P=pts.map(function(x){ return {x:cx+n(x.r.dx)*sc, y:cy-n(x.r.dy)*sc}; });
  P.forEach(function(p){ boxes.push([p.x-6,p.y-6,p.x+6,p.y+6]); });
  var hit=function(a,b){ return a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3]; };
  var onRing=function(b){ var near=Math.sqrt(Math.pow(Math.max(b[0]-cx,0,cx-b[2]),2)+Math.pow(Math.max(b[1]-cy,0,cy-b[3]),2)), far=Math.sqrt(Math.pow(Math.max(Math.abs(b[0]-cx),Math.abs(b[2]-cx)),2)+Math.pow(Math.max(Math.abs(b[1]-cy),Math.abs(b[3]-cy)),2)); return rings.some(function(r){ return near<=r&&far>=r; }); };
  pts.forEach(function(x,i){ var px=P[i].x, py=P[i].y, c=x.o.v==='acc'?'#1F8C55':'#C0392B', lab=String(x.r.id||i+1).slice(0,10), lw=lab.length*7+2, best=null;
   [[9,-7,0],[9,17,0],[-9,-7,1],[-9,17,1],[9,5,0],[-9,5,1],[0,-11,2],[0,22,2]].forEach(function(cd,j){ var x0=cd[2]===0?px+cd[0]:cd[2]===1?px+cd[0]-lw:px-lw/2, y0=py+cd[1]-11, b=[x0,y0,x0+lw,y0+13];
    var pen=j*0.01+(boxes.some(function(o){return hit(o,b);})?10:0)+(onRing(b)?3:0)+(b[0]<0||b[2]>375||b[1]<0||b[3]>360?20:0);
    if(!best||pen<best.p) best={p:pen,b:b,cd:cd}; });
   boxes.push(best.b);
   svg+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="5" fill="'+c+'"/><text x="'+(best.cd[2]===2?px:px+best.cd[0]).toFixed(1)+'" y="'+(py+best.cd[1]).toFixed(1)+'"'+(best.cd[2]===1?' text-anchor="end"':best.cd[2]===2?' text-anchor="middle"':'')+' font-size="12" font-weight="700" fill="#16273A" '+k+'>'+api.esc(lab)+'</text>'; });
  var lx=390, ly=50, L=function(t,c,y,dash){return '<line x1="'+lx+'" y1="'+y+'" x2="'+(lx+26)+'" y2="'+y+'" stroke="'+c+'" stroke-width="2"'+(dash?' stroke-dasharray="5 4"':'')+'/><text x="'+(lx+34)+'" y="'+(y+4)+'" font-size="13" fill="#16273A" '+k+'>'+t+'</text>';};
  svg+=L('Stated zone Ø'+fx(tol)+us,'#D8B147',ly);
  if(maxB>0) svg+=L('Largest zone Ø'+fx(tol+maxB)+' (full bonus)','#7C8B99',ly+26,true);
  svg+='<circle cx="'+(lx+13)+'" cy="'+(ly+52)+'" r="5" fill="#1F8C55"/><text x="'+(lx+34)+'" y="'+(ly+56)+'" font-size="13" fill="#16273A" '+k+'>Accept</text>';
  svg+='<circle cx="'+(lx+13)+'" cy="'+(ly+78)+'" r="5" fill="#C0392B"/><text x="'+(lx+34)+'" y="'+(ly+82)+'" font-size="13" fill="#16273A" '+k+'>Reject (size or position)</text>';
  svg+='<text x="'+lx+'" y="'+(ly+124)+'" font-size="12" fill="#4A5D71" '+k+'>Scale: center to edge of plot = '+fx(R)+us+'</text>';
  svg+='<text x="'+lx+'" y="'+(ly+144)+'" font-size="12" fill="#4A5D71" '+k+'>A point inside its own allowed zone passes;</text>';
  svg+='<text x="'+lx+'" y="'+(ly+162)+'" font-size="12" fill="#4A5D71" '+k+'>the allowed zone depends on the actual size.</text>';
  svg+='</svg>';
 }
 root.querySelector('.gp-svg').innerHTML=svg;
 if(setup&&lsl<=usl){
  var judged=rows.filter(function(x){return x.o.v;}), acc=judged.filter(function(x){return x.o.v==='acc';});
  if(judged.length) fl.push([acc.length===judged.length?'ok':'warn','<b>'+acc.length+' of '+judged.length+'</b> features accepted. '+(judged.length-acc.length)+' rejected.']);
  rows.forEach(function(x,i){ var o=x.o, nm=api.esc(x.r.id||('Row '+(i+1)));
   if(!o.v) fl.push(['warn','<b>'+nm+'</b>: enter actual size and both deviations to judge this feature.']);
   else if(o.v==='size') fl.push(['warn','<b>'+nm+'</b>: actual size '+fx(n(x.r.size))+' is outside '+fx(lsl)+' to '+fx(usl)+'. Reject on size. A feature out of size earns no bonus, so position is not the deciding check.']);
   else if(o.v==='pos') fl.push(['warn','<b>'+nm+'</b>: position Ø'+fx(o.pos)+' exceeds the allowed Ø'+fx(o.allow)+(o.bonus>0?' (Ø'+fx(tol)+' stated plus '+fx(o.bonus)+' bonus)':'')+'. Reject.']);
   else if(o.byBonus) fl.push(['','<b>'+nm+'</b>: position Ø'+fx(o.pos)+' is larger than the stated Ø'+fx(tol)+' but within Ø'+fx(o.allow)+' because the feature departs '+fx(o.bonus)+' from '+(mod==='M'?'MMC':'LMC')+'. Accept on bonus tolerance.']);
  });
  if(mod==='M'){ var vc=ext?usl+tol:lsl-tol; fl.push(['','Virtual condition: '+(ext?'MMC size plus':'MMC size minus')+' the position tolerance = <b>'+fx(vc)+us+'</b>. A functional gauge '+(ext?'hole':'pin')+' of that size, located at true position, checks position at MMC directly.']); }
  else if(mod==='R') fl.push(['','Regardless of feature size: no bonus. The zone is Ø'+fx(tol)+' whatever the actual size.']);
  else if(mod==='L') fl.push(['','At LMC the bonus grows as the feature moves toward MMC. LMC is typically used to protect minimum wall thickness or edge distance.']);
  if(judged.length) fl.push(['','Judge size first, then position. The position diameter is 2 × √(ΔX² + ΔY²): twice the radial distance from true position, because the tolerance zone is a diameter.']);
 }
 root.querySelector('.gp-out').innerHTML=api.flags(fl,'Enter the drawing callout and at least one measured feature.');
},
example:{f:{part:'Pump mounting plate, drawing MP-4410 rev C',feat:'Ø10 mounting hole, 5 places on a bolt circle',ftype:'Internal (hole, slot)',unit:'mm',lsl:'10.00',usl:'10.10',ptol:'0.20',mod:'MMC (circled M)',dat:'A | B | C'},
 g:{m:[{id:'Hole 1',size:'10.04',dx:'0.06',dy:'-0.05'},{id:'Hole 2',size:'10.02',dx:'0.09',dy:'0.08'},{id:'Hole 3',size:'10.08',dx:'0.10',dy:'0.09'},{id:'Hole 4',size:'9.98',dx:'0.02',dy:'0.01'},{id:'Hole 5',size:'10.06',dx:'-0.07',dy:'0.04'}]}}
}
