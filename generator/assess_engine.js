/* SC Quality Guild: BoK self-assessment engine.
   Data: window.ASSESS = {key, name, short, sections:[[sec,title,weight]],
         reqs:[[code,title,can,[[href,label]]]], bank:[[id,code,stem,[4 opts],ans,why]],
         primer:[href,label]}.
   Everything is kept in this browser (localStorage), with save/open to a file. */
(function(){
'use strict';
var A=window.ASSESS, KEY='scqg-assess-'+A.key, root=document.getElementById('assess');
var REQ={}, SEC={}, BYREQ={}, QID={};
A.reqs.forEach(function(r){ REQ[r[0]]=r; BYREQ[r[0]]=[]; });
A.sections.forEach(function(s){ SEC[s[0]]=s; });
A.bank.forEach(function(q){ QID[q[0]]=q; BYREQ[q[1]].push(q[0]); });
var TOTW=A.sections.reduce(function(t,s){return t+s[2];},0);
function secOf(code){ return code.split('.')[0]; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function pct(c,n){ return n? Math.round(100*c/n) : null; }
function fmtDate(t){ var d=new Date(t); return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); }
function fmtDT(t){ var d=new Date(t); return fmtDate(t)+' '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}); }
function shuffle(a,rnd){ rnd=rnd||Math.random; for(var i=a.length-1;i>0;i--){ var j=Math.floor(rnd()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

/* ── storage ─────────────────────────────────────────────── */
var S;
function blank(){ return {v:1, cert:A.key, attempts:[], cur:null}; }
function load(){
  try{ var r=localStorage.getItem(KEY); if(r){ var o=JSON.parse(r); if(o&&o.v===1&&Array.isArray(o.attempts)) return o; } }catch(e){}
  return blank();
}
var storageOK=true;
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); storageOK=true; }catch(e){ storageOK=false; } }
S=load();

/* ── evidence: every answer across all attempts, oldest first ── */
var RECENT=6;
function evidence(){
  var ev={}; A.reqs.forEach(function(r){ ev[r[0]]=[]; });
  S.attempts.forEach(function(at){ at.answers.forEach(function(a){ if(ev[a[1]]) ev[a[1]].push(a[2]?1:0); }); });
  var out={};
  Object.keys(ev).forEach(function(k){
    var all=ev[k], last=all.slice(-RECENT), c=last.reduce(function(t,x){return t+x;},0);
    out[k]={n:last.length, c:c, total:all.length, st:status(c,last.length)};
  });
  return out;
}
/* Strong: 80%+ on at least 2 recent answers. Borderline: 50-79%. Gap: under 50%.
   One answer is not enough to judge either way. */
function status(c,n){
  if(!n) return 'none';
  if(n<2) return c? 'early-ok':'early-miss';
  var p=c/n;
  if(p>=0.8) return 'strong';
  if(p>=0.5) return 'border';
  return 'gap';
}
var ST={strong:['Strong','✔','st-strong'], border:['Borderline','!','st-border'], gap:['Gap','✖','st-gap'],
  'early-ok':['Right once, needs more','○','st-early'], 'early-miss':['Missed once, needs more','○','st-earlymiss'], none:['Not tested yet','–','st-none']};
function badge(st){ var s=ST[st]; return '<span class="stb '+s[2]+'"><i aria-hidden="true">'+s[1]+'</i>'+s[0]+'</span>'; }

