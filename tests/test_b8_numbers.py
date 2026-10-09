#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b8 tools (Oct 2026):
hazard-analysis-risk-control, iq-oq-pq-validation-protocol,
requirements-traceability-matrix, alcoa-plus-data-integrity-checklist.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with an
implementation written here from scratch. Probabilities of harm are computed
with exact rational arithmetic (fractions.Fraction), so the level boundaries
are tested exactly, not to a float tolerance.

Run: python3 tests/test_b8_numbers.py <out root>    (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re
from fractions import Fraction as Fr
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b8"
FAIL = []
def check(name, got, want, tol=0):
    ok = (got == want) if isinstance(want, (str, tuple, list, set, frozenset)) else abs(got - want) <= tol
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

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
    return state if state is not None else pg.evaluate("()=>window.TOOL.example")

def stats(pg, sel):
    return {d.locator("span").inner_text().upper(): d.locator("b").inner_text() for d in pg.locator(sel + " > div").all()}

def cells(pg, grid, col, rendered=False):
    tds = [r.locator(f'td[data-c="{col}"]') for r in pg.locator(f'table[data-grid="{grid}"] tbody tr').all()]
    return [td.inner_text() if rendered else td.text_content() for td in tds]

# ---------------------------------------------------------------- hazard analysis
NAME = {"A": "Acceptable", "R": "Reduce further", "U": "Unacceptable"}
# the default policy as drawn in the matrix, top row first (P5 ... P1), columns S1 ... S5
DEFAULT_ROWS = {5: "ARUUU", 4: "ARRUU", 3: "AARRU", 2: "AAARR", 1: "AAAAR"}

def fr(v):
    s = str(v or "").strip().replace(",", ".", 1)
    if not s: return None
    m = re.match(r"^([\d.eE+-]+)\s*/\s*([\d.eE+-]+)$", s)
    try:
        if m: return Fr(m.group(1)) / Fr(m.group(2))
        if s.endswith("%"): return Fr(s[:-1]) / 100
        return Fr(s)
    except (ValueError, ZeroDivisionError): return None

def plevel(P, bounds):
    for lvl, b in zip((5, 4, 3, 2), bounds):
        if P >= b: return lvl
    return 1

def page_p(txt):
    t = txt.replace("−", "-").replace("^", "").replace(" ", "")
    m = re.match(r"^([\d.]+)×10(-?\d+)$", t)
    return float(m.group(1)) * 10 ** int(m.group(2)) if m else float(t)

def test_hazard(pg, state=None, matrix_rows=None):
    slug = "hazard-analysis-risk-control"; st = load(pg, slug, state)
    m = st["x"]["m"]
    if matrix_rows:  # the stored string must encode the policy as drawn
        enc = "".join(matrix_rows[p] for p in (1, 2, 3, 4, 5))
        check("hazard matrix encoding", m, enc)
    lookup = lambda P, S: m[(P - 1) * 5 + S - 1]
    dflt = [Fr(1, 10**3), Fr(1, 10**4), Fr(1, 10**5), Fr(1, 10**6)]
    bounds = [fr(st["f"].get(k)) or d for k, d in zip(("b5", "b4", "b3", "b2"), dflt)]
    rows = st["g"]["h"]
    pc, pbc, r0c, r1c = cells(pg, "h", "p"), cells(pg, "h", "pb"), cells(pg, "h", "r0", True), cells(pg, "h", "r1", True)
    cnt0 = {"A": 0, "R": 0, "U": 0}; cnt1 = {"A": 0, "R": 0, "U": 0}
    for i, r in enumerate(rows):
        rid = r.get("id") or f"row {i+1}"
        def sev(v):
            try: s = int(str(v).strip()); return s if 1 <= s <= 5 and str(s) == str(v).strip() else None
            except ValueError: return None
        for k1, k2, cp, cr, s_key, cnt in (("p1", "p2", pc, r0c, "s", cnt0), ("p1b", "p2b", pbc, r1c, "sb", cnt1)):
            a, b = fr(r.get(k1)), fr(r.get(k2))
            if a is None or b is None:
                check(f"hazard {rid} {k1}x{k2} blank", cp[i].strip(), ""); continue
            P = a * b
            check(f"hazard {rid} P={k1}x{k2}", page_p(cp[i]), float(P), float(P) * 0.0051)
            S = sev(r.get(s_key)) if r.get(s_key) not in (None, "") else sev(r.get("s"))
            if S is None: check(f"hazard {rid} {s_key} no risk shown", cr[i].strip(), ""); continue
            L = plevel(P, bounds); k = lookup(L, S); cnt[k] += 1
            check(f"hazard {rid} risk {'after' if s_key=='sb' else 'before'}", " ".join(cr[i].split()).upper(), f"P{L} S{S} {NAME[k]}".upper())
    s = stats(pg, ".hz-stat")
    check("hazard unacceptable before -> after", s["UNACCEPTABLE, BEFORE → AFTER"], f"{cnt0['U']} → {cnt1['U']}")
    check("hazard reduce-further before -> after", s["REDUCE FURTHER"], f"{cnt0['R']} → {cnt1['R']}")
    check("hazard acceptable before -> after", s["ACCEPTABLE"], f"{cnt0['A']} → {cnt1['A']}")

# ---------------------------------------------------------------- IQ/OQ/PQ
def verdict(r):
    def n(v):
        s = str(v or "").strip().replace(",", ".", 1)
        try: return float(s) if s else None
        except ValueError: return None
    x, lo, hi = n(r.get("res")), n(r.get("lo")), n(r.get("hi"))
    if x is None or (lo is None and hi is None): return ""
    return "Pass" if (lo is None or x >= lo) and (hi is None or x <= hi) else "Fail"

def test_val(pg, state=None):
    slug = "iq-oq-pq-validation-protocol"; st = load(pg, slug, state)
    rows = st["g"]["t"]; got = cells(pg, "t", "auto")
    for i, r in enumerate(rows): check(f"IQOQPQ {r.get('id')} auto verdict (res {r.get('res')!r}, {r.get('lo')!r}..{r.get('hi')!r})", got[i].strip(), verdict(r))
    used = [r for r in rows if r.get("test") or r.get("id")]
    s = stats(pg, ".vq-stat")
    check("IQOQPQ test cases", int(s["TEST CASES"]), len(used))
    check("IQOQPQ passed", int(s["PASSED"]), sum(r.get("v") == "Pass" for r in used))
    check("IQOQPQ failed", int(s["FAILED"]), sum(r.get("v") == "Fail" for r in used))
    check("IQOQPQ not run", int(s["NOT RUN YET"]), sum(r.get("v") not in ("Pass", "Fail") for r in used))
    runs = sum(float(r["n"]) for r in used if r.get("st") == "PQ" and str(r.get("n") or "").strip())
    svg = pg.locator(".vq-svg").text_content()
    check("IQOQPQ PQ runs or lots", int(re.search(r"(\d+) RUNS OR LOTS", svg).group(1)), runs)

# ---------------------------------------------------------------- traceability
def ids(v): return [x.upper() for x in re.split(r"[,;\s]+", str(v or "")) if x.strip()]

def trace(g):
    def keep(L): return [r for r in L if any(str(v).strip() for v in r.values())]
    N, I, O, V, W = (keep(g.get(k, [])) for k in "niovw")
    nk = {r["id"].strip().upper() for r in N if r.get("id")}; ik = {r["id"].strip().upper() for r in I if r.get("id")}
    need_in = {k: [] for k in nk}; in_out = {k: [] for k in ik}; in_ver = {k: False for k in ik}; in_vers = {k: 0 for k in ik}
    need_val = {k: False for k in nk}
    for r in I:
        for k in ids(r.get("need")):
            if k in nk: need_in[k].append(r["id"])
    for r in O:
        for k in ids(r.get("inp")):
            if k in ik: in_out[k].append(r["id"])
    for r in V:
        for k in ids(r.get("inp")):
            if k in ik: in_vers[k] += 1; in_ver[k] |= r.get("res") == "Pass"
    for r in W:
        for k in ids(r.get("need")):
            if k in nk: need_val[k] |= r.get("res") == "Pass"
    in_need = {r["id"].strip().upper(): any(k in nk for k in ids(r.get("need"))) for r in I if r.get("id")}
    pct = lambda a, b: round(100 * a / b) if b else None
    return dict(
        needIn=pct(sum(1 for k in nk if need_in[k]), len(N)), inNeed=pct(sum(in_need.values()), len(I)),
        inOut=pct(sum(1 for k in ik if in_out[k]), len(I)), inVer=pct(sum(in_ver.values()), len(I)),
        needVal=pct(sum(need_val.values()), len(N)),
        no_input={k for k in nk if not need_in[k]}, no_ver={k for k in ik if not in_vers[k]},
        orphan_in={k for k, v in in_need.items() if not v}, orphan_out={r["id"].strip().upper() for r in O if r.get("id") and not any(k in ik for k in ids(r.get("inp")))})

def flagged(pg, pat):
    return {m.upper() for t in pg.locator(".rt-out .flag").all_inner_texts() for m in re.findall(pat, t)}

def test_rtm(pg, state=None):
    slug = "requirements-traceability-matrix"; st = load(pg, slug, state)
    t = trace(st["g"]); s = stats(pg, ".rt-stat")
    for lab, k in (("NEEDS WITH DESIGN INPUTS", "needIn"), ("INPUTS TRACED TO A NEED", "inNeed"), ("INPUTS WITH OUTPUTS", "inOut"), ("INPUTS VERIFIED (PASS)", "inVer"), ("NEEDS VALIDATED (PASS)", "needVal")):
        check(f"RTM {lab.lower()}", s[lab], "—" if t[k] is None else f"{t[k]}%")
    check("RTM needs without input", flagged(pg, r"User need (\S+) has no design input"), t["no_input"])
    check("RTM inputs without verification", flagged(pg, r"Design input (\S+) has no verification"), t["no_ver"])
    check("RTM orphan inputs", flagged(pg, r"Design input (\S+) does not trace"), t["orphan_in"])
    check("RTM orphan outputs", flagged(pg, r"Design output (\S+) implements no"), t["orphan_out"])

# ---------------------------------------------------------------- ALCOA+
K = ["k%d" % i for i in range(1, 10)]
def score(vals):
    v = [{"Yes": 1.0, "Partly": 0.5, "No": 0.0}[x] for x in vals if x in ("Yes", "Partly", "No")]
    return 100 * sum(v) / len(v) if v else None

def test_alcoa(pg, state=None):
    slug = "alcoa-plus-data-integrity-checklist"; st = load(pg, slug, state)
    rows = [r for r in st["g"]["r"] if r.get("rec") or r.get("rid")]
    got = cells(pg, "r", "sc")
    for i, r in enumerate(st["g"]["r"]):
        sc = score([r.get(k) for k in K])
        check(f"ALCOA {r.get('rid')} record score", got[i].strip(), "" if sc is None else f"{round(sc)}%")
    allv = [r.get(k) for r in rows for k in K]
    sc = score(allv); s = stats(pg, ".al-stat")
    check("ALCOA overall score", s["OVERALL SCORE"], "—" if sc is None else f"{round(sc)}%")
    check("ALCOA count No", int(s["ATTRIBUTES ANSWERED NO"]), allv.count("No"))
    check("ALCOA count Partly", int(s["ANSWERED PARTLY"]), allv.count("Partly"))
    col = [score([r.get(k) for r in rows]) for k in K]
    bars = pg.locator(".al-svg text.v").all_text_contents()
    check("ALCOA attribute scores", bars, [f"{round(c)}%" for c in col if c is not None])
    thr = float(st["f"].get("thr") or 90)
    names = ["Attributable", "Legible", "Contemporaneous", "Original", "Accurate", "Complete", "Consistent", "Enduring", "Available"]
    low = {n for n, c in zip(names, col) if c is not None and c < thr}
    fl = {m for t in pg.locator(".al-out .flag").all_inner_texts() for m in re.findall(r"^(\w+) scores \d+%, below", t)}
    check("ALCOA attributes below action level", fl, low)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== hazard analysis, worked example"); test_hazard(pg, None, DEFAULT_ROWS)
    print("== hazard analysis, exact level boundaries, fractions and percents, custom bounds and matrix")
    test_hazard(pg, {"f": {"b5": "1e-2", "b4": "1/1000", "b3": "0.01%", "b2": "1e-5"},
        "x": {"m": "AAAAU" "AARRU" "ARRUU" "RRUUU" "RUUUU"}, "g": {"h": [
        {"id": "B1", "haz": "x", "p1": "0.3", "p2": "1/30", "s": "3", "p1b": "0.3", "p2b": "1/300", "sb": "2"},   # exactly 1e-2 -> P5; 1e-3 -> P4
        {"id": "B2", "haz": "x", "p1": "1%", "p2": "0.1", "s": "5", "p1b": "1/1000", "p2b": "0.0999", "sb": ""},  # 1e-3 -> P4; just under 1e-4 -> P2
        {"id": "B3", "haz": "x", "p1": "1e-3", "p2": "1e-2", "s": "1", "p1b": "", "p2b": "", "sb": ""},          # 1e-5 exactly -> P2
        {"id": "B4", "haz": "x", "p1": "0,5", "p2": "1e-6", "s": "4"},                                         # decimal comma, below P2 -> P1
        {"id": "B5", "haz": "x", "p1": "0.2", "p2": "0.5", "s": "6"},                                          # invalid severity: no risk
        {"id": "B6", "haz": "x", "p1": "1", "p2": "1", "s": "2", "p1b": "0.03", "p2b": "1/3", "sb": "2"}]}})
    print("== IQ/OQ/PQ, worked example"); test_val(pg)
    print("== IQ/OQ/PQ, limits inclusive, one-sided, decimal comma, text results")
    test_val(pg, {"f": {}, "g": {"t": [
        {"id": "T1", "st": "IQ", "test": "a", "lo": "1.2", "hi": "", "res": "1.2", "v": "Pass"},
        {"id": "T2", "st": "OQ", "test": "b", "lo": "", "hi": "5", "res": "5.0001", "v": "Fail", "dev": "D1"},
        {"id": "T3", "st": "OQ", "test": "c", "lo": "-2", "hi": "2", "res": "-2", "v": "Pass", "cond": "Low limit (worst case)"},
        {"id": "T4", "st": "PQ", "test": "d", "lo": "1.2", "hi": "4", "res": "1,1", "v": "", "n": "2"},
        {"id": "T5", "st": "PQ", "test": "e", "lo": "", "hi": "", "res": "0 of 30", "v": "Pass", "n": "1"},
        {"id": "T6", "st": "PQ", "test": "f", "lo": "0", "hi": "10", "res": "pending", "v": "Not run", "n": "1"}], "d": [{"id": "D1", "st": "Open"}], "a": [{}]}})
    print("== traceability, worked example"); test_rtm(pg)
    print("== traceability, mixed separators, lower case, unknown and duplicate IDs")
    test_rtm(pg, {"f": {}, "g": {
        "n": [{"id": "N1", "txt": "a"}, {"id": "N2", "txt": "b"}, {"id": "N3", "txt": "c"}],
        "i": [{"id": "I1", "txt": "x", "need": "n1;N2"}, {"id": "I2", "txt": "y", "need": "N2 N9"}, {"id": "I3", "txt": "z", "need": ""}, {"id": "I4", "txt": "w", "need": "N9"}],
        "o": [{"id": "O1", "txt": "d", "inp": "i1,I2"}, {"id": "O2", "txt": "e", "inp": ""}, {"id": "O3", "txt": "f", "inp": "I3"}],
        "v": [{"id": "V1", "txt": "t", "inp": "I1", "res": "Pass"}, {"id": "V2", "txt": "t", "inp": "I2", "res": "Fail"}, {"id": "V3", "txt": "t", "inp": "i3", "res": "Pass"}],
        "w": [{"id": "W1", "txt": "s", "need": "N1", "res": "Pass"}, {"id": "W2", "txt": "s", "need": "N2", "res": "Planned"}]}})
    print("== traceability, empty"); test_rtm(pg, {"f": {}, "g": {"n": [{}], "i": [{}], "o": [{}], "v": [{}], "w": [{}]}})
    print("== ALCOA+, worked example"); test_alcoa(pg)
    print("== ALCOA+, N/A and blanks excluded, action level 75")
    test_alcoa(pg, {"f": {"thr": "75"}, "g": {"r": [
        {"rid": "A", "rec": "a", "k1": "Yes", "k2": "N/A", "k3": "Partly", "k4": "No", "k5": "", "k6": "Yes", "k7": "Yes", "k8": "Partly", "k9": "N/A"},
        {"rid": "B", "rec": "b", "k1": "No", "k2": "N/A", "k3": "Partly", "k4": "Yes", "k5": "", "k6": "Partly", "k7": "Yes", "k8": "No", "k9": "N/A"},
        {"rid": "C", "rec": "c"}], "fd": [{}]}})
    b.close()

# hand checks of the sample-size statements in the IQ/OQ/PQ worked example and page text:
# zero failures in n gives confidence C that p < 1 - (1-C)^(1/n)
print("== success-run sample sizes quoted in the IQ/OQ/PQ example")
check("0 of 30 at 90% confidence: p below %", round(100 * (1 - 0.10 ** (1 / 30)), 1), 7.4, 0)
check("0 of 90 at 95% confidence: p below %", round(100 * (1 - 0.05 ** (1 / 90)), 1), 3.3, 0)
print("\nFAILED: " + ", ".join(FAIL) if FAIL else "\nALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
