# Resources page: tool gaps and re-tagging (9 Oct 2026)

Anthony: "make a note of those that need to be added… review [the new BoKs] and give me a comprehensive list of what new tools need to be added to the resource list."

## Sources reviewed
- **Bodies of Knowledge.** CQPA 2026, plus the five Anthony added to the Claude ASQ Knowledge Base folder on 9 Oct:
  - CSQP 2023 (Supplier Quality Professional)
  - CCT 2024 (Calibration Technician)
  - CMDA 2026 (Medical Device Auditor)
  - CQE (cert insert)
  - CSSBB (cert insert)
- **What is on the site.** Taken from `generator_2026-10-05_audit.zip` (Website SCQualityGuild folder):
  - `resources_src/consts.js`: MAP, TOOL_EX, SIM_FOR
  - `tools_defs/` (74 tools)
  - `calc_app/panels.json` (12 calculators: capability, spc, grr, sigma, pareto, oc, constants, yield, samplesize, grrcpk, linearity, hypothesis)
  - The live site may have changed since 5 Oct; check before building.
- **Exams on the Resources page.** The page knows 10 exams: YB, GB, BB, CQIA, CQI, CQT, CQPA, CQA, CQE, CMQ/OE.
  - **CSQP, CCT and CMDA are not on it.** Adding them to the exam selector is Anthony's decision; there are no primers for them yet.

Exam codes below: PA = CQPA, QE = CQE, BB = CSSBB, SQ = CSQP, CT = CCT, MD = CMDA.

---

## A. Re-tag existing items (no new build; edit `consts.js` TOOL_EX and MAP, rebuild resources)

The exam mappings were Claude's draft and have never been confirmed by Anthony. Review them all while doing this.

**Tag for CQPA.** Only 21 of 72 tools are tagged CQPA today. These existing items cover CQPA BoK topics and should be added:

| Area | Existing items |
|---|---|
| Teams and projects | project-charter, six-sigma-roles-raci, stakeholder-analysis, communication-plan, wbs-gantt-chart, change-management-plan, lessons-learned-register |
| Quality basics | cost-of-quality, work-instruction-sop, ethics-compliance-decision-guide, drawing-title-block-tolerance-reader |
| Audits | audit-plan-schedule, audit-checklist-working-papers, audit-sampling-plan, audit-nonconformity-report, audit-car-verification-tracker |
| Improvement | value-stream-map-takt, smed-setup-reduction, swot-pestle-analysis (risk), project-selection-matrix (prioritization matrix) |
| Customers and suppliers | qfd-house-of-quality, kano-model, first-article-inspection, cqt-nonconforming-material-disposition |
| Analysis | full-factorial-doe, multi-vari-chart, attribute-capability, cqt-reliability-mtbf-calculator |
| Calculators (MAP) | linearity, grrcpk |

**If CSQP, CCT and CMDA are added as exams, tag these existing items for them:**

- **CSQP:**
  - Supplier tools: supplier-scorecard, sipoc, swot-pestle-analysis.
  - Qualification and control: fmea, control-plan, first-article-inspection, msa-accuracy-precision, capability, grr.
  - Lean: value-stream-map-takt, smed-setup-reduction, eight-wastes-waste-walk, kaizen-pdca-planner.
  - Corrective action and root cause: corrective-action-capa, fishbone-5-whys, pareto.
  - Audit: audit-plan-schedule, audit-checklist-working-papers, audit-nonconformity-report, audit-car-verification-tracker.
  - People and governance: six-sigma-roles-raci, team-development-stages, training-plan-kirkpatrick, ethics-compliance-decision-guide.
  - Other: qfd-house-of-quality, drawing-title-block-tolerance-reader, gdt-position-tolerance, cqt-nonconforming-material-disposition, project-charter, wbs-gantt-chart, lessons-learned-register.
- **CCT:**
  - Calibration: cqt-measurement-uncertainty-budget, calibration-interval-adjustment, cqt-calibration-oot-impact, gauge-resolution-10-to-1, sine-bar-height-gauge-record.
  - Measurement system analysis: msa-accuracy-precision, grr, linearity.
  - Charts and audits: spc, pareto, fishbone-5-whys, audit-checklist-working-papers.
  - Ethics: ethics-compliance-decision-guide.
