#!/usr/bin/env python3
"""Merge a finished tool batch into the generator's shared files.
Run: python3 merge_batch.py <batch id, e.g. b2> <hub group id>
  - imports tools_content6_<batch>.PAGES6<BATCH> in tools_content.py
  - appends the batch's slugs to the ORDER list of the hub group
    (the group must already exist in tools_content.GROUPS, with its ORDER list
    named in GROUP_ORDER below)
  - adds TOOL_EX entries from batches/<batch>/meta.json to resources_src/consts.js
  - appends batches/<batch>/thumbs.js to resources_src/thumbs.js
Each step is skipped if it was already done, so the script can be rerun."""
import os, sys, json, re
HERE = os.path.dirname(os.path.abspath(__file__))
GROUP_ORDER = {"six-sigma": "ORDER", "green-belt": "ORDER_GB", "auditor": "ORDER_QA", "inspection": "ORDER_IN",
               "quality-manager": "ORDER_MQ", "process-risk": "ORDER_PR", "lean": "ORDER_LN", "supplier": "ORDER_SQ",
               "regulated": "ORDER_RG"}
b, grp = sys.argv[1], sys.argv[2]; B = b.upper()
meta = json.load(open(os.path.join(HERE, "batches", b, "meta.json")))
slugs = [t["slug"] for t in meta["tools"]]
p = os.path.join(HERE, "tools_content.py"); s = open(p).read()
imp = f"from tools_content6_{b} import PAGES6{B}\n"
if imp not in s:
    s = s.replace("from tools_content5_a import PAGES5A\n", "from tools_content5_a import PAGES5A\n" + imp)
    s = re.sub(r"^(_all = \{.*?)\}$", lambda m: m.group(1) + f" + PAGES6{B}}}", s, count=1, flags=re.M)
name = GROUP_ORDER[grp]
m = re.search(rf"^{name} = \[(.*?)\]", s, re.S | re.M)
if not m: raise SystemExit(f"{name} not found in tools_content.py; add the group first")
cur = re.findall(r'"([^"]+)"|\'([^\']+)\'', m.group(1)); cur = [x or y for x, y in cur]
add = [x for x in slugs if x not in cur]
if add:
    new = ", ".join(json.dumps(x) for x in cur + add)
    s = s[:m.start(1)] + new + s[m.end(1):]
open(p, "w").write(s)
c = os.path.join(HERE, "resources_src", "consts.js"); cs = open(c).read()
for t in meta["tools"]:
    if f"'{t['slug']}':" in cs: continue
    tags = "ALLX" if len(t["tags"]) == 10 else json.dumps(t["tags"]).replace('"', "'").replace(", ", ",")
    cs = cs.replace("\n};\n/* Tools beyond", f",\n '{t['slug']}':{tags}\n}};\n/* Tools beyond", 1)
open(c, "w").write(cs)
th = os.path.join(HERE, "resources_src", "thumbs.js"); ts = open(th).read()
mark = f"/* batch {b} */"
if mark not in ts:
    ts = ts.rstrip("\n") + f"\n{mark}\n" + open(os.path.join(HERE, "batches", b, "thumbs.js")).read().strip() + "\n"
    open(th, "w").write(ts)
print(f"merged {b}: {len(slugs)} tools into {grp}")
