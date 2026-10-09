"""Content for the /tools/ pages, batch 4E: CQA (Certified Quality Auditor) audit tools."""

PAGES4E = [
dict(slug="audit-program-risk-schedule", name="Risk-based audit program", covers="CQA IV.A.2, IV.A.5, IV.A.8",
title="Risk-Based Internal Audit Program and Annual Audit Schedule | SC Quality Guild",
desc="Free risk-based audit program template. Score each process on importance, past results and change, set audit frequency, and check auditor independence and load.",
h1="Risk-based audit program and schedule",
lede="Score each process on importance, past results and change, turn the score into an audit frequency, and lay out the year with auditor independence and workload checked.",
content="""
<h2>Program versus audit</h2>
<p>An <b>audit program</b> is the set of audits planned for a period, usually a year, with the
resources, schedule and methods needed to carry them out. An <b>audit plan</b> describes one audit:
its objectives, scope, criteria, team and timetable. The program decides which areas get audited, how
often and by whom; each plan then works out one of those audits in detail. ISO 19011:2018 treats
managing the program (clause 5) and performing an audit (clause 6) as separate jobs, and the CQA exam
expects you to keep them apart.</p>

<h2>Why frequency should follow risk</h2>
<p>ISO 9001:2015 clause 9.2.2 a) requires the program to take into account the importance of the
processes concerned, changes affecting the organization and the results of previous audits. This tool scores each area
1 to 3 on each factor and multiplies them, so an area that is important, performing poorly and changing
rises quickly (3 &times; 3 &times; 3 = 27) while a stable, low-impact area stays low (1). The bands
that turn a score into a 6, 12 or 24 month interval are yours to set; they are a planning convention,
not a requirement of any standard.</p>
<ul>
  <li><b>Importance:</b> consequence for customers, patients, safety, regulatory compliance or revenue.</li>
  <li><b>Past results:</b> audit findings, complaints, nonconformance trends and process measures.</li>
  <li><b>Change:</b> new equipment, people, methods, suppliers, sites or requirements.</li>
</ul>

<h2>Independence and resources</h2>
<p>Auditors must be selected so the audit is objective and impartial (ISO 9001 9.2.2 c). ISO 19011
adds that auditors should, where practicable, be independent of the activity audited; in a small
organization where full independence is not possible, the program should show how bias is avoided. The
tool flags any auditor assigned to an area in their own department. It also adds up the days each
auditor is scheduled for and compares them with the days their manager has agreed to release. Slipping high-risk audits are a finding against the program itself.</p>

<h2>Reading the result</h2>
<p>Look at the red dots first: these areas are audited twice in the year. Then check the warnings for
overdue and never-audited areas, own-department assignments and over-capacity auditors. Revisit the
scores after each audit, complaint trend or significant change.</p>

<h2>On the CQA exam</h2>
<p>Expect questions that ask what should drive audit frequency (risk, importance, change and previous
results, not convenience), how to staff a program fairly, who owns the program (management, through an
audit program manager), and how to tell a program from a plan.</p>
"""),
dict(slug="audit-plan-schedule", name="Audit plan and schedule", covers="CQA II.A.1, II.A.2, II.A.4, II.A.7, II.B.3, II.B.7",
title="Audit Plan Template With Timetable, Team Roles and Scope Check | SC Quality Guild",
desc="Free audit plan template. Set objectives, scope and criteria, assign team roles, build the timetable, and check scope coverage, double-booking and independence.",
h1="Audit plan and schedule",
lede="Write the objectives, scope and criteria for one audit, assign the team, build the timetable, and check it for scope gaps, double-booked auditors and auditors in their own area.",
content="""
<h2>What an audit plan contains</h2>
<p>The audit plan turns one entry in the audit program into a working schedule. ISO 19011:2018 clause
6.3.2 describes its contents; in summary, the plan covers:</p>
<ul>
  <li><b>Objectives:</b> why the audit is being done, for example to determine conformity with the
  criteria or to check whether earlier corrective actions worked.</li>
  <li><b>Scope:</b> the extent and boundaries: sites, processes, functions, shifts and the period of
  records covered, plus anything excluded.</li>
  <li><b>Criteria:</b> the requirements the evidence is compared with, such as ISO 9001 clauses,
  internal procedures, contracts and regulations.</li>
  <li>Dates, places, methods, team roles, guides and the time allocated to each area.</li>
</ul>
<p>Objectives, scope and criteria are a favorite exam trio. If a question describes "the requirements
used as a reference", it means criteria; "the extent and boundaries", scope.</p>

<h2>Choosing the team</h2>
<p>The lead auditor is accountable for the audit and for the team. Auditors are selected for competence
in the processes and criteria and for independence from the work audited. A <b>technical expert</b>
gives specific knowledge but works under the direction of an auditor; an <b>auditor in training</b>
audits under supervision; <b>guides</b> (from the auditee) and <b>observers</b> accompany the team but
do not take part in the audit. The tool flags sessions where none of the people present is a lead
auditor or auditor, and auditors placed in their home department.</p>

<h2>Opening and closing meetings</h2>
<p>The <b>opening meeting</b> confirms the plan with the auditee, introduces the team, confirms
communication channels, safety and confidentiality arrangements, and sets the time of the closing
meeting. The <b>closing meeting</b> presents the findings and conclusions so they are understood,
and agrees the timeframe for the auditee's response. Team meetings in between let auditors share
evidence and agree how observations will be classified before anything is presented.</p>

<h2>Reading the checks</h2>
<p>Scope areas that never appear in the timetable will not be audited, and areas in the timetable but
outside the scope are scope creep. The plan is a guide, not a contract: the lead auditor can adjust it as evidence emerges, but
changes to scope should be agreed with the audit client.</p>

<h2>On the CQA exam</h2>
<p>Expect scenarios asking which element is missing from a plan, who decides the scope (the audit
client, with the lead auditor), what belongs in an opening meeting, and how to staff an audit fairly.</p>
"""),

dict(slug="audit-checklist-working-papers", name="Audit checklist and working papers", covers="CQA II.A.5, II.A.6, II.B.4, II.B.5, III.E.1",
title="Audit Checklist Template and Working Papers With Evidence Checks | SC Quality Guild",
desc="Free audit checklist and working paper template. Plan criteria, questions, methods and samples, record objective evidence and results, and check coverage.",
h1="Audit checklist and working papers",
lede="Plan each checklist line with its criterion, question, method and sample, then record the evidence and result on site and check coverage, sample size and the wording of questions and evidence.",
content="""
<h2>Checklists and working papers</h2>
<p><b>Working papers</b> are the documents an auditor prepares and fills in during an audit: the
checklist, sampling notes, records of evidence and copies or references of documents examined. The
<b>checklist</b> is the part prepared in advance. It keeps the audit on scope, makes sure each
criterion is covered and gives a place to record evidence. Its weakness is that it can narrow the
auditor's attention; a good auditor uses it as a guide and follows trails that open up on site.</p>

<h2>Audit strategies</h2>
<ul>
  <li><b>Forward trace:</b> follow the process from input to output, for example a purchase order
  through receiving, production and shipment.</li>
  <li><b>Backward trace:</b> start from an output, such as a shipped order or complaint, and work back.</li>
  <li><b>Element or clause:</b> audit one requirement across several areas.</li>
  <li><b>Department:</b> audit everything that happens in one area.</li>
  <li><b>Process approach:</b> audit a process with its inputs, outputs, resources, controls and measures,
  and its links to other processes.</li>
  <li><b>Discovery:</b> an open look for issues without a fixed path, used with care because it is hard
  to bound.</li>
</ul>

<h2>Objective evidence</h2>
<p>Objective evidence is data that supports the existence or truth of something, gathered by
observation, measurement, test, interview or examination of documents and records. It must be
verifiable: another auditor should be able to go back and see the same thing. Record document numbers,
dates, quantities and locations. "The area seems disorganized" is an impression; "4 of 12 pallets in
the hold cage had no hold tag" is evidence. Corroborate what people tell you with records or
observation.</p>

<h2>Questions and sampling</h2>
<p>Open questions ("Show me how...", "Walk me through...") produce evidence; closed questions produce
yes or no. Plan the sample before the audit, draw it from the whole period and population in scope,
and record what was actually checked. If fewer items were checked than planned, the conclusion has to
be limited to what was seen. Audit sampling is usually judgmental; when a statistical sample is used,
the plan should say how it was drawn.</p>

<h2>On the CQA exam</h2>
<p>Expect questions on the purpose and drawbacks of checklists, which tracing strategy fits a
scenario, what counts as objective evidence, and how to word an interview question.</p>
"""),

dict(slug="audit-nonconformity-report", name="Nonconformity and audit report writer", covers="CQA II.B.6, II.C.1, II.C.2",
title="Audit Nonconformity Report Template: Major, Minor and OFI Grading | SC Quality Guild",
desc="Free audit finding writer. State each nonconformity as requirement, evidence and statement, grade it major, minor or OFI, and get response due dates and checks.",
h1="Nonconformity and audit report writer",
lede="Write each finding as requirement, evidence and statement, grade it major, minor or opportunity for improvement with a guided check, and assemble the report summary with response due dates.",
content="""
<h2>The three parts of a nonconformity</h2>
<p>A nonconformity is the non-fulfillment of a requirement. A finding that will hold up states three
things:</p>
<ul>
  <li><b>Requirement:</b> what should happen, and where the requirement comes from (standard clause,
  procedure section, contract or regulation). Paraphrase it; do not paste the whole clause.</li>
  <li><b>Objective evidence:</b> what the auditor saw, with references and quantities: which records,
  how many of how many, dates and locations.</li>
  <li><b>Statement:</b> a short sentence saying how the evidence fails the requirement.</li>
</ul>
<p>If no requirement can be named, the observation is not a nonconformity, however sensible the
auditor's view. It can be reported as an opportunity for improvement.</p>

<h2>Grading findings</h2>
<p>ISO 19011 leaves grading to the audit program; certification schemes and customers set their own
definitions. The common pattern is: a <b>major</b> nonconformity is the absence or total breakdown of
a required element, or a failure likely to let nonconforming product or service reach the customer; a
<b>minor</b> nonconformity is an isolated lapse that does not cast doubt on the system as a whole; an
<b>opportunity for improvement</b> is not a breach of a requirement. Several minors against the same
requirement can show a breakdown and be raised as a major. The tool's grading questions apply the
common pattern and flag where the grade chosen differs, so the auditor can either change it or record
why.</p>

<h2>Writing the report</h2>
<p>The audit report goes to the audit client. It identifies the audit, objectives, scope, criteria,
team and dates, presents the findings and gives a <b>conclusion</b> against the audit objectives. Good
reports are factual, concise and free of blame: they describe the system, not people. They also note
anything that limits the conclusion, such as areas not reached. Positive practices are worth reporting
because they show what to spread elsewhere.</p>

<h2>After the report</h2>
<p>The auditee owns correction and corrective action; the auditor reviews the response and verifies
that actions were implemented and effective. The response windows in this tool are inputs: use the
periods set in your audit program or contract. Use the
<a href="/tools/corrective-action-capa.html">corrective and preventive action tool</a> for the
auditee's root cause and action plan.</p>

<h2>On the CQA exam</h2>
<p>Expect to pick the best-written nonconformity statement, classify a finding as major, minor or
OFI, and spot report wording that is opinion, blame or unsupported by evidence.</p>
"""),
]
