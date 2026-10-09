#!/usr/bin/env python3
"""Independent checks of the numbers shown by the batch-b5 tools (calibration and
metrology, Oct 2026):
  si-metrology-unit-converter, imte-accuracy-specification, tur-tar-guard-band-pfa,
  calibration-certificate-label, rounding-significant-figures,
  calibration-table-interpolation.

Each case is loaded into the built page in a real browser (Chromium via Playwright),
the figures are read off the page, and they are compared with an implementation
written here from scratch:
  - unit factors rebuilt from the defining constants with exact fractions
    (inch = 0.0254 m, lb = 0.45359237 kg, g_n = 9.80665 m/s^2, NIST SP 811);
  - notation and rounding with Python's decimal module;
  - PFA / PFR with SciPy (dblquad, quad) and a Monte Carlo cross-check;
  - interpolation with numpy.interp and numpy.polyfit;
  - due dates with calendar month arithmetic.

Run: python3 tests/test_b5_numbers.py <out root>    (after build_preview.py)"""
import http.server, socketserver, threading, os, sys, json, math, re, random, calendar, datetime
from fractions import Fraction as Fr
from decimal import Decimal as D, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_DOWN, localcontext
import numpy as np
from scipy.stats import norm
from scipy.integrate import quad, dblquad
from scipy.optimize import brentq
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "out_b5"
FAIL = []; N = [0]
def check(name, got, want, tol, quiet=False):
    N[0] += 1
    ok = got is not None and want is not None and abs(got - want) <= tol
    if not ok or not quiet: print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)
def same(name, got, want, quiet=False):
    N[0] += 1; ok = got == want
    if not ok or not quiet: print(f"  {'ok ' if ok else 'BAD'} {name}: page {got!r}  independent {want!r}")
    if not ok: FAIL.append(name)

def num(s):
    s = s.replace(",", "").replace("−", "-").replace("±", "").strip()
    m = re.match(r"^(-?[\d.]+)\s*×\s*10\s*(-?\d+)", s)
    if m: return float(m.group(1)) * 10 ** int(m.group(2))
    m = re.match(r"^[-+]?[\d.]+(e[-+]?\d+)?", s)
    return float(m.group(0)) if m else None

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
    else:   # no state given: start fresh, so the page loads its worked example
        pg.evaluate("k=>localStorage.removeItem(k)", f"scqg-tool-{slug}")
    pg.reload()
    pg.wait_for_timeout(250)

def stats(pg, sel):
    return [(d.locator("span").inner_text(), d.locator("b").inner_text()) for d in pg.locator(sel + " > div").all()]
def stat(pg, sel, label_start):
    for lab, val in stats(pg, sel):
        if lab.upper().startswith(label_start.upper()): return val
    raise KeyError(label_start)
def cells(pg, grid, col):
    return [r.locator(f'td[data-c="{col}"]').inner_text().strip() for r in pg.locator(f'table[data-grid="{grid}"] tbody tr').all()]

# ====================================================================== units
inch = Fr("0.0254"); ft = 12 * inch; yd = 3 * ft; mi = 5280 * ft; lb = Fr("0.45359237"); gn = Fr("9.80665")
lbf = lb * gn; gal = 231 * inch ** 3; Btu = Fr("1055.05585262"); mmHg = Fr("13595.1") * gn * Fr("0.001")
F = {
 "Length": {"m": 1, "km": 1000, "cm": Fr(1, 100), "mm": Fr(1, 1000), "µm": Fr(1, 10**6), "nm": Fr(1, 10**9), "in": inch, "ft": ft, "yd": yd, "mi": mi,
            "mil": inch / 1000, "µin": inch / 10**6, "nmi": 1852},
 "Area": {"m²": 1, "cm²": Fr(1, 10**4), "mm²": Fr(1, 10**6), "km²": 10**6, "ha": 10**4, "in²": inch**2, "ft²": ft**2, "yd²": yd**2, "acre": 43560 * ft**2, "mi²": mi**2},
 "Volume and capacity": {"m³": 1, "L": Fr(1, 1000), "mL": Fr(1, 10**6), "cm³": Fr(1, 10**6), "mm³": Fr(1, 10**9), "in³": inch**3, "ft³": ft**3, "yd³": yd**3,
            "gal": gal, "qt": gal / 4, "pt": gal / 8, "fl oz": gal / 128, "gal (UK)": Fr("0.00454609")},
 "Mass": {"kg": 1, "g": Fr(1, 1000), "mg": Fr(1, 10**6), "µg": Fr(1, 10**9), "t": 1000, "lb": lb, "oz": lb / 16, "gr": lb / 7000, "ton": 2000 * lb, "slug": lbf / ft},
 "Force": {"N": 1, "kN": 1000, "mN": Fr(1, 1000), "lbf": lbf, "ozf": lbf / 16, "kgf": gn, "kip": 1000 * lbf, "dyn": Fr(1, 10**5), "pdl": lb * ft},
 "Pressure": {"Pa": 1, "kPa": 1000, "MPa": 10**6, "hPa": 100, "bar": 10**5, "mbar": 100, "psi": lbf / inch**2, "ksi": 1000 * lbf / inch**2, "atm": 101325,
            "Torr": Fr(101325, 760), "mmHg": mmHg, "inHg": mmHg * Fr("25.4"), "inH₂O": 1000 * gn * inch, "kgf/cm²": gn * 10**4},
 "Temperature difference": {"ΔK": 1, "Δ°C": 1, "Δ°F": Fr(5, 9), "Δ°R": Fr(5, 9)},
 "Torque": {"N·m": 1, "N·cm": Fr(1, 100), "mN·m": Fr(1, 1000), "kN·m": 1000, "lbf·ft": lbf * ft, "lbf·in": lbf * inch, "ozf·in": lbf / 16 * inch, "kgf·m": gn, "kgf·cm": gn / 100},
 "Flow (volume)": {"m³/s": 1, "m³/h": Fr(1, 3600), "L/s": Fr(1, 1000), "L/min": Fr(1, 60000), "mL/min": Fr(1, 6 * 10**7), "gal/min": gal / 60, "gal/h": gal / 3600,
            "ft³/min": ft**3 / 60, "ft³/s": ft**3},
 "Energy": {"J": 1, "mJ": Fr(1, 1000), "kJ": 1000, "MJ": 10**6, "Wh": 3600, "kWh": 3600000, "cal": Fr("4.184"), "cal (IT)": Fr("4.1868"), "Btu": Btu, "ft·lbf": lbf * ft,
            "eV": Fr("1.602176634e-19"), "erg": Fr(1, 10**7)},
 "Power": {"W": 1, "mW": Fr(1, 1000), "kW": 1000, "MW": 10**6, "hp": 550 * lbf * ft, "hp (metric)": 75 * gn, "Btu/h": Btu / 3600, "ft·lbf/s": lbf * ft},
 "Speed": {"m/s": 1, "km/h": Fr(1000, 3600), "mi/h": mi / 3600, "ft/s": ft, "ft/min": ft / 60, "in/s": inch, "kn": Fr(1852, 3600)},
}
def temp_to_K(u, v):
    return {"°C": v + Fr("273.15"), "°F": (v + Fr("459.67")) * Fr(5, 9), "K": v, "°R": v * Fr(5, 9)}[u]
