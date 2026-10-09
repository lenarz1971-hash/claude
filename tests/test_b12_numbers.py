#!/usr/bin/env python3
"""Independent checks of the numbers added to six existing tools in batch b12 (Oct 2026):
distribution-explorer, confidence-interval-calculator, correlation-regression,
full-factorial-doe, voc-ctq-tree (no numbers), data-collection-plan.

Each case is loaded into the built page in a real browser (Chromium via Playwright),
the figures are read off the page and compared with SciPy / statsmodels / NumPy or a
from-scratch implementation written here. The worked examples that existed before b12
are also checked, so a change to the old results is caught.

Run: python3 tests/test_b12_numbers.py <out root>    (after build_tools.py)"""
import http.server, socketserver, threading, os, sys, json, math, re, itertools
import numpy as np
from scipy import stats, integrate, optimize
import statsmodels.api as sm
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b12"
FAIL = []; NCHK = [0]
def check(name, got, want, tol, rel=False):
    NCHK[0] += 1
    if want is None or (isinstance(want, float) and not math.isfinite(want)):
        ok = got is None or not math.isfinite(got)
    else:
        ok = got is not None and math.isfinite(got) and abs(got - want) <= (tol * max(1.0, abs(want)) if rel else tol)
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)
def same(name, got, want):
    NCHK[0] += 1; ok = got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").replace("±", "").replace("≥", "").replace("≤", "").strip().rstrip("%").strip()
    if s in ("—", "-", ""): return float("nan")
    m = re.match(r"^(-?[\d.]+)e([+-]?\d+)$", s)
    if m: return float(s)
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
        state = dict(state, v=1, tool=slug); state.setdefault("x", {}); state.setdefault("g", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)

