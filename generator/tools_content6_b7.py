# Problem solving and change control tools, batch b7 (Oct 2026): engineering
# change impact, 8D report, Is / Is Not, A3 report, out-of-control action plan,
# benchmarking gap worksheet. For CQPA, CQE, CSSBB, CSQP and CMDA.
PAGES6B7 = [
dict(slug="engineering-change-impact-checklist", name="Engineering change impact checklist",
covers="CQPA I.B.6, CQE II.B.2, CQE IV.B.1, CSQP IV.C.2, CSQP V.A.3, CMDA III.D.2, III.D.3",
title="Engineering Change Impact Checklist — Configuration Management | SC Quality Guild",
desc="Free engineering change checklist: every document, plan, gauge and stock location a change touches, with owner, verification, effectivity and sign-off.",
h1="Engineering change impact checklist",
lede="For one engineering change: list everything it touches, from the drawing to the stock at the customer, with an owner, an update and a check for each. Set the effectivity, decide what happens to existing stock, and see what is still open.",
content="""
<h2>Why changes go wrong</h2>
<p>Most engineering changes that cause trouble were approved correctly. The drawing was updated and signed. What went wrong was something nobody connected to the change: the control plan still checked the old tolerance, the machine still ran the old program, the gauge could not resolve the new limit, 800 old-revision parts sat in finished goods, or the customer was never told. The change was right; the <b>implementation</b> was incomplete.</p>
<p>This checklist is for that second part. It lists every document, plan, program, record and stock location the change could touch, and asks for a yes or a no on each, an owner, the date it was updated and the date someone else checked it.</p>

<h2>Configuration management</h2>
<p>Configuration management is the discipline of knowing, at any time, exactly what a product is made to: which drawing revision, which specification, which software version, which bill of materials. It has four parts:</p>
<ul>
<li><b>Identification:</b> each configuration item (drawing, specification, program, part) has a unique number and revision.</li>
<li><b>Change control:</b> a change is proposed, its impact assessed, and it is approved before it is made. This tool covers the impact assessment and the follow-through.</li>
<li><b>Status accounting:</b> a record of which revision is current and which units were built to which.</li>
<li><b>Audit:</b> a check that the product as built matches its documents.</li>
</ul>
<p>Document control keeps the right revision at the point of use. Configuration management goes further: it keeps the whole set of documents, programs and parts consistent with each other.</p>

<h2>Effectivity and interchangeability</h2>
<p><b>Effectivity</b> is the point from which the change applies: a date, a serial number or a lot. Date effectivity is simple but blurs when stock is built ahead. Serial or lot effectivity is precise, and is what makes a later recall or field action small. Either way, the new revision must be identifiable on the part or its paperwork.</p>
<p><b>Interchangeability</b> decides what can happen to old stock. If old and new parts are fully interchangeable, old stock can usually be used up. If the change is one-way, new parts can replace old in service but not the reverse. If they are not interchangeable at all, old and new must never be mixed in an assembly or a shipment, and old stock is reworked, scrapped or kept only for older products.</p>

<h2>Reading the checks</h2>
<ul>
<li><b>Not assessed</b> is the dangerous status. "No" with a reason is a decision; a blank is an oversight waiting to happen.</li>
<li><b>Updated, not verified</b> means a new revision exists but nobody has confirmed it is correct and in use on the floor.</li>
<li>Items <b>due after the effective date</b> mean production will start on the new revision before everything is ready.</li>
<li>A <b>major</b> change (form, fit, function, safety or regulation) usually needs the FMEA and control plan reviewed, and often customer approval before it is made.</li>
</ul>
<p>For a change that also needs people to change how they work, pair this with the <a href="/tools/change-management-plan.html">change management plan</a>. For the control plan itself, use the <a href="/tools/control-plan.html">control plan</a> tool.</p>

<h2>On the exam</h2>
<p>CQPA I.B.6 asks you to identify the elements of document control systems, including configuration management. CQE II.B.2 asks you to evaluate configuration management, maintenance and document control, and CQE IV.B.1 covers material identification, status and traceability, which is what effectivity and stock disposition depend on. CSQP IV.C.2 includes updating the FMEA and control plan and product or process design change with a supplier, and CSQP V.A.3 covers change requests and notifications. CMDA III.D.2 covers design changes, and III.D.3 the document and change control system.</p>
"""),
dict(slug="8d-report", name="8D report",
covers="CSQP IV.C.2, CQPA V.A, CQE V.E, CMDA III.D.9",
title="8D Report Template — Eight Disciplines Problem Solving, Free | SC Quality Guild",
desc="Free 8D report: D0 to D8 with team, 5W2H, verified containment, occurrence and escape causes, verify and validate, prevention and a status timeline.",
h1="8D report",
lede="Work a problem through the eight disciplines: team, description, containment, root cause and escape point, permanent actions verified and then validated, prevention and closure. The status chart shows each discipline against the customer's deadlines.",
content="""
<h2>What an 8D is</h2>
<p>The eight disciplines (8D) is a team problem-solving method, first standardized in the automotive industry and now asked for by customers in many others. When a customer sends a complaint and asks for "an 8D", they expect this format: the disciplines in order, each with evidence, usually with deadlines for containment and for the root cause.</p>
<p>An 8D is heavier than a simple correction. Use it when the cause is unknown, when the problem has come back, or when the customer requires it. For a lighter internal record, the <a href="/tools/corrective-action-capa.html">corrective and preventive action</a> tool covers the same core steps in fewer fields.</p>

<h2>The disciplines</h2>
<ul>
<li><b>D0 Prepare:</b> record the symptom and any emergency response, such as stopping shipment.</li>
<li><b>D1 Team:</b> a small cross-functional team with a <b>champion</b> who owns the resources and a <b>leader</b> who runs the work.</li>
<li><b>D2 Describe:</b> quantify the problem with 5W2H (what, why, where, when, who, how, how many) and an is / is not comparison. Describe the effect, not a guessed cause.</li>
<li><b>D3 Contain:</b> protect the customer now, everywhere suspect product can be, and <b>verify</b> the containment works.</li>
<li><b>D4 Root cause:</b> two verified causes: why it <b>occurred</b>, and why it <b>escaped</b>. The <b>escape point</b> is the first check in the process that should have caught it.</li>
<li><b>D5 Choose and verify</b> permanent corrective actions: prove, before full rollout, that each removes its cause without side effects.</li>
<li><b>D6 Implement and validate:</b> put them in and show in production that the problem is gone. Then remove the containment.</li>
<li><b>D7 Prevent recurrence:</b> fix the system that let it happen (FMEA, control plan, standards) and read the fix across to similar products and sites.</li>
<li><b>D8 Recognize the team</b> and close, with the champion's sign-off.</li>
</ul>

<h2>Verify and validate</h2>
<p>The difference between D5 and D6 is the one most often blurred. <b>Verification</b> (D5) is evidence before implementation that the action works: a trial run, a test on returned parts. <b>Validation</b> (D6) is evidence after implementation, in normal production over enough time or volume, that the problem has not come back. An action that is implemented but never validated is a guess that has not been checked.</p>

<h2>Three causes, not one</h2>
<p>Most weak 8Ds stop at the occurrence cause. A complete one names three: why it happened, why the checks missed it, and why the system (the FMEA, the control plan, the design review) allowed both. The first two are fixed in D5 and D6; the third in D7.</p>

<h2>Reading the status chart</h2>
<p>Each discipline is shown as not started, in progress or complete, with the number of days from opening to completion. Red marks are the customer's due dates. The checks flag containment that was never verified, an escape point that is not named, actions implemented before they were verified, containment removed too early, and an 8D closed with disciplines still open.</p>

<h2>On the exam</h2>
<p>CSQP IV.C.2 names 8D among the methods for supplier corrective and preventive action, with updating the FMEA and control plan. CQPA V.A covers the corrective action process: identify, contain, find root causes, propose solutions, verify implementation and confirm effectiveness. CQE V.E covers problem identification, failure analysis, root cause analysis, recurrence control and verification of effectiveness, and CMDA III.D.9 covers CAPA under ISO 13485. Expect to put the disciplines in order, pick the step a given activity belongs to, and tell containment from corrective action.</p>
"""),

dict(slug="is-is-not-problem-specification", name="Is / Is Not problem specification",
covers="CMDA V.A, CQE V.E, CSSBB VI.D.2",
title="Is / Is Not Analysis — Kepner-Tregoe Problem Specification, Free | SC Quality Guild",
desc="Free Is / Is Not (Kepner-Tregoe) worksheet. Specify what, where, when and extent; find distinctions and changes; test each possible cause against both sides.",
h1="Is / Is Not problem specification",
lede="Specify the problem on four dimensions, what it is and what it could be but is not. Find what is distinctive about the IS and what changed there, then test every possible cause: a true cause explains both sides.",
content="""
<h2>What the method does</h2>
<p>Is / Is Not is the problem-analysis part of the Kepner-Tregoe method. Instead of brainstorming causes first, the team writes a precise <b>specification</b> of the problem, then uses it as a test that every proposed cause has to pass. It works best on a deviation that appeared at some point: something that used to be right and now is not.</p>

<h2>Specify the problem</h2>
<p>For each dimension, write what the problem <b>IS</b> and what it <b>IS NOT</b> but reasonably could be:</p>
<ul>
<li><b>What:</b> which object has the defect, and what exactly the defect is.</li>
<li><b>Where:</b> where it is seen (line, site, customer) and where on the object.</li>
<li><b>When:</b> when it was first seen, the pattern since, and when in the life cycle.</li>
<li><b>Extent:</b> how many, how big, and the trend.</li>
</ul>
<p>The IS NOT is the half that gives the method its power. "Line 1" alone suggests nothing. "Line 1, not line 2, which uses the same powder" rules out the powder at once. Pick the closest comparison: the thing most like the IS that does not have the problem.</p>

<h2>Distinctions and changes</h2>
<p>For each pair, ask what is <b>distinctive</b> about the IS: what is true of it and not of the IS NOT. Then ask what has <b>changed</b> in, on or around each distinction, and when. A problem that started on a date almost always follows a change, and the change is usually sitting next to a distinction.</p>

<h2>Test the possible causes</h2>
<p>Write each possible cause as a mechanism: how this change could produce this defect. Then test it against every row: <i>if this is the cause, does it explain why the problem is here and not there?</i> A cause that cannot explain an IS NOT is eliminated, however plausible it sounded. A cause that explains a row only if something else is true is kept, with that assumption written down.</p>
<p>The <b>most probable cause</b> is the one that explains the specification with the fewest and most reasonable assumptions. It is still a hypothesis: confirm it by checking the assumptions and by turning the cause on and off.</p>

<h2>Is / Is Not, fishbone or 5 whys?</h2>
<p>A <a href="/tools/fishbone-5-whys.html">fishbone</a> generates many possible causes from experience; Is / Is Not narrows them with facts, and the two work well together. The 5 whys follows one chain of causes down. In an <a href="/tools/8d-report.html">8D</a>, the Is / Is Not is usually part of D2, and its test of causes is part of D4.</p>

<h2>On the exam</h2>
<p>CMDA V.A lists Is/Is Not (Kepner-Tregoe) by name among the quality control and problem-solving tools. CQE V.E covers failure analysis and root cause analysis in corrective action, and CSSBB VI.D.2 covers the tools used to find root causes of chronic problems. Expect a scenario where you must say which possible cause is consistent with the facts, or which comparison (the IS NOT) is most useful.</p>
"""),

dict(slug="a3-problem-solving-report", name="A3 problem-solving report",
covers="CSSBB VI.D.2, CQPA II.A, CQE V.C.3",
title="A3 Report Template — One-Page Problem Solving, Free | SC Quality Guild",
desc="Free A3 problem-solving report. Background, current condition, goal, root cause, countermeasures, plan and follow-up, with a run chart, on one landscape page.",
h1="A3 problem-solving report",
lede="Tell the whole story of a problem on one page: background, current condition with a run chart, goal, root cause, countermeasures, plan and follow-up. Fill in the sections, and the A3 prints on one landscape sheet.",
content="""
<h2>What an A3 is</h2>
<p>An A3 report is a one-page problem-solving storyboard, named after the A3 paper size (about 11 by 17 inches) it was written on. It comes from Toyota, where it is used to solve problems, to propose changes and to coach people. The page limit is the point: it forces the writer to understand the problem well enough to explain it briefly, and lets a reader take in the whole story at once.</p>

<h2>The sections</h2>
<p>The left side is the problem, the right side the response. Read in order, it follows plan-do-check-act.</p>
<ol>
<li><b>Background:</b> why this problem, why now, and which business goal it affects.</li>
<li><b>Current condition:</b> what is actually happening, found by going to see. One measure with a baseline, and usually a sketch of the process.</li>
<li><b>Goal:</b> the condition wanted, with a number and a date.</li>
<li><b>Root cause analysis:</b> the analysis that connects the current condition to its causes: a Pareto chart, a fishbone, 5 whys.</li>
<li><b>Countermeasures:</b> each one answers a root cause. Toyota says countermeasure, not solution, because it is the best answer known now.</li>
<li><b>Plan:</b> what, who, when.</li>
<li><b>Follow-up:</b> how and when the result will be checked, what it showed, and what happens next: standardize, spread, or start again.</li>
</ol>

<h2>Reading the numbers</h2>
<p>The run chart shows the measure before and after the countermeasures, with the baseline and the target. Two figures summarize it:</p>
<ul>
<li><b>Improvement on baseline</b> = (baseline &minus; mean after) &divide; baseline &times; 100 when lower is better, or (mean after &minus; baseline) &divide; baseline &times; 100 when higher is better.</li>
<li><b>Share of the gap closed</b> = (mean after &minus; baseline) &divide; (target &minus; baseline) &times; 100. At 100% the target is met.</li>
</ul>
<p>If no baseline is entered, the mean of the "Before" points is used. A few points after a change can show a shift, but not that it will hold; keep plotting.</p>

<h2>Writing a good A3</h2>
<p>The checks look for the usual weaknesses: a goal with no number, a goal that is really an action, countermeasures with no root cause behind them, actions with no owner, and no follow-up. They also warn when there is more text than will fit on one page. An A3 written in full sentences across the whole sheet is a report; an A3 written in facts, numbers and a picture is a tool.</p>
<p>For the analysis behind section 4, use the <a href="/tools/fishbone-5-whys.html">fishbone and 5 whys</a>. For a short, team-based improvement, the <a href="/tools/kaizen-pdca-planner.html">kaizen and PDCA planner</a> covers one cycle in more detail.</p>

<h2>On the exam</h2>
<p>CSSBB VI.D.2 names A3 among the tools used to find and resolve the root cause of chronic problems. Its structure follows plan-do-check-act, which CQPA II.A and CQE V.C.3 cover. Expect to recognize an A3 from its sections, and to place a given section in the PDCA cycle.</p>
"""),

dict(slug="out-of-control-action-plan", name="Out-of-control action plan (OCAP)",
covers="CQPA III.E.5, CQE VI.F.6, CSSBB VIII.A.5, VIII.C.2, CMDA V.A",
title="Out-of-Control Action Plan (OCAP) Builder — Free Flowchart | SC Quality Guild",
desc="Free OCAP builder. Chart signals, checks in order, actions and escalation drawn as a flowchart, with an event log that shows which causes keep coming back.",
h1="Out-of-control action plan (OCAP)",
lede="Write down what the operator does when a control chart signals: which checks, in what order, what action each finding calls for, and when to escalate. The plan draws itself as a flowchart, and the event log shows which causes keep coming back.",
content="""
<h2>Why an OCAP</h2>
<p>A control chart only helps if someone reacts to it, and reacts the same way every time. Without a plan, one shift adjusts the machine at every signal, another ignores signals, and a third stops and waits for an engineer. An out-of-control action plan (OCAP) is the agreed reaction, written as a flowchart and posted with the chart. It is the reaction plan of the <a href="/tools/control-plan.html">control plan</a>, made specific.</p>

<h2>The three parts</h2>
<ul>
<li><b>Activators:</b> the signals that start the plan. These are the chart rules in use: a point beyond a control limit, a run on one side of the center line, a trend, and so on. Agree which rules apply to this chart; using every rule on every chart raises false alarms.</li>
<li><b>Checkpoints:</b> yes/no questions about the likely causes, in order. Put the quickest and most likely first. The first is almost always the measurement: was the part measured, recorded and plotted correctly?</li>
<li><b>Terminators:</b> the actions each finding leads to, ending in "resume production" or an escalation to someone who can investigate further.</li>
</ul>
<p>Every OCAP also needs to say what happens to the <b>product made since the last good point</b>. A process that was out of control may have made bad parts before anyone noticed.</p>

<h2>Writing the steps</h2>
<p>Write each check so that <b>Yes</b> means "found it" and leads to an action, and <b>No</b> moves to the next check. Name who does each step and how long it should take. Keep the chain short: a long list is skipped in practice. If the checks find nothing, escalate; do not let the operator guess.</p>
<p>The tool checks that every signal leads somewhere, every check has both answers, every ID exists, every step can be reached, and every path ends at "resume" or an escalation, with no loops that never end.</p>

<h2>The event log</h2>
<p>Each use of the plan is one line in the log: the signal, where the cause was found, what was done and how many parts were suspect. The log turns reactions into learning. When the same cause shows up again and again (an insert that chips every two weeks), the OCAP is doing its job, but the process needs a corrective action that stops the cause, such as a tool-life limit. When many events end in escalation with no cause found, the plan is missing a check.</p>

<h2>On the exam</h2>
<p>CQPA III.E.5 and CQE VI.F.6 cover reading control chart patterns and the rules for statistical control. CSSBB VIII.A.5 covers interpreting control charts to tell special from common causes, and VIII.C.2 the control plan that keeps the improved process in control. CMDA V.A includes setting alert and action levels and SPC charts. Expect to choose the right reaction to a given signal, and to recognize that adjusting a process in response to common-cause variation (tampering) makes it worse.</p>
"""),

dict(slug="benchmarking-gap-analysis", name="Benchmarking gap worksheet",
covers="CQPA II.C.3, CQE I.B.2.a, CSSBB II.B, VI.D.1, CSQP V.A.4",
title="Benchmarking Gap Analysis Worksheet — Free Online | SC Quality Guild",
desc="Free benchmarking worksheet: your measures against a partner's, the gap, % to improve, % of benchmark, the practices behind it and an adaptation plan.",
h1="Benchmarking gap worksheet",
lede="Compare your measures with a benchmarking partner's: the gap, how much you would need to improve, and how far your targets close it. Then record the practices that explain the gap, whether they transfer, and the plan to adapt them.",
content="""
<h2>What benchmarking is</h2>
<p>Benchmarking is comparing your processes and results with those of organizations that do them best, and learning how they do it. The numbers show how big the gap is. The practices show why, and those are what you can act on. A benchmarking study that ends with a table of gaps and no practices has measured the problem without learning anything.</p>

<h2>Types of benchmarking</h2>
<ul>
<li><b>Internal:</b> another site or unit of your own organization. Data is easy to get; the best practice may not be inside.</li>
<li><b>Competitive:</b> a direct competitor. Highly relevant, but data is hard to get and legal limits apply.</li>
<li><b>Functional:</b> the same function in another industry, such as order fulfillment at a distributor compared with a manufacturer's spare parts.</li>
<li><b>Generic:</b> a process that is the same in any business, such as invoicing or hiring.</li>
<li><b>Collaborative:</b> a group of organizations sharing data, often through a benchmarking network or association.</li>
</ul>

<h2>The figures</h2>
<p>For each measure, choose whether higher or lower is better. Then:</p>
<ul>
<li><b>Gap</b> = benchmark &minus; own when higher is better, or own &minus; benchmark when lower is better. Positive means the partner is better; negative means you lead.</li>
<li><b>Improve by</b> = gap &divide; |own| &times; 100: how much you must improve, as a share of where you are now.</li>
<li><b>Of benchmark</b> = own &divide; benchmark &times; 100 when higher is better, or benchmark &divide; own &times; 100 when lower is better: your performance as a share of the partner's. 100% means equal.</li>
<li><b>Target closes</b> = (target &minus; own) &divide; (benchmark &minus; own) &times; 100: how much of the gap your target would close.</li>
</ul>
<p>The same lead time of 6.5 days against 1.5 days reads as "improve by 77%" and "23% of the benchmark". Both are correct; they answer different questions.</p>

<h2>Comparing like with like</h2>
<p>A gap is only real if both sides measure the same thing in the same way over the same period. Lead time from order entry or from payment? Accuracy by line or by order? Agree definitions with the partner before acting on the numbers. Then, for each practice, judge whether it transfers: volumes, products, systems and culture differ. Most practices need adapting, and some do not fit.</p>
<p>Benchmarking is one way to set the goals for an improvement project; the <a href="/tools/project-charter.html">project charter</a> is where they go next.</p>

<h2>On the exam</h2>
<p>CQPA II.C.3 asks you to define benchmarking and describe how it supports best practices. CQE I.B.2.a covers benchmarking as a deployment technique for the quality system. CSSBB II.B asks you to distinguish types of benchmarking and to select measures and performance goals from benchmarking, and CSSBB VI.D.1 covers gap analysis between current and future states. CSQP V.A.4 includes benchmarking in supplier development.</p>
"""),
]