- **CMDA:**
  - Audit tools: all of them.
  - Corrective action and analysis: corrective-action-capa, fmea, fishbone-5-whys, pareto, spc, capability.
  - Measurement and inspection: msa-accuracy-precision, oc, audit-sampling-plan, first-article-inspection, cqt-nonconforming-material-disposition.
  - Other: cost-of-quality, kaizen-pdca-planner, dmaic-roadmap, value-stream-map-takt, eight-wastes-waste-walk.

---

## B. New tools to build

Each line gives the tool, what it does, and the exams that call for it. Priority: **1** = named in several BoKs or central to a primer case; **2** = named in two BoKs; **3** = one BoK or niche.

### B1. Basic quality tools (the seven, as named in every BoK)

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 1 | Check sheet builder | tally and location check sheets, totals, export to Pareto (note: `data-collection-plan` already has a self-totaling check sheet; consider a stand-alone page that reuses it) | PA, QE, BB, SQ, CT, MD | 1 |
| 2 | Flowchart / process map / swimlane builder | steps, decisions, lanes by department; handoffs marked | PA, QE, BB, SQ, CT, MD | 1 |
| 3 | Graphical methods: dot plot, stem-and-leaf, normal probability plot, cumulative frequency | basic-statistics has the histogram and box plot; these are missing | QE, BB, PA | 2 |

### B2. Management and planning tools (QE V.B, BB IV.D, PA II.D.1, MD V.A)

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 4 | Affinity diagram | cards into groups with header cards | PA, QE, BB, MD | 1 |
| 5 | Interrelationship digraph | in/out arrow counts, drivers and outcomes | PA, QE, BB | 1 |
| 6 | Process decision program chart (PDPC) | plan, what-could-go-wrong, countermeasures | PA, QE, BB | 1 |
| 7 | Matrix diagram (L, T, X) | relationship symbols between lists, row and column totals | PA, QE, BB | 2 |
| 8 | Activity network / critical path / PERT calculator | ES/EF/LS/LF, slack, critical path, PERT expected time and σ, probability of finishing by a date | PA, QE, BB, SQ | 1 |
| 9 | Force field analysis | driving and restraining forces, weighted | QE | 3 |

The tree diagram and the prioritization matrix are already covered by voc-ctq-tree and project-selection-matrix. Add a generic "goal → tasks" mode to the tree if wanted.

### B3. Risk

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 10 | Risk register with heat map | likelihood × severity, risk criteria, treatment (avoid, mitigate, transfer, accept), owner, review date, residual risk | QE VII, PA II.C.4, SQ II, BB VI.C, MD IV.A | 1 |
| 11 | Fault tree analysis builder | top event, AND/OR gates, basic-event probabilities, top-event probability, minimal cut sets | SQ, MD, BB, QE | 1 |
| 12 | Hazard analysis and risk control (ISO 14971 style) | hazard → hazardous situation → harm, risk before and after controls, benefit-risk note | MD, QE (hazard analysis) | 2 |
| 13 | Kraljic portfolio matrix | supply risk × profit impact, four quadrants, strategy per quadrant | SQ | 2 |

### B4. Supplier quality (mostly CSQP)

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 14 | Supplier selection weighted matrix with total risk factor | criteria library (quality, delivery, cost, capacity, financial, certification, risk), weights, scores | SQ, PA, QE | 1 |
| 15 | Supplier classification and lifecycle | non-approved → conditional → approved → preferred → certified → partnership → disqualified; rules for moving | SQ, PA | 2 |
| 16 | PPAP / part, process and service qualification plan | the qualification elements (PFD, PFMEA, control plan, MSA, capability, FAI, material tests, appearance, CoC/CoA, production run) as a checklist with status | SQ, PA, QE | 1 |
| 17 | Make/buy analysis | internal versus external capability, cost, risk, SWOT summary | SQ | 3 |
| 18 | Quality agreement checklist | the elements of a supplier quality agreement and change-notification terms | SQ | 3 |
| 19 | Supplier onboarding checklist | orientation and expectations | SQ | 3 |

