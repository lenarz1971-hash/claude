/* CSSYB 2022 BoK: 42 topics, transcribed in CSSYB_step0 / CSSYB_outline (Anthony's files). */
const YB_BOK=[
 {sec:'I',  title:'Six Sigma Fundamentals', q:20, topics:[
  ['I.A','Six Sigma foundations and principles'],['I.B','Lean foundations and principles'],['I.C','Six Sigma roles and responsibilities'],
  ['I.D.1','Types of teams'],['I.D.2','Stages of team development'],['I.D.3','Decision-making tools'],['I.D.4','Communication methods'],
  ['I.E.1','Quality tools'],['I.E.2','Six Sigma metrics (DPU, DPMO, RTY, COPQ)']]},
 {sec:'II', title:'Define Phase', q:14, topics:[
  ['II.A.1','Voice of the customer'],['II.A.2','Project selection'],['II.A.3','Stakeholder analysis'],['II.A.4','Process inputs and outputs (SIPOC)'],
  ['II.A.5','Supply chain management'],['II.B.1','Project charter'],['II.B.2','Communication plan'],['II.B.3','Project planning'],
  ['II.B.4','Project management tools'],['II.B.5','Phase reviews']]},
 {sec:'III',title:'Measure Phase', q:15, topics:[
  ['III.A','Basic statistics'],['III.B.1','Data collection plans'],['III.B.2','Qualitative and quantitative data'],
  ['III.B.3','Data collection techniques'],['III.C.1','Measurement system analysis terms'],['III.C.2','Gauge R&R']]},
 {sec:'IV', title:'Analyze Phase', q:17, topics:[
  ['IV.A.1','Lean tools'],['IV.A.2','Failure mode and effects analysis'],['IV.B','Root cause analysis'],['IV.C','Corrective action'],
  ['IV.D','Preventive action'],['IV.E.1','Basic distribution types'],['IV.E.2','Common and special cause variation'],
  ['IV.F.1','Correlation'],['IV.F.2','Regression'],['IV.G','Hypothesis testing']]},
 {sec:'V',  title:'Improve and Control Phases', q:14, topics:[
  ['V.A.1','Kaizen and kaizen blitz'],['V.A.2','Plan-Do-Check-Act'],['V.A.3','Cost-benefit analysis'],['V.B.1','Control plan'],
  ['V.B.2','Control charts'],['V.B.3','Document control'],['V.B.4','Work instructions and SOPs']]}
];

