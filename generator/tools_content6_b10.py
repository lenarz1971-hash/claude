# Teams, customers and management tools, batch b10 (Oct 2026): meetings,
# customer surveys and NPS, gemba and daily huddles, design review and DFX,
# KPI dashboards, and audit opening and closing meetings. For CQPA, CQE,
# CSSBB, CSQP and CMDA.
PAGES6B10 = [
dict(slug="meeting-agenda-action-log", name="Meeting agenda and action log",
covers="CQPA I.D.5, CSSBB III.C.2, CQE I.E.1, CSQP V.B.2",
title="Meeting Agenda and Action Log Template — Free Online | SC Quality Guild",
desc="Free meeting agenda and action log. Time each item, name the facilitator, timekeeper and scribe, record decisions, and give every action one owner and one due date.",
h1="Meeting agenda and action log",
lede="Plan the meeting against the clock, run it with clear roles, and leave with decisions recorded and every action owned by one person with one date. The tool flags an agenda that does not fit, items with no outcome, and actions nobody owns.",
content="""
<h2>Why meetings need a structure</h2>
<p>Teams do much of their work in meetings, and most of the waste in team work happens there too: meetings that start late, wander, run over and end with nobody sure what was agreed. The fix is not complicated. Every effective meeting has a purpose, an agenda with times, people in defined roles, and a written record of decisions and actions.</p>

<h2>The agenda</h2>
<ul>
<li><b>Purpose and outcomes.</b> Say why the meeting is needed and what should exist at the end of it: a decision, a plan, a list of risks. If nobody can say, cancel it.</li>
<li><b>Items with a purpose.</b> Mark each item as inform, discuss or decide. People prepare differently for each, and a "decide" item that ends without a decision is easy to spot.</li>
<li><b>Time boxes.</b> Give each item planned minutes. The tool adds them up against the time scheduled and works out the clock time of each item. Cut the agenda before the meeting, not during it.</li>
<li><b>Pre-work.</b> Send papers and data ahead. A meeting is a poor place to read a report for the first time.</li>
</ul>

<h2>The roles</h2>
<ul>
<li><b>Facilitator:</b> runs the process, keeps the discussion on the item, draws out quiet members and manages conflict. The facilitator is neutral on the content.</li>
<li><b>Timekeeper:</b> watches the time boxes and warns before an item runs out, so the group chooses to extend it rather than drift.</li>
<li><b>Scribe:</b> records decisions and actions as they are made, and reads the actions back at the end.</li>
</ul>
<p>The team leader and the facilitator are often different people. A leader who also facilitates tends to steer the content.</p>

<h2>Decisions and actions</h2>
<p>Write a decision as the decision itself, with how it was made (consensus, vote, multivoting, leader decides after input). Recording the method stops a settled question being reopened without reason.</p>
<p>An action needs a verb, a result, <b>one</b> owner and <b>one</b> due date. "Team" is not an owner, and "Ana and Raj" means each will assume the other has it. Others can help; one person is accountable. The tool flags actions with no owner, more than one owner, no date, or a date already past. Review the open actions first at the next meeting.</p>

<h2>The parking lot</h2>
<p>Useful points that are not on the agenda go in the parking lot, so they are kept without hijacking the meeting. Before closing, decide what happens to each: an action, a future agenda item, or dropped.</p>

<h2>On the exam</h2>
<p>CQPA I.D.5 asks you to apply the elements of effective meetings: agendas, minutes, action items and due dates. CSSBB III.C.2 covers meeting management: agendas, starting on time, pre-work, and having the right people and resources. The facilitator's role is in CQE I.E.1 and CSSBB III.A.2, and team roles appear in CSQP V.B.2. Expect questions on who does what in a meeting, and on what to do when a meeting keeps running over or ends without decisions.</p>
"""),

dict(slug="customer-survey-designer-analyzer", name="Customer survey designer and analyzer",
covers="CQPA IV.B, CQE I.G, CQE VI.A.2, CSSBB IV.A.2, CSSBB II.C.1",
title="Customer Survey Analyzer — Likert Top-Box and Net Promoter Score | SC Quality Guild",
desc="Free customer survey tool. Check question wording, then analyze Likert answers (mean, median, top-box with margin of error) and net promoter score by segment.",
h1="Customer survey designer and analyzer",
lede="Check each question for the usual wording faults, then enter the answer counts. Get the mean, median and top-box score with its margin of error, a diverging bar chart, and the net promoter score with its confidence interval by segment.",
content="""
<h2>Designing the questions</h2>
<p>A survey measures what its questions ask, not what the writer meant. Most bad survey data comes from a handful of wording faults, which the tool looks for:</p>
<ul>
<li><b>Double-barreled:</b> two things in one question ("speed and cost"). A customer happy with one and not the other cannot answer.</li>
<li><b>Leading:</b> the question suggests the answer ("our friendly technicians&hellip;", "don't you agree&hellip;").</li>
<li><b>Loaded or assumptive:</b> emotionally charged words, or an assumption ("Do you still have problems&hellip;").</li>
<li><b>Absolutes:</b> always, never, every. Few people can agree with an absolute.</li>
<li><b>Negatives and jargon:</b> disagreeing with a negative statement is a double negative; an acronym the customer does not know gets a guess.</li>
<li><b>Unbalanced scale:</b> more positive than negative choices pushes answers upward.</li>
</ul>
<p>The checks match words, so they raise false alarms and miss subtler faults. Pilot every survey with a few real respondents.</p>

<h2>Summarizing rating answers</h2>
<p>Likert and rating scales are <b>ordinal</b>: the points are in order, but the gap between "agree" and "strongly agree" is not known to equal the gap between "neither" and "agree". So the tool reports three kinds of summary:</p>
<ul>
<li><b>Top-box and bottom-box:</b> the percentage choosing the top (or bottom) one, two or three points. This is the most robust summary and the easiest to explain. Its margin of error is z&radic;(p(1&minus;p)/n).</li>
<li><b>Median:</b> the middle answer, valid for ordinal data.</li>
<li><b>Mean and standard deviation:</b> widely reported, but they treat the scale as equally spaced. A large standard deviation means opinions are split and the mean describes almost nobody.</li>
</ul>
<p>The diverging bar chart centers each question on the neutral point, with lower ratings to the left and higher to the right, so the size of the unhappy group is visible at a glance.</p>

<h2>Net promoter score</h2>
<p>NPS asks how likely the customer is to recommend you, on 0 to 10. <b>Promoters</b> answer 9 or 10, <b>passives</b> 7 or 8, <b>detractors</b> 0 to 6. NPS = % promoters &minus; % detractors, from &minus;100 to +100. Scoring each respondent +1, 0 or &minus;1, the standard error is &radic;((p<sub>P</sub> + p<sub>D</sub> &minus; NPS&sup2;)/n), and the margin of error is z times that, in points. Because NPS is a difference of two percentages, its margin of error is wider than either one: with 200 answers it is often &plusmn;10 points or more. The tool tests whether the gap between the best and worst segment is larger than chance would explain.</p>

<h2>Sample size and response rate</h2>
<p>For a percentage near 50%, the sample needed for a margin of error E is n = z&sup2;(0.25)/E&sup2;, about 385 for &plusmn;5 points at 95% confidence, reduced by the finite-population correction n/(1 + (n&minus;1)/N) for a small population. A low response rate raises the risk of <b>non-response bias</b>: those who answer are often the most pleased and the most annoyed.</p>

<h2>On the exam</h2>
<p>CQPA IV.B covers the tools for gathering customer feedback, including surveys. CQE I.G asks you to define, apply and analyze the results of customer satisfaction surveys, and CQE VI.A.2 covers measurement scales (nominal, ordinal, interval, ratio). CSSBB IV.A.2 asks you to select data collection methods such as surveys and to review them for validity and reliability, and CSSBB II.C.1 lists customer loyalty metrics. Expect to spot a double-barreled or leading question, choose a summary for ordinal data, and interpret a net promoter score.</p>
"""),

dict(slug="gemba-walk-daily-huddle-board", name="Gemba walk and daily huddle board",
covers="CSSBB V.A.2, CQE V.D.4, CMDA V.B.3",
title="Daily Huddle Board and Gemba Walk Log — Free SQDC Board | SC Quality Guild",
desc="Free tiered huddle board. Track safety, quality, delivery and cost red or green by day, log gemba observations with one owner and date, and age the open actions.",
h1="Gemba walk and daily huddle board",
lede="A daily management board for a team: safety, quality, delivery, cost and people, red or green each day, and a log of what was seen on the floor with the action, owner and date for each. Open actions are aged, and anything past the limit is flagged to escalate.",
content="""
<h2>Daily management</h2>
<p>Daily management is the routine that keeps a process on standard and surfaces problems while they are small. It has three parts: a visual board that shows how yesterday went, a short stand-up <b>huddle</b> at the board, and leaders who go to where the work is done, the <b>gemba</b>, to see for themselves.</p>

<h2>The huddle board</h2>
<p>Most boards are organized by <b>SQDC</b>: safety, quality, delivery and cost, often with people added. Each measure has a target, and each day is marked green (met) or red (missed). There is deliberately no amber: a huddle board asks one question, did we meet the standard, and a red needs a response.</p>
<ul>
<li>Keep it to what the team can affect today. Measures the team cannot move belong on a dashboard higher up.</li>
<li>Every red gets a countermeasure, an owner and a date, or a note that the cause is understood.</li>
<li>Three reds running is a pattern, not a bad day. Start structured problem solving.</li>
<li>A blank square hides a red as easily as a green. Post every day.</li>
</ul>

<h2>Tiered huddles</h2>
<p>Huddles are tiered. <b>Tier 1</b> is the team at the start of the shift. <b>Tier 2</b> is the area or department leaders, a little later, taking what tier 1 could not solve. <b>Tier 3</b> is the site leadership. Escalation is how a problem reaches someone with the authority or resources to fix it, usually within a day. The tool flags open actions older than your escalation limit.</p>

<h2>The gemba walk</h2>
<p>A gemba walk is not an inspection tour. The leader goes to see the process, asks questions, and listens. Good observations are facts someone else could check: what, where, when, how many. "Second shift seems careless" is an opinion about people; "four of eleven tools were missing from the shadow board at 15:30" is an observation about a process. For each, write the gap to the standard, then one action with one owner and a date. Not every observation needs an action, but each needs a decision.</p>

<h2>Reading the action aging chart</h2>
<p>Each bar is an open action, by days since it was seen. Long bars mean the system is not closing problems. The median days to close for finished actions is a simple measure of how responsive the daily management system is; watch it fall as the routine matures.</p>

<h2>On the exam</h2>
<p>CSSBB V.A.2 lists the gemba walk among the process analysis tools, alongside value stream maps and spaghetti diagrams. CQE V.D.4 covers visual control. The CMDA names daily management, including gemba walks, dashboards and daily huddles, among the lean tools in V.B.3. Expect to recognize what a gemba walk is for, why escalation tiers exist, and what makes a visual board work.</p>
"""),

dict(slug="design-review-dfx-checklist", name="Design review and DFX checklist",
covers="CQE III.B.2, CQE III.B.3, CSSBB IX.B, CSQP III.A.1, CMDA III.D.2",
title="Design Review Checklist and Design for X (DFX) — Free Online | SC Quality Guild",
desc="Free design review checklist with design for X questions: manufacturability, assembly, test, service, reliability, cost and environment. Record findings and the gate decision.",
h1="Design review and DFX checklist",
lede="Run a stage-gate design review with the right functions in the room and an independent reviewer. Answer the design for X questions area by area, raise a finding for each gap, and record the decision. The tool scores readiness by area and flags missing functions, unraised gaps and open must-close findings.",
content="""
<h2>What a design review is</h2>
<p>A design review is a planned, documented examination of a design at a set stage, to judge whether it meets its requirements and is ready to move on. It is not a presentation. The people who will have to make, test, buy, service and support the product ask the questions only they will think of, while changes are still cheap.</p>

<h2>Stages</h2>
<ul>
<li><b>Concept review:</b> does the concept answer the customer need and the requirements?</li>
<li><b>Preliminary design review (PDR):</b> is the chosen approach sound, with risks known and a plan to verify it?</li>
<li><b>Critical design review (CDR):</b> is the detailed design complete and ready to build prototypes or pilot units?</li>
<li><b>Final or pre-production review</b> and <b>design transfer</b>: are verification and validation complete, and can production make it consistently?</li>
</ul>

<h2>Roles</h2>
<p>The <b>chair</b> keeps the review to its purpose and records the decision. The <b>presenter</b>, usually the design owner, shows the evidence. <b>Reviewers</b> come from each function the stage affects. At least one reviewer should be <b>independent</b>: no direct responsibility for the stage under review. Medical device design control has long required this, and it is good practice everywhere; designers cannot see their own blind spots. A <b>scribe</b> keeps the record, which becomes part of the design history.</p>

<h2>Design for X</h2>
<p>Design for X (DFX) is a family of guidelines, each named for the property it protects:</p>
<ul>
<li><b>Manufacturability (DFM):</b> tolerances the process can hold, familiar materials, features that suit the process.</li>
<li><b>Assembly (DFA):</b> fewer parts, parts that cannot go in wrong, top-down assembly, few fastener types.</li>
<li><b>Test (DFT):</b> access to test points, tests that catch the high-risk failure modes, capable gauges.</li>
<li><b>Service and maintainability:</b> wear parts that can be reached, diagnosable faults.</li>
<li><b>Reliability:</b> targets allocated, derating, life testing.</li>
<li><b>Cost:</b> a target cost, standard parts, value engineering.</li>
<li><b>Environment:</b> restricted substances, recyclability, end of life.</li>
</ul>
<p>Every "No" answer should become a finding with an action, or an explanation of why the gap is acceptable. The readiness bar for each area shows where the design is weakest.</p>

<h2>The decision</h2>
<p>A review ends with a decision: proceed, proceed with conditions, or repeat the review. Proceeding with open must-close findings is a decision to accept risk, and should be written as one.</p>

<h2>On the exam</h2>
<p>CQE III.B.3 asks you to identify and apply the elements of the design review process, including the roles and responsibilities of participants, and III.B.2 to apply DFX and DFSS. CSSBB IX.B covers design for X: cost, manufacturability, test and maintainability. CSQP III.A.1 covers internal design reviews, and CMDA III.D.2 design and development controls, including design review, under ISO 13485 and the QMSR. Expect questions on who should attend, what independence means, and which DFX area a given guideline belongs to.</p>
"""),

dict(slug="kpi-dashboard-builder", name="KPI dashboard builder",
covers="CQE VI.A.5, CQE I.B.2, CSSBB II.C.1, CSSBB VIII.D.4, CSQP IV.A.2",
title="KPI Dashboard Builder — Leading and Lagging Indicators, OKRs | SC Quality Guild",
desc="Free KPI dashboard builder. Enter measures with targets and history; get red, amber and green status, sparklines, trends, and a line-of-sight check from each KPI to its objective.",
h1="KPI dashboard builder",
lede="List the objectives, then the measures that track them, with a target, a red limit and the recent values. Get a tile for each KPI with its status and sparkline, a trend call, and a line-of-sight map that shows objectives with no measure, measures with no objective, and objectives tracked only by lagging indicators.",
content="""
<h2>What a dashboard is for</h2>
<p>A dashboard shows, on one screen, whether the things that matter are on track, so the people who own them can act. It is not a data dump. A good dashboard has a few measures, each with an owner, a target, a clear status, and enough history to tell a trend from a blip.</p>

<h2>KPIs, leading and lagging</h2>
<p>A <b>key performance indicator</b> is a measure chosen because it tracks a goal. <b>Lagging</b> indicators report the result after the fact: on-time delivery, complaints, cost of poor quality. They are what the customer and the business feel, but by the time they move it is too late to change that period. <b>Leading</b> indicators move first and can still be influenced: schedule attainment, first-pass yield, training completed. A sound set pairs each lagging result with one or more leading measures that predict it. The tool flags objectives tracked only by lagging measures.</p>

<h2>Line of sight and OKRs</h2>
<p><b>Line of sight</b> means anyone can trace a measure up to the objective it serves, and the objective up to the strategy. <b>OKRs</b> (objectives and key results) state an objective in words and one to three measurable key results with dates. A measure linked to no objective may not be worth collecting; an objective with no measure is a wish.</p>

<h2>Red, amber, green</h2>
<p>Each KPI here has a target and a red limit. For a "higher is better" measure:</p>
<ul>
<li><b>Green:</b> actual &ge; target.</li>
<li><b>Amber:</b> between the red limit and the target.</li>
<li><b>Red:</b> actual &lt; red limit.</li>
</ul>
<p>For "lower is better" the comparisons reverse. A value exactly on the red limit is amber. With no red limit, the tool sets one at the target minus (or plus) the default amber band percentage.</p>

<h2>Trend</h2>
<p>The trend is the least-squares slope through the values. It is called improving or worsening only when the fitted line moves by more than half the amber band across the periods shown; otherwise flat. The most useful flags are the uncomfortable ones: <b>green but worsening</b>, while there is still time, and <b>red for three periods running</b>, which needs a project, not more watching. A trend arrow is a prompt, not a statistical test; to separate a real shift from noise, use a control chart.</p>

<h2>Dashboard or balanced scorecard?</h2>
<p>A <a href="/tools/balanced-scorecard.html">balanced scorecard</a> organizes strategic objectives across four perspectives and maps cause and effect between them. This dashboard is the operating view: the history and trend of each measure, its owner, and its line of sight to an objective. Many organizations use both.</p>

<h2>On the exam</h2>
<p>CQE VI.A.5 asks you to apply and interpret dashboards and select the right metrics for them, and CQE I.B.2 covers performance measurement in deploying the quality system. CSSBB II.C.1 covers KPIs, OKRs, leading and lagging indicators and line of sight to strategy, and CSSBB VIII.D.4 monitoring leading and lagging indicators after a project. CSQP IV.A.2 covers supplier scorecards and dashboards. Expect to classify a measure as leading or lagging and to judge whether a dashboard supports its objectives.</p>
"""),

dict(slug="audit-opening-closing-meeting", name="Audit opening and closing meeting record",
covers="CMDA II.B.1, CMDA II.B.7, CQPA I.C.2, CQE II.D.3, CQE II.D.4, CSQP V.A.1",
title="Audit Opening and Closing Meeting Agenda and Record | SC Quality Guild",
desc="Free audit opening and closing meeting record. Attendance, purpose, scope, criteria, grading and confidentiality; then findings, auditee concurrence, conclusion and next steps.",
h1="Audit opening and closing meeting record",
lede="Record who attended each meeting, what was confirmed at the opening, and what was presented at the closing: the findings with the auditee's concurrence on the evidence, the conclusion, and the next steps with names and dates. The tool checks the record against ISO 19011 and flags what is missing.",
content="""
<h2>Why the two meetings matter</h2>
<p>The opening and closing meetings bracket every audit. The opening sets the terms: what will be audited, against what, how, and how findings will be graded. The closing reports the result. Most audit disputes trace back to one of them: a scope never confirmed, a grading scheme never explained, a finding the auditee first heard about in the report.</p>
<p>This record sits between two other tools. The <a href="/tools/audit-plan-schedule.html">audit plan and schedule</a> books the meetings, and the <a href="/tools/audit-nonconformity-report.html">nonconformity report</a> writes up the findings. This page records what was actually said and agreed.</p>

<h2>The opening meeting</h2>
<p>Chaired by the lead auditor, with auditee management. It confirms the objectives, scope and criteria; introduces the team and the roles of guides and observers; confirms the schedule and the closing meeting time; explains the methods, including that evidence is a sample; explains how findings will be graded; and agrees confidentiality, safety, access, how concerns are raised, and the conditions for ending the audit early. Record the attendees. Keep it short, but cover everything: each point not covered is a gap someone can exploit later.</p>

<h2>The closing meeting</h2>
<ul>
<li>Restate the purpose, scope, criteria and grading scheme.</li>
<li>Say that audit evidence is a sample, so other nonconformities may exist.</li>
<li>Present each finding with its requirement and evidence.</li>
<li>Seek the auditee's <b>concurrence on the evidence</b>. Concurrence is about the facts, not the grade. Where the auditee disagrees, discuss it, and if it cannot be resolved, record both views in the report.</li>
<li>State the conclusion against the audit objectives.</li>
<li>Agree the next steps (the report date, the corrective action response, any follow-up audit) and who is responsible for each.</li>
</ul>
<p>Top management should hear the findings first-hand. Their absence at the closing meeting is itself worth noting.</p>

<h2>Grading</h2>
<p>A common scheme: a <b>major</b> nonconformity is a requirement not met at all, or a failure that could put nonconforming product or service in the customer's hands; a <b>minor</b> is an isolated lapse; an <b>opportunity for improvement</b> breaks no requirement. Whatever scheme the audit program uses, explain it at the opening and restate it at the closing.</p>

<h2>On the exam</h2>
<p>The CMDA is explicit: II.B.1 covers managing the opening meeting, including purpose, scope, rating criteria, a record of attendees and the schedule, and II.B.7 the exit meeting, including concurrence on evidence that could lead to an adverse conclusion and the next steps. CQPA I.C.2 lists opening and closing meetings among the audit components. CQE II.D.3 and II.D.4 cover conducting an audit and reporting and follow-up, and CSQP V.A.1 the stages of a supplier audit. Expect to put the meeting elements in order and to know what concurrence means.</p>
"""),
]
