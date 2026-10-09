"""Content for the /tools/ pages, batch 4G: CQT (Certified Quality Technician) tools."""

PAGES4G = [
dict(slug="cqt-calibration-oot-impact", name="Calibration recall and OOT impact", covers="CQI II.F.4, CQT III.C.2",
title="Calibration Recall Tracker and Out-of-Tolerance Impact Assessment | SC Quality Guild",
desc="Free calibration recall tracker. Flag overdue and out-of-tolerance gauges, then assess the product they accepted since the last good calibration.",
h1="Calibration recall and out-of-tolerance impact",
lede="Track calibration due dates for a gauge list, flag out-of-tolerance as-found results, and work out which lots measured with a bad gauge may contain nonconforming product.",
content="""
<h2>What a recall system has to do</h2>
<p>A calibration recall system makes sure every measuring instrument comes back for calibration before its
interval runs out. Each instrument needs a unique ID, a stated interval, the date of its last calibration and
a due date that users can see on the gauge itself. An instrument past its due date is treated as out of
calibration and is pulled from use, even if it would have passed.</p>
<h2>As-found and as-left</h2>
<p>The calibration record carries two results. The <b>as-found</b> reading is taken before any adjustment and
tells you whether the instrument was right while it was in use. The <b>as-left</b> reading is taken after
adjustment and only tells you about the future. An as-found error beyond the instrument's tolerance is an
<b>out-of-tolerance (OOT)</b> condition, and it is the result that drives action on product.</p>
<h2>The impact assessment</h2>
<p>ISO 9001:2015 clause 7.1.5.2 requires the organization to determine whether the validity of previous
measurement results was adversely affected when equipment is found unfit, and to act as needed. In practice:</p>
<ul>
<li>Set the <b>suspect window</b>: from the last calibration where the gauge was found in tolerance to the
date it was found OOT.</li>
<li>List every lot accepted with that gauge in the window, with the recorded readings.</li>
<li>Remove the as-found error from each reading (true value is about the reading minus the error) and compare
with the product limits.</li>
<li>Readings that move outside the limits mark lots that may contain nonconforming product. Contain them,
re-inspect with a good gauge and notify customers of anything shipped.</li>
</ul>
<p>The correction assumes the error was present for the whole window. That is the conservative assumption, since
you rarely know when the drift began.</p>
<h2>Common traps</h2>
<ul>
<li>Recording only the as-left result, which hides the OOT condition.</li>
<li>Confusing the instrument tolerance with the product tolerance. The first decides OOT; the second decides
whether product is affected.</li>
<li>Getting the sign wrong. A gauge that reads high makes parts look bigger, so parts near the lower limit are
the ones at risk.</li>
<li>Treating calibration as proof of a capable measurement. Calibration checks accuracy against a traceable
standard; it says nothing about repeatability or reproducibility.</li>
</ul>
"""),

dict(slug="cqt-measurement-uncertainty-budget", name="Measurement uncertainty budget", covers="CQI II.F.1, CQT III.C.3",
title="Measurement Uncertainty Budget Calculator — GUM, RSS and TUR | SC Quality Guild",
desc="Free measurement uncertainty budget. Combine Type A and Type B sources by root-sum-square, apply a coverage factor, and check TUR and guard bands.",
h1="Measurement uncertainty budget",
lede="List the sources of measurement uncertainty, convert each to a standard uncertainty, combine them by root-sum-square, and compare the expanded uncertainty with the tolerance.",
content="""
<h2>Uncertainty in one paragraph</h2>
<p>Every measurement result is an estimate. Its <b>uncertainty</b> is a parameter that describes the spread of
values that could reasonably be attributed to the measurand. The international method is the Guide to the
Expression of Uncertainty in Measurement (GUM, JCGM 100:2008): express each source as a
<b>standard uncertainty</b> (one standard deviation), combine them, then multiply by a coverage factor.</p>
<h2>Type A and Type B</h2>
<ul>
<li><b>Type A</b> is evaluated statistically from repeated readings. The standard uncertainty is the standard
deviation s, or s/√n if the reported result is the average of n readings.</li>
<li><b>Type B</b> comes from any other information: a calibration certificate, the instrument's resolution, a
manufacturer's specification, temperature limits. You choose a distribution and divide by its divisor.</li>
<li>Divisors: certificate stated at k = 2, divide by 2; rectangular (equally likely anywhere within ±a), divide
a by √3; triangular, by √6; U-shaped (for example a cycling temperature), by √2. Resolution is usually taken
as rectangular with a half-width of half the last digit.</li>
</ul>
<h2>Combining and expanding</h2>
<p>A <b>sensitivity coefficient</b> c converts a source into the units of the result (for thermal expansion,
c = coefficient of expansion × length). The <b>combined standard uncertainty</b> is
u<sub>c</sub> = √(Σ (c·u)²), valid when the sources are independent. The <b>expanded uncertainty</b> is
U = k × u<sub>c</sub>; k = 2 gives roughly 95 percent coverage when the result is close to normal.</p>
<h2>Is the measurement good enough?</h2>
<p>The <b>test uncertainty ratio</b> compares the tolerance with the uncertainty: TUR = tolerance half-width
divided by U at about 95 percent coverage (k = 2). The common target is 4:1, which ANSI/NCSL Z540.3 accepts
when false-accept risk is not calculated. Below that, readings near a limit
cannot be trusted to decide conformance. One remedy is a <b>guard band</b>: accept only inside the limits
pulled in by U. That lowers the chance of accepting bad parts and raises the chance of rejecting good ones.</p>
<h2>Common traps</h2>
<ul>
<li>Adding uncertainties directly instead of as squares, which overstates the total.</li>
<li>Using a certificate's expanded U as if it were a standard uncertainty.</li>
<li>Counting the same effect twice, for example resolution inside repeatability data and again as its own row. Some labs keep both rows on purpose as a conservative choice, as the worked example does; if you do, say so.</li>
<li>Working hard on small sources. Because they add as squares, only the largest few matter.</li>
</ul>
"""),

dict(slug="cqt-reliability-mtbf-calculator", name="Reliability and MTBF", covers="CQE (reliability and maintainability), CMQ/OE IV.C.8",
title="Reliability Calculator — MTBF, Failure Rate and Series/Parallel | SC Quality Guild",
desc="Free reliability calculator. Estimate MTBF and failure rate from test data, find R(t) with the exponential model, and combine series and parallel blocks.",
h1="Reliability and MTBF calculator",
lede="Estimate failure rate and MTBF from life test or field data, convert to reliability for a mission time, and combine blocks in series and active parallel into a system reliability.",
content="""
<h2>Definitions</h2>
<ul>
<li><b>Reliability</b> is the probability that an item performs its intended function, under stated conditions,
for a stated period of time. All four parts matter; a reliability figure with no time attached means nothing.</li>
<li><b>Failure rate</b> λ is failures per unit of operating time: λ = r / T, where r is the number of failures and
T the total operating time of all units.</li>
<li><b>MTBF</b> (mean time between failures, for repairable items) is T / r = 1 / λ when the failure rate is
constant. For non-repairable items the same quantity is called MTTF.</li>
</ul>
<h2>The exponential model and the bathtub curve</h2>
<p>With a constant failure rate, reliability over a mission of length t is R(t) = e<sup>−λt</sup> =
e<sup>−t/MTBF</sup>. That holds in the flat middle of the <b>bathtub curve</b>, the useful-life period. It
does not hold during infant mortality (falling failure rate, addressed by burn-in and screening) or wear-out
(rising failure rate, addressed by replacement before wear-out). A useful check: at t = MTBF, R = e<sup>−1</sup>
= 0.368. Only about a third of items survive to the MTBF.</p>
<h2>Series and parallel systems</h2>
<ul>
<li><b>Series</b>: the system works only if every block works. R<sub>sys</sub> = R<sub>1</sub> × R<sub>2</sub>
× … × R<sub>n</sub>. The system is always less reliable than its weakest block. For exponential blocks in
series, the failure rates add.</li>
<li><b>Active parallel</b> (redundancy): the stage fails only if every unit fails.
R = 1 − (1 − R<sub>1</sub>)(1 − R<sub>2</sub>)…. Two units at 0.90 give 0.99.</li>
<li>Mixed systems are solved stage by stage: reduce each parallel group to one equivalent block, then
multiply the stages in series.</li>
</ul>
<h2>Common traps</h2>
<ul>
<li>Dividing by the number of units instead of the total unit-hours.</li>
<li>Reading MTBF as a minimum life or a warranty period.</li>
<li>Treating a standby unit as active parallel. Standby redundancy depends on the switch and uses a different
formula.</li>
<li>Trusting a point estimate from two or three failures. Report a lower confidence bound for MTBF.</li>
</ul>
"""),

dict(slug="cqt-nonconforming-material-disposition", name="Nonconforming material disposition", covers="CQI III.C.4, III.C.6, CQT IV.D.1, IV.D.2",
title="Nonconforming Material Report and MRB Disposition Template | SC Quality Guild",
desc="Free nonconforming material report. Record the nonconformance, reconcile containment quantities, and track MRB dispositions, approvals and concessions.",
h1="Nonconforming material and MRB disposition",
lede="Record a nonconformance, reconcile where every suspect part is, split the nonconforming quantity across dispositions, and check approvals, concessions and the link to corrective action.",
content="""
<h2>The control of nonconforming output</h2>
<p>ISO 9001:2015 clause 8.7 requires nonconforming outputs to be identified and kept under control so they are not used or delivered by mistake. The sequence a technician follows is the same everywhere:</p>
<ul>
<li><b>Identify</b> the product with a tag or label stating the nonconformance.</li>
<li><b>Segregate</b> it in a controlled area (a hold cage or red-tag area) where practical.</li>
<li><b>Contain</b> by finding every suspect piece: stores, work in process, finished goods, in transit and at
the customer. The quantities located should add up to the lot.</li>
<li><b>Evaluate and disposition</b> through a material review board (MRB) or another authorized person.</li>
<li><b>Record</b> the nonconformity, the actions taken, any concessions and who authorized the decision.</li>
</ul>
<h2>The dispositions</h2>
<ul>
<li><b>Use as is</b>: the part is accepted without change. It still does not meet the requirement, so it needs
engineering justification and often a customer <b>concession</b> (also called a waiver).</li>
<li><b>Repair</b>: action that makes the part acceptable for its intended use but not conforming to the original
requirement. It needs the same approval as use as is.</li>
<li><b>Rework</b>: action that makes the part conform to the original requirement. Reworked parts are
reinspected before release.</li>
<li><b>Regrade</b>: reassign the part to a different grade or use where it does conform.</li>
<li><b>Return to supplier</b> and <b>scrap</b>: scrap is made unusable so it cannot drift back into production.</li>
</ul>
<h2>Disposition is not corrective action</h2>
<p>The disposition deals with the parts in hand. A corrective action removes the cause so the problem does not
recur. A good record links the two and shows the cost of disposition, which is part of the cost of poor
quality.</p>
<h2>Common traps</h2>
<ul>
<li>Confusing rework with repair, the most common exam distinction in this area.</li>
<li>A <b>deviation</b> is permission granted before the work to depart from a requirement; a concession is
granted after the nonconforming product exists.</li>
<li>Closing containment while part of the lot is unaccounted for.</li>
<li>Dispositioning critical characteristics by use as is.</li>
</ul>
"""),
]
