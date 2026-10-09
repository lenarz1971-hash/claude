{
slug:'dmaic-roadmap',
sections:[
 {type:'fields',title:'Your project',cols:3,fields:[
  {id:'name',label:'Project',wide:true,ph:'e.g. Reduce seal-nick rejects on line 3'},
  {id:'lead',label:'Project lead'},{id:'start',label:'Started',type:'date'},{id:'phase',label:'Current phase',type:'select',opts:['Define','Measure','Analyze','Improve','Control','Closed']}]},
 {type:'custom',id:'road',title:'The five phases, and what each must produce',hint:'Tick each output as it is finished. The links open the Guild tool for that output.',html:'<div class="dm-road"></div>'},
 {type:'custom',id:'sum',title:'Where the project stands',html:'<div class="out dm-out"></div>'}
],
blankX:function(){return {done:{}};},
update:function(root,api){
 var S=api.state(), done=S.x.done||(S.x.done={});
 var P=[
  ['Define','What is the problem, for whom, and what does success look like?',[['charter','Project charter agreed and signed','project-charter'],['sipoc','SIPOC: process boundaries, inputs, outputs, customers','sipoc'],['voc','Voice of the customer turned into CTQs','voc-ctq-tree'],['stake','Stakeholders identified and analyzed','stakeholder-analysis'],['comms','Communication plan','communication-plan'],['plan','Project plan and milestones','wbs-gantt-chart'],['tg1','Define phase review passed','dmaic-phase-review-checklist']]],
  ['Measure','How big is the problem today, and can we trust the numbers?',[['dcp','Data collection plan with operational definitions','data-collection-plan'],['msa','Measurement system checked','msa-accuracy-precision'],['grr','Gauge R&R where a gauge is used','/calculators/gage-r-and-r.html'],['stats','Baseline described: center, spread, shape','basic-statistics'],['base','Baseline performance: yield, DPMO or sigma','/calculators/sigma-level-dpmo.html'],['tg2','Measure phase review passed','dmaic-phase-review-checklist']]],
  ['Analyze','What causes the problem, and what is the evidence?',[['fish','Possible causes listed by category','fishbone-5-whys'],['pareto','Biggest contributors identified','/calculators/pareto-chart.html'],['waste','Waste in the process identified','eight-wastes-waste-walk'],['fmea','Failure modes and risks ranked','fmea'],['verify','Root causes verified with data','correlation-regression'],['tg3','Analyze phase review passed','dmaic-phase-review-checklist']]],
  ['Improve','What change removes the cause, and does it work?',[['ideas','Solutions generated and narrowed down','multivoting-nominal-group-technique'],['cba','Costs and benefits compared','cost-benefit-payback'],['pilot','Change piloted with a prediction (PDCA)','kaizen-pdca-planner'],['result','Result compared with the baseline','basic-statistics'],['tg4','Improve phase review passed','dmaic-phase-review-checklist']]],
  ['Control','How will the gain be held after the team leaves?',[['cp','Control plan handed to the process owner','control-plan'],['spc','Control chart running on the key output','/calculators/control-chart.html'],['sop','Work instructions and SOPs updated','work-instruction-sop'],['capa','Open corrective actions closed','corrective-action-capa'],['ben','Benefits confirmed by finance or the sponsor','cost-benefit-payback'],['tg5','Control phase review and project closure','dmaic-phase-review-checklist']]]];
 var h='', tot=0, dn=0, rows=[];
 P.forEach(function(p,i){
  var n=p[2].filter(function(o){return done[p[0]+'.'+o[0]];}).length; tot+=p[2].length; dn+=n; rows.push([p[0],n,p[2].length]);
  h+='<div class="dm-ph'+(S.f.phase===p[0]?' cur':'')+'"><div class="dm-h"><b>'+'DMAIC'.charAt(i)+'</b><div><h4>'+p[0]+'</h4><p>'+p[1]+'</p></div><span class="dm-n">'+n+' / '+p[2].length+'</span></div><ul>'+
   p[2].map(function(o){ var k=p[0]+'.'+o[0], href=o[2].charAt(0)==='/'?o[2]:'/tools/'+o[2]+'.html';
    return '<li><label><input type="checkbox" data-k="'+k+'"'+(done[k]?' checked':'')+'> '+o[1]+'</label> <a class="noprint" href="'+href+'">tool &rarr;</a></li>'; }).join('')+'</ul></div>';
 });
 var host=root.querySelector('.dm-road'); host.innerHTML=h;
 host.querySelectorAll('input[type=checkbox]').forEach(function(c){ c.onchange=function(){ done[c.dataset.k]=c.checked; api.save(); }; });
 var f=[['','<b>'+dn+' of '+tot+'</b> outputs complete. '+rows.map(function(r){return r[0]+' '+r[1]+'/'+r[2];}).join(' &middot; ')]];
 var firstOpen=rows.filter(function(r){return r[1]<r[2];})[0];
 if(S.f.phase&&S.f.phase!=='Closed'&&firstOpen){
  var ci=P.map(function(p){return p[0];}).indexOf(S.f.phase), oi=P.map(function(p){return p[0];}).indexOf(firstOpen[0]);
  if(oi<ci) f.push(['warn','The project is in '+S.f.phase+' but '+firstOpen[0]+' still has '+(firstOpen[2]-firstOpen[1])+' open output'+(firstOpen[2]-firstOpen[1]>1?'s':'')+'. Moving on with gaps behind you is how projects end up solving the wrong problem.']);
 }
 if(S.f.phase==='Closed'&&dn<tot) f.push(['warn','Marked closed with '+(tot-dn)+' outputs not ticked.']);
 root.querySelector('.dm-out').innerHTML=api.flags(f);
},
example:{f:{name:'Reduce seal-nick rejects on line 3',lead:'Quality engineer',start:'2026-07-01',phase:'Analyze'},
 x:{done:{'Define.charter':true,'Define.sipoc':true,'Define.voc':true,'Define.stake':true,'Define.comms':true,'Define.plan':true,'Define.tg1':true,'Measure.dcp':true,'Measure.msa':true,'Measure.grr':true,'Measure.stats':true,'Measure.base':false,'Measure.tg2':false,'Analyze.fish':true,'Analyze.pareto':true}}}
}
