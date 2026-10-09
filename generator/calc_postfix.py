#!/usr/bin/env python3
"""Applies calc_fixes.json (content-audit corrections, 5 Oct 2026) to the built /calculators/ pages.
build_calcs2.py takes page text from calc_app/pages.json; these fixes sit on top. Idempotent.
Run after build_calcs2.py: python3 calc_postfix.py <site root>"""
import json, os, sys
root = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__))
n = 0
for f in json.load(open(os.path.join(here, 'calc_fixes.json'), encoding='utf-8')):
    p = os.path.join(root, f['file']); t = open(p, encoding='utf-8').read()
    o, w = f['old'].replace('per cent', 'percent'), f['new'].replace('per cent', 'percent')
    if w in t and o in w: continue
    if o in t: t = t.replace(o, w); open(p, 'w', encoding='utf-8').write(t); n += 1
print('calc fixes applied', n)
