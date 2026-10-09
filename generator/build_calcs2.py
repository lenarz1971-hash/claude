#!/usr/bin/env python3
"""Builds the twelve /calculators/<slug>.html pages with the calculator working
on the page itself, in the same layout as /tools/ (title, lede, the calculator
with the standard toolbar, then the explanation and related links).

Inputs
  calc_app/panels.json, calc_app/runtime.js, calc_app/scoped.css  (extract_calc_app.py)
  calc_page.js     the toolbar, autosave and file handling
  the existing calculator pages, for each page's title, description, lede and explanation
Run: python3 build_calcs2.py <unused> <output site root>, then apply_chrome.py over the site."""
import os, re, sys, json, html
from tools_shell import CSS as TOOL_CSS, SITE

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, 'calc_app')
PANELS = json.load(open(os.path.join(APP, 'panels.json'), encoding='utf-8'))
RUNTIME = open(os.path.join(APP, 'runtime.js'), encoding='utf-8').read()
SCOPED = open(os.path.join(APP, 'scoped.css'), encoding='utf-8').read()
WRAP = open(os.path.join(HERE, 'calc_page.js'), encoding='utf-8').read()
# page text (title, description, lede, explanation, related links), one entry per calculator
PAGES = json.load(open(os.path.join(APP, 'pages.json'), encoding='utf-8'))
# placeholder chrome: apply_chrome.py swaps in the site header and footer, and keeps the note
HEADER = '<header class="mast"></header>'
FOOTER = '''<footer><div class="wrap">
  <p>SC Quality Guild publishes independent study materials for ASQ certification examinations.
  Not affiliated with, endorsed by, sponsored by or approved by the American Society for Quality.</p>
  <p>Your work is kept in this browser only, until you clear it. Use <b>Save to a file</b> to keep a copy
  or move it to another computer.</p>
</div></footer>'''

CALC_PAGE = {'grr': 'gage-r-and-r', 'capability': 'process-capability', 'spc': 'control-chart',
             'oc': 'sampling-plan-oc-curve', 'sigma': 'sigma-level-dpmo', 'yield': 'rolled-throughput-yield',
             'pareto': 'pareto-chart', 'constants': 'control-chart-constants', 'samplesize': 'sample-size',
             'grrcpk': 'gage-rr-impact-on-cpk', 'linearity': 'linearity-study', 'hypothesis': 'hypothesis-test-selector'}

CSS_CALC = """
#tool .tool{border:0;margin:0;padding:0;background:none;box-shadow:none}
#tool .tool-h{display:none}
#tool .tool-b{padding:6px 0 0}
#tool .dupe{display:none!important}
#tool .tool table{table-layout:auto;margin:0;font-size:inherit}
#tool .tool td:first-child{width:auto}
#tool .tool td,#tool .tool th{overflow-wrap:normal}
#tool .tool .tool-h{display:none}
#tool .tool table.dg input:not(.num){text-align:left;font:400 14.5px var(--serif);color:var(--ink)}
.hintline{font:600 10.5px var(--mono);letter-spacing:.06em;color:var(--ink-3);margin:2px 0 10px}
@media print{
  #tool .btnrow,#tool .dg-bar,#tool .dg-del,#tool .dg-add{display:none!important}
  #tool .tool input[type=range]+.pv{display:none}
  #tool .plot svg{max-width:100%}
  #tool .tool-b{break-inside:auto}
}
"""

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/calculators/{slug}.html">
<meta property="og:type" content="article">
<meta property="og:title" content="{ogtitle}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}/calculators/{slug}.html">
<meta property="og:site_name" content="SC Quality Guild">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<script type="application/ld+json">{jsonld}</script>
<style>{css}</style>
</head>
<body>
{header}
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/calculators/">Calculators</a> &rsaquo; {crumb}</p></div>
<article>
<div class="wrap">
<h1>{h1}</h1>
<p class="printonly">SCQUALITYGUILD.COM/CALCULATORS/{slug_upper}.HTML</p>
<p class="lede">{lede}</p>
<p class="covers">{hint}FREE &middot; NOTHING YOU TYPE LEAVES YOUR BROWSER</p>
</div>
<div class="toolwrap"><div id="tool">{panel}<noscript><p>This calculator needs JavaScript switched on.</p></noscript></div></div>
<div class="wrap explain">
{content}
<h2 class="relh">Other calculators</h2><div class="rel">
{rel}
</div>
</div>
</article>
{footer}
<script>window.CALC={{"id":"{id}","slug":"{slug}"}};</script>
<script>{runtime}</script>
<script>{wrap}</script>
</body>
</html>
"""

def grab(t, pat, flags=re.S):
    m = re.search(pat, t, flags)
    if not m: raise SystemExit('pattern not found: ' + pat)
    return m.group(1)

def parse_existing(path):
    t = open(path, encoding='utf-8').read()
    body = t[t.index('<body'):]
    d = {
        'title': grab(t, r'<title>(.*?)</title>'),
        'desc': grab(t, r'<meta name="description" content="(.*?)">'),
        'ogtitle': grab(t, r'<meta property="og:title" content="(.*?)">'),
        'jsonld': grab(t, r'<script type="application/ld\+json">(.*?)</script>'),
        'h1': grab(body, r'<h1>(.*?)</h1>'),
        'lede': grab(body, r'<p class="lede">(.*?)</p>'),
        'crumb': grab(body, r'<p class="crumb">.*?&rsaquo;.*?&rsaquo; (.*?)</p>'),
    }
    # explanation: everything after the call-to-action box, up to the related links
    a = body.index('</div>', body.index('<div class="cta">')) + len('</div>')
    b = body.index('<h2>Other calculators</h2>')
    d['content'] = body[a:b].strip()
    d['rel'] = grab(body, r'<h2>Other calculators</h2><div class="rel">\s*(.*?)\s*</div>')
    return d

def header_footer(path):
    t = open(path, encoding='utf-8').read()
    h = t[t.index('<header'):t.index('</header>') + 9]
    f = t[t.index('<footer'):t.index('</footer>') + 9]
    return h, f

def build(src_root, out_root):
    out = os.path.join(out_root, 'calculators'); os.makedirs(out, exist_ok=True)
    for cid, slug in CALC_PAGE.items():
        src = os.path.join(src_root, 'calculators', slug + '.html')
        d = PAGES[slug]
        header, footer = HEADER, FOOTER
        panel = PANELS[cid]
        hint = re.search(r'<span class="hint">(.*?)</span>', panel, re.S)
        hint = (hint.group(1).strip() + ' &middot; ') if hint else ''
        for s in [RUNTIME, WRAP]:
            if '</script' in s.lower(): raise SystemExit('</script inside script')
        page = SHELL.format(title=d['title'], desc=d['desc'], ogtitle=d['ogtitle'], site=SITE, slug=slug,
                            slug_upper=slug.upper(), jsonld=d['jsonld'],
                            css=TOOL_CSS + SCOPED + CSS_CALC, header=header, crumb=d['crumb'],
                            h1=d['h1'], lede=d['lede'], hint=hint, panel=panel, content=d['content'],
                            rel=d['rel'], footer=footer, id=cid, runtime=RUNTIME, wrap=WRAP)
        open(os.path.join(out, slug + '.html'), 'w', encoding='utf-8').write(page)
        print('built', slug, len(page))

if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
