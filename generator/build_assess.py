#!/usr/bin/env python3
"""Builds /assessment/ pages: a BoK self-assessment per certification, plus the hub.
  assess_engine.js        the shared engine (draw by requirement, report, history, trend)
  assess_data/<key>.json  {sections, reqs, bank} for each certification
  assess_content.py       titles, ledes and explanations
Run: python3 build_assess.py <output site root>"""
import os, sys, json, hashlib
from tools_shell import CSS as TOOL_CSS, SITE, CSS_SHEET
# the spreadsheet grid CSS styles every table.tg cell; the report tables here keep their own look
TOOL_CSS = TOOL_CSS.replace(CSS_SHEET, "")
from assess_content import PAGES, HUB

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/assess_out", "assessment")
ENGINE = open(os.path.join(HERE, "assess_engine.js"), encoding="utf-8").read()

CSS_ASSESS = """
.modes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:6px 0 12px}
@media (max-width:1000px){.modes{grid-template-columns:repeat(2,minmax(0,1fr))}}
.mode{text-align:left;background:#fff;border:1px solid var(--line-2);border-top:4px solid var(--navy);border-radius:3px;padding:14px 14px 12px;cursor:pointer;display:flex;flex-direction:column;gap:4px;font:inherit;color:var(--ink)}
.mode:hover,.mode:focus-visible{border-color:var(--gold);border-top-color:var(--gold);outline:0;background:var(--gold-xl)}
.mode b{font:800 18px var(--disp);color:var(--navy)}
.mode span{font:700 10px var(--mono);letter-spacing:.08em;color:var(--gold-d);text-transform:uppercase}
.mode small{font:400 14.5px/1.45 var(--serif);color:var(--ink-2)}
@media (max-width:760px){.modes{grid-template-columns:1fr}}
.learn{display:flex;gap:9px;align-items:flex-start;font:400 15px/1.45 var(--serif);color:var(--ink-2);margin:4px 0 6px;cursor:pointer}
.learn input{margin-top:4px;width:auto!important}
.bar{height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden;margin:6px 0 16px}
.bar i{display:block;height:100%;background:var(--gold)}
.qbox{max-width:760px}
.qref{font:700 10px var(--mono);letter-spacing:.08em;color:var(--ink-3);text-transform:uppercase;margin:0 0 8px}
.qstem{font:600 20px/1.4 var(--serif);color:var(--ink);margin:0 0 14px}
.opts{display:flex;flex-direction:column;gap:8px}
.opt{display:flex;gap:12px;align-items:flex-start;text-align:left;background:#fff;border:1px solid var(--line-2);border-radius:3px;padding:11px 13px;cursor:pointer;font:400 16.5px/1.4 var(--serif);color:var(--ink)}
.opt b{font:800 13px var(--mono);color:var(--navy);background:var(--bg-3);border-radius:2px;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:none}
.opt:hover:not([disabled]){border-color:var(--navy)}
.opt.on{border:2px solid var(--navy);background:#F1F5F9;padding:10px 12px}
.opt.on b{background:var(--navy);color:#fff}
.opt.right{border:2px solid var(--green);background:#EAF6EF;padding:10px 12px}
.opt.wrong{border:2px solid #B23A2E;background:#FBECEA;padding:10px 12px}
.opt[disabled]{cursor:default}
.why{margin:12px 0 0;padding:10px 13px;border-left:3px solid var(--green);background:var(--bg-2);font:400 15.5px/1.5 var(--serif);color:var(--ink)}
.why.no{border-left-color:#B23A2E}
.nav{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 4px}
.tb[disabled]{opacity:.45;cursor:default}
.tb[disabled]:hover{background:#fff;border-color:var(--navy);color:var(--navy)}
.stb{display:inline-flex;align-items:center;gap:5px;font:700 10.5px var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:3px 7px;border-radius:2px;white-space:nowrap;border:1px solid}
.stb i{font-style:normal;font-size:12px;font-weight:800;min-width:9px;text-align:center}
.st-strong{color:#176B41;border-color:#9FD2B6;background:#EAF6EF}
.st-border{color:#7A5F12;border-color:#E3CD8C;background:var(--gold-xl)}
.st-gap{color:#8E2A20;border-color:#E7A8A1;background:#FBECEA}
.st-early,.st-earlymiss{color:var(--ink-2);border-color:var(--line-2);background:#fff}
.st-earlymiss{border-style:dashed;border-color:#E7A8A1}
.st-none{color:var(--ink-3);border-color:var(--line);background:#fff}
table.rq td small{display:block;font:400 13.5px/1.4 var(--serif);color:var(--ink-3);margin-top:2px}
table.rq td.code{font:700 12px var(--mono);color:var(--navy);white-space:nowrap}
table.rq td,table.sx td,table.hist td{padding:7px 10px 7px 0;border-bottom:1px solid var(--line)}
table.rq tr.secrow td{background:var(--bg-2);padding:8px 10px;border-bottom:1px solid var(--line-2)}
table.rq tr.secrow span{font:600 10px var(--mono);letter-spacing:.06em;color:var(--ink-3);text-transform:uppercase;margin-left:6px}
td.num{font:600 13px var(--mono);white-space:nowrap;color:var(--ink)}
td.links a{display:block;font-size:14px;white-space:nowrap}
.linkb{background:none;border:0;color:var(--navy);text-decoration:underline;cursor:pointer;font:inherit;padding:0}
.hb{display:block;position:relative;height:10px;background:var(--bg-3);border-radius:2px;min-width:120px}
.hb i{display:block;height:100%;background:var(--navy);border-radius:0 4px 4px 0}
.hb em{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink-3)}
td.barc{width:34%}
.small{font-size:13px!important}
ol.next{margin:6px 0 4px;padding-left:22px}
ol.next li{margin:0 0 9px;font-size:16px;color:var(--ink)}
ol.next li a{font-size:14px}
details.rv{border:1px solid var(--line);border-left:3px solid var(--green);margin:6px 0;padding:8px 12px;background:#fff}
details.rv.no{border-left-color:#B23A2E}
details.rv summary{cursor:pointer;font:400 15.5px/1.45 var(--serif);color:var(--ink)}
details.rv summary span{font-weight:700}
details.rv summary em{font:700 11px var(--mono);font-style:normal;color:var(--ink-3)}
details.rv ol{margin:8px 0 6px}
details.rv li{font-size:15px;color:var(--ink-2);margin:2px 0}
details.rv li.right{color:#176B41}
details.rv li.wrong{color:#8E2A20}
details.rv p.why{margin:6px 0 2px;font-size:14.5px}
.trend{position:relative}
.trend svg{min-width:520px}
.trend .grid{stroke:var(--line);stroke-width:1}
.trend .ref{stroke:var(--gold-d);stroke-width:1;stroke-dasharray:4 4}
.trend .ax{font:600 11px var(--mono);fill:var(--ink-3)}
.trend .lbl{font:800 13px var(--disp);fill:var(--ink)}
.trend .ln{fill:none;stroke:var(--navy);stroke-width:2;stroke-linejoin:round}
.trend .dot{fill:var(--navy);stroke:#fff;stroke-width:2}
.trend .hit{fill:transparent;cursor:crosshair}
.trend .tip{position:absolute;background:#fff;border:1px solid var(--line-2);box-shadow:0 2px 8px rgba(0,0,0,.12);padding:8px 10px;font:400 13px/1.45 var(--serif);color:var(--ink);pointer-events:none;min-width:150px}
.hubcards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:8px 0 24px}
.hubcards a{display:block;border:1px solid var(--line);border-top:4px solid var(--navy);padding:16px 18px;text-decoration:none;background:#fff}
.hubcards a:hover{border-top-color:var(--gold)}
.hubcards b{display:block;font:800 20px var(--disp);color:var(--navy);margin-bottom:4px}
.hubcards span{font:700 10px var(--mono);letter-spacing:.08em;color:var(--gold-d);text-transform:uppercase}
.hubcards p{font-size:15.5px;margin:8px 0 0}
@media (max-width:700px){.hubcards{grid-template-columns:1fr}}
/* exam view: only the question while an attempt is running */
body.exam-on{background:#F3F4F1}
body.exam-on .mast,body.exam-on footer,body.exam-on .pagenote,body.exam-on>.wrap,body.exam-on article>.wrap{display:none!important}
body.exam-on .toolwrap{max-width:900px;margin:28px auto 60px}
body.exam-on #tool{border-top-width:4px;box-shadow:0 10px 30px -18px rgba(15,62,104,.35)}
body.exam-on .qbox{max-width:none}
body.exam-on .qstem{font-size:21px}
:fullscreen{background:#F3F4F1;overflow-y:auto}
@media (max-width:640px){body.exam-on .toolwrap{margin:0 auto 30px}}
@media print{
  .modes,.learn,.nav,.bar{display:none!important}
  .stb{font-size:8.5px;padding:1px 4px}
  table.rq td small{font-size:10px}
  table.rq td,table.sx td,table.hist td{padding:3px 6px 3px 0}
  td.num{font-size:10px}
  details.rv{break-inside:avoid;padding:4px 8px;margin:3px 0}
  details.rv summary{font-size:11.5px}
  details.rv li,details.rv p.why{font-size:10.5px}
  details.rv:not([open]) summary{list-style:none}
  .trend .tip{display:none}
  ol.next li{font-size:12px}
  .trend svg{min-width:0}
  .pgbreak{break-before:page}
}
"""
CSS = TOOL_CSS + CSS_ASSESS

