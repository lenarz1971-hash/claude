{
slug:'smed-setup-reduction',
R:function(r,api){
 var n=api.num, t=n(r.t), now=r.now==='External'?'E':'I', act=r.act||'None', ia=n(r.ia), ea=n(r.ea), dflt=false;
 var tt=isFinite(t)?t:0, inNow=now==='I'?tt:0, exNow=now==='E'?tt:0;
 if(!isFinite(ia)&&!isFinite(ea)){
  if(act==='Eliminate'){ ia=0; ea=0; }
  else if(act==='Separate'){ ia=0; ea=tt; }
  else { ia=inNow; ea=exNow; dflt=act==='Convert'||act==='Streamline'; }
 } else { if(!isFinite(ia)) ia=0; if(!isFinite(ea)) ea=0; }
 return {t:t,now:now,act:act,inNow:inNow,exNow:exNow,ia:ia,ea:ea,dflt:dflt};
},
sections:[
 {type:'fields',title:'The changeover',cols:2,hint:'Setup time is measured from the last good piece of the old run to the first good piece of the new one. <b>Internal</b> work can only be done with the machine stopped; <b>external</b> work can be done while it is still running.',fields:[
  {id:'m',label:'Machine or process',ph:'e.g. Bagger 3, vertical form-fill-seal'},
  {id:'co',label:'Changeover studied',ph:'e.g. Flavor and bag-size change'},
  {id:'wk',label:'Changeovers per week',type:'number',min:0},
  {id:'tg',label:'Target internal setup time (min)',type:'number',min:0,ph:'10',hint:'Single-minute exchange of die means under 10 minutes.'}]},
 {type:'grid',id:'e',title:'Setup elements, now and after',rows:5,hint:'List every element from a video or a timed observation, in order. <b>Action</b>: Separate = already possible with the machine running, so move it outside the stop; Convert = change how it is done so it becomes external (preset, duplicate tooling); Streamline = make what is left faster (quick clamps, no adjustments, parallel work); Eliminate = no longer needed. Leave both "after" times blank to carry the element over unchanged (Separate moves it all to external; Eliminate sets it to 0).',cols:[
  {id:'n',label:'Element',w:230,type:'textarea',rows:1},
  {id:'now',label:'Now',type:'select',opts:['Internal','External']},
  {id:'t',label:'Time now (min)',type:'number',min:0},
  {id:'act',label:'Action',type:'select',opts:['None','Separate','Convert','Streamline','Eliminate']},
  {id:'ia',label:'Internal after (min)',type:'number',min:0},
  {id:'ea',label:'External after (min)',type:'number',min:0},
  {id:'how',label:'How',w:230,type:'textarea',rows:1},
  {id:'sv',label:'Downtime saved (min)',calc:function(r,api){ if(!String(r.n||'').trim()&&!isFinite(api.num(r.t))) return ''; var x=window.TOOL.R(r,api), s=x.inNow-x.ia; return s?'<b'+(s<0?' style="color:#C0392B"':'')+'>'+api.fmt(s,1)+'</b>':'0'; }}]},
 {type:'custom',id:'res',title:'Before and after',html:'<div class="stat sm-st"></div><div class="svgw sm-svg"></div>'},
 {type:'custom',id:'chk',title:'What the study says',html:'<div class="out sm-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, F=api.fmt, E=api.esc, f=[], R=window.TOOL.R;
 var STt=root.querySelector('.sm-st'), SV=root.querySelector('.sm-svg'), O=root.querySelector('.sm-out');
 var L=[]; S.g.e.forEach(function(r,i){ var nm=String(r.n||'').trim(); if(!nm&&!isFinite(n(r.t))&&!isFinite(n(r.ia))&&!isFinite(n(r.ea))) return; var x=R(r,api); x.nm=nm||('Element '+(i+1)); L.push(x); });
 if(!L.length){ STt.innerHTML=''; SV.innerHTML=''; O.innerHTML=api.flags([],'List the setup elements with their times to see the before and after setup time.'); return; }
 var b=0, a=0, exB=0, exA=0, by={Separate:0,Convert:0,Streamline:0,Eliminate:0,None:0}, miss=[], dflt=[], incon=[], noAct=[], elimT=[], already=[];
 L.forEach(function(x){
  b+=x.inNow; a+=x.ia; exB+=x.exNow; exA+=x.ea; by[x.act]+=x.inNow-x.ia;
  if(!isFinite(x.t)) miss.push(x.nm);
  if(x.dflt) dflt.push(x.nm);
  if((x.act==='Separate'||x.act==='Convert')&&x.now==='I'&&x.ia>=x.inNow&&isFinite(x.t)&&x.t>0) incon.push(x.nm);
  if(x.act==='Separate'&&x.now==='E') already.push(x.nm);
  if(x.act==='None'&&x.ia<x.inNow) noAct.push(x.nm);
  if(x.act==='Eliminate'&&x.ia+x.ea>0) elimT.push(x.nm);
 });
 var sav=b-a, pct=b>0?sav/b*100:NaN, wk=n(S.f.wk), tg=n(S.f.tg); if(!(tg>0)) tg=10;
 STt.innerHTML=[[F(b,1)+' min','Setup time now (internal)'],[F(a,1)+' min','Setup time after'],[isFinite(pct)?pct.toFixed(1)+'%':'—','Reduction'],[F(sav,1)+' min','Downtime saved per changeover'],[F(exA,1)+' min','External work after'],[wk>0?F(wk*sav/60,1)+' h':'—','Machine hours freed per week']].map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('');
 /* waterfall: internal time from before to after, by SMED stage */
 var steps=[['Setup time now',0,b,'#0F3E68']], cur=b;
 [['Separate','Separate (stage 1)'],['Convert','Convert (stage 2)'],['Streamline','Streamline (stage 3)'],['Eliminate','Eliminate'],['None','No action named']].forEach(function(s){ var v=by[s[0]]; if(Math.abs(v)>1e-9){ steps.push([s[1],cur-v,cur,v>0?'#D8B147':'#C0392B',v]); cur-=v; } });
 steps.push(['Setup time after',0,a,'#0F3E68']);
 steps.push(['External work after',0,exA,'#C6CDD3']);
 var W=760, LX=190, RW=W-LX-90, rh=38, H=steps.length*rh+34, mx=Math.max(b,a,exA,tg,1);
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Setup time waterfall by SMED stage"><style>text{font:13px Archivo,sans-serif;fill:#16273A}.v{font:600 13px Archivo,sans-serif;fill:#0F3E68}.t{font:600 12px Archivo,sans-serif;fill:#C0392B}</style>';
 steps.forEach(function(s,i){ var y=i*rh+10, x1=LX+RW*Math.min(s[1],s[2])/mx, x2=LX+RW*Math.max(s[1],s[2])/mx, w=Math.max(x2-x1,1);
  g+='<text x="'+(LX-10)+'" y="'+(y+19)+'" text-anchor="end"'+(i===0||s[0]==='Setup time after'?' style="font-weight:700"':'')+'>'+s[0]+'</text><rect x="'+x1+'" y="'+(y+3)+'" width="'+w+'" height="24" fill="'+s[3]+'"/>';
  g+='<text class="v" x="'+(x2+6)+'" y="'+(y+20)+'">'+(s.length>4?(s[4]>0?'−':'+')+F(Math.abs(s[4]),1):F(s[2],1))+' min</text>';
  if(i>0&&i<steps.length-1&&s.length>4){ g+='<line x1="'+(LX+RW*s[2]/mx)+'" y1="'+(y-11)+'" x2="'+(LX+RW*s[2]/mx)+'" y2="'+(y+3)+'" stroke="#7C8B99" stroke-dasharray="2 2"/>'; }
 });
 var tx=LX+RW*tg/mx; g+='<line x1="'+tx+'" y1="6" x2="'+tx+'" y2="'+(H-22)+'" stroke="#C0392B" stroke-width="1.5" stroke-dasharray="5 4"/><text class="t" x="'+tx+'" y="'+(H-6)+'" text-anchor="middle">target '+F(tg,0)+' min</text>';
 SV.innerHTML=g+'</svg>';
 if(b>0) f.push([sav>0?'ok':'','Internal setup time goes from <b>'+F(b,1)+'</b> to <b>'+F(a,1)+' minutes</b>, '+(sav===0?'no change yet. Name an action and the after times for each element you plan to improve.':sav>0?'a '+pct.toFixed(1)+'% reduction ('+F(sav,1)+' minutes less downtime per changeover).':'an increase of '+F(-sav,1)+' minutes.')]);
 else f.push(['warn','No internal time is recorded for the current setup. Mark the elements done with the machine stopped as Internal.']);
 var parts=[['Separate','separating'],['Convert','converting'],['Streamline','streamlining'],['Eliminate','eliminating']].filter(function(s){return by[s[0]]>0;}).map(function(s){return F(by[s[0]],1)+' min from '+s[1];});
 if(parts.length) f.push(['','Downtime saved by stage: '+parts.join(', ')+'.']);
 if(b>0){
  if(a<=tg) f.push(['ok','The new setup is within the '+F(tg,0)+'-minute target.']);
  else { var rest=L.filter(function(x){return x.ia>0;}).sort(function(p,q){return q.ia-p.ia;}).slice(0,3); f.push(['','Still '+F(a-tg,1)+' minutes over the '+F(tg,0)+'-minute target. Largest internal elements left: '+rest.map(function(x){return E(x.nm)+' ('+F(x.ia,1)+')';}).join(', ')+'. Ask of each one: can it be done before the stop, can it be done in parallel by a second person, can the adjustment be removed?']); }
 }
 if(wk>0&&sav>0) f.push(['','At '+F(wk,0)+' changeovers a week, '+F(sav,1)+' minutes saved each frees <b>'+F(wk*sav/60,1)+' machine hours a week</b>. Lean practice is to spend part of that on more frequent changeovers and smaller batches, which cuts inventory and lead time, rather than only on longer runs.']);
 if(exA>exB) f.push(['','External work grows from '+F(exB,1)+' to '+F(exA,1)+' minutes. It has to be done while the machine is running, before the stop or after the restart, so check the setup person has the time and a checklist for it, or the stop starts with parts still missing.']);
 if(miss.length) f.push(['warn','No current time for: '+miss.map(E).join(', ')+'.']);
 if(dflt.length) f.push(['warn','Convert or Streamline with no "after" times, carried over unchanged: '+dflt.map(E).join(', ')+'. Enter the expected internal and external minutes.']);
 if(incon.length) f.push(['warn','Marked Separate or Convert but the internal time does not drop: '+incon.map(E).join(', ')+'.']);
 if(already.length) f.push(['warn','Already external, so there is nothing to separate: '+already.map(E).join(', ')+'.']);
 if(noAct.length) f.push(['warn','Internal time drops with no action named: '+noAct.map(E).join(', ')+'. Name the action so the plan says how.']);
 if(elimT.length) f.push(['warn','Marked Eliminate but still has time after: '+elimT.map(E).join(', ')+'.']);
 O.innerHTML=api.flags(f);
},
example:{f:{m:'Bagger 3, vertical form-fill-seal',co:'Flavor and bag-size change (allergen clean)',wk:'10',tg:'10'},
 g:{e:[
  {n:'Fetch film roll, labels and date-code plate from stores',now:'Internal',t:'12',act:'Separate',ia:'0',ea:'12',how:'Staged on a changeover cart before the line stops'},
  {n:'Look for tools and change parts',now:'Internal',t:'8',act:'Eliminate',ia:'0',ea:'0',how:'Shadow board and dedicated change-part cart at the machine'},
  {n:'Remove and clean product-contact parts',now:'Internal',t:'30',act:'Convert',ia:'8',ea:'22',how:'Swap in a second, pre-cleaned set; clean the removed set offline'},
  {n:'Change forming tube and collar for new bag size',now:'Internal',t:'14',act:'Streamline',ia:'6',ea:'0',how:'Quick-release clamps replace four bolts'},
  {n:'Thread new film',now:'Internal',t:'9',act:'Streamline',ia:'5',ea:'0',how:'Splice new roll to the tail of the old film'},
  {n:'Set jaw pressure and seal temperature',now:'Internal',t:'10',act:'Convert',ia:'1',ea:'2',how:'Recipe verified before the stop; loaded in one step'},
  {n:'Trial bags, weigh check and adjust',now:'Internal',t:'16',act:'Streamline',ia:'6',ea:'0',how:'Recipe settings remove trial-and-error; standard 3-bag check'},
  {n:'Line clearance and sign-off',now:'Internal',t:'6',act:'None',ia:'6',ea:'0',how:'Food safety check stays internal'},
  {n:'Return old film and parts to stores',now:'Internal',t:'7',act:'Separate',ia:'0',ea:'7',how:'Done after restart'}]}}
}
