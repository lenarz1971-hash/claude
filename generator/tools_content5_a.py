# Planning, process and risk tools, batch 1 (Oct 2026). Basic quality tools,
# management and planning tools, risk and probability for CQPA, CQE, CSSBB,
# CSQP and CMDA.
PAGES5A = [
dict(slug="flowchart-swimlane", name="Flowchart and swimlane map",
covers="CQPA II.B, CQE V.A.1, CSSBB V.A.2, CSQP VI.B, CMDA V.A, CCT V.B",
title="Flowchart and Swimlane Process Map Builder — Free Online | SC Quality Guild",
desc="Free flowchart and swimlane builder. List the steps, decisions and who does each one; get the map drawn with handoffs, loops and value-added time marked.",
h1="Flowchart and swimlane process map",
lede="List the steps, the decisions and who does each one. The map draws itself, with the handoffs between departments, the rework loops and the share of time that adds value.",
content="""
<h2>What a flowchart is for</h2>
<p>A flowchart shows the steps of a process in order, with the decisions that send the work one way or another. It is one of the seven basic quality tools because almost every improvement starts with the same question: what actually happens? Drawing the process with the people who do it usually turns up steps nobody knew about, loops that send work back, and approvals that wait days for a signature.</p>
<p>Draw the process as it is, not as the procedure says it should be. The gap between the two is often the finding.</p>

<h2>The symbols</h2>
<ul>
<li><b>Oval:</b> start or end. Every map has a clear trigger and a clear end point.</li>
<li><b>Box:</b> a process step. Start each with a verb: "Inspect returned unit".</li>
<li><b>Diamond:</b> a decision, written as a question with one exit per answer.</li>
<li><b>Document, delay and inspection</b> shapes mark paperwork, waiting and checking. Those are the steps an improvement team usually looks at first.</li>
</ul>

<h2>Swimlanes</h2>
<p>A swimlane map (a cross-functional or deployment flowchart) puts each department or role in its own lane. Every arrow that crosses a lane is a <b>handoff</b>, where the work changes hands. Handoffs are where work waits in someone's queue, where information gets lost, and where nobody owns the whole result. Counting them is a quick measure of how fragmented a process is.</p>

<h2>Reading the map</h2>
<ul>
<li><b>Loops</b> back to an earlier step are rework. Ask how often each one is taken. A loop taken one time in ten is a hidden factory.</li>
<li><b>Value-added time</b> is time spent on work the customer would pay for. In most service and administrative processes it is a small share of the total; the rest is waiting, moving and checking.</li>
<li><b>Decisions with one exit</b>, or steps that go nowhere, mean the map is not finished. Usually nobody has agreed what happens in that case.</li>
</ul>

<h2>Flowchart, SIPOC or value stream map?</h2>
<p>A <a href="/tools/sipoc.html">SIPOC</a> is the one-page, high-level view used to scope a project. A flowchart shows the detailed steps and decisions. A <a href="/tools/value-stream-map-takt.html">value stream map</a> follows material and information flow with inventory and lead time. They are often used in that order.</p>

<h2>On the exam</h2>
<p>Flowcharts are one of the seven basic quality tools in the CQPA (II.B), CQE (V.A.1), CSQP (VI.B), CMDA (V.A) and CCT (V.B) Bodies of Knowledge. The CSSBB lists process maps and flowcharts among the process analysis tools (V.A.2). Expect to read a flowchart, find the decision or rework loop, and choose between a flowchart, a SIPOC and a value stream map for a given purpose.</p>
"""),

dict(slug="activity-network-critical-path", name="Activity network, critical path and PERT",
covers="CQPA II.D.1, II.D.2, CQE V.B.7, CSSBB IV.D.5",
title="Critical Path and PERT Calculator — Activity Network Diagram | SC Quality Guild",
desc="Free critical path (CPM) and PERT calculator. Enter activities, predecessors and three-point estimates; get ES, EF, LS, LF, slack, the critical path and the chance of finishing by a date.",
h1="Activity network, critical path and PERT",
lede="Enter the activities, what each one waits for, and how long it takes. Get the earliest and latest start and finish of each, the slack, the critical path, and with three-point estimates the chance of finishing by a target.",
content="""
<h2>The activity network</h2>
<p>An activity network diagram shows the activities of a project and the order they must happen in. Here each activity is a box (activity on node) and each arrow says "this must finish before that can start". It is one of the seven management and planning tools, and the basis of the critical path method (CPM) and of PERT.</p>

<h2>The forward and backward pass</h2>
<ul>
<li><b>Forward pass.</b> An activity's earliest start (ES) is the latest earliest finish (EF) among the activities before it. EF = ES + duration. The largest EF is the project duration.</li>
<li><b>Backward pass.</b> Working back from the end, an activity's latest finish (LF) is the smallest latest start (LS) among the activities after it. LS = LF &minus; duration.</li>
<li><b>Slack</b> (float) = LS &minus; ES = LF &minus; EF. It is how long an activity can slip without delaying the project.</li>
</ul>
<p>The <b>critical path</b> is the chain of activities with zero slack. It is the longest path through the network, and it sets the project duration. Any delay on it delays the project; time saved off it does not shorten the project.</p>

<h2>PERT: three estimates</h2>
<p>PERT (program evaluation and review technique) treats each duration as uncertain. With an optimistic time a, a most likely time m and a pessimistic time b:</p>
<ul>
<li>expected time t<sub>e</sub> = (a + 4m + b) / 6</li>
<li>standard deviation &sigma; = (b &minus; a) / 6, so variance = ((b &minus; a) / 6)<sup>2</sup></li>
</ul>
<p>Add the expected times along the critical path for the expected project duration, and add the <b>variances</b> (not the standard deviations) for its variance. The chance of finishing by a target T is then read from the normal distribution with z = (T &minus; expected duration) / &sigma;<sub>path</sub>.</p>
<p>The figure is usually optimistic. It ignores the other paths, and a path that is nearly critical but very uncertain can finish last. Watch the near-critical activities as well as the critical ones.</p>

<h2>Crashing and fast tracking</h2>
<p>To finish sooner, shorten activities on the critical path, by adding resources (crashing) or by overlapping activities that were in sequence (fast tracking). As the critical path shortens, another path may become critical; recalculate after each change.</p>

<h2>Gantt chart or network?</h2>
<p>A <a href="/tools/wbs-gantt-chart.html">Gantt chart</a> shows when each task happens on a calendar and is easier to read. The network shows why: which activities drive the finish date. Most projects use both.</p>

<h2>On the exam</h2>
<p>CQPA lists activity network diagrams among the quality management tools (II.D.1) and PERT and the critical path method among the project management tools (II.D.2). CQE (V.B.7) and CSSBB (IV.D.5) include activity network diagrams. Expect to find the critical path, compute slack, and calculate a PERT expected time and standard deviation by hand.</p>
"""),

dict(slug="risk-register-heat-map", name="Risk register and heat map",
covers="CQE VII.B, VII.C.1, CQPA II.C.4, CSSBB VI.C.1, CSQP II.A, II.B, CMDA IV.A",
title="Risk Register Template with Heat Map — Likelihood x Impact | SC Quality Guild",
desc="Free risk register with a 5x5 heat map. Score likelihood and impact, set risk criteria, choose avoid, reduce, transfer or accept, and see the residual risk after the actions.",
h1="Risk register and heat map",
lede="Record each risk with its cause and effect, score likelihood and impact against criteria you set, choose a treatment, and see the risks on a heat map before and after the planned actions.",
content="""
<h2>What a risk register is</h2>
<p>A risk register is the working record of a risk management process. Each line is one risk: what could happen and why, how likely it is, how bad it would be, what is being done about it, who owns it and when it will be looked at again. A register that is written once and never reviewed is a list, not risk management.</p>

<h2>Writing a risk</h2>
<p>Write each risk as cause, event and effect: <i>because</i> the seal comes from a single source, <i>there is a risk</i> of a supply interruption, <i>which would</i> stop the line. The cause tells you what to act on. The effect tells you how to score the impact. "Supplier problems" tells you neither.</p>

<h2>Risk criteria and scoring</h2>
<p>Before scoring, agree the <b>risk criteria</b>: what each likelihood and impact level means, and which scores are acceptable. Here both are scored 1 to 5 and the risk score is likelihood &times; impact. The two thresholds turn the score into low, medium and high. A risk matrix, or heat map, shows the same thing as a grid, so a group of risks can be compared at a glance.</p>
<p>A score is a ranking aid, not a measurement. A likelihood of 1 and an impact of 5 scores the same as 5 and 1, and they are not the same risk. That is why the highest-impact risks are flagged whatever their score.</p>

<h2>Treatment</h2>
<ul>
<li><b>Avoid:</b> do not do the risky thing, or do it another way.</li>
<li><b>Reduce (mitigate):</b> lower the likelihood, the impact, or both, with controls.</li>
<li><b>Transfer or share:</b> insurance, contract terms, a second party. It usually moves who pays, not what happens to your customer.</li>
<li><b>Accept:</b> a deliberate decision, at the right level, to live with the risk. Accepting a risk is not the same as ignoring it.</li>
</ul>
<p><b>Residual risk</b> is the risk expected once the actions are in place. Comparing the two heat maps shows what the plan is expected to achieve. Check later that it did.</p>

<h2>Risk register, FMEA or fault tree?</h2>
<p>A register covers risks of every kind: project, supplier, financial, regulatory. An <a href="/tools/fmea.html">FMEA</a> looks at the failure modes of one product or process step by step. A <a href="/tools/fault-tree-analysis.html">fault tree</a> works down from one undesired event to its causes. A register often points to where an FMEA or a fault tree is needed.</p>

<h2>On the exam</h2>
<p>The CQE has a whole section on risk management (VII): risk criteria, risk matrices and acceptability (VII.B.2), and documenting risks and controls in a risk register (VII.C.1). CQPA covers types of risk and avoidance, reduction, prevention, segregation and transfer (II.C.4). CSSBB VI.C.1 asks you to assess and prioritize enterprise, operational, supplier and product risk. CSQP II covers supplier risk and mitigation plans, and CMDA IV.A risk analysis, evaluation and control under ISO 14971.</p>
"""),

dict(slug="fault-tree-analysis", name="Fault tree analysis",
covers="CSSBB VI.D.2, CSQP II.B.1, IV.C, CMDA V.A, CQE III.E.4",
title="Fault Tree Analysis Calculator — Minimal Cut Sets, Top Event Probability | SC Quality Guild",
desc="Free fault tree analysis builder. Build AND and OR gates down to basic events; get the top-event probability, the minimal cut sets, single points of failure and event importance.",
h1="Fault tree analysis",
lede="Start from the failure you want to prevent, break it down through AND and OR gates to basic events, and get the top-event probability, the minimal cut sets and the events that matter most.",
content="""
<h2>What a fault tree does</h2>
<p>Fault tree analysis (FTA) starts with one undesired event, the <b>top event</b>, and works down to the combinations of lower-level events that could cause it. It is deductive, top down. An <a href="/tools/fmea.html">FMEA</a> is the opposite: it starts from each component or step and asks what its failure would lead to. FMEA finds the effects of known failure modes; FTA finds the combinations that lead to one effect.</p>

<h2>Gates and events</h2>
<ul>
<li><b>OR gate:</b> the output occurs if <i>any</i> input occurs. For independent inputs, P = 1 &minus; &prod;(1 &minus; P<sub>i</sub>). For small probabilities this is close to the sum.</li>
<li><b>AND gate:</b> the output occurs only if <i>all</i> inputs occur. For independent inputs, P = &prod; P<sub>i</sub>. AND gates are where redundancy shows: two pumps both have to fail.</li>
<li><b>Basic event:</b> where the tree stops, with a probability from data.</li>
<li><b>Undeveloped event:</b> a cause not broken down further, for lack of information or because it does not matter enough.</li>
</ul>

<h2>Minimal cut sets</h2>
<p>A <b>cut set</b> is a set of basic events that together cause the top event. A <b>minimal</b> cut set is one with nothing to spare: remove any event and it no longer causes the top event. The minimal cut sets are the clearest output of a fault tree:</p>
<ul>
<li>A cut set of <b>one</b> event is a single point of failure.</li>
<li>A cut set of two or more needs all of them at once, which is usually far less likely.</li>
<li>Ranking the cut sets by probability shows where to act.</li>
</ul>

<h2>Repeated events and common causes</h2>
<p>When the same basic event feeds more than one gate, multiplying gate by gate counts it twice and gives the wrong answer. This tool calculates from the basic events themselves, so repeats are handled exactly. In the worked example a shared power supply feeds both pumps. It appears as a single point of failure, which the "redundant" pump design hides.</p>
<p>Every figure assumes the basic events are independent. A common cause, such as one power supply, one maintenance error or one batch of bad parts, breaks that assumption. Model it as its own event.</p>

<h2>Importance</h2>
<p>The Fussell-Vesely importance of a basic event is the share of the risk coming from cut sets that contain it. A high value means improving that event lowers the top-event probability the most.</p>

<h2>On the exam</h2>
<p>CSQP names FTA among the tools for analyzing supplier risk (II.B.1) and for supplier root cause analysis (IV.C). CMDA lists it among the quality tools (V.A). CSSBB includes fault tree analysis in root cause analysis (VI.D.2). CQE covers reliability, safety and hazard assessment tools (III.E.4). Expect to read a fault tree, compute AND and OR gate probabilities, and say how FTA differs from FMEA.</p>
"""),

dict(slug="probability-calculator", name="Probability calculator",
covers="CQPA III.A.3, CQE VI.B.3, CSSBB V.E.1, CQE III.E",
title="Probability Calculator — Addition, Multiplication, Conditional, nCr, Reliability | SC Quality Guild",
desc="Free probability calculator. Addition and multiplication rules, conditional probability, complements, combinations and permutations, at-least-one, and series and parallel system reliability.",
h1="Probability calculator",
lede="Work the probability rules on two events, count combinations and permutations, find the chance of at least one occurrence, and calculate the reliability of components in series and parallel.",
content="""
<h2>The rules</h2>
<ul>
<li><b>Complement:</b> P(not A) = 1 &minus; P(A).</li>
<li><b>Addition rule:</b> P(A or B) = P(A) + P(B) &minus; P(A and B). The joint probability is subtracted because it would otherwise be counted twice. For <b>mutually exclusive</b> events, which cannot happen together, P(A and B) = 0 and the rule becomes P(A) + P(B).</li>
<li><b>Multiplication rule:</b> P(A and B) = P(A) &times; P(B given A). For <b>independent</b> events, where one does not change the chance of the other, P(B given A) = P(B), so P(A and B) = P(A) &times; P(B).</li>
<li><b>Conditional probability:</b> P(A given B) = P(A and B) / P(B).</li>
</ul>
<p>Mutually exclusive and independent are often confused. They are nearly opposites: if two events with nonzero probability are mutually exclusive, knowing one happened tells you the other did not, so they cannot be independent.</p>

<h2>The worked example</h2>
<p>Sixty percent of parts come from line 1. Five percent of line 1 parts are defective. So P(line 1 and defective) = 0.60 &times; 0.05 = 0.03. If four percent of all parts are defective, then P(line 1 given defective) = 0.03 / 0.04 = 0.75. Three quarters of the defectives come from line 1, which makes 60% of the parts. The calculator also shows that the events are not independent.</p>

<h2>Counting</h2>
<ul>
<li><b>Combinations</b>, where order does not matter: nCr = n! / (r!(n &minus; r)!). Ten parts, choose three for test: 120 ways.</li>
<li><b>Permutations</b>, where order matters: nPr = n! / (n &minus; r)!. Ten candidates for first, second and third place: 720 ways.</li>
</ul>

<h2>At least one</h2>
<p>The chance of at least one occurrence in n independent tries is 1 &minus; (1 &minus; p)<sup>n</sup>, the complement of "none in n". With a 2% chance each time, the chance of at least one in 50 tries is 64%. It is not 100%, and it is not 50 &times; 2%.</p>

<h2>Series and parallel reliability</h2>
<ul>
<li><b>Series:</b> the system works only if every part works. R<sub>s</sub> = R<sub>1</sub> &times; R<sub>2</sub> &times; &hellip;. A series system is less reliable than its weakest part.</li>
<li><b>Parallel</b> (redundant): the system works if any part works. R<sub>p</sub> = 1 &minus; (1 &minus; R<sub>1</sub>)(1 &minus; R<sub>2</sub>)&hellip;.</li>
</ul>
<p>Mixed systems are reduced block by block: work out each parallel block, then multiply the blocks in series. Redundancy only helps as much as the failures are independent. The <a href="/tools/fault-tree-analysis.html">fault tree</a> shows the same logic from the failure side.</p>

<h2>On the exam</h2>
<p>CQPA asks you to use independent and mutually exclusive events, combinations, permutations, the addition and multiplication rules and conditional probability (III.A.3, Apply). CQE (VI.B.3) and CSSBB (V.E.1) cover the same concepts, and CQE includes reliability of systems (III.E). Expect at least one question that turns on whether events are independent or mutually exclusive.</p>
"""),
]
