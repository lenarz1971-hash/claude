#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-1 tools (Oct 2026):
activity-network-critical-path, fault-tree-analysis, probability-calculator,
risk-register-heat-map, flowchart-swimlane.

Each case is loaded into the built page in a real browser (Chromium via
Playwright), the figures are read off the page, and they are compared with an
implementation written here from scratch: SciPy for the normal distribution,
math.comb / math.perm for counting, brute-force enumeration for fault trees.

Run: python3 tests/test_batch1_numbers.py <out root>    (after build_tools.py)"""
import http.server, socketserver, threading, os, sys, json, math, re, itertools
from scipy.stats import norm
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out"
FAIL = []
def check(name, got, want, tol):
    ok = abs(got - want) <= tol
    print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").strip().rstrip("%")
    m = re.match(r"^([\d.]+)\s*[×x]\s*10\^?(-?\d+)$", s.replace("<sup>", "^").replace("</sup>", ""))
    return float(m.group(1)) * 10 ** int(m.group(2)) if m else float(s)

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

def stats(pg, sel):
    return [(d.locator("span").inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]

def stat(pg, sel, label_start):
    for lab, val in stats(pg, sel):
        if lab.upper().startswith(label_start.upper()): return val
    raise KeyError(label_start)

# ---------------------------------------------------------------- CPM / PERT
def cpm(acts):
    te = {}; var = {}
    for a in acts:
        A, M, B = (float(a[k]) if a.get(k) not in (None, "") else None for k in ("a", "m", "b"))
        if A is not None and M is not None and B is not None: te[a["id"]] = (A + 4*M + B) / 6; var[a["id"]] = ((B - A) / 6) ** 2
        else: te[a["id"]] = M; var[a["id"]] = 0.0
    pred = {a["id"]: [p for p in re.split(r"[,;\s]+", a.get("pred") or "") if p] for a in acts}
    ES, EF = {}, {}
    def ef(i):
        if i not in EF:
            ES[i] = max((ef(p) for p in pred[i]), default=0.0); EF[i] = ES[i] + te[i]
        return EF[i]
    for i in pred: ef(i)
    T = max(EF.values())
    succ = {i: [j for j in pred if i in pred[j]] for i in pred}
    LF, LS = {}, {}
    def ls(i):
        if i not in LS:
            LF[i] = min((ls(s) for s in succ[i]), default=T); LS[i] = LF[i] - te[i]
        return LS[i]
    for i in pred: ls(i)
    crit = [i for i in pred if abs(LS[i] - ES[i]) < 1e-9]
    # one critical path: walk from a critical start through critical successors
    path = []; cur = next(i for i in crit if not any(p in crit and abs(EF[p]-ES[i]) < 1e-9 for p in pred[i]))
    while True:
        path.append(cur); nx = [s for s in succ[cur] if s in crit and abs(ES[s]-EF[cur]) < 1e-9]
        if not nx: break
        cur = nx[0]
    return dict(T=T, ES=ES, EF=EF, LS=LS, LF=LF, te=te, sd=math.sqrt(sum(var[i] for i in path)), path=path)

def test_cpm(pg, state, target=None):
    slug = "activity-network-critical-path"
    load(pg, slug, state)
    acts = (state or pg.evaluate("()=>window.TOOL.example"))["g"]["a"]
    r = cpm([a for a in acts if a.get("id")])
    check("CPM duration", num(stat(pg, ".cp-stat", "Expected project duration") if any(a.get("a") for a in acts) else stat(pg, ".cp-stat", "Project duration")), r["T"], 0.006)
    check("CPM critical path", 1.0 if stat(pg, ".cp-stat", "Critical path").replace("–", "-") == "-".join(r["path"]) else 0.0, 1.0, 0)
    for row in pg.locator(".cp-tab tbody tr").all():
        c = [x.inner_text() for x in row.locator("td").all()]
        i = c[0]; off = 5 if len(c) == 11 else 4
        for k, name in enumerate(["ES", "EF", "LS", "LF"]):
            check(f"CPM {i} {name}", num(c[off + k]), r[name][i], 0.006)
        check(f"CPM {i} slack", num(c[off + 4]), r["LS"][i] - r["ES"][i], 0.006)
    if target is not None:
        check("PERT path sd", num(stat(pg, ".cp-stat", "Std dev")), r["sd"], 0.006)
        P = norm.cdf((target - r["T"]) / r["sd"])
        check("PERT P(finish by target) %", num(stat(pg, ".cp-stat", "Chance")), 100 * P, 0.051)

# ---------------------------------------------------------------- fault tree
def ft_truth(events, top, on):
    E = {e["id"]: e for e in events}
    def ev(i):
        e = E[i]
        if "gate" not in (e.get("type") or ""): return i in on
        ins = [x for x in re.split(r"[,;\s]+", e.get("in") or "") if x]
        return all(ev(x) for x in ins) if e["type"] == "AND gate" else any(ev(x) for x in ins)
    return ev(top)

def test_ft(pg, state):
    slug = "fault-tree-analysis"
    load(pg, slug, state)
    evs = [e for e in (state or pg.evaluate("()=>window.TOOL.example"))["g"]["e"] if e.get("id")]
    gates = [e for e in evs if "gate" in (e.get("type") or "")]
    used = {x for g in gates for x in re.split(r"[,;\s]+", g.get("in") or "") if x}
    top = next(g["id"] for g in gates if g["id"] not in used)
    basics = [e["id"] for e in evs if "gate" not in (e.get("type") or "")]
    p = {e["id"]: float(e["p"]) for e in evs if e["id"] in basics}
    exact = 0.0
    for bits in itertools.product([0, 1], repeat=len(basics)):
        on = {b for b, x in zip(basics, bits) if x}
        if ft_truth(evs, top, on):
            exact += math.prod(p[b] if b in on else 1 - p[b] for b in basics)
    check("FTA top-event probability", num(stat(pg, ".ft-stat", "Top-event")), exact, 5e-5 if exact > 1e-3 else exact * 0.01)
    cuts = []
    for k in range(1, len(basics) + 1):
        for c in itertools.combinations(basics, k):
            if ft_truth(evs, top, set(c)) and not any(set(m) <= set(c) for m in cuts): cuts.append(c)
    got = sorted(tuple(sorted(re.findall(r"\b([A-Z]+\d*)\b(?= )", r.locator("td").nth(1).inner_text() + " "))) for r in pg.locator(".ft-cuts tbody tr").all())
    want = sorted(tuple(sorted(c)) for c in cuts)
    print(f"  {'ok ' if got == want else 'BAD'} FTA minimal cut sets: page {got}  independent {want}")
    if got != want: FAIL.append("FTA cut sets")
    check("FTA rare-event sum", num(stat(pg, ".ft-stat", "Rare-event")), sum(math.prod(p[b] for b in c) for c in cuts), 5e-5)

# ---------------------------------------------------------------- probability
def test_prob(pg, f, comp):
    slug = "probability-calculator"
    load(pg, slug, {"f": f, "g": {"c": comp}})
    A, B, J = float(f["a"]), float(f["b"]), float(f.get("j") or "nan")
    AB = {"Independent": A*B, "Mutually exclusive": 0.0, "I know P(A and B)": J, "I know P(B given A)": J*A}[f["rel"]]
    U = A + B - AB
    want = {"P(A OR B)": U, "P(A AND B)": AB, "P(A GIVEN B)": AB/B, "P(B GIVEN A)": AB/A, "P(NOT A)": 1-A, "P(NOT B)": 1-B, "P(NEITHER)": 1-U, "P(EXACTLY ONE)": U-AB}
    for k, v in want.items(): check(f"prob {f['rel']}: {k}", num(stat(pg, ".pr-ev", k)), v, 5.1e-5)
    n, r = int(f["n"]), int(f["r"])
    for lab, v in [("Combinations", math.comb(n, r)), ("Permutations", math.perm(n, r)), ("Ordered, with repetition", n ** r), ("Unordered, with repetition", math.comb(n + r - 1, r))]:
        s = stat(pg, ".pr-ct", lab)
        if "10" in s and ("×" in s or "x" in s): check(f"count {lab} n={n} r={r} (leading digits)", num(s), float(v), float(v) * 1e-4)
        else: check(f"count {lab} n={n} r={r}", num(s), v, 0)
    p1, n1 = float(f["p1"]), int(f["n1"])
    check("at least one", num(stat(pg, ".pr-al", "P(at least one")), 1 - (1 - p1) ** n1, 5.1e-5)
    check("tries for 95%", num(stat(pg, ".pr-al", "Tries")), math.ceil(math.log(0.05) / math.log(1 - p1)), 0)
    blocks = {}
    for c in comp: blocks.setdefault(c["blk"], []).append(float(c["r"]))
    Rs = math.prod(1 - math.prod(1 - x for x in v) for v in blocks.values())
    check("system reliability", num(stat(pg, ".pr-sy", "System reliability")), Rs, 5.1e-5)

# ---------------------------------------------------------------- risk register, flowchart
def test_risk(pg):
    slug = "risk-register-heat-map"; load(pg, slug)
    ex = pg.evaluate("()=>window.TOOL.example")
    rows = ex["g"]["r"]; med, high = int(ex["f"]["med"]), int(ex["f"]["high"])
    cells = [r.locator('td[data-c="sc"]').inner_text() for r in pg.locator('table[data-grid="r"] tbody tr').all()]
    for r, c in zip(rows, cells): check(f"risk {r['id']} score", float(c), int(r["l"]) * int(r["i"]), 0)
    lv = lambda s: "High" if s >= high else "Medium" if s >= med else "Low"
    hi0 = sum(lv(int(r["l"]) * int(r["i"])) == "High" for r in rows)
    hi1 = sum(r["l2"] != "" and lv(int(r["l2"]) * int(r["i2"])) == "High" for r in rows)
    check("risk high count as found -> residual", 1.0 if stat(pg, ".rr-stat", "High") == f"{hi0} → {hi1}" else 0.0, 1.0, 0)

def test_flow(pg):
    slug = "flowchart-swimlane"; load(pg, slug)
    ex = pg.evaluate("()=>window.TOOL.example"); s = ex["g"]["s"]
    ids = [x["id"] for x in s]; lane = {x["id"]: x["lane"] for x in s}
    edges = [(x["id"], t.split(":")[-1].strip()) for x in s for t in (x["next"] or "").split(",") if t.strip()]
    loops = sum(ids.index(b) <= ids.index(a) for a, b in edges)
    hand = sum(lane[a] != lane[b] for a, b in edges)
    tot = sum(float(x["t"]) for x in s); va = sum(float(x["t"]) for x in s if x["va"] == "Yes")
    check("flow loops", num(stat(pg, ".fc-stat", "Loops")), loops, 0)
    check("flow handoffs", num(stat(pg, ".fc-stat", "Handoffs")), hand, 0)
    check("flow total time", num(stat(pg, ".fc-stat", "Total time")), tot, 0.5)
    check("flow value-added %", num(stat(pg, ".fc-stat", "Value-added")), round(100 * va / tot), 0)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== critical path, worked example"); test_cpm(pg, None, target=30)
    print("== critical path, fixed durations, two parallel chains")
    test_cpm(pg, {"f": {"unit": "days"}, "g": {"a": [
        {"id": "S", "m": "2"}, {"id": "P", "pred": "S", "m": "5"}, {"id": "Q", "pred": "S", "m": "3"},
        {"id": "R", "pred": "Q", "m": "4"}, {"id": "Z", "pred": "P,R", "m": "1"}]}})
    print("== PERT, target 20"); test_cpm(pg, {"f": {"unit": "weeks", "target": "20"}, "g": {"a": [
        {"id": "1", "a": "2", "m": "4", "b": "12"}, {"id": "2", "pred": "1", "a": "5", "m": "6", "b": "13"},
        {"id": "3", "pred": "1", "a": "1", "m": "2", "b": "3"}, {"id": "4", "pred": "2 3", "a": "3", "m": "5", "b": "7"}]}}, target=20)
    print("== fault tree, worked example"); test_ft(pg, None)
    print("== fault tree, 2-out-of-3 built from gates, with repeats")
    test_ft(pg, {"f": {}, "g": {"e": [
        {"id": "T", "type": "OR gate", "in": "G1 G2 G3"}, {"id": "G1", "type": "AND gate", "in": "X Y"},
        {"id": "G2", "type": "AND gate", "in": "X Z"}, {"id": "G3", "type": "AND gate", "in": "Y Z"},
        {"id": "X", "type": "Basic event", "p": "0.1"}, {"id": "Y", "type": "Basic event", "p": "0.2"}, {"id": "Z", "type": "Basic event", "p": "0.3"}]}})
    print("== probability, worked example")
    test_prob(pg, {"a": "0.6", "b": "0.04", "rel": "I know P(B given A)", "j": "0.05", "n": "10", "r": "3", "p1": "0.02", "n1": "50"},
              [{"blk": "Power", "r": "0.99"}, {"blk": "Pumps", "r": "0.95"}, {"blk": "Pumps", "r": "0.95"}, {"blk": "Control", "r": "0.998"}])
    print("== probability, independent; 52 choose 5")
    test_prob(pg, {"a": "0.3", "b": "0.5", "rel": "Independent", "n": "52", "r": "5", "p1": "0.1", "n1": "7"},
              [{"blk": "A", "r": "0.9"}, {"blk": "A", "r": "0.8"}, {"blk": "A", "r": "0.7"}, {"blk": "B", "r": "0.95"}])
    print("== probability, mutually exclusive; 100 choose 50 (large numbers)")
    test_prob(pg, {"a": "0.25", "b": "0.35", "rel": "Mutually exclusive", "n": "100", "r": "50", "p1": "0.003", "n1": "400"},
              [{"blk": "X", "r": "0.5"}])
    print("== probability, joint given")
    test_prob(pg, {"a": "0.5", "b": "0.4", "rel": "I know P(A and B)", "j": "0.15", "n": "6", "r": "6", "p1": "0.5", "n1": "3"},
              [{"blk": "Only", "r": "0.999"}, {"blk": "Two", "r": "0.6"}, {"blk": "Two", "r": "0.6"}])
    print("== risk register"); test_risk(pg)
    print("== flowchart"); test_flow(pg)
    b.close()
print("\nFAILED: " + ", ".join(FAIL) if FAIL else "\nALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