/* ── drawing questions ───────────────────────────────────── */
function seenCounts(){
  var seen={}, missed={};
  S.attempts.forEach(function(at){ at.answers.forEach(function(a){ seen[a[0]]=(seen[a[0]]||0)+1; if(!a[2]) missed[a[0]]=1; else delete missed[a[0]]; }); });
  return {seen:seen, missed:missed};
}
/* random sample: half the requirements, spread across the sections in proportion */
function sampleSize(){ return Math.ceil(A.reqs.length/2); }
function sampleCodes(){
  var want=sampleSize(), bySec={}, order=[];
  A.reqs.forEach(function(r){ var s=secOf(r[0]); if(!bySec[s]){ bySec[s]=[]; order.push(s); } bySec[s].push(r[0]); });
  var take={}, got=0;
  order.forEach(function(s){ take[s]=Math.floor(bySec[s].length/2); got+=take[s]; });
  shuffle(order.filter(function(s){ return bySec[s].length%2; })).forEach(function(s){ if(got<want){ take[s]++; got++; } });
  var out=[]; order.forEach(function(s){ out=out.concat(shuffle(bySec[s].slice()).slice(0,take[s])); });
  return out;
}
function draw(mode){
  var sc=seenCounts(), ev=evidence(), codes=A.reqs.map(function(r){return r[0];}), per;
  if(mode==='sample'){ codes=sampleCodes(); per=1; }
  else if(mode==='quick') per=1;
  else if(mode==='full') per=2;
  else { codes=codes.filter(function(c){ return ev[c].st!=='strong'; }); per=2; }
  var ids=[];
  codes.forEach(function(c){
    var pool=shuffle(BYREQ[c].slice());
    /* unseen first, then ones you missed last time, then the least seen */
    pool.sort(function(a,b){ var sa=sc.seen[a]||0, sb=sc.seen[b]||0;
      if((sa===0)!==(sb===0)) return sa===0?-1:1;
      var ma=sc.missed[a]?0:1, mb=sc.missed[b]?0:1; if(ma!==mb) return ma-mb;
      return sa-sb; });
    ids=ids.concat(pool.slice(0,per));
  });
  return shuffle(ids);
}
function start(mode){
  var ids=draw(mode);
  if(!ids.length){ alertBox('Every requirement is already Strong. Take a quick check or the full diagnostic to confirm it.'); return; }
  var order={}; ids.forEach(function(id){ order[id]=shuffle([0,1,2,3]); });
  S.cur={mode:mode, ids:ids, order:order, ans:{}, i:0, started:Date.now(), learn:!!(document.getElementById('learnMode')||{}).checked};
  save(); render(); scrollTop();
}
function scrollTop(){ try{ root.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){} }
var msg='';
function alertBox(t){ msg=t; render(); }

/* ── finishing an attempt ────────────────────────────────── */
function finish(){
  var c=S.cur, answers=[], secs={}, reqs={};
  c.ids.forEach(function(id){
    var q=QID[id], ch=c.ans[id], ok=(ch===q[4]);
    if(ch==null) ok=false;
    answers.push([id,q[1],ok?1:0, ch==null?-1:ch]);
    var s=secOf(q[1]); secs[s]=secs[s]||[0,0]; secs[s][1]++; if(ok) secs[s][0]++;
    reqs[q[1]]=reqs[q[1]]||[0,0]; reqs[q[1]][1]++; if(ok) reqs[q[1]][0]++;
  });
  var corr=answers.filter(function(a){return a[2];}).length;
  var at={id:'a'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), date:Date.now(), started:c.started,
    mode:c.mode, n:answers.length, correct:corr, weighted:weighted(secs), secs:secs, reqs:reqs, answers:answers, order:c.order};
  S.attempts.push(at); S.cur=null; S.view=at.id; save(); render(); scrollTop();
}
/* section scores weighted by the exam's question allocation; sections not tested are left out */
function weighted(secs){
  var w=0,t=0; A.sections.forEach(function(s){ var x=secs[s[0]]; if(x&&x[1]){ w+=s[2]; t+=s[2]*x[0]/x[1]; } });
  return w? Math.round(100*t/w) : null;
}

