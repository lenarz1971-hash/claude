#!/usr/bin/env python3
"""Builds /resources/index.html: every calculator, tool and simulation as a
box, with an All / By exam switch and an exam dropdown.
Inputs (all in resources_src/): head.css, page.css, certdata.js, calcs.js,
yb.js, consts.js, app.js. Tool names and ledes come from tools_content.py.
Run: python3 build_resources.py <output site root>"""
import os, sys, json, re
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "resources_src")
sys.path.insert(0, HERE)
from tools_content import PAGES, PAGES_YB

def r(n): return open(os.path.join(SRC, n), encoding="utf-8").read()

def main(out_root):
    tpage = {p["slug"]: {"name": p["h1"], "lede": p["lede"]} for p in PAGES}
    calcs = json.loads(re.search(r"\[.*\]", r("calcs.js"), re.S).group(0))
    extra = [p["slug"] for p in PAGES if p["slug"] not in {q["slug"] for q in PAGES_YB}]
    tools_js = "const TPAGE=" + json.dumps(tpage, ensure_ascii=False) + ";"
    js = "\n".join([r("certdata.js"), r("calcs.js"), r("thumbs.js"), r("yb.js"), "const EXTRA_SLUGS=" + json.dumps(extra) + ";", r("consts.js"), tools_js, r("app.js")])
    if "</script" in js.lower(): raise SystemExit("</script in js")
    # crawlable fallback: every resource as a plain link, inside noscript
    links = ([f'<li><a href="/calculators/{c["page"]}.html">{c["name"]}</a></li>' for c in calcs] +
             [f'<li><a href="/tools/{s}.html">{t["name"]}</a></li>' for s, t in tpage.items()] +
             ['<li><a href="/sim/ql-2207.html">QL-2207 simulation</a></li>', '<li><a href="/sim/gp-3318.html">GP-3318 simulation</a></li>'])
    n = len(calcs) + len(tpage) + 2
    desc = (f"Free quality and Six Sigma study resources: {len(calcs)} calculators, {len(tpage)} tools and templates "
            "and two 8D simulations. See them all, or pick your ASQ exam and see only what supports it.")
    jsonld = json.dumps({"@context": "https://schema.org", "@type": "CollectionPage",
        "name": "Study resources", "description": desc, "url": "https://scqualityguild.com/resources/"}, ensure_ascii=False)
    html = r("page.html").format(desc=desc, jsonld=jsonld, css=r("head.css") + r("page.css"),
        links="\n".join(links), n=n, js=js)
    os.makedirs(os.path.join(out_root, "resources"), exist_ok=True)
    p = os.path.join(out_root, "resources", "index.html")
    open(p, "w", encoding="utf-8").write(html)
    print(f"resources/index.html  {os.path.getsize(p):,} bytes, {n} resources")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/res_out")
