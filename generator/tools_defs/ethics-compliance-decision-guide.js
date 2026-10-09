{
slug:'ethics-compliance-decision-guide',
sections:[
 {type:'fields',title:'The situation',cols:3,hint:'This worksheet structures a decision. It is not legal advice; involve your legal or compliance function whenever law, contracts or possible wrongdoing are involved.',fields:[
  {id:'sit',label:'What is happening',type:'textarea',wide:true,rows:3},
  {id:'facts',label:'Facts known, and what is still assumed',type:'textarea',wide:true,rows:2},
  {id:'who',label:'Decision owner'},
  {id:'date',label:'Date raised',type:'date'},
  {id:'by',label:'Decision needed by',type:'date'}]},
 {type:'grid',id:'st',title:'Stakeholders affected',rows:3,cols:[
  {id:'s',label:'Stakeholder',w:180,type:'textarea',rows:1},
  {id:'how',label:'How they are affected',w:300,type:'textarea',rows:1},
  {id:'harm',label:'Harm if handled badly',type:'select',opts:['Low','Medium','High']}]},
 {type:'fields',title:'Key facts for compliance',cols:3,fields:[
  {id:'coi',label:'Is anyone involved in a conflict of interest?',type:'select',opts:['No','Yes','Unsure']},
  {id:'coid',label:'Has it been disclosed?',type:'select',opts:['Yes','No','Not applicable']},
  {id:'conf',label:'Is confidential or proprietary information involved?',type:'select',opts:['No','Yes','Unsure']},
  {id:'nda',label:'Is an NDA or confidentiality agreement in place?',type:'select',opts:['Yes','No','Not sure','Not applicable']},
  {id:'ill',label:'Is illegal activity suspected?',type:'select',opts:['No','Yes','Unsure']},
  {id:'gift',label:'Gift, payment or hospitality offered?',type:'select',opts:['No','Yes, declined','Yes, accepted','Yes, undecided']}]},
 {type:'custom',id:'ob',title:'Obligations and compliance areas',hint:'The first list paraphrases the themes of professional codes of ethics such as ASQ\'s. It is not the code\'s text; read the current ASQ Code of Ethics at asq.org and your own organization\'s code of conduct. The second list covers common compliance areas.',html:'<div class="tgw"><table class="mv ec ec-ob"></table></div><div class="tgw"><table class="mv ec ec-ca"></table></div>'},
 {type:'grid',id:'o',title:'Options and tests',rows:3,hint:'List every realistic option, including the ones you would not choose. <b>Legal?</b> Does it comply with law and regulation? <b>Code and policy?</b> Is it consistent with the code of ethics, company policy and contracts? <b>Newspaper test:</b> would you be comfortable if it were reported publicly, with your name on it?',cols:[
  {id:'opt',label:'Option',w:230,type:'textarea',rows:1},
  {id:'leg',label:'Legal?',type:'select',opts:['Yes','No','Unsure']},
  {id:'pol',label:'Code and policy?',type:'select',opts:['Yes','No','Unsure']},
  {id:'news',label:'Newspaper test',type:'select',opts:['Comfortable','Uncomfortable','Unsure']},
  {id:'harm',label:'Who is harmed?',w:200,type:'textarea',rows:1},
  {id:'v',label:'Result',calc:function(r,api){if(!r.opt)return '';if(r.leg==='No')return '<span class="ec-no">Fails legal test</span>';if(r.pol==='No'||r.news==='Uncomfortable')return '<span class="ec-no">Fails a test</span>';if(r.leg==='Unsure')return '<span class="ec-q">Ask legal</span>';if(!r.leg||!r.pol||!r.news||r.pol==='Unsure'||r.news==='Unsure')return '<span class="ec-q">Open questions</span>';return '<span class="ec-ok">Passes all tests</span>';}}]},
 {type:'fields',title:'Decision, escalation and record',cols:3,fields:[
  {id:'dec',label:'Option chosen',wide:true,hint:'Copy the option text from the table above.'},
  {id:'why',label:'Rationale',type:'textarea',wide:true,rows:2},
  {id:'route',label:'Escalation or reporting route',type:'select',opts:['Manager or supervisor','Legal or compliance','Ethics hotline','Customer, per the quality agreement','Regulator, on advice from legal','Public or media','None needed','Not yet decided']},
  {id:'docw',label:'Where the decision is documented'},
  {id:'docd',label:'Date documented',type:'date'}]},
 {type:'custom',id:'res',title:'Checks',html:'<div class="out ec-out"></div>'}
],
blankX:function(){return {ob:{},ca:{}};},
update:function(root,api){
 var S=api.state(), esc=api.esc, f=[];
 var OB=['Act with integrity and honesty','Be fair, objective and respectful to everyone affected','Protect public health, safety and the environment','Avoid conflicts of interest, or disclose them','Respect confidentiality and intellectual property','Report data, results and qualifications truthfully','Comply with laws, regulations and organization policy'];
 var CA=['Conflict of interest','Confidentiality and NDAs','Bribery and anti-corruption (e.g. FCPA, UK Bribery Act)','ESG: environmental, social and governance commitments','Health and safety, including product safety','Data privacy','Product change notification and quality agreements'];
 var SO=['Not relevant','Relevant, addressed','Relevant, open'];
 if(!S.x.ob) S.x.ob={}; if(!S.x.ca) S.x.ca={};
 function build(tb,list,store,head){
  if(tb.querySelector('select')) return;
  tb.innerHTML='<thead><tr><th>'+head+'</th><th>Status</th><th>Note</th></tr></thead><tbody>'+list.map(function(t,i){ var v=store[i]||{}; return '<tr data-er="'+i+'"><td class="mo">'+t+'</td><td><select data-i="'+i+'" aria-label="Status: '+t+'"><option value=""></option>'+SO.map(function(o){return '<option'+(v.s===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></td><td><textarea rows="1" data-n="'+i+'" aria-label="Note: '+t+'">'+esc(v.n||'')+'</textarea></td></tr>'; }).join('')+'</tbody>';
  tb.querySelectorAll('textarea').forEach(function(t){ t.style.height='auto'; t.style.height=(t.scrollHeight+2)+'px'; });
  tb.querySelectorAll('select').forEach(function(el){ el.addEventListener('input',function(){ var i=el.dataset.i; store[i]=store[i]||{}; store[i].s=el.value; api.save(); }); });
  tb.querySelectorAll('textarea').forEach(function(el){ el.addEventListener('input',function(){ var i=el.dataset.n; store[i]=store[i]||{}; store[i].n=el.value; el.style.height='auto'; el.style.height=(el.scrollHeight+2)+'px'; api.save(); }); });
 }
 var tbo=root.querySelector('table.ec-ob'), tbc=root.querySelector('table.ec-ca');
 build(tbo,OB,S.x.ob,'Obligation (paraphrased themes)'); build(tbc,CA,S.x.ca,'Compliance area');
 [[tbo,S.x.ob],[tbc,S.x.ca]].forEach(function(p){ p[0].querySelectorAll('tr[data-er]').forEach(function(tr){ var v=p[1][tr.dataset.er]||{}; tr.className=v.s==='Relevant, open'?'op':v.s==='Relevant, addressed'?'ad':''; }); });
 var O=S.g.o.filter(function(r){return r.opt&&r.opt.trim();});
 var any=O.length||(S.f.sit||'').trim()||S.f.coi||S.f.conf||S.f.ill;
 if(!any){ root.querySelector('.ec-out').innerHTML=api.flags([],'Describe the situation and list the options, and the checks appear here.'); return; }
 var norm=function(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ');};
 var pass=O.filter(function(r){return r.leg==='Yes'&&r.pol==='Yes'&&r.news==='Comfortable';}), fl=O.filter(function(r){return r.leg==='No';});
 var chosen=O.filter(function(r){return S.f.dec&&norm(r.opt)===norm(S.f.dec);})[0];
 if(O.length) f.push([pass.length?'ok':'warn',pass.length?pass.length+' of '+O.length+' options '+(pass.length===1?'passes':'pass')+' all three tests: '+pass.map(function(r){return '<b>'+esc(r.opt)+'</b>';}).join('; ')+'.':'No option passes all three tests yet. Look for another option, or get advice before deciding.']);
 fl.forEach(function(r){ f.push(['warn','<b>'+esc(r.opt)+'</b> fails the legal test. An option that breaks the law is off the table whatever its other merits; confirm with legal or compliance and remove it.']); });
 if(chosen&&chosen.leg==='No') f.push(['warn','The option chosen fails the legal test. Stop and take this to legal or compliance before acting.']);
 else if(chosen&&(chosen.pol==='No'||chosen.news==='Uncomfortable')) f.push(['warn','The option chosen fails the code-and-policy test or the newspaper test. Record why, and who approved it, or choose another option.']);
 if(S.f.dec&&O.length&&!chosen) f.push(['','The option chosen does not match any option in the table exactly, so its tests cannot be checked.']);
 if((S.f.coi==='Yes'||S.f.coi==='Unsure')&&S.f.coid!=='Yes') f.push(['warn','A conflict of interest '+(S.f.coi==='Unsure'?'may exist':'exists')+' and has not been disclosed. Disclose it to the manager or compliance function now, and remove the conflicted person from the decision. An undisclosed conflict taints the decision even when the outcome is right.']);
 if((S.f.conf==='Yes'||S.f.conf==='Unsure')&&(S.f.nda==='No'||S.f.nda==='Not sure'||!S.f.nda)) f.push(['warn','Confidential or proprietary information is involved and no confidentiality agreement is confirmed. Do not share it with a third party until an NDA or the contract terms covering it are in place and checked.']);
 if(S.f.ill==='Yes'||S.f.ill==='Unsure') f.push(['warn','Suspected illegal activity. Report it through the proper channels (your manager, legal or compliance, or the ethics hotline) and to a regulator where the law provides for it, on legal advice. Going to the public or media first can damage an investigation, breach confidentiality obligations and weaken the legal protections that cover reports made through recognized channels. This is not legal advice.'+(S.f.route?'':' No reporting route has been chosen yet.')]);
 if(S.f.route==='Public or media') f.push(['warn','The route chosen is public or media. Use internal channels and legal advice first unless counsel advises otherwise.']);
 if(S.f.gift==='Yes, accepted'||S.f.gift==='Yes, undecided') f.push(['warn','A gift, payment or hospitality offer is '+(S.f.gift==='Yes, accepted'?'accepted':'pending')+' from a party to this decision. Check it against the gifts and hospitality policy and the anti-bribery rules, and record it.']);
 if(!(S.f.dec||'').trim()||!(S.f.why||'').trim()||!(S.f.docw||'').trim()) f.push(['warn','Decision not fully documented: '+[!(S.f.dec||'').trim()?'option chosen':'',!(S.f.why||'').trim()?'rationale':'',!(S.f.docw||'').trim()?'where it is recorded':''].filter(Boolean).join(', ')+' missing. A written record protects the people who made the decision and lets it be reviewed.']);
 var open=CA.filter(function(t,i){return (S.x.ca[i]||{}).s==='Relevant, open';}).concat(OB.filter(function(t,i){return (S.x.ob[i]||{}).s==='Relevant, open';}));
 if(open.length) f.push(['',open.length+' obligation'+(open.length>1?'s or compliance areas are':' or compliance area is')+' still open: '+open.map(esc).join('; ')+'.']);
 var hi=S.g.st.filter(function(r){return r.s&&r.harm==='High';}); if(hi.length) f.push(['','High potential harm to: '+hi.map(function(r){return '<b>'+esc(r.s)+'</b>';}).join(', ')+'. Weigh the options from their side, not only the organization\'s.']);
 f.push(['','This worksheet organizes the thinking; it does not replace legal or compliance advice. When in doubt, ask before acting.']);
 root.querySelector('.ec-out').innerHTML=api.flags(f);
},
example:{f:{sit:'Corvane Electronics builds infusion pump controller boards for a medical device customer. Receiving inspection found that our connector supplier, Halvorsen Plating, changed its nickel plating chemistry in August without the change notice our purchase terms require. 1,200 boards built with the new pins are waiting to ship at quarter end. The supplier says the new finish is equivalent; our customer quality agreement requires notice and approval of process changes before shipment.',
 facts:'Known: the plating change, the build quantity, the quality agreement clause. Assumed, not verified: that the new finish performs the same (no solderability or contact resistance data yet). The supplier account manager offered two tickets to a football game "to smooth things over". The quality engineer who would qualify an alternate source has a family member working at that alternate supplier.',
 who:'Quality manager',date:'2026-09-21',by:'2026-09-25',
 coi:'Yes',coid:'No',conf:'Yes',nda:'No',ill:'No',gift:'Yes, declined',
 dec:'Hold the 1,200 boards, notify the customer under the quality agreement and run solderability and contact resistance tests',
 why:'Only option that passes all three tests. The quality agreement requires notice before shipment, and the product is used in patient care. Revenue moves to next quarter; sales director informed.',
 route:'Customer, per the quality agreement',docw:'',docd:''},
 g:{st:[
  {s:'Device customer',how:'Receives boards with an unapproved change; must assess it in their own design file',harm:'High'},
  {s:'Patients',how:'Depend on the pump working; connector failure could interrupt an infusion',harm:'High'},
  {s:'Corvane sales and finance',how:'Quarter-end revenue slips if the lot is held',harm:'Medium'},
  {s:'Halvorsen Plating',how:'Supplier relationship and corrective action',harm:'Medium'},
  {s:'Quality engineer',how:'Personal conflict on the alternate-source decision',harm:'Low'}],
 o:[
  {opt:'Ship now on the supplier\'s equivalence statement and tell the customer next quarter',leg:'Unsure',pol:'No',news:'Uncomfortable',harm:'Customer and patients; our credibility'},
  {opt:'Ship and record the lot as built before the plating change',leg:'No',pol:'No',news:'Uncomfortable',harm:'Customer, patients; falsified records'},
  {opt:'Hold the 1,200 boards, notify the customer under the quality agreement and run solderability and contact resistance tests',leg:'Yes',pol:'Yes',news:'Comfortable',harm:'Quarter revenue; short delay to the customer'}]},
 x:{ob:{0:{s:'Relevant, open',n:'Pressure to ship before the facts are known'},1:{s:'Relevant, addressed',n:'Supplier given a chance to supply data'},2:{s:'Relevant, open',n:'Patient-care product'},3:{s:'Relevant, open',n:'Quality engineer and alternate supplier'},4:{s:'Relevant, open',n:'Customer drawings needed to quote the alternate source'},5:{s:'Relevant, addressed',n:'Lot records left as they are'},6:{s:'Relevant, addressed',n:'Legal confirmed contract terms'}},
  ca:{0:{s:'Relevant, open',n:'Not yet disclosed'},1:{s:'Relevant, open',n:'No NDA with the alternate supplier'},2:{s:'Relevant, addressed',n:'Tickets declined and logged under the gifts policy'},3:{s:'Not relevant',n:''},4:{s:'Relevant, addressed',n:'Lot on hold'},5:{s:'Not relevant',n:''},6:{s:'Relevant, addressed',n:'Customer notified September 22'}}}}
}
