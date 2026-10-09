{
slug:'sipoc',
sections:[
 {type:'fields',title:'Name the process and its boundaries',hint:'A SIPOC is drawn for one process. Fix where it starts and where it stops before you list anything, or the lists will sprawl.',fields:[
  {id:'name',label:'Process name',ph:'e.g. Customer returns handling',wide:true},
  {id:'start',label:'Starts when',ph:'e.g. Return authorization is requested'},
  {id:'stop',label:'Stops when',ph:'e.g. Credit is issued or the part is scrapped'}]},
 {type:'custom',id:'cols',cls:'printhide',title:'Fill the five columns',hint:'One item per line. Most teams fill <b>P</b> first (four to seven high-level steps), then <b>O</b> and <b>C</b>, then work back to <b>I</b> and <b>S</b>.',
  html:'<div class="sipoc-in"></div>',
  init:function(host,api){
   var S=api.state(), cols=[['s','Suppliers','Who provides the inputs'],['i','Inputs','What goes in'],['p','Process','4 to 7 high-level steps'],['o','Outputs','What comes out'],['c','Customers','Who receives the outputs']];
   host.querySelector('.sipoc-in').innerHTML=cols.map(function(c){return '<label class="tf"><span>'+c[0].toUpperCase()+' &middot; '+c[1]+'</span><textarea rows="6" data-f="'+c[0]+'" aria-label="'+c[1]+'" placeholder="'+c[2]+'">'+api.esc(S.f[c[0]]||'')+'</textarea></label>';}).join('');
  }},
 {type:'custom',id:'board',title:'Your SIPOC, and what to check',html:'<div class="sipoc-board"></div><div class="out sipoc-flags"></div>'}
],
update:function(root,api){
 var S=api.state(), L=function(k){return (S.f[k]||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);};
 var cols=[['s','Suppliers'],['i','Inputs'],['p','Process'],['o','Outputs'],['c','Customers']];
 var b='<div class="sb-head">'+api.esc(S.f.name||'Process name')+'<small>'+api.esc(S.f.start?'Starts: '+S.f.start:'')+(S.f.stop?' &middot; Stops: '+api.esc(S.f.stop):'')+'</small></div><div class="sb-cols">';
 cols.forEach(function(c){ var it=L(c[0]); b+='<div class="sb-col"><div class="sb-l">'+c[0].toUpperCase()+'<span>'+c[1]+'</span></div>'+(it.length?(c[0]==='p'?'<ol>':'<ul>')+it.map(function(x){return '<li>'+api.esc(x)+'</li>';}).join('')+(c[0]==='p'?'</ol>':'</ul>'):'<p class="sb-e">Empty</p>')+'</div>'; });
 root.querySelector('.sipoc-board').innerHTML=b+'</div>';
 var f=[], p=L('p').length;
 if(!S.f.start||!S.f.stop) f.push(['warn','Set the start and stop points. Without them the process has no edges and the lists grow until they describe the whole business.']);
 if(p&&(p<4||p>7)) f.push(['warn','The process has '+p+' step'+(p===1?'':'s')+'. Four to seven is the usual range for a SIPOC: fewer and it says nothing, more and it has turned into a detailed process map.']);
 else if(p) f.push(['ok','The process has '+p+' steps, inside the usual four to seven.']);
 ['s','i','o','c'].forEach(function(k,ix){ if(p&&!L(k).length) f.push(['warn',['Suppliers','Inputs','Outputs','Customers'][ix]+' is empty.']); });
 var cus=L('c').map(function(x){return x.toLowerCase();});
 var both=L('s').filter(function(x){return cus.indexOf(x.toLowerCase())>=0;});
 if(both.length) f.push(['ok','<b>'+both.map(api.esc).join(', ')+'</b> appear'+(both.length===1?'s':'')+' as both supplier and customer. That is common and worth noticing: they have a stake at both ends.']);
 if(L('o').length&&!L('c').length) f.push(['warn','Every output needs somebody who receives it. If an output has no customer, ask why it is being produced.']);
 root.querySelector('.sipoc-flags').innerHTML=f.length?f.map(function(x){return '<span class="flag '+x[0]+'">'+x[1]+'</span>';}).join(''):'<p>Fill in the columns and the checks appear here.</p>';
},
example:{f:{name:'Customer returns handling',start:'Customer requests a return authorization',stop:'Credit is issued or the part is scrapped',
 s:'Customer\nCarrier\nCustomer service\nQuality lab',
 i:'Returned part\nReturn authorization request\nOriginal order record\nInspection criteria',
 p:'Issue return authorization\nReceive and log the part\nInspect and decide disposition\nRecord the failure mode\nIssue credit or replacement',
 o:'Return authorization number\nInspection result\nFailure record\nCredit note or replacement part',
 c:'Customer\nFinance\nQuality engineering\nCustomer service'}}
}
