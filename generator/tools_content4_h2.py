# CQI/CQT tools, second batch (agent h2). Content dicts for build_one.py.
PAGES4H2 = [
{
'slug': 'first-article-inspection',
'name': 'First article inspection',
'covers': 'CQI III.C.1, IV.F.4, CQT IV.B.6',
'title': 'First Article Inspection Record — Balloon Accountability Template | SC Quality Guild',
'desc': 'Free first article inspection record. Account for every ballooned characteristic, compute limits and pass or fail, and check tools, certs and partial FAI scope.',
'h1': 'First article inspection record',
'lede': 'Record a first article inspection balloon by balloon, with limits, results, gauges and material and process certificates, and see what keeps it from closing.',
'content': """
<h2>What a first article inspection proves</h2>
<p>A first article inspection (FAI) is a complete, documented verification that a part made by the intended
production process, tooling and materials meets every requirement of the drawing and the specifications it
references. It verifies the process, not just the part. The aerospace standard AS9102 sets a common format; this
tool follows the same logic in a simplified form.</p>
<h2>Characteristic accountability</h2>
<p>Each requirement on the drawing gets a number, a balloon. The FAI record has one line per balloon with the
requirement, the actual result and the tool used. Notes, surface finish, part marking and referenced specifications
count as characteristics too. The record must account for every balloon: a characteristic without a result is not
verified, and an unaccounted balloon is a common reason an FAI is rejected.</p>
<ul>
<li><b>Variable results</b> are recorded as the measured value, not "OK". For a multiple callout (4X), record each
feature or the worst one.</li>
<li><b>Tool or gauge ID</b> ties each result to a calibrated instrument.</li>
<li><b>Material and special processes</b> such as heat treat, plating, anodize and nondestructive testing are
verified by certificates traceable to the part, from approved sources where the customer requires them.</li>
</ul>
<h2>When an FAI is required</h2>
<p>Typical triggers are a new part or first production run, a design change, a change in manufacturing process,
tooling, location or source, a lapse in production for a period the customer or standard defines, and corrective
action after a failed FAI. A <b>partial FAI</b> re-verifies only the characteristics affected by a change, on the
basis of an earlier accepted full FAI.</p>
<h2>Reading the result</h2>
<p>The FAI closes only when every characteristic in scope passes, each has a tool, and every certificate conforms.
A failed characteristic means correcting the process and repeating the FAI for at least the affected
characteristics on a part from the corrected process.</p>
<h2>On the exam</h2>
<p>CQI and CQT questions place first article inspection among the inspection types, alongside receiving, in-process
and final inspection. Know that it verifies the production process before a run, that every drawing requirement is
covered, and which changes trigger a full or partial FAI.</p>
"""
},
{
'slug': 'drawing-title-block-tolerance-reader',
'name': 'Title block tolerance reader',
'covers': 'CQI III.A.1, III.A.2, CQT IV.A.1',
'title': 'Drawing Title Block Tolerance Reader — General Tolerances | SC Quality Guild',
'desc': 'Free drawing tolerance reader. Enter the title block tolerances and dimensions as written; get the limits by decimal places, limit and unilateral dimensions.',
'h1': 'Drawing title block tolerance reader',
'lede': 'Turn each dimension on a drawing into upper and lower limits, using the general tolerance block or the tolerance written on the dimension, and check revision, scale and projection.',
'content': """
<h2>The title block and the general tolerance block</h2>
<p>The title block identifies the drawing: number, title, revision, units, scale, projection, the dimensioning
standard and the approvals. Next to it, most drawings carry a general tolerance block. It states the tolerance for
any dimension shown without its own, by the number of decimal places written. With .XX ±.010 and .XXX ±.005, a
dimension written 2.50 means 2.490 to 2.510, while 2.500 means 2.495 to 2.505. On an inch drawing the trailing
zero changes the tolerance, so read the dimension exactly as written.</p>
<h2>Ways a tolerance is stated</h2>
<ul>
<li><b>Bilateral:</b> equal plus and minus, such as 1.250 ±.001.</li>
<li><b>Unilateral:</b> variation in one direction only, such as .750 +.000/−.002.</li>
<li><b>Unequal bilateral:</b> both directions but not equal, such as 1.000 +.003/−.001.</li>
<li><b>Limit dimension:</b> the two limits themselves, such as .6245−.6250. No arithmetic needed.</li>
<li><b>Single limit:</b> MAX or MIN, for depths, radii and similar.</li>
<li><b>Reference</b> dimensions in parentheses carry no tolerance and are not inspected for acceptance.
<b>Basic</b> dimensions in a box are exact; their tolerance comes from a feature control frame.</li>
</ul>
<p>A tolerance written on the dimension always overrides the block.</p>
<h2>Revision, units and scale</h2>
<p>Inspect to the revision the order calls for; a mismatch is a stop, not a note. Confirm the units before reading
any number. The scale tells how the views were drawn, never a way to measure: do not scale the print.</p>
<h2>Third-angle and first-angle projection</h2>
<p>In <b>third-angle projection</b>, used under ASME in North America, the top view sits above the front view and
the right side view to its right. In <b>first-angle projection</b>, the ISO practice in much of Europe and Asia,
the views are placed on the opposite sides: top view below, right side view to the left. The projection symbol in
the title block tells you which; misreading it puts features on the wrong side of the part.</p>
<h2>On the exam</h2>
<p>CQI questions give a title block and a dimension and ask for the limits, or ask which view appears where in
third-angle projection. Count the decimal places, apply the matching line of the block, and remember that
reference dimensions are not inspected.</p>
"""
},
{
'slug': 'sine-bar-height-gauge-record',
'name': 'Sine bar and height gauge',
'covers': 'CQI I.D, II.D.1, II.D.2',
'title': 'Sine Bar Calculator and Height Gauge Record — Gauge Block Stack | SC Quality Guild',
'desc': 'Free sine bar calculator and surface plate record. Get the gauge block stack for an angle on a 5 in or 100 mm bar and judge height gauge readings to tolerance.',
'h1': 'Sine bar and height gauge record',
'lede': 'Work out the gauge block stack for a sine bar angle, check the angle on the part, and record height gauge and comparator readings against tolerance.',
'content': """
<h2>How a sine bar sets an angle</h2>
<p>A sine bar is a hardened, ground bar with two rolls of equal diameter a precise distance apart, commonly
5 in, 10 in, 100 mm or 200 mm. One roll rests on the surface plate and the other on a stack of gauge blocks. The
center distance L is the hypotenuse of a right triangle and the stack height H is the side opposite the angle, so
<b>H = L × sin θ</b> and, from a stack, <b>θ = asin(H ÷ L)</b>. For 15° on a 5 in bar, H = 5 × 0.258819 =
1.2941 in.</p>
<p>Build the stack with the fewest blocks: clear the last decimal place first, then the next, and so on. Each
wrung joint adds a small error. Above about 45°, a small stack error makes a larger angle error, so the sine bar
is best used for smaller angles.</p>
<h2>Checking the angle on the part</h2>
<p>With the bar set to the nominal angle, the surface under test should be parallel to the plate. An indicator run
between two points a known distance apart shows the error: the angle error is about the change in reading divided
by the distance, in radians. A change of 0.0006 in over 2.000 in is 0.0003 rad, about 1.03 minutes.</p>
<h2>Height gauge and comparator readings</h2>
<ul>
<li><b>Direct:</b> zero the height gauge on the surface plate and read the height. Any reading on the plate is a
zero error to subtract.</li>
<li><b>Comparator:</b> set the indicator on a gauge block master close to the nominal, then read the part. Actual =
master + (part reading − reading on the master). Short indicator travel keeps the indicator's own error small.</li>
<li><b>Drift:</b> re-check the master at the end. A changed reading means every reading in between is in
doubt by that much.</li>
</ul>
<h2>Good surface plate practice</h2>
<p>Use a clean, calibrated plate, let parts and blocks reach the same temperature, wipe blocks before wringing and
handle them as little as possible.</p>
<h2>On the exam</h2>
<p>CQI questions give a bar length and an angle and ask for the stack, or give a stack and ask for the angle. Use
sine, not tangent, and the center distance between the rolls. Watch the calculator mode: degrees, not radians.</p>
"""
},
{
'slug': 'calibration-interval-adjustment',
'name': 'Calibration interval adjustment',
'covers': 'CQI II.F.1, CQT III.C.1, III.C.2',
'title': 'Calibration Interval Adjustment — As-Found History and Due Dates | SC Quality Guild',
'desc': 'Free calibration interval tool. Enter each gauge\'s as-found history and get an extend, hold or shorten decision, the next interval and the next due date.',
'h1': 'Calibration interval adjustment',
'lede': 'Use each gauge\'s as-found calibration history to decide whether to extend, hold or shorten its interval, and see the next due date against a reliability target.',
'content': """
<h2>Why intervals are adjusted</h2>
<p>A calibration interval is a bet that the instrument will still be in tolerance when it is next calibrated. Too
long, and product is accepted with an instrument that has drifted. Too short, and money is spent calibrating
instruments that were fine. ISO 9001:2015 clause 7.1.5.2 requires measuring equipment to be calibrated or verified
at specified intervals; it does not set the interval. The evidence for adjusting it is the <b>as-found</b> result:
the condition found before any adjustment. The as-left result says nothing about drift.</p>
<h2>A common practical method</h2>
<p>This tool applies a simple response rule of the kind many labs use: after a set number of consecutive
in-tolerance results, extend the interval by a factor; after an out-of-tolerance result, shorten it; otherwise hold.
Minimum and maximum limits keep the interval sensible. The number of results and the factors here are example
settings, not values from a standard.</p>
<h2>Reliability targets and established methods</h2>
<p>The <b>reliability target</b> is the share of instruments that should be in tolerance at the end of the interval,
set by the lab according to the risk of using an instrument that has drifted. A higher target means shorter intervals. Established methods for setting and adjusting intervals,
from reactive rules like the one here to statistical methods that fit a reliability model to the history of a group
of similar instruments, are described in NCSL International RP-1, Establishment and Adjustment of Calibration
Intervals, and in ILAC-G24 / OIML D 10. Statistical methods need many results; a single gauge with four
calibrations gives only a rough indication.</p>
<h2>Reading the result</h2>
<ul>
<li><b>Extend</b> only on a run of in-tolerance results and an observed in-tolerance rate at or above the target.</li>
<li><b>Shorten</b> after an out-of-tolerance result, and run an impact assessment on the product the gauge accepted
since its last good calibration.</li>
<li><b>Hold</b> when the evidence is mixed or too thin.</li>
</ul>
<h2>On the exam</h2>
<p>CQT and CQI questions ask what data justifies changing an interval (as-found history), what to do when a gauge is
found out of tolerance (shorten the interval and assess the product), and what traceability means: an unbroken
chain of calibrations to national or international standards.</p>
"""
},
]
