"""Collects the app's masthead and footer CSS (index.html) in a real browser:
every rule that styles the header or footer, keeping only selectors that name
the chrome itself, so no generic app rule leaks onto the static pages.
Run: python3 chrome_css.py <site root> <out.css>"""
import asyncio, sys, subprocess, time, json, re
from playwright.async_api import async_playwright
ROOT=sys.argv[1]; OUT=sys.argv[2]
srv=subprocess.Popen([sys.executable,'-m','http.server','8778','-d',ROOT],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
JS="""()=>{
 const els=[...document.querySelectorAll('header.mast, header.mast *, footer, footer *')];
 const ok=/(^|[\\s>+~,(])(\\.mast|\\.mast-in|\\.logo|\\.burger|footer|\\.fgrid|\\.lockup|\\.legal|\\.buildstamp)(?![\\w-])/;
 const out=[];
 function walk(rules,media){ for(const r of rules){
   if(r.type===1){ const sels=r.selectorText.split(',').map(s=>s.trim()).filter(s=>{ if(!ok.test(s)) return false;
       const base=s.replace(/::?(before|after|placeholder)/g,'').replace(/:(hover|focus|focus-visible|active)/g,'');
       try{ return els.some(e=>e.matches(base)) || /\\.open|aria-current|aria-expanded/.test(s); }catch(e){ return false; } });
     if(sels.length) out.push((media?'@media '+media+'{':'')+sels.join(',')+'{'+r.style.cssText+'}'+(media?'}':''));
   } else if(r.type===4) walk(r.cssRules, r.conditionText||r.media.mediaText); } }
 for(const ss of document.styleSheets){ try{ walk(ss.cssRules,''); }catch(e){} }
 const root=getComputedStyle(document.documentElement); const vars={};
 out.join('').replace(/var\\((--[\\w-]+)/g,(m,v)=>{ vars[v]=root.getPropertyValue(v).trim(); });
 return {rules:out, vars};
}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
    await pg.goto('http://localhost:8778/'); await pg.wait_for_timeout(900)
    r=await pg.evaluate(JS)
    css=':root{'+';'.join(f'{k}:{v}' for k,v in sorted(r['vars'].items()) if v)+'}\n'+'\n'.join(r['rules'])
    open(OUT,'w').write(css); print('rules',len(r['rules']),'vars',len(r['vars']))
    await b.close()
asyncio.run(main()); srv.terminate()
