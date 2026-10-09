"""Content for the /tools/ pages, batch 2: the remaining 17 Yellow Belt tools."""

PAGES2 = [
dict(slug="dmaic-roadmap", name="DMAIC roadmap", covers="CSSYB I.A",
title="DMAIC Roadmap — Phases, Outputs and Tools, With a Progress Tracker | SC Quality Guild",
desc="Free DMAIC roadmap. The five phases of Six Sigma, the question each answers, the outputs each must produce and the tool for each, with a tracker to tick off your own project.",
h1="DMAIC roadmap",
lede="Define, Measure, Analyze, Improve, Control: what each phase is for, what it must produce, and a tracker to tick your project through them.",
content="""
<h2>Five questions in order</h2>
<p>DMAIC is the improvement method at the center of Six Sigma. Each phase answers one question, and each
answer is the input to the next:</p>
<ul>
  <li><b>Define:</b> what is the problem, for which customer, and what would success look like?</li>
  <li><b>Measure:</b> how big is the problem now, and can we trust the numbers?</li>
  <li><b>Analyze:</b> what causes it, and what is the evidence?</li>
  <li><b>Improve:</b> what change removes the cause, and does it work?</li>
  <li><b>Control:</b> how will the gain be held after the team moves on?</li>
</ul>
<p>The order is the point. Skipping Measure means analyzing data nobody has checked. Skipping Analyze
means improving the wrong thing. Skipping Control means the problem comes back.</p>

<h2>Phase reviews</h2>
<p>Each phase ends with a review, often called a tollgate, where the sponsor checks the outputs before
agreeing to move on. The <a href="/tools/dmaic-phase-review-checklist.html">phase review checklist</a> has
the questions for each one. The tracker above warns you if the project has moved to a later phase with
outputs still open behind it.</p>

<h2>Six Sigma and lean</h2>
<p>Six Sigma aims to reduce variation and defects; lean aims to remove waste and improve flow. Most
organizations now run them together, and DMAIC is used for both. Lean tools such as the
<a href="/tools/eight-wastes-waste-walk.html">waste walk</a> and <a href="/tools/kaizen-pdca-planner.html">kaizen
events</a> appear inside the phases rather than as a separate method.</p>

<h2>DMAIC and PDCA</h2>
<p>Plan-Do-Check-Act is the older, shorter improvement cycle. DMAIC can be read as a more structured PDCA:
Define, Measure and Analyze are a thorough Plan; Improve is Do and Check; Control is Act. PDCA still has a
place inside Improve, for piloting a change.</p>

<h2>On the Yellow Belt exam</h2>
<p>Six Sigma foundations and principles is topic I.A of the 2022 CSSYB Body of Knowledge. Expect to be
asked which phase an activity belongs to, and what a phase must produce before the project moves on.</p>
"""),

dict(slug="eight-wastes-waste-walk", name="Eight wastes waste walk", covers="CSSYB I.B, IV.A.1",
title="The 8 Wastes of Lean (DOWNTIME) — Free Waste Walk Tool | SC Quality Guild",
desc="Free lean waste walk tool. The eight wastes (DOWNTIME) explained, then record what you see on the floor, classify each observation, estimate the time lost and see which waste is biggest.",
h1="Eight wastes waste walk",
lede="The eight wastes of lean, then a sheet to record what you see on a walk through the area, total the time lost and find the biggest waste.",
content="""
<h2>What lean means by waste</h2>
<p>Lean divides the work in a process into what adds value (something the customer would pay for, done
right the first time) and what does not. Most of what does not is waste, and lean names eight kinds. The
first letters spell <b>DOWNTIME</b>: defects, overproduction, waiting, non-utilized talent,
transportation, inventory, motion and extra-processing.</p>
<p>The original Toyota list had seven. Non-utilized talent was added later, and it is the one most
often missed on a walk because it cannot be seen. Ask people what slows them down and what they would
change.</p>

<h2>Some work adds no value but is still needed</h2>
<p>Inspection, regulatory paperwork and some testing add nothing the customer sees, but cannot simply be
stopped. Lean calls this <b>necessary non-value-added</b> work: reduce it, but do not remove it without
checking why it exists.</p>

<h2>How to walk</h2>
<ul>
  <li><b>Go to where the work is done</b> and watch it, rather than reviewing it in a meeting room.</li>
  <li><b>Write what you see, not what you conclude.</b> "Operator walks 20 m to the crib" is an
  observation. "Poor layout" is a conclusion.</li>
  <li><b>Estimate the cost.</b> A rough number of hours a week is enough to rank the wastes. The tool
  turns hours into dollars if you give it a labor rate.</li>
  <li><b>Take the people who do the work with you.</b> They know where the waste is, and they will own the
  fixes.</li>
</ul>

<h2>Overproduction is the worst</h2>
<p>Lean treats overproduction as the most harmful waste because it creates others: the extra parts need
storing (inventory), moving (transportation) and finding (motion), and defects in them are found late.</p>

<h2>On the Yellow Belt exam</h2>
<p>Lean foundations and principles is topic I.B of the 2022 CSSYB Body of Knowledge, and lean tools are
IV.A.1. Expect to be given a situation and asked which of the wastes it shows.</p>
"""),

dict(slug="six-sigma-roles-raci", name="Six Sigma roles and RACI", covers="CSSYB I.C",
title="Six Sigma Roles and Responsibilities — Free RACI Chart Builder | SC Quality Guild",
desc="Free RACI chart for Six Sigma projects. Executive, champion, process owner and every belt against your project's activities, with checks for missing or doubled accountability.",
h1="Six Sigma roles and RACI",
lede="Who does what on a Six Sigma project, from the executive to the Yellow Belt, laid out as a RACI chart with checks on the accountability.",
content="""
<h2>The roles</h2>
<ul>
  <li><b>Executive leadership</b> sets the direction, chooses where improvement effort goes and removes
  barriers that only they can.</li>
  <li><b>Champion or sponsor</b> owns the project for the business: approves the charter, provides
  resources, clears obstacles and signs off each phase review.</li>
  <li><b>Process owner</b> runs the process day to day and owns the result after the project ends. The
  control plan is handed to them.</li>
  <li><b>Master Black Belt</b> coaches Black and Green Belts, teaches, and advises on method and
  statistics.</li>
  <li><b>Black Belt</b> leads larger, cross-functional projects full time or close to it, and mentors
  Green Belts.</li>
  <li><b>Green Belt</b> leads smaller projects alongside a regular job, or supports a Black Belt's
  project.</li>
  <li><b>Yellow Belt</b> is a team member who knows the basics: collects data, takes part in analysis and
  helps put changes in place, usually in their own area.</li>
</ul>
<p>Organizations vary. Some have no Master Black Belts; some use the champion and sponsor as two roles.
The chart lets you leave any role blank.</p>

<h2>RACI</h2>
<p>A RACI chart lists activities down the side and roles across the top. Each cell says how that role is
involved: <b>R</b>esponsible (does the work), <b>A</b>ccountable (owns the outcome and signs it off),
<b>C</b>onsulted (asked for input before) or <b>I</b>nformed (told after).</p>
<p>The rule that matters most: <b>exactly one A per row</b>. Two accountable roles means each can assume
the other is handling it. No accountable role means nobody is. The tool flags both.</p>

<h2>On the Yellow Belt exam</h2>
<p>Six Sigma roles and responsibilities is topic I.C of the 2022 CSSYB Body of Knowledge. Expect to be
asked which role does a described task, and what a Yellow Belt is typically expected to do.</p>
"""),

dict(slug="team-development-stages", name="Team development stages", covers="CSSYB I.D.1, I.D.2",
title="Stages of Team Development (Forming, Storming, Norming, Performing) — Free Self-Check | SC Quality Guild",
desc="Free team development self-check. Sixteen statements about how your team behaves, scored against forming, storming, norming and performing, with what a leader should do at each stage.",
h1="Team development stages",
lede="Sixteen statements about how your team behaves now, scored against the four stages, with what helps the team at the stage it is in.",
content="""
<h2>The four stages</h2>
<p>The model most quality courses use comes from Bruce Tuckman (1965). Teams tend to pass through four
stages:</p>
<ul>
  <li><b>Forming:</b> polite, unsure of purpose and roles, dependent on the leader.</li>
  <li><b>Storming:</b> disagreement over approach, roles and authority. Uncomfortable and normal.</li>
  <li><b>Norming:</b> the team agrees how it works, and starts to trust and help each other.</li>
  <li><b>Performing:</b> the team gets on with the work and solves its own problems.</li>
</ul>
<p>A fifth stage, <b>adjourning</b>, was added later for when the team disbands. For a project team,
it is the handover and closure.</p>

<h2>Stages are not one-way</h2>
<p>A new member, a change of scope or a missed deadline can send a performing team back to storming. Treat
the result as a description of today, not a grade. The most useful way to use this tool is to have every
member answer separately, then talk about where the answers differ.</p>

<h2>What the leader does changes</h2>
<p>The leader directs most in forming, mediates and clarifies in storming, steps back in norming and
delegates in performing. Leading a forming team as if it were performing leaves it lost; leading a
performing team as if it were forming frustrates it.</p>

<h2>Types of team</h2>
<p>The Yellow Belt Body of Knowledge also asks about team types. A <b>process improvement team</b> works
on one process and disbands. A <b>cross-functional team</b> draws from several departments. A
<b>self-directed or work group team</b> manages its own day-to-day work. A <b>special project
team</b> is assembled for one purpose. A <b>virtual team</b> works mainly remotely, which makes the
storming stage easier to hide and harder to resolve.</p>

<h2>On the Yellow Belt exam</h2>
<p>Types of teams (I.D.1) and stages of team development (I.D.2) are in the 2022 CSSYB Body of Knowledge.
Expect to identify a stage from a described behavior, and the type of team from a described set-up.</p>
"""),

dict(slug="multivoting-nominal-group-technique", name="Multivoting and NGT", covers="CSSYB I.D.3",
title="Multivoting and Nominal Group Technique — Free Team Decision Tool | SC Quality Guild",
desc="Free multivoting and nominal group technique tool. Enter the options and the people, record votes or ranks, and get the totals ranked, with checks for over-voting, ties and narrow support.",
h1="Multivoting and nominal group technique",
lede="Turn a brainstormed list into a ranked shortlist the team agrees on, by votes or by ranks, with the totals worked out for you.",
content="""
<h2>Why not just discuss it?</h2>
<p>Open discussion favors whoever speaks first, loudest or with the most seniority. Both of these
techniques give every member an equal, structured say, and turn a long list into a short one quickly.</p>

<h2>Multivoting</h2>
<p>Each person gets a fixed number of votes, commonly about a third of the number of options, and spreads
them across the list. The options with the most votes go forward. It is fast, and it works well for
narrowing a long brainstorm. Run it again on the shortlist if the top few are close.</p>

<h2>Nominal group technique</h2>
<p>NGT is more structured. Members first write their ideas silently and independently, then share them in
turn without debate, then clarify, and finally rank them privately. Each person gives their top choice the
highest number of points. The points are totaled. The silent start is what makes it "nominal": people
work as a group in name only until the ideas are all out, so nobody's ideas are crowded out.</p>

<h2>Reading the result</h2>
<p>The tool shows each option's total and how many people chose it. An option with a high total from only
one or two enthusiasts is weaker than one with a slightly lower total spread across the whole team. Ties at
the top, and a winner with narrow support, are both flagged.</p>
<p>Neither technique replaces data. Use them to choose which cause to verify first, not to decide which
cause is real.</p>

<h2>On the Yellow Belt exam</h2>
<p>Team decision-making tools are topic I.D.3 of the 2022 CSSYB Body of Knowledge. Expect to tell
multivoting from nominal group technique, and to recognize when each suits.</p>
"""),

dict(slug="voc-ctq-tree", name="VOC to CTQ tree", covers="CSSYB II.A.1, CQE V.B.2, CSSBB IV.D.2, CQPA II.D.1",
title="Voice of the Customer to CTQ Tree — Free Online Tool | SC Quality Guild",
desc="Free VOC to CTQ tree builder and tree diagram maker. Turn customer comments into measurable CTQs with targets, or break any goal into means and tasks.",
h1="Voice of the customer to CTQ tree",
lede="From what the customer said, to what they need, to a characteristic you can measure with a target, drawn as a tree and checked for vague CTQs. Switch to a generic tree diagram to break any goal into means and tasks.",
content="""
<h2>From words to numbers</h2>
<p>Customers describe what they want in their own words: "it leaks", "you're always late", "it's hard to
fit". The voice of the customer (VOC) is those words, collected from complaints, interviews, surveys,
returns and site visits. None of them can be measured as they stand. A CTQ tree converts them, one step at
a time:</p>
<ul>
  <li><b>Need:</b> what the customer wants, in a few words. "The pump does not leak."</li>
  <li><b>Driver:</b> what decides whether the need is met. "Seal integrity at installation."</li>
  <li><b>CTQ:</b> a measurable characteristic, critical to quality, with a target or limit. "Leak rate
  at 2.5 bar over 30 s: no detectable leak."</li>
</ul>
<p>A CTQ without a number is still a need. The tool flags CTQs with no numeric target, and CTQs that
still use words like "good", "fast" or "reliable".</p>

<h2>The Kano model</h2>
<p>Noriaki Kano's model sorts needs into three main kinds (the full model also has indifferent and reverse qualities). <b>Basic (must-be)</b> needs are taken for granted:
meeting them earns nothing, missing them causes dissatisfaction. <b>Performance</b> needs give more
satisfaction the better they are met. <b>Delighters</b> are unexpected, and pleasing when present.</p>
<p>Basic needs are the ones customers rarely mention until something goes wrong, so they are
under-represented in surveys. Delighters become basic over time, as customers get used to them.</p>

<h2>The generic tree diagram</h2>
<p>A CTQ tree is one kind of <b>tree diagram</b>, one of the seven management and planning tools. Choose
"Generic tree diagram" at the top to build the general form: a goal on the left, the means of reaching it to
the right, finer means after that, and finally tasks that someone can actually do, each with an owner and a
date. Moving right answers "how?"; moving left answers "why?". The checks flag branches that stop short of the
task level, a means with only one branch under it (ask "how else?"), and tasks with nobody named. The CTQ
tree and the generic tree are saved together, so switching between them loses nothing.</p>

<h2>On the exam</h2>
<p>Voice of the customer is topic II.A.1 of the 2022 CSSYB Body of Knowledge: expect to place a customer
statement on the CTQ tree, and to classify a need with the Kano model. Tree diagrams are among the quality
management and planning tools in CQE V.B.2, CSSBB IV.D.2 and CQPA II.D.1; expect to pick the tree diagram
for a "break this goal down into actions" scenario and to tell it apart from the affinity diagram (which
groups ideas) and the interrelationship digraph (which maps cause and effect).</p>
"""),

dict(slug="project-selection-matrix", name="Project selection matrix", covers="CSSYB II.A.2",
title="Six Sigma Project Selection Matrix — Free Weighted Scoring Tool | SC Quality Guild",
desc="Free project selection matrix. Weight your criteria, score each candidate project, and get a ranked list, with criteria such as cost and effort counted against a project.",
h1="Project selection matrix",
lede="Weight the criteria that matter, score each candidate project against them, and see the ranked result, with cost and effort counting against.",
content="""
<h2>Why a matrix</h2>
<p>Most organizations have more improvement ideas than people to work on them. Choosing by whoever argues
hardest, or whichever problem is loudest this week, tends to produce projects that are too big, too
vague or not important to the business. A weighted matrix makes the choice explicit: everyone can see the
criteria, the weights and the scores, and can argue about those instead.</p>

<h2>Choosing the criteria</h2>
<p>Common criteria are customer impact, financial benefit, alignment with business goals, effort and cost,
time to result, risk, and whether data exist. Keep it to four to six. Agree them with the sponsor
<b>before</b> scoring, or the criteria will be chosen to favor the project someone already wants.</p>
<p>Some criteria are better when high (savings) and some worse (cost, effort, risk). Mark the "worse" ones
and score the raw amount; the matrix reverses them so a high-effort project loses points.</p>

<h2>Reading the result</h2>
<p>The weighted score is shown as a percentage of the maximum possible. Treat small gaps as ties: the
scores are judgments on a 1 to 5 scale, and a few points either way is inside their precision. Try
changing a weight: if the winner changes, the decision depends on that weight, and that is worth
discussing.</p>

<h2>What makes a good Six Sigma project</h2>
<p>A clear, measurable problem with an unknown cause, a defined process, data available or obtainable, a
sponsor who cares, and a scope small enough to finish in a few months. A problem whose solution is
already known is not a project; it is a task.</p>

<h2>On the Yellow Belt exam</h2>
<p>Project selection is topic II.A.2 of the 2022 CSSYB Body of Knowledge.</p>
"""),

dict(slug="stakeholder-analysis", name="Stakeholder analysis", covers="CSSYB II.A.3",
title="Stakeholder Analysis Grid — Free Power-Interest Map | SC Quality Guild",
desc="Free stakeholder analysis tool. Score each stakeholder's influence and interest, record current and needed support, and see them on a power-interest grid with an approach for each.",
h1="Stakeholder analysis",
lede="Who can affect the project, how much, and how far their support has to move, plotted on an influence and interest grid.",
content="""
<h2>Who counts as a stakeholder</h2>
<p>Anyone who can affect the project or is affected by it: the sponsor, the process owner, the people who
do the work, other departments that feed or receive the process, customers, suppliers, finance, and
anyone who can say no. The <a href="/tools/sipoc.html">SIPOC</a> is a good place to start the list.</p>

<h2>The grid</h2>
<p>Score each one for <b>influence</b> (how much they can help or block the project) and <b>interest</b>
(how much the project affects them). The grid gives four approaches:</p>
<ul>
  <li><b>Manage closely</b> (high influence, high interest): involve them, consult them, keep them on
  board.</li>
  <li><b>Keep satisfied</b> (high influence, low interest): enough contact to avoid surprises, without
  loading them with detail.</li>
  <li><b>Keep informed</b> (low influence, high interest): regular updates; they often know the process
  best.</li>
  <li><b>Monitor</b> (low on both): watch for changes.</li>
</ul>

<h2>Support now and support needed</h2>
<p>The gap between where a stakeholder is and where the project needs them is what the plan has to close.
Red dots on the map are two or more steps away. A high-influence stakeholder who is against the project
and has no action against their name is the single most common reason improvement projects stall.</p>
<p>Resistance is information. People who do the work and oppose a change often know something the team
does not; ask before trying to persuade.</p>

<h2>On the Yellow Belt exam</h2>
<p>Stakeholder analysis is topic II.A.3 of the 2022 CSSYB Body of Knowledge. Feed the result into the
<a href="/tools/communication-plan.html">communication plan</a>.</p>
"""),

dict(slug="communication-plan", name="Communication plan", covers="CSSYB II.B.2, I.D.4",
title="Project Communication Plan Template — Free Online | SC Quality Guild",
desc="Free project communication plan template. Audience, message, purpose, method, frequency and sender, with checks that two-way purposes use two-way methods and that something recurs.",
h1="Communication plan",
lede="Who hears what, how, how often and from whom, with checks that the method suits the purpose.",
content="""
<h2>What it is for</h2>
<p>Most projects that fail on people rather than on analysis fail because someone important was
surprised. A communication plan lists every audience, what they need to hear, how and how often, and who
sends it, so nobody is left out by accident. It is built from the
<a href="/tools/stakeholder-analysis.html">stakeholder analysis</a>: everyone in "manage closely" needs a
row.</p>

<h2>Match the method to the purpose</h2>
<p>Informing someone can be one-way: an email, a report, a board on the wall. Getting their input, a
decision or their support needs a way for them to answer back: a meeting, a conversation, a call. The tool
flags rows where the purpose is two-way and the method is not.</p>
<p>Building support is the hardest purpose and the one email does worst. Face to face is slower and works
better.</p>

<h2>Communication methods</h2>
<p>The Yellow Belt Body of Knowledge asks about communication methods in teams as well as in projects.
<b>Formal</b> communication goes through set channels (reports, reviews, minutes); <b>informal</b> goes
through conversation. <b>Verbal</b>, <b>written</b> and <b>visual</b> methods each suit different
messages: a visual board shows status at a glance; a written report records decisions; a conversation
deals with concerns.</p>

<h2>Close the loop</h2>
<p>The last column asks how you will know the message landed. A message sent is not a message understood.
For important ones, the answer should be something you can see: a question asked, a decision recorded, a
sign-off.</p>

<h2>On the Yellow Belt exam</h2>
<p>The communication plan is topic II.B.2 of the 2022 CSSYB Body of Knowledge, and communication methods
are I.D.4.</p>
"""),

dict(slug="wbs-gantt-chart", name="WBS and Gantt chart", covers="CSSYB II.B.3, II.B.4",
title="Work Breakdown Structure and Gantt Chart Maker — Free Online | SC Quality Guild",
desc="Free WBS and Gantt chart maker. Break the project into numbered tasks, link them by dependency, and see the Gantt chart, finish date and slippage against the due date, with working days if you want.",
h1="WBS and Gantt chart",
lede="Break the project into numbered pieces of work, link them in order, and see them laid out against time with the finish date checked against the deadline.",
content="""
<h2>Work breakdown structure</h2>
<p>A work breakdown structure (WBS) breaks a project into smaller pieces until each one is a task someone
can own and estimate. It is numbered like an outline: <b>1</b> is a phase, <b>1.1</b> and <b>1.2</b> are the
pieces of work inside it. For a DMAIC project the top level is usually the five phases. The rule of thumb
is that the pieces together make up the whole scope and nothing outside it.</p>

<h2>Gantt chart</h2>
<p>A Gantt chart, after Henry Gantt, draws each task as a bar against a timeline, so you can see what runs
when, what overlaps and when the project ends. Top-level rows show gold; their sub-tasks show navy.
<b>Milestones</b> (zero-length events, such as a phase review) show as diamonds.</p>

<h2>Dependencies</h2>
<p>Put a task's WBS number in another task's <b>After</b> column and the second task starts the day after
the first finishes. Change the first, and everything after it moves. The longest chain of dependent tasks
sets the finish date; this is the <b>critical path</b>. Speeding up a task that is not on it does not
bring the finish date forward.</p>
<p>Choose working days if your estimates are in working days; weekends are then skipped.</p>

<h2>Other project management tools</h2>
<p>Other project management tools you will meet include the <b>RACI chart</b>
(<a href="/tools/six-sigma-roles-raci.html">here</a>), the <b>risk register</b> and the <b>network or
PERT diagram</b>, which shows the dependencies as a flow rather than as bars. A Gantt chart with
dependencies drawn carries most of the same information as a network diagram.</p>

<h2>On the Yellow Belt exam</h2>
<p>Project planning (II.B.3) and project management tools (II.B.4) are in the 2022 CSSYB Body of
Knowledge.</p>
"""),

dict(slug="dmaic-phase-review-checklist", name="Phase review checklist", covers="CSSYB II.B.5",
title="DMAIC Tollgate Review Checklist — Free, Every Phase | SC Quality Guild",
desc="Free DMAIC phase review (tollgate) checklist. The questions a sponsor should ask at the end of Define, Measure, Analyze, Improve and Control, with a suggested go or not-yet decision.",
h1="Phase review checklist",
lede="The questions to ask at the end of each DMAIC phase before the project moves on, with a suggested decision from the answers.",
content="""
<h2>What a phase review is</h2>
<p>A phase review, or tollgate, is a short meeting at the end of each DMAIC phase where the team presents
what it found and the sponsor decides whether the project moves on. It protects the project from its most
common failures: an unclear problem in Define, untrustworthy data in Measure, unverified causes in
Analyze, unpiloted solutions in Improve and a gain that fades after Control.</p>

<h2>The possible decisions</h2>
<ul>
  <li><b>Go:</b> every question answered yes.</li>
  <li><b>Go, with actions:</b> the gaps are small, and each has an owner and a date.</li>
  <li><b>Not yet:</b> something essential is missing; close it and review again.</li>
  <li><b>Stop:</b> the problem turned out smaller than thought, the business has changed, or the cause
  is outside anyone's reach. Stopping a project at a tollgate is a success of the process, not a
  failure.</li>
</ul>
<p>The tool suggests a decision from the answers. The reviewer makes it.</p>

<h2>Answer with evidence</h2>
<p>A review where every answer is "yes" and nobody asks to see anything is a formality. Write the evidence
against each answer: the document, the data, the date. "Partly" with a clear note is more useful than a
hopeful "yes", and the tool asks for a note against every "partly" or "no".</p>

<h2>On the Yellow Belt exam</h2>
<p>Phase reviews are topic II.B.5 of the 2022 CSSYB Body of Knowledge. See the
<a href="/tools/dmaic-roadmap.html">DMAIC roadmap</a> for what each phase produces.</p>
"""),

dict(slug="msa-accuracy-precision", name="Accuracy and precision check", covers="CSSYB III.C.1",
title="Gauge Accuracy and Precision (Bias and Repeatability) Check — Free | SC Quality Guild",
desc="Free gauge bias and repeatability calculator. Measure a reference part several times and see whether the gauge is accurate and precise, with a t-test on the bias and both as a percentage of tolerance.",
h1="Accuracy and precision check",
lede="Measure a reference part several times and see whether the gauge is accurate (no bias) and precise (repeatable), with the five MSA terms side by side.",
content="""
<h2>Accuracy and precision are different</h2>
<p><b>Accuracy</b> is how close the average reading is to the true value. The difference is the
<b>bias</b>. <b>Precision</b> is how close repeat readings are to each other. On a target, accurate and
imprecise is a wide spread centered on the bullseye; precise and inaccurate is a tight group off to one
side. A gauge needs both.</p>

<h2>How the check works</h2>
<p>Measure one reference part, with a certified or known value, several times under normal conditions.
The tool reports:</p>
<ul>
  <li><b>Bias</b>, the average minus the reference, and whether it is statistically significant. A
  t-test compares the bias with what chance alone would produce given the scatter and the number of
  readings.</li>
  <li><b>Repeatability</b>, the standard deviation of the readings. Six times it covers most of the
  spread; the tool shows it as a percentage of the tolerance.</li>
</ul>
<p>The 10% and 30% guidelines for the spread come from gauge R&amp;R practice, where under 10% is
generally acceptable, 10 to 30% may be acceptable depending on the application, and over 30% is not. This
check covers one appraiser and one part, so it measures repeatability only. Use a
<a href="/calculators/gage-r-and-r.html">gauge R&amp;R</a> for the full picture.</p>

<h2>The other three terms</h2>
<p><b>Reproducibility</b> is the variation between appraisers. <b>Linearity</b> is whether the bias
changes across the range of the gauge. <b>Stability</b> is whether the bias drifts over time. A gauge can
be accurate at the middle of its range and biased at the ends, or accurate in January and biased by
June.</p>

<h2>On the Yellow Belt exam</h2>
<p>Measurement system analysis terms are topic III.C.1 of the 2022 CSSYB Body of Knowledge, and gauge
R&amp;R is III.C.2. Expect to match a described result to accuracy, precision, bias, linearity or
stability.</p>
"""),

dict(slug="distribution-explorer", name="Distribution explorer", covers="CSSYB IV.E.1, CQE VI.C.1, VI.C.2, CSSBB V.E.2, V.E.3, CQPA III.A.2",
title="Probability Distribution Calculator — Normal, Binomial, Poisson, Weibull, t, F | SC Quality Guild",
desc="Free distribution calculator: normal, binomial, Poisson, Weibull, lognormal, hypergeometric, t, chi-square, F and more. Shape, mean, variance, probabilities.",
h1="Distribution explorer",
lede="Pick one of twelve distributions, set its parameters and see its shape, its mean and variance, the probability of falling above, below or between any values you choose, and percentiles such as critical values.",
content="""
<h2>The basic five and when each applies</h2>
<ul>
  <li><b>Normal:</b> continuous measurements from a stable process, such as diameters, weights and
  fill volumes. Symmetric, described by its mean and standard deviation. About 68% of values fall within
  one standard deviation of the mean, 95% within two and 99.7% within three.</li>
  <li><b>Binomial:</b> the number of defective items in a sample of <i>n</i>, when each item has the same
  probability <i>p</i> of being defective, independently. Pass or fail data.</li>
  <li><b>Poisson:</b> the number of defects or events in a fixed amount of product, time or area, when
  they occur independently at an average rate λ. Defects per unit, calls per hour. Its mean and variance
  are both λ.</li>
  <li><b>Uniform:</b> every value between two limits equally likely.</li>
  <li><b>Exponential:</b> the time between independent random events, such as time between failures at a
  constant failure rate. Its mean and standard deviation are equal.</li>
</ul>

<h2>Defectives or defects?</h2>
<p>The question that decides between binomial and Poisson. A <b>defective</b> is a unit that fails; each
unit is counted once whatever is wrong with it, so binomial. A <b>defect</b> is a single nonconformity;
one unit can have several, so Poisson.</p>

<h2>Reading the probabilities</h2>
<p>Enter a value and the tool shades the probability of falling at or below it. Enter an upper value as
well and it shades the probability between the two. For a normal distribution it also gives the z-score:
how many standard deviations the value is from the mean, the number used with a standard normal table.</p>
<p>For whole-number distributions, "at or below 3" includes 3 and "at or above 3" includes 3; the two do not
add to 1. The tool shows both.</p>

<h2>More distributions for life data, small lots and sampling</h2>
<ul>
  <li><b>Weibull</b> (shape β, scale η): time or cycles to failure. β below 1 means a falling failure rate
  (early-life failures), β = 1 is the exponential, β above 1 a rising rate (wear-out). By life η, 63.2% have
  failed. P(X &gt; x) is the reliability at x.</li>
  <li><b>Lognormal</b> (μ and σ of ln X): a positive, right-skewed quantity whose logarithm is normal, such as
  repair times. Its mean is e<sup>μ + σ²/2</sup>, not e<sup>μ</sup>.</li>
  <li><b>Hypergeometric</b> (lot size N, D defectives in the lot, sample n): defectives in a sample drawn
  without replacement. When the sample is under about 10% of the lot, the binomial with p = D/N is close
  enough.</li>
  <li><b>Multinomial</b>: more than two outcomes per trial (grade A, grade B, scrap). Enter each category's
  probability and count; the tool gives the probability of exactly those counts, n!/(x₁!…x_k!) × p₁<sup>x₁</sup>…p_k<sup>x_k</sup>.</li>
</ul>

<h2>The sampling distributions: t, chi-square and F</h2>
<p>These three describe statistics rather than individual items. <b>Student's t</b> with ν degrees of freedom
is the mean standardized with s instead of σ; it has heavier tails than the normal and approaches it as ν
grows. <b>Chi-square</b> with k degrees of freedom is (n − 1)s²/σ² for normal data, and the statistic of the
goodness-of-fit and contingency-table tests. <b>F</b> with ν₁ and ν₂ degrees of freedom is the ratio of two
independent variance estimates, used to compare variances and in ANOVA. Enter a lower-tail probability in
the percentile box to get a critical value: 0.975 with t on 10 df gives 2.228, the value in a t table for a
two-sided test at α = 0.05.</p>

<h2>On the exam</h2>
<p>CSSYB IV.E.1 covers the basic distribution types. The CQE asks you to define and distinguish the
continuous distributions (normal, uniform, exponential, lognormal, Weibull, Student's t and F; VI.C.1) and the
discrete ones (binomial, Poisson, hypergeometric and multinomial; VI.C.2). The CSSBB asks you to use the
normal, Poisson, binomial, chi-square, t and F distributions (V.E.2) and to identify the hypergeometric,
exponential, lognormal and Weibull (V.E.3). CQPA III.A.2 lists normal, binomial, Poisson and Weibull. Expect
to choose the right distribution for a described situation, look up a critical value, and say how a skewed or
bimodal shape changes how the data should be read (a bimodal histogram often means two processes or two
populations are mixed).</p>
"""),

dict(slug="correlation-regression", name="Correlation and regression", covers="CSSYB IV.F.1, IV.F.2, CQE VI.E.1, VI.E.2, CSSBB VI.A.1, VI.A.2, CQPA III.F.1",
title="Correlation and Linear Regression Calculator With Scatter Plot — Free | SC Quality Guild",
desc="Free correlation and regression calculator: scatter plot, r and its confidence interval, fitted line, confidence and prediction intervals, residual plots.",
h1="Correlation and regression",
lede="Paste pairs of x and y values for a scatter diagram, the correlation coefficient and its confidence interval, the fitted line, confidence and prediction intervals for y, and residual plots to check the model.",
content="""
<h2>Correlation: do they move together?</h2>
<p>The correlation coefficient, <b>r</b>, measures how closely two variables follow a straight line. It
runs from −1 (a perfect line sloping down) through 0 (no straight-line relationship) to +1 (a perfect line
sloping up). It has no units, so it does not change if you measure in millimeters or inches.</p>
<p>Rough descriptions: above about 0.8 is strong, 0.5 to 0.8 moderate, 0.3 to 0.5 weak. These are
conventions, not rules. The tool also tests whether r is statistically significant, because with few
points a large r can appear by chance.</p>

<h2>Regression: the line itself</h2>
<p>Simple linear regression fits the straight line <b>y = b₀ + b₁x</b> that minimizes the squared vertical
distances from the points. The slope b₁ says how much y changes, on average, for each unit of x. <b>r²</b>
is the share of the variation in y that the line accounts for: r = 0.9 gives r² = 0.81, so 81% is
explained and 19% is not.</p>

<h2>Three cautions</h2>
<ul>
  <li><b>Correlation is not causation.</b> Ice-cream sales and drownings correlate because both rise in
  summer. To show that x drives y, change x on purpose and watch y.</li>
  <li><b>Do not extrapolate.</b> The line is only supported over the range of x in the data. The tool
  warns when you predict outside it.</li>
  <li><b>Look at the plot.</b> r measures straight-line relationships only. A clear curve can have r near
  zero, and one outlier can create or hide a correlation.</li>
</ul>

<h2>How sure is r? The Fisher z interval</h2>
<p>The sampling distribution of r is skewed, especially near ±1, so r ± a margin does not work. Fisher's
transformation z = ½ ln((1 + r)/(1 − r)) is close to normal with standard error 1/√(n − 3). The tool builds the
interval z ± z<sub>α/2</sub>/√(n − 3) and turns both ends back into r. If the interval for ρ includes 0, the
data are consistent with no linear relationship. With 14 pairs, even r = 0.98 leaves an interval about
0.05 wide.</p>

<h2>Confidence interval or prediction interval?</h2>
<p>At a given x, the <b>confidence interval</b> is for the <i>average</i> y of all items at that x:
ŷ ± t·s·√(1/n + (x − x̄)²/Sxx). The <b>prediction interval</b> is for <i>one</i> new item:
ŷ ± t·s·√(1 + 1/n + (x − x̄)²/Sxx). The extra 1 under the root is the item's own scatter around the line, so
the prediction interval is always wider and does not shrink to zero as n grows. Both are narrowest at x̄ and
flare toward the ends, as the bands on the scatter diagram show. The tool also gives the interval and the
t test for the slope, with t on n − 2 degrees of freedom.</p>

<h2>Residual analysis</h2>
<p>The intervals and tests assume a straight-line relationship with independent, normal errors of constant
variance. The residuals (y − ŷ) check that. On <b>residuals versus fitted values</b>, a curve means the
straight line is the wrong model and a funnel means the variance is not constant. On the <b>normal
probability plot</b>, points near the line support the normal assumption. The table gives each point's
standardized residual (beyond ±2 is worth a look, beyond ±3 is a likely outlier) and its leverage (how
far its x is from the rest, so how hard it pulls the line).</p>

<h2>On the exam</h2>
<p>Correlation (IV.F.1) and regression (IV.F.2) are in the 2022 CSSYB Body of Knowledge: read r from a
description, interpret r², and spot a causation claim the data cannot support. The CQE adds hypothesis tests
and prediction with regression (VI.E.1) and the confidence interval for the correlation coefficient
(VI.E.2). The CSSBB asks for the correlation coefficient and its confidence interval (VI.A.1), and for
estimation, the uncertainty in the estimate and a residuals analysis to validate the model (VI.A.2). CQPA
III.F.1 covers how regression and correlation models are used for estimation and prediction.</p>
"""),

dict(slug="kaizen-pdca-planner", name="Kaizen and PDCA planner", covers="CSSYB V.A.1, V.A.2",
title="Kaizen Event and PDCA Planner — Free Template | SC Quality Guild",
desc="Free kaizen event and PDCA planner. Plan a kaizen blitz, write a prediction, record what was done and what happened, compare result with prediction, and track the 30-day actions.",
h1="Kaizen event and PDCA planner",
lede="Plan a kaizen blitz as a Plan-Do-Check-Act cycle, with a prediction written down first and the result compared against it.",
content="""
<h2>Kaizen and kaizen blitz</h2>
<p><b>Kaizen</b> means continuous improvement through small, steady changes made by the people who do the
work. A <b>kaizen blitz</b> or kaizen event is a short, intense version: a small team, mostly from the
area, spends three to five days on one tightly scoped problem, makes the changes during the event and
leaves a list of follow-up actions to finish within about 30 days.</p>

<h2>Plan-Do-Check-Act</h2>
<p>PDCA, popularized by W. Edwards Deming from Walter Shewhart's work, is the cycle inside every kaizen:</p>
<ul>
  <li><b>Plan:</b> describe the problem, choose a change, and <b>predict what it will do</b>.</li>
  <li><b>Do:</b> make the change, ideally on a small scale, and record what was actually done.</li>
  <li><b>Check:</b> measure the result and compare it with the prediction.</li>
  <li><b>Act:</b> adopt the change and standardize it, adapt it and run another cycle, or abandon it.</li>
</ul>
<p>Deming later preferred "Study" to "Check" (PDSA), to stress learning from the gap rather than ticking
a box.</p>

<h2>Why the prediction matters</h2>
<p>If you do not write down what you expect before you start, any result can be read as success. The
prediction is what turns the cycle into a test of your understanding. When the result is close to it, the
team understood the process. When it is far off, in either direction, something about the process is not
as the team thought, and that is worth knowing before standardizing.</p>

<h2>Standardize or it drifts back</h2>
<p>A change that is adopted but never written into the work instruction or control plan tends to fade
within weeks. The tool flags an "adopt" decision with nothing recorded under how it will be
standardized.</p>

<h2>On the Yellow Belt exam</h2>
<p>Kaizen and kaizen blitz (V.A.1) and PDCA (V.A.2) are in the 2022 CSSYB Body of Knowledge.</p>
"""),

dict(slug="cost-benefit-payback", name="Cost-benefit and payback", covers="CSSYB V.A.3",
title="Cost-Benefit Analysis and Payback Period Calculator — Free | SC Quality Guild",
desc="Free cost-benefit and payback calculator. Compare improvement options on net benefit, payback period, ROI and net present value over the years you choose.",
h1="Cost-benefit and payback",
lede="Compare the options for an improvement on payback period, net benefit, return on investment and net present value.",
content="""
<h2>Four ways to compare</h2>
<ul>
  <li><b>Net annual benefit:</b> the yearly savings or added revenue, minus the yearly cost of keeping
  the change running.</li>
  <li><b>Payback period:</b> how long the net benefit takes to repay the one-time cost. Simple and
  widely used; it ignores everything after the payback point.</li>
  <li><b>Return on investment:</b> the total net benefit over the period minus the one-time cost, as a percentage of the one-time
  cost.</li>
  <li><b>Net present value:</b> each future year's net benefit discounted back to today's money, minus
  the up-front cost. A positive NPV means the option earns more than the discount rate.</li>
</ul>

<h2>Why discount?</h2>
<p>Money now is worth more than the same amount later, because it could be invested or used elsewhere in
the meantime. The discount rate expresses that. NPV at a rate of 8% treats $100 a year from now as worth
about $92.59 today. Finance will usually tell you which rate the company uses.</p>

<h2>Fastest is not always best</h2>
<p>A cheap fix may pay back in weeks and save less over three years than an expensive one that takes a year
to pay back. The tool shows both, and flags when the fastest payback and the highest NPV are different
options. Which matters more depends on the business: cash may be tight, or the product may have only a
short life left.</p>

<h2>Options that never pay back</h2>
<p>An option whose running cost exceeds its benefit never pays back, however small its up-front cost.
Adding inspection to catch defects is often in this category; removing the cause usually is not.</p>

<h2>Benefits finance will accept</h2>
<p>Agree how savings will be counted with finance in Define, not at the end. Hard savings (scrap, overtime,
warranty) are easier to confirm than soft ones (time freed up, avoided risk).</p>

<h2>On the Yellow Belt exam</h2>
<p>Cost-benefit analysis is topic V.A.3 of the 2022 CSSYB Body of Knowledge.</p>
"""),

dict(slug="work-instruction-sop", name="Work instruction and SOP", covers="CSSYB V.B.3, V.B.4",
title="Work Instruction and SOP Template With Document Control — Free | SC Quality Guild",
desc="Free work instruction and SOP template. Document number, revision, owner and approval, then steps with key points and reasons, and a revision history, with document-control checks.",
h1="Work instruction and SOP",
lede="Write the instruction step by step with the key point and reason for each, and keep it under control with a number, revision, approval and history.",
content="""
<h2>Procedure, SOP, work instruction</h2>
<p>The terms overlap and organizations use them differently. Broadly, a <b>procedure</b> describes a
process: who does what, in what order, across functions. A <b>standard operating procedure (SOP)</b> is a
detailed procedure for a routine activity. A <b>work instruction</b> is the most detailed: how one person
does one task at one station. This template suits all three.</p>

<h2>Steps, key points and reasons</h2>
<p>The step layout comes from the job breakdown used in Training Within Industry. Each <b>step</b> is one
action, starting with a verb. The <b>key point</b> is what makes the step right: the thing that, done
wrong, causes a defect or an injury, or the knack that makes it easier. The <b>reason</b> says why.
Reasons are what people remember and what stop them from taking shortcuts.</p>
<p>Not every step needs a key point. The steps where defects happen always do.</p>

<h2>Document control</h2>
<p>A controlled document carries a number, a revision, an owner, an approver, an effective date and a
history of what changed. Those are what let the person at the station trust that the copy in front of
them is current. Document control is how changes are reviewed, approved, released and communicated, and
how obsolete copies are removed. The tool flags a missing control field, a current revision with no
history entry, and a review date that has passed.</p>
<p>In the Control phase, updating the work instructions is how an improvement becomes the normal way of
working. If the change is not in the instruction, it will drift back.</p>

<h2>On the Yellow Belt exam</h2>
<p>Document control (V.B.3) and work instructions and SOPs (V.B.4) are in the 2022 CSSYB Body of
Knowledge.</p>
"""),
]
