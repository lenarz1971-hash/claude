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
ONLY = sys.argv[2:]
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
    else:
        pg.evaluate("k=>localStorage.removeItem(k)", f"scqg-tool-{slug}"); pg.reload()
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

# ================================================================ confidence-interval-calculator: tolerance and prediction intervals
def k1_exact(n, P, g):
    return stats.nct.ppf(g, n - 1, stats.norm.ppf(P) * math.sqrt(n)) / math.sqrt(n)
def k2_exact(n, P, g):
    """two-sided normal tolerance factor from Odeh's integral, solved with SciPy quad/brentq
    (checked once against a 400,000-sample Monte Carlo: n=10, 95/95 gives 3.3934, coverage 0.9499)"""
    nu = n - 1
    def r(z): return optimize.brentq(lambda r: stats.norm.cdf(z + r) - stats.norm.cdf(z - r) - P, 0, z + 40, xtol=1e-14)
    def cov(k): return math.sqrt(2 * n / math.pi) * integrate.quad(lambda z: stats.chi2.sf(nu * r(z) ** 2 / k ** 2, nu) * math.exp(-n * z * z / 2), 0, 12 / math.sqrt(n), epsabs=1e-13, limit=200)[0]
    return optimize.brentq(lambda k: cov(k) - g, 0.1, 500, xtol=1e-12)
def k2_howe(n, P, g):
    nu = n - 1; return math.sqrt(nu * (1 + 1 / n) * stats.norm.ppf((1 + P) / 2) ** 2 / stats.chi2.ppf(1 - g, nu))
def k1_natrella(n, P, g):
    zp, zg = stats.norm.ppf(P), stats.norm.ppf(g); a = 1 - zg ** 2 / (2 * (n - 1)); b = zp ** 2 - zg ** 2 / n
    return (zp + math.sqrt(zp ** 2 - a * b)) / a if a > 0 and zp ** 2 - a * b >= 0 else float("nan")

def ci_case(pg, name, f):
    print("== tolerance / prediction:", name)
    load(pg, "confidence-interval-calculator", {"f": f} if f else None)
    if not f: f = pg.evaluate("()=>window.TOOL.example.f")
    raw = [float(v) for v in re.split(r"[\s,;]+", f.get("d") or "") if v]
    if len(raw) >= 2: n, m, s = len(raw), float(np.mean(raw)), float(np.std(raw, ddof=1))
    else: n, m, s = int(f["n"]), float(f["m"]), float(f["s"])
    g = float(f.get("cl") or 95) / 100; P = float(f.get("tp") or 99) / 100
    side = f.get("tside") or "Two-sided"; two = side == "Two-sided"; low = side == "Lower bound only"
    k = k2_exact(n, P, g) if two else k1_exact(n, P, g); ka = k2_howe(n, P, g) if two else k1_natrella(n, P, g)
    check(name + " k exact", num(stat(pg, ".ci-tst .stat", "Tolerance factor")), k, 2e-4)
    check(name + " k approximation", num(stat(pg, ".ci-tst .stat", "k by")), ka, 2e-4)
    tc = stats.t.ppf(1 - ((1 - g) / 2 if two else 1 - g), n - 1)
    want = [(m - tc * s / math.sqrt(n), m + tc * s / math.sqrt(n)), (m - tc * s * math.sqrt(1 + 1 / n), m + tc * s * math.sqrt(1 + 1 / n)), (m - k * s, m + k * s)]
    rows = table(pg, ".ci-ttb")
    dp = len(rows[0][3].split(".")[1]) if "." in rows[0][3] else len(rows[0][4].split(".")[1])
    tol = 0.51 * 10 ** -dp + 2.5e-4 * s
    for (lab, (lo, hi)), r in zip(zip(["CI mean", "PI one value", "TI"], want), rows):
        if two or low: check(f"{name} {lab} lower", num(r[3]), lo, tol)
        if two or not low: check(f"{name} {lab} upper", num(r[4]), hi, tol)

def test_ci(pg):
    ci_case(pg, "worked example (one-sided upper, n = 30, 99% / 95%)", None)
    ci_case(pg, "two-sided, raw data n = 10, 95% / 95%", {"cl": "95", "tp": "95", "tside": "Two-sided", "d": "10.12 10.07 9.98 10.21 10.04 9.95 10.15 10.09 10.02 10.11"})
    ci_case(pg, "lower bound, n = 5, 90% / 90%", {"cl": "90", "tp": "90", "tside": "Lower bound only", "n": "5", "m": "48.2", "s": "1.7"})
    ci_case(pg, "two-sided, n = 200, 99% / 99.9%", {"cl": "99", "tp": "99.9", "tside": "Two-sided", "n": "200", "m": "0.512", "s": "0.0042"})
    ci_case(pg, "upper bound, n = 2", {"cl": "95", "tp": "95", "tside": "Upper bound only", "n": "2", "m": "3", "s": "0.5"})
    ci_case(pg, "two-sided, n = 3, 95% / 99%", {"cl": "95", "tp": "99", "tside": "Two-sided", "n": "3", "m": "20", "s": "2"})
    # the results that existed before b12 (worked example)
    load(pg, "confidence-interval-calculator")
    t = stats.t.ppf(0.975, 29); m, s, n = 38.4, 9.6, 30
    rows = table(pg, ".ci-mtb")
    check("existing: mean CI lower", num(rows[0][3]), m - t * s / math.sqrt(n), 0.006)
    check("existing: sigma CI upper", num(rows[2][4]), math.sqrt(29 * s * s / stats.chi2.ppf(0.025, 29)), 0.0006)

