{
slug:'team-development-stages',
sections:[
 {type:'fields',title:'The team',cols:3,fields:[{id:'team',label:'Team',ph:'e.g. Line 3 seal project team'},{id:'type',label:'Type of team',type:'select',opts:['Process improvement','Cross-functional','Self-directed / work group','Special project','Virtual']},{id:'weeks',label:'Weeks together',type:'number',min:0}]},
 {type:'custom',id:'q',title:'How true is each statement of your team right now?',hint:'1 = not at all, 5 = completely. Answer for how the team behaves, not how it ought to. Better still, have each member answer separately and compare.',html:'<div class="ts-q"></div>'},
 {type:'custom',id:'res',title:'Where the team is, and what helps',html:'<div class="ts-bars"></div><div class="out ts-out"></div>'}
],
blankX:function(){return {a:{}};},
update:function(root,api){
 var S=api.state(), a=S.x.a||(S.x.a={});
 var Q=[
  ['Forming','People are polite and careful about disagreeing.'],['Forming','Members are unsure what the project is for or what their part is.'],['Forming','Most questions go to the leader rather than to each other.'],['Forming','People are still working out whether this team is worth their time.'],
  ['Storming','Disagreements about the approach come up often and get personal.'],['Storming','Some members push back on the leader or on the charter.'],['Storming','Roles overlap or are contested.'],['Storming','Meetings run over because the same arguments return.'],
  ['Norming','The team has agreed how it makes decisions and sticks to it.'],['Norming','People give each other feedback without it causing friction.'],['Norming','Members help each other without being asked.'],['Norming','The ground rules are used, not just written down.'],
  ['Performing','The team solves problems without the leader in the room.'],['Performing','Work is shared out and finished without chasing.'],['Performing','Disagreement is about the evidence, and it moves the work on.'],['Performing','The team measures its own progress against the goal.']];
 var host=root.querySelector('.ts-q');
 if(!host.dataset.built){ host.dataset.built='1';
  host.innerHTML=Q.map(function(q,i){ return '<div class="ts-r"><span>'+(i+1)+'. '+q[1]+'</span><div class="ts-s" role="radiogroup" aria-label="Statement '+(i+1)+'">'+[1,2,3,4,5].map(function(v){return '<label><input type="radio" name="q'+i+'" value="'+v+'"'+(a[i]==v?' checked':'')+'><b>'+v+'</b></label>';}).join('')+'</div></div>'; }).join('');
  host.querySelectorAll('input[type=radio]').forEach(function(r){ r.onchange=function(){ a[r.name.slice(1)]=+r.value; api.save(); }; });
 } else host.querySelectorAll('input[type=radio]').forEach(function(r){ r.checked=a[r.name.slice(1)]==r.value; });
 var st=['Forming','Storming','Norming','Performing'], sc={}, cnt={};
 st.forEach(function(s){sc[s]=0;cnt[s]=0;});
 Q.forEach(function(q,i){ if(a[i]){ sc[q[0]]+=a[i]; cnt[q[0]]++; } });
 var answered=Object.keys(a).filter(function(k){return a[k];}).length;
 var avg=st.map(function(s){return cnt[s]?sc[s]/cnt[s]:0;});
 root.querySelector('.ts-bars').innerHTML='<div class="ts-b">'+st.map(function(s,i){return '<div><span>'+s+'</span><i style="width:'+(avg[i]/5*100)+'%"></i><b>'+(cnt[s]?avg[i].toFixed(1):'—')+'</b></div>';}).join('')+'</div>';
 var help={Forming:'Set direction: walk the charter, agree roles, set ground rules and early wins. The leader does more directing here than at any other stage.',
  Storming:'Bring the conflict into the open and keep it on the work. Revisit the charter and roles, agree how decisions get made, and do not skip this stage by suppressing it; it comes back later.',
  Norming:'Step back from directing. Let the team run its own meetings and decisions, and reinforce the norms it has set.',
  Performing:'Delegate, remove obstacles and stay out of the way. Watch for a change of members or scope, which can send the team back a stage.'};
 var f=[];
 if(answered<16) f.push(['',answered+' of 16 answered.']);
 if(answered>=8){
  var best=0; for(var i=1;i<4;i++) if(avg[i]>avg[best]) best=i;
  var top=st[best]; f.push(['ok','Strongest match: <b>'+top+'</b> ('+avg[best].toFixed(1)+' of 5). '+help[top]]);
  var second=avg.map(function(v,i){return [v,i];}).filter(function(x){return x[1]!==best;}).sort(function(x,y){return y[0]-x[0];})[0];
  if(avg[best]-second[0]<0.5) f.push(['','<b>'+st[second[1]]+'</b> scores almost as high. Teams are often between stages, or move back and forth; talk it through with the team rather than treating the score as a verdict.']);
 }
 root.querySelector('.ts-out').innerHTML=api.flags(f);
},
example:{f:{team:'Line 3 seal project team',type:'Process improvement',weeks:'6'},x:{a:{0:2,1:2,2:3,3:2,4:4,5:3,6:4,7:4,8:2,9:2,10:3,11:2,12:1,13:2,14:2,15:2}}}
}
