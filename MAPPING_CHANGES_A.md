# Section A: CQPA re-tagging, for review (9 Oct 2026)

These are edits to `generator/resources_src/consts.js`. The Resources page has **not** been rebuilt.
After the edits, 49 of 72 tools are tagged CQPA (21 before), plus the `linearity` and `grrcpk` calculators.

Each item was checked against `reference/bok/CQPA_2026.txt`. **Strong** means the BoK names the topic. **Weak** means the link is indirect. Please confirm or drop each weak one.

## Added: `'cqpa'` (30 items)

| Item | CQPA BoK | Fit |
|---|---|---|
| project-charter | II.D project management; I.D team roles | Strong |
| six-sigma-roles-raci | I.D.4 team roles; II.C.2 belt roles | Strong |
| stakeholder-analysis | I.D.4 "team stakeholders"; I.B.1 | Strong |
| communication-plan | I.B.3 communicating quality; II.D.4 | Strong |
| wbs-gantt-chart | II.D.2 Gantt, WBS | Strong |
| change-management-plan | II.D.4 change management | Strong |
| lessons-learned-register | not named; general project management only | **Weak** |
| cost-of-quality | I.B.7 COQ | Strong |
| work-instruction-sop | I.B.6 procedures and work instructions | Strong |
| ethics-compliance-decision-guide | I.A professional conduct and ethics | Strong |
| drawing-title-block-tolerance-reader | I.B.5 "product or process specifications" only | **Weak** |
| audit-plan-schedule | I.C.2 audit planning | Strong |
| audit-checklist-working-papers | I.C.2 audit performance | Strong |
| audit-sampling-plan | I.C; III.C sampling | Strong |
| audit-nonconformity-report | I.C.2 final audit report | Strong |
| audit-car-verification-tracker | I.C.2 verification of corrective actions | Strong |
| value-stream-map-takt | II.C.1 value stream mapping | Strong |
| smed-setup-reduction | II.C.1 set-up reduction (SUR) | Strong |
| swot-pestle-analysis | II.C.4 risk; SWOT/PESTLE not named | **Weak** |
| project-selection-matrix | II.D.1 prioritization matrices | Strong |
| qfd-house-of-quality | IV.B QFD | Strong |
| kano-model | IV.B customer satisfaction; Kano not named | **Weak** |
| first-article-inspection | IV.C first-article | Strong |
| cqt-nonconforming-material-disposition | IV.E segregate and process nonconforming material | Strong |
| full-factorial-doe | III.F.3 DOE terms (Understand level) | Strong |
| multi-vari-chart | not named | **Weak** |
| attribute-capability | III.E.6 names Cp/Cpk/Pp/Ppk only | **Weak** |
| cqt-reliability-mtbf-calculator | III.A.4 MTTF, MTBF, MTTR | Strong |
| calculator: linearity | III.D MSA "bias, and linearity" | Strong |
| calculator: grrcpk | III.D gage R&R | Strong |

## Not changed: suggestions for you to decide
- **process-audit-turtle-diagram**: add CQPA? It is a process audit tool (I.C.1 product, process and system audits). It isn't on the TASKS list. I'd add it, since every other audit-trail tool is now CQPA.
- **CSQP, CCT, CMDA**: not added as exams, as CLAUDE.md requires. The tags TASKS.md lists for them are ready to apply once you say yes.
- I reviewed only the CQPA mappings against the BoK. The other exams' existing mappings are still the unconfirmed draft.
