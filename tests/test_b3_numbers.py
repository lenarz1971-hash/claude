#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b3 tools (Oct 2026):
kanban-sizing-calculator, five-s-audit-scorecard, error-proofing-poka-yoke,
standardized-work-combination-sheet, heijunka-leveling, spaghetti-diagram.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with
implementations written here from the textbook formulas:
  kanban          N = ceil(D x L x (1 + a) / C), using exact fractions
  5S              mean of criteria per S, overall = mean of S / 4
  combination     operator cycle = sum(manual + walk); station cycle =
                  max(operator cycle, max(manual + machine)); takt = avail / demand
  heijunka        daily = demand / days, pattern = daily / gcd, even spread
                  checked as a property (every prefix within 1 of its share)
  spaghetti       rectilinear |dx| + |dy| or Euclidean, times trips
  poka-yoke       strength from the hierarchy, reduction = (before - after) / before

Run: python3 tests/test_b3_numbers.py <out root>   (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re
from fractions import Fraction as Fr
from functools import reduce
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b3"
FAIL = []; N = [0]
def check(name, got, want, tol=0):
    N[0] += 1
    ok = abs(got - want) <= tol
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)
def same(name, got, want):
    N[0] += 1; ok = got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("$", "").replace("−", "-").strip()
    return float(re.match(r"^-?[\d.]+", s.rstrip("%")).group(0))

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

def load(pg, slug, state=None):
    pg.goto(f"http://127.0.0.1:{port}/tools/{slug}.html")
    if state is not None:
        state = dict(state, v=1, tool=slug); state.setdefault("x", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)
    return state or dict(pg.evaluate("()=>window.TOOL.example"))

