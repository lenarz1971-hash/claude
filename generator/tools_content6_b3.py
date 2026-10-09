# Lean and daily management tools, batch b3 (Oct 2026): kanban sizing, 5S/6S
# audit, error-proofing, standardized work combination sheet, heijunka and the
# spaghetti diagram. For CQE, CSSBB, CQPA, CSQP, CMDA and CCT.
PAGES6B3 = [
dict(slug="kanban-sizing-calculator", name="Kanban sizing calculator",
covers="CQE V.D.3, CQPA II.C.1, CSSBB VII.B.1, CSQP IV.A.3, CMDA V.B.3",
title="Kanban Calculator — Number of Kanbans, Free Online | SC Quality Guild",
desc="Free kanban calculator. Enter demand, lead time, safety factor and container size; get the number of kanbans, stock in the loop and days of cover.",
h1="Kanban sizing calculator",
lede="Enter each part's daily demand, replenishment lead time, safety factor and container quantity. Get the number of kanbans, the most stock the loop can hold and the days of cover it gives.",
content="""
<h2>What a kanban does</h2>
<p>A kanban is a signal to make or move more. In a pull system nothing is made until a customer, or the next process, uses something. When a container is emptied at the point of use, its card (or the empty container itself) goes back to the supplying process as the order to refill it. The number of cards in the loop caps the stock: when every card is attached to a full container, the supplying process stops.</p>
<p>That cap is why sizing matters. Too few kanbans and the user runs out while the next container is still being made. Too many and the loop holds stock that hides problems, which is what pull is meant to stop.</p>

<h2>The formula</h2>
<p>The usual formula is</p>
<p><b>N = D &times; L &times; (1 + &alpha;) &divide; C</b>, rounded up to a whole number,</p>
<ul>
<li><b>D</b> is the average demand per day;</li>
<li><b>L</b> is the replenishment lead time in days: the card waiting to be collected, the queue at the supplying process, the changeover and run, and the move back;</li>
<li><b>&alpha;</b> is the safety factor, a percentage that covers variation in demand and lead time;</li>
<li><b>C</b> is the number of parts in one container.</li>
</ul>
<p>D &times; L is the demand used up while one container is being refilled. The safety factor adds a margin, and dividing by C turns parts into containers. The result is rounded up, because a fraction of a card does not exist and rounding down guarantees a shortage. Some texts write the same idea as N = (D &times; L + safety stock) &divide; C.</p>

<h2>Reading the result</h2>
<ul>
<li><b>Max units in loop</b> = N &times; C. It is the stock if every container were full. In practice some are empty and on their way back, so the average on hand is lower.</li>
<li><b>Days of cover</b> = N &times; C &divide; D. It is how long the loop could feed the user if the supply stopped.</li>
<li>The chart splits each part's cover into lead-time demand, safety and rounding. A large gray block means the container is too big for the demand; a large gold block means the loop is carrying a lot of protection, usually for an unreliable process.</li>
</ul>

<h2>Making the loop smaller</h2>
<p>Every term in the formula is a lever. A shorter lead time, from quicker changeovers (<a href="/tools/smed-setup-reduction.html">SMED</a>), smaller batches or more frequent collection, cuts N directly. A steadier supplying process lets the safety factor come down. Smaller containers size the loop more closely. Lean practice is to set the loop to what the process can do today, then remove cards one at a time as the process improves, and watch what problem appears.</p>
<p>Recalculate when demand or lead time changes. A loop sized for last year's volume either starves the line or quietly builds stock. A leveled schedule, as in <a href="/tools/heijunka-leveling.html">heijunka</a>, keeps the daily demand on each loop steady.</p>

<h2>On the exam</h2>
<p>Kanban is one of the lean tools in the CQE Body of Knowledge (V.D.3). The CQPA lists pull, just-in-time and kanban among the lean tools (II.C.1), and the CSSBB includes pull systems and kanban under waste elimination (VII.B.1). The CSQP (IV.A.3) and CMDA (V.B.3) name kanban among the lean tools as well. Expect to calculate the number of kanbans from demand, lead time, safety factor and container size, to round up, and to explain what the number of cards controls.</p>
"""),

dict(slug="five-s-audit-scorecard", name="5S and 6S audit scorecard",
covers="CQE V.D.1, CQPA II.C.1, CSSBB VII.B.1, CSQP IV.A.3, CMDA V.B.3, CCT V.F.3",
title="5S Audit Checklist and Scorecard (6S with Safety) — Free | SC Quality Guild",
desc="Free 5S and 6S audit scorecard. Score each S against your own criteria, add the audit to a history, and see each area's trend against the target.",
h1="5S and 6S audit scorecard",
lede="Score each S against written criteria, 0 to 4. Get a score for each S and for the area, add the audit to the history, and watch each area's trend against the target.",
content="""
<h2>The five S, and the sixth</h2>
<ul>
<li><b>Sort</b> (seiri): remove what is not needed for the work. A red-tag area holds items nobody is sure about until someone decides.</li>
<li><b>Set in order</b> (seiton): a marked place for everything that is needed, close to where it is used, so anyone can see what is missing.</li>
<li><b>Shine</b> (seiso): clean, and inspect while cleaning. Cleaning is how leaks, wear and loose fasteners get found.</li>
<li><b>Standardize</b> (seiketsu): write down and show the standard for the first three, with photos, floor marking and checklists, so the area looks the same every day.</li>
<li><b>Sustain</b> (shitsuke): keep it up through habit, audits and leaders checking.</li>
<li><b>Safety</b>, the sixth S in many plants: guards, exits, labeling and hazards are checked in the same audit.</li>
</ul>

<h2>How the scoring works</h2>
<p>Each criterion is scored 0 to 4, from <i>not started</i> to <i>in place and kept up</i>. Each S is the average of its criteria, and the area's score gives each S equal weight, so an S with many criteria does not swamp one with few. The overall percentage is that average divided by 4.</p>
<p>Write criteria that two auditors would score the same way. "Only this week's dies are at the press" can be checked; "area is tidy" cannot. Two or three criteria per S give a steadier score than one.</p>

<h2>Reading the trend</h2>
<p>A single audit says where the area is. The history says whether 5S is working. The common pattern is a quick climb after a clean-up event, followed by a slow slide when the attention moves on. That slide shows up first in <b>Sustain</b>. When Sustain is the lowest S, the first four were done to the area rather than built into how it is run.</p>
<p>Keep the audit short and frequent, rotate auditors, and close the actions. An audit whose findings stay open teaches people that the audit does not matter.</p>

<h2>Safety is not averaged away</h2>
<p>In a 6S audit, a high overall score can hide a serious safety gap. The checks flag any safety criterion scored 0 or 1, whatever the total. Treat it as an action now.</p>

<h2>Where 5S fits</h2>
<p>5S is the foundation the other lean tools stand on. <a href="/tools/standardized-work-combination-sheet.html">Standardized work</a> needs tools in a fixed place; <a href="/tools/kanban-sizing-calculator.html">kanban</a> needs marked locations for full and empty containers; visual controls need a clean area to be seen in. A <a href="/tools/eight-wastes-waste-walk.html">waste walk</a> is a good way to find where to start.</p>

<h2>On the exam</h2>
<p>5S is a lean tool in the CQE (V.D.1), CQPA (II.C.1) and CSSBB (VII.B.1) Bodies of Knowledge, and the CSQP (IV.A.3) and CMDA (V.B.3) list it among the lean tools. The CCT applies 6S to housekeeping in the calibration environment (V.F.3). Expect to name the S in order, match an activity to its S, and explain why Sustain is the hardest.</p>
"""),

dict(slug="error-proofing-poka-yoke", name="Error-proofing (poka-yoke) worksheet",
covers="CQE V.F, CQPA II.C.1, V.B, CSSBB VII.B.1, CSQP IV.A.3, CMDA V.B.3",
title="Error-Proofing (Poka-Yoke) Worksheet — Free Online | SC Quality Guild",
desc="Free poka-yoke worksheet. List each error, the device, its approach, method and function; rank the devices by strength and check verification and effectiveness.",
h1="Error-proofing (poka-yoke) worksheet",
lede="List each error and the device that guards against it. The worksheet ranks the devices from designed out to caught downstream, and checks that each one is verified and actually works.",
content="""
<h2>What error-proofing is</h2>
<p>People make mistakes, however careful and well trained they are. Error-proofing, or poka-yoke, accepts that and designs the process so a mistake either cannot happen or cannot turn into a defect that reaches the customer. It is a preventive action: it works on the cause, not on finding the bad parts afterwards.</p>

<h2>The hierarchy of approaches</h2>
<ol>
<li><b>Eliminate.</b> Design the error out. The part is symmetrical, so it cannot go in backwards; the label is printed from the scanned model, so there is no wrong label to pick.</li>
<li><b>Prevent.</b> The error cannot be made: a fixture that accepts only the right part, a keyed connector.</li>
<li><b>Detect the error</b> before it becomes a defect: a sensor that sees the missing part before the press cycles.</li>
<li><b>Detect the defect at the station</b>, before it moves on: an in-station test that will not release a failed unit.</li>
<li><b>Detect the defect downstream</b>: inspection later in the process or at the customer. This is the weakest; the defect may be made many times before it is caught.</li>
</ol>
<p>Each device also has a <b>function</b>. A <b>control</b> stops the process until the problem is corrected. A <b>warning</b> (a light, a buzzer) relies on someone noticing and acting, every time. A control is stronger.</p>
<p>The strength score here combines the two, from 10 (designed out, stops the process) to 1 (caught downstream, warning only). It is a ranking aid, not a standard scale.</p>

<h2>The three methods</h2>
<ul>
<li><b>Contact:</b> the device senses shape, size, position or color. A locating pin, a limit switch, a vision check.</li>
<li><b>Fixed-value:</b> a set number of parts or moves must happen. A bin of four screws for a part that takes four; a counter on the torque tool.</li>
<li><b>Motion-step:</b> the steps must happen in the right order. A pick-to-light sequence; an interlock that will not start until the guard is closed.</li>
</ul>

<h2>Is it working?</h2>
<p>A device that is never tested can fail or be bypassed without anyone knowing. Each one needs a verification method, often a known-bad part tried at the start of the shift, and a record that it was done. Escapes before and after the device show whether it is effective. If a prevention device still lets errors through, look for a bypass or a second failure mode.</p>

<h2>Where it fits</h2>
<p>The errors usually come from a <a href="/tools/fmea.html">PFMEA</a>: high-severity failure modes with weak detection are the first candidates. A device that works is then recorded as the control method in the <a href="/tools/control-plan.html">control plan</a>, and the FMEA's occurrence or detection rating is updated.</p>

<h2>On the exam</h2>
<p>The CQE covers error-proofing and poka-yoke as preventive action, including analyzing their effectiveness (V.F). The CQPA lists poka-yoke among the lean tools (II.C.1) and error/mistake-proofing in preventive action (V.B). The CSSBB includes poka-yoke under waste elimination (VII.B.1), and the CSQP (IV.A.3) and CMDA (V.B.3) name error-proofing among the lean tools. Expect to tell prevention from detection, identify contact, fixed-value and motion-step devices, and choose the strongest approach for a given error.</p>
"""),

dict(slug="standardized-work-combination-sheet", name="Standardized work combination sheet",
covers="CQE V.D.6, V.D.7, CSSBB VII.B.1, CSQP IV.A.3, CMDA V.B.3",
title="Standardized Work Combination Sheet — Free Online Tool | SC Quality Guild",
desc="Free standardized work combination sheet. Enter manual, walk and machine time per element; see the chart against takt and where the operator waits.",
h1="Standardized work combination sheet",
lede="Enter each element of the operator's routine with its manual, walk and machine time. The chart lays them out against takt, and the checks show whether the station keeps pace and where people or machines wait.",
content="""
<h2>What the combination sheet shows</h2>
<p>Standardized work is the current best way to do a job, written down: the sequence of elements, the time each takes, and the stock needed to keep it flowing. The <b>combination sheet</b> (the standardized work combination table) is the part that shows how a person's work and the machines' work fit together over one cycle. It is the tool for designing work in a cell where one operator runs several machines.</p>

<h2>The three kinds of time</h2>
<ul>
<li><b>Manual:</b> hands-on time, including loading, unloading and starting a machine.</li>
<li><b>Walk:</b> moving to the next element. The last row's walk is the walk back to the start.</li>
<li><b>Machine:</b> automatic time after the machine is started, while the operator moves on.</li>
</ul>
<p>The operator's cycle is the sum of manual and walk time. Machine time runs in parallel with the rest of the routine.</p>

<h2>Takt and cycle time</h2>
<p><b>Takt time = available time &divide; customer demand.</b> With 440 available minutes and a demand of 330 units a shift, takt is 80 seconds: the station must finish one unit every 80 seconds. Takt comes from the customer; it is not a measure of the process. The <a href="/tools/value-stream-map-takt.html">value stream map</a> calculates it for the whole family.</p>
<p>A machine must finish its run before the operator comes back to it, one cycle later. If a machine's load time plus run time is longer than the operator's cycle, the operator waits at that machine. The station's cycle time is therefore the longer of the operator's cycle and the longest machine cycle. That is the number to compare with takt.</p>

<h2>Reading the chart</h2>
<ul>
<li><b>Cycle over takt:</b> the station cannot keep up. Rebalance work to a neighbor, cut walking, or reduce the machine time.</li>
<li><b>Cycle well under takt:</b> the operator has spare time every cycle. That is capacity to give the operator more machines or elements.</li>
<li><b>Operator waiting for a machine</b> is the waste to remove first. A machine that has finished and waits for the operator is normal in a lean cell; people are the scarcer resource.</li>
<li><b>A long walk</b> share points to the layout. Moving machines closer, often into a U shape, gives the time back. A <a href="/tools/spaghetti-diagram.html">spaghetti diagram</a> shows the path.</li>
</ul>
<p>Time each element several times and use the lowest repeatable time, not an average that includes interruptions. The interruptions are problems to solve, not part of the standard.</p>

<h2>On the exam</h2>
<p>Standardized work and takt time are lean tools in the CQE Body of Knowledge (V.D.6 and V.D.7). The CSSBB includes standard work under waste elimination (VII.B.1), the CSQP lists standardized work and takt time (IV.A.3), and the CMDA names standard operations among the lean tools (V.B.3). Expect to calculate takt time, compare cycle time with takt, and say what to do when a station is over takt.</p>
"""),

dict(slug="heijunka-leveling", name="Heijunka production leveling",
covers="CSSBB VII.B.2",
title="Heijunka Calculator — Level a Product Mix, Free Online | SC Quality Guild",
desc="Free heijunka calculator. Enter each product's demand; get daily quantities, the repeating mix pattern, takt or pitch, and a check against demand.",
h1="Heijunka production leveling",
lede="Enter each product's demand for the period. Get the daily quantities, the shortest repeating mix pattern, takt or pitch, the day-by-day plan, and a check that the pattern meets demand.",
content="""
<h2>What heijunka levels</h2>
<p>Heijunka is production leveling. It smooths two things:</p>
<ul>
<li><b>Volume:</b> the same total every day, rather than a light Monday and a heavy Friday.</li>
<li><b>Mix:</b> a little of every product every day, in a short repeating pattern, rather than all of A on Monday and all of B on Tuesday.</li>
</ul>
<p>Batching by product looks efficient because it cuts changeovers. But it makes the upstream processes and suppliers see huge swings: a week of demand for A's parts, then none. It also means a customer who wants B on Monday waits, or is served from stock. A leveled schedule lets every upstream <a href="/tools/kanban-sizing-calculator.html">kanban loop</a> run at a steady rate, with less stock.</p>

<h2>How the pattern is built</h2>
<ol>
<li><b>Daily quantity:</b> each product's period demand divided by the working days.</li>
<li><b>Pattern:</b> the daily quantities divided by their greatest common divisor. With 240 A, 120 B, 60 C and 60 D a day, the divisor is 60, so one pattern holds 4 A, 2 B, 1 C and 1 D: eight units, run 60 times a day.</li>
<li><b>Sequence:</b> the units in the pattern are spread as evenly as possible. At each position the tool places the product that is furthest behind its even share, which for this mix gives ABACDABA. This is a simple form of the goal-chasing method.</li>
<li><b>Takt:</b> available time divided by the total daily quantity. When leveling by containers, the same calculation gives the <b>pitch</b>: the time to make one container, which sets how often material is moved and how the slots of a heijunka box are spaced.</li>
</ol>
<p>When the daily quantities share no common divisor, the exact pattern is the whole day. Setting fewer repeats per day gives a shorter pattern with a small mismatch; the checks show it product by product, and the day-by-day table still meets the period demand exactly.</p>

<h2>What it needs</h2>
<p>Leveling the mix means more changeovers, so it depends on short setups (<a href="/tools/smed-setup-reduction.html">SMED</a>). It also needs some finished-goods stock to absorb the gap between the leveled schedule and daily orders. Products needed less than once a day are better run on fixed days than squeezed into the daily pattern.</p>

<h2>The heijunka box</h2>
<p>On the floor the pattern is often run with a heijunka box: a rack with a column for each pitch interval and a row for each product. Kanban cards are loaded in the pattern, and a material handler takes one column at each pitch, so the line is told what to make next in small, level steps.</p>

<h2>On the exam</h2>
<p>The CSSBB lists heijunka (production leveling) among the tools for cycle-time reduction, with continuous flow and SMED (VII.B.2). Expect to explain why leveling the mix helps the upstream processes, to work out a daily quantity and a repeating pattern from a product mix, and to relate takt and pitch.</p>
"""),

dict(slug="spaghetti-diagram", name="Spaghetti diagram",
covers="CSSBB V.A.2, CQPA II.C.1",
title="Spaghetti Diagram Maker — Walking Distance, Free Online | SC Quality Guild",
desc="Free spaghetti diagram maker. Place stations, enter the routes walked, and get the paths drawn with the distance per day, before and after a layout change.",
h1="Spaghetti diagram",
lede="Place the stations on the layout and enter each route as the stations visited in order. The diagram draws the paths and adds up the distance per day, for the current layout and a proposed one.",
content="""
<h2>What a spaghetti diagram is for</h2>
<p>A spaghetti diagram traces the actual path a person, a part or a document takes through an area. Drawn by hand on a floor plan while following someone through their work, the lines usually end up looking like a plate of spaghetti: crossing, doubling back and covering far more ground than anyone expected. It makes two of the lean wastes visible, <b>motion</b> (people walking and searching) and <b>transportation</b> (moving material).</p>

<h2>How to use this tool</h2>
<ol>
<li><b>Place the stations.</b> Give each a short code and a position, x across and y down, in feet or meters from one corner. A rough floor plan and a tape measure are enough.</li>
<li><b>Enter the routes.</b> List the stations visited in order, exactly as observed, with how many times a day the route is walked. Watch the real work rather than describing the procedure; the extra trips back to a printer or a supervisor's desk are the point.</li>
<li><b>Choose how distance is measured.</b> Along the aisles, at right angles, is closer to real walking in most plants and offices. Straight lines understate it.</li>
<li><b>Try a new layout.</b> Enter proposed positions for the stations that would move, and compare the daily distance.</li>
</ol>

<h2>Reading the diagram</h2>
<ul>
<li><b>Thick lines</b> are legs walked many times a day. The table of longest legs usually shows that a few pairs of stations account for most of the distance. Moving those closer together gives most of the gain.</li>
<li><b>Backtracking</b>, a return to a station already visited, usually means the stations are not in process order, or that something needed at one station is kept at another.</li>
<li><b>Crossing lines</b> mean people and material get in each other's way.</li>
</ul>
<p>Convert the distance into time and money: at a walking pace of about 3 miles an hour, each mile walked a day is 20 minutes of someone's shift.</p>

<h2>Where it fits</h2>
<p>The spaghetti diagram is a Measure-phase tool for seeing the current state, alongside the <a href="/tools/flowchart-swimlane.html">process map</a> and the <a href="/tools/value-stream-map-takt.html">value stream map</a>. It pairs naturally with a <a href="/tools/eight-wastes-waste-walk.html">waste walk</a> and feeds the layout changes that a <a href="/tools/standardized-work-combination-sheet.html">combination sheet</a> then confirms.</p>

<h2>On the exam</h2>
<p>The CSSBB lists spaghetti diagrams among the process analysis tools, with value stream maps, process maps and the gemba walk (V.A.2). The CQPA asks candidates to apply lean tools to reduce waste in cost, inventory, labor and distance (II.C.1). Expect to recognize a spaghetti diagram, say which wastes it reveals, and choose it over other process maps when the question is about movement.</p>
"""),
]
