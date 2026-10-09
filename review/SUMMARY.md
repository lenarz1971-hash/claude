# Tools build-out: summary for review (9 Oct 2026)

Built locally in this workspace; nothing is on the site. 54 new tools and 6 extended ones: the site goes from 72 to 126 tools. Every tool has a worked example, an explanation with an "On the exam" section, checks, a picture where it helps, and a Resources thumbnail.

## How it was checked
- **Browser:** all 126 tool pages pass `tests/test_tools_browser.py` in Chromium at 1280 px and 375 px. It covers the worked example, autosave after a reload, saving to a file and reopening it, clear, adding and deleting rows, CSV download, print view, JS errors and phone overflow.
- **Numbers:** 13 test files in `tests/` compare every figure on the pages with independent code (SciPy, statsmodels, NumPy, exact fractions, brute force). All pass on the full build, about 6,500 checks in total.
- **Screenshots:** every batch's screenshots were looked at; they are in `review/`.

## Exam tags to confirm
Existing exams only. CSQP, CCT and CMDA are listed as *future* tags and are not on the page. Tags marked * rest on general knowledge, because there is no BoK text in `reference/bok/` for YB, GB, CQIA, CQI, CQT, CQA or CMQ/OE.

### Green Belt statistics and lean tools

| Tool | Tagged | Future |
|---|---|---|
| Attribute agreement analysis | BB, CQE, GB* | — |
| Taguchi loss function and signal-to-noise ratio | CQPA, BB | — |
| Variables sampling plan: the k-method | CQE, CQPA, CQI* | CMDA |
| Dot plot, stem-and-leaf, probability plot and ogive | CQE, BB, CQPA, GB* | — |
| Time series: moving average, trend and seasonal indices | CQE, BB | CMDA |

### Quality auditor tools

| Tool | Tagged | Future |
|---|---|---|
| Audit opening and closing meeting record | CQA*, CQPA, CQE | CMDA, CSQP |

### Inspection, measurement and calibration tools

| Tool | Tagged | Future |
|---|---|---|
| SI and metrology unit converter | CQI*, CQT* | CCT |
| IM&TE accuracy specification calculator | CQI*, CQT* | CCT |
| TUR, TAR and guard-band calculator | CQT*, CQI*, CQE | CCT |
| Calibration certificate and label record | CQT*, CQI*, CQE | CCT, CMDA |
| Rounding and significant figures | CQI* | CCT |
| Interpolation from a calibration table | — | CCT |

### Quality manager tools

| Tool | Tagged | Future |
|---|---|---|
| Meeting agenda and action log | CQPA, BB, CQE, CQIA* | CSQP |
| Customer survey designer and analyzer | CQPA, CQE, BB, CQIA*, CMQ/OE* | — |
| Gemba walk and daily huddle board | BB, CQE | CMDA |
| Design review and DFX checklist | CQE, BB | CSQP, CMDA |
| KPI dashboard builder | CQE, BB, CMQ/OE* | CSQP, CMDA |

### Process, planning and risk tools

| Tool | Tagged | Future |
|---|---|---|
| Flowchart and swimlane process map | YB*, GB*, BB, CQIA*, CQI*, CQT*, CQPA, CQA*, CQE, CMQ/OE* | CSQP, CCT, CMDA |
| Activity network, critical path and PERT | BB, CQPA, CQE, CMQ/OE* | CSQP |
| Risk register and heat map | BB, CQPA, CQE, CMQ/OE* | CSQP, CMDA |
| Fault tree analysis | BB, CQE | CSQP, CMDA |
| Probability calculator | GB*, BB, CQPA, CQE | — |
| Affinity diagram | BB, CQPA, CQE, CMQ/OE* | CMDA |
| Interrelationship digraph | BB, CQPA, CQE, CMQ/OE* | — |
| Process decision program chart (PDPC) | BB, CQPA, CQE, CMQ/OE* | — |
| Matrix diagram (L-shaped and T-shaped) | BB, CQPA, CQE, CMQ/OE* | — |
| Force field analysis | CQE, CMQ/OE* | — |

### Lean and daily management tools

| Tool | Tagged | Future |
|---|---|---|
| Kanban sizing calculator | GB*, BB, CQPA, CQE | CSQP, CMDA |
| 5S and 6S audit scorecard | YB*, GB*, BB, CQIA*, CQPA, CQE | CSQP, CMDA, CCT |
| Error-proofing (poka-yoke) worksheet | GB*, BB, CQIA*, CQPA, CQE | CSQP, CMDA |
| Standardized work combination sheet | GB*, BB, CQE | CSQP, CMDA |
| Heijunka production leveling | BB | — |
| Spaghetti diagram | BB, CQPA | — |

