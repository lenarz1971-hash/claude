# SC Quality Guild: tools workbench

You are working on the free online tools and the Resources page of **scqualityguild.com**, a study site for ASQ certification candidates run by Anthony Lenarz. This folder holds the site generator and the work list. Read this file, then `TASKS.md`, before doing anything.

## What you are building
The work list is `TASKS.md`. In order:

- **A. Re-tag existing tools** to the exams they serve. Edit `generator/resources_src/consts.js`: TOOL_EX for tools, MAP for calculators.
- **B. New tools.** 55 are listed, with priority 1 first.
- **C. Extensions** to 9 existing tools.

Work in batches of about five tools. Show Anthony each batch working in a browser before starting the next. He reviews and approves; he decides what goes live.

`TASKS.md` was drawn up from a quick scan, so **confirm each gap before building**. Read the existing defs and content first. For example, `data-collection-plan` already contains a self-totaling check sheet, so the "check sheet builder" may be better done as an extension or a stand-alone page that reuses it. Never build a duplicate of a tool that exists.

## How the generator works
Everything is in `generator/`. Python 3 builds static HTML pages; there is no framework and no npm build.

**Tools (`/tools/<slug>.html`).**
- `build_tools.py <site_root>` writes `<site_root>/tools/`.
- Its inputs:
  - `tools_shell.py`: the page shell; imports its CSS from `calc_shell.py`.
  - `tools_engine.js`: the shared engine. It provides the worked-example loader, autosave in localStorage, save/open a file, print, CSV per table, add/delete rows, the datagrid field type, and helpers `api.flags` / `api.lines` / `api.fmt`.
  - `tools_defs/<slug>.js` (+ optional `.css`): each tool's sections. Field, grid, custom and output types; see `fmea.js` and `basic-statistics.js` for the patterns.
  - `tools_content*.py`: each page's `dict(slug, name, covers, title, desc, h1, lede, content)`. `content` is the explanation under the tool.
  - The ORDER lists and GROUPS at the end of `tools_content.py` set the hub groups and order. An assert checks that every slug is in exactly one ORDER list. Add a new group, or extend one, for new tools.
- Every tool has a **worked example** button that loads a realistic, fictional case, and an explanation of what the tool is for, how to read it, and where it sits in the relevant Body of Knowledge.

**Calculators (`/calculators/<slug>.html`).**
- `build_calcs2.py` builds them from `calc_app/`: `panels.json`, `runtime.js`, `scoped.css`, `pages.json`.
- That code was extracted from the site's single-page app (`index.html`), so the calculator pages and the app give identical results.
- Extending a calculator means changing `calc_app/` carefully and keeping the app and the page in agreement.

**Resources page (`/resources/index.html`).**
- `build_resources.py <site_root>` builds it from `resources_src/` (page.html, page.css, app.js, consts.js, certdata.js, calcs.js, thumbs.js, yb.js).
- Every calculator, tool and simulation is a box with an SVG thumbnail from `thumbs.js`. **New tools need a thumbnail.**
- There is an "All / By exam" switch.
- Exam lists live in `consts.js`:
  - `SS` and `QQ`: the exams;
  - `MAP`: calculator → exams;
  - `TOOL_EX`: tool → exams;
  - `SIM_FOR`: simulations.
- These mappings were drafted by Claude from BoK knowledge and **Anthony has never confirmed them**. List every mapping change so he can review it.
- **CSQP, CCT and CMDA are not exams on the page yet.** Do not add them to `SS`/`QQ` without Anthony's yes.

**Assessments** (`build_assess.py`) are separate. Leave them alone.

**Chrome (header and footer).** `apply_chrome.py <site_root>` runs last over every static page. It puts the home page's header and footer on each.

**Build order:** build_tools.py → build_calcs2.py (only if calculators changed) → build_resources.py → apply_chrome.py.

**Hard-coded paths.** Several scripts default to `/home/claude/...` output paths from the cloud sessions where they were written. Always pass an explicit output root, for example `python build_tools.py ../out`. Fix any default you trip over so it is relative to the generator.

## READ THIS BEFORE BUILDING ANYTHING: the generator is behind the live site
The live site has changed since this generator was saved (5 Oct 2026):

