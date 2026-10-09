"""Content for CMQ/OE tool pages, batch 3, part B: four tools.
'covers' is the CMQ/OE Body of Knowledge reference(s) the tool serves."""

PAGES3B = [
dict(slug="cost-of-quality", name="Cost of quality", covers="CMQ/OE IV.A.5",
title="Cost of Quality Calculator — Free PAF Model Template | SC Quality Guild",
desc="Free cost of quality calculator using the PAF model. Sort costs into prevention, appraisal, internal and external failure and see COQ as a percent of sales.",
h1="Cost of quality",
lede="Sort quality-related costs into the prevention, appraisal and failure categories, total them, and see where the money goes and what the profile says about the quality system.",
content="""
<h2>The PAF model</h2>
<p>The prevention-appraisal-failure model, associated with Armand Feigenbaum and used throughout Juran's
work, sorts every quality-related cost into four categories:</p>
<ul>
  <li><b>Prevention</b>: work that stops defects being made. Quality planning, training, design reviews,
  capability studies, error-proofing, supplier qualification and development.</li>
  <li><b>Appraisal</b>: work that finds defects by checking. Incoming, in-process and final inspection and
  test, calibration of measuring equipment, product audits.</li>
  <li><b>Internal failure</b>: defects found before the customer has the product. Scrap, rework,
  re-inspection and retest after a failure, downgrading, failure analysis, downtime caused by quality
  problems.</li>
  <li><b>External failure</b>: defects the customer found. Warranty, returns, complaint handling, field
  repair, recalls, penalties and lost goodwill.</li>
</ul>
<p>Prevention plus appraisal is the <b>cost of good quality</b>; the two failure categories are the
<b>cost of poor quality</b>.</p>

<h2>Categorizing items correctly</h2>
<p>The category depends on purpose, not on who does the work. Inspection is appraisal, but re-inspecting
a lot that already failed is part of that failure. A supplier audit that checks conformance is appraisal;
one that qualifies or develops a new supplier is closer to prevention. Training on the quality system is
prevention; training a new hire on a job is usually an operating cost, not a quality cost. Write the
rules down and apply them the same way every period, or the trend means nothing.</p>

<h2>Reading the result</h2>
<p>An immature profile is dominated by failure costs, with prevention a small slice. The classic
argument is that money moved into prevention reduces failure cost by more than it adds, so total COQ
falls. The older economic model put the lowest total cost short of perfect quality; the modern view is that
the optimum moves toward zero defects as prevention becomes cheaper and failures more expensive. Figures
such as 15 to 25 percent of sales are often quoted for the cost of poor quality, but they are estimates.
Measured COQ is usually understated, because hidden costs such as lost sales and engineering time are hard
to capture.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect questions that give a list of costs and ask for the category of an item or the total of a
category, and questions on why COQ is reported in dollars and as a percent of sales: so management sees
it in the language of the business.</p>
"""),

dict(slug="financial-analysis-npv-irr", name="NPV, IRR and payback", covers="CMQ/OE III.A.5",
title="NPV, IRR and Payback Calculator — Free Project Comparison | SC Quality Guild",
desc="Free NPV and IRR calculator for comparing projects. Enter outlay and yearly cash flows to get NPV, IRR, payback, discounted payback, ROI, PI, and an ROA check.",
h1="NPV, IRR and payback",
lede="Compare investment options on net present value, internal rate of return, payback, ROI and profitability index, with an NPV profile chart and checks on the usual traps.",
content="""
<h2>Time value of money</h2>
<p>A dollar received next year is worth less than a dollar today, because today's dollar could be
invested at the organization's cost of capital. Discounting converts each future cash flow to its present
value: divide by (1 + r) raised to the number of years. The <b>discount rate</b> is normally set by
finance as the cost of capital or a hurdle rate.</p>

<h2>The measures</h2>
<ul>
  <li><b>Net present value (NPV)</b>: the present value of all future cash flows minus the initial investment.
  Positive NPV means the project returns more than the discount rate.</li>
  <li><b>Internal rate of return (IRR)</b>: the discount rate at which NPV is zero. Accept if IRR is above
  the hurdle rate. It has no formula; it is found by trial, as this tool does.</li>
  <li><b>Payback</b>: years until cumulative cash flow repays the investment. <b>Discounted payback</b>
  does the same with discounted cash flows, so it is never shorter, and longer whenever the discount rate is above zero.</li>
  <li><b>ROI</b>: total net gain divided by the investment. <b>Profitability index</b>: present value of
  future cash flows divided by the investment; above 1.0 means NPV is positive.</li>
  <li><b>Return on assets (ROA)</b>: net income divided by total assets, a measure of how well the whole
  organization uses what it owns.</li>
</ul>

<h2>When the measures disagree</h2>
<p>NPV and IRR can rank projects differently when projects differ in size or in the timing of their cash
flows. A small project with fast returns can have the higher IRR while a larger one adds more dollars of
value. For <b>mutually exclusive</b> projects, choose by NPV: it measures value at the real cost of
capital, while IRR implicitly assumes reinvestment at the IRR. When cash flows change sign more than once,
for example a removal cost at the end, there can be more than one IRR, and IRR should not be used.
Payback and simple ROI ignore the time value of money and are best treated as risk and liquidity checks.</p>

<h2>Budgets and variance</h2>
<p>Once a project is funded, its budget becomes the baseline. A variance is actual minus budget; it is
favorable when costs come in under or benefits over. Investigate the large and the persistent variances,
not every one.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to calculate a payback period or simple NPV by hand, to pick the project to fund from a table of
NPV, IRR and payback, and to explain why NPV is preferred when they conflict.</p>
"""),

dict(slug="constraints-oee", name="Constraints and OEE", covers="CMQ/OE IV.B.4, IV.B.3",
title="Theory of Constraints and OEE Calculator — Free Template | SC Quality Guild",
desc="Free theory of constraints and OEE calculator. Find the bottleneck from step capacities and demand, then calculate availability, performance, quality and OEE.",
h1="Constraints and OEE",
lede="Find the constraint in a process from each step's capacity and the demand, see what limits throughput, and calculate OEE for the constraint or any machine.",
content="""
<h2>Theory of constraints</h2>
<p>Eliyahu Goldratt's theory of constraints (TOC) starts from the chain analogy: a chain is only as
strong as its weakest link. Every system has at least one constraint that limits its output. An hour lost
at the constraint is an hour lost for the whole system; an hour saved at a non-constraint is a mirage.
Improving steps that are not the constraint produces <b>local optima</b>: better local numbers, more
inventory and no more throughput.</p>
<p>Constraints can be <b>physical</b> (a machine, a skill, a space), <b>market</b> (demand is below
capacity) or <b>policy</b> (batch sizes, rules, measures that drive the wrong behavior). Policy constraints
are common and often the cheapest to remove.</p>

<h2>The five focusing steps and TOC measures</h2>
<ul>
  <li><b>Identify</b> the constraint, <b>exploit</b> it (get the most from it as it is),
  <b>subordinate</b> everything else to it, <b>elevate</b> it (add capacity), then <b>repeat</b>.</li>
  <li><b>Throughput (T)</b>: the rate the system generates money through sales. <b>Inventory (I)</b>:
  money tied up in things intended for sale. <b>Operating expense (OE)</b>: money spent turning
  inventory into throughput. The aim is to raise T while reducing I and OE.</li>
  <li><b>Drum-buffer-rope</b>: the constraint sets the pace (drum), a time buffer protects it from
  upstream disruption (buffer), and material release is tied to its pace (rope).</li>
</ul>

<h2>Overall equipment effectiveness</h2>
<p>OEE combines three losses: <b>availability</b> = run time / planned production time;
<b>performance</b> = (ideal cycle time × total count) / run time; <b>quality</b> = good count / total count.
OEE is their product. The six big losses map onto them: breakdowns and setups (availability), minor stops
and reduced speed (performance), and defects and start-up losses (quality). An OEE of 85 percent is often
cited as world class, a figure attributed to Seiichi Nakajima's work on total productive maintenance; it
is a reference, not a standard.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to find the bottleneck from a set of capacities, to state system output, to name the focusing
step that applies, and to compute OEE from shift data. A common trap is improving the busiest-looking
step rather than the one with the least capacity.</p>
"""),

dict(slug="management-review", name="Management review", covers="CMQ/OE III.D.3, III.E.1",
title="Management Review Template — ISO 9001 Clause 9.3 Record | SC Quality Guild",
desc="Free ISO 9001 management review template. Record the 9.3.2 inputs, a QMS scorecard and 9.3.3 output actions, with checks for gaps and overdue items.",
h1="Management review",
lede="A management review record built around ISO 9001:2015 clause 9.3, with the required inputs, an effectiveness scorecard, output actions and checks for what an auditor would find missing.",
content="""
<h2>What management review is for</h2>
<p>Management review is top management's planned, periodic look at whether the quality management system
is still suitable, adequate, effective and aligned with the organization's strategic direction. It is
where data from the whole system meets the people who can change priorities and assign resources. A
review that only reads reports and records "noted" has missed its purpose.</p>

<h2>Inputs and outputs</h2>
<p>ISO 9001:2015 clause 9.3.2 lists what the review must consider. In summary: the status of actions from
earlier reviews; changes in internal and external issues; performance and effectiveness information,
including trends, on customer satisfaction and feedback from relevant interested parties, quality objectives, process performance and product
conformity, nonconformities and corrective actions, monitoring and measurement results, audit results and
external providers; adequacy of resources; how well actions on risks and opportunities worked; and
opportunities for improvement. Clause 9.3.3 requires outputs in the form of decisions and actions on
improvement opportunities, any need to change the QMS, and resource needs, and requires the results to be
kept as documented information. Check clause numbers against the edition of ISO 9001 your organization
is certified to, since the standard is revised from time to time.</p>

<h2>Judging QMS effectiveness</h2>
<ul>
  <li><b>Audit results</b>: the number and severity of findings, and whether the same findings recur.</li>
  <li><b>Customer measures</b>: complaints, returns, warranty cost, recalls and survey scores.</li>
  <li><b>Objectives and scorecards</b>: targets met, and the trend, not only the latest point.</li>
  <li><b>Corrective action</b>: how fast actions close and whether problems come back.</li>
</ul>

<h2>Common weaknesses</h2>
<ul>
  <li>Inputs presented as a list of topics with no data or trend.</li>
  <li>Outputs with no owner or date, or no outputs at all.</li>
  <li>Prior actions that roll forward review after review.</li>
  <li>Top management absent, so decisions on resources cannot be made.</li>
</ul>

<h2>On the CMQ/OE exam</h2>
<p>Expect questions on who conducts the review, which items are inputs and which are outputs, and which
measures best show that the QMS is effective.</p>
"""),
]
