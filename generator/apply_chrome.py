#!/usr/bin/env python3
"""Puts one header and one footer on every static page: the home page's.

Run it last, over the whole site, after every other build step:
    python3 apply_chrome.py <site root>

For every .html file except index.html (the app, which owns the originals):
  1. the old site header is replaced with the home page header (logo, one row, MENU on phones)
  2. the old site footer is replaced with the home page footer; any page-specific note
     in the old footer (not the standard ASQ disclaimer) is kept just above it
  3. the old header/footer CSS is removed from the page's styles, and the shared
     chrome CSS (chrome.css, collected from the app by chrome_css.py) is added
  4. a few lines of script run the phone menu and the footer year
It is idempotent: running it twice gives the same result."""
import os, re, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME_CSS = open(os.path.join(HERE, 'chrome.css'), encoding='utf-8').read()
CHROME_CSS += """
footer .wrap{max-width:1180px;margin:0 auto;padding:0 32px}
@media (max-width:640px){footer .wrap{padding:0 20px}}
footer .legal{grid-column:1/-1}
.pagenote{max-width:760px;margin:40px auto 0;padding:0 26px}
.pagenote p{font:400 14.5px/1.6 var(--serif);color:var(--ink-3);margin:0 0 .6em}
@media print{.mast,footer,.pagenote{display:none!important}}
"""

NAV = [('/', 'Home', 'home'), ('/#/hour', 'Trivia', 'hour'), ('/#/clinic', 'Quality Clinic', 'clinic'),
       ('/resources/', 'Resources', 'resources'), ('/#/study-groups', 'Study groups', 'groups'),
       ('/#/tests', 'Practice tests', 'tests'), ('/#/primers', 'The primers', 'primers'),
       ('/#/about', 'About us', 'about')]

def section(rel):
    """Which menu item a page belongs under."""
    if rel.startswith(('resources/', 'tools/', 'calculators/', 'sim/')) or rel == 'simulations.html': return 'resources'
    if rel.startswith('assessment/'): return 'tests'
    if rel.startswith('primers/'): return 'primers'
    if rel == 'study-groups.html': return 'groups'
    if rel == 'about.html': return 'about'
    return ''

