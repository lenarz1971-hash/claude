#!/usr/bin/env python3
"""Build tool pages from one content module, for testing before the tools are
added to the hub order in tools_content.py.
Run: python3 build_preview.py <content_module, e.g. tools_content6_b2> <out root>
Writes <out root>/tools/<slug>.html for every page in the module's PAGES list.
Related links point to the other pages in the same module."""
import os, sys, importlib
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import build_tools
mod = importlib.import_module(sys.argv[1]); out = os.path.join(sys.argv[2], "tools")
pages = [v for k, v in vars(mod).items() if k.startswith("PAGES")][0]
def rel(slug, limit=5):
    grp = [p["slug"] for p in pages]; i = grp.index(slug); rot = grp[i+1:] + grp[:i]
    return "\n".join([f'<a href="/tools/{s}.html">{next(p["name"] for p in pages if p["slug"]==s)}</a>' for s in rot[:limit]] + ['<a href="/calculators/">All calculators</a>'])
build_tools.rel = rel
os.makedirs(out, exist_ok=True)
for p in pages:
    open(os.path.join(out, p["slug"] + ".html"), "w", encoding="utf-8").write(build_tools.build(p))
    print("built", p["slug"])