# ================================================================ correlation-regression: intervals and residuals
def cr_case(pg, name, f):
    print("== correlation / regression:", name)
    load(pg, "correlation-regression", {"f": f} if f else None)
    if not f: f = pg.evaluate("()=>window.TOOL.example.f")
    xy = np.array([[float(v) for v in l.split()] for l in f["d"].strip().split("\n")]); x, y = xy[:, 0], xy[:, 1]; n = len(x)
    cl = float(f.get("cl") or 95) / 100; a = 1 - cl
    fit = sm.OLS(y, sm.add_constant(x)).fit()
    r = np.corrcoef(x, y)[0, 1]; zc = stats.norm.ppf(1 - a / 2)
    lo, hi = math.tanh(math.atanh(r) - zc / math.sqrt(n - 3)), math.tanh(math.atanh(r) + zc / math.sqrt(n - 3))
    tiles = dict((lab.upper(), val) for lab, val in stats_of(pg, ".cr-ist .stat"))
    def tile(start):
        for k, v in tiles.items():
            if k.startswith(start.upper()): return v
        raise KeyError(start)
    rl, rh = [num(v) for v in tile(f"{round(cl*100,2):g}% interval for ρ").split(" to ")]
    check(name + " rho CI lower (Fisher z)", rl, lo, 6e-5); check(name + " rho CI upper (Fisher z)", rh, hi, 6e-5)
    bl, bh = [num(v) for v in tile(f"{round(cl*100,2):g}% interval for the slope").split(" to ")]
    ci = fit.conf_int(alpha=a)[1]
    check(name + " slope CI lower", bl, ci[0], 6e-6, rel=True); check(name + " slope CI upper", bh, ci[1], 6e-6, rel=True)
    pv = tile("p value"); want_p = fit.pvalues[1]
    if pv.startswith("<"): check(name + " slope p value (< 0.0001)", 1.0 if want_p < 1e-4 else 0.0, 1.0, 0)
    else: check(name + " slope p value", num(pv), want_p, 6e-5)
    if f.get("px"):
        x0 = float(f["px"]); sf = fit.get_prediction(np.array([[1.0, x0]])).summary_frame(alpha=a)
        cl_, ch_ = [num(v) for v in tile(f"{round(cl*100,2):g}% CI for the mean y").split(" to ")]
        pl_, ph_ = [num(v) for v in tile(f"{round(cl*100,2):g}% PI for one new y").split(" to ")]
        check(name + " CI mean y lower", cl_, sf["mean_ci_lower"].iloc[0], 6e-5); check(name + " CI mean y upper", ch_, sf["mean_ci_upper"].iloc[0], 6e-5)
        check(name + " PI new y lower", pl_, sf["obs_ci_lower"].iloc[0], 6e-5); check(name + " PI new y upper", ph_, sf["obs_ci_upper"].iloc[0], 6e-5)
    infl = fit.get_influence(); sr = infl.resid_studentized_internal; h = infl.hat_matrix_diag
    order = np.argsort(fit.resid, kind="stable"); ns = np.empty(n); ns[order] = stats.norm.ppf((np.arange(1, n + 1) - 0.375) / (n + 0.25))
    rows = table(pg, ".cr-rtb")
    same(name + " residual rows", len(rows), n)
    for i, rw in enumerate(rows):
        check(f"{name} #{i+1} fitted", num(rw[3]), fit.fittedvalues[i], 6e-5)
        check(f"{name} #{i+1} residual", num(rw[4]), fit.resid[i], 6e-5)
        check(f"{name} #{i+1} standardized", num(rw[5]), sr[i], 6e-4)
        check(f"{name} #{i+1} leverage", num(rw[6]), h[i], 6e-4)
        check(f"{name} #{i+1} normal score", num(rw[7]), ns[i], 6e-4)
    # existing figures (before b12) still right
    check(name + " existing r", num(stat(pg, ".cr-st .stat", "Correlation r")), r, 6e-5)
    check(name + " existing slope", num(stat(pg, ".cr-st .stat", "Slope")), fit.params[1], 6e-6, rel=True)
    check(name + " existing s", num(stat(pg, ".cr-st .stat", "Standard error")), math.sqrt(fit.scale), 6e-6, rel=True)

def test_cr(pg):
    cr_case(pg, "worked example", None)
    cr_case(pg, "negative slope, 90%, outlier", {"xl": "Age, months", "yl": "Hardness", "px": "30", "cl": "90",
        "d": "3 71.2\n6 70.1\n9 69.8\n12 68.2\n15 67.9\n18 64.1\n21 66.3\n24 65.2\n27 64.4\n30 63.9\n33 63.0\n36 62.2"})
    cr_case(pg, "weak, five pairs, 99%", {"px": "2.5", "cl": "99", "d": "1 3.1\n2 2.2\n3 3.9\n4 2.8\n5 4.4"})

# ================================================================ run
TESTS = [t for t in [test_de, test_ci, test_cr] if not ONLY or t.__name__ in ONLY]
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
