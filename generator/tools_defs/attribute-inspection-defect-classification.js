{
slug:'attribute-inspection-defect-classification',
sections:[
 {type:'fields',title:'Lot and sampling plan',cols:3,hint:'Take the sample size and acceptance numbers from your sampling plan (for example ANSI/ASQ Z1.4 tables for the lot size, inspection level and AQL of each class). The rejection number is the acceptance number plus one.',fields:[
  {id:'lot',label:'Lot and product',wide:true},
  {id:'N',label:'Lot size',type:'number',min:1},
  {id:'n',label:'Sample size',type:'number',min:1},
  {id:'basis',label:'Count against acceptance numbers',type:'select',opts:['Nonconforming units (defectives)','Nonconformities (defects)']},
  {id:'acC',label:'Ac critical',type:'number',min:0,ph:'0'},
  {id:'acMa',label:'Ac major',type:'number',min:0},
  {id:'acMi',label:'Ac minor',type:'number',min:0},
  {id:'plan',label:'Plan reference',type:'textarea',wide:true,rows:2}]},
 {type:'grid',id:'d',title:'Defects found in the sample',rows:5,hint:'One row per defect type found on a unit. Use the sample unit number so defects on the same unit are grouped. A unit is a defective of the most serious class it contains.',cols:[
  {id:'u',label:'Sample unit',type:'text'},
  {id:'desc',label:'Defect found',w:210,type:'textarea',rows:1},
  {id:'cls',label:'Class',type:'select',opts:['Critical','Major','Minor']},
  {id:'cnt',w:86,label:'Count',type:'number',min:1,tip:'Number of occurrences of this defect on this unit. Blank counts as 1.'}]},
 {type:'custom',id:'res',title:'Lot decision',html:'<div class="tgw"><table class="mv ai"></table></div><div class="out ai-out"></div>'}
],
update:function(root,api){
 var S=api.state(), f=S.f, n=api.num, C=['Critical','Major','Minor'], fl=[];
 var rows=S.g.d.filter(function(r){return r.desc||r.u||r.cls;});
 var N=n(f.N), sn=n(f.n), defBasis=f.basis==='Nonconformities (defects)';
 var ac={Critical:n(f.acC), Major:n(f.acMa), Minor:n(f.acMi)}; if(isNaN(ac.Critical)) ac.Critical=0;
 var dft={Critical:0,Major:0,Minor:0}, units={}, unk=0;
 rows.forEach(function(r,i){ if(C.indexOf(r.cls)<0){ unk++; return; } var c=n(r.cnt); if(isNaN(c)||c<1) c=1; dft[r.cls]+=c;
  var k=String(r.u||'').trim()||('row'+i); units[k]=units[k]||{}; units[k][r.cls]=true; });
 var dv={Critical:0,Major:0,Minor:0}, nu=Object.keys(units).length;
 Object.keys(units).forEach(function(k){ var x=units[k]; dv[x.Critical?'Critical':x.Major?'Major':'Minor']++; });
 var dec={}, rej=[];
 C.forEach(function(c){ var cnt=defBasis?dft[c]:dv[c]; dec[c]=isNaN(ac[c])?null:cnt<=ac[c]; if(dec[c]===false) rej.push(c); });
 var tot=dft.Critical+dft.Major+dft.Minor;
 root.querySelector('table.ai').innerHTML='<thead><tr><th>Class</th><th>Defects</th><th>Defective units</th><th>Ac</th><th>Re</th><th>Decision</th></tr></thead><tbody>'+C.map(function(c){
  return '<tr><td class="mo">'+c+'</td><td class="mt">'+dft[c]+'</td><td class="mt">'+dv[c]+'</td><td class="mt">'+(isNaN(ac[c])?'—':ac[c])+'</td><td class="mt">'+(isNaN(ac[c])?'—':ac[c]+1)+'</td><td>'+(dec[c]===null?'—':dec[c]?'<b class="gp-ok">Accept</b>':'<b class="gp-bad">Reject</b>')+'</td></tr>'; }).join('')+
  '</tbody><tfoot><tr><td>Total</td><td>'+tot+'</td><td>'+nu+'</td><td colspan="3">'+(isNaN(sn)?'':'DPU '+api.fmt(tot/sn,3)+' · '+api.fmt(tot/sn*100,1)+' defects per 100 units')+'</td></tr></tfoot>';
 if(isNaN(sn)) fl.push(['warn','Enter the sample size; without it the rates and the plan cannot be checked.']);
 if(!isNaN(N)&&!isNaN(sn)&&sn>N) fl.push(['warn','The sample size is larger than the lot size. Inspect every unit (100%) instead.']);
 if(isNaN(ac.Major)||isNaN(ac.Minor)) fl.push(['warn','Enter the acceptance numbers for major and minor defects from the sampling plan.']);
 if(unk) fl.push(['warn',unk+' defect row'+(unk>1?'s have':' has')+' no class. Classify every defect before deciding the lot.']);
 if(!isNaN(sn)&&nu>sn) fl.push(['warn','More units have defects ('+nu+') than were sampled ('+sn+'). Check the unit numbers.']);
 if(!isNaN(ac.Major)&&!isNaN(ac.Minor)&&!isNaN(sn)){
  if(rej.length) fl.push(['warn','<b>Reject the lot.</b> '+rej.map(function(c){return c+' '+(defBasis?'defects':'defectives')+': '+(defBasis?dft[c]:dv[c])+', at or above the rejection number '+(ac[c]+1);}).join('. ')+'. Identify and segregate it, and send it to the nonconforming material process for disposition.']);
  else fl.push(['ok','<b>Accept the lot.</b> Every class is at or below its acceptance number. Defective units found in the sample are still replaced or reworked; acceptance applies to the lot, not to them.']);
 }
 if(dft.Critical>0) fl.push(['warn','A critical defect was found. Critical defects are normally handled at zero acceptance with 100% inspection or a stop-and-escalate rule, whatever the sample says about the rest of the lot.']);
 if(rows.length&&!defBasis&&dft.Minor>dv.Minor) fl.push(['','Basis is defectives: a unit with several minor defects counts once, and a unit with a major defect is a major defective even if it also has minor ones. Counted as defects, minors would be '+dft.Minor+'.']);
 if(rows.length&&!isNaN(sn)) fl.push(['','Defectives (nonconforming units) and defects (nonconformities) are different counts: '+nu+' defective unit'+(nu===1?'':'s')+' carried '+tot+' defect'+(tot===1?'':'s')+'. A plan states which one its acceptance numbers apply to.']);
 if(rej.length) fl.push(['','Under Z1.4 switching rules, two lots rejected in any five consecutive lots on original inspection move inspection from normal to tightened.']);
 root.querySelector('.ai-out').innerHTML=api.flags(fl,'Enter the plan and the defects found.');
},
example:{f:{lot:'Lot 26-0418, 38 mm tamper-evident beverage closures, Northgate Closures line 2',N:'1200',n:'80',basis:'Nonconforming units (defectives)',acC:'0',acMa:'2',acMi:'7',plan:'ANSI/ASQ Z1.4 single sampling, normal inspection, general level II, code letter J (n = 80). AQL 1.0 major (Ac 2, Re 3), AQL 4.0 minor (Ac 7, Re 8). Critical: zero acceptance.'},
 g:{d:[{u:'7',desc:'Liner short shot, no seal ring',cls:'Major',cnt:'1'},{u:'12',desc:'Flash on thread start',cls:'Minor',cnt:'1'},{u:'12',desc:'Scuff on top panel',cls:'Minor',cnt:'1'},{u:'23',desc:'Tamper band bridges broken',cls:'Major',cnt:'1'},{u:'23',desc:'Color streak',cls:'Minor',cnt:'1'},{u:'31',desc:'Flash on thread start',cls:'Minor',cnt:'1'},{u:'44',desc:'Black speck in top panel',cls:'Minor',cnt:'1'},{u:'52',desc:'Tamper band torn',cls:'Major',cnt:'1'},{u:'60',desc:'Scuff on skirt',cls:'Minor',cnt:'2'},{u:'71',desc:'Flash on thread start',cls:'Minor',cnt:'1'}]}}
}
