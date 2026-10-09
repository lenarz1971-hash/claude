"""CSSGB lean and voice-of-the-customer tools (agent f, set 3). Content dicts for build_one.py."""

PAGES4F3 = [
{
'slug': 'value-stream-map-takt',
'name': 'Value stream map and takt time',
'covers': 'CSSGB I.B.1, I.B.2',
'title': 'Value Stream Map and Takt Time Calculator, Free Template | SC Quality Guild',
'desc': 'Free value stream map tool. Enter demand, cycle times and inventory for takt time, inventory days, lead time, process cycle efficiency and a current-state map.',
'h1': 'Value stream map and takt time',
'lede': 'Enter the available time, customer demand and the data box for each process to get takt time, days of inventory, production lead time, process cycle efficiency and a drawn current-state map.',
'content': '''
<h2>What a value stream map shows</h2>
<p>A value stream map follows one product family from raw material to the customer and records both the material flow and the information flow. The current-state map is drawn from a walk of the floor, starting at shipping. Each <b>process box</b> carries a data box: cycle time (C/T), changeover time (C/O), uptime and the number of operators. <b>Inventory triangles</b> show the queue in front of each step. The conventions used here follow Rother and Shook's <i>Learning to See</i>.</p>
<h2>Takt time</h2>
<p><b>Takt time = available working time per period ÷ customer demand per period.</b> Available time excludes planned breaks and meetings but does not deduct unplanned downtime or changeovers; those show up as uptime and C/O on the data box. Takt is a pace set by the customer, not a measure of the process. Comparing each step's C/T with takt shows which steps cannot keep up (C/T over takt) and how many operators the work content needs if it were balanced: total C/T ÷ takt.</p>
<h2>The timeline and process cycle efficiency</h2>
<ul>
<li>Inventory is converted to <b>days of demand</b>: units in the triangle ÷ daily demand. This is Little's law: lead time = work in process ÷ completion rate.</li>
<li>The <b>production lead time</b> is the inventory days plus the processing time.</li>
<li><b>Process cycle efficiency (PCE) = value-added time ÷ total lead time</b>. A PCE well under 1 percent is normal for a batch-and-queue process. The point is not the exact figure but where the time goes: waiting in inventory.</li>
</ul>
<h2>Common traps</h2>
<ul>
<li>Mapping the whole plant instead of one product family.</li>
<li>Using design or standard cycle times instead of times observed on the floor.</li>
<li>Treating takt as a target for each operator rather than the customer's pace; a step under takt with poor uptime can still miss it.</li>
<li>Drawing a future state that only moves boxes; it should add flow, pull and a pacemaker. Use the <a href="/tools/eight-wastes-waste-walk.html">waste walk</a> to find the wastes and the <a href="/tools/kaizen-pdca-planner.html">kaizen planner</a> to run the improvements.</li>
</ul>
<h2>On the CSSGB exam</h2>
<p>Expect to compute takt time from shifts, breaks and demand, convert inventory to days, total a lead-time ladder, calculate PCE and identify the step whose cycle time exceeds takt. Know the standard icons: process box, data box, inventory triangle, push arrow, supermarket and the timeline.</p>
''',
},
{
'slug': 'smed-setup-reduction',
'name': 'SMED setup reduction',
'covers': 'CSSGB V.C.2',
'title': 'SMED Setup Reduction Worksheet — Internal vs External, Free | SC Quality Guild',
'desc': 'Free SMED worksheet. List setup elements, classify internal and external work, plan separate, convert and streamline steps, and see setup time before and after.',
'h1': 'SMED setup reduction',
'lede': 'List each setup element with its time, mark it internal or external now and after, name the SMED action, and get the before and after setup time, the reduction and a waterfall by stage.',
'content': '''
<h2>What SMED is</h2>
<p>Single-minute exchange of die (SMED) is Shigeo Shingo's method for cutting changeover time. "Single minute" means a single-digit number of minutes, under 10. Setup time runs from the last good piece of the old run to the first good piece of the new one. The method rests on one distinction: <b>internal</b> setup work can only be done with the machine stopped, and <b>external</b> work can be done while it is still running.</p>
<h2>The stages</h2>
<ul>
<li><b>Preliminary stage</b>: internal and external work are mixed together. Record the current changeover, ideally on video, and time every element.</li>
<li><b>Stage 1, separate</b>: move work that could already be done with the machine running (fetching tools, material and paperwork, preheating) outside the stop. Checklists and a staged changeover cart do most of this. Shingo estimated this stage alone often cuts setup time by 30 to 50 percent.</li>
<li><b>Stage 2, convert</b>: change how internal work is done so it becomes external: preset tools off line, duplicate fixtures, standardized die heights, a second pre-cleaned set of parts.</li>
<li><b>Stage 3, streamline</b>: make what remains faster: quick-release clamps instead of bolts, removing adjustments with fixed stops and recipes, parallel work by two people, and streamlining the external work too.</li>
</ul>
<h2>Reading the result</h2>
<p>The setup time that matters is the internal time, because it is lost production. External work does not disappear; it moves, and it has to be ready before the stop. Watch for elements that cannot move, such as a food safety line clearance, and keep them internal on purpose. The freed time pays off most when it is used for more frequent changeovers and smaller batches, which cuts inventory and lead time, not only for longer runs.</p>
<p>SMED is usually run as a <a href="/tools/kaizen-pdca-planner.html">kaizen event</a>. Waiting, motion and transport found during the study are the same wastes recorded on a <a href="/tools/eight-wastes-waste-walk.html">waste walk</a>.</p>
<h2>On the CSSGB exam</h2>
<p>Know the internal and external definitions, the order of the stages (separate, convert, streamline), examples of each, and why short setups support small lot sizes and flow. A typical question gives a list of setup tasks and asks which are external, or computes the new setup time after some are moved.</p>
''',
},
{
'slug': 'kano-model',
'name': 'Kano model',
'covers': 'CSSGB II.B.3',
'title': 'Kano Model Analysis — Questionnaire Evaluation and Better/Worse | SC Quality Guild',
'desc': 'Free Kano model tool. Enter functional and dysfunctional answers to classify features with the Kano evaluation table and plot better and worse coefficients.',
'h1': 'Kano model analysis',
'lede': 'Enter each respondent’s functional and dysfunctional answers for each feature to classify the features with the Kano evaluation table, count the categories and plot better and worse coefficients.',
'content': '''
<h2>The Kano categories</h2>
<p>Noriaki Kano's model says customer requirements do not all affect satisfaction the same way.</p>
<ul>
<li><b>Must-be</b> (basic, expected): absence causes strong dissatisfaction, presence is taken for granted.</li>
<li><b>One-dimensional</b> (performance): satisfaction rises with how well it is delivered. The more the better.</li>
<li><b>Attractive</b> (delighter, exciter): not expected, so absence causes no complaint, but presence delights.</li>
<li><b>Indifferent</b>: customers do not care either way. <b>Reverse</b>: customers would rather not have it. <b>Questionable</b>: the answers contradict each other.</li>
</ul>
<p>Categories drift over time: today's delighter becomes tomorrow's must-be.</p>
<h2>The questionnaire and the evaluation table</h2>
<p>Each feature gets a functional question (how do you feel if it is present?) and a dysfunctional question (how do you feel if it is absent?), each answered on the same five-point scale: like, must-be, neutral, live with, dislike. The pair is classified with the evaluation table published by Berger and colleagues in 1993, shown in the tool. Like with dislike gives One-dimensional, must-be, neutral or live with paired with dislike gives Must-be, and like paired with must-be, neutral or live with gives Attractive. Each feature's category is the most frequent one across respondents.</p>
<h2>Better and worse coefficients</h2>
<p>The customer satisfaction coefficients (Berger et al.; Timko) summarize a feature in two numbers, using only the A, O, M and I answers:</p>
<ul>
<li><b>Better = (A + O) ÷ (A + O + M + I)</b>, from 0 to 1: how much having it raises satisfaction.</li>
<li><b>Worse = −(O + M) ÷ (A + O + M + I)</b>, from 0 to −1: how much lacking it causes dissatisfaction.</li>
</ul>
<p>Plotting better against the absolute value of worse puts each feature in a quadrant and shows when a mode category hides a split.</p>
<h2>On the CSSGB exam</h2>
<p>Expect to classify a requirement from a description, match the curve shapes to the categories, and know that must-be needs are rarely voiced, so surveys and complaints miss them. Kano feeds the <a href="/tools/voc-ctq-tree.html">CTQ tree</a> and <a href="/tools/qfd-house-of-quality.html">QFD</a>.</p>
''',
},
]
