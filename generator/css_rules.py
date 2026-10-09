import asyncio, sys, subprocess, time, json
from playwright.async_api import async_playwright
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/merged5'
srv=subprocess.Popen([sys.executable,'-m','http.server','8773','-d',ROOT],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
ids=['capability','spc','grr','sigma','pareto','oc','constants','yield','samplesize','grrcpk','linearity','hypothesis']
JS="""(id)=>{
 const panel=document.getElementById(id); const els=[panel,...panel.querySelectorAll('*')];
 const out=[];
 function walk(rules, media){
   for(const r of rules){
     if(r.type===1){ // style
       const sels=r.selectorText.split(',').map(s=>s.trim());
       const keep=sels.filter(s=>{ const base=s.replace(/::?(before|after|placeholder|-webkit-[a-z-]+|-moz-[a-z-]+)/g,'').replace(/:(hover|focus|focus-visible|focus-within|active|disabled|checked)/g,''); try{ return base && els.some(e=>e.matches(base)); }catch(e){ return false; } });
       if(keep.length) out.push({media, sel:keep, body:r.style.cssText});
     } else if(r.type===4){ walk(r.cssRules, r.conditionText||r.media.mediaText); }
   }
 }
 for(const ss of document.styleSheets){ try{ walk(ss.cssRules,''); }catch(e){} }
 return out;
}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
    allr={}
    for k in ids:
      await pg.goto('http://localhost:8773/#/resource/'+k); await pg.wait_for_timeout(900)
      # click demo/run buttons if any
      await pg.evaluate("(id)=>{const p=document.getElementById(id); p.querySelectorAll('button').forEach(b=>{ if(/demo|example|run|calculate|build/i.test(b.id+' '+b.textContent)) b.click(); });}",k)
      await pg.wait_for_timeout(300)
      rs=await pg.evaluate(JS,k)
      for r in rs: allr[(r['media'],','.join(r['sel']),r['body'])]=r
      print(k,len(rs))
    # add rules for classes the calculator code adds at run time
    import re
    t=open(ROOT+'/index.html',encoding='utf-8').read()
    a=t.rindex('/*',0,t.index('DATAGRID')); code=t[a:t.index('const VIEWS',a)]
    toks=set()
    for m in re.findall(r"(?:className\s*=\s*|class\s*:\s*|el\('[a-z0-9]+',\s*)'([^']+)'",code): toks.update(m.split())
    for m in re.findall(r"classList\.(?:add|toggle|remove)\('([^']+)'",code): toks.update(m.split())
    for m in re.findall(r'class=\\?"([^"\\]+)',code): toks.update(m.split())
    toks={x for x in toks if re.match(r'^[a-z][\w-]*$',x)}
    extra=await pg.evaluate('''(toks)=>{const out=[]; const bad=/\\.(page|mast|logo|burger|fgrid|lockup|hero|pagestrip|band|navy-d)\\b|^footer|^header|^nav\\b|^body|^html|^:root/;
      function walk(rules,media){ for(const r of rules){ if(r.type===1){ const sels=r.selectorText.split(',').map(s=>s.trim()).filter(s=>!bad.test(s) && toks.some(t=>new RegExp('\\\\.'+t+'(?![\\\\w-])').test(s))); if(sels.length) out.push({media,sel:sels,body:r.style.cssText}); } else if(r.type===4) walk(r.cssRules, r.conditionText||r.media.mediaText); } }
      for(const ss of document.styleSheets){ try{ walk(ss.cssRules,''); }catch(e){} } return out; }''', sorted(toks))
    n0=len(allr)
    for r in extra: allr[(r['media'],','.join(r['sel']),r['body'])]=r
    print('class tokens',len(toks),'extra rules',len(allr)-n0)
    json.dump(list(allr.values()),open(sys.argv[2] if len(sys.argv)>2 else 'rules.json','w'))
    print('unique',len(allr))
    await b.close()
asyncio.run(main()); srv.terminate()
