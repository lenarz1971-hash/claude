#!/usr/bin/env python3
"""Independent checks of the numbers and rule outcomes shown by the batch-b4 tools
(Oct 2026): supplier-selection-matrix, ppap-qualification-plan,
supplier-classification-lifecycle, kraljic-portfolio-matrix.

Each case is loaded into the built page in a real browser (Chromium via
Playwright); figures are read off the page and compared with an
implementation written here from scratch (weighted sums, the AIAG PPAP
retention table transcribed separately, the classification rules as written
in the page text, Kraljic quadrant rules).

Run: python3 tests/test_b4_numbers.py <out root>"""
import http.server, socketserver, threading, os, sys, json, re, datetime
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b4"
FAIL = []; NCHK = [0]
def check(name, got, want, tol=0):
    NCHK[0] += 1
    ok = (abs(got - want) <= tol) if isinstance(want, (int, float)) and isinstance(got, (int, float)) else got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("%", "").strip()
    return float(s)

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
    else:
        pg.wait_for_timeout(150); pg.click("[data-act=example]")
    pg.wait_for_timeout(250)
    return state or pg.evaluate("()=>window.TOOL.example")

def rows(pg, sel):
    return [[c.inner_text().strip() for c in r.locator("td").all()] for r in pg.locator(sel + " tbody tr").all()]

def stat(pg, sel, label):
    for d in pg.locator(sel + " > div").all():
        if d.locator("span").inner_text().upper().startswith(label.upper()): return d.locator("b").inner_text()
    raise KeyError(label)

TODAY = datetime.datetime.now(datetime.timezone.utc).date().isoformat()   # the page uses UTC (toISOString)

# ------------------------------------------------------------ supplier selection
def test_selection(pg, state=None):
    st = load(pg, "supplier-selection-matrix", state)
    f = st["f"]; C = [c for c in st["g"]["c"] if c.get("n")]; R = [r for r in st["g"]["r"] if r.get("n")]
    P = [p for p in st["g"]["s"] if p.get("sup")]; s = st["x"]["s"]; rk = st["x"]["r"]
    med = float(f.get("med") or 2); high = float(f.get("high") or 3)
    def fl(v):
        try: return float(v)
        except (TypeError, ValueError): return None
    def score(sup, w=None):
        t = W = 0
        for j, c in enumerate(C):
            wt = w[j] if w else fl(c.get("w"))
            if wt is None or wt <= 0: continue
            x = s.get(f"{sup}|{c['n']}"); t += wt * (x or 0); W += wt
        return t, (t / (W * 5) * 100 if W else None)
    def trf(sup):
        t = W = 0
        for r in R:
            wt = fl(r.get("w")); x = rk.get(f"{sup}|{r['n']}")
            if wt is None or wt <= 0 or x is None: continue
            t += wt * x; W += wt
        return t / W if W else None
    lv = lambda v: "High" if v >= high else "Medium" if v >= med else "Low"
    res = []
    for p in P:
        t, pct = score(p["sup"]); tf = trf(p["sup"])
        res.append(dict(sup=p["sup"], t=t, pct=pct, trf=tf, lv=lv(tf) if tf is not None else "", out=p.get("must") == "No"))
    order = sorted(res, key=lambda r: (r["out"], -r["pct"], r["trf"] if r["trf"] is not None else 9))
    page = rows(pg, "table.ss-res")
    check("selection ranking order", [r[1] for r in page], [r["sup"] for r in order])
    for pr, r in zip(page, order):
        check(f"selection {r['sup']} weighted total", num(pr[2]), round(r["t"]), 0.5)
        check(f"selection {r['sup']} % of max", num(pr[3]), round(r["pct"], 1), 0.051)
        if r["trf"] is not None:
            check(f"selection {r['sup']} total risk factor", num(pr[4]), round(r["trf"], 2), 0.0051)
            check(f"selection {r['sup']} risk level", pr[5], r["lv"])
    el = [r for r in order if not r["out"]]
    rec = next((r for r in el if r["lv"] != "High"), None)
    check("selection recommended", stat(pg, ".ss-stat", "Recommended"), rec["sup"] if rec else "—")
    pool = [r for r in el if r["lv"] != "High"]
    if len(pool) < 2: pool = el
    base = [max(fl(c.get("w")) or 0, 0) for c in C]
    def win(w):
        best = None
        for r in pool:
            x = score(r["sup"], w)[1]
            if x is not None and (best is None or x > best[1] + 1e-9): best = (r["sup"], x)
        return best
    exp = []
    for j, c in enumerate(C):
        if not base[j]: continue
        a = base[:]; a[j] = 0; d = base[:]; d[j] = base[j] * 2
        exp += [("Drop " + c["n"], win(a)), ("Double " + c["n"], win(d))]
    exp.append(("Equal weights", win([1] * len(C))))
    sens = rows(pg, "table.ss-sens")
    check("selection sensitivity rows", len(sens), len(exp))
    for pr, (lab, w) in zip(sens, exp):
        check(f"sensitivity '{lab}' winner", pr[1], w[0])
        check(f"sensitivity '{lab}' score", num(pr[2]), round(w[1], 1), 0.051)

