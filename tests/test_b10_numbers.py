#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b10 tools (Oct 2026):
customer-survey-designer-analyzer (Likert summaries, top-box margin of error,
net promoter score and its margin of error, sample size), kpi-dashboard-builder
(red/amber/green status, trend, red run), meeting-agenda-action-log (clock
slots, days late), gemba-walk-daily-huddle-board (red/green days, action ages),
design-review-dfx-checklist (area readiness) and audit-opening-closing-meeting
(corrective action due date).

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with an
implementation written here from scratch: NumPy for means, standard deviations,
medians and least-squares slopes, SciPy for normal quantiles, datetime for dates.

Run: python3 tests/test_b10_numbers.py <out root>    (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re, datetime as dt
import numpy as np
from scipy.stats import norm
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b10"
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
    s = s.replace(",", "").replace("−", "-").replace("+", "").strip().rstrip("%")
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
        state = dict(state, v=1, tool=slug); state.setdefault("x", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)
    return state or dict(pg.evaluate("()=>window.TOOL.example"))

def stat(pg, sel, label_start):
    for d in pg.locator(sel + " > div").all():
        if d.locator("span").inner_text().upper().startswith(label_start.upper()): return d.locator("b").inner_text()
    raise KeyError(label_start)

def table(pg, sel):
    return [[c.inner_text().strip() for c in r.locator("td").all()] for r in pg.locator(sel + " tbody tr").all()]

def calc_cells(pg, grid, col):
    return [r.locator(f'td[data-c="{col}"]').inner_text().strip() for r in pg.locator(f'table[data-grid="{grid}"] tbody tr').all()]

# ---------------------------------------------------------------- survey
ZQ = {"90%": 0.95, "95%": 0.975, "99%": 0.995}
def expand(counts):
    return np.concatenate([np.full(int(c), i + 1) for i, c in enumerate(counts)])

def test_survey(pg, state=None):
    slug = "customer-survey-designer-analyzer"
    st = load(pg, slug, state); F = st["f"]
    k = int(F.get("pts") or 5); b = int(re.search(r"Top (\d)", F.get("box") or "Top 2").group(1))
    z = norm.ppf(ZQ.get(F.get("conf") or "95%"))
    rows = [r for r in st["g"]["r"] if any(r.get(f"c{i}") for i in range(1, 8))]
    tab = table(pg, ".sv-t")
    same("survey rating rows", len(tab), len(rows))
    for r, t in zip(rows, tab):
        c = [float(r.get(f"c{i}") or 0) for i in range(1, k + 1)]
        x = expand(c); n = len(x); q = "Q" + r["no"]
        top = sum(c[-b:]) / n; bot = sum(c[:b]) / n
        check(f"{q} n", num(t[1]), n, 0)
        check(f"{q} mean", num(t[2]), x.mean(), 0.0051)
        check(f"{q} SD (n-1)", num(t[3]), x.std(ddof=1), 0.0051)
        check(f"{q} median", num(t[4]), float(np.median(x)), 0.051)
        check(f"{q} top-{b}-box %", num(t[5]), 100 * top, 0.051)
        check(f"{q} top-box MOE", num(t[6]), 100 * z * math.sqrt(top * (1 - top) / n), 0.051)
        check(f"{q} bottom-{b}-box %", num(t[7]), 100 * bot, 0.051)
    segs = [r for r in st["g"]["np"] if any(r.get(f"s{i}") for i in range(11))]
    def nps(counts):
        sc = np.concatenate([np.full(int(cn), 1 if i >= 9 else (-1 if i <= 6 else 0)) for i, cn in enumerate(counts)])
        n = len(sc); m = sc.mean(); se = math.sqrt(sc.var(ddof=0) / n)
        return dict(n=n, p=np.mean(sc == 1), d=np.mean(sc == -1), nps=100 * m, se=100 * se, moe=100 * z * se)
    cs = [[float(r.get(f"s{i}") or 0) for i in range(11)] for r in segs]
    res = [nps(c) for c in cs]
    if len(segs) > 1: res.append(nps(list(np.sum(cs, axis=0))))
    nt = table(pg, ".sv-nt")
    same("NPS rows", len(nt), len(res))
    for t, R in zip(nt, res):
        check(f"NPS {t[0]} n", num(t[1]), R["n"], 0)
        check(f"NPS {t[0]} promoters %", num(t[2]), 100 * R["p"], 0.051)
        check(f"NPS {t[0]} detractors %", num(t[4]), 100 * R["d"], 0.051)
        check(f"NPS {t[0]} score", num(t[5]), R["nps"], 0.051)
        check(f"NPS {t[0]} MOE", num(t[6]), R["moe"], 0.051)
        lo, hi = [num(v) for v in t[7].split(" to ")]
        check(f"NPS {t[0]} interval low", lo, max(-100, R["nps"] - R["moe"]), 0.051)
        check(f"NPS {t[0]} interval high", hi, min(100, R["nps"] + R["moe"]), 0.051)
    if len(segs) > 1:
        sr = sorted(res[:-1], key=lambda R: -R["nps"]); a, c = sr[0], sr[-1]
        txt = " ".join(pg.locator(".sv-out .flag").all_inner_texts())
        if math.hypot(a["se"], c["se"]) > 0:
            zz = (a["nps"] - c["nps"]) / math.hypot(a["se"], c["se"])
            check("NPS segment gap z", float(re.search(r"z = (-?\d+(?:\.\d+)?)", txt).group(1)), zz, 0.0051)
        else:
            same("NPS gap with zero variance called real", "larger than chance" in txt, a["nps"] > c["nps"])
    E = float(F.get("moe") or 5); N = float(F.get("N") or 0)
    n0 = z * z * 0.25 / (E / 100) ** 2; need = math.ceil(n0 / (1 + (n0 - 1) / N) if N > 0 else n0)
    check("sample size needed", num(stat(pg, ".sv-stat", "Needed for")), need, 0)
    if F.get("sent"):
        resp = float(F.get("resp") or 0)
        check("response rate %", num(stat(pg, ".sv-stat", "Response rate")), round(100 * resp / float(F["sent"])), 0)

def test_wording(pg):
    slug = "customer-survey-designer-analyzer"
    qs = [("Don't you agree our service is excellent?", "Agreement (Likert)", "", {"leading", "negative", "no labels"}),
          ("How satisfied are you with the price and the delivery time?", "Satisfaction rating", "Very dissatisfied / Dissatisfied / Neither / Satisfied / Very satisfied", {"double-barreled?"}),
          ("The invoice is always correct.", "Agreement (Likert)", "Strongly disagree / Disagree / Neither / Agree / Strongly agree", {"absolute"}),
          ("Rate the help desk.", "Satisfaction rating", "Poor / Fair / Good / Very good / Excellent", {"unbalanced scale"}),
          ("How likely are you to recommend us to a friend or colleague?", "0-10 likelihood (NPS)", "0 / 10", set()),
          ("The manual was clear.", "Agreement (Likert)", "Strongly disagree / Disagree / Neither / Agree / Strongly agree", set())]
    load(pg, slug, {"f": {"pts": "5"}, "g": {"q": [{"no": str(i + 1), "t": t, "type": ty, "lab": lb} for i, (t, ty, lb, _) in enumerate(qs)], "r": [{}], "np": [{}]}})
    cells = pg.locator('table[data-grid="q"] tbody tr td[data-c="chk"]').all()
    for (t, _, _, want), c in zip(qs, cells):
        got = set(x.inner_text().strip() for x in c.locator("i").all())
        same(f"wording tags for '{t[:40]}'", got, want)

# ---------------------------------------------------------------- KPI
def kpi_ref(r, band):
    v = [float(x) for x in re.split(r"[,;\s]+", r["v"]) if x]
    t = float(r["t"]); lo = r.get("dir") == "Lower"; a = v[-1]
    red = float(r["red"]) if r.get("red") not in (None, "") else (t + abs(t) * band / 100 if lo else t - abs(t) * band / 100)
    def s(x): return ("G" if x <= t else "R" if x > red else "A") if lo else ("G" if x >= t else "R" if x < red else "A")
    tr = ""
    if len(v) >= 3:
        slope = np.polyfit(np.arange(len(v)), v, 1)[0]; ch = slope * (len(v) - 1); thr = abs(t - red) / 2 or 1e-9
        good = -ch if lo else ch; tr = "up" if good > thr else "down" if good < -thr else "flat"
    run = 0
    for x in reversed(v):
        if s(x) == "R": run += 1
        else: break
    return a, s(a), tr, run

def test_kpi(pg, state=None):
    slug = "kpi-dashboard-builder"
    st = load(pg, slug, state); band = float(st["f"].get("band") or 5)
    rows = [r for r in st["g"]["k"] if r.get("m")]
    acts, sts, trs = calc_cells(pg, "k", "act"), calc_cells(pg, "k", "st"), calc_cells(pg, "k", "tr")
    lab = {"G": "Green", "A": "Amber", "R": "Red"}; tl = {"up": "▲ improving", "down": "▼ worsening", "flat": "▬ flat", "": "—"}
    flags = " ".join(pg.locator(".kp-out .flag").all_inner_texts())
    for r, a_, s_, t_ in zip(rows, acts, sts, trs):
        a, s, tr, run = kpi_ref(r, band)
        check(f"KPI {r['m'][:30]} actual", num(a_), a, 0.0051)
        same(f"KPI {r['m'][:30]} status", s_, lab[s])
        same(f"KPI {r['m'][:30]} trend", t_, tl[tr])
        if run >= 3:
            m = re.search(re.escape(r["m"]) + r" has been red for (\d+) periods", flags)
            check(f"KPI {r['m'][:30]} red run", float(m.group(1)) if m else -1, run, 0)
    cnt = {"G": 0, "A": 0, "R": 0}
    for r in rows: cnt[kpi_ref(r, band)[1]] += 1
    for k, l in lab.items(): check(f"KPI count {l}", num(stat(pg, ".kp-stat", l)), cnt[k], 0)

# ---------------------------------------------------------------- meeting, gemba, DFX, audit
def d(s): return dt.date.fromisoformat(s)
def test_meeting(pg):
    slug = "meeting-agenda-action-log"; st = load(pg, slug)
    h, m = map(int, st["f"]["start"].split(":")); t = h * 60 + m; want = []
    for r in st["g"]["ag"]:
        e = t + int(r["min"]); want.append(f"{t//60:02d}:{t%60:02d}–{e//60:02d}:{e%60:02d}"); t = e
    for i, (g, w) in enumerate(zip(calc_cells(pg, "ag", "slot"), want)): same(f"meeting slot {i+1}", g, w)
    plan = sum(int(r["min"]) for r in st["g"]["ag"]); act = sum(int(r["act"]) for r in st["g"]["ag"])
    check("meeting planned minutes", num(stat(pg, ".mt-stat", "Planned").replace(" min", "")), plan, 0)
    check("meeting actual minutes", num(stat(pg, ".mt-stat", "Actual").replace(" min", "")), act, 0)
    asof = d(st["f"]["asof"])
    for r, g in zip(st["g"]["ac"], calc_cells(pg, "ac", "age")):
        late = (asof - d(r["due"])).days if r.get("due") and r["st"] not in ("Done", "Cancelled") and asof > d(r["due"]) else 0
        check(f"meeting days late: {r['a'][:30]}", float(g) if g else 0.0, late, 0)

def test_gemba(pg):
    slug = "gemba-walk-daily-huddle-board"; st = load(pg, slug)
    for r, g in zip(st["g"]["k"], calc_cells(pg, "k", "red")):
        t = float(r["t"]); lo = r["dir"] == "Lower"
        reds = sum(1 for i in range(1, 6) if r.get(f"d{i}") not in ("", None) and not (float(r[f"d{i}"]) <= t if lo else float(r[f"d{i}"]) >= t))
        check(f"gemba red days {r['m']}", float(g), reds, 0)
    asof = d(st["f"]["asof"]); ages = []; closed = []
    for r, g in zip(st["g"]["o"], calc_cells(pg, "o", "age")):
        a = (d(r["done"]) - d(r["seen"])).days if r["st"] == "Done" else (asof - d(r["seen"])).days
        check(f"gemba age {r['obs'][:30]}", float(g), a, 0)
        (closed if r["st"] == "Done" else ages).append(a)
    check("gemba mean age open", num(stat(pg, ".gh-stat", "Mean age")), round(np.mean(ages), 1), 0.051)
    check("gemba median days to close", num(stat(pg, ".gh-stat", "Median days")), float(np.median(closed)), 0.051)

def test_dfx(pg):
    slug = "design-review-dfx-checklist"; st = load(pg, slug); F = st["f"]
    txt = pg.locator(".dr-svg").inner_text()
    pcts = [int(x) for x in re.findall(r"(\d+)%", txt)][:8]
    areas = "gmatsrce"; tot = [0, 0]
    for a, got in zip(areas, pcts):
        v = [F.get(f"q_{a}{i}", "") for i in range(1, 6)]
        app = [x for x in v if x in ("Yes", "Partly", "No")]; sc = sum(1 if x == "Yes" else 0.5 if x == "Partly" else 0 for x in app)
        tot[0] += sc; tot[1] += len(app)
        check(f"DFX area {a} readiness %", got, round(100 * sc / len(app)), 0)
    check("DFX overall readiness %", num(stat(pg, ".dr-stat", "Overall")), round(100 * tot[0] / tot[1]), 0)

def test_audit(pg):
    slug = "audit-opening-closing-meeting"; st = load(pg, slug); F = st["f"]
    due = d(F["rdate"]) + dt.timedelta(days=int(F["cadays"]))
    same("audit CA response due", stat(pg, ".ao-stat", "Corrective action"), due.strftime("%b %-d, %Y"))
    att = st["g"]["att"]
    same("audit attended opening / closing", stat(pg, ".ao-stat", "Attended"), f"{sum(r['o']=='Yes' for r in att)} / {sum(r['c']=='Yes' for r in att)}")

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== survey, worked example"); test_survey(pg)
    print("== survey, 7-point scale, top 3 box, 90%, single NPS segment, no population size")
    test_survey(pg, {"f": {"pts": "7", "box": "Top 3 / bottom 3", "conf": "90%", "moe": "3", "sent": "300", "resp": "64"},
                     "g": {"q": [{}], "r": [{"no": "1", "lab": "A", "c1": "2", "c2": "3", "c3": "5", "c4": "10", "c5": "14", "c6": "18", "c7": "12"},
                                            {"no": "2", "lab": "B", "c1": "9", "c2": "0", "c3": "0", "c4": "0", "c5": "0", "c6": "0", "c7": "9"}],
                           "np": [{"seg": "All", "s0": "1", "s3": "2", "s6": "4", "s7": "6", "s8": "9", "s9": "20", "s10": "22"}]}})
    print("== survey, 99%, 4-point scale, all promoters (NPS 100, MOE 0) against all detractors")
    test_survey(pg, {"f": {"pts": "4", "box": "Top 1 / bottom 1", "conf": "99%", "N": "500", "moe": "10"},
                     "g": {"q": [{}], "r": [{"no": "1", "lab": "Even n", "c1": "3", "c2": "7", "c3": "7", "c4": "3"}],
                           "np": [{"seg": "Fans", "s10": "15"}, {"seg": "Critics", "s0": "5", "s5": "5"}]}})
    print("== survey wording checks"); test_wording(pg)
    print("== KPI, worked example"); test_kpi(pg)
    print("== KPI, boundaries: on target, on the red limit, lower-is-better, default band, short history")
    test_kpi(pg, {"f": {"band": "10"}, "g": {"ob": [{"id": "O1", "o": "x"}], "k": [
        {"m": "On target exactly", "ob": "O1", "ll": "Leading", "dir": "Higher", "t": "95", "red": "90", "v": "93, 94, 95", "who": "A"},
        {"m": "On red limit exactly", "ob": "O1", "ll": "Leading", "dir": "Higher", "t": "95", "red": "90", "v": "92, 91, 90", "who": "A"},
        {"m": "Just under red", "ob": "O1", "ll": "Lagging", "dir": "Higher", "t": "95", "red": "90", "v": "89.9, 89.9, 89.99, 89.95", "who": "A"},
        {"m": "Lower better amber", "ob": "O1", "ll": "Lagging", "dir": "Lower", "t": "2", "red": "3", "v": "2.4, 2.6, 2.8, 3", "who": "A"},
        {"m": "Lower better default band", "ob": "O1", "ll": "Lagging", "dir": "Lower", "t": "50", "red": "", "v": "60, 58, 54, 52, 50", "who": "A"},
        {"m": "Default band, amber", "ob": "O1", "ll": "Leading", "dir": "Higher", "t": "200", "red": "", "v": "185, 184, 186, 185", "who": "A"},
        {"m": "Two values only", "ob": "O1", "ll": "Leading", "dir": "Higher", "t": "10", "red": "8", "v": "7, 7.5", "who": "A"}]}})
    print("== meeting"); test_meeting(pg)
    print("== gemba"); test_gemba(pg)
    print("== design review"); test_dfx(pg)
    print("== audit meetings"); test_audit(pg)
    b.close()
print("\nFAILED: " + ", ".join(FAIL) if FAIL else "\nALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