/* ── rendering ───────────────────────────────────────────── */
/* exam view: while an attempt is running, everything but the question is hidden */
function examMode(on){
  var b=document.body; if(!b) return;
  var was=b.classList.contains('exam-on');
  b.classList.toggle('exam-on',!!on);
  if(on&&!was){ try{ window.scrollTo(0,0); }catch(e){} }
  if(!on&&document.fullscreenElement&&document.exitFullscreen){ try{ document.exitFullscreen(); }catch(e){} }
}
function render(){
  examMode(!!S.cur);
  if(S.cur) return renderExam();
  var at=S.view && S.attempts.filter(function(a){return a.id===S.view;})[0];
  if(at) return renderReport(at);
  renderHome();
}
function toolbar(extra){
  return '<div class="toolbar noprint">'+(extra||'')+
    '<button type="button" class="tb ghost" data-act="savefile">Save history to a file</button>'+
    '<label class="tb ghost">Open a saved file<input type="file" accept=".json,application/json" data-act="openfile" hidden></label>'+
    '<button type="button" class="tb ghost" data-act="clear" title="Double-click to erase every saved attempt in this browser">Clear history</button>'+
    '<span class="tstamp" id="tstamp">'+(S.attempts.length? S.attempts.length+' ATTEMPT'+(S.attempts.length>1?'S':'')+' SAVED IN THIS BROWSER':'NOTHING SAVED YET')+'</span></div>';
}
function renderHome(){
  var ev=evidence(), cnt=counts(ev), nreq=A.reqs.length, nq=A.bank.length;
  var h=toolbar();
  if(msg){ h+='<p class="flag'+(/^(Added|Nothing new)/.test(msg)?' ok':' warn')+'">'+esc(msg)+'</p>'; msg=''; }
  if(!storageOK) h+='<p class="flag warn">This browser is not letting the page save. Your results will be lost when you leave unless you use Save history to a file.</p>';
  h+='<div class="tsec"><h3><span class="tn">1</span>Choose an assessment</h3>'+
     '<p class="th">Questions are drawn requirement by requirement. The random sample covers half of the '+nreq+' BoK requirements, picked at random from every section; the other three cover all of them. Questions you have not seen come first, then ones you missed. The bank holds '+nq+' questions.</p>'+
     '<div class="modes">'+
     mode('sample','Random sample', sampleSize()+' questions', 'One question on each of a random half of the requirements, from every section. A short test when time is tight.')+
     mode('quick','Quick check', nreq+' questions', 'One question per requirement. A fast read of where you stand; repeat it and the evidence builds up.')+
     mode('full','Full diagnostic', (2*nreq)+' questions', 'Two questions per requirement, close to the length of the real exam. The best single picture of where you stand.')+
     mode('focus','Work on my weak spots', focusCount(ev)+' questions', 'Two questions for every requirement that is not Strong yet, including any not tested.')+
     '</div>'+
     '<label class="learn"><input type="checkbox" id="learnMode"> Show the answer and explanation after each question (study mode). Leave it off to sit it like the exam.</label></div>';
  if(S.attempts.length){
    h+='<div class="tsec"><h3><span class="tn">2</span>Where you stand now</h3>'+
       '<p class="th">Built from your most recent '+RECENT+' answers on each requirement, across every attempt saved in this browser.</p>'+
       statTiles(cnt, S.attempts[S.attempts.length-1])+reqTable(ev,null)+'</div>'+
       '<div class="tsec"><h3><span class="tn">3</span>Your trend</h3>'+trend()+'</div>';
  } else {
    h+='<div class="tsec"><h3><span class="tn">2</span>Where you stand now</h3><p class="th">Nothing yet. Finish an assessment and your result for every requirement appears here, with your trend over time.</p>'+reqTable(ev,null)+'</div>';
  }
  root.innerHTML=h;
}
function mode(id,name,size,desc){
  return '<button type="button" class="mode" data-act="start" data-mode="'+id+'"><b>'+name+'</b><span>'+size+'</span><small>'+desc+'</small></button>';
}
function focusCount(ev){ var n=0; A.reqs.forEach(function(r){ if(ev[r[0]].st!=='strong') n+=Math.min(2,BYREQ[r[0]].length); }); return n; }
function counts(ev){ var c={strong:0,border:0,gap:0,early:0,none:0}; Object.keys(ev).forEach(function(k){ var s=ev[k].st; if(s==='early-ok'||s==='early-miss') c.early++; else c[s]++; }); return c; }
function statTiles(cnt,last){
  return '<div class="stat">'+
    '<div><b>'+cnt.strong+' of '+A.reqs.length+'</b><span>requirements Strong</span></div>'+
    '<div><b>'+cnt.border+'</b><span>Borderline</span></div>'+
    '<div><b>'+cnt.gap+'</b><span>Gaps</span></div>'+
    '<div><b>'+(cnt.early+cnt.none)+'</b><span>Need more answers</span></div>'+
    (last? '<div><b>'+(last.weighted==null?'–':last.weighted+'%')+'</b><span>Latest weighted score</span></div>':'')+
    '</div>';
}
function reqTable(ev,at){
  var h='<div class="tgw"><table class="tg rq"><thead><tr><th>Req.</th><th>Requirement</th>'+(at?'<th>This attempt</th>':'')+'<th>Recent answers</th><th>Status</th><th class="noprint">Study</th></tr></thead><tbody>';
  A.sections.forEach(function(s){
    var sx=at&&at.secs[s[0]];
    h+='<tr class="secrow"><td colspan="'+(at?6:5)+'"><b>'+s[0]+' · '+esc(s[1])+'</b> <span>'+s[2]+' of '+TOTW+' exam questions'+(sx?' · this attempt '+sx[0]+'/'+sx[1]+' ('+pct(sx[0],sx[1])+'%)':'')+'</span></td></tr>';
    A.reqs.forEach(function(r){
      if(secOf(r[0])!==s[0]) return;
      var e=ev[r[0]], ra=at&&at.reqs[r[0]];
      h+='<tr class="'+e.st+'"><td class="code">'+r[0]+'</td><td><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></td>'+
        (at?'<td class="num">'+(ra? ra[0]+' / '+ra[1] : '–')+'</td>':'')+
        '<td class="num">'+(e.n? e.c+' of '+e.n+' right' : '–')+'</td><td>'+badge(e.st)+'</td>'+
        '<td class="noprint links">'+r[3].map(function(l){return '<a href="'+l[0]+'">'+esc(l[1])+'</a>';}).join('')+'</td></tr>';
    });
  });
  return h+'</tbody></table></div>';
}

