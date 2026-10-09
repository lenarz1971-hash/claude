#!/usr/bin/env python3
"""Build one or more tool pages from a content module, for testing.
Run: python3 build_one.py <content_module e.g. tools_content3_a> <out root> [slug ...]
Writes <out root>/tools/<slug>.html (site chrome applied)."""
import os, sys, importlib, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_tools
mod = importlib.import_module(sys.argv[1]); out = sys.argv[2]; want = sys.argv[3:]
pages = [v for k, v in vars(mod).items() if k.startswith('PAGES')][0]
build_tools.PAGES[:] = build_tools.PAGES + [p for p in pages if p['slug'] not in build_tools.SLUGS]
build_tools.SLUGS[:] = [p['slug'] for p in build_tools.PAGES]
os.makedirs(os.path.join(out, 'tools'), exist_ok=True)
import shutil
shutil.copy('/home/claude/merged7/index.html', os.path.join(out, 'index.html'))
for p in pages:
    if want and p['slug'] not in want: continue
    open(os.path.join(out, 'tools', p['slug'] + '.html'), 'w', encoding='utf-8').write(build_tools.build(p))
    print('built', p['slug'])
import apply_chrome
footer = apply_chrome.footer_from_app(os.path.join(out, 'index.html'))
for p in pages:
    if want and p['slug'] not in want: continue
    apply_chrome.apply(os.path.join(out, 'tools', p['slug'] + '.html'), 'tools/' + p['slug'] + '.html', footer)
