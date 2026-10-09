# Statistics tools, batch b6 (Oct 2026): attribute agreement analysis, Taguchi
# loss function and S/N ratios, variables sampling (Z1.9 style k-method),
# graphical methods for distributions, and time-series / moving average.
PAGES6B6 = [
dict(slug="attribute-agreement-analysis", name="Attribute agreement analysis",
covers="CSSBB V.C.1, CQE IV.F",
title="Attribute Agreement Analysis Calculator — Kappa and Percent Agreement | SC Quality Guild",
desc="Free attribute agreement analysis. Enter pass/fail or graded ratings by appraiser and trial; get percent agreement with exact 95% intervals, Fleiss' and Cohen's kappa.",
h1="Attribute agreement analysis",
lede="Enter how each appraiser rated each part, trial by trial, and the known standard. Get agreement within each appraiser, against the standard and between appraisers, with exact 95% confidence intervals and kappa, plus the parts that cause the trouble.",
content="""
<h2>What the study is for</h2>
<p>A gauge R&amp;R checks a measurement system that gives numbers. Many inspections give a decision instead: pass or fail, go or no-go, a defect grade, a call on whether a weld is acceptable. An attribute agreement analysis is the measurement system analysis for those decisions. It answers two questions. Do the inspectors agree with themselves and with each other? And do they agree with the right answer?</p>
<p>Pick parts that cover the range, with plenty of bad and borderline ones; a study made of obviously good parts makes everyone look perfect. Have an expert, or a measurement, set the standard for each part. Each appraiser then rates every part two or three times, blind, in a different random order each time.</p>

<h2>The four assessments</h2>
<ul>
<li><b>Within appraiser</b> (repeatability): the share of parts on which an appraiser gave the same rating in every trial, right or wrong.</li>
<li><b>Each appraiser vs standard</b> (accuracy): the share of parts on which every one of the appraiser&rsquo;s trials matched the standard. This is never higher than the within figure.</li>
<li><b>Between appraisers</b> (reproducibility): the share of parts on which every appraiser gave the same rating in every trial.</li>
<li><b>All appraisers vs standard</b>: the share of parts on which every rating matched the standard. It is the strictest figure and the one that describes the inspection as a whole.</li>
</ul>
<p>Each percentage is a proportion of a small number of parts, so each has a wide <b>confidence interval</b>. The intervals here are exact binomial (Clopper-Pearson) intervals. With 30 parts, an appraiser who matched on 27 (90%) has an interval of about 73% to 98%: the study cannot tell that appraiser from one who is right three times in four.</p>

<h2>Kappa</h2>
<p>Two inspectors who both pass 95% of parts will agree most of the time by chance alone. Kappa corrects for that: &kappa; = (P<sub>observed</sub> &minus; P<sub>chance</sub>) / (1 &minus; P<sub>chance</sub>). A kappa of 1 is perfect agreement, 0 is no better than chance.</p>
<ul>
<li><b>Fleiss&rsquo; kappa</b> handles any number of ratings per part. It is used here within each appraiser (the trials are the raters) and between appraisers (every rating is a rater).</li>
<li><b>Cohen&rsquo;s kappa</b> compares two sets of ratings. It is used against the standard, pooling all the appraiser&rsquo;s trials against the standard repeated once per trial.</li>
</ul>
<p>A common rule of thumb, given in the AIAG MSA manual: kappa above 0.75 is good to excellent agreement, below 0.40 is poor.</p>

<h2>Reading the result</h2>
<p>Fix repeatability first. An appraiser who cannot repeat their own decision cannot agree with anyone else. Then look at the table of ratings against the standard. An appraiser who passes bad parts (a miss) is a risk to the customer; one who fails good parts (a false alarm) is a cost. A part rated wrong in every trial points to a misunderstanding of the criterion, which training or a clearer limit sample fixes. Mixed ratings point to a criterion that is hard to judge, which better lighting, a gauge or boundary samples fix.</p>

<h2>On the exam</h2>
<p>The CSSBB Body of Knowledge lists percent agreement among the measurement system analysis tools and asks for an MSA of attribute measurement systems (V.C.1). The CQE covers measurement system analysis by quantitative and graphical methods (IV.F). Expect to calculate percent agreement from a small table, to say which assessment (within, between or vs standard) a figure describes, and to interpret a kappa value.</p>
"""),

dict(slug="taguchi-loss-function", name="Taguchi loss function and S/N ratio",
covers="CQPA III.F.4, CSSBB IX.C",
title="Taguchi Loss Function and Signal-to-Noise Ratio Calculator | SC Quality Guild",
desc="Free Taguchi quality loss function calculator. Find k from the loss at the tolerance edge, the loss per unit and average loss, and S/N ratios for all three goals.",
h1="Taguchi loss function and signal-to-noise ratio",
lede="Put a cost on being off target. Enter the tolerance and what a unit costs at its edge; get the loss constant k, the loss for any unit, the average loss of your process split into variation and off-target parts, and signal-to-noise ratios to compare settings.",
content="""
<h2>The idea</h2>
<p>The traditional view of quality is the goalpost: a part inside the specification is good and costs nothing, a part outside is bad. Genichi Taguchi argued that this is wrong. A part just inside the limit performs almost exactly like a part just outside it, and both perform worse than a part on target. Loss to the customer and to society starts as soon as a characteristic leaves its target and grows the further it goes.</p>
<p>He modeled the loss as a parabola, L(y) = k(y &minus; T)<sup>2</sup>. The constant k comes from one known point: if a unit at the edge of the tolerance, T &plusmn; &Delta;, costs A to scrap, rework or replace, then k = A / &Delta;<sup>2</sup>.</p>

<h2>Three kinds of characteristic</h2>
<ul>
<li><b>Nominal is best</b> (a diameter, a voltage): L = k(y &minus; T)<sup>2</sup>, k = A / &Delta;<sup>2</sup>.</li>
<li><b>Smaller is better</b> (wear, noise, impurity; the ideal is zero): L = k y<sup>2</sup>, k = A / &Delta;<sup>2</sup>, where &Delta; is the value at which the loss reaches A.</li>
<li><b>Larger is better</b> (strength, life): L = k / y<sup>2</sup>, k = A&Delta;<sup>2</sup>.</li>
</ul>

<h2>Average loss of a process</h2>
<p>Averaged over production, the nominal-is-best loss becomes k[&sigma;<sup>2</sup> + (&mu; &minus; T)<sup>2</sup>]. The two terms are the two ways to reduce it: cut the variation, or move the mean onto target. Centering is usually cheap; reducing variation usually needs a more robust design or process. The tool shows how much of the loss comes from each. (Texts differ on whether &sigma;<sup>2</sup> is estimated with n or n &minus; 1; with n, the formula equals the exact average of the per-unit losses.) For smaller is better it is k(&sigma;<sup>2</sup> + &mu;<sup>2</sup>).</p>

<h2>Signal-to-noise ratios</h2>
<p>In a Taguchi experiment, each run (a combination of control-factor settings) is measured several times under the noise factors the product will meet in use. The S/N ratio, in decibels, rolls the mean and the spread into one figure, and larger is always better:</p>
<ul>
<li>Nominal is best: S/N = 10 log<sub>10</sub>(&#563;<sup>2</sup> / s<sup>2</sup>)</li>
<li>Smaller is better: S/N = &minus;10 log<sub>10</sub>(mean of y<sup>2</sup>)</li>
<li>Larger is better: S/N = &minus;10 log<sub>10</sub>(mean of 1/y<sup>2</sup>)</li>
</ul>
<p>For nominal is best the optimization has two steps: pick the settings with the highest S/N, which makes the process insensitive to noise, then use a factor that moves the mean without changing S/N to put it on target. That is <b>robust design</b>: making the product or process work well despite variation it cannot control, instead of trying to control everything.</p>

<h2>On the exam</h2>
<p>The CQPA Body of Knowledge asks you to identify and describe Taguchi concepts: the quality loss function, robustness, controllable and uncontrollable factors, and the signal-to-noise ratio (III.F.4). The CSSBB covers robust design and tolerance design (IX.C). Expect to calculate k from a cost at the tolerance limit, the loss for one unit, or the average loss of a process from its mean and standard deviation, and to say which S/N ratio fits a characteristic.</p>
"""),

dict(slug="variables-sampling-plan", name="Variables sampling plan (k-method)",
covers="CQE IV.C.1, IV.C.2, CQPA III.C.1, III.C.2, CMDA V.C.2",
title="Variables Sampling Plan Calculator — Z1.9 Style k-Method and Form 2 | SC Quality Guild",
desc="Free variables acceptance sampling calculator. Enter n and k from your plan, the limits and the sample; get Q, accept or reject, the estimated percent nonconforming and the OC curve.",
h1="Variables sampling plan: the k-method",
lede="Enter the sample size and acceptability constant from your plan (for example ANSI/ASQ Z1.9), the specification limits and the measurements. Get the quality index, the accept or reject decision, the Form 2 estimate of percent nonconforming, and the OC curve of the plan.",
content="""
<h2>Variables or attributes?</h2>
<p>An attributes plan (such as ANSI/ASQ Z1.4) counts the defectives in the sample. A variables plan measures each unit and uses the sample mean and standard deviation. Because a measurement carries more information than a pass/fail call, a variables plan gives the same protection with a much smaller sample. The price is an assumption: the characteristic must be normally distributed, and each plan covers one characteristic. A lot can be rejected even though every unit in the sample is within specification, because the plan judges how much of the lot is likely beyond the limit.</p>

<h2>Form 1: the k-method</h2>
<p>With the variability unknown (the usual case, the standard deviation method), compute the sample mean x&#772; and standard deviation s, then the quality index for each limit:</p>
<ul>
<li>upper limit: Q<sub>U</sub> = (U &minus; x&#772;) / s</li>
<li>lower limit: Q<sub>L</sub> = (x&#772; &minus; L) / s</li>
</ul>
<p>Accept the lot if Q is at least the acceptability constant k from the plan. Q is the number of standard deviations between the mean and the limit, so the rule says the mean must sit at least k standard deviations inside. With the variability known from a long, stable record, use &sigma; in place of s; the plans for known variability need fewer units.</p>

<h2>Form 2: the M-method</h2>
<p>Form 2 turns Q into an estimate of the percent of the lot beyond the limit, p&#770;, and accepts if it is no more than the maximum allowable percent M. For an unknown &sigma; the estimate is the minimum-variance unbiased one, read from the beta distribution with parameters (n &minus; 2)/2; for a known &sigma;, it is the normal tail area beyond Q&radic;(n/(n &minus; 1)). For a single limit, Forms 1 and 2 of the same plan always agree. For <b>two specification limits</b>, Z1.9 uses Form 2: estimate p&#770;<sub>U</sub> and p&#770;<sub>L</sub> and accept if their sum is no more than M.</p>

<h2>Where n, k and M come from</h2>
<p>The standard&rsquo;s tables give a sample size code letter from the lot size and inspection level, then n, k and M for the AQL, with normal, tightened and reduced inspection and switching rules between them. This page does not reproduce those tables; read the values from your copy of the standard or from the plan agreed with your supplier or customer.</p>

<h2>What the plan protects against</h2>
<p>The OC curve shows the chance of accepting a lot against the percent of it beyond the limit. The point with a 95% chance of acceptance is near the AQL, the quality the producer can expect to pass; the 10% point is the quality the consumer can expect to be rejected (the LTPD, or limiting quality). The curve is computed from the noncentral t distribution for an unknown &sigma; and from the normal distribution for a known &sigma;.</p>

<h2>On the exam</h2>
<p>The CQE Body of Knowledge asks you to identify, interpret and apply ANSI/ASQ Z1.4 and Z1.9 for attributes and variables sampling (IV.C.2), with OC curves, AQL and LTPD (IV.C.1). The CQPA covers variables sampling and the OC curve (III.C.1, III.C.2), and the CMDA asks when to use a variables plan instead of an attributes plan (V.C.2). Expect to compute Q<sub>U</sub> or Q<sub>L</sub> and compare it with k, and to explain why a variables plan needs a smaller sample.</p>
"""),

dict(slug="probability-plot-stem-leaf-dot-plot", name="Dot plot, stem-and-leaf and probability plot",
covers="CQE VI.A.6, VI.A.7, CSSBB V.D.4, CQPA III.B.5",
title="Normal Probability Plot, Stem-and-Leaf, Dot Plot and Ogive Maker | SC Quality Guild",
desc="Free graphical methods tool. Paste one column of data; get a dot plot, a stem-and-leaf display, a normal probability plot with the Anderson-Darling test, and an ogive.",
h1="Dot plot, stem-and-leaf, probability plot and ogive",
lede="Paste one column of measurements. Get the dot plot, the stem-and-leaf display with depths, a normal probability plot with the Anderson-Darling test, and a cumulative frequency table with its ogive.",
content="""
<h2>Why more than a histogram</h2>
<p>A histogram and a box plot (see <a href="/tools/basic-statistics.html">basic statistics</a>) are the usual first look at a set of data. The pictures here answer other questions. Where exactly is each value? Is the distribution close enough to normal for a normal-based calculation? What share of values falls below a given point?</p>

<h2>Dot plot</h2>
<p>A dot plot puts one dot per value along a number line, stacking repeats. Nothing is grouped, so gaps, clusters, outliers and rounding (values piling up on whole numbers) are plain to see. It works best for small and moderate data sets.</p>

<h2>Stem-and-leaf display</h2>
<p>Each value is split into a <b>stem</b> (the leading digits) and a <b>leaf</b> (the next digit). With a leaf unit of 0.1, the value 16.4 has stem 16 and leaf 4; later digits are dropped, not rounded. Turned on its side the display is a histogram that keeps the actual numbers, so you can still read the minimum, maximum and median from it. When there are too few stems, each stem is split over two lines (leaves 0&ndash;4 and 5&ndash;9) or five. The depth column counts values from the nearer end; the line with the median shows its own count in parentheses.</p>

<h2>Normal probability plot</h2>
<p>The sorted values are plotted against the percentage of a normal distribution expected below each one. This tool uses Blom&rsquo;s plotting positions, (i &minus; 0.375)/(n + 0.25), and a percent axis scaled so a normal distribution plots as a straight line. The line drawn is the normal distribution with the sample mean and standard deviation.</p>
<ul>
<li><b>Points along the line:</b> consistent with a normal distribution.</li>
<li><b>An arc:</b> skewness. A long right tail bends the top of the plot to the right.</li>
<li><b>An S shape:</b> tails heavier or lighter than normal.</li>
<li><b>One or two points off at the end:</b> outliers.</li>
<li><b>Steps or a break in slope:</b> rounding, or a mixture of two processes.</li>
</ul>
<p>The <b>Anderson-Darling</b> statistic puts a number on the fit, weighting the tails, where normality matters most for capability and for variables sampling. A p-value below 0.05 is evidence that the data are not normal. A large p-value is not proof of normality, especially with few values. The plot correlation r is the correlation between the values and their normal scores; close to 1 means a straight plot. It is the basis of the Ryan-Joiner test.</p>

<h2>Cumulative frequency and the ogive</h2>
<p>A frequency table groups the values into classes and counts each one. Adding the counts down the table gives the cumulative frequency. Plotting the cumulative percent at each upper class boundary gives the <b>ogive</b>, from which you can read the share of values below any point, or the value below which a given share falls. Reading across at 50% estimates the median from the grouped data, L + ((n/2 &minus; F)/f) &times; w.</p>

<h2>On the exam</h2>
<p>The CQE Body of Knowledge asks you to construct and interpret frequency distributions, including cumulative ones (VI.A.6), and probability plots for normal and other distributions (VI.A.7). The CSSBB lists normal probability plots, frequency distributions and cumulative frequency distributions among the graphical methods (V.D.4), and the CQPA covers the advantages and limits of data plotting (III.B.5). Expect to read a stem-and-leaf display, to judge normality from a probability plot, and to read a percentile from an ogive.</p>
"""),

dict(slug="time-series-moving-average", name="Time series: moving average, trend and seasonality",
covers="CQE VI.E.3, CSSBB V.B.4, CMDA V.C.1",
title="Moving Average, Trend and Seasonal Index Calculator — Time Series | SC Quality Guild",
desc="Free time-series tool. Enter values in time order; get trailing or centered moving averages, a least-squares trend, seasonal indices by ratio to moving average, and a forecast.",
h1="Time series: moving average, trend and seasonal indices",
lede="Enter a series in time order. Get a trailing or centered moving average, the least-squares trend and whether it is real, seasonal indices by the ratio-to-moving-average method, and a trend-times-season forecast.",
content="""
<h2>What a time series hides</h2>
<p>Complaints, returns, scrap and demand recorded period by period usually mix several things: a long-run <b>trend</b>, a <b>seasonal</b> pattern that repeats every year (or week, or shift), longer <b>cyclical</b> swings, and irregular noise. Comparing this quarter with last quarter without separating them is how a team celebrates a seasonal dip or panics over a seasonal peak. Time-series analysis pulls the parts apart.</p>

<h2>Moving averages</h2>
<p>A moving average replaces each value with the average of a window of n consecutive values. It smooths out the noise and, when the window is exactly one season long, the seasonal pattern too, leaving the trend and cycle.</p>
<ul>
<li>A <b>trailing</b> moving average uses the latest n values. It can be updated as each period arrives, and it is a simple forecast of the next period, but it lags the data by (n &minus; 1)/2 periods and turns late.</li>
<li>A <b>centered</b> moving average is placed in the middle of its window, so it lines up with the data and does not lag, but it cannot be calculated at either end. With an even window (4 quarters, 12 months) the middle falls between two periods, so two adjacent averages are averaged again (a 2 &times; n moving average).</li>
</ul>

<h2>Trend</h2>
<p>A least-squares line through the values against the period number gives the trend: the slope is the change per period. The p-value tests whether the slope could be zero. With strong seasonality the line is fitted to the deseasonalized values, which gives a much cleaner estimate.</p>

<h2>Seasonal indices</h2>
<p>The ratio-to-moving-average method (the classical multiplicative decomposition):</p>
<ol>
<li>compute a centered moving average one season long, which holds the trend but none of the season;</li>
<li>divide each value by it, giving a ratio;</li>
<li>average the ratios for each position in the season (all the first quarters, all the second quarters, and so on);</li>
<li>scale the averages so they average exactly 1.</li>
</ol>
<p>An index of 1.20 means that season runs 20% above the trend. Dividing a value by its index <b>deseasonalizes</b> it, so that consecutive periods can be compared fairly. Multiplying the trend by the index gives a forecast that allows for both. Some texts average the ratios with a median instead of a mean to resist outliers; this tool uses the mean.</p>

<h2>Time series or control chart?</h2>
<p>A control chart asks whether a process is stable. A time series with a real trend or season is not stable by definition, and a control chart of it will signal again and again. Model the trend and season first, then chart what is left over.</p>

<h2>On the exam</h2>
<p>The CQE Body of Knowledge asks you to define, describe and use time-series analysis, including the moving average, to identify trends and seasonal or cyclical variation (VI.E.3). The CSSBB asks you to check for seasonality effects when collecting data (V.B.4), and the CMDA asks how quantitative data reveal patterns and trends (V.C.1). Expect to compute a moving average by hand, to say how a trailing average lags, and to interpret a seasonal index.</p>
"""),
]