function renderExam(){
  var c=S.cur, n=c.ids.length, i=Math.max(0,Math.min(c.i,n-1)), id=c.ids[i], q=QID[id], ord=c.order[id];
  var answered=Object.keys(c.ans).length, ch=c.ans[id], showAns=c.learn && ch!=null;
  var fs=document.fullscreenEnabled? '<button type="button" class="tb ghost" data-act="fs">'+(document.fullscreenElement?'Exit full screen':'Full screen')+'</button>' : '';
  var h='<div class="toolbar noprint"><span class="tstamp">'+esc(A.short).toUpperCase()+' · '+modeName(c.mode).toUpperCase()+' · QUESTION '+(i+1)+' OF '+n+' · '+answered+' ANSWERED</span>'+fs+
    '<button type="button" class="tb ghost" data-act="quit" title="Double-click to abandon this attempt without saving it">Abandon</button></div>'+
    '<div class="bar" aria-hidden="true"><i style="width:'+(100*answered/n)+'%"></i></div>'+
    '<div class="qbox"><p class="qref">'+q[1]+' · '+esc(REQ[q[1]][1])+'</p><p class="qstem" id="qstem">'+esc(q[2])+'</p><div class="opts" role="radiogroup" aria-labelledby="qstem">';
  ord.forEach(function(oi,k){
    var cls='opt'+(ch===oi?' on':'');
    if(showAns){ if(oi===q[4]) cls+=' right'; else if(ch===oi) cls+=' wrong'; }
    h+='<button type="button" role="radio" aria-checked="'+(ch===oi)+'" class="'+cls+'" data-act="pick" data-o="'+oi+'"'+(showAns?' disabled':'')+'><b>'+'ABCD'[k]+'</b><span>'+esc(q[3][oi])+'</span></button>';
  });
  h+='</div>';
  if(showAns) h+='<div class="why'+(ch===q[4]?' ok':' no')+'"><b>'+(ch===q[4]?'Right.':'Not quite. The answer is '+'ABCD'[ord.indexOf(q[4])]+'.')+'</b> '+esc(q[5])+'</div>';
  h+='</div><div class="nav noprint">'+
    '<button type="button" class="tb ghost" data-act="prev"'+(i===0?' disabled':'')+'>← Back</button>'+
    (i<n-1? '<button type="button" class="tb" data-act="next">'+(ch==null?'Skip':'Next')+' →</button>':'')+
    '<button type="button" class="tb'+(i===n-1?'':' ghost')+'" data-act="finish">Finish and see my report</button></div>';
  if(answered<n && i===n-1) h+='<p class="flag warn noprint">'+(n-answered)+' question'+(n-answered>1?'s are':' is')+' unanswered. Unanswered questions count as wrong. Use Back to return to them.</p>';
  root.innerHTML=h;
}
function modeName(m){ return {sample:'Random sample',quick:'Quick check',full:'Full diagnostic',focus:'Weak spots'}[m]||m; }

