#!/usr/bin/env python3
"""Test tool pages built by build_one.py. Run: python3 test_one.py <out root> <slug> [slug ...]
Checks: example on fresh load, example button, reload persistence, save/clear/open round trip,
grid add/delete/CSV, print view, 390 px overflow, JS errors. Writes screenshots to <out root>/shots/."""
import http.server, socketserver, threading, os, sys
from playwright.sync_api import sync_playwright
ROOT=sys.argv[1]; SLUGS=sys.argv[2:]; SP=os.path.join(ROOT,'shots')+'/'; os.makedirs(SP,exist_ok=True)
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s,*a,**k): super().__init__(*a,directory=ROOT,**k)
    def log_message(s,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',0),H); port=srv.server_address[1]; threading.Thread(target=srv.serve_forever,daemon=True).start()
B=f'http://127.0.0.1:{port}/tools/'; probs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1280,'height':900},accept_downloads=True)
    ctx.route('**/*', lambda r: r.abort() if 'fonts.g' in r.request.url else r.continue_())
    for s in SLUGS:
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(B+s+'.html'); pg.wait_for_timeout(300)
        first=pg.locator('.flag').all_inner_texts()
        filled=pg.evaluate("[...document.querySelectorAll('#tool input[type=text],#tool input[type=number],#tool textarea,#tool input:not([type])')].filter(e=>e.value.trim()).length")
        if filled<1 or not first: probs.append(s+': fresh load did not show the example (filled=%d flags=%d)'%(filled,len(first)))
        pg.click('[data-act=example]'); pg.wait_for_timeout(250)
        flags=pg.locator('.flag').all_inner_texts()
        if flags!=first: probs.append(s+': fresh-load state differs from the worked example')
        pg.screenshot(path=SP+s+'.png',full_page=True)
        pg.reload(); pg.wait_for_timeout(250)
        if pg.locator('.flag').all_inner_texts()!=flags: probs.append(s+': state not restored after reload')
        with pg.expect_download() as d: pg.click('[data-act=download]')
        path=SP+s+'.json'; d.value.save_as(path)
        pg.click('[data-act=clear]'); pg.click('[data-act=clear]'); pg.wait_for_timeout(150)
        if pg.locator('.flag').all_inner_texts()==flags: probs.append(s+': clear did nothing')
        pg.set_input_files('[data-act=open]',path); pg.wait_for_timeout(350)
        if pg.locator('.flag').all_inner_texts()!=flags: probs.append(s+': open file did not restore')
        for gid in pg.eval_on_selector_all('table[data-grid]','e=>e.map(x=>x.dataset.grid)'):
            n0=pg.locator(f'table[data-grid="{gid}"] tbody tr').count()
            pg.click(f'[data-add="{gid}"]'); n1=pg.locator(f'table[data-grid="{gid}"] tbody tr').count()
            pg.click(f'[data-del="{gid}"][data-r="{n1-1}"]'); n2=pg.locator(f'table[data-grid="{gid}"] tbody tr').count()
            if not(n1==n0+1 and n2==n0): probs.append(f'{s}: grid {gid} add/del {n0},{n1},{n2}')
            with pg.expect_download() as d: pg.click(f'[data-csv="{gid}"]')
        pg.emulate_media(media='print'); pg.screenshot(path=SP+'print_'+s+'.png',full_page=True)
        pg.pdf(path=SP+s+'.pdf',format='Letter',print_background=True); pg.emulate_media(media='screen')
        m=ctx.new_page(); m.set_viewport_size({'width':390,'height':800}); m.goto(B+s+'.html'); m.wait_for_timeout(250)
        ov=m.evaluate('document.documentElement.scrollWidth-390')
        if ov>0: probs.append(f'{s}: 390px overflow {ov}px')
        m.screenshot(path=SP+'m_'+s+'.png',full_page=True); m.close()
        if errs: probs.append(s+': JS errors '+str(errs))
        print('==',s,'| flags:',len(flags)); [print('   -',f[:240]) for f in flags]
        pg.close()
    b.close()
print('PROBLEMS:',probs if probs else 'none')