def header(cur):
    links = ''.join('\n      <a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if k == cur else '', t) for h, t, k in NAV)
    return ('<header class="mast">\n  <div class="mast-in">\n'
            '    <a class="logo" href="/"><img src="/img/logo.png" alt="" width="34" height="40">'
            '<b>SC QUALITY GUILD<span>DON’T DO THIS ALONE</span></b></a>\n'
            '    <button class="burger" type="button" aria-expanded="false" aria-label="Menu">MENU</button>\n'
            '    <nav>' + links + '\n    </nav>\n  </div>\n</header>')

def footer_from_app(index_html):
    t = open(index_html, encoding='utf-8').read()
    f = t[t.rindex('<footer'):t.rindex('</footer>') + len('</footer>')]
    f = re.sub(r'<img class="lockup" src="data:image/png;base64,[^"]+"', '<img class="lockup" src="/img/lockup.png" width="136" height="128"', f)
    f = re.sub(r'href="#/', 'href="/#/', f)
    f = re.sub(r'\s*<span class="buildstamp">.*?</span>', '', f)
    f = re.sub(r'<!--.*?-->\s*', '', f, flags=re.S)
    return f

SCRIPT = """<script>/* site chrome: phone menu and footer year */
(function(){var b=document.querySelector('.mast .burger'),n=document.querySelector('.mast nav');
if(b&&n)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();})();</script>"""

STANDARD = re.compile(r'publishes independent study materials|Not affiliated with|Examination facts are taken from|Notice and disclaimer', re.I)

def page_notes(old_footer):
    """Paragraphs from the old footer worth keeping: anything that is not the standard disclaimer."""
    paras = re.findall(r'<p\b[^>]*>(.*?)</p>', old_footer, re.S)
    keep = [p.strip() for p in paras if not STANDARD.search(p)]
    if not keep: return ''
    return '<div class="pagenote">' + ''.join('<p>' + re.sub(r'\s+', ' ', p) + '</p>' for p in keep) + '</div>\n'

CHROME_SEL = re.compile(r'^(header\.mast|\.mast|footer|\.logo|\.sqg-(mast|foot|wrap|logo|nav))(?![\w-])')

def strip_css(css):
    """Remove rules whose every selector is old site chrome; recurse into @media."""
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: out.append(css[i:]); break
        pre = css[i:j]
        # comments before the selector
        sel = re.sub(r'/\*.*?\*/', '', pre, flags=re.S).strip()
        if sel.startswith('@media') or sel.startswith('@supports'):
            depth, k = 1, j + 1
            while depth and k < n:
                if css[k] == '{': depth += 1
                elif css[k] == '}': depth -= 1
                k += 1
            inner = strip_css(css[j + 1:k - 1])
            if inner.strip(): out.append(pre + '{' + inner + '}')
            i = k; continue
        k = css.find('}', j)
        if k < 0: out.append(css[i:]); break
        sels = [s.strip() for s in sel.split(',') if s.strip()]
        if sels and all(CHROME_SEL.match(s) for s in sels):
            pass  # drop the old chrome rule
        else:
            out.append(css[i:k + 1])
        i = k + 1
    return ''.join(out)

def balanced_div(t, start):
    depth = 0
    for m in re.finditer(r'<(/?)div\b', t[start:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return t.index('>', start + m.end()) + 1
    return None

def find_header(t):
    """The site header, in whichever of the three forms the page uses."""
    m = re.search(r'<header class="mast">.*?</header>', t, re.S)
    if m: return m.start(), m.end()
    for cls in ('mast', 'sqg-mast'):
        i = t.find('<div class="%s">' % cls)
        if i >= 0:
            end = balanced_div(t, i)
            return i, end
    return None

def apply(path, rel, footer):
    t = open(path, encoding='utf-8').read()
    t = re.sub(r'<style id="chrome">.*?</style>\n?', '', t, flags=re.S)
    t = re.sub(r'<script>/\* site chrome:.*?</script>\n?', '', t, flags=re.S)
    # header
    span = find_header(t)
    if not span: raise SystemExit('no site header in ' + rel)
    t = t[:span[0]] + header(section(rel)) + t[span[1]:]
    # footer: the last <footer> on the page is the site footer
    a = t.rfind('<footer'); b = t.find('</footer>', a) + len('</footer>')
    if a < 0: raise SystemExit('no footer in ' + rel)
    old = t[a:b]
    notes = '' if 'class="wrap fgrid"' in old else page_notes(old)
    t = t[:a] + notes + footer + t[b:]
    # styles
    def fix(mo):
        return mo.group(1) + strip_css(mo.group(2)) + mo.group(3)
    t = re.sub(r'(<style>)(.*?)(</style>)', fix, t, flags=re.S)
    t = t.replace('</head>', '<style id="chrome">' + CHROME_CSS + '</style>\n</head>', 1)
    t = t.replace('</body>', SCRIPT + '\n</body>', 1)
    open(path, 'w', encoding='utf-8', newline='').write(t)

def main(root):
    footer = footer_from_app(os.path.join(root, 'index.html'))
    n = 0
    for dp, dn, fn in os.walk(root):
        if '/generator' in dp: continue
        for f in fn:
            if not f.endswith('.html'): continue
            rel = os.path.relpath(os.path.join(dp, f), root).replace(os.sep, '/')
            if rel in ('index.html', 'admin.html') or rel.startswith(('google', 'img/')): continue
            apply(os.path.join(dp, f), rel, footer); n += 1
    print('chrome applied to', n, 'pages')

if __name__ == '__main__':
    main(sys.argv[1])