NAV = """<header class="mast"><div class="wrap">
  <span><b>SC QUALITY GUILD</b><br><span>DON'T DO THIS ALONE</span></span>
  <nav>
    <a href="/">Home</a><a href="/#/hour">Trivia</a><a href="/#/clinic">Quality Clinic</a>
    <a href="/resources/">Resources</a><a href="/study-groups.html">Study groups</a>
    <a href="/#/tests" aria-current="page">Practice tests</a>
    <a href="/primers/">The primers</a><a href="/about.html">About us</a>
  </nav>
</div></header>"""
HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/assessment/{path}">
<meta property="og:type" content="{ogtype}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}/assessment/{path}">
<meta property="og:site_name" content="SC Quality Guild">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<script type="application/ld+json">{jsonld}</script>
<style>{css}</style>
</head>
<body>
"""
FOOT = """<footer><div class="wrap">
  <p>SC Quality Guild publishes independent study materials for ASQ certification examinations.
  Not affiliated with, endorsed by, sponsored by or approved by the American Society for Quality.
  ASQ and the names of ASQ certifications are marks of the American Society for Quality, used
  here only to identify the examinations these materials prepare candidates for. The requirement
  titles are our own short wording; see ASQ for the official Body of Knowledge.</p>
  <p>Your results are kept in this browser only, until you clear them. Use <b>Save history to a file</b> to keep a copy
  or move it to another computer.</p>
