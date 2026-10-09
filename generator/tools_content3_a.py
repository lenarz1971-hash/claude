"""Content for the /tools/ pages, batch 3A: CMQ/OE strategic planning tools."""

PAGES3A = [
dict(slug="strategic-plan-builder", name="Strategic plan builder", covers="CMQ/OE II.A, II.C.1, III.D.1",
title="Strategic Plan Template — Mission, Objectives and SMART Tactics | SC Quality Guild",
desc="Free strategic plan template. Write mission, vision, values and quality policy, link objectives to tactics, and check each tactic against SMART criteria.",
h1="Strategic plan builder",
lede="Write the mission, vision, values and quality policy, link each strategic objective to the tactics that deliver it, and check every tactic against SMART.",
content="""
<h2>The elements of a strategic plan</h2>
<p>A strategic plan connects why the organization exists to what people will do this year. The usual
elements, from the top down:</p>
<ul>
  <li><b>Mission:</b> the organization's purpose today. What it does, for whom, and why. It changes rarely.</li>
  <li><b>Vision:</b> the future state the organization wants to reach, usually stated for several years
  out. It should be specific enough to decide what is in and out of the strategy.</li>
  <li><b>Values:</b> the principles that guide behavior and decisions while pursuing the vision.</li>
  <li><b>Strategic objectives:</b> the few long-range results, typically three to five years out, that move
  the organization from where it is toward the vision.</li>
  <li><b>Tactical plans:</b> the shorter-term actions, each with an owner, a measure, a target and a date,
  that deliver an objective.</li>
</ul>
<p>Planning starts with an environmental scan (see the
<a href="/tools/swot-pestle-analysis.html">SWOT and PESTLE tool</a>).</p>

<h2>Strategy versus tactics</h2>
<p>Strategy decides what to achieve and where to compete; tactics decide how, by whom and by when. A
common exam trap is a "strategic objective" that is really a tactic ("install new software") or a tactic
with no objective behind it. The tool flags both: objectives with no tactics, and tactics that point to no
objective.</p>

<h2>SMART tactics</h2>
<p>SMART is the common test for an objective or tactic: <b>specific</b>, <b>measurable</b>,
<b>achievable</b>, <b>relevant</b> and <b>time-bound</b>. The tool derives four of the five from the row:
a described action with an owner, a measure with a numeric target, a link to a strategic objective, and a
due date. Achievability is a judgment, so you mark it.</p>

<h2>The quality policy</h2>
<p>Under ISO 9001:2015 clause 5.2.1, top management sets the quality policy. In summary, the policy has to
suit the organization's purpose and context and back its strategy, give a basis for setting quality
objectives, and commit the organization both to meeting the requirements that apply to it and to
improving continually.
The tool searches the policy text for those commitments. It is a word search, so read the result as a
prompt to check, not a verdict.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect questions that ask you to tell a mission from a vision, to pick the best-written objective, to
place an activity at the strategic or tactical level, and to identify what a quality policy must contain.</p>
"""),

dict(slug="swot-pestle-analysis", name="SWOT and PESTLE analysis", covers="CMQ/OE II.B.1, II.B.4, II.B.6",
title="SWOT and PESTLE Analysis Template With TOWS Strategy Prompts | SC Quality Guild",
desc="Free SWOT and PESTLE template. Score external factors by impact and likelihood, see a ranked 2x2 SWOT, and turn it into SO, WO, ST and WT strategy options.",
h1="SWOT and PESTLE analysis",
lede="Scan the external environment with PESTLE, list internal strengths and weaknesses, see the ranked SWOT, and turn it into TOWS strategy options.",
content="""
<h2>Internal versus external</h2>
<p>SWOT sorts what strategy has to account for into four boxes. <b>Strengths</b> and <b>weaknesses</b> are
internal: the organization's own capabilities, resources, performance and culture, which it can change.
<b>Opportunities</b> and <b>threats</b> are external: conditions in the market and wider environment that it
cannot control, only respond to. The most common error, and a favorite exam distractor, is putting an
internal condition in the external boxes. "Our aging software" is a weakness. "Competitors adopting AI
scheduling" is a threat. A useful test: would the item still exist if your organization did not?</p>

<h2>PESTLE: scanning the outside</h2>
<p>PESTLE (also PESTEL; PEST is the older four-factor form) is a checklist for the environmental scan that
feeds the opportunities and threats: <b>political</b>, <b>economic</b>, <b>social</b>,
<b>technological</b>, <b>legal</b> and <b>environmental</b> factors. The 2026 CMQ/OE Body of Knowledge names
automation, autonomation, Quality 4.0, cloud computing, artificial intelligence and cybersecurity among
the technology topics a quality manager should understand. On the legal side, look for new laws, standards
and reporting obligations.</p>
<p>Scoring impact times likelihood (1 to 5 each) is a simple ranking aid, not a standard method.</p>

<h2>TOWS: from analysis to strategy</h2>
<p>The TOWS matrix (Weihrich, 1982) pairs the
quadrants to generate options:</p>
<ul>
  <li><b>SO:</b> use strengths to pursue opportunities.</li>
  <li><b>WO:</b> overcome weaknesses that stand between you and an opportunity.</li>
  <li><b>ST:</b> use strengths to reduce exposure to threats.</li>
  <li><b>WT:</b> defensive moves where you are weak and exposed; reduce, partner or exit.</li>
</ul>

<h2>How SWOT feeds strategic planning</h2>
<p>SWOT and PESTLE are inputs to strategy development, done before objectives are set and repeated on a
regular cycle. The chosen TOWS options become candidate strategic objectives, which are then deployed in
the <a href="/tools/strategic-plan-builder.html">strategic plan</a> or a
<a href="/tools/hoshin-x-matrix.html">hoshin X-matrix</a>. ISO 9001:2015 clause 4.1 asks for the same thing in other
words: determine the internal and external issues relevant to the organization's purpose and strategic
direction, and monitor and review them.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to classify items into the four quadrants, to name the PESTLE category for a factor, and to
recognize which TOWS strategy type fits a described move.</p>
"""),

dict(slug="hoshin-x-matrix", name="Hoshin X-matrix", covers="CMQ/OE II.C.2, II.C.4",
title="Hoshin Kanri X-Matrix Template — Free Policy Deployment Tool | SC Quality Guild",
desc="Free hoshin kanri X-matrix template. Link breakthrough and annual objectives, priorities, metrics and owners, then see the X-matrix drawn with its gaps.",
h1="Hoshin X-matrix",
lede="Link breakthrough objectives, annual objectives, improvement priorities, targets and owners, and see the plan drawn as an X-matrix with its gaps flagged.",
content="""
<h2>What hoshin planning is</h2>
<p>Hoshin kanri (often translated as policy deployment or strategy deployment) is a planning and execution
method developed in Japan from the 1960s, building on management by objectives and Deming's
Plan-Do-Check-Act cycle. Its aim is alignment: a small number of breakthrough objectives set by senior
leadership are translated, level by level, into the annual objectives, projects and measures that each
part of the organization works on. It separates two kinds of work: the few breakthrough changes managed
through the hoshin plan, and the day-to-day business managed through <b>daily management</b> with its own
routine measures.</p>

<h2>Catchball</h2>
<p>Hoshin is not a one-way cascade. In <b>catchball</b>, a proposed objective is passed to the next level
down, which considers what it would take to achieve, proposes the means and targets, and passes it back.
The exchange repeats until both levels agree the plan is achievable with the resources available. An exam answer that has leadership "assigning" targets without
discussion is describing a top-down cascade, not hoshin.</p>

<h2>Reading the X-matrix</h2>
<p>The X-matrix puts the whole plan on one page. Read it in this order:</p>
<ul>
  <li><b>South:</b> breakthrough objectives, three to five years out.</li>
  <li><b>West:</b> annual objectives, this year's step toward them.</li>
  <li><b>North:</b> top-level improvement priorities, the projects that deliver the annual objectives.</li>
  <li><b>East:</b> targets to improve, the metrics that show whether the priorities are working.</li>
  <li><b>Right:</b> the people or teams who lead or support each priority.</li>
</ul>
<p>The corner grids record the correlations between neighbors, usually as strong or weak. A row or
column with no marks is the finding: an annual objective that serves no breakthrough objective, a
priority with no metric, or an owner leading more than anyone could.</p>

<h2>PDCA on the plan itself</h2>
<p>The hoshin plan is run as a PDCA cycle. Plan is the X-matrix and catchball. Do is the work of the
priorities. Check is a regular review, typically monthly, of each metric against target, often on a
bowling chart (one row per metric, one column per month, green or red). Act is the countermeasure when a
metric is off: adjust the priority or its resources. A year-end reflection (<i>hansei</i>) starts the next cycle.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect questions on the purpose of catchball, the difference between hoshin and daily management, and
which part of the X-matrix holds a given item.</p>
"""),

dict(slug="balanced-scorecard", name="Balanced scorecard", covers="CMQ/OE II.C.3, III.D.3",
title="Balanced Scorecard Template — Four Perspectives and Strategy Map | SC Quality Guild",
desc="Free balanced scorecard template. Objectives and leading or lagging measures in the four Kaplan and Norton perspectives, status against target, strategy map.",
h1="Balanced scorecard",
lede="Set objectives and measures in the four perspectives, score actuals against targets, and see the scorecard and a cause-and-effect strategy map.",
content="""
<h2>The four perspectives</h2>
<p>Robert Kaplan and David Norton introduced the balanced scorecard in 1992 to stop organizations
managing on financial results alone. Financial measures report the past; the scorecard adds the
measures that drive future financial results. The four perspectives, each answering a question:</p>
<ul>
  <li><b>Financial:</b> to succeed financially, how should we appear to our shareholders or funders?</li>
  <li><b>Customer:</b> to achieve our vision, how should we appear to our customers?</li>
  <li><b>Internal business process:</b> to satisfy customers and shareholders, which processes must we
  excel at?</li>
  <li><b>Learning and growth:</b> to achieve our vision, how will we sustain our ability to change and
  improve? (people, skills, information systems, culture)</li>
</ul>
<p>Public sector and nonprofit organizations often put the customer or mission perspective at the top.</p>

<h2>Leading and lagging measures</h2>
<p>A <b>lagging</b> measure (an outcome measure) reports a result already achieved: revenue, margin,
churn, customer satisfaction. A <b>leading</b> measure (a performance driver) moves first and predicts the
outcome: training completed, defects caught before release, time to resolve a complaint. A good scorecard
pairs them. Lagging measures alone report problems too late to act on.</p>

<h2>Strategy maps: cause and effect</h2>
<p>Kaplan and Norton later added the strategy map, which draws the objectives from the bottom up as a
chain of hypotheses: better skills (learning and growth) improve processes, better processes win and
keep customers, and customers deliver the financial results. Each arrow is a claim that can be tested
with data. If the leading measure improves and the lagging one does not, revisit the strategy, not just the target.</p>

<h2>Linking measures to strategy</h2>
<p>A scorecard is not a list of every available metric. Each measure should trace to an objective, and
each objective to the strategy. Kaplan and Norton suggested roughly 20 to 25 measures across the four perspectives for a business unit. Give every measure a baseline, a target and an owner.</p>

<h2>Scorecards and dashboards</h2>
<p>A <b>scorecard</b> tracks progress on strategic objectives against
targets, usually monthly or quarterly. A <b>dashboard</b> monitors operational performance, often in near
real time, to support day-to-day control. On the CMQ/OE exam, expect to place a measure in the right
perspective, tell leading from lagging, and explain why the balanced scorecard is balanced.</p>
"""),
]