/* Planned resources (placeholders). Each names the YB topics it would serve. */
const PLANNED=[
 {id:'p-dmaic',  kind:'Explainer', name:'DMAIC at a glance', desc:'The five phases, what each produces and what its tollgate asks, on one page.', yb:['I.A']},
 {id:'p-waste',  kind:'Explainer', name:'Lean and the eight wastes', desc:'What lean targets that Six Sigma does not, with a waste spotter you can run on your own area.', yb:['I.B','IV.A.1']},
 {id:'p-roles',  kind:'Explainer', name:'Who does what on a Six Sigma project', desc:'Sponsor, champion, process owner and every belt, and where a Yellow Belt fits.', yb:['I.C']},
 {id:'p-teams',  kind:'Explainer', name:'Teams and how they develop', desc:'Team types, and the stages a team goes through over a project.', yb:['I.D.1','I.D.2']},
 {id:'p-decide', kind:'Tool',      name:'Multivoting and nominal group technique', desc:'Turn a brainstormed list into a ranked shortlist the team agrees on.', yb:['I.D.3']},
 {id:'p-voc',    kind:'Tool',      name:'Voice of the customer to CTQ tree', desc:'From what customers say to requirements you can measure.', yb:['II.A.1']},
 {id:'p-select', kind:'Tool',      name:'Project selection matrix', desc:'Score candidate projects against impact, effort and fit before committing.', yb:['II.A.2']},
 {id:'p-stake',  kind:'Template',  name:'Stakeholder analysis grid', desc:'Who can affect the project, how much, and what each needs from it.', yb:['II.A.3']},
 {id:'p-sipoc',  kind:'Tool',      name:'SIPOC builder', desc:'Suppliers, inputs, process, outputs and customers, drawn as you type.', yb:['II.A.4','II.A.5']},
 {id:'p-charter',kind:'Template',  name:'Project charter', desc:'Problem statement, scope, baseline, goal and team, in the order the work needs them.', yb:['II.B.1']},
 {id:'p-comms',  kind:'Template',  name:'Communication plan', desc:'Who hears what, how and how often, built from the stakeholder grid.', yb:['II.B.2','I.D.4']},
 {id:'p-wbs',    kind:'Tool',      name:'WBS and Gantt planner', desc:'Break the scope into work, then lay the work out against time.', yb:['II.B.3','II.B.4']},
 {id:'p-tollgate',kind:'Template', name:'Phase review checklist', desc:'What each DMAIC tollgate should be able to answer before moving on.', yb:['II.B.5']},
 {id:'p-stats',  kind:'Tool',      name:'Basic statistics calculator', desc:'Mean, median, mode, range and standard deviation, with what each tells you.', yb:['III.A']},
 {id:'p-dcp',    kind:'Template',  name:'Data collection plan and check sheet', desc:'Operational definitions, sources, method and frequency, then a check sheet to collect on.', yb:['III.B.1','III.B.2','III.B.3']},
 {id:'p-msa',    kind:'Explainer', name:'MSA terms, side by side', desc:'Accuracy, precision, bias, linearity and stability, shown on the same gauge.', yb:['III.C.1']},
 {id:'p-fmea',   kind:'Tool',      name:'FMEA worksheet', desc:'Failure modes, effects and causes, scored and ranked, with actions tracked.', yb:['IV.A.2']},
 {id:'p-rca',    kind:'Tool',      name:'5 Whys and fishbone builder', desc:'Work from a symptom to a cause you can act on, and draw it as you go.', yb:['IV.B']},
 {id:'p-capa',   kind:'Template',  name:'Corrective and preventive action form', desc:'Contain, find the cause, act, verify, and apply it before the next failure.', yb:['IV.C','IV.D']},
 {id:'p-dist',   kind:'Tool',      name:'Distribution shapes explorer', desc:'Normal, skewed, bimodal and more, and what each shape says about the process.', yb:['IV.E.1']},
 {id:'p-scatter',kind:'Tool',      name:'Correlation and regression', desc:'Plot x against y, get r and the fitted line, and read what it does and does not prove.', yb:['IV.F.1','IV.F.2']},
 {id:'p-kaizen', kind:'Template',  name:'Kaizen event and PDCA planner', desc:'Plan the blitz, make a prediction, run the cycle, check it against the prediction.', yb:['V.A.1','V.A.2']},
 {id:'p-cba',    kind:'Tool',      name:'Cost-benefit and payback calculator', desc:'Which candidate change is worth making, and how soon it pays for itself.', yb:['V.A.3']},
 {id:'p-cplan',  kind:'Template',  name:'Control plan', desc:'What is monitored, by what method, and what to do when it moves.', yb:['V.B.1']},
 {id:'p-docs',   kind:'Template',  name:'SOP, work instruction and document control', desc:'Write the instruction, then keep it current and communicated.', yb:['V.B.3','V.B.4']}
];

/* Live resources mapped to YB topics (live calculators + practice test + sims). */
const LIVE_YB={
 pareto:['I.E.1'], sigma:['I.E.2'], yield:['I.E.2'], grr:['III.C.2'], linearity:['III.C.1'],
 spc:['IV.E.2','V.B.2'], hypothesis:['IV.G'], sims:['IV.B','IV.C']
};

/* Batch 1 built 4 Oct 2026: planned id -> live /tools/ page */
const BUILT={'p-sipoc':'sipoc','p-charter':'project-charter','p-rca':'fishbone-5-whys','p-fmea':'fmea','p-cplan':'control-plan','p-stats':'basic-statistics','p-capa':'corrective-action-capa','p-dcp':'data-collection-plan',
 'p-dmaic':'dmaic-roadmap','p-waste':'eight-wastes-waste-walk','p-roles':'six-sigma-roles-raci','p-teams':'team-development-stages','p-decide':'multivoting-nominal-group-technique','p-voc':'voc-ctq-tree','p-select':'project-selection-matrix','p-stake':'stakeholder-analysis','p-comms':'communication-plan','p-wbs':'wbs-gantt-chart','p-tollgate':'dmaic-phase-review-checklist','p-msa':'msa-accuracy-precision','p-dist':'distribution-explorer','p-scatter':'correlation-regression','p-kaizen':'kaizen-pdca-planner','p-cba':'cost-benefit-payback','p-docs':'work-instruction-sop'};