### Supplier quality tools

| Tool | Tagged | Future |
|---|---|---|
| Supplier selection matrix with total risk factor | CQPA, CQE, CMQ/OE* | CSQP, CMDA |
| PPAP and part, process and service qualification plan | CQPA, CQE | CSQP |
| Supplier classification and lifecycle | CQPA, CQE, CMQ/OE* | CSQP, CMDA |
| Kraljic portfolio matrix | — | CSQP |
| Make/buy analysis | — | CSQP |
| Supplier quality agreement checklist | — | CSQP, CMDA |
| Supplier onboarding checklist | — | CSQP |

### Validation, design control and regulated-industry tools

| Tool | Tagged | Future |
|---|---|---|
| Hazard analysis and risk control | CQE | CMDA |
| IQ/OQ/PQ validation protocol | CQE, CQPA | CMDA, CSQP, CCT |
| Requirements traceability matrix | CQE | CMDA |
| ALCOA+ data integrity checklist | CQPA | CMDA, CCT |
| Lot traceability and genealogy record | CQPA, CQE | CMDA |
| Complaint handling and reportability decision guide | CQE | CMDA |
| Shelf-life accelerated aging calculator | — | CMDA |
| Alert and action levels | — | CMDA |

### Problem solving and change control tools

| Tool | Tagged | Future |
|---|---|---|
| Engineering change impact checklist | CQPA, CQE | CSQP, CMDA |
| 8D report | CQPA, CQE | CSQP, CMDA |
| Is / Is Not problem specification | CQE, BB | CMDA |
| A3 problem-solving report | BB, CQPA, CQE | — |
| Out-of-control action plan (OCAP) | CQPA, CQE, BB, GB* | CMDA |
| Benchmarking gap worksheet | CQPA, CQE, BB, CMQ/OE* | CSQP |

### Extended existing tools (b12)
Distribution explorer (7 more distributions), confidence intervals (tolerance and prediction intervals), correlation and regression (CI for r, confidence and prediction bands, residual plots), full factorial DOE (fractional factorials with aliases and resolution), VOC/CTQ tree (generic tree mode), data collection plan (location check sheet). Tags unchanged; the new BoK coverage is listed in `generator/batches/b12/meta.json`.
## Content worth your review (from memory, not from a source file here)
- **Complaint reportability guide:** paraphrases US 21 CFR 803 (30-day and 5-day reports) and EU vigilance in general terms. It carries a study-aid disclaimer.
- **PPAP plan:** the AIAG 4th edition submission-level table and the Ppk/%GRR cutoffs.
- **Variables sampling plan:** the general Z1.9 rules (Form 2 for two-sided limits, the MSD rule). No Z1.9 tables are reproduced; users enter n, k and M from their own plan.
- **Attribute agreement:** the kappa guideline (> 0.75 good, < 0.40 poor) is attributed to the AIAG MSA manual.
- **Quality agreement checklist:** cites ISO 13485 7.4.2 for change notification.
- **Tool-specific conventions, each stated on its page:**
  - poka-yoke strength scale 10 to 1;
  - supplier promotion and demotion rules;
  - "total risk factor" in supplier selection;
  - KPI trend rule;
  - quality agreement weights (3/2/1) and the 90% threshold to sign.
- **Tolerance factor:** the exact two-sided k for n = 10 at 95%/95% is 3.393, confirmed by a 4-million-sample simulation. Some printed tables give 3.379, which is an approximation; the page shows Howe's approximation alongside.
- **Invented names to recheck against real businesses:** they were checked against real towns only. Examples are Kestrova Devices, Velmora Medical Supply, Quillon Care Group, Tarvex Home Health, Ambrel Clinics, Pellwyn Surgical and Brannoc Medical (b9), and the appraisers Marisol Okafor, Dev Lindqvist and Tomasz Reyes (b6).
- **Federal holidays:** the 5-work-day due date in the complaint guide skips weekends only. The page tells the user to check for federal holidays.

## Not done, and why
- **Calculator extensions** (SPC: moving average and short-run; capability: Cpm and non-normal; sample size and power; OC curve: double sampling and AOQL). These change `calc_app/`, and the live calculator pages carry the 5 Oct slider fix, which has to be fetched from the live site first. This environment cannot reach scqualityguild.com.
- **Header and menu sync** (the Games dropdown, primer names). This needs the live site for the same reason.
- **Upload set.** There is none until the header is synced: any page built now would remove the Games menu if uploaded.
- **Check sheet builder.** Not built as a new tool, because it would duplicate `data-collection-plan`; it was done instead as the location check sheet extension.
- **CSQP, CCT and CMDA as exams on the Resources page.** Not added; that needs your yes. Their tags are ready in the batch `meta.json` files.
