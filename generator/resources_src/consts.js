const SITE='';
const SS=['yb','gb','cssbb'], QQ=['cqia','cqi','cqt','cqpa','cqa','cqe','cmqoe'];
const CODE={yb:'CSSYB',gb:'CSSGB',cssbb:'CSSBB',cqia:'CQIA',cqi:'CQI',cqt:'CQT',cqpa:'CQPA',cqa:'CQA',cqe:'CQE',cmqoe:'CMQ/OE'};
const SHORT={yb:'Yellow Belt',gb:'Green Belt',cssbb:'Black Belt',cqia:'Improvement Assoc.',cqi:'Inspector',cqt:'Technician',cqpa:'Process Analyst',cqa:'Auditor',cqe:'Engineer',cmqoe:'Manager'};
const BANK={cqa:50,gb:50,yb:50,cqt:50,cqi:50,cqia:50,cqpa:50};
const BOOKS={cqa:['B0HHS83XSR','B0HHSBCBMK'],gb:['B0HHWPV2ZG','B0HHXJWX75'],yb:['B0HHYTG9PM','B0HHS8N9NF'],
             cqt:['B0HHSSWV2W','B0HHZGYPHR'],cqi:['B0HL54X3T9','B0HHZK1QXP']};
/* Calculator -> exams. */
const MAP={
  pareto:['yb','gb','cssbb','cqe','cqa','cqt','cqpa','cqia','cmqoe','cqi'],
  spc:['yb','gb','cssbb','cqe','cqa','cqi','cqt','cqpa','cqia','cmqoe'],
  constants:['gb','cssbb','cqe','cqi','cqt','cqpa'],
  capability:['gb','cssbb','cqe','cqa','cqi','cqt','cqpa','cqia','cmqoe'],
  sigma:['yb','gb','cssbb','cqe','cqpa','cmqoe'],
  yield:['yb','gb','cssbb','cqe','cqpa','cmqoe'],
  grr:['yb','gb','cssbb','cqe','cqi','cqt','cqpa','cmqoe'],
  grrcpk:['gb','cssbb','cqe','cqi','cqt'],
  linearity:['yb','gb','cssbb','cqe','cqi','cqt'],
  samplesize:['gb','cssbb','cqe','cqa','cqi','cqt','cqpa','cmqoe'],
  oc:['cssbb','cqe','cqa','cqi','cqt','cqpa'],
  hypothesis:['yb','gb','cssbb','cqe','cqpa']
};
const SIMS=[
  {id:'ql-2207',name:'QL-2207 · The Burr That Nobody Could See',desc:'A customer complaint where the paperwork says the system is healthy and the floor says otherwise. Containment due in 24 hours.'},
  {id:'gp-3318',name:'GP-3318 · Two Numbers That Cannot Both Be Right',desc:'Your capability study says Cpk 1.74. The customer measures 0.69 on the same part. Find out why.'}
];
const SIM_FOR=['yb','gb','cssbb','cqe','cqa','cqi','cqt','cqpa','cqia','cmqoe'];


