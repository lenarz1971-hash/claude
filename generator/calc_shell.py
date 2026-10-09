#!/usr/bin/env python3
"""
The shell every /calculators/ page is built from.

This is Anthony's own shell, taken verbatim from control-chart.html,
process-capability.html and gage-r-and-r.html (which were byte-identical to
one another above the <h1>). Those three came first; the nine generated pages
were built on a different shell and are being brought onto this one, so all
twelve match.

Kept from his original, deliberately:
  - 760px single text column (not the 1180px two-column layout)
  - the breadcrumb line
  - JSON-LD WebApplication structured data
  - his nav, which points at /calculators/ and /primers/ (real, indexable
    pages) rather than at /#/resources (a fragment Google ignores)
  - the light footer
  - og:type article, twitter:card summary

Changed from his original, both requested:
  - "Open the calculator" now goes to /#/resource/<id> instead of
    /#/resources, which was the reported bug: it dumped you on the resources
    index instead of opening the tool.
  - the CTA sits under the lede instead of at the foot of the article
    ("move the calculator button closer to the top").
  - "Other calculators" lists four rotating links instead of two fixed ones,
    so all twelve pages are reachable from each other.

CSS is his, verbatim, plus one appended block for the figure tables and
callouts the nine generated pages use. The appended block is on all twelve so
the <style> is identical across the set.
"""

SITE = "https://scqualityguild.com"

# ── every calculator: slug, the name used in cross-links, route id ─────────
# Names match each page's own <h1> so the anchor text and the destination
# heading agree. "Gage" not "Gauge" — his spelling, his slug.
ALL = [
    ("control-chart",            "Control Chart Builder",      "spc"),
    ("process-capability",       "Cp and Cpk Calculator",      "capability"),
    ("gage-r-and-r",             "Gage R&amp;R Calculator",    "grr"),
    ("sampling-plan-oc-curve",   "Sampling Plan and OC Curve", "oc"),
    ("sigma-level-dpmo",         "Sigma Level and DPMO",       "sigma"),
    ("rolled-throughput-yield",  "Rolled Throughput Yield",    "yield"),
    ("pareto-chart",             "Pareto Chart Builder",       "pareto"),
    ("control-chart-constants",  "Control Chart Constants",    "constants"),
    ("sample-size",              "Sample Size Calculator",     "samplesize"),
    ("gage-rr-impact-on-cpk",    "Gage R&amp;R against Cpk",   "grrcpk"),
    ("linearity-study",          "Linearity Study",            "linearity"),
    ("hypothesis-test-selector", "Hypothesis Test Selector",   "hypothesis"),
]
LINKNAME = {s: n for s, n, _ in ALL}
ROUTE    = {s: r for s, _, r in ALL}
SLUGS    = [s for s, _, _ in ALL]

# ── his CSS, verbatim ─────────────────────────────────────────────────────
CSS_HIS = """
:root{--navy:#0F3E68;--navy-dd:#061F36;--gold:#D8B147;--gold-d:#9C7C1F;--gold-xl:#FBF5E4;
--bg-2:#F6F7F4;--bg-3:#EDEFEA;--ink:#16273A;--ink-2:#4A5D71;--ink-3:#7C8B99;
--line:#DDE1E4;--line-2:#C6CDD3;--green:#1F8C55;
--disp:"Archivo",sans-serif;--serif:"Source Serif 4",Georgia,serif;--mono:"IBM Plex Mono",monospace}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font:400 17.5px/1.68 var(--serif)}
.wrap{max-width:760px;margin:0 auto;padding:0 26px}
h1,h2,h3{font-family:var(--disp);font-weight:800;letter-spacing:-.035em;margin:0;color:var(--navy)}
h1{font-size:clamp(28px,4.4vw,42px);line-height:1.1}
h2{font-size:clamp(21px,2.7vw,27px);margin:38px 0 12px}
h3{font-size:18px;margin:26px 0 8px}
p{margin:0 0 1.05em;color:var(--ink-2)}
a{color:var(--navy)}
header.mast{border-bottom:1px solid var(--line);padding:14px 0}
.mast .wrap{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.mast b{font:800 14px var(--disp);letter-spacing:-.03em;color:var(--navy)}
.mast span{font:600 8.5px var(--mono);letter-spacing:.14em;color:var(--gold-d)}
.mast nav{margin-left:auto;display:flex;gap:16px;font:600 13.5px var(--disp);flex-wrap:wrap}
@media (max-width:640px){
  .mast nav{margin-left:0;width:100%;gap:14px;font-size:12.5px;padding-top:10px;
    border-top:1px solid var(--line);margin-top:10px}
  .facts{grid-template-columns:1fr 1fr}
}
.mast nav a{text-decoration:none;color:var(--ink-2)}
.crumb{font:600 11px var(--mono);letter-spacing:.09em;color:var(--ink-3);padding:18px 0 0}
.crumb a{color:var(--ink-3)}
article{padding:8px 0 56px}
.lede{font-size:20px;color:var(--ink-2);margin:16px 0 26px;max-width:62ch}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin:26px 0}
@media (max-width:620px){.facts{grid-template-columns:1fr 1fr}}
.facts div{border:1px solid var(--line);margin:-1px 0 0 -1px;padding:14px 13px}
.facts b{font:900 20px var(--disp);color:var(--navy);display:block;letter-spacing:-.03em}
.facts span{font:700 8px var(--mono);letter-spacing:.12em;color:var(--ink-3);display:block;margin-top:7px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:16px;table-layout:fixed}
td:first-child{width:56px}
td,th{overflow-wrap:anywhere}
th{text-align:left;font:700 9px var(--mono);letter-spacing:.11em;color:var(--ink-3);
border-bottom:2px solid var(--line);padding:0 10px 8px 0}
td{border-bottom:1px solid var(--line);padding:10px 10px 10px 0;vertical-align:top;color:var(--ink)}
td.n,th.n{text-align:right;font-family:var(--mono);font-size:14px}
.cta{border-left:4px solid var(--gold);background:var(--gold-xl);padding:18px 22px;margin:30px 0}
.cta p{margin:0 0 12px;color:var(--ink);font-size:17px}
.cta p:last-child{margin:0}
.btn{display:inline-block;font:700 14px var(--disp);background:var(--navy);color:#fff;
border:2px solid var(--navy);border-radius:3px;padding:11px 19px;text-decoration:none}
.btn:hover{background:var(--gold);border-color:var(--gold);color:#231A05}
.q{border:1px solid var(--line);padding:18px 20px;margin:14px 0;background:var(--bg-2)}
.q .ref{font:600 10px var(--mono);letter-spacing:.11em;color:var(--ink-3);display:block;margin-bottom:9px}
.q .stem{font-size:17.5px;color:var(--ink);margin:0 0 12px}
.q ol{margin:0 0 12px;padding-left:22px}
.q li{font-size:16.5px;color:var(--ink-2);margin-bottom:5px}
.q li.right{color:var(--green);font-weight:600}
.q .why{font-size:16px;color:var(--ink-2);border-top:1px solid var(--line);padding-top:11px;margin:0}
footer{border-top:1px solid var(--line);background:var(--bg-2);padding:26px 0 40px;
font:400 14.5px/1.6 var(--serif);color:var(--ink-3)}
footer a{color:var(--ink-2)}
.rel{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.rel a{font:600 12.5px var(--disp);border:1px solid var(--line-2);padding:6px 11px;
border-radius:3px;text-decoration:none;color:var(--navy)}
.rel a:hover{border-color:var(--navy)}
"""

