"""CSSGB statistics and DOE tools (agent f). Content dicts for build_one.py."""

PAGES4F = [
{
'slug': 't-test-calculator',
'name': 't test calculator',
'covers': 'CSSGB IV.B.1, IV.B.2',
'title': 't Test Calculator — One-Sample, Two-Sample and Paired, Free | SC Quality Guild',
'desc': 'Free t test calculator for one-sample, two-sample (Welch or pooled) and paired t tests. Paste data for t, df, exact p value, confidence interval and a dot plot.',
'h1': 't test calculator',
'lede': 'Paste one or two samples, choose the test and the alternative, and get the t statistic, exact p value, confidence interval, an F test for equal variances and a dot plot.',
'content': '''
<h2>Which t test</h2>
<p>All three tests compare a mean with something when the population standard deviation is unknown and has to be estimated from the sample, which is nearly always the case in practice.</p>
<ul>
<li><b>One-sample t</b>: is the process mean different from a target or a claimed value μ₀? t = (x̄ − μ₀) / (s / √n), with n − 1 degrees of freedom.</li>
<li><b>Two-sample t</b>: do two independent groups (two machines, two suppliers, before and after on different parts) have different means? The <b>Welch</b> version does not assume equal variances and uses the Welch–Satterthwaite degrees of freedom, which are usually not a whole number. The <b>pooled</b> version assumes equal variances and uses n₁ + n₂ − 2 degrees of freedom.</li>
<li><b>Paired t</b>: the same unit is measured twice (before and after, gauge A and gauge B on the same part). Work with the differences d and run a one-sample test on them with n − 1 df, where n is the number of pairs. Pairing removes the unit-to-unit variation, which is why it detects smaller changes than a two-sample test on the same data.</li>
</ul>
<h2>Reading the result</h2>
<p>The <b>p value</b> is the probability of a result at least as extreme as the one observed if the null hypothesis were true. If p is less than α, reject H₀. Failing to reject is not the same as proving H₀; it means the sample did not carry enough evidence. The <b>confidence interval</b> gives the same decision for a two-sided test: if the interval for the mean or the difference excludes the null value, the test rejects at α = 1 − confidence. A one-sided test gives a one-sided bound instead.</p>
<p>The tool also runs an <b>F test</b> on the ratio of the two sample variances. Many analysts use the Welch test by default: it loses little when the variances are equal and protects you when they are not.</p>
<h2>Assumptions and common traps</h2>
<ul>
<li>The data, or the paired differences, should come from an approximately normal population. Larger samples tolerate moderate skew.</li>
<li>Running a two-sample test on paired data throws away the pairing and usually hides a real effect.</li>
<li>Choose the alternative and α before seeing the data. Switching to a one-sided test after looking halves the p value and inflates the Type I error rate.</li>
</ul>
<h2>On the Green Belt exam</h2>
<p>Expect to pick the right test from a short scenario, compute a t statistic by hand from summary statistics, find degrees of freedom, read a critical value from the t table and state the conclusion in terms of H₀. Paired versus two-sample is a favorite distinction, as is the link between a confidence interval and a two-sided test.</p>
''',
},
{
'slug': 'one-way-anova',
'name': 'One-way ANOVA',
'covers': 'CSSGB IV.B.2',
'title': 'One-Way ANOVA Calculator With ANOVA Table and Interval Plot, Free | SC Quality Guild',
'desc': 'Free one-way ANOVA calculator. Paste up to six groups for the ANOVA table, F test, exact p value, R squared, group confidence intervals and a variance check.',
'h1': 'One-way ANOVA',
'lede': 'Paste up to six groups of data and get the single-factor ANOVA table, the F test with an exact p value, group means with confidence intervals and a check on equal variances.',
'content': '''
<h2>What one-way ANOVA tests</h2>
<p>Analysis of variance compares the means of three or more groups defined by one factor, such as four picking methods, three suppliers or five fixtures. The null hypothesis is that all the group means are equal; the alternative is that at least one differs. Running a t test on every pair instead inflates the overall chance of a false alarm: with four groups there are six pairs, and at α = 0.05 each, the chance of at least one false positive is far above 5 percent.</p>
<h2>Reading the ANOVA table</h2>
<ul>
<li><b>SS between</b> (treatment, factor) measures how far the group means sit from the grand mean, weighted by group size. <b>SS within</b> (error) is the variation of the observations around their own group mean. They add to <b>SS total</b>.</li>
<li><b>Degrees of freedom</b>: k − 1 between, N − k within, N − 1 total, where k is the number of groups and N the number of observations.</li>
<li><b>Mean squares</b> are SS divided by df. <b>F = MS between ÷ MS within</b>. If the group means are equal, F is about 1; a large F says the differences between groups are big compared with the noise inside them.</li>
<li>Compare the <b>p value</b> with α, or F with the critical F for (k − 1, N − k) df. <b>R²</b> = SS between ÷ SS total is the share of variation the factor explains.</li>
</ul>
<h2>Assumptions</h2>
<p>The observations are independent, each group is roughly normal, and the groups have about the same variance. ANOVA is fairly tolerant of non-normality when the groups are of similar size, and less tolerant of unequal variances, especially when the group sizes differ too. The tool runs Levene's test (median version, also called Brown–Forsythe) on the absolute deviations from each group median. If it flags unequal variances, Welch's ANOVA is the usual alternative.</p>
<h2>Common traps</h2>
<ul>
<li>A significant F does not say which means differ. Follow up with a multiple-comparison method such as Tukey's, or look at the interval plot as a first guide.</li>
<li>The group intervals here use the pooled standard deviation, the way most statistics packages draw them. Overlapping intervals do not prove the means are equal.</li>
<li>One-way ANOVA handles one factor. Two factors at once, with a possible interaction, need a two-way ANOVA or a designed experiment.</li>
</ul>
<h2>On the Green Belt exam</h2>
<p>Expect to complete a partly filled ANOVA table (find a missing df, MS or F), state the hypotheses, compare F with a critical value and say what the result means for the process. Knowing that F is a ratio of two variance estimates answers many of these questions.</p>
''',
},
{
'slug': 'chi-square-proportions-test',
'name': 'Chi-square and proportions test',
'covers': 'CSSGB IV.B.2',
'title': 'Chi-Square Test of Independence and Two-Proportion Test, Free | SC Quality Guild',
'desc': 'Free chi-square test of independence calculator. Enter counts for expected values, cell contributions, the p value, proportions and a 2×2 z test.',
'h1': 'Chi-square and proportions test',
'lede': 'Enter counts in a contingency table to test whether the outcome is associated with the group, with expected counts, cell contributions, proportions with confidence intervals and the two-proportion z test for a 2×2 table.',
'content': '''
<h2>When to use a chi-square test of independence</h2>
<p>Use it when both variables are categorical and you have counts: pass or fail by shift, defect type by supplier, readmitted or not by unit. The null hypothesis is that the two variables are independent, which means every row has the same mix of outcomes. The alternative is that the outcome mix differs between rows, that is, the two variables are associated.</p>
<h2>How the statistic is built</h2>
<ul>
<li>The <b>expected count</b> in each cell is (row total × column total) ÷ grand total. It is what the cell would hold if the outcome did not depend on the group.</li>
<li>Each cell contributes <b>(O − E)² ÷ E</b>. The chi-square statistic is the sum of the contributions.</li>
<li><b>Degrees of freedom</b> = (rows − 1) × (columns − 1). Compare χ² with the critical value from the chi-square table, or the p value with α.</li>
<li>The largest contributions show where the dependence lives. Compare observed with expected in those cells to describe it in plain words.</li>
</ul>
<h2>Proportions</h2>
<p>When the outcome has two categories, the table is a comparison of proportions. The tool shows each row's proportion with a Wilson confidence interval, which behaves better than the simple normal (Wald) interval when the proportion is near 0 or 1 or the sample is small. For a 2×2 table it also runs the <b>two-proportion z test</b> with the pooled proportion. Its z² equals the chi-square statistic computed without a continuity correction, so the two tests give the same p value. Some texts and software apply Yates' continuity correction to 2×2 tables, which gives a slightly larger p value.</p>
<h2>Conditions and traps</h2>
<ul>
<li>Enter counts, never percentages. The test depends on the sample size.</li>
<li>The chi-square approximation needs reasonable expected counts. A common rule is that no expected count is below 1 and no more than 20 percent are below 5. For a small 2×2 table use Fisher's exact test.</li>
<li>Each unit must fall in exactly one cell, and the units must be independent.</li>
<li>A significant result shows association, not cause. A large sample can make a small difference significant; Cramér's V gives a sense of strength.</li>
</ul>
<h2>On the Green Belt exam</h2>
<p>Expect to compute an expected count, a cell contribution or the degrees of freedom for a contingency table, and to choose between a chi-square test and a test of means from a short scenario. The goodness-of-fit form of the chi-square test (observed counts against a claimed distribution) uses the same (O − E)² ÷ E arithmetic with k − 1 degrees of freedom.</p>
''',
},
{
'slug': 'full-factorial-doe',
'name': '2ᵏ full factorial DOE',
'covers': 'CSSGB V.A.1, V.A.2',
'title': 'Full Factorial DOE Calculator — 2^k Effects and Interaction Plots | SC Quality Guild',
'desc': 'Free 2^k full factorial DOE calculator for two to four factors with replicates: effects, coefficients, p values, Pareto of effects and interaction plots.',
'h1': '2ᵏ full factorial DOE',
'lede': 'Lay out a two-level full factorial for two to four factors, type the responses and get the effects, coefficients, significance tests, a Pareto of effects and main effects and interaction plots.',
'content': '''
<h2>The language of designed experiments</h2>
<ul>
<li><b>Factor</b>: an input you set on purpose (mold temperature). <b>Level</b>: a setting of a factor (40 °C and 60 °C, coded − and +). <b>Response</b>: the output you measure.</li>
<li><b>Run</b> (treatment combination): one setting of every factor. A <b>2^k full factorial</b> runs every combination of k factors at two levels, 2^k runs in all.</li>
<li><b>Replicate</b>: a complete independent repeat of a run, giving an estimate of pure error. A repeated measurement of the same part is not a replicate.</li>
<li><b>Randomization</b> protects against lurking variables such as tool wear or ambient temperature; <b>blocking</b> removes a known nuisance source such as material lot or day.</li>
<li>The design is <b>balanced and orthogonal</b>: each factor is at each level equally often and the effects can be estimated independently of each other.</li>
</ul>
<h2>Effects and coefficients</h2>
<p>The <b>main effect</b> of a factor is the average response at its high level minus the average at its low level. An <b>interaction</b> effect such as AB is computed the same way using the product of the coded columns; it measures how much the effect of A changes with the level of B. In coded units the regression coefficient is half the effect, and the constant is the grand mean. With r replicates, the standard error of every effect is 2s/√N, where s² is the pooled variance within runs and N = 2^k × r, and each effect gets a t test on 2^k(r − 1) degrees of freedom. With some replicates missing, effects come from the run means and the tests are approximate. An unreplicated design has no pure error; the tool then uses Lenth's pseudo standard error, which assumes most effects are inactive and needs k ≥ 3.</p>
<h2>Reading the plots</h2>
<ul>
<li><b>Main effects plot</b>: a steep line is a large effect; a flat line, a small one. The direction tells you which level to use for the goal.</li>
<li><b>Interaction plot</b>: parallel lines mean no interaction. Lines that diverge or cross mean the best level of one factor depends on the other, and the main effects alone can mislead.</li>
<li><b>Pareto of effects</b>: bars past the reference line are statistically significant at the chosen α.</li>
</ul>
<h2>Common traps</h2>
<ul>
<li>Two levels can only fit a straight line. Add center points to detect curvature before predicting between the levels.</li>
<li>Always run confirmation trials at the chosen settings before changing the process.</li>
<li>Fractional factorials save runs by confounding (aliasing) higher-order interactions with main effects; a full factorial has no aliasing.</li>
</ul>
<h2>On the Green Belt exam</h2>
<p>Expect DOE vocabulary questions, counting runs (2^k × replicates), computing a main or interaction effect from a small table, and reading main effects and interaction plots.</p>
''',
},
]