# ------------------------------------------------------------ PPAP
AIAG = {  # element: (L1, L2, L3, L4, L5), transcribed from the AIAG PPAP 4th edition retention table
 "Design records": "RSS*R", "Engineering change documents": "RSS*R", "Customer engineering approval": "RRS*R",
 "Design FMEA": "RRS*R", "Process flow diagram": "RRS*R", "Process FMEA": "RRS*R", "Control plan": "RRS*R",
 "Measurement system analysis (MSA)": "RRS*R", "Dimensional results (first article)": "RSS*R",
 "Material and performance test results": "RSS*R", "Initial process studies (capability)": "RRS*R",
 "Qualified laboratory documentation": "RSS*R", "Appearance approval report": "SSS*R", "Sample production parts": "RSS*R",
 "Master sample": "RRR*R", "Checking aids": "RRR*R", "Customer-specific requirements": "RRS*R", "Part submission warrant (PSW)": "SSSSR"}
LVL = ["Level 1: warrant only (and appearance report)", "Level 2: warrant, samples and limited data", "Level 3: warrant, samples and complete data",
       "Level 4: warrant and what the customer defines", "Level 5: warrant, samples and complete data reviewed on site"]

def test_ppap(pg):
    slug = "ppap-qualification-plan"
    ex = load(pg, slug)
    # level codes, all 18 elements x 5 levels, plus a plan item
    els = [{"el": k, "req": "Required", "st": "Accepted"} for k in AIAG] + [{"el": "Supplier process audit", "req": "Required", "st": "Accepted"}]
    for L in range(1, 6):
        load(pg, slug, {"f": {"lvl": LVL[L - 1]}, "g": {"e": els, "k": []}})
        got = [r.locator('td[data-c="lv"]').inner_text() for r in pg.locator('table[data-grid="e"] tbody tr').all()]
        want = [AIAG[k][L - 1] for k in AIAG] + ["P"]
        check(f"PPAP level {L} codes for 19 rows", got, want)
    # worked example: counts, run at rate
    load(pg, slug)
    E = [r for r in ex["g"]["e"] if r.get("el")]; Rq = [r for r in E if (r.get("req") or "Required") == "Required"]
    acc = sum(r.get("st") == "Accepted" for r in Rq)
    check("PPAP required elements", int(stat(pg, ".pq-stat", "Required elements")), len(Rq))
    check("PPAP accepted", stat(pg, ".pq-stat", "Accepted"), f"{acc} ({round(acc / len(Rq) * 100)}%)")
    od = [r for r in Rq if r.get("due") and r["due"] < TODAY and r.get("st") not in ("Accepted", "Complete, awaiting review")]
    check("PPAP past due", int(stat(pg, ".pq-stat", "Past due")), len(od))
    f = ex["f"]; need = float(f["dreq"]) / float(f["hpd"]); dem = float(f["rg"]) / float(f["rh"])
    check("run at rate: required per hour", num(stat(pg, ".pq-rar", "Required rate")), round(need, 1), 0.051)
    check("run at rate: demonstrated per hour", num(stat(pg, ".pq-rar", "Demonstrated rate")), round(dem, 1), 0.051)
    check("run at rate: ratio %", num(stat(pg, ".pq-rar", "Demonstrated ÷")), round(dem / need * 100), 0)
    check("run at rate: good %", num(stat(pg, ".pq-rar", "Good parts")), round(float(f["rg"]) / float(f["rq"]) * 100, 1), 0.051)
    check("run at rate: parts per day", num(stat(pg, ".pq-rar", "Demonstrated parts")), round(dem * float(f["hpd"])), 0.5)
    # capability and GRR verdict boundaries (AIAG: Ppk >1.67 meets, 1.33-1.67 ask, <1.33 not; GRR <10 ok, 10-30 ask, >30 not)
    cases = [(1.68, 9.99), (1.67, 10), (1.33, 30), (1.329, 30.01), (2.5, 0)]
    cap = lambda p: "Meets" if p > 1.67 else "Ask customer" if p >= 1.33 else "Does not meet"
    grr = lambda g: "Meets" if g < 10 else "Ask customer" if g <= 30 else "Does not meet"
    load(pg, slug, {"f": {"lvl": LVL[2]}, "g": {"e": [], "k": [{"c": f"C{i}", "cl": "Critical", "ppk": str(p), "grr": str(g), "n": "125"} for i, (p, g) in enumerate(cases)]}})
    got = [r.locator('td[data-c="v"]').inner_text().split("\n") for r in pg.locator('table[data-grid="k"] tbody tr').all()]
    for (p, g), v in zip(cases, got):
        check(f"PPAP verdict Ppk {p}", v[1].strip(), "Ppk " + cap(p))
        check(f"PPAP verdict GRR {g}%", v[0].strip(), "MSA " + grr(g))
    # run at rate below demand
    load(pg, slug, {"f": {"lvl": LVL[2], "dreq": "960", "hpd": "16", "rq": "400", "rg": "390", "rh": "8"}, "g": {"e": [], "k": []}})
    check("run at rate low: ratio %", num(stat(pg, ".pq-rar", "Demonstrated ÷")), round((390 / 8) / (960 / 16) * 100), 0)