def temp_from_K(u, k):
    return {"°C": k - Fr("273.15"), "°F": k * Fr(9, 5) - Fr("459.67"), "K": k, "°R": k * Fr(9, 5)}[u]
def conv(q, a, b, v):
    v = Fr(str(v))
    if q == "Temperature": return float(temp_from_K(b, temp_to_K(a, v)))
    return float(v * Fr(F[q][a]) / Fr(F[q][b]))
def rel(x): return max(abs(x) * 6e-8, 1e-300)   # 8 significant digits on the page

def test_units(pg):
    slug = "si-metrology-unit-converter"
    print("== unit converter: every unit of every quantity (all-units table)")
    for q, units in list(F.items()) + [("Temperature", {"°C": 0, "°F": 0, "K": 0, "°R": 0})]:
        syms = list(units)
        for a, v in [(syms[0], "1.2345"), (syms[-1], "-47.5" if q in ("Temperature", "Temperature difference") else "987.65")]:
            load(pg, slug, {"f": {"q": q, "v": v, "fu": a, "tu": syms[1]}})
            rows = pg.locator(".uc-all tbody tr").all()
            same(f"{q}: unit list", [r.locator("td").nth(0).inner_text() for r in rows], syms, quiet=True)
            for r in rows:
                b = r.locator("td").nth(0).inner_text(); got = num(r.locator("td").nth(2).inner_text()); want = conv(q, a, b, v)
                check(f"{q}: {v} {a} -> {b}", got, want, rel(want), quiet=True)
            main = stat(pg, ".uc-main", v)
            check(f"{q}: main result {v} {a} -> {syms[1]}", num(main), conv(q, a, syms[1], v), rel(conv(q, a, syms[1], v)), quiet=True)
            if q != "Temperature":
                fac = float(Fr(F[q][a]) / Fr(F[q][syms[1]]))
                check(f"{q}: factor {a}->{syms[1]}", num(stat(pg, ".uc-main", "Multiply by")), fac, abs(fac) * 6e-10, quiet=True)
    print(f"  checked {N[0]} unit values so far")
    print("== unit converter: worked example and a worksheet of typed symbols")
    ws = [("0.750", "in", "mm", "Length", "in", "mm"), ("25", "lbf·ft", "N·m", "Torque", "lbf·ft", "N·m"), ("68", "°F", "°C", "Temperature", "°F", "°C"),
          ("2.5", "gal", "L", "Volume and capacity", "gal", "L"), ("12", "kgf", "N", "Force", "kgf", "N"), ("30", "gpm", "L/min", "Flow (volume)", "gal/min", "L/min"),
          ("0.0005", "in", "µm", "Length", "in", "µm"), ("3.6", "Δ°F", "Δ°C", "Temperature difference", "Δ°F", "Δ°C"), ("100", "in-lb", "Nm", "Torque", "lbf·in", "N·m"),
          ("-40", "F", "C", "Temperature", "°F", "°C"), ("300", "K", "degF", "Temperature", "K", "°F"), ("14.7", "psi", "inHg", "Pressure", "psi", "inHg"),
          ("1", "Btu", "ft-lbf", "Energy", "Btu", "ft·lbf"), ("1", "ft-lbf", "J", "Energy", "ft·lbf", "J"), ("1", "ft-lbf", "N·m", "Torque", "lbf·ft", "N·m"), ("60", "mph", "km/h", "Speed", "mi/h", "km/h"), ("1", "acre", "ft2", "Area", "acre", "ft²"),
          ("5", "um", "uin", "Length", "µm", "µin"), ("1", "hp", "kW", "Power", "hp", "kW"), ("16", "oz", "g", "Mass", "oz", "g")]
    load(pg, slug, {"f": {"q": "Length", "v": "1", "fu": "m", "tu": "mm"}, "g": {"w": [{"v": v, "f": a, "t": b} for v, a, b, *_ in ws] + [{"v": "1", "f": "lbf", "t": "kg"}, {"v": "1", "f": "furlong", "t": "m"}]}})
    res = cells(pg, "w", "r")
    for (v, a, b, q, ca, cb), got in zip(ws, res):
        want = conv(q, ca, cb, v); check(f"worksheet {v} {a} -> {b}", num(got), want, rel(want))
    same("worksheet: force to mass is refused", "≠" in res[-2], True)
    same("worksheet: unknown unit is flagged", "unknown unit" in res[-1], True)
    print("== unit converter: notation, prefixes, angles, ratios, dB")
    def notation(s, n):
        d = D(float(s))   # the page works on the binary double, as JavaScript toExponential does
        with localcontext() as c:
            c.prec = n; c.rounding = ROUND_HALF_UP; r = +d
        e = r.adjusted(); m = r.scaleb(-e)
        sci = f"{m:.{n-1}f} × 10{e}"
        e3 = (e // 3) * 3; me = r.scaleb(-e3); dec = max(n - 1 - (e - e3), 0)
        eng = f"{me:.{dec}f} × 10{e3}"
        return sci.replace("-", "−", 1) if s.startswith("-") else sci, eng.replace("-", "−", 1) if s.startswith("-") else eng
    for s, n in [("0.000045670", None), ("123456789", 4), ("-0.0009995", 3), ("6.02214076e23", 5), ("299792458", 9), ("0.125", 2), ("47000", 2), ("1.5e-14", 2)]:
        load(pg, slug, {"f": {"nx": s, "nd": str(n) if n else "", "nu": "Ω"}})
        nn = n or len(D(s).as_tuple().digits)
        sci, eng = notation(s, nn)
        same(f"scientific {s} ({nn} digits)", stat(pg, ".uc-nt", "Scientific"), sci)
        same(f"engineering {s}", stat(pg, ".uc-nt", "Engineering"), eng)
    for v, a, b, want in [("4.7", "M mega 10^6", "k kilo 10^3", 4700), ("250", "µ micro 10^-6", "m milli 10^-3", 0.25), ("0.33", "(no prefix) 10^0", "n nano 10^-9", 3.3e8)]:
        load(pg, slug, {"f": {"pv": v, "pf": a, "pt": b}})
        check(f"prefix {v} {a.split()[1]} -> {b.split()[1]}", num(pg.locator(".uc-pf > div > b").first.inner_text()), want, abs(want) * 1e-9)
    def dms(deg, dp):
        neg = deg < 0; a = abs(deg); d = int(a); mf = (a - d) * 60; m = int(mf); s = round((mf - m) * 60, dp)
        if s >= 60: s -= 60; m += 1
        if m >= 60: m -= 60; d += 1
        return f"{'−' if neg else ''}{d}° {m:02d}′ {s:0{3 + dp if dp else 2}.{dp}f}″"
    for txt, unit, deg in [("12° 30′ 15″", "Degrees, minutes, seconds", 12 + 30/60 + 15/3600), ("1", "Radians", math.degrees(1)), ("100", "Grads (gon)", 90.0),
                           ("-0.75", "Decimal degrees", -0.75), ("1600", "Mils (NATO, 6400 per turn)", 90.0), ("45:59:59.996", "Degrees, minutes, seconds", 45 + 59/60 + 59.996/3600)]:
        load(pg, slug, {"f": {"av": txt, "au": unit, "ad": "2"}})
        same(f"angle {txt} {unit}: DMS", stat(pg, ".uc-an", "Degrees, minutes"), dms(deg, 2))
        check(f"angle {txt}: decimal degrees", num(stat(pg, ".uc-an", "Decimal degrees")), deg, abs(deg) * 1e-9 + 1e-12)
        check(f"angle {txt}: radians", num(stat(pg, ".uc-an", "Radians")), math.radians(deg), abs(math.radians(deg)) * 1e-9 + 1e-12)
        check(f"angle {txt}: grads", num(stat(pg, ".uc-an", "Grads")), deg * 400 / 360, abs(deg) * 1e-9 + 1e-12)
        check(f"angle {txt}: arcseconds", num(stat(pg, ".uc-an", "Arcseconds")), deg * 3600, abs(deg) * 3600 * 1e-9 + 1e-9)
        check(f"angle {txt}: mils", num(stat(pg, ".uc-an", "NATO")), deg * 6400 / 360, abs(deg) * 1e-8 + 1e-12)
    for rv, ra, frac in [("250", "Parts per million (ppm)", 250e-6), ("0.15", "Percent (%)", 0.0015), ("40", "Parts per billion (ppb)", 4e-8)]:
        load(pg, slug, {"f": {"rv": rv, "ra": ra, "dr": "2", "dk": "Amplitude ratio: voltage, current, pressure (V2/V1)", "dv": "-3"}})
        check(f"ratio {rv} {ra}: ppm", num(stat(pg, ".uc-ra", "ppm")), frac * 1e6, frac * 1e6 * 1e-9)
        check(f"ratio {rv} {ra}: percent", num(stat(pg, ".uc-ra", "Percent")), frac * 100, frac * 100 * 1e-9)
    check("dB, amplitude ratio 2", num(pg.locator(".uc-db > div > b").first.inner_text()), 20 * math.log10(2), 1e-5)
    check("-3 dB as power ratio", num(stat(pg, ".uc-db", "Power ratio")), 10 ** -0.3, 1e-7)
    check("-3 dB as amplitude ratio", num(stat(pg, ".uc-db", "Amplitude ratio")), 10 ** -0.15, 1e-7)
    load(pg, slug)
    check("worked example dB of power ratio 0.5", num(pg.locator(".uc-db > div > b").first.inner_text()), 10 * math.log10(0.5), 1e-5)

# ====================================================================== IM&TE spec
def test_imte(pg, f, pts):
    slug = "imte-accuracy-specification"; load(pg, slug, {"f": f, "g": {"p": pts}} if f else None)
    if not f:
        ex = pg.evaluate("()=>window.TOOL.example"); f, pts = ex["f"], ex["g"]["p"]
    sc = 1e-6 if "ppm" in (f.get("rel") or "") else 1e-2
    g = lambda k: float(f[k]) if f.get(k) not in (None, "") else 0.0
    R, res = g("rng"), g("res")
    def E(x):
        s = g("rd") * sc * abs(x) + g("rg") * sc * R + g("cnt") * res + g("fx")
        return max(s, g("fl"))
    es, los, his, vs, ers = (cells(pg, "p", c) for c in ("e", "lo", "hi", "v", "er"))
    for p, e, lo, hi, v, er in zip(pts, es, los, his, vs, ers):
        x = float(p["nom"]); want = E(x); rs = f.get("res") or ""; dec = len(rs.split(".")[1]) + 1 if "." in rs else None
        tol = 0.51 * 10 ** -dec if dec else want * 1e-5
        check(f"IM&TE {f['ins'][:28]} @ {x}: allowed ±", num(e), want, tol)
        check(f"IM&TE @ {x}: low limit", num(lo), x - want, tol); check(f"IM&TE @ {x}: high limit", num(hi), x + want, tol)
        if p.get("rd"):
            y = float(p["rd"]); check(f"IM&TE @ {x}: error", num(er), y - x, tol)
            same(f"IM&TE @ {x}: verdict", "In tolerance" in v, abs(y - x) <= want + 1e-12)
    br = float(f["br"]) if f.get("br") else R
    rs = f.get("res") or ""
    check(f"IM&TE breakdown at {br}", num(stat(pg, ".is-stat", "Allowed error")), E(br), 0.51 * 10 ** -(len(rs.split(".")[1]) + 1) if "." in rs else E(br) * 1e-5)

# ====================================================================== TUR, PFA, PFR
def risk(mu, sp, um, L, U, aL, aU):
    pacc = lambda x: norm.cdf((aU - x) / um) - norm.cdf((aL - x) / um)
    pts = [p for p in (aL, aU) if L < p < U]
    pfa = quad(lambda x: norm.pdf(x, mu, sp) * pacc(x), -np.inf, L, limit=200, epsabs=1e-13)[0] + quad(lambda x: norm.pdf(x, mu, sp) * pacc(x), U, np.inf, limit=200, epsabs=1e-13)[0]
    pfr = quad(lambda x: norm.pdf(x, mu, sp) * (1 - pacc(x)), L, U, points=pts or None, limit=200, epsabs=1e-13)[0]
    return pfa, pfr
def risk_dbl(mu, sp, um, L, U, aL, aU):
    """PFA and PFR as true double integrals over (x = true value, e = measurement error)."""
    j = lambda e, x: norm.pdf(x, mu, sp) * norm.pdf(e, 0, um)
    lo, hi = mu - 10 * sp, mu + 10 * sp
    fa = dblquad(j, lo, L, lambda x: aL - x, lambda x: aU - x, epsabs=1e-12)[0] + dblquad(j, U, hi, lambda x: aL - x, lambda x: aU - x, epsabs=1e-12)[0]
    acc_in = dblquad(j, L, U, lambda x: aL - x, lambda x: aU - x, epsabs=1e-12)[0]
    return fa, (norm.cdf((U - mu) / sp) - norm.cdf((L - mu) / sp)) - acc_in

def test_tur(pg, f, dbl=False, mc=False):
    slug = "tur-tar-guard-band-pfa"
    if not f: load(pg, slug); f = pg.evaluate("()=>window.TOOL.example")["f"]
    load(pg, slug, {"f": f})
    L, U, Ue = float(f["ltl"]), float(f["utl"]), float(f["U"]); k = float(f.get("k") or 2); um = Ue / k
    mid, T = (L + U) / 2, (U - L) / 2; mu = float(f["mu"]) if f.get("mu") else mid
    if f["pm"].startswith("Standard"): sp = float(f["pv"])
    else:
        R = float(f["pv"]) / 100
        sp = brentq(lambda s: norm.cdf((U - mu) / s) - norm.cdf((L - mu) / s) - R, T * 1e-6, T * 1e3, xtol=1e-15)
    tur = (U - L) / (2 * Ue)
    print(f"== TUR / PFA: {f.get('what', '')[:60]}")
    check("TUR", num(stat(pg, ".tg-stat", "TUR")), tur, 0.006)
    if f.get("acc"): check("TAR", num(stat(pg, ".tg-stat", "TAR")), T / float(f["acc"]), 0.006)
    check("population sd", num(stat(pg, ".tg-stat", "Population standard")), sp, sp * 6e-4)
    check("EOPR %", num(stat(pg, ".tg-stat", "In-tolerance")), 100 * (norm.cdf((U - mu) / sp) - norm.cdf((L - mu) / sp)), 0.051)
    M = 1.04 - math.exp(0.38 * math.log(tur) - 0.54)
    A = {"None": T, "Subtract U": T - Ue, "RSS": math.sqrt(T * T - Ue * Ue) if Ue < T else None, "Managed": T - Ue * max(M, 0)}
    if f.get("tgt"):
        tg = float(f["tgt"]) / 100
        A["Solve"] = brentq(lambda a: risk(mu, sp, um, L, U, mid - a, mid + a)[0] - tg, 1e-6 * T, 3 * T, xtol=1e-12)
    rows = pg.locator(".tg-t tbody tr").all()
    for r in rows:
        c = [x.inner_text() for x in r.locator("td").all()]
        key = next((k2 for k2 in ("None", "Subtract U", "RSS", "Managed", "Solve", "Custom") if c[0].startswith(k2)), None)
        if key == "Custom": aL, aU = float(f["cal"]), float(f["cau"])
        elif A.get(key) is None or A[key] <= 0:
            same(f"{key}: no acceptance zone", c[1], "none left"); continue
        else: aL, aU = mid - A[key], mid + A[key]
        lims = [num(x) for x in c[1].replace("−", "-").split(" to ")]
        dp = len(c[1].split(" to ")[0].split(".")[1]) if "." in c[1] else 0
        check(f"{key}: lower acceptance limit", lims[0], aL, 0.51 * 10 ** -dp + (2e-9 if key == "Solve" else 0))
        check(f"{key}: upper acceptance limit", lims[1], aU, 0.51 * 10 ** -dp + (2e-9 if key == "Solve" else 0))
        pfa, pfr = risk(mu, sp, um, L, U, aL, aU)
        for nm, got, want in (("PFA", c[3], pfa), ("PFR", c[4], pfr)):
            g = num(got); s = got.rstrip("%"); d = len(s.split(".")[1]) if "." in s else 0
            check(f"{key}: {nm} % (display)", g, 100 * want, 0.5001 * 10 ** -d + 1e-9)
        jf = pg.evaluate("([a,b])=>{const T=window.TOOL,h=T.h,api={state:()=>JSON.parse(localStorage.getItem('scqg-tool-tur-tar-guard-band-pfa')),num:v=>v===''||v==null?NaN:Number(v)};const o=h.model(api);const r=h.risk(o,a,b);return [r.pfa,r.pfr];}", [aL, aU])
        check(f"{key}: PFA full precision vs SciPy quad", jf[0], pfa, max(abs(pfa) * 1e-6, 1e-11))
        check(f"{key}: PFR full precision vs SciPy quad", jf[1], pfr, max(abs(pfr) * 1e-6, 1e-11))
        if dbl:
            fa2, fr2 = risk_dbl(mu, sp, um, L, U, aL, aU)
            check(f"{key}: PFA vs SciPy dblquad", jf[0], fa2, max(abs(fa2) * 1e-5, 1e-10))
            check(f"{key}: PFR vs SciPy dblquad", jf[1], fr2, max(abs(fr2) * 1e-5, 1e-10))
        if mc:
            rng = np.random.default_rng(20261009); n = 4_000_000
            x = rng.normal(mu, sp, n); y = x + rng.normal(0, um, n); acc = (y >= aL) & (y <= aU); inn = (x >= L) & (x <= U)
            pa, pr = np.mean(acc & ~inn), np.mean(~acc & inn)
            check(f"{key}: PFA vs Monte Carlo (4 sigma)", jf[0], pa, 4 * math.sqrt(pa * (1 - pa) / n) + 1e-6)
            check(f"{key}: PFR vs Monte Carlo (4 sigma)", jf[1], pr, 4 * math.sqrt(pr * (1 - pr) / n) + 1e-6)

# ====================================================================== certificate
RULES = ["Simple acceptance (w = 0)", "Guarded acceptance, w = U (binary)", "Non-binary: pass, conditional pass, conditional fail, fail"]
def decide(v, lo, hi, U, rule):
    U = U or 0.0
    inT, inG, inX = lo <= v <= hi, lo + U <= v <= hi - U, lo - U <= v <= hi + U
    if rule == RULES[0]: return "Pass" if inT else "Fail"
    if rule == RULES[1]: return "Pass" if inG else "Fail"
    return "Pass" if inG else "Conditional pass" if inT else "Conditional fail" if inX else "Fail"
def add_months(d, m):
    y, mo = divmod(d.month - 1 + m, 12); y += d.year; mo += 1
    return datetime.date(y, mo, min(d.day, calendar.monthrange(y, mo)[1]))
def test_cert(pg, f, ms):
    slug = "calibration-certificate-label"; load(pg, slug, {"f": f, "g": {"m": ms, "std": [{}]}} if f else None)
    if not f:
        ex = pg.evaluate("()=>window.TOOL.example"); f, ms = ex["f"], ex["g"]["m"]
    print(f"== certificate: {f['rule'][:40]}, cal {f['cdate']} + {f['int']} months")
    ar, lr, ae = cells(pg, "m", "ar"), cells(pg, "m", "lr"), cells(pg, "m", "ae")
    for m, a, l, e in zip(ms, ar, lr, ae):
        lo, hi, U = float(m["lo"]), float(m["hi"]), float(m["U"]) if m.get("U") else 0.0
        af = float(m["af"]); al = float(m["al"]) if m.get("al") else af
        same(f"cert {m['pt']}: as found {af}", a, decide(af, lo, hi, U, f["rule"]))
        same(f"cert {m['pt']}: as left {al}", l, decide(al, lo, hi, U, f["rule"]))
        check(f"cert {m['pt']}: error as found", num(e), af - float(m["nom"]), 1e-9)
    d = add_months(datetime.date.fromisoformat(f["cdate"]), int(f["int"]))
    same("cert due date", stat(pg, ".cc-stat", "Calibration due"), f"{d:%b} {d.day}, {d.year}")
    nb = sum(decide(float(m["af"]), float(m["lo"]), float(m["hi"]), float(m.get("U") or 0), f["rule"]) in ("Fail", "Conditional fail") for m in ms)
    check("cert count out of tolerance as found", num(stat(pg, ".cc-stat", "Out of tolerance as found")), nb, 0)

# ====================================================================== rounding
RM = {0: ROUND_HALF_UP, 1: ROUND_HALF_EVEN, 2: ROUND_DOWN}
def py_round(s, mode, n, inc, rule):
    d = D(s.replace("−", "-"))
    if mode == "Decimal places": q = d.quantize(D(1).scaleb(-n), rounding=RM[rule])
    elif mode == "Nearest increment (resolution)":
        I = D(inc)
        with localcontext() as c:
            c.prec = 60; k = (d / I).quantize(D(1), rounding=RM[rule]); q = (k * I).quantize(I)
    else:
        if d == 0: return "0"
        e = d.adjusted() - n + 1; q = d.quantize(D(1).scaleb(e), rounding=RM[rule])
        if q != 0 and q.adjusted() > d.adjusted() and len(q.as_tuple().digits) > n: q = q.quantize(D(1).scaleb(e + 1))
    out = format(q, "f")
    if q == 0: out = out.lstrip("-")
    return out.replace("-", "−")
def sigfigs(s):
    s = s.lstrip("+-").split("e")[0].split("E")[0]; dig = s.replace(".", "").lstrip("0")
    if not dig.strip("0"): return None
    return (len(dig), len(dig)) if "." in s else (len(dig.rstrip("0")), len(dig))
def test_round(pg, mode, n, inc, values):
    slug = "rounding-significant-figures"
    print(f"== rounding: {mode}, n={n}, increment {inc}, {len(values)} values")
    load(pg, slug, {"f": {"mode": mode, "n": str(n), "inc": inc, "rule": "Round half to even (ASTM E29, ISO 80000-1)", "op": "Sum (enter a negative value to subtract)"},
                    "g": {"r": [{"v": v} for v in values], "c": [{}]}})
    cols = {r: cells(pg, "r", c) for r, c in ((0, "hu"), (1, "he"), (2, "tr"))}
    sf = cells(pg, "r", "sf")
    for i, v in enumerate(values):
        for r in (0, 1, 2):
            got = cols[r][i].split(" (")[0]
            same(f"round {v} rule {['half up', 'half even', 'truncate'][r]}", got, py_round(v, mode, n, inc, r), quiet=True)
        w = sigfigs(v); want = "—" if w is None else (str(w[0]) if w[0] == w[1] else f"{w[0]} to {w[1]}")
        same(f"sig figs of {v}", sf[i], want, quiet=True)
def test_combine(pg, op, vals):
    slug = "rounding-significant-figures"
    load(pg, slug, {"f": {"mode": "Significant figures", "n": "3", "rule": "Round half to even (ASTM E29, ISO 80000-1)", "op": op},
                    "g": {"r": [{}], "c": [{"v": v, "k": k} for v, k in vals]}})
    ds = [(D(v), k.startswith("Exact")) for v, k in vals]
    with localcontext() as c:
        c.prec = 80
        if op.startswith("Sum"): raw = sum(d for d, _ in ds)
        if op.startswith("Product"):
            raw = D(1)
            for d, _ in ds: raw *= d
        if op.startswith("Quotient"):
            raw = ds[0][0]
            for d, _ in ds[1:]: raw /= d
    meas = [(v, d) for (v, k), (d, ex) in zip(vals, ds) if not ex]
    if op.startswith("Sum"):
        e = max(d.as_tuple().exponent for _, d in meas); want = raw.quantize(D(1).scaleb(e), rounding=ROUND_HALF_EVEN)
    else:
        n = min(sigfigs(v)[0] for v, _ in meas); e = raw.adjusted() - n + 1; want = raw.quantize(D(1).scaleb(e), rounding=ROUND_HALF_EVEN)
        if want.adjusted() > raw.adjusted() and len(want.as_tuple().digits) > n: want = want.quantize(D(1).scaleb(e + 1))
    got = stat(pg, ".rs-stat", "Reported").split(" (")[0].replace("−", "-")
    same(f"combine {op.split()[0]} {[v for v, _ in vals]}", got, format(want, "f"))
    full = stat(pg, ".rs-stat", "Full-precision").replace("−", "-").rstrip("…")
    check(f"combine {op.split()[0]} full precision", float(full), float(raw), abs(float(raw)) * 1e-14)

# ====================================================================== interpolation
def test_interp(pg, f, t, q):
    slug = "calibration-table-interpolation"; load(pg, slug, {"f": f, "g": {"t": t, "q": q}} if f else None)
    if not f:
        ex = pg.evaluate("()=>window.TOOL.example"); f, t, q = ex["f"], ex["g"]["t"], ex["g"]["q"]
    print(f"== interpolation: {f['what'][:50]}")
    P = sorted({float(r["x"]): float(r["y"]) for r in reversed(t)}.items()); X = np.array([p[0] for p in P]); Y = np.array([p[1] for p in P])
    ys, tvs = cells(pg, "q", "y"), cells(pg, "q", "tv"); hw = cells(pg, "q", "hw")
    dp = len(ys[0].split(".")[1]) if "." in ys[0] else 0
    kind = f["kind"]
    for r, yv, tv, how in zip(q, ys, tvs, hw):
        x = float(r["x"])
        if X[0] <= x <= X[-1]: want = float(np.interp(x, X, Y))
        else:
            i = 0 if x < X[0] else len(X) - 2
            want = Y[i] + (x - X[i]) * (Y[i + 1] - Y[i]) / (X[i + 1] - X[i])
        tw = x + want if kind.startswith("Correction") else x - want if kind.startswith("Error") else want
        check(f"interp at {x}: table value", num(yv), want, 0.51 * 10 ** -dp)
        check(f"interp at {x}: corrected value", num(tv), tw, 0.51 * 10 ** -dp)
        same(f"interp at {x}: extrapolation flag", "Extrapolated" in how, not (X[0] <= x <= X[-1]))
    b, a = np.polyfit(X, Y, 1); r2 = np.corrcoef(X, Y)[0, 1] ** 2; res = Y - (a + b * X)
    check("fit slope", num(stat(pg, ".ct-stat", "Best-fit slope")), b, abs(b) * 5e-4)
    check("fit intercept", num(stat(pg, ".ct-stat", "Best-fit intercept")), a, abs(a) * 5e-4 + 1e-12)
    check("fit r²", num(stat(pg, ".ct-stat", "r²")), r2, 5.1e-5)
    check("largest departure from line", num(stat(pg, ".ct-stat", "Largest departure")), res[np.argmax(np.abs(res))], 0.51 * 10 ** -dp)

with sync_playwright() as pw:
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    b = pw.chromium.launch(executable_path=exe); pg = b.new_page()
    pg.route("**/*", lambda r: r.abort() if "fonts.g" in r.request.url else r.continue_())
    test_units(pg)
    print("== IM&TE spec, worked example"); test_imte(pg, None, None)
    print("== IM&TE spec, ppm terms with a fixed term and a floor")
    test_imte(pg, {"ins": "Reference multimeter 10 V range, ppm spec", "un": "V", "rng": "10", "rel": "Parts per million (ppm)", "rd": "12", "rg": "4", "res": "0.0000001", "cnt": "", "fx": "0.000002", "fl": "0.00005", "br": "7.5"},
              [{"nom": "0.1", "rd": "0.10004"}, {"nom": "1", "rd": "0.99993"}, {"nom": "5", "rd": "5.000071"}, {"nom": "10", "rd": "9.99985"}, {"nom": "-10", "rd": "-10.00012"}])
    print("== IM&TE spec, temperature: 1% of reading or 0.5, whichever is greater")
    test_imte(pg, {"ins": "Thermocouple thermometer", "un": "°C", "rng": "", "rd": "1", "res": "0.1", "fl": "0.5", "br": "120"},
              [{"nom": "-20", "rd": "-20.6"}, {"nom": "25", "rd": "25.4"}, {"nom": "100", "rd": "101.0"}, {"nom": "250", "rd": "247.4"}])
    test_tur(pg, None, dbl=True, mc=True)
    test_tur(pg, {"what": "Off-center population given by sd, RSS method, custom limits", "un": "mm", "ltl": "9.990", "utl": "10.010", "U": "0.004", "k": "2", "acc": "0.002",
                  "pm": "Standard deviation", "pv": "0.006", "mu": "10.003", "gm": "RSS (A = √(T² − U²))", "tgt": "2", "cal": "9.993", "cau": "10.006"}, dbl=True)
    test_tur(pg, {"what": "Low TUR 1.5:1, EOPR 85%, k = 2", "un": "V", "ltl": "-0.5", "utl": "0.5", "U": "0.3333333", "k": "2", "acc": "0.25",
                  "pm": "In-tolerance probability (EOPR), %", "pv": "85", "mu": "", "gm": "Subtract U (A = T − U)", "tgt": "0.5"}, mc=True)
    test_tur(pg, {"what": "High TUR 10:1, EOPR 99%", "un": "psi", "ltl": "99", "utl": "101", "U": "0.1", "k": "2",
                  "pm": "In-tolerance probability (EOPR), %", "pv": "99", "gm": "None: simple acceptance (A = T)"})
    test_cert(pg, None, None)
    test_cert(pg, {"rule": RULES[0], "cdate": "2027-01-31", "int": "1", "adj": "No adjustment made", "iid": "X1"},
              [{"pt": "a", "nom": "10", "lo": "9.9", "hi": "10.1", "af": "10.1", "U": "0.02"}, {"pt": "b", "nom": "20", "lo": "19.9", "hi": "20.1", "af": "20.11", "U": "0.02"},
               {"pt": "c", "nom": "0", "lo": "-0.05", "hi": "0.05", "af": "-0.05", "U": ""}])
    test_cert(pg, {"rule": RULES[1], "cdate": "2027-08-31", "int": "6", "adj": "Adjusted", "iid": "X2"},
              [{"pt": "a", "nom": "10", "lo": "9.9", "hi": "10.1", "af": "10.09", "al": "10.07", "U": "0.02"}, {"pt": "b", "nom": "20", "lo": "19.9", "hi": "20.1", "af": "19.85", "al": "20.0", "U": "0.03"}])
    test_cert(pg, {"rule": RULES[2], "cdate": "2026-12-15", "int": "24", "adj": "Adjusted", "iid": "X3"},
              [{"pt": "a", "nom": "50", "lo": "49.5", "hi": "50.5", "af": "50.58", "al": "50.45", "U": "0.1"}, {"pt": "b", "nom": "100", "lo": "99", "hi": "101", "af": "102", "al": "100.95", "U": "0.1"},
               {"pt": "c", "nom": "150", "lo": "149", "hi": "151", "af": "148.95", "al": "149.05", "U": "0.1"}])
    ex_vals = ["2.345", "2.355", "0.004050", "1265", "12.50", "-7.4651", "99.96", "1250"]
    test_round(pg, "Significant figures", 3, "", ex_vals)
    rnd = random.Random(7); vals = []
    for _ in range(60):
        digs = "".join(rnd.choice("0123456789") for _ in range(rnd.randint(1, 7))).lstrip("0") or "5"
        if rnd.random() < 0.4: digs = digs[:-1] + "5" if len(digs) > 1 else "5"      # many exact ties
        p = rnd.randint(0, len(digs)); s = (digs[:p] or "0") + ("." + digs[p:] if p < len(digs) else "")
        if rnd.random() < 0.2: s = "0.00" + s.replace(".", "")
        if rnd.random() < 0.3: s = "-" + s
        vals.append(s)
    vals += ["9.995", "0.0005", "-0.0049", "999.5", "1.05e3", "2.5", "3.5", "-2.5", "0.000"]
    for n in (1, 2, 3, 4): test_round(pg, "Significant figures", n, "", vals)
    for n in (0, 1, 2, 3): test_round(pg, "Decimal places", n, "", vals)
    for inc in ("0.05", "0.02", "5", "0.25"): test_round(pg, "Nearest increment (resolution)", 0, inc, vals)
    print("== combine measured values")
    test_combine(pg, "Sum (enter a negative value to subtract)", [("12.52", "Measured"), ("3.1", "Measured"), ("-0.448", "Measured")])
    test_combine(pg, "Sum (enter a negative value to subtract)", [("100.05", "Measured"), ("-0.0025", "Measured"), ("25.4", "Exact (count or defined constant)")])
    test_combine(pg, "Product (multiply them all)", [("2.54", "Measured"), ("3.1416", "Measured"), ("12", "Exact (count or defined constant)")])
    test_combine(pg, "Product (multiply them all)", [("0.0125", "Measured"), ("4.0", "Measured")])
    test_combine(pg, "Quotient (the first value divided by the others)", [("10.00", "Measured"), ("3.0", "Measured")])
    test_combine(pg, "Quotient (the first value divided by the others)", [("1.000", "Measured"), ("7", "Exact (count or defined constant)"), ("1.3", "Measured")])
    test_interp(pg, None, None, None)
    test_interp(pg, {"what": "Thermometer, table of true values, unsorted with a repeat", "xu": "°C", "kind": "True (reference) value at that reading", "dp": "4"},
                [{"x": "50", "y": "50.21"}, {"x": "-20", "y": "-19.88"}, {"x": "0", "y": "0.05"}, {"x": "100", "y": "100.32"}, {"x": "0", "y": "9"}],
                [{"x": "-30"}, {"x": "-5"}, {"x": "37.2"}, {"x": "88.8"}, {"x": "100"}, {"x": "121.5"}])
    test_interp(pg, {"what": "Load cell, error table", "xu": "kN", "kind": "Error (true = reading − error)", "dp": ""},
                [{"x": "0", "y": "0.002"}, {"x": "10", "y": "0.015"}, {"x": "20", "y": "0.021"}, {"x": "40", "y": "0.019"}, {"x": "50", "y": "0.031"}],
                [{"x": "5"}, {"x": "17.5"}, {"x": "33.3"}, {"x": "50"}, {"x": "0"}])
    b.close()
print(f"\n{N[0]} checks")
print("FAILED: " + ", ".join(FAIL[:40]) + (f" ... ({len(FAIL)} in all)" if len(FAIL) > 40 else "") if FAIL else "ALL CHECKS PASSED")
sys.exit(1 if FAIL else 0)