### B5. Statistics and SPC (extend existing tools where possible)

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 20 | Probability calculator | addition and multiplication rules, conditional, complement, combinations and permutations, series and parallel reliability | PA, QE, BB | 1 |
| 21 | Attribute agreement analysis | percent agreement within and between appraisers and against standard, kappa | BB, QE | 1 |
| 22 | Taguchi loss function and signal-to-noise calculator | k from the edge loss, loss per unit, average loss k(σ² + (μ − T)²), S/N for all three goals | PA, BB (robust design) | 2 |
| 23 | Time-series / moving average trend tool | moving average, trend, seasonality | QE | 3 |
| 24 | Variables sampling plan (Z1.9 style) | k-method accept or reject | QE | 2 |
| 25 | Shelf-life accelerated aging calculator | ASTM F1980-style Q10 / Arrhenius aging time | MD | 3 |
| 26 | Alert and action levels | set alert and action limits from monitoring data (environmental monitoring) | MD | 3 |

### B6. Lean and daily management

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 27 | Kanban sizing calculator | demand × lead time × (1 + safety) ÷ container size | QE, BB, SQ, MD | 1 |
| 28 | 5S / 6S audit scorecard | score each S, trend over audits | QE, BB, SQ, MD, CT (6S) | 1 |
| 29 | Error-proofing (poka-yoke) worksheet | failure mode → prevention or detection device, effectiveness | QE, BB, SQ, MD | 1 |
| 30 | Standardized work combination sheet | steps, manual, walk and machine time against takt | QE, SQ | 2 |
| 31 | Gemba walk / daily huddle board | observations, actions, owner, date | MD, BB | 3 |
| 32 | Spaghetti diagram | trace movement on a layout, total distance | BB | 3 |
| 33 | Heijunka leveling | level a mix over a period | BB | 3 |

### B7. Problem solving, documentation and teams

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 34 | Engineering change impact / configuration management checklist | every document, plan, instruction, spec and stock location a change touches, owner sign-off | PA (the root cause of the whole Pellingham case), QE II.B.2, MD III.D.3 | 1 |
| 35 | 8D report | D0–D8 with containment and verification | SQ IV.C.2, PA, QE | 1 (check corrective-action-capa first; may be a mode of it) |
| 36 | Is / Is Not (Kepner-Tregoe) | what, where, when, extent: is versus is not, distinctions, possible causes | MD | 2 |
| 37 | A3 report | one-page problem-solving storyboard | BB | 2 |
| 38 | Benchmarking gap worksheet | own versus partner measures, gap, practices, adaptation | PA, QE, BB | 2 |
| 39 | Out-of-control action plan (OCAP) builder | signal → checks in order → actions → reaction plan, with log | PA, QE, BB | 2 |
| 40 | Meeting agenda and action log | timed agenda, roles, decisions, actions (one owner, one date) | PA, BB | 2 |
| 41 | Customer survey designer and analyzer | question checks (leading, double-barreled), Likert summary, top-box, net promoter score | PA IV.B, QE I.G, BB IV.A.2 | 2 |
| 42 | Lot traceability / genealogy record | forward and backward trace, lots → serials → shipments; recall bounding | PA IV.E, QE IV.B.1, MD III.D.5 | 2 |
| 43 | IQ/OQ/PQ validation protocol builder | protocol, acceptance criteria, results, report | QE III.D, MD IV.H, PA IV.C | 2 |
| 44 | Requirements traceability matrix (design control) | inputs → outputs → verification → validation | QE III.B.2, MD III.D.2 | 2 |
| 45 | ALCOA+ data integrity checklist | the nine attributes against a record set | MD II.B.3, PA III.B.4 | 2 |
| 46 | Complaint handling / reportability decision guide | complaint → investigation → MDR or vigilance reportable? | MD | 3 |
| 47 | Design review checklist / DFX | design review roles and questions; design-for-X prompts | QE, SQ, BB | 3 |
| 48 | Audit opening and closing meeting record | attendees, purpose, scope, rating criteria, results, concurrence, next steps | MD (audit-plan-schedule may already cover; check) | 3 |
| 49 | Dashboard / KPI builder | leading and lagging, OKRs, line of sight (balanced-scorecard partly covers) | QE VI.A.5, BB II.C.1 | 3 |