# ------------------------------------------------------------ classification
K = ["Disqualified", "Non-approved", "Conditional", "Approved", "Preferred", "Certified", "Partnership"]
def judge(r, R):
    def fl(v):
        try: return float(v)
        except (TypeError, ValueError): return None
    sc, np_, ppm, scar = fl(r.get("sc")), fl(r.get("np")), fl(r.get("ppm")), fl(r.get("scar"))
    aud = r.get("aud") or "Not audited"; cert = r.get("cert") or "None"; caps = [6]
    if sc is None and aud == "Not audited": caps.append(1)
    caps.append({"Fail": 0, "Major findings open": 2, "Not audited": 2}.get(aud, 6))
    if sc is None: caps.append(3)
    elif sc < R["tc"]: caps.append(0)
    elif sc < R["ta"]: caps.append(2)
    elif sc < R["tp"]: caps.append(3)
    if cert == "Expired or suspended" or (cert == "None" and R["creq"] == "Yes"): caps.append(2)
    if scar and scar > 0: caps.append(3)
    if np_ is None or np_ < R["np"]: caps.append(3)
    elif np_ < R["nc"]: caps.append(4)
    if cert != "Valid": caps.append(4)
    if ppm is None or ppm > R["ppm"]: caps.append(4)
    if not r.get("ad"): caps.append(4)
    elif (datetime.date.fromisoformat(TODAY) - datetime.date.fromisoformat(r["ad"])).days > R["age"] * 365.25 / 12: caps.append(4)
    if r.get("part") != "Yes": caps.append(5)
    return min(caps)
