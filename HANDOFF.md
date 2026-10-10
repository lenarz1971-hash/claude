# Handoff: tools build-out (state as of 10 Oct 2026)

Read this first, then `CLAUDE.md` (the house rules still apply in full), then `review/SUMMARY.md`.

## Where things stand
- **All new tools are built and tested.** The generator now builds **126 tools** (up from 72); the Resources page shows **140 resources** (126 tools, 12 calculators, 2 simulations).
  - TASKS.md section B is complete: 54 new tools. The check sheet builder was done as a location check sheet inside `data-collection-plan`, not as a duplicate page.
  - Section C: 5 of 9 extensions are done (distribution-explorer, confidence-interval-calculator, correlation-regression, full-factorial-doe, voc-ctq-tree). The location check sheet was added to data-collection-plan as well.
  - Section A: CQPA re-tagging is done (`MAPPING_CHANGES_A.md`).
- **Nothing is on the live site.** No upload set exists yet.
- **Tests:** all pass on the full build.
  - `tests/test_tools_browser.py` covers all 126 pages.
  - 13 `tests/test_*_numbers.py` files run about 6,500 independent number checks.

## Why it stopped
The previous session ran in a cloud container that could not reach scqualityguild.com. Everything below needs the live site.

## What is left, in order
1. **Header, footer and menu sync** (CLAUDE.md, "READ THIS BEFORE BUILDING ANYTHING").
   - Fetch a live tool page, for example `https://scqualityguild.com/tools/fmea.html`.
   - Update `apply_chrome.py` (NAV list), `tools_shell.py` and `calc_shell.py` so they produce the live header (with the Games dropdown), footer and chrome CSS.
   - Prove it: rebuild `fmea.html` and diff it against the live copy. Only differences you can explain are allowed.
   - Match the primer names in `resources_src/certdata.js` to the live site.
2. **Calculator extensions** (TASKS.md C).
   - The four extensions are SPC (MAMR, short-run), capability (Cpm, Cr, non-normal), samplesize (power for means and proportions) and OC (double sampling, AOQ/AOQL).
   - Fetch the live calculator pages first and keep the 5 Oct slider fix.
   - Keep `calc_app/` and the site app in agreement.
3. **Wait for Anthony's answers.** Do not change exams or tags without them.
   - Exam tags in `review/SUMMARY.md`.
   - The six weak CQPA tags in `MAPPING_CHANGES_A.md`.
   - Whether CSQP, CCT and CMDA become exams on the Resources page. If yes, the tags are ready in each `generator/batches/*/meta.json` as `future_tags`.
4. **Build in order:**
   ```
   python build_tools.py ../out
   python build_calcs2.py …          # only if calculators changed
   python build_resources.py ../out
   python apply_chrome.py ../out
   ```
5. **Upload set.**
   - Download the live version of every page being replaced and compare content.
   - Make `upload_YYYY-MM-DD/` with only the new and changed files.
   - Write `UPLOAD_MANIFEST.md` (file, new or replaced, SHA-256, why) and `sitemap_additions.txt` (54 new `/tools/` URLs).
   - Also include `/tools/index.html` (the hub) and `/resources/index.html`.
   - Anthony uploads it himself, or hands it to his Cowork session. Do not upload, and do not sign in to anything.

## How the build-out was organized (useful for changes)
- The new tools' page text is in `generator/tools_content5_a.py` (batch 1) and `generator/tools_content6_b2.py` … `b11.py`.
- Tool definitions are in `generator/tools_defs/<slug>.js` and `.css`.
- Hub groups are in `generator/tools_content.py`. New groups: process-risk, lean, supplier, regulated, problem-solving.
- Exam tags are in `resources_src/consts.js` (`TOOL_EX`). Thumbnails are in `resources_src/thumbs.js`.
- `generator/build_preview.py <module> <out>` builds a content module before it is registered.
- `generator/merge_batch.py <batch> <group>` registers a batch.
- `AGENT_BRIEF.md` is the brief the builder agents worked from.
- `review/<batch>/` holds screenshots, and `review/SUMMARY.md` holds the tags and open questions.

## Check before calling anything done
```
cd generator && python build_tools.py ../out && python build_resources.py ../out && cd ..
python tests/test_tools_browser.py out $(ls out/tools | grep -v index.html | sed 's/\.html$//')   # PROBLEMS: none
for t in tests/test_*numbers.py; do python $t out | tail -1; done                                # ALL CHECKS PASSED
```
- Needs Python 3, `pip install playwright scipy numpy statsmodels pandas`, and `playwright install chromium`.
- `test_tools_browser.py` uses `/opt/pw-browsers/chromium` if it exists; otherwise it uses Playwright's own Chromium.