1. **Games menu.** On 9 Oct a **Games** dropdown was added to the menu on every page, right after Resources:
   - markup: `<span class="navgrp"><a href="/games/">Games</a><span class="navsub">…Sigma Siege · Root Cause Run · Sigma Chase…</span></span>`
   - plus CSS for the dropdown and menu-gap rules at 921–1100 px.
   - `apply_chrome.py` (NAV list), `tools_shell.py` and `calc_shell.py` do **not** know about it. Running `apply_chrome.py` as-is would **strip the Games menu** from every page it touches.
   - **First job:** fetch a live page, e.g. `https://scqualityguild.com/tools/fmea.html`, copy its exact header, footer and chrome CSS, and update the generator to produce them. Prove it: rebuild one existing tool page and diff it against the live copy. The only differences allowed are ones you can explain.
2. **Primer names.** On 9 Oct the primers were renamed to match ASQ's certification names (for example "Quality Process Analyst Primer", "Quality Improvement Associate Primer", "Six Sigma Green Belt Primer"). Anything the generator prints about primers (for example `resources_src/certdata.js`) must match the live site.
3. **Calculator pages.** A slider fix was applied to the live calculator pages on 5 Oct, after this generator was saved. Do not regenerate or upload calculator pages unless a task changes them. If one does, fetch the live page first and keep the fix.
4. **Live is the truth.** For any page you will replace, download the live version first and diff your build against it. Only pages with intended changes go in the upload set.

Fetch live pages sparingly. Cloudflare rate-limits repeated hits from one IP (error 1015), especially `sitemap.xml`. Cloudflare also rewrites HTML on the way out, so a fetched page will never byte-match a built one. Compare content, not hashes.

## Rules (Anthony's standing rules, all non-negotiable)
- **US spelling** throughout.
- **No real towns, businesses or people in examples**, and **nothing set in South Carolina**. Worked examples use invented companies, parts and names. Check new examples against this.
- **Correct numbers.** Every calculation a tool performs is checked against an independent implementation, such as SciPy, statsmodels or a hand calculation written into a test, before it is called done. Put the check in a test script in `tests/` so it can be rerun.
- **Check visually.** Open each built page in a real browser (Playwright is fine) at desktop width and at 375 px phone width. Check:
  - load the worked example, edit, reload (autosave), save to a file and open it, CSV, print preview;
  - no overflow and no text collisions.
  - Take screenshots and look at them. "It built" is not "it works".
- **Back up before replacing**, and verify by SHA-256. Never overwrite a file you have not first copied aside.
- **Batch small edits.** Do not rebuild for every one-line change.
- **Do not estimate work in wall-clock time.** Size work by number of tools or batches.
- **Never put the generator on the server.** `generator/` stays local. Only built pages are uploaded.
- **Never type passwords or sign in to anything.** Anthony signs in himself.
- **Do not bypass a blocked fetch** by other means.

## Uploading (you do not upload)
Anthony uploads through Bluehost cPanel, or hands the upload to his Cowork session. Your job ends with an **upload set**: a folder `upload_YYYY-MM-DD/` that mirrors the site's paths, containing only the changed and new files. Alongside it, write `UPLOAD_MANIFEST.md`:
- each file;
- new or replaced;
- its SHA-256;
- why it changed.
Also add the new tool URLs to a `sitemap_additions.txt`, so `sitemap.xml` can be updated on the server.

The server is Bluehost shared hosting with Cloudflare in front, PHP 8 and MySQL, and the docroot is `public_html`. The tools are static pages and need no server code.

## Reference
- `TASKS.md`: the full work list with priorities and the exams each tool serves.
- `reference/bok/*.txt`: text of the Bodies of Knowledge:
  - CQPA 2026, CQE, CSSBB, CSQP 2023, CCT 2024, CMDA 2026.
  - Use them to write each tool's "on the exam" section and its `covers` field accurately.
  - The original PDFs are in `C:\Users\lenar\OneDrive\Desktop\Claude ASQ Knowledge Base\`.
- Background on the whole site is in `C:\Users\lenar\OneDrive\Desktop\scqualityguild\Website SCQualityGuild\knowledge-base\`. `SITE_STATE.md` and `WORKING_AGREEMENT.md` are there; they are older than this file and this file wins where they disagree.

## When you finish a batch
Report to Anthony in plain words:
- what was built, with screenshots;
- what was checked and how;
- the mapping changes for him to confirm;
- where the upload set is.

Keep the report short. He reads results, not process.
