"""Content for the /tools/ pages. Batch 1: eight tools.
'covers' is the CSSYB 2022 Body of Knowledge reference(s) the tool serves."""

PAGES = [
dict(slug="sipoc", name="SIPOC builder", covers="CSSYB II.A.4",
title="SIPOC Builder — Free Online SIPOC Template | SC Quality Guild",
desc="Free SIPOC builder. Set the start and stop points, list suppliers, inputs, process, outputs and customers, and get a printable SIPOC with checks on what is missing.",
h1="SIPOC builder",
lede="Suppliers, inputs, process, outputs and customers on one page, drawn as you type, with a check on the things teams usually leave out.",
content="""
<h2>What a SIPOC is for</h2>
<p>A SIPOC is a one-page, high-level view of a process, made in the Define phase before anyone maps the
detail. It answers three questions the team needs to agree on early: <b>where the process starts and stops</b>,
<b>what goes in and comes out</b>, and <b>who is on either side of it</b>. Those answers set the project's
boundaries and tell you whose voice you need to hear and whose data you will need.</p>
<p>It is deliberately coarse. Four to seven process steps, each a verb and a noun, is the usual range. If
your process column is running to fifteen steps, you are drawing a process map, which is a different tool
for a later stage.</p>

<h2>The order to fill it in</h2>
<ul>
  <li><b>Boundaries first.</b> Write the event that starts the process and the event that ends it. Most
  arguments about scope are really arguments about these two lines.</li>
  <li><b>Then P.</b> The four to seven major steps between them.</li>
  <li><b>Then O and C.</b> What the process produces, and who receives each output. Customers can be
  internal: the next department is a customer.</li>
  <li><b>Then I and S.</b> What each step needs, and who provides it.</li>
</ul>
<p>Working outward from the process keeps the lists tied to it. Starting with suppliers tends to produce a
list of everyone the business deals with.</p>

<h2>What the checks look for</h2>
<p>The builder flags a missing start or stop point, a process column outside four to seven steps, and
empty columns. It also points out anyone listed as both supplier and customer, which is common (the
customer supplies the order and receives the product) and worth noticing, because those people have a stake
at both ends.</p>

<h2>On the Yellow Belt exam</h2>
<p>The 2022 Certified Six Sigma Yellow Belt Body of Knowledge places SIPOC under process inputs and outputs
(II.A.4), alongside supply chain management (II.A.5). Expect questions that give you a process and ask
which column an item belongs in, or what the SIPOC is used to decide. A common trap: an input is a thing,
a supplier is who provides it.</p>
"""),

dict(slug="project-charter", name="Project charter", covers="CSSYB II.B.1",
title="Six Sigma Project Charter Template — Free, With Statement Checks | SC Quality Guild",
desc="Free Six Sigma project charter template. Business case, problem and goal statements, scope, team and milestones, with checks that flag a problem statement that names a cause or a solution.",
h1="Project charter",
lede="The business case, problem, goal, scope, team and milestones in the order the work needs them, with checks on the two statements that most charters get wrong.",
content="""
<h2>What the charter does</h2>
<p>The charter is the agreement between the sponsor and the team. It says what problem is being worked on,
why it matters, what success looks like in numbers, what is in and out of scope, who is on the team and
when each phase should finish. Sponsor sign-off is the key Define deliverable and is confirmed at the Define tollgate. Everything after it can be
checked against it, which is why it is worth writing carefully.</p>

<h2>The problem statement: a fact, not a diagnosis</h2>
<p>A good problem statement says <b>what</b> is wrong, <b>where</b>, <b>since when</b> and <b>how big</b>,
and stops there. It does not say why, and it does not say what to do about it.</p>
<p>Compare: <i>"Rejects are high on line 3 because of new operators, so we need more training."</i> That
statement has already decided the cause and the fix. The team will spend the project proving it. Against:
<i>"From January to June, 4.2% of line 3 assemblies were rejected for nicked seals, against 1.0% on lines 1
and 2 building the same part."</i> That one gives the team a gap to explain and leaves the explanation
open.</p>
<p>The checks above look for words that usually signal a cause (<i>because</i>, <i>due to</i>, <i>lack
of</i>) or a solution (<i>implement</i>, <i>install</i>, <i>need to</i>), and for a statement with no number
in it. They are word checks, not judgment; read the flags and decide.</p>

<h2>The goal statement: from, to, by</h2>
<p>A goal statement names the metric, the baseline, the target and the date: <i>reduce X from A to B by
date</i>. Fill in the four goal fields and the tool writes the sentence for you. The goal is usually set
somewhere between the baseline and the best performance anyone has seen, and is agreed with the sponsor,
not set by the team alone.</p>

<h2>Scope</h2>
<p>Write the out-of-scope list as carefully as the in-scope one. Teams lose weeks to work that someone
assumed was included. If the sponsor will not agree to a scope line now, that is a risk worth writing
down.</p>

<h2>On the Yellow Belt exam</h2>
<p>The project charter is topic II.B.1 of the 2022 CSSYB Body of Knowledge. Expect to be asked which
element of a charter a given sentence belongs to, and to spot a problem statement that contains a cause or
a solution.</p>
"""),

dict(slug="fishbone-5-whys", name="Fishbone and 5 whys", covers="CSSYB IV.B, I.E.1",
title="Fishbone Diagram and 5 Whys Builder — Free Online | SC Quality Guild",
desc="Free fishbone (Ishikawa) diagram builder with a 5 whys chain underneath. Brainstorm causes by category, draw the diagram, ask why with evidence, and check the root cause before you act on it.",
h1="Fishbone and 5 whys",
lede="Brainstorm causes on a fishbone, pick the most likely, then ask why until you reach something you can act on, writing down the evidence at every step.",
content="""
<h2>Two tools, one job</h2>
<p>The fishbone (cause-and-effect or Ishikawa diagram) is for <b>breadth</b>: getting every plausible cause
out of the team's heads and into categories, so nothing obvious is missed. The 5 whys is for <b>depth</b>:
taking one cause and following it down until you reach something the process can change. Used together,
the fishbone stops the whys from chasing the first idea mentioned, and the whys stop the fishbone from
ending as a poster of guesses.</p>

<h2>The categories</h2>
<p>The six categories here are the common manufacturing set: people, machine, method, material,
measurement and environment, often called the 6Ms. They are a prompt, not a rule. Service processes often
use policies, procedures, people, place and systems instead. Rename them to whatever makes your team think
of causes it would otherwise miss.</p>
<p>Do not leave measurement out. A surprising number of "process" problems turn out to be a gauge that
cannot tell good from bad.</p>

<h2>Five is not the number</h2>
<p>The name is a rule of thumb. Some chains reach an actionable cause in three whys; some take seven. Stop
when the answer is something the process can change and you can test. Stop sooner if the next answer would
be outside anyone's control.</p>
<p>The column that matters most is <b>evidence</b>. A chain of whys answered from opinion feels convincing
and is often wrong, because each answer is the most plausible-sounding one, not the true one. Write down
what shows each answer is true: a measurement, an observation, a document.</p>

<h2>"Human error" is where the analysis starts</h2>
<p>If the chain ends at "operator error", ask two more questions: why did the process make the error
possible, and why did nothing catch it? The tool flags root causes that blame people for this reason.</p>

<h2>A root cause is a hypothesis until you test it</h2>
<p>The strongest test is to switch the effect on and off: remove the cause and the problem goes away, put it
back and the problem returns. Write down how you will check before you act.</p>

<h2>On the Yellow Belt exam</h2>
<p>Root cause analysis is topic IV.B of the 2022 CSSYB Body of Knowledge, and the 5 whys is one of its
named methods. The cause-and-effect (fishbone) diagram is one of the seven basic quality tools in I.E.1.
Expect to be asked which tool suits a situation, and which category a listed cause belongs in.</p>
"""),

dict(slug="fmea", name="FMEA worksheet", covers="CSSYB IV.A.2",
title="FMEA Worksheet — Free Online Template With RPN | SC Quality Guild",
desc="Free FMEA worksheet. Failure modes, effects and causes scored for severity, occurrence and detection, RPN calculated, rows ranked, and high-severity rows flagged whatever their RPN.",
h1="FMEA worksheet",
lede="Failure modes, effects and causes scored for severity, occurrence and detection, with the RPN calculated, the rows ranked and the high-severity ones flagged.",
content="""
<h2>What an FMEA is</h2>
<p>Failure mode and effects analysis is a structured way of asking, step by step, <b>how could this go
wrong, what would happen, and why would it happen?</b> before it does. A process FMEA works through the
steps of a process; a design FMEA works through the functions of a product. The output is a ranked list of
risks and the actions taken to reduce them.</p>

<h2>Reading the columns</h2>
<ul>
  <li><b>Failure mode:</b> how the step fails to do its job (seal nicked, seal missing).</li>
  <li><b>Effect:</b> what the customer, the next step or the user experiences as a result.</li>
  <li><b>Severity (S):</b> how serious that effect is, 1 to 10.</li>
  <li><b>Cause:</b> why the failure mode happens. One row per cause.</li>
  <li><b>Occurrence (O):</b> how often the cause is expected to happen, 1 to 10.</li>
  <li><b>Current controls and detection (D):</b> how likely the failure is to get past today's controls
  undetected, 1 to 10, where 10 means it will almost certainly not be caught.</li>
</ul>
<p>The risk priority number is <b>RPN = S × O × D</b>, from 1 to 1000.</p>

<h2>The trouble with RPN</h2>
<p>RPN is easy to calculate and easy to misread. The same number can describe very different risks: 9 × 2 ×
5 and 3 × 6 × 5 are both 90, but the first is a severe effect and the second a nuisance. That is why the
worksheet shades every row with severity 9 or 10, and flags equal RPNs with different severities. A
high-severity failure needs attention however low its RPN.</p>
<p>This is also why the 2019 AIAG and VDA FMEA handbook replaced RPN with an action priority rating that
weighs severity first. Many companies, and the Yellow Belt exam, still use RPN, so it is used here; if your
customer requires action priority, use their table for the ranking.</p>

<h2>After the action</h2>
<p>An FMEA is not finished when the actions are assigned. Re-score each row after its action is in place.
Severity normally stays the same, because an action rarely changes how bad the effect would be; occurrence
or detection should fall. If neither does, the action did not reach the cause.</p>

<h2>On the Yellow Belt exam</h2>
<p>FMEA is topic IV.A.2 of the 2022 CSSYB Body of Knowledge. Expect to calculate an RPN, to say which of
several rows to act on first, and to know which of the three ratings an action is likely to change.</p>
"""),

dict(slug="control-plan", name="Control plan", covers="CSSYB V.B.1",
title="Control Plan Template — Free Online, With Reaction Plan Checks | SC Quality Guild",
desc="Free control plan template. Characteristics, specifications, measurement, sample size, frequency, control method and reaction plan, with checks for missing or weak reaction plans.",
h1="Control plan",
lede="What is checked, how, how often and what happens when it fails, for every characteristic that matters, with checks on the reaction plans.",
content="""
<h2>What the control plan is for</h2>
<p>The control plan is how a process keeps the gains a project made. It lists every characteristic that
needs watching, and for each one: the specification, how it is measured, how many and how often, the
method of control, and the <b>reaction plan</b> when a check fails. In the Control phase it is the document
the project hands to the process owner.</p>

<h2>Product and process characteristics</h2>
<p>A product characteristic is on the part: a diameter, a burr, a leak rate. A process characteristic is a
setting that produces it: a press force, a temperature, a tool's condition. Controlling only product
characteristics means finding problems after the parts are made. Controlling the process settings that
drive them finds problems before. A good plan has both, and the tool notices when every row is a product
characteristic.</p>

<h2>Special characteristics</h2>
<p>Many customers require certain characteristics to be designated as critical or significant, usually
those affecting safety, regulatory compliance or fit and function. Those normally need stronger control
than a first-piece visual check: statistical process control, a 100% automated check, or error-proofing that
makes the defect impossible. The checks above flag special characteristics controlled only by visual or
first-piece checks.</p>

<h2>The reaction plan is the point</h2>
<p>A reaction plan that says <i>"notify the supervisor"</i> tells you who to call and nothing about what
happens next. A useful one says what to do with the process (stop, adjust, change the tool), what to do
with the parts (quarantine back to the last good check), and how to confirm it is fixed before restarting.
The tool flags reaction plans that are missing, or that only name someone to tell.</p>

<h2>Phases</h2>
<p>In automotive practice a control plan exists at three main phases: prototype, pre-launch and production. The 2024 AIAG Control Plan manual also describes a safe-launch phase. The
checks usually tighten at pre-launch and relax, with evidence, in production.</p>

<h2>On the Yellow Belt exam</h2>
<p>The control plan is topic V.B.1 of the 2022 CSSYB Body of Knowledge, next to control charts (V.B.2)
and document control (V.B.3). Expect questions on what a control plan contains
and what a reaction plan is for.</p>
"""),

dict(slug="basic-statistics", name="Basic statistics calculator", covers="CSSYB III.A",
title="Basic Statistics Calculator — Mean, Median, Standard Deviation | SC Quality Guild",
desc="Free descriptive statistics calculator. Paste your data for mean, median, mode, range, sample and population standard deviation, quartiles and a histogram, with a plain reading of what they say.",
h1="Basic statistics calculator",
lede="Paste a column of numbers and get the mean, median, mode, range, standard deviation, quartiles and a histogram, with a plain reading of what they say about the data.",
content="""
<h2>Center: mean, median, mode</h2>
<p>The <b>mean</b> is the arithmetic average. It uses every value, which makes it sensitive to extreme
ones. The <b>median</b> is the middle value when the data are sorted, or the average of the two middle
values when there is an even number. It ignores how far out the extremes are. The <b>mode</b> is the most
frequent value, and is most useful for counts and categories; continuous measurements often have no
repeated value at all.</p>
<p>When the mean and median are close, the data are roughly symmetric. When the mean is pulled well above
the median, the data have a long tail to the right, and the median is the better description of a typical
value. The calculator says which.</p>

<h2>Spread: range, standard deviation, IQR</h2>
<p>The <b>range</b> is the largest value minus the smallest. It is easy to compute and depends entirely on
the two most extreme values. The <b>standard deviation</b> uses every value: roughly, the typical distance
of a value from the mean. The <b>interquartile range</b> is the spread of the middle half of the data, from
the first quartile (Q1) to the third (Q3), and like the median it is not moved by extremes.</p>

<h2>Sample or population: n − 1 or n</h2>
<p>The sample standard deviation, <i>s</i>, divides the sum of squared deviations by <b>n − 1</b>. The
population standard deviation, <i>σ</i>, divides by <b>n</b>. Use <i>s</i> when your data are a sample from
a larger process, which in quality work is almost always: thirty parts measured from a run of thousands.
Dividing by n − 1 corrects for the fact that a sample's values sit closer to their own mean than to the
true process mean. Spreadsheets give both: <code>STDEV.S</code> is <i>s</i>, <code>STDEV.P</code> is
<i>σ</i>.</p>

<h2>How the quartiles are calculated</h2>
<p>There are several conventions for quartiles, and they give slightly different answers on small data
sets. This calculator uses linear interpolation between sorted values, the same method as Excel's
<code>QUARTILE.INC</code>. Values more than 1.5 × IQR beyond the quartiles are flagged as possible
outliers. Find out what happened to them before deleting anything; an outlier is often the most useful
value in the set.</p>

<h2>On the Yellow Belt exam</h2>
<p>Basic statistics is topic III.A of the 2022 CSSYB Body of Knowledge. Expect to calculate a mean, median,
mode, range and standard deviation by hand from a short list, and to say which measure of center or spread
suits a given situation.</p>
"""),

dict(slug="corrective-action-capa", name="Corrective and preventive action", covers="CSSYB IV.C, IV.D",
title="Corrective Action (CAPA) Form — Free Online Template | SC Quality Guild",
desc="Free corrective and preventive action form. Describe, contain, find the root cause of both occurrence and escape, act, check elsewhere and verify effectiveness, with a status check at every stage.",
h1="Corrective and preventive action",
lede="Describe, contain, find the cause, act, check where else it could happen, and verify it worked, with a running check on which stages are complete.",
content="""
<h2>Correction, corrective action, preventive action</h2>
<p>Three terms that are easy to blur:</p>
<ul>
  <li><b>Correction</b> deals with the nonconformity itself: sort the stock, rework the parts. Containment
  belongs here. It protects the customer and does nothing about the cause.</li>
  <li><b>Corrective action</b> removes the cause of a nonconformity that has happened, so it does not
  happen again.</li>
  <li><b>Preventive action</b> removes the cause of a potential nonconformity before it happens. In
  practice the most useful preventive question comes straight out of a corrective action: <i>where else
  could this same cause be at work?</i></li>
</ul>

<h2>Two causes, not one</h2>
<p>Every defect that reaches a customer has two causes: why it was made, and why it was not caught. Fix only
the first and the detection gap is still there for the next problem. The form asks for both, and the status
check flags corrective actions that address only one.</p>

<h2>Training is rarely the answer</h2>
<p>Retraining and reminders are the most common corrective actions and among the weakest, because they
depend on people remembering under pressure. If every action on the form is training, the tool says so.
Look for an action that changes the process, the tooling or the check so the error cannot happen or cannot
escape.</p>

<h2>Effectiveness is not completion</h2>
<p>An action can be finished on time and change nothing. Effectiveness is checked against the original
problem, after enough time or volume that a recurrence would have shown up. Write the criteria before the
actions are taken, so the result cannot be talked into a pass afterwards. The form will not count a CAPA as
effective without a result and a date, and flags one closed before its effectiveness check.</p>

<h2>On the Yellow Belt exam</h2>
<p>Corrective action (IV.C) and preventive action (IV.D) are separate topics in the 2022 CSSYB Body of
Knowledge. Expect to be asked to tell the two apart, and to distinguish them from correction or
containment.</p>
"""),

dict(slug="data-collection-plan", name="Data collection plan and check sheet", covers="CSSYB III.B.1, III.B.2, III.B.3",
title="Data Collection Plan and Check Sheet — Free Online Template | SC Quality Guild",
desc="Free data collection plan template with a clickable check sheet. Operational definitions, data types, sampling and stratification, then tally by category and period and paste the totals into a Pareto.",
h1="Data collection plan and check sheet",
lede="Plan what to collect, define it so everyone records the same thing, then tally it on a check sheet that totals itself.",
content="""
<h2>Start with the question</h2>
<p>A data collection plan begins with the question the data have to answer. <i>"Is the reject rate
different between shifts?"</i> tells you to record the shift on every result. <i>"Let's collect some data on
rejects"</i> tells you nothing, and the data that come back usually cannot answer the question that turns
up later.</p>

<h2>Operational definitions</h2>
<p>An operational definition says exactly what counts and how it is measured, clearly enough that two
people would record the same thing. "Scratch" is not an operational definition. "Any mark on surface A
visible at arm's length under the bench light, that a fingernail catches on" is. Without one, a change in
the data may only be a change in who was recording.</p>

<h2>Data types</h2>
<ul>
  <li><b>Continuous (variable) data</b> are measured on a scale: diameter, time, force.</li>
  <li><b>Discrete data</b> are counts: defects per unit, calls per hour.</li>
  <li><b>Attribute data</b> are categories: pass or fail, defect type. Measurements and counts are quantitative data; categories are qualitative. Many texts, including the ASQ Green Belt Body of Knowledge, group discrete and attribute data together, so expect either usage.</li>
</ul>
<p>The type decides which charts and tests you can use later. It also decides how much data you need:
attribute data need far larger samples than continuous data to detect the same change. If something can be
measured on a scale, it is usually worth measuring rather than judging pass or fail.</p>

<h2>Stratify at the time</h2>
<p>Record the things you might want to split the data by when you collect it: shift, machine, operator,
material lot. It costs a column on the sheet. Trying to reconstruct which lot a part came from three weeks
later is usually impossible. The plan check flags measures with nothing to stratify by.</p>

<h2>The check sheet</h2>
<p>A check sheet is the simplest data collection form there is: categories down the side, periods across
the top, a mark each time something happens. It shows patterns as it fills (all the marks on Wednesday, or
in one row) and it produces counts ready for a Pareto chart. The one here totals itself; print it if you
would rather collect on paper.</p>

<h2>On the Yellow Belt exam</h2>
<p>Data collection plans (III.B.1), qualitative and quantitative data (III.B.2) and data collection
techniques (III.B.3) are all in the 2022 CSSYB Body of Knowledge. Expect to classify data by type and to
recognize what a data collection plan contains.</p>
"""),
]

