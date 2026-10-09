# Supplier quality tools, batch b4 (Oct 2026). Supplier selection with total
# risk factor, PPAP and qualification planning, supplier classification and
# lifecycle, and the Kraljic portfolio matrix. Mostly CSQP; also CQPA and CQE.
PAGES6B4 = [
dict(slug="supplier-selection-matrix", name="Supplier selection matrix with total risk factor",
covers="CSQP I.B.1, II.B.1, III.B.1, III.B.2, III.B.3, CQPA IV.D.1, CQE I.H.1, CMDA III.D.4",
title="Supplier Selection Matrix with Total Risk Factor — Free Online | SC Quality Guild",
desc="Free weighted supplier selection matrix. Knock-out criteria, weighted scores, a total risk factor for each candidate, ranking, chart and a sensitivity check.",
h1="Supplier selection matrix with total risk factor",
lede="Set the must-haves, weight the criteria, score each candidate supplier, and rate what could go wrong with each one. Get the weighted ranking, a total risk factor, a recommendation and a check on whether the answer depends on one weight.",
content="""
<h2>What the tool is for</h2>
<p>Choosing a supplier is a decision with several criteria and several options, which is exactly what a weighted decision matrix is built for. The team agrees the criteria and their weights first, then scores every candidate against the same scale. The matrix does not make the decision; it makes the reasoning visible, so that a choice can be explained and challenged.</p>
<p>The tool works in three layers, in the order a good selection runs:</p>
<ol>
<li><b>Must-haves.</b> Knock-out requirements such as a verified certificate, capability on the critical characteristics, or regulatory declarations. A candidate that fails one is out, however cheap it is. This stops a weak supplier winning on points.</li>
<li><b>Weighted criteria.</b> Quality, delivery, total cost, capacity, technical support, financial stability and so on, each with a weight. Each candidate is scored 1 to 5, and the weighted total is the sum of weight &times; score. The tool also shows it as a percentage of the maximum possible, so the result reads the same whatever the weights add up to.</li>
<li><b>Total risk factor.</b> A candidate can score well today and still be a poor choice: a sole source in a flood zone, a shop with losses two years running, or one that would have to fill its last spare capacity to take your work. Each risk factor is rated 1 (low) to 5 (high) and weighted; the total risk factor is the weighted average. Candidates above the high threshold are flagged and are only chosen with a mitigation plan.</li>
</ol>

<h2>Where the scores come from</h2>
<p>A score is only as good as its evidence. For current suppliers, use performance history: PPM, on-time delivery, corrective action records. For new candidates, use an audit (on-site, virtual or desktop), a self-assessment questionnaire, samples measured for capability, a financial report, and a check of third-party certification with the registrar rather than a copy of the certificate. Write the scoring guide (what earns a 1, a 3 and a 5) before scoring, so two evaluators give the same candidate the same score.</p>

<h2>Reading the result</h2>
<ul>
<li><b>The chart</b> plots each candidate's weighted score against its total risk factor. The best place to be is right and low: high score, low risk.</li>
<li><b>The sensitivity table</b> recalculates the winner with each weight dropped and doubled, and with equal weights. If the winner changes when one weight moves, the decision rests on that weight; agree it explicitly.</li>
<li><b>A gap of a few points</b> between two candidates is within the error of 1-to-5 scoring. Decide between them on the evidence, a trial order, or a second audit.</li>
</ul>
<p>After selection, the chosen supplier still has to qualify the part (see the <a href="/tools/ppap-qualification-plan.html">PPAP and qualification plan</a>), and its ongoing performance belongs on the <a href="/tools/supplier-scorecard.html">supplier scorecard</a>. For choosing between improvement projects rather than suppliers, use the <a href="/tools/project-selection-matrix.html">project selection matrix</a>.</p>

<h2>On the exam</h2>
<p>The CSQP Body of Knowledge asks you to develop the selection and qualification process using decision analysis and total risk factor analysis (I.B.1), compare existing suppliers on capability, capacity, quality, delivery, price, lead time and responsiveness (III.B.1), assess new suppliers through self-assessments, audits, financial analysis and verified certification (III.B.2), and select using weighted decision and selection matrices (III.B.3). Decision analysis also appears as a risk analysis tool (II.B.1). The CQPA covers criteria for selecting, approving and classifying suppliers (IV.D.1), the CQE applies supplier qualification, certification and evaluation (I.H.1), and the CMDA covers supplier qualification and risk-based classification under purchasing controls (III.D.4). Expect to calculate a weighted score, spot a knock-out criterion, and explain why the lowest price is not the lowest total cost.</p>
"""),

dict(slug="ppap-qualification-plan", name="PPAP and part, process and service qualification plan",
covers="CSQP III.C.3, III.C.4, III.C.5, CQPA IV.C, CQE I.H.1, III.D, IV.A",
title="PPAP Checklist and Qualification Plan — 18 Elements, Levels 1–5 | SC Quality Guild",
desc="Free PPAP checklist and qualification plan: the 18 elements by submission level, owners, due dates, capability and MSA criteria, and run at rate.",
h1="PPAP and part, process and service qualification plan",
lede="List what the supplier must show before the part, process or service is approved: the 18 PPAP elements and your own plan items, with owner, due date and status. See what the chosen submission level requires, check capability and gauge results against the PPAP criteria, and prove the run at rate.",
content="""
<h2>What a qualification plan is</h2>
<p>Before a new part, process or service goes into production, the customer and the supplier agree a qualification plan: the evidence the supplier will produce, who owns each item, and when it is due. For manufactured parts the plan usually follows the production part approval process (PPAP), published by AIAG for the automotive industry and widely copied elsewhere. The purpose is stated in the CSQP Body of Knowledge: to show that the supplier understands the requirements and that its process can make parts with consistent quality <b>during an actual production run at production rates</b>.</p>

<h2>The 18 PPAP elements</h2>
<p>Design records; engineering change documents; customer engineering approval; design FMEA; process flow diagram; process FMEA; control plan; measurement system analysis; dimensional results; material and performance test results; initial process studies; qualified laboratory documentation; appearance approval report; sample production parts; master sample; checking aids; customer-specific requirements; and the part submission warrant (PSW). The PSW is the one-page summary the supplier signs to declare that everything else is done and conforms.</p>

<h2>Submission levels</h2>
<ul>
<li><b>Level 1:</b> the warrant only (plus the appearance approval report for appearance items).</li>
<li><b>Level 2:</b> the warrant with product samples and limited supporting data.</li>
<li><b>Level 3:</b> the warrant with samples and complete supporting data. This is the default unless the customer says otherwise.</li>
<li><b>Level 4:</b> the warrant and whatever else the customer defines.</li>
<li><b>Level 5:</b> the warrant with samples and complete data, reviewed at the supplier's site.</li>
</ul>
<p>The "At level" column shows the code from the PPAP table: S, submit and keep a copy; R, keep on file and show on request; *, keep, and submit if asked. Whatever the level, the supplier must have every applicable element done and on file. The level changes what is sent, not what is done.</p>

<h2>The acceptance criteria the tool checks</h2>
<ul>
<li><b>Initial process studies:</b> Ppk above 1.67 meets the criteria; 1.33 to 1.67 may be acceptable with the customer's agreement; below 1.33 does not, and needs a corrective action plan and containment such as 100% inspection. Use at least 100 readings, for example 25 subgroups of 4.</li>
<li><b>Gauge R&amp;R:</b> under 10% acceptable; 10% to 30% may be acceptable depending on the application; over 30% not acceptable.</li>
<li><b>Run at rate:</b> good parts per hour in the significant production run (by default one to eight hours and at least 300 consecutive parts) compared with demand per day &divide; planned hours per day.</li>
</ul>

<h2>Beyond parts</h2>
<p>A process or a service (calibration, laboratory testing, software, design) is qualified the same way in principle: a provider audit, the requirements and critical-to-quality characteristics agreed with the supplier, an inspection or verification plan, validation (IQ, OQ, PQ for equipment and processes), and evidence such as a certificate of conformance (CoC) or certificate of analysis (CoA). A production readiness review then confirms the plan was executed. The <a href="/tools/first-article-inspection.html">first article inspection</a> and <a href="/tools/control-plan.html">control plan</a> tools produce two of the elements.</p>

<h2>On the exam</h2>
<p>The CSQP covers developing the qualification plan, with its audit, calibration, sample size, first article, MSA, PFD, FMEA, control plan, CTQ, capability, material and performance testing, appearance approval and validation items (III.C.3), PPAP requirements and production at rate (III.C.4), and interpreting the results, including CoC, CoA and production readiness reviews (III.C.5). The CQPA describes first-article and other approval methods (IV.C), and the CQE covers supplier qualification (I.H.1), IQ/OQ/PQ (III.D) and control plans (IV.A). Expect to name the elements, choose a submission level, and judge a Ppk or %GRR against the criteria.</p>
"""),

dict(slug="supplier-classification-lifecycle", name="Supplier classification and lifecycle",
covers="CSQP I.B.2, I.B.3, V.C, CQPA IV.D.1, IV.D.2, CQE I.H.1, I.H.2, CMDA III.D.4",
title="Supplier Classification System — Approved, Preferred, Certified | SC Quality Guild",
desc="Free supplier classification tool. Set the rules, enter scores, audits and certificates, and see who to promote, hold, demote or disqualify.",
h1="Supplier classification and lifecycle",
lede="Write the rules for each class, from non-approved through conditional, approved, preferred and certified to partnership, and for disqualification. Enter each supplier's score, audit, certificate and open corrective actions; the tool shows the class the rules allow, what to do, and why.",
content="""
<h2>Why classify suppliers</h2>
<p>A classification system turns scattered performance data into decisions: who gets new business, who ships straight to stock, who needs a development plan, and who should be replaced. Writing the rules down makes the classification consistent and defensible, and tells suppliers exactly what they must do to move up.</p>

<h2>The classes</h2>
<ul>
<li><b>Non-approved:</b> not yet assessed. No production orders.</li>
<li><b>Conditionally approved:</b> may supply under limits (a trial order, tightened inspection) while specific gaps are closed by a date. Conditional status should always have an end date.</li>
<li><b>Approved:</b> meets the requirements: assessment passed, certificate valid, performance at or above the approved threshold.</li>
<li><b>Preferred:</b> sustained high performance over several periods and no open corrective actions. First call for new business.</li>
<li><b>Certified:</b> preferred performance held long enough, a recent process audit and low PPM, so incoming inspection is reduced or skipped (ship-to-stock). Certification is earned and can be lost.</li>
<li><b>Partnership:</b> a certified supplier with a long-term agreement: shared planning, early design involvement, joint improvement. This is a business decision as much as a quality one.</li>
<li><b>Disqualified:</b> no new orders; an exit plan is under way. A disqualified supplier comes back only through the full approval process.</li>
</ul>

<h2>How the rules are applied</h2>
<p>Each rule caps the class a supplier can hold. A failed audit or a score below the conditional threshold disqualifies. Open major audit findings, an expired certificate, or a score below the approved threshold cap a supplier at conditional. Open SCARs, too few periods at the preferred score, or a score below the preferred threshold cap it at approved. Certified also needs enough periods in a row, PPM at or below the limit, a valid certificate and an audit within the time allowed. Partnership needs an agreement. The supplier's class is the lowest of its caps, and the tool lists the cap that binds, which is what the supplier must fix to move up.</p>
<p>The <b>flow picture</b> shows how many suppliers are in each class now, how many the rules allow, and the promotions and demotions between them. A supply base with many conditional suppliers that never move is a sign the conditional class is being used as a parking place.</p>

<h2>Using it well</h2>
<ul>
<li>Base scores on the <a href="/tools/supplier-scorecard.html">supplier scorecard</a>, using the same period for everyone.</li>
<li>When a certified supplier is demoted, restore normal incoming inspection at once.</li>
<li>Rules are consistent but not wise. A sole-source strategic supplier that slips to conditional usually needs development, not exit; check its position on the <a href="/tools/kraljic-portfolio-matrix.html">Kraljic matrix</a>.</li>
</ul>

<h2>On the exam</h2>
<p>The CSQP asks you to define and develop a supplier classification system with exactly these classes: non-approved, conditionally approved, approved, preferred, certified, partnership and disqualified (I.B.3). It also covers performance monitoring with expected levels, improvement plans and exit strategies (I.B.2), and categorizing suppliers on risk and performance (V.C). The CQPA covers criteria for approving and classifying suppliers and performance measures (IV.D.1, IV.D.2), the CQE supplier qualification, certification and ratings (I.H.1, I.H.2), and the CMDA risk-based classification of suppliers (III.D.4). Expect a scenario where you choose the right class, or the right action when a certified supplier's performance drops.</p>
"""),

dict(slug="kraljic-portfolio-matrix", name="Kraljic portfolio matrix",
covers="CSQP II.A.4, I.B.4, I.C.2",
title="Kraljic Matrix — Supply Risk vs Profit Impact Portfolio Tool | SC Quality Guild",
desc="Free Kraljic matrix. Score purchases on supply risk and profit impact; see each one placed as strategic, leverage, bottleneck or non-critical.",
h1="Kraljic portfolio matrix",
lede="Score each purchased item or category on supply risk and profit impact. The matrix places it in one of four quadrants (strategic, leverage, bottleneck or non-critical) and shows the purchasing strategy and the supplier quality effort that fits each.",
content="""
<h2>The model</h2>
<p>Peter Kraljic's portfolio model (1983) sorts purchases on two axes. <b>Profit impact</b> is how much the item matters to the business: its share of spend, and its effect on product quality, safety, performance or revenue. <b>Supply risk</b> is how hard it would be to keep getting it: the number of qualified sources, the cost and time of switching, scarcity, lead time, and geographic or regulatory exposure. Splitting each axis into high and low gives four quadrants, and each calls for a different approach.</p>

<h2>The four quadrants</h2>
<ul>
<li><b>Strategic</b> (high impact, high risk): a custom controller from the only qualified source. Build a partnership: long-term agreements, joint development, shared improvement targets, and a contingency plan. These suppliers get the most supplier quality attention.</li>
<li><b>Leverage</b> (high impact, low risk): steel, standard molded parts. Many capable suppliers compete, so use the buying power: bids, volume consolidation, target pricing. Keep quality requirements in every tender, because a price squeeze is often followed by quality slipping.</li>
<li><b>Bottleneck</b> (low impact, high risk): a cheap proprietary part with one source. It can stop the line even though it costs little. Secure supply: safety stock, longer contracts, a second source, or a redesign onto a standard part.</li>
<li><b>Non-critical</b> (low impact, low risk): packaging, fasteners, office supplies. Simplify: catalogs, blanket orders, fewer suppliers, light-touch verification.</li>
</ul>

<h2>How the tool scores</h2>
<p>Each factor is scored 1 to 5. Supply risk is the average of the three supply risk factors that are scored; profit impact is the average of the two profit impact factors. An item at or above the dividing line (3 by default) on an axis counts as high. The bubble area shows the annual spend, so a large bubble in the bottleneck quadrant stands out. The share of spend by quadrant is shown under the chart.</p>
<p>The quadrant is a starting point, not a verdict. Items near a dividing line move with a one-point change in a score, so the tool lists them. And low spend is not the same as low importance: a label that carries a regulatory warning has a small spend but a large effect on the product. Score that under impact, and do not cut its controls because it lands in non-critical.</p>

<h2>Using it with the other supplier tools</h2>
<p>The quadrant sets how much effort each supplier relationship deserves. Strategic suppliers are candidates for preferred, certified and partnership status in the <a href="/tools/supplier-classification-lifecycle.html">classification system</a>; bottleneck items need a contingency entry in the <a href="/tools/risk-register-heat-map.html">risk register</a>; leverage items are where a <a href="/tools/supplier-selection-matrix.html">selection matrix</a> and competitive bids pay off.</p>

<h2>On the exam</h2>
<p>The CSQP Body of Knowledge names the Kraljic portfolio segmentation model as a tool for identifying and categorizing supplier risk (II.A.4). It also supports deciding where to develop partnerships and alliances (I.B.4) and how to rationalize the supply base (I.C.2). Expect to place an item in the right quadrant from a short description, and to choose the strategy that fits it: partner, leverage, secure supply, or simplify.</p>
"""),
]
