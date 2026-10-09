"""Content for the /tools/ pages. Batch 3, set C: CMQ/OE tools.
'covers' is the CMQ/OE (2026 BoK) reference(s) the tool serves."""

PAGES3C = [
dict(slug="supplier-scorecard", name="Supplier scorecard", covers="CMQ/OE VI.A, VI.C, VI.D, VI.F",
title="Supplier Scorecard Template — Free Weighted QCDS Rating Tool | SC Quality Guild",
desc="Free weighted supplier scorecard. Score quality (PPM), delivery, total cost of ownership and service, classify suppliers and flag who needs a SCAR or exit plan.",
h1="Supplier scorecard",
lede="Weight quality, delivery, cost and service, convert each supplier's results to points, and get a 0 to 100 score, a classification and the follow-up each result calls for.",
content="""
<h2>Selection and approval come first</h2>
<p>A scorecard rates suppliers you have already approved. <b>Selection</b> decides who may bid and who wins:
capability, capacity, quality system, financial stability and risk, checked by survey, audit and sample
approval. <b>Approval</b> is the formal decision to place the supplier on
the approved supplier list, often with conditions. ISO 9001:2015 clause 8.4 asks the organization to set
criteria for the evaluation, selection, monitoring of performance and re-evaluation of external providers,
and to keep records of those evaluations.</p>

<h2>How the weighted score works</h2>
<p>Each criterion is converted to 0 to 100 points, multiplied by its weight, and summed. Typical metrics:</p>
<ul>
<li><b>Quality:</b> parts per million defective (PPM = defective units ÷ units received × 1,000,000), lot
acceptance rate, or the number of corrective action requests.</li>
<li><b>Delivery:</b> on-time in full percent, and lead time.</li>
<li><b>Cost:</b> <b>total cost of ownership</b> (TCO), meaning purchase price plus freight, inspection,
inventory carrying cost, scrap, rework, expediting and administration.</li>
<li><b>Service:</b> responsiveness, technical support, documentation and change notification.</li>
</ul>
<p>A common trap is weights that let one criterion, usually price, decide the outcome. Another is a PPM
mistake: 0.1 percent defective is 1,000 PPM, not 100.</p>

<h2>Classification and what follows</h2>
<p>Classes such as Preferred, Approved, Conditional and Disqualify turn the score into a decision. Preferred
suppliers may earn <b>certification</b> (ship-to-stock, reduced or skip-lot inspection) after sustained
performance and a process audit. Conditional suppliers get a supplier corrective action request and closer
monitoring. A supplier below the last threshold needs an <b>exit strategy</b>: qualify an alternate,
protect supply with safety stock, and plan the transfer of tooling, records and open orders before you
announce it.</p>

<h2>Partnerships and alliances</h2>
<p>A partnership or alliance means fewer suppliers, longer agreements, shared data and joint improvement work.
Deming's fourth point, to end the practice of awarding business on price tag alone and move toward a
single supplier for any one item, is the classic statement of that idea.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to calculate a weighted score or a PPM figure, to choose the right metric for a quality, delivery
or cost goal, and to pick the next step for a supplier whose performance has slipped.</p>
"""),
dict(slug="qfd-house-of-quality", name="QFD house of quality", covers="CMQ/OE V.B.1",
title="QFD House of Quality Template — Free Online Matrix Builder | SC Quality Guild",
desc="Free QFD house of quality builder. Weight customer needs, rate 9/3/1 relationships to technical characteristics, add a correlation roof and rank the hows.",
h1="QFD house of quality",
lede="Turn weighted customer requirements into ranked technical priorities with a 9 / 3 / 1 relationship matrix, an optional correlation roof and a competitive comparison.",
content="""
<h2>What QFD does</h2>
<p><b>Quality function deployment</b> (QFD) translates the voice of the customer into the technical
language of the organization, so that design and process decisions can be traced back to what customers
said they need. It was developed in Japan in the late 1960s and is associated with Yoji Akao. The first
and best-known matrix is the <b>house of quality</b>; further matrices can deploy the priorities down to
parts, processes and controls.</p>

<h2>The rooms of the house</h2>
<ul>
<li><b>Customer requirements</b> (the whats), in the customer's words, each with an importance rating
gathered from customers.</li>
<li><b>Technical characteristics</b> (the hows): measurable features the organization controls, each with
a direction of improvement.</li>
<li><b>Relationship matrix</b>: how strongly each how affects each what, scored 9 (strong), 3 (medium) or
1 (weak).</li>
<li><b>Correlation roof</b>: whether improving one how helps or hurts another.</li>
<li><b>Competitive assessment</b>: how customers rate you and competitors on each what.</li>
<li><b>Basement</b>: technical importance, targets and, in fuller versions, technical benchmarks.</li>
</ul>

<h2>How to read the result</h2>
<p>Absolute technical importance for each how is the sum of customer importance × relationship strength
down its column. Relative importance is that figure as a percent of the total. The hows at the top of the
ranking are where targets and design effort matter most. An empty row means a customer need nothing in the
design addresses; a row with only weak links is a need at risk. An empty column is a characteristic no
customer asked for, which is either a missing requirement or wasted effort. A negative correlation in the
roof is a trade-off the team must resolve by design rather than by compromise.</p>

<h2>Where it fits with VOC and Kano</h2>
<p>QFD is only as good as the requirements that go in. Collect them through interviews, surveys,
complaints and observation, and use the <b>Kano model</b> to sort them: basic (must-be) needs cause
dissatisfaction when missing but earn little credit when met, performance needs scale with how well they
are met, and delighters surprise. Customers rarely mention basic needs, so a house built only from what
customers said can miss them.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to name the parts of the house, compute a technical importance from a small matrix, and
interpret an empty row, an empty column or a negative roof correlation.</p>
"""),
dict(slug="customer-value-segmentation", name="Customer value and segmentation", covers="CMQ/OE V.A.3, V.B.2, V.B.4",
title="Customer Lifetime Value and Segmentation Calculator — Free | SC Quality Guild",
desc="Free customer segmentation and lifetime value calculator. Compare margin, cost to serve and retention by segment, value a retention gain and align service.",
h1="Customer value and segmentation",
lede="Compare customer segments on margin after cost to serve, lifetime value and the value of a retention gain, and get a service-alignment recommendation for each.",
content="""
<h2>Segmentation bases</h2>
<p>A segment is a group of customers with similar needs and similar value, so that one service approach
fits them all. Common bases are <b>demographic or firmographic</b> (industry, size, location),
<b>behavioral</b> (order pattern, channel, volume, loyalty), <b>needs-based</b> (what they value: speed,
price, customization, compliance) and <b>value-based</b> (profit and lifetime value). Good segments are
measurable, large enough to matter and different enough to need different treatment.</p>

<h2>Customer lifetime value</h2>
<p>This tool uses a common simplified formula: <b>CLV = m × r ÷ (1 + d − r)</b>, where m is the annual
margin per customer after cost to serve, r the annual retention rate and d the discount rate. It assumes
margin and retention stay constant and that margin arrives at the end of each year the customer stays. It
leaves out acquisition cost and margin growth, so treat the result as a comparison between segments, not a
forecast. Customer equity is CLV times the number of customers.</p>
<p>Two traps: revenue is not value (a large customer with a high cost to serve can lose money), and a
segment average hides the spread inside it.</p>

<h2>The value of retention</h2>
<p>CLV rises faster than retention does, because the denominator (1 + d − r) shrinks as r grows. A few
points of retention are therefore worth the most where margin and retention are already high. The
often-quoted finding attributed to Frederick Reichheld and Bain &amp; Company, that a 5 percent increase in
retention can raise profits by 25 to 95 percent, came from a limited set of industries; use your own
numbers, as this tool does, rather than the headline range.</p>

<h2>Aligning service to segments</h2>
<ul>
<li><b>High value, satisfied:</b> protect and grow with account management and priority capacity.</li>
<li><b>High value, dissatisfied:</b> a retention risk to fix first.</li>
<li><b>Cost to serve above margin:</b> reprice, set minimums or move to a lower-cost service model.</li>
<li><b>Low value, low growth:</b> efficient standard service and self-service.</li>
</ul>
<p>Diverse customers bring <b>conflicting requirements</b> and compete for the same capacity. Decide the
rules in advance (contracted service levels first, then by value, with a price for exceptions) instead of
letting each conflict be settled by whoever calls loudest.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect questions on choosing a segmentation basis, why retention is cheaper than acquisition, and how
to serve customers whose requirements conflict.</p>
"""),
dict(slug="lessons-learned-register", name="Lessons learned register", covers="CMQ/OE III.A.7, III.C.4",
title="Lessons Learned Register and Project Close-Out Template — Free | SC Quality Guild",
desc="Free lessons learned register and project close-out template. Record results against goal, lessons with owners, tacit knowledge and a knowledge-transfer plan.",
h1="Lessons learned register",
lede="Close out a project with results against goal, schedule and cost, a register of lessons with owners and recommendations, and a plan for moving the knowledge to the people who need it.",
content="""
<h2>Why lessons learned fail</h2>
<p>Most organizations hold a lessons-learned meeting at the end of a project. Fewer change anything because
of it. The usual pattern is a document filed on a shared drive, written in general terms, with no owner and
no change to how the next project is run. A lesson is learned only when behavior or the system changes: a
procedure, a template, a checklist, a training plan, or the way a team works.</p>

<h2>Tacit and explicit knowledge</h2>
<p><b>Explicit knowledge</b> can be written down and shared through documents, procedures and databases.
<b>Tacit knowledge</b> lives in people: judgment, skill, know-how and relationships that are hard to put
into words. Nonaka and Takeuchi's <b>SECI model</b> describes four ways knowledge moves:</p>
<ul>
<li><b>Socialization</b>, tacit to tacit: shared experience, mentoring, job shadowing.</li>
<li><b>Externalization</b>, tacit to explicit: writing down what people know, as a lessons register does.</li>
<li><b>Combination</b>, explicit to explicit: merging it into procedures, standards and databases.</li>
<li><b>Internalization</b>, explicit to tacit: learning by doing until the new way is a habit.</li>
</ul>
<p>The trap is to treat all knowledge as explicit. A procedure update will not transfer a senior
technician's judgment; mentoring or a community of practice will.</p>

<h2>Barriers to sharing</h2>
<p>Common barriers are a blame culture (people hide what went wrong), lack of time at project close, no
place to find past lessons, the belief that each project is unique, and knowledge treated as personal
power. Leaders lower them by asking for what went well as well as what went wrong, by keeping the review
about the process rather than the people, and by visibly acting on what is recorded.</p>

<h2>The close-out summary</h2>
<p>Project closure confirms that deliverables were accepted, compares results with the goal in the charter,
reports schedule and cost against plan, releases the team, hands remaining work to an owner, and archives
the project documentation. The lessons register belongs in that package and should be searchable by the
next project manager.</p>

<h2>On the CMQ/OE exam</h2>
<p>Expect to tell tacit from explicit knowledge, to match a SECI stage to an activity, and to choose the
best way to make a lesson stick.</p>
"""),
]
