"""Content for the /tools/ pages, batch 4E2: more CQA (Certified Quality Auditor) audit tools."""

PAGES4E2 = [
dict(slug="audit-car-verification-tracker", name="CAR follow-up and verification tracker", covers="CQA II.D.2, II.D.3, II.D.4, II.D.5",
title="Audit CAR Tracker: Response Review, Verification and Effectiveness | SC Quality Guild",
desc="Free audit corrective action tracker. Review each response, verify implementation, schedule effectiveness checks, and escalate overdue or ineffective CARs.",
h1="CAR follow-up and verification tracker",
lede="Follow each corrective action request from an audit through response review, verification of implementation and the effectiveness check, with overdue and ineffective actions flagged for escalation.",
content="""
<h2>Who does what after the audit</h2>
<p>The auditee owns the problem: containment, root cause analysis, correction and corrective action.
The auditor, or the audit program, owns the follow-up: reviewing the response, verifying that the
actions were taken and later confirming that they worked. Keeping those roles apart protects the
auditor's objectivity. An auditor who designs the fix ends up auditing their own work.</p>

<h2>Reviewing the response</h2>
<p>Judge each element on its own:</p>
<ul>
  <li><b>Containment:</b> what was done about product, services or records already affected, such as
  holds, recalls, re-inspection or notifying the customer. Some findings need none.</li>
  <li><b>Root cause:</b> why the system allowed the nonconformity. "Human error" and "operator not
  trained" are usually symptoms; ask why the process let the error happen or go undetected.</li>
  <li><b>Correction:</b> fixing the instance found, for example calibrating the overdue gage.</li>
  <li><b>Corrective action:</b> removing the cause so it does not recur, and checking whether the same
  problem exists elsewhere.</li>
</ul>
<p>A response that is weak on any element goes back to the auditee with a specific reason and a new date.</p>

<h2>Verification and effectiveness are different</h2>
<p><b>Verification of implementation</b> confirms the actions were done: the revised procedure is
issued, the training is recorded, the fixture is installed. <b>Effectiveness</b> asks whether the
problem stopped. That needs time and evidence, such as a later sample of records, trend data or a
follow-up audit. ISO 9001:2015 clause 10.2.1 d) requires the organization to review the effectiveness
of corrective action taken. Closing a CAR on implementation alone is a common weakness and an easy
exam trap.</p>

<h2>Escalation and closure</h2>
<p>Overdue responses and actions, and actions found ineffective, are escalated by a rule set in the
audit program, usually to the area manager and then to top management. An ineffective action is
reopened with a fresh root cause analysis, not closed. The age and status of open CARs belong in
management review.</p>

<h2>On the CQA exam</h2>
<p>Expect questions on who is responsible for corrective action (the auditee), what the auditor does
with an inadequate response, how verification differs from effectiveness, and what to do when a
corrective action did not work.</p>
"""),

dict(slug="audit-sampling-plan", name="Audit sampling plan", covers="CQA II.A.5, V.E.2, V.E.3",
title="Audit Sampling Plan: Sample Size, Confidence and Random Selection | SC Quality Guild",
desc="Free audit sampling calculator. Set confidence and tolerable error rate, size a zero-failure sample, stratify, draw the items and see what a clean result shows.",
h1="Audit sampling plan",
lede="Size an attribute sample of records or transactions for a stated confidence and tolerable error rate, share it across strata, draw the items, and state what the result supports.",
content="""
<h2>Judgmental and statistical sampling</h2>
<p>Auditors rarely check every record, so the conclusion rests on a sample. A <b>judgmental</b>
sample is chosen by the auditor's experience: the rush orders, the new supplier, the night shift. It
is good at finding problems but supports no statement about the whole population. A
<b>statistical</b> sample gives every item a known chance of selection, so the result can be
generalized with a stated confidence. Many audits combine the two and report them separately.</p>

<h2>The zero-failure sample size</h2>
<p>For attribute testing (each item is right or wrong), pick a <b>confidence</b> C and a
<b>tolerable error rate</b> p. If the true error rate were p, the chance that n items all pass is
(1 &minus; p)<sup>n</sup>. Setting that equal to 1 &minus; C gives</p>
<p><b>n = ln(1 &minus; C) / ln(1 &minus; p)</b>, rounded up.</p>
<p>At 95 percent confidence and a 5 percent tolerable rate, n = ln(0.05) / ln(0.95) = 58.4, so 59 items.
At 95 percent and 10 percent, n = 29. The formula assumes a large population; for a small one the
exact (hypergeometric) figure is a little lower, which the tool also shows.</p>

<h2>What a clean sample tells you</h2>
<p>If n items show no errors, the error rate is no more than 1 &minus; (1 &minus; C)<sup>1/n</sup> at
confidence C. Fifty-nine clean items give an upper bound of about 4.95 percent at 95 percent
confidence. It does not show the error rate is zero. A quick check is the rule of three: at 95
percent, the bound is roughly 3/n. If errors are found, the plan has failed; each error is evidence
to evaluate, and the sample should not be extended until the rate looks acceptable.</p>

<h2>Selecting the items</h2>
<ul>
  <li><b>Simple random:</b> random numbers against a numbered list. Record the seed.</li>
  <li><b>Systematic:</b> every k-th item (k = N / n) from a random start. Watch for cycles in the
  list that match the interval.</li>
  <li><b>Stratified:</b> split the population into groups that may differ (sites, shifts, months) and
  sample each, usually in proportion to its size.</li>
</ul>

<h2>On the CQA exam</h2>
<p>Expect to tell judgmental from statistical sampling, pick the method that fits a scenario, and
explain what a sample result does and does not let the auditor conclude.</p>
"""),

dict(slug="process-audit-turtle-diagram", name="Process audit turtle diagram", covers="CQA II.A.1, II.A.6, IV.B.2",
title="Turtle Diagram Template for Process Audits With Audit Questions | SC Quality Guild",
desc="Free turtle diagram template for process audits. Map inputs, outputs, resources, people, methods and measures, then get audit questions for each arm.",
h1="Process audit turtle diagram",
lede="Map a process as a turtle (inputs, outputs, resources, people, methods and measures), draw the diagram, and turn every item into an audit question with the ISO 9001 clause to check.",
content="""
<h2>Why auditors use a turtle</h2>
<p>A turtle diagram is a one-page picture of a process for the <b>process approach</b> to auditing.
The process sits in the body. Inputs enter on one side and outputs leave on the other, and four legs
show what makes the process work: <b>with what</b> (equipment, materials, facilities, software),
<b>with whom</b> (roles and the competence they need), <b>how</b> (procedures, methods, work
instructions) and <b>how measured</b> (the performance indicators and their targets). It became
common in automotive auditing and works in any sector.</p>

<h2>Linking it to ISO 9001</h2>
<p>ISO 9001:2015 clause 4.4.1 asks the organization to determine, for each process in its system,
the inputs and expected outputs, the sequence and interaction with other processes, the criteria,
methods and measures, the resources, the responsibilities, the risks and opportunities, and how the
process is evaluated and improved. The turtle covers most of that list. It leaves out risk, so bring
the process risk register into the audit as well.</p>

<h2>From turtle to checklist</h2>
<p>Each item on the turtle becomes a question: is the input checked before use, is the equipment
fit for use, are the people competent, is the method current and followed, does the measure have a
target and what happened when it was missed? The questions here are starting points. Reword them as
open prompts for the people you interview and add the sample you will check. Spend time at the
<b>interfaces</b>: many findings sit at hand-offs between processes, where each side assumes the
other is checking.</p>

<h2>Reading the result</h2>
<p>An empty arm usually means the process owner was not asked, not that the process lacks it. A
measure without a target cannot show whether the process achieves its planned results. People listed
by name rather than by role make weak criteria, because names change and roles do not.</p>

<h2>On the CQA exam</h2>
<p>Expect questions that contrast process audits with element and department audits, ask which arm
an item belongs to, and test how a process audit follows inputs, outputs and interactions rather
than clause numbers.</p>
"""),

dict(slug="auditor-competence-evaluation", name="Auditor competence evaluation", covers="CQA II.A.2, III.A, IV.A.3",
title="Auditor Competence Evaluation Template Based on ISO 19011 | SC Quality Guild",
desc="Free auditor competence evaluation template. Rate behavior, knowledge and experience against the role, record methods and evidence, and plan development.",
h1="Auditor competence evaluation",
lede="Build a competence profile for an auditor role, rate the auditor against it with recorded methods and evidence, and plan development actions for each gap.",
content="""
<h2>What auditor competence covers</h2>
<p>ISO 19011:2018 clause 7 deals with the competence and evaluation of auditors. In summary, an
auditor needs:</p>
<ul>
  <li><b>Personal behavior:</b> qualities such as being ethical, open-minded, diplomatic, observant,
  decisive and self-reliant, which let the auditor act professionally.</li>
  <li><b>Generic knowledge and skills:</b> audit principles, processes and methods, management system
  standards, the organization and its context, and applicable legal requirements.</li>
  <li><b>Discipline and sector knowledge:</b> enough understanding of the activity being audited to
  judge whether it meets the criteria.</li>
  <li><b>Team leader competence:</b> for those leading audits, planning, directing a team, managing
  conflict and representing the team.</li>
</ul>
<p>These are achieved through a combination of <b>education</b>, <b>work experience</b>,
<b>auditor training</b> and <b>audit experience</b>. The program sets the required level for each,
based on the processes, risks and standards it has to audit.</p>

<h2>Evaluation methods</h2>
<p>ISO 19011 describes several methods and expects them to be combined: review of records, positive
and negative feedback, interview, observation, testing and post-audit review. Records show that
training happened; observation and post-audit review show whether the skill is used. Behaviors are
best judged by watching the auditor at work and by feedback from auditees and team leaders.</p>

<h2>Development and maintenance</h2>
<p>Each gap gets a development action: a course, coaching, auditing under supervision or co-leading
with an experienced team leader. Competence also has to be kept up through continued audit activity
and periodic re-evaluation. The 0 to 4 rating scale in this tool is a convention; use your program's
own scale if it has one.</p>

<h2>On the CQA exam</h2>
<p>Expect questions on the personal attributes of an effective auditor, which evaluation method fits
a situation, how competence is built and maintained, and why the program, not the auditor, sets the
required competence.</p>
"""),

dict(slug="audit-program-metrics", name="Audit program metrics", covers="CQA IV.A.4, IV.A.9",
title="Audit Program Metrics: On-Time Audits, CAR Closure and Repeats | SC Quality Guild",
desc="Free audit program metrics dashboard. Track audits done on time, findings per audit, CAR closure time, overdue CARs, repeat findings and auditor use by quarter.",
h1="Audit program metrics",
lede="Enter quarterly audit program results and see on-time completion, findings per audit, CAR closure time, overdue CARs, repeat findings and auditor utilization trended against targets.",
content="""
<h2>Why measure the audit program</h2>
<p>An audit program is a process, so it needs measures like any other. ISO 19011:2018 asks the
program manager to monitor whether the program is achieving its objectives (clause 5.7) and to
review and improve it (clause 5.8). The measures here answer three questions: are the audits being
done as planned, are they finding what matters, and are the findings being fixed for good?</p>

<h2>The measures</h2>
<ul>
  <li><b>On-time completion:</b> audits done in the scheduled month divided by audits planned. A
  skipped audit counts as late, so the rate cannot look good by dropping audits.</li>
  <li><b>Nonconformities per audit:</b> majors plus minors divided by audits done. Watch the mix of
  majors, minors and opportunities for improvement too.</li>
  <li><b>Days to close a CAR</b> and <b>overdue CARs</b>: how fast and how reliably the auditees act.</li>
  <li><b>Repeat findings:</b> findings that repeat one already closed, as a share of all
  nonconformities. This is the most direct sign that corrective actions are not effective.</li>
  <li><b>Auditor utilization:</b> audit days used against days available. Above 100 percent usually
  shows up later as late audits or thin sampling.</li>
</ul>

<h2>Reading the trend</h2>
<p>Read the measures together. Falling findings per audit can mean a maturing system or shallower
audits; low repeat rates and clean external audits support the first, while shrinking audit time and
samples point to the second. A fast CAR closure time with rising repeats suggests CARs are being
closed before effectiveness is shown. Feedback from auditees and audit clients, and the value
management sees in the results, are worth adding as qualitative measures.</p>

<h2>On the CQA exam</h2>
<p>Expect questions on how to evaluate an audit program's effectiveness, which measure shows that
corrective actions are working, and how program results feed management review.</p>
"""),
]
