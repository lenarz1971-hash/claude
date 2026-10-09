{
slug:'stakeholder-analysis',
sections:[
 {type:'fields',title:'Project',fields:[{id:'name',label:'Project',wide:true}]},
 {type:'grid',id:'s',title:'Stakeholders',rows:4,hint:'Anyone who can affect the project or is affected by it. Score <b>influence</b> (how much they can help or block it) and <b>interest</b> (how much it affects them) from 1 to 5.',cols:[
  {id:'who',label:'Stakeholder',w:180},{id:'role',label:'Role or stake',w:160,type:'textarea',rows:1},
  {id:'inf',label:'Influence 1-5',type:'number',min:1,max:5},{id:'int',label:'Interest 1-5',type:'number',min:1,max:5},
  {id:'now',label:'Support now',type:'select',opts:['Strongly against','Against','Neutral','Supportive','Champion']},
  {id:'need',label:'Support needed',type:'select',opts:['Strongly against','Against','Neutral','Supportive','Champion']},
  {id:'q',label:'Approach',calc:function(r,api){var a=api.num(r.inf),b=api.num(r.int);if(isNaN(a)||isNaN(b))return '';return a>=3&&b>=3?'Manage closely':a>=3?'Keep satisfied':b>=3?'Keep informed':'Monitor';}},
  {id:'act',label:'Action',w:200,type:'textarea',rows:1}]},
 {type:'custom',id:'map',title:'Influence and interest map',html:'<div class="svgw sh-map"></div><div class="out sh-out"></div>'}
],
update:function(root,api){
 var S=api.state(), n=api.num, rows=S.g.s.filter(function(r){return r.who;}), L=['Strongly against','Against','Neutral','Supportive','Champion'];
 var W=640,H=520,pad=60, X=function(v){return pad+(v-0.5)/5*(W-pad-20);}, Y=function(v){return H-pad-(v-0.5)/5*(H-pad-20);};
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Influence and interest grid" style="min-width:420px;max-width:640px"><style>text{font:12px Archivo,sans-serif;fill:#16273A}.q{font:700 11px \'IBM Plex Mono\',monospace;fill:#9C7C1F;letter-spacing:.06em}.ax{font:600 11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 var mx=X(3)-(X(3)-X(2))/2, my=Y(3)+(Y(2)-Y(3))/2;
 g+='<rect x="'+pad+'" y="20" width="'+(W-pad-20)+'" height="'+(H-pad-20)+'" fill="#fff" stroke="#C6CDD3"/><rect x="'+mx+'" y="20" width="'+(W-20-mx)+'" height="'+(my-20)+'" fill="#FBF5E4"/>';
 g+='<line x1="'+mx+'" x2="'+mx+'" y1="20" y2="'+(H-pad)+'" stroke="#C6CDD3" stroke-dasharray="4 3"/><line x1="'+pad+'" x2="'+(W-20)+'" y1="'+my+'" y2="'+my+'" stroke="#C6CDD3" stroke-dasharray="4 3"/>';
 g+='<text class="q" x="'+(W-28)+'" y="38" text-anchor="end">MANAGE CLOSELY</text><text class="q" x="'+(pad+8)+'" y="38">KEEP SATISFIED</text><text class="q" x="'+(W-28)+'" y="'+(H-pad-10)+'" text-anchor="end">KEEP INFORMED</text><text class="q" x="'+(pad+8)+'" y="'+(H-pad-10)+'">MONITOR</text>';
 g+='<text class="ax" x="'+((W+pad)/2)+'" y="'+(H-22)+'" text-anchor="middle">INTEREST →</text><text class="ax" transform="translate(22 '+((H-pad)/2+20)+') rotate(-90)" text-anchor="middle">INFLUENCE →</text>';
 var seen={};
 rows.forEach(function(r){ var a=n(r.inf),b=n(r.int); if(isNaN(a)||isNaN(b)) return; var key=a+','+b; seen[key]=(seen[key]||0)+1; var off=(seen[key]-1)*16;
  var gap=r.now&&r.need?L.indexOf(r.need)-L.indexOf(r.now):0, col=gap>=2?'#C0392B':gap===1?'#D8B147':'#1F8C55';
  var rt=X(b)>W*0.62; g+='<circle cx="'+X(b)+'" cy="'+(Y(a)+off)+'" r="7" fill="'+col+'"/><text x="'+(X(b)+(rt?-11:11))+'" y="'+(Y(a)+off+4)+'"'+(rt?' text-anchor="end"':'')+'>'+api.esc(r.who.length>28?r.who.slice(0,27)+'…':r.who)+'</text>'; });
 root.querySelector('.sh-map').innerHTML=g+'</svg>';
 var f=[];
 rows.forEach(function(r){ var a=n(r.inf),b=n(r.int);
  if(isNaN(a)||isNaN(b)||a<1||a>5||b<1||b>5) f.push(['warn','<b>'+api.esc(r.who)+'</b>: influence and interest must both be 1 to 5.']);
  var gap=r.now&&r.need?L.indexOf(r.need)-L.indexOf(r.now):0;
  if(gap>0&&a>=3) f.push([gap>=2?'warn':'','<b>'+api.esc(r.who)+'</b> (high influence): support needs to move from '+r.now.toLowerCase()+' to '+r.need.toLowerCase()+'.'+(r.act?'':' No action planned yet.')]);
 });
 if(rows.length) f.unshift(['','Dot color: green = already where they need to be, gold = one step to go, red = two or more.']);
 root.querySelector('.sh-out').innerHTML=api.flags(f,'Add stakeholders and they appear on the map.');
},
example:{f:{name:'Reduce seal-nick rejects on line 3'},g:{s:[
 {who:'Plant manager',role:'Sponsor; owns the scrap budget',inf:'5',int:'4',now:'Supportive',need:'Champion',act:'Monthly 15-minute review'},
 {who:'Line 3 supervisor',role:'Process owner; runs the line',inf:'4',int:'5',now:'Neutral',need:'Champion',act:'On the team; owns the pilot shift'},
 {who:'Second-shift assemblers',role:'Do the installation',inf:'3',int:'5',now:'Against',need:'Supportive',act:'Involve in the sleeve trial; ask their ideas first'},
 {who:'Purchasing',role:'O-ring supplier contract',inf:'3',int:'2',now:'Neutral',need:'Neutral',act:'Inform if the supplier is implicated'},
 {who:'Finance',role:'Confirms the savings',inf:'2',int:'2',now:'Neutral',need:'Supportive',act:'Agree the savings method at Define'},
 {who:'OEM quality contact',role:'Customer',inf:'4',int:'4',now:'Against',need:'Supportive',act:'Update every two weeks through customer quality'}]}}
}
