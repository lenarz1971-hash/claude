# CQI tools (agent h). Content dicts for build_one.py.
PAGES4H = [
{
'slug': 'gdt-position-tolerance',
'name': 'Position tolerance and bonus',
'covers': 'CQI III.A.3, III.A.4, CQT IV.A.2',
'title': 'True Position Calculator with MMC Bonus Tolerance (GD&T) | SC Quality Guild',
'desc': 'Free true position calculator. Enter size limits, the position tolerance and X/Y deviations; get position, bonus tolerance at MMC or LMC and accept or reject.',
'h1': 'Position tolerance and bonus calculator',
'lede': 'Judge each measured hole or pin against its feature control frame: size first, then position, with the bonus tolerance the material condition modifier allows.',
'content': """
<h2>How position tolerance works</h2>
<p>Under ASME Y14.5, a position tolerance controls where the axis of a feature of size may lie. The true
position is set by basic dimensions from the datum reference frame. When the tolerance is preceded by the
diameter symbol, the tolerance zone is a cylinder centered on the true position, and the axis must fall inside it.</p>
<p>Inspection reports the deviation in X and Y from true position. Because the zone is a diameter, the
position value is twice the radial distance: <b>position = 2 × √(ΔX² + ΔY²)</b>. A hole 0.06 off in X and
0.05 off in Y has a position of 0.156, not 0.078, and not 0.11.</p>
<h2>Material condition modifiers and bonus tolerance</h2>
<ul>
<li><b>MMC (circled M):</b> the stated tolerance applies when the feature is at maximum material condition, the
smallest hole or the largest pin. As the actual size departs from MMC, the difference is added as <b>bonus
tolerance</b>: bonus = |actual size − MMC size|.</li>
<li><b>LMC (circled L):</b> the stated tolerance applies at least material condition, the largest hole or smallest
pin, and the bonus grows as the feature moves toward MMC. It protects wall thickness and edge distance.</li>
<li><b>RFS (no modifier):</b> under the 2018 standard, regardless of feature size is the default when no modifier is
shown. There is no bonus.</li>
</ul>
<p>The bonus exists only for a feature that is within its size limits. A hole below its minimum size is rejected on
size, whatever its position.</p>
<h2>Virtual condition</h2>
<p>At MMC, the worst-case boundary the mating part sees is the virtual condition: MMC size minus the position
tolerance for a hole, MMC size plus the position tolerance for a pin. A functional gauge pin made at the virtual
condition size and fixed at true position accepts every hole that meets both size and position at MMC.</p>
<h2>Reading the result</h2>
<p>Each row is judged in order: actual size inside the limits, then position against the allowed diameter
(stated tolerance plus bonus). The plot shows each axis location; the gold zone is the stated tolerance and the
dashed zone is the most the bonus can give. A point between the two passes only if its own size earns enough bonus.</p>
<h2>On the CQI exam</h2>
<p>Expect a feature control frame, a set of actual sizes and coordinate deviations. The common traps are using the
radial distance instead of the diameter, adding bonus to a feature that is out of size, measuring bonus from the
wrong limit (LMC instead of MMC), and forgetting that RFS gives no bonus.</p>
"""
},
{
'slug': 'tolerance-stack-up',
'name': 'Tolerance stack-up',
'covers': 'CQI I.A, III.A.1',
'title': 'Tolerance Stack-Up Calculator — Worst Case and RSS | SC Quality Guild',
'desc': 'Free tolerance stack-up calculator. Enter a dimension chain with plus and minus tolerances; get the worst-case and RSS gap, the largest contributor and a fix.',
'h1': 'Tolerance stack-up calculator',
'lede': 'Add up a loop of dimensions to find the gap or clearance, by worst case and by root sum of squares, and see which tolerance drives the result.',
'content': """
<h2>What a stack-up answers</h2>
<p>A tolerance stack-up predicts the range of an assembly result, such as a gap, end play or clearance, from the
tolerances of the parts in the chain. Start at one side of the gap and walk through each dimension to the other
side. Dimensions that make the gap larger carry a plus sign; dimensions that make it smaller carry a minus sign.
The nominal gap is the signed sum of the nominal dimensions.</p>
<h2>Worst case</h2>
<p>The worst-case (arithmetic) method assumes every part can be at its limit in the direction that hurts. The gap
tolerance is the plain sum of the individual tolerances: <b>T = ΣTᵢ</b>. If the worst case meets the
requirement, every assembly built from in-tolerance parts works. It is the conservative answer and needs no
assumptions about the processes.</p>
<h2>Root sum of squares (RSS)</h2>
<p>The statistical method assumes the dimensions are independent, roughly normal, centered on their nominal and
each toleranced at about ± 3 standard deviations. Then the variances add, and the gap tolerance is
<b>T = √(ΣTᵢ²)</b>, smaller than the worst case. With four tolerances of 0.005, 0.002, 0.003 and 0.002, the worst
case is ± 0.012 and the RSS is ± 0.0065.</p>
<p>RSS is a prediction about a population, not a guarantee for each assembly. If a supplier runs near one limit, or
the dimensions are correlated, the RSS answer is optimistic.</p>
<h2>Unequal tolerances</h2>
<p>A dimension such as 1.000 +0.002 / −0.004 is converted to its mean, 0.999, with an equal tolerance of ± 0.003
before stacking. The mean gap can then differ from the nominal gap, which is why the tool shows both.</p>
<h2>Using the result</h2>
<ul>
<li>If worst case meets the requirement, the design is safe.</li>
<li>If worst case fails but RSS meets it, the design depends on capable, centered processes; confirm with process data.</li>
<li>If both fail, change the design or tighten tolerances. The share-of-variance chart shows where tightening
does the most good, because RSS squares each tolerance.</li>
</ul>
"""
},
{
'slug': 'gauge-resolution-10-to-1',
'name': 'Gauge selection (10:1 rule)',
'covers': 'CQI II.C.1, II.C.2, I.E, CQT IV.B.2, IV.B.5',
'title': 'Gauge Selection Checker — 10:1 Rule, Resolution and Inch/mm | SC Quality Guild',
'desc': 'Free gauge selection checker. Compare instrument resolution and accuracy with the tolerance using the 10:1 rule, with exact inch and millimeter conversion.',
'h1': 'Gauge selection and resolution checker',
'lede': 'Check whether each instrument can discriminate and is accurate enough for the tolerance it will judge, converting between inches and millimeters exactly.',
'content': """
<h2>The rule of ten</h2>
<p>The rule of ten, also called the 10:1 rule, says a measuring instrument should resolve to
at least one tenth of the tolerance it is used to judge. A characteristic toleranced 4.000 to 4.050 mm (0.050 mm
total) needs an instrument that reads to 0.005 mm or finer. Below that ratio, the readings fall into so few steps
across the tolerance that parts near the limits cannot be sorted reliably.</p>
<h2>Resolution is not accuracy</h2>
<ul>
<li><b>Resolution (discrimination):</b> the smallest change the instrument displays.</li>
<li><b>Accuracy:</b> how close the reading is to the true value, stated as ± on the calibration certificate or data
sheet.</li>
<li><b>Precision:</b> how closely repeated readings agree with each other.</li>
</ul>
<p>A digital caliper that displays 0.0005 in but is accurate only to ± 0.001 in displays more digits than it
can support. The tool therefore runs a second check: the ± tolerance divided by the ± accuracy. A common minimum is
4:1, the same ratio often used as a test accuracy ratio in calibration. Your quality manual or customer may set
other ratios; enter them in the first section.</p>
<h2>Inch and millimeter conversion</h2>
<p>One inch is exactly 25.4 millimeters by definition, so conversions carry no rounding error of their own. The
error comes from rounding too early. Carry at least one more decimal place than the tolerance, convert, and round
only the final result. A 0.0005 in resolution is 0.0127 mm; rounded to 0.01 mm it would look better than it is.</p>
<h2>Reading the result</h2>
<p>Each row shows the limits in the other unit, the tolerance-to-resolution ratio and the tolerance-to-accuracy
ratio. When an instrument fails, the checks state the finest resolution needed. The usual fix is the next class of
instrument: caliper to micrometer, rule to caliper, or a dedicated bore or indicator gauge.</p>
<h2>On the CQI exam</h2>
<p>Expect questions that give a tolerance and several instruments and ask which is appropriate, or that mix inch and
metric values. Use the total tolerance, convert before comparing, and do not confuse resolution with accuracy.</p>
"""
},
{
'slug': 'attribute-inspection-defect-classification',
'name': 'Attribute inspection and defect classes',
'covers': 'CQI III.B.4, III.C.5, CQT IV.A.3, IV.C.1',
'title': 'Attribute Inspection Record — Critical, Major, Minor Defects | SC Quality Guild',
'desc': 'Free attribute inspection record. Classify defects as critical, major or minor, count defects and defectives, and accept or reject the lot by sampling plan.',
'h1': 'Attribute inspection and defect classification',
'lede': 'Record what a sample inspection found, classify each defect, and decide the lot against the acceptance numbers of your sampling plan.',
'content': """
<h2>Classifying defects by seriousness</h2>
<p>Classification puts the inspection effort and the acceptance criteria where the consequences are. Sampling
standards such as ANSI/ASQ Z1.4 and common practice use three classes, described here in plain terms:</p>
<ul>
<li><b>Critical:</b> a defect that could make the product unsafe or hazardous for the people who use or service it,
or that would stop a major end item from doing its job.</li>
<li><b>Major:</b> not critical, but could cause the product to fail or make it noticeably less fit for its
intended purpose.</li>
<li><b>Minor:</b> a departure from the specification that does not materially affect how the product is used or
how well it works.</li>
</ul>
<p>The classification belongs in the inspection plan, decided in advance, not by the inspector at the bench.</p>
<h2>Defects and defectives</h2>
<p>A <b>defect</b> (nonconformity) is one failure to meet a requirement. A <b>defective</b> (nonconforming unit) is a
unit with one or more defects. A closure with flash and a scuff is two defects but one defective. Under Z1.4
definitions a unit is a defective of the most serious class it contains, so a unit with a major and a minor defect
is a major defective. A plan states whether its acceptance numbers count defectives (percent nonconforming) or
defects (nonconformities per hundred units).</p>
<h2>Accepting or rejecting the lot</h2>
<p>Each class has its own acceptance number Ac and rejection number Re. If the count is at or below Ac, the class
accepts; at or above Re, it rejects. The lot is accepted only if every class accepts. Critical defects are
usually set at zero acceptance, often with 100% inspection for that characteristic.</p>
<p>Rejecting a lot does not decide what happens to it. The lot is identified and segregated, and the disposition
(rework, sort, use as is, return or scrap) is made through the nonconforming material process, often by a material
review board.</p>
<h2>Reading the result</h2>
<p>The table shows defects and defective units for each class against Ac and Re, plus defects per unit (DPU) and
defects per hundred units. The checks flag a missing plan, unclassified defects, a sample larger than the lot, and
the switching-rule consequence of a rejection.</p>
<h2>On the CQI exam</h2>
<p>Expect to classify a described defect, to tell defects from defectives, and to apply Ac and Re for each class.
A frequent trap is counting a unit twice because it has two defects of different classes.</p>
"""
},
]
