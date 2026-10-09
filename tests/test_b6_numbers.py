#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b6 tools (Oct 2026):
attribute-agreement-analysis, taguchi-loss-function, variables-sampling-plan,
probability-plot-stem-leaf-dot-plot, time-series-moving-average.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with
independent code: statsmodels (fleiss_kappa, cohens_kappa, normal_ad,
seasonal_decompose), SciPy (beta, norm, nct, linregress), NumPy and pandas.
The variables-plan estimator is also checked for unbiasedness by simulation.

Run: python3 tests/test_b6_numbers.py <out root>   (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re
import numpy as np, pandas as pd
from scipy import stats
from scipy.optimize import brentq
from statsmodels.stats.inter_rater import fleiss_kappa, cohens_kappa
from statsmodels.stats.diagnostic import normal_ad
from statsmodels.tsa.seasonal import seasonal_decompose
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b6"
FAIL = []; NCHK = [0]
def check(name, got, want, tol):
    NCHK[0] += 1
    ok = (got is not None and want is not None and abs(got - want) <= tol) or (got is None and want is None)
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)
def dtol(s):
    """half a unit in the last digit shown on the page"""
    m = re.search(r"\.(\d+)", s.replace(",", "")); return 0.5 * 10 ** -(len(m.group(1)) if m else 0) + 1e-12
def same(name, got, want):
    NCHK[0] += 1; ok = got == want
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").replace("$", "").replace("dB", "").strip().rstrip("%").strip()
    if s in ("", "—"): return None
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
    pg.wait_for_timeout(300)
    return state if state is not None else pg.evaluate("()=>JSON.parse(JSON.stringify(window.TOOL.example))")

