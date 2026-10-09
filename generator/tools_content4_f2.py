"""CSSGB analysis tools, second set (agent f2): multi-vari, confidence intervals, attribute capability.
Content dicts for build_one.py."""

PAGES4F2 = [
{
'slug': 'multi-vari-chart',
'name': 'Multi-vari chart',
'covers': 'CSSGB IV.A.1',
'title': 'Multi-Vari Chart and Study — Families of Variation, Free | SC Quality Guild',
'desc': 'Free multi-vari chart tool. Enter readings by time, piece and position to plot the chart and split variation into within-piece, piece-to-piece and time-to-time.',
'h1': 'Multi-vari chart',
'lede': 'Enter readings by time period, piece and position to draw a multi-vari chart and estimate how much of the variation is within-piece, piece-to-piece and time-to-time.',
'content': '''
<h2>What a multi-vari study does</h2>
<p>A multi-vari study samples a running process in a nested pattern so that variation can be sorted into <b>families</b> before anyone guesses at causes. The classic three families are:</p>
<ul>
<li><b>Within-piece</b> (positional): differences between locations on the same unit, such as taper along a shaft, out-of-round, or thickness across a sheet.</li>
<li><b>Piece-to-piece</b> (cyclical): differences between consecutive units made close together in time.</li>
<li><b>Time-to-time</b> (temporal): differences between groups of units made at different times, shifts or lots.</li>
</ul>
<p>The study is passive: you do not change anything, you only measure. Its value is in ruling out whole families, which shrinks the list of suspects for the analysis that follows.</p>
<h2>Reading the chart</h2>
<p>Each vertical bar spans the readings on one piece, so long bars mean within-piece variation is large. Piece means that jump around inside a time period show piece-to-piece variation. Period means that drift or step from one period to the next show time-to-time variation. A position that is high on every piece, as in the taper of the worked example, is a systematic pattern with a fixed cause.</p>
<h2>How the percentages are estimated</h2>
<p>The tool runs a nested analysis of variance (pieces nested in time periods, readings nested in pieces) and converts the mean squares into variance components using their expected values. Each component is shown as a share of the total variance. Variances add; standard deviations do not, so percentages are always taken on the variance scale. When a mean square comes out smaller than the one below it, the formula gives a negative variance, which is reported as zero.</p>
<h2>Common traps</h2>
<ul>
<li>Sampling too few periods. The time-to-time estimate rests on the number of periods minus one, so three or four periods give a rough answer.</li>
<li>Letting the measurement system hide inside within-piece variation. Check the gauge first.</li>
<li>Treating the dominant family as the root cause. It points where to look; a designed experiment or a confirmation run proves the cause.</li>
</ul>
<h2>On the CSSGB exam</h2>
<p>Expect to look at a multi-vari chart and name the dominant family of variation, or to match a description (taper, warm-up drift, cycle-to-cycle scatter) to the family it belongs to. Know that multi-vari is an Analyze-phase tool used to narrow the search before hypothesis tests and experiments.</p>
''',
},
{
'slug': 'confidence-interval-calculator',
'name': 'Confidence interval calculator',
'covers': 'CSSGB III.B.2, IV.B.1, CQE VI.D.1, CSSBB VI.B.4',
'title': 'Confidence Interval Calculator — Mean, Proportion, Variance, Free | SC Quality Guild',
'desc': 'Free confidence interval calculator: mean, proportion and standard deviation, sample size, plus normal tolerance intervals (exact k) and prediction intervals.',
'h1': 'Confidence interval calculator',
'lede': 'Enter summary statistics or raw data to get confidence intervals for a mean, a standard deviation and a proportion, the sample size needed for a target margin of error, and tolerance and prediction intervals for individual values.',
'content': '''
<h2>What a confidence interval says</h2>
<p>A point estimate such as x̄ or p̂ is almost never exactly equal to the population value. A confidence interval adds a margin around it: estimate ± critical value × standard error. A 95% confidence level describes the method, not one interval: if you repeated the sampling many times, about 95% of the intervals built this way would contain the true value. It does not mean there is a 95% probability that this particular interval contains it.</p>
<h2>Which formula</h2>
<ul>
<li><b>Mean, σ known</b>: x̄ ± z·σ/√n. Rare in practice; σ must come from long, stable history.</li>
<li><b>Mean, σ unknown</b>: x̄ ± t·s/√n with n − 1 degrees of freedom. This is the usual case. t is wider than z for small samples and approaches it as n grows.</li>
<li><b>Variance</b>: from (n − 1)s²/χ² using the upper and lower chi-square values with n − 1 df. Take square roots for σ. The interval is not symmetric around s and relies heavily on normal data.</li>
<li><b>Proportion</b>: the normal approximation (Wald) is p̂ ± z√(p̂(1 − p̂)/n). The <b>Wilson score</b> interval instead finds every p for which p̂ would not be surprising; it pulls the center toward 0.5 and never runs below 0 or above 1. The <b>exact</b> (Clopper–Pearson) interval comes straight from the binomial distribution and is conservative.</li>
</ul>
<h2>Why Wilson and Wald differ</h2>
<p>The Wald interval uses p̂ to estimate its own standard error and assumes a symmetric normal shape. Near 0 or 1, or with few items counted, the true sampling distribution is skewed, so Wald intervals are too narrow and can include impossible negative values. A common rule says the normal approximation needs np̂ and n(1 − p̂) of at least 5, or 10 in stricter texts. The Wilson interval keeps close to its stated coverage even when those counts are small.</p>
<h2>Sample size for a margin</h2>
<p>For a mean, n = (zσ/E)²; for a proportion, n = z²p(1 − p)/E², with p = 0.5 when nothing is known. Always round up. Halving the margin quadruples n.</p>
<h2>Three intervals that are easy to confuse</h2>
<ul>
<li><b>Confidence interval for the mean</b>, x̄ ± t·s/√n: where the process <i>average</i> is. It shrinks toward zero width as n grows.</li>
<li><b>Prediction interval</b>, x̄ ± t·s·√(1 + 1/n): where the <i>next single value</i> will fall. It never gets narrower than about ±t·s.</li>
<li><b>Tolerance interval</b>, x̄ ± k·s: where at least a stated share P of <i>all individual values</i> fall, with confidence γ. It has two percentages (for example 95% confidence that 99% of values are covered) and is the one to compare with specification limits.</li>
</ul>
<p>The tolerance factor k depends on n, P and γ. The tool computes it exactly under the normal model: the one-sided k from the noncentral t distribution, k = t′<sub>γ; n−1, z<sub>P</sub>√n</sub>/√n, and the two-sided k by numerical integration of Odeh's exact equation. It also shows the hand approximations most texts teach, Howe's two-sided k ≈ z<sub>(1+P)/2</sub>·√((n − 1)(1 + 1/n)/χ²<sub>1−γ; n−1</sub>) and the Natrella one-sided formula, so you can see how close they are. Published tables of exact factors give the same values. Tolerance and prediction intervals depend on the individual values being normal far more than a confidence interval for the mean does; check a normal probability plot first.</p>
<h2>On the exam</h2>
<p>CSSGB: expect to compute an interval by hand from n, x̄ and s with a t table, choose between z and t, compute a proportion interval with the normal approximation, and find the sample size for a stated margin. Interpreting the interval correctly is tested as often as the arithmetic. CQE VI.D.1 adds standard error and tolerance intervals, and CSSBB VI.B.4 asks you to distinguish confidence and prediction intervals and to calculate tolerance and confidence intervals: expect to compute x̄ ± k·s with k from a table and to say which interval answers a given question.</p>
''',
},
{
'slug': 'attribute-capability',
'name': 'Attribute capability',
'covers': 'CSSGB II.E.1, III.F.3, III.F.4, VI.A.3',
'title': 'Attribute Process Capability — % Defective, DPU, DPMO, Z.bench | SC Quality Guild',
'desc': 'Free attribute capability tool. Enter defectives and defects by subgroup for % defective, PPM, DPU, DPMO and Z.bench, with and without the 1.5 shift.',
'h1': 'Attribute capability',
'lede': 'Enter units inspected, defective units and defects by subgroup to get binomial and Poisson capability, DPMO, Z.bench with and without the 1.5 shift, and p and u charts to check stability.',
'content': '''
<h2>Capability when the data are counts</h2>
<p>Cp and Cpk need a measured characteristic and specification limits. When the output is pass or fail, or a count of nonconformities, capability is stated as a rate instead. Two models apply:</p>
<ul>
<li><b>Binomial</b> (defectives): each unit is good or bad. Capability is the average proportion defective p̄, often quoted as PPM defective or as yield, 1 − p̄.</li>
<li><b>Poisson</b> (defects): a unit can carry several defects. Capability is defects per unit, DPU. Dividing by opportunities per unit gives DPO, and DPO × 1,000,000 is DPMO. Under the Poisson model the share of units with no defects is e<sup>−DPU</sup>.</li>
</ul>
<h2>Z.bench and the 1.5 shift</h2>
<p>To put an attribute rate on the same scale as variables capability, convert it to a standard normal value: <b>Z.bench = Φ⁻¹(1 − p)</b>, the Z that leaves a tail of area p. Because the data span the whole study, this is a long-term figure. The Six Sigma convention adds 1.5 to report a short-term sigma level, which is how 3.4 DPMO becomes six sigma. The tool labels both. The shift is a convention, not a measured property of your process, so always say which figure you quote. The <a href="/calculators/sigma-level-dpmo.html">sigma level and DPMO calculator</a> shows the conversion table in both directions.</p>
<h2>Stability comes first</h2>
<p>A capability figure predicts future output only if the process is stable. The tool draws a p chart for defectives and a u chart for defects, with limits that widen for smaller subgroups. Points outside the limits are special causes to remove before the rate means anything. Use 20 or more subgroups where you can.</p>
<h2>Common traps</h2>
<ul>
<li>Inflating opportunities. Counting every conceivable way a unit could fail lowers DPMO and raises the sigma level without any change the customer would notice.</li>
<li>Mixing defects and defectives. A unit with three defects is one defective.</li>
<li>Quoting a rate from very few failures. The confidence interval shows how little a handful of defectives pins down.</li>
</ul>
<h2>On the CSSGB exam</h2>
<p>Expect to compute DPU, DPO, DPMO and yield from a short scenario, convert DPMO to a sigma level with a table, and know that the table includes the 1.5 shift. Questions also test the difference between a defect and a defective.</p>
''',
},
]