/* Tool page -> exams whose Body of Knowledge it supports. */
const ALLX=['yb','gb','cssbb','cqia','cqi','cqt','cqpa','cqa','cqe','cmqoe'];
const TOOL_EX={
 'dmaic-roadmap':['yb','gb','cssbb','cqia','cqpa','cqe','cmqoe','cqa','cqi','cqt'],
 'six-sigma-roles-raci':['yb','gb','cssbb','cmqoe'],
 'team-development-stages':['yb','gb','cssbb','cqia','cqpa','cmqoe','cqa'],
 'multivoting-nominal-group-technique':['yb','gb','cssbb','cqia','cqpa','cmqoe'],
 'eight-wastes-waste-walk':['yb','gb','cssbb','cqia','cqpa','cqe','cmqoe','cqa','cqi','cqt'],
 'voc-ctq-tree':['yb','gb','cssbb','cqia','cqpa','cqe','cmqoe'],
 'project-selection-matrix':['yb','gb','cssbb','cmqoe'],
 'stakeholder-analysis':['yb','gb','cssbb','cmqoe'],
 'sipoc':['yb','gb','cssbb','cqia','cqpa','cqa','cmqoe'],
 'project-charter':['yb','gb','cssbb','cmqoe'],
 'communication-plan':['yb','gb','cssbb','cmqoe'],
 'wbs-gantt-chart':['yb','gb','cssbb','cqe','cmqoe'],
 'dmaic-phase-review-checklist':['yb','gb','cssbb'],
 'basic-statistics':['yb','gb','cssbb','cqia','cqi','cqt','cqpa','cqa','cqe','cmqoe'],
 'data-collection-plan':['yb','gb','cssbb','cqia','cqi','cqt','cqpa','cqa','cqe','cmqoe'],
 'msa-accuracy-precision':['yb','gb','cssbb','cqi','cqt','cqpa','cqe','cmqoe'],
 'fishbone-5-whys':ALLX,
 'fmea':['yb','gb','cssbb','cqt','cqpa','cqa','cqe','cmqoe','cqi'],
 'corrective-action-capa':ALLX,
 'distribution-explorer':['yb','gb','cssbb','cqi','cqt','cqpa','cqe','cmqoe','cqa'],
 'correlation-regression':['yb','gb','cssbb','cqpa','cqe','cqi','cqt','cqa'],
 'kaizen-pdca-planner':['yb','gb','cssbb','cqia','cqpa','cqe','cmqoe','cqa','cqi','cqt'],
 'cost-benefit-payback':['yb','gb','cssbb','cqe','cmqoe'],
 'control-plan':['yb','gb','cssbb','cqt','cqpa','cqe'],
 'work-instruction-sop':['yb','gb','cssbb','cqia','cqi','cqt','cqa','cmqoe'],
 'strategic-plan-builder':['cmqoe'],
 'swot-pestle-analysis':['cmqoe'],
 'hoshin-x-matrix':['cmqoe'],
 'balanced-scorecard':['cmqoe'],
 'change-management-plan':['cmqoe'],
 'ethics-compliance-decision-guide':['cqa','cmqoe','cqt'],
 'financial-analysis-npv-irr':['cmqoe'],
 'management-review':['cqa','cmqoe'],
 'lessons-learned-register':['cmqoe'],
 'cost-of-quality':['cqia','cqa','cmqoe','cqt','gb','cqi'],
 'constraints-oee':['cmqoe'],
 'customer-value-segmentation':['cmqoe'],
 'qfd-house-of-quality':['cssbb','cmqoe','gb'],
 'supplier-scorecard':['cqpa','cqa','cmqoe'],
 'training-needs-skills-matrix':['cqpa','cmqoe'],
 'training-plan-kirkpatrick':['cqpa','cmqoe'],
 'value-stream-map-takt':['gb','cssbb','cqa','cqi','cqt','cmqoe'],
 'kano-model':['gb','cssbb','cmqoe'],
 'confidence-interval-calculator':['gb','cssbb','cqe','cqpa','cqt'],
 'attribute-capability':['gb','cssbb','cqe'],
 'multi-vari-chart':['gb','cssbb'],
 't-test-calculator':['gb','cssbb','cqe','cqpa'],
 'chi-square-proportions-test':['gb','cssbb','cqe'],
 'one-way-anova':['gb','cssbb','cqe'],
 'full-factorial-doe':['gb','cssbb','cqe'],
 'smed-setup-reduction':['gb','cssbb','cmqoe'],
 'audit-plan-schedule':['cqa','cqt','cqi'],
 'process-audit-turtle-diagram':['cqa','cqt','cqi'],
 'audit-checklist-working-papers':['cqa','cqt','cqi'],
 'audit-sampling-plan':['cqa','cqt','cqi'],
 'audit-nonconformity-report':['cqa','cqt','cqi'],
 'audit-car-verification-tracker':['cqa','cqt','cqi'],
 'auditor-competence-evaluation':['cqa'],
 'audit-program-risk-schedule':['cqa'],
 'audit-program-metrics':['cqa'],
 'drawing-title-block-tolerance-reader':['cqi','cqt'],
 'gdt-position-tolerance':['cqi','cqt','cqe'],
 'tolerance-stack-up':['cqi','cqt','cqe'],
 'gauge-resolution-10-to-1':['cqi','cqt'],
 'cqt-measurement-uncertainty-budget':['cqt','cqi','cqe'],
 'sine-bar-height-gauge-record':['cqi','cqt'],
 'cqt-calibration-oot-impact':['cqt','cqi'],
 'calibration-interval-adjustment':['cqt','cqi'],
 'first-article-inspection':['cqi','cqt'],
 'attribute-inspection-defect-classification':['cqi','cqt'],
 'cqt-nonconforming-material-disposition':['cqt','cqi'],
 'cqt-reliability-mtbf-calculator':['cqe','cmqoe']
};
/* Tools beyond the Yellow Belt set, in hub order (filled in by build_resources.py from tools_content.GROUPS). */
const MQ_TOOLS=EXTRA_SLUGS;
