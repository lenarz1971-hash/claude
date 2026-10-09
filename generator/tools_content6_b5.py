# Calibration and metrology tools, batch b5 (Oct 2026). Unit conversion, IM&TE
# specifications, TUR and guard bands, calibration certificates and labels,
# rounding and significant figures, and interpolation from a calibration table.
# Written for the CCT Body of Knowledge (2024); also useful for CQT, CQI and CQE.
PAGES6B5 = [
dict(slug="si-metrology-unit-converter", name="SI and metrology unit converter",
covers="CCT I.A, I.B, I.C, IV.D.1, IV.D.2, IV.D.3, IV.D.8",
title="SI and Metrology Unit Converter — Exact Factors, Notation, Angles, dB | SC Quality Guild",
desc="Free metrology unit converter with exact NIST factors: length, pressure, torque, force, flow, temperature, SI prefixes, notation, angles, ppm and dB.",
h1="SI and metrology unit converter",
lede="Convert between SI and US customary units with the exact defining factors, and see the value in every unit at once. Also: SI prefixes, scientific and engineering notation, degrees-minutes-seconds, percent and ppm, and decibels.",
content="""
<h2>Why exact factors matter</h2>
<p>Most conversion factors used in calibration are exact by definition, not measured. Since 1959 the inch has been exactly 25.4 mm and the pound exactly 0.45359237 kg. Standard gravity is exactly 9.80665 m/s&sup2;. Everything else follows from those: a pound-force is 0.45359237 &times; 9.80665 = 4.4482216152605 N, and a psi is that force over one square inch, about 6894.757 Pa. A converted value is only as good as the factor you used, so a factor rounded to three figures can add an error larger than the instrument's own. This tool builds every factor from the definitions in NIST Special Publication 811, Appendix B, and marks the few that are conventional rather than exact: the manometric pressure units such as mmHg and inH<sub>2</sub>O, and the calorie and Btu.</p>

<h2>The SI in brief</h2>
<ul>
<li><b>Seven base units:</b> meter, kilogram, second, ampere, kelvin, mole and candela. Since 2019 each is defined by fixing the value of a constant of nature.</li>
<li><b>Derived units</b> are products and quotients of base units: the newton is kg&middot;m/s&sup2;, the pascal N/m&sup2;, the joule N&middot;m, the watt J/s.</li>
<li><b>Prefixes</b> scale a unit by a power of ten, from quecto (10<sup>&minus;30</sup>) to quetta (10<sup>30</sup>). Symbols are case sensitive: m is milli, M is mega. Going from mega to kilo moves the decimal point three places to the right.</li>
</ul>

<h2>Temperature is the odd one</h2>
<p>Celsius, Fahrenheit and kelvin have different zeros, so a temperature reading converts with an offset: &deg;F = &deg;C &times; 9/5 + 32. A temperature <i>difference</i> does not. A tolerance of &plusmn;2 &deg;C is &plusmn;3.6 &deg;F, not &plusmn;35.6 &deg;F. Uncertainties, drifts and tolerances are differences, so use the temperature-difference units for them.</p>

<h2>Torque and energy</h2>
<p>A pound-force foot of torque and a foot pound-force of energy have the same dimensions but are different quantities. The tool keeps them apart, and in the worksheet a symbol such as ft-lb is read as whichever one the other unit in the row belongs to.</p>

<h2>Notation, angles and ratios</h2>
<ul>
<li><b>Scientific notation</b> puts one digit before the decimal point: 4.5670 &times; 10<sup>&minus;5</sup>. <b>Engineering notation</b> keeps the exponent a multiple of three, so it reads straight off as an SI prefix: 45.670 &times; 10<sup>&minus;6</sup> A is 45.670 &micro;A.</li>
<li><b>Angles:</b> one degree is 60 minutes, one minute 60 seconds. A full turn is 360&deg;, 2&pi; radians and 400 grads.</li>
<li><b>Ratios:</b> 1% is 10,000 ppm. Decibels are logarithmic: 10 log<sub>10</sub> of a power ratio, or 20 log<sub>10</sub> of an amplitude ratio such as voltage. Doubling the power is +3 dB; doubling the voltage is +6 dB.</li>
</ul>

<h2>On the exam</h2>
<p>The CCT Body of Knowledge asks you to define the seven base units (I.A), calculate and convert derived units (I.B) and use the SI multipliers, for example mega to kilo and micro to milli (I.C). In applied mathematics it lists scientific and engineering notation (IV.D.1), English and metric conversions of length, area, volume, capacity and mass (IV.D.2), percentage, ppm and decibels (IV.D.3) and angular conversions between degrees, minutes, seconds, grads and radians (IV.D.8). Expect calculator questions where a factor or an offset applied the wrong way round is the trap.</p>
"""),

dict(slug="imte-accuracy-specification", name="IM&TE accuracy specification calculator",
covers="CCT II.D, II.C, V.D.1",
title="Instrument Accuracy Specification Calculator — % of Reading + % of Range + Counts | SC Quality Guild",
desc="Free IM&TE accuracy spec calculator. Turn ±(% of reading + % of range + counts) into the allowed error and limits at each test point, with a floor and a chart.",
h1="IM&TE accuracy specification calculator",
lede="Enter an instrument's accuracy specification as the maker writes it, and get the allowed error and the test limits at any reading. Add the readings from a calibration to see which points pass.",
content="""
<h2>How accuracy specifications are written</h2>
<p>Instrument makers state accuracy as a sum of terms, each covering a different kind of error. A typical digital multimeter specification reads &plusmn;(0.05% of reading + 0.01% of range + 2 counts). The allowed error at a reading is the sum of all the terms at that reading.</p>
<ul>
<li><b>Percent of reading</b> (gain or scale error) grows with the reading. It is zero at zero.</li>
<li><b>Percent of range</b> or <b>percent of full scale</b> (offset error) is the same everywhere on the range. It is a percentage of the range or full-scale value, not of the reading.</li>
<li><b>Counts</b> or digits are steps of the least significant displayed digit. Two counts on a display with 0.001 V resolution is 0.002 V.</li>
<li><b>Fixed terms</b> and <b>floors</b> set a minimum. Some specifications add an absolute term such as + 5 &micro;V; others say "&plusmn;1% of reading or 0.5 &deg;C, whichever is greater".</li>
</ul>
<p>Specifications are often given in ppm instead of percent: 10 ppm is 0.001%.</p>

<h2>Why the bottom of a range is weak</h2>
<p>The range, count and fixed terms do not shrink as the reading gets smaller, so the allowed error as a share of the reading grows near the bottom of a range. In the worked example the meter is good to about &plusmn;0.07% of reading at full scale, but only about &plusmn;0.25% at a tenth of it. That is why procedures test near the top of each range, and why a reading low on a range is better taken on the next range down.</p>

<h2>Qualifiers</h2>
<p>A specification only holds under its stated conditions: for a period since calibration (90 days, 1 year), in a temperature band (23 &deg;C &plusmn; 5 &deg;C), sometimes after a warm-up and within a humidity limit. Outside those conditions the maker usually adds a temperature coefficient per degree. Record the qualifiers with the specification.</p>

<h2>From specification to test limits</h2>
<p>In a calibration the reference standard applies a known value and the instrument's reading is compared with it. The limits are the applied value &plusmn; the allowed error. The test points table gives the limits for a procedure or data sheet, and, when you add the readings, the error at each point and whether it is in tolerance. A point that uses most of its allowance needs care: once the calibration uncertainty is counted, it may not be a clear pass. The <a href="/tools/tur-tar-guard-band-pfa.html">TUR and guard-band calculator</a> handles that decision.</p>

<h2>Specification is not uncertainty</h2>
<p>A specification is the error the maker promises. The uncertainty of a measurement made with the instrument also includes the reference, the method, the operator and the environment. A specification is often one input to an <a href="/tools/cqt-measurement-uncertainty-budget.html">uncertainty budget</a>, usually as a rectangular distribution.</p>

<h2>On the exam</h2>
<p>CCT II.D asks you to analyze specification descriptions: percent of full scale, percent of range, percent of reading and number of counts, along with tolerance, modifiers and qualifiers, output, scale and floor terms. II.C covers resolution and readability, and V.D.1 determining conformance status. Expect to calculate the allowed error and the limits at a test point, and to decide whether a reading passes.</p>
"""),

dict(slug="tur-tar-guard-band-pfa", name="TUR, TAR and guard-band calculator (PFA and PFR)",
covers="CCT IV.A, IV.C, CQE IV.E",
title="TUR, TAR and Guard Band Calculator — False Accept (PFA) and False Reject (PFR) | SC Quality Guild",
desc="Free TUR and guard-band calculator. Get TUR and TAR, guard-banded acceptance limits by several methods, and the false-accept and false-reject probabilities.",
h1="TUR, TAR and guard-band calculator",
lede="Enter the tolerance, the calibration uncertainty and how often instruments like this one arrive in tolerance. Get the test uncertainty ratio, the acceptance limits for several guard-band methods, and the probability of a false accept and a false reject for each.",
content="""
<h2>TUR and TAR</h2>
<p>The <b>test uncertainty ratio</b> compares the tolerance being checked with the uncertainty of the check. ANSI/NCSL Z540.3 defines it as the tolerance span divided by twice the expanded uncertainty of the calibration process at about 95% (k = 2): TUR = (upper limit &minus; lower limit) / 2U. For a symmetric tolerance &plusmn;T that is T/U.</p>
<p>The older <b>test accuracy ratio</b> compares the tolerance with the accuracy specification of the reference standard alone. TAR is easier to work out but leaves out resolution, repeatability, the environment and the method, so it nearly always looks better than the TUR. The common 4:1 rule of thumb is a TUR requirement.</p>

<h2>False accept and false reject</h2>
<p>Every reading is off by some amount, so near a limit a calibration can get the answer wrong in two ways.</p>
<ul>
<li><b>False accept (PFA, consumer's risk, Type II):</b> the instrument is really out of tolerance, but the reading falls inside the acceptance limits and it goes back into service.</li>
<li><b>False reject (PFR, producer's risk, Type I):</b> the instrument is really in tolerance, but the reading falls outside, and it is adjusted or rejected for nothing.</li>
</ul>
<p>Both depend on the uncertainty and on how the instruments are spread: a population that is nearly always well inside tolerance gives few false accepts whatever the TUR. Here the true values are taken as normal, with the spread set by the in-tolerance probability (end-of-period reliability, EOPR) from your calibration history. The measurement errors are normal with standard deviation U/k. PFA and PFR are the double integrals over the regions where truth and decision disagree, worked out numerically. Z540.3 requires PFA of 2% or less, or, where PFA is not calculated, a TUR of at least 4:1.</p>

<h2>Guard bands</h2>
<p>A guard band moves the acceptance limit A inside the tolerance limit T, so a reading must be further from the limit to pass. It lowers PFA and raises PFR. The methods compared here:</p>
<ul>
<li><b>Simple acceptance:</b> A = T. No guard band.</li>
<li><b>Subtract U:</b> A = T &minus; U. Simple and strict; at low TUR it rejects many good instruments.</li>
<li><b>RSS:</b> A = &radic;(T&sup2; &minus; U&sup2;). A smaller guard band than subtracting U.</li>
<li><b>Managed guard band (Dobbert):</b> A = T &minus; U&middot;M, with M = 1.04 &minus; e<sup>0.38 ln(TUR) &minus; 0.54</sup>. It is designed to keep PFA at or below 2% whatever the in-tolerance probability, and needs no guard band above a TUR of about 4.6.</li>
<li><b>Solve for a target:</b> the widest acceptance limits that keep PFA at your target.</li>
</ul>
<p>The trade-off chart shows the cost: every step inward buys a lower PFA with a higher PFR.</p>

<h2>Where U comes from</h2>
<p>U is the expanded uncertainty of the calibration at this test point, not of the instrument being calibrated. Build it from its sources with the <a href="/tools/cqt-measurement-uncertainty-budget.html">measurement uncertainty budget</a>.</p>

<h2>On the exam</h2>
<p>CCT IV.A lists guard-banding, PFR (Type I error), PFA (Type II error), TUR, TAR and percent of tolerance among the uncertainty terms to apply. IV.C covers combined and expanded uncertainty, coverage factors and the statement of conformity with its decision rule. CQE IV.E covers metrology, including measurement error and its sources. Expect to compute a TUR or TAR, apply a guard band, and say which way a guard band moves each risk.</p>
"""),

dict(slug="calibration-certificate-label", name="Calibration certificate and label record",
covers="CCT III.H, III.G, IV.C, V.D.1, V.D.2, CQE IV.E, CMDA III.D.7",
title="Calibration Certificate and Label Template — As Found, As Left, Decision Rule | SC Quality Guild",
desc="Free calibration certificate template: as-found and as-left readings, a decision rule, the conformity statement, the label, and an ISO/IEC 17025 elements check.",
h1="Calibration certificate and label record",
lede="Record a calibration the way a certificate reports it: the item, the standards used, the as-found and as-left readings against their limits. Pick a decision rule and get the pass or fail at each point, the statement of conformity, the due date and the label.",
content="""
<h2>What a certificate must say</h2>
<p>A calibration certificate is the evidence that an instrument was compared with traceable standards, and of what was found. ISO/IEC 17025:2017 clause 7.8 lists what it must contain. Every report needs a title, the laboratory's name and address, a unique number, the customer, the method, the item and its condition, the dates, the results with units, and who authorized it. A calibration certificate adds the measurement uncertainty, the environmental conditions, the traceability of the results, and, when the instrument was adjusted, the results before and after. The last section of this tool checks the record against that list.</p>

<h2>As found and as left</h2>
<p>The <b>as-found</b> reading is taken before anything is touched. It shows how the instrument was performing while it was in use. The <b>as-left</b> reading is taken after any adjustment, and it is the condition the instrument goes back into service in. An as-found reading out of tolerance matters even if the instrument was adjusted. Product measured with it since its last good calibration may be wrong, so the customer must be told and an <a href="/tools/cqt-calibration-oot-impact.html">out-of-tolerance impact review</a> started. As-found data is also what a <a href="/tools/calibration-interval-adjustment.html">calibration interval</a> review uses.</p>

<h2>Decision rules</h2>
<p>A statement of conformity ("pass") has to say how the measurement uncertainty U was taken into account. That is the decision rule, and ISO/IEC 17025 requires it to be agreed with the customer and stated in the report. The rules here follow ILAC-G8:09/2019:</p>
<ul>
<li><b>Simple acceptance:</b> a reading inside the limits passes. The risk of a wrong pass is shared, and for a reading right at a limit it is about 50%.</li>
<li><b>Guarded acceptance, w = U:</b> a reading must be at least U inside the limits to pass. This keeps the false-accept risk at about 2.5% or less.</li>
<li><b>Non-binary:</b> pass, conditional pass (inside the limits but within U of one), conditional fail (outside but within U), and fail.</li>
</ul>
<p>The <a href="/tools/tur-tar-guard-band-pfa.html">guard-band calculator</a> shows what each rule does to the false-accept and false-reject risk.</p>

<h2>The label</h2>
<p>The label is the user's view of the calibration status: the instrument ID, the calibration date, the due date and who did it. A "limited calibration" label says the instrument may only be used within stated limits. An instrument that still fails as left is labeled rejected and kept out of use. Due dates here add whole months, and a day that does not exist in the due month becomes its last day: January 31 plus one month is February 28 or 29.</p>

<h2>Traceability</h2>
<p>Each reference standard listed has its own certificate, and that chain of calibrations, each with its uncertainty, links the result back to the SI. A standard past its own due date on the day of the calibration breaks the chain; the tool flags it.</p>

<h2>On the exam</h2>
<p>CCT III.H asks you to distinguish calibration certificates, calibration labels, nonconformance reports and test reports, and III.G covers the records behind them. IV.C covers the statement of conformity and decision rule, V.D.1 determining conformance status, and V.D.2 the impact assessment after an out-of-tolerance finding. CQE IV.E covers calibration and traceability, and CMDA III.D.7 asks you to review calibration records and their traceability.</p>
"""),

dict(slug="rounding-significant-figures", name="Rounding and significant figures",
covers="CCT IV.D.5, II.C",
title="Rounding and Significant Figures Calculator — Half Up, Half Even, Truncate | SC Quality Guild",
desc="Free rounding calculator: significant figures, decimal places or an increment; half up, half to even and truncation; the rules for sums and products.",
h1="Rounding and significant figures",
lede="Round values to significant figures, decimal places or the nearest increment, and see half up, half to even and truncation side by side. Count the significant figures in a reading, find its least significant digit, and round sums and products correctly.",
content="""
<h2>Significant figures</h2>
<p>The significant figures in a recorded value are the digits that carry information about the measurement. The rules:</p>
<ul>
<li>Nonzero digits are significant, and so are zeros between them: 1205 has four.</li>
<li>Leading zeros are not: 0.004050 has four (4, 0, 5, 0).</li>
<li>Trailing zeros after a decimal point are significant: 12.50 says the reading was resolved to 0.01, which 12.5 does not.</li>
<li>Trailing zeros in a whole number are ambiguous: 1250 could have three or four. Write 1.250 &times; 10<sup>3</sup> or 1.25 &times; 10<sup>3</sup> to say which.</li>
</ul>
<p>The <b>least significant digit</b> is the last one recorded. Its place value (0.01 for 12.50) is the resolution of the value as written.</p>

<h2>Rounding rules</h2>
<p>All the rules agree except on an exact tie, where the part dropped is exactly half of the last kept place.</p>
<ul>
<li><b>Round half up</b> (away from zero): 2.345 becomes 2.35. It is what most people learn at school and what many spreadsheets do.</li>
<li><b>Round half to even:</b> a tie goes to the even neighbor, so 2.345 becomes 2.34 and 2.355 becomes 2.36. Over many values the ties go up and down equally often, so averages are not pushed upward. ASTM E29 and ISO 80000-1 use this rule for test data.</li>
<li><b>Truncate:</b> drop the digits. Truncation always moves toward zero, so it biases results. Use it only where a procedure calls for it.</li>
</ul>
<p>Rounding to an <b>increment</b> such as 0.02 or 0.5 rounds to the nearest multiple of it, the way a reading is taken from a scale with those divisions.</p>
<p>The tool works on the decimal digits exactly as typed, not on a binary approximation, so 2.345 really is a tie.</p>

<h2>Round once, at the end</h2>
<p>Rounding twice can give a different answer from rounding once: 2.3449 rounded to 2.345 and then to three figures half up gives 2.35, but 2.3449 rounded straight to three figures is 2.34. Carry at least one extra digit through intermediate steps and round the final result.</p>

<h2>Sums and products</h2>
<ul>
<li><b>Adding and subtracting:</b> the result is known only to the decimal place of the least precise term. 12.52 + 3.1 &minus; 0.448 = 15.172, reported as 15.2.</li>
<li><b>Multiplying and dividing:</b> the result keeps as many significant figures as the factor with the fewest.</li>
<li><b>Exact numbers</b>, such as counts and defined constants (25.4 mm per inch), do not limit the result.</li>
</ul>
<p>These rules are a rough way of not claiming more precision than the data has. A proper statement of uncertainty does the job better, and the reported value is then rounded to match the uncertainty.</p>

<h2>On the exam</h2>
<p>CCT IV.D.5 asks you to determine the resolution of calculations, including the number of digits and the least significant digit, and to round and truncate to a specified number of digits. II.C covers resolution and readability of measurement data. Expect to round a calculator result to a given number of significant figures, and to spot the answer choice that rounded or truncated the wrong way.</p>
"""),

dict(slug="calibration-table-interpolation", name="Interpolation from a calibration table",
covers="CCT IV.D.4, IV.D.7",
title="Calibration Table Interpolation Calculator — Linear Interpolation and Extrapolation | SC Quality Guild",
desc="Free calibration table interpolation: the correction at any reading from a certificate table, with slope, intercept, a best-fit line and extrapolation flagged.",
h1="Interpolation from a calibration table",
lede="Enter the corrections, errors or true values a calibration certificate gives at a few points. Get the correction and the corrected value at any reading by straight-line interpolation, with the slope and intercept of each segment, a least-squares line through the table, and a flag on any reading outside it.",
content="""
<h2>Using a calibration table</h2>
<p>A calibration certificate reports what was found at a few test points: the error, the correction, or the true value at each one. To use the instrument between those points you need values in between. The simplest assumption, and the usual one, is that the instrument behaves in a straight line from one calibrated point to the next.</p>

<h2>Linear interpolation</h2>
<p>For a reading x between two table points (x<sub>1</sub>, y<sub>1</sub>) and (x<sub>2</sub>, y<sub>2</sub>):</p>
<ul>
<li>slope m = (y<sub>2</sub> &minus; y<sub>1</sub>) / (x<sub>2</sub> &minus; x<sub>1</sub>)</li>
<li>intercept b = y<sub>1</sub> &minus; m&middot;x<sub>1</sub></li>
<li>y = y<sub>1</sub> + (x &minus; x<sub>1</sub>)&middot;m, which is the same as y = m&middot;x + b</li>
</ul>
<p>In the worked example the correction is +0.25 psi at 100 psi and +0.30 psi at 150 psi, so at 120 psi it is 0.25 + 20 &times; (0.05 / 50) = +0.27 psi, and the corrected value is 120.27 psi.</p>

<h2>Correction, error or true value</h2>
<p>Get the sign right. The <b>error</b> is reading minus true value, so true = reading &minus; error. The <b>correction</b> is the error with its sign reversed, so true = reading + correction. Some certificates give the true (reference) value at each nominal reading instead. Say which one the table holds and the tool applies it the right way round.</p>

<h2>Extrapolation</h2>
<p>Outside the table there is no calibrated point on one side. Extending the end segment gives a number, but nothing on the certificate supports it: the instrument may bend away from the line beyond the last point tested. Treat an extrapolated value as unverified, and calibrate over the range you actually use.</p>

<h2>Slope, intercept and linearity</h2>
<p>The least-squares line through the whole table summarizes it with one slope (a gain error) and one intercept (an offset error). The largest departure of the table from that line is a measure of the instrument's nonlinearity. If it is small, a single line would do; if not, as in the worked example where the correction rises and then falls, point-to-point interpolation follows the instrument better. Spanning and zeroing adjust the slope and intercept; linearization deals with the departure from the line.</p>

<h2>On the exam</h2>
<p>CCT IV.D.4 asks you to interpret tables and graphs to find intermediate and extrapolated values, and to illustrate slope, intercept and linearity of data sets. IV.D.7 covers solving algebraic equations for the unknown, as in rearranging y = m&middot;x + b. Expect to interpolate a correction from a short table by hand, and to recognize when an answer depends on extrapolating beyond the data.</p>
"""),
]