</div></footer>
"""

def qid(stem):
    return hashlib.sha1(stem.encode("utf-8")).hexdigest()[:10]

def data_for(p):
    d = json.load(open(os.path.join(HERE, "assess_data", p["key"] + ".json"), encoding="utf-8"))
    bank = [[qid(q[1]), q[0], q[1], q[2], q[3], q[4]] for q in d["bank"] if q[5] == "std"]
    ids = [b[0] for b in bank]
    assert len(ids) == len(set(ids)), "duplicate stems"
    codes = {r[0] for r in d["reqs"]}
    assert all(b[1] in codes for b in bank)
    for r in d["reqs"]:
        assert sum(1 for b in bank if b[1] == r[0]) >= 3, r[0]
    return {"key": p["key"], "name": p["name"], "short": p["short"], "sections": d["sections"],
            "reqs": d["reqs"], "bank": bank, "primer": p["primer"]}

def build(p):
    data = data_for(p)
    js = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    if "</script" in js.lower(): raise SystemExit("</script in data")
    jsonld = json.dumps({"@context": "https://schema.org", "@type": "WebApplication",
        "name": p["h1"], "description": p["desc"], "applicationCategory": "EducationalApplication",
        "operatingSystem": "Any", "url": f"{SITE}/assessment/{p['slug']}.html",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}, ensure_ascii=False)
    nreq, nq = len(data["reqs"]), len(data["bank"])
    body = f"""{NAV}
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/#/tests">Practice tests</a> &rsaquo; <a href="/assessment/">Self-assessments</a> &rsaquo; {p['short']}</p></div>
<article>
<div class="wrap">
<h1>{p['h1']}</h1>
<p class="printonly">SCQUALITYGUILD.COM/ASSESSMENT/{p['slug'].upper()}.HTML</p>
<p class="lede">{p['lede']}</p>
<p class="covers">{nreq} BOK REQUIREMENTS &middot; {nq} QUESTIONS &middot; FREE &middot; RESULTS STAY IN YOUR BROWSER</p>
</div>
<div class="toolwrap"><div id="tool"><div id="assess"><noscript><p>This self-assessment needs JavaScript switched on.</p></noscript></div></div></div>
<div class="wrap explain">
{p['content'].strip()}
</div>
</article>
{FOOT}<script>window.ASSESS={js};</script>
<script>{ENGINE}</script>
</body>
</html>
"""
    return HEAD.format(title=p["title"], desc=p["desc"], site=SITE, path=p["slug"] + ".html",
                       ogtype="article", jsonld=jsonld, css=CSS) + body

def hub():
    cards = "".join(f'<a href="/assessment/{p["slug"]}.html"><span>{p["credential"]}</span><b>{p["short"]}</b><p>{p["card"]}</p></a>' for p in PAGES)
    jsonld = json.dumps({"@context": "https://schema.org", "@type": "CollectionPage", "name": HUB["h1"],
        "description": HUB["desc"], "url": f"{SITE}/assessment/"}, ensure_ascii=False)
    body = f"""{NAV}
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/#/tests">Practice tests</a> &rsaquo; Self-assessments</p></div>
<article><div class="wrap">
<h1>{HUB['h1']}</h1>
<p class="lede">{HUB['lede']}</p>
<div class="hubcards">{cards}</div>
<div class="explain">{HUB['content'].strip()}</div>
</div></article>
{FOOT}</body>
</html>
"""
    return HEAD.format(title=HUB["title"], desc=HUB["desc"], site=SITE, path="", ogtype="website",
                       jsonld=jsonld, css=CSS).replace(f'{SITE}/assessment/"', f'{SITE}/assessment/"') + body

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for p in PAGES:
        open(os.path.join(OUT, p["slug"] + ".html"), "w", encoding="utf-8").write(build(p))
        print("built", p["slug"])
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(hub())
    print("built hub")
