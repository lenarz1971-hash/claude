#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b2 tools (Oct 2026):
interrelationship-digraph (arrow counts, key driver and outcome), matrix-diagram
(row and column totals, 9-3-1), force-field-analysis (totals before and after),
process-decision-program-chart and affinity-diagram (counts).

Each case is loaded into the built page in Chromium (Playwright), the figures
are read off the page, and they are compared with a count written here from
scratch in plain Python.

Run: python3 tests/test_b2_numbers.py <out root>   (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, re
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b2"
FAIL = []
def check(name, got, want):
    ok = got == want
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
        state = dict(state, v=1, tool=slug); state.setdefault("x", {}); state.setdefault("g", {}); state.setdefault("f", {})
        pg.evaluate("([k,v])=>localStorage.setItem(k,v)", [f"scqg-tool-{slug}", json.dumps(state)])
        pg.reload()
    pg.wait_for_timeout(250)
    return state or pg.evaluate("()=>window.TOOL.example")

def stat(pg, sel, label_start):
    for d in pg.locator(sel + " > div").all():
        if d.locator("span").inner_text().upper().startswith(label_start.upper()): return d.locator("b").inner_text()
    raise KeyError(label_start)

def lines(s): return [x.strip() for x in (s or "").split("\n") if x.strip()]

# ---------------------------------------------------------------- digraph
def test_digraph(pg, state=None):
    st = load(pg, "interrelationship-digraph", state)
    ids = []
    for r in st["g"]["i"]:
        i = (r.get("id") or "").strip()
        if i and i not in ids: ids.append(i)
    arrows = set()
    for r in st["g"]["a"]:
        a, b = (r.get("from") or "").strip(), (r.get("to") or "").strip()
        if a in ids and b in ids and a != b: arrows.add((a, b))
    out = {i: sum(1 for a, b in arrows if a == i) for i in ids}
    inn = {i: sum(1 for a, b in arrows if b == i) for i in ids}
    rows = {r.locator("td").nth(0).inner_text(): [c.inner_text() for c in r.locator("td").all()] for r in pg.locator(".id-tab tbody tr").all()}
    for i in ids:
        check(f"ID {i} out", int(rows[i][2]), out[i]); check(f"ID {i} in", int(rows[i][3]), inn[i]); check(f"ID {i} total", int(rows[i][4]), out[i] + inn[i])
    check("ID arrows", int(stat(pg, ".id-stat", "Arrows")), len(arrows))
    mo, mi = max(out.values()), max(inn.values())
    check("ID key driver", stat(pg, ".id-stat", "Key driver"), ", ".join(i for i in ids if out[i] == mo) if mo else "—")
    check("ID key outcome", stat(pg, ".id-stat", "Key outcome"), ", ".join(i for i in ids if inn[i] == mi) if mi else "—")

# ---------------------------------------------------------------- matrix
SYM = {"◎ 9": 9, "○ 3": 3, "△ 1": 1}
def test_matrix(pg, state=None):
    st = load(pg, "matrix-diagram", state)
    f, m = st["f"], st["x"].get("m", {})
    T = (f.get("shape") or "").startswith("T")
    dd = lambda L: list(dict.fromkeys(L))
    A, B, C = dd(lines(f.get("la"))), dd(lines(f.get("lb"))), dd(lines(f.get("lc"))) if T else []
    v = lambda blk, r, c: SYM.get(m.get(f"{blk}|{r}|{c}", ""), 0)
    for blk, L in (("A", A), ("C", C)):
        for i, r in enumerate(L):
            check(f"matrix row total {blk} {r}", int(pg.locator(f'[data-rt="{blk}{i}"]').inner_text()), sum(v(blk, r, c) for c in B))
        if L:
            for j, c in enumerate(B):
                check(f"matrix column total {blk} {c}", int(pg.locator(f'[data-ct="{blk}{j}"]').inner_text()), sum(v(blk, r, c) for r in L))
    if T:
        for j, c in enumerate(B):
            check(f"matrix column total both {c}", int(pg.locator(f'[data-ct="T{j}"]').inner_text()), sum(v("A", r, c) for r in A) + sum(v("C", r, c) for r in C))
    cells = len(B) * (len(A) + len(C)); marks = sum(1 for blk, L in (("A", A), ("C", C)) for r in L for c in B if v(blk, r, c))
    check("matrix cells marked", stat(pg, ".mx-stat", "Cells marked"), f"{marks} of {cells}")
    check("matrix strong", int(stat(pg, ".mx-stat", "Strong")), sum(1 for blk, L in (("A", A), ("C", C)) for r in L for c in B if v(blk, r, c) == 9))

# ---------------------------------------------------------------- force field
def test_ff(pg, state=None, want=None):
    st = load(pg, "force-field-analysis", state)
    def w(x):
        try: x = float(x)
        except (TypeError, ValueError): return None
        return x if 1 <= x <= 5 and x == int(x) else None
    def tot(rows, after):
        t = 0
        for r in rows:
            if not (r.get("f") or "").strip(): continue
            a = w(r.get("w")); b = w(r.get("w2")) if after else None
            t += (b if b is not None else (a or 0))
        return int(t)
    D, R = st["g"]["d"], st["g"]["r"]
    dT, rT, dA, rA = tot(D, 0), tot(R, 0), tot(D, 1), tot(R, 1)
    if want: check("FF hand-worked totals", (dT, rT, dA, rA), want)
    sg = lambda x: ("+" if x > 0 else "−" if x < 0 else "") + str(abs(x))
    check("FF driving total", int(stat(pg, ".ff-stat", "Driving total")), dT)
    check("FF restraining total", int(stat(pg, ".ff-stat", "Restraining total")), rT)
    check("FF balance", stat(pg, ".ff-stat", "Balance (driving"), sg(dT - rT))
    if any(w(r.get("w2")) for r in D + R if (r.get("f") or "").strip()):
        check("FF totals after", stat(pg, ".ff-stat", "Totals after"), f"{dA} vs {rA}")
        check("FF balance after", stat(pg, ".ff-stat", "Balance after"), sg(dA - rA))

# ---------------------------------------------------------------- PDPC, affinity
def test_pdpc(pg, state=None):
    st = load(pg, "process-decision-program-chart", state)
    steps = []; cs = cr = None
    for r in st["g"]["p"]:
        s, q, c = ((r.get(k) or "").strip() for k in ("s", "r", "c"))
        if not (s or q or c): continue
        if s or cs is None: cs = []; steps.append(cs); cr = None
        if q or (c and cr is None): cr = []; cs.append(cr)
        if c: cr.append((r.get("ok") or "")[:1])
    nR = sum(len(s) for s in steps); nC = sum(len(r) for s in steps for r in s)
    nO = sum(r.count("O") for s in steps for r in s); nX = sum(r.count("X") for s in steps for r in s)
    cov = sum(1 for s in steps for r in s if "O" in r)
    check("PDPC steps", int(stat(pg, ".pd-stat", "Plan steps")), len(steps))
    check("PDPC problems", int(stat(pg, ".pd-stat", "Things that")), nR)
    check("PDPC countermeasures", stat(pg, ".pd-stat", "Countermeasures"), str(nC))
    check("PDPC O/X label", pg.locator(".pd-stat > div").nth(2).locator("span").inner_text().upper(), f"COUNTERMEASURES ({nO} O, {nX} X)")
    check("PDPC covered", stat(pg, ".pd-stat", "Problems with"), f"{cov} of {nR}")

def test_affinity(pg, state=None):
    st = load(pg, "affinity-diagram", state)
    cards = [r for r in st["g"]["c"] if (r.get("t") or "").strip()]
    groups = {}
    for r in cards:
        g = (r.get("g") or "").strip().upper()
        if g: groups[g] = groups.get(g, 0) + 1
    check("affinity cards", int(stat(pg, ".af-stat", "Cards")), len(cards))
    check("affinity groups", int(stat(pg, ".af-stat", "Groups")), len(groups))
    check("affinity ungrouped", int(stat(pg, ".af-stat", "Not yet")), sum(1 for r in cards if not (r.get("g") or "").strip()))
    check("affinity largest", int(stat(pg, ".af-stat", "Largest")), max(groups.values(), default=0))

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    print("== digraph, worked example"); test_digraph(pg)
    print("== digraph: duplicate, self-loop, unknown ID, two-way pair, isolated issue, tied drivers")
    test_digraph(pg, {"g": {"i": [{"id": "A", "t": "a"}, {"id": "B", "t": "b"}, {"id": "C", "t": "c"}, {"id": "D", "t": "d"}, {"id": "E", "t": "isolated"}],
        "a": [{"from": "A", "to": "B"}, {"from": "A", "to": "B"}, {"from": "A", "to": "C"}, {"from": "B", "to": "C"}, {"from": "C", "to": "B"},
              {"from": "D", "to": "D"}, {"from": "D", "to": "Z"}, {"from": "D", "to": "C"}, {"from": "D", "to": "A"}]}})
    print("== digraph: no arrows"); test_digraph(pg, {"g": {"i": [{"id": "1", "t": "x"}, {"id": "2", "t": "y"}], "a": [{}]}})
    print("== matrix, worked example (T-shaped)"); test_matrix(pg)
    print("== matrix, L-shaped, duplicate column name, empty row and column")
    test_matrix(pg, {"f": {"shape": "L-shaped (two lists)", "la": "R1\nR2\nR3", "lb": "C1\nC2\nC1\nC3", "lc": "ignored"},
        "x": {"m": {"A|R1|C1": "◎ 9", "A|R1|C2": "◎ 9", "A|R2|C1": "△ 1", "A|R2|C2": "○ 3", "C|ignored|C1": "◎ 9"}}})
    print("== force field, worked example (hand-worked: 5+4+3+2=14, 4+4+3+3=14; after 5+4+4+2=15, 2+2+2+1=7)")
    test_ff(pg, None, want=(14, 14, 15, 7))
    print("== force field: invalid weights ignored, no after weights")
    test_ff(pg, {"g": {"d": [{"f": "a", "w": "5"}, {"f": "b", "w": "6"}, {"f": "c", "w": "2.5"}, {"f": "", "w": "4"}],
                       "r": [{"f": "x", "w": "3"}, {"f": "y", "w": "1"}, {"f": "z", "w": ""}]}}, want=(5, 4, 5, 4))
    print("== force field: restraining stronger; after weights on some rows")
    test_ff(pg, {"g": {"d": [{"f": "a", "w": "2", "w2": "3"}, {"f": "b", "w": "1"}],
                       "r": [{"f": "x", "w": "5", "w2": "4"}, {"f": "y", "w": "4"}, {"f": "z", "w": "3", "w2": "1"}]}}, want=(3, 12, 4, 9))
    print("== PDPC, worked example"); test_pdpc(pg)
    print("== PDPC: countermeasure with no problem, step with nothing, unmarked")
    test_pdpc(pg, {"f": {"goal": "g"}, "g": {"p": [{"s": "S1", "c": "c1", "ok": "O practical"}, {"s": "S2"}, {"s": "S3", "r": "r1"}, {"c": "c2"}, {"c": "c3", "ok": "X impractical"}, {"r": "r2", "c": "c4", "ok": "X impractical"}]}})
    print("== affinity, worked example"); test_affinity(pg)
    print("== affinity: lower-case codes, code with no header")
    test_affinity(pg, {"g": {"c": [{"t": "one", "g": "a"}, {"t": "two", "g": "A"}, {"t": "three", "g": "Q"}, {"t": "four"}, {"t": "  "}], "h": [{"code": "A", "h": "Header for A here"}, {"code": "B", "h": "Empty"}]}})
    b.close()
print("\nFAILED: " + ", ".join(FAIL) if FAIL else "\nALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