function renderReport(at){
  var ev=evidence(), cnt=counts(ev), isLast=at===S.attempts[S.attempts.length-1];
  var gaps=A.reqs.filter(function(r){ var s=ev[r[0]].st; return s==='gap'||s==='border'||s==='early-miss'; })
    .sort(function(a,b){ var ra={gap:0,'early-miss':1,border:2}; var d=ra[ev[a[0]].st]-ra[ev[b[0]].st]; return d|| (SEC[secOf(b[0])][2]-SEC[secOf(a[0])][2]); });
  var h=toolbar('<button type="button" class="tb" data-act="home">Take another assessment</button><button type="button" class="tb ghost" data-act="print">Print or save as PDF</button>');
  h+='<div class="tsec"><h3><span class="tn">1</span>'+modeName(at.mode)+', '+fmtDT(at.date)+'</h3>'+
    '<div class="stat">'+
    '<div><b>'+at.correct+' / '+at.n+'</b><span>Answered correctly</span></div>'+
    '<div><b>'+pct(at.correct,at.n)+'%</b><span>Raw score</span></div>'+
    '<div><b>'+(at.weighted==null?'–':at.weighted+'%')+'</b><span>Weighted to the exam’s section mix</span></div>'+
    '<div><b>'+cnt.strong+' of '+A.reqs.length+'</b><span>Requirements Strong'+(isLast?'':' (now)')+'</span></div>'+
    '<div><b>'+(cnt.gap+cnt.border)+'</b><span>Gaps and borderline</span></div></div>'+
    '<p class="th">ASQ reports a scaled score and does not publish a percentage pass mark, so treat these as a guide, not a prediction. A sensible goal before booking: every requirement Strong, and weighted scores of 80% or better on repeat attempts.</p></div>';
  h+='<div class="tsec"><h3><span class="tn">2</span>By section</h3>'+secTable(at)+'</div>';
  h+='<div class="tsec"><h3><span class="tn">3</span>Study next</h3>';
  if(gaps.length){
    h+='<p class="th">Gaps first, then the requirements you missed once, then borderline ones. Within each group, sections that carry more exam questions come first.</p><ol class="next">'+
      gaps.slice(0,10).map(function(r){ return '<li>'+badge(ev[r[0]].st)+' <b>'+r[0]+' '+esc(r[1])+'</b>. '+esc(r[2])+
        ' <span class="noprint">'+r[3].map(function(l){return '<a href="'+l[0]+'">'+esc(l[1])+'</a>';}).join(' · ')+'</span></li>'; }).join('')+'</ol>'+
      (gaps.length>10?'<p class="th">'+(gaps.length-10)+' more in the table below.</p>':'');
  } else h+='<p class="th">No gaps or borderline requirements in your recent answers. Keep it that way with a quick check every week or two.</p>';
  h+='</div><div class="tsec pgbreak"><h3><span class="tn">4</span>Every requirement</h3><p class="th">“This attempt” is this sitting only. “Recent answers” and the status use your last '+RECENT+' answers on each requirement across all saved attempts, so one lucky or unlucky question does not decide it.</p>'+reqTable(ev,at)+'</div>';
  h+='<div class="tsec"><h3><span class="tn">5</span>Your trend</h3>'+trend()+'</div>';
  h+='<div class="tsec pgbreak"><h3><span class="tn">6</span>Review your answers</h3><p class="th noprint"><button type="button" class="tb ghost" data-act="toggleall">Show or hide all</button> Questions you missed are open.</p>'+review(at)+'</div>';
  root.innerHTML=h;
}
function secTable(at){
  var h='<div class="tgw"><table class="tg sx"><thead><tr><th>Section</th><th>Exam weight</th><th>This attempt</th><th>Score</th><th aria-hidden="true"></th></tr></thead><tbody>';
  A.sections.forEach(function(s){
    var x=at.secs[s[0]], p=x?pct(x[0],x[1]):null;
    h+='<tr><td><b>'+s[0]+'</b> '+esc(s[1])+'</td><td class="num">'+Math.round(100*s[2]/TOTW)+'%</td><td class="num">'+(x?x[0]+' / '+x[1]:'not tested')+'</td><td class="num"><b>'+(p==null?'–':p+'%')+'</b></td>'+
      '<td class="barc" aria-hidden="true">'+(p==null?'':'<span class="hb"><i style="width:'+p+'%"></i><em style="left:80%"></em></span>')+'</td></tr>';
  });
  return h+'</tbody></table></div><p class="th small">Bars mark 80% with a thin line.</p>';
}
function review(at){
  var ord=at.order||{};
  return at.answers.map(function(a,k){
    var q=QID[a[0]]; if(!q) return '';
    var o=ord[a[0]]||[0,1,2,3], ok=a[2];
    return '<details class="rv '+(ok?'ok':'no')+'"'+(ok?'':' open')+'><summary><span>'+(ok?'✔':'✖')+'</span> '+(k+1)+'. <em>'+q[1]+'</em> '+esc(q[2])+'</summary><ol type="A">'+
      o.map(function(oi){ var c=(oi===q[4]?'right':'')+(a[3]===oi&&!ok?' wrong':''); return '<li class="'+c+'">'+esc(q[3][oi])+(oi===q[4]?' <b>(correct)</b>':'')+(a[3]===oi?' <b>(your answer)</b>':'')+'</li>'; }).join('')+
      '</ol>'+(a[3]===-1?'<p><b>Not answered.</b></p>':'')+'<p class="why">'+esc(q[5])+'</p></details>';
  }).join('');
}

