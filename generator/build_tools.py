#!/usr/bin/env python3
"""Builds /tools/ pages for scqualityguild.com: one page per tool, the tool
working on the page itself, plus the /tools/ hub.
  tools_shell.py    shell + CSS (calculator CSS imported, tool CSS appended)
  tools_engine.js   the shared tool engine (save, open, print, CSV, grids)
  tools_defs/<slug>.js each tool's definition; tools_defs/<slug>.css optional extra CSS
  tools_content.py  titles, descriptions and the explanation under each tool
Run: python3 build_tools.py <output site root>"""
import os, sys, json, re
from tools_shell import SHELL, CSS, SITE
from calc_shell import CSS as CALC_CSS
from tools_content import PAGES, GROUPS

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/tools/out", "tools")
ENGINE = open(os.path.join(HERE, "tools_engine.js"), encoding="utf-8").read()
SLUGS = [p["slug"] for p in PAGES]

def plain(s):
    return (s.replace("&amp;", "&").replace("&mdash;", "—").replace("&rsquo;", "’"))

def rel(slug, limit=5):
    grp = next([p["slug"] for p in g[3]] for g in GROUPS if slug in {q["slug"] for q in g[3]})
    if slug not in grp: grp = SLUGS
    i = grp.index(slug); rot = grp[i+1:] + grp[:i]
    links = [f'<a href="/tools/{s}.html">{next(p["name"] for p in PAGES if p["slug"]==s)}</a>' for s in rot[:limit]]
    links.append('<a href="/calculators/">All calculators</a>')
    return "\n".join(links)

def build(p):
    slug = p["slug"]
    js = open(os.path.join(HERE, "tools_defs", slug + ".js"), encoding="utf-8").read().strip()
    cssx = os.path.join(HERE, "tools_defs", slug + ".css")
    css = CSS + (open(cssx, encoding="utf-8").read() if os.path.exists(cssx) else "")
    if "</script" in js.lower(): raise SystemExit(slug + ": </script in tool js")
    jsonld = json.dumps({"@context": "https://schema.org", "@type": "WebApplication",
        "name": plain(p["h1"]), "description": plain(p["desc"]),
        "applicationCategory": "BusinessApplication", "operatingSystem": "Any",
        "url": f"{SITE}/tools/{slug}.html",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}, ensure_ascii=False)
    return SHELL.format(site=SITE, slug=slug, title=p["title"], desc=p["desc"], jsonld=jsonld,
        css=css, h1=p["h1"], lede=p["lede"], covers=p["covers"], content=p["content"].strip(),
        rel=rel(slug), tooljs=js, engine=ENGINE, slug_upper=slug.upper())

HUB_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Free Quality Tools and Templates — Six Sigma, Audit, Inspection, CMQ/OE | SC Quality Guild</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/tools/">
<meta property="og:type" content="website">
<meta property="og:title" content="Free quality and Six Sigma tools and templates">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}/tools/">
<meta property="og:site_name" content="SC Quality Guild">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<style>{css}
.covers{{font:600 11px var(--mono);letter-spacing:.06em;color:var(--ink-3);margin:-4px 0 6px}}
h2.hubgrp{{margin-top:44px;padding-top:18px;border-top:3px solid var(--navy)}}
.hubsub{{color:var(--ink-2)}}
article h3{{margin:26px 0 8px}}</style>
</head>
<body>
<header class="mast"><div class="wrap">
  <span><b>SC QUALITY GUILD</b><br><span>DON'T DO THIS ALONE</span></span>
  <nav>
    <a href="/">Home</a><a href="/#/hour">Trivia</a><a href="/#/clinic">Quality Clinic</a>
    <a href="/resources/">Resources</a><a href="/study-groups.html">Study groups</a>
    <a href="/#/tests">Practice tests</a>
    <a href="/primers/">The primers</a><a href="/about.html">About us</a>
  </nav>
</div></header>
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; Tools and templates</p></div>
<article><div class="wrap">
<h1>Tools and templates</h1>
<p class="lede">The working tools of an improvement project and of a quality manager&rsquo;s job, free and in your browser. Fill them in, print them, or save them to a file. Nothing you type is sent anywhere.</p>
<p>{jump}</p>
"""
HUB_FOOT = """<h2>Calculators</h2>
<p>Control charts, capability, gauge R&amp;R, Pareto, sigma level and more are on the <a href="/calculators/">calculators page</a>.</p>
</div></article>
<footer><div class="wrap">
  <p>SC Quality Guild publishes independent study materials for ASQ certification examinations.
  Not affiliated with, endorsed by, sponsored by or approved by the American Society for Quality.
  ASQ and the names of ASQ certifications are marks of the American Society for Quality, used
  here only to identify the examinations these materials prepare candidates for.</p>
</div></footer>
</body>
</html>
"""

def hub():
    desc = (f"{len(PAGES)} free quality tools that work in your browser: SIPOC, FMEA, t test, ANOVA, DOE, "
            "audit plans, GD&T position, gauge selection, QFD, balanced scorecard and more.").replace("&", "&amp;")
    h = HUB_HEAD.format(site=SITE, desc=desc, css=CALC_CSS, jump=" &middot; ".join(f'<a href="#{g[0]}">{g[1]}</a>' for g in GROUPS))
    groups = [(g[0], g[1], g[2].format(n=len(g[3])), g[3]) for g in GROUPS]
    for gid, gname, gsub, gp in groups:
        h += f'<h2 class="hubgrp" id="{gid}">{gname}</h2>\n<p class="hubsub">{gsub}</p>\n'
        for p in gp:
            h += (f'<h3><a href="/tools/{p["slug"]}.html">{p["h1"]}</a></h3>\n'
                  f'<p class="covers">ON THE EXAM &middot; {p["covers"]}</p>\n<p>{p["desc"]}</p>\n')
    return h + HUB_FOOT

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for p in PAGES:
        path = os.path.join(OUT, p["slug"] + ".html")
        open(path, "w", encoding="utf-8").write(build(p))
        words = len(re.sub(r"<[^>]+>", " ", p["content"]).split())
        print(f'  {p["slug"]+".html":<34}{os.path.getsize(path):>8,} bytes  ~{words} words')
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(hub())
    print(f"  index.html (hub)\n{len(PAGES)} tools written to {OUT}")