# ── appended: the figure tables and callouts the worked examples use ───────
# His generic table rule is table-layout:fixed with a 56px first column, which
# is right for a two-column reference table and wrong for a seven-column
# worked figure. table.fig opts out of both.
CSS_FIG = """
.tw{overflow-x:auto;margin:0 0 1.3em}
table.fig{table-layout:auto;min-width:340px;font-size:15.5px}
table.fig td:first-child{width:auto}
table.fig caption{caption-side:top;text-align:left;font:700 9px var(--mono);
letter-spacing:.11em;color:var(--ink-3);padding-bottom:9px}
table.fig th{vertical-align:bottom}
table.fig td{vertical-align:top}
table.fig td.n,table.fig th.n{text-align:right;font-variant-numeric:tabular-nums;
font-family:var(--mono);font-size:14px;padding-right:0}
table.fig tr:last-child td{border-bottom:0}
table.fig .hi{color:#C0392B;font-weight:600}
table.fig .ok{color:var(--green);font-weight:600}
.note{border-left:4px solid var(--gold);background:var(--gold-xl);padding:15px 19px;margin:26px 0}
.note p{margin:0;color:var(--ink);font-size:16px}
article ul{margin:0 0 1.1em;padding-left:22px}
article li{color:var(--ink-2);margin-bottom:9px}
article code{font:500 15px var(--mono);background:var(--bg-3);padding:1px 5px;border-radius:2px}
article b{color:var(--ink)}
"""

CSS = CSS_HIS + CSS_FIG

# ── his shell, verbatim except the two requested changes ──────────────────
SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/calculators/{slug}.html">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
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
<header class="mast"><div class="wrap">
  <span><b>SC QUALITY GUILD</b><br><span>DON'T DO THIS ALONE</span></span>
  <nav>
    <a href="/">Home</a><a href="/#/hour">Trivia</a><a href="/#/clinic">Quality Clinic</a>
    <a href="/resources/">Resources</a><a href="/study-groups.html">Study groups</a>
    <a href="/#/tests">Practice tests</a>
    <a href="/primers/">The primers</a><a href="/about.html">About us</a>
  </nav>
</div></header>
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/calculators/">Calculators</a> &rsaquo; {h1}</p></div>
<article><div class="wrap">
<h1>{h1}</h1>
<p class="lede">{lede}</p>
<div class="cta"><p><b>Free and nothing is sent anywhere.</b> The calculation runs in your browser; nothing you type leaves your machine.</p><p><a class="btn" href="/#/resource/{route}">Open the calculator</a></p></div>
{content}
<h2>Other calculators</h2><div class="rel">
{rel}
</div>
</div></article>
<footer><div class="wrap">
  <p>SC Quality Guild publishes independent study materials for ASQ certification examinations.
  Not affiliated with, endorsed by, sponsored by or approved by the American Society for Quality.
  ASQ and the names of ASQ certifications are marks of the American Society for Quality, used
  here only to identify the examinations these materials prepare candidates for.</p>
  <p>Examination facts are taken from ASQ's published certification pages and are subject to
  change &mdash; confirm directly with ASQ before you apply.</p>
</div></footer>
</body>
</html>
"""