def action(cur, k):
    c = K.index(cur) if cur in K else -1
    if c < 0: return "Set to " + K[k]
    if k == c: return "Hold"
    if c == 0: return "Requalify" if k >= 2 else "Hold"
    if c == 1 and k == 0: return "Do not approve"
    if k == 0: return "Disqualify"
    return ("Promote to " if k > c else "Demote to ") + K[k]

def test_class(pg, state=None):
    st = load(pg, "supplier-classification-lifecycle", state); f = st["f"]
    g = lambda k, d: float(f[k]) if f.get(k) not in (None, "") else d
    R = dict(tc=g("tc", 55), ta=g("ta", 70), tp=g("tp", 85), np=g("np", 2), nc=g("nc", 4), ppm=g("ppm", 500), age=g("age", 12), creq=f.get("creq") or "Yes")
    P = [p for p in st["g"]["p"] if p.get("sup")]
    page = rows(pg, "table.cl-res")
    for p, pr in zip(P, page):
        k = judge(p, R)
        check(f"class {p['sup']} rules allow", pr[2], K[k])
        check(f"class {p['sup']} action", pr[3], action(p.get("cur"), k))
    grid = [(r.locator('td[data-c="el"]').inner_text(), r.locator('td[data-c="mv"]').inner_text()) for r in pg.locator('table[data-grid="p"] tbody tr').all()]
    for p, (a, b) in zip(P, grid):
        check(f"class {p['sup']} grid columns agree", (a, b), (K[judge(p, R)], action(p.get("cur"), judge(p, R))))
    up = sum(1 for p in P if p.get("cur") in K and judge(p, R) > K.index(p["cur"]))
    dn = sum(1 for p in P if p.get("cur") in K and judge(p, R) < K.index(p["cur"]))
    check("class promote count", int(stat(pg, ".cl-stat", "Promote")), up)
    check("class demote count", int(stat(pg, ".cl-stat", "Demote")), dn)

