# Supplier strategy documents, batch b11 (Oct 2026). Make/buy analysis,
# supplier quality agreement checklist and supplier onboarding checklist.
# CSQP sections I.C, I.D and VI.A.
PAGES6B11 = [
dict(slug="make-buy-analysis", name="Make/buy analysis",
covers="CSQP I.C.3, I.C.1",
title="Make or Buy Analysis with Break-Even Volume — Free Online | SC Quality Guild",
desc="Free make/buy analysis. Total cost of each option, break-even volume chart, capability and capacity, weighted scoring of strategic factors and a SWOT summary.",
h1="Make/buy analysis",
lede="Compare making a part yourself with buying it: the full cost of each option, the volume where they break even, capability and capacity on each side, the strategic factors, and a SWOT summary of the in-house option.",
content="""
<h2>What the tool is for</h2>
<p>A make/buy decision asks whether a part, assembly or service should be produced internally or bought from a supplier. It looks like a cost question, and the cost model is where most analyses start, but the decisions that go wrong usually go wrong on something else: capability that was assumed, capacity that was not there, or know-how that walked out of the door with the work. The tool puts the cost comparison next to capability, capacity and strategy so they are weighed together.</p>

<h2>The cost model</h2>
<p>Each cost element is entered once, as per unit, per year or one-time, under make, buy or both:</p>
<ul>
<li><b>Per unit:</b> material, labor and machine time, variable overhead, the purchase price, freight and duty, quality cost (inspection, scrap, returns) and a risk premium.</li>
<li><b>Per year:</b> fixed costs that exist only because of the option, such as a new cell's supervision and maintenance, or the audits and engineering time spent managing a supplier.</li>
<li><b>One-time:</b> equipment, tooling and qualification. These are spread evenly over the horizon you choose.</li>
</ul>
<p>The annual cost of each option at volume <i>V</i> is fixed cost plus cost per unit &times; <i>V</i>. Making usually has the higher fixed cost and the lower cost per unit, so the two lines cross at the <b>break-even volume</b>: (fixed cost to make &minus; fixed cost to buy) &divide; (unit cost to buy &minus; unit cost to make). Above it, the option with the lower unit cost wins. If the planned volume sits close to break-even, a forecast error can reverse the answer, and the tool says so.</p>
<p>Only <b>relevant</b> costs belong in the comparison: those that change with the decision. Plant overhead that is allocated to the part but stays whether you make it or not, and money already spent, are marked not relevant and left out. Including them is the classic make/buy error, and it makes buying look better than it is.</p>
<p>The <b>risk premium</b> is the expected cost of a disruption: the chance of it in a year times what it would cost. A single source on another continent carries a larger one than an internal cell. For time value of money, take the cash flows to the <a href="/tools/financial-analysis-npv-irr.html">NPV and IRR tool</a>.</p>

<h2>Capability, capacity and strategy</h2>
<p>The CSQP Body of Knowledge asks for internal and external capability analysis using historical performance. Compare Cpk on the key characteristic, defect history in ppm on similar parts, lead time, and the capacity each side can commit. Then score the strategic factors that cost leaves out:</p>
<ul>
<li><b>Core competence:</b> is this work part of what makes you competitive? Outsourcing a core skill can hollow it out.</li>
<li><b>Intellectual property:</b> a supplier who makes the part learns the process, and may sell it to a competitor.</li>
<li><b>Control:</b> how much direct control over quality and schedule does the product need?</li>
</ul>
<p>The weighted scoring works like the <a href="/tools/supplier-selection-matrix.html">supplier selection matrix</a>. When cost points one way and the scoring the other, the tool flags it, so the rationale has to explain the trade-off.</p>

<h2>The SWOT summary</h2>
<p>The SWOT looks at the in-house option: strengths and weaknesses of your own operation, and opportunities and threats outside it, such as demand, the supply market and technology. For a full SWOT and PESTLE of a business, use the <a href="/tools/swot-pestle-analysis.html">SWOT and PESTLE tool</a>.</p>
<p>Split volume is a common answer: make the base load and buy the peaks, which also gives a qualified second source. If you buy, the supplier still has to be selected, qualified and placed in the <a href="/tools/kraljic-portfolio-matrix.html">Kraljic portfolio</a>.</p>

<h2>On the exam</h2>
<p>Make/buy decisions are CSQP I.C.3: provide input using internal and external capability analysis, SWOT and historical performance. They sit under supply chain cost analysis (I.C), next to cost reduction (I.C.1). Expect to compute a break-even volume, pick out the relevant costs, and judge when a strategic factor should outweigh a cost advantage.</p>
"""),

dict(slug="supplier-quality-agreement-checklist", name="Supplier quality agreement checklist",
covers="CSQP I.D.1, I.D.2, I.D.3, I.D.4, II.A.3, V.A.3, VII.C.1, CMDA III.D.4",
title="Supplier Quality Agreement Checklist — Free Online | SC Quality Guild",
desc="Free supplier quality agreement checklist. 23 standard elements with clause references, a weighted completeness score, change notification terms and approvals.",
h1="Supplier quality agreement checklist",
lede="Review a supplier quality agreement against the elements it should contain. Record the clause for each, get a weighted completeness score, check the change notification terms, and track the approvals needed before it is signed.",
content="""
<h2>What a quality agreement is</h2>
<p>A purchase order covers price, quantity and delivery. A <b>supplier quality agreement</b> covers how quality will be assured: which specifications apply, who approves changes, what happens when a nonconforming part is found, which records are kept and for how long, and who may audit. It is usually a separate document that the purchase order refers to, signed by both parties and reviewed at set intervals. Regulated industries expect one; for a medical device manufacturer, ISO 13485 purchasing controls call for a written agreement that the supplier will notify changes before they are made.</p>

<h2>The elements</h2>
<p>The standard list in the tool covers what reviewers most often look for. The ones that cause the most trouble when they are vague:</p>
<ul>
<li><b>Change notification and approval.</b> Which changes need notice (material, process, equipment, site, sub-tier source), how much notice, and whether your approval is needed before a changed part ships.</li>
<li><b>Nonconforming product.</b> How fast the supplier must tell you about a suspect shipment, how containment works, and how deviations are requested and approved.</li>
<li><b>Corrective action.</b> Response times for containment, root cause and closure of a SCAR, usually in 8D format.</li>
<li><b>Sub-tier control.</b> Requirements must flow down to the supplier's own suppliers, or the agreement stops one level short of where many problems start.</li>
<li><b>Right of access.</b> Your right, and your regulator's, to audit the supplier's site and records.</li>
<li><b>Counterfeit prevention and traceability.</b> Critical in aerospace, defense and electronics, and for any product that may need a recall.</li>
</ul>

<h2>How the score works</h2>
<p>Each element is marked critical, important or standard. Critical elements count three times, important twice and standard once. An element covered fully earns full credit, partly earns half, and missing earns none. Elements marked not applicable, or not yet reviewed, are left out of the score. The score is the weighted credit divided by the weighted total.</p>
<p>A high score is not enough on its own: an agreement is <b>ready to sign</b> only when every critical element is fully covered, every element has been reviewed, and the score meets the threshold you set. A 95% agreement that is silent on change notification is not ready.</p>

<h2>Change notification terms</h2>
<p>The notice period has to be at least as long as it takes you to requalify the part: a new first article, a <a href="/tools/ppap-qualification-plan.html">PPAP</a> or a validation. The tool compares the two and flags the gap, and flags agreements that ask only for notice where your approval should be needed. For assessing a change once it is notified, use the <a href="/tools/engineering-change-impact-checklist.html">engineering change impact checklist</a>.</p>

<h2>Review and approval</h2>
<p>Quality agreements usually pass through several levels of review: supplier quality, engineering, purchasing, legal, and the supplier's own signatory. Finalization controls make sure the version signed is the version reviewed, that comments are resolved, and that the purchase order refers to the current revision. The approvals table records each one.</p>
<p>Once signed, performance against the agreement's metrics belongs on the <a href="/tools/supplier-scorecard.html">supplier scorecard</a>.</p>

<h2>On the exam</h2>
<p>Quality agreements are CSQP I.D.3 (analyze the elements, including other levels of approval and review). The same section covers terms and conditions (I.D.1), supplier agreements (I.D.2) and finalization controls (I.D.4). Change notification also appears under supplier communication (V.A.3) and confidentiality and organizational policies (VII.C.1), and counterfeit prevention under II.A.3. For CMDA, purchasing controls are III.D.4. Expect to pick the missing element from an agreement, or the clause that would have prevented a given escape.</p>
"""),

dict(slug="supplier-onboarding-checklist", name="Supplier onboarding checklist",
covers="CSQP VI.A, I.E, VI.C, IV.A.1, V.B.3",
title="Supplier Onboarding Checklist with Readiness Tracking — Free Online | SC Quality Guild",
desc="Free supplier onboarding checklist. Contacts, 19 standard items in six phases, gate items before first shipment, a communication plan and a readiness chart.",
h1="Supplier onboarding checklist",
lede="Plan and track a new supplier's orientation: contacts on both sides, the standard onboarding items with owners and due dates, the items that must be done before the first production shipment, and how you will keep in touch.",
content="""
<h2>What onboarding is for</h2>
<p>Selecting a supplier and approving its parts are not the same as the supplier understanding what you expect. Onboarding is the structured orientation in between. The supplier learns who you are, what your product does and why their part matters to it, which requirements apply, how performance will be measured and who to call. Many first-year supplier problems trace back to expectations that were never explained: a packaging requirement nobody sent, a change made without notice because nobody said notice was needed, or a scorecard the supplier first saw when it was red.</p>

<h2>The phases</h2>
<ul>
<li><b>Orientation:</b> company overview, vision, mission and guiding principles, how the part is used and what happens if it fails, the supplier quality manual and code of conduct.</li>
<li><b>Access and systems:</b> portal access, ordering and forecasts, advance shipping notices. The supplier sets up its own sign-in; never share accounts.</li>
<li><b>Requirements:</b> the quality agreement, drawings and specifications with their revisions, special characteristics, packaging and labeling, regulatory declarations. Confirm the requirements were received and understood, not just sent.</li>
<li><b>Qualification:</b> what the first article or <a href="/tools/ppap-qualification-plan.html">PPAP</a> submission must contain, how changes are notified, and how nonconforming material and corrective action requests are handled.</li>
<li><b>Performance and communication:</b> the KPIs and how the <a href="/tools/supplier-scorecard.html">scorecard</a> is calculated, the meeting cadence, and the escalation path.</li>
<li><b>Training:</b> on customer-specific requirements, with a check that it worked.</li>
</ul>

<h2>Gate items and readiness</h2>
<p>Some items can be finished during launch. Others must be done before the first production shipment: typically the signed quality agreement, the requirements flowdown, the special characteristics and the first article or PPAP expectations. Mark those as gates. The supplier is <b>ready</b> when every required gate item is done. The chart shows progress by phase, and the checks list blocked items, items past due and open items with no owner.</p>

<h2>Contacts and communication</h2>
<p>Name a contact on each side for quality, purchasing, engineering and escalation. The escalation contact should be someone who can commit resources. Then agree the cadence: during launch, a weekly call is common for a critical or major supplier; once lots are stable, a monthly scorecard and a quarterly business review are usual. For a full stakeholder communication plan, use the <a href="/tools/communication-plan.html">communication plan</a> tool. To lay out who is responsible for what, use a <a href="/tools/six-sigma-roles-raci.html">RACI matrix</a>.</p>

<h2>After onboarding</h2>
<p>A new supplier usually starts as conditionally approved and moves up as it proves itself; see the <a href="/tools/supplier-classification-lifecycle.html">supplier classification and lifecycle</a> tool. Training effectiveness can be planned with the <a href="/tools/training-plan-kirkpatrick.html">Kirkpatrick training plan</a>.</p>

<h2>On the exam</h2>
<p>Supplier onboarding is CSQP VI.A: understand and apply orientation processes, including an overview of the company, its vision, mission and guiding principles, overall requirements, expectations, and the criticality of product, service and delivery requirements. It connects to communicating expectations to suppliers (I.E), roles and responsibilities and RACI (VI.C), supplier metrics (IV.A.1) and evaluating training (V.B.3). Expect questions on what belongs in an orientation and which items must come before the first shipment.</p>
"""),
]
