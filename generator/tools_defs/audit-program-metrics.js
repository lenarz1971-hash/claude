{
slug:'audit-program-metrics',
sections:[
 {type:'fields',title:'Program and targets',cols:3,fields:[
  {id:'org',label:'Organization'},
  {id:'prog',label:'Audit program',ph:'e.g. Internal ISO 9001 audits'},
  {id:'mgr',label:'Audit program manager'},
  {id:'tOn',label:'On-time completion target (%)',type:'number',min:0,max:100},
  {id:'tClose',label:'CAR closure target (days)',type:'number',min:1},
  {id:'tRep',label:'Repeat finding target, at most (%)',type:'number',min:0,max:100}]},
 {type:'grid',id:'q',title:'Quarterly results',rows:4,hint:'One row per quarter, oldest first. <b>On time</b> counts audits done in the month scheduled; on-time rate is on time ÷ planned, so a skipped audit counts as late. <b>Repeat</b> counts findings this quarter that repeat a finding already closed. <b>Days to close</b> is the average for CARs closed in the quarter. <b>Overdue</b> is open CARs past their due date at quarter end.',cols:[
  {id:'per',label:'Quarter',w:80},
  {id:'pl',label:'Planned',type:'number'},
  {id:'cp',label:'Done',type:'number'},
  {id:'ot',label:'On time',type:'number'},
  {id:'mj',label:'Major',type:'number'},
  {id:'mn',label:'Minor',type:'number'},
  {id:'ofi',label:'OFI',type:'number'},
  {id:'rp',label:'Repeat',type:'number'},
  {id:'co',label:'CARs opened',type:'number'},
  {id:'cc',label:'CARs closed',type:'number'},
  {id:'cd',label:'Days to close',type:'number'},
  {id:'ov',label:'Overdue CARs',type:'number'},
  {id:'da',label:'Auditor days avail.',type:'number'},
  {id:'du',label:'Auditor days used',type:'number'},
  {id:'k1',label:'On-time %',calc:function(r,api){var a=api.num(r.ot),b=api.num(r.pl);return b>0&&!isNaN(a)?api.fmt(a/b*100,0)+'%':'';}},
  {id:'k2',label:'NCs per audit',calc:function(r,api){var n=api.num(r.mj),m=api.num(r.mn),c=api.num(r.cp);if(!(c>0)||isNaN(n)&&isNaN(m))return '';return api.fmt(((n||0)+(m||0))/c,2);}},
  {id:'k3',label:'Repeat %',calc:function(r,api){var n=(api.num(r.mj)||0)+(api.num(r.mn)||0),p=api.num(r.rp);return n>0&&!isNaN(p)?api.fmt(p/n*100,0)+'%':'';}},
  {id:'k4',label:'Utilization',calc:function(r,api){var a=api.num(r.du),b=api.num(r.da);if(!(b>0)||isNaN(a))return '';var u=a/b*100;return '<span class="'+(u>100?'bad':'')+'">'+api.fmt(u,0)+'%</span>';}}]},
 {type:'custom',id:'tr',title:'Trend',html:'<div class="svgw apm-c1"></div><div class="svgw apm-c2"></div>'},
 {type:'custom',id:'sum',title:'Latest quarter against target, and checks',html:'<div class="tgw"><table class="mv apm-t"></table></div><div class="out apm-out"></div>'}
],
update:function(root,api){
 var S=api.state(), F=S.f, esc=api.esc, n=api.num, f=[];
 var c1=root.querySelector('.apm-c1'), c2=root.querySelector('.apm-c2'), tb=root.querySelector('.apm-t'), out=root.querySelector('.apm-out');
 var Q=S.g.q.filter(function(r){return r.per||r.pl||r.cp;}).map(function(r,i){
  var nc=(n(r.mj)||0)+(n(r.mn)||0), pl=n(r.pl), cp=n(r.cp), ot=n(r.ot), rp=n(r.rp), da=n(r.da), du=n(r.du);
  return {r:r,lab:r.per||('Q'+(i+1)),on:pl>0&&!isNaN(ot)?ot/pl*100:NaN,npa:cp>0?nc/cp:NaN,rep:nc>0&&!isNaN(rp)?rp/nc*100:NaN,ut:da>0&&!isNaN(du)?du/da*100:NaN,cd:n(r.cd),ov:n(r.ov),nc:nc}; });
 if(!Q.length){ c1.innerHTML=''; c2.innerHTML=''; tb.innerHTML=''; out.innerHTML=api.flags([],'Add a row for each quarter and the trend charts, the comparison with targets and the checks appear here.'); return; }
 var tOn=n(F.tOn), tCl=n(F.tClose), tRp=n(F.tRep);
 var W=760,H=250,L=52,R=20,T=34,B=36, k=Q.length, step=(W-L-R)/k, cx=function(i){return L+step*(i+0.5);};
 var style='<style>text{font:12px Archivo,sans-serif;fill:#4A5D71}.t{font:700 13px Archivo,sans-serif;fill:#16273A}.v{font:600 11px Archivo,sans-serif;fill:#16273A}</style>';
 /* chart 1: percent lines */
 var Y=function(v){return T+(1-v/100)*(H-T-B);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="On-time completion and repeat findings by quarter">'+style+'<text class="t" x="'+L+'" y="16">On-time completion and repeat findings (%)</text>';
 for(var j=0;j<=4;j++){ g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(j*25)+'" y2="'+Y(j*25)+'" stroke="#DDE1E4"/><text x="'+(L-6)+'" y="'+(Y(j*25)+4)+'" text-anchor="end">'+(j*25)+'</text>'; }
 Q.forEach(function(q,i){ g+='<text x="'+cx(i)+'" y="'+(H-12)+'" text-anchor="middle">'+esc(q.lab)+'</text>'; });
 if(!isNaN(tOn)) g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(tOn)+'" y2="'+Y(tOn)+'" stroke="#0F3E68" stroke-dasharray="5 4" opacity=".6"/>';
 if(!isNaN(tRp)) g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(tRp)+'" y2="'+Y(tRp)+'" stroke="#9C7C1F" stroke-dasharray="5 4" opacity=".7"/>';
 var line=function(key,col){ var d='',dots=''; Q.forEach(function(q,i){ var v=q[key]; if(isNaN(v)) return; var y=Y(Math.min(v,100)); d+=(d?'L':'M')+cx(i).toFixed(1)+' '+y.toFixed(1); dots+='<circle cx="'+cx(i)+'" cy="'+y+'" r="4.5" fill="'+col+'"/><text class="v" x="'+cx(i)+'" y="'+(y-9)+'" text-anchor="middle">'+api.fmt(v,0)+'</text>'; }); return (d?'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2.5"/>':'')+dots; };
 g+=line('on','#0F3E68')+line('rep','#D8B147');
 c1.innerHTML=g+'</svg><p class="apm-key"><span style="background:#0F3E68"></span>on-time completion <span style="background:#D8B147"></span>repeat findings <span class="d"></span>dashed lines: targets</p>';
 /* chart 2: CAR closure bars */
 var mxd=Math.max(10,isNaN(tCl)?0:tCl); Q.forEach(function(q){ if(q.cd>mxd) mxd=q.cd; }); mxd=Math.ceil(mxd*1.15/10)*10;
 var Y2=function(v){return T+(1-v/mxd)*(H-T-B);};
 g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Average days to close CARs by quarter">'+style+'<text class="t" x="'+L+'" y="16">Average days to close a CAR, with overdue CARs at quarter end</text>';
 for(j=0;j<=4;j++){ var v=mxd*j/4; g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y2(v)+'" y2="'+Y2(v)+'" stroke="#DDE1E4"/><text x="'+(L-6)+'" y="'+(Y2(v)+4)+'" text-anchor="end">'+api.fmt(v,0)+'</text>'; }
 Q.forEach(function(q,i){ var bw=Math.min(56,step*0.55); g+='<text x="'+cx(i)+'" y="'+(H-12)+'" text-anchor="middle">'+esc(q.lab)+'</text>';
  if(!isNaN(q.cd)){ var over=!isNaN(tCl)&&q.cd>tCl; g+='<rect x="'+(cx(i)-bw/2)+'" y="'+Y2(q.cd)+'" width="'+bw+'" height="'+(Y2(0)-Y2(q.cd))+'" fill="'+(over?'#C0392B':'#0F3E68')+'" rx="2"/><text class="v" x="'+cx(i)+'" y="'+(Y2(q.cd)-6)+'" text-anchor="middle">'+api.fmt(q.cd,0)+' d'+(isNaN(q.ov)?'':' · '+q.ov+' late')+'</text>'; } });
 if(!isNaN(tCl)) g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y2(tCl)+'" y2="'+Y2(tCl)+'" stroke="#9C7C1F" stroke-width="1.5" stroke-dasharray="5 4"/><text x="'+(W-R)+'" y="'+(Y2(tCl)-5)+'" text-anchor="end" fill="#9C7C1F">target '+api.fmt(tCl,0)+' d</text>';
 c2.innerHTML=g+'</svg>';
 /* latest vs target */
 var last=Q[Q.length-1], first=Q[0];
 var tr=function(a,b,good){ if(isNaN(a)||isNaN(b)||Q.length<2) return '—'; if(Math.abs(b-a)<1e-9) return 'flat'; return (b>a)===good?'better':'worse'; };
 var M=[['On-time completion',api.fmt(first.on,0)+'%',api.fmt(last.on,0)+'%',isNaN(tOn)?'—':'≥ '+api.fmt(tOn,0)+'%',tr(first.on,last.on,true),!isNaN(tOn)&&last.on<tOn],
  ['Nonconformities per audit',api.fmt(first.npa,2),api.fmt(last.npa,2),'—',isNaN(first.npa)||isNaN(last.npa)||Q.length<2?'—':(Math.abs(last.npa-first.npa)<1e-9?'flat':(last.npa>first.npa?'up':'down')),false],
  ['Repeat findings',api.fmt(first.rep,0)+'%',api.fmt(last.rep,0)+'%',isNaN(tRp)?'—':'≤ '+api.fmt(tRp,0)+'%',tr(first.rep,last.rep,false),!isNaN(tRp)&&last.rep>tRp],
  ['Days to close a CAR',api.fmt(first.cd,0),api.fmt(last.cd,0),isNaN(tCl)?'—':'≤ '+api.fmt(tCl,0),tr(first.cd,last.cd,false),!isNaN(tCl)&&last.cd>tCl],
  ['Overdue CARs',api.fmt(first.ov,0),api.fmt(last.ov,0),'0',tr(first.ov,last.ov,false),last.ov>0],
  ['Auditor utilization',api.fmt(first.ut,0)+'%',api.fmt(last.ut,0)+'%','≤ 100%',isNaN(first.ut)||isNaN(last.ut)||Q.length<2?'—':(Math.abs(last.ut-first.ut)<1e-9?'flat':(last.ut>first.ut?'up':'down')),last.ut>100]];
 tb.innerHTML='<thead><tr><th>Measure</th><th>'+esc(first.lab)+'</th><th>'+esc(last.lab)+'</th><th>Target</th><th>Trend</th></tr></thead><tbody>'+M.map(function(m){return '<tr><td class="mo">'+m[0]+'</td><td>'+m[1].replace(/^—%$/,'—')+'</td><td class="mt'+(m[5]?' bad':'')+'">'+m[2].replace(/^—%$/,'—')+'</td><td>'+m[3]+'</td><td>'+m[4]+'</td></tr>';}).join('')+'</tbody>';
 /* checks */
 var evald=[[last.on,tOn],[last.rep,tRp],[last.cd,tCl],[last.ov,0],[last.ut,100]].filter(function(a){return !isNaN(a[0])&&!isNaN(a[1]);}).length;
 var miss=M.filter(function(m){return m[5];}).map(function(m){return m[0].toLowerCase().replace('cars','CARs').replace('a car','a CAR');});
 f.push([miss.length?'warn':'ok','<b>'+esc(last.lab)+'</b>: '+(miss.length?'off target on '+miss.join(', ')+'.':(evald?'every measure that can be compared with its target is on target.':'no measure can be compared with a target yet; enter the targets and the quarter’s results.'))+' Over '+Q.length+' quarter'+(Q.length===1?'':'s')+': '+Q.reduce(function(a,q){return a+(n(q.r.cp)||0);},0)+' audits done of '+Q.reduce(function(a,q){return a+(n(q.r.pl)||0);},0)+' planned, '+Q.reduce(function(a,q){return a+q.nc;},0)+' nonconformities, '+Q.reduce(function(a,q){return a+(n(q.r.rp)||0);},0)+' of them repeats.']);
 var bad=Q.filter(function(q){var r=q.r;return n(r.cp)>n(r.pl)||n(r.ot)>n(r.cp)||n(r.rp)>q.nc;}); if(bad.length) f.push(['warn','Check the counts for '+bad.map(function(q){return esc(q.lab);}).join(', ')+': done exceeds planned, on time exceeds done, or repeats exceed findings. Count unplanned audits on their own line or note them.']);
 var lateQ=Q.filter(function(q){return !isNaN(tOn)&&q.on<tOn;}).length; if(lateQ) f.push(['warn','On-time completion was below target in '+lateQ+' of '+Q.length+' quarters. Late or skipped audits weaken the program’s coverage of the riskiest areas first; find out whether the cause is auditor availability, auditee postponement or an overloaded schedule.']);
 var hr=Q.filter(function(q){return !isNaN(tRp)&&q.rep>tRp;}); if(hr.length) f.push(['warn','Repeat findings above target in '+hr.map(function(q){return esc(q.lab)+' ('+api.fmt(q.rep,0)+'%)';}).join(', ')+'. A repeat means a closed corrective action did not work; review how effectiveness is verified before closure.']);
 var ou=Q.filter(function(q){return q.ut>100;}); if(ou.length) f.push(['warn','Auditors used more days than were available in '+ou.map(function(q){return esc(q.lab)+' ('+api.fmt(q.ut,0)+'%)';}).join(', ')+'. Over-commitment usually shows up next as late audits or thin sampling.']);
 if(Q.length>=3){ var a=Q.slice(-3).map(function(q){return q.ov;}); if(a[0]<a[1]&&a[1]<a[2]) f.push(['warn','Overdue CARs have risen three quarters running.']); }
 if(Q.length>=2&&last.npa<first.npa) f.push(['','Nonconformities per audit fell from '+api.fmt(first.npa,2)+' to '+api.fmt(last.npa,2)+'. Read this with the other measures: fewer findings can mean a maturing system, or shallower audits. Low repeat rates and clean external audits support the first; shrinking audit days and samples point to the second.']);
 f.push(['','ISO 19011:2018 asks the audit program manager to monitor the program (5.7), for example whether schedules and objectives are being met, how audit teams perform and what auditees and audit clients report, and to review and improve it (5.8). Report these measures to management review along with the audit results (ISO 9001 9.3.2).']);
 out.innerHTML=api.flags(f);
},
example:{f:{org:'Harborline Software',prog:'Internal audits, ISO 9001:2015 and ISO/IEC 27001:2022',mgr:'Compliance program manager',tOn:'90',tClose:'45',tRep:'10'},
 g:{q:[
  {per:'2025 Q2',pl:'8',cp:'7',ot:'5',mj:'2',mn:'9',ofi:'6',rp:'2',co:'11',cc:'8',cd:'52',ov:'4',da:'40',du:'34'},
  {per:'2025 Q3',pl:'8',cp:'8',ot:'6',mj:'1',mn:'10',ofi:'7',rp:'2',co:'11',cc:'10',cd:'48',ov:'5',da:'40',du:'38'},
  {per:'2025 Q4',pl:'7',cp:'6',ot:'4',mj:'1',mn:'7',ofi:'5',rp:'1',co:'8',cc:'9',cd:'61',ov:'6',da:'35',du:'31'},
  {per:'2026 Q1',pl:'9',cp:'9',ot:'8',mj:'1',mn:'8',ofi:'8',rp:'1',co:'9',cc:'11',cd:'44',ov:'3',da:'45',du:'43'},
  {per:'2026 Q2',pl:'8',cp:'8',ot:'8',mj:'0',mn:'7',ofi:'9',rp:'2',co:'7',cc:'9',cd:'38',ov:'2',da:'40',du:'41'},
  {per:'2026 Q3',pl:'9',cp:'8',ot:'7',mj:'1',mn:'6',ofi:'7',rp:'0',co:'7',cc:'8',cd:'35',ov:'2',da:'45',du:'40'}]}}
}
