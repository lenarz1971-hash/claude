#!/usr/bin/env python3
"""Adds the educational-use note to every tool, calculator and simulation page and to the
three hubs. Idempotent (skips pages that already have it). Run after apply_chrome.py.
Run: python3 add_edunote.py <site root>"""
import os, sys, glob
TEXT = ('<b>For educational use.</b> This page is a study aid. The method behind it has far more depth '
        'and detail than one page and one tool can cover, and what you see here is not everything the '
        'method offers or everything this site offers. For full understanding and application, use the '
        'governing standards and texts, and seek further education, training or qualified advice. Results '
        'depend on the data you enter, so check them before relying on them.')
NOTE = ('<style>@media print{.edunote{break-inside:avoid;page-break-inside:avoid;margin:6px auto 0!important;padding:0!important}.edunote p{font-size:8.5px!important;line-height:1.35!important;padding:5px 8px!important}}</style><div class="wrap edunote" style="max-width:760px;margin:22px auto 6px;padding:0 26px;box-sizing:border-box"><p style="font-size:14px;line-height:1.5;'
        'color:var(--ink-2,#4A5D71);background:var(--bg-2,#F6F7F4);border:1px solid var(--line,#DDE1E4);'
        'border-left:3px solid var(--gold,#D8B147);padding:10px 14px;margin:0">' + TEXT + '</p></div>\n')
MARK = 'class="wrap edunote"'
def run(root):
    pages = glob.glob(os.path.join(root, 'tools', '*.html')) + glob.glob(os.path.join(root, 'calculators', '*.html')) \
          + glob.glob(os.path.join(root, 'sim', '*.html')) + [os.path.join(root, 'resources', 'index.html')] + [p for p in glob.glob(os.path.join(root, 'assessment', '*.html')) if not p.endswith('index.html')]
    n = 0
    for p in sorted(pages):
        s = open(p, encoding='utf-8').read()
        if MARK in s: continue
        a = '<div class="wrap explain">\n'
        if s.count(a) == 1: s = s.replace(a, NOTE + a)
        else:
            assert s.count('<footer') == 1, p
            s = s.replace('<footer', NOTE + '<footer')
        open(p, 'w', encoding='utf-8').write(s); n += 1
    print('edu note added to', n, 'pages')
if __name__ == '__main__': run(sys.argv[1])