### B8. Calibration and metrology (CCT; some useful for CQT and CQI)

| # | Tool | What it does | Exams | Pri |
|---|---|---|---|---|
| 50 | SI and metrology unit converter | SI prefixes, derived units, English/metric, angular (degrees, minutes, seconds, grads, radians), scientific and engineering notation, percent / ppm / dB | CT (also CQT, CQI) | 1 |
| 51 | IM&TE specification calculator | accuracy from % of reading + % of range or full scale + counts, the floor, the allowed error at a given reading | CT | 1 |
| 52 | TUR / TAR and guard-band calculator | test uncertainty and accuracy ratios, guard-banded acceptance limits, PFA and PFR (false accept and reject) estimates | CT (also CQT) | 1 |
| 53 | Rounding and significant figures | round and truncate to digits; least significant digit | CT | 3 |
| 54 | Interpolation and extrapolation from a calibration table | linear interpolation, slope, intercept | CT | 3 |
| 55 | Calibration certificate / label record | the certificate elements, as-found and as-left, conformity statement with decision rule | CT | 2 |

---

## C. Extensions to existing tools (cheaper than new tools)

| Existing | Add | Exams |
|---|---|---|
| spc calculator (Xbar, I-MR, attributes) | moving average / moving range (MAMR); short-run SPC (DNOM / standardized) | QE VI.F.5, VI.F.7; BB VIII.A.4 |
| capability calculator (Cp, Cpk, Pp, Ppk) | Cpm, Cr; Box-Cox / non-normal capability | QE VI.G.3; BB V.F.2, V.F.5 |
| distribution-explorer (normal, binomial, Poisson, uniform) | exponential, Weibull, lognormal, hypergeometric, t, F, chi-square, multinomial | QE VI.C, BB V.E.2–3, PA III.A.2 |
| confidence-interval-calculator | tolerance intervals; prediction intervals | QE VI.D.1, BB VI.B.4 |
| correlation-regression | confidence interval for r; residual plots; prediction interval | QE VI.E.2, BB VI.A.1–2, PA III.F.1 |
| samplesize calculator (estimation) | sample size and power for tests of means and proportions | BB VI.B.3, QE VI.H.3 |
| full-factorial-doe | two-level fractional factorials with confounding and resolution | QE VI.H.5, BB VII.A.5 |
| oc calculator (attributes) | double sampling; AOQ and AOQL curve | QE IV.C, PA III.C.2 |
| voc-ctq-tree | generic tree-diagram mode | QE V.B.2, BB IV.D.2 |

Already covered, no action: chi-square contingency and goodness of fit (chi-square-proportions-test); paired t and F test (t-test-calculator); RSS tolerancing (tolerance-stack-up); bias, linearity and stability (msa-accuracy-precision); Little's law and PCE (value-stream-map-takt); DPU and RTY (yield); OEE (constraints-oee).

---

## Suggested order
1. **Re-tagging (A).** One config edit and one rebuild, and every exam filter gets more useful at once.
2. **Priority-1 new tools that serve the most exams.**
   - Check sheet; flowchart and swimlane.
   - Critical path / PERT; risk register with heat map; fault tree.
   - Affinity diagram, interrelationship digraph and PDPC.
   - Probability calculator; attribute agreement analysis.
   - Kanban sizing; 5S audit; poka-yoke worksheet.
   - Engineering change impact checklist.
   - Supplier selection matrix; PPAP / qualification plan.
   - The three CCT calculators (if CCT is added).
3. **Extensions (C).** Each is small and lifts QE and BB coverage.
4. Priority 2, then 3.

**Counts.** 55 new tools listed (20 priority 1, 19 priority 2, 16 priority 3), 9 extensions to existing tools, and about 30 re-tags for CQPA alone.