# ------------------------------------------------------------ Kraljic
def test_kraljic(pg, state=None):
    st = load(pg, "kraljic-portfolio-matrix", state)
    cut = float(st["f"].get("cut") or 3); I = [r for r in st["g"]["i"] if r.get("it")]
    tot = sum(float(r["sp"]) for r in I if r.get("sp"))
    def mean(r, ks):
        v = [float(r[k]) for k in ks if r.get(k) not in (None, "")]
        return sum(v) / len(v) if v else None
    trs = pg.locator('table[data-grid="i"] tbody tr').all()
    cnt = {"Strategic": 0, "Leverage": 0, "Bottleneck": 0, "Non-critical": 0}; spq = dict.fromkeys(cnt, 0.0)
    for r, tr in zip(I, trs):
        sr, pi = mean(r, ["s1", "s2", "s3"]), mean(r, ["p1", "p2"])
        q = "" if sr is None or pi is None else ("Strategic" if sr >= cut else "Leverage") if pi >= cut else ("Bottleneck" if sr >= cut else "Non-critical")
        cell = lambda c: tr.locator(f'td[data-c="{c}"]').inner_text()
        if sr is not None: check(f"kraljic {r['it']} supply risk", num(cell("sr")), round(sr, 2), 0.0051)
        if pi is not None: check(f"kraljic {r['it']} profit impact", num(cell("pi")), round(pi, 2), 0.0051)
        check(f"kraljic {r['it']} quadrant", cell("q"), q)
        if r.get("sp") and tot: check(f"kraljic {r['it']} spend share", num(cell("sh")), round(float(r["sp"]) / tot * 100, 1), 0.051)
        if q: cnt[q] += 1; spq[q] += float(r.get("sp") or 0)
    for q in cnt:
        want = f"{cnt[q]}" + (f" · {round(spq[q] / tot * 100)}%" if tot else "")
        check(f"kraljic stat {q}", stat(pg, ".kj-stat", q), want)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== supplier selection, worked example"); test_selection(pg)
    print("== supplier selection, weights not 100, a missing score, a knock-out")
    test_selection(pg, {"f": {"med": "2.5", "high": "3.5"}, "g": {
        "c": [{"n": "Q", "cat": "Quality", "w": "5"}, {"n": "D", "cat": "Delivery", "w": "3"}, {"n": "Cost", "cat": "Cost", "w": "2"}],
        "s": [{"sup": "Alpha", "must": "Yes"}, {"sup": "Bravo", "must": "Yes"}, {"sup": "Charlie", "must": "No"}, {"sup": "Delta", "must": "Not verified"}],
        "r": [{"n": "Sole", "w": "2"}, {"n": "Fin", "w": "1"}]},
        "x": {"s": {"Alpha|Q": 4, "Alpha|D": 4, "Alpha|Cost": 2, "Bravo|Q": 3, "Bravo|D": 5, "Bravo|Cost": 5,
                    "Charlie|Q": 5, "Charlie|D": 5, "Charlie|Cost": 5, "Delta|Q": 5, "Delta|D": 3},
              "r": {"Alpha|Sole": 2, "Alpha|Fin": 1, "Bravo|Sole": 4, "Bravo|Fin": 3, "Charlie|Sole": 1, "Charlie|Fin": 1, "Delta|Sole": 1}}})
    print("== PPAP"); test_ppap(pg)
    print("== classification, worked example"); test_class(pg)
    print("== classification, boundary cases and changed rules")
    d = lambda days: (datetime.date.fromisoformat(TODAY) - datetime.timedelta(days=days)).isoformat()
    test_class(pg, {"f": {"tc": "60", "ta": "75", "tp": "90", "np": "3", "nc": "3", "ppm": "100", "age": "6", "creq": "No"}, "g": {"p": [
        {"sup": "At approved line", "cur": "Conditional", "sc": "75", "np": "0", "ppm": "50", "scar": "0", "aud": "Pass", "ad": d(10), "cert": "None", "part": "No"},
        {"sup": "Just below conditional", "cur": "Approved", "sc": "59.9", "np": "0", "ppm": "50", "scar": "0", "aud": "Pass", "ad": d(10), "cert": "Valid", "part": "No"},
        {"sup": "Certified at limits", "cur": "Preferred", "sc": "90", "np": "3", "ppm": "100", "scar": "0", "aud": "Pass with minor findings", "ad": d(150), "cert": "Valid", "part": "No"},
        {"sup": "Audit too old", "cur": "Certified", "sc": "95", "np": "8", "ppm": "10", "scar": "0", "aud": "Pass", "ad": d(200), "cert": "Valid", "part": "Yes"},
        {"sup": "Failed audit, high score", "cur": "Preferred", "sc": "96", "np": "6", "ppm": "10", "scar": "0", "aud": "Fail", "ad": d(5), "cert": "Valid", "part": "No"},
        {"sup": "Disqualified, now good", "cur": "Disqualified", "sc": "80", "np": "0", "ppm": "300", "scar": "0", "aud": "Pass", "ad": d(30), "cert": "Valid", "part": "No"},
        {"sup": "New, not assessed", "cur": "Non-approved", "aud": "Not audited"},
        {"sup": "No class yet", "sc": "88", "np": "1", "aud": "Pass", "ad": d(30), "cert": "Expired or suspended"}]}})
    print("== Kraljic, worked example"); test_kraljic(pg)
    print("== Kraljic, cut 3.5, points on the line, partial factors")
    test_kraljic(pg, {"f": {"cut": "3.5"}, "g": {"i": [
        {"it": "On both lines", "sp": "100", "s1": "3", "s2": "4", "p1": "3", "p2": "4"},
        {"it": "Just under", "sp": "300", "s1": "3", "s2": "4", "s3": "3", "p1": "5", "p2": "2"},
        {"it": "One factor each", "sp": "50", "s3": "5", "p2": "1"},
        {"it": "Unscored impact", "sp": "25", "s1": "2"},
        {"it": "No spend", "s1": "5", "s2": "5", "s3": "5", "p1": "5", "p2": "5"}]}})
    b.close()
print(f"\n{NCHK[0]} checks")
print("FAILED: " + ", ".join(FAIL) if FAIL else "ALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
