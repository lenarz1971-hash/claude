# Management and planning tools, batch b2 (Oct 2026): affinity diagram,
# interrelationship digraph, PDPC, matrix diagram, force field analysis.
# For CQPA II.D.1, CQE V.B, CSSBB IV.D and CMDA V.A.
PAGES6B2 = [
dict(slug="affinity-diagram", name="Affinity diagram",
covers="CQPA II.D.1, CQE V.B.1, CSSBB IV.D.1, CMDA V.A",
title="Affinity Diagram Maker — Group Ideas Under Header Cards | SC Quality Guild",
desc="Free affinity diagram tool. Write idea cards, sort them into groups under header cards, and get the diagram drawn, with checks for loners and weak headers.",
h1="Affinity diagram",
lede="Write the ideas on cards, sort them into natural groups, and give each group a header card. The diagram draws itself and the checks point out loose cards, groups of one and headers that are only labels.",
content="""
<h2>What an affinity diagram is for</h2>
<p>An affinity diagram organizes a large number of ideas, opinions or facts into a few groups by their natural relationships. It is the first of the seven management and planning tools, and it is used when the material is too large or too vague to analyze directly: the output of a brainstorm, interview notes, open survey answers, a pile of complaints. The result is a short list of themes that the team agrees on and can work with.</p>
<p>It is a tool for language data, not numbers. It finds structure; it does not rank the groups or prove what causes what.</p>

<h2>How to run it</h2>
<ol>
<li><b>State the question</b> as a full sentence, so everyone is answering the same thing.</li>
<li><b>Write one idea per card</b>, in a few words with a verb: "Test bench down twice a week", not "Bench" and not a paragraph.</li>
<li><b>Sort in silence.</b> Everyone moves cards at the same time, without discussion. If a card keeps moving between two groups, make a copy. Silence stops the loudest person setting the categories.</li>
<li><b>Discuss and adjust</b> once the groups have settled. A card that fits nowhere can stay alone.</li>
<li><b>Write the header cards last.</b> A header is a short statement that captures what the cards in the group have in common.</li>
</ol>

<h2>Good header cards</h2>
<p>The header carries the meaning of the group to someone who never reads the cards. "Training" is a label; "Only one person is trained on the test bench" says something. Headers written as statements make the groups easier to act on and are what the next tool uses: the header cards are usually the issues placed on an <a href="/tools/interrelationship-digraph.html">interrelationship digraph</a>.</p>

<h2>Reading the checks</h2>
<ul>
<li><b>Ungrouped cards</b> are the unfinished work. Place them, or keep them as deliberate loners.</li>
<li><b>Groups of one</b> are often a header in disguise or a card that belongs elsewhere.</li>
<li><b>Too many groups</b> (more than about ten) means the sorting stopped too early. Look for groups that say the same thing.</li>
<li><b>One very large group</b> often holds two ideas. Split it, with subheaders.</li>
</ul>

<h2>Affinity diagram, brainstorming or fishbone?</h2>
<p>Brainstorming generates the ideas; the affinity diagram organizes them. A <a href="/tools/fishbone-5-whys.html">cause and effect diagram</a> sorts causes into categories chosen in advance (such as the 6Ms). The affinity diagram lets the categories come out of the cards, which is why it suits new or messy problems where nobody yet knows the right categories.</p>

<h2>On the exam</h2>
<p>Affinity diagrams are listed among the quality management tools in CQPA (II.D.1), together with force field analysis in CQE (V.B.1), among the analytical tools in the CSSBB Define section (IV.D.1), and among the quality control and problem-solving tools in CMDA (V.A). Expect questions on when to use one (large amounts of unorganized language data), on the silent sorting step, and on what a header card is.</p>
"""),

dict(slug="interrelationship-digraph", name="Interrelationship digraph",
covers="CQPA II.D.1, CQE V.B.5, CSSBB IV.D.7",
title="Interrelationship Digraph Tool — Key Drivers and Outcomes | SC Quality Guild",
desc="Free interrelationship digraph tool. List issues, enter cause-and-effect arrows, and get the in and out counts, the key driver and the key outcome, drawn.",
h1="Interrelationship digraph",
lede="List the issues, then draw an arrow from each cause to its effect. The tool counts the arrows in and out of every issue, names the key driver and the key outcome, and draws the digraph.",
content="""
<h2>What the digraph is for</h2>
<p>An interrelationship digraph (ID, also called a relations diagram) shows how a set of issues affect one another. It is used when a problem is complex and the issues are tangled together, and the team needs to know where to start. Instead of attacking every issue at once, it finds the few that drive the others.</p>
<p>The issues often come from the header cards of an <a href="/tools/affinity-diagram.html">affinity diagram</a>. Five to ten issues is the workable range.</p>

<h2>How to build one</h2>
<ol>
<li>Arrange the issues, usually in a circle so that every pair can be connected.</li>
<li>Take each pair in turn and ask: does one cause or influence the other? If not, draw nothing.</li>
<li>If they are related, decide which direction is the <b>stronger</b> influence and draw a single arrow from the cause to the effect. The method allows one arrow per pair; two-way arrows hide the decision the team has to make.</li>
<li>Count the arrows going out of and coming into each issue.</li>
</ol>
<p>With n issues there are n(n &minus; 1)/2 pairs to consider: 28 for eight issues. Going through all of them is the work; skipping pairs gives misleading counts.</p>

<h2>Reading the counts</h2>
<ul>
<li><b>Key driver:</b> the issue with the most arrows going out. It is a root cause or a lever: improving it moves the issues downstream. Work here first.</li>
<li><b>Key outcome:</b> the issue with the most arrows coming in. It is a symptom, and a good measure of success, but attacking it directly rarely lasts.</li>
<li>Issues with more out than in are mostly causes; more in than out, mostly effects. An issue with no arrows either does not belong or a link was missed.</li>
</ul>
<p>Some practitioners also look at the total of in plus out: an issue with many arrows both ways is a bottleneck where many relationships meet.</p>

<h2>Limits</h2>
<p>The arrows record the team's judgment, not measured data. The digraph points to where to look; it does not prove cause. Confirm the key driver with data, for example with a <a href="/tools/fishbone-5-whys.html">cause and effect analysis</a> and a test, before committing resources to it.</p>

<h2>On the exam</h2>
<p>Interrelationship digraphs are listed among the quality management tools in CQPA (II.D.1), the quality management and planning tools in CQE (V.B.5), and the analytical tools in CSSBB (IV.D.7). Expect to read a digraph, count the in and out arrows, and identify the key driver (most outgoing) and key outcome (most incoming).</p>
"""),

dict(slug="process-decision-program-chart", name="Process decision program chart (PDPC)",
covers="CQPA II.D.1, CQE V.B.3, CSSBB IV.D.6",
title="Process Decision Program Chart (PDPC) Tool — Free Online | SC Quality Guild",
desc="Free PDPC tool. For each plan step, list what could go wrong and the countermeasures, mark each practical (O) or not (X), and get the chart drawn.",
h1="Process decision program chart (PDPC)",
lede="Take each step of a plan, ask what could go wrong, and write a countermeasure for each problem. Mark each countermeasure practical (O) or impractical (X). The chart draws itself and shows the problems with no practical answer.",
content="""
<h2>What a PDPC is for</h2>
<p>A process decision program chart (PDPC) looks for what could go wrong with a plan before it is carried out, and plans the countermeasures in advance. It is one of the seven management and planning tools. It is used for plans that are new, complex or have a fixed deadline, where a surprise would be expensive: a product launch, a plant move, a system changeover.</p>
<p>It is contingency planning on a tree. The plan steps usually come from a tree diagram or a work breakdown structure; the PDPC adds two more levels under each step.</p>

<h2>The levels</h2>
<ol>
<li><b>Objective:</b> what the plan must achieve.</li>
<li><b>Plan steps</b> (activities): what will be done.</li>
<li><b>What could go wrong</b> at each step: the problems, risks or "what-ifs". Ask about every step, including the routine ones.</li>
<li><b>Countermeasures</b> for each problem: what would prevent it or deal with it.</li>
<li><b>Feasibility:</b> each countermeasure is marked <b>O</b> if it is practical in cost, time and people, or <b>X</b> if it is not. The O countermeasures are adopted and built into the plan.</li>
</ol>

<h2>Reading the chart</h2>
<ul>
<li>A problem whose countermeasures are all X has no practical protection. Change the plan step, find another answer, or accept the risk as a recorded decision.</li>
<li>A problem with no countermeasure at all is unfinished work.</li>
<li>A step with no problems listed usually means nobody asked. Routine steps fail too.</li>
<li>An adopted countermeasure with no owner and no date will not happen. Put it in the project plan.</li>
</ul>

<h2>PDPC, FMEA or a risk register?</h2>
<p>All three ask what could go wrong. A PDPC follows the steps of a plan and is quick and visual; it suits one-off projects. An <a href="/tools/fmea.html">FMEA</a> scores severity, occurrence and detection for each failure mode of a product or process, and is the formal tool for repeated processes and designs. A <a href="/tools/risk-register-heat-map.html">risk register</a> tracks risks over the life of a project with likelihood and impact. A PDPC is often the first pass that feeds the other two.</p>

<h2>On the exam</h2>
<p>PDPC is listed among the quality management tools in CQPA (II.D.1), the quality management and planning tools in CQE (V.B.3), and the analytical tools in CSSBB (IV.D.6). Expect to recognize a PDPC from its structure (plan, what could go wrong, countermeasures), to know that it is used for contingency planning, and to read the O and X marks.</p>
"""),

dict(slug="matrix-diagram", name="Matrix diagram (L and T)",
covers="CQPA II.D.1, CQE V.B.4, CSSBB IV.D.3",
title="Matrix Diagram Tool — L-Shaped and T-Shaped Relationship Matrix | SC Quality Guild",
desc="Free L- and T-shaped matrix diagram tool. Mark strong, medium and weak relationships (9, 3, 1); get row and column totals and flags for empty rows.",
h1="Matrix diagram (L-shaped and T-shaped)",
lede="Put one list across the top and one or two down the side, and mark how strongly each pair is related. The tool totals each row and column and flags the rows and columns with no relationship at all.",
content="""
<h2>What a matrix diagram is for</h2>
<p>A matrix diagram shows the relationships between the items of two or more lists. Each cell where a row and a column meet holds a symbol for how strongly they are related, or nothing. It is one of the seven management and planning tools and is used to answer questions such as: which actions address which complaints, which processes affect which requirements, or who is responsible for which task.</p>

<h2>The shapes</h2>
<ul>
<li><b>L-shaped:</b> two lists, one down the side and one across the top. The most common.</li>
<li><b>T-shaped:</b> three lists. One list (across the middle) is related to two others, one above and one below. For example, actions related to complaints and to the departments that must carry them out. This tool draws the two row lists one under the other, sharing the columns.</li>
<li><b>Y-shaped, X-shaped and C-shaped</b> relate three or four lists in a circle or in three dimensions. They are rare in practice; the same relationships can be built from several L matrices.</li>
</ul>

<h2>Symbols and totals</h2>
<p>The usual symbols are a double circle (&#9678;) for a strong relationship, a circle (&#9675;) for medium and a triangle (&#9651;) for weak, scored 9, 3 and 1. The wide 9-3-1 spread makes strong relationships dominate the totals. Adding the scores across a row shows how well that row item is covered; adding down a column shows how much each column item matters across all the rows.</p>

<h2>Reading the matrix</h2>
<ul>
<li>An <b>empty row</b> is a gap: nothing in the other list addresses it. In a complaints-to-actions matrix, it is a complaint nobody is working on.</li>
<li>An <b>empty column</b> is an item that serves nothing. Ask why it is there.</li>
<li>A row with only weak links is covered on paper but not in fact.</li>
<li>A column with a high total is a key item: it relates strongly to many rows.</li>
<li>A matrix where nearly every cell is marked is not discriminating. Keep only relationships you could defend.</li>
</ul>

<h2>Matrix, prioritization matrix or house of quality?</h2>
<p>A matrix diagram shows relationships. A <a href="/tools/project-selection-matrix.html">prioritization matrix</a> adds weights to the criteria and scores options to rank them. The <a href="/tools/qfd-house-of-quality.html">house of quality</a> is an L matrix of customer requirements against technical characteristics, weighted by customer importance, with a roof showing how the characteristics interact.</p>

<h2>On the exam</h2>
<p>Matrix diagrams are listed among the quality management tools in CQPA (II.D.1), the quality management and planning tools in CQE (V.B.4), and the analytical tools in CSSBB (IV.D.3). Expect to name the shapes (L, T, Y, X), to know the strong, medium and weak symbols and the 9-3-1 scoring, and to total a row or column.</p>
"""),

dict(slug="force-field-analysis", name="Force field analysis",
covers="CQE V.B.1, CQE I.E.2",
title="Force Field Analysis Tool — Driving and Restraining Forces | SC Quality Guild",
desc="Free force field analysis tool. Weight driving and restraining forces 1 to 5, plan actions, and see the totals and the balance before and after, drawn.",
h1="Force field analysis",
lede="List the forces pushing for a change and the forces holding it back, and weight each one. The tool totals both sides, shows the balance, and with planned actions shows whether they are enough to tip it.",
content="""
<h2>What force field analysis is for</h2>
<p>Force field analysis, developed by the social psychologist Kurt Lewin, looks at a proposed change as a balance of forces. <b>Driving forces</b> push toward the change: customer demands, cost pressure, audit findings, a better way of working. <b>Restraining forces</b> hold the present state in place: habit, cost, skills, fear, missing equipment. While the two sides are in balance, nothing moves. The analysis shows what has to shift for the change to happen.</p>
<p>It is a facilitation and planning tool. Teams use it before a change, to plan how to win acceptance, and when a change has stalled, to see why.</p>

<h2>How to run it</h2>
<ol>
<li>Describe the change as a move from the present state to a desired state.</li>
<li>List the driving forces and the restraining forces. Include the people affected; restraining forces are easy to miss from the planning office.</li>
<li>Weight each force, here 1 (weak) to 5 (strong). The weights are judgments, so agree them as a team.</li>
<li>Compare the totals and look at the biggest forces on each side.</li>
<li>Plan actions: how to weaken each important restraining force, and where useful how to strengthen a driving force. Estimate the weight after each action.</li>
</ol>

<h2>Reducing resistance works better than pushing</h2>
<p>Lewin's main point is that adding drive tends to raise the resistance: more pressure from management produces more push-back. Reducing a restraining force, for example by training people, involving them in the design, or removing a practical obstacle, changes the balance without that reaction, and the change is more likely to last. The checks flag a plan whose gains come mainly from more drive.</p>

<h2>Reading the totals</h2>
<p>The totals are a way of structuring the discussion, not a measurement. A driving total of 15 against a restraining total of 14 does not mean the change will succeed; it means the sides are close and the largest restraining forces need attention. Treat a single heavily weighted restraining force with no action as the first item in the plan.</p>

<h2>Where it fits</h2>
<p>Force field analysis often follows the decision to change and comes before a <a href="/tools/change-management-plan.html">change management plan</a> and a <a href="/tools/stakeholder-analysis.html">stakeholder analysis</a>. It also works for an <a href="/tools/affinity-diagram.html">affinity</a>-style team session: the forces can be brainstormed on cards and sorted.</p>

<h2>On the exam</h2>
<p>The CQE Body of Knowledge lists force field analysis with affinity diagrams among the quality management and planning tools (V.B.1), and among the facilitation tools a CQE should be able to apply (I.E.2). Expect to identify driving and restraining forces in a scenario and to know that reducing restraining forces is the preferred strategy.</p>
"""),
]