/* ── trend: one series, weighted score per attempt; a table carries every number ── */
function trend(){
  var at=S.attempts.filter(function(a){return a.weighted!=null;});
  if(!at.length) return '<p class="th">Finish an assessment to start your trend.</p>';
  var W=720,H=240,L=44,R=16,T=16,B=34, n=at.length;
  function X(i){ return n===1? L+(W-L-R)/2 : L+i*(W-L-R)/(n-1); }
  function Y(v){ return T+(100-v)*(H-T-B)/100; }
  var g='';
  [0,25,50,75,100].forEach(function(v){ g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" class="grid"/><text x="'+(L-8)+'" y="'+(Y(v)+4)+'" class="ax" text-anchor="end">'+v+'%</text>'; });
  g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(80)+'" y2="'+Y(80)+'" class="ref"/><text x="'+(W-R)+'" y="'+(Y(80)-6)+'" class="ax" text-anchor="end">80% goal</text>';
  var pts=at.map(function(a,i){return X(i)+','+Y(a.weighted);}).join(' ');
  if(n>1) g+='<polyline points="'+pts+'" class="ln"/>';
  var step=Math.max(1,Math.ceil(n/8));
  at.forEach(function(a,i){
    g+='<circle cx="'+X(i)+'" cy="'+Y(a.weighted)+'" r="5" class="dot"/>';
    if(i%step===0||i===n-1) g+='<text x="'+X(i)+'" y="'+(H-12)+'" class="ax" text-anchor="'+(n===1?'middle':i===0?'start':i===n-1?'end':'middle')+'">'+(i+1)+'</text>';
    g+='<rect x="'+(X(i)-14)+'" y="'+T+'" width="28" height="'+(H-T-B)+'" class="hit" data-tip="'+i+'"/>';
  });
  var last=at[n-1];
  g+='<text x="'+Math.min(X(n-1),W-R-4)+'" y="'+(last.weighted>88? Y(last.weighted)+22 : Y(last.weighted)-12)+'" class="lbl" text-anchor="'+(n===1?'middle':'end')+'">'+last.weighted+'%</text>';
  var svg='<div class="svgw trend"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Weighted score by attempt, '+n+' attempts, latest '+last.weighted+'%">'+g+'</svg><div class="tip" hidden></div></div>'+
    '<p class="th small">Weighted score by attempt number. Hover a point for details; every number is in the table below.</p>';
  var t='<div class="tgw"><table class="tg hist"><thead><tr><th>#</th><th>Date</th><th>Assessment</th><th>Score</th><th>Weighted</th>'+
    A.sections.map(function(s){return '<th>'+s[0]+'</th>';}).join('')+'<th class="noprint"></th></tr></thead><tbody>';
  S.attempts.slice().reverse().forEach(function(a){
    var k=S.attempts.indexOf(a)+1;
    t+='<tr><td class="num">'+k+'</td><td>'+fmtDate(a.date)+'</td><td>'+modeName(a.mode)+'</td><td class="num">'+a.correct+'/'+a.n+'</td><td class="num"><b>'+(a.weighted==null?'–':a.weighted+'%')+'</b></td>'+
      A.sections.map(function(s){ var x=a.secs[s[0]]; return '<td class="num">'+(x?pct(x[0],x[1])+'%':'–')+'</td>'; }).join('')+
      '<td class="noprint"><button type="button" class="linkb" data-act="view" data-id="'+a.id+'">Report</button></td></tr>';
  });
  return svg+t+'</tbody></table></div>';
}
function tipFor(i){
  var at=S.attempts.filter(function(a){return a.weighted!=null;})[i];
  return '<b>Attempt '+(S.attempts.indexOf(at)+1)+'</b><br>'+fmtDT(at.date)+'<br>'+modeName(at.mode)+', '+at.correct+'/'+at.n+'<br>Weighted <b>'+at.weighted+'%</b>';
}

/* ── events ──────────────────────────────────────────────── */
var lastClear=0, lastQuit=0;
root.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]'); if(!b||b.tagName==='INPUT') return;
  var act=b.getAttribute('data-act'), c=S.cur;
  if(act==='start') start(b.getAttribute('data-mode'));
  else if(act==='pick'){ c.ans[c.ids[c.i]]=+b.getAttribute('data-o'); save(); render();
    if(!c.learn && c.i<c.ids.length-1){ setTimeout(function(){ if(S.cur===c){ c.i++; save(); render(); } },220); } }
  else if(act==='next'){ c.i=Math.min(c.i+1,c.ids.length-1); save(); render(); }
  else if(act==='prev'){ c.i=Math.max(c.i-1,0); save(); render(); }
  else if(act==='finish') finish();
  else if(act==='fs'){ try{ if(document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }catch(err){} }
  else if(act==='quit'){ var now=Date.now(); if(now-lastQuit<600){ S.cur=null; save(); render(); } else { lastQuit=now; b.textContent='Click again to abandon'; } }
  else if(act==='home'){ S.view=null; save(); render(); scrollTop(); }
  else if(act==='view'){ S.view=b.getAttribute('data-id'); save(); render(); scrollTop(); }
  else if(act==='print') window.print();
  else if(act==='toggleall'){ var d=root.querySelectorAll('details.rv'), open=!Array.prototype.every.call(d,function(x){return x.open;}); d.forEach(function(x){x.open=open;}); }
  else if(act==='savefile') saveFile();
  else if(act==='clear'){ var t=Date.now(); if(t-lastClear<600){ S=blank(); save(); render(); } else { lastClear=t; b.textContent='Click again to erase'; } }
});
root.addEventListener('change',function(e){
  if(e.target.getAttribute('data-act')==='openfile' && e.target.files[0]){
    var r=new FileReader(); r.onload=function(){ openFile(r.result); }; r.readAsText(e.target.files[0]);
  }
});
root.addEventListener('mousemove',function(e){
  var h=e.target.closest('.hit'), w=e.target.closest('.trend'); if(!w) return;
  var tip=w.querySelector('.tip');
  if(!h){ tip.hidden=true; return; }
  tip.innerHTML=tipFor(+h.getAttribute('data-tip')); tip.hidden=false;
  var r=w.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
  tip.style.left=Math.min(Math.max(8,x+12), r.width-170)+'px'; tip.style.top=Math.max(4,y-70)+'px';
});
root.addEventListener('mouseleave',function(){ var t=root.querySelector('.trend .tip'); if(t) t.hidden=true; },true);
document.addEventListener('keydown',function(e){
  if(!S.cur||e.target.matches('input,textarea,select')) return;
  var k=e.key.toUpperCase(), idx='ABCD'.indexOf(k);
  if(idx>-1){ var bs=root.querySelectorAll('.opt'); if(bs[idx]&&!bs[idx].disabled) bs[idx].click(); }
  else if(e.key==='ArrowRight'){ var n=root.querySelector('[data-act=next]'); if(n) n.click(); }
  else if(e.key==='ArrowLeft'){ var p=root.querySelector('[data-act=prev]'); if(p&&!p.disabled) p.click(); }
});

function saveFile(){
  var data=JSON.stringify({v:1, cert:A.key, exported:new Date().toISOString(), attempts:S.attempts},null,1);
  var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  a.download='scqg-'+A.key+'-self-assessment-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },500);
}
function openFile(txt){
  try{
    var o=JSON.parse(txt);
    if(!o||o.cert!==A.key||!Array.isArray(o.attempts)) throw 0;
    var have={}; S.attempts.forEach(function(a){have[a.id]=1;});
    var add=o.attempts.filter(function(a){ return a&&a.id&&!have[a.id]&&Array.isArray(a.answers); });
    S.attempts=S.attempts.concat(add).sort(function(a,b){return a.date-b.date;});
    S.view=null; save(); msg=add.length? 'Added '+add.length+' attempt'+(add.length>1?'s':'')+' from the file.' : 'Nothing new in that file: every attempt in it is already here.';
  }catch(e){ msg='That file is not a saved '+A.short+' self-assessment history.'; }
  render();
}
document.addEventListener('fullscreenchange',function(){ if(S.cur) render(); });
window.__assess={state:function(){return S;}, start:start, finish:finish, evidence:evidence};
render();
})();