from tools_content2 import PAGES2
# Hub and cross-link order follows the DMAIC flow.
ORDER = ["dmaic-roadmap","six-sigma-roles-raci","team-development-stages","multivoting-nominal-group-technique",
 "eight-wastes-waste-walk","voc-ctq-tree","project-selection-matrix","stakeholder-analysis","sipoc","project-charter",
 "communication-plan","wbs-gantt-chart","dmaic-phase-review-checklist","basic-statistics","data-collection-plan",
 "msa-accuracy-precision","fishbone-5-whys","fmea","corrective-action-capa","distribution-explorer",
 "correlation-regression","kaizen-pdca-planner","cost-benefit-payback","control-plan","work-instruction-sop"]
# Quality manager (CMQ/OE) tools, in Body of Knowledge order. A second group on the hub;
# related links rotate within each group.
from tools_content3_a import PAGES3A
from tools_content3_b import PAGES3B
from tools_content3_c import PAGES3C
from tools_content3_d import PAGES3D
ORDER_MQ = ['change-management-plan', 'ethics-compliance-decision-guide', 'strategic-plan-builder', 'swot-pestle-analysis', 'hoshin-x-matrix', 'balanced-scorecard', 'financial-analysis-npv-irr', 'lessons-learned-register', 'management-review', 'cost-of-quality', 'constraints-oee', 'customer-value-segmentation', 'qfd-house-of-quality', 'supplier-scorecard', 'training-needs-skills-matrix', 'training-plan-kirkpatrick']
from tools_content4_e import PAGES4E
from tools_content4_e2 import PAGES4E2
from tools_content4_f import PAGES4F
from tools_content4_f2 import PAGES4F2
from tools_content4_f3 import PAGES4F3
from tools_content4_g import PAGES4G
from tools_content4_h import PAGES4H
from tools_content4_h2 import PAGES4H2
from tools_content5_a import PAGES5A
from tools_content6_b2 import PAGES6B2
ORDER_GB = ["value-stream-map-takt","kano-model","confidence-interval-calculator","attribute-capability","multi-vari-chart",
 "t-test-calculator","chi-square-proportions-test","one-way-anova","full-factorial-doe","smed-setup-reduction"]
