# -*- coding: utf-8 -*-
"""
Page content for the /calculators/ landing pages.

Every figure in these tables was computed before it was written — see
verified_numbers.txt. Nothing here is transcribed from a reference table.
"""

PAGES = [

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "sigma-level-dpmo",
 "route": "sigma",
 "title": "Sigma Level and DPMO Calculator — With the 1.5 Shift | SC Quality Guild",
 "ogtitle": "Sigma level, DPMO and yield — including the 1.5 shift",
 "desc": "Free sigma level calculator. Convert between sigma, DPMO and yield, with the 1.5 shift applied the way the examinations apply it, and see why opportunity counting decides the answer.",
 "h1": "Sigma, DPMO and yield",
 "lede": "Drag the sigma level and watch the tails. The 1.5 shift applied the way the examinations apply it.",
 "cta_h": "Convert your own numbers",
 "cta_p": "Move between sigma level, DPMO and yield, and watch the tails move with them.",
 "content": """
<h2>What a sigma level actually counts</h2>

<p>A sigma level is a way of restating a defect rate as a distance. If the process output is normal
and the specification limits sit six standard deviations from the mean, the process is at six sigma.
Nothing more mystical than that.</p>

<p>The unit underneath it is <b>DPMO</b> — defects per million opportunities. Not defects per million
parts. That distinction is where most of the arguments start, and we will come back to it.</p>

<h2>The 1.5 sigma shift, and why the numbers look wrong without it</h2>

<p>Six sigma from the mean to each limit gives about two defects per billion (one in each tail). Yet every
reference says six sigma is <b>3.4 defects per million</b>. The gap is the 1.5 sigma shift.</p>

<p>The reasoning is that no real process holds its mean perfectly over the long run. Tools wear,
batches vary, setups drift. The convention allows the mean to wander up to 1.5 sigma either way and
reports the defect rate at that worst case. So a "six sigma" process is being scored as though it
were running at 4.5 sigma on its bad day.</p>

<div class="tw"><table class="fig">
<caption>COMPUTED — NOT TRANSCRIBED</caption>
<tr><th>Sigma level</th><th class="n">DPMO with 1.5 shift</th><th class="n">DPMO centered (both tails)</th><th class="n">Yield (shifted)</th></tr>
<tr><td>2</td><td class="n">308,538</td><td class="n">45,500</td><td class="n">69.15%</td></tr>
<tr><td>3</td><td class="n">66,807</td><td class="n">2,700</td><td class="n">93.32%</td></tr>
<tr><td>4</td><td class="n">6,210</td><td class="n">63</td><td class="n">99.379%</td></tr>
<tr><td>4.5</td><td class="n">1,350</td><td class="n">6.8</td><td class="n">99.865%</td></tr>
<tr><td>5</td><td class="n">233</td><td class="n">0.6</td><td class="n">99.977%</td></tr>
<tr><td>6</td><td class="n ok">3.4</td><td class="n">0.002</td><td class="n">99.99966%</td></tr>
</table></div>

<p>The two columns differ by more than three orders of magnitude at six sigma. <b>Whenever somebody
quotes you a sigma level, the first question is which column they used.</b> A supplier reporting
"4.5 sigma" means 1,350 DPMO if they shifted and 6.8 if they did not — a factor of two hundred.</p>

<div class="note">
  <p><b>The shift is a convention, not a law of nature.</b> It came out of Motorola's experience
  with long-term drift and it was never claimed to be universal. A tightly controlled process may
  drift far less; a poorly controlled one may drift more. It is applied because it makes numbers
  comparable, not because every process actually moves 1.5 sigma.</p>
</div>

<h2>Opportunity counting decides the answer</h2>

<p>DPMO has a denominator, and you choose it. A wiring harness with 400 solder joints can be counted
as one opportunity per harness or four hundred. Same defects, same harnesses, and the DPMO differs
by a factor of four hundred — which moves the sigma level by roughly one and a half to two full points.</p>

<p>This is the single easiest metric in quality to game, and it is usually gamed without anyone
intending to. Somebody counts opportunities generously during a good quarter, the number improves,
and nobody re-derives it.</p>

<ul>
  <li><b>Fix the opportunity definition in writing</b> before the first measurement, and keep it
    fixed. A sigma level is only comparable against its own history if the denominator never moved.</li>
  <li><b>Count opportunities that can genuinely fail independently.</b> If a single setup error
    puts the same defect on all four hundred joints, they were never four hundred opportunities.</li>
  <li><b>Never compare DPMO across companies</b> without comparing their opportunity definitions
    first. The comparison is almost always meaningless and occasionally deliberate.</li>
</ul>

<h2>Where sigma levels mislead</h2>

<ul>
  <li><b>The output is not normal.</b> The whole conversion assumes a normal distribution. Applied
    to a skewed or bounded characteristic — flatness, roundness, anything with a hard floor at zero
    — the tail estimate can be wrong by orders of magnitude.</li>
  <li><b>One number for a process with several characteristics.</b> Rolling them together hides the
    one that is actually failing.</li>
  <li><b>It says nothing about the customer.</b> A process can sit at five sigma against a
    specification that was never right in the first place.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "rolled-throughput-yield",
 "route": "yield",
 "title": "Rolled Throughput Yield Calculator — RTY and the Hidden Factory | SC Quality Guild",
 "ogtitle": "Rolled throughput yield — what your final yield is hiding",
 "desc": "Free rolled throughput yield calculator. Roll first pass yield across every step to get true RTY, normalized yield and the size of the hidden factory the final inspection number conceals.",
 "h1": "Yield, DPMO and sigma",
 "lede": "Roll first pass yield across every step to get true rolled throughput yield, normalized yield and the size of the hidden factory.",
 "cta_h": "Roll your own line",
 "cta_p": "Enter the first pass yield at each step and see what the whole line actually delivers.",
 "content": """
<h2>Final yield is not yield</h2>

<p>Most plants report the number of good units leaving the line divided by the number started. It
is easy to collect and it is close to useless, because it counts a unit that was reworked three
times as a pass.</p>

<p><b>Rolled throughput yield</b> asks a harder question: what fraction of units get all the way
through <i>without being touched</i>? Multiply the first pass yield of every step together and you
have it.</p>

<h2>The arithmetic is brutal, and that is the point</h2>

<div class="tw"><table class="fig">
<caption>COMPUTED — NOT TRANSCRIBED</caption>
<tr><th>Steps</th><th>First pass yield at each</th><th class="n">Rolled throughput yield</th><th class="n">Units touched (1 &minus; RTY)</th></tr>
<tr><td>5</td><td>99%</td><td class="n">95.10%</td><td class="n">4.90%</td></tr>
<tr><td>10</td><td>99%</td><td class="n">90.44%</td><td class="n hi">9.56%</td></tr>
<tr><td>20</td><td>99%</td><td class="n">81.79%</td><td class="n hi">18.21%</td></tr>
<tr><td>10</td><td>95%</td><td class="n">59.87%</td><td class="n hi">40.13%</td></tr>
<tr><td>25</td><td>99.9%</td><td class="n">97.53%</td><td class="n">2.47%</td></tr>
</table></div>

<p>Ten steps that each run at ninety-nine percent — a number every one of those step owners would
call good — deliver <b>90.4 percent</b> between them. Nearly one unit in ten is touched somewhere.
Take the same ten steps down to ninety-five percent each, still not obviously alarming on any
single line, and <b>four units in ten</b> need rework.</p>

<p>Nobody owns that number. Each step owner is reporting a healthy figure and the line is bleeding.
That gap is the whole reason RTY exists.</p>

<h2>The hidden factory</h2>

<p>The difference between final yield and rolled throughput yield is work that is really happening
and is nowhere in the plan: the touch-up bench, the re-test, the sort, the "just run it again".
It consumes labor, floor space, cycle time and material, and it is generally invisible to the cost
system because it was never a planned operation.</p>

<p>The useful thing about computing RTY is that it puts a number on that work for the first time.
Ten steps at 99 percent means the hidden factory is processing roughly one unit in ten, every day,
forever, and nobody has ever costed it.</p>

<div class="note">
  <p><b>Normalised yield is the honest average.</b> It is the geometric mean — the yield each step
  would have to run at to produce the same RTY. Ten steps at a normalized yield of 99 percent give
  90.4 percent overall, so quoting "our average yield is 99 percent" and "we lose nearly ten per
  cent" are the same statement. One of them gets acted on.</p>
</div>

<h2>Where RTY goes wrong in practice</h2>

<ul>
  <li><b>Rework is counted as a pass.</b> The most common error and the one that makes the whole
    measure pointless. If a unit was touched, that step did not yield it first pass.</li>
  <li><b>Steps are defined too coarsely.</b> Calling the whole assembly cell one "step" hides
    exactly the detail RTY exists to expose. The step boundary should be wherever a unit could be
    found bad.</li>
  <li><b>Inspection is treated as a step.</b> Inspection does not make units good; it sorts them.
    A high yield at an inspection step usually means the inspection is not detecting much.</li>
  <li><b>Scrapped units silently leave the denominator.</b> If a unit is scrapped at step three
    and the later steps are reported against what survived, the later yields are flattered.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "pareto-chart",
 "route": "pareto",
 "title": "Pareto Chart Builder — Is There Really a Vital Few? | SC Quality Guild",
 "ogtitle": "Pareto builder — and whether your vital few is real",
 "desc": "Free Pareto chart builder. Sorts, cumulates and draws the 80 percent line — then shows whether the vital few is real or an artifact of how you cut the categories.",
 "h1": "Pareto builder",
 "lede": "Sorts, cumulates and draws the 80 percent line, then tells you whether there is really a vital few or whether the categories need re-cutting.",
 "cta_h": "Build one from your data",
 "cta_p": "Paste your categories and counts. It sorts, cumulates and draws the line.",
 "content": """
<h2>What the 80 percent line is and is not</h2>

<p>A Pareto chart sorts categories by size and draws a cumulative curve across them. The convention
is to mark where the curve crosses eighty percent, and to call whatever sits to the left of that
mark the vital few.</p>

<p><b>There is no law that says eighty percent of your defects come from twenty percent of your
causes.</b> That is an observation that is often true, not a rule that must be. Plenty of real
processes produce a flat Pareto, and a flat Pareto is information — it says the problem is general,
not concentrated, and that hunting for a single big cause will waste your time.</p>

<h2>The chart depends entirely on how you cut the categories</h2>

<p>This is the part that gets skipped. Here are the <b>same one hundred defects</b>, from the same
plant in the same week, categorized two different ways:</p>

<div class="tw"><table class="fig">
<caption>COMPUTED — THE SAME 100 DEFECTS, CUT TWO WAYS</caption>
<tr><th>Cut by operation</th><th class="n">Count</th><th>Cut by failure mode</th><th class="n">Count</th></tr>
<tr><td>Op 30</td><td class="n">18</td><td>Seal nick on assembly</td><td class="n hi">52</td></tr>
<tr><td>Op 10</td><td class="n">17</td><td>Burr at cross-drill</td><td class="n">24</td></tr>
<tr><td>Op 40</td><td class="n">17</td><td>Paint run</td><td class="n">9</td></tr>
<tr><td>Op 20</td><td class="n">16</td><td>Label misaligned</td><td class="n">8</td></tr>
<tr><td>Op 50</td><td class="n">16</td><td>Packaging damage</td><td class="n">7</td></tr>
<tr><td>Op 60</td><td class="n">16</td><td>&mdash;</td><td class="n">&mdash;</td></tr>
</table></div>

<p>Cut by operation, you need <b>five of six categories</b> to reach eighty percent. The chart is
flat. It says there is no vital few and everything is equally bad.</p>

<p>Cut by failure mode, <b>one category is fifty-two percent on its own</b> and three of five get
you to eighty. The chart says: go and fix the seal nick.</p>

<p>Same defects. Same plant. Same week. One chart sends you away empty-handed and the other hands
you the job. <b>If the first cut looks flat, re-cut it before concluding there is nothing there.</b></p>

<h2>Count what it costs, not just how often</h2>

<p>A Pareto by occurrence treats a scratched label and a field return as one each. Weighting the
same categories by cost — scrap value, warranty, hours of containment — routinely reorders the
chart completely, and the cost chart is usually the one worth acting on.</p>

<p>Run both. Where they disagree is where the interesting conversation is.</p>

<h2>Where Pareto charts go wrong</h2>

<ul>
  <li><b>"Other" is the biggest bar.</b> If the catch-all category makes the top three, the
    categories are wrong and the chart cannot be read.</li>
  <li><b>Unlike units added together.</b> Counting defects, returns and complaints in one chart
    means the tallest bar belongs to whichever is easiest to record.</li>
  <li><b>One period treated as the truth.</b> A single month's chart is a sample. Check that the
    top category is still the top category over several before committing resource to it.</li>
  <li><b>It is used to close the analysis rather than open it.</b> Pareto tells you where to go
    looking. It does not tell you the cause, and the biggest bar is not a root cause.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "control-chart-constants",
 "route": "constants",
 "title": "Control Chart Constants — d2, d3, A2, D3, D4 Derived | SC Quality Guild",
 "ogtitle": "Control chart constants, derived rather than looked up",
 "desc": "Free control chart constants calculator. d2, d3, A2, D3 and D4 derived in your browser from the distribution of the range, for any subgroup size, with what each one is actually for.",
 "h1": "Control chart constants",
 "lede": "d₂, d₃, A₂, D₃ and D₄ derived in your browser from the distribution of the range. Nothing transcribed.",
 "cta_h": "Derive them for any n",
 "cta_p": "Pick a subgroup size and the constants are computed from the range distribution, not looked up.",
 "content": """
<h2>Where these constants come from</h2>

<p>Take <code>n</code> values from a normal distribution with standard deviation one, and record the
range — the largest minus the smallest. Do it forever. That range has a distribution of its own.</p>

<ul>
  <li><b>d&#8322;</b> is the mean of that distribution. It is the conversion factor between an
    average range and a standard deviation: <code>&sigma;&#770; = R&#772; / d&#8322;</code>.</li>
  <li><b>d&#8323;</b> is its standard deviation, which is what the range chart's own limits are
    built from.</li>
  <li><b>A&#8322;</b>, <b>D&#8323;</b> and <b>D&#8324;</b> are shortcuts assembled from those two so
    the limits can be worked out on a shop floor without a calculator — which is exactly why they
    exist. <code>A&#8322; = 3 / (d&#8322;&radic;n)</code>.</li>
</ul>

<p>None of them are arbitrary, and none of them were measured. They are properties of the normal
distribution, and they can be derived rather than looked up.</p>

<h2>Derived here, against the published tables</h2>

<p>These were computed from the range distribution and set beside the values printed in the standard
tables:</p>

<div class="tw"><table class="fig">
<caption>COMPUTED FROM THE RANGE DISTRIBUTION, vs PUBLISHED</caption>
<tr><th>n</th><th class="n">d&#8322; derived</th><th class="n">d&#8322; published</th><th class="n">A&#8322; derived</th><th class="n">A&#8322; published</th></tr>
<tr><td>2</td><td class="n">1.1284</td><td class="n">1.128</td><td class="n">1.880</td><td class="n">1.880</td></tr>
<tr><td>3</td><td class="n">1.6926</td><td class="n">1.693</td><td class="n">1.023</td><td class="n">1.023</td></tr>
<tr><td>4</td><td class="n">2.0588</td><td class="n">2.059</td><td class="n">0.729</td><td class="n">0.729</td></tr>
<tr><td>5</td><td class="n">2.3259</td><td class="n">2.326</td><td class="n">0.577</td><td class="n">0.577</td></tr>
<tr><td>6</td><td class="n">2.5344</td><td class="n">2.534</td><td class="n">0.483</td><td class="n">0.483</td></tr>
<tr><td>7</td><td class="n">2.7044</td><td class="n">2.704</td><td class="n">0.419</td><td class="n">0.419</td></tr>
<tr><td>10</td><td class="n">3.0775</td><td class="n">3.078</td><td class="n">0.308</td><td class="n">0.308</td></tr>
</table></div>

<p>They agree to every digit the tables carry. That is the point of deriving them: <b>a transcribed
table can contain a typo and you would never know.</b> A derived one cannot.</p>

<h2>What the constants assume</h2>

<div class="note">
  <p><b>Every one of these numbers assumes the underlying data is normal.</b> The range distribution
  they come from is the range distribution <i>of normal variates</i>. Apply <code>R&#772;/d&#8322;</code>
  to a strongly skewed characteristic and the sigma estimate is wrong before the chart is drawn.</p>
</div>

<h2>Where they get used incorrectly</h2>

<ul>
  <li><b>The subgroup size changed and the constant did not.</b> If the operator started taking
    four instead of five, every limit on the chart is now wrong. This is the most common error and
    the hardest to spot after the fact, because the chart still looks like a chart.</li>
  <li><b>Range used beyond about n = 10.</b> The range throws away everything between the two
    extremes, and past roughly ten that waste becomes serious. Use s and the c&#8324; family
    instead.</li>
  <li><b>D&#8323; treated as a typo when it is zero.</b> For n of six or less the lower range limit
    genuinely is zero — a subgroup of identical values is not a signal. It is not missing.</li>
  <li><b>Limits recalculated every period.</b> Control limits describe what the process has been
    doing. Recomputing them every month guarantees the process is always in control and the chart
    never tells you anything.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "sample-size",
 "route": "samplesize",
 "title": "Sample Size Calculator — Proportions, Means and the FPC | SC Quality Guild",
 "ogtitle": "Sample size — and when the population size actually matters",
 "desc": "Free sample size calculator for proportions and means, at your confidence and margin of error, with finite population correction — and when that correction actually changes anything.",
 "h1": "Sample size",
 "lede": "How many units you need for a proportion or a mean, at your confidence and margin of error, with finite population correction.",
 "cta_h": "Size your own study",
 "cta_p": "Confidence, margin of error and population size in; the number you need out.",
 "content": """
<h2>The number nearly everybody has heard</h2>

<p>For a proportion, at 95 percent confidence and a margin of error of five percentage points, you
need <b>385</b>. That single figure sits behind an enormous amount of survey and audit sampling,
and it is worth knowing where it comes from.</p>

<p>It assumes the worst case for the proportion itself. Variability of a proportion is largest at
fifty percent, so using p = 0.5 gives the biggest sample any proportion could require. If you
genuinely know the rate is near five percent, the required sample drops sharply — but if you are
guessing, 0.5 is the honest choice.</p>

<h2>When the population size matters, and when it does not</h2>

<p>The finite population correction reduces the sample when the population is small enough that
you would be taking a real bite out of it. People reach for it constantly. It is usually doing
nothing.</p>

<div class="tw"><table class="fig">
<caption>COMPUTED — 95% CONFIDENCE, &plusmn;5 POINTS, p = 0.5</caption>
<tr><th>Population</th><th class="n">Sample needed</th><th class="n">Saving vs 385</th></tr>
<tr><td>100</td><td class="n">80</td><td class="n ok">79%</td></tr>
<tr><td>200</td><td class="n">132</td><td class="n ok">66%</td></tr>
<tr><td>500</td><td class="n">218</td><td class="n">43%</td></tr>
<tr><td>1,000</td><td class="n">278</td><td class="n">28%</td></tr>
<tr><td>5,000</td><td class="n">357</td><td class="n">7%</td></tr>
<tr><td>50,000</td><td class="n">382</td><td class="n">0.8%</td></tr>
</table></div>

<p><b>Past a few thousand, the population size is irrelevant.</b> Sampling a city of fifty thousand
and a city of fifty million takes essentially the same number of people, which is the single most
counter-intuitive fact in sampling and the one most worth internalizing.</p>

<h2>This is not an acceptance sampling plan</h2>

<div class="note">
  <p>A sample size for <i>estimating</i> a proportion and a sample size for <i>accepting or
  rejecting a lot</i> are different calculations answering different questions. This page sizes an
  estimate to a margin of error. If what you actually want is "how many do I inspect before I ship
  this lot", you want an <a href="/calculators/sampling-plan-oc-curve.html">operating
  characteristic curve</a> and a stated producer's and consumer's risk instead.</p>
</div>

<h2>Where sample sizing goes wrong</h2>

<ul>
  <li><b>Margin of error read as relative.</b> &plusmn;5 points on a result of 8 percent means the
    true value is somewhere between 3 and 13 — which is not a useful answer. If you need precision
    around a small proportion, the sample is far larger than 385.</li>
  <li><b>The square root of n plus one.</b> Widely used, easy to remember, and it has no
    statistical basis at all. It produces a plan whose protection nobody has ever calculated.</li>
  <li><b>A representative number taken unrepresentatively.</b> The arithmetic assumes a random
    sample. Three hundred and eighty-five pieces all taken from the top of the last pallet satisfy
    the formula and none of its assumptions.</li>
  <li><b>Non-response ignored.</b> If you need 385 answers and half your recipients reply, you
    needed to ask 770 — and the half who did not reply may not resemble the half who did.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "gage-rr-impact-on-cpk",
 "route": "grrcpk",
 "title": "What Gauge R&R Does to Your Cpk — Calculator | SC Quality Guild",
 "ogtitle": "Gauge R&R against Cpk — measurement error has two different costs",
 "desc": "Free calculator showing what measurement error takes out of your capability. Watch gauge R&R widen the observed distribution, cut your Cpk, and start rejecting good parts.",
 "h1": "Gauge R&amp;R against Cpk",
 "lede": "Two sliders. Watch measurement error widen the curve you actually see, take a bite out of your Cpk, and start rejecting good parts.",
 "cta_h": "Try it on your process",
 "cta_p": "Set a true capability and a %GRR, and watch what the measured distribution does.",
 "content": """
<h2>You never see the process. You see the process plus the gauge.</h2>

<p>Every measurement carries the part's real variation and the measurement system's variation
together. They add as variances, so what you observe is wider than what exists:</p>

<p><code>&sigma;&sup2;<sub>observed</sub> = &sigma;&sup2;<sub>process</sub> + &sigma;&sup2;<sub>measurement</sub></code></p>

<p>Which means the Cpk you calculate is not your process capability. It is your process capability
after the gauge has had its share. Improve the gauge and the Cpk rises without a single thing
changing on the machine.</p>

<h2>The same gauge error costs you two completely different things</h2>

<p>This is the part that is not obvious, and it falls straight out of the arithmetic:</p>

<div class="tw"><table class="fig">
<caption>COMPUTED — 0.040 TOLERANCE, CENTERED PROCESS, 1,000,000 SIMULATED PARTS</caption>
<tr><th>True Cpk</th><th class="n">%GRR (of tolerance)</th><th class="n">Cpk you observe</th><th class="n">Good parts rejected</th><th class="n">Bad parts accepted</th></tr>
<tr><td>1.00</td><td class="n">10</td><td class="n">1.00</td><td class="n">0.04%</td><td class="n hi">11.0%</td></tr>
<tr><td>1.00</td><td class="n">30</td><td class="n">0.96</td><td class="n">0.20%</td><td class="n hi">23.9%</td></tr>
<tr><td>1.00</td><td class="n">50</td><td class="n">0.89</td><td class="n">0.55%</td><td class="n hi">31.4%</td></tr>
<tr><td>1.33</td><td class="n">30</td><td class="n">1.24</td><td class="n">0.02%</td><td class="n hi">31%</td></tr>
<tr><td>1.67</td><td class="n">10</td><td class="n">1.65</td><td class="n">0.00%</td><td class="n ok">~0 (under 1 ppm)</td></tr>
<tr><td>1.67</td><td class="n">30</td><td class="n hi">1.49</td><td class="n">0.00%</td><td class="n ok">0.0%</td></tr>
<tr><td>1.67</td><td class="n">50</td><td class="n hi">1.28</td><td class="n">0.01%</td><td class="n ok">0.0%</td></tr>
</table></div>

<p>Read down the Cpk 1.67 rows: a 30 percent gauge <b>costs you 0.18 of Cpk</b> — enough to fail a
customer requirement — and lets essentially nothing through, because a capable process barely puts
parts near the limits.</p>

<p>Now read the Cpk 1.00 rows: the same 30 percent gauge <b>barely moves the Cpk at all</b>, from
1.00 to 0.96, and quietly passes <b>nearly a quarter of the bad parts</b>.</p>

<div class="note">
  <p><b>On a capable process, gauge error shows up in your Cpk. On a marginal one, it shows up in
  your customer's inbox.</b> If you monitor only the capability number, the gauge problem is
  invisible in exactly the case where it is costing you the most.</p>
</div>

<h2>Why the acceptance criteria are what they are</h2>

<p>The conventional bands — under 10 percent acceptable, 10 to 30 percent conditional, over 30 per
cent not acceptable — look like round numbers chosen by committee. The table shows why they are not
unreasonable. At 10 percent the effects above are small in both directions. By 30 percent you are
losing real capability and passing real defects. Past that, you are measuring the gauge.</p>

<h2>What to do with a gauge you cannot improve</h2>

<ul>
  <li><b>Guard band.</b> Tighten the acceptance limits inside the specification by some fraction of
    the measurement error. You will reject more good parts on purpose in order to stop passing bad
    ones — an explicit trade rather than an accidental one.</li>
  <li><b>Average repeated readings.</b> Measuring three times and averaging cuts the repeatability
    standard deviation by a factor of &radic;3 (reproducibility between appraisers is not reduced). Slow, but it costs nothing in capital.</li>
  <li><b>Fix the process instead.</b> Lifting true Cpk from 1.00 to 1.67 makes the escape problem
    disappear on its own, as the table shows. Sometimes that is the cheaper project.</li>
  <li><b>Stop arguing about a number you cannot measure.</b> A supplier reporting Cpk from a 40 per
    cent gauge is reporting a fiction — almost certainly an understatement of the process, and an unknown escape rate. Settle the measurement system first.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "linearity-study",
 "route": "linearity",
 "title": "Gauge Linearity Study Calculator — Bias Across the Range | SC Quality Guild",
 "ogtitle": "Linearity study — does your gauge stay accurate at both ends?",
 "desc": "Free gauge linearity calculator. Certified references across the operating range, %EV at each and pooled, and whether the accuracy you proved at the midpoint holds end to end.",
 "h1": "Linearity study",
 "lede": "Certified references across the operating range. %EV at each and pooled against the tightest tolerance, then whether bias stays constant end to end.",
 "cta_h": "Run your own study",
 "cta_p": "Enter certified references and repeated readings. Bias, slope and %EV across the range.",
 "content": """
<h2>Bias at one point is not accuracy</h2>

<p>A bias study takes one reference, measures it repeatedly, and reports how far off the average
sits. A <b>linearity study</b> asks a harder question: does that bias stay the same across the
whole range the gauge is used over?</p>

<p>Often it does not. Bias drifts with size — because of how the instrument was calibrated, wear
in a screw, a probe that deflects more on a larger part, a fixture that is not square. The gauge is
accurate where somebody checked it and steadily less accurate away from that point.</p>

<h2>A gauge that passes at the midpoint and fails at both ends</h2>

<div class="tw"><table class="fig">
<caption>COMPUTED — TOLERANCE 0.100 ACROSS THE RANGE</caption>
<tr><th>Certified reference</th><th class="n">Bias</th><th class="n">As % of tolerance</th></tr>
<tr><td>2.00</td><td class="n">&minus;0.012</td><td class="n hi">12.0%</td></tr>
<tr><td>4.00</td><td class="n">&minus;0.005</td><td class="n">5.0%</td></tr>
<tr><td>6.00</td><td class="n">+0.001</td><td class="n ok">1.0%</td></tr>
<tr><td>8.00</td><td class="n">+0.008</td><td class="n">8.0%</td></tr>
<tr><td>10.00</td><td class="n">+0.017</td><td class="n hi">17.0%</td></tr>
</table></div>

<p>The fitted slope is <b>+0.00355 of bias per unit of reference</b>, and the bias swings
<b>0.029 across the range — twenty-nine percent of the whole tolerance</b>, purely as a function
of where in the range you happen to be working.</p>

<p><b>A single-point check at 6.00 would have reported a bias of 0.001 and passed without
comment.</b> That is the entire argument for doing linearity rather than bias alone.</p>

<div class="note">
  <p><b>A linear bias is the good case.</b> When bias drifts smoothly with size you can at least
  see it, model it and often correct it. A study that comes back scattered — bias jumping about
  with no pattern — is usually telling you something worse: the measurement is not repeatable
  enough for the question to even be meaningful, and gauge R&amp;R is the study you needed first.</p>
</div>

<h2>Reading the result</h2>

<ul>
  <li><b>Slope near zero, small scatter.</b> Bias is constant across the range. A single correction
    handles it, and a single-point verification is genuinely adequate.</li>
  <li><b>Clear slope.</b> The gauge reads progressively high or low with size. Recalibrate across
    the range rather than at one point, and check what the instrument is doing mechanically.</li>
  <li><b>No slope but wide scatter at each point.</b> Repeatability is the problem, not linearity.
    Stop here and run a gauge R&amp;R.</li>
</ul>

<h2>Where linearity studies go wrong</h2>

<ul>
  <li><b>References that do not span the working range.</b> Five standards clustered near the
    middle cannot detect end-of-range drift, which is where it lives.</li>
  <li><b>Standards no better than the gauge.</b> The references need to be meaningfully more
    accurate than the instrument under test, and traceable. Otherwise you are comparing two
    unknowns.</li>
  <li><b>One reading per reference.</b> Without repeats you cannot separate bias from noise, and
    the slope you fit may be entirely imaginary.</li>
  <li><b>The operator knows the reference value.</b> If the study is not blind, the numbers have a
    way of landing where everybody expects them to.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "hypothesis-test-selector",
 "route": "hypothesis",
 "title": "Which Hypothesis Test Should I Use? — Selector | SC Quality Guild",
 "ogtitle": "Hypothesis test selector — choosing wrong costs more than computing wrong",
 "desc": "Free hypothesis test selector. Four questions and you have the right test, with the reasoning and the conditions it depends on — plus what running the wrong one actually costs you.",
 "h1": "Hypothesis test selector",
 "lede": "Four questions and you have the right test, with the reasoning and the conditions it depends on. Choosing wrong is more common than computing wrong.",
 "cta_h": "Work through the four questions",
 "cta_p": "Answer four questions about your data and get the test, its assumptions and what breaks it.",
 "content": """
<h2>The four questions</h2>

<p>Almost every routine comparison in quality work is settled by four answers. The software will
compute whatever you ask it to; the skill is asking for the right thing.</p>

<ul>
  <li><b>What kind of data?</b> Continuous measurements, or counts and proportions. This alone
    eliminates most of the list.</li>
  <li><b>What are you comparing?</b> One group against a target, two groups against each other, or
    more than two.</li>
  <li><b>Are the observations paired?</b> The same parts measured before and after, or the same
    parts by two gauges, are paired — and pairing is information you throw away if you ignore it.</li>
  <li><b>What can you assume?</b> Normality, equal variances, independence. Every test rests on
    something, and the assumption is usually what fails rather than the arithmetic.</li>
</ul>

<h2>Comparing more than two groups is where it goes wrong</h2>

<p>The most common serious error is not picking a t-test over a z-test. It is comparing several
groups by running t-tests on every pair.</p>

<p>Each test carries its own five percent chance of a false alarm. Run several and those chances
accumulate:</p>

<div class="tw"><table class="fig">
<caption>COMPUTED — PAIRWISE t-TESTS AT &alpha; = 0.05, TREATING THE TESTS AS INDEPENDENT</caption>
<tr><th>Groups compared</th><th class="n">Pairwise tests</th><th class="n">Chance of at least one false positive</th></tr>
<tr><td>2</td><td class="n">1</td><td class="n ok">5.0%</td></tr>
<tr><td>3</td><td class="n">3</td><td class="n">14.3%</td></tr>
<tr><td>4</td><td class="n">6</td><td class="n hi">26.5%</td></tr>
<tr><td>5</td><td class="n">10</td><td class="n hi">40.1%</td></tr>
<tr><td>6</td><td class="n">15</td><td class="n hi">53.7%</td></tr>
</table></div>

<p>Comparing six suppliers pairwise, <b>you are more likely than not to find a difference that is
not there.</b> You will then spend real money chasing it.</p>

<p>The fix is to ask the question once. ANOVA tests whether <i>any</i> of the groups differ while
holding the overall error rate at five percent, and only if it fires do you go looking at pairs —
with a method that accounts for how many comparisons you are making.</p>

<div class="note">
  <p><b>A p-value above 0.05 does not mean the groups are the same.</b> It means this data was not
  sufficient to show a difference. With a small enough sample you will fail to detect almost
  anything, and "no significant difference" quietly becomes "we did not look hard enough". If the
  result matters, the question to ask is what difference the study was actually powered to find.</p>
</div>

<h2>What the common tests assume</h2>

<ul>
  <li><b>One-sample t.</b> A mean against a target. Assumes roughly normal data, or enough of it
    that the mean is normal anyway.</li>
  <li><b>Two-sample t.</b> Two independent groups. Classically assumes equal variances; Welch's
    version does not and is the safer default when you are unsure.</li>
  <li><b>Paired t.</b> Before and after on the same items. Uses the differences, and is far more
    powerful than the two-sample test when the pairing is real. Using the wrong one here throws
    away the whole benefit of the design.</li>
  <li><b>ANOVA.</b> Three or more groups. Normality and equal variances across groups.</li>
  <li><b>Chi-square.</b> Counts in categories. Needs adequate expected counts per cell, not just
    adequate totals.</li>
  <li><b>Proportions test.</b> Pass and fail counts. Needs enough of both; it behaves badly when
    one is very rare.</li>
  <li><b>Non-parametric equivalents</b> &mdash; Mann-Whitney, Wilcoxon, Kruskal-Wallis &mdash;
    when normality genuinely fails and you cannot get more data. They ask a slightly different
    question, which is worth knowing before you quote the result.</li>
</ul>

<h2>Where these go wrong in practice</h2>

<ul>
  <li><b>The test was chosen after seeing the data.</b> Trying tests until one returns a p-value
    you like is the statistical equivalent of re-sampling a rejected lot.</li>
  <li><b>Statistical significance read as practical significance.</b> With 5,000 parts you can
    prove a difference of a micron. It does not follow that anyone cares.</li>
  <li><b>Independence assumed and absent.</b> Consecutive parts off one machine are not independent
    observations, and no test on this list survives that.</li>
</ul>
"""},

# ══════════════════════════════════════════════════════════════════════
{
 "slug": "sampling-plan-oc-curve",
 "route": "oc",
 "title": "OC Curve Calculator \u2014 Acceptance Sampling Plans | SC Quality Guild",
 "ogtitle": "OC curve calculator \u2014 what your sampling plan can actually detect",
 "desc": "Free operating characteristic curve calculator. Enter n and c, see producer's and consumer's risk against your AQL and RQL, and what the sampling plan can actually discriminate.",
 "h1": "Sampling plan and OC curve",
 "lede": "Enter n and c, see producer and consumer risk against your AQL and RQL, and the shape of what the plan can actually discriminate.",
 "cta_h": "Run it on your own numbers",
 "cta_p": "Enter n, c, your AQL and your RQL. The curve is drawn in your browser \u2014 nothing is uploaded and nothing is stored.",
 "content": """
<h2>What an OC curve actually shows</h2>

<p>An operating characteristic curve answers one question: <b>if a lot were this bad, how often
would this sampling plan let it through?</b> The horizontal axis is the true fraction defective in
the lot. The vertical axis is the probability that the plan accepts it.</p>

<p>Every attribute sampling plan has one, and the curve is fixed the moment you choose the sample
size and the acceptance number. You do not get to decide how much protection the plan gives you
after the fact — you decided it when you wrote <span style="font-family:var(--mono)">n</span> and
<span style="font-family:var(--mono)">c</span> on the control plan.</p>

<p>That is the value of drawing it. A plan on paper looks like a rule. The curve shows you what
the rule actually does.</p>

<h2>Producer's risk and consumer's risk</h2>

<p>Two points on the curve carry the names people argue about.</p>

<ul>
  <li><b>Producer's risk</b> is the chance of rejecting a lot that was good enough. It is read at
    the AQL, and it is conventionally around 5 percent — meaning a lot running at your AQL is
    accepted about 95 times in 100, and bounced the other five.</li>
  <li><b>Consumer's risk</b> is the chance of accepting a lot that was bad enough to matter. It is
    read at the RQL, sometimes called the LTPD, and it is conventionally around 10 percent.</li>
</ul>

<p>Both risks live on the same curve, and you cannot lower one without either raising the other or
increasing the sample size. That is the whole trade, and it is the reason two people can look at
the same plan and both be unhappy.</p>

<div class="note">
  <p><b>AQL describes a process average, not a per-lot allowance.</b> In ANSI/ASQ Z1.4 and
  ISO 2859-1 the acceptance quality limit is the worst tolerable <i>process average</i> across a
  continuing series of lots. It is not a budget of defects you are entitled to ship in any one
  lot, and a plan built at a given AQL will still accept individual lots running worse than it —
  that is what the curve is showing you.</p>
</div>

<h2>The sample size does the work, not the percentage</h2>

<p>The most expensive misunderstanding in acceptance sampling is the belief that inspecting a fixed
percentage of the lot gives consistent protection. It does not.</p>

<p>Take a rule that says "inspect 10 percent, accept on 2 or fewer." Run it against lots that are
genuinely 1.5 percent defective:</p>

<div class="tw"><table class="fig">
  <tr><th>Lot size</th><th>Sample</th><th class="n">Probability the lot is accepted</th></tr>
  <tr><td>200</td><td>n = 20, c = 2</td><td class="n">99.7%</td></tr>
  <tr><td>5,000</td><td>n = 500, c = 2</td><td class="n">2.0%</td></tr>
</table></div>

<p>Same written rule. Same quality. One lot sails through essentially every time and the other is
rejected forty-nine times in fifty. The only thing that changed was a number that has nothing to do
with how good the parts are.</p>

<p>Now hold the sample at 200 pieces and move the lot size instead, computed exactly rather than
approximated:</p>

<div class="tw"><table class="fig">
  <tr><th>Lot size</th><th class="n">n = 200, c = 2, at 1.5% defective</th></tr>
  <tr><td>2,000</td><td class="n">41.0%</td></tr>
  <tr><td>5,000</td><td class="n">41.7%</td></tr>
  <tr><td>20,000</td><td class="n">42.0%</td></tr>
  <tr><td>100,000</td><td class="n">42.1%</td></tr>
</table></div>

<p><b>A fiftyfold change in lot size moves the answer by about one point.</b> The discriminating
power is in n. This is why plans are written as a sample size and an acceptance number rather than
as a percentage, and why "we inspect ten percent" tells you almost nothing about what is being
caught.</p>

<h2>What c = 0 does and does not buy you</h2>

<p>Zero-acceptance plans are popular because they sound uncompromising — one defect and the lot
goes back. They do not, however, simply move the curve to the left.</p>

<p>A c = 0 curve has no shoulder. It starts falling the instant quality is anything other than
perfect, because the acceptance probability is simply the chance of drawing no defective at all.
Compare two plans that give <b>almost identical consumer protection</b>:</p>

<div class="tw"><table class="fig">
  <tr><th>True fraction defective</th><th class="n">n = 50, c = 0</th><th class="n">n = 200, c = 5</th></tr>
  <tr><td>0.5% &mdash; a good lot</td><td class="n">77.8%</td><td class="n">99.9%</td></tr>
  <tr><td>1.0%</td><td class="n">60.5%</td><td class="n">98.4%</td></tr>
  <tr><td>2.0%</td><td class="n">36.4%</td><td class="n">78.7%</td></tr>
  <tr><td>5.0% &mdash; a bad lot</td><td class="n">7.7%</td><td class="n">6.2%</td></tr>
</table></div>

<p>At 5 percent defective the two plans are the same — they let roughly one bad lot in fourteen
through. But at half a percent, the c = 0 plan <b>rejects 22 percent of perfectly good lots</b>
while the c = 5 plan rejects one in a thousand.</p>

<p>That is the trade, and it is not the one most people think they are making. You buy a smaller
sample and a rule that sounds uncompromising. You pay for it in returned lots that were fine, and
in the supplier relationship that goes with them.</p>

<p>Whether it is worth it depends on what a defect costs you downstream. It is a decision worth
making with the curve in front of you rather than on instinct.</p>

<h2>Where sampling plans go wrong in practice</h2>

<ul>
  <li><b>Re-sampling after a rejection.</b> "We'll pull another sample to be sure" discards the
    plan's protection entirely. The curve you designed assumed one sample and one decision. Two
    bites raises the acceptance probability at every quality level, including the bad ones.</li>
  <li><b>The plan was chosen by lot percentage.</b> See above. It is the single most common way a
    control plan ends up offering protection nobody ever calculated.</li>
  <li><b>The AQL was negotiated rather than derived.</b> If nobody can say what the two risks are
    or where they were read, the number came from a meeting, not from a curve.</li>
  <li><b>Sampling a stratified lot as though it were homogeneous.</b> A plan's mathematics assume
    the sample represents the lot. Three pallets from three different setups in one lot break that
    assumption before the first piece is measured.</li>
  <li><b>Nobody knows what the plan detects.</b> Ask what fraction defective the plan would catch
    nine times out of ten. If the answer is a shrug, the plan is a ritual.</li>
</ul>
"""},

]
