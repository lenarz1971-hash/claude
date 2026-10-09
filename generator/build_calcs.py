#!/usr/bin/env python3
"""
Builds all twelve /calculators/ landing pages for scqualityguild.com.

One shell, twelve pages — the three Anthony wrote and the nine generated ones,
now on the same shell and the same stylesheet. Adding a thirteenth means one
entry in calc_shell.ALL, one entry in calc_content.PAGES, and running this.

  calc_shell.py         the shell and CSS (his, verbatim, plus figure tables)
  calc_content_orig.py  his three pages' content, transcribed verbatim
  calc_content.py       the nine generated pages' content

Every number on the nine was computed first and re-derived independently as a
check; the reconciliation is in verified_numbers.txt alongside this script.
"""
import os, re, json

from calc_shell import SHELL, CSS, SITE, ALL, LINKNAME, ROUTE, SLUGS

OUT = "/home/claude/scqg_handover/calculators"


def rel_block(slug, limit=4):
    """Cross-links to other calculators, never to itself.

    Rotates the window rather than always taking the first four. Taking the
    head of the list gave the first four pages every internal link on the site
    and left the rest with almost none, which is the opposite of what internal
    linking is for. Starting after this page's own position spreads them evenly,
    and over twelve pages every page ends up linked to from four others.
    """
    idx = SLUGS.index(slug)
    rotated = SLUGS[idx + 1:] + SLUGS[:idx]
    picks = [s for s in rotated if s != slug][:limit]
    return "\n".join(
        f'<a href="/calculators/{s}.html">{LINKNAME[s]}</a>' for s in picks)


def unescape_for_json(s):
    """JSON-LD is a data island, not markup: &amp; must be a literal &."""
    return (s.replace("&amp;", "&").replace("&mdash;", "—")
             .replace("&rsquo;", "’").replace("&quot;", '"')
             .replace("&#772;", "̄").replace("&rsaquo;", "›"))


def build(p):
    name = p.get("jsonld_name") or unescape_for_json(p["h1"])
    slug = p["slug"]
    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": name,
        "description": unescape_for_json(p["desc"]),
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "url": f"{SITE}/calculators/{slug}.html",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
    }, ensure_ascii=False)

    return SHELL.format(
        site=SITE, slug=slug, title=p["title"], desc=p["desc"],
        jsonld=jsonld, css=CSS, h1=p["h1"], lede=p["lede"],
        route=ROUTE[slug], content=p["content"].strip(), rel=rel_block(slug))


if __name__ == "__main__":
    from calc_content import PAGES
    from calc_content_orig import PAGES_ORIG

    every = {p["slug"]: p for p in (PAGES_ORIG + PAGES)}

    missing = [s for s in SLUGS if s not in every]
    extra = [s for s in every if s not in SLUGS]
    if missing or extra:
        raise SystemExit(f"slug mismatch — missing {missing}, unexpected {extra}")

    os.makedirs(OUT, exist_ok=True)
    for slug in SLUGS:
        p = every[slug]
        if p.get("route") and p["route"] != ROUTE[slug]:
            raise SystemExit(f"{slug}: route {p['route']!r} != {ROUTE[slug]!r}")
        path = os.path.join(OUT, slug + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(build(p))
        words = len(re.sub(r"<[^>]+>", " ", p["content"]).split())
        origin = "his " if slug in {x["slug"] for x in PAGES_ORIG} else ""
        print(f"  {slug+'.html':<30} {os.path.getsize(path):>7,} bytes"
              f"   ~{words:>4} words  {origin}")
    print(f"\n{len(SLUGS)} pages written to {OUT}")
