#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b9 tools (Oct 2026):
shelf-life-accelerated-aging, alert-action-levels,
complaint-reportability-decision-guide, lot-traceability-genealogy.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with an
implementation written here: hand formulas and scipy.constants for aging,
numpy percentiles and scipy.stats (poisson, nbinom, binom, norm) for the
alert and action levels, numpy.busday_offset for report due dates, and a
plain breadth-first search for the genealogy traces.

Run: python3 tests/test_b9_numbers.py <out root>    (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re, datetime
import numpy as np
from scipy import stats, constants
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b9"
FAIL = []
def check(name, got, want, tol):
    ok = abs(got - want) <= tol
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)
def same(name, got, want):
    ok = got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").replace("×", "").strip()
    m = re.match(r"^-?[\d.]+", s)
    return float(m.group(0))

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

def load(pg, slug, state=None):
    pg.goto(f"http://127.0.0.1:{port}/tools/{slug}.html")
    if state is not None:
        state = dict(state, v=1, tool=slug); state.setdefault("x", {}); state.setdefault("g", {}); state.setdefault("f", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)

def stats_of(pg, sel):
    return [(d.locator("span").inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]
def stat(pg, sel, label_start):
    for lab, val in stats_of(pg, sel):
        if lab.upper().startswith(label_start.upper()): return val
    raise KeyError(label_start)
def flags(pg): return pg.locator(".flag").all_inner_texts()

# ---------------------------------------------------------------- accelerated aging
KB = constants.k / constants.e      # Boltzmann constant in eV/K, from CODATA
DAYS = {"Years": 365.0, "Months": 365.0 / 12, "Weeks": 7.0, "Days": 1.0}
def aaf(model, q10, ea, trt, taa):
    if model == "A": return math.exp(ea / KB * (1 / (trt + 273.15) - 1 / (taa + 273.15)))
    return q10 ** ((taa - trt) / 10)
def temp_for(model, q10, ea, trt, need):
    # solve aaf(T) = need numerically (bisection), independent of the page's closed form
    lo, hi = trt, trt + 400
    for _ in range(200):
        mid = (lo + hi) / 2
        if aaf(model, q10, ea, trt, mid) < need: lo = mid
        else: hi = mid
    return (lo + hi) / 2

def test_aging(pg, f):
    slug = "shelf-life-accelerated-aging"
    load(pg, slug, None if f is None else {"f": f})
    f = f or pg.evaluate("()=>window.TOOL.example.f")
    model = "A" if "Arrhenius" in (f.get("model") or "") else "Q"
    q10 = float(f["q10"]) if f.get("q10") else None; ea = float(f["ea"]) if f.get("ea") else None
    trt, taa = float(f["trt"]), float(f["taa"])
    rt = float(f["claim"]) * DAYS[f.get("unit") or "Years"]
    a = aaf(model, q10, ea, trt, taa)
    check("AAF", num(stat(pg, ".sl-s1", "Accelerated aging factor")), a, 0.0006)
    check("aging time, days", num(stat(pg, ".sl-s1", "Accelerated aging time")), rt / a, 0.051)
    check("real time, days", num(stat(pg, ".sl-s1", "Real time")), rt, 0.051)
    if model == "A":
        check("equivalent Q10", num(stat(pg, ".sl-s1", "Equivalent Q10")), a ** (10 / (taa - trt)), 0.0006)
    if f.get("avail"):
        av = float(f["avail"])
        check("chamber temperature for available time", num(stat(pg, ".sl-s2", "Chamber temperature")), temp_for(model, q10, ea, trt, rt / av), 0.051)
        check("AAF needed", num(stat(pg, ".sl-s2", "AAF needed")), rt / av, 0.0006)
    for row in pg.locator(".sl-tab tbody tr").all():
        c = [x.inner_text() for x in row.locator("td").all()]; t = float(c[0]); a2 = aaf(model, q10, ea, trt, t)
        check(f"table {t:g} C AAF", num(c[1]), a2, 0.0006)
        check(f"table {t:g} C days", num(c[2]), rt / a2, 0.051)
    return flags(pg)

# ---------------------------------------------------------------- alert and action levels
def levels(x, pa, pc, ka, kc):
    x = np.asarray(x, float); m = x.mean(); v = x.var(ddof=1); s = math.sqrt(v)
    out = {"Percentile": (np.percentile(x, pa), np.percentile(x, pc)),
           "Mean": (m + ka * s, m + kc * s)}
    if np.all(x == np.round(x)) and np.all(x >= 0):
        out["Poisson"] = (stats.poisson.ppf(pa / 100, m), stats.poisson.ppf(pc / 100, m)) if m > 0 else (0.0, 0.0)
        if v > m:
            r = m * m / (v - m); p = m / v
            out["Negative"] = (stats.nbinom.ppf(pa / 100, r, p), stats.nbinom.ppf(pc / 100, r, p))
        else:
            out["Negative"] = out["Poisson"]
    return out, m, s, v

def test_levels(pg, state, method_key, nominal_tail):
    slug = "alert-action-levels"
    load(pg, slug, state)
    st = state or pg.evaluate("()=>window.TOOL.example")
    f = st["f"]; x = [float(t) for t in re.split(r"[\s,;]+", f["hist"]) if t]
    pa, pc = float(f.get("pa") or 95), float(f.get("pc") or 99); ka, kc = float(f.get("ka") or 2), float(f.get("kc") or 3)
    L, m, s, v = levels(x, pa, pc, ka, kc)
    check("n", num(stat(pg, ".aa-stat", "Historical")), len(x), 0)
    check("mean", num(stat(pg, ".aa-stat", "Mean")), m, 0.0006)
    check("sd", num(stat(pg, ".aa-stat", "Std dev")), s, 0.0006)
    rows = {r.locator("td").first.inner_text().split()[0]: [c.inner_text() for c in r.locator("td").all()] for r in pg.locator(".aa-tab tbody tr").all()}
    same("methods listed", sorted(rows), sorted(L))
    for k, (a, c) in L.items():
        row = rows[k]
        check(f"{k} alert", num(row[1]), a, 0.006)
        check(f"{k} action", num(row[2]), c, 0.006)
        xs = np.asarray(x)
        check(f"{k} history over alert %", num(row[-3]), 100 * np.mean(xs > a), 0.051)
        check(f"{k} history over action %", num(row[-2]), 100 * np.mean(xs > c), 0.051)
    a, c = L[method_key]
    new = [float(r["v"]) for r in st["g"].get("n", []) if r.get("v") not in (None, "")]
    if new:
        nx = sum(1 for y in new if y > a); nc = sum(1 for y in new if y > c)
        check("alert excursions", num(stat(pg, ".aa-ns", "Alert excursions")), nx - nc, 0)
        check("action excursions", num(stat(pg, ".aa-ns", "Action excursions")), nc, 0)
        p0 = nominal_tail
        check("expected share over alert %", num(stat(pg, ".aa-ns", "Expected share")), 100 * p0, 0.051)
        check("binomial P(this many or more)", num(stat(pg, ".aa-ns", "P(this many")), stats.binom.sf(nx - 1, len(new), p0) if nx > 0 else 1.0, 0.00006)
        status = [t.strip() for t in pg.locator('table[data-grid="n"] td[data-c="st"]').all_inner_texts() if t.strip()]
        want = ["ACTION" if y > c else "ALERT" if y > a else "OK" for y in new]
        same("row status", status, want)
    return flags(pg)

# ---------------------------------------------------------------- complaint reportability
def fdate(iso):
    d = datetime.date.fromisoformat(iso); return d.strftime("%b ") + str(d.day) + d.strftime(", %Y")

def test_complaint(pg, f, want_us, want_due=None, rates=None):
    slug = "complaint-reportability-decision-guide"
    load(pg, slug, None if f is None else {"f": f})
    f = f or pg.evaluate("()=>window.TOOL.example.f")
    same("US decision", stat(pg, ".cr-stat", "US medical device report"), want_us)
    if want_due is not None:
        same("US due date", stat(pg, ".cr-stat", "US report due"), fdate(want_due))
    if rates:
        n1, u1, n0, u0 = rates
        check("rate per 1000, last 12 months", num(stat(pg, ".cr-tr", "Per 1,000 units, last")), 1000 * n1 / u1, 0.0006)
        check("rate per 1000, prior 12 months", num(stat(pg, ".cr-tr", "Per 1,000 units, prior")), 1000 * n0 / u0, 0.0006)
        check("ratio", num(stat(pg, ".cr-tr", "Ratio")), (n1 / u1) / (n0 / u0), 0.006)
    return flags(pg)

# ---------------------------------------------------------------- genealogy
def bfs(links, start, fwd=True):
    seen = {start: 0}; q = [start]
    while q:
        c = q.pop(0)
        for l in links:
            a, b = (l["from"], l["into"]) if fwd else (l["into"], l["from"])
            if a == c and b not in seen: seen[b] = seen[c] + 1; q.append(b)
    return seen

def test_trace(pg, state):
    slug = "lot-traceability-genealogy"
    load(pg, slug, state)
    st = state or pg.evaluate("()=>window.TOOL.example")
    links = [l for l in st["g"]["l"] if l.get("from") and l.get("into")]
    typ = {l["into"]: l.get("type") for l in links}
    fid, bid = st["f"]["fwd"], st["f"]["bwd"]
    F = bfs(links, fid, True); aff = [k for k in F if k != fid]
    ships = [k for k in aff if typ.get(k) == "Shipment"]
    cust = {}; units = 0
    for l in links:
        if l["into"] in ships and l["from"] in F:
            cust.setdefault(l.get("cust"), 0); cust[l.get("cust")] += float(l["qty"]); units += float(l["qty"])
    check("lots and serials reached", num(stat(pg, ".lt-fs", "Lots and serials")), len([k for k in aff if typ.get(k) != "Shipment"]), 0)
    check("shipments", num(stat(pg, ".lt-fs", "Shipments")), len(ships), 0)
    check("customers", num(stat(pg, ".lt-fs", "Customers")), len(cust), 0)
    check("units shipped", num(stat(pg, ".lt-fs", "Units")), units, 0)
    page_c = {r.locator("td").nth(0).inner_text(): num(r.locator("td").nth(3).inner_text()) for r in pg.locator(".lt-cust tbody tr").all()}
    same("customer units", page_c, cust)
    page_f = {r.locator("td").nth(1).inner_text(): int(num(r.locator("td").nth(0).inner_text())) for r in pg.locator(".lt-fwd tbody tr").all()}
    same("forward trace with steps", page_f, {k: F[k] for k in aff})
    B = bfs(links, bid, False); anc = {k: B[k] for k in B if k != bid}
    page_b = {r.locator("td").nth(1).inner_text(): int(num(r.locator("td").nth(0).inner_text())) for r in pg.locator(".lt-bwd tbody tr").all()}
    same("backward trace with levels", page_b, anc)
    comps = [k for k in anc if k not in typ]
    check("component lots", num(stat(pg, ".lt-bs", "Component")), len(comps), 0)
    return flags(pg)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())

    print("== aging, worked example (3 years, Q10 2, 25 -> 55 C; hand value AAF 8, 136.9 days)")
    test_aging(pg, None)
    check("hand calc: 1095/8", 1095 / 8, 136.875, 1e-9)
    print("== aging, ASTM F1980-style hand case: 1 year, 25 -> 55 C, Q10 2 = 45.6 days")
    test_aging(pg, {"claim": "1", "unit": "Years", "trt": "25", "model": "Q10 (ASTM F1980)", "q10": "2", "taa": "55"})
    check("hand calc: 365/8", 365 / 8, 45.625, 1e-9)
    print("== aging, Q10 2.5, 18 months, 22 -> 50 C, 60 days available")
    fl = test_aging(pg, {"claim": "18", "unit": "Months", "trt": "22", "model": "Q10 (ASTM F1980)", "q10": "2.5", "taa": "50", "avail": "60"})
    same("warns on Q10 above 2", any("above the conventional 2.0" in x for x in fl), True)
    print("== aging, Arrhenius Ea 0.7 eV, 2 years, 25 -> 50 C, 90 days available")
    test_aging(pg, {"claim": "2", "unit": "Years", "trt": "25", "model": "Arrhenius (activation energy)", "ea": "0.7", "taa": "50", "avail": "90"})
    print("== aging, 70 C and a 65 C material limit (warnings)")
    fl = test_aging(pg, {"claim": "5", "unit": "Years", "trt": "25", "model": "Q10 (ASTM F1980)", "q10": "2", "taa": "70", "tmax": "65"})
    same("warns above 60 C", any("above 60" in x for x in fl), True)
    same("warns at material limit", any("material limit" in x for x in fl), True)

    print("== alert/action levels, worked example (negative binomial)")
    test_levels(pg, None, "Negative", 0.05)
    rng = np.random.default_rng(2026)
    big = rng.negative_binomial(3, 3 / (3 + 18), 120).tolist()
    newb = [{"v": str(v)} for v in rng.negative_binomial(3, 3 / (3 + 25), 25).tolist()]
    print("== levels, 120 overdispersed counts, mean about 18, Poisson chosen, 99/99.9")
    fl = test_levels(pg, {"f": {"kind": "Counts (whole numbers)", "method": "Poisson (counts)", "pa": "99", "pc": "99.9",
                                "hist": " ".join(map(str, big))}, "g": {"n": newb}}, "Poisson", 0.01)
    same("warns Poisson too tight", any("too tight" in x for x in fl), True)
    meas = np.round(rng.normal(7.2, 0.15, 48), 3).tolist()
    newm = [{"v": str(v)} for v in [7.1, 7.3, 7.55, 7.62, 7.2, 7.71, 7.4]]
    print("== levels, 48 measurements (pH), mean + k SD chosen, k 2 and 3")
    test_levels(pg, {"f": {"kind": "Measurements", "method": "Mean + k SD (normal)", "ka": "2", "kc": "3",
                           "hist": " ".join(map(str, meas))}, "g": {"n": newm}}, "Mean", float(stats.norm.sf(2)))
    print("== levels, percentile chosen, 90/97.5, small counts")
    sm = [0, 0, 1, 0, 2, 0, 0, 0, 1, 0, 3, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 1]
    test_levels(pg, {"f": {"kind": "Counts (whole numbers)", "method": "Percentile (empirical)", "pa": "90", "pc": "97.5",
                           "hist": " ".join(map(str, sm))}, "g": {"n": [{"v": "0"}, {"v": "2"}, {"v": "3"}, {"v": "1"}, {"v": "5"}]}}, "Percentile", 0.10)
    print("== levels, all-zero history (edge)")
    fl = test_levels(pg, {"f": {"kind": "Counts (whole numbers)", "method": "Poisson (counts)", "hist": " ".join(["0"] * 40)},
                          "g": {"n": [{"v": "0"}, {"v": "1"}]}}, "Poisson", 0.05)
    same("notes all-zero history", any("Every historical result is zero" in x for x in fl), True)

    print("== complaint, worked example: malfunction, 30-day, aware Mon 14 Sep 2026")
    test_complaint(pg, None, "Reportable, 30-day", "2026-10-14", rates=(7, 5200, 3, 4900))
    aw = "2026-10-08"   # a Thursday
    due5 = str(np.busday_offset(aw, 5, roll="forward"))
    print(f"== complaint, 5-day report, aware Thu 8 Oct 2026 (numpy busday: {due5})")
    test_complaint(pg, {"cpl": "Yes", "dsi": "Serious injury", "cc": "Yes", "rem": "Yes", "us": "Yes", "aware": aw}, "Reportable, 5-day", due5)
    aw = "2026-12-20"
    print("== complaint, death, cause cannot be ruled out, aware 20 Dec (crosses year end)")
    test_complaint(pg, {"cpl": "Yes", "dsi": "Death", "cc": "Cannot rule out", "us": "Yes", "aware": aw}, "Reportable, 30-day",
                   str(datetime.date.fromisoformat(aw) + datetime.timedelta(days=30)))
    aw = "2026-10-30"   # a Friday
    print(f"== complaint, 5-day from a Friday (numpy busday: {np.busday_offset(aw, 5, roll='forward')})")
    test_complaint(pg, {"cpl": "Yes", "dsi": "No", "mal": "Yes", "rec": "Yes", "rem": "Yes", "us": "Yes", "aware": aw}, "Reportable, 5-day", str(np.busday_offset(aw, 5, roll="forward")))
    print("== complaint, malfunction not likely to cause harm: not reportable")
    fl = test_complaint(pg, {"cpl": "Yes", "dsi": "No", "mal": "Yes", "rec": "No", "us": "Yes"}, "Not reportable")
    same("asks for rationale", any("No rationale recorded" in x for x in fl), True)
    print("== complaint, open question")
    fl = test_complaint(pg, {"cpl": "Yes", "dsi": "Not known yet", "us": "Yes", "aware": "2026-10-01"}, "Decision open")
    same("open question flagged", any("Question 2 is still open" in x for x in fl), True)

    print("== genealogy, worked example"); test_trace(pg, None)
    print("== genealogy, serial level with a subassembly inside a subassembly")
    test_trace(pg, {"f": {"fwd": "R-9", "bwd": "SN-3"}, "g": {"l": [
        {"from": "R-9", "part": "Resin", "into": "M-1", "type": "Subassembly lot", "qty": "5"},
        {"from": "R-8", "part": "Resin", "into": "M-2", "type": "Subassembly lot", "qty": "5"},
        {"from": "M-1", "part": "Molded housing", "into": "H-1", "type": "Subassembly lot", "qty": "50"},
        {"from": "M-2", "part": "Molded housing", "into": "H-2", "type": "Subassembly lot", "qty": "50"},
        {"from": "K-4", "part": "Keypad", "into": "H-1", "type": "Subassembly lot", "qty": "50"},
        {"from": "K-4", "part": "Keypad", "into": "H-2", "type": "Subassembly lot", "qty": "50"},
        {"from": "H-1", "part": "Housing assembly", "into": "SN-1", "type": "Serial number", "qty": "1"},
        {"from": "H-1", "part": "Housing assembly", "into": "SN-2", "type": "Serial number", "qty": "1"},
        {"from": "H-2", "part": "Housing assembly", "into": "SN-3", "type": "Serial number", "qty": "1"},
        {"from": "SN-1", "part": "Meter", "into": "S-1", "type": "Shipment", "qty": "1", "cust": "Customer A"},
        {"from": "SN-2", "part": "Meter", "into": "S-2", "type": "Shipment", "qty": "1", "cust": "Customer B"},
        {"from": "SN-3", "part": "Meter", "into": "S-2", "type": "Shipment", "qty": "1", "cust": "Customer B"}]}})
    b.close()
print("\nFAILED: " + ", ".join(FAIL) if FAIL else "\nALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