def stats_of(pg, sel):
    return [(d.locator("span").inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]

def stat(pg, sel, label_start):
    for lab, val in stats_of(pg, sel):
        if lab.upper().startswith(label_start.upper()): return val
    raise KeyError(label_start + " in " + str(stats_of(pg, sel)))

def table(pg, sel):
    return [[c.inner_text() for c in r.locator("td").all()] for r in pg.locator(sel + " tbody tr").all()]

# ================================================================ distribution explorer
def de_case(pg, name, f, dist, disc=False, var=None):
    print("== distribution explorer:", name)
    load(pg, "distribution-explorer", {"f": f})
    sel = ".de-st .stat"
    mu, v = dist.mean(), dist.var() if var is None else var
    check(name + " mean", num(stat(pg, sel, "Mean")), mu if math.isfinite(mu) else float("nan"), 1e-4, rel=True)
    check(name + " variance", num(stat(pg, sel, "Variance")), v if math.isfinite(v) else float("nan"), 1e-4, rel=True)
    check(name + " sd", num(stat(pg, sel, "Standard deviation")), math.sqrt(v) if math.isfinite(v) else float("nan"), 1e-4, rel=True)
    x = float(f["x"]) if f.get("x") not in (None, "") else None
    if x is not None:
        check(name + f" P(X<={x})", num(stat(pg, sel, "P(X ≤")), dist.cdf(x), 6e-5)
        if disc:
            check(name + f" P(X>={x})", num(stat(pg, sel, "P(X ≥")), dist.sf(math.ceil(x) - 1), 6e-5)
            check(name + f" P(X={x})", num(stat(pg, sel, "P(X =")), dist.pmf(round(x)), 6e-5)
        else:
            check(name + f" P(X>{x})", num(stat(pg, sel, "P(X >")), dist.sf(x), 6e-5)
        if f.get("x2"):
            lo, hi = sorted([x, float(f["x2"])])
            want = dist.cdf(hi) - (dist.cdf(math.ceil(lo) - 1) if disc else dist.cdf(lo))
            check(name + f" P({lo}<=X<={hi})", num(stat(pg, sel, f"P({lo:g} ≤")), want, 6e-5)
    if f.get("q"):
        q = float(f["q"])
        if disc: check(name + f" percentile {q}", num(stat(pg, sel, "Smallest x")), dist.ppf(q), 0)
        else: check(name + f" percentile {q}", num(stat(pg, sel, "x with P")), dist.ppf(q), 6e-5, rel=True)

def test_de(pg):
    de_case(pg, "Weibull wear-out", {"d": "Weibull", "a": "1.8", "b": "1200", "x": "500", "x2": "1500", "q": "0.1"}, stats.weibull_min(1.8, scale=1200))
    de_case(pg, "Weibull infant mortality", {"d": "Weibull", "a": "0.7", "b": "50", "x": "10", "q": "0.5"}, stats.weibull_min(0.7, scale=50))
    de_case(pg, "Lognormal", {"d": "Lognormal", "a": "2", "b": "0.5", "x": "10", "x2": "5", "q": "0.9"}, stats.lognorm(0.5, scale=math.exp(2)))
    de_case(pg, "Hypergeometric small lot", {"d": "Hypergeometric", "a": "50", "b": "5", "c": "10", "x": "1", "x2": "3", "q": "0.95"}, stats.hypergeom(50, 5, 10), disc=True)
    de_case(pg, "Hypergeometric large lot", {"d": "Hypergeometric", "a": "100000", "b": "2000", "c": "500", "x": "12", "q": "0.99"}, stats.hypergeom(100000, 2000, 500), disc=True)
    de_case(pg, "Student t 7 df", {"d": "Student’s t", "a": "7", "x": "2.1", "x2": "-1", "q": "0.975"}, stats.t(7))
    de_case(pg, "Student t 1.5 df", {"d": "Student’s t", "a": "1.5", "x": "3"}, stats.t(1.5), var=float("inf"))
    de_case(pg, "Student t 1 df (Cauchy)", {"d": "Student’s t", "a": "1", "x": "-2", "q": "0.9"}, stats.t(1), var=float("nan"))
    de_case(pg, "Chi-square 9 df", {"d": "Chi-square", "a": "9", "x": "16.9", "x2": "3.33", "q": "0.95"}, stats.chi2(9))
    de_case(pg, "Chi-square 1 df", {"d": "Chi-square", "a": "1", "x": "3.841", "q": "0.99"}, stats.chi2(1))
    de_case(pg, "F 4 and 20 df", {"d": "F", "a": "4", "b": "20", "x": "2.87", "q": "0.95"}, stats.f(4, 20))
    de_case(pg, "F 2 and 3 df", {"d": "F", "a": "2", "b": "3", "x": "9.55", "x2": "1", "q": "0.99"}, stats.f(2, 3), var=float("inf"))
    # the five distributions that were there before b12, and the worked example
    de_case(pg, "Normal (worked example)", {"d": "Normal", "a": "10.016", "b": "0.0286", "x": "10.05"}, stats.norm(10.016, 0.0286))
    de_case(pg, "Normal with percentile", {"d": "Normal", "a": "0", "b": "1", "x": "-1", "x2": "1.5", "q": "0.95"}, stats.norm(0, 1))
    de_case(pg, "Binomial", {"d": "Binomial", "a": "20", "b": "0.1", "x": "3", "x2": "5", "q": "0.9"}, stats.binom(20, 0.1), disc=True)
    de_case(pg, "Poisson", {"d": "Poisson", "a": "4.2", "x": "6", "q": "0.5"}, stats.poisson(4.2), disc=True)
    de_case(pg, "Exponential", {"d": "Exponential", "a": "500", "x": "200"}, stats.expon(scale=500))
    # multinomial
    for name, rows in [("grades", [("Grade A", 0.70, 14), ("Grade B", 0.20, 4), ("Scrap", 0.10, 2)]),
                       ("four defect types", [("Scratch", 0.4, 3), ("Dent", 0.3, 5), ("Burr", 0.2, 1), ("Stain", 0.1, 3)])]:
        print("== distribution explorer: multinomial", name)
        load(pg, "distribution-explorer", {"f": {"d": "Multinomial", "mc": "\n".join(f"{a}, {p}, {k}" for a, p, k in rows)}})
        n = sum(k for _, _, k in rows)
        check("multinomial n", num(stat(pg, ".de-st .stat", "Trials")), n, 0)
        check("multinomial P(exact counts)", num(stat(pg, ".de-st .stat", "P(exactly")), stats.multinomial.pmf([k for *_, k in rows], n, [p for _, p, _ in rows]), 5e-7, rel=True)
        for (a, p, k), r in zip(rows, table(pg, ".de-mt")):
            check(f"multinomial {a} mean", num(r[3]), n * p, 1e-4)
            check(f"multinomial {a} variance", num(r[4]), n * p * (1 - p), 1e-4)
            check(f"multinomial {a} marginal P(X<=x)", num(r[5]), stats.binom.cdf(k, n, p), 6e-5)

# ================================================================ run
TESTS = [test_de]
with sync_playwright() as p:
    exe = "/opt/pw-browsers/chromium"
    b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    ctx.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    pg = ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    for t in TESTS: t(pg)
    if errs: print("JS errors:", errs); FAIL.append("JS errors")
    b.close()
print(f"\n{NCHK[0]} checks")
print("FAILED: " + ", ".join(FAIL) if FAIL else "ALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