def stats(pg, sel):
    return [(d.locator("span").inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]
def stat(pg, sel, label, k=0):
    hits = [v for l, v in stats(pg, sel) if l.upper().startswith(label.upper())]
    if len(hits) <= k: raise KeyError(label)
    return hits[k]
def cells(pg, grid, col):
    return [r.locator(f'td[data-c="{col}"]').inner_text() for r in pg.locator(f'table[data-grid="{grid}"] tbody tr').all()]
def f(v):
    return None if v in (None, "") else Fr(str(v))

# ---------------------------------------------------------------- kanban
def test_kanban(pg, state=None):
    st = load(pg, "kanban-sizing-calculator", state)
    dflt = f(st["f"].get("sf")) or Fr(0)
    raw, n_, inv, cov = (cells(pg, "p", c) for c in ("raw", "n", "inv", "cov"))
    tot = units = 0; val = Fr(0)
    for i, r in enumerate(st["g"]["p"]):
        D, L, C = f(r.get("d")), f(r.get("lt")), f(r.get("c"))
        a = f(r.get("sf")); a = dflt if a is None else a
        x = D * L * (1 + a / 100) / C
        N_ = max(1, math.ceil(x))
        check(f"kanban {r['pn']} exact N", num(raw[i]), float(x), 0.0051)
        check(f"kanban {r['pn']} N", num(n_[i]), N_)
        check(f"kanban {r['pn']} max units", num(inv[i]), N_ * C, 0.5)
        check(f"kanban {r['pn']} days of cover", num(cov[i]), float(N_ * C / D), 0.0051)
        tot += N_; units += N_ * C
        if r.get("uc"): val += N_ * C * f(r["uc"])
    check("kanban total kanbans", num(stat(pg, ".kb-stat", "Kanbans in")), tot)
    check("kanban total max units", num(stat(pg, ".kb-stat", "Max units")), float(units), 0.5)
    if val: check("kanban inventory value", num(stat(pg, ".kb-stat", "Max inventory value")), float(val), 0.5)

# ---------------------------------------------------------------- 5S
SS = ["Sort", "Set in order", "Shine", "Standardize", "Sustain", "Safety"]
def test_5s(pg, state=None):
    st = load(pg, "five-s-audit-scorecard", state)
    k = 6 if "6S" in st["f"].get("mode", "") else 5
    by = {s: [] for s in SS}
    for r in st["g"]["c"]:
        if r.get("s") and r.get("sc", "") != "": by[r["s"]].append(Fr(r["sc"]))
    avg = [sum(by[s]) / len(by[s]) if by[s] else None for s in SS[:k]]
    done = [a for a in avg if a is not None]
    pct = sum(done) / len(done) / 4 * 100
    check("5S overall %", num(stat(pg, ".fs-stat", "Overall")), round(float(pct)), 0)
    for s, a in zip(SS[:k], avg):
        if a is not None: check(f"5S {s} average", num(stat(pg, ".fs-stat", s + " (")), float(a), 0.005)
    page = cells(pg, "h", "t")
    for i, r in enumerate(st["g"].get("h", [])):
        v = [Fr(r[x]) for x in ["s1", "s2", "s3", "s4", "s5", "s6"][:k] if r.get(x, "") != ""]
        if v: check(f"5S history row {i+1} %", num(page[i]), round(float(sum(v) / len(v) / 4 * 100)), 0)

# ---------------------------------------------------------------- poka-yoke
def test_poka(pg, state=None):
    st = load(pg, "error-proofing-poka-yoke", state)
    sg, rd = cells(pg, "d", "sg"), cells(pg, "d", "rd")
    tb = ta = 0
    for i, r in enumerate(st["g"]["d"]):
        L = int(r["ap"][0]); s = (6 - L) * 2 - (1 if r.get("fn", "").startswith("Warning") else 0)
        check(f"poka {r['id']} strength", num(sg[i]), s)
        b, a = f(r.get("b")), f(r.get("a"))
        if b is not None and a is not None:
            tb += b; ta += a
            if b > 0: check(f"poka {r['id']} reduction %", num(rd[i]), round(float((b - a) / b * 100)), 0)
    if tb: check("poka overall reduction %", num(stat(pg, ".pk-stat", "Overall reduction")), round(float((tb - ta) / tb * 100)), 0)
    order = [t.inner_text() for t in pg.locator(".pk-tab tbody tr td:nth-child(2)").all()]
    strengths = [num(t.inner_text()) for t in pg.locator(".pk-tab tbody tr td:nth-child(7)").all()]
    same("poka ranked table sorted by strength", strengths, sorted(strengths, reverse=True))

# ---------------------------------------------------------------- combination sheet
def test_comb(pg, state=None):
    st = load(pg, "standardized-work-combination-sheet", state)
    F = st["f"]
    takt = f(F.get("takt")) or (f(F["av"]) * 60 / f(F["dm"]))
    rows = [r for r in st["g"]["s"] if r.get("n") or r.get("m") or r.get("w") or r.get("a")]
    g = lambda r, k: f(r.get(k)) or Fr(0)
    C = sum(g(r, "m") + g(r, "w") for r in rows)
    mc = max([g(r, "m") + g(r, "a") for r in rows if g(r, "a") > 0] or [Fr(0)])
    CT = max(C, mc)
    check("comb takt", num(stat(pg, ".sw-stat", "Takt")), float(takt), 0.05)
    check("comb operator cycle", num(stat(pg, ".sw-stat", "Operator cycle")), float(C), 0.05)
    check("comb station cycle", num(stat(pg, ".sw-stat", "Station cycle")), float(CT), 0.05)
    parts = [num(x) for x in stat(pg, ".sw-stat", "Manual / walk").split("/")]
    for nm, got, want in zip(["manual", "walk", "machine"], parts, [sum(g(r, k) for r in rows) for k in "mwa"]):
        check(f"comb total {nm}", got, float(want), 0.05)
    check("comb cycle % of takt", num(stat(pg, ".sw-stat", "Cycle as")), round(float(CT / takt * 100)), 0)
    starts = cells(pg, "s", "st"); t = Fr(0)
    for i, r in enumerate(st["g"]["s"]):
        if r in rows: check(f"comb start of element {i+1}", num(starts[i]), float(t), 0.05); t += g(r, "m") + g(r, "w")
    waits = [r for r in rows if g(r, "a") > 0 and g(r, "m") + g(r, "a") > C]
    txt = pg.locator(".sw-out").inner_text()
    for r in waits:
        w = g(r, "m") + g(r, "a") - C
        same(f"comb operator wait at '{r['n']}' = {float(w):g} s", f"operator waits {float(w):g} s" in txt, True)
    same("comb no false wait flags", txt.count("operator waits"), len(waits))

# ---------------------------------------------------------------- heijunka
def test_heij(pg, state=None):
    st = load(pg, "heijunka-leveling", state)
    F = st["f"]; days = int(F["days"]); cont = F.get("unit", "").startswith("Containers")
    P = []
    for r in st["g"]["p"]:
        D = int(r["d"]); q = math.ceil(Fr(D, int(r["pk"]))) if cont else D
        P.append(dict(code=r["c"], q=q, e=Fr(q, days)))
    d = [round(p["e"]) for p in P]   # Python rounds half to even; none of the cases sits on .5
    g = reduce(math.gcd, [x for x in d if x > 0])
    rep = int(F["rep"]) if F.get("rep") else g
    pat = [max(1, round(Fr(x, rep))) if x > 0 else 0 for x in d]
    L = sum(pat); tot = sum(p["e"] for p in P)
    check("heijunka per day", num(stat(pg, ".hj-stat", ("containers" if cont else "units") + " per day")), float(tot), 0.005)
    check("heijunka takt/pitch s", num(stat(pg, ".hj-stat", "Pitch" if cont else "Takt")), float(Fr(F["av"]) * 60 / tot), 0.05)
    check("heijunka pattern length", num(stat(pg, ".hj-stat", "Pattern length")), L)
    check("heijunka repeats per day", num(stat(pg, ".hj-stat", "Pattern repeats")), rep)
    rows = [[c.inner_text() for c in r.locator("td").all()] for r in pg.locator(".hj-tab tbody tr").all()]
    for p, x, pp, row in zip(P, d, pat, rows):
        check(f"heijunka {p['code']} exact per day", num(row[3]), float(p["e"]), 0.005)
        check(f"heijunka {p['code']} in pattern", num(row[5]), pp)
        check(f"heijunka {p['code']} period output", num(row[6]), pp * rep * days)
        check(f"heijunka {p['code']} difference", num(row[7].replace("+", "")), pp * rep * days - p["q"])
    seq = re.search(r"Pattern:\s*(\S+)", pg.locator(".hj-out").inner_text()).group(1)
    for p, pp in zip(P, pat): check(f"heijunka sequence count of {p['code']}", seq.count(p["code"]), pp)
    worst = max(abs(seq[:k].count(p["code"]) - Fr(k * pp, L)) for k in range(1, L + 1) for p, pp in zip(P, pat))
    same("heijunka sequence even: every prefix within 1 unit of its share", worst < 1, True)
    drows = [[num(c.inner_text()) for c in r.locator("td").all()[1:]] for r in pg.locator(".hj-days tbody tr").all()]
    for p, row in zip(P, drows):
        exp = [math.floor(Fr(j * p["q"], days)) - math.floor(Fr((j - 1) * p["q"], days)) for j in range(1, days + 1)]
        same(f"heijunka {p['code']} day-by-day", row[:-1], [float(x) for x in exp])
        check(f"heijunka {p['code']} day-by-day sums to demand", sum(row[:-1]), p["q"])

# ---------------------------------------------------------------- spaghetti
def test_spag(pg, state=None):
    st = load(pg, "spaghetti-diagram", state)
    man = not st["f"].get("rule", "").startswith("Straight")
    S = {}
    for r in st["g"]["s"]:
        x, y = float(r["x"]), float(r["y"])
        S[r["c"].upper()] = ((x, y), (float(r["px"]) if r.get("px") else x, float(r["py"]) if r.get("py") else y))
    def dist(a, b): return abs(a[0]-b[0]) + abs(a[1]-b[1]) if man else math.hypot(a[0]-b[0], a[1]-b[1])
    tot = totp = 0; one, day = cells(pg, "r", "one"), cells(pg, "r", "day")
    for i, r in enumerate(st["g"]["r"]):
        seq = [s for s in re.split(r"[\s,;>]+", re.sub(r"-+>", " ", r["seq"].upper())) if s]
        legs = [(a, b) for a, b in zip(seq, seq[1:]) if a in S and b in S]
        d1 = sum(dist(S[a][0], S[b][0]) for a, b in legs); d2 = sum(dist(S[a][1], S[b][1]) for a, b in legs)
        t = float(r.get("t") or 1)
        check(f"spaghetti {r['w']} one pass", num(one[i]), d1, 0.5)
        check(f"spaghetti {r['w']} per day", num(day[i]), d1 * t, 0.5)
        tot += d1 * t; totp += d2 * t
    unit = st["f"].get("unit", "feet"); big = 1000 if unit == "meters" else 5280
    check("spaghetti per day, current", num(stat(pg, ".sp-stat", "Per day, current", 0)), tot, 0.5)
    check("spaghetti per day, current (miles/km)", num(stat(pg, ".sp-stat", "Per day, current", 1)), tot / big, 0.005)
    if any(r.get("px") or r.get("py") for r in st["g"]["s"]):
        check("spaghetti per day, proposed", num(stat(pg, ".sp-stat", "Per day, proposed")), totp, 0.5)
        check("spaghetti saving %", num(stat(pg, ".sp-stat", "Saving")), round((tot - totp) / tot * 100), 0)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== kanban, worked example"); test_kanban(pg)
    print("== kanban, float trap 250 x 2 x 1.1 / 55 = 10 exactly; default safety; tiny demand")
    test_kanban(pg, {"f": {"sf": "10"}, "g": {"p": [
        {"pn": "Trap", "d": "250", "lt": "2", "sf": "", "c": "55"},
        {"pn": "No safety", "d": "7", "lt": "0.25", "sf": "0", "c": "10", "uc": "3"},
        {"pn": "Exact 2", "d": "100", "lt": "1", "sf": "0", "c": "50"},
        {"pn": "Big safety", "d": "33", "lt": "4.5", "sf": "60", "c": "12", "cur": "5"}]}})
    print("== 5S, worked example"); test_5s(pg)
    print("== 5S, 5S mode ignores Safety rows and Safety history; one S unscored")
    test_5s(pg, {"f": {"mode": "5S", "tgt": "75"}, "g": {"c": [
        {"s": "Sort", "q": "a", "sc": "4"}, {"s": "Sort", "q": "b", "sc": "1"}, {"s": "Sort", "q": "c", "sc": "2"},
        {"s": "Shine", "q": "d", "sc": "3"}, {"s": "Standardize", "q": "e", "sc": "0", "fd": "x"},
        {"s": "Sustain", "q": "f", "sc": "2", "fd": "y"}, {"s": "Safety", "q": "g", "sc": "0"}],
        "h": [{"d": "2026-01-05", "a": "A", "s1": "4", "s2": "3", "s3": "2", "s4": "1", "s5": "0", "s6": "4"},
              {"d": "2026-02-05", "a": "A", "s1": "3.25", "s2": "", "s3": "2.75", "s4": "1", "s5": "2"}]}})
    print("== poka-yoke, worked example"); test_poka(pg)
    print("== poka-yoke, all approaches and functions")
    test_poka(pg, {"f": {}, "g": {"d": [
        {"id": "P1", "er": "x", "ap": "5 Detect the defect downstream", "fn": "Control: stops the process", "b": "10", "a": "10"},
        {"id": "P2", "er": "x", "ap": "1 Eliminate: designed out", "fn": "Warning: signal only", "b": "3", "a": "0"},
        {"id": "P3", "er": "x", "ap": "3 Detect the error before it makes a defect", "fn": "Control: stops the process", "b": "7", "a": "2"},
        {"id": "P4", "er": "x", "ap": "4 Detect the defect at the station", "fn": "Warning: signal only", "b": "0", "a": "0"}]}})
    print("== combination sheet, worked example"); test_comb(pg)
    print("== combination sheet, takt override, two machines over the operator cycle")
    test_comb(pg, {"f": {"takt": "45", "av": "400", "dm": "100"}, "g": {"s": [
        {"n": "Load press", "m": "5", "w": "2", "a": "40"}, {"n": "Load lathe", "m": "8", "w": "3", "a": "34"},
        {"n": "Inspect", "m": "9.5", "w": "1.5", "a": ""}, {"n": "Pack", "m": "4", "w": "", "a": ""}]}})
    print("== combination sheet, manual only, over takt")
    test_comb(pg, {"f": {"av": "450", "dm": "600"}, "g": {"s": [
        {"n": "Build", "m": "30", "w": "4"}, {"n": "Test", "m": "12", "w": "2"}]}})
    print("== heijunka, worked example"); test_heij(pg)
    print("== heijunka, demand not divisible by days, 20 repeats a day")
    test_heij(pg, {"f": {"days": "5", "av": "480", "rep": "20"}, "g": {"p": [
        {"c": "A", "d": "1003"}, {"c": "B", "d": "497"}, {"c": "C", "d": "101"}]}})
    print("== heijunka, containers with pack-out rounding, repeats set by hand")
    test_heij(pg, {"f": {"days": "4", "av": "420", "unit": "Containers (pack-out quantity)", "rep": "3"}, "g": {"p": [
        {"c": "X", "d": "1210", "pk": "10"}, {"c": "Y", "d": "640", "pk": "20"}, {"c": "Z", "d": "305", "pk": "15"}]}})
    print("== spaghetti, worked example"); test_spag(pg)
    print("== spaghetti, straight line, meters, unknown code skipped")
    test_spag(pg, {"f": {"unit": "meters", "rule": "Straight line"}, "g": {"s": [
        {"c": "A", "x": "0", "y": "0"}, {"c": "B", "x": "3", "y": "4", "px": "0", "py": "4"}, {"c": "C", "x": "10", "y": "0"}],
        "r": [{"w": "Op", "seq": "A, B, C, Q, A", "t": "100"}, {"w": "Cart", "seq": "C -> A", "t": ""}]}})
    b.close()
print(f"\n{N[0]} checks")
print("FAILED: " + ", ".join(FAIL) if FAIL else "ALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
