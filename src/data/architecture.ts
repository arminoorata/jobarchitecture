export type ArchitectureLayer = {
  label: string;
  example: string;
  explanation: string;
  managerQuestion: string;
};

export type GlossaryTerm = {
  term: string;
  plain: string;
  useWhen: string;
};

export type SourceNote = {
  label: string;
  href: string;
  note: string;
};

export const architectureLayers: ArchitectureLayer[] = [
  {
    label: "Function",
    example: "Engineering, Finance, Sales, People",
    explanation:
      "The broad area of work. Functions help leaders see how work clusters across the enterprise.",
    managerQuestion:
      "Which business capability does this role primarily strengthen?",
  },
  {
    label: "Job family",
    example: "Software Engineering, FP&A, Account Management",
    explanation:
      "A group of related jobs that use similar skills and career paths. Families keep job matching and career movement clean.",
    managerQuestion:
      "What work would this role benchmark against in the market?",
  },
  {
    label: "Career track",
    example: "Individual contributor, people manager, executive",
    explanation:
      "The path by which work increases in value. Strong architectures let experts grow without forcing them into management.",
    managerQuestion:
      "Does the role create leverage through expertise, people leadership, or enterprise strategy?",
  },
  {
    label: "Level",
    example: "P4 Advanced, M4 Senior Manager, E2 Regional VP",
    explanation:
      "The relative size of the role based on scope, complexity, autonomy, influence, knowledge, and impact.",
    managerQuestion:
      "What is the size of the job, independent of the current employee?",
  },
  {
    label: "Title",
    example: "Senior Software Engineer, Director of Finance",
    explanation:
      "The business-facing label. Titles should be consistent, but they should not be the primary evidence for level.",
    managerQuestion:
      "Would this title mean the same thing in a different business unit?",
  },
  {
    label: "Market match",
    example: "Radford McLagan survey job and level match",
    explanation:
      "The external comparison point used for market pricing. This is where licensed survey tools are strongest.",
    managerQuestion:
      "Which external survey role is closest in work, level, and talent market?",
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Job architecture",
    plain:
      "The structure that organizes work into functions, families, tracks, levels, and titles.",
    useWhen:
      "Use it when explaining how roles fit together before discussing pay.",
  },
  {
    term: "Job family",
    plain:
      "A group of jobs that use similar skills and follow related career paths.",
    useWhen:
      "Use it when choosing the right market match or career ladder.",
  },
  {
    term: "Level",
    plain:
      "The size of the job based on scope, complexity, autonomy, influence, knowledge, and impact.",
    useWhen:
      "Use it when deciding whether a role is entry, developing, proficient, advanced, expert, principal, or executive.",
  },
  {
    term: "Career track",
    plain:
      "The path by which work scales: individual contributor, people manager, or executive.",
    useWhen:
      "Use it when deciding whether growth comes through expertise, teams, or enterprise strategy.",
  },
  {
    term: "Benchmark job",
    plain:
      "The external survey role used to compare pay and market practice.",
    useWhen:
      "Use it after the internal job is clearly described and leveled.",
  },
  {
    term: "Calibration",
    plain:
      "A structured discussion that compares similar roles so level decisions are consistent.",
    useWhen:
      "Use it for borderline roles, promotion requests, reorganizations, and new job families.",
  },
  {
    term: "Incumbent",
    plain:
      "The person currently in the job.",
    useWhen:
      "Use it when separating employee performance from job size.",
  },
  {
    term: "Market pricing",
    plain:
      "Using external compensation data to understand pay for comparable jobs.",
    useWhen:
      "Use it after job matching and leveling, not as a substitute for them.",
  },
  {
    term: "Pay equity",
    plain:
      "Analyzing whether people in comparable work are paid fairly after accounting for legitimate factors.",
    useWhen:
      "Use it when connecting architecture to fairness, compliance, and trust.",
  },
  {
    term: "JobLink",
    plain:
      "Aon's proprietary job evaluation methodology, referenced here only as a licensed Aon offering.",
    useWhen:
      "Use it when pointing leaders toward Aon for formal methodology and consulting support.",
  },
  {
    term: "Calibration evidence",
    plain:
      "A description of the job, not the person, that supports placing the role at a level.",
    useWhen:
      "Use it during calibration sessions when separating leveling from performance, retention, or pay pressure.",
  },
  {
    term: "Boundary case",
    plain:
      "A role whose evidence sits within ±0.2 of an adjacent level threshold.",
    useWhen:
      "Use it when documenting why a role landed on one side of a level edge so future calibrations can reference the rationale.",
  },
  {
    term: "Track",
    plain:
      "The career path by which a role scales: individual contributor, people manager, or executive.",
    useWhen:
      "Use it when deciding whether a role's growth comes through expertise, teams, or strategy.",
  },
  {
    term: "Dual ladder",
    plain:
      "An architecture that gives parallel growth paths for IC and manager roles, with comparable seniority at equivalent levels.",
    useWhen:
      "Use it when a deep expert shouldn't be forced into management to keep advancing.",
  },
  {
    term: "Title inflation",
    plain:
      "The drift of titles upward without a corresponding change in scope, complexity, or impact.",
    useWhen:
      "Use it when explaining why a posted range or a new hire title looks off relative to the architecture.",
  },
];

export const sourceNotes: SourceNote[] = [
  {
    label: "Aon Job Architecture",
    href: "https://www.aon.com/en/capabilities/talent-and-rewards/job-architecture",
    note:
      "Public Aon material frames job architecture around functions, families, jobs, career levels, and titles, and connects it to compensation, career frameworks, pay equity, and pay transparency.",
  },
  {
    label: "Radford McLagan Compensation Database reporting features",
    href: "https://www.aon.com/en/capabilities/human-capital-analytics/radford-mclagan-compensation-database/reporting-features",
    note:
      "Aon describes the database as a major source of compensation data and tools for benchmarking, peer groups, job matching, employee-vs-market analysis, and executive regression.",
  },
  {
    label: "Radford McLagan Job Offers Data",
    href: "https://www.aon.com/en/capabilities/human-capital-analytics/radford-mclagan-compensation-database/job-offers-data",
    note:
      "Aon states that Job Offers Data and RMCD data use a consistent job architecture and leveling structure for apples-to-apples comparisons.",
  },
  {
    label: "Aon Compensation 101",
    href: "https://rewards.aon.com/en-us/insights/compensation-101/how-much-to-pay-rewards-program-design",
    note:
      "Aon explains why job levels, job families, survey participation, and job matching are critical Total Rewards skills.",
  },
];
