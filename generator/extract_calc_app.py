#!/usr/bin/env python3
"""Pulls the twelve calculators out of the app (index.html) so each can run on
its own /calculators/<slug>.html page, the same way the tools do.

Writes generator/calc_app/:
  panels.json   the HTML panel of each calculator, keyed by app id
  runtime.js    helpers + DataGrid + grids + math core + the twelve tool functions
  scoped.css    every app CSS rule a calculator uses, scoped under #tool

The CSS rule list (rules.json) is collected by css_rules.py in a real browser:
the rules that actually match each calculator's elements after its worked
example has run, plus every rule naming a class the calculator code adds later.
Run: python3 extract_calc_app.py <path to index.html> <rules.json>"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "calc_app")
IDS = ['capability', 'spc', 'grr', 'sigma', 'pareto', 'oc', 'constants', 'yield',
       'samplesize', 'grrcpk', 'linearity', 'hypothesis']

def block(t, start):
    depth = 0
    for m in re.finditer(r'<(/?)div\b', t[start:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            end = start + m.end()
            return t[start:t.index('>', end) + 1]
    raise SystemExit('unbalanced div')

def main(index_path, rules_path):
    t = open(index_path, encoding='utf-8').read()
    os.makedirs(OUT, exist_ok=True)

    panels = {}
    for k in IDS:
        m = re.search(r'<div class="tool" id="' + k + '">', t)
        panels[k] = block(t, m.start())
    json.dump(panels, open(os.path.join(OUT, 'panels.json'), 'w'), ensure_ascii=False, indent=1)

    # helpers ($, $$, el, svgEl) and the SVG namespace
    i = t.index('function $(s, r)')
    j = t.index('function pad2(n)', i)
    helpers = "const NS = 'http://www.w3.org/2000/svg';\n" + t[i:j]
    # the calculator code: from DATAGRID up to the app router (const VIEWS)
    a = t.index('DATAGRID')
    a = t.rindex('/*', 0, a)
    b = t.index('const VIEWS', a)
    code = t[a:b]
    for must in ['function DataGrid', 'function initGrids', 'function toolCapability',
                 'function toolGrrCpk', 'function initTools']:
        assert must in code, must
    js = '/* Extracted from the app by extract_calc_app.py. Do not edit here; edit index.html and re-extract. */\n' \
         + helpers + '\n' + code
    open(os.path.join(OUT, 'runtime.js'), 'w', encoding='utf-8').write(js)

    # CSS: rules collected in the browser, scoped to #tool
    css = t[t.index('<style'):t.index('</style>')]
    appvars = dict(re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', re.search(r':root\s*\{([^}]*)\}', css).group(1)))
    rules = json.load(open(rules_path))
    out, used = [], set()
    by_media = {}
    for r in rules:
        def scope(x):
            # the calculator panel itself is div.tool; everything else lives inside it,
            # so app rules can never reach the page toolbar or the explanation
            return '#tool ' + x if re.match(r'\.tool(?![\w-])', x) else '#tool .tool ' + x
        sel = ','.join(scope(s) for s in r['sel'])
        by_media.setdefault(r['media'], []).append(sel + '{' + r['body'] + '}')
        used.update(re.findall(r'var\((--[\w-]+)', r['body']))
    out.append('#tool .tool{' + ';'.join(f'{v}:{appvars[v]}' for v in sorted(used) if v in appvars) + '}')
    for media, lst in by_media.items():
        if media:
            out.append('@media ' + media + '{' + '\n'.join(lst) + '}')
        else:
            out.extend(lst)
    open(os.path.join(OUT, 'scoped.css'), 'w', encoding='utf-8').write('\n'.join(out))
    print('panels', len(panels), 'runtime', len(js), 'css rules', len(rules))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
