# Traceability, complaints and monitoring tools, batch b9 (Oct 2026):
# lot genealogy, complaint reportability, accelerated aging and alert/action
# levels. Written for CMDA, with the related CQPA and CQE topics.
PAGES6B9 = [
dict(slug="lot-traceability-genealogy", name="Lot traceability and genealogy record",
covers="CQPA IV.E, CQE IV.B.1, CMDA III.D.5, III.E",
title="Lot Traceability and Genealogy Record — Forward and Backward Trace | SC Quality Guild",
desc="Free lot genealogy tool. Link component lots to assemblies, serials and shipments; trace forward or back, and bound a recall to the customers affected.",
h1="Lot traceability and genealogy record",
lede="Record which lots went into which assemblies, serials and shipments. Trace a suspect lot forward to every customer it reached, trace a unit back to its component lots, and see the recall boundary drawn.",
content="""
<h2>Identification, status and traceability</h2>
<p>Three ideas that are easy to blur. <b>Identification</b> says what a thing is: part number, revision, lot or serial. <b>Status</b> says whether it may be used: awaiting inspection, accepted, rejected, on hold. <b>Traceability</b> is the ability to follow its history, application or location through recorded identification. A part can be well identified and still untraceable if nobody recorded which lot went into which assembly.</p>
<p>Traceability is what makes a problem small. If a supplier warns that one lot of cells is bad and you can say exactly which 210 units contain it and which three customers have them, you contact three customers. If you cannot, the recall covers everything built in the period, and that is a far larger, costlier and more alarming event.</p>

<h2>Forward and backward</h2>
<ul>
<li><b>Forward trace</b> (top down, "where did it go?") starts from a suspect lot of material or components and follows it through every subassembly and finished lot to the shipments and customers. It sets the boundary of a containment, correction or recall.</li>
<li><b>Backward trace</b> (bottom up, "what went into it?") starts from a unit, usually one returned in a complaint, and follows it back to the component lots, the equipment and the records of its build. It is the first step of most investigations.</li>
</ul>
<p>Auditors test traceability both ways. Pick a shipped serial number and ask for its component lots; pick a receiving lot and ask where it went. How long the answer takes says as much as the answer.</p>

<h2>Reading the record</h2>
<ul>
<li><b>Mixed lots.</b> When a finished lot was built from two lots of the same part, and nothing records which units got which, every unit in it is in scope. The tool flags these. Serial-level records, or not mixing lots at a workstation, narrow future recalls.</li>
<li><b>Stock not yet shipped.</b> The trace shows what left the building. Units still in stock, in work in process or in returns must be found and held too.</li>
<li><b>Gaps.</b> A shipment with no customer, a lot that appears nowhere, or a unit with no inputs is a hole in the record. In a recall, a hole is filled with "everything".</li>
</ul>

<h2>How much traceability?</h2>
<p>Traceability costs record keeping, so the level is set by risk and by regulation. Commodity hardware may be traced only to a receiving date. A critical component of a medical device is usually traced to the lot, and an implantable device to the serial number and the patient. ISO 13485 (7.5.9) requires a documented traceability procedure, with the extent defined by the organization and records of the components, materials and work environment for implantable devices. Pair this record with <a href="/tools/corrective-action-capa.html">corrective action</a> and nonconforming material controls so a suspect lot is segregated as soon as it is found.</p>

<h2>On the exam</h2>
<p>CQPA IV.E asks you to describe identifying material by lot, batch, source and conformance status, including the impact on recalls, and to preserve the identity of a product and its origin. CQE IV.B.1 asks you to distinguish identification, status and traceability and apply them (Analyze). CMDA III.D.5 asks you to use methods for identifying and tracing product through receipt, production, distribution, installation and servicing (Apply), and CMDA III.E covers recall, corrections, removals and tracking. Expect a scenario that asks which records let you bound a recall, or what a forward or backward trace would show.</p>
"""),
dict(slug="complaint-reportability-decision-guide", name="Complaint handling and reportability guide",
covers="CMDA III.D.11, III.D.12, III.E, CQE VII.C.4",
title="Complaint Handling and MDR Reportability Decision Guide | SC Quality Guild",
desc="Free complaint reportability study aid. Walk a medical device complaint through the MDR questions, see the decision path, report due date and trend.",
h1="Complaint handling and reportability decision guide",
lede="Take a medical device complaint through the questions an auditor expects: is it a complaint, was there a death or serious injury, did the device malfunction, is it reportable and by when. The path is drawn as you answer. A study aid, not regulatory advice.",
content="""
<h2>What counts as a complaint</h2>
<p>ISO 13485 defines a complaint as a written, electronic or oral communication that alleges deficiencies in the identity, quality, durability, reliability, usability, safety or performance of a medical device that has left the organization's control, or in a service that affects its performance. The source does not matter. A phone call to a sales representative, a remark in a service report and a post on social media can all be complaints. The most common audit finding is a communication that was logged as an "inquiry" and never evaluated.</p>

<h2>The complaint process</h2>
<ol>
<li><b>Receive and record</b> every communication, with the date the company became aware.</li>
<li><b>Decide whether it is a complaint.</b></li>
<li><b>Evaluate it for reporting</b> to the regulators, promptly, because the clock is already running.</li>
<li><b>Investigate</b>, unless a similar complaint has already been investigated and the justification is documented. A reportable complaint is always investigated.</li>
<li><b>Act and close.</b> Open corrective action where the cause warrants it, reply to the complainant, and record the outcome.</li>
<li><b>Trend.</b> Complaint data feed risk management, CAPA and management review.</li>
</ol>

<h2>US medical device reporting</h2>
<p>Under 21 CFR Part 803 a manufacturer reports when it becomes aware of information that reasonably suggests one of its devices:</p>
<ul>
<li>may have caused or contributed to a <b>death or serious injury</b>; or</li>
<li><b>malfunctioned</b>, and the malfunction would be likely to cause or contribute to a death or serious injury if it recurred.</li>
</ul>
<p>The standard report is due within <b>30 calendar days</b> of becoming aware. A <b>5-work-day report</b> is required when an event needs remedial action to prevent an unreasonable risk of substantial harm to public health, or when FDA asks for one in writing. Information found later goes in a supplemental report. A serious injury is one that is life-threatening, causes permanent impairment of a body function or permanent damage to a body structure, or needs medical or surgical intervention to prevent either.</p>
<p>Note what decides reportability: the event and the device's possible role, not proof of cause. "We could not reproduce the fault" does not by itself make a death or serious injury non-reportable.</p>

<h2>EU vigilance</h2>
<p>Under the EU MDR, manufacturers report <b>serious incidents</b> to the competent authority of the country where they happened, and report <b>field safety corrective actions</b>. A serious incident is one that directly or indirectly led, might have led or might lead to a death, a serious deterioration in health or a serious public health threat. The deadlines are counted from awareness and are shorter for deaths, unanticipated serious deterioration and serious public health threats. The EU also requires <b>trend reporting</b>: a statistically significant increase in incidents that are not serious, or in expected side effects, is reported even when no single event is. Check the current regulation and guidance for the exact terms.</p>

<h2>Reading the result</h2>
<p>The tool follows the US questions in order and shows the path taken. A gold outline marks the question still open; an open question does not stop the clock. The trend section compares the rate of similar complaints per 1,000 units with the year before, a simple first look; a formal trend analysis would use the methods in your procedures. Use it with the <a href="/tools/corrective-action-capa.html">CAPA tool</a> and the <a href="/tools/lot-traceability-genealogy.html">lot traceability record</a> when a complaint points to a lot.</p>

<h2>On the exam</h2>
<p>CMDA III.D.11 asks you to evaluate complaint handling procedures, including investigation and the determination of medical device reporting and incident reporting. III.D.12 adds service reports that must reach the complaint process, and III.E covers post-market surveillance: vigilance, MDR, adverse event reporting, trend reporting, recalls, corrections and removals. CQE VII.C.4 lists complaint tracking, trending and post-market surveillance as risk monitoring techniques. Expect scenarios that ask whether an event is reportable, which report applies, and what the auditor should look for in a complaint file.</p>
"""),
dict(slug="shelf-life-accelerated-aging", name="Shelf-life accelerated aging calculator",
covers="CMDA IV.B.3, IV.B.4",
title="Accelerated Aging Calculator — ASTM F1980 Q10 and Arrhenius | SC Quality Guild",
desc="Free accelerated aging calculator. ASTM F1980-style Q10 or Arrhenius: aging factor, chamber days for a shelf-life claim, or the temperature for a fixed time.",
h1="Shelf-life accelerated aging calculator",
lede="Enter the shelf life you want to claim, the storage temperature and the chamber temperature. Get the accelerated aging factor and the days in the chamber, or solve for the temperature that fits the time you have. Q<sub>10</sub> or Arrhenius.",
content="""
<h2>Why age packages in an oven</h2>
<p>A sterile device needs a shelf life: the time its packaging keeps the sterile barrier intact and the device stays within specification. Waiting three years to prove a three-year claim would hold every launch for three years, so manufacturers age samples at a raised temperature, test them, and run real-time aged samples alongside to confirm. ASTM F1980 is the guide most often used for the accelerated part, and ISO 11607 requires that the stability of the sterile barrier system be shown.</p>

<h2>The Q<sub>10</sub> rule</h2>
<p>The model assumes the chemical processes that degrade the materials follow the Arrhenius relationship, simplified to a rule of thumb: every 10 &deg;C rise multiplies the rate of aging by a factor Q<sub>10</sub>.</p>
<ul>
<li><b>Accelerated aging factor:</b> AAF = Q<sub>10</sub><sup>(T<sub>AA</sub> &minus; T<sub>RT</sub>)/10</sup>, with T<sub>AA</sub> the chamber temperature and T<sub>RT</sub> the ambient storage temperature.</li>
<li><b>Accelerated aging time:</b> AAT = desired real time / AAF.</li>
<li><b>Solving for temperature:</b> T<sub>AA</sub> = T<sub>RT</sub> + 10 &times; log(AAF) / log(Q<sub>10</sub>).</li>
</ul>
<p>Worked by hand: a 1-year claim, T<sub>RT</sub> = 25 &deg;C, T<sub>AA</sub> = 55 &deg;C and Q<sub>10</sub> = 2 give AAF = 2<sup>3</sup> = 8, so 365 / 8 = 45.6 days in the chamber. A Q<sub>10</sub> of 2 is the usual conservative choice; a higher value shortens the test and has to be justified with data on the actual materials.</p>

<h2>The Arrhenius option</h2>
<p>If the activation energy E<sub>a</sub> of the limiting degradation process is known, the factor is AAF = exp[(E<sub>a</sub>/k)(1/T<sub>RT</sub> &minus; 1/T<sub>AA</sub>)], with temperatures in kelvin and Boltzmann's constant k = 8.617&times;10<sup>&minus;5</sup> eV/K. Near room temperature a Q<sub>10</sub> of 2 matches an E<sub>a</sub> of roughly 0.55 eV. The Arrhenius form is no more accurate than the E<sub>a</sub> put into it.</p>

<h2>Limits of the method</h2>
<ul>
<li><b>Temperature.</b> Keep the chamber well below any material transition: the glass transition of a tray, the softening of an adhesive, the melt of a seal layer. F1980 cautions against temperatures above 60 &deg;C, because materials can change in ways they never would on a shelf.</li>
<li><b>Humidity</b> is not part of the model. Choose and justify it, and avoid condensation.</li>
<li><b>Real time wins.</b> Accelerated results support a claim only until real-time data exist. If real-time samples fail, the claim falls with them.</li>
<li><b>Not the whole test.</b> Aged samples still have to pass the seal strength, package integrity and device performance tests, often after distribution simulation (ASTM D4169).</li>
</ul>

<h2>On the exam</h2>
<p>CMDA IV.B.3 asks you to interpret the packaging standards, ISO 11607 and the referenced standards ASTM D4169 (distribution) and ASTM F1980 (aging). IV.B.4 asks you to explain how a device's useful life or shelf life is determined and which parameters limit it, such as sterility and package integrity (Understand). Expect to work an AAF and aging time from Q<sub>10</sub>, or to say why real-time aging must also be run.</p>
"""),
dict(slug="alert-action-levels", name="Alert and action levels",
covers="CMDA V.A, III.D.6",
title="Alert and Action Levels Calculator — Environmental Monitoring | SC Quality Guild",
desc="Free alert and action level calculator. Set levels from monitoring history by percentile, mean + k SD, Poisson or negative binomial; chart new results and flag trends.",
h1="Alert and action levels",
lede="Paste the history of a monitored count or measurement, such as cleanroom settle plates. Get alert and action levels four ways, then chart new results against them and see the excursions and adverse trends flagged.",
content="""
<h2>Levels below the limit</h2>
<p>A specification or regulatory limit says what is unacceptable. Waiting for a result to break it is too late, so monitoring programs set two levels of their own, below the limit, from the history of the area or system:</p>
<ul>
<li><b>Alert level:</b> a result above it is outside normal experience. It calls for attention, a check of the area and more frequent watching, but not necessarily a full investigation.</li>
<li><b>Action level:</b> a result above it calls for an investigation, an assessment of any product impact, and corrective action.</li>
</ul>
<p>They are used for environmental monitoring of cleanrooms (viable counts on settle plates, contact plates and air samples, and particle counts), for water systems, compressed gases and bioburden. Because they come from your own data, they tell you when your process has changed, long before it fails the limit.</p>

<h2>Four ways to set them</h2>
<ul>
<li><b>Percentile.</b> The 95th and 99th percentiles of the history: about one result in twenty is over the alert level in normal running. It assumes nothing about the distribution, but it needs plenty of data; the 99th percentile of 60 results rests on the top one or two.</li>
<li><b>Mean + k standard deviations</b>, usually k = 2 and 3. Fine for measurements that are roughly normal. Counts near zero are skewed, so the normal levels can mislead.</li>
<li><b>Poisson.</b> For counts of independent events, with the mean as &lambda;: the alert level is the smallest count c with P(X &le; c) of at least 95%. Real environmental counts are usually clumped, with a variance well above the mean, and then Poisson levels are too tight.</li>
<li><b>Negative binomial.</b> A count model that allows for the clumping. Fitted from the mean m and variance v by moments (r = m&sup2;/(v &minus; m), p = m/v), it usually gives the most sensible levels for microbial counts.</li>
</ul>
<p>Whichever is used, the levels must sit below the limit. If the statistics put the action level above the limit, the limit wins.</p>

<h2>Excursions and adverse trends</h2>
<p>A single result over a level is an excursion. A pattern can matter more than any single result:</p>
<ul>
<li>two or more consecutive alerts at the same location;</li>
<li>several alerts in a short period across the area;</li>
<li>more alerts than the level implies. With a 95th percentile alert level about 5% of results should exceed it; the tool gives the binomial chance of seeing as many as you did if nothing had changed;</li>
<li>a change in the organisms recovered, which only the laboratory can see.</li>
</ul>
<p>Use the levels like <a href="/calculators/control-chart.html">control limits</a>: they separate routine variation from a signal. Unlike control limits they are usually one-sided, and they are reviewed at least yearly.</p>

<h2>On the exam</h2>
<p>CMDA V.A lists setting alert and action levels among the quality control and problem-solving tools you must identify, interpret and analyze. CMDA III.D.6 covers production and process controls, including monitoring and control of the environment and contamination. Expect to choose an action for a result over an alert or action level, to recognize an adverse trend, or to say why levels must sit below the limit.</p>
"""),
]
