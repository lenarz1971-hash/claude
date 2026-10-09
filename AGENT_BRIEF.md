# Brief for tool-building agents

Read `CLAUDE.md` (house rules; all of them apply) and your batch assignment. Then study batch 1 as the reference for the expected quality and patterns:
- `generator/tools_defs/fault-tree-analysis.js`, `risk-register-heat-map.js`, `activity-network-critical-path.js`, `probability-calculator.js`, `flowchart-swimlane.js`;
- `generator/tools_content5_a.py` (page text);
- `tests/test_batch1_numbers.py` (number checks).

The engine is `generator/tools_engine.js` and the shell is `generator/tools_shell.py`. Its CSS classes are `.out`, `.flag`, `.stat`, `.svgw`, `.pillrow`, `.hi-row` and `.tg`. Use these; avoid new CSS where you can.

## Before building each tool
- **Confirm the gap.** Grep `generator/tools_defs/` and `generator/tools_content*.py` for the topic. If an existing tool already does it, do **not** build a duplicate. Report it as "covered by <slug>", or say what extension it would need.
- Read the BoK passages in `reference/bok/` that the tool serves. The `covers` field and the "On the exam" section must cite real section numbers from those files, for example `CQE V.B.1`, `CSQP III.C`, `CCT IV.A`. Check every number against the text.

## Files you may create (and only these)
- `generator/tools_defs/<slug>.js` and, if needed, `<slug>.css`. Slugs are lowercase-hyphenated and descriptive.
- `generator/tools_content6_<batch>.py`, defining `PAGES6<BATCH>` (for example `PAGES6B2`), a list of `dict(slug, name, covers, title, desc, h1, lede, content)` in the same style as `tools_content5_a.py`.
  - `title` ends with ` | SC Quality Guild`.
  - `desc` is at most about 160 characters.
  - `content` runs about 350–600 words, with `<h2>` sections, and ends with `<h2>On the exam</h2>`.
- `generator/batches/<batch>/thumbs.js`: a single `Object.assign(THUMB,{ '<slug>':'<svg viewBox="0 0 220 120">…</svg>', … });`. Use the `th-*` classes and the site colors (#0F3E68 navy, #9C7C1F / #D8B147 gold, #C0392B red, #4A5D71 gray).
- `generator/batches/<batch>/meta.json`:
  `{"tools":[{"slug":…, "tags":[existing exam keys], "future_tags":["csqp","cct","cmda" as relevant], "group_hint":"…"}], "not_built":[{"item":…, "reason":…}]}`.
  - Existing exam keys: `yb gb cssbb cqia cqi cqt cqpa cqa cqe cmqoe`.
  - Tag only where the BoK supports it. You have BoK text for cqpa, cqe, cssbb and the three future exams; for the others use general knowledge, conservatively.
- `tests/test_<batch>_numbers.py`, modeled on `tests/test_batch1_numbers.py`. Only needed if the tools calculate anything.
- Scratch output goes under `out_<batch>/`, which is gitignored.

**Do not edit** any existing file. That includes `tools_content.py`, `consts.js`, `thumbs.js`, the engine and the shell. The lead merges your batch.

## Tool requirements
- ES5-style JS, matching the existing defs.
- Every tool has:
  - a realistic worked `example` with invented names only: no real towns, companies or people, and nothing set in South Carolina;
  - a section of checks (`api.flags`) that tells the user something useful;
  - a picture (SVG) where the tool is visual.
- US spelling. Plain, direct sentences, in the voice of the existing content.
- Use correct formulas only. Any calculation must be checked against independent code (SciPy, statsmodels, or a hand-worked value) in your test file, using the built page in a browser, like batch 1. Test the worked example and at least one more case, including edge cases.

## Build and check
```
cd generator && python3 build_preview.py tools_content6_<batch> ../out_<batch>
cd .. && python3 tests/test_tools_browser.py out_<batch> <slug> <slug> ...     # must print PROBLEMS: none
python3 tests/test_<batch>_numbers.py out_<batch>                              # must print ALL CHECKS PASSED
```
- Also check the JS syntax: if the browser test reports JS errors, fix them.
- Take section screenshots at 1280 px and 375 px. A helper is at `/tmp/claude-0/-home-user-claude/235f75cc-26d4-53a4-813f-468c2c3bc817/scratchpad/shot.py`; run it as `python3 shot.py <out root> <dir> <width> <slugs…>`. Look at every screenshot with the Read tool, and fix overlaps, clipped text, empty pictures and layout breaks.
- Save 1–2 of the best screenshots per tool to `review/<batch>/<slug>.png`.
- Do **not** commit or push. The lead does that.

## Your final message (the lead reads only this)
Keep it short:
- the slugs built, one line each;
- anything "covered by" or not built, with the reason;
- the test results, as counts;
- any doubts about formulas or BoK citations.