def stats_of(pg, sel):
    return [(d.locator("span").last.inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]
def stat(pg, sel, label_start):
    for lab, val in stats_of(pg, sel):
        if lab.upper().startswith(label_start.upper()): return val
    raise KeyError(label_start)

# ======================================================== attribute agreement
def test_aa(pg, state=None):
    slug = "attribute-agreement-analysis"; st = load(pg, slug, state)
    rows = [r for r in st["g"]["r"] if any(str(v).strip() for v in r.values())]
    used = [a for a in "abc" if any(str(r.get(a + "1", "")).strip() for r in rows)]
    m = {a: max(t for t in (1, 2, 3) if any(str(r.get(a + str(t), "")).strip() for r in rows)) for a in used}
    has_std = any(str(r.get("s", "")).strip() for r in rows)
    K = lambda v: str(v).strip().lower()
    cats = sorted({K(r[a + str(t)]) for r in rows for a in used for t in range(1, m[a] + 1)} | ({K(r["s"]) for r in rows} if has_std else set()))
    N = len(rows)
    def cp(x):
        lo = 0.0 if x == 0 else stats.beta.ppf(0.025, x, N - x + 1)
        hi = 1.0 if x == N else stats.beta.ppf(0.975, x + 1, N - x)
        return 100 * lo, 100 * hi
    def fk(lists):  # lists: per part, the ratings
        tab = np.array([[sum(1 for v in L if v == c) for c in cats] for L in lists])
        return fleiss_kappa(tab, method="fleiss")
    def ck(pairs):
        t = np.zeros((len(cats), len(cats)))
        for s_, r_ in pairs: t[cats.index(s_), cats.index(r_)] += 1
        return cohens_kappa(t).kappa, t
    page = {}
    block = None
    for tr in pg.locator(".aa-tab tbody tr").all():
        th = tr.locator("th")
        if th.count(): block = th.inner_text().upper().split(" (")[0].split(" ·")[0]; continue
        c = [x.inner_text() for x in tr.locator("td").all()]
        page[(block, c[0])] = c
    names = {"a": st["f"].get("na") or "A", "b": st["f"].get("nb") or "B", "c": st["f"].get("nc") or "C"}
    for a in used:
        R = [[K(r[a + str(t)]) for t in range(1, m[a] + 1)] for r in rows]
        within = sum(len(set(x)) == 1 for x in R)
        c = page[("WITHIN EACH APPRAISER", names[a])]
        check(f"AA {names[a]} within matched", num(c[2]), within, 0)
        check(f"AA {names[a]} within %", num(c[3]), round(100 * within / N, 1), 0.051)
        lo, hi = cp(within); cl = re.findall(r"[\d.]+", c[4])
        check(f"AA {names[a]} within CI low", float(cl[0]), lo, 0.051); check(f"AA {names[a]} within CI high", float(cl[1]), hi, 0.051)
        check(f"AA {names[a]} within Fleiss kappa", num(c[5]), fk(R), 0.0006)
        if has_std:
            S_ = [K(r["s"]) for r in rows]
            vs = sum(len(set(x)) == 1 and x[0] == s for x, s in zip(R, S_))
            c = page[("EACH APPRAISER VS STANDARD", names[a])]
            check(f"AA {names[a]} vs std matched", num(c[2]), vs, 0)
            lo, hi = cp(vs); cl = re.findall(r"[\d.]+", c[4])
            check(f"AA {names[a]} vs std CI low", float(cl[0]), lo, 0.051); check(f"AA {names[a]} vs std CI high", float(cl[1]), hi, 0.051)
            kap, tab = ck([(s, v) for x, s in zip(R, S_) for v in x])
            check(f"AA {names[a]} vs std Cohen kappa", num(c[5]), kap, 0.0006)
            check(f"AA {names[a]} mixed", num(c[6]), sum(len(set(x)) > 1 for x in R), 0)
            check(f"AA {names[a]} consistently wrong", num(c[7]), sum(len(set(x)) == 1 and x[0] != s for x, s in zip(R, S_)), 0)
    allR = [[K(r[a + str(t)]) for a in used for t in range(1, m[a] + 1)] for r in rows]
    if len(used) > 1:
        btw = sum(len(set(x)) == 1 for x in allR)
        c = page[("ALL APPRAISERS", "Between appraisers (reproducibility)")]
        check("AA between matched", num(c[2]), btw, 0)
        lo, hi = cp(btw); cl = re.findall(r"[\d.]+", c[4]); check("AA between CI low", float(cl[0]), lo, 0.051); check("AA between CI high", float(cl[1]), hi, 0.051)
        check("AA between Fleiss kappa", num(c[5]), fk(allR), 0.0006)
    if has_std:
        S_ = [K(r["s"]) for r in rows]
        al = sum(len(set(x)) == 1 and x[0] == s for x, s in zip(allR, S_))
        c = page[("ALL APPRAISERS", "All appraisers vs standard")]
        check("AA all vs std matched", num(c[2]), al, 0)
        kap, _ = ck([(s, v) for x, s in zip(allR, S_) for v in x])
        check("AA all vs std Cohen kappa", num(c[5]), kap, 0.0006)

# ======================================================== Taguchi
def test_tg(pg, state=None):
    slug = "taguchi-loss-function"; st = load(pg, slug, state); f = st["f"]
    goal = f.get("goal") or "Nominal is best"; T = float(f["T"]) if f.get("T") else None; D = float(f["D"]); A = float(f["A"])
    k = A * D * D if goal == "Larger is better" else A / D ** 2
    L = (lambda y: k * (y - T) ** 2) if goal == "Nominal is best" else (lambda y: k * y * y) if goal == "Smaller is better" else (lambda y: k / y ** 2)
    check(f"TG {goal} k", num(stat(pg, ".tg-k", "Loss constant")), k, max(1e-6, abs(k) * 1e-3))
    if f.get("y"): check(f"TG {goal} loss at y", num(stat(pg, ".tg-k", "Loss for one unit")), round(L(float(f["y"])), 2), 0.0051)
    x = np.array([float(v) for v in f["data"].split()])
    def sn(v):
        if goal == "Nominal is best": return 10 * np.log10(v.mean() ** 2 / v.var(ddof=1))
        if goal == "Smaller is better": return -10 * np.log10(np.mean(v ** 2))
        return -10 * np.log10(np.mean(1 / v ** 2))
    avg = np.mean([L(v) for v in x])
    check(f"TG {goal} mean", num(stat(pg, ".tg-avg", "Mean")), x.mean(), 1e-4 * max(1, abs(x.mean())))
    check(f"TG {goal} s", num(stat(pg, ".tg-avg", "Std dev")), x.std(ddof=1), 1e-4 * max(1, x.std()))
    check(f"TG {goal} average loss/unit", num(stat(pg, ".tg-avg", "Average loss")), round(avg, 2), 0.0051)
    if goal == "Nominal is best": check("TG decomposition k(sigma^2+(mean-T)^2)", round(k * (x.var(ddof=0) + (x.mean() - T) ** 2), 6), round(avg, 6), 1e-9)
    check(f"TG {goal} S/N", num(stat(pg, ".tg-avg", "S/N")), round(sn(x), 2), 0.0051)
    if f.get("vol"): check(f"TG {goal} annual loss", num(stat(pg, ".tg-avg", "Loss per year")), round(avg * float(f["vol"])), 1.01)
    out = sum(abs(v - T) > D for v in x) if goal == "Nominal is best" else sum(v > D for v in x) if goal == "Smaller is better" else sum(v < D for v in x)
    check(f"TG {goal} goalpost loss", num(stat(pg, ".tg-avg", "Goalpost")), round(A * out / len(x), 2), 0.0051)
    trs = pg.locator('table[data-grid="runs"] tbody tr').all()
    for r, tr in zip(st["g"].get("runs", []), trs):
        v = np.array([float(r[c]) for c in ("y1", "y2", "y3", "y4", "y5", "y6") if r.get(c, "") != ""])
        if not len(v): continue
        check(f"TG run '{r['run'][:12]}' mean", num(tr.locator('[data-c="mn"]').inner_text()), round(v.mean(), 4), 1e-4)
        check(f"TG run '{r['run'][:12]}' s", num(tr.locator('[data-c="sd"]').inner_text()), round(v.std(ddof=1), 4), 1e-4)
        check(f"TG run '{r['run'][:12]}' S/N", num(tr.locator('[data-c="sn"]').inner_text()), round(sn(v), 2), 0.0051)
        check(f"TG run '{r['run'][:12]}' avg loss", num(tr.locator('[data-c="ls"]').inner_text()), round(np.mean([L(q) for q in v]), 2), 0.0051)

# ======================================================== variables sampling
def pct(s):
    s = s.replace("<", "").strip()
    return num(s)
def test_vs(pg, state=None):
    slug = "variables-sampling-plan"; st = load(pg, slug, state); f = st["f"]
    x = np.array([float(v) for v in f["data"].split()]); n = len(x); known = f.get("sig", "").startswith("Known")
    sd = float(f["sg"]) if known else x.std(ddof=1); m = x.mean(); k = float(f["k"])
    Lo = float(f["L"]) if f.get("L") not in (None, "") else None; Up = float(f["U"]) if f.get("U") not in (None, "") else None
    tag = ("known" if known else "unknown") + (" two-sided" if Lo is not None and Up is not None else "")
    check(f"VS {tag} mean", num(stat(pg, ".vs-st", "Sample mean")), round(m, 4), 1e-4)
    if not known: check(f"VS {tag} s", num(stat(pg, ".vs-st", "Sample std")), round(sd, 4), 1e-4)
    ok = True
    def ph(Q):
        if known: return stats.norm.sf(Q * math.sqrt(n / (n - 1)))
        xx = 0.5 - 0.5 * Q * math.sqrt(n) / (n - 1)
        return 0.0 if xx <= 0 else 1.0 if xx >= 1 else stats.beta.cdf(xx, n / 2 - 1, n / 2 - 1)
    pt = 0
    for lab, Q, lim in (("QU", None if Up is None else (Up - m) / sd, "U"), ("QL", None if Lo is None else (m - Lo) / sd, "L")):
        if Q is None: continue
        check(f"VS {tag} {lab}", num(stat(pg, ".vs-st", "Q" + lab[1])), round(Q, 3), 0.0011)
        ok = ok and Q >= k
        p = ph(Q); pt += p
        got = stat(pg, ".vs-f2", "p̂" + lim)
        if "<" in got: check(f"VS {tag} Form 2 p-hat {lim} % shown as below {got}", 1.0 if 100 * p < pct(got) else 0.0, 1.0, 0)
        else: check(f"VS {tag} Form 2 p-hat {lim} %", pct(got), round(100 * p, 3 if p < 0.01 else 2), 0.0051 if p >= 0.01 else 0.00051)
    same(f"VS {tag} Form 1 decision", stat(pg, ".vs-st", "Form 1").strip(), "Accept" if ok else "Reject")
    if f.get("M"): same(f"VS {tag} Form 2 decision", stat(pg, ".vs-f2", "Form 2").strip(), "Accept" if 100 * pt <= float(f["M"]) else "Reject")
    nn = int(float(f["n"]))
    def pa(p):
        zp = stats.norm.isf(p)
        return stats.norm.cdf(math.sqrt(nn) * (zp - k)) if known else stats.nct.sf(k * math.sqrt(nn), nn - 1, zp * math.sqrt(nn))
    for lab, target in (("Beyond the limit, 95%", 0.95), ("50% chance", 0.5), ("Beyond the limit, 10%", 0.10)):
        p = brentq(lambda q: pa(q) - target, 1e-9, 0.7)
        got = pct(stat(pg, ".vs-ocs", lab))
        dec = 3 if p < 0.01 else 2
        check(f"VS {tag} OC p at Pa={target}", got, round(100 * p, dec), 0.002 * 100 * p + 10 ** -dec)

def mvue_simulation():
    """The Form 2 estimate (unknown sigma) should be unbiased for the true fraction beyond U."""
    rng = np.random.default_rng(1)
    for n, mu in ((5, -1.6), (10, -1.9), (25, -1.4)):
        x = rng.normal(mu, 1.0, size=(200000, n)); m = x.mean(1); s = x.std(1, ddof=1)
        Q = (0 - m) / s; xx = np.clip(0.5 - 0.5 * Q * math.sqrt(n) / (n - 1), 0, 1)
        est = stats.beta.cdf(xx, n / 2 - 1, n / 2 - 1).mean(); true = stats.norm.sf(-mu)
        check(f"VS simulation: unknown-sigma p-hat unbiased, n={n}", est, true, 4 * math.sqrt(true / 200000) + 2e-4)
    # and the known-sigma form
    x = rng.normal(-1.7, 1.0, size=(200000, 8)); m = x.mean(1); n = 8
    est = stats.norm.sf((0 - m) * math.sqrt(n / (n - 1))).mean()
    check("VS simulation: known-sigma p-hat unbiased, n=8", est, stats.norm.sf(1.7), 3e-4)
    # OC curve for unknown sigma by simulation against the noncentral t used above
    n, k, p = 10, 1.70, 0.04; z = stats.norm.isf(p); x = rng.normal(-z, 1.0, size=(200000, n))
    acc = (((0 - x.mean(1)) / x.std(1, ddof=1)) >= k).mean()
    check("VS simulation: OC point n=10 k=1.70 p=4%", acc, stats.nct.sf(k * math.sqrt(n), n - 1, z * math.sqrt(n)), 0.004)

# ======================================================== graphical methods
def stem_leaf_check(pg, data, lu=None):
    key = pg.locator(".gm-key").inner_text()
    u = float(re.search(r"Leaf unit = ([\d.,]+)", key).group(1).replace(",", ""))
    if lu: check("SL leaf unit as entered", u, float(lu), 0)
    lines = pg.locator(".gm-pre").inner_text().split("\n")
    vals, rows = [], []
    for ln in lines:
        d, rest = ln[:ln.index("|")].split(), ln[ln.index("|") + 1:].strip()
        depth, stem = d[0], d[1]; neg = stem.startswith("-"); sv = abs(int(stem))
        rows.append((depth, len(rest)))
        for ch in rest: vals.append((-1 if neg else 1) * (sv * 10 + int(ch)) * u)
    want = sorted(math.copysign(math.floor(abs(round(v / u, 6))), v) * u for v in data)
    NCHK[0] += 1; ok = np.allclose(sorted(vals), want, atol=u * 1e-6)
    print(f"  {'ok ' if ok else 'BAD'} SL leaves rebuild the truncated data ({len(vals)} values, leaf unit {u})")
    if not ok: FAIL.append("stem-leaf values")
    n = len(data); top = np.cumsum([c for _, c in rows]); bot = np.cumsum([c for _, c in rows][::-1])[::-1]
    exact = n % 2 == 0 and (n // 2) in top
    med = None if exact else int(np.argmax(top >= (n + 1) / 2))
    seen = False; want_d = []
    for i, (_, c) in enumerate(rows):
        if exact: want_d.append(str(bot[i] if seen else top[i])); seen = seen or top[i] == n // 2
        else: want_d.append(str(top[i]) if i < med else str(bot[i]) if i > med else f"({c})")
    same("SL depth column", [d for d, _ in rows], want_d)

def test_gm(pg, state=None, cw=None, c0=None):
    slug = "probability-plot-stem-leaf-dot-plot"; st = load(pg, slug, state); f = st["f"]
    x = np.array([float(v) for v in f["data"].split()]); n = len(x)
    sm, ss = stat(pg, ".gm-st", "Mean"), stat(pg, ".gm-st", "Std dev")
    check("GM mean", num(sm), x.mean(), dtol(sm)); check("GM s", num(ss), x.std(ddof=1), dtol(ss))
    a2, p = normal_ad(x)
    check("GM Anderson-Darling A2 (statsmodels normal_ad)", num(stat(pg, ".gm-st", "Anderson")), round(a2, 3), 0.0011)
    pv = stat(pg, ".gm-st", "p-value")
    if "<" in pv: check("GM AD p-value < 0.005", 1.0 if p < 0.005 else 0.0, 1.0, 0)
    else: check("GM AD p-value", float(pv), round(p, 3), 0.0011)
    z = stats.norm.ppf((np.arange(1, n + 1) - 0.375) / (n + 0.25))
    check("GM probability plot r (Blom scores)", num(stat(pg, ".gm-st", "Plot correlation")), round(np.corrcoef(np.sort(x), z)[0, 1], 4), 0.00011)
    stem_leaf_check(pg, x, f.get("lu"))
    # frequency table against numpy.histogram on the page's class edges
    rows = [[c.inner_text() for c in tr.locator("td").all()] for tr in pg.locator(".gm-tab tbody tr").all()]
    edges = [float(re.findall(r"-?[\d.,]+", r[0])[0].replace(",", "")) for r in rows]
    w = edges[1] - edges[0] if len(edges) > 1 else None
    edges.append(edges[-1] + (w if w else float(re.findall(r"-?[\d.,]+", rows[0][0])[1])))
    if cw: check("GM class width as entered", w, float(cw), 1e-9)
    if c0: check("GM first class start as entered", edges[0], float(c0), 1e-9)
    NCHK[0] += 1; okc = edges[0] <= x.min() and edges[-1] >= x.max()
    print(f"  {'ok ' if okc else 'BAD'} GM classes cover the data: {edges[0]}..{edges[-1]} vs {x.min()}..{x.max()}")
    if not okc: FAIL.append("classes cover")
    h, _ = np.histogram(x, bins=np.array(edges))
    same("GM class frequencies (numpy.histogram)", [int(num(r[2])) for r in rows], [int(v) for v in h])
    same("GM cumulative frequencies", [int(num(r[4])) for r in rows], [int(v) for v in np.cumsum(h)])
    cum = np.cumsum(h); j = int(np.argmax(cum >= n / 2)); F = cum[j - 1] if j else 0
    gm = edges[j] + (n / 2 - F) / h[j] * (edges[1] - edges[0])
    txt = pg.locator(".gm-cfo").inner_text()
    mm = re.search(r"w = (-?\d[\d,]*)(?:\.(\d+))?", txt); got = float((mm.group(1) + "." + (mm.group(2) or "0")).replace(",", ""))
    check("GM grouped median from the ogive", got, gm, 0.6 * 10 ** -len(mm.group(2) or "") + 1e-12)

# ======================================================== time series
def test_ts(pg, state=None):
    slug = "time-series-moving-average"; st = load(pg, slug, state); f = st["f"]
    rows = [l.split("\t") for l in f["d"].strip().split("\n")]; y = pd.Series([float(r[1]) for r in rows]); N = len(y)
    w = int(f["w"]); ctr = f.get("ctr") == "Centered"; L = int(f["L"]) if f.get("L") else 0; H = int(f.get("h") or 0)
    if ctr:
        wts = np.r_[0.5, np.ones(w - 1), 0.5] / w if w % 2 == 0 else np.ones(w) / w
        ma = pd.Series(np.convolve(y, wts, mode="same")); half = len(wts) // 2
        ma[:half] = np.nan; ma[N - half:] = np.nan
    else: ma = y.rolling(w).mean()
    seas = L >= 2 and N >= 2 * L
    if seas:
        dec = seasonal_decompose(y, model="multiplicative", period=L); S = dec.seasonal.values; de = y.values / S
    else: de = y.values
    lr = stats.linregress(np.arange(1, N + 1), de)
    tb = [[c.inner_text() for c in tr.locator("td").all()] for tr in pg.locator(".ts-tab tbody tr").all()]
    for i in range(N):
        mv = num(tb[i][3]); want = None if np.isnan(ma[i]) else round(float(ma[i]), 2)
        if i in (0, 1, w - 1, w, N - 1, N // 2) or i < 3: check(f"TS MA period {i+1}", mv, want, 0.051 if want is not None else 0)
    for i in range(N):
        check(f"TS trend fit period {i+1}", num(tb[i][4]), lr.intercept + lr.slope * (i + 1), 0.051) if i in (0, N - 1) else None
    tag = f"(N={N}, w={w}, {'centered' if ctr else 'trailing'}, L={L})"
    sl = stat(pg, ".ts-st", "Trend slope"); check(f"TS slope {tag}", num(sl), lr.slope, dtol(sl))
    check(f"TS R2 {tag}", num(stat(pg, ".ts-st", "R")), lr.rvalue ** 2, 0.0006)
    pv = stat(pg, ".ts-st", "p-value")
    if "<" in pv: check("TS slope p < 0.001", 1.0 if lr.pvalue < 0.001 else 0.0, 1.0, 0)
    else: check(f"TS slope p-value {tag}", float(pv), lr.pvalue, 0.0006)
    check(f"TS latest trailing MA {tag}", num(stat(pg, ".ts-st", "Latest")), y.rolling(w).mean().iloc[-1], 0.051)
    if seas:
        for j in range(L): check(f"TS seasonal index {j+1} (statsmodels seasonal_decompose)", num(tb[j][6]), S[j], 0.00006)
        cm = dec.trend.values
        for i in range(N):
            if i in (L // 2, N // 2): check(f"TS ratio to CMA period {i+1}", num(tb[i][5]), y[i] / cm[i], 0.00006)
        check("TS deseasonalized, last period", num(tb[N - 1][7]), de[-1], 0.051)
    for h in range(H):
        t = N + 1 + h; want = (lr.intercept + lr.slope * t) * (S[(t - 1) % L] if seas else 1)
        check(f"TS forecast +{h+1}", num(tb[N + h][2]), round(want, max(0, len(str(rows[0][1]).split('.')[1]) if '.' in rows[0][1] else 0)), 0.51 if '.' not in rows[0][1] else 0.051)
    tr = y.rolling(w).mean(); e = (y.shift(-1) - tr).dropna(); txt = pg.locator(".ts-out").inner_text()
    mad = re.search(r"missed by ([\d.,]+) on average", txt)
    if mad: check(f"TS MAD of trailing MA forecast {tag}", float(mad.group(1).replace(",", "")), e.abs().mean(), 0.051)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== attribute agreement, worked example (3 appraisers x 3 trials, pass/fail)"); test_aa(pg)
    print("== attribute agreement, 2 appraisers x 2 trials, three grades")
    rng = np.random.default_rng(4); R = []
    for i in range(24):
        s = ["1", "2", "3"][i % 3]; row = {"p": f"P{i+1}", "s": s}
        for a in "ab":
            for t in (1, 2): row[a + str(t)] = s if rng.random() > (0.15 if a == "a" else 0.3) else rng.choice(["1", "2", "3"])
        R.append(row)
    test_aa(pg, {"f": {"na": "First", "nb": "Second"}, "g": {"r": R}})
    print("== attribute agreement, no standard, 3 appraisers x 2 trials")
    R2 = []
    for i in range(15):
        base = "Go" if i % 2 else "No-go"; row = {"p": str(i + 1)}
        for a in "abc":
            for t in (1, 2): row[a + str(t)] = base if rng.random() > 0.12 else ("Go" if base == "No-go" else "No-go")
        R2.append(row)
    test_aa(pg, {"f": {}, "g": {"r": R2}})
    print("== Taguchi, worked example (nominal is best)"); test_tg(pg)
    print("== Taguchi, smaller is better")
    test_tg(pg, {"f": {"goal": "Smaller is better", "D": "0.8", "A": "45", "y": "0.35", "vol": "12000",
        "data": "0.21 0.33 0.18 0.45 0.29 0.52 0.37 0.26 0.31 0.85 0.24 0.40"},
        "g": {"runs": [{"run": "A", "y1": "0.3", "y2": "0.4", "y3": "0.35"}, {"run": "B", "y1": "0.2", "y2": "0.25", "y3": "0.6", "y4": "0.1"}]}})
    print("== Taguchi, larger is better")
    test_tg(pg, {"f": {"goal": "Larger is better", "D": "200", "A": "30", "y": "250",
        "data": "260 241 288 199 275 310 230 265 252 281"},
        "g": {"runs": [{"run": "Weld 1", "y1": "250", "y2": "270", "y3": "240"}, {"run": "Weld 2", "y1": "300", "y2": "210", "y3": "260", "y4": "280", "y5": "190", "y6": "305"}]}})
    print("== variables plan, worked example (unknown sigma, lower limit)"); test_vs(pg)
    print("== variables plan, unknown sigma, two limits, Form 2")
    test_vs(pg, {"f": {"sig": "Unknown: standard deviation method", "n": "15", "k": "1.80", "M": "2.5", "L": "9.80", "U": "10.20",
        "data": "10.04 9.93 10.11 10.18 9.89 10.02 10.24 9.98 10.09 10.13 9.85 10.07 10.00 10.20 9.96"}})
    print("== variables plan, known sigma, upper limit, reject")
    test_vs(pg, {"f": {"sig": "Known: sigma from long-run data", "sg": "0.40", "n": "7", "k": "1.95", "M": "", "U": "5.0",
        "data": "4.1 4.5 4.3 4.6 4.2 4.4 4.7"}})
    print("== variables plan estimator, simulation"); mvue_simulation()
    print("== graphical methods, worked example (skewed)"); test_gm(pg)
    print("== graphical methods, normal data, fixed leaf unit and classes")
    xn = np.round(np.random.default_rng(9).normal(72.4, 3.1, 37), 2)
    test_gm(pg, {"f": {"data": " ".join(f"{v:.2f}" for v in xn), "lu": "0.1", "lps": "Auto", "cw": "2", "c0": "62"}}, cw="2", c0="62")
    print("== graphical methods, negative values (stem -0)")
    xm = [-2.7, -1.3, -0.4, -0.2, 0.0, 0.3, 0.8, 1.1, 1.5, 1.9, 2.2, 2.6, 3.4, -0.9, 0.5, 1.2]
    test_gm(pg, {"f": {"data": " ".join(map(str, xm)), "lu": "", "lps": "Auto", "cw": "", "c0": ""}})
    print("== time series, worked example (quarterly, centered 4, season 4)"); test_ts(pg)
    print("== time series, monthly, trailing 5, season 12")
    t = np.arange(36); ym = np.round((200 + 1.5 * t) * (1 + 0.15 * np.sin(2 * np.pi * t / 12)) + np.random.default_rng(2).normal(0, 4, 36), 1)
    mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    test_ts(pg, {"f": {"w": "5", "ctr": "Trailing", "L": "12", "h": "3", "d": "\n".join(f"{mon[i%12]} {2023+i//12}\t{v}" for i, v in enumerate(ym))}})
    print("== time series, no season, centered odd window 3")
    test_ts(pg, {"f": {"w": "3", "ctr": "Centered", "L": "", "h": "0", "d": "\n".join(f"W{i+1}\t{v}" for i, v in enumerate([12, 15, 11, 14, 18, 13, 16, 17, 15, 19, 21, 18]))}})
    b.close()
print(f"\n{NCHK[0]} checks")
print("FAILED: " + ", ".join(FAIL) if FAIL else "ALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
