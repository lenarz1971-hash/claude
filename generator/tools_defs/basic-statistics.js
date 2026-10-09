{
slug:'basic-statistics',
sections:[
 {type:'fields',title:'Your data',hint:'Type your readings into the grid, five to a row, or paste a block straight from a spreadsheet. Blank cells are ignored.',fields:[
  {id:'label',label:'What was measured',ph:'e.g. Shaft diameter, mm',wide:true},
  {id:'data',label:'Values, five to a row',type:'datagrid',flat:true,cols:[{label:'1'},{label:'2'},{label:'3'},{label:'4'},{label:'5'}],rows:6,minRows:3},
  {id:'dp',label:'Decimal places to show',type:'number',min:0,max:8,ph:'auto'}]},
 {type:'custom',id:'res',title:'Results',html:'<div class="bs-res"></div>'},
 {type:'custom',id:'hist',title:'Histogram',html:'<div class="svgw bs-h"></div>'},
 {type:'custom',id:'read',title:'What the numbers say',html:'<div class="out bs-out"></div>'}
],
update:function(root,api){
 var S=api.state(), raw=(S.f.data||'').split(/[\s,;]+/).filter(Boolean), bad=[], x=[];
 raw.forEach(function(t){ var v=Number(t); if(isFinite(v)) x.push(v); else bad.push(t); });
 var R=root.querySelector('.bs-res'), H=root.querySelector('.bs-h'), O=root.querySelector('.bs-out');
 if(x.length<2){ R.innerHTML='<p class="th">Enter at least two numbers.</p>'; H.innerHTML=''; O.innerHTML=bad.length?'<span class="flag warn">Not numbers, ignored: '+bad.map(api.esc).join(', ')+'</span>':''; return; }
 var n=x.length, s=x.slice().sort(function(a,b){return a-b;});
 var sum=x.reduce(function(a,b){return a+b;},0), mean=sum/n;
 var med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
 var ss=x.reduce(function(a,b){return a+(b-mean)*(b-mean);},0), sd=Math.sqrt(ss/(n-1)), sdp=Math.sqrt(ss/n);
 function q(p){ var h=(n-1)*p, lo=Math.floor(h); return s[lo]+(h-lo)*((s[lo+1]!==undefined?s[lo+1]:s[lo])-s[lo]); }
 var cnt={}; x.forEach(function(v){cnt[v]=(cnt[v]||0)+1;}); var mx=Math.max.apply(null,Object.keys(cnt).map(function(k){return cnt[k];}));
 var modes=mx>1?Object.keys(cnt).filter(function(k){return cnt[k]===mx;}).map(Number).sort(function(a,b){return a-b;}):[];
 var dec=S.f.dp!==''&&S.f.dp!=null&&!isNaN(api.num(S.f.dp))?Math.min(8,Math.max(0,Math.round(api.num(S.f.dp)))):Math.min(6,Math.max.apply(null,raw.filter(function(t){return isFinite(Number(t));}).map(function(t){var m=String(t).split('.')[1];return m?m.length:0;}))+2);
 function F(v){return v.toFixed(dec);}
 var cells=[[n,'Count (n)'],[F(mean),'Mean'],[F(med),'Median'],[modes.length?(modes.length>3?'Several':modes.map(F).join(', ')):'None','Mode'+(modes.length?' ('+mx+'×)':'')],
  [F(s[0]),'Minimum'],[F(s[n-1]),'Maximum'],[F(s[n-1]-s[0]),'Range'],[F(sd),'Std dev, sample (s)'],[F(sdp),'Std dev, population (σ)'],[Number((sd*sd).toPrecision(4)),'Variance, sample'],
  [F(q(.25)),'Q1'],[F(q(.75)),'Q3'],[F(q(.75)-q(.25)),'Interquartile range'],[mean!==0?(sd/Math.abs(mean)*100).toFixed(2)+'%':'—','Coefficient of variation']];
 R.innerHTML='<div class="stat">'+cells.map(function(c){return '<div><b>'+c[0]+'</b><span>'+c[1]+'</span></div>';}).join('')+'</div>';
 var k=Math.max(5,Math.min(20,Math.ceil(Math.log2(n)+1))), lo=s[0], hi=s[n-1], w=(hi-lo)/k||1, bins=new Array(k).fill(0);
 x.forEach(function(v){ var i=Math.floor((v-lo)/w); if(i>=k) i=k-1; if(i<0) i=0; bins[i]++; });
 var W=800,Ht=300,pl=40,pb=40,pt=14,bw=(W-pl-10)/k,bm=Math.max.apply(null,bins);
 var g='<svg viewBox="0 0 '+W+' '+Ht+'" role="img" aria-label="Histogram"><style>text{font:11px \'IBM Plex Mono\',monospace;fill:#7C8B99}</style>';
 bins.forEach(function(b,i){ var h=(Ht-pb-pt)*b/bm; g+='<rect x="'+(pl+i*bw+1)+'" y="'+(Ht-pb-h)+'" width="'+(bw-2)+'" height="'+h+'" fill="#0F3E68"/>'+(b?'<text x="'+(pl+i*bw+bw/2)+'" y="'+(Ht-pb-h-4)+'" text-anchor="middle">'+b+'</text>':''); });
 for(var i=0;i<=k;i+=Math.max(1,Math.ceil(k/8))) g+='<text x="'+(pl+i*bw)+'" y="'+(Ht-pb+16)+'" text-anchor="'+(i===0?'start':(i+Math.max(1,Math.ceil(k/8))>k?'end':'middle'))+'">'+F(lo+i*w)+'</text>';
 function vline(v,c,l,yy,left){ var X=pl+(v-lo)/(w*k)*(W-pl-10); return '<line x1="'+X+'" x2="'+X+'" y1="'+pt+'" y2="'+(Ht-pb)+'" stroke="'+c+'" stroke-width="2" stroke-dasharray="5 3"/><text x="'+(left?X-4:X+4)+'" y="'+yy+'" text-anchor="'+(left?'end':'start')+'" style="fill:'+c+';font-weight:600">'+l+'</text>'; }
 var mr=mean>=med; g+=vline(mean,'#9C7C1F','mean',pt+10,!mr)+vline(med,'#1F8C55','median',pt+10,mr);
 g+='<line x1="'+pl+'" x2="'+(W-10)+'" y1="'+(Ht-pb)+'" y2="'+(Ht-pb)+'" stroke="#C6CDD3"/></svg>';
 H.innerHTML=g;
 var f=[], gap=sd?(mean-med)/sd:0;
 if(bad.length) f.push(['warn','Not numbers, ignored: '+bad.map(api.esc).join(', ')]);
 if(Math.abs(gap)>=0.2) f.push(['warn','The mean is '+Math.abs(gap).toFixed(2)+' standard deviations '+(gap>0?'above':'below')+' the median. The data look skewed to the '+(gap>0?'right':'left')+', and the median is the better description of a typical value.']);
 else f.push(['ok','Mean and median are close (within '+Math.abs(gap).toFixed(2)+' standard deviations), which is what a roughly symmetric distribution looks like.']);
 var iqr=q(.75)-q(.25), out=x.filter(function(v){return v<q(.25)-1.5*iqr||v>q(.75)+1.5*iqr;});
 if(out.length&&iqr>0) f.push(['warn',out.length+' value'+(out.length>1?'s are':' is')+' more than 1.5 × IQR outside the quartiles: '+out.slice(0,8).map(F).join(', ')+(out.length>8?' …':'')+'. Find out what happened before deleting anything.']);
 if(n<30) f.push(['','With '+n+' values, the standard deviation is itself uncertain. Treat the shape of the histogram with caution below about 30 values.']);
 f.push(['','Sample standard deviation divides by n − 1 = '+(n-1)+'; population divides by n = '+n+'. Use the sample figure when the data are a sample of a larger process, which is almost always.']);
 O.innerHTML=f.map(function(z){return '<span class="flag '+z[0]+'">'+z[1]+'</span>';}).join('');
},
example:{f:{label:'Shaft diameter, mm (30 parts)',dp:'',data:'10.02 10.05 9.98 10.01 10.03 9.99 10.00 10.04 10.02 10.01\n9.97 10.02 10.06 10.00 10.01 10.03 9.99 10.02 10.00 10.12\n10.01 9.98 10.02 10.03 10.00 10.01 10.04 9.99 10.02 10.01'}}
}
