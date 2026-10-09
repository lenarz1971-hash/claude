#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b11 tools (Oct 2026):
make-buy-analysis, supplier-quality-agreement-checklist, supplier-onboarding-checklist.

Each case is loaded into the built page in a real browser (Chromium via
Playwright); figures are read off the page and compared with code written
here from scratch: the make/buy annual cost model in exact fractions, the
break-even volume found by root finding (scipy.optimize.brentq) on the cost
difference rather than by the closed form the page uses, the weighted scores,
the quality agreement completeness score, and the onboarding counts.

Run: python3 tests/test_b11_numbers.py <out root>"""
import http.server, socketserver, threading, os, sys, json, datetime
from fractions import Fraction as Fr
from scipy.optimize import brentq
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b11"
FAIL = []; NCHK = [0]
def check(name, got, want, tol=0):
    NCHK[0] += 1
    ok = (abs(got - want) <= tol) if isinstance(want, (int, float)) and isinstance(got, (int, float)) else got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s): return float(s.replace(",", "").replace("$", "").replace("%", "").replace("−", "-").strip())

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

def stat(pg, sel, label):
    for d in pg.locator(sel + " > div").all():
        if d.locator("span").inner_text().upper().startswith(label.upper()): return d.locator("b").inner_text()
    raise KeyError(label)

def flags(pg): return pg.locator(".flag").all_inner_texts()
TODAY = datetime.datetime.now(datetime.timezone.utc).date().isoformat()

# ------------------------------------------------------------ make/buy
def test_makebuy(pg, label, state=None, expect_be=None):
    print(f"make-buy-analysis: {label}")
    st = load(pg, "make-buy-analysis", state); f = st["f"]
    yrs = Fr(f.get("yrs") or 5); vol = Fr(f["vol"])
    F = [Fr(0), Fr(0)]; U = [Fr(0), Fr(0)]
    for r in st["g"]["c"]:
        if not r.get("el") or (r.get("rel") or "").startswith("Not relevant"): continue
        for j, k in enumerate(("mk", "by")):
            v = r.get(k)
            if v in ("", None): continue
            v = Fr(v)
            if r.get("beh") == "One-time": F[j] += v / yrs
            elif r.get("beh") == "Per year (fixed)": F[j] += v
            else: U[j] += v
    cost = lambda j, V: F[j] + U[j] * V
    cm, cb = cost(0, vol), cost(1, vol)
    check("make cost per year", num(stat(pg, ".mb-stat", "Make, cost")), float(cm), 0.5)
    check("buy cost per year", num(stat(pg, ".mb-stat", "Buy, cost")), float(cb), 0.5)
    pu = stat(pg, ".mb-stat", "Cost per unit").split("/")
    check("make cost per unit", num(pu[0]), float(cm / vol), 0.005)
    check("buy cost per unit", num(pu[1]), float(cb / vol), 0.005)
    check("difference over horizon", num(stat(pg, ".mb-stat", "Difference")), float(abs(cm - cb) * yrs), 0.5)
    be_page = stat(pg, ".mb-stat", "Break-even")
    d = lambda V: float(cost(0, V) - cost(1, V))
    if U[0] != U[1] and d(0) * d(1e9) < 0:
        be = brentq(d, 0, 1e9, xtol=1e-9)
        check("break-even volume", num(be_page), round(be), 0)
        if expect_be is not None: check("break-even (hand value)", round(be, 2), expect_be, 0.01)
        gap = (float(vol) - be) / be * 100
        near = any("within 20% of break-even" in x for x in flags(pg))
        check("near-break-even warning shown", near, abs(gap) < 20)
    else:
        check("no break-even", be_page, "None")
    W = tm = tb = 0
    for r in st["g"]["s"]:
        if not r.get("fac"): continue
        w = float(r.get("w") or 0)
        if w <= 0: continue
        W += w; tm += w * float(r.get("m") or 0); tb += w * float(r.get("b") or 0)
    if W:
        check("make weighted %", num(stat(pg, ".mb-sc", "Make, weighted").split("(")[1].rstrip(")")), round(tm / (5 * W) * 100, 1), 0.05)
        check("buy weighted %", num(stat(pg, ".mb-sc", "Buy, weighted").split("(")[1].rstrip(")")), round(tb / (5 * W) * 100, 1), 0.05)
    # per-row annual column
    trs = pg.locator('table[data-grid="c"] tbody tr').all()
    for i, r in enumerate(st["g"]["c"]):
        if not r.get("el") or (r.get("rel") or "").startswith("Not relevant") or r.get("mk") in ("", None): continue
        v = Fr(r["mk"]); a = v / yrs if r.get("beh") == "One-time" else v if r.get("beh") == "Per year (fixed)" else v * vol
        check(f"row {i+1} make $/yr", num(trs[i].locator('[data-c="am"]').inner_text()), float(a), 0.5)

# hand check of the worked example: U_make 26.40, U_buy 43.30, F_make 420000/5+96000 = 180000,
# F_buy 18000/5+14000 = 17600; break-even 162400/16.9 = 9609.467...
CASE_NEAR = {"f": {"vol": "11000", "yrs": "3"}, "g": {"c": [
    {"el": "Price", "beh": "Per unit", "rel": "Relevant", "by": "12.75"},
    {"el": "Material and labor", "beh": "Per unit", "rel": "Relevant", "mk": "8.10"},
    {"el": "Quality cost", "beh": "Per unit", "rel": "Relevant", "mk": "0.45", "by": "0.70"},
    {"el": "Press and die", "beh": "One-time", "rel": "Relevant", "mk": "96000"},
    {"el": "Allocated overhead", "beh": "Per year (fixed)", "rel": "Not relevant (sunk or allocated)", "mk": "40000"},
    {"el": "Supplier audits", "beh": "Per year (fixed)", "rel": "Relevant", "by": "6000"}],
    "s": [{"fac": "Cost", "cat": "Cost", "w": "60", "m": "3", "b": "3"}, {"fac": "Core", "cat": "Strategic", "w": "40", "m": "4", "b": "2"}]}}
# F_make 32000, F_buy 6000, U_make 8.55, U_buy 13.45: break-even 26000/4.9 = 5306.12 (planned 11000 is far above)
CASE_CLOSE = json.loads(json.dumps(CASE_NEAR)); CASE_CLOSE["f"]["vol"] = "5800"   # +9% from break-even: warning
CASE_NONE = {"f": {"vol": "4000", "yrs": "5"}, "g": {"c": [
    {"el": "Price", "beh": "Per unit", "rel": "Relevant", "by": "5.00"},
    {"el": "Make unit", "beh": "Per unit", "rel": "Relevant", "mk": "6.00"},
    {"el": "Tooling", "beh": "One-time", "rel": "Relevant", "mk": "10000", "by": "2000"}], "s": [{}]}}
CASE_EQ = {"f": {"vol": "1000", "yrs": "2"}, "g": {"c": [
    {"el": "Unit", "beh": "Per unit", "rel": "Relevant", "mk": "3", "by": "3"},
    {"el": "Fixed", "beh": "Per year (fixed)", "rel": "Relevant", "mk": "500", "by": "100"}], "s": [{}]}}

# ------------------------------------------------------------ quality agreement
def test_qa(pg, label, state=None):
    print(f"supplier-quality-agreement-checklist: {label}")
    st = load(pg, "supplier-quality-agreement-checklist", state)
    Wt = {"Critical": 3, "Important": 2, "Standard": 1}; cr = {"Yes, fully": 1, "Partly": 0.5, "No": 0}
    E = [r for r in st["g"]["e"] if r.get("el")]
    s = w = 0
    for r in E:
        if r.get("inc") in cr: k = Wt[r.get("crit") or "Important"]; s += k * cr[r["inc"]]; w += k
    sc = s / w * 100 if w else None
    got = stat(pg, ".qa-stat", "Weighted completeness")
    if sc is None: check("score", got, "—")
    else: check("weighted completeness %", num(got), round(sc, 1), 0.05)
    full = sum(1 for r in E if r.get("inc") == "Yes, fully"); na = sum(1 for r in E if r.get("inc") == "Not applicable")
    check("fully covered / applicable", stat(pg, ".qa-stat", "Elements fully"), f"{full} / {len(E) - na}")
    cg = sum(1 for r in E if (r.get("crit") or "Important") == "Critical" and r.get("inc") not in ("Yes, fully", "Not applicable"))
    check("critical gaps", int(stat(pg, ".qa-stat", "Critical elements")), cg)
    thr = float(st["f"].get("thr") or 90); unrev = sum(1 for r in E if not r.get("inc"))
    ready = bool(E) and cg == 0 and unrev == 0 and sc is not None and sc >= thr
    check("status not 'Not ready' iff ready", stat(pg, ".qa-stat", "Status") != "Not ready", ready)
    return sc

QA_CASE = {"f": {"thr": "80"}, "g": {"e": [
    {"el": "A", "crit": "Critical", "inc": "Yes, fully"}, {"el": "B", "crit": "Critical", "inc": "Not applicable"},
    {"el": "C", "crit": "Important", "inc": "Partly"}, {"el": "D", "crit": "Standard", "inc": "No"},
    {"el": "E", "crit": "Important", "inc": "Yes, fully"}], "a": [{}]}}
# by hand: (3*1 + 2*0.5 + 1*0 + 2*1) / (3+2+1+2) = 6/8 = 75.0%  -> below 80, not ready

# ------------------------------------------------------------ onboarding
def test_ob(pg, label, state=None):
    print(f"supplier-onboarding-checklist: {label}")
    st = load(pg, "supplier-onboarding-checklist", state)
    R = [r for r in st["g"]["k"] if r.get("it") and (r.get("req") or "Required") == "Required"]
    done = [r for r in R if r.get("st") == "Done"]; G = [r for r in R if r.get("gate") == "Yes"]
    gd = [r for r in G if r.get("st") == "Done"]
    pct = len(done) / len(R) * 100 if R else None
    check("required done", stat(pg, ".ob-stat", "Required items"), f"{len(done)} / {len(R)}" + (f" ({pct:.0f}%)" if pct is not None else ""))
    check("gate done", stat(pg, ".ob-stat", "Gate items"), f"{len(gd)} / {len(G)}")
    check("blocked", int(stat(pg, ".ob-stat", "Blocked")), sum(1 for r in R if r.get("st") == "Blocked"))
    check("past due", int(stat(pg, ".ob-stat", "Past due")), sum(1 for r in R if r.get("due") and r["due"] < TODAY and r.get("st") != "Done"))
    ship = st["f"].get("ship")
    if ship:
        dd = (datetime.date.fromisoformat(ship) - datetime.date.fromisoformat(TODAY)).days
        check("days to first shipment", int(stat(pg, ".ob-stat", "Days to")), dd)
    check("ready", stat(pg, ".ob-stat", "For first"), "Ready" if G and len(gd) == len(G) else "Not ready")

OB_CASE = {"f": {"ship": "2030-01-15"}, "g": {"c": [{}], "m": [{}], "k": [
    {"it": "a", "gate": "Yes", "st": "Done"}, {"it": "b", "gate": "Yes", "st": "Done"},
    {"it": "c", "gate": "No", "st": "Blocked", "due": "2020-01-01"}, {"it": "d", "gate": "No", "req": "Not applicable", "st": "Not started"},
    {"it": "e", "gate": "No", "st": "In progress", "due": "2020-02-01"}]}}

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    ctx.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    pg = ctx.new_page()
    test_makebuy(pg, "worked example", expect_be=9609.47)
    test_makebuy(pg, "one-time spread over 3 years, excluded row", CASE_NEAR, expect_be=5306.12)
    test_makebuy(pg, "planned volume 9% above break-even", CASE_CLOSE, expect_be=5306.12)
    test_makebuy(pg, "buy cheaper at every volume", CASE_NONE)
    test_makebuy(pg, "equal unit costs", CASE_EQ)
    test_qa(pg, "worked example")
    sc = test_qa(pg, "hand case", QA_CASE); check("hand value 75.0%", round(sc, 1), 75.0)
    test_ob(pg, "worked example")
    test_ob(pg, "hand case", OB_CASE)
    b.close()
print(f"\n{NCHK[0]} checks, {len(FAIL)} failed")
print("ALL CHECKS PASSED" if not FAIL else "FAILED: " + ", ".join(FAIL))
sys.exit(1 if FAIL else 0)
