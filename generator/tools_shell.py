"""Shell for /tools/ pages. Same masthead, CSS and footer as /calculators/
(imported from calc_shell so the two sets cannot drift), but the working tool
sits on the page itself, between the lede and the explanation."""
from calc_shell import CSS as CALC_CSS, SITE

CSS_TOOL = """
.toolwrap{max-width:1100px;margin:0 auto;padding:0 26px}
#tool{border:1px solid var(--line);border-top:4px solid var(--navy);background:#fff;padding:18px 20px 22px;margin:4px 0 10px}
.toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:6px}
.tb{font:700 13px var(--disp);background:var(--navy);color:#fff;border:2px solid var(--navy);border-radius:3px;padding:7px 12px;cursor:pointer;display:inline-block}
.tb:hover{background:var(--gold);border-color:var(--gold);color:#231A05}
.tb.ghost{background:#fff;color:var(--navy)}
.tb:focus-within,.tb:focus-visible,#tool input:focus-visible,#tool textarea:focus-visible,#tool select:focus-visible{outline:2px solid var(--gold);outline-offset:1px}
.tstamp{font:600 10.5px var(--mono);letter-spacing:.05em;color:var(--ink-3);margin-left:4px}
.tsec{padding:16px 0 6px;border-bottom:1px solid var(--line)}
.tsec:last-child{border-bottom:0}
.tsec h3{margin:0 0 6px;display:flex;align-items:center;gap:10px;font-size:18px}
.tsec .tn{font:800 12px var(--mono);background:var(--gold);color:#231A05;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:none}
.tsec .th{font-size:15px;margin:0 0 12px;max-width:80ch}
.tf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px}
.tf-grid.c3{grid-template-columns:repeat(3,minmax(0,1fr))}
.tf-grid.c4{grid-template-columns:repeat(4,minmax(0,1fr))}
.tf{display:flex;flex-direction:column;gap:4px;min-width:0}
.tf.wide{grid-column:1/-1}
.tf span{font:700 9.5px var(--mono);letter-spacing:.09em;color:var(--ink-3);text-transform:uppercase}
.tf small{font:400 13px/1.4 var(--serif);color:var(--ink-3)}
#tool input,#tool textarea,#tool select{font:400 15.5px/1.45 var(--serif);color:var(--ink);border:1px solid var(--line-2);border-radius:3px;padding:7px 9px;background:#fff;width:100%;min-width:0}
#tool textarea{resize:vertical;overflow:hidden}
#tool input[type=number]{font-family:var(--mono);font-size:14px}
@media (max-width:700px){.tf-grid,.tf-grid.c3,.tf-grid.c4{grid-template-columns:1fr}}
.tgw{overflow-x:auto;margin:0 0 8px}
table.tg{table-layout:auto;margin:0;font-size:15px;min-width:100%}
table.tg th{font:700 9px var(--mono);letter-spacing:.08em;color:var(--ink-3);text-transform:uppercase;padding:0 6px 7px 0;white-space:nowrap;vertical-align:bottom}
table.tg td{padding:5px 6px 5px 0;vertical-align:top;width:auto}
table.tg td:first-child{width:auto}
table.tg td.calc{font:600 14px var(--mono);color:var(--navy);padding-top:12px;white-space:nowrap;text-align:center}
#tool table.tg input[type=number]{width:64px;min-width:64px}
#tool table.tg select{min-width:130px}
#tool table.tg input[type=text],#tool table.tg input[type=date]{min-width:110px}
#tool table.tg input[type=date]{min-width:150px}
#tool table.tg textarea{min-width:120px}
table.tg td.del{width:30px}
.x{border:0;background:none;color:var(--ink-3);font-size:20px;line-height:1;cursor:pointer;padding:8px 4px}
.x:hover{color:#C0392B}
.tgbar{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 8px}
.out{background:var(--bg-2);border:1px solid var(--line);padding:14px 16px;margin:10px 0 8px}
.out p{font-size:15.5px;margin:0 0 8px;color:var(--ink)}
.out p:last-child{margin:0}
.flag{display:block;font-size:15px;padding:7px 10px;margin:6px 0;border-left:3px solid var(--line-2);background:#fff;color:var(--ink)}
.flag.warn{border-color:#C0392B}
.flag.ok{border-color:var(--green)}
.pillrow{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}
.pillrow span{font:600 10px var(--mono);letter-spacing:.06em;color:var(--ink-2);background:var(--bg-3);padding:3px 7px;border-radius:2px}
.hi-row td{background:#FDECEA}
.stat{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line);margin:10px 0}
.stat div{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:10px 12px}
.stat b{font:800 19px var(--disp);color:var(--navy);display:block;letter-spacing:-.02em;overflow-wrap:anywhere}
.stat span{font:700 8.5px/1.35 var(--mono);letter-spacing:.1em;color:var(--ink-3);text-transform:uppercase;display:block;margin-top:3px}
.svgw{overflow-x:auto;border:1px solid var(--line);background:#fff;margin:8px 0}
.svgw svg{display:block;width:100%;min-width:640px;height:auto}
.covers{font:600 11px var(--mono);letter-spacing:.06em;color:var(--ink-3);margin:-14px 0 20px}
.covers b{color:var(--gold-d)}
.pv,.printonly{display:none}
@media print{
  @page{margin:12mm}
  html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  header.mast,.crumb,footer,.explain,.noprint,.lede,.covers,.relh,.rel,.printhide{display:none!important}
  .toolwrap,.wrap{max-width:none;padding:0}
  article{padding:0}
  h1{font-size:22px}
  .printonly{display:block;font:600 9px var(--mono);letter-spacing:.08em;color:var(--ink-3);margin:4px 0 8px}
  #tool{border:0;border-top:3px solid var(--navy);padding:6px 2px 0 0;margin:0}
  #tool input:not([type=checkbox]):not([type=radio]):not([type=file]),#tool select,#tool textarea{display:none!important}
  .pv{display:block;min-height:1.35em;border-bottom:1px solid #b9c0c6;padding:1px 0 2px;font:400 12.5px/1.4 var(--serif);color:#16273A;white-space:pre-wrap;overflow-wrap:anywhere}
  .pv.auto{font-style:italic;color:#4A5D71}
  table.tg .pv{font-size:11px;min-width:26px;overflow-wrap:normal;word-break:normal;hyphens:manual}
  table.tg td:has(select) .pv{min-width:62px}
  .stat{grid-template-columns:repeat(5,minmax(0,1fr))}
  table.tg th{min-width:26px}
  .tsec{padding:8px 0 4px;break-inside:auto}
  .tsec h3{font-size:14px;margin:0 0 4px;break-after:avoid}
  .tsec .tn{display:none}
  .tsec .th{font-size:11px;line-height:1.35;margin:0 0 6px}
  .tf span{font-size:8px}
  .tf-grid{gap:6px 12px}
  tr,.flag,.svgw,.tf,.stat div,.out,.dm-ph,.ct-n,.pr-r,.ts-r,.sb-cols,.ma-wrap,.ww-ref div{break-inside:avoid}
  .tgw,.svgw{overflow:visible}.svgw svg{min-width:0}
  .flag{font-size:11.5px;padding:4px 8px;margin:3px 0}
  .out{padding:8px 10px;margin:6px 0}
  table.tg td.calc{padding-top:4px;font-size:11px}
  table.tg th{font-size:7.5px;white-space:normal}
  table.tg{font-size:11px}
  .stat b{font-size:14px}
  .stat{break-inside:avoid;margin-right:1px}
  .stat span{display:block;line-height:1.3;margin-top:2px}
}
"""
CSS_SHEET = """
/* ══ spreadsheet look, shared by every data table on the site ══ */
:root{--red:#C0392B;--red-bg:#FBEDEB}
#tool .dgmount{margin-top:6px}#tool .dg-bar{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-bottom:9px}#tool .dg-btn{font:700 10.5px var(--mono);letter-spacing:.06em;background:var(--navy);color:#fff;
  border:1px solid var(--navy);border-radius:3px;padding:6px 11px;cursor:pointer}#tool .dg-btn:hover{background:var(--gold);border-color:var(--gold);color:#231A05}#tool .dg-btn.ghost{background:transparent;color:var(--ink-2);border-color:var(--line-2)}#tool .dg-btn.ghost:hover{background:var(--navy);border-color:var(--navy);color:#fff}#tool .dg-hint{font:500 10.5px var(--mono);color:var(--ink-3);margin-left:auto}#tool @media (max-width:620px){#tool .dg-hint{margin-left:0;width:100%}}#tool .dg-scroll{overflow-x:auto;border:1px solid var(--line-2);background:#fff;border-radius:3px}#tool table.dg{border-collapse:collapse;width:100%;min-width:340px}#tool table.dg th{background:var(--bg-3);font:700 8.5px var(--mono);letter-spacing:.1em;color:var(--ink-2);
  padding:7px 8px;text-align:center;border:1px solid var(--line);white-space:nowrap}#tool table.dg td{border:1px solid var(--line);padding:0}#tool table.dg td.dg-rh,#tool table.dg th.dg-rh{background:var(--bg-2);font:700 8.5px var(--mono);
  letter-spacing:.07em;color:var(--ink-3);padding:6px 9px;text-align:right;white-space:nowrap;
  width:1%;position:sticky;left:0;z-index:2}#tool table.dg input{width:100%;border:0;background:#FFFDF2;color:var(--navy);
  font:500 13.5px var(--mono);padding:7px 9px;text-align:center;border-radius:0;min-width:64px}#tool table.dg input:focus{outline:2px solid var(--gold);outline-offset:-2px;background:#fff}#tool table.dg input.bad{background:var(--red-bg);color:var(--red)}#tool table.dg input::placeholder{color:var(--line-2);font-style:italic}#tool table.dg td.dg-x,#tool table.dg th.dg-x{width:1%;background:var(--bg-2);border-left:1px solid var(--line)}#tool .dg-del{border:0;background:none;color:var(--line-2);cursor:pointer;font:700 15px var(--mono);
  padding:2px 8px;line-height:1}#tool .dg-del:hover{color:var(--red)}

#tool .dg-bar{margin:4px 0 8px}
#tool .tf .dgmount{margin-top:2px}
#tool table.dg{table-layout:auto;margin:0;font-size:inherit}
#tool table.dg td:first-child{width:auto}
#tool table.dg td.dg-rh,#tool table.dg th.dg-rh{width:1%;padding:6px 8px;white-space:nowrap;text-align:center}
#tool table.dg td,#tool table.dg th{overflow-wrap:normal}
#tool table.dg input:not(.num){text-align:left;font:400 14.5px var(--serif);color:var(--ink)}
#tool .dg-scroll{margin:0 0 6px}
#tool table.tg{border-collapse:collapse;min-width:100%;margin:0;background:#fff}
#tool table.tg th{background:var(--bg-3);border:1px solid var(--line);padding:6px 8px;font:700 8.5px var(--mono);letter-spacing:.1em;color:var(--ink-2);text-transform:uppercase;white-space:nowrap;vertical-align:bottom}
#tool table.tg td{border:1px solid var(--line);padding:0;vertical-align:top}
#tool table.tg td.rh,#tool table.tg th.rh{background:var(--bg-2);width:1%;padding:7px 8px;font:700 8.5px var(--mono);letter-spacing:.07em;color:var(--ink-3);text-align:center;white-space:nowrap}
#tool table.tg td.calc{background:var(--bg-2);padding:8px 8px 0;font:600 13.5px var(--mono);color:var(--navy);text-align:center;white-space:nowrap}
#tool table.tg td.del,#tool table.tg th.del{width:1%;background:var(--bg-2)}
#tool table.tg input,#tool table.tg textarea,#tool table.tg select{border:0;border-radius:0;background:#FFFDF2;width:100%;padding:7px 9px;font-size:14.5px;line-height:1.4;display:block}
#tool table.tg input[type=number]{font:500 13.5px var(--mono);color:var(--navy);text-align:center}
#tool table.tg input:focus,#tool table.tg textarea:focus,#tool table.tg select:focus{outline:2px solid var(--gold);outline-offset:-2px;background:#fff}
#tool table.tg textarea{resize:none}
#tool table.tg tr.hi-row td,#tool table.tg tr.hi-row input,#tool table.tg tr.hi-row textarea,#tool table.tg tr.hi-row select{background:#FDECEA}
#tool table.tg .x{padding:6px 8px;color:var(--line-2)}
@media print{
  #tool .dg-bar,#tool .dg-x,#tool td.dg-x,#tool th.dg-x{display:none!important}
  #tool table.dg input{display:none!important}
  #tool table.dg td .pv,#tool table.tg td .pv{border-bottom:0;padding:3px 5px;min-height:1.2em}
  #tool table.dg td .pv{font:500 10.5px var(--mono);text-align:center;color:var(--navy)}
  #tool table.dg input:not(.num)+.pv{font:400 11px/1.35 var(--serif);text-align:left;color:var(--ink)}
  #tool table.tg th,#tool table.tg td.rh{font-size:7px;padding:3px 4px}
  #tool table.tg td.calc{padding:3px 4px}
  #tool table.tg td.del,#tool table.tg th.del{display:none}
  #tool .dg-scroll,#tool .tgw{overflow:visible!important}
  #tool table.tg{min-width:0!important;width:100%}
  #tool table.tg td{min-width:0!important}
  #tool table.tg .pv{overflow-wrap:normal;word-break:normal;hyphens:manual}
}
"""
CSS = CALC_CSS + CSS_TOOL + CSS_SHEET

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/tools/{slug}.html">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}/tools/{slug}.html">
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
<div class="wrap"><p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/tools/">Tools and templates</a> &rsaquo; {h1}</p></div>
<article>
<div class="wrap">
<h1>{h1}</h1>
<p class="printonly">SCQUALITYGUILD.COM/TOOLS/{slug_upper}.HTML</p>
<p class="lede">{lede}</p>
<p class="covers">ON THE EXAM &middot; {covers} &middot; FREE &middot; NOTHING YOU TYPE LEAVES YOUR BROWSER</p>
</div>
<div class="toolwrap"><div id="tool"><noscript><p>This tool needs JavaScript switched on.</p></noscript></div></div>
<div class="wrap explain">
{content}
<h2 class="relh">Other tools and templates</h2><div class="rel">
{rel}
</div>
</div>
</article>
<footer><div class="wrap">
  <p>SC Quality Guild publishes independent study materials for ASQ certification examinations.
  Not affiliated with, endorsed by, sponsored by or approved by the American Society for Quality.
  ASQ and the names of ASQ certifications are marks of the American Society for Quality, used
  here only to identify the examinations these materials prepare candidates for.</p>
  <p>Your work is kept in this browser only, until you clear it. Use <b>Save to a file</b> to keep a copy
  or move it to another computer.</p>
</div></footer>
<script>
window.TOOL={tooljs};
</script>
<script>{engine}</script>
</body>
</html>
"""