ORDER_QA = ["audit-plan-schedule","process-audit-turtle-diagram","audit-checklist-working-papers","audit-sampling-plan",
 "audit-nonconformity-report","audit-car-verification-tracker","auditor-competence-evaluation","audit-program-risk-schedule","audit-program-metrics"]
ORDER_IN = ["drawing-title-block-tolerance-reader","gdt-position-tolerance","tolerance-stack-up","gauge-resolution-10-to-1",
 "cqt-measurement-uncertainty-budget","sine-bar-height-gauge-record","cqt-calibration-oot-impact","calibration-interval-adjustment",
 "first-article-inspection","attribute-inspection-defect-classification","cqt-nonconforming-material-disposition","cqt-reliability-mtbf-calculator"]
# Process analyst, engineer and supplier quality tools (CQPA, CQE, CSSBB, CSQP, CMDA), from Oct 2026.
ORDER_LN = []
ORDER_SQ = []
ORDER_RG = []
ORDER_PR = ["flowchart-swimlane", "activity-network-critical-path", "risk-register-heat-map", "fault-tree-analysis", "probability-calculator", "affinity-diagram", "interrelationship-digraph", "process-decision-program-chart", "matrix-diagram", "force-field-analysis"]
_all = {p["slug"]: p for p in PAGES + PAGES2 + PAGES3A + PAGES3B + PAGES3C + PAGES3D + PAGES4E + PAGES4E2 + PAGES4F + PAGES4F2 + PAGES4F3 + PAGES4G + PAGES4H + PAGES4H2 + PAGES5A + PAGES6B2}
_ord = ORDER + ORDER_MQ + ORDER_GB + ORDER_QA + ORDER_IN + ORDER_PR + ORDER_LN + ORDER_SQ + ORDER_RG
assert sorted(_all) == sorted(_ord), set(_all) ^ set(_ord)
PAGES_YB = [_all[s] for s in ORDER]
PAGES_MQ = [_all[s] for s in ORDER_MQ]
PAGES_GB = [_all[s] for s in ORDER_GB]
PAGES_QA = [_all[s] for s in ORDER_QA]
PAGES_IN = [_all[s] for s in ORDER_IN]
PAGES_PR = [_all[s] for s in ORDER_PR]
PAGES_LN = [_all[s] for s in ORDER_LN]
PAGES_SQ = [_all[s] for s in ORDER_SQ]
PAGES_RG = [_all[s] for s in ORDER_RG]
# hub groups: id, heading, subhead, pages
GROUPS = [
 ("six-sigma", "Six Sigma project tools", "{n} tools that follow a DMAIC project and cover the Six Sigma Yellow Belt Body of Knowledge.", PAGES_YB),
 ("green-belt", "Green Belt statistics and lean tools", "{n} tools for the analysis and lean topics of the Six Sigma Green Belt Body of Knowledge: hypothesis tests, ANOVA, DOE, confidence intervals and value stream mapping.", PAGES_GB),
 ("auditor", "Quality auditor tools", "{n} tools for planning, conducting and following up audits and running an audit program, written for the Quality Auditor (CQA) Body of Knowledge.", PAGES_QA),
 ("inspection", "Inspection, measurement and calibration tools", "{n} tools for drawings, GD&amp;T, measurement, calibration and inspection records, written for the Quality Inspector (CQI) and Quality Technician (CQT) Bodies of Knowledge, plus a reliability calculator for the Quality Engineer (CQE).", PAGES_IN),
 ("quality-manager", "Quality manager tools", "{n} tools for planning, running and improving a quality system, written for the Manager of Quality/Organizational Excellence (CMQ/OE) Body of Knowledge.", PAGES_MQ),
 ("process-risk", "Process, planning and risk tools", "{n} tools for mapping processes, planning projects and analyzing risk and probability, written for the Quality Process Analyst (CQPA), Quality Engineer (CQE) and Six Sigma Black Belt (CSSBB) Bodies of Knowledge, and useful for supplier quality and medical device auditing.", PAGES_PR),
 ("lean", "Lean and daily management tools", "{n} tools for pull, flow, standard work, 5S and error-proofing, written for the lean topics of the CQPA, CQE and CSSBB Bodies of Knowledge.", PAGES_LN),
 ("supplier", "Supplier quality tools", "{n} tools for selecting, qualifying, classifying and managing suppliers, written for the Supplier Quality Professional (CSQP) Body of Knowledge and the supplier topics of CQPA and CQE.", PAGES_SQ),
 ("regulated", "Validation, design control and regulated-industry tools", "{n} tools for risk management, validation, design control, data integrity and complaint handling, written for the Medical Device Auditor (CMDA) Body of Knowledge and the related CQE topics.", PAGES_RG)]
GROUPS = [g for g in GROUPS if g[3]]
PAGES = [p for g in GROUPS for p in g[3]]
