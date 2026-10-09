#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b7 tools (Oct 2026):
benchmarking-gap-analysis, a3-problem-solving-report, 8d-report,
engineering-change-impact-checklist, is-is-not-problem-specification,
out-of-control-action-plan.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with
values computed here from scratch (plain Python and the statistics module),
and with hand-worked values written into the test.

Run: python3 tests/test_b7_numbers.py <out root>    (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, re, statistics
from datetime import date
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b7"
FAIL = []
def check(name, got, want, tol=0.0):
    ok = (got == want) if isinstance(want, str) else (got is not None and abs(got - want) <= tol)
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").replace("%", "").strip()
    m = re.search(r"-?\d+(\.\d+)?", s)
    return float(m.group(0)) if m else None

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

def load(pg, slug, state=None):
    pg.goto(f"http://127.0.0.1:{port}/tools/{slug}.html")
    if state is not None:
        state = dict(state, v=1, tool=slug); state.setdefault("x", {}); state.setdefault("f", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)

def stat(pg, sel, label_start):
    for d in pg.locator(sel + " > div").all():
        if d.locator("span").inner_text().upper().startswith(label_start.upper()): return d.locator("b").inner_text()
    raise KeyError(label_start)

def cell(pg, grid, row, col):
    return pg.locator(f'table[data-grid="{grid}"] tbody tr').nth(row).locator(f'td[data-c="{col}"]').inner_text()

def flags(pg): return pg.locator(".flag").all_inner_texts()

def example(slug):
    src = open(os.path.join(os.path.dirname(__file__), "..", "generator", "tools_defs", slug + ".js"), encoding="utf-8").read()
    return src

# ------------------------------------------------------------- benchmarking
def bench(own, bm, tgt, low):
    gap = own - bm if low else bm - own
    need = 100 * gap / abs(own) if own != 0 else None
    ach = (100 * bm / own if own != 0 else None) if low else (100 * own / bm if bm != 0 else None)
    close = 100 * (tgt - own) / (bm - own) if tgt is not None and bm != own else None
    return gap, need, ach, close

BM_EX = [("Lower is better", 6.5, 1.5, 3), ("Higher is better", 42, 95, 70), ("Higher is better", 98.6, 99.85, 99.5),
         ("Higher is better", 91, 97, 95), ("Higher is better", 99.2, 98.5, 99.2)]
BM_EDGE = [("Lower is better", 120, 45, 60), ("Higher is better", 0, 12, 6), ("Lower is better", 3.2, 4.0, 3.0), ("", 5, 6, None)]

def bench_rows(pg, rows, tag):
    for i, (d, o, b, t) in enumerate(rows):
        if not d:
            check(f"{tag} row {i+1} no direction -> blank gap", cell(pg, "m", i, "gap"), ""); continue
        gap, need, ach, close = bench(o, b, t, d.startswith("Lower"))
        check(f"{tag} row {i+1} gap", num(cell(pg, "m", i, "gap")), gap, 0.006)
        if need is None: check(f"{tag} row {i+1} improve-by blank (own=0)", cell(pg, "m", i, "need"), "")
        else: check(f"{tag} row {i+1} improve by %", num(cell(pg, "m", i, "need")), need, 0.051)
        if ach is not None: check(f"{tag} row {i+1} of benchmark %", num(cell(pg, "m", i, "ach")), ach, 0.051)
        if close is not None: check(f"{tag} row {i+1} target closes %", num(cell(pg, "m", i, "cl")), close, 0.51)

# hand-worked values for the worked example (written out, not computed)
HAND_BM = {"M1 improve by": 76.9, "M1 of benchmark": 23.1, "M1 target closes": 70, "M2 of benchmark": 44.2, "M5 gap": -0.70}

# ---------------------------------------------------------------- A3
def a3(before, after, base, tgt, low):
    mb = statistics.fmean(before); ma = statistics.fmean(after); b = base if base is not None else mb
    imp = 100 * ((b - ma) if low else (ma - b)) / abs(b)
    gap = 100 * (ma - b) / (tgt - b)
    return b, ma, imp, gap

def a3_case(pg, before, after, base, tgt, low, tag):
    d = [{"p": f"P{i+1}", "v": str(v), "ph": "Before"} for i, v in enumerate(before)] + \
        [{"p": f"Q{i+1}", "v": str(v), "ph": "After"} for i, v in enumerate(after)]
    st = {"f": {"title": "t", "met": "m", "unit": "u", "dir": "Lower is better" if low else "Higher is better",
                "base": "" if base is None else str(base), "tgt": str(tgt)}, "g": {"d": d, "cm": [{}], "pl": [{}]}}
    load(pg, "a3-problem-solving-report", st)
    b, ma, imp, gap = a3(before, after, base, tgt, low)
    check(f"{tag} baseline", num(stat(pg, ".a3-stat", "Baseline")), b, 0.01 if abs(b) < 10 else 0.051)
    check(f"{tag} mean after", num(stat(pg, ".a3-stat", "Mean after")), ma, 0.01 if abs(ma) < 10 else 0.051)
    check(f"{tag} improvement %", num(stat(pg, ".a3-stat", "Improvement")), imp, 0.051)
    check(f"{tag} gap closed %", num(stat(pg, ".a3-stat", "Share of the gap")), gap, 0.51)

with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None)
    ctx = br.new_context(viewport={"width": 1280, "height": 900})
    ctx.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    pg = ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))

    print("benchmarking-gap-analysis: worked example")
    load(pg, "benchmarking-gap-analysis"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    bench_rows(pg, BM_EX, "example")
    check("hand: M1 improve by", num(cell(pg, "m", 0, "need")), HAND_BM["M1 improve by"], 0.05)
    check("hand: M1 of benchmark", num(cell(pg, "m", 0, "ach")), HAND_BM["M1 of benchmark"], 0.05)
    check("hand: M1 target closes", num(cell(pg, "m", 0, "cl")), HAND_BM["M1 target closes"], 0.5)
    check("hand: M2 of benchmark", num(cell(pg, "m", 1, "ach")), HAND_BM["M2 of benchmark"], 0.05)
    check("hand: M5 gap (you lead)", num(cell(pg, "m", 4, "gap")), HAND_BM["M5 gap"], 0.005)
    check("stats: partner better", num(stat(pg, ".bm-stat", "Partner better")), 4)
    check("stats: you lead", num(stat(pg, ".bm-stat", "You lead")), 1)
    print("benchmarking-gap-analysis: edge cases")
    load(pg, "benchmarking-gap-analysis", {"g": {"m": [{"id": f"M{i+1}", "mea": "x", "unit": "u", "dir": d, "own": str(o), "bm": str(b), "tgt": "" if t is None else str(t)} for i, (d, o, b, t) in enumerate(BM_EDGE)], "p": [{}], "a": [{}]}})
    bench_rows(pg, BM_EDGE, "edge")
    check("edge: own=0 flagged", any("cannot be expressed as a percentage" in x for x in flags(pg)), True)
    check("edge: missing direction flagged", any("higher or lower is better" in x for x in flags(pg)), True)

    print("a3-problem-solving-report")
    load(pg, "a3-problem-solving-report"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    b, ma, imp, gap = a3([6.4, 5.9, 6.8, 5.7, 6.1, 6.3], [3.1, 2.6, 2.2, 1.9], None, 2, True)
    check("example baseline (mean before)", num(stat(pg, ".a3-stat", "Baseline")), b, 0.005)
    check("example mean after", num(stat(pg, ".a3-stat", "Mean after")), ma, 0.005)
    check("example improvement %", num(stat(pg, ".a3-stat", "Improvement")), imp, 0.051)
    check("example gap closed %", num(stat(pg, ".a3-stat", "Share of the gap")), gap, 0.51)
    check("hand: example improvement 60.5%", num(stat(pg, ".a3-stat", "Improvement")), 60.5, 0.05)
    check("hand: example gap closed 89%", num(stat(pg, ".a3-stat", "Share of the gap")), 89, 0.5)
    a3_case(pg, [71, 74, 69, 72], [80, 83, 85], None, 90, False, "higher-is-better")
    a3_case(pg, [410, 395, 430], [300, 280], 400, 250, True, "explicit baseline")
    a3_case(pg, [12.0, 12.0], [13.0], 12, 8, True, "got worse")

    print("8d-report")
    load(pg, "8d-report"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    rows = [(5200, 61), (6800, 84), (9500, 0)]
    for i, (c, bd) in enumerate(rows):
        check(f"containment row {i+1} % bad", num(cell(pg, "ct", i, "pct")), 100 * bd / c, 0.006)
    check("total checked", num(stat(pg, ".d8-stat", "Checked")), sum(c for c, _ in rows))
    check("total bad", num(stat(pg, ".d8-stat", "Found bad")), sum(b for _, b in rows))
    days_open = (date.today() - date(2026, 9, 14)).days
    check("days open (to today)", num(stat(pg, ".d8-stat", "Days")), days_open)
    load(pg, "8d-report", {"f": {"opened": "2026-03-02", "d8": "2026-05-29"}, "g": {"tm": [{}], "ct": [{"a": "x", "chk": "3", "bad": "1"}], "pca": [{}], "pr": [{}]}})
    check("days to close 2 Mar to 29 May", num(stat(pg, ".d8-stat", "Days")), (date(2026, 5, 29) - date(2026, 3, 2)).days)
    check("1 of 3 bad = 33.33%", num(cell(pg, "ct", 0, "pct")), 100 / 3, 0.006)

    print("engineering-change-impact-checklist")
    load(pg, "engineering-change-impact-checklist"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    src = example("engineering-change-impact-checklist")
    items = re.findall(r"\{item:'[^']*',cat:'[^']*',ref:'[^']*',aff:'([^']*)',act:'[^']*',who:'[^']*',due:'[^']*',upd:'([^']*)',vby:'[^']*',ver:'([^']*)'\}", src)
    aff = [x for x in items if x[0] == "Yes"]; closed = [x for x in aff if x[2]]
    open_ = [x for x in aff if not x[2]]; na = [x for x in items if x[0] in ("", "Not assessed")]
    check("items listed", num(stat(pg, ".ec-stat", "Items listed")), len(items))
    check("affected", num(stat(pg, ".ec-stat", "Affected")), len(aff))
    check("closed", num(stat(pg, ".ec-stat", "Closed")), len(closed))
    check("still open", num(stat(pg, ".ec-stat", "Still open")), len(open_))
    check("not assessed", num(stat(pg, ".ec-stat", "Not assessed")), len(na))
    check("% affected closed", num(stat(pg, ".ec-stat", "Affected items closed")), round(100 * len(closed) / len(aff)), 0.5)
    check("stock total 340+1200+85", next(num(x.split(":")[1]) for x in flags(pg) if x.startswith("Old-revision stock")), 1625)
    pg.click(".ec-std"); pg.wait_for_timeout(200)
    std = len(re.findall(r"\['[^']+','[^']+'\]", src.split("CATS:")[0]))
    have = {re.sub(r"\s+", " ", x).lower() for x in re.findall(r"\{item:'([^']*)'", src)}
    stdnames = [x.lower() for x in re.findall(r"\['([^']+)','[^']+'\]", src.split("CATS:")[0])]
    check("standard list adds the missing items only", num(stat(pg, ".ec-stat", "Items listed")), len(items) + len([x for x in stdnames if x not in have]))

    print("is-is-not-problem-specification")
    load(pg, "is-is-not-problem-specification"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    m = dict(re.findall(r"(s\d_c\d):'([^']+)'", example("is-is-not-problem-specification")))
    tally = {}
    for c in ("c1", "c2", "c3", "c4"):
        v = [m[f"s{r}_{c}"] for r in range(1, 8)]
        tally[c] = (v.count("Explains"), sum(x.startswith("Only") for x in v), v.count("Does not explain"))
    elim = sum(1 for t in tally.values() if t[2] > 0)
    check("eliminated causes", num(stat(pg, ".ki-stat", "Eliminated")), elim)
    live = sorted([(t[1], c) for c, t in tally.items() if t[2] == 0])
    check("most probable cause", stat(pg, ".ki-stat", "Most probable"), live[0][1].upper())
    for c, t in tally.items():
        if t[2]: check(f"{c.upper()} rows not explained", next(num(x.split("explain")[1]) for x in flags(pg) if x.startswith(c.upper() + " is eliminated")), t[2])
    # change one cell: C1 fails the 'where on the object' row -> C1 eliminated, nothing survives
    pg.select_option('select[data-mk="s3_c1"]', "Does not explain"); pg.wait_for_timeout(200)
    check("after C1 fails a row: eliminated", num(stat(pg, ".ki-stat", "Eliminated")), 4)
    check("after C1 fails a row: no probable cause", stat(pg, ".ki-stat", "Most probable"), "—")

    print("out-of-control-action-plan")
    load(pg, "out-of-control-action-plan"); pg.click("[data-act=example]"); pg.wait_for_timeout(200)
    src = example("out-of-control-action-plan")
    tys = re.findall(r"\{id:'\w+',ty:'([^']+)'", src)
    qs = [int(x) for x in re.findall(r",q:'(\d+)'", src)]
    st_ = re.findall(r",cl:'(\w+)'", src)
    check("checks", num(stat(pg, ".oc-stat", "Checks")), sum(t.startswith("Check") for t in tys))
    check("actions and escalations", num(stat(pg, ".oc-stat", "Actions")), sum(t in ("Action", "Escalate") for t in tys))
    check("events logged", num(stat(pg, ".oc-stat", "Events logged")), len(st_))
    check("events open", num(stat(pg, ".oc-stat", "Events open")), st_.count("Open"))
    check("suspect units", num(stat(pg, ".oc-stat", "Suspect")), sum(qs))
    # a broken plan: unreachable step, loop with no exit, bad reference
    load(pg, "out-of-control-action-plan", {"g": {"sg": [{"id": "S1", "rule": "Point beyond a control limit", "start": "C1"}],
        "st": [{"id": "C1", "ty": "Check (yes/no question)", "t": "Gauge OK?", "y": "A1", "n": "C2"},
               {"id": "A1", "ty": "Action", "t": "Fix", "y": "C1"},
               {"id": "C2", "ty": "Check (yes/no question)", "t": "Tool?", "y": "A1", "n": "Z9"},
               {"id": "Q1", "ty": "Action", "t": "Orphan", "y": ""}], "lg": [{}]}})
    fl = " | ".join(flags(pg))
    check("bad reference found", "not a step ID" in fl and "Z9" in fl, True)
    check("unreachable step found", "No signal leads to: Q1" in fl, True)
    check("endless loop found", "no path reaches" in fl and "C1" in fl, True)
    check("missing escalation found", "no escalation step" in fl, True)

    if errs: FAIL.append("JS errors: " + str(errs)); print("JS errors", errs)
    br.close()
print("ALL CHECKS PASSED" if not FAIL else f"FAILED: {FAIL}")
sys.exit(1 if FAIL else 0)
