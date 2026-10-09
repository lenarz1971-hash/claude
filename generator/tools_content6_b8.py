# Validation, design control and medical device risk tools, batch b8 (Oct 2026).
# Hazard analysis, IQ/OQ/PQ protocols, design traceability and ALCOA+ data
# integrity for CMDA, CQE, CQPA and CCT.
PAGES6B8 = [
dict(slug="hazard-analysis-risk-control", name="Hazard analysis and risk control (ISO 14971 style)",
covers="CMDA IV.A.1, IV.A.2, CQE III.E.4, VII.A.1, VII.B.2, VII.C.1",
title="Hazard Analysis and Risk Control — ISO 14971 Style, P1 x P2 | SC Quality Guild",
desc="Free medical device hazard analysis. Hazard, sequence of events, hazardous situation and harm; P1 x P2, severity, your risk matrix, controls and residual risk.",
h1="Hazard analysis and risk control",
lede="Trace each hazard through a sequence of events to a hazardous situation and a harm. Estimate the probability of harm as P1 &times; P2, rate the severity, judge the risk against a matrix you define, then record the controls and the risk that remains.",
content="""
<h2>Hazard, hazardous situation, harm</h2>
<p>Medical device risk management keeps three ideas apart:</p>
<ul>
<li>A <b>hazard</b> is a potential source of harm: heat, mains voltage, bacteria in standing water, a confusing screen.</li>
<li>A <b>hazardous situation</b> is a circumstance in which a person is exposed to the hazard. A hot heater plate inside a closed housing harms nobody; a patient breathing gas that the plate has overheated is exposed.</li>
<li><b>Harm</b> is the injury or damage to health that can follow.</li>
</ul>
<p>A <b>sequence of events</b> links the hazard to the hazardous situation: a part fails, a user slips, a cleaning step is skipped. Writing the chain out guards against vague entries such as "overheating".</p>

<h2>P1, P2 and the probability of harm</h2>
<p>The probability of harm is often split in two. <b>P1</b> is the probability that the sequence of events leads to the hazardous situation. <b>P2</b> is the probability that the hazardous situation leads to the harm. The probability of harm is P = P1 &times; P2. The two halves draw on different evidence: P1 on reliability data, tests and use studies; P2 on clinical knowledge. Where no sound estimate exists, as for software faults, many teams assume the worst-case probability and judge on severity.</p>

<h2>Risk evaluation</h2>
<p>Risk is the combination of the probability of harm and its severity. The manufacturer sets its own criteria for risk acceptability, in its risk management plan, before the analysis starts. The matrix above is that policy in picture form: click a cell to change it. Three regions are common: acceptable; a middle region where risk is reduced as far as practicable and the reason for stopping recorded; and unacceptable.</p>

<h2>Risk control, in order of priority</h2>
<ol>
<li><b>Inherent safety by design and manufacture:</b> remove the hazard or reduce its energy, as with a low-voltage supply.</li>
<li><b>Protective measures</b> in the device or the manufacturing process: cutoffs, interlocks, alarms.</li>
<li><b>Information for safety</b> and, where appropriate, training: warnings, instructions for use, labels.</li>
</ol>
<p>The order matters. A warning works only if someone reads it and acts on it every time, so using it alone on an unacceptable risk needs a written reason why design and protective measures were not practicable. Each control is <b>verified</b> twice: that it was implemented, and that it reduces the risk. Controls can create new hazards, such as a cutoff that stops therapy, so each one is checked for that too.</p>

<h2>Residual risk and benefit-risk</h2>
<p>Residual risk is what remains after control. If a risk is still not acceptable and no further control is practicable, the manufacturer may go ahead only if a <b>benefit-risk analysis</b> shows that the medical benefit of the intended use outweighs it. Finally the residual risks are judged together, as an overall residual risk, and the significant ones are disclosed to users. Production and post-production information, such as complaints and service data, is fed back into the file; it can show that an estimate was wrong.</p>

<h2>Hazard analysis, FMEA or risk register?</h2>
<p>An <a href="/tools/fmea.html">FMEA</a> works bottom up, from each failure mode to its effect, and misses hazards that occur with nothing failing, such as use errors in normal use. A hazard analysis works from the hazards and harms and covers normal use, fault conditions and foreseeable misuse. Many device makers use both. A <a href="/tools/risk-register-heat-map.html">risk register</a> covers business and project risk; a <a href="/tools/fault-tree-analysis.html">fault tree</a> can supply P1 for a complex sequence of events.</p>

<h2>On the exam</h2>
<p>CMDA IV.A.1 asks you to describe risk analysis, evaluation, control, benefit-risk analysis and the use of production and post-production information, and IV.A.2 to judge whether hazards are identified in normal and fault conditions, including use, and whether risk controls are implemented in design and production. CQE III.E.4 lists hazard analysis with FMEA and FMECA, VII.A.1 the risk terms (severity, occurrence), VII.B.2 risk matrices and acceptability criteria, and VII.C.1 documenting risks and controls. Expect to tell a hazard from a hazardous situation, multiply P1 by P2, and put the control options in priority order.</p>
"""),

dict(slug="iq-oq-pq-validation-protocol", name="IQ/OQ/PQ validation protocol",
covers="CQE III.D, CMDA IV.H, III.D.6, CQPA IV.C, CSQP III.C.3, CCT III.F",
title="IQ OQ PQ Validation Protocol Template — Free Online Builder | SC Quality Guild",
desc="Free IQ/OQ/PQ protocol builder. Scope, test cases with acceptance criteria, worst-case OQ, PQ runs, deviations and approvals, with a report status check.",
h1="IQ/OQ/PQ validation protocol",
lede="Write the protocol: scope, system, and the installation, operational and performance qualification tests with their acceptance criteria. Record the results and deviations, and see what still stands between you and an approved validation report.",
content="""
<h2>When a process needs validation</h2>
<p>Some processes make a result that can be checked completely afterward: a hole diameter can be measured on every part. Others cannot. A seal, a weld, a sterilization cycle or a molded part's internal stress can only be tested destructively, or the test would miss what matters. For those, the process itself is proven capable before it is used, so that the output can be trusted without testing it all. That proof is <b>process validation</b>. The first question in the protocol is therefore whether the output can be fully verified, and if it can, whether verification alone is enough.</p>

<h2>The three stages</h2>
<ul>
<li><b>Installation qualification (IQ)</b> gives documented evidence that the equipment is installed as specified: utilities, environment, calibration of the instruments, software version, drawings, manuals, spare parts and maintenance in place.</li>
<li><b>Operational qualification (OQ)</b> shows that the process works across its whole operating window. It is run at the limits of the parameters, the <b>worst case</b>, and it challenges the alarms and interlocks. OQ is where the validated window comes from.</li>
<li><b>Performance qualification (PQ)</b> shows that the process consistently produces conforming product under normal production conditions: real operators, real materials, normal settings, over several runs or lots so that the normal sources of variation, such as shifts, material lots and start-ups, are included.</li>
</ul>
<p>Some industries use "process qualification" or "process performance qualification" for the last stage; the idea is the same.</p>

<h2>Writing the protocol</h2>
<p>The protocol is approved <b>before</b> anything is run. It says what will be tested, how, how many, and what result counts as a pass. An acceptance criterion written after the result is known is not a criterion. Give the statistical rationale for sample sizes. For example, zero failures in 30 samples gives 90% confidence that the failure rate is below about 7.4%; zero in 90 gives 95% confidence that it is below about 3.3%.</p>
<p>Three consecutive PQ runs is a common convention, not a rule. The number should follow from the risk of the process and from what the statistics need.</p>

<h2>Deviations</h2>
<p>When a test fails, or the protocol cannot be followed as written, the failure is recorded as a <b>deviation</b>: what happened, its effect on the rest of the validation, the cause, and the resolution. A failed test stays failed in the record. The retest is a new test case, run after the cause is fixed. Rerunning until a test passes, and keeping only the pass, is one of the classic findings in a validation audit.</p>

<h2>The report and after</h2>
<p>The summary report states whether the evidence shows the process is validated, the operating window it is validated for, and any open items. It is approved after the last test and deviation are closed. Validation then has to be maintained: monitor the process, and revalidate when a change or a trend takes it outside what was proven. List those triggers in the report.</p>

<h2>Related tools</h2>
<p>A <a href="/tools/first-article-inspection.html">first article inspection</a> verifies one part against the drawing; validation proves the process. The <a href="/tools/control-plan.html">control plan</a> holds the monitoring that keeps a validated process in its window, and the <a href="/tools/hazard-analysis-risk-control.html">hazard analysis</a> shows which processes matter most.</p>

<h2>On the exam</h2>
<p>CQE III.D asks you to interpret verification and validation results, including IQ, OQ and PQ. CMDA IV.H covers process validation by IQ/OQ/PQ along with cleanliness, test method and rework validation, and III.D.6 the assessment of process validation within production and process controls. CQPA IV.C covers validation and qualification methods for approving new products and processes, CSQP III.C.3 internal process validation in a qualification plan, and CCT III.F validation of calibration processes and software. Expect to say which stage a test belongs to, why OQ uses worst-case settings, and what to do with a failed test.</p>
"""),

dict(slug="requirements-traceability-matrix", name="Requirements traceability matrix (design control)",
covers="CQE III.B.1, III.B.2, III.D, CMDA III.D.2, IV.A.2",
title="Requirements Traceability Matrix — Design Control Template | SC Quality Guild",
desc="Free design control traceability matrix. Link user needs, design inputs, outputs, verification and validation; find orphans and untested requirements.",
h1="Requirements traceability matrix",
lede="List the user needs, design inputs, design outputs, verification tests and validation studies, and link each to the one before it. The matrix builds itself and shows every gap: inputs without verification, needs without validation, and orphans on both sides.",
content="""
<h2>What design control traces</h2>
<p>Design control is the discipline of turning what users need into a design that provably meets it. It runs as a chain:</p>
<ul>
<li><b>User needs</b> state what the user, patient or market needs, in their own terms: "comfortable to breathe around the clock".</li>
<li><b>Design inputs</b> turn each need into requirements the design must meet, written so they can be checked: "outlet temperature 37 &deg;C &plusmn;2 &deg;C at 5 to 60 L/min". Inputs also come from regulations, standards and the risk analysis.</li>
<li><b>Design outputs</b> are the design itself: drawings, specifications, software, labeling, manufacturing instructions.</li>
<li><b>Verification</b> confirms that the outputs meet the inputs. Did we build the design right?</li>
<li><b>Validation</b> confirms that the finished device meets the user needs in its intended use. Did we build the right design?</li>
</ul>
<p>A <b>requirements traceability matrix</b> records the links, so that anyone can follow a need down to the test that proves it, or start from a drawing and find out why it exists.</p>

<h2>The gaps it finds</h2>
<ul>
<li><b>A need with no design input</b>: a requirement was never written, so nobody designed for it.</li>
<li><b>An input with no verification</b>: a requirement nobody has shown is met. This is the commonest gap, and the most serious when the input is a risk control.</li>
<li><b>A need with no validation</b>: the device may meet every specification and still not do what the user needs.</li>
<li><b>Orphans</b>: an input that traces to no need, or an output that implements no input. Either the trace is incomplete, or something is in the design that does not need to be, adding cost and its own risks.</li>
</ul>
<p>Requirements from regulations and standards are often shown by verifying their inputs rather than by a separate validation study, so they are marked "by verification" rather than as a gap. Say so in the validation plan.</p>

<h2>Risk controls in the trace</h2>
<p>Each risk control from the <a href="/tools/hazard-analysis-risk-control.html">hazard analysis</a> becomes a design input, and its verification is the evidence that the control was implemented and works. Carrying the hazard ID on the input links the two files, so a change to either can be followed through to the other.</p>

<h2>Keeping it alive</h2>
<p>The matrix is built up through the project and reviewed at each design review. Design changes are traced the same way: which needs, inputs, outputs and tests does this change touch, and which tests must be repeated? A matrix assembled at the end, just before submission, usually shows the gaps too late to fix them cheaply.</p>
<p>Validation uses initial production units, or their equivalent, under actual or simulated use. A study on prototypes needs a justification of why its results still hold for the production design.</p>

<h2>Related tools</h2>
<p><a href="/tools/qfd-house-of-quality.html">QFD</a> and the <a href="/tools/voc-ctq-tree.html">CTQ tree</a> are ways to turn the voice of the customer into design inputs; the matrix keeps track of them afterward. The <a href="/tools/iq-oq-pq-validation-protocol.html">IQ/OQ/PQ protocol</a> validates the manufacturing process, which is a different thing from validating the design.</p>

<h2>On the exam</h2>
<p>CQE III.B.1 asks you to classify design inputs from customer needs, regulatory requirements and risk assessment, and III.B.2 names requirements traceability as a design technique. CQE III.D covers interpreting verification and validation results. CMDA III.D.2 asks you to evaluate design and development controls: planning, input, output, review, verification, validation, transfer, changes and the design file. CMDA IV.A.2 asks you to verify that risk controls were implemented in the design. Expect to tell verification from validation, and to spot the gap in a short trace.</p>
"""),

dict(slug="alcoa-plus-data-integrity-checklist", name="ALCOA+ data integrity checklist",
covers="CMDA II.B.3, III.A.1, III.D.3, CQPA III.B.4, CCT III.G",
title="ALCOA+ Data Integrity Checklist — Audit Records, Score, Findings | SC Quality Guild",
desc="Free ALCOA+ data integrity checklist. Assess paper and electronic records against the nine attributes; get scores by attribute and record, and findings.",
h1="ALCOA+ data integrity checklist",
lede="Take a sample of records, paper or electronic, and judge each against the nine ALCOA+ attributes. Get a score for each record and each attribute, a chart of where the weaknesses are, and a findings list that ties each gap to its evidence.",
content="""
<h2>What data integrity means</h2>
<p>Data integrity is the extent to which data are complete, consistent and accurate throughout their life, from the moment they are captured until they are destroyed at the end of the retention period. A quality system runs on records: a batch is released because its records say it passed. If the records cannot be trusted, neither can the release.</p>
<p>Data integrity failures are not only fraud. Most are ordinary habits: a shared login because it is quicker, a week of entries written up on Friday, a printout kept while the electronic file is overwritten. Each one makes it impossible to show what actually happened.</p>

<h2>ALCOA and ALCOA+</h2>
<p>ALCOA is a memory aid for the properties a good record has. The original five are <b>attributable, legible, contemporaneous, original and accurate</b>. ALCOA+ adds four more: <b>complete, consistent, enduring and available</b>. The table in the tool says what each one means in practice and what to look for, on paper and on screen.</p>

<h2>Paper, electronic and hybrid records</h2>
<ul>
<li><b>Paper records</b> fail through good documentation practice lapses: overwriting, correction fluid, blank fields left open, entries made later.</li>
<li><b>Electronic records</b> fail through system setup: shared or generic logins, audit trails switched off or never reviewed, clocks that users can change, data held only on a local drive, files overwritten by the next run.</li>
<li><b>Hybrid systems</b>, an instrument with a printout that is signed, are the riskiest, because each half assumes the other is the record. A printout is not a complete copy of the electronic original: it loses the metadata and the audit trail.</li>
</ul>
<p>Electronic records and signatures used for regulated records have their own requirements, such as the FDA's 21 CFR Part 11 in the United States: validated systems, secure audit trails, unique user IDs and controlled signatures.</p>

<h2>How to run the assessment</h2>
<ol>
<li>Choose the sample: a lot, a period, a process. Pick at random where you can, and follow the data from the instrument to the release decision.</li>
<li>For each record, answer each attribute Yes, Partly, No or N/A. Look at the electronic original, not only the printout, and ask to see the audit trail.</li>
<li>Write a finding for every No, and for every Partly that matters, with the objective evidence.</li>
<li>Read the attribute chart. A weakness that shows up across several records points to a system cause, such as a procedure, a system setting or a habit, rather than one person's slip.</li>
</ol>
<p>The score counts Yes as one and Partly as a half, over the attributes answered. It is a summary to compare areas and track progress, not a pass mark. One record that was not contemporaneous can matter more than a high score.</p>

<h2>When a finding is serious</h2>
<p>A data integrity finding raises a second question: what decisions were made on these data? If product was released on results that cannot be shown to be true, the finding needs containment and an assessment of the product, as well as a corrective action.</p>

<h2>Related tools</h2>
<p>The <a href="/tools/audit-checklist-working-papers.html">audit checklist and working papers</a> hold the wider audit; this tool is the data integrity part of it. Findings go into an <a href="/tools/audit-nonconformity-report.html">audit nonconformity report</a>. The <a href="/tools/data-collection-plan.html">data collection plan</a> is where integrity is designed in, before any data are collected.</p>

<h2>On the exam</h2>
<p>CMDA II.B.3 asks you to examine record-keeping for data acquisition systems and evaluate audit data against ALCOA+. CMDA III.A.1 includes 21 CFR Part 11 on electronic records and signatures, and III.D.3 document and record control. CQPA III.B.4 covers data quality attributes and the methods that prevent and detect data integrity problems, such as audit trails and record management training, and CCT III.G the integrity of calibration records. Expect to name the attribute a described lapse breaks.</p>
"""),
]
