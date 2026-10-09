# Batch 1: five new tools (built locally, not on the site)

## What was built
| Tool | Page | What it does |
|---|---|---|
| Flowchart and swimlane map | `/tools/flowchart-swimlane.html` | Steps, decisions and lanes. Draws the map and marks handoffs, rework loops and value-added time. |
| Activity network, critical path and PERT | `/tools/activity-network-critical-path.html` | ES, EF, LS, LF, slack, critical path, network diagram, PERT expected time and σ, chance of finishing by a target. |
| Risk register and heat map | `/tools/risk-register-heat-map.html` | Likelihood × impact against criteria you set; treatment; owner; review date; heat maps before and after the actions. |
| Fault tree analysis | `/tools/fault-tree-analysis.html` | AND/OR gates down to basic events. Top-event probability (exact, repeated events handled), minimal cut sets, single points of failure, importance. |
| Probability calculator | `/tools/probability-calculator.html` | Addition, multiplication, conditional and complement rules; nCr and nPr; at least one in n; series and parallel reliability. |

Each tool has a worked example (invented company and parts), an explanation and an "On the exam" section citing the BoK sections. Each has a Resources-page thumbnail. They appear as a new hub group, "Process, planning and risk tools".

**Check sheet builder: not built.** `data-collection-plan` already has a self-totaling check sheet that exports to Pareto. A new page would duplicate it. I suggest adding a location (defect concentration) mode to that tool instead, in the extensions batch.

## How it was checked
- **Numbers:** `tests/test_batch1_numbers.py` runs 176 checks, and all pass. It loads 11 cases into the real pages and compares every figure shown with independent code: SciPy for the PERT probability, `math.comb`/`math.perm` for counting, and brute-force enumeration for fault-tree probabilities and minimal cut sets. The cases include a fault tree with repeated events, where gate-by-gate multiplication would be wrong.
- **Browser:** `tests/test_tools_browser.py` runs Chromium at 1280 px and 375 px. It checks the worked example, autosave after reload, save to file and reopen, clear, add/delete row, CSV, and the print view. It found no problems, no JS errors and no overflow at 375 px.
- The screenshots in this folder were checked by eye. Three display bugs were found and fixed: a literal "&ndash;", a "σ" header shown as "Σ", and text overflowing the inspection circle.

## Exam tags to confirm (new tools only)
| Tool | Tagged |
|---|---|
| flowchart-swimlane | all 10 exams (a basic quality tool in every BoK) |
| activity-network-critical-path | CSSBB, CQPA, CQE, CMQ/OE |
| risk-register-heat-map | CSSBB, CQPA, CQE, CMQ/OE |
| fault-tree-analysis | CSSBB, CQE |
| probability-calculator | GB, CSSBB, CQPA, CQE |

When CSQP, CCT and CMDA are added as exams, these tools also serve them: flowchart (all three), risk register, fault tree (CSQP, CMDA), critical path (CSQP).

## Not done, on purpose
- **No upload set.** The generator's header and menu are still the 5 Oct version, without the Games menu. Any page built now would remove that menu if uploaded. The menu sync needs `scqualityguild.com` allowed in this environment's network settings.
- The Resources page is rebuilt locally only, with the section A tags and these five tools.
